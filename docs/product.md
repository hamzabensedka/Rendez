# Product Specification: Planity Clone

## 1. Overview
Planity Clone is a multi-sided platform that connects customers with beauty, wellness, and hair service providers. Customers can discover businesses, explore services, book appointments, pay, and review. Business owners manage their listings, services, staff availability, and bookings via a portal. Administrators oversee the platform via a dashboard. Background jobs handle notifications, reminders, and payment processing.

## 2. User Roles
- **Guest** – Unauthenticated visitor.
- **Customer** – Authenticated user who books services.
- **Provider / Business Owner** – Manages a business, services, staff, and appointments.
- **Admin** – Superuser managing platform-wide settings and moderation.

## 3. Features

### 3.1 User Authentication (P0)
**User Story:** As a user, I want to sign up and log in securely so I can access personalized features and manage my bookings.
- AC1: Sign-up with email/password, Google, and Apple (social login).
- AC2: Input validation and error messages for weak passwords, duplicate emails, invalid tokens.
- AC3: Email verification link sent upon registration; account activation required.
- AC4: Forgot password flow: request reset link, receive email, set new password with expiry.
- AC5: Logout clears session; persisted login with refresh tokens (HTTP-only cookie).
- AC6: Role-based redirections (customer → home, provider → dashboard, admin → admin).
- AC7: Suspended or deleted users are blocked with appropriate message.

### 3.2 Guest Browse & Explore (P0)
**User Story:** As a guest, I want to browse businesses and services without creating an account to decide if the platform meets my needs.
- AC1: Guest can view the home page with featured businesses and categories.
- AC2: Guest can search by keyword, category, or location and see results.
- AC3: Guest can open a business detail page with full information (services, photos, reviews).
- AC4: Guest can view service categories and subcategories.
- AC5: Any booking-related action (selecting a slot, booking) prompts login/sign-up.
- AC6: The “Favorites” icon is visible but triggers login modal when tapped.

### 3.3 Business Search & Discovery (P0)
**User Story:** As a customer, I want to find businesses by name, service, or category so I can choose the right provider.
- AC1: Search bar at top of home screen; supports autocomplete for business names and services.
- AC2: Search results show business cards (photo, name, rating, distance, price range).
- AC3: Filters: category, subcategory, rating (4+), price range, distance, availability (today/tomorrow).
- AC4: Sort options: relevance, rating, distance, price low/high.
- AC5: Results load via infinite scroll with a “no more results” indicator.
- AC6: Tapping a card navigates to business detail.
- AC7: Recent searches and trending searches are shown when the search field is empty.

### 3.4 Map-based Search (P1)
**User Story:** As a customer, I want to see nearby businesses on a map to choose based on location.
- AC1: Map view toggle on the search results screen.
- AC2: Map displays business pins with basic info on tap (name, rating, distance).
- AC3: Clustering for dense areas.
- AC4: Map center and radius updated as user pans or zooms; search query and filters are respected.
- AC5: “Use my location” button centers the map on user with permission.
- AC6: Tapping a pin opens a card preview; tapping the card navigates to detail.

### 3.5 Business Detail View (P0)
**User Story:** As a customer, I want to see all details about a business so I can decide to book.
- AC1: Hero image gallery, business name, address, phone, website, rating, review count.
- AC2: List of services grouped by category (e.g., Hair > Haircut) with duration and price.
- AC3: Staff list with photo, name, and rating.
- AC4: Availability calendar allowing date selection; displays time slots after selecting a service and staff (or “any staff”).
- AC5: Customer reviews section with star distribution, individual reviews (rating, comment, photo, date).
- AC6: “Add to Favorites” heart toggle (real-time update).
- AC7: Share button (deep link).
- AC8: Map showing location with link to external map app.

### 3.6 Service Categories (P0)
**User Story:** As a customer, I want to browse services by category to discover offerings I might not have searched for.
- AC1: Home screen shows top-level categories (Hair, Nails, Massage, Skin, etc.) with icons.
- AC2: Selecting a category opens a subcategory list; selecting a subcategory shows businesses offering that service.
- AC3: Categories can be managed by admin (add, edit, archive, change icon).
- AC4: Category page shows popular services and businesses within that category.
- AC5: Breadcrumb navigation from business detail back to the category (optional).

### 3.7 Booking Flow (P0)
**User Story:** As a customer, I want seamless booking from selecting a service to confirming the appointment.
- AC1: On the business detail, the user selects a service (or multiple services), optional staff member, then picks a date.
- AC2: Available time slots are shown based on real-time availability (see 3.11); slot picking is intuitive (list or timeline).
- AC3: Summary screen shows selected services, staff, date, time, total price, and estimated duration.
- AC4: User can add a note and promocode; loyalty points or vouchers are applied if available.
- AC5: Payment step (if required) integrates with Stripe/PayPal; partial pre-payment or full payment configurable per business.
- AC6: Confirmation screen with appointment details and actions: add to calendar, share, view appointment.
- AC7: Duplicate booking detection: system prevents booking the same slot twice for same staff.
- AC8: Loading and error states for every step; network failure recovery (offline booking not required).

