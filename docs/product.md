# Product Specification: Planity Clone

## Overview
Planity Clone is a multi-platform beauty & wellness booking marketplace connecting customers with local salons, spas, barbers, and other service providers. The platform supports customer browsing/booking, provider business management, and administrative controls.

## Roles
- **Guest**: Unauthenticated user who can browse businesses, search, view details but cannot book.
- **Customer**: Authenticated user who can book appointments, manage bookings, write reviews, save favorites, manage profile.
- **Provider / Business Owner**: Authenticated business owner who can manage business profile, services, staff schedules, appointments, and respond to reviews.
- **Admin**: Super administrator with full system control over businesses, users, bookings, and platform settings.

## Feature List

### 1. Shared Types & Design System
**Priority:** P0 (Foundation)
**Description:** Establish a shared design system (Mobile/Web) including typography, color palette, spacing, reusable components (Button, Input, Card, Avatar, Modal), and centralized TypeScript/GraphQL schemas for core entities: User, Business, Service, Appointment, Review, etc.
**Acceptance Criteria:**
- Use a shared UI component library with consistent theming.
- All screens adhere to the defined design tokens.
- Core DTOs defined in a shared package to ensure type safety across frontend and backend.
- Components are responsive and accessible (touch targets, labels for screen readers).

### 2. User Authentication
**Priority:** P0
**Description:** Secure sign-up and sign-in with email/password, social login (Google, Apple), email verification, password reset, and role selection (customer or provider). Token-based session management (JWT) with refresh tokens. Also support OTP-based phone verification optionally.
**Acceptance Criteria:**
- New user can create account with email/password, verify email via link/code.
- User can log in with email/password.
- Social login via Google and Apple ID works, retrieving necessary profile info.
- Forgot password flow sends reset link, allows password update.
- User can select role during signup (customer vs provider). Provider role requires additional business setup.
- All authenticated API calls use Bearer JWT; refresh token rotation implemented.
- Error messages for invalid credentials, duplicate email, etc.
- Logout clears tokens.

### 3. Guest Browse & Explore
**Priority:** P0
**Description:** Allow unauthenticated users to explore the platform, search businesses, view business details, but restrict booking, favorites, and profile actions with a login prompt.
**Acceptance Criteria:**
- Home screen displays featured/popular businesses without requiring login.
- Guest can use search bar and filters, view search results.
- Tap on a business opens the detail view with full information.
- When attempting to book, add to favorites, or access profile, a modal or redirect prompts to login/register.
- Guest session does not persist sensitive data.

### 4. Business Search & Discovery
**Priority:** P0
**Description:** Full-text search across business name, description, services, and categories. Advanced filtering by location (geolocation or manual input), rating, price range, availability (date/time), and category. Sort by relevance, distance, rating, popularity. Infinite scroll pagination.
**Acceptance Criteria:**
- Search bar with autocomplete suggestions (business names, categories) as user types.
- Results update dynamically as filters are applied.
- Location filter uses device GPS, can be changed manually; distance radius slider.
- Availability filter: pick date/time to show only businesses with free slots.
- Results are paginated; scrolling loads next page seamlessly.
- API performance: search queries return in < 300ms (with indexing).
- Edge cases: no results show empty state with suggestions.

### 5. Map-based Search
**Priority:** P0
**Description:** Interactive map view that displays nearby businesses as pins, supports clustering for dense areas, and updates results as the user pans/zooms. Tapping a pin shows a preview card; tapping the card navigates to business details.
**Acceptance Criteria:**
- Map loads centered on user's location (with permission) or default city.
- Business pins show category icon and average rating badge.
- Pin clustering avoids overlapping pins; zoom in reveals individual pins.
- Map movement triggers a debounced API call to fetch businesses in the new bounds; search results list below/overlay updates accordingly.
- Tap pin -> infowindow/card with business name, photo, rating, first service and price.
- Tapping card navigates to business detail screen.
- Integration with current search filters: map results respect selected filters.

