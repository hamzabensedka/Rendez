# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a cross-platform mobile and web application connecting consumers with local service businesses (beauty, wellness, health) for online appointment booking. The platform serves three user types: **Consumers** (book appointments), **Providers/Business Owners** (manage business, staff, and availability), and **Admins** (platform oversight).

---

## 2. Goals & Metrics

| Goal | Success Metric |
|------|---------------|
| Reduce booking friction | < 3 taps to book from search result |
| Increase business discovery | 60% of searches lead to profile view |
| Minimize no-shows | < 5% via notification reminders |
| Platform growth | 20% MoM new business sign-ups |

---

## 3. Functional Features

### 3.1 User Authentication
**Priority:** P0 | **Owners:** Consumer, Provider, Admin

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| AUTH-1 | Email/password registration | Verify email via 6-digit code; enforce password (8 chars, 1 upper, 1 number) |
| AUTH-2 | Social login (Google, Apple, Facebook) | OAuth 2.0 flow; auto-link to existing email if matched |
| AUTH-3 | Phone number verification | SMS OTP via Twilio; optional for consumers, mandatory for providers |
| AUTH-4 | JWT token management | Access token (15 min), refresh token (7 days); secure rotation on refresh |
| AUTH-5 | Role-based access control | Token contains `role: consumer|provider|admin`; middleware validates per endpoint |
| AUTH-6 | Password reset | Secure token via email; 1-hour expiration; single-use |
| AUTH-7 | Biometric login (mobile) | Face ID/Touch ID opt-in; fallback to PIN |

**Technical Notes:** Use Auth0 or Firebase Auth for initial MVP; migrate to custom if scale requires.

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Consumer (unauthenticated)

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| GUEST-1 | View featured businesses | Homepage shows curated carousel; no account required |
| GUEST-2 | Category browsing | Tap category → see business list; count badge per category |
| GUEST-3 | Business detail preview | View services, prices, reviews, hours; CTA to "Book — Sign In Required" |
| GUEST-4 | Search limited results | Max 20 results; prompt to sign in for full search/filters |
| GUEST-5 | Persistent guest cart | LocalStorage/bundle; merge on sign-up |

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| SEARCH-1 | Full-text search | Search business name, service name, or description; typo tolerance (fuzzy matching) |
| SEARCH-2 | Filter: service category | Multi-select: Hair, Nails, Massage, Barbershop, Spa, etc. |
| SEARCH-3 | Filter: price range | Min/max slider; respect currency localization |
| SEARCH-4 | Filter: availability | "Available today/this week" — filters to businesses with open slots |
| SEARCH-5 | Filter: rating | 4.0+, 4.5+, etc. |
| SEARCH-6 | Filter: distance | 1/2/5/10/20km radius from user location or typed address |
| SEARCH-7 | Sort options | Relevance, distance, rating, price (low/high) |
| SEARCH-8 | Search history | Persist last 10 queries; one-tap re-run |
| SEARCH-9 | Trending searches | Popular queries updated daily |

**Technical:** Elasticsearch or PostgreSQL full-text search with PostGIS for geo.

---

### 3.4 Map-based Search
**Priority:** P1 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| MAP-1 | Interactive map view | Default to list view; toggle to map with custom pins |
| MAP-2 | Clustered markers | Cluster pins at zoom < 12; expand on zoom or tap |
| MAP-3 | Business preview on pin tap | Bottom sheet with name, rating, next available slot, photo |
| MAP-4 | "Search this area" | Drag/zoom map → tap button to re-query visible bounds |
| MAP-5 | Directions CTA | Deep-link to Google/Apple Maps for navigation |
| MAP-6 | Current location | Request location permission; blue dot with accuracy ring |

---

### 3.5 Business Detail View
**Priority:** P0 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| BIZ-1 | Header gallery | Up to 8 photos; swipeable; video support (P2) |
| BIZ-2 | Core info | Name, verified badge, rating (count), address, hours (today), phone |
| BIZ-3 | Favorite toggle | Heart icon; state syncs across sessions; requires auth |
| BIZ-4 | Service listing | Grouped by category; show name, duration, description, price |
| BIZ-5 | Staff selection | Select staff member or "Any available" per service |
| BIZ-6 | Online booking indicator | Green dot if accepting online bookings; grey if phone-only |
| BIZ-7 | Reviews summary | Aggregate rating, distribution bar chart, total count |
| BIZ-8 | Share business | Native share sheet with deep link |
| BIZ-9 | Report business | Flag inappropriate content; admin queue |

