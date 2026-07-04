# Planity Clone Product Specification

**Version:** 1.0  
**Date:** 2025-06-23  
**Author:** Alex, Product Owner  

## 1. Introduction

Planity Clone is a mobile-first appointment booking platform connecting customers with local service businesses (hair salons, spas, barbers, etc.). This specification outlines the complete feature set, acceptance criteria, and priorities for the MVP and subsequent releases.

## 2. User Roles

- **Client (End User):** Seeks and books services.
- **Service Provider (Business Owner):** Manages business profile, services, availability, and appointments.
- **Admin:** Supervises platform operations, content, and disputes.

## 3. Design System & Shared Types

### Priority: P0 (Foundation)

**Description:** Define shared TypeScript types and a consistent UI component library (React Native + styled-components/native-base) to ensure data integrity and visual consistency across all modules.

**Acceptance Criteria:**
- Shared types for `User`, `Business`, `Service`, `Booking`, `Review`, `AvailabilitySlot` defined in a monorepo package.
- Reusable components: Header, Button, Input, Card, Modal, StarRating, EmptyState, LoadingSpinner, ErrorBoundary styled according to brand guidelines.
- All components support dark mode and accessibility (screen reader, minimum touch area).

---

## 4. Feature Specifications

### 4.1 User Authentication

**Priority:** P0 (Must Have)

**Description:** Secure registration and login with email/password and social providers. Session persistence and secure token storage.

**Acceptance Criteria:**
- Users can sign up with email and password; verification email sent.
- Users can log in with email/phone and password; social login (Google, Apple, Facebook).
- Password reset flow with email link.
- JWT-based authentication with refresh token rotation.
- User sees appropriate onboarding screens on first login.
- Error messages for invalid credentials, network failure, and account lockout after 5 failed attempts.
- Biometric authentication (Touch ID / Face ID) option for returning users.
- Logout clears local session and token.
- Guest users can browse without authentication; booking triggers sign-up prompt.

**Dependencies:** Shared types, secure storage.

---

### 4.2 Guest Browse & Explore

**Priority:** P1 (High)

**Description:** Unauthenticated users can explore businesses, services, and read reviews, but cannot book or favorite.

**Acceptance Criteria:**
- Home screen displays featured businesses and categories without sign-in.
- Search and filter businesses, view business details, read reviews.
- Any booking action triggers a modal prompting sign-up/login with a clear value proposition.
- "Favorites" and "Book Now" buttons show lock icon and tooltip when guest.
- Guest session persists basic filter preferences during the session.

---

### 4.3 Business Search & Discovery

**Priority:** P0

**Description:** Powerful search with autocomplete, category filters, location-based sorting, and result ranking.

**Acceptance Criteria:**
- Search bar with autocomplete suggestions (business name, service, category).
- Filters: category (multi-select), price range, rating, distance (if location allowed), availability now/date.
- Sort options: relevance, distance, rating, price low/high.
- Search results show business card with photo, name, rating, distance, primary service, and "Book" button.
- Infinite scroll / pagination (20 items per page).
- Empty state with illustration and suggestion to broaden search.
- Recent searches stored locally for logged-in users.

---

### 4.4 Map-based Search

**Priority:** P2 (Nice to Have)

**Description:** Visual discovery via interactive map showing business locations.

**Acceptance Criteria:**
- Toggle to map view on search results.
- Map displays pins with business name and rating.
- Clustering when zoomed out.
- Tap pin shows mini card with details and “View” action linking to business detail.
- “Search this area” button when moving map.
- Location permission rationale and fallback to manual location entry.

---

### 4.5 Business Detail View

**Priority:** P0

**Description:** Comprehensive business profile with all relevant information, services, reviews, and direct booking entry point.

**Acceptance Criteria:**
- Hero image gallery with swipe, business name, rating (stars + count), address, distance, open/closed status.
- Sticky navigation: Overview, Services, Reviews, Info.
- Overview: description, amenities, working hours (with “open until”), contact options (call, directions, share).
- Services: List of services grouped by category, each with name, duration, price, and “Book” button. Expandable if many.
- Reviews: aggregated rating, rating distribution bar, latest reviews with pagination. “Write a Review” button.
- Favorite toggle (heart icon) with optimistic UI update.
- Back button and share button.
- Loading skeleton while fetching.
- Error state with retry.
- If business is permanently closed, display notice.

