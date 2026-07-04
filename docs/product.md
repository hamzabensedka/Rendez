# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with local beauty and wellness businesses. It enables discovery, booking, and management of appointments, with dedicated portals for providers and administrators. The system supports real-time availability, payments, reviews, and notifications.

## 2. User Personas
- **Guest**: Unauthenticated user browsing businesses and services.
- **Customer**: Registered user who books appointments, manages favorites, and leaves reviews.
- **Provider**: Business owner or staff managing services, schedules, and appointments.
- **Admin**: Platform administrator overseeing businesses, users, and system health.

## 3. Features

### 3.1 User Authentication
**Description**: Secure sign-up, login, and session management for customers and providers. Supports email/password and social login (Google, Apple).

**Acceptance Criteria**:
- Customer can register with email, password, and name; verification email sent.
- Provider registration requires business details and is subject to admin approval.
- Login with email/password returns JWT tokens (access + refresh).
- Social login (Google, Apple) creates or links account.
- Password reset flow via email.
- Session persists across app restarts; token refresh works silently.
- Logout clears tokens and local state.

**Priority**: P0 (Must-have)

### 3.2 Guest Browse & Explore
**Description**: Unauthenticated users can browse businesses, view details, and see services without logging in. Booking requires authentication.

**Acceptance Criteria**:
- Guest can view home screen with featured businesses and categories.
- Search and filter businesses by name, category, location.
- View business detail page (services, ratings, photos, map).
- Attempting to book prompts login/sign-up modal.
- No personalization (favorites, history) until authenticated.

**Priority**: P0

### 3.3 Business Search & Discovery
**Description**: Customers search for businesses by name, category, or location. Results include ratings, distance, and availability indicators.

**Acceptance Criteria**:
- Search bar with autocomplete (business names, categories).
- Filter by category, rating, price range, distance.
- Sort by relevance, rating, distance, popularity.
- Results show thumbnail, name, rating, address, next available slot.
- Pagination (infinite scroll).
- Search works offline with cached data (last fetched).

**Priority**: P0

### 3.4 Map-based Search
**Description**: Interactive map view showing nearby businesses. Users can pan/zoom to discover businesses in different areas.

**Acceptance Criteria**:
- Map displays business pins with basic info on tap.
- Clustering for dense areas.
- Tap pin opens business card; tap card navigates to detail.
- "Search this area" button reloads results for current map bounds.
- Location permission prompt; fallback to manual address entry.
- Map and list views toggle seamlessly.

**Priority**: P1 (High)

### 3.5 Business Detail View
**Description**: Comprehensive business profile with services, team members, reviews, photos, and booking CTA.

**Acceptance Criteria**:
- Hero image carousel, business name, rating, address, hours.
- Services tab: list of services with duration, price, and "Book" button.
- Team tab: staff members with photo, specialties, and availability link.
- Reviews tab: summary rating, review list with pagination.
- Photos tab: gallery of business images.
- Contact options: call, directions (opens maps), share.
- Favorite toggle (heart icon).
- Sticky bottom bar with primary CTA "Book Now".

**Priority**: P0

### 3.6 Service Categories
**Description**: Hierarchical category system for organizing businesses and services (e.g., Hair > Haircut, Coloring).

**Acceptance Criteria**:
- Admin can manage categories (CRUD) with name, icon, parent category.
- Categories displayed on home screen and search filters.
- Businesses can be associated with multiple categories.
- Services inherit category from business or can be overridden.
- Category page shows subcategories and top businesses.

**Priority**: P0

### 3.7 Booking Flow
**Description**: Step-by-step appointment booking: select service, staff, date/time, add-ons, confirm, and pay.

**Acceptance Criteria**:
- Service selection: list of services with duration and price.
- Staff selection (optional): choose preferred staff or "any".
- Date/time picker: calendar with available slots fetched in real-time.
- Add-ons: optional extras (e.g., deep conditioning) with prices.
- Summary screen: review details, total price, cancellation policy.
- Payment: integrated Stripe/PayPal; supports saved cards.
- Confirmation screen with booking ID and option to add to calendar.
- Guest redirected to login/sign-up before payment.
- Booking holds slot for 10 minutes during payment.

**Priority**: P0

### 3.8 Appointment Management
**Description**: Customers view, modify, and cancel upcoming and past appointments.

**Acceptance Criteria**:
- Appointments list with tabs: Upcoming, Past, Cancelled.
- Each appointment shows date, time, business, service, staff, status.
- Reschedule: change date/time (subject to availability and policy).
- Cancel: with reason selection; refund if within cancellation window.
- Add to calendar (Google, Apple, Outlook).
- Push notification reminders 24h and 1h before.
- Rebook button for past appointments.

**Priority**: P0

### 3.9 Favorites
**Description**: Customers save businesses to a favorites list for quick access.

**Acceptance Criteria**:
- Heart icon on business cards and detail page toggles favorite.
- Favorites tab in user profile shows saved businesses.
- List sorted by recently added; swipe to remove.
- Favorites sync across devices (cloud).
- Unauthenticated users prompted to log in.

**Priority**: P1

### 3.10 User Profile
**Description**: Customer account management, preferences, and history.

**Acceptance Criteria**:
- Edit personal info: name, email, phone, profile photo.
- Manage saved payment methods.
- Notification preferences (push, email, SMS).
- Booking history with search and filter.
- Favorites list.
- Delete account (GDPR compliant).
- Language and theme settings.

**Priority**: P1

