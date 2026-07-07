# Planity Clone — Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with local beauty & wellness businesses (salons, barbers, spas). It supports guest browsing, authenticated booking, provider management, and admin oversight.

## 2. Personas
- Client: books appointments, browses, leaves reviews.
- Guest: explores without account.
- Business Owner: manages slots, services, profile.
- Admin: platform oversight.

## 3. Feature Specs

### 3.1 User Authentication
- Signup/login via email, phone OTP, Google/Apple.
- JWT sessions, refresh tokens.
- Password reset.
- AC: User can register in <2 min; invalid creds show error; logout clears token.
- Priority: P0

### 3.2 Guest Browse & Explore
- Home feed of featured businesses and categories without login.
- AC: Guest sees 10+ businesses; CTAs prompt login when booking.
- Priority: P1

### 3.3 Business Search & Discovery
- Text search by name, service, city.
- Filters: price, rating, distance.
- AC: Query returns relevant results <1s; empty state shown if none.
- Priority: P0

### 3.4 Map-based Search
- Google Maps view with pins.
- Tap pin -> preview card.
- AC: Pins load within viewport; 1000 pins perform smoothly.
- Priority: P1

### 3.5 Business Detail View
- Cover, gallery, services, staff, hours, reviews.
- AC: All sections render; book button visible.
- Priority: P0

### 3.6 Service Categories
- Tree: Beauty > Nails > Manicure.
- AC: 3-level categories; businesses tagged correctly.
- Priority: P1

### 3.7 Booking Flow
- Select service, staff, slot, pay.
- AC: Prevents double booking; confirmation sent.
- Priority: P0

### 3.8 Appointment Management
- List upcoming/past; cancel/reschedule.
- AC: Cancel frees slot; user notified.
- Priority: P0

### 3.9 Favorites
- Save businesses/services.
- AC: Persists across sessions; removable.
- Priority: P2

### 3.10 User Profile
- Edit name, phone, addresses, payment methods.
- AC: Changes save; validation on phone.
- Priority: P1

### 3.11 Availability & Slot Computation
- Business hours + breaks - booked = slots.
- AC: 30-min granularity; respects timezone.
- Priority: P0

### 3.12 Shared Types & Design System
- TS types, UI kit (colors, buttons).
- AC: Used across apps; documented.
- Priority: P0

### 3.13 Reviews & Ratings
- 1-5 stars + text; moderation.
- AC: Only booked users review; avg shown.
- Priority: P1

### 3.14 Payment Integration
- Stripe: cards, wallets; deposits.
- AC: Failed pay rolls back; receipt emailed.
- Priority: P0

### 3.15 Notifications
- Push (Firebase), email, SMS.
- AC: Reminder 24h before; opt-out works.
- Priority: P1

### 3.16 Provider Portal
- Manage business, services, staff, slots, bookings.
- AC: Owner edits live; analytics view.
- Priority: P0

### 3.17 Admin Dashboard
- Users, businesses, disputes, config.
- AC: Suspend business; export data.
- Priority: P1

### 3.18 Background Jobs (BullMQ)
- Reminders, slot cleanup, report gen.
- AC: Retry on fail; monitored.
- Priority: P1

## 4. Priorities Summary
P0: Auth, Search, Detail, Booking, Appt, Slots, Types, Pay, Provider. P1: Guest, Map, Categories, Profile, Reviews, Notif, Admin, Jobs. P2: Favorites.