---

### 4.6 Service Categories

**Priority:** P0

**Description:** Hierarchical categorization to aid discovery. Top-level categories: Hair, Beauty, Wellness, Fitness, etc. with subcategories.

**Acceptance Criteria:**
- Home screen displays popular categories as tappable cards with icons.
- Category selection navigates to a listing of businesses filtered by that category.
- Admin can manage categories (CRUD).
- Category detail shows subcategories and trending services.
- Businesses can associate themselves with multiple categories.

---

### 4.7 Booking Flow

**Priority:** P0

**Description:** Step-by-step booking wizard: select service, choose provider (optional), pick date/time, add extras, confirm, pay, confirmation.

**Acceptance Criteria:**
- **Service selection:** List of available services for the business. If multiple providers, show provider selection with ability to view provider profiles.
- **Date/Time selection:** Calendar with days that have availability highlighted. Time slots showing start times (based on computed availability). Slots that are booked displayed as unavailable. "Next available" button for convenience.
- **Extras/Add-ons:** Optional checkboxes for additional services (if configured) with prices.
- **Summary:** Order recap (service, date, time, provider, location, price breakdown including taxes/fees).
- **Client info:** Prefilled from profile, ability to book for someone else (name, phone).
- **Payment:** Integrated payment gateway; support for saved cards, Apple Pay, Google Pay. Mandatory field validation.
- **Confirmation:** Success screen with booking details, option to add to calendar, share, or view appointment. Push notification and email sent.
- Entire flow must be smooth, with back navigation preserving state, loading indicators on submission.
- Any failure (payment, slot taken) shows clear error and option to retry or select new slot.
- Double-booking prevention using optimistic lock or transactional slot hold with countdown (e.g., hold slot for 10 minutes while checkout).
- Guest user prompted to sign up before payment, with seamless return to checkout.

---

### 4.8 Appointment Management

**Priority:** P0

**Description:** Central hub for clients to view, modify, and track appointments.

**Acceptance Criteria:**
- Upcoming appointments list with details: business name, service, date/time, status (confirmed, pending, completed, cancelled).
- Tap to view appointment detail: map, add to calendar, contact provider, cancel/reschedule options.
- Reschedule flow reuses booking date/time selection with existing service and provider pre-selected, respecting cancellation policy window.
- Cancellation must respect business policy (e.g., free until 24h before). Show confirmation dialog with policy note.
- Past appointments archive with ability to rebook same service.
- Empty state for no appointments.
- Push notification and email for changes, reminders (24h and 1h before).
- Pull-to-refresh and real-time status updates via WebSocket or polling.

---

### 4.9 Favorites

**Priority:** P1

**Description:** Allow users to bookmark favorite businesses for quick access.

**Acceptance Criteria:**
- Favorite/unfavorite toggle on business cards and detail pages (optimistic update).
- Dedicated Favorites screen listing saved businesses with name, rating, distance, next available slot if any.
- When a business is no longer available, show grayed out with “unavailable” and option to unfavorite.
- Favorites persist across devices (sync with backend).
- Maximum 100 favorites per user (soft limit).

---

### 4.10 User Profile

**Priority:** P1

**Description:** Manage personal information, preferences, payment methods, and notification settings.

**Acceptance Criteria:**
- Edit name, email, phone, profile photo upload.
- Change password with current password verification.
- Manage saved payment methods (add, remove, set default).
- Notification preferences: toggle push and email for appointments, promotions, reminders.
- Link/dismiss social login accounts.
- Account deletion request (soft delete with 30-day grace).
- Booking history export option (CSV).
- App version, terms, privacy links.
- Dark mode toggle.
- Language selection (EN/FR).

---

### 4.11 Availability & Slot Computation

**Priority:** P0

**Description:** Compute bookable time slots based on business working hours, provider schedules, service duration, buffers, and existing bookings.