---

### 3.6 Service Categories
**Priority:** P0 | **Owner:** Platform

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| CAT-1 | Hierarchical categories | 1 level: Beauty → Hair, Nails, Makeup; Wellness → Massage, Spa, Yoga |
| CAT-2 | Category icons | Consistent icon set from design system; cached SVG |
| CAT-3 | Category metadata | Slug, description, display order, active/inactive flag |
| CAT-4 | Business-category mapping | N:N relationship; max 5 primary categories highlighted |
| CAT-5 | Category SEO pages | Public URL per category with dynamic meta tags |

---

### 3.7 Booking Flow
**Priority:** P0 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| BOOK-1 | Service selection | Tap service → select variation if applicable (e.g., Short/Medium/Long hair) |
| BOOK-2 | Staff selection | Show assigned staff for service; filter by availability on date |
| BOOK-3 | Date picker | Calendar view; unavailable dates visually disabled |
| BOOK-4 | Slot selection | Time slots in 15-min intervals; morning/afternoon/evening grouping |
| BOOK-5 | Guest booking | Option to "book for someone else" with name and phone |
| BOOK-6 | Special requests | Text field (280 chars); included in booking confirmation |
| BOOK-7 | Payment (when applicable) | See section 3.14 |
| BOOK-8 | Confirmation | Summary page with all details; tap to add to calendar (ICS) |
| BOOK-9 | Cancellation policy | Display at checkout; enforce provider-defined policy |
| BOOK-10 | Booking constraints | Prevent double-booking via optimistic locking; race condition handling |

**Slot Generation:** Computed dynamically based on business hours, staff schedules, existing bookings, and service duration — see 3.11.

---

### 3.8 Appointment Management
**Priority:** P0 | **Owners:** Consumer, Provider

#### Consumer
| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| APT-C1 | Appointment list | Upcoming/past tabs; sort upcoming by date ascending |
| APT-C2 | Appointment detail | Service, staff, date/time, location, price, special requests, status |
| APT-C3 | Reschedule | Select new date/time via slot picker; old slot released immediately |
| APT-C4 | Cancel | Per policy; confirmation modal; immediate status update |
| APT-C5 | Rebook | One-tap rebook same service/staff from past appointment |
| APT-C6 | Add to calendar | System calendar integration (iOS/Android) |
| APT-C7 | Directions | Map link to business address |

#### Provider
| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| APT-P1 | Daily/weekly calendar view | Time grid with appointments; color-coded by status (confirmed, checked-in, completed, cancelled, no-show) |
| APT-P2 | Create manual booking | Override availability; mark as "walk-in" or "phone booking" |
| APT-P3 | Modify booking | Edit any field; notify consumer of changes |
| APT-P4 | Check-in/out | Mark arrived; mark completed (triggers review request) |
| APT-P5 | Day notes | Internal notes visible to staff only |

---

### 3.9 Favorites
**Priority:** P1 | **Owner:** Consumer

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| FAV-1 | Toggle favorite | Heart icon on business card and detail; haptic feedback |
| FAV-2 | Favorites list | Grid/list view; sorted by recently favorited |
| FAV-3 | Quick rebook | From favorites, tap to see next availability or book again |
| FAV-4 | Availability shortcut | "Book now" if open slot within 24h |
| FAV-5 | Sync across devices | Real-time via backend; restore if app reinstalled |
| FAV-6 | Suggest similar | "You might also like" based on favorite categories |

---

