import { CONFIG } from '../api/weatherApi';

export default function GridDetails({ data, unit }) {
  if (!data) return null;

  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const pressure = data.main.pressure;
  const visibility = (data.visibility / 1000).toFixed(1);
  const feelsLike = Math.round(data.main.feels_like);
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';

  const sunrise = new Date((data.sys.sunrise + data.timezone) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  const sunset = new Date((data.sys.sunset + data.timezone) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

  const Tile = ({ title, icon, value, small, delay }) => (
    <div className={`glass-tile grid-tile animate-up animate-up-delay-${delay}`}>
      <div className="tile-header">
        {icon}
        {title}
      </div>
      <div className="tile-value">{value}</div>
      {small && <div className="tile-small">{small}</div>}
    </div>
  );

  return (
    <section className="weather-grid">
      <Tile 
        title="Humidity" 
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>} 
        value={`${humidity}%`} 
        small={`The dew point is ${Math.round(data.main.temp - (100 - humidity)/5)}° right now.`}
        delay={1}
      />
      <Tile 
        title="Wind" 
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>} 
        value={`${Math.round(wind)} ${windUnit}`} 
        small={`Gusts up to ${Math.round(data.wind.gust || wind * 1.2)} ${windUnit}.`}
        delay={2}
      />
      <Tile 
        title="Feels Like" 
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8m-4-4h8"/></svg>} 
        value={`${feelsLike}°`} 
        small={feelsLike > data.main.temp ? "Heating up higher." : "Colder than actual."}
        delay={3}
      />
      <Tile 
        title="Visibility" 
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>} 
        value={`${visibility} km`} 
        small={visibility > 10 ? "Perfectly clear." : "Moderate visibility."}
        delay={4}
      />
      <Tile 
        title="Sunrise" 
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M7.757 16.243l-2.121 2.121m10.607 0l2.121 2.121M7.757 7.757L5.636 5.636"/></svg>} 
        value={sunrise} 
        small={`Sunset: ${sunset}`}
        delay={5}
      />
      <Tile 
        title="Pressure" 
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 1"/></svg>} 
        value={`${pressure} hPa`} 
        small="Steady pressure."
        delay={6}
      />
    </section>
  );
}
