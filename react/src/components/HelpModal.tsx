import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import readmeText from '../../../README.md?raw';
import usageText from '../../../USAGE.md?raw';
import designText from '../../../DESIGN_RATIONALE.md?raw';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<'readme' | 'usage' | 'design'>('readme');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderContent = () => {
    let content = '';
    switch (activeTab) {
      case 'readme':
        content = readmeText;
        break;
      case 'usage':
        content = usageText;
        break;
      case 'design':
        content = designText;
        break;
    }

    return (
      <div className="markdown-body" style={{ padding: '20px', lineHeight: '1.6', color: '#e0e0e0' }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
        backgroundColor: '#1e1e1e',
        border: '1px solid #3c3c3c',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '1000px',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        {/* Header & Tabs */}
        <div className="modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #3c3c3c',
          padding: '15px 20px',
          backgroundColor: '#252526',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}>
          <div className="tabs" style={{ display: 'flex', gap: '15px' }}>
            <button
              className={`tab-btn ${activeTab === 'readme' ? 'active' : ''}`}
              onClick={() => setActiveTab('readme')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'readme' ? '#007acc' : '#a0a0a0',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === 'readme' ? 'bold' : 'normal',
                padding: '5px 0',
                borderBottom: activeTab === 'readme' ? '2px solid #007acc' : '2px solid transparent'
              }}
            >
              📝 README (Overview)
            </button>
            <button
              className={`tab-btn ${activeTab === 'usage' ? 'active' : ''}`}
              onClick={() => setActiveTab('usage')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'usage' ? '#007acc' : '#a0a0a0',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === 'usage' ? 'bold' : 'normal',
                padding: '5px 0',
                borderBottom: activeTab === 'usage' ? '2px solid #007acc' : '2px solid transparent'
              }}
            >
              📖 USAGE (Manual)
            </button>
            <button
              className={`tab-btn ${activeTab === 'design' ? 'active' : ''}`}
              onClick={() => setActiveTab('design')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'design' ? '#007acc' : '#a0a0a0',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === 'design' ? 'bold' : 'normal',
                padding: '5px 0',
                borderBottom: activeTab === 'design' ? '2px solid #007acc' : '2px solid transparent'
              }}
            >
              🧠 DESIGN RATIONALE
            </button>
          </div>
          <button className="close-btn" onClick={onClose} style={{
            background: 'none', border: 'none', color: '#c5c5c5', cursor: 'pointer', fontSize: '20px'
          }}>
            &times;
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="modal-body" style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px'
        }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
