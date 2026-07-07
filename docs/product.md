# Planity Clone — Product Specification

## 1. Overview
Planity Clone is a mobile-first marketplace connecting clients with local beauty & wellness professionals (hairdressers, barbers, nail techs, spas). It supports guest browsing, authenticated booking, provider self-service, and admin oversight.

## 2. Personas
- Client: books appointments, browses, leaves reviews.
- Guest: explores without account.
- Provider: manages salon, services, availability.
- Admin: platform oversight.

## 3. Feature Specifications

### 3.1 User Authentication
- Sign up (email, Google, Apple).
- Login, logout, password reset.
- JWT with refresh tokens.
- Acceptance: user can register in <2 min; invalid creds blocked; reset email sent.
- Priority: P0

### 3.2 Guest Browse & Explore
- Home screen with featured businesses and categories.
- No account required to view.
- Acceptance: guest sees content; prompted to login only at booking.
- Priority: P0

### 3.3 Business Search & Discovery
- Text search by name, service, location.
- Filters: price, rating, distance.
- Acceptance: results <500ms; filters apply correctly.
- Priority: P0

### 3.4 Map-based Search
- Google Maps integration.
- Pins for businesses; tap to preview.
- Acceptance: map loads; pins accurate within 50m.
- Priority: P1

### 3.5 Business Detail View
- Cover, gallery, services, staff, reviews.
- Acceptance: all sections render; CTA to book.
- Priority: P0

### 3.6 Service Categories
- Tree: Beauty > Hair > Cut.
- Acceptance: 3-level depth supported; used in nav.
- Priority: P1

### 3.7 Booking Flow
- Select service, staff, slot, pay.
- Acceptance: no double booking; confirmation shown.
- Priority: P0

### 3.8 Appointment Management
- List, reschedule, cancel.
- Acceptance: client sees updates; provider notified.
- Priority: P0

### 3.9 Favorites
- Save businesses/services.
- Acceptance: persists across sessions.
- Priority: P2

### 3.10 User Profile
- Edit name, phone, preferences.
- Acceptance: changes saved; validated.
- Priority: P1

### 3.11 Availability & Slot Computation
- Provider sets hours; system computes free slots.
- Acceptance: overlaps prevented; DST safe.
- Priority: P0

### 3.12 Shared Types & Design System
- TS types, UI kit (colors, components).
- Acceptance: reused across app; documented.
- Priority: P0

### 3.13 Reviews & Ratings
- 1–5 stars + text; moderation.
- Acceptance: only booked users review; avg shown.
- Priority: P1

### 3.14 Payment Integration
- Stripe: cards, wallets.
- Acceptance: charge on confirm; refund flow.
- Priority: P0

### 3.15 Notifications
- Push (Expo), email, SMS.
- Acceptance: booking, reminder sent.
- Priority: P1

### 3.16 Provider Portal
- Manage profile, services, slots, appts.
- Acceptance: changes live <1 min.
- Priority: P0

### 3.17 Admin Dashboard
- Users, providers, disputes.
- Acceptance: CRUD; export CSV.
- Priority: P1

### 3.18 Background Jobs (BullMQ)
- Reminders, slot cleanup, emails.
- Acceptance: retries; monitored.
- Priority: P1

## 4. Priorities Summary
P0: core booking. P1: engagement. P2: nice-to-have.

## 5. Success Metrics
- 30% MoM bookings; <2% cancel errors.