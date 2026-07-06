# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with beauty, wellness, and service businesses for appointment booking. The platform serves three primary user segments: **Customers** (book appointments), **Business Owners** (manage bookings and business profile), and **Admin** (platform oversight). This specification defines features, acceptance criteria, and priorities for MVP and post-MVP phases.

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0 (MVP)

**Description:** Secure authentication system enabling account creation, login, session management, and account recovery for customers and business owners.

**User Stories:**
- As a customer, I want to register with email/password or social login so I can book appointments
- As a returning user, I want to log in quickly so I can access my bookings
- As a user, I want to reset my password so I can recover account access
- As a user, I want to stay logged in (remember me) so I don't re-authenticate frequently

**Acceptance Criteria:**
- [ ] User can register with email, password, first name, last name, phone number
- [ ] Password minimum requirements: 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
- [ ] Email verification required before first booking; 24-hour expiry on verification links
- [ ] Social login supported: Google, Apple (iOS), Facebook
- [ ] JWT access token (15 min expiry) + refresh token (7 days) with secure httpOnly cookie storage
- [ ] "Remember me" extends session to 30 days; without it, session expires on browser close
- [ ] Password reset flow: email → secure token link (1 hour expiry) → new password confirmation
- [ ] Rate limiting: 5 failed login attempts triggers 30-minute lockout + email notification
- [ ] Logout invalidates refresh token on server; client clears all auth state
- [ ] Business owners must complete additional verification (business email domain or document upload)

**Technical Notes:**
- OAuth 2.0 + OpenID Connect for social providers
- bcrypt with cost factor 12 for password hashing
- Token rotation on every refresh for security

---

### 2.2 Guest Browse & Explore

**Priority:** P0 (MVP)

**Description:** Unauthenticated users can browse businesses, services, and available slots to reduce friction and demonstrate platform value before commitment.

**User Stories:**
- As a guest, I want to browse businesses without creating an account
- As a guest, I want to view business details and services
- As a guest, I want to see pricing and availability before committing to registration

**Acceptance Criteria:**
- [ ] Guest can access search, discovery, business listings, and detail views without authentication
- [ ] Guest can view service catalog, pricing, and real-time availability
- [ ] Guest is prompted to authenticate at booking initiation (pre-booking screen), not before
- [ ] Guest search state (filters, location, selected business) persists through authentication redirect
- [ ] Guest cannot: book, favorite, leave reviews, or access personal appointment history
- [ ] Guest-to-user conversion: upon registration, any in-progress booking data is retained
- [ ] Analytics tracking distinguishes guest vs. authenticated user behavior

---

### 2.3 Business Search & Discovery

**Priority:** P0 (MVP)

**Description:** Intelligent search and filtering system for customers to find relevant businesses based on location, service, availability, and quality signals.

**User Stories:**
- As a customer, I want to search by business name, service type, or treatment
- As a customer, I want to filter by location, price range, rating, and availability
- As a customer, I want to see businesses with immediate availability

**Acceptance Criteria:**
- [ ] Full-text search across: business name, service names, staff names, tags
- [ ] Auto-suggestions with typo tolerance (fuzzy matching, 2 edit distance max)
- [ ] Filters: location (radius: 1/5/10/25/50km), price range slider, minimum rating, next available slot (today/this week), service category, amenities
- [ ] Sort options: relevance (default), distance, rating, price (low-high), availability (soonest first)
- [ ] "Available now" badge for businesses with slots within next 2 hours
- [ ] Search results pagination: 20 results per page, infinite scroll on mobile
- [ ] Empty state with alternative suggestions (nearby locations, related services)
- [ ] Recent searches stored locally (last 10), clearable by user
- [ ] Search query debounced at 300ms to reduce server load

---

### 2.4 Map-based Search

**Priority:** P0 (MVP)

**Description:** Interactive map visualization of business locations with clustering, boundary-based search, and seamless list-map interaction.

**User Stories:**
- As a customer, I want to see businesses on a map to understand proximity
- As a customer, I want to search within a map area I've defined
- As a customer, I want to see business density and explore clusters

