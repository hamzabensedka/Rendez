# Planity Clone Product Specification
Version 1.0
Date: 2025-04-09
Author: Alex – Product Owner

## 1. Introduction & Vision
Planity Clone is a mobile-first platform that connects consumers with local beauty, wellness, and personal care businesses. The product enables effortless discovery, real-time appointment booking, secure payments, and comprehensive management tools for business owners and administrators. The vision is to become the go-to scheduling hub that maximizes convenience for customers and operational efficiency for providers.

## 2. Target Users
- **End Users / Clients**: individuals searching for services, booking appointments, managing their schedule, and leaving reviews.
- **Business Owners / Providers**: salon, spa, barbershop, clinic, or freelance professionals who manage services, staff, bookings, and customer interactions.
- **Administrators**: platform operators overseeing all businesses, users, content moderation, analytics, and system health.

## 3. Core Principles
- Mobile-first with responsive web support.
- Real-time, conflict-free availability and booking.
- Seamless and secure user experience.
- Extensible design system to guarantee visual and behavioural consistency.

## 4. Feature Specifications
All features are listed with priority and acceptance criteria. Priorities: **P0** = must-have for MVP; **P1** = important for v1.1; **P2** = future enhancement.

### 4.1 User Authentication
**Priority:** P0
**Description:** Account creation, login, and session management with security best practices.
**Acceptance Criteria:**
- New users can sign up with email + password; verification email sent; account activated after verification.
- Social login via Google and Apple SSO.
- Login returns JWT access & refresh tokens; access token expires in 1 hour, refresh token in 30 days.
- “Forgot Password” flow sends reset link; user sets new password.
- Session persistence across app restarts; logout clears tokens and redirects to login.
- Error messages for invalid credentials, duplicate email, network failures.
- All authentication endpoints rate-limited.

### 4.2 Guest Browse & Explore
**Priority:** P1
**Description:** Allow unauthenticated visitors to explore the platform before signing up.
**Acceptance Criteria:**
- Guests can view the home feed, search for businesses, browse categories, and see business details.
- Tapping “Book” prompts login/signup with a seamless flow that returns to the booking after authentication.
- Guest state shows clear call-to-action banners encouraging signup.
- No personal data is collected without consent.

### 4.3 Business Search & Discovery
**Priority:** P0
**Description:** Robust search with filters, sorting, and instant results to help users find the right business.
**Acceptance Criteria:**
- Search by business name, service keyword, or location.
- Results displayed as cards with: business image, name, average rating, distance, and next available slot (if logged in).
- Filters: category, subcategory, price range, minimum rating, open now.
- Sorting: relevance, distance, rating, popularity.
- Infinite scroll with pagination.
- Search query saved in recent searches for logged-in users.
- Empty state with suggestions when no results match.

### 4.4 Map-based Search
**Priority:** P1
**Description:** Interactive map view enabling geographical discovery of businesses.
**Acceptance Criteria:**
- Toggle between list and map view on search results.
- Map shows business markers; clustering if multiple markers in close proximity.
- Tapping a marker displays a summary card (name, rating, distance, main category).
- Map automatically re-centers and searches based on visible bounds.
- User location permission requested; map can center on user’s location.
- Map marker uses category-specific icons.

### 4.5 Business Detail View
**Priority:** P0
**Description:** Comprehensive business profile with all information needed to make a booking decision.
**Acceptance Criteria:**
- Display: photo gallery, business name, address with map link, rating, description, working hours, contact options.
- Services list with duration, price, and description; expand to see staff who perform it.
- Staff section: name, photo, specialties.
- Reviews summary (average rating, breakdown).
- “Favorite” button toggling save state.
- CTA “Book” button that leads to booking flow, pre-selected if a particular service was clicked.
- Show next available slot for each service directly in the list if user is logged in and location/timezone known.

### 4.6 Service Categories
**Priority:** P0
**Description:** Browse businesses by category and subcategory for intuitive exploration.
**Acceptance Criteria:**
- Top-level categories displayed as grid/tiles (e.g., Hair, Nails, Massage, Skin Care).
- Each category has a dedicated page with subcategories and top-rated businesses.
- Categories are searchable and filterable.
- Category icons and names follow the design system.

