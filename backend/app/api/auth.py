from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.api.deps import get_current_user
from app.schemas.user import UserCreate, UserResponse, Token, GoogleAuthRequest
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.core.limiter import limiter

router = APIRouter()

@router.post("/register", response_model=UserResponse)
@limiter.limit("5/minute")
def register(request: Request, user_in: UserCreate, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == user_in.email).first()
        if user:
            raise HTTPException(
                status_code=400,
                detail="A user with this email already exists."
            )
        
        user = User(
            email=user_in.email,
            password_hash=get_password_hash(user_in.password),
            name=user_in.name,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Registration error: {str(e)}")

@router.post("/login", response_model=Token)
@limiter.limit("10/minute")
def login(request: Request, db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import uuid

@router.post("/google", response_model=Token)
@limiter.limit("10/minute")
def google_auth(request: Request, data: GoogleAuthRequest, db: Session = Depends(get_db)):
    try:
        if not settings.GOOGLE_CLIENT_ID:
            raise HTTPException(status_code=500, detail="Google Client ID not configured on server")
            
        import requests
        # We receive an access token from the frontend (starts with ya29.)
        # We need to fetch the user's profile from Google's userinfo endpoint
        response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {data.token}"}
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google access token")
            
        userinfo = response.json()
        
        email = userinfo.get("email")
        name = userinfo.get("name", "Google User")
        
        if not email:
            raise HTTPException(status_code=400, detail="No email provided by Google")
            
        user = db.query(User).filter(User.email == email).first()
        if not user:
            import secrets
            # Create user with a random secure password
            user = User(
                email=email,
                name=name,
                password_hash=get_password_hash(secrets.token_hex(32)[:72])
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return {
            "access_token": create_access_token(
                user.id, expires_delta=access_token_expires
            ),
            "token_type": "bearer",
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {str(e)}")

@router.post("/logout")
def logout():
    # Since we use stateless JWT, logout is handled client-side by deleting the token.
    # We provide this endpoint for API completeness and future expansion (e.g. token blacklisting).
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get current user.
    """
    return current_user
