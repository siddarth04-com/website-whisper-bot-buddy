
import { TravelPreferences } from './types';
import { getDestinationDetails } from './travelUtils';

export interface DynamicItineraryDay {
  day: number;
  location: string;
  activities: ActivityItem[];
  accommodation?: AccommodationSuggestion;
  meals?: MealSuggestion[];
  transportation?: TransportationInfo;
  budget?: DayBudget;
  tips?: string[];
}

export interface ActivityItem {
  name: string;
  duration: string;
  cost: string;
  description: string;
  bestTime: string;
  category: string;
}

export interface AccommodationSuggestion {
  name: string;
  type: string;
  priceRange: string;
  location: string;
  amenities: string[];
}

export interface MealSuggestion {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recommendation: string;
  cuisine: string;
  budget: string;
  location: string;
}

export interface TransportationInfo {
  mode: string;
  duration: string;
  cost: string;
  details: string;
}

export interface DayBudget {
  activities: number;
  meals: number;
  transport: number;
  accommodation: number;
  total: number;
}

export interface DynamicItinerary {
  title: string;
  overview: string;
  duration: number;
  totalBudget: BudgetBreakdown;
  days: DynamicItineraryDay[];
  recommendations: string[];
  bestTimeToVisit: string;
  essentialTips: string[];
}

export interface BudgetBreakdown {
  low: number;
  medium: number;
  high: number;
  luxury: number;
  currency: string;
}

export const generateDynamicItinerary = (
  userRequest: string,
  preferences: TravelPreferences,
  conversationHistory: string[]
): DynamicItinerary => {
  console.log('Generating dynamic itinerary for:', userRequest);
  
  const analysis = analyzeUserRequest(userRequest, preferences, conversationHistory);
  const structure = buildItineraryStructure(analysis);
  
  return createDetailedItinerary(structure, analysis);
};

interface RequestAnalysis {
  destinations: string[];
  duration: number;
  interests: string[];
  budget: string;
  travelStyle: string;
  specificRequests: string[];
  seasonality: string;
  groupSize: number;
}

const analyzeUserRequest = (
  request: string,
  preferences: TravelPreferences,
  history: string[]
): RequestAnalysis => {
  const lowerRequest = request.toLowerCase();
  
  // Extract destinations with better pattern matching
  const destinations = extractAdvancedDestinations(lowerRequest, history);
  
  // Extract duration with multiple patterns
  const duration = extractDynamicDuration(lowerRequest);
  
  // Extract interests from request and conversation
  const interests = extractDetailedInterests(lowerRequest, preferences, history);
  
  // Extract budget with context
  const budget = extractContextualBudget(lowerRequest, preferences, history);
  
  // Extract travel style
  const travelStyle = extractTravelStyle(lowerRequest, preferences);
  
  // Extract specific requests
  const specificRequests = extractSpecificRequests(lowerRequest);
  
  // Determine seasonality
  const seasonality = extractSeasonality(lowerRequest, history);
  
  // Extract group size
  const groupSize = extractGroupSize(lowerRequest, travelStyle);
  
  return {
    destinations,
    duration,
    interests,
    budget,
    travelStyle,
    specificRequests,
    seasonality,
    groupSize
  };
};

