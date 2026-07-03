# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with beauty and wellness businesses. It enables users to discover services, book appointments, manage schedules, and pay seamlessly. Business owners manage their offerings, staff, and bookings via a dedicated portal. An admin dashboard oversees the platform. Background jobs handle notifications, reminders, and slot computations.

## 2. User Roles
- **Guest**: Unauthenticated user who can browse, search, and view business details but cannot book.
- **Customer**: Authenticated user with full booking, favorites, profile, and payment capabilities.
- **Provider (Business Owner)**: Authenticated business owner managing services, staff, availability, and appointments.
- **Admin**: Superuser with platform-wide oversight, analytics, and moderation tools.

## 3. Features, Acceptance Criteria & Priorities

### 3.1 User Authentication
**Priority: P0**
- **Sign Up**: Email/password, Google, Apple SSO. Validate email format, password strength (min 8 chars, 1 uppercase, 1 number). Send verification email.
- **Login**: Email/password, SSO. Handle invalid credentials with clear error messages. Lock account after 5 failed attempts for 15 minutes.
- **Password Reset**: Forgot password flow sends reset link via email. Link expires in 1 hour. New password must differ from last 3.
- **Session Management**: JWT tokens with refresh token rotation. Auto-logout after 30 days of inactivity. Logout clears tokens.
- **Role-based Access**: After login, redirect to appropriate home screen (customer, provider, admin). Protect routes based on role.
- **Acceptance Criteria**:
  - User can register with email and password, receive verification email, and verify account.
  - User can login with verified credentials and SSO.
  - Invalid login shows "Invalid email or password".
  - Password reset flow works end-to-end.
  - Tokens refresh silently; expired token redirects to login.
  - Lockout after 5 failed attempts; unlock after 15 minutes.

### 3.2 Guest Browse & Explore
**Priority: P0**
- **Home Feed**: Display featured businesses, popular services, and categories. Infinite scroll with pagination.
- **Search**: Global search bar with autocomplete for business names, services, locations.
- **Filters**: Filter by category, rating, price range, distance, availability.
- **Business Preview**: Tap on a business card to see a summary modal (name, rating, distance, next available slot).
- **Acceptance Criteria**:
  - Guest can browse home feed without login.
  - Search returns relevant results as user types.
  - Filters update results in real-time.
  - Tapping a business opens detail view (read-only).
  - "Book" button prompts login/signup.

### 3.3 Business Search & Discovery
**Priority: P0**
- **Text Search**: Full-text search across business name, description, services, and location. Support typo tolerance (fuzzy search).
- **Category Browsing**: Hierarchical categories (e.g., Hair > Haircut, Coloring).
- **Sorting**: Sort by relevance, rating, distance, price (low-high/high-low).
- **Location-based**: Use device GPS or manual address input. Show results within configurable radius (default 10km).
- **Acceptance Criteria**:
  - Search "hair salon" returns businesses with "hair" in name/services.
  - Typo "hairdreser" still returns relevant results.
  - Category drill-down shows subcategories and count of businesses.
  - Sorting changes order correctly.
  - Location permission denied falls back to manual address entry.

### 3.4 Map-based Search
**Priority: P1**
- **Map View**: Toggle between list and map. Map shows business pins with clustering.
- **Pin Interaction**: Tap pin to see business name, rating, next available slot. Tap again to open detail.
- **Search This Area**: As user moves map, update results for visible area.
- **Acceptance Criteria**:
  - Map loads with user's current location centered.
  - Pins cluster when zoomed out; uncluster on zoom in.
  - Tapping pin shows info card; tapping card navigates to detail.
  - "Search this area" button refreshes results based on map bounds.

### 3.5 Business Detail View
**Priority: P0**
- **Header**: Business name, rating, address, distance, favorite button.
- **Services Tab**: List of services with name, duration, price. Expandable descriptions.
- **Reviews Tab**: Aggregated rating, review list with pagination, ability to sort by recent/highest/lowest.
- **Info Tab**: Description, amenities, photos, opening hours, contact info.
- **Booking CTA**: Floating "Book" button that opens service selection.
- **Acceptance Criteria**:
  - All tabs load data correctly.
  - Favorite toggles state and persists for logged-in users.
  - Reviews show user name, rating, date, comment.
  - Photos gallery with pinch-to-zoom.
  - Opening hours displayed in user's timezone.
  - Book button disabled if business is closed or no slots.

### 3.6 Service Categories
**Priority: P0**
- **Category Tree**: Admin-managed hierarchy (e.g., Beauty > Nails > Manicure).
- **Category Page**: Shows subcategories and top businesses in that category.
- **Service Assignment**: Providers assign services to leaf categories.
- **Acceptance Criteria**:
  - Categories are displayed in a navigable tree.
  - Selecting a leaf category shows businesses offering that service.
  - Admin can add/edit/delete categories.
  - Category changes reflect immediately in search.

