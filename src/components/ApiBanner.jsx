import { useState } from 'react';

export default function ApiBanner({ currentKey, onSaveKey, onClose }) {
  const [inputKey, setInputKey] = useState(currentKey || '');

  const handleSave = () => {
    if (inputKey.trim()) {
      onSaveKey(inputKey.trim());
    }
  };

  return (
    <div className="api-banner animate-up">
      <div className="api-banner-content" style={{ display: 'flex', width: '100%', gap: '16px', alignItems: 'center' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="api-banner-icon" style={{ flexShrink: 0 }}>
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
        </svg>
        <div style={{ flex: 1 }}>
          <p className="api-banner-title" style={{ fontWeight: 600 }}>API Key Required</p>
          <p className="api-banner-text" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Enter your free OpenWeatherMap API key to get started.
          </p>
        </div>
        <div className="api-key-input-group">
          <input
            type="text"
            className="api-key-input"
            placeholder="Paste your API key here..."
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button className="api-key-save" onClick={handleSave}>Save Key</button>
        </div>
        <button onClick={onClose} aria-label="Close banner" style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginLeft: '10px' }}>✕</button>
      </div>
    </div>
  );
}
