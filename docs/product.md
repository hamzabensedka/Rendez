# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with local service businesses (beauty, wellness, fitness, health). Customers discover, book, and manage appointments. Business owners manage their schedule, services, and client base. Admins oversee platform health and growth.

**Target Platforms:** iOS, Android, Web (responsive)
**Release Strategy:** MVP → Growth → Scale

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | Books appointments for personal services | Find, compare, book, manage appointments |
| **Guest** | Unauthenticated browser | Explore before committing |
| **Business Owner** | Manages a service business | Fill calendar, manage staff, grow revenue |
| **Staff Member** | Employee of a business | View schedule, manage own availability |
| **Admin** | Platform operator | Monitor, support, grow marketplace |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 | **Owner:** Product / Engineering

| Item | Specification |
|------|---------------|
| **Registration Methods** | Email/password, Google OAuth, Apple Sign-In, Facebook (optional) |
| **Account Types** | Customer, Business Owner (can switch or have both) |
| **Onboarding Flow** | Role selection → Credentials → Phone verification (OTP) → Optional profile details |
| **Security** | JWT access + refresh tokens, biometric login (Face ID/Touch ID), password reset via email |
| **Session Mgmt** | 7-day refresh token, forced re-auth on sensitive actions (payment, password change) |

**Acceptance Criteria:**
- [ ] New user completes registration in < 60 seconds
- [ ] Returning user authenticates via biometrics in < 3 seconds
- [ ] Token refresh is transparent to user; no session drops on valid use
- [ ] Account lockout after 5 failed attempts; 30-minute cooldown
- [ ] Users can delete account with 7-day grace period and data export

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Product / Growth

| Item | Specification |
|------|---------------|
| **Access Level** | Full search and browse; no booking without account |
| **Prompt Strategy** | Soft gate: "Sign in to book" CTA; hard gate at checkout initiation |
| **Data Capture** | Optional email to save favorites; local storage for viewed items |
| **Conversion Path** | Guest → Account creation with pre-filled data from browse session |

**Acceptance Criteria:**
- [ ] Guest sees same search results as authenticated user
- [ ] Tapping "Book" triggers auth modal; post-auth returns to booking flow with state preserved
- [ ] Guest can share business/profile via deep link that opens for other guests
- [ ] Session persistence: returning guest sees previous search location

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Product / Design

| Item | Specification |
|------|---------------|
| **Search Inputs** | Free text (business name, service), location (current/given), date range, service category, price range, rating, availability "book now" |
| **Results Display** | List view (default) / Map toggle; sort by relevance, distance, rating, price |
| **Filters** | Category, subcategory, price min/max, rating threshold, distance radius, gender of staff, amenities, language spoken |
| **Search Intelligence** | Autocomplete, typo tolerance, synonym matching ("nail" → "manicure"), recent searches, trending searches |
| **Sponsored Results** | Labeled "Promoted"; max 2 per result set; auction-based placement (future) |

**Acceptance Criteria:**
- [ ] Search returns results in < 500ms for 95th percentile
- [ ] Empty states provide helpful alternatives (nearby categories, broaden filters)
- [ ] "Book now" filter shows only businesses with slots within 24 hours
- [ ] Search history persists across sessions (authenticated); 5 recent searches

---

### 3.4 Map-based Search
**Priority:** P0 | **Owner:** Product / Design

| Item | Specification |
|------|---------------|
| **Map Provider** | Google Maps (primary) / Mapbox (fallback) |
| **Default View** | User location with 5km radius; cluster markers for density |
| **Marker States** | Default, selected (expanded card), promoted (distinct styling), closed/unavailable (grayed) |
| **Card Preview** | Tap marker → bottom sheet with business name, rating, price from, next availability, photo |
| **Gestures** | Pinch zoom, pan, tap to select, swipe card to next/previous |
| **List/Map Toggle** | Persistent toggle; state maintained per session |

