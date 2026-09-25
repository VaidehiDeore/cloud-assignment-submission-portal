from pathlib import Path
from utils.errors import AppError

ALLOWED_EXTENSIONS = {"pdf", "doc", "docx", "ppt", "pptx", "txt", "zip", "png", "jpg", "jpeg"}


def validate_file(file_name: str, file_size: int, allowed_types: list[str], max_size: int):
    extension = Path(file_name).suffix.lower().lstrip(".")
    allowed = {x.lower().lstrip(".") for x in (allowed_types or [])}

    if extension not in ALLOWED_EXTENSIONS:
        raise AppError("UNSUPPORTED_FILE_TYPE", "This file type is not supported.", 415)

    if allowed and extension not in allowed:
        raise AppError(
            "FILE_TYPE_NOT_ALLOWED",
            f"Allowed file types are: {', '.join(sorted(allowed))}.",
            415,
        )

    if file_size <= 0:
        raise AppError("EMPTY_FILE", "The uploaded file is empty.", 400)

    if file_size > max_size:
        raise AppError(
            "FILE_TOO_LARGE",
            "The uploaded file exceeds the assignment's maximum file size.",
            413,
            {"max_size_bytes": max_size},
        )


def validate_marks(marks: float, max_marks: float):
    if marks < 0 or marks > max_marks:
        raise AppError(
            "INVALID_MARKS",
            f"Marks must be between 0 and {max_marks}.",
            400,
        )
