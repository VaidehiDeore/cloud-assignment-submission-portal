from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from models.feedback import GradeRequest
from utils.security import get_current_user
from utils.errors import AppError
from utils.validators import validate_marks
from cloud.database_service import table, get_submission, get_assignment

router = APIRouter(prefix="/submissions", tags=["Feedback"])


@router.post("/{submission_id}/grade")
def grade_submission(
    submission_id: str,
    payload: GradeRequest,
    user=Depends(get_current_user),
):
    if user["role"] not in {"teacher", "admin"}:
        raise AppError("FORBIDDEN", "Only teachers can grade submissions.", 403)

    submission = get_submission(submission_id)
    assignment = get_assignment(submission["assignment_id"])

    if user["role"] == "teacher" and assignment["created_by"] != user["id"]:
        raise AppError("FORBIDDEN", "You are not authorized to grade this submission.", 403)

    validate_marks(payload.marks, float(assignment["max_marks"]))

    result = (
        table("submissions")
        .update(
            {
                "marks": payload.marks,
                "feedback": payload.feedback,
                "graded_at": datetime.now(timezone.utc).isoformat(),
                "submission_status": "GRADED",
            }
        )
        .eq("id", submission_id)
        .execute()
    )

    return {"message": "Submission graded successfully.", "submission": result.data[0]}


@router.get("/{submission_id}/feedback")
def get_feedback(submission_id: str, user=Depends(get_current_user)):
    submission = get_submission(submission_id)
    assignment = get_assignment(submission["assignment_id"])

    if user["role"] == "student" and submission["student_id"] != user["id"]:
        raise AppError("FORBIDDEN", "You can only view your own feedback.", 403)
    if user["role"] == "teacher" and assignment["created_by"] != user["id"]:
        raise AppError("FORBIDDEN", "You cannot access this feedback.", 403)

    return {
        "submission_id": submission["id"],
        "marks": submission.get("marks"),
        "max_marks": assignment["max_marks"],
        "feedback": submission.get("feedback") or "",
        "graded_at": submission.get("graded_at"),
    }
