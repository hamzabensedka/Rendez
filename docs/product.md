# Planity Clone - Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with beauty/wellness service providers for appointment booking. It serves three user segments: customers seeking services, business owners managing their operations, and administrators overseeing the platform.

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | Seeks beauty/wellness services | Discover, book, manage appointments |
| **Business Owner** | Manages salon/spa operations | Manage schedule, services, staff |
| **Admin** | Platform administrator | Monitor, support, configure |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 | **Effort:** Medium

| Aspect | Specification |
|--------|---------------|
| **Registration** | Email/password, Google OAuth, Apple Sign-In |
| **Login** | JWT-based session with refresh token rotation |
| **Password Reset** | Email-based OTP reset flow |
| **Role Selection** | Prompt during onboarding: Customer or Business Owner |
| **Security** | Rate limiting (5 attempts), password complexity (8+ chars, 1 uppercase, 1 number) |

**Acceptance Criteria:**
- [ ] User can register with email, password, phone number
- [ ] User can login with valid credentials and receive JWT
- [ ] User can login via Google/Apple OAuth
- [ ] User receives email verification on registration
- [ ] User can reset password via email link (expires in 1 hour)
- [ ] Token refresh occurs automatically before expiry
- [ ] Inactive sessions expire after 30 days

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Effort:** Low

| Aspect | Specification |
|--------|---------------|
| **Access** | No authentication required for browsing |
| **Limitations** | Cannot book, favorite, or leave reviews |
| **Prompts** | Persistent CTA to login/register for full features |

**Acceptance Criteria:**
- [ ] Guest can view business listings and basic details
- [ ] Guest can search and filter businesses
- [ ] Guest sees login prompt when attempting to book
- [ ] Guest is redirected to intended action after login

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Effort:** High

| Aspect | Specification |
|--------|---------------|
| **Search** | Full-text search on business name, service name, tags |
| **Filters** | Category, price range, rating (1-5), distance, availability (today, this week), amenities |
| **Sorting** | Relevance, rating, distance, price (low-high) |
| **Results** | Card list with image, name, rating, distance, starting price, next available slot |
| **Pagination** | Infinite scroll, 20 items per page |

**Acceptance Criteria:**
- [ ] Search returns results matching name, service, or tags within 500ms
- [ ] Filters combine with AND logic
- [ ] Distance filter uses user's current location or selected address
- [ ] Empty state shown with suggested alternatives
- [ ] Results update in real-time as filters change

---

### 3.4 Map-based Search
**Priority:** P1 | **Effort:** Medium

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Mapbox or Google Maps |
| **Markers** | Clustered pins color-coded by category |
| **Interaction** | Tap pin → bottom sheet with business preview |
| **Bounds** | Search results update based on visible map area |
| **User Location** | Permission-based, fallback to city center |

**Acceptance Criteria:**
- [ ] Map displays business locations as clustered markers
- [ ] Pan/zoom updates results to visible bounds
- [ ] Tapping marker shows business preview with CTA
- [ ] User location dot displayed when permission granted
- [ ] List/map toggle persists user preference

---

### 3.5 Business Detail View
**Priority:** P0 | **Effort:** Medium

| Section | Content |
|---------|---------|
| **Header** | Business name, rating, review count, favorite toggle, share |
| **Gallery** | Swipeable image carousel (max 10 images) |
| **Info** | Address, hours, phone, website, amenities list |
| **Services** | Expandable categories with individual service cards |
| **Team** | Staff profiles with photos, specialties, ratings |
| **Reviews** | Aggregate rating, review list with photos |
| **CTA** | "Book Now" sticky button |

**Acceptance Criteria:**
- [ ] All business information loads within 2 seconds
- [ ] Images lazy-load with placeholder blur
- [ ] Phone number triggers native dialer
- [ ] Address opens native maps navigation
- [ ] Share generates deep link to business

---

### 3.6 Service Categories
**Priority:** P0 | **Effort:** Low

| Aspect | Specification |
|--------|---------------|
| **Hierarchy** | Category → Subcategory → Service |
| **Examples** | Hair > Color > Balayage; Body > Massage > Swedish |
| **Service Attributes** | Name, description, duration, price, deposit requirement |
| **Staff Assignment** | Services linked to qualified staff members |

**Acceptance Criteria:**
- [ ] Categories display in collapsible accordion
- [ ] Services show duration and price prominently
- [ ] Tapping service initiates booking flow with pre-selection
- [ ] Services without available staff are marked unavailable

---

### 3.7 Booking Flow
**Priority:** P0 | **Effort:** High

| Step | Action |
|------|--------|
| 1. Select Service(s) | Single or multiple services (cart-style) |
| 2. Select Staff | Any available, or specific staff member |
| 3. Select Date | Calendar view with availability indicators |
| 4. Select Time | Slot grid showing start times |
| 5. Review & Confirm | Summary with edit capability |
| 6. Payment | If deposit/full payment required |
| 7. Confirmation | Booking reference, add to calendar |

