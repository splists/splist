interface StatusbarProps {
  splitMode: string;
  generateToc: boolean;
  totalFiles: number;
}

export function Statusbar({ splitMode, generateToc, totalFiles }: StatusbarProps) {
  return (
    <footer className="vscode-statusbar">
      <div className="statusbar-left">
        <span className="statusbar-item statusbar-brand">⚡ SPLIST V2.0.0</span>
        <span className="statusbar-item">MODE: {splitMode === 'sp' ? 'SP (✂️ MARKERS)' : 'LIST (# HEADINGS)'}</span>
        <span className="statusbar-item">{generateToc ? 'TOC: 00_TOC.MD' : 'TOC: OFF'}</span>
      </div>
      <div className="statusbar-right">
        <span className="statusbar-item">{totalFiles > 0 ? `SPLISTED: ${totalFiles} FILES` : 'READY'}</span>
        <span className="statusbar-item">UTF-8</span>
        <span className="statusbar-item">MARKDOWN</span>
      </div>
    </footer>
  );
}
