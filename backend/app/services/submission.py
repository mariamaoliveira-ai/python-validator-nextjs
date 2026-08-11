from app.services.file_executor import FileExecutor
from sqlalchemy.orm import Session

from app.models.submission import SubmissionModel
from app.services.service_exceptions import ExecutionFileError, InvalidOutputError
from app.schemas.internal.file_executor import ExecutionStatus


class SubmissionService:

    def __init__(self, db: Session, executor: FileExecutor):
        self.db = db
        self.executor = executor

    def processSubmission(self, studentName: str, fileName: str, fileBytes: bytes)->SubmissionModel:

        result = self.executor.executeFile(fileContent=fileBytes)
        status = "FAILED" 
        if result.status.value == ExecutionStatus.PASSED:
            status = "SUCCESS"
       
        submission = SubmissionModel(
            student_name=studentName,
            file_name=fileName,
            status=status,
            stdout=result.stdout,
            stderr=result.stderr,
            error_message=result.errorMessage
        )

        self.db.add(submission)
        self.db.commit()
        self.db.refresh(submission)

        return submission

    def loadAllSubmissions(self) -> list[SubmissionModel]:
        submissions = self.db.query(SubmissionModel).all()
        return submissions

    def loadSubmissionById(self, submissionId: int)-> SubmissionModel:
        submission = self.db.query(SubmissionModel).filter(
            SubmissionModel.id == submissionId).first()
        return submission
