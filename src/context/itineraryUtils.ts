
import { TravelPreferences } from './types';
import { getDestinationDetails, getDestinationsByState } from './travelUtils';

export interface ItineraryDay {
  day: number;
  date?: string;
  location: string;
  activities: string[];
  accommodation?: string;
  transportation?: string;
  meals?: string[];
  notes?: string;
}

export interface CustomItinerary {
  title: string;
  duration: string;
  totalDays: number;
  estimatedBudget: string;
  bestTime: string;
  overview: string;
  days: ItineraryDay[];
  tips: string[];
}

export const generateCustomItinerary = (
  userRequest: string,
  preferences: TravelPreferences
): CustomItinerary => {
  const lowerRequest = userRequest.toLowerCase();
  
  // Extract key information from user request
  const duration = extractDuration(lowerRequest);
  const destinations = extractDestinations(lowerRequest);
  const interests = extractInterests(lowerRequest, preferences);
  const budget = extractBudget(lowerRequest, preferences);
  
  // Generate itinerary based on extracted information
  const itinerary = buildItinerary(destinations, duration, interests, budget);
  
  return itinerary;
};

const extractDuration = (request: string): number => {
  // Look for explicit duration mentions
  if (request.includes('weekend') || request.includes('2 day')) return 2;
  if (request.includes('3 day')) return 3;
  if (request.includes('week') || request.includes('7 day')) return 7;
  if (request.includes('10 day')) return 10;
  if (request.includes('2 week')) return 14;
  
  // Look for number + day pattern
  const dayMatch = request.match(/(\d+)\s*days?/);
  if (dayMatch) return parseInt(dayMatch[1]);
  
  // Default based on common patterns
  if (request.includes('short') || request.includes('quick')) return 3;
  if (request.includes('long') || request.includes('extended')) return 14;
  
  return 7; // Default to 1 week
};

const extractDestinations = (request: string): string[] => {
  const destinations: string[] = [];
  
  // Common Indian destinations
  const indianCities = [
    'delhi', 'mumbai', 'bangalore', 'kolkata', 'chennai', 'jaipur', 'agra', 'goa',
    'kerala', 'rajasthan', 'kashmir', 'ladakh', 'manali', 'shimla', 'rishikesh',
    'varanasi', 'udaipur', 'jodhpur', 'jaisalmer', 'kochi', 'alleppey', 'munnar',
    'darjeeling', 'gangtok', 'mysore', 'hampi', 'pushkar', 'mcleodganj', 'dharamshala'
  ];
  
  indianCities.forEach(city => {
    if (request.includes(city)) {
      destinations.push(city.charAt(0).toUpperCase() + city.slice(1));
    }
  });
  
  // If no specific destinations, suggest based on interests
  if (destinations.length === 0) {
    if (request.includes('beach') || request.includes('coast')) {
      destinations.push('Goa', 'Kerala');
    } else if (request.includes('mountain') || request.includes('hill')) {
      destinations.push('Manali', 'Shimla');
    } else if (request.includes('desert')) {
      destinations.push('Jaisalmer', 'Jodhpur');
    } else if (request.includes('cultural') || request.includes('heritage')) {
      destinations.push('Delhi', 'Agra', 'Jaipur');
    } else {
      destinations.push('Delhi', 'Agra'); // Golden Triangle default
    }
  }
  
  return destinations;
};

const extractInterests = (request: string, preferences: TravelPreferences): string[] => {
  const interests: string[] = [];
  
  // From preferences
  if (preferences.genre) interests.push(preferences.genre);
  
  // From request text
  if (request.includes('adventure') || request.includes('trek')) interests.push('adventure');
  if (request.includes('culture') || request.includes('heritage')) interests.push('cultural');
  if (request.includes('food') || request.includes('cuisine')) interests.push('food');
  if (request.includes('spiritual') || request.includes('temple')) interests.push('spiritual');
  if (request.includes('nature') || request.includes('wildlife')) interests.push('nature');
  if (request.includes('beach') || request.includes('relax')) interests.push('relaxation');
  
  return interests.length > 0 ? interests : ['cultural']; // Default
};

