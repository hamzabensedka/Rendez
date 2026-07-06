# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
A marketplace platform connecting service-seeking customers with local appointment-based businesses (beauty, wellness, health). Customers discover, book, and manage appointments. Business owners manage their schedule, services, and client base.

### 1.2 Target Users
- **Customers**: Individuals aged 18-55 seeking convenient appointment booking
- **Business Owners**: Small to medium service businesses (salons, barbers, spas, clinics)
- **Admins**: Platform operators managing marketplace health

### 1.3 Success Metrics
- Booking conversion rate > 15%
- Search-to-book time < 3 minutes
- Business owner onboarding < 10 minutes
- App crash rate < 0.5%

---

## 2. Feature Specifications

### F1: User Authentication
**Priority:** P0 | **Story Points:** 8

| Aspect | Specification |
|--------|---------------|
| **Description** | Secure, frictionless authentication supporting multiple entry points |
| **User Stories** | As a customer, I want to quickly create an account so I can book appointments. As a business owner, I want secure access to my dashboard. |
| **Flows** | Registration (email, phone, social), Login, Password reset, Email verification, Session refresh, Logout |

**Acceptance Criteria:**
- [ ] User can register with email + password, phone + OTP, or Google/Apple OAuth
- [ ] Password minimum: 8 chars, 1 uppercase, 1 number, 1 special character
- [ ] Email verification required before booking; 24h expiration on verification link
- [ ] JWT access token (15min) + refresh token (7 days) with secure httpOnly cookies
- [ ] Biometric login option on mobile (Face ID/Touch ID)
- [ ] Rate limit: 5 login attempts per 15 minutes per IP
- [ ] Account lockout after 10 failed attempts, unlock via email
- [ ] Social login creates linked account; can add password later
- [ ] Guest users prompted to authenticate at booking confirmation (soft wall)

---

### F2: Guest Browse & Explore
**Priority:** P0 | **Story Points:** 5

| Aspect | Specification |
|--------|---------------|
| **Description** | Full browsing capability without authentication to maximize discovery and SEO |
| **User Stories** | As an unregistered user, I want to browse services so I can decide to register. |
| **Flows** | Homepage view, Search results, Business detail view (read-only), Service listings |

**Acceptance Criteria:**
- [ ] All browse features accessible without login
- [ ] "Book Now" CTA triggers auth modal with pre-filled context (business, service, time)
- [ ] Guest session ID tracked for 30 days; converts to user account on registration
- [ ] Guest favorites stored locally; merge prompt on registration
- [ ] SEO-optimized server-rendered pages for all public content
- [ ] No access to: booking confirmation, appointment management, reviews (write), messaging

---

### F3: Business Search & Discovery
**Priority:** P0 | **Story Points:** 13

| Aspect | Specification |
|--------|---------------|
| **Description** | Intelligent search with filtering, sorting, and personalized results |
| **User Stories** | As a customer, I want to find relevant businesses near me with available slots today. |
| **Flows** | Text search, Filter application, Sort selection, Result browsing, Search history |

**Acceptance Criteria:**
- [ ] Full-text search across: business name, service names, staff names, tags
- [ ] Autocomplete with suggestions in < 150ms; debounced at 200ms
- [ ] Filters: location (radius 1-50km), service category, price range, rating, availability today/next 3 days, gender preference, accessibility
- [ ] Sort options: relevance (default), distance, rating, price (low-high), availability soonest
- [ ] Results per page: 20 mobile, 50 desktop; infinite scroll on mobile
- [ ] Business cards show: name, rating, photo, distance estimated price range, next available slot, distance
- [ ] Empty state with "expand search radius" and "notify when available" options
- [ ] Search history: store last 20 searches, allow clear and disable
- [ ] Personalized ranking: boost previously booked, favorited, or similar to past bookings

---

### F4: Map-based Search
**Priority:** P0 | **Story Points:** 8

| Aspect | Specification |
|--------|---------------|
| **Description** | Visual geographic exploration with interactive clustering |
| **User Stories** | As a customer, I want to see businesses on a map to choose by location. |
| **Flows** | Map view toggle, Pan/zoom, Cluster interaction, Pin selection, List-map sync |

**Acceptance Criteria:**
- [ ] Toggle between list and map views; persist preference per session
- [ ] Default map bounds: 5km radius around user location or search center
- [ ] Cluster markers for density > 10 pins in viewport; show count
- [ ] Individual pins: business photo thumbnail, rating, price indicator color
- [ ] Pin tap: bottom sheet with business summary; tap through to detail
- [ ] Current location button with permission prompt; fallback to IP geolocation
- [ ] Map bounds update search results; URL sync for shareable map views
- [ ] Performance: < 500ms to render 500 pins; use viewport culling

