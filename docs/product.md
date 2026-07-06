# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with beauty, wellness, and health service providers for appointment booking. The platform serves three user types: **Customers** (book appointments), **Providers** (manage businesses/services/availability), and **Admin** (platform oversight).

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | Seeks and books beauty/wellness services | Discover, compare, book, manage appointments |
| **Guest** | Unregistered browser | Explore before committing to signup |
| **Provider** | Business owner/manager | Manage schedule, services, staff, revenue |
| **Admin** | Platform operator | Monitor, moderate, support growth |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 — Critical Path

**Description:** Secure, frictionless authentication supporting multiple methods.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| AUTH-01 authentication methods | Email/password, Google OAuth, Apple Sign-In | All three methods functional; Apple Sign-In mandatory for iOS |
| AUTH-02 registration | Account creation with email verification | Verification email sent; account activated upon click; 24hr expiry |
| AUTH-03 login | Secure session management | JWT access token (15min) + refresh token (7 days); biometric option on mobile |
| AUTH-04 password reset | Self-service password recovery | Email link with 1-hour expiry; secure token generation |
| AUTH-05 session handling | Automatic refresh, secure logout | Silent refresh on app foreground; clear all tokens on logout |
| AUTH-06 role-based access | Differentiate customer/provider/admin | Token contains role; middleware enforces route guards |

**Non-functional:** Rate limit: 5 login attempts/minute per IP.

---

### 3.2 Guest Browse & Explore

**Priority:** P0 — Conversion Funnel Entry

**Description:** Pre-authentication discovery to reduce signup friction.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| GUEST-01 unrestricted browsing | View businesses, services, reviews without login | All read-only endpoints public; no 401 on GET /businesses, /services, /reviews |
| GUEST-02 search functionality | Full search and filter access | Same search capabilities as authenticated users |
| GUEST-03 booking prompt | Trigger auth at booking initiation | Auth modal appears on "Book" click; preserve context post-login |
| GUEST-04 location permission | Request geolocation for relevance | One-time prompt; fallback to manual city selection |

---

### 3.3 Business Search & Discovery

**Priority:** P0 — Core Value Proposition

**Description:** Intelligent search to find relevant service providers.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SEARCH-01 text search | Search by business name, service name, or keyword | Fuzzy matching; results ranked by relevance score; <200ms response |
| SEARCH-02 filters | Multi-criteria refinement | Category, price range, rating (1-5), distance, availability today/this week |
| SEARCH-03 sorting options | Order results by relevance, rating, distance, price | Default: relevance; user preference persisted |
| SEARCH-04 autocomplete | Suggest businesses, services, locations as user types | Debounced 300ms; max 8 suggestions; keyboard navigable |
| SEARCH-05 recent searches | Persist last 10 searches per user | Local storage for guests; cloud sync for authenticated |
| SEARCH-06 saved searches | Named saved search with alert option | Push notification when matching new business opens |

**Technical:** Elasticsearch/OpenSearch index with custom analyzers for French/English.

---

### 3.4 Map-based Search

**Priority:** P0 — Geographic Discovery

**Description:** Visual spatial exploration of businesses.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| MAP-01 interactive map | Pin cluster display with zoom-level aggregation | Max 50 pins rendered; cluster count visible; smooth 60fps pan/zoom |
| MAP-02 current location | Center on user GPS with accuracy indicator | Fallback to IP geolocation; accuracy ring displayed |
| MAP-03 business cards | Tappable pins reveals preview card | Photo, name, rating, next available slot, starting price |
| MAP-04 list/map toggle | Switch between views without losing context | Same results, same sort/filter state; URL shareable |
| MAP-05 boundary search | Search within visible map area | "Search this area" button after pan; auto-search optional toggle |
| MAP-06 directions | External navigation to business | Deep link to Google Maps / Apple Maps / Waze |

---

### 3.5 Business Detail View

**Priority:** P0 — Conversion Page

