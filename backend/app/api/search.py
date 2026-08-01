from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.paste import Paste
from app.schemas.paste import PasteResponse
from typing import List, Optional

router = APIRouter()

@router.get("/", response_model=List[PasteResponse])
def search_pastes(
    q: Optional[str] = None,
    language: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Paste).filter(Paste.visibility == "public")
    if q:
        query = query.filter(Paste.title.ilike(f"%{q}%"))
    if language:
        query = query.filter(Paste.language == language)
        
    pastes = query.limit(50).all()
    for p in pastes:
        setattr(p, "has_password", bool(p.password_hash))
    return pastes
