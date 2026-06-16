# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Build a cross-platform mobile and web application that connects customers with local beauty, wellness, and health service providers. Customers can discover businesses, view real-time availability, book appointments, and manage their reservations. Business owners can manage their services, availability, and appointments through a dedicated portal.

### 1.2 Target Users
- **Customers (B2C)**: Individuals seeking beauty, wellness, and health services.
- **Business Owners / Providers (B2B)**: Salons, barbershops, spas, independent professionals.
- **Platform Admins**: Internal team managing the marketplace.

### 1.3 Platform
- iOS & Android (React Native / Expo)
- Web (Responsive PWA)
- Backend (NestJS, PostgreSQL, Prisma, BullMQ)

### 1.4 Success Metrics
- Booking conversion rate ≥ 15%
- Search-to-book latency < 3s
- Provider onboarding time < 10 minutes
- App store rating ≥ 4.5

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 (Critical)

**Description:** Secure, frictionless authentication for customers and business owners.

**User Stories:**
- As a customer, I want to sign up with email/password or social login so that I can access personalized features.
- As a user, I want to reset my password securely so that I can recover my account.
- As a user, I want to stay logged in via secure tokens so that I don't have to log in repeatedly.

**Acceptance Criteria:**
- [ ] Users can register with email, password, first name, last name, phone number.
- [ ] Password must be ≥ 8 characters with at least one uppercase, one lowercase, one number.
- [ ] Email verification link sent upon registration; account inactive until verified.
- [ ] Social login supported: Google, Apple, Facebook.
- [ ] JWT access token (15 min expiry) + refresh token (7 days) with secure httpOnly cookie option.
- [ ] Password reset via email with expiring token (1 hour).
- [ ] Rate limiting: 5 failed attempts trigger 15-minute lockout.
- [ ] Users can delete their account with 30-day grace period (GDPR compliance).

