const fs   = require('fs');
const path = require('path');

const playgroundDir = __dirname;
const demoDir = path.join(playgroundDir, 'demo_cases_raw');
const splistedDir = path.join(playgroundDir, 'demo_cases_splisted');
const historyDir = path.join(playgroundDir, 'history');

// Archive previous run to keep logs
if (fs.existsSync(demoDir) || fs.existsSync(splistedDir)) {
    if (!fs.existsSync(historyDir)) {
        fs.mkdirSync(historyDir);
    }
    
    // Get current YYYYMMDD_HHMMSS
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    
    const archivePath = path.join(historyDir, `run_${timestamp}`);
    fs.mkdirSync(archivePath);

    const safeMove = (src, dest) => {
        try {
            fs.renameSync(src, dest);
        } catch (err) {
            // Fallback for Windows file lock / EPERM issue (e.g. file open in IDE or Explorer)
            fs.cpSync(src, dest, { recursive: true });
            try {
                fs.rmSync(src, { recursive: true, force: true });
            } catch (e) {
                // Ignore removal error if process lock exists; data is safely archived
            }
        }
    };

    if (fs.existsSync(demoDir)) {
        safeMove(demoDir, path.join(archivePath, 'demo_cases_raw'));
    }
    if (fs.existsSync(splistedDir)) {
        safeMove(splistedDir, path.join(archivePath, 'demo_cases_splisted'));
    }
    
    // Archive previous reports
    const files = fs.readdirSync(playgroundDir);
    for (const file of files) {
        if (file.startsWith('demo_cases_report') && file.endsWith('.md')) {
            safeMove(path.join(playgroundDir, file), path.join(archivePath, file));
        }
    }
    console.log(`📦 Archived previous test run to: history/run_${timestamp}\n`);
}

fs.mkdirSync(demoDir);

// ---------------------------------------------------------------------------
// Reusable dummy body text generators (keep JS source short & readable)
// ---------------------------------------------------------------------------
const genBody = (text, n = 5) => (text + '\n').repeat(n).trimEnd();

const denseEN1 = genBody("This is a massive, dense block of raw text. It represents a user's brain dump, a long unformatted article, or a messy draft. It just keeps going on and on without any breaks, creating a heavy wall of text that is hard to read. ");
const denseEN2 = genBody("Here is another extremely long paragraph. In a real-world scenario, a user might want to extract this specific part, or simply divide the document to make it more manageable. The text continues to flow heavily across the screen. ");
const denseEN3 = genBody("Finally, this is the last chunk of dense information. By using this tool, what was once a chaotic and overwhelming text file is instantly transformed into beautifully separated and organized components. ");

// Interactive demo body (multi-marker showcase)
const multiMarkerDemo = `This is a practical, general-purpose plain-text file.
To physically cut (sp) it into several files, just place a line containing only "scissors" or "V" or "v" or "CUT" at the point you want to split.

Here we demonstrate two approaches: Single-Cut and Multi-Cut.
Single-Cut places one marker in the document, splitting it into exactly two pieces.
Multi-Cut places multiple markers, letting one command produce many files at once.
✂️
The scissor emoji above is the visual marker proof. It stands out clearly in dense text.
After editing, save with Ctrl+S (Cmd+S on Mac).
CUT
The uppercase word "CUT" is another valid marker.
SPLIST automatically prefixes sequential numbers: 01_Part.md, 02_Part.md, etc.
V
Capital "V" is the speed-typing shortcut marker. No need to move your fingers off home row.
v
Lowercase "v" works identically.
Mix and match any of these markers freely within a single document.`;

