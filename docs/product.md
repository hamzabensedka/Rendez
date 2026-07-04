# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with beauty and wellness businesses. Users can discover services, book appointments, manage bookings, and pay. Business owners manage their services, staff, and schedules. Admin oversees the platform. This document defines all features, acceptance criteria, and priorities.

## 2. Features

### 2.1 User Authentication
**Description:** Secure sign-up and login via email/password, Google, and Apple. JWT-based sessions with refresh tokens. Password reset flow.

**Acceptance Criteria:**
- User can register with email and password, receiving a verification email.
- User can log in with verified credentials, receiving access and refresh tokens.
- Social login (Google, Apple) creates or links account seamlessly.
- Forgot password sends reset link; user can set new password.
- Session persists across app restarts using secure token storage.
- Invalid or expired tokens redirect to login.
- All endpoints enforce authentication where required.

**Priority:** P0

### 2.2 Guest Browse & Explore
**Description:** Unauthenticated users can browse businesses, view details, and search, but cannot book or access personalized features.

**Acceptance Criteria:**
- Guest can view home feed with featured businesses.
- Guest can search and filter businesses.
- Guest can view business detail page (services, reviews, map).
- Booking button prompts login/sign-up.
- No personal data is stored for guest sessions.

**Priority:** P0

### 2.3 Business Search & Discovery
**Description:** Full-text search by business name, service, or category. Filters for rating, price range, distance, and availability.

**Acceptance Criteria:**
- Search bar with autocomplete suggestions.
- Results update as user types (debounced).
- Filters: rating (1-5), price (low/medium/high), distance (slider or predefined radii), open now.
- Sort by relevance, rating, distance, price.
- Pagination or infinite scroll.
- Empty state with helpful message.

**Priority:** P0

### 2.4 Map-based Search
**Description:** Interactive map showing business locations as pins. Tap pin to see preview card; tap card to navigate to detail.

**Acceptance Criteria:**
- Map loads with user’s current location (if permitted) or default city center.
- Business pins cluster at high zoom levels.
- Tapping a pin shows a mini card with name, rating, and primary image.
- Tapping mini card opens business detail.
- Map updates when search filters change.
- Performance optimized for up to 500 pins.

**Priority:** P1

### 2.5 Business Detail View
**Description:** Comprehensive page for a business: photos, description, services, staff, reviews, location map, and booking CTA.

**Acceptance Criteria:**
- Image gallery with swipeable photos.
- Business name, rating, review count, address, phone, website.
- Expandable description.
- List of services with name, duration, price.
- Staff list with photo, name, specialties (optional).
- Reviews section with average rating, distribution, and recent reviews.
- Embedded map showing location.
- Prominent “Book Now” button.
- Share button.

**Priority:** P0

### 2.6 Service Categories
**Description:** Hierarchical categories (e.g., Hair > Haircut, Hair Coloring) managed by admin. Used for discovery and filtering.

**Acceptance Criteria:**
- Admin can create, edit, delete categories and subcategories.
- Categories displayed in a browsable grid on home screen.
- Selecting a category shows businesses offering services in that category.
- Category icons and names are configurable.
- Businesses can assign multiple categories to their services.

**Priority:** P0

### 2.7 Booking Flow
**Description:** Step-by-step booking: select service, optional staff, date/time slot, confirm details, and pay. Real-time availability prevents double-booking.

**Acceptance Criteria:**
- User selects a service from business detail.
- Optionally selects a preferred staff member (if business allows).
- Calendar shows available dates; unavailable dates greyed out.
- Time slots shown based on real-time availability (computed from working hours, breaks, existing bookings, service duration).
- Summary screen shows service, staff, date, time, price, and any add-ons.
- User can apply promo code.
- Payment step: card input (Stripe Elements) or saved payment method.
- On success, booking confirmed with a unique ID and details.
- If payment fails, slot is released immediately.
- Booking confirmation triggers email/push notification.

**Priority:** P0

### 2.8 Appointment Management
**Description:** Users view upcoming and past appointments. Cancel or reschedule according to business policy.

**Acceptance Criteria:**
- List of upcoming appointments with date, time, business, service, status.
- Tap to see full details and options.
- Cancel button with confirmation dialog; cancellation policy shown (e.g., free up to 24h before).
- Reschedule flow: select new date/time from available slots; old slot released.
- Past appointments list with ability to leave a review.
- Statuses: confirmed, completed, cancelled, no-show.

**Priority:** P0

### 2.9 Favorites
**Description:** Save businesses to a favorites list for quick access.

**Acceptance Criteria:**
- Heart icon on business cards and detail page to toggle favorite.
- Favorites tab in user profile shows saved businesses.
- List supports removal and tap to navigate.
- Syncs across user’s devices (if logged in).

**Priority:** P1

### 2.10 User Profile
**Description:** Manage personal information, preferences, payment methods, and notification settings.

**Acceptance Criteria:**
- Edit name, email, phone, profile photo.
- Manage saved payment methods (add, delete, set default).
- Notification preferences: push, email, SMS toggles.
- Language and theme settings.
- Link to privacy policy, terms, logout.
- All changes saved to backend.

**Priority:** P1

### 2.11 Availability & Slot Computation
**Description:** Core engine that computes available time slots for a business, considering working hours, breaks, staff schedules, service durations, and existing bookings.

**Acceptance Criteria:**
- Business defines regular working hours per day (e.g., Mon-Fri 9:00-18:00).
- Business can set breaks (e.g., 13:00-14:00).
- Staff members have individual schedules (can differ from business hours).
- Service has a fixed duration (e.g., 60 min).
- System generates slots at configurable intervals (default 15 min).
- Slots are removed if they overlap with any existing booking for the same staff (or any staff if no specific staff selected).
- Buffer time between appointments configurable per business.
- Real-time updates: when a slot is booked, it becomes unavailable immediately for other users.
- API endpoint returns available slots for a given date, service, and optional staff.

