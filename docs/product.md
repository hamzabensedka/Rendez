# Planity Clone Product Specification

**Version:** 1.0  
**Product Owner:** Alex  
**Role:** Senior Product Manager

---

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with local beauty and wellness businesses. It enables guests to browse, search, book appointments, manage favorites, and receive notifications. Business owners manage their services, slots, staff, and bookings via a dedicated portal. Administrators oversee the platform through a dashboard. The system relies on background jobs for reliable slot computation, reminders, and cleanup.

---

## 2. Features & Acceptance Criteria

### 2.1 User Authentication
**Priority:** P0 (Critical)

**User Story:** As a user, I want to sign up and log in securely so that I can manage my bookings and profile.

**Acceptance Criteria:**
- Users can register with email/password, Google, or Apple sign-in.
- Email verification required before first login (link expires in 24h).
- Login returns JWT access/refresh tokens; refresh token rotation implemented.
- Forgot password flow sends a reset link; link valid for 1 hour.
- Session persists across app restarts; auto-logout after 30 days of inactivity.
- Validation errors shown inline (invalid email, weak password).
- All auth pages are accessible in light/dark mode.

---

### 2.2 Guest Browse & Explore
**Priority:** P0

**User Story:** As a guest, I want to explore businesses and services without creating an account so that I can decide to sign up later.

**Acceptance Criteria:**
- Guest can view home feed with featured businesses, popular services, categories.
- Search and filter (location, rating, price, availability) work without login.
- Tapping any business opens its detail page; CTA prompts login/signup when attempting to book.
- Guest session persists navigation history and search filters for 30 minutes.
- Clear upgrade prompts when booking, favoriting, or leaving a review.

---

### 2.3 Business Search & Discovery
**Priority:** P0

**User Story:** As a user, I want to search for businesses by name, service, or category so that I can find exactly what I need.

**Acceptance Criteria:**
- Search bar with auto-suggest (min 3 characters) showing businesses, services, categories.
- Results sorted by relevance, then rating, then distance (when location available).
- Filters: service category, price range (€-€€€€), rating, opening hours, “available today/this week”.
- Infinite scroll with 20 results per page.
- Empty state with suggestions (e.g., “Try broadening your area”).
- Search works offline with cached data if previously loaded (stale indicator shown).

---

### 2.4 Map-based Search
**Priority:** P1

**User Story:** As a user, I want to discover businesses on a map so that I can find ones near my location.

**Acceptance Criteria:**
- Map view toggle on search results.
- Clustered markers for high-density areas; tap cluster to zoom.
- Marker shows business name, rating, and primary image thumbnail.
- Tap marker opens detail card; swipe up for full detail.
- Map follows user location (with permission) and recenters on drag.
- Map filters sync with list search filters.

---

### 2.5 Business Detail View
**Priority:** P0

**User Story:** As a user, I want to view a business’s details, services, reviews, and available slots so that I can make an informed booking.

**Acceptance Criteria:**
- Image carousel, business name, rating, address (with open in maps), contact, description.
- Tabs: Services, Reviews, About, Availability.
- Services tab lists categories/services with duration and price; expandable details.
- Reviews tab shows summary (average, distribution) and list with pagination (15/reload).
- Availability tab shows a week calendar; tapping a day reveals available time slots for the service selected.
- Book CTA anchored at bottom.
- Social share button.

---

### 2.6 Service Categories
**Priority:** P1

**User Story:** As a user, I want to browse by service categories (hair, nails, spa, etc.) so that I can explore relevant businesses quickly.

**Acceptance Criteria:**
- Category carousel on home screen and search page.
- Each category tile has icon, name, and business count.
- Tapping category opens a filtered list with relevant sub-categories where applicable.
- Categories manageable by admin (CRUD, icon upload).
- Category filtering works in conjunction with other search filters.

---

### 2.7 Booking Flow
**Priority:** P0

**User Story:** As a customer, I want to book an appointment in a few steps with clear confirmation so that I feel confident about my reservation.

**Acceptance Criteria:**
- Flow: Select service(s) → Select staff (if multi-staff) → Choose date & time → Review summary → Confirm with payment/card hold.
- Availability shown in real-time (computed slots).
- Option to add multiple services (same staff) with cumulative duration and price.
- Summary shows: business name, services, staff, date, start/end time, total price, cancellation policy.
- Requires payment method (stripe) before confirmation; card authorized, not captured.
- Confirmation screen with animated tick, booking ID, calendar add, and share options.
- Error handling: slot gone, payment failure, network issue – graceful retries and clear messages.