### 6. Service Categories
**Priority:** P1
**Description:** Hierarchical category tree (e.g., Hair > Women's Haircut, Men's Haircut, Coloring; Nails > Manicure, Pedicure) that businesses are assigned to. Users can browse by category to discover businesses.
**Acceptance Criteria:**
- Admin can manage (CRUD) categories and subcategories via Admin Dashboard.
- Business owner can select main category and applicable subcategories during profile setup.
- Browse screen shows top-level categories as tappable tiles; tapping leads to subcategory list.
- Each subcategory shows relevant businesses.
- Category names are translatable if needed.
- Empty state when no businesses exist in a category.

### 7. Business Detail View
**Priority:** P0
**Description:** Comprehensive page for a business showing photo gallery, name, rating, address with map, services list (name, duration, price, description), opening hours, reviews summary, and a prominent "Book" button. Favorite toggle. Ability to share business.
**Acceptance Criteria:**
- Hero image carousel with swipe.
- Business info: name, average rating (stars), review count, distance from user.
- Address with "Get Directions" link to map apps.
- Services section: list with price, duration; tapping a service may show description or start booking directly (configurable). Quick "Book" button next to each service or one global.
- "Available today" indicator based on current day/time.
- Working hours: show current day's hours highlighted, expandable weekly schedule.
- Reviews: display top 3 recent reviews with "See all" link.
- Favorite heart icon; tapping adds/removes from favorites (requires login).
- Share button to share business link.

### 8. Booking Flow
**Priority:** P0
**Description:** Seamless multi-step booking process: select service(s) > choose date > pick available time slot > add notes > review summary > confirm & pay (if payment required). Steps are linear with back navigation. Validation ensures no conflicts.
**Acceptance Criteria:**
- Step 1: Service selection. User can select one or multiple services from the business (if multi-service supported). Quantity per service maybe limited to 1.
- Step 2: Date picker. Shows a calendar highlighting available dates; business working days and holidays block dates.
- Step 3: Time slot selection. Lists available start times based on service duration, staff availability, and existing bookings. Slots are computed considering buffer times. If multiple services, total duration used.
- Option to choose a specific staff member if applicable.
- Step 4: Notes field (optional, max 500 chars).
- Step 5: Booking summary shows business name, services, date/time, total price, duration, and any cancellation policy. If payment required, integrated payment form (Stripe) appears to capture card details or use saved method.
- After confirmation, shows success screen with booking reference number, option to add to calendar, and "View Appointment" button.
- If payment fails, error message with retry option.
- Concurrent booking prevention: slot is reserved temporarily (e.g., 5 min) during flow, released if abandoned.
- On back navigation, warn user if they might lose progress.

### 9. Availability & Slot Computation
**Priority:** P0
**Description:** Core engine to calculate available appointment slots dynamically based on business working hours, staff schedules, booked appointments, service duration, buffer/cleanup time, breaks, holidays, and capacity constraints. Uses caching via Redis and background jobs (BullMQ) to regenerate slot cache when schedules or bookings change.
**Acceptance Criteria:**
- Given a business, date, service(s) (and optional staff), return list of start times that fit.
- Algorithm respects: working hours (e.g., Mon-Fri 9am-6pm), service duration, staff break times (e.g., 12:00-12:30), buffer time after each appointment (configurable per service).
- If staff assigned to service, only their availability considered; if no staff preference, any available staff member.
- Multi-service booking: total duration = sum of selected services, back-to-back without conflict (assuming same staff if needed). If different staff needed, logic may restrict.
- Holiday/date off blocks entire day.
- Slot cache: generated via background job when business hours, staff schedules, or appointments change; invalidated cache keys.
- API response for slots must be fast (<200ms) using cached data.
- Real-time concurrency: when a user holds a slot, mark it temporarily unavailable; release after timeout or booking confirmation.
- Edge case: last-minute booking cutoff (e.g., no booking within 30 min of start).
- Staff scheduling: support multiple staff per business; each staff has their own working hours and breaks.

