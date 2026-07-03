# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first beauty and wellness booking platform that connects customers with salons, spas, barbers, and independent professionals. The app enables seamless discovery, real-time availability checking, instant booking, and appointment management. It serves three user roles: Customers, Providers (business owners), and Administrators.

## 2. User Roles
- **Customer**: End-user searching for services, booking appointments, managing profile, leaving reviews.
- **Provider / Business Owner**: Manages business profile, services, staff, availability, appointments, and reviews.
- **Admin**: Oversees platform health, user management, content moderation, and analytics.

## 3. Features

### 3.1 Shared Types & Design System
**Priority**: P0 (Foundation)
**Description**: Establish a unified design system and shared TypeScript types across frontend and backend to ensure consistency, reduce duplication, and speed up development. Includes color palette, typography, spacing, reusable components (buttons, cards, inputs, modals), and core data models (User, Business, Service, Appointment, Review, etc.).
**Acceptance Criteria**:
- All UI components follow the design system; no hardcoded colors or fonts.
- Shared types are defined in a monorepo package and imported by both web and mobile apps.
- Storybook or similar documentation exists for every reusable component.
- Type definitions cover all entities with strict null checks.
- Design tokens are exported as a theme object for React Native and web.

### 3.2 User Authentication
**Priority**: P0
**Description**: Secure sign-up, login, and session management for all roles. Supports email/password and social login (Google, Apple). Includes email verification, password reset, and role-based access control.
**Acceptance Criteria**:
- Customer can sign up with email/password or social provider; email verification required before first booking.
- Provider sign-up includes business details and is subject to admin approval.
- Admin login is restricted to pre-approved accounts.
- JWT tokens with refresh token rotation; session persists across app restarts.
- Password reset flow sends a time-limited link via email.
- Logout clears tokens and redirects to login.
- Invalid credentials show appropriate error messages without revealing user existence.

### 3.3 Guest Browse & Explore
**Priority**: P1
**Description**: Allow unauthenticated users to browse businesses, services, and reviews to encourage sign-up. Booking and favoriting require authentication.
**Acceptance Criteria**:
- Guest can view home feed, search results, business detail pages, and reviews.
- Attempting to book, favorite, or write a review prompts login/sign-up modal.
- Guest session does not persist personal data; after login, previous browsing context is lost.
- No sensitive user data is exposed to guests.

### 3.4 Business Search & Discovery
**Priority**: P0
**Description**: Customers can search for businesses by name, service type, location, or keyword. Results are ranked by relevance, rating, and proximity. Filters include category, price range, rating, and availability.
**Acceptance Criteria**:
- Search bar with autocomplete suggestions (business names, services).
- Results display business name, rating, distance, main image, and next available slot.
- Filters: category (multi-select), price level ($-$$$), minimum rating, open now toggle.
- Sorting options: relevance, rating, distance, price.
- Search results update as filters change without full page reload.
- Empty state with helpful message when no results match.
- Search history saved for logged-in users.

### 3.5 Map-based Search
**Priority**: P1
**Description**: Interactive map view showing nearby businesses with pins. Users can move the map to search in a different area, tap pins to see preview cards, and switch between list and map views.
**Acceptance Criteria**:
- Map loads with user's current location (if permission granted) or default city center.
- Business pins show category icon and rating badge.
- Tapping a pin opens a bottom sheet with business name, rating, distance, and a "View Details" button.
- Map re-centers and reloads results when user pans/zooms significantly.
- Toggle button switches between list view and map view, preserving search context.
- Location permission prompt with clear explanation; graceful fallback if denied.

### 3.6 Business Detail View
**Priority**: P0
**Description**: Comprehensive business profile page including photos, description, services, staff, reviews, location map, and booking call-to-action.
**Acceptance Criteria**:
- Image gallery with swipeable carousel; tap to view full-screen.
- Business name, rating, review count, address, phone, website, and opening hours.
- "About" section with rich text description.
- Services tab: list of services with name, duration, price, and "Book" button.
- Staff tab: list of professionals with photo, name, specialties, and "Book with [name]" option.
- Reviews tab: paginated list of reviews with star rating, text, photos, and owner response.
- Sticky bottom bar with "Book Now" button that scrolls to service selection.
- Share button to copy link or share via native share sheet.
- Favorite/unfavorite heart icon.

### 3.7 Service Categories
**Priority**: P0
**Description**: Hierarchical category system (e.g., Hair > Haircut, Coloring) to organize services and aid discovery. Categories are managed by admin and used for filtering and browsing.
**Acceptance Criteria**:
- Home screen shows top-level categories as tappable cards/icons.
- Tapping a category navigates to a subcategory list or directly to search results filtered by that category.
- Categories are displayed in search filters and business detail services.
- Admin can add, edit, deactivate categories and subcategories.
- Category images and icons are configurable.
- Services must be linked to at least one leaf category.

