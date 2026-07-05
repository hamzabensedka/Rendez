# Planity Clone — Product Specification

## 1. Overview

Build a multi-platform appointment booking platform connecting customers with local service businesses (salons, barbershops, spas, clinics). Two native mobile apps (iOS/Android via React Native), a web customer portal, a business owner portal, and an admin dashboard.

**Target Users:** Customers seeking appointments, business owners managing schedules, platform administrators.

---

## 2. Feature Specifications

### 2.1 User Authentication (Priority: Critical)

**Description:** Secure, frictionless account creation and access for customers and business owners.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| AUTH-1 | Email/password registration | User can register with email, password, first name, last name, phone. Password: min 8 chars, 1 uppercase, 1 number, 1 special char. Verification email sent. |
| AUTH-2 | Email verification | Account inactive until email verified. Resend email option. 24hr expiration on token. |
| AUTH-3 | Login with email/password | JWT access (15min) + refresh token (7 days) rotation. Rate limit: 5 attempts per 15min. |
| AUTH-4 | Social login (Google, Apple, Facebook) | OAuth 2.0 flow. Auto-link if email matches existing account. |
| AUTH-5 | Password reset | Secure token via email, 1-hour expiration. |
| AUTH-6 | Biometric login (mobile) | Face ID / Touch ID / Fingerprint after initial setup. Fallback to PIN. |
| AUTH-7 | Session management | View active sessions, revoke per-device, force logout on suspicious activity. |
| AUTH-8 | Role-based access | Customer, Business Owner, Admin roles enforced server-side. |

**Edge Cases:** Social account email conflicts; account deletion request (GDPR 30-day purge).

---

### 2.2 Guest Browse & Explore (Priority: Critical)

**Description:** Allow unauthenticated users to browse businesses and services to reduce friction before conversion.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| GUEST-1 | Browse without account | View business listings, search, filters, business details, available services, and pricing without login. |
| GUEST-2 | Booking prompt at conversion | At "Book" action, present auth modal with "Continue as Guest" (email + phone required) or "Sign Up/Login". |
| GUEST-3 | Guest booking persistence | Guest bookings linked post-registration via email match. Merge history on account creation. |
| GUEST-4 | Guest session limits | Max 3 bookings per email without full registration. Prompt to register after threshold. |

---

### 2.3 Business Search & Discovery (Priority: Critical)

**Description:** Powerful search to find businesses by multiple dimensions.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SEARCH-1 | Text search | Search business name, service name, description. Fuzzy matching, typo tolerance (Levenshtein distance ≤ 2). Results in <200ms. |
| SEARCH-2 | Autocomplete suggestions | Debounced (300ms), max 8 suggestions. Include trending searches. |
| SEARCH-3 | Recent searches | Persist last 10 searches, one-tap re-run, clear history option. |
| SEARCH-4 | Popular/trending | Algorithm: booking velocity (last 7 days), review count, rating weighted. |
| SEARCH-5 | Search history analytics | Track queries, zero-result rates, click-through for search quality improvement. |

---

### 2.4 Map-based Search (Priority: High)

**Description:** Visual location exploration with geographic filtering.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| MAP-1 | Interactive map | Google Maps / Mapbox integration. Default zoom: fit results. Cluster markers at zoom < 12. |
| MAP-2 | Current location | Request permission, fallback to IP geolocation. Show accuracy radius. |
| MAP-3 | Radius filter | Slider: 1km to 50km. Default 5km. Update results real-time on change. |
| MAP-4 | Map/list toggle | Persistent user preference. Smooth transition animation. |
| MAP-5 | Business card on marker tap | Preview: name, rating, price range, next available slot. Tap-through to detail. |
| MAP-6 | Area search | "Search this area" on pan/zoom. Debounced 500ms. |

---

### 2.5 Business Detail View (Priority: Critical)

**Description:** Comprehensive business information to drive booking decisions.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BIZ-1 | Header info | Business name, verified badge, rating (avg + count), favorite toggle, share (deep link). |
| BIZ-2 | Photo gallery | Up to 20 images, pinch-zoom, carousel. Lazy load, progressive quality. |
| BIZ-3 | Description & amenities | Rich text, expandable. Amenities as icon chips (WiFi, parking, wheelchair access, etc.). |
| BIZ-4 | Service menu | Grouped by category, collapsible. Each: name, duration, price, description, "Book" CTA. |
| BIZ-5 | Staff profiles | Name, photo, bio, specialties, average rating. Filter services by staff availability. |
| BIZ-6 | Operating hours | Weekly schedule, holiday exceptions, "Open now" indicator. |
| BIZ-7 | Contact & location | Address, click-to-call, get directions (external maps app). |
| BIZ-8 | Review summary | Aggregate rating, rating distribution histogram, keyword tags from reviews. |
| BIZ-9 | Similar businesses | "You may also like" carousel based on category + location. |

