# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Platform:** Web (Responsive) + Mobile-first PWA  
**Target Audience:** Consumers looking to book beauty & wellness appointments; Business owners managing their salons/spas.  
**Goal:** Build a complete appointment-booking platform connecting customers with local beauty/wellness businesses.

---

## 2. Feature Specifications

### 2.1 User Authentication

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Allow users to create accounts, log in, and manage sessions securely. |
| **Actors** | Customer, Business Owner, Admin |

**Acceptance Criteria:**
- [ ] Users can register with email + password or OAuth (Google, Apple)
- [ ] Passwords must be hashed (bcrypt) with minimum 8 chars, 1 uppercase, 1 number
- [ ] JWT access token (15min expiry) + refresh token (7 days) rotation
- [ ] Users can request password reset via email link (expires in 1 hour)
- [ ] Rate limiting: 5 failed attempts triggers 15-minute lockout
- [ ] Session invalidation on logout from all devices option
- [ ] Email verification required before booking

---

### 2.2 Guest Browse & Explore

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Allow unauthenticated users to browse businesses and services without registration. |
| **Actors** | Guest (unauthenticated user) |

**Acceptance Criteria:**
- [ ] Guest can view business listings, search, and filter
- [ ] Guest can view business detail pages with services and prices
- [ ] Guest can see available time slots (but cannot book without login)
- [ ] Prompt to register/login appears at booking initiation with pre-filled context
- [ ] Guest session data (selected business/service/time) persists post-login

---

### 2.3 Business Search & Discovery

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Enable customers to find businesses by name, service, location, or category. |
| **Actors** | Customer, Guest |

**Acceptance Criteria:**
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Autocomplete suggestions with debounce (300ms)
- [ ] Recent searches stored locally (last 10)
- [ ] Search results sorted by relevance, rating, or distance
- [ ] Empty state with popular categories when no results
- [ ] Search history clearable by user

---

### 2.4 Map-based Search

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Visual discovery of businesses using an interactive map. |
| **Actors** | Customer, Guest |

**Acceptance Criteria:**
- [ ] Interactive map (Google Maps or Mapbox) with business markers
- [ ] Clustering for dense areas (show count on cluster)
- [ ] Clicking marker opens business card preview with name, rating, photo
- [ ] Map bounds filter search results in real-time
- [ ] User geolocation with permission prompt; fallback to city center
- [ ] "Near Me" button to recenter on user location
- [ ] List/map toggle with synchronized state

---

### 2.5 Business Detail View

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Comprehensive page showing all business information to help users make booking decisions. |
| **Actors** | Customer, Guest |

**Acceptance Criteria:**
- [ ] Hero image carousel (up to 10 images), business name, rating, review count
- [ ] Address with clickable directions link
- [ ] Operating hours with "Open Now" status indicator
- [ ] Phone number with click-to-call on mobile
- [ ] Service menu with categories, descriptions, durations, and prices
- [ ] Team/staff list with photos and bios
- [ ] Reviews section with average rating breakdown (1-5 stars)
- [ ] "Book Now" CTA sticky on mobile
- [ ] Share button (copy link, native share on mobile)
- [ ] Report business option for inappropriate content

---

### 2.6 Service Categories

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Hierarchical categorization of services for discovery and filtering. |
| **Actors** | Customer, Business Owner, Admin |

**Acceptance Criteria:**
- [ ] Predefined category tree: Hair, Nails, Face, Body, Massage, Wellness, Medical Aesthetic
- [ ] Each category has icon, name, and optional description
- [ ] Business owners can assign services to multiple categories
- [ ] Categories filterable in search (multi-select)
- [ ] Category badges displayed on business cards and detail pages
- [ ] Admin can add/edit/disable categories (soft delete)

---

### 2.7 Booking Flow

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Core conversion flow for reserving appointments. |
| **Actors** | Customer |

**Acceptance Criteria:**
- [ ] Step 1: Select service (with variant/options if applicable)
- [ ] Step 2: Select staff member or "No preference"
- [ ] Step 3: Select date (calendar view, max 60 days ahead)
- [ ] Step 4: Select time slot from computed availability
- [ ] Step 5: Review booking summary with price breakdown
- [ ] Step 6: Confirm booking (payment if required, or direct booking)
- [ ] Booking held for 10 minutes during payment; released if unpaid
- [ ] Confirmation screen with booking reference, add-to-calendar links
- [ ] Booking confirmation email + push notification sent
- [ ] Support for recurring bookings (weekly/monthly repeat)

