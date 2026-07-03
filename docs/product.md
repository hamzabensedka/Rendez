# Planity Clone — Product Specification

**Version:** 1.0  
**Status:** Draft  
**Product Owner:** Alex

---

## Document Overview

This document defines the complete feature set, user stories, and acceptance criteria for Planity Clone, a mobile-first salon and wellness booking platform. It serves as the single source of truth for development teams. All features are prioritised according to the MoSCoW-inspired scale: P0 (Must‑have for MVP), P1 (Should‑have), P2 (Nice‑to‑have).

---

## User Roles

- **Guest** – unauthenticated user who can browse, search, and view details but cannot book.
- **Client** – authenticated user who can book appointments, manage bookings, leave reviews, and save favourites.
- **Provider / Business Owner** – a business owner (or designated staff) who manages services, availability, appointments, and business information via a web portal.
- **Admin** – platform administrator with superuser access to all data, categories, reviews moderation, and system configuration.

---

## Feature List & Priorities

### 1. User Authentication
**Priority:** P0

**Description:** Secure registration and login for clients and providers. Supports social login for frictionless onboarding and standard email/password.

**User Stories:**
- As a guest, I want to register with email/password or Google/Apple so that I can book appointments.
- As a registered user, I want to log in and log out securely.
- As a user, I want to reset my password if I forget it.

**Acceptance Criteria:**
- Email/password registration with validation (valid email, password min 8 chars).
- Google and Apple Sign‑In must follow platform guidelines and return a JWT.
- Password reset flow: request link → email → new password set (link expires in 1 hour).
- Session management via refresh/access tokens; auto‑refresh on app open.
- Providers use the same auth endpoints but are assigned a `provider` role on registration (via admin approval or separate flow).
- All endpoints reject expired/invalid tokens with appropriate error messages.

---

### 2. Guest Browse & Explore
**Priority:** P0

**Description:** Unauthenticated users can freely explore the app to discover businesses and services. A login/register prompt appears only when they attempt a booking or access personalised features.

**Acceptance Criteria:**
- Guest can view the home screen with featured businesses, categories, and search.
- Guest can browse any business detail page, see services, reviews, and ratings.
- When tapping “Book”, a modal or redirect prompts login; after successful login, the booking flow resumes at the same step.
- No guest data is persisted except anonymous analytics.

---

### 3. Business Search & Discovery
**Priority:** P0

**Description:** Clients can search for businesses by name, category, or location. Results support filters and sorting.

**User Story:**
- As a client, I want to find a salon near me that offers a specific service and has good ratings.

**Acceptance Criteria:**
- Search box with autocomplete (min 3 chars) that queries business name and service names.
- Filters: distance (if location granted), price range, rating, immediate availability (today/this week).
- Sorting: relevance, rating (highest first), distance (nearest first), price (low/high).
- Results displayed in a paginated list; each card shows photo, name, category, rating, distance, and next available slot (if computed).
- Search is available to guests.

---

### 4. Map-based Search
**Priority:** P1

**Description:** Interactive map view for location‑aware discovery. Users can pan/zoom and see business pins dynamically.

**Acceptance Criteria:**
- Map loads with user’s current location (if permission granted).
- Business pins show category icon and respond to tap → mini card with name, rating, and “View” button.
- As user moves the map, a “Search this area” button appears; tapping it reloads results for the new bounds.
- Map/list toggle remembers user preference.
- Accessible via a dedicated tab or a map button on the search screen.

---

### 5. Business Detail View
**Priority:** P0

**Description:** Comprehensive view of a business, including visual identity, services, reviews, and location.

**Acceptance Criteria:**
- Photo gallery (swipeable) with placeholder if none.
- Business name, category, address (with map preview), phone (tap to call), rating (stars + count).
- Opening hours displayed in a user‑friendly “Today: 9:00 – 18:00” format, with expansion for full week.
- Services tab: list of services grouped by category, each showing duration and price.
- “Book” CTA always visible. If user is a guest, tap triggers login flow.
- Reviews tab: latest reviews with pagination; summary rating breakdown.
- “Add to favourites” heart icon (authenticated only).

---

### 6. Service Categories
**Priority:** P0

**Description:** Hierarchical structure of services managed globally by Admin. Businesses assign services from this catalogue or create custom ones.

**Acceptance Criteria:**
- Admin can create/edit/delete categories and subcategories (e.g., Hair → Women’s Haircut).
- Each subcategory can have multiple service items with default name, duration, price range.
- Provider can choose from global catalogue to populate their service list and adjust price/duration.
- All clients see the same category tree in browse/search.

---

### 7. Booking Flow
**Priority:** P0

**Description:** Step‑by‑step journey from service selection to confirmed appointment.

**User Story:**
- As a client, I want to book a service at a specific time and pay securely.

**Flow Steps:**
1. Select service (from business detail).
2. Choose a staff member if applicable (optional step; default to “Any”).
3. Date picker → available time slots based on real‑time availability.
4. Review booking details (service, date, time, staff, price).
5. Login / Register (if guest) returning to step 4.
6. Payment (card / Apple Pay).
7. Confirmation screen with appointment summary and option to add to calendar.

