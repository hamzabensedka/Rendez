# Planity Clone — Product Specification

> **Version:** 1.0.0  
> **Owner:** Alex (Product Owner)  
> **Last Updated:** 2024-06-01  
> **Status:** Draft → Ready for Development

---

## 1. Overview

### 1.1 Product Vision
Build a best-in-class appointment booking platform that connects beauty & wellness professionals with clients. The platform enables seamless discovery, booking, and management of appointments while providing powerful tools for business owners to manage their operations.

### 1.2 Target Users
| Persona | Description | Primary Needs |
|---------|-------------|---------------|
| **Client** | End-user seeking beauty/wellness services | Discover, book, manage appointments easily |
| **Business Owner** | Salon/spa owner or independent professional | Manage bookings, availability, staff, and grow business |
| **Admin** | Platform operator | Monitor platform health, manage users, ensure quality |

### 1.3 Success Metrics
- **Booking Conversion Rate** > 15% (search to confirmed booking)
- **Search-to-Book Time** < 3 minutes
- **Business Owner Retention** > 80% at 6 months
- **App Store Rating** > 4.5 stars

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 — Critical Path  
**Owner:** Backend / Mobile

#### Description
Secure, multi-method authentication supporting clients and business owners with role-based access control.

#### User Stories
- As a new user, I want to register with email/phone so I can create an account quickly.
- As a returning user, I want to log in with biometrics so I don't need to remember my password.
- As a business owner, I want my account verified so clients trust my profile.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| AUTH-001 | Users can register with email + password, phone + OTP, or OAuth (Google/Apple) | P0 |
| AUTH-002 | Passwords must be ≥8 chars with 1 uppercase, 1 number, 1 special character | P0 |
| AUTH-003 | JWT access tokens expire in 15min; refresh tokens valid for 7 days with rotation | P0 |
| AUTH-004 | Refresh tokens stored in httpOnly cookies; sessions tracked in DB for revocation | P0 |
| AUTH-005 | Biometric login (Face ID / Touch ID / Fingerprint) supported on mobile | P1 |
| AUTH-006 | Role-based access: `CLIENT`, `PROVIDER`, `ADMIN` — enforced at API gateway | P0 |
| AUTH-007 | Email verification required before booking; SMS optional for 2FA | P1 |
| AUTH-008 | "Forgot Password" flow with secure token (1-hour expiry) sent via email | P0 |
| AUTH-009 | Account deletion (GDPR right to erasure) with 30-day grace period | P1 |
| AUTH-010 | Rate limiting: 5 login attempts per IP per 15 minutes | P0 |

#### Technical Notes
- Use NestJS Passport with JWT strategy
- Store passwords with bcrypt (cost factor 12)
- Implement token blacklist for logout/revocation

---

### 2.2 Guest Browse & Explore
**Priority:** P0 — Critical Path  
**Owner:** Mobile / Frontend

#### Description
Allow unauthenticated users to browse businesses, view services, and search without creating an account. Conversion hook at booking initiation.

#### User Stories
- As a guest, I want to browse nearby salons so I can see what's available before committing.
- As a guest, I want to view business details and prices so I can compare options.
- As a guest, I want to be prompted to sign up when I try to book so the flow is seamless.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| GUEST-001 | Full search and discovery features available without login | P0 |
| GUEST-002 | Business detail pages accessible with all public info visible | P0 |
| GUEST-003 | "Book" CTA triggers auth modal with pre-filled booking intent | P0 |
| GUEST-004 | Guest session persisted locally; merges with account upon registration | P1 |
| GUEST-005 | Guest favorites stored locally; sync to cloud after login | P1 |
| GUEST-006 | No access to appointment management, reviews, or payment methods | P0 |

---

### 2.3 Business Search & Discovery
**Priority:** P0 — Critical Path  
**Owner:** Full Stack

#### Description
Powerful, fast search enabling clients to find businesses by location, service, availability, rating, and price.

