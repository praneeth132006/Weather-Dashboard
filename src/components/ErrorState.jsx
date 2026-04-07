export default function ErrorState({ title, message, onRetry }) {
  return (
    <div className="animate-up" style={{ textAlign: 'center', padding: '100px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg fill="none" height="48" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.5, marginBottom: '24px' }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </svg>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px' }}>{title}</h2>
      <p style={{ opacity: 0.6, marginBottom: '32px' }}>{message}</p>
      <button className="unit-toggle-btn" onClick={onRetry} style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
        Dismiss
      </button>
    </div>
  );
}
