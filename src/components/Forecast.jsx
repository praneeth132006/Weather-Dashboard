import { CONFIG } from '../api/weatherApi';

export default function Forecast({ data }) {
  if (!data) return null;

  // Hourly Forecast (First 24 hours)
  const hourly = data.list.slice(0, 10).map((item, i) => ({
    time: i === 0 ? "Now" : new Date(item.dt * 1000).getHours() + "h",
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon
  }));

  // Daily Forecast (Next 5 Days)
  const dailyMap = {};
  data.list.forEach(item => {
    const day = new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short' });
    if (!dailyMap[day]) {
      dailyMap[day] = { temps: [], icon: item.weather[0].icon };
    }
    dailyMap[day].temps.push(item.main.temp);
  });

  const daily = Object.entries(dailyMap).slice(0, 5).map(([day, val]) => ({
    day,
    high: Math.round(Math.max(...val.temps)),
    low: Math.round(Math.min(...val.temps)),
    icon: val.icon
  }));

  return (
    <>
      <section className="glass-tile forecast-tile animate-up animate-up-delay-7">
        <div className="tile-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          Hourly Forecast
        </div>
        <div className="forecast-scroll">
          {hourly.map((h, i) => (
            <div key={i} className="forecast-item">
              <span>{h.time}</span>
              <img src={`${CONFIG.ICON_URL}/${h.icon}.png`} alt="weather" />
              <span>{h.temp}°</span>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-tile forecast-tile animate-up animate-up-delay-8">
        <div className="tile-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>
          5-Day Forecast
        </div>
        <div style={{ marginTop: '12px' }}>
          {daily.map((d, i) => (
            <div key={i} className="forecast-row">
              <span style={{ minWidth: '40px', fontWeight: 600 }}>{d.day}</span>
              <img className="forecast-icon" src={`${CONFIG.ICON_URL}/${d.icon}.png`} alt="weather" />
              <div style={{ flex: 1, textAlign: 'right' }}>
                <span style={{ opacity: 0.6, fontSize: '0.9rem', marginRight: '12px' }}>{d.low}°</span>
                <span style={{ fontWeight: 600 }}>{d.high}°</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
