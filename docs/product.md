# Planity Clone Product Specification

## Overview
Planity Clone is a multi-platform beauty and wellness booking app that connects customers with salons, spas, and independent professionals. It enables seamless discovery, booking, and management of appointments while providing business owners tools to manage services, schedules, and clients. The platform includes user authentication, guest browsing, advanced search, map-based discovery, detailed business profiles, service categorization, a complete booking flow, appointment management, favorites, user profiles, slot computation, reviews, payments, notifications, a provider portal, an admin dashboard, and background job processing via BullMQ.

## User Roles
- **Guest**: Unauthenticated user who can browse, search, and view business details but cannot book or manage appointments.
- **Customer**: Authenticated user who can book services, manage appointments, leave reviews, save favorites, and update profile.
- **Business Owner/Provider**: Authenticated user managing one or more businesses. Can set services, availability, pricing, handle bookings, and view analytics.
- **Admin**: Platform administrator with full access to all businesses, users, and system settings. Can moderate content, manage disputes, and view high-level metrics.

## Feature Specifications

### 1. Guest Browse & Explore
**Priority:** P0 (Must-have)

**Description:** Allow unauthenticated users to explore the app, view business listings, see service catalogs, and read reviews without signing up. This reduces friction and encourages conversion.

**Acceptance Criteria:**
- Guest can view the home screen with featured businesses, categories, and search bar.
- Guest can browse businesses by category, popularity, or location.
- Guest can open a business detail page and see all services, prices, photos, ratings, and reviews.
- Guest cannot proceed to book; a “Sign in to book” prompt appears when tapping a time slot.
- Guest can search for businesses and apply filters (category, rating, price range) without login.
- All data is read-only and cached appropriately.

### 2. User Authentication
**Priority:** P0 (Must-have)

**Description:** Secure sign-up and login for customers and providers using email/password and social login. Supports role assignment during registration.

**Acceptance Criteria:**
- Customer can sign up with email, password, name, and optionally phone number; verification email sent.
- Provider can sign up with additional business details (business name, address, category) during onboarding.
- Social login (Google, Apple) works for both roles, with fallback to link account.
- Login returns JWT tokens (access + refresh) with role claims.
- Password reset flow via email.
- Session persistence across app restarts.
- Logout clears tokens and local state.
- Profile completion is enforced for providers before listing services.

### 3. Business Search & Discovery
**Priority:** P0 (Must-have)

**Description:** Powerful search with text query, filters, and sorting to help customers find the right business quickly.

**Acceptance Criteria:**
- Search bar on home screen with autocomplete (business name, category, service).
- Results list shows business name, main image, rating, distance, and brief description.
- Filters: category, rating (4+), price range (\$–\$\$\$), distance radius, open now.
- Sorting: relevance, rating, distance, price (low to high).
- Search supports partial matching and typo tolerance (fuzzy search).
- Infinite scroll in results list.
- Empty state with helpful message when no results.
- Search history saved for logged-in users.

### 4. Map-based Search
**Priority:** P1 (High)

**Description:** Interactive map view showing business locations, allowing users to explore visually and see businesses near a specific area.

**Acceptance Criteria:**
- Map view accessible from search results toggle (list/map).
- Map displays business markers with name, rating, and category icon.
- Clustering of markers when zoomed out.
- Tapping a marker shows a mini card with business name, rating, and a “View details” button.
- User can pan and zoom; map center updates results (automatic refresh).
- “Use my location” button to center map on user’s GPS location.
- Map respects the same filters as list view.
- Performance: smooth rendering with up to 500 markers.

### 5. Business Detail View
**Priority:** P0 (Must-have)

**Description:** Comprehensive business profile page with all information needed to make a booking decision.

**Acceptance Criteria:**
- Header: cover photo, business name, rating, category, address, and favorite button.
- Tabbed sections: About, Services, Reviews, Photos.
- About tab: description, working hours, amenities (Wi-Fi, parking), contact info, and social links.
- Services tab: list of services grouped by category, with name, duration, price, and a “Book” button.
- Reviews tab: average rating, rating distribution, and paginated reviews with user feedback.
- Photos tab: gallery of business photos, expandable.
- Sticky bottom bar with “Book Now” button.
- Loading states: skeleton screens.
- Error handling: retry button if fetching fails.

### 6. Service Categories
**Priority:** P0 (Must-have)

**Description:** Hierarchical categorization of services (e.g., Hair > Haircut, Coloring) to enable structured browsing and filtering.

**Acceptance Criteria:**
- Admin can create categories and subcategories via dashboard.
- Categories displayed on home screen and in search filters.
- Businesses can assign their services to one or more categories.
- Service selection in booking flow filtered by category.
- Category payload includes ID, name, icon, parent category (nullable).
- API returns flat list or tree structure as needed.

