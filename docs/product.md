# Planity Clone - Product Specification

## Document Information
- **Version**: 1.0.0
- **Last Updated**: 2024
- **Author**: Alex (Product Owner)
- **Status**: Draft

---

## 1. Executive Summary

Planity Clone is a comprehensive appointment booking platform connecting customers with beauty and wellness service providers. The platform enables users to discover businesses, browse services, book appointments, and manage their bookings, while providing business owners with tools to manage their availability, services, and clientele.

---

## 2. Product Vision

Create a seamless, intuitive platform that bridges the gap between service-seeking customers and beauty/wellness businesses, reducing friction in appointment scheduling and improving business efficiency.

---

## 3. Target Users

| Persona | Description | Goals |
|---------|-------------|-------|
| **Customer** | Individual seeking beauty/wellness services | Find, compare, and book appointments easily |
| **Business Owner** | Salon/spa owner or manager | Manage bookings, staff, and grow business |
| **Provider/Staff** | Individual service provider | Manage personal schedule and client bookings |
| **Admin** | Platform administrator | Oversee platform health, users, and operations |

---

## 4. Feature Specifications

### 4.1 User Authentication
**Priority**: P0 (Critical)
**Status**: Required

#### Description
Enable users to create accounts, log in, and manage their authentication state securely across the platform.

#### User Stories
- As a customer, I want to register with email/password or social accounts so I can access personalized features
- As a user, I want to log in securely so I can access my account
- As a user, I want to reset my password if I forget it
- As a user, I want to stay logged in via secure session management

#### Acceptance Criteria
- [ ] Users can register with email, password, first name, last name, phone number
- [ ] Password must be minimum 8 characters with at least one uppercase, one lowercase, and one number
- [ ] Users can register/login via Google OAuth
- [ ] Users can register/login via Facebook OAuth
- [ ] JWT tokens are issued with 15-minute access and 7-day refresh expiration
- [ ] Users can request password reset via email
- [ ] Password reset links expire after 1 hour
- [ ] Users can log out and have all sessions invalidated
- [ ] Rate limiting: 5 failed login attempts trigger 15-minute lockout
- [ ] Email verification required before booking

#### Technical Notes
- Implement JWT with HttpOnly cookies
- Use bcrypt for password hashing (12 rounds)
- Integrate with SendGrid/SES for transactional emails

---

### 4.2 Guest Browse & Explore
**Priority**: P0 (Critical)
**Status**: Required

#### Description
Allow unauthenticated users to browse businesses and services, encouraging registration at the point of booking.

#### User Stories
- As a guest, I want to browse businesses without creating an account
- As a guest, I want to view business details and services
- As a guest, I want to be prompted to register when attempting to book

#### Acceptance Criteria
- [ ] Guests can access home page with featured businesses
- [ ] Guests can search businesses by name, service, or location
- [ ] Guests can view business profile pages with services, prices, and reviews
- [ ] Guests can view availability calendar (read-only)
- [ ] Booking action triggers authentication modal/redirect
- [ ] Post-authentication, guest is redirected back to booking flow with state preserved
- [ ] Guest browsing data (search filters, viewed businesses) persisted for 24 hours via localStorage

---

### 4.3 Business Search & Discovery
**Priority**: P0 (Critical)
**Status**: Required

#### Description
Powerful search and filtering system for customers to discover relevant businesses.

#### User Stories
- As a customer, I want to search for businesses by name or service
- As a customer, I want to filter by location, price range, rating, and availability
- As a customer, I want to see search results sorted by relevance, rating, or distance

#### Acceptance Criteria
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Auto-complete suggestions with debounce (300ms)
- [ ] Filters available: location (radius), price range, rating (1-5), category, availability date
- [ ] Sort options: relevance, highest rated, most reviewed, nearest, price (low to high)
- [ ] Pagination with 20 results per page
- [ ] Search results display: business image, name, rating, address, starting price, next available slot
- [ ] Recent searches stored (last 5, local)
- [ ] Search history cleared on logout for privacy

