import { useState, useEffect } from 'react';
import readmeText from '../../README.md?raw';
import { Header } from './components/Header';
import { EditorPanel } from './components/EditorPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { Statusbar } from './components/Statusbar';
import type { SplistOutput, SplistConfig } from './types/splist';
import './App.css';

export function App() {
  const [inputText, setInputText] = useState(readmeText);
  const [inputFileName, setInputFileName] = useState('README.md');
  const [splitMode, setSplitMode] = useState('list');
  const [generateToc, setGenerateToc] = useState(false);
  const [results, setResults] = useState<SplistOutput[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);

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

  // Run initial demo split on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.SplistAPI) {
        executeSplit(readmeText, 'README.md', 'list', false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Prevent default window drag/drop behavior
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
    executeSplit(readmeText, 'README.md', splitMode, generateToc);
  };

  const handleClear = () => {
    setInputText('');
    setInputFileName('input.md');
    setResults([]);
    setErrorMsg('');
  };

  return (
    <div className="app-container">
      <Header />
      <main className="workspace">
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
        />
        <ResultsPanel results={results} errorMsg={errorMsg} />
      </main>
      <Statusbar
        splitMode={splitMode}
        generateToc={generateToc}
        totalFiles={results.length}
      />
    </div>
  );
}

export default App;
