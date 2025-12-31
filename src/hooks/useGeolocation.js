import { useState, useEffect } from "react";

function useGeolocation(location, setLocation) {
  const [isLoading, setIsLoading] = useState(true);

  const [cachedLocation, setCachedLocation] = useState({ data: null, timestamp: null });
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      console.log("Reverse geocode data:", data);
      // Extract place name - you can customize this based on what you want
      if (data.address) {
        // Try different address components in order of specificity
        const name = data.address.state

        return name;
      }
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    }
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem("cachedLocation");
      if (cached) {
        const parsed = JSON.parse(cached);
        setCachedLocation(parsed);
      }
    } catch (err) {
      console.error("Failed to parse cached location:", err);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
      return;
    }

    // Check cache
    if (cachedLocation && cachedLocation.timestamp) {
      const now = Date.now();
      const cacheAge = now - cachedLocation.timestamp;
      const oneHour = 60 * 60 * 1000;

      if (cacheAge < oneHour) {
        console.log("Using cached location:", cachedLocation.data);
        setLocation(cachedLocation.data);
        setIsLoading(false);
        return; // Exit early - use cached data
      }
    }

    console.log("Requesting fresh geolocation...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const locationString = await reverseGeocode(latitude, longitude);
        ;
        const timestamp = Date.now();

        // Update cache
        const newCache = { data: locationString, timestamp };
        setCachedLocation(newCache);
        localStorage.setItem('cachedLocation', JSON.stringify(newCache));

        // Update location
        setLocation(locationString);
        setIsLoading(false);
      },
      (error) => {
        handleGeolocationError(error);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 30000,
        timeout: 5000
      }
    );
  }, [setLocation]); // Dependencies

  function handleGeolocationError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.")
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.")
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.")
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.")
        break;
    }
    setIsLoading(false);
  }
  return { isLoading };
}

export default useGeolocation;