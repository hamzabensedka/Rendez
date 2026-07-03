# Planity Clone Product Specification

## 1. Introduction
Planity Clone is a mobile‑first beauty & wellness appointment booking platform that connects customers with local service providers (salons, spas, barbers, etc.). The product enables customers to discover businesses, browse services and available slots, book appointments, and manage their visits, while providing business owners with a portal to manage their offerings, staff, and schedule. An admin dashboard oversees the entire ecosystem.

**Target Users:**
- **Customers:** individuals seeking beauty/wellness services.
- **Business Owners (Providers):** salon, spa, or freelance professionals.
- **Administrators:** platform operators managing content and compliance.

**Core Problem:** Fragmented booking experiences with no unified availability, discovery, and payment flow.

## 2. Product Goals
- Seamless discovery and booking in under 3 minutes.
- Real‑time, conflict‑free availability powered by provider schedules.
- Reliable communication via multi‑channel notifications.
- Monetization through booking fees and premium business features.
- Scalable architecture to support thousands of concurrent bookings.

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 (Critical)
**Description:** Secure sign‑up/sign‑in with multiple methods. Role selection distinguishes customers from providers. Session management via JWT.

**Acceptance Criteria:**
- User can register with email/password, Google, or Apple.
- Email verification flow (send OTP/link, confirm).
- Login with credentials, social, or magic link.
- Password reset via email.
- On first login, user selects role (Customer/Provider) – stored in profile.
- JWT access and refresh tokens; refresh rotation.
- Logout clears tokens.
- Error states: incorrect credentials, expired link, network failure.
- Input validation (empty fields, invalid email format).

### 3.2 Guest Browse & Explore
**Priority:** P0
**Description:** Unauthenticated users can explore the app, search businesses, view details, but must sign up/log in to book or favourite.

**Acceptance Criteria:**
- Guest lands on home screen with popular businesses.
- Search, category browse, and map view all accessible.
- Business detail page fully visible (services, reviews, photos).
- “Book” or “Favourite” action triggers login/signup modal.
- After authentication, user is returned to intended action.
- Guest session retains search context only within session; cleared on app close.

### 3.3 Business Search & Discovery
**Priority:** P0
**Description:** Full‑text search with filters and sorting. Autocomplete suggestions as user types.

**Acceptance Criteria:**
- Search by business name, category, location (city/neighbourhood).
- Autocomplete dropdown showing top 5 suggestions.
- Filters: rating (min stars), price level ($-$$$), availability (today, this week), distance.
- Sort by relevance, rating, distance.
- Empty state: friendly message, suggestion to adjust filters.
- Search results paginated (infinite scroll).
- Tapping a result navigates to business detail.

### 3.4 Map‑based Search
**Priority:** P1 (High)
**Description:** Interactive map showing business pins. Search updates as user pans/zooms.

**Acceptance Criteria:**
- Map loads centred on user’s location (permission required).
- Business pins clustered at high zoom levels.
- Tapping a cluster zooms in; tapping a single pin shows a card with name, rating, booking CTA.
- Moving the map triggers a new search for visible area (debounced).
- Switch between list view and map view.
- Current location button centres map.
- Works offline (cached tiles) – basic view.

### 3.5 Business Detail View
**Priority:** P0
**Description:** Comprehensive profile for a service business.

**Acceptance Criteria:**
- Cover image with gallery (swipeable).
- Business name, average rating, total reviews, category tags.
- Address with “Get Directions” (opens maps app).
- Contact phone (tap to call) and website link.
- “About” description.
- List of services grouped by category, each with duration and price.
- Reviews section with paginated list.
- “Favourite” heart toggle.
- “Book Now” prominent button (leads to booking flow).
- Share button (native share sheet).
- Working hours displayed with current status (Open/Closed).

### 3.6 Service Categories
**Priority:** P0
**Description:** Hierarchical taxonomy of beauty and wellness services for discovery and business onboarding.

**Acceptance Criteria:**
- Pre‑defined category tree (e.g., Hair > Women’s Haircut, Men’s Haircut).
- Admin can manage categories (CRUD) from Admin Dashboard.
- Business owners tag each service with one category.
- Customer browse screen shows categories with icons; tap to see subcategories.
- Selecting a category filters search results.
- All services under a business inherit its parent category for search indexing.

### 3.7 Booking Flow
**Priority:** P0
**Description:** Multi‑step, guided process to book an appointment.

