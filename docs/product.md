# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with local service businesses (salons, barbershops, spas, clinics) for appointment booking. The platform serves three user types: **Customers** (book appointments), **Business Owners** (manage their business), and **Admin** (platform oversight).

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | Wants to discover and book services quickly | Find available slots, book, manage appointments |
| **Guest** | Unregistered user exploring the platform | Browse businesses without commitment |
| **Business Owner** | Manages one or more service businesses | Configure services, hours, staff; manage bookings |
| **Admin** | Platform operator | Monitor health, resolve disputes, manage business onboarding |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 (Critical)

**Description:** Secure identity management for customers and business owners.

**Functional Requirements:**
- Email/password registration with validation
- Social login (Google, Apple)
- Phone number verification via SMS ( developer: Twilio or similar)
- JWT-based session management with refresh token rotation
- Password reset via email
- Role-based access control (customer, business_owner, admin)

**Acceptance Criteria:**
- [ ] User can register with email, password, full name, phone number
- [ ] Password requires minimum 8 characters, 1 uppercase, 1 number
- [ ] Email verification required before booking
- [ ] Social login creates account or links to existing
- [ ] Token refresh is transparent to user, max 30 days idle
- [ ] Rate limiting: 5 login attempts per 15 minutes

---

### 3.2 Guest Browse & Explore

**Priority:** P0

**Description:** Unauthenticated access to discover businesses and services.

**Functional Requirements:**
- View business listings without login
- Search by category, location, service
- View business profiles, services, and reviews
- Prompted to login only at booking initiation

**Acceptance Criteria:**
- [ ] Guest sees full business directory with no account
- [ ] "Book Now" CTA triggers login/signup modal
- [ ] Guest search history stored in localStorage, merged on login
- [ ] No personal data collection from guests

---

### 3.3 Business Search & Discovery

**Priority:** P0

**Description:** Find businesses through multiple discovery paths.

**Functional Requirements:**
- Text search across business name, service name, description
- Filter by: category, price range, rating, distance, availability ("open now"), amenities
- Sort by: relevance, distance, rating, price (low to high)
- Auto-complete search suggestions
- Recent searches and trending searches

**Acceptance Criteria:**
- [ ] Search returns results within 200ms for cached queries
- [ ] Empty states guide users to adjust filters
- [ ] Location permission requested once; fallback to manual city selection
- [ ] Results show: business photo, name, rating, distance, next available slot, price from

---

### 3.4 Map-based Search

**Priority:** P0

**Description:** Visual exploration of businesses on interactive map.

**Functional Requirements:**
- Map with business pins (clustered at zoom levels)
- Tap pin to preview card; tap card to detail view
- User location dot with accuracy ring
- "Search this area" on map pan
- List/map toggle with synced state

**Acceptance Criteria:**
- [ ] Map loads in under 2s on 4G
- [ ] Max 50 pins rendered; clustering for density
- [ ] Pin color indicates availability (green = slots today, gray = none)
- [ ] Map bounds passed to search API for filtering

---

### 3.5 Business Detail View

**Priority:** P0

**Description:** Comprehensive business profile with all booking-relevant information.

**Functional Requirements:**
- Image gallery (up to 10 photos)
- Business info: name, address, phone, website, hours
- Services list with pricing and duration
- Staff/professionals with bios and photos
- Reviews summary and detail
- "Book" CTA per service
- Share business (deep link)

**Acceptance Criteria:**
- [ ] Page loads core info in under 1.5s
- [ ] Hours show current day status; closed days grayed
- [ ] Services grouped by category
- [ ] "Call" and "Get Directions" actions available
- [ ] Photos swipeable with pinch-to-zoom

---

### 3.6 Service Categories

**Priority:** P0

**Description:** Hierarchical classification of services.

**Functional Requirements:**
- Platform-managed category tree (e.g., Hair > Coloring > Balayage)
- Business can map services to categories
- Category-based browsing and filtering
- Category icons and localized names

