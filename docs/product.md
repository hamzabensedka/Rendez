# Planity Clone Product Specification

## Overview
Planity Clone is a service booking platform that connects customers with local businesses (hair salons, spas, wellness centers, etc.). Customers can discover, book, and manage appointments; providers manage services, availability, and bookings; administrators oversee the platform. This document defines the complete feature set with priorities and acceptance criteria to guide the engineering team.

## User Roles
- **Guest** – Unauthenticated visitor who can browse and search, but must sign up to book.
- **Customer** – Authenticated user who books, manages appointments, writes reviews, and saves favorites.
- **Provider / Business Owner** – Business account that manages its profile, services, staff availability, and bookings.
- **Admin** – Platform administrator with full control over users, businesses, content moderation, and analytics.

## Shared Types & Design System (Priority: P0)
All frontend and backend components rely on a consistent design system and shared TypeScript/types. This is foundational.

**Types** (defined in a shared package):
- `User`: id, email, name, phone, avatar, role (CUSTOMER | PROVIDER | ADMIN), createdAt.
- `Business`: id, name, description, address { street, city, zip, coordinates { lat, lng } }, phone, categories[], images[], rating (average), reviewCount, ownerId, isActive.
- `Service`: id, businessId, name, description, duration (minutes), price (cents), category, isActive.
- `Staff`: id, businessId, name, avatar, workingHours (array of day schedules).
- `Slot`: date (YYYY‑MM‑DD), startTime (HH:mm), endTime, serviceId, businessId, staffId, status (AVAILABLE | BOOKED | BLOCKED).
- `Booking`: id, userId, businessId, serviceId, staffId, slotDate, slotStart, slotEnd, status (PENDING | CONFIRMED | COMPLETED | CANCELLED | NO_SHOW), paymentStatus, totalAmount, createdAt.
- `Review`: id, bookingId, userId, businessId, rating (1‑5), comment, createdAt, isFlagged.
- `Payment`: id, bookingId, stripePaymentIntentId, amount, currency, status, createdAt.
- `Notification`: id, userId, type, title, body, isRead, data (JSON), createdAt.

**Design Tokens**: Colors, typography, spacing, and shadow presets – single source of truth for React Native and web.

**Acceptance Criteria**
- All types are shared across frontend and backend (API contracts validated with Zod/similar).
- Design tokens are consumed by both apps; visual consistency is 100%.
- Common UI components (Button, Card, Modal, StarRating, etc.) are built from tokens and reused.

---

## Features

### 1. User Authentication (Priority: P0)
**Description**  
Allow users to create an account, log in, and manage credentials. Essential for personalization, booking, and security.

**Acceptance Criteria**
- Guest can sign up with email/password, and optionally Google/Apple ID (OAuth).
- Email verification required after sign‑up; resend verification link available.
- Login returns JWT tokens (access + refresh) stored securely on device.
- Forgot password flow sends reset link; reset form validates new password strength.
- Session persist across app restarts (refresh token rotation).
- All forms show inline validation errors; rate limiting on auth endpoints.
- On success, user is redirected to the previously intended page if any.

---

### 2. Guest Browse & Explore (Priority: P0)
**Description**  
Unauthenticated users can browse businesses, search, and view details, but cannot finalize bookings.

**Acceptance Criteria**
- Home screen shows featured businesses and popular categories for guests.
- Search and map are accessible; tapping “Book” triggers login/signup modal.
- After authentication, user is returned to the exact service/time screen they were viewing.
- No personalization (favorites, history) until logged in.

---

### 3. Business Search & Discovery (Priority: P0)
**Description**  
A robust search with filters that lets users find businesses by name, service, category, and location.

**Acceptance Criteria**
- Search bar with live suggestions (minimum 3 characters, debounced 300ms).
- Filters: category, price range, rating, distance, availability “today/tomorrow”.
- Results display business name, image, rating, distance, and next available slot snippet.
- Empty state with helpful message (“No businesses found. Try adjusting filters.”).
- Search works across all screen sizes and orientations.
- Pagination / infinite scroll for large result sets.

---

### 4. Map‑based Search (Priority: P1)
**Description**  
Interactive map showing business locations, enabling spatial discovery.

**Acceptance Criteria**
- Map renders with markers for businesses; tapping a marker shows a small info card with name, rating, and a “View Details” link.
- Marker clustering when zoomed out.
- User’s current location (with permission) can be used to center map and sort by distance.
- Filters applied to search also affect map markers.
- Performance under 500 markers without noticeable lag.
- Available on both mobile and web (React Native Maps / Leaflet).

