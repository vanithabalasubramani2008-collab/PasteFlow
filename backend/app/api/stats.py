from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.paste import Paste
from app.models.user import User
from app.models.view import View
from app.schemas.stats import SystemStats

router = APIRouter()

@router.get("/", response_model=SystemStats)
def get_system_stats(db: Session = Depends(get_db)):
    total_pastes = db.query(Paste).count()
    total_users = db.query(User).count()
    total_views = db.query(View).count()
    
    return {
        "total_pastes": total_pastes,
        "total_users": total_users,
        "total_views": total_views,
    }
