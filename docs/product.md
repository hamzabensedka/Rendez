# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Version:** 1.0.0  
**Last Updated:** 2024  
**Owner:** Alex (Product Owner)  

Planity Clone is a comprehensive appointment booking platform connecting customers with local service businesses (salons, barbershops, spas, clinics). The platform enables users to discover businesses, view services, check real-time availability, and book appointments seamlessly. Business owners manage their schedules, services, and client relationships through a dedicated portal.

---

## 2. Personas

| ID | Name | Role | Goals |
|----|------|------|-------|
| P1 | Sarah | Customer | Find and book beauty appointments quickly, manage her schedule |
| P2 | Marco | Business Owner | Manage bookings, reduce no-shows, grow his client base |
| P3 | Admin Lisa | Platform Admin | Monitor platform health, support users, ensure quality |
| P4 | New Visitor | Guest | Browse services without committing to registration |

---

## 3. Feature Specifications

---

### 3.1 User Authentication
**Priority:** P0 (Critical)  
**Story:** As a user, I want to securely create an account and log in so that I can access personalized features.

| Aspect | Specification |
|--------|---------------|
| Registration Methods | Email/password, Google OAuth, Apple Sign-In |
| Login Methods | Email/password, Google, Apple, Magic Link (optional) |
| Password Requirements | Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char |
| Email Verification | Required before booking; 24hr expiry on verification token |
| Password Reset | Self-service via email with 1hr expiry token |
| Session Management | JWT access token (15min) + refresh token (7 days); device tracking |
| Roles | `customer`, `business_owner`, `admin` |

**Acceptance Criteria:**
- [ ] User can register with email/password and receive verification email
- [ ] User can login with valid credentials and receive JWT tokens
- [ ] User cannot access protected routes without valid token
- [ ] Refresh token rotation implemented; stolen refresh tokens invalidated
- [ ] OAuth users have profile auto-created with verified email
- [ ] Password reset flow completes successfully end-to-end
- [ ] Account lockout after 5 failed attempts (30 min)

---

### 3.2 Guest Browse & Explore
**Priority:** P0 (Critical)  
**Story:** As a guest, I want to browse businesses and services without creating an account.

| Aspect | Specification |
|--------|---------------|
| Accessible Content | Business listings, service catalogs, reviews, basic business info |
| Restricted Actions | Booking, favorites, appointment management, leaving reviews |
| Guest Prompt | CTA to register/login appears on restricted action attempts |
| Search & Filter | Full search functionality available to guests |
| Map View | Available to guests with full business markers |

**Acceptance Criteria:**
- [ ] Guest can view business list without authentication
- [ ] Guest can search and filter businesses
- [ ] Guest can view business details, services, and reviews
- [ ] Guest is prompted to login when attempting to book
- [ ] Guest state preserved post-login (redirect to intended action)

---

### 3.3 Business Search & Discovery
**Priority:** P0 (Critical)  
**Story:** As a customer, I want to find relevant businesses quickly using multiple search criteria.

| Aspect | Specification |
|--------|---------------|
| Text Search | Business name, service name, description (fuzzy matching) |
| Filters | Category, price range, rating (min stars), availability today, gender-specific |
| Sort Options | Relevance, rating (highest), price (low to high), distance (nearest) |
| Pagination | Cursor-based, 20 results per page |
| Auto-complete | Suggestions after 3 characters; businesses, services, categories |
| Recent Searches | Store last 10 searches for logged-in users |
| Popular Searches | Trending categories displayed for empty state |

**Acceptance Criteria:**
- [ ] Search returns results matching business name within 500ms
- [ ] Filters combine with AND logic; can be cleared individually
- [ ] Results sorted by selected option correctly
- [ ] Empty state shows popular categories and nearby businesses
- browsing history not stored for guests |

---

### 3.4 Map-based Search
**Priority:** P0 (Critical)  
**Story:** As a customer, I want to see businesses on a map to find convenient locations.

