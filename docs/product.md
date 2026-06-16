# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Version:** 1.0.0  
**Last Updated:** 2024-01-15  
**Author:** Alex — Product Owner  

### 1.1 Vision
Build a comprehensive beauty and wellness appointment booking platform that connects customers with local businesses (salons, barbershops, spas, clinics). The platform enables seamless discovery, booking, and management of appointments while providing business owners with powerful tools to manage their operations.

### 1.2 Target Users
- **Customers (B2C):** Individuals seeking beauty/wellness services
- **Business Owners (B2B):** Salons, barbershops, spas, independent professionals
- **Platform Admins:** Internal operations team

### 1.3 Success Metrics
- Booking conversion rate > 15%
- User retention (30-day) > 25%
- Business onboarding completion > 70%
- Average booking time < 3 minutes

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 — Critical  
**Status:** Required for MVP

#### Description
Secure authentication system supporting multiple login methods with role-based access control.

#### User Stories
- As a customer, I want to create an account so I can book appointments and manage my bookings.
- As a business owner, I want to register my business so I can manage my services and availability.
- As a user, I want to reset my password so I can regain access to my account.

#### Acceptance Criteria
- [ ] Users can register with email/password, Google OAuth, and Apple Sign-In
- [ ] Passwords must be minimum 8 characters with at least one uppercase, one lowercase, and one number
- [ ] Email verification required before account activation
- [ ] JWT tokens with refresh token rotation (7-day access, 30-day refresh)
- [ ] Rate limiting: 5 login attempts per 15 minutes per IP
- [ ] Users can request password reset via email with 1-hour expiry link
- [ ] Role assignment: CUSTOMER, BUSINESS_OWNER, ADMIN
- [ ] Social login accounts link to existing email accounts automatically

#### Technical Notes
- Use bcrypt with cost factor 12 for password hashing
- Implement OAuth 2.0 with PKCE for mobile flows
- Store refresh tokens hashed in database

---

### 2.2 Guest Browse & Explore
**Priority:** P0 — Critical  
**Status:** Required for MVP

#### Description
Allow unauthenticated users to browse businesses and services to reduce friction in the discovery funnel.

#### User Stories
- As a guest, I want to browse businesses without creating an account so I can evaluate the platform.
- As a guest, I want to view business details and services so I can make informed decisions.

#### Acceptance Criteria
- [ ] Guest users can access search, browse categories, and view business profiles
- [ ] Guest users can view service listings and pricing
- [ ] Guest users can view reviews and ratings
- [ ] "Book Now" CTA prompts authentication with return URL preservation
- [ ] Guest session data (search filters, viewed businesses) persisted for 24 hours via localStorage
- [ ] Upon login, guest data merges with user account where applicable
- [ ] Guest browsing limited to 50 business detail views per session to prevent scraping

---

### 2.3 Business Search & Discovery
**Priority:** P0 — Critical  
**Status:** Required for MVP

#### Description
Powerful search and filtering system for customers to find relevant businesses.

#### User Stories
- As a customer, I want to search for businesses by name, service, or location so I can find what I need.
- As a customer, I want to filter results so I can narrow down my options.

#### Acceptance Criteria
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Filters: distance (1-50km), rating (1-5 stars), price range, availability (today, this week), category, amenities
- [ ] Sort options: relevance, rating, distance, price (low-high, high-low)
- [ ] Search results display: business photo, name, rating, distance, starting price, next available slot
- [ ] Auto-complete suggestions with recent searches
- [ ] Search history saved for authenticated users (last 20 searches)
- [ ] Results pagination with 20 items per page
- [ ] Search response time < 200ms for cached queries, < 500ms for fresh queries
- [ ] Empty state with suggested alternatives when no results found

---

### 2.4 Map-based Search
**Priority:** P1 — High  
**Status:** Post-MVP

#### Description
Interactive map interface for geographic discovery of businesses.

#### Acceptance Criteria
- [ ] Map displays business pins with clustering for dense areas
- [ ] Pin color indicates availability (green = available today, gray = no availability)
- [ ] Tap/click pin opens business card with key info and CTA
- [ ] Map bounds trigger new search query (debounced 300ms)
- [ ] User location request with permission handling
- [ ] Default map view centers on user's saved address or IP geolocation
- [ ] List view toggle with synchronized state
- [ ] Support for satellite and standard map tiles

---

### 2.5 Business Detail View
**Priority:** P0 — Critical  
**Status:** Required for MVP

