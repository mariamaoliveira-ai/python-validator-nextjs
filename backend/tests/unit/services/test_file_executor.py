import pytest
from app.services.file_executor import FileExecutor
from app.schemas.internal.file_executor import ExecutionStatus

@pytest.fixture
def fileExecutor():
    return FileExecutor()


def test_ExecuteFileSuccess(fileExecutor):
    
    pythonCode = b"""
        num1 = int(input())
        num2 = int(input())
        result = num1 + num2
        print(result)
    """

    result = fileExecutor.executeFile(pythonCode)
    
    assert result.status is ExecutionStatus.PASSED
    
    
def test_ExecuteFileFailure(fileExecutor):
    
    pythonCode = b"""
        num1 = int(input())
        num2 = int(input())
        result = num1 - num2
        print(result)
    """
     
    result = fileExecutor.executeFile(pythonCode)
    assert result.status is ExecutionStatus.WRONG_ANSWER
    assert "Expected output: 5, but got: -1" in result.errorMessage
  
    
def test_ExecuteFileFailureBySyntaxError(fileExecutor):
    pythonCode = b"""
        num1 = int(input())
        num2 = int(input()
        result = num1 + num2
        print(result)
    """
    
    result = fileExecutor.executeFile(pythonCode)
    assert result.status is ExecutionStatus.SYSTEM_ERROR
     
    
def test_ExecuteFileFailureByTimeOut(fileExecutor):
    pythonCode = b"""
        while True:
            pass
    """
    
    result = fileExecutor.executeFile(pythonCode)
    assert result.status is ExecutionStatus.TIMEOUT
    