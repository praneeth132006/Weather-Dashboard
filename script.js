/* ============================================
   WeatherDash — Main Application Logic
   ============================================ */

// ==========================================
// Configuration & State
// ==========================================
const CONFIG = {
    OWM_BASE: 'https://api.openweathermap.org/data/2.5',
    OWM_GEO: 'https://api.openweathermap.org/geo/1.0',
    ICON_URL: 'https://openweathermap.org/img/wn',
    STORAGE_KEY_API: 'weatherdash_api_key',
    STORAGE_KEY_UNIT: 'weatherdash_unit',
    STORAGE_KEY_LAST_CITY: 'weatherdash_last_city',
};

let state = {
    apiKey: localStorage.getItem(CONFIG.STORAGE_KEY_API) || '',
    unit: localStorage.getItem(CONFIG.STORAGE_KEY_UNIT) || 'metric', // metric = °C, imperial = °F
    currentData: null,
    forecastData: null,
    lastCity: localStorage.getItem(CONFIG.STORAGE_KEY_LAST_CITY) || '',
};

// ==========================================
// DOM References
// ==========================================
const $ = (id) => document.getElementById(id);

const DOM = {
    // Loading
    loadingOverlay: $('loadingOverlay'),
    // Search
    searchInput: $('searchInput'),
    searchBtn: $('searchBtn'),
    locationBtn: $('locationBtn'),
    searchContainer: $('searchContainer'),
    // API Banner
    apiBanner: $('apiBanner'),
    apiKeyInput: $('apiKeyInput'),
    apiKeySave: $('apiKeySave'),
    apiBannerClose: $('apiBannerClose'),
    // Unit Toggle
    unitToggle: $('unitToggle'),
    unitC: $('unitC'),
    unitF: $('unitF'),
    // States
    welcomeState: $('welcomeState'),
    errorState: $('errorState'),
    mainContent: $('mainContent'),
    errorTitle: $('errorTitle'),
    errorMessage: $('errorMessage'),
    retryBtn: $('retryBtn'),
    // Current Weather
    cityName: $('cityName'),
    dateTime: $('dateTime'),
    weatherImg: $('weatherImg'),
    tempValue: $('tempValue'),
    tempUnit: $('tempUnit'),
    weatherDesc: $('weatherDesc'),
    feelsLike: $('feelsLike'),
    // Details
    humidity: $('humidity'),
    humidityBar: $('humidityBar'),
    windSpeed: $('windSpeed'),
    pressure: $('pressure'),
    visibility: $('visibility'),
    // Sun
    sunrise: $('sunrise'),
    sunset: $('sunset'),
    sunDot: $('sunDot'),
    sunArcPath: $('sunArcPath'),
    // Wind Compass
    compassNeedle: $('compassNeedle'),
    compassSpeed: $('compassSpeed'),
    windDirection: $('windDirection'),
    windGust: $('windGust'),
    // Forecast
    hourlyScroll: $('hourlyScroll'),
    forecastGrid: $('forecastGrid'),
    // Background
    bgGradient: document.querySelector('.bg-gradient'),
    particles: $('particles'),
};

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', init);

function init() {
    createParticles();
    setupEventListeners();
    setupUnitState();

    if (!state.apiKey) {
        showApiBanner();
    } else {
        hideApiBanner();
        if (state.lastCity) {
            fetchWeatherByCity(state.lastCity);
        }
    }
}

// ==========================================
// Particles
// ==========================================
function createParticles() {
    const count = 20;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 120 + 40;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 30 + 20) + 's';
        particle.style.animationDelay = (Math.random() * 20) + 's';
        DOM.particles.appendChild(particle);
    }
}

