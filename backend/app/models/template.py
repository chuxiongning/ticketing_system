"""
Template models
"""
from sqlalchemy import Column, String, DateTime, Integer, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from ..core.database import Base


class Template(Base):
    """Template model"""
    __tablename__ = "templates"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    steps = relationship("TemplateStep", back_populates="template", cascade="all, delete-orphan")


class TemplateStep(Base):
    """Template step model"""
    __tablename__ = "template_steps"

    id = Column(String, primary_key=True, index=True)
    template_id = Column(String, ForeignKey("templates.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    order = Column(Integer, nullable=False)

    # Relationships
    template = relationship("Template", back_populates="steps")
    fields = relationship("TemplateField", back_populates="step", cascade="all, delete-orphan")


class TemplateField(Base):
    """Template field model"""
    __tablename__ = "template_fields"

    id = Column(String, primary_key=True, index=True)
    step_id = Column(String, ForeignKey("template_steps.id"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # text, number, date, location, photo, signature, faceRecognition
    required = Column(Boolean, default=False)
    order = Column(Integer, nullable=False)

    # Relationships
    step = relationship("TemplateStep", back_populates="fields")
