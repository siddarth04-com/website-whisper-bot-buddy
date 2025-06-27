import { SuggestedReplyType, TravelPreferences, WeatherData, MessageType } from './types';
import { fetchWeatherData } from './weatherUtils';
import { getDestinationRecommendations, getDestinationDetails, getDestinationsByState } from './travelUtils';
import { generateDynamicResponse } from './enhancedBotUtils';
import { searchFlights, searchHotels, formatFlightResults, formatHotelResults } from './flightHotelUtils';
import { formatMapResponse, generateRouteInfo } from './mapUtils';
import { getCurrentTravelAlerts, getLiveUpdates, formatTravelAlerts, formatLiveUpdates } from './liveUpdatesUtils';
import { generateDynamicItinerary, formatDynamicItinerary } from './dynamicItineraryUtils';
import { generateClaudeItinerary } from './claudeItineraryUtils';

export const generateBotResponse = async (
  userMessage: string,
  travelPreferences: TravelPreferences,
  setWeatherData: (data: WeatherData | null) => void,
  conversationHistory: string[] = []
): Promise<{ message: string; suggestions: SuggestedReplyType[] }> => {
  console.log('Generating enhanced bot response for:', userMessage);
  console.log('Conversation history:', conversationHistory);
  
  const lowerCaseMsg = userMessage.toLowerCase().trim();
  
  // Handle itinerary generation requests with dynamic generation
  if (lowerCaseMsg.includes('itinerary') || 
      lowerCaseMsg.includes('plan my trip') || 
      lowerCaseMsg.includes('create a plan') ||
      lowerCaseMsg.includes('travel plan') ||
      (lowerCaseMsg.includes('plan') && (lowerCaseMsg.includes('day') || lowerCaseMsg.includes('week'))) ||
      lowerCaseMsg.includes('schedule') ||
      lowerCaseMsg.includes('custom trip')) {
    
    console.log('Handling dynamic itinerary generation request');
    
    try {
      // First try Claude AI for advanced generation
      const claudeItinerary = await generateClaudeItinerary(userMessage, travelPreferences, conversationHistory);
      
      return {
        message: claudeItinerary,
        suggestions: [
          { id: '1', text: 'Modify this itinerary' },
          { id: '2', text: 'Add more destinations' },
          { id: '3', text: 'Adjust the budget' },
          { id: '4', text: 'Change duration' }
        ]
      };
    } catch (claudeError) {
      console.error('Claude itinerary generation error:', claudeError);
      
      // Fallback to dynamic local generation
      try {
        console.log('Falling back to dynamic local generation');
        const dynamicItinerary = generateDynamicItinerary(userMessage, travelPreferences, conversationHistory);
        const formattedItinerary = formatDynamicItinerary(dynamicItinerary);
        
        return {
          message: formattedItinerary,
          suggestions: [
            { id: '1', text: 'Adjust this itinerary' },
            { id: '2', text: 'Change destinations' },
            { id: '3', text: 'Modify budget level' },
            { id: '4', text: 'Add specific activities' }
          ]
        };
      } catch (dynamicError) {
        console.error('Dynamic itinerary generation error:', dynamicError);
        
        return {
          message: `🗓️ **DYNAMIC ITINERARY PLANNER**\n\nI'll create a personalized itinerary based on your specific needs! To generate the most relevant plan, please provide:\n\n📍 **Destinations:** Which cities/regions would you like to visit?\n📅 **Duration:** How many days do you have?\n🎯 **Interests:** What experiences are you seeking?\n💰 **Budget:** What's your comfortable spending range?\n👥 **Travel Style:** Solo, couple, family, or friends?\n🌡️ **Season:** When are you planning to travel?\n\n**The more specific you are, the better I can personalize your itinerary!**\n\n**Example:** "Create a 10-day cultural and food tour of North India for a couple with a medium budget, traveling in winter, must include Delhi, Agra, and Jaipur"`,
          suggestions: [
            { id: '1', text: 'Create 7-day Golden Triangle adventure' },
            { id: '2', text: '10-day Kerala nature and wellness trip' },
            { id: '3', text: '5-day Goa beach relaxation' },
            { id: '4', text: '2-week Rajasthan heritage exploration' }
          ]
        };
      }
    }
  }

  // Use enhanced dynamic responses for other queries with conversation history
  if (conversationHistory.length > 0) {
    try {
      const dynamicResponse = await generateDynamicResponse(userMessage, conversationHistory, travelPreferences);
      if (dynamicResponse) {
        return dynamicResponse;
      }
    } catch (error) {
      console.error('Dynamic response error:', error);
    }
  }

  // Handle flight price searches
  if (lowerCaseMsg.includes('flight') && (lowerCaseMsg.includes('price') || lowerCaseMsg.includes('search') || lowerCaseMsg.includes('check'))) {
    console.log('Handling flight search request');
    
    const flightRegex = /(?:from|flight)\s+([a-zA-Z\s]+)\s+(?:to|→)\s+([a-zA-Z\s]+)|flight.*?(?:to|in)\s+([a-zA-Z\s]+)/i;
    const match = userMessage.match(flightRegex);
    
    if (match) {
      const origin = match[1]?.trim() || 'Delhi';
      const destination = match[2] || match[3]?.trim() || 'Mumbai';
      
      try {
        const flights = await searchFlights(origin, destination, new Date().toISOString().split('T')[0]);
        const flightResults = formatFlightResults(flights);
        
        return {
          message: flightResults,
          suggestions: [
            { id: '1', text: 'Compare airlines' },
            { id: '2', text: 'Check hotels in ' + destination },
            { id: '3', text: 'Route planning to ' + destination },
            { id: '4', text: 'Travel alerts for ' + destination }
          ]
        };
      } catch (error) {
        console.error('Flight search error:', error);
      }
    }
    
    return {
      message: `✈️ **FLIGHT SEARCH**\n\nI can help you find the best flight deals in India! Please specify:\n\n📍 **From which city?** (Delhi, Mumbai, Bangalore, etc.)\n📍 **To which destination?**\n📅 **Travel dates?**\n\nExample: "Flight from Delhi to Goa on December 25th"\n\n🎯 **Popular routes I can search:**\n• Delhi ↔ Mumbai, Bangalore, Chennai\n• Mumbai ↔ Goa, Hyderabad, Kolkata\n• Bangalore ↔ Chennai, Kochi, Pune`,
      suggestions: [
        { id: '1', text: 'Flight from Delhi to Mumbai' },
        { id: '2', text: 'Flight to Goa' },
        { id: '3', text: 'Bangalore to Chennai flight' },
        { id: '4', text: 'Best time to book flights' }
      ]
    };
  }
  
  // Handle hotel searches
  if (lowerCaseMsg.includes('hotel') && (lowerCaseMsg.includes('search') || lowerCaseMsg.includes('find') || lowerCaseMsg.includes('book') || lowerCaseMsg.includes('price'))) {
    console.log('Handling hotel search request');
    
    const hotelRegex = /hotel.*?(?:in|at)\s+([a-zA-Z\s]+)/i;
    const match = userMessage.match(hotelRegex);
    
    if (match) {
      const location = match[1].trim();
      
      try {
        const hotels = await searchHotels(location, new Date().toISOString().split('T')[0], 
          new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]);
        const hotelResults = formatHotelResults(hotels);
        
        return {
          message: hotelResults,
          suggestions: [
            { id: '1', text: 'Budget hotels in ' + location },
            { id: '2', text: 'Luxury hotels in ' + location },
            { id: '3', text: 'Hotel booking tips' },
            { id: '4', text: 'Things to do in ' + location }
          ]
        };
      } catch (error) {
        console.error('Hotel search error:', error);
      }
    }
    
    return {
      message: `🏨 **HOTEL SEARCH**\n\nI can find the best hotels across India for you!\n\n📝 **Please specify:**\n• 📍 Which city/destination?\n• 📅 Check-in date?\n• 📅 Check-out date?\n• 👥 Number of guests?\n\nExample: "Hotels in Jaipur for 2 guests"\n\n🏆 **I search across all categories:**\n• 💰 Budget stays (₹1000-3000/night)\n• 🏨 Mid-range hotels (₹3000-8000/night)\n• 🌟 Luxury resorts (₹8000+/night)\n• 🏛️ Heritage properties\n• 🏠 Homestays & guesthouses`,
      suggestions: [
        { id: '1', text: 'Hotels in Jaipur' },
        { id: '2', text: 'Budget hotels in Goa' },
        { id: '3', text: 'Luxury hotels in Kerala' },
        { id: '4', text: 'Heritage hotels in Rajasthan' }
      ]
    };
  }
  
  // Handle map and route requests
  if (lowerCaseMsg.includes('map') || lowerCaseMsg.includes('show me') || lowerCaseMsg.includes('route') || lowerCaseMsg.includes('direction')) {
    console.log('Handling map/route request');
    
    const cityRegex = /(?:map|show|route).*?(?:of|to|in)\s+([a-zA-Z\s]+)/i;
    const match = userMessage.match(cityRegex);
    
    if (match) {
      const city = match[1].trim();
      const mapResponse = formatMapResponse(city);
      
      return {
        message: mapResponse,
        suggestions: [
          { id: '1', text: `Route to ${city}` },
          { id: '2', text: `Transportation in ${city}` },
          { id: '3', text: `Tourist attractions ${city}` },
          { id: '4', text: `Hotels near ${city}` }
        ]
      };
    }
    
    return {
      message: `🗺️ **INTERACTIVE MAP FEATURES**\n\nI can provide detailed maps and navigation for any Indian destination!\n\n🎯 **What I can show you:**\n• 📍 Exact coordinates of cities & attractions\n• 🎪 Nearby tourist spots with ratings\n• 🛣️ Route planning between destinations\n• 🚗 Distance & travel time estimates\n• 🚌 Transportation options\n\n💡 **Try asking:**\n• "Show me map of Delhi"\n• "Route from Mumbai to Goa"\n• "Attractions near Jaipur"\n• "How to reach Taj Mahal from Delhi"`,
      suggestions: [
        { id: '1', text: 'Show me map of Delhi' },
        { id: '2', text: 'Route from Mumbai to Goa' },
        { id: '3', text: 'Map of Rajasthan attractions' },
        { id: '4', text: 'Navigation tips for India' }
      ]
    };
  }
  
  // Handle live updates and travel alerts
  if (lowerCaseMsg.includes('update') || lowerCaseMsg.includes('alert') || lowerCaseMsg.includes('current') || lowerCaseMsg.includes('live') || lowerCaseMsg.includes('condition')) {
    console.log('Handling live updates request');
    
    try {
      const destinations = extractDestinations(userMessage, travelPreferences);
      const [alerts, updates] = await Promise.all([
        getCurrentTravelAlerts(destinations),
        getLiveUpdates()
      ]);
      
      const alertsText = formatTravelAlerts(alerts);
      const updatesText = formatLiveUpdates(updates);
      
      return {
        message: `${alertsText}\n\n${updatesText}`,
        suggestions: [
          { id: '1', text: 'Weather updates' },
          { id: '2', text: 'Transport status' },
          { id: '3', text: 'Safety advisories' },
          { id: '4', text: 'Festival calendar' }
        ]
      };
    } catch (error) {
      console.error('Live updates error:', error);
    }
    
    return {
      message: `📡 **LIVE TRAVEL UPDATES**\n\nI provide real-time information to make your India travel smooth!\n\n🔄 **Live Information:**\n• 🌤️ Weather conditions & forecasts\n• ✈️ Flight delays & airport status\n• 🚂 Train schedules & platform changes\n• 🛣️ Road conditions & traffic updates\n• 🎉 Festival dates & crowd expectations\n• ⚠️ Safety advisories & travel alerts\n\n💡 **Ask for specific updates:**\n• "Current conditions in Delhi"\n• "Travel alerts for my trip"\n• "Live weather in Goa"\n• "Transport updates Mumbai"`,
      suggestions: [
        { id: '1', text: 'Current travel conditions' },
        { id: '2', text: 'Weather alerts India' },
        { id: '3', text: 'Airport status updates' },
        { id: '4', text: 'Road conditions check' }
      ]
    };
  }
  
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
  console.log('Using enhanced default response with conversation awareness');
  const contextualGreeting = conversationHistory.length > 0 
    ? "Thanks for continuing our conversation! " 
    : "🙏 **Namaste! Welcome to Your Enhanced India Travel Assistant!** 🇮🇳\n\n";
    
  return {
    message: `${contextualGreeting}I'm now equipped with advanced AI features to make your India travel planning seamless:\n\n🗓️ **Dynamic Itineraries** - Personalized day-by-day travel plans based on your exact preferences\n✈️ **Real-time Flight Prices** - Compare airlines instantly\n🏨 **Hotel Search** - Find perfect stays within budget\n🗺️ **Interactive Maps** - Routes, attractions & navigation\n📡 **Live Updates** - Weather, transport & travel alerts\n🎯 **Smart Recommendations** - Personalized based on your style\n🌤️ **Weather Forecasts** - Plan with current conditions\n\n**Try these enhanced features:**\n• \"Create a personalized 7-day itinerary for Golden Triangle\"\n• \"Plan a 10-day Kerala adventure for couples\"\n• \"Flight prices from Delhi to Goa\"\n• \"Hotels in Jaipur under ₹3000\"\n\nWhat would you like to explore first?`,
    suggestions: [
      { id: '1', text: 'Create personalized itinerary' },
      { id: '2', text: 'Check flight prices to India' },
      { id: '3', text: 'Find hotels in my destination' },
      { id: '4', text: 'Popular Indian destinations' }
    ],
  };
};

// Helper function to extract destinations from user message
const extractDestinations = (message: string, preferences: TravelPreferences): string[] => {
  const destinations: string[] = [];
  const cities = ['delhi', 'mumbai', 'bangalore', 'kolkata', 'chennai', 'jaipur', 'agra', 'goa', 'kerala'];
  
  cities.forEach(city => {
    if (message.toLowerCase().includes(city)) {
      destinations.push(city);
    }
  });
  
  // If no specific destinations mentioned, use preferences or defaults
  if (destinations.length === 0) {
    destinations.push('delhi', 'mumbai'); // Default major cities
  }
  
  return destinations;
};
