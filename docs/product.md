# Planity Clone Product Specification

## 1. Introduction
Planity Clone is a mobile-first, end-to-end booking platform for beauty and wellness services. It connects customers with salons, spas, barbershops, and independent professionals, enabling seamless discovery, real-time booking, payment, and management.

## 2. Product Vision
Provide a frictionless, delightful booking experience that turns first-time visitors into loyal customers, while giving service providers powerful tools to manage and grow their business. The platform must be reliable, scalable, and feel native to mobile devices.

## 3. Target Users
- **End Customers**: individuals seeking beauty/wellness services (hair, nails, massage, skincare, etc.).
- **Service Providers (Business Owners)**: salon/barbershop owners, freelancers, and staff.
- **Platform Administrators**: operate and moderate the marketplace.

## 4. Feature Specifications & Acceptance Criteria
All features are classified using MoSCoW priority: **MUST** (critical for launch), **SHOULD** (high-value, can be fast-follow), **COULD** (nice-to-have, post-MVP).

### 4.1 User Authentication (MUST)
- **Description**: Secure account creation, login, and session management. Supports email/password and social providers (Google, Apple).
- **Acceptance Criteria**:
  - User can sign up with email, password, name → verification email sent.
  - User can sign up / login with Google or Apple (OAuth2).
  - Password recovery flow (forgot password → reset link → new password).
  - Session persists via refresh/access tokens (JWT).
  - Logout clears tokens and redirects.
  - Input validation and rate limiting on auth endpoints.
  - Unauthenticated users can access guest features only; must login/signup to book.

### 4.2 Guest Browse & Explore (SHOULD)
- **Description**: Allow unauthenticated users to discover businesses, services, and availability before committing to sign up.
- **Acceptance Criteria**:
  - Guest can search businesses by name, location, and view results.
  - Guest can open business details, view services, ratings, photos, and available time slots (generic).
  - On tap “Book”, show a modal prompting signup/login with option to continue as guest (save booking after account creation).
  - No personal data is stored until the user authenticates.

### 4.3 Business Search & Discovery (MUST)
- **Description**: Powerful search with filters to help customers find the right provider.
- **Acceptance Criteria**:
  - Search bar with autocomplete (business name, service, area).
  - Filter by category/subcategory (e.g., Hair > Women’s Haircut).
  - Filter by location (city, radius, GPS).
  - Filter by price range, rating, availability (now/today/this week).
  - Sort by relevance, distance, rating, price (low-high).
  - Results displayed as a list with business name, image, rating, distance, next available slot.
  - Empty state when no results found.
  - All filters and sorting must reset when starting a fresh search.

### 4.4 Map-based Search (SHOULD)
- **Description**: Visual discovery on an interactive map.
- **Acceptance Criteria**:
  - Toggle between list view and map view.
  - Map shows business pins with rating badge and thumbnail.
  - Pan/zoom updates results within map bounds.
  - Tap pin opens a preview card with key info and a “View details” button.
  - User’s current location used as default center (with permission).
  - Performance: load clustered pins for high density.

### 4.5 Business Detail View (MUST)
- **Description**: Comprehensive profile of a business to support confident booking decisions.
- **Acceptance Criteria**:
  - Hero image gallery with swipe/zoom.
  - Business name, address (with map link), phone (tap to call), website.
  - Operating hours (today’s schedule highlighted, status “Open/Closed”).
  - Service list grouped by category, with duration, price, and description.
  - Staff selection (if multiple) with photo and speciality.
  - Integrated reviews & ratings summary (star average, total count) with snippets.
  - “Book” CTA that starts booking flow for a selected service.
  - Share button (native share sheet).

### 4.6 Service Categories (MUST)
- **Description**: Hierarchical taxonomy to organize offerings and power discovery.
- **Acceptance Criteria**:
  - Admin can manage categories (create, edit, archive).
  - Categories have icons (or visual assets) displayed in a grid on home screen and search filters.
  - Subcategories (e.g., Hair → Coloring, Haircut, Styling).
  - Service list on business detail reflects assigned categories.
  - Multi-language support: category names must be translatable.

