# Planity Clone - Product Specification

**Author:** Alex (Product Owner)
**Version:** 1.0
**Goal:** Define complete feature specifications and acceptance criteria for Planity Clone, a mobile-first platform connecting clients with beauty and wellness professionals (salons, barbers, spas). The product mirrors Planity: discovery, booking, payments, and management.

**Priorities:** P0 = MVP must-have, P1 = important for launch or post-MVP, P2 = enhancement.

## 1. User Authentication
- Description: Clients and providers sign up/login via email, phone (OTP), or social (Google/Apple). JWT-based sessions with refresh tokens.
- Acceptance Criteria:
  - AC1: User can register with email+password; receives verification email.
  - AC2: User can login with phone OTP; session persists 30 days.
  - AC3: Password reset flow works.
  - AC4: Social login returns correct profile and creates account if new.
  - AC5: Role (client/provider/admin) assigned and enforced.
- Priority: P0

## 2. Guest Browse & Explore
- Description: Non-authenticated users can explore featured businesses, categories, and deals.
- Acceptance Criteria:
  - AC1: Guest sees home feed with popular businesses and categories.
  - AC2: Guest can view business detail and services but cannot book.
  - AC3: Prompt to login appears when attempting booking or favorite.
- Priority: P0

## 3. Business Search & Discovery
- Description: Text search with filters (category, price, rating, distance, availability).
- Acceptance Criteria:
  - AC1: Search returns relevant businesses by name, service, or keyword.
  - AC2: Filters apply correctly and combine.
  - AC3: Sorting by distance, rating, price, popularity.
  - AC4: Empty state shown when no results.
- Priority: P0

## 4. Map-based Search
- Description: Interactive map (Google Maps/Mapbox) showing business pins; users can pan/zoom to reload results.
- Acceptance Criteria:
  - AC1: Map displays pins for businesses in viewport.
  - AC2: Tapping pin shows mini-card with name, rating, distance.
  - AC3: `Search this area` updates list.
  - AC4: Cluster pins when zoomed out.
- Priority: P1

## 5. Business Detail View
- Description: Comprehensive page with cover photo, info, services, staff, reviews, and booking CTA.
- Acceptance Criteria:
  - AC1: Shows address, hours, contact, gallery.
  - AC2: Lists services with durations and prices.
  - AC3: Displays staff members if applicable.
  - AC4: Shows aggregate rating and recent reviews.
  - AC5: `Book` button initiates booking flow.
- Priority: P0

## 6. Service Categories
- Description: Taxonomy of categories (Hair, Nails, Spa, Barber, etc.) with subcategories and icons.
- Acceptance Criteria:
  - AC1: Categories seed data loaded; editable via admin.
  - AC2: Each business assigns categories; appears in filtered search.
  - AC3: Category landing page lists businesses and subcategories.
- Priority: P0

## 7. Booking Flow
- Description: Multi-step: select service -> choose staff (optional) -> pick date/time slot -> confirm details -> payment -> success.
- Acceptance Criteria:
  - AC1: Only available slots shown based on availability engine.
  - AC2: User can select multiple services in one booking (cart).
  - AC3: Validation prevents double-booking.
  - AC4: Confirmation screen with summary and add-to-calendar.
  - AC5: Booking creates appointment and triggers notification.
- Priority: P0

## 8. Appointment Management
- Description: Clients view upcoming/past appointments; reschedule/cancel per policy. Providers manage via portal.
- Acceptance Criteria:
  - AC1: Client sees list with status (confirmed, completed, cancelled).
  - AC2: Cancellation allowed up to X hours before; shows refund status.
  - AC3: Reschedule opens same booking flow with prior data.
  - AC4: Provider can mark no-show or complete.
- Priority: P0

## 9. Favorites
- Description: Clients save businesses or services for quick access.
- Acceptance Criteria:
  - AC1: Heart icon toggles favorite on detail/view.
  - AC2: Favorites list in profile; synced across devices.
  - AC3: Removing updates instantly.
- Priority: P1

## 10. User Profile
- Description: Manage personal info, payment methods, notifications settings, booking history.
- Acceptance Criteria:
  - AC1: Edit name, phone, avatar.
  - AC2: View saved addresses.
  - AC3: Privacy controls for data.
- Priority: P1

## 11. Availability & Slot Computation
- Description: Engine computing free slots from business hours, staff schedules, service duration, and existing appointments. Supports recurring closures.
- Acceptance Criteria:
  - AC1: Given business+service+date, returns 15-min increment slots.
  - AC2: Respects staff working hours and breaks.
  - AC3: Handles multiple services total duration.
  - AC4: Timezone correct.
  - AC5: Cache invalidated on appointment change.
- Priority: P0

## 12. Shared Types & Design System
- Description: Common TypeScript types, UI components (buttons, cards, inputs), color palette, typography for web/mobile consistency.
- Acceptance Criteria:
  - AC1: Repository with shared package; documented.
  - AC2: Components meet accessibility (contrast, labels).
  - AC3: Used by client and provider apps.
- Priority: P0 (foundational)

## 13. Reviews & Ratings
- Description: Clients rate (1-5 stars) and review after completed appointment; businesses can respond.
- Acceptance Criteria:
  - AC1: Review prompt after appointment completion.
  - AC2: Only verified clients can review.
  - AC3: Average rating recalculated.
  - AC4: Business owner can reply publicly.
  - AC5: Inappropriate content flagged/reported.
- Priority: P1

## 14. Payment Integration
- Description: Stripe/Adyen for cards, wallets; security deposit or full prepay; refunds.
- Acceptance Criteria:
  - AC1: Client pays securely; PCI compliant.
  - AC2: Failed payment handled with retry.
  - AC3: Refund issued per cancellation policy.
  - AC4: Provider payout scheduled.
  - AC5: Invoice email sent.
- Priority: P0

## 15. Notifications
- Description: Push (Firebase), email, SMS for booking confirm, reminder, cancel, promos (opt-in).
- Acceptance Criteria:
  - AC1: Triggered on booking events.
  - AC2: User can opt out per channel.
  - AC3: Localization supported.
  - AC4: Delivery tracked; fallback if push fails.
- Priority: P1

## 16. Provider / Business Owner Portal
- Description: Web dashboard for businesses to manage profile, services, staff, availability, appointments, reviews, analytics.
- Acceptance Criteria:
  - AC1: Onboard business with verification.
  - AC2: CRUD services, categories, pricing.
  - AC3: Set staff schedules and permissions.
  - AC4: View calendar and accept/decline bookings.
  - AC5: Access basic metrics (revenue, bookings).
- Priority: P0

## 17. Admin Dashboard
- Description: Super-admin controls categories, users, businesses, flag content, monitor jobs.
- Acceptance Criteria:
  - AC1: Approve/reject provider signups.
  - AC2: Manage taxonomy and global settings.
  - AC3: Suspend users/businesses.
  - AC4: View platform metrics.
- Priority: P1

## 18. Background Jobs (BullMQ)
- Description: Queue system for async tasks: send notifications, compute availability caches, payout batches, reminder emails.
- Acceptance Criteria:
  - AC1: Jobs enqueued on events (e.g., booking created).
  - AC2: Retry with exponential backoff.
  - AC3: Dead-letter queue for failures.
  - AC4: Dashboard/metrics for queue health.
- Priority: P1

## Summary of Priorities
- P0: Auth, Guest, Search, Detail, Categories, Booking, Appointment, Availability, Shared Types, Payment, Provider Portal.
- P1: Map Search, Favorites, Profile, Reviews, Notifications, Admin, Background Jobs.
- P2: Future enhancements (loyalty, multi-language, etc.)