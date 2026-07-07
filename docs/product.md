# Planity Clone - Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, spas, barbers). It enables discovery, booking, payments, and management for clients, business owners, and admins.

## 2. User Roles
- Client (end user)
- Guest (unauthenticated)
- Business Owner / Provider
- Admin

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** Must
**Description:** Secure signup/login via email, phone OTP, and social (Google/Apple).
**Acceptance Criteria:**
- Given a new user, when they submit valid email/password, then account is created and verification email sent.
- When user logs in with correct credentials, a JWT is issued.
- Passwords hashed (bcrypt).
- Social login returns profile and creates account if absent.
- Logout invalidates token.

### 3.2 Guest Browse & Explore
**Priority:** Must
**Description:** Unauthenticated users can view featured businesses, categories, and articles.
**AC:**
- Guest can open home screen with curated lists.
- Guest attempting to book is redirected to login.
- No personal data stored for guest.

### 3.3 Business Search & Discovery
**Priority:** Must
**Description:** Text search with filters (category, price, rating, distance).
**AC:**
- Search returns businesses matching query within 50km by default.
- Filters apply correctly and results update.
- Empty state shown when no results.
- Search history saved for authenticated users.

### 3.4 Map-based Search
**Priority:** Must
**Description:** Interactive map (Google Maps/Mapbox) showing business pins.
**AC:**
- Map renders pins for businesses in viewport.
- Clicking pin opens mini detail card.
- User can pan/zoom to reload results (debounced).
- Search this area button updates list.

### 3.5 Business Detail View
**Priority:** Must
**Description:** Show info, services, staff, photos, reviews, booking CTA.
**AC:**
- Displays address, hours, phone, gallery.
- Lists services with durations and prices.
- Shows aggregate rating and recent reviews.
- Book button initiates booking flow.

### 3.6 Service Categories
**Priority:** Must
**Description:** Taxonomy of services (Hair, Nails, Spa, etc.) with subcategories.
**AC:**
- Categories seed data present.
- Business assigns services to categories.
- Clients browse by category from home.

### 3.7 Booking Flow
**Priority:** Must
**Description:** Multi-step: select service -> staff -> date/time -> confirm -> pay.
**AC:**
- Only available slots shown based on availability engine.
- User can select or skip staff (if business allows).
- On confirm, appointment created with pending status until payment.
- Supports reschedule/cancel from confirmation screen.

### 3.8 Appointment Management
**Priority:** Must
**Description:** Clients view upcoming/past appointments; owners manage theirs.
**AC:**
- Client sees status (confirmed, completed, cancelled).
- Client can cancel up to 24h before without penalty (configurable).
- Owner can manually confirm or mark completed.
- Calendar sync (ICS download) provided.

### 3.9 Favorites
**Priority:** Should
**Description:** Save businesses or services for quick access.
**AC:**
- Authenticated user can favorite/unfavorite.
- Favorites list accessible from profile.
- Push notification for favorite business offers (if enabled).

### 3.10 User Profile
**Priority:** Must
**Description:** Manage personal info, payment methods, notifications settings.
**AC:**
- User edits name, phone, avatar.
- User adds/deletes cards (tokenized).
- User opts in/out of email/SMS/push.

### 3.11 Availability & Slot Computation
**Priority:** Must
**Description:** Engine computing free slots from business hours, staff schedules, existing bookings, service duration.
**AC:**
- Given business open 9-17, service 60min, no bookings, slots at 9,10,11,12,13,14,15,16 generated.
- Overlapping appointments removed.
- Staff leave/unavailability respected.
- Timezone handled per business.

### 3.12 Shared Types & Design System
**Priority:** Must
**Description:** Common TS types, UI components (buttons, cards, inputs), theme tokens.
**AC:**
- Monorepo package @planity/ui and @planity/types.
- Components documented (Storybook).
- Design follows brand color/type scale.

### 3.13 Reviews & Ratings
**Priority:** Must
**Description:** Clients rate (1-5 stars) and write text after completed appointment.
**AC:**
- Review allowed only for attended appointments.
- Average rating recalculated on new review.
- Owner can respond to reviews.
- Inappropriate content flagged/reported.

### 3.14 Payment Integration
**Priority:** Must
**Description:** Stripe/Adyen for cards, wallets; hold or capture.
**AC:**
- Payment intent created at booking confirm.
- On success, appointment confirmed.
- Refund/cancel triggers partial/full refund per policy.
- PCI compliant (no raw card data on server).

### 3.15 Notifications
**Priority:** Must
**Description:** Email, SMS, push (Firebase/APNs) for booking, reminders, promos.
**AC:**
- Reminder sent 24h before appointment.
- User receives push if opted in.
- Provider gets new booking alert.
- Unsubscribe links in emails.

### 3.16 Provider / Business Owner Portal
**Priority:** Must
**Description:** Web dashboard for businesses to manage profile, services, staff, schedule, bookings, analytics.
**AC:**
- Owner can create/edit business, add services with prices/durations.
- Owner sets weekly hours and staff schedules.
- Owner views upcoming bookings and can manually add walk-ins.
- Basic reports: revenue, utilization.

### 3.17 Admin Dashboard
**Priority:** Should
**Description:** Super-admin panel for platform oversight.
**AC:**
- Manage users, businesses, categories.
- Suspend non-compliant businesses.
- View global metrics (GMV, active users).
- Configure commission rates.

### 3.18 Background Jobs (BullMQ)
**Priority:** Must
**Description:** Redis-backed queue for async tasks: reminders, slot cache, image processing, analytics.
**AC:**
- Job sendReminder scheduled 24h pre-appointment.
- Failed jobs retried with backoff.
- Queue dashboard (Bull Board) for monitoring.
- Idempotent job handlers.

## 4. Prioritization Summary
- Must: Auth, Guest, Search, Map, Detail, Categories, Booking, Appt Mgmt, Profile, Availability, Shared Types, Reviews, Payment, Notifications, Provider Portal, Background Jobs.
- Should: Favorites, Admin Dashboard.
- Could: Multi-language, loyalty program (future).

## 5. Success Metrics
- Booking conversion > 20% from detail view.
- <2% payment failure.
- NPS > 40.
