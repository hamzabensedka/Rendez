# Planity Clone — Product Specification

## 1. Overview

Build a marketplace platform connecting customers with beauty/wellness businesses for appointment booking. Two-sided: consumer mobile app + web portal for business owners.

---

## 2. Features & Acceptance Criteria

### 2.1 User Authentication (P0)

| Aspect | Specification |
|--------|---------------|
| Registration | Email/password, Google OAuth, Apple Sign-In |
| Login | JWT access (15min) + refresh token (7 days) stored securely |
| Password Reset | Email link with 1-hour expiry |
| Phone Verification | OTP via SMS for high-trust actions (booking confirmation) |

**Acceptance Criteria:**
- AC-1.1: User can register with email; password requires 8+ chars, 1 uppercase, 1 number
- AC-1.2: OAuth flows complete in <3 seconds with fallback to email linking
- AC-1.3: Refresh token rotation on each use; revoked on logout from all devices option
- AC-1.4: Rate limit: 5 login attempts per 15 minutes per IP

---

### 2.2 Guest Browse & Explore (P0)

| Aspect | Specification |
|--------|---------------|
| Access | Full browse without account; booking requires auth |
| Location | Auto-detect via IP or manual city selection |
| Persistence | Guest favorites/bookings prompt account creation |

**Acceptance Criteria:**
- AC-2.1: Unauthenticated users see all businesses, services, reviews
- AC-2.2: "Book" CTA triggers auth modal with pre-filled context
- AC-2.3: Guest selections transfer to account upon registration

---

### 2.3 Business Search & Discovery (P0)

| Aspect | Specification |
|--------|---------------|
| Search | Full-text on business name, service name, description |
| Filters | Category, price range, rating (4.0+), availability today, gender, accessibility |
| Sorting | Relevance, distance, rating, price (low-high) |
| Results | Card view: image, name, rating, distance, next available slot |

**Acceptance Criteria:**
- AC-3.1: Search returns results in <500ms for 100k businesses
- AC-3.2: Auto-complete suggestions after 2 characters
- AC-3.3: Empty state with "expand radius" or "notify when available"
- AC-3.4: Filter stack persists across session

---

### 2.4 Map-based Search (P0)

| Aspect | Specification |
|--------|---------------|
| Map | Google Maps or Mapbox; default 5km radius |
| Clusters | Group markers at zoom < 12 |
| Interaction | Tap marker → bottom sheet preview; tap preview → detail |
| User Location | Blue dot with accuracy ring; recenter button |

**Acceptance Criteria:**
- AC-4.1: Map loads with 20 nearest businesses; lazy load on pan/zoom
- AC-4.2: List/map toggle preserves search context
- AC-4.3: Marker color: green (slots today), yellow (tomorrow), gray (later)

---

### 2.5 Business Detail View (P0)

| Aspect | Specification |
|--------|---------------|
| Header | Image carousel (max 10), business name, verified badge, rating, review count |
| Info | Address, hours, phone, website, COVID/safety protocols |
| Services | Expandable categories with duration, price, description |
| Team | Staff profiles with specialties, photos, ratings |
| Reviews | Aggregate + recent 5 with "see all" |

**Acceptance Criteria:**
- AC-5.1: Page loads in <2s; images lazy-loaded with blur placeholder
- AC-5.2: "Book" CTA sticky on scroll for selected service
- AC-5.3: Share via native sheet (deep link)
- AC-5.4: Report inaccurate info flow

---

### 2.6 Service Categories (P0)

| Aspect | Specification |
|--------|---------------|
| Hierarchy | Category → Subcategory → Service (3 levels max) |
| Examples | Hair (Cut, Color, Treatment), Nails (Manicure, Pedicure, Art), Massage, Facial, etc. |
| Attributes | Duration (fixed/variable), price (fixed/from), deposit required, cancellation policy |

**Acceptance Criteria:**
- AC-6.1: Categories seeded with 50+ predefined options; admin can add custom
- AC-6.2: Service can have multiple staff qualified to perform
- AC-6.3: Variable duration services show range in search, confirm at booking

---

### 2.7 Booking Flow (P0)

| Step | Action |
|------|--------|
| 1. Select | Service + optional staff preference |
| 2. Date | Calendar with availability heat map |
| 3. Time | Slots in 15-min increments; grouped morning/afternoon/evening |
| 4. Confirm | Review details, apply promo code, add notes |
| 5. Pay | Deposit or full payment (, see 2.14) |
| 6. Done | Confirmation screen with add-to-calendar, share |

