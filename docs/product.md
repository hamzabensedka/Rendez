# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Platform:** Web (responsive), iOS, Android  
**Target Audience:** Consumers seeking beauty & wellness appointments; business owners managing bookings.  
**Vision:** Become the go-to marketplace for discovering and booking local beauty & wellness services with real-time availability.

---

## 2. Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Consumer (Alex)** | 28-year-old professional, books hair/nail appointments 2-3x/month | Find nearby salons, see real-time availability, book instantly, manage appointments |
| **Business Owner (Maria)** | Salon owner with 5 employees, 50+ weekly bookings | Manage schedule, reduce no-shows, attract new clients, track revenue |
| **Admin (Sam)** | Platform operator | Monitor platform health, resolve disputes, manage business onboarding |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 (Critical)  
**Owner:** Backend / Mobile / Web

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| AUTH-001 | Email & password registration | User can register with email, password, first/last name, phone number. Password must be ≥8 chars with 1 uppercase, 1 number, 1 special char. |
| AUTH-002 | Email verification | Verification email sent on registration; account inactive until verified. Verification link expires in 24h. |
| AUTH-003 | Login with email/password | JWT access token (15min) + refresh token (7 days) returned. Rate limit: 5 attempts/minute per IP. |
| AUTH-004 | OAuth 2.0 (Google, Apple, Facebook) | One-tap login; account auto-linked by email. If email exists unverified, prompt to merge. |
| AUTH-005 | Password reset | "Forgot password" sends secure reset link via email; link expires in 1 hour. |
| AUTH-006 | Biometric login (Mobile) | Face ID / Touch ID supported after initial password login. |
| AUTH-007 | Session management | Users can view and revoke active sessions from profile. Max 5 concurrent sessions. |
| AUTH-008 | Role-based access | Roles: `consumer`, `business_owner`, `admin`. JWT contains role claim; middleware enforces route guards. |

---

### 3.2 Guest Browse & Explore
**Priority:** P0  
**Owner:** Frontend / Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| GUEST-001 | Browse without account | Non-authenticated users can search businesses, view listings, see basic details. |
| GUEST-002 | Prompt to register | On attempt to book, favorite, or view full availability → show auth modal with value proposition. |
| GUEST-003 | Persist guest session | Guest search filters and viewed businesses stored in localStorage for 7 days. |
| GUEST-004 | Seamless account conversion | On registration, merge guest session data (favorites, viewed businesses) to new account. |

---

### 3.3 Business Search & Discovery
**Priority:** P0  
**Owner:** Frontend / Backend / Search (Elasticsearch/PostgreSQL)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SEARCH-001 | Text search | Search by business name, service name, or description. Fuzzy matching with typo tolerance (Levenshtein distance ≤2). |
| SEARCH-002 | Filters | Filter by: service category, price range, rating (≥), distance, availability today/this week, amenities. |
| SEARCH-003 | Sort options | Sort by: relevance, distance, rating, price (low-high), availability (soonest). |
| SEARCH-004 | Auto-complete | Suggestions after 2 characters; include trending searches and recent user searches. |
| SEARCH-005 | Search history | Logged-in users see last 10 searches; can clear history. |
| SEARCH-006 | Results pagination | Infinite scroll on mobile; numbered pagination on web. Page size: 20 results. |
| SEARCH-007 | No-results state | Show related categories, nearby areas, and "broaden your search" suggestions. |

---

### 3.4 Map-based Search
**Priority:** P0  
**Owner:** Frontend / Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| MAP-001 | Interactive map | Full-screen map with business pins; tap/click to preview card. |
| MAP-002 | Geolocation | Request user location; default to city center if denied. Show accuracy radius. |
| MAP-003 | Clustering | Cluster pins when zoomed out; show count badge. De-cluster on zoom ≥ 14. |
| MAP-004 | Boundary search | Update results as map is panned/zoomed; debounce by 300ms. |
| MAP-005 | Directions | "Get directions" opens native maps app (Google/Apple Maps) with pre-filled destination. |
| MAP-006 | List/map toggle | Persistent toggle; remember user preference per session. |

---