**Description:** Comprehensive business information to drive booking decision.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| DETAIL-01 hero section | Business name, photos, rating, favorite action | Cover image + up to 10 photo gallery; avg rating with review count |
| DETAIL-02 service menu | Categorized list of bookable services | Group by category; expand/collapse; price and duration displayed |
| DETAIL-03 team display | Staff members with photos and specialties | Tap to see individual availability |
| DETAIL-04 availability preview | Next available slots per service | "Next available: Today 14:30" or date if not today |
| DETAIL-05 business info | Address, hours, phone, policies | Click-to-call; hours show current day highlighted; cancellation policy |
| DETAIL-06 social proof | Reviews summary with distribution | Star breakdown; most mentioned tags; photos from reviews |
| DETAIL-07 similar businesses | Carousel of related providers | Same category, within 5km, sorted by rating |

---

### 3.6 Service Categories

**Priority:** P0 — Taxonomy Foundation

**Description:** Hierarchical classification for discovery and management.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CAT-01 category tree | Two-level hierarchy | Parent: Hair, Face, Body, Nails, Wellness, Medical Aesthetic; 3-8 children each |
| CAT-02 category icons | Visual identification | Consistent icon set; fallback to generic if custom missing |
| CAT-03 trending categories | Dynamic promotion based on bookings | Updated weekly; exclude categories with <10 bookings |
| CAT-04 category landing | Dedicated page per category | Description, popular services, featured businesses, price guidance |
| CAT-05 admin management | CRUD for categories with icon upload | Slug-based URLs; SEO metadata; soft delete prevents orphaning |

---

### 3.7 Booking Flow

**Priority:** P0 — Revenue-Critical

**Description:** Seamless multi-step appointment reservation.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BOOK-01 service selection | Choose service with variant options | Duration, price update dynamically; optional add-ons selectable |
| BOOK-02 provider selection | Choose specific staff or "no preference" | Staff calendar shows individual availability |
| BOOK-03 date/time selection | Calendar view with slot grid | 7-day forward default; month picker; slots filtered by real-time availability |
| BOOK-04 slot confirmation | Hold slot for 10 minutes during checkout | Redis-held slot; released on timeout, cancel, or payment failure |
| BOOK-05 guest info | Collect or confirm contact details | Pre-fill for returning customers; phone validation required |
| BOOK-06 special requests | Free text field for customer notes | 250 character limit; flagged to provider |
| BOOK-07 booking confirmation | Summary review before commit | All details editable until final confirm; total price with breakdown |
| BOOK-08 confirmation | Success state with calendar integration | ICS file download; Add to Calendar (Google/Apple/Outlook) |
| BOOK-09 cancellation policy | Display and enforce per-business rules | Configurable: free until X hours, percentage fee, or non-refundable |

---

### 3.8 Appointment Management

**Priority:** P0 — Post-Booking Experience

**Description:** Lifecycle management of customer appointments.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| APPT-01 upcoming list | Chronological view of future appointments | Group by month; pull-to-refresh; empty state with CTA |
| APPT-02 appointment detail | Full booking information and actions | Reschedule, cancel, contact provider, get directions |
| APPT-03 reschedule | Move to new slot with same service | Subject to availability and policy; old slot released immediately |
| APPT-04 cancellation | Self-service with refund handling | Confirmation modal; reason capture (optional); instant refund for eligible |
| APPT-05 history | Past appointments with rebook option | Searchable; filter by year; quick rebook same service |
| APPT-06 no-show handling | Provider marks absence | Customer notified; policy applied; affects future booking restrictions |

---

### 3.9 Favorites

**Priority:** P1 — Engagement/Retention

**Description:** Bookmark businesses for quick access.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| FAV-01 toggle favorite | Heart icon on business card and detail | Optimistic UI; sync in background; offline queue if needed |
| FAV-02 favorites list | Grid of saved businesses | Last-added sort option; availability indicator; quick book button |
| FAV-03 availability alerts | Notify when favorite has open slot | Push notification; configurable (same day, next 3 days, any) |
| FAV-04 sync | Cross-device favorites | Immediate sync on login; conflict resolution by most recent |

---

### 3.10 User Profile

**Priority:** P1 — Personalization

