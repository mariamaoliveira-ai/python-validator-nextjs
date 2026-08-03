import pytest
from unittest.mock import MagicMock
from app.services.submission import SubmissionService

def test_shouldSaveSubmissionOnExecutionSuccess():
    
    mockDB = MagicMock()
    mockExecutor = MagicMock()
    mockExecutor.executeFile.return_value = True
    
    service = SubmissionService(db=mockDB, executor=mockExecutor)

    result = service.processSubmission(
        studentName = "Aluno Mock",
        fileName = "solution.py",
        fileBytes = b"print('5')"
    )
    
    assert mockDB.add.called
    assert mockDB.commit.called
    assert mockDB.refresh.called
    assert result.status == "SUCCESS"
    assert result.student_name == "Aluno Mock" 
    
    
def test_shouldSaveSubmissionOnExecutionFailure():
    
    mockDB = MagicMock()
    mockExecutor = MagicMock()
    mockExecutor.executeFile.side_effect = Exception("execution failed")
    
    service = SubmissionService(db=mockDB, executor=mockExecutor)

    result = service.processSubmission(
        studentName = "Aluno Mock",
        fileName = "solution.py",
        fileBytes = b"print('5')"
    )
    
    assert mockDB.add.called
    assert mockDB.commit.called
    assert mockDB.refresh.called
    assert result.status == "FAILED"
    assert result.student_name == "Aluno Mock" 
    assert result.result_execution == "execution failed"
    
    
def test_shouldLoadAllSubmissions():
    
    mockDB = MagicMock()
    mockExecutor = MagicMock()

    mock_submission_1 = MagicMock()
    mock_submission_1.student_name = "Aluno Mock"
    mock_submission_1.status = "SUCCESS"

    mock_submission_2 = MagicMock()
    mock_submission_2.student_name = "Aluno Mock 2"
    mock_submission_2.status = "FAILURE"

    mockDB.query.return_value.all.return_value = [mock_submission_1, mock_submission_2]

    service = SubmissionService(db=mockDB, executor=mockExecutor)
    result = service.loadAllSubmissions()

    assert mockDB.query.called
    assert len(result) == 2
    assert result[0].student_name == "Aluno Mock"
    assert result[0].status == "SUCCESS"
    assert result[1].student_name == "Aluno Mock 2"
    assert result[1].status == "FAILURE"
    
    
def test_shouldLoadAllSubmissionsFailure():
    
    mockDB = MagicMock()
    mockExecutor = MagicMock()

    mock_submission_1 = MagicMock()
    mock_submission_1.student_name = "Aluno Mock"
    mock_submission_1.status = "SUCCESS"

    mock_submission_2 = MagicMock()
    mock_submission_2.student_name = "Aluno Mock 2"
    mock_submission_2.status = "FAILURE"

    mockDB.query.side_effect = Exception("Database query failed")

    service = SubmissionService(db=mockDB, executor=mockExecutor)
    with pytest.raises(Exception) as e:
        service.loadAllSubmissions()
    assert str(e.value) == "Database query failed"