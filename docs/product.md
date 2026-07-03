# Planity Clone Product Specification

## 1. Introduction
Planity Clone is a mobile app for booking beauty and wellness appointments (hair, spa, nails, etc.) with a web-based provider portal and admin dashboard. The product enables guests to browse businesses, registered users to book and manage appointments, business owners to manage their profile and availability, and admins to oversee the platform. All features are designed with a shared design system and robust backend powered by BullMQ for asynchronous tasks.

## 2. User Roles
- **Guest**: Unauthenticated user who can browse businesses, view details, but cannot book or access personal features.
- **Registered User (Client)**: Authenticated user who can book, pay, manage appointments, save favorites, write reviews, and manage profile.
- **Provider / Business Owner**: Authenticated business owner managing a single or multiple locations, services, staff, availability, and appointments.
- **Admin**: Platform administrator with access to dashboard, user/business management, analytics, and configuration.

## 3. Shared Types & Design System
A unified design system ensures consistency across mobile (iOS/Android) and web portals. All components, colors, typography, spacing, and interactive patterns are documented in a central library.

**Shared Types:**
- **User**: id, email, role (guest/client/provider/admin), profile image, name, phone
- **Business**: id, name, description, category, address, coordinates, images, rating, services, working hours
- **Service**: id, businessId, name, duration, price, description, category
- **Appointment**: id, userId, businessId, serviceId, staffId, dateTime, status (pending/confirmed/cancelled/completed), notes
- **Review**: id, userId, businessId, rating (1-5), comment, date
- **Favorite**: userId, businessId
- **Notification**: id, userId, type, title, body, read, createdAt

