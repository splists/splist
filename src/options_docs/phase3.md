# Phase 3: Core Slicing Engine & Chunk Naming

In the **"Start → 1 → 2 → 3 → 4 → Goal"** pipeline, **Phase 3** is the heart of SPLIST, responsible for generating splitting rules, executing stream-based slicing via the core generator engine, and extracting OS-safe titles and filenames from generated chunks.

---

## Overview & Current Features

Phase 3 operates as the core text-slicing engine and chunk analyzer. Because Phase 1 prepares sanitized text and Phase 2 secures the target output directory, Phase 3 focuses entirely on cleanly dividing content according to designated rules.

* **Rule Generation (`createMarkerRule`):** Defines matching logic for splitting targets based on Markdown headings (`##`) or custom split markers (`✄`, `cut`, `v`).
* **Title Extraction & Sanitization (`extractTitleLine`, `getSafeTitle`):** Extracts title candidate lines efficiently, strips Markdown syntax, removes OS-forbidden characters, and safely truncates filenames using Unicode code-point awareness (`Array.from`).

---

## Potential Future Extensions

Phase 3 serves as a high-performance slicing and content analysis engine. Potential capabilities that can be hooked into this phase include:

### 1. AI & LLM (RAG) Optimized Chunking

* **Sliding Window (Overlapping Chunking):** Include trailing context lines from previous chunks at the beginning of subsequent chunks to preserve LLM context boundaries.
* **Token & Character Budget Slicing:** Automatically split long texts based on maximum token/character limits (e.g., 1000 tokens) at natural paragraph boundaries.

### 2. AST & Markdown Structure Analysis

* **Tree Slicing (Hierarchical Directory Generation):** Map Markdown heading levels (`#`, `##`) directly into nested OS directory structures.
* **AST-Based Surgical Slicing:** Parse Markdown Abstract Syntax Trees to guarantee splits occur only between safe block nodes (e.g., avoiding splitting inside code blocks, tables, or list items).

### 3. Programmable & Custom Blades

* **Regex Engine Slicing:** Accept user-defined regular expressions (e.g., `--regex "^Chapter \d+"`) as custom split triggers.
* **Callback & Hook Slicers:** Delegate line-by-line split evaluations to custom JavaScript plugin callbacks.

### 4. Semantic & Context-Aware Slicing

* **Topic Shift Auto-Detection:** Utilize local NLP algorithms to detect thematic shifts in text and insert split points automatically.
* **Keyword Vicinity Extraction:** Extract chunks centered around target keywords or action items.

### 5. Post-Slice Refinement

* **Per-Chunk Front Matter Injection:** Automatically prepend tracking metadata (e.g., source chapter, ordinal index) to each generated chunk.
* **Relative Heading Normalization (Heading Shift):** Automatically promote nested subheadings (e.g., `###`) to top-level headings (`#`) within independent chunk files.

### 6. Extreme Performance & Scalability

* **Parallel & Worker-Thread Slicing:** Utilize Node.js `Worker Threads` to slice massive files or multi-gigabyte logs concurrently across multi-core CPUs.
* **Low-Memory Streaming Slicing:** Process and yield chunks iteratively from disk streams without loading entire files into system RAM.

### 7. Conditional Filtering & Smart Routing

* **Automatic Chunk Dropping:** Automatically discard chunks containing specific tags/keywords (e.g., `## Draft` or `## Trash`).
* **Multi-Target Routing:** Dynamically route chunks to different subfolders (e.g., `work/` vs `private/`) based on chunk tags.

### 8. Interactive & Polyglot Slicing

* **Interactive Slice Confirmation (Wizard Mode):** Prompt the user in the terminal (`Y/n/Skip`) to confirm or adjust split points interactively.
* **Source Code Function Slicing:** Parse source code files (`.js`, `.py`) and split them function-by-function into individual files.
* **Structured Data Chunking:** Split large JSON arrays or CSV files by key attributes or row thresholds.

---

## 🔬 Phase 3 Micro-Pipeline Architecture

To keep Phase 3 maintainable and modular, its responsibilities are divided into three sub-phases:

1. **Phase 3-A: Rule & Strategy (`createMarkerRule`)**
* **Role:** Analyzes configuration options and prepares matching rules or compiled regexes for the engine.


2. **Phase 3-B: Slicing Execution (`splistEngine`)**
* **Role:** Streams content lines, evaluates split triggers, and yields raw chunk strings.


3. **Phase 3-C: Title Extraction & Refinement (`getSafeTitle`)**
* **Role:** Sanitizes chunk headers, computes safe filenames, and performs post-slice chunk transformations.



---

## Implementation Architecture Reference

```javascript
// =====================================================================
// PHASE 3: Core Slicing Engine & Chunk Naming
// =====================================================================
const H_CLEAN = /^#+\s+/;
const INVALID_CHAR = /[\\/:*?"<>|]/g;

// [Phase 3-A] Rule Generation
const createMarkerRule = (customMarker = null, config = {}) => {
    if ((config.mode || 'sp') === 'list' && !customMarker) {
        return { test: line => H_CLEAN.test(line), isExactMatch: () => false, extractTitle: line => line };
    }
    const pattern = customMarker || '✄|✂️|cut|v';
    const testRegex = new RegExp(`^(?:${pattern})(?:\\s+|$)`, 'i');
    const exactRegex = new RegExp(`^(?:${pattern})\\s*$`, 'i');
    const replaceRegex = new RegExp(`^\\s*(?:${pattern})\\s*`, 'i');

    return {
        test: line => testRegex.test(line.trim()),
        isExactMatch: line => exactRegex.test(line.trim()),
        extractTitle: line => line.replace(replaceRegex, '').trim()
    };
};

// [Phase 3-B] Chunk Title Line Extraction (High-Speed)
const extractTitleLine = (chunk, rule) => {
    const idx1 = chunk.indexOf('\n');
    const line0 = idx1 === -1 ? chunk : chunk.slice(0, idx1);
    if (!rule.isExactMatch(line0)) return rule.extractTitle(line0);
    const idx2 = chunk.indexOf('\n', idx1 + 1);
    return idx2 === -1 ? chunk.slice(idx1 + 1) : chunk.slice(idx1 + 1, idx2);
};

// [Phase 3-C] Chunk Naming & Sanitization
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

module.exports = { createMarkerRule, extractTitleLine, getSafeTitle };
```
