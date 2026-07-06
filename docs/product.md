# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
A marketplace platform connecting beauty & wellness service providers with clients, enabling seamless discovery, booking, and management of appointments.

### 1.2 Target Users
- **Clients**: Individuals seeking beauty/wellness services
- **Providers**: Business owners and professionals offering services
- **Admin**: Platform operators managing marketplace health

### 1.3 Success Metrics
- Booking conversion rate > 15%
- Provider onboarding < 10 minutes
- Search-to-book time < 3 minutes

---

## 2. Feature Specifications

### 2.1 User Authentication (P0)

**User Story**: As a user, I want to create an account and log in securely so I can access personalized features.

**Acceptance Criteria**:
- [ ] Users can register with email/password, phone number, or OAuth (Google, Apple, Facebook)
- [ ] Password must be 8+ characters with uppercase, lowercase, number
- [ ] Email verification required before full account activation
- [ ] Phone verification via SMS OTP for phone registration
- [ ] JWT tokens with 15-min access / 7-day refresh expiration
- [ ] "Remember me" extends refresh to 30 days
- [ ] Password reset via secure email link (1-hour expiry)
- [ ] Biometric login option on supported devices (Face ID, fingerprint)
- [ ] Account lockout after 5 failed attempts (30-min cooldown)
- [ ] Users can delete account with 30-day grace period and data export

**Technical Notes**: Implement rate limiting (5 req/min for auth endpoints). Store passwords with bcrypt (cost factor 12).

---

### 2.2 Guest Browse & Explore (P0)

**User Story**: As an unauthenticated user, I want to browse services so I can evaluate the platform before committing.

**Acceptance Criteria**:
- [ ] Full search and browse functionality available without login
- [ ] Business profiles, services, and reviews visible to guests
- [ ] "Book Now" prompts login/signup at booking initiation (not before)
- [ ] Guest sessions tracked via anonymous ID for analytics
- [ ] Upon registration, guest browsing history merged to new account
- [ ] Location-based results use IP geolocation with manual override
- [ ] No limit on search results or page views for guests

---

### 2.3 Business Search & Discovery (P0)

**User Story**: As a client, I want to find relevant service providers quickly so I can book appointments efficiently.

**Acceptance Criteria**:
- [ ] Text search across business name, service name, and description
- [ ] Autocomplete suggestions with typo tolerance (fuzzy matching, Levenshtein distance ≤ 2)
- [ ] Filters: service category, price range, rating (minimum stars), availability (today, this week), distance radius (1-50km)
- [ ] Sort options: relevance, distance, rating, price (low-high), availability (soonest first)
- [ ] Search results display: thumbnail, business name, rating, starting price, distance, next available slot
- [ ] Pagination: 20 results per page, infinite scroll on mobile
- [ ] Recent searches stored (last 10), clearable by user
- [ ] Saved searches with push notification for new availability
- [ ] "Near me" auto-detects location with permission; falls back to city selector
- [ ] Empty states with suggested alternatives (broader radius, different category)

---

### 2.4 Map-based Search (P0)

**User Story**: As a client, I want to see providers on a map so I can choose based on location convenience.

**Acceptance Criteria**:
- [ ] Interactive map with business pins (clustered at zoomed-out levels)
- [ ] Pin color indicates: open now (green), closed (gray), fully booked (red)
- [ ] Tap/click pin opens bottom sheet with business summary
- [ ] "List view" toggle for switching between map and list
- [ ] Current location dot with accuracy ring
- [ ] Map bounds filter search results dynamically
- [ ] Directions integration (Google Maps, Apple Maps, Waze)
- [ ] Satellite and standard map layers
- [ ] Accessible: all pins keyboard-navigable, screen reader announces business name and distance

---

### 2.5 Business Detail View (P0)

**User Story**: As a client, I want comprehensive business information so I can make informed booking decisions.