---

### F5: Business Detail View
**Priority:** P0 | **Story Points:** 8

| Aspect | Specification |
|--------|---------------|
| **Description** | Comprehensive business profile driving conversion to booking |
| **User Stories** | As a customer, I want to see all business details to make an informed booking decision. |
| **Flows** | Profile viewing, Photo gallery, Service selection, Staff browsing, Review reading |

**Acceptance Criteria:**
- [ ] Hero: business name, verified badge, rating (stars + count), favorite toggle, share button
- [ ] Photo gallery: up to 30 images, swipeable, full-screen viewer, alt text for accessibility
- [ ] About section: description (500 char max), languages spoken, COVID/safety protocols
- [ ] Services: grouped by category, expandable, with duration, price, description
- [ ] Staff profiles: photo, bio, specialties, average rating, next availability
- [ ] Hours: current day highlighted, special hours/holiday closures flagged
- [ ] Location: address, copy button, "Get directions" deep link to maps app
- [ ] Contact: phone (click-to-call), message button (requires auth), website link
- [ ] Similar businesses carousel at bottom
- [ ] Sticky "Book" CTA on mobile; primary action always visible

---

### F6: Service Categories
**Priority:** P0 | **Story Points:** 5

| Aspect | Specification |
|--------|---------------|
| **Description** | Hierarchical classification for discovery and business organization |
| **User Stories** | As a business owner, I want to categorize my services. As a customer, I want to browse by category. |
| **Flows** | Category browsing, Subcategory drilling, Service assignment |

**Acceptance Criteria:**
- [ ] Top-level categories: Hair, Barber, Beauty, Nails, Massage, Spa, Wellness, Medical Aesthetic, Fitness, Other
- [ ] Each category has 3-8 subcategories (e.g., Hair > Cut, Color, Styling, Treatment)
- [ ] Business must select 1-3 primary categories; all subcategories available for services
- [ ] Category icons from design system; consistent across platforms
- [ ] Trending categories surfaced on homepage based on seasonality and locale
- [ ] Category pages: featured businesses, average prices, popular services
- [ ] Admin can add/edit categories; changes reflect in 24 hours (cache invalidation)

---

### F7: Booking Flow
**Priority:** P0 | **Story Points:** 13

| Aspect | Specification |
|--------|---------------|
| **Description** | Streamlined multi-step booking minimizing abandonment |
| **User Stories** | As a customer, I want to book an appointment in under 60 seconds. |
| **Flows** | Service selection → Staff preference → Date/time → Add-ons → Details → Payment → Confirmation |

**Acceptance Criteria:**
- [ ] Step 1 - Service: select from business services, see duration and price; can select multiple
- [ ] Step 2 - Staff: "Any available" default, or choose specific; show staff calendar preview
- [ ] Step 3 - Date/Time: calendar view (2 weeks forward), time slots in 15-min increments, timezone shown
- [ ] Step 4 - Add-ons: optional extras (e.g., deep conditioning, nail art), with prices
- [ ] Step 5 - Details: notes for provider, request specific accommodations
- [ ] Step 6 - Review: summary with edit links for each section, total price, cancellation policy
- [ ] Step 7 - Payment: see Payment Integration (F14)
- [ ] Step 8 - Confirmation: booking reference, calendar invite, add to wallet, share
- [ ] Slot holds for 10 minutes during booking; release on timeout or abandonment
- [ ] Progress indicator; can navigate back to any step
- [ ] Mobile: single-column, thumb-friendly targets; desktop: side-by-side calendar and slots
- [ ] Abandoned booking recovery: email reminder at 1 hour, 24 hours with direct link to resume

---

### F8: Appointment Management
**Priority:** P0 | **Story Points:** 8

| Aspect | Specification |
|--------|---------------|
| **Description** | Full lifecycle management for customer appointments |
| **User Stories** | As a customer, I want to view, reschedule, and cancel my appointments. |
| **Flows** | Upcoming list, Past history, Detail view, Reschedule, Cancel, Rebook |

