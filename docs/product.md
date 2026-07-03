# Planity Clone Product Specification

## 1. Overview
**Product:** Planity Clone – a mobile-first appointment booking platform connecting customers with beauty, wellness, and personal care businesses.
**Goal:** Deliver a seamless discovery, booking, and management experience for both customers and business owners.
**Target Users:** End customers, business owners/providers, platform administrators.
**Platforms:** iOS, Android, Web (responsive).

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 (Must-have)

**Description:**
Secure sign-up, login, and session management for customers, providers, and admins. Support email/password and social login (Google, Apple).

**Acceptance Criteria:**
- User can sign up with email, password, first name, last name, and role selection (customer/provider).
- Email verification required before first login; resend verification option.
- Login with email/password, Google OAuth, or Apple ID.
- Forgot password flow sends reset link to email; token expires in 1 hour.
- JWT token-based authentication with refresh token rotation.
- Logout invalidates tokens on server.
- Role-based access control: customer, provider, admin.
- Session persists across app restarts (secure storage).
- Error messages for invalid credentials, locked accounts, network issues.

### 2.2 Guest Browse & Explore
**Priority:** P0

**Description:**
Non-authenticated users can browse businesses, search, view details, and check availability without signing up. Booking and personalization require login.

**Acceptance Criteria:**
- Guest can see home screen with featured businesses and categories.
- Search and filter work without login.
- Business detail page accessible, including services, reviews, and map.
- Attempting to book, favorite, or write a review prompts login/sign-up modal.
- After login, redirect back to the intended action.
- No personal data stored locally; session cleared on app close.

### 2.3 Business Search & Discovery
**Priority:** P0

**Description:**
Text-based search with autocomplete, filters, and sorting to help users find relevant businesses quickly.

**Acceptance Criteria:**
- Search bar with autocomplete showing business names, categories, and services.
- Filters: category, price range, rating, distance, availability (today/tomorrow/this week), amenities (wifi, parking, wheelchair accessible).
- Sort options: relevance, rating, distance, price low-high, price high-low.
- Results update in real-time as filters change.
- Empty state with suggestions to broaden filters.
- Search history saved for logged-in users.
- Recent searches accessible from search bar.
- Pagination (infinite scroll) with 20 items per page.

### 2.4 Map-based Search
**Priority:** P1

**Description:**
Interactive map view showing business locations based on search area and filters, allowing visual discovery.

**Acceptance Criteria:**
- Map toggles with list view; shared filters and search query.
- Map clusters markers at high zoom levels.
- Tap a marker shows business card with name, rating, primary image, and distance.
- Re-centering on user's location (with permission) and on map move.
- Search area updates dynamically as map is panned; results refresh.
- "Search this area" button when map is moved significantly.
- Map uses OpenStreetMap/Leaflet (web) and Mapbox/Google Maps SDK (mobile).

### 2.5 Business Detail View
**Priority:** P0

**Description:**
Comprehensive business profile page with all information needed to make a booking decision.

**Acceptance Criteria:**
- Image gallery with swipe/viewer; lazy loading.
- Business name, rating, review count, address, distance.
- Description, amenities, working hours (today highlighted), contact info.
- Service list grouped by category with names, durations, prices.
- Staff list with photos, specialties, and ratings (if multi-staff).
- Reviews section with summary stars, recent reviews, and "see all" link.
- "Book" sticky CTA button that scrolls to service selection or opens booking flow.
- Share button (deep link).
- Favorite/unfavorite toggle.
- Map showing location with directions link.
- Loading skeleton, error state with retry.

### 2.6 Service Categories
**Priority:** P0

**Description:**
Hierarchical service categories for browsing and organizing business services. Admin can manage categories.

**Acceptance Criteria:**
- Home screen shows top-level categories with icons (e.g., Hair, Nails, Massage, Skin Care).
- Tapping a category navigates to a list of subcategories or businesses filtered by that category.
- Category pages include subcategory chips, popular services, and top businesses.
- Businesses can assign multiple categories and subcategories.
- Admin can CRUD categories and subcategories with image, name, description, and active flag.

### 2.7 Booking Flow
**Priority:** P0