| Aspect | Specification |
|--------|---------------|
| Map Provider | Mapbox or Google Maps |
| Default View | User's current location (with permission) or city center |
| Markers | Color-coded by category; cluster at zoom levels > 50 markers |
| Marker Info | Business name, rating, price indicator on tap/click |
| Radius Search | Adjustable 1-50km; results update on map move (debounced 300ms) |
| List/Map Toggle | Seamless switch between views; state synchronized |
| Directions | External link to native maps app for turn-by-turn |

**Acceptance Criteria:**
- [ ] Map loads with user location or default city center
- [ ] Business markers display accurately at correct coordinates
- [ ] Clustering groups nearby markers at appropriate zoom levels
- [ ] Map pan/zoom triggers new search with debounce
- [ ] Tapping marker navigates to business detail
- [ ] List and map views show consistent results

---

### 3.5 Business Detail View
**Priority:** P0 (Critical)  
**Story:** As a customer, I want comprehensive business information to make informed booking decisions.

| Aspect | Specification |
|--------|---------------|
| Header | Business name, verified badge, favorite toggle, share button |
| Gallery | Up to 10 images; carousel with pinch-zoom on mobile |
| Info Section | Address, phone, hours (today + full week), website link |
| Services | Categorized list with prices, durations, descriptions |
| Team | Staff profiles with photos, specialties, ratings |
| Reviews | Aggregate rating, rating distribution, recent reviews |
| Availability Preview | Next 3 available slots; link to full booking flow |
| Similar Businesses | Carousel of related businesses in area |

**Acceptance Criteria:**
- [ ] All business data displays accurately from API
- [ ] Image gallery supports swipe and zoom gestures
- [ ] Business hours reflect current day with "Open/Closed" status
- [ ] Services grouped by category with expand/collapse
- [ ] Reviews paginated 5 per page; sort by newest/most helpful
- [ ] Deep linking to business detail works from external sources

---

### 3.6 Service Categories
**Priority:** P0 (Critical)  
**Story:** As a platform, we need organized service categories for discoverability and business management.

| Aspect | Specification |
|--------|---------------|
| Hierarchy | Category → Subcategory → Service |
| Top Categories | Hair, Nails, Face salon, Barber, Spa & Wellness, Medical Aesthetic, Tattoo & Piercing |
| Category Icons | Consistent iconography per category |
| Business Assignment | Businesses assigned to 1+ categories; services linked to subcategories |
| Dynamic Discovery | Trending categories surfaced based on user behavior and seasonality |
| Category Landing | Dedicated page with featured businesses, popular services, new arrivals |

**Acceptance Criteria:**
- [ ] All services belong to exactly one subcategory and category
- [ ] Category pages load with relevant businesses and services
- [ ] Category hierarchy navigable in filters and business setup
- [ ] Trending categories update based on booking analytics

---

### 3.7 Booking Flow
**Priority:** P0 (Critical)  
**Story:** As a customer, I want to book appointments with minimal friction and clear confirmation.

| Aspect | Specification |
|--------|---------------|
| Entry Points | Business detail (service selection), quick book from search, rebook from history |
| Steps | 1. Select service(s) → 2. Select staff (optional) → 3. Pick date/time → 4. Confirm details → 5. Payment (if required) → 6. Confirmation |
| Service Selection | Single or multiple services; duration and price calculated dynamically |
| Staff Selection | "Any available" or specific staff member; show staff ratings |
| Date/Time | Calendar view with available slots; gray out unavailable; timezone handling |
| Guest Booking | Allow booking with email/phone; prompt account creation post-booking |
| Hold Slot | 10-minute hold during checkout; release if payment not completed |
| Confirmation | In-app, email, and push notification; add to calendar (ICS) |
| Cancellation Policy | Displayed before confirmation; enforce based on business rules |

**Acceptance Criteria:**
- [ ] User can complete booking in under 60 seconds (measured from service selection)
- [ ] Slot availability computed in real-time; no double-booking possible
- [ ] Payment processed securely before final confirmation
- [ ] Confirmation includes all booking details and cancellation policy
- [ ] Calendar invite generated with correct timezone
- [ ] Booking fails gracefully with clear error if slot taken during checkout

---

### 3.8 Appointment Management
**Priority:** P0 (Critical)  
**Story:** As a customer, I want to view and manage my appointments easily.