**Acceptance Criteria:**
- [ ] Upcoming appointments: chronological, grouped by date, with countdown
- [ ] Card shows: business photo, name, service, staff, date/time, status (confirmed, pending, completed, cancelled, no-show)
- [ ] Detail view: full info, map, contact buttons, directions, add to calendar
- [ ] Reschedule: search alternative slots with same parameters; no fee if > 24h before
- [ ] Cancel: reason capture (optional), confirmation modal, refund policy display
- [ ] Late cancellation (< 24h): warning of potential fee per business policy
- [ ] No-show: marked by business; affects future booking privileges after 3 no-shows
- [ ] Rebook: one-tap rebooking with same service/staff, new time selection
- [ ] Push and email reminders: 24h, 2h, 15min before appointment

---

### F9: Favorites
**Priority:** P1 | **Story Points:** 3

| Aspect | Specification |
|--------|---------------|
| **Description** | Save and organize preferred businesses for quick access |
| **User Stories** | As a customer, I want to save my favorite salons for quick rebooking. |
| **Flows** | Add/remove favorite, View favorites list, See favorite availability |

**Acceptance Criteria:**
- [ ] Heart toggle on business card and detail; immediate feedback, sync to server
- [ ] Favorites list: sortable by name, recently added, or next availability
- [ ] Each favorite shows: photo, name, rating, next available slot, last visit date
- [ ] Quick book from favorites: skip to date/time selection with pre-filled service
- [ ] Favorites sync across devices; survive app reinstall via account
- [ ] Maximum 200 favorites; prompt to organize when approaching limit
- [ ] Share favorite: generate link pre-filling business in friend's search

---

### F10: User Profile
**Priority:** P1 | **Story Points:** 5

| Aspect | Specification |
|--------|---------------|
| **Description** | Customer identity, preferences, and account management |
| **User Stories** | As a customer, I want to manage my personal information and preferences. |
| **Flows** | View profile, Edit details, Manage preferences, View activity, Delete account |

**Acceptance Criteria:**
- [ ] Profile photo: upload, crop to circle, max 5MB; optional, default to initials avatar
- [ ] Fields: first name, last name, email, phone, birthday (optional, for birthday offers)
- [ ] Preferences: notification settings (push, email, SMS), default search radius, preferred language, accessibility needs
- [ ] Activity: total bookings, favorite categories, member since, loyalty points (if applicable)
- [ ] Payment methods: see Payment Integration (F14)
- [ ] Privacy: data download (GDPR), account deletion with 30-day grace period
- [ ] Referral code: generate, share, track credits
- [ ] Security: change password, view active sessions, log out all devices

---

### F11: Availability & Slot Computation
**Priority:** P0 | **Story Points:** 13

| Aspect | Specification |
|--------|---------------|
| **Description** | Real-time, accurate availability calculation considering all constraints |
| **User Stories** | As a business, I want my availability to reflect my actual schedule. As a customer, I want accurate slot availability. |
| **Flows** | Business hours setup, Break/block management, Service duration mapping, Staff assignment, Real-time slot generation |

**Acceptance Criteria:**
- [ ] Business sets: weekly recurring hours, per-staff hours (if different), closed dates
- [ ] Slot generation: divide open hours by service duration + buffer; respect staff availability
- [ ] Concurrent bookings: support multiple staff, rooms, or stations
- [ ] Buffer time: configurable between appointments (0-60 min)
- [ ] Service chaining: combo services with sequential or parallel staff requirements
- [ ] Block types: personal break, lunch, staff meeting, vacation, sick leave
- [ ] Real-time updates: booking holds, cancellations immediately reflect in availability
- [ ] Cache strategy: generate slots on-demand with 5-minute TTL; invalidate on schedule change
- [ ] Edge cases: service longer than remaining open hours (no slots shown), overnight services (rare, flag for review)
- [ ] Performance: slot generation for 2 weeks in < 200ms for single staff, < 500ms for multi-staff business

---

### F12: Shared Types & Design System
**Priority:** P0 | **Story Points:** 5 (ongoing)

| Aspect | Specification |
|--------|---------------|
| **Description** | Consistent, scalable UI/UX foundation across all platforms |
| **User Stories** | As a user, I want a familiar, predictable interface. As a developer, I want reusable components. |
| **Flows** | N/A - cross-cutting concern |

