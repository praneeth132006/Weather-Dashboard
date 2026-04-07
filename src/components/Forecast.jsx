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
    icon: val.icons[Math.floor(val.icons.length / 2)], // Use mid-day icon
    condition: val.descs[Math.floor(val.descs.length / 2)]
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* 24-Hour Outlook Section */}
      <section
        className="glass-tile forecast-tile animate-up delay-3"
        aria-label="Hourly Weather Forecast"
      >
        <div className="tile-header">
          <svg className="tile-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
          24-Hour Outlook
        </div>

        <div className="forecast-scroll" style={{ marginTop: '16px' }}>
          {hourly.map((h, i) => (
            <div key={i} className="forecast-item" title={h.condition}
              style={{ animation: `fadeIn 0.5s ease forwards ${i * 0.05}s` }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{h.time}</span>
              <img
                src={`${CONFIG.ICON_URL}/${h.icon}.png`}
                alt={h.condition}
                style={{ width: '40px', height: '40px', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.15))' }}
              />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{h.temp}°</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5-Day Precision Forecast Section */}
      <section
        className="glass-tile forecast-tile animate-up delay-4"
        aria-label="Daily 5-Day Forecast"
      >
        <div className="tile-header">
          <svg className="tile-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /></svg>
          5-Day Forecast
        </div>

        <div style={{ marginTop: '12px' }}>
          {daily.map((d, i) => (
            <div key={i} className="forecast-row" style={{ animation: `slideUp 0.6s ease forwards ${i * 0.1}s` }}>
              {/* Day Name */}
              <span style={{ minWidth: '60px', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                {d.day}
              </span>

              {/* Central Condition Layout */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '20px' }}>
                <img
                  className="forecast-icon"
                  src={`${CONFIG.ICON_URL}/${d.icon}.png`}
                  alt={d.condition}
                  style={{ width: '36px', height: '36px' }}
                />
                <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {d.condition}
                </span>
              </div>

              {/* Temperature Visualizer Grid */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '120px', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{d.low}°</span>
                <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute',
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-indigo), var(--accent-amber))',
                    borderRadius: '10px',
                    width: '70%',
                    left: '15%',
                    boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)'
                  }}></div>
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{d.high}°</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