### 4.7 Booking Flow (MUST)
- **Description**: Step-by-step, mobile-optimized wizard to confirm an appointment.
- **Acceptance Criteria**:
  - **Step 1 – Choose Service**: select from provider’s services (with price/duration).
  - **Step 2 – Choose Staff (optional)**: if business has multiple staff, display list with name/photo. “Any” allowed.
  - **Step 3 – Date & Time**: calendar picker showing available dates, then time slots (computed in real-time). Display “no slots” if full. Visual indicators for limited availability.
  - **Step 4 – Extras & Notes**: add-ons (e.g., deep treatment) checkboxes, special requests textarea.
  - **Step 5 – Review**: summary of booking, total price (including taxes), promo code input.
  - **Step 6 – Payment**: card input (Stripe Elements) or saved card, Apple Pay/Google Pay (if available).
  - **Confirmation**: success screen with booking ID, date/time, provider info, option to add to calendar. Push notification sent immediately.
- **Edge Cases**:
  - Concurrency: slot blocked for 5 min when selected; released if checkout abandoned → handled by availability lock.
  - Handle timezone: all times stored in UTC; display in business’s local time.
  - Validation: step back allowed; cart cleared on session expiry.

### 4.8 Appointment Management (MUST)
- **Description**: Customer hub for all booked appointments.
- **Acceptance Criteria**:
  - Two tabs: “Upcoming” and “History”.
  - Each appointment card shows date/time, business name, service, status (confirmed, completed, cancelled, no-show).
  - Cancel button (with policy check: free cancellation up to X hours before, else penalty message). Confirmation modal.
  - Reschedule button: re-enters booking flow with same service/provider; original slot released after success.
  - Add to calendar (ICS file or direct integration).
  - Real-time status update if provider cancels/reschedules (via push notification).

### 4.9 Favorites (SHOULD)
- **Description**: Save businesses and services for quick access.
- **Acceptance Criteria**:
  - Heart icon on business card and detail view; toggling saves/unsaves.
  - Favorites list accessible from profile/tab, syncs across devices (authenticated user).
  - Favorites persist after logout/login.
  - Indicator next to business name if already booked recently (optional).

### 4.10 User Profile (MUST)
- **Description**: Personal account and settings.
- **Acceptance Criteria**:
  - Edit name, email, phone number, profile photo.
  - Manage saved addresses (home, work) for quick location selection.
  - Manage payment methods: add/delete credit cards (tokenized via Stripe), set default.
  - Notification preferences: push, email, SMS (toggle per category: bookings, promotions, reminders).
  - Appointment history with quick rebook option.
  - Linked social accounts indicator.
  - Data export / account deletion (GDPR compliance).

### 4.11 Availability & Slot Computation (MUST)
- **Description**: Backend service that dynamically generates bookable time slots considering business logic.
- **Acceptance Criteria**:
  - Inputs: business regular hours, special date overrides (holidays, closures), staff schedules, service duration, buffer time between appointments, break times, existing bookings, staff assignments.
  - Output: list of available start times for a given date, staff, and service.
  - Must handle overlapping rules: e.g., staff Alex works 9–5 but has lunch 12-1, and only provides services they are qualified for.
  - Buffer time after each appointment (configurable per service or business).
  - Respects max advance booking days (e.g., 30 days).
  - Real-time recalculation on demand; cached for up to 1 minute.
  - Concurrency control: a slot can be temporarily held (locked) for 5 minutes during checkout to prevent double booking.
  - API endpoint `GET /availability?businessId&serviceId&date&staffId` returns slots.

### 4.12 Reviews & Ratings (SHOULD)
- **Description**: Post-service rating and feedback system.
- **Acceptance Criteria**:
  - After appointment status reaches “completed”, customer receives push/email to leave a review (within 7 days).
  - Review form: star rating 1-5, optional text comment (min 10 chars), optional photo upload.
  - Reviews are displayed on business detail: average rating, count distribution, list with most recent first.
  - Business owner can reply publicly (one reply per review).
  - Moderation: admin can hide/remove inappropriate reviews via dashboard.
  - Duplicate prevention: one review per appointment.

### 4.13 Payment Integration (MUST)
- **Description**: Secure, PCI-compliant payment processing.
- **Acceptance Criteria**:
  - Integration with Stripe (or equivalent) for card processing.
  - Support for credit/debit cards, Apple Pay, Google Pay.
  - Payment flow: customer enters card details or uses saved card; pre-authorization at booking, capture when service is completed (or immediate capture based on business setting).
  - Refund mechanism: admin/provider can issue full/partial refund via dashboard; refund reflected in customer’s payment history.
  - Receipt sent via email after successful payment.
  - Strong error handling: decline reasons, network failure, retry logic.
  - All sensitive data is tokenized; PCI DSS compliance via Stripe.

