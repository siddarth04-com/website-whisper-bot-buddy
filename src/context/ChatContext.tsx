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

// Replace this with your actual API key
const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; 

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
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      
      const data = await response.json();
      
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
        setTravelPreferences(prev => ({ ...prev, style: pattern.value }));
        break;
      }
    }
  };

  const getDestinationRecommendations = () => {
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
    
    return recommendations;
  };

  const generateBotResponse = async (userMessage: string): Promise<{ message: string; suggestions: SuggestedReplyType[] }> => {
    const lowerCaseMsg = userMessage.toLowerCase();
    
    // Update travel preferences based on the message
    updateTravelPreferences(userMessage);
    
    // Check for weather-related queries
    const weatherRegex = /weather\s+(?:in|at|for)?\s+([a-zA-Z\s]+)/i;
    const weatherMatch = userMessage.match(weatherRegex);
    
    if (lowerCaseMsg.includes('weather') && weatherMatch && weatherMatch[1]) {
      const city = weatherMatch[1].trim();
      const weather = await fetchWeatherData(city);
      
      if (weather) {
        setWeatherData(weather);
        return {
          message: `Currently in ${weather.city}, it's ${weather.temp.toFixed(1)}°C with ${weather.description}. The humidity is ${weather.humidity}% and wind speed is ${weather.windSpeed} m/s. Would you like more information about ${weather.city} for your travels?`,
          suggestions: [
            { id: '1', text: `Things to do in ${weather.city}` },
            { id: '2', text: `Best time to visit ${weather.city}` },
            { id: '3', text: `${weather.city} travel tips` },
          ],
        };
      } else {
        return {
          message: `I couldn't find weather information for "${city}". Could you please check the city name and try again?`,
          suggestions: [
            { id: '1', text: 'Weather in Paris' },
            { id: '2', text: 'Weather in Tokyo' },
            { id: '3', text: 'Weather in New York' },
          ],
        };
      }
    }
    
    // Handle requests for travel recommendations based on collected preferences
    if (lowerCaseMsg.includes('recommend') || 
        lowerCaseMsg.includes('suggestion') || 
        lowerCaseMsg.includes('where should i go') || 
        lowerCaseMsg.includes('place to visit')) {
      
      const recommendations = getDestinationRecommendations();
      const { genre, budget, style } = travelPreferences;
      let preferencesText = '';
      
      if (genre || budget || style) {
        preferencesText = 'Based on your preferences';
        if (genre) preferencesText += ` for ${genre} experiences`;
        if (budget) preferencesText += ` with a ${budget} budget`;
        if (style) preferencesText += ` and ${style} travel style`;
        preferencesText += ', ';
      }
      
      return {
        message: `${preferencesText}I recommend considering these destinations:\n\n` + 
                 `1. ${recommendations[0]}\n` +
                 `2. ${recommendations[1]}\n` +
                 `3. ${recommendations[2]}\n` +
                 `4. ${recommendations[3]}\n` +
                 `5. ${recommendations[4]}\n\n` +
                 `Would you like specific information about any of these places?`,
        suggestions: [
          { id: '1', text: `Tell me about ${recommendations[0]}` },
          { id: '2', text: `Tell me about ${recommendations[1]}` },
          { id: '3', text: 'Refine my preferences' }
        ]
      };
    }
    
    // Handle genre-specific queries
    if (lowerCaseMsg.includes('genre') || 
        lowerCaseMsg.includes('interest') || 
        lowerCaseMsg.includes('type of trip')) {
      
      return {
        message: 'What type of travel experience are you looking for? I can recommend destinations based on different interests:',
        suggestions: [
          { id: '1', text: 'Cultural experiences' },
          { id: '2', text: 'Adventure activities' },
          { id: '3', text: 'Relaxation' },
          { id: '4', text: 'Food & culinary' },
          { id: '5', text: 'Beaches & ocean' }
        ]
      };
    }
    
    // Handle budget-specific queries
    if (lowerCaseMsg.includes('budget') || 
        lowerCaseMsg.includes('cost') || 
        lowerCaseMsg.includes('price') ||
        lowerCaseMsg.includes('expensive') ||
        lowerCaseMsg.includes('cheap')) {
      
      return {
        message: 'I can suggest destinations that fit your budget. What kind of budget range are you considering for your trip?',
        suggestions: [
          { id: '1', text: 'Budget-friendly options' },
          { id: '2', text: 'Mid-range budget' },
          { id: '3', text: 'High-end travel' },
          { id: '4', text: 'Luxury experiences' }
        ]
      };
    }
    
    // Handle travel style queries
    if (lowerCaseMsg.includes('style') || 
        lowerCaseMsg.includes('travel with') || 
        lowerCaseMsg.includes('traveling with') ||
        lowerCaseMsg.includes('family trip') ||
        lowerCaseMsg.includes('solo trip') ||
        lowerCaseMsg.includes('romantic') ||
        lowerCaseMsg.includes('honeymoon')) {
      
      return {
        message: 'I can recommend destinations based on your travel style. Are you traveling:',
        suggestions: [
          { id: '1', text: 'Solo travel' },
          { id: '2', text: 'As a couple' },
          { id: '3', text: 'With family' },
          { id: '4', text: 'With friends' }
        ]
      };
    }
    
    // Process destination-specific queries
    const destinationRegex = /(?:about|visit|travel to|go to)\s+([a-zA-Z\s,]+?)(?:\s|\?|$)/i;
    const destinationMatch = userMessage.match(destinationRegex);
    
    if (destinationMatch && destinationMatch[1]) {
      const destination = destinationMatch[1].trim();
      
      // Destination information database (simplified)
      const destinationInfo: Record<string, string> = {
        'paris': 'Paris, the capital of France, is known for iconic landmarks like the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral. The city offers world-class dining, art, and fashion experiences. Best time to visit is April-June or September-October to avoid crowds. Budget: Mid to high. Popular for couples and cultural enthusiasts.',
        'tokyo': 'Tokyo is Japan\'s vibrant capital mixing ultramodern and traditional aspects. Visit the Meiji Shrine, Imperial Palace, and Shibuya Crossing. The city offers incredible food, from street vendors to Michelin-starred restaurants. Best time to visit is March-April for cherry blossoms or October-November for fall colors. Budget: Mid to high.',
        'barcelona': 'Barcelona, Spain\'s cosmopolitan capital of Catalonia, is defined by Antoni Gaudí\'s whimsical architecture, including the Sagrada Família. The city offers beautiful beaches, vibrant markets, and delicious tapas. Best time to visit is May-June or September-October. Budget: Medium. Great for friends, couples, and food lovers.',
        'new york': 'New York City comprises 5 boroughs where the Hudson River meets the Atlantic. At its core is Manhattan, a densely populated borough that\'s among the world\'s major commercial and cultural centers. Must-sees include the Empire State Building, Central Park, and Times Square. Best time to visit is April-June or September-November. Budget: High.',
        'bali': 'Bali is an Indonesian island known for its volcanic mountains, iconic rice paddies, beaches, and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple. To the south, the beachside city of Kuta has lively bars, while Seminyak offers luxury resorts and dining. Best time to visit is April-June or September-October. Budget: Low to medium.'
      };
      
      let info = 'I don\'t have specific information about that destination yet.';
      
      // Try to match the destination with our database
      for (const key in destinationInfo) {
        if (destination.toLowerCase().includes(key)) {
          info = destinationInfo[key];
          break;
        }
      }
      
      return {
        message: info + '\n\nWould you like to know more specific details?',
        suggestions: [
          { id: '1', text: `Weather in ${destination}` },
          { id: '2', text: `Things to do in ${destination}` },
          { id: '3', text: 'Show me similar places' }
        ]
      };
    }
    
    // Continue with existing cases
    if (lowerCaseMsg.includes('destination') || lowerCaseMsg.includes('place') || lowerCaseMsg.includes('country') || lowerCaseMsg.includes('city')) {
      return {
        message: 'We have guides for popular destinations across Europe, Asia, Americas, and Africa. Would you like recommendations for a specific region?',
        suggestions: [
          { id: '1', text: 'Europe destinations' },
          { id: '2', text: 'Asia destinations' },
          { id: '3', text: 'Americas destinations' },
        ],
      };
    } else if (lowerCaseMsg.includes('package') || lowerCaseMsg.includes('deal') || lowerCaseMsg.includes('offer')) {
      // ... keep existing code (package response functionality)
    } else if (lowerCaseMsg.includes('tip') || lowerCaseMsg.includes('advice') || lowerCaseMsg.includes('recommendation')) {
      // ... keep existing code (tip response functionality)
    } else if (lowerCaseMsg.includes('hotel') || lowerCaseMsg.includes('accommodation') || lowerCaseMsg.includes('stay')) {
      // ... keep existing code (hotel response functionality)
    } else if (lowerCaseMsg.includes('flight') || lowerCaseMsg.includes('airline') || lowerCaseMsg.includes('plane')) {
      // ... keep existing code (flight response functionality)
    } else if (lowerCaseMsg.includes('europe')) {
      return {
        message: 'Europe offers incredible diversity - from the romantic streets of Paris to the ancient ruins of Rome. Popular destinations include Italy, Spain, France, and Greece. Which European country interests you most?',
        suggestions: [
          { id: '1', text: 'Italy guide' },
          { id: '2', text: 'Spain guide' },
          { id: '3', text: 'France guide' },
        ],
      };
    } else if (lowerCaseMsg.includes('asia')) {
      return {
        message: 'Asia is a fascinating continent with diverse cultures and landscapes. Popular destinations include Japan, Thailand, Vietnam, and Indonesia. Would you like information on a specific Asian country?',
        suggestions: [
          { id: '1', text: 'Japan guide' },
          { id: '2', text: 'Thailand guide' },
          { id: '3', text: 'Vietnam guide' },
        ],
      };
    }
    
    // Default response
    return {
      message: "I can help you plan your perfect trip! Tell me what kind of travel experience you're looking for - are you interested in cultural exploration, adventure activities, relaxation, or something else? I can also suggest destinations based on your budget and travel style, or check the weather for any city.",
      suggestions: [
        { id: '1', text: 'Cultural destinations' },
        { id: '2', text: 'Budget-friendly options' },
        { id: '3', text: 'Family vacation ideas' },
      ],
    };
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Simulate bot thinking
    setTimeout(async () => {
      const { message, suggestions } = await generateBotResponse(content);
      
      // Add bot response
      const botMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: message,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setSuggestedReplies(suggestions);
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