### 7. Booking Flow
**Priority:** P0 (Must-have)

**Description:** Seamless multi-step booking process: select service, choose staff (optional), pick date/time, confirm, and pay (if required).

**Acceptance Criteria:**
- Step 1: Service selection – shows list of services with durations and prices; user can select multiple services (if allowed).
- Step 2: Staff selection (optional) – shows available staff for the selected services on the chosen date; if only one staff, skip.
- Step 3: Date & Time – calendar with available dates highlighted; tapping a date shows time slots computed from availability (see Slot Computation). Slots are real-time.
- Step 4: Confirmation – summary of selected services, staff, date, time, total price, and any notes field. Promo code entry (if implemented).
- Step 5: Payment (if required) – integration with payment gateway; supports prepayment or pay-at-venue based on business settings.
- Booking confirmation screen with details and “Add to calendar” option.
- All steps must be navigable back and forth without losing state.
- Validation: selection of service and slot is required; time slot must be available.
- Concurrency: slot is reserved temporarily after selection (5-minute hold) to prevent double booking.

### 8. Appointment Management
**Priority:** P0 (Must-have)

**Description:** Customers can view, reschedule, cancel, and track their appointments.

**Acceptance Criteria:**
- “My Appointments” list with upcoming and past tabs.
- Each appointment shows date, time, business name, service(s), status, and actions.
- Statuses: confirmed, pending, rescheduled, cancelled, completed, no-show.
- Reschedule flow: user selects new date/time from available slots, old slot released.
- Cancel flow: confirmation dialog; cancellation policy displayed (e.g., free cancellation up to 24h before).
- Push notification and email for any status change.
- Past appointments allow rebooking and leaving a review.
- Appointment details page with map link to business.

### 9. Favorites
**Priority:** P1 (High)

**Description:** Users can save businesses to a favorites list for quick access.

**Acceptance Criteria:**
- Heart icon on business cards and detail page; toggles favorite status.
- Favorites tab in user profile showing list of saved businesses.
- List shows business name, rating, and next available slot (if any).
- Tapping navigates to business detail.
- Favorites synchronized across devices via backend.
- Unfavorite removes from list with confirmation toast.

### 10. User Profile
**Priority:** P0 (Must-have)

**Description:** Central place for users to manage personal information, preferences, and view history.

**Acceptance Criteria:**
- Profile picture, name, email, phone number (editable).
- Address book with multiple addresses for location-based search.
- Notification preferences (email, push, SMS).
- Payment methods: saved cards/wallets, ability to add/remove.
- Booking history and favorites.
- Settings: language, theme, account deletion.
- Profile completion meter for new users.

### 11. Availability & Slot Computation
**Priority:** P0 (Must-have)

**Description:** Real-time computation of available time slots based on staff schedules, service durations, existing bookings, and breaks.

**Acceptance Criteria:**
- Business defines working hours per staff member, including breaks and days off.
- Service has a duration (in minutes) and optional buffer time before/after.
- Slot engine computes available intervals for a given date, staff, and service(s) taking into account:
  - Staff working hours.
  - Existing bookings (including overlapping times).
  - Buffer times.
  - Multi-service booking: total duration = sum of durations + buffer; must fit within a contiguous block.
- Slots returned as list of start times (e.g., 09:00, 09:30) with availability status.
- Algorithm must handle concurrent access and prevent double booking via temporary holds (5-minute reservation).
- Slot computation must be fast (under 200ms for typical salon).
- Business can set maximum advance booking days.
- API endpoint: `GET /businesses/:id/slots?date=...&staffId=...&serviceIds=...`

### 12. Shared Types & Design System
**Priority:** P0 (Must-have)

**Description:** Consistent type definitions and UI components across frontend and backend to ensure maintainability and design consistency.

**Acceptance Criteria:**
- TypeScript interfaces shared via a monorepo package for all entities (User, Business, Service, Booking, Review, etc.).
- Design system: color palette, typography, spacing, component library (buttons, inputs, cards, modals) documented in Storybook or equivalent.
- Mobile-first responsive design with reusable components for both customer and provider apps.
- Accessibility: minimum contrast, semantic HTML, ARIA labels.
- Dark mode support.
- Linting rules for consistent code style.

### 13. Reviews & Ratings
**Priority:** P1 (High)

**Description:** Customers can leave ratings and written reviews after a completed appointment.

**Acceptance Criteria:**
- After booking completion, prompt to rate and review (rating 1-5 stars).
- Review form: star rating, text field (min 10 chars), option to add photos.
- Reviews displayed on business detail page with sort by newest, highest, lowest.
- Business owner can respond to reviews (publicly).
- Average rating updated asynchronously.
- Moderation: admin can hide/delete inappropriate reviews.
- User can edit or delete their own review within 48 hours.

