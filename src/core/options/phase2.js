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
