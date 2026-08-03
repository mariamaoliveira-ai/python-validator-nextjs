---
applyTo: "**"
description: "Project behavior and domain rules for the Python Validator app"
---
# Project Overview

This repository contains a student code validation platform.

Students upload a Python `.py` file through the frontend. The backend receives the file, executes it in a controlled and isolated way, checks whether the output matches the expected result, and stores the submission outcome in the database. The frontend then shows the result and keeps the submission history visible to the user.

# Functional Behavior

- Support Python file upload from the frontend.
- Execute uploaded Python code automatically on the backend.
- Detect successful solutions, syntax errors, runtime errors, infinite loops, and timeouts.
- Persist each submission result and its error details, when available, in the database.
- Show the submission history in the frontend.
- Update the UI after each submission so the latest result appears immediately.

# Expected User Flow

1. The student opens the web app in the browser.
2. The student selects a `.py` file and submits it.
3. The frontend shows a loading state while the backend processes the file.
4. The backend executes the code safely and determines whether the solution is correct.
5. The backend saves the result and returns the response.
6. The frontend refreshes the history list and shows the new submission with a success or failure status.

# Non-Functional Requirements

- Keep code execution isolated for basic safety.
- Keep backend, frontend, and persistence responsibilities separated.
- Use the database to persist submission history.
- Prefer maintainable, testable implementations.

# Agent Guidance

- Treat this as a validation app for uploaded Python solutions, not a generic file upload feature.
- Preserve the upload -> execution -> persistence -> history flow when making changes.
- If you change validation or execution logic, make sure the result still flows through the history UI.
- When adding features, keep the behavior aligned with the student submission workflow described above.