### 3.5 Business Detail View
**Priority:** P0  
**Owner:** Frontend / Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BIZ-001 | Header info | Business name, average rating (1-5 stars, 2 decimal places), review count, distance, open/closed status. |
| BIZ-002 | Photo gallery | Up to 20 images; swipeable carousel; lightbox on tap. Lazy load images. |
| BIZ-003 | Services list | Grouped by category; each shows: name, duration, description, price, next available slot. |
| BIZ-004 | Staff profiles | List of service providers with photo, bio, specialties, average rating. |
| BIZ-005 | Business hours | Weekly schedule; highlight today's hours. Show "Closed" in red. |
| BIZ-006 | Contact & location | Address, phone (click-to-call), website link, social links. |
| BIZ-007 | Amenities | Icon list: WiFi, parking, wheelchair accessible, card payment, etc. |
| BIZ-008 | Share business | Native share sheet (mobile) or copy link (web) with preview image. |

---

### 3.6 Service Categories
**Priority:** P0  
**Owner:** Backend / Frontend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| CAT-001 | Hierarchical categories | 3-level hierarchy: e.g., Hair > Coloring > Balayage. Max depth: 3. |
| CAT-002 | Category browsing | Home screen shows top-level categories with iconography; drill-down to subcategories. |
| CAT-003 | Category-based search | Selecting category filters businesses offering any service in that category tree. |
| CAT-004 | Admin management | Admins can CRUD categories; reorder via drag-and-drop. Changes reflect immediately. |
| CAT-005 | Category icons | Each category has associated icon from design system; fallback to generic icon. |

---

### 3.7 Booking Flow
**Priority:** P0  
**Owner:** Full Stack

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BOOK-001 | Service selection | User selects service from business detail; can add multiple services (multi-service booking). |
| BOOK-002 | Provider selection | Choose specific staff member or "No preference" (any available). |
| BOOK-003 | Date & time picker | Calendar view with available slots highlighted; time slots in 15-min increments. Show timezone. |
| BOOK-004 | Slot reservation | Selected slot held for 10 minutes during checkout; release on timeout or abandonment. |
| BOOK-005 | Guest booking info | Collect: name, phone, email, optional notes. Pre-fill for logged-in users. |
| BOOK-006 | Add-ons & upsells | Optional add-ons presented during flow (e.g., deep conditioning, nail art). |
| BOOK-007 | Promo codes | Apply discount codes; validate in real-time; show final price breakdown. |
| BOOK-008 | Payment selection | Choose saved payment method or add new; show estimated total with taxes/fees. |
| BOOK-009 | Booking confirmation | On success: show confirmation screen with booking reference, calendar invite (.ics), add-to-wallet (iOS/Android). |
| BOOK-010 | Booking limits | Max 3 future bookings per business per user to prevent abuse. |
| BOOK-011 | Cancellation policy | Display business-specific policy before finalizing; require explicit acknowledgment. |

---

### 3.8 Appointment Management
**Priority:** P0  
**Owner:** Full Stack

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| APPT-001 | Upcoming appointments | List view with: business name, service, date/time, status. Group by date. |
| APPT-002 | Appointment detail | Full details: provider, location, directions link, contact, notes, cancellation/reschedule buttons. |
| APPT-003 | Reschedule | User can reschedule to any available slot ≥24h before appointment (configurable per business). |
| APPT-004 | Cancel | Cancel with reason selection; trigger refund per cancellation policy. |
| APPT-005 | Rebook | One-tap rebook same service with same provider from past appointment. |
| APPT-006 | Appointment history | Past appointments with option to leave review (within 30 days). |
| APPT-007 | Statuses | `pending` → `confirmed` → `completed` / `cancelled` / `no-show`. Push/SMS/email on status change. |
| APPT-008 | Check-in (Mobile) | QR code or "I'm here" button for contactless check-in at business. |

---

### 3.9 Favorites
**Priority:** P1 (High)  
**Owner:** Frontend / Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FAV-001 | Add/remove favorite | Heart icon on business card/detail; toggle with haptic feedback. |
| FAV-002-owner | Favorites list | Dedicated tab with grid/list of favorited businesses; sort by recently added or name. |
| FAV-003 | Quick actions | From favorites: book now, call, get directions. |
| FAV-004 | Availability badge | Show "Available today" badge if any slot available. |
| FAV-005 | Sync | Favorites sync across devices; persist if user logs out and back in. |

