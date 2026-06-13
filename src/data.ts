import { Hotel } from "./types";

export const RECOMMENDED_CITIES = [
  { name: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80", count: 12 },
  { name: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80", count: 8 },
  { name: "Chamonix", country: "France", image: "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=600&q=80", count: 6 },
  { name: "Maldives", country: "Maldives", image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80", count: 15 },
  { name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80", count: 24 },
  { name: "Marrakech", country: "Morocco", image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80", count: 9 },
];

export const HOTELS_DATA: Hotel[] = [
  {
    id: "santorini-grand",
    name: "The Grand Horizon Resort",
    location: "Oia, Santorini, Greece",
    city: "Santorini",
    description: "Perched dramatically on the high cliffs of Oia, The Grand Horizon Resort offers unparalleled, sweeping vistas of the azure caldera and legendary Santorini sunsets. Designed with traditional Cycladic white-washed architecture contrasted with sleek, minimalist modern interiors, this high-end resort is a sanctuary of ultimate tranquility. Guests can dip into private infinity pools that merge seamlessly with the Aegean horizon, indulge in deep restorative rituals at our holistic cavern spa, or dine under a canopy of stars on exquisite organic Mediterranean delicacies.",
    rating: 4.9,
    reviewsCount: 342,
    stars: 5,
    amenities: ["Infinity Pool", "Cavern Spa", "Panoramic Terrace", "Private Jacuzzi", "Fine Dining", "Airport Shuttle"],
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
    ],
    minPrice: 420,
    rooms: [
      {
        id: "santorini-grand-deluxe-suite",
        name: "Deluxe Caldera View Suite",
        description: "A breathtaking whitewashed suite containing a private plunging pool, private veranda overlooking the deep blue sea, and hand-crafted furniture.",
        capacity: 2,
        pricePerNight: 420,
        size: "48 m²",
        bedType: "1 King Bed",
        amenities: ["Private Plunge Pool", "Veranda", "Espresso Machine", "L'Occitane Toiletries", "Free Wi-Fi"],
        images: [
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80"
        ],
        availableCount: 3
      },
      {
        id: "santorini-grand-honeymoon-villa",
        name: "Honeymoon Infinitum Villa",
        description: "Designed for ultimate romance, this spacious cave-style villa features a heated indoor cavern pool, outdoor hot tub, and prime sunset position.",
        capacity: 2,
        pricePerNight: 680,
        size: "75 m²",
        bedType: "1 Super King Bed",
        amenities: ["Cavern Pool", "Outdoor Jacuzzi", "Sunset Deck", "Complimentary Champagne", "Personal Host"],
        images: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=80"
        ],
        availableCount: 1
      }
    ]
  },
  {
    id: "kyoto-sanctuary",
    name: "Kyoto Bamboo Sanctuary Onsen",
    location: "Arashiyama, Kyoto, Japan",
    city: "Kyoto",
    description: "Nestled quietly amidst the whispering, emerald bamboo groves of scenic Arashiyama, this luxury Onsen sanctuary is a sublime homage to ancient Japanese heritage. Crafted entirely out of fragrant, locally sourced Hinoki cypress wood and visual slate, the retreat brings peace deep into your soul. Listen to the gentle murmuring of the Hozu River from your private open-air hot spring bath, experience profound serenity in our stone-carved Zen gardens, and partake in unforgettable, hand-guided tea ceremonies. Culinary perfection awaits with multi-course Kaiseki dinners.",
    rating: 4.8,
    reviewsCount: 198,
    stars: 5,
    amenities: ["Thermal Hot Spring", "Zen Garden", "Tea House", "Kaiseki Restaurant", "Yukata Provided", "Massage Suite"],
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80"
    ],
    minPrice: 350,
    rooms: [
      {
        id: "kyoto-sanctuary-hinoki",
        name: "Garden-View Hinoki Room",
        description: "Elegant tatami flooring, sliding washi doors, and a deep private tub made of premium Hinoki wood looking onto a private courtyard garden.",
        capacity: 2,
        pricePerNight: 350,
        size: "42 m²",
        bedType: "2 Traditional Futons",
        amenities: ["Hinoki Soaking Tub", "Garden Courtyard", "Organic Tea Set", "Yukata Sets", "Fine Washi Blinds"],
        images: [
          "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80"
        ],
        availableCount: 4
      },
      {
        id: "kyoto-sanctuary-onsen-villa",
        name: "Imperial Riverside Onsen Villa",
        description: "Our premier villa featuring a large, natural stone outdoor hot spring (rotenburo), private dining living area, and stunning river views.",
        capacity: 4,
        pricePerNight: 720,
        size: "95 m²",
        bedType: "2 King Futons",
        amenities: ["Outdoor Stone Onsen", "River Views", "In-Room Kaiseki Dining", "24h Butler", "Sake Bar Setup"],
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80"
        ],
        availableCount: 2
      }
    ]
  },
  {
    id: "alpine-whisper",
    name: "Alpine Whisper ski Chalet",
    location: "Chamonix-Mont-Blanc, France",
    city: "Chamonix",
    description: "Embrace the majestic spirit of the french Alps. Styled after authentic timber lodges but refined with state-of-the-art modern comforts, Alpine Whisper provides an exceptional mountain getaway. Featuring direct ski-in/ski-out access to powdery slopes, a spectacular double-height lounge with a roaring natural stone fireplace, and floor-to-ceiling windows showing the dramatic snow peaks of Mont Blanc. Unwind in the thermal outdoor steam pool as fresh alpine flurries fall around you.",
    rating: 4.8,
    reviewsCount: 154,
    stars: 4,
    amenities: ["Ski-in/Ski-out", "Outdoor Heated Pool", "Fireplace Lounge", "Sauna", "Gourmet Fondue Bar", "Heated Ski Lockers"],
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1518098268026-4e43a1a009de?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1548625361-155de0cbb558?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?auto=format&fit=crop&w=600&q=80"
    ],
    minPrice: 280,
    rooms: [
      {
        id: "alpine-whisper-superior",
        name: "Alpine Superior Chimney Room",
        description: "Cozy timber room with an electric wood stoves fireplace, writing desk, and private balcony offering clear views of the aiguille du Midi.",
        capacity: 2,
        pricePerNight: 280,
        size: "35 m²",
        bedType: "1 Queen Bed",
        amenities: ["Electric Fireplace", "Balcony", "Heated Towel Racks", "Ski Gear Storage", "Nespresso Station"],
        images: [
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=600&q=80"
        ],
        availableCount: 5
      },
      {
        id: "alpine-whisper-chalet-lodge",
        name: "Grand View Chalet Loft",
        description: "A gorgeous family-friendly split-level, raw pine timber loft. Contains structural glass skylights for star gazing and private sauna panels.",
        capacity: 5,
        pricePerNight: 550,
        size: "82 m²",
        bedType: "2 King Beds + 1 Twin Bed",
        amenities: ["In-Suite Sauna", "Panoramic Skylights", "Kitchenette", "Sleds & Mountain Toys", "Premium Sound System"],
        images: [
          "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80"
        ],
        availableCount: 2
      }
    ]
  },
  {
    id: "maldives-luminary",
    name: "The Luminary Overwater Atoll",
    location: "South Ari Atoll, Maldives",
    city: "Maldives",
    description: "Welcome to an overwater wonderland with glass floors, endless lagoons, and colorful house reefs right at your feet. The Luminary Atoll is situated in a highly isolated turquoise lagoon famous for encounters with Whale Sharks and sea turtles. Each premium villa stands on stilts above peaceful marine life, linked by winding wooden bridge pathways. Walk out on your sun decks, slip straight down the slide into warm crystal-clear waters, or watch night shoals glide underneath your custom glass-bottom floor panel.",
    rating: 4.95,
    reviewsCount: 210,
    stars: 5,
    amenities: ["Water Slide", "Glass-Bottom Lounge", "Marine Snorkeling", "Private Deck", "Underwater Restaurant", "Sunset Cruises"],
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80"
    ],
    minPrice: 590,
    rooms: [
      {
        id: "maldives-luminary-lagoon",
        name: "Sunset Ocean Overwater Villa",
        description: "Suspended over a bright emerald lagoon. Features an overwater hammock system, direct wooden staircase to the water, and custom sunset viewing bed.",
        capacity: 2,
        pricePerNight: 590,
        size: "65 m²",
        bedType: "1 Floating King Bed",
        amenities: ["Overwater Hammock", "Lagoon Access staircase", "Glass Floor Panel", "Outdoor Lagoon Jet Shower", "Mini-bar with Premium spirits"],
        images: [
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
        ],
        availableCount: 3
      },
      {
        id: "maldives-luminary-estate",
        name: "Presidential Water Slide Estate",
        description: "The crown jewel villa featuring a high-octane water slide starting from the upper loft level, massive private infinity pool, and personal speedboat.",
        capacity: 4,
        pricePerNight: 1200,
        size: "140 m²",
        bedType: "2 Grand King Beds",
        amenities: ["Curved Water Slide", "Private Infinite Pool", "Glass Bath Tub", "Personal Chef", "Complimentary Speedboat Tours"],
        images: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=600&q=80"
        ],
        availableCount: 1
      }
    ]
  },
  {
    id: "morocco-sandsara",
    name: "Sandsara Sacred Oasis",
    location: "Agafay Desert, Marrakech, Morocco",
    city: "Marrakech",
    description: "Immerse your senses in the magical Agafay Desert, just outside of historic Marrakech. Sandsara Oasis blends luxurious desert glamping structures with structural clay bath pavilions. Wander path tracks lit by hundreds of burning oil lanterns, relax in hot mineral pool basins, or watch shooting stars through optical desert telescopes from our elevated Moroccan carpets. Features outstanding tagine menus prepared by master desert chefs using local saffron, mint, and slow-roasted ingredients.",
    rating: 4.7,
    reviewsCount: 128,
    stars: 4,
    amenities: ["Moroccan Hammam", "Astronomy Dome", "Infinity Oasis Pool", "Traditional Fire Rings", "Camel Desert excursions", "Organic Clay Baths"],
    image: "https://images.unsplash.com/photo-1489493887462-402b72644d55?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
    ],
    minPrice: 220,
    rooms: [
      {
        id: "morocco-sandsara-canopy",
        name: "Nomad Luxury Canopy Pavilion",
        description: "Handwoven organic linen tent walls raised on dark cedar platforms. Contains luxury Persian rugs, deep bathtubs, and sunset dunes terrace.",
        capacity: 2,
        pricePerNight: 220,
        size: "45 m²",
        bedType: "1 Queen Bed",
        amenities: ["Dunes Terrace", "Persian Carpets", "Freestanding Copper Tub", "Premium Air Conditioning", "Moroccan Spiced Tea Basket"],
        images: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=600&q=80"
        ],
        availableCount: 4
      },
      {
        id: "morocco-sandsara-pasha",
        name: "Pasha Royal Oasis Villa",
        description: "An incredible private clay villa compound featuring a lush inner courtyard garden, walled private cooling fountain pool, and a private starry bonfire pit.",
        capacity: 4,
        pricePerNight: 460,
        size: "90 m²",
        bedType: "2 Queen Luxury Beds",
        amenities: ["Courtyard Font Pool", "Fire Pit", "Premium Shisha Lounge", "24/7 Butler Service", "Argan Oil Spa Kit"],
        images: [
          "https://images.unsplash.com/photo-1512918590238-b09e66585b54?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80"
        ],
        availableCount: 2
      }
    ]
  },
  {
    id: "newyork-vanderbilt",
    name: "The Vanderbilt Regency",
    location: "Manhattan, New York, USA",
    city: "New York",
    description: "Soaring monumentally above the vibrant skyline of midtown Manhattan, The Vanderbilt Regency represents classic high-society Gilded Age glamour fused with sleek modern luxury. Steps away from Central Park, Fifth Avenue boutiques, and world-class theatrical arts, this legendary hotel features towering double-height lobby vaults of polished Italian marble, premium crystal chandeliers, and white-gloved concierge service. Skyline views stretch to the Hudson and East rivers.",
    rating: 4.85,
    reviewsCount: 476,
    stars: 5,
    amenities: ["Empire Skyline Club", "Classic Cocktail Vault", "Central Park Access", "Turkish Steam Spa", "Michelin Dining Lounge", "White-glove Valet"],
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
    ],
    minPrice: 380,
    rooms: [
      {
        id: "newyork-vanderbilt-executive",
        name: "Manhattan Plaza Executive King",
        description: "Elegant modern marble flooring, work station desk, and dynamic floor-to-ceiling glass panel capturing the Chrysler building glow.",
        capacity: 2,
        pricePerNight: 380,
        size: "38 m²",
        bedType: "1 Grand King Bed",
        amenities: ["Plaza skyline view", "Italian Marble Bath", "Smart Glass Controls", "Complimentary Newspaper", "Limoges Tea Porcelain Set"],
        images: [
          "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1505692438865-1758d7feb511?auto=format&fit=crop&w=600&q=80"
        ],
        availableCount: 6
      },
      {
        id: "newyork-vanderbilt-vanderbilt-suite",
        name: "Historical Vanderbilt Penthouse",
        description: "A monumental dual-level residence featuring vintage Steinway & Sons pianos, luxury dining room, personal wood library, and deep marble tubs.",
        capacity: 4,
        pricePerNight: 950,
        size: "115 m²",
        bedType: "2 Premium King Beds",
        amenities: ["Vintage Steinway Piano", "Skyline Dining Balcony", "Warming Fireplace", "24/7 Personal Butler", "Exclusive Empire Club Access"],
        images: [
          "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
        ],
        availableCount: 1
      }
    ]
  }
];
