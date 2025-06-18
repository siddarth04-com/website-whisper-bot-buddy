
// Real-time flight and hotel price integration
export interface FlightData {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  price: number;
  airline: string;
  duration: string;
  stops: number;
}

export interface HotelData {
  name: string;
  location: string;
  rating: number;
  price: number;
  amenities: string[];
  availability: boolean;
  image?: string;
}

// Simulated real-time flight prices (in production, this would call actual APIs)
export const searchFlights = async (
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string
): Promise<FlightData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const indianCities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
  const airlines = ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'GoAir'];
  
  // Generate realistic flight data
  const flights: FlightData[] = [];
  
  for (let i = 0; i < 5; i++) {
    const basePrice = Math.floor(Math.random() * 15000) + 3000;
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const stops = Math.random() > 0.6 ? 1 : 0;
    const duration = stops === 0 ? '2h 15m' : '4h 45m';
    
    flights.push({
      origin,
      destination,
      departureDate,
      returnDate,
      price: basePrice,
      airline,
      duration,
      stops
    });
  }
  
  return flights.sort((a, b) => a.price - b.price);
};

export const searchHotels = async (
  location: string,
  checkIn: string,
  checkOut: string,
  guests: number = 2
): Promise<HotelData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const hotelTypes = [
    { name: 'Budget Inn', rating: 3, basePrice: 1500 },
    { name: 'Comfort Stay', rating: 3.5, basePrice: 2500 },
    { name: 'Premium Hotel', rating: 4, basePrice: 4500 },
    { name: 'Luxury Resort', rating: 4.5, basePrice: 8000 },
    { name: 'Heritage Palace', rating: 5, basePrice: 12000 }
  ];
  
  const amenities = ['WiFi', 'AC', 'Restaurant', 'Pool', 'Spa', 'Gym', 'Room Service'];
  
  return hotelTypes.map((hotel, index) => ({
    name: `${hotel.name} ${location}`,
    location,
    rating: hotel.rating,
    price: hotel.basePrice + Math.floor(Math.random() * 1000),
    amenities: amenities.slice(0, Math.floor(Math.random() * 4) + 3),
    availability: Math.random() > 0.2,
    image: `/placeholder-hotel-${index + 1}.jpg`
  }));
};

export const formatFlightResults = (flights: FlightData[]): string => {
  if (flights.length === 0) {
    return "No flights found for the selected dates. Try different dates or nearby airports.";
  }
  
  let result = `✈️ **FLIGHT SEARCH RESULTS**\n\n`;
  
  flights.slice(0, 3).forEach((flight, index) => {
    result += `${index + 1}. **${flight.airline}** - ₹${flight.price.toLocaleString()}\n`;
    result += `   ${flight.origin} → ${flight.destination}\n`;
    result += `   Duration: ${flight.duration} | Stops: ${flight.stops === 0 ? 'Direct' : flight.stops}\n`;
    result += `   Date: ${flight.departureDate}\n\n`;
  });
  
  result += `💡 **Money-saving tips:**\n`;
  result += `• Book 2-3 weeks in advance for best prices\n`;
  result += `• Consider flexible dates (±3 days)\n`;
  result += `• Early morning flights are usually cheaper\n`;
  result += `• Check airline websites directly for deals`;
  
  return result;
};

export const formatHotelResults = (hotels: HotelData[]): string => {
  if (hotels.length === 0) {
    return "No hotels found for the selected dates and location.";
  }
  
  let result = `🏨 **HOTEL SEARCH RESULTS**\n\n`;
  
  hotels.slice(0, 4).forEach((hotel, index) => {
    const stars = '⭐'.repeat(Math.floor(hotel.rating));
    result += `${index + 1}. **${hotel.name}** ${stars}\n`;
    result += `   ₹${hotel.price.toLocaleString()}/night\n`;
    result += `   Amenities: ${hotel.amenities.slice(0, 3).join(', ')}\n`;
    result += `   ${hotel.availability ? '✅ Available' : '❌ Limited availability'}\n\n`;
  });
  
  result += `💡 **Booking tips:**\n`;
  result += `• Compare prices across multiple platforms\n`;
  result += `• Read recent reviews before booking\n`;
  result += `• Check cancellation policies\n`;
  result += `• Book refundable rates if plans might change`;
  
  return result;
};
