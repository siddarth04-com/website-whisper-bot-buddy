
import { TravelPreferences } from './types';

// Update preferences based on user input
export const updateTravelPreferences = (
  userMessage: string,
  setTravelPreferences: React.Dispatch<React.SetStateAction<TravelPreferences>>
) => {
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