### 3.10 User Profile
**Priority:** P1 | **Owner:** Consumer, Provider

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| PROF-1 | Avatar upload | Crop to circle; max 5MB; WebP conversion; CDN delivery |
| PROF-2 | Personal info | Name, phone, email, birthdate (optional, for birthday promos) |
| PROF-3 | Notification preferences | Push, SMS, email toggles per event type |
| PROF-4 | Payment methods | Stripe/Adyen saved cards; PCI-compliant, never store raw |
| PROF-5 | Booking history | All past appointments with receipt access |
| PROF-6 | Data export | GDPR-compliant JSON download; request via support |
| PROF-7 | Account deletion | Self-service with 30-day grace period; confirmation email |

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Platform (backend core)

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| SLOT-1 | Business hours | Weekly template: open/close per day; exception dates (holidays) |
| SLOT-2 | Staff schedules | Override business hours per staff; recurring and one-off |
| SLOT-3 | Breaks & buffer time | Lunch breaks, cleanup time between appointments (configurable) |
| SLOT-4 | Service duration mapping | Each service has base duration; sum for multi-service bookings |
| SLOT-5 | Real-time computation | Generate available slots on request; cache 5 min TTL |
| SLOT-6 | Concurrent bookings | Support rooms/chairs (e.g., salon has 3 chairs → 3 concurrent) |
| SLOT-7 | Locked slots | Temporarily hold (5 min) during checkout; release on abandon or payment fail |
| SLOT-8 | Timezone handling | All stored in UTC; display in business timezone; DST-aware |
| SLOT-9 | Slot granularity | Configurable: 15, 30, 60 min intervals |

