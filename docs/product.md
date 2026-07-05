# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a multi-platform application enabling users to discover beauty and wellness businesses, book appointments, and manage their reservations. The platform serves three user types: **Clients** (end users), **Providers** (business owners), and **Admins** (platform operators).

---

## 2. Personas

| Persona | Description |
|---------|-------------|
| **Client** | Seeks and books beauty/wellness services, manages appointments |
| **Provider** | Manages business profile, services, availability, and bookings |
| **Admin** | Oversees platform health, user management, and disputes |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 | **Owner:** Backend / Mobile / Web

| Aspect | Specification |
|--------|---------------|
| **Registration** | Email/password, Google OAuth, Apple Sign-In |
| **Login** | JWT-based session with refresh token rotation |
| **Password Reset** | Email-based reset flow with 1-hour expiry |
| **Phone Verification** | Optional SMS verification for booking confirmation |
| **Role Selection** | Post-registration choice: Client or Provider (can be both) |

**Acceptance Criteria:**
- [ ] User can register with email + password, Google, or Apple
- [ ] Password requires min 8 chars, 1 uppercase, 1 number, 1 special char
- [ ] JWT access token expires in 15 min, refresh token in 7 days
- [ ] Rate limit: 5 failed login attempts trigger 30-min lockout
- [ ] Password reset email delivers within 60 seconds
- [ ] Provider accounts require additional business verification step

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Mobile / Web Frontend

| Aspect | Specification |
|--------|---------------|
| **Access** | No account required for browsing |
| **Content** | View business listings, services, prices, reviews (read-only) |
| **Limitations** | Booking, favorites, and appointment management require login |
| **Prompt** | CTA to sign up appears on booking attempt |

**Acceptance Criteria:**
- [ ] Guest sees full business directory without authentication
- [ ] Guest can search and filter businesses
- [ ] Guest can view business details, services, and reviews
- [ ] Attempting to book triggers auth modal with preserved context
- [ ] Guest state persists for 24 hours (local storage)

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Backend / Search Service

| Aspect | Specification |
|--------|---------------|
| **Search Input** | Text query with autocomplete (business name, service, location) |
| **Filters** | Category, price range, rating, availability (today/this week), distance, amenities |
| **Sorting** | Relevance, rating, price (low-high), distance |
| **Results** | Card-based list with thumbnail, name, rating, price from, next available slot |
| **Pagination** | Cursor-based, 20 results per page |

**Acceptance Criteria:**
- [ ] Autocomplete returns suggestions in < 200ms
- [ ] Full-text search supports typo tolerance (fuzzy matching)
- [ ] Filters combine with AND logic; empty results show zero-state
- [ ] "Next available" slot computes in real-time from availability engine
- [ ] Search history persists for authenticated users (last 10 queries)

---

### 3.4 Map-based Search
**Priority:** P0 | **Owner:** Mobile / Web Frontend

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Google Maps (mobile) / Mapbox (web fallback) |
| **Clustering** | Businesses cluster at zoom levels > 10 |
| **Interaction** | Tap cluster to zoom; tap pin for preview card |
| **User Location** | Request on first use; fallback to IP-based city |
| **Bounds Search** | Search results update on map pan/zoom |

**Acceptance Criteria:**
- [ ] Map initializes centered on user location or default city
- [ ] Pins display business category icon and rating
- [ ] Map and list views are synchronized (same results)
- [ ] User can toggle between map and list views
- [ ] Location permission denied gracefully falls back to manual city selection

---

### 3.5 Business Detail View
**Priority:** P0 | **Owner:** Mobile / Web Frontend

| Aspect | Specification |
|--------|---------------|
| **Header** | Image gallery (up to 10), business name, rating, favorite toggle |
| **Tabs** | Services, Reviews, About, Availability |
| **Services** | Expandable list with duration, price, description |
| **Reviews** | Paginated list with photos, sort by recent/helpful |
| **About** | Description, hours, location, amenities, contact |
| **CTA** | "Book Now" — pre-selects service if tapped |

