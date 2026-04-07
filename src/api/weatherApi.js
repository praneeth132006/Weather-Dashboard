export const CONFIG = {
  OWM_BASE: 'https://api.openweathermap.org/data/2.5',
  ICON_URL: 'https://openweathermap.org/img/wn',
  STORAGE_KEY_API: 'weatherdash_api_key',
  STORAGE_KEY_UNIT: 'weatherdash_unit',
  STORAGE_KEY_LAST_CITY: 'weatherdash_last_city',
};

export const fetchWeatherByCity = async (city, apiKey, unit) => {
  const [currentRes, forecastRes] = await Promise.all([
    fetch(`${CONFIG.OWM_BASE}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${unit}`),
    fetch(`${CONFIG.OWM_BASE}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${unit}`)
  ]);

  if (!currentRes.ok) {
    const errData = await currentRes.json();
    throw { status: currentRes.status, message: errData.message };
  }

  const currentData = await currentRes.json();
  const forecastData = await forecastRes.json();
  return { currentData, forecastData };
};

export const fetchWeatherByCoords = async (lat, lon, apiKey, unit) => {
  const [currentRes, forecastRes] = await Promise.all([
    fetch(`${CONFIG.OWM_BASE}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`),
    fetch(`${CONFIG.OWM_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`)
  ]);

  if (!currentRes.ok) {
    const errData = await currentRes.json();
    throw { status: currentRes.status, message: errData.message };
  }

  const currentData = await currentRes.json();
  const forecastData = await forecastRes.json();
  return { currentData, forecastData };
};
