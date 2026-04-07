export const CONFIG = {
  OWM_BASE: 'https://api.openweathermap.org/data/2.5',
  OWM_GEO: 'https://api.openweathermap.org/geo/1.0',
  ICON_URL: 'https://openweathermap.org/img/wn',
  API_KEY: '4397900e9180db0200c9fa64d89b3e66', // Hardcoded as requested
  STORAGE_KEY_UNIT: 'weatherdash_unit',
  STORAGE_KEY_LAST_CITY: 'weatherdash_last_city',
};

export const fetchWeatherByCity = async (city, unit) => {
  // First, get lat/lon from Geocoding API for better reliability
  const geoRes = await fetch(`${CONFIG.OWM_GEO}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${CONFIG.API_KEY}`);
  if (!geoRes.ok) throw { status: geoRes.status, message: 'Geocoding failed' };
  
  const geoData = await geoRes.json();
  if (geoData.length === 0) throw { status: 404, message: 'City not found' };
  
  const { lat, lon, name, country } = geoData[0];
  return fetchWeatherByCoords(lat, lon, unit, `${name}, ${country}`);
};

export const fetchWeatherByCoords = async (lat, lon, unit, displayName = null) => {
  const [currentRes, forecastRes, pollutionRes] = await Promise.all([
    fetch(`${CONFIG.OWM_BASE}/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${unit}`),
    fetch(`${CONFIG.OWM_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${unit}`),
    fetch(`${CONFIG.OWM_BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}`)
  ]);

  if (!currentRes.ok || !forecastRes.ok || !pollutionRes.ok) {
    const errData = await currentRes.json();
    throw { status: currentRes.status, message: errData.message || 'Meteorological sync failed' };
  }

  const currentData = await currentRes.json();
  const forecastData = await forecastRes.json();
  const pollutionData = await pollutionRes.json();

  if (displayName) {
    currentData.name = displayName;
  }

  return { currentData, forecastData, pollutionData };
};
