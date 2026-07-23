---
name: splist-interactive-runner
description: >-
  A workflow that supports interactive and safe file splitting using the splist command, allowing users to execute the process without needing to operate the terminal directly.
---

# Splist Interactive Runner

## Overview
This is a protocol (workflow) for the AI agent to safely and interactively support command execution when a user requests to "split this file" or "use splist." The goal is to provide a reassuring UX for the user and autonomously recover from errors.

## Dependencies
None

## Workflow

### 1. Proposing and Presenting a Preview
- When the user specifies a file to split (e.g., Markdown), do not execute immediately. First, simulate the split result using default settings and present it to the user.
- Clearly show in the preview (e.g., in a tree format) "where (output folder)" and "under what names (file structure)" the files will be generated.

### 2. Referencing the Manual (When Answering Questions)
- If the user asks questions about output destinations or options, always refer to the repository's `README.md` and the manual (`USAGE.md`).
- Organize the information and use bullet points to provide a clear and easily understandable answer.

### 3. Obtaining User Execution Approval
- Right before execution, explicitly confirm by asking, "May I proceed with execution?"
- Never make any changes to the system (such as running commands) until the user gives a GO sign like "Run it," "Execute," or "OK."

### 4. Command Execution and Result Reporting
- Once approval is granted, execute `splist <target_file> [command]` (or `node src/cli/cli.js <target_file> [command]`).
  - *(Note: Thanks to v2 Smart Defaults, the command like `list` or `sp` can often be omitted depending on the file extension).*
- After execution, report the list of generated files and the output folder path clearly to the user.

### 5. Error Handling and Self-Healing
- If an error occurs during command execution (e.g., module not found, parsing error), handle it using the following steps:
  1. Report the error details to the user, indicating that you will auto-retry if it's a temporary issue (or ask for instructions).
  2. Read the execution logs, identify the root cause, and autonomously attempt self-healing (e.g., code correction).
  3. If the cause is a bug in the repository, fix it and generate a "Bug Report" as a Markdown artifact (e.g., `bug_report.md`) that the user can directly copy and paste to submit to GitHub Issues.

## Common Mistakes
- Executing commands without explicit user permission.
- Guessing answers without referencing the manual.
- Throwing the problem back to the user without checking logs or attempting autonomous resolution upon encountering an error.