---

### 2.8 Appointment Management
**Priority:** P0

**User Story:** As a user, I want to view, reschedule, and cancel my upcoming appointments so that I can manage my schedule.

**Acceptance Criteria:**
- “My Appointments” tab with Upcoming / Past / Cancelled filters.
- Each card shows business, service(s), date, time, status.
- Tap to expand: full details, “Add to Calendar”, “Get Directions”.
- Reschedule: choose new slot (same rules as booking, provider must allow reschedule window); cancel with confirmation and reason modal.
- Cancellation policy enforced (free cancel up to X hours; late cancel fee may apply).
- Status updates in real-time via socket/polling.
- Push notification sent on any status change.

---

### 2.9 Favorites
**Priority:** P1

**User Story:** As a user, I want to save businesses to a favorites list so that I can quickly access them later.

**Acceptance Criteria:**
- Heart icon on business cards and detail page.
- Favorites accessible from profile tab, sorted by recently added.
- Offline support: show cached favorited businesses.
- Swipe to remove; undo option via snackbar.
- Notification when a favorited business has a new service or promo (optional opt-in).

---

### 2.10 User Profile
**Priority:** P1

**User Story:** As a user, I want to manage my personal information, preferences, and payment methods so that my account is up to date.

**Acceptance Criteria:**
- Editable fields: name, profile photo, phone, email (requires re-verification if changed).
- Notification preferences: push (booking reminders, offers), email, in-app.
- Saved payment methods (via Stripe): add, delete, set default.
- Appointment history with export option (PDF/CSV).
- Delete account with confirmation and mandatory reason; data retention notice.

---

### 2.11 Availability & Slot Computation
**Priority:** P0 (backend engine)

**User Story:** As a user, I want to see accurate, real-time available slots so that I don’t face double bookings.

**Acceptance Criteria:**
- Slots generated from provider’s working hours, service duration, buffer times, staff schedule, and existing bookings.
- Slots recomputed on booking creation/cancellation/reschedule via background job (BullMQ).
- Cache slots per business/service/date with TTL 5 minutes; invalidated on mutations.
- No double-bookings: slot lock (Redis) during booking transaction with 10-min expiry.
- Timezone-aware: provider sets timezone; slots displayed in user’s device timezone.
- API returns date, start time, end time, staff ID, available count (if multi-staff).
- Support for “walk-in” flag for businesses that accept non-booked visits.

---

### 2.12 Shared Types & Design System
**Priority:** P1

**User Story:** As a developer, I want a consistent design system and shared types to ensure UI uniformity and reduce errors.

**Acceptance Criteria:**
- Design tokens: colors, typography, spacing, radii, shadows defined in JSON/TS.
- Shared TypeScript types for all core entities: User, Business, Service, Booking, Review, Slot, etc.
- Theme support for light/dark mode with seamless switching.
- Storybook component library for all reusable UI elements (buttons, cards, modals, inputs).
- Accessibility: WCAG 2.1 AA compliant color contrast, touch targets minimum 44x44 pt.
- Components documented with props, variants, and examples.

---

### 2.13 Reviews & Ratings
**Priority:** P1

**User Story:** As a user, I want to read and leave reviews so that I can make informed choices and share my experience.

**Acceptance Criteria:**
- Only verified customers (with completed appointment) can review; one review per booking.
- Rating: 1-5 stars; optional comment and photo upload (max 5 photos).
- Reviews moderated via admin dashboard; profanity filter applied.
- Business overall rating is weighted average of last 12 months, updated asynchronously.
- User can edit their own review within 48h; after that only report option.
- Sorting: most recent, highest, lowest, helpful. Helpful vote count tracked.

---

### 2.14 Payment Integration
**Priority:** P0

**User Story:** As a user, I want secure card payment to confirm my bookings, and businesses to receive payouts reliably.

**Acceptance Criteria:**
- Integration with Stripe Connect: platform holds funds, transfers to provider after service (minus platform fee).
- Card authorization at booking; capture on service completion or no-show (configurable by provider).
- Support SCA/3D Secure; PCI DSS compliant via Stripe Elements/checkout.
- Saved cards stored securely; CVV required for each new booking.
- Refunds for cancellations according to policy: full refund if within free window, partial if late, none if no-show.
- Transaction history viewable by customer and provider.
- Admin dashboard shows payment statuses, disputes, and fee reports.

---

