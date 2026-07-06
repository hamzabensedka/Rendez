# Planity Clone — Product Specification

## 1. Overview

Build a cross-platform mobile application (iOS/Android) and web dashboard that connects consumers with local service businesses (beauty, wellness, fitness, medical) for appointment booking. The platform serves three user types: **Consumers**, **Business Owners (Providers)**, and **Platform Admins**.

---

## 2. Target Users

| User Type | Description |
|-----------|-------------|
| Consumer | Discovers, books, and manages appointments |
| Business Owner | Manages business profile, services, availability, and appointments |
| Admin | Oversees platform health, disputes, and business onboarding |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 | **Owner:** Consumer, Business Owner, Admin

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| AUTH-1 | Email/password registration | User can register with email, password (min 8 chars, 1 uppercase, 1 number); email verification required |
| AUTH-2 | Social login (Google, Apple, Facebook) | OAuth 2.0 flow; account linking if email matches existing account |
| AUTH-3 | Phone number verification | SMS OTP via Twilio; required before first booking |
| AUTH-4 | JWT token management | Access token (15 min expiry), refresh token (7 days); secure storage in Keychain/Keystore |
| AUTH-5 | Password reset | Secure token link sent via email; expires in 1 hour |
| AUTH-6 | Biometric login (Face ID/Touch ID) | Optional opt-in; falls back to password |
| AUTH-7 | Role-based access control | Token contains role claim; middleware enforces route protection |
| AUTH-8 | Session management | Users can view and revoke active sessions from profile |

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Consumer (unauthenticated)

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| GUEST-1 | Browse without account | Home screen, search, and business listings accessible without login |
| GUEST-2 | View business details | Full business profile, services, and reviews visible |
| GUEST-3 | Prompt on booking attempt | Login/signup modal appears when guest attempts to book; post-auth redirect to booking flow |
| GUEST-4 | Guest-to-user conversion | Preserve guest session state (selected service, time) through registration |

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SEARCH-1 | Text search | Search by business name, service name, or keyword; debounced input (300ms); results in <500ms |
| SEARCH-2 | Autocomplete suggestions | Max 8 suggestions; includes recent searches (stored locally, max 10) |
| SEARCH-3 | Filter by: category, price range, rating, availability | Multi-select filters; "Available today" toggle |
| SEARCH-4 | Sort options | Relevance (default), distance, rating, price (low-high), availability |
| SEARCH-5 | Recent & trending searches | Displayed on empty state; trending updated daily via background job |
| SEARCH-6 | Search history | Persisted for 30 days; user can clear individual or all history |

---

### 3.4 Map-based Search
**Priority:** P0 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| MAP-1 | Interactive map view | Google Maps/Mapbox integration; default zoom to user location or city center |
| MAP-2 | Business markers | Cluster markers at zoom < 12; individual pins at zoom >= 12; color-coded by category |
| MAP-3 | Marker detail card | Tap marker shows bottom sheet with business name, rating, next available slot, and "Book" CTA |
| MAP-4 | List/map toggle | Persistent user preference; smooth transition between views |
| MAP-5 | Geolocation permission | Request on first use; graceful degradation to manual location input if denied |
| MAP-6 | Radius filter | Slider: 1km to 50km; updates results in real-time |

---

### 3.5 Business Detail View
**Priority:** P0 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BIZ-1 | Header: name, photos, rating, favorite toggle | Hero image carousel (max 10); pinch-to-zoom; video support |
| BIZ-2 | Info section | Address, phone, hours, website, social links; tap to call/open maps |
| BIZ-3 | Service menu | Grouped by category; each shows name, duration, description, price; expandable |
| BIZ-4 | Team/staff listing | Staff photos, names, specialties; tap to filter services by staff |
| BIZ-5 | Reviews summary | Average rating, total count, rating distribution histogram |
| BIZ-6 | Availability preview | "Next available: Today at 2:30 PM" or date of next opening |
| BIZ-7 | Share business | Native share sheet with deep link; QR code generation |

---

### 3.6 Service Categories
**Priority:** P0 | **Owner:** Platform

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CAT-1 | Hierarchical categories | 3-level depth: e.g., Beauty > Hair > Haircut; admin-managed via dashboard |
| CAT-2 | Category icons & colors | Consistent iconography; dark/light mode variants |
| CAT-3 | Popular services highlight | Algorithm: bookings + views; updated weekly |
| CAT-4 | Category landing pages | SEO-optimized web routes; featured businesses, trending services |

---