**Acceptance Criteria:**
- [ ] Multi-service booking calculates total duration and finds contiguous slots
- [ ] Calendar shows available/busy/unavailable states
- [ ] Time slots respect business hours and staff breaks
- [ ] Booking holds slot for 10 minutes during payment
- [ ] Confirmation includes QR code and calendar invite
- [ ] Failed payment releases hold and notifies user

---

### 3.8 Appointment Management
**Priority:** P0 | **Effort:** Medium

| Feature | Specification |
|---------|---------------|
| **Customer View** | Upcoming/past tabs, chronological order |
| **Actions** | Reschedule (same business, new slot), cancel with reason, rebook |
| **Status** | Confirmed, pending, completed, cancelled, no-show |
| **Reminders** | Push/email 24h and 1h before appointment |
| **Modification Rules** | Reschedule allowed up to 2h before; cancel up to start time |
| **Late Cancellation Fee** | Configurable by business, displayed at booking |

**Acceptance Criteria:**
- [ ] Customer sees all appointments with clear status badges
- [ ] Reschedule presents available slots without re-entering details
- [ ] Cancellation requires reason selection (user/business choice)
- [ ] Past appointments prompt for review
- [ ] Push notification deep-links to appointment detail

---

### 3.9 Favorites
**Priority:** P1 | **Effort:** Low

| Aspect | Specification |
|--------|---------------|
| **Action** | Heart toggle on business card and detail |
| **List** | Dedicated tab with quick rebook, see availability |
| **Sync** | Persisted to user account, cross-device |
| **Notifications** | Optional: notify of new availability or promotions |

**Acceptance Criteria:**
- [ ] Toggle favorite with haptic feedback
- [ ] Favorites list loads with latest availability preview
- [ ] Unfavoriting requires confirmation if upcoming bookings exist
- [ ] Guest prompted to login to favorite

---

### 3.10 User Profile
**Priority:** P1 | **Effort:** Medium

| Section | Content |
|---------|---------|
| **Personal Info** | Name, email, phone, photo, birthday (optional rewards) |
| **Addresses** | Saved locations for search default |
| **Payment Methods** | Saved cards via Stripe, default selection |
| **Preferences** | Notification settings, default search radius |
| **History** | Past bookings, spending summary |

**Acceptance Criteria:**
- [ ] Profile fields editable with inline validation
- [ ] Photo upload with crop and compression
- [ ] Address autocomplete via Google Places
- [ ] Payment methods managed via Stripe Elements
- [ ] Account deletion initiates 30-day grace period

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Effort:** High

| Component | Logic |
|-----------|-------|
| **Business Hours** | Weekly recurring schedule with exceptions |
| **Staff Schedule** | Individual availability, time off, breaks |
| **Existing Bookings** | Blocked time from confirmed appointments |
| **Buffer Time** | Configurable gap between appointments |
| **Slot Generation** | Available start times = business hours ∩ staff availability − bookings − buffers |
| **Multi-service** | Find contiguous block fitting total duration |

