export default function WelcomeState({ onQuickSearch }) {
  const popularCities = ['London', 'New York', 'Tokyo', 'Mumbai', 'Sydney', 'Paris'];

  return (
    <div className="welcome-state">
      <div className="welcome-content" style={{ maxWidth: '520px' }}>
        <div style={{ marginBottom: '24px' }}>
          <svg viewBox="0 0 120 120" fill="none" style={{ width: '100px', height: '100px', animation: 'float 4s ease-in-out infinite' }}>
            <circle cx="60" cy="50" r="20" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
            <line x1="60" y1="22" x2="60" y2="28" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="60" y1="72" x2="60" y2="78" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="50" x2="38" y2="50" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="82" y1="50" x2="88" y2="50" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="40.2" y1="30.2" x2="44.44" y2="34.44" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="75.56" y1="65.56" x2="79.8" y2="69.8" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="40.2" y1="69.8" x2="44.44" y2="65.56" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="75.56" y1="34.44" x2="79.8" y2="30.2" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M30 95 Q60 75 90 95" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <h2 className="welcome-title">Welcome to WeatherDash</h2>
        <p className="welcome-text">Search for a city or use your current location to see detailed weather information.</p>
        <div>
          <p className="quick-label">Popular Cities</p>
          <div className="quick-city-grid">
            {popularCities.map(city => (
              <button 
                key={city} 
                className="quick-city-btn" 
                onClick={() => onQuickSearch(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
