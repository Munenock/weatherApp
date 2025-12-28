// App.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import fetchData from './fetchData';
import useGeolocation from './hooks/useGeolocation';

function App() {
  const [location, setLocation] = useState(null); // Default location
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log('Current location:', location);

  const { "isLoading": geoLoading } = useGeolocation(location, setLocation);
  useEffect(() => {
    const getData = async () => {
      const data = await fetchData(location);
      data ? setWeatherData(data) : null;
      setLoading(false);
    };

    getData();
  }, [location]);

  console.log('Weather Data:', weatherData);
  if (loading || geoLoading) {
    return <div className="loading">Loading......</div>;
  }
  const today = weatherData.days[0];
  const nextDays = weatherData.days.slice(1, 5); // Get next 4 days

  return (
    <div className="weather-app">
      {/* Header with location and menu */}
      <header className="app-header">
        <button className="menu-button">☰</button>

        <div className="location-search-container">
          <h1 className="location">{weatherData.resolvedAddress}</h1>

          <div className="search-bar">
            <input
              type="text"
              placeholder={weatherData.resolvedAddress || "Enter location..."}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setLocation(e.target.value);
                  e.target.value = ''; // Clear input after search
                }
              }}
              className="search-input"
            />
            <button
              className="search-button"
              onClick={(e) => {
                const input = e.target.previousElementSibling;
                if (input.value.trim()) {
                  setLocation(input.value.trim());
                  input.value = ''; // Clear input after search
                }
              }}
            >
              🔍
            </button>
          </div>
        </div>
      </header>

      {/* Main weather section */}
      <main className="weather-main">
        <div className="current-weather">
          <div className="weather-type">
            <h2 className="conditions">{today.conditions}</h2>
            <div className="temperature">{Math.round(today.temp)}°C</div>
            <p className="description">{today.description}</p>
          </div>

          {/* Weather stats */}
          <div className="weather-stats">
            <div className="stat">
              <div className="stat-label">Precipitation</div>
              <div className="stat-value">{today.precip}"</div>
              <div className="stat-sub">{today.precipprob}% chance</div>
            </div>
            <div className="stat">
              <div className="stat-label">Humidity</div>
              <div className="stat-value">{today.humidity}%</div>
            </div>
            <div className="stat">
              <div className="stat-label">Wind</div>
              <div className="stat-value">{today.windspeed} mph</div>
            </div>
          </div>
        </div>

        {/* Next days forecast */}
        <section className="forecast">
          <h3 className="forecast-title">Next 4 Days</h3>
          <div className="forecast-days">
            {nextDays.map((day, index) => (
              <div key={index} className="forecast-day">
                <div className="day-name">
                  {new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="day-date">
                  {new Date(day.datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="day-temp">{Math.round(day.temp)}°</div>
                <div className="day-condition">{day.conditions.split(',')[0]}</div>
                <div className="day-precip">
                  <span className="precip-icon">💧</span> {day.precip}"
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer with additional info */}
      <footer className="app-footer">
        <div className="footer-info">
          <div className="footer-item">
            <span className="footer-label">High/Low:</span>
            <span className="footer-value">{Math.round(today.tempmax)}°/{Math.round(today.tempmin)}°</span>
          </div>
          <div className="footer-item">
            <span className="footer-label">Sunrise:</span>
            <span className="footer-value">{today.sunrise}</span>
          </div>
          <div className="footer-item">
            <span className="footer-label">Sunset:</span>
            <span className="footer-value">{today.sunset}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;