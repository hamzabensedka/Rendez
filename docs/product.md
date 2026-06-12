# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Build a comprehensive beauty and wellness marketplace that connects customers with local service providers (salons, barbershops, spas, clinics) through seamless discovery, booking, and payment experiences.

### 1.2 Target Users
- **Customers**: Individuals seeking beauty/wellness services, ages 18-55, mobile-first
- **Business Owners**: Salon/spa/clinic managers and independent professionals
- **Platform Admins**: Operations team managing the marketplace

### 1.3 Success Metrics
- Monthly Active Users (MAU)
- Booking conversion rate > 15%
- Provider onboarding time < 30 minutes
- Customer retention rate (30-day) > 40%

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority**: P0 (Critical)
**Owner**: Product / Engineering

#### Description
Secure, frictionless authentication supporting multiple login methods with role-based access control.

#### User Stories
- As a customer, I want to sign up with email/phone so I can book appointments quickly
- As a business owner, I want to register my business so I can manage my bookings
- As a user, I want to reset my password so I can recover access to my account

#### Acceptance Criteria
- [ ] Users can register with email + password, phone + OTP, or OAuth (Google, Apple, Facebook)
- [ ] Password requirements: min 8 chars, 1 uppercase, 1 number, 1 special character
- [ ] JWT tokens with refresh token rotation; access token expiry: 15 min, refresh: 7 days
- [ ] Role assignment: `CUSTOMER`, `PROVIDER`, `ADMIN` (default: `CUSTOMER`)
- [ ] Email verification required before booking; optional for browsing
- [ ] Phone verification via SMS OTP (Twilio or similar)
- [ ] Rate limiting: 5 login attempts per 15 minutes per IP
- [ ] Social login accounts linked to existing email accounts with merge option
- [ ] Logout invalidates refresh tokens (blacklist in Redis)

#### Technical Notes
- Use Passport.js with JWT strategy
- Store password hashes with bcrypt (cost factor 12)
- Redis for session/token blacklist

---

### 2.2 Guest Browse & Explore
**Priority**: P0 (Critical)

#### Description
Allow unauthenticated users to browse businesses and services to reduce friction and drive conversions.

#### Acceptance Criteria
- [ ] Guest users can view business listings without login
- [ ] Guest users can view business details and service catalogs
- [ ] Guest users can see availability (time slots) but cannot book
- [ ] Prompt for login/signup appears at booking initiation (modal, non-blocking)
- [ ] Guest search history stored in localStorage; merged to account upon login
- [ ] Guest favorites stored in localStorage; prompt to persist on login

---

### 2.3 Business Search & Discovery
**Priority**: P0 (Critical)

#### Description
Powerful search and filtering to help customers find the right service provider.

#### Acceptance Criteria
- [ ] Full-text search across business name, service name, and description
- [ ] Filters: category, price range, rating (min stars), availability (today, this week), distance
- [ ] Sort options: relevance, rating, price (low-high), distance
- [ ] Auto-complete suggestions with debounce (300ms)
- [ ] Recent searches stored (last 10), clearable
- [ ] Search results pagination: 20 items per page
- [ ] Empty state with suggested categories
- [ ] Search analytics logged for trending queries

---

### 2.4 Map-based Search
**Priority**: P1 (High)

#### Description
Visual map interface for geographic discovery of businesses.

#### Acceptance Criteria
- [ ] Interactive map (Google Maps or Mapbox) with business markers
- [ ] User geolocation with permission prompt; fallback to city center
- [ ] Cluster markers for dense areas; zoom to expand
- [ ] Map bounds trigger new search query (debounced 500ms)
- [ ] List view toggle with synchronized results
- [ ] Marker info window: business name, rating, starting price, thumbnail
- [ ] Directions link to native maps app
- [ ] Default radius: 5km, adjustable: 1km, 5km, 10km, 20km, 50km

---

### 2.5 Business Detail View
**Priority**: P0 (Critical)

#### Description
Comprehensive business profile page converting browsers to bookers.

#### Acceptance Criteria
- [ ] Hero: business name, photos (carousel, max 10), verified badge
- [ ] Key info: address (with map pin), phone, hours, website link
- [ ] Services tab: categorized list with prices, durations, descriptions
- [ ] Team tab: staff profiles with photos, bios, specialties
- [ ] Reviews tab: ratings breakdown, review list with photos
- [ ] Availability preview: next 3 available slots per service
- [ ] "Book Now" CTA sticky on mobile
- [ ] Share functionality (deep link, social)
- [ ] Report business option (inappropriate content)

---

### 2.6 Service Categories
**Priority**: P0 (Critical)

#### Description
Hierarchical categorization for service organization and discovery.