const extractAdvancedDestinations = (request: string, history: string[]): string[] => {
  const destinations: string[] = [];
  
  // Indian destinations with aliases
  const destinationMap = {
    'delhi': ['delhi', 'new delhi', 'old delhi'],
    'mumbai': ['mumbai', 'bombay'],
    'bangalore': ['bangalore', 'bengaluru'],
    'kolkata': ['kolkata', 'calcutta'],
    'chennai': ['chennai', 'madras'],
    'jaipur': ['jaipur', 'pink city'],
    'agra': ['agra', 'taj mahal city'],
    'goa': ['goa', 'beaches'],
    'kerala': ['kerala', 'backwaters', 'gods own country'],
    'rajasthan': ['rajasthan', 'desert state'],
    'himachal': ['himachal', 'himachal pradesh', 'mountains'],
    'uttarakhand': ['uttarakhand', 'devbhoomi'],
    'kashmir': ['kashmir', 'srinagar', 'dal lake'],
    'ladakh': ['ladakh', 'leh', 'high altitude'],
    'manali': ['manali', 'hill station'],
    'shimla': ['shimla', 'summer capital'],
    'rishikesh': ['rishikesh', 'yoga capital'],
    'varanasi': ['varanasi', 'benaras', 'spiritual city'],
    'udaipur': ['udaipur', 'city of lakes'],
    'jodhpur': ['jodhpur', 'blue city'],
    'jaisalmer': ['jaisalmer', 'golden city'],
    'kochi': ['kochi', 'cochin'],
    'alleppey': ['alleppey', 'alappuzha'],
    'munnar': ['munnar', 'tea gardens'],
    'darjeeling': ['darjeeling', 'tea hills'],
    'gangtok': ['gangtok', 'sikkim'],
    'mysore': ['mysore', 'mysuru'],
    'hampi': ['hampi', 'ruins'],
    'pushkar': ['pushkar', 'holy city'],
    'mcleodganj': ['mcleodganj', 'dharamshala', 'little tibet']
  };
  
  // Check for destinations in request
  Object.entries(destinationMap).forEach(([city, aliases]) => {
    if (aliases.some(alias => request.includes(alias))) {
      destinations.push(city);
    }
  });
  
  // Check conversation history for context
  const historyText = history.join(' ').toLowerCase();
  Object.entries(destinationMap).forEach(([city, aliases]) => {
    if (aliases.some(alias => historyText.includes(alias)) && !destinations.includes(city)) {
      destinations.push(city);
    }
  });
  
  // Default destinations based on request type
  if (destinations.length === 0) {
    if (request.includes('golden triangle')) {
      destinations.push('delhi', 'agra', 'jaipur');
    } else if (request.includes('south india')) {
      destinations.push('bangalore', 'mysore', 'kochi');
    } else if (request.includes('north india')) {
      destinations.push('delhi', 'jaipur', 'agra');
    } else if (request.includes('beach')) {
      destinations.push('goa');
    } else if (request.includes('mountain') || request.includes('hill')) {
      destinations.push('manali', 'shimla');
    } else if (request.includes('spiritual')) {
      destinations.push('rishikesh', 'varanasi');
    } else {
      destinations.push('delhi', 'agra'); // Default
    }
  }
  
  return destinations;
};

const extractDynamicDuration = (request: string): number => {
  // Multiple patterns for duration extraction
  const patterns = [
    /(\d+)\s*days?/i,
    /(\d+)\s*day/i,
    /(\d+)\s*nights?/i,
    /(\d+)\s*week/i,
    /(\d+)\s*month/i
  ];
  
  for (const pattern of patterns) {
    const match = request.match(pattern);
    if (match) {
      let days = parseInt(match[1]);
      if (request.includes('week')) days *= 7;
      if (request.includes('month')) days *= 30;
      return days;
    }
  }
  
  // Context-based duration
  if (request.includes('weekend')) return 2;
  if (request.includes('short trip') || request.includes('quick')) return 3;
  if (request.includes('long trip') || request.includes('extended')) return 14;
  if (request.includes('honeymoon')) return 10;
  if (request.includes('family vacation')) return 7;
  
  return 7; // Default
};

const extractDetailedInterests = (
  request: string,
  preferences: TravelPreferences,
  history: string[]
): string[] => {
  const interests: string[] = [];
  
  // Primary interests
  const interestPatterns = {
    'cultural': ['culture', 'heritage', 'history', 'monument', 'museum', 'temple', 'fort', 'palace'],
    'adventure': ['adventure', 'trekking', 'hiking', 'rafting', 'skiing', 'climbing', 'extreme'],
    'relaxation': ['relax', 'spa', 'wellness', 'peaceful', 'calm', 'meditation', 'yoga'],
    'food': ['food', 'cuisine', 'culinary', 'street food', 'restaurant', 'cooking', 'spices'],
    'nature': ['nature', 'wildlife', 'forest', 'national park', 'safari', 'birds', 'animals'],
    'spiritual': ['spiritual', 'pilgrimage', 'temple', 'ashram', 'meditation', 'religious'],
    'beach': ['beach', 'ocean', 'sea', 'coast', 'water sports', 'swimming', 'surfing'],
    'mountain': ['mountain', 'hill', 'peak', 'valley', 'snow', 'altitude', 'trekking'],
    'photography': ['photography', 'photo', 'instagram', 'scenic', 'landscape', 'portrait'],
    'shopping': ['shopping', 'market', 'bazaar', 'handicraft', 'souvenir', 'textile'],
    'nightlife': ['nightlife', 'party', 'club', 'bar', 'entertainment', 'music'],
    'luxury': ['luxury', 'premium', 'five star', 'exclusive', 'high end', 'royal']
  };
  
  // Check request and history
  const combinedText = (request + ' ' + history.join(' ')).toLowerCase();
  
  Object.entries(interestPatterns).forEach(([interest, keywords]) => {
    if (keywords.some(keyword => combinedText.includes(keyword))) {
      interests.push(interest);
    }
  });
  
  // Add from preferences
  if (preferences.genre && !interests.includes(preferences.genre)) {
    interests.push(preferences.genre);
  }
  
  return interests.length > 0 ? interests : ['cultural'];
};

