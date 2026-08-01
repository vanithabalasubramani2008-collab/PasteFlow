from sqlalchemy.orm import Session
from app.models.paste import Paste
from app.models.view import View
from app.models.favorite import Favorite
from typing import List, Optional

class PasteRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, paste_data: dict) -> Paste:
        paste = Paste(**paste_data)
        self.db.add(paste)
        self.db.commit()
        self.db.refresh(paste)
        return paste

    def get_by_id(self, paste_id: int) -> Optional[Paste]:
        return self.db.query(Paste).filter(Paste.id == paste_id).first()

    def _apply_filters(self, query, search: Optional[str], language: Optional[str], tags: Optional[str]):
        if search:
            query = query.filter(Paste.title.ilike(f"%{search}%"))
        if language:
            query = query.filter(Paste.language == language)
        if tags:
            for tag in tags.split(","):
                query = query.filter(Paste.tags.ilike(f"%{tag.strip()}%"))
        return query

    def get_public_pastes(self, skip: int = 0, limit: int = 10, search: str = None, language: str = None, tags: str = None) -> List[Paste]:
        query = self.db.query(Paste).filter(Paste.visibility == "public")
        query = self._apply_filters(query, search, language, tags)
        return query.order_by(Paste.created_at.desc()).offset(skip).limit(limit).all()

    def get_by_owner_id(self, owner_id: int, skip: int = 0, limit: int = 10, search: str = None, language: str = None, tags: str = None) -> List[Paste]:
        query = self.db.query(Paste).filter(Paste.owner_id == owner_id)
        query = self._apply_filters(query, search, language, tags)
        return query.order_by(Paste.created_at.desc()).offset(skip).limit(limit).all()

    def update(self, paste: Paste, update_data: dict) -> Paste:
        for key, value in update_data.items():
            setattr(paste, key, value)
        self.db.commit()
        self.db.refresh(paste)
        return paste

    def increment_views(self, paste: Paste):
        paste.views += 1
        new_view = View(paste_id=paste.id)
        self.db.add(new_view)
        self.db.commit()

    def toggle_favorite(self, paste_id: int, user_id: int) -> bool:
        favorite = self.db.query(Favorite).filter(Favorite.paste_id == paste_id, Favorite.user_id == user_id).first()
        if favorite:
            self.db.delete(favorite)
            self.db.commit()
            return False # Unfavorited
        else:
            new_favorite = Favorite(paste_id=paste_id, user_id=user_id)
            self.db.add(new_favorite)
            self.db.commit()
            return True # Favorited

    def delete(self, paste: Paste):
        self.db.delete(paste)
        self.db.commit()
