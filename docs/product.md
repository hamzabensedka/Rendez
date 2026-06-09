# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Build a modern, scalable appointment-booking platform that connects consumers with local beauty, wellness, and health professionals. The platform enables seamless discovery, booking, and management of appointments while providing business owners with tools to manage their availability, services, and clientele.

### 1.2 Target Users
- **Consumers (End Users)**: Individuals looking to discover and book beauty, wellness, and health services.
- **Business Owners / Providers**: Salons, independent professionals, clinics managing their services, availability, and appointments.
- **Platform Admins**: Internal team managing businesses, users, payments, and platform health.

### 1.3 Success Metrics
- Booking conversion rate > 15%
- Search-to-booking latency < 3 seconds
- Provider onboarding completion > 70%
- Mobile app crash rate < 0.5%

---

## 2. Feature Specifications

---

### 2.1 User Authentication
**Priority:** P0 — Critical

#### Description
Enable users to create accounts, log in, and manage their authentication state securely across mobile and web.

#### User Stories
- As a new user, I want to sign up with email/password or social providers so that I can quickly start booking.
- As a returning user, I want to log in securely so that I can access my bookings and favorites.
- As a user, I want to reset my password so that I can recover access to my account.

#### Acceptance Criteria
- [ ] Users can register with email, password, and optional phone number.
- [ ] Users can register/login via Google OAuth and Apple Sign-In.
- [ ] Passwords must be hashed (bcrypt) with minimum 8 characters, 1 uppercase, 1 number.
- [ ] JWT access token (15 min expiry) + refresh token (7 days) rotation implemented.
- [ ] Users receive email verification on signup; account restricted until verified.
- [ ] Password reset flow via secure email link (expires in 1 hour).
- [ ] Rate limiting: 5 failed login attempts trigger 15-minute lockout.
- [ ] Biometric login supported on mobile (Face ID / Touch ID).

#### Technical Notes
- Use Passport.js with JWT strategy.
- Store refresh tokens in httpOnly cookies (web) and secure storage (mobile).
- Integrate with SendGrid for transactional emails.

---

### 2.2 Guest Browse & Explore
**Priority:** P0 — Critical

#### Description
Allow unauthenticated users to browse businesses, services, and availability without creating an account, reducing friction in the discovery phase.

#### User Stories
- As a guest, I want to browse nearby businesses so that I can see what's available before committing.
- As a guest, I want to view business details and services so that I can evaluate options.

#### Acceptance Criteria
- [ ] Guest users can access search, discovery, and business detail views without login.
- [ ] Guest users can view service listings, prices, and descriptions.
- [ ] Guest users can view business photos, reviews, and ratings.
- [ ] Attempting to book triggers a login/signup prompt with pre-filled context.
- [ ] Guest session data (search filters, viewed businesses) persisted for 24 hours via local storage.
- [ ] Upon registration, guest session data (favorites, recent views) merges to authenticated account.

#### Technical Notes
- Implement guest session ID stored in localStorage/cookies.
- Merge guest data to authenticated user on signup/login.

---

### 2.3 Business Search & Discovery
**Priority:** P0 — Critical

#### Description
Powerful search and filtering to help users find the right business based on location, service, availability, and ratings.

#### User Stories
- As a user, I want to search for businesses by name, service, or category so that I can find what I need quickly.
- As a user, I want to filter by price range, rating, distance, and availability so that I can narrow results.

#### Acceptance Criteria
- [ ] Full-text search across business name, service names, and descriptions.
- [ ] Filters: category, service type, price range (min/max), rating (1-5 stars), distance (km/mi), open now, availability on specific date.
- [ ] Sort options: relevance, rating, distance, price (low to high).
- [ ] Search results return within 500ms for top 20 results.
- [ ] Pagination with cursor-based infinite scroll.
- [ ] Recent searches stored locally (last 10).
- [ ] Auto-suggest businesses and services as user types (debounced 300ms).