**Acceptance Criteria**:
- [ ] Hero image carousel (up to 10 images, swipeable)
- [ ] Business name, verified badge, category tags
- [ ] Average rating with review count, highlight recent reviews
- [ ] Complete address with copy-to-clipboard and "Get Directions"
- [ ] Operating hours with "Open Now" / "Closes at X" / "Closed" status
- [ ] Phone number with tap-to-call (hidden until booking for unverified users, anti-spam)
- [ ] Full service menu with pricing, duration, description
- [ ] Team/professional profiles with photos, specialties, ratings
- [ ] Instagram integration (latest posts if connected)
- [ ] COVID/safety protocols (configurable by provider)
- [ ] "Save to Favorites" and "Share" actions
- [ ] Similar businesses carousel at bottom

---

### 2.6 Service Categories (P0)

**User Story**: As a client, I want to browse by service type so I can find providers for my specific needs.

**Acceptance Criteria**:
- [ ] Hierarchical categories: Hair, Nails, Face, Body, Massage, Wellness, Medical Aesthetics, Fitness
- [ ] Subcategories: e.g., Hair > Cut, Color, Styling, Treatment
- [ ] Category icons with consistent visual language
- [ ] Trending/featured categories promoted on home screen
- [ ] Providers can assign multiple categories and subcategories
- [ ] Category pages with curated filters and editorial content
- [ ] SEO-optimized category landing pages

---

### 2.7 Booking Flow (P0)

**User Story**: As a client, I want to book appointments with minimal friction so I can secure my preferred time slot.

**Acceptance Criteria**:
- [ ] Step 1: Select service(s) — allow bundling multiple services
- [ ] Step 2: Select professional (specific person or "no preference")
- [ ] Step 3: Select date — calendar view with availability indicators
- [ ] Step 4: Select time slot — morning/afternoon/evening grouping
- [ ] Step 5: Review booking summary with cancellation policy
- [ ] Step 6: Confirm booking (payment if required, see 2.14)
- [ ] Real-time slot availability with optimistic locking (5-min hold on selected slot)
- [ ] Guest checkout option (collect minimal info: name, phone, email)
- [ ] Booking confirmation screen with add-to-calendar option
- [ ] Reschedule and cancel links in confirmation (with policy enforcement)
- [ ] Waitlist option for fully booked slots (notify on cancellation)
- [ ] Group booking: book for multiple people (family, friends)

**Error Handling**: Clear messaging for expired holds, double-booking conflicts with automatic retry suggestions.

---

### 2.8 Appointment Management (P0)

**User Story**: As a client, I want to manage my appointments so I can stay organized.

**Acceptance Criteria**:
- [ ] Upcoming appointments list with chronological sort
- [ ] Past appointments history with rebook option
- [ ] Appointment detail: service, provider, date/time, location, notes, QR code check-in
- [ ] Reschedule: select new slot with same policy as original booking
- [ ] Cancel with reason selection (data for provider improvement)
- [ ] Cancellation policy enforcement: free until X hours, percentage fee after, no-show fee
- [ ] Modify: add notes, update contact info (not service changes — requires rebook)
- [ ] Calendar sync: Google Calendar, Apple Calendar, Outlook
- [ ] Push and SMS reminders: 24 hours, 2 hours, 15 minutes before
- [ ] Upcoming appointment widget on home screen

---

### 2.9 Favorites (P1)

**User Story**: As a client, I want to save preferred businesses so I can rebook quickly.

**Acceptance Criteria**:
- [ ] One-tap favorite from business profile or search results
- [ ] Favorites list with quick rebook, view profile, or remove
- [ ] Favorited businesses prioritized in search results
- [ ] Push notification for new availability or promotions from favorites
- [ ] Organize favorites with custom tags/labels
- [ ] Share favorites list with others
- [ ] Sync favorites across devices

---

### 2.10 User Profile (P1)

**User Story**: As a user, I want to manage my personal information so my experience is personalized.