**Description:**
End-to-end booking process that guides users from service selection to confirmation, ensuring real-time availability.

**Acceptance Criteria:**
- **Step 1: Service & Staff selection** – Select one or multiple services, optionally select preferred staff (if business allows).
- **Step 2: Date & Time** – Calendar with available dates highlighted; time slots based on real-time availability. Show duration and total price.
- **Step 3: Review & Confirm** – Summary of selected services, staff, date/time, total price, business info. Option to add notes.
- **Step 4: Payment (if required)** – Payment method selection (card, saved card, wallet). Apply promo code. Show final price breakdown (subtotal, taxes, fees, discounts).
- **Step 5: Confirmation** – Success screen with booking ID, appointment details, add to calendar option, and ability to manage booking.
- Flow progress indicator (steps).
- Back navigation allowed with confirmation if data loss possible.
- Concurrency: slot is held for 5 minutes during booking; if not completed, released.
- Real-time validation: slot availability checked before confirmation.
- Error handling: if slot becomes unavailable, suggest alternative times.

### 2.8 Appointment Management
**Priority:** P0

**Description:**
Users can view, reschedule, cancel, and track their appointments from a central dashboard.

**Acceptance Criteria:**
- List of upcoming appointments sorted by date; past appointments tab.
- Each appointment card shows business name, service, date/time, staff, status (confirmed, pending, cancelled, completed).
- Tap to view details: full info, booking ID, notes, cancellation policy.
- Reschedule: launch modified booking flow with current service/staff; preserve original slot until new one confirmed.
- Cancel: with reason selection, confirmation dialog, adherence to cancellation policy (refund rules).
- Add to calendar (Google/Apple) from appointment details.
- Push notification reminders: 24 hours and 1 hour before appointment.
- Past appointments: option to leave review or rebook.

### 2.9 Favorites
**Priority:** P1

**Description:**
Users can save favorite businesses for quick access and receive personalized recommendations.

**Acceptance Criteria:**
- Favorite button on business cards and detail pages.
- Favorites list accessible from profile/tab bar.
- List shows business name, image, rating, next available slot (if any).
- Remove from favorites with swipe-to-delete or tap.
- Sync favorites across devices for logged-in user.
- Empty state with suggestion to browse.
- Notifications: when a favorited business has new availability or promotions (opt-in).

### 2.10 User Profile
**Priority:** P0

**Description:**
User profile management for personal information, preferences, and account settings.

**Acceptance Criteria:**
- Edit profile photo, name, email, phone number.
- Change password (requires current password).
- Manage payment methods (add, delete, set default).
- Notification preferences (email, push, SMS) with toggles by type.
- Booking history link.
- Favorites link.
- Language and region settings.
- Delete account (with confirmation and data removal request).
- Logout button.
- Profile data synced with backend.

### 2.11 Availability & Slot Computation
**Priority:** P0

**Description:**
Real-time availability engine that calculates bookable slots based on business hours, service duration, staff schedules, breaks, buffer times, and existing bookings.

**Acceptance Criteria:**
- Business sets working hours per day, including breaks.
- Staff members have individual schedules (overrides business hours).
- Service duration + buffer time (before/after) used for slot calculation.
- Slot search returns available time windows for a given date, service(s), and optional staff.
- Concurrency: multiple bookings per slot if supported (e.g., multiple staff, rooms).
- Slot hold mechanism: when a user starts booking, slot is reserved for 5 minutes; if not confirmed, released.
- Recalculation on reschedule or cancellation.
- Timezone-aware: business timezone used for all calculations.
- API endpoint: GET /businesses/:id/slots?date=...&serviceIds=...&staffId=... returns available slots with start/end times.

### 2.12 Shared Types & Design System
**Priority:** P0

**Description:**
Unified design language and shared TypeScript types across frontend and backend to ensure consistency.

**Acceptance Criteria:**
- Design system includes: color palette, typography scale, spacing units, icon set (using Lucide or similar), UI components (buttons, inputs, cards, modals, etc.).
- Shared types package (e.g., `@planity/shared-types`) with interfaces for User, Business, Service, Appointment, Review, etc.
- All types are strict, well-documented, and versioned.
- Components are built with accessibility (a11y) in mind: semantic HTML, ARIA labels, keyboard navigation.
- Responsive design: mobile-first, then tablet and desktop.
- Dark mode support (optional, P2).

