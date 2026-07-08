# Planity Clone - Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specifications and acceptance criteria for Planity Clone, ensuring all user needs are captured and prioritized.
**Scope:** Mobile-first platform connecting clients with beauty & wellness businesses (salons, barbers, spas) for discovery and booking.

## Priorities
- P0: Must-have for MVP launch
- P1: Important for post-MVP / early iteration
- P2: Nice-to-have / later

## Feature Specifications

### 1. User Authentication
**Description:** Secure sign-up/login for clients via email, phone (OTP), and social (Google/Apple).
**Acceptance Criteria:**
- AC1: User can register with email+password; receives verification email.
- AC2: User can log in via OTP sent to phone.
- AC3: JWT token stored securely; session persists.
- AC4: Password reset flow works.
- AC5: Social login returns valid profile.
**Priority:** P0

### 2. Guest Browse & Explore
**Description:** Non-authenticated users can explore businesses and services.
**Acceptance Criteria:**
- AC1: Guest can view home feed of featured businesses.
- AC2: Guest can view business detail and services but cannot book.
- AC3: Prompt to login appears when attempting booking.
**Priority:** P0

### 3. Business Search & Discovery
**Description:** Text search with filters (category, price, rating, distance).
**Acceptance Criteria:**
- AC1: Search returns relevant businesses by name, service, or tag.
- AC2: Filters apply correctly and combine.
- AC3: Results paginate (20 per page).
- AC4: Empty state shown when no results.
**Priority:** P0

### 4. Map-based Search
**Description:** Interactive map showing business pins; user can pan/zoom to reload results.
**Acceptance Criteria:**
- AC1: Map displays pins for businesses in viewport.
- AC2: Tapping pin opens mini detail card.
- AC3: Moving map triggers debounced search for new area.
- AC4: User can toggle list/map view.
**Priority:** P0

### 5. Business Detail View
**Description:** Comprehensive page with info, services, staff, photos, reviews.
**Acceptance Criteria:**
- AC1: Shows address, hours, contact, gallery.
- AC2: Lists services with durations and prices.
- AC3: Displays average rating and review count.
- AC4: "Book" CTA visible.
**Priority:** P0

### 6. Service Categories
**Description:** Taxonomy of services (Hair, Nails, Spa, etc.) with sub-categories.
**Acceptance Criteria:**
- AC1: Categories seeded and editable via admin.
- AC2: Each business assigns offered categories.
- AC3: Users can browse by category from home.
**Priority:** P0

### 7. Booking Flow
**Description:** Multi-step flow: select service -> staff -> date/time -> confirm -> pay.
**Acceptance Criteria:**
- AC1: Only available slots shown (computed via Availability feature).
- AC2: User can select or skip staff.
- AC3: Summary shown before payment.
- AC4: On success, appointment created and confirmation sent.
- AC5: Supports reschedule/cancel from flow.
**Priority:** P0

### 8. Appointment Management
**Description:** Clients view upcoming/past appointments; can cancel/reschedule.
**Acceptance Criteria:**
- AC1: List of appointments with status (confirmed, completed, cancelled).
- AC2: Cancel respects business policy (e.g., 24h).
- AC3: Reschedule opens booking flow with preselected business.
- AC4: Calendar sync (ICS download) provided.
**Priority:** P1

### 9. Favorites
**Description:** Users can save businesses/services.
**Acceptance Criteria:**
- AC1: Heart icon toggles favorite.
- AC2: Favorites list accessible from profile.
- AC3: Push notification for favorite business promo (if enabled).
**Priority:** P1

### 10. User Profile
**Description:** Manage personal info, payment methods, notifications settings.
**Acceptance Criteria:**
- AC1: Edit name, phone, avatar.
- AC2: View saved addresses.
- AC3: Manage notification preferences.
- AC4: GDPR delete account option.
**Priority:** P1

### 11. Availability & Slot Computation
**Description:** Backend logic computing open slots based on business hours, staff shifts, existing bookings, and service duration.
**Acceptance Criteria:**
- AC1: Returns slots at 15-min granularity.
- AC2: Excludes breaks and holidays.
- AC3: Handles multiple staff concurrency.
- AC4: Caches results for performance.
**Priority:** P0

### 12. Shared Types & Design System
**Description:** Common TypeScript types, UI components, color palette, typography.
**Acceptance Criteria:**
- AC1: Repo contains /shared with types (User, Business, Appointment, etc.).
- AC2: Component library (Button, Card, Input) matches Figma.
- AC3: Dark mode supported via theme tokens.
**Priority:** P1

### 13. Reviews & Ratings
**Description:** Clients rate completed appointments (1-5 stars + text).
**Acceptance Criteria:**
- AC1: Review allowed only for past appointments.
- AC2: Business average updates atomically.
- AC3: Profanity filter applied.
- AC4: Owner can respond to reviews.
**Priority:** P1

### 14. Payment Integration
**Description:** Stripe (or similar) for cards, wallets; security compliant.
**Acceptance Criteria:**
- AC1: User can add card via Stripe Elements.
- AC2: Hold or charge based on business setting.
- AC3: Refund triggered on cancel if applicable.
- AC4: Invoice email sent.
**Priority:** P0

### 15. Notifications
**Description:** Push (Firebase), email, SMS for booking confirm, remind, promo.
**Acceptance Criteria:**
- AC1: Transactional notifications sent reliably.
- AC2: User can opt-out per channel.
- AC3: Localized content.
- AC4: Deep links to app.
**Priority:** P0

### 16. Provider / Business Owner Portal
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, bookings.
**Acceptance Criteria:**
- AC1: Auth as business role.
- AC2: CRUD services, staff, hours.
- AC3: View upcoming bookings, manually create.
- AC4: View basic analytics (revenue, visits).
**Priority:** P1

### 17. Admin Dashboard
**Description:** Super-admin managing categories, users, businesses, moderation.
**Acceptance Criteria:**
- AC1: Approve/reject business registrations.
- AC2: Disable users/businesses.
- AC3: Manage service taxonomy.
- AC4: View platform metrics.
**Priority:** P1

### 18. Background Jobs (BullMQ)
**Description:** Queue system for async tasks: reminders, slot cache, report generation, image processing.
**Acceptance Criteria:**
- AC1: BullMQ workers process jobs with retry.
- AC2: Failed jobs logged to dead-letter.
- AC3: Cron jobs for daily reminder 24h before appointment.
- AC4: Scalable horizontally.
**Priority:** P0

## Summary
This spec defines 18 features with clear ACs and priorities to guide MVP and iterative delivery of Planity Clone.