# Planity Clone Product Specification

## 1. Introduction
Planity Clone is a mobile-first platform for discovering and booking beauty and wellness services. This specification outlines the complete feature set, acceptance criteria, and priorities for the MVP and subsequent releases. The system consists of:
- Customer mobile apps (iOS/Android)
- Provider web portal
- Admin dashboard
- Backend API and background workers

Priorities: P0 – must-have for MVP, P1 – important for launch, P2 – future enhancement.

## 2. Target Users
- **Customers**: individuals seeking to discover, book, and manage appointments.
- **Providers**: business owners who manage services, staff, schedules, and bookings.
- **Admins**: platform operators overseeing businesses, users, and system health.

## 3. Feature Specifications

### 3.1 Shared Types & Design System (P0)
**Description:** Define a unified set of TypeScript interfaces, reusable UI components, and design tokens to ensure consistency across all applications.

**Acceptance Criteria:**
- Create shared type definitions: User, Business, Service, Staff, Booking, Slot, Review, Category, etc.
- Design system with color palette, typography (headings, body), spacing scale, border-radius, shadows.
- Reusable components: Button (primary, secondary, ghost), Input (with validation styles), Card, Modal, BottomSheet, MapView wrapper, Avatar, Badge, EmptyState, LoadingSpinner.
- All features MUST use shared types and components; no ad-hoc styling.
- Documented in a Storybook or similar reference.

### 3.2 User Authentication (P0)
**Description:** Secure sign-up, login, social authentication, and session management for three roles: customer, provider, admin.

**AC:**
- Registration via email/password with real-time validation (email format, password ≥ 8 chars, one uppercase, one digit).
- Email verification: send verification link; account not active until verified.
- Login with email/password; “Remember me” persists session.
- Social login: Google, Apple; account linking if email matches existing account.
- JWT-based authentication with access token (15 min) and refresh token (7 days).
- Forgot password flow: enter email → receive reset link → set new password.
- Secure logout clears tokens; session persists across app restarts using secure storage.
- Role-based redirection post-login: customer → home, provider → portal, admin → dashboard.
- Error handling: network failures, invalid credentials, locked accounts.

### 3.3 Guest Browse & Explore (P0)
**Description:** Allow unauthenticated users to explore businesses and services, with seamless conversion to sign-up when attempting to book.

**AC:**
- Guest sees home screen with featured businesses and categories.
- Can search businesses and view detail pages (all info except hidden contact details).
- “Book” button triggers sign-up/login modal; after successful auth, user lands back on booking flow for the same service/time slot (deep link).
- No access to favorites, booking history, or profile without authentication.
- Session not created for guest; search state preserved in URL/params.

### 3.4 Business Search & Discovery (P0)
**Description:** Text-based search with autocomplete, filters, sorting, and infinite scroll.

**AC:**
- Search bar on home and dedicated search screen; show auto-suggestions (business names, service names, categories).
- Results list: each business card shows cover photo, name, average rating, distance, primary category, and favorite heart.
- Filters: location (city, postal code), category (multi-select), price range, minimum rating, availability (today, tomorrow, this week).
- Sorting: relevance, distance, rating (high to low), most reviewed.
- Empty state with illustration and suggestion to broaden filters.
- Pagination via infinite scroll (API returns cursor).
- Search history stored locally (cleared on logout).
- Fuzzy matching tolerated (P2).

### 3.5 Map-based Search (P1)
**Description:** Interactive map displaying business locations with clustering and integration with text search.

**AC:**
- Map view toggle on search results; map defaults to user’s current location (if permission granted) or city center.
- Business pins color-coded by category; tap pin shows mini card with name, rating, distance; tap again navigates to detail.
- Clustering for dense areas, with cluster count.
- Filter button overlay updates both map pins and list.
- Moving map triggers “Search this area” button (P1 – manual, not automatic to avoid excessive API calls).
- User can set location manually via search in map view.

### 3.6 Service Categories (P0)
**Description:** Hierarchical taxonomy for services enabling discovery.

