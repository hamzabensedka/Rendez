/**
 * Map search results — MapLibre + OSM raster tiles, viewport-driven API.
 * - Map: MapLibre with OSM tiles; markers from GET /businesses/viewport (north/south/east/west).
 * - Queries only on map movement end, zoom change, or "Search in this zone".
 * - Geocoding: backend proxy (Nominatim). Locate me: center on user location.
 */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@planity/ui';
import { useFavorites } from '../../../application/providers';
import { DEFAULT_SALON_IMAGES } from '../constants';
import { OSM_RASTER_STYLE } from '../constants/mapStyle';
import api from '../../../shared/lib/api';
import { fetchViewportBusinesses } from '../services/viewportService';
import { getCurrentLocation } from '../services/addressService';
import type { ApiBusinessListItem } from '../components';
import Constants from 'expo-constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/** Easing for card slide so it feels like it's leaving/entering the screen. */
const CARD_SLIDE_EASING = Easing.out(Easing.cubic);

/** Only load MapLibre when not in Expo Go; native module is not available in Expo Go. */
const isExpoGo = Constants.appOwnership === 'expo';

let MapView: React.ComponentType<any> | null = null;
let Camera: React.ComponentType<any> | null = null;
let ShapeSource: React.ComponentType<any> | null = null;
let SymbolLayer: React.ComponentType<any> | null = null;
let Images: React.ComponentType<any> | null = null;
let CircleLayer: React.ComponentType<any> | null = null;
let UserLocation: React.ComponentType<any> | null = null;
if (!isExpoGo) {
  try {
    const ML = require('@maplibre/maplibre-react-native');
    MapView = ML.MapView;
    Camera = ML.Camera;
    ShapeSource = ML.ShapeSource;
    SymbolLayer = ML.SymbolLayer;
    Images = ML.Images;
    CircleLayer = ML.CircleLayer;
    UserLocation = ML.UserLocation ?? null;
  } catch {
    // Dev build without native map linked
  }
}

/** Black salon pin icon (PNG) for map markers */
const SALON_PIN_IMAGE = require('../../../../assets/salon-pin.png');

/** Pin size on the map. MapLibre uses a single scale (iconSize) so width/height scale together; adjust these to control size. */
const PIN_ICON_WIDTH = 0.1;
const PIN_ICON_HEIGHT = 0.1;
const PIN_ICON_SIZE = (PIN_ICON_WIDTH + PIN_ICON_HEIGHT) / 2;

const bw = {
  primary: '#000000',
  background: '#FFFFFF',
  surface: '#F4F4F4',
  border: '#E5E5E5',
  text: '#000000',
  textSecondary: '#666666',
  textMuted: '#999999',
  mapBg: '#F0F0F0',
  white: '#FFFFFF',
};

interface MapBusiness extends ApiBusinessListItem {
  _minPrice?: number;
}

function getDisplayPrice(b: MapBusiness): string {
  if (b._minPrice != null) return `${Math.round(b._minPrice / 100)}€`;
  return '—';
}

/** Pick a stable placeholder image per business so the card image changes when selecting another pin. */
function getCardImageUri(businessId: string): string {
  let n = 0;
  for (let i = 0; i < businessId.length; i++) n = (n * 31 + businessId.charCodeAt(i)) >>> 0;
  return DEFAULT_SALON_IMAGES[n % DEFAULT_SALON_IMAGES.length];
}

/** Default Paris center when location unavailable */
const DEFAULT_CENTER: [number, number] = [2.3522, 48.8566];
const DEFAULT_ZOOM = 14;
const VIEWPORT_DEBOUNCE_MS = 400;
const LOADING_TIMEOUT_MS = 12000;
/** Delta for fallback bounds when getVisibleBounds fails (approx ~5km) */
const FALLBACK_DELTA = 0.05;

