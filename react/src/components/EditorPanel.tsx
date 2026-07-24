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
  selectedFile: { name: string; content: string; isInput: boolean } | null;
  onSelectInput: () => void;
  onFileDrop: (filename: string, content: string) => void;
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
  selectedFile,
  onSelectInput,
  onFileDrop,
}: EditorPanelProps) {
  const isEditingInput = !selectedFile || selectedFile.isInput;

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
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onFileDrop(file.name, event.target.result.toString());
        }
      };
      reader.readAsText(file);
    } else {
      const droppedText = e.dataTransfer.getData('text');
      if (droppedText) {
        onFileDrop('pasted_input.md', droppedText);
      }
    }
  };

  return (
    <section className="panel editor-main-panel">
      {/* VS Code Editor File Tab Bar */}
      <div className="editor-tabs-bar">
        <div
          className={`editor-tab-item ${isEditingInput ? 'active' : ''}`}
          onClick={onSelectInput}
        >
          <svg className="file-icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span className="tab-title">{inputFileName || 'input.md'}</span>
          <span className="tab-badge">EDITING</span>
        </div>

        {!isEditingInput && selectedFile && (
          <div className="editor-tab-item active output-preview-tab">
            <svg className="file-icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span className="tab-title">{selectedFile.name}</span>
            <span className="tab-badge preview-tag">OUTPUT PREVIEW</span>
          </div>
        )}
      </div>

      {/* Editor Controls Bar */}
      <div className="panel-header editor-header-controls">
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
              LIST (# HEADINGS)
            </span>
          </label>
        </div>

        <div className="input-file-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <label className="toggle" title="Add index file (00_TOC.md) inside output">
            <input
              type="checkbox"
              checked={generateToc}
              onChange={(e) => setGenerateToc(e.target.checked)}
            />
            <span className="slider"></span>
            <span className="label-text" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>+ 00_TOC.MD</span>
          </label>
          <button
            className="quick-action-btn sample-btn"
            onClick={onLoadSample}
            title="Load Sample README.md"
          >
            README SAMPLE
          </button>
          {inputText && (
            <button
              className="quick-action-btn clear-btn"
              onClick={onClear}
              title="Clear editor text"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Content View Area */}
      {isEditingInput ? (
        <div
          className={`editor-container ${isDragging ? 'drag-over' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ position: 'relative' }}
        >
          {inputText && !isDragging && (
            <div style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '0.75rem', color: '#6a9955', pointerEvents: 'none', fontStyle: 'italic' }}>
              💡 Drag & Drop your own .md file here to split it!
            </div>
          )}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Drag & Drop your Markdown file here, or paste text to split..."
          />

          {!inputText && !isDragging && (
            <div className="empty-dropzone-watermark" onClick={() => document.querySelector('textarea')?.focus()}>
              <svg className="watermark-icon-svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
      ) : (
        /* Output Preview View */
        <div className="editor-output-preview">
          <div className="preview-banner">
            <span>PREVIEWING SPLISTED GENERATED FILE: <strong>{selectedFile?.name}</strong></span>
            <button className="back-to-edit-btn" onClick={onSelectInput}>
              ✏️ Back to Edit Input Document
            </button>
          </div>
          <pre className="output-preview-code">
            <code>{selectedFile?.content}</code>
          </pre>
        </div>
      )}
    </section>
  );
}
