from datetime import datetime

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.submission import SubmissionModel
from app.services.service_exceptions import ExecutionFileError, InvalidOutputError
from app.services.submission import SubmissionService

from ..schemas.submission import CreateFileUpload, SubmissionResponse
from ..services.file_executor import FileExecutor

router = APIRouter()


def get_submission_service(
    db: Session = Depends(get_db),
    executor: FileExecutor = Depends(lambda: FileExecutor())
) -> SubmissionService:
    return SubmissionService(db=db, executor=executor)


def getMetadata(
    student_name: str = Form(...)
) -> CreateFileUpload:
    return CreateFileUpload(
        student_name=student_name
    )


@router.post("/upload")
def upload_file(
    metadata: CreateFileUpload = Depends(getMetadata),
    file: UploadFile = File(...),
    service: SubmissionService = Depends(get_submission_service)
):
    validatePythonFile(file)
    try:
        submission = service.processSubmission(
            studentName=metadata.student_name,
            fileName=file.filename,
            fileBytes=file.file.read()
        )
        
        if submission.status == "FAILED":
            raise HTTPException(
                status_code=400,
                detail={
                    "message": submission.result_execution,
                    "execution_status": "Failed"
                }
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail={
            "message": str(e),
            "execution_status": "Failed"
        })

    return {
        "message": submission.result_execution,
        "execution_status": "Executed"
    }
        

def validatePythonFile(file):
    if not file.filename.endswith(".py"):
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Invalid file format. Only .py files are allowed.",
                "execution_status": "Failed"
            }
        )
        
        
@router.get("/submissions", response_model=list[SubmissionResponse])
def get_all_submissions(
    service: SubmissionService = Depends(get_submission_service)
):
    try:
        submissions = service.loadAllSubmissions()
        return submissions
    except Exception as e:
        raise HTTPException(status_code=500, detail={
            "message": str(e),
            "execution_status": "Failed"
        })

  