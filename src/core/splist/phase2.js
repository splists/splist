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