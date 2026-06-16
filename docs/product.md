# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Platform:** Web (responsive), iOS, Android  
**Target Audience:** Consumers seeking beauty & wellness appointments; business owners managing salons, spas, and clinics.  
**Business Goal:** Build a scalable, multi-tenant booking platform connecting customers with local beauty & wellness businesses.

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 — Critical  
**Description:** Secure identity management for customers and business owners.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| AUTH-001 | Email & password registration | User can register with email, password, first name, last name; validation rules enforced; confirmation email sent | P0 |
| AUTH-002 | Email & password login | User can log in with valid credentials; JWT access + refresh tokens returned; 401 on invalid credentials | P0 |
| AUTH-003 | OAuth 2.0 social login | Google and Apple OAuth supported; account linking if email already exists | P0 |
 onboarding flow | Post-registration onboarding with phone verification (OTP via SMS) | P1 |
| AUTH-005 | Password reset | User can request password reset via email; secure token with 1-hour expiry | P0 |
| AUTH-006 | Token refresh | Silent refresh of access token using refresh token; rotation policy implemented | P0 |
| AUTH-007 | Account lockout | 5 failed attempts triggers 30-minute lockout; email notification sent | P1 |
| AUTH-008 | Biometric login (mobile) | Face ID / Touch ID supported on iOS and Android after initial setup | P2 |

---

### 2.2 Guest Browse & Explore
**Priority:** P0 — Critical  
**Description:** Allow unauthenticated users to browse businesses and services to reduce friction.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| GUEST-001 | Browse businesses without login | Guest can view business listings, search, and filter without authentication | P0 |
| GUEST-002 | View business details | Guest can access business profile, services, prices, reviews, and availability | P0 |
| GUEST-003 | View map search | Guest can use map-based search without login | P0 |
| GUEST-004 | Booking prompt at checkout | Guest is prompted to log in or register when attempting to book; pre-filled data retained | P0 |
| GUEST-005 | Guest booking with phone | Guest can complete booking with phone number + email; account auto-created on confirmation | P1 |

---

### 2.3 Business Search & Discovery
**Priority:** P0 — Critical  
**Description:** Powerful search and filtering to help users find the right business.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| SEARCH-001 | Text search | Full-text search across business name, service name, and description; typo tolerance; relevance scoring | P0 |
| SEARCH-002 | Category filter | Filter by service category (hair, nails, spa, massage, etc.) | P0 |
| SEARCH-003 | Location filter | Filter by city, postal code, or current location with radius (5km, 10km, 25km, 50km) | P0 |
| SEARCH-004 | Price range filter | Filter services by min/max price | P0 |
| SEARCH-005 | Rating filter | Filter by minimum rating (1-5 stars) | P0 |
| SEARCH-006 | Availability filter | "Show only businesses with availability today/this week" | P1 |
| SEARCH-007 | Sort options | Sort by relevance, distance, rating, price (low-high, high-low), availability | P0 |
| SEARCH-008 | Auto-complete suggestions | Search bar provides suggestions after 3 characters; recent searches stored locally | P0 |
| SEARCH-009 | Search history | Logged-in users see recent searches; can clear individual or all history | P1 |
| SEARCH-010 | Promoted / sponsored listings | Businesses can pay for boosted placement; clearly labeled "Sponsored" | P2 |

---

### 2.4 Map-based Search
**Priority:** P0 — Critical  
**Description:** Visual discovery of businesses on an interactive map.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| MAP-001 | Interactive map display | Google Maps or Mapbox integration; custom business pins; cluster markers for dense areas | P0 |
| MAP-002 | Current location | Button to center map on user's GPS location; permission handling | P0 |
| MAP-003 | Business pins | Tapping pin shows business card preview with name, rating, price range, next availability | P0 |
| MAP-004 | List/map toggle | User can switch between list view and map view; state preserved per session | P0 |
| MAP-005 | Boundary search | Map auto-queries businesses within visible viewport; updates on pan/zoom with debounce | P0 |
| MAP-006 | Directions | "Get Directions" opens native maps app with business address pre-filled | P1 |
| MAP-007 | Heatmap layer | Optional heatmap showing popular booking areas (admin-configurable) | P3 |

---

