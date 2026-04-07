import { useState } from 'react';

export default function Header({ onSearch, unit, toggleUnit, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <header className="app-header animate-up">
      <form className="search-bar" onSubmit={handleSubmit}>
        <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.6 }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" x2="16.65" y1="21" y2="16.65" />
        </svg>
        <input
          className="search-input"
          placeholder={loading ? "Searching..." : "Search for a city"}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      
      <button className="unit-toggle-btn" onClick={toggleUnit}>
        <span style={{ opacity: unit === 'metric' ? 1 : 0.4 }}>°C</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span style={{ opacity: unit === 'imperial' ? 1 : 0.4 }}>°F</span>
      </button>
    </header>
  );
}
