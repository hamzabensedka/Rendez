/**
 * Search feature constants
 */

export const FREQUENT_SEARCHES = [
  'Hair',
  'Barber',
  'Nails',
  'Spa',
  'Wellness',
] as const;

export const SERVICE_CATEGORIES = [
  'Men\'s hair',
  'Women\'s hair',
  'Kids\' hair',
  'Color',
  'Hair care',
  'Straightening',
  'Extensions',
  'Barber',
  'Manicure',
  'Pedicure',
  'Facial',
  'Massage',
] as const;

// Mock address data – generic; in production this would come from a geocoding API
// Include Toulouse so search by "Toulouse" returns salons (city is taken from last segment after comma)
export const MOCK_ADDRESSES = [
  'Downtown, City Center',
  'North District, Main Street',
  'South Side, Oak Avenue',
  'East End, Park Road',
  'West Quarter, Market Square',
  'Central Plaza, High Street',
  'Riverside, Waterfront Drive',
  '15 Place du Capitole, Toulouse',
  '42 Quai de la Daurade, Toulouse',
  '8 Rue du Taur, Toulouse',
] as const;

/** Default suggested locations shown when location search is empty (match ref design) */
export const DEFAULT_LOCATION_SUGGESTIONS: ReadonlyArray<{
  id: string;
  address: string;
  city?: string;
  country?: string;
}> = [
  { id: 'loc-1', address: '15 Place du Capitole, Toulouse', city: 'Toulouse', country: 'France' },
  { id: 'loc-2', address: 'Avenue Montaigne, Paris', city: 'Paris', country: 'France' },
  { id: 'loc-3', address: 'Bond Street, London', city: 'London', country: 'UK' },
  { id: 'loc-4', address: '5th Avenue, New York', city: 'New York', country: 'USA' },
];

/** Fallback list when user selects Toulouse and API returns empty (e.g. API unreachable). Uses slug as id so detail page can load via GET /businesses/:slug. */
export const TOULOUSE_SALONS_FALLBACK: ReadonlyArray<{
  id: string;
  name: string;
  category: string | null;
  ratingAvg: number;
  ratingCount: number;
  locations: Array<{
    address1: string;
    address2?: string | null;
    postalCode: string;
    city: string;
    country?: string;
  }>;
}> = [
  {
    id: 'coiffure-capitole-toulouse',
    name: 'Coiffure Capitole',
    category: 'Coiffure',
    ratingAvg: 4.7,
    ratingCount: 98,
    locations: [{ address1: '15 Place du Capitole', postalCode: '31000', city: 'Toulouse', country: 'FR' }],
  },
  {
    id: 'salon-garonne-toulouse',
    name: 'Salon Garonne',
    category: 'Coiffure',
    ratingAvg: 4.5,
    ratingCount: 67,
    locations: [{ address1: '42 Quai de la Daurade', postalCode: '31000', city: 'Toulouse', country: 'FR' }],
  },
  {
    id: 'boucles-roses-toulouse',
    name: 'Boucles Roses',
    category: 'Coiffure',
    ratingAvg: 4.9,
    ratingCount: 112,
    locations: [{ address1: '8 Rue du Taur', postalCode: '31000', city: 'Toulouse', country: 'FR' }],
  },
];

/** Full detail fallback for Toulouse salons when API is unreachable. Used by BusinessDetailScreen. */
export const TOULOUSE_SALONS_DETAIL_FALLBACK: Record<
  string,
  {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    ratingAvg: number;
    ratingCount: number;
    status: string;
    locations: Array<{
      id: string;
      label: string;
      address1: string;
      postalCode: string;
      city: string;
      country: string;
    }>;
    services: Array<{
      id: string;
      name: string;
      serviceVariants: Array<{
        id: string;
        name: string;
        durationMin: number;
        priceCents: number | null;
      }>;
    }>;
  }
