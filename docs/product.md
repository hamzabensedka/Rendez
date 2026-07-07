# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first marketplace connecting consumers with local beauty, wellness, and service businesses for appointment booking. The platform serves three user types: **Consumers** (book appointments), **Providers/Business Owners** (manage business and appointments), and **Admins** (platform governance).

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Consumer** | Urban professional, 25-40, books beauty/wellness services | Find, compare, and book appointments quickly |
| **Guest** | Unregistered user exploring the platform | Browse businesses without commitment |
| **Provider** | Salon/barbershop/spa owner or manager | Manage schedule, services, and client base |
| **Admin** | Platform operator | Monitor health, resolve disputes, support growth |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 — Critical path for personalization and booking

**Description:** Secure, frictionless authentication supporting multiple entry points.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| AUTH-001 | Email/password registration with validation | Password: min 8 chars, 1 uppercase, 1 number, 1 special char. Email verification required before booking. |
| AUTH-002 | Email/password login with JWT | Access token 15min, refresh token 7 days. Proper error messages for invalid credentials. |
| AUTH-003 | OAuth 2.0 social login (Google, Apple) | One-tap registration. Profile data pre-filled. Account linking if email matches existing. |
| AUTH-004 | Password reset flow | Secure token via email (1-hour expiry). Rate-limited to 3 requests/hour. |
| AUTH-005 | Biometric login (iOS Face ID / Android Fingerprint) | Optional, enabled after first password login. Fallback to PIN available. |
| AUTH-006 | Session management | "Remember me" option (30 days). Force logout on security events. Active sessions list with revoke. |
| AUTH-007 | Account deletion (GDPR compliance) | Self-service deletion with 30-day grace period. Data anonymization option. |

**Technical Notes:** Use Firebase Auth or Auth0. Implement `X-Device-ID` tracking for security.

---

### 3.2 Guest Browse & Explore

肌理细腻，光泽自然，毛孔隐形，持妆12小时不暗沉。

**Priority:** P0 — Conversion funnel entry point

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| GUEST-001 | Browse without registration | Full search and filter access. No booking or favoriting until signup. |
| GUEST-002 | Persistent guest session | 30-day local storage of viewed items, search history, location preferences. |
| GUEST-003 | Conversion prompts | Contextual CTAs at booking attempt, favorite action, or third search. Non-intrusive, dismissible. |
| GUEST-004 | Seamless account creation | Pre-fill from guest data. Preserve cart/session on signup. |

---

### 3.3 Business Search & Discovery

**Priority:** P0 — Core value proposition

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SEARCH-001 | Full-text search | Search by business name, service name, or provider name. Typo-tolerant (fuzzy matching). Results in <200ms. |
| SEARCH-002 | Smart suggestions | Autocomplete with recent searches, trending businesses, popular services. |
| SEARCH-003 | Advanced filters | Category, price range, rating (4.0+), availability ("open now", specific date/time), distance, amenities (parking, WiFi, accessibility). |
| SEARCH-004 | Sort options | Relevance (default), distance, rating, price (low-high), availability (soonest). |
| SEARCH-005 | Search history | Last 20 searches, deletable. Cross-device sync for logged-in users. |
| SEARCH-006 | Empty states | Helpful messaging with suggested alternatives when no results. |

---

### 3.4 Map-based Search

**Priority:** P0 — Geographic discovery primary mode

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| MAP-001 | Interactive map view | Default to user location. Cluster markers at zoomed-out levels. Single tap to expand cluster. |
| MAP-002 | Business pins | Color-coded by category. Tap shows preview card with name, rating, price indicator, next availability. |
| MAP-003 | List/map toggle | Persistent user preference. Smooth transition between views. |
| MAP-004 | Geolocation | Request permission on first use. Fallback to manual location entry. Show accuracy radius. |
| MAP-005 | Boundary search | Pan/zoom map updates results. "Search this area" button after manual map movement. |
| MAP-006 | Directions integration | Deep-link to Google Maps / Apple Maps / Waze for routing. |

---

### 3.5 Business Detail View

**Priority:** P0 — Conversion decision point

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BIZ-001 | Hero section | Business name, verified badge, primary category, average rating, review count, favorite toggle, share button. |
| BIZ-002 | Photo gallery | Up to 30 images. Full-screen carousel with pinch-zoom. Lazy loading. |
| BIZ-003 | Service menu | Categorized list with name, description, duration, price. Expandable details. |
| BIZ-004 | Availability preview | "Next available: Today 2:30 PM" or calendar mini-view. |
| BIZ-005 | Business info | Address (clickable), phone, hours (with live "Open now" status), website link, social links. |
| BIZ-006 | Staff/professionals | List of service providers with photos, specialties, ratings. |
| BIZ-007 | Amenities & policies | Icon grid for features. Cancellation policy prominently displayed. |
| BIZ-008 | Similar businesses | "You might also like" carousel based on category and location. |

