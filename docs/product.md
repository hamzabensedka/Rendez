# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
A mobile-first platform connecting customers with local beauty and wellness businesses for seamless appointment booking, while empowering business owners to manage their operations efficiently.

### 1.2 Target Users
- **Customers**: Individuals seeking beauty/wellness services
- **Business Owners**: Salons, spas, barbershops, independent professionals
- **Admin**: Platform operators managing the marketplace

### 1.3 Success Metrics
- Booking conversion rate > 15%
- Search-to-book time < 3 minutes
- Business owner onboarding < 10 minutes
- App crash rate < 0.1%

---策

## 2. Shared Types & Design System (P0)

### 2.1 Description
Foundational design tokens, component library, and type definitions used across all features.

### 2.2 Acceptance Criteria
- [ ] Color palette defined with semantic naming (primary, success, error, warning, info)
- [ ] Typography scale with 6 levels (H1-H3, body, caption, overline)
- [ ] Spacing system based on 4px grid
- [ ] Component library: buttons, inputs, cards, modals, bottom sheets, avatars, badges
- [ ] Dark/light theme support with system preference detection
- [ ] Accessibility: minimum 4.5:1 contrast ratios, touch targets 44x44dp
- [ ] TypeScript interfaces for all domain entities (User, Business, Service, Appointment, Review)
- [ ] Shared enums for status fields (BookingStatus, PaymentStatus, NotificationType)
- [ ] Animation standards: 200ms transitions, spring physics for gestures

### 2.3 Priority: P0 (Foundation)

---

## 3. User Authentication (P0)

### 3.1 Description
Secure, frictionless authentication supporting multiple login methods with progressive profiling.

### 3.2 Features
- Email/password registration with validation
- Social login (Google, Apple Sign-In)
- Phone number authentication (OTP)
- Password reset flow
- Biometric authentication (Face ID / Fingerprint)
- Session management with refresh tokens

### 3.3 Acceptance Criteria
- [ ] User can register with email, password, and phone number
- [ ] Password requirements: 8+ chars, 1 uppercase, 1 number, 1 special character
- [ ] OTP delivered via SMS in < 30 seconds
- [ ] Social login completes in < 5 seconds
- [ ] Biometric prompt appears after 3 successful password logins
- [ ] Token refresh is transparent to user; no session interruption
- [ ] User can log out from all devices
- [ ] Account lockout after 5 failed attempts (30-minute cooldown)

### 3.4 Priority: P0

---

## 4. Guest Browse & Explore (P0)

### 4.1 Description
Allow unauthenticated users to browse businesses and services, driving organic discovery and conversion.

### 4.2 Features
- Home feed with curated content
- Category browsing without login
- Business preview (limited info)
- Promotional banners and campaigns

### 4.3 Acceptance Criteria
- [ ] Guest sees personalized location-based feed
- [ ] Category tiles navigate to filtered results
- [ ] Business cards show: name, rating, distance, starting price, next available slot
- [ ] "Book Now" CTA prompts login/signup with preserved context
- [ ] Deep links from marketing campaigns work for guests
- [ ] Guest session data persists for 7 days or until conversion
- [ ] Maximum 3 business detail views before login prompt (configurable)

### 4.4 Priority: P0

---

## 5. Business Search & Discovery (P0)

### 5.1 Description
Powerful search and filtering to help users find the right business for their needs.

### 5.2 Features
- Full-text search (business name, service, location)
- Filters: distance, price range, rating, availability (today, this week), services offered
- Sort options: relevance, rating, price (low-high), distance
- Recent searches and search suggestions
- Auto-complete with typo tolerance

### 5.3 Acceptance Criteria
- [ ] Search returns results in < 500ms
- [ ] Results update as filters change (no page reload)
- [ ] Empty state with suggested alternatives when no results
- [ ] "Near me" uses GPS with fallback to IP geolocation
- [ ] Search history persists across sessions (logged-in users)
- [ ] Voice search support (iOS/Android native)
- [ ] Results show skeleton loaders while fetching

