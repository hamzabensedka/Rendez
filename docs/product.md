# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first appointment booking platform connecting customers with local service providers (salons, spas, barbers, etc.). The app enables users to discover businesses, book services, manage appointments, and pay seamlessly. Providers manage their schedules, services, and clients via a dedicated portal. An admin dashboard oversees platform health. Background jobs handle notifications, reminders, and slot computations.

**Target Users:** End customers, service providers (business owners), platform administrators.

**Platforms:** iOS, Android (React Native), Web (admin/provider portal).

---

## 2. Features

### 2.1 User Authentication
**Description:** Secure sign-up, login, and session management for customers and providers. Supports email/password, social login (Google, Apple), and phone OTP.

**User Stories:**
- As a new user, I want to sign up with email or social account so I can book services.
- As a returning user, I want to log in quickly with biometrics or saved credentials.
- As a provider, I want to register my business and verify my identity.

**Acceptance Criteria:**
- [ ] Sign-up with email/password, Google, Apple, phone number (OTP).
- [ ] Email verification link sent; account activated upon click.
- [ ] Login with email/password, social, phone OTP.
- [ ] Biometric unlock (Face ID/Touch ID) after first login.
- [ ] Forgot password flow with reset link.
- [ ] Session persistence with JWT refresh tokens; auto-logout after 30 days inactivity.
- [ ] Provider registration includes business name, address, category, and document upload for verification (admin approval required).
- [ ] Error states: invalid credentials, network failure, unverified email, blocked account.

**Priority:** P0 (Must-have)

---

### 2.2 Guest Browse & Explore
**Description:** Unauthenticated users can browse businesses, view details, and check availability without signing up. Booking requires authentication.

**User Stories:**
- As a guest, I want to explore salons near me to decide if I want to sign up.
- As a guest, I want to see service menus and prices.

**Acceptance Criteria:**
- [ ] Home screen shows featured businesses, categories, and search bar.
- [ ] Guest can search by keyword, location, category.
- [ ] Guest can view business detail page (photos, services, reviews, map).
- [ ] Guest can select a service and see available slots (requires location permission for distance).
- [ ] On tapping “Book”, prompt to sign up/login with seamless return to booking flow.
- [ ] No personalization or favorites for guests.

**Priority:** P0

---

### 2.3 Business Search & Discovery
**Description:** Full-text search with filters and sorting to help users find the right provider.

**User Stories:**
- As a user, I want to search for “haircut” and filter by rating, price, distance.
- As a user, I want to see trending or recommended businesses.

**Acceptance Criteria:**
- [ ] Search bar with autocomplete (business name, service, category).
- [ ] Filters: category, price range, rating, distance, availability (today, this week), gender preference.
- [ ] Sort by: relevance, rating, distance, price low-high, popularity.
- [ ] Results display: thumbnail, name, rating, distance, price from, next available slot.
- [ ] Infinite scroll with pagination.
- [ ] Empty state: “No results found. Try adjusting filters.”
- [ ] Recent searches saved locally.

**Priority:** P0

---

### 2.4 Map-based Search
**Description:** Interactive map view to discover businesses geographically.

**User Stories:**
- As a user, I want to see salons on a map around my location.
- As a user, I want to move the map and search this area.

**Acceptance Criteria:**
- [ ] Toggle between list view and map view on search results.
- [ ] Map shows business pins with rating and price level.
- [ ] Clustering for dense areas.
- [ ] Tap pin to show preview card (name, rating, next slot, distance).
- [ ] “Search this area” button when map is moved.
- [ ] Current location button to re-center.
- [ ] Map respects selected filters.

**Priority:** P1 (High)

---

### 2.5 Business Detail View
**Description:** Comprehensive profile for a business, driving booking decisions.

**User Stories:**
- As a user, I want to see all services, photos, reviews, and location before booking.

**Acceptance Criteria:**
- [ ] Hero image carousel with lightbox.
- [ ] Business name, rating, review count, address, distance, open/closed status.
- [ ] Action buttons: Favorite, Share, Directions (opens maps).
- [ ] Tabbed sections: Services, Reviews, About, Photos.
- [ ] Services tab: list of services with name, duration, price, description; “Book” button per service.
- [ ] Reviews tab: summary (average, distribution), list with sorting (recent, highest, lowest), user can mark helpful.
- [ ] About tab: description, amenities, business hours, payment methods, COVID-19 measures.
- [ ] Sticky bottom bar with “Book Now” (if single service) or “Select Service”.
- [ ] Loading skeleton; error state with retry.

