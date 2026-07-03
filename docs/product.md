# Planity Clone Product Specification

## 1. Introduction
Planity Clone is a multi-tenant marketplace platform connecting customers with local service businesses (salons, wellness, etc.) for appointment booking. The product encompasses consumer-facing mobile app (iOS/Android), a provider portal (web), and an admin dashboard (web). This document defines complete feature specifications, acceptance criteria, and priorities for all cross-functional modules.

### 1.1 User Roles
- **Guest (unauthenticated)**: browse, search, view limited business details.
- **Customer (authenticated)**: full booking, favorites, profile, reviews.
- **Provider/Business Owner**: manage business listings, services, staff, schedules, and bookings via Provider Portal.
- **Admin**: manage platform, users, businesses, analytics via Admin Dashboard.

### 1.2 Priority Definitions
- **P0**: Must-have for MVP launch; critical core flows.
- **P1**: High value, should be included in initial release but not blocking.
- **P2**: Nice-to-have; post-MVP or rapid iteration.

---

## 2. Features & Acceptance Criteria

### 2.1 User Authentication
**Priority**: P0  
**Description**: Allow users to register, log in, and manage their session securely. Support social login and magic link for seamless onboarding.

**Acceptance Criteria**:
1. Customer can sign up with email/password; system sends verification email.
2. Customer can log in with email/password; returns JWT tokens with refresh flow.
3. Customer can log in with Google, Apple, or Facebook (OAuth 2.0); account linking for same email.
4. Magic link login: enter email → receive link → click to authenticate.
5. Forgot password flow with email reset link, valid for 15 minutes.
6. Session management: access token expiry 15min, refresh token 7 days; auto-refresh on app foreground.
7. Logout clears tokens locally and invalidates server-side session.
8. Error messages for invalid credentials, network failure, expired token.
9. Provider and Admin login via separate portal with role-based access.

### 2.2 Guest Browse & Explore
**Priority**: P0  
**Description**: Unauthenticated users can browse the app, discover businesses, and view limited details to encourage sign-up.

**Acceptance Criteria**:
1. Guest lands on home screen with featured businesses, categories, search bar.
2. Guest can search for businesses by name, category, location (default to geo if enabled, else manual input).
3. View business detail page with name, rating, address, services list (without booking button).
4. Clicking "Book" or time slot triggers authentication flow (login/signup) with deep link back to booking.
5. All publicly visible data respects business privacy settings.
6. No access to favorites, booking history, or profile settings.

### 2.3 Business Search & Discovery
**Priority**: P0  
**Description**: Enable customers to find businesses via text search with filters and sorting.

**Acceptance Criteria**:
1. Search bar on home screen with autocomplete (business names, categories, locations).
2. Results list with business cards: photo, name, rating, category, distance, availability badge.
3. Filters: category, service type, price range, rating, availability (now/today/this week).
4. Sorting: relevance, distance, rating, price (low/high).
5. Search query persists in URL/state for sharing.
6. Empty state with suggestions if no results.
7. Infinite scroll pagination with loading skeletons.
8. Recent searches saved locally.

### 2.4 Map-based Search
**Priority**: P1  
**Description**: Discover businesses via interactive map with clustering.

**Acceptance Criteria**:
1. Map toggle on search results switches between list and map view.
2. Map shows business pins with custom markers showing category icon and availability color.
3. Tap pin shows mini card with business name, rating, next available slot, "View" CTA.
4. Pin clustering at dense zoom levels; de-cluster smoothly.
5. Map centers on user's current location (with permission) or search area.
6. Redraw pins on map move/zoom (debounced 300ms).
7. Offline fallback: show cached tiles/static map image.

### 2.5 Business Detail View
**Priority**: P0  
**Description**: Comprehensive business profile with services, staff, reviews, and booking CTA.

**Acceptance Criteria**:
1. Header: cover image, name, category, rating, address, distance, favorite toggle.
2. Services tab: list of service with name, duration, price; "Book" button per service.
3. Staff tab (if enabled): employee cards with photo, specialties, next available slot; select staff before booking.
4. Reviews tab: rating summary (5-star average), review list with photos, sort/filter. See 2.11.
5. About section: description, business hours, amenities, photos gallery.
6. Sticky "Check Availability" button scrolls to availability/calendar.
7. Share business via deep link.
8. Provider can set booking mode: instant booking or request confirmation (indicated on detail).

### 2.6 Service Categories
**Priority**: P1  
**Description**: Hierarchical category taxonomy for services, used for discovery and provider catalog.

**Acceptance Criteria**:
1. Admin can manage categories (parent/child) via admin dashboard.
2. Customers can explore categories from home screen (tiles with icons).
3. Category page shows subcategories and top businesses.
4. Search supports filtering by category and subcategory.
5. Provider can associate services with leaf categories.
6. Category tree supports up to 3 levels.