### 3.8 Booking Flow
**Priority**: P0
**Description**: Step-by-step booking process: select service, choose staff (optional), pick date/time from real-time availability, add extras, review summary, and confirm. Supports guest checkout with account creation prompt.
**Acceptance Criteria**:
- Flow steps: Service → Staff (if multiple) → Date & Time → Extras → Review & Pay.
- Date picker shows available days highlighted; unavailable days greyed out.
- Time slots are generated from provider's real-time availability and existing bookings.
- User can select a specific staff member or "Any available".
- Extras (add-ons) are displayed with checkboxes and prices.
- Summary screen shows service, staff, date, time, duration, price breakdown, and cancellation policy.
- Confirm button triggers payment (if required) and creates appointment.
- On success, show confirmation screen with appointment details and option to add to calendar.
- On failure, show clear error and allow retry without losing selections.
- Guest users are prompted to create account after booking; appointment is linked after sign-up.

### 3.9 Availability & Slot Computation
**Priority**: P0
**Description**: Real-time engine that computes available time slots based on business hours, staff schedules, service duration, buffer times, and existing appointments. Must handle time zones and concurrent bookings.
**Acceptance Criteria**:
- Providers define business hours per day, staff working hours, breaks, and service-specific buffers.
- Slot computation considers staff capacity (one appointment at a time per staff unless parallel allowed).
- Overlapping bookings are prevented; double-booking impossible.
- System returns available slots for a given service, staff, and date within 500ms.
- Slots adjust dynamically when a booking is made or cancelled.
- Time zone handling: all times stored in UTC, displayed in business's local time.
- Admin can configure global buffer between appointments.
- Edge cases: service spanning across a break, last slot of the day, holiday closures.

### 3.10 Appointment Management
**Priority**: P0
**Description**: Customers can view upcoming and past appointments, reschedule, cancel, and rebook. Providers can manage their appointment calendar, confirm, modify, and add notes.
**Acceptance Criteria**:
- Customer "My Appointments" list with tabs: Upcoming, Past.
- Each appointment card shows business name, service, date, time, status, and actions.
- Reschedule flow: select new date/time from availability; old slot released upon confirmation.
- Cancellation: confirm dialog with policy info; if within free cancellation window, no charge; otherwise, charge fee.
- Rebook: pre-fills booking flow with same service and business.
- Provider calendar view (day/week) with color-coded appointments.
- Provider can confirm, cancel, mark no-show, add internal notes.
- Push notifications for booking confirmations, reminders, changes.
- Appointment statuses: pending, confirmed, in-progress, completed, cancelled, no-show.

### 3.11 Favorites
**Priority**: P1
**Description**: Customers can save favorite businesses for quick access. Favorites sync across devices.
**Acceptance Criteria**:
- Heart icon on business cards and detail page toggles favorite status.
- Dedicated "Favorites" screen listing saved businesses with name, rating, next available slot.
- Favorites persist after logout/login.
- Empty state with suggestion to explore businesses.
- Unfavoriting removes immediately with undo option.

### 3.12 User Profile
**Priority**: P1
**Description**: Customer profile management: personal info, contact details, notification preferences, payment methods, and appointment history.
**Acceptance Criteria**:
- Edit name, email, phone, profile photo.
- Change password with current password verification.
- Manage saved payment methods (add, delete, set default).
- Notification preferences: push, email, SMS toggles for booking reminders, promotions, etc.
- Link to appointment history.
- Delete account option with confirmation and data deletion compliance.

### 3.13 Reviews & Ratings
**Priority**: P1
**Description**: Customers can leave star ratings and written reviews with optional photos after a completed appointment. Providers can respond publicly. Admin moderates.
**Acceptance Criteria**:
- After appointment completion, prompt to rate/review via push and in-app.
- Rating: 1-5 stars; review text (min 10 chars), optional photo upload (max 3).
- Reviews appear on business detail page sorted by recent or helpful.
- Provider can post one public response per review.
- Review author can edit or delete their review within 30 days.
- Admin can hide inappropriate reviews; flagged reviews go to moderation queue.
- Aggregate rating updates in real-time.

