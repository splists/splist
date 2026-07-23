# 📖 Design Rationale

This document is a comprehensive rationale recording the **intent (why it was designed this way)** behind all "specifications, naming conventions, and behaviors" in SPLIST.
In future development and refactoring, it is strictly prohibited to make superficial code optimizations or changes without understanding the "meaning" documented here.

## 0. Origin and Focus on Markdown

- **Where it all began: Notepad and the ✂️ (Scissors) Emoji**
  - **Rationale**: The true origin of this tool was a developer's everyday frustration: "I pasted about 5 pieces of information into Notepad, saved it, and later forgot what was in it." Trying to manually split the text into separate files via copy-paste was overwhelmingly tedious. The idea to "insert a `✂️` (scissors emoji) where I want to divide the text, and have it automatically split into separate files at those points" was the birth of SPLIST (the origin of the `sp` command).
- **The Core of "Splitting" and the "Preferences" of Options (Birth of Bone and Flesh)**
  - **Rationale**: The essence of the tool is simply "to split text." However, *how* to split it and *what to do after* (e.g., whether to add sequential numbers) is a matter of user "preference". Therefore, we established what the developer considered the most rational default (though it might not be perfect for everyone) as the "Smart Default", while separating the inevitably opposing preferences (like not adding numbers) into "Options". If someone wants yet another preference, they can simply write a new Option. This is the very simple, human reason behind the philosophy of "Complete Separation of Core and Option (Article 3)".
- **From Plain Text to Markdown: Why Hashtags Became the Main Focus**
  - **Rationale**: Although we started with the origin mentioned above, in modern code development and documentation (like READMEs), Markdown is the most natural way for humans to structure and record organized text. Furthermore, **Markdown is the "Lingua Franca (common language) between Humans and AI", where AI (LLMs) excel at accurately interpreting meaning.** A Markdown heading (hashtag `#`) is the **most logical break**, where the author explicitly declares, "this is a semantic boundary." Realizing that maximizing this beautiful structure provides the most rational hint for splitting (the Aha! moment), hashtags became the paramount core specification for logical splitting (`list`).

## 1. Philosophy of Tool Name and Command Structure

- **Reason for the name `splist`**
  - **Rationale**: A coined word that succinctly represents the two core features: "split" and "list" (organize/categorize).
- **Reason for explaining `sp` before `list` in documentation**
  - **Rationale**: `sp` (physical cut) is the intuitive, primitive, basic feature, while `list` (logical organization) is its applied and advanced form. This is a UX design choice to teach the primitive feature with lower learning cost first.
- **Reason for abbreviating `split` to `sp`**
  - **Rationale**: To relentlessly minimize user typing cost. Frequently used commands must be executable with the fewest possible characters.
- **Reason for the completion message being the coined verb `🎉 Splisted!`**
  - **Rationale**: Just as we say "Googled" for searching on Google or "Photoshopped" for editing an image, using the tool name as a past participle (verb) establishes a powerful brand identity. It also replaces sterile, lengthy logs with a refined output.
- **Reason for contrasting input as `raw` and output as `splisted`**
  - **Rationale**: To emphasize the contrast between the "raw, unprocessed data" before splitting and the "beautifully organized, completed state (Splisted)" after, thereby giving the user a sense of accomplishment (UX).
- **Reason for changing standalone `list` or `sp` commands to `splist list` / `splist sp`**
  - **Rationale**: To completely prevent conflicts with global commands (namespaces) of the OS or other tools (like UNIX `ls` or `split`), thereby guaranteeing safety.
  - **🚀 [v2 Update] Evolution of Command Order (`splist <filename> <command>`)**
    - From v2, the order was changed from `splist sp memo.md` to `splist memo.md sp`. The reason is the realization that a user's cognitive model is Object-Oriented UI (OOUI): "first select the target file (Object), then decide what to do with it (Action)."
    - **Achieving Smart Defaults**: This reordering enabled the ultimate zero-configuration (Smart Default): "If the filename ends in `.md`, it automatically defaults to `list` mode even if the command is omitted." Combined with extension inheritance, this dramatically improved UX.
