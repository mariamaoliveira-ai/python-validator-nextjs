import subprocess
import tempfile
import sys
import os
import textwrap

from app.schemas.internal.file_executor import ExecutionResult, ExecutionStatus


class FileExecutor:

    TIMEOUT_SECONDS = 3
    
    def __init__(self):
        pass

    def executeFile(self, fileContent: bytes)-> ExecutionResult:
        inputs = ["2", "3"]
        expectedOutput = "5"
        normalizedSource = textwrap.dedent(fileContent.decode("utf-8")).lstrip()
        
        with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as tempFile:
            tempFile.write(normalizedSource.encode("utf-8"))
            tempPath = tempFile.name

        try:
            stdinData = "\n".join(inputs)+"\n"
            
            result = subprocess.run(
                [sys.executable, tempPath],
                input=stdinData,
                text = True, 
                capture_output= True,
                timeout= self.TIMEOUT_SECONDS
            )
            
            if result.returncode != 0:
                return ExecutionResult(
                    status= ExecutionStatus.SYSTEM_ERROR,
                    stdout= result.stdout.strip() or None,
                    stderr= result.stderr.strip() or None,
                    errorMessage= f"Execution failed with return code {result.returncode}. Error: {result.stderr.strip()}"
                )
            
            executedOutput = result.stdout.strip()
            
            if executedOutput == expectedOutput.strip():
                return ExecutionResult(
                    status= ExecutionStatus.PASSED,
                    stdout= executedOutput,
                    stderr= result.stderr.strip() or None
                )
            
            return ExecutionResult(
                status= ExecutionStatus.WRONG_ANSWER,
                stdout= executedOutput,
                stderr= result.stderr.strip() or None,
                errorMessage= f"Expected output: {expectedOutput.strip()}, but got: {executedOutput}"
            )

        
        except(subprocess.TimeoutExpired):
            return ExecutionResult(
                status= ExecutionStatus.TIMEOUT,
                errorMessage= f"Execution exceeded the time limit of {self.TIMEOUT_SECONDS} seconds."
            )
            
        except Exception as e:
            return ExecutionResult(
                status= ExecutionStatus.SYSTEM_ERROR,
                errorMessage= f"An unexpected error occurred: {str(e)}"
            )
        finally:
            if os.path.exists(tempPath):
                os.remove(tempPath)