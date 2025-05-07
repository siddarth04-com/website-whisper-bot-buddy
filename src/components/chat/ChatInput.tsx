
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatContext, SuggestedReplyType } from '../../context/ChatContext';
import { Send, Mic, MicOff } from 'lucide-react';

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

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      {/* Suggested replies */}
      {suggestedReplies.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestedReplies.map((reply) => (
            <button
              key={reply.id}
              className="bg-[#EBF8FF] border border-[#D3E4FD] hover:bg-[#D3E4FD] text-[#33C3F0] text-sm rounded-full px-3 py-1 transition-colors"
              onClick={() => handleSuggestedReply(reply)}
            >
              {reply.text}
            </button>
          ))}
        </div>
      )}
      
      {/* Message input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isListening ? "Listening..." : "Ask about destinations, tips, etc..."}
          className={`flex-grow border-[#D3E4FD] focus-visible:ring-[#33C3F0] ${
            isListening ? "border-[#33C3F0] bg-[#F0FAFF]" : ""
          }`}
        />
        
        {/* Voice input button - only show if speech recognition is supported */}
        {isRecognitionSupported && (
          <Button
            type="button"
            size="icon"
            variant={isListening ? "destructive" : "outline"}
            onClick={toggleListening}
            className={isListening ? "bg-red-500 hover:bg-red-600" : "border-[#D3E4FD]"}
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
          className="bg-[#33C3F0] hover:bg-[#2AB7E2]"
          disabled={!message.trim()}
        >
          <Send size={18} className="text-white" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
