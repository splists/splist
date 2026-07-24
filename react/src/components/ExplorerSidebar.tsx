import React, { useState } from 'react';
import type { SplistOutput } from '../types/splist';

interface ExplorerSidebarProps {
  availableInputs: { name: string; content: string }[];
  results: SplistOutput[];
  errorMsg: string;
  selectedFile: { name: string; content: string; isInput: boolean } | null;
  onSelectInput: (name?: string, content?: string) => void;
  onSelectOutput: (name: string, content: string) => void;
  demoCaseNames: string[];
  onSelectDemo: (filename: string) => void;
  onLoadSample: () => void;
}

export function ExplorerSidebar({
  availableInputs,
  results,
  errorMsg,
  selectedFile,
  onSelectInput,
  onSelectOutput,
  demoCaseNames,
  onSelectDemo,
  onLoadSample,
}: ExplorerSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  // Group results into folders
  const folders: Record<string, Array<{ name: string; data: string }>> = {};
  results.forEach((file) => {
    const parts = file.filepath.split('/');
    const fileName = parts.pop() || 'unknown.md';
    const folderName = parts.length > 0 ? parts[parts.length - 1] : 'Output';

    if (!folders[folderName]) folders[folderName] = [];
    folders[folderName].push({ name: fileName, data: file.data });
  });

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: prev[folderName] === undefined ? false : !prev[folderName],
    }));
  };

  const handleDownloadZip = async (
    e: React.MouseEvent,
    folderName: string,
    folderFiles: Array<{ name: string; data: string }>
  ) => {
    e.stopPropagation();
    if (typeof window.JSZip === 'undefined') {
      alert('JSZip library is not loaded. Cannot create ZIP.');
      return;
    }

    const zip = new window.JSZip();
    folderFiles.forEach((file) => {
      zip.file(file.name, file.data);
    });

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const element = document.createElement('a');
      element.href = url;
      element.download = `${folderName}.zip`;
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ZIP generation failed:', err);
      alert('Failed to generate ZIP file.');
    }
  };

  const handleDownloadFile = (e: React.MouseEvent, filename: string, content: string) => {
    e.stopPropagation();
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.href = url;
    element.download = filename;
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  };

  const folderNames = Object.keys(folders);

  return (
    <aside className="vscode-sidebar-explorer">
      <div className="sidebar-section-header">
        <span>EXPLORER</span>
      </div>

      {/* RAW INPUT SECTION */}
      <div className="sidebar-tree-group">
        <div className="sidebar-group-title">
          <span>DOCUMENT INPUT</span>
        </div>
        {availableInputs.map((input) => (
          <div
            key={input.name}
            className={`sidebar-tree-item ${selectedFile?.name === input.name && selectedFile?.isInput ? 'active' : ''}`}
            onClick={() => onSelectInput(input.name, input.content)}
          >
            <svg className="file-icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span className="tree-item-name">{input.name}</span>
          </div>
        ))}
      </div>

      {/* DEMO GALLERY PICKER */}
      {demoCaseNames.length > 0 && (
        <div className="sidebar-tree-group">
          <div className="sidebar-group-title">
            <span>DEMO TEST CASES</span>
          </div>
          <div className="sidebar-demo-picker">
            <select
              className="sidebar-select-input"
              onChange={(e) => onSelectDemo(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>📁 Pick a Test Case...</option>
              {demoCaseNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* SPLISTED OUTPUT FOLDERS TREE */}
      <div className="sidebar-tree-group output-group">
        <div className="sidebar-group-title">
          <span>SPLISTED OUTPUT ({results.length})</span>
        </div>

        {errorMsg && <div className="sidebar-error-msg">⚠️ {errorMsg}</div>}

        {results.length === 0 && !errorMsg && (
          <div className="sidebar-empty-hint">
            Run <strong>SPLIST</strong> to generate split folders here.
          </div>
        )}

        {folderNames.map((folderName) => {
          const files = folders[folderName];
          const isExpanded = expandedFolders[folderName] !== false;

          return (
            <div key={folderName} className="sidebar-folder-node">
              <div
                className="sidebar-folder-row"
                onClick={() => toggleFolder(folderName)}
              >
                <span className="chevron-icon">{isExpanded ? '▼' : '▶'}</span>
                <svg className="folder-icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                </svg>
                <span className="folder-title-text">{folderName}</span>

                <button
                  className="sidebar-action-btn zip-btn"
                  onClick={(e) => handleDownloadZip(e, folderName, files)}
                  title="Download Folder ZIP"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 8v13H3V8"></path>
                    <path d="M1 3h22v5H1z"></path>
                  </svg>
                </button>
              </div>

              {isExpanded && (
                <div className="sidebar-folder-children">
                  {files.map((file) => {
                    const isSelected = selectedFile?.name === file.name && !selectedFile?.isInput;
                    return (
                      <div
                        key={file.name}
                        className={`sidebar-tree-item child-item ${isSelected ? 'active' : ''}`}
                        onClick={() => onSelectOutput(file.name, file.data)}
                      >
                        <svg className="file-icon-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <span className="tree-item-name">{file.name}</span>
                        <button
                          className="sidebar-action-btn file-dl-btn"
                          onClick={(e) => handleDownloadFile(e, file.name, file.data)}
                          title="Download File"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
