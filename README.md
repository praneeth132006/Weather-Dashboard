# 🌌 WeatherDash: Premium Obsidian Edition

A high-density, professional-grade meteorological dashboard built with **React** and **Vite**. WeatherDash combines real-time data visualization with a stunning obsidian glassmorphic aesthetic to provide a comprehensive environmental overview.

![WeatherDash Preview](https://via.placeholder.com/1200x600/020617/f1f5f9?text=WeatherDash+Premium+Obsidian+Edition)

## ✨ Core Features

### 1. 🌡️ Real-Time Intelligence
- **Atmospheric Hero Section:** Large-scale temperature, high/low range, and condition tracking.
- **24-Hour Outlook:** Staggered, animated scroll for the next full day of weather.
- **5-Day Predictive Grid:** Neon multi-stop gradient bars showing temperature variances.

### 2. 🏥 Environmental Health & AQI
- **Integrated Air Pollution API:** Real-time tracking of PM2.5, NO2, and Ozone.
- **Color-Coded AQI Tiles:** Instant visual feedback (Emerald: Good, Rose: Poor).
- **Metric Insights:** Deep-dive modals explaining the impact of each environmental factor on health.

### 3. 🎭 Dynamic Atmospheric Themes
The entire dashboard **respawns** its visual identity based on the weather ID:
- **Thunderstorm:** Deep Indigo / Navy gradients.
- **Rain/Drizzle:** Slate Blue atmospheric tones.
- **Clear:** Clean, premium Obsidian black.
- **Snow:** Steel Gray / Frost highlights.
- **Atmospheric:** Mist and Haze effects.

### 4. 📊 High-Density Metrics
- **UV Index:** Solar radiation mapping for safe outdoor planning.
- **Cloud Cover:** Percentage-based sky obstruction metrics.
- **Visibility & Pressure:** Standard meteorological indicators in a premium glass format.
- **Sunrise/Sunset:** Localized solar event tracking.

## 🛠️ Technology Stack

- **Framework:** [React 18+](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** Vanilla CSS3 with Custom Properties (CSS Variables)
- **Data Engine:** [OpenWeatherMap API](https://openweathermap.org/api)
- **Typography:** [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0 or higher)
- npm or yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/praneeth132006/Weather-Dashboard.git
   cd Weather-Dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up API Key:**
   - The application is currently configured with a hardcoded OpenWeatherMap API key for quick demonstration. For production deployment, update `src/api/weatherApi.js`.

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```

## 📂 Project Architecture

```text
src/
├── api/
│   └── weatherApi.js     # Unified API engine (Weather, Forecast, Pollution)
├── components/
│   ├── Header.jsx        # Glass search interface
│   ├── CurrentWeather.jsx # Hero Section
│   ├── Forecast.jsx      # Hourly & 5-Day logic
│   ├── GridDetails.jsx   # Metrics Engine
│   ├── MetricModal.jsx   # Detailed Insights
│   ├── WelcomeState.jsx  # Initial Onboarding
│   └── ErrorState.jsx    # Recovery Interface
├── App.jsx               # Global state & Theme orchestrator
├── App.css               # Component-level layout transitions
└── index.css             # Main Design System tokens & Animations
```

## 🛡️ Stability & Performance
- **Optimized Promising:** Orchestrates triple-call synchronization (Weather + Forecast + Pollution) into a single unified promise cycle.
- **Safe Rendering:** Implements defensive rendering guards to prevent "White Screen" crashes on initial data mount.
- **Glassmorphic Optimization:** Uses `backdrop-filter` and `blur` with hardware acceleration for smooth 60fps animations.

## 📄 License
This project is for demonstration and meteorological analysis. Weather data is provided by the OpenWeatherMap API.

---

**Developed with ❤️ by Antigravity AI**