### 2.7 Availability & Slot Computation
**Priority**: P0  
**Description**: Core engine computing real-time bookable slots based on business hours, staff, service duration, buffers, and existing bookings.

**Acceptance Criteria**:
1. Each provider defines business hours (day-of-week, open/close, breaks).
2. Staff assigned to services with their individual schedules override business hours.
3. Service requires a fixed duration plus optional buffer before/after.
4. Compute available slots for a given service, staff (optional), date range via dedicated API.
5. Slots respect already booked appointments (including overlap, travel time if enabled).
6. Parallel bookings: maximum concurrent bookings per staff/business (configurable).
7. Slot generation algorithm returns 15-minute granularity; display continuous slots e.g. "9:00 AM, 9:15 AM, ..."
8. Amenity constraints: room-based resources can be reserved (optional).
9. Computed slots cached for 5 minutes; invalidated on new booking/cancellation.
10. API: `GET /businesses/:id/slots?serviceId=X&staffId=Y&date=Z&timezone=...` returns list of start times with unavailability reasons.

### 2.8 Booking Flow
**Priority**: P0  
**Description**: Seamless appointment booking from service selection to confirmation.

**Acceptance Criteria**:
1. User selects service, optionally staff, then date/time from available slots.
2. Confirmation screen shows service, staff, date, time, duration, price, location, cancellation policy.
3. Add-ons/extra services can be selected with adjusted total.
4. Require authentication if not logged in; redirect back after login.
5. Booking payload includes: businessId, serviceId, optional staffId, startTime (ISO), addons.
6. Payment integration: if prepayment required, Stripe Payment Sheet appears (credit card, Apple Pay, Google Pay). See 2.12.
7. On success, booking status is "confirmed" (if instant) or "pending" (if approval); appointment created.
8. Post-booking screen: confirmation details, option to add to calendar, share.
9. Idempotency key prevents duplicate submissions.
10. Booking confirmation triggers notifications (email/push).

### 2.9 Appointment Management
**Priority**: P0  
**Description**: Customers can view, modify, cancel upcoming appointments.

**Acceptance Criteria**:
1. "My Appointments" list: upcoming (confirmed/pending), past (completed, canceled, no-show).
2. Each item: business name, service, date/time, status badge, staff, map link.
3. Detail view: full appointment info, reschedule and cancel buttons (within policy window).
4. Reschedule flow: open availability calendar for same service/business, select new slot, confirm; success updates appointment.
5. Cancel: confirm dialog with cancellation policy note; if refundable, trigger refund.
6. Cancellation policy: free cancellation up to X hours before; late cancellation fee shown.
7. Appointment state updates propagate to provider calendar in real-time.
8. Push notification 24h and 1h before appointment with deep link.
9. Past appointments allow re-book with same parameters.

### 2.10 Favorites
**Priority**: P1  
**Description**: Save businesses to a favorites list for quick access.

**Acceptance Criteria**:
1. Heart icon on business cards/detail toggles favorite status (optimistic UI update).
2. Favorites synced to server; visible in profile section.
3. Favorites list sorted by recently added; search/filter within list.
4. Favorite businesses indicated in search results.
5. Offline: favoriting queues to sync when online.

### 2.11 User Profile & Settings
**Priority**: P1  
**Description**: Manage personal info, communication preferences, linked accounts.

**Acceptance Criteria**:
1. Profile tab: avatar, name, email, phone, date of birth (optional).
2. Edit profile with validation (email unique, phone format).
3. Communication preferences: push notifications, email marketing, SMS reminders (opt-in).
4. Manage connected accounts (Google, Apple) with possibility to unlink (password required as backup).
5. App settings: language, theme (auto/light/dark), location permissions.
6. Data export and account deletion (GDPR compliance).

### 2.12 Payment Integration
**Priority**: P0  
**Description**: Secure payment collection for prepaid bookings or no-show fees via Stripe.

**Acceptance Criteria**:
1. Integrate Stripe Elements/PaymentSheet for checkout.
2. Customer adds payment method (card, Apple Pay, Google Pay) during booking if prepayment required.
3. Payment methods saved to Stripe Customer; charge later for fees.
4. “Hold” amount capture only upon service completion or cancellation fee according to policy.
5. Receipt generated and emailed after successful payment.
6. Support multiple currencies based on business location.
7. Admin dashboard shows transaction logs and refund capabilities.
8. PCI DSS compliance: no raw card details touch our servers.

### 2.13 Reviews & Ratings
**Priority**: P2 (P1 for customer trust, but can launch without)  
**Description**: Allow customers to rate and review businesses after appointment completion.

**Acceptance Criteria**:
1. Post-appointment prompt (after 24h) via push notification to write a review.
2. Review form: star rating (1-5), text (min 10 chars), optional photos (max 3).
3. List reviews on business detail page with most relevant first, sort by date/rating.
4. Provider can respond to reviews (single reply).
5. Abuse reporting and moderation queue for admin.
6. Average rating and total counts cached and updated asynchronously.
7. Users can edit/delete their own reviews.

