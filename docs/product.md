# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with beauty and wellness businesses. It enables discovery, booking, and management of appointments, with dedicated portals for providers and admins. The system supports real-time availability, payments, notifications, and background job processing.

## 2. User Roles
- **Guest**: Unauthenticated user who can browse, search, and view business details but cannot book.
- **Customer**: Authenticated user with full booking, favorites, profile, and review capabilities.
- **Provider**: Business owner or staff managing services, schedules, and appointments.
- **Admin**: Superuser overseeing platform health, users, and content moderation.

## 3. Features

### 3.1 User Authentication
**Description**: Secure sign-up, login, and session management for customers and providers. Supports email/password and social login.
**Acceptance Criteria**:
- Customer can register with email, password, first name, last name.
- Provider registration includes business name, address, and service category.
- Email verification required before first login.
- Login with email/password; error for invalid credentials.
- Social login (Google, Apple) for customers only.
- Password reset via email link.
- JWT-based session with refresh token; auto-logout on expiry.
- Role-based access control: customer vs provider routes.
**Priority**: P0 (Must-have)

### 3.2 Guest Browse & Explore
**Description**: Unauthenticated users can explore businesses, services, and reviews without signing up.
**Acceptance Criteria**:
- Guest lands on home screen with featured businesses and categories.
- Can search businesses by name or category.
- View business detail page including services, reviews, and map.
- Attempting to book or favorite prompts login/sign-up modal.
- No personalization or saved data.
**Priority**: P0

### 3.3 Business Search & Discovery
**Description**: Customers search for businesses using text, filters, and sorting.
**Acceptance Criteria**:
- Search bar with autocomplete (business name, category, location).
- Filters: category, rating, price range, distance, availability (today, this week).
- Sort by: relevance, rating, distance, price low-to-high.
- Results display business card: image, name, rating, category, distance, next available slot.
- Pagination (infinite scroll).
- Empty state with suggestions.
**Priority**: P0

### 3.4 Map-based Search
**Description**: Interactive map view to discover businesses geographically.
**Acceptance Criteria**:
- Toggle between list and map view on search results.
- Map shows business pins with clustering at high zoom.
- Tap pin shows preview card with name, rating, next slot.
- Tap preview navigates to business detail.
- Map centers on user’s current location (with permission) or default city.
- Search updates map markers dynamically.
**Priority**: P1 (High)

### 3.5 Business Detail View
**Description**: Comprehensive business profile with services, reviews, gallery, and booking CTA.
**Acceptance Criteria**:
- Hero image carousel, business name, rating, address, phone, website.
- “About” section with description.
- Service list grouped by category, each with duration, price, and “Book” button.
- Reviews section with summary (average, distribution) and paginated list.
- Map thumbnail showing location; tap opens full map.
- Share button.
- Favorite/unfavorite toggle (authenticated only).
- Sticky bottom bar with next available slot and “Book” CTA.
**Priority**: P0

### 3.6 Service Categories
**Description**: Hierarchical category system for organizing businesses and services.
**Acceptance Criteria**:
- Top-level categories: Hair, Nails, Massage, Skin Care, Barbershop, etc.
- Each category has subcategories (e.g., Hair > Cut, Color, Styling).
- Home screen displays category icons for quick navigation.
- Category page shows businesses filtered by that category.
- Admin can manage categories (CRUD) via dashboard.
**Priority**: P0

### 3.7 Booking Flow
**Description**: Step-by-step appointment booking from service selection to confirmation.
**Acceptance Criteria**:
- Customer selects service, then chooses staff (if multiple), date, and time slot.
- Calendar shows available dates; unavailable dates greyed out.
- Time slots based on real-time availability (computed via slot engine).
- Optional: add notes, select add-ons if offered.
- Review summary: business, service, staff, date, time, price, duration.
- Apply promo code (if any).
- Payment step: card input (Stripe) or saved card; supports Apple/Google Pay.
- Booking confirmation with success animation, appointment details, and option to add to calendar.
- Email/SMS confirmation sent.
- Guest redirected to sign-up after booking (optional account creation).
**Priority**: P0

### 3.8 Appointment Management
**Description**: Customers view, modify, and cancel upcoming appointments.
**Acceptance Criteria**:
- “My Appointments” tab with upcoming and past sections.
- Upcoming appointment card: business, service, date/time, status (confirmed, pending, etc.).
- Tap to see full details, location map, and actions.
- Reschedule: select new date/time from available slots; updates booking.
- Cancel: confirmation dialog; cancellation policy may apply (free up to X hours before).
- Past appointments show review prompt if not yet reviewed.
- Push notification reminders 24h and 1h before appointment.
**Priority**: P0

### 3.9 Favorites
**Description**: Save businesses for quick access and receive updates.
**Acceptance Criteria**:
- Heart icon on business cards and detail page toggles favorite.
- “Favorites” tab lists saved businesses with name, rating, next slot.
- Tap navigates to business detail.
- Swipe to remove.
- Empty state with suggestion to explore.
- Optional: notify when favorited business has a new promotion or slot opens.
**Priority**: P1

