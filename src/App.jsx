import { useState, useEffect } from 'react';
import './App.css';
import { CONFIG, fetchWeatherByCity, fetchWeatherByCoords } from './api/weatherApi';

import Header from './components/Header';
import ApiBanner from './components/ApiBanner';
import WelcomeState from './components/WelcomeState';
import ErrorState from './components/ErrorState';
import CurrentWeather from './components/CurrentWeather';
import SunWindSection from './components/SunWindSection';
import Forecast from './components/Forecast';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem(CONFIG.STORAGE_KEY_API) || '');
  const [unit, setUnit] = useState(localStorage.getItem(CONFIG.STORAGE_KEY_UNIT) || 'metric');
  const [lastCity, setLastCity] = useState(localStorage.getItem(CONFIG.STORAGE_KEY_LAST_CITY) || '');
  
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showApiBanner, setShowApiBanner] = useState(!apiKey);

  useEffect(() => {
    if (apiKey && lastCity && !weatherData && !error) {
      handleSearch(lastCity);
    }
  }, [apiKey]);

  useEffect(() => {
    if (weatherData) {
      handleSearch(lastCity); // Refetch if unit changes
    }
  }, [unit]);

  const handleSearch = async (city) => {
    if (!apiKey) {
      setShowApiBanner(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { currentData, forecastData } = await fetchWeatherByCity(city, apiKey, unit);
      setWeatherData(currentData);
      setForecastData(forecastData);
      setLastCity(currentData.name);
      localStorage.setItem(CONFIG.STORAGE_KEY_LAST_CITY, currentData.name);
    } catch (err) {
      setError({
        title: err.status === 401 ? 'Invalid API Key' : err.status === 404 ? 'City Not Found' : 'Connection Error',
        message: err.status === 401 ? 'Your API key is invalid. Please check and update it.' :
                 err.status === 404 ? `Could not find "${city}". Please check the spelling and try again.` :
                 'Unable to fetch weather data. Please check your internet connection and try again.'
      });
      if (err.status === 401) setShowApiBanner(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGeolocate = () => {
    if (!apiKey) {
      setShowApiBanner(true);
      return;
    }
    if (!navigator.geolocation) {
      setError({ title: 'Geolocation Not Available', message: 'Your browser does not support geolocation.' });
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const { currentData, forecastData } = await fetchWeatherByCoords(latitude, longitude, apiKey, unit);
          setWeatherData(currentData);
          setForecastData(forecastData);
          setLastCity(currentData.name);
          localStorage.setItem(CONFIG.STORAGE_KEY_LAST_CITY, currentData.name);
        } catch (err) {
          setError({ title: 'Connection Error', message: 'Unable to fetch weather data. Please try again.' });
        } finally {
          setLoading(false);
        }
      },
      (geoErr) => {
        let msg = 'Unable to retrieve your location.';
        if (geoErr.code === 1) msg = 'Location access denied. Please enable it in your browser settings.';
        else if (geoErr.code === 2) msg = 'Location unavailable. Please try again.';
        else if (geoErr.code === 3) msg = 'Location request timed out. Please try again.';
        setError({ title: 'Location Error', message: msg });
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    localStorage.setItem(CONFIG.STORAGE_KEY_UNIT, newUnit);
  };

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem(CONFIG.STORAGE_KEY_API, key);
    setShowApiBanner(false);
    if (lastCity) handleSearch(lastCity);
  };

  // Determine Background Gradient based on weather
  const getBgClass = () => {
    if (!weatherData) return '';
    const main = weatherData.weather[0].main.toLowerCase();
    if (main.includes('clear') || main.includes('sun')) return 'weather-clear';
    if (main.includes('cloud') || main.includes('mist') || main.includes('fog')) return 'weather-clouds';
    if (main.includes('rain') || main.includes('drizzle')) return 'weather-rain';
    if (main.includes('snow')) return 'weather-snow';
    if (main.includes('thunder')) return 'weather-thunder';
    return '';
  };
  const isRainy = getBgClass() === 'weather-rain';

  return (
    <>
      <div className="bg-animation">
        <div className={`bg-gradient ${getBgClass()}`}></div>
        <div className="bg-particles">
          {/* Static particles generated via CSS usually, but we inject a few drops for rain */}
          {isRainy && Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="rain-drop" style={{
              left: Math.random() * 100 + '%',
              height: (Math.random() * 20 + 10) + 'px',
              animationDuration: (Math.random() * 0.5 + 0.3) + 's',
              animationDelay: (Math.random() * 2) + 's'
            }}></div>
          ))}
          {!isRainy && Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="particle" style={{
              width: (Math.random() * 120 + 40) + 'px',
              height: (Math.random() * 120 + 40) + 'px',
              left: Math.random() * 100 + '%',
              animationDuration: (Math.random() * 30 + 20) + 's',
              animationDelay: (Math.random() * 20) + 's'
            }}></div>
          ))}
        </div>
      </div>

      <div className="app-container">
        <Header 
          onSearch={handleSearch} 
          onGeolocate={handleGeolocate} 
          unit={unit} 
          toggleUnit={toggleUnit} 
        />

        {showApiBanner && (
          <ApiBanner 
            currentKey={apiKey} 
            onSaveKey={saveApiKey} 
            onClose={() => setShowApiBanner(false)} 
          />
        )}

        {loading ? (
          <div className="loading-overlay">
            <div className="spinner-ring"></div>
            <p>Fetching weather data...</p>
          </div>
        ) : error ? (
          <ErrorState title={error.title} message={error.message} onRetry={() => setError(null)} />
        ) : weatherData && forecastData ? (
          <main className="main-content">
            <CurrentWeather data={weatherData} unit={unit} />
            <SunWindSection data={weatherData} unit={unit} />
            <Forecast data={forecastData} />
          </main>
        ) : (
          <WelcomeState onQuickSearch={handleSearch} />
        )}

        <footer className="app-footer">
          <p>Powered by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a> · Built with React ❤️</p>
        </footer>
      </div>
    </>
  );
}

export default App;