**Acceptance Criteria:**
- [ ] Map displays business pins with category-based color coding
- [ ] Pin tap reveals business card: name, rating, price indicator, next availability
- [ ] Clustering for dense areas (cluster count visible, decomposes on zoom)
- [ ] "Search this area" button appears on map pan; triggers new search with viewport bounds
- [ ] User location dot with accuracy radius; fallback to IP-based city center if permission denied
- [ ] Map/list toggle with synchronized state; selection in one reflects in other
- [ ] Default zoom shows appropriate density (city level ~12, neighborhood ~15)
- [ ] Map tiles cached for offline viewing of previously searched areas
- [ ] Accessibility: screen reader announces "Map showing X businesses near [location]"

---

### 2.5 Business Detail View

**Priority:** P0 (MVP)

**Description:** Comprehensive business profile page presenting all information needed for booking decision.

**User Stories:**
- As a customer, I want to see business photos, description, and credentials
- As a customer, I want to browse all services with clear pricing
- As a customer, I want to see staff profiles and select preferred provider

**Acceptance Criteria:**
- [ ] Hero section: business name, cover photo, logo, rating, review count, favorite button, share
- [ ] Photo gallery: minimum 5 images, swipeable, full-screen viewer with pinch-zoom
- [ ] Business info: description, hours, address, phone, website link, social links, amenities list
- [ ] Services tab: categorized list with name, duration, price, description; expandable details
- [ ] Staff tab: photos, bios, specialties, average rating; selectable for booking preference
- [ ] Reviews tab: sorted by recency, filterable by rating; business response visible
- [ ] Availability preview: next 3 available slots per service, "See full calendar" CTA
- [ ] "Book Now" sticky button on mobile, prominent placement on desktop
- [ ] Share functionality: deep link, native share sheet, copy link
- [ ] Report business option (inappropriate content, incorrect hours)

---

### 2.6 Service Categories

**Priority:** P0 (MVP)

**Description:** Hierarchical classification system for services enabling discovery, filtering, and business organization.

**User Stories:**
- As a customer, I want to browse by category to discover new services
- As a business owner, I want to categorize my services for discoverability
- As a platform, I want consistent taxonomy across all businesses

**Acceptance Criteria:**
- [ ] Predefined category tree: Beauty (Hair, Nails, Face, Body), Wellness (Massage, Spa, Fitness), Health (Dental, Medical, Therapy), Other (Tattoo, Piercing, Pet Services)
- [ ] Each category has icon, description, and SEO-optimized landing page
- [ ] Services can have multiple categories (tagging system)
- [ ] Category pages show featured businesses, trending services, educational content
- [ ] Business owner assigns categories during onboarding; editable in portal
- [ ] Admin can add, merge, or deprecate categories (with migration path for existing services)
- [ ] Category analytics: search volume, conversion rate, average booking value

---

### 2.7 Booking Flow

**Priority:** P0 (MVP)

**Description:** Streamlined multi-step process for reserving appointments with minimal friction and clear confirmation.

**User Stories:**
- As a customer, I want to select service, provider, and time in a simple flow
- As a customer, I want to add notes or preferences to my booking
- As a customer, I want to receive immediate confirmation and calendar invite

**Acceptance Criteria:**
- [ ] Step 1: Service selection (or pre-selected from business detail); shows duration, price, description
- [ ] Step 2: Provider selection (specific staff or "no preference"); shows staff availability
- [ ] Step 3: Date/time selection; calendar view with available slots highlighted; timezone handling
- [ ] Step 4: Add-ons/upsells (if applicable): extra services, products, gift wrapping
- [ ] Step 5: Customer details (auto-filled if authenticated); special requests text field (500 char max)
- [ ] Step 6: Review booking summary; terms acceptance; payment (if required deposit/full)
- [ ] Confirmation screen with booking reference, calendar .ics download, add-to-wallet (Apple/Google)
- [ ] Booking automatically cancels if payment not completed within 10 minutes (configurable)
- [ ] Guest checkout: collect minimal info (name, email, phone) with option to create account post-booking
- [ ] Abandoned booking recovery: email reminder after 1 hour with deep link to resume

---

### 2.8 Appointment Management

**Priority:** P0 (MVP)

**Description:** Customer and business tools for viewing, modifying, and canceling appointments with appropriate policies.

**User Stories:**
- As a customer, I want to see all my upcoming and past appointments
- As a customer, I want to reschedule or cancel if plans change
- As a business owner, I want to manage my appointment calendar efficiently

