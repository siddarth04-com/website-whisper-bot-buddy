
import React, { useRef, useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatContext } from '../../context/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const ChatBot: React.FC = () => {
  const { isOpen, messages, toggleChat } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatSize, setChatSize] = useState({ width: 384, height: 500 });

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat window */}
      {isOpen && (
        <div 
          className="mb-4 rounded-lg shadow-lg bg-white flex flex-col animate-fade-in resize overflow-hidden min-w-[300px] min-h-[400px] max-w-[600px] max-h-[80vh]"
          style={{ 
            width: `${chatSize.width}px`, 
            height: `${chatSize.height}px`,
            resize: 'both'
          }}
        >
          {/* Header */}
          <div className="bg-[#33C3F0] text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <h3 className="font-medium">Travel Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="hover:bg-[#2AB7E2] text-white rounded-full h-8 w-8 p-0"
            >
              <X size={18} />
            </Button>
          </div>
          
          {/* Resizable content area */}
          <ResizablePanelGroup direction="vertical" className="flex-grow">
            <ResizablePanel defaultSize={80} minSize={30}>
              {/* Message area with a subtle background pattern */}
              <div 
                className="h-full p-4 overflow-y-auto bg-[#F9FAFB] bg-opacity-50"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2333C3F0' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                }}
              >
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={20} minSize={15}>
              {/* Input area */}
              <ChatInput />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
      
      {/* Toggle button */}
      <Button
        onClick={toggleChat}
        className={`rounded-full w-14 h-14 flex items-center justify-center shadow-md bg-[#33C3F0] hover:bg-[#2AB7E2] transition-all ${
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