#### Acceptance Criteria
- [ ] Predefined category tree: Hair, Nails, Face, Body, Massage, Medical Aesthetic, Fitness
- [ ] Each category has icon, description, and cover image
- [ ] Subcategories: e.g., Hair > Cut, Color, Styling, Treatment
- [ ] Businesses can assign multiple categories and subcategories
- [ ] Category pages with featured businesses and trending services
- [ ] Category-based SEO-optimized landing pages

---

### 2.7 Booking Flow
**Priority**: P0 (Critical)

#### Description
Seamless multi-step booking experience with real-time availability.

#### Acceptance Criteria
- [ ] Step 1: Select service (or multiple services for package)
- [ ] Step 2: Select staff member (or "no preference")
- [ ] Step 3: Select date and time from available slots
- [ ] Step 4: Review booking details, apply promo code
- [ ] Step 5: Payment (if required) or confirm (if pay-at-venue)
- [ ] Real-time slot availability with optimistic locking (5-min hold on selection)
- [ ] Booking confirmation with unique reference number (QR code)
- [ ] Add to calendar (iCal/Google Calendar)
- [ ] Guest checkout: collect minimal info (name, phone, email) with option to create account
- [ ] Rescheduling: allow up to 24h before appointment, subject to availability

---

### 2.8 Appointment Management
**Priority**: P0 (Critical)

#### Description
Customer and provider views for tracking and managing appointments.

#### Acceptance Criteria (Customer)
- [ ] Upcoming appointments list with countdown
- [ ] Past appointments with rebook option
- [ ] Cancel appointment with reason selection (customer-initiated)
- [ ] Reschedule to new slot (subject to policy)
- [ ] Add to calendar reminder

#### Acceptance Criteria (Provider)
- [ ] Daily/weekly calendar view
- [ ] Appointment status: pending, confirmed, checked-in, completed, cancelled, no-show
- [ ] Block time slots (breaks, unavailability)
- [ ] Manual booking creation for walk-ins/phone bookings
- [ ] Customer notes and history visible

---

### 2.9 Favorites
**Priority**: P1 (High)

#### Description
Save preferred businesses for quick rebooking.

#### Acceptance Criteria
- [ ] Heart icon on business cards and detail page
- [ ] Favorites list with quick-book from last service
- [ ] Push notification when favorite adds new service or promotion
- [ ] Sync across devices for logged-in users

---

### 2.10 User Profile
**Priority**: P1 (High)

#### Description
Customer profile management and preferences.

#### Acceptance Criteria
- [ ] Edit personal info: name, phone, email, profile photo
- [ ] Manage payment methods (add, remove, set default)
- [ ] Notification preferences: email, SMS, push (granular per type)
- [ ] Booking history with receipts
- [ ] Loyalty/points balance (if applicable)
- [ ] Delete account (GDPR compliance): 30-day grace period, data anonymization

---

### 2.11 Availability & Slot Computation
**Priority**: P0 (Critical)

#### Description
Core scheduling engine calculating real-time availability.

#### Acceptance Criteria
- [ ] Business defines: operating hours per day, slot duration per service, buffer between appointments
- [ ] Staff-specific schedules and time off
- [ ] Slot computation considers: existing bookings, blocked times, staff availability, service duration
- [ ] Support for recurring availability patterns and exceptions
- [ ] Performance: slot query < 200ms for 30-day range
- [ ] Timezone-aware (business timezone primary, customer sees converted)
- [ ] Overbooking prevention: database-level constraint + application-level check

---

### 2.12 Shared Types & Design System
**Priority**: P0 (Critical)

#### Description
Consistent UI/UX across platforms with reusable components.