**Algorithm:** For requested date, get business hours → subtract staff breaks → subtract existing bookings → subtract buffer → return remaining intervals matching service duration.

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Platform (design & frontend)

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| DS-1 | Component library | React Native components mapped 1:1 with web (Storybook) |
| DS-2 | Color system | Primary (#FF6B6B), secondary, semantic (success, warning, error, info) |
| DS-3 | Typography | Inter font family; 6 heading levels, body, caption, overline |
| DS-4 | Spacing scale | 4px base unit; tokens: none (0), xs (4), sm (8), md (16), lg (24), xl (32), 2xl (48) |
| DS-5 | Shared TypeScript types | Single source of truth in `@planity/types` package; auto-generate API types from OpenAPI |
| DS-6 | Date/time formatting | Intl.DateTimeFormat; 12/24h per locale; relative times ("in 2 hours") |
| DS-7 | Accessibility | WCAG 2.1 AA; screen reader labels; focus management; minimum touch target 44x44 |
| DS-8 | Dark mode support | Semantic color tokens invert; user preference + system default |
| DS-9 | Animation standards | 200ms standard duration; ease-in-out; respect `prefers-reduced-motion` |

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Consumer, Provider

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| REV-1 | Post-review eligibility | Only after completed appointment; window 48 hours post-appointment |
| REV-2 | Rating dimensions | Overall 1-5 stars; optional: staff, cleanliness, value for money (P2) |
| REV-3 | Review content | Text optional; min 10 chars if present; profanity filter |
| REV-4 | Photo attachments | Max 3 photos; moderate via Sightengine |
| REV-5 | Business response | Public reply; notification to reviewer |
| REV-6 | Review moderation | Auto-flag: profanity, competitor mention, full-name doxxing; admin queue |
| REV-7 | Rating recalculation | Async average update; cache invalidation on new review |
| REV-8 | Reviewer identity | Show "Verified booking" badge; option to display first name + initial only |

---

### 3.14 Payment Integration
**Priority:** P1 | **Owner:** Consumer, Provider

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| PAY-1 | Payment methods | Cards (Stripe/Adyen), Apple Pay, Google Pay, PayPal |
| PAY-2 | Pricing models | Pay in full, deposit (% or fixed), or free booking (no-show penalty configured) |
| PAY-3 | Secure checkout | PCI DSS Level 1 via tokenization; 3D Secure when required |
| PAY-4 | Payment hold | Pre-authorization for deposit model; capture on service completion |
| PAY-5 | Refunds | Automatic per policy; manual override by provider; traceable via admin |
| PAY-6 | Provider payout | Weekly to connected account (Stripe Connect); dashboard shows pending/paid |
| PAY-7 | Invoice generation | Auto-email PDF invoice; stored in booking history |
| PAY-8 | Failed payment retry | Auto-retry once; notify user; release slot if persistent |

---

### 3.15 Notifications
**Priority:** P1 | **Owner:** Platform (all users)

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| NTF-1 | Channels | Push (Firebase/OneSignal), SMS (Twilio), Email (SendGrid), in-app |
| NTF-2 | Booking confirmation | Immediate delivery via push + email |
| NTF-3 | Reminder sequence | 24h before (push), 2h before (push), 15 min before (push + SMS if opted) |
| NTF-4 | Modification alerts | Real-time push on reschedule by provider or system |
| NTF-5 | Promotional opt-in | Separate toggle; max 2/week; preference center |
| NTF-6 | Quiet hours | No promotional push 22:00–08:00 local time |
| NTF-7 | Delivery tracking | Log all sends; retry failed push via SMS fallback for critical alerts |

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Provider

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| PROV-1 | Business profile setup | Wizard: business info, logo, photos, services, staff, hours |
| PROV-2 | Service management | CRUD services with name, category, description, duration, price, buffer time |
| PROV-3 | Staff management | Invite staff via email; assign services; set individual schedules |
| PROV-4 | Availability calendar | Visual weekly schedule; drag to set recurring hours; holiday exceptions |
| PROV-5 | Booking dashboard | See section 3.8 (Provider appointments) |
| PROV-6 | Client management | View client history, notes (internal), contact; GDPR-compliant |
| PROV-7 | Analytics dashboard | Appointments, revenue, cancellation rate, peak hours, top services |
| PROV-8 | Settings | Cancellation policy (time window, fee), booking lead time, buffer rules |
| PROV-9 | Stripe Connect onboarding | KYC verification; payout schedule; view balance and transfers |

---

### 3.17 Admin Dashboard
**Priority:** P2 | **Owner:** Admin

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| ADMIN-1 | User management | Search, view, suspend/activate; audit log |
| ADMIN-2 | Business verification | Review submitted docs (business license, ID); approve/reject with reason |
| ADMIN-3 | Content moderation | Queue for reported reviews/businesses; one-click actions |
| ADMIN-4 | Financial overview | Platform-fee revenue, payouts pending, disputes |
| ADMIN-5 | System health | BullMQ queue depth, error rates, API latency (Grafana integration) |
| ADMIN-6 | Feature flags | Toggle features per region or business tier |
| ADMIN-7 | Support tools | Impersonate user, resend notifications, manual refund |

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P1 | **Owner:** Platform (backend)

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| JOB-1 | Notification dispatch | Queue per channel; retry 3x with exponential backoff |
| JOB-2 | Slot hold expiration | Scan every 30s; release expired holds |
| JOB-3 | Reminder scheduling | Create delayed jobs at booking time; cancel on reschedule/cancel |
| JOB-4 | Analytics aggregation | Nightly roll-up of KPIs; incremental for real-time views |
| JOB-5 | Partner sync | Push booking data to integrated POS/calendar systems |
| JOB-6 | Data archival | Archive appointments >2 years to cold storage |
| JOB-7 | Dead letter queue | Alert on >5 failures; manual inspection UI |
| JOB-8 | Rate limiting | Prevent API abuse; sliding window per user/IP |

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|------------|
| Performance | Page load < 2s (P95); slot computation < 300ms; map cluster < 100ms |
| Availability | 99.9% uptime; scheduled maintenance window communicated |
| Scalability | Auto-scale at 70% CPU; read replicas for search queries |
| Security | OAuth 2.0 + PKCE; rate limiting; input validation; SQL injection/ XSS prevention |
| Compliance | GDPR (EU), CCPA (CA); data residency options |
| Localization | i18n: FR, EN, ES, DE at launch; RTL support (P2) |

---

## 5. Release Criteria

- [ ] All P0 features implemented and QA tested
- [ ] End-to-end booking flow success rate > 99.5%
- [ ] Payment flow tested with Stripe test mode
- [ ] Security audit (OWASP ZAP) with no critical findings
- [ ] App store submission materials ready

---

## 6. Appendix

### Priority Definitions
- **P0 (Critical):** Blocks launch; core user journey
- **P1 (High):** Expected by users; significant impact on engagement/conversion
- **P2 (Medium):** Competitive parity; improvement to existing features

### Open Questions
1. International expansion timeline affects payment provider selection
2. Video consultations (telehealth) — post-MVP?
3. Subscription/membership model for consumers?