---

### 3.10 User Profile
**Priority:** P1  
**Owner:** Full Stack

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PROF-001 | Profile info | Editable: first/last name, email, phone, profile photo, birthday (for birthday offers). |
| PROF-002 | Saved payment methods | List, add, delete cards; set default. PCI-compliant via Stripe; never store raw card numbers. |
| PROF-003 | Notification preferences | Toggle: push, email, SMS per event type (bookings, promotions, reminders). |
| PROF-004 | Privacy settings | Control data sharing, download data (GDPR), delete account with 30-day grace period. |
| PROF-005 | Loyalty & rewards | Display points balance, tier status, available rewards, transaction history. |
| PROF-006 | Referral code | Unique referral code; share via link; track referrals and rewards. |

---

### 3.11 Availability & Slot Computation
**Priority:** P0  
**Owner:** Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SLOT-001 | Business hours definition | Business defines weekly schedule with open/close times, breaks, holidays. |
| SLOT-002 | Service duration | Each service has base duration; slot computation accounts for variable durations. |
| SLOT-003 | Provider availability | Each staff member has individual schedule and can have blocked time/PTO. |
| SLOT-004 | Real-time slot generation | Generate available slots on-the-fly considering: business hours, staff schedules, existing bookings, buffer time between appointments. |
| SLOT-005 | Concurrent bookings | Support rooms/equipment constraints; prevent double-booking of limited resources. |
| SLOT-006 | Slot caching | Cache computed slots for 5 minutes; invalidate on booking/cancellation. |
| SLOT-007 | Timezone handling | All times stored in UTC; displayed in business timezone or user timezone (configurable). |
| SLOT-008 | Walk-in slots | Option to mark slots as "walk-in only" with shorter duration/lower price. |

---

### 3.12 Shared Types & Design System
**Priority:** P0  
**Owner:** Design / Frontend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| DS-001 | Component library | Reusable components: buttons, inputs, cards, modals, date picker, time picker, loading states, empty states. |
| DS-002 | Typography & colors | Defined in Figma; implemented as CSS variables / theme objects. Primary, secondary, semantic colors (success, warning, error, info). |
| DS-003 | Spacing system | 4px base grid; consistent spacing scale (4, 8, 12, 16, 24, 32, 48, 64). |
| DS-004 | Icon set | Lucide icons; consistent sizing (16, 20, 24, 32px). |
| DS-005 | Shared TypeScript types | Monorepo shared package with all API DTOs, enums, and frontend types. Single source of truth. |
| DS-006 | Responsive breakpoints | Mobile: < 768px, Tablet: 768-1024px, Desktop: > 1024px. Mobile-first approach. |
| DS-007 | Accessibility | WCAG 2.1 AA compliance: minimum contrast 4.5:1, keyboard navigation, screen reader labels, focus indicators. |
| DS-008 | Dark mode | System preference detection; manual toggle; persistent preference. |

---

### 3.13 Reviews & Ratings
**Priority:** P1  
**Owner:** Full Stack

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REV-001 | Post-review eligibility | Only users with completed appointments can review; within 30 days of appointment. |
| REV-002 | Rating breakdown | 1-5 star rating per: overall, service quality, staff, ambiance, value. |
| REV-003 | Review content | Text (10-1000 chars), optional photos (max 5, 5MB each). Auto-moderate for profanity. |
| REV-004 | Business response | Business owner can respond publicly; response shown below review. |
| REV-005 | Review helpfulness | Users can mark reviews as helpful; sort by most helpful. |
| REV-006 | Report review | Users can report inappropriate reviews; admin queue for review. |
| REV-007 | Average rating | Recalculated on new review; cached and updated via trigger. |

---