**Acceptance Criteria:**
- [ ] Design tokens: colors (primary, secondary, semantic), typography (font family, sizes, weights), spacing scale, border radius, shadows
- [ ] Component library: Button, Input, Select, DatePicker, TimeSlot, Card, Modal, Toast, Skeleton, Avatar, Rating, Badge, Accordion, Tabs, Stepper
- [ ] Shared TypeScript types: User, Business, Service, Staff, Appointment, Slot, Review, Payment, Notification
- [ ] API contracts: OpenAPI/Swagger documentation; versioned (v1, v2)
- [ ] Accessibility: WCAG 2.1 AA minimum; screen reader support, keyboard navigation, focus management, color contrast 4.5:1
- [ ] Responsive breakpoints: mobile < 768px, tablet 768-1024px, desktop > 1024px
- [ ] Dark mode support: automatic via system preference, manual toggle, persist choice
- [ ] Animation: 200ms standard duration, ease-out easing; respect `prefers-reduced-motion`
- [ ] Error states: consistent empty, loading, error, and retry patterns

---

### F13: Reviews & Ratings
**Priority:** P1 | **Story Points:** 5

| Aspect | Specification |
|--------|---------------|
| **Description** | Trusted social proof driving discovery and quality assurance |
| **User Stories** | As a customer, I want to read honest reviews. As a business, I want to build reputation. |
| **Flows** | Read reviews, Write review, Respond to review, Report review, Aggregate display |

**Acceptance Criteria:**
- [ ] Review eligibility: verified customers only (completed appointment within 90 days)
- [ ] Rating: 1-5 stars, overall + optional category ratings (service, cleanliness, value, atmosphere)
- [ ] Review content: 10-1000 characters, optional photo upload (max 5, 10MB each)
- [ ] Business response: public reply, notification to reviewer
- [ ] Review display: sort by newest, highest, lowest, most helpful; filter by rating, verified status, with photos
- [ ] Helpful voting: logged-in users can mark helpful; sort by helpfulness
- [ ] Report review: reason selection (fake, offensive, not a customer, other); admin review queue
- [ ] Aggregate: average rating, distribution histogram, trend over time
- [ ] Moderation: auto-flag keywords; human review within 24 hours for reported content
- [ ] Review solicitation: post-appointment email at 24 hours, push at 48 hours, max 2 reminders

---

### F14: Payment Integration
**Priority:** P0 | **Story Points:** 8

| Aspect | Specification |
|--------|---------------|
| **Description** | Secure, flexible payment handling for bookings |
| **User Stories** | As a customer, I want to pay securely. As a business, I want guaranteed payment. |
| **Flows** | Add payment method, Pay at booking, Pay at venue, Refund, Receipt, Dispute |

**Acceptance Criteria:**
- [ ] Payment methods: credit/debit card (Stripe), Apple Pay, Google Pay, PayPal; save for future use
- [ ] Payment timing: full prepay, deposit (configurable %), or pay at venue (business option)
- [ ] PCI compliance: never store raw card data; use Stripe Elements or equivalent
- [ ] 3D Secure for applicable transactions; fallback handling
- [ ] Receipt: email and in-app, with business VAT info if applicable
- [ ] Refund: full refund if cancelled > 24h; partial per business policy; automatic or manual approval
- [ ] Failed payment: retry with saved method, alternative method, or abandon (release slot)
- [ ] Payout to business: weekly to connected account; dashboard shows pending/available balance
- [ ] Platform fee: configurable %, deducted before payout, shown transparently
- [ ] Dispute handling: notification to business, evidence collection, admin arbitration

---

### F15: Notifications
**Priority:** P1 | **Story Points:** 5

| Aspect | Specification |
|--------|---------------|
| **Description** | Timely, relevant, user-controlled communication |
| **User Stories** | As a user, I want to be informed without being overwhelmed. |
| **Flows** | Push, Email, SMS, In-app notification center, Preference management |

**Acceptance Criteria:**
- [ ] Channels: push (mobile), email, SMS (for urgent: booking confirmations, 24h reminders), in-app inbox
- [ ] Customer notifications: booking confirmed, modified, cancelled; appointment reminders; review request; promotional (opt-in); payment issues
- [ ] Business notifications: new booking, cancellation, review received, payout issued, low availability alert
- [ ] In-app inbox: persistent notification history, mark read/unread, delete; unread badge on tab
- [ ] Preferences: granular control per category and channel; respect global DND hours (default 22:00-08:00)
- [ ] Delivery: push via Firebase/OneSignal; email via SendGrid/Mailgun; SMS via Twilio
- [ ] Retry logic: failed push → email fallback for critical notifications; max 3 retries
- [ ] Unsubscribe: one-click for marketing; transactional always deliver

---

### F16: Provider / Business Owner Portal
**Priority:** P0 | **Story Points:** 13