#### Technical Notes
- Use PostgreSQL full-text search with pg_trgm for fuzzy matching.
- Consider Elasticsearch for advanced search in future iterations.
- Cache popular search queries in Redis (5 min TTL).

---

### 2.4 Map-based Search
**Priority:** P0 — Critical

#### Description
Visual map interface showing business locations with clustering, allowing users to explore geographically.

#### User Stories
- As a user, I want to see businesses on a map so that I can choose based on location convenience.
- As a user, I want to see business density via clustering so that the map remains readable.

#### Acceptance Criteria
- [ ] Interactive map (Google Maps / Mapbox) with business markers.
- [ ] Marker clustering for dense areas (cluster count displayed).
- [ ] Tapping a marker shows business card preview (name, rating, starting price).
- [ ] Map bounds trigger dynamic search result updates.
- [ ] User's current location centered by default (with permission).
- [ ] Map and list views are toggleable and synchronized.
- [ ] Businesses outside visible map area hidden from results.

#### Technical Notes
- Store business coordinates as PostGIS geography points.
- Use spatial indexing (GiST) for fast bounding-box queries.
- Implement server-side clustering for >500 markers.

---

### 2.5 Business Detail View
**Priority:** P0 — Critical

#### Description
Comprehensive business profile page displaying all relevant information for user decision-making.

#### User Stories
- As a user, I want to see all business details so that I can make an informed booking decision.

#### Acceptance Criteria
- [ ] Display: business name, logo, photos (gallery), description, address, phone, website link.
- [ ] Operating hours with current day highlighted and open/closed status.
- [ ] Service menu with pricing, duration, and descriptions.
- [ ] Staff/professional profiles with photos and specialties.
- [ ] Aggregate rating and review count.
- [ ] "Book Now" CTA prominently displayed.
- [ ] Share business via native share sheet (mobile) or copy link.
- [ ] Report business functionality for inappropriate content.

#### Technical Notes
- Lazy load images with blur placeholder.
- Cache business detail in React Query (5 min stale time).

---

### 2.6 Service Categories
**Priority:** P0 — Critical

#### Description
Hierarchical categorization of services for organized discovery and filtering.

#### User Stories
- As a user, I want to browse by category so that I can discover new services.
- As a business owner, I want to categorize my services so that customers can find them easily.

#### Acceptance Criteria
- [ ] Predefined category hierarchy: Beauty > Hair, Nails, Makeup, etc.; Wellness > Massage, Spa, etc.
- [ ] Categories support 3 levels of nesting (e.g., Beauty > Hair > Hair Coloring).
- [ ] Each category has icon, name, and optional description.
- [ ] Businesses can assign services to multiple categories.
- [ ] Category pages show featured businesses and trending services.
- [ ] Admin can create, edit, and deactivate categories.

#### Technical Notes
- Adjacency list model in database with self-referencing table.
- Cache category tree in Redis (rarely changes).

---

### 2.7 Booking Flow
**Priority:** P0 — Critical

#### Description
Seamless multi-step booking process from service selection to confirmation.

#### User Stories
- As a user, I want to book an appointment in as few steps as possible so that I can secure my slot quickly.
- As a user, I want to see real-time availability so that I know what slots are actually open.

#### Acceptance Criteria
- [ ] Step 1: Select service(s) with optional add-ons.
- [ ] Step 2: Select staff member (or "No preference").
- [ ] Step 3: Select date and view available time slots.
- [ ] Step 4: Confirm details and apply promo code (if any).
- [ ] Step 5: Payment (if required) or confirm (if free).
- [ ] Step 6: Receive booking confirmation with calendar invite (.ics).
- [ ] Slot availability updates in real-time (SSE/WebSocket polling).
- [ ] Booking held for 10 minutes during payment; released if not completed.
- [ ] Support for recurring bookings (weekly/monthly).
- [ ] Guest checkout supported with email capture.

#### Technical Notes
- Implement optimistic locking for slot reservation (Redis SET NX with TTL).
- Use Stripe Payment Intents for payment flow.
- Queue confirmation emails via BullMQ.

---

