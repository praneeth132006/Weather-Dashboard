export default function ErrorState({ title, message, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="error-icon">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>{title}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{message}</p>
        <button className="retry-btn" onClick={onRetry}>Try Again</button>
      </div>
    </div>
  );
}
