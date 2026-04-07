import { useState, useEffect } from 'react';
import './App.css';
import { CONFIG, fetchWeatherByCity, fetchWeatherByCoords } from './api/weatherApi';

import Header from './components/Header';
import WelcomeState from './components/WelcomeState';
import ErrorState from './components/ErrorState';
import CurrentWeather from './components/CurrentWeather';
import GridDetails from './components/GridDetails';
import Forecast from './components/Forecast';

function App() {
  const [unit, setUnit] = useState(localStorage.getItem(CONFIG.STORAGE_KEY_UNIT) || 'metric');
  const [lastCity, setLastCity] = useState(localStorage.getItem(CONFIG.STORAGE_KEY_LAST_CITY) || '');
  
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lastCity) handleSearch(lastCity);
  }, []);

  useEffect(() => {
    if (weatherData) handleSearch(lastCity);
  }, [unit]);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const { currentData, forecastData } = await fetchWeatherByCity(city, unit);
      setWeatherData(currentData);
      setForecastData(forecastData);
      setLastCity(currentData.name);
      localStorage.setItem(CONFIG.STORAGE_KEY_LAST_CITY, currentData.name);
    } catch (err) {
      setError({
        title: err.status === 404 ? 'City Not Found' : 'Connection Error',
        message: err.status === 404 ? `Could not find "${city}". Please check the spelling.` : 'Unable to load weather. Check your connection.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getBgClass = () => {
    if (!weatherData) return 'var(--bg-clear-day)';
    const main = weatherData.weather[0].main.toLowerCase();
    if (main.includes('clear')) return 'var(--bg-clear-day)';
    if (main.includes('cloud')) return 'var(--bg-cloudy)';
    if (main.includes('rain') || main.includes('drizzle')) return 'var(--bg-rain)';
    if (main.includes('snow')) return 'var(--bg-snow)';
    if (main.includes('thunder')) return 'var(--bg-thunder)';
    return 'var(--bg-clear-day)';
  };

  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    localStorage.setItem(CONFIG.STORAGE_KEY_UNIT, newUnit);
  };

  return (
    <div style={{ background: getBgClass(), minHeight: '100vh', transition: 'background 1s ease' }}>
      <div className="app-container">
        <Header onSearch={handleSearch} unit={unit} toggleUnit={toggleUnit} loading={loading} />

        {loading && !weatherData ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="loading-dots" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Loading</span>
          </div>
        ) : error ? (
          <ErrorState title={error.title} message={error.message} onRetry={() => setError(null)} />
        ) : weatherData && forecastData ? (
          <>
            <CurrentWeather data={weatherData} />
            <Forecast data={forecastData} />
            <GridDetails data={weatherData} unit={unit} />
          </>
        ) : (
          <WelcomeState onQuickSearch={handleSearch} />
        )}

        <footer style={{ textAlign: 'center', padding: '40px 0', opacity: 0.6, fontSize: '0.8rem' }}>
          Apple Weather Inspired · Powered by OpenWeatherMap
        </footer>
      </div>
    </div>
  );
}

export default App;
