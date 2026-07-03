# Product Specification: Planity Clone

## 1. Overview
Planity Clone is a mobile-first beauty and wellness booking platform. It connects customers with local service providers (salons, spas, barbers, etc.), enabling discovery, seamless appointment booking, and management. The platform consists of three main interfaces: Customer App (mobile web/PWA), Provider Portal (web), and Admin Dashboard (web).

## 2. User Personas
- **Customer**: End user searching for services, booking appointments, managing favorites and profile.
- **Business Owner (Provider)**: Salon/spa manager who sets up services, staff, availability, views bookings, and manages their business.
- **Admin**: Superuser managing platform settings, moderation, analytics.

## 3. Feature Specifications
### 3.1 User Authentication (P0)
- **Goal**: Secure sign-up/login for customers and providers.
- **User Stories**: As a user, I want to sign up using email/password or social login (Google/Apple) so I can access personalised features.
- **Acceptance Criteria**:
  - Customer can register with email, password, first name, last name.
  - Social login (Google, Apple) completes registration with minimal fields.
  - Password reset via email.
  - Session persistence with JWT (access & refresh tokens).
  - Provider sign-up requires business details and verification (email confirmation).
  - Logout clears session.

### 3.2 Guest Browse & Explore (P0)
- **Goal**: Unauthenticated users can browse businesses and services without creating an account.
- **User Stories**: As a guest, I want to see popular categories and featured businesses to decide if the app is useful.
- **Acceptance Criteria**:
  - Home screen shows curated business lists, popular categories, search bar.
  - Guest can view business details and service lists.
  - Booking button prompts login/sign-up.
  - All browsing data is public; no personalization required.

### 3.3 Business Search & Discovery (P0)
- **Goal**: Efficient text-based search with filters.
- **User Stories**: As a customer, I want to search for a specific business or service type and filter results by location, rating, price.
- **Acceptance Criteria**:
  - Search input with autocomplete suggestions (business names, service keywords).
  - Results list with business name, rating, distance, thumbnail.
  - Filter: distance (radius or city), rating (min), price range (if supported), open now.
  - Sort: relevance, rating, distance.
  - Pagination / infinite scroll.
  - Backend search uses full-text search on name and services.

### 3.4 Map-based Search (P1)
- **Goal**: Discover businesses via interactive map.
- **User Stories**: As a customer, I want to see businesses on a map near my location so I can choose based on proximity.
- **Acceptance Criteria**:
  - Map view toggle on search results.
  - Map shows business pins; tap to see summary card.
  - Clustering for dense areas.
  - Map updates when filters change (radius).
  - Use geolocation to center map.

### 3.5 Business Detail View (P0)
- **Goal**: Comprehensive business page with services, reviews, and booking CTA.
- **User Stories**: As a customer, I want to view all services, staff, photos, reviews, and availability before booking.
- **Acceptance Criteria**:
  - Header: cover image, name, rating, address, open/closed status, favorite button.
  - Services tab: list with name, duration, price, "Book" button.
  - Staff tab (if multi-staff): each staff with avatar, specialty, rating.
  - Reviews tab: aggregated rating, list of reviews with pagination.
  - Gallery: carousel of images.
  - Info: working hours, amenities, description.
  - All CTA ("Book") lead to booking flow, pre-selecting service/staff if applicable.

