# Planity Clone — Product Specification

> **Version:** 1.0.0  
> **Last updated:** 2024-06-15  
> **Author:** Alex (Product Owner)  
> **Status:** Draft → Ready for Development

---

## 1. Overview

### 1.1 Product Vision
Build a scalable, mobile-first appointment booking platform that connects consumers with local beauty, wellness, and health service providers. The platform serves three primary user segments: **Consumers** (booking appointments), **Business Owners** (managing their presence and availability), and **Admins** (platform governance).

### 1.2 Target Users
- **Consumers (B2C):** Individuals aged 18-55 seeking convenient online booking for personal services
- **Business Owners (B2B):** Salons, barbershops, spas, clinics, and independent professionals
- **Platform Admins:** Internal operations team managing the marketplace

### 1.3 Success Metrics
- Booking conversion rate ≥ 15%
- Search-to-book latency < 3 seconds
- Business owner onboarding completion ≥ 70%
- App store rating ≥ 4.5 stars

---

## 2. Feature Specifications

---

### 2.1 User Authentication
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a user, I want to create an account and log in securely so that I can book appointments and manage my profile.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| AUTH-001 | Email/password registration with validation | P0 |
| AUTH-002 | Login with email/password | P0 |
| AUTH-003 | OAuth 2.0 social login (Google, Apple, Facebook) | P0 |
| AUTH-004 | JWT access token + refresh token mechanism | P0 |
| AUTH-005 | Password reset via email | P0 |
| AUTH-006 | Email verification on registration | P1 |
| AUTH-007 | Biometric login (Face ID / Touch ID) | P2 |
| AUTH-008 | Account deletion (GDPR compliance) | P1 |

#### Acceptance Criteria
- [ ] User can register with valid email, password (min 8 chars, 1 uppercase, 1 number, 1 special char)
- [ ] System rejects duplicate email registrations with clear error message
- [ ] OAuth flows redirect correctly on both iOS and Android
- [ ] Access token expires in 15 minutes; refresh token expires in 7 days
- [ ] Refresh token rotation implemented for security
- [ ] Password reset email delivers within 5 minutes with secure token (expires in 1 hour)
- [ ] Unverified users cannot book appointments (soft block with resend option)
- [ ] Account deletion anonymizes personal data within 30 days per GDPR

#### Technical Notes
- Use `bcrypt` for password hashing (cost factor 12)
- Store refresh tokens hashed in database
- Rate limit login attempts: 5 per minute per IP

---

### 2.2 Guest Browse & Explore
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a guest user, I want to browse businesses and services without creating an account so that I can explore before committing.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| GUEST-001 | View featured businesses on home screen | P0 |
| GUEST-002 | Browse service categories | P0 |
| GUEST-003 | Search businesses by name/location | P0 |
| GUEST-004 | View business detail page (read-only) | P0 |
| GUEST-005 | View available time slots (without booking) | P0 |
| GUEST-006 | Prompt to login/register at booking initiation | P0 |

#### Acceptance Criteria
- [ ] Guest sees cached featured businesses within 2 seconds of app open
- [ ] Guest can navigate through 3+ screens without authentication prompt
- [ ] Booking button triggers auth modal with option to continue as guest (phone number capture)
- [ ] Guest session data persists for 24 hours (local storage)
- [ ] Converting guest to registered user preserves search history and favorites

---

### 2.3 Business Search & Discovery
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a consumer, I want to find businesses by various criteria so that I can discover the right service provider.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| SEARCH-001 | Full-text search by business name | P0 |
| SEARCH-002 | Filter by service category | P0 |
| SEARCH-003 | Filter by price range | P0 |
| SEARCH-004 | Filter by availability (today, this week, specific date) | P0 |
| SEARCH-005 | Filter by rating (4+, 4.5+) | P1 |
| SEARCH-006 | Filter by distance/radius | P0 |
| SEARCH-007 | Sort by relevance, rating, distance, price | P0 |
| SEARCH-008 | Search history and recent searches | P1 |
| SEARCH-009 | Auto-complete suggestions | P1 |
| SEARCH-010 | "Near me" geolocation search | P0 |

#### Acceptance Criteria
- [ ] Search returns results in < 1 second for 90th percentile queries
- [ ] Empty states provide helpful next steps (broaden filters, change location)
- [ ] Active filters display as removable chips
- [ ] Search URL is shareable with filters encoded
- [ ] Results update in real-time as filters change (no page reload)
- [ ] Geolocation fallback to IP-based city if permission denied
- [ ] Search indexes update within 5 minutes of business data changes

