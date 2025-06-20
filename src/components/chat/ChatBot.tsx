
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
  const [hover3D, setHover3D] = useState(false);

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
    const baseClasses = "fixed z-50 flex flex-col transition-all duration-500 ease-in-out transform-gpu";
    
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
    const baseClasses = "mb-4 rounded-lg shadow-2xl bg-white flex flex-col animate-fade-in resize overflow-hidden min-w-[300px] min-h-[400px] max-w-[600px] max-h-[80vh] transform-gpu transition-all duration-300";
    
    const transform3D = isOpen ? 
      "perspective-1000 rotateX-2 rotateY-2 translateZ-4" : 
      "perspective-1000";
    
    if (position === 'center') {
      return `${baseClasses} mx-auto ${transform3D}`;
    }
    return `${baseClasses} ${transform3D}`;
  };

  const moveToPosition = (newPosition: Position) => {
    setIsMoving(true);
    setTimeout(() => {
      setPosition(newPosition);
      setIsMoving(false);
    }, 300);
  };

  const get3DButtonTransform = () => {
    if (isMoving) {
      return "perspective-1000 rotateY-180 rotateX-12 scale-110";
    }
    if (hover3D && !isOpen) {
      return "perspective-1000 rotateY-6 rotateX-3 scale-105 translateZ-8";
    }
    if (isOpen) {
      return "perspective-1000 rotateZ-90 rotateY-3 scale-95";
    }
    return "perspective-1000 rotateY-0 rotateX-0 scale-100";
  };

  return (
    <div className={getPositionClasses(position)}>
      {/* Chat window with 3D effects */}
      {isOpen && (
        <div 
          className={`${getChatWindowPosition()} ${isOpen ? 'animate-3d-float' : ''}`}
          style={{ 
            width: `${chatSize.width}px`, 
            height: `${chatSize.height}px`,
            resize: 'both',
            transform: isOpen ? 'perspective(1000px) rotateX(2deg) rotateY(-2deg) translateZ(20px)' : 'none',
            transformStyle: 'preserve-3d',
            boxShadow: isOpen ? 
              '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)' : 
              '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Header with 3D gradient and glass effect */}
          <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0 transform-gpu"
               style={{
                 background: 'linear-gradient(135deg, #f97316 0%, #dc2626 50%, #ec4899 100%)',
                 backdropFilter: 'blur(10px)',
                 borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                 transform: 'translateZ(10px)',
               }}>
            <div className="absolute inset-0 bg-white/10 rounded-t-lg backdrop-blur-sm"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-3d-spin-slow backdrop-blur-sm">
                <img 
                  src="/lovable-uploads/26488c0d-314f-44e7-b1b6-913a3e7898d1.png" 
                  alt="Website Guide" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <h3 className="font-semibold text-shadow-lg">Website Guide</h3>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              {/* 3D Position controls */}
              <div className="flex gap-1">
                {[
                  { pos: 'top-left' as Position, icon: '↖' },
                  { pos: 'top-right' as Position, icon: '↗' },
                  { pos: 'bottom-left' as Position, icon: '↙' },
                  { pos: 'bottom-right' as Position, icon: '↘' }
                ].map(({ pos, icon }) => (
                  <Button
                    key={pos}
                    variant="ghost"
                    size="icon"
                    onClick={() => moveToPosition(pos)}
                    className="hover:bg-white/20 text-white rounded h-6 w-6 p-0 text-xs transition-all duration-200 hover:scale-110 hover:rotate-12 transform-gpu"
                    title={`Move to ${pos}`}
                    style={{
                      transform: position === pos ? 'scale(1.2) rotateZ(15deg)' : 'scale(1)',
                      background: position === pos ? 'rgba(255, 255, 255, 0.3)' : 'transparent'
                    }}
                  >
                    {icon}
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="hover:bg-white/20 text-white rounded-full h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:rotate-90 transform-gpu"
              >
                <X size={18} />
              </Button>
            </div>
          </div>
          
          {/* Resizable content area with 3D depth */}
          <ResizablePanelGroup direction="vertical" className="flex-grow transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
            <ResizablePanel defaultSize={80} minSize={30}>
              {/* Message area with 3D layered background */}
              <div 
                className="h-full p-4 overflow-y-auto relative"
                style={{
                  background: `
                    linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(239, 68, 68, 0.1) 25%, rgba(236, 72, 153, 0.1) 50%, rgba(251, 146, 60, 0.05) 100%),
                    radial-gradient(circle at 25% 25%, rgba(251, 146, 60, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 75% 75%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)
                  `,
                  backgroundImage: `
                    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 15l15 30H15z' fill='%23f97316' fill-opacity='0.08' transform='rotate(15 30 30)'/%3E%3Cpath d='M45 20l10 20H35z' fill='%23dc2626' fill-opacity='0.05' transform='rotate(-15 45 30)'/%3E%3C/svg%3E")
                  `,
                  transform: 'translateZ(-5px)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 pointer-events-none"></div>
                <div className="relative z-10">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={20} minSize={15}>
              <div style={{ transform: 'translateZ(5px)' }}>
                <ChatInput />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
      
      {/* 3D Toggle button with enhanced animations */}
      <Button
        onClick={toggleChat}
        onMouseEnter={() => setHover3D(true)}
        onMouseLeave={() => setHover3D(false)}
        className={`rounded-full w-14 h-14 flex items-center justify-center shadow-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-500 transform-gpu ${
          isMoving ? 'animate-3d-flip' : ''
        }`}
        style={{
          transform: get3DButtonTransform(),
          transformStyle: 'preserve-3d',
          boxShadow: hover3D && !isOpen ? 
            '0 20px 40px -10px rgba(249, 115, 22, 0.4), 0 0 20px rgba(249, 115, 22, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)' :
            '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
          background: hover3D && !isOpen ?
            'linear-gradient(135deg, #f97316 0%, #dc2626 50%, #ec4899 100%)' :
            'linear-gradient(45deg, #f97316 0%, #dc2626 50%, #ec4899 100%)'
        }}
      >
        <div className="relative z-10">
          {isOpen ? (
            <X size={24} className="text-white drop-shadow-lg" />
          ) : (
            <div className={`transform transition-all duration-300 ${hover3D ? 'scale-110 rotate-6' : 'scale-100'}`}>
              <img 
                src="/lovable-uploads/26488c0d-314f-44e7-b1b6-913a3e7898d1.png" 
                alt="Open Guide" 
                className="w-8 h-8 object-contain drop-shadow-lg"
              />
            </div>
          )}
        </div>
        {/* 3D reflection effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-transparent to-transparent opacity-50 pointer-events-none"></div>
      </Button>
      
      {/* Enhanced guide indicator with 3D effects */}
      {isMoving && !isOpen && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 animate-fade-in">
          <div className="relative">
            <div className="bg-black/90 text-white px-4 py-2 rounded-full text-sm whitespace-nowrap backdrop-blur-sm border border-white/20"
                 style={{
                   transform: 'perspective(1000px) rotateX(-10deg) translateZ(10px)',
                   boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                 }}>
              🧭 Exploring your website...
            </div>
            {/* 3D arrow pointing down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"
                 style={{ transform: 'translateZ(5px)' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