**Acceptance Criteria:**
- [ ] Slots generated in real-time for selected date/staff
- [ ] Multi-staff services (e.g., couple's massage) check both availabilities
- [ ] Last slot respects closing time minus service duration
- [ ] Override allows manual booking outside generated slots (admin/business)
- [ ] Performance: 50 concurrent slot queries < 200ms

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Effort:** Medium

| Element | Specification |
|---------|---------------|
| **Design Tokens** | Colors, typography, spacing, shadows in JSON |
| **Components** | Buttons, inputs, cards, modals, toasts, skeletons |
| **Icons** | Lucide or Heroicons, consistent 24px default |
| **Theme** | Light/dark mode, brand color injection for business pages |
| **Accessibility** | WCAG 2.1 AA, screen reader support, minimum 44px touch targets |

**Acceptance Criteria:**
- [ ] All UI components in Storybook with variants
- [ ] Theme switch applies globally without restart
- [ ] Color contrast ratios pass automated audit
- [ ] Component library published as internal package

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Effort:** Medium

| Aspect | Specification |
|--------|---------------|
| **Eligibility** | Only verified customers post-appointment |
| **Rating** | 1-5 stars, overall + category (service, staff, ambiance, value) |
| **Content** | Text (max 500 chars), optional photo upload (max 3) |
| **Response** | Business owner can reply publicly |
| **Moderation** | Auto-flag profanity, manual review for disputes |
| **Display** | Sortable by recency, rating; aggregate statistics |

**Acceptance Criteria:**
- [ ] Review prompt sent 2 hours after appointment completion
- [ ] User can edit review within 24 hours
- [ ] Business reply notification sent to reviewer
- [ ] Flagged reviews hidden pending moderation
- [ ] Average rating recalculates in real-time

---

### 3.14 Payment Integration
**Priority:** P0 | **Effort:** High

| Aspect | Specification |
|--------|---------------|
| **Provider** | Stripe (primary), Adyen (future) |
| **Methods** | Cards, Apple Pay, Google Pay, Klarna (BNPL) |
| **Flows** | Deposit, full prepay, pay-at-salon |
| **Split Payments** | Platform fee to Planity, remainder to business (stripe Connect) |
| **Refunds** | Full/partial via dashboard, automated for cancellations within policy |
| **Invoices** | PDF generation, email delivery |

**Acceptance Criteria:**
- [ ] Payment intent created server-side, client confirms
- [ ] 3D Secure handled for applicable cards
- [ ] Webhook confirmation before finalizing booking
- [ ] Failed payment retry with saved method or new input
- [ ] Refund processes within 5-10 business days per method

---

### 3.15 Notifications
 |**Priority:** P1 | **Effort:** Medium

| Channel | Triggers |
|---------|----------|
| **Push** | Booking confirmation, reminder (24h, 1h), cancellation, promotion, review prompt |
| **Email** | Receipt, account changes, marketing (opt-in) |
| **SMS** | Fallback for critical, opt-in for reminders |
| **In-App** | Bell icon with unread count, notification history |

**Acceptance Criteria:**
- [ ] User controls channel preferences per notification type
- [ ] Push subscription managed with OneSignal or Firebase
- [ ] Delivery tracked, fallback channel if primary fails
- [ ] Deep links navigate to relevant screen

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Effort:** High

| Module | Features |
|--------|----------|
| **Dashboard** | Today's appointments, revenue summary, occupancy rate |
| **Calendar** | Week/day views, drag-drop rescheduling, block time |
| **Services** | CRUD with pricing, duration, staff assignment |
| **Staff** | Profiles, schedules, performance metrics |
| **Bookings** | List view, status management, customer notes |
| **Clients** | CRM database, visit history, preferences |
| **Settings** | Business hours, cancellation policy, payment methods |

**Acceptance Criteria:**
- [ ] Portal responsive for tablet use at reception
- [ ] Real-time updates via WebSocket for new bookings
- [ ] Staff can be assigned different permission levels
- [ ] Export data to CSV for reporting
- [ ] Integration with Google/Outlook calendar sync

---

### 3.17 Admin Dashboard
**Priority:** P1 | **Effort:** Medium

| Module | Features |
|--------|----------|
| **Overview** | KPIs: users, bookings, GMV, churn, top businesses |
| **Businesses** | Onboarding workflow, verification, suspension |
| **Users** | Search, impersonation, support tools |
| **Transactions** | Payment monitoring, dispute handling, payouts |
| **Content** | Featured business curation, category management |
| **System** | Feature flags, rate limits, maintenance mode |

**Acceptance Criteria:**
- [ ] Role-based access (admin, support, finance)
- [ ] Audit log of all admin actions
- [ ] Business approval workflow with document verification
- [ ] Manual booking adjustment with full audit trail

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 | **Effort:** Medium

| Job Type | Examples | Frequency |
|----------|----------|-----------|
| **Scheduled** | Appointment reminders, daily reports | Cron-based |
| **Delayed** | Review prompt (2h post), payment retry (24h) | Event-triggered with delay |
| **Recurring** | Slot pre-generation, analytics aggregation | Daily/hourly |
| **One-off** | Email send, push delivery, image processing | On-demand |

**Acceptance Criteria:**
- [ ] Jobs idempotent with unique deduplication keys
- [ ] Failed jobs retry with exponential backoff (max 5)
- [ ] Dead letter queue for manual inspection
- [ ] Job progress trackable via dashboard
- [ ] Redis-backed queue with horizontal scaling

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App launch < 3s, screen transition < 300ms, API response freshness |
| **Reliability** | 99.9% uptime, graceful degradation offline |
| **Security** | OWASP compliance, encryption at rest/transit, GDPR/CCPA |
| **Scalability** | Support 10k concurrent users, 100k daily bookings |
| **Localization** | French (default), English, German; currency, date formats |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% |
| Search-to-booking time | < 5 minutes |
| App store rating | > 4.5 |
| Business NPS | > 50 |
| Customer retention (30d) | > 40% |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, search, booking, basic business portal | 8 weeks |
| **V1.1** | Payments, reviews, notifications | 4 weeks |
| **V1.2** | Map, favorites, advanced scheduling | 4 weeks |
| **V2.0** | Admin, analytics, marketing tools | 6 weeks |

---

*Document Version: 1.0 | Last Updated: 2024 | Owner: Product Team*