function businessToFeature(b: MapBusiness) {
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

function businessesToGeoJSON(businesses: MapBusiness[]) {
  const features = businesses
    .filter((b) => {
      const lat = b.locations?.[0]?.lat;
      const lng = b.locations?.[0]?.lng;
      return lat != null && lng != null && (lat !== 0 || lng !== 0);
    })
    .map(businessToFeature);
  return { type: 'FeatureCollection' as const, features };
}

interface MapSearchScreenProps {
  /** When true, hide the top header (back/logo/profile) for embedding inside SearchResultsScreen */
  embedded?: boolean;
  /** Pre-loaded businesses from list view so markers show immediately (e.g. when switching to map tab) */
  initialBusinesses?: ApiBusinessListItem[];
}

export default function MapSearchScreen({ embedded, initialBusinesses }: MapSearchScreenProps) {
  const router = useRouter();
  const { address, category } = useLocalSearchParams<{ address?: string; category?: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [searchQuery] = useState('');
  const [businesses, setBusinesses] = useState<MapBusiness[]>(() =>
    Array.isArray(initialBusinesses) && initialBusinesses.length > 0
      ? initialBusinesses.map((b) => ({ ...b }))
      : []
  );
  const [selectedBusiness, setSelectedBusiness] = useState<MapBusiness | null>(null);
  const [previousBusiness, setPreviousBusiness] = useState<MapBusiness | null>(null);
  const [loading, setLoading] = useState(false);
  const [categoryLabel] = useState(category || 'Coiffure');
  const [mapReady, setMapReady] = useState(false);
  const initialFetchDoneRef = useRef(false);

  /** Carousel: 3 slots [empty | selected | empty], strip slides so new selection enters from left. */
  const CARD_MARGIN = 32;
  const cardWidth = SCREEN_WIDTH - CARD_MARGIN;
  /** Idle: -cardWidth (show slot2). After tap: animate to 0 (slot1 with new data slides into view). */
  const stripTranslate = useSharedValue(-cardWidth);
  /** Ref to track last known center for fallback bounds — not reactive, no re-renders. */
  const initialCenterRef = useRef<[number, number]>(DEFAULT_CENTER);
  const initialLocationFetched = useRef(false);
  /** True once the user manually pans/zooms — prevents a slow GPS fix from overriding their pan. */
  const userHasInteractedRef = useRef(false);
  /** Start fetching location on mount so it's ready by the time the map finishes loading. */
  const pendingLocationRef = useRef<Promise<{ lat: number; lng: number } | null> | null>(null);

  const mapRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const viewportDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasNativeMap = Boolean(MapView && Camera && ShapeSource && (SymbolLayer || CircleLayer) && Images);

  const city = address && address.includes(',') ? address.split(',').pop()?.trim() : undefined;
  const query = city ? undefined : ([category, address].filter(Boolean).join(' ') || undefined);

  // Kick off location fetch immediately on mount — runs in parallel with map loading.
  useEffect(() => {
    pendingLocationRef.current = getCurrentLocation();
  }, []);

  const fetchViewport = useCallback(
    async (bounds: { north: number; south: number; east: number; west: number }, zoom?: number) => {
      const list = await fetchViewportBusinesses({
        ...bounds,
        zoom,
        query: searchQuery.trim() || undefined,
        category: categoryLabel !== 'Coiffure' ? categoryLabel : undefined,
      });
      const withPrice: MapBusiness[] = list.map((b) => ({ ...b }));
      // Only replace businesses when we got results — never wipe with empty so markers don't disappear
      setBusinesses((prev) => (withPrice.length > 0 ? withPrice : prev));
      if (withPrice.length > 0) {
        setSelectedBusiness((prev) => {
          const still = withPrice.find((b) => b.id === prev?.id);
          return still ?? withPrice[0] ?? null;
        });
      }
      setLoading(false);
    },
    [searchQuery, categoryLabel]
  );

  const onRegionDidChange = useCallback((event?: any) => {
    // Mark that the user has manually moved the map — used to guard the initial setCamera call.
    if (event?.properties?.isUserInteraction) {
      userHasInteractedRef.current = true;
    }
    if (!mapRef.current || !mapReady) return;
    if (viewportDebounceRef.current) clearTimeout(viewportDebounceRef.current);
    viewportDebounceRef.current = setTimeout(async () => {
      viewportDebounceRef.current = null;
      try {
        let bounds: { ne: [number, number]; sw: [number, number] } | null = null;
        try {
          bounds = await mapRef.current?.getVisibleBounds?.() ?? null;
        } catch {
          // getVisibleBounds can fail on some devices; use fallback from last known center
        }
        if (!bounds?.ne || !bounds?.sw) {
          const [lng, lat] = initialCenterRef.current;
          bounds = {
            ne: [lng + FALLBACK_DELTA, lat + FALLBACK_DELTA],
            sw: [lng - FALLBACK_DELTA, lat - FALLBACK_DELTA],
          };
        }
        const [e, n] = bounds.ne;
        const [w, s] = bounds.sw;
        await fetchViewport({ north: n, south: s, east: e, west: w });
      } catch {
        setBusinesses((prev) => prev);
        setLoading(false);
      }
    }, VIEWPORT_DEBOUNCE_MS);
  }, [mapReady, fetchViewport]); // initialCenterRef is a ref — no need in deps

  // When native map is ready, position the camera: center on salons when we have them, else user/Paris.
  useEffect(() => {
    if (!hasNativeMap || !mapReady) return;
    if (initialLocationFetched.current) return;
    initialLocationFetched.current = true;

    const run = async () => {
      if (userHasInteractedRef.current) return;

      const withLocation = Array.isArray(initialBusinesses)
        ? initialBusinesses.filter((b) => b.locations?.[0]?.lat != null && b.locations?.[0]?.lng != null)
        : [];
      let center: [number, number];
      let duration = 0;

      if (withLocation.length > 0) {
        // Center map on salons from the list so they stay visible
        const sumLng = withLocation.reduce((s, b) => s + (b.locations![0].lng ?? 0), 0);
        const sumLat = withLocation.reduce((s, b) => s + (b.locations![0].lat ?? 0), 0);
        center = [sumLng / withLocation.length, sumLat / withLocation.length];
        initialCenterRef.current = center;
        duration = 400;
        initialFetchDoneRef.current = true; // keep list salons; don't run initial viewport fetch
      } else {
        const pos = await (pendingLocationRef.current ?? getCurrentLocation());
        center = pos ? [pos.lng, pos.lat] : DEFAULT_CENTER;
        if (pos) initialCenterRef.current = center;
        duration = pos ? 600 : 0;
      }

      cameraRef.current?.setCamera({
        centerCoordinate: center,
        zoomLevel: DEFAULT_ZOOM,
        animationDuration: duration,
      });

      setTimeout(() => {
        cameraRef.current?.setCamera({ animationDuration: 0 });
      }, duration + 100);

      // Initial viewport fetch only when we don't already have salons from the list
      if (withLocation.length > 0) return;
      setTimeout(async () => {
        if (initialFetchDoneRef.current) return;
        initialFetchDoneRef.current = true;
        setLoading(true);
        try {
          let bounds: { ne: [number, number]; sw: [number, number] } | null = null;
          try {
            bounds = await mapRef.current?.getVisibleBounds?.() ?? null;
          } catch {
            // use fallback bounds from current center
          }
          if (!bounds?.ne || !bounds?.sw) {
            const [lng, lat] = initialCenterRef.current;
            bounds = {
              ne: [lng + FALLBACK_DELTA, lat + FALLBACK_DELTA],
              sw: [lng - FALLBACK_DELTA, lat - FALLBACK_DELTA],
            };
          }
          const [e, n] = bounds.ne;
          const [w, s] = bounds.sw;
          await fetchViewport({ north: n, south: s, east: e, west: w });
        } catch {
          setBusinesses((prev) => prev);
        } finally {
          setLoading(false);
        }
      }, duration + 600);
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, hasNativeMap, initialBusinesses]);

  // When native map is not available (Expo Go), load businesses by city/query so the card still works.
  useEffect(() => {
    if (hasNativeMap) return;
    let cancelled = false;
    setLoading(true);
    api
      .get<{ data: ApiBusinessListItem[] }>('/businesses', {
        params: { query: query || undefined, city: city || undefined, limit: 50 },
      })
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setBusinesses(list.map((b) => ({ ...b })));
        if (list.length > 0) setSelectedBusiness(list[0] as MapBusiness);
      })
      .catch(() => {
        if (!cancelled) setBusinesses([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [hasNativeMap, query, city]);

  useEffect(() => {
    if (businesses.length > 0 && !selectedBusiness) setSelectedBusiness(businesses[0]);
  }, [businesses, selectedBusiness]);

  // Stable callback — prevents MapView from re-attaching children on every render
  const handleMapReady = useCallback(() => setMapReady(true), []);

  const handleBack = useCallback(() => router.back(), [router]);
  const handleProfile = useCallback(() => router.push('/(tabs)/profile'), [router]);

  const handleSearchInZone = useCallback(async () => {
    if (!MapView || !mapRef.current) return;
    setLoading(true);
    const timeoutId = setTimeout(() => setLoading(false), LOADING_TIMEOUT_MS);
    try {
      let bounds: { ne: [number, number]; sw: [number, number] } | null = null;
      try {
        bounds = await mapRef.current.getVisibleBounds?.() ?? null;
      } catch {
        // use fallback bounds from current center
      }
      if (!bounds?.ne || !bounds?.sw) {
        const [lng, lat] = initialCenterRef.current;
        bounds = {
          ne: [lng + FALLBACK_DELTA, lat + FALLBACK_DELTA],
          sw: [lng - FALLBACK_DELTA, lat - FALLBACK_DELTA],
        };
      }
      const [e, n] = bounds.ne;
      const [w, s] = bounds.sw;
      await fetchViewport({ north: n, south: s, east: e, west: w });
    } catch {
      setBusinesses([]);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [fetchViewport]);

  const handleLocateMe = useCallback(async () => {
    const pos = await getCurrentLocation();
    if (pos && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [pos.lng, pos.lat],
        zoomLevel: DEFAULT_ZOOM,
        animationDuration: 800,
      });
      // Clear cached stop so addToMap can't replay it
      setTimeout(() => {
        cameraRef.current?.setCamera({ animationDuration: 0 });
      }, 900);
    }
  }, []);

  const handleBook = useCallback(() => {
    if (selectedBusiness) router.push(`/(tabs)/business/${selectedBusiness.id}`);
  }, [selectedBusiness, router]);

  const handleCardPress = useCallback(() => {
    if (selectedBusiness) router.push(`/(tabs)/business/${selectedBusiness.id}`);
  }, [selectedBusiness, router]);

  /*
   * CAROUSEL ANIMATION SCHEMA (3 slots, infinite loop)
   * ─────────────────────────────────────────────────
   * Strip: [ slot1 | slot2 | slot3 ]  width = 3 * cardWidth
   *        empty    selected  empty
   *
   * IDLE (previousBusiness = null):
   *   stripTranslate = -cardWidth  → visible window shows slot2 (selected)
   *   slot1 = empty, slot2 = selectedBusiness, slot3 = empty
   *
   * USER TAPS ANOTHER PIN:
   *   slot1 = new selected, slot2 = old selected, slot3 = empty
   *   Strip slides LEFT (translate -cardWidth → 0): slot1 (new) slides into center, slot2 (old) and slot3 move left with it; slot3 ends where slot1 was (empty).
   *
   * When animation ends (translate = 0, we see slot1 = new):
   *   Reset for next loop: slot1 = empty, slot2 = new, slot3 = empty; stripTranslate = -cardWidth
   *   Visible: still slot2 (new) — same content, no flash.
   */

  const clearPrevious = useCallback(() => {
    setPreviousBusiness(null);
  }, []);


  // When idle (previousBusiness = null): snap strip back to -cardWidth instantly.
  // Slot1 always renders selectedBusiness so even if the snap arrives one frame late,
  // the user still sees the correct card — no blink.
  useLayoutEffect(() => {
    if (previousBusiness) return;
    stripTranslate.value = -cardWidth;
  }, [previousBusiness, stripTranslate, cardWidth]);

  // Main carousel: when user taps another pin, slide new card in from the left.
  // useLayoutEffect so the strip snaps to -cardWidth in the same commit/layout pass
  // as the updated slot content — prevents any frame showing slot2 with stale data.
  useLayoutEffect(() => {
    if (!previousBusiness) return;
    // Snap to -cardWidth first (show slot2 = previousBusiness) then animate to 0 (slot1 = new).
    stripTranslate.value = -cardWidth;
    stripTranslate.value = withTiming(
      0,
      { duration: 420, easing: CARD_SLIDE_EASING },
      (finished) => {
        'worklet';
        if (finished) runOnJS(clearPrevious)();
      }
    );
  }, [previousBusiness, cardWidth, stripTranslate, clearPrevious]);

  const stripAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: stripTranslate.value }],
  }));

  const renderCardInner = useCallback(
    (b: MapBusiness) => (
      <>
        <Image
          source={{ uri: getCardImageUri(b.id) }}
          style={[styles.cardImage, styles.cardImageBw]}
        />
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Text style={styles.cardName} numberOfLines={1}>{b.name}</Text>
            <TouchableOpacity
              onPress={() => toggleFavorite(b.id)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons
                name={isFavorite(b.id) ? 'heart' : 'heart-outline'}
                size={22}
                color={bw.primary}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.cardAddress} numberOfLines={1}>
            {b.locations?.[0]
              ? [b.locations[0].postalCode, b.locations[0].city].filter(Boolean).join(' ')
              : '—'}
            {' • 0.4 km'}
          </Text>
          <View style={styles.cardRating}>
            <Ionicons name="star" size={12} color={bw.primary} />
            <Text style={styles.cardRatingText}>{b.ratingAvg?.toFixed(1) ?? '—'}</Text>
            <Text style={styles.cardReviews}>
              ({(b.ratingCount ?? 0) >= 1000
                ? `${((b.ratingCount ?? 0) / 1000).toFixed(1)}k`
                : b.ratingCount ?? 0} avis)
            </Text>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardService}>
              {b.category ?? 'Prestation'} • {getDisplayPrice(b)}
            </Text>
            <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
              <Text style={styles.bookButtonText}>RÉSERVER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    ),
    [toggleFavorite, isFavorite, handleBook]
  );

  const handleMarkerPress = useCallback(
    (event: { features?: Array<{ properties?: { businessId?: string } }> }) => {
      const id = event?.features?.[0]?.properties?.businessId;
      if (id) {
        const b = businesses.find((x) => x.id === id);
        if (b && b.id !== selectedBusiness?.id) {
          if (selectedBusiness) setPreviousBusiness(selectedBusiness);
          setSelectedBusiness(b);
        }
      }
    },
    [businesses, selectedBusiness]
  );

  const MapViewComponent = MapView;
  const CameraComponent = Camera;
  const ShapeSourceComponent = ShapeSource;
  const SymbolLayerComponent = SymbolLayer;
  const ImagesComponent = Images;
  const CircleLayerComponent = CircleLayer;
  const UserLocationComponent = UserLocation;
  const usePinIcon = Boolean(SymbolLayerComponent && ImagesComponent);

  return (
    <View style={[styles.container, embedded && styles.embeddedContainer]}>
      <StatusBar barStyle="dark-content" backgroundColor={bw.background} />
      <SafeAreaView style={styles.safeArea} edges={embedded ? [] : ['top']}>
        {!embedded && (
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.iconButton} accessibilityLabel="Back">
              <Ionicons name="arrow-back" size={24} color={bw.primary} />
            </TouchableOpacity>
            <Text style={styles.logo}>PLANITY</Text>
            <TouchableOpacity onPress={handleProfile} style={styles.iconButton} accessibilityLabel="Profile">
              <Ionicons name="person-outline" size={24} color={bw.primary} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.mapContainer}>
          {hasNativeMap && MapViewComponent && CameraComponent && ShapeSourceComponent && (SymbolLayerComponent || CircleLayerComponent) && ImagesComponent ? (
            <MapViewComponent
              ref={mapRef}
              style={styles.mapBackground}
              mapStyle={OSM_RASTER_STYLE}
              onDidFinishLoadingMap={handleMapReady}
              onRegionDidChange={onRegionDidChange}
              attributionEnabled={true}
              logoEnabled={false}
            >
              <CameraComponent ref={cameraRef} followUserLocation={false} />
              {UserLocationComponent && (
                <UserLocationComponent visible={true} animated={true} />
              )}
              {ImagesComponent && (
                <ImagesComponent
                  images={{
                    salonPin: usePinIcon ? { source: SALON_PIN_IMAGE } : undefined,
                  }}
                />
              )}
              <ShapeSourceComponent
                id="businesses"
                key={`businesses-${businesses.length}-${businesses.map((b) => b.id).slice(0, 3).join('-')}`}
                shape={businessesToGeoJSON(businesses)}
                onPress={handleMarkerPress}
              >
                {usePinIcon && SymbolLayerComponent ? (
                  <SymbolLayerComponent
                    id="business-markers"
                    sourceID="businesses"
                    style={{
                      iconImage: 'salonPin',
                      iconSize: [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        10, 0.032,
                        14, 0.058,
                        18, 0.088,
                      ],
                      iconAllowOverlap: true,
                      iconIgnorePlacement: true,
                      iconAnchor: 'bottom',
                    }}
                  />
                ) : CircleLayerComponent ? (
                  <CircleLayerComponent
                    id="business-markers"
                    sourceID="businesses"
                    style={{
                      circleRadius: [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        10, 8,
                        14, 14,
                        18, 20,
                      ],
                      circleColor: bw.primary,
                      circleStrokeWidth: 3,
                      circleStrokeColor: bw.white,
                      circlePitchScale: 'map',
                    }}
                  />
                ) : null}
              </ShapeSourceComponent>
            </MapViewComponent>
          ) : (
            <View style={[styles.mapBackground, { backgroundColor: bw.mapBg }]}>
              <View style={styles.mapPlaceholder}>
                <Ionicons name="map-outline" size={48} color={bw.textMuted} />
                <Text style={styles.mapPlaceholderText}>
                  Carte disponible en build natif (MapLibre + OSM)
                </Text>
                <Text style={styles.mapPlaceholderSub}>Expo Go n’affiche pas la carte.</Text>
              </View>
            </View>
          )}

          {loading && (
            <View style={styles.mapLoading} pointerEvents="none">
              <ActivityIndicator size="small" color={bw.primary} />
            </View>
          )}

          <TouchableOpacity style={styles.fabSearchZone} onPress={handleSearchInZone}>
            <Ionicons name="refresh" size={18} color={bw.primary} />
            <Text style={styles.fabSearchZoneText}>RECHERCHER DANS CETTE ZONE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.fabLocate} onPress={handleLocateMe}>
            <Ionicons name="locate" size={24} color={bw.primary} />
          </TouchableOpacity>
        </View>

        {selectedBusiness && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleCardPress}
            style={styles.bottomCard}
          >
            <View style={[styles.cardSlideContainer, { width: cardWidth }]}>
              <Animated.View
                style={[styles.carouselStrip, { width: cardWidth * 3 }, stripAnimatedStyle]}
              >
                <View style={[styles.carouselCard, { width: cardWidth }]}>
                  <View style={styles.cardSlideSlotSingle}>
                    <View style={styles.bottomCardInner}>
                      {renderCardInner(selectedBusiness)}
                    </View>
                  </View>
                </View>
                <View style={[styles.carouselCard, { width: cardWidth }]}>
                  <View style={styles.cardSlideSlotSingle}>
                    <View style={styles.bottomCardInner}>
                      {renderCardInner(previousBusiness ?? selectedBusiness)}
                    </View>
                  </View>
                </View>
                <View style={[styles.carouselCard, { width: cardWidth }]}>
                  <View style={styles.cardSlideSlotSingle}>
                    <View style={styles.bottomCardInner}>
                      <>
                        <View style={styles.emptyCardPlaceholder} />
                        <View style={styles.emptyCardPlaceholderContent} />
                      </>
                    </View>
                  </View>
                </View>
              </Animated.View>
            </View>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: bw.background },
  embeddedContainer: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: bw.border,
  },
  iconButton: { padding: 8 },
  logo: { fontSize: 18, fontWeight: '700', letterSpacing: 4, color: bw.primary },
  mapContainer: { flex: 1, position: 'relative', minHeight: 280 },
  mapBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  mapPlaceholderText: { fontSize: 14, color: bw.textSecondary, marginTop: 8, textAlign: 'center' },
  mapPlaceholderSub: { fontSize: 12, color: bw.textMuted, marginTop: 4 },
  mapLoading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  fabSearchZone: {
    position: 'absolute',
    top: 16,
    left: '50%',
    marginLeft: -140,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: bw.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: bw.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  fabSearchZoneText: { fontSize: 11, fontWeight: '700', color: bw.primary },
  fabLocate: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: bw.white,
    borderWidth: 1,
    borderColor: bw.border,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  bottomCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    overflow: 'hidden',
    minHeight: 120,
  },
  cardSlideContainer: {
    overflow: 'hidden',
  },
  carouselStrip: {
    flexDirection: 'row',
  },
  carouselCard: {
    flexShrink: 0,
  },
  cardSlideSlotSingle: {
    borderRadius: 16,
    backgroundColor: bw.white,
    borderWidth: 1,
    borderColor: bw.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyCardPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: bw.surface,
  },
  emptyCardPlaceholderContent: {
    flex: 1,
    minHeight: 96,
  },
  bottomCardInner: { flexDirection: 'row', padding: 12, gap: 16 },
  cardImage: { width: 96, height: 96, borderRadius: 12, backgroundColor: bw.surface },
  cardImageBw: { opacity: 0.9 },
  cardContent: { flex: 1, justifyContent: 'space-between', minHeight: 96 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardName: { fontSize: 14, fontWeight: '700', color: bw.primary, flex: 1 },
  cardAddress: { fontSize: 11, color: bw.textSecondary, marginTop: 4 },
  cardRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  cardRatingText: { fontSize: 11, fontWeight: '700', color: bw.primary },
  cardReviews: { fontSize: 11, color: bw.textMuted },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  cardService: { fontSize: 12, fontWeight: '700', color: bw.primary },
  bookButton: {
    backgroundColor: bw.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: { fontSize: 10, fontWeight: '800', color: bw.white },
});
