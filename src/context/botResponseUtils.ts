
import { SuggestedReplyType, TravelPreferences, WeatherData } from './types';
import { fetchWeatherData } from './weatherUtils';
import { getDestinationRecommendations } from './travelUtils';

export const generateBotResponse = async (
  userMessage: string,
  travelPreferences: TravelPreferences,
  setWeatherData: (data: WeatherData | null) => void
): Promise<{ message: string; suggestions: SuggestedReplyType[] }> => {
  console.log('Generating bot response for:', userMessage);
  const lowerCaseMsg = userMessage.toLowerCase().trim();
  
  // Handle specific input messages - exact matching first
  if (lowerCaseMsg === 'popular indian destinations' || lowerCaseMsg === 'popular destinations') {
    console.log('Handling popular Indian destinations request');
    return {
      message: "Here are some of the most popular travel destinations in India:\n\n" +
              "🏛️ **Delhi** - India's capital with Red Fort, India Gate, and rich Mughal heritage\n" +
              "🕌 **Agra** - Home to the iconic Taj Mahal and Agra Fort\n" +
              "🏰 **Jaipur** - The Pink City with majestic palaces and forts\n" +
              "🌴 **Kerala** - God's Own Country with backwaters and spice plantations\n" +
              "🏖️ **Goa** - Beautiful beaches and Portuguese colonial charm\n\n" +
              "Which destination interests you most? I can provide detailed information about any of these places!",
      suggestions: [
        { id: '1', text: 'Tell me about Delhi' },
        { id: '2', text: 'Tell me about Kerala' },
        { id: '3', text: 'Tell me about Rajasthan' },
        { id: '4', text: 'Budget travel in India' }
      ]
    };
  }
  
  // Handle "India travel packages" suggestion
  if (lowerCaseMsg === 'india travel packages' || lowerCaseMsg === 'travel packages') {
    console.log('Handling India travel packages request');
    return {
      message: 'I can help you find the perfect India travel package! What type of Indian experience are you looking for?',
      suggestions: [
        { id: '1', text: 'Golden Triangle tour' },
        { id: '2', text: 'Kerala backwaters' },
        { id: '3', text: 'Rajasthan heritage' },
        { id: '4', text: 'Himalayan adventure' }
      ],
    };
  }
  
  // Handle "India travel tips" suggestion
  if (lowerCaseMsg === 'india travel tips' || lowerCaseMsg === 'travel tips') {
    console.log('Handling India travel tips request');
    return {
      message: 'Here are essential tips for traveling in India:\n\n' +
              '🛂 **Before You Go:**\n' +
              '• Get an e-Visa or tourist visa in advance\n' +
              '• Vaccinations recommended (consult your doctor)\n' +
              '• Best time: October to March for most regions\n\n' +
              '💰 **Money & Budget:**\n' +
              '• Carry cash (INR) - many places don\'t accept cards\n' +
              '• Bargaining is common in markets\n' +
              '• Tipping is appreciated (10-15%)\n\n' +
              '🍛 **Food & Health:**\n' +
              '• Drink bottled water\n' +
              '• Try street food but choose busy stalls\n' +
              '• Vegetarian options available everywhere\n\n' +
              'What specific aspect would you like more tips about?',
      suggestions: [
        { id: '1', text: 'Food safety in India' },
        { id: '2', text: 'Transportation in India' },
        { id: '3', text: 'Cultural etiquette' },
        { id: '4', text: 'Budget planning' }
      ],
    };
  }

  // Handle more specific suggestion responses
  if (lowerCaseMsg === 'golden triangle tour') {
    console.log('Handling Golden Triangle tour request');
    return {
      message: `🔺 **Golden Triangle Tour - India's Classic Circuit**\n\n**Delhi → Agra → Jaipur**\n\n🏛️ **Delhi (2-3 days)** - Red Fort, India Gate, Qutub Minar, Humayun's Tomb\n🕌 **Agra (1-2 days)** - Taj Mahal, Agra Fort, Mehtab Bagh\n🏰 **Jaipur (2-3 days)** - Hawa Mahal, City Palace, Amber Fort\n\n**Duration:** 6-8 days\n**Best Time:** October to March\n**Budget:** ₹15,000 - ₹50,000 per person\n\nWould you like a detailed itinerary for any city?`,
      suggestions: [
        { id: '1', text: 'Delhi detailed itinerary' },
        { id: '2', text: 'Best time to visit Golden Triangle' },
        { id: '3', text: 'Golden Triangle budget breakdown' },
        { id: '4', text: 'Transportation options' }
      ]
    };
  }

  // Handle weather queries with India focus
  const weatherRegex = /weather\s+(?:in|at|for)?\s+([a-zA-Z\s]+)/i;
  const weatherMatch = userMessage.match(weatherRegex);
  
  if (lowerCaseMsg.includes('weather') && weatherMatch && weatherMatch[1]) {
    console.log('Handling weather request for:', weatherMatch[1]);
    const city = weatherMatch[1].trim();
    const weather = await fetchWeatherData(city);
    
    if (weather) {
      setWeatherData(weather);
      return {
        message: `Currently in ${weather.city}, it's ${weather.temp.toFixed(1)}°C with ${weather.description}. The humidity is ${weather.humidity}% and wind speed is ${weather.windSpeed} m/s.\n\nWould you like travel information for ${weather.city}?`,
        suggestions: [
          { id: '1', text: `Things to do in ${weather.city}` },
          { id: '2', text: `Best time to visit ${weather.city}` },
          { id: '3', text: `${weather.city} travel guide` },
          { id: '4', text: 'Similar Indian destinations' },
        ],
      };
    } else {
      return {
        message: `I couldn't find weather information for "${city}". Please check the city name and try again. I specialize in Indian destinations!`,
        suggestions: [
          { id: '1', text: 'Weather in Delhi' },
          { id: '2', text: 'Weather in Mumbai' },
          { id: '3', text: 'Weather in Kerala' },
          { id: '4', text: 'Popular Indian destinations' },
        ],
      };
    }
  }
  
  // Handle travel recommendations
  if (lowerCaseMsg.includes('recommend') || 
      lowerCaseMsg.includes('suggestion') || 
      lowerCaseMsg.includes('where should i go') || 
      lowerCaseMsg.includes('place to visit')) {
    
    console.log('Handling recommendation request');
    const recommendations = getDestinationRecommendations(travelPreferences);
    const { genre, budget, style } = travelPreferences;
    
    let preferencesText = 'Based on popular Indian destinations';
    if (genre || budget || style) {
      preferencesText = 'Based on your preferences for India travel';
      if (genre) preferencesText += ` for ${genre} experiences`;
      if (budget) preferencesText += ` with a ${budget} budget`;
      if (style) preferencesText += ` and ${style} travel style`;
    }
    
    return {
      message: `${preferencesText}, here are my top Indian recommendations:\n\n` + 
               `🇮🇳 **${recommendations[0]}**\n` +
               `🇮🇳 **${recommendations[1]}**\n` +
               `🇮🇳 **${recommendations[2]}**\n` +
               `🇮🇳 **${recommendations[3]}**\n` +
               `🇮🇳 **${recommendations[4]}**\n\n` +
               `Which Indian destination would you like to explore further?`,
      suggestions: [
        { id: '1', text: `Tell me about ${recommendations[0]}` },
        { id: '2', text: `Tell me about ${recommendations[1]}` },
        { id: '3', text: 'Refine my India preferences' },
        { id: '4', text: 'Budget travel in India' }
      ]
    };
  }

  // Default response for unclear queries
  console.log('Using default response');
  return {
    message: "Namaste! I'm here to help you explore incredible India! 🇮🇳\n\nI can assist you with:\n• 🏛️ **Popular Indian destinations** like Delhi, Agra, Kerala, Rajasthan\n• 🌤️ **Weather information** for Indian cities\n• 💡 **India-specific travel tips** and cultural guidance\n• 💰 **Budget-friendly options** across India\n• 🎯 **Activity suggestions** for Indian destinations\n\nWhat aspect of India would you like to explore?",
    suggestions: [
      { id: '1', text: 'Popular Indian destinations' },
      { id: '2', text: 'India travel tips' },
      { id: '3', text: 'Golden Triangle tour' },
      { id: '4', text: 'Kerala backwaters' }
    ],
  };
};
