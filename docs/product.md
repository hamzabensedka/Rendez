# Planity Clone — Product Specification

## 1. User Authentication

### Description
Enable users to create accounts, log in, and manage their identity securely across the platform.

### User Stories
- As a user, I want to sign up with email/password so I can create a personalized account
- As a user, I want to log in with email/password or social providers so I can access my data
- As a user, I want to reset my password so I can regain access if I forget it
- As a user, I want to stay logged in via secure tokens so I don't have to log in repeatedly

### Acceptance Criteria
- [ ] Users can register with email, password, first name, last name, and phone number
- [ ] Password must be minimum 8 characters with at least one uppercase, one lowercase, and one number
- [ ] Email verification required before account activation
- [ ] Users can log in with email/password combination
- [ ] OAuth 2.0 integration for Google and Apple sign-in
- [ ] JWT access tokens (15-min expiry) with refresh tokens (7-day expiry)
- [ ] Password reset via secure email link (1-hour expiry)
- [ ] Rate limiting: 5 failed attempts triggers 15-minute lockout
- [ ] Account deletion option with 30-day grace period and data export

### Priority
**P0 — Critical**

---

## 2. Guest Browse & Explore

### Description
Allow unauthenticated users to browse businesses, services, and explore the platform before committing to account creation.

### User Stories
- As a visitor, I want to browse businesses without creating an account so I can evaluate the platform
- As a visitor, I want to see business details and services so I can make informed decisions
- As a visitor, I want to be prompted to sign up when I attempt to book so the conversion funnel is smooth

### Acceptance Criteria
- [ ] Homepage with featured businesses, categories, and promotions visible to all visitors
- [ ] Business search, filter, and detail views accessible without authentication
- [ ] Service listings and pricing visible to guests
- [ ] "Sign up to book" CTA replaces booking button for unauthenticated users
- [ ] Guest session data (search history, viewed businesses) persisted for 7 days via localStorage; merged upon account creation
- [ ] No access to: favorites, appointments, profile management, reviews, or payments
- [ ] Seamless account creation flow preserving guest browsing context

### Priority
**P0 — Critical**

---

## 3. Business Search & Discovery

### Description
Enable users to find businesses through multiple discovery paths with intelligent filtering and sorting.

### User Stories
- As a user, I want to search by business name, service, or location so I can find what I need
- As a user, I want to filter by criteria so I can narrow results to relevant options
- As a user, I want results sorted by relevance, rating, distance, or price so I can find the best match

### Acceptance Criteria
- [ ] Full-text search across business name, service names, description, and address
- [ ] Filters: category, subcategory, price range, rating (minimum stars), distance radius, availability (today/this week), amenities
- [ ] Sorting options: relevance (default), highest rated, most reviewed, nearest, price (low to high)
- [ ] Results display: business card with image, name, rating, address snippet, starting price, next available slot
- [ ] Pagination with 20 results per page, infinite scroll on mobile
- [ ] Search query debounced at 300ms; results returned in <500ms
- [ ] Empty state with category suggestions and popular businesses
- [ ] Recent searches stored (5 max) for quick re-access
- [ ] Search history stored for authenticated users, localStorage for guests

### Priority
**P0 — Critical**

---

## 4. Map-based Search

### Description
Visualize business locations on an interactive map with clustering and geospatial exploration.

### User Stories
- As a user, I want to see businesses on a map so I can choose by location
- As a user, I want the map to update as I move/pan so I can explore any area
- As a user, I want to see my current location so I can find nearby businesses

### Acceptance Criteria
- [ ] Interactive map (Google Maps or Mapbox) with business markers
- [ ] Marker clustering for dense areas (zoom-dependent)
- [ ] User geolocation with permission prompt; fallback to IP-based city center
- [ ] Map bounds trigger dynamic result updates
- [ ] Business cards appear on marker tap/click with quick info
- [ ] Toggle between map view and list view
- [ ] Map remembers last viewed position and zoom level per session
- [ ] Accessibility: screen reader compatible, keyboard navigable markers

