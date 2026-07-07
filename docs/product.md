# Planity Clone - Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, barbers, spas). It supports discovery, booking, payments, reviews, and provider/admin management.

## 2. Feature Specifications

### 2.1 User Authentication
- Description: Sign up/login via email, phone, social (Google/Apple). JWT-based sessions, refresh tokens.
- Acceptance Criteria:
  - AC1: User can register with email+password, receives verification email.
  - AC2: User can login and receives access/refresh tokens.
  - AC3: Password reset flow works.
  - AC4: Social login returns valid user or creates new.
- Priority: P0

### 2.2 Guest Browse & Explore
- Guests can view home, categories, business lists without login.
- AC: Guest can open app, see featured businesses, categories; prompted to login only when booking.
- Priority: P0

### 2.3 Business Search & Discovery
- Text search, filters (category, price, rating, distance).
- AC: Search returns relevant results; filters apply correctly; empty state shown.
- Priority: P0

### 2.4 Map-based Search
- Interactive map with pins; click pin shows preview; area selection updates list.
- AC: Map loads with business pins; pan/zoom updates results; pin click opens detail preview.
- Priority: P1

### 2.5 Business Detail View
- Show info: photos, services, staff, hours, location, reviews.
- AC: All sections render; "Book" button initiates flow; phone/website links work.
- Priority: P0

### 2.6 Service Categories
- Hierarchical categories (e.g., Hair > Cut). Admin manageable.
- AC: Categories display; selecting filters businesses; new category can be added via admin.
- Priority: P0

### 2.7 Booking Flow
- Select service, staff (optional), date, slot; confirm; pre-payment or pay later.
- AC: User can complete booking; slot locked; confirmation notification sent; error on conflict.
- Priority: P0

### 2.8 Appointment Management
- User sees upcoming/past; cancel/reschedule; provider can manage.
- AC: List shows correctly; cancel frees slot; reschedule validates availability.
- Priority: P0

### 2.9 Favorites
- Save businesses/services; view list; remove.
- AC: Favorite toggles; persists; appears in favorites tab.
- Priority: P2

### 2.10 User Profile
- Edit name, photo, contact, payment methods, notifications pref.
- AC: Changes persist; validation on phone/email.
- Priority: P1

### 2.11 Availability & Slot Computation
- Provider sets working hours, breaks, service duration; system computes free slots.
- AC: Slots generated per service duration; excludes booked; respects buffer.
- Priority: P0

### 2.12 Shared Types & Design System
- Common TS types, UI components (buttons, cards, colors) for web/mobile.
- AC: Design system documented; components reused; types imported.
- Priority: P1

### 2.13 Reviews & Ratings
- User can rate (1-5) and comment post-appointment; display aggregated.
- AC: Review submitted only for completed appt; shown on business; moderation by admin.
- Priority: P1

### 2.14 Payment Integration
- Stripe/Apple Pay/Google Pay; deposit or full; refund handling.
- AC: Payment succeeds; booking confirmed; failure rolls back; receipt emailed.
- Priority: P0

### 2.15 Notifications
- Push (Expo/FCM), email, SMS for booking, reminders, promotions.
- AC: User receives correct notification; preferences respected; unsubscribe works.
- Priority: P1

### 2.16 Provider / Business Owner Portal
- Dashboard: manage profile, services, staff, availability, bookings, reviews, payouts.
- AC: Provider can login; edit; view analytics; accept/decline bookings.
- Priority: P0

### 2.17 Admin Dashboard
- Manage users, businesses, categories, reviews, monitor jobs.
- AC: Admin can approve business; suspend user; view metrics.
- Priority: P1

### 2.18 Background Jobs (BullMQ)
- Queue for reminders, slot cleanup, email/sms, analytics.
- AC: Job scheduled; processed with retry; failed logged; dashboard shows status.
- Priority: P1

## 3. Prioritization Summary
P0: Core MVP (Auth, Browse, Search, Detail, Categories, Booking, Appt, Availability, Payment, Provider Portal)
P1: Enhancements (Map, Profile, Design System, Reviews, Notifications, Admin, Jobs)
P2: Nice-to-have (Favorites)

## 4. Out of Scope (initial)
- Multi-language (later), video consultations, loyalty programs.