---

### 2.8 Appointment Management

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Allow customers and business owners to view and manage appointments. |
| **Actors** | Customer, Business Owner |

**Acceptance Criteria:**
- [ ] Customer: List view with upcoming/past tabs, filter by status
- [ ] Customer: Reschedule up to 24 hours before (subject to availability)
- [ ] Customer: Cancel with reason selection; refund policy applied automatically
- [ ] Customer: Rebook past appointment with one click
- [ ] Business Owner: Calendar view (day/week/month) with appointment details
- [ ] Business Owner: Confirm, decline, or mark no-show
- [ ] Business Owner: Block time slots manually (lunch breaks, vacation)
- [ ] Real-time updates via WebSocket when changes occur
- [ ] Export appointments to ICS/Google Calendar

---

### 2.9 Favorites

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **Description** | Allow users to save and quickly access preferred businesses. |
| **Actors** | Customer |

**Acceptance Criteria:**
- [ ] Heart icon on business cards and detail pages to toggle favorite
- [ ] Favorites list accessible from profile menu
- [ ] Favorites persist across sessions (server-synced)
- [ ] Show favorite count on business detail (public)
- [ ] Push notification when favorited business has promotion/new service
- [ ] Import/export favorites (optional future enhancement)

---

### 2.10 User Profile

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **Description** | Centralized user information and preferences management. |
| **Actors** | Customer, Business Owner |

**Acceptance Criteria:**
- [ ] Profile photo upload (crop to square, max 5MB, JPG/PNG)
- [ ] Editable fields_Opens in a new tab: name, phone, email (with re-verification)
- [ ] Notification preferences: email, push, SMS (granular per event type)
- [ ] Payment methods management (Stripe Customer Portal integration)
- [ ] Booking history with invoice download (PDF)
- [ ] Delete account option (GDPR-compliant, 30-day grace period)
- [ ] Preference for default search radius and category filters

---

### 2.11 Availability & Slot Computation

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Core engine for calculating bookable time slots based on business rules. |
| **Actors** | System (background service) |

**Acceptance Criteria:**
- [ ] Define weekly recurring schedules per staff member (Mon-Sun, multiple intervals)
- [ ] Support for breaks within working hours
- [ ] Override schedules for specific dates (holidays, special hours)
- [ ] Slot duration computed from service duration + buffer time
- [ ] Consider existing bookings to exclude occupied slots
- [ ] Support for concurrent bookings if staff has multiple stations/rooms
- [ ] Cache computed slots for 5 minutes; invalidate on booking change
- [ ] API response time < 200ms for slot queries
- [ ] Handle timezone correctly (store UTC, display local)

---

### 2.12 Shared Types & Design System

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Ensure UI/UX consistency across all platforms and features. |
| **Actors** | Designers, Developers |

