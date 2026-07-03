# Product Specification: Planity Clone

## 1. Introduction
Planity Clone is a mobile-first appointment booking application for beauty and wellness services, connecting customers with salons, spas, barbers, and other providers. It enables discovery, booking, and management of appointments, while providing businesses a portal to manage services, staff, and schedules. The platform consists of a customer mobile app (iOS/Android), a provider web portal, and an admin dashboard. Background jobs handle notifications, reminders, and slot updates.

## 2. Product Goals
- Enable users to easily discover and book beauty/wellness services.
- Streamline appointment management for customers and providers.
- Provide map-based and category-based discovery.
- Offer a seamless payment experience.
- Support guest browsing with limited friction.
- Deliver reliable, real-time availability and slot calculation.
- Build a scalable platform with admin oversight, reviews, and notifications.

## 3. User Personas
- **Customer:** End user looking for beauty services, books and manages appointments.
- **Business Owner:** Manages a salon or spa, sets up services, staff schedules, and bookings.
- **Service Provider/Staff:** Employee whose calendar is managed (may share owner functions).
- **Admin:** Platform administrator managing businesses, users, and content.

## 4. Feature Specifications

### 4.1 User Authentication
**Priority:** P0 (Must-have)  
Customers and providers must be able to create accounts and log in securely.

**Acceptance Criteria:**
- Registration with email/password, phone number, or social login (Google, Apple, Facebook).
- Email verification required before first booking (configurable).
- Login via email/password, social, or magic link.
- Forgot password flow with email reset link.
- JWT-based session management; refresh token rotation.
- Role-based access (customer, provider, admin) assigned at registration.
- Guest users can browse but are prompted to log in before booking/adding favorites.
- Error messages for invalid credentials, duplicate accounts, etc.

### 4.2 Guest Browse & Explore
**Priority:** P0  
Unregistered users can discover businesses and view details to encourage sign-up.

**Acceptance Criteria:**
- Guests can search, filter, and view business listings and details.
- Full access to maps, categories, business profiles, services, and reviews.
- Restrict booking, favoriting, and adding reviews to logged-in users; show login prompt with clear value proposition.
- No personal data stored for guests.

### 4.3 Business Search & Discovery
**Priority:** P0  
Search and filter functionality to find businesses.

**Acceptance Criteria:**
- Search bar with auto-complete for business names, service types, and locations.
- Filters: distance, rating, price range, availability (today/tomorrow/this week), gender preferences, amenities (WiFi, parking).
- Sort: relevance, rating, distance, price low/high, soonest availability.
- Results displayed as cards with image, name, rating, distance, next available slot.
- Integrated with map view toggle.
- Search history and recent searches for logged-in users.
- Empty state when no results match.

### 4.4 Map-based Search
**Priority:** P0  
Interactive map to discover businesses geographically.

**Acceptance Criteria:**
- Map view (Google Maps/Mapbox) with location permission request.
- Business markers clustering at distant zoom levels.
- Tapping a marker shows a preview card with business name, rating, distance, and next slot; tap card navigates to detail.
- Map center defaults to user’s current location or specified search location.
- Re-centering and radius controls.
- Seamless toggle between list and map views, preserving filters.
- Performance-optimized for hundreds of markers.

### 4.5 Business Detail View
**Priority:** P0  
Comprehensive business profile page.

**Acceptance Criteria:**
- Hero image carousel, business name, rating (stars + count), address with map thumbnail, distance, status (open/closed, busy).
- Tabbed sections: About, Services, Reviews, Photos, Staff (optional).
- About: description, amenities, hours of operation with real-time open/closed indicator, contact info (phone, directions, website).
- Services: list of services categorized (hair, nails, massage, etc.) with name, duration, price (starting from), booking button.
- Tapping a service opens booking flow pre-selected.
- Reviews: paginated list with summary stats, ability to add review (if logged in and has visited).
- Photos: grid view with lightbox, option to upload customer photos (if policy allows).
- Availability overview: next 7 days showing time slots count.
- Share business profile.

### 4.6 Service Categories
**Priority:** P0  
High-level categories to guide exploration.

**Acceptance Criteria:**
- Home screen or discover tab with tappable category icons (Hair, Nails, Massage, Skincare, Makeup, Barbershop, Spa, etc.).
- Each category leads to a filtered list/map of businesses offering related services.
- Category metadata includes icon, name, search keywords.
- Admin can add/modify categories dynamically.
- Categories displayed based on user’s location or selected area.

### 4.7 Booking Flow
**Priority:** P0  
Core end-to-end booking process.