### 3.6 Service Categories (P0)
- **Goal**: Organized browsing by category (Hair, Nails, Massage, etc.).
- **User Stories**: As a customer, I want to explore businesses by category without typing.
- **Acceptance Criteria**:
  - Home screen category grid with icons.
  - Categories can be nested (e.g., Hair > Women's Haircut). Admin configurable.
  - Clicking category opens search results filtered by that category.
  - Businesses can assign multiple categories to their services.

### 3.7 Booking Flow (P0)
- **Goal**: Seamless multi-step booking: service → staff → time → confirmation → payment.
- **User Stories**: As a customer, I want to book an appointment in a few taps, with clear date/time selection.
- **Acceptance Criteria**:
  - Step 1: Select service (if not pre-selected) and optionally staff member.
  - Step 2: Calendar view showing available dates, skipping fully booked days.
  - Step 3: Time slots based on real-time availability (computed via backend). Show pricing.
  - Step 4: Review summary (business, service, staff, date, time, price), fill any intake form (if required).
  - Step 5: Payment (see 3.13) or confirm free booking; then success screen with appointment details.
  - Booking requires authentication; guest redirected to login/signup, then back to checkout.
  - Real-time slot locking: slot held for 5 minutes during payment.
  - Validation against double bookings and business rules (working hours, buffer times).

### 3.8 Appointment Management (P0)
- **Goal**: Customers can view upcoming and past appointments, reschedule or cancel.
- **User Stories**: As a customer, I want to see my bookings, get reminders, and change plans if needed.
- **Acceptance Criteria**:
  - List separated into Upcoming and History.
  - Upcoming: date, time, business, service, status (confirmed, pending, in-progress).
  - Cancel: with cancellation policy warning (e.g., free until 24h). After cancellation, slot released.
  - Reschedule: open reschedule flow, re-select time (same service/staff). Previous slot released upon confirmation.
  - Push notification reminders 24h and 1h before (if enabled).
  - History: past appointments, with option to leave review.

### 3.9 Favorites (P1)
- **Goal**: Save preferred businesses for quick access.
- **User Stories**: As a customer, I want to bookmark businesses I like.
- **Acceptance Criteria**:
  - Toggle favorite (heart icon) from business card and detail page.
  - Dedicated Favorites screen listing saved businesses.
  - Sync across devices (per user).
  - Unfavorite removes from list.

### 3.10 User Profile (P0)
- **Goal**: Manage personal information, login methods, notification preferences.
- **User Stories**: As a customer, I want to edit my name, phone, email, and see my booking history.
- **Acceptance Criteria**:
  - Edit name, email, phone (with OTP verification for phone).
  - Manage social login connections.
  - Notification preferences: push, email, SMS toggles.
  - Link to Payment Methods (if stored).
  - Delete account (GDPR compliant).

### 3.11 Availability & Slot Computation (P0)
- **Goal**: Backend service computing real-time available time slots for any business/service/staff combination.
- **User Stories**: As a system, ensure booking slots are accurate and prevent conflicts.
- **Acceptance Criteria**:
  - Algorithm inputs: business working hours (daily start/end, breaks), staff schedules, service duration, buffer times, existing bookings.
  - Output: list of available start times for a given date (e.g., 30-minute intervals).
  - Supports multi-staff: if no staff chosen, show any staff available (union of slots).
  - Handles timezone correctly.
  - Caching with Redis for high performance, invalidated on booking changes.
  - Background recalculation via BullMQ jobs when business hours or bookings change.

### 3.12 Shared Types & Design System (P0)
- **Goal**: Consistent data models and UI components across frontends.
- **Acceptance Criteria**:
  - Shared TypeScript types: User, Business, Service, Staff, Booking, Review, Category, AvailabilitySlot.
  - Design system: Typography scale, color palette (primary, secondary, error), spacing units, reusable components (Button, Card, Modal, Input, StarRating, Calendar).
  - All teams use same design tokens.
  - Documented in Storybook.

### 3.13 Reviews & Ratings (P1)
- **Goal**: Customers can rate and review businesses after appointments.
- **User Stories**: As a customer, I want to leave feedback so others can make informed decisions.
- **Acceptance Criteria**:
  - Prompt to review after appointment completion (push notification & in-app).
  - Rating: 1-5 stars, optional text and photos.
  - Business average rating updated asynchronously.
  - Reviews sorted by recency or helpfulness.
  - Provider can respond to reviews (from Provider Portal).
  - Admin can moderate/report inappropriate reviews.

### 3.14 Payment Integration (P0)
- **Goal**: Secure online payment for bookings, support card and digital wallet.
- **User Stories**: As a customer, I want to pay securely to confirm my booking.
- **Acceptance Criteria**:
  - Integration with Stripe (or equivalent) using Payment Intents.
  - Card input via Stripe Elements (PCI-compliant).
  - Support Apple Pay / Google Pay where available.
  - Payment flow: hold slot → create payment intent → confirm → capture on success.
  - Release slot if payment fails or times out (5 min).
  - Booking status updated only after successful payment.
  - Refund support for cancellations (via admin or provider according to policy).
  - Optional: deposit or full payment at booking; configurable per business.

### 3.15 Notifications (P1)
- **Goal**: Keep users informed about booking confirmations, reminders, promotions.
- **User Stories**: As a user, I want to receive timely updates via push, email, or SMS.
- **Acceptance Criteria**:
  - Transactional: booking confirmation, cancellation, reschedule, reminder 24h & 1h before.
  - Channels: push notification (FCM/APN), email, SMS (via Twilio).
  - Preference management in user profile.
  - Mark as read in-app notification center.
  - Marketing/promotions (opt-in), with unsubscribe.
  - Provider notifications: new booking, customer cancellation, review received.

### 3.16 Provider / Business Owner Portal (P1)
- **Goal**: Providers can manage their business, services, staff, schedule, and view bookings.
- **User Stories**: As a business owner, I want to set up my profile so customers can find and book me.
- **Acceptance Criteria**:
  - Dashboard with today’s bookings, upcoming count, revenue summary.
  - Business profile editor: name, description, address, phone, business hours, photos, categories, amenities.
  - Service management: add/edit/delete services, set name, duration, price, category, staff assignment.
  - Staff management: add staff members with name, role, working hours, service assignments, break times.
  - Availability per staff based on working hours and manual overrides (time off, holidays).
  - Booking calendar (day/week view) with customer name, service, status. Mark no-show/complete.
  - Booking settings: lead time, cancellation policy, buffer between appointments, online booking on/off.
  - Review responses: view and reply.
  - Notifications and alerts.
  - Multi-business support for owners with multiple venues.

### 3.17 Admin Dashboard (P2)
- **Goal**: Platform oversight, moderation, and configuration.
- **Acceptance Criteria**:
  - User management: list/search users, suspend/ban.
  - Business management: approve/reject businesses, manage features.
  - Category management: create, edit, reorder categories.
  - Review moderation queue.
  - Configuration: commission rates, cancellation policy templates, global working hours default.
  - Analytics: bookings per day, revenue, new users, top businesses, heatmap.
  - System logs and job monitoring.

### 3.18 Background Jobs (BullMQ) (P0)
- **Goal**: Handle async tasks reliably.
- **User Stories**: As a system, I want to process tasks without blocking user requests.
- **Acceptance Criteria**:
  - Job types: send email, send SMS, send push notification, compute availability slots, generate invoice, cleanup expired payment intents.
  - BullMQ workers with Redis.
  - Retries with exponential backoff.
  - Monitoring via Bull Board or Admin dashboard.
  - Failure alerts for critical jobs.

## 4. Non-functional Requirements
- PWA with offline support for basic browsing.
- Responsive design (mobile-first).
- Performance: page load < 3s on 3G.
- Security: HTTPS, OWASP standards, rate limiting.
- Data privacy: GDPR compliance.

## 5. Prioritization Summary
- **P0 (Must-have)**: Authentication, Guest Browse, Search/Discovery, Business Detail, Categories, Booking Flow, Appointment Management, User Profile, Availability Algorithm, Shared Types/Design System, Payment, Background Jobs.
- **P1 (Should-have)**: Map Search, Favorites, Reviews & Ratings, Notifications, Provider Portal.
- **P2 (Could-have)**: Admin Dashboard, advanced analytics, marketing automation.