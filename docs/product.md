# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Platform:** Web (responsive) + Mobile (iOS/Android via React Native)  
**Target Audience:** Consumers seeking beauty & wellness appointments; Business owners managing salons/spas/clinics  
**MVP Goal:** Enable seamless discovery, booking, and management of beauty & wellness appointments.

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0 (Critical)  
**Description:** Secure identity management for customers and business owners.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| AUTH-001 | Email/Password Registration | User can register with email, password, first name, last name, phone. Validation: email format, password ≥8 chars with uppercase, lowercase, number. |
| AUTH-002 | Email Verification | Verification email sent on registration; account inactive until verified. |
| AUTH-003 | Login | JWT-based login with email/password. Access token (15min) + Refresh token (7 days). |
| AUTH-004 | Social Login (Google, Apple) | OAuth 2.0 integration. Auto-link if email exists. |
| AUTH-005 | Password Reset | "Forgot password" flow with secure token via email (1-hour expiry). |
| AUTH-006 | Logout | Invalidate refresh token; clear client storage. |
| AUTH-007 | Session Management | Max 5 concurrent sessions; allow viewing active sessions and revoking any. |
| AUTH-008 | Role-Based Access | `CUSTOMER`, `BUSINESS_OWNER`, `ADMIN` roles enforced at API gateway. |

---

### 2.2 Guest Browse & Explore

**Priority:** P0  
**Description:** Allow unauthenticated users to browse businesses and services to drive conversion.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| GUEST-001 | Browse Without Login | Guest can view business listings, search, filter, and view business details without authentication. |
| GUEST-002 | Booking Prompt | On "Book" click, guest is prompted to log in or register. Post-auth, redirect to booking flow with state preserved. |
| GUEST-003 | Guest Session Tracking | Anonymous session ID for analytics; merge favorites/cart on registration. |

---

### 2.3 Business Search & Discovery

**Priority:** P0  
**Description:** Powerful search to help users find the right business.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SEARCH-001 | Text Search | Full-text search across business name, service name, and description. Results ranked by relevance. |
| SEARCH-002 | Autocomplete | Debounced (300ms) suggestions after 3+ characters. Show top 10: businesses, services, categories. |
| SEARCH-003 | Filters | Filter by: category, price range, rating (≥), distance, availability (today, this week), amenities. |
| SEARCH-004 | Sort Options | Sort by: relevance, rating (highest), price (lowest first), distance (nearest). |
| SEARCH-005 | Pagination | Cursor-based pagination, 20 results per page. |
| SEARCH-006 | Recent Searches | Store last 10 searches per user (local storage for guests, DB for authenticated). |

---

### 2.4 Map-based Search

**Priority:** P0  
**Description:** Visual discovery via interactive map.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| MAP-001 | Interactive Map | Google Maps or Mapbox integration. Display business pins with clustering for dense areas. |
| MAP-002 | Geolocation | Auto-detect user location with permission. Fallback to IP-based city approximation. |
| MAP-003 | Radius Search | Default 5km radius; adjustable slider (1km–50km). Update results in real-time. |
| MAP-004 | Pin Interaction | Tap pin → bottom sheet with business name, rating, price range, and "View" CTA. |
| MAP-005 | List/Map Toggle | Seamless switch between list and map views; preserve filters and sort. |

---

### 2.5 Business Detail View

**Priority:** P0  
**Description:** Comprehensive business profile to inform booking decisions.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BIZ-001 | Header Info | Business name, logo, average rating (star display), total reviews, category badges, favorite toggle. |
| BIZ-002 | Photo Gallery | Up to 20 images; carousel with pinch-to-zoom. Lazy load thumbnails. |
| BIZ-003 | Description & Amenities | Full description, amenities list (free WiFi, parking, wheelchair accessible, etc.). |
| BIZ-004 | Location & Hours | Address with "Get Directions" (deep link to maps), full weekly schedule, "Open Now" indicator. |
| BIZ-005 | Services List | Grouped by category; each service shows name, duration, price, and "Book" CTA. |
| BIZ-006 | Staff Profiles | List of providers with photo, bio, specialties, and average rating. |
| BIZ-007 | Reviews Summary | Aggregate rating breakdown (5-star distribution), top 3 reviews, "See all" link. |
| BIZ-008 | Share Business | Native share sheet or copy link with deep linking support. |

