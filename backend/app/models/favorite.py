from sqlalchemy import Column, Integer, ForeignKey
from app.models.base import Base
from sqlalchemy.orm import relationship

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    paste_id = Column(Integer, ForeignKey("pastes.id", ondelete="CASCADE"), nullable=False)
    
    user = relationship("User", backref="favorites")
    paste = relationship("Paste", backref="favorited_by")
