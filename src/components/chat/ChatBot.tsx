
import React, { useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatContext } from '../../context/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatBot: React.FC = () => {
  const { isOpen, messages, toggleChat } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] max-h-[80vh] rounded-lg shadow-lg bg-white flex flex-col animate-fade-in">
          {/* Header */}
          <div className="bg-chat-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <h3 className="font-medium">Chat Support</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="hover:bg-chat-primary-dark text-white rounded-full h-8 w-8 p-0"
            >
              <X size={18} />
            </Button>
          </div>
          
          {/* Message area */}
          <div className="flex-grow p-4 overflow-y-auto">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <ChatInput />
        </div>
      )}
      
      {/* Toggle button */}
      <Button
        onClick={toggleChat}
        className={`rounded-full w-14 h-14 flex items-center justify-center shadow-md bg-chat-primary hover:bg-chat-primary-dark transition-all ${
          isOpen ? 'rotate-90' : ''
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </Button>
    </div>
  );
};

export default ChatBot;