**Acceptance Criteria:**
- [ ] Map loads initial viewport in < 2 seconds on 4G
- [ ] Clustering handles 1000+ markers without performance degradation
- [ ] Selected business card provides one-tap path to detail view and booking
- [ ] Map bounds update triggers new search query with debounce (300ms)

---

### 3.5 Business Detail View
**Priority:** P0 | **Owner:** Product / Design

| Item | Specification |
|------|---------------|
| **Header** | Photo carousel (max 10), business name, verified badge, rating, review count, favorite toggle |
| **Info Section** | Address with directions link, hours (today's + full), phone, website, social links |
| **Services Tab** | Categorized list with duration, price, description; expandable for variants |
| **Team Tab** | Staff profiles with photos, specialties, languages, ratings |
| **Reviews Tab** | Rating distribution, recent reviews with photos, owner responses |
| **About Tab** | Business description, amenities, COVID/safety policies, parking info |
| **Sticky CTA** | "Book Appointment" — scrolls with user, context-aware (pre-selects viewed service) |

**Acceptance Criteria:**
- [ ] Page loads above-the-fold in < 1.5 seconds
- [ ] Photo carousel supports pinch-zoom, swipe, thumbnail navigation
- [ ] Tapping service pre-selects it in booking flow
- [ ] "Call" and "Directions" actions are one-tap from header
- [ ] Share generates deep link with preview image

---

### 3.6 Service Categories
**Priority:** P0 | **Owner:** Product / Content

| Item | Specification |
|------|---------------|
| **Hierarchy** | Category → Subcategory → Service → Variant (e.g., Hair → Coloring → Balayage → Long Hair) |
| **Category Examples** | Hair, Nails, Face & Skin, Body, Massage, Fitness, Medical Aesthetics, Tattoo & Piercing |
| **Attributes per Service** | Name, description, duration, base price, max price (range), deposit required, cancellation policy, staff required skills, equipment needed |
| **Dynamic Pricing** | Peak/off-peak multipliers, staff seniority pricing, package discounts |
| **Category Management** | Admin-curated; business owners request additions |

**Acceptance Criteria:**
- [ ] Category browse is accessible from home screen; 2-tap path to any service
- [ ] Service selection in booking shows all applicable variants and upcharges
- [ ] Invalid combinations (service + staff skill mismatch) are prevented at selection time
- [ ] Price range displays correctly when dynamic pricing applies

---

### 3.7 Booking Flow
**Priority:** P0 | **Owner:** Product / Engineering

| Step | Description |
|------|-------------|
| 1. Service Selection | Single or multiple services (cart); duration and price calculated |
| 2. Staff Selection | "Any available" or specific staff; filter by gender, language |
| 3. Date/Time | Calendar view with available slots; swipe weeks; timezone handling |
| 4. Slot Selection | Time grid (morning/afternoon/evening); first available highlighted |
| 5. Add-ons | Optional extras (e.g., deep conditioning, product purchase) |
| 6. Guest Info | Name, phone, notes, allergies, first-time client flag |
| 7. Payment | Deposit or full payment; saved methods; promo code |
| 8. Confirmation | Summary, calendar invite, add to wallet, directions, share |

**Acceptance Criteria:**
- [ ] Complete flow in < 90 seconds for returning user with saved payment
- [ ] Slot availability is real-time; held for 10 minutes upon selection
- [ ] Concurrent booking conflict resolved: first completer wins; second sees "just booked" with alternatives
- [ ] Partial payment (deposit) clearly shows balance due and terms
- [ ] Booking confirmation arrives via push, email, and SMS within 5 seconds
- [ ] Modification/cancellation follows business policy; penalties calculated automatically

---

### 3.8 Appointment Management
**Priority:** P0 | **Owner:** Product / Engineering

| Item | Specification |
|------|---------------|
| **Views** | Upcoming (default), Past, Cancelled |
| **Card Content** | Date/time, business, service, staff, price, status, actions |
| **Actions** | Reschedule (same business, new slot), Cancel (with policy display), Rebook (past), Contact business, Add to calendar, Share |
| **Reschedule Rules** | Within business cancellation window; new slot held temporarily; old slot released |
| **No-Show Handling** | Business marks no-show; customer notified; policy applied |
| **Recurring** | Not in MVP; flagged for post-MVP |

**Acceptance Criteria:**
- [ ] Upcoming appointments visible in app within 1 second of open
- [ ] Reschedule presents available slots; confirms with new calendar invite
- [ ] Cancellation shows refund amount and timeline before final confirmation
- [ ] Past appointments accessible for 12 months; rebooking pre-fills previous selections

---

### 3.9 Favorites
**Priority:** P1 | **Owner:** Product / Engagement

| Item | Specification |
|------|---------------|
| **Actions** | Heart toggle from any business view; confirmation toast |
| **List View** | Grid or list; sort by recently added, name, distance; availability badge |
| **Notifications** | Opt-in: "Your favorite [Business] has new availability" or "New review from [Business]" |
| **Quick Rebook** | One-tap to booking with previous service pre-selected |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite is instantaneous (< 200ms); syncs across devices
- [ ] Favorites list loads in < 1 second for 50 items
- [ ] Deleted/banned businesses are removed with inline notification
- [ ] Guest favorites prompt account creation with merge option

---

### 3.10 User Profile
**Priority:** P1 | **Owner:** Product / Design

| Section | Content |
|---------|---------|
| **Personal Info** | Name, photo, phone, email, birthday (for offers), gender (for service matching) |
| **Preferences** | Notification settings, default payment, preferred language, accessibility needs |
| **Payment Methods** | Cards, digital wallets; manage, default, delete |
| **Loyalty** | Points, rewards, referral code, referral history |
| **Privacy** | Data download, account deletion, marketing opt-outs |
| **Support** | FAQ, chat, email, call; ticket history |

**Acceptance Criteria:**
- [ ] Profile completion progress bar; gamified completion incentives
- [ ] Photo upload: crop, rotate, max 5MB; default to initials avatar
- [ ] All personal data deletable per GDPR/CCPA; 30-day hard deletion
- [ ] Support chat average response < 2 minutes during business hours

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Engineering / Product

| Item | Specification |
|------|---------------|
| **Business Hours** | Per-day open/close, with exception dates (holidays, closures) |
| **Staff Schedules** | Individual availability, breaks, time off, recurring patterns |
| **Slot Generation** | Based on service duration + buffer; considers parallel services (multi-staff rooms) |
| **Constraints** | Service-staff skill matching, equipment availability, room allocation, booking lead time, max advance booking |
| **Optimization** | Minimize gaps, prioritize high-value slots, respect staff preferences |
| **Caching** | Pre-computed slots for 30 days; real-time for today + next 3 days |

**Acceptance Criteria:**
- [ ] Slot query returns in < 200ms for single staff, < 500ms for multi-staff business
- [ ] Booking holds slot with distributed lock; expires in 10 minutes
- [ ] Schedule changes (staff sick, business closure) invalidate future slots and notify affected customers
- [ ] Timezone handling: business timezone displayed; customer sees in their timezone or explicit business timezone

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Design / Engineering

| Item | Specification |
|------|---------------|
| **Design Tokens** | Colors, typography, spacing, shadows, radii, animation curves — in Figma and code |
| **Component Library** | Buttons, inputs, cards, modals, bottom sheets, lists, empty states, skeletons, error states |
| **Icons** | Lucide or custom set; consistent sizing and stroke weights |
| **Accessibility** | WCAG 2.1 AA minimum; screen reader labels, focus management, color contrast, dynamic text sizing |
| **Cross-Platform** | Shared design language; platform-appropriate adaptations (iOS/Android navigation patterns) |
| **Documentation** | Storybook (web), component catalog (mobile), usage guidelines |

**Acceptance Criteria:**
- [ ] No custom one-off styles; all UI from documented components
- [ ] Dark mode support; respects system preference with override
- [ ] RTL language support (Arabic, Hebrew) without layout breakage
- [ ] Reduced motion preference honored for all animations

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Product / Trust & Safety

| Item | Specification |
|------|---------------|
| **Eligibility** | Verified customers only; post-appointment prompt (24-hour delay) |
| **Rating Dimensions** | Overall (1-5), service quality, staff, ambiance, value; optional per-dimension |
| **Content** | Text (min 20 chars, max 1000), photos (max 5), staff tagged |
| **Moderation** | Auto-flag: profanity, personal info, competitors; human review queue |
| **Business Response** | Public reply; notification to reviewer; dispute process |
| **Display** | Weighted recency algorithm; verified badge; helpful votes |

**Acceptance Criteria:**
- [ ] Review prompt sent after completed appointment; max 2 reminders
- [ ] Review appears after moderation (< 24 hours) or auto-approval for trusted users
- [ ] Business owner can flag review; 48-hour mediation before potential removal
- [ ] Average rating updates in real-time; distribution chart accurate

---

### 3.14 Payment Integration
**Priority:** P0 | **Owner:** Product / Engineering

| Item | Specification |
|------|---------------|
| **Processors** | Stripe (primary), Adyen (Europe expansion), PayPal (optional) |
| **Methods** | Credit/debit, Apple Pay, Google Pay, SEPA (EU), buy-now-pay-later (Klarna, Affirm — future) |
| **Flows** | Full payment at booking, deposit (remainder auto-charged or manual), pay at venue |
| **Split Payments** | Platform fee to Planity Clone; remainder to business (weekly payout) |
| **Security** | PCI DSS Level 1 via tokenization; 3D Secure for flagged transactions |
| **Receipts** | In-app, email, PDF download; itemized with tax |

**Acceptance Criteria:**
- [ ] Payment completion in < 10 seconds on stable connection
- [ ] Failed payment: clear error, preserve slot for 5 minutes, suggest alternative method
- [ ] Refund processed per policy; partial refunds supported with reason logging
- [ ] Payout dashboard for business: pending, paid, disputed; CSV export

---

### 3.15 Notifications
**Priority:** P1 | **Owner:** Product / Growth

| Channel | Triggers |
|---------|----------|
| **Push** | Booking confirmation, reminder (24h, 1h), change/cancel, promotion, re-engagement (dormant 30 days) |
| **SMS** | Backup for critical: confirmation, same-day reminder, urgent change |
| **Email** | Receipt, detailed itinerary, review request, monthly summary, marketing (opt-in) |
| **In-App** | Activity feed of all notifications; unread badge |
| **Preferences** | Granular opt-in per channel and type; quiet hours for push |

**Acceptance Criteria:**
- [ ] Notification delivery tracked: sent, delivered, opened, converted
- [ ] Rich push: deep link to relevant screen with context
- [ ] Unsubscribe honors channel preference immediately
- [ ] Failed push fallback to SMS for critical notifications

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Product / B2B

| Module | Features |
|--------|----------|
| **Dashboard** | Today's appointments, revenue, occupancy rate, new reviews, quick actions |
| **Calendar** | Day/week/month views; drag-drop reschedule; block time; multi-staff view; color-coded statuses |
| **Services** | CRUD services, pricing, duration, staff assignment, online/offline toggle |
| **Staff** | Add staff, set permissions, manage schedules, view individual performance |
| **Clients** | CRM: contact list, visit history, notes, allergies, marketing consent |
| **Bookings** | All appointments filterable; manual booking walk-in; no-show marking |
| **Analytics** | Revenue, bookings, cancellation rate, staff utilization, top services, customer retention |
| **Settings** | Business info, hours, policies, payment methods, integrations (accounting, POS) |
| **Mobile App** | Core calendar and notification features; full feature parity on tablet |

**Acceptance Criteria:**
- [ ] Business owner completes setup (profile, services, hours) in < 15 minutes
- [ ] Calendar syncs changes in < 2 seconds across all staff devices
- [ ] Manual booking generates customer notification and calendar block
- [ ] Analytics exportable to CSV/PDF; custom date ranges
- [ ] Role-based access: Owner (full), Manager (most), Staff (own schedule only)

---

### 3.17 Admin Dashboard
**Priority:** P1 | **Owner:** Product / Operations

| Module | Features |
|--------|----------|
| **Overview** | MAU, bookings, GMV, active businesses, churn, top categories; real-time and trend |
| **Business Management** | Onboard, verify (KYB), suspend, feature, search and filter |
| **User Management** | Customer search, suspend, impersonate (with audit), data export |
| **Content Moderation** | Review queue, dispute resolution, business content approval |
| **Financial** | Transaction monitoring, payout management, refund approval, fee structure adjustment |
| **Support** | Ticket system, escalation rules, SLA tracking, canned responses |
| **Marketing** | Promo code creation, push/email campaign tools, featured business placement |
| **System Health** | API latency, error rates, job queue depth, third-party status |

**Acceptance Criteria:**
- [ ] Critical alerts (fraud, system down) reach on-call in < 1 minute
- [ ] Business verification completes in < 4 hours during business days
- [ ] Support ticket first response in < 1 hour for premium, < 4 hours standard
- [ ] All admin actions logged immutably; 7-year retention

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 | **Owner:** Engineering

| Job Type | Description | Frequency |
|----------|-------------|-----------|
| **Slot Pre-computation** | Generate availability for next 30 days | Daily at 2 AM |
| **Reminder Notifications** | Send push/SMS/email for upcoming appointments | 24h and 1h before |
| **Review Prompts** | Trigger post-appointment review request | 24h after service |
| **Payout Calculation** | Aggregate business earnings, deduct fees, initiate transfer | Weekly (Mondays) |
| **Data Cleanup** | Archive old appointments, purge soft-deleted accounts, compress logs | Nightly |
| **Search Indexing** | Update Elasticsearch/Algolia with new/modified business data | Real-time + batch hourly |
| **Fraud Scoring** | Analyze patterns, flag suspicious bookings | Real-time + batch |
| **Report Generation** | Business and platform analytics reports | Daily/weekly/monthly |
| **Image Processing** | Resize, optimize, generate thumbnails on upload | On-demand |

**Acceptance Criteria:**
- [ ] Job queue depth monitored; alert at > 1000 pending
- [ ] Failed jobs retry with exponential backoff (max 5); dead letter queue for manual review
- [ ] Job idempotency: duplicate execution produces same result, no side effects
- [ ] Priority ordering: payment-related > customer-facing notifications > analytics > cleanup
- [ ] Graceful shutdown: in-progress jobs complete or safely re-queued on deployment

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App cold start < 3s; API p95 < 200ms; image load < 1s |
| **Reliability** | 99.95% uptime; scheduled maintenance windows announced 7 days ahead |
| **Security** | OWASP Top 10 mitigation; annual penetration test; bug bounty program |
| **Scalability** | Handle 10x traffic spike; auto-scaling on CPU/memory thresholds |
| **Compliance** | GDPR, CCPA, PCI DSS; data residency options; SOC 2 Type II target Year 2 |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Bookings | 10% MoM growth post-launch |
| Search-to-Book Conversion | > 15% |
| Booking Completion Rate | > 80% (start to confirm) |
| Business Retention | > 90% at 6 months |
| NPS (Customers) | > 50 |
| NPS (Businesses) | > 60 |
| Support Tickets / 1000 Users | < 5 |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Map, Business Detail, Booking, Appointment Mgmt, Basic Owner Portal, Payments | Month 1-3 |
| **Growth** | Favorites, Reviews, Notifications, Loyalty, Enhanced Analytics, Marketing Tools | Month 4-6 |
| **Scale** | Advanced Scheduling AI, Marketplace Features (products), International, API for Partners | Month 7-12 |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Next Review: Post-MVP launch*