#### Acceptance Criteria
- [ ] Color palette: primary (#FF6B6B), secondary (#4ECDC4), neutrals, semantic colors
- [ ] Typography: Inter font family, 6 heading levels, body, caption
- [ ] Component library: buttons, inputs, cards, modals, date picker, time slot grid
- [ ] Spacing system: 4px base grid
- [ ] Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
- [ ] Dark mode support
- [ ] Accessibility: WCAG 2.1 AA minimum, focus states, screen reader labels
- [ ] Shared TypeScript types between frontend and backend (monorepo)

---

### 2.13 Reviews & Ratings
**Priority**: P1 (High)

#### Description
Social proof system for quality assurance and discovery.

#### Acceptance Criteria
- [ ] Customers can review after completed appointment (within 30 days)
- [ ] Rating: 1-5 stars, mandatory; review text: optional, max 1000 chars
- [ ] Photo attachments: max 5 per review
- [ ] Business can respond to reviews publicly
- [ ] Review moderation: auto-flag profanity, manual admin review
- [ ] Aggregate rating displayed with distribution breakdown
- [ ] Sort reviews: most recent, most helpful, highest/lowest rating
- [ ] Mark review as helpful
- [ ] Prevent duplicate reviews per appointment

---

### 2.14 Payment Integration
**Priority**: P0 (Critical)

#### Description
Secure, flexible payment processing for bookings.

#### Acceptance Criteria
- [ ] Stripe integration: card payments, Apple Pay, Google Pay
- [ ] Payment flows: pay in full, deposit (partial), pay at venue
- [ ] Save payment methods for future use (Stripe Customer)
- [ ] Refund support: full and partial, with reason tracking
- [ ] Invoice generation and email delivery
- [ ] Failed payment handling: retry logic, customer notification
- [ ] PCI compliance: no card data stored server-side
- [ ] Webhook handling for payment status updates
- [ ] Provider payout: weekly to connected Stripe account

---

### 2.15 Notifications
**Priority**: P1 (High)

#### Description
Multi-channel communication for booking lifecycle and marketing.

#### Acceptance Criteria
- [ ] Channels: push (Firebase), email (SendGrid), SMS (Twilio)
- [ ] Transactional: booking confirmation, reminder (24h, 1h before), cancellation, reschedule
- [ ] Marketing: promotions, new services from favorites (opt-in)
- [ ] Provider notifications: new booking, cancellation, review received
- [ ] Notification preferences: granular control per channel and type
- [ ] In-app notification center with read/unread status
- [ ] Delivery tracking and retry for failed notifications

---

### 2.16 Provider / Business Owner Portal
**Priority**: P0 (Critical)

#### Description
Dedicated interface for business management.

#### Acceptance Criteria
- [ ] Dashboard: upcoming appointments, revenue summary, new reviews
- [ ] Business profile editor: info, photos, hours, services, staff
- [ ] Service management: CRUD with pricing, duration, description
- [ ] Staff management: profiles, schedules, permissions
- [ ] Booking calendar: day/week/month views, drag-to-reschedule
- [ ] Customer database: view history, notes, contact info
- [ ] Analytics: bookings, revenue, cancellation rate, popular services
- [ ] Settings: payment methods for payouts, notification preferences
- [ ] Mobile-responsive design

---

### 2.17 Admin Dashboard
**Priority**: P1 (High)

#### Description
Platform administration and oversight.

#### Acceptance Criteria
- [ ] User management: search, view, suspend/activate accounts
- [ ] Business verification: review submissions, approve/reject with notes
- [ ] Content moderation: review flagged reviews and businesses
- [ ] Analytics: platform-wide metrics, growth trends, churn
- [ ] Financial: transaction monitoring, dispute handling, payout management
- [ ] Support tools: impersonate user, issue refunds, send communications
- [ ] Role-based access: admin, support agent, finance
- [ ] Audit log for all admin actions

---

### 2.18 Background Jobs (BullMQ)
**Priority**: P1 (High)

#### Description
Asynchronous job processing for reliability and performance.

#### Acceptance Criteria
- [ ] Job types: email sending, SMS sending, push notifications, payment webhooks, report generation, data exports
- [ ] Retry policy: 3 attempts with exponential backoff
- [ ] Dead letter queue for failed jobs after retries
- [ ] Job monitoring: dashboard with status, retry, and delete actions
- [ ] Scheduled jobs: daily reports, cleanup tasks
- [ ] Queue separation per job type for independent scaling
- [ ] Job idempotency keys to prevent duplicate processing

---

## 3. Non-Functional Requirements

### 3.1 Performance
- Page load < 2s (95th percentile)
- API response < 200ms (p95)
- Image optimization: WebP, lazy loading, CDN

### 3.2 Security
- HTTPS everywhere
- Rate limiting on all endpoints
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection
- CORS configuration

### 3.3 Scalability
- Stateless API design
- Database connection pooling
- Redis caching for frequent queries
- Horizontal scaling ready

### 3.4 Compliance
- GDPR: data portability, right to erasure, consent management
- PCI DSS: via Stripe (no card data handling)

---

## 4. Release Phases

### Phase 1 (MVP) — Weeks 1-8
- User Authentication
- Business Search & Discovery
- Business Detail View
- Service Categories
- Booking Flow
- Appointment Management (basic)
- Availability & Slot Computation
- Shared Types & Design System
- Payment Integration (basic)
- Provider Portal (essential)

### Phase 2 — Weeks 9-14
- Map-based Search
- Favorites
- User Profile
- Reviews & Ratings
- Notifications (full)
- Background Jobs
- Admin Dashboard

### Phase 3 — Weeks 15-20
- Advanced analytics
- Loyalty program
- Referral system
- Mobile apps (React Native)
- AI recommendations

---

## 5. Appendix

### 5.1 Glossary
- **Slot**: A specific time period available for booking
- **Provider**: Business or individual offering services
- **Customer**: End user booking services

### 5.2 Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-01-15 | Alex (PO) | Initial specification |
