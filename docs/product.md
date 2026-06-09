# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Platform:** Web (responsive), iOS, Android  
**Target Audience:** Consumers seeking beauty & wellness appointments; business owners managing bookings.  
**Goal:** Build a marketplace where users discover, book, and manage appointments with local beauty/wellness businesses, while providers manage their availability, services, and clientele.

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0  
**Description:** Secure identity management for customers and business owners.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| AUTH-001 | Email & password registration | User can register with email, password, first/last name; password min 8 chars with 1 uppercase, 1 number; verification email sent |
| AUTH-002 | Email & password login | JWT access + refresh tokens; rate-limited at 5 attempts/minute |
| AUTH-003 | OAuth 2.0 (Google, Apple) | One-tap login; account linking if email matches existing account |
| AUTH-004 | Password reset | Secure token via email; expires in 1 hour |
| AUTH-005 | Session management | Refresh token rotation; logout invalidates all sessions |
| AUTH-006 | Role-based access | `CUSTOMER`, `PROVIDER`, `ADMIN` roles enforced at API gateway |

---

### 2.2 Guest Browse & Explore
**Priority:** P0  
**Description:** Unauthenticated users can browse businesses without login friction.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| GUEST-001 | View business listings | Paginated list; 20 items per page; cached for 5 min |
| GUEST-002 | View business details | Read-only access to profile, services, reviews; "Book" CTA prompts login |
| GUEST-003 | Search & filter | Same search capabilities as authenticated users |
| GUEST-004 | Persistent guest cart | LocalStorage holds selected service + slot; prompts merge on login |

---

### 2.3 Business Search & Discovery
**Priority:** P0  
**Description:** Powerful search to find relevant businesses.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SEARCH-001 | Full-text search | Search by business name, service name, or description; typo-tolerant (fuzzy matching) |
| SEARCH-002 | Filter by category | Multi-select: Hair, Nails, Spa, Barber, Massage, etc. |
| SEARCH-003 | Filter by availability | "Available today", "Available this week", specific date |
| SEARCH-004 | Filter by price range | Min/max slider; reflects lowest service price per business |
| SEARCH-005 | Filter by rating | 4.0+, 4.5+ stars |
| SEARCH-006 | Sort options | Relevance, distance, rating, price (low/high) |
| SEARCH-007 | Search history | Store last 10 searches per user; clearable |

---

### 2.4 Map-based Search
**Priority:** P0  
**Description:** Visual discovery via interactive map.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| MAP-001 | Interactive map | Google Maps or Mapbox; cluster markers at zoom levels |
| MAP-002 | Geolocation | Request user location; default zoom to 5km radius; fallback to city center |
| MAP-003 | Business pins | Click pin → bottom sheet with name, rating, next availability, photo |
| MAP-004 | Radius filter | Slider: 1km to 50km; updates results in real-time |
| MAP-005 | List/map toggle | Persist user preference in session |

---

### 2.5 Business Detail View
**Priority:** P0  
**Description:** Comprehensive business profile to drive booking decisions.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BIZ-001 | Header gallery | Up to 10 images; carousel with pinch-zoom; video support (max 30s) |
| BIZ-002 | Business info | Name, verified badge, address, phone, website link, opening hours |
| BIZ-003 | Service menu | Grouped by category; each shows name, duration, description, price |
| BIZ-004 | Staff list | Photos, names, specialties; tap to see staff-specific availability |
| BIZ-005 | Reviews summary | Aggregate rating, total count, distribution histogram |
| BIZ-006 | Action buttons | "Book Now" (primary), "Call", "Share", "Add to Favorites" |
| BIZ-007 | Opening hours | Weekly schedule; highlight today's hours; show "Open Now" / "Closes at X" |

---

