
import React, { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatContext } from '../../context/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';

const ChatBot: React.FC = () => {
  const { isOpen, messages, toggleChat } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatSize, setChatSize] = useState({ width: 384, height: 500 });
  const [position, setPosition] = useState<Position>('bottom-right');
  const [isMoving, setIsMoving] = useState(false);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Auto-guide functionality - move the chatbot to different positions
  useEffect(() => {
    const guidePositions: Position[] = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
    let currentIndex = 0;

    const moveInterval = setInterval(() => {
      if (!isOpen) {
        setIsMoving(true);
        setTimeout(() => {
          currentIndex = (currentIndex + 1) % guidePositions.length;
          setPosition(guidePositions[currentIndex]);
          setIsMoving(false);
        }, 300);
      }
    }, 8000); // Move every 8 seconds when closed

    return () => clearInterval(moveInterval);
  }, [isOpen]);

  const getPositionClasses = (pos: Position) => {
    const baseClasses = "fixed z-50 flex flex-col transition-all duration-500 ease-in-out";
    
    switch (pos) {
      case 'bottom-right':
        return `${baseClasses} bottom-4 right-4 items-end`;
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4 items-start`;
      case 'top-right':
        return `${baseClasses} top-4 right-4 items-end`;
      case 'top-left':
        return `${baseClasses} top-4 left-4 items-start`;
      case 'center':
        return `${baseClasses} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center`;
      default:
        return `${baseClasses} bottom-4 right-4 items-end`;
    }
  };

  const getChatWindowPosition = () => {
    const baseClasses = "mb-4 rounded-lg shadow-lg bg-white flex flex-col animate-fade-in resize overflow-hidden min-w-[300px] min-h-[400px] max-w-[600px] max-h-[80vh]";
    
    if (position === 'center') {
      return `${baseClasses} mx-auto`;
    }
    return baseClasses;
  };

  const moveToPosition = (newPosition: Position) => {
    setIsMoving(true);
    setTimeout(() => {
      setPosition(newPosition);
      setIsMoving(false);
    }, 300);
  };

  return (
    <div className={getPositionClasses(position)}>
      {/* Chat window */}
      {isOpen && (
        <div 
          className={getChatWindowPosition()}
          style={{ 
            width: `${chatSize.width}px`, 
            height: `${chatSize.height}px`,
            resize: 'both'
          }}
        >
          {/* Header with logo and mountain theme */}
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/26488c0d-314f-44e7-b1b6-913a3e7898d1.png" 
                alt="Website Guide" 
                className="w-8 h-8 object-contain"
              />
              <h3 className="font-semibold">Website Guide</h3>
            </div>
            <div className="flex items-center gap-2">
              {/* Position controls */}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveToPosition('top-left')}
                  className="hover:bg-white/20 text-white rounded h-6 w-6 p-0 text-xs"
                  title="Move to top-left"
                >
                  ↖
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveToPosition('top-right')}
                  className="hover:bg-white/20 text-white rounded h-6 w-6 p-0 text-xs"
                  title="Move to top-right"
                >
                  ↗
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveToPosition('bottom-left')}
                  className="hover:bg-white/20 text-white rounded h-6 w-6 p-0 text-xs"
                  title="Move to bottom-left"
                >
                  ↙
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveToPosition('bottom-right')}
                  className="hover:bg-white/20 text-white rounded h-6 w-6 p-0 text-xs"
                  title="Move to bottom-right"
                >
                  ↘
                </Button>
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
          </div>
          
          {/* Resizable content area */}
          <ResizablePanelGroup direction="vertical" className="flex-grow">
            <ResizablePanel defaultSize={80} minSize={30}>
              {/* Message area with warm gradient background */}
              <div 
                className="h-full p-4 overflow-y-auto bg-gradient-to-b from-orange-50 via-red-50 to-pink-50"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 15l15 30H15z' fill='%23f97316' fill-opacity='0.05'/%3E%3Cpath d='M45 20l10 20H35z' fill='%23dc2626' fill-opacity='0.03'/%3E%3C/svg%3E\")",
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
      
      {/* Toggle button with logo and movement animation */}
      <Button
        onClick={toggleChat}
        className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 ${
          isOpen ? 'rotate-90' : ''
        } ${isMoving ? 'animate-pulse scale-110' : ''}`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <img 
            src="/lovable-uploads/26488c0d-314f-44e7-b1b6-913a3e7898d1.png" 
            alt="Open Guide" 
            className="w-8 h-8 object-contain"
          />
        )}
      </Button>
      
      {/* Guide indicator when moving */}
      {isMoving && !isOpen && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-full text-sm whitespace-nowrap animate-fade-in">
          🧭 Exploring your website...
        </div>
      )}
    </div>
  );
};

export default ChatBot;