**Acceptance Criteria:**
- Flow starts from service selection, staff selection (if multiple), date, time slot.
- Calendar view with available dates highlighted; blocked dates grayed out or hidden.
- Time slot list shows available times for chosen date; dynamically generated based on staff working hours, existing bookings, breaks, and service duration.
- Option to select staff member (random assignment if not selected) showing photo, name, rating.
- Summary screen: service, staff, date, time, price, duration, location.
- Promo code field with validation.
- Terms and conditions checkbox.
- Booking button triggers payment if service requires prepayment; otherwise confirms free.
- Guest users are prompted to log in or register as a quick single-step flow, then continue booking.
- Success confirmation with booking details and option to add to calendar, share, or view appointment.
- Error handling: slot no longer available, payment failure, etc.

### 4.8 Appointment Management
**Priority:** P0  
Users can view, modify, and cancel bookings.

**Acceptance Criteria:**
- Upcoming and past appointments list (cards with business name, service, date/time, status).
- Appointment statuses: Confirmed, Pending (if manual confirmation), Completed, Canceled, No-show.
- Reschedule flow: select new date/time from available slots; maintain same service/staff; cancellation/reschedule policy dialog if applicable.
- Cancel flow: reason selection, confirmation dialog, policy display (e.g., refund rules).
- Push notification and email reminders: 24h and 1h before.
- Add to device calendar (via .ics file or direct integration).
- View appointment details: status, date, duration, staff, location, price, payment status.
- Ability to leave a review after completion.
- Rebook option.

### 4.9 Favorites
**Priority:** P1 (Should-have)  
Save businesses for quick access.

**Acceptance Criteria:**
- Heart icon on business cards and detail page; toggle to save/unsave.
- Dedicated “Favorites” list with sorting (recently added, name, distance).
- Display favorite businesses on home feed for logged-in users.
- Synced across devices when logged in.

### 4.10 User Profile
**Priority:** P1  
Central hub for account settings and personal info.

**Acceptance Criteria:**
- Personal info: name, email, phone, profile photo.
- Password change.
- Communication preferences: push, email, SMS toggles.
- Saved payment methods management (add, delete, set default).
- Appointment history linked.
- Favorites list.
- Notification settings per type.
- Logout, account deletion with confirmation and data deletion.
- Language and region settings.

### 4.11 Availability & Slot Computation
**Priority:** P0 (backend/algorithm)  
Accurate, real-time availability engine.

**Acceptance Criteria:**
- Staff working hours and breaks defined by provider (recurring or custom dates).
- Service duration determines slot length; buffer time between appointments configurable.
- Bookings, blocks, and holidays are considered.
- Slots computed for the next N days (e.g., 60 days).
- Slot generation must handle overlapping shifts, multiple staff.
- API returns available time slots for a given date, staff, service, and location.
- Concurrency handling: slot is reserved during payment to prevent double booking (optimistic locking or temporary hold with expiry).
- Background job recalculates slots when staff schedule or bookings change (via BullMQ).
- Performance: slot list for a business should respond under 300ms.

### 4.12 Shared Types & Design System
**Priority:** P0 (foundational)  
Consistent UI/UX and shared TypeScript types.

**Acceptance Criteria:**
- Design system includes typography, color palette, spacing, shadows, border radius, component library (buttons, inputs, cards, modals, etc.).
- Shared TypeScript interfaces for all domain entities: User, Business, Service, Staff, Appointment, Review, Payment, Notification.
- Storybook or similar documentation for UI components.
- Responsive design for mobile (primary) and tablet.
- Accessibility: minimum contrast, touch targets, screen reader support.
- Dark mode support.

### 4.13 Reviews & Ratings
**Priority:** P1  
Users can rate and review businesses and optionally staff.

**Acceptance Criteria:**
- Only customers with completed appointments can leave a review (verified badge).
- Rating: 1-5 stars.
- Text review with optional photo upload (max 3).
- Moderation: auto-flag profanity; manual review queue in admin.
- Business average rating updated asynchronously (via job on new review).
- Review sorting: most recent, highest/lowest rated.
- Helpful/not helpful voting.
- Provider can respond publicly to reviews (one response per review).
- Report functionality for inappropriate content.

### 4.14 Payment Integration
**Priority:** P0  
Secure payment processing for service bookings.

**Acceptance Criteria:**
- Integration with Stripe or similar PSP.
- Supports card payments, digital wallets (Apple Pay, Google Pay).
- Prepayment: capture amount at booking if required by business; post-payment (pay at venue) option.
- Payment flow during booking: card input or saved card selection, CVV if needed, confirm.
- Payment status: pending, authorized, captured, refunded, failed.
- Refund/cancelation logic triggers partial or full refunds based on business policy.
- PCI compliance via tokenization; no raw card data stored.
- Receipt email after successful payment.
- Saved payment methods (tokenization).