- **Why exist two approaches: `sp` and `list`?**
  - **Rationale**: Human thought has two distinct desires: a sensory desire of "I want to physically cut it here (marker)" and a logical desire of "I want to organize it according to the heading structure (structure)." A single approach cannot handle all real-world data.
- **Why `✂️` (scissors emoji) is the default marker for physical cut (`sp`)**
  - **Rationale**: It is the ultimate affordance (visual cue) that intuitively conveys the physical action of "cutting here" across language barriers. Also, the probability of accidentally typing `✂️` in normal text is extremely low, providing a robust reason to naturally prevent misfires (unintended splits).
- **Why allow `cut` and uppercase `CUT` in addition to `✂️` as markers**
  - **Rationale**: Two reasons. First, when placing markers in massive text blocks, an uppercase `CUT` has overwhelmingly **higher visibility** than a lowercase `cut`, allowing users to see at a glance where splits will occur while scrolling. Second, to implement a "forgiving parser" that absorbs user input variations (like accidental Caps Lock), eliminating cognitive load from unnecessary errors.
- **Why force markers (`✂️` or `CUT`) to be on a standalone line for `sp`**
  - **Rationale**: For "preservation of context" and "aesthetics." If markers were allowed mid-sentence, files could be unnaturally severed in the middle of words or sentences, destroying the semantic integrity of the text data. By requiring an independent line (line break), we guarantee safe cuts at paragraph boundaries. Visually, this also beautifully clarifies "section changes" even in the pre-split plain text.

## 2. Development Philosophy in the AI Era

- **Why build a "tool" when you can just ask AI in a chat to "split this text"?**
  - **Rationale**: Because AI (LLMs) are notoriously bad at "processing long texts 100% perfectly without omission" (they tend to get lazy or halt due to token limits). A robust, deterministic program that never drops a single character must handle the processing, while the AI is utilized to "operate" it (operational assistance)—a necessary division of labor placing the right tool in the right spot.
- **Why design it to be executable by Agents (Agentic Workflow)?**
  - **Rationale**: Black terminal screens (CLI) and argument rules are intimidating to non-engineers. By designing a UX intended for interactive execution via AI agents (showing previews before acting), we make the tool safe and accessible to everyone.
- **Why create a dedicated CLI tool when engineers can just use `awk`, `split`, or `csplit`?**
  - **Rationale**: While traditional Unix tools are powerful, they are structurally blind. `split` cuts mechanically by line count, severing text mid-sentence. `awk` and `csplit` can split by patterns (like `## `), but they require complex one-liners, generate meaningless sequential filenames (like `xx00`), and cannot protect "fake headings" inside code blocks. SPLIST was created to bridge this gap: it understands Markdown structure natively, generates meaningful filenames extracted directly from the headings, and features robust safety guards (like ignoring code blocks), providing a fail-safe, out-of-the-box solution that typical Unix commands cannot achieve.
- **Response to: "Why 'physically split' files when you can just use a TOC to navigate inside?"**
  - **Rationale**: A TOC is merely a "jump within one giant file" and does not solve the root problems. The reasons are multifold:
    1. **Editor Performance Degradation**: Placing a massive TOC at the top of a super-long file slows down rendering and file loading in editors like VS Code, making them sluggish.
    2. **Maintenance Pain**: Every time you change or add a heading while writing, you have the tedious chore of manually regenerating/updating the TOC.
    3. **AI and Human Cognitive Limits**: It creates scrolling hell for humans. **For AI (LLMs), a single massive file induces context loss and degrades information extraction accuracy (laziness).**
    By physically splitting files at the OS level, editors open instantly, and the OS Explorer (tree view) itself acts as an "auto-updating, ultimate TOC", freeing you from all these stresses.

## 3. Naming Conventions and Option UX

- **Why adopt `v` and `vv` for typing support (auto-conversion to `#` and `##`) instead of other keys?**
  - **Rationale**: Ergonomics and misfire prevention. The hashtag `#` requires `Shift + 3`, which slows down writing. We analyzed single-handed typing speed and standard OS shortcuts (like `Ctrl + F/S/A/C`). While keys like `f`, `s`, and `a` are on the home row, they appear too frequently at the start of English words ("for", "so", "a"), leading to massive misfires (unintended heading conversions). The letter `v` is positioned perfectly for the left index finger (zero-distance), and words rarely start with a standalone `v ` on a new line, ensuring safety. Furthermore, `v [Heading Text]` enables a "dual-wielding" input where a single keystroke acts as both a structural marker and title, fulfilling the ultimate criteria of being "One-handed, Fastest, and Safest".