**Acceptance Criteria:**
- [ ] Image gallery supports swipe/pinch zoom
- [ ] Business hours display current day status (Open/Closed)
- [ ] Phone/email actions trigger native apps
- [ ] Share button generates deep link with preview
- [ ] Average rating displays as 0.0-5.0 with half-star precision

---

### 3.6 Service Categories
**Priority:** P0 | **Owner:** Backend / CMS

| Aspect | Specification |
|--------|---------------|
| **Hierarchy** | Category > Subcategory > Service |
| **Examples** | Hair > Cut, Color, Treatment; Nails > Manicure, Pedicure |
| **Icons** | Each category has associated icon asset |
| **Dynamic** | Admin-configurable; supports up to 3 levels |

**Acceptance Criteria:**
- [ ] Categories display in horizontal scroll on home screen
- [ ] Category selection filters search results
- [ ] Services inherit category for search indexing
- [ ] Uncategorized services appear in "Other"
- [ ] Category changes reflect within 5 minutes (cache invalidation)

---

### 3.7 Booking Flow
**Priority:** P0 | **Owner:** Full Stack

| Aspect | Specification |
|--------|---------------|
| **Step 1: Service** | Select service(s); allow multiple for same provider |
| **Step 2: Provider** | If category search, choose specific staff or "Any" |
| **Step 3: Date/Time** | Calendar view with available slots; respects business hours |
| **Step 4: Details** | Client notes, phone confirmation, guest name (if booking for other) |
| **Step 5: Payment** | Pay now or pay at venue (configurable per business) |
| **Confirmation** | Booking reference, calendar invite, directions |

**Acceptance Criteria:**
- [ ] Slot selection prevents double-booking (pessimistic locking, 10-min hold)
- [ ] Calendar shows next 30 days; past dates disabled
- [ ] Multi-service booking calculates total duration and finds contiguous slots
- [ ] "Any provider" option assigns based on availability
- [ ] Booking confirmation arrives via push, email, and in-app within 5 seconds
- [ ] Failed payment releases hold immediately

---

### 3.8 Appointment Management
**Priority:** P0 | **Owner:** Full Stack

| Aspect | Specification |
|--------|---------------|
| **Client View** | Upcoming / Past tabs; reschedule, cancel, rebook actions |
| **Reschedule** | Re-enter booking flow with existing details pre-filled |
| **Cancel** | Policy-based: free until 24h before, 50% charge within 24h, no refund same-day |
| **No-show** | Provider marks; client flagged after 2 no-shows |
| **Reminders** | Push + SMS at 24h and 1h before appointment |

**Acceptance Criteria:**
- [ ] Client sees all appointments sorted by date (nearest first)
- [ ] Cancel button shows refund amount and policy before confirmation
- [ ] Reschedule maintains payment if within same price tier
- [ ] Provider receives real-time notification on client actions
- [ ] Past appointments prompt for review after 1 hour

---

### 3.9 Favorites
**Priority:** P1 | **Owner:** Mobile / Web Frontend

| Aspect | Specification |
|--------|---------------|
| **Action** | Heart toggle on business card and detail |
| **List** | Dedicated screen with search and filter |
| **Sync** | Cross-device for authenticated users |
| **Notifications** | Optional: alert for new availability or promotions from favorites |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite updates UI immediately, syncs in background
- [ ] Offline: queue action for next connectivity
- [ ] Maximum 500 favorites per user
- [ ] Favorited businesses surface in "Recommended for you" algorithm

---

### 3.10 User Profile
**Priority:** P1 | **Owner:** Full Stack

| Aspect | Specification |
|--------|---------------|
| **Fields** | Name, photo, phone, email, birthday (for birthday offers) |
| **Settings** | Notifications, payment methods, addresses, linked accounts |
| **History** | Total bookings, favorite categories, spending summary |
| **Privacy** | GDPR data export and deletion request |

**Acceptance Criteria:**
- [ ] Profile completion percentage shown; 80% for full experience
- [ ] Photo upload supports crop, max 5MB, JPG/PNG
- [ ] Data export delivers within 72 hours via email link
- [ ] Account deletion requires re-authentication and 7-day grace period

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Backend / Algorithm

