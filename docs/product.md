# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with beauty/wellness businesses for appointment booking. It serves three user types: **Customers** (book appointments), **Business Owners** (manage availability and bookings), and **Admin** (platform oversight).

---

## 2. User Personas

| Persona | Goal | Pain Point |
|---------|------|------------|
| **Customer** | Book services quickly, manage appointments | Finding available slots that fit their schedule |
| **Guest** | Browse without commitment | Cannot save preferences or book without account |
| **Business Owner** | Fill calendar, reduce no-shows | Manual scheduling overhead |
| **Admin** | Monitor platform health, support users | Fraud, disputes, content quality |

---

## 3. Features & Acceptance Criteria

### 3.1 User Authentication
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| AUTH-01 | Registration (email, phone, social) | User can register with email+password, phone OTP (Twilio), or Google/Apple OAuth. Verification required before booking. |
| AUTH-02 | Login | JWT access + refresh token flow. Biometric login optional on mobile. |
| AUTH-03 | Password reset | Secure token sent via email; expires in 1 hour. |
| AUTH-04 | Session management | Auto-logout after 30 days idle. Concurrent session limit: 5 devices. |
| AUTH-05 | Role-based access | Token contains `role`: `customer`, `business_owner`, `admin`. Middleware enforces route guards. |

---

### 3.2 Guest Browse & Explore
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| GUE-01 | Category browsing without login | Guest sees all public business listings, categories, and basic search. |
| GUE-02 | View business details | Guest sees services, prices, photos, reviews (read-only). |
| GUE-03 | Prompt to register | "Book Now" and "Add to Favorites" trigger auth modal with preserved intent. |
| GUE-04 | Session persistence | Guest search filters stored in localStorage; applied post-login. |

---

### 3.3 Business Search & Discovery
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SEA-01 | Text search | Search by business name, service name, or keyword. Results ranked by relevance + proximity + rating. |
| SEA-02 | Filters | Category, price range, rating (4.0+), availability today, gender of staff, amenities. |
| SEA-03 | Sort options | Relevance, distance, rating, price (low-high). |
| SEA-04 | Auto-complete | Suggestions after 2 characters; includes businesses, services, neighborhoods. |
| SEA-05 | Recent searches | Store last 10 searches per user; de-duplicated. |

---

### 3.4 Map-based Search
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| MAP-01 | Interactive map | Google Maps or Mapbox integration. Clusters for dense areas. |
| MAP-02 | Location detection | Auto-center on user GPS with permission prompt. Fallback to IP geolocation. |
| MAP-03 | Map/list toggle | Seamless switch between map pins and list view; state synchronized. |
| MAP-04 | Business pin interaction | Tap pin → bottom sheet with name, rating, next available slot, photo. Tap sheet → full detail. |
| MAP-05 | Radius adjustment | Slider: 1km to 50km. Results update without full reload. |

---

### 3.5 Business Detail View
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BDV-01 | Header info | Business name, verified badge, average rating, review count, favorite toggle. |
| BDV-02 | Media gallery | Up to 20 images/videos. Swipeable carousel, pinch-to-zoom. |
| BDV-03 | Services list | Grouped by category. Each shows: name, duration, price, description. |
| BDV-04 | Staff selection | View staff profiles, select preferred provider or "Any available." |
| BDV-05 | Availability preview | "Next available: Today at 2:30 PM" or calendar mini-view. |
| BDV-06 | Business info | Address, hours, phone, website, amenities, COVID policies, parking info. |
| BDV-07 | Reviews summary | Star distribution, keyword tags ("clean," "professional"), paginated reviews. |

---

### 3.6 Service Categories
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| CAT-01 | Hierarchical categories | Root: Hair, Nails, Face, Body, Massage, Medical Aesthetic. 2-3 levels deep. |
| CAT-02 | Category metadata | Icon, color code, popular services badge, SEO slug. |
| CAT-03 | Dynamic discovery | Trending categories based on user location and seasonality. |
| CAT-04 | Business categorization | Business can belong to 1 primary + 2 secondary categories. |

---

### 3.7 Booking Flow
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BK-01 | Service selection | User selects one or more services. Multi-service booking supported. |
| BK-02 | Staff selection | Choose specific staff or "No preference." Staff-specific pricing if applicable. |
| BK-03 | Date/time selection | Calendar view with available slots. Gray = unavailable, green = available. Real-time slot computation (see 3.11). |
| BK-04 | Slot confirmation | Hold slot for 10 minutes during checkout (Redis lock). |
| BK-05 | Guest info | Option to add notes (allergies, preferences). |
| BK-06 | Payment | See 3.14. Support pay-in-app or pay-at-venue. |
| BK-07 | Booking confirmation | Instant confirmation screen with add-to-calendar, share, directions. |
| BK-08 | Cancellation policy | Displayed pre-booking. Varies by business (free, 24h, 48h). |

