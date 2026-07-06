# Planity Clone — Product Specification

## 1. Overview

Build a cross-platform mobile application (iOS/Android) and responsive web app that connects consumers with local beauty, wellness, and health service providers, enabling discovery, booking, and appointment management.

---

## 2. User Personas

| Persona | Description | Primary Needs |
|---------|-------------|---------------|
| **Consumer** | Books appointments for personal services | Discover, compare, book, manage appointments |
| **Provider/Business Owner** | Manages salon, clinic, or freelance practice | Calendar management, client handling, business visibility |
| **Admin** | Platform operator | User management, content moderation, analytics |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 | **Owner:** Consumer, Provider, Admin

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| AUTH-01 | Email/password registration | User can register with email, password, first/last name, phone number; validate email format, password ≥8 chars with uppercase, number, special char; send verification email |
| AUTH-02 | Email verification | User must verify email before booking; resend option available; token expires in 24h |
| AUTH-03 | Login | JWT-based session; access token (15min), refresh token (7 days); rate limit: 5 attempts/minute |
| AUTH-04 | Password reset | "Forgot password" flow with secure token via email; token expires in 1h |
| AUTH-05 | Social login | Google and Apple Sign-In; merge accounts if email matches existing verified account |
| AUTH-06 | Phone verification (optional) | SMS OTP for additional security; required for providers |
| AUTH-07 | Role-based access | Consumer, Provider, Admin roles with distinct permissions; middleware enforces route protection |
| AUTH-08 | Session management | View active sessions, revoke from any device; biometric login option on mobile |
| AUTH-09 | Account deletion | GDPR-compliant full deletion; 30-day grace period with recovery option |

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| GUEST-01 | Browse without account | View businesses, services, prices, ratings without login; prompt to register at booking initiation |
| GUEST-02 | Location-based defaults | Detect location via IP/ GPS with fallback to manual city selection; store in session |
| GUEST-03 | Limited favorites | Prompt login to save favorites; show count of items requiring login |
| GUEST-04 | Conversion prompts | Strategic CTA placement: after 3 business views, at booking attempt, on favorite action |

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SEARCH-01 | Text search | Search by business name, service name, or keyword; autocomplete with debounce (300ms); typo tolerance (fuzzy matching) |
| SEARCH-02 | Filter system | Category, price range, rating (≥ stars), availability (today, this week), distance radius, amenities (parking, WiFi, accessibility) |
| SEARCH-03 | Sort options | Relevance (default), distance, rating (highest first), price (lowest first), most reviewed |
| SEARCH-04 | Search history | Store last 20 searches per user; allow clear individual or all history |
| SEARCH-05 | Trending searches | Show popular searches in area; update daily via background job |
| SEARCH-06 | Result cards | Display: cover image, business name, rating (avg + count), starting price, distance, next available slot, "Book" CTA |
| SEARCH-07 | Pagination | Infinite scroll, 20 results per page; skeleton loading states |
| SEARCH-08 | Empty states | Contextual messaging with suggestions to adjust filters |

---

### 3.4 Map-based Search
**Priority:** P0 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| MAP-01 | Interactive map | Toggle between list and map views; default to list on mobile, split on tablet/desktop |
| MAP-02 | Clustering | Cluster markers at zoom levels; expand on tap; max 50 markers rendered |
| MAP-03 | Business pins | Color-coded by category; show price range on pin; tap opens bottom sheet with summary |
| MAP-04 | Current location | Center on user location with accuracy indicator; handle permission denial gracefully |
| MAP-05 | Boundary search | Update results on map pan/zoom with debounce (500ms); show "Search this area" button after movement |
| MAP-06 | Directions | Deep-link to native maps app (Google/Apple Maps) with pre-filled destination |

---