**Design System Tokens:**
- Colors: primary (#FF6B6B), secondary, neutral, success, warning, error
- Typography: Inter font, scale from 10px to 32px
- Spacing: 4px grid base
- Shadows, borders, icons

All components follow accessibility guidelines (WCAG 2.1 AA). Reusable components include: Button, Input, Card, Avatar, RatingStars, Modal, BottomSheet, SearchBar, MapPin, AppointmentCard, etc.

**Acceptance Criteria (Design System)**
- Must have a centralized theme exported as JSON/CSS variables for mobile and web.
- All UI components documented in Storybook or similar.
- Minimum contrast ratio 4.5:1 for text.
- Priority: Must Have

## 4. Features & Acceptance Criteria

### 4.1 User Authentication
**Description:** Allow users to register, login, recover password, and manage session across devices. Support email/password and social login (Google, Apple).

**User Story:** As a user, I want to create an account securely so that I can book appointments and access my history.

**Acceptance Criteria**
- [ ] Registration form with email, password, name (phone optional). Password strength indicator.
- [ ] Email verification: send verification email; account fully activated only after confirmation.
- [ ] Login with email/password, Google Sign-In, Sign in with Apple.
- [ ] Reset password via email link with token expiry (1 hour).
- [ ] Session management: JWT tokens with refresh token rotation; auto-logout after 7 days inactivity.
- [ ] Role-based redirection after login (client → home, provider → dashboard, admin → admin panel).
- [ ] Error handling: duplicate email, invalid credentials, blocked accounts.
- [ ] Priority: Must Have

### 4.2 Guest Browse & Explore
**Description:** Allow guests to explore the app without signing up. They can search, view business details, services, and reviews, but will be prompted to register when attempting to book, favorite, or write a review.

**User Story:** As a potential customer, I want to see what salons are nearby and what they offer before committing to register.

**Acceptance Criteria**
- [ ] Home screen shows featured businesses, popular categories, and a CTA to sign up.
- [ ] Guest can search by keyword, location, and filter results.
- [ ] Guest can view business detail with services, photos, reviews, and map.
- [ ] When tapping “Book Now”, guest sees a registration/login modal or screen.
- [ ] All guest actions must not require authentication.
- [ ] Guest session data (recent views) stored locally only.
- [ ] Priority: Must Have

### 4.3 Business Search & Discovery
**Description:** Powerful search allowing users to find businesses by name, category, service, or location. Results include auto-suggestions and filters.

**User Story:** As a user, I want to quickly find a hairdresser near me that offers balayage.

**Acceptance Criteria**
- [ ] Search bar with auto-complete suggestions (debounced 300ms).
- [ ] Search can be triggered by text query, category selection, or current location.
- [ ] Results display as cards (image, name, rating, distance, price indicator).
- [ ] Filters: distance radius (1/5/10/20 km), rating (≥4 stars), price range (€/€€/€€€), open now, amenities (WiFi, parking).
- [ ] Sorting: relevance, nearest, highest rated, price low-to-high.
- [ ] Empty state: “No results found. Try adjusting filters.”
- [ ] Infinite scroll pagination.
- [ ] Save recent searches for logged-in users.
- [ ] Priority: Must Have

### 4.4 Map-based Search
**Description:** Interactive map showing business locations as pins. Users can move the map to search in a new area.

**User Story:** As a user, I want to see all salons on a map in my area so I can choose one closest to me.

**Acceptance Criteria**
- [ ] Map view accessible from home/search via toggle (list/map).
- [ ] Business pins include category icon and rating badge.
- [ ] Clustering for dense areas.
- [ ] Tap pin shows a preview card (name, rating, image). Tap preview navigates to detail.
- [ ] Map center update triggers automatic search within viewport.
- [ ] “Use my location” button centers map on user.
- [ ] Integration with Google Maps / Mapbox.
- [ ] Performance: load ≤2000 pins without lag.
- [ ] Priority: Must Have

### 4.5 Business Detail View
**Description:** A comprehensive screen for a business showing all relevant information: photos, description, services, availability, reviews, and booking CTA.

**User Story:** As a user, I want to see the full details of a salon, its services, and read reviews before booking.

**Acceptance Criteria**
- [ ] Hero carousel of business images (max 5).
- [ ] Business name, category tags, address (with map snippet), phone, website, opening hours.
- [ ] “Favorite” heart icon (logged-in users only).
- [ ] Tabs: Services, Reviews, Info.
- [ ] Services tab: list of services with name, duration, price; “Book” button per service.
- [ ] Reviews tab: summary rating, distribution graph, list of reviews (paginated).
- [ ] Info tab: description, amenities, staff (if available).
- [ ] Sticky bottom bar with “Book Appointment” (logged-in) or “Sign Up to Book” (guest).
- [ ] Share business link.
- [ ] Priority: Must Have

### 4.6 Service Categories
**Description:** Hierarchical category system to organize services (e.g., Hair → Cut, Color). Browse by category from home.

**User Story:** As a user, I want to browse all nail salons without having to type a search.

**Acceptance Criteria**
- [ ] Category grid on home: Hair, Nails, Spa, Beard, Massage, etc. (configurable).
- [ ] Sub-categories shown as chips or list when a category is selected.
- [ ] Tapping a sub-category shows businesses offering that service.
- [ ] Categories managed by admin (add, hide, reorder).
- [ ] Deep linking: each category/sub-category has a permalink.
- [ ] Priority: Must Have

### 4.7 Booking Flow
**Description:** Step-by-step booking process: select service, choose staff (optional), pick date/time slot, add extras, confirm and pay. Seamless and fast, with minimal friction.

**User Story:** As a client, I want to book a haircut for Tuesday at 2pm with my preferred stylist in under 2 minutes.

**Acceptance Criteria**
- [ ] Flow: Service → Date → Time Slot → Staff (optional) → Review → Payment → Confirmation.
- [ ] Each step allows back navigation.
- [ ] Date picker shows only dates with available slots (gray out fully booked days).
- [ ] Time slot list shows available times for selected service duration, considering staff shifts.
- [ ] If staff selected, slots filtered by that staff’s availability.
- [ ] Can add optional extras (e.g., treatment upgrade) with price adjustments.
- [ ] Review screen shows summary: business, service, date/time, staff, price, and cancellation policy.
- [ ] Promo code input with validation (server-side).
- [ ] On confirmation: appointment created with status “confirmed” after payment (if required) or “pending” for free bookings.
- [ ] Real-time slot locking (or optimistic) to prevent double booking; reservation held for 5 minutes during checkout.
- [ ] Guest redirect to register/login before final confirmation; after login, booking should prefill and resume.
- [ ] Error handling: slot no longer available, payment failure.
- [ ] Priority: Must Have

### 4.8 Appointment Management
**Description:** Clients can view upcoming and past appointments, cancel or reschedule (with conditions), and receive reminders.

**User Story:** As a client, I need to see my upcoming haircut and be able to cancel it if something comes up.

**Acceptance Criteria**
- [ ] Appointments tab in user profile: Upcoming, Past, Cancelled.
- [ ] Upcoming: list of appointments with date, business, service, status, booking ID.
- [ ] Tap appointment opens detail: full info, “Cancel” or “Reschedule” button if allowed.
- [ ] Cancellation: confirmation modal; must comply with business cancellation policy (e.g., 24h free).
- [ ] Reschedule: redirects to booking flow with current service pre-selected; after reschedule, old appointment cancelled and new created.
- [ ] Push notification and email for upcoming appointment 24h and 1h before.
- [ ] Past appointments: list with ability to write a review if not already done.
- [ ] Filter by business.
- [ ] Priority: Must Have

### 4.9 Favorites
**Description:** Users can bookmark businesses they like to quickly access later.

**User Story:** As a user, I want to save my favorite salons so I can find them easily.

**Acceptance Criteria**
- [ ] Favorites icon (heart) visible on business cards in search and on detail page (only for logged-in users).
- [ ] Toggle favorite (add/remove) with optimistic UI update and API call.
- [ ] Favorites page accessible from profile; displays list of favorited businesses (infinite scroll).
- [ ] If user unfavorites, remove immediately.
- [ ] Guest sees heart icon but tapping prompts login.
- [ ] Priority: Should Have

### 4.10 User Profile
**Description:** User’s personal space to manage account, view history, preferences, and settings.

**User Story:** As a client, I need a dedicated profile to change my phone number and manage notification preferences.

**Acceptance Criteria**
- [ ] Profile screen: avatar, name, email, phone, edit button.
- [ ] Edit profile: change name, phone, profile picture (camera/gallery).
- [ ] Settings: notification preferences (push, email, reminders), dark mode toggle, language (English/French).
- [ ] Section links: Appointments, Favorites, Payment Methods, Reviews, Help & Support, Logout.
- [ ] Delete account with confirmation and data removal (GDPR compliant).
- [ ] Priority: Must Have

### 4.11 Availability & Slot Computation
**Description:** Backend logic to compute real-time available slots for each business/service based on working hours, staff schedules, existing appointments, breaks, and service duration.

**User Story:** As a system, I need accurate slot computation so that users only see bookable times.

**Acceptance Criteria**
- [ ] Business has weekly working hours (e.g., Mon-Fri 9:00-18:00, Sat 9:00-16:00, Sun closed).
- [ ] Each staff member has individual schedule and services they provide.
- [ ] Appointment blocks time = service duration + buffer time (configurable, default 0).
- [ ] Slots generated in increments (e.g., 15/30 min).
- [ ] Compute available slots for a given date and service: return array of start times.
- [ ] Exclude blocked dates (holidays, custom closures).
- [ ] Handle concurrent bookings: slot removed when booked; system must prevent double booking via DB transaction or optimistic lock.
- [ ] Performance: ≤200ms response for up to 5 staff and 30 days.
- [ ] Priority: Must Have

### 4.12 Reviews & Ratings
**Description:** Users can leave a rating (1-5) and written review for a business after completing an appointment. All reviews are visible on business detail.

**User Story:** As a user, I want to share my experience and read others’ to help me choose.

**Acceptance Criteria**
- [ ] Only users with a completed appointment can review that business (one review per appointment).
- [ ] Rating input as star taps (1-5) and optional text (10-500 chars).
- [ ] Review submission triggers moderation queue (configurable: auto-approve or manual).
- [ ] Reviews appear on business detail sorted by most recent; able to sort by highest/lowest rating.
- [ ] Business owner cannot delete reviews but can report; admin can moderate.
- [ ] Average rating recalculated on new approved review.
- [ ] Edit/delete own review (delete removes rating and text).
- [ ] Priority: Must Have (core social proof)

### 4.13 Payment Integration
**Description:** Secure payment for bookings, including card payments, digital wallets, and pay-at-venue option. Integrate with a PSP like Stripe.

**User Story:** As a user, I want to pay for my appointment securely using my credit card or Apple Pay.

**Acceptance Criteria**
- [ ] Payment step in booking flow: choose payment method: Card (saved), New Card, Apple Pay, Google Pay, Pay at Venue (if business allows).
- [ ] Stripe Elements integration for PCI compliance.
- [ ] Save card for future (tokenized) with secure vault.
- [ ] Charge on appointment confirmation; if pay-at-venue, amount reserved but no charge.
- [ ] Handle payment failure gracefully: retry with same card, fallback to other methods.
- [ ] Booking status: “confirmed” only after successful payment; for pay-at-venue, status “pending payment” until admin confirms.
- [ ] Refund flow for cancellations according to business policy (admin or automated).
- [ ] Transaction history in user profile and provider order list.
- [ ] Priority: Must Have for production; Could Have for MVP if pay-at-venue only is acceptable.

### 4.14 Notifications
**Description:** Multi-channel notifications (push, in-app, email) for appointment confirmations, reminders, cancellations, marketing, and provider alerts.

**User Story:** As a user, I want to be reminded of my appointment so I don’t miss it.

**Acceptance Criteria**
- [ ] In-app notification bell with unread badge; click opens list.
- [ ] Push notification using Firebase Cloud Messaging with permission request.
- [ ] Email notifications via transactional email service (SendGrid).
- [ ] Notification types:
  - Booking confirmation (appointment ID, time, location).
  - Reminder 24h and 1h before.
  - Cancellation/changes.
  - Review request after service completion.
  - Provider: new booking, cancellation, day summary.
- [ ] Notification preferences: user can toggle each channel for each type.
- [ ] Deep linking from push to relevant screen.
- [ ] Queue notifications via BullMQ for reliability.
- [ ] Priority: Must Have

### 4.15 Provider / Business Owner Portal
**Description:** Web-based dashboard for business owners to manage their profile, services, staff, availability, and appointments.

**User Story:** As a salon owner, I need to update my working hours and view today’s appointments.

**Acceptance Criteria**
- [ ] Portal login with provider credentials (separate from client app, or same auth with role).
- [ ] Dashboard overview: today’s appointments, weekly revenue, new reviews.
- [ ] Appointments management: calendar view (day/week), list view; filter by staff.
- [ ] Confirm, cancel, complete appointments; add notes.
- [ ] Manage business profile: edit name, description, phone, address, photos, amenities.
- [ ] Manage services: add/edit/delete (cannot delete if future bookings). Service fields: name, category, duration, price, description, color (for calendar).
- [ ] Manage staff: add/remove, assign services, set individual working hours.
- [ ] Manage availability: set regular hours per day, add special closures, buffer time.
- [ ] Reviews: view all, report inappropriate; cannot edit.
- [ ] Payments: view transaction history, payouts info.
- [ ] Settings: cancellation policy, online booking toggle, prepayment required yes/no.
- [ ] Mobile responsive.
- [ ] Priority: Must Have

### 4.16 Admin Dashboard
**Description:** Central panel for platform administrators to manage businesses, users, categories, reviews, transactions, and system settings.

**User Story:** As an admin, I need to approve new businesses and view platform metrics.

**Acceptance Criteria**
- [ ] Dashboard with KPIs: total bookings, revenue, new users, new businesses (daily/weekly/monthly).
- [ ] User management: list all users, search, filter by role, block/unblock accounts.
- [ ] Business management: list all businesses, approve or reject new registrations, edit any business, suspend.
- [ ] Review moderation: queue for flagged reviews, approve/reject, bulk actions.
- [ ] Service categories management: add/edit/hide categories and sub-categories, reorder.
- [ ] Transaction overview: all payments with status, refund processing.
- [ ] System configuration: commission rate, currency, scheduling rules, notification templates.
- [ ] Audit log of admin actions.
- [ ] Export data (CSV): users, bookings, payments.
- [ ] Role-based access (super admin, support).
- [ ] Priority: Must Have

### 4.17 Background Jobs (BullMQ)
**Description:** Handle asynchronous tasks reliably using BullMQ with Redis: sending emails/push, processing payments, updating stats, cleanup, etc.

**User Story:** As a system, I need to send appointment reminders even under high load without blocking user requests.

**Acceptance Criteria**
- [ ] Job queues: notifications, emails, payment processing, data aggregation.
- [ ] BullMQ workers running in separate processes.
- [ ] Scheduled jobs: appointment reminders (24h, 1h before) created on booking.
- [ ] Retry logic with exponential backoff (max 5 attempts).
- [ ] Dead letter queue for failed jobs with alert to admin.
- [ ] Dashboard (optional): queue metrics, job statuses.
- [ ] Ensure idempotency for critical jobs (prevent duplicate emails).
- [ ] Priority: Must Have (for reliability)

## 5. Non-Functional Requirements
- **Performance**: App screens load <2s, API responses <200ms p95, slot computation <200ms.
- **Security**: HTTPS, JWT with refresh tokens, input sanitization, rate limiting, PCI DSS compliance for payments, GDPR compliance (data export, delete).
- **Scalability**: Stateless API services allow horizontal scaling; database with read replicas; BullMQ and Redis scalable.
- **Accessibility**: AA compliance for user-facing app.
- **Localization**: Initially English and French; structure supports multiple languages.

## 6. Priority Summary
- **Must Have (MVP)**: User Authentication, Guest Browse, Business Search & Discovery, Map-based Search, Business Detail View, Service Categories, Booking Flow, Appointment Management, User Profile, Availability & Slot Computation, Shared Types & Design System, Reviews & Ratings (after appointments), Payment Integration (basic), Notifications (essential), Provider Portal (basic), Admin Dashboard (basic), Background Jobs.
- **Should Have (v1.1)**: Favorites, advanced payment methods, review moderation refinement, enhanced provider calendar, dark mode, deep link notifications.
- **Could Have (v1.2)**: Gift cards, loyalty program, multi-language support, AI-recommendations, video consultations.
- **Won’t Have (Now)**: Social feed, marketplace for products, chatbot.

## 7. Appendix
- Glossary: PSP – Payment Service Provider, KPI – Key Performance Indicator, FCM – Firebase Cloud Messaging.
- External Dependencies: Stripe, Google Maps API, Firebase, SendGrid, Redis, BullMQ.
- Conventions: All dates/times in UTC, stored as ISO 8601.