**Acceptance Criteria**:
- [ ] Profile photo (upload or camera capture, crop to circle, max 5MB)
- [ ] Display name, first/last name, email, phone (editable with re-verification)
- [ ] Birthday (optional, for birthday promotions)
- [ ] Preferred language and notification preferences
- [ ] Saved payment methods (PCI-compliant tokenization)
- [ ] Addresses: home, work, other with map pin placement
- [ ] Privacy settings: profile visibility, data sharing opt-outs
- [ ] Notification preferences: push, email, SMS per type (bookings, promotions, reminders)
- [ ] Connected accounts (social logins) with unlink option
- [ ] Data export: GDPR-compliant JSON/CSV download
- [ ] Account deletion with confirmation flow and 30-day grace period

---

### 2.11 Availability & Slot Computation (P0)

**User Story**: As a provider, I want accurate availability so clients can only book valid slots.

**Acceptance Criteria**:
- [ ] Provider defines: working hours per day, slot duration per service, buffer between appointments
- [ ] Recurring availability with exception dates (holidays, time off)
- [ ] Real-time computation considers: existing bookings, blocked time, staff availability
- [ ] Support for variable-duration services and combo packages
- [ ] Last-bookable-time: prevent bookings X hours before appointment
- [ ] Same-day booking cutoff configurable per provider
- [ ] Overbooking protection: atomic slot reservation with 5-min hold
- [ ] Timezone-aware: store in UTC, display in user's local timezone
- [ ] Complex scheduling: recurring appointments, split appointments, multi-staff requirements
- [ ] Performance: slot computation < 200ms for 30-day window

---

### 2.12 Shared Types & Design System (P0)

**User Story**: As a developer, I want consistent design patterns so the product feels cohesive.

**Acceptance Criteria**:
- [ ] Component library: buttons, inputs, cards, modals, toasts, skeletons, date/time pickers
- [ ] Typography: 2 font families (display, body), 6 heading levels, body sizes
- [ ] Color system: primary, secondary, semantic (success, warning, error, info), neutral grays
- [ ] Spacing scale: 4px base unit, 15 increments
- [ ] Breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
- [ ] Dark mode support with automatic system preference detection
- [ ] Accessibility: WCAG 2.1 AA minimum, focus indicators, color contrast 4.5:1
- [ ] Animation: 150ms standard duration, ease-in-out, reduced-motion respect
- [ ] Icon set: 200+ icons, consistent 24px default, 20px/16px variants
- [ ] Form validation: inline, on-blur, with clear error messages

---

### 2.13 Reviews & Ratings (P1)

**User Story**: As a client, I want to read and leave reviews so I can trust provider quality.

**Acceptance Criteria**:
- [ ] 5-star rating system with half-star precision
- [ ] Review components: rating, text (optional, max 500 chars), photos (max 5), service received
- [ ] Verified purchase badge: only post-appointment reviewers
- [ ] Provider response to reviews (public)
- [ ] Review helpfulness voting with abuse reporting
- [ ] Sort reviews: most recent, highest/lowest rated, verified only
- [ ] Aggregate rating displayed with distribution histogram
- [ ] Review prompt: 24 hours post-appointment via push/email
- [ ] Content moderation: auto-flag profanity, manual review queue
- [ ] Reviews editable for 48 hours, deletable by author

---

### 2.14 Payment Integration (P0)

**User Story**: As a client, I want secure payment options so I can complete bookings confidently.

**Acceptance Criteria**:
- [ ] Stripe integration: cards, Apple Pay, Google Pay, SEPA, Klarna (BNPL)
- [ ] Payment at booking or pay-at-salon option (provider configurable)
- [ ] Deposit/partial payment support
- [ ] Secure card tokenization, no raw card data stored
- [ ] 3D Secure for applicable transactions
- [ ] Automatic retry for failed payments with saved method fallback
- [ ] Refund processing with status tracking
- [ ] Invoice generation with VAT/tax details
- [ ] Promo code and gift card application
- [ ] Payment confirmation email with receipt

---

### 2.15 Notifications (P1)

**User Story**: As a user, I want timely notifications so I never miss appointments or opportunities.

