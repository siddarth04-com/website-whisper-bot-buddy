
import { WeatherData } from './types';

// Use a free API key here - this is a demo API key for OpenWeatherMap
// In a production environment, this should be stored securely
const WEATHER_API_KEY = "4d8fb5b93d4af21d66a2948710284366";

export const fetchWeatherData = async (city: string): Promise<WeatherData | null> => {
  try {
    console.log('Fetching weather data for:', city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${WEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Weather data not found');
    }
    
    const data = await response.json();
    console.log('Weather data received:', data);
    
    return {
      city: data.name,
      temp: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};
