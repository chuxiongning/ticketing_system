"""
Template routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from ..core.database import get_db
from ..core.security import get_current_user_id
from ..models.template import Template, TemplateStep, TemplateField
from ..schemas.template import TemplateCreate, TemplateUpdate, TemplateResponse


router = APIRouter(prefix="/templates", tags=["templates"])


@router.get("", response_model=List[TemplateResponse])
async def get_all_templates(
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Get all templates
    """
    templates = db.query(Template).all()
    return templates


@router.get("/{template_id}", response_model=TemplateResponse)
async def get_template(
    template_id: str,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Get template by ID
    """
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )
    return template


@router.post("", response_model=TemplateResponse, status_code=status.HTTP_201_CREATED)
async def create_template(
    template_data: TemplateCreate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Create a new template
    """
    # Create template
    new_template = Template(
        id=f"TPL{uuid.uuid4().hex[:8].upper()}",
        name=template_data.name,
        description=template_data.description,
    )

    db.add(new_template)
    db.flush()  # Flush to get the template ID

    # Create steps
    for step_data in template_data.steps:
        new_step = TemplateStep(
            id=f"STEP{uuid.uuid4().hex[:8].upper()}",
            template_id=new_template.id,
            name=step_data.name,
            description=step_data.description,
            order=step_data.order,
        )
        db.add(new_step)
        db.flush()  # Flush to get the step ID

        # Create fields for this step
        for field_data in step_data.fields:
            new_field = TemplateField(
                id=f"FIELD{uuid.uuid4().hex[:8].upper()}",
                step_id=new_step.id,
                name=field_data.name,
                type=field_data.type,
                required=field_data.required,
                order=field_data.order,
            )
            db.add(new_field)

    db.commit()
    db.refresh(new_template)

    return new_template


@router.put("/{template_id}", response_model=TemplateResponse)
async def update_template(
    template_id: str,
    template_data: TemplateUpdate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Update a template
    """
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )

    # Update basic fields
    if template_data.name is not None:
        template.name = template_data.name
    if template_data.description is not None:
        template.description = template_data.description

    # Update steps if provided
    if template_data.steps is not None:
        # Delete existing steps
        db.query(TemplateStep).filter(TemplateStep.template_id == template_id).delete()

        # Create new steps
        for step_data in template_data.steps:
            new_step = TemplateStep(
                id=f"STEP{uuid.uuid4().hex[:8].upper()}",
                template_id=template.id,
                name=step_data.name,
                description=step_data.description,
                order=step_data.order,
            )
            db.add(new_step)
            db.flush()

            # Create fields for this step
            for field_data in step_data.fields:
                new_field = TemplateField(
                    id=f"FIELD{uuid.uuid4().hex[:8].upper()}",
                    step_id=new_step.id,
                    name=field_data.name,
                    type=field_data.type,
                    required=field_data.required,
                    order=field_data.order,
                )
                db.add(new_field)

    db.commit()
    db.refresh(template)

    return template


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(
    template_id: str,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Delete a template
    """
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )

    db.delete(template)
    db.commit()

    return None
