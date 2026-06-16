# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Build a comprehensive beauty and wellness appointment booking platform that connects customers with local businesses (salons, barbershops, spas, clinics). The platform serves three primary user groups: customers seeking to discover and book services, business owners managing their operations and appointments, and administrators overseeing the platform.

### 1.2 Target Users
- **Customers (B2C)**: Individuals aged 18-55, primarily women but inclusive, seeking convenient beauty/wellness service booking
- **Business Owners (B2B)**: Salon/barbershop/spa owners and managers needing appointment management tools
- **Administrators**: Platform operators managing business onboarding, disputes, and platform health

### 1.3 Success Metrics
- Monthly Active Users (MAU) — target 10K in first 6 months
- Booking Conversion Rate — target >15% from search to confirmed booking
- Business Retention Rate — target >80% monthly active businesses
- Customer Retention (30-day) — target >40%
- Average Bookings per Business per Month — target >50

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority**: P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Description** | Secure, multi-method authentication system for all user types |
| **User Story** | As a user, I want to create an account and log in securely so I can access personalized features and manage my bookings |

**Acceptance Criteria:**
- [ ] Users can register with email/password, Google OAuth, and Apple OAuth
- [ ] Passwords must be minimum 8 characters with at least one uppercase, one lowercase, one number
- [ ] Email verification required before account activation
- [ ] JWT-based session management with refresh token rotation
- [ ] Password reset via secure email link (expires in 1 hour)
- [ ] Users can log out from all devices
- [ ] Rate limiting: 5 failed login attempts triggers 15-minute lockout
- [ ] Business owners require additional verification (business email domain or document upload)
- [ ] Admin accounts are created only through internal invitation system

**Technical Notes:**
- Use bcrypt for password hashing (cost factor 12)
- Access token TTL: 15 minutes, Refresh token TTL: 7 days
- Store refresh tokens hashed in database for revocation capability

---

### 2.2 Guest Browse & Explore
**Priority**: P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Description** | Allow non-authenticated users to browse businesses and services to drive conversion |
| **User Story** | As a guest, I want to explore available businesses and services without creating an account so I can decide whether to book |

**Acceptance Criteria:**
- [ ] Guests can view business listings, search, and filter without login
- [ ] Guests can view business details, services, and reviews
- [ ] Guests can see real-time availability (read-only)
- [ ] Booking action requires authentication (prompt to login/signup with preserved context)
- [ ] Guest search preferences stored in localStorage for 7 days
- [ ] Converting from guest to registered user preserves any favorited businesses (if localStorage has data)

---

### 2.3 Business Search & Discovery
**Priority**: P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Description** | Powerful search and filtering to help customers find relevant businesses |
| **User Story** | As a customer, I want to find businesses by name, service, or location so I can book the right service |

**Acceptance Criteria:**
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Autocomplete suggestions with debounce (300ms) after 2 characters
- [ ] Recent searches stored (max 10, clearable)
- [ ] Filter by: service category, price range, rating (minimum stars), availability (today, this week), amenities
- [ ] Sort options: relevance (default), distance, rating, price (low to high)
- [ ] Pagination with infinite scroll or numbered pages (configurable, default 20 results/page)
- [ ] Search results display: business photo, name, rating, starting price, distance, next available slot
- [ ] "No results" state with suggested nearby alternatives or popular categories
- [ ] Search query analytics logged for improving suggestions

---

### 2.4 Map-based Search
**Priority**: P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Description** | Visual map interface showing business locations with clustering and detail popups |
| **User Story** | As a customer, I want to see businesses on a map so I can choose one that's conveniently located |

**Acceptance Criteria:**
- [ ] Interactive map using Mapbox/Google Maps with custom styling
- [ ] Default viewport centers on user's current location (with permission) or city center
- [ ] Business markers cluster when zoomed out (max 50 markers visible at any zoom)
- [ ] Clicking marker shows business card popup with key info and "View" CTA
- [ ] Map bounds update search results in real-time (debounced 500ms)
- [ ] User can drag/zoom map and results update to visible area
- [ ] List view toggle for accessibility and preference
- [ ] Marker color indicates availability: green (slots today), yellow (slots this week), gray (limited/far)
- [ ] Mobile: full-screen map with bottom sheet for results

---

### 2.5 Business Detail View
**Priority**: P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Description** | Comprehensive business profile page with all information needed to make a booking decision |
| **User Story** | As a customer, I want to see complete business information so I can decide whether to book |