> = {
  'coiffure-capitole-toulouse': {
    id: 'coiffure-capitole-toulouse',
    name: 'Coiffure Capitole',
    description: 'Salon de coiffure au pied du Capitole. Coupe, coloration et soins capillaires.',
    category: 'Coiffure',
    ratingAvg: 4.7,
    ratingCount: 98,
    status: 'active',
    locations: [
      { id: 'loc-1', label: 'Principal', address1: '15 Place du Capitole', postalCode: '31000', city: 'Toulouse', country: 'FR' },
    ],
    services: [
      {
        id: 's1-cap',
        name: 'Coupe',
        serviceVariants: [
          { id: 'v1-cap-f', name: 'Coupe femme', durationMin: 45, priceCents: 4200 },
          { id: 'v2-cap-h', name: 'Coupe homme', durationMin: 30, priceCents: 2600 },
        ],
      },
      {
        id: 's2-cap',
        name: 'Coloration',
        serviceVariants: [
          { id: 'v3-col', name: 'Coloration complète', durationMin: 90, priceCents: 7200 },
          { id: 'v4-mech', name: 'Mèches', durationMin: 120, priceCents: 8800 },
        ],
      },
      {
        id: 's3-cap',
        name: 'Brushing',
        serviceVariants: [{ id: 'v5-brush', name: 'Brushing', durationMin: 30, priceCents: 2000 }],
      },
    ],
  },
  'salon-garonne-toulouse': {
    id: 'salon-garonne-toulouse',
    name: 'Salon Garonne',
    description: 'Coiffure et barbier près des quais. Ambiance décontractée, expertise homme et femme.',
    category: 'Coiffure',
    ratingAvg: 4.5,
    ratingCount: 67,
    status: 'active',
    locations: [
      { id: 'loc-2', label: 'Principal', address1: '42 Quai de la Daurade', postalCode: '31000', city: 'Toulouse', country: 'FR' },
    ],
    services: [
      {
        id: 's1-gar',
        name: 'Coupe',
        serviceVariants: [
          { id: 'v1-gar-f', name: 'Coupe femme', durationMin: 45, priceCents: 4200 },
          { id: 'v2-gar-h', name: 'Coupe homme', durationMin: 30, priceCents: 2600 },
        ],
      },
      {
        id: 's2-gar',
        name: 'Coloration',
        serviceVariants: [
          { id: 'v3-gar-col', name: 'Coloration complète', durationMin: 90, priceCents: 7200 },
          { id: 'v4-gar-mech', name: 'Mèches', durationMin: 120, priceCents: 8800 },
        ],
      },
      {
        id: 's3-gar',
        name: 'Brushing',
        serviceVariants: [{ id: 'v5-gar-brush', name: 'Brushing', durationMin: 30, priceCents: 2000 }],
      },
    ],
  },
  'boucles-roses-toulouse': {
    id: 'boucles-roses-toulouse',
    name: 'Boucles Roses',
    description: 'Spécialiste coloration et mèches dans la ville rose. Conseils personnalisés.',
    category: 'Coiffure',
    ratingAvg: 4.9,
    ratingCount: 112,
    status: 'active',
    locations: [
      { id: 'loc-3', label: 'Principal', address1: '8 Rue du Taur', postalCode: '31000', city: 'Toulouse', country: 'FR' },
    ],
    services: [
      {
        id: 's1-br',
        name: 'Coupe',
        serviceVariants: [
          { id: 'v1-br-f', name: 'Coupe femme', durationMin: 45, priceCents: 4200 },
          { id: 'v2-br-h', name: 'Coupe homme', durationMin: 30, priceCents: 2600 },
        ],
      },
      {
        id: 's2-br',
        name: 'Coloration',
        serviceVariants: [
          { id: 'v3-br-col', name: 'Coloration complète', durationMin: 90, priceCents: 7200 },
          { id: 'v4-br-mech', name: 'Mèches', durationMin: 120, priceCents: 8800 },
        ],
      },
      {
        id: 's3-br',
        name: 'Brushing',
        serviceVariants: [{ id: 'v5-br-brush', name: 'Brushing', durationMin: 30, priceCents: 2000 }],
      },
    ],
  },
};

/** Default images for business/salon cards when API does not provide images */
export const DEFAULT_SALON_IMAGES = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCXB0y_8pppmOmoMDqWu5-AJ3U06c45bxZE9zaMzAKB1dd8JVkrcmYygYukJ1dYYEbUexBmQWCpm-1OxeAPjTBdZzK9bBpJzgWdbIFWDPJT-ikM-iLBGyHgRu7xYbQSi5c9VTXz9xUNL4rtOjeWN6iMRrSew3kF4Ze2opW1WpQyLBgwlypcB3ba-3KTt6XfTHo6qFmLjgzEtQ8gh6aZcml9HU9sugkunXFQ8WoaZYcWIiiqZcNRp82RQpgTuogo4tyBikQySvW390q7',
] as const;