| Aspect | Specification |
|--------|---------------|
| Views | Upcoming (default), Past, Cancelled |
| Details | Business info, services, staff, date/time, status, directions, contact |
| Actions | Reschedule (if allowed), Cancel, Rebook, Add to Calendar |
| Reschedule | Within business rules; new slot availability checked in real-time |
| Cancellation | Per business policy; automated refund if prepaid |
| Reminders | 24hr and 1hr before via push and email (configurable) |
| No-Show Handling | Marked by business; affects future booking privileges if pattern |

**Acceptance Criteria:**
- [ ] Upcoming appointments sorted by date ascending
- [ ] Cancelled appointments show cancellation reason and timestamp
- [ ] Reschedule enforces business cancellation window
- [ ] Push reminders delivered reliably (tracked via delivery receipts)
- [ ] Past appointments reviewable with rebook option

---

### 3.9 Favorites
**Priority:** P1 (High)  
**Story:** As a customer, I want to save favorite businesses for quick access.

| Aspect | Specification |
|--------|---------------|
| Add/Remove | Heart toggle on business cards and detail; haptic feedback on mobile |
| List View | Grid/list of favorited businesses; sort by recently added, name |
| Quick Actions | Book now, view details, remove from favorites |
| Notifications | Optional: notify of new services or promotions from favorites |
| Sync | Cross-device for logged-in users |

**Acceptance Criteria:**
- [ ] User can favorite/unfavorite with single tap
- [ ] Favorites persist across sessions and devices
- [ ] Favorites list loads in under 1 second
- [ ] Empty state with discovery CTA

---

### 3.10 User Profile
**Priority:** P1 (High)  
**Story:** As a user, I want to manage my personal information and preferences.

| Aspect | Specification |
|--------|---------------|
| Profile Info | Name, email, phone, profile photo, date of birth (optional) |
| Preferences | Notification settings (email, push, SMS), language, timezone |
| Payment Methods | Saved cards (tokenized), default payment method |
| Booking History | All appointments with filter and search |
| Privacy | Data export (GDPR), account deletion with 30-day grace period |
| Security | Change password, 2FA option, active sessions management |

**Acceptance Criteria:**
- [ ] Profile updates reflect immediately across app
- [ ] Photo upload with crop and compression (max 2MB)
- [ ] Notification preferences respected for all channels
- [ ] Account deletion initiates data anonymization process
- [ ] Data export delivers complete user data within 24 hours

---

### 3.11 Availability & Slot Computation
**Priority:** P0 (Critical)  
**Story:** As a platform, we need accurate, real-time availability to prevent double-booking.

| Aspect | Specification |
|--------|---------------|
| Business Hours | Configurable per day; split shifts supported; holiday overrides |
| Breaks | Lunch, cleaning, ad-hoc blocks (recurring or one-time) |
| Service Duration | Fixed or variable; buffer time between appointments configurable |
| Staff Assignment | Services linked to qualified staff; availability per staff member |
| Real-time Computation | Slot availability computed on request; cached 30 seconds |
| Timezone Handling | All times stored in UTC; displayed in business timezone or user preference |
| Buffer Rules | Pre/post appointment buffers; travel time between locations |
| Overbooking | Configurable; default disabled |

**Acceptance Criteria:**
- [ ] Slots generated accurately based on business hours and breaks
- [ ] No overlapping bookings possible (database constraint + application check)
- [ ] Staff-specific availability respected when staff selected
- [ ] Timezone conversion correct for all edge cases (DST)
- [ ] Cache invalidation on any schedule change
- [ ] Performance: slot computation < 200ms for 30-day range

---

### 3.12 Shared Types & Design System
**Priority:** P1 (High)  
**Story:** As a development team, we need consistent UI/UX patterns for rapid, coherent development.

| Aspect | Specification |
|--------|---------------|
| Design Tokens | Colors (primary, secondary, semantic), typography (font families, sizes), spacing scale, border radius, shadows |
| Components | Buttons, inputs, cards, modals, toasts, loaders, empty states, error states |
| Icons | Lucide or similar; consistent sizing and stroke width |
| Layouts | Mobile-first responsive; max-width containers for desktop |
| Animations | Consistent transitions (200-300ms ease), loading skeletons |
| Accessibility | WCAG 2.1 AA minimum; focus states, alt text, ARIA labels |
| Theme | Light mode default; dark mode planned v2 |

