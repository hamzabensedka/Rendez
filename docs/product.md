# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with beauty and wellness businesses. It enables users to discover services, book appointments, manage schedules, and pay seamlessly. Business owners manage their offerings, staff, and bookings via a dedicated portal. An admin dashboard oversees platform health. Background jobs handle notifications, reminders, and slot computations.

## 2. User Roles
- **Guest**: Unauthenticated user who can browse, search, and view business details but cannot book.
- **Customer**: Authenticated user with full booking, favorites, profile, and payment capabilities.
- **Provider (Business Owner)**: Authenticated business owner managing their business profile, services, staff, and appointments.
- **Admin**: Superuser with access to dashboard, user management, and platform configuration.

## 3. Feature Specifications

### 3.1 User Authentication
**Priority: P0 (Critical)**
- **Description**: Secure sign-up, login, and session management for customers and providers.
- **Acceptance Criteria**:
  - Customers can register with email/password, Google, or Apple SSO.
  - Providers register with email/password and business verification (manual/automated).
  - Login returns JWT access/refresh tokens; refresh token rotation.
  - Password reset flow via email.
  - Session persists across app restarts.
  - Logout clears tokens and local state.
  - Rate limiting on auth endpoints.

### 3.2 Guest Browse & Explore
**Priority: P0**
- **Description**: Unauthenticated users can explore the app, view businesses, and search without signing up.
- **Acceptance Criteria**:
  - Home screen shows featured businesses, categories, and search bar.
  - Guest can view business detail pages, services, and reviews.
  - Booking button prompts login/sign-up modal.
  - No personalization (favorites, history) until authenticated.

### 3.3 Business Search & Discovery
**Priority: P0**
- **Description**: Full-text search with filters and sorting to find businesses.
- **Acceptance Criteria**:
  - Search by business name, service, category, or location.
  - Filters: category, price range, rating, distance, availability (today, this week).
  - Sort by: relevance, rating, distance, price low-to-high/high-to-low.
  - Search results show business card (image, name, rating, distance, next available slot).
  - Autocomplete suggestions as user types.
  - Empty state with suggestions when no results.
  - Debounced search (300ms) to reduce API calls.

### 3.4 Map-based Search
**Priority: P1 (High)**
- **Description**: Interactive map view to discover businesses geographically.
- **Acceptance Criteria**:
  - Toggle between list and map view on search results.
  - Map shows business pins with clustering for dense areas.
  - Tap pin shows mini card with name, rating, and next slot; tap again navigates to detail.
  - Map centers on user’s current location (with permission) or searched location.
  - Radius filter (e.g., 1km, 5km, 10km) adjusts results.
  - Performance: smooth rendering with up to 500 pins.

### 3.5 Business Detail View
**Priority: P0**
- **Description**: Comprehensive business profile with services, reviews, and booking entry point.
- **Acceptance Criteria**:
  - Header: cover image, business name, rating, address, distance, favorite button.
  - Tab/section navigation: About, Services, Reviews, Gallery.
  - About: description, amenities, opening hours, contact info.
  - Services: list of services with name, duration, price, and "Book" button.
  - Reviews: paginated list with star rating, text, photos, and date; summary stats (average, distribution).
  - Gallery: image carousel.
  - Sticky "Book Now" button at bottom.
  - Share business profile via deep link.

### 3.6 Service Categories
**Priority: P0**
- **Description**: Hierarchical categories to organize services (e.g., Hair > Haircut, Coloring).
- **Acceptance Criteria**:
  - Admin can manage categories (CRUD) with name, icon, and parent category.
  - Home screen displays top-level categories as tappable cards.
  - Category detail page shows subcategories and top businesses in that category.
  - Businesses can assign services to categories during setup.
  - Search and filter use categories.

### 3.7 Booking Flow
**Priority: P0**
- **Description**: Step-by-step appointment booking from service selection to confirmation.
- **Acceptance Criteria**:
  - Flow: Select service → Choose staff (optional) → Pick date/time slot → Review details → Confirm & pay.
  - Date picker shows available days; unavailable days greyed out.
  - Time slots displayed based on real-time availability (computed via slot engine).
  - Staff selection shows available staff for that service/time; if only one, auto-select.
  - Review screen shows service, staff, date, time, price, and any add-ons.
  - Confirmation screen with booking ID, summary, and option to add to calendar.
  - Handle concurrent bookings: if slot becomes unavailable during flow, show error and suggest alternatives.
  - Support for guest checkout (create account after booking) – optional P2.

