"""
File upload routes
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
import os
import uuid
import aiofiles
from pathlib import Path

from ..core.config import settings
from ..core.security import get_current_user_id


router = APIRouter(prefix="/files", tags=["files"])


# Ensure upload directory exists
UPLOAD_DIR = Path(settings.UPLOAD_DIR)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    field_type: str = Form(...),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Upload a file (photo, signature, etc.)
    """
    # Check file size
    content = await file.read()
    file_size = len(content)

    if file_size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE} bytes"
        )

    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4().hex}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename

    # Save file
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(content)

    # Return file info
    return {
        "id": unique_filename,
        "url": f"/api/files/{unique_filename}",
        "name": file.filename,
        "type": file.content_type,
        "size": file_size
    }


@router.get("/{file_id}")
async def get_file(
    file_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Get/download a file
    """
    file_path = UPLOAD_DIR / file_id

    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )

    return FileResponse(file_path)


@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_file(
    file_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Delete a file
    """
    file_path = UPLOAD_DIR / file_id

    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )

    os.remove(file_path)
    return None