**Acceptance Criteria:**
- [ ] Customer appointment list: upcoming (sorted chronologically) and past; filterable
- [ ] Appointment detail: service, provider, time, location, price, status, QR code for check-in
- [ ] Reschedule: select new slot from available options; original slot released immediately
- [ ] Cancellation: customer can cancel per business policy; reason collection (optional)
- [ ] Cancellation policy displayed at booking and in confirmation: free until X hours before, percentage fee after, no refund within Y hours
- [ ] Business owner calendar: day/week/month views; drag-to-reschedule; color-coded by status
- [ ] Business owner can: confirm, decline, reschedule, mark no-show, mark complete, add notes
- [ ] Automated waitlist: when slot opens, first waitlisted customer notified with 2-hour hold
- [ ] Appointment statuses: pending → confirmed → checked-in → in-progress → completed/cancelled/no-show
- [ ] Bulk actions for business: confirm all pending, message all tomorrow's customers

---

### 2.9 Favorites

**Priority:** P1 (Post-MVP)

**Description:** Bookmarking system for customers to save preferred businesses for quick re-access and personalized recommendations.

**User Stories:**
- As a customer, I want to save businesses I like for easy rebooking
- As a customer, I want to be notified about deals from my favorite businesses

**Acceptance Criteria:**
- [ ] Heart icon on business card and detail page; toggles favorite status with animation
- [ ] Favorites list: sortable by name, recently added, or last visited; grid/list view toggle
- [ ] Favorite businesses show "New availability" or "Special offer" badges in list
- [ ] Option to receive push/email notifications for: new services, price changes, special offers
- [ ] Favorite count visible to business owner (anonymized)
- [ ] Synchronize favorites across devices for logged-in users
- [ ] Share favorites list (select businesses) via link or message

---

### 2.10 User Profile

**Priority:** P0 (MVP)

**Description:** Customer and business owner profile management with preferences, history, and account settings.

**User Stories:**
- As a user, I want to manage my personal information and preferences
- As a user, I want to control notification settings and privacy
- As a user, I want to see my complete booking history and spending

**Acceptance Criteria:**
- [ ] Profile info: photo, name, phone, email, birthday (for birthday offers), preferred language
- [ ] Address book: multiple saved addresses with labels (home, work, other); default selection
- [ ] Notification preferences: push, email, SMS per event type (booking reminders, promotions, account)
- [ ] Privacy settings: profile visibility, data download (GDPR), account deletion
- [ ] Booking history: searchable, filterable by date range, status, business; rebook shortcut
- [ ] Payment methods: add, remove, set default; PCI-compliant tokenization only
- [ ] Referral code and credits tracking
- [ ] Dark mode preference, accessibility settings (font size, reduced motion)

---

### 2.11 Availability & Slot Computation

**Priority:** P0 (MVP)

**Description:** Real-time availability engine calculating bookable slots based on business hours, staff schedules, service durations, and existing appointments.

**User Stories:**
- As a business owner, I want to define my operating hours and staff schedules
- As a customer, I want to see only genuinely available slots
- As a platform, I want to prevent double-bookings and honor buffer times

**Acceptance Criteria:**
- [ ] Business hours: weekly recurring schedule with exceptions for holidays, special events
- [ ] Staff schedules: individual availability, time off, recurring patterns
- [ ] Service duration + buffer time (before/after) + cleanup time configurable per service
- [ ] Slot computation: generates available start times considering all constraints
- [ ] Real-time availability: slot removed from display upon initiation of booking (optimistic lock, 10-min hold)
- [ ] Concurrent booking protection: database-level constraint prevents double-booking on confirmation
- [ ] Complex scenarios: multiple staff required, room/resource booking, variable duration services
- [ ] Business owner can block slots manually (internal meetings, emergencies)
- [ ] Slot caching: computed slots cached with 30-second TTL; invalidated on schedule change
- [ ] Timezone handling: all times displayed in customer's local timezone; stored in business timezone

---

### 2.12 Shared Types & Design System

**Priority:** P0 (MVP)

**Description:** Consistent visual language, component library, and type definitions ensuring cohesive experience across platforms.

**User Stories:**
- As a developer, I want reusable components to build features quickly
- As a user, I want consistent interactions and visual patterns throughout the app

