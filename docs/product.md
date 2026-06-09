# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Description:** A multi-platform application connecting clients with beauty & wellness businesses for online appointment booking.  
**Platforms:** iOS, Android, Web (responsive)  
**Target Users:** Consumers seeking beauty/wellness services; Business owners managing appointments; Platform administrators  

---

## 2. Feature Specifications

### 2.1 User Authentication

| Attribute | Details |
|-----------|---------|
| **Priority** | P0 — Critical |
| **Description** | Secure user registration, login, and account management |
| **User Stories** | As a user, I want to create an account so I can book appointments. As a user, I want to log in securely so I can access my personal data. |

**Acceptance Criteria:**
- [ ] Users can register with email/password, phone number, or OAuth (Google, Apple, Facebook)
- [ ] Password must be minimum 8 characters with at least one uppercase, one lowercase, one number
- [ ] Email verification required before first booking
- [ ] Users can log in with registered credentials
- [ ] "Forgot Password" flow sends secure reset link via email/SMS
- [ ] JWT tokens with refresh token rotation implemented
- [ ] Biometric authentication supported on mobile (Face ID / Touch ID / Fingerprint)
- [ ] Users can log out from all devices
- [ ] Account deletion option available with GDPR-compliant data purge

---

### 2.2 Guest Browse & Explore

| Attribute | Details |
|-----------|---------|
| **Priority** | P0 — Critical |
| **Description** | Allow unauthenticated users to browse businesses and services |
| **User Stories** | As a guest, I want to explore businesses without creating an account so I can decide if the app meets my needs. |

**Acceptance Criteria:**
- [ ] Guests can view business listings, search, and filter without login
- [ ] Guests can view business details, services, and reviews
- [ ] Guests CANNOT book appointments without account creation
- [ ] Prompt to sign up/login appears when attempting to book
- [ ] Guest session data (favorites, search filters) persisted for 7 days via local storage
- [ ] Converting guest to registered user preserves browsing history and favorites

---

### 2.3 Business Search & Discovery

| Attribute | Details |
|-----------|---------|
| **Priority** | P0 — Critical |
| **Description** | Powerful search and filtering to find relevant businesses |
| **User Stories** | As a user, I want to search for businesses by name, service, or location so I can find what I need quickly. |

**Acceptance Criteria:**
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Autocomplete suggestions with typo tolerance (fuzzy matching)
- [ ] Recent searches stored (last 10), clearable by user
- [ ] Trending searches displayed on empty search state
- [ ] Voice search capability on mobile
- [ ] Search results sortable by: relevance, rating, distance, price (low to high)
- [ ] Empty state with helpful suggestions when no results found
- [ ] Search debounced at 300ms to reduce API calls
- [ ] Search analytics logged for product insights

---

### 2.4 Map-based Search

| Attribute | Details |
|-----------|---------|
| **Priority** | P0 — Critical |
| **Description** | Visual location-based discovery of businesses |
| **User Stories** | As a user, I want to see businesses on a map so I can choose one that's conveniently located. |

**Acceptance Criteria:**
- [ ] Interactive map with business pins (Google Maps / Mapbox)
- [ ] User location detection with permission handling
- [ ] Default map view shows businesses within 5km radius
- [ ] Pin clustering when zoomed out (cluster count visible)
- [ ] Tapping pin shows business card preview with photo, name, rating, distance
- [ ] "Near Me" button centers map on user location
- [ ] Map and list views toggleable; state synchronized
- [ ] Custom map markers for different business categories
- [ ] Directions integration (open native maps app)

---

### 2.5 Business Detail View

| Attribute | Details |
|-----------|---------|
| **Priority** | P0 — Critical |
| **Description** | Comprehensive business information page |
| **User Stories** | As a user, I want to see all details about a business so I can make an informed booking decision. |

**Acceptance Criteria:**
- [ ] Hero image gallery (up to 10 images, swipeable)
- [ ] Business name, rating, review count, category badges
- [ ] Operating hours with "Open Now" / "Closed" status
- [ ] Full address with copy-to-clipboard and directions
- [ ] Phone number with tap-to-call
- [ ] Website link (in-app browser)
- [ ] Social media links
- [ ] Business description (expandable, max 2000 chars)
- [ ] COVID-19 / safety protocols (optional field)
- [ ] "Book Now" CTA always visible (sticky bottom on mobile)
- [ ] Share business via native share sheet
- [ ] Report business option

---

### 2.6 Service Categories

