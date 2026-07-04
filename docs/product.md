# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with local beauty and wellness businesses. Users can discover services, book appointments, manage bookings, and leave reviews. Business owners manage their profiles, services, staff, and schedules. An admin dashboard oversees the platform. The system uses background jobs for notifications, reminders, and slot computation.

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 (Critical)
**Description:** Secure sign-up, login, and session management for customers and providers. Supports email/password and social login (Google, Apple).
**Acceptance Criteria:**
- User can register with email, password, first name, last name, and role (customer/provider).
- Email verification required; verification link sent via email.
- Login with email/password returns JWT access and refresh tokens.
- Social login (Google, Apple) creates or links account.
- Password reset flow: request reset link, set new password.
- Session persists across app restarts using secure token storage.
- Logout invalidates refresh token.
- Error messages for invalid credentials, duplicate email, weak password.
- Rate limiting on login attempts (5 failures per minute per IP).

### 2.2 Guest Browse & Explore
**Priority:** P1 (High)
**Description:** Unauthenticated users can browse businesses, services, and reviews without signing up.
**Acceptance Criteria:**
- Home screen shows featured businesses, popular categories, and search bar.
- Guest can search businesses by name, category, location.
- Guest can view business detail page with services, photos, reviews.
- Booking flow prompts login/registration before confirming appointment.
- Favorites and profile actions hidden or disabled for guests.
- No personal data stored until account creation.

### 2.3 Business Search & Discovery
**Priority:** P0 (Critical)
**Description:** Full-text search with filters for category, location, rating, price range, and availability.
**Acceptance Criteria:**
- Search bar with autocomplete suggestions (business names, categories).
- Results list with business name, rating, distance, next available slot.
- Filters: category (multi-select), price range (slider), rating (stars), open now toggle, distance radius.
- Sort options: relevance, rating, distance, price low-high, soonest available.
- Pagination (infinite scroll) with 20 results per page.
- Search query persisted in URL for deep linking.
- Empty state with suggestions to broaden filters.
- Search works offline with cached data (last results).

### 2.4 Map-based Search
**Priority:** P1 (High)
**Description:** Interactive map view showing business locations with clustering.
**Acceptance Criteria:**
- Toggle between list and map view on search results.
- Map displays business pins with rating badge.
- Pin clustering at high zoom levels.
- Tap pin shows mini card with name, rating, next slot; tap card navigates to detail.
- Map centers on user’s current location (with permission) or searched location.
- Re-search when map region changes significantly (debounced).
- Map markers update when filters change.
- Offline map tiles cached for recent areas.

### 2.5 Business Detail View
**Priority:** P0 (Critical)
**Description:** Comprehensive business profile with services, staff, reviews, and booking CTA.
**Acceptance Criteria:**
- Header with cover photo, business name, rating, address, distance.
- Action buttons: call, directions (opens maps), share, favorite.
- Tabbed sections: Services, About, Reviews, Photos.
- Services tab: list of services grouped by category, with duration, price, and “Book” button.
- Staff selection (if multi-staff) with avatar, name, specialties.
- About tab: description, amenities, business hours, payment methods.
- Reviews tab: summary rating distribution, list of reviews with pagination.
- Photos tab: gallery with lightbox.
- Sticky bottom bar with “Book Now” button (if available) or “Check Availability”.
- Loading skeleton while fetching.
- Error state with retry.

### 2.6 Service Categories
**Priority:** P1 (High)
**Description:** Hierarchical category system for browsing and filtering.
**Acceptance Criteria:**
- Home screen shows top-level categories (Hair, Nails, Massage, Skin, etc.) with icons.
- Category detail page shows subcategories and popular businesses.
- Categories managed in admin dashboard (CRUD).
- Each business assigned one or more categories.
- Category-based search filter with multi-select.
- Category images and icons stored in CDN.
- Deep linking to category pages.

### 2.7 Booking Flow
**Priority:** P0 (Critical)
**Description:** Step-by-step appointment booking: service selection, staff, date/time, confirmation, payment.
**Acceptance Criteria:**
- Step 1: Select service(s) from business’s service list; show duration and price.
- Step 2: Select staff member (if applicable) or “Any available”.
- Step 3: Date picker showing available days; time slots based on real-time availability.
- Step 4: Review summary (service, staff, date, time, price, duration).
- Step 5: Add notes, select payment method (card on file or new), apply promo code.
- Step 6: Confirm booking; on success, show confirmation screen with details and option to add to calendar.
- Booking holds slot for 10 minutes during checkout; releases if not completed.
- Real-time slot availability check before confirmation.
- Guest users prompted to sign up/login after step 4.
- Error handling for slot taken, payment failure, network issues.
- Booking ID generated and stored.

