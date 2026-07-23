# The SPLIST Constitution

This document defines the **"immutable design philosophies and core values"** of the SPLIST project.
Going forward, any feature additions, bug fixes, UI/UX changes, and community contributions (PRs) that violate this Constitution will generally be rejected. All AI agents and developers involved in the development of SPLIST must strictly adhere to this Constitution as the supreme governing rule.

### Regarding the Hierarchy of Articles
The order in which these articles are arranged carries a logical hierarchy of meaning, dictating which philosophies hold the highest priority.
The articles flow in a perfect gradient: beginning with **[Meta-Philosophy]** (the foundation of all), moving to **[Safety]** (the highest priority), **[Structure]** (the architecture to realize it), **[Input]** (handling real-world data), **[Output/UX]** (user experience), and finally **[Future]** (evolution within the community). The higher the article, the stronger its binding force.

---

## Article 1: Principle of Intentional Design
1. **The Pursuit of Necessity and Rationale**
   - **Requirement**: Every feature, option name, and default behavior must possess a "clear meaning (empathy for the user)".
   - **Priority**: Even if functional value is equivalent, designs that reduce user cognitive load and enable intuitive use must always be prioritized.
2. **Strict Adherence to the Design Rationale Index**
   - **Definition**: The "background and reasoning" for all naming conventions and features are centralized in `DESIGN_RATIONALE.md`.
   - **Obligation**: Future developers and AI agents must always consult this index to understand existing design intent before modifying specifications or code.
   - **Prohibition**: Superficial optimizations or adherence to general conventions must not be prioritized if they destroy the "meaning of the design (empathy for the user)".
3. **Respect for Markdown Structure**
   - **Definition**: While this tool originated for splitting text, it recognizes that Markdown is currently the common language where humans can most easily organize their thoughts, and **"where AI (LLMs) can most accurately understand meaning and structure."**
   - **Rationale**: This is scientifically supported by prompt engineering research (e.g., *Does Prompt Formatting Have Any Impact on LLM Performance?*) showing that AI leverages Markdown formatting for reasoning far better than plain text, and by its overwhelming token efficiency compared to XML and others.
   - **Policy**: Markdown headings (hashtags `#`) must be regarded as the "perfect logical breaks (hints)" intended by the writer. Designing to beautifully extract and preserve this structure is the foremost priority.

## Article 2: Absolute Data Protection
1. **Non-Destruction of User Assets**
   - **Obligation**: Under no circumstances (including during errors) may existing user files or directories be unintentionally overwritten or destroyed.
2. **Safety-First Default Behavior**
   - **Handling**: If duplicate file/folder names occur during output, the process must automatically either skip execution or save under a new name (e.g., `_v02`).
   - **Purpose**: To completely prevent data loss at the system level.

## Article 3: Separation and Purity of Core
1. **Protection of the Pure Core**
   - **Definition**: The essence of SPLIST lies solely in "safely splitting and writing out plain text".
   - **Obligation**: The Core engine must strip away all excess to remain the fastest, lightest, and most robust component.
2. **Independence of Options**
   - **Definition**: Additional features such as sequential numbering, TOC generation, and front matter extraction are all considered "Options (flesh)".
   - **Obligation**: These must not be tightly coupled to the Core; they must be maintained as independent plugins (a pluggable architecture).
3. **The Zero-Dependency Oath**
   - **Principle**: The Core engine must be completely self-contained, strictly prohibiting dependencies on third-party libraries (e.g., npm packages).
   - **Purpose**: To prevent security risks (supply chain attacks) and performance degradation from external dependencies, ensuring robust operation using only standard modules.
4. **Rejection of Over-Engineering (YAGNI) and Single Extension Point**
   - **Prohibition**: Introducing complex abstractions or design patterns into the Core based on the prediction that "we might extend this in the future" is strictly forbidden.
   - **Extension Rule**: All feature additions and extensions must exclusively route through "addition to the Option layer (flesh)".
   - **Purpose**: To eternally preserve the Core code in a state of "procedural simplicity" that anyone can understand instantly.

## Article 4: Tolerance and Auto-Cleansing
1. **Acceptance of Real-World Noise**
   - **Premise**: It is assumed that real-world data will always contain noise, such as "missing H1s", "skipped heading levels", or "forbidden characters".
2. **Prohibition of Error-Induced Halts**
   - **Obligation**: The system must absolutely never crash upon receiving non-standard data.
   - **Handling**: It must automatically perform inferences (hierarchy fallbacks) and cleansing (decoration removal) to output in the safest and most beautiful format possible.
3. **Predictability**
   - **Obligation**: The behavior of automatic cleansing and inference must always be deterministic (producing the same result every time) and predictable.
   - **Prohibition**: Excessive destructive changes (black-boxing) beyond the user's intent must not be performed silently.

## Article 5: Smart Defaults and UX Supremacy
1. **Zero Configuration**
   - **Requirement**: Provide "Smart Defaults" that execute the "most anticipated logical split" even if the user specifies no detailed options.
   - **[v2 Amendment] Mandatory Smart Defaults (Extension Inference)**: To relentlessly minimize required user input, as long as the "target file" is specified, the system must infer the user's intent from its extension (e.g., `list` for `.md`, `sp` for `.txt`) and automatically select the optimal command. Forcing users to "memorize command order" is considered a failure of the system.
2. **Interactive and Reassuring Experience (Agentic Workflow)**
   - **Guideline**: Strive for a UX designed for interactive execution via AI agents, rather than forcing raw terminal operations.
   - **Obligation**: Always present a preview (simulation result) before execution, and only perform the actual processing once the user is fully satisfied.
3. **Hierarchical Relationship Between Defaults and Options**
   - **Hierarchy**: `Default ⇔ Option1 ⇔ Option2 ...`
   - **Principle**: While fiercely defending the overwhelmingly superior optimal solution as the "Default", an escape hatch (Option) representing the opposite state (e.g., "disable") must always be provided to prevent degradation of usability.

## Article 6: Failures as Assets
1. **Welcoming Edge Cases**
   - **Definition**: Files that fail to split or data that triggers errors are "treasures" that enhance the system's defensive strength.
   - **Obligation**: Developers must not conceal these; they must actively collect them as test cases in the `demo_cases/` directory.
2. **Community-Driven Evolution**
   - **Guideline**: Share failures and bugs with the OSS community to collectively forge a stronger Core. Maintain a culture that does not fear failure but utilizes it as a stepping stone for evolution.
3. **Respecting Boundaries Between Users and Developers**
   - **Principle**: Acknowledge the "cognitive gap": for general users, reporting bugs is a hassle and a confidentiality risk, but for OSS developers, it is a valuable contribution.
   - **Prohibition**: Implementing automatic telemetry or error-reporting features into the tool itself is strictly forbidden. Everything must remain entirely local.
   - **Handling (Providing Issue Templates)**: Bug reporting must strictly rely on voluntary reports via GitHub Issues, etc. To facilitate this, the project must provide Issue templates that encourage "structural masking" (dummying the text while safely retaining only the skeletal structure, like headings, causing the bug) so reporters can safely contribute without compromising confidential information.

---

*Established: July 19, 2026*
*Last Revised: July 22, 2026*
