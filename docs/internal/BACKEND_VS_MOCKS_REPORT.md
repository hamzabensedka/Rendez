# Backend vs Mocks / Fallbacks – Full Report

This document lists what in the **Planity mobile app** is wired to the **backend API** and what uses **mocks, fallbacks, or local-only data**. The API base URL is `EXPO_PUBLIC_API_URL` (default `http://localhost:3000/v1`).

---

## Frontend parts using mocks/fallbacks (not using API)

| Frontend part | Location | What it uses instead of API | Notes |
|---------------|----------|-----------------------------|--------|
| **Address search** | `search/services/addressService.ts`, `AddressScreen` | `MOCK_ADDRESSES` (hardcoded list) | No geocoding or backend search; 100 ms fake delay. |
| **Suggested locations** | `AddressScreen`, `search/constants` | `DEFAULT_LOCATION_SUGGESTIONS` (fixed list) | Shown when search is empty; not from API. |
| **“Around me” / current location** | `addressService.getCurrentLocation()` | Stub: always returns `null` | No expo-location; not implemented. |
| **Search flow – salon detail** | `search/pages/SalonDetailsScreen.tsx` | `MOCK_SALONS` (constants) | Finds salon by id in mock list; no `GET /businesses`. |
| **Search flow – booking** | `search/pages/BookingScreen.tsx` | `MOCK_SALONS`, `MOCK_DATES`, `MOCK_STAFF` | No availability or appointments API. |
| **Search flow – booking validation** | `search/pages/BookingValidationScreen.tsx` | `MOCK_SALONS`, `MOCK_STAFF`; fake user on “login” | No auth API; sets `login({ id: 'mock-user', ... })`. |
| **Reviews on salon** | `search/components/SalonReviews.tsx` | `MOCK_REVIEWS` (in-file) | No reviews API. |
| **Slots on search result cards** | `SearchResultsScreen` → `RendezSalonCard` | `DEFAULT_BOOKING_SLOTS` (same for every card) | Cosmetic only; not from availability API. |
| **Favorites list storage** | `application/providers/favorites/FavoritesContext.tsx` | SecureStore only | Favorite IDs are device-only; no GET/POST favorites API. |
| **Share business URL** | `BusinessDetailScreen` → Share | Hardcoded `https://rendez.app/business/:id` | Not from API or config. |
| **Auth bypass (dev)** | `AuthContext.tsx` | Fake user when `EXPO_PUBLIC_BYPASS_AUTH=true` | No login/register/me calls in that mode. |
| **Search results – Toulouse fallback** | `SearchResultsScreen.tsx` | `TOULOUSE_SALONS_FALLBACK` | Used when API fails or returns empty and city is Toulouse. |
| **Business detail – Toulouse fallback** | `BusinessDetailScreen.tsx` | `TOULOUSE_SALONS_DETAIL_FALLBACK[id]` | Used when `GET /businesses/:id` fails and id is a known slug. |

**Summary:** Anything in the **search** flow (SalonDetails → Booking → BookingValidation), **address/location**, **reviews**, **favorites storage**, and **card “slots”** does not use the API (or uses it only as fallback for Toulouse). The **main booking flow** (`features/booking`) and **appointments** are fully API-backed.

---

## 1. Backend API Endpoints (Available)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh access token (used by axios interceptor) |
| GET | `/auth/me` | Current user (after login) |
| GET | `/businesses` | List businesses (query, city, pagination) |
| GET | `/businesses/:id` or `:slug` | Single business detail |
| GET | `/businesses/:businessId/availability` | Available slots (date, serviceVariantId) |
| POST | `/appointments` | Create appointment |
| GET | `/appointments/me` | My appointments (e.g. upcoming) |
| GET | `/appointments/:id` | Single appointment detail |

---

## 2. What Is Linked to the Backend

### 2.1 Authentication (fully backend)

| Feature | API / behavior |
|---------|-----------------|
| **Login** | `POST /auth/login` via `shared/lib/auth.ts` → tokens stored in SecureStore |
| **Register** | `POST /auth/register` via `shared/lib/auth.ts` → tokens stored |
| **Current user** | `GET /auth/me` on app load (AuthContext) |
| **Logout** | Local only: clears tokens; no dedicated logout endpoint called |
| **Token refresh** | `POST /auth/refresh` in `shared/lib/api.ts` interceptor on 401 |

**Exception:** In development, if `EXPO_PUBLIC_BYPASS_AUTH=true`, the app skips the API and sets a fake user (`dev-user`, `dev@rendez.local`) — **no backend auth calls** in that mode.

