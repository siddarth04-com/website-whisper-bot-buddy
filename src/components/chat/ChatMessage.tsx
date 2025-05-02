
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
      <div 
        className={cn(
          "px-4 py-3 rounded-lg max-w-[80%]",
          isBot ? "bg-chat-bot rounded-tl-none" : "bg-chat-user rounded-tr-none"
        )}
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
