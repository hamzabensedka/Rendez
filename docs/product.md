# Product Specification: Planity Clone

## 1. Overview
Planity Clone is a mobile-first appointment booking platform connecting customers with beauty, wellness, and grooming businesses. The app enables discovery, seamless booking, and management of appointments, while providing a portal for business owners and an admin dashboard for platform oversight. This document defines the complete feature set, acceptance criteria, and priorities for development.

## 2. Product Goals
- Enable end-to-end appointment booking with real-time availability.
- Provide intuitive business discovery via text search, categories, and map.
- Build trust and transparency through reviews and ratings.
- Empower business owners to manage services, staff, and calendars.
- Ensure reliable slot computation and job processing with BullMQ.
- Monetize through payment integration (commission/fee).
- Deliver a consistent user experience via a shared design system and types.

## 3. Target Users
- **End Customer**: Individual seeking services, browsing, booking, managing appointments, leaving reviews, saving favorites.
- **Business Owner/Provider**: Salon, spa, barbershop owner who manages business profile, services, staff, schedules, and responds to bookings/reviews.
- **Admin**: Platform administrator who manages users, businesses, payments, reviews, and monitors analytics.

## 4. Shared Types & Design System
### 4.1 Shared Types
All modules will rely on a single source of truth for data models, defined as TypeScript interfaces/validation schemas (e.g., Zod). Models include:
- **User** (customer, provider, admin roles)
- **Business** (name, description, address, coordinates, open hours, categories, photos)
- **Service** (name, duration, price, category, business reference)
- **Staff** (name, avatar, working hours, services they perform)
- **Appointment** (customer, business, service, staff, datetime, duration, status, notes)
- **Review** (rating, comment, response, author, appointment)
- **Payment** (method, amount, status, stripe references)
- **Notification** (type, payload, read status)

**Acceptance Criteria:**
- Types are shared between frontend (React Native) and backend (Node.js/Express) via a monorepo or package.
- Data validation uses the same schemas on both sides.
- API responses adhere to these types; any deviation triggers lint errors.

### 4.2 Design System
A token-based design system governs all UI components. It includes:
- Color palette (primary, secondary, neutral, semantic)
- Typography scale (sizes, weights)
- Spacing and layout grid
- Reusable components: Button, Input, Card, Modal, Avatar, Rating, Calendar, SlotPicker, etc.

**Acceptance Criteria:**
- Component library documented in Storybook.
- All screens consume only design system components; no hardcoded styles outside tokens.
- Theming support for light/dark modes.

## 5. Feature Specifications
Each feature includes a brief description, user stories, acceptance criteria, and priority.

### 5.1 User Authentication (P0)
**Description:** Enable users to create accounts and authenticate seamlessly. Support email/password and social logins (Google, Apple). JWT-based sessions with refresh tokens.

**User Stories:**
- As a new customer, I want to sign up with email/password so I can book appointments.
- As a returning user, I want to log in quickly, optionally using Google/Apple, so I don’t have to remember credentials.
- As a user, I want to reset my password if I forget it.
- As a user, I want to log out to protect my account on shared devices.

**Acceptance Criteria:**
1. Registration form validates email format, password strength (min 8 chars, mix). Email verification link sent; account activated upon click.
2. Social login (Google, Apple) prompts OAuth flow and creates account if new.
3. Login returns access token (15 min) and refresh token (7 days). Refresh endpoint issues new access token without re-login.
4. Invalid credentials show contextual error without disclosing which field is wrong.
5. Password reset sends email with time-limited link; successful reset invalidates previous tokens.
6. Logout clears tokens from secure storage (Keychain/Keystore) and navigates to home.
7. Auth state persists across app restarts; deep links check token validity before showing protected screens.

**Priority:** P0 (MVP)

### 5.2 Guest Browse & Explore (P0)
**Description:** Non-authenticated users can explore businesses, services, and reviews without signing up. Booking actions prompt login.

**User Stories:**
- As a guest, I want to search and view business details to decide if I want to sign up.
- As a guest, I want to be prompted to register only when I attempt to book, not while browsing.

