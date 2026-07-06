# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Build a cross-platform appointment booking marketplace connecting consumers with beauty, wellness, and service professionals. The platform enables seamless discovery, booking, and management of appointments while empowering business owners with tools to manage their operations.

### 1.2 Target Users
- **Consumers**: Individuals seeking to book beauty, wellness, and personal services
- **Business Owners**: Salons, barbershops, spas, clinics, and independent professionals
- **Platform Administrators**: Operations and support staff

### 1.3 Platform Scope
- Mobile applications (iOS/Android) for consumers
- Web-based portal for business owners
- Web-based admin dashboard
- Shared backend services and background job processing

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority**: P0 — Critical Path

#### Description
Secure, frictionless authentication supporting multiple login methods with robust account security.

#### User Stories
- As a new user, I want to create an account quickly so I can start booking appointments
- As a returning user, I want to log in seamlessly so I can access my bookings
- As a security-conscious user, I want password recovery options so I can regain access

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| AUTH-001 | Email/password registration with validation | P0 |
| AUTH-002 | Social login (Google, Apple, Facebook) | P0 |
| AUTH-003 | Phone number verification (OTP via SMS) | P0 |
| AUTH-004 | JWT-based session management with refresh tokens | P0 |
| AUTH-005 | Password reset via email | P0 |
| AUTH-006 | Biometric authentication (Face ID/Touch ID) | P1 |
| AUTH-007 | Account deletion (GDPR compliance) | P1 |
| AUTH-008 | Multi-factor authentication | P2 |

#### Acceptance Criteria
- [ ] User can register with email, password, and phone number in under 60 seconds
- [ ] Password must be minimum 8 characters with 1 uppercase, 1 lowercase, 1 number
- [ ] Social login creates account or links to existing account based on email match
- [ ] JWT access token expires in 15 minutes; refresh token valid for 7 days
- [ ] Biometric prompt appears after 3 successful password logins (opt-in)
- [ ] Account deletion initiates 30-day grace period with data export option
- [ ] Rate limiting: 5 failed login attempts triggers 15-minute lockout

---

### 2.2 Guest Browse & Explore
**Priority**: P0 — Critical Path

#### Description
Allow unauthenticated users to browse businesses and services, reducing friction for new user acquisition.

#### User Stories
- As a guest, I want to browse nearby salons so I can evaluate the platform before committing
- As a guest, I want to view business details and pricing so I can make informed decisions

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| GUEST-001 | Browse business listings without account | P0 |
| GUEST-002 | View business profiles, services, and reviews | P0 |
| GUEST-003 | Search by location, category, and keyword | P0 |
| GUEST-004 | View real-time availability (read-only) | P0 |
| GUEST-005 | Prompt account creation at booking initiation | P0 |
| GUEST-006 | Persist guest session data for 24 hours | P1 |

#### Acceptance Criteria
- [ ] Guest user can view all public business information without login prompt
- [ ] "Book Now" CTA triggers authentication modal with pre-filled context
- [ ] Post-authentication, user returns to exact booking context
- [ ] Guest session data (browsed businesses, search filters) retained for 24 hours
- [ ] No personal data collection beyond device analytics (anonymous)

---

### 2.3 Business Search & Discovery
**Priority**: P0 — Critical Path

#### Description
Powerful, multi-faceted search enabling users to find ideal service providers efficiently.

#### User Stories
- As a user, I want to search by service type so I find relevant businesses
- As a user, I want to filter by price, rating, and distance so I narrow options quickly
- As a user, I want to see trending and recommended businesses so I discover new options

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| SEARCH-001 | Full-text search across business names, services, descriptions | P0 |
| SEARCH-002 | Filter: distance (radius), price range, rating, availability | P0 |
| SEARCH-003 | Sort: relevance, distance, rating, price (low/high) | P0 |
| SEARCH-004 | Auto-complete suggestions with recent searches | P0 |
| SEARCH-005 | Category-based browsing with subcategories | P0 |
| SEARCH-006ikken | Trending and "near you" recommendations | P1 |
| SEARCH-007 | Save and name custom search filters | P2 |
| SEARCH-008 | Voice search input | P3 |

