/**
 * Search feature constants
 */

export const FREQUENT_SEARCHES = [
  'Coiffeurs',
  'Barbiers',
  'Manucure',
  'Instituts de beauté',
  'Spa',
] as const;

export const SERVICE_CATEGORIES = [
  'Coiffure homme',
  'Coiffure femme',
  'Coiffure jeunes',
  'Coloration',
  'Soins cheveux',
  'Lissage',
  'Extensions',
  'Barbier',
  'Manucure',
  'Pédicure',
  'Soins visage',
  'Massage',
] as const;

// Mock address data - In production, this would come from a geocoding API
export const MOCK_ADDRESSES = [
  'Toulouse, Haute-Garonne, France',
  'Toulouges, Pyrénées-Orientales, France',
  'Toulaud, Ardèche, France',
  'Vieille-Toulouse, Haute-Garonne, France',
  'Toulis-et-Attencourt, Aisne, France',
  'Toulon, Var, France',
  'Toulouse-le-Château, Jura, France',
] as const;

export const SEARCH_PLACEHOLDERS = {
  BUSINESS: 'Nom du salon, prestations (coupe...)',
  ADDRESS: 'Où (Adresse, ville...)',
} as const;

export const SEARCH_FILTERS = [
  { id: 'prestations', label: 'Prestations', icon: 'pricetag-outline' },
  { id: 'carte', label: 'Carte', icon: 'map-outline' },
  { id: 'filtres', label: 'Filtres', icon: 'options-outline' },
] as const;

export const MOCK_SALONS = [
  {
    id: '1',
    name: 'Le salon by Christine et Mélanie',
    address: '66 Av. de Lombez, 31300 Toulouse',
    distance: '159m',
    rating: 4.9,
    reviewCount: 616,
    priceLevel: '€€€',
    description: "Plongez dans l'univers intemporel de Carlos, un salon de coiffure où l'esprit des années 70 se mêle à l'élégance moderne. Laissez-vous transporter par une ambiance solaire et raffinée, où chaque détail est pensé pour votre bien-être. Un rendez-vous avec la mode, la musique et l'art.",
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1521590832169-dca14f33caf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    ],
    availability: {
      morning: ['Mer.07', 'Jeu.08', 'Ven.09'],
      afternoon: ['Mer.07', 'Jeu.08', 'Ven.09'],
    },
    services: [
      {
        id: 'hommes',
        title: 'Hommes',
        items: [
          { id: 'h1', name: 'Coupe homme', duration: '30min', price: '25€' },
          { id: 'h2', name: 'Barbe', duration: '20min', price: '15€' },
        ],
      },
      {
        id: 'femmes',
        title: 'Forfait Femmes',
        items: [
          { id: 'f1', name: 'Shampoing Brushing', duration: '45min', price: '35€' },
          { id: 'f2', name: 'Coupe + Brushing', duration: '1h', price: '55€' },
          { id: 'f3', name: 'Couleur + Coupe + Brushing', duration: '2h', price: '95€' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'L\'Atelier de Coiffure',
    address: '12 Rue de la République, 31300 Toulouse',
    distance: '450m',
    rating: 4.8,
    reviewCount: 324,
    priceLevel: '€€',
    images: [
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    ],
    availability: {
      morning: ['Jeu.08', 'Ven.09', 'Sam.10'],
      afternoon: ['Jeu.08', 'Ven.09'],
    },
    services: [
      {
        id: 'coupe',
        title: 'Coupe',
        items: [
          { id: 'c1', name: 'Coupe classique', duration: '45min', price: '40€' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Barber Shop Toulouse',
    address: '5 Place du Capitole, 31000 Toulouse',
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
      morning: ['Aujourd\'hui', 'Demain'],
      afternoon: ['Aujourd\'hui', 'Demain'],
    },
    services: [
      {
        id: 'barbe',
        title: 'Barbe',
        items: [
          { id: 'b1', name: 'Taille de barbe', duration: '30min', price: '20€' },
        ],
      },
    ],
  },
] as const;
