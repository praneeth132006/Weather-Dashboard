/**
 * @file Forecast.jsx
 * @description A multi-layered component that presents both 24-hour and 
 * 5-day predictive weather data in a streamlined, dark minimalist format.
 */

import React from 'react';
import { CONFIG } from '../api/weatherApi';

/**
 * Forecast Component (Bottom Shelf)
 * 
 * Implements the horizontal 7-day forecast where items follow 
 * a smooth visual wave, matching the 'Wonderful' UI style.
 */
export default function Forecast({ data }) {
  if (!data) return null;

  // Process Daily Forecast (Next 7 periods from 5-day data)
  // Note: OWM 5-day/3-hour provides 40 data points. We pick the best 'Daily' slice.
  const dailyMap = {};
  data.list.forEach(item => {
    const day = new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'long' });
    if (!dailyMap[day]) {
      dailyMap[day] = { temps: [], icons: [] };
    }
    dailyMap[day].temps.push(item.main.temp);
    dailyMap[day].icons.push(item.weather[0].icon);
  });

  const daily = Object.entries(dailyMap).slice(0, 7).map(([day, val]) => ({
    day,
    temp: Math.round(Math.max(...val.temps)),
    icon: val.icons[Math.floor(val.icons.length/2)],
  }));

  // Wavy Path SVG for the bottom curve visual
  const wavePath = "M 0 40 Q 50 10, 100 40 T 200 40 T 300 40 T 400 40 T 500 40 T 600 40 T 700 40 T 800 40 T 900 40 T 1000 40";

  return (
    <section className="wavy-forecast-shelf animate-up delay-4">
      
      {/* Background SVG Curve */}
      <svg 
        viewBox="0 0 1000 80" 
        style={{ position: 'absolute', bottom: '20px', width: '100%', height: '80px', pointerEvents: 'none', opacity: 0.2 }}
      >
        <path d={wavePath} stroke="white" strokeWidth="2" fill="none" strokeDasharray="5 5" />
      </svg>

      <div className="forecast-items-container" style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px', height: '100%' }}>
        {daily.map((d, i) => {
          // Calculate a simple sine wave vertical offset for the 'wavy' effect
          const offset = Math.sin((i / daily.length) * Math.PI * 4) * 20;

          return (
            <div 
              key={i} 
              className="forecast-item-wavy"
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: '8px',
                transform: `translateY(${offset}px)`,
                animation: `glow-pulse 6s infinite alternate ease-in-out ${i * 0.5}s`
              }}
            >
              <span style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.6 }}>{d.day}</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>{d.temp}°</span>
              <div 
                className="wavy-icon-container" 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <img 
                  src={`${CONFIG.ICON_URL}/${d.icon}.png`} 
                  alt={d.day} 
                  style={{ width: '40px', height: '40px', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}
                />
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
