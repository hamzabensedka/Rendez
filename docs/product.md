# Product Specification: Planity Clone

## 1. Introduction
This document defines the complete feature set, user stories, and acceptance criteria for building a Planity-like booking platform for beauty and wellness services. It serves as the single source of truth for product, design, and engineering teams, ensuring a shared understanding of requirements and priorities.

## 2. Product Overview
Planity Clone is a mobile-first marketplace connecting customers with salons, spas, barbers, and other wellness providers. Customers can browse businesses, view real-time availability, and instantly book appointments. Providers manage their calendar, services, staff, and bookings via a dedicated portal. The platform supports payments, reviews, notifications, and an admin dashboard for oversight.

## 3. User Roles
- **Guest**: Unauthenticated users who can browse and search, but must sign up to book.
- **Customer**: Authenticated end users who can book, manage appointments, leave reviews, and manage favorites and profile.
- **Provider / Business Owner**: Authenticated user representing a business. Has access to a portal to manage services, staff schedules, bookings, and business details.
- **Admin**: Platform super-user who manages all businesses, users, content, and system configuration.

## 4. Features
Each feature includes a description, a priority (P0 – must have for MVP, P1 – high priority to follow, P2 – future), and acceptance criteria.

### 4.1 Shared Types & Design System
**Priority:** P0

**Description:** Establish a unified design language and reusable component library to ensure consistent look and feel across web and mobile clients. Define TypeScript interfaces for core domain models that are shared between frontend and backend.

**Acceptance Criteria:**
- Reusable UI kit implemented with atomic design principles (atoms, molecules, organisms) covering buttons, inputs, cards, modals, loaders, etc.
- Responsive, mobile-first layout with consistent spacing, typography (font family: Inter/SF Pro, scale), and color palette (primary, secondary, neutral, status).
- Common domain types: User, Business, Service, Staff, Appointment, Review, Slot, Category, Payment, Notification.
- Design tokens exported from Figma and synced with code base.
- Dark mode support considered in initial palette.

### 4.2 User Authentication
**Priority:** P0

**Description:** Secure sign-up, login, and session management for customers. Support email/password and social login. Token-based authentication with refresh mechanism.

**Acceptance Criteria:**
- Registration with email and password (minimum 8 characters, require uppercase, digit). Email verification link sent; account only active after verification.
- Login with email/password, Google, and Apple Sign-In. All social providers return verified email.
- Forgot password flow: send reset link, allow setting new password with strength validation.
- JWT access token (15 min expiry) and refresh token (7 days) stored securely (httpOnly cookie for web, secure storage for mobile). Silent refresh on 401.
- Logout clears tokens, redirects to home.
- Error handling for duplicate email, invalid credentials, expired tokens.
- OTP SMS login as P2 future enhancement.

### 4.3 Guest Browse & Explore
**Priority:** P0

**Description:** Unauthenticated users can explore the platform without friction. They see a curated homepage, can search, view business profiles and available slots, but must create an account to proceed to booking.

**Acceptance Criteria:**
- Home screen displays featured businesses, popular categories (e.g., Hair, Nails, Massage), and promotional banners.
- Search bar accessible to guests; search results show business list with basic info.
- Tapping a business navigates to its detail view; services, reviews, and a "See available slots" button are visible.
- Slot grid is shown but blur/overlay prompts sign-up/login when user selects a slot.
- No authentication required for search, filtering, or viewing pages.

### 4.4 Business Search & Discovery
**Priority:** P0

**Description:** Full-text search with autocomplete and robust filters to help customers find relevant businesses quickly. Supports geolocation-based ranking.

**Acceptance Criteria:**
- Search input with autocomplete suggesting business names, categories, and locations.
- Typing triggers debounced search (300ms); results display business name, rating, distance, and first image.
- Filter by category/subcategory, price range ($, $$, $$$), rating (4+), services offered (e.g., "hair coloring"), and open now.
- Sorting options: relevance (default), rating, distance, price.
- Pagination with infinite scroll; each page loads 20 items.
- Location auto-detected via browser/IP; manual city/address override.
- Search history saved for authenticated users.

