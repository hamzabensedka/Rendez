# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with beauty and wellness businesses. It enables users to discover services, book appointments, manage schedules, and pay seamlessly. Business owners manage their offerings, staff, and bookings via a dedicated portal. An admin dashboard oversees platform health. The system uses BullMQ for background job processing (notifications, reminders, payment settlement).

## 2. User Roles
- **Guest**: Unauthenticated user who can browse businesses and services but cannot book.
- **Customer**: Authenticated user with full booking, favorites, profile, and payment capabilities.
- **Provider (Business Owner)**: Manages business profile, services, staff, availability, and appointments.
- **Admin**: Superuser with access to all data, analytics, and moderation tools.

## 3. Features

### 3.1 User Authentication
**Priority: P0 (Must-have)**
- **Description**: Secure sign-up, login, and session management for customers and providers. Supports email/password and social login (Google, Apple).
- **Acceptance Criteria**:
  - Customer can register with email, password, first name, last name.
  - Provider registration requires business name, email, password, and accepts terms.
  - Social login (Google, Apple) works for both roles.
  - Email verification required before first booking (customer) or publishing business (provider).
  - Password reset flow via email.
  - JWT-based authentication with refresh tokens; session persists across app restarts.
  - Logout clears tokens and redirects to home.
  - Error messages for invalid credentials, duplicate email, weak password.

### 3.2 Guest Browse & Explore
**Priority: P0**
- **Description**: Unauthenticated users can explore businesses, services, and reviews without signing up. Booking prompts authentication.
- **Acceptance Criteria**:
  - Guest sees home screen with featured businesses, categories, and search bar.
  - Can view business detail, services, reviews, and map location.
  - Tapping “Book” or “Add to Favorites” triggers login/sign-up modal.
  - No personalization (favorites, history) until authenticated.
  - All public data is accessible without login.

### 3.3 Business Search & Discovery
**Priority: P0**
- **Description**: Full-text search with filters and sorting to find businesses by name, service, location, rating, price, and availability.
- **Acceptance Criteria**:
  - Search bar with autocomplete suggestions (business names, service types).
  - Filters: category, price range, rating, distance, availability (today, this week).
  - Sort by: relevance, rating, distance, price low-to-high/high-to-low.
  - Results display business card (photo, name, rating, distance, next available slot).
  - Search is debounced and returns results within 300ms.
  - Empty state with suggestions to adjust filters.
  - Pagination (infinite scroll).

### 3.4 Map-based Search
**Priority: P1 (Should-have)**
- **Description**: Interactive map showing nearby businesses with clustering and tap-to-detail.
- **Acceptance Criteria**:
  - Map view toggle on search results.
  - Map shows user’s current location (with permission) and business pins.
  - Pin clustering for dense areas.
  - Tapping a pin shows a mini card with name, rating, next slot; tapping card opens detail.
  - Map updates as user pans/zooms; search filters apply.
  - Works with location services off (asks to enable).

### 3.5 Business Detail View
**Priority: P0**
- **Description**: Comprehensive business profile with services, staff, reviews, gallery, and booking CTA.
- **Acceptance Criteria**:
  - Hero image carousel, business name, rating, address, distance, open status.
  - Tabbed sections: Services, About, Reviews, Gallery.
  - Services tab: list of services with name, duration, price, and “Book” button.
  - Staff selection (if multi-staff) with photo and specialties.
  - Reviews tab: average rating, rating distribution, list of reviews with pagination.
  - Gallery: grid of business photos.
  - Sticky bottom bar with “Book Now” button.
  - Share business profile via deep link.
  - Loading skeletons while fetching.

### 3.6 Service Categories
**Priority: P0**
- **Description**: Hierarchical categories (e.g., Hair > Haircut, Coloring) for browsing and filtering.
- **Acceptance Criteria**:
  - Home screen shows top-level categories as icons.
  - Tapping a category navigates to subcategories or directly to businesses if leaf.
  - Category page shows businesses filtered by that category, with same search/filter options.
  - Admin can manage categories (CRUD) in admin dashboard.
  - Categories support images and icons.