### Priority
**P0 — Critical**

---

## 5. Business Detail View

### Description
Comprehensive business profile showcasing all information needed for user decision-making.

### User Stories
- As a user, I want to see business details so I can evaluate if it meets my needs
- As a user, I want to view services and pricing so I can plan my visit
- As a user, I want to see availability so I can decide when to book

### Acceptance Criteria
- [ ] Header: business name, category, average rating, review count, favorite toggle
- [ ] Image gallery: minimum 1 image, maximum 20; carousel with thumbnail navigation
- [ ] Description, hours of operation, contact info, address with directions link
- [ ] Service catalog: grouped by category, each with name, duration, description, price
- [ ] Real-time availability widget showing next 3 available slots
- [ ] Staff/professional profiles with photos, bio, and specialty services
- [ ] Amenities and business policies (cancellation, late arrival, COVID protocols)
- [ ] Embed map with location pin
- [ ] "Book Now" CTA sticky on mobile, prominent on desktop

### Priority
**P0 — Critical**

---

## 6. Service Categories

### Description
Hierarchical categorization system organizing all services for discoverability and business management.

### User Stories
- As a user, I want to browse by category so I can discover businesses by service type
- As a business owner, I want to categorize my services so customers can find them

### Acceptance Criteria
- [ ] Hierarchical structure: Category → Subcategory → Service
- [ ] Predefined categories: Hair, Beauty & Spa, Wellness, Health & Fitness, Medical Aesthetics, Tattoo & Piercing, Pet Grooming, Automotive (expandable)
- [ ] Each category has icon, description, and featured image
- [ ] Services tagged with single primary category, optional subcategory
- [ ] Category pages with SEO-optimized content, featured businesses, popular services
- [ ] Admin interface for category CRUD with image upload
- [ ] Category reassignment tool for migrating services

### Priority
**P1 — High**

---

## 7. Booking Flow

### Description
Streamlined multi-step reservation process converting interest into confirmed appointments.

### User Stories
- As a user, I want to book an appointment easily so I can secure my preferred time
- As a user, I want to select my preferred professional so I can see someone I trust
- As a user, I want to receive confirmation so I know my booking is secured

### Acceptance Criteria
- [ ] Step 1: Service selection (or pre-selected from business detail)
- [ ] Step 2: Professional selection (optional — "no preference" available) or resource selection
- [ ] Step 3: Date and time slot selection with live availability
- [ ] Step 4: Review booking summary with all details
- [ ] Step 5: Payment (if required) or confirm (if free/pay at venue)
- [ ] Slot selection enforces service duration, professional availability, and buffer times
- [ ] Concurrent booking prevention via optimistic locking; 5-minute hold during checkout
- [ ] Booking confirmation with calendar invite (iCal), email, and in-app notification
- [ ] Guest checkout supported with email and phone capture
- [ ] Rescheduling and cancellation within business policy (configurable: free up to X hours before)

### Priority
**P0 — Critical**

---

## 8. Appointment Management

### Description
Centralized interface for users to view, manage, and track all their appointments.

### User Stories
- As a user, I want to see all my appointments so I can plan my schedule
- As a user, I want to reschedule or cancel so I can adapt to changes
- As a user, I want to rebook a past service so I can easily repeat bookings

### Acceptance Criteria
- [ ] List view: upcoming and past appointments, filterable by status
- [ ] Appointment card: business, service, date/time, professional, status, actions
- [ ] Statuses: pending confirmation, confirmed, checked-in, in-progress, completed, cancelled, no-show
- [ ] Reschedule: select new slot with same rules as booking flow; notify business and update calendar
- [ ] Cancel: with reason selection, policy enforcement, refund handling if applicable
- [ ] Rebook: one-tap rebooking of past services
- [ ] Add to personal calendar (Google, Apple, Outlook) from confirmation or appointment detail
- [ ] Push notification reminders: 24 hours and 1 hour before appointment
- [ ] Empty states for no upcoming and no past appointments