**Acceptance Criteria:**
- Step 1: Select service (with optional staff selection if business offers multiple staff).
- Step 2: Calendar view showing available dates; unavailable dates greyed out.
- Step 3: Choose time slot from computed slots (shows duration).
- Step 4: Review summary (service, staff, date/time, price).
- Step 5: Payment (if required) – enter card details or select saved method.
- Step 6: Confirmation screen with booking ID, summary, and “Add to Calendar” option.
- If service is free or deposit not required, bypass payment.
- Real‑time slot locking: slot held for 5 minutes; if user abandons, slot releases.
- Duplicate booking prevention (check existing appointments at same time).
- Error handling: slot taken, payment failure, network error.

### 3.8 Appointment Management
**Priority:** P0
**Description:** Customers can view, reschedule, or cancel their upcoming and past appointments.

**Acceptance Criteria:**
- “My Appointments” list with tabs: Upcoming, Past.
- Each card shows business name, service, date/time, status (Confirmed, Completed, Cancelled).
- Reschedule: opens booking flow with current service/staff pre‑selected; new slot must be valid.
- Cancel: reason selection, optional note. Refund trigger if applicable (per cancellation policy).
- Reschedule/cancel at least 2 hours before appointment (configurable by business).
- Cancelled appointments move to past with strikethrough style.
- Push notification and email on any change.

### 3.9 Favorites
**Priority:** P1
**Description:** Users can save businesses for quick access.

**Acceptance Criteria:**
- Heart icon on business card and detail page toggles favourite state.
- “My Favourites” screen lists saved businesses, sorted by recently added.
- Remove via swipe or unheart.
- Syncs across user devices (cloud‑backed).
- Non‑authenticated users prompted to log in when tapping heart.

### 3.10 User Profile
**Priority:** P0
**Description:** Central place to manage account and preferences.

**Acceptance Criteria:**
- View/edit: name, email, phone, avatar (upload).
- Linked social accounts (Google/Apple) visible with option to unlink.
- Payment methods: add, delete, set default.
- Notification preferences: toggle push, email, SMS per notification type (appointment reminders, promotions).
- Appointment history summary (last 10) with link to full list.
- Delete account option with confirmation and data wipe (GDPR).
- Validation on all inputs; email uniqueness check.

### 3.11 Availability & Slot Computation
**Priority:** P0
**Description:** Real‑time slot generation based on business owner schedules, services, staff, and existing bookings.

**Acceptance Criteria:**
- Provider sets weekly working hours per day, including breaks.
- Service duration and buffer time (cleanup/gap) configured per service.
- Staff members can be assigned to specific services.
- System calculates available slots by:
   - Removing past times, breaks, and booked slots.
   - Adding service duration + buffer to start times.
   - Considering staff concurrency (if multiple staff, multiple parallel slots).
- Holidays and special dates (manual overrides) block slots.
- Real‑time slot availability is exposed via API, refreshed on booking flow entry.
- Slot locking mechanism for 5 minutes during checkout to prevent double‑booking.
- Timezone awareness: provider sets timezone, all slots stored in UTC, displayed in user’s local time.
- Caching layer (Redis) for quick reads, invalidated on booking create/cancel.

### 3.12 Shared Types & Design System
**Priority:** P1
**Description:** Unified TypeScript types and visual design tokens ensuring consistency across all frontends and backend.

**Acceptance Criteria:**
- Shared npm package (or monorepo) with TypeScript interfaces: `User`, `Business`, `Service`, `Staff`, `Appointment`, `Review`, `Notification`, etc.
- Design tokens: colours, typography, spacing, shadows, radius defined in a file (e.g., JSON/CSS variables).
- Reusable component library (React Native / React) for buttons, inputs, cards, modals, lists, loaders.
- Every new feature must use shared types and components.
- Visual regression tests for components.

### 3.13 Reviews & Ratings
**Priority:** P1
**Description:** Users can rate and review businesses after a completed appointment.

**Acceptance Criteria:**
- After appointment status is “Completed”, user receives prompt to leave review.
- Review form: star rating (1‑5), text review (optional, max 500 characters), photo upload (optional).
- One review per appointment; can be edited within 48 hours.
- Moderation: all reviews go to admin moderation queue by default (can auto‑approve for trusted users).
- Flag/report a review option.
- Business average rating recalculated on new approved review.
- Reviews displayed on business detail page, sorted by newest or most helpful.
- Business owner cannot delete reviews but can reply (future phase).

### 3.14 Payment Integration
**Priority:** P0
**Description:** Secure end‑to‑end payment processing for deposits or full service fees.

**Acceptance Criteria:**
- Integrate with Stripe (or equivalent) using Payment Intents and Elements.
- Support credit/debit cards and digital wallets (Apple Pay, Google Pay).
- Saved card functionality (tokenized via Stripe).
- Configurable payment requirement: deposit amount (fixed or percentage) or full amount; may be $0.
- On booking, if payment required, Stripe Payment Sheet is presented; on success, appointment is confirmed.
- On cancellation (within refund window), refunds are processed automatically via background job (BullMQ).
- PCI DSS compliance: no raw card data touches our servers.
- Transaction history stored with status and Stripe reference.
- Handle payment failures with clear error message and retry option.

