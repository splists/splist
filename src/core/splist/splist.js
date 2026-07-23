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

    // ──── [ENGINE] Execution ────
    for await (const chunk of splistEngine(contentLines, rule)) {
        // ──── [Phase 3-B] Chunk Naming ────
        const lines = chunk.split('\n');
        const rawTitleLine = rule.isExactMatch(lines[0] || '') ? (lines[1] || '') : rule.extractTitle(lines[0] || '');

        let title = phase3.getSafeTitle(rawTitleLine);
        if (customOptions.resolveTitle) title = customOptions.resolveTitle(title, lines, config) || title;

        const fileName = config.un ? `${title}${ext}` : `${String(chunkIndex).padStart(2, '0')}_${title}${ext}`;
        const filePath = path.join(outDir, fileName);

        // ──── [Phase 4-A] Save Chunk ────
        let finalContent = chunk + '\n';

        // --- Markdown Heading Auto-Promotion (Lint > RAW) ---
        // Elevate the top heading of the chunk to H1, and shift all child headings accordingly.
        if (!config.keep && ext.toLowerCase() === '.md') {
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

        if (config.frontmatterMode !== 'exclude' && frontMatter) finalContent = frontMatter + finalContent;
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