---

### 3.6 Service Categories

**Priority:** P0 — Navigation and discovery structure

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CAT-001 | Hierarchical categories | 3-level depth: Category (Beauty) → Subcategory (Hair) → Service (Women's Cut). |
| CAT-002 | Category browsing | Visual grid with icons. Trending/promoted categories highlighted. |
| CAT-003 | Category landing pages | SEO-optimized with featured businesses, popular services, educational content. |
| CAT-004 | Business category assignment | Up to 3 primary categories per business. Accurate matching in search. |
| CAT-005 | Dynamic categories | Admin-managed with ability to add seasonal/promotional categories. |

**Categories (v1):** Hair, Nails, Face & Skin, Body & Massage, Brows & Lashes, Barbershop, Spa & Wellness, Medical Aesthetics, Fitness, Tattoos & Piercing.

---

### 3.7 Booking Flow

**Priority:** P0 — Revenue-critical path

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BOOK-001 | Service selection | Single or multiple services (package). Duration auto-calculated. |
| BOOK-002 | Provider selection | "Any available" or specific staff. Show provider availability. |
| BOOK-003 | Date/time selection | Calendar view with available slots highlighted. Timezone-aware. 15-min granularity. |
| BOOK-004 | Guest booking option | Allow booking for another person. Collect name and contact. |
| BOOK-005 | Special requests | Optional free-text field (150 chars max). Flagged to business. |
| BOOK-006 | Booking confirmation | Clear summary with all details. Add to calendar option. Cancellation policy restated. |
| BOOK-007 | Guest checkout | Book without account creation. Email confirmation required. Prompt account creation post-booking. |
| BOOK-008 | Booking modification | Reschedule or cancel per business policy. Time limits enforced (e.g., 24h before for free cancellation). |
| BOOK-009 | Waitlist | Option to join waitlist for fully booked preferred slots. Auto-notification on cancellation. |
| BOOK-010 | Group booking | Book multiple people for same service/time (up to 5). |

**Booking States:** Pending → Confirmed → Checked-in → Completed → No-show / Cancelled.

---

### 3.8 Appointment Management

**Priority:** P0 — Post-booking experience

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| APPT-001 | Upcoming appointments list | Chronological. Quick actions: reschedule, cancel, get directions, contact business. |
| APPT-002 | Appointment detail view | Full details, QR code for check-in, receipt access, rebook shortcut. |
| APPT-003 | Appointment history | Completed/cancelled appointments. Filterable. Rebook previous service in 2 taps. |
| APPT-004 | Check-in | QR scan or manual check-in. Location verification optional. |
| APPT-005 | Ratings prompt | Post-appointment rating request (24h after, push + email). |
| APPT-006 | Calendar sync | iCal/Google Calendar two-way sync option. |

---

### 3.9 Favorites

**Priority:** P1 — Engagement and retention

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| FAV-001 | Add/remove favorites | Heart toggle on business cards and detail. Haptic feedback. |
| FAV-002 | Favorites list | Grid/list view. Sort by recently added, name, or next availability. |
| FAV-003 | Availability alerts | Notify when favorite business has new availability in next 48h. Toggle per business. |
| FAV-004 | Collections (v2) | User-created lists ("Wedding prep", "Weekly self-care"). |

---

### 3.10 User Profile

**Priority:** P1 — Personalization and trust

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PROF-001 | Profile management | Name, email, phone, photo, birthday (for birthday offers). Editable. |
| PROF-002 | Preferences | Default booking preferences (reminder timing, preferred contact method). |
| PROF-003 | Payment methods | Save/manage cards (PCI-compliant tokenization). Default payment method. |
| PROF-004 | Addresses | Home, work, other. Default for search radius. |
| PROF-005 | Privacy settings | Profile visibility, data sharing preferences, marketing opt-in/out. |
| PROF-006 | Loyalty & rewards | Points balance, tier status, available rewards, transaction history. |

---

### 3.11 Availability & Slot Computation

**Priority:** P0 — Core platform algorithm

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SLOT-001 | Business hours definition | Weekly recurring schedule + exception dates (holidays, closures). Timezone-aware. |
| SLOT-002 | Service duration mapping | Fixed or variable durations. Buffer time between appointments (configurable). |
| SLOT-003 | Staff availability | Individual schedules, break times, time off. Override business hours if different. |
| SLOT-004 | Real-time slot computation | Account for existing bookings, staff assignments, service combinations. <100ms response. |
| SLOT-005 | Complex rules | Double-booking prevention, required equipment, room/station allocation (v2). |
| SLOT-006 | Slot release | Auto-release held slots after 10-minute cart abandonment. |
| SLOT-007 | Offline handling | Graceful degradation if business offline—show cached availability with warning. |

**Algorithm:** Pre-compute daily slots with staff-service matrix. Cache with Redis. Invalidate on booking events.

---

### 3.12 Shared Types & Design System

**Priority:** P0 — Engineering foundation

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| DS-001 | Design tokens | Colors, typography, spacing, shadows, radii as variables. Dark mode support. |
| DS-002 | Component library | Buttons, inputs, cards, modals, toasts, skeleton loaders, empty states. Storybook documentation. |
| DS-003 | Shared TypeScript types | Single source of truth for API contracts, shared between frontend and backend. |
| DS-004 | Responsive breakpoints | Mobile-first: 320px, 375px, 768px, 1024px, 1440px. |
| DS-005 | Accessibility | WCAG 2.1 AA minimum. Screen reader support, minimum touch targets (44x44dp), reduced motion respect. |
| DS-006 | Localization | i18n framework. EN, FR, DE, ES for v1. RTL preparation. |
| DS-007 | Iconography | Consistent icon set (Phosphor or similar). Semantic naming. |

---

### 3.13 Reviews & Ratings

**Priority:** P1 — Trust and discovery

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| REV-001 | Post-appointment review | Eligible 24h after appointment. Rating (1-5 stars) + text (optional, 10-500 chars) + photo upload (up to 5). |
| REV-002 | Review verification | "Verified visit" badge for completed bookings. Distinguish from unverified. |
| REV-003 | Business response | Owner can respond publicly. Notification to reviewer. |
| REV-004 | Review moderation | Auto-flag for profanity, spam, policy enforceable content. Admin escalation path. |
| REV-005 | Review helpfulness | Users can mark helpful. Sort by helpfulness or recency. |
| REV-006 | Review summary | Aggregate rating, distribution histogram, top keywords (sentiment analysis). |
| REV-007 | Dispute handling | Users can report reviews. Business can dispute with evidence. |

---

### 3.14 Payment Integration

**Priority:** P0 — Revenue collection

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PAY-001 | Payment methods | Credit/debit cards (Stripe), Apple Pay, Google Pay, PayPal (v2). |
| PAY-002 | Payment timing | Full upfront, deposit, or pay-at-venue (business-configurable). |
| PAY-003 | Secure processing | PCI-DSS compliant. Never store raw card data. Tokenization via Stripe. |
| PAY-004 | Receipts | Auto-generated PDF receipt. Email delivery. In-app access. |
| PAY-005 | Refunds | Automated per cancellation policy. Partial refunds supported. Admin override. |
| PAY-006 | Failed payment handling | Retry with saved method. Grace period (24h) before auto-cancellation. |
| PAY-007 | Provider payouts | Stripe Connect. Weekly payouts default. Instant payout option (fee). |
| PAY-008 | Platform fee | Configurable percentage + fixed fee. Transparent to consumer at checkout. |

---

### 3.15 Notifications

**Priority:** P1 — Engagement and operational efficiency

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| NOT-001 | Push notifications | Booking confirmations, reminders (24h, 2h before), promotions, waitlist availability. Rich actions (reschedule, cancel). |
| NOT-002 | SMS | Fallback for critical alerts. Opt-in for marketing. |
| NOT-003 | Email | Transactional (receipts, confirmations), digest (weekly deals), re-engagement (we miss you). |
| NOT-004 | In-app inbox | Persistent notification center. Unread badge. Categorized by type. |
| NOT-005 | Preference management | Granular controls per channel and type. Easy opt-out. |
| NOT-006 | Delivery reliability | Retry logic for failed deliveries. Delivery tracking. |

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0 — Supply-side critical path

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PORT-001 | Business profile management | Edit all public-facing info, photos, services, hours, policies. |
| PORT-002 | Service management | CRUD services. Set duration, price, description, category. Enable/disable. |
| PORT-003 | Staff management | Add team members with roles (admin, staff). Assign services and schedules. |
| PORT-004 | Calendar/schedule view | Day/week/month views. Drag-to-reschedule. Color-coded by status. |
| PORT-005 | Appointment actions | Confirm, reschedule, cancel, mark no-show, add notes. Bulk actions. |
| PORT-006 | Availability rules | Set recurring hours, breaks, time off. Block slots manually. |
| PORT-007 | Client management | Client database with history, notes, preferences, contact. GDPR-compliant. |
| PORT-008 | Analytics dashboard | Bookings, revenue, occupancy rate, cancellation rate, new vs. returning clients. Date range filter. |
| PORT-009 | Marketing tools | Promotions, package deals, loyalty program setup. |
| PORT-010 | Payout & financials | Earnings summary, payout history, tax documents (1099/KYC). |
| PORT-011 | Multi-location (v2) | Switch between locations. Consolidated reporting. |

---

### 3.17 Admin Dashboard

**Priority:** P1 — Platform operations

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| ADMIN-001 | User management | Search, view, suspend, delete accounts. Role management. |
| ADMIN-002 | Business onboarding | Verification workflow (documents, site review). Approve/reject with notes. |
| ADMIN-003 | Content moderation | Review queue for flagged content. Bulk actions. Audit log. |
| ADMIN-004 | Financial oversight | Transaction monitoring, refund approval, payout tracking, fee adjustment. |
| ADMIN-005 | Analytics | MAU, bookings, GMV, churn, revenue by category, top businesses, geographic heatmap. |
| ADMIN-006 | Support tools | Impersonate user, view booking history, issue credits, manage disputes. |
| ADMIN-007 | System health | Queue monitoring, error rates, API performance, third-party status. |
| ADMIN-008 | Config management | Feature flags, category management, promotion configuration, global settings. |

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P0 — System reliability

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| JOB-001 | Job queue architecture | BullMQ with Redis. Separate queues by priority and type. |
| JOB-002 | Email dispatch | Async send with retry (3x exponential backoff). Dead letter queue for failures. |
| JOB-003 | Push notification delivery | FCM/APNS batching. Per-device retry with device token refresh. |
| JOB-004 | Slot cache warming | Pre-compute daily slots at 00:00 timezone. Incremental updates on changes. |
| JOB-005 | Reminder scheduling | Schedule 24h and 2h reminders at booking time. Cron-less, job-scoped. |
| JOB-006 | Payment reconciliation | Nightly sync with Stripe. Flag discrepancies. |
| JOB-007 | Data exports | GDPR exports, analytics reports. Progress tracking, S3 delivery. |
| JOB-008 | Image processing | Upload → resize variants (thumb, standard, full) → CDN push. |
| JOB-009 | Job monitoring | Bull Board UI. Alert on queue depth > threshold, job failure rate > 1%. |
| JOB-010 | Graceful shutdown | Finish in-progress jobs, pause new intake, timeout protection. |

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App cold start <2s. API response <200ms (p95). Image load <1s. |
| **Scalability** | Support 10K concurrent users, 1M monthly bookings at launch. Horizontal scaling path. |
| **Security** | OWASP Top 10 mitigation. Encryption at rest and in transit. Regular penetration testing. |
| **Reliability** | 99.9% uptime SLA. Automated failover. Database backups (point-in-time recovery). |
| **Compliance** | GDPR, CCPA, PCI-DSS. SOC 2 Type II preparation. |

---

## 5. Success Metrics (KPIs)

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 50K by month 6 |
| Booking conversion rate | >15% search-to-book |
| Guest-to-signed-up conversion | >30% |
| Provider NPS | >50 |
| App store rating | >4.5 stars |
| Support ticket volume | <2% of transactions |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Map, Business Detail, Booking, Appointment Mgmt, Slot Computation, Payments, Provider Portal basics | Week 1-8 |
| **v1.0** | Favorites, Reviews, Notifications, User Profile, Admin Dashboard, Background Jobs | Week 9-12 |
| **v1.1** | Waitlist, Group Booking, Loyalty, Collections, Multi-location, Marketing Tools | Week 13-16 |

---

## 7. Open Questions & Risks

| Risk | Mitigation |
|------|------------|
| Provider acquisition | Launch with 50 pre-onboarded businesses in target city |
| Two-sided marketplace chicken-egg | Consumer waitlist, provider incentives, geographic concentration |
| Real-time slot accuracy | Optimistic locking, short hold periods, overbooking tolerance config |
| Chargebacks/fraud | Stripe Radar, manual review thresholds, provider verification |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex, Product Owner*