- **Why prefix output directories (parent folders) with emojis like `✂️` (for sp) or `🔢` (for list)?**
  - **Rationale**: For "overwhelming visibility (affordance) in the file tree" and "explicit indication that it is generated content." In an Explorer full of text-only folders, emojis instantly and intuitively indicate "this folder was auto-generated by SPLIST" and "whether it was generated by physical cut (✂️) or logical organization (🔢)." This is a safety design to prevent users from panicking by confusing them with their precious original folders.
- **Why prefix generated files with sequential numbers?**
  - **Rationale**: To automatically preserve the original "sequence (context)" of the split text under the file system's default sort order (alphabetical).
- **Why commands work whether OPTIONs have hyphens (`-`) or not**
  - **Rationale**: To implement a "forgiving parser." Even if users forget strict CLI grammar (`-` or `--`), the system grasps their intent and continues processing without throwing errors.
- **Why allow arbitrary permutation (order) of OPTIONs**
  - **Rationale**: Because humans may think of the "target file" or the "option" first depending on the situation. By not forcing a typing order, we lower cognitive load.
- **Why unify prefixes like `-fmex` instead of `exfm`**
  - **Rationale**: By grouping front-matter related options starting with `fm`, it helps user memory retention and aligns with the natural typing thought sequence (Category → Specific Action).

## 4. File System and Safety Design

- **Why append versions like `_v02` instead of overwriting when executing the same file, and why not use dates as default?**
  - **Rationale**: First, to absolutely guarantee we never destroy (overwrite) user assets. Second, defaulting to dates (e.g., `_20260719`) makes names too long and lowers visibility. For rapid, repeated trial executions, short suffixes like `_v02`, `_v03` provide vastly superior UX. (Dates are separated into the `-d` option).
- **Why intentionally omit a hard limit (like `_v99` error) on version sequences (YAGNI Principle)**
  - **Rationale**: This tool is strictly a single-shot (One-Shot) execution process; structural bugs causing infinite loops do not exist within the tool. If a file were to multiply infinitely up to `_v1000`, it would only be due to an "external shell script logic error written by the user," such as:
    ```bash
    # Example of a user script error (unintended infinite loop)
    while true; do
      splist README.md list
    done
    ```
    Building overprotective safety mechanisms into the Core to prevent "user shell script errors" (which are out of scope) is Over-Engineering (YAGNI). It violates Article 3 ("Purity of Core") and Article 1 ("Reduce cognitive load / keep code simple"). Thus, no upper limit is set.
- **Why zero-pad numbers to two digits (e.g., `01_` or `_v02`)?**
  - **Rationale**: Due to standard OS file sorting behavior (lexicographical/alphabetical). If single digits like `1_` were used, passing 10 would result in sorting like `1_`, `10_`, `11_`, `2_`, breaking the sequence. Zero-padding (`01`) guarantees they line up beautifully and sequentially (natural sort) on the OS.
- **Why allow the tool to split its own README (Dogfooding)?**
  - **Rationale**: To provide the "ultimate onboarding (Quick Start)" experience, allowing users to immediately witness the tool's power right after installation without needing to prepare extra sample files.

## 5. Structure Preservation and Cleansing in Logical Split (`list`)

- **Why H2 (`##`) is the default target hierarchy for logical split (`list`)**
  - **Rationale**: In typical Markdown documents, H1 (`#`) often exists solely as the "Document Title." Splitting by H1 would just output one giant file, defeating the purpose of splitting. Conversely, defaulting to H3 or H4 shreds the file too finely. Since H2 is the most perfectly balanced unit humans recognize as "Chapters/Sections", it is adopted as the configuration-free "Smart Default".
- **Why Single-Folder Output (not splitting folders per heading)**
  - **Rationale**: Because scattering a swarm of generated files across the current directory induces user panic. Files must always be encapsulated within a single parent folder.