---

### 2.6 Service Categories

**Priority:** P0  
**Description:** Hierarchical categorization for organization and discovery.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| CAT-001 | Category Hierarchy | Two-level hierarchy: Parent (e.g., Hair, Nails, Spa) → Subcategory (e.g., Haircut, Coloring). |
| CAT-002 | Category Browsing | Home screen shows featured categories; tap to see subcategories and trending businesses. |
| CAT-003 | Business Assignment | Business can be assigned multiple categories/subcategories. |
| CAT-004 | Category Icons | Consistent iconography per category in design system. |

---

### 2.7 Booking Flow

**Priority:** P0  
**Description:** Frictionless appointment scheduling.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BOOK-001 | Service Selection | User selects one or more services; cumulative duration and price calculated. |
| BOOK-002 | Provider Selection | "Any available" or specific staff member. Show provider availability. |
| BOOK-003 | Date & Time Picker | Calendar view with available slots. Gray out unavailable dates. Slot granularity per service (15/30/60 min). |
| BOOK-004 | Real-time Availability | Slots computed from business hours, staff schedules, existing bookings, and buffer times. |
| BOOK-005 | Guest Information | Pre-fill from profile; allow adding notes (allergies, preferences). |
| BOOK-006 | Payment Selection | Show price breakdown (subtotal, fees, taxes). Select saved payment method or add new. |
| BOOK-007 | Booking Confirmation | Review screen with all details. Confirm → create `PENDING` booking; hold slot for 10 minutes until payment. |
| BOOK-008 | Booking Completion | Post-payment, status → `CONFIRMED`. Show confirmation screen with booking details and add-to-calendar CTA. |
| BOOK-009 | Cancellation Policy | Display at checkout. Support free cancellation up to X hours before (configurable per business). |

---

### 2.8 Appointment Management

**Priority:** P0  
**Description:** Users can view and manage their bookings.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| APPT-001 | My Bookings List | Tabbed view: Upcoming / Past / Cancelled. Sort upcoming by date ascending. |
| APPT-002 | Booking Detail View | Full details: business info, services, provider, date/time, price, status, QR code for check-in. |
| APPT-003 | Reschedule | Allow rescheduling if >X hours before (per policy). New slot must pass availability check. |
| APPT-004 | Cancel Booking | User-initiated cancellation with reason selection. Refund per cancellation policy. |
| APPT-005 | Rebook | One-tap rebook from past appointment (same service, prompt for new date/time). |
| APPT-006 | Booking Reminders | Push notification + email 24 hours and 1 hour before appointment. |

---

### 2.9 Favorites

**Priority:** P1  
**Description:** Save preferred businesses for quick access.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FAV-001 | Add/Remove Favorite | Heart toggle on business card and detail. Immediate feedback; sync to server. |
| FAV-002 | Favorites List | Dedicated screen with grid/list of saved businesses. Show next available slot teaser. |
| FAV-003 | Guest Favorites | Persist in localStorage; prompt to merge on login. |

---

### 2.10 User Profile

**Priority:** P1  
**Description:** Manage personal information and preferences.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PROF-001 | Profile Info | Edit first/last name, phone, profile photo, birthdate (optional, for birthday offers). |
| PROF-002 | Saved Payment Methods | View, add, delete cards. Default payment method selection. |
| PROF-003 | Notification Preferences | Toggle email/push/SMS per event type (bookings, promotions, reminders). |
| PROF-004 | Privacy Settings | Data download request, account deletion (GDPR compliance). |
| PROF-005 | Booking History | Aggregate stats: total bookings, favorite categories, money saved (if promotions used). |

---

### 2.11 Availability & Slot Computation

