const fetchWeatherData = async (enteredLocation,unit) => {

    const apiKey = '5NHHFUWHEFL5UWBYUHMRKM2FH'; // Replace with your actual API key
    const location=enteredLocation || 'kampala,ug'; // Default location if none provided
    const unitGroup = unit === 'C' ? 'metric' : 'us'; // Use 'metric' for Celsius, 'us' for Fahrenheit, etc.
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitGroup}&include=days&key=${apiKey}&contentType=json`;

    try {
        const response = await fetch(url);

        // Check if the response is not ok
        if (!response.ok) {
            // Throw the response to handle it in the catch block
            throw response;
        }

        // Parse the JSON from the response
        const weatherData = await response.json();

        // Process weather data
        // console.log(weatherData.resolvedAddress);
        return weatherData;
    } catch (error) {
        // Log error with additional information if available
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