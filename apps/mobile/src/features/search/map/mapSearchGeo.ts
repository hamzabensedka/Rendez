import type { ApiBusinessListItem } from '../components';
import { DEFAULT_SALON_IMAGES } from '../constants';

export interface MapBusiness extends ApiBusinessListItem {
  _minPrice?: number;
}

export function getDisplayPrice(b: MapBusiness): string {
  if (b._minPrice != null) return `${Math.round(b._minPrice / 100)}€`;
  return '—';
}

export function getCardImageUri(businessId: string): string {
  let n = 0;
  for (let i = 0; i < businessId.length; i++) n = (n * 31 + businessId.charCodeAt(i)) >>> 0;
  return DEFAULT_SALON_IMAGES[n % DEFAULT_SALON_IMAGES.length];
}

export function businessToFeature(b: MapBusiness) {
  const loc = b.locations?.[0];
  const lng = loc?.lng ?? 0;
  const lat = loc?.lat ?? 0;
  return {
    type: 'Feature' as const,
    id: b.id,
    properties: { businessId: b.id, name: b.name },
    geometry: { type: 'Point' as const, coordinates: [lng, lat] },
  };
}

export function businessesToGeoJSON(businesses: MapBusiness[]) {
  const features = businesses
    .filter((b) => {
      const lat = b.locations?.[0]?.lat;
      const lng = b.locations?.[0]?.lng;
      return lat != null && lng != null && (lat !== 0 || lng !== 0);
    })
    .map(businessToFeature);
  return { type: 'FeatureCollection' as const, features };
}
