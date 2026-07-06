# Planity Clone — Product Specification

## 1. Overview

Build a cross-platform mobile and web application enabling users to discover, book, and manage appointments with local beauty/wellness businesses. Two-sided marketplace: consumers (booking) and providers (business owners managing their presence and appointments).

---

## 2. User Personas

| Persona | Description |
|---------|-------------|
| **Consumer** | Discovers services, books appointments, manages schedule |
| **Guest** | Browses without account, prompted to register at booking |
| **Business Owner** | Manages business profile, services, availability, bookings |
| **Staff Member** | Receives appointments, manages own schedule |
| **Admin** | Platform oversight, support, content moderation |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| AUTH-001 | Email/password registration | User receives verification email; account created upon verification |
| AUTH-002 | Login with email/password | JWT token issued; refresh token rotation implemented |
| AUTH-003 | Social login (Google, Apple) | OAuth 2.0 flow; account linking if email exists |
| AUTH-004 | Password reset | Secure token via email; 1-hour expiry |
| AUTH-005 | Biometric login (mobile) | Face ID/Touch ID option after initial password login |
| AUTH-006 | Session management | Auto-logout after 30 days; concurrent session limit of 3 |
| AUTH-007 | Account deletion | GDPR-compliant; 30-day grace period with data export option |

---

### 3.2 Guest Browse & Explore

**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| GBR-001 | Unauthenticated browsing | Full search and discovery without login; no booking without account |
| GBR-002 | Persistent guest session | 30-day local storage of viewed items; prompt to save on return |
| GBR-003 | Conversion prompt | Non-intrusive banner to register/login when attempting protected action |
| GBR-004 | Guest-to-user migration | Favorites and recent views transfer upon registration |

---

### 3.3 Business Search & Discovery

**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SCH-001 | Text search | Search by business name, service name, or description; typo tolerance; result ranking by relevance + proximity + rating |
| SCH-002 | Filter system | Category, price range, rating (4.0+), availability today, gender of staff, accessibility features |
| SCH-003 | Sort options | Distance, rating, price (low/high), most reviewed, availability soonest |
| SCH-004 | Auto-complete | Suggestions after 2 characters; recent searches cached |
| SCH-005 | Search history | Last 20 searches; clearable; used for personalized ranking |
| SCH-006 | "Near me" default | Geolocation permission; fallback to last known or manual city selection |

---

### 3.4 Map-based Search

**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| MAP-001 | Interactive map view | Google Maps/Mapbox integration; cluster markers at zoom levels |
| MAP-002 | Business pins | Color-coded by category; tap to show preview card with next available slot |
| MAP-003 | Map/list toggle | Seamless switch preserving filters and viewport |
| MAP-004 | Radius search | Adjustable 1-50km; update results on map pan/zoom with debounce |
| MAP-005 | Directions | Deep-link to native maps app for routing |

---

### 3.5 Business Detail View

**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BDV-001 | Hero section | Cover image, business name, rating, review count, favorite toggle, share |
| BDV-002 | Photo gallery | Up to 30 images; swipeable; full-screen viewer |
| BDV-003 | Service menu | Grouped by category; expandable; price and duration displayed |
| BDV-004 | Staff profiles | Photo, name, specialty, rating; filter services by staff |
| BDV-005 | Availability preview | Next 3 available slots per service; "See more" to booking flow |
| BDV-006 | Business info | Address, hours, phone, website, social links, amenities, COVID/safety policies |
| BDV-007 | Review summary | Aggregate rating; distribution histogram; keyword tags |
| BDV-008 | Similar businesses | Carousel of related businesses in area |

---

### 3.6 Service Categories

**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CAT-001 | Hierarchical categories | 3-level tree: e.g., Beauty > Hair > Haircut, Coloring, Styling |
| CAT-002 | Category browsing | Icon grid; trending categories promoted |
| CAT-003 | Category landing pages | SEO-optimized; featured businesses, popular services, price guides |
| CAT-004 | Dynamic category management | Admin-configurable; business self-categorization with admin approval |

---

### 3.7 Booking Flow

**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BKF-001 | Service selection | Single or multiple services; bundle pricing displayed |
| BFK-002 | Staff selection | "Any available" or specific staff; show staff calendar |
| BFK-003 | Date/time selection | 7-day forward view; slot availability in real-time; time zone handling |
| BFK-004 | Guest details | Auto-filled for logged-in users; guest count for group services |
| BFK-005 | Special requests | 250-character text field; business-configurable required fields |
| BFK-006 | Booking confirmation | Summary review; terms acceptance; 10-minute hold on slot |
| BFK-007 | Confirmation screen | Booking reference, add to calendar, share, directions |
| BFK-008 | Guest checkout | Email + phone required; account creation prompt post-booking |

