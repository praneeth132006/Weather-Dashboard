/**
 * @file WelcomeState.jsx
 * @description The initial landing state of the application when no city 
 * has been searched. Features quick-access popular cities.
 */

import React from 'react';

/**
 * WelcomeState Component
 * 
 * @param {Object} props
 * @param {Function} props.onQuickSearch - Callback to handle searches for suggested cities
 */
export default function WelcomeState({ onQuickSearch }) {
  // Curated list of major cities for an easy onboarding experience
  const popularCities = ['London', 'New York', 'Tokyo', 'Mumbai', 'Paris'];

  /**
   * Handle Quick Search
   * Triggers the search with the selected city from the recommendations list.
   */
  const handleCitySelect = (city) => {
    onQuickSearch(city);
  };

  return (
    <div className="welcome-state animate-fade" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', maxWidth: '420px', padding: '40px' }}>
        {/* Animated Brand Heartbeat - Visual interest for the landing screen */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 0 40px rgba(59, 130, 246, 0.1)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 19a3.5 3.5 0 1 1 0-7c0-3.5-3.5-3.5-3.5-3.5-1-4-5-4-5-4s-3.5 0-3.5 3.5c-2.5 0-2.5 3.5-2.5 3.5 0 3.5 3.5 3.5 3.5 3.5h11z"/>
            </svg>
          </div>
        </div>

        {/* Hero Welcome Message - Premium Typography */}
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>
          WeatherDash
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '48px', lineHeight: 1.6, fontSize: '1.1rem', fontWeight: 500 }}>
          Professional weather insights, reimagined in a minimalist obsidian aesthetic.
        </p>
        
        {/* Quick Suggestion Grid - Interactive Discovery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px' }}>
            Explore Popular Destinations
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {popularCities.map(city => (
              <button 
                key={city} 
                className="search-bar" 
                onClick={() => handleCitySelect(city)}
                style={{ height: '40px', padding: '0 20px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