---

### 2.6 Service Categories (Priority: High)

**Description:** Hierarchical classification for discoverability and business organization.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CAT-1 | Category hierarchy | 3 levels max. Example: Beauty > Hair > Haircut. Admin-managed taxonomy. |
| CAT-2 | Business category assignment | Primary category (1) + secondary categories (up to 3). Affects search ranking. |
| CAT-3 | Category icons & colors | Consistent iconography, color coding in UI. Themeable per category. |
| CAT-4 | Category landing pages | SEO-optimized, featured businesses, trending in category. |
| CAT-5 | Popular categories | Dynamic based on booking volume in user's region. |

---

### 2.7 Booking Flow (Priority: Critical)

**Description:** Seamless multi-step appointment reservation.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BOOK-1 | Service selection | Single or multiple services (cart). Duration and price auto-summed. |
| BOOK-2 | Staff selection | "Any available" or specific staff. Show staff availability impact. |
| BOOK-3 | Date & time selection | Calendar view (2-week default), slot grid. Only show truly available slots. See 2.11 for slot computation. |
| BOOK-4 | Guest info (if applicable) | Name, email, phone. Option to create account. |
| BOOK-5 | Special requests | Free text, max 500 chars. Visible to business. |
| BOOK-6 | Payment (if required) | See 2.14. Show deposit amount, full prepay, or pay-at-business. |
| BOOK-7 | Booking confirmation | Summary review, terms acceptance, confirm CTA. |
| BOOK-8 | Confirmation screen | Booking reference, calendar add (ICS), share, directions. |
| BOOK-9 | Booking modification | Reschedule (new slot selection) or cancel per business policy. |
| BOOK-10 | Waitlist | Option to join waitlist for fully-booked slots. Auto-notify on cancellation. |

**Edge Cases:** Concurrent booking race condition (optimistic lock, retry with new slots); business closes mid-booking.

---

### 2.8 Appointment Management (Priority: Critical)

**Description:** Post-booking lifecycle for customers and businesses.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| APPT-1 | Customer appointment list | Upcoming / past / cancelled tabs. Sort: date descending. Pull-to-refresh. |
| APPT-2 | Appointment detail | All booking info, business contact, reschedule/cancel actions, add to calendar, directions. |
| APPT-3 | Reschedule | Before business cancellation deadline. New slot selection, confirmation. |
| APPT-4 | Cancel | With reason selection (customer no-show risk scoring). Refund per policy. |
| APPT-5 | Rebook | One-tap rebook same service/staff from past appointment. |
| APPT-6 | Business appointment calendar | Day/week/month views. Color-coded by status. Drag-to-reschedule. |
| APPT-7 | Business appointment actions | Confirm, mark no-show, complete, add notes, send message. |
| APPT-8 | Appointment status lifecycle | Pending → Confirmed → Checked-in → In-Progress → Completed → No-show / Cancelled. |

---

### 2.9 Favorites (Priority: Medium)

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| FAV-1 | Add/remove favorite | Heart toggle on business card, detail, search results. Haptic feedback. |
| FAV-2 | Favorites list | Grid/list view, sort: recently added, name, nearest. |
| FAV-3 | Favorite notifications | Opt-in: "New availability" or "promotion" alerts per favorited business. |
| FAV-4 | Sync | Cross-device, requires auth. Guest favorites prompt registration to persist. |

---

### 2.10 User Profile (Priority: High)

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PROF-1 | Profile info | Photo, name, email, phone, birthday (for birthday offers). Editable. |
| PROF-2 | Security settings | Change password, 2FA (TOTP), manage social connections, active sessions. |
| PROF-3 | Payment methods | See 2.14. Default method, add/remove. |
| PROF-4 | Notification preferences | Push, email, SMS toggles per type (bookings, promotions, reminders). |
| PROF-5 | Privacy settings | Profile visibility, data download, account deletion (GDPR). |
| PROF-6 | Loyalty / rewards | Points balance, history, tier status, available rewards. |
| PROF-7 | Booking history | All appointments, filterable, searchable, exportable. |

---

### 2.11 Availability & Slot Computation (Priority: Critical)

