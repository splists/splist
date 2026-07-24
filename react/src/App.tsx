import { useState, useEffect } from 'react';
import readmeText from '../../README.md?raw';
import usageText from '../../USAGE.md?raw';
import { Header } from './components/Header';
import { EditorPanel } from './components/EditorPanel';
import { Statusbar } from './components/Statusbar';
import { HelpModal } from './components/HelpModal';
import { ActivityBar } from './components/ActivityBar';
import { ExplorerSidebar } from './components/ExplorerSidebar';
import { TerminalPanel } from './components/TerminalPanel';
import type { SplistOutput, SplistConfig } from './types/splist';
import './App.css';

// Load demo cases
const demoCases = import.meta.glob('../../demo_cases/demo_cases_raw/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const demoCaseNames = Object.keys(demoCases).map((path) => {
  const parts = path.split('/');
  return parts[parts.length - 1];
}).sort();

export function App() {
  const [inputText, setInputText] = useState(readmeText);
  const [inputFileName, setInputFileName] = useState('README.md');
  const [splitMode, setSplitMode] = useState('list');
  const [generateToc, setGenerateToc] = useState(false);
  const [results, setResults] = useState<SplistOutput[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeView, setActiveView] = useState<'explorer' | 'docs' | 'demo'>('explorer');

  const [availableInputs, setAvailableInputs] = useState([
    { name: 'README.md', content: readmeText },
    { name: 'USAGE.md', content: usageText }
  ]);

  // Selected file state for VS Code editor tab / preview
  const [selectedFile, setSelectedFile] = useState<{ name: string; content: string; isInput: boolean } | null>({
    name: 'README.md',
    content: readmeText,
    isInput: true,
  });

  const executeSplit = async (text: string, filename: string, mode: string, toc: boolean) => {
    if (!text) {
      setResults([]);
      return;
    }

    const config: SplistConfig = {
      conflictMode: 'v',
      generateToc: toc,
      customMarker: mode === 'sp' ? '✂️' : null,
      frontmatterMode: 'extract00',
      outDir: null,
      mode: mode,
    };

    const virtualFilename = filename || 'input.md';
    window.VFS = window.VFS || {};
    window.VFS[virtualFilename] = text;
    window.SPLIST_OUTPUT = [];

    try {
      if (window.SplistAPI && window.SplistAPI.runSplist) {
        await window.SplistAPI.runSplist(virtualFilename, config);
        setResults([...window.SPLIST_OUTPUT]);
        setErrorMsg('');
      } else {
        setErrorMsg('SplistAPI is not loaded.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Unknown error');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.SplistAPI) {
        executeSplit(readmeText, 'README.md', 'list', false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      document.body.addEventListener(eventName, preventDefaults, false);
    });
    return () => {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        document.body.removeEventListener(eventName, preventDefaults, false);
      });
    };
  }, []);

  const handleSplit = () => {
    executeSplit(inputText, inputFileName, splitMode, generateToc);
  };

  const handleLoadSample = () => {
    setInputText(readmeText);
    setInputFileName('README.md');
    setSelectedFile({ name: 'README.md', content: readmeText, isInput: true });
    executeSplit(readmeText, 'README.md', splitMode, generateToc);
  };

  const handleClear = () => {
    setInputText('');
    setInputFileName('input.md');
    setSelectedFile({ name: 'input.md', content: '', isInput: true });
    setResults([]);
    setErrorMsg('');
  };

  const handleSelectInput = (filename?: string, content?: string) => {
    const fn = filename || inputFileName || 'input.md';
    const ct = content !== undefined ? content : inputText;
    
    setInputFileName(fn);
    setInputText(ct);
    setSelectedFile({ name: fn, content: ct, isInput: true });
  };

  const handleSelectOutput = (filename: string, content: string) => {
    setSelectedFile({ name: filename, content: content, isInput: false });
  };

  const handleSelectDemo = (filename: string) => {
    const fullPath = Object.keys(demoCases).find((p) => p.endsWith(filename));
    if (fullPath && demoCases[fullPath]) {
      const demoContent = demoCases[fullPath];
      setInputFileName(filename);
      setInputText(demoContent);
      setSelectedFile({ name: filename, content: demoContent, isInput: true });
    }
  };

  const handleFileDrop = (filename: string, content: string) => {
    // Add to available inputs if it doesn't exist
    setAvailableInputs((prev) => {
      const exists = prev.some((i) => i.name === filename);
      if (!exists) {
        return [{ name: filename, content }, ...prev];
      }
      // If exists, update its content
      return prev.map(i => i.name === filename ? { ...i, content } : i);
    });
    
    setInputFileName(filename);
    setInputText(content);
    setSelectedFile({ name: filename, content, isInput: true });
  };

  return (
    <div className="app-container">
      <Header onOpenDocs={() => setIsHelpOpen(true)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <div className="ide-layout-body">
        <ActivityBar
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenDocs={() => setIsHelpOpen(true)}
        />

        <ExplorerSidebar
          availableInputs={availableInputs}
          results={results}
          errorMsg={errorMsg}
          selectedFile={selectedFile}
          onSelectInput={handleSelectInput}
          onSelectOutput={handleSelectOutput}
          demoCaseNames={demoCaseNames}
          onSelectDemo={handleSelectDemo}
          onLoadSample={handleLoadSample}
        />

        <main className="workspace-container">
          <div className="workspace single-editor-mode">
            <EditorPanel
              inputText={inputText}
              setInputText={setInputText}
              inputFileName={inputFileName}
              setInputFileName={setInputFileName}
              splitMode={splitMode}
              setSplitMode={setSplitMode}
              generateToc={generateToc}
              setGenerateToc={setGenerateToc}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              onSplit={handleSplit}
              onLoadSample={handleLoadSample}
              onClear={handleClear}
              selectedFile={selectedFile}
              onSelectInput={handleSelectInput}
              onFileDrop={handleFileDrop}
            />
          </div>

          <TerminalPanel
            inputFileName={inputFileName}
            splitMode={splitMode}
            generateToc={generateToc}
            resultsCount={results.length}
            errorMsg={errorMsg}
            onSplit={handleSplit}
          />
        </main>
      </div>

      <Statusbar
        splitMode={splitMode}
        generateToc={generateToc}
        totalFiles={results.length}
      />
    </div>
  );
}

export default App;