**Priority:** P0

---

### 2.6 Service Categories
**Description:** Hierarchical category system for organizing businesses and services.

**User Stories:**
- As a user, I want to browse by category (Hair, Nails, Massage) to discover services.

**Acceptance Criteria:**
- [ ] Home screen category grid with icons (e.g., Hair, Nails, Spa, Barbershop, Makeup, Wellness).
- [ ] Category detail page shows subcategories (e.g., Hair > Women’s Haircut, Men’s Haircut, Coloring) and top businesses.
- [ ] Categories are managed by admin; providers select from predefined list during registration.
- [ ] Dynamic ordering based on popularity.

**Priority:** P0

---

### 2.7 Booking Flow
**Description:** Step-by-step booking from service selection to confirmation.

**User Stories:**
- As a user, I want to book a haircut for next Tuesday at 2 PM with my preferred stylist.

**Acceptance Criteria:**
- [ ] Flow: Service selection → Staff selection (optional) → Date & Time → Review & Confirm → Payment (if required) → Confirmation.
- [ ] Service selection: choose from business’s service list; can select multiple services (combo).
- [ ] Staff selection: show staff members with photo, rating; “Any available” default.
- [ ] Date/time: calendar with available days highlighted; time slots based on real-time availability (see 2.11). Show duration and price.
- [ ] Review: summary of service, staff, date, time, price, any add-ons; option to add notes.
- [ ] Payment: if business requires prepayment, integrate Stripe/PayPal; else just confirm.
- [ ] Confirmation screen with booking ID, details, option to add to calendar, share.
- [ ] Booking requires authentication; guest prompted to login/signup, then resume.
- [ ] Handle concurrent slot booking: if slot taken during flow, show error and suggest alternatives.
- [ ] Loading states, validation errors (e.g., past date).

**Priority:** P0

---

### 2.8 Appointment Management
**Description:** Users can view, reschedule, cancel upcoming appointments; providers manage their bookings.

**User Stories:**
- As a user, I want to see my upcoming and past appointments.
- As a user, I want to reschedule or cancel if my plans change.
- As a provider, I want to see my daily schedule and manage bookings.

**Acceptance Criteria:**
- [ ] User “My Appointments” tab: Upcoming (sorted by date), Past, Cancelled.
- [ ] Each appointment card: business name, service, date/time, staff, status (confirmed, pending, completed, cancelled).
- [ ] Actions: Reschedule (opens booking flow with pre-selected service, new date/time), Cancel (with reason, confirmation dialog).
- [ ] Cancellation policy: free cancellation up to X hours before; late cancellation may incur fee (configurable by business).
- [ ] Push notification reminders 24h and 1h before appointment.
- [ ] Provider portal: calendar view of appointments, ability to confirm, cancel, mark no-show, add notes.
- [ ] Provider can block time slots manually.
- [ ] Real-time sync across user and provider views.

**Priority:** P0

---

### 2.9 Favorites
**Description:** Users can save favorite businesses for quick access.

**User Stories:**
- As a user, I want to bookmark my go-to salon so I can book faster.

**Acceptance Criteria:**
- [ ] Heart icon on business card and detail page; toggle to add/remove.
- [ ] “Favorites” tab in user profile showing list of saved businesses.
- [ ] Favorites persist across devices (synced to backend).
- [ ] Empty state: “No favorites yet. Explore businesses.”
- [ ] Unfavorite confirmation (optional).

**Priority:** P1

---

### 2.10 User Profile
**Description:** Central place for user’s personal information, preferences, and history.

**User Stories:**
- As a user, I want to manage my profile, payment methods, and notification settings.

**Acceptance Criteria:**
- [ ] Profile screen: avatar, name, email, phone.
- [ ] Edit profile: change name, phone, profile picture (camera/gallery).
- [ ] Saved payment methods (cards) with ability to add/delete.
- [ ] Notification preferences: push, email, SMS toggles for reminders, promotions.
- [ ] Booking history: list of past appointments with option to rebook.
- [ ] Logout, delete account (with confirmation and data deletion compliance).
- [ ] Link to terms, privacy, support.

**Priority:** P1

---

### 2.11 Availability & Slot Computation
**Description:** Real-time engine that calculates available time slots based on business hours, staff schedules, existing bookings, and service duration.

**User Stories:**
- As a user, I want to see only times that are actually bookable.
- As a provider, I want my availability automatically updated when bookings are made.

