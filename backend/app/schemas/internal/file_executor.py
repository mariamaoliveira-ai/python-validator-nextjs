from dataclasses import dataclass
from enum import Enum
from typing import Optional

class ExecutionStatus(str, Enum):
    PASSED = "PASSED"
    WRONG_ANSWER = "WRONG_ANSWER"
    RUNTIME_ERROR = "RUNTIME_ERROR"
    TIMEOUT = "TIMEOUT"
    SYSTEM_ERROR = "SYSTEM_ERROR"
    
@dataclass
class ExecutionResult:
    status: ExecutionStatus
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    errorMessage: Optional[str] = None