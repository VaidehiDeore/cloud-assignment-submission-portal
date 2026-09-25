from datetime import datetime, timezone
from fastapi import APIRouter, Depends, File, UploadFile
from utils.security import get_current_user, require_role
from utils.errors import AppError
from utils.validators import validate_file
from cloud.database_service import table, get_assignment, get_submission
from cloud.storage_service import build_path, upload, remove

router = APIRouter(tags=["Submissions"])


def teacher_can_access(user, assignment):
    require_role(user, "teacher", "admin")
    if user["role"] == "teacher" and assignment["created_by"] != user["id"]:
        raise AppError("FORBIDDEN", "You cannot access this assignment's submissions.", 403)


@router.post("/assignments/{assignment_id}/submit", status_code=201)
async def submit_assignment(
    assignment_id: str,
    file: UploadFile = File(...),
    user=Depends(get_current_user),
):
    require_role(user, "student")
    assignment = get_assignment(assignment_id)

    if assignment.get("is_archived"):
        raise AppError("ASSIGNMENT_ARCHIVED", "This assignment is no longer active.", 409)

    existing = (
        table("submissions")
        .select("*")
        .eq("assignment_id", assignment_id)
        .eq("student_id", user["id"])
        .order("attempt_number", desc=True)
        .execute()
    )
    attempts = existing.data or []

    if attempts and not assignment.get("allow_resubmission", True):
        raise AppError("RESUBMISSION_NOT_ALLOWED", "Resubmission is not allowed.", 409)

    if len(attempts) >= assignment.get("max_attempts", 3):
        raise AppError("MAX_ATTEMPTS_REACHED", "Maximum submission attempts reached.", 409)

    content = await file.read()
    validate_file(
        file.filename or "upload",
        len(content),
        assignment.get("allowed_file_types", []),
        assignment.get("max_file_size", 10 * 1024 * 1024),
    )

    now = datetime.now(timezone.utc)
    deadline = datetime.fromisoformat(assignment["deadline"].replace("Z", "+00:00"))
    is_late = now > deadline

    if is_late and not assignment.get("allow_late_submission", True):
        raise AppError("DEADLINE_PASSED", "The submission deadline has passed.", 409)

    status = "LATE" if is_late else "SUBMITTED"
    attempt = len(attempts) + 1
    storage_path = build_path(assignment_id, user["id"], file.filename or "submission")
    upload(storage_path, content, file.content_type or "application/octet-stream")

    try:
        row = {
            "assignment_id": assignment_id,
            "student_id": user["id"],
            "file_name": file.filename,
            "storage_path": storage_path,
            "submitted_at": now.isoformat(),
            "submission_status": status,
            "attempt_number": attempt,
        }
        result = table("submissions").insert(row).execute()
        return {"message": "Assignment submitted successfully.", "submission": result.data[0]}
    except Exception:
        remove(storage_path)
        raise AppError(
            "SUBMISSION_SAVE_FAILED",
            "Submission metadata could not be saved. The uploaded file was cleaned up.",
            500,
        )


@router.get("/submissions/me")
def my_submissions(user=Depends(get_current_user)):
    require_role(user, "student")
    result = (
        table("submissions")
        .select("*, assignments(title,deadline,max_marks)")
        .eq("student_id", user["id"])
        .order("submitted_at", desc=True)
        .execute()
    )
    return {"submissions": result.data or []}


@router.get("/assignments/{assignment_id}/submissions")
def assignment_submissions(assignment_id: str, user=Depends(get_current_user)):
    assignment = get_assignment(assignment_id)
    teacher_can_access(user, assignment)

    result = (
        table("submissions")
        .select("*, profiles(name,email)")
        .eq("assignment_id", assignment_id)
        .order("submitted_at", desc=True)
        .execute()
    )
    return {"submissions": result.data or []}


@router.get("/submissions/{submission_id}")
def submission_details(submission_id: str, user=Depends(get_current_user)):
    submission = get_submission(submission_id)
    assignment = get_assignment(submission["assignment_id"])

    if user["role"] == "student" and submission["student_id"] != user["id"]:
        raise AppError("FORBIDDEN", "You can only view your own submission.", 403)
    if user["role"] == "teacher" and assignment["created_by"] != user["id"]:
        raise AppError("FORBIDDEN", "You cannot access this submission.", 403)

    return submission
