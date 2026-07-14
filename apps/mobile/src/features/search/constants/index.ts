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

/** Default images for business/salon cards when API does not provide images */
export const DEFAULT_SALON_IMAGES = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCXB0y_8pppmOmoMDqWu5-AJ3U06c45bxZE9zaMzAKB1dd8JVkrcmYygYukJ1dYYEbUexBmQWCpm-1OxeAPjTBdZzK9bBpJzgWdbIFWDPJT-ikM-iLBGyHgRu7xYbQSi5c9VTXz9xUNL4rtOjeWN6iMRrSew3kF4Ze2opW1WpQyLBgwlypcB3ba-3KTt6XfTHo6qFmLjgzEtQ8gh6aZcml9HU9sugkunXFQ8WoaZYcWIiiqZcNRp82RQpgTuogo4tyBikQySvW390q7',
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
  LOCATION: 'Address or city',
} as const;

export const SEARCH_FILTERS = [
  { id: 'services', label: 'Services', icon: 'pricetag-outline' },
  { id: 'map', label: 'Map', icon: 'map-outline' },
  { id: 'filters', label: 'Filters', icon: 'options-outline' },
] as const;

/** Fallback city suggestions when geocoding API returns no results (e.g. offline or API down). */
export const FALLBACK_CITY_SUGGESTIONS: Readonly<{ id: string; address: string; city: string; country: string }[]> = [
  { id: 'fallback-paris', address: 'Paris, France', city: 'Paris', country: 'France' },
  { id: 'fallback-lyon', address: 'Lyon, France', city: 'Lyon', country: 'France' },
  { id: 'fallback-toulouse', address: 'Toulouse, France', city: 'Toulouse', country: 'France' },
  { id: 'fallback-marseille', address: 'Marseille, France', city: 'Marseille', country: 'France' },
  { id: 'fallback-bordeaux', address: 'Bordeaux, France', city: 'Bordeaux', country: 'France' },
] as const;