### 4.15 Notifications
**Priority:** P0  
Timely communication with users.

**Acceptance Criteria:**
- Channels: push (mobile), email, in-app.
- Triggers: booking confirmation, reminder (24h, 1h), rescheduling, cancelation, review request, promotional offers (opt-in).
- Personalized notification settings per channel.
- Providers: booking notifications (new, canceled, rescheduled), staff assignment changes.
- Rich push with deep links (e.g., open appointment details).
- Background jobs (BullMQ) to schedule and dispatch notifications.
- Fallback: ensure delivery even if one channel fails.
- Notification center in app with read/unread status.

### 4.16 Provider / Business Owner Portal
**Priority:** P0  
Web-based dashboard for businesses to manage their profile, services, staff, and bookings.

**Acceptance Criteria:**
- Business registration flow: business details, address, hours, logo, photos, description, payment setup (Stripe Connect for marketplace).
- Dashboard with key metrics: upcoming appointments, total revenue, new reviews.
- Calendar view: daily/weekly/monthly with appointments, staff filters.
- Appointment management: view details, confirm/cancel/reschedule, add notes, accept walk-in.
- Staff management: add/edit/remove staff, assign services, set working hours, breaks, and time off.
- Service management: CRUD for services with name, description, duration, price, category, prepay requirement, buffer time, photo.
- Availability override: block off dates/hours for holidays, meetings.
- Customer management: view customer list, booking history, notes.
- Reviews: respond to reviews, flag inappropriate.
- Settings: notification preferences, business info, payment account.
- Embeddable booking widget for business’s website (future).

### 4.17 Admin Dashboard
**Priority:** P1  
Platform administration for monitoring and moderation.

**Acceptance Criteria:**
- User management: list, search, suspend/ban, view profiles.
- Business management: approve/reject new businesses, edit, suspend, view metrics.
- Review moderation queue: approve, reject, delete, respond as admin.
- Category management.
- System metrics: total users, bookings, revenue, GMV, active businesses.
- Configuration: global settings (booking windows, cancelation policy defaults, platform fee percentage).
- Reports: revenue, booking trends, export CSV.
- Role-based access: super admin, support.
- Activity log for sensitive actions.

### 4.18 Background Jobs (BullMQ)
**Priority:** P0 (infra)  
Reliable job processing for asynchronous tasks.

**Acceptance Criteria:**
- Jobs defined for: slot recalculation on schedule/booking changes, sending notifications, email dispatch, generating reports, data cleanups.
- Use BullMQ with Redis; queues: notifications, email, slots, analytics.
- Retry logic with exponential backoff, dead letter queue.
- Job idempotency where needed to avoid duplicate notifications.
- Monitoring via Bull-Board for failed jobs and queue sizes.
- Concurrency control per queue.
- Scheduled and delayed jobs (reminders).

## 5. Non-Functional Requirements
- **Performance:** Page loads <2s on 3G, API p95 <200ms, real-time slot computation under 300ms.
- **Scalability:** Microservices-friendly architecture; support 100k concurrent users.
- **Security:** HTTPS, JWT, OWASP top 10 cover, PII encryption at rest, GDPR compliance.
- **Reliability:** 99.9% uptime, automatic failover.
- **Localization:** i18n ready for multiple languages and currencies.

## 6. Data Model Highlights
- **User:** id, email, phone, name, role, settings, etc.
- **Business:** id, name, address, geo, hours, amenities, ownerId, status.
- **Service:** id, businessId, name, description, duration, price, category.
- **Staff:** id, businessId, name, photo, services[], schedule.
- **Appointment:** id, customerId, businessId, staffId, serviceId, start, end, status, paymentStatus.
- **Review:** id, customerId, businessId, appointmentId, rating, text, photos.
- **Payment:** id, appointmentId, amount, method, status, transactionId.
- **Notification:** id, userId, type, channel, content, status, sentAt.

## 7. Prioritization & Releases
- **MVP (P0):** Auth (email/social), guest browse, search/filters, map, business detail, booking flow with slot computation, appointment management, payment (prepay), notifications (essential), provider portal (basic business/services/staff/bookings), background jobs, shared types.
- **V1.1 (P1):** Favorites, user profile enhancements, reviews & ratings, admin dashboard (basic moderation), recurring bookings.
- **V2:** Subscription plans, loyalty program, advanced analytics, marketing tools.

## 8. Glossary
- **Slot:** A specific time window available for booking.
- **Buffer Time:** Extra time after a service for cleanup/preparation.
- **Prepayment:** Payment taken at time of booking.
- **Venue Payment:** Customer pays at the business.
