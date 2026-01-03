//reverse coordinates to location name
import { useState, useEffect } from 'react';


export default async function fetchReverseGeocode(coords) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`,
        {
            headers: { "User-Agent": "WeatherApp/1.0" }
        }
    );
const data = await res.json();
    return data;
}