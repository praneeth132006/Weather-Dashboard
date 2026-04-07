import { useEffect, useState } from 'react';

export default function SunWindSection({ data, unit }) {
  if (!data) return null;

  const formatTimeUTC = (date) => {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const degToCompass = (deg) => {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return dirs[index];
  };

  const sunriseTime = new Date((data.sys.sunrise + data.timezone) * 1000);
  const sunsetTime = new Date((data.sys.sunset + data.timezone) * 1000);
  const now = data.dt;
  
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';
  const speedKmh = unit === 'metric' ? (data.wind.speed * 3.6).toFixed(1) : data.wind.speed.toFixed(1);

  // Calculate sun position
  const dayLength = data.sys.sunset - data.sys.sunrise;
  const elapsed = now - data.sys.sunrise;
  const progress = Math.max(0, Math.min(1, elapsed / dayLength));
  const dashOffset = 300 * (1 - progress);

  const t = progress;
  const x = (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 100 + t * t * 190;
  const y = (1 - t) * (1 - t) * 90 + 2 * (1 - t) * t * (-10) + t * t * 90;
  const isNight = now < data.sys.sunrise || now > data.sys.sunset;

  return (
    <section className="sun-wind-section animate-up animate-up-delay-2">
      <div className="sun-card glass-card">
        <h3 className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="section-icon">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
          </svg>
          Sunrise & Sunset
        </h3>
        <div className="sun-arc-container">
          <div className="sun-arc" style={{ marginBottom: '16px' }}>
            <svg viewBox="0 0 200 100" className="arc-svg">
              <defs>
                <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#f59e0b' }} />
                  <stop offset="50%" style={{ stopColor: '#fbbf24' }} />
                  <stop offset="100%" style={{ stopColor: '#f97316' }} />
                </linearGradient>
              </defs>
              <path d="M 10 90 Q 100 -10 190 90" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
              <path d="M 10 90 Q 100 -10 190 90" stroke="url(#arcGradient)" strokeWidth="3" fill="none" 
                    strokeDasharray="300" className="sun-arc-path" style={{ strokeDashoffset: dashOffset }} />
              <circle cx={x} cy={y} r="8" fill="#fbbf24" className="sun-dot" 
                      style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))', transition: 'all 1s ease', opacity: isNight ? 0.3 : 1 }} />
            </svg>
          </div>
          <div className="sun-times">
            <div className="sun-time">
              <span className="sun-label">Sunrise</span>
              <span className="sun-value">{formatTimeUTC(sunriseTime)}</span>
            </div>
            <div className="sun-time">
              <span className="sun-label">Sunset</span>
              <span className="sun-value">{formatTimeUTC(sunsetTime)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="wind-card glass-card">
        <h3 className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="section-icon">
            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
          </svg>
          Wind Details
        </h3>
        <div className="compass-container">
          <div className="compass">
            <div className="compass-rose">
              <span className="compass-dir n">N</span>
              <span className="compass-dir e">E</span>
              <span className="compass-dir s">S</span>
              <span className="compass-dir w">W</span>
            </div>
            <div className="compass-needle" style={{ transform: `rotate(${data.wind.deg || 0}deg)` }}></div>
            <div className="compass-center">
              <span className="compass-speed">{speedKmh}</span>
              <span className="compass-unit">{unit === 'metric' ? 'km/h' : 'mph'}</span>
            </div>
          </div>
        </div>
        <div className="wind-details-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="sun-label">Direction</span>
            <span className="sun-value" style={{ color: 'var(--text-primary)' }}>{degToCompass(data.wind.deg || 0)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="sun-label">Gust</span>
            <span className="sun-value" style={{ color: 'var(--text-primary)' }}>{data.wind.gust ? `${data.wind.gust} ${windUnit}` : 'N/A'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
