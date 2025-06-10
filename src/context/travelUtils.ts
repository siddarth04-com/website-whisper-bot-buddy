
import { TravelPreferences } from './types';

// Comprehensive Indian destinations by genre
export const getTravelRecommendationsByGenre = (genre: string): string[] => {
  const genreMap: Record<string, string[]> = {
    'cultural': [
      'Delhi - Red Fort, Humayun\'s Tomb, Qutub Minar',
      'Varanasi - Kashi Vishwanath Temple, Ganga Aarti',
      'Jaipur - City Palace, Hawa Mahal, Amber Fort',
      'Agra - Taj Mahal, Agra Fort, Fatehpur Sikri',
      'Hampi - Vijayanagara Empire ruins, Virupaksha Temple',
      'Khajuraho - Erotic temple sculptures, UNESCO site',
      'Ajanta & Ellora Caves - Ancient Buddhist cave paintings',
      'Madurai - Meenakshi Amman Temple',
      'Thanjavur - Brihadeeswarar Temple',
      'Konark - Sun Temple, Odisha',
      'Sanchi - Buddhist stupas, Madhya Pradesh',
      'Mahabalipuram - Shore Temple, Tamil Nadu'
    ],
    'adventure': [
      'Manali - Paragliding, river rafting, trekking',
      'Rishikesh - White water rafting, bungee jumping',
      'Leh-Ladakh - High altitude desert, bike tours',
      'Spiti Valley - Cold desert, challenging terrain',
      'Rohtang Pass - Snow adventures, skiing',
      'Valley of Flowers - Trekking, Uttarakhand',
      'Kedarnath Trek - Spiritual trekking',
      'Chadar Trek - Frozen river trek, Ladakh',
      'Hampta Pass - Himachal Pradesh trekking',
      'Sandakphu - Highest peak in West Bengal',
      'Dzongri Trek - Sikkim Himalayas',
      'Western Ghats - Rock climbing, Maharashtra'
    ],
    'relaxation': [
      'Kerala Backwaters - Alleppey, Kumarakom houseboats',
      'Goa - Beaches, Portuguese heritage',
      'Udaipur - Lake City, palace hotels',
      'Shimla - Hill station, colonial charm',
      'Ooty - Nilgiri hills, tea gardens',
      'Munnar - Tea plantations, misty hills',
      'Coorg - Coffee plantations, Karnataka',
      'Mount Abu - Only hill station in Rajasthan',
      'Darjeeling - Tea gardens, toy train',
      'Kodaikanal - Princess of hill stations',
      'Nainital - Lake district, Uttarakhand',
      'Mussoorie - Queen of hills'
    ],
    'food': [
      'Delhi - Street food capital, Chandni Chowk',
      'Mumbai - Vada pav, bhel puri, street food',
      'Kolkata - Sweets, fish curry, street food',
      'Chennai - South Indian cuisine, filter coffee',
      'Amritsar - Authentic Punjabi food, Golden Temple langar',
      'Lucknow - Awadhi cuisine, kebabs',
      'Hyderabad - Biryani capital of India',
      'Jaipur - Dal baati churma, Rajasthani thali',
      'Kerala - Coconut curry, seafood',
      'Gujarat - Gujarati thali, dhokla, fafda',
      'Punjab - Butter chicken, kulcha, lassi',
      'West Bengal - Fish curry, sweets, pitha'
    ],
    'history': [
      'Delhi - Mughal monuments, British colonial',
      'Agra - Mughal architecture, Taj Mahal',
      'Jaipur - Rajput palaces and forts',
      'Khajuraho - Medieval temple architecture',
      'Ajanta Caves - Ancient Buddhist art',
      'Hampi - Vijayanagara Empire capital',
      'Fatehpur Sikri - Abandoned Mughal city',
      'Gwalior - Historic fort and palace',
      'Orchha - Medieval Bundela architecture',
      'Mandu - Afghan architecture, Madhya Pradesh',
      'Chittorgarh - Largest fort in India',
      'Kumbalgarh - Great Wall of India'
    ],
    'nature': [
      'Kerala - Western Ghats, spice plantations',
      'Himachal Pradesh - Snow peaks, valleys',
      'Uttarakhand - Himalayan ranges, rivers',
      'Karnataka - Coorg, Chikmagalur coffee estates',
      'Meghalaya - Living root bridges, waterfalls',
      'Sikkim - Alpine landscapes, rhododendrons',
      'Arunachal Pradesh - Pristine forests',
      'Kashmir - Valley of flowers, Dal Lake',
      'Rajasthan - Thar Desert, sand dunes',
      'Gujarat - Rann of Kutch, white desert',
      'Andaman Islands - Coral reefs, marine life',
      'Lakshadweep - Pristine coral atolls'
    ],
    'spiritual': [
      'Varanasi - Holiest city, Ganga ghats',
      'Rishikesh - Yoga capital of the world',
      'Amritsar - Golden Temple, Sikhism',
      'Bodh Gaya - Buddha\'s enlightenment place',
      'Haridwar - Holy Ganga, Kumbh Mela',
      'Vrindavan - Krishna\'s birthplace',
      'Mathura - Lord Krishna\'s city',
      'Tirupati - Balaji temple, Andhra Pradesh',
      'Shirdi - Sai Baba temple, Maharashtra',
      'Dwarka - Krishna\'s kingdom, Gujarat',
      'Puri - Jagannath temple, Odisha',
      'Rameshwaram - Sacred island, Tamil Nadu'
    ],
    'beach': [
      'Goa - Baga, Calangute, Anjuna beaches',
      'Kerala - Kovalam, Varkala, Marari beaches',
      'Andaman Islands - Radhanagar, pristine beaches',
      'Pudicherry - French colonial, Auroville',
      'Maharashtra - Alibaug, Kashid, Ganpatipule',
      'Karnataka - Gokarna, Om beach, Murudeshwar',
      'Tamil Nadu - Mahabalipuram, Kanyakumari',
      'Odisha - Puri, Konark, Chilika Lake',
      'Gujarat - Mandvi, Dwarka coastline',
      'West Bengal - Digha, Mandarmani',
      'Lakshadweep - Bangaram, Kavaratti',
      'Daman & Diu - Portuguese heritage beaches'
    ],
    'mountain': [
      'Manali - Solang Valley, Rohtang Pass',
      'Shimla - Summer capital, toy train',
      'Darjeeling - Tiger Hill, Kanchenjunga views',
      'Mussoorie - Kempty Falls, Gun Hill',
      'Nainital - Naini Lake, Naina Devi',
      'Kashmir - Gulmarg, Pahalgam, Sonamarg',
      'Leh-Ladakh - Magnetic Hill, Pangong Lake',
      'Sikkim - Gangtok, Tsomgo Lake',
      'Auli - Skiing destination, Uttarakhand',
      'Mount Abu - Dilwara temples, sunset point',
      'Kodaikanal - Coaker\'s Walk, lake',
      'Munnar - Tea gardens, Eravikulam Park'
    ],
    'heritage': [
      'Rajasthan - Palaces, forts, desert culture',
      'Delhi - Seven cities, UNESCO sites',
      'Agra - Mughal triangle, marble inlay',
      'Madhya Pradesh - Khajuraho, Sanchi, Mandu',
      'Karnataka - Hampi, Mysore Palace, Belur',
      'Tamil Nadu - Chola temples, Mahabalipuram',
      'Maharashtra - Ajanta Ellora, Chhatrapati forts',
      'Gujarat - Champaner, Rani ki Vav stepwell',
      'West Bengal - Sundarbans, colonial Kolkata',
      'Odisha - Konark, Bhubaneswar temple city',
      'Punjab - Golden Temple, Sikh heritage',
      'Kerala - Fort Kochi, spice trade history'
    ]
  };
  
  const normalizedGenre = genre.toLowerCase();
  for (const key in genreMap) {
    if (normalizedGenre.includes(key)) {
      return genreMap[key];
    }
  }
  
  return [
    'Delhi - India\'s capital with rich history',
    'Agra - Home to the iconic Taj Mahal',
    'Jaipur - Pink City with royal palaces',
    'Kerala - God\'s Own Country',
    'Goa - Beautiful beaches and heritage'
  ];
};

