# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with local beauty/wellness businesses for appointment booking. It serves three user segments: **Customers** (book appointments), **Business Owners** (manage their business), and **Platform Admins** (oversee operations).

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Sarah (Customer)** | 28, busy professional, books last-minute | Find nearby salons, quick booking, manage appointments |
| **Marie (Business Owner)** | Salon owner, 15 years experience | Fill calendar, reduce no-shows, manage staff |
| **Admin Pierre** | Platform operations manager | Onboard businesses, monitor disputes, analytics |

## 3. Feature Specifications

---

### 3.1 User Authentication

**Priority:** P0 (Critical)

**Description:** Secure, frictionless authentication supporting multiple methods.

| Aspect | Specification |
|--------|-------------|
| **Registration Methods** | Email/password, Google OAuth, Apple Sign-In |
| **Login Flow** | JWT-based with refresh token rotation; biometric prompt after first successful login |
| **Password Requirements** | Min 8 chars, 1 uppercase, 1 number, 1 special character |
| **Account Verification** | Email OTP for email registration; phone optional for SMS notifications |
| **Session Management** | 30-day refresh token; force logout on password change; device management screen |

**Acceptance Criteria:**
- [ ] User can register with email in < 30 seconds
- [ ] OAuth users auto-link if email matches existing account
- [ ] Biometric login works after enabling in settings
- [ ] "Continue as Guest" visible on auth screen, defers to Guest Browse
- [ ] Token refresh is invisible to user; only redirect to login on 401 after refresh fails

---

### 3.2 Guest Browse & Explore

**Priority:** P0

**Description:** Unauthenticated discovery to reduce friction and drive conversion.

| Aspect | Specification |
|--------|-------------|
| **Accessible Content** | Business listings, basic details, reviews (read-only), service categories, search |
| **Blocked Actions** | Booking, favorites, viewing own appointments, leaving reviews |
| **Prompt Strategy** | Show persistent bottom banner: "Sign in to book" — dismissible for 24h |
| **Data Persistence** | Guest search history stored locally; merged to account upon registration |

**Acceptance Criteria:**
- [ ] Guest can browse full catalog without any auth barrier
- [ ] Attempting to book triggers auth modal, preserves context post-login
- [ ] Guest sees "Join 500K+ users" social proof on home
- [ ] Deep links work for guests (e.g., shared business page)

---

### 3.3 Business Search & Discovery

**Priority:** P0

**Description:** Multi-modal search with intelligent ranking.

| Aspect | Specification |
|--------|-------------|
| **Search Inputs** | Free text (business name, service, city); voice search (native OS) |
| **Filters** | Distance (km/mi), price range, rating (4.0+), availability ("Open now", specific date/time), services offered, amenities |
| **Sort Options** | Relevance (default), distance, rating, price (low-high), availability soonest |
| **Auto-complete** | Business names, service types, neighborhoods — debounced 300ms |
| **Recent Searches** | Store last 10, allow pin/clear individual or all |
| **Empty States** | "No results" with suggested alternatives (broader filters, nearby areas) |

**Acceptance Criteria:**
- [ ] Search returns results in < 500ms for cached index
- [ ] Typing "mani" suggests "manicure", "manicure + pedicure", nearby salons
- [ ] Active filters show as chips with X to remove; "Clear all" resets
- [ ] Results update in real-time as filters change
- [ ] Search history syncs across devices when logged in

---

### 3.4 Map-based Search

**Priority:** P0

**Description:** Visual discovery with geographic context.

| Aspect | Specification |
|--------|-------------|
| **Map Provider** | Mapbox (custom styling) or Google Maps (familiarity) |
| **Default View** | User location with 5km radius; fallback to city center if permission denied |
| **Markers** | Cluster at zoom < 12; individual pins with rating badge; color by open/closed status |
| **Card Interaction** | Tapping marker shows bottom sheet with business preview; swipe up for full detail |
| **List/Map Toggle** | Persistent FAB to switch views; preserve scroll position and filters |
| **Bounds Search** | "Search this area" button after map pan; auto-search if idle 2s |

