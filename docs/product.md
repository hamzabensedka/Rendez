# Planity Clone - Product Specification

## 1. Overview
Planity Clone is a mobile-first marketplace for booking beauty and wellness appointments. It connects clients with salons, barbers, spas, and independent professionals. The product includes client apps, a provider portal, an admin dashboard, and backend services.

## 2. Feature Specifications

### 2.1 User Authentication (Priority: P0)
- Users can sign up with email/phone and password or OAuth (Google/Apple).
- Email verification and phone OTP required.
- JWT-based sessions with refresh tokens.
- Password reset flow.
- Acceptance: A new user can register, verify, and log in within <2 min. Invalid credentials rejected.

### 2.2 Guest Browse & Explore (Priority: P0)
- Non-authenticated users can view home page with featured businesses and categories.
- Guests can search and view business details but must login to book.
- Acceptance: Guest sees curated list; attempting booking redirects to login.

### 2.3 Business Search & Discovery (Priority: P0)
- Search by name, service, or keyword with filters (date, price, rating).
- Sorting by distance, popularity, price.
- Acceptance: Search returns relevant results in <500ms for 10k listings.

### 2.4 Map-based Search (Priority: P1)
- Interactive map showing business pins.
- Adjust radius and pan to reload results.
- Acceptance: Map updates results on move-end; pin click opens preview.

### 2.5 Business Detail View (Priority: P0)
- Shows cover photo, gallery, services, staff, reviews, location, hours.
- Displays computed available slots.
- Acceptance: All sections render; slot grid accurate.

### 2.6 Service Categories (Priority: P0)
- Hierarchical categories (e.g., Hair > Coloring).
- Category landing pages with top businesses.
- Acceptance: Category tree editable via admin; client navigates correctly.

### 2.7 Booking Flow (Priority: P0)
- Select service, staff (optional), date, slot, add extras, confirm.
- Guest redirected to login/signup before payment.
- Acceptance: End-to-end booking creates appointment with status pending payment.

### 2.8 Appointment Management (Priority: P0)
- User sees upcoming/past appointments.
- Reschedule/cancel per policy (free within 24h).
- Acceptance: Cancel updates slot availability; notification sent.

### 2.9 Favorites (Priority: P1)
- Save businesses to favorites list.
- Sync across devices.
- Acceptance: Favorite toggles persist; shown in profile.

### 2.10 User Profile (Priority: P0)
- Edit name, photo, contact, payment methods.
- View booking history, reviews given.
- Acceptance: Changes persist; GDPR delete available.

### 2.11 Availability & Slot Computation (Priority: P0)
- Provider sets working hours, breaks, service duration, concurrent capacity.
- System computes free slots excluding booked appointments.
- Acceptance: Overlapping bookings prevented; DST handled.

### 2.12 Shared Types & Design System (Priority: P0)
- Common TS types for API contracts.
- UI kit (buttons, cards, colors) consistent across apps.
- Acceptance: Design system used in 100% of screens; types enforced in CI.

### 2.13 Reviews & Ratings (Priority: P1)
- Users rate 1-5 stars and write text after completed appointment.
- Business responds to reviews.
- Acceptance: Fake review flagged; average rating updates.

### 2.14 Payment Integration (Priority: P0)
- Stripe/PayPal for cards, wallets.
- Hold or charge based on provider policy.
- Acceptance: Payment success triggers confirmation; failure rolls back.

### 2.15 Notifications (Priority: P1)
- Push (FCM/APNs), email, SMS for booking, reminders, promos.
- User preferences respected.
- Acceptance: Reminder sent 24h before; opt-out works.

### 2.16 Provider / Business Owner Portal (Priority: P0)
- Dashboard with appointments, revenue, staff management.
- Edit profile, services, availability, photos.
- Acceptance: Provider can approve booking; calendar syncs.

### 2.17 Admin Dashboard (Priority: P1)
- Manage users, businesses, categories, disputes.
- View analytics, moderate reviews.
- Acceptance: Admin can suspend business; platform metrics visible.

### 2.18 Background Jobs (BullMQ) (Priority: P1)
- Queue for reminders, slot recomputation, image processing, emails.
- Retry with exponential backoff.
- Acceptance: Job failures logged; no duplicate sends.

## 3. Prioritization Summary
- P0 (MVP): Auth, Guest, Search, Detail, Categories, Booking, Appt Mgmt, Profile, Availability, Design System, Payment, Provider Portal.
- P1: Map, Favorites, Reviews, Notifications, Admin, Background Jobs.
- P2/P3: Future enhancements (loyalty, multi-language).

## 4. Success Metrics
- 500+ businesses onboarded in 3 months.
- <3% booking abandonment.
- 4.5+ app store rating.