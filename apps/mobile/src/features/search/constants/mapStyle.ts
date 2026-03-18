/**
 * MapLibre style for OSM raster base map.
 * Uses OpenStreetMap tiles; glyphs/sprite from MapLibre demo so text and symbols work (avoids "Unable to parse resourceUrl" on Android).
 * @see https://maplibre.org/maplibre-style-spec/
 */
export const OSM_RASTER_STYLE = {
  version: 8,
  name: 'planity-osm',
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sprite: 'https://demotiles.maplibre.org/styles/osm-bright-gl-style/sprite',
  sources: {
    'osm-raster': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'osm-raster-layer',
      type: 'raster',
      source: 'osm-raster',
      minzoom: 0,
      maxzoom: 22,
    },
  ],
} as const;