### 2.5 Business Detail View
**Priority:** P0 — Critical  
**Description:** Comprehensive business profile page.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| BIZ-001 | Header info | Business name, logo, cover image, average rating, review count, verified badge | P0 |
| BIZ-002 | Photo gallery | Swipeable image gallery; minimum 1, maximum 20 images; lightbox view | P0 |
| BIZ-003 | Description & amenities | Business description, opening hours, amenities (WiFi, parking, wheelchair access, etc.) | P0 |
| BIZ-004 | Service menu | Categorized list of services with name, duration, description, price; expandable details | P0 |
| BIZ-005 | Staff profiles | List of service providers with photo, name, bio, specialties, average rating | P1 |
| BIZ-006 | Reviews summary | Aggregate rating breakdown (5-star distribution); total review count | P0 |
| BIZ-007 | Contact & location | Full address with copy-to-clipboard; phone number with tap-to-call; messaging option | P0 |
| BIZ-008 | Share business | Native share sheet / copy link / QR code generation | P1 |
| BIZ-009 | Report business | Flag for inappropriate content; admin notification triggered | P2 |

---

### 2.6 Service Categories
**Priority:** P0 — Critical  
**Description:** Hierarchical categorization of beauty & wellness services.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| CAT-001 | Category hierarchy | 2-level hierarchy: Parent (e.g., Hair) → Child (e.g., Haircut, Coloring, Styling) | P0 |
| CAT-002 | Category icons | Each category has associated icon and color for visual identification | P0 |
| CAT-003 | Category landing pages | SEO-optimized pages for each category with featured businesses | P1 |
| CAT-004 | Trending categories | Dynamic "Trending" section based on booking volume in user's area | P1 |
| CAT-005 | Category management (admin) | CRUD operations for categories; drag-and-drop ordering | P0 |
| CAT-006 | Business category assignment | Business can select up to 5 categories; primary category highlighted | P0 |

**Initial Category Set:**
- Hair (Cut, Coloring, Styling, Treatments)
- Nails (Manicure, Pedicure, Nail Art, Extensions)
- Face (Facials, Makeup, Eyebrows, Lashes)
- Body (Massage, Hair Removal, Body Treatments)
- Wellness (Spa, Sauna, Yoga, Meditation)
- Medical Aesthetic (Injectables, Laser, Peels)

---

### 2.7 Booking Flow
**Priority:** P0 — Critical  
**Description:** Seamless appointment scheduling from selection to confirmation.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| BOOK-001 | Service selection | User selects service from business menu; sees duration and price | P0 |
| BOOK-002 | Staff selection (optional) | User can select preferred provider or "No preference" | P0 |
| BOOK-003 | Date & time selection | Calendar view with available slots; slots computed in real-time; timezone handling | P0 |
| BOOK-004 | Guest information | Pre-filled for logged-in users; name, phone, email collected for guests | P0 |
| BOOK-005 | Special requests | Optional text field for notes (allergies, preferences) | P1 |
| BOOK-006 | Add-ons / upsells | Optional add-on services presented during flow (e.g., deep conditioning with haircut) | P2 |
| BOOK-007 | Deposit / payment | Full payment or deposit collected at booking based on business settings | P0 |
| BOOK-008 | Booking confirmation | Immediate confirmation screen; booking reference number; calendar invite (.ics) | P0 |
| BOOK-009 | Cancellation policy | Clear display of cancellation terms before final confirmation | P0 |
| BOOK-010 | Waitlist | Option to join waitlist if no slots available; notification when slot opens | P2 |
| BOOK-011 | Group booking | Book multiple services or multiple people in single transaction | P2 |
| BOOK-012 | Recurring booking | Option to book recurring appointments (weekly, bi-weekly, monthly) | P3 |

---

### 2.8 Appointment Management
**Priority:** P0 — Critical  
**Description:** Users can view and manage their bookings.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| APPT-001 | Upcoming appointments list | Chronological list with business name, service, date/time, status; pull-to-refresh | P0 |
| APPT-002 | Appointment detail | Full details: QR code for check-in, directions, contact, cancel/reschedule buttons | P0 |
| APPT-003 | Reschedule | User can select new slot if within business cancellation policy; old slot released | P0 |
| APPT-004 | Cancel | Cancel with reason selection; refund processed per cancellation policy; notification to business | P0 |
| APPT-005 | Rebook | One-tap rebook previous appointment with same service/provider | P1 |
| APPT-006 | Appointment history | Past appointments with option to leave review (within 7 days) | P0 |
| APPT-007 | No-show handling | Marked no-show after 15 min grace period; affects future booking privileges | P1 |
| APPT-008 | Calendar sync | Export to Google Calendar, Apple Calendar, Outlook | P1 |

