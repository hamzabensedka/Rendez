# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first beauty & wellness booking platform connecting customers with salons, spas, and independent professionals. It enables discovery, booking, payment, and appointment management for consumers, while providing business owners with a portal to manage services, staff, and schedules. An admin dashboard oversees platform health. The system uses background jobs for notifications, reminders, and slot computation.

## 2. User Roles
- **Guest**: Unauthenticated user who can browse, search, and view businesses but cannot book.
- **Customer**: Authenticated user with full booking, favorites, profile, and payment capabilities.
- **Provider (Business Owner)**: Authenticated user managing one or more businesses, services, staff, schedules, and appointments.
- **Admin**: Platform administrator with access to dashboard, user management, and system configuration.

## 3. Shared Types & Design System
**Priority: High**
- **Description**: Define reusable TypeScript types/interfaces and a consistent UI component library to ensure uniformity across all frontends (customer app, provider portal, admin dashboard).
- **Types**: User, Business, Service, Staff, Appointment, Review, Payment, Notification, Category, Location (lat/lng), TimeSlot.
- **Design System**: Colors, typography, spacing, buttons, cards, form elements, modals, loading states, error states, empty states. Implement as a shared package or documented Storybook.
- **Acceptance Criteria**:
  - All features use shared types; no duplication.
  - UI components are responsive and accessible (WCAG 2.1 AA).
  - Design tokens are centralized and customizable.
  - Storybook or equivalent documentation exists for all components.

## 4. User Authentication
**Priority: High**
- **Description**: Secure sign-up, login, and session management for customers and providers. Admins use a separate secure login.
- **User Stories**:
  - As a guest, I want to sign up with email/password or social login (Google, Apple) so I can book services.
  - As a user, I want to log in and maintain a session across app restarts.
  - As a provider, I want to register my business and verify my email.
  - As an admin, I want to log in via a separate secure portal.
- **Acceptance Criteria**:
  - Email/password registration with validation and password strength meter.
  - Social login (Google, Apple) with OAuth 2.0.
  - Email verification required before first booking.
  - JWT-based authentication with refresh tokens; session persists for 30 days.
  - Forgot password flow with email reset link.
  - Provider registration includes business name, address, and category; admin approval required before going live.
  - Admin login uses MFA (TOTP).
  - All endpoints enforce role-based access control.

## 5. Guest Browse & Explore
**Priority: High**
- **Description**: Unauthenticated users can browse businesses, view details, and search, but are prompted to sign up when attempting to book.
- **User Stories**:
  - As a guest, I want to see featured businesses and categories on the home screen.
  - As a guest, I want to search for a service or business without logging in.
  - As a guest, I want to view business details, services, and reviews.
- **Acceptance Criteria**:
  - Home screen displays curated lists: “Popular Near You”, “Top Rated”, “Newly Added”.
  - Search bar and category chips are accessible.
  - Tapping “Book” on a service prompts sign-up/login modal with seamless transition after authentication.
  - No personalization (favorites, history) until logged in.

## 6. Business Search & Discovery
**Priority: High**
- **Description**: Customers can search for businesses by name, service, or category, with filters and sorting.
- **User Stories**:
  - As a customer, I want to search for “haircut” and see relevant salons.
  - As a customer, I want to filter by location, rating, price range, availability.
  - As a customer, I want to sort results by distance, rating, or price.
- **Acceptance Criteria**:
  - Full-text search with autocomplete suggestions (min 3 chars).
  - Filters: category, subcategory, distance radius (1/5/10/20 km), rating (4+), price range (€, €€, €€€), open now.
  - Sorting: relevance, distance, rating (high to low), price (low to high).
  - Results display business card: image, name, rating, distance, next available slot.
  - Infinite scroll with pagination.
  - Empty state with suggestions to broaden filters.

## 7. Map-based Search
**Priority: Medium**
- **Description**: Interactive map view showing business locations, allowing spatial discovery.
- **User Stories**:
  - As a customer, I want to see salons on a map around my current location.
  - As a customer, I want to tap a pin to see a preview and navigate to the business detail.
- **Acceptance Criteria**:
  - Map loads with user’s current location (permission required).
  - Business pins cluster at high zoom levels.
  - Tapping a pin shows a mini card with name, rating, and next slot; tapping card opens full detail.
  - Map updates as user pans/zooms; search bar filters map results.
  - Toggle between list view and map view.

