// components/SearchBar.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce'; // npm install lodash.debounce
import fetchReverseGeocode from '../hooks/useGeoReverse';
import { FaRegHourglass } from "react-icons/fa";
const SearchBar = ({ setLocation, currentLocation }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [reversedLocation, setReversedLocation] = useState(null);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  const searchLocations = useCallback(
    debounce(async (searchTerm) => {//debouncing to limit API calls
      if (!searchTerm.trim() || searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await fetchLocationSuggestions(searchTerm);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (err) {
        setError('Failed to fetch locations:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    searchLocations(value);
  };

  useEffect(() => {
    setLocation(reversedLocation ? `${reversedLocation.lat},${reversedLocation.lon}` : reversedLocation?.display_name);
  }, [reversedLocation]);

  const handleSuggestionClick = async (suggestion) => {
    const r = await fetchReverseGeocode(suggestion)
    setReversedLocation(r);
    console.log(reversedLocation);
    setLocation(suggestion ? `${suggestion.latitude},${suggestion.longitude}` : suggestion.display_name);
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
    } else if (e.key === 'Enter' && query.trim()) {
      if (suggestions.length > 0) {
        handleSuggestionClick(suggestions[0]);//use first suggestion on enter
      }
    }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-wrapper">

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          placeholder={reversedLocation && reversedLocation.display_name || currentLocation || "Search city or location..."}
          className="search-input"
          aria-label="Search location"
        />
        {loading && (<div className="search-spinner"><FaRegHourglass className='hourGlass' /></div>)}
        {!loading && query && (
          <button
            className="clear-button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            ✕

          </button>

        )}
      </div>


      {showDropdown && (
        <div className="suggestions-dropdown">
          {error && (
            <div className="suggestion-error">{error}</div>
          )}

          {suggestions.length > 0 ? (
            <ul className="suggestions-list">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id || suggestion.lat + suggestion.lon}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSuggestionClick(suggestion);
                  }}
                >
                  <div className="suggestion-content">
                    <span className="suggestion-name">
                      {suggestion.display_name || suggestion.name}
                    </span>
                    {suggestion.address && (
                      <span className="suggestion-details">
                        {suggestion.address.city || suggestion.address.state || suggestion.address.country}
                      </span>
                    )}
                  </div>
                  <span className="suggestion-type">📍</span>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 && !loading ? (
            <div className="no-results">No locations found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

async function fetchLocationSuggestions(query) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=7`
      , {
        headers: { "User-Agent": "WeatherApp/1.0" }
      }
    )
    if (!response.ok) {

      alert('Error fetching location suggestions');
      throw new Error('Search failed')
    };

    const data = await response.json();

    return data.map(item => ({
      id: item.place_id,
      display_name: item.display_name,
      latitude: item.lat,
      longitude: item.lon,
      address: item.address,
      type: item.type
    }));
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

export default SearchBar;