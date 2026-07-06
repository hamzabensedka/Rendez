# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a marketplace platform connecting customers with local service businesses (beauty, wellness, health). Customers discover, book, and manage appointments. Business owners manage their availability, services, and bookings. Admins oversee platform health and user management.

**Target Users:** Customers seeking appointments, Business Owners (Providers), Platform Administrators

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|-------------|
| **Registration Methods** | Email/password, Google OAuth, Apple Sign-In |
| **Login** | JWT-based session with refresh token rotation; biometric login (Face ID/Touch ID) on mobile |
| **Password Recovery** | Secure token-based reset via email, 1-hour expiry |
| **Account Linking** | Merge social and email accounts by verified email match |
| **Session Management** | Max 5 concurrent sessions; forced logout on suspicious activity |

**Acceptance Criteria:**
- [ ] User can register with email, verify via 6-digit code
- [ ] User can login with valid credentials and receive access + refresh tokens
- [ ] User can reset password via email link
- [ ] Social login creates account or links to existing matching email
- [ ] Biometric prompt appears after first successful password login on supported device
- [ ] Sessions expire after 7 days of inactivity
- [ ] Rate limit: 5 login attempts per 15 minutes

---

### 2.2 Guest Browse & Explore
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|-------------|
| **Access Level** | No account required to browse businesses, services, and availability |
| **Limitations** | Booking requires account creation (prompted at checkout) |
| **Guest Data** | LocalStorage for session favorites; prompt to migrate on signup |

**Acceptance Criteria:**
- [ ] Unauthenticated user can view business listings and detail pages
- [ ] Unauthenticated user can search and filter results
- [ ] "Book" CTA triggers signup/login modal with pre-filled booking intent
- [ ] Guest favorites persist for 30 days, merge to account on registration

---

### 2.3 Business Search & Discovery
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|-------------|
| **Search Inputs** | Free text (business name, service), current location, saved address |
| **Filters** | Category, price range, rating (minimum stars), availability ("open now"), distance radius, amenities |
| **Sorting** | Relevance (default), distance, rating, price (low-high), availability (soonest) |
| **Results Display** | Card list with thumbnail, name, rating, distance, starting price, next available slot |
| **Auto-complete** | Suggest businesses, services, and locations as user types |

**Acceptance Criteria:**
- [ ] Search returns results within 500ms for 95th percentile
- [ ] Empty state suggests popular categories nearby
- [ ] Filter combination produces accurate results (test: category + price + rating)
- [ ] " spectacled search history saved for authenticated users
- [ ] Results update dynamically as filters change

---

### 2.4 Map-based Search
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|-------------|
| **Map Provider** | Mapbox or Google Maps |
| **Default View** | User's current location or last searched area |
| **Markers** | Clustered pins color-coded by category; selected business highlights |
| **Interactions** | Pan, zoom, tap marker for preview card, "re-center" button |
| **List/Map Toggle** | Seamless switch preserving search context and filters |

**Acceptance Criteria:**
- [ ] Map loads with user location dot and nearby business markers
- [ ] Pin tap opens bottom sheet with business preview (name, rating, image, CTA)
- [ ] Clustering handles 500+ businesses in dense area
- [ ] Map bounds filter results list in real-time
- [ ] Deep link to specific map coordinates and zoom level

---

### 2.5 Business Detail View
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|-------------|
| **Header** | Photo gallery (up to 10 images), business name, rating, review count, favorite toggle |
| **Info Section** | Address with directions link, phone, website, hours, COVID/safety notes |
| **Services Tab** | Categorized list with duration, description, price; tap to book |
| **Team Tab** | Staff profiles with photos, specialties, ratings; filter services by provider |
| **Reviews Tab** | Rating distribution, review list with photos, owner responses |
| **Availability Preview** | Next 3 available slots across next 7 days |

**Acceptance Criteria:**
- [ ] Page loads in <2s with image lazy-loading
- [ ] Photo gallery supports swipe, pinch-zoom, full-screen
- [ ] "Call" and "Get Directions" trigger native OS handlers
- [ ] Service selection pre-fills booking flow with correct service and provider
- [ ] Reviews paginate at 10 per page, sortable by newest or highest rated

