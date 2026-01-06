import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import fetchWeatherData from './services/fetchWeatherData';
import useGeolocation from './hooks/useGeolocation';
import SearchBar from './components/SearchBar';
// import fetchReverseGeocode from './hooks/useGeoReverse';
function App() {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState(() => localStorage.getItem('unit') || 'C');
  const [weatherConditionClass, setWeatherConditionClass] = useState('default');
  const { geoLocation, geoLoading } = useGeolocation();


  useEffect(() => {
    if (geoLocation && !location) {
      // alert(geoLocation);
      setLocation(geoLocation);
    }
    if (!location) return;

    const getData = async () => {
      setLoading(true);
      const data = await fetchWeatherData(location, unit);
      const weatherConditionClass = data ? /rain/.test(data.days[0].icon) ? 'rainy' :
        /snow/.test(data.days[0].icon) ? 'snowy' :
          /clear/.test(data.days[0].icon) ? 'clear' :
            /cloudy/.test(data.days[0].icon) ? 'cloudy' : 'partly-cloudy' : 'default';
      setWeatherConditionClass(`bg-${weatherConditionClass}`);
      console.log(data);
      if (data) {
        setWeatherData(data)

      };
      setLoading(false);
    };

    getData();
  }, [location, unit, geoLocation]);


  
  const toggleUnit = () => {
    const newUnit = unit === 'C' ? 'F' : 'C';
    setUnit(newUnit);
    localStorage.setItem('unit', newUnit);
  };

  return (
    <div className={`weather-app ${weatherConditionClass}`}>
      <header className="app-header">
        {/* <button className="menu-button">☰</button> */}

        <div className="location-search-container">
          <h1 className="location">
            {geoLoading && !weatherData
              ? 'Locating...'
              : weatherData?.resolvedAddress || 'Enter a location'}
          </h1>


          <SearchBar setLocation={setLocation} currentLocation={weatherData?.resolvedAddress} />
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
                        <img className='weather-icon' src={`/WeatherIcons/SVG/2nd Set - Monochrome/${today.icon}.svg`} alt="" />
                        <div className="temperature">
                          {today.temp}°<i className='feels-like'>{today.feelslike}</i>{unit}
                        </div>
                        <p className="description">{today.description}</p>
                      </div>

                      <div className="weather-stats">
                        <Stat label="Precip" value={`${today.precip}"`} sub={`${today.precipprob}% chance`} />
                        <Stat label="Humidity" value={`${today.humidity}%`} />
                        <Stat label="Wind" value={`${today.windspeed} ${unit === 'C' ? 'km/h' : 'mph'}`} />
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
                              {day.temp}<i className='day-feels-like'>{day.feelslike}</i>°
                            </div>
                            <img src={`/WeatherIcons/SVG/2nd Set - Monochrome/${day.icon}.svg`} alt="" />
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