---

### 3.8 Appointment Management
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| APT-01 | Customer appointments list | Upcoming/past tabs. Sort: chronological. Shows: business, service, date/time, status. |
| APT-02 | Appointment detail | Full info, map, contact buttons, modify/cancel actions. |
| APT-03 | Reschedule | Select new slot if within business policy. Old slot released immediately. |
| APT-04 | Cancel | Refund per policy. Push + email notification sent. |
| APT-05 | Rebook | One-tap rebook same service/staff. |
| APT-06 | Business owner calendar | Day/week/month views. Color-coded by status (confirmed, pending, completed, no-show). |
| APT-07 | Owner actions | Confirm, decline, mark no-show, add notes, view customer history. |

---

### 3.9 Favorites
**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FAV-01 | Add/remove | Heart toggle on business card, detail, and map pin. Haptic feedback. |
| FAV-02 | Favorites list | Grid/list view. Sort: recently added, alphabetical, nearest. |
| FAV-03 | Availability alert | Notify when favorite business has open slots for preferred service. |
| FAV-04 | Quick rebook | From favorites, one-tap to book previously booked service. |

---

### 3.10 User Profile
**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PRF-01 | Profile info | Name, phone, email, photo, birthday (for birthday offers). |
| PRF-02 | Addresses | Multiple saved addresses (home, work). Default for map search. |
| PRF-03 | Payment methods | Saved cards (PCI-compliant tokenization). |
| PRF-04 | Preferences | Notification settings, default radius, preferred categories. |
| PRF-05 | Booking history | All past appointments with receipt access. |
| PRF-06 | Privacy | GDPR data export, account deletion with 30-day grace period. |

---

### 3.11 Availability & Slot Computation
**Priority:** P0 (Critical Infrastructure)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SLOT-01 | Business hours | Recurring weekly schedule + exceptions (holidays, closures). |
| SLOT-02 | Staff schedules | Each staff has independent availability and services offered. |
| SLOT-03 | Slot generation | Compute available slots = business hours ∩ staff availability − existing bookings − buffer time. |
| SLOT-04 | Service duration | Single or combo (e.g., haircut + color = 90 min). |
| SLOT-05 | Buffer time | Configurable pre/post buffers per service. |
| SLOT-06 | Real-time updates | Slot cache invalidated on new booking/cancellation. WebSocket push for active users. |
| SLOT-07 | Timezone handling | All stored in UTC; displayed in business timezone. |
| SLOT-08 | Performance | Slot query < 200ms for 30-day window. |

---

### 3.12 Shared Types & Design System
**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| DS-01 | Component library | Reusable: buttons, inputs, cards, modals, toasts, skeleton loaders. |
| DS-02 | Typography scale | 6 levels. Responsive for mobile/tablet/desktop. |
| DS-03 | Color system | Primary (brand), semantic (success, warning, error, info), neutrals. Dark mode support. |
| DS-04 | Spacing grid | 4px base unit. Consistent padding/margins. |
| DS-05 | Icons | Lucide or custom set. 24px default, 20px compact. |
| DS-06 | Accessibility | WCAG 2.1 AA minimum. Screen reader labels, focus states, 44px touch targets. |
| DS-07 | Shared types | TypeScript interfaces for all entities (User, Business, Service, Booking, etc.) in shared package. |

---

### 3.13 Reviews & Ratings
**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REV-01 | Post-review | Eligible 24 hours after appointment completion. Verified badge. |
| REV-02 | Rating dimensions | Overall + optional: service quality, cleanliness, value, atmosphere. |
| REV-03 | Review content | Text (500 char max), photos (up to 5). AI moderation for inappropriate content. |
| REV-04 | Owner response | Public reply within 30 days. Notification to reviewer. |
| REV-05 | Review display | Sort: most helpful, newest, highest/lowest rating. Helpful vote. |
| REV-06 | Abuse prevention | One review per appointment. Flag system for dispute. |

---

### 3.14 Payment Integration
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PAY-01 | Payment methods | Cards (Stripe), Apple Pay, Google Pay. BNPL (Klarna/Afterpay) optional. |
| PAY-02 | Pricing models | Fixed price, deposit-only, or free booking. Business-configurable. |
| PAY-03 | Hold and capture | Pre-authorize card; capture on service completion or auto-capture after 24h. |
| PAY-04 | Refunds | Full or partial via Stripe API. Refund policy enforced automatically. |
| PAY-05 | Receipts | PDF receipt emailed. In-app receipt history. |
| PAY-06 | Payouts | Stripe Connect for business owners. Weekly payouts, dashboard with pending/available balance. |
| PAY-07 | Tax | VAT/GST calculated by location. Invoice generation for B2B. |