### Priority
**P0 — Critical**

---

## 9. Favorites

### Description
Allow users to save and organize preferred businesses for quick future access.

### User Stories
- As a user, I want to favorite businesses so I can quickly find them again
- As a user, I want to view my favorites in one place so I don't have to search repeatedly

### Acceptance Criteria
- [ ] Heart/toggle icon on business cards and detail views; instant feedback on tap
- [ ] Favorites list accessible from main navigation
- [ ] Favorites displayed as cards with key info: image, name, address, next availability
- [ ] Swipe-to-remove (mobile) or button to unfavorite
- [ ] Sort favorites by: recently added, name, distance, last visited
- [ ] Sync across devices for authenticated users
- [ ] Recommended businesses section based on favorite categories
- [ ] Guest favorites: prompt to sign up to persist; otherwise localStorage with merge on signup

### Priority
**P1 — High**

---

## 10. User Profile

### Description
Personal account management with preference settings and activity history.

### User Stories
- As a user, I want to manage my profile so my information is accurate
- As a user, I want to set my preferences so the app works how I want
- As a user, I want to see my activity history so I can track my engagement

### Acceptance Criteria
- [ ] Editable fields: first name, last name, email, phone, profile photo, date of birth
- [ ] Change password with current password verification
- [ ] Notification preferences: email, push, SMS — toggle per type (bookings, promotions, reminders)
- [ ] Privacy settings: profile visibility, data sharing opt-outs
- [ ] Connected accounts: view and disconnect social logins
- [ ] Stats: total bookings, favorite categories, member since
- [ ] Saved payment methods (managed via PCI-compliant processor, tokens only)
- [ ] Data export and account deletion (GDPR/CCPA compliant)

### Priority
**P1 — High**

---

## 11. Availability & Slot Computation

### Description
Core scheduling engine computing real-time bookable slots based on complex business rules.

### User Stories
- As a user, I want to see accurate available slots so I can book with confidence
- As a business owner, I want my availability to reflect my actual schedule so I don't get overbooked

### Acceptance Criteria
- [ ] Business-defined working hours per day (can vary daily)
- [ ] Break and blocked time management (lunch, meetings, personal time)
- [ ] Professional-specific schedules with override capability
- [ ] Service duration + buffer time considered in slot computation
- [ ] Conflict prevention: existing bookings, tentative holds, synced external calendars
- [ ] Slot granularity: 15, 30, or 60-minute increments (business configurable)
- [ ] Advance booking window: minimum (e.g., 2 hours before) and maximum (e.g., 3 months ahead)
- [ ] Same-day availability with cutoff times
- [ ] Recurring availability patterns with exception handling
- [ ] Performance: slot generation for 90 days returned in <200ms
- [ ] Real-time updates via WebSocket when slots are booked or released

### Priority
**P0 — Critical**

---

## 12. Shared Types & Design System

### Description
Unified visual language and type system ensuring consistent, accessible, and maintainable UI/UX across all platforms.

### User Stories
- As a developer, I want reusable components so I can build features quickly
- As a user, I want consistent interactions so the app feels predictable and polished

### Acceptance Criteria
- [ ] Design tokens: colors (primary, secondary, semantic states), typography scale, spacing scale, border radius, shadows, z-index layers
- [ ] Component library: buttons, inputs, cards, modals, date pickers, time selectors, loading states, empty states, error states
- [ ] TypeScript shared types: User, Business, Service, Appointment, Slot, Payment, Notification, Review — with strict null-safety
- [ ] Color contrast ratio minimum 4.5:1 for text; focus indicators visible
- [ ] Screen reader support with ARIA labels and live regions for dynamic content
- [ ] Touch targets minimum 44x44dp on mobile
- [ ] Dark mode support with complete palette
- [ ] Animation guidelines: transitions 150-300ms, purposeful motion only
- [ ] Icon set: consistent line-weight, semantic naming
- [ ] Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)

