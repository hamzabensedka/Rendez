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
export const MOCK_ADDRESSES = [
  'Downtown, City Center',
  'North District, Main Street',
  'South Side, Oak Avenue',
  'East End, Park Road',
  'West Quarter, Market Square',
  'Central Plaza, High Street',
  'Riverside, Waterfront Drive',
] as const;

export const SEARCH_PLACEHOLDERS = {
  BUSINESS: 'Service or provider name',
  ADDRESS: 'Address or city',
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