---

### 4.4 Map-based Search
**Priority**: P1 (High)
**Status**: Required

#### Description
Interactive map view showing business locations with clustering for dense areas.

#### User Stories
- As a customer, I want to see businesses on a map to understand proximity
- As a customer, I want to click map markers to see business quick-info
- As a customer, I want to search within a map area

#### Acceptance Criteria
- [ ] Map displays business markers based on search/filter criteria
- [ ] Marker clustering activates at zoom levels showing 2+ overlapping markers
- [ ] Clicking marker opens info card with: business name, rating, image thumbnail, starting price
- [ ] Info card has "View Details" and "Book Now" CTAs
- [ ] Map bounds update triggers new search query
- [ ] User geolocation request on first map view (with permission prompt)
- [ ] Fallback to IP-based city center if geolocation denied
- [ ] Mobile: full-screen map with bottom sheet for results list

---

### 4.5 Business Detail View
**Priority**: P0 (Critical)
**Status**: Required

#### Description
Comprehensive business profile page showcasing all relevant information for booking decision.

#### User Stories
- As a customer, I want to see all business information before booking
- As a customer, I want to view the business's service menu
- As a customer, I want to read reviews from other customers

#### Acceptance Criteria
- [ ] Header: business name, cover image, logo, rating, review count, favorite toggle
- [ ] Gallery: image carousel with lightbox, minimum 1 image, maximum 20
- [ ] About section: description, opening hours, contact info, social links
- [ ] Services tab: categorized list with name, duration, price, description
- [ ] Reviews tab: sortable (newest, highest, lowest), paginated (10 per page)
- [ ] Staff tab: provider profiles with photos, bios, and individual service offerings
- [ ] Location section: embedded map with directions link
- [ ] "Book Now" sticky CTA on mobile
- [ ] Share functionality (copy link, native share on mobile)
- [ ] Report business option for inappropriate content

---

### 4.6 Service Categories
**Priority**: P1 (High)
**Status**: Required

#### Description
Hierarchical categorization system for organizing services and improving discoverability.

#### User Stories
- As a customer, I want to browse by category to discover new services
- As a business owner, I want to categorize my services for better visibility

#### Acceptance Criteria
- [ ] Predefined category hierarchy: Hair, Nails, Face, Body, Massage, Wellness, Medical Aesthetic
- [ ] Each category has icon, name, and description
- [ ] Subcategories supported (e.g., Hair > Coloring > Balayage)
- [ ] Services can belong to multiple categories (many-to-many)
- [ ] Category pages show featured businesses and trending services
- [ ] Category filters persist in URL for shareability
- [ ] Admin can add/edit/disable categories without code changes

---

### 4.7 Booking Flow
**Priority**: P0 (Critical)
**Status**: Required

#### Description
Streamlined multi-step process for customers to book appointments with minimal friction.

#### User Stories
- As a customer, I want to book an appointment in as few steps as possible
- As a customer, I want to select my preferred staff member
- As a customer, I want to see real-time availability

#### Acceptance Criteria
- [ ] Step 1: Service selection (single or multiple services)
- [ ] Step 2: Staff selection (specific provider or "no preference")
- [ ] Step 3: Date and time selection from available slots
- [ ] Step 4: Customer details confirmation (pre-filled for logged-in users)
- [ ] Step 5: Payment method selection (if required) and booking confirmation
- [ ] Real-time slot availability with no overbooking (pessimistic locking)
- [ ] Slot selection holds reservation for 10 minutes (configurable)
- [ ] Booking confirmation page with add-to-calendar options (ICS download, Google Calendar, Apple Calendar)
- [ ] SMS and email confirmations sent automatically
- [ ] Support for guest checkout with email/phone capture
- [ ] Cancellation policy displayed before final confirmation
- [ ] Booking modification allowed up to 24 hours before appointment (configurable per business)

---

### 4.8 Appointment Management
**Priority**: P0 (Critical)
**Status**: Required