**Acceptance Criteria:**
- [ ] Design tokens: colors (primary #FF6B6B, secondary #4ECDC4, neutrals, semantic colors), typography (Inter font family, 6 heading levels, body, caption), spacing scale (4px base), border radius, shadows
- [ ] Component library: buttons (6 variants), inputs, selects, modals, cards, lists, loaders, empty states, error boundaries
- [ ] Shared TypeScript types: User, Business, Service, Appointment, Slot, Review, Payment — strict null checks
- [ ] Responsive breakpoints: mobile < 768px, tablet 768-1024px, desktop > 1024px
- [ ] Accessibility: WCAG 2.1 AA minimum; focus indicators, ARIA labels, color contrast 4.5:1, screen reader tested
- [ ] Animation standards: 200ms default duration, ease-in-out; respect `prefers-reduced-motion`
- [ ] Icon system: Lucide icons, consistent 24px default, 20px compact
- [ ] Documentation: Storybook for components, usage examples, do/don't guidelines

---

### 2.13 Reviews & Ratings

**Priority:** P1 (Post-MVP)

**Description:** Social proof system for customers to share experiences and businesses to build reputation.

**User Stories:**
- As a customer, I want to read honest reviews before booking
- As a customer, I want to share my experience after an appointment
- As a business owner, I want to respond to feedback professionally

**Acceptance Criteria:**
- [ ] Verified reviews only: customer must have completed appointment to review
- [ ] Review form: 1-5 star rating, optional text (min 20 chars if provided), service selected, staff selected
- [ ] Review categories: cleanliness, staff, value, atmosphere (each 1-5); contributes to weighted average
- [ ] Photo upload: up to 5 images per review; moderation before public display
- [ ] Business response: public reply to any review; notification to reviewer
- [ ] Review helpfulness: users can mark helpful; sort option by helpfulness
- [ ] Flag and moderation: users report inappropriate reviews; admin queue for review
- [ ] Review analytics for business: sentiment trends, category breakdowns, response rate impact
- [ ] Anti-gaming: detect and prevent fake reviews (velocity checks, pattern detection, manual audit)

---

### 2.14 Payment Integration

**Priority:** P0 (MVP)

**Description:** Secure, flexible payment processing supporting multiple methods, currencies, and business models.

**User Stories:**
- As a customer, I want to pay securely with my preferred method
- As a business owner, I want to receive payouts reliably and on schedule
- As a platform, I want to collect fees transparently

**Acceptance Criteria:**
- [ ] Payment methods: credit/debit cards (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Payment models: full prepay, deposit only (remainder at appointment), pay at venue (no online payment)
- [ ] Platform fee: configurable percentage + fixed fee per transaction; transparent to customer
- [ ] Payout schedule: daily, weekly, or monthly to business bank account; 2-day hold minimum
- [ ] Refund processing: full or partial; automatic per cancellation policy or manual by business
- [ ] Payment security: PCI DSS Level 1 via Stripe; no card data touches our servers
- [ ] Failed payment handling: retry logic, customer notification, booking hold extension
- [ ] Invoicing: email receipt, invoice generation for business customers
- [ ] Dispute management: chargeback notification, evidence submission portal

---

### 2.15 Notifications

**Priority:** P0 (MVP)

**Description:** Multi-channel notification system keeping users informed at critical journey moments.

**User Stories:**
- As a customer, I want timely reminders so I don't miss appointments
- As a business owner, I want to know about new bookings immediately
- As a user, I want to control how I'm contacted

**Acceptance Criteria:**
- [ ] Channels: push (mobile app), email, SMS; fallback cascade if primary fails
- [ ] Notification types: booking confirmation, 24-hour reminder, 1-hour reminder, modification, cancellation, waitlist offer, review request, payment receipt, marketing (opt-in)
- [ ] Business owner notifications: new booking, cancellation, reschedule request, low inventory, payout received
- [ ] Template system: customizable per business (brand voice, additional info); admin approval for marketing
- [ ] Delivery tracking: sent, delivered, opened metrics; retry failed deliveries
- [ ] User preference center: granular control per channel and type; unsubscribe from marketing
- [ ] Quiet hours: no non-urgent notifications 10pm-8am local time
- [ ] Notification history: in-app inbox with 90-day retention

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0 (MVP)

**Description:** Dedicated web interface for business owners to manage their presence, services, staff, and appointments.

**User Stories:**
- As a business owner, I want to set up my business profile completely
- As a business owner, I want to manage my team and their schedules
- As a business owner, I want to understand my business performance

**Acceptance Criteria:**
- [ ] Onboarding wizard: business info, services, staff, hours, payment setup; progress tracking
- [ ] Dashboard: today's appointments, revenue, new bookings, upcoming week overview
- [ ] Business profile editor: all fields from customer-facing view plus SEO settings
- [ ] Service management: CRUD services, pricing, duration, buffer times, add-ons
- [ ] Staff management: add staff (invite via email), set permissions, manage schedules, deactivate
- [ ] Calendar: day/week/month views; appointment details on click; drag to reschedule
- [ ] Client list: searchable, with visit history, notes, contact info; exportable
- [ ] Analytics: bookings, revenue, cancellation rate, popular services, peak hours, customer retention
- [ ] Settings: notification preferences, cancellation policy, payment methods, integrations (calendar sync)

---

### 2.17 Admin Dashboard

**Priority:** P1 (Post-MVP)

**Description:** Internal tool for platform management, moderation, and business intelligence.

**User Stories:**
- As an admin, I want to monitor platform health and user activity
- As an admin, I want to support businesses and resolve disputes
- As an admin, I want to understand growth and identify issues

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, impersonate (with audit log); bulk actions
- [ ] Business verification queue: approve, request info, reject with reason
- [ ] Content moderation: flagged reviews, reported businesses, photo moderation queue
- [ ] Financial overview: transaction volume, platform revenue, payout status, dispute tracking
- [ ] Analytics: MAU/DAU, booking conversion funnel, cohort retention, geographic distribution
- [ ] System health: API latency, error rates, queue depth, third-party service status
- [ ] Role-based access: super admin, support agent, finance, read-only analyst
- [ ] Audit log: all admin actions with timestamp, admin ID, before/after state; immutable storage

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P0 (MVP)

**Description:** Reliable, scalable job queue for asynchronous processing of time-sensitive and resource-intensive operations.

**User Stories:**
- As a developer, I want reliable background processing for non-urgent tasks
- As a user, I want my experience to remain fast even when complex operations occur
- As an operator, I want visibility into job health and failure recovery

**Acceptance Criteria:**
- [ ] Job types and queues: `notifications` (high priority), `payments` (critical), `emails` (normal), `reports` (low), `cleanup` (lowest)
- [ ] Notification jobs: send push/email/SMS with retry (3 attempts, exponential backoff)
- [ ] Payment jobs: process webhooks, execute payouts, handle refunds idempotently
- [ ] Email jobs: transactional emails via SendGrid/Postmark; template rendering
- [ ] Report generation: daily business summaries, weekly analytics, monthly statements
- [ ] Cleanup jobs: expire abandoned bookings, archive old data, remove unverified accounts after 30 days
- [ ] Job monitoring: BullMQ dashboard with queue depths, processing rates, failed jobs, retry controls
- [ ] Dead letter queue: jobs failing after max retries; manual inspection and requeue tools
- [ ] Concurrency control: configurable workers per queue; priority weighting
- [ ] Idempotency: all jobs include idempotency key; duplicate detection prevents double-processing

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App launch < 2s; page transitions < 300ms; API response < 200ms (p50), < 500ms (p95) |
| Availability | 99.9% uptime; scheduled maintenance windows with advance notice |
| Scalability | Horizontal scaling to 10M users; database sharding strategy for geo |
| Security | OWASP Top 10 mitigation; annual penetration testing; bug bounty program |
| Compliance | GDPR, CCPA, PCI DSS; data residency options; accessibility WCAG 2.1 AA |
| Localization | i18n framework; French, English, Spanish, German for launch; RTL support planned |

## 4. Prioritization Summary

| Priority | Features |
|----------|----------|
| P0 (MVP Launch) | User Authentication, Guest Browse, Business Search, Map Search, Business Detail, Service Categories, Booking Flow, Appointment Management, User Profile, Availability Engine, Shared Types/Design System, Payment Integration, Notifications, Business Owner Portal, Background Jobs |
| P1 (Q2 Post-Launch) | Favorites, Reviews & Ratings, Admin Dashboard, Advanced Analytics, Referral Program |
| P2 (Q3+) | AI Recommendations, Subscription Plans, Marketplace (products), API for Partners, White-label Options |

## 5. Success Metrics

- **Acquisition:** 100K app downloads in first 6 months
- **Activation:** 60% of registered users complete first booking within 7 days
- **Retention:** 40% monthly booking retention; 25% weekly active rate
- **Revenue:** $500K GMV monthly by month 6; 15% take rate
- **Satisfaction:** NPS > 50; app store rating > 4.5
- **Operational:** < 1% payment failure rate; < 0.1% double-booking incidents

---

*Document Version: 1.0*
*Last Updated: [Current Date]*
*Owner: Alex, Product Owner*