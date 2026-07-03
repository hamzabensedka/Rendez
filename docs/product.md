# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with beauty and wellness businesses. It enables discovery, booking, and management of appointments. The product includes a customer-facing app, a provider portal, and an admin dashboard.

## 2. User Roles
- Guest (unauthenticated user)
- Customer (authenticated user)
- Provider (business owner/staff)
- Admin (platform administrator)

## 3. Features

### 3.1 User Authentication
**Priority: P0**  
**Description:** Secure sign-up, login, and session management.  
**Acceptance Criteria:**
- Users can sign up with email/password, Google, or Apple SSO.
- Email verification required before first booking.
- Password reset flow via email.
- Session persists across app restarts; token refresh handled automatically.
- Logout clears local session data.
- Error messages for invalid credentials, duplicate email, network issues.

### 3.2 Guest Browse & Explore
**Priority: P0**  
**Description:** Unauthenticated users can browse businesses and services but must log in to book.  
**Acceptance Criteria:**
- Guest can view home screen with featured businesses, categories, and search.
- Guest can search businesses, view details, read reviews, see services and pricing.
- "Book" button prompts login/sign-up modal.
- Guest can add favorites (stored locally, synced after login).
- No access to booking flow, appointment management, or profile.

### 3.3 Business Search & Discovery
**Priority: P0**  
**Description:** Search businesses by name, category, location, and filters.  
**Acceptance Criteria:**
- Search bar with autocomplete suggestions (business names, categories).
- Filters: category, price range, rating, distance, availability (today, this week).
- Results sorted by relevance, distance, or rating (user selectable).
- Infinite scroll pagination.
- Each result card shows business name, main image, rating, distance, next available slot.
- Empty state with suggestions when no results.

### 3.4 Map-based Search
**Priority: P1**  
**Description:** Interactive map view to discover businesses geographically.  
**Acceptance Criteria:**
- Toggle between list and map view on search results.
- Map shows business pins with clustering for dense areas.
- Tapping a pin shows a preview card with name, rating, distance.
- Map centers on user's current location (with permission) or searched location.
- Dragging map updates results within visible bounds (debounced).
- Works seamlessly with filters.

### 3.5 Business Detail View
**Priority: P0**  
**Description:** Comprehensive business profile page.  
**Acceptance Criteria:**
- Hero image carousel, business name, rating, address, distance, open status.
- Tabbed sections: Services, About, Reviews, Photos.
- Services tab: list of services with duration, price, and "Book" button.
- About tab: description, amenities, business hours, contact info.
- Reviews tab: summary rating, review list with pagination, ability to write a review (if booked).
- Photos tab: gallery of business photos.
- Sticky bottom bar with "Book" CTA.
- Share button to share business profile.

### 3.6 Service Categories
**Priority: P0**  
**Description:** Hierarchical category system for browsing.  
**Acceptance Criteria:**
- Home screen shows top-level categories (Hair, Nails, Massage, etc.) with icons.
- Tapping a category navigates to subcategories or directly to businesses.
- Category page shows featured businesses, subcategories, and filters.
- Admin can manage categories and assign to businesses.

### 3.7 Booking Flow
**Priority: P0**  
**Description:** Step-by-step appointment booking.  
**Acceptance Criteria:**
- Flow: Select service → Select staff (optional) → Select date → Select time slot → Review & confirm → Payment (if required) → Confirmation.
- Date picker shows available days highlighted; unavailable days greyed out.
- Time slots shown based on real-time availability (computed via slot computation).
- User can add notes, select add-ons if available.
- Review screen shows service, date, time, staff, price, duration, cancellation policy.
- Payment step integrated with Stripe (if prepayment required) or hold card.
- Booking confirmation screen with appointment details and option to add to calendar.
- Error handling for slot taken during booking, payment failure, network issues.
- Guest redirected to login/sign-up after selecting service; booking resumed after authentication.