const extractContextualBudget = (
  request: string,
  preferences: TravelPreferences,
  history: string[]
): string => {
  if (preferences.budget) return preferences.budget;
  
  const budgetKeywords = {
    'low': ['budget', 'cheap', 'affordable', 'backpack', 'economical', 'low cost'],
    'medium': ['moderate', 'mid range', 'reasonable', 'standard', 'average'],
    'high': ['expensive', 'premium', 'high end', 'upscale', 'quality'],
    'luxury': ['luxury', 'luxurious', 'five star', 'exclusive', 'royal', 'palace']
  };
  
  const combinedText = (request + ' ' + history.join(' ')).toLowerCase();
  
  for (const [budget, keywords] of Object.entries(budgetKeywords)) {
    if (keywords.some(keyword => combinedText.includes(keyword))) {
      return budget;
    }
  }
  
  return 'medium';
};

const extractTravelStyle = (request: string, preferences: TravelPreferences): string => {
  if (preferences.style) return preferences.style;
  
  const styleKeywords = {
    'solo': ['solo', 'alone', 'by myself', 'independent'],
    'couple': ['couple', 'romantic', 'honeymoon', 'partner', 'together'],
    'family': ['family', 'kids', 'children', 'parents', 'family friendly'],
    'friends': ['friends', 'group', 'gang', 'buddies', 'together']
  };
  
  for (const [style, keywords] of Object.entries(styleKeywords)) {
    if (keywords.some(keyword => request.toLowerCase().includes(keyword))) {
      return style;
    }
  }
  
  return 'solo';
};

const extractSpecificRequests = (request: string): string[] => {
  const requests: string[] = [];
  
  // Specific request patterns
  if (request.includes('avoid')) {
    const avoidMatch = request.match(/avoid\s+([^.]+)/i);
    if (avoidMatch) requests.push(`Avoid: ${avoidMatch[1].trim()}`);
  }
  
  if (request.includes('must visit') || request.includes('must see')) {
    const mustMatch = request.match(/must (?:visit|see)\s+([^.]+)/i);
    if (mustMatch) requests.push(`Must visit: ${mustMatch[1].trim()}`);
  }
  
  if (request.includes('include')) {
    const includeMatch = request.match(/include\s+([^.]+)/i);
    if (includeMatch) requests.push(`Include: ${includeMatch[1].trim()}`);
  }
  
  return requests;
};

const extractSeasonality = (request: string, history: string[]): string => {
  const seasonKeywords = {
    'winter': ['winter', 'december', 'january', 'february', 'cold', 'snow'],
    'spring': ['spring', 'march', 'april', 'pleasant', 'flowers'],
    'summer': ['summer', 'may', 'june', 'july', 'hot', 'vacation'],
    'monsoon': ['monsoon', 'august', 'september', 'rain', 'wet'],
    'autumn': ['autumn', 'october', 'november', 'cool', 'festival']
  };
  
  const combinedText = (request + ' ' + history.join(' ')).toLowerCase();
  
  for (const [season, keywords] of Object.entries(seasonKeywords)) {
    if (keywords.some(keyword => combinedText.includes(keyword))) {
      return season;
    }
  }
  
  return 'any';
};

const extractGroupSize = (request: string, style: string): number => {
  const sizeMatch = request.match(/(\d+)\s*(?:people|person|traveler|tourist)/i);
  if (sizeMatch) return parseInt(sizeMatch[1]);
  
  switch (style) {
    case 'solo': return 1;
    case 'couple': return 2;
    case 'family': return 4;
    case 'friends': return 4;
    default: return 2;
  }
};

const buildItineraryStructure = (analysis: RequestAnalysis): any => {
  const { destinations, duration, interests, budget } = analysis;
  
  // Distribute days across destinations
  const daysPerDestination = Math.floor(duration / destinations.length);
  const extraDays = duration % destinations.length;
  
  const structure = destinations.map((destination, index) => ({
    destination,
    days: daysPerDestination + (index < extraDays ? 1 : 0),
    interests,
    budget
  }));
  
  return structure;
};