---

### 2.4 Map-based Search
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a consumer, I want to see businesses on a map so that I can choose based on location convenience.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| MAP-001 | Interactive map with business pins | P0 |
| MAP-002 | Cluster pins at zoomed-out levels | P0 |
| MAP-003 | Tap pin to preview business card | P0 |
| MAP-004 | List/map toggle with synchronized results | P0 |
| MAP-005 | Current location indicator | P0 |
| MAP-006 | Directions link to native maps app | P1 |
| MAP-007 | Custom map styling (dark/light mode) | P2 |

#### Acceptance Criteria
- [ ] Map renders with < 100 pins without performance degradation
- [ ] Pin clustering reduces to single cluster at city zoom level
- [ ] Business card preview shows: name, rating, price range, next available slot
- [ ] List and map views show identical result set
- [ ] Map bounds trigger new search query (debounced 300ms)
- [ ] Deep link opens map at specific coordinates with pin selected

---

### 2.5 Business Detail View
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a consumer, I want to see comprehensive business information so that I can make an informed booking decision.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| BIZ-001 | Business name, logo, cover photos | P0 |
| BIZ-002 | Photo gallery (swipeable) | P0 |
| BIZ-003 | Description and business hours | P0 |
| BIZ-004 | Service menu with pricing and duration | P0 |
| BIZ-005 | Staff/professional profiles | P0 |
| BIZ-006 | Aggregate rating and review count | P0 |
| BIZ-007 | Address with map snippet | P0 |
| BIZ-008 | Contact phone and website | P0 |
| BIZ-009 | Social media links | P2 |
| BIZ-010 | COVID-19 safety measures | P2 |
| BIZ-011 | Amenities/parking info | P2 |

#### Acceptance Criteria
- [ ] Cover photo carousel auto-plays with manual override
- [ ] Service menu groups by category with expand/collapse
- [ ] Each service shows: name, description, duration, price, deposit requirement
- [ ] Staff section shows photo, name, specialty, rating
- [ ] "Book Now" CTA is sticky at bottom of viewport
- [ ] Deep link to any business opens correct detail page
- [ ] Offline: cached business data viewable if visited within 7 days

---

### 2.6 Service Categories
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a consumer, I want to browse by service category so that I can find relevant businesses quickly.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| CAT-001 | Hierarchical category structure | P0 |
| CAT-002 | Category icons and descriptions | P0 |
| CAT-003 | Trending/popular categories | P1 |
| CAT-004 | Business can assign multiple categories | P0 |
| CAT-005 | Category-based search filtering | P0 |

#### Acceptance Criteria
- [ ] Top-level categories: Hair, Beauty, Wellness, Health, Fitness, Other
- [ ] Sub-categories: e.g., Hair > Cut, Color, Styling, Treatments
- [ ] Category page shows featured businesses and popular services
- [ ] Business admin can select up to 3 primary categories
- [ ] Category taxonomy is extensible (new categories addable by admin)

---

### 2.7 Booking Flow
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a consumer, I want to book an appointment in a few simple steps so that I can secure my preferred time slot.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| BOOK-001 | Select service(s) | P0 |
| BOOK-002 | Select staff member (or "no preference") | P0 |
| BOOK-003 | Select date and view available slots | P0 |
| BOOK-004 | Select time slot | P0 |
| BOOK-005 | Add-ons/upsells during booking | P1 |
| BOOK-006 | Apply promo code | P1 |
| BOOK-007 | Enter notes/special requests | P0 |
| BOOK-008 | Review booking summary | P0 |
| BOOK-009 | Payment (if required) | P0 |
| BOOK-010 | Receive booking confirmation | P0 |
| BOOK-011 | Add to calendar (iCal/Google Calendar) | P1 |
| BOOK-012 | Guest checkout (phone + email) | P0 |

#### Acceptance Criteria
- [ ] Multi-service booking supported (sequential slots computed)
- [ ] Real-time slot availability prevents double-booking (optimistic locking)
- [ ] Slot selection shows: time, staff name, price
- [ ] Booking holds slot for 10 minutes during payment
- [ ] Confirmation includes: booking reference, QR code, date/time, location, cancellation policy
- [ ] User receives push notification + email + SMS confirmation
- [ ] Failed payment releases hold within 2 minutes
- [ ] Guest checkout captures minimal data; prompts account creation post-booking

