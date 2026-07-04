# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with local beauty & wellness businesses. Customers can discover services, browse business profiles, book appointments, and pay seamlessly. Business owners manage their schedule and services via a dedicated portal. An admin dashboard oversees the ecosystem. The system supports real-time availability computation, notifications, and background job processing.

## 2. Feature Specifications & Acceptance Criteria

### 2.1 User Authentication (P0)
**Description:** Secure login and registration for end users, providers, and admins. Supports email/password and social OAuth. Role-based access control.
**Acceptance Criteria:**
- Users can register with email and password; validation for email format and password strength (min 8 chars, 1 uppercase, 1 number).
- Users can log in and receive a JWT token; token expiration handled gracefully.
- Social login (Google, Apple, Facebook) OAuth flow works.
- Forgot password: sends reset link to email; link expires in 1 hour.
- After login, users directed to appropriate home screen based on role: customer, provider, admin.
- Token refresh mechanism without logout.
- Error messages clear: "Invalid credentials", "Account already exists", etc.

### 2.2 Guest Browse & Explore (P0)
**Description:** Unauthenticated users can browse businesses, search, and view profiles but cannot book until login.
**Acceptance Criteria:**
- Guest landing shows featured businesses, popular categories, and search bar.
- Guest can search by keyword, location, category.
- Business detail view is accessible, but "Book" button prompts login/signup.
- Map search works for guests.
- No personalization (favorites) available to guest.

### 2.3 Business Search & Discovery (P0)
**Description:** Text-based search with filters and sorting. Users find businesses by name, service, category, or location.
**Acceptance Criteria:**
- Search input supports real-time suggestions (minimum 3 characters).
- Filters: category (hair, nails, spa, etc.), price range, rating, distance, availability (today, this week).
- Sorting: relevance, rating, distance, price low/high.
- Results displayed in list with thumbnail, rating, distance, next available slot.
- "No results" state with suggestion to widen criteria.
- Pagination/infinite scroll.
- Search is case-insensitive and accent-insensitive.

### 2.4 Map-based Search (P0)
**Description:** Interactive map showing business locations with clustering.
**Acceptance Criteria:**
- Map loads with user's current location (permission requested) centered.
- Business markers appear; tapping opens a card with name, rating, and mini photo.
- Clustering for dense areas.
- Map view synced with list view filter criteria.
- User can move map; "Search this area" button updates results.
- Distance radius filter applies to map.
- Marker pin color varies by category.

### 2.5 Business Detail View (P0)
**Description:** Comprehensive profile for a business.
**Acceptance Criteria:**
- Hero image carousel.
- Business name, rating (stars + count), address, distance, opening hours status (open/closed).
- Service categories and specific services with duration, price.
- Available time slots for each service (based on staff availability) — "Select a service to see slots".
- Reviews & ratings section with summary (average, distribution).
- About section, amenities, payment methods accepted.
- Action buttons: Favorite (heart), Share, Call, Directions (opens maps app).
- Booking CTA prominent; if multiple staff, "Choose staff" option later.

