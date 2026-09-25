from cloud.auth_service import admin_client
from utils.errors import AppError


def table(name):
    return admin_client().table(name)


def get_profile(user_id):
    result = table("profiles").select("*").eq("id", user_id).single().execute()
    return result.data


def get_course(course_id):
    result = table("courses").select("*").eq("id", course_id).single().execute()
    if not result.data:
        raise AppError("COURSE_NOT_FOUND", "Course was not found.", 404)
    return result.data


def get_assignment(assignment_id):
    result = table("assignments").select("*").eq("id", assignment_id).single().execute()
    if not result.data:
        raise AppError("ASSIGNMENT_NOT_FOUND", "Assignment was not found.", 404)
    return result.data


def get_submission(submission_id):
    result = table("submissions").select("*").eq("id", submission_id).single().execute()
    if not result.data:
        raise AppError("SUBMISSION_NOT_FOUND", "Submission was not found.", 404)
    return result.data
