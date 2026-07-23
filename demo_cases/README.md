# SPLIST Demo Cases

This directory contains the test suite and demonstration cases for SPLIST.

To keep the repository lightweight and clean, the massive raw markdown test files are **not** included in the repository. Instead, when you execute `demo_cases_gen.js`, markdown files for testing will be dynamically generated inside this `demo_cases` directory.

## How to Run

### Step 1: Generate Raw Markdown Files
Run the following command from the root of the repository:

```bash
c:\splist> npm run demo
```
*Alternatively, you can run the script directly:*
```bash
c:\splist> node c:\splist\demo_cases\demo_cases_gen.js
```
*(Tip: You can drag and drop the file into your terminal to avoid typos.)*

This script will automatically create a new `demo_cases_raw/` directory directly under the `demo_cases` directory, containing over 50 generated test markdown files:
`demo_cases/demo_cases_raw/`

### Step 2: Execute the SPLIST Engine
You can test the behavior of each generated markdown file individually, or you can run all of them at once. 
Inside the generated folder, you will find a batch execution script:
`C:\splist\demo_cases\demo_cases_raw\demo_cases_run.js`

To run the batch split process for all files, use the following command:
```bash
c:\splist> node C:\splist\demo_cases\demo_cases_raw\demo_cases_run.js
```
*(Tip: You can drag and drop this file into your terminal as well.)*

This will execute the SPLIST engine on all generated files and output the final split results into a new `demo_cases_splisted/` directory.

## Directory State Progression

As you proceed, your directory structure will evolve as follows:

**Phase 1: Initial State**
- `C:\splist\demo_cases`
  - `demo_cases_gen.js`

**Phase 2: After Generation**
- `C:\splist\demo_cases`
  - `demo_cases_gen.js`
  - `demo_cases_raw\`

**Phase 3: After Splitting**
- `C:\splist\demo_cases`
  - `demo_cases_gen.js`
  - `demo_cases_raw\`
  - `demo_cases_splisted\`

**Phase 4: After Multiple Runs (History Archived)**
*Note: If you run the command multiple times, your previous test results will not be overwritten. They are safely archived in the `history/` directory.*
- `C:\splist\demo_cases`
  - `demo_cases_gen.js`
  - `demo_cases_raw\`
  - `demo_cases_splisted\`
  - `history\`

## Troubleshooting

### Accidentally deleted `demo_cases_gen.js`?
Because this file is tracked by Git, you can instantly restore it to its original state if you accidentally delete or modify it. Simply run the following command in your terminal:

```bash
c:\splist> git restore demo_cases/demo_cases_gen.js
```