---

### 3.15 Notifications
**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| NOT-01 | Channels | Push (OneSignal/Firebase), email (SendGrid), SMS (Twilio) for critical alerts. |
| NOT-02 | Trigger events | Booking confirmed, 24h reminder, modified, cancelled, completed, review prompt. |
| NOT-03 | Owner alerts | New booking, cancellation, low availability warning. |
| NOT-04 | Preferences | Granular opt-in/out per channel and event type. |
| NOT-05 | Deep linking | Notification tap routes to relevant screen. |
| NOT-06 | Batch digest | Daily/weekly summary option for non-urgent. |

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BOP-01 | Dashboard | Today's bookings, revenue this week, occupancy rate, upcoming week preview. |
| BOP-02 | Calendar management | Drag-drop to block time, set recurring availability, add time off. |
| BOP-03 | Service management | CRUD services-retail services with name, duration, price, description, staff assignment. |
| BOP-04 | Staff management | Add staff, set their services, hours, and permissions (view-only vs. full admin). |
| BOP-05 | Booking rules | Lead time (e.g., 2 hours ahead), cancellation window, max future booking (e.g., 60 days). |
| BOP-06 | Customer notes | View past appointments, preferences, allergies per customer. |
| BOP-07 | Analytics | Booking volume, revenue, no-show rate, popular services, peak hours. Export to CSV. |
| BOP-08 | Profile settings | Business info, photos, hours, policies, payment account (Stripe Connect onboarding). |

---

### 3.17 Admin Dashboard
**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| ADM-01 | User management | Search, view, suspend/activate users. Impersonation for support. |
| ADM-02 | Business onboarding | Review and approve new business registrations. KYC document verification. |
| ADM-03 | Content moderation | Review flagged reviews, business photos. Bulk actions. |
| ADM-04 | Dispute handling | View payment disputes, issue refunds, communicate with parties. |
| ADM-05 | Platform analytics | MAU, bookings, GMV, churn, top categories/geographies. Real-time dashboard. |
| ADM-06 | Promotions | Create coupon codes, featured business slots, push campaign composer. |
| ADM-07 | System health | Monitor BullMQ queues, error rates, API latency. Alert thresholds. |

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P1 (Infrastructure)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| JOB-01 | Job types | Reminder emails/SMS (24h, 2h before), review prompts, payout processing, slot cache warm-up, analytics aggregation, data retention cleanup. |
| JOB-02 | Scheduling | Cron-based and event-triggered. Idempotent execution. |
| JOB-03 | Retry policy | Exponential backoff: 5s, 25s, 125s, then dead-letter. Max 5 attempts. |
| JOB-04 | Monitoring | Bull Board UI for queue depth, failed jobs, processing time. Alerts on queue > 1000. |
| JOB-05 | Concurrency | Configurable workers per queue. Priority queues: notifications > payments > analytics. |
| JOB-06 | Job deduplication | Unique job ID for idempotent operations (e.g., one reminder per appointment). |

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App cold start < 3s. API p95 < 200ms. Image lazy loading. |
| **Scalability** | Horizontal scaling via Kubernetes. Read replicas for analytics. |
| **Security** | OWASP Top 10 mitigation. Encrypt PII at rest. Rate limiting. |
| **Reliability** | 99.9% uptime. Database backups every 6 hours. |
| **Compliance** | GDPR, CCPA, PCI-DSS (Stripe handles SAQ-A). |

---

## 5. Prioritization Summary

| Priority | Features |
|----------|----------|
| **P0 — MVP** | Auth, Guest Browse, Search, Map, Business Detail, Service Categories, Booking Flow, Appointment Mgmt, Availability/Slots, Payments, Owner Portal |
| **P1 — Post-MVP** | Favorites, User Profile, Reviews, Notifications, Admin, Design System hardening, Background Jobs polish |
| **P2 — Growth** | BNPL, Loyalty program, Referrals, AI recommendations, Multi-language |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% |
| Search-to-booking time | < 5 minutes |
| Business owner activation | > 80% complete profile |
| Customer retention (30d) | > 40% |
| App store rating | > 4.5 stars |
| Support tickets per 1000 bookings | < 5 |

---

*Document version: 1.0*
*Last updated: 2024*
*Owner: Alex, Product Owner*