---

### 2.8 Appointment Management
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a consumer, I want to view and manage my appointments so that I can stay organized.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| APPT-001 | Upcoming appointments list | P0 |
| APPT-002 | Past appointments history | P0 |
| APPT-003 | Appointment detail view | P0 |
| APPT-004 | Reschedule appointment | P0 |
| APPT-005 | Cancel appointment with reason | P0 |
| APPT-006 | Rebook past appointment | P1 |
| APPT-007 | Add to device calendar | P1 |
| APPT-008 | Share appointment details | P2 |

#### Acceptance Criteria
- [ ] Upcoming appointments sorted by date (nearest first)
- [ ] Each card shows: business name, service, date/time, status
- [ ] Reschedule presents available slots; original slot released immediately
- [ ] Cancellation follows business policy (free until X hours before)
- [ ] Cancelled appointments show in history with "Cancelled" status
- [ ] Push reminder 24 hours and 1 hour before appointment
- [ ] No-show tracking for repeat offenders (business discretion)

---

### 2.9 Favorites
**Priority:** P1 (High)  
**Owner:** Alex  
**Story:** As a consumer, I want to save favorite businesses so that I can book with them again easily.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| FAV-001 | Toggle favorite from business detail | P1 |
| FAV-002 | View favorites list | P1 |
| FAV-003 | Quick rebook from favorite | P1 |
| FAV-004 | Receive notifications from favorites | P2 |
| FAV-005 | Sync favorites across devices | P1 |

#### Acceptance Criteria
- [ ] Heart icon toggles favorite with haptic feedback
- [ ] Favorites list shows business info and next available slot
- [ ] Swipe to remove from favorites
- [ ] Favorites persist for authenticated users (server-side)
- [ ] Guest favorites stored locally; prompt to login on app reinstall

---

### 2.10 User Profile
**Priority:** P1 (High)  
**Owner:** Alex  
**Story:** As a consumer, I want to manage my personal information so that my bookings are accurate.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| PROF-001 | Edit name, phone, email, profile photo | P1 |
| PROF-002 | Manage payment methods | P1 |
| PROF-003 | Notification preferences (push, email, SMS) | P1 |
| PROF-004 | Privacy settings | P1 |
| PROF-005 | Preferred language and currency | P2 |
| PROF-006 | Referral code and credits | P2 |

#### Acceptance Criteria
- [ ] Profile photo upload with crop/resize (max 5MB, JPG/PNG)
- [ ] Payment methods: add, remove, set default (Stripe integration)
- [ ] Notification toggles per channel and event type
- [ ] Data export (GDPR) generates downloadable JSON within 24 hours
- [ ] Profile completion percentage shown with incentives

---

### 2.11 Availability & Slot Computation
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a system, I need to accurately compute available time slots so that double-bookings are prevented.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| SLOT-001 | Define business hours per day | P0 |
| SLOT-002 | Define staff working hours and breaks | P0 |
| SLOT-003 | Service duration and buffer time | P0 |
| SLOT-004 | Block out times (holidays, vacation) | P0 |
| SLOT-005 | Recurring vs one-time exceptions | P0 |
| SLOT-006 | Slot computation considers staff availability | P0 |
| SLOT-007 | Slot computation considers room/resource availability | P1 |
| SLOT-008 | Overbooking protection | P0 |
| SLOT-009 | Waitlist for fully booked days | P2 |

#### Acceptance Criteria
- [ ] Slots computed in real-time with < 500ms response
- [ ] Buffer time configurable per service (default 0, 15, 30 min)
- [ ] Staff lunch breaks block slots automatically
- [ ] Booking across staff lunch break is prevented
- [ ] Concurrent requests handled with database row-level locking
- [ ] Slot cache invalidates on any schedule change
- [ ] Edge case: 2-hour service starting at 3pm with 5pm closing → not offered

---

### 2.12 Shared Types & Design System
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a development team, we need consistent UI components and type definitions for maintainability.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| DS-001 | Color palette (primary, secondary, semantic) | P0 |
| DS-002 | Typography scale | P0 |
| DS-003 | Spacing and layout grid | P0 |
| DS-004 | Component library (buttons, inputs, cards, modals) | P0 |
| DS-005 | Icon set | P0 |
| DS-006 | Animation and transition standards | P1 |
| DS-007 | Dark mode support | P1 |
| DS-008 | Accessibility (WCAG 2.1 AA) | P0 |
| DS-009 | Shared TypeScript types across frontend/backend | P0 |