---

### 2.6 Service Categories
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|-------------|
| **Hierarchy** | Category → Subcategory → Service (e.g., Hair → Coloring → Balayage) |
| **Category Examples** | Hair, Nails, Face, Body, Massage, Medical Aesthetic, Fitness, Wellness |
| **Attributes** | Icon, description, typical duration range, price range for search filters |
| **Business Assignment** | Businesses select relevant categories; services link to categories |

**Acceptance Criteria:**
- [ ] Category browse page with visual grid of all top-level categories
- [ ] Category detail shows subcategories and trending businesses
- [ ] Search by category returns businesses with any service in that category
- [ ] Admin can CRUD categories with icon upload

---

### 2.7 Booking Flow
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|-------------|
| **Entry Points** | Business detail service card, "Book Again" from history, direct link |
| **Step 1: Service Selection** | Select service, optional provider preference, add-ons |
| **Step 2: Date/Time** | Calendar view with available slots; show provider if specified |
| **Step 3: Details** | Guest info (if not logged in), special requests, consent for policies |
| **Step 4: Review & Confirm** | Order summary with cancellation policy, total price |
| **Step 5: Payment** | Integrated payment or "Pay at venue" option where allowed |
| **Confirmation** | Booking reference, calendar invite, add to Apple/Google Wallet |

**Acceptance Criteria:**
- [ ] Slot selection prevents double-booking (pessimistic locking, 10-min hold)
- [ ] Calendar shows 2 weeks forward, disabled past dates and fully-booked days
- [ ] Price updates dynamically with add-ons and selected provider
- [ ] Booking confirmation arrives via push, email, and in-app within 5 seconds
- [ ] Abandoned booking (hold expired) releases slot and notifies user
- [ ] Booking modification allowed up to defined cancellation threshold

---

### 2.8 Appointment Management
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|-------------|
| **Customer Views** | Upcoming (chronological), Past, Cancelled |
| **Actions** | Reschedule (re-enter booking flow with current details), Cancel with reason, Rebook |
| **Details Display** | Date/time countdown, QR code for check-in, directions, contact business, add note |
| **Reminders** | 24h and 1h before via push; SMS fallback if push disabled |

**Acceptance Criteria:**
- [ ] Upcoming appointments show in chronological order with next appointment highlighted
- [ ] Cancel requires confirmation modal; reason collected for analytics
- [ ] Reschedule respects same cancellation policy as original booking
- [ ] Past appointments show review prompt (if not reviewed, within 7 days)
- [ ] Calendar sync exports appointments with reminder 1 hour before

---

### 2.9 Favorites
**Priority:** P1 — High

| Aspect | Specification |
|--------|-------------|
| **Save Action** | Heart icon on business cards and detail; haptic feedback on toggle |
| **Favorites List** | Grid/list view, sorted by recently favorited; show next availability |
| **Notifications** | Optional: alert when favorite adds new service or has last-minute opening |

**Acceptance Criteria:**
- [ ] Toggle favorite with instant UI feedback and background sync
- [ ] Favorites persist across sessions and devices for authenticated users
- [ ] Offline: queue favorite toggle, sync on reconnect
- [ ] Empty state suggests nearby popular businesses

---

### 2.10 User Profile
**Priority:** P1 — High

| Aspect | Specification |
|--------|-------------|
| **Profile Data** | Photo, name, phone, email, birthday (for birthday offers), preferred location |
| **Preferences** | Notification settings, default search radius, privacy settings |
| **Linked Data** | Saved payment methods, addresses, appointment history |
| **Security** | Change password, 2FA option, active sessions list, delete account (GDPR) |

**Acceptance Criteria:**
- [ ] Profile photo upload with crop and compression (max 5MB)
- [ ] Email change requires re-verification
- [ ] Account deletion anonymizes data after 30-day grace period
- [ ] Export personal data as JSON (GDPR Article 20)

---

