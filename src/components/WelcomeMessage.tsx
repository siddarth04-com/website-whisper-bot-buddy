
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WelcomeMessage: React.FC = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user) {
      // Show the welcome message after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !user) {
    return null;
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Friend';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full mx-4 text-center transform animate-scale-in">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-4 right-4 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </Button>
        
        <div className="space-y-6">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/47a78a09-1653-4df1-b457-9715e5f47906.png" 
              alt="Nestled Welcome" 
              className="w-24 h-24 object-contain animate-3d-float"
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              नमस्ते
            </h1>
            <h2 className="text-3xl font-semibold text-gray-800">
              Welcome, {userName}!
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Ready to explore the incredible beauty and diversity of India? Let's begin your journey together.
            </p>
          </div>
          
          <Button
            onClick={handleClose}
            className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 transform-gpu"
          >
            Start Exploring
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