/** Placeholder availability for list cards when real slots are not yet loaded */
export const DEFAULT_AVAILABILITY = {
  morning: ['Today 10:00', 'Today 14:00', 'Tomorrow 9:00'],
  afternoon: ['Today 15:00', 'Tomorrow 14:00', 'Tomorrow 16:00'],
} as const;

/** Booking slot labels for RENDEZ-style cards (first is primary "Book Now") */
export const DEFAULT_BOOKING_SLOTS = [
  '10:00 AM (Book Now)',
  '12:30 PM',
  '14:00 PM',
  'Tomorrow 10:00 AM',
  'Tomorrow 15:00 PM',
] as const;

/** Trending treatments for search landing (Trending Near You). Images are B&W. */
export const TRENDING_NEAR_YOU = [
  { id: 'balayage', label: 'Balayage', imageUrl: 'https://picsum.photos/seed/balayage/400/533?grayscale' },
  { id: 'facials', label: 'Facials', imageUrl: 'https://picsum.photos/seed/facials/400/533?grayscale' },
  { id: 'gel-nails', label: 'Gel Nails', imageUrl: 'https://picsum.photos/seed/nails/400/533?grayscale' },
] as const;

/** Filter pills for search results (Distance, Rating, Price, etc.) */
export const RESULT_FILTER_PILLS = [
  { id: 'distance', label: 'Distance' },
  { id: 'rating', label: 'Rating' },
  { id: 'price', label: 'Price' },
  { id: 'availability', label: 'Availability' },
  { id: 'specialties', label: 'Specialties' },
] as const;

export const SEARCH_PLACEHOLDERS = {
  BUSINESS: 'Service or provider name',
  ADDRESS: 'Address or city',
  TREATMENTS: 'Treatments, salons or stylists...',
  LOCATION: 'Search for a boutique or city',
} as const;

export const SEARCH_FILTERS = [
  { id: 'services', label: 'Services', icon: 'pricetag-outline' },
  { id: 'map', label: 'Map', icon: 'map-outline' },
  { id: 'filters', label: 'Filters', icon: 'options-outline' },
] as const;

export const MOCK_SALONS = [
  {
    id: '1',
    name: 'Studio One',
    address: '66 Main Street, City Center',
    distance: '159m',
    rating: 4.9,
    reviewCount: 616,
    priceLevel: '€€€',
    description: 'A welcoming space for hair and grooming services. Modern style with attention to detail.',
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1521590832169-dca14f33caf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    ],
    availability: {
      morning: ['Wed 7th', 'Thu 8th', 'Fri 9th'],
      afternoon: ['Wed 7th', 'Thu 8th', 'Fri 9th'],
    },
    services: [
      {
        id: 'men',
        title: 'Men',
        items: [
          { id: 'h1', name: 'Men\'s cut', duration: '30min', price: '25€' },
          { id: 'h2', name: 'Beard trim', duration: '20min', price: '15€' },
        ],
      },
      {
        id: 'women',
        title: 'Women',
        items: [
          { id: 'f1', name: 'Wash & blow-dry', duration: '45min', price: '35€' },
          { id: 'f2', name: 'Cut & blow-dry', duration: '1h', price: '55€' },
          { id: 'f3', name: 'Color, cut & blow-dry', duration: '2h', price: '95€' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'The Atelier',
    address: '12 High Street, City Center',
    distance: '450m',
    rating: 4.8,
    reviewCount: 324,
    priceLevel: '€€',
    images: [
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    ],
    availability: {
      morning: ['Thu 8th', 'Fri 9th', 'Sat 10th'],
      afternoon: ['Thu 8th', 'Fri 9th'],
    },
    services: [
      {
        id: 'cut',
        title: 'Cut',
        items: [
          { id: 'c1', name: 'Classic cut', duration: '45min', price: '40€' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Barber & Co',
    address: '5 Market Square, City Center',
    distance: '1.2km',
    rating: 4.7,
    reviewCount: 890,
    priceLevel: '€',
    images: [
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1521590832169-dca14f33caf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    ],
    availability: {
      morning: ['Today', 'Tomorrow'],
      afternoon: ['Today', 'Tomorrow'],
    },
    services: [
      {
        id: 'beard',
        title: 'Beard',
        items: [
          { id: 'b1', name: 'Beard trim', duration: '30min', price: '20€' },
        ],
      },
    ],
  },
] as const;
