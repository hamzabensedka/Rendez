# Planity Clone Product Specification

## 1. Introduction
Planity Clone is a mobile-first platform connecting customers with local service businesses (salons, spas, barbers, etc.) for seamless appointment booking. This document defines the complete feature set, acceptance criteria, and priorities for the MVP and subsequent releases.

## 2. Feature Overview & Priorities
All features are categorized by priority:
- **P0 (Must-have)**: Core booking flow, authentication, business discovery, availability, appointment management.
- **P1 (Should-have)**: Reviews, favorites, notifications, payment integration, provider portal basics.
- **P2 (Nice-to-have)**: Admin dashboard, advanced provider tools, background job enhancements.

## 3. Shared Types & Design System (Cross-cutting)
**Priority: P0**
- Define TypeScript interfaces for all entities: User, Business, Service, Appointment, Review, etc.
- Establish a design system with reusable components (buttons, cards, inputs, modals) and consistent theming (colors, typography, spacing).
- Acceptance Criteria:
  - All frontend components use shared types and design tokens.
  - Backend API responses conform to shared DTOs.
  - Design system documented in Storybook.

## 4. User Authentication
**Priority: P0**
- **Description**: Allow users to sign up, log in, and manage sessions. Support email/password and social login (Google, Apple).
- **User Stories**:
  - As a new user, I want to create an account quickly so I can book services.
  - As a returning user, I want to log in securely and stay logged in.
- **Acceptance Criteria**:
  - Registration with email, password, and name; email verification required.
  - Login with email/password; JWT token issued, stored securely.
  - Social login (Google, Apple) with OAuth 2.0; account linking if email matches.
  - Password reset flow via email link.
  - Session persistence across app restarts; token refresh mechanism.
  - Logout clears local session.
  - Error handling for invalid credentials, duplicate emails, network issues.

## 5. Guest Browse & Explore
**Priority: P0**
- **Description**: Unauthenticated users can browse businesses and services but must log in to book.
- **Acceptance Criteria**:
  - Home screen shows featured businesses, categories, and search bar.
  - Guest can view business details, services, reviews, and availability (read-only).
  - Attempting to book prompts login/signup modal.
  - No personal data stored for guests.

## 6. Business Search & Discovery
**Priority: P0**
- **Description**: Users can search for businesses by name, category, or keyword, with filters and sorting.
- **Acceptance Criteria**:
  - Search bar with autocomplete suggestions (business names, categories).
  - Filter by category, rating, price range, distance, availability.
  - Sort by relevance, rating, distance, price.
  - Results displayed as cards with image, name, rating, distance, next available slot.
  - Pagination or infinite scroll.
  - Empty state when no results.
  - Recent searches saved locally.

## 7. Map-based Search
**Priority: P1**
- **Description**: Visual map view showing nearby businesses with pins; tap to see details.
- **Acceptance Criteria**:
  - Map integrated (Google Maps or Mapbox) with user's current location.
  - Business pins clustered at high zoom levels.
  - Tap pin shows mini card with name, rating, distance; tap card navigates to detail.
  - Search bar overlays map; results update map pins.
  - Location permission handling gracefully.

## 8. Business Detail View
**Priority: P0**
- **Description**: Comprehensive page for a business: info, services, reviews, gallery, and booking CTA.
- **Acceptance Criteria**:
  - Hero image carousel, business name, rating, address, contact, hours.
  - Tabbed sections: Services, Reviews, About, Gallery.
  - Services list with name, duration, price, description; expandable details.
  - "Book" button prominent; if logged in, opens booking flow; else prompts login.
  - Share button, favorite toggle.
  - Map thumbnail showing location.
  - Loading skeleton while fetching.

## 9. Service Categories
**Priority: P0**
- **Description**: Hierarchical category system (e.g., Hair > Haircut, Coloring) for browsing and filtering.
- **Acceptance Criteria**:
  - Home screen category grid with icons.
  - Category page shows subcategories and top businesses.
  - Admin can manage categories (P2).
  - Businesses can assign multiple categories to their services.
  - Category-based search filter.

## 10. Booking Flow
**Priority: P0**
- **Description**: Step-by-step process to select service, staff (optional), date/time, and confirm booking.
- **User Stories**:
  - As a customer, I want to book an appointment in a few taps.
  - As a customer, I want to see real-time availability.
- **Acceptance Criteria**:
  - Step 1: Select service(s) from business's list; can add multiple.
  - Step 2: Choose staff member (if business has multiple) or "Any available".
  - Step 3: Date picker showing available days; time slots based on computed availability.
  - Step 4: Review summary (services, staff, date, time, total price, duration).
  - Step 5: Confirm booking; if payment required, integrate payment (P1).
  - Booking confirmation screen with details and option to add to calendar.
  - Handle concurrent slot booking with optimistic locking; show error if slot taken.
  - Guest redirected to login/signup before confirmation.
  - Loading states and validation at each step.

## 11. Appointment Management
**Priority: P0**
- **Description**: Users can view upcoming and past appointments, reschedule, or cancel.
- **Acceptance Criteria**:
  - "My Appointments" list with tabs: Upcoming, Past.
  - Each appointment card shows business, service, date, time, status.
  - Tap to see full details; actions: Reschedule, Cancel, Add to Calendar, Get Directions.
  - Reschedule flow reuses booking date/time selection; updates appointment.
  - Cancellation with confirmation dialog; optionally reason.
  - Cancellation policy enforced (e.g., free cancellation up to X hours before).
  - Push notification reminders (P1).
  - Status updates: Confirmed, Completed, Cancelled, No-show.

