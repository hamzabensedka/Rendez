# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first appointment booking platform connecting customers with beauty, wellness, and service professionals. It serves three user segments: **Customers** (book appointments), **Providers/Business Owners** (manage schedules and services), and **Admin** (platform oversight). This specification covers all features required for MVP and post-MVP phases.

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | End-user seeking appointments | Discover, book, manage appointments |
| **Guest** | Unregistered browser | Explore without commitment |
| **Provider** | Business owner/manager | Manage calendar, services, staff |
| **Admin** | Platform operator | Monitor, support, configure |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 (Critical)

| Aspect | Specification |
|--------|---------------|
| **Registration Methods** | Email/password, Google OAuth, Apple Sign-In |
| **Login** | JWT-based with refresh token rotation; biometric login (Face ID/Touch ID) |
| **Password Recovery** | Secure token via email, 1-hour expiry |
| **Account Verification** | Email confirmation required before booking |
| **Session Management** | 30-day refresh token; forced re-auth on sensitive actions |

**Acceptance Criteria:**
- [ ] User can register with email, password, full name, phone number
- [ ] Password: min 8 chars, 1 uppercase, 1 number, 1 special character
- [ ] OAuth flows complete in <3 seconds
- [ ] Biometric prompt appears after first successful password login
- [ ] Unverified users see persistent banner; cannot complete booking
- [ ] Session expires with graceful logout, preserving cart/wishlist data locally

---

### 3.2 Guest Browse & Explore

**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Access** | No account required for browsing |
| **Limitations** | Cannot book, favorite, or leave reviews; prompt to register at conversion points |
| **Data Persistence** | 7-day local storage for search filters, viewed businesses |

**Acceptance Criteria:**
- [ ] Guest sees full business directory without login barrier
- [ ] "Book Now" and "Add to Favorites" trigger auth modal with pre-filled context
- [ ] Guest's browse history converts to recommendations post-registration
- [ ] App store review guidelines compliance (no forced login for content)

---

### 3.3 Business Search & Discovery

**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Search Inputs** | Free text (business name, service, staff name); voice search |
| **Filters** | Category, price range, rating (4.0+), distance, availability ("open now"), amenities |
| **Sorting** | Relevance, distance, rating, price (low-high), availability |
| **Results Display** | Card-based list with photo, rating, price indicator, next available slot |
| **Search History** | Persist 20 recent searches; suggest based on frequency |
| **Auto-complete** | Business names, services, neighborhoods with typo tolerance |

**Acceptance Criteria:**
- [ ] Search returns results in <500ms for 90th percentile queries
- [ ] Empty states suggest popular categories nearby
- [ ] Filters combine logically (AND within category, OR across)
- [ ] "No results" offers to expand radius or adjust filters
- [ ] Search debounced at 300ms to reduce API calls

---

### 3.4 Map-based Search

**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Mapbox or Google Maps (configurable) |
| **Default View** | User location with 5km radius; cluster markers at zoom <12 |
| **Marker States** | Default, selected, promoted/highlighted, fully booked (grayed) |
| **Interaction** | Tap marker → bottom sheet preview; tap preview → detail view |
| **Radius Control** | Slider: 1km–50km; update results without full re-query |
| **Bounds Search** | Pan/zoom map triggers new search for visible bounds |

**Acceptance Criteria:**
- [ ] Map initializes to user location within 2 seconds (with permission)
- [ ] 500+ markers cluster without frame drops (<16ms jank)
- [ ] Selected business stays centered when bottom sheet expands
- [ ] Offline: cache last viewed map tiles for 24 hours
- [ ] Accessibility: screen reader announces "5 businesses found in this area"

---

### 3.5 Business Detail View

**Priority:** P0

| Section | Content |
|---------|---------|
| **Header** | Cover photo carousel (max 10), business name, verified badge, favorite toggle |
| **Info Bar** | Rating (with review count), category, distance, open/closed status |
| **About** | Description, founding year, COVID/safety policies, languages spoken |
| **Services** | Expandable categories with prices, durations, descriptions |
| **Staff** | Selectable staff per service with photos, bios, ratings |
| **Photos/Videos** | Grid gallery, full-screen viewer with pinch-to-zoom |
| **Amenities** | Icon list (parking, wheelchair access, WiFi, etc.) |
| **Hours** | Weekly schedule with "closed" days highlighted |
| **Location** | Embedded mini-map with "Get Directions" (deep link to maps app) |
| **Reviews Summary** | Aggregate rating, distribution histogram, top 2 reviews |

