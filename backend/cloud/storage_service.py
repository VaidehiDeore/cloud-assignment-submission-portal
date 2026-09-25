import uuid
from cloud.auth_service import admin_client
from utils.errors import AppError

BUCKET = "assignment-files"


def build_path(assignment_id: str, student_id: str, original_name: str):
    safe_name = original_name.replace("/", "_").replace("\\", "_")
    return f"assignments/{assignment_id}/{student_id}/{uuid.uuid4().hex}_{safe_name}"


def upload(path: str, content: bytes, content_type: str):
    try:
        admin_client().storage.from_(BUCKET).upload(
            path,
            content,
            {"content-type": content_type, "upsert": False},
        )
        return path
    except Exception:
        raise AppError("STORAGE_UPLOAD_FAILED", "The file could not be uploaded.", 500)


def remove(path: str):
    try:
        admin_client().storage.from_(BUCKET).remove([path])
    except Exception:
        # Cleanup failure should not hide the original application failure.
        pass


def create_signed_url(path: str, expires_in: int = 300):
    try:
        response = admin_client().storage.from_(BUCKET).create_signed_url(
            path, expires_in
        )
        return response.get("signedURL") or response.get("signedUrl")
    except Exception:
        raise AppError("STORAGE_DOWNLOAD_FAILED", "Could not create a secure download link.", 500)