// ---------------------------------------------------------------------------
// Test case definitions — named files for the success_cases/ folder
// ---------------------------------------------------------------------------
const testFiles = {

    // =========================================================================
    // GROUP 1: sp (physical slicer) — 01-15
    // =========================================================================

    // --- Showcase: how to use sp ---
    '01_sp_showcase_single_cut_default.md': `First section text starts here.
v
Second section text ends here.`,

    '02_sp_showcase_multi_cut_default.md': `Part 1
✂️
Part 2
CUT
Part 3
v
Part 4
v
Part 5`,

    '03_sp_showcase_custom_marker_opt.md': `This file validates physical splitting with a user-defined custom marker.
===
The "===" line above acts as the cut boundary.
===
Useful for log files, CSVs, or any text format with a natural delimiter.`,

    '04_sp_showcase_marker_trailing_text_default.md': `This file validates the trailing-text retention feature.
V Chapter 1: The Beginning
This becomes the body of the new file.
v Chapter 2: The Journey
This also becomes its own file.`,

    '05_sp_option_un_opt.md': `Physical cut without sequential numbering (un option).
v
Output files carry no leading number prefix.
v
Useful when alphabetical ordering by title is preferred.`,

    '06_sp_option_toc_opt.md': `Physical cut with automatic TOC generation (-toc option).
v
Each split destination appears as a relative link in 00_TOC.md.
v
The TOC file is opened automatically after splitting.`,

    // --- Safety: edge-case robustness for sp ---
    '07_sp_safety_consecutive_cuts_default.md': `Section A
✂️
✂️
Section B — two consecutive markers in a row.
SPLIST detects the empty chunk between them and silently skips it,
preventing zero-byte garbage files from being created.`,

    '08_sp_safety_start_with_cut_default.md': `✂️
This file begins with a cut marker on line 1.
The resulting first output would be an empty file, so it is safely skipped.`,

    '09_sp_safety_end_with_cut_default.md': `This file ends with a cut marker.
The trailing empty chunk is silently dropped — no zero-byte file is produced.
✂️`,

    '10_sp_safety_false_scissors_default.md': `Inline scissors ✂️ mid-sentence are ignored — never treated as a cut point.
Only a marker that occupies its own entire line triggers a split.
✂️
This line-start marker above is the real cut point.`,

    '11_sp_safety_no_cuts_default.md': `${denseEN1}\n\n${denseEN2}\n\n${denseEN3}
(No cut markers anywhere in this file — SPLIST exits cleanly without splitting.)`,

    '12_sp_safety_cut_in_codeblock_default.md': `The "sp" command ignores Markdown structure entirely — this test proves it.
\`\`\`javascript
const a = 1;
✂️
const b = 2;
\`\`\`
Even inside a code block, the marker triggers a physical split.`,

    '13_sp_safety_long_and_invalid_chars_default.md': `File-system forbidden characters in content: \\/:*?"<>|
✂️
\\/:*?"<>|【Forbidden character stress test】
These characters are automatically sanitised and the title is trimmed to 50 chars.`,

    '14_sp_safety_massive_volume_default.md': `Physical-cut high-volume stress test.
✂️
[HIGH LOAD STRESS TEST DUMMY DATA]
` + genBody("This is a massive, dense block of raw text. It represents a user's brain dump. ", 100),

    // --- Warn: intentional anti-patterns for sp ---
    '15_sp_warn_inline_cut_default.md': `This is text ✂️ and more text on the same line.
The cut marker must occupy its own independent line — inline markers are ignored.`,

    // =========================================================================
    // GROUP 2: list (structural splitter) — 16-36
    // =========================================================================

    // --- Showcase: how to use list ---
    '16_list_showcase_flat_h1_default.md': `# Monday Meeting Minutes
${denseEN1}
# Tuesday Meeting Minutes
${denseEN2}
# Wednesday Meeting Minutes
${denseEN3}`,

    '17_list_showcase_nested_standard_default.md': `# Chapter 1: Basics
This is the overview.
## Introduction
${denseEN1}
## Installation
${denseEN2}
# Chapter 2: Advanced
## Deep Dive
${denseEN1}`,

    '18_list_showcase_nested_single_default.md': `# Project Reports
## Week 01 Status
${denseEN1}
## Week 02 Status
${denseEN2}
## Week 03 Status
${denseEN3}`,

    '19_list_showcase_typing_support_default.md': `v Typing-assist proof: this line becomes the parent folder name!
Prefix a line with lowercase "v " (v + space) and it is treated as "# " (H1) at runtime.
vv Speed-typing smart key substitution
Prefix "vv " and it becomes "## " (H2).
vv Folder expansion without leaving home row
At execution the document is split just like a normally-written heading structure.`,

    '20_list_showcase_typing_support_vvv_default.md': `v Parent folder
vv Child file
vvv Grandchild level via typing-assist
A line starting with "vvv " is automatically expanded to "### " (H3).
This drastically reduces how often you need to press Shift+3.`,

    '21_list_option_custom_depth_opt.md': `# Recipe Book
## Breakfast Menu (normally a split point, but skipped this run)
### Morning Hot Sandwich
This H3 section is extracted as its own file when "###" is passed as the depth argument.
### Morning Smoothie
Passing "###" targets H3 splits instead of the default H2.`,

    '22_list_option_keep_opt.md': `# My Notes
## Heading hierarchy preservation
Normally, heading levels are promoted after splitting (## → #).
With the "keep" option the original heading depth is preserved as-is.`,

    '23_list_option_un_opt.md': `# Dictionary
## Apple
Apple is a fruit.
## Banana
Banana is a fruit.
## Cherry
Cherry is a fruit.
(The "un" option removes the leading sequential number from all output file names.)`,

    '24_list_option_toc_opt.md': `# Project Specification
## Overview
System overview content.
## Requirements
Functional and environment requirements.
(The -toc option places a 00_TOC.md with relative links to every split file.)`,

    '25_list_option_heading_promotion_default.md': `# Original Document Title
## First Section
Split files normally have their headings promoted by one level (## → #).
This ensures that each child file reads naturally as a self-contained document.`,

    // --- Safety: edge-case robustness for list ---
    '26_list_safety_overview_logic_default.md': `# Main Title
This introductory text appears before the first H2.
SPLIST detects it automatically and saves it as "00_Overview.md".
## First Section
Normal H2 content starts here.`,

    '27_list_safety_naming_limit_default.md': `# Heading Safety Test
## 1. Forbidden characters auto-sanitised \\/:*?"<>|
Heading text containing OS-forbidden characters is cleaned before use as a filename.
## 2. Surrogate-pair emoji 👨‍👩‍👧‍👦 preserved accurately
Complex emoji and ligatures survive the round-trip without corruption.
## 3. This is an intentionally very long heading that exceeds fifty Unicode code points to verify the automatic trimming safeguard
Headings longer than 50 chars are trimmed to 50; no crash, no data loss.`,

    '28_list_safety_deep_nesting_default.md': `# Level 1
## Level 2
### Level 3
#### Level 4
##### Level 5
###### Level 6
Even six levels of nesting are handled without corrupting the folder/file structure.`,

    '29_list_safety_duplicate_headings_default.md': `# Duplicate heading collision avoidance
## Sub-section
Content A.
## Sub-section
Identical heading names do not overwrite each other — a unique suffix is applied automatically.`,

    '30_list_safety_mixed_markers_default.md': `# Bullets and headings mixed
* A bullet point
* Not a heading
## Valid heading
- Hyphen list item
The heading parser must not misidentify list markers as headings.`,

    '31_list_safety_codeblock_trap_default.md': `# Valid Heading 1
\`\`\`markdown
# Fake heading inside code block
## These must be ignored
\`\`\`
## Closing real heading
Fake headings inside code fences must never generate folders or files.`,

    '32_list_safety_front_matter_default.md': `---
title: Test Document
tags: [test, play]
---
# Actual Heading
YAML front matter (--- delimited) at the top must not be mistaken for a heading or HR.`,

    '33_list_option_front_matter_fmex_opt.md': `---
title: Exclude Front Matter Test
tags: [test, fmex]
---
# Heading A
This front matter should be completely excluded from the output.`,

    '34_list_option_front_matter_fm01_opt.md': `---
title: Extract Front Matter Test
tags: [test, fm01]
---
# Heading B
This front matter should be extracted into 01_FrontMatter.md.`,

    '35_list_option_front_matter_fm00_opt.md': `---
title: Prepend Front Matter Test
tags: [test, fm00]
---
# Heading C
This front matter should be prepended to the first output file (default logic, explicitly requested).`,

    '36_list_safety_bad_markdown_default.md': `#NoSpaceHeading
##  Heading with excess leading space
#
### Empty heading body
Malformed markdown edge cases must not crash the process.`,

    '37_list_safety_massive_volume_default.md': `# Large-Volume Parse Stress Test
` + genBody('## Repeated Section\nContent that accumulates heavily below.\n', 50),

    // --- Warn: intentional anti-patterns for list ---
    '38_list_warn_no_space_heading_default.md': `#NoSpaceHere
No space after "#" means this is NOT parsed as a heading.
## Valid heading with space
This one is recognised correctly.`,

    '39_list_warn_unclosed_codeblock_default.md': `# Valid Heading 1
\`\`\`javascript
const a = 1;
// Code block is never closed before the next heading

# Valid Heading 2
Any heading inside an unclosed code fence is treated as code — not a split point.`,

    // =========================================================================
    // GROUP 3: common options (conflict resolution) — 37-41
    // =========================================================================
    '40_common_option_conflict_default_default.md': `# Duplicate-resolution test
## Default behaviour
Re-running on the same file auto-creates _v02, _v03 … folders without overwriting.`,

    '41_common_option_conflict_date_opt.md': `# Duplicate-resolution test
## Date suffix option
The -d flag appends today's date (e.g. _20260718) to the output folder name.`,

    '42_common_option_conflict_time_opt.md': `# Duplicate-resolution test
## Datetime suffix option
The -t flag appends date + current time (e.g. _20260718_153000) to the folder name.`,

    '43_common_option_conflict_skip_opt.md': `# Duplicate-resolution test
## Skip option
The -s flag silently skips execution when the output folder already exists.`,

    '44_common_option_conflict_force_opt.md': `# Duplicate-resolution test
## Force-overwrite option
The -f flag deletes the existing folder first, then writes fresh output.`,

    // --- Integration: real-world Markdown edge cases ---
    '48_integration_no_h2_only_h3_default.md': `# Open UI Charter
### Background
Since the beginning, web browsers have provided form controls.
### Mission
Our mission is to standardise UI components.`,

    '49_integration_multi_h1_sentinel_default.md': `# Sentinel Title
Welcome to Microsoft Sentinel.
# Sentinel Resources
* Documentation link
# Sentinel Contribution guidelines
This project welcomes contributions.
## Add contributions
How to contribute.`,

    '50_integration_markdown_formatting_in_heading_default.md': `# Extension Guide
This is an overview.
## [API Reference](https://code.visualstudio.com/api)
Link inside heading.
## The \`config\` object
Code quotes inside heading.
## **Bold** and *Italic*
Formatting inside heading.`,

    '51_integration_no_headings_default.md': `This is a document without any headings.
It just contains some plain text.
And maybe some lists or code blocks.`,

    '52_integration_open_brand_h1_preceding_default.md': `#### [ Main Header Banner ]
# Open Brand Spec
Define the brand spec.
## Design specs
Dimensions and sizes.`,

    '53_integration_mui_changelog_no_h1_default.md': `## v8
This version is skipped.
## 7.3.8
A big thanks to contributors.
### @mui/material@7.3.8
Details here.`
};

