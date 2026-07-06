# Planity Clone — Progress Report

**Report Date:** 2025-01-09  
**Report Author:** Avery — Progress Tracker  
**Scope:** Full codebase audit against product spec (docs/product.md)  

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Features (P0)** | 8 |
| **Fully Implemented** | 0 |
| **Partially Implemented** | 2 |
| **Not Implemented** | 6 |
| **Overall Completion** | **~15%** |

The Planity Clone codebase is in early-stage development. Core infrastructure (database schema, API scaffolding, basic auth) has initial work, but no P0 feature is production-complete. Critical gaps exist in authentication security, booking concurrency, payment integration, and real-time availability. The product is **not ready for release** and requires substantial engineering effort across all domains.

---

## 1. User Authentication (P0)

### Spec Requirements
- Email/password, Google OAuth, Apple Sign-In
- JWT access + refresh tokens, HTTP-only cookies
- Rate limiting (5 attempts/15 min)
- Email verification, password reset (1-hour expiry)
- 30-day session persistence, 5 concurrent session limit
- Account lockout after 5 failed attempts

### Codebase Assessment

**Files Found:**
- `src/auth/` — Contains `AuthProvider.tsx`, `useAuth.ts`, `authService.ts`
- `src/server/auth/` — Passport.js setup, JWT utilities
- `src/server/routes/auth.ts` — Registration, login, logout endpoints

**Implemented:**
- Basic email/password registration and login (local strategy)
- JWT access token generation (expires in 15 min)
- Password hashing with bcrypt (salt rounds: 10)
- `AuthProvider` React context for client-side auth state

**Gaps Identified:**
| Requirement | Status | Evidence |
|-------------|--------|----------|
| Google OAuth | ❌ Not started | No Passport Google strategy; no OAuth callback route |
| Apple Sign-In | ❌ Not started | No Apple strategy or client configuration |
| Refresh tokens | ⚠️ Partial | `refreshToken` field exists in schema but rotation logic missing; no `/auth/refresh` endpoint implemented |
| HTTP-only cookies | ❌ Missing | Tokens sent in JSON response body; client stores in `localStorage` |
| Rate limiting | ❌ Missing | No `express-rate-limit` or Redis-backed rate store |
| Email verification | ⚠️ Stubbed | `emailVerified` boolean in schema; no SendGrid/Resend integration; no verification email sent |
| Password reset | ❌ Missing | No `/auth/forgot-password` or `/auth/reset-password` endpoints |
| Session limit (5) | ❌ Missing | No session tracking table or eviction logic |
| Account lockout | ❌ Missing | No `failedLoginAttempts` or `lockedUntil` fields |
| Password complexity | ⚠️ Partial | Regex exists (`/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/`) but not enforced server-side on registration |

**Critical Risk:** Token storage in `localStorage` exposes to XSS. HTTP-only cookies are a security baseline for P0.

**Completion: ~25%**

---

## 2. Guest Browse & Explore (P0)

### Spec Requirements
- Unauthenticated access to browse, search, filters, business profiles, reviews (read-only)
- Login prompt at booking initiation with pre-fill preservation
- Guest search history in `localStorage`; merge on login
- Trending/popular shown instead of personalized recommendations

### Codebase Assessment

**Files Found:**
- `src/pages/index.tsx` — Homepage with business listing
- `src/components/BusinessCard.tsx` — Business preview card
- `src/hooks/useBusinesses.ts` — SWR-based data fetching

**Implemented:**
- Unauthenticated users can view `/` and `/business/[id]` routes
- `BusinessCard` renders name, rating, image, price range
- Route guards absent: no redirect to login for browsing

**Gaps Identified:**
| Requirement | Status | Evidence |
|-------------|--------|----------|
| Search without login | ⚠️ Partial | Search bar UI exists but no search endpoint wired; `useBusinesses` fetches all |
| Filters | ❌ Missing | No filter UI or query parameter handling |
| Reviews read-only | ⚠️ Partial | `ReviewSection` component exists but hardcoded to empty array; no review API |
| Pre-fill preservation | ❌ Missing | No `?redirect=` or booking state in URL for post-auth recovery |
| Guest search history | ❌ Missing | No `localStorage` usage for search history found |
| Merge on login | ❌ Missing | No merge logic in `useAuth` or auth service |
| Trending/popular | ❌ Missing | Static placeholder data; no trending algorithm or view count |

