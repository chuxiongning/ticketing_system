"""
User schemas
"""
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    name: str
    role: str


class UserCreate(UserBase):
    """Schema for creating a user"""
    password: str


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """Schema for updating a user"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None


class UserResponse(UserBase):
    """Schema for user response"""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