| Aspect | Specification |
|--------|---------------|
| **Description** | Comprehensive business management interface |
| **User Stories** | As a business owner, I want to manage my entire operation from one place. |
| **Flows** | Onboarding, Dashboard, Calendar, Services, Staff, Clients, Settings, Analytics |

**Acceptance Criteria:**
- [ ] Onboarding: 5-step wizard (business info, hours, services, staff, connect payout); can save and resume
- [ ] Dashboard: today's appointments, revenue this week, new clients, upcoming week preview
- [ ] Calendar: day/week/month views, drag-to-reschedule, color-coded by staff, quick block time
- [ ] Services: CRUD with name, description, duration, price, category, buffer, online booking toggle
- [ ] Staff: profiles, permissions (view only, manage own, manage all, admin), hours override
- [ ] Clients: searchable directory, visit history, notes (private), preferred contact method
- [ ] Booking rules: min/max advance notice, cancellation policy, no-show policy, deposit requirement
- [ ] Availability exceptions: single or recurring blocks, holiday closures
- [ ] Analytics: booking volume, revenue, cancellation rate, popular services, peak hours, client retention; exportable CSV
- [ ] Mobile-responsive; native app companion with push for new bookings

---

### F17: Admin Dashboard
**Priority:** P1 | **Story Points:** 8

| Aspect | Specification |
|--------|---------------|
| **Description** | Platform oversight and operational management |
| **User Stories** | As an admin, I want to monitor and manage marketplace health. |
| **Flows** | User management, Business verification, Content moderation, Financial oversight, System health |

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, impersonate (with audit log); filter by status, role, registration date
- [ ] Business verification: review submitted documents (license, insurance), approve/reject with reason, track verification status
- [ ] Content moderation: reported reviews queue, business photo approval, flagged content escalation
- [ ] Financial: transaction log, dispute queue, refund approval, payout monitoring, fee adjustment
- [ ] Analytics: MAU, booking volume, GMV, churn, top categories, geographic distribution; date range selection
- [ ] System health: queue depths, error rates, API latency, third-party service status
- [ ] Role-based access: super admin, support, finance, operations; permissions matrix
- [ ] Audit log: all admin actions with timestamp, admin ID, action, target, before/after state

---

### F18: Background Jobs (BullMQ)
**Priority:** P1 | **Story Points:** 5

| Aspect | Specification |
|--------|---------------|
| **Description** | Reliable, observable asynchronous processing |
| **User Stories** | As a system, I want tasks to complete reliably without blocking user requests. |
| **Flows** | Queue definition, Job scheduling, Error handling, Monitoring, Retry logic |

**Acceptance Criteria:**
- [ ] Queues defined: email, push, sms, payment, search-index, analytics, image-processing, slot-cache-warm, report-generation
- [ ] Job payload: typed, validated, idempotent where possible; include trace ID for observability
- [ ] Scheduling: immediate, delayed (e.g., reminder at specific time), recurring (cron syntax for reports)
- [ ] Retry: exponential backoff, max 5 attempts; dead letter queue after exhaustion; alert on DLQ
- [ ] Concurrency: configurable per queue; priority levels (critical, highource, normal, low)
- [ ] Monitoring: queue depth, processing rate, failure rate, average job duration; dashboard in admin
- [ ] Graceful shutdown: finish in-progress jobs, mark stalled as failed, resume on restart
- [ ] Redis: clustered for production; failover handling

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | P95 API response < 200ms; page load < 2s on 3G; image lazy loading |
| **Security** | OWASP Top 10 mitigation; dependency scanning; penetration testing annually |
| **Scalability** | Stateless services; horizontal pod autoscaling; database read replicas |
| **Reliability** | 99.9% uptime SLA; automated failover; daily backups with 30-day retention |
| **Compliance** | GDPR, CCPA, PCI-DSS; data residency options; terms and privacy policy |

## 4. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | F1, F2, F3, F4, F5, F6, F7, F8, F11, F12, F14, F16 | 12 weeks |
| **V1.1** | F9, F10, F13, F15, F18 | 6 weeks |
| **V1.2** | F17, enhanced analytics, loyalty program v1 | 8 weeks |

## 5. Open Questions

1. International billing: single currency MVP or multi-currency from launch?
2. Staff-specific pricing: required for MVP or V1.1?
3. Marketplace vs. SaaS model: commission on bookings, subscription, or hybrid?
4. International expansion: i18n framework selection and initial locale priorities