#### Acceptance Criteria
- [ ] Search returns results in <500ms for queries within 50km radius
- [ ] Auto-complete suggests after 3 characters with top 5 matches
- [ ] Filters combine with AND logic; each filter shows active count
- [ ] Empty states provide clear next steps (broaden filters, change location)
- [ ] Recent searches persist across sessions (max 10, deletable)
- [ ] Results update in real-time as filters change (no page reload)

---

### 2.4 Map-based Search
**Priority**: P0 — Critical Path

#### Description
Visual geographic exploration of businesses with interactive map integration.

#### User Stories
- As a user, I want to see businesses on a map so I understand proximity
- As a user, I want to explore different areas so I find convenient locations

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| MAP-001 | Interactive map with business markers | P0 |
| MAP-002 | Cluster markers for dense areas | P0 |
| MAP-003 | User location dot with accuracy radius | P0 |
| MAP-004 | Business card preview on marker tap | P0 |
| MAP-005 | List/map toggle with synchronized results | P0 |
| MAP-006 | Directions integration (external maps app) | P1 |
| MAP-007 | Heat map of popular booking times | P3 |

#### Acceptance Criteria
- [ ] Map initializes to user location within 2 seconds (with permission)
- [ ] Markers cluster when >10 in viewport; de-cluster on zoom
- [ ] Business card shows: name, rating, price indicator, next availability
- [ ] Map bounds filter results; moving map updates list (debounced 300ms)
- [ ] "Re-center" button returns to user location
- [ ] Tapping directions opens native maps with pre-filled destination

---

### 2.5 Business Detail View
**Priority**: P0 — Critical Path

#### Description
Comprehensive business profile presenting all information needed for booking decision.

#### User Stories
- As a user, I want to see photos, services, and reviews so I evaluate quality
- As a user, I want to know hours and policies so I plan my visit

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| BIZ-001 | Image gallery (up to 20 photos) | P0 |
| BIZ-002 | Business info: name, address, phone, hours, website | P0 |
| BIZ-003 | Service menu with pricing and duration | P0 |
| BIZ-004 | Staff/professional profiles | P0 |
| BIZ-005 | Customer reviews with photos | P0 |
| BIZ-006 | Business policies (cancellation, late arrival, COVID) | P0 |
| BIZ-007 | "Book Now" CTA with service selection | P0 |
| BIZ-008 | Share business (deep link) | P1 |
| BIZ-009 | Report inaccurate information | P2 |

#### Acceptance Criteria
- [ ] Gallery supports pinch-zoom, swipe, and thumbnail navigation
- [ ] Hours display in user's timezone with "Open now" / "Closes at" indicator
- [ ] Services grouped by category; expandable for details
- [ ] Reviews sortable by newest, highest, lowest; filterable by service
- [ ] "Add to Calendar" available post-booking from this view
- [ ] Deep links open native app or fallback to mobile web

---

### 2.6 Service Categories
**Priority**: P0 — Critical Path

#### Description
Hierarchical classification system organizing all bookable services.

#### User Stories
- As a user, I want to browse by category so I find specific services
- As a business owner, I want to categorize my offerings so customers find me

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| CAT-001 | Hierarchical: Category > Subcategory > Service | P0 |
| CAT-002 | Predefined category taxonomy (beauty, wellness, health, etc.) | P0 |
| CAT-003 | Category icons and color coding | P0 |
| CAT-004 | Popular services per category | P0 |
| CAT-005 | Business can add custom services within taxonomy | P1 |
| CAT-006 | Seasonal/promotional category highlights | P2 |

#### Acceptance Criteria
- [ ] Taxonomy supports: Hair, Nails, Face, Body, Massage, Medical Aesthetics, Fitness, Other
- [ ] Each category has unique icon, color, and description
- [ ] Services display: name, description, duration, price (from/to), deposit requirement
- [ ] Business can set multiple categories; primary category determines search ranking