### 3.14 Payment Integration
**Priority:** P0  
**Owner:** Backend / Frontend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PAY-001 | Payment provider | Stripe as primary; support cards, Apple Pay, Google Pay, PayPal. |
| PAY-002 | Payment intent | Create payment intent on checkout; client confirms; webhook confirms success. |
| PAY-003 | Saved payment methods | Store payment method IDs (not card numbers); require CVC for first use, optional for subsequent. |
| PAY-004 | Refunds | Full and partial refunds initiated by user (per policy) or business owner. Webhook updates status. |
| PAY-005 | Service fees | Platform fee (configurable %) added to transaction; shown transparently to user. |
| PAY-006 | Payouts to businesses | Automated weekly payouts to business bank accounts via Stripe Connect. |
| PAY-007 | Invoice & receipts | Email receipt on payment; downloadable PDF invoice from profile. |
| PAY-008 | Failed payment handling | Retry logic (3 attempts); notify user; auto-cancel booking if unresolved in 24h. |

---

### 3.15 Notifications
**Priority:** P1  
**Owner:** Backend / Mobile

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| NOTIF-001 | Push notifications | Firebase Cloud Messaging for iOS/Android. Rich notifications with images and actions. |
| NOTIF-002 | Email notifications | SendGrid integration. Templates: welcome, booking confirmation, reminder, cancellation, review request, promo. |
| NOTIF-003 | SMS notifications | Twilio for critical alerts: booking reminders, same-day changes. |
| NOTIF-004 | Notification types | Booking reminders (24h, 2h before), confirmations, cancellations, promotions, new review, account security. |
| NOTIF-005 | Preference management | Granular opt-in/opt-out per channel and type. Respect unsubscribe immediately. |
| NOTIF-006 | Delivery tracking | Log delivery status; retry failed pushes/emails with exponential backoff. |

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0  
**Owner:** Full Stack

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BPORT-001 | Dashboard overview | Today's appointments, revenue this week, new clients, upcoming week preview. |
| BPORT-002 | Calendar view | Day/week/month views; drag-to-reschedule; color-coded by status. |
| BPORT-003 | Appointment management | View, confirm, reschedule, cancel client appointments. Bulk actions supported. |
| BPORT-004 | Service management | CRUD services: name, description, duration, price, category, staff assignment, photo. |
| BPORT-005 | Staff management | Add staff, set schedules, assign services, view individual calendars. |
| BPORT-006 | Availability rules | Set business hours, breaks, time off, special hours (holidays). |
| BPORT-007 | Client management | Client list with history, notes, contact info; export to CSV. |
| BPORT-008 | Reviews management | View and respond to reviews; get notified of new reviews. |
| BPORT-009 | Analytics | Charts: bookings over time, revenue, popular services, no-show rate, client retention. Date range selector. |
| BPORT-010 | Settings | Business info, photos, payment settings (Stripe Connect onboarding), notification preferences, cancellation policy. |
| BPORT-011 | Multi-location | Support businesses with multiple locations; switch between locations. |

---