- **Why extract Front Matter independently (`-fm00`)**
  - **Rationale**: Body text and metadata are fundamentally different types of information. Blindly merging them breaks the data structure, so it is rationally detached as an independent `00_FrontMatter.md`.
- **Why auto-cleanse headings (remove Markdown decorations)**
  - **Rationale**: Forbidden characters or decorations in filenames trigger OS errors. However, forcing users to "write clean headings" is system negligence. The system must take on the dirty work of cleansing.
- **Why keep the dividing heading (e.g., H1) at the top of the split file instead of discarding it**
  - **Rationale**: Because the heading itself is a critical piece of the document data. Discarding it destroys the semantic structure of the document.
- **Why auto-fallback to H3 if H2 is missing**
  - **Rationale**: Real-world Markdown isn't always written beautifully by the book; users often skip heading levels. Rather than throwing errors or destroying structure, the tool infers the user's "true intent" and auto-adapts (acting as a forgiving parser).
- **Why wait for the first top-level heading (Pre-Heading Guard)**
  - **Rationale**: In real-world documents, "warnings" or "metadata (H4, etc.)" often precede the actual title. Blindly parsing an early H4 as the parent folder results in a nonsensical structure. This flexibility delays parent folder determination until the first top-level heading (H1) appears.
- **Why fallback to the original "Filename" as the parent folder if no headings exist**
  - **Rationale**: Even if a file like `CHANGELOG.md` (which often starts at H2) or plain text with zero headings is input, the system must not crash or scatter files chaotically in the root directory. Instead, it beautifully encapsulates them in a safe "quarantine folder" named after the file.

## 6. Codebase Architecture and Modification Boundaries

- **Why `splist.js` contains no logic and is just an entry point**
  - **Rationale**: To completely separate the OS (Node.js) invocation point from the actual application logic. `splist.js` merely passes arguments, while `cli.js` handles all traffic control. This ensures testability for future test code or direct programmatic invocation.
  - **🚀 [v2 Update] Architectural Evolution (Pipeline and Outer Shell Separation)**
    - In v2, `splist.js` evolved from a mere entry point to a **Pipeline Orchestrator** managing "Input → Directory Creation → Rule Determination → Output". Instead, `cli.js` was positioned as the new "Outer Shell (entryway)" of the project.
    - This separation allows the pure pipeline processing (`splist.js`) to be reused unscathed when invoked not just from the "CLI (black screen)" but also from "VS Code Extensions" or "Web Apps", by simply detaching the argument parser (`cli.js`).
- **Why `cli.js` (Router) exists**
  - **Rationale**: To prevent tight coupling between user input parsing (arguments/options) and execution of actual logic (sp / list). With `cli.js` solely responsible for validation and routing, command modules can focus on "pure processing," resulting in a robust design.
- **The true reason for eliminating third-party dependencies (Zero-Dependency)**
  - **Rationale**: The adage "don't reinvent the wheel" applies when building complex systems like AST parsers from scratch. The logic this tool performs—"finding options from arguments" or "splitting strings by `---` or `#`"—are trivial, standard JavaScript string operations (a few regex lines), not even qualifying as reinvention. In reality, introducing a standard CLI parser (e.g., `commander`) or YAML parser (e.g., `js-yaml`) balloons the footprint to **100KB–300KB+ (tens of thousands of lines)** including dependencies. In contrast, this tool's custom parsing is just dozens of lines, weighing **a few hundred bytes (~1/1000th the size)**. Bringing in a massive, maintenance-heavy, security-risk-prone "electric chainsaw" just to cut paper is an anti-pattern that pollutes the system. We eliminate external dependencies to preserve this overwhelming lightness and simplicity.
- **Why we don't implement complex class designs or plugin systems for future extensions (YAGNI)**
  - **Rationale**: The fear that "if we have 50 Options later, it will become spaghetti code" is based on the overbearing premise that the tool author must centrally manage everything. In this tool, Options (flesh) are simply "added locally (as scripts or forks) by the people who need them, when they need them." Pre-building massive plugin managers or OOP interfaces into the Core for unseen Options is severe Over-Engineering (YAGNI). Maintaining a procedural, rudimentary codebase that allows anyone to quickly bolt on their own logic is the design that maximizes hackability and user freedom.
