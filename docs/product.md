# Product Specification: Planity Clone

## 1. Overview
Planity Clone is a comprehensive salon booking platform that connects customers with beauty and wellness providers. The system enables users to discover businesses, book appointments, manage their schedules, and make secure payments. Business owners can manage their services, staff, availability, and client appointments through a dedicated portal. Platform administrators oversee operations, moderate content, and access analytics.

## 2. User Roles
- **Guest**: Unauthenticated user who can browse, search, and view business details but cannot book.
- **Client**: Authenticated user with full booking, favorites, reviews, and profile management capabilities.
- **Provider (Business Owner/Staff)**: Manages business profile, services, staff, schedules, and appointments via a web dashboard.
- **Admin**: Super administrator with access to all platform data, moderation tools, and system-level analytics.

## 3. Feature Specifications
All features are listed with a priority level: **P0** (Must-have for MVP), **P1** (High priority, next phase), **P2** (Nice to have, future releases). Acceptance criteria define when a feature is complete.

---

### 3.1 Shared Types & Design System
**Priority: P0**

**Description**  
Define all shared TypeScript types/interfaces and a reusable component library to ensure consistency across web and mobile clients. The design system includes atoms (buttons, inputs, icons), molecules (cards, form groups), and templates (layouts, modals).

**Acceptance Criteria**
- A centralized `@planity/shared` package contains all types (User, Business, Service, Appointment, etc.) with no duplication.
- UI components are implemented in Storybook with variants for states (default, hover, disabled, loading).
- The design system exports a consistent theme (colors, typography, spacing) consumable by all client apps.
- Components pass accessibility audits (WCAG 2.1 AA).
- Any developer can install the package and use components out of the box with proper TypeScript support.

---

### 3.2 User Authentication
**Priority: P0**

**Description**  
Full authentication flow supporting email/password registration, social logins (Google, Apple), password reset, and email verification. JWT-based authentication with refresh token rotation.

**Acceptance Criteria**
- New users can register with email and password; form validates inputs in real time.
- After registration, a verification email is sent; account is activated upon link click.
- Users can log in with verified credentials or via Google/Apple OAuth.
- Password reset flow: request link, receive email, set new password.
- Authenticated sessions are maintained via Access Token (short-lived) and Refresh Token (long-lived) stored securely (HttpOnly cookie or secure storage).
- Logout invalidates tokens on the server.
- All authentication-related API endpoints are rate-limited and protected against brute force.
- Error messages are user-friendly (e.g., "Invalid email or password") without revealing sensitive information.

---

### 3.3 Guest Browse & Explore
**Priority: P0**

**Description**  
Guests can navigate the platform, explore featured businesses, and search for services without creating an account. Booking is gated behind authentication to drive conversion.

**Acceptance Criteria**
- Homepage displays curated lists: near me, top-rated, trending, categories.
- Guest can tap any business to view its full detail page.
- Search and filter functionality are fully available to guests.
- On the booking screen, a clear CTA prompts "Sign up to book" with a link to registration.
- Guest session does not allow adding to favorites or posting reviews; those actions show a login modal.
- No personally identifiable information is stored for guests beyond anonymous analytics.

---

### 3.4 Business Search & Discovery
**Priority: P0**

**Description**  
A robust search experience that lets users find businesses by keyword, location, category, rating, price, and availability. Results are displayed in a list with infinite scroll or pagination.

**Acceptance Criteria**
- Search bar with autocomplete suggests business names, services, and categories as the user types.
- Filters: location (auto-detect or manual entry), category (multi-select), rating (1–5 stars), price range ($-$$$), "available today/this week" toggle.
- Sort options: relevance, distance, rating, price low-to-high/high-to-low.
- Results list shows business name, main photo, rating, distance, next available slot, and starting price.
- Selecting a business navigates to its detail view.
- Search results update dynamically as filters change (no full page reload).
- API responds within 300ms for cached queries; full-text search fallback for complex queries uses PostgreSQL full-text or Elasticsearch.
- Empty states display helpful suggestions (e.g., "Try expanding your location").