**Acceptance Criteria:**
- **Working Hours:** Businesses define weekly opening hours with breaks. Support for exceptions (holidays, special days).
- **Provider Assignment:** Each provider can have individual schedules overlapping or overriding business hours.
- **Service Duration:** Slots are generated by dividing available time into increments equal to service duration + buffer (e.g., 30min service + 10min buffer = 40min slots). Start times align to configurable interval (e.g., every 15 min).
- **Slot Calculation:** Endpoint `GET /slots?businessId=&serviceId=&date=&providerId=` returns array of `{ startTime, endTime }` for available slots.
- **Concurrency Booking:** When slot is held for checkout (10min hold), mark as temporarily unavailable for others. If checkout expires or fails, release slot.
- **Double Booking Prevention:** Database unique constraint or application-level locking ensures no two bookings for same resource at overlapping time.
- **Time Zone Awareness:** All times stored in UTC, displayed in business local time. Daylight saving handled.
- **Recurring Availability:** Ability to define weekly recurring templates with effective date ranges.
- **API Performance:** Slot generation must be fast, caching for short period (5 min) to reduce load.

---

### 4.12 Reviews & Ratings

**Priority:** P1

**Description:** Clients can leave reviews and star ratings after completing an appointment to build trust.

**Acceptance Criteria:**
- After appointment completion, user receives prompt to rate and review (in-app and email with deep link).
- Review form: star rating (1-5), optional text (min 10 chars if given), optional photo upload (max 3), anonymous toggle.
- Review submission is moderated for profanity; held for admin approval if flagged.
- Business detail page shows average rating, total reviews, rating distribution. Latest reviews with sorting (most recent, highest, lowest).
- Owner can reply to reviews (only one reply per review) — visible publicly.
- User can edit/delete their own review within 30 days.
- Duplicate review prevention per booking.
- Reviews paginated, lazy loaded.

---

### 4.13 Payment Integration

**Priority:** P0

**Description:** Secure, seamless payments via Stripe or equivalent.

**Acceptance Criteria:**
- Integration with Stripe: Elements for card input, PaymentIntents for SCA compliance.
- Support for AMEX, Visa, Mastercard, and local methods (iDEAL, Bancontact if needed).
- Apple Pay and Google Pay as express checkout.
- Stored payment methods (with option to save card for future) using Stripe Customer and SetupIntents.
- Payment flow: After booking summary, create PaymentIntent with amount (in lowest currency unit) and metadata (booking ID). Confirm on client.
- Handle 3D Secure challenges with modal.
- Invoice/Receipt generated and emailed after successful payment.
- Refund capability for cancellations (via Admin/Provider Portal) with proration rules.
- Payment statuses: pending, succeeded, failed, refunded. Webhook handling for async events (Stripe webhooks to update booking status).
- PCI compliance: no raw card data touches backend.

---

### 4.14 Notifications

**Priority:** P1

**Description:** Transactional and marketing notifications via push and email to keep users engaged and informed.

**Acceptance Criteria:**
- Push notification service (FCM/APNs) and email service (SendGrid/SES).
- Event-driven notifications: booking confirmation, reminder (24h, 1h), cancellation, reschedule, review request, promotional.
- In-app notification bell with list of recent notifications, mark as read, clear.
- Notification preferences: granular toggles for different categories.
- Deep linking: push tap opens relevant screen (booking detail, review form).
- Failed notifications logged and retried via BullMQ background job.
- Admin can send broadcast push/email to segments.
- Providers get notifications for new bookings, cancellations.

---

### 4.15 Provider / Business Owner Portal

**Priority:** P0

**Description:** Dedicated web and mobile interface for business owners to manage their presence, services, staff, availability, and appointments.