**Acceptance Criteria:**
- [ ] Hero section: business name, cover photo, logo, rating, review count, favorite button
- [ ] Photo gallery (up to 20 images, lightbox view, swipe on mobile)
- [ ] Business description, hours of operation, contact info, address with directions link
- [ ] Services tab: list of services with prices, durations, descriptions; expandable for details
- [ ] Reviews tab: sortable by newest/most helpful, with photos, owner responses
- [ ] Team/staff section with photos and specialties (if business opts in)
- [ ] Amenities and policies (cancellation, late arrival, etc.)
- [ ] "Book Now" CTA sticky on mobile, prominent on desktop
- [ ] Share functionality (copy link, native share on mobile)
- [ ] Similar businesses carousel at bottom

---

### 2.6 Service Categories
**Priority**: P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Description** | Hierarchical categorization system for organizing all services |
| **User Story** | As a customer, I want to browse by category so I can discover services I might not know the name of |

**Acceptance Criteria:**
- [ ] Predefined category hierarchy: Hair, Nails, Face & Skin, Body & Massage, Hair Removal, Makeup, Wellness/Medical
- [ ] Each category has icon, name, and optional subcategories
- [ ] Businesses can assign services to multiple categories
- [ ] Category pages show featured businesses, popular services, and trending
- [ ] Admin can add/edit/disable categories without code deployment
- [ ] Categories support localization (i18n)
- [ ] SEO-friendly URLs for category pages

---

### 2.7 Booking Flow
**Priority**: P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Description** | Seamless multi-step booking process from service selection to confirmation |
| **User Story** | As a customer, I want to book an appointment in as few steps as possible so I can secure my preferred time |

**Acceptance Criteria:**
- [ ] Step 1 — Service Selection: choose service(s), see price and duration summary
- [ ] Step 2 — Staff Selection (optional): choose specific staff member or "no preference"
- [ ] Step 3 — Date/Time: calendar view with available slots highlighted; slots respect business hours and staff schedules
- [ ] Step 4 — Review: confirm details, apply promo code, see cancellation policy
- [ ] Step 5 — Payment: integrated payment (see Payment Integration) or "pay at venue" option
- [ ] Step 6 — Confirmation: booking reference, add to calendar, share options
- [ ] Progress indicator showing current step
- [ ] Users can navigate back to modify previous steps
- [ ] Booking held for 10 minutes during payment (inventory reservation)
- [ ] If payment fails, slot released after 10 minutes; user notified and can retry
- [ ] Guest checkout supported (requires email/phone at confirmation)
- [ ] Booking confirmation email and push notification sent

---

### 2.8 Appointment Management
**Priority**: P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Description** | Tools for customers and businesses to view, modify, and cancel appointments |
| **User Story** | As a customer, I want to manage my appointments so I can reschedule or cancel if plans change |

**Acceptance Criteria:**
- [ ] Customer "My Appointments" view: upcoming and past tabs, sorted by date
- [ ] Appointment card shows: business, service, staff, date/time, status, reference number
- [ ] Reschedule: select new slot within business's cancellation policy window
- [ ] Cancel: with reason selection (optional), refund processed per policy
- [ ] No-show marking by business (affects customer reliability score)
- [ ] Business calendar view: day/week/month views, filter by staff
- [ ] Business can block time (breaks, vacation) affecting availability
- [ ] Business can manually create, edit, cancel appointments
- [ ] Walk-in support: business can add unbooked appointments for reporting
- [ ] Appointment status lifecycle: pending → confirmed → checked-in → completed → no-show/cancelled

---

### 2.9 Favorites
**Priority**: P1 — High

| Aspect | Specification |
|--------|---------------|
| **Description** | Allow customers to save favorite businesses for quick access |
| **User Story** | As a customer, I want to save my favorite businesses so I can rebook quickly |

**Acceptance Criteria:**
- [ ] Heart icon on business cards and detail page toggles favorite status
- [ ] Favorites page shows all saved businesses in grid or list view
- [ ] Favorites synced across devices for logged-in users
- [ ] Push notification option: "New availability at [Favorite Business]"
- [ ] Maximum 200 favorites per user
- [ ] Suggest favorites based on booking history (if <3 favorites and >2 bookings)

---

### 2.10 User Profile
**Priority**: P1 — High

| Aspect | Specification |
|--------|---------------|
| **Description** | Customer profile management with preferences and history |
| **User Story** | As a customer, I want to manage my profile so my booking experience is personalized |

**Acceptance Criteria:**
- [ ] Profile photo, name, phone, email (editable with re-verification for email)
- [ ] Preferred notification settings (email, push, SMS) per event type
- [ ] Saved payment methods (see Payment Integration)
- [ ] Booking history with ability to rebook same service quickly
- [ ] Preferred categories/businesses for personalized recommendations
- [ ] Account deletion (GDPR compliance): 30-day grace period, full purge after
- [ ] Export personal data (GDPR)

---