**Acceptance Criteria:**
- AC-7.1: Slot availability computed in real-time (see 2.11)
- AC-7.2: Hold slot for 10 minutes during checkout; release on timeout or abandonment
- AC-7.3: Booking confirmation email + push within 5 seconds
- AC-7.4: Reschedule/cancel accessible from confirmation for free up to 24h before
- AC-7.5: Waitlist option if no slots; auto-book on cancellation

---

### 2.8 Appointment Management (P0)

| Aspect | Specification |
|--------|---------------|
| Views | Upcoming (list), Past (history), Cancelled |
| Actions | Reschedule (pick new slot), Cancel (with reason), Rebook |
| Details | QR code for check-in, directions, contact business, add to calendar |
| Reminders | 24h, 2h, 15min before via push/SMS |

**Acceptance Criteria:**
- AC-8.1: Upcoming appointments sorted by date; pull-to-refresh
- AC-8.2: Reschedule follows same slot computation; old slot released immediately
- AC-8.3: Cancellation policy enforced: free >24h, 50% 24-2h, 100% <2h (configurable by business)
- AC-8.4: No-show marked by business; affects future booking privileges

---

### 2.9 Favorites (P1)

| Aspect | Specification |
|--------|---------------|
| Save | Heart icon on business card/detail |
| List | Dedicated tab with recent activity sort |
| Alerts | Notify when favorite has new availability or promotion |

**Acceptance Criteria:**
- AC-9.1: Sync across devices for logged-in users
- AC-9.2: Guest favorites stored locally; prompt to save on app exit
- AC-9.3: Batch remove with multi-select

---

### 2.10 User Profile (P1)

| Aspect | Specification |
|--------|---------------|
| Data | Name, phone, email, photo, birthday (for loyalty), gender preference |
| Preferences | Default radius, notification settings, payment methods |
| History | Stats: total bookings, favorite categories, money saved |
| Privacy | GDPR export/delete; marketing opt-in |

**Acceptance Criteria:**
- AC-10.1: Profile completion progress bar; 80%+ for full feature access
- AC-10.2: Change email requires re-verification
- AC-10.3: Delete account queues background job for 30-day grace period

---

### 2.11 Availability & Slot Computation (P0 — Core Algorithm)

| Aspect | Specification |
|--------|---------------|
| Inputs | Business hours, staff schedules, service duration, buffer time, existing bookings, blocked times |
| Output | Available slots per service/staff combination |
| Performance | Compute in <100ms; cache for 5 minutes |
| Edge Cases | Multi-staff services, overlapping allowed (e.g., color + cut), split services |

**Acceptance Criteria:**
- AC-11.1: Slot generation respects all constraints; no double-bookings
- AC-11.2: Business can set recurring availability and one-off exceptions
- AC-11.3: "Smart suggest" next available across any staff if preferred unavailable
- AC-11.4: Handle DST transitions and timezone correctly

---

### 2.12 Shared Types & Design System (P0)

