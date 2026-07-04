# Planity Clone Product Specification

## 1. Introduction
Planity Clone is a mobile-first (iOS, Android) and responsive web platform that connects customers with beauty, wellness, and personal care businesses. Customers can discover providers, browse services, book appointments, and manage them. Business owners can manage their staff, services, calendars, and client interactions. An admin dashboard oversees the platform, and background jobs handle async tasks like reminders and slot recomputation.

**Target audience:** end-users seeking beauty/wellness services, independent professionals and salon chains, platform administrators.

**Priority legend:**
- P0: Must-have for launch
- P1: High value, included in initial release
- P2: Nice to have, post-launch

## 2. Shared Types & Design System (P0)
### Shared Types
All modules rely on a common domain model:
- **User**: id, email, phone, role (customer | provider | admin), profile fields
- **Business**: id, name, description, address, geo coordinates, photos, operating hours, ownerId
- **Service**: id, businessId, name, duration, price, category, description, active flag
- **Staff**: id, businessId, name, title, serviceIds (which services they perform)
- **Appointment**: id, customerId, businessId, staffId, serviceId, startTime, endTime, status (scheduled | confirmed | cancelled | completed | no-show), price, paymentStatus
- **Review**: id, appointmentId, customerId, businessId, rating (1-5), comment, createdAt
- **Favorite**: id, userId, businessId, createdAt

### Design System
A token-based design system ensures consistency across mobile and web:
- Colors: primary #FF6B6B (coral), secondary #4ECDC4, neutral grays, semantic colors (success, error, warning)
- Typography: Inter font family, scale of 12/14/16/18/20/24/32px
- Spacing: 4px base unit (4,8,12,16,24,32,48)
- Components: Button (primary, secondary, outline), Input, Card, Badge, Modal, BottomSheet, Tabs, StarRating, Avatar
- All components documented in Storybook/Figma, with accessibility labels.

**Acceptance Criteria:**
- The shared types are used across all microservices/frontend apps.
- Design tokens are exported as JSON/CSS and consumed by the UI.
- Every component passes WCAG 2.1 AA accessibility checks.

## 3. User Authentication (P0)
**Description:** Secure sign-up, login, and session management for customers, providers, and admins.
- Email + password registration with validation.
- Social login (Google, Apple, Facebook).
- Phone OTP verification (optional but encouraged).
- Role selection during sign-up (customer default).
- JWT-based authentication with refresh tokens.
- Password reset flow.
- Session persistence across app restarts.

**Acceptance Criteria:**
- User can sign up with email, verify email, and log in.
- Social login works and links to existing account if email matches.
- OTP sent to phone, expires in 5 minutes.
- After login, user sees appropriate dashboard based on role.
- Token refresh happens silently; no 401 during active use.
- Password reset sends email with time-limited link (15 min).
- Error messages are user-friendly (e.g., "Email already registered").

## 4. Guest Browse & Explore (P0)
**Description:** Unauthenticated users can browse businesses, search, view details, but cannot book. Prompts to sign up appear before booking.

**Acceptance Criteria:**
- Guest can see landing page with featured businesses/categories.
- Search and filter works without login.
- Business detail page accessible, but "Book" button shows login modal.
- No personalization (favorites, history) until login.
- Clear call-to-action to create account.

## 5. Business Search & Discovery (P0)
**Description:** Full-text search, category filters, location-based sorting, and curated collections.

- Search bar with autocomplete for business names, services, categories.
- Filters: category (hair, nails, spa, etc.), price range, rating, availability today/this week, distance, amenities.
- Sort by: relevance, rating, distance, price low-high, availability.
- Results displayed as cards with photo, name, rating, distance, price indicator.

**Acceptance Criteria:**
- Search returns results within 500ms.
- Autocomplete suggests businesses and services as user types.
- Filters are combinable, and count updates dynamically.
- Location permission requested; if denied, user can manually enter location.
- Distance sorting uses geolocation.
- Empty states show helpful suggestions.
- Pagination (infinite scroll) loads 20 results per page.

## 6. Map-based Search (P1)
**Description:** Interactive map (Mapbox/Google Maps) displaying business locations as pins. Supports pan, zoom, and tap to see preview.

**Acceptance Criteria:**
- Map view toggle on search results.
- Pins show business name, rating, and primary photo in a popup.
- Tapping pin opens business detail.
- Map centers on user’s location or searched area.
- Filtering updates map pins dynamically.
- Clustering when many pins (e.g., >50).
- Performance: 60fps during pan.

## 7. Business Detail View (P0)
**Description:** Comprehensive profile for a business:
- Hero image carousel
- Name, rating, review count, distance, address, operating hours, "Open now" status
- Staff list with photos and specialization
- Service list grouped by category, with duration and price
- Reviews summary and recent reviews
- "Favorite" button (heart)
- Book button

**Acceptance Criteria:**
- All information loads within 1.5 seconds.
- Operating hours reflect today's status; "Closed" if outside hours.
- Staff list shows only active staff and their services.
- Service list respects active flag; out-of-stock services grayed out.
- Reviews paginated, sortable by newest/highest.
- Deep-link to specific service or staff.

