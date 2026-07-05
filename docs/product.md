# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
A marketplace platform connecting beauty & wellness service providers with customers, enabling seamless discovery, booking, and appointment management.

### 1.2 Target Users
- **Customers**: Individuals seeking beauty/wellness appointments
- **Providers**: Business owners and staff managing appointments
- **Admin**: Platform operators overseeing marketplace health

### 1.3 Success Metrics
- Booking conversion rate > 15%
- Provider onboarding < 48 hours
- App load time < 3 seconds
- Search-to-book time < 2 minutes

---

## 2. Feature Specifications

### 2.1 User Authentication (Priority: P0)

**User Story**: As a user, I want to authenticate securely so I can access personalized features and manage my bookings.

**Acceptance Criteria**:
- [ ] Users can register with email/password, phone number, or OAuth (Google, Apple, Facebook)
- [ ] Passwords require minimum 8 characters with 1 uppercase, 1 number, 1 special character
- [ ] Email verification required before first booking
- [ ] Phone verification via SMS OTP for high-risk actions (changing email, password reset)
- [ ] JWT access tokens (15min expiry) with refresh token rotation
- [ ] Biometric authentication option on supported devices
- [ ] "Remember me" option extends session to 30 days
- [ ] Account lockout after 5 failed attempts, 30-minute cooldown
- [ ] Social login automatically links accounts with matching verified email
- [ ] Guest checkout allowed but prompts account creation post-booking

**Technical Notes**:
- Implement rate limiting: 5 requests/minute per IP for auth endpoints
- Store password hashes with bcrypt (cost factor 12)

---

### 2.2 Guest Browse & Explore (Priority: P0)

**User Story**: As an unauthenticated user, I want to browse services without committing to registration so I can evaluate the platform.

**Acceptance Criteria**:
- [ ] Full search and filter functionality accessible without login
- [ ] Business detail pages viewable with limited information (no contact info, no exact addresses)
- [ ] "Book" CTA triggers login modal with pre-filled context
- [ ] Guest can view up to 5 business profiles before soft paywall prompts registration
- [ ] Location permission requested to improve nearby results
- [ ] Recent searches and viewed businesses stored in localStorage for 7 days
- [ ] Deep links to businesses work without authentication

---

### 2.3 Business Search & Discovery (Priority: P0)

**User Story**: As a customer, I want to find relevant service providers quickly so I can book appointments efficiently.

**Acceptance Criteria**:
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Autocomplete suggestions after 3 characters with debounce 300ms
- [ ] Search history persists (authenticated: cloud, guest: localStorage)
- [ ] Trending searches section on empty state
- [ ] Recent searches with one-tap re-execution
- [ ] Search filters: distance (km/mi), price range, rating, availability ("open now", specific date), service category, amenities
- [ ] Sort options: relevance, distance, rating, price (low-high), availability (soonest)
- [ ] Pagination with infinite scroll, 20 results per page
- [ ] Empty state with alternative suggestions and "broaden search" CTA
- [ ] Voice search capability on mobile

---

### 2.4 Map-based Search (Priority: P0)

**User Story**: As a customer, I want to see businesses on a map so I can choose providers by location convenience.

**Acceptance Criteria**:
- [ ] Toggle between list and map views, persist preference
- [ ] Map shows business pins clustered at zoom levels > 12
- [ ] Pin color indicates availability: green (slots today), yellow (slots this week), gray (no availability)
- [ ] Tap pin shows business card with photo, rating, price from, next availability
- [ ] Map bounds filter search results dynamically
- [ ] User location dot with accuracy radius
- [ ] "Search this area" button after map pan/zoom
- [ ] Directions integration (Google Maps, Apple Maps, Waze)
- [ ] Satellite/hybrid map style toggle
- [ ] Accessibility: screen reader announces business count in viewport

---

### 2.5 Business Detail View (Priority: P0)

**User Story**: As a customer, I want comprehensive business information so I can make informed booking decisions.