---

### 2.7 Booking Flow
**Priority**: P0 — Critical Path

#### Description
Streamlined, multi-step appointment booking with real-time availability and confirmation.

#### User Stories
- As a user, I want to book an appointment in minimal steps so I save time
- As a user, I want to select my preferred professional so I build relationships
- As a user, I want to see all costs upfront so there are no surprises

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| BOOK-001 | Service selection with variants | P0 |
| BOOK-002 | Professional selection (specific or "no preference") | P0 |
| BOOK-003 | Date and time slot selection | P0 |
| BOOK-004 | Guest information (name, phone, notes) | P0 |
| BOOK-005 | Add-on/upsell suggestions | P1 |
| BOOK-006 | Promo code application | P1 |
| BOOK-007 | Payment method selection | P0 |
| BOOK-008 | Booking confirmation with details | P0 |
| BOOK-009 | Add to calendar | P0 |
| BOOK-010 | Guest booking (without account, via share link) | P2 |

#### Acceptance Criteria
- [ ] Booking completes in ≤5 steps from service selection
- [ ] Time slots show in user's timezone; unavailable slots visually disabled
- [ ] Slot selection triggers 10-minute hold (reservation) with countdown
- [ ] Price breakdown shows: service cost, add-ons, taxes, deposit, total
- [ ] Confirmation includes: booking reference, QR code, calendar invite, directions link
- [ ] Failed payment releases hold immediately; user notified with retry option
- [ ] Booking modifications allowed until cutoff (business-defined, default 24h)

---

### 2.8 Appointment Management
**Priority**: P0 — Critical Path

#### Description
Comprehensive lifecycle management for consumer appointments.

#### User Stories
- As a user, I want to view my upcoming appointments so I stay organized
- As a user, I want to reschedule or cancel so I adapt to changes
- As a user, I want to rebook with favorites so I save time

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| APPT-001 | Upcoming/past appointments list | P0 |
| APPT-002 | Appointment detail view | P0 |
| crush | Reschedule with availability check | P0 |
| APPT-004 | Cancel with reason selection | P0 |
| APPT-005 | Rebook same service/professional | P0 |
| APPT-006 | Add to/Remove from calendar sync | P1 |
| APPT-007 | Appointment notes and preparation instructions | P1 |
| APPT-008 | No-show reporting and penalties | P2 |

#### Acceptance Criteria
- [ ] Upcoming appointments sort by date; past by reverse date (default 12 months)
- [ ] Reschedule presents same availability logic as initial booking
- [ ] Cancellation enforces business policy; shows refund amount and timeline
- [ ] Push notification sent 24 hours, 2 hours, and 15 minutes before appointment
- [ ] Calendar sync (iCal/Google) updates on reschedule/cancel automatically
- [ ] No-show: after 15 minutes, business can mark; 3 no-shows trigger account review

---

### 2.9 Favorites
**Priority**: P1 — Important

#### Description
User-curated collection of preferred businesses and professionals.

#### User Stories
- As a user, I want to save favorite businesses so I rebook quickly
- As a user, I want to see favorites' availability at a glance so I plan efficiently

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| FAV-001 | Add/remove business from favorites | P1 |
| FAV-002 | Add/remove specific professional | P2 |
| FAV-003 | Favorites list with quick-book | P1 |
| FAV-004 | Availability preview for next 7 days | P2 |
| FAV-005 | Favorite businesses' promotions/updates | P2 |

#### Acceptance Criteria
- [ ] Heart icon toggles favorite with haptic feedback
- [ ] Favorites sync across devices for logged-in user
- [ ] Quick-book from favorites skips search, goes to service selection
- [ ] Push notification when favorite adds new service or promotion (opt-in)

---

### 2.10 User Profile
**Priority**: P1 — Important

#### Description
Centralized user information, preferences, and account management.

