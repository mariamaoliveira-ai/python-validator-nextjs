import pytest
from app.services.file_executor import FileExecutor
from app.services.service_exceptions import ExecutionFileError, InvalidOutputError

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
    
    assert result is True
    
    
def test_ExecuteFileFailure(fileExecutor):
    
    pythonCode = b"""
        num1 = int(input())
        num2 = int(input())
        result = num1 - num2
        print(result)
    """
     
    with pytest.raises(InvalidOutputError):
        fileExecutor.executeFile(pythonCode)
  
    
def test_ExecuteFileFailureBySyntaxError(fileExecutor):
    pythonCode = b"""
        num1 = int(input())
        num2 = int(input()
        result = num1 + num2
        print(result)
    """
    
    with pytest.raises(ExecutionFileError):
        fileExecutor.executeFile(pythonCode)
     
    
def test_ExecuteFileFailureByTimeOut(fileExecutor):
    pythonCode = b"""
        while True:
            pass
    """
    
    with pytest.raises(TimeoutError):
        fileExecutor.executeFile(pythonCode)
    
  
