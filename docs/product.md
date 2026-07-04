# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with local beauty and wellness businesses. Customers can discover services, book appointments, manage bookings, and pay. Business owners manage their services, staff, schedules, and appointments. An admin dashboard oversees the platform. The system uses background jobs for notifications, reminders, and slot computation.

## 2. User Stories & Feature Prioritization
Priorities: P0 (MVP must-have), P1 (high value), P2 (nice-to-have).

### 2.1 Customer
- As a guest, I want to browse businesses and services without signing up (P0).
- As a user, I want to sign up/login securely (P0).
- As a user, I want to search businesses by name, category, location (P0).
- As a user, I want to view businesses on a map (P1).
- As a user, I want to see business details, services, reviews, and availability (P0).
- As a user, I want to book an appointment by selecting service, staff, date/time (P0).
- As a user, I want to manage my upcoming and past appointments (P0).
- As a user, I want to save favorite businesses (P1).
- As a user, I want to manage my profile and payment methods (P1).
- As a user, I want to receive booking confirmations and reminders (P0).
- As a user, I want to rate and review completed services (P1).
- As a user, I want to pay securely via integrated payment (P1).

### 2.2 Business Owner
- As an owner, I want to register my business and manage its profile (P0).
- As an owner, I want to define services, durations, prices (P0).
- As an owner, I want to set staff and their working hours (P0).
- As an owner, I want to view and manage appointments (P0).
- As an owner, I want to receive new booking notifications (P0).
- As an owner, I want to view customer reviews (P1).
- As an owner, I want to see basic analytics (P2).

### 2.3 Admin
- As an admin, I want to manage all businesses, users, and appointments (P1).
- As an admin, I want to moderate reviews (P2).
- As an admin, I want to configure platform settings (P1).

## 3. Features & Acceptance Criteria

### 3.1 User Authentication (P0)
- **Registration**: Email/password, Google/Apple SSO. Validate email format, password strength (min 8 chars, 1 uppercase, 1 number). Send verification email.
- **Login**: Email/password, SSO. Handle invalid credentials with clear error messages. Rate limiting after 5 failed attempts.
- **Password Reset**: Forgot password flow with email link, token expiry 1 hour.
- **Session Management**: JWT access token (15 min) + refresh token (7 days). Logout invalidates refresh token.
- **Role-based access**: Customer, BusinessOwner, Admin roles stored in JWT.
- **Acceptance Criteria**:
  - User can register with email and password, receives verification email.
  - User can login with verified email and password, receives JWT.
  - Invalid login shows "Invalid email or password".
  - SSO login works for Google and Apple.
  - Password reset sends email with reset link; link expires after 1 hour.
  - Refresh token rotation implemented.

### 3.2 Guest Browse & Explore (P0)
- Unauthenticated users can view business listings, search, see business details, services, and reviews.
- Booking requires login; prompt to login/signup when tapping "Book".
- **Acceptance Criteria**:
  - Guest can open app, see featured businesses, search, view business page.
  - Tapping "Book" redirects to login/signup with return to booking flow after auth.

### 3.3 Business Search & Discovery (P0)
- **Search bar**: Full-text search on business name, services, description.
- **Filters**: Category (hair, nails, spa, etc.), price range, rating, distance (if location granted).
- **Sort**: Relevance, rating, distance, price.
- **Results**: Infinite scroll list with business card (image, name, rating, category, distance).
- **Acceptance Criteria**:
  - Search returns relevant businesses within 500ms.
  - Filters combine correctly (AND logic).
  - Sorting works for each option.
  - Results paginate (20 per page).

### 3.4 Map-based Search (P1)
- Interactive map showing business pins. Clustering for dense areas.
- Tap pin shows business preview card; tap card navigates to detail.
- Map view respects current search filters and location.
- **Acceptance Criteria**:
  - Map loads with user's current location (if permission granted).
  - Pins reflect search results; tapping pin shows name, rating, category.
  - Clustering works when >5 pins in close proximity.
  - Map and list views sync filters.

### 3.5 Business Detail View (P0)
- **Header**: Cover image, name, rating, category, address, favorite button.
- **Tabs/Sections**: About, Services, Reviews, Availability.
- **Services**: List with name, duration, price, description. Selectable for booking.
- **Staff**: If business has multiple staff, show staff members with their specialties.
- **Availability**: Show next 7 days with available time slots (computed from staff schedules and existing bookings).
- **Reviews**: Paginated list with star rating, comment, date, user name.
- **Acceptance Criteria**:
  - All sections load within 2 seconds.
  - Favorite toggle updates immediately with optimistic UI.
  - Service selection highlights and enables "Book" button.
  - Availability shows correct slots considering staff working hours, breaks, existing appointments, and buffer times.