### 3.8 Appointment Management
**Priority: P0**  
**Description:** View, modify, and cancel upcoming and past appointments.  
**Acceptance Criteria:**
- Appointments list with tabs: Upcoming, Past, Cancelled.
- Each appointment card shows business name, service, date, time, status.
- Tap to view appointment details: full info, provider details, map link, add to calendar, cancel/reschedule options.
- Cancel appointment: confirmation dialog, reason selection, cancellation policy enforcement (e.g., free cancellation up to 24h).
- Reschedule: re-enter booking flow with pre-selected service, allowing date/time change.
- Push notification reminders 24h and 1h before appointment.
- Past appointments allow rebooking and leaving a review.

### 3.9 Favorites
**Priority: P1**  
**Description:** Save businesses for quick access.  
**Acceptance Criteria:**
- Heart icon on business cards and detail page to toggle favorite.
- Favorites list accessible from profile/tab bar.
- Favorites sync across devices for authenticated users.
- Guest favorites stored locally and merged on login.
- Favorites show business name, image, rating, next available slot.

### 3.10 User Profile
**Priority: P1**  
**Description:** Manage personal information and preferences.  
**Acceptance Criteria:**
- View/edit profile: name, email, phone, profile photo.
- Notification preferences: push, email, SMS toggles.
- Payment methods: add/remove credit cards (Stripe).
- Booking history link.
- Favorites link.
- App settings: language, theme (if applicable).
- Delete account option with confirmation.

### 3.11 Availability & Slot Computation
**Priority: P0 (backend service)**  
**Description:** Real-time computation of available time slots based on provider schedules, bookings, buffers, and holidays.  
**Acceptance Criteria:**
- Providers define working hours per day, break times, service durations, buffer times between appointments.
- System computes available slots for a given service, staff, and date, excluding existing bookings and blocked times.
- Slots are returned in local timezone of the business.
- Slot computation must be performant (<200ms) and handle concurrent booking attempts to prevent double-booking.
- Use database transactions or locking to ensure consistency when booking.
- Support for multiple staff members; if no staff selected, show combined availability.
- Handle timezone differences between user and business.

### 3.12 Shared Types & Design System
**Priority: P0 (foundational)**  
**Description:** Consistent TypeScript types and UI components across frontend apps.  
**Acceptance Criteria:**
- Shared types package for: User, Business, Service, Appointment, Review, etc.
- Design system with reusable components: Button, Input, Card, Modal, StarRating, etc., following brand guidelines.
- Components support theming, accessibility (a11y), and responsive design.
- Storybook documentation for all components.
- Consistent spacing, typography, color tokens.

### 3.13 Reviews & Ratings
**Priority: P1**  
**Description:** Customers can rate and review businesses after a completed appointment.  
**Acceptance Criteria:**
- After appointment completion, prompt user to leave a review (push notification and in-app).
- Review form: star rating (1-5), text review (optional), photo upload (optional).
- Reviews displayed on business detail page with average rating, distribution, and list.
- Users can edit or delete their own reviews.
- Providers cannot delete reviews but can report inappropriate ones.
- Admin can moderate reviews (hide/delete reported reviews).
- Reviews sorted by most recent or most helpful.

### 3.14 Payment Integration
**Priority: P0**  
**Description:** Secure payment processing via Stripe for bookings requiring prepayment or no-show protection.  
**Acceptance Criteria:**
- Support for credit/debit cards, digital wallets (Apple Pay, Google Pay).
- Card details collected via Stripe Elements (PCI-compliant).
- Payment flow: hold card at booking (no charge) or charge upfront based on business setting.
- Capture payment after service completion or charge cancellation/no-show fee according to policy.
- Receipts sent via email after successful payment.
- Refund processing for cancellations (if applicable) via admin or automated.
- Payment methods stored securely in Stripe for future use (with user consent).
- Error handling for declined cards, insufficient funds, network issues.

