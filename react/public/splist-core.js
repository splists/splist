
// ============================================================
// SPLIST CORE BUNDLE FOR WEB (Zero-Dependency Auto-Generated)
// ============================================================
(function(window) {

  // Virtual File System & Path Mock for Browser
  window.VFS = {};
  window.SPLIST_OUTPUT = [];
  
  // Mock NodeJS process object
  window.process = {
    cwd: () => '/',
    env: {}, // Add empty env object
    exit: (code) => { throw new Error('Process exited with code ' + code); }
  };

  const fsMock = {
    existsSync: (p) => !!(window.VFS && window.VFS[p]), // Check if file exists in Virtual File System
    mkdirSync: () => {},
    rmSync: () => {},
    readFileSync: (filepath) => {
      return window.VFS[filepath] || '';
    },
    writeFileSync: (filepath, data) => {
      // Intercept file write and store in virtual memory!
      window.SPLIST_OUTPUT.push({ filepath, data });
    }
  };

  const pathMock = {
    join: (...args) => args.join('/').replace(/\\/g, '/').replace(/\/\//g, '/'),
    resolve: (...args) => '/' + args.join('/').replace(/\\/g, '/').replace(/\/\//g, '/'),
    basename: (p, ext) => {
      let base = p.split('/').pop().split('\\').pop();
      if (ext && base.endsWith(ext)) base = base.slice(0, -ext.length);
      return base;
    },
    dirname: (p) => p.split('/').slice(0, -1).join('/') || '.',
    extname: (p) => {
      const parts = p.split('.');
      return parts.length > 1 ? '.' + parts.pop() : '';
    },
    parse: (p) => {
      const base = p.split('/').pop();
      const ext = pathMock.extname(base);
      return { base, ext, name: base.slice(0, base.length - ext.length) };
    }
  };

  // Basic child_process mock
  const childProcessMock = {
    exec: () => {}
  };

  // Simple CommonJS loader
  const modules = {};
  function require(id, currentDir) {
    if (id === 'fs') return fsMock;
    if (id === 'path') return pathMock;
    if (id === 'child_process') return childProcessMock;
    
    // Resolve relative paths
    let resolvedId = id;
    if (id.startsWith('.')) {
      // Very simple resolution for our specific folder structure
      if (currentDir === '../options' && id === './phase1.js') resolvedId = '../options/phase1.js';
      else if (currentDir === '../options' && id === './phase2.js') resolvedId = '../options/phase2.js';
      else if (currentDir === '../options' && id === './phase3.js') resolvedId = '../options/phase3.js';
      else if (currentDir === '../options' && id === './phase4.js') resolvedId = '../options/phase4.js';
      else if (currentDir === '.' && id === '../engine.js') resolvedId = '../engine.js';
      else if (currentDir === '.' && id === '../options/option.js') resolvedId = '../options/option.js';
      else resolvedId = id; // fallback
    }
    
    let modKey = resolvedId.replace(/.js$/, '');
    
    if (modules[modKey]) {
      return modules[modKey].exports;
    }
    throw new Error('Module not found in bundle: ' + id + ' (resolved as ' + modKey + ') from ' + currentDir);
  }


  // --- Module: ../engine.js (id: ../engine) ---
  modules['../engine'] = { exports: {} };
  (function(module, exports, require) {
    // ============================================================
// CORE ENGINE: Stream Generator
// ============================================================
// ⚠️ IMMUTABLE CORE ENGINE (Charter Article 3)
// Based on the Principle of Separation of Structure and Logic,
// strictly NO MODIFICATIONS are allowed to this generator function.
// All custom splitting logic must be defined within `splistRule`.
// ============================================================
'use strict';

/**
 * Core generator engine that processes text lines and yields chunked strings.
 * @internal
 * @param {AsyncIterable<string>|Iterable<string>} splistLines
 * @param {{ test: (line: string) => boolean }} splistRule
 * @returns {AsyncGenerator<string>}
 */
exports.splistEngine = async function* (splistLines, splistRule) {
    let splistChunk = [];
    for await (const splistLine of splistLines) {
        if (splistRule.test(splistLine) && splistChunk.length) {
            yield splistChunk.join('\n');
            splistChunk = [];
        }
        splistChunk.push(splistLine);
    }
    if (splistChunk.length) yield splistChunk.join('\n');
};
  })(modules['../engine'], modules['../engine'].exports, function(id) { return require(id, '..'); });
  
  // --- Module: ./phase1.js (id: ./phase1) ---
  modules['./phase1'] = { exports: {} };
  (function(module, exports, require) {
    // ============================================================
// PHASE 1: Input & Cleanse & Protect
// ============================================================
// [1-A] Ingest  : Safely read the target file and convert it into an array of lines.
// [1-B] Cleanse : Sanitize and normalize the input lines.
// [1-C] Protect : Extract and protect Front Matter, isolating it from the core engine.
// For custom extensions, please provide hooks in `options/phase1`.
// As a general rule, this core file should strictly remain unmodified.
// ============================================================
'use strict';
const fs = require('fs');

// ──── [Phase 1-A] Ingest ────START
/** Safely reads the target file. Terminates if not found. @param {string} targetFile @returns {string[]} */
const readLinesSafe = (targetFile) => {
    if (!fs.existsSync(targetFile)) {
        console.error(`❌ Error: File not found -> ${targetFile}`);
        process.exit(1);
    }
    return fs.readFileSync(targetFile, 'utf-8').split(/\r?\n/);
};
// ──── [Phase 1-A] Ingest ────END

// ──── [Phase 1-B] Cleansing ────START
// [1-B] Cleanse : Sanitize and normalize the input lines.
// (Add custom cleansing logic here in the future if necessary)
// ──── [Phase 1-B] Cleansing ────END

// ──── [Phase 1-C] Protect ────START
/** Validates if lines in Front Matter are valid YAML. @param {string[]} lines @returns {boolean} */
const isValidFrontMatter = (lines) => {
    return lines.every(line => {
        const trimmed = line.trim();
        if (trimmed === '' || trimmed.startsWith('#') || trimmed.startsWith('-')) return true;
        return trimmed.includes(':'); // key: value pair
    });
};

/** Extracts YAML Front Matter. Returns empty string if not found. @param {string[]} lines @returns {{ frontMatter: string, contentLines: string[] }} */
const extractFrontMatter = (lines) => {
    if (lines.length > 0 && lines[0].trim() === '---') {
        let fmEndIndex = -1;
        const searchLimit = Math.min(lines.length, 51);
        for (let i = 1; i < searchLimit; i++) {
            if (lines[i].trim() === '---') { fmEndIndex = i; break; }
        }
        if (fmEndIndex !== -1) {
            const fmLines = lines.slice(1, fmEndIndex);
            if (isValidFrontMatter(fmLines)) {
                return {
                    frontMatter: lines.slice(0, fmEndIndex + 1).join('\n') + '\n',
                    contentLines: lines.slice(fmEndIndex + 1)
                };
            }
        }
    }
    return { frontMatter: '', contentLines: lines };
};
// ──── [Phase 1-C] Protect ────END

module.exports = { readLinesSafe, extractFrontMatter };
  })(modules['./phase1'], modules['./phase1'].exports, function(id) { return require(id, '.'); });
  
  // --- Module: ./phase2.js (id: ./phase2) ---
  modules['./phase2'] = { exports: {} };
  (function(module, exports, require) {
    // ============================================================
// PHASE 2: Output Environment
// ============================================================
// [2-A] Resolve   : Resolves naming conflicts for the output directory.
// [2-B] Provision : Determines and safely creates the output directory.
// [2-C] Setup     : (Placeholder) Prepares internal directory structure.
// For custom extensions, please provide hooks in `options/phase2`.
// As a general rule, this core file should strictly remain unmodified.
// ============================================================
'use strict';
const fs = require('fs'), path = require('path');

// ──── [Phase 2-A] Resolve ────START
/** Resolves safe output path based on conflictMode ('v'|'d'|'t'|'s'|'f'). UTC standard used for 'd'/'t'. @param {string} b @param {string} m @returns {string|null} */
const resolveOutputDir = (b, m = 'v') => {
    if (m === 'f') return b;
    if (m === 's') return fs.existsSync(b) ? (console.log(`⚠️ Skipped: already exists -> ${path.basename(b)}`), null) : b;
    if (m === 'd' || m === 't') {
        const iso = new Date().toISOString(), d = iso.slice(0, 10).replace(/-/g, '');
        return m === 'd' ? `${b}_${d}` : `${b}_${d}_${iso.slice(11, 19).replace(/:/g, '')}`;
    }
    if (!fs.existsSync(b)) return b;
    let v = 2, c;
    do { c = `${b}_v${String(v++).padStart(2, '0')}`; } while (fs.existsSync(c));
    return c;
};
// ──── [Phase 2-A] Resolve ────END

// ──── [Phase 2-B] Provision ────START
/** Determines and creates the output directory. @param {string} f @param {string} p @param {string} m @param {string|null} [c] @returns {string|null} */
const prepareOutputDir = (f, p, m, c = null) => {
    const dir = c || process.env.SPLIST_OUT_DIR || path.dirname(f);
    const outDir = resolveOutputDir(path.join(dir, `${p}${path.basename(f, path.extname(f))}`), m);
    if (!outDir) return null;
    if (m === 'f' && fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true, force: true });
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    return outDir;
};
// ──── [Phase 2-B] Provision ────END

// ──── [Phase 2-C] Setup ────START
// (Add custom initialization or directory structuring logic here in the future if necessary)
// ──── [Phase 2-C] Setup ────END

module.exports = { resolveOutputDir, prepareOutputDir };
  })(modules['./phase2'], modules['./phase2'].exports, function(id) { return require(id, '.'); });
  
  // --- Module: ./phase3.js (id: ./phase3) ---
  modules['./phase3'] = { exports: {} };
  (function(module, exports, require) {
    // ============================================================
// PHASE 3: Rule & Chunk Naming
// ============================================================
// [3-A] Rule Generation : Generates marker or heading matching rules for the core engine.
// [3-B] Chunk Naming    : Sanitizes and truncates extracted titles for OS-safe file naming.
// [3-C] Post-Process    : (Placeholder) Prepares custom title or rule hooks.
//
// For custom extensions, please provide hooks in `options/phase3`.
// As a general rule, this core file should strictly remain unmodified.
// ============================================================
'use strict';
const INVALID_CHAR = /[\\/:*?"<>|]/g, H_CLEAN = /^#+\s+/;

// ──── [Phase 3-A] Rule Generation ────START
/** Creates a rule object for splistEngine. @param {string|null} [customMarker] @param {Object} [config] @returns {{ test: Function, isExactMatch: Function, extractTitle: Function }} */
const createMarkerRule = (customMarker = null, config = {}) => {
    if ((config.mode || 'sp') === 'list' && !customMarker) {
        return { test: line => /^##\s+/.test(line), isExactMatch: () => false, extractTitle: line => line };
    }
    const p = customMarker || '✄|✂️|cut|v';
    const testRegex = new RegExp(`^(?:${p})(?:\\s+|$)`, 'i');
    const exactRegex = new RegExp(`^(?:${p})\\s*$`, 'i');
    const replaceRegex = new RegExp(`^\\s*(?:${p})\\s*`, 'i');

    return {
        test: line => testRegex.test(line.trim()),
        isExactMatch: line => exactRegex.test(line.trim()),
        extractTitle: line => line.replace(replaceRegex, '').trim()
    };
};
// ──── [Phase 3-A] Rule Generation ────END

// ──── [Phase 3-B] Chunk Naming ────START
/** Sanitizes markdown and OS-forbidden characters into a safe filename title. @param {string} firstLine @returns {string} */
const getSafeTitle = (firstLine) => {
    const stripped = (firstLine || '')
        .replace(H_CLEAN, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        .replace(/_([^_]+)_/g, '$1');

    const raw = stripped.trim().replace(INVALID_CHAR, '');
    return Array.from(raw).slice(0, 50).join('').trim() || 'Part';
};
// ──── [Phase 3-B] Chunk Naming ────END

// ──── [Phase 3-C] Post-Process ────START
// (Add custom rule or title transformation logic here in the future if necessary)
// ──── [Phase 3-C] Post-Process ────END

module.exports = { createMarkerRule, getSafeTitle };
  })(modules['./phase3'], modules['./phase3'].exports, function(id) { return require(id, '.'); });
  
  // --- Module: ./phase4.js (id: ./phase4) ---
  modules['./phase4'] = { exports: {} };
  (function(module, exports, require) {
    // ============================================================
// PHASE 4: Save & Finish
// ============================================================
// [4-A] Hyperlink : Generates ANSI OSC 8 clickable terminal links.
// [4-B] Finish    : Writes optional TOC file, opens it, and outputs completion banner.
// [4-C] Complete  : (Placeholder) Prepares custom completion hooks.
//
// For custom extensions, please provide hooks in `options/phase4`.
// As a general rule, this core file should strictly remain unmodified.
// ============================================================
'use strict';
const fs = require('fs'), path = require('path'), { exec } = require('child_process');

// ──── [Phase 4-A] Terminal Hyperlink ────START
/** Generates an ANSI OSC 8 clickable terminal link for a file path. @param {string} text @param {string} absPath @returns {string} */
const makeClickable = (text, absPath) => {
    const safe = encodeURI(path.resolve(absPath).replace(/\\/g, '/')).replace(/#/g, '%23');
    return `\x1b]8;;file://${safe.startsWith('/') ? '' : '/'}${safe}\x07${text}\x1b]8;;\x07`;
};
// ──── [Phase 4-A] Terminal Hyperlink ────END

// ──── [Phase 4-B] Finish Process ────START
/** Handles process termination, TOC generation, auto-open, and completion output. @param {string} outDir @param {string|null} [tocContent] @param {boolean} [generateToc] @param {string} [ext] */
const finishProcess = (outDir, tocContent = null, generateToc = false, ext = '.md') => {
    if (generateToc && tocContent) {
        const name = `00_TOC${ext}`, filePath = path.join(outDir, name);
        fs.writeFileSync(filePath, tocContent);
        console.log(`✅ Created: ${makeClickable(name, filePath)}`);
        const cmd = process.platform === 'win32' ? 'start ""' : process.platform === 'darwin' ? 'open' : 'xdg-open';
        exec(`${cmd} "${filePath}"`, () => { });
    }
    console.log(`\n🎉 Splisted!\n📁 Saved to: ${makeClickable(outDir, outDir)}`);
};
// ──── [Phase 4-B] Finish Process ────END

// ──── [Phase 4-C] Completion Hook ────START
// (Add custom post-completion logic here in the future if necessary)
// ──── [Phase 4-C] Completion Hook ────END

module.exports = { makeClickable, finishProcess };
  })(modules['./phase4'], modules['./phase4'].exports, function(id) { return require(id, '.'); });
  
  // --- Module: ../options/phase1.js (id: ../options/phase1) ---
  modules['../options/phase1'] = { exports: {} };
  (function(module, exports, require) {
    // ============================================================
// 🔌 OPTION: Phase 1 Extensions (Ingest, Extract, Protect)
// ============================================================
// Writing custom logic here extends the default behavior of Phase 1.
//
// Usage:
//   - If left as `null`, the default engine logic is used as-is.
//   - If a function is provided, its logic is executed on top of the default.
//
// Examples of features that can be added (see options_docs/phase1):
//   - Automatic character encoding conversion (e.g., Shift-JIS -> UTF-8)
//   - Direct reading from a URL
//   - Reading from standard input (stdin)
//   - Protecting <!-- splist-ignore-start --> zones
//   - Preventing accidental splits inside code blocks or math formulas (LaTeX)
// ============================================================

// ──────────────────────────────────────────────────────────
// [Phase 1-A] Ingest Hook
// ──────────────────────────────────────────────────────────

// Called immediately after reading with readLinesSafe.
// Receives the raw array of lines and returns a processed array of lines.
// If left as `null`, it performs the default behavior (does nothing).
//
// Example: Converting Shift-JIS to UTF-8 or normalizing characters
// exports.transformLines = (lines, config) => {
//     return lines.map(line => line.normalize('NFC'));
// };
exports.transformLines = null;


// ──────────────────────────────────────────────────────────
// [Phase 1-C] Protect Hook
// ──────────────────────────────────────────────────────────

// Called after extractFrontMatter, right before passing to the core engine.
// Receives contentLines and returns processed contentLines.
// If left as `null`, it performs the default behavior (does nothing).
//
// Example: Hiding everything after a <!-- splist-ignore --> line from the engine
// exports.transformContent = (contentLines, frontMatter, config) => {
//     const ignoreIdx = contentLines.findIndex(l => l.trim() === '<!-- splist-ignore -->');
//     return ignoreIdx === -1 ? contentLines : contentLines.slice(0, ignoreIdx);
// };
exports.transformContent = null;

  })(modules['../options/phase1'], modules['../options/phase1'].exports, function(id) { return require(id, '../options'); });
  
  // --- Module: ../options/phase2.js (id: ../options/phase2) ---
  modules['../options/phase2'] = { exports: {} };
  (function(module, exports, require) {
    // ============================================================
// 🔌 OPTION: Phase 2 Extensions (Output Environment Setup)
// ============================================================
// Writing custom logic here extends the output folder determination process.
//
// Usage:
//   - If left as `null`, the default engine logic is used as-is.
//   - If a function is provided, its logic is executed instead of (or after) the default.
//
// Examples of features that can be added (see options_docs/phase2):
//   - Automatic backup and generation management of the output destination
//   - Reading Front Matter tags to dynamically route folders
//   - Support for dry-run (--dry-run) mode
//   - Pre-checking disk space capacity
//   - Preparing temporary folders for Zip archiving
// ============================================================

// ──────────────────────────────────────────────────────────
// Output Folder Resolution Hook
// ──────────────────────────────────────────────────────────

// Called immediately after the folder path is determined by prepareOutputDir.
// Receives the resolved outDir and returns the final path.
// If left as `null`, it performs the default behavior (uses the original outDir).
//
// Example: Reading the category from Front Matter to route into subfolders
// exports.resolveOutDir = (outDir, config) => {
//     const category = config.frontMatterData?.category;
//     return category ? require('path').join(outDir, category) : outDir;
// };
exports.resolveOutDir = null;

  })(modules['../options/phase2'], modules['../options/phase2'].exports, function(id) { return require(id, '../options'); });
  
  // --- Module: ../options/phase3.js (id: ../options/phase3) ---
  modules['../options/phase3'] = { exports: {} };
  (function(module, exports, require) {
    // ============================================================
// OPTION: Phase 3 Extensions (Rule & Chunk Naming)
// ============================================================
// Custom hooks to extend or override marker rules and title resolving.
//
// Usage:
//   - Keep exports as `null` to use default core behavior (`phase3.js`).
//   - Provide custom functions to override specific phase operations.
// ============================================================
'use strict';

// ──── [Option 3-A] Rule Generation Hook ────
/**
 * Custom rule generator hook.
 * Overrides `createMarkerRule` from core phase3.
 *
 * Example: Custom marker pattern
 * exports.createRule = (config) => {
 *     const { createMarkerRule } = require('../splist/phase3.js');
 *     return createMarkerRule('===|---');
 * };
 */
exports.createRule = null;

// ──── [Option 3-B] Chunk Naming Hook ────
/**
 * Custom title resolution hook.
 * Overrides default title extraction for chunk filenames.
 *
 * Example: High-performance title resolution or custom naming format
 * exports.resolveTitle = (title, lines, config) => {
 *     const { getSafeTitle } = require('../splist/phase3.js');
 *     // High-speed header extraction using lines array
 *     return getSafeTitle(lines[0] || title);
 * };
 */
exports.resolveTitle = null;
  })(modules['../options/phase3'], modules['../options/phase3'].exports, function(id) { return require(id, '../options'); });
  
  // --- Module: ../options/phase4.js (id: ../options/phase4) ---
  modules['../options/phase4'] = { exports: {} };
  (function(module, exports, require) {
    // ============================================================
// 🔌 OPTION: Phase 4 Extensions (Save, Finalize, Export)
// ============================================================
// Writing custom logic here extends how chunks are written out
// and allows you to add post-processing after completion.
//
// Usage:
//   - If left as `null`, the default engine logic is used as-is.
//   - If a function is provided, its logic is executed before, after, or instead of the default.
//
// Examples of features that can be added (see options_docs/phase4):
//   - Export as a Zip archive
//   - Export in JSON / YAML formats
//   - Automatically execute another command after export (e.g., git add)
//   - Automatically prepend/append headers and footers to each chunk
// ============================================================

// ──────────────────────────────────────────────────────────
// Chunk Content Transformation Hook
// ──────────────────────────────────────────────────────────

// Called right before writing each chunk to a file.
// Receives the content and returns the processed string.
// If left as `null`, it performs the default behavior (writes as-is).
//
// Example: Adding a common footer to each file
// exports.transformChunk = (content, filename, config) => {
//     return content + '\n\n---\n*Generated by SPLIST*\n';
// };
exports.transformChunk = null;


// ──────────────────────────────────────────────────────────
// Post-Completion Hook
// ──────────────────────────────────────────────────────────

// A post-processing hook called after finishProcess.
// If left as `null`, it performs the default behavior (does nothing).
//
// Example: Automatically run git add on the output folder
// exports.afterFinish = (outDir, config) => {
//     const { execSync } = require('child_process');
//     execSync(`git add "${outDir}"`, { stdio: 'inherit' });
// };
exports.afterFinish = null;

  })(modules['../options/phase4'], modules['../options/phase4'].exports, function(id) { return require(id, '../options'); });
  
  // --- Module: ../options/option.js (id: ../options/option) ---
  modules['../options/option'] = { exports: {} };
  (function(module, exports, require) {
    // ============================================================
// 🔌 option.js — Custom Options Orchestrator
// ============================================================
// Consolidates user-customized extension hooks for each phase
// into a single object and provides them to the main pipeline.
//
// ┌──────────────────────────────────────────────────┐
// │  splist.js (Main Pipeline)                       │
// │      ↑ Injects                                   │
// │  option.js (Extension Slot Orchestrator)         │
// │      ↑ Consolidates                              │
// │  phase1.js ~ phase4.js (User custom extensions)  │
// └──────────────────────────────────────────────────┘
// ============================================================

'use strict';

const customPhase1 = require('./phase1.js');
const customPhase2 = require('./phase2.js');
const customPhase3 = require('./phase3.js');
const customPhase4 = require('./phase4.js');

module.exports = {
    // ──── [Phase 1 Extensions] ────
    transformLines:   customPhase1.transformLines,
    transformContent: customPhase1.transformContent,

    // ──── [Phase 2 Extensions] ────
    resolveOutDir:    customPhase2.resolveOutDir,

    // ──── [Phase 3 Extensions] ────
    createRule:       customPhase3.createRule,
    resolveTitle:     customPhase3.resolveTitle,

    // ──── [Phase 4 Extensions] ────
    transformChunk:   customPhase4.transformChunk,
    afterFinish:      customPhase4.afterFinish,
};

  })(modules['../options/option'], modules['../options/option'].exports, function(id) { return require(id, '../options'); });
  
  // --- Module: ./splist.js (id: ./splist) ---
  modules['./splist'] = { exports: {} };
  (function(module, exports, require) {
    // ============================================================
// CORE ORCHESTRATOR: Default Pipeline
// ============================================================
// Main pipeline orchestrator for SPLIST.
// Connects Phase 1 -> Phase 2 -> Core Engine -> Phase 3 -> Phase 4.
//
// Custom extensions can override behavior using `customOptions` hooks.
// As a general rule, this core orchestrator should strictly remain unmodified.
// ============================================================
'use strict';
const fs = require('fs'), path = require('path');
const { splistEngine } = require('../engine.js');
const phase1 = require('./phase1.js');
const phase2 = require('./phase2.js');
const phase3 = require('./phase3.js');
const phase4 = require('./phase4.js');

/**
 * Main execution pipeline for SPLIST.
 * @param {string} targetFile
 * @param {Object} [config={}]
 * @param {Object} [customOptions={}]
 */
const runSplist = async (targetFile, config = {}, customOptions = {}) => {
    // ──── [Phase 1] Input & Protection ────
    let rawLines = phase1.readLinesSafe(targetFile);
    if (customOptions.transformLines) rawLines = customOptions.transformLines(rawLines) || rawLines;

    let { frontMatter, contentLines } = phase1.extractFrontMatter(rawLines);
    if (customOptions.transformContent) {
        const transformed = customOptions.transformContent({ frontMatter, contentLines });
        if (transformed) {
            frontMatter = transformed.frontMatter;
            contentLines = transformed.contentLines;
        }
    }

    // ──── [Phase 2] Output Environment ────
    const prefix = config.prefix || '✂️', conflictMode = config.conflictMode || 'v';
    let outDir = phase2.prepareOutputDir(targetFile, prefix, conflictMode, config.outDir);
    if (customOptions.resolveOutDir && outDir) {
        outDir = customOptions.resolveOutDir(targetFile, outDir, config) || outDir;
    }
    if (!outDir) return; // Skip process if output directory creation was skipped ('s' mode)

    // ──── [Phase 3-A] Rule Generation ────
    let rule = phase3.createMarkerRule(config.customMarker, config);
    if (customOptions.createRule) rule = customOptions.createRule(rule, config) || rule;

    const tocEntries = [], ext = path.extname(targetFile) || '.md';
    let chunkIndex = 1;

    const finalExt = config.ext || ext;

    // Handle FrontMatter extract00 (save to dedicated file)
    if (frontMatter && config.frontmatterMode === 'extract00') {
        const fmFileName = `00_FrontMatter${finalExt}`;
        fs.writeFileSync(path.join(outDir, fmFileName), frontMatter);
        tocEntries.push(`- [FrontMatter](./${encodeURIComponent(fmFileName)})`);
    }

    // ──── [ENGINE] Execution ────
    for await (const chunk of splistEngine(contentLines, rule)) {
        // ──── [Phase 3-B] Chunk Naming ────
        const lines = chunk.split('\n');
        const rawTitleLine = rule.isExactMatch(lines[0] || '') ? (lines[1] || '') : rule.extractTitle(lines[0] || '');

        let title = phase3.getSafeTitle(rawTitleLine);
        if (customOptions.resolveTitle) title = customOptions.resolveTitle(title, lines, config) || title;

        const fileName = config.un ? `${title}${finalExt}` : `${String(chunkIndex).padStart(2, '0')}_${title}${finalExt}`;
        const filePath = path.join(outDir, fileName);

        // ──── [Phase 4-A] Save Chunk ────
        let finalContent = chunk + '\n';

        // --- Markdown Heading Auto-Promotion (Lint > RAW) ---
        // Elevate the top heading of the chunk to H1, and shift all child headings accordingly.
        if (!config.keep && finalExt.toLowerCase() === '.md') {
            const linesArr = chunk.split('\n');
            const match = linesArr[0].match(/^(#+)\s/);
            if (match) {
                const shift = match[1].length - 1;
                if (shift > 0) {
                    finalContent = linesArr.map(l => {
                        const m = l.match(/^(#+)(\s.*)/);
                        if (m) {
                            const newCount = Math.max(1, m[1].length - shift);
                            return '#'.repeat(newCount) + m[2];
                        }
                        return l;
                    }).join('\n') + '\n';
                }
            }
        }

        // Handle FrontMatter extract01 (attach to first chunk only)
        if (frontMatter && config.frontmatterMode === 'extract01' && chunkIndex === 1) {
            finalContent = frontMatter + finalContent;
        }
        if (customOptions.transformChunk) {
            finalContent = customOptions.transformChunk(finalContent, { chunkIndex, title, outDir }) || finalContent;
        }

        fs.writeFileSync(filePath, finalContent);
        tocEntries.push(`- [${title}](./${encodeURIComponent(fileName)})`);
        chunkIndex++;
    }

    // ──── [Phase 4-B] Finish Process ────
    const tocContent = tocEntries.length > 0 ? `# Table of Contents\n\n${tocEntries.join('\n')}\n` : null;
    phase4.finishProcess(outDir, tocContent, config.generateToc, ext);
    if (customOptions.afterFinish) customOptions.afterFinish(outDir, config);
};

module.exports = { runSplist };
  })(modules['./splist'], modules['./splist'].exports, function(id) { return require(id, '.'); });
  
  // Expose the main entry point to the browser window
  window.SplistAPI = modules['./splist'].exports;
  window.SPLIST_OUTPUT = []; // To capture results

})(window);
