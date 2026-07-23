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