/**
 * Map search results — MapLibre + OSM raster tiles, viewport-driven API.
 * - Map: MapLibre with OSM tiles; markers from GET /businesses/viewport (north/south/east/west).
 * - Queries only on map movement end, zoom change, or "Search in this zone".
 * - Geocoding: backend proxy (Nominatim). Locate me: center on user location.
 */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
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
import { providerTheme as T } from '../../../application/theme/providerTheme';
import { OSM_RASTER_STYLE } from '../constants/mapStyle';
import { fetchViewportBusinesses } from '../services/viewportService';
import { useBusinessesSearchQuery } from '../../../application/query/hooks';
import {
  type MapBusiness,
  getDisplayPrice,
  getCardImageUri,
  businessToFeature,
  businessesToGeoJSON,
} from '../map/mapSearchGeo';
import { MapSearchBottomCard } from '../components/MapSearchBottomCard';
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
  primary: T.colors.ink,
  background: T.colors.paper,
  surface: T.colors.surface,
  border: T.colors.rule,
  text: T.colors.ink,
  textSecondary: T.colors.muted,
  textMuted: T.colors.muted,
  mapBg: T.colors.past,
  white: T.colors.surface,
};

/** Default Paris center when location unavailable */
const DEFAULT_CENTER: [number, number] = [2.3522, 48.8566];
const DEFAULT_ZOOM = 14;
const VIEWPORT_DEBOUNCE_MS = 400;
const LOADING_TIMEOUT_MS = 12000;
/** Delta for fallback bounds when getVisibleBounds fails (approx ~5km) */
const FALLBACK_DELTA = 0.05;

interface MapSearchScreenProps {
  /** When true, hide the top header (back/logo/profile) for embedding inside SearchResultsScreen */
  embedded?: boolean;
  /** Pre-loaded businesses from list view so markers show immediately (e.g. when switching to map tab) */
  initialBusinesses?: ApiBusinessListItem[];
}