#### User Stories
- As a client, I want to search "haircut near me" and see relevant results instantly.
- As a client, I want to filter by price range, rating, and availability so I find the right fit.
- As a client, I want to see businesses that are open now so I don't waste time.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| SEARCH-001 | Full-text search across business name, service names, and descriptions | P0 |
| SEARCH-002 | Location-based search with configurable radius (default 5km, max 50km) | P0 |
| SEARCH-003 | Filters: service category, price range, rating (≥ stars), open now, accepts online booking | P0 |
| SEARCH-004 | Sort options: relevance, distance, rating, price (low/high), availability (next slot) | P0 |
| SEARCH-005 | Search results return in < 500ms for first 20 results | P0 |
| SEARCH-006 | Pagination with cursor-based infinite scroll | P0 |
| SEARCH-007 | Recent searches stored locally (last 10) | P1 |
| SEARCH-008 | Search suggestions / autocomplete with typo tolerance | P1 |
| SEARCH-009 | PostgreSQL trigram + PostGIS for text and geo queries | P0 |

---

### 2.4 Map-based Search
**Priority:** P0 — Critical Path  
**Owner:** Mobile / Frontend

#### Description
Interactive map view showing business locations with clustering, allowing spatial exploration and selection.

#### User Stories
- As a client, I want to see businesses on a map so I choose one that's convenient.
- As a client, I want to pan/zoom the map and see results update dynamically.
- As a client, I want to tap a pin to see quick info and navigate to details.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| MAP-001 | Map displays business pins with category-based color coding | P0 |
| MAP-002 | Pin clustering for dense areas (zoom-dependent) | P0 |
| MAP-003 | Viewport query: fetch businesses visible in current map bounds | P0 |
| MAP-004 | User location dot with accuracy radius | P0 |
| MAP-005 | Tap pin → bottom sheet with business name, rating, price range, photo | P0 |
| MAP-006 | "Re-center on me" button; handle location permission gracefully | P0 |
| MAP-007 | Map and list views toggleable; state synchronized | P0 |
| MAP-008 | PostGIS viewport query with spatial index for performance | P0 |

---

### 2.5 Business Detail View
**Priority:** P0 — Critical Path  
**Owner:** Full Stack

#### Description
Comprehensive business profile showcasing services, photos, reviews, availability, and booking options.

#### User Stories
- As a client, I want to see photos of the salon so I know what to expect.
- As a client, I want to see all services with prices and durations so I can decide.
- As a client, I want to see real reviews so I can trust the business.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| BIZ-001 | Hero image gallery (swipeable, up to 10 images) | P0 |
| BIZ-002 | Business name, category, rating, review count, address, phone, hours | P0 |
| BIZ-003 | Service list with name, description, duration, price | P0 |
| BIZ-004 | "Book Now" CTA per service; sticky bottom bar with primary action | P0 |
| BIZ-005 | Reviews section: sort by newest/most helpful; paginated | P0 |
| BIZ-006 | "About" section with description, amenities, languages spoken | P1 |
| BIZ-007 | Share business (deep link / native share sheet) | P1 |
| BIZ-008 | "Add to Favorites" heart icon with haptic feedback | P0 |
| BIZ-009 | Deep linking support: `/business/:id` opens app or web | P0 |

---

### 2.6 Service Categories
**Priority:** P0 — Critical Path  
**Owner:** Backend / Frontend

#### Description
Hierarchical categorization of services for discovery, filtering, and business organization.

#### User Stories
- As a client, I want to browse by category (e.g., Hair, Nails, Massage) so I find what I need.
- As a business owner, I want to assign categories to my services so clients find me.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| CAT-001 | Hierarchical categories: 5 top-level, 20+ subcategories | P0 |
| CAT-002 | Category icons and colors in design system | P0 |
| CAT-003 | Business can have multiple categories; services belong to one | P0 |
| CAT-004 | Category filter in search with multi-select | P0 |
| CAT-005 | Trending/popular categories surfaced on home screen | P1 |
| CAT-006 | Admin-managed category taxonomy; not user-editable | P0 |

