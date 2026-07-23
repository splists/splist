import { type DragEvent, useEffect } from 'react';

interface EditorPanelProps {
  inputText: string;
  setInputText: (text: string) => void;
  inputFileName: string;
  setInputFileName: (filename: string) => void;
  splitMode: string;
  setSplitMode: (mode: string) => void;
  generateToc: boolean;
  setGenerateToc: (toc: boolean) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  onSplit: () => void;
  onLoadSample: () => void;
  onClear: () => void;
}

export function EditorPanel({
  inputText,
  setInputText,
  inputFileName,
  setInputFileName,
  splitMode,
  setSplitMode,
  generateToc,
  setGenerateToc,
  isDragging,
  setIsDragging,
  onSplit,
  onLoadSample,
  onClear,
}: EditorPanelProps) {
  const handleDragEnter = () => setIsDragging(true);
  const handleDragOver = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onSplit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSplit]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setInputFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setInputText(event.target.result.toString());
        }
      };
      reader.readAsText(file);
    } else {
      const droppedText = e.dataTransfer.getData('text');
      if (droppedText) {
        setInputFileName('input.md');
        const isFilePath =
          droppedText.startsWith('file://') ||
          /^[a-zA-Z]:\\/.test(droppedText) ||
          (droppedText.length < 500 && droppedText.toLowerCase().endsWith('.md'));

        if (isFilePath) {
          setInputText(
            '【IDE Drop Detected】\n\nBrowsers block reading local files dragged directly from an IDE (like VS Code) for security reasons.\n\nInstead of dragging the file icon from the IDE tree, please either:\n1. Drag the file from Windows Explorer\n2. Open the file, copy the text inside (Ctrl+A -> Ctrl+C), and paste it here.'
          );
        } else {
          setInputText(droppedText);
        }
      }
    }
  };

  return (
    <section className="panel input-panel">
      <div className="panel-header">
        <h2>INPUT DOCUMENT</h2>
        <div className="mode-selector">
          <label className="radio-label" title="Split by custom markers (✂️)">
            <input
              type="radio"
              name="splitMode"
              value="sp"
              checked={splitMode === 'sp'}
              onChange={(e) => setSplitMode(e.target.value)}
            />
            <span className={`radio-btn ${splitMode === 'sp' ? 'is-active' : ''}`}>
              {splitMode === 'sp' ? (
                <svg className="active-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <span className="check-placeholder"></span>
              )}
              SP (✂️ MARKERS)
            </span>
          </label>
          <label className="radio-label" title="Split by Markdown H1/H2 Headings">
            <input
              type="radio"
              name="splitMode"
              value="list"
              checked={splitMode === 'list'}
              onChange={(e) => setSplitMode(e.target.value)}
            />
            <span className={`radio-btn ${splitMode === 'list' ? 'is-active' : ''}`}>
              {splitMode === 'list' ? (
                <svg className="active-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <span className="check-placeholder"></span>
              )}
              LIST (# HEADINGS)
            </span>
          </label>
        </div>
      </div>

      {/* Mode Description Guide Bar */}
      <div className="mode-guide-bar">
        <span className="mode-guide-label">ACTIVE MODE:</span>
        <span className="mode-guide-text">
          {splitMode === 'sp'
            ? 'SPLITTING BY CUSTOM MARKERS (✂️) IN DOCUMENT'
            : 'SPLITTING BY MARKDOWN HEADINGS (# H1, ## H2)'}
        </span>
      </div>

      {/* Input File Bar */}
      <div className="input-file-bar">
        <div className="input-file-info">
          <svg className="file-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span className="input-file-name">{inputFileName || 'input.md'}</span>
        </div>
        <div className="input-file-actions">
          <span className="input-file-stats">
            {inputText ? `${inputText.length.toLocaleString()} CHARS` : 'EMPTY'}
          </span>
          <button
            className="quick-action-btn sample-btn"
            onClick={onLoadSample}
            title="Load Sample Markdown (README.md)"
          >
            <svg className="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            DEMO SAMPLE
          </button>
          {inputText && (
            <button
              className="quick-action-btn clear-btn"
              onClick={onClear}
              title="Clear editor text"
            >
              <svg className="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Text Area & Dropzone Container */}
      <div
        className={`editor-container ${isDragging ? 'drag-over' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Drag & Drop your Markdown file here, or paste text to split..."
        />

        {!inputText && !isDragging && (
          <div className="empty-dropzone-watermark" onClick={() => document.querySelector('textarea')?.focus()}>
            <svg className="watermark-icon-svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <div className="watermark-title">DRAG & DROP MARKDOWN FILE HERE</div>
            <div className="watermark-sub">OR PASTE TEXT DIRECTLY INTO THIS EDITOR</div>
          </div>
        )}

        {isDragging && <div className="overlay-msg">DROP FILE TO LOAD</div>}
      </div>

      {/* Action Controls Footer Bar */}
      <div className="action-bar">
        <div className="options">
          <label className="toggle" title="Add index file (00_TOC.md) inside the output directory">
            <input
              type="checkbox"
              checked={generateToc}
              onChange={(e) => setGenerateToc(e.target.checked)}
            />
            <span className="slider"></span>
            <span className="label-text">ADD 00_TOC.MD INDEX FILE</span>
          </label>
        </div>
        <button onClick={onSplit} className="primary-btn execute-btn">
          <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          PREVIEW: RUN SPLIST
        </button>
      </div>
    </section>
  );
}
