from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder

from models.assignment import AssignmentCreate, AssignmentUpdate
from utils.security import get_current_user, require_role
from utils.errors import AppError
from cloud.database_service import table, get_assignment, get_course


router = APIRouter(prefix="/assignments", tags=["Assignments"])


def ensure_teacher_owns_course(user, course):
    require_role(user, "teacher", "admin")

    if user["role"] == "teacher" and course["teacher_id"] != user["id"]:
        raise AppError(
            "FORBIDDEN",
            "You are not assigned to this course.",
            403
        )


@router.post("", status_code=201)
def create_assignment(
    payload: AssignmentCreate,
    user=Depends(get_current_user)
):
    course = get_course(payload.course_id)

    ensure_teacher_owns_course(user, course)

    # Convert the Pydantic model to a normal dictionary.
    data = payload.model_dump()

    # Supabase/PostgREST expects JSON-compatible values.
    # Convert Python datetime explicitly to ISO-8601 text.
    data["deadline"] = payload.deadline.isoformat()

    # Add the authenticated teacher.
    data["created_by"] = user["id"]

    result = (
        table("assignments")
        .insert(data)
        .execute()
    )

    assignment = result.data[0]

    return jsonable_encoder({
        "message": "Assignment created.",
        "assignment": assignment
    })


@router.get("")
def list_assignments(user=Depends(get_current_user)):

    if user["role"] == "teacher":
        result = (
            table("assignments")
            .select("*, courses(course_name)")
            .eq("created_by", user["id"])
            .order("deadline")
            .execute()
        )

    elif user["role"] == "admin":
        result = (
            table("assignments")
            .select("*, courses(course_name)")
            .order("deadline")
            .execute()
        )

    else:
        # Demo-friendly behavior:
        # all assignments are visible to students.
        result = (
            table("assignments")
            .select("*, courses(course_name)")
            .order("deadline")
            .execute()
        )

    return jsonable_encoder({
        "assignments": result.data or []
    })


@router.get("/{assignment_id}")
def get_one(
    assignment_id: str,
    user=Depends(get_current_user)
):
    assignment = get_assignment(assignment_id)

    if (
        user["role"] == "teacher"
        and assignment["created_by"] != user["id"]
    ):
        raise AppError(
            "FORBIDDEN",
            "You cannot access this assignment.",
            403
        )

    return jsonable_encoder(assignment)


@router.put("/{assignment_id}")
def update_assignment(
    assignment_id: str,
    payload: AssignmentUpdate,
    user=Depends(get_current_user),
):
    assignment = get_assignment(assignment_id)

    course = get_course(assignment["course_id"])

    ensure_teacher_owns_course(user, course)

    data = payload.model_dump()

    # Explicitly convert datetime to JSON-compatible text.
    data["deadline"] = payload.deadline.isoformat()

    data["updated_at"] = datetime.now(
        timezone.utc
    ).isoformat()

    result = (
        table("assignments")
        .update(data)
        .eq("id", assignment_id)
        .execute()
    )

    return jsonable_encoder({
        "message": "Assignment updated.",
        "assignment": result.data[0]
    })


@router.delete("/{assignment_id}")
def delete_assignment(
    assignment_id: str,
    user=Depends(get_current_user)
):
    assignment = get_assignment(assignment_id)

    course = get_course(assignment["course_id"])

    ensure_teacher_owns_course(user, course)

    # Soft delete preserves historical submissions.
    result = (
        table("assignments")
        .update({"is_archived": True})
        .eq("id", assignment_id)
        .execute()
    )

    return jsonable_encoder({
        "message": "Assignment archived.",
        "assignment": result.data[0]
    })