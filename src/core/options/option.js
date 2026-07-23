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