---

### 5. Business Detail View (Priority: P0)
**Description**  
Full screen with all business information, services list, availability preview, and booking entry point.

**Acceptance Criteria**
- Image gallery (carousel) with pinch‑to‑zoom.
- Business name, category, address (with “Open in maps” link), phone, description.
- Rating average and total reviews count (clickable to review section).
- List of services grouped by category, each showing name, duration, price, and a “Book” button.
- A mini‑calendar or “Next available” chip that shows upcoming slots (real‑time).
- Loading skeleton shown; error state with retry.
- Action buttons: “Favorite”, “Share”, “Report”.

---

### 6. Service Categories (Priority: P0)
**Description**  
Browseable and searchable category tree to narrow down businesses.

**Acceptance Criteria**
- Pre‑defined categories (configurable by admin) with icons: Hair, Nails, Massage, Face, Body, Barber, etc.
- Sub‑categories (e.g., Hair > Coloring, Hair > Cut).
- Category screen shows a grid of categories; tapping one shows businesses under that category.
- Search/filter bar available on category result pages.
- SEO‑friendly URLs on web.

---

### 7. Booking Flow (Priority: P0)
**Description**  
Step‑by‑step process to select a service, choose a slot, add optional extras, and confirm the booking.

**Acceptance Criteria**
- Flow steps: Service → Staff (if multi‑staff) → Date → Time slot → Confirm & Pay.
- Each step shows a progress indicator.
- Slot availability fetched in real‑time; chosen slot is temporarily reserved (5‑minute hold) to prevent double‑booking.
- If reserved slot expires, user sees a message and must choose again.
- Users can add notes for the provider.
- Booking summary shows service, date, time, staff, total price, and cancellation policy.
- On “Confirm”, payment is processed (if required) and booking is created with status CONFIRMED.
- Confirmation screen shows booking details and option to add to calendar.
- Entire flow must work offline‑first? No, real‑time check essential – but graceful error handling when network fails.

---

### 8. Appointment Management (Priority: P0)
**Description**  
Customers can view, cancel, and reschedule their appointments.

**Acceptance Criteria**
- Dashboard with tabs: “Upcoming” and “Past”.
- Each appointment card shows: date, time, service name, business name, status badge, and actions.
- Cancel action available if status is CONFIRMED and cancellation deadline not passed (e.g., 24h before). Cancel triggers confirmation dialog and refund processing.
- Reschedule action opens a modified booking flow that only allows date/time change; original service same.
- Successful reschedule creates new booking and cancels old one with refund if price difference.
- Past appointments show ability to leave a review (if not already left).
- Add to calendar feature (download .ics or deep link).

---

### 9. Favorites (Priority: P1)
**Description**  
Save businesses to a favorites list for quick access.

**Acceptance Criteria**
- Heart icon on business detail and list cards to toggle favorite.
- Favorite list accessible from the user’s profile/drawer menu.
- List shows business name, image, rating, and “Book” quick action.
- Favorites synced across devices (cloud‑based).
- Empty state: “You haven’t saved any favorites yet.”

---

### 10. User Profile (Priority: P1)
**Description**  
Manage personal information, notification preferences, and view activity.

**Acceptance Criteria**
- Edit name, email (re‑verify on change), phone number, profile picture (camera/gallery).
- Notification toggles for email, push, sms (opt‑in).
- Section for saved payment methods (masked card details).
- Booking history with status filters.
- Delete account option with confirmation and data wipe (GDPR compliant).

---

### 11. Availability & Slot Computation (Priority: P0)
**Description**  
Background service that calculates available time slots based on provider working hours, service duration, existing bookings, breaks, and staff schedules.

**Acceptance Criteria**
- Slots are dynamic: computed per business per service per staff, optionally per date range.
- Computation considers: working hours (with per‑day overrides), buffer time between appointments, staff concurrency, holidays/blocked times.
- Real‑time updates: when a booking is confirmed, the corresponding slot is marked BOOKED and any overlapping slots are recalculated.
- API endpoint `GET /availability?businessId=&serviceId=&date=&staffId=` returns available slots for the next N days.
- Background jobs (BullMQ) recalculate slots for the upcoming weeks every night or when provider changes schedule.
- Handles timezone correctly (business location timezone).
- Performance: slot generation for 250 businesses with 4‑week horizon completes within 5 minutes.

---

### 12. Reviews & Ratings (Priority: P1)
**Description**  
Allow customers to rate and review businesses after a completed appointment.

