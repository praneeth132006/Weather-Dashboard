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
  // Gracefully handle missing data
  if (!data) return null;

  const temp = Math.round(data.main.temp);
  const high = Math.round(data.main.temp_max);
  const low = Math.round(data.main.temp_min);
  const condition = data.weather[0].main;
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;

  return (
    <section 
      className="hero-weather animate-up delay-1"
      aria-label="Current Weather Summary"
      style={{ padding: '40px 0 20px' }}
    >
      {/* City Name Header - Apple Standard Weight */}
      <h2 className="hero-city" style={{ marginBottom: '8px' }}>
        {data.name}
      </h2>

      {/* Primary Weather Icon - Premium drop shadow */}
      <img 
        src={`${CONFIG.ICON_URL}/${icon}@4x.png`} 
        alt={description}
        style={{ width: '100px', height: '100px', margin: '-10px 0', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))' }}
      />

      {/* Temperature Display - Ultra-thin iOS weight */}
      <div className="hero-temp" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <span style={{ fontSize: '8rem', lineHeight: 1 }}>{temp}</span>
        <span style={{ fontSize: '4rem', fontWeight: 200, position: 'absolute', top: '10px', right: '-30px', opacity: 0.5 }}>°</span>
      </div>

      {/* Condition & Description - iOS Style Stack */}
      <div className="hero-condition" style={{ marginTop: '12px', fontSize: '1.4rem', fontWeight: 600 }}>
        {condition}
      </div>

      {/* Daily Highs & Lows - Minimalist Footer */}
      <div className="hero-range" style={{ marginTop: '4px', fontSize: '1.2rem' }}>
        <span>H:{high}°</span>
        <span style={{ marginLeft: '12px' }}>L:{low}°</span>
      </div>
    </section>
  );
}