---

### 2.9 Favorites
**Priority:** P1 — High  
**Description:** Users can save and quickly access preferred businesses.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| FAV-001 | Add to favorites | Heart icon on business card and detail page; haptic feedback on mobile | P1 |
| FAV-002 | Favorites list | Grid/list view of saved businesses; sorted by most recently favorited | P1 |
| FAV-003 | Quick rebook | "Book Again" button from favorites list for businesses with past bookings | P1 |
| FAV-004 | Favorites sync | Synchronized across devices for logged-in users | P1 |
| FAV-005 | Availability indicator | Green dot on favorites showing real-time availability today | P2 |

---

### 2.10 User Profile
**Priority:** P0 — Critical  
**Description:** Customer account management and preferences.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| PROF-001 | Profile info | Editable: name, email, phone, profile photo, date of birth (optional) | P0 |
| PROF-002 | Address book | Multiple saved addresses with label (Home, Work, Other); default selection | P1 |
| PROF-003 | Payment methods | Saved cards via PCI-compliant tokenization (Stripe); default payment method | P0 |
| PROF-004 | Notification preferences | Toggle: email, SMS, push for bookings, promotions, reminders | P0 |
| PROF-005 | Privacy settings | Control data sharing, download data, account deletion (GDPR/CCPA) | P0 |
| PROF-006 | Loyalty / rewards | Points balance, tier status, reward history (if loyalty program active) | P2 |
| PROF-007 | Referral code | Unique referral code with shareable link; track rewards | P2 |

---

### 2.11 Availability & Slot Computation
**Priority:** P0 — Critical  
**Description:** Real-time, accurate availability calculation for booking.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| SLOT-001 | Business hours definition | Business sets weekly schedule with open/close times; multiple shifts supported; holiday exceptions | P0 |
| SLOT-002 | Service duration mapping | Each service has base duration; buffer time between appointments configurable | P0 |
| SLOT-003 | Staff availability | Individual staff schedules; time off / vacation blocking; service-staff competency mapping | P0 |
| SLOT-004 | Real-time slot computation | Slots computed on request considering: business hours, staff availability, existing bookings, buffers | P0 |
| SLOT-005 | Concurrent booking limits | Respect room/equipment constraints for group services | P1 |
| SLOT-006 | Last-minute booking cutoff | Configurable minimum advance time (e.g., no bookings within 2 hours) | P0 |
| SLOT-007 | Slot caching | Redis caching of computed slots with invalidation on booking changes | P0 |
| SLOT-008 | Overbooking protection | Pessimistic locking or atomic operations to prevent double-booking | P0 |
| SLOT-009 | Timezone handling | All times stored in UTC; displayed in business timezone or user timezone with clear indication | P0 |

---

### 2.12 Shared Types & Design System
**Priority:** P0 — Critical  
**Description:** Consistent UI/UX across all platforms.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| DS-001 | Component library | Reusable components: buttons, inputs, cards, modals, date picker, time slot grid | P0 |
| DS-002 | Color system | Primary brand color, semantic colors (success, warning, error, info), neutral grays | P0 |
| DS-003 | Typography | Heading and body font scales; responsive sizing; accessibility (minimum 16px base) | P0 |
| DS-004 | Spacing system | 4px base grid; consistent padding, margin, gap values | P0 |
| DS-005 | Iconography | Consistent icon set (Lucide or similar); semantic naming; 24px touch targets minimum | P0 |
| DS-006 | Accessibility | WCAG 2.1 AA compliance: color contrast, screen reader support, keyboard navigation, focus states | P0 |
| DS-007 | Dark mode | System-aware and manual toggle; persistent preference | P1 |
| DS-008 | Animation | Consistent transitions: 200ms ease-in-out; reduced motion respect | P1 |
| DS-009 | Shared TypeScript types | Monorepo shared package for API types, enums, validation schemas (Zod) | P0 |

---

