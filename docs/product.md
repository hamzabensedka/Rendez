# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Platform:** Web (responsive), iOS, Android  
**Target Audience:** Consumers seeking beauty & wellness appointments; business owners managing salons/spas/clinics.  
**Vision:** Become the go-to platform for discovering and booking beauty & wellness services seamlessly.

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 — Critical  
**Description:** Secure, frictionless authentication for all user types (customers, business owners, admins).

**Acceptance Criteria:**
- [ ] Users can register with email, password, and phone number
- [ ] Users can log in with email/password
- [ ] OAuth 2.0 social login (Google, Apple, Facebook)
- [ ] Phone number verification via SMS OTP
- [ ] Password reset via email link
- [ ] JWT token refresh mechanism with secure httpOnly cookies
- [ ] Role-based access control (Customer, BusinessOwner, Admin)
- [ ] Session timeout after 30 minutes of inactivity
- [ ] Account lockout after 5 failed login attempts
- [ ] Users can delete their account with 30-day grace period

**User Stories:**
- As a customer, I want to quickly sign up so I can book appointments without friction.
- As a business owner, I want a secure login so my business data is protected.

---

### 2.2 Guest Browse & Explore
**Priority:** P0 — Critical  
**Description:** Allow unauthenticated users to browse businesses and services to reduce signup friction.

**Acceptance Criteria:**
- [ ] Guests can view business listings without login
- [ ] Guests can search by location, service, and business name
- [ ] Guests can view business details, services, and reviews
- [ ] Guests can see real-time availability (read-only)
- [ ] Prompt to sign up appears when attempting to book
- [ ] Guest session data persists for 7 days via localStorage
- [ ] Converting guest to registered user preserves browsing history

**User Stories:**
- As a guest, I want to explore services before committing to create an account.

---

### 2.3 Business Search & Discovery
**Priority:** P0 — Critical  
**Description:** Powerful search and filtering to help users find the right business.

**Acceptance Criteria:**
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Autocomplete suggestions with typo tolerance
- [ ] Filter by: service category, price range, rating, distance, availability (today, this week)
- [ ] Sort by: relevance, distance, rating, price (low to high)
- [ ] Recent searches saved for quick re-access
- [ ] Search results pagination (20 per page)
- [ ] Empty state with suggested alternatives
- [ ] Search analytics logged for trending queries

**User Stories:**
- As a customer, I want to find a nail salon near me that is open today.

---

### 2.4 Map-based Search
**Priority:** P0 — Critical  
**Description:** Visual map interface for geographic discovery of businesses.

**Acceptance Criteria:**
- [ ] Interactive map with business markers (Google Maps / Mapbox)
- [ ] Cluster markers for dense areas
- [ ] User geolocation with permission prompt
- [ ] Custom marker icons by business category
- [ ] Click marker to preview business card
- [ ] "Search this area" on map pan/zoom
- [ ] Directions integration (external maps app)
- [ ] Default zoom to city level if geolocation denied
- [ ] Map and list view toggle with synchronized state

**User Stories:**
- As a customer, I want to see all barbershops on a map to choose the most convenient location.

---

### 2.5 Business Detail View
**Priority:** P0 — Critical  
**Description:** Comprehensive page showcasing a single business.

**Acceptance Criteria:**
- [ ] Hero image gallery (up to 10 images, swipeable)
- [ ] Business name, category, rating, review count
- [ ] Address with copy-to-clipboard and directions
- [ ] Operating hours with "Open Now" indicator
- [ ] Phone number with click-to-call
- [ ] Service menu with pricing and duration
- [ ] Team/staff profiles with photos and specialties
- [ ] Social media links
- [ ] "Book Now" CTA prominently displayed
- [ ] Share business via link or social
- [ ] Report inaccurate information

**User Stories:**
- As a customer, I want to see all details about a salon before deciding to book.

---

### 2.6 Service Categories
**Priority:** P0 — Critical  
**Description:** Hierarchical categorization of all bookable services.

**Acceptance Criteria:**
- [ ] Predefined categories: Hair, Nails, Face, Body, Massage, Medical Aesthetic, Fitness, Other
- [ ] Subcategories (e.g., Hair > Cut, Color, Styling, Treatment)
- [ ] Businesses can assign services to multiple categories
- [ ] Category icons and color coding in UI
- [ ] Category-based browsing from homepage
- [ ] Trending categories section
- [ ] Admin can add/edit categories without code change

**User Stories:**
- As a customer, I want to browse by category to discover new services.

---

### 2.7 Booking Flow
**Priority:** P0 — Critical  
**Description:** Seamless multi-step appointment booking experience.

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) with optional add-ons
- [ ] Step 2: Select staff member (or "No preference")
- [ ] Step 3: Select date and time slot from available options
- [ ] Step 4: Review booking summary with total price and duration
- [ ] Step 5: Apply promo code (optional)
- [ ] Step 6: Select payment method (card, saved method, pay in person)
- [ ] Step 7: Confirm booking with terms acceptance
- [ ] Real-time slot availability updates
- [ ] Prevent double-booking with optimistic locking
- [ ] Booking confirmation screen with calendar invite download
- [ ] Booking reference number generated (e.g., BK-2024-XXXXXX)
- [ ] Support for group bookings (multiple services, same time slot)
- [ ] Guest checkout flow with email capture