### 3.8 Appointment Management
**Priority: P0**
- **Description**: Customers can view, reschedule, or cancel upcoming appointments.
- **Acceptance Criteria**:
  - "My Appointments" list with tabs: Upcoming, Past, Cancelled.
  - Each appointment card shows business, service, date/time, status, and actions.
  - Reschedule: re-enter booking flow with pre-selected service; old slot released upon confirmation.
  - Cancel: confirmation dialog; cancellation policy (e.g., free up to 24h before) enforced; refund if applicable.
  - Push notification reminders 24h and 1h before appointment.
  - Add to calendar (Google/Apple) integration.

### 3.9 Favorites
**Priority: P1**
- **Description**: Save businesses for quick access.
- **Acceptance Criteria**:
  - Heart icon on business cards and detail page toggles favorite.
  - "Favorites" tab in user profile lists saved businesses.
  - Favorites sync across devices (cloud-backed).
  - Empty state with suggestion to explore.
  - Unfavorite removes from list with undo option.

### 3.10 User Profile
**Priority: P1**
- **Description**: Manage personal information, preferences, and payment methods.
- **Acceptance Criteria**:
  - Edit profile: name, email, phone, profile picture.
  - View booking history.
  - Manage saved payment methods (add, delete, set default).
  - Notification preferences (push, email, SMS).
  - Delete account (GDPR compliant) with confirmation and data wipe.
  - Link/unlink social accounts.

### 3.11 Availability & Slot Computation
**Priority: P0**
- **Description**: Real-time engine to compute available time slots based on business hours, staff schedules, existing bookings, and service duration.
- **Acceptance Criteria**:
  - Slot engine runs as a background job (BullMQ) triggered on booking changes, schedule updates, or on-demand.
  - Computes slots for next N days (configurable, default 30).
  - Considers: business working hours, staff working hours, staff breaks, service duration, buffer time between appointments, existing bookings.
  - Returns array of available start times for a given service, staff, and date.
  - Caches results in Redis with TTL; invalidates on relevant mutations.
  - Handles timezone correctly (business local time).
  - Supports parallel availability for multiple staff.
  - API endpoint: `GET /availability?businessId=&serviceId=&staffId=&date=` returns slots.

### 3.12 Shared Types & Design System
**Priority: P0**
- **Description**: Unified TypeScript types and a reusable UI component library to ensure consistency across web and mobile (React Native).
- **Acceptance Criteria**:
  - Shared types package (`@planity/shared-types`) with interfaces for User, Business, Service, Booking, Review, etc.
  - Design system package (`@planity/design-system`) with tokens (colors, typography, spacing) and components (Button, Card, Input, Modal, etc.).
  - Components support theming (light/dark mode).
  - Storybook documentation for all components.
  - Accessibility: components meet WCAG 2.1 AA.
  - Responsive design for mobile and tablet.

### 3.13 Reviews & Ratings
**Priority: P1**
- **Description**: Customers can leave reviews and ratings after a completed appointment.
- **Acceptance Criteria**:
  - Prompt to review appears after appointment status changes to "completed" (via push/email).
  - Review form: star rating (1-5), text (optional), photo upload (optional).
  - Reviews are public and displayed on business detail page.
  - Business owner can respond to reviews (public reply).
  - Moderation: admin can flag/hide inappropriate reviews.
  - Average rating and distribution updated asynchronously.
  - One review per booking.

### 3.14 Payment Integration
**Priority: P0**
- **Description**: Secure payment processing for bookings via Stripe.
- **Acceptance Criteria**:
  - Customers can pay with credit/debit card, Apple Pay, Google Pay.
  - Payment is captured at booking confirmation (or after service, configurable).
  - Support for prepayment, deposit, or pay-later models per business.
  - Saved payment methods for faster checkout.
  - PCI compliance: card details never touch our servers; use Stripe Elements/PaymentSheet.
  - Refund flow for cancellations according to policy.
  - Receipt sent via email after successful payment.
  - Transaction history in user profile and provider dashboard.