### 3.7 Booking Flow
**Priority:** P0 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BOOK-1 | Service selection | Single or multiple services; validate staff can perform all selected |
| BOOK-2 | Staff selection | "Any available" or specific staff; show staff calendar if specific |
| BOOK-3 | Date & time selection | Calendar view (7 days forward default, up to 60 days); time slots in 15-min increments |
| BOOK-4 | Slot availability | Real-time query against availability engine; show "filling fast" if < 3 slots |
| BOOK-5 | Guest booking option | Allow booking for another person; collect name and phone |
| BOOK-6 | Special requests | Free text, max 500 chars; visible to business in appointment details |
| BOOK-7 | Booking confirmation | Summary screen with all details; 10-min hold on slot during payment |
| BOOK-8 | Cancellation policy display | Show business policy before confirmation; full, partial, or no refund rules |

---

### 3.8 Appointment Management
**Priority:** P0 | **Owner:** Consumer, Business Owner

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| APPT-1 | Consumer: View appointments | List view (upcoming/past); detail view with all booking info; add to calendar |
| APPT-2 | Consumer: Reschedule | Available up to business policy cutoff; new slot must be validated; single tap to reschedule |
| APPT-3 | Consumer: Cancel | Policy-enforced; refund calculation displayed; confirmation required |
| APPT-4 | Consumer: Rebook | One-tap rebook same service/staff; pre-filled flow |
| APPT-5 | Business: Calendar view | Day/week/month views; color-coded by status; drag-and-drop rescheduling |
| APPT-6 | Business: Appointment actions | Confirm, decline, mark no-show, mark complete; notes field for each |
| APPT-7 | Business: Block time | Manual busy time creation; recurring block patterns |
| APPT-8 | Sync to external calendars | Google/Outlook two-way sync for business owners |

---

### 3.9 Favorites
**Priority:** P1 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| FAV-1 | Toggle favorite | Heart icon on business card and detail; haptic feedback; optimistic UI |
| FAV-2 | Favorites list | Grid/list view; quick book from list; sort by recently favorited or name |
| FAV-3 | Favorite notifications | Opt-in: "New availability at [Business]" or "[Business] has a promotion" |
| FAV-4 | Cross-device sync | Favorites tied to account; real-time sync |

---

### 3.10 User Profile
**Priority:** P1 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PROF-1 | Profile fields | Full name, phone, email, photo (optional), birthday (optional for promotions) |
| PROF-2 | Payment methods | Stripe customer; add, remove, set default card; PCI compliance |
| PROF-3 | Notification preferences | Push, email, SMS toggles per type: bookings, promotions, reminders |
| PROF-4 | Privacy settings | Profile visibility (public/private); data download request (GDPR) |
| PROF-5 | Appointment history | Complete history with receipts; filter by date range, business, status |

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Platform (Backend)

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SLOT-1 | Business hours definition | Weekly recurring schedule + exceptions (holidays, vacation) |
| SLOT-2 | Service duration mapping | Each service has base duration; staff may override |
| SLOT-3 | Buffer time | Configurable between appointments (0, 5, 10, 15, 30 min) |
| SLOT-4 | Concurrent bookings | Staff-based: one appointment at a time; Room-based: multiple if rooms available |
| SLOT-5 | Real-time slot computation | Query in <200ms; account for existing bookings, blocks, and business hours |
| SLOT-6 | Slot caching | Redis cache with 5-min TTL; invalidation on booking mutation |
| SLOT-7 | Timezone handling | All times stored in UTC; displayed in business timezone or user preference |

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Design/Engineering

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| DS-1 | Design tokens | Colors, typography, spacing, shadows as platform-agnostic tokens |
| DS-2 | Component library | Buttons, inputs, cards, modals, calendars, skeleton loaders; Storybook documentation |
| DS-3 | Shared TypeScript types | Monorepo shared package; auto-generated from API schema (OpenAPI/Zod) |
| DS-4 | Accessibility | WCAG 2.1 AA minimum; screen reader support; minimum touch target 44x44dp |
| DS-5 | Theming | Light/dark mode; brand color injection for business owner customization |
| DS-6 | Responsive breakpoints | Mobile first: 320px, 768px, 1024px, 1440px |

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| REV-1 | Post-booking review | Eligible 24 hours after appointment; reminder notification; max one per appointment |
| REV-2 | Rating dimensions | Overall (1-5 stars), plus optional: service quality, staff, ambiance, value |
| REV-3 | Review content | Text (max 1000 chars), photos (max 5); profanity filter |
| REV-4 | Business response | Owner can reply publicly; notification to reviewer |
| REV-5 | Review moderation | Auto-flag for profanity; admin queue for dispute resolution |
| REV-6 | Review helpfulness | Users can mark helpful; sort by helpful or recent |

---

### 3.14 Payment Integration
**Priority:** P0 | **Owner:** Consumer, Business Owner

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PAY-1 | Payment methods | Credit/debit cards (Stripe), Apple Pay, Google Pay; save for future use |
| PAY-2 | Pricing models | Fixed price, variable (consultation), deposit required, or free |
| PAY-3 | Hold and capture | Authorization at booking; capture on service completion or business policy |
| PAY-4 | Refunds | Automated per policy; manual override by admin; partial refund calculation |
| PAY-5 | Receipts | Auto-generated PDF; emailed and in-app; includes tax breakdown if applicable |
| PAY-6 | Payouts to businesses | Stripe Connect; weekly auto-payout; dashboard with pending/balance |
| PAY-7 | Platform fee | Configurable percentage per transaction; transparent to consumer at checkout |

