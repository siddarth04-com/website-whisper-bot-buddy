
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatContext, SuggestedReplyType } from '../../context/ChatContext';
import { MessageCircle, Send } from 'lucide-react';

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
    <div className="border-t border-gray-200 p-4">
      {/* Suggested replies */}
      {suggestedReplies.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestedReplies.map((reply) => (
            <button
              key={reply.id}
              className="bg-white border border-gray-200 hover:bg-chat-button-hover text-sm rounded-full px-3 py-1 transition-colors"
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
          placeholder="Type your message..."
          className="flex-grow"
        />
        <Button type="submit" size="icon" className="bg-chat-primary hover:bg-chat-primary-dark">
          <Send size={18} className="text-white" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
