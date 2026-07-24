# Phase 1: Input, Cleansing, and Protection

In the **"Start → 1 → 2 → 3 → 4 → Goal"** pipeline, **Phase 1** is responsible for safely acquiring data and protecting configuration metadata before passing text to the core engine.

---

## 🛡️ Overview & Current Features

Phase 1 operates as a pre-processing shield that prepares and refines raw input data without modifying or cluttering the core splitting engine.

* **Safe File Loading (`readLinesSafe`):** Validates file existence, handles errors gracefully, normalizes line breaks, and loads content line-by-line into an array.
* **Metadata Protection (`extractFrontMatter`):** Detects YAML Front Matter (`---`) at the beginning of files and safely isolates it from the engine.

---

## 🚀 Potential Future Extensions

Phase 1 serves as an extensible pre-processing zone. Potential capabilities that can be hooked into this phase include:

### 1. Diverse Input Sources

* **Direct Web URL Fetching:** Download Markdown directly from `http://` / `https://` endpoints.
* **Multi-File Concatenation:** Combine multiple files or directory contents in memory.
* **Standard Input (`stdin`):** Stream data via terminal pipes (`cat memo.txt | splist`).
* **Clipboard Integration:** Read content directly from the system clipboard (`--clip`).

### 2. Automatic Text Cleansing

* **Encoding & Line Ending Normalization:** Convert non-UTF-8 encodings (Shift-JIS, UTF-16) and normalize line endings.
* **Noise Removal:** Automatically strip legacy handwritten TOCs, trailing whitespaces, and redundant blank lines.
* **Global Header Exclusion:** Separate disclaimers, licenses, or fixed headers from split targets.
* **Draft / Private Note Exclusion:** Filter out sections marked as draft (`<!-- draft -->`) or private (`> [!private]`).

### 3. Protection & Shield Zones

* **Code Block Shielding:** Mask markers inside code blocks to prevent accidental splitting.
* **Complex Syntax Protection:** Protect LaTeX math blocks (`$$`) and Markdown tables from being split.
* **User-Defined Ignore Zones:** Enforce unsplit zones bounded by `<!-- splist-ignore-start -->` and `<!-- splist-ignore-end -->`.

### 4. Dynamic Metadata Processing

* **Front Matter Unification:** Automatically convert TOML (`+++`) or JSON metadata into standard YAML.
* **Default Metadata Insertion:** Inject default tags, creation dates, or author info if missing.
* **Template Macro Expansion:** Expand variables such as `{{TODAY}}` prior to splitting.
* **Syntax Validation (Linting):** Detect unclosed code blocks, broken links, or invalid heading structures.

### 5. Structure & Link Optimization

* **Relative Path Auto-Resolution:** Rewrite relative asset links (e.g., `![image](./pic.png)`) to match the new output directory.
* **Heading Level Normalization:** Uniformly shift heading levels (e.g., `###` to `##`) to maintain structural hierarchy.
* **Format Conversion:** Pre-convert formats like HTML or CSV into Markdown before handing off to the engine.

### 6. Advanced Extensions (AI, Media & Security)

* **AI Meta-Analysis:** Auto-generate tags and summaries to embed into Front Matter.
* **Media / Document Ingestion:** Parse text from PDFs or perform OCR on image inputs.
* **On-the-Fly Decryption:** In-memory decryption for GPG/Age encrypted files (`.md.gpg`).

---

## 🔬 Phase 1 Micro-Pipeline Architecture

To keep Phase 1 maintainable and modular, its responsibilities are divided into three sub-phases:

1. **Phase 1-A: Ingest (`ingestData`)**
* **Role:** Fetches raw data from files, URLs, or stdin into a string array (`rawLines`).


2. **Phase 1-B: Cleansing (`cleanseData`)**
* **Role:** Sanitizes raw lines, strips noise, normalizes encodings, and removes unwanted elements (`cleanLines`).


3. **Phase 1-C: Protect (`protectData`)**
* **Role:** Isolates Front Matter and applies shields to protected zones (`readyData`).



---

## 💻 Implementation Architecture Reference

```javascript
// =====================================================================
// PHASE 1: Input, Cleansing, and Protection
// =====================================================================

// [Phase 1-A] Ingest
const ingestData = (target) => {
    if (!fs.existsSync(target)) {
        console.error(`❌ Error: File not found -> ${target}`);
        process.exit(1);
    }
    return fs.readFileSync(target, 'utf-8').split(/\r?\n/);
};

// [Phase 1-B] Cleansing
const cleanseData = (lines, options = {}) => {
    return lines.map(line => line.replace(/\s+$/, ''));
};

// [Phase 1-C] Protect
const isValidFrontMatter = (lines) => {
    return lines.every(line => {
        const trimmed = line.trim();
        return trimmed === '' || trimmed.startsWith('#') || trimmed.startsWith('-') || trimmed.includes(':');
    });
};

const extractFrontMatter = (lines) => {
    if (lines.length > 0 && lines[0].trim() === '---') {
        let fmEndIndex = -1;
        const searchLimit = Math.min(lines.length, 51);
        for (let i = 1; i < searchLimit; i++) {
            if (lines[i].trim() === '---') {
                fmEndIndex = i;
                break;
            }
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

const protectData = (lines, options = {}) => {
    const { frontMatter, contentLines } = extractFrontMatter(lines);
    return { frontMatter, targetLines: contentLines };
};

// Master Pipeline for Phase 1
const prepareInputData = (target, options = {}) => {
    const rawLines   = ingestData(target);
    const cleanLines = cleanseData(rawLines, options);
    return protectData(cleanLines, options);
};

module.exports = { prepareInputData };

```