#### Description
Comprehensive business profile page with all information needed to make a booking decision.

#### Acceptance Criteria
- [ ] Hero section: business name, photos (up to 10), rating, review count, favorite toggle
- [ ] Info section: address, hours, phone, website, social links
- [ ] Services tab: categorized service list with prices, durations, descriptions
- [ ] Reviews tab: sortable reviews with photos, business owner responses
- [ ] Team tab: staff profiles with specialties and availability
- [ ] About tab: business description, amenities, policies, languages spoken
- [ ] Sticky booking CTA with next available slot highlight
- [ ] Photo gallery with lightbox view
- [ ] Share functionality (deep link, social)
- [ ] Report business option for inappropriate content

---

### 2.6 Service Categories
**Priority:** P0 — Critical  
**Status:** Required for MVP

#### Description
Hierarchical categorization system for services across the platform.

#### Acceptance Criteria
- [ ] Predefined category tree: Hair, Nails, Face, Body, Massage, Medical Aesthetic, Wellness
- [ ] Each category has icon, description, and cover image
- [ ] Businesses can assign services to multiple categories
- [ ] Category pages show featured businesses and trending services
- [ ] Admin can add, edit, deactivate categories (not delete to preserve data integrity)
- [ ] Category slugs are SEO-friendly and localized
- [ ] Category analytics track views and conversion rates

---

### 2.7 Booking Flow
**Priority:** P0 — Critical  
**Status:** Required for MVP

#### Description
Streamlined multi-step booking process optimized for conversion.

#### User Stories
- As a customer, I want to book an appointment in as few steps as possible so I can secure my preferred time.

#### Acceptance Criteria
- [ ] Step 1 — Service Selection: single or multiple services, staff preference (any, specific, or top-rated)
- [ ] Step 2 — Date/Time: calendar view with available slots, timezone handling
- [ ] Step 3 — Confirmation: review details, apply promo code, add notes
- [ ] Step 4 — Payment: saved methods or new payment (see Payment Integration)
- [ ] Booking confirmation page with calendar invite (.ics) and add-to-calendar options
- [ ] SMS and email confirmation sent within 30 seconds
- [ ] 10-minute hold on selected slot during checkout (reservation pattern)
- [ ] Auto-release hold if payment not completed
- [ ] Support for guest checkout (optional, requires email + phone)
- [ ] Booking modification allowed up to 2 hours before appointment
- [ ] Cancellation with configurable policy (business-defined: flexible, moderate, strict)
- [ ] Waitlist option when no slots available

---

### 2.8 Appointment Management
**Priority:** P0 — Critical  
**Status:** Required for MVP

#### Description
Comprehensive appointment lifecycle management for customers and business owners.

#### Customer Acceptance Criteria
- [ ] Upcoming appointments view with countdown, directions, contact buttons
- [ ] Past appointments view with rebook CTA
- [ ] Cancel with reason selection (customer no-show, change of mind, etc.)
- [ ] Reschedule with same slot selection flow
- [ ] Add to personal calendar (Google, Apple, Outlook)
- [ ] Appointment reminders: 24h email, 2h SMS/push

#### Business Owner Acceptance Criteria
- [ ] Calendar view (day, week, month) with appointment blocks
- [ ] Color-coded status: confirmed, checked-in, completed, no-show, cancelled
- [ ] Quick actions: check-in, complete, cancel, reschedule
- [ ] Block time (breaks, unavailability)
- [ ] Appointment notes and internal tags
- [ ] Customer arrival notification

---

### 2.9 Favorites
**Priority:** P1 — High  
**Status:** Required for MVP

#### Description
Allow users to save and quickly access preferred businesses.

#### Acceptance Criteria
- [ ] Heart icon toggle on business cards and detail pages
- [ ] Favorites list with sorting (recently added, alphabetical, nearest)
- [ ] Quick book from favorites list
- [ ] Favorite count displayed on business profile
- [ ] Push notification when favorited business has new availability or promotion
- [ ] Sync across devices for authenticated users
- [ ] Guest favorites prompt for login with data preservation

---

### 2.10 User Profile
**Priority:** P1 — High  
**Status:** Required for MVP

#### Description
Customer profile management with preferences and history.

#### Acceptance Criteria
- [ ] Profile photo, name, phone, email, birthday (for birthday offers)
- [ ] Saved addresses with default selection
- [ ] Preferred staff, service categories, notification preferences
- [ ] Payment methods management
- [ ] Booking history with invoice access
- [ ] Loyalty points balance and history (if applicable)
- [ ] Data export (GDPR compliance)
- [ ] Account deletion with 30-day grace period

