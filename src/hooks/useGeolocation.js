import { useEffect, useState } from "react";
import fetchReverseGeocode from "./useGeoReverse";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function useGeolocation() {
  const [geoLocation, setgeoLocation] = useState(null);
  const [geoLoading, setGeoLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoLoading(false);
      return;
    }

    const cached = localStorage.getItem("cachedLocation");

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        setgeoLocation(data);
        setGeoLoading(false);
        return;
      }
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
                

          const data = await fetchReverseGeocode(coords);
          const name =
            data.address?.city ||
            data.address?.town ||
            data.address?.state ||
            data.address?.country ||
            `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`;

          const cache = { data: name, timestamp: Date.now() };
          localStorage.setItem("cachedLocation", JSON.stringify(cache));

          setgeoLocation(name);
        } catch {
          setgeoLocation(`${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`);
        } finally {
          setGeoLoading(false);
        }
      },
      () => setGeoLoading(false),
      { timeout: 5000 }
    );
  }, []);

  return { geoLocation, geoLoading };
}

export default useGeolocation;