### 2.13 Reviews & Ratings
**Priority:** P1

**Description:**
Users can rate and review businesses after a completed appointment, helping others make informed decisions.

**Acceptance Criteria:**
- Rating: 1-5 stars, with half-star increments.
- Review text: optional, min 10 characters, max 500.
- Photo upload (optional, up to 3 images).
- Review submission only after a completed appointment (verified badge).
- Reviews appear on business detail page, sorted by most recent or highest rated.
- Business can respond to reviews (public reply).
- Reporting inappropriate reviews (flag for admin review).
- Aggregated rating (average) updated in real-time.
- Review helpfulness votes (thumbs up/down).
- User can edit/delete their own review within 30 days.

### 2.14 Payment Integration
**Priority:** P0

**Description:**
Secure payment processing via Stripe, supporting card payments, saved payment methods, and digital wallets (Apple Pay, Google Pay) where applicable.

**Acceptance Criteria:**
- Integration with Stripe Elements or Stripe.js for PCI-compliant card collection.
- Support for credit/debit cards, Apple Pay, Google Pay.
- Save card for future payments with tokenization (Stripe Customer + PaymentMethod).
- Payment flow: authorization at booking time, capture when service is completed (or immediately if business policy).
- Pre-authorization hold for the booking amount; funds released if cancelled within policy.
- Split payments: platform fee deducted, remainder to business (Stripe Connect).
- Refund processing: full or partial refunds initiated by business or admin.
- Receipt generation: email receipt after payment.
- Error handling: card declined, insufficient funds, network errors with user-friendly messages.
- Payment status tracking: pending, authorized, captured, refunded, failed.

### 2.15 Notifications
**Priority:** P0

**Description:**
Multi-channel notification system to keep users informed about bookings, reminders, promotions, and system updates.

**Acceptance Criteria:**
- Push notifications (FCM/APNs) for real-time updates.
- Email notifications for booking confirmation, reminders, cancellations, receipts.
- SMS notifications (optional) for critical alerts (e.g., last-minute changes).
- In-app notification center with bell icon, unread count, and list.
- Notification types:
  - Booking confirmation, reschedule, cancellation.
  - Reminder: 24h and 1h before appointment.
  - Payment receipt.
  - New review response.
  - Favorite business availability update.
  - Promotional messages (opt-in).
- User can configure notification preferences per channel and type.
- Deep linking: tapping a notification navigates to relevant screen.
- Admin can send broadcast push notifications to all customers or segmented groups.

### 2.16 Provider / Business Owner Portal
**Priority:** P0

**Description:**
A separate web dashboard for business owners to manage their profile, services, staff, appointments, and view analytics.

**Acceptance Criteria:**
- **Dashboard Home:** Overview of today's appointments, revenue summary, upcoming bookings, new reviews.
- **Appointment Management:** Calendar view (day/week/month) of all bookings; filter by staff, service, status. Ability to confirm, reschedule, cancel, mark as no-show, or complete appointment.
- **Walk-in booking:** Create manual booking on behalf of customer.
- **Staff Management:** Add/remove staff, set their schedules, assign services, manage breaks.
- **Service Management:** CRUD services with name, description, duration, price, category, buffer time, active flag.
- **Business Profile:** Edit business name, description, address, contact, photos, amenities, working hours.
- **Customer Management:** View customer list, booking history, notes.
- **Reviews:** View and respond to reviews.
- **Reports:** Revenue, booking volume, popular services, staff utilization (charts, date range filters).
- **Settings:** Payment account setup (Stripe Connect onboarding), notification preferences, cancellation policy.
- Role-based sub-accounts: owner can create staff-only accounts with limited permissions.
- Mobile-responsive for on-the-go management.

### 2.17 Admin Dashboard
**Priority:** P1

**Description:**
Platform administration panel for managing users, businesses, disputes, and platform settings.

