
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatContext, SuggestedReplyType } from '../../context/ChatContext';
import { Send } from 'lucide-react';

const ChatInput: React.FC = () => {
  const { sendMessage, suggestedReplies } = useChatContext();
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleSuggestedReply = (reply: SuggestedReplyType) => {
    sendMessage(reply.text);
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
          placeholder="Ask about destinations, tips, etc..."
          className="flex-grow border-[#D3E4FD] focus-visible:ring-[#33C3F0]"
        />
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