**Acceptance Criteria:**
- [ ] Map renders with < 100 markers in < 2s
- [ ] Cluster expands smoothly on zoom
- [ ] User location dot pulses when tracking active
- [ ] Tapping "Re-center" returns to user location with current zoom
- [ ] Map style matches app dark/light mode

---

### 3.5 Business Detail View

**Priority:** P0

**Description:** Comprehensive business profile driving conversion.

| Section | Content |
|---------|---------|
| **Hero** | Image carousel (max 10), business name, rating, review count, favorite toggle, share |
| **Quick Info** | Address, hours (today's hours + full schedule), phone, website, directions |
| **Services** | Categorized list with price, duration, description; expand for details |
| **Team** | Staff profiles with photos, specialties, individual ratings |
| **Reviews** | Aggregate rating, distribution chart, sortable reviews (recent, highest, lowest), photos |
| **About** | Business description, amenities list, COVID/safety policies, languages spoken |
| **Similar Nearby** | Horizontal scroll of 5 related businesses |

**Acceptance Criteria:**
- [ ] Page loads in < 1.5s with image lazy-loading
- [ ] "Book" CTA is sticky at bottom; scrolls with content, pins on scroll up
- [ ] Tapping phone number initiates call; website opens in-app browser
- [ ] Image拨入图片查看器支持 pinch-zoom and swipe dismissal
- [ ] Share generates deep link with preview image

---

### 3.6 Service Categories

**Priority:** P0

**Description:** Hierarchical classification for discovery and business organization.

| Aspect | Specification |
|--------|-------------|
| **Category Tree** | 3-level max: e.g., Beauty > Hair > Haircut, Coloring, Styling |
| **Business Assignment** | Businesses select primary (1) and secondary (up to 3) categories; services link to leaf categories |
| **Discovery** | Category icons on home; trending categories; "Browse all" full tree |
| **Dynamic Badges** | "New", "Trending", "Most booked" per category based on platform data |

**Acceptance Criteria:**
- [ ] Category tree is navigable in < 3 taps from home
- [ ] Businesses appear in relevant parent category searches (haircut → Hair)
- [ ] Category images are representative and rights-cleared
- [ ] Admin can reorder/promote categories via CMS

---

### 3.7 Booking Flow

**Priority:** P0

**Description:** Optimized conversion funnel from selection to confirmation.

**Step 1: Service Selection**
- Single or multiple services (bundle discount support)
- Show estimated total duration and price

**Step 2: Provider & Time**
- Select specific staff or "No preference" (first available)
- Calendar view with availability; morning/afternoon/evening quick filters
- Slots computed in real-time (see 3.11)

**Step 3: Confirmation**
- Review all details with edit capability per section
- Apply promo code (validated inline)
- Guest checkout option (email + phone required)

**Step 4: Payment**
- Default to saved payment method; Apple Pay / Google Pay primary CTA
- "Pay at venue" option if business enables (track no-show risk)

**Step 5: Confirmation**
- Animated success, add to calendar, share appointment
- Upsell: related services, rebook frequency

**Acceptance Criteria:**
- [ ] Complete flow in < 60 seconds for returning user
- [ ] Abandoned cart recovery: push notification at T+1h, T+24h
- [ ] Slot conflicts prevented server-side; optimistic UI with rollback
- [ ] Guest checkout converts to account creation post-booking (optional, incentivized)
- [ ] All times displayed in user's timezone; stored in UTC

---

### 3.8 Appointment Management

**Priority:** P0

**Description:** Full lifecycle management for customer appointments.

| Action | Rules |
|--------|-------|
| **View** | List (upcoming/past) and detail views; calendar sync option |
| **Reschedule** | Allowed until cutoff (business-configurable, default 2h before); same business only |
| **Cancel** | Allowed until cutoff; penalty warning if within 24h (business policy) |
| **Rebook** | One-tap rebook same service/provider; pre-filled flow |
| **No-show** | Marked by business; affects future booking privileges (3 strikes = prepay required) |

**Acceptance Criteria:**
- [ ] Upcoming appointments show in chronological order with countdown
- [ ] Push notification at T-24h, T-2h, T-15min
- [ ] Reschedule shows only valid alternative slots
- [ ] Cancellation reason collected (optional); used for analytics
- [ ] Past appointments prompt for review after completion

---

### 3.9 Favorites

**Priority:** P1 (High)

**Description:** Save and organize preferred businesses.

| Aspect | Specification |
|--------|-------------|
| **Save Action** | Heart icon on business card and detail; haptic feedback on toggle |
| **Organization** | Default list + user-created lists (e.g., "Nail places", "Mom's favorites") |
| **Notifications** | Optional: alert when favorite adds new service or opens availability |
| **Sync** | Cross-device; survives app reinstall via account |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite is instant with offline queue support
- [ ] List view shows next available slot if within 48h
- [ ] Max 500 favorites per user; lists max 100 each
- [ ] Share list generates public or private link

---

### 3.10 User Profile

**Priority:** P1

**Description:** Central hub for personal information and preferences.

| Section | Content |
|---------|---------|
| **Personal Info** | Name, email, phone, profile photo (optional) |
| **Preferences** | Default notification settings, preferred payment method, home location |
| **Security** | Password change, biometric toggle, active devices, delete account |
| **Activity** | Booking history, total spent, loyalty points if applicable |
| **Help** | FAQ, chat support, call support, report issue |

**Acceptance Criteria:**
- [ ] Profile completion percentage shown; 100% unlocks first-booking discount
- [ ] GDPR data export: JSON download of all personal data
- [ ] Account deletion: 30-day grace period, irreversible after
- [ ] Profile photo cropped to circle, max 5MB, moderated for content

---

### 3.11 Availability & Slot Computation

**Priority:** P0 (Infrastructure)

**Description:** Real-time, accurate availability calculation.

| Aspect | Specification |
|--------|-------------|
| **Business Hours** | Weekly recurring schedule + exception dates (holidays, closures) |
| **Staff Schedules** | Individual working hours, breaks, time off |
| **Service Duration** | Base duration + buffer (cleaning, setup); variable by staff experience |
| **Blocking Rules** | Existing appointments, buffer between different services, staff unavailability |
| **Computation** | Pre-compute next 30 days nightly; real-time for current day + next 7 days |
| **Caching** | Redis with 5min TTL; invalidate on booking mutation |

**Acceptance Criteria:**
- [ ] Slot query returns in < 200ms at 95th percentile
- [ ] Double-booking impossible even with concurrent requests (DB constraint + optimistic locking)
- [ ] Timezone handling correct for DST transitions
- [ ] Business can block emergency slots via portal; reflect in < 30s
- [ ] Overbooking limit configurable (e.g., 110% capacity for walk-ins)

---

### 3.12 Shared Types & Design System

**Priority:** P0 (Foundation)

**Description:** Consistent, accessible UI across platforms.

| Element | Specification |
|---------|-------------|
| **Color Palette** | Primary: #6C5CE7 (Purple), Secondary: #00B894 (Green), Semantic: #FF7675 (Error), #FDCB6E (Warning), #74B9FF (Info) |
| **Typography** | Inter (body), Playfair Display (headings); 12/14/16/20/24/32/48 scale |
| **Spacing** | 4px base grid; 8/12/16/24/32/48/64 token system |
| **Components** | Button (primary/secondary/tertiary/ghost), Input, Card, Modal, Bottom Sheet, Date Picker, Time Picker, Skeleton |
| **Accessibility** | WCAG 2.1 AA minimum; screen reader labels, focus indicators, minimum 44pt touch targets |
| **Dark Mode** | Full support with `prefers-color-scheme` media query; manual override in settings |

**Acceptance Criteria:**
- [ ] All components documented in Storybook with usage examples
- [ ] Design tokens in JSON for cross-platform (iOS, Android, Web) consumption
- [ ] Component usage tracked; deprecated components flagged in CI
- [ ] RTL layout support for future internationalization

---

### 3.13 Reviews & Ratings

**Priority:** P1

**Description:** Trust-building through verified customer feedback.

| Aspect | Specification |
|--------|-------------|
| **Eligibility** | Verified booking required to review; 48h after appointment to submit |
| **Rating Dimensions** | Overall (1-5), optional sub-ratings: Service, Ambiance, Staff, Value |
| **Content** | Text (max 1000 chars), photos (max 5), optional staff shout-out |
| **Moderation** | Auto-flag for profanity/spam; human review within 24h for flagged content |
| **Business Response** | Public reply capability; notification to reviewer |
| **Sorting** | Default: most helpful (platform algorithm); options: newest, highest, lowest |

**Acceptance Criteria:**
- [ ] Review form pre-populates with business and service
- [ ] Photo upload compresses to < 2MB each; gallery view with pinch-zoom
- [ ] Business owner gets real-time notification of new review
- [ ] Fake review detection: flag accounts with >3 reviews in 24h for same business
- [ ] Reviewer can edit for 30 days, delete anytime

---

### 3.14 Payment Integration

**Priority:** P0

**Description:** Secure, flexible payment processing.

| Aspect | Specification |
|--------|-------------|
| **Providers** | Stripe (primary), Adyen (backup for specific markets) |
| **Methods** | Cards, Apple Pay, Google Pay, PayPal (selected markets), "Pay at venue" |
| **Saved Payments** | Tokenized cards; biometric confirmation for >€50; 3D Secure for new cards |
| **Refunds** | Full or partial; initiated by business or admin; 5-10 business days |
| **Invoicing** | Email receipt; business VAT invoice on request |
| **Escrow** | No; direct to business minus platform fee (weekly settlement) |

**Acceptance Criteria:**
- [ ] Payment intent created server-side; client confirms only
- [ ] Failed payment shows specific reason (insufficient funds, expired card) with retry
- [ ] Webhook handling idempotent; duplicate events ignored by idempotency key
- [ ] PCI compliance: no raw card data touches our servers
- [ ] Currency display matches business location; conversion shown for foreign cards

---

### 3.15 Notifications

**Priority:** P1

**Description:** Multi-channel, preference-aware communication.

| Channel | Use Cases |
|---------|-----------|
| **Push** | Booking confirmation, reminders, promotions, favorites availability |
| **SMS** | Booking confirmation, day-of reminder, urgent changes (fallback if push disabled) |
| **Email** | Receipt, review request, marketing (opt-in), account security |
| **In-App** | Activity feed of all notifications; badge on profile tab |

| Preference Level | Control |
|----------------|---------|
| Global | Pause all for 1h/8h/24h/custom |
| Category | Booking, Promotional, Account, Favorites — toggle per channel |
| Business | Mute notifications from specific business |

**Acceptance Criteria:**
- [ ] Notification delivery tracked; retry failed pushes via SMS if critical
- [ ] Deep links navigate to relevant screen, not just app open
- [ ] Rich push with images for promotional content
- [ ] Frequency cap: max 3 promotional pushes per day
- [ ] Unsubscribe from email honored within 24h

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0

**Description:** Web-based management for business operations.

| Module | Features |
|--------|----------|
| **Dashboard** | Today's appointments, revenue this week, occupancy rate, pending reviews |
| **Calendar** | Day/week/month views; drag-drop rescheduling; block time; staff filter |
| **Services** | CRUD services, pricing, duration, online visibility toggle |
| **Staff** | Manage team members, permissions (admin/receptionist/therapist), schedules |
| **Bookings** | View all, filter by status, manual booking walk-in, export to CSV |
| **Clients** | CRM view, visit history, notes, marketing consent |
| **Settings** | Business hours, cancellation policy, payment methods accepted, integrations |

**Acceptance Criteria:**
- [ ] Portal is responsive; primary use on tablet/desktop
- [ ] Real-time updates via WebSocket for new bookings
- [ ] Role-based access: Owner sees billing; Staff sees only their calendar
- [ ] Onboarding wizard for new businesses: 5-step setup, progress saved
- [ ] Help chat available with < 2min response during business hours

---

### 3.17 Admin Dashboard

**Priority:** P1

**Description:** Platform oversight and operational tools.

| Module | Features |
|--------|----------|
| **Overview** | MAU, bookings, GMV, top cities, system health |
| **Businesses** | Onboard, verify (KYB), suspend, feature, search/filter |
| **Users** | Search, view activity, suspend, impersonate (with audit log) |
| **Bookings** | Dispute resolution, refund processing, fraud investigation |
| **Content** | Review moderation queue, category management, featured content curation |
| **Finance** | Payout management, commission tracking, invoice generation |
| **System** | Feature flags, notification campaigns, maintenance mode |

**Acceptance Criteria:**
- [ ] All actions audited with admin ID, timestamp, before/after state
- [ ] Role-based access: Support, Ops, Finance, Super Admin
- [ ] Data export to CSV/JSON with date range filter
- [ ] Critical alerts (fraud spike, system down) to on-call via PagerDuty

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P1 (Infrastructure)

**Description:** Reliable, observable async processing.

| Queue | Jobs | Priority |
|-------|------|----------|
| **notifications** | Send push, SMS, email; retry with exponential backoff | High |
| **bookings** | Slot pre-computation, no-show marking, review prompts | High |
| **payments** | Payout to businesses, retry failed charges, invoice generation | High |
| **analytics** | Aggregate metrics, cohort calculations, report generation | Low |
| **images** | Resize, optimize, moderate uploaded photos | Normal |
| **search** | Reindex businesses, update suggestion index | Normal |

| Aspect | Specification |
|--------|-------------|
| **Retry Policy** | 3 attempts, exponential backoff 5min/25min/2h; dead letter queue after |
| **Monitoring** | Queue depth, processing rate, failed job count; alert if >1000 queued |
| **Scheduling** | Cron for nightly jobs; delayed jobs for appointment reminders |

**Acceptance Criteria:**
- [ ] Job failure triggers alert to engineering channel
- [ ] Failed jobs can be retried or discarded via admin UI
- [ ] Job processing doesn't block API requests
- [ ] Stalled jobs detected and reassigned within 30s
- [ ] Graceful shutdown: finish in-progress jobs before process exit

---

## 4. Non-Functional Requirements

| Category | Target |
|----------|--------|
| **Performance** | App cold start < 2s; API response < 200ms (p95) |
| **Availability** | 99.9% uptime; scheduled maintenance < 1h/month |
| **Security** | OWASP Top 10 mitigated; annual penetration test |
| **Privacy** | GDPR/CCPA compliant; data retention policies enforced |
| **Scalability** | Support 100K concurrent users; 10M businesses |

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Business Detail, Booking, Basic Provider Portal | 3 months |
| **V1.1** | Map, Favorites, Reviews, Payments, Notifications | +2 months |
| **V1.2** | Appointment Management, User Profile, Admin Dashboard | +2 months |
| **V2.0** | AI recommendations, Loyalty program, Marketplace features | +4 months |

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion (visit → book) | > 8% |
| Day-7 retention | > 25% |
| NPS (customers) | > 50 |
| Business activation (portal login/week) | > 60% |
| Support tickets per 1000 bookings | < 5 |

---

*Document version: 1.0*
*Last updated: 2024*
*Owner: Alex, Product Owner*