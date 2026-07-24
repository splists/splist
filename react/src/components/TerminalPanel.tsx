interface TerminalPanelProps {
  inputFileName: string;
  splitMode: string;
  generateToc: boolean;
  resultsCount: number;
  errorMsg: string;
  onSplit: () => void;
}

export function TerminalPanel({
  inputFileName,
  splitMode,
  generateToc,
  resultsCount,
  errorMsg,
  onSplit
}: TerminalPanelProps) {
  const flags = generateToc ? ' -toc' : '';
  const cliCommand = `splist ${inputFileName || 'input.md'} ${splitMode}${flags}`;

  return (
    <div className="vscode-terminal-panel">
      <div className="terminal-header">
        <div className="terminal-tabs">
          <span className="terminal-tab active">TERMINAL</span>
          <span className="terminal-tab">OUTPUT</span>
          <span className="terminal-tab">PROBLEMS</span>
        </div>
        <div className="terminal-status-info">
          CLI EQUIVALENT: <code className="cmd-badge">{cliCommand}</code>
        </div>
      </div>
      <div className="terminal-body">
        <div className="terminal-line prompt-line" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div><span className="prompt-path">PS C:\splist&gt;</span> <span className="prompt-cmd">{cliCommand}</span></div>
          <button className="terminal-run-btn" onClick={onSplit} title="Execute command">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            RUN (Enter)
          </button>
        </div>
        {errorMsg ? (
          <div className="terminal-line error-line">
            ❌ Error: {errorMsg}
          </div>
        ) : resultsCount > 0 ? (
          <>
            <div className="terminal-line success-line">
              🎉 Splisted! Successfully processed {inputFileName || 'input.md'}
            </div>
            <div className="terminal-line info-line">
              📁 Created {resultsCount} structured files in virtual output directory.
            </div>
          </>
        ) : (
          <div className="terminal-line hint-line">
            💡 Click "PREVIEW: RUN SPLIST" above or press Ctrl+Enter to execute.
          </div>
        )}
      </div>
    </div>
  );
}
