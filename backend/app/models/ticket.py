"""
Ticket model
"""
from sqlalchemy import Column, String, DateTime, Boolean, JSON, ForeignKey, Text
from datetime import datetime

from ..core.database import Base


class Ticket(Base):
    """Ticket model"""
    __tablename__ = "tickets"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    template_id = Column(String, ForeignKey("templates.id"), nullable=False)
    template_name = Column(String)
    status = Column(String, nullable=False, default="new")  # new, assigned, inProgress, done, declined, cancelled
    priority = Column(String, nullable=False, default="medium")  # low, medium, high, urgent
    assigned_to = Column(String, ForeignKey("users.id"))
    assigned_to_name = Column(String)
    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    created_by_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    due_date = Column(DateTime)
    completed_steps = Column(JSON, default=[])  # List of completed step IDs
    step_data = Column(JSON, default={})  # Data for each step's fields
    accepted = Column(Boolean, default=False)
    accepted_at = Column(DateTime, nullable=True)
    declined_reason = Column(Text, nullable=True)
    cancelled_reason = Column(Text, nullable=True)
