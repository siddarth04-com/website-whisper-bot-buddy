
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MessageType, SuggestedReplyType, WeatherData, TravelPreferences, ChatContextType } from './types';
import { generateBotResponse } from './botResponseUtils';
import { updateTravelPreferences } from './preferencesUtils';

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

export const ChatProvider: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: 'Namaste! 🙏 I\'m your India travel assistant. How can I help you explore the incredible diversity of India today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [suggestedReplies, setSuggestedReplies] = useState<SuggestedReplyType[]>([
    { id: '1', text: 'Popular Indian destinations' },
    { id: '2', text: 'India travel packages' },
    { id: '3', text: 'India travel tips' },
  ]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [travelPreferences, setTravelPreferences] = useState<TravelPreferences>({});

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
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
    
    // Update travel preferences based on the message
    updateTravelPreferences(content, setTravelPreferences);
    
    // Simulate bot thinking
    setTimeout(async () => {
      try {
        const { message, suggestions } = await generateBotResponse(content, travelPreferences, setWeatherData);
        
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
          content: "I apologize, but I'm having trouble processing your request right now. Please try asking about Indian destinations, travel tips, or weather information!",
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, errorMessage]);
        setSuggestedReplies([
          { id: '1', text: 'Popular Indian destinations' },
          { id: '2', text: 'India travel tips' },
          { id: '3', text: 'Budget travel in India' },
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

export default ChatProvider;

// Re-export types for backward compatibility
export type { MessageType, SuggestedReplyType, WeatherData, TravelPreferences };