### 2.13 Reviews & Ratings
**Priority:** P1 — High  
**Description:** Social proof and quality feedback system.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| REV-001 | Post-appointment review | Eligible users (completed appointment) can rate 1-5 stars and write text review | P1 |
| REV-002 | Review components | Star rating, text (max 500 chars), photo upload (max 3), service tagged | P1 |
| REV-003 | Business response | Business owner can respond to reviews publicly | P1 |
| REV-004 | Review moderation | Auto-flag profanity; admin review queue for reported content | P1 |
| REV-005 | Helpful votes | Users can mark reviews as helpful; sort by helpfulness | P2 |
| REV-006 | Review analytics | Business sees average rating trend, review volume, common themes | P2 |
| REV-007 | Verified badge | "Verified Visit" badge for reviews from completed bookings | P1 |

---

### 2.14 Payment Integration
**Priority:** P0 — Critical  
**Description:** Secure, flexible payment processing.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| PAY-001 | Payment methods | Credit/debit cards (Stripe), Apple Pay, Google Pay, PayPal | P0 |
| PAY-002 | Payment intents | Stripe PaymentIntent for 3D Secure / SCA compliance | P0 |
| PAY-003 | Deposits vs. full payment | Business-configurable: deposit amount or full prepayment | P0 |
| PAY-004 | Refunds | Full and partial refunds; automated per cancellation policy; manual override by business | P0 |
| PAY-005 | Payment receipts | Email receipt with transaction details; in-app receipt history | P0 |
| PAY-006 | Failed payment handling | Retry logic; user notification; booking held temporarily during retry | P0 |
| PAY-007 | Payouts to businesses | Stripe Connect for marketplace split; weekly/monthly payout schedule | P0 |
| PAY-008 | Promo codes | Percentage and fixed amount discounts; usage limits; expiration dates | P1 |
| PAY-009 | Gift cards | Purchase and redeem digital gift cards | P3 |

---

### 2.15 Notifications
**Priority:** P1 — High  
**Description:** Multi-channel communication for engagement and operations.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| NOTIF-001 | Push notifications | Firebase Cloud Messaging for iOS/Android; rich notifications with images | P1 |
| NOTIF-002 | Email notifications | SendGrid/Postmark integration; HTML templates; deliverability monitoring | P1 |
| NOTIF-003 | SMS notifications | Twilio integration; OTP, booking confirmations, reminders | P1 |
| NOTIF-004 | Notification types | Booking confirmation, reminder (24h, 1h before), cancellation, rescheduling, promotion | P1 |
| NOTIF-005 | Preference management | Granular opt-in/opt-out per channel and notification type | P1 |
| NOTIF-006 | In-app inbox | Persistent notification history; unread badge; deep linking to relevant screen | P1 |
| NOTIF-007 | Marketing communications | Promotional emails/SMS with unsubscribe; compliance with regulations | P2 |

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 — Critical  
**Description:** Comprehensive tools for business owners to manage their presence and operations.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| BPORT-001 | Business profile management | Edit business info, photos, description, amenities, hours | P0 |
| BPORT-002 | Service menu management | CRUD services: name, description, duration, price, category, staff assignment | P0 |
| BPORT-003 | Staff management | Add/edit staff profiles, set schedules, assign services, manage permissions | P0 |
| BPORT-004 | Availability calendar | Visual calendar view; block time off; set recurring schedules | P0 |
| BPORT-005 | Appointment dashboard | Day/week/month views; filter by staff, status; drag-and-drop rescheduling | P0 |
| BPORT-006 | Customer management | Customer database with visit history, notes, contact info | P1 |
| BPORT-007 | Booking settings | Lead time, cancellation policy, deposit requirements, auto-confirmation | P0 |
| BPORT-008 | Revenue dashboard | Daily/weekly/monthly revenue; payment status; payout history | P1 |
| BPORT-009 | Review management | Respond to reviews; flag inappropriate content | P1 |
| BPORT-010 | Promotions | Create and manage discount codes; set validity and usage limits | P2 |
| BPORT-011 | Multi-location support | Switch between business locations; consolidated reporting | P2 |
| BPORT-012 | Team permissions | Role-based access: Owner, Manager, Staff | P1 |

---

