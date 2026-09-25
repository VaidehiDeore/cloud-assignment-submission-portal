from fastapi import APIRouter, Depends
from utils.security import get_current_user
from utils.errors import AppError
from cloud.database_service import get_submission, get_assignment
from cloud.storage_service import create_signed_url

router = APIRouter(prefix="/submissions", tags=["Files"])


@router.get("/{submission_id}/download")
def download_submission(submission_id: str, user=Depends(get_current_user)):
    submission = get_submission(submission_id)
    assignment = get_assignment(submission["assignment_id"])

    if user["role"] == "student" and submission["student_id"] != user["id"]:
        raise AppError("FORBIDDEN", "You cannot download this file.", 403)

    if user["role"] == "teacher" and assignment["created_by"] != user["id"]:
        raise AppError("FORBIDDEN", "You cannot download this file.", 403)

    url = create_signed_url(submission["storage_path"], 300)
    return {
        "download_url": url,
        "expires_in": 300,
        "file_name": submission["file_name"],
    }
