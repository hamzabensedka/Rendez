/*
  Warnings:

  - The primary key for the `appointment_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `appointments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `availability_rules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `businesses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `rating_avg` on the `businesses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(3,2)` to `DoublePrecision`.
  - The primary key for the `locations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `lat` on the `locations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,8)` to `DoublePrecision`.
  - You are about to alter the column `lng` on the `locations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(11,8)` to `DoublePrecision`.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `payments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `promotions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `providers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `refunds` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `service_variants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `services` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `staff` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `time_offs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `buffer_before_min_snapshot` on table `appointment_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `buffer_after_min_snapshot` on table `appointment_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `appointment_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `appointment_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `appointments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `source` on table `appointments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `appointments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `appointments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `availability_rules` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `availability_rules` required. This step will fail if there are existing NULL values in that column.
  - Made the column `timezone` on table `businesses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `businesses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating_avg` on table `businesses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating_count` on table `businesses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `businesses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `businesses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `label` on table `locations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `locations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `locations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `locations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `channel` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `provider` on table `payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currency` on table `payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `promotions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `promotions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_owner` on table `providers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `providers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `providers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `refunds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `refunds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `refunds` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `buffer_before_min` on table `service_variants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `buffer_after_min` on table `service_variants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `capacity` on table `service_variants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `service_variants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `service_variants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `services` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `services` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `services` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `staff` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `staff` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `staff` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `time_offs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `time_offs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "appointment_items" DROP CONSTRAINT "appointment_items_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "appointment_items" DROP CONSTRAINT "appointment_items_service_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_business_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_client_user_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_location_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "availability_rules" DROP CONSTRAINT "availability_rules_business_id_fkey";

-- DropForeignKey
ALTER TABLE "availability_rules" DROP CONSTRAINT "availability_rules_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_business_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "promotions" DROP CONSTRAINT "promotions_business_id_fkey";

-- DropForeignKey
ALTER TABLE "providers" DROP CONSTRAINT "fk_providers_business";

-- DropForeignKey
ALTER TABLE "providers" DROP CONSTRAINT "providers_user_id_fkey";

-- DropForeignKey
ALTER TABLE "refunds" DROP CONSTRAINT "refunds_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_business_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_client_user_id_fkey";

-- DropForeignKey
ALTER TABLE "service_variants" DROP CONSTRAINT "service_variants_service_id_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_business_id_fkey";

-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_business_id_fkey";

-- DropForeignKey
ALTER TABLE "time_offs" DROP CONSTRAINT "time_offs_business_id_fkey";

-- DropForeignKey
ALTER TABLE "time_offs" DROP CONSTRAINT "time_offs_staff_id_fkey";

-- AlterTable
ALTER TABLE "appointment_items" DROP CONSTRAINT "appointment_items_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "appointment_id" SET DATA TYPE TEXT,
ALTER COLUMN "service_variant_id" SET DATA TYPE TEXT,
ALTER COLUMN "buffer_before_min_snapshot" SET NOT NULL,
ALTER COLUMN "buffer_after_min_snapshot" SET NOT NULL,
ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "appointment_items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "business_id" SET DATA TYPE TEXT,
ALTER COLUMN "location_id" SET DATA TYPE TEXT,
ALTER COLUMN "client_user_id" SET DATA TYPE TEXT,
ALTER COLUMN "staff_id" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DATA TYPE TEXT,
ALTER COLUMN "timezone_snapshot" SET DATA TYPE TEXT,
ALTER COLUMN "cancelled_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "source" SET NOT NULL,
ALTER COLUMN "source" SET DATA TYPE TEXT,
ALTER COLUMN "idempotency_key" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "appointments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "availability_rules" DROP CONSTRAINT "availability_rules_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "business_id" SET DATA TYPE TEXT,
ALTER COLUMN "staff_id" SET DATA TYPE TEXT,
ALTER COLUMN "start_time_local" SET DATA TYPE TEXT,
ALTER COLUMN "end_time_local" SET DATA TYPE TEXT,
ALTER COLUMN "effective_from" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "effective_to" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "availability_rules_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "businesses" DROP CONSTRAINT "businesses_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "slug" SET DATA TYPE TEXT,
ALTER COLUMN "category" SET DATA TYPE TEXT,
ALTER COLUMN "timezone" SET NOT NULL,
ALTER COLUMN "timezone" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DATA TYPE TEXT,
ALTER COLUMN "rating_avg" SET NOT NULL,
ALTER COLUMN "rating_avg" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "rating_count" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "businesses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "locations" DROP CONSTRAINT "locations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "business_id" SET DATA TYPE TEXT,
ALTER COLUMN "label" SET NOT NULL,
ALTER COLUMN "label" SET DATA TYPE TEXT,
ALTER COLUMN "address_1" SET DATA TYPE TEXT,
ALTER COLUMN "address_2" SET DATA TYPE TEXT,
ALTER COLUMN "postal_code" SET DATA TYPE TEXT,
ALTER COLUMN "city" SET DATA TYPE TEXT,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "country" SET DATA TYPE TEXT,
ALTER COLUMN "lat" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "lng" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "type" SET DATA TYPE TEXT,
ALTER COLUMN "channel" SET NOT NULL,
ALTER COLUMN "channel" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DATA TYPE TEXT,
ALTER COLUMN "sent_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "payments" DROP CONSTRAINT "payments_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "appointment_id" SET DATA TYPE TEXT,
ALTER COLUMN "provider" SET NOT NULL,
ALTER COLUMN "provider" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DATA TYPE TEXT,
ALTER COLUMN "currency" SET NOT NULL,
ALTER COLUMN "currency" SET DATA TYPE TEXT,
ALTER COLUMN "provider_ref" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "promotions" DROP CONSTRAINT "promotions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "business_id" SET DATA TYPE TEXT,
ALTER COLUMN "code" SET DATA TYPE TEXT,
ALTER COLUMN "type" SET DATA TYPE TEXT,
ALTER COLUMN "starts_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ends_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "promotions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "providers" DROP CONSTRAINT "providers_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "display_name" SET DATA TYPE TEXT,
ALTER COLUMN "business_id" SET DATA TYPE TEXT,
ALTER COLUMN "is_owner" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "providers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "refunds" DROP CONSTRAINT "refunds_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "payment_id" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DATA TYPE TEXT,
ALTER COLUMN "provider_ref" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "refunds_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "business_id" SET DATA TYPE TEXT,
ALTER COLUMN "appointment_id" SET DATA TYPE TEXT,
ALTER COLUMN "client_user_id" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "service_variants" DROP CONSTRAINT "service_variants_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "service_id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "buffer_before_min" SET NOT NULL,
ALTER COLUMN "buffer_after_min" SET NOT NULL,
ALTER COLUMN "capacity" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "service_variants_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "services" DROP CONSTRAINT "services_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "business_id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "category" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "services_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "staff" DROP CONSTRAINT "staff_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "business_id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "role_title" SET DATA TYPE TEXT,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "staff_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "time_offs" DROP CONSTRAINT "time_offs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "business_id" SET DATA TYPE TEXT,
ALTER COLUMN "staff_id" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "time_offs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "password_hash" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DATA TYPE TEXT,
ALTER COLUMN "last_login_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "providers" ADD CONSTRAINT "providers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "providers" ADD CONSTRAINT "providers_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_variants" ADD CONSTRAINT "service_variants_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_rules" ADD CONSTRAINT "availability_rules_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_rules" ADD CONSTRAINT "availability_rules_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_offs" ADD CONSTRAINT "time_offs_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_offs" ADD CONSTRAINT "time_offs_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_items" ADD CONSTRAINT "appointment_items_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_items" ADD CONSTRAINT "appointment_items_service_variant_id_fkey" FOREIGN KEY ("service_variant_id") REFERENCES "service_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "idx_appointment_items_appointment_id" RENAME TO "appointment_items_appointment_id_idx";

-- RenameIndex
ALTER INDEX "idx_appointments_business_id" RENAME TO "appointments_business_id_idx";

-- RenameIndex
ALTER INDEX "idx_appointments_client_user_id" RENAME TO "appointments_client_user_id_idx";

-- RenameIndex
ALTER INDEX "idx_appointments_dates" RENAME TO "appointments_start_at_utc_end_at_utc_idx";

-- RenameIndex
ALTER INDEX "idx_appointments_staff_id" RENAME TO "appointments_staff_id_idx";

-- RenameIndex
ALTER INDEX "idx_appointments_status" RENAME TO "appointments_status_idx";

-- RenameIndex
ALTER INDEX "idx_availability_rules_business_staff" RENAME TO "availability_rules_business_id_staff_id_idx";

-- RenameIndex
ALTER INDEX "idx_businesses_category" RENAME TO "businesses_category_idx";

-- RenameIndex
ALTER INDEX "idx_businesses_slug" RENAME TO "businesses_slug_idx";

-- RenameIndex
ALTER INDEX "idx_businesses_status" RENAME TO "businesses_status_idx";

-- RenameIndex
ALTER INDEX "idx_locations_business_id" RENAME TO "locations_business_id_idx";

-- RenameIndex
ALTER INDEX "idx_notifications_status" RENAME TO "notifications_status_idx";

-- RenameIndex
ALTER INDEX "idx_notifications_user_id" RENAME TO "notifications_user_id_idx";

-- RenameIndex
ALTER INDEX "idx_payments_appointment_id" RENAME TO "payments_appointment_id_idx";

-- RenameIndex
ALTER INDEX "idx_payments_status" RENAME TO "payments_status_idx";

-- RenameIndex
ALTER INDEX "idx_promotions_business_id" RENAME TO "promotions_business_id_idx";

-- RenameIndex
ALTER INDEX "idx_refunds_payment_id" RENAME TO "refunds_payment_id_idx";

-- RenameIndex
ALTER INDEX "idx_reviews_business_id" RENAME TO "reviews_business_id_idx";

-- RenameIndex
ALTER INDEX "idx_reviews_status" RENAME TO "reviews_status_idx";

-- RenameIndex
ALTER INDEX "idx_service_variants_service_id" RENAME TO "service_variants_service_id_idx";

-- RenameIndex
ALTER INDEX "idx_services_business_id" RENAME TO "services_business_id_idx";

-- RenameIndex
ALTER INDEX "idx_staff_business_id" RENAME TO "staff_business_id_idx";

-- RenameIndex
ALTER INDEX "idx_time_offs_business_staff" RENAME TO "time_offs_business_id_staff_id_idx";

-- RenameIndex
ALTER INDEX "idx_time_offs_dates" RENAME TO "time_offs_start_at_utc_end_at_utc_idx";