**Acceptance Criteria:**
1. All public endpoints (business list, detail, reviews, categories) accessible without token.
2. Booking button on business detail or service selection shows a login/register modal.
3. Modal provides social login options and email registration, with a callback to resume booking flow after authentication.
4. No account-related features (favorites, appointments) appear in navigation until logged in.
5. Guest can view reviews and star ratings.

**Priority:** P0 (MVP)

### 5.3 Business Search & Discovery (P0)
**Description:** Full-text search with filters for business name, service type, location. Results displayed with pagination.

**User Stories:**
- As a customer, I want to find nearby hair salons by typing “haircut” and filtering by rating, so I can choose the best one.
- As a user, I want to see relevant results as I type, with suggestions.

**Acceptance Criteria:**
1. Search bar supports free text; API returns businesses matching name or service name.
2. Filters include: category (multi-select), minimum rating (1-5), price level (low/high sliders), distance (km range).
3. Location is obtained via GPS or manual input; distance filter works accordingly.
4. Results sortable by relevance, rating, distance.
5. Infinite scroll/pagination (page size 20) with loading skeleton.
6. Empty state when no results: message and suggestions to adjust filters.
7. API response time <300ms under normal load.

**Priority:** P0 (MVP)

### 5.4 Map-based Search (P1)
**Description:** Interactive map showing business pins. Pans and zooms update search area.

**User Stories:**
- As a visual-oriented user, I want to see businesses on a map to pick one near a specific location.
- As a user, I want to tap a pin to get a preview and navigate to full details.

**Acceptance Criteria:**
1. Map loads centered on user’s current location (if permission granted); otherwise fallback to default city.
2. Map uses a clustering library to group nearby pins.
3. Moving or zooming the map triggers a debounced API call to fetch businesses within the visible bounding box.
4. Tapping a pin shows a mini card with business name, rating, main image, and “View” button.
5. When GPS permission denied, show input to enter an address to center map.
6. Seamless transition between list view and map view; shared filter state.

**Priority:** P1 (v1.1)

### 5.5 Business Detail View (P0)
**Description:** Comprehensive profile of a business with images, services, and reviews.

**User Stories:**
- As a customer, I want to see all details about a salon before booking, including opening hours and recent reviews.
- As a user, I want to quickly book a service from the detail page.

**Acceptance Criteria:**
1. Screen displays: cover photo gallery (swipeable), business name, average rating, review count, address with map thumbnail, contact (phone/tap to call), open hours with indicator if currently open.
2. Services tab: list of services grouped by category, each with name, duration, price. Tapping a service opens booking flow.
3. Reviews tab: summary bar (5-star breakdown), list of recent reviews (paginated). Tapping a review shows full text.
4. A floating “Book” button is always visible; tapping leads to service selection.
5. If business has multiple staff, “Choose staff” screen precedes time selection.
6. If user is owner, an “Edit” button appears (for Provider Portal).

**Priority:** P0 (MVP)

### 5.6 Service Categories (P0)
**Description:** Hierarchical categories (e.g., Hair, Nails, Massage) enabling browsing by type.

**User Stories:**
- As a new user, I want to browse “Massage” to see all businesses offering massage without knowing specific names.
- As a user, I want to see popular categories upfront.

**Acceptance Criteria:**
1. Home screen features category grid/grid of icons.
2. Tapping a category navigates to a list of businesses filtered by that category, with the same search and filter capabilities as text search.
3. Categories can have parent-child relationships (e.g., Hair > Haircut, Coloring). Selecting parent includes all children.
4. API supports fetching businesses by category ID.
5. Admin can add/edit/delete categories (via Admin Dashboard).

**Priority:** P0 (MVP)

### 5.7 Booking Flow (P0)
**Description:** Step-by-step booking: service selection, staff choice, date/time, confirmation, and optional payment.

**User Stories:**
- As a customer, I want to book a haircut for a specific date and time with my preferred staff, ensuring no double booking.
- As a user, I want a clear confirmation that my booking is secured after payment.

