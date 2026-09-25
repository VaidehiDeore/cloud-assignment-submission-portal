from fastapi import APIRouter, Depends
from utils.security import get_current_user
from cloud.database_service import table

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/student")
def student_dashboard(user=Depends(get_current_user)):
    if user["role"] != "student":
        from utils.errors import AppError
        raise AppError("FORBIDDEN", "Student dashboard only.", 403)

    assignments = table("assignments").select("*").eq("is_archived", False).execute().data or []
    submissions = table("submissions").select("*").eq("student_id", user["id"]).execute().data or []

    submitted_assignment_ids = {s["assignment_id"] for s in submissions}
    graded = [s for s in submissions if s.get("submission_status") == "GRADED"]
    late = [s for s in submissions if s.get("submission_status") == "LATE"]

    pending = [
        a for a in assignments
        if a["id"] not in submitted_assignment_ids
    ]

    return {
        "stats": {
            "total_assignments": len(assignments),
            "pending_assignments": len(pending),
            "submitted_assignments": len(submissions),
            "late_assignments": len(late),
            "graded_assignments": len(graded),
        },
        "upcoming_deadlines": sorted(
            assignments,
            key=lambda x: x.get("deadline", "")
        )[:5],
        "recent_feedback": sorted(
            graded,
            key=lambda x: x.get("graded_at") or "",
            reverse=True
        )[:5],
    }


@router.get("/teacher")
def teacher_dashboard(user=Depends(get_current_user)):
    if user["role"] not in {"teacher", "admin"}:
        from utils.errors import AppError
        raise AppError("FORBIDDEN", "Teacher dashboard only.", 403)

    if user["role"] == "teacher":
        assignments = table("assignments").select("*").eq("created_by", user["id"]).execute().data or []
    else:
        assignments = table("assignments").select("*").execute().data or []

    assignment_ids = [a["id"] for a in assignments]
    submissions = []
    if assignment_ids:
        submissions = table("submissions").select("*").in_("assignment_id", assignment_ids).execute().data or []

    pending = [s for s in submissions if s.get("submission_status") in {"SUBMITTED", "LATE"}]
    late = [s for s in submissions if s.get("submission_status") == "LATE"]
    graded = [s for s in submissions if s.get("submission_status") == "GRADED"]

    student_ids = {s["student_id"] for s in submissions}

    return {
        "stats": {
            "total_assignments": len(assignments),
            "total_students": len(student_ids),
            "total_submissions": len(submissions),
            "pending_reviews": len(pending),
            "late_submissions": len(late),
            "graded_submissions": len(graded),
        },
        "recent_uploads": sorted(
            submissions,
            key=lambda x: x.get("submitted_at") or "",
            reverse=True
        )[:8],
        "upcoming_deadlines": sorted(
            assignments,
            key=lambda x: x.get("deadline", "")
        )[:5],
    }