### 2.6 Service Categories (P0)
**Description:** Organized taxonomy of services offered across businesses.
**Acceptance Criteria:**
- Category list: Hair, Nails, Massage, Facial/Skin, Makeup, Barber, Spa, Wellness, etc.
- Each category has an icon/image.
- Subcategories defined (e.g., Hair > Women's Haircut, Coloring, Styling).
- Businesses can assign multiple categories and services.
- Category selection as quick filter in search.
- Admin can manage categories (CRUD) via admin dashboard (P1).

### 2.7 Booking Flow (P0)
**Description:** Step-by-step booking: select service, staff (optional), date/time, enter details, confirm, pay.
**Acceptance Criteria:**
- User must be logged in to book.
- Step 1: Select service from business's list (shows duration, price).
- Step 2: Choose staff member (if multiple) — display staff name, photo, rating.
- Step 3: Select date (calendar view, unavailable dates grayed out). Then select available time slot from computed slots.
- Step 4: Enter or confirm client info (pre-filled from profile), any notes, promo code (optional).
- Step 5: Review summary: service, staff, date, time, price, duration. Confirm booking.
- Step 6: Payment (if required at booking time) via integrated payment (Stripe).
- Success screen with appointment details, option to add to calendar, share.
- Booking flow handles concurrent slot holding (temporary lock for 10 mins, expiry releases slot).
- Error handling: if slot taken, prompt to choose another.
- Guest booking: after step 5, prompt for signup/login, then continue to payment; retain booking data in session.

### 2.8 Appointment Management (P0)
**Description:** Users view upcoming and past appointments, cancel or reschedule.
**Acceptance Criteria:**
- My Appointments list: tabs "Upcoming" and "Past".
- Each appointment card shows business name, service, date/time, status (confirmed, cancelled, completed).
- Upcoming appointments within cancellation window show "Cancel" button with confirmation dialog (cancellation policy note).
- Reschedule option: takes user back to availability picker for same service at same business; old slot released upon successful reschedule.
- Past appointments: ability to leave a review if not already done.
- Push notification and email reminders (configurable) 24h and 1h before.
- Users can add appointment to device calendar.

### 2.9 Favorites (P1)
**Description:** Users save businesses to a favorites list for quick access.
**Acceptance Criteria:**
- Heart icon on business cards and detail view toggles favorite status.
- Favorites list accessible from profile/nav bar.
- Unfavorite confirmation (undo option).
- Favorites persist across sessions.
- Sort favorites by date added, rating, distance.
- Notification option when favorited business has special offers (future).

### 2.10 User Profile (P1)
**Description:** Manage personal information, preferences, and payment methods.
**Acceptance Criteria:**
- Edit name, email, phone, profile picture.
- Change password.
- Manage saved addresses (for quick location).
- Manage saved payment methods (tokenized cards).
- Notification preferences: push, email, marketing.
- Linked social accounts management.
- Delete account (GDPR compliant).
- Past appointment history and reviews list.
- Favorites list.
- Language and theme settings.

### 2.11 Availability & Slot Computation (P0)
**Description:** Real-time calculation of available slots based on business hours, staff schedules, service duration, existing bookings, and buffer times.
**Acceptance Criteria:**
- Provider sets business hours (e.g., Mon-Fri 9:00-18:00) and staff working hours with breaks.
- Service duration + optional buffer (cleanup) used for slot generation.
- Slots calculated from current time forward; no double-booking.
- Algorithm respects provider's "lead time" (e.g., cannot book within 2 hours).
- Slot intervals defined by provider (e.g., 15 min, 30 min).
- Available slots returned for a given date, service, and staff.
- Handles multiple staff: if staff A booked, staff B may be available.
- Temporary slot locking through booking flow (10 min reserve).
- Changes in provider schedule instantly reflected; background job recalculates affected slots.
- API endpoint returns slots in structured format.

### 2.12 Shared Types & Design System (P0)
**Description:** Consistent TypeScript types/interfaces and UI component library across mobile and web.
**Acceptance Criteria:**
- Type definitions: User, Business, Service, Staff, Appointment, Review, Category, etc., defined in shared npm package.
- UI components: Button, Input, Card, Modal, Calendar, Rating Stars, etc., with theming (colors, spacing, typography) using a design system (e.g., Tailwind/NativeBase).
- Responsive for mobile (primary) and admin desktop.
- Components have loading, error, empty states.
- Accessibility: minimum contrast, touch targets, screen reader support.

### 2.13 Reviews & Ratings (P1)
**Description:** Customers rate and review businesses after service completion.
**Acceptance Criteria:**
- Only after appointment marked completed, user gets prompt to review.
- Rating: 1-5 stars with optional text review and photo upload.
- Review displays on business profile with moderation flag (auto-approve, admin can hide).
- Business owner cannot delete reviews but can respond publicly.
- Aggregate rating updated asynchronously via background job.
- User can edit their own review within 48 hours.
- Sorting: most recent, highest rated, lowest rated.

### 2.14 Payment Integration (P0)
**Description:** Secure payment processing for booking deposits or full payment.
**Acceptance Criteria:**
- Integration with Stripe (or equivalent) using Payment Intents and tokenized cards.
- Users can save multiple cards securely.
- Flow: at booking, if business requires payment upfront/deposit, charge amount; if free, no payment step.
- Supports 3D Secure.
- Payment success/failure handled with clear UI and retry option.
- Refunds: business owner can process full/partial refund via provider portal; triggers Stripe refund.
- Transaction records in admin dashboard.
- PCI compliance: no raw card details on app servers.

### 2.15 Notifications (P0)
**Description:** Push and in-app notifications for appointments, reminders, marketing, and system alerts.
**Acceptance Criteria:**
- Transactional: booking confirmation, reschedule, cancellation, reminder (24h, 1h before), review request.
- Marketing: promotional offers (opt-in).
- System: appointment status changes (provider cancelled), payment receipt.
- In-app notification center with read/unread, deep link to relevant screen.
- Push notifications via Firebase Cloud Messaging (FCM) for mobile, Web Push for admin.
- User preferences to toggle notification types.
- Notifications queued via BullMQ for reliable delivery.

### 2.16 Provider / Business Owner Portal (P0)
**Description:** Web and mobile access for business owners to manage profile, services, staff, schedule, and appointments.
**Acceptance Criteria:**
- Dashboard: today's appointments, earnings summary, upcoming.
- Appointment management: view, confirm, cancel, reschedule on behalf of client, mark no-show.
- Calendar view: day/week/month, color-coded by staff, click slot to book or block.
- Services: create/update services with name, duration, price, category, description, buffer time.
- Staff management: add staff with name, photo, working hours, service assignments, breaks.
- Business profile: edit name, description, address, photos, opening hours, contact info.
- Availability settings: set advance booking window, cancellation policy (e.g., free cancel 24h).
- Reviews: view and respond to reviews.
- Reporting: basic stats (bookings, revenue) for selected period.
- Onboarding flow for new providers: step-by-step with validation.
- Role-based access: owner can have multiple staff logins with limited permissions (e.g., only see own appointments).

### 2.17 Admin Dashboard (P1)
**Description:** Super admin oversees platform operations, users, businesses, and financials.
**Acceptance Criteria:**
- Dashboard with key metrics: total users, businesses, bookings, GMV, commission.
- User management: search, list, deactivate/ban, view details.
- Business management: approve new listings, categorize, suspend, view performance.
- Category management: add/edit/delete categories and subcategories.
- Review moderation: reported reviews, hide/unhide, view.
- Financial: transaction list, commission tracking, refunds, payouts.
- Configuration: commission rates, platform fee, notification templates.
- Role-based admin access (super admin, support).
- Audit log of sensitive actions.

### 2.18 Background Jobs (BullMQ) (P0)
**Description:** Asynchronous processing using Redis-backed BullMQ for sending notifications, slot recalculations, review aggregation, and cleanup.
**Acceptance Criteria:**
- Job queues defined: notification-queue, booking-queue, review-queue, maintenance-queue.
- Notification job: consumes event (booking_confirmed) and sends push/email via configured providers.
- Slot recalculation: when staff schedule changes, trigger job to recompute future slot cache for that staff.
- Review aggregation: on new review, update business rating asynchronously.
- Cleanup: periodically release expired booking slot locks, clear guest sessions.
- Jobs are idempotent and handle failures with retries (3 attempts, backoff).
- Dead letter queue for failed jobs after retries; admin can review.
- Monitoring via Bull Board or admin dashboard.

## 3. Priority Summary
- P0 (Must-have for MVP): User Auth, Guest Browse, Search, Map Search, Business Detail, Service Categories, Booking Flow, Appointment Management, Availability Computation, Shared Types/DS, Payment, Notifications, Provider Portal, Background Jobs.
- P1 (Should-have for post-MVP): Favorites, User Profile (enriched), Reviews & Ratings, Admin Dashboard.
- Future considerations: Loyalty programs, multi-language, AI recommendations, social sharing leaderboards.

## 4. Non-Functional Requirements
- Performance: API response < 200ms p95 for slot listing, page loads under 2 seconds.
- Scalability: support 100k concurrent users, horizontal scaling.
- Security: HTTPS, encrypt PII, OWASP top 10, RBAC.
- Availability: 99.9% uptime, graceful degradation.
- Compatibility: iOS 15+, Android 10+, modern browsers for web/portal.

---

This specification is a living document; all features require detailed API contracts and UI mockups before development.