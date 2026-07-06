# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a platform connecting customers with local service businesses (salons, barbershops, spas, clinics) for appointment booking. It serves three user types: **Customers** (book appointments), **Business Owners** (manage bookings and business), and **Admin** (platform oversight).

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | End user seeking to book services | Find, compare, and book appointments quickly |
| **Guest** | Unregistered browser | Explore businesses without commitment |
| **Business Owner** | Service provider managing their business | Accept bookings, manage schedule, grow revenue |
| **Admin** | Platform operator | Monitor platform health, resolve disputes, manage onboarding |

---

## 3. Feature Specifications

### 3.1 User Authentication

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Customer, Business Owner |

**Description:** Secure identity management with multiple login methods and role-based access.

**Requirements:**
- Email/password registration with verification
- Social login (Google, Apple)
- Password reset via secure token
- JWT-based session with refresh token rotation
- Role selection at registration (customer vs. business owner)
- Phone number verification optional

**Acceptance Criteria:**
- [ ] User can register with email, receive verification link, and activate account
- [ ] User can log in with Google/Apple OAuth and account auto-links by email
- [ ] Token expires in 15min, refresh valid for 7 days, single device limit enforced
- [ ] Password requires min 8 chars, 1 uppercase, 1 number, 1 special character
- [ ] Failed login locks account for 30min after 5 attempts
- [ ] Business owner registration triggers onboarding flow

---

### 3.2 Guest Browse & Explore

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Guest |

**Description:** Allow unauthenticated users to discover businesses and services without barriers.

**Requirements:**
- Browse businesses by category and location
- View business profiles and service menus
- Search with filters (no geolocation permission required, fallback to city-level)
- Prompt to register only at booking initiation

**Acceptance Criteria:**
- [ ] Guest sees full business listings with no login required
- [ ] "Book Now" button triggers auth modal with pre-filled context
- [ ] Guest's search state persists post-authentication
- [ ] No personal data collection beyond IP-based city estimation

---

### 3.3 Business Search & Discovery

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Customer, Guest |

**Description:** Powerful search to find businesses matching customer needs.

**Requirements:**
- Full-text search across business name, service name, description
- Filters: category, price range, rating, availability (today/this week), amenities
- Sort options: relevance, distance, rating, price (low/high)
- Auto-complete suggestions
- Recent searches and trending categories

**Acceptance Criteria:**
- [ ] Search returns results in <200ms for indexed queries
- [ ] Empty state shows popular categories near user
- [ ] Filter combination produces accurate results (test: category=hair + price<$50 + available today)
- [ ] Search query "haircut color" matches businesses offering either or both services

---

### 3.4 Map-based Search

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User** | Customer, Guest |

**Description:** Visual location-based discovery with interactive map.

**Requirements:**
- Interactive map with business markers
- Clustering for dense areas
- Marker shows: name, rating, price range, next available slot
- List/map toggle with synchronized results
- Geolocation with permission handling

**Acceptance Criteria:**
- [ ] Map initializes to user location or city center
- [ ] Zoom levels adjust clustering granularity
- [ ] Tapping marker opens bottom sheet with key info and "View" CTA
- [ ] Map bounds filter search results dynamically
- [ ] Graceful fallback when geolocation denied (manual city search)

---

### 3.5 Business Detail View

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Customer, Guest |

**Description:** Comprehensive business profile driving booking decisions.

**Requirements:**
- Hero: name, photos, rating, review count, favorite toggle
- Info: address, hours, phone, website, social links
- Services: categorized list with duration, price, description
- Team: staff profiles with specialties and ratings
- Reviews: sorted by recency with photo support
- Availability preview: next 3 available slots

**Acceptance Criteria:**
- [ ] Page loads in <1s with lazy-loaded images
- [ ] "Book" on service opens slot selection for that service
- [ ] Hours show current status (Open/Closed) with next opening time
- [ ] Photo gallery supports swipe and pinch-to-zoom
- [ ] Deep linking to any business/service works

---

### 3.6 Service Categories

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | All |

**Description:** Hierarchical taxonomy for organizing all services.

**Requirements:**
- Predefined categories: Hair, Nails, Face & Skin, Massage, Wellness, Medical Aesthetic, Fitness
- Subcategories (e.g., Hair > Cut, Color, Styling, Treatment)
- Business can map services to categories; suggest if unmapped
- Category icons and color coding in UI

**Acceptance Criteria:**
- [ ] Category tree is extensible via admin config
- [ ] Business service appears in correct category browse
- [ ] Search by category name includes all subcategory services
- [ ] Category page shows featured businesses and popular services

---

### 3.7 Booking Flow

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Customer |

**Description:** Frictionless multi-step booking with clear confirmation.