**Acceptance Criteria:**
- **Registration/Onboarding:** Provider sign-up flow with business details, address, category selection, document upload for verification (optional). Admin approval step.
- **Dashboard:** Analytics summary (appointments today, revenue, new clients, rating). Charts (bookings over time).
- **Services Management:** CRUD operations for services with name, description, duration, price, category, image, available add-ons. Reorder services.
- **Staff/Provider Management:** Add/edit providers (name, photo, bio, skills). Set their individual schedules and services they perform.
- **Availability Manager:** Interactive weekly calendar to set open hours, breaks, vacation days, special hours. Recurring templates. Real-time preview of generated slots.
- **Appointment Manager:** Calendar view (day, week, month) of bookings. List of upcoming/past appointments with client info. Ability to manually book for walk-in clients, cancel, reschedule, mark as no-show, add internal notes. Check-in functionality.
- **Client Management:** Search clients, view history, notes, block/unblock.
- **Reviews:** Respond to reviews via portal.
- **Notifications:** Real-time alerts for new bookings, cancellations (WebSocket or polling).
- **Settings:** Business profile (photos, description, amenities, social links), notification preferences, business hours exceptions.
- **Multi-Provider Support:** If a business has multiple providers, booking must allow client to select specific provider or “any available”. Provider-specific calendars.

---

### 4.16 Admin Dashboard

**Priority:** P1

**Description:** Web-based admin panel for platform management, moderation, and analytics.

**Acceptance Criteria:**
- **Super Admin Authentication:** Secure login with role-based access control.
- **Dashboard Overview:** Key metrics (total users, businesses, bookings, revenue, commission). Graphs.
- **Business Management:** List all businesses with filters. Approve/reject business registrations. Suspend/activate businesses. Edit business details.
- **User Management:** List clients, search, view details, suspend/ban.
- **Booking Oversight:** View all bookings, filter, handle disputes, manual refunds.
- **Category Management:** CRUD for service categories and subcategories.
- **Review Moderation:** Queue of flagged reviews; approve/reject. Ability to remove reviews.
- **Commission & Fees:** Configure platform commission percentage, per transaction or subscription. View revenue reports.
- **Promotions Management:** Create promo codes and campaigns.
- **Notification Broadcast:** Compose and send push/email to all or segment.
- **System Logs:** View background job status, errors.
- **Role Management:** Create admin roles with granular permissions.

---

### 4.17 Background Jobs (BullMQ)

**Priority:** P0

**Description:** Asynchronous task processing for reliable, scalable execution of non-critical operations.

**Acceptance Criteria:**
- Queue setup with Redis-backed BullMQ for: `reminders`, `notifications`, `booking-expiry`, `data-export`, `image-optimization`, `review-moderation`.
- **Reminder jobs:** Scheduled job enqueued at booking creation to fire 24h and 1h before appointment. Must handle delay and retry on failure.
- **Booking hold expiry:** When booking slot is held, schedule job to release hold after 10 min if not confirmed.
- **Email/SMS sending:** All notification dispatch via jobs to decouple from HTTP request.
- **Review request:** Enqueue job after appointment end + 2 hours to send review prompt.
- **Data export:** CSV generation for admin reports; job processes and stores file, then emails link.
- **Failed job retry:** Configured retry backoff, dead letter queue, alerting on repeated failures.
- **Monitoring:** Bull Board UI accessible to admins for monitoring queues.

---

## 5. Non-Functional Requirements

- **Performance:** App screens load within 2 seconds on average network. Slot computation API < 500ms.
- **Scalability:** Backend stateless, database read replicas for search.
- **Security:** HTTPS, input sanitization, rate limiting, JWT with short expiry.
- **Accessibility:** WCAG 2.1 AA, support for screen readers, proper color contrast.
- **Localization:** French and English initially; UI strings externalized for future i18n.
- **Analytics:** Track user actions (search, booking, etc.) via Amplitude/Mixpanel.

## 6. Priorities Summary

| Priority | Features |
|----------|----------|
| P0 (Must Have) | Authentication, Business Search, Business Detail, Service Categories, Booking Flow, Appointment Management, Availability & Slot Computation, Payment Integration, Provider Portal, Background Jobs, Design System |
| P1 (Should Have) | Guest Browse, Favorites, User Profile, Reviews & Ratings, Notifications, Admin Dashboard |
| P2 (Nice to Have) | Map-based Search, Advanced analytics, multilingual support, social sharing |