// ==========================================
// Event Listeners
// ==========================================
function setupEventListeners() {
    // Search
    DOM.searchBtn.addEventListener('click', handleSearch);
    DOM.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Location
    DOM.locationBtn.addEventListener('click', handleGeolocation);

    // API Key
    DOM.apiKeySave.addEventListener('click', saveApiKey);
    DOM.apiKeyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveApiKey();
    });
    DOM.apiBannerClose.addEventListener('click', () => {
        DOM.apiBanner.classList.add('hidden');
    });

    // Unit Toggle
    DOM.unitToggle.addEventListener('click', toggleUnit);

    // Retry
    DOM.retryBtn.addEventListener('click', () => {
        showWelcome();
        DOM.searchInput.focus();
    });

    // Quick city buttons
    document.querySelectorAll('.quick-city-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const city = btn.dataset.city;
            DOM.searchInput.value = city;
            handleSearch();
        });
    });
}

// ==========================================
// API Key Management
// ==========================================
function saveApiKey() {
    const key = DOM.apiKeyInput.value.trim();
    if (!key) {
        DOM.apiKeyInput.style.borderColor = 'var(--accent-rose)';
        DOM.apiKeyInput.setAttribute('placeholder', 'Please enter a valid API key');
        setTimeout(() => {
            DOM.apiKeyInput.style.borderColor = '';
            DOM.apiKeyInput.setAttribute('placeholder', 'Paste your API key here...');
        }, 2000);
        return;
    }
    state.apiKey = key;
    localStorage.setItem(CONFIG.STORAGE_KEY_API, key);
    hideApiBanner();

    // If there's a last city, auto-fetch
    if (state.lastCity) {
        fetchWeatherByCity(state.lastCity);
    }
}

function showApiBanner() {
    DOM.apiBanner.classList.remove('hidden');
    DOM.apiKeyInput.value = state.apiKey;
}

function hideApiBanner() {
    DOM.apiBanner.classList.add('hidden');
}

// ==========================================
// Unit Toggle
// ==========================================
function setupUnitState() {
    if (state.unit === 'imperial') {
        DOM.unitC.classList.remove('active');
        DOM.unitF.classList.add('active');
        DOM.tempUnit.textContent = '°F';
    }
}

function toggleUnit() {
    if (state.unit === 'metric') {
        state.unit = 'imperial';
        DOM.unitC.classList.remove('active');
        DOM.unitF.classList.add('active');
        DOM.tempUnit.textContent = '°F';
    } else {
        state.unit = 'metric';
        DOM.unitF.classList.remove('active');
        DOM.unitC.classList.add('active');
        DOM.tempUnit.textContent = '°C';
    }
    localStorage.setItem(CONFIG.STORAGE_KEY_UNIT, state.unit);

    // Refetch if we have city data
    if (state.lastCity) {
        fetchWeatherByCity(state.lastCity);
    }
}

// ==========================================
// Search Handler
// ==========================================
function handleSearch() {
    const city = DOM.searchInput.value.trim();
    if (!city) {
        DOM.searchContainer.style.borderColor = 'var(--accent-rose)';
        setTimeout(() => DOM.searchContainer.style.borderColor = '', 1500);
        return;
    }

    if (!state.apiKey) {
        showApiBanner();
        DOM.apiKeyInput.focus();
        return;
    }

    fetchWeatherByCity(city);
}