#### Acceptance Criteria
- [ ] All UI components documented in Storybook
- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] Touch targets minimum 44x44dp/pt
- [ ] Screen reader labels on all interactive elements
- [ ] Type definitions shared via monorepo package (`@planity/types`)
- [ ] Design tokens in JSON format for cross-platform use

---

### 2.13 Reviews & Ratings
**Priority:** P1 (High)  
**Owner:** Alex  
**Story:** As a consumer, I want to read and write reviews so that I can share and benefit from others' experiences.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| REV-001 | Rate 1-5 stars | P1 |
| REV-002 | Write text review | P1 |
| REV-003 | Upload photos with review | P2 |
| REV-004 | Mark review as helpful | P2 |
| REV-005 | Business owner response | P1 |
| REV-006 | Review moderation | P1 |
| REV-007 | Verified booking badge on reviews | P1 |

#### Acceptance Criteria
- [ ] Only verified customers (completed appointment) can leave review
- [ ] Review window: 7 days after appointment
- [ ] Reviews appear after admin moderation or auto-approve if no flags
- [ ] Business owner notified of new review within 1 hour
- [ ] Inappropriate content auto-flagged by keyword filter
- [ ] Average rating recalculates in real-time

---

### 2.14 Payment Integration
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a consumer, I want to pay securely for my bookings so that my appointment is confirmed.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| PAY-001 | Credit/debit card payments | P0 |
| PAY-002 | Apple Pay / Google Pay | P0 |
| PAY-003 | Save payment methods for future use | P0 |
| PAY-004 | Pay deposit vs full amount | P1 |
| PAY-005 | Refund processing | P0 |
| PAY-006 | Invoice/receipt generation | P1 |
| PAY-007 | Tip during payment | P2 |
| PAY-008 | Promo code and gift card redemption | P2 |

#### Acceptance Criteria
- [ ] PCI DSS compliant (Stripe Elements / native SDKs)
- [ ] 3D Secure authentication for applicable cards
- [ ] Payment intent created server-side; client confirms
- [ ] Webhook handling for: payment success, failure, dispute, refund
- [ ] Receipt emailed within 5 minutes of successful payment
- [ ] Failed payment shows clear error with retry option
- [ ] Refund policy: full refund if cancelled > 24h before; 50% if 4-24h; no refund < 4h

---

### 2.15 Notifications
**Priority:** P1 (High)  
**Owner:** Alex  
**Story:** As a user, I want to receive timely notifications so that I don't miss my appointments.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| NOTIF-001 | Push notifications (iOS APNs, Android FCM) | P1 |
| NOTIF-002 | Email notifications | P1 |
| NOTIF-003 | SMS notifications | P1 |
| NOTIF-004 | Notification preferences per channel | P1 |
| NOTIF-005 | Booking confirmations | P1 |
| NOTIF-006 | Reminders (24h, 1h before) | P1 |
| NOTIF-007 | Cancellation notices | P1 |
| NOTIF-008 | Promotional notifications (opt-in) | P2 |
| NOTIF-009 | Rich push with deep links | P2 |

#### Acceptance Criteria
- [ ] Push notification delivery rate > 95%
- [ ] Fallback to SMS if push not delivered within 5 minutes (critical notifications)
- [ ] User can mute non-critical notifications per time window
- [ ] Notification history viewable in app
- [ ] Deep links open relevant screen directly
- [ ] Unsubscribe link in all emails

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a business owner, I want to manage my business, services, and appointments so that I can operate efficiently.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| BPORT-001 | Business profile management | P0 |
| BPORT-002 | Service menu management (CRUD) | P0 |
| BPORT-003 | Staff/professional management | P0 |
| BPORT-004 | Working hours and availability setup | P0 |
| BPORT-005 | Appointment calendar view | P0 |
| BPORT-006 | Appointment actions (confirm, reschedule, cancel, no-show) | P0 |
| BPORT-007 | Block time off / vacation | P0 |
| BPORT-008 | Client database | P1 |
| BPORT-009 | Revenue dashboard | P1 |
| BPORT-010 | Review management and responses | P1 |
| BPORT-011 | Notification settings | P1 |
| BPORT-012 | Multiple location support | P2 |

