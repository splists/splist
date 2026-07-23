const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const CORE_DIR = path.join(ROOT_DIR, 'src', 'core');
const OPTIONS_DIR = path.join(CORE_DIR, 'options');
const SPLIST_DIR = path.join(CORE_DIR, 'splist');
const OUT_DIR = path.join(ROOT_DIR, 'docs');
const OUT_FILE = path.join(OUT_DIR, 'splist-core.js');
const REACT_PUBLIC_FILE = path.join(ROOT_DIR, 'react', 'public', 'splist-core.js');

fs.mkdirSync(OUT_DIR, { recursive: true });

const createEntry = (relPath, dir, file) => {
  const name = relPath.endsWith('.js') ? relPath : `${relPath}.js`;
  const fileName = (file || relPath.split('/').pop()).replace(/\.js$/, '') + '.js';
  return { name, path: path.join(dir, fileName) };
};

const mapPhases = (prefix, dir) => [1, 2, 3, 4].map(i => createEntry(`${prefix}${i}`, dir));

const files = [
  createEntry('../engine', CORE_DIR),
  ...mapPhases('./phase', SPLIST_DIR),
  ...mapPhases('../options/phase', OPTIONS_DIR),
  createEntry('../options/option', OPTIONS_DIR),
  createEntry('./splist', SPLIST_DIR),
];

let bundleContent = `
// ============================================================
// SPLIST CORE BUNDLE FOR WEB (Zero-Dependency Auto-Generated)
// ============================================================
(function(window) {

  // Virtual File System & Path Mock for Browser
  window.VFS = {};
  window.SPLIST_OUTPUT = [];
  
  // Mock NodeJS process object
  window.process = {
    cwd: () => '/',
    env: {}, // Add empty env object
    exit: (code) => { throw new Error('Process exited with code ' + code); }
  };

  const fsMock = {
    existsSync: (p) => !!(window.VFS && window.VFS[p]), // Check if file exists in Virtual File System
    mkdirSync: () => {},
    rmSync: () => {},
    readFileSync: (filepath) => {
      return window.VFS[filepath] || '';
    },
    writeFileSync: (filepath, data) => {
      // Intercept file write and store in virtual memory!
      window.SPLIST_OUTPUT.push({ filepath, data });
    }
  };

  const pathMock = {
    join: (...args) => args.join('/').replace(/\\\\/g, '/').replace(/\\/\\//g, '/'),
    resolve: (...args) => '/' + args.join('/').replace(/\\\\/g, '/').replace(/\\/\\//g, '/'),
    basename: (p, ext) => {
      let base = p.split('/').pop().split('\\\\').pop();
      if (ext && base.endsWith(ext)) base = base.slice(0, -ext.length);
      return base;
    },
    dirname: (p) => p.split('/').slice(0, -1).join('/') || '.',
    extname: (p) => {
      const parts = p.split('.');
      return parts.length > 1 ? '.' + parts.pop() : '';
    },
    parse: (p) => {
      const base = p.split('/').pop();
      const ext = pathMock.extname(base);
      return { base, ext, name: base.slice(0, base.length - ext.length) };
    }
  };

  // Basic child_process mock
  const childProcessMock = {
    exec: () => {}
  };

  // Simple CommonJS loader
  const modules = {};
  function require(id, currentDir) {
    if (id === 'fs') return fsMock;
    if (id === 'path') return pathMock;
    if (id === 'child_process') return childProcessMock;
    
    // Resolve relative paths
    let resolvedId = id;
    if (id.startsWith('.')) {
      // Very simple resolution for our specific folder structure
      if (currentDir === '../options' && id === './phase1.js') resolvedId = '../options/phase1.js';
      else if (currentDir === '../options' && id === './phase2.js') resolvedId = '../options/phase2.js';
      else if (currentDir === '../options' && id === './phase3.js') resolvedId = '../options/phase3.js';
      else if (currentDir === '../options' && id === './phase4.js') resolvedId = '../options/phase4.js';
      else if (currentDir === '.' && id === '../engine.js') resolvedId = '../engine.js';
      else if (currentDir === '.' && id === '../options/option.js') resolvedId = '../options/option.js';
      else resolvedId = id; // fallback
    }
    
    let modKey = resolvedId.replace(/\.js$/, '');
    
    if (modules[modKey]) {
      return modules[modKey].exports;
    }
    throw new Error('Module not found in bundle: ' + id + ' (resolved as ' + modKey + ') from ' + currentDir);
  }

`;

for (const file of files) {
  const content = fs.readFileSync(file.path, 'utf8');
  const modId = file.name.replace(/\.js$/, '');
  const dirName = file.name.split('/').slice(0, -1).join('/') || '.';

  bundleContent += `
  // --- Module: ${file.name} (id: ${modId}) ---
  modules['${modId}'] = { exports: {} };
  (function(module, exports, require) {
    ${content}
  })(modules['${modId}'], modules['${modId}'].exports, function(id) { return require(id, '${dirName}'); });
  `;
}

bundleContent += `
  // Expose the main entry point to the browser window
  window.SplistAPI = modules['./splist'].exports;
  window.SPLIST_OUTPUT = []; // To capture results

})(window);
`;

[OUT_FILE, REACT_PUBLIC_FILE].forEach(file => fs.writeFileSync(file, bundleContent));
console.log(`✅ Created ${OUT_FILE} & ${REACT_PUBLIC_FILE}`);