**Acceptance Criteria**
- Review prompt appears after booking status becomes COMPLETED (in‑app notification and email).
- Form: star rating 1‑5, text comment (min 10 characters, max 1000).
- Only one review per booking; editing allowed within 48h.
- Business detail shows average rating (one decimal) and total number of reviews.
- Review list sorted by most recent; ability to flag inappropriate content.
- Flagged reviews hidden until admin review.
- Provider cannot delete reviews, only respond (future phase).

---

### 13. Payment Integration (Priority: P0)
**Description**  
Secure payment processing for bookings using Stripe.

**Acceptance Criteria**
- Payment methods: credit/debit card, Apple Pay, Google Pay.
- Flow: customer enters card details or uses saved method; payment intent created when booking is confirmed.
- Payment captured immediately upon booking (or 1‑hour hold for high‑value services).
- Refunds for cancellations comply with business policy; partial refunds supported.
- Invoice/receipt generated and emailed after payment.
- PCI‑DSS compliance – sensitive card data never touches own servers (Stripe Elements / React Native Stripe).
- Failed payments show clear error and do not create booking.
- Payment status synced with booking status.

---

### 14. Notifications (Priority: P1)
**Description**  
Multi‑channel notifications to keep users informed.

**Acceptance Criteria**
- Channels: push (FCM/APNs), email (SendGrid/SES), in‑app (bell icon).
- Notification types and triggers:
   - Booking confirmation (customer & provider)
   - Reminder 1 day and 1 hour before appointment
   - Cancellation / reschedule
   - Review request after completion
   - Promotional offers (opt‑in)
- In‑app notification center with unread badge and mark‑as‑read.
- Deep‑link from push/email opens relevant booking detail.
- Users can manage preferences per channel per type.

---

### 15. Provider / Business Owner Portal (Priority: P0)
**Description**  
A dedicated portal for business owners to manage their presence and operations on the platform.

**Acceptance Criteria**
- Authentication as provider (separate login or role‑based redirect).
- Dashboard shows: today’s appointments, upcoming bookings, total revenue, new reviews.
- Service management: add, edit, archive services (name, duration, price, category, active status).
- Staff management: invite staff (email), set working hours per staff, assign services.
- Calendar view (day/week/month) with all bookings; ability to manually add walk‑in appointments or block time.
- Booking management: accept/decline if manual approval is enabled (configurable), cancel with reason, mark as no‑show.
- Availability settings: set regular working hours, special hours for holidays, break times, buffer slots.
- Analytics: basic reports (bookings count, revenue) with date filters.
- Profile editing: business name, description, images, phone, address.
- Notifications for new bookings and reviews.
- Role‑based access: owner can add staff with limited permissions.

---

### 16. Admin Dashboard (Priority: P2)
**Description**  
A centralized administration panel for platform operators.

**Acceptance Criteria**
- User management: list, search, suspend/activate accounts, view activity.
- Business management: approve new business registrations, verify documents, suspend/reactivate.
- Review moderation queue: view flagged reviews, allow/block, delete if necessary.
- Category management: CRUD service categories and sub‑categories.
- Configuration: global cancellation deadline, commission rates, featured businesses.
- Analytics dashboard: total users, businesses, bookings, revenue, platform fees over time (charts).
- Ability to impersonate a provider/customer for support.
- Export data to CSV.

---

### 17. Background Jobs (BullMQ) (Priority: P0)
**Description**  
Robust job queue infrastructure for asynchronous and scheduled tasks.

**Acceptance Criteria**
- Jobs defined for:
   - Send notification (email/push)
   - Process payment capture/refund
   - Update slot availability (nightly recalculation)
   - Release expired slot reservations
   - Generate daily analytics reports
- Queue dashboard with retries, delayed jobs, failure monitoring (Bull Board included).
- At‑least‑once delivery semantics; idempotency for critical jobs.
- Jobs are persisted in Redis and can survive worker restarts.
- Workers can scale horizontally.
- Dead‑letter queue for jobs that fail after max retries, with admin alert.

---

## Priorities Summary
- **P0 (Must‑have)**: Authentication, Guest Browse, Business Search, Service Categories, Business Detail, Booking Flow, Appointment Management, Availability & Slot Computation, Payment Integration, Provider Portal, Background Jobs (BullMQ), Shared Types & Design System.
- **P1 (High)**: Map‑based Search, Favorites, User Profile, Reviews & Ratings, Notifications.
- **P2 (Nice‑to‑have for MVP)**: Admin Dashboard.

All features should be built with observability, testing, and accessibility in mind.