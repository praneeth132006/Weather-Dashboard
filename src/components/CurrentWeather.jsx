import { CONFIG } from '../api/weatherApi';

export default function CurrentWeather({ data, unit }) {
  if (!data) return null;

  const formatDateTime = (timestamp, timezone) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
    });
  };

  const iconCode = data.weather[0].icon;
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';
  const visKm = (data.visibility / 1000).toFixed(1);

  return (
    <section className="current-weather animate-up animate-up-delay-1">
      <div className="current-left">
        <div className="location-info" style={{ marginBottom: '16px' }}>
          <h2 className="city-name">{data.name}, {data.sys.country}</h2>
          <p className="date-time">{formatDateTime(data.dt, data.timezone)}</p>
        </div>
        <div className="temp-display">
          <div className="weather-icon-large">
            <img src={`${CONFIG.ICON_URL}/${iconCode}@4x.png`} alt={data.weather[0].description} />
          </div>
          <div className="temp-info" style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span className="temp-value">{Math.round(data.main.temp)}</span>
            <span className="temp-unit">{tempUnit}</span>
          </div>
        </div>
        <div className="weather-desc">
          <p className="desc-text" style={{ color: 'var(--text-primary)' }}>{data.weather[0].description}</p>
          <p className="feels-like">Feels like {Math.round(data.main.feels_like)}°</p>
        </div>
      </div>
      
      <div className="current-right">
        <div className="detail-grid">
          <div className="detail-card">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="detail-value">{data.main.humidity}%</span>
              <span className="detail-label">Humidity</span>
            </div>
            <div className="detail-bar">
              <div className="detail-bar-fill" style={{ width: `${data.main.humidity}%` }}></div>
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-icon wind-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="detail-value">{data.wind.speed} {windUnit}</span>
              <span className="detail-label">Wind Speed</span>
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="detail-value">{data.main.pressure} hPa</span>
              <span className="detail-label">Pressure</span>
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="detail-value">{visKm} km</span>
              <span className="detail-label">Visibility</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
