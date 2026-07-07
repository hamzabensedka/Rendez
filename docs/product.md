# Planity Clone - Product Specification

## 1. Overview
Planity Clone is a mobile-first platform enabling users to discover, browse, and book beauty and wellness services (e.g., haircut, massage) from local businesses. It includes a consumer app, a provider portal, and an admin dashboard. The system computes real-time availability, handles payments, and sends notifications. Background jobs process async tasks.

## 2. Feature Specifications

### 2.1 User Authentication
- Description: Users can sign up, log in, and reset password via email/phone. Social login (Google, Apple) supported.
- Acceptance Criteria:
  - Given a new user, when they submit valid email and password, then account is created and verification email sent.
  - User can log in with correct credentials and receive JWT.
  - Password reset flow sends link to email.
  - Social login creates account or links existing.
- Priority: P0

### 2.2 Guest Browse & Explore
- Description: Non-authenticated users can browse featured businesses and categories.
- Acceptance Criteria:
  - Guest can view home screen with curated lists.
  - Guest can open business detail but booking requires auth.
  - No personal data stored for guest.
- Priority: P0

### 2.3 Business Search & Discovery
- Description: Text search with filters (category, price, rating, distance).
- Acceptance Criteria:
  - Search returns relevant businesses by name, service, or location.
  - Filters apply correctly and combine.
  - Empty state shown when no results.
- Priority: P0

### 2.4 Map-based Search
- Description: Interactive map showing business pins; users can pan/zoom to discover.
- Acceptance Criteria:
  - Map displays pins for businesses in viewport.
  - Tapping pin shows quick info and links to detail.
  - Filter changes update map markers.
- Priority: P1

### 2.5 Business Detail View
- Description: Shows info: photos, services, staff, reviews, location, hours.
- Acceptance Criteria:
  - Displays business profile, list of services with prices and durations.
  - Shows aggregate rating and recent reviews.
  - Shows 'Book' button.
- Priority: P0

### 2.6 Service Categories
- Description: Taxonomy of services (Hair, Nails, Spa, etc.) with subcategories.
- Acceptance Criteria:
  - Categories seeded and manageable via admin.
  - Businesses assign services to categories.
  - Users can browse by category from home.
- Priority: P0

### 2.7 Booking Flow
- Description: Multi-step: select service, staff (optional), date/time, confirm, pay.
- Acceptance Criteria:
  - Only available slots shown based on availability engine.
  - User can select or skip staff.
  - On confirm, appointment created with pending status until payment.
  - Supports reschedule/cancel from flow.
- Priority: P0

### 2.8 Appointment Management
- Description: Users view upcoming/past appointments, cancel or reschedule.
- Acceptance Criteria:
  - List of appointments with status (confirmed, completed, cancelled).
  - User can cancel at least 24h before with policy check.
  - Reschedule opens booking flow with pre-filled data.
- Priority: P1

### 2.9 Favorites
- Description: Users can save businesses to favorites.
- Acceptance Criteria:
  - Heart icon toggles favorite.
  - Favorites list accessible from profile.
  - Removing updates instantly.
- Priority: P2

### 2.10 User Profile
- Description: Manage personal info, payment methods, notification settings.
- Acceptance Criteria:
  - User can edit name, phone, avatar.
  - Can add/remove cards (tokenized).
  - Can opt in/out of email/push.
- Priority: P1

### 2.11 Availability & Slot Computation
- Description: Engine that computes open slots based on business hours, service duration, staff schedules, and existing bookings.
- Acceptance Criteria:
  - Given business + service + date, returns 15-min increment slots.
  - Respects breaks and time-off.
  - Handles multiple staff and picks earliest.
- Priority: P0

### 2.12 Shared Types & Design System
- Description: Common TypeScript types, UI components, color palette, typography.
- Acceptance Criteria:
  - Monorepo package with types used across apps.
  - Component library includes Button, Card, Input, etc.
  - Theme matches brand guidelines.
- Priority: P0

### 2.13 Reviews & Ratings
- Description: Users leave star rating and text after completed appointment.
- Acceptance Criteria:
  - Only verified customers can review.
  - Average rating recalculated on new review.
  - Business can respond to reviews.
- Priority: P1

### 2.14 Payment Integration
- Description: Stripe (or similar) for cards, with PCI compliance via tokenization.
- Acceptance Criteria:
  - User can pay and receive receipt.
  - Handles refund for cancellations per policy.
  - Failed payment rolls back booking.
- Priority: P0

### 2.15 Notifications
- Description: Push (Firebase) and email for booking confirm, reminder, cancel.
- Acceptance Criteria:
  - On booking confirm, send push+email.
  - 24h before appointment, reminder sent.
  - User can disable in profile.
- Priority: P1

### 2.16 Provider / Business Owner Portal
- Description: Web app for businesses to manage profile, services, staff, availability, bookings.
- Acceptance Criteria:
  - Owner can edit business info and photos.
  - Can add staff and set working hours.
  - Can view calendar and manually add bookings.
  - Can respond to reviews.
- Priority: P1

### 2.17 Admin Dashboard
- Description: Super admin manages categories, users, businesses, and monitors.
- Acceptance Criteria:
  - CRUD for service categories.
  - Ability to suspend users/businesses.
  - View platform metrics (bookings, revenue).
- Priority: P2

### 2.18 Background Jobs (BullMQ)
- Description: Queue for async tasks: send notifications, compute availability cache, sync payments.
- Acceptance Criteria:
  - Job for reminder notifications runs daily.
  - Failed jobs retry with backoff.
  - Queue dashboard for monitoring.
- Priority: P1

## 3. Prioritization Summary
- P0 (MVP): Auth, Guest, Search, Detail, Categories, Booking, Availability, Design System, Payment
- P1: Map, Appointments, Profile, Reviews, Notifications, Provider, Background Jobs
- P2: Favorites, Admin