### 3.11 Availability & Slot Computation
**Description**: Real-time calculation of available time slots based on business hours, staff schedules, existing bookings, and service duration.

**Acceptance Criteria**:
- Business sets working hours per day, breaks, holidays.
- Staff have individual schedules overriding business hours.
- Service duration plus buffer time determines slot length.
- Slot engine considers parallel bookings for multi-staff businesses.
- Real-time updates via WebSockets; fallback polling.
- API returns available slots for a given date, service, and staff.
- Handles timezone conversions (business local time).
- Caching with Redis for performance; invalidation on booking/cancellation.

**Priority**: P0

### 3.12 Shared Types & Design System
**Description**: Unified TypeScript types and UI components to ensure consistency across web and mobile.

**Acceptance Criteria**:
- Shared types package for User, Business, Service, Appointment, Review, etc.
- Design system with tokens (colors, typography, spacing) and reusable components (Button, Card, Modal, Input).
- Components support loading, empty, error states.
- Accessibility: WCAG 2.1 AA compliance.
- Responsive design for mobile, tablet, desktop.
- Storybook documentation for all components.

**Priority**: P0

### 3.13 Reviews & Ratings
**Description**: Customers rate and review businesses after completed appointments.

**Acceptance Criteria**:
- After appointment, prompt to rate (1-5 stars) and write review.
- Review includes rating, text, optional photos.
- Business detail page shows average rating and review count.
- Reviews sorted by most recent or most helpful.
- Provider can respond to reviews publicly.
- Abuse reporting and moderation by admin.
- Review editing/deletion by author within 48 hours.

**Priority**: P1

### 3.14 Payment Integration
**Description**: Secure payment processing via Stripe, supporting one-time payments and saved cards.

**Acceptance Criteria**:
- Customer can pay with credit/debit card, Apple Pay, Google Pay.
- Save card for future use (tokenization).
- Payment flow: hold slot, create payment intent, confirm, release slot on success.
- Handle 3D Secure authentication.
- Refunds processed automatically on eligible cancellations.
- Provider receives payout to connected Stripe account (platform fee deducted).
- PCI DSS compliance; no sensitive card data stored on servers.

**Priority**: P0

### 3.15 Notifications
**Description**: Multi-channel notifications (push, email, SMS) for booking confirmations, reminders, and marketing.

**Acceptance Criteria**:
- Transactional: booking confirmation, cancellation, reschedule, payment receipt.
- Reminders: 24h and 1h before appointment via push and email.
- Marketing: opt-in promotions, re-engagement (with unsubscribe).
- Provider notifications: new booking, cancellation, review received.
- Admin notifications: new provider registration, flagged reviews.
- In-app notification center with read/unread status.
- Delivery status tracking and retry logic.

**Priority**: P0

### 3.16 Provider / Business Owner Portal
**Description**: Web and mobile dashboard for providers to manage their business, services, staff, schedule, and appointments.

**Acceptance Criteria**:
- Business profile management: name, description, photos, address, hours, categories.
- Service management: CRUD services with name, duration, price, description, category.
- Staff management: add/remove staff, assign services, set individual schedules.
- Calendar view: daily/weekly/monthly with appointments; color-coded by status.
- Appointment management: confirm, reschedule, cancel, mark no-show.
- Client management: view client history, notes.
- Real-time updates when new booking arrives.
- Reports: revenue, bookings count, popular services, client retention.
- Settings: notification preferences, cancellation policy, buffer times.

**Priority**: P0

### 3.17 Admin Dashboard
**Description**: Super admin panel for platform management, moderation, and analytics.

**Acceptance Criteria**:
- User management: list, search, suspend/activate customers and providers.
- Business approval workflow: review and approve/reject new provider registrations.
- Category management: CRUD categories and subcategories.
- Review moderation: view reported reviews, remove or dismiss reports.
- Platform analytics: total bookings, revenue, active users, churn, top businesses.
- Commission configuration: set platform fee percentage per category or globally.
- System health: job queue status, error logs, API performance.
- Role-based access: super admin, support agent.

**Priority**: P1

### 3.18 Background Jobs (BullMQ)
**Description**: Asynchronous job processing for non-blocking tasks like emails, notifications, slot release, and data cleanup.

**Acceptance Criteria**:
- Job queues: email, push notification, SMS, slot management, data export.
- Reliable processing with Redis-backed BullMQ.
- Retry with exponential backoff for failed jobs.
- Dead letter queue for jobs exceeding max attempts.
- Scheduled jobs: appointment reminders, slot expiry.
- Monitoring dashboard (Bull Board) for queue health.
- Idempotency keys to prevent duplicate processing.

**Priority**: P0

## 4. Non-Functional Requirements
- **Performance**: API response < 200ms p95; slot computation < 500ms.
- **Scalability**: Support 100k concurrent users; horizontal scaling.
- **Security**: HTTPS, JWT with short expiry, rate limiting, input sanitization.
- **Reliability**: 99.9% uptime; graceful degradation.
- **Localization**: i18n support for English and French initially.
- **Offline**: Basic browsing with cached data; queue actions when offline.

## 5. Release Phases
- **MVP (P0)**: Auth, guest browse, search, business detail, booking flow, appointment management, availability engine, payment, notifications, provider portal, background jobs, shared types.
- **V1.1 (P1)**: Map search, favorites, user profile, reviews, admin dashboard.
- **V2**: Advanced analytics, loyalty program, multi-language, marketplace features.