### 5.4 Priority: P0

---

## 6. Map-based Search (P0)

### 6.1 Description
Visual discovery through interactive map with business clustering and quick previews.

### 6.2 Features
- Interactive map with business pins
- Clustering for dense areas
- User location centering
- Pin color coding by category
- Bottom sheet business preview on tap
- Directions integration

### 6.3 Acceptance Criteria
- [ ] Map loads with user location centered in < 3 seconds
- [ ] Pin tap reveals business card with photo, name, rating, and CTA
- [ ] Cluster expands on zoom or tap
- [ ] List/map toggle preserves filter state
- [ ] Map bounds trigger new data fetch (pagination)
- [ ] Accessibility: screen reader announces "X businesses nearby"
- [ ] Offline: cached map tiles for last viewed area

### 6.4 Priority: P0

---

## 7. Business Detail View (P0)

### 7.1 Description
Comprehensive business profile converting interest into booking.

### 7.2 Features
- Photo gallery (swipeable, full-screen viewer)
- Business info: hours, address, phone, website, social links
- Service menu with pricing and duration
- Team/staff profiles
- Reviews summary and detail
- Availability calendar integration
- "Book Now" prominent CTA

### 7.3 Acceptance Criteria
- [ ] Hero image loads progressively; gallery supports pinch-to-zoom
- [ ] Services grouped by category with expand/collapse
- [ ] Each service shows: name, description, duration, price, and "Select" CTA
- [ ] Staff selection available if business enables it
- [ ] Real-time availability fetches in < 2 seconds
- [ ] "Call" and "Get Directions" actions accessible from header
- [ ] Share business via native share sheet
- [ ] Report inaccurate information functionality

### 7.4 Priority: P0

---

## 8. Service Categories (P0)

### 8.1 Description
Hierarchical categorization system for service discovery and business organization.

### 8.2 Features
- Top-level categories: Hair, Nails, Face, Body, Massage, Wellness, Medical Aesthetic
- Subcategories (e.g., Hair > Cut, Color, Styling, Treatment)
- Category icons and color coding
- Trending and seasonal categories

### 8.3 Acceptance Criteria
- [ ] Category hierarchy supports 3 levels deep
- [ ] Business can assign multiple categories
- [ ] Category pages show featured businesses and popular services
- [ ] Breadcrumb navigation on category pages
- [ ] Category metadata (SEO-friendly URLs, descriptions)
- [ ] Admin can create, edit, deactivate categories

### 8.4 Priority: P0

---

## 9. Booking Flow (P0)

### 9.1 Description
Streamlined multi-step booking minimizing abandonment and maximizing conversions.

### 9.2 Features
- Step 1: Service selection (with staff preference)
- Step 2: Date/time selection from available slots
- Step 3: Guest details and special requests
- Step 4: Payment (if required) and confirmation
- Guest booking option (no account required)

### 9.3 Acceptance Criteria
- [ ] Flow completes in < 60 seconds for returning users
- [ ] Each step shows progress indicator
- [ ] Slot selection enforces business rules (buffer time, max advance booking)
- [ ] Guest booking collects: name, phone, email (optional account creation offered post-booking)
- [ ] Special requests limited to 250 characters
- [ ] Booking confirmation shows: business, service, staff, date/time, location, add-to-calendar CTA
- [ ] Modification allowed up to cancellation policy window
- [ ] Cancellation with reason collection; immediate refund per policy

### 9.4 Priority: P0

---

## 10. Availability & Slot Computation (P0)

### 10.1 Description
Real-time availability engine respecting complex business scheduling rules.

### 10.2 Features
- Business hours and break handling
- Staff-specific schedules
- Service duration and buffer time
- Blocked time handling (holidays, time off)
- Overbooking prevention with optimistic locking
- Waitlist for fully booked slots