### 10. Appointment Management
**Priority:** P1
**Description:** Customers can view upcoming and past appointments, see details, cancel (within allowed window), reschedule to a new slot, add to device calendar, and receive reminder notifications.
**Acceptance Criteria:**
- "My Appointments" screen with tabs: Upcoming, Past.
- Each appointment card shows business name, service, date/time, duration, status (confirmed, cancelled, completed).
- Tap to view detailed appointment: includes business address, map, booking reference, cancellation policy, option to cancel/reschedule.
- Cancel: if allowed (e.g., up to 24h before), show confirmation dialog with reason selection; on cancel, free up slot, update status, notify business.
- Reschedule: flow similar to booking but pre-selects same service; user chooses new date/time; old slot released.
- "Add to Calendar" generates .ics file or deep link to system calendar.
- Push notification reminder 24h and 1h before appointment (configurable per user).
- Completed appointments trigger review prompt.

### 11. Favorites
**Priority:** P2
**Description:** Users can save businesses to a favorites list for quick access.
**Acceptance Criteria:**
- Toggle favorite (heart) from business card/detail; requires authentication.
- Favorites synced across user sessions (stored in backend).
- "My Favorites" screen lists saved businesses with name, photo, rating, and "Book" button.
- Remove from favorites via heart toggle or swipe-to-delete.
- Guest users prompted to login when tapping heart.

### 12. User Profile
**Priority:** P1
**Description:** Manage account settings: personal info, profile photo, change password, notification preferences (push, email, SMS), linked payment methods, and logout.
**Acceptance Criteria:**
- View/edit name, email, phone number, upload avatar (crop/resize).
- Change password requires current password.
- Notification toggles: marketing push, booking reminders, emails.
- Saved payment methods: list of cards (via Stripe), ability to add/delete.
- Logout button clears local session.
- Profile updates must reflect across app immediately.

### 13. Reviews & Ratings
**Priority:** P1
**Description:** After a completed appointment, customers can rate (1-5 stars) and write a textual review, optionally attach photos. Business owners can publicly respond. Reviews appear on business detail, with average rating computed. Moderation for spam/abuse.
**Acceptance Criteria:**
- Post-appointment, user receives a push notification and in-app prompt to review within 48h; can skip.
- Review form: star rating tap, text input (min 10 chars, max 500), optional photo upload (max 3).
- Submitted review must be verified (belongs to a completed appointment) before publishing.
- Business detail displays average rating, total reviews, and latest reviews with pagination.
- Business owner can respond to each review via Provider Portal; response timestamped.
- Users can report a review as inappropriate; admin can hide/delete reviews.
- Rating calculation updates in near real-time when new review is approved.
- Duplicate review detection: one review per booking.

### 14. Payment Integration
**Priority:** P0 (if bookings require payment) or P1
**Description:** Secure payment processing via Stripe. Support card payments, saved payment methods, and 3D Secure. Flows: pay full amount or deposit at booking, refunds managed by admin. Handle international currency if needed.
**Acceptance Criteria:**
- Integration with Stripe Connect for split payments (platform fee to marketplace, remainder to provider). (Simplified: may use direct charges with application fee.)
- Booking: if service requires upfront payment, the payment step in booking flow uses Stripe Elements/PaymentSheet to collect card details or saved card.
- Success: create a PaymentIntent; capture on booking confirmation; handle webhook events (payment_intent.succeeded, failed).
- Saved cards: tokenize with Stripe customer object; display masked card details.
- Refund: admin can issue partial/full refund via Admin Dashboard; triggers Stripe refund and updates booking.
- Error handling: declined card, insufficient funds – show user-friendly messages; allow retry or alternative payment.
- All transactions logged with status.
- PCI compliance: no raw card data touches servers.

### 15. Notifications
**Priority:** P1
**Description:** Multi-channel notifications (push, in-app, email, SMS) for booking confirmations, reminders, cancellations, promotions, and review requests. Use BullMQ to dispatch messages reliably.
**Acceptance Criteria:**
- Push notifications via Firebase Cloud Messaging (FCM) and Apple Push Notification service (APNs); device tokens managed.
- Booking confirmation: push and email sent instantly.
- Reminder: push 24h and 1h before appointment, configurable per user.
- Cancellation: push to business owner; cancellation confirmation to customer.
- Review request: push notification 30 min after appointment ends with deep link to review screen.
- Promotional: sent by admin from dashboard (optional). Users can opt-in/out.
- In-app notification center: list of recent notifications with read/unread, tap to navigate to relevant screen.
- Delivery reliability: BullMQ job attempts with retries and dead letter queue.