**Acceptance Criteria:**
- [ ] Page loads essential content in <1.5s; lazy load gallery
- [ ] "Book" CTA persists as floating button on scroll
- [ ] Deep link `/business/:id` opens correct view with loading skeleton
- [ ] Share functionality generates preview image with business info
- [ ] Report business/photo flows for content moderation

---

### 3.6 Service Categories

**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Hierarchy** | Category → Subcategory → Service (3 levels max) |
| **Examples** | Hair > Coloring > Balayage; Wellness > Massage > Deep Tissue |
| **Attributes** | Name, description, base price, duration, buffer time, staff eligibility |
| **Variations** | Add-ons (e.g., "hair wash +$15"), required vs. optional |
| **Display** | Category icons in home screen quick access; drill-down in search |

**Acceptance Criteria:**
- [ ] Category tree cached on app start; refresh weekly
- [ ] Business can assign services to multiple categories
- [ ] Category-specific filters (e.g., hair length for coloring)
- [ ] Trending categories surfaced based on booking volume

---

### 3.7 Booking Flow

**Priority:** P0

| Step | Action | Details |
|------|--------|---------|
| 1 | **Select Service** | From business detail or direct service link |
| 2 | **Choose Staff** | "Any available" or specific staff; show staff availability |
| 3 | **Pick Date/Time** | Calendar view with available slots highlighted; scroll 4 weeks ahead |
| 4 | **Add-ons** | Upsell related services with one-tap add |
| 5 | **Review** | Service, staff, time, price, cancellation policy summary |
| 6 | **Payment** | Stored card, new card, or pay at venue (where enabled) |
| 7 | **Confirmation** | Booking reference, calendar invite, directions, add to wallet |

**Acceptance Criteria:**
- [ ] Complete flow achievable in <60 seconds for returning user
- [ ] Slot selection prevents double-booking with pessimistic UI locking
- [ ] Price breakdown shows subtotal, tax, platform fee transparently
- [ ] Cancellation policy displayed before final confirmation
- [ ] Booking holds slot for 10 minutes during payment
- [ ] Failed payment releases hold with SMS/email retry link

---

### 3.8 Appointment Management

**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Customer Views** | Upcoming (sorted by date), Past, Cancelled |
| **Actions** | Reschedule (same business, new slot), Cancel, Rebook, Contact business |
| **Reschedule Rules** | Up to 2 hours before (configurable by business); within 24h requires approval |
| **Cancellation Policy** | Full refund >24h; 50% 2-24h; no refund <2h (default, business-customizable) |
| **Reminders** | Push + SMS 24h, 2h before appointment |
| **Check-in** | QR code or "I'm here" button triggers provider notification |

**Acceptance Criteria:**
- [ ] Upcoming appointments sync to device calendar (opt-in)
- [ ] Cancel/Reschedule updates provider calendar in real-time
- [ ] Past appointments prompt for review if unrated
- [ ] No-show tracked; 3 no-shows triggers account review
- [ ] Appointment detail shows full history (creation, modifications, communications)

---

### 3.9 Favorites

**Priority:** P1 (High)

| Aspect | Specification |
|--------|---------------|
| **Save** | Heart toggle on business cards, detail view, search results |
| **Organization** | Default list; user-created custom lists ("Wedding Prep", "Weekly Regulars") |
| **Notifications** | Opt-in: new availability, price changes, promotions from favorited businesses |
| **Sync** | Cross-device with server source of truth |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite toggles with optimistic UI, rollback on error
- [ ] Favorites list loads offline from cache
- [ ] Batch remove with multi-select
- [ ] Share list as curated collection (public or private link)

---

### 3.10 User Profile

**Priority:** P1

| Section | Content |
|---------|---------|
| **Personal Info** | Name, email, phone, photo, birthday (for offers) |
| **Preferences** | Default notification settings, preferred payment method, home location |
| **Payment Methods** | Card management (Stripe/PayPal tokens), billing history |
| **Loyalty** | Points balance, tier status, history, redeemable rewards |
| **Security** | Password change, 2FA, active sessions, login history |
| **Data** | Download personal data (GDPR), account deletion with 30-day grace period |

**Acceptance Criteria:**
- [ ] Profile completion percentage gamifies empty fields
- [ ] Photo upload with automatic compression (<500KB)
- [ ] Account deletion requires re-authentication and explicit confirmation
- [ ] Data export delivered via secure link within 24 hours

---

### 3.11 Availability & Slot Computation

