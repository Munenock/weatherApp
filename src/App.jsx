import React, { useState, useEffect } from 'react';
import './App.css';
import fetchData from './fetchData';
import useGeolocation from './hooks/useGeolocation';

function App() {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState(() => localStorage.getItem('unit') || 'C');

  useGeolocation(location, setLocation);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await fetchData(location);
      if (data) setWeatherData(data);
      setLoading(false);
    };
    getData();
  }, [location]);

  const convertTemp = (tempC) =>
    unit === 'C' ? Math.round(tempC) : Math.round(tempC * 9 / 5 + 32);

  const toggleUnit = () => {
    const newUnit = unit === 'C' ? 'F' : 'C';
    setUnit(newUnit);
    localStorage.setItem('unit', newUnit);
  };

  return (
    <div className="weather-app">
      <header className="app-header">
        <button className="menu-button">☰</button>

        <div className="location-search-container">
          <h1 className="location">
            {weatherData ? weatherData.resolvedAddress : 'Weather'}
          </h1>

          <div className="search-bar">
            <input
              className="search-input"
              placeholder="Enter location..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  setLocation(e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
            <button className="search-button">🔍</button>
          </div>
        </div>

        <button className="unit-toggle" onClick={toggleUnit}>
          °{unit}
        </button>
      </header>

      {loading ? (
        <Skeleton />
      ) : (
        weatherData && (
          <>
            <main className="weather-main">
              {(() => {
                const today = weatherData.days[0];
                const nextDays = weatherData.days.slice(1, 5);

                return (
                  <>
                    <div className="current-weather">
                      <div className="weather-type">
                        <h2 className="conditions">{today.conditions}</h2>
                        <div className="temperature">
                          {convertTemp(today.temp)}°{unit}
                        </div>
                        <p className="description">{today.description}</p>
                      </div>

                      <div className="weather-stats">
                        <Stat label="Precip" value={`${today.precip}"`} sub={`${today.precipprob}% chance`} />
                        <Stat label="Humidity" value={`${today.humidity}%`} />
                        <Stat label="Wind" value={`${today.windspeed} mph`} />
                      </div>
                    </div>

                    <section className="forecast">
                      <h3 className="forecast-title">Next 4 Days</h3>
                      <div className="forecast-days">
                        {nextDays.map((day, i) => (
                          <div key={i} className="forecast-day">
                            <div className="day-name">
                              {new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="day-temp">
                              {convertTemp(day.temp)}°
                            </div>
                            <div className="day-condition">
                              {day.conditions.split(',')[0]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                );
              })()}
            </main>

            <footer className="app-footer">
              <div className="footer-info">
                <FooterItem
                  label="High / Low"
                  value={`${convertTemp(weatherData.days[0].tempmax)}° / ${convertTemp(weatherData.days[0].tempmin)}°`}
                />
                <FooterItem label="Sunrise" value={weatherData.days[0].sunrise} />
                <FooterItem label="Sunset" value={weatherData.days[0].sunset} />
              </div>
            </footer>
          </>
        )
      )}
    </div>
  );
}

/* Small Components */
const Stat = ({ label, value, sub }) => (
  <div className="stat">
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

const FooterItem = ({ label, value }) => (
  <div className="footer-item">
    <span className="footer-label">{label}</span>
    <span className="footer-value">{value}</span>
  </div>
);

/* Skeleton Loader */
const Skeleton = () => (
  <div className="skeleton">
    <div className="sk-header shimmer" />
    <div className="sk-temp shimmer" />
    <div className="sk-stats">
      <div className="sk-box shimmer" />
      <div className="sk-box shimmer" />
      <div className="sk-box shimmer" />
    </div>
    <div className="sk-forecast">
      <div className="sk-day shimmer" />
      <div className="sk-day shimmer" />
      <div className="sk-day shimmer" />
      <div className="sk-day shimmer" />
    </div>
  </div>
);

export default App;
