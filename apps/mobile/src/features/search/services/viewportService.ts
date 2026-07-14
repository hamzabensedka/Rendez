/**
 * Viewport-driven API: fetch businesses inside map bounds.
 * Called when map movement ends (onRegionDidChange debounced) or "Search in this zone".
 */

import api from '../../../shared/lib/api';
import type { ApiBusinessListItem } from '../components';

export interface ViewportBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface ViewportParams extends ViewportBounds {
  zoom?: number;
  query?: string;
  category?: string;
  categories?: string;
  availDate?: string;
}

export interface ViewportBusinessesResponse {
  data: ApiBusinessListItem[];
}

/**
 * Fetch businesses whose location falls inside the given viewport bounds.
 * Backend returns only points inside the box (with optional 20% margin applied server-side if desired).
 */
export async function fetchViewportBusinesses(
  params: ViewportParams
): Promise<ApiBusinessListItem[]> {
  const { north, south, east, west, zoom, query, category, categories, availDate } = params;
  try {
    const res = await api.get<ViewportBusinessesResponse>('/businesses/viewport', {
      params: {
        north,
        south,
        east,
        west,
        ...(zoom != null && !Number.isNaN(zoom) && { zoom }),
        ...(query?.trim() && { query: query.trim() }),
        ...(category?.trim() && { category: category.trim() }),
        ...(categories?.trim() && { categories: categories.trim() }),
        ...(availDate?.trim() && { availDate: availDate.trim() }),
      },
    });
    const data = res.data?.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
