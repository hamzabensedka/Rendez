# Planity Clone - Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with local service businesses (beauty, wellness, health) for online booking. The platform serves three user types: **Customers** (book appointments), **Business Owners** (manage business and appointments), and **Admin** (platform management).

---

## 2. User Personas

| Persona | Goals | Pain Points |
|---------|-------|-------------|
| **Customer** | Find, compare and book services quickly | Can't find availability, no reviews, booking friction |
| **Business Owner** | Fill calendar, reduce no-shows, grow business | Manual scheduling, missed calls, customer acquisition |
| **Admin** | Platform growth, quality control, monetization | Fraud, disputes, business onboarding |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 | **Effort:** Medium

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| AUTH-01 | Email/password registration | User receives verification email; password requires 8+ chars, 1 uppercase, 1 number |
| AUTH-02 | Phone number registration | SMS OTP verification; number validated via Twilio/Verify API |
| AUTH-03 | Social login (Google, Apple) | OAuth 2.0 flow; account linking if email exists |
| AUTH-04 | Login with biometrics | Face ID/Touch ID option after first password login |
| AUTH-05 | Password reset | Secure token expires in 1 hour; rate-limited to 3 attempts/hour |
| AUTH-06 | JWT token refresh | Access token 15min, refresh token 7 days; silent refresh on app resume |
| AUTH-07 | Account deletion | GDPR-compliant; 30-day soft delete, full purge after |
| AUTH-08 | Role-based access | Customer, Business, Admin roles with distinct JWT claims |

**Edge Cases:** User tries to register with existing email → offer login link. Social login email mismatch → prompt to link accounts.

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Effort:** Medium

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| GUEST-01 | Browse without account | All discovery features accessible; booking requires auth |
| GUEST-02 | Persistent guest cart | LocalStorage for 7 days; prompt to register on booking attempt |
| GUEST-03 | Convert guest data on signup | Merge favorites, recent searches, pending bookings |

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Effort:** High

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SEARCH-01 | Text search | Search business name, service name, description; typo tolerance (fuzzy matching) |
| SEARCH-02 | Autocomplete suggestions | <100ms response; max 8 suggestions; prioritize popular businesses |
| SEARCH-03 | Recent searches | Store last 10; clear individually or all |
| SEARCH-04 | Trending searches | Update hourly; minimum 50 searches to qualify |
| SEARCH-05 | Search filters | Category, price range, rating (4.0+, 4.5+), availability today, gender (if applicable) |
| SEARCH-06 | Sort options | Relevance, distance, rating, price (low-high), most reviewed |
| SEARCH-07 | Pagination | 20 results per page; infinite scroll on mobile |

**Tech Note:** Elasticsearch or Algolia for search index; geospatial queries for distance.

---

### 3.4 Map-based Search
**Priority:** P0 | **Effort:** High

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| MAP-01 | Interactive map view | Google Maps/Mapbox; cluster markers at zoom levels |
| MAP-02 | Business pins | Tap to show card with name, rating, price from; tap card → detail |
| MAP-03 | Current location | Request permission; default zoom 12 (city level) |
| MAP-04 | Search this area | Button appears on map pan; triggers new search with visible bounds |
| MAP-05 | List/map toggle | Persist user preference; animate transition |
| MAP-06 | Directions integration | Deep link to native maps app for routing |

---

### 3.5 Business Detail View
**Priority:** P0 | **Effort:** High

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BIZ-01 | Hero gallery | Up to 10 images; swipeable; pinch-to-zoom; video support |
| BIZ-02 | Business info | Name, verified badge, category, address, phone, website, hours |
| BIZ-03 | Service menu | Grouped by category; expandable; show duration & price |
| BIZ-04 | Staff profiles | Photo, name, specialty, rating; selectable for booking |
| BIZ-05 | Reviews summary | Average rating, total count, rating distribution bar chart |
| BIZ-06 | Quick book CTA | Prominent button; pre-selects most popular service |
| BIZ-07 | Share business | Native share sheet; generate deep link |
| BIZ-08 | Report business | Flag inappropriate content; admin notified |

---

### 3.6 Service Categories
**Priority:** P0 | **Effort:** Medium

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CAT-01 | Hierarchical categories | Ex: Beauty > Hair > Coloring > Balayage; max 4 levels |
| CAT-02 | Category icons | Custom SVG icons; consistent 24x24px |
| CAT-03 | Popular categories | Dynamically sorted by booking volume |
| CAT-04 | Category landing pages | SEO-optimized; featured businesses, trending services |
| CAT-05 | Business category assignment | Business can select up to 3 primary categories |

---

