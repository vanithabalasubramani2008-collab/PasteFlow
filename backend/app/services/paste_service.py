from sqlalchemy.orm import Session
from app.repositories.paste_repo import PasteRepository
from app.schemas.paste import PasteCreate, PasteUpdate
from app.core.security import get_password_hash, verify_password
from fastapi import HTTPException
from app.models.user import User

class PasteService:
    def __init__(self, db: Session):
        self.repo = PasteRepository(db)

    def create_paste(self, paste_in: PasteCreate, current_user: User = None):
        paste_data = paste_in.model_dump(exclude={"password"})
        if paste_in.password:
            paste_data["password_hash"] = get_password_hash(paste_in.password)
        
        paste_data["owner_id"] = current_user.id if current_user else None
        paste = self.repo.create(paste_data)
        setattr(paste, "has_password", bool(paste.password_hash))
        return paste

    def get_public_pastes(self, skip: int = 0, limit: int = 10, search: str = None, language: str = None, tags: str = None):
        return self.repo.get_public_pastes(skip, limit, search, language, tags)

    def get_user_pastes(self, current_user: User, skip: int = 0, limit: int = 10, search: str = None, language: str = None, tags: str = None):
        pastes = self.repo.get_by_owner_id(current_user.id, skip, limit, search, language, tags)
        for p in pastes:
            setattr(p, "has_password", bool(p.password_hash))
        return pastes

    def get_paste(self, paste_id: int, current_user: User = None, provided_password: str = None):
        paste = self.repo.get_by_id(paste_id)
        if not paste:
            raise HTTPException(status_code=404, detail="Paste not found")
        
        # Privacy check
        if paste.visibility == "private":
            if not current_user or paste.owner_id != current_user.id:
                raise HTTPException(status_code=403, detail="Not authorized to view this private paste")
                
        # Password check (if it's not the owner)
        if paste.password_hash and (not current_user or paste.owner_id != current_user.id):
            if not provided_password:
                # Return paste metadata but strip content
                paste.content = "PASSWORD_PROTECTED"
            else:
                if not verify_password(provided_password, paste.password_hash):
                    raise HTTPException(status_code=401, detail="Invalid password")
                    
        self.repo.increment_views(paste)
        setattr(paste, "has_password", bool(paste.password_hash))
        return paste

    def delete_paste(self, paste_id: int, current_user: User):
        paste = self.repo.get_by_id(paste_id)
        if not paste:
            raise HTTPException(status_code=404, detail="Paste not found")
        if paste.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
            
        self.repo.delete(paste)

    def update_paste(self, paste_id: int, update_data: PasteUpdate, current_user: User):
        paste = self.repo.get_by_id(paste_id)
        if not paste:
            raise HTTPException(status_code=404, detail="Paste not found")
        if paste.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        data = update_data.model_dump(exclude_unset=True)
        return self.repo.update(paste, data)

    def toggle_favorite(self, paste_id: int, current_user: User):
        paste = self.repo.get_by_id(paste_id)
        if not paste:
            raise HTTPException(status_code=404, detail="Paste not found")
        return self.repo.toggle_favorite(paste_id, current_user.id)