| Aspect | Specification |
|--------|---------------|
| **Business Hours** | Weekly recurring + exception dates (holidays, closures) |
| **Staff Schedules** | Individual availability, breaks, time off |
| **Slot Generation** | Dynamic based on service duration + buffer + existing bookings |
| **Buffer Time** | Configurable between appointments (default: 0 min) |
| **Constraints** | Min booking notice (e.g., 2 hours ahead), max advance (e.g., 60 days) |

**Acceptance Criteria:**
- [ ] Slot computation returns results in < 100ms for 30-day range
- [ ] Concurrent booking requests handled without overbooking (atomic operations)
- [ ] Staff vacation automatically excludes affected dates
- [ ] Business can block emergency closures with immediate effect
- [ ] Algorithm accounts for multi-service bookings (sequential slotting)

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Design / Frontend

| Aspect | Specification |
|--------|---------------|
| **Tokens** | Colors, typography, spacing, shadows, radii |
| **Components** | Buttons, inputs, cards, modals, toasts, skeletons |
| **Theming** | Light/dark mode; brand color override per business (white-label ready) |
| **Accessibility** | WCAG 2.1 AA minimum; screen reader support, focus management |
| **Cross-platform** | React Native (mobile) and React (web) share design tokens |

**Acceptance Criteria:**
- [ ] All UI components exist in Storybook / equivalent
- [ ] Dark mode respects system preference with manual override
- [ ] Minimum touch target: 44x44dp (mobile), 48x48px (web)
- [ ] Color contrast ratio ≥ 4.5:1 for all text
- [ ] RTL language support in component architecture

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Full Stack

| Aspect | Specification |
|--------|---------------|
| **Eligibility** | Only clients with completed appointments can review |
| **Fields** | Overall rating (1-5), service-specific ratings, text, photos (max 5) |
| **Moderation** | Auto-approve; flag for review if reported; AI toxicity check |
| **Response** | Business owner can reply publicly |
| **Aggregation** | Weighted recent reviews more heavily (last 12 months) |

**Acceptance Criteria:**
- [ ] Review prompt triggers 1 hour post-appointment via push
- [ ] Client can edit review within 24 hours; delete anytime
- [ ] Photo reviews moderated for inappropriate content (AI + human)
- [ ] Business reply notifies reviewer
- [ ] Rating breakdown shows distribution (5-star, 4-star, etc.)

---

### 3.14 Payment Integration
**Priority:** P0 | **Owner:** Backend / Finance

| Aspect | Specification |
|--------|---------------|
| **Providers** | Stripe (primary), PayPal (secondary) |
| **Flows** | Immediate charge, deposit, full refund, partial refund |
| **Methods** | Cards (Visa, MC, Amex), Apple Pay, Google Pay, SEPA |
| **Escrow** | Optional: hold funds until service completion |
| **Receipts** | Auto-generated PDF, emailed, stored in app |

**Acceptance Criteria:**
- [ ] PCI-DSS compliant; no raw card data touches servers (Stripe Elements)
- [ ] 3D Secure triggered for EU transactions
- [ ] Webhook handling for failed/successful payments with idempotency
- [ ] Refund processes within 5-10 business days per policy
- [ ] Payment failure shows clear error with retry option

---

### 3.15 Notifications
**Priority:** P1 | **Owner:** Backend / Mobile

| Channel | Use Cases |
|---------|-----------|
| **Push** | Booking confirmation, reminders, promotions, chat messages |
| **SMS** | Critical: booking changes, 24h reminder, verification |
| **Email** | Receipts, summaries, marketing (opt-in) |
| **In-app** | Activity feed with unread badges |

**Acceptance Criteria:**
- [ ] User controls notification preferences per channel and type
- [ ] Push delivery rate > 95% (tracked via FCM/APNs feedback)
- [ ] Notification deep-links to relevant screen
- [ ] Quiet hours respected (default: 22:00-08:00, configurable)
- [ ] Unsubscribe from marketing honors within 24 hours

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Full Stack (Web)

