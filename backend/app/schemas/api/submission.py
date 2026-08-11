from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CreateFileUpload(BaseModel):
    student_name: str = Field(..., description="Name of the student submitting the file")


class SubmissionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="Unique identifier for the submission")
    student_name: str = Field(..., description="Name of the student who submitted the file")
    file_name: str = Field(..., description="Name of the submitted file")
    status: str = Field(..., description="Status of the submission (e.g., SUCCESS, FAILURE)")
    stdout: str | None = Field(default=None, description="Standard output of the code execution")
    stderr: str | None = Field(default=None, description="Standard error of the code execution")
    error_message: str | None = Field(default=None, description="Error message")
    created_at: datetime = Field(..., description="Timestamp when the submission was created")
    
class SubmissionListResponse(BaseModel):
    submissions: list[SubmissionResponse] = Field(..., description="List of all submissions")