# Planity Clone — Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with local beauty & wellness businesses (salons, barbers, spas). It supports guest browsing, authenticated booking, provider management, and admin oversight.

## 2. Personas
- Client: books appointments, browses businesses.
- Business Owner: manages slots, services, profile.
- Admin: platform oversight.

## 3. Feature Specs

### 3.1 User Authentication
- Signup/login via email, phone OTP, Google/Apple.
- JWT refresh tokens.
- Password reset.
- AC: User can register in <2 min; invalid token rejected; logout clears session.
- Priority: P0

### 3.2 Guest Browse & Explore
- Landing shows popular businesses, categories without login.
- AC: Guest can view 10+ businesses; prompted to login on booking.
- Priority: P0

### 3.3 Business Search & Discovery
- Text search by name, service, city.
- Filters: price, rating, distance.
- AC: Search returns relevant results <1s; empty state shown.
- Priority: P0

### 3.4 Map-based Search
- Google Maps view with pins.
- Tap pin -> preview card.
- AC: Pins load within viewport; radius filter works.
- Priority: P1

### 3.5 Business Detail View
- Cover, gallery, services, staff, reviews, map.
- AC: All sections render; CTA book visible.
- Priority: P0

### 3.6 Service Categories
- Tree: Beauty > Nails > Manicure.
- AC: 3-level nav; counts shown.
- Priority: P1

### 3.7 Booking Flow
- Select service, staff, slot, pay.
- AC: No double booking; confirmation sent.
- Priority: P0

### 3.8 Appointment Management
- List upcoming/past; cancel/reschedule.
- AC: Cancel frees slot; history retained.
- Priority: P0

### 3.9 Favorites
- Save business/service.
- AC: Sync across devices; max 100.
- Priority: P2

### 3.10 User Profile
- Edit name, phone, addresses.
- AC: Changes persist; validation on phone.
- Priority: P1

### 3.11 Availability & Slot Computation
- Business hours + breaks + booked.
- AC: Correct slots; DST handled.
- Priority: P0

### 3.12 Shared Types & Design System
- TS types, UI kit (colors, buttons).
- AC: Used across apps; versioned.
- Priority: P1

### 3.13 Reviews & Ratings
- 1-5 stars + text; owner reply.
- AC: Verified only; flag abusive.
- Priority: P1

### 3.14 Payment Integration
- Stripe: card, Apple/Google Pay.
- AC: 3DS supported; refund flow.
- Priority: P0

### 3.15 Notifications
- Push (FCM), email, SMS.
- AC: Reminder 24h before; opt-out respected.
- Priority: P1

### 3.16 Provider Portal
- Manage business, services, staff, slots, bookings.
- AC: Real-time update; analytics view.
- Priority: P0

### 3.17 Admin Dashboard
- Users, businesses, disputes, config.
- AC: Role-based access; audit log.
- Priority: P1

### 3.18 Background Jobs (BullMQ)
- Reminders, slot cleanup, report gen.
- AC: Retry on fail; monitored.
- Priority: P1

## 4. Priorities Summary
P0: Core booking loop. P1: Enhancement. P2: Nice-to-have.