**Acceptance Criteria:**
- [ ] Max 3 levels of category depth
- [ ] Each service belongs to exactly one leaf category
- [ ] Category changes versioned; existing bookings unaffected
- [ ] Analytics track category popularity

---

### 3.7 Booking Flow

**Priority:** P0

**Description:** Core conversion flow for appointment reservation.

**Functional Requirements:**
- Step 1: Select service (with variant/options if applicable)
- Step 2: Select staff member (or "no preference")
- Step 3: Select date and available slot
- Step 4: Review and confirm (with payment if required)
- Guest checkout: collect name, phone, email; create account post-booking

**Acceptance Criteria:**
- [ ] Slot selection prevents double-booking (optimistic locking)
- [ ] Booking confirmation within 3 seconds
- [ ] 10-minute hold on slot during checkout; auto-release
- [ ] Booking reference generated (QR code for in-store)
- [ ] Calendar invitation (.ics) optional
- [ ] Cancellation policy shown before confirm

---

### 3. Immobility Management

**Priority:** P0

**Description:** Full lifecycle management of customer appointments.

**Functional Requirements:**
- View upcoming and past appointments
- Reschedule (with availability check)
- Cancel with reason (no-show, changed plans, etc.)
- Rebook previous service
- Add to phone calendar

**Acceptance Criteria:**
- [ ] Upcoming appointments sort by date ascending
- [ ] Cancel button available until cutoff (configurable, default 2 hours before)
- [ ] Reschedule shows only future available slots
- [ ] Push notification 24h and 1h before appointment
- [ ] Past appointments show rating prompt (if unrated)

---

### 3.9 Favorites

**Priority:** P1 (High)

**Description:** Save businesses for quick re-access.

**Functional Requirements:**
- Toggle favorite from business card or detail
- Favorites list with quick book
- Favorite count on business (public)

**Acceptance Criteria:**
- [ ] Heart icon toggles with haptic feedback
- [ ] Favorites synced across devices
- [ ] Maximum 200 favorites per user
- [ ] Favorites accessible offline (cached)

---

### 3.10 User Profile

**Priority:** P1

**Description:** Customer account management.

**Functional Requirements:**
- Edit personal info (name, phone, photo)
- Notification preferences (push, email, SMS)
- Payment methods management
- Booking history with receipts
- Data export (GDPR)
- Account deletion

**Acceptance Criteria:**
- [ ] Profile photo upload with crop (1:1, max 5MB)
- [ ] Changes sync immediately
- [ ] Account deletion initiates 30-day grace period
- [ ] Data export delivered within 24 hours via email

---

### 3.11 Availability & Slot Computation

**Priority:** P0

**Description:** Core algorithm for generating bookable time slots.

**Functional Requirements:**
- Business defines: operating hours, break times, slot duration per service
- Staff availability (time off, working hours)
- Buffer time between appointments
- Support for concurrent bookings (e.g., group classes)
- Time zone handling

**Acceptance Criteria:**
- [ ] Slots computed on-demand, cached 5 minutes
- [ ] Past dates excluded; future bookable up to 90 days
- [ ] DST transitions handled without errors
- [ ] Business can block specific dates (holiday closure)
- [ ] Algorithm returns slots in <100ms for single staff, <300ms for all staff

---

### 3.12 Shared Types & Design System

**Priority:** P0

**Description:** Consistent UI/UX across platform.

**Functional Requirements:**
- Component library: buttons, inputs, cards, modals, date pickers
- Color tokens, typography scale, spacing system
- Dark mode support
- Accessibility: WCAG 2.1 AA minimum

**Acceptance Criteria:**
- [ ] All interactive elements minimum 44x44pt touch target
- [ ] Screen reader labels on all images and icons
- [ ] Focus indicators visible
- [ ] Color contrast ratio 4.5:1 minimum for text

---

### 3.13 Reviews & Ratings

**Priority:** P1

**Description:** Social proof and quality feedback.

**Functional Requirements:**
- 5-star rating with text review
- Photo upload option
- Business owner response
- Flag inappropriate content
- Verified purchase badge (completed appointment)

