
import { TravelPreferences } from './types';
import { CustomItinerary, formatItineraryResponse } from './itineraryUtils';

interface ClaudeResponse {
  content: Array<{
    text: string;
  }>;
}

export const generateClaudeItinerary = async (
  userRequest: string,
  preferences: TravelPreferences,
  conversationHistory: string[]
): Promise<string> => {
  try {
    const claudeApiKey = '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'; // This should be from env in production
    
    const contextualPrompt = buildContextualPrompt(userRequest, preferences, conversationHistory);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: contextualPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data: ClaudeResponse = await response.json();
    return data.content[0]?.text || 'I apologize, but I had trouble generating your itinerary. Please try again.';
    
  } catch (error) {
    console.error('Claude API error:', error);
    // Fallback to local generation
    return generateFallbackItinerary(userRequest, preferences);
  }
};

const buildContextualPrompt = (
  userRequest: string,
  preferences: TravelPreferences,
  conversationHistory: string[]
): string => {
  const context = conversationHistory.length > 0 
    ? `Previous conversation context: ${conversationHistory.slice(-5).join('. ')}\n\n`
    : '';

  return `${context}You are Nestled Guide, an expert India travel assistant. Create a detailed, personalized itinerary based on this request: "${userRequest}"

User Preferences:
- Budget: ${preferences.budget}
- Travel Style: ${preferences.style}
- Interests: ${preferences.genre}

Please provide:
1. A clear itinerary title
2. Duration and overview
3. Day-by-day breakdown with:
   - Specific locations and attractions
   - Activities with timing
   - Accommodation suggestions
   - Transportation details
   - Local food recommendations
4. Budget estimates in Indian Rupees
5. Best time to visit
6. Essential travel tips

Format your response with emojis and clear sections. Be specific about Indian destinations, cultural experiences, and practical travel advice. Consider the user's budget and travel style throughout.

If the request lacks details, ask clarifying questions while providing a sample itinerary based on popular destinations.`;
};

const generateFallbackItinerary = (userRequest: string, preferences: TravelPreferences): string => {
  // Fallback to local generation when Claude API fails
  return `🗓️ **CUSTOM INDIA ITINERARY**

I'm working on creating your perfect India itinerary! While I process your request for "${userRequest}", here's what I can help you plan:

📋 **Your Preferences:**
• Budget: ${preferences.budget}
• Style: ${preferences.style}  
• Interests: ${preferences.genre}

🎯 **Popular Itinerary Options:**

**Golden Triangle (6-7 days)**
• Delhi → Agra → Jaipur
• Perfect for first-time visitors
• Cultural heritage & monuments

**Kerala Backwaters (5-6 days)**
• Kochi → Alleppey → Munnar
• Nature, spices & houseboats
• Relaxing & scenic

**Rajasthan Heritage (8-10 days)**
• Jaipur → Udaipur → Jodhpur → Jaisalmer
• Palaces, forts & desert experience
• Rich cultural immersion

💡 **To create your perfect itinerary, please specify:**
• How many days do you have?
• Which regions interest you most?
• Any specific experiences you want?
• Your travel dates?

I'll then create a detailed day-by-day plan just for you!`;
};