**Acceptance Criteria:**
1. Step 1: Service and Staff (if multiple). Tapping a service from detail view initiates flow. Staff displayed with avatar and name; selection required.
2. Step 2: Date & Time. Calendar shows available dates highlighted; unavailable grayed out. Tapping a date fetches real-time slots from /api/availability. Slots shown as time buttons. Slots are locked for 5 min on selection (pessimistic lock).
3. Step 3: Review & Confirm. Summary of service, staff, date, time, duration, price. Optional notes field. User can go back to edit.
4. Step 4: Payment (if required). Integrated with Stripe Elements (card, Apple/Google Pay). On success, booking confirmed. On failure, slot lock released and error shown.
5. Step 5: Confirmation screen displays booking reference, options to add to calendar, share, or view appointment.
6. At any step, back button returns to previous step preserving state (except after final confirmation).
7. If user logs in during booking, resume exactly where they left off.

**Priority:** P0 (MVP)

### 5.8 Appointment Management (P0)
**Description:** Customers view, cancel, reschedule appointments. Providers manage bookings from their portal.

**User Stories:**
- As a customer, I want to see my upcoming appointments and easily cancel or reschedule if my plans change.
- As a customer, I want to receive a reminder before the appointment.

**Acceptance Criteria (Customer):**
1. Appointments list separated into “Upcoming” and “Past”.
2. Upcoming appointment card shows date, time, business, service, staff, status (confirmed, pending, etc.), and actions: Cancel, Reschedule.
3. Reschedule opens a modified booking flow pre-filled with original service; changing date/time releases old slot and books new (with validation against availability).
4. Cancel triggers confirmation dialog; upon confirm, notify provider and update slot availability. Cancellation policy may restrict last-minute (configurable per business).
5. Past appointments show a “Leave Review” button if not yet reviewed.
6. Integration with device calendar (via deep linking or iCal export).
7. Push notifications for booking confirmation, reminders (24h, 1h before), and changes from provider.

**Acceptance Criteria (Provider):**
- See incoming bookings in real-time calendar view (see Provider Portal). Options to accept/reject (if manual approval required), reschedule, or cancel with reason.

**Priority:** P0 (MVP)

### 5.9 Favorites (P1)
**Description:** Save businesses to a favorites list for quick access.

**User Stories:**
- As a frequent customer, I want to bookmark my favorite salon so I can book again quickly.
- As a user, I want to manage my favorites list (remove when I no longer need them).

**Acceptance Criteria:**
1. Heart icon on business card and detail page toggles favorite state.
2. Favorites list accessible from profile tab.
3. List is synced with backend; survives app reinstall.
4. Tapping a business from favorites navigates to its detail page.

**Priority:** P1 (v1.1)

### 5.10 User Profile (P0)
**Description:** Manage personal information, booking history, and settings.

**User Stories:**
- As a user, I want to update my name, email, and profile picture.
- As a user, I want to see all my bookings and manage payment methods.

**Acceptance Criteria:**
1. Profile screen displays avatar, editable name, email, phone.
2. Sections: My Appointments, Favorites, Payment Methods, Settings (notification preferences, language).
3. Payment Methods: add/delete cards (tokenized via Stripe) with default select.
4. Settings: toggle push/email/SMS notifications, choose language.
5. Account deletion option with confirmation and data wipe request (GDPR compliance).
6. All changes trigger optimistic updates and API sync.

**Priority:** P0 (MVP)

### 5.11 Availability & Slot Computation (P0)
**Description:** Real-time calculation of appointment slots considering business hours, staff working hours, service duration, buffers, and existing bookings. Caching and precomputation via BullMQ for performance.

**User Stories:**
- As a system, I must ensure no double booking occurs and only valid slots are shown.
- As a developer, I want the slot computation to be fast even with many concurrent users.

**Acceptance Criteria:**
1. Slot API `/api/availability?businessId=&serviceId=&staffId=&date=` returns array of available start times with duration.
2. Computation logic includes:
   - Business open/close hours (regular and special days/holidays).
   - Staff working hours (may differ from business hours).
   - Service duration (fixed or variable).
   - Buffer time between appointments (configurable per business).
   - Existing confirmed/locked appointments.
   - Current time (no past slots).