**Acceptance Criteria**:
- [ ] Hero: business name, verified badge, rating, review count, favorite toggle
- [ ] Photo gallery: up to 20 images, fullscreen viewer with pinch-zoom
- [ ] Description with expandable text (max 3 lines collapsed)
- [ ] Services tab: filterable by category, expandable service cards with duration, price, description
- [ ] Team tab: staff profiles with photos, specialties, ratings
- [ ] Reviews tab: sortable (recent, highest, lowest), filterable by service, photos only
- [ ] About tab: hours, amenities, payment methods, cancellation policy, COVID protocols
- [ ] Sticky "Book Now" CTA, pre-selects most popular service
- [ ] Share functionality (deep link, native share sheet)
- [ ] Report business option for inappropriate content

---

### 2.6 Service Categories (Priority: P0)

**User Story**: As a platform, we need hierarchical categorization so customers can browse intuitively and providers can classify offerings.

**Acceptance Criteria**:
- [ ] Top-level categories: Hair, Nails, Face, Body, Massage, Wellness, Medical Aesthetic, Fitness
- [ ] Each category has 3-10 subcategories (e.g., Hair > Cut, Color, Styling, Treatments)
- [ ] Category icon set consistent with design system
- [ ] Category browse page shows featured businesses, trending services, price guides
- [ ] Businesses can assign up to 3 primary categories
- [ ] Services belong to exactly one subcategory
- [ ] Category pages are SEO-optimized with structured data
- [ ] Admin can configure category visibility and ordering

---

### 2.7 Booking Flow (Priority: P0)

**User Story**: As a customer, I want to book appointments with minimal friction so I can secure my preferred time slot.

**Acceptance Criteria**:
- [ ] Step 1: Select service(s) with optional add-ons
- [ ] Step 2: Select staff member or "no preference"
- [ ] Step 3: Calendar view with available slots highlighted; unavailable dates grayed out
- [ ] Step 4: Time slot selection in 15-minute increments
- [ ] Step 5: Review booking details with price breakdown
- [ ] Step 6: Apply promo code (if applicable)
- [ ] Step 7: Payment or "pay at venue" selection
- [ ] Step 8: Confirmation with calendar invite (.ics), add to wallet, share
- [ ] Progress indicator showing current step
- [ ] Back navigation preserves selections
- [ ] Booking holds slot for 10 minutes with countdown timer
- [ ] Auto-cancels held slot if payment not completed
- [ ] Guest checkout collects: name, phone, email (creates account post-booking)

---

### 2.8 Appointment Management (Priority: P0)

**User Story**: As a customer, I want to manage my appointments so I can adapt to schedule changes.

**Acceptance Criteria**:
- [ ] Upcoming appointments view with chronological sort
- [ ] Past appointments with rebook CTA
- [ ] Appointment detail: QR code, directions, contact, modify options
- [ ] Reschedule: shows available slots within provider's policy (typically 24-48h before)
- [ ] Cancel with reason selection, refund policy displayed
- [ ] No-show tracking with warning after 2 no-shows
- [ ] Add to personal calendar (Google, Outlook, Apple)
- [ ] Reminder settings: push, SMS, email with configurable timing (default: 24h, 2h)
- [ ] Waitlist option for fully booked preferred slots

---

### 2.9 Favorites (Priority: P1)

**User Story**: As a customer, I want to save preferred businesses so I can rebook quickly.

**Acceptance Criteria**:
- [ ] Heart icon on business cards and detail pages
- [ ] Favorites favorites list with search and filter
- [ ] Quick rebook from favorite (pre-fills last service)
- [ ] Favorite businesses push notifications for new availability or promotions
- [ ] Sync across devices for authenticated users
- [ ] Maximum 200 favorites per user
- [ ] Export/share favorites list

---

### 2.10 User Profile (Priority: P1)

**User Story**: As a user, I want to manage my personal information and preferences so my experience is personalized.

**Acceptance Criteria**:
- [ ] Profile photo upload (crop to 1:1, max 5MB, JPG/PNG)
- [ ] Display name, first/last name, phone, email (editable with verification)
- [ ] Birthday (optional, for birthday promotions)
- [ ] Default location for search
- [ ] Notification preferences: push, email, SMS per category (bookings, promotions, reminders)
- [ ] Payment methods: add, remove, set default (PCI-compliant tokenization)
- [ ] Booking history with search and filter
- [ ] Data export (GDPR/CCPA compliance)
- [ ] Account deletion with 30-day grace period and data retention disclosure
- [ ] Referral code and credits tracking