### 3.8 Appointment Management (P0)
**User Story:** As a customer, I want to view, modify, or cancel my upcoming and past appointments.
- AC1: “My Appointments” tab with tabs “Upcoming”, “Past”, “Cancelled”.
- AC2: Upcoming appointments show date, time, business, services, staff, status (confirmed/pending/payment required).
- AC3: Customer can cancel or reschedule up to the business’s cancellation window (e.g., 24h before). Cancellation may trigger refund policy.
- AC4: Rescheduling opens a mini-booking flow reusing the slot picker for the same services/staff.
- AC5: Push notification sent upon booking confirmation, reminders, and changes.
- AC6: Past appointments allow re-booking (quick action) and write a review.
- AC7: Appointment detail screen shows map, business contact, and “Get Directions”.

### 3.9 Favorites (P1)
**User Story:** As a customer, I want to save businesses I like so I can revisit them quickly.
- AC1: Heart icon on business cards in search, map, and detail view.
- AC2: Toggling favorite adds/removes from user’s list; instantly updates UI.
- AC3: “Favorites” tab (or screen) lists saved businesses with ability to remove or tap to open detail.
- AC4: Favorite status persists across sessions for authenticated user.
- AC5: Guest tapping favorite triggers login prompt; favorites are merged after login (optional merge logic).

### 3.10 User Profile (P1)
**User Story:** As a customer, I want to manage my personal information and preferences.
- AC1: View/edit profile picture, name, email, phone, date of birth.
- AC2: Change password and manage connected social accounts.
- AC3: View payment methods (saved cards) and manage them.
- AC4: Notification preferences: toggle push/email for booking confirmations, reminders, promotions.
- AC5: Language and region settings (if applicable).
- AC6: Delete account option with confirmation and data deletion compliance.

### 3.11 Availability & Slot Computation (P0)
**User Story:** As a system, I must compute real-time availability to prevent double-bookings and respect business hours, staff schedules, service duration, and buffers.
- AC1: Each business has working hours per day (can be split intervals like 9–12, 13–18) with timezone.
- AC2: Each staff has their own working hours that fall within business hours (if set). Staff can be assigned to services.
- AC3: Service duration (e.g., 45 min) plus configurable buffer time before/after.
- AC4: System generates time slots aligning with slot interval (e.g., every 15 min) considering service duration.
- AC5: If multiple services booked, total duration = sum of durations. Buffer applies after the last service.
- AC6: Already booked appointments block the staff’s time for that duration + buffer; staff cannot be double-booked.
- AC7: Customer can choose “Any staff” – system finds slots where at least one staff is free.
- AC8: Slot computation must be performant (cached or dynamically computed) and updated in real-time (e.g., via WebSocket or polling) during booking flow.
- AC9: Holidays/special days can be set by business to block entire day or modify hours.

### 3.12 Shared Types & Design System (P0)
**User Story:** As a developer, I need consistent data models and UI components to build features efficiently and maintainably.
- AC1: Shared TypeScript interfaces/types defined for User, Business, Service, Staff, Appointment, Review, Payment, Notification, etc. Used by frontend and backend.
- AC2: Design system library with components: Button, Input, Select, Modal, Card, Badge, Avatar, StarsRating, Calendar, TimeSlotPicker, MapPin, EmptyState, etc.
- AC3: Theming support: primary/secondary colors, typography scale, spacing tokens, dark mode (optional).
- AC4: All components meet accessibility criteria (contrast, labels, keyboard navigation).
- AC5: Documentation via Storybook or similar.

### 3.13 Reviews & Ratings (P1)
**User Story:** As a customer, I want to rate and review businesses to share my experience. As a business owner, I want to manage and respond to reviews.
- AC1: After a completed appointment, customer receives prompt to leave a review (rating 1-5, text, optional photo).
- AC2: Review appears on business detail after moderation (or instantly if no moderation).
- AC3: Business owner can respond publicly to reviews; response displayed under the review.
- AC4: Customer can edit or delete their own review within a time window.
- AC5: Average rating and distribution are updated in real-time.
- AC6: Admin can hide/report reviews that violate guidelines.
- AC7: Review rejection reason is sent to customer.

