"""
Comment model
"""
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from datetime import datetime

from ..core.database import Base


class Comment(Base):
    """Comment model"""
    __tablename__ = "comments"

    id = Column(String, primary_key=True, index=True)
    ticket_id = Column(String, ForeignKey("tickets.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    user_name = Column(String)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
