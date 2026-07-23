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