**Acceptance Criteria:**
- [ ] All UI components use design tokens exclusively
- [ ] No hardcoded values in component implementations
- [ ] Component library documented with Storybook or equivalent
- [ ] Accessibility audit passes automated checks
- [ ] Consistent experience across iOS, Android, and web

---

### 3.13 Reviews & Ratings
**Priority:** P1 (High)  
**Story:** As a customer, I want to read and write reviews to make informed decisions and share experiences.

| Aspect | Specification |
|--------|---------------|
| Eligibility | Verified customers who completed appointment (prevented pre-visit) |
| Rating | 1-5 stars overall; optional sub-ratings: service, staff, ambiance, value |
| Review Content | Text (max 1000 chars), photos (max 5, 5MB each) |
| Moderation | Auto-flag profanity; manual review queue; business response capability |
| Display | Aggregate rating, rating distribution, recent reviews, photos |
| Sorting | Most recent, highest rated, most helpful |
| Helpful Votes | Users can mark reviews as helpful |
| Response | Business owners can respond publicly to reviews |

**Acceptance Criteria:**
- [ ] Only verified customers can submit reviews
- [ ] Review appears after moderation or immediately with post-moderation
- [ ] Business owner notification on new review
- [ ] Photos in reviews display in gallery with zoom
- [ ] Fake review detection flags suspicious patterns

---

### 3.14 Payment Integration
**Priority:** P0 (Critical)  
**Story:** As a customer, I want secure, flexible payment options for my bookings.

| Aspect | Specification |
|--------|---------------|
| Provider | Stripe (primary); PayPal (optional v2) |
| Methods | Cards (tokenized), Apple Pay, Google Pay, SEPA (EU) |
| Flows | Pay at booking, pay at venue, deposit + balance, gift cards |
| Saved Methods | Secure vault; customer can manage in profile |
| Refunds | Full and partial; automated per cancellation policy; manual override by business |
| Receipts | Email receipt; in-app invoice download |
| Fees | Transparent fee display; platform fee + payment processing fee |
| Security | PCI compliance via Stripe Elements; no raw card data touches servers |
| Webhooks | Idempotent handling for all Stripe events |

**Acceptance Criteria:**
- [ ] Payment intent created and confirmed securely
- [ ] 3D Secure handled for applicable cards
- [ ] Failed payment shows clear error with retry option
- [ ] Refund processed within business policy timeframe
- [ ] Webhook failures retried with exponential backoff
- [ ] All payment states handled (requires_payment_method, requires_action, succeeded, etc.)

---

### 3.15 Notifications
**Priority:** P1 (High)  
**Story:** As a user, I want timely notifications about my bookings and relevant updates.

| Aspect | Specification |
|--------|---------------|
| Channels | Push (mobile), email, SMS (optional), in-app |
| Types | Booking confirmation, reminder (24h, 1h), cancellation, rescheduling, promotion, review request |
| Preferences | Granular control per channel and notification type |
| Templates | Branded, localized, personalized with user/business names |
| Delivery | Reliable delivery with retry; deduplication for multi-channel |
| Deep Linking | Notifications navigate to relevant screen |
| Quiet Hours | Respect user timezone; no push 22:00-08:00 unless urgent |

**Acceptance Criteria:**
- [ ] Notification delivered within 30 seconds of trigger
- [ ] Preferences respected; no notifications to disabled channels
- [ ] Deep links navigate correctly on cold and warm starts
- [ ] Unsubscribe from marketing honored immediately
- [ ] Notification history available in-app

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 (Critical)  
**Story:** As a business owner, I want to manage my business, staff, and appointments efficiently.

