# Planity Clone – Product Specification

**Owner:** Alex (Product Owner)
**Version:** 1.0
**Goal:** A mobile-first platform connecting clients with beauty & wellness professionals (salons, barbers, spas) enabling discovery, booking, payments, and management.

## Prioritization Legend
- **P0 (Must):** Core MVP, launch blocking.
- **P1 (Should):** Important, soon after MVP.
- **P2 (Could):** Enhancement, post-launch.
- **P3 (Won't):** Out of scope for v1.

## 1. User Authentication
**Priority:** P0
**Description:** Secure signup/login for clients via email, phone OTP, and social (Google/Apple). JWT-based sessions.
**Acceptance Criteria:**
- AC1: User can register with email+password; receives verification email.
- AC2: User can login with phone OTP; session persists 30 days.
- AC3: Social login returns valid profile and creates account if absent.
- AC4: Password reset flow works and expires links in 1h.
- AC5: Role claim distinguishes client, provider, admin.

## 2. Guest Browse & Explore
**Priority:** P0
**Description:** Non-authenticated users can explore featured businesses, categories, and limited search.
**Acceptance Criteria:**
- AC1: Guest sees home feed with top-rated businesses and promotions.
- AC2: Guest can view business detail but booking prompts login.
- AC3: No personal data stored for guest.

## 3. Business Search & Discovery
**Priority:** P0
**Description:** Text search with filters (category, price, rating, distance, availability).
**Acceptance Criteria:**
- AC1: Search returns relevant businesses by name, service, or tag.
- AC2: Filters combine with AND logic and update results in <500ms.
- AC3: Empty state shows suggestions.

## 4. Map-based Search
**Priority:** P1
**Description:** Interactive map (Google Maps/Mapbox) showing business pins; tap to preview.
**Acceptance Criteria:**
- AC1: Map renders pins within viewport bounding box.
- AC2: Pin clustering for >50 results.
- AC3: Selecting pin opens bottom sheet with quick info and CTA.

## 5. Business Detail View
**Priority:** P0
**Description:** Comprehensive page: gallery, services, staff, hours, reviews, location.
**Acceptance Criteria:**
- AC1: Displays all active services with durations and prices.
- AC2: Shows next available slot computed from availability.
- AC3: Gallery supports swipe; lazy loads images.
- AC4: "Book" button initiates flow or login.

## 6. Service Categories
**Priority:** P0
**Description:** Taxonomy of categories (Hair, Nails, Spa, Barber) with sub-services.
**Acceptance Criteria:**
- AC1: Categories seeded and manageable via admin.
- AC2: Each business maps to >=1 category.
- AC3: Category page lists businesses and filters.

## 7. Booking Flow
**Priority:** P0
**Description:** Multi-step: select service -> staff (optional) -> date/time -> confirm -> pay.
**Acceptance Criteria:**
- AC1: Only slots returned by availability engine are selectable.
- AC2: User can apply promo code; price updates.
- AC3: On confirm, appointment created with pending status until payment.
- AC4: Supports reschedule/cancel from flow.

## 8. Appointment Management
**Priority:** P0
**Description:** Client views upcoming/past appointments; cancel/reschedule with rules.
**Acceptance Criteria:**
- AC1: List sorted by date; past archived.
- AC2: Cancel allowed up to 24h before (configurable per business).
- AC3: Reschedule shows alternative slots.
- AC4: Calendar sync (ICS download) P2.

## 9. Favorites
**Priority:** P1
**Description:** Clients save businesses/services for quick access.
**Acceptance Criteria:**
- AC1: Heart icon toggles favorite; persisted per user.
- AC2: Favorites list accessible from profile.
- AC3: Business detail reflects favorited state.

## 10. User Profile
**Priority:** P0
**Description:** Manage personal info, payment methods, notifications pref, addresses.
**Acceptance Criteria:**
- AC1: Edit name, phone, avatar.
- AC2: View saved cards (tokenized).
- AC3: Notification toggles respected.

## 11. Availability & Slot Computation
**Priority:** P0
**Description:** Engine computing open slots from business hours, staff shifts, service duration, existing bookings, breaks.
**Acceptance Criteria:**
- AC1: Given business+service+date, returns 15-min increment slots.
- AC2: Respects buffer time between appointments.
- AC3: Handles recurring weekly schedules and exceptions (holidays).
- AC4: Performance: computes for 1 week in <200ms.

## 12. Shared Types & Design System
**Priority:** P0
**Description:** Common TS types, UI components (buttons, cards, modals), theme tokens.
**Acceptance Criteria:**
- AC1: Monorepo package `@planity/design` with Storybook.
- AC2: Components accessible (a11y) and responsive.
- AC3: Types consumed by mobile (React Native) and web admin.

## 13. Reviews & Ratings
**Priority:** P1
**Description:** Clients rate (1-5 stars) and review after completed appointment.
**Acceptance Criteria:**
- AC1: Review prompted 24h post-appointment.
- AC2: Business detail shows average and distribution.
- AC3: Provider can respond; flagging for moderation.
- AC4: One review per appointment.

## 14. Payment Integration
**Priority:** P0
**Description:** Stripe/PayPal for cards, wallets; split payments to provider minus commission.
**Acceptance Criteria:**
- AC1: PCI-compliant tokenization; no raw card stored.
- AC2: Successful payment flips appointment to confirmed.
- AC3: Refund/cancel triggers partial or full reversal per policy.
- AC4: Invoice email sent.

## 15. Notifications
**Priority:** P1
**Description:** Push (FCM/APNs), email, SMS for booking confirm, reminders, promos.
**Acceptance Criteria:**
- AC1: Reminder sent 24h and 2h before appointment.
- AC2: Opt-out per channel honored.
- AC3: Localized templates.

## 16. Provider / Business Owner Portal
**Priority:** P0 (for MVP need at least basic)
**Description:** Web dashboard for providers to manage profile, services, staff, availability, bookings, payouts.
**Acceptance Criteria:**
- AC1: Login as provider role.
- AC2: CRUD business info, services, categories.
- AC3: Set weekly hours and exceptions.
- AC4: View day/week calendar of appointments.
- AC5: Accept/decline bookings (if manual confirmation mode).

## 17. Admin Dashboard
**Priority:** P1
**Description:** Super-admin manages categories, users, businesses, disputes, content.
**Acceptance Criteria:**
- AC1: Approve/reject business onboarding.
- AC2: Global config (commission %, cancel window).
- AC3: View analytics (GMV, active users).
- AC4: Moderate reviews.

## 18. Background Jobs (BullMQ)
**Priority:** P0
**Description:** Queue-based workers for notifications, reminder emails, slot cache warming, analytics aggregation.
**Acceptance Criteria:**
- AC1: BullMQ queues with Redis; retry/backoff.
- AC2: Job for sending reminders runs hourly.
- AC3: Failed jobs logged and alerted.
- AC4: Idempotent processing.

## Non-functional Requirements
- Performance: p95 API <300ms.
- Security: OAuth2, encryption at rest.
- i18n: EN/FR initial.
- Accessibility: WCAG 2.1 AA.

## Milestones
- MVP (P0): Auth, Guest, Search, Detail, Categories, Booking, Appt, Profile, Availability, Design System, Provider Portal, Payments, Background Jobs.
- V1.1 (P1): Map, Favorites, Reviews, Notifications, Admin.
- V1.2 (P2): Calendar sync, advanced filters.