### 2.6 Service Categories
**Priority:** P0  
**Description:** Hierarchical categorization for discoverability and business organization.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| CAT-001 | Category hierarchy | Parent categories → subcategories (e.g., Hair → Coloring, Cutting, Styling) |
| CAT-002 | Category icons | Consistent iconography per category in design system |
| CAT-003 | Business assignment | Each service linked to ≥1 category; business linked to primary categories |
| CAT-004 | Category landing pages | SEO-friendly; show featured businesses, trending services |
| CAT-005 | Admin management | CRUD categories; reorder; assign icons; soft delete with migration |

---

### 2.7 Booking Flow
**Priority:** P0  
**Description:** Seamless, low-friction appointment reservation.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BOOK-001 | Service selection | Tap service from menu; show selected in persistent bottom bar |
| BOOK-002 | Staff selection | "Any available" or specific staff; show staff photo and rating |
| BOOK-003 | Date & time picker | Calendar view; load slots via API; show prices if variable; 15-min granularity |
| BOOK-004 | Slot selection | Visual grid; unavailable slots disabled; highlight selected |
| BOOK-005 | Guest info | Pre-fill for logged-in users; guest checkout requires name, phone, email |
| BOOK-006 | Add-ons & notes | Optional: add-on services, special requests (max 500 chars) |
| BOOK-007 | Payment selection | Saved methods, new card, or pay at venue (if enabled) |
| BOOK-008 | Booking confirmation | Atomic transaction; optimistic UI; success screen with calendar invite |
| BOOK-009 | Cancellation policy | Display at checkout; enforce rules (free until X hours before) |
| BOOK-010 | Rescheduling | Allow within policy; release old slot, hold new slot for 10 min |

---

### 2.8 Appointment Management
**Priority:** P0  
**Description:** Users track and manage their bookings.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| APPT-001 | Upcoming appointments | List view; sorted by date; show business, service, staff, time, status |
| APPT-002 | Appointment details | Full info; map to location; contact buttons; add to calendar |
| APPT-003 | Cancel appointment | Button triggers policy check; confirmation modal; instant refund if applicable |
| APPT-004 | Reschedule appointment | Navigate to slot picker with pre-selected service/staff |
| APPT-005 | Past appointments | History; quick rebook button; prompt review if unrated |
| APPT-006 | Status tracking | `PENDING` → `CONFIRMED` → `CHECKED_IN` → `COMPLETED` → `NO_SHOW` / `CANCELLED` |
| APPT-007 | Reminders | Push + SMS 24h and 1h before; configurable in settings |

---

### 2.9 Favorites
**Priority:** P1  
**Description:** Save preferred businesses for quick access.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FAV-001 | Add/remove favorite | Heart toggle on business card/detail; haptic feedback; optimistic UI |
| FAV-002 | Favorites list | Grid/list view; sort by recently added, name, or next availability |
| FAV-003 | Availability badge | Show "Available today" if true; update on pull-to-refresh |
| FAV-004 | Sync across devices | Persist to account; immediate sync |
| FAV-005 | Guest favorites | LocalStorage; prompt to create account to save on login |

---

### 2.10 User Profile
**Priority:** P1  
**Description:** Personal account management.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PROF-001 | Profile info | Edit name, phone, email (re-verify), profile photo (crop to square) |
| PROF-002 | Saved payment methods | List, set default, delete; PCI-compliant via Stripe |
| PROF-003 | Notification preferences | Toggle push, email, SMS per event type |
| PROF-004 | Privacy settings | Data download (GDPR), account deletion with 30-day grace period |
| PROF-005 | Referral code | Unique code; share sheet; track credits earned |
| PROF-006 | Loyalty program | Points per booking; tier benefits; visible progress |

---

