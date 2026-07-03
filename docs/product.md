# Planity Clone Product Specification

**Product Owner:** Alex  
**Version:** 1.0  
**Date:** 2025-02-27  
**Status:** Draft

---

## 1. Introduction

Planity Clone is a mobile-first appointment booking platform connecting customers with beauty, wellness, and personal care providers. The app enables end-users to discover businesses, browse services, book appointments, manage reservations, and leave reviews. Business owners manage their services, slots, and client interactions. An admin dashboard oversees the platform. The system relies on real-time availability computation, secure payments, and automated notifications.

### 1.1 Project Goals
- Provide a seamless, intuitive booking experience for customers.
- Empower service providers with simple tools to manage schedules and attract clients.
- Deliver a scalable, reliable backend that handles millions of appointment slots.
- Launch MVP in 4 months, followed by iterative enhancements.

### 1.2 User Personas
- **End Customer:** Person seeking beauty/spa services, books appointments, manages personal profile and favorites.
- **Service Provider / Business Owner:** Salon, spa, or freelance professional managing services, staff, availability, and appointments.
- **Admin:** Platform operator managing businesses, resolving issues, monitoring system health.

---

## 2. Feature Prioritisation

| Feature                          | Priority | Rationale                                                                 |
|----------------------------------|----------|---------------------------------------------------------------------------|
| User Authentication              | P0       | Required for booking, favourites, and personalization.                    |
| Guest Browse & Explore           | P0       | Vital for conversion; users must discover businesses without signup.      |
| Business Search & Discovery      | P0       | Core discovery engine.                                                    |
| Map-based Search                 | P1       | Enhances discovery but not blocking for MVP.                              |
| Business Detail View             | P0       | Essential to make booking decisions.                                      |
| Service Categories              | P0       | Organises offerings; foundation for search filters.                       |
| Booking Flow                     | P0       | The primary flow that generates revenue.                                  |
| Appointment Management           | P0       | Users and providers need to view, cancel, reschedule.                     |
| Favorites                        | P2       | Nice-to-have for user engagement; can be post-MVP.                       |
| User Profile                     | P1       | Needed for personalisation, loyalty, and multiple pets/clients.           |
| Availability & Slot Computation  | P0       | Critical for preventing double bookings and showing real-time slots.      |
| Shared Types & Design System     | P0       | Foundation for consistency and developer efficiency.                      |
| Reviews & Ratings                | P1       | Builds trust; important for customer decision but can be added soon after.|
| Payment Integration              | P1       | Required for pre-payment or no-shows; can start with cash-on-arrival MVP. |
| Notifications                    | P1       | Essential for reminders and confirmations; email/SMS can be phased.       |
| Provider / Business Owner Portal | P0       | Providers must manage their services and appointments; core to platform.  |
| Admin Dashboard                  | P1       | Needed for support and monitoring; can be lightweight initially.          |
| Background Jobs (BullMQ)         | P0       | Used for slot computation, reminders, data sync; architectural necessity.|

---

## 3. Functional Requirements & Acceptance Criteria

### 3.1 User Authentication (P0)
*As a user, I want to sign up and log in so that I can book appointments and access my history.*

**Acceptance Criteria:**
- User can sign up with email/password, Google SSO, and Apple Sign In.
- Input validation for email format, password strength (min 8 chars).
- On signup, user receives email verification link; account remains unverified until confirmed.
- Login returns JWT (access + refresh token) with appropriate expiration.
- Forgot password flow sends reset email; reset token expires in 30 minutes.
- Session persists across app restarts via secure storage (Keychain/Keystore).
- Logout clears local tokens and redirects to login.
- Guest users (unauthenticated) can still browse and search.

---

### 3.2 Guest Browse & Explore (P0)
*As an unauthenticated user, I want to explore businesses and services so that I can decide to sign up.*

**Acceptance Criteria:**
- Guest can view home screen with curated/popular businesses.
- Can browse service categories and listings.
- Can view business detail pages (services, ratings, location).
- Tapping “Book” prompts login/signup modal.
- Search and filter work for guests.
- No personal data (favourites, bookings) accessible without login.

---

### 3.3 Business Search & Discovery (P0)
*As a customer, I want to search for businesses by name, location, or service so that I find the right provider.*

**Acceptance Criteria:**
- Search bar on home screen and dedicated search page.
- Supports full-text search on business name, description, category, and service names.
- Results paginated (20 per page).
- Filters: category, rating (≥4, ≥3, etc.), distance, price range (if available), open now.
- Sorting: relevance, rating (high-low), distance.
- Search results show business name, main image, rating, distance, and next available slot.
- Typo-tolerant search (fuzzy matching) implemented via Elasticsearch or PostgreSQL trigram.
- Recent searches saved locally for logged-in users.

---

### 3.4 Map-based Search (P1)
*As a customer, I want to see businesses on a map so that I can find services near me.*

**Acceptance Criteria:**
- Toggle between list view and map view on search screen.
- Map shows business pins with rating and category icon.
- Pin tappable -> shows compact info card; tap card navigates to detail.
- Map centres on user’s current location (with permission).
- Search radius adjustable (1km, 5km, 10km, 20km).
- Map uses standard mapping SDK (Mapbox/Google Maps).
- Performance: cluster pins when zoomed out.

