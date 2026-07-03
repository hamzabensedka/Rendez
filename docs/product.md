# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with local service businesses (salons, spas, barbers, etc.). Users can discover businesses, book appointments, manage bookings, and leave reviews. Business owners manage their services, staff, and schedules. An admin dashboard oversees the platform. The system uses BullMQ for background jobs like reminders and notifications.

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 (Must-have)
**Description:** Secure sign-up, login, and session management for customers and providers. Supports email/password and social login (Google, Apple).
**Acceptance Criteria:**
- User can register with email and password; verification email sent.
- User can log in with email/password; JWT token issued.
- Social login (Google, Apple) works and links to existing account if email matches.
- Password reset flow: request link, reset password.
- Session persists across app restarts; token refresh mechanism.
- Logout clears session.
- Error messages for invalid credentials, duplicate email, network issues.

### 2.2 Guest Browse & Explore
**Priority:** P1 (High)
**Description:** Unauthenticated users can browse businesses, view details, and see services, but cannot book or favorite.
**Acceptance Criteria:**
- Home screen shows featured businesses and categories without login.
- Search and map work for guests.
- Business detail page accessible; booking button prompts login/sign-up.
- Favorites icon prompts login.
- No personal data stored until authentication.

### 2.3 Business Search & Discovery
**Priority:** P0
**Description:** Users search for businesses by name, category, location, or service. Results include filters and sorting.
**Acceptance Criteria:**
- Search bar with autocomplete (business names, categories).
- Results list with business name, rating, distance, next available slot.
- Filters: category, price range, rating, open now, amenities.
- Sort by: relevance, distance, rating, price.
- Pagination or infinite scroll.
- Empty state with suggestions.
- Search works with location permission or manual address input.

### 2.4 Map-based Search
**Priority:** P1
**Description:** Interactive map showing business locations. Users can move map to update results.
**Acceptance Criteria:**
- Map view toggle on search results.
- Pins for businesses with basic info on tap.
- Clustering for dense areas.
- Map recenters on user's location (if permitted).
- Tapping pin opens detail preview; full detail on "View" action.
- Map updates results as user pans/zooms.

### 2.5 Business Detail View
**Priority:** P0
**Description:** Comprehensive business profile with services, staff, reviews, photos, and booking CTA.
**Acceptance Criteria:**
- Header: cover photo, name, rating, address, distance, favorite button.
- Tabs/sections: About, Services, Staff, Reviews, Photos.
- Services list with name, duration, price; selectable for booking.
- Staff list with photo, specialties; selectable for booking.
- Reviews with rating distribution, individual reviews, pagination.
- Photo gallery with lightbox.
- Prominent "Book Now" button.
- Contact options: call, directions, website.
- Business hours displayed; "Open/Closed" status.

### 2.6 Service Categories
**Priority:** P0
**Description:** Hierarchical categories (e.g., Hair > Haircut, Coloring) for browsing and filtering.
**Acceptance Criteria:**
- Home screen category grid with icons.
- Category page shows subcategories and top businesses.
- Selecting a category filters search results.
- Categories managed via admin dashboard.
- Each business assigned to one or more categories.

### 2.7 Booking Flow
**Priority:** P0
**Description:** Step-by-step appointment booking: select service, staff (optional), date/time, confirm, and pay.
**Acceptance Criteria:**
- Service selection: single or multiple services (package).
- Staff selection: any or specific staff; shows availability.
- Date/time picker: calendar with available slots; time slots based on real-time availability.
- Summary screen: service, staff, date, time, price, duration.
- User can add notes or special requests.
- Payment step: card input (Stripe) or saved card; apply promo code.
- Confirmation screen with booking details and option to add to calendar.
- Booking requires authentication; guest redirected to login/sign-up then back to flow.
- Real-time slot hold (5 min) to prevent double booking.
- Error handling for expired holds, payment failures.

