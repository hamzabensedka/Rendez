# Planity Clone Product Specification

**Author:** Alex, Product Owner  
**Version:** 1.0  
**Date:** 2025-04-08

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [User Roles & Personas](#user-roles--personas)
3. [Shared Types & Design System](#shared-types--design-system)
4. [Feature Specifications](#feature-specifications)
    - [1. User Authentication](#1-user-authentication)
    - [2. Guest Browse & Explore](#2-guest-browse--explore)
    - [3. Business Search & Discovery](#3-business-search--discovery)
    - [4. Map-based Search](#4-map-based-search)
    - [5. Business Detail View](#5-business-detail-view)
    - [6. Service Categories](#6-service-categories)
    - [7. Booking Flow](#7-booking-flow)
    - [8. Availability & Slot Computation](#8-availability--slot-computation)
    - [9. Appointment Management](#9-appointment-management)
    - [10. Favorites](#10-favorites)
    - [11. User Profile](#11-user-profile)
    - [12. Reviews & Ratings](#12-reviews--ratings)
    - [13. Payment Integration](#13-payment-integration)
    - [14. Notifications](#14-notifications)
    - [15. Provider / Business Owner Portal](#15-provider--business-owner-portal)
    - [16. Admin Dashboard](#16-admin-dashboard)
    - [17. Background Jobs (BullMQ)](#17-background-jobs-bullmq)
5. [Non-Functional Requirements](#non-functional-requirements)

---

## Project Overview

Planity Clone is a mobile-first appointment booking platform connecting customers with beauty & wellness professionals. The application allows guests to explore businesses, search by location, book services, manage appointments, and leave reviews. Business owners manage their profiles, services, staff availability, and bookings through a dedicated portal. Administrators oversee the platform via an admin dashboard. All asynchronous operations (notifications, payment confirmations, schedule sync) are handled by background jobs using BullMQ.

**Business Goals:**
- Onboard 500 providers within 3 months post-launch.
- Achieve 30% month-over-month booking growth.
- Reduce no-shows by 25% through automated reminders.
- Maintain a customer satisfaction score (CSAT) ≥ 4.5/5.

---

## User Roles & Personas

1. **Guest:** Unauthenticated user who can browse, search, view business details, but cannot book or leave reviews.
2. **Customer (Authenticated User):** Can do everything a guest can, plus book appointments, manage bookings, write reviews, save favorites, and manage profile/payment methods.
3. **Provider (Business Owner):** Manages business profile, services, staff, availability, bookings, and accesses a simplified calendar view.
4. **Admin:** Full platform control, user/provider management, analytics, and moderation.

---

## Shared Types & Design System

**Priority:** P0 (foundational)

### Description
All features must adhere to a unified design system and shared TypeScript types to ensure consistency across web and mobile (iOS/Android).

### Acceptance Criteria

- A centralized theme (colors, typography, spacing) is defined and exported as a shareable module (e.g., `@planity/theme`).
- Core domain types (`Business`, `Service`, `Appointment`, `User`, `Review`, `TimeSlot`, etc.) are defined in a shared `@planity/types` package.
- All digital components (buttons, inputs, cards, modals) use the theme and reflect 3 states: default, hover/press, loading, disabled, error.
- Design assets (icons, images) follow a naming convention and are accessible via CDN or asset module.
- Mobile components must pass minimum touch target size (44pt) and contrast ratio (4.5:1) for accessibility.

---

## Feature Specifications

### 1. User Authentication

**Priority:** P0 (must-have)

**Description**  
Provide secure registration and login for customers and providers. Separate flows for sign-up, social login, and password recovery.

**Core Flows**
- Email/password registration with validation.
- Social login (Google, Apple) with OAuth 2.0.
- SMS OTP for phone verification (optional but configurable).
- Forgot/reset password via email link.
- Session management with JWT (access + refresh tokens).
- Role-based redirection after login (customer → explore, provider → provider portal).

**Acceptance Criteria**

- **Sign Up:** Given a new user, when they enter email, password, and confirm password meeting complexity rules (min 8 chars, 1 uppercase, 1 number), then an account is created and verification email sent. Account must be verified before first booking.
- **Social Login:** Given a user with a Google/Apple account, when they choose social login, then a new account is created or existing account linked, and user is authenticated without extra steps.
- **Invalid Credentials:** Given invalid email/password, when attempting login, then error message "Invalid email or password" is displayed; account locked after 5 consecutive failures for 15 minutes.
- **Session Persistence:** Given a logged-in user, when they close and reopen the app within 7 days, then they remain authenticated without re-entering credentials.
- **Logout:** Given a logged-in user, when they tap logout, then session tokens are revoked and they are redirected to the guest explore screen.
- **Role Separation:** Given a user with only customer role, when they try to access provider portal URL, then they receive a 403 error and are redirected to home.

---

### 2. Guest Browse & Explore

**Priority:** P0 (must-have)

**Description**  
Allow unauthenticated users to browse businesses and services, viewing details, availability, and reviews, but prompting registration when attempting to book.

**Acceptance Criteria**
- Given a guest, when they land on the app, then a curated list of trending businesses and categories is displayed (default location or "All cities").
- Given a guest viewing a business detail, when they tap "Book", then a login/register modal appears with social login options; after successful authentication, they continue to the booking flow at the same step.
- Given a guest, when they search or filter, then results are shown normally, but any attempt to save a favorite or write a review triggers the authentication gate.
- Given a guest who has already registered (session exists), they are treated as authenticated without showing booking gates.

---

### 3. Business Search & Discovery

**Priority:** P1 (high)

**Description**  
Full-text search across business name, service name, and description. Filter by category, rating, price range, location, and availability.

**Acceptance Criteria**
- **Instant Search:** As a user types, suggestions appear after 3 characters with debounce (300ms). Results show business name, category, main photo, rating, and next available slot.
- **Filtering:** Filters for Category (multi-select), Rating (≥4, ≥3, etc.), Price (€, €€, €€€), Location (city, distance radius), and "Open Now" toggle. Filters sync with URL query params.
- **Sorting:** Default sort by relevance (text match). Additional options: Top Rated, Nearest, Price Low→High, Availability Soonest.
- **Empty State:** When no results match, display "No businesses found. Try adjusting your filters." with a clear filters button and option to expand search radius.
- **Pagination:** Infinite scroll loading next 20 results; skeleton loaders during fetch.

---

### 4. Map-based Search

**Priority:** P1 (high)

**Description**  
Interactive map view (MapLibre or Google Maps) where users can pan/zoom to discover businesses. List view toggles with map view seamlessly.

**Acceptance Criteria**
- Given the user switches to map view, then business pins appear for the visible region (clustering when zoomed out).
- Tapping a pin shows a mini card with business name, rating, and next available time.
- Tapping the mini card navigates to business detail.
- Map and list views share the same filters/search query. When filters change, map pins update.
- "Search this area" button appears after map pan to reload results.
- Current location button centers map on user (requires permission). If denied, fallback to default city or manual entry.

---

### 5. Business Detail View

**Priority:** P0 (must-have)

**Description**  
Comprehensive business profile displaying photos, description, services, staff (if assignments enabled), reviews, and a prominent "Book" CTA.

**Acceptance Criteria**
- Header with cover photo gallery (swipeable), business name, category tags, average rating (stars + number of reviews), address, and distance.
- "About" section with description, amenities (wifi, parking), and business hours.
- Services tab: list of services with name, duration, price, and "Book" button. Tapping opens booking flow.
- Staff tab (if provider enabled): list of staff members with photo, specializations, and direct booking to that staff.
- Reviews tab: summary rating distribution, paginated review list (latest first) with ability to sort by recent/helpful.
- Sticky bottom CTA: "Book Appointment" that starts the booking flow for the business's first service by default, or a chosen service if selected.
- Deep linking: business detail screen should be shareable via a unique URL (e.g., `planity://business/{id}`).

---

### 6. Service Categories

**Priority:** P1 (high)

**Description**  
Hierarchical service categories for navigation and filtering (e.g., Hair > Haircut, Coloring). Admins manage categories; providers tag their services.

**Acceptance Criteria**
- Home screen shows top-level categories (Hair, Nails, Massage, Facial, etc.) as horizontally scrollable chips with icons.
- Tapping a category navigates to a subcategory list or directly to a filtered search result if leaf node.
- Admin can create/update/delete categories in admin dashboard; changes reflect instantly for users.
- Category detail page shows top businesses in that category, trending services, and filter chips.
- Multi-category filtering is supported in search.

---

### 7. Booking Flow

**Priority:** P0 (must-have)

**Description**  
Step-by-step booking: service selection, staff selection (optional), date/time slot, confirmation, and success. Must handle edge cases like overlapping appointments, buffer times, and cut-off times.

**Steps**
1. **Service**: Select a service (and optionally staff if staff-based).
2. **Date**: Choose a date from a calendar highlight available days.
3. **Time**: See available slots computed based on provider availability, buffer, and existing bookings.
4. **Details**: Review service, staff, date, time, price, duration. Enter any special notes/requests.
5. **Payment**: If service requires prepayment, capture payment. Otherwise proceed.
6. **Confirmation**: Booking confirmed with summary and option to add to calendar.

**Acceptance Criteria**
- Given a user selects a service, when they proceed, then only available dates (based on provider schedule and blackout dates) are selectable.
- Given a chosen date, when available slots load, then they reflect real-time availability, excluding already booked slots and considering service duration and buffer.
- Given a user attempts to book a slot that becomes unavailable during the session (concurrent booking), then they see a "Slot just taken" error and are prompted to select a new time (quick refresh).
- Given the booking flow is incomplete, when user goes back/forth, then selected data (service, date) is preserved unless explicitly changed.
- Given a successful booking, an appointment is created with status "confirmed" (or "pending" if requires provider confirmation).
- Booking completion triggers: confirmation notification (in-app, push if enabled, email), calendar invite (optional), and immediate update to both customer and provider dashboards.
- Booking flow must be completed within 10 minutes of slot selection; otherwise session expires and slot is released.

---

### 8. Availability & Slot Computation

**Priority:** P0 (critical backend)

**Description**  
Real-time computation of available time slots based on business hours, staff schedules, service durations, buffer times, existing appointments, and unavailability periods.

**Constraints**
- Business level settings: opening/closing hours per day, holidays/blackouts.
- Staff level: individual working hours, days off, break times, and max concurrent appointments.
- Service: fixed duration, cleanup/buffer after service (configurable).
- Multi-staff scenarios: If staff selection is optional, system checks availability across all staff that can perform the service and suggests first available or user-preferred staff.

**Acceptance Criteria**
- Given a service of 60min and buffer of 10min, when computing slots, then no slot starts within 70min of a prior booking's start for the same staff.
- Given a staff working 9:00-17:00 with lunch break 12:00-13:00, slots must skip 12:00-13:00.
- Given a date with a provider holiday, no slots are returned for that date.
- Slot computation must handle timezone conversion from provider's timezone to user's device timezone for display.
- API response for available slots must be cached with TTL of 30 seconds to avoid overload; real-time double-check on booking submission to avoid conflicts.

---

### 9. Appointment Management

**Priority:** P0 (must-have)

**Description**  
Customers can view upcoming and past appointments, reschedule, cancel, and rebook. Providers manage their side via provider portal.

**Customer Appointments**
- List with sections "Upcoming" and "History". Upcoming sorted by date ascending.
- Status badges: Confirmed, Pending, Rescheduled, Cancelled, No-show.
- Actions: Reschedule (opens modified booking flow with current data), Cancel (with reason popup), Add to calendar, Get directions.
- Cancellation policy: Free up to X hours before (defined by provider). If within the window, charge cancellation fee (configurable).
- Reschedule: Same steps but pre-selected service, staff, and current date; user picks new date/time. Old slot released.
- Rebook: Quick rebook button on past appointments to start booking flow with same business/service.

**Acceptance Criteria**
- Given a confirmed appointment, when the user cancels >24h before, then cancellation is free and status becomes "Cancelled".
- Given cancellation <24h before, if provider policy charges 50%, then user sees a confirmation modal stating the fee and, upon confirmation, the appointment is cancelled and fee charged.
- Reschedule updates the appointment ID (or creates new, cancels old) and sends notification to provider.
- Both customer and provider see real-time status changes.
- Appointments older than 30 days automatically move to "Past" history.

---

### 10. Favorites

**Priority:** P1 (high)

**Description**  
Authenticated customers can save businesses to a favorites list for quick access and notifications about promotions (future).

**Acceptance Criteria**
- Heart icon on business cards and detail screens toggles favorite status.
- When a guest taps favorite, show login gate; after login, business is added.
- Favorites list screen: grid/list of saved businesses sorted by recently added, with option to remove (swipe or tap). Each card links to business detail.
- Favorites synced across devices via backend.
- (Future) Push notification when favorited business adds a new service or promotion, respecting notification settings.

---

### 11. User Profile

**Priority:** P1 (high)

**Description**  
Manage personal information, payment methods, notification preferences, and account settings.

**Acceptance Criteria**
- Display and edit: full name, email (verify new email), phone number, profile photo (upload/camera).
- Manage saved payment methods: view masked card details, add new card (via Stripe Elements), delete.
- Notification toggles: push notifications (global on/off), email reminders, marketing emails.
- Appointment history accessible from profile.
- Delete account option with confirmation and data removal warning (GDPR).
- Change password flow: current password, new password (with criteria), confirm.

---

### 12. Reviews & Ratings

**Priority:** P1 (high)

**Description**  
Customers can leave star ratings (1-5) and written reviews for businesses after a completed appointment. Moderation by admin.

**Acceptance Criteria**
- After an appointment ends, a prompt appears (in-app and push notification) asking to rate the experience within 7 days.
- Rating screen: tap stars (1-5), optional text review (min 10 chars, max 500), option to add photos.
- Submitted reviews show "pending approval" if moderation is enabled; otherwise published immediately.
- Business detail shows average rating, total reviews, and recent reviews.
- Reviews can be sorted by most recent or most helpful. Users can mark reviews as helpful (one per user per review).
- Provider cannot delete reviews but can report them. Admin reviews reports and can remove inappropriate content.
- Editing: user can edit their own review once within 30 days of posting.

---

### 13. Payment Integration

**Priority:** P0 (must-have)

**Description**  
Secure payment processing via Stripe for prepaid bookings, cancellation fees, and no-show charges. Support saved cards and multiple currencies. Payouts to providers handled (future phase).

**Acceptance Criteria**
- Integration with Stripe Payment Intents and Setup Intents for saving cards during booking without charging immediately.
- Flow: user enters card details (Stripe Elements) or selects saved card > backend creates a Payment Intent for the service amount > holds card. On booking confirmation, capture payment. On cancellation (if free), void hold. On cancellation with fee, capture partial amount.
- If prepayment is not required, charge only cancellation/no-show fees.
- Support 3D Secure (SCA) for European cards.
- Payment history: user can view invoices/receipts in profile.
- Refund handling: admin can issue full/partial refunds from admin dashboard (via Stripe).
- PCI compliance: no raw card data touches our servers; all handled by Stripe SDK/Elements.

---

### 14. Notifications

**Priority:** P1 (high)

**Description**  
Multi-channel notifications (push, in-app, email) for booking confirmations, reminders, cancellations, rescheduling, and promotions, driven by events.

**Acceptance Criteria**
- **Booking Confirmed:** Customer and provider receive push (if enabled), in-app notification, and email with appointment details.
- **Reminder:** 24h and 1h before appointment, push notification sent to customer (deep links to appointment detail).
- **Cancellation/Reschedule:** Both parties notified immediately.
- **Review Request:** After appointment completed, push/email sent (configurable delay, e.g., 2 hours).
- In-app notification center: list of recent notifications with read/unread state, tap to navigate to relevant screen.
- Notification preferences respected; users can opt-out per channel.
- Provider notifications for new bookings, cancellations, and when a customer leaves a review.
- Admin notifications for flagged reviews, user reports, and system alerts (optional).

---

### 15. Provider / Business Owner Portal

**Priority:** P0 (must-have for supply side)

**Description**  
A dedicated web portal (responsive) for providers to manage their business, services, staff, availability, and bookings. Distinct from the customer mobile app but shared backend.

**Core Modules**

1. **Dashboard**  
   - Today’s schedule, key metrics (bookings count, revenue, no-shows).
   - Quick actions: add new appointment, block time.

2. **Business Profile**  
   - Edit name, description, photos (gallery), address, phone, website, amenities, business hours.
   - Set cancellation policy (free until X hours, fee percentage).
   - Enable/disable staff-based booking.

3. **Services Management**  
   - CRUD services: name, category (selection from predefined), description, duration, price, color code, prepayment requirement (yes/no).
   - Reorder services.

4. **Staff Management**  
   - Add staff members with name, photo, specialties, email (for login).
   - Set individual working hours per day (overrides business hours), breaks, days off.
   - Assign services to staff (which services they can perform).

5. **Calendar & Bookings**  
   - Month/week/day view with color-coded appointments per staff or service.
   - Ability to create manual bookings (walk-in), block time (personal unavailability), cancel/reschedule bookings.
   - View customer details (name, phone) for booked appointments.

6. **Reviews**  
   - List of reviews with star rating and text; ability to reply (publicly) or report.

**Acceptance Criteria**
- Provider sign-up: after account creation, provider onboards by filling business profile and at least one service before going live.
- All changes to services, staff, or hours reflect instantly on customer side.
- Calendar view supports real-time updates (WebSocket or polling).
- Provider can filter bookings by staff, service, date range.
- Provider actions on a booking (cancel, reschedule) send appropriate notifications to customer.
- Role-based access: Staff members can log in with limited permissions (view only their calendar, no business profile editing).

---

### 16. Admin Dashboard

**Priority:** P0 (must-have for operations)

**Description**  
Central dashboard for administrators to manage users, providers, categories, reviews, monitor platform health, and view analytics.

**Core Sections**

1. **Dashboard Overview:** KPIs (total users, providers, bookings, revenue, refunds) with date range filters.
2. **User Management:** List/customers with search, view details, disable/suspend accounts.
3. **Provider Management:** Approve new providers, view/edit details, suspend, set commission (future).
4. **Category Management:** CRUD for service categories with hierarchy.
5. **Review Moderation:** Queue of reported reviews, ability to approve, reject, or delete.
6. **Booking Oversight:** Search all bookings, view status, issue refunds.
7. **System Configuration:** Global parameters (e.g., session timeout, default radius, currency).
8. **Audit Log:** Track admin actions.

**Acceptance Criteria**
- Admin login separated from customer/provider; OTP or strong MFA required.
- Provider approval: new providers are "pending" until admin approves the profile; email notification sent upon approval.
- Admin can suspend a provider or user, which disables login and hides from search results.
- Review moderation: reported reviews appear in a queue; admin can dismiss report (keep review), remove review (soft delete), or ban user.
- Booking refund: admin can initiate full/partial refund from booking detail; Stripe refund processed, status updated.
- Analytics charts built with a charting lib (e.g., Recharts) showing booking trends, revenue, top categories.

---

### 17. Background Jobs (BullMQ)

**Priority:** P0 (backend infrastructure)

**Description**  
All asynchronous and scheduled tasks are handled via BullMQ queues (backed by Redis) to ensure reliability and scalability.

**Jobs List**
- **SendNotification:** Send push, email, and SMS (future) notifications. Retry on failure with exponential backoff.
- **AppointmentReminder:** Scheduled job to trigger 24h/1h reminders. Computed at booking time with delay.
- **ReviewRequest:** Scheduled X hours after appointment end to prompt review.
- **ReleaseExpiredHold:** Release held slot if booking not completed within 10 minutes.
- **GenerateInvoice:** Asynchronous PDF invoice generation and email.
- **ProcessPayout:** (Future) transfer earnings to provider.
- **DataCleanup:** Anonymize/delete user data if account deleted after grace period.

**Acceptance Criteria**
- All jobs must be idempotent; duplicate processing must not cause duplicate notifications or double charges.
- Failed jobs are logged and visible in an admin queue monitor (Bull Board UI).
- Critical jobs (notification, reminder) have a retry count of 5, then alert ops.
- Queue monitoring accessible to developers via a protected route.
- Job processing must not degrade API response times; jobs are enqueued and processed asynchronously.

---

## Non-Functional Requirements

**Performance**  
- App startup < 1.5s on 4G, booking flow load < 2s per step.
- API p95 latency < 300ms for slot queries.

**Security**  
- HTTPS everywhere, JWT with short-lived access tokens (15 min), refresh token rotation.
- All user inputs validated and sanitized. Rate limiting on auth and booking endpoints.

**Scalability**  
- Horizontal scaling for API servers; use of Redis for caching and session store.

**Compliance**  
- GDPR compliance: user data export and deletion on request; cookie consent.

---

*End of Product Specification.*