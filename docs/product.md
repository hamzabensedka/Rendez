# Planity Clone — Product Specification

## 1. Overview

Build a cross-platform mobile application (iOS/Android) and responsive web app that connects consumers with local beauty/wellness businesses for appointment booking. Two-sided marketplace: consumer-facing app + business owner portal + admin dashboard.

---

## 2. Features & Acceptance Criteria

### 2.1 User Authentication
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| AUTH-001 | Email/password registration | User can register with email, password (min 8 chars, 1 uppercase, 1 number). Verification email sent. |
| AUTH-002 | Social login (Google, Apple) | OAuth 2.0 flow; account auto-created or linked to existing email. |
| AUTH-003 | Login | JWT access + refresh token; session persists 30 days. |
| AUTH-004 | Password reset | Secure token via email; expires in 1 hour. |
| AUTH-005 | Phone verification (optional) | SMS OTP for enhanced trust; required for booking. |
| AUTH-006 | Account deletion | GDPR-compliant; 30-day soft delete, then hard delete. |
| AUTH-007 | Biometric login | Face ID / fingerprint on supported devices. |

---

### 2.2 Guest Browse & Explore
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| GUEST-001 | Browse without account | View businesses, services, reviews; search and filter functional. |
| GUEST-002 | Booking prompt | At checkout, redirect to login/register with pre-filled context. |
| GUEST-003 | Session preservation | Guest cart/session persists 7 days or until cleared. |

---

### 2.3 Business Search & Discovery
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SEARCH-001 | Text search | Search by business name, service name, or keyword. Results ranked by relevance, distance, rating. |
| SEARCH-002 | Autocomplete | <200ms response; max 10 suggestions. |
| SEARCH-003 | Filters | Category, price range, rating (4.0+), distance (1-50km), availability (today, this week), gender (if applicable). |
| SEARCH-004 | Sort options | Relevance, distance, rating, price (low-high). |
| SEARCH-005 | Recent searches | Store last 10; clearable. |
| SEARCH-006 | Search history sync | Persist across devices for logged-in users. |

---

### 2.4 Map-based Search
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| MAP-001 | Interactive map | Google Maps / Mapbox; default to user location or city center. |
| MAP-002 | Business markers | Clustering at zoom < 12; individual pins at closer zoom. |
| MAP-003 | Marker info window | Business name, rating, price indicator, next available slot. |
| MAP-004 | List/map toggle | Seamless switch; preserve filters and viewport. |
| MAP-005 | Boundary search | Search within visible map area; update results on pan/zoom (debounced 300ms). |
| MAP-006 | Directions | Deep-link to native GSM/Apple Maps for navigation. |

---

### 2.5 Business Detail View
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BIZ-001 | Hero section | Business name, photos (carousel, max 10), rating, review count, favorite toggle. |
| BIZ-002 | Contact & location | Address, phone, website; one-tap call, open maps. |
| BIZ-003 | Opening hours | Weekly schedule; highlight today's hours; show "Open Now" / "Closes at X". |
| BIZ-004 | Services list | Grouped by category; expandable; show duration, price, description. |
| BIZ-005 | Team members | Photos, names, specialties; filter services by provider. |
| BIZ-006 | Photo gallery | Full-screen viewer; pinch-to-zoom. |
| BIZ-007 | Share business | Native share sheet with deep link. |
| BIZ-008 | Report business | Flag for inappropriate content; logged to admin queue. |

---

### 2.6 Service Categories
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| CAT-001 | Hierarchical categories | 2-level: e.g., Hair > Cut, Color, Treatment. |
| CAT-002 | Category browsing | Icon grid; trending categories first. |
| CAT-003 | Category landing pages | SEO-friendly; list top businesses, average prices. |
| CAT-004 | Dynamic categorization | Admin-configurable; businesses can select multiple categories. |

---

### 2.7 Booking Flow
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BOOK-001 | Service selection | Tap service → select variant if applicable (e.g., short/medium/long hair). |
| BOOK-002 | Provider selection | "Any available" or choose specific staff member. |
| BOOK-003 | Date/time picker | Calendar view; load slots via API; show morning/afternoon/evening groupings. |
| BOOK-004 | Slot confirmation | Hold slot for 5 minutes (distributed lock); show countdown. |
| BOOK-005 | Add-ons | Upsell related services or products during flow. |
| BOOK-006 | Guest info capture | Name, phone, email; optional notes for business. |
| BOOK-007 | Cancellation policy | Display before payment; link to full policy. |
| BOOK-008 | Booking confirmation | Immediate in-app confirmation; email + push summary. |
| BOOK-009 | Guest checkout | Allow booking without account; prompt to register post-booking. |

