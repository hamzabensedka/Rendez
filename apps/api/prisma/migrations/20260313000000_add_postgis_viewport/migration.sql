-- Optional: Enable PostGIS for spatial queries (viewport, distance, clustering).
-- Requires: PostGIS extension installed (e.g. apt install postgresql-16-postgis-3).
-- If PostGIS is not available, comment out the next line and the geom column/index below;
-- the viewport endpoint still works using lat/lng bounding box in Prisma.
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geometry column for spatial indexing (WGS 84).
-- Prisma does not manage this column; it is used only for raw viewport queries.
ALTER TABLE locations ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);

-- Populate geom from lat/lng for existing rows.
UPDATE locations
SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326)
WHERE lat IS NOT NULL AND lng IS NOT NULL AND geom IS NULL;

-- GIST index for fast bounding-box and spatial queries.
CREATE INDEX IF NOT EXISTS idx_locations_geom ON locations USING GIST (geom);

-- Composite index for fallback bbox queries on lat/lng (when PostGIS unavailable).
CREATE INDEX IF NOT EXISTS idx_locations_lat_lng ON locations (lat, lng) WHERE lat IS NOT NULL AND lng IS NOT NULL;
