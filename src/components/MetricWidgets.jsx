import React from 'react';

/**
 * MetricWidgets Component (Right Column)
 * 
 * Displays high-fidelity widgets for Wind and Solar cycles, 
 * matching the 'Wonderful' reference design.
 */
export default function MetricWidgets({ data, forecast, onTileClick }) {
  if (!data) return null;

  const windSpeed = data.wind.speed;
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  // Simple path for the Wind Status graph simulation
  const windPath = "M 0 40 Q 25 10, 50 35 T 100 20 T 150 45 T 200 15";

  return (
    <div className="metric-widgets-stack" style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '320px', marginLeft: 'auto' }}>
      
      {/* Wind Status Widget with Graph */}
      <div 
        className="glass-tile-alt animate-right" 
        style={{ padding: '24px', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}
        onClick={() => onTileClick({ id: 'wind', title: 'Wind Status', value: `${windSpeed} km/h` })}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8, fontSize: '0.9rem', fontWeight: 600 }}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2"/></svg>
             Wind status
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{windSpeed} <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>km/h</span></div>
        </div>
        
        {/* Visual Wind Graph (SVG) */}
        <svg width="100%" height="60" viewBox="0 0 200 60" fill="none" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' }}>
          <path d={windPath} stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinecap="round" />
          <path d={windPath + " L 200 60 L 0 60 Z"} fill="url(#wind-grad)" opacity="0.1" />
          <defs>
            <linearGradient id="wind-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Sunrise & Sunset Widget with Curve */}
      <div 
        className="glass-tile-alt animate-right delay-1" 
        style={{ padding: '24px', borderRadius: '32px' }}
        onClick={() => onTileClick({ id: 'sun', title: 'Solar Cycle', value: `${sunrise} - ${sunset}` })}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', opacity: 0.8, fontSize: '0.9rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M6.34 17.66l-1.41 1.41M12 20v2M17.66 17.66l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41"/></svg>
            Sunrise
          </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Sunset
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </div>
        </div>

        {/* Solar Path Illustration */}
        <div style={{ position: 'relative', height: '80px', width: '100%', borderBottom: '1px dashed rgba(255,255,255,0.2)' }}>
          <svg width="100%" height="80" viewBox="0 0 200 80">
            <path d="M 10 80 A 90 90 0 0 1 190 80" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="100" cy="20" r="6" fill="white" style={{ filter: 'drop-shadow(0 0 8px white)' }} />
          </svg>
          <div style={{ position: 'absolute', bottom: '-20px', left: 0, fontSize: '0.8rem', fontWeight: 700 }}>{sunrise}</div>
          <div style={{ position: 'absolute', bottom: '-20px', right: 0, fontSize: '0.8rem', fontWeight: 700 }}>{sunset}</div>
        </div>
      </div>

    </div>
  );
}