---

### 2.11 Availability & Slot Computation
**Priority:** P0 — Critical  
**Status:** Required for MVP

#### Description
Core scheduling engine that computes available booking slots based on complex business rules.

#### Acceptance Criteria
- [ ] Business defines weekly recurring hours with exceptions for holidays
- [ ] Service duration + buffer time = slot occupancy
- [ ] Staff-specific availability (part-time, vacation)
- [ ] Concurrent booking support (multiple rooms/stations)
- [ ] Slot computation accounts for existing appointments and blocked times
- [ ] API returns available slots for date range in < 100ms
- [ ] Support for variable-duration services (e.g., "30-60 min")
- [ ] Timezone-aware computation with DST handling
- [ ] Buffer between appointments (configurable per business)
- [ ] Last-bookable-time before appointment (e.g., must book 2h in advance)
- [ ] Overbooking protection with optimistic locking

---

### 2.12 Shared Types & Design System
**Priority:** P0 — Critical  
**Status:** Required for MVP

#### Description
Consistent design language and reusable components across all platforms.

#### Acceptance Criteria
- [ ] Color palette: primary (#6C5CE7), secondary (#00D2D3), semantic colors (success, warning, error, info)
- [ ] Typography: Inter for UI, Playfair Display for headings
- [ ] Spacing scale: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Component library: buttons, inputs, cards, modals, date picker, time slot grid
- [ ] Shared TypeScript types between frontend and backend (monorepo)
- [ ] Responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- [ ] Dark mode support
- [ ] Accessibility: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- [ ] Animation standards: 200ms ease-in-out for micro-interactions

---

### 2.13 Reviews & Ratings
**Priority:** P1 — High  
**Status:** Required for MVP

#### Description
Social proof system for businesses with verified reviews.

#### Acceptance Criteria
- [ ] Customers can leave review after completed appointment (up to 30 days)
- [ ] Rating: 1-5 stars with half-star precision
- [ ] Review components: overall rating, service quality, staff, ambiance, value
- [ ] Photo upload (up to 5 images)
- [ ] Business owner can respond publicly
- [ ] Flag and moderation system for inappropriate reviews
- [ ] Reviews marked "Verified" if from completed booking
- [ ] Average rating recalculated in real-time
- [ ] Sort reviews by: most recent, highest rated, lowest rated, verified only
- [ ] Review helpfulness voting

---

### 2.14 Payment Integration
**Priority:** P0 — Critical  
**Status:** Required for MVP

#### Description
Secure payment processing with multiple methods and business payout support.

#### Acceptance Criteria
- [ ] Stripe integration for card payments
- [ ] Support for: credit/debit cards, Apple Pay, Google Pay
- [ ] Payment intent created at booking initiation, confirmed on completion
- [ ] Saved payment methods with PCI-compliant tokenization
- [ ] Full refund, partial refund, and no-show charge support
- [ ] Business payout schedule: daily, weekly, monthly (configurable)
- [ ] Platform fee deduction (configurable percentage + fixed fee)
- [ ] Invoice generation with VAT/tax calculation
- [ ] Payment failure handling with retry logic and user notification
- [ ] 3D Secure authentication for applicable transactions
- [ ] Webhook handling for payment status updates

---

### 2.15 Notifications
**Priority:** P1 — High  
**Status:** Required for MVP

#### Description
Multi-channel notification system for timely user communication.

#### Acceptance Criteria
- [ ] Channels: push (Firebase), SMS (Twilio), email (SendGrid)
- [ ] Notification types: booking confirmation, reminder, modification, cancellation, promotion, review request
- [ ] User preference controls per channel and type
- [ ] Notification templates with variable substitution
- [ ] Delivery tracking and retry logic
- [ ] Batch notification support for business announcements
- [ ] Quiet hours respect (default 22:00-08:00, configurable)
- [ ] In-app notification center with read/unread status
- [ ] Deep linking from push notifications to relevant screens

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 — Critical  
**Status:** Required for MVP

#### Description
Dedicated web interface for business owners to manage their presence and operations.

#### Acceptance Criteria
- [ ] Dashboard: today's appointments, revenue, new customers, upcoming week preview
- [ ] Business profile editor with photos, description, hours, policies
- [ ] Service management: CRUD services with pricing, duration, description, category assignment
- [ ] Staff management: add team members, set permissions, manage schedules
- [ ] Availability calendar with drag-to-block functionality
- [ ] Appointment calendar with status management
- [ ] Customer database with visit history and notes
- [ ] Analytics: bookings, revenue, cancellation rate, popular services, peak hours
- [ ] Settings: payout account, notification preferences, booking policies, integration settings
- [ ] Mobile-responsive design for on-the-go management
- [ ] Multi-location support for business chains

---

### 2.17 Admin Dashboard
**Priority:** P2 — Medium  
**Status:** Post-MVP

#### Description
Internal tool for platform management and oversight.

#### Acceptance Criteria
- [ ] User management: search, view, suspend, impersonate
- [ ] Business onboarding approval workflow
- [ ] Content moderation: review flagged businesses, reviews, photos
- [ ] Financial overview: GMV, revenue, payouts, refunds
- [ ] Analytics: MAU, booking conversion, churn, top categories, geographic distribution
- [ ] System health: API latency, error rates, queue depth
- [ ] Promotional tools: featured business placement, promo code generation
- [ ] Role-based access: super admin, support agent, finance, marketing
- [ ] Audit log for all admin actions

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P1 — High  
**Status:** Required for MVP

#### Description
Asynchronous job processing for reliable, scalable background operations.

#### Acceptance Criteria
- [ ] Job queues: email, SMS, push notifications, payment webhooks, report generation, data exports
- [ ] Retry policy: 3 attempts with exponential backoff (5s, 25s, 125s)
- [ ] Dead letter queue for failed jobs after max retries
- [ ] Job prioritization: critical, high, normal, low
- [ ] Scheduled jobs: daily reports, nightly cleanup, reminder dispatch
- [ ] Job progress tracking and status visibility in admin
- [ ] Concurrency control per queue type
- [ ] Redis-backed with BullMQ dashboard for monitoring
- [ ] Graceful shutdown handling for in-progress jobs

---

## 3. Non-Functional Requirements

### 3.1 Performance
- Page load time < 2s on 3G
- API response time P95 < 500ms
- Image optimization: WebP with JPEG fallback, lazy loading

### 3.2 Security
- OWASP Top 10 compliance
- Rate limiting on all public endpoints
- Input validation and sanitization
- CORS properly configured
- Dependency vulnerability scanning

### 3.3 Scalability
- Horizontal scaling support
- Database connection pooling
- CDN for static assets
- Caching strategy (Redis) with cache invalidation

### 3.4 Compliance
- GDPR data handling and right to erasure
- PCI-DSS Level 1 for payment data (via Stripe)
- Accessibility: WCAG 2.1 AA

---

## 4. Prioritization Matrix

| Feature | Priority | Sprint Target | Dependencies |
|---------|----------|-------------|--------------|
| User Authentication | P0 | Sprint 1 | — |
| Guest Browse & Explore | P0 | Sprint 1 | — |
| Business Search & Discovery | P0 | Sprint 1 | — |
| Service Categories | P0 | Sprint 1 | — |
| Business Detail View | P0 | Sprint 2 | Service Categories |
| Booking Flow | P0 | Sprint 2 | Availability & Slot Computation, Payment |
| Availability & Slot Computation | P0 | Sprint 2 | — |
| Appointment Management | P0 | Sprint 3 | Booking Flow |
| Payment Integration | P0 | Sprint 3 | — |
| User Profile | P1 | Sprint 3 | User Authentication |
| Favorites | P1 | Sprint 4 | User Authentication |
| Reviews & Ratings | P1 | Sprint 4 | Appointment Management |
| Notifications | P1 | Sprint 4 | Booking Flow, Appointment Management |
| Provider/Business Owner Portal | P0 | Sprint 5-6 | All customer-facing features |
| Map-based Search | P1 | Sprint 5 | Business Search & Discovery |
| Background Jobs (BullMQ) | P1 | Sprint 2-6 | Ongoing |
| Shared Types & Design System | P0 | Sprint 1-2 | Ongoing |
| Admin Dashboard | P2 | Sprint 7-8 | Provider Portal |

---

## 5. Open Questions

1. Internationalization scope for MVP (languages, currencies, regions)?
2. Commission/fee structure finalization?
3. Insurance or cancellation protection offerings?
4. Subscription tiers for businesses (free, premium, enterprise)?

---

*Document maintained by Product Team. For questions, contact: product@planity-clone.com*
