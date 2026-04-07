import React from 'react';
import { CONFIG } from '../api/weatherApi';

/**
 * WeatherHero Component
 * 
 * The visual anchor of the dashboard. Displays a large, atmospheric, 
 * and glowing weather icon that represents the current condition.
 */
export default function WeatherHero({ data }) {
  if (!data) return null;

  const icon = data.weather[0].icon;
  const main = data.weather[0].main.toLowerCase();

  // Determine glow color based on weather
  const getGlowColor = () => {
    if (main.includes('clear')) return 'rgba(255, 165, 0, 0.4)';
    if (main.includes('cloud')) return 'rgba(255, 255, 255, 0.2)';
    if (main.includes('rain')) return 'rgba(59, 130, 246, 0.4)';
    if (main.includes('storm')) return 'rgba(139, 92, 246, 0.4)';
    return 'rgba(255, 255, 255, 0.2)';
  };

  return (
    <div className="weather-hero-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Dynamic Atmospheric Glow Layer */}
      <div 
        className="hero-glow-layer"
        style={{ 
          position: 'absolute',
          width: '400px',
          height: '400px',
          backgroundColor: getGlowColor(),
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: -1,
          animation: 'glow-pulse 8s infinite alternate ease-in-out'
        }}
      />

      {/* High-Resolution Weather Asset */}
      <img 
        src={`${CONFIG.ICON_URL}/${icon}@4x.png`} 
        alt={data.weather[0].description}
        style={{ 
          width: '320px', 
          height: '320px', 
          zIndex: 1,
          filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.3)) brightness(1.1)',
          animation: 'float 6s infinite ease-in-out'
        }}
      />
    </div>
  );
}
