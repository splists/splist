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