// ---------------------------------------------------------------------------
// Helper: Copy source file with fallback placeholder creation
// ---------------------------------------------------------------------------
const copyWithFallback = (srcName, destName, fallbackContent) => {
    const srcPath = path.join(__dirname, srcName);
    const destPath = path.join(demoDir, destName);
    const icon = destName.includes('_sp_') ? '✂️ ' : '🔢';
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`  ${icon} Loaded: ${destName}`);
    } else {
        fs.writeFileSync(destPath, fallbackContent, 'utf-8');
        console.log(`  ⚠️  Created Placeholder: ${destName}`);
    }
};

// ---------------------------------------------------------------------------
// Prepare all file generation tasks in a queue to guarantee sorted output
// ---------------------------------------------------------------------------
const generationTasks = [];

// Tasks for 01-41, 45-50
for (const [filename, content] of Object.entries(testFiles)) {
    generationTasks.push({
        filename,
        execute: () => {
            const filePath = path.join(demoDir, filename);
            fs.writeFileSync(filePath, content.trim() + '\n', 'utf-8');
            const icon = filename.includes('_sp_') ? '✂️ ' : '🔢';
            console.log(`  ${icon} Created: ${filename}`);
        }
    });
}

// Task for Case 42: 100-section volume generator (dynamic generation)
let content100 = '# README title\n\n';
for (let i = 1; i <= 100; i++) {
    const n = String(i).padStart(3, '0');
    content100 += `## SECTION${n}\ntexttexttexttexttexttext\ntexttexttexttexttexttext\n\n`;
}
generationTasks.push({
    filename: '45_list_massive_100_sections_default.md',
    execute: () => {
        fs.writeFileSync(path.join(demoDir, '45_list_massive_100_sections_default.md'), content100, 'utf-8');
        console.log(`  🔢 Created: 45_list_massive_100_sections_default.md`);
    }
});