**Priority:** P0

### 2.12 Shared Types & Design System
**Description:** Unified TypeScript interfaces for all entities (User, Business, Service, Booking, etc.) and a reusable component library with consistent styling.

**Acceptance Criteria:**
- All data models defined in a shared types package (e.g., `User`, `Business`, `Service`, `Staff`, `Booking`, `Review`, `Category`).
- Design tokens for colors, typography, spacing, shadows.
- Reusable UI components: Button, Card, Input, Modal, Avatar, Rating, Calendar, TimeSlotPicker, MapView.
- Components support loading, empty, error states.
- Responsive and accessible (minimum AA contrast).
- Storybook documentation for all components.

**Priority:** P0

### 2.13 Reviews & Ratings
**Description:** After a completed appointment, users can rate (1-5 stars) and write a review. Displayed on business detail.

**Acceptance Criteria:**
- Prompt to review appears after appointment status changes to “completed”.
- Rating input as star selector; optional text review (min 10 chars).
- User can edit/delete their own review within 48 hours.
- Business detail shows average rating, total reviews, and distribution.
- Reviews list sorted by most recent; paginated.
- Business owner can respond to reviews (owner portal).
- Inappropriate content flagging for admin moderation.

**Priority:** P1

### 2.14 Payment Integration
**Description:** Secure payment processing via Stripe. Supports prepayment or hold on card. Multiple payment methods.

**Acceptance Criteria:**
- Integration with Stripe Elements for PCI-compliant card collection.
- Support for credit/debit cards, Apple Pay, Google Pay.
- Payment flow: create PaymentIntent on server, confirm on client.
- Booking is created only after successful payment.
- Refund capability for cancellations according to policy (admin/owner initiated).
- Saved payment methods for logged-in users (Stripe Customer).
- Transaction history in user profile and owner portal.
- Webhook handling for async events (payment success/failure, disputes).

**Priority:** P0

### 2.15 Notifications
**Description:** Push notifications, email, and SMS for booking confirmations, reminders, cancellations, and promotional messages.

**Acceptance Criteria:**
- Push notifications via FCM/APNs.
- Booking confirmation sent immediately via push and email.
- Reminder 24h and 1h before appointment (configurable).
- Cancellation notification to both user and business.
- In-app notification center with list and read/unread status.
- Opt-in/out preferences in user profile.
- Business owners receive notifications for new bookings, cancellations.
- Admin can send broadcast notifications.

**Priority:** P1

### 2.16 Provider / Business Owner Portal
**Description:** Web dashboard for business owners to manage their profile, services, staff, schedule, bookings, and view analytics.

**Acceptance Criteria:**
- Secure login for business owners (separate from customer accounts).
- Dashboard with key metrics: upcoming bookings, revenue, new clients.
- Manage business profile: name, description, photos, address, contact.
- Service management: add/edit/delete services with name, duration, price, category.
- Staff management: add staff members, assign services, set individual schedules.
- Calendar view of all bookings with filters by staff/service.
- Manual booking creation for walk-ins or phone calls.
- Cancel/reschedule bookings with automatic notification to client.
- Set working hours, breaks, buffer times, booking lead time, cancellation policy.
- View and respond to reviews.
- Basic analytics: bookings over time, revenue, popular services.

**Priority:** P0

### 2.17 Admin Dashboard
**Description:** Super admin panel to manage all businesses, users, categories, disputes, and platform settings.

**Acceptance Criteria:**
- Secure admin login with role-based access.
- Business management: approve/reject new businesses, suspend, view details.
- User management: view, disable accounts, handle reports.
- Category management: CRUD for service categories.
- Review moderation: view flagged reviews, remove if policy violated.
- Dispute handling for payments.
- Platform analytics: total bookings, GMV, active users, top businesses.
- Configuration: commission rates, feature toggles.

**Priority:** P1

### 2.18 Background Jobs (BullMQ)
**Description:** Asynchronous job processing for non-blocking tasks like sending reminders, processing refunds, generating reports.

**Acceptance Criteria:**
- Job queue for sending email/SMS/push notifications (booking confirmations, reminders).
- Scheduled jobs for appointment reminders (24h, 1h before).
- Job to release unpaid booking slots after a timeout (e.g., 10 min).
- Job to process refunds when cancellation approved.
- Daily/weekly report generation for business owners.
- Retry logic with exponential backoff for failed jobs.
- Monitoring dashboard for queue health (Bull Board).

**Priority:** P1

## 3. Non-Functional Requirements
- Performance: API response < 200ms for 95th percentile; slot computation < 500ms.
- Security: HTTPS, input sanitization, rate limiting, OWASP top 10.
- Scalability: Horizontal scaling for API and workers.
- Accessibility: WCAG 2.1 AA for customer-facing UI.
- Localization: Support for multiple languages (English, French initially).

## 4. Priorities Summary
- **P0 (Must-have):** User Authentication, Guest Browse, Business Search, Business Detail, Service Categories, Booking Flow, Appointment Management, Availability & Slot Computation, Shared Types & Design System, Payment Integration, Provider Portal.
- **P1 (Should-have):** Map-based Search, Favorites, User Profile, Reviews & Ratings, Notifications, Admin Dashboard, Background Jobs.
- **P2 (Nice-to-have):** Advanced analytics, loyalty program, multi-language content, social sharing.