**Acceptance Criteria:**
- [ ] Slot computation considers: business working hours (including breaks), staff working hours, service duration, buffer time between appointments, existing bookings, holidays, and provider blocks.
- [ ] Slots are generated dynamically for a given date, staff, and service.
- [ ] Concurrency: when a slot is selected, it is temporarily reserved (e.g., 10 min hold) during booking flow; if not confirmed, released.
- [ ] Background job (BullMQ) recalculates availability when a booking is created, cancelled, or provider schedule changes.
- [ ] API returns available slots as time ranges (e.g., “09:00”, “09:30”) with staff options.
- [ ] Performance: slot computation for a day must complete under 500ms.
- [ ] Edge cases: multi-service bookings (sum durations), overlapping staff schedules, last-minute bookings.

**Priority:** P0

---

### 2.12 Shared Types & Design System
**Description:** Unified TypeScript types and reusable UI components to ensure consistency across frontends.

**User Stories:**
- As a developer, I want shared types and components to reduce duplication and bugs.

**Acceptance Criteria:**
- [ ] Shared types package (e.g., `@planity/shared-types`) with interfaces for User, Business, Service, Booking, Review, etc.
- [ ] Design system library (React Native / web) with atoms: Button, Input, Card, Avatar, Rating, Modal, etc.
- [ ] Theming: colors, typography, spacing tokens.
- [ ] Components handle loading, empty, error, and disabled states.
- [ ] Accessibility: proper labels, contrast, touch targets.
- [ ] Documentation via Storybook.

**Priority:** P0 (foundational)

---

### 2.13 Reviews & Ratings
**Description:** Users can rate and review businesses after a completed appointment.

**User Stories:**
- As a user, I want to leave a review to share my experience.
- As a user, I want to read honest reviews to choose a business.

**Acceptance Criteria:**
- [ ] After appointment completion, prompt user to rate (1-5 stars) and write review (optional text, photos).
- [ ] Review submission: text max 500 chars, up to 5 photos.
- [ ] Reviews displayed on business detail with author name, date, rating, text, photos.
- [ ] Business average rating and distribution updated asynchronously.
- [ ] Users can edit/delete their own reviews.
- [ ] Providers cannot delete reviews but can report inappropriate content.
- [ ] Admin can moderate reviews (hide/approve).
- [ ] Sorting and filtering: most recent, highest, lowest, with photos.

**Priority:** P1

---

### 2.14 Payment Integration
**Description:** Secure payment processing for prepaid bookings, no-shows, or cancellation fees.

**User Stories:**
- As a user, I want to pay securely with my credit card.
- As a provider, I want to receive payouts for my services.

**Acceptance Criteria:**
- [ ] Integrate Stripe (or equivalent) for payment processing.
- [ ] Support credit/debit cards, digital wallets (Apple Pay, Google Pay).
- [ ] Payment flow: user enters card details (or uses saved card) at booking confirmation if prepayment required.
- [ ] PCI compliance: card data tokenized; never stored on our servers.
- [ ] Handle payment failures gracefully with retry option.
- [ ] Receipts sent via email after successful payment.
- [ ] Refund capability for cancellations (according to policy) via admin/provider portal.
- [ ] Provider payouts: platform holds funds and disburses to provider’s connected Stripe account (minus commission).
- [ ] Transaction history for users and providers.

**Priority:** P1 (can launch with cash/card at venue, but essential for prepay model)

---

### 2.15 Notifications
**Description:** Push, email, and in-app notifications to keep users and providers informed.

**User Stories:**
- As a user, I want reminders so I don’t miss my appointment.
- As a provider, I want to be notified of new bookings.

**Acceptance Criteria:**
- [ ] Push notifications via Firebase Cloud Messaging (FCM) / APNs.
- [ ] Email notifications via SendGrid or similar.
- [ ] In-app notification center with badge count.
- [ ] Notification types:
  - Booking confirmation (user & provider)
  - Reminder 24h and 1h before (user)
  - Cancellation/reschedule (both)
  - Review request after appointment (user)
  - Promotional/marketing (user, opt-in)
  - Provider: new booking, cancellation, low inventory alert.
- [ ] User preferences to toggle channels per type.
- [ ] Deep linking: tapping notification opens relevant screen (e.g., appointment detail).
- [ ] Background job (BullMQ) to schedule and dispatch notifications.
- [ ] Handle offline: queue notifications and send when device online.

**Priority:** P0 (reminders critical for no-shows)

---

