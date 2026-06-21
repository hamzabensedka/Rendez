# Product Specification: Planity Clone

## 1. Introduction & Vision
Planity Clone is a comprehensive booking platform connecting clients with beauty and wellness professionals. The platform enables seamless discovery, booking, and management of appointments while providing business owners with powerful tools to manage their operations. The primary goal is to simplify the booking experience for clients and streamline business operations for providers.

## 2. Target Users
- **Clients:** Individuals seeking beauty/wellness services (haircuts, massages, facials, etc.)
- **Providers/Business Owners:** Salons, spas, barbershops, freelance professionals
- **Administrators:** Platform managers overseeing operations, quality, and financials

## 3. Design System & Shared Types
**Priority: P0 (Foundation)**
All components shall adhere to a unified design system ensuring consistency across mobile and web.

### 3.1 Shared Types
- **User:** `{ id, email, role (CLIENT | PROVIDER | ADMIN), firstName, lastName, phone, avatar, createdAt }`
- **Business:** `{ id, ownerId, name, description, address { street, city, zip, lat, lng }, phone, photos[], categories[], rating, reviewCount, isVerified }`
- **Service:** `{ id, businessId, name, description, duration, price, categoryId, isActive }`
- **Appointment:** `{ id, clientId, businessId, serviceId, staffId, startTime, endTime, status (PENDING | CONFIRMED | COMPLETED | CANCELLED | NO_SHOW), price, notes }`
- **Review:** `{ id, clientId, businessId, appointmentId, rating, comment, createdAt }`
- **Staff:** `{ id, businessId, name, title, avatar, specialties[], schedule{} }`
- **Category:** `{ id, name, icon, parentId }`

