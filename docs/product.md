# Planity Clone Product Specification

## 1. Introduction
**Goal:** Build a multi‑platform appointment booking system for beauty & wellness services. Target roles: end‑user (customer), provider (business owner/staff), and admin.

## 2. Shared Types & Design System
**Priority:** P0 – Foundation for all screens.
- **Acceptance Criteria:**
  - Central design tokens (colors, typography, spacing, shadows) defined in a shared package (e.g., Tailwind config/design system JSON).
  - Reusable UI components (Button, Card, Input, Modal, Badge, Avatar, StarRating) built with accessibility compliant (WCAG 2.1 AA).
  - All screen layouts follow a consistent grid and navigation patterns (bottom tabs for customer, drawer/tabs for provider).
  - Shared TypeScript types for entities: `User`, `Business`, `Service`, `Appointment`, `Review`, `TimeSlot`, `AvailabilityRule`.

## 3. User Authentication
**Priority:** P0 – Must‑have for secure personalisation.
- **Acceptance Criteria:**
  - Customers can register/login via email+password, Google Sign‑In, Apple Sign‑In, and phone OTP (optional).
  - Providers use email+password login only; phone OTP for recovery.
  - Session management using JWT (access/refresh tokens) stored securely (http‑only cookies for web, secure storage for mobile).
  - Password reset flow with email link (expires in 1 hour).
  - Role‑based access: customer, provider, admin.
  - Error states: invalid credentials, expired link, social login failure.

## 4. Guest Browse & Explore
**Priority:** P0 – Allow unauthenticated discovery to reduce friction.
- **Acceptance Criteria:**
  - Guests see homepage with featured businesses, categories, and search bar.
  - Can view business detail pages but “Book” button prompts login/register modal.
  - Location permission request for better results (optional) with fallback to manual address input.
  - Session‑based cart is not needed; booking requires auth.
  - All content is discoverable; no locked content beyond booking.

## 5. Service Categories
**Priority:** P0 – Primary navigation & discovery.
- **Acceptance Criteria:**
  - Hardcoded top‑level categories (Hair, Nails, Massage, Skin, Barber, Makeup, …) displayed as icons.
  - Each category drills down to sub‑services (e.g., Hair → Cut, Coloring, Styling) with machine‑readable tags.
  - Providers can assign multiple categories/services during onboarding.
  - Category pages show list of businesses offering that service, sortable by distance/rating/availability.
  - Deep linking from a category to filtered search.

## 6. Business Search & Discovery
**Priority:** P0 – Core discovery engine.
- **Acceptance Criteria:**
  - Full‑text search on business name, description, services, and location (city/zip).
  - Autocomplete suggestions with debounced API call (300ms).
  - Filters: price range, rating, availability (today, this week), open now, business attributes (women‑only, premium).
  - Sorting: relevance, distance, rating, price low‑high.
  - Search results show business card with photo, rating, distance, next available slot.
  - Empty state with suggestions to adjust filters.
  - Geolocation: if location permission granted, return businesses ordered by proximity; else prompt to enter location.

## 7. Map‑based Search
**Priority:** P1 – Enhances discovery, not blocking.
- **Acceptance Criteria:**
  - Search screen contains a toggle to switch between list and map view.
  - Map (Leaflet/Mapbox) shows business pins clustered above a certain zoom level.
  - Tapping a pin opens a compact business card with name, rating, next slot, and “View” button.
  - Map re‑centers and reloads pins when user moves map (debounced 500ms).
  - Location permission prompt with clear explanation.

## 8. Business Detail View
**Priority:** P0 – Converts browsers to bookers.
- **Acceptance Criteria:**
  - Hero image gallery (carousel with swipe), business name, address, contact info, working hours for today.
  - Expandable “About” section, amenities (Wi‑Fi, parking, wheelchair access).
  - List of services with duration, price, and “Book” CTA per service.
  - Review summary (average rating, total count) and link to all reviews.
  - Provider’s team members (if multiple staff) with photo, specialities, and availability (when staff‑based booking enabled).
  - Share button that copies deep link.
  - Map static preview with “Open in Maps” link.
  - “Favorite” toggle (heart icon) – calls Favorites API.
  - Loading skeleton and error state if business not found.