**Acceptance Criteria:**
- **User Management:** List all users (customers, providers), search, filter, view details, suspend/activate accounts.
- **Business Management:** Approve new business registrations, edit business details, suspend/delete.
- **Category Management:** CRUD service categories and subcategories.
- **Booking Management:** View all bookings, filter by status, date, business; manual override if needed.
- **Review Moderation:** Queue of flagged reviews, approve/reject, delete reviews.
- **Dispute Resolution:** View payment disputes, refund requests, act on them.
- **Financial Reports:** Platform revenue, payouts to businesses, commissions, transaction logs.
- **System Settings:** Commission rates, cancellation policies, notification templates, feature flags.
- **Audit Log:** Track admin actions.
- Role-based admin accounts (super admin, support).

### 2.18 Background Jobs (BullMQ)
**Priority:** P0

**Description:**
Reliable queue system for asynchronous tasks to ensure performance and consistency.

**Acceptance Criteria:**
- **Queue:** Booking expiration – release held slots after 5 minutes if booking not confirmed.
- **Queue:** Send notification (email, push, SMS) – process all outbound notifications reliably with retries.
- **Queue:** Appointment reminders – schedule jobs for 24h and 1h before appointment.
- **Queue:** Payment capture – capture authorized payments after service completion.
- **Queue:** Generate daily/weekly reports for business owners (aggregation).
- **Queue:** Data cleanup – anonymize/delete data after account deletion, archive old bookings.
- **Queue:** Index search data – sync business data to Elasticsearch/Meilisearch.
- All jobs are idempotent, have appropriate retry logic (exponential backoff), and are logged.
- BullMQ with Redis; dashboard for monitoring queue health (Bull Board).

---

## 3. Non-Functional Requirements
- **Performance:** API response < 200ms for 95th percentile; slot availability query < 500ms.
- **Scalability:** Horizontal scaling for API servers; database read replicas; CDN for images.
- **Security:** HTTPS, input validation, rate limiting, OWASP top 10 protection, JWT with short expiry, secure storage.
- **Reliability:** 99.9% uptime SLA; graceful degradation if external services (maps, payment) fail.
- **Accessibility:** WCAG 2.1 AA compliance for web; mobile screen reader support.
- **Localization:** i18n-ready; initially English, French, Spanish.

---

## 4. Feature Priority Matrix
| Feature | Priority | Impact |
|--------|----------|--------|
| User Authentication | P0 | Critical |
| Guest Browse | P0 | High |
| Business Search & Discovery | P0 | Critical |
| Map-based Search | P1 | Medium |
| Business Detail View | P0 | Critical |
| Service Categories | P0 | High |
| Booking Flow | P0 | Critical |
| Appointment Management | P0 | Critical |
| Favorites | P1 | Medium |
| User Profile | P0 | High |
| Availability & Slot Computation | P0 | Critical |
| Shared Types & Design System | P0 | Foundation |
| Reviews & Ratings | P1 | High |
| Payment Integration | P0 | Critical |
| Notifications | P0 | High |
| Provider Portal | P0 | Critical |
| Admin Dashboard | P1 | Medium |
| Background Jobs (BullMQ) | P0 | Foundation |

P0: Must-have for MVP. P1: Should-have for first release after MVP. P2: Nice-to-have (future).

---

## 5. Data Models (Brief)
- **User**: id, role, email, passwordHash, firstName, lastName, phone, avatar, settings, timestamps.
- **Business**: id, ownerId, name, description, address, coordinates, phone, photos, amenities, workingHours, stripeAccountId, status.
- **Staff**: id, businessId, name, photo, specialties, schedule, services.
- **Service**: id, businessId, categoryId, name, description, duration, price, bufferTimeBefore, bufferTimeAfter, active.
- **Appointment**: id, customerId, businessId, staffId, services (array), startTime, endTime, status, notes, paymentId, cancellationReason.
- **Review**: id, appointmentId, customerId, businessId, rating, text, photos, response, helpfulCount.
- **Payment**: id, appointmentId, amount, currency, status, stripePaymentIntentId, stripeCustomerId, receiptUrl.
- **Notification**: id, userId, type, title, body, channels, sentAt, readAt, data.

All models use UUIDs, soft deletes where appropriate, and timestamps.