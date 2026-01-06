const fetchWeatherData = async (enteredLocation,unit) => {

    const apiKey = '5NHHFUWHEFL5UWBYUHMRKM2FH'; 
    const location=enteredLocation || 'kampala,ug'; // Default location if none provided
    const unitGroup = unit === 'C' ? 'metric' : 'us'; 
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitGroup}&include=days&key=${apiKey}&contentType=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw response;
        }
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        if (error.text) {
            const errorMessage = await error.text();
            console.error('Error message:', errorMessage);
        } else {
            console.error('Error fetching weather data:', error);
        }
        return null; // Return null or handle the error as needed
    }
};

export default fetchWeatherData;