**User Stories:**
- As a customer, I want to book a haircut in under 60 seconds.

---

### 2.8 Appointment Management
**Priority:** P0 — Critical  
**Description:** Full lifecycle management of appointments for customers and business owners.

**Acceptance Criteria (Customer):**
- [ ] View upcoming and past appointments
- [ ] Reschedule appointment (up to 2 hours before, configurable by business)
- [ ] Cancel appointment with reason selection
- [ ] Receive refund per cancellation policy
- [ ] Add appointment to personal calendar (ICS file)
- [ ] Rebook same service with one click
- [ ] Rate and review after appointment completion

**Acceptance Criteria (Business Owner):**
- [ ] Calendar view (day, week, month) of all appointments
- [ ] Color-coded by status: confirmed, checked-in, completed, cancelled, no-show
- [ ] Create manual bookings (walk-ins, phone bookings)
- [ ] Block time slots (breaks, unavailability)
- [ ] Check-in customer on arrival
- [ ] Mark no-show with automated policy enforcement
- [ ] Export appointments to CSV

**User Stories:**
- As a customer, I want to easily reschedule my appointment if plans change.
- As a business owner, I want to see my entire day's schedule at a glance.

---

### 2.9 Favorites
**Priority:** P1 — High  
**Description:** Save preferred businesses for quick re-access.

**Acceptance Criteria:**
- [ ] One-tap favorite from business card or detail page
- [ ] Favorites list with quick book button
- [ ] Favorite count visible on business profile
- [ ] Push notification when favorited business has new availability
- [ ] Sync favorites across devices for logged-in users
- [ ] Suggest similar businesses based on favorites

**User Stories:**
- As a customer, I want to save my regular salon for quick rebooking.

---

### 2.10 User Profile
**Priority:** P1 — High  
**Description:** Central hub for customer account management.

**Acceptance Criteria:**
- [ ] View and edit personal info (name, phone, email, profile photo)
- [ ] Manage saved payment methods
- [ ] View booking history with receipts
- [ ] Notification preferences (email, SMS, push)
- [ ] Privacy settings (profile visibility, data sharing)
- [ ] Referral code and credits balance
- [ ] Loyalty program status
- [ ] Delete account with data export option

**User Stories:**
- As a customer, I want to manage my preferences and see my booking history.

---

### 2.11 Availability & Slot Computation
**Priority:** P0 — Critical  
**Description:** Real-time, accurate availability calculation engine.

**Acceptance Criteria:**
- [ ] Compute available slots based on: business hours, staff schedules, existing bookings, service duration, buffer time
- [ ] Support variable service durations (e.g., 30-60 min hair coloring)
- [ ] Handle concurrent bookings for different staff
- [ ] Respect business closure days and holidays
- [ ] Timezone-aware for businesses and customers
- [ ] Slot granularity: 15, 30, or 60 minutes (business configurable)
- [ ] Cache computed slots for 5 minutes to reduce load
- [ ] Fallback to next available day if today fully booked
- [ ] API response time < 200ms for slot queries
- [ ] Handle daylight saving time transitions gracefully

**User Stories:**
- As a business owner, I want accurate availability so I never get double-booked.

---

### 2.12 Shared Types & Design System
**Priority:** P0 — Critical  
**Description:** Consistent UI/UX across all platforms.

