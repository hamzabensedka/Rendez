# Appointment overlap exclusion – rollout notes

## What this migration does

- Enables the PostgreSQL extension `btree_gist` (if not already enabled).
- Adds an **exclusion constraint** on `appointments` so that no two **non-cancelled** appointments can overlap in time for the same `(business_id, staff_id)`. Appointments with `staff_id` NULL are treated as one logical “slot” per business (sentinel UUID used in the constraint).

## DB requirements

- PostgreSQL with `btree_gist` available (standard in most installs).
- No application code changes required beyond what’s in the same Phase 2 work (overlap check inside transaction + handling constraint errors).

## Applying

- Run: `npx prisma migrate deploy` (or `prisma migrate dev` in dev when DB is reachable).
- If the extension or constraint already exist (e.g. applied by hand), the migration may need to be marked as applied or the SQL adjusted to use `IF NOT EXISTS` / skip existing objects where your workflow allows.

## Rollback

To remove the constraint and optionally the extension:

```sql
ALTER TABLE "appointments" DROP CONSTRAINT IF EXISTS "appointments_no_overlap_per_staff";
-- Optional: DROP EXTENSION btree_gist;  -- only if no other objects use it
```
