# Planity Clone - Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity clone - a mobile-first platform to discover, book, and manage beauty and wellness appointments.

**Target Users:** End customers (guests & registered), Business Owners (salons, independent pros), Admins.

**Priorities:** P0 = MVP, P1 = Near-term, P2 = Later.

## 1. Shared Types & Design System
- Define common data models (User, Business, Service, Appointment, Review, etc.) shared across frontend/backend.
- Establish UI kit: colors, typography, components (buttons, cards, modals) for React Native / Web.
- AC: TypeScript interfaces published in a shared package; Storybook shows components; design tokens match brand.
- Priority: P0

## 2. User Authentication
- Sign up/login via email, phone (OTP), and social (Google/Apple).
- JWT-based sessions with refresh tokens; password reset.
- AC: User can register in <2 min; invalid creds show error; protected routes redirect to login; logout clears tokens.
- Priority: P0

## 3. Guest Browse & Explore
- Non-logged users can view home, categories, business lists, details.
- Prompt to login only when booking or saving favorites.
- AC: Guest lands on explore screen; can search; booking attempt triggers auth modal.
- Priority: P0

## 4. Business Search & Discovery
- Search by name, service, or pro; filter by date, price, rating, distance.
- Sort results relevance/distance/price.
- AC: Query returns matching businesses with pagination; filters apply correctly; empty state shown.
- Priority: P0

## 5. Map-based Search
- Display businesses as pins on interactive map (Google Maps / Mapbox).
- Tap pin -> preview card; 'list' toggle.
- AC: Map loads within 2s; pins cluster; geo-location permission handled; pin click opens detail.
- Priority: P0

## 6. Business Detail View
- Show cover, gallery, address, hours, services list, staff, reviews summary, 'Book' CTA.
- AC: All data accurate; services expand to show durations/prices; book button starts flow.
- Priority: P0

## 7. Service Categories
- Taxonomy: Hair, Nails, Spa, Barber, etc. with sub-categories.
- AC: Categories visible on home; selecting drills to filtered search; admin can manage.
- Priority: P0

## 8. Booking Flow
- Select service -> staff (optional) -> date -> available slot -> confirm -> payment -> success.
- Support multi-service cart.
- AC: Only available slots selectable; price total correct; confirmation screen + notification sent; appointment appears in management.
- Priority: P0

## 9. Availability & Slot Computation
- Each business defines working hours, breaks, service duration, and existing appointments.
- Engine computes free slots per service/staff.
- AC: Overlapping bookings prevented; timezone correct; buffer respected; real-time update on new booking.
- Priority: P0

## 10. Payment Integration
- Stripe/Apple Pay/Google Pay; hold or charge; refund support.
- AC: Test cards succeed/fail appropriately; receipt emailed; payment status synced to appointment.
- Priority: P0

## 11. Notifications
- Email/SMS/push for booking confirm, reminder (24h), cancel, review request.
- AC: Triggered by events; user can opt-out; delivery tracked; templates editable.
- Priority: P0

## 12. Appointment Management (User)
- List upcoming/past; reschedule/cancel (per policy); add to calendar.
- AC: Status reflects changes; cancel frees slot; history retained.
- Priority: P0

## 13. Favorites
- Save businesses/services; view in profile; get alerts for deals.
- AC: Heart toggle works; favorites persist across devices; removed correctly.
- Priority: P1

## 14. User Profile
- Edit name, phone, payment methods, notification prefs, avatar.
- AC: Changes save; validation on phone/email; GDPR delete available.
- Priority: P1

## 15. Reviews & Ratings
- Post-visit rating (1-5 + text, photos); display aggregated.
- AC: Only verified visits can review; moderation queue; avg updates.
- Priority: P1

## 16. Provider / Business Owner Portal
- Onboard business: profile, services, staff, hours, pricing.
- Manage bookings, availability, view analytics, respond to reviews.
- AC: Owner can create/edit business; dashboard shows today's appointments; slot engine uses their config.
- Priority: P0

## 17. Admin Dashboard
- Manage users, businesses, categories, flag content, view platform metrics.
- AC: Admin role restricted; can suspend business; category CRUD; basic reporting.
- Priority: P1

## 18. Background Jobs (BullMQ)
- Async processors for notifications, reminder sends, slot cache warming, image thumbnails.
- AC: Jobs retry on fail; dashboard/monitoring; no duplicate sends; scales with Redis.
- Priority: P0

## Success Metrics
- Booking conversion > 20%, crash-free sessions > 99%, avg slot load < 500ms.