### Priority
**P0 — Critical (Infrastructure)**

---

## 13. Reviews & Ratings

### Description
Social proof system enabling customers to share experiences and help others make informed decisions.

### User Stories
- As a user, I want to read reviews so I can evaluate business quality
- As a user, I want to write a review so I can share my experience
- As a business owner, I want to respond to reviews so I can engage with feedback

### Acceptance Criteria
- [ ] Review eligibility: verified customers who completed the service (configurable)
- [ ] Rating: 1-5 stars with optional detailed review (10-500 characters)
- [ ] Review composition: rating, text, visit date, service name, anonymous option
- [ ] Review display: sorted by relevance (default), most recent, highest/lowest rating
- [ ] Aggregate ratings: overall average, distribution histogram, per-service rating if applicable
- [ ] Business owner reply with notification to reviewer
- [ ] Flag inappropriate reviews; admin moderation queue
- [ ] Review editing window: 7 days after posting; deletion by user or admin
- [ ] "Helpful" voting on reviews with abuse prevention
- [ ] Reviews on business cards (average rating + count) and detail page (full reviews)

### Priority
**P1 — High**

---

## 14. Payment Integration

### Description
Secure, flexible payment processing supporting multiple methods and business models.

### User Stories
- As a user, I want to pay securely so I can confirm my booking
- As a business owner, I want to receive payments so I can operate effectively
- As a user, I want the option to pay at the venue so I have flexibility

### Acceptance Criteria
- [ ] Payment methods: credit/debit cards, Apple Pay, Google Pay, PayPal
- [ ] Integration with Stripe and/or Adyen for processing
- [ ] Payment models: full prepayment, deposit (percentage or fixed), pay at venue
- [ ] Secure card storage via tokenization (PCI DSS compliance — never store raw card data)
- [ ] 3D Secure support for card authentication
- [ ] Refund processing with automated calculation based on policy and timing
- [ ] Payment confirmation and receipt via email
- [ ] Failed payment handling with retry logic and user notification
- [ ] Split payments (future): platform fee and business payout
- [ ] Financial reporting: transaction history, payouts, disputes

### Priority
**P1 — High**

---

## 15. Notifications

### Description
Multi-channel communication system keeping users informed at every stage.

### User Stories
- As a user, I want timely notifications so I don't miss my appointments
- As a user, I want to control what I receive so I'm not overwhelmed

### Acceptance Criteria
- [ ] Channels: push (mobile), email, SMS — prioritized per urgency and user preference
- [ ] Notification types: booking confirmation, reminder (24h, 1h), modification, cancellation, promotional, review request
- [ ] Rich push with deep links to relevant screens
- [ ] Preference management: opt-in/opt-out per channel and category
- [ ] Delivery tracking: sent, delivered, opened, failed; retry for failed deliveries
- [ ] Template system with variable substitution and localization support
- [ ] Unsubscribe handling with immediate effect
- [ ] Notification history in-app for 90 days
- [ ] Rate limiting: maximum 3 promotional notifications per week per user

### Priority
**P1 — High**

---

## 16. Provider / Business Owner Portal

### Description
Dedicated interface for businesses to manage their presence, services, availability, and appointments.

### User Stories
- As a business owner, I want to manage my business profile so customers see accurate information
- As a business owner, I want to control my schedule so I don't get overbooked
- As a business owner, I want to view and manage appointments so I can operate smoothly

