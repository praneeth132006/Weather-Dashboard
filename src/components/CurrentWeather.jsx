/**
 * @file CurrentWeather.jsx
 * @description The hero section of the dashboard, presenting the most critical 
 * weather data (City, Temp, Condition) in a large, professional dark layout.
 */

import React from 'react';

/**
 * CurrentWeather Component
 * 
 * Displays the primary temperature and condition data for the selected city.
 * 
 * @param {Object} props
 * @param {Object} props.data - Current weather data from OpenWeatherMap API
 * @param {String} props.unit - Current temperature unit
 */
export default function CurrentWeather({ data, unit }) {
  // Gracefully handle missing data
  if (!data) return null;

  /**
   * Round Temperature Data
   * Math.round is used here to ensure a clean, minimalist UI without decimal noise.
   */
  const temp = Math.round(data.main.temp);
  const high = Math.round(data.main.temp_max);
  const low = Math.round(data.main.temp_min);
  const condition = data.weather[0].main;
  const description = data.weather[0].description;

  return (
    <section 
      className="hero-weather animate-up delay-1"
      aria-label="Current Weather Summary"
    >
      {/* City Name Header - Premium Typography */}
      <h2 className="hero-city">
        {data.name}
      </h2>

      {/* Temperature Display - Large visual centerpiece */}
      <div className="hero-temp" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <span>{temp}</span>
        <span style={{ fontSize: '3rem', fontWeight: 300, marginTop: '16px', opacity: 0.6 }}>°</span>
      </div>

      {/* Condition & Description - Contextual weather status */}
      <div className="hero-condition">
        {condition} 
        <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '8px', textTransform: 'lowercase' }}>
          • {description}
        </span>
      </div>

      {/* Daily Highs & Lows - Secondary climate indicators */}
      <div className="hero-range">
        <span style={{ color: 'var(--accent-amber)' }}>H: {high}°</span>
        <span style={{ margin: '0 12px', opacity: 0.2 }}>|</span>
        <span style={{ color: 'var(--accent-cyan)' }}>L: {low}°</span>
      </div>
    </section>
  );
}
