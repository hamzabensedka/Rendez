# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a mobile-first marketplace cloning Planity (salon/beauty booking). Ensure user needs captured and prioritized.

## Personas
- **Customer (End User):** seeks beauty & wellness services, browses, books, manages appointments.
- **Business Owner (Provider):** manages salon profile, services, availability, appointments.
- **Admin:** oversees platform, moderates content, views analytics.
- **Guest:** non-authenticated user exploring.

## Priority Legend
- **P0 (Must):** Core MVP, launch blocking.
- **P1 (Should):** Important, soon after MVP.
- **P2 (Could):** Nice-to-have, later.
- **P3 (Won't):** Out of scope for v1.

## Features

### 1. User Authentication
**Priority:** P0
**Description:** Customers and providers sign up/login via email, phone OTP, or social (Google/Apple).
**User Need:** Secure, frictionless access to personalized data.
**Acceptance Criteria:**
- Given a new user, when they submit valid email/phone, they receive OTP and can verify.
- Given a returning user, when credentials valid, they are logged in and token stored securely.
- Password reset flow works.
- Social login returns correct profile and creates account if absent.
- Session persists across app restarts until logout.

### 2. Guest Browse & Explore
**Priority:** P0
**Description:** Non-logged-in users can view home, featured businesses, categories, and business details.
**User Need:** Evaluate platform before committing to signup.
**Acceptance Criteria:**
- Guest can open app, see curated list and promotions.
- Guest can tap a business to see detail (read-only, no booking).
- Prompt to login appears when guest attempts booking or favorite.

### 3. Business Search & Discovery
**Priority:** P0
**Description:** Text search with filters (category, price, rating, distance).
**User Need:** Find relevant businesses quickly.
**Acceptance Criteria:**
- Search returns businesses matching query in name/services/city.
- Filters apply correctly and combine.
- Empty state shown when no results.
- Search history saved for logged-in users.

### 4. Map-based Search
**Priority:** P1
**Description:** Interactive map showing business pins, clustered by area; tap pin opens preview.
**User Need:** Discover nearby businesses visually.
**Acceptance Criteria:**
- Map loads with user location (with permission) centered.
- Pins reflect current filters.
- Tap pin shows bottom-sheet with name, rating, quick book.
- Map respects privacy (no location if denied, defaults to city).

### 5. Business Detail View
**Priority:** P0
**Description:** Comprehensive page: photos, services, staff, hours, reviews, booking CTA.
**User Need:** Assess business before booking.
**Acceptance Criteria:**
- Displays cover image, logo, address, contact.
- Lists services with durations and prices.
- Shows next available slot (computed).
- Reviews section loads with pagination.
- Book button initiates booking flow.

### 6. Service Categories
**Priority:** P0
**Description:** Taxonomy of services (Hair, Nails, Spa, etc.) with subcategories.
**User Need:** Navigate services intuitively.
**Acceptance Criteria:**
- Categories seeded from admin or predefined.
- Each business assigns services to categories.
- Home shows category icons linking to filtered search.
- Subcategory filtering works.

### 7. Booking Flow
**Priority:** P0
**Description:** Multi-step: select service -> staff (optional) -> date/time -> confirm -> pay.
**User Need:** Reserve slot confidently.
**Acceptance Criteria:**
- Only available slots shown (from Availability engine).
- User can select employee if business has multiple.
- Validation prevents double-booking.
- Confirmation screen with summary and add-to-calendar.
- If unpaid, hold slot for 10 min (configurable) via background job.

### 8. Appointment Management
**Priority:** P0
**Description:** List of upcoming/past appointments for customer; reschedule/cancel.
**User Need:** Control their bookings.
**Acceptance Criteria:**
- Upcoming tab shows date, time, business, status.
- Cancel allowed per business policy (free within X hours).
- Reschedule opens same booking flow with prior data.
- Provider receives notification of changes.

### 9. Favorites
**Priority:** P1
**Description:** Save businesses or services for quick access.
**User Need:** Keep shortlist.
**Acceptance Criteria:**
- Heart icon toggles favorite on detail/view.
- Favorites list accessible from profile.
- Guest attempt prompts login.
- Removing updates instantly.

### 10. User Profile
**Priority:** P0
**Description:** Manage personal info, payment methods, notifications settings, appointments.
**User Need:** Self-service account control.
**Acceptance Criteria:**
- Editable name, phone, email, avatar.
- Shows loyalty/stats (optional P2).
- Notification preferences persist.
- Delete account triggers data anonymization.

### 11. Availability & Slot Computation
**Priority:** P0
**Description:** Engine computing open slots from business hours, service duration, staff schedules, existing bookings.
**User Need:** Accurate real-time availability.
**Acceptance Criteria:**
- Given business open 9-17, service 60min, existing booking at 10, slots generated at 9,11,12...16.
- Respect breaks and days-off.
- Timezone correct per business.
- Concurrent requests do not produce overlaps (locking/queue).

### 12. Shared Types & Design System
**Priority:** P0
**Description:** Common UI components (buttons, cards, colors, typography) and shared TS types/API contracts.
**User Need:** Consistent UX across app/web.
**Acceptance Criteria:**
- Design system documented (Figma + code).
- Components reusable, accessible (WCAG AA).
- Shared types used by frontend and backend to avoid mismatch.
- Theming supports light/dark.

### 13. Reviews & Ratings
**Priority:** P1
**Description:** Customers rate (1-5 stars) and review after completed appointment; display aggregated.
**User Need:** Trustworthy social proof.
**Acceptance Criteria:**
- Review possible only for attended appointment.
- Average rating computed and shown on detail.
- Sort reviews by recent/rating.
- Business can respond (P2).
- Inappropriate content flagged to admin.

### 14. Payment Integration
**Priority:** P0
**Description:** Stripe/Apple Pay/Google Pay for deposits or full prepaid.
**User Need:** Secure, convenient checkout.
**Acceptance Criteria:**
- PCI-compliant via tokenization.
- Supports saving card for future.
- Partial deposit logic per business.
- Refund triggered on cancel per policy.
- Failure rolls back booking hold.

### 15. Notifications
**Priority:** P1
**Description:** Push (Firebase/APNs) + email/SMS for booking confirm, remind, cancel, promos.
**User Need:** Timely updates.
**Acceptance Criteria:**
- Opt-in push permission requested contextually.
- Booking confirm sent within 1 min.
- Reminder 24h before (via background job).
- User can mute categories.
- Provider gets new booking alert.

### 16. Provider / Business Owner Portal
**Priority:** P0
**Description:** Web dashboard for businesses to manage profile, services, staff, hours, bookings, payouts.
**User Need:** Operate their listing and accept bookings.
**Acceptance Criteria:**
- Login as provider role.
- CRUD business info, photos, services, categories.
- Set weekly hours and staff schedules.
- View day/week agenda, manually add offline appointments.
- Accept/decline bookings (if approval mode).
- Payout reports from Stripe.

### 17. Admin Dashboard
**Priority:** P1
**Description:** Super-admin web to manage users, businesses, categories, moderation, analytics.
**User Need:** Platform governance.
**Acceptance Criteria:**
- Approve/reject business registrations.
- Suspend users/businesses.
- Edit global categories and design content.
- View KPIs (bookings, GMV, active users).
- Access audit logs.

### 18. Background Jobs (BullMQ)
**Priority:** P0
**Description:** Queue system for async tasks: slot holding expiry, reminders, email/SMS, analytics aggregation.
**User Need:** Reliable deferred processing.
**Acceptance Criteria:**
- Job for releasing expired booking holds runs reliably.
- Retry with backoff on failure.
- Dashboard/metrics for queue health.
- Idempotent processing to avoid duplicate notifications.
- Scales horizontally with Redis.

## Global Acceptance & Non-Functional
- **Performance:** Search < 500ms p95, map pins < 1s.
- **Security:** JWT auth, role-based access, data encryption.
- **Accessibility:** Mobile font scaling, screen reader labels.
- **Localization:** Support EN/FR initially.
- **Analytics:** Events for funnel (search to book).

## Milestones
- **MVP (P0):** Auth, Guest, Search, Detail, Categories, Booking, Availability, Profile, Payment, Provider Portal, Shared Design, Background Jobs.
- **Phase 2 (P1):** Map, Favorites, Reviews, Notifications, Admin.
- **Phase 3 (P2):** Enhancements, loyalty, provider responses.