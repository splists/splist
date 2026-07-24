// ============================================================
// ⌨️ argsParser.js — Terminal argument parsing
// ============================================================

'use strict';
const path = require('path');

// Regular expression for recognized options
const OPTIONS_REGEX = /^(-*)(or|un|u|d|date|t|time|s|skip|f|force|toc|fmex|fm00|fm01|o|out|output|k|keep|ext|extension|m|mode|h|header|marker|conflict)$/i;

/**
 * Generates a config object from the command arguments entered in the terminal
 * 
 * @param {string[]} args - Argument array after the target file name
 * @param {string} targetFile - Target file path
 * @returns {Object} config object
 */
const parseOptions = (args = [], targetFile = '') => {
    // Determine the default mode from the extension
    const ext = targetFile ? path.extname(targetFile).toLowerCase() : '';
    const defaultMode = (ext === '.md') ? 'list' : 'sp';

    // Default configuration
    let config = { 
        conflictMode: 'v',     // Folder name conflict resolution mode (v: sequential, d: date, t: time, s: skip, f: overwrite)
        generateToc: false,    // Whether to generate a table of contents
        customMarker: null,    // User-specified custom marker
        frontmatterMode: 'extract00', // How to handle frontmatter
        outDir: null,          // Output destination folder
        mode: defaultMode,     // Smart default based on extension
        keep: false,           // Disable heading auto-promotion
        un: false,             // Remove sequential numbers from filenames
        ext: null              // Extension override
    };

    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        
        // Determine subcommands (sp or list)
        if (arg.toLowerCase() === 'sp' || arg.toLowerCase() === 'list') {
            config.mode = arg.toLowerCase();
            continue;
        }
        
        // Support syntax like `-o=C:\out` or `-o:C:\out`
        let valueFromDelimiter = null;
        const delimMatch = arg.match(/^([^=:]+)[=:](.*)$/);
        if (delimMatch) {
            arg = delimMatch[1];
            valueFromDelimiter = delimMatch[2];
        }

        const match = arg.toLowerCase().match(OPTIONS_REGEX);
        if (match) {
            const opt = match[2];
            switch (opt) {
                case 'o':
                case 'out':
                case 'output':
                    if (valueFromDelimiter !== null) {
                        config.outDir = valueFromDelimiter;
                    } else if (i + 1 < args.length) {
                        config.outDir = args[i + 1];
                        i++; // Skip the next argument path
                    }
                    break;
                case 'd':
                case 'date':
                    config.conflictMode = 'd';
                    break;
                case 't':
                case 'time':
                    config.conflictMode = 't';
                    break;
                case 's':
                case 'skip':
                    config.conflictMode = 's';
                    break;
                case 'f':
                case 'force':
                    config.conflictMode = 'f';
                    break;
                case 'toc':
                    config.generateToc = true;
                    break;
                case 'fmex':
                    config.frontmatterMode = 'exclude';
                    break;
                case 'fm00':
                    config.frontmatterMode = 'extract00';
                    break;
                case 'fm01':
                    config.frontmatterMode = 'extract01';
                    break;
                case 'k':
                case 'keep':
                    config.keep = true;
                    break;
                case 'u':
                case 'un':
                    config.un = true;
                    break;
                case 'h':
                case 'header':
                case 'marker':
                    let markerVal = valueFromDelimiter;
                    if (markerVal === null && i + 1 < args.length && !args[i + 1].match(OPTIONS_REGEX)) {
                        markerVal = args[i + 1];
                        i++;
                    }
                    if (markerVal) config.customMarker = markerVal;
                    break;
                case 'm':
                case 'mode':
                    let modeVal = valueFromDelimiter;
                    if (modeVal === null && i + 1 < args.length && !args[i + 1].match(OPTIONS_REGEX)) {
                        modeVal = args[i + 1];
                        i++;
                    }
                    if (modeVal) {
                        const lower = modeVal.toLowerCase();
                        if (lower === 'un') config.un = true;
                        else if (lower === 'or') config.un = false;
                        else config.customMarker = modeVal;
                    }
                    break;
                case 'conflict':
                    let conflictVal = valueFromDelimiter;
                    if (conflictVal === null && i + 1 < args.length && !args[i + 1].match(OPTIONS_REGEX)) {
                        conflictVal = args[i + 1];
                        i++;
                    }
                    if (conflictVal) {
                        const firstChar = conflictVal.toLowerCase()[0];
                        if (['v', 'd', 't', 's', 'f'].includes(firstChar)) {
                            config.conflictMode = firstChar;
                        }
                    }
                    break;
                case 'ext':
                case 'extension':
                    let extValue = valueFromDelimiter;
                    if (extValue === null && i + 1 < args.length && !args[i + 1].match(OPTIONS_REGEX)) {
                        extValue = args[i + 1];
                        i++; // Skip next argument
                    }
                    if (extValue) {
                        config.ext = extValue.startsWith('.') ? extValue : `.${extValue}`;
                    }
                    break;
            }
        } else {
            // Treat as a custom marker if it doesn't match an option
            config.customMarker = delimMatch ? args[i] : arg;
        }
    }
    return config;
};

module.exports = { parseOptions };