### 2.8 Appointment Management
**Priority:** P0 — Critical

#### Description
Users can view, reschedule, and cancel their appointments. Business owners manage their appointment calendar.

#### User Stories
- As a user, I want to see all my upcoming and past appointments so that I can manage my schedule.
- As a user, I want to reschedule or cancel with clear policies so that I have flexibility.

#### Acceptance Criteria
- [ ] Upcoming, past tic, and cancelled appointment tabs.
- [ ] Appointment detail: service, staff, time, location, price, status.
- [ ] Reschedule: select new slot if within cancellation policy window.
- [ ] Cancel with reason selection; refund per business policy.
- [ ] Push and email reminders: 24 hours, 2 hours, and 15 minutes before.
- [ ] Add appointment to personal calendar (Google/Apple/Outlook).
- [ ] No-show reporting by business triggers user notification.

#### Technical Notes
- Soft delete for appointments; maintain audit trail.
- Cancellation policy configurable per business (e.g., 24h notice).

---

### 2.9 Favorites
**Priority:** P1 — High

#### Description
Users can save favorite businesses for quick access and receive updates.

#### User Stories
- As a user, I want to save my favorite businesses so that I can rebook easily.

#### Acceptance Criteria
- [ ] Heart icon on business card and detail page to toggle favorite.
- [ ] Favorites list accessible from profile tab.
- [ ] Favorites synced across devices for logged-in users.
- [ ] Optional: Notify when favorite adds new service or promotion.
- [ ] Guest favorites prompt login and merge on authentication.

---

### 2.10 User Profile
**Priority:** P1 — High

#### Description
Personalized user space managing personal info, preferences, payment methods, and history.

#### User Stories
- As a user, I want to manage my profile so that my bookings are personalized and accurate.

#### Acceptance Criteria
- [ ] Edit: name, email, phone, profile photo, birthday (for birthday offers).
- [ ] Manage payment methods (add, remove, set default).
- [ ] View booking history with reorder/rebook option.
- [ ] Notification preferences (email, push, SMS).
- [ ] Privacy settings: profile visibility, data download, account deletion.
- [ ] Referral code and credits balance.

---

### 2.11 Availability & Slot Computation
**Priority:** P0 — Critical

#### Description
Core engine computing real-time availability based on business hours, staff schedules, existing bookings, and buffer times.

#### User Stories
- As a business owner, I want my availability to update automatically so that I don't get double-booked.
- As a user, I want to see only truly available slots so that my booking is guaranteed.

#### Acceptance Criteria
- [ ] Business hours configurable per day with breaks.
- [ ] Staff-specific schedules with override support (holidays, time off).
- [ ] Service duration + buffer time between appointments configurable.
- [ ] Slot computation accounts for concurrent services (e.g., multiple chairs).
- [ ] Real-time availability query responds in <200ms.
- [ ] Handle timezone correctly for businesses and users.
- [ ] Support for irregular schedules and one-off closures.

#### Technical Notes
- Pre-compute daily slot matrices and cached in Redis (refresh on change).
- Use PostgreSQL with temporal range types for schedule storage.

---

### 2.12 Shared Types & Design System
**Priority:** P1 — High

#### Description
Consistent UI/UX across platforms with reusable components and typed interfaces.

#### Acceptance Criteria
- [ ] Design tokens: colors, typography, spacing, shadows, border-radius.
- [ ] Component library: buttons, inputs, cards, modals, date picker, time slot grid.
- [ ] Shared TypeScript types between backend and frontend (monorepo).
- [ ] Accessibility: WCAG 2.1 AA compliance, screen reader support.
- [ ] Dark mode support.
- [ ] Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px).

---

### 2.13 Reviews & Ratings
**Priority:** P1 — High

#### Description
Users can rate and review businesses after appointments; businesses can respond.

#### Acceptance Criteria
- [ ] 5-star rating with optional text review (min 10, max 1000 chars).
- [ ] Review eligibility: only after completed appointment.
- [ ] Business owner can respond publicly to reviews.
- [ ] Flag inappropriate reviews for admin moderation.
- [ ] Sort reviews: most recent, most helpful, highest/lowest rating.
- [ ] Review photos supported (max 5, 5MB each).
- [ ] Aggregate rating recalculated on new review (weighted for recency).

