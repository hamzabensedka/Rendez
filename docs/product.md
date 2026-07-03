# Product Specification: Planity Clone

## 1. Introduction & Goals

Planity Clone is a booking platform connecting customers with service providers (salons, spas, barbers, etc.). The product allows users to discover businesses, book appointments, manage appointments, leave reviews, and pay securely. Providers can manage their business, services, staff, and schedule. Admins oversee platform health.

**Objectives:**
- Intuitive search and booking flow (3 taps from explore to booked).
- Real-time availability based on provider schedule, staff, and service duration.
- Multi-platform: Web (responsive) and native mobile (iOS/Android) using shared components.
- Scalable background processing (BullMQ).

## 2. Shared Types & Design System (P0)

All features rely on a shared design token system and type definitions for consistency across frontend and backend.

- **Design System:** Typography, color palette, spacing, shadows, icon set, button variants, input fields, card components, modal sheets, toast notifications, loading states. Responsive breakpoints: mobile (360-768px), tablet (768-1024px), desktop (1024+).
- **Shared Types:** Define TypeScript interfaces/type aliases for User, Business, Service, Staff, Appointment, Review, Slot, etc. Used in API contracts and frontend.
  - Example: `interface TimeSlot { start: string; end: string; }`
  - All date/time in ISO 8601 with timezone offset.
- **Acceptance Criteria:**
  1. All UI components are built from design system; no one-off styles.
  2. Type definitions are in a shared package and versioned.
  3. API responses conform to the shared types.
  4. Design system tokens are accessible as CSS custom properties and React Native StyleSheet values.

## 3. User Authentication (P0)

Seamless sign-up/login via email/password, social providers, and phone.

- **Registration:** Email + password (with strength meter), Google, Apple, Facebook. Phone number with OTP verification (optional for initial MVP).
- **Login:** Same methods. Session management via JWT (access + refresh tokens).
- **Password Reset:** “Forgot password” flow with email link.
- **Guest Mode:** Users can browse without account but must authenticate to book.
- **Acceptance Criteria:**
  1. User can register with email and password; verification email sent.
  2. User can log in with Google via OAuth2 (mobile and web).
  3. Invalid credentials show clear error message, no system leaks.
  4. Token refresh silently before expiry (interceptor).
  5. Logout clears session and redirects to home.
  6. Guest users can view businesses but booking triggers login/sign-up modal.

## 4. Guest Browse & Explore (P1)

Non-authenticated users can explore the platform, view businesses, read reviews, but cannot book or favorite.

- **Home Screen:** Curated featured businesses, popular categories, near me section (with location permission). Search bar prominent.
- **Limitations:** No booking, no favorites, no access to appointment management.
- **Acceptance Criteria:**
  1. Guest sees the same home screen as logged-in user minus personal sections.
  2. Tapping “Book” or “Add to favorites” prompts login/sign-up modal.
  3. Location-based “Near Me” works with geolocation permission (graceful fallback).
  4. No session data persisted after closing tab (guest state is ephemeral).

## 5. Business Search & Discovery (P0)

Users can search for businesses by name, service, keywords, location.

- **Search Bar:** Autocomplete suggestions (business names, services, categories).
- **Filters:** Category (hair, nails, spa, etc.), price range, rating, availability (date/time), distance.
- **Sorting:** Relevance, rating, distance, price low-high.
- **Results Display:** Card list with image, name, rating, distance, price level, next available slot.
- **Acceptance Criteria:**
  1. Search returns results as user types (debounced 300ms).
  2. Filters auto-apply when changed; results update without full page reload.
  3. No results shows a friendly empty state with suggestions.
  4. Sorting options persist in URL query params (web) or navigation state (mobile).
  5. Search works for partial words and spelling mistakes (typo tolerance via Elasticsearch fuzzy search).

## 6. Map-based Search (P1)

Interactive map view for discovering businesses visually.

- **Map Component:** Show business pins. Clustering for dense areas. Tapping a pin reveals a mini card with name, rating, next slot, and a “View” button.
- **Search Integration:** Map updates viewport as user moves. Results list below map (split view on desktop, toggle on mobile).
- **Filters:** Same filter set applies to map results.
- **Acceptance Criteria:**
  1. Map loads within 3 seconds on 4G connection.
  2. Pins cluster when zoomed out, decluster when zoomed in.
  3. Tap on pin shows callout with essential info; tap “View” navigates to business detail.
  4. Map respects search and filter parameters.
  5. Map bounds accurately query backend for visible businesses.

