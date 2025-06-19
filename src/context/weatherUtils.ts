
import { WeatherData } from './types';

export const fetchWeatherData = async (city: string): Promise<WeatherData | null> => {
  try {
    console.log('Fetching weather data for:', city);
    
    // Call Supabase Edge Function that uses secure API key
    const response = await fetch('/api/weather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city }),
    });
    
    if (!response.ok) {
      throw new Error('Weather data not found');
    }
    
    const data = await response.json();
    console.log('Weather data received:', data);
    
    return {
      city: data.city,
      temp: data.temp,
      description: data.description,
      icon: data.icon,
      humidity: data.humidity,
      windSpeed: data.windSpeed
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};