#### Description
Comprehensive system for customers and businesses to view and manage appointments.

#### User Stories (Customer)
- As a customer, I want to view my upcoming and past appointments
- As a customer, I want to reschedule or cancel my appointments
- As a customer, I want to receive reminders before my appointment

#### User Stories (Business)
- As a business owner, I want to see all appointments in a calendar view
- As a business owner, I want to manage appointment status (confirm, complete, no-show)
- As a business owner, I want to block time slots for breaks or unavailability

#### Acceptance Criteria
- [ ] Customer dashboard: upcoming (next 7 days highlighted), past, cancelled tabs
- [ ] Appointment card shows: business name, service, staff, date/time, status, actions
- [ ] Reschedule: re-enters booking flow with current selection pre-filled
- [ ] Cancel: confirmation modal, reason capture (optional), immediate notification to business
- [ ] Business calendar: day/week/month views
- [ ] Business can create manual bookings (walk-ins, phone bookings)
- [ ] Status transitions: pending → confirmed → completed/cancelled/no-show
- [ ] Bulk actions supported (confirm multiple, export)
- [ ] Calendar sync: Google Calendar, Outlook two-way sync (optional, P2)

---

### 4.9 Favorites
**Priority**: P1 (High)
**Status**: Required

#### Description
Allow customers to save and quickly access preferred businesses.

#### User Stories
- As a customer, I want to favorite businesses for quick access
- As a customer, I want to receive notifications about my favorite businesses

#### Acceptance Criteria
- [ ] Heart icon toggle on business cards and detail pages
- [ ] Favorites list accessible from user profile
- [ ] Favorites persist across sessions (server-side storage)
- [ ] Maximum 200 favorites per user
- [ ] Option to receive promotional notifications from favorites (opt-in)
- [ ] Quick rebook from favorites list
- [ ] Share favorite business functionality

---

### 4.10 User Profile
**Priority**: P1 (High)
**Status**: Required

#### Description
Centralized user account management with personal information, preferences, and history.

#### User Stories
- As a user, I want to manage my personal information
- As a user, I want to view my booking history
- As a user, I want to manage notification preferences

#### Acceptance Criteria
- [ ] Profile photo upload (JPG/PNG, max 5MB, cropped to square)
- [ ] Editable fields: first name, last name, phone, email (with re-verification), birthday
- [ ] Password change with current password verification
- [ ] Booking history with search and filter (date range, business, status)
- [ ] Payment methods management (Stripe customer portal integration)
- [ ] Notification preferences: email, SMS, push (each toggleable for: bookings, reminders, promotions)
- [ ] Privacy settings: profile visibility, data download, account deletion
- [ ] Account deletion: 30-day grace period, data anonymization after

---

### 4.11 Availability & Slot Computation
**Priority**: P0 (Critical)
**Status**: Required

#### Description
Core engine for calculating and managing real-time availability across all businesses and providers.

#### User Stories
- As a business owner, I want to set my regular working hours
- As a business owner, I want to add exceptions for holidays or time off
- As a customer, I want to see only truly available slots

#### Acceptance Criteria
- [ ] Weekly recurring schedule: start time, end time, break times per day
- [ ] Multiple schedule patterns supported (e.g., split shifts)
- [ ] Exception dates: full-day closures or modified hours
- [ ] Slot duration derived from service duration or custom interval
- [ ] Buffer time between appointments (configurable per business, default 0)
- [ ] Concurrent booking limits per provider (default 1, configurable)
- [ ] Slot computation accounts for existing bookings, blocks, and breaks
- [ ] Performance: slot query responds in <200ms for 30-day range
- [ ] Caching: Redis with invalidation on booking/block changes
- [ ] Timezone handling: all times stored in UTC, displayed in business timezone

---

### 4.12 Shared Types & Design System
**Priority**: P1 (High)
**Status**: Required

#### Description
Consistent design language and reusable components across all platforms.