**Completion: ~20%**

---

## 3. Business Search & Discovery (P0)

### Spec Requirements
- Full-text search + trigram similarity (PostgreSQL)
- <500ms response for queries <50 chars
- Empty state with popular searches and nearby suggestions
- Typo tolerance (trigram > 0.3)
- Recent searches (last 10), deletable
- Suggestions after 2 chars, 200ms debounce

### Codebase Assessment

**Files Found:**
- `src/server/routes/businesses.ts` — `GET /api/businesses` (pagination only)
- `src/components/SearchBar.tsx` — Input with basic debounce (500ms)
- `prisma/schema.prisma` — No `@@index` or `tsvector` fields for search

**Implemented:**
- Basic `GET /api/businesses?page=&limit=` endpoint
- `SearchBar` with `useDebounce` hook (incorrect timing: 500ms vs spec 200ms)

**Gaps Identified:**
| Requirement | Status | Evidence |
|-------------|--------|----------|
| Full-text search | ❌ Missing | No `to_tsvector` or `ts_rank` in queries |
| Trigram similarity | ❌ Missing | No `pg_trgm` extension; no `%` similarity operator |
| Performance <500ms | ❌ Not measurable | No search implementation to benchmark |
| Empty state | ❌ Missing | `SearchBar` has no empty result handling |
| Typo tolerance | ❌ Missing | Requires trigram implementation |
| Recent searches | ❌ Missing | No `localStorage` key for recent searches |
| Suggestions | ❌ Missing | No `/api/search/suggestions` endpoint |
| Debounce 200ms | ❌ Incorrect | 500ms in `useDebounce.ts` |

**Completion: ~5%**

---

## 4. Map-based Search (P0)

### Spec Requirements
- Mapbox GL JS integration
- Clustering at zoom < 12, individual pins at zoom >= 12
- Bounds-based fetching, user geolocation
- <300ms pin update on map movement (300ms debounce)
- Bottom sheet on pin click
- List view toggle, synced with map bounds
- Geolocation error handling

### Codebase Assessment

**Files Found:**
- `src/components/MapView.tsx` — Stub component with `react-map-gl` import
- `package.json` — `mapbox-gl` and `react-map-gl` listed as dependencies

**Implemented:**
- Dependencies installed
- `MapView` renders empty `<div>` with placeholder text "Map coming soon"

**Gaps Identified:**
| Requirement | Status | Evidence |
|-------------|--------|----------|
| Mapbox initialization | ❌ Missing | No token provider, no `Map` component usage |
| Clustering | ❌ Missing | No `cluster` prop or `supercluster` integration |
| Bounds fetching | ❌ Missing | No `bounds` parameter in business API |
| Pin update debounce | ❌ Missing | No map event handlers |
| Bottom sheet | ❌ Missing | No sheet component in codebase |
| List view toggle | ❌ Missing | No toggle UI or state |
| Geolocation | ❌ Missing | No `navigator.geolocation` usage |

**Completion: ~2%**

---

## 5. Business Detail View (P0)

### Spec Requirements
- Hero images (up to 10), gallery with pinch-zoom, swipe
- Core content <1.5s; lazy-loaded images with blur placeholder
- Sticky "Book" CTA (mobile), prominent on desktop
- Business hours in user timezone; closed days marked
- Native phone/email handlers
- Share with deep link and preview image
- Offline: cached data viewable, booking CTA disabled

### Codebase Assessment

**Files Found:**
- `src/pages/business/[id].tsx` — Business detail page
- `src/components/BusinessGallery.tsx` — Image grid with `next/image`
- `src/components/StickyCTA.tsx` — Sticky button component

**Implemented:**
- Business detail page with SSR (`getServerSideProps`)
- Image grid with `next/image` (lazy loading by default)
- Sticky CTA on mobile (CSS `position: sticky`)
- Basic business info: name, address, phone, description