// Budget-based recommendations with detailed descriptions
export const getTravelRecommendationsByBudget = (budget: string): string[] => {
  const budgetMap: Record<string, string[]> = {
    'low': [
      'Rishikesh - Budget hostels, free yoga, river views',
      'Varanasi - Affordable ghats stay, spiritual experiences',
      'Pushkar - Desert town, budget accommodations',
      'Hampi - UNESCO site, budget-friendly ruins exploration',
      'McLeod Ganj - Dharamshala, Tibetan culture, hostels',
      'Kasol - Himachal, budget treks, backpacker hub',
      'Manali Old Town - Budget stays, local experiences',
      'Bir Billing - Paragliding, budget homestays',
      'Tosh - Parvati Valley, budget mountain stay',
      'Khajjiar - Mini Switzerland, affordable hill station',
      'Chopta - Budget trekking base, Uttarakhand',
      'Spiti Valley - Budget road trips, homestays'
    ],
    'medium': [
      'Jaipur - Heritage hotels, palace experiences',
      'Kerala - Mid-range houseboats, ayurveda',
      'Goa - Beach resorts, Portuguese heritage',
      'Udaipur - Lake view hotels, city palaces',
      'Manali - Hill station resorts, adventure sports',
      'Mysore - Palace city, comfortable stays',
      'Coorg - Coffee estate stays, nature walks',
      'Pondicherry - French quarter, beach hotels',
      'Munnar - Tea garden resorts, hill views',
      'Darjeeling - Heritage hotels, toy train',
      'Shimla - Colonial charm, mountain railways',
      'Ooty - Nilgiri hills, tea garden stays'
    ],
    'high': [
      'Rajasthan Palace Hotels - Heritage luxury experiences',
      'Kashmir - Luxury houseboats, Dal Lake views',
      'Andaman Islands - Premium beach resorts, water sports',
      'Sikkim - Luxury mountain lodges, organic cuisine',
      'Coorg - Premium coffee estate resorts',
      'Kerala Luxury Backwaters - Five-star houseboats',
      'Goa Five-Star Resorts - Beach luxury, spas',
      'Himachal Luxury - Premium mountain retreats',
      'Karnataka Luxury - Palace hotels, heritage stays',
      'Tamil Nadu Heritage - Temple city luxury hotels',
      'Gujarat Heritage Hotels - Palace experiences',
      'Maharashtra Wine Country - Luxury vineyard stays'
    ],
    'luxury': [
      'Udaipur Palace Hotels - Lake Palace, royal suites',
      'Kerala Luxury Resorts - Kumarakom Lake Resort, spas',
      'Goa Luxury Beachfront - Five-star beach villas',
      'Himalayan Luxury Retreats - Exclusive mountain lodges',
      'Rajasthan Desert Camps - Luxury tented accommodations',
      'Kashmir Luxury Houseboats - Premium Dal Lake experiences',
      'Andaman Luxury Islands - Private island resorts',
      'Karnataka Palace Hotels - Mysore Palace luxury',
      'Tamil Nadu Temple Luxury - Heritage palace hotels',
      'Gujarat Luxury Heritage - Exclusive palace experiences',
      'Kerala Ayurveda Resorts - Luxury wellness retreats',
      'Himachal Luxury Lodges - Exclusive mountain experiences'
    ]
  };
  
  const normalizedBudget = budget.toLowerCase();
  for (const key in budgetMap) {
    if (normalizedBudget.includes(key)) {
      return budgetMap[key];
    }
  }
  
  return [
    'Delhi - Diverse accommodation options',
    'Agra - Range from budget to luxury',
    'Jaipur - Heritage and modern hotels',
    'Kerala - Houseboats and resorts',
    'Goa - Beach stays for all budgets'
  ];
};