#### User Stories
- As a user, I want to manage my personal information so bookings are accurate
- As a user, I want to set preferences so the app personalizes to me

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| PROF-001 | Personal info: name, phone, email, photo | P1 |
| PROF-002 | Multiple saved payment methods | P1 |
| PROF-003 | Notification preferences (push, SMS, email) | P1 |
| PROF-004 | Privacy settings | P1 |
| PROF-005 | Booking history and analytics | P2 |
| PROF-006 | Referral code and rewards | P2 |
| PROF-007 | Loyalty program integration | P3 |

#### Acceptance Criteria
- [ ] Profile completion percentage incentivizes full setup
- [ ] Payment methods support: credit/debit, Apple Pay, Google Pay, PayPal
- [ ] Default notification settings: confirmations (email), reminders (push), promotions (opt-in)
- [ ] GDPR data export: JSON/CSV download within 48 hours of request
- [ ] Referral: unique code, trackable link, credit on first completed booking

---

### 2.11 Availability & Slot Computation
**Priority**: P0 — Critical Path

#### Description
Real-time, rule-based availability engine powering all booking experiences.

#### User Stories
- As a business owner, I want accurate availability so I maximize bookings without conflicts
- As a user, I want to see real-time slots so I book confidently

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| SLOT-001 | Business hours and break configuration | P0 |
| SLOT-002 | Service duration and buffer time | P0 |
| SLOT-003 | Professional-specific schedules | P0 |
| SLOT-004 | Blocked times (time off, holidays) | P0 |
| SLOT-005 | Concurrent booking limits | P1 |
| SLOT-006 | Waitlist for full slots | P2 |
| SLOT-007 | Dynamic pricing (surge/quiet hours) | P2 |
| SLOT-008 | Recurring availability patterns | P1 |

#### Acceptance Criteria
- [ ] Slot generation respects: business hours, staff schedules, service duration, buffers, existing bookings
- [ ] Buffer time: configurable pre/post service (default 0/15 min)
- Werner- [ ] Slots regenerate within 2 seconds of any schedule change
- [ ] Overbooking prevention: atomic slot reservation with 10-min hold
- [ ] Waitlist: user notified via push if slot opens; 30-minute claim window
- [ ] Timezone handling: all times stored in UTC, displayed in business timezone

---

### 2.12 Shared Types & Design System
**Priority**: P0 — Enabler

#### Description
Unified visual language and component library ensuring consistency across platforms.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| DS-001 | Color palette, typography, spacing tokens | P0 |
| DS-002 | Component library (buttons, inputs, cards, modals) | P0 |
| DS-003 | Icon system | P0 |
| DS-004 | Animation and interaction patterns | P0 |
| DS-005 | Dark mode support | P1 |
| DS-006 | Accessibility (WCAG 2.1 AA minimum) | P0 |
| DS-007 | Localization framework (i18n) | P1 |

#### Acceptance Criteria
- [ ] Design tokens in JSON for cross-platform consumption
- [ ] Components tested on iOS 14+, Android 8+, Chrome, Safari, Firefox
- [ ] Minimum touch target: 44x44dp/pt
- [ ] Screen reader labels for all interactive elements
- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] RTL language support (Arabic, Hebrew)

---

### 2.13 Reviews & Ratings
**Priority**: P1 — Important

#### Description
Trust-building user-generated content system for businesses and services.

#### User Stories
- As a user, I want to read honest reviews so I choose quality providers
- As a user, I want to share my experience so others benefit

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| REV-001 | Star rating (1-5) with written review | P1 |
| REV-002 | Photo/video attachments | P1 |
| REV-003 | Verified purchase badge | P0 |
| REV-004 | Business response to reviews | P1 |
| REV-005 | Review helpfulness voting | P2 |
| REV-006 | Report inappropriate content | P1 |
| REV-007 | Review eligibility (post-appointment, within 30 days) | P0 |