**Gaps Identified:**
| Requirement | Status | Evidence |
|-------------|--------|----------|
| Up to 10 images | ⚠️ Partial | Schema allows 10; UI shows max 6 in grid |
| Pinch-zoom gallery | ❌ Missing | No `react-use-gesture` or `framer-motion` for zoom |
| Swipe navigation | ❌ Missing | No carousel or swipe handlers |
| Blur placeholder | ❌ Missing | `next/image` used but no `blurDataURL` provided |
| Core content <1.5s | ⚠️ Unverified | No Lighthouse or performance testing evidence |
| Business hours timezone | ❌ Missing | Hours stored as strings; no `date-fns-tz` conversion |
| Closed days marked | ❌ Missing | No visual distinction for closed days |
| Native handlers | ⚠️ Partial | `tel:` and `mailto:` present but not tested across devices |
| Share deep link | ❌ Missing | No `Web Share API` or custom share modal |
| Offline caching | ❌ Missing | No Service Worker or `workbox` configuration |

**Completion: ~30%**

---

## 6. Service Categories (P0)

### Spec Requirements
- Hierarchy: Category → Subcategory → Service
- Horizontal scroll on homepage; expandable on search
- Multi-select OR filtering
- Category badges on cards and detail pages
- Sort by: popularity, price, duration, name
- Price display: "From €X" or exact

### Codebase Assessment

**Files Found:**
- `prisma/schema.prisma` — `Category`, `Service` models (flat, no hierarchy)
- `src/components/CategoryScroll.tsx` — Horizontal list with mock data
- `src/pages/business/[id].tsx` — Services list (flat array)

**Implemented:**
- `Category` and `Service` tables with basic fields
- `CategoryScroll` renders horizontally on homepage

**Gaps Identified:**
| Requirement | Status | Evidence |
|-------------|--------|----------|
| 3-level hierarchy | ❌ Missing | No `parentId` or `subcategory` model; flat categories only |
| Expandable on search | ❌ Missing | No expansion UI |
| Multi-select filtering | ❌ Missing | No filter state or query parameter handling |
| Category badges | ⚠️ Partial | Badge component exists but not rendered on `BusinessCard` |
| Sort options | ❌ Missing | No sort UI or API `orderBy` parameter |
| Variable pricing | ❌ Missing | `Service.price` is single number; no `ServiceProviderPrice` table |
| "From €X" display | ❌ Missing | Price rendered directly without min/max logic |

**Completion: ~15%**

---

## 7. Booking Flow (P0)

### Spec Requirements
- Steps: service → provider → date/time → confirm → payment → confirmation
- Respect business hours, provider schedules, buffers, existing bookings
- 15-min time slot increments
- 10-minute hold during checkout; release on timeout/navigation
- Double-booking prevention
- Immediate confirmation (free) or pending (paid)
- Calendar invite (.ics), add-to-calendar buttons
- Modification up to configurable cutoff (default 24h)

### Codebase Assessment

**Files Found:**
- `src/components/BookingWizard.tsx` — Multi-step form shell (3 steps: service, datetime, confirm)
- `src/server/routes/bookings.ts` — `POST /api/bookings` (basic create)
- `prisma/schema.prisma` — `Booking`, `Availability` models

**Implemented:**
- Wizard UI with `react-hook-form` and step navigation
- Basic booking creation (saves `serviceId`, `businessId`, `startTime`)
- `Availability` table with day-of-week and start/end times

**Gaps Identified:**
| Requirement | Status | Evidence |
|-------------|--------|----------|
| Provider selection | ❌ Missing | No `providerId` in wizard step; "Any available" hardcoded |
| Real-time availability | ❌ Missing | No slot generation from `Availability` + existing bookings |
| 15-min increments | ❌ Missing | No slot generation logic |
| 10-minute hold | ❌ Missing | No `BookingHold` table or Redis lock |
| Double-booking prevention | ❌ Missing | No transaction-level check; race condition possible |
| Payment integration | ❌ Missing | No Stripe/Adyen configuration; no `PaymentIntent` |
| .ics generation | ❌ Missing | No `ics` library usage |
| Add-to-calendar | ❌ Missing | No Google/Outlook calendar links |
| Modification flow | ❌ Missing | No `PATCH /api/bookings/:id` endpoint |
| Cutoff time enforcement | ❌ Missing | No validation against `business.cancellationPolicy` |

**Critical Risk:** The current `POST /api/bookings` endpoint has no concurrency control. Simultaneous requests for the same slot will create double bookings.

**Completion: ~10%**

---

## 8. Appointment Management (P0)

### Spec Requirements
- Views: Upcoming, Past, Cancelled; sort by date descending
- Countdown to next visit; push notifications (24h, 1h before)
- Reschedule with same constraints as booking
- Cancellation with optional reason, refund policy, immediate confirmation
- Past appointments: review prompt (30-day window), rebook

