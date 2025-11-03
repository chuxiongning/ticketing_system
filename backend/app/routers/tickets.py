"""
Ticket routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from ..core.database import get_db
from ..core.security import get_current_user_id
from ..models.ticket import Ticket
from ..models.user import User
from ..models.template import Template
from ..schemas.ticket import (
    TicketCreate,
    TicketUpdate,
    TicketResponse,
    TicketAccept,
    TicketDecline,
    TicketCancel
)


router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.get("", response_model=List[TicketResponse])
async def get_all_tickets(
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Get all tickets
    """
    tickets = db.query(Ticket).all()
    return tickets


@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Get ticket by ID
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    return ticket


@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Create a new ticket
    """
    # Get creator info
    creator = db.query(User).filter(User.id == current_user_id).first()
    if not creator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Get template info
    template = db.query(Template).filter(Template.id == ticket_data.template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )

    # Get assigned user info if provided
    assigned_to_name = None
    if ticket_data.assigned_to:
        assigned_user = db.query(User).filter(User.id == ticket_data.assigned_to).first()
        if assigned_user:
            assigned_to_name = assigned_user.name

    # Create ticket
    new_ticket = Ticket(
        id=f"T{uuid.uuid4().hex[:8].upper()}",
        title=ticket_data.title,
        description=ticket_data.description,
        template_id=ticket_data.template_id,
        template_name=template.name,
        status="assigned" if ticket_data.assigned_to else "new",
        priority=ticket_data.priority,
        assigned_to=ticket_data.assigned_to,
        assigned_to_name=assigned_to_name,
        created_by=current_user_id,
        created_by_name=creator.name,
        due_date=ticket_data.due_date,
        completed_steps=[],
        step_data={}
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return new_ticket


@router.put("/{ticket_id}", response_model=TicketResponse)
async def update_ticket(
    ticket_id: str,
    ticket_data: TicketUpdate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Update a ticket
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    # Update fields
    update_data = ticket_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ticket, field, value)

    ticket.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(ticket)

    return ticket


@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Delete a ticket
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    db.delete(ticket)
    db.commit()

    return None


@router.post("/{ticket_id}/accept", response_model=TicketResponse)
async def accept_ticket(
    ticket_id: str,
    accept_data: TicketAccept,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Accept a ticket
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    ticket.accepted = True
    ticket.accepted_at = datetime.utcnow()
    ticket.status = "inProgress"
    ticket.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(ticket)

    return ticket


@router.post("/{ticket_id}/decline", response_model=TicketResponse)
async def decline_ticket(
    ticket_id: str,
    decline_data: TicketDecline,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Decline a ticket
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    ticket.status = "declined"
    ticket.declined_reason = decline_data.reason
    ticket.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(ticket)

    return ticket


@router.post("/{ticket_id}/cancel", response_model=TicketResponse)
async def cancel_ticket(
    ticket_id: str,
    cancel_data: TicketCancel,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Cancel a ticket
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    ticket.status = "cancelled"
    ticket.cancelled_reason = cancel_data.reason
    ticket.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(ticket)

    return ticket
