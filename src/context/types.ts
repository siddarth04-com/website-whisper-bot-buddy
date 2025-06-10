
export type MessageType = {
  id: string;
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
};

export type SuggestedReplyType = {
  id: string;
  text: string;
};

export type WeatherData = {
  city: string;
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
};

export type TravelPreferences = {
  genre?: string; // cultural, adventure, relaxation, etc.
  budget?: 'low' | 'medium' | 'high' | 'luxury' | string;
  style?: string; // solo, family, couple, etc.
  interests?: string[];
  duration?: string;
  season?: string;
};

export type ChatContextType = {
  isOpen: boolean;
  messages: MessageType[];
  suggestedReplies: SuggestedReplyType[];
  toggleChat: () => void;
  sendMessage: (content: string) => void;
  closeChat: () => void;
  weatherData: WeatherData | null;
  travelPreferences: TravelPreferences;
};
