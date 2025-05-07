
import React, { useState } from 'react';
import { MessageType, WeatherData, TravelPreferences } from '../../context/ChatContext';
import { cn } from '@/lib/utils';
import { Cloud, Sun, CloudSun, CloudRain, Wind, Volume2, VolumeX, Compass, MapPin } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow-sm p-3 mt-2 border border-[#D3E4FD]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-[#33C3F0]">{data.city}</h3>
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
    <div className="bg-white rounded-lg shadow-sm p-3 mt-2 border border-[#D3E4FD]">
      <div className="flex items-center mb-2">
        <Compass className="text-[#33C3F0] mr-2" size={20} />
        <h3 className="font-medium text-[#33C3F0]">Recommended Destinations</h3>
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isBot = message.sender === 'bot';
  const hasWeatherData = isBot && message.content.includes("Currently in ") && message.content.includes("°C with");
  const hasDestinations = isBot && message.content.includes("I recommend considering these destinations");

  // Extract city name from message for weather display
  let city = "";
  if (hasWeatherData) {
    const match = message.content.match(/Currently in ([^,]+),/);
    if (match) city = match[1];
  }

  // Text to speech functionality
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure speech properties
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Get available voices and set a good one if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(voice => voice.lang.includes('en'));
      if (englishVoices.length > 0) {
        utterance.voice = englishVoices[0];
      }
      
      // Event handlers
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
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
        <div className="w-8 h-8 rounded-full bg-[#33C3F0] flex items-center justify-center mr-2 flex-shrink-0">
          <span className="text-white text-xs">🌍</span>
        </div>
      )}
      <div 
        className={cn(
          "px-4 py-3 rounded-lg max-w-[80%] shadow-sm relative",
          isBot 
            ? "bg-white rounded-tl-none border-l-4 border-[#33C3F0]" 
            : "bg-[#EBF8FF] rounded-tr-none"
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
            <p className="text-xs text-gray-400">Travel Assistant</p>
            {isSpeaking ? (
              <button 
                onClick={stopSpeaking} 
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Stop speaking"
                title="Stop speaking"
              >
                <VolumeX size={16} />
              </button>
            ) : (
              <button 
                onClick={() => speak(message.content)} 
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Listen to response"
                title="Listen to response"
              >
                <Volume2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-[#D3E4FD] flex items-center justify-center ml-2 flex-shrink-0">
          <span className="text-[#33C3F0] text-xs">👤</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