### 3.7 Booking Flow
**Priority:** P0 | **Effort:** High

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BOOK-01 | Service selection | Single or multiple services; calculate total duration & price |
| BOOK-02 | Staff selection | "Any available" or specific staff; show staff availability |
| BOOK-03 | Date & time picker | Calendar view; available slots highlighted; timezone-aware |
| BOOK-04 | Slot selection | 15/30/60 min increments based on business settings; show buffer time |
| BOOK-05 | Guest info capture | Name, phone, email; auto-fill for logged-in users |
| BOOK-06 | Special requests | 250 char limit; visible to business |
| BOOK-07 | Booking confirmation | Summary page; accept terms; confirm CTA |
| BOOK-08 | Hold slot | 10-minute hold during checkout; release if payment fails |
| BOOK-09 | Booking confirmation screen | Booking reference, add to calendar, share |
| BOOK-10 | Guest checkout | Allow booking without account; prompt to create account |

**State Machine:** `selecting → holding → confirmed → paid → completed → reviewed` or `cancelled`

---

### 3.8 Appointment Management
**Priority:** P0 | **Effort:** High

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| APT-01 | Customer appointments list | Upcoming/past tabs; sort by date descending |
| APT-02 | Appointment detail | All booking info, status, business contact, directions |
| APT-03 | Reschedule | Find new slot; same business rules apply; notify business |
| APT-04 | Cancel | Customer can cancel per business policy; refund rules displayed |
| APT-05 | No-show marking | Business can mark; affects customer reliability score |
| APT-06 | Rebook | One-tap rebook same service/staff |
| APT-07 | Business appointment management | Calendar view (day/week/month); drag to reschedule; block time |
| APT-08 | Business status updates | Confirm, decline, mark complete; customer notified |
| APT-09 | Walk-in support | Business can add manual appointment; syncs to availability |

**Cancellation Policy:** Configurable per business: free until 24h, 50% 24-4h, 100% <4h.

---

### 3.9 Favorites
**Priority:** P1 | **Effort:** Low

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| FAV-01 | Add/remove favorite | Heart icon toggle; haptic feedback; optimistic UI |
| FAV-02 | Favorites list | Grid view; empty state with discovery CTA |
| FAV-03 | Favorite notifications | Opt-in: "New availability at your favorite salon" |
| FAV-04 | Sync across devices | Real-time via user account |

---

### 3.10 User Profile
**Priority:** P1 | **Effort:** Medium

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PROF-01 | Profile photo | Upload/crop; max 5MB; moderate content |
| PROF-02 | Personal info | Name, phone, email, birthday (for birthday offers) |
| PROF-03 | Notification preferences | Push, email, SMS toggles per type (bookings, promotions) |
| PROF-04 | Payment methods | Add, default, delete cards; PCI-compliant tokenization |
| PROF-05 | Address book | Multiple saved addresses; default for search |
| PROF-06 | Booking history | All appointments; filter by status; export receipts |
| PROF-07 | Loyalty points | Display balance; transaction history; redeem flow |

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Effort:** High

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SLOT-01 | Business hours config | Set weekly schedule; multiple shifts; exceptions for holidays |
| SLOT-02 | Staff availability | Override business hours; vacation blocks; recurring unavailability |
| SLOT-03 | Service duration | Configurable per service; include setup/cleanup buffer |
| SLOT-04 | Slot generation | Real-time computation; account for existing bookings, staff, breaks |
| SLOT-05 | Concurrent bookings | Support for group services (multiple chairs, rooms) |
| SLOT-06 | Buffer time | Configurable between appointments (sanitization, prep) |
| SLOT-07 | Last-minute cutoff | Block booking X hours before (e.g., no same-day after 6pm) |
| SLOT-08 | Waitlist | Notify when preferred slot opens; FIFO queue |

**Algorithm:** Pre-compute daily slots at 00:00 UTC; real-time check on booking attempt with pessimistic locking.

---

### 3.12 Shared Types & Design System
**Priority:** P1 | **Effort:** Medium

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| DS-01 | Design tokens | Colors, typography, spacing, shadows in JSON; Figma sync |
| DS-02 | Component library | Buttons, inputs, cards, modals, loading states; Storybook |
| DS-03 | Shared types | TypeScript definitions for all entities; Zod validation |
| DS-04 | Responsive breakpoints | Mobile: 0-767px, Tablet: 768-1024px, Desktop: 1025px+ |
| DS-05 | Accessibility | WCAG 2.1 AA; screen reader support; focus management |
| DS-06 | Dark mode | System preference detection; manual toggle; persistent |
| DS-07 | Localization | i18n framework; EN, FR, ES, DE initial; RTL support |

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Effort:** Medium

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| REV-01 | Post-review eligibility | Only after completed appointment; 14-day window |
| REV-02 | Rating breakdown | 1-5 stars; mandatory for text review optional |
| REV-03 | Review components | Service quality, staff, ambiance, value (optional sub-ratings) |
| REV-04 | Photo upload | Max 5 images; moderate content |
| REV-05 | Business response | Public reply; notification to reviewer |
| REV-06 | Review moderation | Auto-flag profanity, images; manual review queue |
| REV-07 | Review helpfulness | Mark helpful; sort by helpfulness |
| REV-08 | Average recalculation | Exclude reviews older than 2 years; weight recent higher |

---

