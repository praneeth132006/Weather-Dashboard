import { CONFIG } from '../api/weatherApi';

export default function Forecast({ data }) {
  if (!data) return null;

  // Houry data processing
  const hourlyList = data.list.slice(0, 12);
  const formatHour = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h} ${ampm}`;
  };

  // Daily data processing
  const dailyMap = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const key = date.toISOString().split('T')[0];
    if (!dailyMap[key]) {
      dailyMap[key] = { temps: [], icons: [], descs: [], pops: [], date };
    }
    dailyMap[key].temps.push(item.main.temp);
    dailyMap[key].icons.push(item.weather[0].icon);
    dailyMap[key].descs.push(item.weather[0].description);
    dailyMap[key].pops.push(item.pop || 0);
  });

  const days = Object.values(dailyMap).slice(0, 5);
  let globalMin = Infinity, globalMax = -Infinity;
  days.forEach(day => {
    const min = Math.min(...day.temps);
    const max = Math.max(...day.temps);
    if (min < globalMin) globalMin = min;
    if (max > globalMax) globalMax = max;
  });
  const range = globalMax - globalMin || 1;

  const formatDayName = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });
  const formatShortDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <>
      <section className="hourly-section glass-card animate-up animate-up-delay-3">
        <h3 className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="section-icon">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Hourly Forecast
        </h3>
        <div className="hourly-scroll">
          {hourlyList.map((item, index) => {
            const time = index === 0 ? 'Now' : formatHour(item.dt);
            const pop = Math.round((item.pop || 0) * 100);
            return (
              <div key={item.dt} className={`hourly-item ${index === 0 ? 'now' : ''}`}>
                <div className="hourly-time">{time}</div>
                <div className="hourly-icon">
                  <img src={`${CONFIG.ICON_URL}/${item.weather[0].icon}@2x.png`} alt={item.weather[0].description} style={{ width: '36px', height: '36px', marginBottom: '8px' }} />
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{Math.round(item.main.temp)}°</div>
                {pop > 0 && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '10px', height: '10px' }}>
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    {pop}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="forecast-section glass-card animate-up animate-up-delay-4">
        <h3 className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="section-icon">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          5-Day Forecast
        </h3>
        <div className="forecast-grid">
          {days.length > 0 && days.map((day, index) => {
            const high = Math.round(Math.max(...day.temps));
            const low = Math.round(Math.min(...day.temps));
            const pop = Math.round(Math.max(...day.pops) * 100);
            const midIndex = Math.floor(day.icons.length / 2);
            const iconCode = day.icons[midIndex] || day.icons[0];
            const desc = day.descs[midIndex] || day.descs[0];

            const barLeft = ((Math.min(...day.temps) - globalMin) / range) * 100;
            const barRight = ((Math.max(...day.temps) - globalMin) / range) * 100;
            const dayName = index === 0 ? 'Today' : formatDayName(day.date);

            return (
              <div key={index} className="forecast-item" style={{ transition: 'all var(--transition-normal)' }}>
                <div className="forecast-day">
                  {dayName}
                  <div className="day-date">{formatShortDate(day.date)}</div>
                </div>
                <div className="forecast-icon">
                  <img src={`${CONFIG.ICON_URL}/${iconCode}@2x.png`} alt={desc} style={{ width: '40px', height: '40px' }} />
                </div>
                <div className="forecast-desc">{desc}</div>
                <div className="forecast-pop">
                  {pop > 0 && (
                    <>
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                      {pop}%
                    </>
                  )}
                </div>
                <div className="forecast-temp-range">
                  <span className="forecast-temp-high">{high}°</span>
                  <div className="forecast-temp-bar">
                    <div className="forecast-temp-fill" style={{ left: `${barLeft}%`, width: `${barRight - barLeft}%` }}></div>
                  </div>
                  <span className="forecast-temp-low">{low}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