### 4.14 Notifications (MUST)
- **Description**: Multi-channel messaging to keep users informed.
- **Acceptance Criteria**:
  - **Push notifications**: booking confirmation, reminder (24h and 1h before), cancellation, provider message, review prompt.
  - **In-app notifications**: bell icon with unread badge; list of recent notifications; tap to navigate.
  - **Email**: transactional emails (booking receipts, cancellations) using responsive templates.
  - User can opt out of non-essential notifications per channel via profile settings.
  - Backend dispatches via a job queue (BullMQ) to ensure delivery and retry.

### 4.15 Provider / Business Owner Portal (MUST)
- **Description**: Web-based dashboard for providers to manage their business.
- **Acceptance Criteria**:
  - **Dashboard**: today’s appointments list, upcoming bookings, walk-in management, revenue summary.
  - **Appointment management**: view/edit appointment, accept/decline (if manual approval enabled), reschedule, cancel, mark as no-show/completed.
  - **Calendar view**: day/week/month with drag-resize appointments; color by staff or service.
  - **Business settings**: edit business info (name, address, hours, holidays), services and pricing (add/edit/delete, categories, duration, price, buffer, staff assignment).
  - **Staff management**: add/remove staff, assign services, set individual working hours and breaks.
  - **Client list**: search by name/email, view booking history, add notes.
  - **Analytics**: basic charts – bookings over time, revenue, popular services, top clients.
  - **Availability overrides**: block time range, change hours for specific dates.
  - Access via secure login (separate from customer login).

### 4.16 Admin Dashboard (MUST)
- **Description**: Super admin panel for platform operations.
- **Acceptance Criteria**:
  - **Business management**: search/filter, approve new business registrations, edit business details, suspend/activate.
  - **User management**: view customer and provider accounts, disable accounts.
  - **Category management**: create/edit/delete service categories and subcategories with icons.
  - **Booking oversight**: view all bookings, filter by status, date, business; ability to cancel/refund.
  - **Moderation**: review flagged reviews, approve/hide/delete.
  - **Financial reporting**: total revenue (commission, platform fee), payouts to providers, transactions export.
  - **Promo codes**: create and manage discount codes (percentage/fixed, validity, usage limits).
  - **System configuration**: global settings (max booking days, cancellation policy template, default commission %).
  - Role-based access: admin roles with fine-grained permissions.

### 4.17 Background Jobs (BullMQ)
- **Description**: Asynchronous processing for non-blocking operations.
- **Acceptance Criteria**:
  - Job queue architecture using BullMQ (Redis-based) for: sending emails, push notifications, generating daily/weekly reports, cleaning expired token blacklist, processing payment settlements, handling abandoned cart cleanup.
  - Retry logic with exponential backoff for failed jobs.
  - Scheduled jobs: appointment reminders (24h/1h before), review prompts after completion.
  - Dashboard (via Bull Board) to monitor queue health, job failures.
  - Jobs must be idempotent where possible to prevent duplicates.

## 5. Shared Types & Design System
- **Shared Types**: A central TypeScript type library defining interfaces for all domain models (User, Business, Service, Booking, Review, etc.). Enforced consistency across frontend and backend.
- **Design System**: A component library (React Native / Web) with tokens (colors, typography, spacing) and reusable components (Button, Card, Modal, Input) to ensure UI consistency and rapid development. Must support light/dark mode.
- **API Contracts**: REST endpoints defined with OpenAPI/Swagger; request/response shapes validated with Zod or similar.

## 6. Non-Functional Requirements
- **Performance**: App shell load < 2s, booking flow steps < 1s each, slot computation < 200ms.
- **Scalability**: Handle 100k concurrent users, 10k businesses. Stateless services, database read replicas, caching (Redis).
- **Security**: HTTPS everywhere, JWT with short-lived access tokens, refresh rotation, input sanitation, rate limiting, GDPR compliance.
- **Accessibility**: WCAG 2.1 AA for web, mobile accessibility basics (labels, contrast).
- **Testing**: Unit tests for business logic, integration tests for API, E2E tests for critical booking flow.

## 7. Priorities Summary
- **MUST (MVP)**: User Authentication, Business Search & Discovery (including Service Categories), Business Detail, Booking Flow, Payment, Appointment Management, User Profile, Availability Computation, Provider Portal, Admin Dashboard, Notifications, Background Jobs.
- **SHOULD (v1.1)**: Guest Browse, Favorites, Reviews & Ratings, Map-based Search.
- **COULD (Future)**: Advanced analytics for providers, social sharing, loyalty program, AI recommendations.

This specification guides development phases, ensuring a user-centric, scalable, and maintainable platform.