---

### 2.11 Availability & Slot Computation (Priority: P0)

**User Story**: As a platform, we need accurate real-time availability so customers book valid slots and providers avoid conflicts.

**Acceptance Criteria**:
- [ ] Provider defines: working hours per day, break times, slot duration per service
- [ ] Buffer time between appointments (configurable: 0, 5, 10, 15 min)
- [ ] Staff-specific schedules with override capability
- [ ] Blocked time support (vacation, lunch, personal appointments)
- [ ] Real-time availability query responds in < 200ms
- [ ] Handles concurrent booking requests with optimistic locking
- [ ] Overbooking protection: hard stop at 100% capacity
- [ ] Waitlist auto-fills when cancellations occur (respects notification preferences)
- [ ] Timezone handling for cross-timezone bookings
- [ ] Bulk availability generation with recurring pattern support

---

### 2.12 Shared Types & Design System (Priority: P0)

**User Story**: As a development team, we need consistent design patterns so the product feels cohesive and development is efficient.

**Acceptance Criteria**:
- [ ] Component library: buttons, inputs, cards, modals, toasts, skeletons, date pickers
- [ ] Typography scale: 6 levels (display, h1-h4, body, caption)
- [ ] Color system: primary, secondary, semantic (success, warning, error, info), neutrals
- [ ] Spacing scale: 4px base unit (0, 4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Breakpoints: mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
- [ ] Motion: 150ms default transition, easing curves defined
- [ ] Icon set: 200+ icons, 24x24 default, 20x20 dense
- [ ] Form validation patterns: inline, on-blur, on-submit
- [ ] Error states: inline, toast, full-page fallback
- [ ] Dark mode support with system preference detection
- [ ] Accessibility: WCAG 2.1 AA minimum, focus indicators, alt text patterns
- [ ] Shared TypeScript types across frontend, backend, mobile

---

### 2.13 Reviews & Ratings (Priority: P1)

**User Story**: As a customer, I want to read and write reviews so I can make informed decisions and share my experience.

**Acceptance Criteria**:
- [ ] 5-star rating system with half-star precision
- [ ] Review components: rating, title, body, photos (max 5), service received, date visited
- [ ] Verified badge for customers who completed booked appointment
- [ ] Review prompt sent 24 hours post-appointment
- [ ] Provider can respond publicly to reviews
- [ ] Flag inappropriate reviews for moderation
- [ ] Reviews appear after 24-hour grace period for dispute resolution
- [ ] Sort and filter reviews by rating, date, verified status
- [ ] Aggregate rating displayed as average with distribution histogram
- [ ] Reviews editable for 48 hours, deletable permanently

---

### 2.14 Payment Integration (Priority: P0)

**User Story**: As a customer, I want secure payment options so I can complete bookings confidently.

**Acceptance Criteria**:
- [ ] Stripe integration for card payments
- [ ] Apple Pay / Google Pay support
- [ ] "Pay at venue" option (provider-configurable)
- [ ] Deposit/partial payment support
- [ ] Full payment, deposit, or free cancellation until X hours before
- [ ] Automatic refund to original payment method per cancellation policy
- [ ] Invoice generation for business customers
- [ ] Payment receipt emailed and available in app
- [ ] Failed payment retry with alternative method prompt
- [ ] PCI compliance: no card data stored, tokenization only

---

### 2.15 Notifications (Priority: P1)

**User Story**: As a recovering user, I want timely notifications so I stay informed about my bookings and relevant opportunities.

**Acceptance Criteria**:
- [ ] Push notifications: booking confirmed, reminder (24h, 2h), modified, cancelled, waitlist available
- [ ] Email notifications: booking confirmation, receipt, review request, marketing (opt-in)
- [ ] SMS: critical updates only (booking changes, day-of reminders)
- [ ] In-app notification center with unread count badge
- [ ] Notification preferences granular per channel and type
- [ ] Quiet hours: no push notifications 22:00-08:00 local time
- [ ] Rich push with deep links to relevant screens
- [ ] Notification analytics: delivery, open rates, conversion

---

### 2.16 Provider / Business Owner Portal (Priority: P0)

**User Story**: As a business owner, I want to manage my presence and appointments so I can grow my customer base efficiently.

**Acceptance Criteria**:
- [ ] Dashboard: today's appointments, revenue this week, new customers, upcoming week preview
- [ ] Calendar view: day, week, month with drag-to-reschedule
- [ ] Appointment management: view details, check-in, mark complete, no-show, add notes
- [ ] Customer database: searchable, taggable, visit history
- [ ] Service management: CRUD services, pricing, duration, add-ons
- [ ] Staff management: profiles, schedules, permissions (admin, staff, view-only)
- [ ] Availability management: set recurring hours, block time, set vacation
- [ ] Business profile: photos, description, amenities, policies
- [ ] Analytics: booking volume, revenue, popular services, customer retention, no-show rate
- [ ] Settings: notification preferences, payment methods, integrations (accounting software)
- [ ] Mobile-responsive design for on-the-go management

---

### 2.17 Admin Dashboard (Priority: P1)

**User Story**: As a platform operator, I need oversight tools so I can ensure marketplace quality and growth.

**Acceptance Criteria**:
- [ ] User management: search, view, suspend, impersonate (with audit log)
- [ ] Business verification workflow: pending, approved, rejected, suspended statuses
- [ ] Content moderation: flagged reviews, reported businesses, image moderation queue
- [ ] Financial overview: GMV, transaction volume, revenue by category, refund rate
- [ ] Promo code management: create, edit, deactivate, usage tracking
- [ ] Feature flags for gradual rollout
- [ ] System health: API latency, error rates, queue depths
- [ ] Support ticket integration with escalation paths
- [ ] Data export for reporting and compliance
- [ ] Role-based access control (super admin, ops, support, finance)

---

### 2.18 Background Jobs (BullMQ) (Priority: P0)

**User Story**: As a platform, we need reliable asynchronous processing so operations complete without blocking user experience.

**Acceptance Criteria**:
- [ ] Job types defined: notification dispatch, email sending, SMS sending, payment processing, report generation, data exports, search index updates, image processing, cleanup tasks
- [ ] Retry policy: 3 attempts with exponential backoff (5s, 25s, 125s)
- [ ] Dead letter queue for failed jobs after retries exhausted
- [ ] Job prioritization: critical (payment), high (notifications), normal (reports), low (cleanup)
- [ ] Job progress tracking for long-running operations
- [ ] Scheduled jobs: daily reports, weekly summaries, data retention cleanup
- [ ] Job idempotency keys to prevent duplicate processing
- [ ] Monitoring: queue depth, processing rate, failure rate, average processing time
- [ ] Graceful shutdown: finish in-progress jobs before process exit
- [ ] Job concurrency limits per type to prevent resource exhaustion

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | P95 API response < 200ms; page load < 3s |
| Availability | 99.9% uptime; scheduled maintenance windows |
| Security | OWASP Top 10 mitigation; annual penetration testing |
| Privacy | GDPR, CCPA, LGPD compliance |
| Accessibility | WCAG 2.1 AA |
| i18n | French (default), English; extensible to 5 languages |
| Scalability | Support 10,000 concurrent users; 1M monthly bookings |

## 4. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Search, Business Detail, Booking, Provider Portal, Availability, Payments | 8 weeks |
| V1 | Map, Favorites, Reviews, Notifications, Profile | +4 weeks |
| V2 | Admin, Analytics, Background Jobs, Design System polish | +4 weeks |
| V3 | Advanced features, integrations, internationalization | +8 weeks |

## 5. Appendix

- **Glossary**: Slot, Provider, Service, Add-on, Buffer time, No-show, GMV
- **References**: Planity app (iOS/Android), competitor analysis
- **Change Log**: Version-controlled in Git, reviewed bi-weekly