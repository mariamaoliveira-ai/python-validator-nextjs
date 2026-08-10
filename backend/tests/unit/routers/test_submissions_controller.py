from datetime import datetime

from fastapi.testclient import TestClient
from unittest.mock import patch

import pytest
from app.main import app
from app.services.service_exceptions import ExecutionFileError, InvalidOutputError
from app.models.submission import SubmissionModel

client = TestClient(app)

@patch("app.routers.submissions_controller.SubmissionService.processSubmission")
def test_UploadFileWhenValidPayload(mockProcessFile):
    mockProcessFile.return_value = SubmissionModel(
        id=1,
        student_name="Maria",
        file_name="my_python_file.py",
        stdout="Hello, World!",
        stderr="",
        status="SUCCESS"
    )
    
    metadata = {
        "student_name": "Maria"
    }
    
    fileContent = b"print('Hello, World!')"
    files = {
        "file": ("my_python_file.py", fileContent, "text/x-python")
    }

    response = client.post("/upload", data=metadata, files=files)

    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello, World!",
        "execution_status": "Executed"
    }
    mockProcessFile.assert_called_once()


@patch("app.routers.submissions_controller.SubmissionService.processSubmission")
def test_UploadFileWhenInvalidOutput(mockProcessFile):
    mockProcessFile.return_value = SubmissionModel(
        id=1,
        student_name="Maria",
        file_name="my_python_file.py",
        stdout="",
        stderr="Expected output: 5 but got result: Hello, World!",
        status="FAILED"
    )
    payload = {
        "student_name": "Maria"
    }
    fileContent = b"print('Hello, World!')"
    files = {
        "file": ("my_python_file.py", fileContent, "text/x-python")
    }

    response = client.post("/upload", data=payload, files=files)
    assert response.status_code == 400
    assert response.json() == {
            "detail": {
                "message": "Expected output: 5 but got result: Hello, World!",
                "execution_status": "Failed"
            }
        }
    mockProcessFile.assert_called_once()
    

@patch("app.routers.submissions_controller.SubmissionService.processSubmission")
def test_UploadFileWhenExecutionError(mockProcessFile):
    mockProcessFile.return_value = SubmissionModel(
        id=1,
        student_name="Maria",
        file_name="my_python_file.py",
        stdout="",
        stderr="Execution failed with error: SyntaxError: invalid syntax",
        status="FAILED"
    )
    payload = {
        "student_name": "Maria"
    }
    fileContent = b"print('Hello, World!"
    files = {
        "file": ("my_python_file.py", fileContent, "text/x-python")
    }

    response = client.post("/upload", data=payload, files=files)
    assert response.status_code == 400
    assert response.json() == {
            "detail": {
                "message": "Execution failed with error: SyntaxError: invalid syntax",
                "execution_status": "Failed"
            }
        }
    mockProcessFile.assert_called_once()
    
    
@patch("app.routers.submissions_controller.SubmissionService.processSubmission")
def test_UploadFileWhenTimeoutError(mockProcessFile):
    mockProcessFile.return_value = SubmissionModel(
        id=1,
        student_name="Maria",
        file_name="my_python_file.py",
        stdout="",
        stderr="Execution timed out after 3 seconds",
        status="FAILED"
    )
    payload = {
        "student_name": "Maria"
    }
    fileContent = b"""
        while True:
            pass
    """
    files = {
        "file": ("my_python_file.py", fileContent, "text/x-python")
    }

    response = client.post("/upload", data=payload, files=files)
    assert response.status_code == 400
    assert response.json() == {
            "detail": {
                "message": "Execution timed out after 3 seconds",
                "execution_status": "Failed"
            }
        }


def test_UploadFileWhenWrongFormat():
    payload = {
        "student_name": "Maria"
    }
    fileContent = b"print('Hello, World!')"
    files = {
        "file": ("my_python_file.txt", fileContent, "text/plain")
    }

    response = client.post("/upload", data=payload, files=files)

    assert response.status_code == 400
    assert response.json() == {
        "detail": {
            "message": "Invalid file format. Only .py files are allowed.",
            "execution_status": "Failed"
        }
    }
    

@patch("app.routers.submissions_controller.SubmissionService.processSubmission",
       side_effect=Exception("Unexpected error")   
)
def test_UploadFileWhenUnknownErrorOccurs(mockProcessFile):
    payload = {
        "student_name": "Maria"
    }
    fileContent = b"print('Hello, World!')"
    files = {
        "file": ("my_python_file.py", fileContent, "text/x-python")
    }

    response = client.post("/upload", data=payload, files=files)

    assert response.status_code == 500
    assert response.json() == {
        "detail": {
            "message": "Unexpected error",
            "execution_status": "Failed"
        }
    }
    mockProcessFile.assert_called_once()
    
    
@patch("app.routers.submissions_controller.SubmissionService.loadAllSubmissions")
def test_GetAllSubmissions(mockLoadAllSubmissions):
    mockLoadAllSubmissions.return_value = [
        SubmissionModel(
            id=1,
            student_name="Maria",
            file_name="my_python_file.py",
            stdout="Executed successfully",
            stderr="",
            status="SUCCESS",
            created_at=datetime(2026, 1, 1, 12, 0, 0),
        )
    ]
    response = client.get("/submissions")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    mockLoadAllSubmissions.assert_called_once()
    

@patch("app.routers.submissions_controller.SubmissionService.loadAllSubmissions",
       side_effect=Exception("Unexpected error")   
)
def test_GetAllSubmissionsWhenErrorOccurs(mockLoadAllSubmissions):
    response = client.get("/submissions")
    assert response.status_code == 500
    assert response.json() == {
        "detail": {
            "message": "Unexpected error",
            "execution_status": "Failed"
        }
    }
    mockLoadAllSubmissions.assert_called_once()
    
    
@patch("app.routers.submissions_controller.SubmissionService.loadSubmissionById")   
def test_GetSubmissionById(mockLoadSubmissionById):
    mockLoadSubmissionById.return_value = SubmissionModel(
        id=1,
        student_name="Maria",
        file_name="my_python_file.py",
        stdout="Executed successfully",
        stderr="Executed successfully",
        status="SUCCESS",
        created_at=datetime(2026, 1, 1, 12, 0, 0),
    )
    response = client.get("/submissions/1")
    body = response.json()
    assert response.status_code == 200
    assert body["id"] == 1
    assert body["student_name"] == "Maria"
    assert body["file_name"] == "my_python_file.py"
    assert body["stdout"] == "Executed successfully"
    assert body["stderr"] == "Executed successfully"
    assert body["status"] == "SUCCESS"
    assert body["created_at"] == "2026-01-01T12:00:00"
    mockLoadSubmissionById.assert_called_once_with(submissionId=1)