export default function MapSearchScreen({ embedded, initialBusinesses }: MapSearchScreenProps) {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{
    address?: string;
    city?: string;
    categories?: string;
    nearMe?: string;
    availDate?: string;
  }>();

  const addressParam = searchParams.address?.trim() ?? '';
  const cityParam = searchParams.city?.trim() ?? '';
  const categoriesParam = searchParams.categories?.trim() ?? '';
  const nearMe = searchParams.nearMe === '1';
  const availDateParam = searchParams.availDate?.trim() ?? '';

  const categorySlugs = useMemo(
    () =>
      categoriesParam
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    [categoriesParam]
  );
  const categoriesCsv = categorySlugs.join(',');

  const [nearCoords, setNearCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!nearMe) {
      setNearCoords(null);
      return;
    }
    let cancelled = false;
    getCurrentLocation().then((c) => {
      if (!cancelled && c) setNearCoords(c);
    });
    return () => {
      cancelled = true;
    };
  }, [nearMe]);

  const apiCity = useMemo(() => {
    if (nearMe) return undefined;
    if (cityParam) return cityParam;
    if (addressParam.includes(',')) return addressParam.split(',')[0]?.trim() || undefined;
    return undefined;
  }, [nearMe, cityParam, addressParam]);

  const apiQuery = useMemo(() => {
    if (nearMe || apiCity) return undefined;
    if (addressParam) return addressParam;
    return undefined;
  }, [nearMe, apiCity, addressParam]);

  const searchEnabled = !nearMe || nearCoords != null;

  const [businesses, setBusinesses] = useState<MapBusiness[]>(() =>
    Array.isArray(initialBusinesses) && initialBusinesses.length > 0
      ? initialBusinesses.map((b) => ({ ...b }))
      : []
  );
  const [selectedBusiness, setSelectedBusiness] = useState<MapBusiness | null>(null);
  const [previousBusiness, setPreviousBusiness] = useState<MapBusiness | null>(null);
  const [loading, setLoading] = useState(false);
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

  const hasNativeMap = Boolean(
    MapView && Camera && ShapeSource && (SymbolLayer || CircleLayer) && Images
  );

  const searchListQuery = useBusinessesSearchQuery({
    query: apiQuery,
    city: apiCity,
    categories: categorySlugs.length ? categorySlugs : undefined,
    nearMeCoords: nearMe && nearCoords ? nearCoords : null,
    availDate: availDateParam || undefined,
    enabled: searchEnabled,
  });

  // Kick off location fetch immediately on mount — runs in parallel with map loading.
  useEffect(() => {
    pendingLocationRef.current = getCurrentLocation();
  }, []);

  const fetchViewport = useCallback(
    async (bounds: { north: number; south: number; east: number; west: number }, zoom?: number) => {
      const list = await fetchViewportBusinesses({
        ...bounds,
        zoom,
        query: apiQuery || undefined,
        categories: categoriesCsv || undefined,
        availDate: availDateParam || undefined,
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
    [apiQuery, categoriesCsv, availDateParam]
  );

  const onRegionDidChange = useCallback(
    (event?: any) => {
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
            bounds = (await mapRef.current?.getVisibleBounds?.()) ?? null;
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
    },
    [mapReady, fetchViewport]
  ); // initialCenterRef is a ref — no need in deps

  // When native map is ready, position the camera: center on salons when we have them, else user/Paris.
  useEffect(() => {
    if (!hasNativeMap || !mapReady) return;
    if (initialLocationFetched.current) return;
    initialLocationFetched.current = true;

    const run = async () => {
      if (userHasInteractedRef.current) return;

      const withLocation = Array.isArray(initialBusinesses)
        ? initialBusinesses.filter(
            (b) => b.locations?.[0]?.lat != null && b.locations?.[0]?.lng != null
          )
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
            bounds = (await mapRef.current?.getVisibleBounds?.()) ?? null;
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

  // When native map is not available (Expo Go), mirror list search via React Query.
  useEffect(() => {
    if (hasNativeMap) return;
    const list: ApiBusinessListItem[] = searchListQuery.data ?? [];
    setBusinesses(list.map((b: ApiBusinessListItem) => ({ ...b })));
    if (list.length > 0) {
      setSelectedBusiness((prev) => prev ?? (list[0] as MapBusiness));
    }
  }, [hasNativeMap, searchListQuery.data]);

  useEffect(() => {
    if (hasNativeMap) return;
    setLoading(searchListQuery.isPending);
  }, [hasNativeMap, searchListQuery.isPending]);

  useEffect(() => {
    if (businesses.length > 0 && !selectedBusiness) setSelectedBusiness(businesses[0]);
  }, [businesses, selectedBusiness]);

  // Stable callback — prevents MapView from re-attaching children on every render
  const handleMapReady = useCallback(() => setMapReady(true), []);

  const handleBack = useCallback(() => router.back(), [router]);

  const handleSearchInZone = useCallback(async () => {
    if (!MapView || !mapRef.current) return;
    setLoading(true);
    const timeoutId = setTimeout(() => setLoading(false), LOADING_TIMEOUT_MS);
    try {
      let bounds: { ne: [number, number]; sw: [number, number] } | null = null;
      try {
        bounds = (await mapRef.current.getVisibleBounds?.()) ?? null;
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
    if (selectedBusiness) router.push(`/(main)/business/${selectedBusiness.id}`);
  }, [selectedBusiness, router]);

  const handleCardPress = useCallback(() => {
    if (selectedBusiness) router.push(`/(main)/business/${selectedBusiness.id}`);
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
    (b: MapBusiness) => {
      const neighborhood = b.locations?.[0]
        ? [b.locations[0].city].filter(Boolean).join(', ') || '—'
        : '—';
      const next = availDateParam ? availDateParam : 'Today';
      const price = getDisplayPrice(b);
      return (
        <View style={styles.cardInner}>
          <Image
            source={{ uri: getCardImageUri(b.id) }}
            style={styles.cardImage}
            accessibilityIgnoresInvertColors
          />
          <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Text style={styles.cardName} numberOfLines={1}>
              {b.name}
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedBusiness(null)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={20} color={bw.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.cardAddress} numberOfLines={1}>
            {neighborhood}
          </Text>
          <Text style={styles.nextLabel}>Next Available</Text>
          <Text style={styles.nextTime}>
            {next}
            {price !== '—' ? `  ${price}` : ''}
          </Text>
          {b.category ? (
            <View style={styles.staffRow}>
              <View style={styles.staffChip}>
                <Text style={styles.staffChipText}>{b.category}</Text>
              </View>
            </View>
          ) : null}
          <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
            <Text style={styles.bookButtonText}>View</Text>
          </TouchableOpacity>
          </View>
        </View>
      );
    },
    [handleBook, availDateParam]
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
            <TouchableOpacity
              onPress={handleBack}
              style={styles.iconButton}
              accessibilityLabel="Back"
            >
              <Ionicons name="arrow-back" size={24} color={bw.primary} />
            </TouchableOpacity>
            <Text style={styles.logo}>ATELIER</Text>
            <View style={styles.iconButton} />
          </View>
        )}

        <View style={styles.mapContainer}>
          {hasNativeMap &&
          MapViewComponent &&
          CameraComponent &&
          ShapeSourceComponent &&
          (SymbolLayerComponent || CircleLayerComponent) &&
          ImagesComponent ? (
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
              {UserLocationComponent && <UserLocationComponent visible={true} animated={true} />}
              {ImagesComponent && (
                <ImagesComponent
                  images={{
                    salonPin: usePinIcon ? { source: SALON_PIN_IMAGE } : undefined,
                  }}
                />
              )}
              <ShapeSourceComponent
                id="businesses"
                key={`businesses-${businesses.length}-${businesses
                  .map((b) => b.id)
                  .slice(0, 3)
                  .join('-')}`}
                shape={businessesToGeoJSON(businesses)}
                onPress={handleMarkerPress}
              >
                {usePinIcon && SymbolLayerComponent ? (
                  <>
                    {CircleLayerComponent ? (
                      <CircleLayerComponent
                        id="business-markers-badge"
                        sourceID="businesses"
                        style={{
                          circleRadius: [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            10,
                            5.5,
                            14,
                            8.5,
                            18,
                            12,
                          ],
                          circleColor: bw.white,
                          circleStrokeWidth: 1,
                          circleStrokeColor: bw.primary,
                          circlePitchScale: 'map',
                        }}
                      />
                    ) : null}
                    <SymbolLayerComponent
                      id="business-markers"
                      sourceID="businesses"
                      style={{
                        iconImage: 'salonPin',
                        iconSize: [
                          'interpolate',
                          ['linear'],
                          ['zoom'],
                          10,
                          0.013,
                          14,
                          0.024,
                          18,
                          0.036,
                        ],
                        iconAllowOverlap: true,
                        iconIgnorePlacement: true,
                        iconAnchor: 'center',
                      }}
                    />
                  </>
                ) : CircleLayerComponent ? (
                  <CircleLayerComponent
                    id="business-markers"
                    sourceID="businesses"
                    style={{
                      circleRadius: ['interpolate', ['linear'], ['zoom'], 10, 4, 14, 7, 18, 10],
                      circleColor: bw.white,
                      circleStrokeWidth: 1,
                      circleStrokeColor: bw.primary,
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
                  Map is available in a native build (MapLibre + OSM)
                </Text>
                <Text style={styles.mapPlaceholderSub}>Expo Go does not show the map.</Text>
              </View>
            </View>
          )}

          {loading && (
            <View style={styles.mapLoading} pointerEvents="none">
              <ActivityIndicator size="small" color={bw.primary} />
            </View>
          )}

          <TouchableOpacity style={styles.fabSearchZone} onPress={handleSearchInZone}>
            <Text style={styles.fabSearchZoneText}>Search this area</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.fabLocate} onPress={handleLocateMe}>
            <Ionicons name="locate" size={24} color={bw.primary} />
          </TouchableOpacity>
        </View>

        {selectedBusiness && (
          <MapSearchBottomCard
            cardWidth={cardWidth}
            stripAnimatedStyle={stripAnimatedStyle}
            selectedBusiness={selectedBusiness}
            previousBusiness={previousBusiness}
            onCardPress={handleCardPress}
            renderCard={renderCardInner}
          />
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
  logo: {
    fontFamily: T.font.label,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    color: bw.primary,
  },
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
    alignSelf: 'center',
    left: 24,
    right: 24,
    alignItems: 'center',
    backgroundColor: bw.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: T.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: bw.border,
  },
  fabSearchZoneText: {
    fontFamily: T.font.medium,
    fontSize: 13,
    color: bw.primary,
  },
  fabLocate: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: T.radius.card,
    backgroundColor: bw.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: bw.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInner: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  cardImage: { width: 88, height: 88, borderRadius: T.radius.card, backgroundColor: bw.surface },
  cardContent: { flex: 1 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardName: {
    fontFamily: T.font.display,
    fontSize: 22,
    color: bw.primary,
    flex: 1,
    marginRight: 12,
  },
  cardAddress: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: bw.textSecondary,
    marginTop: 4,
  },
  nextLabel: {
    fontFamily: T.font.label,
    fontSize: 11,
    letterSpacing: 1.4,
    color: bw.textMuted,
    marginTop: 16,
  },
  nextTime: {
    fontFamily: T.font.medium,
    fontSize: 16,
    color: bw.primary,
    marginTop: 4,
  },
  staffRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  staffChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: T.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: bw.border,
  },
  staffChipText: { fontFamily: T.font.medium, fontSize: 13, color: bw.primary },
  bookButton: {
    marginTop: 16,
    backgroundColor: bw.primary,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: T.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    fontFamily: T.font.medium,
    fontSize: 15,
    color: T.colors.bookedText,
  },
});