### 3.17 Admin Dashboard
**Priority:** P1  
**Owner:** Full Stack

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| ADMIN-001 | User management | Search, view, suspend, delete users. Filter by role, status, registration date. |
| ADMIN-002 | Business onboarding | Review and approve new business registrations; verify documents. |
| ADMIN-003 | Business management | View all businesses; edit, suspend, or feature businesses. |
| ADMIN-004 | Content moderation | Review reported reviews/content; approve, reject, or escalate. |
| ADMIN-005 | Financial overview | Platform revenue, payouts pending, refunds processed, fee revenue. |
| ADMIN-006 | Analytics | MAU, booking volume, GMV, top categories, geographic distribution. |
| ADMIN-007 | Support tickets | View and manage customer support requests; assign to agents. |
| ADMIN-008 | System health | Monitor BullMQ queues, error rates, API latency, database connections. |
| ADMIN-009 | Role-based access | Different admin roles: `super_admin`, `support_agent`, `finance`, `moderator`. |

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0  
**Owner:** Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BULL-001 | Queue architecture | Separate queues per concern: `emails`, `push-notifications`, `sms`, `payments`, `analytics`, `search-indexing`. |
| BULL-002 | Job retry policy | Exponential backoff: retry 3 times, then move to dead-letter queue. Alert on DLQ growth. |
| BULL-003 | Scheduled jobs | Cron-based: daily payout calculations, weekly analytics reports, nightly data cleanup. |
| BULL-004 | Slot cache warming | Pre-compute and cache popular business slots every 15 minutes during business hours. |
| BULL-005 | Notification dispatch | Queue all notifications; process with rate limiting (max 100/sec per channel). |
| BULL-006 | Search indexing | On business/service CRUD, queue re-indexing job. Bulk re-index capability. |
| BULL-007 | Payment webhooks | Queue incoming Stripe webhooks for idempotent processing; verify signature. |
| BULL-008 | Monitoring | BullMQ Dashboard or custom UI showing queue depths, processing rates, failed jobs. |
| BULL-009 | Job idempotency | All jobs accept idempotency key; duplicate jobs with same key are deduplicated. |

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | API p95 < 200ms; search results < 500ms; image load with CDN |
| **Scalability** | Horizontal scaling via Kubernetes; stateless API design |
| **Security** | OWASP Top 10 mitigation; rate limiting; input validation; SQL injection prevention |
| **Compliance** | GDPR data portability & right to erasure; PCI-DSS for payments |
| **Reliability** | 99.9% uptime SLA; automated backups (point-in-time recovery); multi-AZ deployment |
| **Monitoring** | Sentry for errors; Datadog/Grafana for metrics; PagerDuty for on-call |

---

## 5. Prioritization Matrix

| Feature | Priority | Sprint Target | Dependencies |
|---------|----------|---------------|--------------|
| User Authentication | P0 | Sprint 1 | — |
| Shared Types & Design System | P0 | Sprint 1 | — |
| Business Search & Discovery | P0 | Sprint 2 | Search infra |
| Map-based Search | P0 | Sprint 2 | Search & Discovery |
| Business Detail View | P0 | Sprint 2 | — |
| Service Categories | P0 | Sprint 2 | — |
| Availability & Slot Computation | P0 | Sprint 3 | Business hours, staff |
| Booking Flow | P0 | Sprint 3 | Auth, slots, payments |
| Appointment Management | P0 | Sprint 4 | Booking flow |
| Payment Integration | P0 | Sprint 4 | Booking flow |
| Provider / Business Owner Portal | P0 | Sprint 5-6 | Booking, appointments |
| Background Jobs (BullMQ) | P0 | Sprint 3-6 | Notifications, payments |
| Guest Browse & Explore | P0 | Sprint 1-2 | — |
| User Profile | P1 | Sprint 4 | Auth |
| Favorites | P1 | Sprint 3 | Auth, search |
| Reviews & Ratings | P1 | Sprint 5 | Appointments |
| Notifications | P1 | Sprint 5 | BullMQ, appointments |
| Admin Dashboard | P1 | Sprint 6-7 | All above |

---

## 6. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Monthly Active Users (MAU) | 10,000 by month 6 | Analytics |
| Booking Conversion Rate | ≥ 15% | Bookings / Search sessions |
| Search-to-book time | < 3 minutes | Event tracking |
| Business onboarding completion | ≥ 70% | Funnel analysis |
| App Store rating | ≥ 4.5 stars | App stores |
| Customer support tickets | < 2% of bookings | Support system |
| Platform uptime | 99.9% | Monitoring |

---

## 7. Open Questions & Risks

| ID | Question / Risk | Mitigation |
|----|-----------------|------------|
| RQ-001 | Stripe Connect onboarding friction for businesses | Provide guided onboarding; dedicated support for first 100 businesses |
| RQ-002 | Real-time slot accuracy under high concurrency | Optimistic locking + slot reservation pattern; load test before launch |
| RQ-003 | Search relevance at scale | Start with PostgreSQL full-text; migrate to Elasticsearch if needed |
| RQ-004 | iOS App Store review delays | Submit early; use TestFlight for beta; have web fallback |
| RQ-005 | Business adoption in target geography | Launch with anchor businesses; offer waived fees for first 3 months |

---

*Document Version: 1.0*  
*Last Updated: 2024*  
*Author: Alex — Product Owner*