## 7. Business Detail View (P0)

Comprehensive page/screen for a single business.

- **Information:** Gallery, name, rating, review count, address, opening hours, description, amenities.
- **Service Listing:** Grouped by category, with name, duration, price. “Book” button next to each.
- **Staff List:** Avatar, name, specialization, rating. Option to choose specific staff during booking.
- **Reviews Section:** Paginated reviews, summary stats (average rating, distribution). “Write a Review” button (after appointment).
- **Call to Action:** Primary “Book Appointment” floating button. Secondary: favorite, share.
- **Acceptance Criteria:**
  1. All information is loaded within 2 seconds of navigation.
  2. Business hours displayed in user’s timezone.
  3. Service list is accurate and reflects real-time availability (if date selected).
  4. Photos in gallery zoomable (lightbox on web, pinch-zoom on mobile).
  5. Clicking “Book” on a service opens booking flow with pre-selected service.
  6. Reviews are load-more paginated, newest first.

## 8. Service Categories (P1)

Browse by predefined service categories and subcategories.

- **Categories:** Hair, Nails, Spa, Barbershop, Skin Care, Massage, Makeup, Eyelashes, Tattoo, Piercing, etc. Admin can manage.
- **Category Page:** Hero image, description, top-rated businesses, popular services, link to filter search.
- **Acceptance Criteria:**
  1. Homepage displays category icons as a horizontal scrollable list.
  2. Each category page loads dynamically based on slug.
  3. Subcategories available as chips/filters (e.g., Hair > Coloring, Hair > Cut).
  4. Category filter syncs with search and map.

## 9. Booking Flow (P0)

Core user journey from service selection to confirmation.

**Step 1: Service & Staff Selection**
- Pre-select service from business page. User can change.
- Optionally choose specific staff member (if not, system assigns any available).
- See service duration and price.

**Step 2: Date & Time**
- Calendar view showing unavailable dates greyed out.
- Time slots generated from provider availability, existing bookings, staff schedule, buffer times, and service duration.
- Slots grouped logically (morning, afternoon, evening).

**Step 3: User Details**
- Pre-filled from profile if logged in. First name, last name, phone, email, optional notes.
- Guest: form to capture same details + auto account creation prompt post-booking.

**Step 4: Review & Pay**
- Summary: business, service, staff, date, time, price, estimated duration.
- Apply promo code (if any).
- Choose payment method (card, Apple Pay, Google Pay). Secure payment via Stripe.
- Cancellation policy summary.

**Step 5: Confirmation**
- Success screen with booking reference, add to calendar option.
- Option to favorite business.
- Trigger notification and email.

- **Acceptance Criteria:**
  1. Booking flow is a modal or step screen with back navigation; no data lost on back.
  2. Time slots reflect real-time availability; impossible to double-book.
  3. If staff is “any”, system picks a random available staff at slot creation.
  4. Payment is handled via Stripe Elements (web) / Stripe React Native SDK; PCI compliant.
  5. Booking confirmation persists an appointment with status “confirmed”.
  6. If payment fails, appointment is not created; user sees clear error.
  7. Unavailable dates are visually distinct and not selectable.
  8. Buffer times (before/after appointments) are respected when computing slots.

## 10. Appointment Management (P0)

Users can view, reschedule, or cancel upcoming appointments.

- **Appointments List:** Upcoming and past tabs. Each item shows business, service, date/time, staff, status (confirmed, completed, cancelled, no-show).
- **Reschedule:** Flow similar to booking but only date/time/staff (service fixed). Must respect cancellation policy (e.g., 24h in advance).
- **Cancel:** Confirmation dialog, possible cancellation fee (based on business policy).
- **Past Appointments:** Allow booking again with one tap, leave review.

- **Acceptance Criteria:**
  1. Upcoming appointments sorted by date ascending.
  2. Reschedule uses same slot computation, leaves original slot free.
  3. Cancellation respects business policy: if within free cancellation window, no charge; else fee applied.
  4. Cancelled appointments move to past tab with “cancelled” status.
  5. “Book Again” creates a new booking with same business/service but fresh date selection.
  6. Users can add appointment to device calendar (single tap).

## 11. Favorites (P1)

