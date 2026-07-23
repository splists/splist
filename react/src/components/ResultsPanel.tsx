import { useState } from 'react';

interface ResultsPanelProps {
  results: Array<{ filepath: string; data: string }>;
  errorMsg: string;
}

export function ResultsPanel({ results, errorMsg }: ResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<Record<string, number>>({});
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

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

  const handleSelectFile = (folderName: string, idx: number) => {
    setActiveTab((prev) => ({ ...prev, [folderName]: idx }));
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

  const totalFiles = results.length;
  const folderNames = Object.keys(folders);

  return (
    <section className="panel output-panel">
      <div className="panel-header">
        <h2>SPLISTED OUTPUT</h2>
        {totalFiles > 0 && <span className="badge">{totalFiles} FILES GENERATED</span>}
      </div>

      <div className="results-container explorer-view">
        {errorMsg && <div className="error-card">⚠️ {errorMsg}</div>}

        {totalFiles === 0 && !errorMsg && (
          <div className="empty-state">
            <svg className="empty-icon-svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <p className="empty-title">NO FILES GENERATED YET</p>
            <p className="empty-sub">LOAD OR PASTE A DOCUMENT ON THE LEFT, THEN CLICK <strong>PREVIEW: RUN SPLIST</strong></p>
          </div>
        )}

        {folderNames.map((folderName) => {
          const files = folders[folderName];
          const isExpanded = expandedFolders[folderName] !== false;
          const activeIndex = activeTab[folderName] || 0;
          const currentFile = files[activeIndex] || files[0];

          return (
            <div key={folderName} className="explorer-folder-block">
              {/* Folder Header Row */}
              <div
                className="explorer-folder-header"
                onClick={() => toggleFolder(folderName)}
              >
                <div className="folder-left-info">
                  <span className="chevron-icon">{isExpanded ? '▼' : '▶'}</span>
                  <svg className="folder-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                  </svg>
                  <span className="folder-name-text">{folderName}</span>
                  <span className="file-count-badge">{files.length} FILES</span>
                </div>

                <button
                  className="download-zip-btn"
                  onClick={(e) => handleDownloadZip(e, folderName, files)}
                  title={`Download all ${files.length} files in folder ${folderName} as a ZIP archive`}
                >
                  <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 8v13H3V8"></path>
                    <path d="M1 3h22v5H1z"></path>
                    <path d="M10 12h4"></path>
                  </svg>
                  DOWNLOAD ZIP ({folderName}.ZIP)
                </button>
              </div>

              {/* Vertical Explorer Tree File Items */}
              {isExpanded && (
                <div className="explorer-tree-files">
                  {files.map((file, idx) => {
                    const isSelected = idx === activeIndex;
                    const lineCount = file.data.split('\n').length;
                    return (
                      <div
                        key={file.name}
                        className={`explorer-file-item ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSelectFile(folderName, idx)}
                        title={`Click to preview ${file.name} below`}
                      >
                        <div className="file-item-left">
                          <span className="file-indent-line"></span>
                          <svg className="file-icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          <span className="file-name-text">{file.name}</span>
                        </div>
                        <div className="file-item-right">
                          {isSelected && (
                            <span className="active-preview-badge">
                              <span className="active-badge-dot"></span>
                              PREVIEWING
                            </span>
                          )}
                          <span className="file-lines-meta">{lineCount} LINES</span>
                          <button
                            className="file-download-action-btn"
                            onClick={(e) => handleDownloadFile(e, file.name, file.data)}
                            title={`Download ${file.name}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Active File Preview Box */}
              {isExpanded && currentFile && (
                <div className="file-preview-box active-file-connected">
                  <div className="preview-header">
                    <span className="preview-title">
                      <span className="active-glow-dot"></span>
                      <span className="preview-label-tag">ACTIVE PREVIEW:</span>
                      <strong>{currentFile.name}</strong>
                    </span>
                    <button
                      className="download-single-btn"
                      onClick={(e) =>
                        handleDownloadFile(e, currentFile.name, currentFile.data)
                      }
                      title={`Download ${currentFile.name}`}
                    >
                      <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      DOWNLOAD FILE ({currentFile.name})
                    </button>
                  </div>
                  <pre className="code-preview">
                    <code>{currentFile.data}</code>
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