// Travel style recommendations
export const getTravelRecommendationsByStyle = (style: string): string[] => {
  const styleMap: Record<string, string[]> = {
    'solo': [
      'Rishikesh - Solo spiritual journeys, yoga retreats',
      'Varanasi - Self-discovery, spiritual experiences',
      'Hampi - Solo exploration of ancient ruins',
      'Manali - Solo trekking, mountain solitude',
      'Pushkar - Desert meditation, camel safaris',
      'McLeod Ganj - Buddhist teachings, solo reflection',
      'Kasol - Solo backpacking, mountain vibes',
      'Spiti Valley - Solo road trips, monasteries',
      'Tosh - Solo mountain retreat, valleys',
      'Bir Billing - Solo paragliding adventures',
      'Chopta - Solo trekking, pristine nature',
      'Khajjiar - Solo hill station peace'
    ],
    'couple': [
      'Udaipur - Romantic lake city, palace hotels',
      'Kerala Backwaters - Romantic houseboat cruises',
      'Goa - Beach romance, sunset dinners',
      'Shimla - Hill station romance, toy train',
      'Coorg - Coffee plantation walks, couple spas',
      'Kashmir - Shikara rides, valley romance',
      'Munnar - Tea garden walks, hill station love',
      'Andaman Islands - Beach romance, water sports',
      'Darjeeling - Mountain romance, sunrise views',
      'Ooty - Hill station charm, botanical gardens',
      'Pondicherry - French romance, beach walks',
      'Mount Abu - Desert hill romance, sunset point'
    ],
    'family': [
      'Kerala - Family houseboats, cultural shows',
      'Goa - Family beaches, water sports, heritage',
      'Rajasthan - Palace tours, camel rides, culture',
      'Himachal Pradesh - Family hill stations, toy trains',
      'Karnataka - Mysore Palace, family-friendly sites',
      'Tamil Nadu - Temple tours, cultural heritage',
      'Golden Triangle - Delhi-Agra-Jaipur family circuit',
      'Gujarat - Family heritage, wildlife, culture',
      'Maharashtra - Caves, hill stations, beaches',
      'Uttarakhand - Family-friendly hill stations',
      'West Bengal - Darjeeling toy train, family fun',
      'Madhya Pradesh - Wildlife safaris, family adventures'
    ],
    'friends': [
      'Goa - Beach parties, nightlife, group fun',
      'Manali - Group trekking, adventure sports',
      'Rishikesh - Group rafting, camping, bonfires',
      'Jaisalmer - Desert camping, group camel safaris',
      'Andaman Islands - Group water sports, beach fun',
      'Kasol - Group backpacking, mountain vibes',
      'Bir Billing - Group paragliding, adventure',
      'Spiti Valley - Group road trips, bike tours',
      'Leh-Ladakh - Group bike expeditions',
      'Hampi - Group exploration, boulder climbing',
      'Pushkar - Group desert experiences, festivals',
      'McLeod Ganj - Group spiritual retreats, hiking'
    ]
  };
  
  const normalizedStyle = style.toLowerCase();
  for (const key in styleMap) {
    if (normalizedStyle.includes(key)) {
      return styleMap[key];
    }
  }
  
  return [
    'Delhi - Suitable for all travel styles',
    'Agra - Great for all group types',
    'Jaipur - Perfect for various travel preferences',
    'Kerala - Accommodates all travel styles',
    'Goa - Popular with all types of travelers'
  ];
};

