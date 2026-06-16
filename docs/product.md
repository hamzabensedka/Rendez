# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Description:** A multi-platform application that connects customers with local service businesses (salons, barbershops, spas, clinics, etc.) for online appointment booking. Includes a customer-facing mobile app, a provider/business owner portal, and an admin dashboard.  
**Target Platforms:** iOS, Android, Web (React Native / Expo for mobile; React for web portals)  
**Backend:** NestJS, PostgreSQL, Prisma, Redis, BullMQ  

---

## 2. Goals & Objectives

| Goal | Priority |
|------|----------|
| Enable customers to discover and book appointments with local service businesses | P0 |
| Provide business owners with tools to manage their services, availability, and appointments | P0 |
| Ensure reliable, real-time availability and slot computation | P0 |
| Build trust through reviews, ratings, and secure payments | P1 |
| Scale operations with background job processing and notifications | P1 |

---

## 3. Personas

1. **Customer (End User):** Wants to find, compare, and book services quickly.
2. **Business Owner / Provider:** Manages business profile, services, staff, availability, and appointments.
3. **Admin:** Oversees platform health, user management, disputes, and payments.

---

## 4. Feature Specifications

### 4.1 User Authentication
**Priority:** P0  
**Description:** Secure registration and login for customers, business owners, and admins.

**Acceptance Criteria:**
- [ ] Users can register with email/password or OAuth (Google, Apple).
- [ ] Passwords must be hashed (bcrypt) and meet complexity requirements (min 8 chars, 1 uppercase, 1 number).
- [ ] Users receive a verification email upon registration; account is inactive until verified.
- [ ] Users can log in with email/password or OAuth.
- [ ] JWT access token (15 min expiry) and refresh token (7 days) are issued.
- [ ] Users can request password reset via email.
- [ ] Role-based access control (Customer, BusinessOwner, Admin) enforced at API level.
- [ ] Rate limiting on login attempts (5 attempts per 15 min window).

---

### 4.2 Guest Browse & Explore
**Priority:** P0  
**Description:** Allow non-authenticated users to browse businesses and services without logging in.

**Acceptance Criteria:**
- [ ] Guest users can view business listings, search, and filter without authentication.
- [ ] Guest users can view business details and service categories.
- [ ] Booking actions, favorites, and reviews require authentication (prompt login/signup).
- [ ] Guest session data (e.g., search filters) is preserved post-login.

---

### 4.3 Business Search & Discovery
**Priority:** P0  
**Description:** Customers can search and discover businesses by various criteria.

**Acceptance Criteria:**
- [ ] Search by keyword (business name, service name).
- [ ] Filter by: category, location (city/zip), price range, rating, availability (today, this week).
- [ ] Sort by: relevance, distance, rating, price (low to high).
- [ ] Pagination with cursor-based pagination for performance.
- [ ] Search results display: business name, primary image, average rating, starting price, distance.
- [ ] Search is debounced (300ms) and cached for popular queries.

---

### 4.4 Map-based Search
**Priority:** P0  
**Description:** Visual discovery of businesses on an interactive map.

**Acceptance Criteria:**
- [ ] Map displays business pins based on current viewport bounds.
- [ ] Users can pan/zoom; map fetches businesses within visible bounds.
- [ ] Clustering for dense areas (max 50 pins without clustering).
- [ ] Tapping a pin opens a bottom sheet with business summary.
- [ ] User's current location is requested and centered by default (with permission).
- [ ] Map fallback to default city if location permission denied.

---

### 4.5 Business Detail View
**Priority:** P0  
**Description:** Comprehensive view of a single business.

**Acceptance Criteria:**
- [ ] Display: name, description, images (carousel, max 10), address, phone, website, hours.
- [ ] List of services with name, duration, description, and price.
- [ ] Average rating and total review count.
- [ ] "Book Now" CTA per service.
- [ ] Share business via deep link.
- [ ] Report business option (inappropriate content).

---

### 4.6 Service Categories
**Priority:** P0  
**Description:** Hierarchical categorization of services for discovery and organization.

**Acceptance Criteria:**
- [ ] Predefined categories: Hair, Beauty, Wellness, Health, Fitness, Other.
- [ ] Each category has subcategories (e.g., Hair > Cut, Color, Styling).
- [ ] Business owners assign services to categories/subcategories.
- [ ] Categories are localized (i18n).
- [ ] Category icons and colors defined in design system.