---

### 3.5 Map-based Search
**Priority: P1**

**Description**  
Interactive map view showing business locations. Users can explore by moving the map, tap markers to see quick info, and switch between map and list views.

**Acceptance Criteria**
- Map renders pins for businesses within the current viewport using marker clustering for density.
- Tapping a pin shows a mini card with business name, rating, and a "View" button.
- "Search this area" button fetches businesses as the map is moved.
- Map view syncs with the current filter selections (categories, availability).
- Toggle button switches between map and list view preserving active filters.
- Map supports both web (Google Maps/Mapbox) and mobile (react-native-maps) with a unified data source.

---

### 3.6 Business Detail View
**Priority: P0**

**Description**  
Comprehensive page for a single business, providing all information needed for a user to decide to book.

**Acceptance Criteria**
- Hero section with cover photo, business name, average rating (stars + count), address, and distance.
- Tab/sections: Overview (description, amenities), Services (list with name, duration, price), Team (staff cards with photo, specialty), Reviews (summary and individual reviews), Availability (calendar strip).
- Gallery: swipeable or grid of business photos.
- "Book" floating button always visible on mobile.
- Availability calendar shows at least 4 weeks; tapped date loads time slots for selected service (with staff selection if applicable).
- Share button to copy link or share via native share sheet.
- If user is logged in, a heart icon indicates favorite status and can be toggled.

---

### 3.7 Service Categories
**Priority: P0**

**Description**  
A hierarchical taxonomy of beauty and wellness categories used for browsing and filtering. Categories drive discovery and help businesses be found.

**Acceptance Criteria**
- Predefined categories: Hair, Nails, Massage, Skin Care, Makeup, Barbershop, Spa, Eyelashes, Waxing, etc.
- Each category has an icon and label; displayed on homepage as a scrollable grid.
- Selecting a category navigates to a search results page filtered by that category.
- Categories are manageable by admins via the Admin Dashboard (add, hide, reorder) but not by providers.
- Businesses can associate multiple categories/sub-categories when setting up their profile.
- Category search API supports filtering and sorting.

---

### 3.8 Booking Flow
**Priority: P0**

**Description**  
Step-by-step booking wizard: select service, optionally choose staff, pick date/time from real-time availability, review, and pay. After successful payment, the appointment is confirmed.

**Acceptance Criteria**
- Flow is linear with back navigation allowed; progress indicator (steps) shown.
- **Step 1 - Service**: Lists all services of the business with name, duration, price. Radio selection.
- **Step 2 - Staff** (if business has multiple staff): Shows staff who perform that service with photo, rating. Optional; can be "No preference".
- **Step 3 - Date & Time**: Displays a calendar of available days and a time slot list for the selected date based on real-time availability. Slots are fetched from `GET /availability` endpoint. User selects a slot.
- **Step 4 - Review**: Summary card (business, service, staff, date, time, price, estimated duration). Optional promo code input with validation. "Confirm and Pay" button.
- **Step 5 - Payment**: Integrated Stripe elements (card, wallet) to collect payment. Processes payment via backend (PaymentIntent). On success, appointment is created with status `confirmed`; user sees success screen with appointment details and option to add to calendar.
- At any step, if availability changes before confirmation, user is alerted and slot re-validated.
- Entire flow must handle network interruptions gracefully (retry, show error states).

---

### 3.9 Availability & Slot Computation
**Priority: P0**

**Description**  
Server-side algorithm that calculates bookable time slots for a given business, service, staff, and date, considering working hours, breaks, existing bookings, service duration, buffer times, and parallel appointments.

