from fastapi import APIRouter, Depends, HTTPException, Query, status, Request
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.paste import PasteCreate, PasteUpdate, PasteResponse, PasteDetailResponse
from typing import List, Optional
from app.api.deps import get_current_user, get_current_user_optional
from app.models.user import User
from app.services.paste_service import PasteService
from app.core.limiter import limiter

router = APIRouter()

@router.post("", response_model=PasteResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("30/minute")
def create_paste(
    request: Request,
    paste_in: PasteCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    service = PasteService(db)
    return service.create_paste(paste_in, current_user)

@router.get("", response_model=List[PasteResponse])
def get_pastes(
    skip: int = Query(0, ge=0), 
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    tags: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    service = PasteService(db)
    return service.get_public_pastes(skip, limit, search, language, tags)

@router.get("/my", response_model=List[PasteResponse])
def get_my_pastes(
    skip: int = Query(0, ge=0), 
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    tags: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = PasteService(db)
    return service.get_user_pastes(current_user, skip, limit, search, language, tags)

@router.get("/{paste_id}", response_model=PasteDetailResponse)
def get_paste(
    paste_id: int, 
    password: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    service = PasteService(db)
    return service.get_paste(paste_id, current_user, password)

@router.delete("/{paste_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_paste(paste_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = PasteService(db)
    service.delete_paste(paste_id, current_user)
    return None

@router.put("/{paste_id}", response_model=PasteResponse)
def update_paste(
    paste_id: int,
    paste_update: PasteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = PasteService(db)
    return service.update_paste(paste_id, paste_update, current_user)

@router.post("/{paste_id}/favorite", status_code=status.HTTP_200_OK)
def toggle_favorite(paste_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = PasteService(db)
    is_favorited = service.toggle_favorite(paste_id, current_user)
    return {"success": True, "favorited": is_favorited}