---

### 4.7 Booking Flow
**Priority:** P0  
**Description:** End-to-end appointment booking experience.

**Acceptance Criteria:**
- [ ] Customer selects service → selects staff member (optional) → selects date/time slot.
- [ ] Only available slots are shown (computed in real-time).
- [ ] Slot selection enforces service duration and buffer times.
- [ ] Customer can add notes (allergies, preferences).
- [ ] Booking summary displayed before confirmation with service, staff, time, price.
- [ ] Payment required for paid services (see Payment Integration).
- [ ] Upon confirmation: booking saved, availability updated, confirmation email/SMS sent.
- [ ] Booking reference number generated (UUID, human-readable format).
- [ ] Idempotency key prevents duplicate bookings.

---

### 4.8 Appointment Management
**Priority:** P0  
**Description:** Customers and business owners can manage appointments.

**Acceptance Criteria (Customer):**
- [ ] View upcoming and past appointments in list view.
- [ ] Reschedule to another available slot (up to 2 hours before).
- [ ] Cancel appointment with reason selection; refund policy applied.
- [ ] Add appointment to native calendar (iOS/Android).

**Acceptance Criteria (Business Owner):**
- [ ] View all appointments in daily/weekly calendar view.
- [ ] Filter by staff member, service, status.
- [ ] Confirm, reschedule, or cancel appointments.
- [ ] Block time slots (breaks, unavailability).
- [ ] Export appointments to CSV.

---

### 4.9 Favorites
**Priority:** P1  
**Description:** Customers can save favorite businesses for quick access.

**Acceptance Criteria:**
- [ ] Toggle favorite from business detail or search results.
- [ ] Favorites list accessible from profile tab.
- [ ] Favorites synced across devices for logged-in user.
- [ ] Push notification for new offers from favorited businesses (opt-in).

---

### 4.10 User Profile
**Priority:** P1  
**Description:** Customer and business owner profile management.

**Acceptance Criteria:**
- [ ] Display and edit: name, email, phone, profile picture.
- [ ] Manage notification preferences (email, SMS, push).
- [ ] View booking history and receipts.
- [ ] Manage payment methods (save, delete, set default).
- [ ] Delete account with GDPR-compliant data removal (30-day grace period).

---

### 4.11 Availability & Slot Computation
**Priority:** P0  
**Description:** Core engine for calculating available appointment slots.

**Acceptance Criteria:**
- [ ] Business owners define weekly recurring schedules (Mon-Sun, start/end times).
- [ ] Support for multiple staff members with individual schedules.
- [ ] Handle breaks, time-off, and holidays.
- [ ] Slot computation accounts for: existing bookings, blocked times, service duration, buffer between appointments.
- [ ] Real-time slot availability via API (cached in Redis, TTL 60s).
- [ ] Timezone-aware for business location.
- [ ] Edge cases: overnight services, multi-day services, concurrent bookings (group classes).

---

### 4.12 Shared Types & Design System
**Priority:** P0  
**Description:** Consistent UI/UX across all platforms.

**Acceptance Criteria:**
- [ ] Design tokens: colors, typography, spacing, shadows defined in Figma and code.
- [ ] Shared component library: buttons, inputs, cards, modals, date picker, time slot grid.
- [ ] Shared TypeScript types between frontend and backend (monorepo or package).
- [ ] Accessibility: WCAG 2.1 AA compliance, screen reader support, minimum touch target 44x44dp.
- [ ] Dark mode support.
- [ ] Localization (i18n) for EN, FR, ES, DE.

---

### 4.13 Reviews & Ratings
**Priority:** P1  
**Description:** Customers can leave feedback on businesses and services.

**Acceptance Criteria:**
- [ ] Eligible customers can review after completed appointment (within 30 days).
- [ ] Rating: 1-5 stars, with optional text review (max 1000 chars).
- [ ] Business owner can respond to reviews publicly.
- [ ] Reviews display: user name (or "Verified Customer"), date, rating, text, business response.
- [ ] Flag/report inappropriate reviews; admin moderation queue.
- [ ] Average rating recalculated on new review (background job).

---

### 4.14 Payment Integration
**Priority:** P0  
**Description:** Secure payment processing for bookings.