### 3.15 Notifications
**Priority: P1**
- **Description**: Multi-channel notifications (push, email, SMS) for booking confirmations, reminders, and marketing.
- **Acceptance Criteria**:
  - Push notifications via Firebase Cloud Messaging (FCM) for mobile.
  - Email via SendGrid or similar; templates for booking confirmation, reminder, cancellation, review request.
  - SMS reminders (optional, opt-in).
  - Notification preferences per user (toggle channels).
  - Real-time in-app notification center with read/unread status.
  - Background job (BullMQ) to schedule and send reminders (24h, 1h before).
  - Provider notifications: new booking, cancellation, review received.

### 3.16 Provider / Business Owner Portal
**Priority: P0**
- **Description**: Web and mobile portal for business owners to manage their profile, services, staff, and appointments.
- **Acceptance Criteria**:
  - Dashboard with today’s appointments, revenue summary, upcoming bookings.
  - Business profile management: name, description, address, hours, photos, categories.
  - Service management: CRUD services with name, duration, price, category, description.
  - Staff management: add/edit/remove staff members, set their working hours and services they perform.
  - Calendar view: daily/weekly/monthly with appointments; drag-and-drop reschedule (web).
  - Appointment management: view details, accept/reject (if manual confirmation enabled), cancel with reason.
  - Client management: view client list, booking history, notes.
  - Availability settings: set business hours, breaks, holidays, buffer times.
  - Reports: revenue, bookings count, popular services (basic analytics).
  - Multi-language support (at least EN/FR).

### 3.17 Admin Dashboard
**Priority: P1**
- **Description**: Central admin panel for platform oversight, user management, and configuration.
- **Acceptance Criteria**:
  - Dashboard with KPIs: total users, businesses, bookings, revenue, active users.
  - User management: list/search users, view details, suspend/delete accounts.
  - Business management: approve/reject new business registrations, edit business details, suspend.
  - Category management: CRUD service categories.
  - Review moderation: flag, hide, delete reviews.
  - Configuration: global settings (commission rate, cancellation policy, supported regions).
  - Audit log of admin actions.
  - Role-based access: super admin, support admin.

### 3.18 Background Jobs (BullMQ)
**Priority: P0**
- **Description**: Reliable job processing for async tasks like slot computation, notifications, and data cleanup.
- **Acceptance Criteria**:
  - Job queues: `slot-computation`, `notifications`, `emails`, `data-cleanup`.
  - Slot computation job: triggered on booking created/updated/cancelled, staff schedule change, business hours change; recalculates availability for affected days.
  - Notification jobs: schedule push/email/SMS reminders based on appointment time.
  - Email jobs: send transactional emails (confirmation, receipt, etc.) with retry logic.
  - Data cleanup: anonymize/delete user data after account deletion (GDPR).
  - Monitoring: Bull Board UI for queue health, failed jobs, retries.
  - Concurrency and rate limiting to avoid overwhelming third-party APIs.

## 4. Non-Functional Requirements
- **Performance**: API response < 200ms p95; slot computation < 500ms for a day.
- **Scalability**: Support 100k concurrent users; horizontal scaling of services.
- **Security**: HTTPS, JWT with short expiry, input sanitization, rate limiting, OWASP top 10.
- **Reliability**: 99.9% uptime for core booking flow; graceful degradation for non-critical features.
- **Localization**: Support multiple languages and timezones.
- **Accessibility**: WCAG 2.1 AA for web; mobile accessibility best practices.

## 5. Priority Summary
- **P0 (Must-have)**: User Authentication, Guest Browse, Business Search, Business Detail, Service Categories, Booking Flow, Appointment Management, Availability Engine, Shared Types, Payment, Provider Portal, Background Jobs.
- **P1 (Should-have)**: Map Search, Favorites, User Profile, Reviews & Ratings, Notifications, Admin Dashboard.
- **P2 (Nice-to-have)**: Guest checkout, advanced analytics, loyalty program, multi-currency, social sharing.

## 6. Dependencies & Assumptions
- Stripe for payments; Firebase for push notifications; SendGrid for emails; Redis for caching and BullMQ; PostgreSQL for primary DB.
- Mobile app built with React Native; web with Next.js; backend with Node.js/NestJS.
- Business hours and staff schedules are stored in UTC with timezone offset.
- Slot computation assumes appointments cannot overlap; buffer time is configurable per business.
- All dates/times are in ISO 8601.