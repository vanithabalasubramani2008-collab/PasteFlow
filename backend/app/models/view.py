from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.models.base import Base

class View(Base):
    __tablename__ = "views"

    id = Column(Integer, primary_key=True, index=True)
    paste_id = Column(Integer, ForeignKey("pastes.id", ondelete="CASCADE"), nullable=False)
    visitor_ip = Column(String, nullable=True)
    country = Column(String, nullable=True)
    viewed_at = Column(DateTime(timezone=True), server_default=func.now())