| Attribute | Details |
|-----------|---------|
| **Priority** | P0 — Critical |
| **Description** | Hierarchical categorization of services |
| **User Stories** | As a user, I want to browse services by category so I can find what I'm looking for intuitively. |

**Acceptance Criteria:**
- [ ] Top-level categories: Hair, Nails, Face, Body, Massage, Wellness, Medical Aesthetics, Barbershop
- [ ] Sub-categories up to 3 levels deep (e.g., Hair > Coloring > Balayage)
- [ ] Category icons and color coding consistent across app
- [ ] Category filter in search with multi-select capability
- [ ] Popular services highlighted per category
- [ ] Category-based promotional banners
- [ ] Admin-configurable category tree with drag-and-drop reordering

---

### 2.7 Booking Flow

| Attribute | Details |
|-----------|---------|
| **Priority** | P0 — Critical |
| **Description** | Seamless appointment reservation experience |
| **User Stories** | As a user, I want to book an appointment in a few taps so I can secure my preferred time slot. |

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) — multi-service booking supported
- [ ] Step 2: Select staff member (or "No preference")
- [ ] Step 3: Select date — calendar view with availability indicators
- [ ] Step 4: Select time slot — grid view, grouped by morning/afternoon/evening
- [ ] Step 5: Add notes / special requests (optional, max 500 chars)
- [ ] Step 6: Review booking summary with all details
- [ ] Step 7: Confirm and pay (if required) or book without payment
- [ ] Real-time slot availability with optimistic locking (5-minute hold during selection)
- [ ] Booking confirmation screen with calendar add option (.ics)
- [ ] Confirmation email/SMS sent within 30 seconds
- [ ] Guest checkout requires account creation before final confirmation
- [ ] Booking modification allowed up to 2 hours before appointment
- [ ] Cancellation with configurable policy per business (default: 24h notice)

---

### 2.8 Appointment Management

| Attribute | Details |
|-----------|---------|
| **Priority** | P0 — Critical |
| **Description** | Users can view and manage their bookings |
| **User Stories** | As a user, I want to see all my appointments so I can keep track of my schedule. |

**Acceptance Criteria:**
- [ ] Upcoming appointments list with chronological sorting
- [ ] Past appointments history (accessible for 2 years)
- [ ] Appointment detail view with all relevant information
- [ ] Reschedule option — re-enters booking flow with pre-filled data
- [ ] Cancel with reason selection (mandatory, options: changed mind, emergency, found better price, other)
- [ ] Rebook past appointment with one tap
- [ ] Add to personal calendar (Google, Apple, Outlook)
- [ ] Appointment reminders: 24h, 2h, and 15min before (configurable)
- [ ] No-show reporting by business (impacts user reliability score)

---

### 2.9 Favorites

| Attribute | Details |
|-----------|---------|
| **Priority** | P1 — High |
| **Description** | Save preferred businesses for quick access |
| **User Stories** | As a user, I want to favorite businesses so I can easily find them later. |

**Acceptance Criteria:**
- [ ] Heart icon on business card and detail page to toggle favorite
- [ ] Favorites list accessible from main navigation
- [ ] Favorites sorted by most recently added (default), or alphabetically
- [ ] Quick book from favorites list
- [ ] Favorite count badge on tab icon
- [ ] Push notification when favorite business adds new service or promotion
- [ ] Sync favorites across devices for logged-in users
- [ ] Maximum 500 favorites per user

---

### 2.10 User Profile

| Attribute | Details |
|-----------|---------|
| **Priority** | P1 — High |
| **Description** | Personal account management and preferences |
| **User Stories** | As a user, I want to manage my profile so my booking experience is personalized. |

**Acceptance Criteria:**
- [ ] Profile photo upload (camera or gallery, crop to square)
- [ ] Display name, first name, last name
- [ ] Email and phone number with verification status
- [ ] Date of birth (optional, for birthday promotions)
- [ ] Preferred language selection
- [ ] Notification preferences (push, email, SMS) — granular per type
- [ ] Default payment methods management
- [ ] Booking history with invoice download (PDF)
- [ ] Loyalty points / rewards balance display
- [ ] Referral code and sharing
- [ ] Data export (GDPR) — request download of all personal data

---

### 2.11 Availability & Slot Computation

| Attribute | Details |
|-----------|---------|
| **Priority** | P0 — Critical |
| **Description** | Core engine for calculating bookable time slots |
| **User Stories** | As a business owner, I want accurate availability so I never get double-booked. |