**Acceptance Criteria:**
- Slot selection shows only slots computed via Availability Engine (feature 11).
- A slot is held for 5 minutes once selected (pessimistic lock / temporary reservation) to prevent double‑booking.
- Payment is processed via Stripe; on success, appointment is created and confirmed.
- If payment fails, slot is released and user informed.
- Booking is not allowed for past dates/times.
- Recurring booking is P2 and not required in MVP.

---

### 8. Appointment Management
**Priority:** P0

**Description:** Clients can view, reschedule, or cancel upcoming appointments.

**Acceptance Criteria:**
- “My Appointments” screen with tabs: Upcoming and Past.
- Upcoming card shows date, time, business name, service, status (confirmed, pending, cancelled).
- Reschedule flow: user selects new date/time from available slots; system updates appointment and sends notifications.
- Cancellation: confirmation dialog; if allowed by business policy (e.g., up to 24h before), appointment is cancelled and refund initiated according to payment rules.
- Past appointments display with ability to leave a review (if not already submitted) – see Reviews & Ratings.
- Real‑time sync: changes made by provider (e.g., cancellation) appear in client app immediately (via socket or push).

---

### 9. Favourites
**Priority:** P1

**Description:** Users can save businesses and services for quick access.

**Acceptance Criteria:**
- Heart icon on business card and detail view; toggling adds/removes from favourites.
- “Favourites” screen lists saved businesses with avatar, name, rating; tapping opens detail.
- Favourites are synced across user’s devices (persisted server‑side).
- Option to favourite a specific service (P2, for later easy booking).

---

### 10. User Profile
**Priority:** P0

**Description:** Manage personal information, payment methods, and notification preferences.

**Acceptance Criteria:**
- Edit profile: first name, last name, email, phone, profile photo (upload).
- Saved payment methods: list of cards (tokenised via Stripe) with ability to add/delete; one default.
- Notification preferences: push, email, SMS toggles for booking confirmations, reminders, and promotions.
- Account deletion option with confirmation and data wipe (GDPR compliant).

---

### 11. Availability & Slot Computation
**Priority:** P0 (Critical)

**Description:** Core engine that determines bookable time slots based on provider settings, existing appointments, and system rules.

**Provider Settings (via Owner Portal):**
- Weekly working hours per day (e.g., Mon‑Fri 9:00‑18:00, Sat 10:00‑16:00).
- Break times (e.g., 13:00‑14:00).
- Service duration for each service (can override default).
- Staff assignment (if multi‑staff) and buffer time before/after.

**Computation Logic:**
- Generate all possible slots in 15‑minute increments for a given date within working hours.
- Remove slots that overlap with existing confirmed appointments (including staff‑specific if assigned) or provider‑blocked time.
- Apply buffer rules.
- Return a list of start times for the requested service duration.

**Acceptance Criteria:**
- API endpoint `GET /slots?businessId=&serviceId=&staffId=&date=` returns accurate, real‑time slots.
- Slots adjust immediately when an appointment is booked/cancelled.
- Timezone‑aware (provider sets timezone; all slots stored in UTC).
- Edge cases: same‑day booking with past slots excluded; service longer than remaining working hours shows no slots. Performance: response <200ms for typical provider configuration.

---

### 12. Shared Types & Design System
**Priority:** P0 (Foundational)

**Description:** Consistent, reusable component library and TypeScript interfaces shared across mobile (React Native) and web (React) frontends, as well as backend validation schema.

**Components (Example):**
- Button (primary, secondary, danger), Input, Card, Avatar, StarRating, Chip, Modal, BottomSheet, etc.
- All follow a 4‑pt spacing grid, predefined colour palette (primary, accent, success, error, neutral), and typography scale.
- Dark mode support defined but MVP only light.

**Shared Types:**
- Centralised TypeScript interfaces in a `@planity/types` package: `User`, `Business`, `Service`, `Appointment`, `Review`, `Slot`, `Notification`, etc.
- Used by frontend and backend (NestJS validation DTOs) to ensure data contracts.

**Acceptance Criteria:**
- Design system documented in Storybook (or Zeplin).
- All new UI must use existing components; deviations require PO approval.
- Types package is versioned and imported in all relevant projects.

---

### 13. Reviews & Ratings
**Priority:** P1

**Description:** Clients can rate and review completed appointments. Reviews appear on business profiles after moderation.

**Acceptance Criteria:**
- After an appointment status changes to “completed”, the client sees a prompt to leave a review (in‑app and via push notification).
- Review form: star rating (1‑5) and optional text comment (max 500 chars).
- Reviews are initially hidden until admin approves (moderation queue).
- Approved reviews are displayed on business detail page with most recent first.
- Business owner can respond to a review (single response, editable by owner).
- Rating summary shows average and distribution (e.g., 5★ 70%, 4★ 20%...).
- Users can edit/delete their own review within 7 days (then locked).

---

### 14. Payment Integration
**Priority:** P0