### 3.6 Service Categories (P0)
- Predefined categories: Hair, Nails, Spa, Massage, Skin Care, Makeup, Barbershop, Wellness, etc.
- Category browsing: Grid/list of categories, tapping shows businesses in that category.
- Admin can manage categories (add/edit/disable).
- **Acceptance Criteria**:
  - Categories displayed on home screen.
  - Tapping category navigates to search results filtered by that category.
  - Admin can add new category with name and icon.

### 3.7 Booking Flow (P0)
- Step 1: Select service (if multiple, choose one).
- Step 2: Select staff (if applicable, otherwise auto-assign).
- Step 3: Select date from available days, then time slot from computed slots.
- Step 4: Review booking summary (business, service, staff, date/time, price).
- Step 5: Confirm booking. If payment required, proceed to payment; otherwise, confirm free booking.
- Booking creates appointment with status "confirmed" (or "pending" if owner approval needed).
- **Acceptance Criteria**:
  - Flow is linear with back navigation.
  - Time slots update in real-time (no double booking).
  - If slot becomes unavailable during flow, show error and refresh slots.
  - Successful booking shows confirmation screen with details and option to add to calendar.
  - Booking triggers notification to business owner and confirmation email to customer.

### 3.8 Appointment Management (P0)
- **Customer**: List of upcoming and past appointments. Actions: view details, cancel (if allowed by policy, e.g., 24h before), reschedule (if allowed), add to calendar.
- **Business Owner**: Calendar view (day/week) of all appointments. Actions: confirm, cancel, mark no-show, add notes.
- **Statuses**: confirmed, pending, cancelled, completed, no-show.
- **Acceptance Criteria**:
  - Customer can cancel upcoming appointment >24h before; cancellation triggers notification to owner.
  - Reschedule re-opens booking flow with pre-selected service and staff, updating existing appointment.
  - Owner can change status with appropriate permissions.
  - Past appointments show review prompt if not reviewed.

### 3.9 Favorites (P1)
- Users can favorite/unfavorite businesses from detail page or search results.
- Favorites list accessible from profile/tab.
- Sync across devices (stored server-side).
- **Acceptance Criteria**:
  - Heart icon toggles state; filled when favorited.
  - Favorites page shows list with business cards; empty state message.
  - Unfavoriting removes from list with animation.

### 3.10 User Profile (P1)
- Edit personal info: name, email, phone, profile picture.
- Manage payment methods: add/delete credit/debit cards (tokenized via Stripe).
- Notification preferences: push, email for bookings, reminders, promotions.
- View booking history.
- **Acceptance Criteria**:
  - Profile updates save and reflect immediately.
  - Payment methods stored securely; default card selection.
  - Notification toggles persist.

### 3.11 Availability & Slot Computation (P0)
- Core engine that computes available time slots for a given business, service, staff, and date.
- Inputs: Staff working hours (recurring weekly schedule with date overrides), service duration, buffer time before/after, existing appointments (including travel time if mobile), breaks.
- Output: Array of start times.
- Must handle timezone of business location.
- Recompute on booking/cancellation; cache with TTL.
- **Acceptance Criteria**:
  - Slots generated correctly for a 7-day window.
  - No overlapping appointments.
  - Respects buffer times (e.g., 15 min between appointments).
  - Handles staff unavailability (day off, vacation).
  - Performance: compute for 7 days within 200ms.

### 3.12 Shared Types & Design System (P0)
- TypeScript interfaces shared across frontend and backend: User, Business, Service, Staff, Appointment, Review, etc.
- Design system: consistent colors, typography, spacing, components (buttons, cards, inputs, modals).
- **Acceptance Criteria**:
  - All interfaces defined in a shared package.
  - UI components built with design tokens; no hardcoded styles.
  - Storybook documentation for components.

### 3.13 Reviews & Ratings (P1)
- Customers can leave a rating (1-5 stars) and optional comment after a completed appointment.
- Reviews displayed on business detail page with average rating.
- Business owner can respond to reviews (P2).
- Admin can moderate/hide inappropriate reviews.
- **Acceptance Criteria**:
  - Review submission updates average rating instantly.
  - One review per appointment.
  - Review list paginated, sorted by newest.
  - Owner response appears below review.
  - Admin can hide review with reason.

### 3.14 Payment Integration (P1)
- Integrate Stripe for payment processing.
- Customer adds card via Stripe Elements; tokenized.
- Payment captured at booking time (if business requires prepayment) or after service (if pay later).
- Support for promo codes/discounts (P2).
- **Acceptance Criteria**:
  - Secure card input with PCI compliance.
  - Successful payment updates appointment status to "paid".
  - Failed payment shows error and does not confirm booking.
  - Refund capability for cancellations (if policy).

### 3.15 Notifications (P0)
- Push notifications via Firebase Cloud Messaging (FCM) for mobile.
- Email notifications via SendGrid or similar.
- Triggers: booking confirmation, reminder (24h before), cancellation, new review, owner new booking alert.
- In-app notification center (P1).
- **Acceptance Criteria**:
  - Push notification received within 10 seconds of event.
  - Email delivered within 1 minute.
  - Notification preferences respected.
  - Deep link from notification to relevant screen.