## 9. Reviews & Ratings
**Priority:** P1 – Trust layer; can be post‑MVP.
- **Acceptance Criteria:**
  - Customers can leave a rating (1‑5 stars) and optional text review after a completed appointment.
  - Review must be linked to a verified appointment; one review per appointment.
  - Provider cannot edit/delete reviews but can respond publicly (owner/staff).
  - Reviews are displayed with most recent first; infinite scroll.
  - Profanity filter and moderation flag for admin.
  - Average rating updates asynchronously via background job.
  - Report abuse option for customers.

## 10. Favorites
**Priority:** P1 – Retention feature.
- **Acceptance Criteria:**
  - Authenticated users can favorite/unfavorite a business from list/detail view.
  - A dedicated “Favorites” tab on customer home shows saved businesses with next available slot.
  - Favorites sync across devices (stored on server).
  - Empty state with illustration and a CTA to explore.
  - Push notification option when a favorited business drops a slot (optional, opt‑in).

## 11. Booking Flow
**Priority:** P0 – Core conversion path.
- **Acceptance Criteria:**
  - Flow: Select service → choose staff (if multi‑staff) → see real‑time calendar/slots → confirm details → pay/confirm.
  - Calendar shows available days highlighted; fully booked days greyed out.
  - Time slots displayed based on provider’s availability rules, buffer times, and existing bookings.
  - Each slot shows exact time and duration (e.g., “10:00 – 10:45”).
  - User can add optional notes (max 200 chars).
  - Before payment, a summary screen shows service, staff, date & time, price, and cancellation policy.
  - Booking is held with a 10‑minute reservation lock (idempotency key) during payment.
  - On successful payment, booking is confirmed; user sees success screen with booking ID and option to add to calendar.
  - Booking confirmation email/SMS (and push notification).
  - Error handling: lock expired, payment failure, concurrency (slot taken by someone else) with appropriate messaging.

## 12. Appointment Management
**Priority:** P0 – Post‑booking user control.
- **Acceptance Criteria:**
  - Customer “Appointments” tab lists upcoming and past appointments with status (confirmed, completed, cancelled, no‑show).
  - Actions: cancel (at least 24h before, configurable), reschedule (initiate same booking flow with same service/staff pre‑selected), and rebook from past appointments.
  - Cancellation triggers refund if payment was captured; refund timeline as per payment method.
  - Reschedule creates a new booking and cancels old one atomically, respecting availability.
  - Push notification reminders 24h and 1h before appointment.
  - Provider’s view (see Provider Portal) updates in real‑time.
  - User can tap appointment to see details: date, time, service, staff, location, map, and option to contact provider (chat or call).

## 13. Availability & Slot Computation
**Priority:** P0 – Critical for correct booking.
- **Acceptance Criteria:**
  - Providers define weekly recurring availability per day (e.g., Mon‑Fri 9‑18), break times (e.g., 13:00‑13:30), and per‑date overrides (holidays, extended hours).
  - Service duration + buffer time (before/after) calculated.
  - For multi‑staff businesses, availability is computed per staff member; user can select from available staff for a given slot.
  - Slot computation API returns non‑overlapping intervals taking into account existing bookings, provider availability, and block time (manual blocks).
  - Performance: endpoint returns slots for a date range (e.g., next 60 days) in under 500ms for a single business.
  - Concurrency is handled via database transactions/optimistic locking when finalising booking.
  - Background job (BullMQ) pre‑generates slot cache for next 7 days for popular businesses.