**Description:** Secure payment processing via Stripe for appointment bookings. Supports cards and digital wallets.

**Acceptance Criteria:**
- Stripe Elements or React Native Stripe SDK used to collect payment details (PCI‑compliant).
- Payment flow:
  1. Create PaymentIntent on backend with amount and currency, return client secret.
  2. Frontend confirms card/wallet payment.
  3. On success, backend marks appointment as paid and sends confirmation.
  4. On failure, appropriate error message displayed; slot released.
- Support for saved cards (setup future usage) and one‑time payments.
- Refund capability: when a client cancels according to policy, backend initiates refund via Stripe and updates appointment status.
- All transactions logged with Stripe payment ID for reconciliation.
- Idempotency keys used to prevent duplicate charges.

---

### 15. Notifications
**Priority:** P1 (P0 for booking confirmations & reminders)

**Description:** Multi‑channel notifications for transactional and marketing messages, processed asynchronously via the BullMQ job queue.

**Trigger Events:**
- Booking confirmation (push / email)
- Booking reminder 24h and 1h before (push / email / SMS based on user preferences)
- Cancellation / rescheduling (push / email)
- Review request after completed appointment (push)
- Promotion messages (email, P2)

**Acceptance Criteria:**
- Push notifications via Firebase Cloud Messaging (FCM) for both iOS and Android.
- Emails sent via a transactional service (e.g., SendGrid) with responsive templates.
- SMS optional (Twilio) activated only if user opts in.
- Notification preferences honoured from User Profile.
- Delivery status logged (sent, failed, opened) for analytics.
- Admin can trigger promotional push to all users (P2).

---

### 16. Provider / Business Owner Portal
**Priority:** P0

**Description:** Web dashboard for business owners to manage their business, staff, services, availability, and appointments.

**User Stories:**
- As a salon owner, I want to set my working hours and breaks so clients see correct availability.
- As an owner, I want to manage services and pricing.
- As an owner, I want to view daily appointment list and accept/reject walk‑ins (if supported).

**Acceptance Criteria:**
- Authentication with provider role; dashboard accessible only after admin approval.
- Business Info: edit name, description, photos, address, phone, opening hours.
- Services: add/edit/delete service offerings; assign to global categories or create custom.
- Staff: if multi‑staff, add members with name, specialization, working hours (can differ from business hours).
- Calendar view: daily/weekly view of appointments with colour coding by status; ability to manually add/block time, mark no‑show, or complete.
- Availability: set weekly schedule per staff member; define holidays/exceptional closures.
- Quick actions on appointment: cancel, reschedule (with optional notification to client), and view client details.
- Simple reports: number of appointments, revenue, no‑show rate for selected period.

---

### 17. Admin Dashboard
**Priority:** P1

**Description:** Centralised control panel for platform administrators.

**Acceptance Criteria:**
- Dashboard metrics: total users, businesses, bookings, revenue (today/week/month).
- Business management: approve/reject new business registrations; suspend/activate businesses.
- Category management: create/edit/delete service categories and subcategories.
- Review moderation: queue of pending reviews with approve/reject actions.
- User management: search users, view booking history, block/unblock accounts.
- Configuration: global settings (commission percentage, cancellation policy hours, maximum image size).
- All admin actions logged for audit.

---

### 18. Background Jobs (BullMQ)
**Priority:** P0 (for reliable async processing)

**Description:** Job queue system using BullMQ (Redis‑backed) to handle non‑blocking tasks, ensuring responsiveness and fault tolerance.

**Jobs implemented:**
- `sendNotification`: triggered on various events; processes push, email, SMS with retry logic.
- `scheduleReminders`: scheduled job that runs periodically to send upcoming appointment reminders.
- `releaseExpiredSlotHolds`: cleans up slots that were held but not booked after 5 minutes.
- `processPaymentRetry`: if initial capture fails due to temporary error, retries up to 3 times.
- `requestReview`: enqueued after appointment completion to ask for review after a delay.

**Acceptance Criteria:**
- All jobs are added to appropriate queues and processed by dedicated workers (separate Node.js processes).
- Redis connection is configured; bull board UI available for monitoring (internal network).
- Failed jobs are retried with exponential backoff; after max retries they go to dead‑letter queue and alert admin.
- No job is lost: Redis persistence enabled.

---

## Appendix A: Non‑functional Requirements (Global)
- **Responsiveness:** All API responses under 300ms (p95) for simple reads; slot computation under 200ms.
- **Scalability:** Architecture supports horizontal scaling of API and workers.
- **Security:** HTTPS only, input sanitisation, rate limiting, OWASP Top 10 protection.
- **Testing:** Unit and integration tests for critical paths (booking, payment, availability).

---

## Appendix B: Roadmap & Dependencies
- **MVP (P0 features):** Complete booking flow, availability engine, auth, payment, business detail, provider portal, background jobs.
- **Phase 2 (P1):** Favourites, reviews, map search, admin dashboard, enhanced notifications (SMS).
- **Phase 3 (P2):** Recurring bookings, loyalty program, advanced analytics, multi‑language.