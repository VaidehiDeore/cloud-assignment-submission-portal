from pydantic import BaseModel, Field


class GradeRequest(BaseModel):
    marks: float = Field(ge=0)
    feedback: str = Field(default="", max_length=5000)