**Requirements:**
- Step 1: Select service (or bundle multiple)
- Step 2: Select staff (any, specific, or no preference)
- Step 3: Choose date/time from available slots
- Step 4: Add notes, apply promo code
- Step 5: Review and confirm (payment if required)
- Immediate confirmation with calendar sync option

**Acceptance Criteria:**
- [ ] Booking completes in <3 steps for returning user with defaults
- [ ] Slot selection prevents double-booking (pessimistic lock for 10min)
- [ ] Guest checkout possible with email + phone
- [ ] Booking confirmation includes: reference ID, QR code, add-to-calendar link
- [ ] Cancellation policy shown before final confirm
- [ ] Abandoned booking reminder after 1 hour (if slots held)

---

### 3.8 Appointment Management

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Customer, Business Owner |

**Description:** Full lifecycle management of appointments for both sides.

**Customer Requirements:**
- View upcoming and past appointments
- Reschedule (same business, subject to policy)
- Cancel with reason selection
- Rebook favorite services

**Business Owner Requirements:**
- Daily/weekly calendar view
- Accept/decline pending requests (if approval required)
- Block time manually
- Mark no-show or completed
- Customer notes and history

**Acceptance Criteria:**
- [ ] Customer can reschedule up to 2 hours before (configurable per business)
- [ ] Cancellation fees apply automatically per business policy
- [ ] Business owner gets real-time notification on new booking
- [ ] Calendar sync supports Google Calendar and iCal
- [ ] Bulk actions: block recurring time slots

---

### 3.9 Favorites

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User** | Customer |

**Description:** Save preferred businesses and services for quick access.

**Requirements:**
- Heart toggle on business card and detail
- Favorites list with quick rebook
- Favorite services sub-list
- Optional: price drop or availability notifications for favorites

**Acceptance Criteria:**
- [ ] Toggle updates without full page reload
- [ ] Favorites persist across devices for logged-in user
- [ ] Maximum 200 favorites per user
- [ ] Rebook from favorites pre-selects last booked service

---

### 3.10 User Profile

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User** | Customer |

**Requirements:**
- Personal info: name, email, phone, photo
- Preferences: notification settings, default city
- Payment methods (save for reuse)
- Booking history with receipts
- Loyalty points (if program active)

**Acceptance Criteria:**
- [ ] Profile completion percentage shown, incentivizes full completion
- [ ] GDPR data export and deletion requests handled
- [ ] Phone change triggers re-verification

---

### 3.11 Availability & Slot Computation

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | System, Business Owner |

**Description:** Core engine for generating accurate bookable slots.

**Requirements:**
- Define business hours per day with breaks
- Service duration + buffer time between appointments
- Staff-specific schedules and skills (which services)
- Blackout dates, vacation days
- Variable duration (e.g., haircut 30-45min based on hair length)
- Buffer rules: prep time, cleanup time

**Algorithm:**
- Generate slots from business hours minus existing bookings minus breaks minus buffers
- Respect staff assignment and skill matching
- Support concurrent bookings if multiple staff/resources

**Acceptance Criteria:**
- [ ] Slot generation runs in <100ms for 30-day window
- [ ] Changing business hours updates future availability immediately
- [ ] Booking at slot edge respects complete duration (no overflow)
- [ ] Staff vacation removes their slots without affecting others
- [ ] Edge case: 90min service starting at 4:30pm with 6pm close is unavailable

---

### 3.12 Shared Types & Design System

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Developers |

**Requirements:**
- TypeScript interfaces for all entities (User, Business, Service, Appointment, etc.)
- Design tokens: colors, typography, spacing, shadows
- Component library: Button, Input, Card, Calendar, TimeSlot, Modal, Toast
- Responsive breakpoints: mobile-first (320px base)
- Accessibility: WCAG 2.1 AA, focus management, ARIA labels
- Theme support: light/dark mode

**Acceptance Criteria:**
- [ ] All components documented in Storybook
- [ ] No hardcoded values; all via design tokens
- [ ] Color contrast ratios verified via automated testing
- [ ] Touch targets minimum 44x44px

---

### 3.13 Reviews & Ratings

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User** | Customer, Business Owner |

**Requirements:**
- Post-review after completed appointment (window: 24h to 30 days)
- Star rating (1-5) + text review + photo upload (max 5)
- Rating categories: service, staff, ambiance, value
- Business owner can respond publicly
- Flag inappropriate reviews for admin review
- Verified badge for completed-visit reviews

**Acceptance Criteria:**
- [ ] Only customers with completed appointment can review
- [ ] Review appears after 24h delay (prevents immediate retaliation)
- [ ] Business owner notification on new review
- [ ] Average rating recalculates in real-time
- [ ] Admin can suppress reviews violating guidelines