// State-wise comprehensive destinations
export const getDestinationsByState = (state: string): string[] => {
  const stateMap: Record<string, string[]> = {
    'rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Pushkar', 'Mount Abu', 'Chittorgarh', 'Bikaner'],
    'kerala': ['Kochi', 'Munnar', 'Alleppey', 'Kumarakom', 'Wayanad', 'Thekkady', 'Kovalam', 'Varkala'],
    'himachal': ['Manali', 'Shimla', 'Dharamshala', 'Kasol', 'Spiti', 'Bir', 'Tosh', 'Khajjiar'],
    'uttarakhand': ['Rishikesh', 'Nainital', 'Mussoorie', 'Haridwar', 'Auli', 'Chopta', 'Valley of Flowers'],
    'goa': ['North Goa', 'South Goa', 'Panaji', 'Old Goa', 'Anjuna', 'Calangute', 'Palolem'],
    'karnataka': ['Bangalore', 'Mysore', 'Coorg', 'Hampi', 'Gokarna', 'Chikmagalur', 'Badami'],
    'maharashtra': ['Mumbai', 'Pune', 'Lonavala', 'Mahabaleshwar', 'Ajanta Ellora', 'Alibaug'],
    'tamil nadu': ['Chennai', 'Madurai', 'Kodaikanal', 'Ooty', 'Kanyakumari', 'Mahabalipuram'],
    'west bengal': ['Kolkata', 'Darjeeling', 'Kalimpong', 'Sundarbans', 'Digha'],
    'punjab': ['Amritsar', 'Chandigarh', 'Patiala', 'Ludhiana', 'Pathankot'],
    'gujarat': ['Ahmedabad', 'Kutch', 'Dwarka', 'Somnath', 'Gir', 'Saputara'],
    'madhya pradesh': ['Bhopal', 'Khajuraho', 'Sanchi', 'Mandu', 'Pachmarhi', 'Kanha'],
    'andhra pradesh': ['Hyderabad', 'Tirupati', 'Visakhapatnam', 'Araku Valley'],
    'odisha': ['Bhubaneswar', 'Puri', 'Konark', 'Chilika Lake', 'Cuttack']
  };
  
  const normalizedState = state.toLowerCase();
  return stateMap[normalizedState] || [];
};

