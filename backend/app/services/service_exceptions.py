class DomainError(Exception):
    """Base class for domain errors."""
    pass

class InvalidOutputError(DomainError):
    """Raised when the output of the executed file is invalid."""
    pass

class ExecutionFileError(DomainError):
    """Raised when there is an error during the execution of the file."""
    pass