### 3.15 Notifications
**Priority: P1**  
**Description:** Push, email, and in-app notifications for various events.  
**Acceptance Criteria:**
- Push notifications: booking confirmation, reminders (24h, 1h), cancellation, review request, promotional (opt-in).
- Email notifications: booking confirmation, receipts, reminders, account changes.
- In-app notification center with list of recent notifications, mark as read.
- Notification preferences managed in user profile.
- Providers receive notifications for new bookings, cancellations, reviews.
- Admin can send broadcast push notifications to segments.
- Reliable delivery using Firebase Cloud Messaging (FCM) and email service (SendGrid).

### 3.16 Provider / Business Owner Portal
**Priority: P0**  
**Description:** Web and mobile portal for providers to manage their business, services, staff, schedule, and appointments.  
**Acceptance Criteria:**
- Dashboard: today's appointments, upcoming bookings, revenue summary.
- Appointment management: view, confirm, cancel, reschedule, add notes, mark no-show.
- Calendar view: daily/weekly/monthly, color-coded by staff, drag-and-drop reschedule.
- Service management: add/edit/delete services, set duration, price, description, category, buffer time.
- Staff management: add staff members, assign services, set working hours, breaks, time off.
- Business profile: edit name, description, photos, address, contact, business hours, policies.
- Availability settings: recurring weekly schedule, special dates (holidays, extended hours).
- Notifications: real-time alerts for new bookings, cancellations.
- Reports: basic analytics (bookings, revenue, popular services) over time.
- Multi-location support for chains.

### 3.17 Admin Dashboard
**Priority: P1**  
**Description:** Web-based admin panel for platform management.  
**Acceptance Criteria:**
- Dashboard with KPIs: total users, providers, bookings, revenue, active users.
- User management: list, search, view details, suspend/ban users.
- Provider management: approve/reject new provider registrations, view/edit provider details, suspend.
- Booking management: view all bookings, filter by status, date, provider; manual override (cancel, refund).
- Category management: CRUD for service categories, assign icons, order.
- Review moderation: list reported reviews, approve/hide/delete.
- Promotions: create and manage promo codes, discounts.
- Content management: featured businesses, banners for home screen.
- System configuration: global settings (cancellation policy defaults, commission rates, etc.).
- Audit log for sensitive actions.

### 3.18 Background Jobs (BullMQ)
**Priority: P0 (infrastructure)**  
**Description:** Asynchronous job processing for non-blocking operations.  
**Acceptance Criteria:**
- Job queues for: sending notifications (push, email), generating reports, processing payment captures/refunds, cleaning up expired holds, syncing data to analytics.
- Reliable job processing with retries, dead letter queue, and monitoring.
- Scheduled jobs: appointment reminders (24h, 1h before), review requests (after appointment), recurring tasks (daily revenue reports).
- Concurrency control to avoid overwhelming external APIs.
- Dashboard for monitoring queue health (Bull Board or similar).
- Idempotency for critical jobs to prevent duplicate notifications/charges.

## 4. Non-Functional Requirements
- Performance: App screens load <2s, slot computation <200ms, search results <1s.
- Security: HTTPS, JWT with refresh tokens, input sanitization, rate limiting, PCI compliance via Stripe.
- Scalability: Horizontal scaling for API, database read replicas, caching (Redis) for availability slots.
- Accessibility: WCAG 2.1 AA compliance for customer and provider portals.
- Localization: Support for multiple languages (English, French initially) and date/time formats.

## 5. Technical Stack (Recommended)
- Frontend: React Native (mobile), Next.js (web portals)
- Backend: Node.js with NestJS, PostgreSQL, Redis, BullMQ
- Integrations: Stripe, Firebase Cloud Messaging, SendGrid, Google Maps API
- Infrastructure: Docker, Kubernetes, CI/CD

## 6. Release Phases
- Phase 1 (MVP): User Auth, Guest Browse, Search & Discovery, Business Detail, Service Categories, Booking Flow, Appointment Management, Availability & Slot Computation, Payment Integration, Notifications (basic), Provider Portal (core), Background Jobs.
- Phase 2: Map-based Search, Favorites, User Profile, Reviews & Ratings, Admin Dashboard, enhanced notifications, provider analytics.
- Phase 3: Advanced features (multi-language, loyalty, marketing automation).