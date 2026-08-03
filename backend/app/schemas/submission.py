from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CreateFileUpload(BaseModel):
    student_name: str = Field(..., description="Name of the student submitting the file")


class SubmissionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    student_name: str = Field(..., description="Name of the student who submitted the file")
    file_name: str = Field(..., description="Name of the submitted file")
    status: str = Field(..., description="Status of the submission (e.g., SUCCESS, FAILURE)")
    result_execution: str = Field(..., description="Result of the code execution")
    created_at: datetime = Field(..., description="Timestamp when the submission was created")
    
class SubmissionListResponse(BaseModel):
    submissions: list[SubmissionResponse] = Field(..., description="List of all submissions")