3. Response time target <300ms; precomputation of slots for today and tomorrow on schedule and on demand via BullMQ.
4. Slot locking: when user selects a slot, a temporary lock (5 min) is placed in Redis. Lock expiration releases slot if booking not completed.
5. Booking transaction atomically checks lock, creates appointment, removes lock, and marks slot unavailable.
6. Race conditions prevented by optimistic locking or database constraints (unique constraint on (business, staff, start time) where status != cancelled).
7. Bulk slot generation for future days (via BullMQ job) to reduce on-the-fly computation latency. Cache slots for frequently queried dates.
8. Edge cases: overlapping services, multiple staff simultaneous bookings, staff breaks, service that requires multiple staff (future).

**Priority:** P0 (MVP)

### 5.12 Reviews & Ratings (P0)
**Description:** Customers leave star ratings and written reviews after completed appointments. Businesses can respond.

**User Stories:**
- As a customer, I want to rate my experience to help others decide.
- As a business owner, I want to reply to reviews to show I care.

**Acceptance Criteria:**
1. Only users with a completed appointment (status = completed) may review; one review per appointment.
2. Rating screen: 1-5 stars, optional text. Submit stores review and updates business’s average rating.
3. Review appears on business detail page sorted by most recent.
4. Average rating displayed with star visualization and breakdown histogram.
5. Provider can respond to a review from their dashboard; response shown below the review.
6. Reviews flagged by users or containing profanity are held for moderation (admin queue). Admin can approve/reject from admin dashboard.
7. User can edit or delete their own review within 24 hours.

**Priority:** P0 (MVP)

### 5.13 Payment Integration (P1)
**Description:** Secure payment processing via Stripe for booking fees or deposits. Support major cards and wallets.

**User Stories:**
- As a customer, I want to pay for my booking securely using my credit card.
- As a business, I want to receive payouts minus platform commission.

**Acceptance Criteria:**
1. Frontend uses Stripe Elements (React Native Stripe SDK) to collect card details; no raw card data touches our servers.
2. Server confirms PaymentIntent after booking confirmed; amount equals service price (plus optional deposit).
3. Payment failure shows user-friendly error and releases slot.
4. Refund capability for cancellations (full/partial according to policy) via admin or automated job.
5. On successful payment, appointment status set to “paid” (or “confirmed”).
6. Payment history viewable in user profile.
7. Providers’ payouts handled via Stripe Connect; admin dashboard tracks commissions.
8. PCI compliance ensured; we never store CVV.

**Priority:** P1 (v1.1)

### 5.14 Notifications (P1)
**Description:** Push notifications, in-app alerts, and optionally email/SMS for booking updates, reminders, and promotions.

**User Stories:**
- As a customer, I want to be reminded of my appointment 24 hours before.
- As a business, I want to notify customers of last-minute changes.

**Acceptance Criteria:**
1. Push notifications using Firebase Cloud Messaging (FCM)/APNs; device token registered on login.
2. Triggers: booking confirmation, reminder (24h, 1h), cancellation, reschedule, new message from provider, promotional campaigns.
3. In-app notification center with list of recent notifications; tapping deep links to relevant screen.
4. User can configure notification preferences per type (push, email, SMS) in settings.
5. Email delivery via SendGrid or similar; SMS via Twilio (optional).
6. Real-time updates via WebSockets (Socket.io) for booking status changes; fallback to push if app in background.
7. Background job (BullMQ) responsible for scheduling and sending reminders at appropriate times.

**Priority:** P1 (v1.1)

### 5.15 Provider / Business Owner Portal (P1)
**Description:** Web dashboard for business owners to manage their business, services, staff, and bookings.

**User Stories:**
- As a salon owner, I need to add my services, set my working hours, and manage staff schedules.
- As an owner, I want to view my calendar with all appointments and accept/reschedule them.

**Acceptance Criteria:**
1. Authentication for business accounts (linked to owner user role).
2. Business Profile: edit name, description, photos, address, contact info, open hours (regular and special dates/holidays).
3. Service Management: CRUD services, assign to categories, set duration and price, mark active/inactive.
4. Staff Management: add staff names, photos, assign services they perform, set individual working hours and breaks.
5. Calendar View: daily/weekly agenda showing appointments with status, color-coded by service/staff. Click to see details, accept/reject, reschedule, cancel. Drag-and-drop reschedule (optional).
6. Analytics Dashboard: upcoming appointments count, revenue today/week, customer return rate, average rating.
7. Review Management: list of reviews with ability to respond or flag.
8. Notification settings: enable/disable automatic confirmations, reminders.
9. Portal is responsive; optimized for desktop/tablet.