### 2.8 Appointment Management
**Priority:** P0 (Critical)
**Description:** Users can view, reschedule, cancel upcoming appointments; view history.
**Acceptance Criteria:**
- “My Appointments” screen with tabs: Upcoming, Past.
- Upcoming list shows appointment card with business, service, date/time, status.
- Actions: Reschedule (opens modified booking flow with existing service/staff), Cancel (with confirmation dialog and optional reason), Add to Calendar, Get Directions.
- Cancellation policy: free cancellation up to X hours before (configurable per business); late cancellation may incur fee.
- Reschedule updates slot and sends notifications.
- Past appointments show details and prompt to leave review if not already reviewed.
- Push notification reminders 24h and 1h before appointment.
- Appointment statuses: confirmed, rescheduled, cancelled, completed, no-show.
- Sync with device calendar (optional).

### 2.9 Favorites
**Priority:** P2 (Medium)
**Description:** Users can save favorite businesses for quick access.
**Acceptance Criteria:**
- Heart icon on business cards and detail page to toggle favorite.
- “Favorites” screen lists saved businesses with next available slot.
- Favorites persist across devices (synced to account).
- Unfavorite removes from list with undo option.
- Empty state with suggestion to explore.
- Requires authentication.

### 2.10 User Profile
**Priority:** P1 (High)
**Description:** Manage personal information, payment methods, notification preferences, and account settings.
**Acceptance Criteria:**
- Profile screen with avatar, name, email, phone.
- Edit profile: change name, phone, profile picture (camera/gallery).
- Payment methods: add/remove credit/debit cards (tokenized via Stripe).
- Notification preferences: toggle push, email, SMS for booking confirmations, reminders, promotions.
- Booking history link.
- Favorites link.
- Logout and delete account options (with confirmation).
- Account deletion removes personal data (GDPR compliant).
- Language and theme settings (future).

### 2.11 Availability & Slot Computation
**Priority:** P0 (Critical)
**Description:** Real-time calculation of available time slots based on business hours, staff schedules, existing bookings, and service duration.
**Acceptance Criteria:**
- Business defines working hours per day, breaks, and holidays.
- Staff have individual schedules (can differ from business hours).
- Service duration (including buffer time) used to compute slots.
- Slot generation algorithm: for a given date, staff, and service, return list of start times where the staff is free for the entire duration.
- Slots updated in real-time when bookings are made/cancelled.
- Slot hold mechanism: when user enters checkout, slot is temporarily reserved for 10 minutes; if checkout abandoned, slot released.
- Background job (BullMQ) recalculates and caches availability for next N days periodically and on booking changes.
- API endpoints: get available slots for (business, service, staff, date).
- Support for multiple staff and parallel bookings (if business allows).
- Timezone handling: all times stored in UTC, displayed in business’s local time.

### 2.12 Shared Types & Design System
**Priority:** P1 (High)
**Description:** Consistent UI components, typography, colors, and shared TypeScript types across web and mobile.
**Acceptance Criteria:**
- Design system library (e.g., Storybook) with atoms, molecules, organisms.
- Shared types: User, Business, Service, Staff, Appointment, Review, etc.
- Responsive components for mobile (React Native) and web (React).
- Theming: light/dark mode support, brand colors, spacing scale.
- Accessibility: minimum contrast, touch targets, screen reader support.
- Component documentation and usage examples.
- Versioned package published to private npm registry.

### 2.13 Reviews & Ratings
**Priority:** P1 (High)
**Description:** Customers can rate and review businesses after a completed appointment.
**Acceptance Criteria:**
- After appointment completion, prompt user to leave review via push/email.
- Review form: star rating (1-5), text review (optional), photo upload (optional).
- Reviews displayed on business detail page with moderation status.
- Business owner can respond to reviews (publicly).
- Review moderation: auto-flag profanity, manual approval option.
- Average rating and distribution updated asynchronously.
- User can edit/delete their own review.
- Review list sorted by recent or helpful.
- One review per appointment.

### 2.14 Payment Integration
**Priority:** P0 (Critical)
**Description:** Secure payment processing via Stripe for booking prepayment or no-show fees.
**Acceptance Criteria:**
- Customer adds card via Stripe Elements/PaymentSheet; card tokenized and stored.
- Payment flow: booking confirmation triggers payment intent for service amount (if prepay) or hold for no-show fee.
- Support for Apple Pay and Google Pay.
- Receipt sent via email after successful payment.
- Refund processing for cancellations (according to policy) via admin or automated.
- PCI compliance: no raw card data touches server.
- Payment statuses: pending, succeeded, failed, refunded.
- Webhook handling for Stripe events (payment_intent.succeeded, etc.) to update booking status.
- Error handling with user-friendly messages.

