# ✂️ SPLIST (Overview & Installation)

## Welcome to SPLIST

An ultra-fast, zero-dependency CLI toolset to split a single Markdown or text file into multiple beautifully organized files and automatically generate a dynamic Table of Contents (TOC).

Optimized for rapid documentation, editing, and seamless integration with **VS Code**.

## 🛠️ Installation

Get the `splist` command globally on your machine in just a few seconds.

**Official npm Installation (Recommended):**
```bash
npm install -g @splists/splist
```

**Local Development Installation:**
1. Clone or download your repository: `cd splist`
2. Link the package globally using npm: `npm link`

Now, you can run the `splist` command directly from **any folder** on your computer!

## 🔄 Migration Guide (v1 to v2)

SPLIST has been updated to v2, evolving into a more intuitive and smarter command structure!

```diff
- v1 old spec: splist list memo.md
+ v2 new spec: splist memo.md list
```

💡 **Incredibly Convenient "Smart Defaults" Feature**
From v2, if the target file is **`.md`**, omitting the command will automatically execute `list` (logical organization).
Conversely, if the file is **`.txt`**, it will automatically execute `sp` (physical cut).
In other words, simply typing `splist memo.md` will initiate the perfect split!

---

## 🎯 The Ultimate Tutorial: Split This README!

Want to see the magic right now? **Run the `splist` command with the `toc` option on this very `README.md` file!**

```bash
splist README.md toc
```

When you do this, SPLIST will automatically extract the complete Official Manual (written below) into beautiful folders and files, and generate a Table of Contents. Try it now!

---

## 📖 Terminology and Worldview

SPLIST provides the experience of "magically organizing" massive text data, not just merely splitting files. We have unique terminology to express this worldview.

* **Raw:** Massive, hard-to-read text data before it has been processed by SPLIST.
* **Splisted:** The completed state where data has been beautifully split, organized, and "magically transformed" by SPLIST. Just like saying "Googled" for searching on Google, the terminal will display a celebratory message **`🎉 Splisted!`** upon successful completion as the ultimate result.
* **Output Folder Icons:**
  * **`✂️` (Scissors):** Attached to folders that were "physically cut" using the `sp` command.
  * **`🔢` (Numbers):** Attached to folders that were "logically organized and sequentially numbered" using the `list` command.

---

# What This Tool Can Do

## Overview

💡 **Quick Tip:** If you're opening this file in VS Code, press `Ctrl + Shift + V` (Mac: `Cmd + Shift + V`) right now to read the manual in a beautiful preview screen!

Welcome to the magical experience of SPLIST!
SPLIST is a powerful CLI tool that instantly reconstructs massive, hard-to-read text data and Markdown files into beautiful structures that anyone can read intuitively.

**Have you ever experienced this?**
* A single document is so long it feels like scrolling hell.
* You hastily copy-pasted info into Notepad to organize later, but now it's too long to find anything.
* You're tired of manually repeating "select range, copy, create new file, paste, save as...".
* While writing a massive Markdown document, you want to focus on fleshing out one specific chapter at a time.

**"I just want to split this long text into pieces to work on and manage it!"**
This tool was born from the developer's own intense frustration with this exact problem. If your document is cleanly written with Markdown headings, you can split it beautifully with a single command.

## Forcibly Cut at Specific Locations with Scissors

When you have a clear place where you want to "sever the text before and after"—such as system logs with no Markdown structure, scene changes in a novel, or exported chat logs—the forced physical cut feature shines.
Just place `✂️` or a custom marker at the beginning of a line, and the file will be cleanly severed at that exact boundary.

## Split Beautifully by Markdown Headings

**Are you amazed by the beautiful folder structure of this manual?**

Actually, the "hierarchical manual" you are currently looking at in your Explorer (or IDE) is a live example (demo) proving the power of SPLIST.
Originally, it was just a single, long, hard-to-read text file. But SPLIST automatically detected `#` (H1) as folders and `##` (H2) as files in the text, instantly constructing this beautiful tree structure.

# 💻 COMMAND

## ✂️ splist Targetfilename sp

The command to execute a "Forced Physical Cut".
Regardless of heading structure, it severs the text before and after at locations marked with the scissors symbol (`✂️`), `cut`, or a custom marker (e.g., `===`) written in the file.
**※ Collision avoidance options like `-d` and `-s` can be fully utilized with this command just like `splist Targetfilename list`!**

