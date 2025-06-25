import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatContext, SuggestedReplyType } from '../../context/ChatContext';
import { Send, Mic, MicOff, MapPin, Compass } from 'lucide-react';

const ChatInput: React.FC = () => {
  const { sendMessage, suggestedReplies } = useChatContext();
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsRecognitionSupported(!!SpeechRecognition);
  }, []);
  
  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setMessage(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };
  
  // Toggle speech recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      initializeSpeechRecognition();
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
      
      // If still listening, stop
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  };

  const handleSuggestedReply = (reply: SuggestedReplyType) => {
    sendMessage(reply.text);
    
    // If still listening, stop
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Get icon based on reply content
  const getSuggestionIcon = (text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('weather')) {
      return <MapPin size={14} className="mr-1" />;
    } else if (lowerText.includes('destination') || 
               lowerText.includes('guide') || 
               lowerText.includes('place') || 
               lowerText.includes('city') || 
               lowerText.includes('country')) {
      return <Compass size={14} className="mr-1" />;
    }
    
    return null;
  };

  return (
    <div className="border-t p-4" 
         style={{ 
           backgroundColor: '#E4E8EA', // Porcelain background
           borderTopColor: '#9FC854' // Celery border
         }}>
      {/* Suggested replies with new colors */}
      {suggestedReplies && suggestedReplies.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestedReplies.map((reply) => (
            <button
              key={reply.id}
              className="text-sm rounded-full px-3 py-1 transition-colors flex items-center border"
              style={{
                backgroundColor: '#E4E8EA',
                borderColor: '#9FC854',
                color: '#9FC854'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#9FC854';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#E4E8EA';
                e.currentTarget.style.color = '#9FC854';
              }}
              onClick={() => handleSuggestedReply(reply)}
            >
              {getSuggestionIcon(reply.text)}
              {reply.text}
            </button>
          ))}
        </div>
      )}
      
      {/* Message input with new colors */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isListening ? "Listening..." : "Ask about destinations, tips, budget options, etc..."}
          className={`flex-grow border focus-visible:ring-2 ${
            isListening ? "bg-opacity-50" : ""
          }`}
          style={{
            borderColor: '#9FC854',
            backgroundColor: isListening ? '#E4E8EA' : '#ffffff'
          }}
        />
        
        {/* Voice input button */}
        {isRecognitionSupported && (
          <Button
            type="button"
            size="icon"
            variant={isListening ? "destructive" : "outline"}
            onClick={toggleListening}
            className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
            style={!isListening ? { borderColor: '#9FC854' } : {}}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? (
              <MicOff size={18} />
            ) : (
              <Mic size={18} />
            )}
          </Button>
        )}
        
        <Button 
          type="submit" 
          size="icon" 
          className="text-white"
          style={{ backgroundColor: '#9FC854' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#8AB046';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#9FC854';
          }}
          disabled={!message.trim()}
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
