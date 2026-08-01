from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

class PasteBase(BaseModel):
    content: str
    title: Optional[str] = None
    description: Optional[str] = None
    language: str = "text"
    visibility: str = "public"
    expires_at: Optional[datetime] = None
    tags: Optional[str] = None

class PasteCreate(PasteBase):
    password: Optional[str] = None
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "Hello World Script",
                "content": "print('Hello, World!')",
                "language": "python",
                "visibility": "public",
                "tags": "python,hello"
            }
        }
    )

class PasteUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    language: Optional[str] = None
    visibility: Optional[str] = None
    tags: Optional[str] = None

class PasteResponse(BaseModel):
    id: int
    content: str
    views: int
    downloads: int
    created_at: datetime
    owner_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    language: str = "text"
    visibility: str = "public"
    expires_at: Optional[datetime] = None
    tags: Optional[str] = None
    updated_at: Optional[datetime] = None
    has_password: bool = False

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "title": "Hello World Script",
                "content": "print('Hello, World!')",
                "language": "python",
                "visibility": "public",
                "views": 42,
                "downloads": 0,
                "created_at": "2024-01-01T12:00:00Z",
                "owner_id": 1,
                "has_password": False,
                "tags": "python,hello"
            }
        }
    )

class PasteDetailResponse(PasteResponse):
    pass