**API Endpoints:**
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`
- `DELETE /auth/account`

---

### 2.2 Guest Browse & Explore
**Priority:** P0 (Critical)

**Description:** Allow unauthenticated users to browse businesses and services without creating an account.

**User Stories:**
- As a guest, I want to browse nearby businesses so that I can explore the platform before committing.
- As a guest, I want to view business details and services so that I can evaluate offerings.

**Acceptance Criteria:**
- [ ] Guest users can access search, discovery, and business detail screens.
- [ ] Guest users can view service listings, prices, and availability.
- [ ] Booking action triggers authentication prompt with pre-filled context.
- [ ] Guest session data (search filters, viewed businesses) persisted for 7 days via local storage.
- [ ] Upon registration, guest session data merges into authenticated account.

---

### 2.3 Business Search & Discovery
**Priority:** P0 (Critical)

**Description:** Powerful search and filtering to help users find the right business.

**User Stories:**
- As a customer, I want to search by business name, service, or location so that I can find relevant providers.
- As a customer, I want to filter by price, rating, distance, and availability so that I can narrow results.

**Acceptance Criteria:**
- [ ] Full-text search across business name, service names, and descriptions.
- [ ] Filters: distance (1-50km), price range, rating (1-5 stars), category, availability (today, this week).
- [ ] Sort options: relevance, distance, rating, price (low to high).
- [ ] Search results return within 500ms for cached queries, 2s for fresh.
- [ ] Pagination: 20 results per page, cursor-based.
- [ ] Recent searches stored (max 10), deletable by user.
- [ ] Auto-complete suggestions with debounce (300ms).

---

### 2.4 Map-based Search
**Priority:** P0 (Critical)

**Description:** Visual discovery of businesses on an interactive map.

**User Stories:**
- As a customer, I want to see businesses on a map so that I can choose based on location.
- As a customer, I want to tap a map pin to see business summary so that I can quickly evaluate.

**Acceptance Criteria:**
- [ ] Map displays business pins within viewport bounds.
- [ ] Clustering for dense areas (≥ 5 businesses within 50px).
- [ ] Pin tap reveals bottom sheet with: business name, rating, price range, next available slot.
- [ ] User location request on first use; fallback to city center if denied.
- [ ] Map bounds update triggers new search query.
- [ ] Smooth 60fps pan/zoom performance on mobile.

---

### 2.5 Business Detail View
**Priority:** P0 (Critical)

**Description:** Comprehensive business profile with all information needed to make a booking decision.

**User Stories:**
- As a customer, I want to see business photos, description, services, and reviews so that I can evaluate the provider.
- As a customer, I want to see opening hours and contact info so that I can plan my visit.

**Acceptance Criteria:**
- [ ] Hero image carousel (max 10 images), lazy loaded.
- [ ] Business info: name, category, address, phone, website, social links.
- [ ] Opening hours with "Open Now" / "Closes at X" indicator.
- [ ] Service list with name, duration, price, description.
- [ ] Average rating and review count displayed prominently.
- [ ] "Book Now" CTA sticky at bottom.
- [ ] Share business via native share sheet (deep link).
- [ ] Report business functionality (inappropriate content).

---

### 2.6 Service Categories categories
**Priority:** P0 (Critical)

**Description:** Hierarchical categorization of services for discovery and filtering.

**User Stories:**
- As a customer, I want to browse by category (e.g., Hair, Nails, Massage) so that I can discover new services.
- As a business owner, I want to assign categories to my services so that customers can find me.

**Acceptance Criteria:**
- [ ] Category tree: 2 levels max (e.g., Hair > Coloring).
- [ ] Categories localized (FR, EN, ES, DE).
- [ ] Category icons and color codes for visual recognition.
- [ ] Trending / popular categories surfaced on home screen.
- [ ] Business services must map to at least one category.
- [ ] Admin can CRUD categories; changes reflect within 5 minutes (cache invalidation).

---

### 2.7 Booking Flow
**Priority:** P0 (Critical)

**Description:** Seamless, multi-step appointment booking with real-time availability.

**User Stories:**
- As a customer, I want to select a service, choose a staff member, pick a time slot, and confirm my booking.
- As a customer, I want to add notes or preferences to my booking.

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) — allow multi-service booking if time permits.
- [ ] Step 2: Select staff member (optional "No preference").
- [ ] Step 3: Select date and time slot from computed availability.
- [ ] Step 4: Review booking summary (service, staff, time, price, location).
- [ ] Step 5: Add payment method (if required) and confirm.
- [ ] Slot holds for 10 minutes during checkout; released on timeout or cancellation.
- [ ] Booking confirmation screen with add-to-calendar option.
- [ ] Deep link to booking details for sharing.
- [ ] Support for guest checkout (email + phone required).

---

### 2.8 Appointment Management
**Priority:** P0 (Critical)

**Description:** Customers and providers can view, modify, and cancel appointments.

**User Stories:**
- As a customer, I want to see my upcoming and past appointments so that I can manage my schedule.
- As a customer, I want to reschedule or cancel my appointment within business rules.

**Acceptance Criteria:**
- [ ] Appointment list: upcoming (chronological), past (reverse chronological).
- [ ] Appointment card shows: business name, service, staff, date/time, status, price.
- [ ] Statuses: pending, confirmed, completed, cancelled, no-show.
- [ ] Reschedule: select new slot from real-time availability; old slot released immediately.
- [ ] Cancel: allowed up to business-defined cutoff (default 24h before).
- [ ] Late cancellation fee applied per business policy.
- [ ] Push and email notifications for all status changes.
- [ ] Receipt / invoice downloadable post-completion.

---

### 2.9 Favorites
**Priority:** P1 (High)

**Description:** Users can save and quickly access preferred businesses.

**User Stories:**
- As a customer, I want to favorite businesses so that I can book with them again easily.

**Acceptance Criteria:**
- [ ] Heart icon on business card and detail view; toggles favorite state.
- [ ] Favorites synced across devices for logged-in users.
- [ ] Favorites list accessible from profile tab.
- [ ] Push notification when favorited business has a promotion or new availability.
- [ ] Maximum 500 favorites per user.

---

### 2.10 User Profile
**Priority:** P1 (High)

**Description:** Central hub for user settings, preferences, and account management.

**User Stories:**
- As a user, I want to manage my personal info, payment methods, and preferences.

**Acceptance Criteria:**
- [ ] Profile: name, email, phone, profile photo, birthday (for birthday offers).
- [ ] Payment methods: add, delete, set default (Stripe integration).
- [ ] Notification preferences: push, email, SMS — per type (bookings, promotions, reminders).
- [ ] Privacy settings: location sharing, data download, account deletion.
- [ ] Booking history with search and filter.
- [ ] Loyalty / reward points display (if applicable).

---

### 2.11 Availability & Slot Computation
**Priority:** P0 (Critical)

**Description:** Real-time, accurate availability computation considering complex business rules.

**User Stories:**
- As a business owner, I want to define my working hours, breaks, and time off so that customers see accurate availability.
- As a customer, I want to see only genuinely available slots.

**Acceptance Criteria:**
- [ ] Business defines: weekly recurring hours, custom hours per day, breaks, time off.
- [ ] Service duration + buffer time between appointments configurable.
- [ ] Staff-specific availability overrides business default.
- [ ] Slot computation considers: existing bookings, staff availability, service duration, concurrent service limits.
- [ ] API returns slots for requested date range within 200ms.
- [ ] Cache slots with 30-second TTL; invalidate on booking mutation.
- [ ] Handle timezone correctly (business timezone stored, converted for customer).
- [ ] Support for "walk-in" vs "appointment-only" modes.

---

### 2.12 Shared Types & Design System
**Priority:** P0 (Critical)

**Description:** Consistent UI/UX across all platforms with reusable components.

**User Stories:**
- As a developer, I want a shared design system so that features are built consistently and efficiently.

**Acceptance Criteria:**
- [ ] Color palette: primary, secondary, semantic (success, warning, error, info).
- [ ] Typography scale: 6 levels (hero, h1-h4, body, caption).
- [ ] Spacing scale: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64).
- [ ] Component library: Button, Input, Card, Modal, BottomSheet, DatePicker, TimeSlotGrid, Avatar, Badge, Skeleton.
- [ ] Animation standards: 200ms ease-in-out for micro-interactions.
- [ ] Accessibility: WCAG 2.1 AA minimum, screen reader support, minimum touch target 44x44dp.
- [ ] Dark mode support.
- [ ] Shared TypeScript types between backend and frontend (monorepo).

---

### 2.13 Reviews & Ratings
**Priority:** whitespaces

**Description:** Social proof through customer reviews and ratings.

**User Stories:**
- As a customer, I want to read reviews before booking.
- As a customer, I want to leave a review after my appointment.

**Acceptance Criteria:**
- [ ] 5-star rating system with optional text review (10-1000 characters).
- [ ] Review eligibility: only verified customers who completed the appointment.
- [ ] Review window: 7 days post-appointment; reminder notification at day 1 and day 6.
- [ ] Business owner can respond to reviews publicly.
- [ ] Reviews sortable: most recent, most helpful, highest/lowest rating.
- [ ] Flag inappropriate reviews; admin moderation queue.
- [ ] Average rating recalculated in real-time; cached for performance.

---

### 2.14 Payment Integration
**Priority:** P0 (Critical)

**Description:** Secure, flexible payment processing for bookings.

**User Stories:**
- As a customer, I want to pay securely with my preferred method.
- As a business owner, I want to receive payouts and handle refunds.

**Acceptance Criteria:**
- [ ] Stripe integration: card payments, Apple Pay, Google Pay.
- [ ] Payment intents created at booking confirmation; captured on completion or immediately based on business policy.
- [ ] Support for deposit-only (e.g., 20%) and full payment.
- [ ] Refund processing: full and partial, with reason logging.
- [ ] Saved payment methods with PCI-compliant tokenization.
- [ ] Receipt emailed on successful payment.
- [ ] Failed payment retry logic (3 attempts, exponential backoff).
- [ ] Business owner payout schedule: daily, weekly, monthly (configurable).

---

### 2.15 Notifications
**Priority:** P1 (High)

**Description:** Multi-channel notifications to keep users informed and engaged.

**User Stories:**
- As a user, I want timely notifications about my bookings and promotions.

**Acceptance Criteria:**
- [ ] Channels: push (Firebase Cloud Messaging), email (SendGrid), SMS (Twilio).
- [ ] Notification types: booking confirmation, reminder (24h, 1h before), cancellation, rescheduled, promotion, review request.
- [ ] User preference controls per channel and type.
- [ ] Notification history accessible in-app.
- [ ] Deep links from push notifications to relevant screen.
- [ ] Batch promotional notifications respect timezone and quiet hours (22:00 - 08:00).

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 (Critical)

**Description:** Dedicated web portal for business owners to manage their presence and operations.

**User Stories:**
- As a business owner, I want to manage my business profile, services, staff, and appointments.
- As a business owner, I want to view analytics and revenue reports.

**Acceptance Criteria:**
- [ ] Dashboard: upcoming appointments, revenue today/this week/this month, new reviews.
- [ ] Business profile editor: photos, description, hours, contact info.
- [ ] Service management: CRUD services, pricing, duration, category assignment.
- [ ] Staff management: add staff, set their services, availability, and permissions.
- [ ] Appointment calendar: day/week/month views, drag-to-reschedule, block time off.
- [ ] Customer list with booking history and notes.
- [ ] Analytics: bookings, revenue, cancellation rate, average rating, peak hours.
- [ ] Settings: payment account, notification preferences, cancellation policy.

---

### 2.17 Admin Dashboard
**Priority:** P1 (High)

**Description:** Platform administration and oversight.

**User Stories:**
- As an admin, I want to manage businesses, users, and platform health.

**Acceptance Criteria:**
- [ ] Business onboarding approval workflow.
- [ ] User management: search, view, suspend, delete accounts.
- [ ] Content moderation: review flagged content, take action.
- [ ] Financial overview: platform revenue, payouts, disputes.
- [ ] System health: API latency, error rates, queue depth.
- [ ] Configurable platform settings: commission rates, featured business slots, global policies.

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P1 (High)

**Description:** Reliable asynchronous job processing for scalability.

**User Stories:**
- As a developer, I want non-critical operations processed asynchronously so that the API remains responsive.

**Acceptance Criteria:**
- [ ] Job types: email sending, push notifications, SMS, payment webhooks, report generation, data exports, search index updates, slot cache warming.
- [ ] Retry policy: 3 attempts with exponential backoff; dead letter queue after failure.
- [ ] Job priority: critical (payments), high (notifications), normal (emails), low (reports).
- [ ] Job monitoring: dashboard with queue depth, processing rate, failed jobs.
- [ ] Scheduled jobs: nightly reports, weekly summaries.
- [ ] Idempotency keys to prevent duplicate processing.

---

## 3. Non-Functional Requirements

### 3.1 Performance
- API p95 response time < 200ms for cached data, < 1s for computed data.
- App cold start < 2s on mid-tier devices.
- Image loading: progressive JPEG, WebP, CDN delivery.

### 3.2 Security
- OWASP Top 10 compliance.
- API rate limiting: 100 req/min per user, 1000 req/min per IP.
- Data encryption at rest (AES-256) and in transit (TLS 1.3).
- GDPR and CCPA compliant data handling.

### 3.3 Scalability
- Stateless API design for horizontal scaling.
- Database read replicas for search and listing queries.
- Redis cluster for caching and session storage.

### 3.4 Reliability
- 99.9% uptime SLA.
- Automated database backups (hourly incremental, daily full).
- Circuit breakers for external service dependencies.

---

## 4. Prioritization Matrix

| Feature | Priority | Sprint Target | Dependencies |
|---------|----------|---------------|--------------|
| User Authentication | P0 | Sprint 1 | — |
| Guest Browse & Explore | P0 | Sprint 1 | — |
| Business Search & Discovery | P0 | Sprint 1 | — |
| Map-based Search | P0 | Sprint 2 | Search |
| Business Detail View | P0 | Sprint 2 | Search |
| Service Categories | P0 | Sprint 1 | — |
| Booking Flow | P0 | Sprint 3 | Auth, Search, Availability |
| Appointment Management | P0 | Sprint 3 | Booking Flow |
| Favorites | P1 | Sprint 4 | Auth |
| User Profile | P1 | Sprint 4 | Auth |
| Availability & Slot Computation | P0 | Sprint 2 | — |
| Shared Types & Design System | P0 | Sprint 1 | — |
| Reviews & Ratings | P1 | Sprint 4 | Booking, Auth |
| Payment Integration | P0 | Sprint 3 | Booking Flow |
| Notifications | P1 | Sprint 4 | Booking, Auth |
| Provider / Business Owner Portal | P0 | Sprint 3-4 | Auth, Booking |
| Admin Dashboard | P1 | Sprint 5 | All above |
| Background Jobs (BullMQ) | P1 | Sprint 2-5 | Ongoing |

---

## 5. Data Model (Prisma Schema Overview)

Key entities: `User`, `Business`, `Service`, `Staff`, `Appointment`, `Review`, `Category`, `Payment`, `Notification`, `Favorite`.

See `backend/src/prisma/schema.prisma` for full schema definition.

---

## 6. API Design Principles

- RESTful with nested resource paths.
- Versioned: `/api/v1/`.
- Consistent response envelope: `{ success: boolean, data?: T, error?: { code, message, details } }`.
- Pagination: cursor-based for real-time data, offset for static lists.
- Filtering, sorting, and field selection via query parameters.

---

## 7. Analytics & Events

Track key events: `search_executed`, `business_viewed`, `service_selected`, `slot_selected`, `booking_initiated`, `booking_confirmed`, `payment_succeeded`, `review_submitted`, `favorite_added`.

---

*Document version: 1.0*
*Last updated: 2024*
*Owner: Product Team*