### 2.8 Appointment Management
**Priority:** P0
**Description:** Users view, modify, cancel upcoming and past appointments.
**Acceptance Criteria:**
- Appointments list with tabs: Upcoming, Past, Cancelled.
- Each appointment shows business, service, date/time, status.
- Actions: Reschedule (if allowed by policy), Cancel (with confirmation and cancellation policy notice), Add to calendar, Contact business.
- Reschedule flow reuses booking date/time selection; updates appointment.
- Cancellation triggers refund if applicable per policy.
- Push notification reminders 24h and 1h before appointment.
- Past appointments allow rebooking and review prompt.

### 2.9 Favorites
**Priority:** P1
**Description:** Users save favorite businesses for quick access.
**Acceptance Criteria:**
- Heart icon on business cards and detail page; toggles favorite.
- Favorites list accessible from profile/tab.
- List shows business name, rating, next available slot; tap to detail.
- Syncs across user's devices.
- Requires authentication.

### 2.10 User Profile
**Priority:** P1
**Description:** Manage personal information, payment methods, notification preferences, and booking history.
**Acceptance Criteria:**
- Edit name, email, phone, profile photo.
- Manage saved payment methods (add, delete, set default).
- Notification preferences: push, email, SMS toggles.
- View booking history.
- Link/unlink social accounts.
- Delete account with confirmation and data wipe.

### 2.11 Availability & Slot Computation
**Priority:** P0
**Description:** Real-time calculation of available time slots based on business hours, staff schedules, existing bookings, and service duration.
**Acceptance Criteria:**
- Business sets operating hours per day, breaks, holidays.
- Staff have working hours, days off, service assignments.
- Slot engine considers service duration, buffer time, concurrent bookings (if staff can handle multiple).
- Slots returned as start times; exclude past times.
- Handle timezone of business location.
- Caching for performance; invalidated on new booking/cancellation.
- API endpoint returns available slots for given date, service, staff.

### 2.12 Shared Types & Design System
**Priority:** P0
**Description:** Consistent TypeScript types/interfaces and UI components across frontend and backend.
**Acceptance Criteria:**
- Shared package with types for User, Business, Service, Staff, Booking, Review, etc.
- Design system: color palette, typography, spacing, reusable components (Button, Card, Modal, Input, StarRating).
- Components documented in Storybook.
- Responsive design for mobile (primary) and tablet.
- Accessibility: semantic HTML, ARIA labels, keyboard navigation, color contrast.

### 2.13 Reviews & Ratings
**Priority:** P1
**Description:** Customers leave star ratings and written reviews after appointments.
**Acceptance Criteria:**
- Prompt to review after completed appointment (push/email).
- Review form: star rating (1-5), text (optional), photo upload (optional).
- Reviews displayed on business detail with moderation status.
- Business owner can respond to reviews.
- Admin can moderate/hide inappropriate reviews.
- Average rating and distribution updated in real-time.
- Users can edit/delete their own reviews.

### 2.14 Payment Integration
**Priority:** P0
**Description:** Secure payment processing via Stripe for bookings. Supports card payments and saved cards.
**Acceptance Criteria:**
- Stripe Elements for card input; PCI compliant.
- Support for Apple Pay / Google Pay (if available).
- Save card for future use (with consent).
- Payment captured at booking time; hold/authorize only.
- Refund on cancellation according to business policy (full/partial).
- Transaction history in user profile and provider portal.
- Webhook handling for payment events (success, failure, refund).
- Error handling: insufficient funds, card declined, network errors.

### 2.15 Notifications
**Priority:** P1
**Description:** Push notifications, email, and in-app notifications for booking confirmations, reminders, cancellations, and promotions.
**Acceptance Criteria:**
- Push notifications via Firebase Cloud Messaging (FCM) for mobile.
- Email via SendGrid or similar for transactional emails.
- In-app notification center with read/unread status.
- Triggers: booking confirmed, reminder (24h, 1h), cancelled, rescheduled, review request, payment receipt.
- User can opt-out per channel.
- Provider notifications: new booking, cancellation, review received.
- Admin notifications: new business registration, flagged reviews.
- Background jobs (BullMQ) handle sending.