---

### 2.8 Appointment Management
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| APT-001 | Upcoming appointments | List view; sort by date; show business, service, time, status. |
| APT-002 | Appointment detail | Full info; directions, contact, reschedule/cancel buttons. |
| APT-003 | Reschedule | Select new slot; release old slot atomically; re-apply hold. |
| APT-004 | Cancel | User can cancel per business policy; refund rules displayed. |
| APT-005 | Rebook | One-tap rebook same service/provider. |
| APT-006 | Appointment history | Past appointments; option to review. |
| APT-007 | Calendar sync | Export to Apple/Google Calendar (ICS or native API). |
| APT-008 | No-show handling | Business can mark no-show; affects future booking restrictions. |

---

### 2.9 Favorites
**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FAV-001 | Save/unsave | Heart toggle on business card and detail; haptic feedback. |
| FAV-002 | Favorites list | Grid/list view; sort by recently added, name. |
| FAV-003 | Availability quick view | Show next available slot without entering detail. |
| FAV-004 | Sync | Cross-device for logged-in users. |

---

### 2.10 User Profile
**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PROF-001 | Personal info | Name, email, phone, profile photo; editable. |
| PROF-002 | Preferences | Notification settings, default search radius, preferred language. |
| PROF-003 | Payment methods | Stripe/PayPal saved cards; PCI-compliant tokenization. |
| PROF-004 | Addresses | Home/work addresses for distance calculation. |
| PROF-005 | Loyalty/Points | If applicable: display balance, history, redemption. |
| PROF-006 | Privacy settings | Marketing opt-in, data download, account deletion. |

---

### 2.11 Availability & Slot Computation
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SLOT-001 | Business hours | Configurable weekly schedule; exceptions for holidays. |
| SLOT-002 | Service duration | Each service has base duration; buffer time between appointments. |
| SLOT-003 | Provider schedules | Individual working hours; overrides per day. |
| SLOT-004 | Slot generation | Generate in real-time or cache 15-min increments; respect duration. |
| SLOT-005 | Concurrent booking prevention | Pessimistic locking or atomic reservation; no double-booking. |
| SLOT-006 | Buffer time | Configurable pre/post buffers per service or globally. |
| SLOT-007 | Blocked times | Business/provider can block slots manually. |
| SLOT-008 | Timezone handling | All slots stored in UTC; displayed in business timezone. |
| SLOT-009 | Performance | Slot query < 200ms for 30-day range. |

---

### 2.12 Shared Types & Design System
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| DS-001 | Component library | Reusable: buttons, inputs, cards, modals, bottom sheets, loaders. |
| DS-002 | Typography scale | 6-level scale; responsive; accessible (min 16px body). |
| DS-003 | Color system | Primary, secondary, semantic (success/warning/error), neutrals. Dark mode support. |
| DS-004 | Spacing system | 4px base grid; consistent margins, padding, gaps. |
| DS-005 | Shared types | TypeScript interfaces for all entities; shared between frontend and API contracts. |
| DS-006 | Accessibility | WCAG 2.1 AA; screen reader support; focus management; color contrast 4.5:1. |
| DS-007 | Animation | 200-300ms transitions; reduce motion respect. |
| DS-008 | Icons | Consistent set (e.g., Phosphor or Heroicons); semantic naming. |

---

### 2.13 Reviews & Ratings
**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REV-001 | Post-review | After completed appointment; reminder push/email 24h post. |
| REV-002 | Rating breakdown | 1-5 stars; optional text review (min 10 chars). |
| REV-003 | Categories | Cleanliness, service, value, atmosphere (optional). |
| REV-004 | Photo reviews | Up to 5 photos; moderation queue. |
| REV-005 | Business response | Owner can reply; marked as "Business owner". |
| REV-006 | Review display | Sort by newest, highest, lowest; filter by rating. |
| REV-007 | Abuse prevention | One review per appointment; flagging system. |
| REV-008 | Average calculation | Weighted average; update on new review. |

---

### 2.14 Payment Integration
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PAY-001 | Payment methods | Cards (Stripe), Apple Pay, Google Pay, PayPal. |
| PAY-002 | Payment flow | Client-side tokenization; server confirms with provider. |
| PAY-003 | Pricing | Display subtotal, taxes, fees, total; currency formatting. |
| PAY-004 | Hold vs capture | Option to authorize hold or immediate capture per business setting. |
| PAY-005 | Refunds | Full and partial; initiated by user (policy) or business; processed via Stripe. |
| PAY-006 | Receipts | Email receipt; in-app invoice view. |
| PAY-007 | Failed payment | Retry logic; notify user; release slot after 2 failures. |
| PAY-008 | Payouts | Stripe Connect for business payouts; dashboard for owner. |