**Acceptance Criteria:**
- [ ] Reviews solicited 24h after appointment
- [ ] Minimum 10 characters for text review
- [ ] Editable within 14 days
- [ ] Business response shown below review
- [ ] Average rating recalculated nightly

---

### 3.14 Payment Integration

**Priority:** P1

**Description:** Secure handling of customer payments.

**Functional Requirements:**
- Stripe/PayPal integration
- Card on file for quick checkout
- Deposit or full payment options
- Refund processing (full and partial)
- Invoice generation

**Acceptance Criteria:**
- [ ] PCI compliance via tokenization (no card data stored)
- [ ] 3D Secure for applicable cards
- [ ] Payment confirmation within 5 seconds
- [ ] Failed payment with retry option
- [ ] Refunds processed within 5-10 business days

---

### 3.15 Notifications

**Priority:** P1

**Description:** Multi-channel communication system.

**Functional Requirements:**
- Push notifications (Firebase Cloud Messaging)
- SMS (Twilio)
- Email (SendGrid)
- In-app notification center
- Preference management per channel

**Acceptance Criteria:**
- [ ] Critical notifications (booking confirmed, cancelled) sent immediately
- - [ ] Reminder notifications batchable (e.g., morning digest)
- [ ] Failed push falls back to SMS for critical
- [ ] Notification history retained 90 days

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0

**Description:** Self-service management for business owners.

**Functional Requirements:**
- Dashboard: upcoming appointments, revenue, occupancy rate
- Calendar view (day/week/month) with drag-drop reschedule
- Service management (CRUD)
- Staff management with permissions
- Customer management (notes, history)
- Settings: hours, cancellation policy, booking rules

**Acceptance Criteria:**
- [ ] Portal responsive on tablet and desktop
- [ ] Real-time updates via WebSocket
- [ ] Export bookings to CSV
- [ ] Multi-location switcher (if applicable)
- [ ] Role-based access: owner, manager, staff

---

### 3.17 Admin Dashboard

**Priority:** P2 (Medium)

**Description:** Platform administration and oversight.

**Functional Requirements:**
- Business onboarding and verification
- User management (search, view, suspend)
- Transaction monitoring
- Content moderation (reviews, business photos)
- Analytics: MAU, bookings, GMV, churn
- System health monitoring

**Acceptance Criteria:**
- [ ] Admin actions audited (who, what, when)
- [ ] Bulk operations available (export, message)
- [ ] Alerts for anomalous patterns (fraud, abuse)

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P1

**Description:** Asynchronous processing for reliability and performance.

**Functional Requirements:**
- Job queues: notifications, payments, reports, data exports, search index updates
- Retry with exponential backoff
- Dead letter queue for failed jobs
- Job monitoring and manual retry

**Acceptance Criteria:**
- [ ] Jobs processed within 5 minutes of enqueue (standard priority)
- [ ] Failed jobs retried 3 times before DLQ
- [ ] Queue depth and processing rate visible in admin
- [ ] Graceful shutdown: finish in-progress jobs before exit

---

## 4. Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | API p95 < 200ms; page load < 2s |
| Availability | 99.9% uptime SLA |
| Security | OWASP Top 10 mitigation; annual penetration test |
| Scalability | Support 10,000 concurrent users |
| Compliance | GDPR, CCPA, PCI DSS |

---

## 5. Analytics & Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Booking conversion rate | >15% | Bookings / unique visitors |
| Search-to-book time | <3 min | Time from first search to confirmation |
| Cancellation rate | <10% | Cancelled / total bookings |
| NPS | >50 | Post-booking survey |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Search, Business Detail, Booking, Appointments, Business Owner Portal | 8 weeks |
| V1 | Map, Reviews, Favorites, Profile, Notifications | +4 weeks |
| V2 | Payment, Admin, Background Jobs, Analytics | +4 weeks |

---

*Document version: 1.0*
*Last updated: 2024*
*Owner: Alex, Product Owner*