#### Acceptance Criteria
- [ ] Only verified customers (completed appointment) can review
- [ ] Review window: 24 hours after appointment until 30 days
- [ ] Photos: max 5 per review, 5MB each, auto-moderated for content
- [ ] Business response within 72 hours highlighted
- [ ] Aggregate rating recalculates within 5 minutes of new review
- [ ] Review content filtered for profanity, hate speech, personal information

---

### 2.14 Payment Integration
**Priority**: P0 — Critical Path

#### Description
Secure, multi-provider payment processing with support for deposits, full payments, and refunds.

#### User Stories
- As a user, I want to pay securely so I trust the platform
- As a business owner, I want reliable payout so I receive earnings

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| PAY-001 | Credit/debit card processing (Stripe) | P0 |
| PAY-002 | Digital wallets (Apple Pay, Google Pay) | P0 |
| PAY-003 | Deposit-only vs. full payment options | P0 |
| PAY-004 | Refund processing (full, partial, store credit) | P0 |
| PAY-005 | Business payout scheduling | P0 |
| PAY-006 | Invoice and receipt generation | P1 |
| PAY-007 | Tip addition | P1 |
| PAY-008 | Payment plan options (Klarna, Afterpay) | P3 |

#### Acceptance Criteria
- [ ] PCI-DSS compliance via tokenization; no raw card data stored
- [ ] 3D Secure authentication for applicable transactions
- [ ] Deposit: minimum 20% or business-defined; remainder auto-charged day before
- [ ] Refunds processed within 5-10 business days to original payment method
- [ ] Business payouts: weekly or monthly, minimum threshold €25
- [ ] Failed payment: 3 retry attempts over 24 hours, then cancellation

---

### 2.15 Notifications
**Priority**: P1 — Important

#### Description
Multi-channel, preference-aware communication system for all user touchpoints.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| NOT-001 | Push notifications (iOS/APNs, Android/FCM) | P1 |
| NOT-002 | SMS notifications | P1 |
| NOT-003 | Email notifications | P1 |
| NOT-004 | In-app notification center | P1 |
| NOT-005 | Notification preference management | P1 |
| NOT-006 | Rich notifications with deep links | P1 |
| NOT-007 | Quiet hours respect | P1 |

#### Acceptance Criteria
- [ ] Notification types: booking confirmation, reminder (24h, 2h, 15m), promotion, system
- [ ] User controls per channel: on, off, or quiet hours only
- [ ] Quiet hours default: 22:00-08:00 user timezone; no promotional notifications
- [ ] Deep links open specific screens in-app or web
- [ ] Delivery tracking: attempted, delivered, opened (where supported)
- [ ] Unsubscribe from promotional: single tap, effective within 24 hours

---

### 2.16 Provider / Business Owner Portal
**Priority**: P0 — Critical Path

#### Description
Comprehensive web-based management interface for business operations.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| PORT-001 | Dashboard with KPIs (bookings, revenue, occupancy) | P0 |
| PORT-002 | Appointment calendar (day, week, month views) | P0 |
| PORT-003 | Booking management (confirm, reschedule, cancel, no-show) | P0 |
| PORT-004 | Staff/professional management | P0 |
| PORT-005 | Service catalog and pricing | P0 |
| PORT-006 | Availability and schedule configuration | P0 |
| PORT-007 | Customer management and notes | P1 |
| PORT-008 | Marketing tools (promotions, loyalty) | P2 |
| PORT-009 | Reporting and analytics | P1 |
| PORT-010 | Payout and financial overview | P1 |

#### Acceptance Criteria
- [ ] Dashboard loads in <3 seconds; KPIs update every 15 minutes
- [ ] Calendar supports drag-and-drop reschedule, color-coded by status
- [ ] Bulk actions: confirm all pending, message all tomorrow's customers
- [ ] Staff can have restricted access (view only, no pricing changes)
- [ ] Reports exportable to CSV/PDF; scheduled email delivery option
- [ ] Mobile-responsive for on-the-go management

---

### 2.17 Admin Dashboard
**Priority**: P1 — Important

