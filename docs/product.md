# Planity Clone – Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with beauty and wellness businesses (salons, barbers, spas). It allows browsing, booking, and managing appointments, with provider and admin portals.

## 2. User Roles
- Guest: browse without account
- Customer: registered user
- Provider: business owner or staff
- Admin: platform operator

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** Must
**Description:** Secure signup and login via email, phone, social (Google/Apple).
**Acceptance Criteria:**
- User can register with email and password; email verification required.
- User can login with phone OTP.
- Social login returns valid JWT.
- Passwords hashed with bcrypt.
- Session persists via refresh token.
- Logout invalidates tokens.

### 3.2 Guest Browse and Explore
**Priority:** Must
**Description:** Non-authenticated users can explore homepage, featured businesses, categories.
**Acceptance Criteria:**
- Guest sees curated lists (popular, nearby, new).
- No access to booking; prompted to login when attempting.
- Guest session tracked via anonymous ID for later conversion.

### 3.3 Business Search and Discovery
**Priority:** Must
**Description:** Text search with filters (category, price, rating, distance).
**Acceptance Criteria:**
- Search returns businesses matching query, debounced 300ms.
- Filters apply correctly; result count updates.
- Empty state shown when no results.
- Sorting by relevance, distance, rating.

### 3.4 Map-based Search
**Priority:** Should
**Description:** Interactive map showing business pins; pan and zoom updates results.
**Acceptance Criteria:**
- Map shows pins within viewport.
- Clicking pin opens preview card.
- `Search this area` button refreshes list.
- Uses GPS permission gracefully.

### 3.5 Business Detail View
**Priority:** Must
**Description:** Full profile: photos, services, staff, hours, reviews.
**Acceptance Criteria:**
- Displays cover image, logo, description.
- Lists services with prices and durations.
- Shows next available slot.
- Reviews tab with rating breakdown.
- `Book` CTA visible.

### 3.6 Service Categories
**Priority:** Must
**Description:** Taxonomy of categories (Hair, Nails, Spa) with subcategories.
**Acceptance Criteria:**
- Categories seed data loaded.
- Each business assigned to at least one category.
- Category page lists businesses and services.
- Icons defined in design system.

### 3.7 Booking Flow
**Priority:** Must
**Description:** Multi-step: select service -> staff -> date/time -> confirm -> pay.
**Acceptance Criteria:**
- Only available slots shown (computed).
- User can select preferences (no preference staff).
- Summary shows price, time, duration.
- On confirm, appointment created with pending status.
- Supports reschedule or cancel pre-booking.

### 3.8 Appointment Management
**Priority:** Must
**Description:** Customer views upcoming and past appointments; cancel or reschedule.
**Acceptance Criteria:**
- List grouped by upcoming and past.
- Cancel triggers refund policy check.
- Reschedule opens same booking flow with pre-filled data.
- Provider receives update via notification.

### 3.9 Favorites
**Priority:** Should
**Description:** Save businesses or services to favorites.
**Acceptance Criteria:**
- Heart icon toggles state.
- Favorites list accessible from profile.
- Synced across devices.

### 3.10 User Profile
**Priority:** Must
**Description:** Manage personal info, addresses, payment methods, notification settings.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- Add or remove address.
- View booking history.
- Consent toggles for marketing.

### 3.11 Availability and Slot Computation
**Priority:** Must
**Description:** Backend logic computing slots from business hours, service duration, staff shifts, existing bookings.
**Acceptance Criteria:**
- Generates 15-minute granularity slots.
- Excludes breaks, off-days, holidays.
- Handles multiple staff concurrency.
- Timezone aware per business.

### 3.12 Shared Types and Design System
**Priority:** Must
**Description:** Common TypeScript types, UI components (buttons, cards, inputs) for web and mobile.
**Acceptance Criteria:**
- Package @planity/shared with types (User, Business, Appointment).
- Storybook for components.
- Themes: light and dark, brand colors.
- Accessibility (WCAG AA) compliance.

### 3.13 Reviews and Ratings
**Priority:** Should
**Description:** Customers leave star rating and text after completed appointment.
**Acceptance Criteria:**
- Only verified appointments can review.
- Average rating computed and displayed.
- Moderation queue in admin for inappropriate content.
- Helpful votes.

### 3.14 Payment Integration
**Priority:** Must
**Description:** Stripe, Apple Pay, Google Pay for deposits or full prepayment.
**Acceptance Criteria:**
- Secure PCI-compliant checkout.
- Handles partial refund on cancellation.
- Invoice emailed.
- Failed payment means booking not confirmed.

### 3.15 Notifications
**Priority:** Must
**Description:** Push (Firebase), email, SMS for booking confirm, remind, cancel.
**Acceptance Criteria:**
- Opt-in push permission.
- Templated messages with deep links.
- Reminder 24h before appointment.
- User can mute types.

### 3.16 Provider / Business Owner Portal
**Priority:** Must
**Description:** Web dashboard for businesses to manage profile, services, staff, slots, bookings.
**Acceptance Criteria:**
- CRUD business info, photos.
- Add or edit services, durations, prices.
- Set working hours and staff schedules.
- View calendar, accept or decline bookings.
- Payout reports.

### 3.17 Admin Dashboard
**Priority:** Should
**Description:** Super admin manages users, businesses, categories, moderation.
**Acceptance Criteria:**
- Approve or reject business onboarding.
- Disable accounts.
- View analytics (bookings, revenue).
- Manage categories and featured.

### 3.18 Background Jobs (BullMQ)
**Priority:** Must
**Description:** Queue-based processing for notifications, slot cleanup, reminders, analytics.
**Acceptance Criteria:**
- BullMQ workers on Redis.
- Job types: sendNotification, expirePendingBookings, dailyDigest.
- Retry with backoff.
- Dead-letter queue monitored.

## 4. Prioritization Summary
Must-have: Auth, Guest, Search, Detail, Categories, Booking, Appointment Mgmt, Profile, Availability, Shared Types, Payment, Notifications, Provider Portal, Background Jobs.
Should-have: Map Search, Favorites, Reviews, Admin.
Could-have: loyalty program (future).

## 5. Success Metrics
- Conversion rate guest to booked user greater than 20%.
- Booking completion under 3 minutes.
- Crash-free sessions greater than 99%.