# Planity Clone - Product Specification

**Owner:** Alex (Product Owner)
**Version:** 1.0
**Goal:** Define complete feature specs and acceptance criteria for a mobile-first platform to discover, book, and manage beauty & wellness appointments, including provider and admin tools.

## Personas
- **Customer:** Searches salons, browses services, books appointments, pays, reviews.
- **Provider:** Manages business profile, services, availability, appointments.
- **Admin:** Oversees platform, moderates content, monitors jobs.
- **System:** Background workers for notifications, reminders, sync.

## Priorities
- **P0:** Must-have for MVP launch.
- **P1:** Important, soon after MVP.
- **P2:** Nice-to-have / later.

## Feature Specifications

### 1. User Authentication
**Description:** Customers sign up/login via email, phone (OTP), or social (Google/Apple). JWT-based sessions with refresh tokens.
**Acceptance Criteria:**
- User can register with email+password; receives verification email.
- User can login with OTP sent to phone.
- Social login returns valid profile.
- Passwords hashed (bcrypt); tokens stored securely.
- Logout invalidates refresh token.
**Priority:** P0

### 2. Guest Browse & Explore
**Description:** Non-authenticated users can explore featured businesses, categories, and deals.
**Acceptance Criteria:**
- Guest sees home screen with curated lists.
- Guest can view business detail and services but cannot book.
- Prompt to login appears when attempting booking.
**Priority:** P0

### 3. Business Search & Discovery
**Description:** Text search with filters (category, price, rating, distance).
**Acceptance Criteria:**
- Search returns relevant businesses by name, service, or tag.
- Filters apply correctly and combine.
- Empty state shown when no results.
- Search history saved for logged-in users.
**Priority:** P0

### 4. Map-based Search
**Description:** Interactive map (Google Maps/Mapbox) showing business pins.
**Acceptance Criteria:**
- Map displays pins within viewport based on query.
- Tapping pin opens mini business card.
- User can drag map to reload results (debounced).
- Cluster pins when zoomed out.
**Priority:** P1

### 5. Business Detail View
**Description:** Full page with photos, services, staff, hours, location, reviews.
**Acceptance Criteria:**
- Shows cover image, logo, address, contact.
- Lists services with durations and prices.
- Displays next available slot (computed).
- Shows aggregate rating and recent reviews.
**Priority:** P0

### 6. Service Categories
**Description:** Taxonomy of categories (Hair, Nails, Spa, Barber, etc.) and sub-categories.
**Acceptance Criteria:**
- Categories seeded in DB and editable by admin.
- Each business assigns categories.
- Navigation menu lists categories with icons.
- Filtering by sub-category works.
**Priority:** P0

### 7. Booking Flow
**Description:** Multi-step: select service -> choose staff (optional) -> pick slot -> confirm -> pay.
**Acceptance Criteria:**
- Only available slots shown (from availability engine).
- User can select multiple services in one cart.
- Confirmation screen summarizes date/time, price.
- On success, appointment created and confirmation sent.
- Edge case: slot taken concurrently handled with lock.
**Priority:** P0

### 8. Appointment Management
**Description:** Customers view upcoming/past appointments; reschedule or cancel.
**Acceptance Criteria:**
- List sorted by date; past in archive.
- Cancel allowed per business policy (free within X hours).
- Reschedule shows new slots.
- Provider receives update via notification.
**Priority:** P0

### 9. Favorites
**Description:** Users bookmark businesses or services.
**Acceptance Criteria:**
- Heart icon toggles favorite.
- Favorites list accessible from profile.
- Removing updates state instantly.
- Synced across devices.
**Priority:** P1

### 10. User Profile
**Description:** Manage personal info, payment methods, notifications settings.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- View booking history.
- Manage saved cards (tokenized).
- Opt-in/out of email/push.
**Priority:** P0

### 11. Availability & Slot Computation
**Description:** Engine computing open slots from business hours, service duration, staff schedules, existing bookings.
**Acceptance Criteria:**
- Generates 15-min granularity slots.
- Respects breaks and days off.
- Handles multiple staff with overlapping hours.
- Excludes slots within lead time (e.g., 2h).
- Timezone aware.
**Priority:** P0

### 12. Shared Types & Design System
**Description:** Common TypeScript types, UI components (buttons, cards, inputs), theme tokens.
**Acceptance Criteria:**
- Monorepo package @planity/shared exports types.
- Storybook documents components.
- Consistent spacing/color across app and portal.
- Used by mobile (React Native) and web.
**Priority:** P0 (foundational)

### 13. Reviews & Ratings
**Description:** Customers rate (1-5 stars) and write text after completed appointment.
**Acceptance Criteria:**
- Only verified appointments can be reviewed.
- Average rating recalculated on new review.
- Provider can respond to reviews.
- Inappropriate content flagged to admin.
**Priority:** P1

### 14. Payment Integration
**Description:** Stripe/Adyen for cards, wallets; deposits or full prepay.
**Acceptance Criteria:**
- Tokenized payment; PCI compliant.
- Supports 3DSecure.
- Refund/cancel triggers partial/full refund.
- Failed payment rolls back booking.
- Invoice email sent.
**Priority:** P0

### 15. Notifications
**Description:** Push (Firebase/APNs), email, SMS for booking confirm, reminder, cancel.
**Acceptance Criteria:**
- User receives push on booking.
- Reminder sent 24h before via BullMQ job.
- Preferences respected (quiet hours).
- Provider gets new booking alert.
**Priority:** P0

### 16. Provider / Business Owner Portal
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, appointments, analytics.
**Acceptance Criteria:**
- Secure login with role business_admin.
- CRUD services with category, price, duration.
- Set weekly hours and exceptions.
- View day/week calendar of appointments.
- Accept/decline booking requests if manual confirmation.
- View basic metrics (bookings, revenue).
**Priority:** P0

### 17. Admin Dashboard
**Description:** Super admin web to manage categories, users, businesses, reviews, monitor jobs.
**Acceptance Criteria:**
- Approve/reject business onboarding.
- Disable user or business.
- Edit global categories.
- View BullMQ queue health.
- Access audit logs.
**Priority:** P1

### 18. Background Jobs (BullMQ)
**Description:** Redis-backed job queue for async tasks: reminders, email, slot cache warming, analytics.
**Acceptance Criteria:**
- Jobs idempotent and retry with backoff.
- Failed jobs move to dead letter.
- Queue metrics exposed.
- Graceful shutdown.
- No job loss on restart.
**Priority:** P0 (infra)

## Non-Functional Requirements
- Mobile-first responsive; iOS/Android via RN, web portal via Next.js.
- Performance: search < 500ms p95.
- Accessibility: WCAG AA.
- Security: OWASP top 10, rate limiting.
- i18n: support FR/EN initially.

## Success Metrics
- 500+ businesses onboarded in 3 months.
- 30% repeat booking rate.
- <2% booking failures.

## Out of Scope (v1)
- In-app chat between customer and provider.
- Loyalty programs (future).
- Multi-currency beyond EUR/USD.