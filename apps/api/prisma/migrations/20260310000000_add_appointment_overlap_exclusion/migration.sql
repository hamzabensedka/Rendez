-- Durable overlap protection: prevent concurrent double-booking per (business, staff).
-- Only non-cancelled appointments participate; cancelled slots are released.
-- Requires btree_gist for equality on scalar columns in the exclusion.

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "appointments"
ADD CONSTRAINT "appointments_no_overlap_per_staff"
EXCLUDE USING gist (
  "business_id" WITH =,
  COALESCE("staff_id", '00000000-0000-0000-0000-000000000000') WITH =,
  tstzrange("start_at_utc", "end_at_utc") WITH &&
)
WHERE (status IS DISTINCT FROM 'CANCELLED');
