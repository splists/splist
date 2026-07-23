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