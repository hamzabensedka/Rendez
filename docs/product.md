# Planity Clone - Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, spas, barbers) for discovery, booking, and management. It includes client app, provider portal, admin dashboard, and backend services.

## 2. User Roles
- Guest: browse without account
- Client: registered user
- Business Owner/Provider: manages business profile, services, availability
- Admin: platform oversight

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0
**Description:** Secure signup/login via email, phone (OTP), and social (Google/Apple).
**Acceptance Criteria:**
- User can register with email+password, phone number (SMS OTP), or Google/Apple.
- Passwords hashed (bcrypt). JWT or refresh tokens issued.
- Email verification required for booking.
- Logout invalidates tokens.
- Error states for invalid credentials shown.

### 3.2 Guest Browse & Explore
**Priority:** P0
**Description:** Non-authenticated users can view home, featured businesses, categories.
**Acceptance Criteria:**
- Guest sees curated lists (popular, nearby, new).
- Guest can open business detail but prompted to login for booking.
- No personal data stored for guest.

### 3.3 Business Search & Discovery
**Priority:** P0
**Description:** Text search with filters (category, price, rating, distance).
**Acceptance Criteria:**
- Search returns businesses matching query with debounce.
- Filters apply correctly and combine.
- Empty state shown when no results.
- Results paginated (infinite scroll).

### 3.4 Map-based Search
**Priority:** P1
**Description:** Interactive map showing business pins; tap to preview.
**Acceptance Criteria:**
- Map displays pins within viewport based on search area.
- User can pan/zoom to reload results (debounced).
- Pin clustering for dense areas.
- Tap pin shows bottom sheet with quick info and link to detail.

### 3.5 Business Detail View
**Priority:** P0
**Description:** Comprehensive page with info, services, staff, reviews, booking CTA.
**Acceptance Criteria:**
- Shows cover image, logo, address, hours, contact.
- Lists services with prices and durations.
- Shows aggregate rating and recent reviews.
- 'Book' button initiates flow (login if guest).
- Displays next available slot.

### 3.6 Service Categories
**Priority:** P0
**Description:** Taxonomy of services (Hair, Nails, Spa, etc.) with subcategories.
**Acceptance Criteria:**
- Categories seeded and manageable via admin.
- Each business assigns relevant categories/services.
- Client can browse by category from home.

### 3.7 Booking Flow
**Priority:** P0
**Description:** Multi-step: select service -> staff (optional) -> date/time -> confirm -> pay.
**Acceptance Criteria:**
- Only available slots shown (computed from availability).
- User can select or skip staff.
- Shows price breakdown and duration.
- Confirmation screen with summary and add-to-calendar.
- Booking creates appointment with pending status until payment.

### 3.8 Appointment Management
**Priority:** P0
**Description:** Client views upcoming/past appointments; cancel/reschedule.
**Acceptance Criteria:**
- List grouped by upcoming/past.
- Cancel allowed up to policy limit (e.g., 24h before) with reason.
- Reschedule opens booking flow with previous data.
- Provider can also cancel/confirm.

### 3.9 Favorites
**Priority:** P1
**Description:** Clients save businesses/services.
**Acceptance Criteria:**
- Heart icon toggles favorite on detail/view.
- Favorites list accessible from profile.
- Push notification for favorite business offers (if enabled).

### 3.10 User Profile
**Priority:** P0
**Description:** Manage personal info, payment methods, notifications settings.
**Acceptance Criteria:**
- Edit name, phone, email, avatar.
- View saved addresses.
- Manage notification preferences (email/push/SMS).

### 3.11 Availability & Slot Computation
**Priority:** P0
**Description:** Algorithm generating bookable slots based on business hours, service duration, staff shifts, and existing appointments.
**Acceptance Criteria:**
- Computes slots in 15-min increments respecting buffer.
- Excludes breaks and booked times.
- Handles multiple staff with overlapping hours.
- Timezone aware per business.

### 3.12 Shared Types & Design System
**Priority:** P0
**Description:** Common TypeScript types, UI components (buttons, cards, inputs) for web/mobile.
**Acceptance Criteria:**
- Monorepo package with types (User, Business, Appointment, etc.).
- Storybook for components.
- Consistent theme (colors, typography) used across apps.

### 3.13 Reviews & Ratings
**Priority:** P1
**Description:** Clients rate after completed appointment; display on business.
**Acceptance Criteria:**
- 1-5 star with text, only for past appointments.
- Business can reply to reviews.
- Average rating recalculated; fraud checks (one review per appointment).

### 3.14 Payment Integration
**Priority:** P0
**Description:** Stripe (or similar) for cards, wallets; hold or capture.
**Acceptance Criteria:**
- Secure PCI-compliant checkout (Stripe SDK).
- Supports save card for future.
- Handles refund/cancellation per policy.
- Invoice sent via email.

### 3.15 Notifications
**Priority:** P1
**Description:** Push (FCM/APNs), email, SMS for booking confirm, reminders, promos.
**Acceptance Criteria:**
- Triggered by events (booking created, 24h reminder, cancelled).
- User can opt-out per channel.
- Localized templates.

### 3.16 Provider / Business Owner Portal
**Priority:** P0
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, appointments, analytics.
**Acceptance Criteria:**
- CRUD business info, photos, services, categories.
- Set working hours, staff schedules, breaks.
- View day/week calendar of appointments.
- Accept/decline bookings; mark completed.
- Basic stats (revenue, bookings).

### 3.17 Admin Dashboard
**Priority:** P1
**Description:** Super admin manages categories, users, businesses, disputes, content.
**Acceptance Criteria:**
- Approve/reject business registrations.
- Disable users/businesses.
- Manage service taxonomy.
- View platform metrics.

### 3.18 Background Jobs (BullMQ)
**Priority:** P1
**Description:** Queue-based processing for notifications, reminder emails, slot cache warming, analytics.
**Acceptance Criteria:**
- BullMQ queues with Redis.
- Retry logic and dead-letter.
- Jobs: sendReminder, processPaymentCapture, syncReviews.
- Monitor via Bull Board.

## 4. Prioritization Summary
- P0: Core MVP (Auth, Browse, Search, Detail, Categories, Booking, Appointments, Profile, Availability, Shared Types, Payment, Provider Portal)
- P1: Enhancements (Map, Favorites, Reviews, Notifications, Admin, Background Jobs)
- P2: Future (loyalty, multi-language, etc.)

## 5. Success Metrics
- Booking conversion rate, MAU, provider retention.