### 3.2 Design Tokens
- **Colors:** Primary (#FF6B6B), Secondary (#4ECDC4), Neutral grays, Success/Error states
- **Typography:** Font family (Inter), Scale (12/14/16/18/24/32px), Weights (400/500/600/700)
- **Spacing:** 4px grid system (4/8/12/16/24/32/48/64)
- **Shadows & Radius:** 4px/8px/16px radius; Light/Medium shadows for elevation
- **Components:** Standardized buttons, inputs, cards, modals, avatars, rating stars

### 3.3 Acceptance Criteria
- [ ] All UI components use shared tokens from a central theme file
- [ ] All API responses and database schemas follow shared type definitions
- [ ] Mobile and web experiences feel visually and functionally coherent

## 4. User Authentication
**Priority: P0**
Secure authentication system supporting multiple roles.

### 4.1 Features
- **Registration:** Email/password signup with role selection (Client/Provider)
- **Login:** Email/password, biometric login (mobile), social login (Google, Apple)
- **Password Recovery:** Email-based reset flow with time-limited tokens
- **Email Verification:** Required for Providers; optional but encouraged for Clients
- **Session Management:** JWT tokens with refresh token rotation; force logout capability
- **Onboarding:** Role-specific onboarding flows (Client: preferences; Provider: business setup)

### 4.2 Acceptance Criteria
- [ ] Client can register, verify email, and complete onboarding in under 2 minutes
- [ ] Provider must verify email before accessing business portal
- [ ] Invalid login attempts lock account temporarily after 5 failures
- [ ] Password reset tokens expire after 30 minutes
- [ ] JWT expires after 1 hour; refresh tokens valid for 30 days
- [ ] Social login creates account if email doesn't exist, links if it does

## 5. Guest Browse & Explore
**Priority: P1**
Allow unauthenticated users to explore the platform, driving conversion.

### 5.1 Features
- Browse businesses, services, and reviews without login
- Search and filter functionality fully available
- View business details, photos, and service menus
- Attempting to book prompts registration/login
- View-only map search

### 5.2 Acceptance Criteria
- [ ] Guest can access all browse/search features without authentication
- [ ] "Book Now" button triggers login/register modal with return-to-booking flow
- [ ] Guest search history is not persisted
- [ ] All guest actions tracked anonymously for analytics

## 6. Business Search & Discovery
**Priority: P1**
Powerful search enabling clients to find the right provider quickly.

### 6.1 Features
- **Text Search:** Full-text search across business name, description, services, location
- **Filters:** Category, price range, rating, availability (date/time), distance, features (parking, wifi)
- **Sorting:** Relevance, rating, distance, price (low/high), popularity
- **Suggestions:** Autocomplete and recent searches (authenticated users)
- **Results Display:** Card view with business image, name, rating, distance, price indicator, next available slot

### 6.2 Acceptance Criteria
- [ ] Search returns results in under 300ms
- [ ] Autocomplete suggests after 3 characters
- [ ] Filters update results instantly (debounced 300ms)
- [ ] Results show distance from user location (if permitted) or searched location
- [ ] Empty states with helpful suggestions
- [ ] Results are paginated (20 per page, infinite scroll)

## 7. Map-based Search
**Priority: P2**
Geographic discovery of businesses.

### 7.1 Features
- Interactive map with business location pins
- Clustering for dense areas
- Tap pin to preview business card; tap card for full detail
- "Search this area" button as map is panned
- List/Map toggle view
- Geolocation to center map on user

### 7.2 Acceptance Criteria
- [ ] Map loads with pins for visible area (lazy load)
- [ ] Pins cluster when zoomed out; uncluster on zoom in
- [ ] Business preview card shows name, rating, price level, and distance
- [ ] Map/list toggle preserves search context
- [ ] Works seamlessly with search filters

## 8. Business Detail View
**Priority: P1**
Comprehensive business profile driving booking decisions.

### 8.1 Features
- Photo gallery with full-screen viewer
- Business info: name, address, phone, hours, description, amenities
- Service menu with prices and durations
- Staff profiles with bios and photos
- Reviews & ratings section with summary
- Prominent "Book" CTA (floating button)
- Map showing location
- Share button

### 8.2 Acceptance Criteria
- [ ] All information renders correctly from API
- [ ] Photo gallery supports swipe gestures (mobile) and arrows (desktop)
- [ ] Service selection leads directly to booking flow
- [ ] Reviews load progressively (10 at a time, "Show More")
- [ ] Operating hours show current open/closed status
- [ ] Page loads in under 2 seconds on 4G

## 9. Service Categories
**Priority: P1**
Organized service hierarchy for easy browsing.

### 9.1 Features
- **Hierarchy:** Main categories (Hair, Nails, Massage, Face, Body, Wellness) with subcategories
- **Browse:** Visual category tiles with icons on home screen
- **Category Page:** Subcategories, top businesses, popular services
- **Deep Linking:** Categories linkable and shareable
- **Admin Management:** CRUD for categories and subcategories

### 9.2 Acceptance Criteria
- [ ] Category tiles display on home screen (top 6-8 main categories)
- [ ] Subcategory page shows relevant businesses and popular services
- [ ] Service creation must assign to at least one category
- [ ] Categories are orderable by admin
- [ ] Tapping a category starts search with that category filter applied

## 10. Booking Flow
**Priority: P0 (Core Feature)**
Smooth, intuitive booking experience minimizing abandonment.

### 10.1 Features
- **Step 1 - Service Selection:** Choose service(s) from business menu; view details, duration, price
- **Step 2 - Staff Selection:** Choose specific staff or "Any Available"; view staff profiles
- **Step 3 - Date & Time:** Calendar view with available slots highlighted; time picker
- **Step 4 - Details:** Add notes, promo code field
- **Step 5 - Review & Pay:** Summary of booking, price breakdown, payment method selection, confirm
- **Progress Indicator:** Clear step visualization
- **Persistence:** State saved for 30 minutes; user can resume later

### 10.2 Acceptance Criteria
- [ ] Flow completes in 5 steps maximum
- [ ] Available slots are accurate and real-time (no double bookings)
- [ ] Invalid or expired slots show clear error and redirect to re-select
- [ ] Booking state persists in session storage
- [ ] Confirmation screen shows booking reference and option to add to calendar
- [ ] Abandoned bookings trigger reminder notification after 15 minutes
- [ ] Clear back navigation at each step without data loss

## 11. Appointment Management
**Priority: P0**
Clients and providers manage their appointments.

### 11.1 Features
- **Client View:** Upcoming, past, cancelled appointments; status indicators
- **Actions:** Reschedule, cancel (with policy check), rebook, add to calendar
- **Provider View:** Daily/weekly calendar; client list; check-in/check-out
- **Status Updates:** Confirm, start, complete, no-show, cancel with reason
- **Details:** Appointment info, client info, service details, notes, history
- **Cancellation Policy:** Enforce time-based rules (e.g., free cancel 24h+ before)

### 11.2 Acceptance Criteria
- [ ] Clients see upcoming appointments sorted by date
- [ ] Cancellation within policy window triggers refund/no-charge as per rules
- [ ] Providers see color-coded calendar by service type
- [ ] Appointment status changes log with timestamps
- [ ] Push notifications for status changes (configurable)
- [ ] Past appointments remain accessible for 12 months

## 12. Availability & Slot Computation
**Priority: P0 (Critical Backend)**
Core engine ensuring accurate, conflict-free booking slots.

### 12.1 Features
- **Staff Schedule:** Working hours, break times, days off, exceptions
- **Business Hours:** Operating hours as base; staff schedules override
- **Slot Generation:** Slots computed based on service duration + buffer time
- **Conflict Prevention:** Real-time check before booking confirmation
- **Booking Windows:** Minimum advance (1 hour) and maximum advance (90 days)
- **Concurrent Bookings:** Staff can handle multiple clients if business allows
- **Optimization:** Cache hot date ranges; recompute on schedule changes

### 12.2 Acceptance Criteria
- [ ] Slot computation is accurate to the minute
- [ ] No double bookings possible under any race condition (database locks)
- [ ] Buffer time between appointments is configurable per business (5/10/15 min)
- [ ] Blocked time (breaks, days off) never appears as available
- [ ] Slot cache invalidates when staff schedule, business hours, or bookings change
- [ ] Computed slots consider travel time for mobile services (future)

## 13. Favorites
**Priority: P2**
Allow clients to save preferred businesses.

### 13.1 Features
- Save/unsave business from detail view or search results
- Dedicated Favorites list in user profile
- Sort favorites by name, recently added, rating
- Visual indicator (heart) on business cards
- Notification when favorited business has promotions

### 13.2 Acceptance Criteria
- [ ] Heart icon toggles favorite state with optimistic UI update
- [ ] Favorites sync across devices (authenticated)
- [ ] Favorites list shows business card with next available slot
- [ ] Removing from favorites requires confirmation swipe or undo toast
- [ ] Maximum 200 favorites per user

## 14. User Profile
**Priority: P1**
Central hub for client account management.

### 14.1 Features
- **Personal Info:** Name, email, phone, profile photo, preferences
- **Booking History:** All past and upcoming appointments
- **Favorites:** Quick access to favorite businesses
- **Payment Methods:** Saved cards, add/remove, set default
- **Notification Settings:** Email, push, SMS toggles per notification type
- **Settings:** Language, theme (light/dark), delete account
- **Provider Switch:** Option to become a provider (business setup flow)

### 14.2 Acceptance Criteria
- [ ] All fields editable with proper validation
- [ ] Email change requires re-verification
- [ ] Delete account soft-deletes data; confirmation required
- [ ] Payment method CRUD with PCI-compliant tokenization
- [ ] Settings changes sync in real-time

## 15. Reviews & Ratings
**Priority: P1**
Build trust through transparent feedback.

### 15.1 Features
- **Write Review:** Only after completed appointment; rating 1-5 stars; text review; optional photo
- **Display:** Business profile shows average rating, distribution, and review list
- **Provider Response:** Public reply to reviews
- **Moderation:** Automated profanity filter; manual review for flagged content
- **Sorting:** Most recent, highest rated, lowest rated
- **Helpfulness:** Upvote/downvote reviews

### 15.2 Acceptance Criteria
- [ ] Review can only be submitted within 30 days of completed appointment
- [ ] One review per appointment
- [ ] Rating updates business average within 60 seconds
- [ ] Profanity filter catches common abusive terms
- [ ] Provider replies marked clearly as "Business Response"
- [ ] Reviews display client first name and last initial only

## 16. Payment Integration
**Priority: P0**
Secure, flexible payment processing.

### 16.1 Features
- **Payment Methods:** Credit/debit cards, digital wallets (Apple Pay, Google Pay)
- **Payment Flow:** Capture at booking; hold funds until service (auth & capture)
- **Pricing:** Service price + platform fee + tax (as applicable)
- **Refunds:** Full/partial refund capability for cancellations
- **Payouts:** Providers receive earnings minus platform commission on schedule
- **Receipts:** Auto-generated and emailed after payment
- **Security:** PCI-DSS Level 1 compliance via Stripe

### 16.2 Acceptance Criteria
- [ ] Payment completes in under 10 seconds
- [ ] Failed payments show clear error and allow retry
- [ ] Auth & capture flow: authorize at booking, capture on completion
- [ ] Refunds process within 5 business days; status visible in app
- [ ] Provider earnings show pending/available/paid breakdown
- [ ] All payment data tokenized; no raw card data stored
- [ ] Receipt includes service breakdown, taxes, fees, and booking reference

## 17. Notifications
**Priority: P1**
Timely, relevant communications across channels.

### 17.1 Features
- **Push Notifications:** Booking confirmations, reminders, status changes, promotions
- **Email:** Receipts, booking confirmations, newsletters, re-engagement
- **In-App:** Notification center with read/unread; actionable notifications
- **Triggers:** Booking created/updated/cancelled, reminder 24h/1h before, review request after service, provider message
- **Preferences:** Granular opt-in/out per channel and notification type

### 17.2 Acceptance Criteria
- [ ] Push notifications delivered within 10 seconds of trigger
- [ ] Reminder notifications include appointment details and map link
- [ ] In-app notification center loads recent 50 notifications; paginated history
- [ ] Opt-out preferences respected immediately across all channels
- [ ] Notification delivery failures logged and retried up to 3 times

## 18. Provider / Business Owner Portal
**Priority: P1**
Comprehensive tools for providers to manage their business.

### 18.1 Features
- **Dashboard:** Today's appointments, revenue summary, upcoming bookings
- **Calendar:** Day/Week view; drag-to-reschedule; block time off
- **Client Management:** Client list, appointment history, notes
- **Service Management:** CRUD services; reorder; activate/deactivate
- **Staff Management:** Invite staff; set schedules, roles, and service assignments
- **Business Profile:** Edit info, hours, photos, amenities
- **Reports:** Revenue, bookings, popular services, client retention (basic)
- **Notifications:** Booking alerts, review alerts, payment updates

### 18.2 Acceptance Criteria
- [ ] Dashboard loads with today's data in under 1 second
- [ ] Calendar supports drag-and-drop rescheduling with conflict check
- [ ] Staff invitations send email with secure setup link
- [ ] Service changes reflect immediately in client-facing views
- [ ] Reports can be filtered by date range and exported as CSV
- [ ] Provider portal is mobile-responsive

## 19. Admin Dashboard
**Priority: P2**
Platform oversight and management.

### 19.1 Features
- **User Management:** List, search, suspend, verify users and providers
- **Business Management:** Approve/reject business profiles; feature listings
- **Content Moderation:** Review flagged reviews and photos
- **Category Management:** CRUD service categories; manage hierarchy
- **Financial Overview:** Platform revenue, payouts, commissions, disputes
- **Analytics:** KPIs (bookings, new users, revenue, churn); cohort analysis
- **Configuration:** Commission rates, cancellation policies, platform settings
- **Audit Log:** Track critical admin actions

### 19.2 Acceptance Criteria
- [ ] Admin can search and filter users by role, status, join date
- [ ] Business approval workflow with reason for rejection
- [ ] Flagged content queue with bulk actions (approve/reject)
- [ ] Financial dashboard shows real-time revenue metrics
- [ ] Admin actions are logged with user, timestamp, and details
- [ ] Role-based access within admin (Super Admin, Moderator, Finance)

## 20. Background Jobs (BullMQ)
**Priority: P1 (Infrastructure)**
Reliable asynchronous processing for non-blocking operations.

### 20.1 Job Queues
- **Notifications:** Process push, email, SMS notifications with retry logic
- **Availability Cache:** Recompute and cache available slots on schedule changes
- **Reminders:** Scheduled jobs for 24h and 1h before appointments
- **Review Requests:** Send review prompts 2 hours after appointment completion
- **Payment Processing:** Handle refunds, provider payouts, failed payment retries
- **Analytics:** Aggregate daily/weekly metrics; generate reports
- **Data Cleanup:** Soft-delete old data; anonymize deleted accounts
- **Image Processing:** Resize and optimize uploaded photos

### 20.2 Acceptance Criteria
- [ ] Jobs persist through Redis; survive worker restarts
- [ ] Failed jobs retry with exponential backoff (max 5 attempts)
- [ ] Dead Letter Queue for permanently failed jobs with manual retry
- [ ] Job processing monitored; alert if queue depth exceeds 1000
- [ ] Notification jobs complete within 30 seconds on average
- [ ] Availability cache rebuilds complete within 2 minutes for large businesses

## 21. Non-Functional Requirements
- **Performance:** Page loads < 2s, API responses < 300ms (p95)
- **Availability:** 99.9% uptime; graceful degradation during outages
- **Security:** HTTPS everywhere; OWASP top 10 mitigation; rate limiting; input sanitization
- **Accessibility:** WCAG 2.1 AA compliance; screen reader support
- **Localization:** i18n-ready architecture; English first, French second
- **Scalability:** Horizontal scaling for API and workers; database read replicas

## 22. Priority Summary
| Priority | Features |
|----------|----------|
| **P0** | Authentication, Booking Flow, Appointment Management, Availability & Slot Computation, Payment Integration, Shared Types & Design System |
| **P1** | Business Search & Discovery, Business Detail View, Service Categories, User Profile, Reviews & Ratings, Notifications, Provider Portal, Background Jobs |
| **P2** | Map-based Search, Favorites, Admin Dashboard, Guest Browse (enhanced) |

## 23. Success Metrics
- **Booking Completion Rate:** > 80% of initiated bookings
- **Search to Booking Conversion:** > 15% of searches result in booking
- **Provider Onboarding:** < 30 minutes to complete business profile
- **Appointment No-Show Rate:** < 5%
- **Client Retention:** > 60% book again within 30 days
- **Platform Uptime:** 99.9%
- **Notification Delivery Rate:** > 98%