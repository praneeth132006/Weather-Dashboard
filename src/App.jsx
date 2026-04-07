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
  const [lastCity, setLastCity] = useState(localStorage.getItem(CONFIG.STORAGE_KEY_LAST_CITY) || '');
  
  /* --- Dynamic Weather Data State --- */
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* --- Interactive Metric Modal State --- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);

  /**
   * Initial Data Fetch Effect
   * Runs once on mount to restore the user's previous session city.
   */
  useEffect(() => {
    if (lastCity) {
      handleSearch(lastCity);
    }
  }, []);

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
      // API Logic (Abstracted into weatherApi.js for modularity)
      const { currentData, forecastData } = await fetchWeatherByCity(city, unit);
      
      // Update data state
      setWeatherData(currentData);
      setForecastData(forecastData);
      
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
    if (!weatherData) return '#020617';
    const main = weatherData.weather[0].main.toLowerCase();
    
    // Smooth transition between dark atmospheric gradients
    if (main.includes('clear')) return 'linear-gradient(180deg, #0a1628 0%, #020617 100%)';
    if (main.includes('cloud')) return 'linear-gradient(180deg, #1e293b 0%, #0a1628 100%)';
    if (main.includes('rain')) return 'linear-gradient(180deg, #0f172a 0%, #020617 100%)';
    return '#020617';
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
