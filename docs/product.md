# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Platform:** Web (Responsive) + Mobile (iOS/Android via React Native)  
**Target Audience:** Consumers seeking beauty & wellness appointments; Business owners managing salons, spas, barbershops.  
**Vision:** A seamless, real-time booking platform connecting customers with local beauty & wellness businesses.

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 (Critical)  
**Description:** Secure identity management for customers and business owners.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| AUTH-001 | Email/Password Registration | User can register with email, password, first name, last name, phone. Password must be ≥8 chars with uppercase, lowercase, number. Confirmation email sent. |
| AUTH-002 | Email/Password Login | User can log in with valid credentials. JWT token issued with 7-day expiry. Refresh token mechanism implemented. |
| AUTH-003 | Social Login (Google, Apple) | OAuth 2.0 integration. Account linking if email already exists. |
| AUTH-004 | Password Reset | "Forgot password" flow via email with secure token (1-hour expiry). |
| AUTH-005 | Phone Verification | SMS OTP via Twilio for account verification and high-risk actions. |
| AUTH-006 | Session Management | Users can view active sessions and log out from all devices. |
| AUTH-007 | Role-Based Access | Distinct roles: `customer`, `business_owner`, `admin`. Middleware enforces route protection. |

---

### 2.2 Guest Browse & Explore
**Priority:** P0  
**Description:** Allow unauthenticated users to browse businesses and services before committing to registration.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| GUEST-001 | Browse Without Login | Guest can view business listings, search, and view business details without authentication. |
| GUEST-002 | Prompt on Booking Attempt | When guest clicks "Book," show auth modal with option to register or log in. |
| GUEST-003 | Preserve Guest State | Post-login, redirect guest back to their intended booking with selections intact. |
| GUEST-004 | Limited Favorites | Show "Save to favorites" CTA; on click, prompt login. Post-login, item is saved. |

---

### 2.3 Business Search & Discovery
**Priority:** P0  
**Description:** Powerful search and filtering to help users find the right business.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SEARCH-001 | Text Search | Search by business name, service name, or keyword. Fuzzy matching with typo tolerance (Levenshtein distance ≤2). |
| SEARCH-002 | Filters | Filter by: category, price range, rating (≥X stars), distance, availability ("has slots today"), amenities. |
| SEARCH-003 | Sort Options | Sort by: relevance, rating, price (low-high), distance, most reviewed. |
| SEARCH-004 | Auto-complete | Suggest businesses, services, and locations as user types. ≤200ms response time. |
| SEARCH-005 | Recent Searches | Store last 10 searches per user (localStorage for guests, DB for authenticated). |
| SEARCH-006 | Search History Clear | User can clear individual or all recent searches. |

---

### 2.4 Map-based Search
**Priority:** P0  
**Description:** Visual discovery of businesses on an interactive map.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| MAP-001 | Interactive Map | Integrate Mapbox/Google Maps. Display business pins with clustering for dense areas. |
| MAP-002 | Geolocation | Auto-center map on user's current location with permission prompt. Fallback to IP-based city. |
| MAP-003 | Pin Interaction | Tap pin to show business card preview (name, rating, price from). Tap card to navigate to detail. |
| MAP-004 | Bounds Search | Map updates results as user pans/zooms. Debounced API call (300ms). |
| MAP-005 | List/Map Toggle | User can switch between list and map views; preference persisted. |

---

### 2.5 Business Detail View
**Priority:** P0  
**Description:** Comprehensive page for a single business.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BIZ-001 | Header Info | Display: business name, verified badge, average rating, review count, address, phone, website link. |
| BIZ-002 | Photo Gallery | Horizontal scrollable gallery; tap to full-screen carousel. Max 20 images. |
| BIZ-003 | Service Menu | Categorized list of services with name, duration, description, price. Expandable details. |
| BIZ-004 | Staff Profiles | List of professionals with photo, name, bio, specialties, and average rating. |
| BIZ-005 | Operating Hours | Weekly schedule with "Open Now" indicator. Holiday hours support. |
| BIZ-006 | Action Buttons | "Book Now" (primary), "Call", "Share", "Add to Favorites". |
| BIZ-007 | Reviews Summary | Aggregate rating breakdown (5-star histogram). Link to full reviews section. |
| BIZ-008 | Similar Businesses | Carousel of related businesses in same category/area. |

---

### 2.6 Service Categories
**Priority:** P0  
**Description:** Hierarchical classification of services.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| CAT-001 | Category Hierarchy | Two-level hierarchy: Category (e.g., Hair) → Subcategory (e.g., Cut, Color, Styling). |
| CAT-002 | Category Icons | Each category has associated icon and color for UI consistency. |
| CAT-003 | Category Landing Pages | SEO-friendly pages for each category with featured businesses. |
| CAT-004 | Business Category Assignment | Business owner can select up to 3 primary categories and unlimited subcategories. |
| CAT-005 | Trending Categories | Admin can mark categories as "trending" for homepage display. |

