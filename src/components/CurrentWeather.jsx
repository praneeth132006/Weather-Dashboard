/**
 * @file CurrentWeather.jsx
 * @description The hero section of the dashboard, presenting the most critical 
 * weather data (City, Temp, Condition) in a large, professional dark layout.
 */

import { CONFIG } from '../api/weatherApi';

/**
 * CurrentWeather Component
 * 
 * Displays the primary temperature and condition data in an Apple-style hero layout.
 * 
 * @param {Object} props
 * @param {Object} props.data - Current weather data from OpenWeatherMap API
 * @param {String} props.unit - Current temperature unit
 */
export default function CurrentWeather({ data, unit }) {
  if (!data) return null;

  const temp = Math.round(data.main.temp);
  const condition = data.weather[0].main;
  const description = data.weather[0].description;
  
  // Custom atmospheric mapping to match the 'Wonderful' aesthetic
  const getAtmosphericSubtitle = (cond) => {
    const c = cond.toLowerCase();
    if (c.includes('sunny') || c.includes('clear')) return 'mostly sunny';
    if (c.includes('cloud')) return 'partly cloudy skies';
    if (c.includes('rain')) return 'persistent rainfall';
    if (c.includes('storm')) return 'intense weather conditions';
    return c;
  };

  const getRealisticDescription = (cond) => {
    const c = cond.toLowerCase();
    if (c.includes('clear')) return 'Clear skies with occasional clouds. Light winds keep temperatures comfortable, warm afternoons, and cooler evenings.';
    if (c.includes('cloud')) return 'Varied cloud cover with intervals of sunshine. Expect mild humidity and gentle breezes throughout the day.';
    if (c.includes('storm')) return 'Heavy rain, strong winds, and occasional lightning expected. Sudden downpours may lead to localized flooding in some areas.';
    return 'Expect atmospheric variation through the day. Maintain awareness of local weather advisories.';
  };

  return (
    <section className="wonderful-current animate-left">
      
      {/* Primary Condition - Large & Impactful */}
      <h1 className="hero-condition-main">
        {condition === 'Clear' ? 'Mostly Sunny' : condition}
      </h1>

      {/* Atmospheric Subtitle */}
      <h2 style={{ fontSize: '1.8rem', fontWeight: 400, opacity: 0.8, marginBottom: '24px' }}>
        {getAtmosphericSubtitle(condition)}
      </h2>

      {/* Realistic Description Block */}
      <p style={{ maxWidth: '380px', fontSize: '1rem', opacity: 0.6, lineHeight: 1.6, marginBottom: '60px' }}>
        {getRealisticDescription(condition)}
      </p>

      {/* Oversized Temperature */}
      <div className="wonderful-temp" style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
        <span style={{ fontSize: '8.5rem', fontWeight: 200, letterSpacing: '-6px' }}>{temp}</span>
        <span style={{ fontSize: '4rem', fontWeight: 200, opacity: 0.5 }}>°</span>
      </div>

      {/* Location & Metadata Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '1.1rem', fontWeight: 500 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {data.name}
        </div>
        <div className="glass-pill" style={{ padding: '4px 12px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '99px' }}>
          UV Ind.: 2
        </div>
      </div>

    </section>
  );
}