### 10.3 Acceptance Criteria
- [ ] Slots computed in < 500ms for 30-day window
- [ ] Supports recurring schedules and exceptions
- [ ] Buffer time configurable per service (0-60 min)
- [ ] Concurrent booking race condition handled (first commit wins)
- [ ] Waitlist: user notified if slot opens within 24 hours of preference
- [ ] Timezone handling for businesses with multiple locations
- [ ] Cache invalidation on schedule changes

### 10.4 Priority: P0

---

## 11. Appointment Management (P0)

### 11.1 Description
Customer and business views for appointment lifecycle management.

### 11.2 Features
- Upcoming appointments list with quick actions
- Appointment detail view
- Reschedule with new slot selection
- Cancel with reason
- Past appointments history
- Rebooking from past appointment

### 11.3 Acceptance Criteria
- [ ] Upcoming appointments sorted by date (nearest first)
- [ ] Push notification 24 hours and 1 hour before appointment
- [ ] Reschedule enforces same cancellation policy rules
- [ ] Cancellation reason options: change of plans, found alternative, emergency, other
- [ ] Past appointments show: date, service, staff, price paid, review status
- [ ] "Book Again" pre-fills previous selections
- [ ] No-show tracking with business flagging capability

### 11.4 Priority: P0

---

## 12. Favorites (P1)

### 12.1 Description
Save and organize preferred businesses for quick rebooking.

### 12.2 Features
- Heart icon on business cards and detail
- Favorites list with quick book
- Favorite removal with undo

### 12.3 Acceptance Criteria
- [ ] Toggle favorite with haptic feedback
- [ ] Favorites sync across devices (logged-in users)
- [ ] Empty state with discovery prompt
- [ ] Favorites list shows next available slot per business
- [ ] Batch remove with multi-select

### 12.4 Priority: P1

---

## 13. User Profile (P1)

### 13.1 Description
Customer account management and preference center.

### 13.2 Features
- Personal info editing
- Profile photo upload
- Notification preferences
- Payment methods management
- Booking history
- Loyalty/rewards status

### 13.3 Acceptance Criteria
- [ ] Name, phone, email editable with verification for changes
- [ ] Photo upload with cropping; max 5MB, JPG/PNG
- [ ] Notification toggles: push, email, SMS (granular by type)
- [ ] Default payment method selection
- [ ] GDPR: data export and account deletion
- [ ] Referral code and sharing

### 13.4 Priority: P1

---

## 14. Reviews & Ratings (P1)

### 14.1 Description
Trust-building through verified customer feedback.

### 14.2 Features
- Post-appointment review prompt
- Star rating (1-5) with text review
- Photo attachment option
- Business response capability
- Review helpfulness voting
- Report inappropriate reviews

### 14.3 Acceptance Criteria
- [ ] Review prompt sent 2 hours after appointment completion
- [ ] Only verified customers can review (completed appointment)
- [ ] Review editable for 48 hours, deletable anytime
- [ ] Business response within 24 hours flagged for customers
- [ ] Reviews sorted by: most helpful, most recent, highest/lowest rated
- [ ] Overall rating calculated from last 100 reviews (rolling)
- [ ] Content moderation: auto-flag profanity, manual review queue

### 14.4 Priority: P1

---

## 15. Payment Integration (P0)

### 15.1 Description
Secure, flexible payment handling supporting multiple methods and business models.

### 15.2 Features
- Credit/debit card processing
- Digital wallets (Apple Pay, Google Pay)
- Pay-in-store option
- Deposit/full payment options
- Refund processing
- Invoice/receipt generation

### 15.3 Acceptance Criteria
- [ ] PCI-DSS compliant; no card data stored locally
- [ ] 3D Secure authentication for applicable transactions
- [ ] Payment intent created at booking, captured on completion or per policy
- [ ] Failed payment: retry with saved method or new method
- [ ] Refund processed within 5-10 business days per original payment method
- [ ] Receipt delivered via email and in-app
- [ ] Payment dispute handling workflow

### 15.4 Priority: P0

---

