
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SuggestedReplyType, TravelPreferences, WeatherData, MessageType } from './types';
import { generateBotResponse } from './botResponseUtils';

// Export types for components to use
export type { MessageType, SuggestedReplyType, WeatherData, TravelPreferences } from './types';

interface ChatContextType {
  messages: MessageType[];
  isOpen: boolean;
  isLoading: boolean;
  weatherData: WeatherData | null;
  travelPreferences: TravelPreferences;
  conversationHistory: string[];
  suggestedReplies: SuggestedReplyType[];
  addMessage: (content: string, isUser: boolean, suggestions?: SuggestedReplyType[]) => void;
  toggleChat: () => void;
  setWeatherData: (data: WeatherData | null) => void;
  updateTravelPreferences: (preferences: Partial<TravelPreferences>) => void;
  sendMessage: (message: string) => Promise<void>;
  clearConversation: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: "🙏 **Namaste! Welcome to Nestled Guide!** 🇮🇳\n\nI'm your enhanced AI travel assistant, ready to help you discover incredible India! I can create custom itineraries, find flights & hotels, provide weather updates, and share insider travel tips.\n\n✨ **What I can help you with:**\n• Custom day-by-day itineraries\n• Flight & hotel recommendations\n• Weather forecasts\n• Cultural insights & travel tips\n• Budget planning\n\nWhat kind of India adventure are you planning?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [suggestedReplies, setSuggestedReplies] = useState<SuggestedReplyType[]>([
    { id: '1', text: 'Create a 7-day Golden Triangle itinerary' },
    { id: '2', text: 'Plan a Kerala backwaters trip' },
    { id: '3', text: 'Budget travel tips for India' },
    { id: '4', text: 'Popular Indian destinations' }
  ]);
  const [travelPreferences, setTravelPreferences] = useState<TravelPreferences>({
    budget: 'medium',
    genre: 'cultural',
    style: 'family'
  });

  const addMessage = useCallback((content: string, isUser: boolean, suggestions?: SuggestedReplyType[]) => {
    const newMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender: isUser ? 'user' : 'bot',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update suggested replies if provided
    if (suggestions) {
      setSuggestedReplies(suggestions);
    }
    
    // Update conversation history
    if (isUser) {
      setConversationHistory(prev => {
        const updated = [...prev, content];
        return updated.length > 15 ? updated.slice(-15) : updated;
      });
    }
  }, []);

  const clearConversation = useCallback(() => {
    setMessages([{
      id: '1',
      content: "🙏 **Namaste! Welcome to Nestled Guide!** 🇮🇳\n\nI'm your enhanced AI travel assistant, ready to help you discover incredible India! I can create custom itineraries, find flights & hotels, provide weather updates, and share insider travel tips.\n\n✨ **What I can help you with:**\n• Custom day-by-day itineraries\n• Flight & hotel recommendations\n• Weather forecasts\n• Cultural insights & travel tips\n• Budget planning\n\nWhat kind of India adventure are you planning?",
      sender: 'bot',
      timestamp: new Date(),
    }]);
    setConversationHistory([]);
    setSuggestedReplies([
      { id: '1', text: 'Create a 7-day Golden Triangle itinerary' },
      { id: '2', text: 'Plan a Kerala backwaters trip' },
      { id: '3', text: 'Budget travel tips for India' },
      { id: '4', text: 'Popular Indian destinations' }
    ]);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const updateTravelPreferences = useCallback((preferences: Partial<TravelPreferences>) => {
    setTravelPreferences(prev => ({ ...prev, ...preferences }));
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    addMessage(message, true);
    setIsLoading(true);

    try {
      // Pass conversation history to generateBotResponse
      const response = await generateBotResponse(
        message, 
        travelPreferences, 
        setWeatherData,
        conversationHistory
      );
      
      // Add bot response
      addMessage(response.message, false, response.suggestions);
    } catch (error) {
      console.error('Error generating bot response:', error);
      addMessage(
        "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        false
      );
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, travelPreferences, conversationHistory]);

  const value: ChatContextType = {
    messages,
    isOpen,
    isLoading,
    weatherData,
    travelPreferences,
    conversationHistory,
    suggestedReplies,
    addMessage,
    toggleChat,
    setWeatherData,
    updateTravelPreferences,
    sendMessage,
    clearConversation
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
