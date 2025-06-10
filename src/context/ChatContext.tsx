import React, { createContext, useState, useContext, ReactNode } from 'react';

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

type ChatContextType = {
  isOpen: boolean;
  messages: MessageType[];
  suggestedReplies: SuggestedReplyType[];
  toggleChat: () => void;
  sendMessage: (content: string) => void;
  closeChat: () => void;
  weatherData: WeatherData | null;
  travelPreferences: TravelPreferences;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

type Props = {
  children: ReactNode;
};

// Use a free API key here - this is a demo API key for OpenWeatherMap
// In a production environment, this should be stored securely
const WEATHER_API_KEY = "4d8fb5b93d4af21d66a2948710284366"; 

export const ChatProvider: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: 'Namaste! 🙏 I\'m your India travel assistant. How can I help you explore the incredible diversity of India today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [suggestedReplies, setSuggestedReplies] = useState<SuggestedReplyType[]>([
    { id: '1', text: 'Popular Indian destinations' },
    { id: '2', text: 'India travel packages' },
    { id: '3', text: 'India travel tips' },
  ]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [travelPreferences, setTravelPreferences] = useState<TravelPreferences>({});

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const fetchWeatherData = async (city: string): Promise<WeatherData | null> => {
    try {
      console.log('Fetching weather data for:', city);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${WEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      
      const data = await response.json();
      console.log('Weather data received:', data);
      
      return {
        city: data.name,
        temp: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };

  // Get Indian travel recommendations based on genre
  const getTravelRecommendationsByGenre = (genre: string): string[] => {
    const genreMap: Record<string, string[]> = {
      'cultural': ['Delhi', 'Varanasi', 'Jaipur', 'Agra', 'Hampi'],
      'adventure': ['Manali', 'Rishikesh', 'Leh-Ladakh', 'Goa', 'Darjeeling'],
      'relaxation': ['Kerala Backwaters', 'Goa', 'Udaipur', 'Shimla', 'Ooty'],
      'food': ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Amritsar'],
      'history': ['Delhi', 'Agra', 'Jaipur', 'Khajuraho', 'Ajanta Caves'],
      'nature': ['Kerala', 'Himachal Pradesh', 'Uttarakhand', 'Karnataka', 'Meghalaya'],
      'spiritual': ['Varanasi', 'Rishikesh', 'Amritsar', 'Bodh Gaya', 'Haridwar'],
      'beach': ['Goa', 'Kerala', 'Andaman Islands', 'Puducherry', 'Maharashtra'],
      'mountain': ['Manali', 'Shimla', 'Darjeeling', 'Mussoorie', 'Nainital'],
      'heritage': ['Rajasthan', 'Delhi', 'Agra', 'Madhya Pradesh', 'Karnataka']
    };
    
    const normalizedGenre = genre.toLowerCase();
    for (const key in genreMap) {
      if (normalizedGenre.includes(key)) {
        return genreMap[key];
      }
    }
    
    return ['Delhi', 'Agra', 'Jaipur', 'Kerala', 'Goa'];
  };
  
  // Get Indian travel recommendations based on budget
  const getTravelRecommendationsByBudget = (budget: string): string[] => {
    const budgetMap: Record<string, string[]> = {
      'low': ['Rishikesh', 'Varanasi', 'Pushkar', 'Hampi', 'McLeod Ganj'],
      'medium': ['Jaipur', 'Kerala', 'Goa', 'Udaipur', 'Manali'],
      'high': ['Rajasthan Palaces', 'Kashmir', 'Andaman Islands', 'Sikkim', 'Coorg'],
      'luxury': ['Rajasthan Heritage Hotels', 'Kerala Luxury Resorts', 'Goa Luxury Resorts', 'Himalayan Luxury Retreats', 'Palace Hotels Udaipur']
    };
    
    const normalizedBudget = budget.toLowerCase();
    for (const key in budgetMap) {
      if (normalizedBudget.includes(key)) {
        return budgetMap[key];
      }
    }
    
    return ['Delhi', 'Agra', 'Jaipur', 'Kerala', 'Goa'];
  };
  
  // Get Indian travel recommendations based on trip style
  const getTravelRecommendationsByStyle = (style: string): string[] => {
    const styleMap: Record<string, string[]> = {
      'solo': ['Rishikesh', 'Varanasi', 'Hampi', 'Manali', 'Pushkar'],
      'couple': ['Udaipur', 'Kerala', 'Goa', 'Shimla', 'Coorg'],
      'family': ['Kerala', 'Goa', 'Rajasthan', 'Himachal Pradesh', 'Karnataka'],
      'friends': ['Goa', 'Manali', 'Rishikesh', 'Jaisalmer', 'Andaman Islands'],
      'luxury': ['Rajasthan Palace Hotels', 'Kerala Luxury Resorts', 'Kashmir Houseboats', 'Goa Luxury Resorts', 'Himalayan Luxury Lodges']
    };
    
    const normalizedStyle = style.toLowerCase();
    for (const key in styleMap) {
      if (normalizedStyle.includes(key)) {
        return styleMap[key];
      }
    }
    
    return ['Delhi', 'Agra', 'Jaipur', 'Kerala', 'Goa'];
  };
  
  // Update preferences based on user input
  const updateTravelPreferences = (userMessage: string) => {
    console.log('Updating travel preferences for message:', userMessage);
    const lowerMsg = userMessage.toLowerCase();
    
    // Check for genre/interests
    const genrePatterns = [
      { regex: /\b(cultur|museum|histor|heritage|monument|temple|fort|palace)\w*\b/i, value: 'cultural' },
      { regex: /\b(adventure|hiking|trek|thrilling|exciting|mountain|river)\w*\b/i, value: 'adventure' },
      { regex: /\b(relax|calm|peaceful|spa|restful|beach|backwater)\w*\b/i, value: 'relaxation' },
      { regex: /\b(food|cuisine|gastronom|culinary|eat|spice|street food)\w*\b/i, value: 'food' },
      { regex: /\b(nature|wildlife|outdoors|landscape|scenic|forest|national park)\w*\b/i, value: 'nature' },
      { regex: /\b(spiritual|religious|temple|ashram|meditation|yoga)\w*\b/i, value: 'spiritual' },
      { regex: /\b(beach|ocean|sea|coast|marine|island)\w*\b/i, value: 'beach' },
      { regex: /\b(mountain|hill|valley|peak|himalaya|snowfall)\w*\b/i, value: 'mountain' },
      { regex: /\b(heritage|monument|fort|palace|architecture|ancient)\w*\b/i, value: 'heritage' }
    ];
    
    for (const pattern of genrePatterns) {
      if (pattern.regex.test(lowerMsg)) {
        console.log('Detected genre:', pattern.value);
        setTravelPreferences(prev => ({ ...prev, genre: pattern.value }));
        break;
      }
    }
    
    // Check for budget
    const budgetPatterns = [
      { regex: /\b(cheap|budget|affordable|inexpensive|low cost|low budget|backpack)\w*\b/i, value: 'low' },
      { regex: /\b(moderate|reasonable|medium budget|mid-range)\w*\b/i, value: 'medium' },
      { regex: /\b(expensive|high budget|premium|high-end)\w*\b/i, value: 'high' },
      { regex: /\b(luxury|luxurious|exclusive|deluxe|extravagant|palace|resort)\w*\b/i, value: 'luxury' }
    ];
    
    for (const pattern of budgetPatterns) {
      if (pattern.regex.test(lowerMsg)) {
        console.log('Detected budget:', pattern.value);
        setTravelPreferences(prev => ({ ...prev, budget: pattern.value }));
        break;
      }
    }
    
    // Check for trip style
    const stylePatterns = [
      { regex: /\b(solo|alone|by myself)\w*\b/i, value: 'solo' },
      { regex: /\b(couple|romantic|honeymoon|anniversary)\w*\b/i, value: 'couple' },
      { regex: /\b(family|kids|children|family-friendly)\w*\b/i, value: 'family' },
      { regex: /\b(friends|group|party|bachelor|bachelorette)\w*\b/i, value: 'friends' }
    ];
    
    for (const pattern of stylePatterns) {
      if (pattern.regex.test(lowerMsg)) {
        console.log('Detected style:', pattern.value);
        setTravelPreferences(prev => ({ ...prev, style: pattern.value }));
        break;
      }
    }
  };

  const getDestinationRecommendations = () => {
    console.log('Getting destination recommendations with preferences:', travelPreferences);
    let recommendations: string[] = [];
    const { genre, budget, style } = travelPreferences;
    
    if (genre) {
      recommendations = recommendations.concat(getTravelRecommendationsByGenre(genre));
    }
    
    if (budget) {
      recommendations = recommendations.concat(getTravelRecommendationsByBudget(budget));
    }
    
    if (style) {
      recommendations = recommendations.concat(getTravelRecommendationsByStyle(style));
    }
    
    // If we have multiple criteria, try to find places that match all
    if (recommendations.length > 0) {
      // Count occurrences to find matches across multiple criteria
      const destinationCounts: Record<string, number> = {};
      recommendations.forEach(place => {
        destinationCounts[place] = (destinationCounts[place] || 0) + 1;
      });
      
      // Sort by count (higher first) and then take top 5
      recommendations = Object.keys(destinationCounts)
        .sort((a, b) => destinationCounts[b] - destinationCounts[a])
        .slice(0, 5);
    } else {
      // Default recommendations if no preferences detected
      recommendations = [
        'Delhi',
        'Agra',
        'Jaipur',
        'Kerala',
        'Goa'
      ];
    }
    
    console.log('Final recommendations:', recommendations);
    return recommendations;
  };

  const generateBotResponse = async (userMessage: string): Promise<{ message: string; suggestions: SuggestedReplyType[] }> => {
    console.log('Generating bot response for:', userMessage);
    const lowerCaseMsg = userMessage.toLowerCase().trim();
    
    // Update travel preferences based on the message
    updateTravelPreferences(userMessage);
    
    // Handle specific input messages - exact matching first
    if (lowerCaseMsg === 'popular indian destinations' || lowerCaseMsg === 'popular destinations') {
      console.log('Handling popular Indian destinations request');
      return {
        message: "Here are some of the most popular travel destinations in India:\n\n" +
                "🏛️ **Delhi** - India's capital with Red Fort, India Gate, and rich Mughal heritage\n" +
                "🕌 **Agra** - Home to the iconic Taj Mahal and Agra Fort\n" +
                "🏰 **Jaipur** - The Pink City with majestic palaces and forts\n" +
                "🌴 **Kerala** - God's Own Country with backwaters and spice plantations\n" +
                "🏖️ **Goa** - Beautiful beaches and Portuguese colonial charm\n\n" +
                "Which destination interests you most? I can provide detailed information about any of these places!",
        suggestions: [
          { id: '1', text: 'Tell me about Delhi' },
          { id: '2', text: 'Tell me about Kerala' },
          { id: '3', text: 'Tell me about Rajasthan' },
          { id: '4', text: 'Budget travel in India' }
        ]
      };
    }
    
    // Handle "India travel packages" suggestion
    if (lowerCaseMsg === 'india travel packages' || lowerCaseMsg === 'travel packages') {
      console.log('Handling India travel packages request');
      return {
        message: 'I can help you find the perfect India travel package! What type of Indian experience are you looking for?',
        suggestions: [
          { id: '1', text: 'Golden Triangle tour' },
          { id: '2', text: 'Kerala backwaters' },
          { id: '3', text: 'Rajasthan heritage' },
          { id: '4', text: 'Himalayan adventure' }
        ],
      };
    }
    
    // Handle "India travel tips" suggestion
    if (lowerCaseMsg === 'india travel tips' || lowerCaseMsg === 'travel tips') {
      console.log('Handling India travel tips request');
      return {
        message: 'Here are essential tips for traveling in India:\n\n' +
                '🛂 **Before You Go:**\n' +
                '• Get an e-Visa or tourist visa in advance\n' +
                '• Vaccinations recommended (consult your doctor)\n' +
                '• Best time: October to March for most regions\n\n' +
                '💰 **Money & Budget:**\n' +
                '• Carry cash (INR) - many places don\'t accept cards\n' +
                '• Bargaining is common in markets\n' +
                '• Tipping is appreciated (10-15%)\n\n' +
                '🍛 **Food & Health:**\n' +
                '• Drink bottled water\n' +
                '• Try street food but choose busy stalls\n' +
                '• Vegetarian options available everywhere\n\n' +
                'What specific aspect would you like more tips about?',
        suggestions: [
          { id: '1', text: 'Food safety in India' },
          { id: '2', text: 'Transportation in India' },
          { id: '3', text: 'Cultural etiquette' },
          { id: '4', text: 'Budget planning' }
        ],
      };
    }

    // Handle more specific suggestion responses
    if (lowerCaseMsg === 'golden triangle tour') {
      console.log('Handling Golden Triangle tour request');
      return {
        message: `🔺 **Golden Triangle Tour - India's Classic Circuit**\n\n**Delhi → Agra → Jaipur**\n\n🏛️ **Delhi (2-3 days)** - Red Fort, India Gate, Qutub Minar, Humayun's Tomb\n🕌 **Agra (1-2 days)** - Taj Mahal, Agra Fort, Mehtab Bagh\n🏰 **Jaipur (2-3 days)** - Hawa Mahal, City Palace, Amber Fort\n\n**Duration:** 6-8 days\n**Best Time:** October to March\n**Budget:** ₹15,000 - ₹50,000 per person\n\nWould you like a detailed itinerary for any city?`,
        suggestions: [
          { id: '1', text: 'Delhi detailed itinerary' },
          { id: '2', text: 'Best time to visit Golden Triangle' },
          { id: '3', text: 'Golden Triangle budget breakdown' },
          { id: '4', text: 'Transportation options' }
        ]
      };
    }

    if (lowerCaseMsg === 'kerala backwaters') {
      console.log('Handling Kerala backwaters request');
      return {
        message: `🌴 **Kerala Backwaters - Nature's Paradise**\n\n**Top Backwater Destinations:**\n\n🚤 **Alleppey** - Houseboat cruises and paddy fields\n🏞️ **Kumarakom** - Bird sanctuary and luxury resorts\n🌿 **Kollam** - Ashtamudi Lake and coconut groves\n🎣 **Kottayam** - Vembanad Lake and spice plantations\n\n**Experience:** Traditional houseboat stays, canoe rides, village visits\n**Best Time:** December to February\n**Duration:** 3-5 days\n\nWhat aspect of Kerala interests you most?`,
        suggestions: [
          { id: '1', text: 'Houseboat experience' },
          { id: '2', text: 'Kerala cuisine' },
          { id: '3', text: 'Ayurveda in Kerala' },
          { id: '4', text: 'Kerala hill stations' }
        ]
      };
    }

    if (lowerCaseMsg === 'rajasthan heritage') {
      console.log('Handling Rajasthan heritage request');
      return {
        message: `🏰 **Rajasthan Heritage - Land of Kings**\n\n**Royal Cities to Explore:**\n\n👑 **Jaipur** - Pink City with City Palace and Hawa Mahal\n🏛️ **Udaipur** - City of Lakes with magnificent palaces\n🏜️ **Jaisalmer** - Golden City with desert safari\n🕌 **Jodhpur** - Blue City with Mehrangarh Fort\n🎪 **Pushkar** - Holy city with camel fair\n\n**Highlights:** Palace hotels, desert camps, folk performances, traditional crafts\n**Best Time:** October to March\n\nWhich royal city would you like to explore first?`,
        suggestions: [
          { id: '1', text: 'Udaipur palace hotels' },
          { id: '2', text: 'Jaisalmer desert safari' },
          { id: '3', text: 'Rajasthan cultural experiences' },
          { id: '4', text: 'Best Rajasthan itinerary' }
        ]
      };
    }

    if (lowerCaseMsg === 'himalayan adventure') {
      console.log('Handling Himalayan adventure request');
      return {
        message: `🏔️ **Himalayan Adventure - Mountain Majesty**\n\n**Adventure Destinations:**\n\n❄️ **Leh-Ladakh** - High altitude desert and monasteries\n🏔️ **Manali** - Snow peaks and adventure sports\n🧘 **Rishikesh** - Yoga capital and white water rafting\n🌸 **Dharamshala** - Dalai Lama's residence and trekking\n🚠 **Shimla** - Hill station and toy train rides\n\n**Activities:** Trekking, river rafting, paragliding, monastery visits\n**Best Time:** May to October (varies by region)\n\nWhat type of mountain adventure excites you?`,
        suggestions: [
          { id: '1', text: 'Leh-Ladakh road trip' },
          { id: '2', text: 'Himalayan trekking' },
          { id: '3', text: 'Adventure sports in India' },
          { id: '4', text: 'Mountain weather info' }
        ]
      };
    }
    
    // Handle weather queries with India focus
    const weatherRegex = /weather\s+(?:in|at|for)?\s+([a-zA-Z\s]+)/i;
    const weatherMatch = userMessage.match(weatherRegex);
    
    if (lowerCaseMsg.includes('weather') && weatherMatch && weatherMatch[1]) {
      console.log('Handling weather request for:', weatherMatch[1]);
      const city = weatherMatch[1].trim();
      const weather = await fetchWeatherData(city);
      
      if (weather) {
        setWeatherData(weather);
        return {
          message: `Currently in ${weather.city}, it's ${weather.temp.toFixed(1)}°C with ${weather.description}. The humidity is ${weather.humidity}% and wind speed is ${weather.windSpeed} m/s.\n\nWould you like travel information for ${weather.city}?`,
          suggestions: [
            { id: '1', text: `Things to do in ${weather.city}` },
            { id: '2', text: `Best time to visit ${weather.city}` },
            { id: '3', text: `${weather.city} travel guide` },
            { id: '4', text: 'Similar Indian destinations' },
          ],
        };
      } else {
        return {
          message: `I couldn't find weather information for "${city}". Please check the city name and try again. I specialize in Indian destinations!`,
          suggestions: [
            { id: '1', text: 'Weather in Delhi' },
            { id: '2', text: 'Weather in Mumbai' },
            { id: '3', text: 'Weather in Kerala' },
            { id: '4', text: 'Popular Indian destinations' },
          ],
        };
      }
    }
    
    // Handle "Tell me about X" for Indian destinations
    const tellMeAboutRegex = /tell me about\s+([a-zA-Z\s,]+)/i;
    const tellMeAboutMatch = userMessage.match(tellMeAboutRegex);

    if (tellMeAboutMatch && tellMeAboutMatch[1]) {
      console.log('Handling tell me about request for:', tellMeAboutMatch[1]);
      const destination = tellMeAboutMatch[1].trim();
      
      // Indian destination information database
      const destinationInfo: Record<string, { info: string; highlights: string[] }> = {
        'delhi': {
          info: 'Delhi, India\'s capital, is a vibrant metropolis blending ancient history with modernity. From Mughal monuments to bustling markets, Delhi offers an incredible cultural experience.',
          highlights: ['Red Fort', 'India Gate', 'Qutub Minar', 'Lotus Temple', 'Chandni Chowk']
        },
        'agra': {
          info: 'Agra is home to the magnificent Taj Mahal, one of the Seven Wonders of the World. This Mughal city showcases some of India\'s finest architectural treasures.',
          highlights: ['Taj Mahal', 'Agra Fort', 'Mehtab Bagh', 'Fatehpur Sikri', 'Itmad-ud-Daulah']
        },
        'jaipur': {
          info: 'Jaipur, the Pink City, is Rajasthan\'s capital known for its royal palaces, vibrant culture, and magnificent forts that showcase Rajput architecture.',
          highlights: ['Hawa Mahal', 'City Palace', 'Amber Fort', 'Jantar Mantar', 'Nahargarh Fort']
        },
        'kerala': {
          info: 'Kerala, God\'s Own Country, is famous for its backwaters, spice plantations, Ayurvedic treatments, and pristine beaches along the Arabian Sea.',
          highlights: ['Backwaters', 'Munnar hill station', 'Alleppey houseboats', 'Cochin heritage', 'Periyar wildlife']
        },
        'goa': {
          info: 'Goa combines Portuguese colonial charm with beautiful beaches, vibrant nightlife, and delicious seafood cuisine.',
          highlights: ['Baga Beach', 'Old Goa churches', 'Dudhsagar Falls', 'Spice plantations', 'Anjuna market']
        },
        'rajasthan': {
          info: 'Rajasthan, the Land of Kings, is India\'s largest state known for its desert landscapes, magnificent palaces, colorful culture, and royal heritage.',
          highlights: ['Jaipur palaces', 'Udaipur lakes', 'Jaisalmer desert', 'Jodhpur fort', 'Pushkar temples']
        }
      };
      
      let info = '';
      let highlights: string[] = [];
      
      // Try to match the destination with our database
      for (const key in destinationInfo) {
        if (destination.toLowerCase().includes(key)) {
          info = destinationInfo[key].info;
          highlights = destinationInfo[key].highlights;
          break;
        }
      }
      
      if (info) {
        const highlightText = highlights.map(h => `• ${h}`).join('\n');
        return {
          message: `**${destination}** 🇮🇳\n\n${info}\n\n**Top Highlights:**\n${highlightText}\n\nWhat would you like to know more about?`,
          suggestions: [
            { id: '1', text: `Weather in ${destination}` },
            { id: '2', text: `Things to do in ${destination}` },
            { id: '3', text: `Best time to visit ${destination}` },
            { id: '4', text: 'Similar Indian destinations' }
          ]
        };
      } else {
        return {
          message: `I'd love to help you learn about ${destination}! While I don't have specific details about that destination yet, I can help you with popular Indian destinations and travel planning.`,
          suggestions: [
            { id: '1', text: 'Popular Indian destinations' },
            { id: '2', text: 'Cultural experiences in India' },
            { id: '3', text: 'Budget travel in India' },
            { id: '4', text: 'India travel tips' }
          ]
        };
      }
    }
    
    // Handle travel recommendations
    if (lowerCaseMsg.includes('recommend') || 
        lowerCaseMsg.includes('suggestion') || 
        lowerCaseMsg.includes('where should i go') || 
        lowerCaseMsg.includes('place to visit')) {
      
      console.log('Handling recommendation request');
      const recommendations = getDestinationRecommendations();
      const { genre, budget, style } = travelPreferences;
      
      let preferencesText = 'Based on popular Indian destinations';
      if (genre || budget || style) {
        preferencesText = 'Based on your preferences for India travel';
        if (genre) preferencesText += ` for ${genre} experiences`;
        if (budget) preferencesText += ` with a ${budget} budget`;
        if (style) preferencesText += ` and ${style} travel style`;
      }
      
      return {
        message: `${preferencesText}, here are my top Indian recommendations:\n\n` + 
                 `🇮🇳 **${recommendations[0]}**\n` +
                 `🇮🇳 **${recommendations[1]}**\n` +
                 `🇮🇳 **${recommendations[2]}**\n` +
                 `🇮🇳 **${recommendations[3]}**\n` +
                 `🇮🇳 **${recommendations[4]}**\n\n` +
                 `Which Indian destination would you like to explore further?`,
        suggestions: [
          { id: '1', text: `Tell me about ${recommendations[0]}` },
          { id: '2', text: `Tell me about ${recommendations[1]}` },
          { id: '3', text: 'Refine my India preferences' },
          { id: '4', text: 'Budget travel in India' }
        ]
      };
    }

    // Handle preference and interest queries
    if (lowerCaseMsg.includes('what are your travel preferences') || 
        lowerCaseMsg.includes('refine my preferences') ||
        lowerCaseMsg.includes('travel preferences') ||
        lowerCaseMsg.includes('type of trip')) {
      
      console.log('Handling travel preferences request');
      return {
        message: 'Let me help you find the perfect travel experience! What interests you most?',
        suggestions: [
          { id: '1', text: 'Cultural experiences' },
          { id: '2', text: 'Adventure activities' },
          { id: '3', text: 'Beach relaxation' },
          { id: '4', text: 'Food & culinary' }
        ]
      };
    }

    // Handle activity-based queries
    if (lowerCaseMsg.includes('things to do in')) {
      const cityMatch = userMessage.match(/things to do in\s+([a-zA-Z\s,]+)/i);
      if (cityMatch && cityMatch[1]) {
        const city = cityMatch[1].trim();
        console.log('Handling things to do request for:', city);
        return {
          message: `Here are top activities in ${city}, India:\n\n🏛️ **Historical sites** - Visit monuments and heritage buildings\n🎨 **Cultural experiences** - Museums, art galleries, and local traditions\n🍽️ **Local cuisine** - Try authentic Indian restaurants and street food\n🛍️ **Shopping** - Local markets, handicrafts, and textiles\n🎭 **Local culture** - Festivals, performances, and traditions\n\nWhat type of activity interests you most?`,
          suggestions: [
            { id: '1', text: `Historical sites in ${city}` },
            { id: '2', text: `Local food in ${city}` },
            { id: '3', text: `Shopping in ${city}` },
            { id: '4', text: `Weather in ${city}` }
          ]
        };
      }
    }

    // Handle "Best time to visit" queries
    if (lowerCaseMsg.includes('best time to visit')) {
      const cityMatch = userMessage.match(/best time to visit\s+([a-zA-Z\s,]+)/i);
      if (cityMatch && cityMatch[1]) {
        const city = cityMatch[1].trim();
        console.log('Handling best time to visit request for:', city);
        return {
          message: `**Best time to visit ${city}, India:**\n\n🌤️ **October-March** - Pleasant weather, peak tourist season\n☀️ **Summer (Apr-Jun)** - Hot weather, fewer crowds\n🌧️ **Monsoon (Jul-Sep)** - Rainy season, lush landscapes\n❄️ **Winter (Nov-Feb)** - Cool and comfortable, ideal for sightseeing\n\nNote: Best time varies by region in India. Northern plains are best in winter, while some hill stations are perfect in summer!`,
          suggestions: [
            { id: '1', text: `Weather in ${city}` },
            { id: '2', text: `${city} travel tips` },
            { id: '3', text: `Things to do in ${city}` },
            { id: '4', text: 'Seasonal travel advice for India' }
          ]
        };
      }
    }

    // Handle specific travel types
    if (lowerCaseMsg.includes('beach vacation') || lowerCaseMsg.includes('beach holiday')) {
      console.log('Handling beach vacation request');
      return {
        message: '🏖️ **Beach Paradise Awaits!**\n\nPerfect beach destinations for sun, sand, and relaxation:\n\n🏝️ **Tropical:** Maldives, Bali, Fiji\n🌊 **Mediterranean:** Amalfi Coast, Santorini, Costa del Sol\n🐚 **Exotic:** Seychelles, Mauritius, Cook Islands\n\nWhat type of beach experience appeals to you?',
        suggestions: [
          { id: '1', text: 'Tropical paradise' },
          { id: '2', text: 'Mediterranean beaches' },
          { id: '3', text: 'Family beach destinations' },
          { id: '4', text: 'Luxury beach resorts' }
        ],
      };
    }

    // Default response for unclear queries
    console.log('Using default response');
    return {
      message: "Namaste! I'm here to help you explore incredible India! 🇮🇳\n\nI can assist you with:\n• 🏛️ **Popular Indian destinations** like Delhi, Agra, Kerala, Rajasthan\n• 🌤️ **Weather information** for Indian cities\n• 💡 **India-specific travel tips** and cultural guidance\n• 💰 **Budget-friendly options** across India\n• 🎯 **Activity suggestions** for Indian destinations\n\nWhat aspect of India would you like to explore?",
      suggestions: [
        { id: '1', text: 'Popular Indian destinations' },
        { id: '2', text: 'India travel tips' },
        { id: '3', text: 'Golden Triangle tour' },
        { id: '4', text: 'Kerala backwaters' }
      ],
    };
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    
    console.log('Sending message:', content);
    
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear suggested replies temporarily
    setSuggestedReplies([]);
    
    // Simulate bot thinking
    setTimeout(async () => {
      try {
        const { message, suggestions } = await generateBotResponse(content);
        
        console.log('Bot response generated:', message);
        console.log('New suggestions:', suggestions);
        
        // Add bot response
        const botMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          content: message,
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botMessage]);
        setSuggestedReplies(suggestions);
      } catch (error) {
        console.error('Error generating bot response:', error);
        
        // Fallback response in case of error
        const errorMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          content: "I apologize, but I'm having trouble processing your request right now. Please try asking about Indian destinations, travel tips, or weather information!",
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, errorMessage]);
        setSuggestedReplies([
          { id: '1', text: 'Popular Indian destinations' },
          { id: '2', text: 'India travel tips' },
          { id: '3', text: 'Budget travel in India' },
        ]);
      }
    }, 1000);
  };

  const value = {
    isOpen,
    messages,
    suggestedReplies,
    toggleChat,
    sendMessage,
    closeChat,
    weatherData,
    travelPreferences,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
