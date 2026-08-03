
from app.services.file_executor import FileExecutor
from sqlalchemy.orm import Session

from app.models.submission import SubmissionModel
from app.services.service_exceptions import ExecutionFileError, InvalidOutputError


class SubmissionService:
    
    def __init__(self, db: Session, executor: FileExecutor):
        self.db = db
        self.executor = executor
        
    def processSubmission(self, studentName: str, fileName: str, fileBytes: bytes):
        status = "FAILED"
        resultExecution = "" 
        
        try:
            result = self.executor.executeFile(fileContent=fileBytes)
            
            if result:
                status = "SUCCESS"
                resultExecution = "File executed successfully and passed all tests."
          
        except (InvalidOutputError, ExecutionFileError, TimeoutError) as e:
            resultExecution = str(e)    
        except Exception as e:
            resultExecution = str(e)
        
        submission = SubmissionModel(
            student_name=studentName,
            file_name=fileName,
            status=status,
            result_execution=resultExecution
        )
        
        self.db.add(submission)
        self.db.commit()
        self.db.refresh(submission)
        
        return submission
    
    def loadAllSubmissions(self):
        submissions = self.db.query(SubmissionModel).all()
        return submissions