**AC:**
- Homepage displays grid of top-level categories (e.g., Hair, Nails, Massage, Facial, Makeup, Barber) with illustrative icons.
- Tapping a category navigates to a subcategory list (if any) or directly to business results filtered by that category.
- Business results: businesses offering services in that category, sorted by relevance.
- Admin can manage categories (add, edit, deactivate, image) via admin dashboard.
- Providers assign services to categories during service creation.

### 3.7 Business Detail View (P0)
**Description:** Comprehensive business profile with key information, services, reviews, gallery, and a prominent booking call-to-action.

**AC:**
- Header: cover image, business name, star rating (and count), distance, favorite toggle.
- Sections (tabs or scroll):
  - **About**: description, address with static map thumbnail (tap to open maps), phone (tap to call), website link, opening hours (today highlighted, indicator for “open now”).
  - **Services**: list of services with name, duration, price, short description; each has “Book” button.
  - **Reviews**: summary bar (average and distribution), individual reviews with pagination.
  - **Gallery**: grid of photos, tap to open lightbox.
- Sticky bottom bar with “Book” button always visible.
- Share button copies business link.
- Performance: lazy load review list and gallery; skeleton screens.

### 3.8 Booking Flow (P0)
**Description:** Step-by-step reservation process from service selection to confirmation, with payment if required.

**AC:**
- Flow steps: Service → Staff (optional) → Date & Time → Your Details (if guest) → Payment (if applicable) → Confirmation.
- Step 1: Service selection (pre-filled if coming from service card).
- Step 2: Staff member picker (skip if single staff), showing photo, name, rating.
- Step 3: Interactive calendar with available dates highlighted (grayed-out for closed days); selecting date loads time slots. Slots are shown as selectable buttons (e.g., 10:00, 10:15…). Already booked slots disabled.
- Step 4: Confirm selected service, staff, date, time; option to add special requests (max 250 chars). If user not logged in, prompted to sign in (return to same step).
- Step 5: Payment step (if business requires prepayment or deposit). Show order summary and payment method selector (saved cards, new card, digital wallet).
- Step 6: Review and confirm; button with final price. On submit, validate slot still available (optimistic concurrency check), create booking. Show success screen with booking ID, date/time, business, ability to add to calendar (iCal/Google).
- Clear back navigation until payment/confirmation; after confirmation, back exits flow.
- Error handling: slot no longer available → show message and return to time selection; payment failure → retry option.

### 3.9 Appointment Management (P0)
**Description:** Users can view, manage, and review their upcoming and past appointments.

**AC:**
- “My Appointments” tab with segmented control: Upcoming / Past.
- Upcoming list: each card shows business name, service, date, time, staff, status (Confirmed, Pending, Rescheduled).
- Actions: Reschedule (reopens flow with pre-filled data starting at date/time step; only future slots), Cancel (with confirmation dialog, reason optional).
- Cancellation policy: free until X hours before (set by provider). Past deadline may charge fee; UI warns user.
- Past list: same info, plus “Leave a Review” button if not already reviewed.
- Order detail view: full booking info, receipt, rebook button.
- Pull-to-refresh; real-time updates on status changes via silent push.

### 3.10 Favorites (P1)
**Description:** Users can bookmark favorite businesses for quick access.

**AC:**
- Heart icon on business cards and detail page; toggle immediate.
- Favorites list accessible from profile/home tab; shows saved businesses with thumbnail, name, rating.
- Quick actions: book, remove from favorites (with undo toast).
- List synced across devices via backend.

### 3.11 User Profile (P1)
**Description:** Manage personal information, payment methods, notification preferences, and account settings.

**AC:**
- View/edit profile: name, email (requires re-verification if changed), phone number, profile photo (camera/gallery).
- Change password (old password, new, confirm).
- Saved payment methods: list cards (masked), add new, delete, set default.
- Notification preferences: toggle push, email, SMS; category options (booking updates, reminders, promotions).
- Language selection (if multi-lang).
- Links: Terms of Service, Privacy Policy, Delete Account (with confirmation).

### 3.12 Availability & Slot Computation (P0)
**Description:** Engine to compute bookable time slots based on business hours, staff schedules, service duration, existing bookings, and buffer times.