const createDetailedItinerary = (structure: any[], analysis: RequestAnalysis): DynamicItinerary => {
  const days: DynamicItineraryDay[] = [];
  let currentDay = 1;
  
  structure.forEach((destInfo) => {
    for (let i = 0; i < destInfo.days; i++) {
      const day = createDetailedDay(currentDay, destInfo, analysis, i === 0);
      days.push(day);
      currentDay++;
    }
  });
  
  return {
    title: `Custom ${analysis.duration}-Day ${analysis.destinations.join(' & ')} Itinerary`,
    overview: generateDynamicOverview(analysis),
    duration: analysis.duration,
    totalBudget: calculateDynamicBudget(analysis),
    days,
    recommendations: generateSmartRecommendations(analysis),
    bestTimeToVisit: getBestTimeForDestinations(analysis.destinations, analysis.seasonality),
    essentialTips: generateContextualTips(analysis)
  };
};

const createDetailedDay = (
  day: number,
  destInfo: any,
  analysis: RequestAnalysis,
  isArrival: boolean
): DynamicItineraryDay => {
  const activities = generateSmartActivities(destInfo.destination, analysis.interests, analysis.budget, isArrival);
  const accommodation = generateSmartAccommodation(destInfo.destination, analysis.budget, analysis.travelStyle);
  const meals = generateSmartMeals(destInfo.destination, analysis.interests, analysis.budget);
  const transportation = generateSmartTransportation(destInfo.destination, isArrival);
  const budget = calculateDayBudget(activities, meals, transportation, accommodation, analysis.budget);
  const tips = generateDayTips(destInfo.destination, analysis.interests, analysis.seasonality);
  
  return {
    day,
    location: destInfo.destination,
    activities,
    accommodation: isArrival ? accommodation : undefined,
    meals,
    transportation: isArrival ? transportation : undefined,
    budget,
    tips
  };
};

const generateSmartActivities = (
  destination: string,
  interests: string[],
  budget: string,
  isArrival: boolean
): ActivityItem[] => {
  // This would be enhanced with real destination data
  const baseActivities: ActivityItem[] = [
    {
      name: `Explore ${destination} city center`,
      duration: '3-4 hours',
      cost: budget === 'low' ? '₹500-1000' : budget === 'luxury' ? '₹3000-5000' : '₹1500-2500',
      description: `Discover the heart of ${destination} with guided exploration`,
      bestTime: 'Morning',
      category: 'cultural'
    }
  ];
  
  if (isArrival) {
    return [
      {
        name: 'Arrival and check-in',
        duration: '2 hours',
        cost: '₹0',
        description: 'Settle into accommodation and get oriented',
        bestTime: 'Afternoon',
        category: 'logistics'
      },
      {
        name: `Welcome to ${destination}`,
        duration: '2 hours',
        cost: '₹500-1500',
        description: 'Evening stroll and local dinner',
        bestTime: 'Evening',
        category: 'cultural'
      }
    ];
  }
  
  return baseActivities;
};

const generateSmartAccommodation = (
  destination: string,
  budget: string,
  style: string
): AccommodationSuggestion => {
  const budgetMap = {
    'low': { type: 'Guesthouse/Hostel', price: '₹800-1500', amenities: ['WiFi', 'Basic breakfast'] },
    'medium': { type: 'Hotel', price: '₹2500-4500', amenities: ['WiFi', 'Breakfast', 'AC', 'Room service'] },
    'high': { type: 'Premium Hotel', price: '₹6000-10000', amenities: ['WiFi', 'Breakfast', 'AC', 'Spa', 'Pool'] },
    'luxury': { type: 'Luxury Resort', price: '₹15000+', amenities: ['All amenities', 'Butler service', 'Fine dining'] }
  };
  
  const info = budgetMap[budget as keyof typeof budgetMap] || budgetMap.medium;
  
  return {
    name: `${info.type} in ${destination}`,
    type: info.type,
    priceRange: info.price,
    location: `Central ${destination}`,
    amenities: info.amenities
  };
};

