"""
Face recognition routes
"""
from fastapi import APIRouter, Depends, UploadFile, File

from ..core.security import get_current_user_id


router = APIRouter(prefix="/face-recognition", tags=["face-recognition"])


@router.post("/verify")
async def verify_face(
    image: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Verify face from image

    This is a mock implementation. In production, integrate with a face recognition service
    like AWS Rekognition, Azure Face API, or similar.
    """
    # TODO: Integrate with actual face recognition service
    # For now, return mock verification

    return {
        "verified": True,
        "confidence": 0.95,
        "message": "Face verified successfully"
    }
