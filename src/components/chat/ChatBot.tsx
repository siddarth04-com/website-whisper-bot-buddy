
import React, { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
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
          {/* Header with logo and mountain theme */}
          <div className="bg-gradient-to-r from-teal-500 to-green-400 text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/26488c0d-314f-44e7-b1b6-913a3e7898d1.png" 
                alt="Destination Guide Logo" 
                className="w-8 h-8 object-contain"
              />
              <h3 className="font-semibold">Destination Guide</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="hover:bg-white/20 text-white rounded-full h-8 w-8 p-0"
            >
              <X size={18} />
            </Button>
          </div>
          
          {/* Resizable content area */}
          <ResizablePanelGroup direction="vertical" className="flex-grow">
            <ResizablePanel defaultSize={80} minSize={30}>
              {/* Message area with mountain-inspired background */}
              <div 
                className="h-full p-4 overflow-y-auto bg-gradient-to-b from-sky-50 to-green-50"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 15l15 30H15z' fill='%2314b8a6' fill-opacity='0.05'/%3E%3Cpath d='M45 20l10 20H35z' fill='%2306b6d4' fill-opacity='0.03'/%3E%3C/svg%3E\")",
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
      
      {/* Toggle button with logo */}
      <Button
        onClick={toggleChat}
        className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg bg-gradient-to-r from-teal-500 to-green-400 hover:from-teal-600 hover:to-green-500 transition-all duration-300 ${
          isOpen ? 'rotate-90' : ''
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <img 
            src="/lovable-uploads/26488c0d-314f-44e7-b1b6-913a3e7898d1.png" 
            alt="Open Chat" 
            className="w-8 h-8 object-contain"
          />
        )}
      </Button>
    </div>
  );
};

export default ChatBot;