### 3.10 User Profile
**Description**: Manage personal information, payment methods, and notification preferences.
**Acceptance Criteria**:
- Edit profile: first name, last name, email, phone, profile photo.
- Saved payment methods: add/delete credit/debit cards (Stripe).
- Notification preferences: push, email, SMS toggles for reminders, promotions.
- Booking history link.
- Logout and delete account options.
- Provider profile includes business details, service management, schedule.
**Priority**: P1

### 3.11 Availability & Slot Computation
**Description**: Real-time engine computing bookable time slots based on provider schedules, existing bookings, buffers, and holidays.
**Acceptance Criteria**:
- Provider defines weekly working hours per staff (e.g., Mon-Fri 9am-5pm).
- Service duration determines slot length; buffer time before/after configurable.
- Slot engine excludes breaks, holidays, and already booked slots.
- Supports parallel availability for multiple staff.
- Slot computation API returns available slots for a given service, staff, date range.
- Caching for performance; invalidated on booking or schedule change.
- Handles timezone correctly.
**Priority**: P0

### 3.12 Shared Types & Design System
**Description**: Unified TypeScript types and UI components across frontend apps.
**Acceptance Criteria**:
- Shared types package: User, Business, Service, Appointment, Review, etc.
- Design system with reusable components: Button, Card, Modal, Input, StarRating, etc.
- Consistent color palette, typography, spacing, and icons.
- Responsive and accessible (WCAG AA).
- Storybook documentation for components.
**Priority**: P1

### 3.13 Reviews & Ratings
**Description**: Customers rate and review businesses after appointments.
**Acceptance Criteria**:
- After completed appointment, prompt to leave review (push/email).
- Review form: star rating (1-5), text review (optional), photo upload (optional).
- Reviews appear on business detail page with most recent first.
- Business average rating updated in real-time.
- Provider can respond to reviews (public reply).
- Admin can moderate/hide inappropriate reviews.
- Review helpfulness voting.
**Priority**: P1

### 3.14 Payment Integration
**Description**: Secure payment processing via Stripe for bookings.
**Acceptance Criteria**:
- Customer enters card details or uses saved card; supports Apple/Google Pay.
- Payment captured at booking time (pre-authorization or immediate charge).
- Refund processing for cancellations according to policy.
- Provider receives payout (Stripe Connect) minus platform fee.
- Transaction history for customer and provider.
- PCI compliance; no sensitive data stored on server.
**Priority**: P0

### 3.15 Notifications
**Description**: Multi-channel notifications for booking confirmations, reminders, and marketing.
**Acceptance Criteria**:
- Push notifications (Firebase) for: booking confirmation, reminders, cancellations, review prompts.
- Email notifications: same events, plus password reset, welcome.
- SMS notifications: booking confirmation, reminder (opt-in).
- In-app notification center with read/unread status.
- Notification preferences respected per channel.
- Admin can send promotional push notifications to segments.
**Priority**: P1

### 3.16 Provider / Business Owner Portal
**Description**: Web and mobile portal for providers to manage business, services, staff, schedule, and appointments.
**Acceptance Criteria**:
- Dashboard with today’s appointments, earnings summary, new reviews.
- Business profile editing: name, description, photos, address, contact.
- Service management: add/edit/delete services with name, duration, price, category, description.
- Staff management: add staff members, assign services, set working hours.
- Calendar view: daily/weekly/monthly; see appointments, block time, manage breaks.
- Appointment management: view upcoming, confirm, cancel, reschedule, add notes.
- Client list with history.
- Earnings and payout reports.
- Settings: notification preferences, cancellation policy, buffer times.
**Priority**: P0

### 3.17 Admin Dashboard
**Description**: Super admin panel for platform management, moderation, and analytics.
**Acceptance Criteria**:
- User management: list/search customers and providers, suspend/delete accounts.
- Business verification: approve/reject new provider registrations.
- Category management: CRUD for service categories.
- Review moderation: flag, hide, delete reviews.
- Promotions: create and send push/email campaigns.
- Analytics: bookings over time, revenue, top businesses, user growth.
- Configuration: platform fee percentage, cancellation window, etc.
- Role-based access: only admin users can access.
**Priority**: P1

### 3.18 Background Jobs (BullMQ)
**Description**: Asynchronous job processing for non-blocking operations.
**Acceptance Criteria**:
- Job queues: email, sms, push notifications, payment settlement, slot cache invalidation, review reminders.
- Retry logic with exponential backoff for failed jobs.
- Scheduled jobs: appointment reminders (24h, 1h before).
- Monitoring dashboard (Bull Board) for queue health.
- Graceful shutdown and error handling.
**Priority**: P1

## 4. Non-Functional Requirements
- Performance: API response < 200ms p95; slot computation < 500ms.
- Scalability: support 100k concurrent users.
- Security: HTTPS, input sanitization, rate limiting, OWASP top 10.
- Accessibility: WCAG 2.1 AA compliance.
- Localization: support multiple languages (future).

## 5. Release Phases
- **MVP (P0)**: Auth, guest browse, search, business detail, booking flow, appointment management, availability engine, payment, provider portal.
- **V1 (P1)**: Map search, favorites, user profile, reviews, notifications, admin dashboard, background jobs, design system.
- **V2**: Advanced analytics, loyalty program, multi-language, AI recommendations.