# Planity Clone Product Specification

## Overview
Planity Clone is a mobile-first and web platform that connects customers with local service providers (e.g., salons, spas, barbers). Users can discover businesses, browse services, book appointments, pay, leave reviews, and manage their profiles. Providers can manage availability, bookings, and their business profile. Administrators oversee the platform through a dashboard. The system uses background jobs (BullMQ) for notifications, reminders, and scheduled tasks.

## Feature Priority Legend
- **P0 (Must Have)**: Core MVP functionality; cannot launch without.
- **P1 (Should Have)**: Important for user engagement and platform integrity.
- **P2 (Could Have)**: Enhancements that improve experience but not critical for launch.
- **P3 (Won't Have Now)**: Nice-to-have for future releases.

---

## 1. User Authentication
**Priority**: P0

### Description
Users can create an account, log in, and maintain a session across both customer and provider roles. Supports email/password and social login.

### User Stories
- As a new user, I want to sign up with email, password, and name so I can access personalized features.
- As a returning user, I want to log in to see my bookings and favorites.
- As a user, I want to reset my password if I forget it.
- As a provider, I want to log into a dedicated portal area.

### Acceptance Criteria
1. Registration form collects name, email, password with client-side validation.
2. Email verification required (link sent; account state remains unverified until confirmed).
3. Login with email/password (also Google/Apple sign-in via OAuth).
4. JWT access token (short-lived) and refresh token (stored in HttpOnly cookie).
5. Password reset flow: request reset -> email with token -> new password submission.
6. Users can switch between customer and provider roles without re-login (role stored in token).
7. Session persists across app closes (refresh token rotation).
8. All API calls authenticated; unauthorized returns 401.

---

## 2. Guest Browse & Explore
**Priority**: P0

### Description
Non-logged-in users can browse businesses, view services, and search without creating an account. Booking and favorites require authentication.

### User Stories
- As a guest, I want to explore salons near me without signing up.
- As a guest, I want to see business details, reviews, and available services.
- As a guest, I am nudged to sign up when I try to book or favorite.

### Acceptance Criteria
1. Public endpoints support browsing, searching, and viewing business details.
2. Guest sees a "Sign up to book" prompt on booking flow.
3. Geolocation is requested to show nearby results; if denied, falls back to city center or manual location input.
4. All filters and sorting work for guests.
5. No sensitive user data exposed.

---

## 3. Business Search & Discovery
**Priority**: P0

### Description
Users search for service providers using keywords, categories, and filters; results can be displayed in list or map view.

### User Stories
- As a user, I want to search for "haircut" and see relevant businesses.
- As a user, I want to filter by rating, distance, price range, and service category.
- As a user, I want to sort by relevance, distance, rating, or popularity.

### Acceptance Criteria
1. Full-text search on business name, description, services, categories.
2. Autocomplete suggestions as user types (debounced 300ms).
3. Filters: category (multi-select), subcategory, rating (min stars), price range (€, €€, €€€), distance radius.
4. Sort options: Relevance, Highest Rated, Nearest, Price Low-High, Price High-Low.
5. Infinite scroll or pagination; results count displayed.
6. Result card shows thumbnail, business name, rating, address, distance, availability indicator (if logged in & favored time).
7. Search query preserved in URL.

---

## 4. Map-based Search
**Priority**: P1

### Description
Interactive map view that displays business locations and allows visual discovery.

### User Stories
- As a user, I want to see businesses on a map so I can choose one near me.
- As a user, I want to move the map to re-search in a new area.

### Acceptance Criteria
1. Map view toggle (list/map) on search results.
2. Map markers with business type icons and clustering at high zoom.
3. Tapping a marker shows a mini card with name, rating, and distance; tap card navigates to detail.
4. Map moves and re-fetches businesses when idle (debounce 500ms after pan/zoom).
5. User location shown with blue dot.
6. Seamless switch between list and map without losing search context.

---

## 5. Business Detail View
**Priority**: P0

### Description
A comprehensive page for a single business showing all information needed to make a booking decision.

### User Stories
- As a user, I want to see photos, description, services, reviews, and staff.
- As a user, I want to check real-time availability before booking.

### Acceptance Criteria
1. Hero image gallery with swipe/arrows; lazy loading.
2. Business name, rating (stars + count), address with map snippet, phone, website (if provided).
3. Description, amenities tags, COVID-19 measures, business hours.
4. Service menu: grouped by category, each service shows name, duration, price, description.
5. Staff section: list of staff members with photo, name, specialty, and next available slot.
6. Reviews tab: paginated reviews with sorting (recent, highest, lowest).
7. Favorites button (heart) to add/remove with animation.
8. "Book" CTA floating button that anchors to service selection.
9. Availability display: select service -> staff (optional) -> shows next few available slots; if many, "see more".
10. Open/closed status based on business hours and timezone.

---

## 6. Service Categories
**Priority**: P0

### Description
A taxonomy of service categories (e.g., Hair, Nails, Massage) with subcategories that helps users browse and businesses to list services.

### User Stories
- As a user, I want to browse by category to find what I need.
- As a provider, I want to assign categories to my services.

### Acceptance Criteria
1. Admin-manageable category tree (categories and subcategories).
2. Category browsing: grid of icons/text from homepage, leading to businesses filtered by that category.
3. Each business service can be linked to one or more subcategories.
4. Search results can be filtered by category.
5. Category slug for SEO-friendly URLs.

---

## 7. Booking Flow
**Priority**: P0

### Description
Guided multi-step process from service selection to payment confirmation, ensuring a smooth and clear appointment booking.

### User Stories
- As a user, I want to select a service, choose staff (optional), pick a time, add extras, and pay to confirm.
- As a user, I want to see a summary before payment.

### Acceptance Criteria
1. Step 1: Service selection from business menu; options show name, duration, price. Can select one primary service + optional add-ons.
2. Step 2: Staff selection (optional if business allows any staff); show staff member's name, photo, rating, next available slot.
3. Step 3: Date & Time picker. Calendar view showing available dates; time slots grid based on computed availability (see Availability & Slot Computation). Slots shown with real-time status (available, limited, taken).
4. Step 4: Add-ons/extras that complement service (e.g., deep condition with haircut).
5. Step 5: Order summary: business name, service(s), staff, date/time, duration, price breakdown, taxes, total.
6. Step 6: Payment integration (see Payment Integration). After successful payment, booking confirmed.
7. If user is not authenticated, prompt login/signup before payment; after authentication, continue flow.
8. Booking ID generated, confirmation screen with details and option to add to calendar.
9. Concurrent slot holds: when a slot is selected, it's temporarily reserved for 10 minutes (configurable) during the booking process to avoid double booking. Uses Redis atomic lock.
10. Error handling: if slot becomes unavailable during payment, show friendly message to choose another.

---

## 8. Appointment Management
**Priority**: P0

### Description
Users can view upcoming and past appointments, cancel or reschedule (if allowed), and see details.

### User Stories
- As a user, I want to see all my bookings in one place.
- As a user, I want to cancel an appointment if I cannot attend.
- As a user, I want to reschedule to a different time.

### Acceptance Criteria
1. "My Appointments" screen with tabs: Upcoming, Past.
2. Each appointment card shows: business name, service, date/time, staff, price, status (confirmed, completed, canceled, no-show).
3. Cancel action: available only up to X hours before appointment (business policy). Confirm dialog; triggers cancellation notification to provider and refund if applicable.
4. Reschedule action: If allowed, leads to simplified booking flow (select new service (same category), date/time, staff). Old slot released, new slot booked; any price difference handled by payment or refund.
5. Appointment detail: full information, business contact, directions link, add to calendar button.
6. Status updates reflect in real-time (via polling or WebSocket).
7. Completed appointments prompt user to leave a review.

---

## 9. Favorites
**Priority**: P1

### Description
Users can save businesses as favorites for quick access.

### User Stories
- As a user, I want to bookmark businesses I like.
- As a user, I want to see my favorites list and remove them.

### Acceptance Criteria
1. Heart icon on business cards and detail page toggles favorite.
2. "Favorites" screen: list/grid of saved businesses, sorted by most recent addition or custom order.
3. Each card shows open status, rating, distance, next available slot.
4. Guest tapping favorite prompts sign-up.
5. Sync across devices (user data stored in backend).
6. Remove with swipe or long press.

---

## 10. User Profile
**Priority**: P1

### Description
Central place for user to manage personal information, preferences, and view history.

### User Stories
- As a user, I want to edit my name, email, phone, photo.
- As a user, I want to see my booking history and reviews I've written.
- As a user, I want to manage notification preferences.

### Acceptance Criteria
1. Profile screen: avatar (editable), name, email, phone (verified).
2. Edit profile form with validation; email change requires re-verification.
3. Booking history tab (linked to Appointment Management).
4. Reviews tab: my reviews, can edit/delete within 30 days.
5. Notification settings: toggle push/email for reminders, promotions, booking updates.
6. Account deletion option with confirmation and data wipe (GDPR).
7. Sign out button.

---

## 11. Availability & Slot Computation
**Priority**: P0

### Description
Dynamic computation of bookable time slots based on provider schedules, service duration, breaks, and existing bookings.

### User Stories
- As a user, I want to see only times that are actually available.
- As a provider, I want my schedule accurately reflected.

### Acceptance Criteria
1. Provider defines business hours (e.g., Mon-Fri 9:00-18:00) and per-staff working hours, breaks, days off.
2. Service duration is used to generate slots: if service is 45 min, slots start at 9:00, 9:15, 9:30... (depending on slot interval configuration) but must fit within working period.
3. Buffer time (before/after appointment) configurable per service/staff.
4. Existing bookings block their time range; slot computation considers booking statuses (confirmed, pending hold).
5. Multiple staff: for "any staff", treat available slots across all staff; for specific staff, limit to that staff.
6. Slot computation runs on-the-fly with caching for up to 15 minutes (invalidate on new booking/cancellation).
7. Recurring exceptions: holidays, special events override normal hours.
8. Supports multiple capacity (e.g., a provider with multiple chairs) if applicable.
9. Computation respects time zone of business location.
10. API returns available slots with a "limited" flag if fewer than X slots remain for that day.

---

## 12. Shared Types & Design System
**Priority**: P2

### Description
A unified design system and shared TypeScript types between frontend and backend to ensure consistency.

### Acceptance Criteria
1. Design tokens: colors, typography, spacing, shadows, breakpoints defined in a shared JSON/CSS.
2. Component library implemented in React Native (mobile) and React (web admin) with same API.
3. Shared types package (e.g., `@planity/types`) exported: User, Business, Service, Booking, Review, etc.
4. Validation schemas (Zod) shared for API contracts.
5. Storybook documentation for all components.
6. Design tokens sync with Figma.

---

## 13. Reviews & Ratings
**Priority**: P1

### Description
Users can rate and review businesses after a completed appointment. Aggregate ratings help other users decide.

### User Stories
- As a user, I want to leave a rating and review for a salon I visited.
- As a user, I want to see overall rating and recent reviews for a business.

### Acceptance Criteria
1. After appointment completion, system sends review invitation (notification/email).
2. Review form: star rating (1-5), text (optional), photos (optional, max 3).
3. One review per completed booking; edits allowed within 30 days.
4. Reviews appear on business detail under a tab, sorted by newest or most helpful.
5. Business owners can respond to reviews publicly.
6. Aggregate rating (average stars, total count) displayed on business card and detail; updated asynchronously.
7. Inappropriate content flagging mechanism.
8. Reviews paginated, lazy loading.

---

## 14. Payment Integration
**Priority**: P0

### Description
Secure payment processing for booking confirmation, supporting multiple payment methods.

### User Stories
- As a user, I want to pay securely with credit/debit card.
- As a user, I want to receive a digital receipt.

### Acceptance Criteria
1. Integrate with Stripe (or similar) for payment processing.
2. Supported methods: card (Visa, MasterCard, Amex), digital wallets (Apple Pay, Google Pay).
3. Payment flow: collect card details via Stripe Elements (or PaymentSheet for mobile), never store raw card data.
4. Pre-authorization or charge at booking time (pre-payment model).
5. Handle 3D Secure flows.
6. Payment confirmation returns payment intent ID; booking status updated to 'confirmed' upon success.
7. Receipt generation and email after successful payment.
8. Refund mechanism for cancellations (automatic or manual by provider/admin) via Stripe.
9. Idempotency keys to prevent duplicate charges.
10. PCI compliance not required because of tokenization via Stripe.

---

## 15. Notifications
**Priority**: P0

### Description
Transactional and marketing notifications delivered via push (mobile) and email, driven by booking events.

### User Stories
- As a user, I want to receive reminders about upcoming appointments.
- As a user, I want to be notified of booking confirmations, cancellations, and changes.

### Acceptance Criteria
1. Notification triggers:
   - Booking confirmation (push + email)
   - Reminder 24h and 1h before appointment
   - Cancellation/Rescheduling confirmation
   - Review invitation after service
   - Promotional (opt-in)
   - Chat (if future) notifications
2. Push notifications via Firebase Cloud Messaging (FCM) / APNs.
3. Email via transactional service (SendGrid, SES) with responsive templates.
4. In-app notification center with badge counter; mark as read.
5. Notification preferences respected (user can opt out by type).
6. Background jobs (BullMQ) responsible for queuing and sending reminders, cleaning up expired holds.
7. Deep linking from notification to relevant screen (appointment detail, review writing).

---

## 16. Provider / Business Owner Portal
**Priority**: P0

### Description
A separate web/mobile interface for business owners to manage profile, services, staff, schedule, and bookings.

### User Stories
- As a provider, I want to set my business hours, services, and pricing.
- As a provider, I want to view and manage my appointments calendar.
- As a provider, I want to confirm, cancel, or reschedule bookings.

### Acceptance Criteria
1. Multi-step business onboarding: business details (name, address, phone, description, photos), service menu setup, staff/employee addition, schedule configuration.
2. Dashboard with metrics: upcoming bookings, daily/weekly revenue, new clients, average rating.
3. Calendar view (day/week/month) showing appointments; can click to manage (confirm, complete, cancel, add notes).
4. Appointment list with filters (date, staff, status).
5. Manage Services: CRUD for services with name, duration, price, category, description, buffer time, max capacity.
6. Manage Staff: add/edit employees with name, photo, email, role, working hours, service assignments.
7. Availability management: set regular business hours, breaks, holidays, special days; per-staff override.
8. Settings: cancellation policy (lead time, fee percentage), booking lead time, max advance booking days.
9. Notifications: staff assignment changes, new booking alerts.
10. Role-based access: owner can manage all; staff can only view their schedule (future staff app).
11. Mobile-responsive or dedicated provider app.

---

## 17. Admin Dashboard
**Priority**: P1

### Description
Super admin panel for platform oversight, moderation, analytics, and configuration.

### User Stories
- As an admin, I want to manage businesses (approve, suspend) and moderate reviews.
- As an admin, I want to view platform metrics and handle disputes.

### Acceptance Criteria
1. Admin login with super admin role from a dedicated subdomain/login.
2. Dashboard with KPIs: total bookings, revenue, active businesses, new users, cancellation rate, average rating.
3. Business management: list, search, view details, approve new signups, suspend/ban, verify.
4. User management: list users, search, view details, suspend/ban, view booking history.
5. Review moderation queue: flagging, approving, deleting inappropriate reviews.
6. Category management: add/edit/delete service categories and subcategories.
7. Commission/plan management: set commission rates per booking, subscription plans.
8. System configuration: global settings for slot hold duration, cancellation window, fees.
9. Audit log for sensitive actions.
10. Reports: daily/monthly summaries for revenue, bookings, user growth, export CSV.
11. Background job monitoring (Bull Board) to inspect queues, failed jobs, retries.

---

## 18. Background Jobs (BullMQ)
**Priority**: P1

### Description
Asynchronous processing for non-blocking tasks like email sending, slot hold release, and analytics aggregation.

### User Stories
- As a system, I need to send reminder emails without delaying API responses.
- As a system, I need to release expired booking holds automatically.

### Acceptance Criteria
1. Queues defined:
   - `notifications`: send push & email (reminders, confirmations, etc.)
   - `booking-holds`: release expired holds (cron every minute).
   - `review-requests`: trigger review invitations 1 hour after appointment end.
   - `analytics`: aggregate daily stats for admin dashboard.
   - `cleanup`: delete expired unverified accounts, old logs, etc.
2. All jobs are idempotent; failures logged with retry strategies (exponential backoff).
3. Bull Board integrated into admin for monitoring.
4. Redis used as backend for BullMQ.
5. Worker processes can be scaled independently.
6. Priority: notification job priority higher than analytics.

---

## Cross-Functional Requirements
- **Performance**: API response < 200ms (cached), slot computation < 500ms.
- **Scalability**: Services stateless, database read replicas for heavy read.
- **Security**: HTTPS, input sanitization, rate limiting, CSRF tokens, CORS properly configured.
- **Localization**: Initially English + French; i18n ready.
- **Accessibility**: WCAG 2.1 AA for web; accessibility roles on mobile.
- **Error Tracking**: Sentry integration.

---

## Architectural Notes (information for developers)
- Backend: Node.js with TypeScript, NestJS or Express.
- Database: PostgreSQL for transactional data, Redis for caching and queues.
- File storage: S3-compatible for images.
- Search: Elasticsearch or PostgreSQL full-text with trigram.
- Frontend: React Native for mobile, React for web admin and provider portal.
- API: GraphQL or REST with OpenAPI spec.
- CI/CD: automated testing, staging environment.