const generateSmartMeals = (destination: string, interests: string[], budget: string): MealSuggestion[] => {
  const meals: MealSuggestion[] = [
    {
      mealType: 'breakfast',
      recommendation: 'Local breakfast at hotel/cafe',
      cuisine: 'Indian/Continental',
      budget: budget === 'low' ? '₹200-400' : '₹500-800',
      location: 'Near accommodation'
    },
    {
      mealType: 'lunch',
      recommendation: `Traditional ${destination} cuisine`,
      cuisine: 'Regional Indian',
      budget: budget === 'low' ? '₹300-600' : '₹800-1200',
      location: 'City center'
    }
  ];
  
  if (interests.includes('food')) {
    meals.push({
      mealType: 'dinner',
      recommendation: 'Food tour or specialty restaurant',
      cuisine: 'Local specialties',
      budget: budget === 'low' ? '₹500-800' : '₹1000-2000',
      location: 'Popular food district'
    });
  }
  
  return meals;
};

const generateSmartTransportation = (destination: string, isArrival: boolean): TransportationInfo => {
  if (isArrival) {
    return {
      mode: 'Airport transfer',
      duration: '1-2 hours',
      cost: '₹500-1500',
      details: `Pick up from airport/station to ${destination} accommodation`
    };
  }
  
  return {
    mode: 'Local transport',
    duration: 'As needed',
    cost: '₹200-500',
    details: 'Auto-rickshaw, taxi, or local bus for sightseeing'
  };
};

const calculateDayBudget = (
  activities: ActivityItem[],
  meals: MealSuggestion[],
  transportation: TransportationInfo | undefined,
  accommodation: AccommodationSuggestion | undefined,
  budgetLevel: string
): DayBudget => {
  // Simplified calculation - would be more sophisticated in real implementation
  const multiplier = budgetLevel === 'low' ? 1 : budgetLevel === 'luxury' ? 4 : 2;
  
  return {
    activities: 1500 * multiplier,
    meals: 1000 * multiplier,
    transport: 500 * multiplier,
    accommodation: accommodation ? 2000 * multiplier : 0,
    total: 5000 * multiplier
  };
};

const generateDayTips = (destination: string, interests: string[], seasonality: string): string[] => {
  const tips = [
    `Best explored in the morning when it's cooler`,
    `Bargain at local markets`,
    `Carry water and sunscreen`
  ];
  
  if (seasonality === 'monsoon') {
    tips.push('Carry umbrella and rain gear');
  }
  
  if (interests.includes('photography')) {
    tips.push('Golden hour photography opportunities at sunrise/sunset');
  }
  
  return tips;
};

const generateDynamicOverview = (analysis: RequestAnalysis): string => {
  const { destinations, duration, interests, travelStyle, specificRequests } = analysis;
  
  let overview = `A ${duration}-day personalized journey through ${destinations.join(', ')}`;
  
  if (interests.length > 0) {
    overview += ` focusing on ${interests.join(', ')} experiences`;
  }
  
  overview += ` designed for ${travelStyle} travelers`;
  
  if (specificRequests.length > 0) {
    overview += `. Special considerations: ${specificRequests.join(', ')}`;
  }
  
  overview += '. This itinerary adapts to your preferences and provides authentic local experiences.';
  
  return overview;
};

const calculateDynamicBudget = (analysis: RequestAnalysis): BudgetBreakdown => {
  const { duration, groupSize } = analysis;
  const baseDaily = 3000;
  
  return {
    low: baseDaily * 0.5 * duration * groupSize,
    medium: baseDaily * duration * groupSize,
    high: baseDaily * 2 * duration * groupSize,
    luxury: baseDaily * 4 * duration * groupSize,
    currency: 'INR'
  };
};

const generateSmartRecommendations = (analysis: RequestAnalysis): string[] => {
  const recommendations = [
    'Book accommodations in advance for better rates',
    'Learn basic local phrases for better interactions',
    'Try local street food from busy, clean stalls'
  ];
  
  if (analysis.seasonality === 'monsoon') {
    recommendations.push('Pack waterproof gear and plan indoor alternatives');
  }
  
  if (analysis.interests.includes('photography')) {
    recommendations.push('Wake up early for best lighting and fewer crowds');
  }
  
  if (analysis.budget === 'low') {
    recommendations.push('Use public transport and eat at local dhabas to save money');
  }
  
  return recommendations;
};