**Acceptance Criteria:**
- [ ] Business defines weekly recurring schedule with opening hours
- [ ] Exception dates for holidays, closures, modified hours
- [ ] Staff-level schedule overrides (vacation, sick leave)
- [ ] Service duration + buffer time between appointments (configurable)
- [ ] Concurrent booking support for businesses with multiple rooms/stations
- [ ] Slot computation accounts for existing bookings in real-time
- [ ] Last-bookable-time before closing enforced (e.g., no 5:30pm booking for 6pm close if service takes 45min)
- [ ] Timezone-aware for businesses in different zones
- [ ] Cache slot availability with 30-second TTL; invalidate on booking changes
- [ ] Handle daylight saving time transitions gracefully
- [ ] Support for walk-in slots (reserved buffer)

---

### 2.12 Shared Types & Design System

| Attribute | Details |
|-----------|---------|
| **Priority** | P0 — Critical |
| **Description** | Consistent UI/UX foundation across all platforms |
| **User Stories** | As a user, I want a consistent experience so the app feels polished and intuitive. |

**Acceptance Criteria:**
- [ ] Design tokens: colors, typography, spacing, shadows, border-radius
- [ ] Component library: buttons, inputs, cards, modals, toasts, loaders, empty states
- [ ] Accessibility: WCAG 2.1 AA compliance, screen reader support, minimum touch target 44x44dp
- [ ] Dark mode support with system preference detection
- [ ] RTL language support (Arabic, Hebrew)
- [ ] Shared TypeScript types between frontend and backend (monorepo)
- [ ] Animation guidelines: 200ms transitions, ease-in-out
- [ ] Error state designs for all components
- [ ] Loading skeletons for async content
- [ ] Platform-specific adaptations (iOS/Android navigation patterns)

---

### 2.13 Reviews & Ratings

| Attribute | Details |
|-----------|---------|
| **Priority** | P1 — High |
| **Description** | User-generated feedback system for businesses |
| **User Stories** | As a user, I want to read reviews so I can choose quality businesses. As a user, I want to leave feedback so I can share my experience. |

**Acceptance Criteria:**
- [ ] 5-star rating system with half-star precision
- [ ] Review form: rating, title (optional), comment (min 20 chars), photo upload (up to 5)
- [ ] Reviews only from verified customers (completed appointment required)
- [ ] Business owner response capability
- [ ] Review helpfulness voting (thumbs up)
- [ ] Report inappropriate review
- [ ] Average rating and distribution histogram on business page
- [ ] Sort reviews by: most recent, highest rated, lowest rated, most helpful
- [ ] Filter by rating (1-5 stars), with/without photos, verified only
- [ ] Review moderation queue for admin (auto-approve + flag for keywords)
- [ ] Review reminder push notification 24h after appointment completion

---

### 2.14 Payment Integration

| Attribute | Details |
|-----------|---------|
| **Priority** | P0 — Critical |
| **Description** | Secure payment processing for bookings |
| **User Stories** | As a user, I want to pay securely so I can confirm my booking. As a business, I want to receive payments reliably. |

