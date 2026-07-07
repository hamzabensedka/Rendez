# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with local beauty and wellness businesses for appointment booking.

## 1. User Authentication
**Priority:** P0
**Description:** Users register, login, logout, reset password.
**Acceptance Criteria:**
- Register with email or phone.
- Login returns JWT.
- Password reset via email link.
- Social login (optional P1).

## 2. Guest Browse & Explore
**Priority:** P0
**Description:** Guests explore without account.
**Acceptance Criteria:**
- View business list and details.
- Search available.
- Prompt login when booking.

## 3. Business Search & Discovery
**Priority:** P0
**Description:** Text search and filters.
**Acceptance Criteria:**
- Search by name, category, location.
- Filter by rating, distance, price.
- Sort by relevance.

## 4. Map-based Search
**Priority:** P1
**Description:** Interactive map with pins.
**Acceptance Criteria:**
- Show businesses on map.
- Tap pin shows preview card.
- Radius slider updates results.

## 5. Business Detail View
**Priority:** P0
**Description:** Full business profile.
**Acceptance Criteria:**
- Cover image, gallery, address, contact.
- List services with duration and price.
- Show staff and working hours.
- Display average rating.

## 6. Service Categories
**Priority:** P0
**Description:** Taxonomy of services.
**Acceptance Criteria:**
- Hierarchical categories seeded.
- Business assigns services to categories.
- Browse by category from home.

## 7. Booking Flow
**Priority:** P0
**Description:** Multi-step booking.
**Acceptance Criteria:**
- Select service, staff, date, slot.
- Show price and duration.
- Confirm and pay.
- Receive confirmation.

## 8. Appointment Management
**Priority:** P0
**Description:** User manages bookings.
**Acceptance Criteria:**
- List upcoming and past.
- Cancel with reason.
- Reschedule using slot picker.
- Status updates reflected.

## 9. Favorites
**Priority:** P1
**Description:** Save businesses.
**Acceptance Criteria:**
- Add/remove from list or detail.
- Favorites section in profile.
- Sync across devices.

## 10. User Profile
**Priority:** P1
**Description:** Personal settings.
**Acceptance Criteria:**
- Edit name, photo, phone.
- Manage saved payment methods.
- Notification preferences.

## 11. Availability & Slot Computation
**Priority:** P0
**Description:** Generate bookable slots.
**Acceptance Criteria:**
- Based on business hours and staff shifts.
- Exclude already booked slots.
- Respect service duration and buffer.
- Timezone aware.

## 12. Shared Types & Design System
**Priority:** P0
**Description:** Common codebase assets.
**Acceptance Criteria:**
- TypeScript types for User, Business, Booking.
- Reusable UI components (Button, Card, Input).
- Theme colors and spacing.

## 13. Reviews & Ratings
**Priority:** P1
**Description:** Post-appointment feedback.
**Acceptance Criteria:**
- Only verified clients can review.
- 1-5 stars and comment.
- Admin can hide inappropriate.
- Average shown on detail.

## 14. Payment Integration
**Priority:** P0
**Description:** Stripe-powered payments.
**Acceptance Criteria:**
- Card payment with 3DS.
- Deposit or full amount.
- Webhook for status.
- Refund through admin.

## 15. Notifications
**Priority:** P1
**Description:** Multi-channel alerts.
**Acceptance Criteria:**
- Email and push on booking.
- Reminder 24h before.
- Opt-out toggle.

## 16. Provider / Business Owner Portal
**Priority:** P1
**Description:** Business management web app.
**Acceptance Criteria:**
- Edit profile, services, staff.
- Set availability.
- View and manage appointments.
- Basic analytics.

## 17. Admin Dashboard
**Priority:** P2
**Description:** Platform oversight.
**Acceptance Criteria:**
- Approve/new businesses.
- Manage categories and users.
- View global metrics.

## 18. Background Jobs (BullMQ)
**Priority:** P1
**Description:** Async processing.
**Acceptance Criteria:**
- Queue for reminders and emails.
- Retry with backoff.
- Dead letter queue.
- Redis backed.

## Priority Legend
- P0: MVP must-have
- P1: Important post-MVP
- P2: Nice-to-have