---

### 3.14 Payment Integration

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User** | Customer, Business Owner, Admin |

**Requirements:**
- Stripe integration for card payments
- Business-configurable: full payment, deposit, or pay-at-venue
- Support for: cards, Apple Pay, Google Pay
- Automatic invoicing and receipts
- Refund processing with policy enforcement
- Platform fee deduction and payout to business (weekly)

**Acceptance Criteria:**
- [ ] Payment intent created on booking confirm, captured on service completion or immediately per config
- [ ] 3D Secure handled for applicable cards
- [ ] Failed payment releases slot and notifies user
- [ ] Business owner sees payout schedule and history
- [ ] Admin dashboard shows platform revenue and pending payouts

---

### 3.15 Notifications

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User** | All |

**Requirements:**
- Channels: push (Firebase), email (SendGrid), SMS (Twilio)
- Customer: booking confirm, reminder (24h, 2h), change/cancel, promo
- Business: new booking, cancellation, daily digest
- Preferences: per-channel opt-in/out by notification type
- Templates with variables, localized

**Acceptance Criteria:**
- [ ] Notification delivers within 60 seconds of trigger
- [ ] Unsent notifications queue with retry (max 3)
- [ ] User preference changes apply immediately
- [ ] Rich push with deep link to relevant screen

---

### 3.16 Provider / Business Owner Portal

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Business Owner |

**Requirements:**
- Dashboard: today's bookings, revenue this week, upcoming week preview
- Business settings: profile, hours, services, staff management
- Booking calendar with drag-and-drop reschedule
- Customer database with visit history and notes
- Analytics: booking volume, cancellation rate, revenue trends, peak hours
- Settings: cancellation policy, payment preferences, notification rules

**Acceptance Criteria:**
- [ ] Portal is responsive; primary use on tablet/desktop
- [ ] Staff can be granted limited permissions (view-only, manage own calendar)
- [ ] CSV export of customer list and financial reports
- [ ] Integration with personal calendar (two-way sync optional)

---

### 3.17 Admin Dashboard

| Attribute | Detail |
|-----------|--------|
| **Priority** | P2 |
| **User** | Admin |

**Requirements:**
- Overview: active users, bookings today, revenue, businesses onboarded
- Business management: approve, suspend, feature, view details
- User management: search, view activity, suspend
- Dispute resolution: refund approval, review mediation
- System health: queue status, error rates, API performance
- Content management: category config, promo codes, featured businesses

**Acceptance Criteria:**
- [ ] Role-based access (super admin, support agent, finance)
- [ ] Audit log of all admin actions
- [ ] Bulk operations with confirmation
- [ ] Data export for compliance reporting

---

### 3.18 Background Jobs (BullMQ)

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User** | System |

**Requirements:**
- Job queues with Redis/BullMQ:
  - `notifications`: send push/email/SMS
  - `bookings`: slot hold expiration, no-show detection
  - `payments`: payout processing, failed payment retry
  - `reports`: daily/weekly business summaries
  - `cleanup`: expired tokens, old logs, soft-deleted data purge
- Job retry with exponential backoff
- Dead letter queue for failed jobs
- Job monitoring dashboard

**Acceptance Criteria:**
- [ ] Job processes within 5 minutes of scheduling (99.9%)
- [ ] Failed job alerts admin after 3 retries
- [ ] Queue depth monitoring triggers scaling alert
- [ ] Job idempotency: duplicate execution has no side effect

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | Page load <2s, API response <200ms (p95) |
| **Availability** | 99.9% uptime, planned maintenance windows |
| **Security** | OWASP Top 10 mitigation, encryption at rest and in transit |
| **Scalability** | Support 10k concurrent users, horizontal scaling |
| **Compliance** | GDPR, PCI-DSS (payments), accessibility WCAG 2.1 AA |

---

## 5. Prioritization Summary

| Priority | Features |
|----------|----------|
| **P0 (Critical)** | User Authentication, Guest Browse, Business Search, Business Detail, Service Categories, Booking Flow, Appointment Management, Availability Engine, Shared Types/Design System, Business Owner Portal |
| **P1 (Important)** | Map Search, Favorites, User Profile, Reviews, Payments, Notifications, Background Jobs |
| **P2 (Valuable)** | Admin Dashboard, Advanced Analytics, Loyalty Program |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | >15% of searchers |
| User registration rate | >30% of guests |
| Booking cancellation rate | <10% |
| Business owner activation | >80% complete profile |
| NPS score | >50 |
| App store rating | >4.5 stars |

---

*Document Version: 1.0 | Last Updated: 2024 | Owner: Alex, Product Owner*