Users can save businesses to favorites for quick access.

- **Add/Remove:** Heart icon on business cards and detail page. Instant toggle with haptic feedback (mobile).
- **Favorites List:** Dedicated screen, sorted by recently added or distance.
- **Acceptance Criteria:**
  1. Adding/removing works without page refresh (optimistic UI).
  2. Syncs across devices if logged in.
  3. Guest prompted to login when attempting to favorite.
  4. Favorites list shows business card with next available slot.

## 12. User Profile (P0)

Manage account details, preferences, payment methods, notification settings.

- **Profile Info:** Avatar, name, email, phone.
- **Saved Payment Methods:** Add/remove cards via Stripe.
- **Notification Preferences:** Email, push (appointment reminders, promotions).
- **Appointment History** (link to Appointment Management).
- **Delete Account:** GDPR compliant.

- **Acceptance Criteria:**
  1. Profile photo upload with crop/resize.
  2. Updating email triggers verification.
  3. Adding a card uses Stripe SetupIntent; store token, never raw card details.
  4. Notification toggles take effect immediately.
  5. Account deletion soft-deletes data and anonymizes review content after 30 days grace period.

## 13. Availability & Slot Computation (P0)

The engine that determines bookable time slots.

- **Inputs:** Business working hours, staff working schedules (overrides per day), service duration, existing bookings (including buffer time before/after), staff vacations/breaks, date range.
- **Algorithm:** Generate slots starting from opening time, incrementing by slot interval (e.g., 15 min), check if staff is free from start to start+duration+post-buffer. Must consider multi-service bookings (if booking multiple services, sum durations).
- **API Endpoint:** `GET /businesses/:id/slots?serviceId=&staffId=&date=` returns available start times.
- **Real-time:** Slots recalibrate based on concurrent booking attempts (pessimistic/optimistic locking).
- **Acceptance Criteria:**
  1. Slots never overlap for the same staff.
  2. Buffer time (pre/post) is excluded from adjacent bookings.
  3. If no staff specified, return union of slots where at least one staff is free.
  4. Slot endpoint responds under 200ms for a given date.
  5. Handles timezone: business timezone converts to UTC for storage, returned in UTC, displayed in user local time.
  6. Service with custom duration overrides default.
  7. If staff has a break from 12:00-13:00, no slots that would collide are generated.

## 14. Reviews & Ratings (P1)

Users can rate and review businesses after a completed appointment.

- **Write Review:** Star rating (1-5), text (min 10 chars), optional photo upload. Only available after appointment status “completed”.
- **Display:** Average rating, distribution histogram, review list with infinite scroll. Sort by recent, highest, lowest.
- **Business Response:** Owner can reply to reviews (Provider Portal).
- **Moderation:** Admin can hide inappropriate reviews.

- **Acceptance Criteria:**
  1. User can write a review for a past completed appointment only once.
  2. Review appears immediately after submission; average rating updates.
  3. Photos are moderated (can be flagged) and stored in CDN.
  4. Business owner can see all reviews and reply; reply shown indented.
  5. Users can report a review; admin reviews reports.

## 15. Payment Integration (P0)

Secure payment processing and wallet.

- **Integration:** Stripe Connect for marketplace (platform fee). Platform collects payment, transfers to provider minus commission.
- **Checkout:** Elements (web) / React Native SDK. Supports card, Apple Pay, Google Pay. Holds 3DS if required.
- **Post-booking:** Payment is captured upon confirmation. For cancellation with fee, partial refund.
- **Provider Payouts:** Weekly/daily payouts via Stripe Connect (handled in Provider Portal/Admin).
- **Acceptance Criteria:**
  1. Card details never touch our servers; tokenization via Stripe.
  2. Payment succeeds/fails with clear error (insufficient funds, 3DS required).
  3. Successful payment creates a payment record linked to appointment.
  4. Amount matches service price + extras.
  5. Refund for cancellation computed and processed correctly.
  6. Apple Pay/Google Pay work on supported devices.

## 16. Notifications (P0)

Transactional and marketing notifications via push (mobile) and email.