---

### 3.5 Business Detail View (P0)
*As a customer, I want to see all information about a business before booking.*

**Acceptance Criteria:**
- Header: cover photo, business name, category, rating (stars + count), address, distance.
- Photo gallery carousel.
- Tab/section: About (description, amenities, certifications).
- Services tab: list of services grouped by category, each with name, duration, price, and “Book” button.
- Reviews tab: summary (average, distribution), recent reviews with user name, rating, date, comment; “See all” link.
- Action: share business link, add to favourites (logged-in).
- “Book” CTA always visible; tapping service scrolls to booking widget or opens booking flow.
- Map snippet showing location.
- Operating hours displayed (today's status: Open/Closed).

---

### 3.6 Service Categories (P0)
*As a customer, I want to browse predefined categories so that I can quickly narrow down services.*

**Acceptance Criteria:**
- Home screen grid of category cards (e.g., Hair, Nails, Spa, Barber, Makeup).
- Tapping a category opens search results filtered by that category.
- Admin can manage categories (add/edit/disable) via admin panel.
- Categories support hierarchy (parent/child) but MVP flat list is acceptable.
- Each business can be tagged with multiple categories.

---

### 3.7 Booking Flow (P0)
*As a customer, I want to select a service, pick a date and time, provide details, and confirm the booking.*

**Acceptance Criteria:**
- Flow: Service selection → Date picker → Time slot selection (based on real-time availability) → Booking details (optional notes, pet info if applicable, client selection from profile) → Confirmation summary → Confirm.
- Date picker shows next 30 days; disabled dates if no slots or business closed.
- Time slots displayed as selectable chips; unavailable slots greyed out.
- If a staff member is required, optionally select preferred staff (only show staff providing that service).
- Confirmation screen shows business, service, date, time, staff (if any), price, duration, cancellation policy.
- On confirmation, appointment is created; user sees success screen with appointment details and option to add to calendar.
- Concurrent booking prevention: slot locked temporarily during booking process (with timeout).
- Guest booking not allowed; must log in before confirming.

---

### 3.8 Appointment Management (P0)
*As a user, I want to view upcoming and past appointments, cancel or reschedule.*

**Acceptance Criteria:**
- Appointments screen with tabs: Upcoming, Past.
- Each card shows business name, service, date/time, status (confirmed, pending, cancelled, completed).
- Tap card to view full appointment detail (including cancellation/rescheduling policy).
- Cancel action: prompt confirmation; business cancellation policy (e.g., 24h free cancel) enforced; status updated; business owner notified.
- Reschedule: opens booking flow pre-filled with same service; old appointment cancelled upon new confirmation.
- Past appointments show review prompt if not reviewed yet.
- History persists indefinitely.

---

### 3.9 Favorites (P2)
*As a customer, I want to save favourite businesses for quick access.*

**Acceptance Criteria:**
- Heart icon on business cards and detail page.
- Toggle adds/removes from favourites; state persists.
- Dedicated Favourites screen listing saved businesses sorted by recently added.
- Sync across user’s devices.

---

### 3.10 User Profile (P1)
*As a user, I want to manage my personal information and preferences.*

**Acceptance Criteria:**
- Edit profile: name, email (verified), phone, profile photo.
- Add/remove saved clients/pets: name, type, notes (important for multi-pet households).
- Notification preferences: push, email, SMS toggles.
- Payment methods: saved cards (if payment integration enabled).
- App settings: language (EN/FR initial), dark mode toggle.
- Delete account (GDPR compliant) with data removal scheduled.

---

### 3.11 Availability & Slot Computation (P0)
*As a provider, I want the system to compute available appointment slots accurately.*

**Acceptance Criteria:**
- Provider defines working hours per day, breaks, and holiday/blocked dates.
- Each service has a fixed duration and optional buffer time before/after.
- Staff assignment: services can be allocated to all staff or specific ones; slot availability considers staff schedule and existing bookings.
- Slots generated at regular intervals (default 15 min) but bookable only at times that allow full service duration.
- Real-time calculation: when a user queries a date, system returns available start times.
- Overbooking prevention: slots are locked using Redis during the booking transaction (with expiry).
- Concurrency safe: background job recalculates slot cache after any booking/cancellation, but primary query uses on-the-fly computation with short cache (1 minute).
- Availability API must respond < 200ms for up to 10,000 queries per minute.

---

### 3.12 Shared Types & Design System (P0)
*Foundation for consistent development.*

**Acceptance Criteria:**
- TypeScript shared types defined for all core entities: User, Business, Service, Staff, Appointment, Review, etc.
- Single source of truth for API DTOs and domain models.
- Design system implemented in React Native / web includes: color palette (primary, secondary, success, error), typography scale (10pt to 32pt), spacing grid (4px base), reusable components (Button, Card, Chip, Input, Modal, Avatar, RatingStars).
- Components documented in Storybook (for web admin) and React Native component library.
- Dark mode support across all components.
- Accessibility: minimum contrast ratio, touch targets ≥44px, screen reader labels.

---

### 3.13 Reviews & Ratings (P1)
*As a customer, I want to leave a review after my appointment to help others.*

**Acceptance Criteria:**
- Post-appointment prompt: after appointment marked completed, user can rate 1-5 stars and write optional comment.
- Review visible on business detail page after moderation (or auto-approval with manual flagging).
- Edit/delete own reviews.
- Provider cannot delete reviews but can respond publicly.
- Average rating recalculated asynchronously.
- Review filtering: by stars, most recent.

---

### 3.14 Payment Integration (P1)
*As a customer, I want to pay online for my booking to secure the slot.*

**Acceptance Criteria:**
- Support for credit/debit cards via Stripe.
- Optional pre-authorisation for no-show protection (charge only after no-show).
- Payment method saved in user profile (PCI compliant).
- Receipt generated after payment.
- Refund flow for cancellations according to business policy.
- Payment status tracked per appointment (pending, paid, refunded).

---

### 3.15 Notifications (P1)
*As a user, I want to be notified about booking confirmations, reminders, and cancellations.*

**Acceptance Criteria:**
- Push notifications (Firebase/APNs) for: booking confirmation, 24h reminder, cancellation, rescheduling, review prompt.
- In-app notification centre with badge count and read/unread state.
- Email notifications as fallback (template driven).
- SMS optional (Twilio integration).
- Notification preferences respected per user.
- Real-time push via WebSocket/message broker; background jobs dispatch bulk reminders.

---

### 3.16 Provider / Business Owner Portal (P0)
*As a business owner, I want to manage my profile, services, staff, and appointments.*

**Acceptance Criteria:**
- Separate mobile/web portal for providers with secure login.
- Dashboard: today's appointments summary, upcoming schedule, revenue overview (daily/weekly).
- Appointments list with filtering by date, staff, status; ability to confirm, cancel, mark no-show.
- Calendar view: daily/weekly/monthly showing all appointments, drag to reschedule (web).
- Customer management: view client history, notes.
- Services management: CRUD services, set duration, price, assign staff, buffer times.
- Staff management: add/edit staff, assign services, set individual working hours and breaks.
- Business settings: profile (name, description, photos, category), address, contact, operating hours, cancellation policy.
- Availability management: set regular hours per day, add date-specific overrides (holidays, extra hours).
- Real-time updates propagate to customer-facing availability.
- Notifications to provider for new bookings and cancellations.

---

### 3.17 Admin Dashboard (P1)
*As an admin, I want to manage businesses, users, and monitor platform health.*

**Acceptance Criteria:**
- Secure admin login with role-based access.
- Business list with search, filter by status (active, pending, suspended).
- Approve/reject new business registrations; suspend business.
- User management: view/search users, disable accounts.
- Review moderation queue: flag/approve/delete reviews.
- Category management: add/edit/disable categories.
- System metrics: total bookings, revenue, active users, error rates.
- Job queue monitoring (BullMQ dashboard) visible to admin.
- All actions logged (audit trail).

---

### 3.18 Background Jobs (BullMQ) (P0)
*Backend infrastructure for asynchronous processing.*

**Acceptance Criteria:**
- Redis-backed BullMQ queues for: appointment reminders (schedule job 24h before), expired slot lock cleanup, review prompts (after service completion), data aggregation (daily stats), email/SMS dispatch.
- Retry mechanism with exponential backoff for failed jobs.
- Dead letter queue for unprocessable jobs.
- Separate queues for high and low priority tasks.
- Bull Board UI integrated for admin monitoring.

---

## 4. Non-Functional Requirements

- **Performance:** All API responses under 500ms p95; slot availability under 200ms.
- **Scalability:** System must handle 50,000 concurrent users and 1M appointments/month in year one.
- **Security:** HTTPS enforced, OWASP top 10 covered, rate limiting on auth endpoints, data encryption at rest.
- **Reliability:** 99.9% uptime for core booking flow.
- **Localization:** Support English and French initially; date/time formats locale aware.
- **Platform:** iOS and Android mobile apps via React Native; web admin built in React.

---

## 5. Assumptions & Out of Scope

- **Assumptions:** Providers set their own availability; no AI scheduling optimization in MVP. Payment integration will be Stripe only. Map service uses Google Maps.
- **Out of Scope for MVP:** Loyalty programs, multi-language beyond EN/FR, virtual consultations, advanced staff commission tracking, custom booking forms per service.

---

## 6. Dependencies

- Third-party services: Stripe, Twilio (SMS), Firebase (push notifications, analytics), Google Maps/Mapbox, Elasticsearch (or PostgreSQL full-text), Redis, BullMQ.
- Internal: Shared types repository, design system library.

---

## 7. Glossary

- **Slots:** Time intervals available for booking.
- **Buffer:** Padding time before/after a service to allow clean-up.
- **No-show:** Client fails to appear for appointment.
- **Pre-authorization:** Temporary hold on funds without capturing.
- **Provider/Business Owner:** Person or company offering services.

---

*Document approved for development kickoff.*