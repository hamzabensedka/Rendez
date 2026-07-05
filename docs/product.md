# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with beauty, wellness, and service professionals for appointment booking. The product serves three user segments: **Customers** (book appointments), **Providers/Business Owners** (manage availability and bookings), and **Admin** (platform oversight).

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---|---|---|
| **Customer** | Seeks beauty/wellness services, values convenience | Discover, book, manage appointments |
| **Guest** | Unregistered browser, exploring options | Browse without commitment |
| **Provider** | Salon owner/independent professional | Manage schedule, grow business |
| **Admin** | Platform operator | Monitor, support, optimize |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 | **Owner:** Platform Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| AUTH-001 | Email/password registration | User can create account with email, password (min 8 chars, 1 uppercase, 1 number); receives verification email; account created in `unverified` state |
| AUTH-002 | Email verification | Clicking verification link activates account; link expires in 24h; resend option available |
| AUTH-003 | Login | Valid credentials return JWT access + refresh tokens; invalid credentials return generic error after 5 attempts lock for 30 min |
| AUTH-004 | Social login (Google, Apple) | OAuth 2.0 flow; creates account if new, links to existing if email matches; same JWT response |
| AUTH-005 | Password reset | "Forgot password" sends secure token link; reset form enforces same complexity rules |
| AUTH-006 | Token refresh | Silent refresh using refresh token; access token TTL 15 min, refresh token 7 days |
| AUTH-007 | Logout | Invalidates refresh token on server; clears client storage |
| AUTH-008 | Phone number verification (optional) | SMS OTP for enhanced security; required for provider accounts |

**Non-functional:** Rate limit 5 login attempts per minute per IP.

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Growth Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| GUEST-001 | Unrestricted category browsing | Guest can view all business listings, categories, and basic details without authentication |
| GUEST-002 | Search functionality | Guest can search by keyword, location, category; same search experience as authenticated user |
| GUEST-003 | Business detail preview | Guest sees business info, services, reviews, but "Book" CTA prompts login |
| GUEST-004 | Persistent guest session | Device-level session preserves filters/search for 7 days |
| GUEST-005 | Conversion prompt | After 3 business views or 30 seconds on booking CTA, show gentle login/signup modal |

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Growth Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| SEARCH-001 | Full-text search | Search across business name, service name, description; typo tolerance (fuzzy matching); results in <200ms |
| SEARCH-002 | Filter by category | Multi-select categories: Hair, Nails, Spa, Barber, Wellness, Medical Aesthetic, etc. |
| SEARCH-003 | Filter by availability | "Available today/this week" filters to businesses with open slots matching criteria |
| SEARCH-004 | Filter by price range | Slider min/max; applies to selected service category |
| SEARCH-005 | Filter by rating | Minimum rating selector (1-5 stars) |
| SEARCH-006 | Filter by distance | Radius selector: 1km, 3km, 5km, 10km, 20km; uses user's location or manual address input |
| SEARCH-007 | Sort options | Relevance (default), rating, distance, price (low-high), most reviewed |
| SEARCH-008 | Search history | Authenticated users see last 10 searches; can clear history |
| SEARCH-009 | Popular searches | Show trending searches if no input after 2 seconds |

---

### 3.4 Map-based Search
**Priority:** P0 | **Owner:** Growth Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| MAP-001 | Interactive map view | Toggle between list and map views; map shows business pins with rating and price indicator |
| MAP-002 | Clustering | Pins cluster at zoom levels >50 in viewport; tap cluster zooms to bounds |
| MAP-003 | Current location | Button centers map on user GPS location; handles permission denial gracefully |
| MAP-004 | Business preview on tap | Tap pin shows bottom sheet with name, rating, photo, next available slot, "View" CTA |
| MAP-005 | Area search | Pan/zoom map triggers new search within visible bounds; debounced 500ms |
| MAP-006 | Directions | "Get directions" opens native maps app with business address pre-filled |

---