const extractBudget = (request: string, preferences: TravelPreferences): string => {
  if (preferences.budget) return preferences.budget;
  
  if (request.includes('budget') || request.includes('cheap')) return 'low';
  if (request.includes('luxury') || request.includes('premium')) return 'luxury';
  if (request.includes('mid-range') || request.includes('moderate')) return 'medium';
  
  return 'medium'; // Default
};

const buildItinerary = (
  destinations: string[],
  duration: number,
  interests: string[],
  budget: string
): CustomItinerary => {
  const days: ItineraryDay[] = [];
  let currentDay = 1;
  
  // Distribute days across destinations
  const daysPerDestination = Math.floor(duration / destinations.length);
  const extraDays = duration % destinations.length;
  
  destinations.forEach((destination, index) => {
    const destinationDays = daysPerDestination + (index < extraDays ? 1 : 0);
    
    for (let i = 0; i < destinationDays; i++) {
      days.push(generateDayPlan(currentDay, destination, interests, budget, i === 0));
      currentDay++;
    }
  });
  
  const budgetEstimate = getBudgetEstimate(duration, budget);
  
  return {
    title: `Custom ${duration}-Day India Itinerary`,
    duration: `${duration} days`,
    totalDays: duration,
    estimatedBudget: budgetEstimate,
    bestTime: getBestTimeToVisit(destinations),
    overview: generateOverview(destinations, interests, duration),
    days,
    tips: generateTravelTips(destinations, interests, budget)
  };
};

const generateDayPlan = (
  day: number,
  destination: string,
  interests: string[],
  budget: string,
  isArrivalDay: boolean
): ItineraryDay => {
  const activities = getActivitiesForDestination(destination, interests, budget, isArrivalDay);
  const accommodation = getAccommodationSuggestion(destination, budget);
  const transportation = getTransportationInfo(destination, isArrivalDay);
  
  return {
    day,
    location: destination,
    activities,
    accommodation: isArrivalDay ? accommodation : undefined,
    transportation: isArrivalDay ? transportation : undefined,
    notes: isArrivalDay ? `Arrival day in ${destination}` : undefined
  };
};

const getActivitiesForDestination = (
  destination: string,
  interests: string[],
  budget: string,
  isArrivalDay: boolean
): string[] => {
  const destinationActivities: { [key: string]: string[] } = {
    'Delhi': [
      'Visit Red Fort and explore Old Delhi',
      'Tour India Gate and Rajpath',
      'Explore Humayun\'s Tomb',
      'Visit Qutub Minar',
      'Shopping at Connaught Place',
      'Food tour in Chandni Chowk'
    ],
    'Agra': [
      'Sunrise visit to Taj Mahal',
      'Explore Agra Fort',
      'Visit Fatehpur Sikri',
      'Sunset at Mehtab Bagh',
      'Local marble inlay workshops'
    ],
    'Jaipur': [
      'Explore Amber Fort',
      'Visit City Palace',
      'Photo stop at Hawa Mahal',
      'Tour Jantar Mantar',
      'Shopping in Johari Bazaar',
      'Traditional Rajasthani dinner'
    ],
    'Goa': [
      'Relax at Baga Beach',
      'Explore Old Goa churches',
      'Spice plantation tour',
      'Sunset cruise on Mandovi River',
      'Try local seafood',
      'Visit Anjuna Flea Market'
    ],
    'Kerala': [
      'Backwater houseboat experience',
      'Spice plantation tour in Munnar',
      'Kathakali dance performance',
      'Ayurvedic spa treatment',
      'Tea garden visit',
      'Beach time in Kovalam'
    ]
  };
  
  const baseActivities = destinationActivities[destination] || [
    `Explore ${destination} city center`,
    `Visit local markets`,
    `Try regional cuisine`,
    `Cultural site visits`
  ];
  
  if (isArrivalDay) {
    return [
      'Check into accommodation',
      'Orientation walk around the area',
      'Welcome dinner at local restaurant'
    ];
  }
  
  // Filter activities based on interests and budget
  const selectedActivities = baseActivities.slice(0, interests.includes('cultural') ? 4 : 3);
  
  if (interests.includes('food')) {
    selectedActivities.push('Food tour or cooking class');
  }
  if (interests.includes('adventure')) {
    selectedActivities.push('Adventure activity (trekking/water sports)');
  }
  
  return selectedActivities;
};