**Acceptance Criteria**
- Slot computation takes into account:
  - Staff working hours (with multiple shifts per day if needed).
  - Recurring and one-off breaks (lunch, meetings).
  - Existing confirmed and pending appointments.
  - Service duration and inter-service buffer (configurable per business).
  - Staff capacity (if staff can serve multiple clients simultaneously, like a nail salon).
  - Blocked time by provider (manual availability blocking).
- Endpoint `GET /availability?businessId=&serviceId=&staffId=&date=` returns an array of time slots (start time, end time) with availability status.
- Slots are generated as 15/30-minute increments; service length determines how many contiguous slots are needed.
- The algorithm prevents double-booking; concurrent requests for the same slot are handled with optimistic locking (database row-level locks or Redis redlock).
- Performance: compute slots within 500ms for typical use (one year of bookings, 10 staff).
- Recalculation jobs are triggered via BullMQ whenever a booking is made/cancelled or provider changes schedule, to pre-cache availability snapshots.

---

### 3.10 Appointment Management
**Priority: P0**

**Description**  
Clients can view, reschedule, and cancel their appointments. Providers can manage appointments from their portal. Notifications are sent for all changes.

**Acceptance Criteria**
- Client App: Tab "My Appointments" with three sections: Upcoming, Past, Canceled.
- Each appointment card shows business name, service, date, time, staff, status (confirmed, pending, completed, canceled), and actions.
- Reschedule flow: similar to booking flow but pre-filled; user picks new date/time; backend validates availability and updates appointment, notifying provider.
- Cancel: confirmation dialog with cancellation policy text (if any); after cancellation, slot is released and refund processed (if applicable).
- Past appointments show a prompt to leave a review if not already reviewed.
- Provider Portal: list of appointments with filters by date, staff, status; ability to mark as "arrived", "no-show", or complete. Providers can also reschedule/cancel on behalf of clients.
- All status changes trigger BullMQ jobs for push/email/in-app notifications.

---

### 3.11 Favorites
**Priority: P1**

**Description**  
Users can save businesses to a favorites list for quick access. Favorites sync across devices for authenticated users.

**Acceptance Criteria**
- Heart icon on business card and detail page; toggling adds/removes from favorites.
- Favorites list accessible from user profile; displayed as grid of business cards.
- Empty state prompts "Discover businesses to add to your favorites".
- Favorites persist across sessions and devices via server-side storage.
- Swipe-to-delete or long-press to unfavorite on mobile.
- Maximum favorites limit: 200 (to be discussed, but technically no hard limit with pagination).

---

### 3.12 User Profile
**Priority: P1**

**Description**  
Central place for users to manage personal information, preferences, and account details.

**Acceptance Criteria**
- Editable fields: full name, email (with re-verification if changed), phone number, profile photo (upload + crop).
- Sections: Personal Info, Appointment History, Favorites, Payment Methods, Notification Settings.
- Appointment history shows all past bookings with status and option to rebook.
- Payment methods: add/delete credit/debit cards via Stripe's secure vault; primary card selection.
- Notification settings: toggles for email, push, and SMS preferences (booking reminders, promotions).
- Delete account request with confirmation and data retention policy explanation.
- Profile updates are instantly reflected across all components (e.g., name change in appointment confirmations).

---

### 3.13 Reviews & Ratings
**Priority: P1**

**Description**  
Users can rate and review businesses after completing an appointment. Reviews enhance trust and help other users decide. Providers can respond.

**Acceptance Criteria**
- After appointment is marked "completed", a push/email notification invites user to leave a review within 7 days.
- Review form: star rating (1-5), text review (optional, min 10 characters), optional photo upload.
- Submitted reviews are visible on business detail page after moderation (auto-published with AI-based profanity filter; flagged for manual review by admin if low confidence).
- Aggregate rating updates on the business card and detail page in real time.
- Users can edit or delete their own review within 30 days.
- Providers can publicly respond to reviews from their portal (responses are displayed nested).
- Admin can hide/reject reviews that violate guidelines.
- Review pagination on business page.