### 3.16 Provider / Business Owner Portal (P0)
- Web-based dashboard (responsive) for business owners.
- Features:
  - Business profile management (name, description, photos, address, contact).
  - Service management: CRUD services with name, duration, price, description, category.
  - Staff management: add/edit staff, assign services, set working hours (recurring weekly schedule with date exceptions).
  - Appointment management: calendar view, list view, status updates, notes.
  - Customer management: view customer details and history.
  - Basic analytics: bookings count, revenue (P2).
- **Acceptance Criteria**:
  - Owner can update business info; changes reflect in customer app immediately.
  - Service creation validates required fields.
  - Staff schedule editor uses intuitive weekly grid with time pickers.
  - Appointment calendar shows color-coded statuses; drag to reschedule (P2).

### 3.17 Admin Dashboard (P1)
- Web dashboard for platform administrators.
- Features:
  - Business management: approve/reject new business registrations, suspend, view details.
  - User management: list users, disable accounts.
  - Appointment oversight: view all appointments, filter by business/status.
  - Category management: CRUD categories.
  - Review moderation: list flagged reviews, hide/unhide.
  - Platform configuration: commission rate, cancellation policy, buffer times, etc.
- **Acceptance Criteria**:
  - Admin can search and filter businesses/users.
  - Approving a business sends notification to owner.
  - Configuration changes take effect immediately.

### 3.18 Background Jobs (BullMQ) (P0)
- Use BullMQ with Redis for asynchronous tasks.
- Jobs:
  - Send email/push notifications (booking confirmation, reminders).
  - Compute and cache availability slots for next 7 days (scheduled daily or on booking change).
  - Generate daily reports (P2).
  - Cleanup expired tokens.
- **Acceptance Criteria**:
  - Jobs are queued and processed reliably with retry logic.
  - Failed jobs logged and alert admin after 3 retries.
  - Slot recomputation triggered by booking/cancellation events.
  - Reminder job runs hourly and sends notifications for appointments starting in 24h.

## 4. Non-Functional Requirements
- Performance: API response <200ms p95, app screen load <2s.
- Security: HTTPS, JWT with short expiry, input sanitization, rate limiting, PCI compliance for payments.
- Scalability: Horizontal scaling for API and workers.
- Accessibility: WCAG 2.1 AA for customer and owner portals.
- Localization: Support multiple languages (English, French initially).

## 5. Data Model (Key Entities)
- User (id, email, passwordHash, role, profile info)
- Business (id, ownerId, name, description, address, location lat/lng, category, photos, rating)
- Service (id, businessId, name, duration, price, description, category)
- Staff (id, businessId, name, services[], workingHours JSON)
- Appointment (id, customerId, businessId, serviceId, staffId, startTime, endTime, status, paymentStatus)
- Review (id, appointmentId, customerId, businessId, rating, comment, response)
- PaymentMethod (id, userId, stripePaymentMethodId, last4, brand)

## 6. API Endpoints (High-Level)
- Auth: POST /auth/register, /auth/login, /auth/refresh, /auth/forgot-password, /auth/reset-password
- Businesses: GET /businesses (search, filter), GET /businesses/:id, POST /businesses (owner), PUT /businesses/:id
- Services: CRUD under /businesses/:id/services
- Staff: CRUD under /businesses/:id/staff
- Availability: GET /businesses/:id/availability?serviceId=&staffId=&date=
- Appointments: POST /appointments, GET /appointments (customer/owner), PATCH /appointments/:id (status)
- Reviews: POST /appointments/:id/review, GET /businesses/:id/reviews
- Favorites: POST /favorites/:businessId, DELETE /favorites/:businessId, GET /favorites
- Payments: POST /payments/create-intent, POST /payments/confirm
- Notifications: GET /notifications (in-app)

## 7. Technology Stack Suggestions
- Frontend: React Native (mobile), Next.js (web owner/admin)
- Backend: Node.js with NestJS, PostgreSQL, Redis, BullMQ
- Infrastructure: Docker, Kubernetes, AWS/GCP
- Third-party: Stripe, Firebase Cloud Messaging, SendGrid, Google Maps API

## 8. Acceptance Test Scenarios (Key)
- User can complete booking flow end-to-end within 2 minutes.
- Double booking prevented under concurrent requests.
- Payment failure does not create confirmed appointment.
- Notification received for booking confirmation and reminder.
- Owner can update working hours and slots recompute correctly.
- Admin can suspend a business and its appointments become unavailable.

## 9. Release Plan
- MVP (P0): Auth, guest browse, search, business detail, booking flow, appointment management, availability engine, notifications, owner portal (basic), background jobs.
- V1.1 (P1): Map search, favorites, user profile, reviews & ratings, payment integration, admin dashboard.
- V1.2 (P2): Owner analytics, promo codes, in-app chat, advanced reporting.

This specification provides a complete blueprint for development, ensuring all user needs are addressed with clear priorities and acceptance criteria.