# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first marketplace for booking beauty and wellness appointments. It connects clients with salons, barbers, and independent professionals. This document defines features, acceptance criteria, and priorities (P0 critical, P1 important, P2 nice-to-have).

## 1. User Authentication
**Priority:** P0
**Description:** Secure registration and login for clients.
**Acceptance Criteria:**
- AC1: User can sign up with email/password; verification email sent.
- AC2: Login returns JWT stored securely on device.
- AC3: Passwords hashed with bcrypt; no plain text.
- AC4: Social login (Google/Apple) supported.
- AC5: Forgot password flow sends reset link.
- AC6: Logout invalidates token.

## 2. Guest Browse & Explore
**Priority:** P0
**Description:** Allow non-logged-in users to discover platform.
**Acceptance Criteria:**
- AC1: Guest sees home feed with featured businesses and categories.
- AC2: Guest can open business detail but booking triggers auth modal.
- AC3: Guest session does not persist personal data.

## 3. Business Search & Discovery
**Priority:** P0
**Description:** Text and filter search for businesses and services.
**Acceptance Criteria:**
- AC1: Search by name, service, or professional.
- AC2: Filters: location, price, rating, availability date.
- AC3: Results paginated, sorted by relevance/distance.
- AC4: Empty state handled gracefully.

## 4. Map-based Search
**Priority:** P1
**Description:** Visual map with pins of businesses.
**Acceptance Criteria:**
- AC1: Map shows businesses within viewport.
- AC2: Tap pin opens preview card.
- AC3: Radius filter updates results.
- AC4: Uses device geolocation with permission prompt.

## 5. Business Detail View
**Priority:** P0
**Description:** Comprehensive page for a business.
**Acceptance Criteria:**
- AC1: Displays gallery, address, hours, services, staff.
- AC2: Shows ratings summary and recent reviews.
- AC3: Call/website buttons functional.
- AC4: "Book" button initiates booking flow.

## 6. Service Categories
**Priority:** P0
**Description:** Taxonomy of services (hair, nails, massage, etc.).
**Acceptance Criteria:**
- AC1: Hierarchical categories (e.g., Hair > Cut > Women).
- AC2: Each category maps to businesses offering it.
- AC3: Category icons in design system.

## 7. Booking Flow
**Priority:** P0
**Description:** Multi-step booking: service -> staff -> date/time -> confirm.
**Acceptance Criteria:**
- AC1: User selects service and optional staff.
- AC2: Available slots computed from availability.
- AC3: Shows price and duration before confirm.
- AC4: On confirm, appointment created and payment triggered.
- AC5: Confirmation screen and notification sent.

## 8. Appointment Management
**Priority:** P0
**Description:** View upcoming/past appointments, reschedule, cancel.
**Acceptance Criteria:**
- AC1: List grouped by upcoming/past.
- AC2: Cancel respects business policy (free within 24h).
- AC3: Reschedule opens same booking flow with prefilled data.
- AC4: Add to calendar option.

## 9. Favorites
**Priority:** P1
**Description:** Save businesses or professionals.
**Acceptance Criteria:**
- AC1: Heart icon toggles favorite.
- AC2: Favorites list in profile.
- AC3: Syncs across devices for logged-in user.

## 10. User Profile
**Priority:** P0
**Description:** Manage personal info, payment methods, settings.
**Acceptance Criteria:**
- AC1: Edit name, phone, avatar.
- AC2: View booking history.
- AC3: Notification preferences toggle.
- AC4: Delete account with confirmation.

## 11. Availability & Slot Computation
**Priority:** P0
**Description:** Generate bookable slots from business hours, staff shifts, service duration, and existing appointments.
**Acceptance Criteria:**
- AC1: Exclude past times and breaks.
- AC2: Buffer between appointments configurable.
- AC3: Concurrent staff handled independently.
- AC4: Recalculates on appointment change via background job.

## 12. Shared Types & Design System
**Priority:** P1
**Description:** Common TypeScript types, UI components, theme.
**Acceptance Criteria:**
- AC1: Defined types for User, Business, Appointment, etc.
- AC2: Reusable Button, Card, Input, Modal components.
- AC3: Color palette, typography, spacing tokens documented.
- AC4: Used consistently across client and provider apps.

## 13. Reviews & Ratings
**Priority:** P1
**Description:** Clients rate and review after completed appointment.
**Acceptance Criteria:**
- AC1: 1-5 star rating and text review.
- AC2: Only verified appointments can review.
- AC3: Business can respond to reviews.
- AC4: Average rating displayed on detail view.

## 14. Payment Integration
**Priority:** P0
**Description:** Secure payment via Stripe/Payment gateway.
**Acceptance Criteria:**
- AC1: Save card for future use (tokenized).
- AC2: Charge on booking or no-show policy.
- AC3: Refund handled for cancellations.
- AC4: PCI-compliant, no raw card data stored.

## 15. Notifications
**Priority:** P1
**Description:** Push, email, SMS for booking, reminders, promotions.
**Acceptance Criteria:**
- AC1: Booking confirmation sent immediately.
- AC2: Reminder 24h before via push/SMS.
- AC3: Opt-out respected.
- AC4: Provider gets new booking alert.

## 16. Provider / Business Owner Portal
**Priority:** P0
**Description:** Web/app for businesses to manage profile, services, staff, availability, bookings.
**Acceptance Criteria:**
- AC1: CRUD business info, photos, services.
- AC2: Manage staff accounts and working hours.
- AC3: View calendar of appointments.
- AC4: Accept/decline bookings (if manual).
- AC5: Access basic analytics (revenue, visits).

## 17. Admin Dashboard
**Priority:** P1
**Description:** Super-admin oversight of platform.
**Acceptance Criteria:**
- AC1: Manage users, businesses, categories.
- AC2: Resolve disputes, refund requests.
- AC3: View platform metrics.
- AC4: Feature/unfeature businesses.

## 18. Background Jobs (BullMQ)
**Priority:** P1
**Description:** Async processing for heavy tasks.
**Acceptance Criteria:**
- AC1: Queue for sending notifications/reminders.
- AC2: Queue for slot recomputation on changes.
- AC3: Queue for image resize/optimization.
- AC4: Failed jobs retried with exponential backoff.
- AC5: Dashboard/monitoring for queues.

## Priorities Summary
- P0: Auth, Guest, Search, Business Detail, Categories, Booking, Appointments, Profile, Availability, Payment, Provider Portal.
- P1: Map Search, Favorites, Design System, Reviews, Notifications, Admin, Background Jobs.
- P2: (none initially, future: loyalty program, multi-language).

## Success Metrics
- 80% booking completion rate.
- <2s slot computation.
- 4.5+ app store rating.
