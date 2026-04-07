/**
 * @file Header.jsx
 * @description The main header component featuring a premium minimalist search interface
 * and unit toggling functionality in a dark glassmorphism style.
 */

import React, { useState } from 'react';

/**
 * Header Component
 * 
 * @param {Object} props
 * @param {Function} props.onSearch - Callback to handle city searches
 * @param {String} props.unit - Current temperature unit ('metric' or 'imperial')
 * @param {Function} props.toggleUnit - Callback to switch temperature units
 * @param {Boolean} props.loading - Indicates if a search is in progress
 */
export default function Header({ onSearch, unit, toggleUnit, theme, toggleTheme, loading }) {
  // Local state for the search input query
  const [query, setQuery] = useState('');

  /**
   * Handle Search Submission
   * Triggers the search callback with the cleaned query string.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      // Optional: Clear or keep query based on UX preference
      setQuery('');
    }
  };

  /**
   * Handle Change Events
   * Updates state as the user types in the search field.
   */
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <header className="app-header animate-up">
      {/* Search Bar Implementation - Minimal Glass Design */}
      <form 
        className="search-bar" 
        onSubmit={handleSubmit}
        role="search"
      >
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          style={{ opacity: 0.6, color: 'var(--accent-blue)' }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="search-input"
          placeholder={loading ? "Finding city..." : "Enter a city..."}
          type="text"
          value={query}
          onChange={handleInputChange}
          aria-label="Search for a city"
        />
        {/* Visual feedback if search is in progress */}
        {loading && (
          <div style={{ marginLeft: '10px', height: '12px', width: '12px', background: 'var(--accent-blue)', borderRadius: '50%', animation: 'pulse-glow 1.5s infinite' }}></div>
        )}
      </form>
      
      {/* Utility Area - Unit & Theme Toggles */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        
        {/* Dark/Light Mode Toggle - iOS Standard Style */}
        <button 
          onClick={toggleTheme}
          className="search-bar"
          style={{ width: '44px', height: '44px', padding: 0, justifyContent: 'center' }}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-amber)' }}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-amber)' }}>
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>

        {/* Unit Toggle Button - Premium Switch Design */}
        <div 
          style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-lg)', padding: '4px', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <button 
            onClick={unit === 'imperial' ? toggleUnit : null}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '12px', 
              fontSize: '0.9rem', 
              fontWeight: 700,
              background: unit === 'metric' ? 'var(--accent-blue)' : 'transparent',
              color: unit === 'metric' ? '#fff' : 'var(--text-muted)',
              boxShadow: unit === 'metric' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
            }}
          >
            °C
          </button>
          <button 
            onClick={unit === 'metric' ? toggleUnit : null}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '12px', 
              fontSize: '0.9rem', 
              fontWeight: 700,
              background: unit === 'imperial' ? 'var(--accent-blue)' : 'transparent',
              color: unit === 'imperial' ? '#fff' : 'var(--text-muted)',
              boxShadow: unit === 'imperial' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
            }}
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
}