## 12. Favorites
**Priority: P1**
- **Description**: Users can save businesses to a favorites list for quick access.
- **Acceptance Criteria**:
  - Heart icon on business cards and detail page; toggle to add/remove.
  - Favorites tab in user profile showing saved businesses.
  - Sync across devices (logged-in state).
  - Empty state with suggestion to explore.

## 13. User Profile
**Priority: P0**
- **Description**: Manage personal information, preferences, and account settings.
- **Acceptance Criteria**:
  - View/edit name, email, phone, profile photo.
  - Change password.
  - Notification preferences (email, push).
  - Payment methods management (P1).
  - Link/unlink social accounts.
  - Delete account with confirmation.
  - All changes require re-authentication for sensitive actions.

## 14. Availability & Slot Computation
**Priority: P0**
- **Description**: Backend service that calculates available time slots based on business hours, staff schedules, existing appointments, and service duration.
- **Acceptance Criteria**:
  - Business sets weekly opening hours, breaks, holidays.
  - Staff have working hours and service assignments.
  - Slot computation considers buffer time between appointments, travel time (if mobile).
  - API endpoint returns available slots for a given date, service, staff.
  - Real-time updates: when a slot is booked, it's immediately unavailable.
  - Handles timezone correctly.
  - Performance: compute slots for 60 days ahead within 500ms.

## 15. Reviews & Ratings
**Priority: P1**
- **Description**: Customers can leave reviews and ratings after a completed appointment.
- **Acceptance Criteria**:
  - After appointment marked completed, prompt user to rate (1-5 stars) and write review.
  - Review form with star rating, text, optional photo.
  - Reviews displayed on business detail page with sorting (most recent, highest rated).
  - Business average rating updated asynchronously.
  - Business owner can respond to reviews (P2).
  - Abuse reporting and moderation (admin, P2).
  - User can edit/delete their own review.

## 16. Payment Integration
**Priority: P1**
- **Description**: Secure payment processing for bookings that require prepayment or deposit.
- **Acceptance Criteria**:
  - Integrate Stripe for card payments; support Apple Pay/Google Pay.
  - Business can set payment policy: pay now, pay at venue, deposit.
  - Payment flow during booking confirmation step.
  - Save payment methods for future use (with PCI compliance).
  - Receipt generated and emailed.
  - Refund processing for cancellations according to policy.
  - Handle payment failures gracefully with retry option.

## 17. Notifications
**Priority: P1**
- **Description**: Push and email notifications for booking confirmations, reminders, cancellations, and promotions.
- **Acceptance Criteria**:
  - Push notifications via Firebase Cloud Messaging (FCM) or APNs.
  - Email notifications via SendGrid or similar.
  - Triggered events: booking confirmed, reminder 24h and 1h before, cancelled, rescheduled, review request.
  - User can opt-in/out per notification type in profile.
  - Deep linking from notification to relevant screen.
  - Background job queue (BullMQ) to schedule and send notifications reliably.

## 18. Provider / Business Owner Portal
**Priority: P1**
- **Description**: Web and mobile portal for business owners to manage their profile, services, staff, appointments, and view analytics.
- **Acceptance Criteria**:
  - Business registration and onboarding (verify ownership).
  - Dashboard with today's appointments, upcoming, metrics (bookings, revenue).
  - Manage business profile: name, description, photos, hours, location.
  - Service management: add/edit/delete services with name, duration, price, category.
  - Staff management: add staff, assign services, set working hours.
  - Appointment management: view calendar, accept/decline booking requests (if manual approval), mark no-show/complete.
  - Basic analytics: bookings over time, popular services, customer retention.
  - Multi-location support (P2).

## 19. Admin Dashboard
**Priority: P2**
- **Description**: Super admin panel to manage platform, businesses, users, and resolve issues.
- **Acceptance Criteria**:
  - User management: view, suspend, delete users.
  - Business management: approve new businesses, edit, suspend.
  - Category management: CRUD for service categories.
  - Review moderation: approve/reject flagged reviews.
  - Platform analytics: total bookings, revenue, active users, growth.
  - Configuration: global settings (commission rates, cancellation policies).
  - Role-based access control.

## 20. Background Jobs (BullMQ)
**Priority: P1**
- **Description**: Use BullMQ with Redis to handle asynchronous tasks like notifications, reminders, data cleanup, and analytics.
- **Acceptance Criteria**:
  - Job queues: notifications, emails, appointment reminders, review requests, data aggregation.
  - Scheduled jobs: send reminder 24h before appointment; mark no-show after grace period.
  - Retry logic with exponential backoff for failed jobs.
  - Monitoring dashboard (Bull Board) for queue health.
  - Graceful shutdown and error handling.

## 21. Non-Functional Requirements
- Performance: API response < 200ms for 95th percentile; slot computation < 500ms.
- Security: HTTPS, JWT with short expiry, refresh tokens, input sanitization, rate limiting.
- Scalability: Stateless backend, horizontal scaling, database indexing.
- Accessibility: WCAG 2.1 AA compliance for customer-facing UI.
- Localization: Support multiple languages (P2).

## 22. Release Plan
- **MVP (P0)**: Authentication, guest browse, search, business detail, booking flow, appointment management, user profile, availability computation, shared types.
- **V1 (P1)**: Map search, favorites, reviews, payments, notifications, provider portal basics, background jobs.
- **V2 (P2)**: Admin dashboard, advanced provider features, multi-language, advanced analytics.