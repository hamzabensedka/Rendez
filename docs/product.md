# Planity Clone — Product Specification

## 1. Overview

Build a marketplace connecting customers with local service businesses (salons, barbers, clinics, etc.) for appointment booking. Two primary user types: **Customers** (book appointments) and **Providers/Business Owners** (manage business, staff, and availability).

---

## 2. Shared Types & Design System (P0)

### Description
Foundational design tokens, reusable components, and shared TypeScript types used across all platforms.

### Acceptance Criteria
- [ ] Color tokens defined: primary (#6C5CE7), success, warning, error, neutral grays
- [ ] Typography scale: 6 sizes (xs to 3xl), weights (regular, medium, semibold, bold)
- [ ] Spacing scale: 4px base grid (0-96)
- [ ] Component library: Button, Input, Card, Avatar, Badge, Modal, DatePicker, TimeSlot, Skeleton
- [ ] Shared types: User, Business, Service, Appointment, Review, Notification, Payment
- [ ] Responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- [ ] Dark mode support via CSS variables
- [ ] Accessibility: WCAG 2.1 AA minimum (focus states, ARIA labels, color contrast)

### Priority: P0 (Foundational)

---

## 3. User Authentication (P0)

### Description
Secure identity management for customers and business owners.

### Acceptance Criteria
- [ ] Email/password registration with validation (8+ chars, 1 uppercase, 1 number)
- [ ] Login with email/password, JWT access token (15min) + refresh token (7 days)
- [ ] OAuth 2.0: Google, Apple Sign-In
- [ ] Password reset via email link (expires 1 hour)
- [ ] Role-based access: `customer`, `provider`, `admin`
- [ ] Account verification email on signup
- [ ] Rate limiting: 5 failed attempts triggers 15-minute lockout
- [ ] Session management: list active sessions, revoke any
- [ ] Biometric login support on mobile (Face ID / Touch ID)

### Priority: P0

---

## 4. Guest Browse & Explore (P0)

### Description
Allow unauthenticated users to browse businesses and services to reduce friction.

### Acceptance Criteria
- [ ] Home page visible without login
- [ ] View business listings, categories, and basic details
- [ ] Search and filter without authentication
- [ ] Prompt to sign up only when attempting to book
- [ ] Guest session persisted in localStorage for 24 hours
- [ ] Convert guest session to registered account preserving favorites/cart

### Priority: P0

---

## 5. Business Search & Discovery (P0)

### Description
Find businesses via text search, filters, and curated collections.

### Acceptance Criteria
- [ ] Full-text search on business name, service name, description
- [ ] Filters: category, price range, rating (4+ stars), distance, open now, accepts online booking
- [ ] Sort options: relevance, rating, distance, price (low to high)
- [ ] Auto-complete suggestions with recent searches
- [ ] Search history (last 10, deletable)
- [ ] Results pagination: 20 per page, infinite scroll on mobile
- [ ] Empty state with popular categories suggestion
- [ ] Search analytics logged (query, filters, result count, click-through)

### Priority: P0

---

## 6. Map-based Search (P0)

### Description
Visual location-based discovery using interactive map.

### Acceptance Criteria
- [ ] Map view toggleable with list view
- [ ] User geolocation with permission prompt
- [ ] Business pins clustered at zoom levels
- [ ] Pin tap reveals business card with name, rating, next available slot
- [ ] Adjustable search radius: 1km, 5km, 10km, 20km
- [ ] Address input with geocoding autocomplete
- [ ] Map bounds update search results dynamically
- [ ] Directions link to native maps app

### Priority: P0

---

## 7. Business Detail View (P0)

### Description
Comprehensive business profile with all information needed to make booking decision.

### Acceptance Criteria
- [ ] Header: business name, verified badge, average rating, review count
- [ ] Photo gallery: up to 10 images, swipeable carousel
- [ ] Services list with prices, durations, descriptions
- [ ] Staff profiles with photos, specialties, ratings
- [ ] Business hours by day, holiday hours
- [ ] Location with embedded mini-map
- [ ] Contact: phone (click-to-call), website link
- [ ] Social media links
- [ ] "Book Now" CTA sticky on mobile
- [ ] Share business via native share sheet
- [ ] Report inaccurate information

### Priority: P0

---

## 8. Service Categories (P0)

### Description
Hierarchical categorization for business discovery and organization.

### Acceptance Criteria
- [ ] Predefined categories: Hair, Nails, Spa & Massage, Barber, Medical Aesthetic, Tattoo, Fitness, Pet Services
- [ ] Subcategories (e.g., Hair > Cut, Color, Styling, Treatment)
- [ ] Category icons and cover images
- [ ] Business can select up to 3 primary categories
- [ ] Category trending section on home page
- [ ] Admin-managed category tree with ability to add/edit/archive

### Priority: P0

---

## 9. Booking Flow (P0)

### Description
Seamless appointment reservation from selection to confirmation.

### Acceptance Criteria
- [ ] Step 1: Select service(s) with optional staff preference
- [ ] Step 2: Choose date (calendar view, 30 days forward)
- [ ] Step 3: Select time slot from computed availability
- [ ] Step 4: Confirm details, apply promo code
- [ ] Step 5: Payment (if required) or confirm
- [ ] Booking confirmation with reference number, calendar invite (.ics), add to wallet
- [ ] Reschedule option before cutoff (default 24h, business configurable)
- [ ] Cancel with reason selection, refund policy displayed
- [ ] Guest checkout with email + phone (account creation optional post-booking)
- [ ] Booking held for 10 minutes during payment (inventory lock)

### Priority: P0

---

## 10. Availability & Slot Computation (P0)

### Description
Real-time calculation of bookable time slots considering all constraints.

### Acceptance Criteria
- [ ] Input: business hours, staff schedules, service duration, buffer time, existing appointments
- [ ] Output: available slots in 15/30/60 minute increments
- [ ] Handle variable service durations (e.g., 30-60 min range)
- [ ] Staff-specific availability (vacation, sick leave)
- [ ] Block slots for internal meetings, lunch breaks
- [ ] Timezone-aware (business timezone primary, customer sees converted)
- [ ] Cache computed slots for 5 minutes, invalidate on booking change
- [ ] Edge case: no consecutive slots, suggest nearest alternative day
- [ ] API response < 200ms for slot query

### Priority: P0

---

## 11. Appointment Management (P0)

### Description
Customer and provider views for tracking and modifying appointments.

### Acceptance Criteria (Customer)
- [ ] Upcoming appointments list with countdown
- [ ] Past appointments with rebook option
- [ ] Reschedule with same-business slot selection
- [ ] Cancel with policy-enforced penalties if applicable
- [ ] Add to calendar (Google, Apple, Outlook)
- [ ] Directions to business

### Acceptance Criteria (Provider)
- [ ] Daily/weekly/monthly calendar views
- [ ] Color-coded by status: confirmed, checked-in, completed, no-show, cancelled
- [ ] Quick actions: check-in, mark complete, add notes
- [ ] Block time manually (single or recurring)
- [ ] Print daily schedule

### Priority: P0

---

## 12. Favorites (P1)

### Description
Save preferred businesses for quick rebooking.

### Acceptance Criteria
- [ ] Heart icon on business card and detail page
- [ ] Favorites list with quick book button
- [ ] Push notification on new availability or promotion from favorited business
- [ ] Sync across devices for logged-in users
- [ ] Maximum 200 favorites per user
- [ ] Suggest similar businesses if favorite is closed/unavailable

### Priority: P1

---

## 13. User Profile (P1)

### Description
Customer account management and preferences.

### Acceptance Criteria
- [ ] Edit: name, phone, email (verification required), profile photo
- [ ] Notification preferences: email, push, SMS (granular per type)
- [ ] Payment methods management (PCI-compliant tokenization)
- [ ] Booking history with invoices
- [ ] Loyalty points / rewards balance
- [ ] Delete account (GDPR-compliant, 30-day grace period)
- [ ] Preferred language and timezone

### Priority: P1

---

## 14. Reviews & Ratings (P1)

### Description
Post-appointment feedback system building trust and quality signals.

### Acceptance Criteria
- [ ] Review prompt 24 hours post-appointment (configurable)
- [ ] Star rating (1-5) + optional text review (10-1000 chars)
- [ ] Tag-based quick feedback: "Great service", "Clean space", "On time", etc.
- [ ] Photo upload (up to 5 images)
- [ ] Business owner can respond publicly
- [ ] Flag inappropriate reviews for moderation
- [ ] Average rating recalculated on new review, cached
- [ ] Sort reviews: most recent, highest/lowest rated, with photos
- [ ] Verified purchase badge on reviews
- [ ] Prevent duplicate reviews, allow edit for 48 hours

### Priority: P1

---

## 15. Payment Integration (P0)

### Description
Secure processing for deposits, full payments, and no-show fees.

### Acceptance Criteria
- [ ] Stripe integration: cards, Apple Pay, Google Pay
- [ ] Payment models: full upfront, deposit + balance, pay at venue
- [ ] Refund processing with automatic calculation per cancellation policy
- [ ] Invoice generation (PDF, email)
- [ ] Failed payment retry with notification
- [ ] Provider payout to connected Stripe account (2-day rolling)
- [ ] Platform fee: 2.5% + $0.30 per transaction
- [ ] PCI compliance: no card data stored, tokenization only
- [ ] Webhook handling for payment status updates

### Priority: P0

---

## 16. Notifications (P1)

### Description
Multi-channel communication for booking lifecycle and marketing.

### Acceptance Criteria
- [ ] Push notifications: booking confirmed, 24h reminder, 1h reminder, changed, cancelled
- [ ] Email: confirmation, reminder, receipt, marketing (opt-in)
- [ ] SMS: optional, premium feature for reminders
- [ ] In-app notification center with unread badge
- [ ] Notification preferences per channel and type
- [ ] Batch marketing notifications (max 1 per day, respect quiet hours)
- [ ] Delivery tracking and retry logic
- [ ] Unsubscribe handling compliant with regulations

### Priority: P1

---

## 17. Provider / Business Owner Portal (P0)

### Description
Comprehensive tools for businesses to manage their presence, availability, and operations.

### Acceptance Criteria
- [ ] Business profile setup: name, description, photos, categories, contact
3-step wizard
- [ ] Staff management: add, edit, deactivate; set services and schedules
- [ ] Service catalog: create, price, duration, description, photo
- [ ] Availability calendar: set weekly hours, exceptions, time off
- [ ] Booking rules: cancellation policy (hours before), max advance booking, min notice
- [ ] Appointment dashboard: view, confirm, reschedule, cancel
- [ ] Customer notes and visit history
- [ ] Revenue dashboard: daily, weekly, monthly; export to CSV
- [ ] Promo code creation: percentage or fixed amount, expiry, usage limits
- [ ] Integration settings: calendar sync (Google, Outlook)
- [ ] Team member roles: owner, manager, staff (permission levels)

### Priority: P0

---

## 18. Admin Dashboard (P1)

### Description
Platform administration and oversight tools.

### Acceptance Criteria
- [ ] Business onboarding approval workflow
- [ ] User management: search, view, suspend, impersonate
- [ ] Content moderation: review flagged reviews, businesses, images
- [ ] Financial overview: GMV, transaction volume, platform fees, payouts due
- [ ] Category and subcategory management
- [ ] Promo and campaign management
- [ ] System health: queue status, error rates, API latency
- [ ] Support ticket routing and resolution tracking
- [ ] Audit log: all admin actions with timestamp and admin ID

### Priority: P1

---

## 19. Background Jobs (BullMQ) (P0)

### Description
Asynchronous task processing for reliability and scalability.

### Acceptance Criteria
- [ ] Job types defined: email send, push notification, payment capture, slot cache warm, report generation, data export
- [ ] Retry policy: 3 attempts with exponential backoff (1min, 5min, 15min)
- [ ] Dead letter queue for failed jobs after retries exhausted
- [ ] Job priority levels: critical (payment), high (notifications), normal (reports), low (analytics)
- [ ] Scheduled jobs: daily reports, weekly summaries, cleanup tasks
- [ ] Monitoring: queue depth, processing rate, average duration, failure rate
- [ ] Idempotency keys for payment-related jobs
- [ ] Graceful shutdown: finish in-progress jobs before process exit

### Priority: P0

---

## Appendix A: Priority Definitions

| Priority | Meaning |
|----------|---------|
| P0 | Must have for MVP launch. Blocks release. |
| P1 | Important for launch, can have workaround. |
| P2 | Post-launch enhancement. |

## Appendix B: Success Metrics

- Booking conversion rate: > 15%
- Search to book time: < 3 minutes
- Provider activation (complete profile + availability): > 80%
- NPS: > 50
- App store rating: > 4.5

## Appendix C: Non-Functional Requirements

- Mobile-first responsive design
- PWA support for web
- API response < 300ms (p95)
- 99.9% uptime SLA
- GDPR and CCPA compliance
- Data retention: 7 years financial, 3 years operational, anonymized thereafter