
// Enhanced mapping features for travel planning
export interface MapLocation {
  name: string;
  lat: number;
  lng: number;
  type: 'city' | 'attraction' | 'hotel' | 'airport' | 'station';
  description?: string;
  rating?: number;
}

export interface RouteInfo {
  from: MapLocation;
  to: MapLocation;
  distance: number; // in km
  duration: number; // in minutes
  mode: 'driving' | 'train' | 'flight';
  cost?: number;
}

// Major Indian cities and attractions with coordinates
export const INDIAN_LOCATIONS: { [key: string]: MapLocation } = {
  // Major Cities
  'delhi': { name: 'Delhi', lat: 28.6139, lng: 77.2090, type: 'city' },
  'mumbai': { name: 'Mumbai', lat: 19.0760, lng: 72.8777, type: 'city' },
  'bangalore': { name: 'Bangalore', lat: 12.9716, lng: 77.5946, type: 'city' },
  'kolkata': { name: 'Kolkata', lat: 22.5726, lng: 88.3639, type: 'city' },
  'chennai': { name: 'Chennai', lat: 13.0827, lng: 80.2707, type: 'city' },
  'jaipur': { name: 'Jaipur', lat: 26.9124, lng: 75.7873, type: 'city' },
  'agra': { name: 'Agra', lat: 27.1767, lng: 78.0081, type: 'city' },
  'goa': { name: 'Goa', lat: 15.2993, lng: 74.1240, type: 'city' },
  'kerala': { name: 'Kerala (Kochi)', lat: 9.9312, lng: 76.2673, type: 'city' },
  
  // Famous Attractions
  'taj_mahal': { name: 'Taj Mahal', lat: 27.1751, lng: 78.0421, type: 'attraction', rating: 4.9 },
  'red_fort': { name: 'Red Fort', lat: 28.6562, lng: 77.2410, type: 'attraction', rating: 4.3 },
  'gateway_of_india': { name: 'Gateway of India', lat: 18.9220, lng: 72.8347, type: 'attraction', rating: 4.2 },
  'amber_fort': { name: 'Amber Fort', lat: 26.9855, lng: 75.8513, type: 'attraction', rating: 4.5 },
  'mysore_palace': { name: 'Mysore Palace', lat: 12.3052, lng: 76.6552, type: 'attraction', rating: 4.4 },
};

export const findNearbyAttractions = (cityName: string, radius: number = 50): MapLocation[] => {
  const city = INDIAN_LOCATIONS[cityName.toLowerCase()];
  if (!city) return [];
  
  const nearby: MapLocation[] = [];
  
  Object.values(INDIAN_LOCATIONS).forEach(location => {
    if (location.type === 'attraction') {
      const distance = calculateDistance(city.lat, city.lng, location.lat, location.lng);
      if (distance <= radius) {
        nearby.push({ ...location, description: `${distance.toFixed(1)}km from ${city.name}` });
      }
    }
  });
  
  return nearby.sort((a, b) => {
    const distA = calculateDistance(city.lat, city.lng, a.lat, a.lng);
    const distB = calculateDistance(city.lat, city.lng, b.lat, b.lng);
    return distA - distB;
  });
};

export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const generateRouteInfo = (from: string, to: string): RouteInfo | null => {
  const fromLocation = INDIAN_LOCATIONS[from.toLowerCase()];
  const toLocation = INDIAN_LOCATIONS[to.toLowerCase()];
  
  if (!fromLocation || !toLocation) return null;
  
  const distance = calculateDistance(fromLocation.lat, fromLocation.lng, toLocation.lat, toLocation.lng);
  
  // Determine best travel mode based on distance
  let mode: 'driving' | 'train' | 'flight' = 'driving';
  let duration = Math.floor(distance / 60 * 60); // Rough driving time
  let cost = distance * 8; // ₹8 per km for driving
  
  if (distance > 500) {
    mode = 'flight';
    duration = Math.floor(distance / 800 * 60) + 180; // Flight time + airport time
    cost = distance * 6 + 2000; // Base flight cost
  } else if (distance > 100) {
    mode = 'train';
    duration = Math.floor(distance / 80 * 60); // Train speed ~80 km/h
    cost = distance * 2; // ₹2 per km for train
  }
  
  return {
    from: fromLocation,
    to: toLocation,
    distance: Math.round(distance),
    duration,
    mode,
    cost: Math.round(cost)
  };
};

export const formatMapResponse = (city: string): string => {
  const attractions = findNearbyAttractions(city);
  const location = INDIAN_LOCATIONS[city.toLowerCase()];
  
  if (!location) {
    return `I couldn't find map data for "${city}". Please try major Indian cities like Delhi, Mumbai, Jaipur, or Kerala.`;
  }
  
  let response = `🗺️ **${location.name.toUpperCase()} MAP & ATTRACTIONS**\n\n`;
  response += `📍 **Location:** ${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E\n\n`;
  
  if (attractions.length > 0) {
    response += `🎯 **Nearby Attractions:**\n`;
    attractions.slice(0, 5).forEach((attraction, index) => {
      const stars = attraction.rating ? '⭐'.repeat(Math.floor(attraction.rating)) : '';
      response += `${index + 1}. **${attraction.name}** ${stars}\n`;
      response += `   ${attraction.description}\n`;
    });
    response += `\n`;
  }
  
  response += `🧭 **Navigation Tips:**\n`;
  response += `• Use Google Maps for real-time directions\n`;
  response += `• Download offline maps before traveling\n`;
  response += `• Popular local transport: Auto-rickshaw, Metro, Bus\n`;
  response += `• Keep offline backup of important locations\n\n`;
  
  response += `Would you like route planning to any specific destination?`;
  
  return response;
};
