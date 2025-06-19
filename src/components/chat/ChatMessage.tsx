
import React, { useState } from 'react';
import { MessageType, WeatherData, TravelPreferences } from '../../context/ChatContext';
import { cn } from '@/lib/utils';
import { Cloud, Sun, CloudSun, CloudRain, Wind, Volume2, VolumeX, Compass, MapPin } from 'lucide-react';
import { useConversation } from '@11labs/react';

interface ChatMessageProps {
  message: MessageType;
}

const WeatherCard = ({ data }: { data: WeatherData }) => {
  const getWeatherIcon = (iconCode: string) => {
    // Map OpenWeatherMap icon codes to Lucide icons
    if (iconCode.includes('01')) return <Sun className="text-yellow-500" size={24} />;
    if (iconCode.includes('02') || iconCode.includes('03')) return <CloudSun className="text-gray-400" size={24} />;
    if (iconCode.includes('04')) return <Cloud className="text-gray-500" size={24} />;
    if (iconCode.includes('09') || iconCode.includes('10')) return <CloudRain className="text-blue-400" size={24} />;
    if (iconCode.includes('13')) return <CloudRain className="text-blue-300" size={24} />;
    if (iconCode.includes('11')) return <CloudRain className="text-purple-400" size={24} />;
    if (iconCode.includes('50')) return <Wind className="text-gray-400" size={24} />;
    return <Cloud className="text-gray-400" size={24} />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 mt-2 border border-teal-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-teal-600">{data.city}</h3>
        <div className="flex items-center">
          {getWeatherIcon(data.icon)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-600">Temperature</p>
          <p className="font-medium">{data.temp.toFixed(1)}°C</p>
        </div>
        <div>
          <p className="text-gray-600">Condition</p>
          <p className="font-medium capitalize">{data.description}</p>
        </div>
        <div>
          <p className="text-gray-600">Humidity</p>
          <p className="font-medium">{data.humidity}%</p>
        </div>
        <div>
          <p className="text-gray-600">Wind</p>
          <p className="font-medium">{data.windSpeed} m/s</p>
        </div>
      </div>
    </div>
  );
};

// Component to display destination recommendations
const DestinationRecommendations = ({ message }: { message: string }) => {
  // Check if message contains a numbered list of destinations
  if (!/\d\.\s[A-Za-z\s,]+/.test(message)) {
    return null;
  }
  
  // Extract destinations from message
  const destinations: string[] = [];
  const lines = message.split('\n');
  
  for (const line of lines) {
    const match = line.match(/\d\.\s([A-Za-z\s,]+)/);
    if (match && match[1]) {
      destinations.push(match[1].trim());
    }
  }
  
  if (destinations.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 mt-2 border border-teal-200">
      <div className="flex items-center mb-2">
        <Compass className="text-teal-500 mr-2" size={20} />
        <h3 className="font-medium text-teal-600">Recommended Destinations</h3>
      </div>
      <div className="grid grid-cols-1 gap-2 text-sm">
        {destinations.map((destination, index) => (
          <div key={index} className="flex items-center">
            <MapPin size={16} className="text-gray-400 mr-2" />
            <p className="font-medium">{destination}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const isBot = message.sender === 'bot';
  const hasWeatherData = isBot && message.content.includes("Currently in ") && message.content.includes("°C with");
  const hasDestinations = isBot && message.content.includes("I recommend considering these destinations");

  // Extract city name from message for weather display
  let city = "";
  if (hasWeatherData) {
    const match = message.content.match(/Currently in ([^,]+),/);
    if (match) city = match[1];
  }

  // Eleven Labs text to speech functionality
  const generateSpeech = async (text: string) => {
    if (isPlaying) {
      // Stop current audio if playing
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      
      // Call Supabase Edge Function for Eleven Labs TTS
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice: 'Sarah' // Using Sarah voice (EXAVITQu4vr4xnSDxMaL)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const { audioContent } = await response.json();
      
      // Convert base64 to audio and play
      const audioBlob = new Blob([
        new Uint8Array(atob(audioContent).split('').map(c => c.charCodeAt(0)))
      ], { type: 'audio/mp3' });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('Error generating speech:', error);
      setIsPlaying(false);
    }
  };

  return (
    <div 
      className={cn(
        "flex w-full mb-4 animate-slide-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-green-400 flex items-center justify-center mr-2 flex-shrink-0">
          <img 
            src="/lovable-uploads/26488c0d-314f-44e7-b1b6-913a3e7898d1.png" 
            alt="Bot" 
            className="w-6 h-6 object-contain"
          />
        </div>
      )}
      <div 
        className={cn(
          "px-4 py-3 rounded-lg max-w-[80%] shadow-sm relative",
          isBot 
            ? "bg-white rounded-tl-none border-l-4 border-teal-500" 
            : "bg-gradient-to-r from-green-100 to-teal-100 rounded-tr-none"
        )}
      >
        <p className="text-sm whitespace-pre-line">{message.content}</p>
        
        {hasWeatherData && (
          <WeatherCard 
            data={{
              city, 
              temp: parseFloat(message.content.match(/it's ([\d.]+)°C/)?.[1] || "0"),
              description: message.content.match(/with ([^.]+)\./)?.[1] || "",
              icon: "04d", // Default icon
              humidity: parseInt(message.content.match(/humidity is (\d+)%/)?.[1] || "0"),
              windSpeed: parseFloat(message.content.match(/wind speed is ([\d.]+) m\/s/)?.[1] || "0")
            }} 
          />
        )}

        {hasDestinations && (
          <DestinationRecommendations message={message.content} />
        )}
        
        {isBot && (
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">Destination Guide</p>
            <button 
              onClick={() => generateSpeech(message.content)} 
              className={cn(
                "p-1 rounded-full transition-colors",
                isPlaying 
                  ? "text-teal-600 bg-teal-100" 
                  : "text-gray-500 hover:bg-gray-100"
              )}
              aria-label={isPlaying ? "Stop speaking" : "Listen to response"}
              title={isPlaying ? "Stop speaking" : "Listen to response"}
            >
              {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        )}
      </div>
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-200 to-teal-200 flex items-center justify-center ml-2 flex-shrink-0">
          <span className="text-teal-700 text-xs">👤</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