### 3.7 Booking Flow
**Priority: P0**
- **Step 1 - Service Selection**: Choose one or more services from the business. Show duration and price.
- **Step 2 - Staff Selection**: If multiple staff, show available staff for selected services. Option "Any available".
- **Step 3 - Date & Time**: Calendar with available dates highlighted. Time slots based on staff availability and service duration. Show real-time slot computation.
- **Step 4 - Confirmation**: Summary of services, staff, date, time, total price. Add notes or special requests.
- **Step 5 - Payment**: If payment required, integrate payment gateway (Stripe). Support saved cards.
- **Post-Booking**: Success screen with appointment details, option to add to calendar, and share.
- **Acceptance Criteria**:
  - User can select multiple services; total duration and price update.
  - Staff selection shows only those who can perform all selected services.
  - Calendar disables dates with no availability.
  - Time slots are computed in real-time considering existing bookings, breaks, and service duration.
  - Booking confirmation sends email and push notification.
  - Payment is processed securely; booking status set to "confirmed" only after successful payment.
  - If payment fails, booking is not created and user sees error.

### 3.8 Appointment Management
**Priority: P0**
- **Upcoming Appointments**: List with date, time, business, service, status. Swipe actions: cancel, reschedule.
- **Past Appointments**: History with ability to rebook or leave a review.
- **Reschedule Flow**: Similar to booking but pre-filled. Must respect cancellation policy (e.g., 24h notice).
- **Cancellation**: Confirm cancellation, show refund policy. If within free cancellation window, refund initiated.
- **Acceptance Criteria**:
  - Upcoming list sorted by soonest first.
  - Cancel button triggers confirmation dialog; after cancel, status updates and slot released.
  - Reschedule opens booking flow with existing selections; new slot must be available.
  - Past appointments show "Leave Review" button if not already reviewed.
  - Cancellation within policy triggers refund; outside policy shows charge.

### 3.9 Favorites
**Priority: P1**
- **Add/Remove**: Heart icon on business cards and detail view. Toggle state.
- **Favorites List**: Dedicated screen listing favorited businesses with quick actions (book, directions).
- **Sync**: Favorites persist across devices for logged-in user.
- **Acceptance Criteria**:
  - Tapping heart adds/removes favorite; visual feedback (animation).
  - Favorites list shows all saved businesses with name, rating, next slot.
  - Unfavoriting removes from list immediately.
  - Favorites survive app restart and login on another device.

### 3.10 User Profile
**Priority: P1**
- **Personal Info**: Name, email, phone, profile picture. Edit with validation.
- **Payment Methods**: Add/delete credit/debit cards. Default card selection.
- **Notification Preferences**: Toggle push/email for booking confirmations, reminders, promotions.
- **App Settings**: Language, theme (light/dark), delete account.
- **Acceptance Criteria**:
  - User can update name and phone; email change requires re-verification.
  - Add card via Stripe Elements; card tokenized, never stored raw.
  - Notification toggles save and reflect in backend.
  - Delete account triggers confirmation and cascades anonymization of data.

### 3.11 Availability & Slot Computation
**Priority: P0**
- **Staff Working Hours**: Providers define recurring weekly schedule per staff (e.g., Mon-Fri 9am-5pm) with breaks.
- **Service Duration**: Each service has a fixed duration and buffer time (cleanup).
- **Slot Generation**: Compute available slots based on staff schedule, existing bookings, breaks, and service duration. Slots are generated dynamically for a given date range.
- **Overbooking Prevention**: Ensure no double-booking; consider travel time if mobile service.
- **Acceptance Criteria**:
  - Slot computation returns all possible start times for a service+staff+date.
  - Slots exclude breaks and existing appointments.
  - If service requires multiple staff, all must be available simultaneously.
  - Buffer time added after service before next slot.
  - Computation is fast (<500ms) for a week's slots.
  - Background job recalculates slots when schedule changes.

### 3.12 Shared Types & Design System
**Priority: P0**
- **TypeScript Interfaces**: Shared types for User, Business, Service, Appointment, Review, etc. Used across frontend and backend.
- **Design Tokens**: Colors, typography, spacing, shadows defined in a central theme.
- **Reusable Components**: Button, Input, Card, Modal, Rating, Calendar, etc. with consistent styling.
- **Acceptance Criteria**:
  - All data models are typed and consistent between API and client.
  - UI components adhere to design tokens; changing a token updates all instances.
  - Storybook or similar documentation for components.

### 3.13 Reviews & Ratings
**Priority: P1**
- **Submit Review**: After completed appointment, user can rate 1-5 stars and write comment (min 10 chars).
- **Display**: Business detail shows average rating, total reviews, and distribution. List with sort/filter.
- **Moderation**: Admin can hide inappropriate reviews. Provider can respond publicly.
- **Acceptance Criteria**:
  - Only customers with completed appointments can review.
  - One review per appointment.
  - Rating updates business average in real-time.
  - Provider response appears below review.
  - Admin can flag/hide reviews; hidden reviews not shown to users.