### 3.5 Business Detail View
**Priority:** P0 | **Owner:** Growth Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| BIZ-001 | Header section | Business name, verified badge, favorite toggle, average rating (x.y format), review count, distance |
| BIZ-002 | Photo gallery | Horizontal scrollable gallery; tap to full-screen carousel; max 10 images; lazy loaded |
| BIZ-003 | Business info | Address (tap to map), phone (tap to call), website link, hours (today highlighted), description |
| BIZ-004 | Service menu | Grouped by category; each service shows name, duration, price, description; tap to expand |
| BIZ-005 | Team/professional list | View available professionals; filter services by who performs them |
| BIZ-006 | Availability quick view | "Next available: [Date] at [Time]" with CTA to full booking |
| BIZ-007 | Reviews summary | Aggregate rating breakdown (5-1 star distribution); sortable reviews |
| BIZ-008 | Similar businesses | Carousel of 5 related businesses in area |
| BIZ-009 | Share business | Native share sheet with deep link to business page |

---

### 3.6 Service Categories
**Priority:** P0 | **Owner:** Platform Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| CAT-001 | Hierarchical categories | Top-level: Hair, Nails, Face, Body, Massage, Medical Aesthetic, Barber, Wellness. Sub-categories up to 2 levels deep |
| CAT-002 | Category icons | Consistent iconography per category; dark mode compatible |
| CAT-003 | Category landing pages | SEO-friendly pages for each category with featured businesses |
| CAT-004 | Service definition | Each service has: name, description, duration (min), base price, category reference, business reference |
| CAT-005 | Variant pricing | Services support variants (e.g., Short, Medium, Long hair) with different prices/durations |
| CAT-006 | Add-on services | Services can define add-ons (e.g., deep conditioning) with additional price/duration |

---

### 3.7 Booking Flow
**Priority:** P0 | **Owner:** Core Experience Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| BOOK-001 | Service selection | User selects service from business menu; sees price, duration, description; can add variants/add-ons |
| BOOK-002 | Professional selection | "Any available" or specific professional; filters slot availability |
| BOOK-003 | Date/time selection | Calendar view showing available dates (green dot indicator); time slots for selected date; slots respect business hours and buffer rules |
| BOOK-004 | Slot computation | Real-time slot calculation based on service duration, professional availability, existing bookings, and buffer time; cached for 30 seconds |
| BOOK-005 | Guest information | Logged-in user: pre-fill name, phone; can edit. Guest: required fields for name, phone, email |
| BOOK-006 | Special requests | Optional 250-character text field for notes to provider |
| BOOK-007 | Booking confirmation | Summary page with all details; "Confirm booking" action; success screen with booking reference (8-char alphanumeric) |
| BOOK-008 | Booking conflict handling | If slot taken during confirmation, show next 3 available alternatives; auto-reserve slot for 10 minutes during flow |
| BOOK-009 | Cancellation policy display | Show business cancellation policy before confirmation |
| BOOK-010 | Guest checkout | Guest can complete booking without account; prompted to create account post-booking for management features |

---

### 3.8 Appointment Management
**Priority:** P0 | **Owner:** Core Experience Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| APPT-001 | Upcoming appointments list | Chronological list; shows business, service, date/time, status (confirmed, completed, cancelled, no-show) |
| APPT-002 | Appointment detail | Full details: reference, QR code for check-in, directions, contact business, add to calendar |
| APPT-003 | Reschedule | User can reschedule if >[business cancellation hours] before appointment; new slot selection flow |
| APPT-004 | Cancel | Cancel with reason selection (optional); immediate confirmation; refund per policy |
| APPT-005 | Rebook | One-tap rebook same service with same business; goes to slot selection |
| APPT-006 | Appointment history | Completed/cancelled appointments; searchable by business name/date |
| APPT-007 | No-show handling | Marked no-show after 15 min past start time; may impact future booking ability per business policy |

---

### 3.9 Favorites
**Priority:** P1 | **Owner:** Growth Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FAV-001 | Add/remove favorite | Heart toggle on business card/detail; haptic feedback; syncs immediately |
| FAV-002 | Favorites list | Grid/list view of saved businesses; shows next availability if any |
| FAV-003 | Favorites sync | Persisted to account; available cross-device |
| FAV-004 | Favorite notifications | Option to get notified of new availability or promotions from favorites |

---