### 4.5 Map-based Search
**Priority:** P1

**Description:** Visual map view to browse businesses geographically. Users can move the map to update results in the given area.

**Acceptance Criteria:**
- Toggle between list and map view on search results.
- Map centers on user's approximate location; marker clustering for areas with many businesses.
- Tapping a cluster zooms in; tapping a single marker shows a preview card with photo, name, rating, and a "View" button.
- Dragging the map triggers a search within the new bounds (after idle).
- Custom marker icons per category (optional, P2).
- No performance degradation with 500+ markers due to clustering.

### 4.6 Business Detail View
**Priority:** P0

**Description:** Comprehensive profile for a business, providing all information needed to decide on a booking.

**Acceptance Criteria:**
- Image gallery at top, swipeable, with 1–8 photos (tap to fullscreen).
- Business name, average rating (stars), number of reviews, address with map thumbnail.
- Contact options: call (tel: link), share, website link.
- Expandable sections: Description, Amenities (WiFi, Parking), Opening Hours (collapsed by default, today highlighted).
- Service list grouped by category, showing name, duration, price.
- Staff members (if available) with avatar, name, and specialization.
- Reviews summary (rating distribution) and list of recent reviews with pagination.
- Sticky bottom bar with "Book Now" button and favorite heart.
- Back navigation preserves previous scroll position.

### 4.7 Service Categories
**Priority:** P0

**Description:** Hierarchical categorization of services to aid navigation and filtering. Managed by admins.

**Acceptance Criteria:**
- Categories are tree-like: top-level (Hair), subcategories (Haircut, Coloring, Styling).
- Home screen shows top-level categories as circular icons with name.
- Tapping a category navigates to a page listing subcategories and popular businesses.
- Search results can be filtered by category; breadcrumb shows current category.
- Admin dashboard provides full CRUD for categories, including icon/image upload and ordering.
- Each business can map its services to existing categories.

### 4.8 Booking Flow
**Priority:** P0

**Description:** Seamless, multi-step booking process guiding the user from service selection to confirmation.

**Acceptance Criteria:**
- Step 1: Service selection. User picks service from business profile (can select multiple services for multi-step booking but MVP single service).
- Step 2: Staff selection (optional, if business has staff; otherwise skip). Displays staff list with photo and next available.
- Step 3: Date & Time. Calendar with day view showing available slots computed in real-time. User selects slot.
- Step 4: Review & Payment. Summary card (service, date, time, business, staff, price). Option to add notes (max 300 chars). Payment method selection (saved cards or new card).
- Step 5: Confirmation. Success animation, appointment details, buttons to add to calendar, share, and view appointment.
- Back navigation allowed at each step with data preserved; back on payment step requires re-authorization.
- Booking requires authentication; guest is prompted to login/signup after slot selection and redirected back to flow.
- Booking triggers loading state, handles errors (slot taken during process, payment failed) with clear messaging and retry.

### 4.9 Availability & Slot Computation
**Priority:** P0

**Description:** Core engine that calculates available time slots considering business hours, service duration, staff schedules, existing appointments, buffers, and breaks. Must return slots quickly and accurately.

**Acceptance Criteria:**
- Given a business ID, service ID(s), staff ID (optional), and date range, return an array of start times when the service(s) can be performed.
- Considers: business regular hours, special holiday hours, staff working hours (if staff selection enabled), service duration (plus buffer time defined per service), existing confirmed appointments (and parallel occupancy for multi-staff businesses), breaks/vacation blocks.
- Pseudo-real-time: compute on demand with <1s response time; cache frequently requested date ranges for 30 seconds with invalidation on booking/cancellation.
- If multiple services selected (future), ensures sequential completion within working hours.
- Slot object includes start time, end time, availability confidence indicator.
- Provider portal allows setting buffer time, break periods, and blackout dates; these immediately affect slot computation.
- For staff-less businesses, only one slot at a time; for multi-staff, slots are based on first available staff member or specific staff if requested.

### 4.10 Appointment Management
**Priority:** P0

**Description:** Both customers and providers have tailored views to manage appointments, reschedule, and cancel according to policy.