### 3.14 Payment Integration
**Priority: P0**
- **Payment Gateway**: Stripe integration for card payments. Support 3D Secure.
- **Checkout**: Collect payment during booking confirmation. Use Stripe Payment Intents.
- **Saved Cards**: Securely store cards via Stripe Customer and Payment Methods.
- **Refunds**: Partial/full refunds triggered on cancellation within policy. Admin can issue manual refunds.
- **Payouts**: Providers receive payouts (minus platform fee) via Stripe Connect (or manual).
- **Acceptance Criteria**:
  - Payment flow completes within booking; success/failure handled gracefully.
  - Card details never touch our servers; PCI compliance via Stripe.
  - Saved cards can be selected for future bookings.
  - Refund processed automatically when cancellation meets policy; funds returned within 5-10 days.
  - Admin dashboard shows transaction history and refund status.

### 3.15 Notifications
**Priority: P1**
- **Push Notifications**: Booking confirmation, reminder 24h and 1h before, cancellation, promotional.
- **Email Notifications**: Same events as push, plus password reset, welcome, receipt.
- **In-App Notifications**: Bell icon with feed of recent notifications.
- **Preferences**: User can opt out per channel and type.
- **Acceptance Criteria**:
  - Push notification received on device when app is backgrounded.
  - Email delivered within 1 minute of event.
  - In-app feed shows unread count; tapping marks as read.
  - Notification preferences respected; no push if disabled.
  - Background job (BullMQ) queues and sends notifications reliably.

### 3.16 Provider / Business Owner Portal
**Priority: P0**
- **Dashboard**: Overview of today's appointments, revenue, new reviews.
- **Appointment Management**: View, confirm, cancel, reschedule appointments. Calendar view.
- **Service Management**: CRUD services with name, description, duration, price, category, image.
- **Staff Management**: Add/edit staff, assign services, set working hours and breaks.
- **Business Profile**: Edit business info, photos, opening hours, amenities.
- **Availability Settings**: Define regular hours, special dates (holidays), buffer times.
- **Acceptance Criteria**:
  - Provider can see list of today's appointments with status.
  - Can cancel an appointment with reason; customer notified.
  - Add service with all fields; appears immediately in customer app.
  - Staff schedule changes trigger slot recomputation.
  - Business profile updates reflect in search within minutes.
  - Portal is mobile-responsive.

### 3.17 Admin Dashboard
**Priority: P2**
- **Analytics**: Key metrics: total bookings, revenue, active users, new businesses, cancellation rate. Charts over time.
- **User Management**: List/search users, view details, suspend/delete accounts.
- **Business Management**: Approve new businesses, suspend, view performance.
- **Category Management**: CRUD categories.
- **Review Moderation**: Queue of reported reviews, approve/hide.
- **Transaction Oversight**: View all payments, refunds, disputes.
- **Acceptance Criteria**:
  - Dashboard loads with real-time metrics.
  - Admin can search users by email/name and suspend.
  - New business registrations require admin approval before appearing in search.
  - Category changes propagate instantly.
  - Reported reviews appear in moderation queue; admin can hide with reason.
  - Transaction list filterable by date, status, provider.

### 3.18 Background Jobs (BullMQ)
**Priority: P0**
- **Slot Recomputation**: When staff schedule or service duration changes, recalculate affected slots.
- **Reminders**: Send push/email reminders 24h and 1h before appointment.
- **Notifications**: Queue all notification sends for retry and reliability.
- **Data Cleanup**: Anonymize deleted user data after grace period.
- **Acceptance Criteria**:
  - Jobs are processed reliably with retry on failure.
  - Slot recomputation completes within 2 minutes of schedule change.
  - Reminders sent exactly at scheduled times.
  - Failed notification jobs retry up to 3 times before logging error.
  - BullMQ dashboard accessible for monitoring.

## 4. Non-Functional Requirements
- **Performance**: API response <200ms p95; slot computation <500ms.
- **Scalability**: Support 10k concurrent users; horizontal scaling.
- **Security**: HTTPS, JWT with short expiry, input sanitization, rate limiting.
- **Accessibility**: WCAG 2.1 AA compliance.
- **Localization**: Support multiple languages (i18n).

## 5. Release Phases
- **MVP (P0)**: Auth, guest browse, search, business detail, booking flow, appointment management, availability computation, shared types, payment, provider portal, background jobs.
- **V1 (P1)**: Map search, favorites, user profile, reviews, notifications.
- **V2 (P2)**: Admin dashboard, advanced analytics, loyalty program.

## 6. Glossary
- **Slot**: A bookable time interval for a service with a specific staff member.
- **Buffer**: Extra time after a service before the next appointment.
- **Provider**: Business owner or manager.
- **Customer**: End-user booking services.