---

### 3.8 Appointment Management

**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| APT-001 | Upcoming appointments list | Chronological; group by date; pull-to-refresh |
| APT-002 | Appointment detail | All booking info; staff, service, location, QR code for check-in |
| APT-003 | Reschedule | Within business policy; new slot selection; single confirmation |
| APT-004 | Cancellation | User-initiated with reason; refund policy displayed; penalty if applicable |
| APT-005 | Rebooking | One-tap rebook same service/staff from past appointment |
| APT-006 | No-show policy | Marked after 15 min past start; affects future booking eligibility |
| APT-007 | Appointment history | Complete archive; searchable; receipt download |

---

### 3.9 Favorites

**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| FAV-001 | Save/remove businesses | Heart toggle; instant sync; offline queue if no connection |
| FAV-002 | Favorites list | Grid view; sort by recently added, name, upcoming availability |
| FAV-003 | Quick rebook | Direct to booking flow from favorite with pre-selected last service |
| FAV-004 | Availability alerts | Notify when favorite has open slot matching user's typical booking time |

---

### 3.10 User Profile

**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PRF-001 | Profile management | Name, phone, photo, birthday (for birthday offers), gender |
| PRF-002 | Preferences | Default search radius, notification settings, preferred staff gender |
| PRF-003 | Payment methods | Multiple cards; default selection; PCI-compliant tokenization |
| PRF-004 | Loyalty status | Points balance; tier status; history |
| PRF-005 | Privacy settings | Location sharing, marketing consent, data download |
| PRF-006 | Referral program | Unique code; trackable rewards; share via native share sheet |

---

### 3.11 Availability & Slot Computation

**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SLT-001 | Business hours definition | Weekly recurring + exception dates; multiple staff schedules |
| SLT-002 | Service duration mapping | Fixed or variable; buffer time between appointments |
| SLT-003 | Real-time slot calculation | Account for existing bookings, staff breaks, blackout dates |
| SLT-004 | Concurrent booking limits | Prevent double-booking; optimistic locking on slot selection |
| SLT-005 | Waitlist | Notify when preferred slot opens due to cancellation |
| SLT-006 | Slot release | Auto-release held slots after timeout or user abandonment |
| SLT-007 | Complex scheduling rules | Support recurring blocks, staff-specific services, room/equipment constraints |

---

### 3.12 Shared Types & Design System

**Priority:** P0 (infrastructure)

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| DS-001 | Component library | React Native / React web shared components; Storybook documentation |
| DS-002 | Design tokens | Colors, typography, spacing, shadows as variables; theme support (light/dark) |
| DS-003 | Accessibility | WCAG 2.1 AA; screen reader support; minimum touch targets 44x44dp |
| DS-004 | Localization | i18n framework; French, English, German, Spanish Phase 1 |
| DS-005 | Responsive breakpoints | Mobile-first; tablet and desktop adaptations |
| DS-006 | Animation standards | 200ms transitions; reduced motion respect |
| DS-007 | Error states | Consistent empty, loading, error, and offline states across all screens |

---

### 3.13 Reviews & Ratings

**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| REV-001 | Post-booking review prompt | 24 hours after appointment; in-app and push notification |
| REV-002 | Rating dimensions | Overall (1-5), service quality, staff, ambiance, value; optional per-dimension |
| REV-003 | Review content | Text (500 max), photo upload (3 max); profanity filter |
| REV-004 | Business response | Owner reply; marked as "Business response"; notification to reviewer |
| REV-005 | Review moderation | Auto-flag keywords; admin queue; appeal process |
| REV-006 | Verified badge | Only post-appointment reviews show "Verified visit" |
| REV-007 | Review helpfulness | Users can mark helpful; sort by helpful or recent |

---

### 3.14 Payment Integration

**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PAY-001 | Payment methods | Credit/debit (Stripe), Apple Pay, Google Pay; SEPA for EU |
| PAY-002 | Pricing models | Full prepay, deposit, pay-at-venue, or free booking |
| PAY-003 | Cancellation refund | Automated per business policy; partial or full refund; 5-7 business days |
| PAY-004 | Receipts | Email and in-app; PDF download; itemized |
| PAY-005 | Failed payment retry | 24-hour grace; notification; auto-cancel if unresolved |
| PAY-006 | Payout to businesses | Weekly to business account; dashboard of pending/complete; Stripe Connect |
| PAY-007 | Platform fee | Configurable percentage; transparent at checkout |

---

### 3.15 Notifications

