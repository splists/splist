# Project-Specific Agent Rules

- **Ad-hoc Testing Constraints**: When creating temporary files or running ad-hoc tests, DO NOT place them in the project root OR directly inside the `demo_cases/` root folder. You must create a dedicated sub-directory (e.g., `demo_cases/test_runs/` or `demo_cases/sandbox/`) to keep the workspace and the `demo_cases` directory clean and organized.