**Description:** Accurate, real-time availability calculation considering complex business rules.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SLOT-1 | Business hours definition | Weekly recurring schedule + exceptions (holidays, temporary closures). |
| SLOT-2 | Service duration mapping | Fixed or variable duration. Buffer time before/after. |
| SLOT-3 | Staff availability | Individual schedules, breaks, time-off. Override business hours. |
| SLOT-4 | Slot generation algorithm | Generate slots respecting: business hours, staff availability, existing bookings, service duration, buffers, concurrent service limits. |
| SLOT-5 | Real-time accuracy | Slot availability computed at request time. Pessimistic locking during booking attempt (5-min hold). |
| SLOT-6 | Timezone handling | All times stored UTC, displayed in business timezone. DST-aware. |
| SLOT-7 | Performance | Slot query for 2-week view <100ms. Cached with invalidation on booking change. |
| SLOT-8 | Edge cases | Cross-day appointments (e.g., 11pm-1am), minimum lead time (e.g., 2 hours ahead), maximum booking horizon (e.g., 60 days). |

**Algorithm Requirements:**
- Generate candidate slots from business hours
- Subtract staff unavailability (breaks, time-off)
- Subtract existing confirmed bookings
- Apply service-specific constraints (duration, buffer, required equipment)
- Apply booking rules (min advance, max future, staff-specific restrictions)
- Return deduplicated, sorted slot list

---

### 2.12 Shared Types & Design System (Priority: High)

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| DS-1 | Design tokens | Colors, typography, spacing, shadows, radii as variables. Dark mode support. |
| DS-2 | Component library | Reusable: buttons, inputs, cards, modals, calendars, time pickers, avatars, skeleton loaders. |
| DS-3 | Shared types | TypeScript interfaces for all entities (User, Business, Service, Appointment, etc.) in shared package. |
| DS-4 | API contracts | OpenAPI/Swagger documentation. Versioned endpoints. |
| DS-5 | Accessibility | WCAG 2.1 AA minimum. Screen reader support, focus management, color contrast, reduced motion. |
| DS-6 | Localization | i18n framework. Date/time, currency, number formatting per locale. RTL layout support. |
| DS-7 | Responsive breakpoints | Mobile: <768px, Tablet: 768-1024px, Desktop: >1024px. Mobile-first. |

---

### 2.13 Reviews & Ratings (Priority: High)

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| REV-1 | Eligibility to review | Verified booking completion only. Review window: 7 days post-appointment. |
| REV-2 | Rating dimensions | Overall (1-5 stars), optional sub-ratings: service quality, staff, ambiance, value. |
| REV-3 | Review content | Title (optional), body (10-2000 chars). Photo upload (max 5). |
| REV-4 | Business response | Owner can respond publicly. Response editable. |
| REV-5 | Review moderation | Auto-flag: profanity, spam, conflicts of interest. Admin review queue. |
| REV-6 | Review display | Chronological, helpfulness sort. Verified badge. Owner response highlighted. |
| REV-7 | Review analytics | Sentiment analysis, keyword extraction, trend reporting for business owners. |
| REV-8 | Abuse prevention | One review per booking. No self-reviews. Appeal process. |

---

### 2.14 Payment Integration (Priority: Critical)

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PAY-1 | Payment methods | Credit/debit cards (Stripe), Apple Pay, Google Pay, PayPal. |
| PAY-2 | Business payment models | Full prepay, deposit (fixed or %), pay-at-business, free booking. |
| PAY-3 | Payment flow | PCI-compliant (Stripe Elements). 3D Secure support. SCA compliance in EU. |
| PAY-4 | Refunds | Automated per cancellation policy. Partial refund support. Manual override by admin. |
| PAY-5 | Payouts to businesses | Weekly/bi-weekly/monthly. Stripe Connect (marketplace). Dashboard for business owners. |
| PAY-6 | Platform fee | Configurable % or flat fee per transaction. Transparent to customer at checkout. |
| PAY-7 | Invoicing | Email receipt, VAT/tax details, downloadable PDF. |
| PAY-8 | Failed payment handling | Retry logic, grace period, booking hold release, customer notification. |

---

### 2.15 Notifications (Priority: High)

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| NOT-1 | Channels | Push (Firebase/OneSignal), SMS (Twilio), email (SendGrid), in-app. |
| NOT-2 | Notification types | Booking confirmation, reminder (24h, 2h before), change/cancel, promotional, review request, waitlist availability. |
| NOT-3 | Preference management | Granular opt-in/opt-out per channel and type. |
| NOT-4 | Delivery reliability | Retry with backoff. Dead letter queue for failures. Delivery tracking. |
| NOT-5 | Rich push | Deep links, action buttons (confirm, reschedule, call). |
| NOT-6 | Notification history | In-app inbox, 90-day retention, mark read/unread. |