**Acceptance Criteria:**
- Customer dashboard: tabbed view "Upcoming" and "History". Upcoming shows appointments sorted by date, status (confirmed, pending, in-progress), with actions: Cancel, Reschedule, View details.
- Rescheduling re-enters booking flow pre-filled with previous selections, allowing date/time change; updates slot availability.
- Cancellation: show policy (free cancellation up to X hours, else fee). Confirm dialog, then update status and trigger refund if applicable.
- Provider portal: calendar view (day/week/month) showing bookings for each staff member. Filter by staff, service, status.
- Providers can mark appointment as "no-show", "completed", or cancel on customer request; changes sync in real-time.
- Both receive push notification and email on any change.
- Appointment history includes rebook option (direct to business page with same service).

### 4.11 Favorites
**Priority:** P1

**Description:** Allow customers to save preferred businesses to a personal list for quick access.

**Acceptance Criteria:**
- Heart icon on business cards and detail page toggles favorite status (optimistic update).
- A "Favorites" tab in user profile lists all saved businesses with thumbnail, name, rating, and next available slot.
- Favorites sync across user's devices (stored server-side).
- Optional push notification when a favorited business posts a promotion or new service (can be toggled in notification settings).
- Empty state illustration and CTA to browse businesses.

### 4.12 User Profile
**Priority:** P1

**Description:** Central place for customers to manage personal information, payment methods, notification preferences, and booking history.

**Acceptance Criteria:**
- Edit profile: full name, phone number (mobile) with OTP verification, email (requires re-authentication).
- Profile photo upload with cropping tool; max size 5 MB.
- List saved payment methods: show card brand, last four digits, expiry; add new card (Stripe Elements), delete card with confirmation.
- Notification preferences: toggle push for booking reminders, promotions, messages; email opt-in/opt-out.
- Booking history: filtered by upcoming/past, each entry leads to appointment details.
- Account deletion: request with confirmation, data wiped after 30-day grace period (GDPR).
- Accessibility and offline support for viewing data.

### 4.13 Reviews & Ratings
**Priority:** P1

**Description:** After a completed appointment, customers can rate and review their experience. Providers can respond publicly. Admin moderates content.

**Acceptance Criteria:**
- Post-appointment (after completion), customer receives link/prompt to review: star rating (1-5), optional text (min 10 chars), optional photo upload.
- Reviews are displayed on business detail page with most recent first; sort by most helpful or highest/lowest rating.
- Admin can hide/delete reviews that violate guidelines; flagged reviews queue.
- Business owner can reply to any review (one reply per review). Reply appears below review with owner badge.
- Aggregate rating recalculated on each new published review.
- Users can mark reviews as helpful.
- Review spam prevention: one review per appointment; rate limiting.

### 4.14 Payment Integration
**Priority:** P0

**Description:** Secure handling of payment flow, including card tokenization, pre-authorization, capture, and refunds. Platform fee splitting between admin and provider.

**Acceptance Criteria:**
- Integration with a PCI-DSS compliant gateway (Stripe Connect or equivalent).
- At booking: collect payment method (new card via Stripe Elements or saved card). Pre-authorize the full amount.
- Capture payment upon service completion (or immediately for pre-paid services). Provider can trigger completion in portal.
- For cancellations: refund according to policy; partial refund if cancellation fee applies. Refund processed within payment gateway.
- Platform fee configuration (percentage or fixed) deducted from provider's payout; transparent to customer.
- Payment statuses tracked: authorized, captured, refunded, failed.
- Receipt generated and emailed to customer after capture.
- Save card functionality (tokenized) for future bookings.
- No sensitive card data reaches our servers.

### 4.15 Notifications
**Priority:** P1

**Description:** Multi-channel notification system to keep users informed about bookings, reminders, and promotions. Includes push (mobile/web) and email.

**Acceptance Criteria:**
- Booking confirmation: push + email with appointment details and calendar attachment (.ics).
- Reminder: push 24h and 1h before appointment (configurable per business).
- Cancellation/rescheduling: push and email to both parties.
- Payment receipt: email.
- Marketing notifications: opt-in only, managed in profile preferences.
- Notification payload includes deep link to relevant screen (appointment, business).
- Support for silent notifications to refresh data.
- Delivery tracking and idempotency to avoid duplicates.
- Admin can trigger broadcast push (segmented) for promotions P2.

