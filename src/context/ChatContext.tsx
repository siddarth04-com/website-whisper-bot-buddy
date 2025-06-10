
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type MessageType = {
  id: string;
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
};

export type SuggestedReplyType = {
  id: string;
  text: string;
};

export type WeatherData = {
  city: string;
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
};

export type TravelPreferences = {
  genre?: string; // cultural, adventure, relaxation, etc.
  budget?: 'low' | 'medium' | 'high' | 'luxury' | string;
  style?: string; // solo, family, couple, etc.
  interests?: string[];
  duration?: string;
  season?: string;
};

type ChatContextType = {
  isOpen: boolean;
  messages: MessageType[];
  suggestedReplies: SuggestedReplyType[];
  toggleChat: () => void;
  sendMessage: (content: string) => void;
  closeChat: () => void;
  weatherData: WeatherData | null;
  travelPreferences: TravelPreferences;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

type Props = {
  children: ReactNode;
};

// Use a free API key here - this is a demo API key for OpenWeatherMap
// In a production environment, this should be stored securely
const WEATHER_API_KEY = "4d8fb5b93d4af21d66a2948710284366"; 

export const ChatProvider: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: 'Hi there! 👋 I\'m your travel assistant. How can I help with your travel plans today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [suggestedReplies, setSuggestedReplies] = useState<SuggestedReplyType[]>([
    { id: '1', text: 'Popular destinations' },
    { id: '2', text: 'Travel packages' },
    { id: '3', text: 'Travel tips' },
  ]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [travelPreferences, setTravelPreferences] = useState<TravelPreferences>({});

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const fetchWeatherData = async (city: string): Promise<WeatherData | null> => {
    try {
      console.log('Fetching weather data for:', city);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
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

  // Get travel recommendations based on genre
  const getTravelRecommendationsByGenre = (genre: string): string[] => {
    const genreMap: Record<string, string[]> = {
      'cultural': ['Rome, Italy', 'Kyoto, Japan', 'Istanbul, Turkey', 'Athens, Greece', 'Cairo, Egypt'],
      'adventure': ['Queenstown, New Zealand', 'Costa Rica', 'Swiss Alps', 'Moab, Utah', 'Patagonia, Argentina'],
      'relaxation': ['Maldives', 'Bali, Indonesia', 'Santorini, Greece', 'Tulum, Mexico', 'Fiji'],
      'food': ['Lyon, France', 'Tokyo, Japan', 'Bangkok, Thailand', 'Bologna, Italy', 'San Sebastian, Spain'],
      'history': ['Petra, Jordan', 'Machu Picchu, Peru', 'Rome, Italy', 'Cairo, Egypt', 'Angkor Wat, Cambodia'],
      'nature': ['Banff, Canada', 'Fiordland, New Zealand', 'Serengeti, Tanzania', 'Yosemite, USA', 'Amazon Rainforest, Brazil'],
      'nightlife': ['Berlin, Germany', 'Bangkok, Thailand', 'Barcelona, Spain', 'Las Vegas, USA', 'Ibiza, Spain'],
      'beach': ['Maldives', 'Seychelles', 'Amalfi Coast, Italy', 'Phi Phi Islands, Thailand', 'Maui, Hawaii'],
      'city': ['Tokyo, Japan', 'New York, USA', 'London, UK', 'Paris, France', 'Singapore']
    };
    
    const normalizedGenre = genre.toLowerCase();
    for (const key in genreMap) {
      if (normalizedGenre.includes(key)) {
        return genreMap[key];
      }
    }
    
    return ['Paris, France', 'Tokyo, Japan', 'New York, USA', 'Barcelona, Spain', 'Sydney, Australia'];
  };
  
  // Get travel recommendations based on budget
  const getTravelRecommendationsByBudget = (budget: string): string[] => {
    const budgetMap: Record<string, string[]> = {
      'low': ['Bangkok, Thailand', 'Hanoi, Vietnam', 'Budapest, Hungary', 'Mexico City, Mexico', 'Lisbon, Portugal'],
      'medium': ['Barcelona, Spain', 'Prague, Czech Republic', 'Istanbul, Turkey', 'Bali, Indonesia', 'Montreal, Canada'],
      'high': ['London, UK', 'Sydney, Australia', 'Reykjavik, Iceland', 'New York, USA', 'Tokyo, Japan'],
      'luxury': ['Maldives', 'French Riviera', 'Santorini, Greece', 'Dubai, UAE', 'Swiss Alps']
    };
    
    const normalizedBudget = budget.toLowerCase();
    for (const key in budgetMap) {
      if (normalizedBudget.includes(key)) {
        return budgetMap[key];
      }
    }
    
    return ['Paris, France', 'Barcelona, Spain', 'Thailand', 'Portugal', 'Mexico'];
  };
  
  // Get travel recommendations based on trip style
  const getTravelRecommendationsByStyle = (style: string): string[] => {
    const styleMap: Record<string, string[]> = {
      'solo': ['Lisbon, Portugal', 'Bangkok, Thailand', 'Tokyo, Japan', 'Berlin, Germany', 'Melbourne, Australia'],
      'couple': ['Santorini, Greece', 'Paris, France', 'Kyoto, Japan', 'Amalfi Coast, Italy', 'Maldives'],
      'family': ['Orlando, USA', 'Copenhagen, Denmark', 'London, UK', 'San Diego, USA', 'Singapore'],
      'friends': ['Barcelona, Spain', 'Amsterdam, Netherlands', 'Las Vegas, USA', 'Phuket, Thailand', 'Ibiza, Spain'],
      'luxury': ['Monaco', 'Maldives', 'Dubai, UAE', 'St. Barts', 'Lake Como, Italy']
    };
    
    const normalizedStyle = style.toLowerCase();
    for (const key in styleMap) {
      if (normalizedStyle.includes(key)) {
        return styleMap[key];
      }
    }
    
    return ['Rome, Italy', 'Bali, Indonesia', 'London, UK', 'Bangkok, Thailand', 'Barcelona, Spain'];
  };
  
  // Update preferences based on user input
  const updateTravelPreferences = (userMessage: string) => {
    console.log('Updating travel preferences for message:', userMessage);
    const lowerMsg = userMessage.toLowerCase();
    
    // Check for genre/interests
    const genrePatterns = [
      { regex: /\b(cultur|museum|histor|heritage)\w*\b/i, value: 'cultural' },
      { regex: /\b(adventure|hiking|trek|thrilling|exciting)\w*\b/i, value: 'adventure' },
      { regex: /\b(relax|calm|peaceful|spa|restful|beach)\w*\b/i, value: 'relaxation' },
      { regex: /\b(food|cuisine|gastronom|culinary|eat)\w*\b/i, value: 'food' },
      { regex: /\b(nature|wildlife|outdoors|landscape|scenic)\w*\b/i, value: 'nature' },
      { regex: /\b(party|nightlife|club|bar|nightclub)\w*\b/i, value: 'nightlife' },
      { regex: /\b(beach|ocean|sea|coast|marine)\w*\b/i, value: 'beach' },
      { regex: /\b(urban|city|cities|metropolitan|cityscape)\w*\b/i, value: 'city' }
    ];
    
    for (const pattern of genrePatterns) {
      if (pattern.regex.test(lowerMsg)) {
        console.log('Detected genre:', pattern.value);
        setTravelPreferences(prev => ({ ...prev, genre: pattern.value }));
        break;
      }
    }
    
    // Check for budget
    const budgetPatterns = [
      { regex: /\b(cheap|budget|affordable|inexpensive|low cost|low budget)\w*\b/i, value: 'low' },
      { regex: /\b(moderate|reasonable|medium budget|mid-range)\w*\b/i, value: 'medium' },
      { regex: /\b(expensive|high budget|premium|high-end)\w*\b/i, value: 'high' },
      { regex: /\b(luxury|luxurious|exclusive|deluxe|extravagant)\w*\b/i, value: 'luxury' }
    ];
    
    for (const pattern of budgetPatterns) {
      if (pattern.regex.test(lowerMsg)) {
        console.log('Detected budget:', pattern.value);
        setTravelPreferences(prev => ({ ...prev, budget: pattern.value }));
        break;
      }
    }
    
    // Check for trip style
    const stylePatterns = [
      { regex: /\b(solo|alone|by myself)\w*\b/i, value: 'solo' },
      { regex: /\b(couple|romantic|honeymoon|anniversary)\w*\b/i, value: 'couple' },
      { regex: /\b(family|kids|children|family-friendly)\w*\b/i, value: 'family' },
      { regex: /\b(friends|group|party|bachelor|bachelorette)\w*\b/i, value: 'friends' }
    ];
    
    for (const pattern of stylePatterns) {
      if (pattern.regex.test(lowerMsg)) {
        console.log('Detected style:', pattern.value);
        setTravelPreferences(prev => ({ ...prev, style: pattern.value }));
        break;
      }
    }
  };

  const getDestinationRecommendations = () => {
    console.log('Getting destination recommendations with preferences:', travelPreferences);
    let recommendations: string[] = [];
    const { genre, budget, style } = travelPreferences;
    
    if (genre) {
      recommendations = recommendations.concat(getTravelRecommendationsByGenre(genre));
    }
    
    if (budget) {
      recommendations = recommendations.concat(getTravelRecommendationsByBudget(budget));
    }
    
    if (style) {
      recommendations = recommendations.concat(getTravelRecommendationsByStyle(style));
    }
    
    // If we have multiple criteria, try to find places that match all
    if (recommendations.length > 0) {
      // Count occurrences to find matches across multiple criteria
      const destinationCounts: Record<string, number> = {};
      recommendations.forEach(place => {
        destinationCounts[place] = (destinationCounts[place] || 0) + 1;
      });
      
      // Sort by count (higher first) and then take top 5
      recommendations = Object.keys(destinationCounts)
        .sort((a, b) => destinationCounts[b] - destinationCounts[a])
        .slice(0, 5);
    } else {
      // Default recommendations if no preferences detected
      recommendations = [
        'Paris, France',
        'Tokyo, Japan',
        'Barcelona, Spain',
        'New York, USA',
        'Bali, Indonesia'
      ];
    }
    
    console.log('Final recommendations:', recommendations);
    return recommendations;
  };

  const generateBotResponse = async (userMessage: string): Promise<{ message: string; suggestions: SuggestedReplyType[] }> => {
    console.log('Generating bot response for:', userMessage);
    const lowerCaseMsg = userMessage.toLowerCase().trim();
    
    // Update travel preferences based on the message
    updateTravelPreferences(userMessage);
    
    // Handle specific input messages - exact matching first
    if (lowerCaseMsg === 'popular destinations') {
      console.log('Handling popular destinations request');
      return {
        message: "Here are some of the most popular travel destinations right now:\n\n" +
                "🗼 **Paris, France** - The City of Light with iconic landmarks like the Eiffel Tower and Louvre\n" +
                "🏯 **Tokyo, Japan** - Where ultramodern meets traditional culture\n" +
                "🏖️ **Bali, Indonesia** - Beautiful beaches and spiritual retreats\n" +
                "🏛️ **Barcelona, Spain** - Stunning architecture and vibrant Mediterranean culture\n" +
                "🗽 **New York, USA** - The city that never sleeps\n\n" +
                "Which destination interests you most? I can provide detailed information about any of these places!",
        suggestions: [
          { id: '1', text: 'Tell me about Paris' },
          { id: '2', text: 'Tell me about Tokyo' },
          { id: '3', text: 'Tell me about Bali' },
          { id: '4', text: 'Show me budget options' }
        ]
      };
    }
    
    // Handle "Travel packages" suggestion
    if (lowerCaseMsg === 'travel packages') {
      console.log('Handling travel packages request');
      return {
        message: 'I can help you find the perfect travel package! What type of experience are you looking for?',
        suggestions: [
          { id: '1', text: 'Beach vacations' },
          { id: '2', text: 'City breaks' },
          { id: '3', text: 'Adventure tours' },
          { id: '4', text: 'Cultural experiences' }
        ],
      };
    }
    
    // Handle "Travel tips" suggestion
    if (lowerCaseMsg === 'travel tips') {
      console.log('Handling travel tips request');
      return {
        message: 'Here are some essential travel tips to make your trip amazing:\n\n' +
                '✈️ **Planning Tips:**\n' +
                '• Book flights 6-8 weeks in advance for best rates\n' +
                '• Get travel insurance for peace of mind\n' +
                '• Check visa requirements early\n\n' +
                '🎒 **Packing Smart:**\n' +
                '• Pack light - you can always buy what you need\n' +
                '• Bring copies of important documents\n' +
                '• Pack essentials in carry-on\n\n' +
                'What specific aspect of travel would you like more tips about?',
        suggestions: [
          { id: '1', text: 'Packing tips' },
          { id: '2', text: 'Safety advice' },
          { id: '3', text: 'Budget travel tips' },
          { id: '4', text: 'Local culture tips' }
        ],
      };
    }

    // Handle more specific suggestion responses
    if (lowerCaseMsg === 'cultural experiences' || lowerCaseMsg === 'cultural destinations') {
      console.log('Handling cultural experiences request');
      const culturalPlaces = getTravelRecommendationsByGenre('cultural');
      return {
        message: `Here are some incredible cultural destinations:\n\n🏛️ **${culturalPlaces[0]}** - Ancient ruins and Renaissance masterpieces\n🏯 **${culturalPlaces[1]}** - Traditional temples and zen gardens\n🕌 **${culturalPlaces[2]}** - Where East meets West with Byzantine heritage\n🏺 **${culturalPlaces[3]}** - Birthplace of democracy and philosophy\n🔺 **${culturalPlaces[4]}** - Home to ancient pyramids and pharaohs\n\nWhich cultural destination would you like to explore?`,
        suggestions: [
          { id: '1', text: `Tell me about ${culturalPlaces[0]}` },
          { id: '2', text: `Tell me about ${culturalPlaces[1]}` },
          { id: '3', text: 'Budget cultural trips' },
          { id: '4', text: 'Cultural travel tips' }
        ]
      };
    }

    if (lowerCaseMsg === 'budget-friendly options' || lowerCaseMsg === 'show me budget options') {
      console.log('Handling budget-friendly options request');
      const budgetPlaces = getTravelRecommendationsByBudget('low');
      return {
        message: `Here are excellent budget-friendly destinations:\n\n🍜 **${budgetPlaces[0]}** - Amazing street food and affordable luxury\n🏮 **${budgetPlaces[1]}** - Rich culture at unbeatable prices\n🏰 **${budgetPlaces[2]}** - European charm without the high costs\n🌮 **${budgetPlaces[3]}** - Vibrant culture and delicious cuisine\n🏘️ **${budgetPlaces[4]}** - Beautiful coastline and great value\n\nWould you like specific budget tips for any destination?`,
        suggestions: [
          { id: '1', text: `Budget guide for ${budgetPlaces[0]}` },
          { id: '2', text: 'Money-saving travel tips' },
          { id: '3', text: 'Affordable accommodations' },
          { id: '4', text: 'Cheap flight tips' }
        ]
      };
    }

    if (lowerCaseMsg === 'family vacation ideas') {
      console.log('Handling family vacation ideas request');
      const familyPlaces = getTravelRecommendationsByStyle('family');
      return {
        message: `Perfect family-friendly destinations:\n\n🎢 **${familyPlaces[0]}** - Theme parks and magical experiences\n🧸 **${familyPlaces[1]}** - Safe, clean, and kid-friendly attractions\n🎭 **${familyPlaces[2]}** - Museums and history come alive\n🌊 **${familyPlaces[3]}** - Beautiful beaches and family activities\n🎡 **${familyPlaces[4]}** - Modern city with amazing family attractions\n\nWhat type of family experience are you looking for?`,
        suggestions: [
          { id: '1', text: 'Beach family vacation' },
          { id: '2', text: 'Educational travel with kids' },
          { id: '3', text: 'Theme park holidays' },
          { id: '4', text: 'Adventure for families' }
        ]
      };
    }
    
    // Handle weather queries
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
            { id: '4', text: 'Show similar destinations' },
          ],
        };
      } else {
        return {
          message: `I couldn't find weather information for "${city}". Please check the city name and try again.`,
          suggestions: [
            { id: '1', text: 'Weather in Paris' },
            { id: '2', text: 'Weather in Tokyo' },
            { id: '3', text: 'Weather in New York' },
            { id: '4', text: 'Popular destinations' },
          ],
        };
      }
    }
    
    // Handle "Tell me about X" for destinations
    const tellMeAboutRegex = /tell me about\s+([a-zA-Z\s,]+)/i;
    const tellMeAboutMatch = userMessage.match(tellMeAboutRegex);

    if (tellMeAboutMatch && tellMeAboutMatch[1]) {
      console.log('Handling tell me about request for:', tellMeAboutMatch[1]);
      const destination = tellMeAboutMatch[1].trim();
      
      // Destination information database
      const destinationInfo: Record<string, { info: string; highlights: string[] }> = {
        'paris': {
          info: 'Paris, the capital of France, is known for iconic landmarks like the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral. The city offers world-class dining, art, and fashion experiences.',
          highlights: ['Eiffel Tower', 'Louvre Museum', 'Champs-Élysées', 'Montmartre', 'Seine River cruises']
        },
        'tokyo': {
          info: 'Tokyo is Japan\'s vibrant capital mixing ultramodern and traditional aspects. Visit the Meiji Shrine, Imperial Palace, and experience incredible food culture.',
          highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Skytree', 'Tsukiji Market', 'Harajuku district']
        },
        'barcelona': {
          info: 'Barcelona, Spain\'s cosmopolitan capital, is defined by Antoni Gaudí\'s whimsical architecture and vibrant Mediterranean culture.',
          highlights: ['Sagrada Família', 'Park Güell', 'Las Ramblas', 'Gothic Quarter', 'Barceloneta Beach']
        },
        'bali': {
          info: 'Bali is an Indonesian island known for its volcanic mountains, iconic rice paddies, beaches, and coral reefs.',
          highlights: ['Uluwatu Temple', 'Rice terraces', 'Seminyak beaches', 'Ubud culture', 'Mount Batur sunrise']
        },
        'new york': {
          info: 'New York City comprises 5 boroughs where the Hudson River meets the Atlantic. Manhattan is among the world\'s major commercial and cultural centers.',
          highlights: ['Times Square', 'Central Park', 'Statue of Liberty', 'Brooklyn Bridge', 'Broadway shows']
        }
      };
      
      let info = '';
      let highlights: string[] = [];
      
      // Try to match the destination with our database
      for (const key in destinationInfo) {
        if (destination.toLowerCase().includes(key)) {
          info = destinationInfo[key].info;
          highlights = destinationInfo[key].highlights;
          break;
        }
      }
      
      if (info) {
        const highlightText = highlights.map(h => `• ${h}`).join('\n');
        return {
          message: `**${destination}** 🌟\n\n${info}\n\n**Top Highlights:**\n${highlightText}\n\nWhat would you like to know more about?`,
          suggestions: [
            { id: '1', text: `Weather in ${destination}` },
            { id: '2', text: `Things to do in ${destination}` },
            { id: '3', text: `Best time to visit ${destination}` },
            { id: '4', text: 'Show me similar places' }
          ]
        };
      } else {
        return {
          message: `I'd love to help you learn about ${destination}! While I don't have specific details about that destination yet, I can help you with popular destinations and travel planning.`,
          suggestions: [
            { id: '1', text: 'Popular destinations' },
            { id: '2', text: 'Cultural experiences' },
            { id: '3', text: 'Budget-friendly options' },
            { id: '4', text: 'Travel tips' }
          ]
        };
      }
    }
    
    // Handle travel recommendations
    if (lowerCaseMsg.includes('recommend') || 
        lowerCaseMsg.includes('suggestion') || 
        lowerCaseMsg.includes('where should i go') || 
        lowerCaseMsg.includes('place to visit')) {
      
      console.log('Handling recommendation request');
      const recommendations = getDestinationRecommendations();
      const { genre, budget, style } = travelPreferences;
      
      let preferencesText = 'Based on popular choices';
      if (genre || budget || style) {
        preferencesText = 'Based on your preferences';
        if (genre) preferencesText += ` for ${genre} experiences`;
        if (budget) preferencesText += ` with a ${budget} budget`;
        if (style) preferencesText += ` and ${style} travel style`;
      }
      
      return {
        message: `${preferencesText}, here are my top recommendations:\n\n` + 
                 `🌟 **${recommendations[0]}**\n` +
                 `🌟 **${recommendations[1]}**\n` +
                 `🌟 **${recommendations[2]}**\n` +
                 `🌟 **${recommendations[3]}**\n` +
                 `🌟 **${recommendations[4]}**\n\n` +
                 `Which destination would you like to explore further?`,
        suggestions: [
          { id: '1', text: `Tell me about ${recommendations[0]}` },
          { id: '2', text: `Tell me about ${recommendations[1]}` },
          { id: '3', text: 'Refine my preferences' },
          { id: '4', text: 'Budget travel tips' }
        ]
      };
    }

    // Handle preference and interest queries
    if (lowerCaseMsg.includes('what are your travel preferences') || 
        lowerCaseMsg.includes('refine my preferences') ||
        lowerCaseMsg.includes('travel preferences') ||
        lowerCaseMsg.includes('type of trip')) {
      
      console.log('Handling travel preferences request');
      return {
        message: 'Let me help you find the perfect travel experience! What interests you most?',
        suggestions: [
          { id: '1', text: 'Cultural experiences' },
          { id: '2', text: 'Adventure activities' },
          { id: '3', text: 'Beach relaxation' },
          { id: '4', text: 'Food & culinary' }
        ]
      };
    }

    // Handle activity-based queries
    if (lowerCaseMsg.includes('things to do in')) {
      const cityMatch = userMessage.match(/things to do in\s+([a-zA-Z\s,]+)/i);
      if (cityMatch && cityMatch[1]) {
        const city = cityMatch[1].trim();
        console.log('Handling things to do request for:', city);
        return {
          message: `Here are top activities in ${city}:\n\n🏛️ **Explore landmarks** - Visit iconic sights and monuments\n🎨 **Cultural sites** - Museums, galleries, and historical places\n🍽️ **Local cuisine** - Try authentic restaurants and street food\n🛍️ **Shopping** - Local markets and unique boutiques\n🌃 **Nightlife** - Bars, clubs, and entertainment venues\n\nWhat type of activity interests you most?`,
          suggestions: [
            { id: '1', text: `Museums in ${city}` },
            { id: '2', text: `Restaurants in ${city}` },
            { id: '3', text: `Nightlife in ${city}` },
            { id: '4', text: `Weather in ${city}` }
          ]
        };
      }
    }

    // Handle "Best time to visit" queries
    if (lowerCaseMsg.includes('best time to visit')) {
      const cityMatch = userMessage.match(/best time to visit\s+([a-zA-Z\s,]+)/i);
      if (cityMatch && cityMatch[1]) {
        const city = cityMatch[1].trim();
        console.log('Handling best time to visit request for:', city);
        return {
          message: `**Best time to visit ${city}:**\n\n🌤️ **Spring (Apr-May)** - Pleasant weather, fewer crowds\n☀️ **Summer (Jun-Aug)** - Peak season, warm weather\n🍂 **Fall (Sep-Oct)** - Great weather, beautiful colors\n❄️ **Winter (Nov-Mar)** - Off-season, potential savings\n\nThe ideal time depends on your preferences for weather, crowds, and budget!`,
          suggestions: [
            { id: '1', text: `Weather in ${city}` },
            { id: '2', text: `${city} travel tips` },
            { id: '3', text: `Things to do in ${city}` },
            { id: '4', text: 'Seasonal travel advice' }
          ]
        };
      }
    }

    // Handle specific travel types
    if (lowerCaseMsg.includes('beach vacation') || lowerCaseMsg.includes('beach holiday')) {
      console.log('Handling beach vacation request');
      return {
        message: '🏖️ **Beach Paradise Awaits!**\n\nPerfect beach destinations for sun, sand, and relaxation:\n\n🏝️ **Tropical:** Maldives, Bali, Fiji\n🌊 **Mediterranean:** Amalfi Coast, Santorini, Costa del Sol\n🐚 **Exotic:** Seychelles, Mauritius, Cook Islands\n\nWhat type of beach experience appeals to you?',
        suggestions: [
          { id: '1', text: 'Tropical paradise' },
          { id: '2', text: 'Mediterranean beaches' },
          { id: '3', text: 'Family beach destinations' },
          { id: '4', text: 'Luxury beach resorts' }
        ],
      };
    }

    // Default response for unclear queries
    console.log('Using default response');
    return {
      message: "I'm here to help you plan the perfect trip! ✈️\n\nI can assist you with:\n• 🌍 **Destination recommendations** based on your interests\n• 🌤️ **Weather information** for any city\n• 💡 **Travel tips** and advice\n• 💰 **Budget-friendly options**\n• 🎯 **Activity suggestions**\n\nWhat would you like to explore?",
      suggestions: [
        { id: '1', text: 'Popular destinations' },
        { id: '2', text: 'Budget travel tips' },
        { id: '3', text: 'Cultural experiences' },
        { id: '4', text: 'Travel packages' }
      ],
    };
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    
    console.log('Sending message:', content);
    
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear suggested replies temporarily
    setSuggestedReplies([]);
    
    // Simulate bot thinking
    setTimeout(async () => {
      try {
        const { message, suggestions } = await generateBotResponse(content);
        
        console.log('Bot response generated:', message);
        console.log('New suggestions:', suggestions);
        
        // Add bot response
        const botMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          content: message,
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botMessage]);
        setSuggestedReplies(suggestions);
      } catch (error) {
        console.error('Error generating bot response:', error);
        
        // Fallback response in case of error
        const errorMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          content: "I apologize, but I'm having trouble processing your request right now. Please try asking about destinations, travel tips, or weather information!",
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, errorMessage]);
        setSuggestedReplies([
          { id: '1', text: 'Popular destinations' },
          { id: '2', text: 'Travel tips' },
          { id: '3', text: 'Budget options' },
        ]);
      }
    }, 1000);
  };

  const value = {
    isOpen,
    messages,
    suggestedReplies,
    toggleChat,
    sendMessage,
    closeChat,
    weatherData,
    travelPreferences,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