**Acceptance Criteria**:
- [ ] Push notifications: booking confirmations, reminders, cancellations, promotions, waitlist availability
- [ ] Email notifications: same categories plus monthly summary, marketing (opt-in)
- [ ] SMS: critical only (booking confirmation, day-before reminder, urgent changes)
- [ ] In-app notification center with unread badge
- [ ] Preference management per channel and category
- [ ] Quiet hours: no non-urgent notifications 22:00-08:00 local time
- [ ] Rich push with deep links to relevant screens
- [ ] Delivery tracking and fallback (push → email → SMS)

---

### 2.16 Provider / Business Owner Portal (P0)

**User Story**: As a provider, I want to manage my business so I can serve clients efficiently.

**Acceptance Criteria**:
- [ ] Dashboard: today's appointments, revenue this week, upcoming week preview
- [ ] Calendar view: day/week/month, drag-to-reschedule, color-coded by status
- [ ] Appointment actions: confirm, reschedule, cancel, mark no-show, add notes
- [ ] Client management: view history, contact info, notes (internal), block list
- [ ] Service management: CRUD services, pricing, duration, description, photos
- [ ] Staff management: add professionals, set permissions, individual schedules
- [ ] Availability management: set hours, breaks, time off, recurring patterns
- [ ] Business profile: photos, description, hours, policies, social links
- [ ] Analytics: bookings, revenue, cancellation rate, popular services, peak times
- [ ] Settings: payment methods, notification preferences, integrations
- [ ] Mobile-responsive or dedicated mobile app for on-the-go management

---

### 2.17 Admin Dashboard (P1)

**User Story**: As a platform admin, I want oversight tools so I can maintain marketplace quality.

**Acceptance Criteria**:
- [ ] User management: search, view, suspend, impersonate (with audit log)
- [ ] Business verification: review submitted docs, approve/reject with reason
- [ ] Content moderation: review flagged reviews, photos, business info
- [ ] Financial oversight: transaction volume, disputes, payout status
- [ ] Analytics: MAU, booking volume, GMV, churn, CAC, LTV cohorts
- [ ] Promotional tools: create campaigns, promo codes, featured listings
- [ ] Support tools: view tickets, respond, escalate, resolution tracking
- [ ] System health: API latency, error rates, queue depths
- [ ] Role-based access: super admin, support agent, finance, marketing

---

### 2.18 Background Jobs (BullMQ) (P0)

**User Story**: As a system, I want reliable background processing so operations don't block user experience.

**Acceptance Criteria**:
- [ ] Job types: notification dispatch, email sending, SMS sending, payment processing, report generation, data exports, search index updates, image processing, slot cache warming
- [ ] Queue per job type with priority levels
- [ ] Retry policy: 3 attempts with exponential backoff (2^attempt × 1s)
- [ ] Dead letter queue for failed jobs after max retries
- [ ] Job idempotency keys to prevent duplicate processing
- [ ] Scheduled jobs: cron expressions for recurring tasks
- [ ] Job progress tracking for long-running operations
- [ ] Monitoring: queue depth, processing rate, failure rate, average job duration
- [ ] Graceful shutdown: finish in-progress jobs before process exit
- [ ] Stalled job detection and reprocessing

---

## 3. Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | P95 API response < 500ms; page load < 2s (3G) |
| Availability | 99.9% uptime; scheduled maintenance windows |
| Security | OWASP Top 10 mitigation; annual penetration testing |
| Scalability | Auto-scaling; handle 10× traffic spikes |
| Compliance | GDPR, CCPA, PCI-DSS Level 1 |

## 4. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.11, 2.12, 2.14, 2.16, 2.18 | 8 weeks |
| v1.1 | 2.9, 2.10, 2.13, 2.15 | +4 weeks |
| v1.2 | 2.17, advanced analytics, marketplace features | +6 weeks |

## 5. Appendix

- **Glossary**: Slot, Provider, Professional, Service, Booking, Availability
- **Reference**: planity.com, treatwell.com, booksy.com
- **Change Log**: Tracked in Jira/Confluence