#### Description
Platform-level oversight and operational tools for internal teams.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| ADMIN-001 | User management (search, view, suspend, delete) | P1 |
| ADMIN-002 | Business onboarding and verification | P1 |
| ADMIN-003 | Content moderation (reviews, photos, reports) | P1 |
| ADMIN-004 | Financial oversight and dispute resolution | P1 |
| ADMIN-005 | Platform analytics and health | P1 |
| ADMIN-006 | Feature flags and A/B test configuration | P2 |
| ADMIN-007 | System alerts and monitoring | P1 |

#### Acceptance Criteria
- [ ] Role-based access: super admin, support, finance, content moderator
- [ ] Business verification workflow: submitted → under review → approved/rejected → live
- [ ] Content queue: flagged items reviewed within 4 hours (SLA)
- [ ] Financial disputes: evidence collection, decision log, appeal process
- [ ] Real-time metrics: active users, bookings/hour, revenue, error rates

---

### 2.18 Background Jobs (BullMQ)
**Priority**: P0 — Enabler

#### Description
Reliable, scalable asynchronous job processing for time-consuming operations.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| JOB-001 | Queue-based job processing with BullMQ/Redis | P0 |
| JOB-002 | Job prioritization and concurrency limits | P0 |
| JOB-003 | Retry logic with exponential backoff | P0 |
| JOB-004 | Dead letter queue for failed jobs | P0 |
| JOB-005 | Job monitoring and alerting | P1 |
| JOB-006 | Scheduled/recurring jobs | P0 |

#### Job Types
| Job | Trigger | Priority |
|---|---|---|
| Send notification | Booking event, reminder time | P0 |
| Process payment | Booking confirmation | P0 |
| Generate calendar invite | Booking confirmation | P0 |
| Update search index | Business/service change | P0 |
| Calculate analytics | Hourly aggregation | P1 |
| Clean expired holds | Every 5 minutes | P0 |
| Send marketing emails | Scheduled campaigns | P1 |
| Data export | User request | P2 |

#### Acceptance Criteria
- [ ] Job processing latency: 95th percentile <5 seconds for P0 jobs
- [ ] Retry: 3 attempts, backoff 1 min, 5 min, 15 min
- [ ] Dead letter queue: manual review UI, auto-alert after 10 failures
- [ ] Redis cluster: 3-node minimum for HA
- [ ] Job progress trackable via API for long-running operations

---

## 3. Non-Functional Requirements

### 3.1 Performance
- API response time: P95 < 200ms
- App cold start: < 3 seconds
- Image loading: progressive, placeholder while loading

### 3.2 Security
- OWASP Top 10 compliance
- Annual penetration testing
- Data encryption at rest (AES-256) and in transit (TLS 1.3)

### 3.3 Compliance
- GDPR, CCPA data handling
- PCI-DSS Level 1 for payments
- Accessibility: WCAG 2.1 AA

### 3.4 Reliability
- 99.9% uptime SLA
- Database backups: continuous, point-in-time recovery
- Disaster recovery: RPO < 1 hour, RTO < 4 hours

---

## 4. Release Criteria

| Phase | Features | Target |
|---|---|---|
| MVP | AUTH, GUEST, SEARCH, MAP, BIZ, CAT, BOOK, SLOT, PAY, PORT basics | Month 3 |
| v1.0 | + APPT, FAV, PROF, NOT, REV, ADMIN | Month 5 |
| v1.1 | + DS dark mode, loyalty, waitlist, marketing tools | Month 7 |
| v2.0 | AI recommendations, dynamic pricing, international expansion | Month 12 |

---

## 5. Success Metrics

| Metric | Target |
|---|---|
| User registration completion rate | > 80% |
| Booking conversion (start to complete) | > 40% |
| Search-to-booking time | < 5 minutes |
| Business owner NPS | > 50 |
| Consumer NPS | > 60 |
| App store rating | > 4.5 |
| Support ticket volume | < 2% of transactions |
