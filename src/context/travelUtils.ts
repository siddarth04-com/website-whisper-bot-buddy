
import { TravelPreferences } from './types';

// Get Indian travel recommendations based on genre
export const getTravelRecommendationsByGenre = (genre: string): string[] => {
  const genreMap: Record<string, string[]> = {
    'cultural': ['Delhi', 'Varanasi', 'Jaipur', 'Agra', 'Hampi'],
    'adventure': ['Manali', 'Rishikesh', 'Leh-Ladakh', 'Goa', 'Darjeeling'],
    'relaxation': ['Kerala Backwaters', 'Goa', 'Udaipur', 'Shimla', 'Ooty'],
    'food': ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Amritsar'],
    'history': ['Delhi', 'Agra', 'Jaipur', 'Khajuraho', 'Ajanta Caves'],
    'nature': ['Kerala', 'Himachal Pradesh', 'Uttarakhand', 'Karnataka', 'Meghalaya'],
    'spiritual': ['Varanasi', 'Rishikesh', 'Amritsar', 'Bodh Gaya', 'Haridwar'],
    'beach': ['Goa', 'Kerala', 'Andaman Islands', 'Pudicherry', 'Maharashtra'],
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
export const getTravelRecommendationsByBudget = (budget: string): string[] => {
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
export const getTravelRecommendationsByStyle = (style: string): string[] => {
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

export const getDestinationRecommendations = (travelPreferences: TravelPreferences) => {
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