## 8. Business Detail View
**Priority: High**
- **Description**: Comprehensive page for a business, showcasing services, staff, reviews, and booking options.
- **User Stories**:
  - As a customer, I want to see all services grouped by category, with prices and durations.
  - As a customer, I want to view staff profiles and select a preferred staff member.
  - As a customer, I want to read reviews and see the overall rating.
  - As a customer, I want to see the business location on a map and get directions.
- **Acceptance Criteria**:
  - Header: cover image, business name, rating, address, distance, favorite button.
  - Services tab: accordion by category, each service shows name, duration, price, “Book” button.
  - Staff tab: list of staff with photo, name, specialties; selecting a staff filters available slots.
  - Reviews tab: summary (average, distribution), list of reviews with pagination, sort by recent/helpful.
  - Info tab: description, amenities, opening hours, contact, social links.
  - Sticky “Book” CTA at bottom.
  - Share button.

## 9. Service Categories
**Priority: High**
- **Description**: Hierarchical category system to organize services (e.g., Hair > Haircut, Coloring).
- **User Stories**:
  - As a customer, I want to browse by category to discover services.
  - As a provider, I want to assign my services to standard categories.
- **Acceptance Criteria**:
  - Admin can manage categories (CRUD) with name, icon, parent category.
  - Categories displayed as chips on home screen and search.
  - Service creation by provider must select a leaf category.
  - Category pages show businesses offering services in that category, with filters.

## 10. Booking Flow
**Priority: High**
- **Description**: Step-by-step booking process: service selection, staff (optional), date/time, extras, confirmation, and payment.
- **User Stories**:
  - As a customer, I want to book a service by selecting a date and available time slot.
  - As a customer, I want to add optional extras (e.g., deep conditioning).
  - As a customer, I want to review my booking details before confirming.
  - As a customer, I want to pay securely within the app.
- **Acceptance Criteria**:
  - Flow: Service → Staff (optional, default “Any”) → Date → Time Slot → Extras → Review → Payment → Confirmation.
  - Date picker shows available days (gray out fully booked days).
  - Time slots are computed in real-time based on staff schedule, service duration, and existing appointments (see Availability & Slot Computation).
  - Extras are displayed as checkboxes with prices; total updates dynamically.
  - Review screen shows all details, cancellation policy, and total price.
  - Payment via integrated Stripe/PayPal; support for saved payment methods.
  - On success, confirmation screen with booking ID, option to add to calendar, and push notification.
  - On failure, clear error message and retry option.
  - Booking holds slot for 10 minutes during payment processing; release if payment fails.

## 11. Appointment Management
**Priority: High**
- **Description**: Customers can view upcoming and past appointments, reschedule, or cancel.
- **User Stories**:
  - As a customer, I want to see my upcoming appointments with details.
  - As a customer, I want to reschedule an appointment to a different time.
  - As a customer, I want to cancel an appointment (subject to policy).
- **Acceptance Criteria**:
  - “My Appointments” tab with Upcoming and History sections.
  - Upcoming: list sorted by date, each card shows business, service, date/time, staff, status (confirmed, pending).
  - Tap to view full details; actions: Reschedule, Cancel, Add to Calendar, Get Directions.
  - Reschedule: re-enters booking flow with pre-selected service and staff, only future slots shown.
  - Cancel: confirmation dialog with policy info (e.g., free cancellation up to 24h before).
  - History: past appointments with option to leave a review if not already reviewed.
  - Push notification reminders 24h and 1h before appointment.

## 12. Favorites
**Priority: Medium**
- **Description**: Customers can save businesses to a favorites list for quick access.
- **User Stories**:
  - As a customer, I want to heart a business to save it.
  - As a customer, I want to view my list of favorite businesses.
- **Acceptance Criteria**:
  - Heart icon on business cards and detail page; toggles favorite state.
  - Favorites tab in profile shows list with business cards; empty state with CTA to explore.
  - Favorites sync across devices (logged-in state).
  - Option to remove from list with swipe or tap.

