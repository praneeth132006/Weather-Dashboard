/**
 * @file App.jsx
 * @description The main controller of the WeatherDash application. 
 * Orchestrates global state, API interactions, theme transitions, and modal management.
 * Designed with a premium obsidian glassmorphic aesthetic.
 */

import React, { useState, useEffect } from 'react';
import './App.css';

// API Utilities - Using Geocoding logic for high search success rates
import { CONFIG, fetchWeatherByCity } from './api/weatherApi';

// Component Library
import Header from './components/Header';
import WelcomeState from './components/WelcomeState';
import ErrorState from './components/ErrorState';
import CurrentWeather from './components/CurrentWeather';
import GridDetails from './components/GridDetails';
import Forecast from './components/Forecast';
import MetricModal from './components/MetricModal';

/**
 * Main Application Component
 */
function App() {
  /* --- Persistent State (LocalStorage) --- */
  const [unit, setUnit] = useState(localStorage.getItem(CONFIG.STORAGE_KEY_UNIT) || 'metric');
  const [theme, setTheme] = useState(localStorage.getItem('weatherdash_theme') || 'dark');
  const [lastCity, setLastCity] = useState(localStorage.getItem(CONFIG.STORAGE_KEY_LAST_CITY) || '');
  
  /* --- Dynamic Weather Data State --- */
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [pollutionData, setPollutionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* --- Interactive Metric Modal State --- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);

  /**
   * Initial Data Fetch & Theme Sync Effect
   * Runs once on mount to restore the user's previous session settings.
   */
  useEffect(() => {
    // Sync theme to body class for global CSS variables
    document.body.className = theme === 'light' ? 'light-mode' : '';
    
    if (lastCity) {
      handleSearch(lastCity);
    }
  }, []);

  /**
   * Theme Sync Effect
   * Updates body class whenever theme changes.
   */
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
  }, [theme]);

  /**
   * Unit Change Propagation Effect
   * Re-fetches the current city whenever the user toggles Celsius/Fahrenheit units.
   */
  useEffect(() => {
    if (weatherData && lastCity) {
      handleSearch(lastCity);
    }
  }, [unit]);

  /**
   * Primary Search Handler
   * 
   * Orchestrates the complex geocoding + weather fetch cycle.
   * Handles 404 (Not Found) and 401 (API Auth) codes gracefully.
   * 
   * @param {String} city - The name of the city to retrieve weather for.
   */
  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    try {
      // API Logic (Abstracted into weatherApi.js with pollution sync)
      const { currentData, forecastData, pollutionData } = await fetchWeatherByCity(city, unit);
      
      // Update data state
      setWeatherData(currentData);
      setForecastData(forecastData);
      setPollutionData(pollutionData);
      
      // Update persistence
      setLastCity(currentData.name);
      localStorage.setItem(CONFIG.STORAGE_KEY_LAST_CITY, currentData.name);
    } catch (err) {
      // Detailed error mapping for clear user feedback
      setError({
        title: err.status === 404 ? 'Location Not Found' : 'Connection Failure',
        message: err.status === 404 
          ? `We couldn't locate "${city}". Please check the spelling.` 
          : 'Check your internet connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Background Theme Controller
   * Computes the dynamic CSS variable for the application background
   * based on the primary weather condition code.
   * 
   * @returns {String} CSS variable or fallback color
   */
  const getAppStyle = () => {
    if (!weatherData || !weatherData.weather?.[0]) return theme === 'light' ? '#f0f9ff' : '#020617';
    
    const condition = weatherData.weather[0].main.toLowerCase();
    const id = weatherData.weather[0].id;
    
    // Light Mode iOS Gradients (Airy & Bright)
    if (theme === 'light') {
      if (id >= 200 && id < 300) return 'linear-gradient(180deg, #94a3b8 0%, #cbd5e1 100%)'; 
      if (id >= 300 && id < 600) return 'linear-gradient(180deg, #7dd3fc 0%, #e0f2fe 100%)'; 
      if (id >= 600 && id < 700) return 'linear-gradient(180deg, #f1f5f9 0%, #ffffff 100%)'; 
      if (id >= 700 && id < 800) return 'linear-gradient(180deg, #cbd5e1 0%, #f1f5f9 100%)'; 
      if (id === 800) return 'linear-gradient(180deg, #38bdf8 0%, #bae6fd 100%)'; 
      return 'linear-gradient(180deg, #94a3b8 0%, #f1f5f9 100%)';
    }

    // Dark Mode iOS Gradients (Deep Atmospheric)
    if (id >= 200 && id < 300) return 'linear-gradient(180deg, #1e1b4b 0%, #020617 100%)'; 
    if (id >= 300 && id < 600) return 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'; 
    if (id >= 600 && id < 700) return 'linear-gradient(180deg, #475569 0%, #020617 100%)'; 
    if (id >= 700 && id < 800) return 'linear-gradient(180deg, #27272a 0%, #020617 100%)'; 
    if (id === 800) return 'linear-gradient(180deg, #0a1628 0%, #020617 100%)'; 
    return 'linear-gradient(180deg, #111827 0%, #020617 100%)';
  };

  /**
   * Unit Toggle Logic
   * Swaps between Metric (°C) and Imperial (°F) systems.
   */
  const toggleUnit = () => {
    const nextUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(nextUnit);
    localStorage.setItem(CONFIG.STORAGE_KEY_UNIT, nextUnit);
  };

  /**
   * Metric Detail Interaction
   * Triggered when a user clicks a grid tile to see more depth.
   */
  const handleOpenDetail = (metricData) => {
    setSelectedMetric(metricData);
    setIsModalOpen(true);
  };

  /**
   * Theme Toggle Logic
   * Swaps between Light and Dark modes.
   */
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('weatherdash_theme', nextTheme);
  };

  const handleCloseDetail = () => {
    setIsModalOpen(false);
  };

  return (
    <div 
      style={{ 
        background: getAppStyle(), 
        minHeight: '100vh', 
        transition: 'background 2s cubic-bezier(0.16, 1, 0.3, 1)' 
      }}
    >
      <div className="app-container">
        {/* Main Navigation & Utility Header */}
        <Header 
          onSearch={handleSearch} 
          unit={unit} 
          toggleUnit={toggleUnit} 
          theme={theme}
          toggleTheme={toggleTheme}
          loading={loading} 
        />

        {/* Global Modal Overlay - Only visible when a metric is selected */}
        <MetricModal 
          isOpen={isModalOpen} 
          onClose={handleCloseDetail} 
          metric={selectedMetric} 
        />

        {/* Conditional Component Rendering */}
        {loading && !weatherData ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="animate-fade" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Gathering Meteorological Data...
            </div>
          </div>
        ) : error ? (
          <ErrorState 
            title={error.title} 
            message={error.message} 
            onRetry={() => setError(null)} 
          />
        ) : weatherData && forecastData ? (
          <main>
            {/* Primary Hero Visualization */}
            <CurrentWeather data={weatherData} unit={unit} />
            
            {/* Multi-Day Detailed Forecasting */}
            <Forecast data={forecastData} />
            
            {/* Interactive Metrics Grid */}
            <GridDetails 
              data={weatherData} 
              pollution={pollutionData}
              unit={unit} 
              onTileClick={handleOpenDetail} 
            />
          </main>
        ) : (
          /* Initial Empty Onboarding State */
          <WelcomeState onQuickSearch={handleSearch} />
        )}

        {/* Minimalist Branded Footer */}
        <footer style={{ textAlign: 'center', padding: '60px 0 20px', opacity: 0.4, fontSize: '0.85rem', fontWeight: 500 }}>
          <p>© 2026 WeatherDash Obsidian Edition</p>
          <p style={{ marginTop: '8px' }}>Powered by OpenWeatherMap Official API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
