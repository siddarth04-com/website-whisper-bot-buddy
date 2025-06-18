
// Live travel updates and current conditions
export interface TravelAlert {
  type: 'weather' | 'transport' | 'safety' | 'festival' | 'covid';
  severity: 'low' | 'medium' | 'high';
  location: string;
  title: string;
  description: string;
  validUntil: Date;
  source: string;
}

export interface LiveUpdate {
  timestamp: Date;
  category: 'flight' | 'train' | 'road' | 'weather' | 'event';
  message: string;
  affectedRoutes?: string[];
}

// Simulated live travel alerts for India
export const getCurrentTravelAlerts = async (destinations: string[]): Promise<TravelAlert[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentDate = new Date();
  const alerts: TravelAlert[] = [];
  
  // Generate realistic travel alerts based on season and destinations
  const currentMonth = currentDate.getMonth();
  
  destinations.forEach(destination => {
    // Monsoon alerts (June-September)
    if (currentMonth >= 5 && currentMonth <= 8) {
      if (['kerala', 'mumbai', 'goa'].includes(destination.toLowerCase())) {
        alerts.push({
          type: 'weather',
          severity: 'medium',
          location: destination,
          title: 'Heavy Monsoon Expected',
          description: 'Heavy rainfall predicted for next 3 days. Carry umbrella and waterproof gear. Some outdoor activities may be affected.',
          validUntil: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000),
          source: 'India Meteorological Department'
        });
      }
    }
    
    // Winter festival alerts
    if (currentMonth >= 10 || currentMonth <= 1) {
      if (destination.toLowerCase().includes('rajasthan') || destination.toLowerCase() === 'jaipur') {
        alerts.push({
          type: 'festival',
          severity: 'low',
          location: destination,
          title: 'Winter Festival Season',
          description: 'Peak tourist season with multiple cultural festivals. Book accommodations early. Expect higher prices and crowds.',
          validUntil: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000),
          source: 'Rajasthan Tourism'
        });
      }
    }
    
    // Summer heat alerts
    if (currentMonth >= 3 && currentMonth <= 5) {
      if (['delhi', 'agra', 'jaipur'].includes(destination.toLowerCase())) {
        alerts.push({
          type: 'weather',
          severity: 'high',
          location: destination,
          title: 'Extreme Heat Wave',
          description: 'Temperatures exceeding 42°C. Avoid outdoor activities between 11 AM - 4 PM. Stay hydrated and seek shade frequently.',
          validUntil: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000),
          source: 'Health Ministry Advisory'
        });
      }
    }
  });
  
  // Add some random transport updates
  if (Math.random() > 0.5) {
    alerts.push({
      type: 'transport',
      severity: 'low',
      location: 'Delhi-Mumbai Route',
      title: 'Train Delays Expected',
      description: 'Rajdhani Express running 2-3 hours late due to track maintenance. Alternative flights available.',
      validUntil: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
      source: 'Indian Railways'
    });
  }
  
  return alerts;
};

export const getLiveUpdates = async (): Promise<LiveUpdate[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const updates: LiveUpdate[] = [];
  const currentTime = new Date();
  
  // Generate realistic live updates
  const updateMessages = [
    {
      category: 'flight' as const,
      message: 'Delhi Airport: All flights operating normally. Average departure delay: 15 minutes.',
      routes: ['Delhi', 'Mumbai', 'Bangalore']
    },
    {
      category: 'train' as const,
      message: 'Golden Triangle route: Shatabdi Express on time. Reserved coaches available.',
      routes: ['Delhi', 'Agra', 'Jaipur']
    },
    {
      category: 'weather' as const,
      message: 'Northern India: Clear skies, perfect visibility for Taj Mahal sunrise viewing.',
      routes: ['Agra', 'Delhi']
    },
    {
      category: 'road' as const,
      message: 'Mumbai-Goa Highway: Traffic moving smoothly. Estimated travel time: 8 hours.',
      routes: ['Mumbai', 'Goa']
    },
    {
      category: 'event' as const,
      message: 'Jaipur Literature Festival preparations underway. Increased hotel bookings expected.',
      routes: ['Jaipur']
    }
  ];
  
  // Return 2-3 random updates
  const selectedUpdates = updateMessages.sort(() => Math.random() - 0.5).slice(0, 3);
  
  selectedUpdates.forEach(update => {
    updates.push({
      timestamp: new Date(currentTime.getTime() - Math.random() * 60 * 60 * 1000), // Within last hour
      category: update.category,
      message: update.message,
      affectedRoutes: update.routes
    });
  });
  
  return updates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const formatTravelAlerts = (alerts: TravelAlert[]): string => {
  if (alerts.length === 0) {
    return "✅ **All Clear!** No active travel alerts for your destinations. Safe travels!";
  }
  
  let response = `🚨 **LIVE TRAVEL ALERTS**\n\n`;
  
  alerts.forEach((alert, index) => {
    const icon = getAlertIcon(alert.type);
    const severityIcon = getSeverityIcon(alert.severity);
    
    response += `${icon} **${alert.title}** ${severityIcon}\n`;
    response += `📍 Location: ${alert.location}\n`;
    response += `📝 ${alert.description}\n`;
    response += `⏰ Valid until: ${alert.validUntil.toLocaleDateString()}\n`;
    response += `🔗 Source: ${alert.source}\n\n`;
  });
  
  response += `💡 **Stay Updated:** Check latest conditions before traveling and follow local advisories.`;
  
  return response;
};

export const formatLiveUpdates = (updates: LiveUpdate[]): string => {
  if (updates.length === 0) {
    return "📡 No live updates available at the moment. All systems operating normally.";
  }
  
  let response = `📡 **LIVE TRAVEL UPDATES**\n\n`;
  
  updates.forEach(update => {
    const icon = getCategoryIcon(update.category);
    const timeAgo = getTimeAgo(update.timestamp);
    
    response += `${icon} **${update.category.toUpperCase()}** (${timeAgo})\n`;
    response += `${update.message}\n`;
    if (update.affectedRoutes) {
      response += `🛣️ Routes: ${update.affectedRoutes.join(', ')}\n`;
    }
    response += `\n`;
  });
  
  return response;
};

const getAlertIcon = (type: string): string => {
  const icons = {
    weather: '🌧️',
    transport: '🚂',
    safety: '⚠️',
    festival: '🎉',
    covid: '😷'
  };
  return icons[type as keyof typeof icons] || '📢';
};

const getSeverityIcon = (severity: string): string => {
  const icons = {
    low: '🟢',
    medium: '🟡',
    high: '🔴'
  };
  return icons[severity as keyof typeof icons] || '';
};

const getCategoryIcon = (category: string): string => {
  const icons = {
    flight: '✈️',
    train: '🚂',
    road: '🛣️',
    weather: '🌤️',
    event: '🎪'
  };
  return icons[category as keyof typeof icons] || '📢';
};

const getTimeAgo = (timestamp: Date): string => {
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
  
  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
  return `${Math.floor(diffMinutes / 1440)}d ago`;
};