---

### 2.7 Booking Flow
**Priority:** P0  
**Description:** Core conversion flow for scheduling appointments.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BOOK-001 | Service Selection | User selects service(s) from business menu. Multi-service booking supported. |
| BOOK-002 | Professional Selection | User selects preferred professional or "No preference" (any available). |
| BOOK-003 | Date & Time Selection | Calendar view showing available dates. Time slots displayed for selected date. Real-time availability. |
| BOOK-004 | Slot Selection | Tap slot to select. Visual confirmation of selected slot. |
| BOOK-005 | Guest Information | Pre-filled for authenticated users. Guest checkout collects: name, phone, email. |
| BOOK-006 | Special Requests | Optional text field (max 500 chars) for user notes to business. |
| BOOK-007 | Booking Summary | Review page showing: business, services, professional, date/time, total price, duration. |
| BOOK-008 | Terms Acceptance | Checkbox for cancellation policy and terms. Required to proceed. |
| BOOK-009 | Confirmation | Post-booking: confirmation screen with booking reference, add-to-calendar CTA, share options. |
| BOOK-010 | Booking Limits | Prevent double-booking via optimistic locking. 5-minute hold on slot during checkout. |

---

### 2.8 Appointment Management
**Priority:** P0  
**Description:** Users can view and manage their bookings.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| APPT-001 | Upcoming Appointments | List view with: business name, service, date/time, status. Sorted by date ascending. |
| APPT-002 | Appointment Detail | Full details: QR code for check-in, directions link, contact business modal, cancel/reschedule buttons. |
| APPT-003 | Reschedule | User can reschedule to another available slot up to 2 hours before appointment. Old slot released, new slot held. |
| APPT-004 | Cancellation | User can cancel with reason selection. Cancellation policy enforced (e.g., free if >24h). |
| APPT-005 | Past Appointments | History view with option to rebook same service. |
| APPT-006 | No-Show Handling | Auto-mark no-show if user doesn't check in within 15 min of start time. |
| APPT-007 | Rebooking | One-tap rebook from past appointment details. |

---

### 2.9 Favorites
**Priority:** P1  
**Description:** Users can save and quickly access preferred businesses.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FAV-001 | Add/Remove Favorite | Heart icon toggle on business card and detail page. Immediate visual feedback. |
| FAV-002 | Favorites List | Dedicated page/tab showing all favorited businesses. Sortable by name, date added, or distance. |
| FAV-003 | Quick Actions | From favorites list: book now, call, get directions, remove. |
| FAV-004 | Sync | Favorites sync across devices for authenticated users. |
| FAV-005 | Notifications | Option to receive notifications for deals or availability from favorited businesses. |

---

### 2.10 User Profile
**Priority:** P1  
**Description:** Personal account management.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PROF-001 | Profile Info | Editable: first/last name, email, phone, profile photo (max 5MB, cropped to circle). |
| PROF-002 | Address Book | Multiple saved addresses with label (Home, Work, Other). Default for map search. |
| PROF-003 | Payment Methods | View, add, delete saved cards. PCI-compliant via Stripe; no raw card data stored. |
| PROF-004 | Notification Preferences | Toggle: email, SMS, push for: bookings, promotions, reminders. |
| PROF-005 | Privacy Settings | Control data sharing, download data (GDPR), delete account. |
| PROF-006 | Booking Preferences | Default professional preference, reminder lead time (15min/1hr/24hr). |

---

### 2.11 Availability & Slot Computation
**Priority:** P0  
**Description:** Real-time, accurate availability engine.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SLOT-001 | Business Hours Definition | Business owner sets: weekly recurring hours, breaks, time zone. |
| SLOT-002 | Service Duration Mapping | Each service has fixed or variable duration. Slots computed accordingly. |
| SLOT-003 | Professional Availability | Override business hours per professional (vacation, custom schedule). |
| SLOT-004 | Buffer Time | Configurable buffer between appointments (e.g., 15 min cleanup). |
| SLOT-005 | Real-time Computation | Slot availability computed on-demand considering: existing bookings, holds, business hours, staff availability. Response <300ms. |
| SLOT-006 | Concurrent Bookings | Support for multiple professionals serving simultaneously. |
| SLOT-007 | Blocked Times | Business owner can block specific dates/times (e.g., holidays, training). |
| SLOT-008 | Slot Hold | 5-minute temporary hold during checkout. Released on timeout, cancellation, or successful booking. |

---

