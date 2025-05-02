
import React from 'react';
import { MessageType } from '../../context/ChatContext';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div 
      className={cn(
        "flex w-full mb-4 animate-slide-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-[#33C3F0] flex items-center justify-center mr-2 flex-shrink-0">
          <span className="text-white text-xs">🌍</span>
        </div>
      )}
      <div 
        className={cn(
          "px-4 py-3 rounded-lg max-w-[80%] shadow-sm",
          isBot 
            ? "bg-white rounded-tl-none border-l-4 border-[#33C3F0]" 
            : "bg-[#EBF8FF] rounded-tr-none"
        )}
      >
        <p className="text-sm">{message.content}</p>
        {isBot && (
          <p className="text-xs text-gray-400 mt-1">Travel Assistant</p>
        )}
      </div>
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-[#D3E4FD] flex items-center justify-center ml-2 flex-shrink-0">
          <span className="text-[#33C3F0] text-xs">👤</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