### 4.7 Booking Flow
**Priority:** P0
**Description:** Step-by-step appointment booking leading to confirmation and payment.
**Acceptance Criteria:**
- Flow: Select service → Select staff (optional if business allows any) → Choose date → Pick available time slot → Optionally add notes/special requests → Review summary (business, service, staff, date/time, price) → Confirm.
- Real-time availability displayed; unavailable slots greyed out.
- For paid services, proceed to payment integration (Stripe) before final confirmation.
- Booking confirmation screen shows appointment details, option to add to calendar, and ability to share.
- Guest user forced to authenticate/signup after reviewing summary; after login, flow resumes at summary.
- Validation: prevent double-booking, handle edge cases like slot taken while user is in flow (display error and refresh slots).
- Loading states and clear error messages.

### 4.8 Appointment Management
**Priority:** P0
**Description:** View, cancel, reschedule, and track appointments.
**Acceptance Criteria:**
- Dashboard with tabs: Upcoming and Past appointments.
- Each appointment card shows business, service, date/time, staff, status (confirmed, pending, cancelled, completed).
- Cancel appointment: follows business cancellation policy; if refund applicable, process via Stripe; confirmation dialogue required.
- Reschedule: opens a modified booking flow that keeps service/staff and fetches new available slots; old appointment cancelled upon successful reschedule.
- Add to calendar (Google/Apple) with deep link.
- Receive push/email confirmation for any change.

### 4.9 Favorites
**Priority:** P1
**Description:** Save and manage preferred businesses.
**Acceptance Criteria:**
- Add/remove business from favorites via heart icon on detail view and list cards.
- Dedicated Favorites screen listing all saved businesses; can sort by date added or rating.
- Favorites persist across sessions and devices (synced to account).
- Quick booking from favorites list.
- Empty state encourages exploration.

### 4.10 User Profile
**Priority:** P1
**Description:** Personal account management and settings.
**Acceptance Criteria:**
- Edit profile: first name, last name, phone number, profile picture (with crop/upload).
- Manage payment methods: add, delete, set default (tokenized via Stripe).
- Notification preferences: toggle push, email, SMS per type (booking confirmations, reminders, promotions).
- Booking history with filter by status.
- Logout and account deletion (with confirmation).
- All changes saved via API.

### 4.11 Availability & Slot Computation
**Priority:** P0
**Description:** Centralized service that computes real-time, conflict-free appointment slots.
**Acceptance Criteria:**
- Takes into account: business working hours, staff schedules, existing appointments, service duration, buffer time between appointments, break times, and time-off.
- Computes slots for a given service on a specific day, returning an array of start times.
- Slots shown only for future, allowing a minimum lead time (e.g., 1 hour).
- When multiple staff can perform the service, aggregate availability; user can select staff if required.
- Handles timezone (store all times in UTC, display in business’s local timezone).
- Prevents overbooking via pessimistic locking at time of booking.
- Cache computed slots briefly (e.g., 30s) to improve performance; invalidate on relevant changes.

### 4.12 Shared Types & Design System
**Priority:** P0
**Description:** Unified TypeScript interfaces and a reusable design component library to ensure consistency across web and mobile.
**Acceptance Criteria:**
- Central package defining interfaces for User, Business, Service, Staff, Appointment, Review, Slot, etc.
- Design tokens for colors, typography, spacing, border radius, shadows.
- Reusable UI components: Button, Card, Rating, Avatar, Modal, Input, Badge, Loader, etc., implemented in React Native and React (web) with same API.
- All components documented in Storybook.
- The design system is imported by all frontend clients; no direct style overrides.

### 4.13 Reviews & Ratings
**Priority:** P1
**Description:** Allow customers to rate and review businesses after a completed appointment.
**Acceptance Criteria:**
- After an appointment is marked “completed”, a notification prompts the user to leave a review within 7 days.
- Review submission: 1–5 star rating and optional text comment.
- Users can edit/delete their own review.
- Business detail page shows average rating, total count, rating distribution, and list of reviews sorted by recency or helpfulness.
- Business owners can reply to reviews (publicly).
- Admin can moderate/hide reviews that violate guidelines.
- Prevent duplicate reviews for the same appointment.