### Acceptance Criteria
- [ ] Business profile: edit name, description, contact, hours, photos (up to 20), amenities, policies
- [ ] Service management: CRUD services with name, description, duration, price, category, assigned professionals
- [ ] Availability configuration: standard weekly schedule, breaks, time off, exceptions
- [ ] Appointment calendar: daily, weekly, monthly views; filter by professional or resource
- [ ] Appointment actions: confirm, check-in, mark complete, no-show, reschedule, cancel with reason
- [ ] Staff management: add professionals, set their services, schedules, and permissions
- [ ] Customer notes and visit history linked to appointments
- [ ] Basic analytics: occupancy rate, popular services, booking volume, revenue (if payments enabled)
- [ ] Mobile-responsive design for on-the-go management

### Priority
**P0 — Critical**

---

## 17. Admin Dashboard

### Description
Platform administration tool for managing users, businesses, content, and system health.

### User Stories
- As an admin, I want to oversee platform activity so I can ensure quality and compliance
- As an admin, I want to manage businesses so I can onboard and support them

### Acceptance Criteria
- [ ] Overview metrics: daily/weekly/monthly active users, bookings, new registrations, revenue
- [ ] Business management: approve/reject new registrations, edit, suspend, feature/promote
- [ ] User management: search, view, suspend, impersonate (with audit log)
- [ ] Content moderation: review flagged reviews, business images, descriptions
- [ ] Category and configuration management
- [ ] Financial oversight: transaction monitoring, dispute handling, payout management
- [ ] System health: queue status, error rates, API performance metrics
- [ ] Audit logging: all admin actions timestamped and attributed
- [ ] Role-based access: super admin, support staff, finance, read-only analyst

### Priority
**P2 — Medium** (initially), **P1** after core launch

---

## 18. Background Jobs (BullMQ)

### Description
Asynchronous job processing for reliability, performance, and scalability of non-time-critical operations.

### User Stories
- As a developer, I want reliable job processing so features work even under load
- As a user, I want timely notifications and confirmations without waiting for synchronous processing

### Acceptance Criteria
- [ ] Job types and queues: email delivery, push notification dispatch, SMS sending, payment processing, calendar sync, data exports, analytics aggregation, image optimization, search index updates
- [ ] BullMQ implementation with Redis for queue storage
- [ ] Job priorities: critical (payment processing), high (confirmation emails), normal (notifications), low (analytics)
- [ ] Retry policy: exponential backoff (delay 1s, 2s, 4s, 8s, 16s), max 5 attempts then dead letter queue
- [ ] Stalled job detection and recovery
- [ ] Job progress tracking for long-running tasks (exports, bulk operations)
- [ ] Scheduled jobs via cron patterns (e.g., daily analytics rollup at 2 AM)
- [ ] Monitoring: queue depth, processing rate, failed jobs, average wait time
- [ ] Graceful shutdown: complete in-progress jobs before process termination
- [ ] Idempotency keys to prevent duplicate processing

### Priority
**P0 — Critical (Infrastructure)**

---

## Appendix A: Technical Dependencies
- React Native / Flutter for mobile; React for web
- Node.js backend with TypeScript
- PostgreSQL primary database; Redis for caching and queues
- BullMQ for job processing
- Stripe/Adyen for payments
- Firebase/APNs for push notifications
- Google Maps / Mapbox for mapping

## Appendix B: Definition of Done
- Feature implemented per specification
- Unit tests >80% coverage; integration tests for critical paths
- Accessibility audit passed (WCAG 2.1 AA)
- Performance benchmarks met (API <200ms p95, page load <2s)
- Code reviewed and approved
- QA sign-off on acceptance criteria
- Documentation updated
- Monitoring and alerting configured

## Appendix C: Release Phases
- **MVP (Weeks 1-8)**: User Authentication, Guest Browse, Business Search & Discovery, Map Search, Business Detail, Booking Flow, Appointment Management, Availability Engine, Provider Portal
- **Phase 2 (Weeks 9-14)**: Favorites, User Profile, Reviews & Ratings, Payment Integration, Notifications
- **Phase 3 (Weeks 15-20)**: Admin Dashboard, Advanced Analytics, Background Jobs refinement, Marketing tools