#### Acceptance Criteria
- [ ] Color palette: primary (#6C5CE7), secondary (#00B894), error (#FF7675), success (#00B894), warning (#FDCB6E)
- [ ] Typography: Inter for body, Playfair Display for headings
- [ ] Spacing scale: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
- [ ] Component library: Button, Input, Select, DatePicker, TimeSlot, Card, Modal, Toast
- [ ] Accessibility: WCAG 2.1 AA compliance, focus indicators, ARIA labels
- [ ] Dark mode support (P2)
- [ ] Shared TypeScript types between frontend and backend (monorepo)

---

### 4.13 Reviews & Ratings
**Priority**: P1 (High)
**Status**: Required

#### Description
Customer feedback system to build trust and help businesses improve.

#### User Stories
- As a customer, I want to leave reviews for businesses I've visited
- As a customer, I want to read honest reviews before booking
- As a business owner, I want to respond to reviews

#### Acceptance Criteria
- [ ] Review eligibility: verified customers only (completed appointment)
- [ ] Rating: 1-5 stars, overall + optional category ratings (service, cleanliness, value, atmosphere)
- [ ] Review content: text (10-2000 chars), optional photo upload (max 5, 5MB each)
- [ ] Review window: 7 days post-appointment to 90 days
- [ ] Business owner response: text, editable, flagged as "Business Owner"
- [ ] Review moderation: auto-approve with keyword flagging, admin appeal process
- [ ] Helpful/not helpful voting on reviews
- [ ] Sorting: most recent, most helpful, highest/lowest rating
- [ ] Average rating recalculated in real-time (or near-real-time with debounce)
- [ ] Review reminder: email 24 hours post-appointment

---

### 4.14 Payment Integration
**Priority**: P0 (Critical)
**Status**: Required

#### Description
Secure payment processing for appointment deposits, full payments, and in-app transactions.

#### User Stories
- As a customer, I want to pay securely for my appointments
- As a business owner, I want to receive payments to my account
- As a customer, I want to save payment methods for faster checkout

#### Acceptance Criteria
- [ ] Stripe integration for payment processing
- [ ] Payment methods: credit/debit cards, Apple Pay, Google Pay
- [ ] Payment types: full payment, deposit (percentage or fixed), pay at venue
- [ ] Payment intent created at booking confirmation, captured on completion or immediately based on settings
- [ ] Refund support: full and partial, with reason tracking
- [ ] Saved payment methods with Stripe Customer
- [ ] PCI compliance: never store raw card data, use Stripe Elements
- [ ] Receipt generation and email delivery
- [ ] Failed payment handling: retry logic, customer notification
- [ ] Payout scheduling to business accounts (weekly default, configurable)
- [ ] Platform fee deduction (configurable percentage)

---

### 4.15 Notifications
**Priority**: P1 (High)
**Status**: Required

#### Description
Multi-channel notification system for timely, relevant user communication.

#### Acceptance Criteria
- [ ] Channels: email (SendGrid/SES), SMS (Twilio), push (Firebase Cloud Messaging)
- [ ] Notification types:
  - Booking: confirmation, reminder (24h, 1h), modification, cancellation
  - Marketing: promotional offers, new businesses (opt-in only)
  - System: password reset, security alerts, policy updates
- [ ] User preference management per channel and type
- [ ] Notification templates with variable substitution
- [ ] Delivery tracking and failure handling with retries
- [ ] In-app notification center with read/unread status
- [ ] Quiet hours respect (configurable, default 22:00-08:00 local time)
- [ ] Unsubscribe compliance for marketing communications

---

### 4.16 Provider / Business Owner Portal
**Priority**: P0 (Critical)
**Status**: Required

#### Description
Dedicated interface for business owners and staff to manage their presence and operations.

#### User Stories
- As a business owner, I want to set up and customize my business profile
- As a business owner, I want to manage my services and pricing
- As a business owner, I want to control my availability and staff schedules

#### Acceptance Criteria
- [ ] Business profile setup wizard: basic info, location, hours, services, staff
- [ ] Dashboard: upcoming appointments, revenue summary, new reviews, quick actions
- [ ] Service management: CRUD operations, pricing, duration, category assignment, staff association
- [ ] Staff management: invite via email, role assignment (owner, manager, staff), schedule assignment
- [ ] Availability management: regular hours, exceptions, time off requests
- [ ] Booking settings: cancellation policy, buffer time, online booking toggle
- [ ] Client management: client list, visit history, notes (internal), marketing consent
- [ ] Analytics: appointment volume, revenue, cancellation rate, new vs. returning clients (P2)
- [ ] Multi-location support for chains (P2)

---

### 4.17 Admin Dashboard
**Priority**: P1 (High)
**Status**: Required

#### Description
Platform administration interface for managing users, businesses, and platform health.

#### Acceptance Criteria
- [ ] User management: search, view, suspend, impersonate (with audit log)
- [ ] Business management: approve new registrations, verify documents, feature/unfeature
- [ ] Content moderation: review flagged content, handle appeals
- [ ] Financial oversight: transaction monitoring, refund approval, payout management
- [ ] Analytics: platform KPIs, growth metrics, churn analysis
- [ ] System settings: platform fees, notification templates, maintenance mode
- [ ] Role-based access: super admin, support agent, finance, content moderator
- [ ] Audit logging: all admin actions with timestamp and admin identity

---

### 4.18 Background Jobs (BullMQ)
**Priority**: P1 (High)
**Status**: Required

#### Description
Robust job queue system for handling asynchronous tasks reliably.

#### Acceptance Criteria
- [ ] Job types and priorities:
  - **High**: Payment processing, booking confirmations
  - **Medium**: Email/SMS notifications, search index updates
  - **Low**: Analytics aggregation, data exports, cleanup tasks
- [ ] Retry policy: 3 attempts with exponential backoff (5s, 25s, 125s)
- [ ] Dead letter queue for failed jobs after retries exhausted
- [ ] Job monitoring: dashboard with queue depths, processing rates, failures
- [ ] Scheduled jobs: daily reports, nightly cleanup, reminder batches
- [ ] Job idempotency keys to prevent duplicate processing
- [ ] Concurrency control per queue type
- [ ] Graceful shutdown: finish in-progress jobs before process exit

---

## 5. Non-Functional Requirements

### Performance
- Page load time < 2s (95th percentile)
- API response time < 200ms for 95% of requests
- Support 10,000 concurrent users

### Security
- OWASP Top 10 compliance
- GDPR and CCPA data handling
- Regular security audits
- Penetration testing annually

### Scalability
- Horizontal scaling support
- Database read replicas for reporting queries
- CDN for static assets and images

### Reliability
- 99.9% uptime SLA
- Automated backups (daily full, continuous incremental)
- Disaster recovery plan with RPO < 1 hour, RTO < 4 hours

---

## 6. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Monthly Active Users (MAU) | 50,000 by month 6 | Analytics |
| Booking Conversion Rate | >15% | Bookings / Sessions |
| Customer Retention (30d) | >40% | Cohort analysis |
| Business NPS | >50 | Survey |
| Platform Uptime | 99.9% | Monitoring |
| Average Booking Time | <3 minutes | Analytics |

---

## 7. Release Plan

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Business Detail, Booking Flow, Availability, Basic Provider Portal | Month 1-2 |
| **V1.1** | Map Search, Favorites, Reviews, Notifications, Payment | Month 3 |
| **V1.2** | Advanced Provider Portal, Admin Dashboard, Background Jobs | Month 4 |
| **V2.0** | Mobile Apps, Advanced Analytics, Marketing Tools | Month 6 |

---

## 8. Open Questions

1. Internationalization requirements and initial language support
2. Integration with specific POS systems for businesses
3. Loyalty/rewards program scope and timeline
4. Subscription/membership model for businesses

---

*This document is a living specification. All changes require Product Owner approval and stakeholder notification.*