### 3.14 Payment Integration
**Priority:** P0 | **Effort:** High

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PAY-01 | Payment methods | Credit/debit (Stripe), Apple Pay, Google Pay, PayPal |
| PAY-02 | Payment timing | Pay at booking, pay at venue, or deposit + balance |
| PAY-03 | Split payments | Partial payment with gift card, remainder with card |
| PAY-04 | Refunds | Automatic per cancellation policy; manual override by business |
| PAY-05 | Receipts | Email receipt; in-app download PDF |
| PAY-06 | Payouts to business | Weekly to connected account; dashboard shows pending/available |
| PAY-07 | Platform fee | Configurable % + fixed fee; transparent to business |
| PAY-08 | Failed payment retry | 3 attempts with exponential backoff; notify user |
| PAY-09 | 3D Secure | Trigger for high-risk transactions; seamless fallback |

---

### 3.15 Notifications
**Priority:** P1 | **Effort:** Medium

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| NOT-01 | Push notifications | Firebase Cloud Messaging; rich with images, actions |
| NOT-02 | Notification types | Booking confirmed, reminder (24h, 1h), cancelled, promotional |
| NOT-03 | In-app inbox | Persistent notification history; mark read/unread |
| NOT-04 | Email notifications | Transactional: SendGrid/Mailgun; marketing: unsubscribable |
| NOT-05 | SMS fallback | For urgent: booking confirmations, same-day reminders |
| NOT-06 | Preference management | Granular opt-in per channel and type |
| NOT-07 | Quiet hours | Respect local timezone; no push 22:00-08:00 unless urgent |

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Effort:** High

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PORT-01 | Dashboard overview | Today's bookings, revenue, occupancy rate, new reviews |
| PORT-02 | Business profile edit | All fields from detail view; preview mode |
| PORT-03 | Service management | CRUD services; set duration, price, description, staff assignment |
| PORT-04 | Staff management | Add staff, set permissions, manage their schedules |
| PORT-05 | Calendar management | Drag-drop reschedule; bulk edit; print view |
| PORT-06 | Customer management | View customer history, notes, block list |
| PORT-07 | Analytics | Booking volume, revenue, no-show rate, popular services; date range |
| PORT-08 | Settings | Cancellation policy, notification preferences, integrations |
| PORT-09 | Mobile-responsive | Full functionality on tablet; key actions on phone |

---

### 3.17 Admin Dashboard
**Priority:** P2 | **Effort:** High

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| ADMIN-01 | Business onboarding | Review applications, approve/reject with reason, track pipeline |
| ADMIN-02 | Business management | Search, filter, suspend, feature, impersonate login |
| ADMIN-03 | User management | Search, suspend, view activity, GDPR export/delete |
| ADMIN-04 | Content moderation | Review queue for reported content; bulk actions |
| ADMIN-05 | Financial overview | Platform revenue, payouts pending, disputes |
| ADMIN-06 | Analytics | MAU, bookings, GMV, CAC, LTV cohorts |
| ADMIN-07 | System health | API latency, error rates, queue depth, DB performance |
| ADMIN-08 | Config management | Feature flags, global settings, category management |

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P1 | **Effort:** Medium

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| JOB-01 | Slot pre-computation | Daily at 00:00 UTC for next 60 days; retry 3x with backoff |
| JOB-02 | Reminder notifications | 24h and 1h before appointment; idempotent per appointment |
| JOB-03 | Follow-up review request | 2 hours after appointment completion; max 1 send |
| JOB-04 | Expired hold cleanup | Every minute; release held slots; notify abandoned carts |
| JOB-05 | Payout processing | Weekly on Monday; calculate net after fees; generate reports |
| JOB-06 | Data exports | Async generation; notify when ready; S3 presigned URL |
| JOB-07 | Search index updates | On business/service change; debounced 5 seconds |
| JOB-08 | Image processing | Resize, compress, generate thumbnails; WebP conversion |
| JOB-09 | Failed job handling | Dead letter queue after max retries; alert on-call |
| JOB-10 | Job monitoring | Dashboard: queue lengths, processing times, failure rates |

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App launch <2s; page load <1s; API response <200ms (p95) |
| **Reliability** | 99.9% uptime; graceful degradation; circuit breakers |
| **Security** | OWASP Top 10; encryption at rest and in transit; audit logging |
| **Scalability** | Auto-scaling; handle 10x traffic spike; CDN for assets |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1 |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | >15% |
| Search-to-book time | <3 minutes |
| App store rating | >4.5 |
| Business NPS | >50 |
| Customer retention (30d) | >40% |
| No-show rate | <10% |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Search, Business Detail, Booking, Appointments, Basic Payments | Week 1-8 |
| **V1.1** | Map, Favorites, Reviews, Notifications | Week 9-12 |
| **V1.2** | Business Portal, Analytics, Advanced Payments | Week 13-16 |
| **V2.0** | Admin, Background Jobs, Loyalty, Referrals | Week 17-24 |

---

*Document version: 1.0 | Last updated: 2024 | Owner: Alex, Product Owner*