---

### 2.15 Notifications
**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| NOTIF-001 | Push notifications | Booking confirmations, reminders (24h, 1h before), promotions. |
| NOTIF-002 | Email notifications | Transactional: booking, change, cancel, receipt. |
| NOTIF-003 | SMS | Optional for reminders; fallback for critical alerts. |
| NOTIF-004 | In-app inbox | Notification center; mark as read; deep links to relevant screens. |
| NOTIF-005 | Preference management | Granular toggles per channel and type. |
| NOTIF-006 | Delivery reliability | Retry failed pushes; idempotent processing. |

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PORT-001 | Dashboard | Daily/weekly overview; upcoming appointments; revenue summary. |
| PORT-002 | Calendar view | Day/week/month views; drag-to-reschedule; color-coded by status. |
| PORT-003 | Appointment actions | Confirm, reschedule, cancel, mark no-show; notify customer. |
| PORT-004 | Service management | CRUD services; set duration, price, description, category. |
| PORT-005 | Staff management | Add team members; set schedules, services, permissions. |
| PORT-006 | Business settings | Hours, holidays, booking policies, cancellation rules. |
| PORT-007 | Customer management | View customer history, notes, contact; export list. |
| PORT-008 | Revenue reports | Daily/monthly; filterable; export CSV/PDF. |
| PORT-009 | Reviews management | Respond to reviews; flag inappropriate. |
| PORT-010 | Availability rules | Set breaks, time off, recurring patterns. |

---

### 2.17 Admin Dashboard
**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| ADMIN-001 | Business onboarding | Review and approve new business applications. |
| ADMIN-002 | Business management | View, suspend, deactivate; edit commission rates. |
| ADMIN-003 | User management | Search users; view activity; suspend for ToS violations. |
| ADMIN-004 | Content moderation | Review flagged businesses, reviews, photos; take action. |
| ADMIN-005 | Analytics | MAU, bookings, GMV, churn; filterable by date, region, category. |
| ADMIN-006 | Financial controls | View transactions, handle disputes, process manual refunds. |
| ADMIN-007 | System health | Monitor job queues, error rates, API latency. |
| ADMIN-008 | Role-based access | Super admin, support agent, finance roles. |

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P1

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| JOB-001 | Job queue setup | Redis-backed BullMQ; separate queues by priority. |
| JOB-002 | Email sending | Queue transactional emails; retry 3x with backoff. |
| JOB-003 | Push notifications | Batch process; respect rate limits. |
| JOB-004 | SMS delivery | Async send; log delivery status. |
| JOB-005 | Slot hold expiration | Cron job every minute; release expired holds; notify waitlist if any. |
| JOB-006 | Reminder dispatch | Daily cron for 24h and 1h reminders; idempotent. |
| JOB-007 | Report generation | Weekly/monthly aggregated reports; email to admins. |
| JOB-008 | Data cleanup | Purge soft-deleted records after 30 days; archive old logs. |
| JOB-009 | Retry & DLQ | Failed jobs retry with exponential backoff; DLQ for manual review. |
| JOB-010 | Monitoring | Expose metrics for queue depth, processing time, failure rate. |

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App cold start < 2s; API response < 200ms (p95); image loading < 1s |
| Scalability | Support 10k concurrent users; horizontal scaling ready |
| Security | OWASP Mobile Top 10; encryption at rest and in transit; audit logging |
| Compliance | GDPR, CCPA, PCI-DSS (payments) |
| Reliability | 99.9% uptime; automated backups; disaster recovery plan |
| Localization | i18n framework; French, English initial; RTL-ready |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% |
| Search-to-book time | < 3 minutes |
| App store rating | > 4.5 stars |
| Business NPS | > 50 |
| Customer retention (30d) | > 40% |
| Payment success rate | > 98% |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Search, Business Detail, Booking, Appointments, Slot Computation, Payments, Owner Portal | 8 weeks |
| V1.1 | Map, Favorites, Reviews, Notifications, Guest Browse | +4 weeks |
| V1.2 | Admin Dashboard, Background Jobs, Analytics, Loyalty | +4 weeks |
| V2.0 | AI recommendations, Subscription plans, Marketplace | Q2+ |

---

*Document version: 1.0 | Last updated: 2024 | Owner: Alex, Product Owner*