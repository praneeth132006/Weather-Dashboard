/**
 * @file Header.jsx
 * @description The main header component featuring a premium minimalist search interface
 * and unit toggling functionality in a dark glassmorphism style.
 */

import React, { useState, useEffect } from 'react';

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
  const [query, setQuery] = useState('');
  const [now, setNow] = useState(new Date());

  // Real-time clock for the top-right display
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <header className="wonderful-header animate-up">
      
      {/* Left: Branding & Status */}
      <div className="header-left">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17.5 19a3.5 3.5 0 1 1 0-7c0-3.5-3.5-3.5-3.5-3.5-1-4-5-4-5-4s-3.5 0-3.5 3.5c-2.5 0-2.5 3.5-2.5 3.5 0 3.5 3.5 3.5 3.5 3.5h11z"/></svg>
        <span className="brand-text">forecast. now</span>
      </div>

      {/* Center: Interactive Pill Navigation */}
      <div className="header-pill">
        <button onClick={toggleTheme} className="pill-btn" title="Switch Theme">
          {theme === 'light' ? '☾' : '☼'}
        </button>
        <div className="pill-divider" />
        <form onSubmit={handleSubmit} className="pill-search">
          <input 
            type="text" 
            placeholder="Search city..." 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
          />
        </form>
        <div className="pill-divider" />
        <button onClick={toggleUnit} className="pill-btn" title="Toggle Unit">
           {unit === 'metric' ? '°C' : '°F'}
        </button>
      </div>

      {/* Right: Date, Time & Social Profile */}
      <div className="header-right">
        <div className="time-stack">
          <span className="current-date">{now.toLocaleDateString([], { day: 'numeric', month: 'short' })}</span>
          <span className="current-time">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
        </div>
        <div className="user-profile">
          <img src="https://i.pravatar.cc/150?u=antigravity" alt="User" />
        </div>
      </div>

    </header>
  );
}
