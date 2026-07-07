# Planity Clone — Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with local beauty & wellness businesses (salons, barbers, spas). It supports guest browsing, authenticated booking, provider management, and admin oversight.

## 2. Personas
- Client: books appointments, browses, leaves reviews.
- Guest: explores without account.
- Business Owner: manages slots, services, staff.
- Admin: platform-wide control.

## 3. Feature Specs

### 3.1 User Authentication
- Signup/login via email, phone OTP, Google/Apple.
- JWT refresh, logout, password reset.
- AC: User can register in <2 min; invalid creds show error; session persists.
- Priority: P0

### 3.2 Guest Browse & Explore
- Home with featured businesses, categories.
- No account required to view.
- AC: Guest sees home; prompted to login only at booking.
- Priority: P0

### 3.3 Business Search & Discovery
- Text search by name, service, location.
- Filters: rating, price, distance.
- AC: Results <500ms; empty state handled.
- Priority: P0

### 3.4 Map-based Search
- Google Maps view with pins.
- Tap pin -> preview card.
- AC: Map loads; pins accurate; radius filter works.
- Priority: P1

### 3.5 Business Detail View
- Cover, info, services, staff, reviews.
- AC: All sections render; CTA to book.
- Priority: P0

### 3.6 Service Categories
- Tree: Beauty > Nails > Manicure.
- AC: Categories editable by admin; used in search.
- Priority: P1

### 3.7 Booking Flow
- Select service, staff, slot, pay.
- AC: Multi-step with validation; confirmation sent.
- Priority: P0

### 3.8 Appointment Management
- List upcoming/past; cancel/reschedule.
- AC: Client sees status; owner notified.
- Priority: P0

### 3.9 Favorites
- Save businesses/services.
- AC: Sync across devices; quick access.
- Priority: P2

### 3.10 User Profile
- Edit name, prefs, payment methods.
- AC: Changes persist; GDPR delete.
- Priority: P1

### 3.11 Availability & Slot Computation
- Rules per staff/service; buffer times.
- AC: No double-booking; slots computed real-time.
- Priority: P0

### 3.12 Shared Types & Design System
- TS types, UI kit (colors, components).
- AC: Used across apps; documented.
- Priority: P0

### 3.13 Reviews & Ratings
- 1-5 stars + text; moderation.
- AC: Only booked users review; avg shown.
- Priority: P1

### 3.14 Payment Integration
- Stripe: cards, wallets; partial deposit.
- AC: PCI compliant; retries; receipts.
- Priority: P0

### 3.15 Notifications
- Push/email/SMS for booking, reminders.
- AC: Opt-in; delivered <1 min.
- Priority: P1

### 3.16 Provider / Business Owner Portal
- Manage profile, services, staff, slots, appts.
- AC: Isolated data; analytics view.
- Priority: P0

### 3.17 Admin Dashboard
- Users, businesses, categories, reports.
- AC: Role-based; audit log.
- Priority: P1

### 3.18 Background Jobs (BullMQ)
- Reminders, slot cleanup, emails.
- AC: Retry on fail; monitored.
- Priority: P1

## 4. Priorities Summary
P0: Auth, Browse, Search, Detail, Booking, Appt, Slots, Types, Payment, Provider. P1: Map, Categories, Profile, Reviews, Notifs, Admin, Jobs. P2: Favorites.