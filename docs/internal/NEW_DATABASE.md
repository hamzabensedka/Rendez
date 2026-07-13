# New database setup

When you create a **new** Supabase project (or any new Postgres database), do the following.

## 1. Update `apps/api/.env`

Set `DATABASE_URL` to your **new** database connection string.

**Supabase:**
1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your **new** project.
2. Go to **Settings** → **Database**.
3. Under **Connection string**, choose **URI**.
4. Copy the URI. It looks like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   Or for **direct** connection (recommended for migrations):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your **Database password** (same page; reset if you don’t know it).
6. In `apps/api/.env` set:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxx.supabase.co:5432/postgres"
   ```
   Use your actual host and password. No spaces around `=`.

   **If your password contains `@` or `#`:** the URL uses `@` to separate password from host, so encode special characters in the password: `@` → `%40`, `#` → `%23`. Example: password `pass@word` → use `pass%40word` in the URL.

## 2. Run migrations and seed

From the **repo root** (or from `apps/api`):

```bash
cd apps/api
pnpm prisma generate
pnpm prisma migrate deploy
pnpm prisma:seed
```

- **prisma generate** – generates the Prisma client (skip if you get a file lock; close any running API first).
- **prisma migrate deploy** – creates all tables in the new database.
- **prisma:seed** – creates test users (admin, provider, client) and businesses (Salon Lumière + 3 coiffeur shops).

## 3. Verify

- Start the API: `pnpm start:dev` (or `npm run dev` from repo root).
- Open Swagger: http://localhost:3000/api
- Try `GET /v1/businesses` – you should see 4 businesses.

## If you get “Authentication failed” (P1000)

- The **password** in `DATABASE_URL` is wrong: reset it in Supabase **Settings → Database** and update `.env`.
- Or the **host** is for another project: make sure the host (e.g. `db.xxxxx.supabase.co`) matches the new project.
