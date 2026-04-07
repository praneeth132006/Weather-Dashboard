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
 * @param {Object} props.pollution - Air pollution data object
 * @param {String} props.unit - Current temperature unit
 * @param {Function} props.onTileClick - Callback to trigger the detail modal
 */
export default function GridDetails({ data, pollution, unit, onTileClick }) {
  if (!data) return null;

  // Measurement unit suffix handling based on global app state
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';
  
  // AQI Level Parser
  const aqiValue = pollution?.list?.[0]?.main?.aqi ?? 1;
  const aqiMap = {
    1: { label: 'Good', color: 'var(--accent-emerald)' },
    2: { label: 'Fair', color: 'var(--accent-amber)' },
    3: { label: 'Moderate', color: '#fb923c' },
    4: { label: 'Poor', color: 'var(--accent-rose)' },
    5: { label: 'Very Poor', color: '#7f1d1d' }
  };

  /**
   * Internal Detailed Content Definitions
   * These provide the rich text used in the detail modals for each metric.
   */
  const metrics = [
    {
      id: 'aqi',
      title: 'Air Quality',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 12a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v3"/><path d="M12 7V5"/><path d="M7 15a3 3 0 1 1-6 0"/><path d="M17 15a3 3 0 1 0 6 0"/></svg>,
      value: aqiMap[aqiValue].label,
      footer: `PM2.5: ${pollution?.list?.[0]?.components?.pm2_5 ?? 0} µg/m³`,
      description: "The Air Quality Index (AQI) indicates how clean or polluted your air is, and what associated health effects might be a concern.",
      insight: "Current level is " + aqiMap[aqiValue].label.toLowerCase() + ". Health risks are minimal for most individuals.",
      color: aqiMap[aqiValue].color
    },
    {
      id: 'uv',
      title: 'UV Index',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>,
      value: 'Low', // Placeholder as OWM 2.5 standard doesn't have it in /weather (requires One Call)
      footer: "Use protection 11am-4pm",
      description: "The UV Index provides a forecast of the expected intensity of UV radiation from the sun. A higher value means greater risk of skin damage.",
      insight: "Sunscreen is recommended for prolonged outdoor activity."
    },
    {
      id: 'clouds',
      title: 'Cloud Cover',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17.5 19a3.5 3.5 0 1 1 0-7c0-3.5-3.5-3.5-3.5-3.5-1-4-5-4-5-4s-3.5 0-3.5 3.5c-2.5 0-2.5 3.5-2.5 3.5 0 3.5 3.5 3.5 3.5 3.5h11z"/></svg>,
      value: `${data.clouds?.all ?? 0}%`,
      footer: data.clouds?.all > 50 ? "Overcast skies" : "Partly clear",
      description: "Cloud cover refers to the fraction of the sky obscured by clouds when observed from a particular location.",
      insight: "High cloud coverage reduces solar radiation reaching the surface."
    },
    {
      id: 'humidity',
      title: 'Humidity',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
      value: `${data.main.humidity}%`,
      footer: `Dew point: ${Math.round(data.main.temp - (100 - data.main.humidity)/5)}°`,
      description: "Humidity measures the amount of water vapor in the air. High humidity can make it feel warmer.",
      insight: "Comfortable range is between 30% and 50%."
    },
    {
      id: 'wind',
      title: 'Wind Speed',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2"/></svg>,
      value: `${Math.round(data.wind.speed)} ${windUnit}`,
      footer: `Gusts up to ${Math.round(data.wind.gust || data.wind.speed * 1.3)} ${windUnit}`,
      description: "Wind is the movement of air caused by differences in atmospheric pressure.",
      insight: "Wind is currently blowing from the " + (data.wind.deg > 337.5 || data.wind.deg < 22.5 ? 'North' : data.wind.deg < 112.5 ? 'East' : data.wind.deg < 202.5 ? 'South' : 'West') + "."
    },
    {
      id: 'visibility',
      title: 'Visibility',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
      value: `${(data.visibility / 1000).toFixed(1)} km`,
      footer: data.visibility > 5000 ? "Clear visibility" : "Hazy conditions",
      description: "Visibility measures the distance at which an object can be clearly discerned.",
      insight: "Visibility over 10km is considered excellent."
    },
    {
      id: 'pressure',
      title: 'Pressure',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
      value: `${data.main.pressure} hPa`,
      footer: data.main.pressure > 1013 ? "High pressure" : "Low pressure system",
      description: "Atmospheric pressure is the force exerted by the weight of air.",
      insight: "Average sea-level pressure is 1013.25 hPa."
    },
    {
      id: 'feels_like',
      title: 'Feels Like',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8m-4-4h8"/></svg>,
      value: `${Math.round(data.main.feels_like)}°`,
      footer: "Based on wind & humidity",
      description: "The 'Feels Like' temperature accounts for wind chill or the heat index.",
      insight: "Currently feels " + (Math.round(data.main.feels_like) > data.main.temp ? "warmer" : "cooler") + " than actual."
    },
    {
      id: 'sunrise',
      title: 'Sunrise',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 18a5 5 0 0 0-10 0M12 2v1M4.22 4.22l.707.707M1 12h1M4.22 19.78l.707-.707M12 21v1M19.074 19.074l.707.707M22 12h1M19.074 4.926l.707-.707"/></svg>,
      value: new Date((data.sys.sunrise + data.timezone) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }),
      footer: `Sunset: ${new Date((data.sys.sunset + data.timezone) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}`,
      description: "Solar events are key for navigation and agriculture.",
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
          style={{ borderTop: m.color ? `3px solid ${m.color}` : '1px solid var(--glass-border)' }}
        >
          {/* Tile Content Header - Icon + Label */}
          <div className="tile-header">
            <span className="tile-icon" style={{ color: m.color || 'var(--accent-blue)' }}>{m.icon}</span>
            {m.title}
          </div>

          <div className="tile-value" style={{ color: m.color || 'var(--text-primary)' }}>
            {m.value}
          </div>

          <div className="tile-footer">
            {m.footer}
          </div>

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
