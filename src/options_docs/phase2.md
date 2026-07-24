# Phase 2: Output Environment Preparation

In the **"Start → 1 → 2 → 3 → 4 → Goal"** pipeline, **Phase 2** is responsible for preparing and securing the output environment (the "container") before the core engine begins splitting content.

---

## Overview & Current Features

Phase 2 acts as a defensive perimeter and environment coordinator, ensuring that split results have a safe destination on disk without risking accidental data loss.

* **Safe Directory Provisioning (`prepareOutputDir`):** Determines, prepares, and recursively creates the target output directory.
* **Conflict Resolution Strategy (`resolveOutputDir`):** Handles existing directory naming conflicts using predefined modes:
* `'v'` (Versioned, e.g., `_v02`)
* `'d'` / `'t'` (UTC Date / Timestamp)
* `'s'` (Skip execution if exists)
* `'f'` (Force overwrite)



---

## Potential Future Extensions

Phase 2 serves as a flexible environment setup pipeline. Potential capabilities that can be hooked into this phase include:

### 1. Safety, Backup, & Simulation

* **Automatic Backup & Retention (`--backup`):** Safely archive existing directories to `.bak` or `_archive` with timestamping instead of overwriting data.
* **OS Trash Integration:** Move existing output to the operating system trash on force overwrite (`-f`).
* **Dry-Run Mode (`--dry-run`):** Simulate directory creation and path resolution without committing changes to disk.
* **Disk Space Pre-flight Check:** Verify available disk space before starting large-scale split operations.

### 2. Dynamic Routing & Cloud Mounts

* **Front Matter & Tag Routing:** Route outputs into hierarchical subdirectories based on metadata (e.g., `category: Tech` -> `Tech/`).
* **Cloud Storage Mounts:** Provision virtual buckets or cloud endpoints (Google Drive, AWS S3) as target containers.
* **Multi-Destination Routing (Tee Output):** Simultaneously output to both local directories and remote cloud targets.

### 3. Packaging & Scaffolding

* **Zip Archiving (`--zip`):** Stage output in temporary directories to produce a compressed `.zip` bundle upon completion.
* **Subdirectory Generation (`--assets`):** Pre-create asset directory structures such as `images/`, `css/`, or `attachments/`.
* **Template File Injection:** Auto-populate output directories with `.gitignore`, `README.md`, or boilerplate configs.

### 4. Git & Version Control Integration

* **Git Repository Initialization (`--git`):** Automatically run `git init` inside the newly created output workspace.
* **Automated Branch Isolation:** Create dedicated Git branches (e.g., `splist-output-20260721`) when targeting existing repositories.

### 5. Application Workspaces & Environments

* **Obsidian / Logseq Vault Setup:** Inject `.obsidian/` or `.logseq/` settings to immediately open the output as a knowledge vault.
* **VS Code Workspace Provisioning:** Place `.vscode/settings.json` and extension recommendations inside the workspace.
* **In-Memory Virtual FS (Diskless Mode):** Stage output entirely in RAM or streams for direct piping to other processes.

### 6. Infrastructure, Remote & Security

* **API & Database Tunneling:** Authenticate and prepare endpoints (Notion, WordPress, MicroCMS) or initialize SQLite `.db` schemas.
* **On-the-Fly Encryption:** Generate encryption keys and stream contexts for AES-256 encrypted output.
* **Concurrency Locking & Logging:** Place `.lock` files to prevent race conditions and initialize `.splist-run.log`.
* **DevOps & CI/CD Scaffolding:** Scaffold GitHub Actions workflows (`.github/workflows/deploy.yml`) or `Dockerfile`s.
* **SSH / SFTP Tunneling:** Establish remote server connections for direct remote streaming.
* **Webhook Pre-flight Checks:** Ping Slack/Discord webhooks to verify notification readiness before starting.

---

## 🔬 Phase 2 Micro-Pipeline Architecture

To keep Phase 2 maintainable and modular, its responsibilities are divided into three sub-phases:

1. **Phase 2-A: Resolve (`resolveTargetEnv`)**
* **Role:** Computes destination paths, handles conflict strategies, and sanitizes forbidden characters.


2. **Phase 2-B: Provision (`provisionEnv`)**
* **Role:** Safely creates physical directories, manages backups/deletions, or initializes cloud/virtual storage.


3. **Phase 2-C: Setup (`setupEnvWorkspace`)**
* **Role:** Scaffolds subdirectories, injects templates, initializes Git, and sets up workspace configurations.



---

## Implementation Architecture Reference

```javascript
// =====================================================================
// PHASE 2: Output Environment Preparation
// =====================================================================
const fs = require('fs');
const path = require('path');
const { resolveOutputDir } = require('./utils');

// [Phase 2-A] Resolve
const resolveTargetEnv = (targetFile, prefix, conflictMode, customOutDir) => {
    const dir = customOutDir || process.env.SPLIST_OUT_DIR || path.dirname(targetFile);
    const baseName = path.basename(targetFile, path.extname(targetFile));
    const basePath = path.join(dir, `${prefix}${baseName}`);

    return resolveOutputDir(basePath, conflictMode);
};

// [Phase 2-B] Provision
const provisionEnv = (outDir, conflictMode) => {
    if (outDir === null) return null; // Skipped via 's' mode

    if (conflictMode === 'f' && fs.existsSync(outDir)) {
        fs.rmSync(outDir, { recursive: true, force: true });
    }

    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    return outDir;
};

// [Phase 2-C] Setup / Scaffold
const setupEnvWorkspace = (outDir, options = {}) => {
    if (outDir === null) return null;

    // Example extension: create assets directory
    if (options.createAssetsDir) {
        const assetsDir = path.join(outDir, 'images');
        if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
    }

    return outDir;
};

// Master Pipeline for Phase 2
const prepareOutputEnv = (targetFile, prefix, conflictMode, customOutDir = null, options = {}) => {
    const resolvedPath = resolveTargetEnv(targetFile, prefix, conflictMode, customOutDir);
    const provisionedDir = provisionEnv(resolvedPath, conflictMode);
    return setupEnvWorkspace(provisionedDir, options);
};

module.exports = { prepareOutputEnv };

```