**Categories (v1):**
- Hair (Cut, Color, Styling, Treatment)
- Nails (Manicure, Pedicure, Nail Art)
- Face (Facial, Makeup, Eyebrows, Lashes)
- Body (Massage, Waxing, Tanning, Spa)
- Wellness (Yoga, Pilates, Coaching)

---

### 2.7 Booking Flow
**Priority:** P0 — Critical Path  
**Owner:** Full Stack

#### Description
Seamless, guided flow for selecting service, provider, time slot, and confirming appointment.

#### User Stories
- As a client, I want to book an appointment in under 3 taps so it's effortless.
- As a client, I want to see real-time availability so I don't book conflicts.
- As a client, I want to add notes to my booking so the provider knows my preferences.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| BOOK-001 | Step 1: Select service (or multiple services for package) | P0 |
| BOOK-002 | Step 2: Select staff member or "no preference" | P0 |
| BOOK-003 | Step 3: Select date → view available slots; slot computation in real-time | P0 |
| BOOK-004 | Step 4: Review booking summary with price, duration, location | P0 |
| BOOK-005 | Step 5: Add notes, apply promo code, select payment method | P0 |
| BOOK-006 | Step 6: Confirm → immediate confirmation with booking reference | P0 |
| BOOK-007 | Slot availability computed from business hours, staff schedules, existing bookings, buffer time | P0 |
| BOOK-008 | Booking holds slot for 10 minutes during checkout (Redis lock) | P0 |
| BOOK-009 | Support for recurring bookings (weekly/monthly) | P2 |
| BOOK-010 | Guest checkout flow with minimal info (name, phone, email) | P1 |
| BOOK-011 | Cancellation policy displayed before confirmation | P0 |

---

### 2.8 Appointment Management
**Priority:** P0 — Critical Path  
**Owner:** Full Stack

#### Description
Clients and business owners can view, modify, and cancel appointments with appropriate notifications.

#### User Stories
- As a client, I want to see all my upcoming appointments so I don't miss them.
- As a client, I want to reschedule easily so I have flexibility.
- As a business owner, I want to see my daily schedule so I can prepare.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| APPT-001 | Client view: upcoming / past / cancelled tabs; sorted by date | P0 |
| APPT-002 | Appointment card: business, service, staff, time, location, status, reference | P0 |
| APPT-003 | Reschedule: select new slot if within cancellation policy; recompute availability | P0 |
| APPT-004 | Cancel: client can cancel per business policy; reason optional | P0 |
| APPT-005 | Business owner view: calendar (day/week/month), list, staff filter | P0 |
| APPT-006 | Business can block time (lunch, vacation, emergency) | P0 |
| APPT-007 | Business can confirm/reject pending appointments | P0 |
| APPT-008 | No-show marking and client history tracking | P1 |
| APPT-009 | Appointment status states: `PENDING` → `CONFIRMED` → `COMPLETED` / `CANCELLED` / `NO_SHOW` | P0 |

---

### 2.9 Favorites
**Priority:** P1 — High  
**Owner:** Full Stack

#### Description
Users can save and organize favorite businesses for quick re-access.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| FAV-001 | Toggle favorite from business detail or search results | P0 |
| FAV-002 | Favorites list with quick access to book again | P0 |
| FAV-003 | Sync favorites across devices when logged in | P0 |
| FAV-004 | Guest favorites stored locally; prompt to login to persist | P1 |
| FAV-005 | Push notification when favorite business has promotion/new availability | P2 |

---

### 2.10 User Profile
**Priority:** P1 — High  
**Owner:** Full Stack