// ==========================================
// Geolocation Handler
// ==========================================
function handleGeolocation() {
    if (!state.apiKey) {
        showApiBanner();
        DOM.apiKeyInput.focus();
        return;
    }

    if (!navigator.geolocation) {
        showError('Geolocation Not Available', 'Your browser does not support geolocation.');
        return;
    }

    showLoading(true);

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
            showLoading(false);
            let msg = 'Unable to retrieve your location.';
            if (error.code === 1) msg = 'Location access denied. Please enable it in your browser settings.';
            else if (error.code === 2) msg = 'Location unavailable. Please try again.';
            else if (error.code === 3) msg = 'Location request timed out. Please try again.';
            showError('Location Error', msg);
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

// ==========================================
// API Calls
// ==========================================
async function fetchWeatherByCity(city) {
    showLoading(true);
    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${CONFIG.OWM_BASE}/weather?q=${encodeURIComponent(city)}&appid=${state.apiKey}&units=${state.unit}`),
            fetch(`${CONFIG.OWM_BASE}/forecast?q=${encodeURIComponent(city)}&appid=${state.apiKey}&units=${state.unit}`)
        ]);

        if (!currentRes.ok) {
            const errData = await currentRes.json();
            if (currentRes.status === 401) {
                showError('Invalid API Key', 'Your API key is invalid. Please check and update it.');
                showApiBanner();
                showLoading(false);
                return;
            }
            if (currentRes.status === 404) {
                showError('City Not Found', `Could not find "${city}". Please check the spelling and try again.`);
                showLoading(false);
                return;
            }
            throw new Error(errData.message || 'Unknown error');
        }

        state.currentData = await currentRes.json();
        state.forecastData = await forecastRes.json();
        state.lastCity = city;
        localStorage.setItem(CONFIG.STORAGE_KEY_LAST_CITY, city);

        renderWeather();
        showLoading(false);

    } catch (err) {
        console.error('Fetch error:', err);
        showError('Connection Error', 'Unable to fetch weather data. Please check your internet connection and try again.');
        showLoading(false);
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${CONFIG.OWM_BASE}/weather?lat=${lat}&lon=${lon}&appid=${state.apiKey}&units=${state.unit}`),
            fetch(`${CONFIG.OWM_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${state.apiKey}&units=${state.unit}`)
        ]);

        if (!currentRes.ok) {
            const errData = await currentRes.json();
            throw new Error(errData.message || 'Unknown error');
        }

        state.currentData = await currentRes.json();
        state.forecastData = await forecastRes.json();
        state.lastCity = state.currentData.name;
        localStorage.setItem(CONFIG.STORAGE_KEY_LAST_CITY, state.lastCity);
        DOM.searchInput.value = state.lastCity;

        renderWeather();
        showLoading(false);

    } catch (err) {
        console.error('Fetch error:', err);
        showError('Connection Error', 'Unable to fetch weather data. Please try again.');
        showLoading(false);
    }
}

// ==========================================
// Render Weather Data
// ==========================================
function renderWeather() {
    const data = state.currentData;
    const forecast = state.forecastData;

    if (!data || !forecast) return;

    // Show main content
    DOM.welcomeState.classList.add('hidden');
    DOM.errorState.classList.add('hidden');
    DOM.mainContent.classList.remove('hidden');

    // Update background theme
    updateBackground(data.weather[0].main);

    // --- Current Weather ---
    DOM.cityName.textContent = `${data.name}, ${data.sys.country}`;
    DOM.dateTime.textContent = formatDateTime(data.dt, data.timezone);

    // Weather icon
    const iconCode = data.weather[0].icon;
    DOM.weatherImg.src = `${CONFIG.ICON_URL}/${iconCode}@4x.png`;
    DOM.weatherImg.alt = data.weather[0].description;

    // Temperature
    DOM.tempValue.textContent = Math.round(data.main.temp);
    DOM.tempUnit.textContent = state.unit === 'metric' ? '°C' : '°F';
    DOM.weatherDesc.textContent = data.weather[0].description;
    DOM.feelsLike.textContent = Math.round(data.main.feels_like);

    // Details
    DOM.humidity.textContent = `${data.main.humidity}%`;
    DOM.humidityBar.style.width = `${data.main.humidity}%`;

    const windUnit = state.unit === 'metric' ? 'm/s' : 'mph';
    DOM.windSpeed.textContent = `${data.wind.speed} ${windUnit}`;
    DOM.pressure.textContent = `${data.main.pressure} hPa`;

    const visKm = (data.visibility / 1000).toFixed(1);
    DOM.visibility.textContent = `${visKm} km`;

    // --- Sunrise & Sunset ---
    const sunriseTime = new Date((data.sys.sunrise + data.timezone) * 1000);
    const sunsetTime = new Date((data.sys.sunset + data.timezone) * 1000);
    DOM.sunrise.textContent = formatTimeUTC(sunriseTime);
    DOM.sunset.textContent = formatTimeUTC(sunsetTime);
    updateSunArc(data.sys.sunrise, data.sys.sunset, data.dt, data.timezone);

    // --- Wind Compass ---
    const windDeg = data.wind.deg || 0;
    DOM.compassNeedle.style.transform = `rotate(${windDeg}deg)`;
    const speedKmh = state.unit === 'metric' ? (data.wind.speed * 3.6).toFixed(1) : data.wind.speed.toFixed(1);
    DOM.compassSpeed.textContent = speedKmh;
    DOM.windDirection.textContent = degToCompass(windDeg);
    DOM.windGust.textContent = data.wind.gust
        ? `${data.wind.gust} ${windUnit}`
        : 'N/A';

    // --- Hourly Forecast ---
    renderHourlyForecast(forecast.list.slice(0, 12));

    // --- 5-Day Forecast ---
    renderDailyForecast(forecast.list);

    // Add entrance animations
    addAnimations();
}