**Description:** Customer identity and preference management.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PROF-01 profile info | Name, phone, photo, email | Email change requires re-verification; phone SMS verification |
| PROF-02 preferences | Default booking settings | Preferred reminder time (15min/1hr/24hr), notification channels |
| PROF-03 payment methods | Saved cards with Stripe integration | PCI-compliant via Stripe Elements; default card selection; expiry alerts |
| PROF-04 addresses | Saved locations for search | Home/work labels; geocoded for accuracy |
| PROF-05 privacy settings | Data visibility and marketing consent | GDPR compliant; export data; delete account with 30-day grace |
| PROF-06 loyalty status | Booking history summary | Total appointments, favorite categories, member since |

---

### 3.11 Availability & Slot Computation

**Priority:** P0 — Technical Foundation

**Description:** Real-time calculation of bookable time slots.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SLOT-01 business hours | Weekly schedule with exceptions | Standard hours + holiday overrides; timezone-aware |
| SLOT-02 staff schedules | Individual working hours and breaks | Override business hours; recurring patterns; vacation blocks |
| SLOT-03 service duration | Variable slot consumption | Base duration + buffer time; parallel service constraints |
| SLOT-04 existing bookings | Block reserved times | Consider all confirmed, pending-payment, and held slots |
| SLOT-05 real-time computation | Generate slots on demand | <100ms for 7-day window; cached with 5-second TTL |
| SLOT-06 buffer rules | Prevent back-to-back exhaustion | Configurable gap between appointments; lunch break enforcement |
| SLOT-07 split slots | Handle non-contiguous availability | Show only slots fitting full service duration |

---

### 3.12 Shared Types & Design System

**Priority:** P0 — Development Efficiency

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| DS-01 design tokens | Colors, typography, spacing, shadows | Figma source of truth; CSS variables; dark mode support |
| DS-02 component library | Reusable UI components | Button, Input, Card, Modal, DatePicker, TimeSlot, Avatar, Badge, Skeleton |
| DS-03 shared types | TypeScript definitions across stack | Zod schemas for runtime validation; shared package published |
| DS-04 responsive grid | Mobile-first breakpoints | 320px base; 768px tablet; 1024px desktop |
| DS-05 accessibility | WCAG 2.1 AA minimum | Screen reader labels; focus management; color contrast 4.5:1 |
| DS-06 animation standards | Consistent motion design | 200ms transitions; reduced motion respect |

---

### 3.13 Reviews & Ratings

**Priority:** P1 — Trust & Discovery

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| REV-01 post-appointment review | Eligible 24hrs after service completion | Reminder notification; eligible for 30 days; one review per appointment |
| REV-02 rating breakdown | Overall + category ratings | Service quality, ambiance, staff, value — each 1-5 stars |
| REV-03 review content | Text and photo upload | 10-1000 characters; up to 5 photos; auto-moderation for content |
| REV-04 provider response | Public reply to reviews | Notification to provider; 48hr suggested response time |
| REV-05 helpful votes | Community moderation | Mark as helpful; sort by helpfulness; report inappropriate |
| REV-06 review display | Aggregate and individual views | Verified badge for completed bookings; highlight recent and detailed |

---

### 3.14 Payment Integration

**Priority:** P0 — Revenue Collection

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PAY-01 Stripe integration | Card payments and wallets | Credit/debit, Apple Pay, Google Pay, PayPal; 3D Secure support |
| PAY-02 payment hold | Pre-authorization at booking | Hold placed on card; captured on appointment completion or auto-capture |
| PAY-03 provider payouts | Automated transfer to connected accounts | Stripe Connect; weekly payout default; instant payout option (fee) |
| PAY-04 refund processing | Automated per cancellation policy | Full, partial, or no refund based on rules; processed within 5-10 days |
| PAY-05 invoice generation | Receipt and invoice delivery | Email PDF; VAT compliant; business name and address |
| PAY-06 failed payment handling | Retry and notification | 24hr retry window; customer notified; booking held conditionally |

---

### 3.15 Notifications