**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Business Hours** | Weekly recurring + exception dates (holidays, closures) |
| **Staff Schedules** | Individual availability, breaks, time off |
| **Slot Generation** | Divide available time by service duration + buffer; respect staff-service mapping |
| **Constraints** | No overlapping bookings; respect service prep/cleanup time; buffer between staff |
| **702 Rule** | Slots shown 4 weeks ahead; release 48h before for unconfirmed waitlist |
| **Real-time** | WebSocket/SSE for instant availability updates on active booking pages |

**Acceptance Criteria:**
- [ ] Slot computation completes in <200ms for single staff, <500ms for business-wide
- [ ] Booking hold temporarily reduces inventory; release on timeout or cancellation
- [ ] Bulk operations (staff sick day) recalculate and notify affected customers
- [ ] Timezone handling: store UTC, display local to user and business
- [ ] Edge cases: DST transitions, leap seconds handled gracefully

---

### 3.12 Shared Types & Design System

**Priority:** P0 (Infrastructure)

| Element | Specification |
|---------|---------------|
| **Color System** | Primary (#E91E63), Secondary (#00BCD4), Semantic (Success/Warning/Error/Info) |
| **Typography** | Inter (body), Playfair Display (headings); 12 scales from caption to H1 |
| **Spacing** | 4px base grid; 8px increments |
| **Components** | Button (6 variants), Input (8 states), Card (3 elevations), Modal, Toast, Skeleton |
| **Icons** | Phosphor Icons; consistent 24px default, 20px compact, 32px feature |
| **Motion** | 200ms default transitions; 150ms for micro-interactions; prefers-reduced-motion support |
| **Accessibility** | WCAG 2.1 AA minimum; minimum 4.5:1 contrast; focus indicators; screen reader labels |

**Acceptance Criteria:**
- [ ] All new features use design system components; no custom one-offs
- [ ] Dark mode supported via CSS variables or theme provider
- [ ] RTL layout support for internationalization
- [ ] Component documentation in Storybook with usage examples

---

### 3.13 Reviews & Ratings

**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Eligibility** | Verified customers only; post-appointment or within 30 days |
| **Rating Dimensions** | Overall (1-5), service quality, staff professionalism, venue cleanliness, value |
| **Content** | Text (max 500 chars), photo upload (max 5), optional staff tag |
| **Moderation** | Auto-flag profanity, images, duplicate content; human review queue for disputes |
| **Business Response** | Public reply to any review; mark resolved for negative reviews |
| **Helpfulness** | Users can mark reviews helpful; sort by helpfulness or recency |

**Acceptance Criteria:**
- [ ] Review form pre-fills service and staff from appointment
- [ ] Anonymous option hides customer name but shows verified badge
- [ ] Editable within 48 hours, then permanent
- [ ] Business average recalculates with 7-day rolling window to prevent gaming
- [ ] Report review flow with reason selection

---

### 3.14 Payment Integration

**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Providers** | Stripe primary; PayPal secondary; Apple Pay/Google Pay for in-app |
| **Flows** | Immediate charge, authorize-then-capture (24h), deposit for high-value services |
| **Split Payments** | Platform fee to Planity Clone, remainder to business (Stripe Connect Express) |
| **Refunds** | Full, partial, or store credit; processed within 5-10 business days |
| **Invoicing** | Email receipt with business details; annual summary for tax |
| **PCI Compliance** | No card data stored locally; tokenization only |

**Acceptance Criteria:**
- [ ] Payment sheet pre-fills from saved methods
- [ ] 3D Secure handled natively without app switch
- [ ] Failed payment shows specific error (insufficient funds, expired card) with retry
- [ ] Webhook idempotency: duplicate events processed once only
- [ ] Payout dashboard for businesses with transaction history and upcoming payout dates

---

### 3.15 Notifications

**Priority:** P1

| Channel | Types |
|---------|-------|
| **Push** | Booking confirmed, reminder, modified, cancelled; promotional (opt-in); waitlist available |
| **SMS** | Backup for critical; appointment reminders for non-app users |
| **Email** | Receipt, summary, marketing (separate opt-in), account security |
| **In-App** | Bell icon with unread count; persists 30 days |

**Acceptance Criteria:**
- [ ] Notification preferences granular by type and channel
- [ ] Deep links navigate to relevant screen (not just app open)
- [ ] Batch similar notifications ("3 new appointments today")
- [ ] Delivery tracking: retry failed pushes, fallback to SMS for critical
- [ ] Quiet hours respect (default 10pm-8am, user-configurable)

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0

| Module | Features |
|--------|----------|
| **Dashboard** | Today's appointments, revenue snapshot, recent reviews, quick actions |
| **Calendar** | Day/week/month views; drag-drop reschedule; block time; color-coded by staff/service |
| **Services** | CRUD services, pricing, duration, online booking enable/disable |
| **Staff** | Add staff, set permissions, manage individual schedules, commission tracking |
| **Clients** | CRM view: contact info, visit history, notes, allergies/preferences, marketing tags |
| **Bookings** | Full management: confirm, reschedule, cancel, no-show mark, add walk-in |
| **Analytics** | Revenue, bookings, cancellation rate, staff utilization, customer retention (cohort analysis) |
| **Settings** | Business hours, cancellation policy, payment methods, integrations (Google Calendar, etc.) |

**Acceptance Criteria:**
- [ ] Calendar supports concurrent editing with conflict resolution (last-write-wins with merge)
- [ ] Offline mode: queue changes, sync on reconnect with conflict alert
- [ ] Staff permissions: Owner > Manager > Staff (view-only own schedule)
- [ ] Export data: CSV/Excel for appointments, clients, financials
- [ ] Mobile-responsive web app; native app parity for core flows

---

### 3.17 Admin Dashboard

**Priority:** P2 (Medium)

| Module | Features |
|--------|----------|
| **User Management** | Search, view, suspend/activate, impersonate for support |
| **Business Onboarding** | Application review, verification workflow, document management |
| **Content Moderation** | Review queue for reported content; bulk actions; audit log |
| **Financial Oversight** | Platform fee revenue, payout tracking, refund management, dispute resolution |
| **Analytics** | MAU, booking volume, GMV, churn, top categories, geographic distribution |
| **System Health** | API latency, error rates, queue depths, third-party service status |
| **Configuration** | Feature flags, category tree, global settings, promotional campaigns |

**Acceptance Criteria:**
- [ ] Role-based access: Super Admin, Support, Finance, Content Mod
- [ ] All actions logged with admin identity, timestamp, before/after state
- [ ] Impersonation requires secondary approval and auto-logs out after 30 minutes
- [ ] Data export with date range filtering

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P0 (Infrastructure)

| Job Type | Description | Schedule/Trigger |
|----------|-------------|------------------|
| **Reminder Notifications** | Push/SMS/email before appointments | 24h, 2h before calculated per-appointment |
| **Slot Cache Warm** | Pre-compute availability for popular businesses | Every 15 minutes; on business config change |
| **Review Solicitation** | Prompt for review 2 hours post-appointment | Triggered on appointment status "completed" |
| **Payout Processing** | Calculate and initiate transfers to businesses | Daily at 6am UTC |
| **Report Generation** | Aggregate analytics for business/admin dashboards | Nightly; on-demand with email delivery |
| **Data Cleanup** | Purge expired holds, old logs, temporary files | Hourly |
| **Search Index Update** | Sync business/service changes to Elasticsearch | Real-time via change streams; full reindex weekly |
| **Image Processing** | Compress, generate thumbnails, moderate uploaded photos | On upload event |

**Acceptance Criteria:**
- [ ] Jobs idempotent; safe to retry on failure
- [ ] Dead letter queue for failed jobs >3 attempts; alert on queue depth >100
- [ ] Job progress trackable via dashboard for long-running tasks
- [ ] Priority queue: notifications > payouts > reports > cleanup
- [ ] Graceful shutdown: finish in-progress jobs before process exit

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App cold start <2s; screen transition <300ms; API p95 <500ms |
| **Reliability** | 99.9% uptime; <0.1% error rate for critical paths |
| **Security** | OWASP Mobile Top 10 compliance; annual penetration testing |
| **Scalability** | Support 10,000 concurrent booking attempts; auto-scale workers |
| **Localization** | French, English, Spanish, German at launch; RTL support |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1; accessibility WCAG 2.1 AA |

---

## 5. Prioritization Summary

| Priority | Features |
|----------|----------|
| **P0 (Critical)** | User Authentication, Guest Browse, Search & Discovery, Map Search, Business Detail, Booking Flow, Appointment Management, Availability/Slots, Payment, Provider Portal, Background Jobs, Design System |
| **P1 (High)** | Favorites, User Profile, Reviews & Ratings, Notifications |
| **P2 (Medium)** | Admin Dashboard, Advanced Analytics, Loyalty Program |
| **P3 (Low)** | Social Sharing, Referral Program, AI Recommendations |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Booking Conversion Rate | >15% of app opens |
| Search-to-Book Time | <3 minutes median |
| Provider Calendar Utilization | >70% of available slots |
| Customer Retention (30d) | >40% |
| NPS | >50 |
| App Store Rating | >4.5 stars |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex, Product Owner*