**Acceptance Criteria:**
- [ ] Stripe integration for card payments.
- [ ] Payment intents created server-side; client confirms with PaymentElement.
- [ ] Support for: one-time payments, saving payment methods, refunds.
- [ ] Business can set deposit/full payment or pay-at-venue.
- [ ] Receipt emailed upon successful payment.
- [ ] Webhook handling for: payment success, failure, refund, dispute.
- [ ] PCI compliance: no card data stored locally.

---

### 4.15 Notifications
**Priority:** P1  
**Description:** Multi-channel notifications for booking lifecycle.

**Acceptance Criteria:**
- [ ] Push notifications: booking confirmed, reminder (24h, 1h before), cancelled, rescheduled.
- [ ] Email notifications: same events + receipt, review request.
- [ ] SMS notifications: optional, for reminders and urgent updates.
- [ ] Notification preferences per channel (opt-in/opt-out).
- [ ] Notification history in-app.
- [ ] Background job (BullMQ) for reliable delivery and retries.

---

### 4.16 Provider / Business Owner Portal
**Priority:** P0  
**Description:** Web portal for business owners to manage their presence and operations.

**Acceptance Criteria:**
- [ ] Dashboard: upcoming appointments, revenue summary, new reviews.
- [ ] Business profile: edit details, upload images, set hours.
- [ ] Service management: CRUD services, set prices, durations, assign staff.
- [ ] Staff management: add staff, set individual schedules and permissions.
- [ ] Availability calendar: set recurring hours, breaks, time-off.
- [ ] Appointment management (see 4.8).
- [ ] Analytics: bookings, revenue, cancellation rate, customer retention.
- [ ] Subscription/billing management (if SaaS model).

---

### 4.17 Admin Dashboard
**Priority:** P1  
**Description:** Platform administration and oversight.

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, delete accounts.
- [ ] Business management: verify, approve, suspend, feature businesses.
- [ ] Content moderation: review flagged reviews and businesses.
- [ ] Analytics: MAU, bookings, revenue, top categories, churn.
- [ ] System health: monitor background jobs, API errors, performance.
- [ ] Configurable platform settings: commission rates, notification templates, categories.

---

### 4.18 Background Jobs (BullMQ)
**Priority:** P1  
**Description:** Asynchronous task processing for reliability and performance.

**Acceptance Criteria:**
- [ ] Job queues defined: notifications, emails, SMS, payment webhooks, analytics aggregation, search index updates.
- [ ] Jobs are idempotent where applicable.
- [ ] Retry policy: 3 attempts with exponential backoff.
- [ ] Dead letter queue for failed jobs; admin alert on critical failures.
- [ ] Job scheduling: recurring jobs (daily reports, nightly slot cache warm-up).
- [ ] Monitoring: job count, processing time, failure rate exposed via dashboard.

---

## 5. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | API response < 200ms (p95); map pin fetch < 500ms |
| Scalability | Support 10k concurrent users; horizontal scaling ready |
| Security | OWASP Top 10 mitigation; HTTPS; secure headers; input validation |
| Privacy | GDPR compliant; data retention policies; right to erasure |
| Reliability | 99.9% uptime target; automated backups |

---

## 6. Success Metrics

- Monthly Bookings
- Customer Conversion Rate (browse → book)
- Business Owner Activation (profile complete → first booking)
- NPS (Customer and Business Owner)
- Average Booking Value
- Cancellation Rate

---

## 7. Out of Scope (V1)

- In-app messaging between customer and business
- Loyalty / rewards program
- Multi-language AI chatbot
- Native tablet-specific layouts

---

## 8. Appendix

### 8.1 Tech Stack Summary
- **Mobile:** React Native (Expo)
- **Web:** React, Next.js
- **Backend:** NestJS, PostgreSQL, Prisma ORM
- **Cache/Queue:** Redis, BullMQ
- **Payments:** Stripe
- **Maps:** Mapbox or Google Maps
- **Notifications:** Firebase Cloud Messaging, SendGrid, Twilio

### 8.2 Related Files
- `backend/src/payment/dto/confirm-payment.dto.ts`
- `backend/src/payment/dto/create-payment-intent.dto.ts`
- `backend/src/payment/dto/refund-payment.dto.ts`
- `backend/src/payment/dto/save-payment-method.dto.ts`
- `backend/src/payment/payment.controller.ts`
- `backend/src/payment/payment.module.ts`
- `backend/src/payment/payment.service.ts`
- `backend/src/prisma/schema.prisma`