### 3.7 Booking Flow
**Priority: P0**
- **Description**: Step-by-step booking: select service, staff (optional), date/time, add-ons, confirm, and pay.
- **Acceptance Criteria**:
  - Flow starts from service “Book” button or business “Book Now”.
  - Step 1: Service selection (if multiple, allow multi-select for combo).
  - Step 2: Staff selection (if applicable, show any available staff or specific).
  - Step 3: Date/time picker showing real-time availability slots (see 3.11).
  - Step 4: Add-ons (extra services) if configured.
  - Step 5: Review summary (service, staff, date, time, price, duration).
  - Step 6: Payment (if required) via integrated gateway (see 3.14).
  - Confirmation screen with booking details and option to add to calendar.
  - Booking requires authentication; guest redirected to login/signup then back to flow.
  - Handle concurrent slot booking with optimistic locking; show error if slot taken.
  - Support promo codes (optional).

### 3.8 Appointment Management
**Priority: P0**
- **Description**: Customers can view, reschedule, cancel upcoming appointments; providers manage their calendar.
- **Acceptance Criteria (Customer)**:
  - “My Appointments” list with tabs: Upcoming, Past.
  - Each appointment card shows business, service, date/time, status.
  - Actions: Reschedule (opens availability for same service/staff), Cancel (with confirmation and cancellation policy notice), Add to Calendar, Get Directions.
  - Reschedule updates slot and notifies provider.
  - Cancellation respects business policy (e.g., free cancel up to 24h before).
  - Past appointments show option to leave review.
- **Acceptance Criteria (Provider)**:
  - Calendar view (day/week) with all appointments.
  - Ability to manually add, edit, cancel appointments.
  - Block time slots (breaks, holidays).
  - Color-coded by staff.
  - Real-time sync across staff.

### 3.9 Favorites
**Priority: P1**
- **Description**: Authenticated users can save businesses to a favorites list for quick access.
- **Acceptance Criteria**:
  - Heart icon on business card and detail view to toggle favorite.
  - “My Favorites” screen lists saved businesses with same card UI.
  - Favorites persist across sessions.
  - Empty state with suggestion to explore.
  - Unfavorite removes from list with undo option.

### 3.10 User Profile
**Priority: P0**
- **Description**: Customer profile management: personal info, payment methods, notification preferences, booking history.
- **Acceptance Criteria**:
  - Edit profile: photo, name, email, phone.
  - Manage saved payment methods (add, delete, set default).
  - Notification settings: push, email, SMS toggles.
  - Booking history (same as My Appointments past).
  - Link to favorites.
  - Delete account option with confirmation and data wipe.
  - All changes sync to backend.

### 3.11 Availability & Slot Computation
**Priority: P0**
- **Description**: Real-time computation of available time slots based on business hours, staff schedules, service duration, existing bookings, and buffers.
- **Acceptance Criteria**:
  - Business sets weekly opening hours, breaks, holidays.
  - Staff have individual working hours and service assignments.
  - Service duration + buffer time (pre/post) defines slot length.
  - Slot engine returns available start times for a given date, service, staff (or any).
  - Handles overlapping bookings, staff concurrency (multiple staff can serve same service).
  - Real-time updates: when a slot is booked, it’s immediately unavailable.
  - API response time < 200ms for slot queries.
  - Support for multi-service bookings (sum durations).
  - Timezone-aware (business local time).

### 3.12 Shared Types & Design System
**Priority: P0**
- **Description**: Consistent UI components, typography, colors, and shared TypeScript types across web and mobile.
- **Acceptance Criteria**:
  - Design tokens: colors (primary, secondary, error, success), spacing, font sizes, border radius.
  - Reusable components: Button, Input, Card, Modal, Avatar, RatingStars, Badge, Tabs, Skeleton.
  - Shared types for User, Business, Service, Booking, Review, etc., used by frontend and backend.
  - Responsive layout for mobile (primary) and tablet.
  - Accessibility: minimum contrast, touch targets 44px, screen reader labels.

### 3.13 Reviews & Ratings
**Priority: P1**
- **Description**: Customers can leave star ratings and text reviews after a completed appointment. Businesses display aggregated ratings.
- **Acceptance Criteria**:
  - After appointment completion, prompt to review via push/email.
  - Review form: star rating (1-5), optional text, optional photo.
  - One review per appointment.
  - Reviews appear on business detail with most recent first.
  - Business average rating updates in real-time.
  - Provider can respond to reviews (public reply).
  - Admin can moderate/hide inappropriate reviews.
  - Review list supports pagination and sorting (newest, highest, lowest).

