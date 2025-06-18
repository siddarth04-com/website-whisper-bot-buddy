
import { SuggestedReplyType, TravelPreferences } from './types';

// Enhanced AI response generation with more dynamic conversation flow
export const generateDynamicResponse = async (
  userMessage: string,
  conversationHistory: string[],
  preferences: TravelPreferences
): Promise<{ message: string; suggestions: SuggestedReplyType[] }> => {
  const context = conversationHistory.slice(-3).join(' '); // Last 3 messages for context
  const lowerMsg = userMessage.toLowerCase();

  // Dynamic conversation starters based on context
  if (context.includes('budget') && lowerMsg.includes('cheap')) {
    return {
      message: `💰 **BUDGET TRAVEL EXPERT MODE ACTIVATED!**\n\nI noticed you're looking for budget-friendly options in India. Let me share some insider tips:\n\n🏠 **Accommodation Hacks:**\n• Hostels: ₹300-800/night in major cities\n• Homestays: ₹500-1500/night (authentic experience)\n• Government tourist lodges: Clean & affordable\n• Dharamshalas: ₹100-300/night near temples\n\n🍛 **Food Budget:**\n• Street food: ₹30-80 per meal\n• Local restaurants: ₹80-200 per meal\n• Cooking in hostels: ₹50-100 per day\n\n🚂 **Transport Savings:**\n• Train sleeper class: 50% cheaper than AC\n• State buses: Cheapest long-distance option\n• Shared autos: Split costs in cities\n\nWhat's your daily budget target? I'll create a perfect itinerary!`,
      suggestions: [
        { id: '1', text: 'Under ₹1000 per day plan' },
        { id: '2', text: 'Backpacker routes in India' },
        { id: '3', text: 'Free activities in Indian cities' },
        { id: '4', text: 'Budget accommodation booking tips' }
      ]
    };
  }

  // Context-aware seasonal recommendations
  const currentMonth = new Date().getMonth();
  const season = getSeason(currentMonth);
  
  if (lowerMsg.includes('best time') || lowerMsg.includes('when to visit')) {
    return getSeasonalRecommendations(season, userMessage);
  }

  // Dynamic follow-up based on previous interests
  if (context.includes('kerala') && lowerMsg.includes('similar')) {
    return {
      message: `🌴 **KERALA-LIKE DESTINATIONS IN INDIA**\n\nSince you loved Kerala's vibe, here are similar paradises:\n\n🏞️ **Coorg, Karnataka** - "Scotland of India"\n• Coffee plantations & misty hills\n• River rafting & trekking\n• Similar backwater experience at Dubare\n\n🌺 **Munnar-like Hill Stations:**\n• Wayanad (Kerala) - Spice gardens & wildlife\n• Kodaikanal (Tamil Nadu) - Lake views & valleys\n• Yercaud (Tamil Nadu) - Coffee estates & caves\n\n🚤 **Backwater Alternatives:**\n• Kumarakom (Kerala) - Bird sanctuary + houseboats\n• Kollam (Kerala) - Less crowded backwaters\n• Pichavaram (Tamil Nadu) - Mangrove forests\n\nWhich aspect of Kerala did you love most?`,
      suggestions: [
        { id: '1', text: 'Coorg detailed itinerary' },
        { id: '2', text: 'Wayanad vs Munnar comparison' },
        { id: '3', text: 'Alternative backwater experiences' },
        { id: '4', text: 'South India hill station guide' }
      ]
    };
  }

  // Default enhanced response
  return {
    message: `🎯 **SMART TRAVEL ASSISTANT**\n\nI'm analyzing your travel style to give you the perfect recommendations! \n\n📊 **Your Profile So Far:**\n${getProfileSummary(preferences, context)}\n\n🔍 **I can help you with:**\n• Real-time flight & hotel price comparisons\n• Live weather updates for travel planning\n• Interactive maps with routes & attractions\n• Current travel conditions & updates\n• Personalized itineraries based on your interests\n\nWhat specific aspect of your India trip would you like to plan next?`,
    suggestions: [
      { id: '1', text: 'Check flight prices to India' },
      { id: '2', text: 'Find hotels in my destination' },
      { id: '3', text: 'Show me on the map' },
      { id: '4', text: 'Current travel conditions' }
    ]
  };
};