### 2.14 Notifications
**Priority**: P0  
**Description**: Multi-channel notifications for booking events, reminders, promotions.

**Acceptance Criteria**:
1. Push notifications (FCM/APNs) for: booking confirmation, reminders (24h, 1h), reschedule/cancellation, review request.
2. In-app notification center with badge count and mark-as-read.
3. Email notifications: booking confirmation with calendar .ics attachment, cancellations, payment receipts.
4. SMS reminders for upcoming appointments (if phone provided and opted-in).
5. Notification preferences toggle per channel in profile.
6. Provider notifications: new booking, cancellation, review received (via portal and email).
7. Background jobs using BullMQ: dispatch notification tasks with retry logic (see 2.16).

### 2.15 Provider / Business Owner Portal
**Priority**: P0 (basic), P1 (advanced features)  
**Description**: Web portal for providers to manage their business, services, staff, schedules, and bookings.

**Acceptance Criteria (P0 - MVP)**:
1. Provider registration: business info, address, category, contact.
2. Dashboard: upcoming appointments list (today, week) with status management (confirm, start, complete, cancel).
3. Calendar view (day/week) to see booked slots and walk-in creation.
4. Service management: CRUD services with name, duration, price, category, buffer, color.
5. Staff management: add/edit staff, assign services, set individual availability (overrides business hours).
6. Business hours configuration: set open days, breaks, closures.
7. Accept/reject booking requests (if mode requires approval).
8. Booking detail: customer info, service, staff, notes, status actions.
9. Responsive design works on tablet.

**Acceptance Criteria (P1)**:
1. Customer management: client list, history, notes, quick rebook.
2. Reporting: revenue, appointment volume, popular services.
3. Automated response to reviews.
4. Custom cancellation policy per service.
5. Inventory/room resource management for amenity-constrained slots.

### 2.16 Admin Dashboard
**Priority**: P1 (core) / P2 (advanced analytics)  
**Description**: Super admin panel to oversee platform, manage businesses, moderate content, and view analytics.

**Acceptance Criteria**:
1. Dashboard overview: total users, providers, bookings, revenue (today/week/month).
2. Business management: approve/reject new providers, suspend/delete, edit details.
3. User management: list customers, disable accounts, view activity logs.
4. Category management: create/edit/delete categories; reorder.
5. Content moderation: approve/reject reviews, reported reviews.
6. Transaction logs: payment history, refund processing.
7. Notification broadcast: send push/email to segments (e.g., all customers, providers).
8. Role-based access: admin, support, moderator with granular permissions.

### 2.17 Background Jobs (BullMQ)
**Priority**: P1  
**Description**: Reliable job processing for time-sensitive, resource-intensive tasks.

**Acceptance Criteria**:
1. Notification dispatching: email, SMS, push each as separate queue with retry policies (exponential backoff, max 5 attempts).
2. Slot cache invalidation: after booking/cancellation, enqueue job to invalidate availability caches for affected date range.
3. Review moderation queue for auto-flagging abusive language.
4. Periodic jobs: reminder generation (24h, 1h before appointment), cleanup expired tokens, aggregate analytics.
5. Dashboard to monitor queue health, failed jobs, retry manually.
6. Jobs idempotent: duplicate prevention via jobId (e.g., bookingId:notification:confirmation).
7. Dead-letter queue for jobs exceeding retry limit with alerting.

### 2.18 Shared Types & Design System
**Priority**: P0 (implicit)  
**Description**: Unified TypeScript types and UI component library to ensure consistency across consumer app, provider portal, and admin.

**Acceptance Criteria**:
1. Shared types package includes: User, Business, Service, Staff, Appointment, Review, Booking, Notification, etc., with enum statuses.
2. Design system tokens: colors, typography, spacing, shadows, breakpoints.
3. Reusable components: Button, Input, Card, Badge, StarRating, AvailabilityCalendar, etc., implemented in React/React Native.
4. Accessibility: components meet WCAG AA, with proper roles, labels, touch targets.
5. Theming supports light/dark mode with CSS variables/TokenProvider.
6. Storybook documentation for all components.

---

## 3. Non-Functional Requirements
- Performance: booking flow completion under 3 seconds; availability API p95 < 200ms.
- Reliability: 99.9% uptime for core booking services.
- Security: HTTPS, input sanitization, rate limiting, OWASP top 10 mitigated.
- Offline: graceful degradation; cached data for search results and appointments.
- Localization: i18n ready with English (default) and French support at launch.

## 4. Release Plan
- MVP (P0): Auth, search/list, business detail, availability computation, booking flow, appointment management, payment (Stripe), basic provider portal, notifications, design system.
- V1 (P1): Map search, favorites, profile, service categories, admin dashboard basic, provider portal advanced features.
- V2 (P2): Reviews, provider reporting, advanced admin analytics, provider mobile app.

---

**Document Version**: 1.0 | Last Updated: 2025-04-08