- **Why opportunities to modify the Core engine (`core/`) are heavily restricted**
  - **Rationale**: Based on Article 3 (Separation of Bone and Flesh), all new or convenience features must be added as Options (flesh). Modifying Core code is strictly limited to these 3 "Engine Tuning (sharpening)" scenarios:
    1. **Extreme Performance Optimization**: (e.g., Processing 100MB files faster and with less memory via Streams).
    2. **Bolstering Defense Against the Unknown Chaos**: (e.g., Preventing crashes from exotic text encodings or hidden characters).
    3. **Adapting to OS/File System Changes**: (e.g., Enhancing sanitization to avoid file creation errors in specific environments).
    In short, Core modifications are never for "adding new features," but only to make it "faster and unbreakable."
- **🚀 [v2 Update] Why error handling in Core was delegated from `process.exit(1)` to `throw new Error()`**
  - **Rationale**: To completely decouple the Core engine (`core/`) from the CLI execution environment, making it a true "Pure Module". If `process.exit(1)` were called inside the Core, embedding SPLIST into a "VS Code Extension" or "Web App" in the future would cause the entire parent application process to crash over a minor SPLIST error. By placing the final responsibility for error termination on the outermost shell (`cli.js`), we achieve a perfect separation of concerns.
- **🚀 [v2 Update] Why the Core engine was consolidated into a single async generator (`async function*`)**
  - **Rationale**: To evolve the processing from "accumulating everything into an array before returning" to a Stream architecture that "reads line-by-line and `yield`s chunks as they form." This realizes extreme performance optimization and memory conservation, ensuring that even if massive multi-GB log files are input in the future, it will never cause an Out-Of-Memory (OOM) panic.
- **🚀 [v2 Update] Why the pipeline was explicitly split into `phase1.js` ~ `phase4.js` files**
  - **Rationale**: To provide procedural clarity, so users wanting to add extensions (Options) can intuitively understand at a glance "where to insert their logic (hooks)." While avoiding over-engineering (YAGNI), laying down clear boundaries—"Input/Protection(1)", "Vessel Creation(2)", "Rules/Naming(3)", and "Output/Finishing(4)"—maximizes maintainability and hackability.
- **🚀 [v2 Update] Why option matching in `argsParser.js` uses `switch` instead of `if-else if` with `[...].includes()`**
  - **Rationale**: 
    1. **Elimination of Temporary Array Allocation**: Modern JS engines allocate temporary array instances on every `['d', 'date'].includes(opt)` evaluation inside argument loops. Replacing this with `switch` cases avoids unnecessary heap allocations.
    2. **V8 Engine Branch Optimization**: A `switch` statement enables JavaScript engines (V8) to construct jump tables for constant-time branch evaluation.
    3. **Prioritized Frequency & Code Clarity**: Placing high-frequency options (such as output directory `-o / -out / -output`) at the top of the `switch` ensures early matching for typical usage patterns while keeping the code clean, modern, and zero-dependency.
- **Why the CLI is integrated via `package.json` (bin) and a Shebang**
  - **Rationale**: To instantly transform a standard JavaScript file into a cross-platform executable CLI command without relying on global path hacks or third-party wrappers. The `bin` field in `package.json` registers the command globally upon installation (`npm link`), while the Shebang (`#!/usr/bin/env node`) at the top of `cli.js` instructs the host OS to execute the script using the Node.js engine. This native approach ensures seamless installation and zero-dependency execution across Windows, Mac, and Linux environments.
- **🚀 [v2 Update] Why `build-web.cjs` bundles core logic into a zero-dependency `splist-core.js` for Web / Browser environments**
  - **Rationale**: The Core engine (`src/core/`) was designed as pure JavaScript logic decoupled from OS-specific Node.js calls (e.g. replacing `process.exit(1)` with `throw`, and mocking file system/path operations in a virtual file system). `build-web.cjs` leverages this purity to bundle the core modules into a single `splist-core.js` script with an in-memory Virtual File System (`window.VFS`). This allows the exact same splitting engine to run natively inside web browsers (such as the React Web App) without a backend server or heavy external bundlers, preserving the Zero-Dependency Oath while extending accessibility to non-terminal users.
