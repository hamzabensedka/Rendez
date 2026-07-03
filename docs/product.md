# Planity Clone Product Specification

## Document Overview
This document outlines the complete feature set, acceptance criteria, and priorities for the Planity Clone – a mobile-first platform connecting customers with local service businesses (beauty, wellness, fitness, etc.) for appointment booking. All features are prioritized using MoSCoW (Must-have: P0, Should-have: P1, Could-have: P2, Won't-have now: P3) to align development sprints with user and business value.

## 1. Shared Types & Design System
### 1.1 Core Data Models (Shared Types)
- **User**: id, role (customer/provider/admin), profile fields, auth credentials.
- **Business**: id, name, description, category, location (geopoint), address, photos, contact, ownerId.
- **Service**: id, businessId, name, duration, price, categoryId, description, active status.
- **Staff**: id, businessId, userId (provider), services[], schedule.
- **Slot**: date, startTime, endTime, staffId, status (available/booked/blocked).
- **Appointment**: id, customerId, businessId, serviceId, staffId, slot date/time, status (pending/confirmed/cancelled/completed), payment info.
- **Review**: id, appointmentId, authorId, rating, text, createdAt.
- **Notification**: id, userId, type, title, body, read, data payload, createdAt.

### 1.2 Design System
- **Colors**: Primary (#FF6B6B, energetic coral), secondary, neutral palette.
- **Typography**: System fonts (San Francisco, Roboto), sizes for headers (24/20/16) and body (14/12).
- **Spacing**: 4-point grid (4,8,12,16,24,32,48).
- **Components**: Button (primary, secondary, outline), Card, ListItem, SearchBar, TabBar, DatePicker, TimeSlotChip, RatingStars, EmptyState, Loader, Toast.
- **Icons**: Custom SVG set for categories, navigation, actions.

### Priority: P0 (foundational, enabling all features).

## 2. User Authentication
### Description
Secure email/password and social sign-up/login. Role selection (customer vs. provider) during onboarding. Session persistence, password reset, and profile setup.

### Acceptance Criteria
- [ ] AC1: User can register with email, password, full name, and role choice (customer or provider).
- [ ] AC2: Social login via Google and Apple ID (P0), Facebook (P1).
- [ ] AC3: Email verification required before full access (P1).
- [ ] AC4: Login returns JWT tokens (access + refresh), stored securely on device.
- [ ] AC5: Logout clears session and navigates to login screen.
- [ ] AC6: Forgot password flow sends reset email; link allows password change within 1 hour.
- [ ] AC7: On launch, app checks token validity; if valid, auto-navigate to home.
- [ ] AC8: If refresh token expired, user is redirected to login with relevant message.
- [ ] AC9: Role-based UI: provider users land on Provider Portal; customers on Customer Home.

### Priority: P0 (must-have, gateway to app).

## 3. Guest Browse & Explore
### Description
Unlogged users can explore businesses, services, and reviews to understand platform value before signing up.

### Acceptance Criteria
- [ ] AC1: Guest can view home feed with top-rated businesses, categories, and promotional banners.
- [ ] AC2: Guest can search businesses by name/text, apply filters (category, rating, location), view results.
- [ ] AC3: Business detail page (name, photos, services, reviews) fully visible, but “Book Now” triggers login/signup screen.
- [ ] AC4: Map view accessible; results mapped with pins, tapping pin shows business card.
- [ ] AC5: No favorites, booking, or personalization actions allowed.
- [ ] AC6: Persistent CTA (banner, button) encourages authentication.

### Priority: P1 (high business value, conversion).

## 4. Business Search & Discovery
### Description
Powerful search with autocomplete, filters (category, rating, price range, distance), and sort (relevance, rating, distance, price). Results displayed as list/grid.

### Acceptance Criteria
- [ ] AC1: Search bar on home screen with placeholder, accepts business name or service keyword.
- [ ] AC2: Autocomplete suggestions as user types (minimum 2 chars), sourced from business names and service categories (debounced 300ms).
- [ ] AC3: Filter panel: Category (multiselect chips), Rating (minimum 4, 3, 2 stars), Price range (slider), Distance (slider or 1/5/10/20 km), Open Now toggle.
- [ ] AC4: Sort options: Best Match (default), Highest Rated, Closest, Lowest Price, Most Reviewed.
- [ ] AC5: Results list loads with pagination (infinite scroll, 20 items per page). Each card shows business image, name, rating, distance, next 3 available time slots (if available).
- [ ] AC6: Empty state with illustration and suggestion to adjust filters.
- [ ] AC7: Filter and sort state persisted in URL query params for deep linking.

### Priority: P0 (core discoverability).

## 5. Map-based Search
### Description
Interactive map showing businesses around user’s location with clustering and details on tap.

### Acceptance Criteria
- [ ] AC1: Map view accessible via toggle (list/map) on search results.
- [ ] AC2: Map centers to user’s current location (request permission) with fallback to city center.
- [ ] AC3: Business pins displayed. When many markers close, they cluster (supercluster algorithm).
- [ ] AC4: Tapping pin shows a bottom sheet with business name, photo, rating, distance, “View Details” CTA.
- [ ] AC5: Search bar overlays map; results update pins dynamically as filters change.
- [ ] AC6: Map supports pan/zoom, loaded tiles use offline caching.

### Priority: P1 (differentiator, especially for location-based discovery).

## 6. Business Detail View
### Description
Rich screen for a single business, aggregating all relevant info for booking decision.

### Acceptance Criteria
- [ ] AC1: Header with business photo gallery (swipeable, up to 10 images), name, address, rating, distance, favorite button.
- [ ] AC2: Section: About (description, amenities, certifications).
- [ ] AC3: Section: Services – grouped by category, each service shows name, duration, price, “Book” button. If service has multiple staff options, expand to staff selection.
- [ ] AC4: Section: Staff (if applicable) – list of providers with photo, specialty, next available slot.
- [ ] AC5: Section: Reviews – average rating, rating distribution histogram, review list (load more 10 at a time).
- [ ] AC6: Sticky bottom bar: “Book Now” button (if user logged in) which opens booking flow for first available service or leads to service selection.
- [ ] AC7: Share button to generate deep link for business.

### Priority: P0 (critical path to booking).

## 7. Service Categories
### Description
Hierarchical category system to organize businesses and services. Allows top-level categories on home screen.

### Acceptance Criteria
- [ ] AC1: Top-level categories (Hair, Nails, Massage, Facials, Yoga, Personal Training, Barber, etc.) displayed as grid of icons+names on home screen.
- [ ] AC2: Tapping a category navigates to a filtered business search where category is pre-selected.
- [ ] AC3: Subcategories (e.g., Hair > Haircut, Coloring, Styling) available for fine-grained filtering; implemented via tags on services.
- [ ] AC4: Business creation (Provider Portal) maps services to multiple categories/tags.
- [ ] AC5: Admins can manage category list and icons via Admin Dashboard (P1).

### Priority: P0 (essential for navigation).

## 8. Booking Flow
### Description
Guided multi-step flow to book an appointment, minimizing drop-off. Steps: Service selection → Staff (optional) → Date/Time slot → Review & Confirm → Payment → Confirmation.

### Acceptance Criteria
- [ ] AC1: Flow triggered from “Book” on service card or “Book Now” from business detail. Pre-fill if possible.
- [ ] AC2: Step 1 – Service: list of services; user picks one. If service requires staff selection, proceed to staff picker.
- [ ] AC3: Step 2 – Staff (if business has multiple): shows staff profiles with availability badge; user can skip and let system auto-assign (flag “Any” preferred).
- [ ] AC4: Step 3 – Date/Time: calendar view showing available days highlighted; tapping a day shows time slots (30/60 min blocks based on service duration). Slots fetched from backend availability engine. Only slots long enough for service duration shown.
- [ ] AC5: Step 4 – Review: shows business, service, staff, date, time, duration, price (including add-ons if any), total. Option to add special requests (text field, P1).
- [ ] AC6: Step 5 – Payment: if service is paid (price > 0), trigger payment integration (Stripe). User can pay now and confirm booking; or if business allows pay-later, booking confirms without payment.
- [ ] AC7: Step 6 – Confirmation: success screen with appointment summary, calendar add option, share link.
- [ ] AC8: Back navigation enabled at each step, with data preserved. On payment step, going back won’t double charge.
- [ ] AC9: If payment fails, show error and allow retry (max 3 attempts). Booking not confirmed until payment succeeds.

### Priority: P0 (core transaction).

## 9. Appointment Management
### Description
Users can view upcoming, past, and cancelled appointments, make changes (reschedule, cancel) within policies.

### Acceptance Criteria
- [ ] AC1: “My Appointments” section on profile/home with tabs: Upcoming, Past, Cancelled.
- [ ] AC2: Upcoming list sorted by date soonest first. Each card shows business, service, date/time, staff, status, and actionable buttons (Reschedule, Cancel, Add to Calendar).
- [ ] AC3: Reschedule: re-enters booking flow pre-filled with existing service/staff; only valid future slots shown. Old appointment cancelled only after new confirmed.
- [ ] AC4: Cancel: asks for reason (optional), confirmation dialog. Cancellation must respect business policy (e.g., 24h free, otherwise charge). Business sets policy in portal.
- [ ] AC5: Past appointments: rating CTA “Leave a Review” prompts review flow. If already reviewed, show review.
- [ ] AC6: Appointment status changes trigger push notification (confirm, reminder, cancel).
- [ ] AC7: Cancel and reschedule actions update availability in real-time, releasing/re-acquiring slots via background job.

### Priority: P0 (fundamental post-booking experience).

## 10. Favorites
### Description
User can save businesses to a favorites list for quick access and receive updates (new services, promotions – P2).

### Acceptance Criteria
- [ ] AC1: Heart icon on business card and detail page. Tap toggles favorite state.
- [ ] AC2: “Favorites” tab on home screen or profile shows list of favorited businesses, ordered by most recently added.
- [ ] AC3: Unfavoriting removes from list with undo option (toast) for 5 seconds.
- [ ] AC4: Favorites synced across user’s devices (cloud-backed).
- [ ] AC5: (P2) Push notification when a favorited business adds a new service or special offer.

### Priority: P1 (enhances engagement).

## 11. User Profile
### Description
Manage personal information, preferences, notification settings, payment methods, and view appointment/transaction history.

### Acceptance Criteria
- [ ] AC1: Profile screen accessible from bottom tab. Sections: Avatar, Name, Email, Phone, Date of Birth (optional), Default payment method.
- [ ] AC2: Edit profile: update name, phone, profile photo (camera/gallery).
- [ ] AC3: Notification settings: toggle push/email for appointment reminders, promotions, etc.
- [ ] AC4: Payment methods: add/remove credit/debit cards via Stripe (tokenized).
- [ ] AC5: Privacy section: download data, delete account (with confirmation, data retention policy).
- [ ] AC6: Link to Appointments, Favorites, Reviews.
- [ ] AC7: Switch to Provider role if user is also a business owner (P1).

### Priority: P0 (essential for account management).

## 12. Availability & Slot Computation
### Description
Backend engine to calculate real-time bookable slots considering business hours, staff schedules, existing appointments, buffer times, and holidays.

### Acceptance Criteria
- [ ] AC1: Business defines weekly schedule per staff (e.g., Mon-Fri 9-17, with breaks 13-14). Configured in Provider Portal.
- [ ] AC2: Service duration defines required slot length. Engine rounds up to nearest 15-min block for simplicity, but actual start times are on the hour/half-hour.
- [ ] AC3: Buffer before/after service (configurable, default 15 min) blocks adjacent slots.
- [ ] AC4: Overlapping appointments prevented via transactional DB locks.
- [ ] AC5: Slot availability exposed via API: GET /slots?businessId=&serviceId=&staffId=&date range. Returns list of start times with staff availability.
- [ ] AC6: Engine handles staff-specific calendars, holidays (blocked days), and per-staff max appointments per day.
- [ ] AC7: Real-time recalculation on appointment creation, cancellation, reschedule using background jobs (BullMQ) for consistency and to notify affected users (P1).
- [ ] AC8: Performance: slot query must respond < 500ms for up to 50 staff, 30-day window. Caching layer (Redis) with invalidation on changes.

### Priority: P0 (foundation for booking).

## 13. Reviews & Ratings
### Description
After a completed appointment, customer can leave a star rating (1-5) and text review. Reviews are displayed on business detail and used for sorting.

### Acceptance Criteria
- [ ] AC1: 24h after appointment end, user receives push notification “How was your visit?” tapping opens review form.
- [ ] AC2: Review form: star rating tap (1-5), optional text (max 500 chars), optional photo upload (P2).
- [ ] AC3: User can submit only one review per appointment. Edit allowed within 7 days.
- [ ] AC4: Business detail page shows average rating, total reviews, and list view. Reviews sorted by most recent.
- [ ] AC5: Provider can respond to a review (public reply) – P1.
- [ ] AC6: Reviews flagged as inappropriate can be reported; admin review queue (Admin Dashboard P1).
- [ ] AC7: Rating influences search ranking (weighted average with confidence interval).

### Priority: P1 (important for trust).

## 14. Payment Integration
### Description
Secure payment processing via Stripe for booking services upfront or cancellation fees. Support pay-now and pay-later modes per business.

### Acceptance Criteria
- [ ] AC1: Business can set payment policy in Provider Portal: “Pay Online” (required), “Pay at Business” (no online payment), or “Deposit” (partial).
- [ ] AC2: Customer adds payment method (Stripe Elements or native card input) securely; tokens stored server-side.
- [ ] AC3: During booking, if payment required, Stripe PaymentSheet appears with stored cards. User can add new card.
- [ ] AC4: Payment charge is created server-side via Stripe API after booking confirmation, linked to appointment.
- [ ] AC5: For cancellation fees (if business policy charges for late cancel), system automatically processes a charge for the fee amount.
- [ ] AC6: Receipt email sent to customer (via Stripe). Invoice available in appointment details.
- [ ] AC7: Refunds handled manually by admin/provider at this stage (P2 for automated refunds on cancellation).

### Priority: P0 (monetization).

## 15. Notifications
### Description
Push notifications and in-app notification center for appointment confirmations, reminders, cancellations, review requests, and promotional messages.

### Acceptance Criteria
- [ ] AC1: Push notifications using Firebase Cloud Messaging (for both platforms).
- [ ] AC2: Notification types: Booking Confirmed, Appointment Reminder (24h and 1h before), Appointment Cancelled, Review Request, Welcome, Promotional (admin triggered).
- [ ] AC3: In-app notification bell icon with badge count. List view with read/unread state.
- [ ] AC4: Tapping notification deep-links to relevant screen (appointment detail, business, review form).
- [ ] AC5: Notification preferences per type managed in User Profile (toggle on/off).
- [ ] AC6: Background push data payload includes type and resource ID.
- [ ] AC7: Delivery handled reliably via BullMQ for batching and retry (P1).

### Priority: P0 (engagement and retention).

## 16. Provider / Business Owner Portal
### Description
Separate interface (within app or web) for business owners to manage their listing, services, staff, schedule, appointments, and view insights.

### Acceptance Criteria
- [ ] AC1: Provider sign-up (via the same auth, but role=provider) leads to onboarding wizard: business name, address, category, logo, description, contact.
- [ ] AC2: Dashboard home showing today’s appointments (list and calendar view), upcoming bookings, recent revenue, quick actions.
- [ ] AC3: Appointment management: view list, filter by date/staff, update status (confirm, cancel, no-show, complete). Cancel triggers customer notification and slot release.
- [ ] AC4: Staff management: invite staff members via email (they receive link to set password and complete profile), define services they perform, set their working schedule (weekly template + overrides for specific dates).
- [ ] AC5: Service management: CRUD for services, including name, description, price, duration, category tags, active flag, buffer time, and payment policy.
- [ ] AC6: Business profile editing: update description, photos (gallery), location, amenities, social links.
- [ ] AC7: Calendar: combined view of all staff appointments with drag-and-drop reschedule capability (P2).
- [ ] AC8: Insights: basic stats (appointments count, revenue, popular services, average rating) over selectable date range.
- [ ] AC9: Notifications: provider receives push for new booking, cancellation, and review, with in-app bell.
- [ ] AC10: Settings: business hours, holiday blackout dates, cancellation policy (free cancel window, late fee), payment preference.

### Priority: P0 (supply side, must be present for platform).

## 17. Admin Dashboard
### Description
Web-based dashboard for platform administrators to monitor and manage all entities, handle disputes, and configure global settings.

### Acceptance Criteria
- [ ] AC1: Secure login for admin role (not via consumer app). Role-based access control for sub-admins (P2).
- [ ] AC2: Dashboard overview: total users (customers/providers), total businesses, appointments today, revenue share, growth metrics.
- [ ] AC3: User management: search/list users, view details, suspend/activate accounts, view appointment history.
- [ ] AC4: Business management: approve new businesses (if manual approval required), suspend, verify, edit details, access provider portal impersonation (P2).
- [ ] AC5: Appointment management: view all appointments, filter, override status, handle disputes (refund authorization).
- [ ] AC6: Content management: manage service categories (add/edit/disable, icons), promotional banners, push notification campaigns.
- [ ] AC7: Review moderation: queue for reported reviews, ability to delete/approve.
- [ ] AC8: System config: platform fee percentage, supported regions, tax settings.
- [ ] AC9: Audit log of critical actions (suspensions, refunds, config changes).

### Priority: P1 (needed for operations, but initial version can use direct DB management).

## 18. Background Jobs (BullMQ)
### Description
Asynchronous processing for non-critical but essential tasks: sending notifications, recalculating availability, cleaning expired tokens, generating reports.

### Acceptance Criteria
- [ ] AC1: Queue for notification dispatching (push notifications, emails). Consumer fetches from queue, calls FCM/SMTP, handles retries and logging.
- [ ] AC2: Slot recalculation job triggered on appointment create/cancel/reschedule to update cached slot data and notify any customer who was waitlisted (P2).
- [ ] AC3: Daily job to send appointment reminders (24h and 1h) by scanning upcoming appointments.
- [ ] AC4: Weekly job for generating and emailing provider insights summary.
- [ ] AC5: Job to clear expired JWT refresh tokens and password reset tokens.
- [ ] AC6: Dashboard (Admin) shows queue health, failed jobs, and allows manual retry.
- [ ] AC7: All jobs are idempotent and have reasonable concurrency.

### Priority: P0 for core notification and slot consistency; P1 for reporting queues.

## Prioritization Summary
**P0 (Must-have for MVP):**
- Shared Types & Design System
- User Authentication
- Business Search & Discovery
- Business Detail View
- Service Categories
- Booking Flow
- Appointment Management
- User Profile
- Availability & Slot Computation
- Payment Integration
- Notifications (basic)
- Provider Portal
- Background Jobs (notification, slot sync)

**P1 (Should-have for launch):**
- Guest Browse & Explore
- Map-based Search
- Favorites
- Reviews & Ratings
- Admin Dashboard
- Enhanced Notifications (promotional, in-app center)
- Background Jobs (reminders, reports)

**P2 (Could-have in later iterations):**
- Social login Facebook
- Staff/calendar drag-drop reschedule
- Photo in reviews
- Automated refunds
- Waitlist feature
- Provider impersonation
- Deep linking analytics

**P3 (Out of current scope):**
- Loyalty programs
- AI recommendations
- Multilingual support
- Third-party calendar sync (Google/Outlook)

---
This specification serves as the single source of truth for development teams and stakeholders, ensuring alignment on what to build, why, and in what order.