// Task for Case 46: VS Code Color Theme
const vscodeThemeContent = `# Color Theme Integration
## Workbench Colors
- activityBar.background: #202020
- sideBar.background: #181818
- editor.background: #1e1e1e

## Syntax Colors
- comment: #6a9955
- keyword: #569cd6
- string: #ce9178
`;

generationTasks.push({
    filename: '46_integration_vscode_color_theme_default.md',
    execute: () => {
        fs.writeFileSync(path.join(demoDir, '46_integration_vscode_color_theme_default.md'), vscodeThemeContent.trim() + '\n', 'utf-8');
        console.log(`  🔢 Created: 46_integration_vscode_color_theme_default.md`);
    }
});

// Task for Case 44: Official Manual
generationTasks.push({
    filename: '47_integration_official_manual_default.md',
    execute: () => {
        copyWithFallback(
            '../USAGE.md',
            '47_integration_official_manual_default.md',
            `# SPLIST Official Manual\n## Introduction\nWelcome.\n## Installation\nnpm link.\n`
        );
    }
});

// Sort all tasks by filename
generationTasks.sort((a, b) => a.filename.localeCompare(b.filename));

// ---------------------------------------------------------------------------
// Execute all standard test cases (01-50) in numerical order
// ---------------------------------------------------------------------------
console.log('🚀 Starting: Generating clean demo files\n');

