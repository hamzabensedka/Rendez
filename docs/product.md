# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first marketplace for beauty and wellness appointments, cloning Planity. It connects clients with salons, barbers, spas. Supports discovery, booking, payments, and management for clients, providers, and admins.

## Roles
- Client: browses, books, manages appointments.
- Provider: business owner managing listing and slots.
- Admin: platform oversight.

## Feature Specifications

### 1. User Authentication (P0)
Sign up/login via email, phone OTP, Google/Apple. JWT sessions with refresh. Password reset.
Acceptance Criteria:
- User can register with email or phone and verify.
- Social login works on iOS/Android.
- Invalid credentials show error.
- Session persists across app restarts.

### 2. Guest Browse & Explore (P0)
Guests can view home, categories, business lists without login. Login prompted at booking.
Acceptance Criteria:
- Guest sees curated collections and popular businesses.
- No auth errors on browse endpoints.
- CTA to login appears when attempting booking.

### 3. Business Search & Discovery (P0)
Text search with filters: category, price, rating, distance. Sort by relevance, distance, top rated.
Acceptance Criteria:
- Search returns matching businesses within 50ms p95.
- Filters combine correctly.
- Empty state shown when no results.

### 4. Map-based Search (P1)
Interactive map with pins for businesses. Tap pin shows mini detail.
Acceptance Criteria:
- Map loads businesses in viewport.
- Pin clustering for >50 results.
- Selecting pin opens preview sheet.

### 5. Business Detail View (P0)
Header with cover, logo, name, rating, address. List of services with prices/durations. Staff selection if applicable. Book button.
Acceptance Criteria:
- Data accurate from DB.
- Shows next available slot.
- Reviews section loads paginated.

### 6. Service Categories (P0)
Taxonomy: Hair, Nails, Spa, Barber, etc. Subcategories. Used for navigation/filtering.
Acceptance Criteria:
- Seed categories present.
- Selecting category filters businesses.
- Admin can add/edit categories.

### 7. Booking Flow (P0)
Select service -> staff (optional) -> date/time slot -> confirm -> payment -> success. Multi-service cart P1.
Acceptance Criteria:
- Slot shown only if available.
- Price breakdown displayed.
- Booking creates appointment pending until payment.
- Confirmation screen and notification sent.

### 8. Appointment Management (P0)
Client views upcoming/past. Reschedule/cancel within policy. Provider can confirm/decline.
Acceptance Criteria:
- List updates in realtime.
- Cancel triggers refund if applicable.
- Reschedule shows new slots.

### 9. Favorites (P1)
Save businesses to favorites list.
Acceptance Criteria:
- Heart icon toggles state.
- Favorites persist across sessions.
- Favorites list view works.

### 10. User Profile (P0)
Edit name, phone, address, payment methods. View history, notification settings.
Acceptance Criteria:
- Changes persist.
- Avatar upload works.
- Account deletion option (GDPR).

### 11. Availability & Slot Computation (P0)
Business/staff working hours, breaks, holidays. Slot generation by service duration + buffer. Prevent double booking.
Acceptance Criteria:
- Slots computed for next 30 days.
- Overlapping appointments excluded.
- Timezone correct per location.

### 12. Shared Types & Design System (P0)
Common TS types: User, Business, Service, Appointment. UI kit: colors, typography, components.
Acceptance Criteria:
- Types published as package.
- Design system used across mobile/web.
- Storybook contains components.

### 13. Reviews & Ratings (P1)
Clients rate after completed appointment (1-5 stars, comment). Business responds.
Acceptance Criteria:
- Only verified appointments can review.
- Average rating updates.
- Admin moderation for abuse.

### 14. Payment Integration (P0)
Stripe/PayPal for cards, wallets. Save card, 3DS. Payouts P1.
Acceptance Criteria:
- Payment success confirms booking.
- Failure retains pending with retry.
- Webhooks update status.

### 15. Notifications (P0)
Push (FCM/APNs) and email. Events: confirm, reminder 24h, cancel, promo.
Acceptance Criteria:
- Reminder sent before appointment.
- Opt-out respected.
- In-app notification center.

### 16. Provider / Business Owner Portal (P1)
Web dashboard: manage profile, services, staff, hours, appointments, reviews, analytics.
Acceptance Criteria:
- Owner updates availability and sees bookings live.
- Can accept/decline requests.
- Payout reports visible.

### 17. Admin Dashboard (P1)
Manage users, businesses, categories, flag content. Global stats.
Acceptance Criteria:
- Admin can suspend business.
- Category CRUD.
- View audit logs.

### 18. Background Jobs (BullMQ) (P0)
Queue for notifications, slot cache warming, reminder emails, webhook retries.
Acceptance Criteria:
- Jobs processed with retry/backoff.
- Failed jobs logged and alerted.
- No job loss on restart.

## Priority Summary
P0: Auth, Guest, Search, Detail, Categories, Booking, Appt Mgmt, Profile, Availability, Shared Types, Payment, Notifications, Background Jobs.
P1: Map, Favorites, Reviews, Provider Portal, Admin.
P2: Loyalty, in-app chat (out of scope).

## Success Metrics
- 5k bookings/month Q1.
- <2% payment failure.
- 4.5+ app store rating.