### 2.12 Shared Types & Design System
**Priority:** P1  
**Description:** Consistent UI/UX across platforms.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| DS-001 | Component Library | Reusable components: buttons, inputs, cards, modals, calendars, time pickers, skeleton loaders. |
| DS-002 | Color Palette | Primary: #6C5CE7 (purple), Secondary: #00B894 (green). Semantic colors for states. |
| DS-003 | Typography | Inter font family. Scale: 12px (caption) to 32px (H1). |
| DS-004 | Spacing System | 4px base grid. Standardized margins/paddings. |
| DS-005 | Shared Types | TypeScript interfaces for: User, Business, Service, Appointment, Slot, Review, Payment. Published to shared package. |
| DS-006 | Accessibility | WCAG 2.1 AA compliance: color contrast ≥4.5:1, screen reader support, keyboard navigation, focus indicators. |
| DS-007 | Dark Mode | System-aware and manual toggle. All components support light/dark themes. |

---

### 2.13 Reviews & Ratings
**Priority:** P1  
**Description:** Social proof and quality feedback loop.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REV-001 | Post-Review | User can review after completed appointment. 1-5 star rating + text (10-1000 chars) + optional photo (max 5). |
| REV-002 | Review Moderation | Auto-flag reviews with profanity. Admin review queue for reported content. |
| REV-003 | Business Response | Business owner can reply to reviews. Reply is public and editable. |
| REV-004 | Review Display | Sort by: most recent, most helpful, highest/lowest rating. Paginated (10 per page). |
| REV-005 | Helpful Votes | Users can mark reviews as helpful. Sort option for "most helpful". |
| REV-006 | Review Analytics | Business owner sees: average rating trend, review volume, sentiment analysis keywords. |

---

### 2.14 Payment Integration
**Priority:** P0  
**Description:** Secure, flexible payment processing.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PAY-001 | Payment Methods | Credit/Debit cards (Stripe), Apple Pay, Google Pay. Saved payment methods for repeat use. |
| PAY-002 | Payment Flow | Stripe Payment Intents. 3D Secure for applicable cards. |
| PAY-003 | Deposits & Full Payment | Business-configurable: no payment, deposit (percentage or fixed), or full payment at booking. |
| PAY-004 | Cancellation Refunds | Automatic refund per cancellation policy. Partial refund for deposits. |
| PAY-005 | Receipts | Email receipt post-payment. In-app receipt view with download PDF. |
| PAY-006 | Failed Payment Handling | Retry logic, user notification, booking hold extension if payment fails. |
| PAY-007 | Payouts | Stripe Connect for business owner payouts. Dashboard shows: pending, available, paid out. |

---

### 2.15 Notifications
**Priority:** P1  
**Description:** Multi-channel user engagement.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| NOTIF-001 | Push Notifications | Expo Push for mobile, Firebase for web. Opt-in on first relevant action. |
| NOTIF-002 | Email Notifications | SendGrid integration. Templates: booking confirmation, reminder (24h, 1h), cancellation, review request. |
| NOTIF-003 | SMS Notifications | Twilio for: booking confirmation, day-of reminder, OTP. |
| NOTIF-004 | Notification Center | In-app inbox with unread badge. Categories: bookings, promotions, system. |
| NOTIF-005 | Preference Management | Granular controls per channel and notification type. |
| NOTIF-006 | Quiet Hours | Respect user's timezone; no push/SMS between 10 PM - 8 AM unless emergency. |

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0  
**Description:** Dedicated interface for business management.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PORT-001 | Dashboard Overview | KPIs: today's appointments, revenue this week, new reviews, occupancy rate. |
| PORT-002 | Appointment Calendar | Day/week/month views. Color-coded by status. Drag-to-reschedule. |
| PORT-003 | Client Management | Client list with visit history, notes, contact info. Search and filter. |
| PORT-004 | Service Management | CRUD services: name, category, duration, price, description, photo, active/inactive. |
| PORT-005 | Staff Management | Add professionals, set their services, schedules, and permissions. |
| PORT-006 | Availability Settings | Set hours, breaks, time off, buffer times. Bulk edit for recurring patterns. |
| PORT-007 | Booking Rules | Set: lead time (e.g., 2 hours ahead), max advance booking, cancellation policy. |
| PORT-008 | Business Profile | Edit: name, description, photos, address, contact, social links, amenities. |
| PORT-009 | Analytics | Reports: revenue, bookings by service, client retention, no-show rate. Export to CSV. |

---