### 2.16 Provider / Business Owner Portal
**Priority:** P0
**Description:** Web portal for business owners to manage profile, services, staff, schedule, and bookings.
**Acceptance Criteria:**
- Dashboard with today's appointments, revenue summary, upcoming bookings.
- Business profile management: name, description, photos, address, hours, contact.
- Service management: add/edit/delete services with name, duration, price, category, description.
- Staff management: add/edit/delete staff, assign services, set working hours, days off.
- Calendar view: daily/weekly/monthly; see bookings, block time, manage availability.
- Booking management: view, confirm, cancel, reschedule bookings; add manual bookings.
- Client management: view client list, booking history, notes.
- Reports: revenue, bookings count, popular services, staff utilization.
- Settings: cancellation policy, booking lead time, buffer time, payment settings.
- Authentication: separate login for providers; role-based access.

### 2.17 Admin Dashboard
**Priority:** P1
**Description:** Super admin panel to manage all businesses, users, reviews, categories, and platform settings.
**Acceptance Criteria:**
- Dashboard with platform metrics: total bookings, revenue, active users, businesses.
- Business management: approve/reject new businesses, edit, suspend, delete.
- User management: view users, disable accounts, view booking history.
- Review moderation: approve, reject, flag reviews.
- Category management: add/edit/delete categories and subcategories.
- Commission/fee settings: percentage or flat fee per booking.
- Promo codes management: create, set discount, usage limits.
- System configuration: global settings, notification templates.
- Role-based access: super admin, support staff.

### 2.18 Background Jobs (BullMQ)
**Priority:** P0
**Description:** Asynchronous job processing for non-blocking tasks like sending notifications, generating reports, cleaning expired holds.
**Acceptance Criteria:**
- BullMQ queues: notifications (email, push), booking reminders, slot hold expiry, report generation, data cleanup.
- Jobs triggered by events (booking created, cancelled, etc.).
- Retry logic with exponential backoff for failed jobs.
- Dead letter queue for permanently failed jobs with alerting.
- Monitoring dashboard (Bull Board) for queue health.
- Scheduled jobs: daily summary emails, weekly reports.
- Concurrency and rate limiting to respect third-party API limits.

## 3. Priority Summary
| Feature | Priority |
|---|---|
| User Authentication | P0 |
| Guest Browse & Explore | P1 |
| Business Search & Discovery | P0 |
| Map-based Search | P1 |
| Business Detail View | P0 |
| Service Categories | P0 |
| Booking Flow | P0 |
| Appointment Management | P0 |
| Favorites | P1 |
| User Profile | P1 |
| Availability & Slot Computation | P0 |
| Shared Types & Design System | P0 |
| Reviews & Ratings | P1 |
| Payment Integration | P0 |
| Notifications | P1 |
| Provider / Business Owner Portal | P0 |
| Admin Dashboard | P1 |
| Background Jobs (BullMQ) | P0 |

## 4. Non-Functional Requirements
- Performance: API response < 200ms for 95th percentile; slot computation < 500ms.
- Security: HTTPS, JWT with short expiry, refresh tokens, input sanitization, rate limiting.
- Scalability: Horizontal scaling for API and workers; database indexing.
- Reliability: 99.9% uptime; graceful degradation for third-party failures.
- Accessibility: WCAG 2.1 AA compliance.
- Localization: Support for multiple languages (i18n) and currencies.

## 5. Assumptions & Dependencies
- Stripe for payments; FCM for push; SendGrid for email.
- Map provider: Google Maps or Mapbox.
- BullMQ with Redis.
- Database: PostgreSQL with PostGIS for geospatial queries.
- File storage: AWS S3 or similar for images.
- Business hours and staff schedules are set by provider; slot engine uses these.
- Cancellation policy defined per business; refund logic accordingly.

## 6. Out of Scope (MVP)
- In-app chat between customer and business.
- Loyalty programs.
- Multi-language content (only UI i18n).
- Advanced analytics for providers.
- Marketplace for products.