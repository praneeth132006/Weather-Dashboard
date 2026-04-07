/**
 * @file Forecast.jsx
 * @description A multi-layered component that presents both 24-hour and 
 * 5-day predictive weather data in a streamlined, dark minimalist format.
 */

import React from 'react';
import { CONFIG } from '../api/weatherApi';

/**
 * Forecast Component
 * 
 * @param {Object} props
 * @param {Object} props.data - Forecast data object from API
 */
export default function Forecast({ data }) {
  // Gracefully handle missing data until async fetch completes
  if (!data) return null;

  /**
   * Process Hourly Forecast (Next 24 Hours)
   * Limit to the next 10 intervals (approx. 30 hours) for layout consistency.
   */
  const hourly = data.list.slice(0, 10).map((item, i) => ({
    time: i === 0 ? "Now" : new Date(item.dt * 1000).getUTCHours() + "h",
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon,
    condition: item.weather[0].main
  }));

  /**
   * Process Daily Forecast (Next 5 Days)
   * Groups the 3-hour data points by Day of the week and computes 
   * min/max bounds for the visual temperature range.
   */
  const dailyMap = {};
  data.list.forEach(item => {
    const day = new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short' });
    if (!dailyMap[day]) {
      dailyMap[day] = { temps: [], icons: [], descs: [] };
    }
    dailyMap[day].temps.push(item.main.temp);
    dailyMap[day].icons.push(item.weather[0].icon);
    dailyMap[day].descs.push(item.weather[0].main);
  });

  // Convert map to array and slice the first 5 days
  const daily = Object.entries(dailyMap).slice(0, 5).map(([day, val]) => ({
    day,
    high: Math.round(Math.max(...val.temps)),
    low: Math.round(Math.min(...val.temps)),
    icon: val.icons[Math.floor(val.icons.length/2)], // Use mid-day icon
    condition: val.descs[Math.floor(val.descs.length/2)]
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 24-Hour Scroll Section - Interactive Horizontal Layout */}
      <section 
        className="glass-tile forecast-tile animate-up delay-3"
        aria-label="Hourly Weather Forecast"
      >
        <div className="tile-header">
          <svg className="tile-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          24-Hour Outlook
        </div>
        
        <div className="forecast-scroll" style={{ marginTop: '16px' }}>
          {hourly.map((h, i) => (
            <div key={i} className="forecast-item" title={h.condition}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{h.time}</span>
              <img 
                src={`${CONFIG.ICON_URL}/${h.icon}.png`} 
                alt={h.condition} 
                style={{ width: '40px', height: '40px', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.1))' }}
              />
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{h.temp}°</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5-Day List Section - Minimal Vertical Layout */}
      <section 
        className="glass-tile forecast-tile animate-up delay-4"
        aria-label="Daily 5-Day Forecast"
      >
        <div className="tile-header">
          <svg className="tile-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>
          Next 5 Days
        </div>

        <div style={{ marginTop: '12px' }}>
          {daily.map((d, i) => (
            <div key={i} className="forecast-row">
              {/* Day Name */}
              <span style={{ minWidth: '60px', fontWeight: 600, fontSize: '1rem' }}>
                {d.day}
              </span>
              
              {/* Central Condition Layout */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '20px' }}>
                <img 
                  className="forecast-icon" 
                  src={`${CONFIG.ICON_URL}/${d.icon}.png`} 
                  alt={d.condition} 
                  style={{ width: '32px', height: '32px' }}
                />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {d.condition}
                </span>
              </div>

              {/* Temperature Bounds */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '90px', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.4, fontWeight: 500 }}>{d.low}°</span>
                <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', position: 'relative' }}>
                  <div style={{ position: 'absolute', height: '100%', background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-amber))', borderRadius: '2px', width: '60%', left: '20%' }}></div>
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 700 }}>{d.high}°</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