| Aspect | Specification |
|--------|---------------|
| **Dashboard** | Today's appointments, revenue this week, upcoming week preview |
| **Calendar** | Day/week/month views; drag-to-reschedule |
| **Services** | CRUD services with pricing, duration, description, photos |
| **Staff** | Add team members, set permissions, manage schedules |
| **Clients** | CRM view: visit history, notes, marketing tags |
| **Settings** | Business hours, cancellation policy, payment methods, integrations |

**Acceptance Criteria:**
- [ ] Provider can block time slots for breaks or unavailability
- [ ] Staff permissions: Admin, Manager, Staff (view-only own calendar)
- [ ] Revenue dashboard updates in near real-time (5-min delay max)
- [ ] Export bookings to CSV/ICal
- [ ] White-label: custom domain, logo, brand colors (premium tier)

---

### 3.17 Admin Dashboard
**Priority:** P1 | **Owner:** Full Stack (Web)

| Aspect | Specification |
|--------|---------------|
| **Overview** | KPIs: users, bookings, revenue, churn, top businesses |
| **User Management** | Search, suspend, impersonate, data export |
| **Business Verification** | Review submitted documents, approve/reject with notes |
| **Dispute Resolution** | View booking disputes, mediate refunds, communication log |
| **Content Moderation** | Flagged reviews, reported businesses, automated alerts |
| **Configuration** | Feature flags, global settings, notification templates |

**Acceptance Criteria:**
- [ ] Admin actions are fully audited (who, what, when)
- [ ] Business verification decision within 24 hours of submission
- [ ] Bulk operations support (suspend multiple accounts)
- [ ] Role-based access: Super Admin, Support Agent, Finance, Moderator
- [ ] All admin actions require MFA

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 | **Owner:** Backend / DevOps

| Job Type | Description | Schedule |
|----------|-------------|----------|
| **Reminder Notifications** | Send push/SMS for upcoming appointments | 24h and 1h before |
| **No-show Flagging** | Mark appointments past start time + grace | Every 15 min |
| **Review Solicitation** | Prompt client for review post-appointment | 1h after |
| **Payment Capture** | Capture held funds after service completion | Configurable |
| **Report Generation** | Daily/weekly business summaries | Daily at 06:00 |
| **Data Cleanup** purge soft-deleted records older than 90 days | Daily at 03:00 |
| **Search Indexing** | Update Elasticsearch/Algolia indexes | On change + hourly sync |
| **Email Campaigns** | Batch marketing sends | Per campaign schedule |

**Acceptance Criteria:**
- [ ] Jobs retry with exponential backoff (max 5 attempts)
- [ ] Failed jobs alert via PagerDuty after 2 consecutive failures
- [ ] Job queue depth monitored; alert if > 1000 pending
- [ ] Scheduled jobs are idempotent (safe to run multiple times)
- [ ] Job execution time logged; > 30s triggers warning

---

## 4. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | API p95 < 200ms; page load < 2s (3G) |
| **Availability** | 99.9% uptime; maintenance windows announced 48h ahead |
| **Security** | OWASP Top 10 mitigation; annual penetration test |
| **Scalability** | Auto-scaling at 70% CPU; support 10x traffic spike |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1 |
| **Localization** | EN, FR, ES, DE at launch; RTL support |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 50,000 by month 6 |
| Booking Conversion Rate | > 15% of app opens |
| Provider NPS | > 50 |
| Client NPS | > 40 |
| Support Ticket Volume | < 2% of bookings |
| App Store Rating | > 4.5 stars |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Business Detail, Booking, Appointments, Availability, Provider Basic Portal, Payments | Month 1-2 |
| **V1.0** | Map, Favorites, Reviews, Notifications, Profile | Month 3 |
| **V1.5** | Admin Dashboard, Advanced Analytics, Marketing Tools | Month 4 |
| **V2.0** | White-label, API for Partners, International Expansion | Month 6 |

---

*Document Version: 1.0 | Last Updated: 2024 | Product Owner: Alex*