// Enhanced destination recommendations with detailed analysis
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
  
  // If we have multiple criteria, find best matches
  if (recommendations.length > 0) {
    const destinationCounts: Record<string, number> = {};
    recommendations.forEach(place => {
      const destination = place.split(' - ')[0]; // Extract just the place name
      destinationCounts[destination] = (destinationCounts[destination] || 0) + 1;
    });
    
    // Sort by count and take top recommendations
    const sortedDestinations = Object.keys(destinationCounts)
      .sort((a, b) => destinationCounts[b] - destinationCounts[a])
      .slice(0, 8);
    
    // Add detailed descriptions back
    recommendations = sortedDestinations.map(dest => {
      const fullDesc = recommendations.find(rec => rec.startsWith(dest + ' - '));
      return fullDesc || dest;
    });
  } else {
    // Default comprehensive recommendations for India
    recommendations = [
      'Delhi - India\'s capital with Red Fort, India Gate, and rich Mughal heritage',
      'Agra - Home to the iconic Taj Mahal and Agra Fort',
      'Jaipur - The Pink City with majestic palaces and forts',
      'Kerala - God\'s Own Country with backwaters and spice plantations',
      'Goa - Beautiful beaches and Portuguese colonial charm',
      'Rajasthan - Land of kings with desert and palace experiences',
      'Himachal Pradesh - Mountain paradise with hill stations',
      'Uttarakhand - Spiritual and adventure hub of India'
    ];
  }
  
  console.log('Final recommendations:', recommendations);
  return recommendations;
};

// Get detailed information about specific destinations
export const getDestinationDetails = (destination: string): string => {
  const details: Record<string, string> = {
    'delhi': 'India\'s capital city with over 1000 years of history. Must-visit: Red Fort, India Gate, Humayun\'s Tomb, Qutub Minar, Lotus Temple, Akshardham Temple. Best time: October to March. Famous for: Street food, markets, Mughal architecture.',
    'agra': 'Home to the UNESCO World Heritage Taj Mahal. Must-visit: Taj Mahal, Agra Fort, Fatehpur Sikri, Mehtab Bagh. Best time: October to March. Famous for: Mughal architecture, marble inlay work, petha sweets.',
    'jaipur': 'The Pink City and capital of Rajasthan. Must-visit: Hawa Mahal, City Palace, Amber Fort, Jantar Mantar. Best time: October to March. Famous for: Rajput architecture, gems, textiles, royal heritage.',
    'kerala': 'God\'s Own Country with diverse landscapes. Must-visit: Alleppey backwaters, Munnar hills, Kochi heritage, Thekkady wildlife. Best time: September to March. Famous for: Backwaters, spices, Ayurveda, kathakali.',
    'goa': 'India\'s beach paradise with Portuguese heritage. Must-visit: Baga Beach, Old Goa churches, Dudhsagar Falls, spice plantations. Best time: November to February. Famous for: Beaches, nightlife, seafood, architecture.',
    'rajasthan': 'Land of maharajas and deserts. Must-visit: Udaipur lakes, Jaisalmer desert, Jodhpur blue city, Pushkar holy lake. Best time: October to March. Famous for: Palaces, forts, desert safaris, folk culture.',
    'himachal pradesh': 'Mountain state with hill stations. Must-visit: Manali valleys, Shimla colonial charm, Dharamshala monasteries, Spiti cold desert. Best time: March to June, September to November. Famous for: Adventure sports, monasteries, apple orchards.',
    'uttarakhand': 'Land of gods with spiritual significance. Must-visit: Rishikesh yoga capital, Nainital lakes, Mussoorie hills, Haridwar ghats. Best time: March to June, September to November. Famous for: Spiritual tourism, trekking, hill stations.'
  };
  
  return details[destination.toLowerCase()] || `${destination} is a beautiful destination in India with rich culture and heritage. Please ask for specific information about places to visit, best time to travel, or local attractions.`;
};
