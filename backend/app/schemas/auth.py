"""
Authentication schemas
"""
from pydantic import BaseModel
from .user import UserResponse


class Token(BaseModel):
    """Schema for token response"""
    user: UserResponse
    token: str