**Priority:** P0  
**Description:** Core engine for accurate, real-time availability.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SLOT-001 | Business Hours | Weekly recurring schedule with exceptions (holidays, temporary closures). |
| SLOT-002 | Staff Schedules | Individual work schedules with break times. Support part-time and varying weekly schedules. |
| SLOT-003 | Service Duration | Each service has base duration; combo services sum durations. |
| SLOT-004 | Buffer Time | Configurable pre/post-appointment buffer (e.g., 15 min cleanup). |
| SLOT-005 | Slot Generation | Generate available slots by checking: business hours + staff schedule - existing bookings - buffers. |
| SLOT-006 | Concurrent Bookings | Support multiple staff working in parallel; slot availability per staff. |
| SLOT-007 | Timezone Handling | All times stored in UTC; display in business timezone and user's local timezone. |
| SLOT-008 | Cache & Performance | Redis cache for slot queries; invalidate on booking mutation. Response <200ms. |

---

### 2.12 Shared Types & Design System

**Priority:** P1  
**Description:** Consistent UI/UX across platforms.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| DS-001 | Component Library | Reusable components: buttons, inputs, cards, modals, date picker, loading states, empty states. |
| DS-002 | Color Palette | Primary (#6C5CE7), Secondary (#00B894), Error (#D63031), Success (#00B894), Neutral grays. Dark mode support. |
| DS-003 | Typography | Inter font family; scale: H1 (28px) to Caption (12px). |
| DS-004 | Spacing System | 4px base grid; standard padding/margin tokens. |
| DS-005 | Shared TypeScript Types | Centralized types for: User, Business, Service, Booking, Payment, Review. Strict null checks. |
| DS-006 | Accessibility | WCAG 2.1 AA: minimum contrast 4.5:1, screen reader labels, keyboard navigation, focus indicators. |

---

### 2.13 Reviews & Ratings

**Priority:** P1  
**Description:** Social proof to build trust.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REV-001 | Write Review | Eligible after completed appointment. Rating 1-5 stars, text (10-1000 chars), optional photo upload (max 5). |
| REV-002 | Review Moderation | Auto-approve; flag for manual review if reported. Business owner can respond. |
| REV-003 | Review Display | Sort by: most helpful, newest, highest/lowest rating. Verified badge for completed bookings. |
| REV-004 | Rating Breakdown | Per-service and overall business rating. |
| REV-005 | Report Review | Users can report inappropriate content; admin review queue. |

---

### 2.14 Payment Integration

**Priority:** P0  
**Description:** Secure, flexible payment processing.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PAY-001 | Payment Methods | Credit/Debit cards (Stripe), Apple Pay, Google Pay. Save cards for future use. |
| PAY-002 | Payment Intent | Create Stripe PaymentIntent on booking initiation. Hold authorized amount. |
| PAY-003 | Capture & Settlement | Capture payment on booking confirmation. Webhook handling for async confirmation. |
| PAY-004 | Refunds | Full and partial refunds. Processed within 5-10 business days. |
| PAY-005 | Receipts | Auto-generated PDF receipt emailed post-payment. In-app receipt view. |
| PAY-006 | Failed Payment Handling | Retry logic; booking auto-cancelled if payment fails after 3 attempts. Notify user. |
| PAY-007 | PCI Compliance | Never store raw card data; use Stripe Elements / Payment Sheet. |

---

### 2.15 Notifications

**Priority:** P1  
**Description:** Multi-channel communication for engagement.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| NOTIF-001 | Push Notifications | Firebase Cloud Messaging. Rich notifications with deep links. |
| NOTIF-002 | Email Notifications | SendGrid integration. Templates: welcome, booking confirmation, reminder, cancellation, receipt. |
| NOTIF-003 | SMS Notifications | Twilio for critical alerts (booking reminders, same-day changes). |
| NOTIF-004 | In-App Notifications | Notification bell with unread count. Mark as read, archive. |
| NOTIF-005 | Preference Respecting | Honor user notification preferences; no send if channel disabled. |
| NOTIF-006 | Notification History | 90-day retention; searchable by type. |

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0  
**Description:** Self-service management for business owners.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PORT-001 | Business Profile Management | Edit business info, upload photos, set categories, manage amenities. |
| PORT-002 | Service Management | CRUD services: name, description, duration, price, category, staff assignment. |
| PORT-003 | Staff Management | Add staff profiles, set schedules, assign services, deactivate. |
| PORT-004 | Availability Settings | Set weekly hours, breaks, time off, holiday closures. Override individual staff schedules. |
| PORT-005 | Booking Calendar | Day/week/month views. Color-coded by status. Drag-to-reschedule. |
| PORT-006 | Customer Management | View customer list, booking history, notes. Block problematic customers. |
| PORT-007 | Analytics Dashboard | KPIs: bookings, revenue, cancellation rate, no-show rate, top services, peak hours. Date range filter. |
| PORT-008 | Review Responses | Respond to reviews publicly. Flag inappropriate reviews. |
| PORT-009 | Payout Settings | Connect Stripe Connect account. View payout schedule and history. |

---

### 2.17 Admin Dashboard

**Priority:** P1  
**Description:** Platform administration and oversight.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| ADMIN-001 | User Management | Search, view, suspend, delete users. Impersonate for support. |
| ADMIN-002 | Business Management | Approve new business registrations. Suspend/verify businesses. |
| ADMIN-003 | Content Moderation | Review flagged reviews, photos, business descriptions. Approve/reject with notes. |
| ADMIN-004 | Financial Overview | Platform-wide revenue, transaction volume, refunds, fees collected. Export to CSV. |
| ADMIN-005 | Support Tickets | View, assign, resolve customer and business support requests. |
| ADMIN-006 | System Health | Monitor job queues, error rates, API latency. Alert thresholds. |
| ADMIN-007 | Promotions & Campaigns | Create discount codes, featured business slots, push campaign broadcasts. |

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P1  
**Description:** Asynchronous task processing for reliability and performance.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| JOB-001 | Email Queue | All transactional emails queued. Retry 3x with exponential backoff. Dead letter queue after failures. |
| JOB-002 | SMS Queue | SMS notifications queued similarly. Rate limit to comply with Twilio limits. |
| JOB-003 | Push Notification Queue | Batch push notifications. Retry failed deliveries. |
| JOB-004 | Payment Webhook Processing | Idempotent webhook handlers. Update booking status, send confirmations. |
| JOB-005 | Slot Cache Warmup | Pre-compute popular business slots during low-traffic hours. |
| JOB-006 | Data Exports | Large CSV/JSON exports processed async; notify user on completion. |
| JOB-007 | Cleanup Jobs | Purge old notification logs, soft-deleted records, expired tokens (nightly). |
| JOB-008 | Monitoring | BullMQ dashboard integration. Alert on queue depth >1000 or job age >5 min. |

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | API p95 < 200ms; page load < 2s on 4G; image optimization (WebP, lazy loading) |
| **Security** | OWASP Top 10 mitigation; rate limiting; input sanitization; secrets in vault |
| **Scalability** | Stateless API design; horizontal scaling ready; CDN for static assets |
| **Reliability** | 99.9% uptime target; automated backups; disaster recovery plan |
| **Compliance** | GDPR (data portability, right to erasure); PCI-DSS for payments |
| **Localization** | i18n framework; initial languages: EN, FR, ES, DE |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| User Registration Conversion | >40% of app opens |
| Booking Completion Rate | >60% of initiated bookings |
| Search-to-Book Time | <3 minutes average |
| Business Owner Activation | >70% complete profile within 24h |
| App Store Rating | >4.5 stars |
| Customer Support Tickets | <2% of transactions |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP v1.0** | Auth, Guest Browse, Search, Map, Business Detail, Booking Flow, Appointments, Payments, Provider Portal | 8 weeks |
| **v1.1** | Favorites, Reviews, Notifications, User Profile | 3 weeks |
| **v1.2** | Admin Dashboard, Analytics, Background Jobs, Design System polish | 3 weeks |
| **v2.0** | AI Recommendations, Loyalty Program, Group Bookings | TBD |

---

*Document Version: 1.0*  
*Last Updated: 2024*  
*Owner: Alex, Product Owner*