### 3.5 Business Detail View
**Priority:** P0 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BIZ-01 | Header gallery | Up to 10 images/videos; swipeable carousel; pinch-to-zoom; lazy loading |
| BIZ-02 | Core info | Business name, verified badge, category, rating, review count, address with copy option, hours (today's + full weekly) |
| BIZ-03 | Service menu | Grouped by category; expandable items show: description, duration, price, practitioner if applicable |
| BIZ-04 | Team section | Practitioner photos, names, specialties, average rating; filter services by practitioner |
| BIZ-05 | Availability quick view | Next 3 available slots per service; "See full calendar" link |
| BIZ-06 | Action buttons | Call (mask number, track), Message (in-app chat), Share (deep link), Save to favorites |
| BIZ-07 | Business story | Free-text description, founding date, languages spoken, payment methods accepted |
| BIZ-08 | Policies | Cancellation policy (flexible/moderate/strict), late arrival policy, COVID protocols |
| BIZ-09 | Similar businesses | "You may also like" carousel based on category and location |

---

### 3.6 Service Categories
**Priority:** P0 | **Owner:** Platform

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CAT-01 | Hierarchical categories | 3-level hierarchy: Domain (Beauty) → Category (Hair) → Subcategory (Haircut, Coloring, Styling) |
| CAT-02 | Category icons | Consistent iconography per category; support dark/light mode |
| CAT-03 | Category landing pages | SEO-optimized pages with featured businesses, trending services, price guides |
| CAT-04 | Dynamic categories | Admin can add/edit/disable categories; changes reflect in 5 minutes via cache invalidation |
| CAT-05 | Category suggestions | ML-based category suggestions based on business description during onboarding |

---

### 3.7 Booking Flow
**Priority:** P0 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BOOK-01 | Service selection | Select one or multiple services; validate no conflicting services; show total duration and price |
| BOOK-02 | Practitioner selection | "Any available" or specific practitioner; show practitioner-specific pricing if different |
| BOOK-03 | Date/time selection | Calendar view with available dates highlighted; time slots in 15-min increments; timezone handling |
| BOOK-04 | Slot persistence | Hold selected slot for 10 minutes; release if payment not initiated; show countdown timer |
| BOOK-05 | Guest checkout | Allow booking without account; collect: name, email, phone; auto-create account post-booking |
| BOOK-06 | Add-ons and notes | Upsell add-on services; special requests field (500 char limit); allergy/intolerance notes |
| BOOK-07 | Booking summary | Review all details before confirmation; editable inline; total cost breakdown with taxes |
| BOOK-08 | Confirmation | Immediate on-screen confirmation; email + push notification; add to calendar option (ICS) |
| BOOK-09 | Booking restrictions | Prevent double-booking; enforce cancellation policy; block booking within X hours of appointment based on business rules |

---

### 3.8 Appointment Management
**Priority:** P0 | **Owner:** Consumer, Provider

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| APT-01 | Consumer dashboard | Upcoming/past tabs; sort by date; show: business, service, date/time, status, actions |
| APT-02 | Status states | Pending, Confirmed, Checked-in, In-progress, Completed, Cancelled, No-show, Rescheduled |
| APT-03 | Reschedule | Consumer can reschedule per business policy; within 24h may require approval; notify provider immediately |
| APT-04 | Cancel | Apply cancellation policy; auto-refund if within free cancellation window; charge if applicable |
| APT-05 | Rebook | One-tap rebook same service with same provider; pre-fill preferences |
| APT-06 | Provider calendar | Day/week/month views; drag-and-drop reschedule; color-coded by status |
| APT-07 | Check-in | QR code or manual check-in; timestamp recorded; trigger post-appointment review request |
| APT-08 | Block time | Provider can block personal time; mark reason (break, vacation, training) |
| APT-09 | Waitlist | Option to join waitlist for full slots; auto-notify and auto-book if slot opens (with consent) |

---

### 3.9 Favorites
**Priority:** P1 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| FAV-01 | Save businesses | Heart toggle on business card and detail; immediate feedback; sync across devices |
| FAV-02 | Save services | Save specific services for quick rebooking; show price changes since save |
| FAV-03 | Favorites list | Grid/list view; sort by recently saved, name, or next availability; quick book from list |
| FAV-04 | Availability alerts | Opt-in to get notified when favorite business has new availability in next 7 days |
| FAV-05 | Suggestions | "Because you liked X" recommendations based on favorites |

---

### 3.10 User Profile
**Priority:** P1 | **Owner:** Consumer, Provider

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PROF-01 | Personal info | Editable: name, email, phone, photo, date of birth, gender (optional for personalization) |
| PROF-02 | Preferences | Default notification settings, preferred language, accessibility needs |
| PROF-03 | Payment methods | Save multiple cards via PCI-compliant tokenization (Stripe); default payment method |
| PROF-04 | Addresses | Multiple saved addresses; default for search; home/work labels |
| PROF-05 | Appointment history | Complete history with receipts; download invoice PDF; filter by date range |
| PROF-06 | Loyalty status | Points balance, tier status, progress to next tier, expiration dates |
| PROF-07 | Privacy settings | Control data sharing, marketing opt-outs, download data export (GDPR) |

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Platform, Provider

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SLOT-01 | Business hours | Set weekly recurring hours; exception dates (holidays, closures); timezone per business |
| SLOT-02 | Service duration | Define base duration; buffer time between appointments (configurable) |
| SLOT-03 | Practitioner schedules | Individual schedules that may differ from business hours; vacation blocking |
| SLOT-04 | Real-time computation | Generate available slots considering: business hours, existing bookings, practitioner availability, service duration, buffer time, concurrent booking limits |
| SLOT-05 | Slot caching | Cache computed slots for 30 seconds; invalidate on booking/cancellation |
| SLOT-06 | Complex rules | Support: split shifts, lunch breaks, variable service durations, package deals (multiple services sequenced) |
| SLOT-07 | Overbooking control | Configurable overbooking limit (e.g., 110% capacity); visual warning to provider |
| SLOT-08 | Slot API | Sub-200ms response for slot query; support date range queries up to 90 days |

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Platform

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| DS-01 | Component library | Reusable components: buttons, inputs, cards, modals, toasts, skeletons, empty states |
| DS-02 | Typography | 6-level scale; responsive; WCAG AA contrast minimum; system fonts with fallbacks |
| DS-03 | Color system | Primary, secondary, semantic (success/warning/error/info), neutrals; dark mode support |
| DS-04 | Spacing | 4px base grid; consistent spacing tokens (xs: 4, sm: 8, md: 16, lg: 24, xl: 32, 2xl: 48) |
| DS-05 | Shared types | TypeScript definitions for: User, Business, Service, Appointment, Slot, Review, Payment; strict null checks |
| DS-06 | Form validation | Zod schemas shared frontend/backend; real-time validation with debounce |
| DS-07 | Accessibility | WCAG 2.1 AA compliance; screen reader support; focus management; reduced motion respect |
| DS-08 | Animations | Consistent timing (200ms standard, 300ms complex); ease curves defined; performance-optimized |

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| REV-01 | Eligibility | Only verified customers who completed appointment can review; 14-day window post-appointment |
| REV-02 | Rating dimensions | Overall (1-5 stars), plus optional: service quality, staff, ambiance, value for money |
| REV-03 | Review content | Text (10-2000 chars), photos (up to 5); AI moderation for inappropriate content |
| REV-04 | Provider response | Public reply to any review; notification to reviewer; mark as resolved option |
| REV-05 | Review display | Sort by: most relevant, newest, highest/lowest rating; filter by rating, with photos, verified only |
| REV-06 | Review helpfulness | Mark as helpful; sort by helpfulness; report inappropriate reviews |
| REV-07 | Review analytics | Provider dashboard: average rating trend, sentiment analysis, common themes |
| REV-08 | Dispute handling | Flag mechanism for reviews; admin review queue; temporary hide during dispute |

---

### 3.14 Payment Integration
**Priority:** P0 | **Owner:** Consumer, Provider

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PAY-01 | Payment methods | Credit/debit cards (Stripe), Apple Pay, Google Pay, PayPal; save for future use |
| PAY-02 | Pricing models | Full payment, deposit (fixed or %), pay-at-venue; configurable per business/service |
| PAY-03 | Split payments | Support gift cards, promo codes, loyalty points combination |
| PAY-04 | Refunds | Automated per cancellation policy; manual refund option for providers; refund timeline communication |
| PAY-05 | Payouts | Provider payouts to connected Stripe account; weekly auto-payout or manual request; payout dashboard |
| PAY-06 | Receipts | Itemized email receipt; in-app receipt history; download PDF |
| PAY-07 | Failed payment | Retry logic (3 attempts); notify user; hold slot for 15 min during retry |
| PAY-08 | Tax handling | Configurable tax rates per jurisdiction; display inclusive/exclusive as per locale |
| PAY-09 | PCI compliance | Never store raw card data; use Stripe Elements; annual compliance audit |

---

### 3.15 Notifications
**Priority:** P1 | **Owner:** Consumer, Provider

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| NOT-01 | Channels | Push (mobile), email, SMS; user preference per channel per notification type |
| NOT-02 | Notification types | Booking confirmation, reminder (24h, 1h before), cancellation, reschedule, promotion, review request, waitlist availability |
| NOT-03 | Preferences | Granular opt-in/opt-out per type; respect quiet hours (configurable, default 22:00-08:00) |
| NOT-04 | Delivery reliability | At-least-once delivery; deduplication; delivery tracking; retry with exponential backoff |
| NOT-05 | Rich push | Deep link to relevant screen; action buttons (confirm, reschedule, cancel from notification) |
| NOT-06 | Inbox | In-app notification center; unread badge; mark as read; archive |
| NOT-07 | Provider alerts | New booking, cancellation, low inventory, review posted, payout completed |

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Provider

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| POR-01 | Onboarding wizard | Step-by-step: business info, location, services, team, hours, photos, bank account for payouts |
| POR-02 | Dashboard overview | Today's appointments, revenue this week, new reviews, occupancy rate, quick actions |
| POR-03 | Calendar management | Full CRUD on appointments; bulk operations; print view; staff schedule view |
| POR-04 | Service management | CRUD services; set pricing variants (by practitioner, time); pause services without deletion |
| POR-05 | Team management | Add staff members, set permissions (view only, manage own, manage all), assign services |
| POR-06 | Client database | View client history, notes (private), contact info; export with consent; marketing opt-in status |
| POR-07 | Analytics | Revenue trends, booking conversion, no-show rate, popular services, peak hours; date range filter; CSV export |
| POR-08 | Settings | Business hours, cancellation policy, booking lead time, auto-confirm rules, notification preferences |
| POR-09 | Multi-location | Switch between locations; consolidated reporting available; location-specific permissions |
| POR-10 | Mobile app | Core calendar and client management on mobile; iOS and Android parity |

---

### 3.17 Admin Dashboard
**Priority:** P1 | **Owner:** Admin

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| ADM-01 | User management | Search, filter, suspend/activate users; view activity log; impersonate for support (with audit trail) |
| ADM-02 | Business verification | Review submitted businesses; approve/reject with reason; verify documents; track verification status |
| ADM-03 | Content moderation | Review queue for flagged reviews, business descriptions, images; bulk actions; appeal handling |
| ADM-04 | Financial oversight | Transaction monitoring, dispute resolution, refund approval for edge cases, payout tracking |
| ADM-05 | Analytics platform | MAU, booking volume, GMV, conversion funnel, churn rate, top categories/geographies; real-time and historical |
| ADM-06 | System health | Monitor background jobs, API latency, error rates; alert thresholds; incident response links |
| ADM-07 | Promotions | Create and manage promo codes, referral programs, featured business placements |
| ADM-08 | Audit logging | Immutable log of all admin actions; filterable by admin, action type, date, affected entity |

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 | **Owner:** Platform

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| JOB-01 | Job types | Scheduled (cron), delayed, repeatable, and on-demand jobs with clear categorization |
| JOB-02 | Reminder system | Cron at 09:00 local time: send 24h reminders for next-day appointments; handle timezone correctly |
| JOB-03 | Slot cache warming | Pre-compute popular business slots every 5 minutes; invalidate on relevant changes |
| JOB-04 | Notification queue | Reliable delivery with retry (max 5 attempts, exponential backoff); dead letter queue for failures |
| JOB-05 | Payout processing | Weekly cron to calculate and initiate provider payouts; handle currency, tax withholding |
| JOB6 | Review solicitation | Delayed job 2 hours post-appointment; skip if already reviewed or cancelled |
| JOB-07 | Data exports | Async generation of large reports; notify on completion with download link (24h expiry) |
| JOB-08 | Analytics aggregation | Nightly jobs to compute denormalized metrics: trending searches, popular businesses, category performance |
| JOB-09 | Image processing | On upload: generate thumbnails (multiple sizes), compress, scan for inappropriate content |
| JOB-10 | Monitoring | BullMQ Dashboard access; job success/failure metrics; alert on queue depth > threshold |
| JOB-11 | Job idempotency | All jobs implement idempotency keys; safe to retry without side effects |
| JOB-12 | Graceful shutdown | On deploy/restart: finish active jobs, don't accept new ones, then exit |

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App launch < 3s; API response p95 < 200ms; image load < 1s |
| **Reliability** | 99.9% uptime; graceful degradation; circuit breakers for external services |
| **Security** | OWASP Top 10 mitigation; encryption in transit (TLS 1.3) and at rest (AES-256); annual penetration testing |
| **Scalability** | Horizontal scaling; stateless services; CDN for static assets |
| **Compliance** | GDPR, CCPA, PCI-DSS; data residency options; right to erasure |
| **Localization** | i18n framework; initial languages: EN, FR, DE, ES, IT; RTL support planned |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | Growth 15% MoM |
| Booking Conversion Rate | > 8% of app opens |
| Search-to-Book Latency | < 2 minutes average |
| Provider Activation | > 70% complete onboarding |
| NPS Score | > 50 |
| App Store Rating | > 4.5 stars |
| Customer Support Tickets | < 2% of transactions |

---

## 6. Prioritization Summary

| Priority | Features |
|----------|----------|
| **P0 (Must Have)** | User Authentication, Guest Browse, Business Search, Map Search, Business Detail, Booking Flow, Appointment Management, Availability/Slots, Payment, Provider Portal, Background Jobs, Shared Types |
| **P1 (Should Have)** | Favorites, User Profile, Reviews, Notifications, Admin Dashboard |
| **P2 (Could Have)** | Loyalty Program, In-app Chat, Group Bookings, Subscription Packages |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Author: Alex, Product Owner*