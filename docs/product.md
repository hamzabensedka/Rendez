# Planity Clone - Product Specification

**Owner:** Alex (Product Owner)
**Version:** 1.0
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style salon/beauty booking platform (mobile-first web app).

## 1. User Authentication
- **Description:** Secure signup/login for customers and businesses via email, phone OTP, and social.
- **Acceptance Criteria:**
  - AC1: User can register with email+password; receives verification email.
  - AC2: User can login with OTP sent to phone.
  - AC3: JWT tokens issued, refreshed securely.
  - AC4: Password reset flow works.
  - AC5: Role-based access (customer, provider, admin).
- **Priority:** P0 (Must)

## 2. Guest Browse & Explore
- **Description:** Non-logged-in users can explore featured businesses and services.
- **Acceptance Criteria:**
  - AC1: Guest can view home feed with popular businesses.
  - AC2: Guest prompted to login only when attempting to book.
  - AC3: Guest session persists cart/intent until login.
- **Priority:** P1 (Should)

## 3. Business Search & Discovery
- **Description:** Text search with filters (category, price, rating, distance).
- **Acceptance Criteria:**
  - AC1: Search returns relevant businesses by name, service, location.
  - AC2: Filters apply correctly and combine.
  - AC3: Sorting by relevance, distance, rating, price.
  - AC4: Empty state handled.
- **Priority:** P0

## 4. Map-based Search
- **Description:** Interactive map showing business pins; user can pan/zoom to discover.
- **Acceptance Criteria:**
  - AC1: Map renders with pins within viewport.
  - AC2: Clicking pin opens mini business card.
  - AC3: Map updates results as user moves map (debounced).
  - AC4: `Search this area` button.
- **Priority:** P1

## 5. Business Detail View
- **Description:** Full page with info, services, staff, photos, reviews, booking CTA.
- **Acceptance Criteria:**
  - AC1: Shows address, hours, contact, gallery.
  - AC2: Lists services with durations/prices.
  - AC3: Displays aggregate rating and recent reviews.
  - AC4: `Book` button initiates flow.
- **Priority:** P0

## 6. Service Categories
- **Description:** Taxonomy of beauty categories (Hair, Nails, Spa, etc.) with subcategories.
- **Acceptance Criteria:**
  - AC1: Categories seed data loaded.
  - AC2: Businesses assign services to categories.
  - AC3: Users browse by category from home.
- **Priority:** P0

## 7. Booking Flow
- **Description:** Multi-step: select service -> staff (optional) -> date/time -> confirm -> pay.
- **Acceptance Criteria:**
  - AC1: Only available slots shown (computed).
  - AC2: User can select multiple services in one booking.
  - AC3: Summary shows total price/time.
  - AC4: On confirm, appointment created pending payment.
- **Priority:** P0

## 8. Appointment Management
- **Description:** Customers view upcoming/past appointments; reschedule/cancel.
- **Acceptance Criteria:**
  - AC1: List grouped by status.
  - AC2: Cancel respects business policy (free within X hours).
  - AC3: Reschedule shows new slots.
  - AC4: Provider gets notified.
- **Priority:** P0

## 9. Favorites
- **Description:** Users bookmark businesses/services.
- **Acceptance Criteria:**
  - AC1: Add/remove favorite from list/detail.
  - AC2: Favorites list in profile.
  - AC3: Sync across devices.
- **Priority:** P2 (Could)

## 10. User Profile
- **Description:** Manage personal info, payment methods, notifications settings.
- **Acceptance Criteria:**
  - AC1: Edit name, phone, email.
  - AC2: View booking history.
  - AC3: Manage saved cards (tokenized).
- **Priority:** P1

## 11. Availability & Slot Computation
- **Description:** Backend logic merging business hours, staff shifts, service duration, existing bookings to generate slots.
- **Acceptance Criteria:**
  - AC1: Correctly excludes breaks and booked times.
  - AC2: Handles multiple staff and parallel capacity.
  - AC3: Timezone aware.
  - AC4: Caches slots for performance.
- **Priority:** P0

## 12. Shared Types & Design System
- **Description:** Common TS types, UI components (buttons, cards, modals) consistent with brand.
- **Acceptance Criteria:**
  - AC1: Design tokens (color, spacing) defined.
  - AC2: Reusable components documented.
  - AC3: Types shared between frontend and backend.
- **Priority:** P1 (Foundational)

## 13. Reviews & Ratings
- **Description:** Post-appointment reviews with star rating, text, photos.
- **Acceptance Criteria:**
  - AC1: Only verified customers can review.
  - AC2: Average rating computed and displayed.
  - AC3: Business can respond.
  - AC4: Moderation by admin for inappropriate content.
- **Priority:** P1

## 14. Payment Integration
- **Description:** Stripe/PCI-compliant payments, deposits, refunds.
- **Acceptance Criteria:**
  - AC1: Card payment processed securely.
  - AC2: Partial deposit option per business.
  - AC3: Refund/cancel triggers correct flow.
  - AC4: Invoice email sent.
- **Priority:** P0

## 15. Notifications
- **Description:** Email, SMS, push for booking confirm, reminders, cancellations.
- **Acceptance Criteria:**
  - AC1: Triggered by events (booking created, 24h reminder).
  - AC2: User preferences respected.
  - AC3: Provider gets new booking alert.
- **Priority:** P1

## 16. Provider / Business Owner Portal
- **Description:** Web dashboard for businesses to manage profile, services, staff, availability, bookings.
- **Acceptance Criteria:**
  - AC1: CRUD on business info, services, staff.
  - AC2: Set working hours and breaks.
  - AC3: View calendar of appointments.
  - AC4: Accept/decline bookings (if manual).
  - AC5: View analytics (revenue, utilization).
- **Priority:** P0

## 17. Admin Dashboard
- **Description:** Super admin manages categories, users, businesses, reviews moderation.
- **Acceptance Criteria:**
  - AC1: Approve/reject business registrations.
  - AC2: Disable users/businesses.
  - AC3: Manage service categories.
  - AC4: View platform metrics.
- **Priority:** P1

## 18. Background Jobs (BullMQ)
- **Description:** Async processing for notifications, slot cache warming, reminder emails, analytics.
- **Acceptance Criteria:**
  - AC1: Queue for sending notifications reliable with retry.
  - AC2: Cron job for daily slot pre-computation.
  - AC3: Failed jobs logged and alerted.
  - AC4: Scalable workers.
- **Priority:** P1

## Priority Legend
- P0: Must have for MVP
- P1: Should have soon after
- P2: Nice to have later

## Summary
This spec defines all required features with clear acceptance criteria and priorities to guide development of Planity Clone.