## 14. Payment Integration
**Priority:** P0 – Monetisation and booking guarantee.
- **Acceptance Criteria:**
  - Use Stripe Connect: platform charges customer, splits payment between platform (commission) and provider.
  - Flow: customer confirms booking → payment intent created with idempotency key → user completes payment in‑app (Stripe Elements / native SDK).
  - Support card payments and digital wallets (Apple Pay, Google Pay) where available.
  - Commission configurable per platform or per provider (set in admin).
  - Booking is confirmed only after payment succeeds; on failure, reservation lock released.
  - Refund via dashboard or API for cancellations; partial refund support.
  - Invoice (PDF) stored and downloadable by user.
  - PCI‑DSS compliance ensured via Stripe tokenization.
  - Test mode with sandbox credentials.

## 15. Notifications
**Priority:** P0 – Engagement and reminders.
- **Acceptance Criteria:**
  - Channels: push (FCM/APNs), email (transactional via SES/Mailgun), and in‑app notification centre.
  - Events: booking confirmation, reminder (24h/1h), cancellation, reschedule, review request (after completion), new message from provider, provider announcement.
  - Template management for emails (responsive HTML).
  - User can configure notification preferences per channel (toggle push, email).
  - In‑app notifications stored with read/unread status, grouped by type.
  - Rate limiting to avoid spam.
  - Provider gets notifications for new booking, cancellation, and daily summary.
  - Background jobs dispatch notifications reliably with retry (BullMQ).

## 16. User Profile
**Priority:** P0 – Personalization and account management.
- **Acceptance Criteria:**
  - View/edit: name, profile photo (upload), phone number, email, preferred language (i18n readiness).
  - Saved addresses (one default) for location‑based search.
  - Linked social accounts shown.
  - Change password flow (requires current password).
  - Delete account with confirmation and data wipe (GDPR compliant).
  - Booking history with filter by status.
  - Manage notification settings.
  - Accessibility: screen‑reader‑friendly.

## 17. Provider / Business Owner Portal
**Priority:** P0 – Providers manage their services and appointments.
- **Acceptance Criteria:**
  - Sign‑up onboarding with business details, address, working hours, services (name, duration, price), team members, and bank details for payout (Stripe Connect).
  - Dashboard with daily appointment list, earnings summary, and upcoming bookings.
  - Calendar view (day/week/month) with colour‑coded statuses; click to see details or edit.
  - Staff management: invite staff (email), assign services, set individual availability (if they differ from business hours).
  - Service management: CRUD for services, description, duration, price, buffer time.
  - Availability editor: reusable weekly schedule with per‑date overrides and block times (time‑off).
  - Manual booking creation for walk‑ins.
  - Notification preferences for business.
  - View and respond to reviews.
  - Payout dashboard (balance, transaction history, upcoming payouts).
  - Role‑based access: owner (full access), staff (view appointments, limited edit).
  - Responsive design; web‑first but usable on tablet.

## 18. Admin Dashboard
**Priority:** P1 – Operational and content control.
- **Acceptance Criteria:**
  - Overview of platform metrics: total bookings, revenue, active providers, conversion rate, pending reviews.
  - Provider verification and approval workflow (manual with document upload).
  - Manage categories and service tags (CRUD).
  - Moderate reviews (hide/approve flagged, ban user).
  - View all bookings with filters, ability to cancel/refund.
  - Commission configuration per provider or globally.
  - Content management for featured businesses and promotional banners on homepage.
  - User management: view, suspend, delete.
  - Audit log for critical actions.
  - Access control with admin roles.

## 19. Background Jobs (BullMQ)
**Priority:** P0 – Async processing for reliability.
- **Acceptance Criteria:**
  - BullMQ queue with Redis for job processing.
  - Jobs: send transactional emails (confirmation, reminder, cancellation); push notifications; generate and optimise images; compute review ratings; pre‑generate slot cache; data cleanup (anonymising deleted users after grace period); generate reports.
  - Each job has retry with exponential backoff and dead‑letter queue for failed jobs (alert admins).
  - Scheduled jobs: reminders (cron‑based trigger) query upcoming appointments and enqueue notification jobs.
  - All job processing is idempotent.
  - Dashboard (Bull Board) available for admins in development/staging.
  - Proper logging and monitoring.