### 2.11 Availability & Slot Computation
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|-------------|
| **Business Hours** | Weekly recurring schedule + exception dates (holidays, closures) |
| **Provider Schedules** | Individual availability within business hours; breaks, time off |
| **Slot Generation** | Compute available slots based on: business hours, provider availability, service duration, existing bookings, buffer time between appointments |
| **Optimization** | Cache computed slots for 5 minutes; invalidate on booking change |
| **Buffer Rules** | Configurable: fixed buffer (e.g., 15 min), variable by service, or none |

**Acceptance Criteria:**
- [ ] Slot query for single business returns accurate availability in <200ms
- [ ] Concurrent bookings for same slot prevented at database level
- [ ] Provider time-off blocks all their slots without affecting others
- [ ] Last-minute booking cutoff respected (e.g., no bookings <2h before)
- [ ] Timezone handling: store UTC, display in business local time

---

### 2.12 Shared Types & Design System
**Priority:** P1 — High

| Aspect | Specification |
|--------|-------------|
| **Design Tokens** | Colors (primary, secondary, semantic states), typography scale, spacing scale, border radius, shadows |
| **Components** | Button variants, input states, cards, modals, toasts, skeleton loaders, empty states |
| **Accessibility** | WCAG 2.1 AA minimum: color contrast 4.5:1, focus indicators, screen reader labels, minimum touch target 44dp |
| **Theming** | Light/dark mode support; business branding override (accent color, logo) |

**Acceptance Criteria:**
- [ ] All UI components documented in Storybook with usage examples
- [ ] No custom one-off styles; all visual elements use design tokens
- [ ] Accessibility audit passes automated testing (axe-core)
- [ ] Dark mode respects system preference with manual override

---

### 2.13 Reviews & Ratings
**Priority:** P1 — High

| Aspect | Specification |
|--------|-------------|
| **Eligibility** | Only customers with completed appointments can review that business/service |
| **Rating Dimensions** | Overall 1-5 stars, optional: service quality, ambiance, staff, value |
| **Review Content** | Text (max 1000 chars), photo upload (up to 5), optional service/provider tag |
| **Business Response** | Owner can reply once; reply marked as "Business owner" |
| **Moderation** | Auto-flag profanity, images; manual review queue for reported content |

**Acceptance Criteria:**
- [ ] Review form accessible within 7 days post-appointment
- [ ] Star rating requires at least 1 star; text optional for 4-5 stars, required for 1-2 stars
- [ ] Reviews appear after 5-minute delay (anti-spam)
- [ ] Business owner notification on new review; reply within 30 days
- [ ] Average rating recalculates and caches; updates within 1 minute

---

### 2.14 Payment Integration
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|-------------|
| **Providers** | Stripe (primary), Adyen (EU expansion) |
| **Methods** | Cards, Apple Pay, Google Pay, SEPA (EU), "Pay at venue" where enabled |
| **Flows** | Immediate charge, deposit/hold, or full prepayment based on business settings |
| **Security** | PCI DSS compliance via tokenization; never store raw card data |
| **Receipts** | Auto-generated PDF receipt, email confirmation |
| **Refunds** | Full or partial via dashboard; automated for cancellations per policy |

**Acceptance Criteria:**
- [ ] Payment intent created client-side, confirmed server-side (3D Secure supported)
- [ ] Failed payment shows clear error, allows retry with different method
- [ ] Refund processes within 5-10 business days per method
- [ ] Webhook handling for dispute, chargeback events
- [ ] "Pay at venue" books without payment but requires card on file for no-show protection

---

### 2.15 Notifications
**Priority:** P1 — High

| Aspect | Specification |
|--------|-------------|
| **Channels** | Push (OneSignal or Firebase), SMS (Twilio), Email (SendGrid), In-app inbox |
| **Types** | Booking confirmations, reminders, changes, promotions, review requests, system alerts |
| **Preferences** | Granular opt-in per channel and category; respect DND hours |
| **Templates** | Localized, brand-consistent, variable substitution |