**Acceptance Criteria:**
- [ ] Component library: buttons, inputs, cards, modals, date picker, time picker
- [ ] Color palette: primary (#FF6B6B), secondary (#4ECDC4), neutral grays
- [ ] Typography: Inter for body, Playfair Display for headings
- [ ] Spacing scale: 4px base grid
- [ ] Responsive breakpoints: mobile < 768px, tablet 768-1024px, desktop > 1024px
- [ ] Dark mode support
- [ ] Accessibility: WCAG 2.1 AA compliance, screen reader support, keyboard navigation
- [ ] Shared TypeScript types between frontend and backend (monorepo)
- [ ] Storybook documentation for all components

**User Stories:**
- As a user, I want a consistent, accessible experience across all devices.

---

### 2.13 Reviews & Ratings
**Priority:** P1 — High  
**Description:** Social proof and feedback system.

**Acceptance Criteria:**
- [ ] Verified reviews only (post-appointment)
- [ ] 5-star rating with half-star precision
- [ ] Review text with photo upload option
- [ ] Business owner can respond to reviews
- [ ] Flag inappropriate reviews for admin review
- [ ] Sort reviews by: most recent, highest rated, lowest rated
- [ ] Rating breakdown by category (service, cleanliness, staff, value)
- [ ] Aggregate rating displayed on business card and detail
- [ ] Review reminder notification 24 hours after appointment

**User Stories:**
- As a customer, I want to read honest reviews before choosing a business.

---

### 2.14 Payment Integration
**Priority:** P0 — Critical  
**Description:** Secure, flexible payment processing.

**Acceptance Criteria:**
- [ ] Stripe integration for card payments
- [ ] Support for: Visa, Mastercard, Amex, Apple Pay, Google Pay
- [ ] Save payment methods for future use (PCI-compliant via Stripe)
- [ ] Full payment or deposit options (business configurable)
- [ ] Refund processing with automated email receipt
- [ ] Promo code and gift card redemption
- [ ] Invoice generation for business records
- [ ] Failed payment retry with user notification
- [ ] Webhook handling for payment status updates
- [ ] Multi-currency support (EUR, USD, GBP)

**User Stories:**
- As a customer, I want to pay securely and receive instant confirmation.

---

### 2.15 Notifications
**Priority:** P1 — High  
**Description:** Multi-channel communication for booking lifecycle.

**Acceptance Criteria:**
- [ ] Push notifications (iOS, Android) via Firebase Cloud Messaging
- [ ] Email notifications via SendGrid/Mailgun
- [ ] SMS notifications via Twilio
- [ ] Notification types: booking confirmed, reminder (24h, 1h before), cancelled, rescheduled, promotional
- [ ] User preference controls per channel
- [ ] Notification history in app
- [ ] Deep links from notification to relevant screen
- [ ] Batch promotional notifications with opt-out
- [ ] Delivery tracking and retry for failed notifications

**User Stories:**
- As a customer, I want timely reminders so I never miss my appointment.

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 — Critical  
**Description:** Dedicated dashboard for business owners to manage their presence and operations.

**Acceptance Criteria:**
- [ ] Dashboard with KPIs: today's bookings, revenue, new customers, cancellation rate
- [ ] Business profile editor (info, photos, hours, services, staff)
- [ ] Service menu management with pricing and duration
- [ ] Staff management: add, edit, set schedules and permissions
- [ ] Appointment calendar with drag-and-drop rescheduling
- [ ] Customer database with notes and visit history
- [ ] Revenue reports with date range filtering
- [ ] Payout management and bank account setup
- [ ] Subscription plan management (Free, Basic, Pro tiers)
- [ ] cribility: 99.9% uptime for business-critical features

**User Stories:**
- As a business owner, I want to manage my entire operation from one dashboard.

---

### 2.17 Admin Dashboard
**Priority:** P1 — High  
**Description:** Platform administration and oversight.

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, delete accounts
- [ ] Business verification and approval workflow
- [ ] Content moderation: review flagged reviews and business listings
- [ ] Financial overview: platform revenue, payouts, refunds
- [ ] Analytics: MAU, booking volume, conversion funnel, churn
- [ ] Promo code creation and management
- [ ] System health monitoring and alerts
- [ ] Role-based admin permissions (Super Admin, Support, Finance, Moderator)
- [ ] Audit log of all admin actions
- [ ] Data export for compliance requests

**User Stories:**
- As an admin, I need visibility into platform health and user activity.

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P1 — High  
**Description:** Reliable asynchronous job processing.

**Acceptance Criteria:**
- [ ] Job types: email sending, SMS sending, push notifications, payment webhooks, report generation, data exports, search index updates, reminder scheduling
- [ ] Retry logic with exponential backoff (max 5 attempts)
- [ ] Dead letter queue for failed jobs
- [ ] Job priority levels: critical, high, normal, low
- [ ] Scheduled jobs with cron expressions
- [ ] Job progress tracking for long-running tasks
- [ ] Monitoring dashboard for queue health
- [ ] Graceful shutdown handling
- [ ] Redis-backed with BullMQ
- [ ] Job idempotency keys to prevent duplicates

**User Stories:**
- As a platform, I need reliable background processing so user actions are never lost.

---

## 3. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Page load < 2s, API response < 200ms (p95) |
| Scalability | Support 10,000 concurrent users, 1M bookings/month |
| Security | OWASP Top 10 compliance, encryption at rest and in transit |
| Availability | 99.9% uptime SLA |
| Compliance | GDPR, CCPA, PCI-DSS Level 1 |
| Accessibility | WCAG 2.1 AA |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 50,000 by month 6 |
| Booking Conversion Rate | > 15% |
| App Store Rating | > 4.5 stars |
| Customer Support Tickets | < 2% of bookings |
| Business Retention | > 80% at 6 months |

---

## 5. Roadmap

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Search, Business Detail, Booking, Payments, Business Owner Portal | Month 1-2 |
| V1 | Map Search, Reviews, Favorites, Notifications, Profile | Month 3 |
| V2 | Admin Dashboard, Background Jobs, Analytics, Loyalty | Month 4 |
| V3 | Mobile Apps, Advanced Scheduling, Marketplace Features | Month 5-6 |

---

*Document Version: 1.0*  
*Last Updated: 2024*  
*Owner: Alex, Product Owner*