### 2.11 Availability & Slot Computation
**Priority**: P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Description** | Real-time availability engine computing bookable slots from business rules and existing appointments |
| **User Story** | As a customer, I want to see accurate real-time availability so I can book with confidence |

**Acceptance Criteria:**
- [ ] Business defines: operating hours per day, slot duration (or service-specific), buffer between appointments
- [ ] Staff-specific schedules and time off
- [ ] Slot computation accounts for: existing bookings, blocked time, staff availability, service duration
- [ ] Support for variable-duration services (e.g., 30-90 min haircut)
- [ ] Support for multi-service bookings (sequential slot allocation)
- [ ] Real-time updates: when one user views slots, they're reserved for 10 minutes during booking flow
- [ ] Cache computed slots with 30-second TTL; invalidate on booking changes
- [ ] Handle timezone correctly (business timezone stored, display in customer timezone)
- [ ] Bulk availability generation for recurring patterns
- [ ] Edge cases: overnight services, DST transitions, leap years

---

### 2.12 Shared Types & Design System
**Priority**: P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Description** | Consistent design language and reusable components across all platforms |
| **User Story** | As a user, I want a consistent, polished experience across all screens |

**Acceptance Criteria:**
- [ ] Color palette: primary (#6C5CE7), secondary (#00CEC9), accent (#FD79A8), neutrals (grayscale)
- [ ] Typography: Inter for body, Playfair Display for headings
- [ ] Spacing system: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Component library: buttons, inputs, cards, modals, toasts, loaders, empty states
- [ ] Dark mode support (system preference + manual toggle)
- [ ] Accessibility: WCAG 2.1 AA minimum, focus indicators, screen reader labels, keyboard navigation
- [ ] Shared TypeScript types between frontend and backend (monorepo)
- [ ] Storybook for component documentation and testing
- [ ] Mobile-first responsive breakpoints: 320px, 768px, 1024px, 1440px

---

### 2.13 Reviews & Ratings
**Priority**: P1 — High

| Aspect | Specification |
|--------|---------------|
| **Description** | Customer feedback system for businesses and services |
| **User Story** | As a customer, I want to read and write reviews so I can make informed decisions and share my experience |

**Acceptance Criteria:**
- [ ] Verified reviews only: customer must have completed appointment to review
- [ ] 1-5 star rating with optional detailed review (10-1000 characters)
- [ ] Photo attachments (max 5, 5MB each)
- [ ] Review prompts sent 24 hours after appointment completion (configurable by business)
- [ ] Business owner can respond to reviews publicly
- [ ] Flag inappropriate reviews for admin moderation
- [ ] Review summary: average rating, rating distribution, recent reviews
- [ ] Sort reviews by: most recent, highest rated, lowest rated, most helpful
- [ ] Helpful/not helpful voting on reviews
- [ ] Reviews editable for 7 days, deletable by author anytime

---

### 2.14 Payment Integration
**Priority**: P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Description** | Secure payment processing for deposits, full payments, and platform fees |
| **User Story** | As a customer, I want to pay securely so my booking is confirmed; as a business, I want to receive payments reliably |

**Acceptance Criteria:**
- [ ] Stripe integration for card payments (PCI DSS compliant, use Stripe Elements)
- [ ] Support for: credit/debit cards, Apple Pay, Google Pay
- [ ] Payment models: full prepay, deposit (fixed or percentage), pay at venue
- [ ] Business can configure accepted payment models per service
- [ ] Platform fee: 2.5% + €0.25 per transaction (configurable by admin)
- [ ] Payout to business: weekly or on-demand, minus platform fee, to connected Stripe account
- [ ] Refund processing: full or partial, with reason tracking
- [ ] Failed payment retry: 1 automatic retry after 24 hours, then manual
- [ ] Invoice/receipt generation and email delivery
- [ ] Tax calculation support (VAT/GST configurable by region)

---

### 2.15 Notifications
**Priority**: P1 — High

| Aspect | Specification |
|--------|---------------|
| **Description** | Multi-channel notification system for booking lifecycle and marketing |
| **User Story** | As a user, I want timely notifications so I don't miss appointments and stay informed |

**Acceptance Criteria:**
- [ ] Channels: push (Firebase Cloud Messaging), email (SendGrid), SMS (Twilio)
- [ ] Customer notifications: booking confirmed, 24h reminder, 1h reminder, modified, cancelled, review prompt, promotional (opt-in)
- [ ] Business notifications: new booking, cancellation, review received, payout initiated
- [ ] Admin notifications: business onboarding completed, dispute raised, system alerts
- [ ] User preference center: enable/disable per channel per event type
- [ ] Notification history in-app (30 days)
- [ ] Deep linking: notifications navigate to relevant screen
- [ ] Rate limiting: max 3 promotional notifications per week per user
- [ ] A/B testing framework for notification copy and timing

---

### 2.16 Provider / Business Owner Portal
**Priority**: P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Description** | Comprehensive dashboard for business owners to manage their presence, services, and operations |
| **User Story** | As a business owner, I want to manage my business efficiently so I can focus on serving customers |

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue this week, upcoming week preview
- [ ] Business profile editor: photos, description, hours, contact, amenities
- [ ] Service management: CRUD services, set prices, durations, assign staff
- [ ] Staff management: add staff, set schedules, assign services, track performance
- [ ] Appointment calendar: day/week/month views, drag-to-reschedule, quick actions
- [ ] Customer management: view customer history, notes, contact info
- [ ] Analytics: booking volume, revenue, cancellation rate, popular services, peak hours
- [ ] Settings: notification preferences, payment settings, integration settings
- [ ] Mobile-responsive design (owners often manage on phone)
- [ ] Role-based access: owner (full), manager (most), staff (view own schedule only)

---

### 2.17 Admin Dashboard
**Priority**: P1 — High

| Aspect | Specification |
|--------|---------------|
| **Description** | Platform administration tools for managing businesses, users, and platform health |
| **User Story** | As an admin, I want oversight and control so the platform operates smoothly and safely |

**Acceptance Criteria:**
- [ ] Business onboarding queue: review applications, approve/reject with reason
- [ ] Business management: view all, search, filter by status, suspend/activate
- [ ] User management: search, view activity, suspend, impersonate (with audit log)
- [ ] Content moderation: review flagged reviews, photos, business descriptions
- [ ] Financial overview: platform revenue, payouts pending, transaction volume
- [ ] Dispute resolution: view customer complaints, mediate, issue refunds
- [ ] System health: API latency, error rates, queue depths, database performance
- [ ] Audit log: all admin actions with timestamp, admin ID, before/after state
- [ ] Role-based access: super admin, support agent, finance, readonly analyst

---

### 2.18 Background Jobs (BullMQ)
**Priority**: P1 — High

| Aspect | Specification |
|--------|---------------|
| **Description** | Reliable asynchronous job processing for non-time-critical operations |
| **User Story** | As a system, I need to process tasks reliably without blocking user requests |

**Acceptance Criteria:**
- [ ] Job queues defined: email-sending, push-notifications, sms-sending, payment-webhooks, report-generation, data-exports, image-processing, search-index-updates, reminder-notifications
- [ ] Retry policy: 3 attempts with exponential backoff (5s, 25s, 125s)
- [ ] Dead letter queue for failed jobs after retries exhausted; admin alert
- [ ] Job priority: critical (payment), high (notifications), normal (emails), low (reports)
- [ ] Job idempotency: duplicate job detection and prevention
- [ ] Scheduled jobs: daily reports at 6 AM, weekly analytics Sundays at midnight
- [ ] Job progress tracking and admin visibility
- [ ] Graceful shutdown: finish in-progress jobs before process exit
- [ ] Monitoring: queue depth, processing rate, failure rate, average job duration

---

## 3. Non-Functional Requirements

### 3.1 Performance
- Page load time < 2s (95th percentile)
- API response time < 200ms for 95% of requests
- Map marker rendering < 100ms for 50 markers
- Search results < 300ms

### 3.2 Security
- OWASP Top 10 mitigation
- Rate limiting on all public endpoints
- Input validation and sanitization
- SQL injection prevention via ORM parameterized queries
- XSS protection via output encoding
- CSRF tokens for state-changing operations

### 3.3 Compliance
- GDPR: data portability, right to erasure, consent management
- PCI DSS: via Stripe (never touch raw card numbers)
- Accessibility: WCAG 2.1 AA

### 3.4 Scalability
- Horizontal scaling ready (stateless services)
- Database read replicas for reporting queries
- CDN for static assets and images
- Caching strategy: Redis for sessions, computed slots, frequent queries

---

## 4. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Map, Business Detail, Booking Flow, Appointment Mgmt, Availability, Business Portal, Payments | Month 1-2 |
| **V1.1** | Favorites, Reviews, Notifications, User Profile | Month 3 |
| **V1.2** | Admin Dashboard, Analytics, Background Jobs optimization | Month 4 |
| **V2.0** | AI recommendations, Loyalty program, Marketplace integrations | Month 6+ |

---

## 5. Open Questions

1. Internationalization scope for MVP (start with FR/EN?)
2. Commission model vs. subscription model for business pricing
3. Insurance/liability coverage for no-shows and disputes
4. Integration with external calendar systems (Google, Outlook)
5. Native mobile apps vs. PWA for launch

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Product Team*