---

### 3.14 Payment Integration
**Priority: P0**

**Description**  
Secure handling of all financial transactions using Stripe (and optionally PayPal). Supports one-time payments for bookings, tip addition, and refunds.

**Acceptance Criteria**
- Integration via Stripe Elements/React Native Stripe SDK for PCI-DSS compliance.
- At booking, a PaymentIntent is created server-side with amount and metadata; client confirms the intent.
- Payment methods: credit/debit card, Apple Pay, Google Pay (both web and mobile).
- Post-payment, appointment status changes to `confirmed`; receipt emailed to user.
- Cancellation: if refund policy applies, a refund is initiated via Stripe API; partial/custom refund support for admin.
- Saved cards: users can save a card for future bookings (using Stripe's SetupIntent and Customer object).
- All transactions are logged with idempotency keys to prevent duplicate charges.
- Admin dashboard shows payment reports (revenue, refunds, fees) with export capability.

---

### 3.15 Notifications
**Priority: P0**

**Description**  
Multi-channel notification system (push, email, in-app) to keep users informed about bookings, reminders, promotions, and system messages.

**Acceptance Criteria**
- Notification types: booking confirmation, 24h and 1h before appointment reminders, reschedule/cancellation alerts, review request, promotional offers (optional).
- Delivery channels: Firebase Cloud Messaging (push) for mobile, transactional emails via SendGrid or SES, in-app notification center with real-time updates (WebSocket).
- All notifications are triggered by background jobs (BullMQ) for reliability.
- Users can opt in/out of categories per channel from their profile settings.
- In-app notification bell with unread badge; list shows recent notifications with timestamps and tap-to-navigate.
- Email templates are localized and responsive.
- Admin can send targeted broadcast notifications to user segments (future P2).

---

### 3.16 Provider / Business Owner Portal
**Priority: P0**

**Description**  
Web dashboard for business owners to manage their presence, services, staff, and appointments. This is the operational core for providers.

**Acceptance Criteria**
- **Business Profile**: CRUD for business info (name, description, address, photos, contact details), category selection, amenities.
- **Services Management**: Add/edit/delete services with name, description, duration, price, category, and optional buffer time; reorder list; set active/inactive.
- **Staff Management**: Add staff members with name, role, photo, service assignments; set individual working hours, breaks, and vacation days.
- **Calendar View**: Visual day/week/month calendar per staff or aggregated; color-coded appointment status; drag-and-drop reschedule; click to view/edit appointment details.
- **Appointment Management**: List view with filters; actions: confirm pending, mark as arrived, no-show, complete; add internal notes; view client contact (if privacy policy allows).
- **Availability Control**: Set regular business hours per day, special hours for dates, block time slots manually.
- **Analytics Dashboard**: Summary widgets: bookings today/this month, revenue, top services, new vs returning clients (basic).
- **Notification Preferences**: Configure automatic reminders and marketing consents for their clients.
- Multi-staff support: each staff can have separate login with limited permissions (see only their appointments).
- All changes that impact availability trigger an immediate recalculation job.

---

### 3.17 Admin Dashboard
**Priority: P1**

**Description**  
Super admin panel allowing full control over the platform: user management, business moderation, review moderation, financial oversight, and system analytics.

**Acceptance Criteria**
- **Dashboard Home**: High-level KPIs (total users, active businesses, bookings today, total revenue, refund rate, system health).
- **Businesses Management**: List/search/approve/reject/suspend businesses; view business details and analytics; ability to log in as provider (impersonate) for support.
- **Users Management**: Search users, view profiles, disable accounts, handle support tickets.
- **Review Moderation Queue**: Filter flagged reviews, approve/reject, view edit history.
- **Financial Reports**: Revenue over time, commission calculations (if platform takes a cut), payout summaries, refund requests.
- **System Configuration**: Manage global categories, promotion banners, platform fees, cancellation policies.
- **Audit Log**: Track critical actions by admins (login, data changes) for security.
- Role-based access: multiple admin roles (Super Admin, Support Agent) with granular permissions.
- Responsive design for desktop use primarily; mobile access less critical (P2).

---

### 3.18 Background Jobs (BullMQ)
**Priority: P0**

**Description**  
Asynchronous processing infrastructure for tasks that don't need instant synchronous response. Using BullMQ with Redis to manage queues for notifications, availability cache, cleanup, and reports.

**Acceptance Criteria**
- **Notification Queue**: Processes all email, push, and in-app notification tasks with retry logic (max 3 attempts, exponential backoff).
- **Availability Recalculation Queue**: When a booking is created/canceled or provider changes schedule, a job is queued to recalculate cached availability for affected businesses/dates to keep slot queries fast.
- **Scheduled Jobs**: Use BullMQ repeatable jobs for daily tasks: send appointment reminders, cleanup expired pending bookings (e.g., unpaid bookings older than 30 minutes), nightly analytics aggregation.
- **Payment Settlement**: Queue for handling delayed captures and refund processing to isolate from user-facing booking flow.
- **Monitoring**: Bull Board admin UI accessible to ops team showing queue lengths, failed jobs, processing time; alerts on failure thresholds.
- Job processors are idempotent to prevent side effects on retries.
- Graceful shutdown handling to finish active jobs.

---

## 4. Non-functional Requirements
- **Performance**: API response time < 200ms for 95th percentile under normal load; availability calculation < 500ms. Page load and interactivity within 2 seconds.
- **Scalability**: Stateless backend services allow horizontal scaling; Redis and database connection pooling configured. BullMQ worker instances can scale independently.
- **Security**: HTTPS/TLS everywhere; JWT with HS256/RS256; input sanitization; rate limiting on auth and payment endpoints; SQL injection prevention (ORMs); CORS properly set; secrets management via environment variables.
- **Accessibility**: WCAG 2.1 AA across all customer-facing interfaces; support screen readers, keyboard navigation, sufficient color contrast.
- **Localization**: Support multiple languages (English initially, architecture allows French, Spanish). All user-facing strings externalized.
- **Responsive Design**: Web apps must work on desktop, tablet, and mobile; native mobile apps for iOS and Android with feature parity.
- **Observability**: Structured logging (JSON), metrics collection (Prometheus), error tracking (Sentry), health check endpoints.
- **Data Privacy**: GDPR compliance for EU users; data retention/anonymization policies; user consent management.

## 5. Dependencies & Assumptions
- **Tech Stack**: Node.js (NestJS/Express) backend, React/React Native for web and mobile, PostgreSQL database, Redis, BullMQ (based on existing preference).
- **Third-party services**: Stripe for payments, Firebase for push notifications, SendGrid/SES for email, Google Maps API for geolocation and map display.
- **Hosting**: Dockerized microservices deployed on a cloud platform (AWS, GCP, or Azure) with managed database and Redis.
- **Assumptions**: Users have internet access; business hours are stored in UTC with timezone offset; mobile apps have access to push notification services; initial launch targets one country (France) with later expansion.

---

## 6. Appendix: Priority Summary
| Feature | Priority |
|---|---|
| Shared Types & Design System | P0 |
| User Authentication | P0 |
| Guest Browse & Explore | P0 |
| Business Search & Discovery | P0 |
| Map-based Search | P1 |
| Business Detail View | P0 |
| Service Categories | P0 |
| Booking Flow | P0 |
| Availability & Slot Computation | P0 |
| Appointment Management | P0 |
| Favorites | P1 |
| User Profile | P1 |
| Reviews & Ratings | P1 |
| Payment Integration | P0 |
| Notifications | P0 |
| Provider / Business Owner Portal | P0 |
| Admin Dashboard | P1 |
| Background Jobs (BullMQ) | P0 |