### 4.14 Payment Integration
**Priority:** P0
**Description:** Secure payment processing using Stripe for booking fees and deposits.
**Acceptance Criteria:**
- Integrate Stripe Elements or mobile SDK for PCI-compliant card input.
- Support one-time payment (full or deposit) for a booking.
- Tokenize card details; allow saving cards for future use.
- Process refunds when cancellations meet business policy (automatic partial/full refund via Stripe).
- Transaction history and receipts available in user profile and provider portal.
- Handle payment failures gracefully: retry options, error messages.
- Webhook integration to sync payment status with appointment status.

### 4.15 Notifications
**Priority:** P0
**Description:** Multi-channel notifications to keep users informed.
**Acceptance Criteria:**
- Push notifications for: booking confirmed, reminder (24h and 1h before), cancellation, reschedule, review request, promotional offers (if opted in).
- In-app notification center with read/unread status and deep links to relevant screens.
- Email notifications as fallback with same content.
- Notification preferences configurable in user profile.
- Background jobs (BullMQ) dispatch notifications asynchronously.
- Respect quiet hours per user setting.

### 4.16 Provider / Business Owner Portal
**Priority:** P1
**Description:** Dashboard and management tools for business owners to run their operations.
**Acceptance Criteria:**
- Secure login for providers with role-based access.
- Home dashboard: today’s bookings count, upcoming appointments, revenue summary.
- Services management: CRUD for services (name, duration, price, description, category).
- Staff management: add/edit/remove staff members; set working hours, breaks, assign services.
- Calendar view: daily/weekly/monthly agenda with appointment details; ability to manually add/book for a customer.
- Customer management: view customer history, add notes.
- Review management: respond to reviews.
- Earnings and payout reports: see completed payment totals and Stripe payout status.
- Settings: business information, working hours, timezone, cancellation policy.

### 4.17 Admin Dashboard
**Priority:** P2
**Description:** Super admin panel for platform governance and oversight.
**Acceptance Criteria:**
- Manage all businesses: approve new listings, suspend/reactivate, edit details.
- Manage all users: view profiles, deactivate accounts, resolve complaints.
- Review moderation queue: approve/hide reported reviews.
- Appointment overview: search and filter all bookings, handle disputes.
- System metrics: total users, bookings, revenue; trend charts.
- BullMQ job monitoring: job counts, failure rates, retry manually.
- Feature toggles for gradual rollouts.
- Role-based access control: different admin roles (super admin, support).

### 4.18 Background Jobs (BullMQ)
**Priority:** P0
**Description:** Asynchronous job processing for non-blocking tasks like notifications, reminders, and cleanup.
**Acceptance Criteria:**
- Implement BullMQ with Redis for job queues.
- Jobs: send-push-notification, send-email, appointment-reminder (scheduled by time), process-no-show (delayed after appointment start), daily-revenue-report, expired-token-cleanup.
- Jobs retry with exponential backoff on failure; dead-letter queue for failed jobs after max attempts.
- Monitor queue length and failures via admin dashboard.
- All notification triggers enqueue jobs rather than sending synchronously.

## 5. Non-Functional Requirements
- **Performance:** Search results < 200ms, slot computation < 500ms, booking confirmation < 2s.
- **Security:** OWASP top 10 mitigation, HTTPS, sanitized inputs, rate limiting, JWT best practices, Stripe PCI compliance.
- **Scalability:** Architecture supports horizontal scaling for API and job workers.
- **Accessibility:** WCAG 2.1 AA for web; mobile accessibility basics.
- **Localization:** Support multiple languages and timezone-aware display.

## 6. Implementation Phases (Suggested)
- **Phase 1 (MVP):** P0 features: Auth, Business Search & Discovery, Business Detail, Booking Flow, Appointment Management, Availability & Slot Computation, Shared Types & Design System, Payment Integration, Notifications, Background Jobs.
- **Phase 2 (V1.1):** P1 features: Guest Browse, Map Search, Favorites, User Profile, Reviews & Ratings, Provider Portal.
- **Phase 3 (Future):** P2 features: Admin Dashboard enhancements, advanced analytics, loyalty programs.