---

### 2.14 Payment Integration
**Priority:** P0 — Critical

#### Description
Secure payment processing for bookings, deposits, and no-show fees.

#### Acceptance Criteria
- [ ] Stripe integration for card payments (Visa, MC, Amex).
- [ ] Support for Apple Pay and Google Pay.
- [ ] Save payment methods for future use (Stripe Customer + PaymentMethod).
- [ ] Full payment or deposit (configurable %) at booking.
- [ ] Refund processing with configurable policy.
- [ ] Receipt emailed after successful payment.
- [ ] PCI compliance via Stripe Elements (no card data touches servers).

---

### 2.15 Notifications
**Priority:** P1 — High

#### Description
Multi-channel notifications keeping users and businesses informed.

#### Acceptance Criteria
- [ ] Push notifications via Firebase Cloud Messaging (FCM).
- [ ] Email notifications via SendGrid.
- [ ] SMS notifications via Twilio (optional, for premium).
- [ ] Notification types: booking confirmed, reminder, cancelled, rescheduled, promotion.
- [ ] User preference controls for each channel and type.
- [ ] Notification inbox in-app with read/unread status.

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 — Critical

#### Description
Dedicated web interface for business owners to manage their profile, services, availability, and appointments.

#### Acceptance Criteria
- [ ] Dashboard: upcoming appointments, revenue today, new reviews.
- [ ] Calendar view: day, week, month with appointment details on click.
- [ ] Service management: CRUD services with pricing, duration, description.
- [ ] Staff management: add team members, set permissions, manage schedules.
- [ ] Availability settings: regular hours, breaks, time off.
- [ ] Client list with booking history and notes.
- [ ] Analytics: bookings, revenue, cancellation rate, top services.
- [ ] Settings: business info, payment methods, notification preferences.

---

### 2.17 Admin Dashboard
**Priority:** P1 — High

#### Description
Platform administration for user management, business verification, content moderation, and analytics.

#### Acceptance Criteria
- [ ] User management: search, view, suspend, delete accounts.
- [ ] Business verification workflow: pending, approved, rejected states.
- [ ] Content moderation: review flagged reviews and business content.
- [ ] Financial overview: platform revenue, payouts to businesses, refunds.
- [ ] System health: API metrics, error rates, queue status.
- [ ] Role-based access control (RBAC) for admin team.

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P1 — High

#### Description
Reliable asynchronous job processing for notifications, reports, and data processing.

#### Acceptance Criteria
- [ ] Job queues: email, push notification, SMS, report generation, data exports.
- [ ] Retry logic with exponential backoff (max 5 attempts).
- [ ] Dead letter queue for failed jobs requiring manual review.
- [ ] Job scheduling: recurring reports, daily summaries.
- [ ] Monitoring: queue depth, processing rate, failed job count.
- [ ] Priority levels: critical (payment), high (notifications), normal (reports), low (analytics).

---

## 3. Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | P95 API response < 500ms; page load < 2s |
| Scalability | Support 10,000 concurrent users; 1M businesses |
| Security | OWASP Top 10 compliance; encryption at rest and in transit |
| Availability | 99.9% uptime SLA |
| Compliance | GDPR, CCPA data handling; PCI-DSS for payments |

---

## 4. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Search, Business Detail, Booking, Payments, Provider Portal | Month 1-2 |
| v1.1 | Map Search, Reviews, Favorites, Notifications | Month 3 |
| v1.2 | Admin Dashboard, Analytics, Background Jobs | Month 4 |
| v1.3 | Recurring Bookings, Referrals, Loyalty Program | Month 5 |

---

## 5. Open Questions

1. Internationalization scope (initial markets, languages)?
2. Commission model: percentage per booking or subscription for businesses?
3. White-label / franchise support requirements?

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex (Product Owner)*