const getSeason = (month: number): string => {
  if (month >= 10 || month <= 2) return 'winter';
  if (month >= 3 && month <= 5) return 'summer';
  return 'monsoon';
};

const getSeasonalRecommendations = (season: string, destination: string) => {
  const recommendations = {
    winter: {
      message: `❄️ **PERFECT WINTER TRAVEL SEASON!** (Oct-Feb)\n\nThis is the BEST time for most of India! Here's why:\n\n🌡️ **Weather Advantage:**\n• Pleasant 15-25°C in most regions\n• Clear skies perfect for sightseeing\n• Ideal for desert & beach destinations\n\n🏆 **Top Winter Destinations:**\n• Rajasthan - Perfect weather for palaces\n• Goa - Peak beach season\n• Kerala - Backwaters at their best\n• Agra - Clear Taj Mahal views\n• Delhi - Comfortable for exploring\n\n🎉 **Winter Festivals:**\n• Pushkar Camel Fair (November)\n• Goa Carnival (February)\n• Kumbh Mela (varies)\n• Desert Festival, Jaisalmer (Feb)`,
      suggestions: [
        { id: '1', text: 'Rajasthan winter itinerary' },
        { id: '2', text: 'Goa December-February guide' },
        { id: '3', text: 'Winter festivals calendar' },
        { id: '4', text: 'North India winter tour' }
      ]
    },
    summer: {
      message: `☀️ **SUMMER TRAVEL STRATEGY** (Mar-May)\n\n🏔️ **Beat the Heat Destinations:**\n• Hill Stations: Shimla, Manali, Ooty\n• Kashmir: Srinagar, Gulmarg (perfect weather)\n• Ladakh: Road opens in June\n• Northeast: Meghalaya, Arunachal Pradesh\n\n🌊 **Coastal Escapes:**\n• Andaman & Nicobar Islands\n• Kerala backwaters (early morning/evening)\n• Karnataka coast (Gokarna, Udupi)\n\n💡 **Summer Travel Tips:**\n• Book hill stations early (peak demand)\n• Carry sun protection\n• Plan indoor activities during noon\n• Stay hydrated & take breaks`,
      suggestions: [
        { id: '1', text: 'Kashmir summer package' },
        { id: '2', text: 'Hill station comparison' },
        { id: '3', text: 'Ladakh road trip planning' },
        { id: '4', text: 'Summer travel safety tips' }
      ]
    },
    monsoon: {
      message: `🌧️ **MONSOON MAGIC** (Jun-Sep)\n\n🌿 **Monsoon Destinations:**\n• Western Ghats: Lonavala, Mahabaleshwar\n• Kerala: Lush green landscapes\n• Meghalaya: Living root bridges\n• Coorg: Coffee plantation beauty\n• Mumbai: Monsoon festivals\n\n⚠️ **Monsoon Considerations:**\n• Heavy rainfall in Western Ghats\n• Landslides possible in hills\n• Beaches not ideal (rough seas)\n• Perfect for nature photography\n\n🎭 **Monsoon Experiences:**\n• Waterfall trekking\n• Tea garden visits\n• Ayurvedic treatments\n• Cultural festivals`,
      suggestions: [
        { id: '1', text: 'Monsoon photography tours' },
        { id: '2', text: 'Western Ghats monsoon guide' },
        { id: '3', text: 'Monsoon safety precautions' },
        { id: '4', text: 'Indoor cultural experiences' }
      ]
    }
  };

  return recommendations[season as keyof typeof recommendations];
};

const getProfileSummary = (preferences: TravelPreferences, context: string): string => {
  let summary = '';
  
  if (preferences.budget) summary += `💰 Budget: ${preferences.budget}\n`;
  if (preferences.genre) summary += `🎯 Interest: ${preferences.genre}\n`;
  if (preferences.style) summary += `🎒 Style: ${preferences.style}\n`;
  
  if (context.includes('temple')) summary += `🕉️ Shows interest in spiritual destinations\n`;
  if (context.includes('beach')) summary += `🏖️ Prefers coastal experiences\n`;
  if (context.includes('food')) summary += `🍛 Foodie traveler\n`;
  
  return summary || '📋 Building your travel profile...';
};