**AC:**
- Provider defines regular weekly opening hours (e.g., Mon-Fri 9:00-18:00) with break windows.
- Staff members have individual working hours (subset or same as business) and assigned services.
- Slot calculation algorithm:
  - Input: date, staffId, serviceId (duration), existing bookings.
  - Output: array of start times (rounded to 15-min increments) where the entire service duration fits within working hours, not overlapping breaks or existing bookings.
  - Consider post-appointment buffer (cleanup) configured per service or globally.
  - Respect “booking advance” limits: max days ahead (e.g., 30) and min notice hours (e.g., 2).
- Date-specific overrides (holidays, extended hours) take precedence.
- API endpoint: GET /slots?businessId=&serviceId=&staffId=&date= returns slots with timestamp and isAvailable flag.
- Recalculation triggered on schedule changes or new bookings (via BullMQ job).
- Caching with TTL 5 minutes; invalidated by events.

### 3.13 Reviews & Ratings (P1)
**Description:** Customers can rate and review services after appointment completion.

**AC:**
- After an appointment status changes to “Completed”, user receives push notification and in-app prompt to rate.
- Rating: star selection (1–5), optional text review (min 10 chars if provided, max 500).
- Reviews appear on business detail page with average rating and percentage distribution.
- Sort reviews: most recent, highest, lowest.
- Providers cannot delete reviews but can respond (P2).
- Users can edit or delete their own review within 48 hours.
- Admin can moderate: hide reviews that violate guidelines (flagging system).
- Abuse prevention: one review per booking.

### 3.14 Payment Integration (P0)
**Description:** Secure in-app payment processing for booking deposits/full payments via Stripe.

**AC:**
- Integration with Stripe using PaymentIntent and Stripe Elements / React Native SDK.
- Support credit/debit cards, Apple Pay, Google Pay.
- Customer can add payment method during checkout and save for future use (tokenized).
- Payment flow: capture payment upon booking confirmation (full amount or deposit as configured by provider).
- Handle 3D Secure challenges.
- Booking status changes to “Confirmed” after successful payment; “Failed” if payment error.
- Refund capability: provider/admin can initiate full/partial refund from portal; refund updates booking status to “Refunded”.
- Receipt generated and viewable in appointment detail.
- All payment actions performed server-side to maintain PCI compliance.

### 3.15 Notifications (P1)
**Description:** Transactional and marketing notifications via push, email, and in-app.

**AC:**
- Transactional: booking confirmation, reschedule, cancellation, payment receipt, review request.
- Appointment reminders: 24 hours and 1 hour before appointment (configurable).
- In-app notification center: bell icon with unread badge; list with read/unread states; tap navigates to relevant context (booking, review).
- Push notifications: Firebase Cloud Messaging (FCM) / APNs with silent data for background sync.
- Email notifications via SendGrid or SES with responsive templates.
- Preferences: user can toggle communication channels per category in profile.
- Provider gets real-time notifications for new bookings, cancellations.
- Admin can send broadcast messages (P2).

### 3.16 Provider / Business Owner Portal (P0)
**Description:** Web dashboard for providers to set up their business, manage services, staff, schedules, bookings, and view basic analytics.

**AC:**
- **Business Profile**: edit name, description, address (with map preview), phone, website, photos (upload, reorder), categories.
- **Service Management**: list, add, edit, delete (soft), toggle active; each service has name, description, duration (minutes), price, category, buffer time, picture.
- **Staff Management**: add team members with name, photo, service assignments, working hours (per day of week), breaks. Define role (owner, staff).
- **Calendar View**: weekly/monthly calendar showing all bookings; filter by staff, service; drag-and-drop to reschedule (with client confirmation modal); click slot to add manual booking or block time off. Color-coded by status.
- **Booking Management**: list with filters (status, date, staff); detail with customer info (name, phone, email, notes); actions: confirm (if manual approval), cancel, mark no-show, reschedule, add internal note.
- **Availability Settings**: regular hours, date-specific overrides (holidays, extended hours), global buffer after appointments, max advance booking days, min notice hours.
- **Payment Settings**: toggle prepayment requirement, deposit percentage, cancellation policy (free until X hours before). Connect Stripe account (onboarding).
- **Notifications**: view list of recent notifications; in-app toaster for new bookings.
- **Analytics** (P1/P2): simple charts for bookings count, revenue (if payments enabled), popular services.
- Portal is responsive, accessible via web, authenticated with provider role.