| Aspect | Specification |
|--------|---------------|
| Design Tokens | Colors (primary: #6B46C1), typography (Inter), spacing (4px grid), shadows, radii |
| Components | Buttons, inputs, cards, modals, bottom sheets, loaders, empty states |
| Platform | iOS (SwiftUI/UIKit hybrid), Android (Jetpack Compose), Web (React) |
| Accessibility | WCAG 2.1 AA; screen reader support, minimum touch 44x44dp |

**Acceptance Criteria:**
- AC-12.1: Component library in Storybook/Compose Catalog with usage docs
- AC-12.2: Dark mode support via system or manual toggle
- AC-12.3: RTL layout support for internationalization

---

### 2.13 Reviews & Ratings (P1)

| Aspect | Specification |
|--------|---------------|
| Eligibility | Verified customers only; post-appointment prompt after 24h |
| Content | 1-5 stars, text (optional), photo (optional), staff-specific rating |
| Moderation | Auto-flag profanity; manual review queue |
| Response | Business owner can reply publicly |

**Acceptance Criteria:**
- AC-13.1: Rating requires minimum 10 characters if text provided
- AC-13.2: Edit window: 30 days; delete by user anytime
- AC-13.3: Aggregate recalculates nightly; weighted recency algorithm
- AC-13.4: "Helpful" voting on reviews

---

### 2.14 Payment Integration (P0)

| Aspect | Specification |
|--------|---------------|
| Gateway | Stripe Connect (marketplace) + PayPal fallback |
| Flows | Full prepay, deposit (e.g., 20%), pay-at-venue |
| Saved Methods | Cards; Apple Pay, Google Pay; SEPA for EU |
| Refunds | Automated per cancellation policy; manual override by support |

**Acceptance Criteria:**
- AC-14.1: PCI compliance via Stripe Elements; no raw card storage
- AC-14.2: 3D Secure for transactions >€30
- AC-14.3: Receipt email with VAT breakdown
- AC-14.4: Failed payment retry with saved method or new input

---

### 2.15 Notifications (P1)

| Channel | Use Cases |
|---------|-----------|
| Push | Booking confirmed, reminder, cancelled, promotion, review prompt |
| SMS | Reminder, OTP, urgent changes |
| Email | Receipt, confirmation, monthly summary, re-engagement |
| In-App | Bell icon with unread count; persists 30 days |

**Acceptance Criteria:**
- AC-15.1: User controls per-channel preferences per notification type
- AC-15.2: Delivery tracking: mark read on open, not just receive
- AC-15.3: Batch digest option for non-urgent (daily at 9am)

---

### 2.16 Provider / Business Owner Portal (P0)

| Module | Features |
|--------|----------|
| Dashboard | Today's appointments, revenue this week, new reviews |
| Calendar | Day/week/month views; drag to reschedule; block time |
| Services | CRUD with pricing, duration, online booking toggle |
| Staff | Profiles, permissions (admin/staff), schedules |
| Clients | CRM: notes, visit history, allergies, marketing consent |
| Settings | Business hours, cancellation policy, payment account |

**Acceptance Criteria:**
- AC-16.1: Portal responsive web; native apps phase 2
- AC-16.2: Real-time sync with consumer app (<3s delay)
- AC-16.3: Role-based access: owner sees billing, staff sees own calendar only
- AC-16.4: Export bookings to .ics or Google/Outlook calendar

---

### 2.17 Admin Dashboard (P2)

| Module | Features |
|--------|----------|
| Users | Search, suspend, impersonate (audit log) |
| Businesses | Onboard, verify documents, feature/unfeature, commission rates |
| Bookings | View all, refund, dispute resolution |
| Content | Category management, featured collections, promo campaigns |
| Analytics | MAU, bookings, GMV, churn, top categories |
| Support | Ticket system, canned responses, escalation rules |

**Acceptance Criteria:**
- AC-17.1: Audit log immutable; 7-year retention
- AC-17.2: SLA: critical tickets <2h, standard <24h

---

### 2.18 Background Jobs (BullMQ) (P0)

| Job | Trigger | Frequency |
|-----|---------|-----------|
| Slot cache warm | Business hours change, booking CRUD | Real-time + hourly |
| Reminder notifications | Appointment time - threshold | Scheduled per appointment |
| Nightly reports | 6am business timezone | Daily |
| Review solicitation | Appointment completed + 24h | Per-event |
| Payment capture | Deposit bookings, appointment time | Per-event |
| Data archival | configurable | Monthly |
| Search index rebuild | Manual or scheduled | Weekly |

**Acceptance Criteria:**
- AC-18.1: Jobs idempotent; retry with exponential backoff (max 5)
- AC-18.2: Dead letter queue for manual inspection
- AC-18.3: Job progress visible in admin; cancel/restart capability
- AC-18.4: Separate queues by priority: notifications > payments > reports

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App cold start <2s; API p99 <200ms |
| Availability | 99.9% uptime; maintenance windows announced 48h prior |
| Security | OWASP Top 10 mitigated; annual penetration test |
| Compliance | GDPR, CCPA, PCI-DSS Level 1 |
| Scalability | Horizontal scaling to 10M users, 100k businesses |

---

## 4. Prioritization

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.11, 2.12, 2.14, 2.16, 2.18 | Months 1-4 |
| V1.1 | 2.9, 2.10, 2.13, 2.15 | Months 5-6 |
| V1.2 | 2.17 | Months 7-8 |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | >15% search-to-book |
| Cancellation rate | <10% |
| NPS | >50 |
| Provider activation | >80% complete profile within 7 days |
| App store rating | >4.5 stars |

---

*Document version: 1.0 | Last updated: Product Owner*