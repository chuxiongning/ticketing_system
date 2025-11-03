"""
Ticket schemas
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any


class TicketBase(BaseModel):
    """Base ticket schema"""
    title: str
    description: Optional[str] = None
    template_id: str
    priority: str = "medium"
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None


class TicketCreate(TicketBase):
    """Schema for creating a ticket"""
    pass


class TicketUpdate(BaseModel):
    """Schema for updating a ticket"""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None
    completed_steps: Optional[List[str]] = None
    step_data: Optional[Dict[str, Any]] = None


class TicketAccept(BaseModel):
    """Schema for accepting a ticket"""
    comment: Optional[str] = None


class TicketDecline(BaseModel):
    """Schema for declining a ticket"""
    reason: str


class TicketCancel(BaseModel):
    """Schema for cancelling a ticket"""
    reason: str


class TicketResponse(TicketBase):
    """Schema for ticket response"""
    id: str
    template_name: Optional[str] = None
    status: str
    assigned_to_name: Optional[str] = None
    created_by: str
    created_by_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    completed_steps: List[str] = []
    step_data: Dict[str, Any] = {}
    accepted: bool = False
    accepted_at: Optional[datetime] = None
    declined_reason: Optional[str] = None
    cancelled_reason: Optional[str] = None

    class Config:
        from_attributes = True
