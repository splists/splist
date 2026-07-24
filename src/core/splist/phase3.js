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

/** Escapes regex metacharacters so user-provided marker is treated as a literal string. @param {string} value @returns {string} */
const escapeRegExp = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ──── [Phase 3-A] Rule Generation ────START
/** Creates a rule object for splistEngine. @param {string|null} [customMarker] @param {Object} [config] @returns {{ test: Function, isExactMatch: Function, extractTitle: Function }} */
const createMarkerRule = (customMarker = null, config = {}) => {
    if ((config.mode || 'sp') === 'list' && !customMarker) {
        return { test: line => /^##\s+/.test(line), isExactMatch: () => false, extractTitle: line => line };
    }
    const p = customMarker ? escapeRegExp(customMarker) : '✄|✂️|cut|v';
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