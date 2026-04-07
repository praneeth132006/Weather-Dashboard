export default function WelcomeState({ onQuickSearch }) {
  const popularCities = ['London', 'New York', 'Tokyo', 'Mumbai', 'Paris'];

  return (
    <div className="welcome-state animate-up">
      <div style={{ textAlign: 'center' }}>
        <h2 className="welcome-title">WeatherDash</h2>
        <p className="welcome-text">Start by searching for a city below.</p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          {popularCities.map(city => (
            <button 
              key={city} 
              className="unit-toggle-btn" 
              onClick={() => onQuickSearch(city)}
              style={{ background: 'rgba(255, 255, 255, 0.08)' }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
