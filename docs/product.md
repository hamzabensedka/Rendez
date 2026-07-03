# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first appointment booking platform connecting customers with beauty, wellness, and personal care businesses. It enables discovery, booking, and management of services with real-time availability, payments, and notifications. The platform includes a customer-facing app, a provider portal, and an admin dashboard.

## 2. User Roles
- **Guest**: Unauthenticated user who can browse businesses and services.
- **Customer**: Registered user who can book, manage appointments, save favorites, and leave reviews.
- **Provider**: Business owner or staff managing services, schedules, and appointments.
- **Admin**: Platform administrator overseeing businesses, users, and system health.

## 3. Features

### 3.1 User Authentication
**Description**: Secure sign-up, login, and session management for customers and providers. Supports email/password and social login.

**Acceptance Criteria**:
- Customer can register with email and password; verification email sent.
- Customer can log in with email/password or Google/Apple SSO.
- Provider registration requires business details and admin approval.
- Password reset flow via email.
- JWT-based authentication with refresh tokens.
- Session persists across app restarts.
- Logout clears tokens and redirects to home.

**Priority**: P0

### 3.2 Guest Browse & Explore
**Description**: Unauthenticated users can explore businesses, services, and reviews without signing up. Booking requires login.

**Acceptance Criteria**:
- Guest can view home feed with featured businesses and categories.
- Guest can search businesses and view detail pages.
- Guest can see service lists, prices, and reviews.
- "Book Now" button prompts login/sign-up modal.
- No personalization or favorites for guests.

**Priority**: P0

### 3.3 Business Search & Discovery
**Description**: Customers can search for businesses by name, category, location, or service. Results include ratings, distance, and availability.

**Acceptance Criteria**:
- Search bar with autocomplete suggestions (business names, categories).
- Filters: category, rating, price range, distance, open now.
- Sort by: relevance, rating, distance, price.
- Results display business card with image, name, rating, distance, next available slot.
- Pagination or infinite scroll.
- Empty state with suggestions.

**Priority**: P0

### 3.4 Map-based Search
**Description**: Interactive map view showing nearby businesses with pins. Users can pan/zoom to update results.

**Acceptance Criteria**:
- Map view toggle on search results.
- Business pins show name and rating on tap.
- Clustering for dense areas.
- Tap pin opens business detail card.
- Map centers on user's location (with permission) or searched location.
- List view and map view stay synchronized.

**Priority**: P1

### 3.5 Business Detail View
**Description**: Comprehensive business profile with services, reviews, photos, location, and booking CTA.

**Acceptance Criteria**:
- Hero image gallery with swipe.
- Business name, rating, review count, address, phone, website.
- Operating hours with "Open Now" indicator.
- Service list grouped by category, with duration, price, and "Book" button.
- Reviews section with summary rating distribution and recent reviews.
- Favorite/unfavorite button.
- Share business link.
- Map thumbnail with directions link.

**Priority**: P0

### 3.6 Service Categories
**Description**: Hierarchical category system (e.g., Hair > Haircut, Coloring). Used for discovery and provider service mapping.

**Acceptance Criteria**:
- Admin can manage categories (CRUD) with name, icon, parent category.
- Categories displayed on home screen as browsable grid.
- Provider can assign services to leaf categories.
- Search and filter by category.
- Category detail page shows top businesses and subcategories.

**Priority**: P0

### 3.7 Booking Flow
**Description**: Step-by-step booking: select service, choose staff (optional), pick date/time, confirm details, and pay.

**Acceptance Criteria**:
- Service selection from business detail or direct link.
- Staff selection if business has multiple providers; show any available.
- Calendar view with available dates highlighted; unavailable dates greyed out.
- Time slot picker showing real-time availability (fetched from slot computation).
- Booking summary: business, service, staff, date, time, price, duration.
- Optional notes field.
- Promo code input with validation.
- Payment step: saved cards, new card entry (Stripe), or pay-at-venue option.
- Confirmation screen with booking ID and add-to-calendar option.
- Booking requires authentication; guest prompted to login/signup mid-flow with state preserved.

**Priority**: P0

### 3.8 Appointment Management
**Description**: Customers can view, reschedule, cancel upcoming appointments, and see history.

**Acceptance Criteria**:
- Upcoming appointments list with status (confirmed, pending, rescheduled).
- Appointment detail: business, service, date/time, staff, price, cancellation policy.
- Reschedule flow: select new date/time from available slots; updates booking.
- Cancel with confirmation dialog; applies cancellation policy (free within window, else charge).
- Past appointments with option to leave review.
- Push notification reminders 24h and 1h before.
- Add to calendar (Google/Apple).

**Priority**: P0

### 3.9 Favorites
**Description**: Customers can save businesses to a favorites list for quick access.

**Acceptance Criteria**:
- Heart icon on business cards and detail page toggles favorite.
- Favorites tab in user profile shows saved businesses.
- Favorites persist across sessions.
- Unfavorite removes from list with undo option.
- Favorites synced with backend for cross-device consistency.

**Priority**: P1

### 3.10 User Profile
**Description**: Customer profile management: personal info, preferences, payment methods, notification settings.

**Acceptance Criteria**:
- Edit name, email, phone, profile photo.
- Manage saved payment methods (add, delete, set default).
- Notification preferences: push, email, SMS toggles.
- Booking history with filter by status.
- Favorites list.
- Delete account with confirmation and data wipe.

**Priority**: P1

### 3.11 Availability & Slot Computation
**Description**: Real-time calculation of bookable time slots based on provider schedules, service duration, buffer times, and existing bookings.