### 16. Provider / Business Owner Portal
**Priority:** P0
**Description:** A dedicated interface (web responsive/mobile) for business owners to manage their profile, services, staff, working hours, appointments, reviews, and view basic analytics.
**Acceptance Criteria:**
- Onboarding: provider signup flow collects business name, category, address, phone, photos, and initial services.
- Dashboard: overview of today's appointments, upcoming appointments, revenue this month, rating, and quick actions.
- Manage Business Profile: edit name, description, photos, address, phone, website, social links.
- Manage Services: CRUD for services with name, description, duration, price, buffer time, category.
- Working Hours: set weekly schedule with open/close times per day; mark temporary date exceptions (holidays, special hours).
- Staff Management (if multi-staff): add staff members, assign service skills, set individual working hours, breaks.
- Appointments Calendar: view appointments by day/week/month; filter by staff, status. Ability to confirm, cancel, or reschedule appointments (cancellation may trigger notification to customer with reason).
- Review Management: see all reviews, respond publicly, report inappropriate reviews.
- Analytics: charts for appointments count, revenue over time, popular services, top staff.
- Settings: notification preferences, payment settings (to receive payouts).
- Role-based access: provider can only see and manage their own business.

### 17. Admin Dashboard
**Priority:** P1
**Description:** Web-based superadmin panel to manage all platform entities: businesses, users, bookings, categories, reviews, payments, and view system-wide analytics. Support actions like approve business, handle disputes, manage promotions.
**Acceptance Criteria:**
- User Management: list all customers and providers, view details, suspend/delete accounts.
- Business Management: approve/reject new business registrations (if verification required); feature businesses; edit any business profile if needed.
- Booking Management: view all bookings, filter by status, cancel or refund as needed; handle disputes.
- Category Management: add/edit/delete service categories and subcategories.
- Review Moderation: queue of reported reviews, approve/hide/delete.
- Payment & Refunds: see payment transactions, issue refunds.
- Promotions: create time-limited promo codes, push to target user segments.
- Analytics Dashboard: total users, bookings, GMV, top businesses, conversion funnel.
- Access control: multiple admin roles (superadmin, support). Secure login with 2FA.
- Audit log for sensitive actions.

### 18. Background Jobs (BullMQ)
**Priority:** P0
**Description:** Reliable job queue system using BullMQ (Redis-backed) for asynchronous, resource-intensive, or delayed tasks: slot cache regeneration, sending all notifications (push/email/sms), generating daily reports, image processing (resize/optimize), cleaning expired tokens.
**Acceptance Criteria:**
- Queue setup: at least three queues (high priority: notifications, default: slot regeneration, low: report generation).
- Jobs are enqueued with appropriate data and options (attempts, backoff).
- Slot cache regeneration triggered when business hours, staff schedules, or appointments change; uses debounce to batch updates.
- Notification dispatch: for each notification event, create a job that sends push, email, SMS in parallel or sequentially, with retry for transient failures.
- Daily report generation: at midnight, aggregate metrics and send to providers/admin.
- Image processing: on image upload, create job to generate thumbnails and optimize; original stored in S3.
- Monitor queues via Bull Board UI (admin accessible).
- Handle concurrency and rate limiting for external APIs (FCM, Twilio).
- Dead letter queue for failed jobs; admin can retry or inspect.

---

## Feature Priority Summary
- **P0 (Must-have MVP):** User Authentication, Guest Browse & Explore, Business Search & Discovery, Map-based Search, Business Detail View, Booking Flow, Availability & Slot Computation, Payment Integration, Provider Portal, Shared Types & Design System, Background Jobs.
- **P1 (High priority post-MVP):** Service Categories, Appointment Management, User Profile, Reviews & Ratings, Notifications, Admin Dashboard.
- **P2 (Nice-to-have):** Favorites.

All features will be iteratively refined, but this specification defines the core functionality for the Planity Clone.