const getBestTimeForDestinations = (destinations: string[], seasonality: string): string => {
  if (seasonality !== 'any') {
    const seasonMap = {
      'winter': 'December to February (cool and pleasant)',
      'spring': 'March to April (mild temperatures)',
      'summer': 'May to July (hot, good for hill stations)',
      'monsoon': 'July to September (lush but wet)',
      'autumn': 'October to November (perfect weather)'
    };
    return seasonMap[seasonality as keyof typeof seasonMap] || 'October to March';
  }
  
  // Default best time logic
  if (destinations.some(d => ['goa', 'kerala'].includes(d))) {
    return 'October to March (dry season)';
  }
  if (destinations.some(d => ['manali', 'shimla', 'ladakh'].includes(d))) {
    return 'April to October (mountain season)';
  }
  return 'October to March (best weather for most destinations)';
};

const generateContextualTips = (analysis: RequestAnalysis): string[] => {
  const tips = [
    'Respect local customs and dress codes',
    'Stay hydrated and eat at clean establishments',
    'Keep copies of important documents'
  ];
  
  if (analysis.travelStyle === 'solo') {
    tips.push('Stay in well-reviewed accommodations and share your itinerary with someone');
  }
  
  if (analysis.travelStyle === 'family') {
    tips.push('Plan shorter travel days and include kid-friendly activities');
  }
  
  if (analysis.interests.includes('adventure')) {
    tips.push('Check weather conditions and book adventure activities in advance');
  }
  
  if (analysis.budget === 'luxury') {
    tips.push('Book signature experiences and premium accommodations well in advance');
  }
  
  return tips;
};

export const formatDynamicItinerary = (itinerary: DynamicItinerary): string => {
  let response = `🗓️ **${itinerary.title.toUpperCase()}**\n\n`;
  response += `📋 **OVERVIEW**\n${itinerary.overview}\n\n`;
  
  response += `💰 **BUDGET BREAKDOWN**\n`;
  response += `• Budget: ₹${itinerary.totalBudget.low.toLocaleString()}\n`;
  response += `• Standard: ₹${itinerary.totalBudget.medium.toLocaleString()}\n`;
  response += `• Premium: ₹${itinerary.totalBudget.high.toLocaleString()}\n`;
  response += `• Luxury: ₹${itinerary.totalBudget.luxury.toLocaleString()}\n\n`;
  
  response += `🌡️ **Best Time to Visit:** ${itinerary.bestTimeToVisit}\n\n`;
  
  response += `📅 **DETAILED DAY-BY-DAY ITINERARY**\n\n`;
  
  itinerary.days.forEach(day => {
    response += `**Day ${day.day} - ${day.location}**\n`;
    
    if (day.accommodation) {
      response += `🏨 **Accommodation:** ${day.accommodation.name}\n`;
      response += `📍 Location: ${day.accommodation.location}\n`;
      response += `💰 Price: ${day.accommodation.priceRange}\n`;
      response += `✨ Amenities: ${day.accommodation.amenities.join(', ')}\n\n`;
    }
    
    if (day.transportation) {
      response += `🚗 **Transportation:** ${day.transportation.mode}\n`;
      response += `⏱️ Duration: ${day.transportation.duration}\n`;
      response += `💰 Cost: ${day.transportation.cost}\n\n`;
    }
    
    response += `📍 **Activities:**\n`;
    day.activities.forEach(activity => {
      response += `• **${activity.name}** (${activity.duration})\n`;
      response += `  ${activity.description}\n`;
      response += `  💰 ${activity.cost} | ⏰ ${activity.bestTime}\n`;
    });
    response += `\n`;
    
    if (day.meals && day.meals.length > 0) {
      response += `🍽️ **Meals:**\n`;
      day.meals.forEach(meal => {
        response += `• **${meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}:** ${meal.recommendation}\n`;
        response += `  ${meal.cuisine} | ${meal.budget} | ${meal.location}\n`;
      });
      response += `\n`;
    }
    
    if (day.budget) {
      response += `💰 **Day Budget:** ₹${day.budget.total.toLocaleString()}\n`;
    }
    
    if (day.tips && day.tips.length > 0) {
      response += `💡 **Day Tips:**\n`;
      day.tips.forEach(tip => {
        response += `• ${tip}\n`;
      });
    }
    
    response += `\n`;
  });
  
  response += `🎯 **SMART RECOMMENDATIONS**\n`;
  itinerary.recommendations.forEach(rec => {
    response += `• ${rec}\n`;
  });
  response += `\n`;
  
  response += `💡 **ESSENTIAL TRAVEL TIPS**\n`;
  itinerary.essentialTips.forEach(tip => {
    response += `• ${tip}\n`;
  });
  
  return response;
};