**Priority:** P1 (v1.1)

### 5.16 Admin Dashboard (P1)
**Description:** Superadmin interface to manage the entire platform – users, businesses, appointments, payments, reviews, and analytics.

**User Stories:**
- As an admin, I need to approve new businesses and moderate reviews to maintain quality.
- As an admin, I want to see overall platform metrics to track growth.

**Acceptance Criteria:**
1. User Management: list/search all users, view details, suspend/activate accounts, change roles.
2. Business Management: list/search businesses, approve/reject new registrations, suspend/ban, view/edit details, manage categories.
3. Appointment Oversight: search by ID/user/business, view all appointments, manually cancel/refund if needed.
4. Payment & Payouts: view transaction history, process refunds, see commission earnings.
5. Review Moderation: queue of flagged reviews, approve/reject, delete.
6. Platform Analytics: total bookings, revenue, new user signups (daily/weekly/monthly charts), top businesses.
7. Category Management: add/edit/delete service categories and subcategories.
8. Configuration: platform fee percentage, cancellation policy defaults.
9. Role-based access: only superadmin can access; separate login from regular users.

**Priority:** P1 (v1.1)

### 5.17 Background Jobs (BullMQ) (P1)
**Description:** Reliable job processing using BullMQ with Redis for asynchronous tasks: slot precomputation, notifications, payment settlement, cleanup.

**User Stories:**
- As a system, I want to offload heavy computations and scheduled tasks to background workers to keep API responsive.

**Acceptance Criteria:**
1. Jobs defined: `slot-precompute`, `send-notification`, `appointment-reminder`, `payment-settlement`, `expire-locks`, `generate-report`.
2. `slot-precompute`: triggered by cron (e.g., daily at midnight) and on-demand when business hours/configuration changes. Prepopulates Redis cache with slots for next N days.
3. `send-notification`: accepts notification payload, delivers via push/email/SMS; handles retries with backoff.
4. `appointment-reminder`: scheduled for 24h and 1h before appointment; uses delayed jobs.
5. `payment-settlement`: for provider payouts, runs daily to calculate commissions and initiate transfers via Stripe.
6. `expire-locks`: regular sweep to release stale locks (older than 5 min) caused by user abandonment.
7. BullMQ dashboard (e.g., Bull Board) accessible to admins for monitoring.
8. Workers are horizontally scalable; job handlers idempotent.

**Priority:** P1 (v1.1)

## 6. Non-Functional Requirements
- **Performance**: API response times for critical endpoints (search, availability) <500ms under 1k concurrent users. Page load on mobile <3s on 4G.
- **Scalability**: All stateless services can scale horizontally; Redis and database clustering ready. Support at least 10k concurrent MAU.
- **Security**: All data in transit encrypted (TLS 1.3). Passwords hashed (bcrypt). Input sanitized. Rate limiting on auth and booking endpoints. Regular penetration testing.
- **Data Privacy**: GDPR compliant; users can request data export/deletion. PII encrypted at rest.
- **Offline Support**: App caches business list and profile for offline viewing; booking requires connectivity.
- **Accessibility**: WCAG 2.1 AA for web portal; mobile app follows Apple/Google accessibility guidelines (VoiceOver/TalkBack).

## 7. Priority Summary
| Feature                               | Priority |
|---------------------------------------|----------|
| User Authentication                   | P0       |
| Guest Browse & Explore                | P0       |
| Business Search & Discovery           | P0       |
| Map-based Search                      | P1       |
| Business Detail View                  | P0       |
| Service Categories                    | P0       |
| Booking Flow                          | P0       |
| Appointment Management                | P0       |
| Favorites                             | P1       |
| User Profile                          | P0       |
| Availability & Slot Computation       | P0       |
| Shared Types & Design System          | P0       |
| Reviews & Ratings                     | P0       |
| Payment Integration                   | P1       |
| Notifications                         | P1       |
| Provider / Business Owner Portal      | P1       |
| Admin Dashboard                       | P1       |
| Background Jobs (BullMQ)              | P1       |

P0: Must-have for MVP. P1: High priority for v1.1. All features are scoped to build a complete, market-ready product.