### 3.14 Payment Integration (P0)
**User Story:** As a customer, I want to pay for services securely and receive receipts. As a business, I want to receive payouts.
- AC1: Checkout with Stripe Elements (card, Apple Pay, Google Pay). Support for saved cards.
- AC2: Payment amount includes service total + taxes + platform fee (if any). The fee is configurable per transaction or subscription.
- AC3: Pre-authorization and capture or immediate capture depending on business’s payment policy (e.g., charge full upfront or only deposit).
- AC4: Receipt emailed after successful payment; stored in appointment history.
- AC5: Refund flow: full or partial refund initiated by business or admin, processed via Stripe.
- AC6: Payouts to providers handled by Stripe Connect (if on marketplace) or manual settlement.
- AC7: PCI compliance: no raw card details stored; use tokenization.
- AC8: Graceful handling of payment failures with clear error messages and retry.

### 3.15 Notifications (P0)
**User Story:** As a user, I want to receive timely notifications about my bookings, reminders, and promotional offers.
- AC1: Push notifications for booking confirmation, 24h and 1h reminders, cancellation confirmations, rescheduling updates, review requests, special offers.
- AC2: In-app notification bell with list of recent notifications; unread badge count.
- AC3: Notification preferences: user can toggle types and channels (push, email) in profile.
- AC4: Notifications are personalized (e.g., “Your haircut with Alex is tomorrow at 10 AM”).
- AC5: Deep linking from notification to relevant screen (appointment detail).
- AC6: Providers receive notifications for new bookings, cancellations, and reviews.
- AC7: System uses a queue (BullMQ) for reliable delivery and retries.

### 3.16 Provider / Business Owner Portal (P1)
**User Story:** As a business owner, I want to configure my services, staff, schedules, and manage bookings efficiently.
- AC1: Separate dashboard accessible after provider login with navigation: Dashboard, Appointments, Services, Staff, Settings.
- AC2: Dashboard overview: upcoming appointments list, today’s stats, recent reviews.
- AC3: Appointment management: view calendar, filter by staff/service, change status (confirm/cancel/arrived/no-show), add notes.
- AC4: Service management: create/edit/archive services with name, category, duration, price, buffer time, description, photo, assigns to staff.
- AC5: Staff management: invite staff (email), set role, working hours per day, assign services, manage time off (holidays, sick leave).
- AC6: Business settings: edit business name, address, contact, logo, photos, business hours, cancellation policy, payment settings (deposit percentage, etc.).
- AC7: Integration with third-party calendar (Google Calendar sync) optional.
- AC8: Provider cannot see other businesses’ data.

### 3.17 Admin Dashboard (P2)
**User Story:** As an admin, I want to monitor platform activity, manage users/businesses, and resolve disputes.
- AC1: Dashboard with KPIs: total bookings, revenue, active businesses, new users.
- AC2: User management: list/search users, view details, suspend/delete accounts.
- AC3: Business management: approve/reject new business registrations, edit details, suspend businesses, view analytics.
- AC4: Revenue report: breakdown by date, business, payment method, refunds.
- AC5: Dispute resolution: view flagged reviews, report inappropriate content, with ability to hide/restore.
- AC6: Manual refund/chargeback handling.
- AC7: Configuration of platform fees, notification templates, system variables.
- AC8: Role-based access control: admin actions require appropriate permissions.

### 3.18 Background Jobs (BullMQ) (P0)
**User Story:** As a system, I need reliable asynchronous processing for notifications, reminders, payment settlements, and scheduled tasks.
- AC1: Queue for sending push notifications and emails with retry and failure handling.
- AC2: Jobs for appointment reminders: scheduled job created at booking time, triggered 24h and 1h before appointment.
- AC3: Payment settlement jobs: auto-capture pre-authorized payments upon service completion (if applicable).
- AC4: Cleanup jobs: anonymize or delete user data after account deletion grace period.
- AC5: Generate daily/weekly reports for admin.
- AC6: Use BullMQ with Redis; dashboard (Bull Board) for monitoring queues, job statuses, and failures.
- AC7: Idempotency and deduplication for critical jobs (e.g., avoid sending duplicate reminders).
- AC8: Scheduled jobs use cron-like patterns for recurring tasks (e.g., daily reports).

## 4. Non-Functional Requirements
- Performance: First meaningful paint < 2s, slot computation < 1s.
- Security: HTTPS, rate limiting, input sanitization, JWT refresh rotation, Stripe PCI compliance.
- Scalability: Architecture supports horizontal scaling for web and worker processes.
- Accessibility: WCAG 2.1 AA for customer-facing interfaces.
- Data Protection: GDPR/CCPA compliant; user can request data export or deletion.

## 5. Priority Summary
- **P0 (Must-have):** Authentication, guest browse, search, booking, appointment management, availability computation, design system/shared types, payment, notifications, background jobs.
- **P1 (High):** Map search, favorites, user profile (full), reviews & ratings, provider portal.
- **P2 (Medium):** Admin dashboard (basic KPIs and management), advanced reporting.