#### Description
Personalized profile with preferences, payment methods, and booking history.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| PROF-001 | Profile photo, name, phone, email, birthday (for birthday offers) | P0 |
| PROF-002 | Saved payment methods (PCI-compliant via Stripe) | P0 |
| PROF-003 | Notification preferences: push, email, SMS — granular per type | P0 |
| PROF-004 | Booking history with reorder/rebook functionality | P0 |
| PROF-005 | Preferred language and currency | P1 |
| PROF-006 | Privacy settings: profile visibility, data download, delete account | P1 |

---

### 2.11 Availability & Slot Computation
**Priority:** P0 — Critical Path  
**Owner:** Backend

#### Description
Real-time, accurate computation of available appointment slots considering all constraints.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| SLOT-001 | Input: business hours, staff schedules, service duration, existing appointments, buffers | P0 |
| SLOT-002 | Output: available slots in 15/30/60-minute increments based on service | P0 |
| SLOT-003 | Handle concurrent bookings with database-level exclusion constraints | P0 |
| SLOT-004 | Support variable service durations and combo services | P0 |
| SLOT-005 | Timezone-aware computation; store all times in UTC | P0 |
| SLOT-006 | Cache slot computation for 5 minutes to reduce DB load | P1 |
| SLOT-007 | Pre-booking hold (Redis) prevents double-booking during checkout | P0 |
| SLOT-008 | Business can set: buffer between appointments, max advance booking, min notice | P0 |

---

### 2.12 Shared Types & Design System
**Priority:** P0 — Foundation  
**Owner:** Design / Frontend

#### Description
Consistent, reusable design system and type definitions across web, mobile, and API.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| DS-001 | Color palette, typography, spacing, elevation tokens in shared package | P0 |
| DS-002 | Component library: buttons, inputs, cards, modals, lists, avatars | P0 |
| DS-003 | Shared TypeScript types between API and frontend (monorepo) | P0 |
| DS-004 | Dark mode support | P1 |
| DS-005 | Accessibility: WCAG 2.1 AA minimum; screen reader support | P1 |
| DS-006 | Animation standards: 200ms transitions, haptic feedback on mobile | P1 |
| DS-007 | Icon set: consistent, categorized, SVG-based | P0 |

---

### 2.13 Reviews & Ratings
**Priority:** P1 — High  
**Owner:** Full Stack

#### Description
Clients can rate and review businesses post-appointment; businesses can respond.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| REV-001 | 5-star rating + text review (10-500 chars) | P0 |
| REV-002 | Review eligibility: only after completed appointment | P0 |
| REV-003 | Business can reply to reviews publicly | P0 |
| REV-004 | Review moderation: flag inappropriate content; admin dashboard | P1 |
| REV-005 | Aggregate rating displayed with distribution histogram | P0 |
| REV-006 | Photos allowed in reviews (up to 5) | P2 |
| REV-007 | "Helpful" voting on reviews | P2 |

---

### 2.14 Payment Integration
**Priority:** P0 — Critical Path  
**Owner:** Backend / Mobile

#### Description
Secure, flexible payment processing with support for multiple methods and business models.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| PAY-001 | Stripe integration: cards, Apple Pay, Google Pay | P0 |
| PAY-002 | Full payment at booking OR deposit with balance on arrival | P0 |
| PAY-003 | Business can set cancellation/refund policy | P0 |
| PAY-004 | Platform fee deducted automatically; remainder to business (weekly payout) | P0 |
| PAY-005 | Invoice and receipt emailed to client | P0 |
| PAY-006 | Failed payment handling with retry and notification | P0 |
| PAY-007 | PCI compliance: never store raw card data; use Stripe tokens | P0 |

---

### 2.15 Notifications
**Priority:** P1 — High  
**Owner:** Backend / Mobile

