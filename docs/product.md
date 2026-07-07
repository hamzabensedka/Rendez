# Planity Clone — Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with local beauty & wellness businesses (salons, barbers, spas). It supports guest browsing, authenticated booking, provider management, and admin oversight. Built with React Native (client), Node/Express (API), BullMQ (jobs), and Postgres/Redis.

## 2. Personas
- Client: books appointments, browses guest mode.
- Business Owner: manages slots, services, profile.
- Admin: platform oversight, moderation.

## 3. Feature Specs

### 3.1 User Authentication
- Signup/login via email, phone OTP, Google/Apple.
- JWT refresh tokens, secure storage.
- Password reset flow.
- AC: User can register in <2 min; invalid creds show error; session persists 7d.
- Priority: P0

### 3.2 Guest Browse & Explore
- No login required to view home, businesses, categories.
- Prompt login only at booking.
- AC: Guest sees curated list; deep links work; conversion prompt appears at checkout.
- Priority: P0

### 3.3 Business Search & Discovery
- Text search by name, service, city.
- Filters: price, rating, distance, availability.
- AC: Results <500ms; empty state shown; filters combine.
- Priority: P0

### 3.4 Map-based Search
- Show businesses as pins on Mapbox.
- Tap pin -> preview card.
- AC: Map loads <2s; clusters at zoom; radius filter works.
- Priority: P1

### 3.5 Business Detail View
- Hero image, info, services, staff, reviews.
- CTA “Book”.
- AC: All sections render; phone/website links; shareable.
- Priority: P0

### 3.6 Service Categories
- Tree: Beauty > Hair > Cut.
- Admin-managed.
- AC: 3-level depth; businesses tag categories; search uses them.
- Priority: P1

### 3.7 Booking Flow
- Select service, staff, slot, pay.
- Multi-service cart.
- AC: No double-booking; confirmation SMS/email; editable.
- Priority: P0

### 3.8 Appointment Management
- List upcoming/past; cancel/reschedule.
- Reminders.
- AC: State updates realtime; owner notified.
- Priority: P0

### 3.9 Favorites
- Save businesses/services.
- AC: Sync across devices; push on offer.
- Priority: P2

### 3.10 User Profile
- Personal info, addresses, payment methods, history.
- AC: Editable; GDPR delete.
- Priority: P1

### 3.11 Availability & Slot Computation
- Owner sets hours, breaks, overrides.
- Engine computes free slots per service duration.
- AC: Correct under timezone; buffer respected; concurrency safe.
- Priority: P0

### 3.12 Shared Types & Design System
- TS types, UI kit (colors, components).
- AC: Single source; used by all apps.
- Priority: P0

### 3.13 Reviews & Ratings
- Post-visit review, 1-5 stars, text.
- AC: One per visit; owner can reply; sort by date.
- Priority: P1

### 3.14 Payment Integration
- Stripe: cards, wallets, saved.
- Partial deposit option.
- AC: PCI compliant; webhooks update status; refund flow.
- Priority: P0

### 3.15 Notifications
- Push (FCM/APNs), email, SMS.
- Types: booking, reminder, promo.
- AC: Opt-in; delivered <1m; unsubscribe.
- Priority: P1

### 3.16 Provider / Business Owner Portal
- Dashboard: appointments, slots, staff, profile, payouts.
- AC: Real-time; role-based; mobile responsive.
- Priority: P0

### 3.17 Admin Dashboard
- Manage users, businesses, categories, disputes.
- AC: Audit log; suspend; impersonate.
- Priority: P1

### 3.18 Background Jobs (BullMQ)
- Reminders, slot cleanup, report gen, sync.
- AC: Retry; dead-letter; monitor UI.
- Priority: P1

## 4. Priorities Summary
P0: Auth, Guest, Search, Map(P1 but core), Detail, Booking, Appt, Slots, Design, Payment, Provider. P1: Map, Categories, Profile, Reviews, Notif, Admin, Jobs. P2: Favorites.

## 5. Success Metrics
- 30% MoM bookings; <3% cancel; 4.5★ avg; 20% guest→signup.