**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| NOT-001 | Push notifications | Booking confirmations, reminders (24h, 2h, 15min), promotions, waitlist |
| NOT-002 | SMS fallback | For critical messages if push not delivered; configurable opt-in |
| NOT-003 | Email notifications | Rich HTML; all transactional events; digest option for marketing |
| NOT-004 | In-app inbox | Persistent notification history; unread badge; deep-link to relevant screen |
| NOT-005 | Preference center | Granular control per channel and notification type |
| NOT-006 | Quiet hours | Respect local timezone; no promotional pushes 22:00-08:00 |

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BOP-001 | Business profile setup | Step-by-step wizard; completeness indicator; required fields for publish |
| BOP-002 | Service management | CRUD services; pricing, duration, description, photos; enable/disable |
| BOP-003 | Staff management | Add staff, set roles, assign services, manage individual schedules |
| BOP-004 | Availability calendar | Weekly template + exceptions; drag-to-block; copy week |
| BOP-005 | Booking management | Day/week/month views; accept/decline/request reschedule; color-coded status |
| BOP-006 | Customer notes | Internal notes per customer; visible to all staff |
| BOP-007 | Analytics dashboard | Bookings, revenue, no-show rate, popular services, peak times; date range filter |
| BOP-008 | Review management | Respond to reviews; flag inappropriate; sentiment summary |
| BOP-009 | Promotions | Create discount codes; set usage limits; track redemption |
| BOP-010 | Multi-location | Switch between locations; consolidated or per-location reporting |

---

### 3.17 Admin Dashboard

**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| ADM-001 | User management | Search, view, suspend, impersonate; audit log |
| ADM-002 | Business onboarding | Approval workflow; verification status; document management |
| ADM-003 | Content moderation | Review queue for flagged content; bulk actions; escalation rules |
| ADM-004 | Financial overview | Gross merchandise value, platform fees, refunds, payouts pending |
| ADM-005 | Dispute resolution | Booking dispute ticket system; resolution tracking; refund authorization |
| ADM-006 | System health | API latency, error rates, queue depth; alert thresholds |
| ADM-007 | Feature flags | Gradual rollout; A/B test configuration; kill switches |

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P0 (infrastructure)

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| JOB-001 | Job queue architecture | BullMQ with Redis; separate queues by priority and type |
| JOB-002 | Email dispatch | Queued send; retry with exponential backoff; dead letter after 5 attempts |
| JOB-003 | Push notification delivery | Batch processing; rate limiting per provider; delivery tracking |
| JOB-004 | SMS gateway | Twilio integration; fallback provider; cost optimization |
| JOB-005 | Payment processing | Webhook handling; idempotency keys; reconciliation jobs |
| JOB-006 | Search index updates | Near-real-time Algolia/Elasticsearch sync on business/service changes |
| JOB-007 | Analytics aggregation | Nightly rollups; materialized view refresh; anomaly detection |
| JOB-008 | Data exports | GDPR exports; scheduled reports; large file S3 storage with signed URLs |
| JOB-009 | Job monitoring | Bull Board dashboard; failed job alerting; manual retry interface |
| JOB-010 | Scheduled jobs | Cron-based; timezone-aware; daylight saving handling |

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App cold start <2s; screen load <1s; API p95 <200ms |
| **Scalability** | Horizontal scaling; 10x traffic spike handling |
| **Security** | OWASP Top 10 mitigation; annual penetration test; SOC 2 roadmap |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1 (via Stripe) |
| **Reliability** | 99 uptime SLA; <0.1% error rate |
| **Data Retention** | 7-year financial; user-deleted after 30-day grace |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 100K by Month 12 |
| Booking conversion rate | >15% search-to-book |
| NPS score | >50 |
| Business retention | >80% at 6 months |
| Customer acquisition cost | <€20 |
| Gross merchandise value | €2M monthly by Year 2 |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest browse, Search, Business detail, Booking, Appointments, Provider portal basic, Payments, Slot computation | Month 1-3 |
| **V1.1** | Map search, Favorites, Reviews, Notifications, Profile complete | Month 4-5 |
| **V1.2** | Admin dashboard, Analytics, Promotions, Multi-location, Background jobs optimization | Month 6-8 |
| **V2.0** | AI recommendations, Subscription plans, Marketplace features, International expansion | Month 9-12 |

---

## 7. Open Questions

1. Geographic launch sequence (France first?)
2. Commission vs. subscription revenue model for businesses
3. In-house delivery vs. third-party logistics for product sales
4. Insurance/liability coverage for no-shows and disputes

---

*Document version: 1.0*
*Last updated: 2024*
*Author: Alex, Product Owner*