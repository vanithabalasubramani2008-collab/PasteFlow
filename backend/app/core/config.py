import os
from typing import List, Union, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "PasteFlow API"
    API_V1_STR: str = "/api/v1"
    
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super_secret_jwt_key")
    JWT_REFRESH_SECRET: str = os.getenv("JWT_REFRESH_SECRET", "super_secret_refresh_key")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    
    BACKEND_CORS_ORIGINS: List[str] = [os.getenv("CORS_ORIGIN", "http://localhost:3000"), "http://localhost"]
    
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://pasteflow_user:pasteflow_pass@postgres:5432/pasteflow_db"
    )

    model_config = SettingsConfigDict(case_sensitive=True)

settings = Settings()