- **Transactional:** Booking confirmation, reminder (24h before), reschedule confirmation, cancellation, review request after service, payment receipt.
- **Marketing:** Promotions, new business in area (opt-in).
- **In-App:** Toast notifications for real-time updates (e.g., “Booking confirmed”).
- **Infrastructure:** Firebase Cloud Messaging (FCM) for push, email service (SendGrid).
- **Acceptance Criteria:**
  1. Booking confirmation push/email sent within 5 seconds of confirmation.
  2. Reminder sent exactly 24h before appointment timezone-correct.
  3. Opt-out respected: no marketing if disabled.
  4. In-app toast appears without disrupting current flow.
  5. Failed deliveries logged and retried.

## 17. Provider / Business Owner Portal (P1)

Web-based dashboard for businesses to manage their profile, services, staff, schedule, and bookings.

- **Registration/Onboarding:** Business sign-up with details, verification (admin approves).
- **Dashboard:** Overview (today’s appointments, revenue, new reviews).
- **Service Management:** CRUD services with name, duration, price, category, description.
- **Staff Management:** Invite staff (they create an account with staff role), set working hours, assign services they can perform.
- **Schedule/Calendar:** View daily/weekly appointments, manual block-off time, reschedule or cancel on behalf of client.
- **Profile:** Edit business info, photos, opening hours (regular + special days).
- **Reviews:** View and reply.
- **Settings:** Payment account (Stripe Connect onboarding), cancellation policy, buffer time, slot interval, notification preferences.

- **Acceptance Criteria:**
  1. Owner can add a service with custom duration and price; it reflects instantly.
  2. Staff working hours can be set per weekday; changes affect future slot generation.
  3. Calendar view shows color-coded appointments (confirmed, completed) with client name.
  4. Owner can cancel an appointment with a reason; client receives notification.
  5. Stripe Connect onboarding flow integrated; owner cannot receive bookings until KYC verified.
  6. Business appears in search only after admin approval and owner verifying profile completeness.

## 18. Admin Dashboard (P2)

Super admin panel for platform management.

- **Business Approval:** Queue of pending businesses; approve/reject with reason.
- **User Management:** View/search users, deactivate accounts, view history.
- **Appointment Oversight:** View all appointments, intervene in disputes.
- **Reviews Moderation:** Flagged reviews queue, hide/unhide.
- **Analytics:** Total bookings, revenue, commission, user growth, business growth charts.
- **Configuration:** Manage categories, service tax, commission percentage, platform fee, cancellation policy defaults.
- **Acceptance Criteria:**
  1. Admin can filter and approve/reject businesses in bulk.
  2. Search users by email or name; see booking history.
  3. Revenue dashboard shows platform commission per day/month.
  4. Admin can change commission rate, and new bookings use updated rate.
  5. Moderation actions are logged.

## 19. Background Jobs (BullMQ) (P0)

Asynchronous tasks for performance and reliability.

- **Job Types:**
  - `send-notification`: Dispatch push/email (with retry).
  - `schedule-reminders`: cron job to query upcoming appointments in 24h window and queue reminders.
  - `process-payment`: handle payment capture and payout scheduling.
  - `generate-slots-cache`: precompute slot availability for next 30 days per business/staff (caching).
  - `cleanup-expired`: cancel pending bookings after 15 min no payment.
  - `compute-ratings`: update average rating asynchronously when new review added.
- **Reliability:** Redis-backed BullMQ with retry (exponential backoff), dead letter queue for failed jobs.
- **Acceptance Criteria:**
  1. Reminder job queue runs every hour, picks appointments starting in 24h ± 10 min window.
  2. Failed notification jobs retry up to 3 times, then go to dead-letter for manual inspection.
  3. Payment processing is idempotent; duplicate events don’t double charge.
  4. Slot cache regeneration is triggered when a booking is made/cancelled for affected date range.
  5. Expired bookings released slots immediately.

## 20. Priorities Summary

| Feature | Priority |
|---|---|
| Shared Types & Design System | P0 (Must have) |
| User Authentication | P0 |
| Guest Browse & Explore | P1 (Should have) |
| Business Search & Discovery | P0 |
| Map-based Search | P1 |
| Business Detail View | P0 |
| Service Categories | P1 |
| Booking Flow | P0 |
| Appointment Management | P0 |
| Favorites | P1 |
| User Profile | P0 |
| Availability & Slot Computation | P0 |
| Reviews & Ratings | P1 |
| Payment Integration | P0 |
| Notifications | P0 |
| Provider Portal | P1 |
| Admin Dashboard | P2 (Could have) |
| Background Jobs (BullMQ) | P0 |