---

### 2.2 Businesses (backend with fallbacks)

| Screen / flow | API | Fallback / mock |
|----------------|-----|------------------|
| **Search results** (`SearchResultsScreen`) | `GET /businesses?query=&city=` | If API fails or returns empty **and** city is "Toulouse": uses `TOULOUSE_SALONS_FALLBACK` (hardcoded list of 3 salons). Otherwise shows empty. |
| **Business detail** (`BusinessDetailScreen`) | `GET /businesses/:id` or `/:slug` | If API fails: uses `TOULOUSE_SALONS_DETAIL_FALLBACK[id]` when `id` is a known Toulouse slug. Otherwise shows nothing. |
| **Booking flow – business + services** | `GET /businesses/:id` in `useBookingData` | None. On failure, business/service variant are null; UI shows loading/empty. |
| **Favorites – business names** | `GET /businesses/:id` for each favorite id | On failure, list is cleared (empty state). |

---

### 2.3 Availability (backend, no mock slots)

| Feature | API | Fallback |
|---------|-----|----------|
| **Date/time slots** (`useBookingData` → `BookingSlotsGrid`) | `GET /businesses/:businessId/availability?serviceVariantId=&date=` | **None.** On error or empty response: `slots = []`, `slotsError = true`; UI shows “Unable to load times” + Retry. No fake slots. |

---

### 2.4 Appointments (fully backend)

| Feature | API |
|---------|-----|
| **Create appointment** | `POST /appointments` (booking flow, `useBookingSubmit`) |
| **My bookings list** | `GET /appointments/me?upcoming=true` (`BookingsScreen`) |
| **Appointment detail** | `GET /appointments/:id` (`AppointmentDetailScreen`) |

No mocks: all appointment data comes from the API.

---

### 2.5 Favorites (hybrid: API for names, local storage for list)

| Aspect | Backend | Local / mock |
|--------|---------|--------------|
| **List of favorite IDs** | No API | Stored in **SecureStore** (`FavoritesContext`). No account sync. |
| **Business names for list** | `GET /businesses/:id` for each ID to resolve name | On API failure, list shows empty. |

So: “what is favorited” is **device-only**; “names of those businesses” are **from the backend** when the list is displayed.

---

## 3. What Is NOT Linked to the Backend (mocks / stubs / local only)

### 3.1 Address / location (fully mock)

| Feature | Implementation | Backend? |
|---------|----------------|----------|
| **Address search** (`addressService.searchAddresses`) | Filters **`MOCK_ADDRESSES`** (hardcoded list, e.g. Toulouse, Paris, London, generic strings). 100 ms simulated delay. | No. No geocoding or backend search. |
| **“Suggested locations”** (e.g. AddressScreen when search empty) | **`DEFAULT_LOCATION_SUGGESTIONS`** (fixed list: Toulouse, Paris, London, New York). | No. |
| **“Around me” / current location** (`addressService.getCurrentLocation`) | **Stub:** always returns `null`. Comment says to implement with expo-location later. | No. |

**Files:** `search/services/addressService.ts`, `search/constants/index.ts` (`MOCK_ADDRESSES`, `DEFAULT_LOCATION_SUGGESTIONS`).

---

### 3.2 Search feature – alternate booking flow (fully mock)

These screens live under **search** (not the main **booking** feature) and do **not** call the appointments API:

| Screen | Data source | Backend? |
|--------|-------------|----------|
| **SalonDetailsScreen** (search) | **`MOCK_SALONS`** (constants) – finds salon by id | No. |
| **BookingValidationScreen** (search) | **`MOCK_SALONS`** + **`MOCK_STAFF`** (in-file). “Login” sets a fake user object (`id: 'mock-user'`) in auth context; no API. | No. |
| **BookingScreen** (search) | **`MOCK_SALONS`**, **`MOCK_DATES`**, **`MOCK_STAFF`** – no availability or appointment API. | No. |

So: the **search** flow that goes SalonDetails → Booking → BookingValidation is a **separate, mock-only** flow. The **real** booking flow is under `features/booking` (business + availability + POST /appointments).

---

### 3.3 Reviews (mock)

| Component | Data | Backend? |
|-----------|------|----------|
| **SalonReviews** | **`MOCK_REVIEWS`** in `SalonReviews.tsx` – hardcoded review list. | No. There is no GET /reviews or similar in this report. |

---

### 3.4 Search results – card display (partial mock)

