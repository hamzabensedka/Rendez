# Planity Clone — Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with local beauty & wellness businesses (salons, barbers, spas). It supports guest browsing, authenticated booking, provider management, and admin oversight.

## 2. Personas
- Client: books appointments, browses businesses.
- Guest: explores without account.
- Business Owner: manages services, availability, bookings.
- Admin: platform oversight.

## 3. Feature Specifications

### 3.1 User Authentication
- Sign up/login via email, phone OTP, Google/Apple.
- Password reset, session refresh.
- Acceptance: User can register in <2 min; invalid creds show error; JWT stored securely.
- Priority: P0

### 3.2 Guest Browse & Explore
- Landing shows featured businesses, categories.
- No account required to view.
- Acceptance: Guest sees home feed; prompted to login only at booking.
- Priority: P1

### 3.3 Business Search & Discovery
- Text search by name, service, location.
- Filters: price, rating, distance.
- Acceptance: Results <1s; empty state handled.
- Priority: P0

### 3.4 Map-based Search
- Google Maps view with pins.
- Tap pin -> preview card.
- Acceptance: Pins load with viewport; smooth pan/zoom.
- Priority: P1

### 3.5 Business Detail View
- Shows info, services, staff, reviews, map.
- Acceptance: All sections render; book button visible.
- Priority: P0

### 3.6 Service Categories
- Tree: Beauty > Nails > Manicure.
- Acceptance: CRUD by admin; client filters by leaf.
- Priority: P1

### 3.7 Booking Flow
- Select service, staff, slot, pay.
- Acceptance: Multi-step with validation; confirmation sent.
- Priority: P0

### 3.8 Appointment Management
- List upcoming/past; cancel/reschedule.
- Acceptance: Changes reflect in provider calendar.
- Priority: P0

### 3.9 Favorites
- Save businesses/services.
- Acceptance: Sync across devices; quick access tab.
- Priority: P2

### 3.10 User Profile
- Edit name, phone, prefs.
- Acceptance: Changes persist; avatar upload.
- Priority: P1

### 3.11 Availability & Slot Computation
- Business hours + breaks + booked.
- Acceptance: Slots computed per service duration; no overlap.
- Priority: P0

### 3.12 Shared Types & Design System
- TS types, UI kit (colors, components).
- Acceptance: Used across apps; documented.
- Priority: P0

### 3.13 Reviews & Ratings
- 1-5 stars + text; moderated.
- Acceptance: Only past clients review; avg shown.
- Priority: P1

### 3.14 Payment Integration
- Stripe: card, Apple/Google Pay.
- Acceptance: Failures handled; receipt emailed.
- Priority: P0

### 3.15 Notifications
- Push (Expo), email, SMS.
- Acceptance: Reminders 24h before; opt-out works.
- Priority: P1

### 3.16 Provider Portal
- Manage profile, services, staff, slots, bookings.
- Acceptance: Real-time updates; analytics view.
- Priority: P0

### 3.17 Admin Dashboard
- Users, businesses, categories, reports.
- Acceptance: Suspend business; export data.
- Priority: P1

### 3.18 Background Jobs (BullMQ)
- Reminders, slot cleanup, report gen.
- Acceptance: Retry on fail; monitored.
- Priority: P1

## 4. Priorities Summary
P0: Core booking. P1: Engagement. P2: Nice-to-have.

## 5. Success Metrics
- Booking conversion >20%.
- Provider retention >80%.