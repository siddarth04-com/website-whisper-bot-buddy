
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
      content: 'Hi there! 👋 How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [suggestedReplies, setSuggestedReplies] = useState<SuggestedReplyType[]>([
    { id: '1', text: 'Tell me about your services' },
    { id: '2', text: 'How can I contact you?' },
    { id: '3', text: 'What are your business hours?' },
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const generateBotResponse = (userMessage: string): { message: string; suggestions: SuggestedReplyType[] } => {
    const lowerCaseMsg = userMessage.toLowerCase();
    
    // Simple response logic based on user's message
    if (lowerCaseMsg.includes('service') || lowerCaseMsg.includes('offer')) {
      return {
        message: 'We offer a wide range of services including web development, content creation, and digital marketing. Would you like to know more about any specific service?',
        suggestions: [
          { id: '1', text: 'Web development details' },
          { id: '2', text: 'Content creation services' },
          { id: '3', text: 'Digital marketing packages' },
        ],
      };
    } else if (lowerCaseMsg.includes('contact') || lowerCaseMsg.includes('reach') || lowerCaseMsg.includes('email')) {
      return {
        message: 'You can contact us via email at contact@example.com or call us at (123) 456-7890. Would you like us to get back to you?',
        suggestions: [
          { id: '1', text: 'Request a callback' },
          { id: '2', text: 'Send me your brochure' }
        ],
      };
    } else if (lowerCaseMsg.includes('hour') || lowerCaseMsg.includes('open')) {
      return {
        message: 'Our business hours are Monday to Friday, 9 AM to 5 PM EST. How else can I assist you?',
        suggestions: [
          { id: '1', text: 'Schedule a meeting' },
          { id: '2', text: 'Weekend availability' }
        ],
      };
    } else if (lowerCaseMsg.includes('price') || lowerCaseMsg.includes('cost') || lowerCaseMsg.includes('package')) {
      return {
        message: 'Our pricing varies based on specific project requirements. Would you like a custom quote?',
        suggestions: [
          { id: '1', text: 'Get a quote' },
          { id: '2', text: 'View standard packages' }
        ],
      };
    }
    
    // Default response
    return {
      message: "Thanks for your message! I'd be happy to help with any questions you have about our website, services, or company.",
      suggestions: [
        { id: '1', text: 'Tell me about your company' },
        { id: '2', text: 'What services do you offer?' },
        { id: '3', text: 'How can I get started?' },
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
