from datetime import datetime
from pydantic import BaseModel, Field


class AssignmentCreate(BaseModel):
    course_id: str
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=1, max_length=5000)
    deadline: datetime
    max_marks: float = Field(gt=0, le=1000)
    allowed_file_types: list[str] = Field(default_factory=lambda: ["pdf", "docx"])
    max_file_size: int = Field(default=10 * 1024 * 1024, gt=0)
    allow_late_submission: bool = True
    allow_resubmission: bool = True
    max_attempts: int = Field(default=3, ge=1, le=20)


class AssignmentUpdate(AssignmentCreate):
    pass