## 8. Service Categories (P0)
**Description:** A browseable taxonomy of service categories, enabling discovery.
- Top-level categories: Hair, Nails, Spa & Massage, Skin Care, Barbershop, Makeup, Wellness, Fitness.
- Subcategories (e.g., Hair > Women's Haircut, Men's Haircut, Coloring, Styling).
- Category icons and images.
- Each category page shows top businesses/services.

**Acceptance Criteria:**
- Categories are managed from admin dashboard (add/edit/hide).
- Category page shows businesses tagged with that category.
- Breadcrumb navigation (e.g., Home > Hair > Coloring).
- Search results can be filtered by category.
- Category metadata is cached for fast loading.

## 9. Availability & Slot Computation (P0)
**Description:** Core engine that computes available time slots based on staff schedules, service durations, existing bookings, and business hours. This is a background job when triggered by changes, and cached for quick retrieval.

- Business sets working hours (recurring weekly, plus special dates/holidays).
- Staff have working hours within business hours.
- Staff assigned to services.
- Slot generation: given a service, staff, and date, return available start times.
- Buffer time between appointments configurable.
- Real-time availability check before booking confirmation.

**Acceptance Criteria:**
- Slot computation returns accurate results considering all constraints.
- Typical response time <200ms for a single day/staff.
- When an appointment is booked/cancelled, affected slots are recomputed asynchronously via BullMQ job.
- Caching layer (Redis) invalidated after recomputation.
- Overlapping bookings are prevented by a pessimistic lock on the staff's calendar during booking.
- Support for multi-day services (e.g., a package over multiple days) – out of MVP scope but model accommodates.

## 10. Booking Flow (P0)
**Description:** Step-by-step wizard to book an appointment.

1. Select service (from business detail or direct link)
2. Select staff (optional auto-assign, or show only staff who perform service)
3. Choose date and available time slot (calendar with times)
4. Review summary (business, staff, service, date, time, price)
5. Payment (if required) or confirm free booking
6. Confirmation screen with appointment details and option to add to calendar

**Acceptance Criteria:**
- User can change previous steps without losing progress.
- Time slots shown only for the selected staff/service.
- If staff not selected, show combined slots for all eligible staff.
- Real-time availability check on final confirmation to avoid double-booking.
- Payment step integrated with Stripe (card, Apple Pay, Google Pay). See Payment Integration.
- Booking confirmation triggers push notification to user and provider.
- Appointment appears in "My Appointments" immediately.

## 11. Payment Integration (P0)
**Description:** Secure payment processing via Stripe. Support for prepayment (full or deposit) and pay-at-venue.

- Providers can set payment policy: pay online (full/deposit), pay at venue, or free.
- Customer adds card details or uses Apple/Google Pay.
- 3D Secure authentication.
- Payment success/failure handling.
- Refund capability (full/partial) from provider portal and admin.
- Payment receipts by email.

**Acceptance Criteria:**
- PCI-DSS compliant (Stripe Elements/SDK).
- Card details never touch our servers.
- Payment completes within 10 seconds.
- Failed payments show clear error and allow retry.
- Booking is confirmed only after successful payment (if prepayment required).
- Refunds processed within 24 hours; status synced.
- Webhook handling for Stripe events (charge.succeeded, refunded, etc.).

## 12. Appointment Management (P0)
**Description:** Users can view, reschedule, cancel, and rate their appointments.

- "My Appointments" list with upcoming and past tabs.
- Detailed view with business info, staff, service, date/time, status, payment status.
- Reschedule: only future appointments, follow same booking flow but pre-filled. Must respect provider's cancellation policy (e.g., 24h notice).
- Cancel: confirm dialog, apply cancellation fee if policy broken.
- Add to calendar (Google/Apple/Outlook) via .ics file.
- Rate & review after appointment completed.

**Acceptance Criteria:**
- List sorted by date ascending; past appointments have distinct visual style.
- Reschedule shows availability for the same service/staff, pre-loads current date.
- Cancellation fee is clearly communicated.
- After reschedule/cancel, notifications sent to provider.
- Rating prompt appears 1 hour after appointment end time.
- All actions logged for audit.

## 13. Favorites (P1)
**Description:** Users can save businesses to a favorites list for quick access.

- Heart icon on business cards and detail page.
- Toggle to add/remove.
- "Favorites" tab in user profile.
- Sync across devices.

**Acceptance Criteria:**
- Adding/removing favorites updates instantly with optimistic UI.
- Login required to favorite.
- Favorites list shows business name, rating, and "Book" button.
- Sorted by recently added.
- Empty state encourages exploring.

## 14. User Profile (P1)
**Description:** Manage personal information, notification preferences, and linked accounts.

- Profile photo, name, email, phone, date of birth.
- Edit and save.
- Notification settings: push, email, SMS (toggle per type: booking confirmations, reminders, promotions).
- Password change.
- Linked social accounts management.
- Delete account (right to be forgotten).