### 3.10 User Profile
**Priority:** P1 | **Owner:** Platform Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| PROF competency | Profile info | Display name, email, phone, profile photo, date of birth (optional) |
| PROF-002 | Edit profile | Update all fields; photo upload with crop/resize (max 5MB, JPG/PNG) |
| PROF-003 | Notification preferences | Toggle: push, email, SMS; per type: bookings, promotions, favorites activity |
| PROF-004 | Payment methods | View, add, remove cards; Stripe payment method management |
| PROF-005 | Addresses | Saved addresses for search convenience; home/work labels |
| PROF-006 | Privacy settings | Data download request, account deletion (GDPR/CCPA compliant) |
| PROF-007 | Referral code | Unique code generation; share for credits; track referrals |

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Platform Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| SLOT-001 | Business hours definition | Weekly recurring schedule + exception dates (holidays, closures) |
| SLOT-002 | Professional availability | Override business hours per professional; vacation/blackout dates |
| SLOT-003 | Service duration mapping | Each service maps to duration; slot computation uses this |
| SLOT-004 | Buffer time | Configurable before/after buffer per service or globally |
| SLOT-005 | Concurrent booking limit | Max simultaneous bookings per professional (default 1) |
| SLOT-006 | Slot generation algorithm | Generate slots from [business open + buffer] to [business close - service duration - buffer]; respect all constraints |
| SLOT-007 | Real-time availability | Slot query checks against confirmed bookings in real-time; cache invalidation on booking state change |
| SLOT-008 | Timezone handling | All times stored in UTC; displayed in business timezone or user preference |

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Design System Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| DS-001 | Design tokens | Colors (primary #FF6B6B, secondary, semantic), typography (Inter family, 6 sizes), spacing (4px grid), radii, shadows |
| DS-002 | Component library | Buttons, inputs, cards, modals, bottom sheets, loaders, empty states, error states |
| DS-003 | Cross-platform parity | iOS and Android share 95%+ component code; platform-specific patterns where required (e.g., date pickers) |
| DS-004 | Accessibility | Minimum 4.5:1 contrast, screen reader labels, focus indicators, dynamic text sizing support |
| DS-005 | Dark mode | Full theme variant; respects system setting; manual override in settings |
| DS-006 | Shared types | TypeScript definitions shared between frontend, backend, and API contracts; single source of truth |
| DS-007 | Animation standards | 200ms default transitions; spring physics for interactive elements; reduce motion respect |

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Growth Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REV-001 | Eligibility to review | User can review only completed appointments they've attended |
| REV-002 | Rating input | 1-5 star selection; half-stars not permitted |
| REV-003 | Review text | Optional 10-1000 characters; profanity filter applied |
| REV-004 | Photo reviews | Up to 5 images; moderation queue for content review |
| REV-005 | Business response | Business owner can respond once; shown publicly |
| REV-006 | Review display | Average rating, total count, recent reviews with pagination |
| REV-007 | Review helpfulness | Users can mark reviews helpful; sort by helpfulness or recency |
| REV-008 | Report review | Users can report inappropriate reviews; admin moderation workflow |
| REV-009 | Review reminders | Push/email 24h after completed appointment to prompt review |

---

### 3.14 Payment Integration
**Priority:** P0 | **Owner:** Platform Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| PAY-001 | Payment methods | Credit/debit cards via Stripe; Apple Pay; Google Pay |
| PAY-002 | Payment timing options | Pay in full at booking, pay at appointment, or deposit + balance |
| PAY-003 | Cancellation refund | Full refund if cancelled within policy; partial or no refund if late; automated via Stripe |
| PAY-004 | Payment confirmation | Immediate confirmation on success; failure shows specific error with retry |
| PAY-005 | Receipts | Email receipt; in-app receipt view; downloadable PDF |
| PAY-006 | Saved payment methods | Securely stored via Stripe; can set default; require CVV for new device |
| PAY-007 | Provider payout | Weekly automated payout to provider bank account; dashboard shows pending/balance |
| PAY-008 | Platform fee | Configurable percentage deducted from each transaction; transparent to provider |

---

### 3.15 Notifications
**Priority:** P1 | **Owner:** Platform Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| NOTIF-001 | Push notifications | Booking confirmations, reminders (24h, 2h before), cancellations, promotions |
| NOTIF-002 | Email notifications | Same events as push + monthly summary, marketing (opt-in) |
| NOTIF-003 | SMS notifications | Critical: booking confirmation, same-day reminders, urgent changes |
| NOTIF-004 | In-app notifications | Notification bell with unread count; history of all notifications |
| NOTIF-005 | Preference management | Granular control per channel and event type |
| NOTIF-006 | Deep linking | Tapping notification navigates to relevant screen (booking detail, etc.) |
| NOTIF-007 | Quiet hours | Respect 10pm-8am local time; queue non-urgent notifications |

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Provider Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| PROV-001 | Business profile management | Edit business info, hours, photos, description, services, team members |
| PROV-002 | Service management | CRUD services with variants, pricing, duration, description; toggle active/inactive |
| PROV-003 | Team management | Add professionals with email invite; set individual schedules and service permissions |
| PROV-004 | Availability calendar | Weekly view of all bookings; color-coded by status; drag to block time |
| PROV-005 | Booking management | View all bookings; accept/decline (if approval required), reschedule, mark no-show/completed |
| PROV-006 | Customer notes | Add internal notes to customer profiles; viewable to all team members |
| PROV-007 | Revenue dashboard | Period selector; gross revenue, net after fees, payout status, transaction list |
| PROV-008 | Review management | View and respond to reviews; analytics on rating trends |
| PROV-009 | Settings | Business hours, cancellation policy, booking lead time, notification preferences |
| PROV-010 | Mobile-responsive web | Full functionality on mobile browser for on-the-go management |

---

### 3.17 Admin Dashboard
**Priority:** P1 | **Owner:** Platform Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| ADMIN-001 | User management | Search, view, suspend users; view user activity log |
| ADMIN-002 | Business onboarding | Approve new business applications; verify documents; manage business status |
| ADMIN-003 | Content moderation | Review flagged reviews, photos, businesses; take action (remove, warn, ban) |
| ADMIN-004 | Financial overview | Platform GMV, revenue, fees collected; payout status tracking |
| ADMIN-005 | Analytics | DAU/MAU, booking conversion funnel, top categories, churn metrics |
| ADMIN-006 | Support tools | Impersonate user view, refund processing, manual booking adjustment |
| ADMIN-007 | System health | Queue monitoring, error rates, API latency, third-party service status |
| ADMIN-008 | Configuration | Feature flags, category management, global settings, fee structure |

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 | **Owner:** Platform Team

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| JOB-001 | Job queue setup | BullMQ with Redis; separate queues by priority and type |
| JOB-002 | Notification jobs | Queue push/email/SMS with retry (3x, exponential backoff); dead letter queue after failure |
| JOB-003 | Reminder jobs | Schedule 24h and 2h appointment reminders; handle timezone correctly; idempotent |
| JOB-004 | Payment jobs | Process payouts weekly; retry failed payments; notify admin of persistent failures |
| JOB-005 | Analytics jobs | Nightly aggregation of metrics; data warehouse sync |
| JOB-006 | Cleanup jobs | Archive old notifications (>90 days), soft-delete expired temp data |
| JOB-007 | Image processing | Async resize/optimize on upload; generate thumbnails; update CDN |
| JOB-008 | Job monitoring | Dashboard showing queue depths, processing rates, failures, retry counts; alert on backlog |
| JOB-009 | Job idempotency | All jobs use idempotency keys; safe to retry without side effects |

---

## 4. Non-Functional Requirements

| Area | Requirement |
|---|---|
| **Performance** | App cold Meetings cold start <2s; API p95 <200ms; search <100ms |
| **Reliability** | 99.9% uptime; graceful degradation when services unavailable |
| **Security** | OWASP Top 10 mitigation; encryption at rest and in transit; PCI-DSS for payments |
| **Scalability** | Auto-scaling based on load; handle 10x traffic spikes |
| **Compliance** | GDPR, CCPA, LGPD data handling; cookie consent; terms acceptance |

---

## 5. Release Phases

| Phase | Features | Target |
|---|---|---|
| **MVP** | Auth, Guest browse, Search, Map, Business detail, Booking, Appointments, Provider basic portal, Payments, Slots | Month 2 |
| **V1.0** | Favorites, Profile, Reviews, Notifications, Admin basic, Background jobs | Month 4 |
| **V1.5** | Advanced provider features, Analytics, Referral, Loyalty | Month 6 |

---

## 6. Success Metrics

| Metric | Target |
|---|---|
| Booking conversion rate | >15% search-to-book |
| Guest-to-signed-up rate | >30% |
| Provider NPS | >50 |
| App store rating | >4.5 stars |
| Customer support tickets | <2% of bookings |

---

*Document version: 1.0 | Last updated: [Date] | Owner: Alex, Product Owner*