### 3.17 Admin Dashboard (P1)
**Description:** Super admin panel to manage platform entities, moderate content, configure global settings, and monitor system health.

**AC:**
- **Dashboard Overview**: cards for total users, businesses, bookings, revenue; charts for sign-ups and bookings over time.
- **Business Management**: searchable list; approve/reject newly registered businesses (with reason); suspend/activate; edit details; view analytics per business.
- **User Management**: list with search and filter (customer, provider, admin); suspend/ban users; manual role assignment.
- **Review Moderation**: list of reported/flagged reviews; option to hide/unhide; review details.
- **Category Management**: CRUD for service categories and subcategories, set icon, active/inactive.
- **Content Management**: select featured businesses for homepage; manage promo banners.
- **Platform Settings**: global commission/fee percentage, default cancellation policy, supported languages, contact email.
- **Audit Logs**: view actions performed by admins with timestamps.
- **Impersonation**: ability to impersonate a provider for support (with audit log).

### 3.18 Background Jobs (BullMQ) (P0)
**Description:** Asynchronous job processing for reminders, notifications, data maintenance, and slot cache invalidation.

**AC:**
- Queues:
  - `notifications`: send push/email for booking confirmations, reminders, reschedules.
  - `slotsRefresh`: triggered on schedule change or booking to recompute and cache availability for affected days.
  - `scheduledJobs`: daily tasks (e.g., send appointment reminders for tomorrow, clean expired guest sessions, anonymize deleted data).
- Retry with exponential backoff; dead-letter queue for failed jobs after max attempts.
- Admin dashboard shows queue metrics (waiting, active, failed).
- Use Redis as backing store for BullMQ.
- Jobs are idempotent where possible (e.g., deduplicate reminders).

## 4. Non-Functional Requirements
- **Performance**: API response p95 < 200ms; booking flow complete in < 3s (excluding network); map tiles cached offline if possible.
- **Security**: HTTPS only; JWT with short-lived access tokens; input sanitization; rate limiting on auth and booking endpoints; all secrets managed via environment variables; data encryption at rest.
- **Scalability**: Stateless API servers behind load balancer; database read replicas for heavy read paths (search, slots); CDN for images.
- **Accessibility**: Follow WCAG 2.1 AA for web portal; mobile apps support screen readers and dynamic font sizes.
- **Reliability**: Retry logic for external services (Stripe, email); graceful degradation if map or push services unavailable.

## 5. Priority Matrix Summary
| Feature                       | Priority | Notes                                       |
|-------------------------------|----------|---------------------------------------------|
| Shared Types & Design System  | P0       | Foundation for all UI and data contracts    |
| User Authentication           | P0       | Core for personalization and booking        |
| Guest Browse & Explore        | P0       | Acquisition channel, reduces bounce         |
| Business Search & Discovery   | P0       | Primary discovery method                    |
| Map-based Search              | P1       | Enhances local discovery, especially on mobile|
| Service Categories            | P0       | High-level navigation, SEO                  |
| Business Detail View          | P0       | Decision-making page                        |
| Booking Flow                  | P0       | Revenue-critical                             |
| Appointment Management        | P0       | Essential customer tool post-booking        |
| Favorites                     | P1       | Engagement, retention                       |
| User Profile                  | P1       | Personalization, payment methods            |
| Availability & Slot Computation| P0       | Backbone of real-time booking               |
| Reviews & Ratings             | P1       | Social proof, trust                         |
| Payment Integration           | P0       | Monetization, confirmed bookings            |
| Notifications                 | P1       | Reduce no-shows, re-engagement              |
| Provider Portal               | P0       | Supply side, necessary for launches         |
| Admin Dashboard               | P1       | Operational control, can be post-MVP        |
| Background Jobs (BullMQ)      | P0       | Needed for reminders, slot processing       |

---
This specification serves as the single source of truth for the engineering team. All user stories should be decomposed into tasks based on these acceptance criteria.