**Acceptance Criteria:**
- [ ] Payment methods: credit/debit card (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Save payment method for future use (PCI-compliant tokenization)
- [ ] Full payment or deposit options (configurable per business)
- [ ] Payment held in escrow, released to business 24h after appointment
- [ ] Automatic refund on cancellation per policy
- [ ] Invoice generation with VAT/tax details
- [ ] Payment failure handling with retry and alternative method suggestion
- [ ] 3D Secure authentication for card payments
- [ ] Currency display based on business location
- [ ] Transaction history in user profile
- [ ] Webhook handling for payment status updates (idempotent)
- [ ] Dispute management interface for admin

---

### 2.15 Notifications

| Attribute | Details |
|-----------|---------|
| **Priority** | P1 — High |
| **Description** | Multi-channel user communication system |
| **User Stories** | As a user, I want timely notifications so I don't miss my appointments. |

**Acceptance Criteria:**
- [ ] Push notifications via Firebase Cloud Messaging / APNs
- [ ] In-app notification center with unread count badge
- [ ] Notification types: booking confirmation, reminder, modification, cancellation, promotion, review request, payment
- [ ] User preference controls per channel and type
- [ ] Rich push with deep linking to relevant screen
- [ ] SMS fallback for critical notifications (booking changes)
- [ ] Email notifications with responsive HTML templates
- [ ] Notification scheduling with timezone awareness
- [ ] Batch notification processing for large campaigns
- [ ] Delivery tracking and retry logic for failed sends
- [ ] Unsubscribe handling for marketing communications

---

### 2.16 Provider / Business Owner Portal

| Attribute | Details |
|-----------|---------|
| **Priority** | P0 — Critical |
| **Description** | Web-based management interface for business operations |
| **User Stories** | As a business owner, I want to manage my business so I can operate efficiently. |

**Acceptance Criteria:**
- [ ] Dashboard with KPIs: today's appointments, revenue, new customers, occupancy rate
- [ ] Calendar view: day, week, month; drag-to-reschedule
- [ ] Appointment management: create, edit, cancel, mark no-show
- [ ] Staff management: add profiles, set schedules, assign services
- [ ] Service catalog: add, edit, price, duration, online booking toggle
- [ ] Customer database with visit history and notes
- [ ] Business profile editor with photos, hours, description
- [ ] Booking settings: cancellation policy, lead time, buffer time
- [ ] Revenue reports: daily, weekly, monthly, export to CSV
- [ ] Notification settings for new bookings
- [ ] Multiple location support with location switcher
- [ ] Role-based access: Owner, Manager, Staff

---

### 2.17 Admin Dashboard

| Attribute | Details |
|-----------|---------|
| **Priority** | P1 — High |
| **Description** | Platform administration and oversight |
| **User Stories** | As an admin, I want to oversee the platform so I can ensure quality and growth. |

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, delete accounts
- [ ] Business onboarding workflow: application, verification, approval/rejection
- [ ] Business management: edit details, feature/unfeature, suspend
- [ ] Content moderation: review flagged reviews, photos, businesses
- [ ] Financial overview: platform revenue, payouts to businesses, refunds
- [ ] Analytics: MAU, booking volume, conversion funnel, top categories
- [ ] Promotional tools: create and manage campaigns, discount codes
- [ ] Support ticket system integration
- [ ] System health monitoring: API latency, error rates, queue depths
- [ ] Audit log of all admin actions
- [ ] Configurable platform settings: commission rates, featured business criteria

---

### 2.18 Background Jobs (BullMQ)

| Attribute | Details |
|-----------|---------|
| **Priority** | P1 — High |
| **Description** | Asynchronous task processing for reliability and performance |
| **User Stories** | As a user, I want reliable notifications and confirmations even during high traffic. |

**Acceptance Criteria:**
- [ ] Job queues defined with clear naming and priorities
- [ ] Email sending queue with retry (3 attempts, exponential backoff)
- [ ] SMS sending queue with provider failover
- [ ] Push notification queue with batching for efficiency
- [ ] Payment webhook processing queue (idempotent handlers)
- [ ] Slot cache invalidation queue on booking changes
- [ ] Report generation queue (daily, weekly, monthly)
- [ ] Data export queue for GDPR requests
- [ ] Image processing queue (resize, optimize uploads)
- [ ] Search index updates queue (business, service changes)
- [ ] Dead letter queue for failed job inspection and replay
- [ ] Job monitoring dashboard with queue depths, processing rates, failures
- [ ] Rate limiting per job type to prevent API quota exhaustion
- [ ] Scheduled jobs: daily summary emails, nightly data aggregation

---

## 3. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | App cold start < 2s; API response < 200ms (p95); Search results < 500ms |
| **Scalability** | Support 10,000 concurrent users; 1M businesses; 10M monthly bookings |
| **Security** | OWASP Top 10 compliance; encrypted data at rest and in transit; regular penetration testing |
| **Reliability** | 99.9% uptime SLA; automated backups; disaster recovery RPO < 1 hour |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1; SOC 2 Type II certification roadmap |
| **Localization** | Launch with EN, FR, ES, DE; framework for additional languages |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 100K within 12 months |
| Booking Conversion Rate | > 15% (search to completed booking) |
| User Retention (Day 30) | > 25% |
| Business NPS | > 50 |
| App Store Rating | > 4.5 stars |
| Average Booking Time | < 3 minutes |
| Customer Support Tickets | < 2% of total transactions |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Business Detail, Booking Flow, Appointment Mgmt, Provider Portal | Month 1-2 |
| **V1.0** | Map Search, Favorites, Reviews, Payments, Notifications | Month 3-4 |
| **V1.5** | Admin Dashboard, Analytics, Background Jobs optimization | Month 5-6 |
| **V2.0** | Loyalty Program, Referrals, AI Recommendations, International Expansion | Month 7-12 |

---

## 6. Open Questions

1. Commission structure: percentage per booking or subscription model for businesses?
2. Insurance/liability coverage for service disputes?
3. Integration with existing salon management software (Salonist, Vagaro)?
4. Subscription box / product marketplace expansion?

---

*Document Version: 1.0*  
*Last Updated: 2024*  
*Owner: Product Team*