### 3.14 Payment Integration
**Priority: P0**
- **Description**: Secure payment processing for bookings. Supports card payments and digital wallets (Apple Pay, Google Pay).
- **Acceptance Criteria**:
  - Integration with Stripe (or equivalent) for payment processing.
  - Customer can save multiple payment methods.
  - Payment is captured at booking time (or hold and capture after service, configurable).
  - Supports prepayment, partial payment (deposit), and pay-at-venue options per business.
  - Receipt sent via email after successful payment.
  - Refund flow for cancellations according to policy.
  - PCI compliance: no sensitive card data stored on our servers.
  - Error handling: insufficient funds, expired card, network errors with retry.

### 3.15 Notifications
**Priority: P0**
- **Description**: Push notifications, email, and optional SMS for booking confirmations, reminders, cancellations, and promotions.
- **Acceptance Criteria**:
  - Booking confirmation: push + email immediately after booking.
  - Reminder: push 24h and 1h before appointment (configurable).
  - Cancellation notice to both parties.
  - Reschedule notice.
  - Review request after appointment.
  - Promotional notifications (opt-in).
  - Notification preferences in user profile.
  - Real-time push via FCM/APNs.
  - Email templates with business branding.
  - All notifications queued via BullMQ for reliability.

### 3.16 Provider / Business Owner Portal
**Priority: P0**
- **Description**: Web and mobile portal for providers to manage their business, services, staff, calendar, and bookings.
- **Acceptance Criteria**:
  - Dashboard with today’s appointments, revenue summary, new reviews.
  - Business profile management: name, description, address, photos, opening hours, policies.
  - Service management: CRUD services with name, duration, price, category, description, image, buffer time, add-ons.
  - Staff management: add/edit/remove staff, assign services, set working hours, permissions.
  - Calendar: day/week view, color-coded by staff, drag-and-drop reschedule (web), block time, add walk-in.
  - Booking management: view upcoming/past, cancel, reschedule, mark no-show.
  - Review management: view and respond to reviews.
  - Reports: basic analytics (bookings, revenue, popular services) over time.
  - Multi-location support (if applicable).
  - Real-time updates when appointments change.

### 3.17 Admin Dashboard
**Priority: P1**
- **Description**: Web-based admin panel for platform oversight, user management, moderation, and analytics.
- **Acceptance Criteria**:
  - Dashboard with KPIs: total bookings, revenue, active users, new businesses.
  - User management: list/search customers and providers, view details, suspend/delete accounts.
  - Business management: approve new businesses (if required), edit, suspend.
  - Category management: CRUD service categories.
  - Review moderation: flag/hide inappropriate reviews.
  - Transaction log: view all payments, refunds, disputes.
  - System configuration: global settings (commission rates, cancellation policies, notification templates).
  - Role-based access: only admins can access.
  - Export data to CSV.

### 3.18 Background Jobs (BullMQ)
**Priority: P0**
- **Description**: Asynchronous job processing for non-blocking operations like notifications, reminders, payment settlement, and data cleanup.
- **Acceptance Criteria**:
  - Job queues: notifications (email, push, SMS), reminders, payment capture, review requests, data export.
  - Reliable processing with retries and dead-letter queue.
  - Scheduled jobs: appointment reminders (24h, 1h before), review prompts (after appointment end).
  - Payment settlement: capture funds after service completion if using hold.
  - Monitoring via Bull Board or similar UI.
  - Graceful failure handling and logging.
  - Concurrency control to avoid duplicate notifications.

## 4. Non-Functional Requirements
- **Performance**: API response < 200ms for slot queries, < 500ms for search. App launch < 2s.
- **Scalability**: Support 100k concurrent users; horizontal scaling.
- **Security**: HTTPS, JWT with short expiry, refresh token rotation, input sanitization, rate limiting.
- **Reliability**: 99.9% uptime for booking-critical services.
- **Localization**: Support multiple languages (English, French initially).
- **Accessibility**: WCAG 2.1 AA compliance for web.

## 5. Priorities Summary
- **P0 (Must-have)**: Authentication, Guest Browse, Search, Business Detail, Service Categories, Booking Flow, Appointment Management, User Profile, Availability Engine, Shared Types/Design System, Payment, Notifications, Provider Portal, Background Jobs.
- **P1 (Should-have)**: Map Search, Favorites, Reviews & Ratings, Admin Dashboard.
- **P2 (Nice-to-have)**: Social sharing, loyalty program, advanced analytics, multi-language content, AI recommendations.

## 6. Glossary
- **Buffer time**: Extra time before/after a service for preparation/cleanup.
- **Slot**: A specific start time available for booking.
- **Provider**: Business owner or staff member.
- **Add-ons**: Optional extra services that can be booked alongside a main service.
- **Hold and capture**: Payment authorized at booking, captured after service.