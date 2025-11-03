"""
User routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..core.database import get_db
from ..core.security import get_current_user_id, get_password_hash
from ..models.user import User
from ..schemas.user import UserResponse, UserUpdate


router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=List[UserResponse])
async def get_all_users(
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Get all users
    """
    users = db.query(User).all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Get user by ID
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Update user profile
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Update fields
    update_data = user_data.model_dump(exclude_unset=True)

    # Handle password separately (needs hashing)
    if 'password' in update_data:
        password = update_data.pop('password')
        user.hashed_password = get_password_hash(password)

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return user