## 13. User Profile
**Priority: High**
- **Description**: Central place for customers to manage personal information, payment methods, notification preferences, and view activity.
- **User Stories**:
  - As a customer, I want to edit my name, email, phone, and profile picture.
  - As a customer, I want to manage saved payment methods.
  - As a customer, I want to configure notification preferences.
- **Acceptance Criteria**:
  - Profile screen: avatar, name, email, phone (editable).
  - Sections: Personal Info, Payment Methods, Notifications, Favorites, Appointments, Settings (language, dark mode), Logout.
  - Payment methods: add/delete credit/debit cards (Stripe tokenization); mark one as default.
  - Notification toggles: push, email, SMS for booking confirmations, reminders, promotions.
  - All changes saved with optimistic UI and error handling.

## 14. Availability & Slot Computation
**Priority: High**
- **Description**: Algorithm to compute available time slots for a given service, staff, and date, considering business hours, staff schedules, breaks, existing appointments, and service duration.
- **User Stories**:
  - As a customer, I want to see only bookable slots.
  - As a provider, I want my schedule to be accurately reflected.
- **Acceptance Criteria**:
  - Slot engine runs on server (Node.js) and is exposed via API.
  - Input: businessId, serviceId, staffId (optional), date.
  - Output: array of start times (e.g., “09:00”, “09:30”) in ISO format.
  - Rules:
    - Business hours per day (e.g., Mon-Fri 9:00-18:00).
    - Staff working hours may differ; staff breaks block slots.
    - Service duration (including buffer time) determines slot interval.
    - Existing appointments (confirmed/pending) block overlapping slots.
    - Slot must allow full service duration before closing time.
    - If no staff selected, aggregate availability across all staff offering the service.
  - Performance: response time < 500ms for up to 10 staff, 30 days.
  - Caching with invalidation on new booking/cancellation.
  - Background job (BullMQ) precomputes slots for next 7 days every night.

## 15. Reviews & Ratings
**Priority: High**
- **Description**: Customers can leave a rating (1-5 stars) and written review for a completed appointment. Reviews are public on business detail.
- **User Stories**:
  - As a customer, I want to rate my experience and write a review.
  - As a customer, I want to see other reviews to make informed decisions.
  - As a provider, I want to respond to reviews.
- **Acceptance Criteria**:
  - After appointment completion, prompt to review via push/email with deep link.
  - Review form: star rating, text (min 10 chars, max 500), optional photo.
  - One review per appointment; can be edited within 48h.
  - Reviews displayed with user name, date, rating, text, provider response (if any).
  - Provider can post one public response per review.
  - Admin can moderate/hide inappropriate reviews.
  - Business overall rating is average of all reviews, updated asynchronously.

## 16. Payment Integration
**Priority: High**
- **Description**: Secure payment processing via Stripe (and optionally PayPal) for booking payments. Support for pre-payment, deposits, and cancellation refunds.
- **User Stories**:
  - As a customer, I want to pay with credit/debit card or digital wallet.
  - As a provider, I want to receive payouts for completed services.
  - As a platform, I want to collect a commission.
- **Acceptance Criteria**:
  - Integration with Stripe Connect for marketplace payments.
  - Customer can save multiple cards; PCI compliance via Stripe Elements/ mobile SDK.
  - Payment flow: hold funds at booking, capture on service completion (or immediate capture if policy).
  - Support for partial refunds on cancellation according to business policy.
  - Receipt generated and emailed after payment.
  - Provider sees earnings and payout schedule in portal.
  - Admin can configure commission percentage per transaction.
  - Error handling: network failures, insufficient funds, card declined with user-friendly messages.

## 17. Notifications
**Priority: High**
- **Description**: Multi-channel notifications (push, email, SMS) for booking confirmations, reminders, cancellations, promotions, and provider alerts.
- **User Stories**:
  - As a customer, I want to be reminded of my upcoming appointment.
  - As a provider, I want to be notified of new bookings and cancellations.
- **Acceptance Criteria**:
  - Push notifications via Firebase Cloud Messaging (FCM) for mobile.
  - Email via SendGrid/SES with HTML templates.
  - SMS via Twilio for critical alerts (optional, based on user preference).
  - Event-driven: BookingCreated, BookingCancelled, BookingReminder (24h, 1h), ReviewRequest, Promotion.
  - Notification preferences per user per channel.
  - In-app notification center with read/unread status.
  - Background jobs (BullMQ) handle sending with retry and logging.

