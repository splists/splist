interface ActivityBarProps {
  activeView: 'explorer' | 'docs' | 'demo';
  setActiveView: (view: 'explorer' | 'docs' | 'demo') => void;
  onOpenDocs: () => void;
}

export function ActivityBar({ activeView, setActiveView, onOpenDocs }: ActivityBarProps) {
  return (
    <aside className="vscode-activity-bar">
      <div className="activity-top">
        <button
          className={`activity-icon-btn ${activeView === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveView('explorer')}
          title="Explorer (Files & Results)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
          <span className="activity-label">FILES</span>
        </button>

        <button
          className={`activity-icon-btn ${activeView === 'demo' ? 'active' : ''}`}
          onClick={() => setActiveView('demo')}
          title="Demo Test Cases Gallery"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          <span className="activity-label">DEMOS</span>
        </button>

        <button
          className={`activity-icon-btn ${activeView === 'docs' ? 'active' : ''}`}
          onClick={() => {
            setActiveView('docs');
            onOpenDocs();
          }}
          title="Documentation Manuals (README/USAGE)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <span className="activity-label">DOCS</span>
        </button>
      </div>

      <div className="activity-bottom">
        <a
          href="https://github.com/splists/splist"
          target="_blank"
          rel="noopener noreferrer"
          className="activity-icon-btn"
          title="GitHub Repository"
        >
          <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
      </div>
    </aside>
  );
}