// ==========================================
// Hourly Forecast Render
// ==========================================
function renderHourlyForecast(hourlyList) {
    DOM.hourlyScroll.innerHTML = '';

    hourlyList.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `hourly-item${index === 0 ? ' now' : ''}`;

        const time = index === 0 ? 'Now' : formatHour(item.dt);
        const iconCode = item.weather[0].icon;
        const temp = Math.round(item.main.temp);
        const pop = Math.round((item.pop || 0) * 100);

        div.innerHTML = `
            <div class="hourly-time">${time}</div>
            <div class="hourly-icon">
                <img src="${CONFIG.ICON_URL}/${iconCode}@2x.png" alt="${item.weather[0].description}" loading="lazy">
            </div>
            <div class="hourly-temp">${temp}°</div>
            ${pop > 0 ? `
                <div class="hourly-pop">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                    ${pop}%
                </div>
            ` : ''}
        `;

        DOM.hourlyScroll.appendChild(div);
    });
}

// ==========================================
// 5-Day Forecast Render
// ==========================================
function renderDailyForecast(forecastList) {
    DOM.forecastGrid.innerHTML = '';

    // Group by day
    const dailyMap = {};
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const key = date.toISOString().split('T')[0];
        if (!dailyMap[key]) {
            dailyMap[key] = {
                temps: [],
                icons: [],
                descs: [],
                pops: [],
                date: date,
            };
        }
        dailyMap[key].temps.push(item.main.temp);
        dailyMap[key].icons.push(item.weather[0].icon);
        dailyMap[key].descs.push(item.weather[0].description);
        dailyMap[key].pops.push(item.pop || 0);
    });

    const days = Object.values(dailyMap).slice(0, 5);
    if (!days.length) return;

    // Find global min/max for temp bars
    let globalMin = Infinity, globalMax = -Infinity;
    days.forEach(day => {
        const min = Math.min(...day.temps);
        const max = Math.max(...day.temps);
        if (min < globalMin) globalMin = min;
        if (max > globalMax) globalMax = max;
    });
    const range = globalMax - globalMin || 1;

    days.forEach((day, index) => {
        const high = Math.round(Math.max(...day.temps));
        const low = Math.round(Math.min(...day.temps));
        const pop = Math.round(Math.max(...day.pops) * 100);

        // Pick the midday icon (or most common)
        const midIndex = Math.floor(day.icons.length / 2);
        const iconCode = day.icons[midIndex] || day.icons[0];
        const desc = day.descs[midIndex] || day.descs[0];

        // Bar position
        const barLeft = ((Math.min(...day.temps) - globalMin) / range) * 100;
        const barRight = ((Math.max(...day.temps) - globalMin) / range) * 100;

        const dayName = index === 0 ? 'Today' : formatDayName(day.date);
        const dateStr = formatShortDate(day.date);

        const div = document.createElement('div');
        div.className = 'forecast-item';
        div.innerHTML = `
            <div class="forecast-day">
                ${dayName}
                <div class="day-date">${dateStr}</div>
            </div>
            <div class="forecast-icon">
                <img src="${CONFIG.ICON_URL}/${iconCode}@2x.png" alt="${desc}" loading="lazy">
            </div>
            <div class="forecast-desc">${desc}</div>
            <div class="forecast-pop">
                ${pop > 0 ? `
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                    ${pop}%
                ` : ''}
            </div>
            <div class="forecast-temp-range">
                <span class="forecast-temp-high">${high}°</span>
                <div class="forecast-temp-bar">
                    <div class="forecast-temp-fill" style="left: ${barLeft}%; width: ${barRight - barLeft}%;"></div>
                </div>
                <span class="forecast-temp-low">${low}°</span>
            </div>
        `;

        DOM.forecastGrid.appendChild(div);
    });
}