### 2.17 Admin Dashboard
**Priority:** P1 — High  
**Description:** Platform administration and oversight.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| ADMIN-001 | User management | Search, view, suspend, delete user accounts; audit log | P1 |
| ADMIN-002 | Business management | Approve new business registrations; verify documents; suspend/activate businesses | P1 |
| ADMIN-003 | Content moderation | Review queue for reported businesses, reviews, images; take action | P1 |
| ADMIN-004 | Category management | CRUD service categories; reorder; assign icons | P0 |
| ADMIN-005 | Analytics overview | Platform-wide metrics: users, bookings, revenue, growth trends | P1 |
| ADMIN-006 | Financial oversight | Transaction monitoring; dispute handling; payout management | P1 |
| ADMIN-007 | Support tickets | CRM integration; ticket assignment; SLA tracking | P2 |
| ADMIN-008 | System health | Monitor background jobs, error rates, API performance | P1 |
| ADMIN-009 | Feature flags | Toggle features per environment or user segment | P2 |
| ADMIN-010 | Announcements | Broadcast in-app messages to all or targeted users | P2 |

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P0 — Critical  
**Description:** Reliable asynchronous processing for scalability.

| ID | Requirement | Acceptance Criteria | Priority |
|---|---|---|---|
| JOB-001 | Job queue infrastructure | BullMQ with Redis; separate queues by priority and type | P0 |
| JOB-002 | Email sending | Queue all transactional emails; retry with exponential backoff; dead letter queue | P0 |
| JOB-003 | SMS sending | Queue SMS messages; rate limiting; delivery tracking | P0 |
| JOB-004 | Push notifications | Queue push notifications; batch processing; failure handling | P0 |
| JOB-005 | Booking reminders | Scheduled jobs for 24h and 1h pre-appointment reminders | P0 |
| JOB-006 | Payment processing | Async payment capture, refund processing, payout generation | P0 |
| JOB-007 | Slot cache warming | Pre-compute popular time slots; invalidate on schedule changes | P1 |
| JOB-008 | Analytics aggregation | Nightly jobs for dashboard metrics, reporting | P1 |
| JOB-009 | Data exports | Large CSV/Excel generation for business reports; email on completion | P2 |
| JOB-010 | Image processing | Resize and optimize uploaded images; generate thumbnails | P1 |
| JOB-011 | Job monitoring | Dashboard for queue status, job counts, failure rates, retry attempts | P1 |
| JOB-012 | Graceful shutdown | Complete in-progress jobs before process termination | P0 |

---

## 3. Non-Functional Requirements

| Area | Requirement |
|---|---|
| **Performance** | Page load < 2s (Lighthouse score > 90); API response < 200ms (p95); map interaction 60fps |
| **Scalability** | Support 10,000 concurrent users; 1M bookings/month; horizontal scaling ready |
| **Security** | OWASP Top 10 mitigation; encryption at rest and in transit; regular penetration testing |
| **Compliance** | GDPR (EU), CCPA (California), PCI-DSS (payments); data residency options |
| **Reliability** | 99.9% uptime SLA; automated backups; disaster recovery plan |
| **Monitoring** | Sentry for errors; Datadog/Grafana for metrics; PagerDuty for alerts |
| **SEO** | Server-side rendering for public pages; structured data; sitemap generation |

---

## 4. Success Metrics (KPIs)

| Metric | Target |
|---|---|
| Monthly Active Users (MAU) | 50,000 by month 6 |
| Booking Conversion Rate | > 15% (search to completed booking) |
| Guest-to-Registered Conversion | > 30% |
| Business NPS | > 50 |
| Customer NPS | > 60 |
| Average Booking Value | €50 |
| Platform Take Rate | 10-15% commission or subscription |
| App Store Rating | > 4.5 stars |

---

## 5. Release Phases

| Phase | Features | Timeline |
|---|---|---|
| **MVP** | Auth, Guest Browse, Search, Map, Business Detail, Service Categories, Booking Flow, Appointment Mgmt, User Profile, Slot Computation, Payments, Basic Business Portal | Month 1-2 |
| **V1.0** | Favorites, Reviews, Notifications, Full Business Portal, Admin Dashboard | Month 3 |
| **V1.1** | Waitlist, Group Booking, Loyalty, Referrals, Promotions | Month 4 |
| **V1.2** | Recurring Bookings, Gift Cards, Multi-location, Advanced Analytics | Month 5 |

---

## 6. Open Questions

1. Geographic launch strategy — single city vs. multi-city from start?
2. Business acquisition model — self-serve onboarding vs. sales-led?
3. Commission vs. subscription revenue model or hybrid?
4. Third-party calendar integrations (Google Calendar, Outlook) priority?
5. In-app messaging between customer and business — native or third-party?

---

*Document Version: 1.0*  
*Last Updated: 2024*  
*Owner: Alex — Product Owner*