**Acceptance Criteria:**
- [ ] Critical notifications (booking change) sent via all enabled channels
- [ ] Promotional notifications respect opt-out and frequency cap (max 3/week)
- [ ] Delivery tracking: mark in-app notification as read across devices
- [ ] Failed push falls back to SMS for appointment reminders

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|-------------|
| **Dashboard** | Today's appointments, revenue summary, pending reviews, quick actions |
| **Calendar View** | Day/week/month views; drag-to-reschedule, block time, view by provider |
| **Services Management** | CRUD services, pricing, duration, description, online booking toggle |
| **Staff Management** | Add providers, set permissions, manage individual schedules |
| **Bookings** | View all, filter by status, date, provider; manual booking entry, modify/cancel with customer notification |
| **Clients** | CRM view: contact info, visit history, notes, marketing consent |
| **Analytics** | Revenue, bookings, no-shows, popular services, peak times; exportable reports |
| **Settings** | Business profile, hours, booking policies, payment settings, integrations |

**Acceptance Criteria:**
- [ ] Portal responsive on tablet for in-salon use
- [ ] Calendar syncs two-way with Google/Outlook (optional)
- [ ] Manual booking sends confirmation to client automatically
- [ ] Revenue report matches Stripe dashboard within 0.5% tolerance
- [ ] Role-based access: Owner, Manager, Receptionist, Provider (limited)

---

### 2.17 Admin Dashboard
**Priority:** P2 — Medium

| Aspect | Specification |
|--------|-------------|
| **Overview** | KPIs: active users, bookings, GMV, new businesses, support tickets |
| **User Management** | Search, view, suspend, impersonate (audit logged); GDPR deletion |
| **Business Onboarding** | Approval workflow, verification status, document review |
| **Content Moderation** | Review queue for reported businesses, reviews, images |
| **Financial** | Payout management, commission tracking, refund approval |
| **System Health** | API latency, error rates, job queue depth, third-party service status |

**Acceptance Criteria:**
- [ ] Admin actions create immutable audit log
- [ ] Business approval/rejection with reason communicated automatically
- [ ] Support ticket escalation from in-app chat to Zendesk/Intercom
- [ ] Real-time metrics refresh every 60 seconds

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P1 — High

| Aspect | Specification |
|--------|-------------|
| **Job Types** | Notification dispatch, slot cache pre-computation, payment reconciliation, report generation, data exports, search index updates, image processing |
| **Queue Organization** | Separate queues by priority and type; named workers per domain |
| **Retry Policy** | Exponential backoff, max 3 attempts; dead letter queue for manual review |
| **Monitoring** | Job completion rate, average processing time, failed job alerting |
| **Scheduling** | Cron patterns for recurring jobs (daily reports, nightly cache warm) |

**Acceptance Criteria:**
- [ ] Critical jobs (payment, booking confirmation) process within 5 seconds
- [ ] Job failure triggers alert to on-call after 2 consecutive failures
- [ ] Stalled jobs auto-retry with visibility timeout pattern
- [ ] Graceful shutdown: finish active jobs before process exit

---

## 3. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | App cold start <2s; API p95 <200ms; search <500ms |
| **Reliability** | 99.9% uptime; booking flow zero-downtime deployments |
| **Scalability** | Handle 10,000 concurrent bookings; auto-scaling on queue depth |
| **Security** | OWASP Top 10 mitigation; encryption in transit (TLS 1.3) and at rest (AES-256) |
| **Compliance** | GDPR, CCPA, PCI DSS Level 1 (via Stripe) |
| **Localization** | EN, FR, DE, ES, IT launch; RTL consideration for future |

---

## 4. Prioritization Summary

| Priority | Features |
|----------|----------|
| **P0 — Critical** | User Authentication, Guest Browse, Business Search & Discovery, Map-based Search, Business Detail View, Service Categories, Booking Flow, Appointment Management, Availability & Slot Computation, Payment Integration, Provider Portal |
| **P1 — High** | Favorites, User Profile, Shared Types & Design System, Reviews & Ratings, Notifications, Background Jobs (BullMQ) |
| **P2 — Medium** | Admin Dashboard |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | >15% from search to confirmed |
| Search-to-booking time | <3 minutes median |
| Provider activation | >80% complete profile within 48h of signup |
| Customer NPS | >50 |
| App store rating | >4.5 stars |
| Critical bug resolution | <24 hours |

---

*Document version: 1.0*
*Last updated: 2024*
*Owner: Product — Alex*