**Acceptance Criteria**:
- Provider sets weekly recurring schedule (days, start/end times) and date-specific overrides (holidays, extra hours).
- Service duration + buffer before/after defines slot length.
- Slot computation engine returns available start times for a given date, staff, and service.
- Considers existing appointments, breaks, and travel time (if mobile).
- Supports multiple staff; if staff not selected, shows slots where any staff is available.
- Slot computation must be performant (<200ms) and cacheable.
- Real-time updates when a slot is booked (via BullMQ job to invalidate cache).

**Priority**: P0

### 3.12 Shared Types & Design System
**Description**: Unified TypeScript types and UI component library to ensure consistency across customer app, provider portal, and admin dashboard.

**Acceptance Criteria**:
- Shared types package for: User, Business, Service, Appointment, Review, Category, etc.
- Design system with reusable components: Button, Input, Card, Modal, Calendar, Rating, etc.
- Theming support (light/dark mode).
- Responsive design for mobile and desktop.
- Documented in Storybook.

**Priority**: P1

### 3.13 Reviews & Ratings
**Description**: Customers can rate and review businesses after a completed appointment. Reviews are public and moderate-able.

**Acceptance Criteria**:
- After appointment completion, prompt to rate (1-5 stars) and write review.
- Review form: star rating, text (min 10 chars), optional photo.
- Reviews displayed on business detail with most recent first.
- Sort reviews by recent, highest, lowest.
- Provider can respond to reviews publicly.
- Admin can moderate (hide/delete) inappropriate reviews.
- Average rating and distribution shown.

**Priority**: P1

### 3.14 Payment Integration
**Description**: Secure payment processing via Stripe. Supports card payments, saved cards, and pay-at-venue option.

**Acceptance Criteria**:
- Stripe Elements for PCI-compliant card entry.
- Customer can save card for future use (with consent).
- Payment captured at booking time (or hold depending on provider setting).
- Refund processing for cancellations according to policy.
- Receipt emailed after successful payment.
- Provider can set deposit requirement (percentage or fixed).
- Admin can view transaction history and handle disputes.

**Priority**: P0

### 3.15 Notifications
**Description**: Multi-channel notifications (push, email, SMS) for booking confirmations, reminders, cancellations, and marketing.

**Acceptance Criteria**:
- Push notifications via Firebase Cloud Messaging (FCM).
- Email via SendGrid or similar.
- SMS via Twilio (optional).
- Transactional: booking confirmation, reschedule, cancellation, payment receipt.
- Reminders: 24h and 1h before appointment.
- Marketing: opt-in promotions, re-engagement (with unsubscribe).
- In-app notification center with read/unread status.
- Notification preferences in user profile.

**Priority**: P1

### 3.16 Provider / Business Owner Portal
**Description**: Web and mobile portal for providers to manage their business profile, services, staff, schedule, and appointments.

**Acceptance Criteria**:
- Dashboard with today's appointments, earnings summary, upcoming bookings.
- Business profile editing: name, description, photos, address, contact, hours.
- Service management: add/edit/delete services with name, duration, price, category, buffer time.
- Staff management: add staff members, assign services, set individual schedules.
- Calendar view with appointments; ability to manually add/block time.
- Appointment management: confirm, reschedule, cancel, add notes.
- Client management: view client history and notes.
- Availability settings: recurring weekly hours, date overrides, breaks.
- Notification preferences for new bookings, cancellations.
- Reports: revenue, bookings over time, popular services.

**Priority**: P0

### 3.17 Admin Dashboard
**Description**: Super admin panel to manage platform: businesses, users, categories, reviews, transactions, and system settings.

**Acceptance Criteria**:
- Dashboard with KPIs: total bookings, revenue, active users, new businesses.
- Business management: approve/reject new businesses, edit details, suspend.
- User management: view customers and providers, disable accounts.
- Category management: CRUD categories and subcategories.
- Review moderation: view all reviews, hide/delete, resolve flags.
- Transaction monitoring: list payments, refunds, disputes.
- Commission settings: percentage per booking.
- System configuration: global parameters (cancellation window, max advance booking).
- Role-based access control (admin, super admin).

**Priority**: P1

### 3.18 Background Jobs (BullMQ)
**Description**: Asynchronous job processing for tasks like sending notifications, generating reports, cleaning expired holds, and cache invalidation.

**Acceptance Criteria**:
- BullMQ queues for: email, push notifications, SMS, payment settlement, slot cache invalidation, booking reminders.
- Jobs triggered by events (booking created, cancelled, etc.).
- Retry with exponential backoff for failed jobs.
- Dead letter queue for permanently failed jobs with admin alert.
- Scheduled jobs for reminders (24h, 1h before).
- Admin can view queue status and job history.
- Concurrency and rate limiting to respect third-party API limits.

**Priority**: P1

## 4. Non-Functional Requirements
- **Performance**: Slot computation <200ms, page load <2s.
- **Security**: HTTPS, JWT with rotation, input sanitization, rate limiting.
- **Scalability**: Horizontal scaling for API and workers.
- **Accessibility**: WCAG 2.1 AA compliance.
- **Localization**: Support for multiple languages (English, French initially).

## 5. Release Phases
- **MVP (P0)**: User Auth, Guest Browse, Search, Business Detail, Categories, Booking Flow, Appointment Management, Availability & Slots, Payment Integration, Provider Portal (basic).
- **V1 (P1)**: Map Search, Favorites, User Profile, Reviews & Ratings, Notifications, Admin Dashboard, Background Jobs, Shared Types & Design System.
- **V2 (P2)**: Advanced analytics, loyalty program, multi-currency, AI recommendations.