**Priority:** P1 — Engagement

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| NOTIF-01 push notifications | Mobile alerts for key events | Booking confirmed, reminder (configurable), cancelled, promotion |
| NOTIF-02 email notifications | Transactional emails | SendGrid/Postmark; branded templates; deliverability >95% |
| NOTIF-03 SMS fallback | Critical alerts via text | Booking day reminder; urgent changes; opt-in required |
| NOTIF-04 in-app inbox | Persistent notification center | Unread count on bell icon; 90-day retention; mark as read |
| NOTIF-05 preference management | Granular opt-in control | Channel per notification type; marketing separate from transactional |
| NOTIF-06 provider notifications | Alert on new bookings | Real-time websocket + push + email; configurable quiet hours |

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0 — Supply-Side Platform

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PROV-01 dashboard overview | Business health at glance | Today's appointments, revenue this week, occupancy rate, new reviews |
| PROV-02 calendar management | Visual schedule for all staff | Day/week/month views; drag-drop reschedule; color by status |
| PROV-03 service management | CRUD for services and pricing | Duration, price, description, photo, category assignment; archive option |
| PROV-04 staff management | Team member profiles and permissions | Role: owner/admin/staff; schedule assignment; service competence |
| PROV-05 availability settings | Define when bookable | Weekly template + exceptions; copy-paste patterns; bulk edit |
| PROV-06 booking rules | Configure policies | Cancellation window, deposit requirement, max future booking |
| PROV-07 customer notes | View and add client information | Appointment history; preferences; allergies; internal notes |
| PROV-08 analytics | Business performance metrics | Revenue, bookings, no-show rate, popular services, peak times |
| PROV-09 review management | Respond to and report reviews | Public reply; flag for moderation; sentiment overview |

---

### 3.17 Admin Dashboard

**Priority:** P2 — Platform Operations

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| ADMIN-01 user management | Search, view, suspend accounts | Filter by role, status, date; audit log of admin actions |
| ADMIN-02 business verification | Onboarding and approval workflow | Document upload; verification status; bulk actions |
| ADMIN-03 content moderation | Review flagged content | Queue of reported reviews/photos; approve/hide/escalate |
| ADMIN-04 financial oversight | Transaction monitoring | Refund issuance; payout tracking; dispute management |
| ADMIN-05 platform analytics | Aggregate business intelligence | MAU, booking volume, GMV, churn, top categories, geographic heatmap |
| ADMIN-06 system health | Monitor background jobs and errors | BullMQ queue depth; failed job retry; error rate alerts |
| ADMIN-07 promotional tools | Campaign and coupon management | Create codes; set usage limits; track redemption |

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P1 — Reliability

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| JOB-01 queue architecture | Separate queues by priority and type | high, default, low priority queues; named: bookings, notifications, emails, payments, analytics |
| JOB-02 retry policy | Exponential backoff with dead letter | 3 attempts; then DLQ with alert; manual retry interface |
| JOB-03 idempotency | Safe reprocessing | Unique job ID; operation idempotency keys |
| JOB-04 scheduled jobs | Cron-based recurring tasks | Daily: report generation, cleanup; weekly: trending calculation |
| JOB-05 job monitoring | Real-time queue dashboard | Bull Board or custom UI; job count, processing time, failure rate |
| JOB-06 specific job types | Critical background operations | Slot cache warm-up, payment capture, reminder dispatch, review solicitation, search index update |

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App launch <2s; page load <1s; API response p95 <200ms |
| **Availability** | 99.9% uptime; scheduled maintenance windows |
| **Security** | OWASP Top 10 mitigation; encryption at rest and in transit |
| **Compliance** | GDPR, PCI-DSS (via Stripe), CCPA where applicable |
| **Localization** | French (default), English; EUR currency; European date formats |
| **Offline** | Graceful degradation; queue actions for sync |

---

## 5. Priority Matrix

| Priority | Features |
|----------|----------|
| **P0 — Launch Critical** | User Authentication, Guest Browse, Search & Discovery, Map Search, Business Detail, Booking Flow, Appointment Management, Availability/Slots, Payment, Provider Portal, Design System |
| **P1 — Near-Term** | Favorites, User Profile, Reviews, Notifications, Background Jobs |
| **P2 — Scale** | Admin Dashboard, Advanced Analytics, Promotional Tools |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Guest-to-signup conversion | >15% |
| Booking completion rate | >60% of initiated bookings |
| Search-to-booking conversion | >8% |
| Provider NPS | >50 |
| Customer retention (30-day) | >40% |
| Payment success rate | >98% |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex, Product Owner*