### 2.11 Availability & Slot Computation
**Priority:** P0  
**Description:** Core engine for accurate, real-time availability.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SLOT-001 | Business hours | Weekly schedule with breaks; holiday overrides; timezone-aware |
| SLOT-002 | Staff schedules | Individual working hours; vacation blocking; recurring exceptions |
| SLOT-003 | Service duration | Base duration + buffer time; variable (e.g., 30-60 min for hair length) |
| SLOT-004 | Slot generation | Compute available slots from openings minus bookings; cache 1 hour |
| SLOT-005 | Concurrent bookings | Support multiple staff; prevent double-booking via DB constraints |
| SLOT-006 | Real-time updates | WebSocket push when slots change; polling fallback 30s |
| SLOT-007 | Buffer rules | Pre/post buffers (e.g., 15 min cleaning); configurable per service |
| SLOT-008 | Waitlist | Notify when preferred slot opens; auto-book if enabled |

---

### 2.12 Shared Types & Design System
**Priority:** P0  
**Description:** Consistent UI/UX across platforms.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| DS-001 | Component library | Buttons, inputs, cards, modals, date picker, skeleton loaders |
| DS-002 | Color palette | Primary (#6C5CE7), secondary, semantic colors (success, error, warning) |
| DS-003 | Typography | Inter font family; scale: display, H1-H4, body, caption |
| DS-004 | Spacing system | 4px base grid; consistent padding/margin tokens |
| DS-005 | Shared types | TypeScript interfaces for all entities; Zod schemas for validation |
| DS-006 | Accessibility | WCAG 2.1 AA; minimum 44px touch targets; screen reader labels |
| DS-007 | Dark mode | System-aware toggle; persistent preference |
| DS-008 | Animation | 200ms standard transitions; reduce motion respects OS setting |

---

### 2.13 Reviews & Ratings
**Priority:** P1  
**Description:** Social proof and quality feedback loop.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REV-001 | Post-review eligibility | Only after completed appointment; 14-day window; one per appointment |
| REV-002 | Rating breakdown | Overall 1-5 stars; optional sub-ratings: Service, Ambiance, Staff |
| REV-003 | Review content | Text (10-1000 chars); optional photo upload (max 5) |
| REV-004 | Business response | Owner can reply once; shown threaded |
| REV-005 | Review moderation | Auto-flag profanity; admin queue for reported reviews |
| REV-006 | Helpful votes | Users can mark helpful; sort reviews by helpfulness |
| REV-007 | Aggregate display | Average rating, total count, rating distribution on business page |

---

### 2.14 Payment Integration
**Priority:** P0  
**Description:** Secure, flexible payment processing.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PAY-001 | Payment methods | Credit/debit cards (Stripe); Apple Pay; Google Pay; PayPal |
| PAY-002 | Payment intents | Create, confirm, capture; 3D Secure support |
| PAY-003 | Save payment method | Tokenize for future use; default payment selection |
| PAY-004 | Refunds | Full and partial refunds; processed within 5-10 business days |
| PAY-005 | Pay at venue | Option if business enables; no pre-auth required |
| PAY-006 | Receipts | Email receipt; in-app invoice download (PDF) |
| PAY-007 | Failed payment handling | Retry logic; notify user; preserve booking for 15 min |
| PAY-008 | Provider payouts | Stripe Connect; weekly payouts; dashboard visibility |

---

### 2.15 Notifications
**Priority:** P1  
**Description:** Multi-channel user engagement.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| NOTIF-001 | Push notifications | Firebase Cloud Messaging; permission prompt after 2nd app open |
| NOTIF-002 | Email notifications | SendGrid; transactional templates; deliverability >95% |
| NOTIF-003 | SMS notifications | Twilio; booking confirmations and reminders only |
| NOTIF-004 | In-app inbox | Persistent notification center; unread badge; mark as read |
| NOTIF-005 | Trigger events | Booking confirmed, reminder, cancelled, promotional (opt-in), review request |
| NOTIF-006 | Preference management | Granular opt-in per channel and event type |
| NOTIF-007 | Delivery tracking | Log all sends; retry failed pushes; deduplicate across channels |

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0  
**Description:** Self-service tools for business management.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PROV-001 | Business profile setup | Onboarding wizard: business info, photos, hours, services, staff |
| PROV-002 | Service management | CRUD services; set duration, price, description, category, buffer time |
| PROV-003 | Staff management | Add staff with email invite; set permissions, schedule, services |
| PROV-004 | Availability calendar | Visual weekly view; drag to block; recurring patterns |
| PROV-005 | Appointment calendar | Day/week views; color-coded by status; click to view details |
| PROV-006 | Booking actions | Confirm, reschedule, cancel with reason; notify customer automatically |
| PROV-007 | Customer notes | Add private notes per customer; visible on future bookings |
| PROV-008 | Analytics dashboard | Bookings, revenue, no-show rate, top services; date range filter |
| PROV-009 | Review management | View, respond to, report reviews |
| PROV-010 | Payout settings | Connect Stripe account; view balance, payout history |

---

### 2.17 Admin Dashboard
**Priority:** P1  
**Description:** Platform oversight and operations.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| ADMIN-001 | User management | Search, view, suspend users; impersonate for support |
| ADMIN-002 | Business verification | Approve/reject new businesses; verify documents; badge management |
| ADMIN-003 | Content moderation | Review flagged reviews, photos; remove or restore |
| ADMIN-004 | Category management | Full CRUD; reorder; assign icons |
| ADMIN-005 | Financial overview | Platform revenue, refunds, payouts; filter by date, business |
| ADMIN-006 | Dispute handling | View escalated issues; refund or mediate; audit log |
| ADMIN-007 | System health | Queue monitoring, error rates, API latency; alert thresholds |
| ADMIN-008 | Promotions | Create discount codes; percentage or fixed; usage limits; expiry |

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P0  
**Description:** Reliable asynchronous processing.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| JOB-001 | Job queue setup | BullMQ with Redis; separate queues by priority |
| JOB-002 | Email sending | Queue transactional emails; retry 3x with exponential backoff |
| JOB-003 | Push notifications | Batch send; respect rate limits; log delivery |
| JOB-004 | SMS sending | Queue via Twilio; retry failed; log costs |
| JOB-005 | Payment webhooks | Idempotent processing; verify signatures; update booking status |
| JOB-006 | Slot cache warming | Pre-compute popular business slots; invalidate on change |
| JOB-007 | Nightly reports | Aggregate analytics; email to business owners |
| JOB-008 | Data exports | GDPR exports; zip and email link (expires 7 days) |
| JOB-009 | Cleanup jobs | Purge old logs, soft-deleted records, expired tokens (weekly) |
| JOB-010 | Dead letter queue | Failed jobs after max retries; manual retry UI in admin |

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | API p95 < 200ms; page load < 2s; map render < 1s |
| Scalability | Horizontal scaling via Kubernetes; auto-scale on CPU > 70% |
| Security | OWASP Top 10 mitigation; encrypt at rest (AES-256) and in transit (TLS 1.3) |
| Compliance | GDPR, CCPA, PCI-DSS Level 1 (via Stripe) |
| Reliability | 99.9% uptime SLA; automated backups every 6 hours |
| Monitoring | Datadog / Grafana; PagerDuty alerts on critical errors |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 10,000 by month 6 |
| Booking conversion rate | >15% from search to confirmed booking |
| App store rating | >4.5 stars |
| Customer support tickets | <2% of total bookings |
| Provider NPS | >50 |
| Payment success rate | >98% |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Guest Browse, Search, Map, Business Detail, Booking, Appointments, Provider Portal (basic), Payments, Slots | Month 1-2 |
| V1 | Favorites, Reviews, Notifications, Profile, Admin Dashboard | Month 3 |
| V2 | Loyalty, Referrals, Promotions, Analytics, Background Jobs optimization | Month 4 |

---

*Document version: 1.0*  
*Last updated: 2024*  
*Owner: Alex, Product Owner*