| Aspect | Specification |
|--------|---------------|
| Dashboard | Today's appointments, revenue snapshot, upcoming week overview, quick actions |
| Calendar View | Day/week/month views; drag-to-reschedule; color-coded by status |
| Appointment Management | View details, confirm, cancel, mark no-show, add notes |
| Service Management | CRUD services, pricing, duration, staff assignment |
| Staff Management | Add staff, set permissions, manage individual schedules |
| Business Settings | Hours, breaks, holidays, booking policies, cancellation rules |
| Client Management | Client list, booking history, notes, marketing opt-in status |
| Analytics | Revenue, bookings, cancellation rate, popular services, staff performance |
| Reviews | View and respond to reviews; flag inappropriate content |

**Acceptance Criteria:**
- [ ] Dashboard loads all widgets in under 2 seconds
- [ ] Calendar supports real-time updates via WebSocket
- [ ] Staff can have restricted access (view only, manage own schedule)
- [ ] Business settings apply immediately to availability computation
- [ ] Analytics exportable to CSV/PDF
- [ ] Mobile-responsive for on-the-go management

---

### 3.17 Admin Dashboard
**Priority:** P1 (High)  
**Story:** As a platform admin, I need oversight and control over the entire platform.

| Aspect | Specification |
|--------|---------------|
| Overview | KPIs: users, bookings, revenue, businesses, growth trends |
| User Management | Search, view, suspend, impersonate (with audit log) |
| Business Management | Approve new businesses, verify, feature, suspend |
| Content Moderation | Review flagged reviews, photos, business listings |
| Financial | Transaction monitoring, refund processing, payout management |
| Support | Ticket system, user communication tools |
| System Health | API performance, error rates, queue depths, database status |
| Audit Log | All admin actions logged with admin ID, timestamp, before/after state |

**Acceptance Criteria:**
- [ ] Real-time KPIs update without page refresh
- [ ] Admin actions require confirmation and are fully audited
- [ ] Impersonation requires secondary approval and auto-logs out
- [ ] Content moderation decisions trigger notifications to affected parties
- [ ] System health dashboard shows all critical services status

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P1 (High)  
**Story:** As a platform, we need reliable asynchronous processing for scalability.

| Aspect | Specification |
|--------|---------------|
| Queue System | BullMQ with Redis; separate queues by job type |
| Job Types | Email sending, push notifications, SMS, payment webhooks, report generation, data exports, cleanup tasks, analytics aggregation |
| Retry Policy | Exponential backoff; max 5 retries; dead letter queue for failures |
| Monitoring | Dashboard showing queue depths, processing rates, failed jobs |
| Scheduling | Cron jobs for recurring tasks (daily reports, cleanup) |
| Concurrency | Configurable workers per queue type |
| Idempotency | All jobs idempotent with unique job IDs |

**Acceptance Criteria:**
- [ ] Jobs process within expected SLA (email < 5 min, push < 30 sec)
- [ ] Failed jobs retry with backoff; manual retry from dashboard
- [ ] Queue depth alerts trigger before critical thresholds
- [ ] No job loss on worker restart (Redis persistence)
- [ ] Job processing metrics visible in monitoring dashboard

---

## 4. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | API response < 200ms (p95); page load < 2s; time to interactive < 3s |
| Scalability | Support 10,000 concurrent users; 1M bookings/month |
| Security | OWASP Top 10 mitigation; penetration testing annually |
| Compliance | GDPR, CCPA, PCI-DSS (via Stripe) |
| Availability | 99.9% uptime SLA; automated failover |
| Monitoring | APM, error tracking, log aggregation, alerting |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| User Registration Rate | > 30% of app opens |
| Booking Completion Rate | > 60% of checkout starts |
| Search-to-Book Conversion | > 15% |
| Business Owner Retention | > 80% at 6 months |
| App Store Rating | > 4.5 stars |
| Customer Support Tickets | < 2% of bookings |

---

## 6. Roadmap

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Search, Business Detail, Booking, Payments, Basic Portal | Month 1-2 |
| v1.1 | Map Search, Favorites, Reviews, Notifications | Month 3 |
| v1.2 | Advanced Portal, Admin Dashboard, Analytics | Month 4 |
| v2.0 | AI Recommendations, Subscription Plans, Marketplace | Month 6+ |

---

*Document maintained by Product Team. For questions, contact alex@planity-clone.io*
