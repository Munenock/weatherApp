// App.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import fetchData from './fetchData';
function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData();
      // console.log("Fetched data:", data); 
      setWeatherData(data);
      setLoading(false);
    };
    
    getData();
  }, []);
  
// console.log("Weather Data State:", weatherData); // ✅ This will log on each render

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  const today = weatherData.days[0];
  const nextDays = weatherData.days.slice(1, 5); // Get next 4 days

  return (
    <div className="weather-app">
      {/* Header with location and menu */}
      <header className="app-header">
        <h1 className="location">{weatherData.resolvedAddress}</h1>
        <button className="menu-button">☰</button>
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