#### Acceptance Criteria
- [ ] Calendar views: day, week, month with drag-to-resize appointments
- [ ] Color-coded appointment statuses (confirmed, pending, completed, cancelled)
- [ ] Quick actions from calendar: check-in client, add notes, send message
- [ ] Revenue report: daily, weekly, monthly with export to CSV
- [ ] Client notes and visit history accessible during booking
- [ ] Staff permissions: owner, manager, staff roles with granular access
- [ ] Mobile-responsive web portal (primary) + native app (secondary)

---

### 2.17 Admin Dashboard
**Priority:** P1 (High)  
**Owner:** Alex  
**Story:** As a platform admin, I want to oversee and manage the marketplace so that I can ensure quality and growth.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| ADMIN-001 | Business onboarding and verification | P1 |
| ADMIN-002 | User management (search, view, suspend) | P1 |
| ADMIN-003 | Content moderation (reviews, photos) | P1 |
| ADMIN-004 | Analytics dashboard (KPIs, trends) | P1 |
| ADMIN-005 | Financial reporting and payouts | P1 |
| ADMIN-006 | Promo code and campaign management | P2 |
| ADMIN-007 | System health monitoring | P1 |
| ADMIN-008 | Support ticket management | P2 |

#### Acceptance Criteria
- [ ] Business verification workflow: pending → under review → approved/rejected
- [ ] Suspended accounts trigger automatic booking cancellation with notification
- [ ] Analytics: MAU, booking volume, GMV, churn rate, top categories
- [ ] Payout schedule configurable (weekly/bi-weekly/monthly)
- [ ] Role-based access control (super admin, ops, support)
- [ ] Audit log of all admin actions (immutable, 7-year retention)

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a system, I need reliable background job processing so that user-facing performance remains optimal.

#### Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| JOB-001 | Email sending queue | P0 |
| JOB-002 | SMS sending queue | P0 |
| JOB-003 | Push notification queue | P0 |
| JOB-004 | Payment webhook processing | P0 |
| JOB-005 | Slot cache pre-computation | P0 |
| JOB-006 | Nightly report generation | P1 |
| JOB-007 | Data export jobs | P1 |
| JOB-008 | Image processing (resize, optimize) | P1 |
| JOB-009 | Failed job retry with exponential backoff | P0 |
| JOB-010 | Job monitoring and alerting | P0 |

#### Acceptance Criteria
- [ ] All queues use BullMQ with Redis
- [ ] Job retry: 3 attempts with 5s, 25s, 125s delays
- [ ] Dead letter queue for permanently failed jobs
- [ ] Job progress trackable via dashboard (Bull Board)
- [ ] Critical jobs (payments, notifications) have priority over background jobs
- [ ] Job concurrency configurable per queue type
- [ ] Alert if queue depth > 1000 or oldest job > 5 minutes

---

## 3. Non-Functional Requirements

### 3.1 Performance
- API response time: p95 < 200ms
- App cold start: < 2 seconds
- Image loading: progressive, < 1s for thumbnail

### 3.2 Security
- OWASP Top 10 compliance
- End-to-end encryption for sensitive data
- Regular dependency scanning (Snyk)
- Penetration testing annually

### 3.3 Scalability
- Support 10,000 concurrent users initially
- Horizontal scaling via container orchestration
- Database read replicas for search queries

### 3.4 Compliance
- GDPR (EU users)
- CCPA (California users)
- PCI DSS (payment data)

---

## 4. Release Phases

| Phase | Features | Timeline |
|---|---|---|
| **MVP** | Auth, Guest Browse, Search, Business Detail, Booking, Appointments, Payments, Notifications, Business Portal | Month 1-3 |
| **V1.1** | Map Search, Favorites, Reviews, User Profile | Month 4 |
| **V1.2** | Admin Dashboard, Analytics, Promo Codes | Month 5 |
| **V2.0** | Multi-location, Waitlist, Subscriptions, Mobile Business App | Month 6+ |

---

## 5. Appendix

### 5.1 Glossary
- **GMV:** Gross Merchandise Value
- **GDPR:** General Data Protection Regulation
- **PCI DSS:** Payment Card Industry Data Security Standard

### 5.2 Related Documents
- `docs/architecture.md` — System architecture
- `docs/api-spec.md` — API specifications
- `docs/design-system.md` — Design system documentation

---

*End of Product Specification*