const getAccommodationSuggestion = (destination: string, budget: string): string => {
  const budgetMap = {
    'low': 'Budget guesthouse or hostel',
    'medium': 'Mid-range hotel or boutique property',
    'high': 'Premium hotel with modern amenities',
    'luxury': 'Luxury resort or heritage property'
  };
  
  return budgetMap[budget as keyof typeof budgetMap] || budgetMap.medium;
};

const getTransportationInfo = (destination: string, isArrivalDay: boolean): string => {
  if (isArrivalDay) {
    return `Airport/station pickup to ${destination} accommodation`;
  }
  return 'Local transportation for sightseeing';
};

const getBudgetEstimate = (duration: number, budget: string): string => {
  const dailyBudgets = {
    'low': 1500,
    'medium': 3500,
    'high': 7000,
    'luxury': 15000
  };
  
  const dailyRate = dailyBudgets[budget as keyof typeof dailyBudgets] || dailyBudgets.medium;
  const total = dailyRate * duration;
  
  return `₹${total.toLocaleString()} - ₹${(total * 1.3).toLocaleString()} per person (${budget} budget)`;
};

const getBestTimeToVisit = (destinations: string[]): string => {
  // Simplified - can be enhanced with more specific seasonal data
  if (destinations.some(d => ['Goa', 'Kerala'].includes(d))) {
    return 'October to March (dry season)';
  }
  if (destinations.some(d => ['Manali', 'Shimla', 'Ladakh'].includes(d))) {
    return 'April to October (mountain season)';
  }
  return 'October to March (best weather for most destinations)';
};

const generateOverview = (destinations: string[], interests: string[], duration: number): string => {
  const destinationList = destinations.join(', ');
  const interestText = interests.length > 0 ? ` focusing on ${interests.join(', ')} experiences` : '';
  
  return `A ${duration}-day journey through ${destinationList}${interestText}. This itinerary combines must-see attractions with authentic local experiences, providing a perfect balance of sightseeing, cultural immersion, and relaxation.`;
};

const generateTravelTips = (destinations: string[], interests: string[], budget: string): string[] => {
  const tips = [
    'Book accommodations in advance, especially during peak season',
    'Carry cash as many local vendors don\'t accept cards',
    'Dress modestly when visiting religious sites',
    'Try local cuisine but choose clean, busy restaurants',
    'Negotiate prices for auto-rickshaws and local transport'
  ];
  
  if (destinations.some(d => ['Delhi', 'Agra', 'Jaipur'].includes(d))) {
    tips.push('Golden Triangle circuit - consider hiring a driver for convenience');
  }
  
  if (interests.includes('adventure')) {
    tips.push('Pack appropriate gear for adventure activities');
  }
  
  if (budget === 'low') {
    tips.push('Use public transport and eat at local dhabas to save money');
  }
  
  return tips;
};

export const formatItineraryResponse = (itinerary: CustomItinerary): string => {
  let response = `🗓️ **${itinerary.title.toUpperCase()}**\n\n`;
  response += `📋 **OVERVIEW**\n${itinerary.overview}\n\n`;
  response += `💰 **Budget:** ${itinerary.estimatedBudget}\n`;
  response += `🌡️ **Best Time:** ${itinerary.bestTime}\n\n`;
  
  response += `📅 **DAY-BY-DAY ITINERARY**\n\n`;
  
  itinerary.days.forEach(day => {
    response += `**Day ${day.day} - ${day.location}**\n`;
    
    if (day.accommodation) {
      response += `🏨 **Accommodation:** ${day.accommodation}\n`;
    }
    if (day.transportation) {
      response += `🚗 **Transportation:** ${day.transportation}\n`;
    }
    
    response += `📍 **Activities:**\n`;
    day.activities.forEach(activity => {
      response += `• ${activity}\n`;
    });
    
    if (day.notes) {
      response += `💡 *${day.notes}*\n`;
    }
    response += `\n`;
  });
  
  response += `💡 **TRAVEL TIPS**\n`;
  itinerary.tips.forEach(tip => {
    response += `• ${tip}\n`;
  });
  
  return response;
};
