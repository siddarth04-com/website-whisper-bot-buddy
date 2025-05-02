
import React from 'react';
import { MessageType, WeatherData } from '../../context/ChatContext';
import { cn } from '@/lib/utils';
import { Cloud, Sun, CloudSun, CloudRain, Wind } from 'lucide-react';

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

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  const hasWeatherData = isBot && message.content.includes("Currently in ") && message.content.includes("°C with");

  // Extract city name from message for weather display
  let city = "";
  if (hasWeatherData) {
    const match = message.content.match(/Currently in ([^,]+),/);
    if (match) city = match[1];
  }

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
          "px-4 py-3 rounded-lg max-w-[80%] shadow-sm",
          isBot 
            ? "bg-white rounded-tl-none border-l-4 border-[#33C3F0]" 
            : "bg-[#EBF8FF] rounded-tr-none"
        )}
      >
        <p className="text-sm">{message.content}</p>
        
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
        
        {isBot && (
          <p className="text-xs text-gray-400 mt-1">Travel Assistant</p>
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
