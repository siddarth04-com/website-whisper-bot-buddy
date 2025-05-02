
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

type ChatContextType = {
  isOpen: boolean;
  messages: MessageType[];
  suggestedReplies: SuggestedReplyType[];
  toggleChat: () => void;
  sendMessage: (content: string) => void;
  closeChat: () => void;
  weatherData: WeatherData | null;
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

  const generateBotResponse = async (userMessage: string): Promise<{ message: string; suggestions: SuggestedReplyType[] }> => {
    const lowerCaseMsg = userMessage.toLowerCase();
    
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
    
    // Travel-focused response logic
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
      return {
        message: 'Our current travel packages include all-inclusive resort stays, adventure tours, and city exploration packages. Which type interests you?',
        suggestions: [
          { id: '1', text: 'Resort packages' },
          { id: '2', text: 'Adventure tours' },
          { id: '3', text: 'City exploration' },
        ],
      };
    } else if (lowerCaseMsg.includes('tip') || lowerCaseMsg.includes('advice') || lowerCaseMsg.includes('recommendation')) {
      return {
        message: 'Here are some general travel tips: always check visa requirements, pack essentials in your carry-on, and notify your bank about your travel plans. Would you like specific tips for a certain destination?',
        suggestions: [
          { id: '1', text: 'Packing tips' },
          { id: '2', text: 'Safety advice' },
          { id: '3', text: 'Budget travel tips' },
        ],
      };
    } else if (lowerCaseMsg.includes('hotel') || lowerCaseMsg.includes('accommodation') || lowerCaseMsg.includes('stay')) {
      return {
        message: 'We have partnerships with hotels, hostels, and vacation rentals worldwide. What type of accommodation are you looking for?',
        suggestions: [
          { id: '1', text: 'Luxury hotels' },
          { id: '2', text: 'Budget options' },
          { id: '3', text: 'Unique stays' },
        ],
      };
    } else if (lowerCaseMsg.includes('flight') || lowerCaseMsg.includes('airline') || lowerCaseMsg.includes('plane')) {
      return {
        message: 'For the best flight deals, I recommend booking 2-3 months in advance. Would you like tips on finding cheap flights or information about specific airlines?',
        suggestions: [
          { id: '1', text: 'Flight deals' },
          { id: '2', text: 'Airline reviews' },
          { id: '3', text: 'Airport guides' },
        ],
      };
    } else if (lowerCaseMsg.includes('budget') || lowerCaseMsg.includes('cost') || lowerCaseMsg.includes('price')) {
      return {
        message: 'Travel budgets vary widely by destination. Southeast Asia tends to be budget-friendly, while destinations like Japan or Switzerland may require more spending. Do you have a specific budget range in mind?',
        suggestions: [
          { id: '1', text: 'Budget destinations' },
          { id: '2', text: 'Money-saving tips' },
          { id: '3', text: 'Luxury experiences' },
        ],
      };
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
      message: "Thanks for reaching out! I can help with destination recommendations, travel packages, accommodation options, or travel tips. I can also check the weather for any city - just ask 'What's the weather in [city]?'",
      suggestions: [
        { id: '1', text: 'Weather in Paris' },
        { id: '2', text: 'Popular destinations' },
        { id: '3', text: 'Travel tips' },
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
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