### 3.15 Notifications
**Priority:** P0
**Description:** Multi‑channel notifications for appointments, promotions, and system messages.

**Acceptance Criteria:**
- **Push notifications** via Firebase Cloud Messaging (FCM) / APNs:
   - Booking confirmation, reminder 24h before, cancellation, reschedule.
   - Promotions (opt‑in).
- **Email notifications** (transactional) for same events, styled HTML.
- **SMS** (optional) for reminders, activated by user.
- Notification centre in app: list of recent notifications with read/unread status, deep linking to appointment or business.
- User can manage preferences per channel per type.
- Delivery reliability: async dispatch via BullMQ queues with retries and failure logging.
- Badge count on app icon for unread push notifications.

### 3.16 Provider / Business Owner Portal
**Priority:** P0
**Description:** Web‑based dashboard for business owners to manage their entire operation.

**Acceptance Criteria:**
- Secure login (same auth system, provider role).
- Dashboard overview: today’s appointments count, weekly bookings chart, revenue summary.
- **Services management:** add, edit, delete services with name, duration, price, buffer, category, staff assignment.
- **Staff management:** invite staff members (email), set working hours, assign services, deactivate.
- **Calendar:** day/week view showing all appointments per staff; colour‑coded by status. Click slot to manually create appointment for walk‑ins.
- **Appointments list:** filter by date/status, view details, mark as complete/no‑show.
- **Business profile:** edit name, description, photos, working hours, holidays, contact info.
- **Client list:** view customers who visited, with appointment history (GDPR compliant).
- **Notifications:** receive booking alerts (in‑app, optional push/email).
- **Settings:** cancellation policy, payment settings (deposit %), notification preferences.
- Real‑time updates when new booking received.

### 3.17 Admin Dashboard
**Priority:** P1
**Description:** Superadmin panel for platform governance.

**Acceptance Criteria:**
- Dashboard with key metrics: total users, businesses, appointments, revenue.
- **Business management:** list all businesses with search, approve/reject new sign‑ups (if manual approval required), suspend/unsuspend, edit details.
- **User management:** view users, ban, delete (GDPR).
- **Appointments management:** search, view all, cancel any, refund processing.
- **Reviews moderation queue:** approve, reject, flag.
- **Categories management:** CRUD service categories with icon upload.
- **System config:** global settings (platform fee %, cancellation window, supported countries).
- **Analytics:** revenue reports, booking growth, user acquisition graphs.
- **Export:** CSV/PDF for reports.
- Access controlled by role (superadmin role).

### 3.18 Background Jobs (BullMQ)
**Priority:** P1
**Description:** Asynchronous job processing for non‑blocking operations using BullMQ with Redis.

**Acceptance Criteria:**
- Queues: `notifications` (push, email, SMS), `payments` (refunds, settlements), `scheduling` (appointment reminders, expired slot release), `data‑export` (reports), `user‑cleanup` (unverified accounts).
- Jobs enqueued on specific events (e.g., booking created → reminder job 24h prior).
- Concurrency and rate limiting configured per queue.
- Retry mechanism with exponential backoff (max 5 attempts).
- Failed jobs moved to dead‑letter queue for manual inspection and replay.
- Monitoring dashboard (Bull Board) for queue health.
- Scalable: multiple workers can be spawned.
- All jobs idempotent where possible.

## 4. Non‑Functional Requirements
- **Performance:** API response < 200ms (p95), slot computation < 500ms.
- **Security:** HTTPS, input sanitization, rate limiting, CORS, OWASP top 10 protection.
- **Localization:** i18n ready with at least English and French strings.
- **Accessibility:** WCAG 2.1 AA for customer portal; screen reader support.
- **Offline:** Service worker for PWA (provider portal), cached assets.
- **Scalability:** Stateless API services, database connection pooling, Redis caching.

## 5. Technology Stack Recommendations
- **Frontend:** React Native (customer app), Next.js (provider & admin portals).
- **Backend:** Node.js + Express/NestJS, TypeScript.
- **Database:** PostgreSQL (primary), Redis (cache, queues, session).
- **Queue:** BullMQ with Redis.
- **Payments:** Stripe.
- **Notifications:** Firebase Cloud Messaging, SendGrid (email), Twilio (SMS).
- **Infrastructure:** Docker, Kubernetes, or serverless depending on scale.

---
*All features are designed to be built incrementally, with continuous user validation at each stage.*