### 2.16 Provider / Business Owner Portal
**Description:** Web and mobile portal for providers to manage their business, services, staff, schedule, and clients.

**User Stories:**
- As a salon owner, I want to set my working hours, add services, and manage my staff.
- As a provider, I want to view my daily appointments and client details.

**Acceptance Criteria:**
- [ ] Dashboard: today’s appointments, revenue summary, new clients.
- [ ] Calendar: day/week/month view with appointments; drag to reschedule; click for details.
- [ ] Client management: list of clients with visit history, notes, contact.
- [ ] Services management: CRUD for services (name, duration, price, description, category, color).
- [ ] Staff management: add/remove staff, assign services, set individual working hours, permissions.
- [ ] Business profile: edit name, description, photos, address, phone, business hours, amenities.
- [ ] Availability settings: set regular hours, breaks, holidays, buffer times, advance booking window.
- [ ] Notifications preferences.
- [ ] Reports: revenue, bookings, popular services, client retention (basic).
- [ ] Multi-language support (at least EN, FR).
- [ ] Responsive web design; mobile-optimized.

**Priority:** P0 (providers are core)

---

### 2.17 Admin Dashboard
**Description:** Super admin panel to manage platform, users, providers, and content.

**User Stories:**
- As an admin, I want to approve new provider registrations.
- As an admin, I want to monitor platform metrics and resolve disputes.

**Acceptance Criteria:**
- [ ] Dashboard: key metrics (total bookings, revenue, active users, providers).
- [ ] Provider management: list with status (pending, active, suspended), approve/reject, view details, manage commission.
- [ ] User management: search, view, suspend/delete accounts.
- [ ] Booking management: view all bookings, filter, cancel/refund if needed.
- [ ] Review moderation: queue of reported reviews, approve/hide.
- [ ] Category management: add/edit/delete service categories and subcategories.
- [ ] Promotions: create promo codes, send push notifications to segments.
- [ ] Configuration: global settings (commission rate, cancellation policy, etc.).
- [ ] Audit log for sensitive actions.
- [ ] Role-based access: super admin, support agent.

**Priority:** P1 (can start with minimal, but needed for launch)

---

### 2.18 Background Jobs (BullMQ)
**Description:** Asynchronous job processing for non-blocking operations like notifications, slot computation, and data cleanup.

**User Stories:**
- As a system, I want to send reminders without delaying API responses.

**Acceptance Criteria:**
- [ ] Job queues: notifications (email, push), slot recalculation, review prompts, data export, cleanup.
- [ ] Reliable execution with retries and dead-letter queue.
- [ ] Scheduled jobs: appointment reminders (24h, 1h before), follow-up review requests (2h after appointment end).
- [ ] Slot recalculation triggered by booking changes, schedule updates; debounced to avoid thundering herd.
- [ ] Monitoring dashboard (Bull Board) for queue health.
- [ ] Idempotency: duplicate job prevention.
- [ ] Graceful degradation: if queue down, API still functions; jobs queued when Redis available.

**Priority:** P0 (core infrastructure)

---

## 3. Non-Functional Requirements
- **Performance:** API response < 200ms p95; slot computation < 500ms; app cold start < 2s.
- **Scalability:** Support 100k concurrent users; horizontal scaling of services.
- **Security:** HTTPS, JWT with rotation, input sanitization, rate limiting, GDPR compliance (data export, deletion).
- **Reliability:** 99.9% uptime; graceful error handling; offline support for viewing cached data.
- **Accessibility:** WCAG 2.1 AA for web; screen reader support on mobile.
- **Localization:** Support English and French initially; extendable.

---

## 4. Prioritization Summary
- **P0 (Must-have for MVP):** Authentication, Guest Browse, Search & Discovery, Business Detail, Service Categories, Booking Flow, Appointment Management, Availability & Slot Computation, Shared Types & Design System, Notifications, Provider Portal, Background Jobs.
- **P1 (High priority, soon after MVP):** Map-based Search, Favorites, User Profile, Reviews & Ratings, Payment Integration, Admin Dashboard.
- **P2 (Nice to have):** Advanced analytics, loyalty programs, multi-language beyond EN/FR, social sharing, waitlist.

---

## 5. Glossary
- **Provider/Business Owner:** Salon, spa, or barbershop owner/staff.
- **Slot:** A bookable time interval for a specific service and staff.
- **Buffer:** Time gap between appointments for cleanup/preparation.
- **Commission:** Percentage fee taken by platform from each transaction.