for (const task of generationTasks) {
    task.execute();
}

console.log('\n🎉 Generated!');

// ---------------------------------------------------------------------------
// Generate the Test Runner (demo_cases_run.js) in the output folder
// ---------------------------------------------------------------------------
const runScriptContent = `const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');

const demoDir = __dirname;
const outDir  = path.join(__dirname, '../demo_cases_splisted');

console.log('🚀 Starting: Automated Test Suite\\n');

// Reset output folder on every run for a clean diff
if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir);
console.log(\`🧹 Reset output folder: \${outDir}\\n\`);

// ---------------------------------------------------------------------------
// Option resolver: maps filename keywords → CLI arguments
// ---------------------------------------------------------------------------
const resolveArgs = (file) => {
    if (file.includes('_custom_marker_opt'))     return '"==="';
    if (file.includes('_custom_depth_opt'))       return '"###"';
    if (file.includes('_option_un_opt'))          return 'un';
    if (file.includes('_option_keep_opt'))        return 'keep';
    if (file.includes('_option_toc_opt'))         return '-toc';
    if (file.includes('_conflict_date_opt'))      return '-d';
    if (file.includes('_conflict_time_opt'))      return '-t';
    if (file.includes('_conflict_skip_opt'))      return '-s';
    if (file.includes('_conflict_force_opt'))     return '-f';
    if (file.includes('_fmex'))                   return '-fmex';
    if (file.includes('_fm00'))                   return '-fm00';
    if (file.includes('_fm01'))                   return '-fm01';
    return '';
};

// ---------------------------------------------------------------------------
// Subcommand resolver: maps filename prefix → sp | list
// ---------------------------------------------------------------------------
const resolveSubcmd = (file) => {
    if (file.includes('_sp_'))                    return 'sp';
    if (file.includes('_list_'))                  return 'list';
    if (file.includes('_integration_'))           return 'list';
    if (file.includes('_common_'))                return 'list';
    return null;
};

// ---------------------------------------------------------------------------
// Human-readable test category label
// ---------------------------------------------------------------------------
const categoryLabel = (file) => {
    if (file.includes('_warn_'))     return '⚠️  [warn]   ';
    if (file.includes('_safety_'))   return '🛡️  [safety] ';
    if (file.includes('_opt'))       return '⚙️  [option] ';
    if (file.includes('_showcase_')) return '✨  [demo]   ';
    if (file.includes('_massive_') || file.includes('_integration_')) return '🏗️  [load]   ';
    return '▶️  [run]    ';
};

// ---------------------------------------------------------------------------
// Execute all test cases in sorted order
// ---------------------------------------------------------------------------
const splistBin = path.join(__dirname, '../../src/cli/cli.js');
let files       = fs.readdirSync(demoDir).sort();

// Support for running specific cases (e.g. "01", "01-10", or "01,03,05-08")
const filterArg = process.argv[2];
if (filterArg) {
    const filters = filterArg.split(',');
    files = files.filter(f => {
        const num = parseInt(f.split('_')[0], 10);
        if (isNaN(num)) return false;

        return filters.some(filter => {
            if (filter.includes('-')) {
                const [startStr, endStr] = filter.split('-');
                const start = parseInt(startStr, 10);
                const end = parseInt(endStr, 10);
                return num >= start && num <= end;
            } else {
                return num === parseInt(filter, 10);
            }
        });
    });
    console.log(\`🎯 Filter applied: [\${filterArg}]\\n\`);
}

if (files.length === 0) {
    console.log('⚠️  No test cases matched the given filter.');
    process.exit(0);
}

files.forEach(file => {
    const subcmd = resolveSubcmd(file);
    if (!subcmd) return;

    const targetPath  = path.join(demoDir, file);
    const extraArgs   = resolveArgs(file);
    const label       = categoryLabel(file);
    const argDisplay  = extraArgs ? \` (args: \${extraArgs})\` : '';

    console.log(\`\${label} [splist \${subcmd}] \${file}\${argDisplay}\`);

    try {
        const cmd = \`node "\${splistBin}" "\${targetPath}" \${subcmd}\${extraArgs ? ' ' + extraArgs : ''}\`;
        execSync(cmd, {
            env: { ...process.env, SPLIST_OUT_DIR: outDir },
            stdio: 'inherit',
        });
    } catch (err) {
        console.error(\`❌ Error in \${file}:\`, err.message);
    }

    console.log('--------------------------------------------------');
});

console.log('\\n🎉 All Splisted!');
console.log(\`📁 Results: \${outDir}\\n\`);
`;

fs.writeFileSync(path.join(demoDir, 'demo_cases_run.js'), runScriptContent, 'utf-8');
console.log(`  ⚙️  Created: demo_cases_run.js (Test Runner)`);

console.log(`   Run "cd demo_cases_raw && node demo_cases_run.js" to execute all tests.\n`);