---

### 2.16 Provider / Business Owner Portal (Priority: Critical)

**Description:** Web-based management for business owners.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BOP-1 | Dashboard | Today's appointments, revenue this period, new reviews, quick actions. |
| BOP-2 | Business profile management | Edit all business info, photos, hours, services, staff. |
| BOP-3 | Service management | CRUD services, pricing, duration, staff associations, online booking toggle. |
| BOP-4 | Staff management | Add staff, set schedules, permissions (view only, manage own, full admin). |
| BOP-5 | Appointment calendar | See 2.8. Print-friendly, export to external calendar. |
| BOP-6 | Client management | Client list, visit history, notes, contact info, booking patterns. |
| BOP-7 | Analytics | Booking volume, revenue, cancellation rate, no-show rate, popular services/staff, peak hours. Exportable reports. |
| BOP-8 | Promotions | Create discount codes, flash sales, first-time customer offers. |
| BOP-9 | Subscription/billing | Plan selection, upgrade/downgrade, payment method, invoice history. |
| BOP-10 | Multi-location | Switch between locations, aggregated or per-location views. |

---

### 2.17 Admin Dashboard (Priority: High)

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| ADMIN-1 | User management | Search, filter, suspend, impersonate (audit logged), data export. |
| ADMIN-2 | Business management | Approve/reject new businesses, verify documents, feature/promote, suspend. |
| ADMIN-3 | Content moderation | Review queue for flagged reviews, businesses, images. Bulk actions. |
| ADMIN-4 | Financial oversight | Transaction ledger, dispute resolution, refund approval, payout monitoring. |
| ADMIN-5 | Platform analytics | MAU, booking volume, GMV, churn, CAC, LTV, category performance, geographic distribution. |
| ADMIN-6 | System health | API latency, error rates, queue depth, scheduled job status. |
| ADMIN-7 | Configuration | Feature flags, category management, notification templates, fee structures. |
| ADMIN-8 | Audit logging | Immutable log of all admin actions. Searchable, exportable. |

---

### 2.18 Background Jobs (BullMQ) (Priority: High)

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| JOB-1 | Job types | Scheduled (cron), delayed, repeatable, one-off. |
| JOB-2 | Notification dispatch | Queue-based with retry, priority by channel urgency. |
| JOB-3 | Reminder scheduling | Create delayed jobs at booking time for 24h/2h reminders. Handle reschedules (cancel old, create new). |
| JOB-4 | Report generation | Async CSV/PDF generation, email on completion. |
| JOB-5 | Data cleanup | GDPR deletion, expired token purge, old log archival. |
| JOB-6 | Slot cache warming | Pre-compute popular business slots during low-traffic periods. |
| JOB-7 | Review solicitation | 24h post-appointment delayed job. |
| JOB-8 | Monitoring | Job success/failure rates, processing time, queue depth alerts. Dead letter queue inspection. |
| JOB-9 | Concurrency | Configurable worker count per queue type. Priority queues for time-sensitive jobs. |

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App cold start <3s. Screen transitions <300ms. API p95 <200ms. |
| Reliability | 99.9% uptime. Graceful degradation on service failure. |
| Security | OWASP Top 10 mitigation. Encryption at rest and in transit. |
| Scalability | Horizontal scaling, stateless services, CDN for assets. |
| Compliance | GDPR, CCPA, PCI-DSS (Level 1 service provider via Stripe). |

## 4. Priority Summary

| Priority | Features |
|----------|----------|
| Critical | User Authentication, Business Search & Discovery, Business Detail View, Booking Flow, Appointment Management, Availability & Slot Computation, Payment Integration, Provider Portal |
| High | Guest Browse & Explore, Map-based Search, Service Categories, User Profile, Shared Types & Design System, Reviews & Ratings, Notifications, Admin Dashboard, Background Jobs |
| Medium | Favorites |

## 5. Success Metrics

- **Acquisition:** Monthly new registrations, app downloads, organic vs. paid split
- **Activation:** First booking completion rate, time-to-first-booking
- **Engagement:** Monthly bookings per user, session frequency, feature adoption
- **Retention:** D30 retention, churn rate, rebooking rate
- **Revenue:** GMV, take rate, average booking value, business subscription MRR
- **Satisfaction:** NPS, app store rating, support ticket volume