### 3.14 Payment Integration
**Priority**: P0
**Description**: Secure payment processing via Stripe for booking deposits, full payments, and cancellation fees. Supports multiple payment methods (card, digital wallets). PCI compliance handled by Stripe.
**Acceptance Criteria**:
- Customers can save cards securely; card details never touch our servers.
- Booking flow: if service requires payment, Stripe PaymentSheet appears after review.
- Supports pre-authorization and capture upon service completion.
- Cancellation fees automatically charged according to business policy.
- Receipts sent via email after successful payment.
- Payment history viewable in user profile.
- Provider sees payment status in appointment details.
- Admin can view transaction logs and handle disputes.
- Graceful error handling for declined payments with retry option.

### 3.15 Notifications
**Priority**: P0
**Description**: Multi-channel notification system (push, email, SMS) for transactional and marketing messages. Triggers include booking confirmations, reminders, cancellations, reviews, and promotions.
**Acceptance Criteria**:
- Push notifications using Firebase Cloud Messaging (FCM) with deep linking to relevant screen.
- Email notifications via SendGrid or similar with HTML templates.
- SMS for critical alerts (booking confirmation, last-minute changes) via Twilio.
- Notification preferences honored per user.
- Providers receive notifications for new bookings, cancellations, reviews.
- Admin can send promotional push notifications to segmented user groups.
- Notification history in-app with read/unread status.
- Background jobs handle notification dispatch asynchronously.

### 3.16 Provider / Business Owner Portal
**Priority**: P0
**Description**: Web and mobile dashboard for providers to manage their business profile, services, staff, availability, appointments, and reviews. Includes analytics and client management.
**Acceptance Criteria**:
- Business profile editing: name, description, photos, address, contact, opening hours.
- Service management: add/edit/delete services with name, duration, price, category, description, image.
- Staff management: add staff with name, photo, specialties, working hours, breaks.
- Availability calendar: set recurring weekly hours, special dates (holidays, extended hours).
- Appointment dashboard: calendar view, list view, filter by staff/service/date, actions (confirm, cancel, no-show).
- Client list with appointment history and notes.
- Review management: view and respond to reviews.
- Basic analytics: bookings count, revenue, popular services, new vs returning clients.
- Multi-location support: provider can manage multiple branches with location switcher.

### 3.17 Admin Dashboard
**Priority**: P1
**Description**: Web-based admin panel for platform oversight: user management, business approval, category management, moderation, analytics, and configuration.
**Acceptance Criteria**:
- Dashboard with key metrics: total users, businesses, bookings, revenue, active users.
- User management: list, search, view details, suspend/ban users.
- Business approval queue: review new provider sign-ups, approve/reject with reason.
- Category management: CRUD for service categories and subcategories.
- Review moderation: flagged reviews queue, hide/unhide, notify user.
- Configuration: global settings (cancellation policy defaults, buffer times, commission rates).
- Role-based access: super admin vs support staff with granular permissions.
- Audit log of admin actions.

### 3.18 Background Jobs (BullMQ)
**Priority**: P0
**Description**: Reliable job queue for asynchronous tasks: sending notifications, processing payments, generating reports, cleaning up expired data, and handling scheduled reminders.
**Acceptance Criteria**:
- BullMQ with Redis for job processing.
- Job types: send-email, send-push, send-sms, process-payment-capture, generate-daily-report, cleanup-expired-tokens.
- Scheduled jobs for appointment reminders (24h and 1h before).
- Retry logic with exponential backoff for failed jobs.
- Dead letter queue for jobs that exceed max retries; admin can inspect and retry.
- Monitoring dashboard (Bull Board) for queue health.
- Jobs are idempotent where possible to prevent duplicate notifications.
- Graceful shutdown handling to complete in-progress jobs.

## 4. Non-Functional Requirements
- **Performance**: API response < 200ms for 95th percentile; slot computation < 500ms.
- **Scalability**: Support 100k concurrent users; horizontal scaling of services.
- **Security**: HTTPS, JWT with short expiry, input sanitization, rate limiting, GDPR compliance.
- **Reliability**: 99.9% uptime for core booking flow; automated backups.
- **Accessibility**: WCAG 2.1 AA for web; screen reader support for mobile.

## 5. Prioritization Summary
- **P0 (Must-have)**: Shared Types & Design System, User Authentication, Business Search & Discovery, Business Detail View, Service Categories, Booking Flow, Availability & Slot Computation, Appointment Management, Payment Integration, Notifications, Provider Portal, Background Jobs.
- **P1 (High)**: Guest Browse & Explore, Map-based Search, Favorites, User Profile, Reviews & Ratings, Admin Dashboard.
- **P2 (Medium)**: Advanced analytics, loyalty program, multi-language support.
- **P3 (Low)**: Social sharing, AR try-on, chatbot support.

This specification serves as the single source of truth for the Planity Clone development team. All features must be implemented according to the acceptance criteria defined above.