**Acceptance Criteria:**
- [ ] Color palette: primary (#6C5CE7), secondary (#00CEC9), semantic colors (success, warning, error)
- [ ] Typography: Inter font family, 6 heading levels, body, caption
- [ ] Spacing scale: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Component library: Button, Input, Select, DatePicker, Modal, Card, Skeleton, Toast
- [ ] Form validation patterns and error message standards
- [ ] Loading states: skeleton for lists, spinner for actions
- [ ] Empty states with illustrations and actionable CTAs
- [ ] Accessibility: WCAG 2.1 AA minimum (contrast, focus states, ARIA labels)
- [ ] Dark mode support (optional P2)

---

### 2.13 Reviews & Ratings

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **Description** | Social proof system for businesses and service quality. |
| **Actors** | Customer, Business Owner |

**Acceptance Criteria:**
- [ ] Customers can leave review only after completed appointment (verified badge)
- [ ] Rating: 1-5 stars with optional text review (max 1000 chars)
- [ ] Review photos allowed (up to 5, max 5MB each)
- [ ] Business owner can respond publicly to reviews
- [ ] Reviews sortable by newest, highest, lowest rating
- [ ] Flag inappropriate reviews; admin moderation queue
- [ ] Average rating recalculated in real-time; cached for performance
- [ ] Customers can edit review within 48 hours; delete anytime

---

### 2.14 Payment Integration

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Secure payment processing for bookings. |
| **Actors** | Customer, Business Owner, System |

**Acceptance Criteria:**
- [ ] Stripe integration for card payments (3D Secure supported)
- [ ] Payment intent created at booking initiation; confirmed on slot confirmation
- [ ] Support for saved payment methods (Stripe SetupIntent)
- [ ] Full payment or deposit options (configurable per business)
- [ ] Automatic refunds on cancellation per policy: full refund >48h, 50% 24-48h, no refund <24h
- [ ] Invoice generation with VAT/tax breakdown
- [ ] Webhook handling for payment success, failure, dispute
- [ ] Retry failed payments with customer notification
- [ ] Payout schedule to business owners (weekly, configurable)

---

### 2.15 Notifications

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **Description** | Multi-channel communication for booking lifecycle events. |
| **Actors** | Customer, Business Owner |

**Acceptance Criteria:**
- [ ] Channels: In-app, Email, Push (mobile), SMS (critical only)
- [ ] Event triggers: booking confirmed, reminder (24h, 1h), cancelled, rescheduled, completed
- [ ] Business owner notifications: new booking, cancellation, review received
- [ ] Preference management per channel and event type
- [ ] Notification history accessible in app (30 days retention)
- [ ] Deep links from push/email to relevant app screen
- [ ] Batch digest option for non-urgent notifications (daily summary)

---

### 2.16 Provider / Business Owner Portal

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Dedicated interface for businesses to manage their presence, services, and appointments. |
| **Actors** | Business Owner, Staff |

**Acceptance Criteria:**
- [ ] Dashboard with KPIs: upcoming appointments, revenue today, new reviews, occupancy rate
- [ ] Business profile editor: photos, description, hours, contact info
- [ ] Service management: CRUD services with name, description, duration, price, category
- [ ] Staff management: add staff, set schedules, assign services
- [ ] Appointment calendar with drag-to-reschedule
- [ ] Client database with visit history and notes (private)
- [ ] Promotions: create discount codes with usage limits and expiry
- [ ] Subscription tier management (Free, Pro, Enterprise with feature limits)

---

### 2.17 Admin Dashboard

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **Description** | Internal tool for platform management and oversight. |
| **Actors** | Admin, Support Agent |

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, impersonate
- [ ] Business verification workflow: pending, approved, rejected statuses
- [ ] Content moderation: review flagged reviews and business reports
- [ ] Financial overview: GMV, transaction volume, refunds, platform fees
- [ ] Analytics: DAU/MAU, conversion funnel, top businesses/categories
- [ ] System health: queue status, error rates, API latency
- [ ] Role-based access control (RBAC): super admin, support, finance, readonly
- [ ] Audit log of all admin actions (immutable, 2-year retention)

---

### 2.18 Background Jobs (BullMQ)

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Asynchronous task processing for reliability and scalability. |
| **Actors** | System |

**Acceptance Criteria:**
- [ ] Job queue definitions with priorities, retries, and dead-letter handling
- [ ] Email sending job (booking confirmations, reminders, marketing)
- [ ] Push notification job with batching and rate limiting
- [ ] Payment webhook processing with idempotency keys
- [ ] Slot cache warming and invalidation
- [ ] Nightly report generation for business owners
- [ ] Data cleanup: soft-deleted records, expired sessions, old logs
- [ ] Retry policy: 3 attempts with exponential backoff; alert on final failure
- [ ] Queue monitoring dashboard with job counts, processing rates, failed jobs
- [ ] Graceful shutdown: finish in-progress jobs before process exit

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | Page load < 2s (Lighthouse score > 80); API p95 < 500ms |
| **Scalability** | Support 10,000 concurrent users; horizontal scaling ready |
| **Security** | OWASP Top 10 mitigation; GDPR compliance; data encryption at rest and in transit |
| **Reliability** | 99.9% uptime SLA; automated backups (daily, 30-day retention) |
| **Accessibility** | WCAG 2.1 AA; screen reader compatible; keyboard navigable |
| **i18n** | French (default), English; extensible to more languages |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Bookings | 10,000 by month 6 |
| Conversion Rate (search → booking) | > 5% |
| User Retention (30-day) | > 30% |
| Business NPS | > 50 |
| App Store Rating | > 4.5 |
| Support Ticket Volume | < 2% of active users |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Map, Business Detail, Booking Flow, Appointment Mgmt, Availability, Payments, Business Owner Portal, Background Jobs | Month 1-2 |
| **V1.1** | Favorites, User Profile, Reviews & Ratings | Month 3 |
| **V1.2** | Notifications, Admin Dashboard, Analytics | Month 4 |
| **V2.0** | Mobile App (React Native), AI Recommendations, Loyalty Program | Month 6+ |

---

*Document Version: 1.0*  
*Last Updated: 2024*  
*Owner: Product Team*
