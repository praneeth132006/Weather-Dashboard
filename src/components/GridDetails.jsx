/**
 * @file GridDetails.jsx
 * @description A modular grid component that displays various environmental metrics
 * in a premium tile format. Each tile is interactive and opens a detailed modal.
 */

import React from 'react';

/**
 * GridDetails Component
 * 
 * @param {Object} props
 * @param {Object} props.data - Current weather data object
 * @param {String} props.unit - Current temperature unit
 * @param {Function} props.onTileClick - Callback to trigger the detail modal
 */
export default function GridDetails({ data, unit, onTileClick }) {
  if (!data) return null;

  // Measurement unit suffix handling based on global app state
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';
  const speedScale = unit === 'metric' ? 'km/h' : 'mph';

  /**
   * Internal Detailed Content Definitions
   * These provide the rich text used in the detail modals for each metric.
   */
  const metrics = [
    {
      id: 'humidity',
      title: 'Humidity',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
      value: `${data.main.humidity}%`,
      footer: `Dew point: ${Math.round(data.main.temp - (100 - data.main.humidity)/5)}°`,
      description: "Humidity measures the amount of water vapor in the air. High humidity can make the temperature feel warmer than it actually is, while low humidity can lead to dry skin and respiratory irritation.",
      insight: "A comfortable humidity range is typically between 30% and 50%."
    },
    {
      id: 'wind',
      title: 'Wind Speed',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2"/></svg>,
      value: `${Math.round(data.wind.speed)} ${windUnit}`,
      footer: `Gusts up to ${Math.round(data.wind.gust || data.wind.speed * 1.3)} ${windUnit}`,
      description: "Wind is the movement of air caused by differences in atmospheric pressure. Wind speed and direction are critical for maritime, aviation, and general safety activities.",
      insight: "Wind is currently blowing from the " + (data.wind.deg > 337.5 || data.wind.deg < 22.5 ? 'North' : data.wind.deg < 112.5 ? 'East' : data.wind.deg < 202.5 ? 'South' : 'West') + "."
    },
    {
      id: 'visibility',
      title: 'Visibility',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
      value: `${(data.visibility / 1000).toFixed(1)} km`,
      footer: data.visibility > 5000 ? "Clear visibility" : "Hazy conditions",
      description: "Visibility measures the distance at which an object can be clearly discerned. It is affected by dust, moisture, and pollutants in the air.",
      insight: "Visibility over 10km is considered excellent."
    },
    {
      id: 'pressure',
      title: 'Pressure',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
      value: `${data.main.pressure} hPa`,
      footer: data.main.pressure > 1013 ? "High pressure" : "Low pressure system",
      description: "Atmospheric pressure is the force exerted by the weight of air in the Earth's atmosphere. Rapid changes in pressure often signal approaching weather fronts.",
      insight: "Average sea-level pressure is 1013.25 hPa."
    },
    {
      id: 'feels_like',
      title: 'Feels Like',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8m-4-4h8"/></svg>,
      value: `${Math.round(data.main.feels_like)}°`,
      footer: "Based on wind & humidity",
      description: "The 'Feels Like' temperature accounts for wind chill or the heat index. Wind makes us feel colder, while high humidity prevents heat from escaping, making us feel warmer.",
      insight: "Currently feels " + (Math.round(data.main.feels_like) > data.main.temp ? "warmer" : "cooler") + " than actual."
    },
    {
      id: 'sunrise',
      title: 'Sunrise',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 18a5 5 0 0 0-10 0M12 2v1M4.22 4.22l.707.707M1 12h1M4.22 19.78l.707-.707M12 21v1M19.074 19.074l.707.707M22 12h1M19.074 4.926l.707-.707"/></svg>,
      value: new Date((data.sys.sunrise + data.timezone) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }),
      footer: `Sunset: ${new Date((data.sys.sunset + data.timezone) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}`,
      description: "Sunrise is the moment when the upper rim of the Sun appears on the horizon in the morning. Determining solar events is key for navigation and agriculture.",
      insight: "Daylight is currently fading or arriving."
    }
  ];

  return (
    <section 
      className="weather-grid animate-up delay-2"
      aria-label="Detailed Environmental Metrics"
    >
      {metrics.map((m, idx) => (
        <button 
          key={m.id} 
          className="glass-tile detail-tile"
          onClick={() => onTileClick(m)}
          title={`Click for more info on ${m.title}`}
        >
          {/* Tile Content Header - Icon + Label */}
          <div className="tile-header">
            <span className="tile-icon">{m.icon}</span>
            {m.title}
          </div>

          {/* Core Measurement Value */}
          <div className="tile-value">
            {m.value}
          </div>

          {/* Contextual Footer Information */}
          <div className="tile-footer">
            {m.footer}
          </div>

          {/* Interactive Indicator (Subtle arrow) */}
          <div style={{ position: 'absolute', top: '24px', right: '24px', opacity: 0.1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </button>
      ))}
    </section>
  );
}