### 2.15 Notifications
**Priority:** P1 (High)
**Description:** Push, email, and SMS notifications for booking confirmations, reminders, cancellations, and promotions.
**Acceptance Criteria:**
- Push notifications via Firebase Cloud Messaging (FCM) for mobile.
- Email via SendGrid or SES with templates.
- SMS via Twilio for critical alerts (optional).
- Notification triggers:
  - Booking confirmed (customer & provider)
  - Booking reminder (24h and 1h before)
  - Booking cancelled/rescheduled
  - Review request after appointment
  - Promotional messages (opt-in)
- Notification preferences in user profile.
- In-app notification center with read/unread status.
- Background job (BullMQ) processes notification dispatch with retries.
- Delivery status tracking.

### 2.16 Provider / Business Owner Portal
**Priority:** P0 (Critical)
**Description:** Web and mobile portal for business owners to manage profile, services, staff, schedule, and bookings.
**Acceptance Criteria:**
- Registration/onboarding: business details, address, category, logo, cover photo.
- Dashboard: today’s appointments, upcoming, revenue summary (if payments enabled).
- Appointment management: view, confirm, cancel, mark no-show, add notes.
- Calendar view: day/week/month with staff filter; drag to reschedule.
- Service management: CRUD services with name, duration, price, category, description, image.
- Staff management: add/edit staff with name, avatar, specialties, working hours, breaks, holidays.
- Business profile editing: description, photos, amenities, payment methods, cancellation policy.
- Availability settings: set business hours, special hours for holidays.
- Review management: view and respond to reviews.
- Notifications: real-time alerts for new bookings, cancellations.
- Multi-staff support: each staff has own schedule and bookings.
- Role-based access: owner vs staff (staff can only view own appointments).

### 2.17 Admin Dashboard
**Priority:** P1 (High)
**Description:** Super admin panel to manage businesses, users, categories, reviews, and platform settings.
**Acceptance Criteria:**
- Secure login with admin role.
- Dashboard with key metrics: total bookings, revenue, active businesses, users.
- Business management: list, search, approve/reject, suspend, edit details.
- User management: list, search, view details, disable accounts.
- Category management: CRUD with icons and ordering.
- Review moderation: approve/reject flagged reviews.
- Transaction log: view payments, refunds.
- Configuration: global cancellation policy, commission rates, notification templates.
- Audit log for sensitive actions.
- Export data to CSV.

### 2.18 Background Jobs (BullMQ)
**Priority:** P1 (High)
**Description:** Asynchronous job processing for non-blocking operations like notifications, slot computation, and data cleanup.
**Acceptance Criteria:**
- Job queues: notifications (email, push, SMS), slot-recalculation, booking-expiry (release held slots), review-request, data-cleanup.
- BullMQ with Redis as backend.
- Job scheduling: delayed jobs for reminders (24h, 1h before).
- Retry logic with exponential backoff for failed jobs.
- Dead letter queue for jobs exceeding max retries.
- Monitoring dashboard (Bull Board) for queue health.
- Idempotency: duplicate job prevention.
- Graceful shutdown handling.

## 3. Priority Summary
- **P0 (Critical):** User Authentication, Business Search & Discovery, Business Detail View, Booking Flow, Appointment Management, Availability & Slot Computation, Payment Integration, Provider Portal.
- **P1 (High):** Guest Browse, Map Search, Service Categories, User Profile, Shared Types & Design System, Reviews & Ratings, Notifications, Admin Dashboard, Background Jobs.
- **P2 (Medium):** Favorites.

## 4. Non-Functional Requirements
- Performance: API response < 200ms p95, slot computation < 500ms.
- Scalability: support 100k concurrent users.
- Security: OWASP top 10, HTTPS, data encryption at rest.
- Accessibility: WCAG 2.1 AA.
- Localization: i18n ready (English, French initially).
- Offline support: cached data for browsing, graceful degradation.

## 5. Assumptions & Dependencies
- Stripe for payments, Firebase for push, SendGrid for email, Twilio for SMS.
- Map provider: Google Maps or Mapbox.
- Cloud storage: AWS S3 for images.
- Real-time updates via WebSockets (Socket.io) for provider dashboard.
- BullMQ requires Redis.

## 6. Glossary
- **Slot:** A specific start time for a service of a given duration with a specific staff member.
- **Hold:** Temporary reservation of a slot during checkout.
- **Provider/Business Owner:** The salon or spa offering services.
- **Staff:** Individual service provider within a business.