### 4.16 Provider / Business Owner Portal
**Priority:** P0

**Description:** Web-based dashboard (responsive) for business owners to manage their entire presence on the platform: staff, services, schedules, bookings, and insights.

**Acceptance Criteria:**
- Onboarding: Register as business; submit details (name, address, phone, category, description, photos). Admin approval required before going live.
- Dashboard home: quick stats (today's bookings, upcoming, revenue).
- Appointments: calendar view (day/week/month) with color-coded by service or staff. List view for upcoming/past with filter. Action to confirm, complete, no-show, or cancel with reason.
- Services: CRUD for services; include name, description, duration, price, buffer time, category assignment, active/inactive toggle.
- Staff: add staff members with name, photo, bio, service assignments, and custom working hours (override default business hours). Set break times.
- Business profile: edit description, photos (reorder), amenities, opening hours (regular + special closures).
- Settings: cancellation policy template, buffer time default, notification preferences (reminder timing).
- Insights tab: simple charts showing bookings over time, revenue, top services, new vs. returning clients (mock for MVP, real analytics later).
- Access control: only verified business owners can manage; role-based sharing for employees P2.

### 4.17 Admin Dashboard
**Priority:** P1

**Description:** Super admin interface to govern the platform. Manage businesses, users, categories, content moderation, fees, and view high-level analytics.

**Acceptance Criteria:**
- Businesses list with search, filter by status (pending, active, suspended). Approve/reject new applications; suspend or delete businesses.
- User management: list/search, view profile, suspend/delete, see booking history.
- Categories management: CRUD, order, icon, and parent.
- Review moderation queue: view reported reviews, approve/hide/delete. Record of moderation actions.
- Fee configuration: set platform commission per category/global, define cancellation penalty rules.
- Analytics dashboard: MAU (monthly active users), total bookings, GMV (gross merchandise volume), revenue, cancellation rate, top 5 businesses; date range filter; export CSV.
- System notifications: ability to send push/email to all or targeted segment (optional P2).
- Role-based access: admin roles (super admin, support) with permissions.

### 4.18 Background Jobs (BullMQ)
**Priority:** P0

**Description:** Asynchronous processing of time-consuming or non-critical tasks to keep the API responsive. Managed via BullMQ with Redis as the broker.

**Acceptance Criteria:**
- Email sending: transactional (confirmation, receipts) and bulk marketing, queued for reliable delivery with retries (max 3 attempts, exponential backoff).
- SMS/OTP sending (if used) via queue.
- Reminders: scheduled jobs that scan upcoming appointments and enqueue notification tasks at T-24h and T-1h.
- Payment capture: delayed capture at end of day or provider completion event.
- Slot computation cache pre-warming: regenerate cached available slots for next 7 days during off-peak.
- Admin reports: generate and export CSV in background.
- Cleanup tasks: remove expired tokens, soft-delete old data.
- Queue monitoring dashboard (Bull Board) included for dev/admin visibility.
- Idempotency keys for payment and notification tasks to prevent duplicates.
- Graceful failure handling: dead letter queue and logging.

## 5. Non-Functional Requirements
- **Performance**: API p95 < 200ms; map interactions smooth (60fps); slot computation < 1s for worst-case.
- **Security**: All endpoints over HTTPS; JWT with strong secrets; PCI-DSS compliance via Stripe; data encryption at rest; input sanitization; rate limiting on auth and booking endpoints.
- **Scalability**: Stateless API services for horizontal scaling; Redis caching; CDN for static assets and images.
- **Accessibility**: WCAG 2.1 AA for customer facing web; mobile app complies with platform accessibility guidelines.
- **Data privacy**: GDPR-compliant consent management; right to erasure; data export.

## 6. Glossary
- **Buffer time**: Extra time after a service to clean/prepare; not bookable.
- **Slot**: A possible start time for an appointment of a given duration.
- **GMV**: Gross Merchandise Value – total value of bookings transacted.