## 18. Provider / Business Owner Portal
**Priority: High**
- **Description**: Web and mobile portal for providers to manage their business profile, services, staff, schedules, appointments, and reviews.
- **User Stories**:
  - As a provider, I want to set my business hours and service menu.
  - As a provider, I want to manage my staff and their schedules.
  - As a provider, I want to view and manage appointments (confirm, cancel, reschedule).
  - As a provider, I want to see earnings and analytics.
- **Acceptance Criteria**:
  - Dashboard: today’s appointments, earnings summary, new reviews.
  - Business Profile: edit name, description, photos, address, contact, amenities.
  - Services: CRUD with name, category, duration, price, description, extras, buffer time.
  - Staff: invite staff members (email), set their working hours, assign services, manage breaks.
  - Calendar: day/week view of appointments with staff filter; click to see details, ability to block time manually.
  - Appointments: list with status filters; actions: confirm pending, cancel with reason, reschedule (drag on calendar).
  - Reviews: view all, respond publicly.
  - Earnings: transaction history, payout schedule, export CSV.
  - Settings: notification preferences, cancellation policy, booking lead time.
  - Mobile-responsive or dedicated app.

## 19. Admin Dashboard
**Priority: Medium**
- **Description**: Web-based dashboard for platform administrators to manage users, businesses, categories, reviews, transactions, and system configuration.
- **User Stories**:
  - As an admin, I want to approve new business registrations.
  - As an admin, I want to moderate reviews.
  - As an admin, I want to view platform metrics.
- **Acceptance Criteria**:
  - Secure login with MFA.
  - Dashboard overview: total users, businesses, appointments, revenue, commission (with charts).
  - User management: list/search customers and providers, suspend/delete accounts.
  - Business management: approve/reject new businesses, edit details, feature on home screen.
  - Category management: CRUD for service categories.
  - Review moderation: flag/hide inappropriate reviews.
  - Transaction monitoring: view all payments, refunds, commission.
  - Configuration: commission rate, cancellation policy defaults, notification templates.
  - Audit log for sensitive actions.

## 20. Background Jobs (BullMQ)
**Priority: High**
- **Description**: Asynchronous job processing using BullMQ (Redis-backed) for tasks like slot precomputation, notifications, payment capture, review reminders, and data cleanup.
- **User Stories**:
  - As a system, I want to send booking reminders without blocking the API.
  - As a system, I want to precompute availability slots nightly.
- **Acceptance Criteria**:
  - Job queues: notifications (email, push, SMS), slot-computation, payment-capture, review-request, data-cleanup.
  - Jobs are triggered by events (e.g., booking created) or cron schedules.
  - Retry with exponential backoff for failed jobs; dead letter queue for manual inspection.
  - Monitoring via Bull Board UI (admin only).
  - Slot computation job: runs daily at 2 AM, computes slots for next 7 days per business, stores in cache.
  - Notification jobs: process in order, respect user preferences, log delivery status.
  - Payment capture job: runs at service completion time to capture authorized funds.
  - Review request job: runs 2 hours after appointment end, checks if review already left.

## 21. Non-Functional Requirements
- **Performance**: API response < 200ms for 95th percentile; slot computation < 500ms.
- **Scalability**: Support 100k concurrent users; horizontal scaling of services.
- **Security**: HTTPS, JWT with rotation, input sanitization, rate limiting, GDPR compliance.
- **Reliability**: 99.9% uptime for core booking flow; graceful degradation for non-critical features.
- **Accessibility**: WCAG 2.1 AA for customer-facing interfaces.
- **Localization**: Support multiple languages (initially EN, FR) with i18n.

## 22. Priorities Summary
- **High**: Authentication, Guest Browse, Search & Discovery, Business Detail, Service Categories, Booking Flow, Appointment Management, User Profile, Availability & Slot Computation, Reviews & Ratings, Payment Integration, Notifications, Provider Portal, Background Jobs, Shared Types & Design System.
- **Medium**: Map-based Search, Favorites, Admin Dashboard.
- **Low** (future): Social sharing, loyalty program, advanced analytics, multi-language content moderation.