### 💡 Features and Usage (Validation Demo Links)
- **Basic single split using standard markers (✂️, V, v, cut)**: Validation File [[01_sp_showcase_single_cut_default.md](file:///c:/splist/demo_cases/success_cases/01_sp_showcase_single_cut_default.md)]
- **Simultaneous split with different standard markers at multiple locations**: Validation File [[02_sp_showcase_multi_cut_default.md](file:///c:/splist/demo_cases/success_cases/02_sp_showcase_multi_cut_default.md)]
- **Split using a user-specified custom marker**: Validation File [[03_sp_showcase_custom_marker_opt.md](file:///c:/splist/demo_cases/success_cases/03_sp_showcase_custom_marker_opt.md)]
- **Feature to keep trailing text after the marker at the top of the next file**: Validation File [[04_sp_showcase_marker_trailing_text_default.md](file:///c:/splist/demo_cases/success_cases/04_sp_showcase_marker_trailing_text_default.md)]
- **Split without sequential numbers using the un option**: Validation File [[05_sp_option_un_opt.md](file:///c:/splist/demo_cases/success_cases/05_sp_option_un_opt.md)]
- **Auto-generate TOC using the -toc option**: Validation File [[06_sp_option_toc_opt.md](file:///c:/splist/demo_cases/success_cases/06_sp_option_toc_opt.md)]

### ✂️ Physical Cut Image

Even for text without Markdown headings like system logs or novels, you can cleanly sever them at any marker location.

```text
(Original File: target_file.txt)
This will be the first file.
Prologue text...
✂️
This will be the second file.
Chapter 1 text...
cut
This will be the third file.
Chapter 2 text...
```

#### 📂 Output Files (Image)

```text
📂 Output Folder/
├── 📄 01_Part.txt  (First block)
├── 📄 02_Part.txt  (Second block)
└── 📄 03_Part.txt  (Third block)
```

💡 **Specifying Custom Markers**
By specifying a symbol at the end like `splist target.txt sp "==="`, you can split using that custom symbol instead of the standard scissors. You can even chain options like `splist target.txt sp "===" -d`.

## 💻 splist Targetfilename list (or omit)

The command to execute "Smart Logical Organization".
It reads the target Markdown file and automatically splits it into folders and files according to the `#` and `##` heading structure.

### 💡 Features and Usage (Validation Demo Links)
- **Basic split for a flat structure with only H1s**: Validation File [[16_list_showcase_flat_h1_default.md](file:///c:/splist/demo_cases/success_cases/16_list_showcase_flat_h1_default.md)]
- **Standard nested configuration of # (Folder) and ## (File)**: Validation File [[17_list_showcase_nested_standard_default.md](file:///c:/splist/demo_cases/success_cases/17_list_showcase_nested_standard_default.md)]
- **Cases with multiple H2s under a single H1**: Validation File [[18_list_showcase_nested_single_default.md](file:///c:/splist/demo_cases/success_cases/18_list_showcase_nested_single_default.md)]
- **Typing support conversion for v (H1) / vv (H2)**: Validation File [[19_list_showcase_typing_support_default.md](file:///c:/splist/demo_cases/success_cases/19_list_showcase_typing_support_default.md)]
- **Typing support conversion for vvv (H3)**: Validation File [[20_list_showcase_typing_support_vvv_default.md](file:///c:/splist/demo_cases/success_cases/20_list_showcase_typing_support_vvv_default.md)]
- **Split specifying custom depths like "###"**: Validation File [[21_list_option_custom_depth_opt.md](file:///c:/splist/demo_cases/success_cases/21_list_option_custom_depth_opt.md)]
- **keep option (maintain heading levels)**: Validation File [[22_list_option_keep_opt.md](file:///c:/splist/demo_cases/success_cases/22_list_option_keep_opt.md)]
- **Split without sequential numbers using the un option**: Validation File [[23_list_option_un_opt.md](file:///c:/splist/demo_cases/success_cases/23_list_option_un_opt.md)]
- **Auto-generate a structural TOC file using the -toc option**: Validation File [[24_list_option_toc_opt.md](file:///c:/splist/demo_cases/success_cases/24_list_option_toc_opt.md)]
- **Correction feature where H2 automatically promotes to H1 after splitting**: Validation File [[25_list_option_heading_promotion_default.md](file:///c:/splist/demo_cases/success_cases/25_list_option_heading_promotion_default.md)]
- **Exclude YAML Front Matter using the -fmex option**: Validation File [[32a_list_option_front_matter_fmex.md](file:///c:/splist/demo_cases/success_cases/32a_list_option_front_matter_fmex.md)]
- **Extract YAML Front Matter independently (start from 01) using the -fm01 option**: Validation File [[32b_list_option_front_matter_fm01.md](file:///c:/splist/demo_cases/success_cases/32b_list_option_front_matter_fm01.md)]
- **Extract YAML Front Matter rationally (start from 00 / Default) using the -fm00 option**: Validation File [[32c_list_option_front_matter_fm00.md](file:///c:/splist/demo_cases/success_cases/32c_list_option_front_matter_fm00.md)]

💡 **Execution is Fastest and Surest via Drag & Drop!**
Manually typing an absolute file path (`C:\...`) on the keyboard is highly prone to typos and missing spaces, making it very tedious.
From the VS Code Explorer (left sidebar), **drag & drop (D&D) the file you want to split directly into the terminal**. The exact file path will be auto-populated instantly!

### 📂 Collision Avoidance and Versioning (New Feature!)

SPLIST comes standard with **"safe version control per directory (folder)"**. No matter how many times you split the same file, existing files will never be overwritten and lost!

By appending the following options at the end of the command, you can freely control the behavior:
* **(No specify)**: Safely creates new folders with sequential suffixes like `_v02`, `_v03`. Validation File [[37_common_option_conflict_default_default.md](file:///c:/splist/demo_cases/success_cases/37_common_option_conflict_default_default.md)]
* **`-d` (Date)**: Adds today's date to the folder name (e.g., `_20260716`). Validation File [[38_common_option_conflict_date_opt.md](file:///c:/splist/demo_cases/success_cases/38_common_option_conflict_date_opt.md)]
* **`-t` (Time)**: Adds the current time to the folder name (e.g., `_20260716_153000`). Validation File [[39_common_option_conflict_time_opt.md](file:///c:/splist/demo_cases/success_cases/39_common_option_conflict_time_opt.md)]
* **`-s` (Skip)**: If the folder already exists, it safely skips without overwriting. Validation File [[40_common_option_conflict_skip_opt.md](file:///c:/splist/demo_cases/success_cases/40_common_option_conflict_skip_opt.md)]
* **`-f` (Force)**: [WARNING] Forcibly overwrites (resets) existing folders. Validation File [[41_common_option_conflict_force_opt.md](file:///c:/splist/demo_cases/success_cases/41_common_option_conflict_force_opt.md)]

### 📝 Front Matter Processing Options

You can control how the YAML Front Matter (metadata enclosed by `---`) at the top of a Markdown file is processed.

* **(No specify) or `-fm00`**: Extracts the Front Matter independently as `00_FrontMatter.md`. H1 and intro text will become `01_`, resulting in rational classification.
* **`-fm01`**: Extracts the Front Matter as `01_FrontMatter.md`, making the start of the body text `02_`.
* **`-fmex`**: Completely excludes (Exclude) the Front Matter and outputs only the body text.

### 📂 Output Management Philosophy: Switching Between Safety and Efficiency

By default, SPLIST is designed with a **Safety-First architecture** that utilizes "version control (adding sequential numbers)" to prevent accidentally erasing existing files. However, depending on your development cycle or preferences, there may be times you want to customize this behavior.

Choose from the following 3 management strategies based on your use case:

#### 1. [Standard] Keep History (Default)
When you run `splist target.md list` (or simply `splist target.md`), it assigns sequential suffixes like `_v02` or `_v03` to prevent conflicting with existing folders.
*   **Use Case:** When you want to retain past backups as needed.
*   **Command:** `splist target.md`

#### 2. [Safe] Protect Existing (Skip)
If a folder already exists, **SPLIST does nothing.** This completely eliminates the risk of accidentally overwriting files you have already hand-tweaked.
*   **Use Case:** When you've already made fine adjustments manually and want to prevent auto-generated output from destroying your work.
*   **Command:** `splist target.md -s`

#### 3. [Aggressive] Destructive Overwrite (Force)
Forcibly overwrites the folder if it exists. Previous files will be permanently deleted.
*   **Use Case:** During extreme trial-and-error where you modify the Raw data, split, check the output, delete it, and try again over and over.
*   **Command:** `splist target.md -f` (Use with caution)

### 📑 Image of Heading Structure

You are likely familiar with text written with hashtags (`#`) in Markdown files. They serve the same role as `h1` through `h6` tags in normal websites (HTML).

```markdown
# Title

## Heading h2
Body text body text body text
Body text body text body text

## Heading h2
Body text body text body text
```

#### 📂 Split Folder Tree (Image)

```text
📂 01_Title/
├── 📄 01_Heading_h2.md
├── 📄 02_Heading_h2.md   ← (※ "### Heading h3" will be preserved inside this)
└── 📄 03_Heading_h2.md
```

In standard Markdown, H1 (`#`) corresponds to the article title, so it's typically used only once.
Therefore, each section within the body usually uses headings up to `##` or `###`.
However, **this tool splits at the `##` (H2) unit by default**. Splitting down to `###` could result in pieces that are too fragmented.

💡 **Over 50 Experimental Playground Files to Try**
The SPLIST repository includes 53 practical test data cases covering extreme conditions and convenient usages. Running `npm run demo` in the root directory generates all demo files into `demo_cases/demo_cases_raw/`. Drag & drop these files directly into your VS Code terminal and experience the magic of splitting right now!

# When You Want to Forcibly Sever by Specified Symbols

## Cut with the Standard Scissors Symbol

Simply writing `✂️` or `cut` at the beginning of a line establishes a boundary to split the file before and after it.
The resulting split files are automatically assigned sequential numbers like `01_Part.md`. Unnecessary blank lines before and after are cleanly trimmed, and the scissors symbol itself is neatly removed from the output files.

## Cut by Specifying Custom Characters or Symbols

When you want to use a "custom symbol" as the cut criteria—such as for scene transitions in a novel, chat logs, or system output data—you can specify a custom marker.

For instance, specifying `===` will detect every location where a line starts with `===` and forcefully split there. You can specify any string you like, including patterns common in novels like `***` or `◆◆◆`, log files' `[EOF]`, or chat logs' `[Date/Time]`.

**Execution Example:** `splist target_file.txt sp "==="`

## 🛠️ Secret Trick: Hardcoding Your Default Cut Symbol

For heavy users who find it tedious to specify `"==="` or `"◆◆◆"` as an option argument every time, there is a secret trick to make your own custom scissors the default.

Open SPLIST's core logic file `src/commands/sp_default.js`, directly edit the constant for the regex cut marker at the beginning of lines to your preferred symbol, and save. Simply by running `splist target.txt` without arguments (thanks to the `.txt` smart default), you'll be able to tear through texts with your very own custom marker anytime.

# When You Want to Organize Using Heading Structure

## The Classic Pattern Split

The most fundamental usage is splitting meeting minutes or manuals composed of `#` and `##`.
When executed, the tool creates a "Parent Folder" from the topmost `#` (H1), carves out files for each `##` (H2) within it, and tucks them neatly inside the folder.
Furthermore, it automatically prepends sequential numbers like `01_` to all files and folders so they naturally line up in the order of the original text.

### 🌟 Real-World Data Split Example

As a practical validation, when the authentic VS Code official documentation draft `vscode-docs/color-theme.md` (published by Microsoft) was fed into SPLIST, it instantly reconstructed into the following magical hierarchical structure.

**Folder Tree After SPLIST Execution:**

```text
📂 🔢color-theme/
└── 📁 03_Color Theme/
    ├── 📄 00_Overview.md                               (Intro text right below heading)
    ├── 📄 01_Workbench colors.md                       (Each section is individually)
    ├── 📄 02_Syntax colors.md                          (carved into independent files)
    ├── 📄 03_Semantic colors.md
    └── 📄 04_Create a new Color Theme.md ... (continues)
```

No more endless, manual copying, pasting, and saving new files. Raw technical documents are instantly reborn as beautiful assets.

## Maintaining Deep Hierarchies and Complex Structures

**Auto-Correction of Markdown Syntax and Bypassing It (`keep` Option)**

Generally, in Markdown, `#` (H1) is used as the overall title, and `##` (H2) as the heading for each section. When SPLIST carves out `##` sections into separate files, leaving them as-is would result in "files without an H1 (grammatically unnatural)". Therefore, SPLIST has a default **correction feature that automatically converts (promotes) `##` to `#` when saving**.

**Execution Example:** `splist target.md keep`
※ If you specify `keep`, auto-promotion is disabled, and the extraction remains pure, fully maintaining the original `##` or `###` hierarchies.

## Removing Sequential Numbers / Extracting Specific Hierarchies

You can fine-tune SPLIST's behavior even further to match your goals.

### 🔢 1. Remove Sequential Numbers (`un` Option)

Disables the sequential numbers like `01_` that are prepended by default.
Perfect for splitting "dictionary data to be sorted alphabetically" or "API documentation where you want filenames to match function names exactly."

**Execution Example:** `splist dictionary.md un`

### 🔍 2. Split at Arbitrary Depth (`"###"` Option)

The default splitting criteria is `##` (H2), but you can target deeper hierarchies.
For example, by specifying `"###"`, you can finely dice the files down to the third-tier subheading level.

## 💡 Typing Support to Accelerate Writing

Typing `#`—the staple of Markdown—on a PC keyboard requires stretching fingers (like Shift + 3), which is a significant typing burden.
Thus, SPLIST comes standard with smart input shortcuts designed to skyrocket your document writing speed. If you place the following at the beginning of a line while writing, they will automatically be converted to correct Markdown symbols upon processing.

* Type `v ` (lowercase v + half-width space) at start of line = **`# ` (H1)**
* Type `vv ` at start of line = **`## ` (H2)**

With hardly any movement from the home position, you can blast through building heading structures just by gliding over the keyboard.

# Edge Cases and Limit Test Results

## Safe Design of Forced Cut (`sp`) and Empirical Results

Because it handles text without a structure like Markdown, powerful guardrails are implemented to prevent unexpected misfires.

- **Does not process files with zero markers**: Validation File [[11_sp_safety_no_cuts_default.md](file:///c:/splist/demo_cases/success_cases/11_sp_safety_no_cuts_default.md)]
- **Does not process even if line 1 is a marker**: Validation File [[08_sp_safety_start_with_cut_default.md](file:///c:/splist/demo_cases/success_cases/08_sp_safety_start_with_cut_default.md)]
- **Does not process even if the last line is a marker**: Validation File [[09_sp_safety_end_with_cut_default.md](file:///c:/splist/demo_cases/success_cases/09_sp_safety_end_with_cut_default.md)]
- **Ignores consecutive markers**: Validation File [[07_sp_safety_consecutive_cuts_default.md](file:///c:/splist/demo_cases/success_cases/07_sp_safety_consecutive_cuts_default.md)]
- **Ignores markers mid-sentence**: Validation File [[10_sp_safety_false_scissors_default.md](file:///c:/splist/demo_cases/success_cases/10_sp_safety_false_scissors_default.md)]
- **Processes markers inside code blocks**: Validation File [[12_sp_safety_cut_in_codeblock_default.md](file:///c:/splist/demo_cases/success_cases/12_sp_safety_cut_in_codeblock_default.md)]
- **Removes invalid characters / Trims overly long headings to 50 chars**: Validation File [[13_sp_safety_long_and_invalid_chars_default.md](file:///c:/splist/demo_cases/success_cases/13_sp_safety_long_and_invalid_chars_default.md)]

### 1. Ignoring Cut Marks Mid-Sentence (Inline)

It absolutely will not split at `===` or `✂️` accidentally used mid-sentence in a chat log or conversation. To prevent misfires, a safety check ensures it triggers ONLY when placed independently at the "start of a line."
Validation Anti-Pattern [[15_sp_warn_inline_cut_default.md](file:///c:/splist/demo_cases/success_cases/15_sp_warn_inline_cut_default.md)]

### 2. Preventing Consecutive Markers and Empty File Generation

If scissors symbols or `cut`s are placed consecutively over multiple lines, or if there are useless markers at the very beginning or end of a file, the tool automatically detects and smartly skips them. This prevents polluting the disk by mass-generating empty "0-byte garbage files."

---
## Safe Design of Logical Organize (`list`) and Empirical Results

To prevent data destruction or errors unintended by the user, a robust safety design has cleared limit tests utilizing various edge cases and raw real-world data.

- **Carves out document intros before the first H2 into an Overview**: Validation File [[26_list_safety_overview_logic_default.md](file:///c:/splist/demo_cases/success_cases/26_list_safety_overview_logic_default.md)]
- **Auto-cleanses invalid chars, preserves surrogate pair emojis, trims at 50 chars**: Validation File [[27_list_safety_naming_limit_default.md](file:///c:/splist/demo_cases/success_cases/27_list_safety_naming_limit_default.md)]
- **Validates deep nesting up to H6 level remains intact on output**: Validation File [[28_list_safety_deep_nesting_default.md](file:///c:/splist/demo_cases/success_cases/28_list_safety_deep_nesting_default.md)]
- **Collision avoidance for identical heading names (safe save via renaming)**: Validation File [[29_list_safety_duplicate_headings_default.md](file:///c:/splist/demo_cases/success_cases/29_list_safety_duplicate_headings_default.md)]
- **Validates list bullets and other Markdown elements do not disrupt the heading parser**: Validation File [[30_list_safety_mixed_markers_default.md](file:///c:/splist/demo_cases/success_cases/30_list_safety_mixed_markers_default.md)]
- **Validates completely ignoring fake headings inside code blocks**: Validation File [[31_list_safety_codeblock_trap_default.md](file:///c:/splist/demo_cases/success_cases/31_list_safety_codeblock_trap_default.md)]
- **Validates ignoring YAML Front Matter (---)**: Validation File [[32_list_safety_front_matter_default.md](file:///c:/splist/demo_cases/success_cases/32_list_safety_front_matter_default.md)]
- **Safe fallback processing for invalid markdown space headings, etc.**: Validation File [[33_list_safety_bad_markdown_default.md](file:///c:/splist/demo_cases/success_cases/33_list_safety_bad_markdown_default.md)]
- **Structural parsing load test on massive volume Markdown**: Validation File [[34_list_safety_massive_volume_default.md](file:///c:/splist/demo_cases/success_cases/34_list_safety_massive_volume_default.md)]
- **Warning Case: Ignores headings missing a space**: Validation File [[35_list_warn_no_space_heading_default.md](file:///c:/splist/demo_cases/success_cases/35_list_warn_no_space_heading_default.md)]
- **Warning Case: Prevents heading loss caused by unclosed code blocks**: Validation File [[36_list_warn_unclosed_codeblock_default.md](file:///c:/splist/demo_cases/success_cases/36_list_warn_unclosed_codeblock_default.md)]

### 1. Completely Ignoring "Fake Headings" Inside Code Blocks

Prevents erroneously generating folders by mistaking `# Comments` or `## Samples` written within program source code or Markdown tutorials as structural headings. Anything inside a code block wrapped by triple backticks is treated as a total safe zone and parsing is skipped.

### 2. Auto-Cleansing of Invalid Characters in Filenames

Even if a heading contains forbidden NG characters that OSes reject as filenames like `\ / : * ? " < > |`, the system will not crash. It automatically removes/replaces them, generating and saving a safe filename.

### 3. Emoji Support and Character Limit

Even if special surrogate-pair Kanji or complex emojis exist in a heading, it accurately determines character boundaries to prevent garbling, smartly cutting at a safe maximum of 50 characters to avoid exceeding OS limits.

### 💡 Integration Cases
- **Structural parsing proof on VS Code official specs (mixed YAML/code block data)**: Validation File [[42_integration_vscode_color_theme_default.md](file:///c:/splist/demo_cases/success_cases/42_integration_vscode_color_theme_default.md)]
- **Self-build split proof on SPLIST Official Manual**: Validation File [[43_integration_official_manual_default.md](file:///c:/splist/demo_cases/success_cases/43_integration_official_manual_default.md)]

### 💡 Operations Become Dramatically Easier

Now that you have these independent Markdown files, you can open them directly in VS Code, enjoying a comfortable writing and editing experience while viewing previews.
Once you've finished tweaking the text, just toss the file directly into the `splist` engine via the terminal, and your usual beautiful hierarchical folders will be completed instantly.





* **Empirical Record:** During the validation of the aforementioned VS Code official documentation (`color-theme.md`), it brilliantly ignored all hashtag headings inside the massive amount of Markdown code samples (```markdown ...```) contained within, succeeding in extracting 100% accurately ONLY the true table of contents structure of the document itself.