| Item | Source | Backend? |
|------|--------|----------|
| Business list (ids, names, locations, etc.) | API or Toulouse fallback (see §2.2). | Yes (or fallback). |
| **Slots on salon cards** | **`DEFAULT_BOOKING_SLOTS`** – same static labels for every card (e.g. “Today 10:00”, “Tomorrow 14:00”). Not from availability API. | No. Purely cosmetic. |

---

### 3.5 Other local-only or dev-only behavior

| Item | Behavior | Backend? |
|------|----------|----------|
| **Share business** | `Share.share` with URL `https://rendez.app/business/:id` – fixed domain; not from API. | No. |
| **Auth bypass** | When `EXPO_PUBLIC_BYPASS_AUTH=true` (dev): no login/register/me calls; fake user in context. | No. |

---

## 4. Summary Tables

### By feature area

| Area | Backend | Mocks / fallbacks |
|------|---------|-------------------|
| **Auth** | Login, register, me, refresh | Dev bypass (fake user); logout is local-only. |
| **Business list** | GET /businesses | Toulouse fallback list when API fails or empty + city Toulouse. |
| **Business detail** | GET /businesses/:id | Toulouse detail fallback when API fails and id is known slug. |
| **Availability** | GET .../availability | None (error + retry only). |
| **Appointments** | POST /appointments, GET /appointments/me, GET /appointments/:id | None. |
| **Favorites** | GET /businesses/:id for names | Favorite IDs stored in SecureStore only; no backend sync. |
| **Address / location** | — | Mock addresses, default suggestions, stubbed “current location”. |
| **Search booking flow** (SalonDetails → Booking → BookingValidation) | — | MOCK_SALONS, MOCK_STAFF, MOCK_DATES; mock “login” user. |
| **Reviews** | — | MOCK_REVIEWS. |
| **Salon card “slots”** (search results) | — | DEFAULT_BOOKING_SLOTS (cosmetic). |

### By file (mobile app)

| File / module | Linked to backend? | Notes |
|---------------|--------------------|-------|
| `shared/lib/auth.ts` | Yes | login, register, getCurrentUser call API. |
| `shared/lib/api.ts` | Yes | Axios instance + refresh; all API calls go through it. |
| `application/providers/auth/AuthContext.tsx` | Yes (or bypass) | checkAuth → GET /auth/me unless bypass. |
| `application/providers/favorites/FavoritesContext.tsx` | No (storage only) | Favorites list in SecureStore only. |
| `features/booking/*` | Yes | Businesses, availability, POST /appointments. |
| `features/bookings/*` | Yes | GET /appointments/me, GET /appointments/:id. |
| `features/business/BusinessDetailScreen` | Yes + fallback | GET /businesses/:id; Toulouse detail fallback on error. |
| `features/explore/ExploreScreen` | No | Only navigation; no API. |
| `features/favorites/FavoritesScreen` | Yes (for names) | GET /businesses/:id per favorite; list from context (local). |
| `features/search/services/addressService` | No | MOCK_ADDRESSES; getCurrentLocation stub. |
| `features/search/constants` | — | MOCK_*, TOULOUSE_* fallbacks, DEFAULT_* for UI. |
| `features/search/pages/SearchResultsScreen` | Yes + fallback | GET /businesses; Toulouse list fallback. |
| `features/search/pages/SalonDetailsScreen` | No | MOCK_SALONS. |
| `features/search/pages/BookingScreen` (search) | No | MOCK_SALONS, MOCK_DATES, MOCK_STAFF. |
| `features/search/pages/BookingValidationScreen` | No | MOCK_SALONS, MOCK_STAFF; mock user on “login”. |
| `features/search/components/SalonReviews` | No | MOCK_REVIEWS. |

---

## 5. Recommendations (short)

1. **Address:** Replace `MOCK_ADDRESSES` and stub `getCurrentLocation` with a real geocoding/places API or backend search when “search by location” is required.
2. **Search booking flow:** Either remove the mock SalonDetails → Booking → BookingValidation flow or replace it with the real booking flow (businesses + availability + POST /appointments).
3. **Reviews:** Add a reviews API and replace `MOCK_REVIEWS` if reviews are a product requirement.
4. **Favorites:** If favorites must sync across devices, add a backend (e.g. GET/POST /users/me/favorites) and keep SecureStore only as cache or offline fallback.
5. **Share URL:** If the share link should be dynamic, serve it from the API or config.

This report reflects the codebase as of the last scan; paths and constants are from the Planity mobile and API apps.
