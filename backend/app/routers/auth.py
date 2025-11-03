"""
Authentication routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid

from ..core.database import get_db
from ..core.security import verify_password, get_password_hash, create_access_token
from ..models.user import User
from ..schemas.auth import Token
from ..schemas.user import UserLogin, UserCreate, UserResponse


router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return access token
    """
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Create access token
    access_token = create_access_token(data={"sub": user.id})

    # Return user and token
    return Token(
        user=UserResponse.model_validate(user),
        token=access_token
    )


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new user
    new_user = User(
        id=str(uuid.uuid4()),
        name=user_data.name,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        role=user_data.role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create access token
    access_token = create_access_token(data={"sub": new_user.id})

    return Token(
        user=UserResponse.model_validate(new_user),
        token=access_token
    )


@router.post("/logout")
async def logout():
    """
    Logout user (client should remove token)
    """
    return {"message": "Successfully logged out"}