### 2.15 Notifications
**Priority:** P1

**User Story:** As a user, I want timely notifications about bookings, reminders, and offers so that I never miss an appointment.

**Acceptance Criteria:**
- Push notifications (FCM/APNs) for: booking confirmation, reminder (24h and 1h before), cancellation, reschedule, new message.
- In-app notification center with real-time updates via WebSocket.
- Email notifications for all critical events (confirmation, receipt, cancellation).
- Notification preferences granular: toggle push/email per event type.
- Deep linking: tap notification opens relevant screen (booking detail, etc.).
- Rate limiting to avoid spam; admin can send broadcast push to all users/segments.

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0

**User Story:** As a business owner, I want to manage my listing, services, schedule, staff, and bookings to operate efficiently.

**Acceptance Criteria:**
- Separate web portal (responsive) with login.
- Dashboard: today’s bookings, earnings summary, upcoming, notifications.
- Business profile editor: images, description, address, contact, working hours (with special hours overrides).
- Service management: CRUD, categories, duration, price, buffer time, color coding.
- Staff management: invite staff (email), set service eligibility, working hours, assign bookings.
- Calendar view: daily/weekly, drag reschedule, block time off, color-coded by staff/service.
- Booking list: filter by date, staff, service, status; manual booking creation for walk-ins/phone.
- Notifications: real-time update of new booking/cancellation; push and in-portal.
- Reports: revenue, bookings count, top services, staff utilization (export CSV).
- Provider can set cancellation policy (hours before free cancel, late fee %).

---

### 2.17 Admin Dashboard
**Priority:** P1

**User Story:** As an admin, I want to manage businesses, users, reviews, payments, and system health to ensure platform quality.

**Acceptance Criteria:**
- Dashboard with KPIs: total businesses, users, bookings, revenue, active disputes.
- Business management: approve/reject new listings, suspend, edit details, view performance.
- User management: search, suspend, delete, view history.
- Review moderation queue: approve/reject flagged reviews; view report history.
- Payment oversight: transaction list, refund requests, platform fee adjustments.
- Category management: CRUD, icon upload, order.
- Broadcast notifications: compose and send to all users or specific segments.
- Configuration: platform fee percentage, default cancellation policies, feature flags.
- Role-based access control: super admin, support agent.

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P0

**User Story:** As a system, I need reliable background processing for slot computation, notifications, and cleanup to maintain data integrity.

**Acceptance Criteria:**
- Job queues: `slot-generation`, `notification`, `payment-capture`, `review-update`, `data-cleanup`.
- `slot-generation`: triggers on booking created/cancelled/rescheduled, staff hours change; recomputes affected date range and updates cache.
- `notification`: pushes/emails sent via template engine, retry 3 times with exponential backoff.
- `payment-capture`: captures authorized charges after service time + grace period.
- `review-update`: recalculates business average rating asynchronously on new/edit/delete review.
- `data-cleanup`: deletes expired guest sessions, unverified accounts (after 30 days), stale slot locks.
- All jobs are idempotent and support dead letter queue for failures.
- Admin can view job status, retries, failed jobs from dashboard.

---

## 3. Priority Summary

| Priority | Features                                                      |
|----------|---------------------------------------------------------------|
| P0       | Authentication, Guest Browse, Search & Discovery, Detail View, Booking Flow, Appointment Management, Availability Engine, Payment Integration, Provider Portal, Background Jobs |
| P1       | Map Search, Service Categories, Favorites, User Profile, Design System, Reviews & Ratings, Notifications, Admin Dashboard |
| P2       | Advanced analytics, loyalty program, multi-language, integrations |

---

## 4. Non-Functional Requirements

- **Performance:** API response <200ms p95; slot computation <500ms.
- **Scalability:** Horizontal scaling for API and job workers; DB read replicas.
- **Reliability:** 99.9% uptime for booking critical paths.
- **Security:** HTTPS, rate limiting, input sanitization, dependency scanning.
- **Accessibility:** WCAG 2.1 AA for customer web flows; mobile native accessibility.
- **Localization:** UI ready for i18n; dates/times in user locale; multi-currency support via Stripe.

---

## 5. Assumptions & Dependencies

- Stripe Connect onboarding for providers.
- Providers manage their own availability and services through portal.
- Platform takes a configurable percentage of each transaction as revenue.
- BullMQ requires Redis instance.
- Push notification services (FCM/APNs) set up.
- Map service uses Mapbox or Google Maps.

---

*End of specification.*