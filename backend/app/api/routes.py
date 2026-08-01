from fastapi import APIRouter
from app.api import auth, pastes, search, stats

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(pastes.router, prefix="/pastes", tags=["pastes"])
router.include_router(search.router, prefix="/search", tags=["search"])
router.include_router(stats.router, prefix="/stats", tags=["stats"])
