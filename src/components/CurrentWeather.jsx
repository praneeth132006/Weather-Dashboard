export default function CurrentWeather({ data }) {
  if (!data) return null;

  const temp = Math.round(data.main.temp);
  const high = Math.round(data.main.temp_max);
  const low = Math.round(data.main.temp_min);
  const condition = data.weather[0].main;

  return (
    <section className="hero-weather animate-up">
      <h2 className="hero-city">{data.name}</h2>
      <div className="hero-temp">{temp}°</div>
      <div className="hero-condition">{condition}</div>
      <div className="hero-range">
        H:{high}° L:{low}°
      </div>
    </section>
  );
}
