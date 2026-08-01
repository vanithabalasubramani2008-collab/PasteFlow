from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import router as api_router
from app.core.logger import logger
from fastapi.responses import JSONResponse
from fastapi import Request, status
import time
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.limiter import limiter


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.middleware("http")
async def global_exception_handler(request: Request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(f"Request: {request.method} {request.url.path} - Status: {response.status_code} - Time: {process_time:.4f}s")
        return response
    except Exception as exc:
        process_time = time.time() - start_time
        logger.error(f"Unhandled Exception: {request.method} {request.url.path} - {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal server error occurred."}
        )

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

import asyncio
from app.core.tasks import auto_delete_expired_pastes
from app.database.session import engine
from app.models.base import Base

@app.on_event("startup")
async def startup_event():
    logger.info("Application startup beginning")
    Base.metadata.create_all(bind=engine)
    
    # Ensure indexes are created for newly added model fields
    db = SessionLocal()
    try:
        db.execute(text("CREATE INDEX IF NOT EXISTS ix_pastes_language ON pastes (language);"))
        db.execute(text("CREATE INDEX IF NOT EXISTS ix_pastes_visibility ON pastes (visibility);"))
        db.execute(text("CREATE INDEX IF NOT EXISTS ix_pastes_owner_id ON pastes (owner_id);"))
        db.execute(text("CREATE INDEX IF NOT EXISTS ix_pastes_tags ON pastes (tags);"))
        db.commit()
    except Exception as e:
        logger.error(f"Failed to create indexes: {e}")
    finally:
        db.close()
        
    asyncio.create_task(auto_delete_expired_pastes())
    app.state.startup_time = time.time()
    logger.info("Application startup complete")

from sqlalchemy import text
from app.database.session import SessionLocal

@app.get("/health")
def health_check():
    uptime = time.time() - getattr(app.state, "startup_time", time.time())
    db_status = "disconnected"
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        logger.error(f"Health check DB error: {str(e)}")
    finally:
        db.close()
        
    return {
        "status": "healthy" if db_status == "connected" else "degraded", 
        "database": db_status, 
        "uptime_seconds": round(uptime, 2)
    }
