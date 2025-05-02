
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

type ChatContextType = {
  isOpen: boolean;
  messages: MessageType[];
  suggestedReplies: SuggestedReplyType[];
  toggleChat: () => void;
  sendMessage: (content: string) => void;
  closeChat: () => void;
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const generateBotResponse = (userMessage: string): { message: string; suggestions: SuggestedReplyType[] } => {
    const lowerCaseMsg = userMessage.toLowerCase();
    
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
      message: "Thanks for reaching out! I can help with destination recommendations, travel packages, accommodation options, or travel tips. What aspect of your trip are you planning?",
      suggestions: [
        { id: '1', text: 'Destinations' },
        { id: '2', text: 'Accommodation' },
        { id: '3', text: 'Transportation' },
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
    setTimeout(() => {
      const { message, suggestions } = generateBotResponse(content);
      
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
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
