-- Native PostgreSQL enums for role/status fields.
-- The overlap exclusion on appointments compares status to 'CANCELLED'; PostgreSQL rejects
-- converting status to enum while that predicate still uses text. Drop first, recreate after.

ALTER TABLE "appointments" DROP CONSTRAINT IF EXISTS "appointments_no_overlap_per_staff";

-- Idempotent enum creation (safe if migration is retried after a partial apply)
DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('client', 'providerOwner', 'providerStaff', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BusinessStatus" AS ENUM ('draft', 'pending', 'active', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "AppointmentStatus" AS ENUM ('BOOKED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "AppointmentSource" AS ENUM ('client', 'provider', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ReviewStatus" AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentProvider" AS ENUM ('OFFLINE', 'STRIPE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- users.role (udt_name casing varies by PG; compare case-insensitively)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role'
      AND lower(udt_name) <> lower('UserRole')
  ) THEN
    ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
    ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole" USING ("role"::"UserRole");
    ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'client'::"UserRole";
  END IF;
END $$;

-- users.status
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'status'
      AND lower(udt_name) <> lower('UserStatus')
  ) THEN
    ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "users" ALTER COLUMN "status" TYPE "UserStatus" USING ("status"::"UserStatus");
    ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'active'::"UserStatus";
  END IF;
END $$;

-- businesses.status
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'businesses' AND column_name = 'status'
      AND lower(udt_name) <> lower('BusinessStatus')
  ) THEN
    ALTER TABLE "businesses" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "businesses" ALTER COLUMN "status" TYPE "BusinessStatus" USING ("status"::"BusinessStatus");
    ALTER TABLE "businesses" ALTER COLUMN "status" SET DEFAULT 'draft'::"BusinessStatus";
  END IF;
END $$;

-- appointments.status
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'appointments' AND column_name = 'status'
      AND lower(udt_name) <> lower('AppointmentStatus')
  ) THEN
    ALTER TABLE "appointments" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "appointments" ALTER COLUMN "status" TYPE "AppointmentStatus" USING ("status"::"AppointmentStatus");
    ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'BOOKED'::"AppointmentStatus";
  END IF;
END $$;

-- appointments.source
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'appointments' AND column_name = 'source'
      AND lower(udt_name) <> lower('AppointmentSource')
  ) THEN
    ALTER TABLE "appointments" ALTER COLUMN "source" DROP DEFAULT;
    ALTER TABLE "appointments" ALTER COLUMN "source" TYPE "AppointmentSource" USING ("source"::"AppointmentSource");
    ALTER TABLE "appointments" ALTER COLUMN "source" SET DEFAULT 'client'::"AppointmentSource";
  END IF;
END $$;

-- Restore overlap exclusion (enum-safe predicate; idempotent for retries)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'appointments_no_overlap_per_staff'
  ) THEN
    ALTER TABLE "appointments"
    ADD CONSTRAINT "appointments_no_overlap_per_staff"
    EXCLUDE USING gist (
      "business_id" WITH =,
      COALESCE("staff_id", '00000000-0000-0000-0000-000000000000') WITH =,
      tstzrange("start_at_utc", "end_at_utc") WITH &&
    )
    WHERE (status IS DISTINCT FROM 'CANCELLED'::"AppointmentStatus");
  END IF;
END $$;

-- reviews.status
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reviews' AND column_name = 'status'
      AND lower(udt_name) <> lower('ReviewStatus')
  ) THEN
    ALTER TABLE "reviews" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "reviews" ALTER COLUMN "status" TYPE "ReviewStatus" USING ("status"::"ReviewStatus");
    ALTER TABLE "reviews" ALTER COLUMN "status" SET DEFAULT 'pending'::"ReviewStatus";
  END IF;
END $$;

-- payments.provider / status
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'provider'
      AND lower(udt_name) <> lower('PaymentProvider')
  ) THEN
    ALTER TABLE "payments" ALTER COLUMN "provider" DROP DEFAULT;
    ALTER TABLE "payments" ALTER COLUMN "provider" TYPE "PaymentProvider" USING ("provider"::"PaymentProvider");
    ALTER TABLE "payments" ALTER COLUMN "provider" SET DEFAULT 'OFFLINE'::"PaymentProvider";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'status'
      AND lower(udt_name) <> lower('PaymentStatus')
  ) THEN
    ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "payments" ALTER COLUMN "status" TYPE "PaymentStatus" USING ("status"::"PaymentStatus");
    ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'pending'::"PaymentStatus";
  END IF;
END $$;

-- Text search (pg_trgm enabled in initial migration)
CREATE INDEX IF NOT EXISTS "idx_businesses_name_trgm" ON "businesses" USING gin ("name" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "idx_businesses_description_trgm" ON "businesses" USING gin ("description" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "idx_locations_city_trgm" ON "locations" USING gin ("city" gin_trgm_ops);

-- Keep Business.rating_avg / rating_count in sync with approved reviews
CREATE OR REPLACE FUNCTION sync_business_review_stats()
RETURNS TRIGGER AS $$
DECLARE
  bid TEXT;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    bid := OLD.business_id;
  ELSE
    bid := NEW.business_id;
  END IF;
  UPDATE businesses
  SET
    rating_avg = COALESCE(
      (SELECT AVG(rating)::double precision FROM reviews r WHERE r.business_id = bid AND r.status = 'approved'::"ReviewStatus"),
      0
    ),
    rating_count = COALESCE(
      (SELECT COUNT(*)::integer FROM reviews r WHERE r.business_id = bid AND r.status = 'approved'::"ReviewStatus"),
      0
    )
  WHERE id = bid;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reviews_sync_business_rating ON reviews;
CREATE TRIGGER reviews_sync_business_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE PROCEDURE sync_business_review_stats();

UPDATE businesses b
SET
  rating_avg = COALESCE(
    (SELECT AVG(r.rating)::double precision FROM reviews r WHERE r.business_id = b.id AND r.status = 'approved'::"ReviewStatus"),
    0
  ),
  rating_count = COALESCE(
    (SELECT COUNT(*)::integer FROM reviews r WHERE r.business_id = b.id AND r.status = 'approved'::"ReviewStatus"),
    0
  );
