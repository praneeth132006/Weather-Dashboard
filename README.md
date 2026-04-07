# Weather Dashboard ☀️🌧️

A beautiful, real-time weather dashboard built with HTML5, CSS3, and vanilla JavaScript. Get current weather conditions, hourly forecasts, and 5-day predictions for any city worldwide.

![Weather Dashboard](https://img.shields.io/badge/Status-Live-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

- 🌡️ **Current Weather** — Real-time temperature, humidity, wind speed, pressure, and visibility
- 📅 **5-Day Forecast** — Daily high/low temperatures with weather icons and precipitation probability
- ⏰ **Hourly Forecast** — 12-hour scrollable forecast with temperature and rain chance
- 🌅 **Sunrise & Sunset** — Animated sun arc showing current sun position
- 🧭 **Wind Compass** — Live animated compass showing wind direction and speed
- 🌍 **Geolocation** — Use your current location for instant weather updates
- 🌙 **Dynamic Backgrounds** — Background changes based on weather conditions (clear, cloudy, rain, snow, thunder)
- 🔄 **Unit Toggle** — Switch between Celsius (°C) and Fahrenheit (°F)
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile
- 💾 **Persistent State** — Remembers your last searched city and preferences

## 🚀 Getting Started

### 1. Get a Free API Key

This app uses the **OpenWeatherMap API**. Get your free API key:

1. Go to [https://openweathermap.org/](https://openweathermap.org/)
2. Click **Sign Up** and create a free account
3. Go to **API Keys** in your profile
4. Copy your default API key (or generate a new one)

> **Note:** The free tier gives you **1,000 API calls/day**, which is more than enough for personal use. New API keys may take **up to 2 hours** to activate.

### 2. Run the App

Simply open `index.html` in your browser:

```bash
# Clone the repository
git clone https://github.com/praneeth132006/Weather-Dashboard.git
cd Weather-Dashboard

# Open in your default browser
open index.html      # macOS
start index.html     # Windows
xdg-open index.html  # Linux
```

Or use a local server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx serve .
```

### 3. Enter Your API Key

When you first open the app, you'll see a banner asking for your API key. Paste it in and click **Save Key**. The key is stored locally in your browser — it's never sent anywhere except to OpenWeatherMap.

## 🎨 Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic structure |
| CSS3 | Glassmorphism design, animations, responsive layout |
| JavaScript (ES6+) | API calls, DOM manipulation, state management |
| OpenWeatherMap API | Weather data (current + forecast) |
| Google Fonts (Inter) | Typography |

## 📁 Project Structure

```
Weather-Dashboard/
├── index.html      # Main HTML structure
├── style.css       # Premium dark-theme CSS
├── script.js       # Application logic & API integration
├── .gitignore      # Git ignore rules
└── README.md       # This file
```

## 🔑 API Reference

This project uses the following OpenWeatherMap endpoints:

| Endpoint | Description |
|---|---|
| `/weather` | Current weather data |
| `/forecast` | 5-day / 3-hour forecast |

**Free tier limits:** 1,000 calls/day, 60 calls/minute

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Weather data by [OpenWeatherMap](https://openweathermap.org/)
- Font by [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter)
# Weather-Dashboard