// ==========================================
// Background & Atmosphere
// ==========================================
function updateBackground(weatherMain) {
    // Remove all weather classes
    DOM.bgGradient.classList.remove(
        'weather-clear', 'weather-clouds', 'weather-rain',
        'weather-snow', 'weather-thunder'
    );

    // Remove rain effects
    document.querySelectorAll('.rain-drop').forEach(el => el.remove());

    const main = weatherMain.toLowerCase();

    if (main.includes('clear') || main.includes('sun')) {
        DOM.bgGradient.classList.add('weather-clear');
    } else if (main.includes('cloud') || main.includes('mist') || main.includes('haze') || main.includes('fog') || main.includes('smoke')) {
        DOM.bgGradient.classList.add('weather-clouds');
    } else if (main.includes('rain') || main.includes('drizzle')) {
        DOM.bgGradient.classList.add('weather-rain');
        createRainEffect();
    } else if (main.includes('snow')) {
        DOM.bgGradient.classList.add('weather-snow');
    } else if (main.includes('thunder')) {
        DOM.bgGradient.classList.add('weather-thunder');
    }
}

function createRainEffect() {
    for (let i = 0; i < 40; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.height = (Math.random() * 20 + 10) + 'px';
        drop.style.animationDuration = (Math.random() * 0.5 + 0.3) + 's';
        drop.style.animationDelay = (Math.random() * 2) + 's';
        document.body.appendChild(drop);
    }
}

// ==========================================
// Sun Arc Position
// ==========================================
function updateSunArc(sunrise, sunset, now, timezone) {
    const dayLength = sunset - sunrise;
    const elapsed = now - sunrise;
    let progress = Math.max(0, Math.min(1, elapsed / dayLength));

    // Sun arc dash animation
    const pathLength = 290;
    const dashOffset = pathLength * (1 - progress);
    DOM.sunArcPath.style.strokeDashoffset = dashOffset;

    // Position sun dot along arc path (quadratic bezier)
    // Path: M 10 90 Q 100 -10 190 90
    const t = progress;
    const x = (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 100 + t * t * 190;
    const y = (1 - t) * (1 - t) * 90 + 2 * (1 - t) * t * (-10) + t * t * 90;

    DOM.sunDot.setAttribute('cx', x);
    DOM.sunDot.setAttribute('cy', y);

    // Hide dot if nighttime
    if (now < sunrise || now > sunset) {
        DOM.sunDot.style.opacity = '0.3';
    } else {
        DOM.sunDot.style.opacity = '1';
    }
}

// ==========================================
// Utility Functions
// ==========================================
function formatDateTime(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    };
    return date.toLocaleDateString('en-US', options);
}

function formatTimeUTC(date) {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function formatHour(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h} ${ampm}`;
}

function formatDayName(date) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatShortDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function degToCompass(deg) {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return dirs[index];
}

// ==========================================
// UI State Management
// ==========================================
function showLoading(show) {
    if (show) {
        DOM.loadingOverlay.classList.add('active');
    } else {
        DOM.loadingOverlay.classList.remove('active');
    }
}

function showWelcome() {
    DOM.welcomeState.classList.remove('hidden');
    DOM.mainContent.classList.add('hidden');
    DOM.errorState.classList.add('hidden');
}

function showError(title, message) {
    DOM.errorTitle.textContent = title;
    DOM.errorMessage.textContent = message;
    DOM.errorState.classList.remove('hidden');
    DOM.welcomeState.classList.add('hidden');
    DOM.mainContent.classList.add('hidden');
}

function addAnimations() {
    const sections = DOM.mainContent.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.classList.add('animate-up');
        section.classList.add(`animate-up-delay-${Math.min(index + 1, 4)}`);
    });

    // Reset after animation
    setTimeout(() => {
        sections.forEach(section => {
            section.style.opacity = '1';
        });
    }, 1000);
}