## 16. Notifications (P1)

### 16.1 Description
Multi-channel notification system for engagement and operational updates.

### 16.2 Features
- Push notifications (iOS/Android)
- SMS for critical updates
- Email for confirmations and receipts
- In-app notification center
- Preference-based delivery

### 16.3 Acceptance Criteria
- [ ] Notification delivered in < 5 seconds for real-time events
- [ ] Rich push with deep linking to relevant screen
- [ ] Batch notifications to prevent spam (max 3/hour configurable)
- [ ] Failed push falls back to SMS for critical (booking changes)
- [ ] Notification center groups by type unread/read
- [ ] Unsubscribe honored within 24 hours

### 16.4 Priority: P1

---

## 17. Provider / Business Owner Portal (P0)

### 17.1 Description
Comprehensive business management tools for schedule, staff, services, and clients.

### 17.2 Features
- Dashboard: upcoming appointments, revenue, occupancy rate
- Schedule management: calendar view, block time, set hours
- Staff management: profiles, schedules, services assigned
- Service menu: CRUD with pricing, duration, description
- Client database with notes and history
- Booking rules: cancellation policy, lead time, deposit requirements
- Analytics: bookings, revenue, no-shows, popular services

### 17.3 Acceptance Criteria
- [ ] Dashboard loads key metrics in < 3 seconds
- [ ] Drag-and-drop calendar for schedule changes
- [ ] Staff can have individual login with permission levels (admin, manager, staff)
- [ ] Service changes reflect immediately in customer-facing app
- [ ] Client notes visible to all staff at business; private notes option
- [ ] Export data to CSV (appointments, clients, revenue)
- [ ] Mobile-responsive web app; native app parity

### 17.4 Priority: P0

---

## 18. Admin Dashboard (P1)

### 18.1 Description
Platform management and oversight tools.

### 18.2 Features
- Business onboarding and verification
- User management and support
- Content moderation (reviews, business info)
- Financial oversight and payouts
- Platform analytics and reporting
- System configuration

### 18.3 Acceptance Criteria
- [ ] Business verification workflow: submitted → under review → approved/rejected
- [ ] Support ticket system with SLA tracking
- [ ] Review moderation queue with bulk actions
- [ ] Automated payout scheduling to businesses
- [ ] Fraud detection alerts (unusual booking patterns)
- [ ] Role-based access control (super admin, ops, support)

### 18.4 Priority: P1

---

## 19. Background Jobs (BullMQ) (P0)

### 19.1 Description
Reliable asynchronous job processing for scalability and responsiveness.

### 19.2 Features
- Job queues: notifications, payments, reports, data exports
- Scheduled/recurring jobs
- Job retry with exponential backoff
- Dead letter queue for failed jobs
- Job monitoring and alerting

### 19.3 Acceptance Criteria
- [ ] Notification jobs process within 5 seconds of trigger
- [ ] Payment jobs: idempotent processing, duplicate detection
- [ ] Report generation jobs: progress tracking, download link on completion
- [ ] Failed jobs retry 3 times, then alert ops team
- [ ] Job queue depth monitoring with auto-scaling triggers
- [ ] Graceful shutdown: in-progress jobs complete before process exit

### 19.4 Priority: P0

---

## 20. Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | App launch < 3s; screen load < 1.5s; API response < 500ms |
| Availability | 99.9% uptime; maintenance windows < 1 hour monthly |
| Security | OWASP Top 10 compliance; encryption in transit and at rest |
| Scalability | Support 100k concurrent users; horizontal scaling |
| Localization | French, English, Spanish, German at launch |
| Compliance | GDPR, CCPA, PCI-DSS |

## 21. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Search, Booking, Payments, Business Portal | 8 weeks |
| v1.0 | Map, Reviews, Notifications, Favorites | +4 weeks |
| v1.1 | Admin, Analytics, Loyalty, Waitlist | +4 weeks |
| v1.2 | Advanced scheduling, Marketplace features | +8 weeks |