---

### 3.15 Notifications
**Priority:** P1 | **Owner:** All users

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| NOTIF-1 | Push notifications | Firebase Cloud Messaging; rich notifications with images and actions |
| NOTIF-2 | Notification types | Booking confirmed, reminder (24h, 1h), modified, cancelled, promotional, review request |
| NOTIF-3 | Email notifications | SendGrid/Mailgun; HTML templates; fallback to text |
| NOTIF-4 | SMS notifications | Twilio; for critical: booking confirmations and reminders; opt-in for promos |
| NOTIF-5 | In-app notification center | Persistent bell icon; unread badge; mark all read; 90-day retention |
| NOTIF-6 | Quiet hours | Respect user timezone; batch non-urgent notifications |
| NOTIF-7 | Delivery tracking | Log all notification attempts; retry failed push via SMS fallback for critical |

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Business Owner

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PORT-1 | Business profile management | Edit all fields, upload photos, set hours, manage services and pricing |
| PORT-2 | Staff management | Add staff, set permissions, assign services, manage individual schedules |
| PORT-3 | Appointment dashboard | Daily/weekly view; accept/decline pending bookings; bulk actions |
| PORT-4 | Availability management | Set recurring schedule, add exceptions, define service-staff mappings |
| PORT-5 | Client management | View client history, notes, contact info; export to CSV |
| PORT-6 | Analytics dashboard | Bookings, revenue, cancellation rate, average booking value, peak hours; date range filter |
| PORT-7 | Promotions | Create discount codes: percentage or fixed amount, usage limits, expiration |
| PORT-8 | Multi-location support | Switch between locations; consolidated reporting option |

---

### 3.17 Admin Dashboard
**Priority:** P1 | **Owner:** Platform Admin

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| ADMIN-1 | Business onboarding | Review applications, approve/reject with reason, track onboarding funnel |
| ADMIN-2 | User management | Search, view, suspend/activate accounts; audit log of all admin actions |
| ADMIN-3 | Content moderation | Review flagged reviews, businesses, photos; bulk actions |
| ADMIN-4 | Financial overview | Gross volume, platform fees, refunds, payouts pending; daily/weekly/monthly |
| ADMIN-5 | Dispute resolution | View escalated issues, communicate with parties, issue refunds, override policies |
| ADMIN-6 | System health | Monitor job queues, error rates, API latency; alert thresholds |
| ADMIN-7 | Feature flags | Enable/disable features per business, region, or globally; percentage rollouts |

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 | **Owner:** Platform (Backend)

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| JOB-1 | Job queue architecture | BullMQ with Redis; separate queues by priority and type |
| JOB-2 | Scheduled jobs | Daily: trending recalculation, stale cart cleanup, payout preparation |
| JOB-3 | Notification jobs | Queue push/email/SMS; retry with exponential backoff; max 5 attempts |
| JOB-4 | Search index updates | Reindex on business/service mutation; batch updates every 5 min |
| JOB-5 | Image processing | Resize uploads to 5 variants; WebP conversion; background upload to S3/CloudFront |
| JOB-6 | Reporting jobs | Weekly business summary email; monthly analytics aggregation |
| JOB-7 | Job monitoring | Bull Board or equivalent UI; failed job inspection and manual retry |
| JOB-8 | Dead letter queue | After max retries; alert admin; manual reprocessing interface |

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App cold start < 2s; API p95 < 200ms; image load < 1s on 3G |
| Scalability | Horizontal scaling via containerization; handle 10x traffic spike |
| Security | OWASP Top 10 mitigation; annual penetration testing; SOC 2 roadmap |
| Compliance | GDPR (EU), CCPA (CA), PCI-DSS (payments) |
| Localization | i18n framework; initial: EN, FR, ES, DE; RTL support planned |
| Offline | View cached appointments and favorites; queue actions for sync |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 100K by month 12 |
| Booking conversion rate | > 15% from search to confirmed booking |
| App store rating | > 4.5 stars |
| Business NPS | > 50 |
| Customer support tickets | < 2% of transactions |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Guest Browse, Search, Map, Business Detail, Booking, Appointments, Provider Portal, Payments, Slots | Month 1-3 |
| v1.1 | Favorites, Reviews, Notifications, Profile enhancements | Month 4 |
| v1.2 | Admin Dashboard, Analytics, Promotions, Multi-location | Month 5 |
| v1.3 | Social features, Loyalty program, AI recommendations | Month 6 |

---

*Document version: 1.0 | Last updated: 2024 | Owner: Product Team*