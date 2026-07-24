#!/usr/bin/env node
// ============================================================
// 🚀 cli.js — SPLIST Command Line Interface
// ============================================================
// Entry point when executed as `splist <file>` from terminal.
// Parses arguments as receptionist and delegates to core (splist.js).
// ============================================================

'use strict';

const fs = require('fs');
const path = require('path');
const { parseOptions } = require('./argsParser.js');
const { runSplist } = require('../core/splist/splist.js');

// Load user-customized extension hooks if available
// Ignore errors if the file does not exist or fails to load
let customOptions = {};
try {
    customOptions = require('../core/options/option.js');
} catch (err) {
    // Ignore error to run with defaults even without extensions
}

// Get terminal arguments (node cli.js [0] [1] [2]...)
const args = process.argv.slice(2);

// Display help and exit if no arguments are provided or help flag is passed
if (args.length === 0 || ['-h', '--help'].includes(args[0])) {
    console.log(`
🚀 SPLIST v2 - CLI
Usage: splist <targetFile.md> [options]

Options:
  -v           (Default) Append _v02, _v03 for output folder
  -d, -date    Append _YYYYMMDD for output folder
  -t, -time    Append _YYYYMMDD_HHMMSS for output folder
  -s, -skip    Skip if output folder already exists
  -f, -force   Overwrite existing folder
  -o, -out     Specify output directory (e.g. -o ./my_folder)
  -toc         Generate a Table of Contents (TOC)
  -fmex        Exclude front matter from output chunks
  -fm00        Extract front matter to 00_FrontMatter.md (default)
  -fm01        Keep front matter in 01 chunk
  [custom]     Any unrecognised text becomes a custom split marker

Examples:
  splist note.md -d -toc
  splist note.md "===|" -o C:\\Temp
`);
    process.exit(0);
}

// Handle version flag specifically if it's the only argument
if (args.length === 1 && ['-v', '-V', '--version'].includes(args[0])) {
    const pkg = require('../../package.json');
    console.log(`🚀 SPLIST v${pkg.version}`);
    if (args[0] === '-v') {
        console.log(`\n💡 Note: When splitting a file, '-v' is used as a flag for the default folder conflict resolution (e.g., appending _v02).`);
    }
    process.exit(0);
}

const targetFile = args[0];

// Validate target file existence
if (!fs.existsSync(targetFile)) {
    console.error(`❌ Error: File not found -> ${targetFile}`);
    process.exit(1);
}

// Parse arguments into config
const config = parseOptions(args.slice(1), targetFile);

// Delegate execution to the core pipeline
runSplist(targetFile, config, customOptions).catch(err => {
    console.error(`💥 Pipeline Error:`, err);
    process.exit(1);
});