### 2.17 Admin Dashboard
**Priority:** P1  
**Description:** Platform administration and oversight.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| ADMIN-001 | User Management | Search, view, suspend, delete users. Filter by role, status, date joined. |
| ADMIN-002 | Business Approval | Review and approve new business registrations. KYC document upload. |
| ADMIN-003 | Content Moderation | Review flagged reviews, photos, business listings. Approve/reject with reason. |
| ADMIN-004 | Financial Overview | Platform-wide: GMV, transaction volume, revenue share, refunds. |
| ADMIN-005 | Dispute Resolution | View and resolve customer-business disputes. Refund issuance capability. |
| ADMIN-006 | System Health | Monitor: API latency, error rates, queue depth, database performance. |
| ADMIN-007 | Promotions | Create and manage platform-wide or targeted promo codes. |

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P1  
**Description:** Asynchronous task processing for reliability and performance.

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| JOB-001 | Queue Infrastructure | BullMQ with Redis. Separate queues per job type. |
| JOB-002 | Email Sending | Queue: `emails`. Retry 3x with exponential backoff. Dead letter queue after failures. |
| JOB-003 | SMS Sending | Queue: `sms`. Similar retry logic. Rate limiting per provider. |
| JOB-004 | Push Notifications | Queue: `push`. Batch processing for marketing pushes. |
| JOB-005 | Slot Hold Expiration | Queue: `slot-expiry`. Release held slots after 5 minutes. Idempotent execution. |
| JOB-006 | Reminder Dispatch | Queue: `reminders`. Scheduled 24h and 1h before appointments. Cron-triggered. |
| JOB-007 | Review Request | Queue: `review-requests`. Sent 2 hours after appointment completion. |
| JOB-008 | Analytics Aggregation | Queue: `analytics`. Nightly rollup of KPIs. |
| JOB-009 | Failed Payment Retry | Queue: `payment-retries`. Retry failed payments with user notification. |
| JOB-010 | Job Monitoring | Bull Board or similar UI for queue monitoring. Alert on queue depth > threshold. |

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | Page load < 2s (Lighthouse score ≥ 90). API response < 300ms (p95). |
| **Scalability** | Support 10,000 concurrent users. Horizontal scaling via Kubernetes. |
| **Security** | OWASP Top 10 mitigation. HTTPS everywhere. Secrets in Vault. |
| **Privacy** | GDPR/CCPA compliance. Data retention policies. Right to deletion. |
| **Reliability** | 99.9% uptime SLA. Automated backups. Disaster recovery plan. |
| **Monitoring** | Sentry for errors. Datadog/Grafana for metrics. PagerDuty for alerts. |

---

## 4. Prioritization Matrix

| Feature | Priority | Sprint Target | Dependencies |
|---------|----------|-------------|------------|
| User Authentication | P0 | Sprint 1 | — |
| Guest Browse & Explore | P0 | Sprint 1 | — |
| Business Search & Discovery | P0 | Sprint 1 | — |
| Map-based Search | P0 | Sprint 2 | Search |
| Business Detail View | P0 | Sprint 2 | — |
| Service Categories | P0 | Sprint 2 | — |
| Booking Flow | P0 | Sprint 3-4 | Auth, Slots, Payment |
| Appointment Management | P0 | Sprint 4 | Booking Flow |
| Availability & Slot Computation | P0 | Sprint 3 | — |
| Payment Integration | P0 | Sprint 3-4 | Booking Flow |
| User Profile | P1 | Sprint 5 | Auth |
| Favorites | P1 | Sprint 5 | Auth |
| Reviews & Ratings | P1 | Sprint 5 | Appointments |
| Notifications | P1 | Sprint 6 | Appointments, BullMQ |
| Provider Portal | P0 | Sprint 6-7 | Business data |
| Admin Dashboard | P1 | Sprint 8 | All above |
| Background Jobs (BullMQ) | P1 | Sprint 6 | Notifications, Reminders |
| Shared Types & Design System | P1 | Ongoing | All |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 50,000 by Month 6 |
| Booking Conversion Rate | ≥ 15% of app opens |
| Search-to-Book Latency | < 3 minutes average |
| Business Owner Adoption | 1,000 onboarded by Month 6 |
| App Store Rating | ≥ 4.5 stars |
| Customer Support Tickets | < 2% of bookings |
| Payment Success Rate | ≥ 98% |

---

## 6. Open Questions & Assumptions

1. **Geographic Scope:** MVP targets France only; internationalization for Phase 2.
2. **Commission Model:** 10% platform fee on transactions; subject to business validation.
3. **Staff Assignment:** Assume businesses have ≤ 20 professionals; scale architecture if exceeded.
4. **Calendar Sync:** Google/Outlook calendar sync for business owners — Phase 2.
5. **Waitlist:** Notify users of cancellations — Phase 2.

---

*Document Version: 1.0*  
*Last Updated: 2024*  
*Owner: Alex (Product Owner)*