#### Description
Multi-channel notifications keeping users informed at every step.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| NOTIF-001 | Push notifications: booking confirmed, reminder (24h, 1h), cancelled, modified | P0 |
| NOTIF-002 | Email confirmations with ICS attachment for calendar | P0 |
| NOTIF-003 | SMS for critical updates (optional, user-controlled) | P1 |
| NOTIF-004 | In-app notification center with read/unread status | P0 |
| NOTIF-005 | Marketing opt-in with granular preferences | P1 |
| NOTIF-006 | Notification templates editable by admin | P2 |

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 — Critical Path  
**Owner:** Full Stack

#### Description
Comprehensive web dashboard for business owners to manage their presence, schedule, and operations.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| PORT-001 | Dashboard: today's appointments, revenue this week, new clients | P0 |
| PORT-002 | Calendar management: view, create, edit, cancel appointments | P0 |
| PORT-003 | Staff management: add staff, set schedules, assign services | P0 |
| PORT-004 | Service management: CRUD services, set prices, durations, categories | P0 |
| PORT-005 | Business profile: photos, description, hours, policies | P0 |
| PORT-006 | Client list with visit history and notes | P1 |
| PORT-007 | Analytics: bookings, revenue, cancellation rate, peak times | P1 |
| PORT-008 | Payout settings and transaction history | P0 |

---

### 2.17 Admin Dashboard
**Priority:** P1 — High  
**Owner:** Full Stack

#### Description
Internal tool for platform management, moderation, and analytics.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| ADMIN-001 | User management: search, view, suspend, impersonate | P0 |
| ADMIN-002 | Business verification and approval workflow | P0 |
| ADMIN-003 | Content moderation: reviews, photos, business descriptions | P0 |
| ADMIN-004 | Platform analytics: MAU, bookings, GMV, churn | P0 |
| ADMIN-005 | Support ticket integration | P2 |
| ADMIN-006 | Feature flags and configuration | P1 |

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P1 — High  
**Owner:** Backend

#### Description
Reliable, scalable background job processing for asynchronous tasks.

#### Acceptance Criteria
| ID | Criteria | Priority |
|----|----------|----------|
| JOB-001 | Job types: email sending, push notifications, SMS, report generation, data exports | P0 |
| JOB-002 | Retry policy: 3 attempts with exponential backoff | P0 |
| JOB-003 | Dead letter queue for failed jobs after retries exhausted | P0 |
| JOB-004 | Job monitoring dashboard (Bull Board or similar) | P1 |
| JOB-005 | Scheduled jobs: daily reports, cleanup, reminder notifications | P0 |
| JOB-006 | Job priority levels: critical (payment), high (notifications), normal (reports), low (exports) | P0 |
| JOB-007 | Idempotency keys to prevent duplicate processing | P0 |

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | API p95 < 200ms; search < 500ms; mobile cold start < 3s |
| **Scalability** | Handle 10k concurrent users; 100 bookings/minute |
| **Security** | OWASP Top 10 mitigation; dependency scanning; secrets management |
| **Reliability** | 99.9% uptime; graceful degradation; circuit breakers |
| **Compliance** | GDPR, CCPA, PCI-DSS (Level 1 service provider via Stripe) |
| **Accessibility** | WCAG 2.1 AA; screen reader; dynamic type |

---

## 4. Release Phases

| Phase | Features | Target |
|-------|----------|--------|
| **MVP** | Auth, Guest Browse, Search, Map, Business Detail, Categories, Booking, Appointments, Payments | Month 2 |
| **v1.1** | Favorites, Profile, Reviews, Notifications | Month 3 |
| **v1.2** | Provider Portal, Admin Dashboard | Month 4 |
| **v1.3** | Background Jobs optimization, Analytics, Marketing tools | Month 5 |

---

## 5. Open Questions

1. Internationalization scope for v1? (FR/EN/DE/ES)
2. Commission structure details (flat fee vs percentage)?
3. Insurance/liability coverage for no-shows?
4. Integration with external calendars (Google, Outlook)?

---

*Document maintained by Product Team. For questions, contact alex@planity-clone.dev*
