
import { SuggestedReplyType, TravelPreferences, WeatherData } from './types';
import { fetchWeatherData } from './weatherUtils';
import { getDestinationRecommendations, getDestinationDetails, getDestinationsByState } from './travelUtils';

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
              "🏖️ **Goa** - Beautiful beaches and Portuguese colonial charm\n" +
              "🏜️ **Rajasthan** - Land of kings with desert and palace experiences\n" +
              "🏔️ **Himachal Pradesh** - Mountain paradise with hill stations\n" +
              "🕉️ **Uttarakhand** - Spiritual and adventure hub of India\n\n" +
              "Which destination interests you most? I can provide detailed information about any of these places!",
      suggestions: [
        { id: '1', text: 'Tell me about Delhi' },
        { id: '2', text: 'Tell me about Kerala' },
        { id: '3', text: 'Tell me about Rajasthan' },
        { id: '4', text: 'Budget travel in India' }
      ]
    };
  }
  
  // Handle "Tell me about [destination]" requests
  const tellMeAboutRegex = /tell me about\s+([a-zA-Z\s]+)/i;
  const tellMeMatch = userMessage.match(tellMeAboutRegex);
  
  if (tellMeMatch && tellMeMatch[1]) {
    const destination = tellMeMatch[1].trim();
    const details = getDestinationDetails(destination);
    
    return {
      message: `🇮🇳 **${destination.toUpperCase()} TRAVEL GUIDE**\n\n${details}\n\nWould you like specific information about accommodation, transportation, or activities?`,
      suggestions: [
        { id: '1', text: `Best time to visit ${destination}` },
        { id: '2', text: `Things to do in ${destination}` },
        { id: '3', text: `${destination} budget guide` },
        { id: '4', text: `How to reach ${destination}` }
      ]
    };
  }
  
  // Handle state-specific queries
  const stateRegex = /(?:places in|destinations in|visit in)\s+([a-zA-Z\s]+)/i;
  const stateMatch = userMessage.match(stateRegex);
  
  if (stateMatch && stateMatch[1]) {
    const state = stateMatch[1].trim();
    const destinations = getDestinationsByState(state);
    
    if (destinations.length > 0) {
      return {
        message: `🌟 **Top destinations in ${state.toUpperCase()}:**\n\n` +
                destinations.map((dest, index) => `${index + 1}. **${dest}**`).join('\n') +
                `\n\nWhich ${state} destination would you like to explore in detail?`,
        suggestions: [
          { id: '1', text: `Tell me about ${destinations[0]}` },
          { id: '2', text: `Tell me about ${destinations[1]}` },
          { id: '3', text: `Best time to visit ${state}` },
          { id: '4', text: `${state} travel guide` }
        ]
      };
    }
  }
  
  // Handle "India travel packages" suggestion
  if (lowerCaseMsg === 'india travel packages' || lowerCaseMsg === 'travel packages') {
    console.log('Handling India travel packages request');
    return {
      message: '🎁 **POPULAR INDIA TRAVEL PACKAGES**\n\n' +
              '🔺 **Golden Triangle** (6-8 days) - Delhi → Agra → Jaipur\n' +
              '🌴 **Kerala Backwaters** (5-7 days) - Kochi → Alleppey → Munnar\n' +
              '🏰 **Rajasthan Heritage** (10-12 days) - Jaipur → Udaipur → Jodhpur → Jaisalmer\n' +
              '🏔️ **Himalayan Adventure** (8-10 days) - Manali → Leh-Ladakh\n' +
              '🕉️ **Spiritual India** (7-9 days) - Varanasi → Rishikesh → Haridwar\n' +
              '🏖️ **South India Explorer** (12-14 days) - Kerala → Karnataka → Tamil Nadu\n\n' +
              'Which package interests you most?',
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
      message: '🇮🇳 **ESSENTIAL INDIA TRAVEL TIPS**\n\n' +
              '🛂 **Before You Go:**\n' +
              '• Get e-Visa online (most countries eligible)\n' +
              '• Vaccinations: Hepatitis A/B, Typhoid, Japanese Encephalitis\n' +
              '• Best time: October to March for most regions\n' +
              '• Pack cotton clothes, sunscreen, insect repellent\n\n' +
              '💰 **Money & Budget:**\n' +
              '• Currency: Indian Rupee (INR)\n' +
              '• Carry cash - many places don\'t accept cards\n' +
              '• ATMs widely available in cities\n' +
              '• Bargaining is common in markets\n' +
              '• Tipping: 10-15% in restaurants, ₹20-50 for services\n\n' +
              '🍛 **Food & Health:**\n' +
              '• Drink only bottled/filtered water\n' +
              '• Try street food from busy, hygienic stalls\n' +
              '• Vegetarian options available everywhere\n' +
              '• Carry hand sanitizer and basic medicines\n\n' +
              '🚆 **Transportation:**\n' +
              '• Book train tickets in advance (IRCTC website)\n' +
              '• Use app-based taxis (Uber, Ola) in cities\n' +
              '• Auto-rickshaws for short distances\n' +
              '• Domestic flights for long distances\n\n' +
              'What specific aspect would you like more tips about?',
      suggestions: [
        { id: '1', text: 'Food safety in India' },
        { id: '2', text: 'Transportation in India' },
        { id: '3', text: 'Cultural etiquette in India' },
        { id: '4', text: 'Budget planning for India' }
      ],
    };
  }

  // Handle more specific suggestion responses
  if (lowerCaseMsg === 'golden triangle tour') {
    console.log('Handling Golden Triangle tour request');
    return {
      message: `🔺 **GOLDEN TRIANGLE TOUR - INDIA'S CLASSIC CIRCUIT**\n\n**Delhi → Agra → Jaipur (6-8 days)**\n\n🏛️ **Delhi (2-3 days)**\n• Red Fort - Mughal fortress & UNESCO site\n• India Gate - War memorial & evening strolls\n• Qutub Minar - Victory tower from 12th century\n• Humayun's Tomb - Inspiration for Taj Mahal\n• Lotus Temple - Baháʼí House of Worship\n• Chandni Chowk - Historic market area\n\n🕌 **Agra (1-2 days)**\n• Taj Mahal - Monument of love, sunrise/sunset visits\n• Agra Fort - Mughal emperor residence\n• Fatehpur Sikri - Ghost city of Akbar\n• Mehtab Bagh - Taj Mahal back view gardens\n\n🏰 **Jaipur (2-3 days)**\n• Hawa Mahal - Palace of Winds\n• City Palace - Royal residence & museum\n• Amber Fort - Hilltop fort with elephant rides\n• Jantar Mantar - Ancient astronomical observatory\n• Johari Bazaar - Gems & jewelry shopping\n\n**💰 Budget:** ₹15,000 - ₹50,000 per person\n**🌡️ Best Time:** October to March\n**🚗 Distance:** ~720 km total\n\nWould you like a detailed day-by-day itinerary?`,
      suggestions: [
        { id: '1', text: 'Delhi detailed itinerary' },
        { id: '2', text: 'Best time to visit Golden Triangle' },
        { id: '3', text: 'Golden Triangle budget breakdown' },
        { id: '4', text: 'Transportation options Golden Triangle' }
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
        message: `🌤️ **Current weather in ${weather.city}:**\n\n` +
                `🌡️ **Temperature:** ${weather.temp.toFixed(1)}°C\n` +
                `☁️ **Condition:** ${weather.description}\n` +
                `💧 **Humidity:** ${weather.humidity}%\n` +
                `💨 **Wind Speed:** ${weather.windSpeed} m/s\n\n` +
                `Based on current conditions, it's a ${weather.temp > 25 ? 'warm' : weather.temp > 15 ? 'pleasant' : 'cool'} day in ${weather.city}.\n\n` +
                `Would you like travel information for ${weather.city}?`,
        suggestions: [
          { id: '1', text: `Things to do in ${weather.city}` },
          { id: '2', text: `Best time to visit ${weather.city}` },
          { id: '3', text: `${weather.city} travel guide` },
          { id: '4', text: 'Similar Indian destinations' },
        ],
      };
    } else {
      return {
        message: `I couldn't find weather information for "${city}". Please check the city name and try again. I specialize in Indian destinations!\n\n🌟 **Popular Indian cities for weather info:**\n• Delhi, Mumbai, Bangalore, Chennai\n• Jaipur, Kolkata, Hyderabad, Pune\n• Kochi, Goa, Manali, Shimla`,
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
      if (genre) preferencesText += ` seeking ${genre} experiences`;
      if (budget) preferencesText += ` with a ${budget} budget`;
      if (style) preferencesText += ` perfect for ${style} travelers`;
    }
    
    const formattedRecommendations = recommendations.slice(0, 5).map((rec, index) => {
      const parts = rec.split(' - ');
      return `${index + 1}. **${parts[0]}** - ${parts[1] || 'Incredible Indian destination'}`;
    }).join('\n');
    
    return {
      message: `🇮🇳 **PERSONALIZED INDIA RECOMMENDATIONS**\n\n${preferencesText}:\n\n${formattedRecommendations}\n\nEach destination offers unique experiences that match your travel style. Which one catches your interest?`,
      suggestions: [
        { id: '1', text: `Tell me about ${recommendations[0].split(' - ')[0]}` },
        { id: '2', text: `Tell me about ${recommendations[1].split(' - ')[0]}` },
        { id: '3', text: 'Refine my India preferences' },
        { id: '4', text: 'Budget travel in India' }
      ]
    };
  }

  // Default response for unclear queries
  console.log('Using default response');
  return {
    message: "🙏 **Namaste! Welcome to Incredible India!** 🇮🇳\n\nI'm your personal India travel assistant with comprehensive knowledge of:\n\n🏛️ **28 States & 8 Union Territories** - From Kashmir to Kanyakumari\n🌟 **1000+ Destinations** - Popular & offbeat places\n🎯 **Personalized Recommendations** - Based on your preferences\n🌤️ **Real-time Weather** - For planning your trips\n💰 **Budget Options** - Backpacker to luxury experiences\n🍛 **Local Insights** - Food, culture, and traditions\n\n**Popular Categories:**\n• Historical & Cultural sites\n• Adventure & Trekking\n• Beaches & Backwaters\n• Spiritual & Wellness\n• Wildlife & Nature\n• Food & Festivals\n\nWhat aspect of Incredible India would you like to explore today?",
    suggestions: [
      { id: '1', text: 'Popular Indian destinations' },
      { id: '2', text: 'India travel tips' },
      { id: '3', text: 'Golden Triangle tour' },
      { id: '4', text: 'Kerala backwaters' }
    ],
  };
};