**Acceptance Criteria:**
- Changes saved with validation.
- Email/phone updates require verification.
- Notification toggles take effect immediately.
- Account deletion soft-deletes data and anonymizes personal info after 30 days.

## 15. Reviews & Ratings (P1)
**Description:** After an appointment, customers can rate and review the business. Reviews aggregated and displayed on business detail.

- Star rating 1-5, optional comment, photo upload (optional).
- Moderation queue for providers/admins to report inappropriate content.
- Business rating average and total count shown.
- Provider can respond publicly to reviews.

**Acceptance Criteria:**
- Only verified appointments can be reviewed (one review per appointment).
- Review can be submitted within 30 days of appointment.
- Photos resized and compressed to max 5MB.
- Average rating recalculated asynchronously after new review.
- Provider response is displayed below the review.
- Reviews with offensive language flagged by automated filter; admin can approve/reject.

## 16. Notifications (P0)
**Description:** Real-time and scheduled notifications for users and providers.

- Push notifications (Firebase Cloud Messaging for mobile, web push for browser).
- Email notifications via SendGrid/SES.
- SMS (optional) via Twilio.
- Types: booking confirmation, reminder (24h before, 1h before), reschedule, cancellation, new review, promotion.
- In-app notification center with read/unread status.

**Acceptance Criteria:**
- Push notification delivered within 5 seconds of event.
- Email delivered within 1 minute.
- Notification preferences respected.
- Deep links in notifications open relevant screen (e.g., appointment detail).
- Reminder jobs scheduled via BullMQ delayed jobs.
- Rate limiting to avoid spam.

## 17. Provider / Business Owner Portal (P0)
**Description:** Web dashboard for business owners to manage their profile, services, staff, calendar, and clients.

- Dashboard with KPIs: upcoming appointments, revenue (today/week/month), new clients.
- Business profile editor (info, hours, location, photos).
- Service management: CRUD services, reorder, enable/disable.
- Staff management: CRUD staff, assign services, set working hours, block dates.
- Calendar view (day/week): see all appointments, drag to reschedule, click to detail, color-coded by staff.
- Client management: list of clients with appointment history.
- Appointment actions: confirm, cancel, mark no-show, complete.
- Payment management: view transactions, initiate refund.
- Review moderation: view and respond to reviews.
- Notification settings for provider.

**Acceptance Criteria:**
- Owner registration requires business verification (admin approval).
- Calendar updates are reflected in slot computation within 1 minute.
- Rescheduling via drag-and-drop triggers availability check and updates client.
- Revenue dashboard calculated from completed appointments.
- All actions are logged.
- Mobile-responsive design for on-the-go management.

## 18. Admin Dashboard (P0)
**Description:** Super admin panel to manage platform, users, businesses, and monitor operations.

- User management: list, search, suspend, verify.
- Business management: approve/reject, edit, suspend, view analytics.
- Category management: CRUD categories and subcategories.
- Review moderation: approve/reject flagged reviews.
- Transaction monitoring: list payments, refunds, disputes.
- System configuration: commission rates, cancellation policies, buffer times, etc.
- Analytics: total bookings, revenue, user growth, popular businesses/services.
- Audit logs.

**Acceptance Criteria:**
- Admin login requires MFA (TOTP).
- Role-based access control (super admin, support).
- Bulk actions (suspend multiple users).
- Dashboard loads within 2 seconds.
- All changes are audited.
- Export functionality for reports (CSV).

## 19. Background Jobs (BullMQ) (P0)
**Description:** Use BullMQ (Redis-based) for asynchronous and scheduled tasks.

- Slot recomputation on booking/cancellation.
- Notification sending (reminders, confirmations).
- Payment webhook processing.
- Review average recalculation.
- Data cleanup (anonymize deleted accounts).
- Scheduled jobs for daily reports.

**Acceptance Criteria:**
- Jobs are idempotent (can be retried safely).
- Failed jobs are retried with exponential backoff, max 3 attempts.
- Dead letter queue for unprocessable jobs with admin alert.
- Job processing time <1 second for simple tasks (notification).
- Redis persistence configured.
- Monitoring dashboard for queue health.

## 20. Non-functional Requirements
- Performance: API response <200ms p95, search <500ms, page load <2s.
- Scalability: horizontal scaling, stateless services, CDN for images.
- Security: HTTPS, input validation, rate limiting, OWASP top 10 protection.
- Accessibility: WCAG 2.1 AA.
- Offline support: service worker cache for static assets, graceful degradation.
- Localization: ready for multi-language (i18n keys).

## 21. Acceptance Criteria Summary
All features must pass the defined acceptance criteria. The MVP (P0) must deliver a seamless booking experience: guest browse, search, business detail, booking with payment, appointment management, provider portal, and admin dashboard. P1 features (map search, favorites, profile, reviews) enhance engagement and should be included in the first full release. Background jobs are integral to keep everything running smoothly.

**End of document.**