"""
Template schemas
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class TemplateFieldCreate(BaseModel):
    """Schema for template field"""
    name: str
    type: str
    required: bool = False
    order: int


class TemplateFieldResponse(TemplateFieldCreate):
    """Schema for template field response"""
    id: str

    class Config:
        from_attributes = True


class TemplateStepCreate(BaseModel):
    """Schema for template step"""
    name: str
    description: Optional[str] = None
    order: int
    fields: List[TemplateFieldCreate] = []


class TemplateStepResponse(BaseModel):
    """Schema for template step response"""
    id: str
    name: str
    description: Optional[str] = None
    order: int
    fields: List[TemplateFieldResponse] = []

    class Config:
        from_attributes = True


class TemplateBase(BaseModel):
    """Base template schema"""
    name: str
    description: Optional[str] = None


class TemplateCreate(TemplateBase):
    """Schema for creating a template"""
    steps: List[TemplateStepCreate] = []


class TemplateUpdate(BaseModel):
    """Schema for updating a template"""
    name: Optional[str] = None
    description: Optional[str] = None
    steps: Optional[List[TemplateStepCreate]] = None


class TemplateResponse(TemplateBase):
    """Schema for template response"""
    id: str
    created_at: datetime
    updated_at: datetime
    steps: List[TemplateStepResponse] = []

    class Config:
        from_attributes = True