### 14. Payment Integration
**Priority:** P1 (High)

**Description:** Secure payment processing for prepayments, deposits, or full payment at booking, with support for multiple payment methods.

**Acceptance Criteria:**
- Integration with Stripe (or similar) for card payments, Apple Pay, Google Pay.
- Business can set payment policy: no prepayment, deposit (percentage or fixed), full prepayment.
- Payment flow: after booking confirmation, if prepayment required, redirect to secure payment sheet; on success, booking confirmed.
- Saved payment methods in user profile.
- Refund handling for cancellations according to business policy (manual or automatic).
- PCI compliance: no sensitive card data stored on our servers; use Stripe Elements/tokenization.
- Transaction history for users and providers.

### 15. Notifications
**Priority:** P1 (High)

**Description:** Multi-channel notifications (push, email, in-app) for booking confirmations, reminders, cancellations, and promotional messages.

**Acceptance Criteria:**
- Push notifications via Firebase Cloud Messaging (FCM) for both customer and provider apps.
- Email notifications using transactional email service (SendGrid, SES).
- In-app notification center listing all notifications with read/unread state.
- Trigger events:
  - Customer: booking confirmed, appointment reminder (24h and 1h before), reschedule/cancel, review request after visit.
  - Provider: new booking, cancellation, reschedule.
- Notification preferences: user can toggle types per channel.
- Admin can send promotional push notifications to segmented users.
- Real-time updates via WebSocket or polling for in-app badge count.

### 16. Provider / Business Owner Portal
**Priority:** P0 (Must-have)

**Description:** A dedicated interface for business owners to manage their profile, services, staff, schedule, and bookings.

**Acceptance Criteria:**
- Dashboard with key metrics: today’s bookings, upcoming, revenue (if payments enabled).
- Service management: add/edit/delete services with name, description, duration, price, category, buffer time.
- Staff management: add staff members with working hours, break times, and assigned services.
- Calendar view: day/week/month showing bookings, with ability to manually add walk-ins or block time.
- Booking management: view list, confirm pending bookings (if manual approval enabled), cancel, mark as no-show.
- Client management: view client history, notes.
- Business profile editing: name, description, photos, working hours, amenities.
- Availability override: set custom dates (holidays, vacations) with different hours.
- Notifications toggle for new bookings, cancellations.
- Role-based access within a business: owner vs. staff (limited access).

### 17. Admin Dashboard
**Priority:** P1 (High)

**Description:** Central control panel for platform admins to oversee all businesses, users, and system health.

**Acceptance Criteria:**
- Overview metrics: total users, businesses, bookings, revenue, and growth trends.
- User management: search, view, suspend/ban users, change roles.
- Business management: approve new businesses (if required), edit, suspend, view analytics.
- Category management: create/edit/delete categories and subcategories.
- Review moderation queue: approve, hide, delete reported reviews.
- Dispute resolution: handle booking conflicts or payment issues.
- System configuration: feature flags, global settings (commission rate, cancellation policy).
- Audit log of admin actions.
- Role-based admin access: super admin, moderator.

### 18. Background Jobs (BullMQ)
**Priority:** P0 (Must-have)

**Description:** Asynchronous processing of time-consuming or scheduled tasks using BullMQ with Redis to ensure reliability and scalability.

**Acceptance Criteria:**
- Job queue for sending emails (welcome, booking confirmation, reminders).
- Job queue for push notifications (batch processing).
- Scheduled job for cleaning expired temporary slot holds (every 5 minutes).
- Job for generating daily/weekly reports for business owners.
- Job for updating average ratings after new review.
- Job for processing refunds (if automatic).
- Failed jobs are retried with exponential backoff and logged to a dead letter queue.
- Monitoring dashboard (Bull Board) for queue health.
- Graceful shutdown and proper error handling.

## Non-Functional Requirements
- **Performance:** API response times < 200ms for 95th percentile; slot computation < 500ms.
- **Scalability:** Horizontal scaling of backend services; database read replicas for search.
- **Security:** HTTPS, JWT, rate limiting, input sanitization, GDPR compliance.
- **Reliability:** 99.9% uptime for core booking flow; gracefully degrade map/search if third-party services fail.

## Priorities Breakdown
- **P0 (Must-have):** Guest Browse, Auth, Search, Business Detail, Service Categories, Booking Flow, Appointment Management, Availability & Slot Computation, User Profile, Shared Types & Design System, Provider Portal, Background Jobs.
- **P1 (High):** Map Search, Favorites, Reviews & Ratings, Payment Integration, Notifications, Admin Dashboard.
- **P2 (Medium):** Advanced analytics, loyalty program, multi-language support.
- **P3 (Low):** AR try-on, social sharing, integrations with third-party calendars.