### Codebase Assessment

**Files Found:**
- `src/pages/appointments.tsx` — Customer appointments list
- `src/components/AppointmentCard.tsx` — Card with status badge
- `src/server/routes/appointments.ts` — `GET /api/appointments` (basic list)

**Implemented:**
- Appointments list with `upcoming`/`past` tabs
- Basic status display (confirmed, cancelled)
- `AppointmentCard` with business name, service, date/time

**Gaps Identified:**
| Requirement | Status | Evidence |
|-------------|--------|----------|
| Cancelled view | ❌ Missing | Tab exists but filters to `status: 'cancelled'` which is never set |
| Countdown | ❌ Missing | No `date-fns` `formatDistanceToNow` usage |
| Push notifications | ❌ Missing | No VAPID keys, no `web-push` integration, no service worker |
| Reschedule | ❌ Missing | No reschedule button or flow |
| Cancellation | ⚠️ Partial | Button exists but calls `DELETE` which hard-deletes; no soft delete |
| Refund policy | ❌ Missing | No `refundAmount` or `refundStatus` tracking |
| Review prompt | ❌ Missing | No `Review` model or prompt UI |
| Rebook | ❌ Missing | No "Rebook" action on past appointments |

**Completion: ~15%**

---

## Cross-Cutting Concerns

### Database Schema
- Prisma schema has core tables (`User`, `Business`, `Service`, `Booking`, `Category`) but lacks:
  - `Session` table (for concurrent session limit)
  - `BookingHold` table (for slot locking)
  - `PasswordResetToken`, `EmailVerificationToken` tables
  - `Review` table
  - Hierarchical category structure
  - `Provider` model (staff members with individual schedules)

### API Design
- RESTful structure started but inconsistent error handling
- No OpenAPI/Swagger documentation
- No request validation beyond basic `zod` schemas (incomplete coverage)

### Testing
- `jest.config.js` present but no test files found
- No e2e tests (Playwright/Cypress)
- No load testing for <500ms search requirement

### DevOps & Infrastructure
- Docker setup incomplete (`Dockerfile` exists but no `docker-compose.yml` for local PostgreSQL)
- No CI/CD pipeline configuration
- No staging environment configuration

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Double-booking in production | Critical | High | Implement `BookingHold` with Redis + transaction-level checks immediately |
| XSS via localStorage tokens | Critical | High | Migrate to HTTP-only cookies before any user data exposure |
| No payment integration | High | Certain | Stripe integration is longest pole; start immediately |
| Missing real-time availability | High | Certain | Design slot generation algorithm; test with edge cases (DST, buffers) |
| No push notifications | Medium | Certain | Defer to post-MVP if needed; use email as fallback |
| Performance unknown | Medium | High | Add Lighthouse CI and k6 load testing to pipeline |

---

## Recommendations

### Immediate (Sprint 0-1)
1. **Fix authentication security:** HTTP-only cookies, refresh token rotation, rate limiting
2. **Prevent double-booking:** Implement `BookingHold` table with Redis TTL and database constraints
3. **Complete OAuth:** Google OAuth is highest-conversion auth method

### Short-term (Sprint 2-4)
4. **Implement search:** PostgreSQL full-text + trigram; benchmark and optimize
5. **Build slot generation:** Core to booking flow; complex business logic requiring thorough testing
6. **Stripe integration:** Payment holds, capture, refunds

### Medium-term (Sprint 5-8)
7. **Map integration:** Mapbox with clustering and bounds-based fetching
8. **Push notifications:** Service worker, VAPID, notification scheduling
9. **Offline support:** Workbox caching, optimistic UI

---

## Appendix: File Inventory

| Path | Purpose | Completeness |
|------|---------|--------------|
| `src/auth/` | Client auth state | 25% |
| `src/server/auth/` | Server auth logic | 20% |
| `src/server/routes/` | API endpoints | 15% |
| `src/components/` | UI components | 20% |
| `src/hooks/` | Custom hooks | 10% |
| `prisma/schema.prisma` | Database schema | 30% |
| `src/pages/` | Next.js pages | 25% |

---

*Report generated by Avery — Progress Tracker. All assessments based on static code analysis and file inspection as of 2025-01-09.*