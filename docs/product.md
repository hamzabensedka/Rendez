# Planity Clone – Product Specification

## 1. Overview
Planity Clone is a multi-sided platform connecting customers with beauty and wellness businesses. Customers can discover businesses, browse services, book appointments, and pay online. Business owners manage their profiles, staff, services, and calendars. Admins oversee the platform. This specification defines all features, acceptance criteria (AC), and priorities (P0 = must-have for MVP, P1 = important next iteration, P2 = nice to have).

## 2. Feature List & Prioritisation
| Feature | Priority |
|---|---|
| User Authentication | P0 |
| Guest Browse & Explore | P0 |
| Business Search & Discovery | P0 |
| Map-based Search | P1 |
| Business Detail View | P0 |
| Service Categories | P0 |
| Booking Flow | P0 |
| Appointment Management | P0 |
| Favorites | P1 |
| User Profile | P0 |
| Availability & Slot Computation | P0 |
| Shared Types & Design System | P0 |
| Reviews & Ratings | P1 |
| Payment Integration | P0 |
| Notifications | P1 |
| Provider / Business Owner Portal | P0 |
| Admin Dashboard | P1 |
| Background Jobs (BullMQ) | P1 |

## 3. Detailed Feature Specifications

### 3.1 User Authentication
**Priority:** P0
**Description:** Allow users to create accounts, log in, and manage sessions securely.

**Acceptance Criteria**
- [ ] Users can sign up with email/phone and password (with validation).
- [ ] Users can sign in via Google OAuth and Apple Sign-In.
- [ ] Password reset flow (send reset link, set new password).
- [ ] Email verification on sign-up (optional but tracked).
- [ ] JWT access/refresh token mechanism; tokens stored securely.
- [ ] Session persists across app restarts (refresh token handling).
- [ ] Logout invalidates tokens locally and optionally revokes refresh token.
- [ ] Error messages for invalid credentials, network failures.

### 3.2 Guest Browse & Explore
**Priority:** P0
**Description:** Unauthenticated users can browse businesses, services, and availability to encourage sign-up.

**Acceptance Criteria**
- [ ] Guests can view the home page with featured businesses and categories.
- [ ] Guests can search businesses by name or service.
- [ ] Guests can view business detail pages including services, working hours, and ratings.
- [ ] Guests can see available slots (blocked before booking).
- [ ] When a guest taps “Book Now”, the app prompts login/sign-up before continuing.
- [ ] All personalisation (favorites, booking history) is unavailable for guests.

### 3.3 Business Search & Discovery
**Priority:** P0
**Description:** Text-based search and category browsing enable users to find relevant businesses.

**Acceptance Criteria**
- [ ] Search bar with autocomplete and suggestions.
- [ ] Search by business name, service name, or keywords.
- [ ] Search results show business name, image, rating, and distance.
- [ ] Filters: category, location (city/radius), rating, price range, availability.
- [ ] Sort options: relevance, rating, distance.
- [ ] Pagination / infinite scroll.
- [ ] “No results” state and suggestions.

### 3.4 Map-based Search
**Priority:** P1
**Description:** Interactive map showing business locations with clusters.

**Acceptance Criteria**
- [ ] Map displays at default location (user’s location if permitted).
- [ ] Business markers show name, rating, and category on tap.
- [ ] Tapping marker opens business detail card.
- [ ] Clustering for high-density areas.
- [ ] Map search bar and filtering sync with map view.
- [ ] Permission handling for location: request, explain, fallback to city input.

### 3.5 Business Detail View
**Priority:** P0
**Description:** Comprehensive page with all business information, services, reviews, and booking CTA.

**Acceptance Criteria**
- [ ] Hero image gallery with swipe.
- [ ] Business name, address, contact info, social links.
- [ ] Working hours and holiday schedules.
- [ ] Service list with name, duration, price, and description.
- [ ] Staff members (if applicable) with photo and specialisations.
- [ ] Aggregated rating and review counts; recent reviews.
- [ ] “Book” button navigates to booking flow with pre-selected service (if any).
- [ ] “Add to favourites” toggle.
- [ ] Links to external website or maps.

### 3.6 Service Categories
**Priority:** P0
**Description:** Hierarchical categories to organise services and aid discovery.

**Acceptance Criteria**
- [ ] Top-level categories (e.g., Hair, Nails, Spa, Massage, Barber).
- [ ] Subcategories (e.g., Hair > Women’s Cut, Men’s Cut, Colouring).
- [ ] Each category page shows relevant businesses or services.
- [ ] Category icons and images.
- [ ] Admin-managed category tree (CRUD).
- [ ] Selecting a category filters search.

### 3.7 Booking Flow
**Priority:** P0
**Description:** Step-by-step process to select service, staff, date/time, add-ons, and confirm booking.

**Acceptance Criteria**
- [ ] Step 1: Select service (or multiple services).
- [ ] Step 2: Select staff member (optional, can be “Any”).
- [ ] Step 3: Choose date and available time slot.
- [ ] Step 4: Review summary (services, time, staff, total price).
- [ ] Step 5: Apply promo code (optional).
- [ ] Step 6: Login/sign-up gate (if not authenticated).
- [ ] Step 7: Payment screen (card details, saved payment methods).
- [ ] Step 8: Confirmation screen with booking reference.
- [ ] Pre-filled selections from business detail page carry over.
- [ ] Back navigation preserves selections.
- [ ] Real-time availability validation before payment.

### 3.8 Appointment Management
**Priority:** P0
**Description:** Users can view, reschedule, and cancel upcoming appointments.

**Acceptance Criteria**
- [ ] “My Appointments” list with upcoming, past, and cancelled.
- [ ] Each appointment shows business, service, date/time, status.
- [ ] Details page with map, contact, add-to-calendar option.
- [ ] Rescheduling: change date/time/staff with real-time availability.
- [ ] Cancellation with confirmation, respecting cancellation policy.
- [ ] Push notification and email for appointment reminders, changes, cancellations.
- [ ] Past appointments allow re-booking and review prompt.

### 3.9 Favorites
**Priority:** P1
**Description:** User can bookmark favourite businesses and access them quickly.

**Acceptance Criteria**
- [ ] Heart icon on business cards and detail page.
- [ ] Toggle saves/unsaves the business.
- [ ] “My Favorites” screen lists all saved businesses.
- [ ] Sync favourites across devices (authenticated users).
- [ ] Empty state with call to explore.
- [ ] Favourite status visible in search results and map.

### 3.10 User Profile
**Priority:** P0
**Description:** User management of personal information, preferences, payment methods, and notification settings.

**Acceptance Criteria**
- [ ] Edit name, email, phone, profile photo.
- [ ] Manage saved addresses (home, work).
- [ ] Manage saved payment methods (add, delete, default).
- [ ] Notification preferences (push, email, SMS) toggles.
- [ ] View booking history.
- [ ] Delete account functionality.
- [ ] Data privacy settings and links to terms/privacy policies.

### 3.11 Availability & Slot Computation
**Priority:** P0
**Description:** Core algorithm that computes bookable slots based on business hours, staff schedules, service durations, breaks, and existing bookings.

**Acceptance Criteria**
- [ ] Slots computed in real-time (or with short cache) reflecting up-to-date bookings.
- [ ] Configurable working hours per business per day, including multiple shifts.
- [ ] Staff members have individual schedules and service assignments.
- [ ] Services have durations (with optional buffer times).
- [ ] Timezone support: business timezone stored and used for slot display.
- [ ] Block overlapping appointments (double-booking prevention).
- [ ] Public holidays and special closures respected.
- [ ] Future slots up to N days (configurable, e.g., 60 days).
- [ ] Slot generation excludes already booked intervals.
- [ ] Dynamic recalculation when owner changes schedules.
- [ ] Performance: <500ms response for slot queries.

### 3.12 Shared Types & Design System
**Priority:** P0
**Description:** Centralised TypeScript types, UI components, and design tokens ensuring consistency across web and mobile.

**Acceptance Criteria**
- [ ] Shared types for User, Business, Service, Appointment, Review, etc. in a monorepo package.
- [ ] Design tokens: colours, typography, spacing, shadows, border-radius.
- [ ] Component library with Button, Input, Card, Modal, BottomSheet, etc., adhering to tokens.
- [ ] Dark mode support with token overrides.
- [ ] Responsive layouts for mobile, tablet, and admin web views.
- [ ] Accessibility: proper contrast, labels, keyboard nav.
- [ ] Storybook or similar documentation for components.

### 3.13 Reviews & Ratings
**Priority:** P1
**Description:** Customers can rate and review businesses after appointments.

**Acceptance Criteria**
- [ ] Post-appointment prompt to leave a review (0-5 stars, text).
- [ ] Reviews can include optional images.
- [ ] Moderation: reported reviews can be flagged; admin review dashboard.
- [ ] Business detail page shows average rating and review list.
- [ ] Sorting: newest, highest rated, lowest rated.
- [ ] Owner can reply to reviews.
- [ ] Abuse prevention: one review per appointment.

### 3.14 Payment Integration
**Priority:** P0
**Description:** Secure payment processing supporting credit cards, digital wallets, and voucher/promo codes.

**Acceptance Criteria**
- [ ] PCI‑DSS compliant integration via Stripe/PayPal.
- [ ] Users can add/delete saved payment methods.
- [ ] Payments processed at booking confirmation (capture).
- [ ] Partial and full refunds with manual/auto triggers.
- [ ] Payment confirmation screen and receipt email.
- [ ] Promo code validation with percentage/discount logic.
- [ ] Error handling for insufficient funds, expired cards, etc.
- [ ] Currency support based on region.

### 3.15 Notifications
**Priority:** P1
**Description:** Push, email, and SMS notifications for appointment reminders, confirmations, changes, and marketing.

**Acceptance Criteria**
- [ ] Push notifications via Firebase/APNs.
- [ ] Email templates for booking confirmation, cancellation, reminder (24h, 1h).
- [ ] In-app notification centre with read/unread status.
- [ ] Notification preferences granularity (each channel toggle).
- [ ] Deep linking from notifications to appointment details.
- [ ] Batching to avoid spam (e.g., daily summary email).
- [ ] Delivery reliability and retry mechanism (via BullMQ).

### 3.16 Provider / Business Owner Portal
**Priority:** P0
**Description:** Web/app dashboard for business owners to manage profiles, services, staff, and calendars.

**Acceptance Criteria**
- [ ] Secure registration/login for business owners (separate role).
- [ ] Dashboard with upcoming appointments, earnings summary, and quick actions.
- [ ] Business profile editing: name, description, photos, contact, social links.
- [ ] Service management: create, edit, delete services with durations, prices, buffers.
- [ ] Staff management: add/remove staff, assign services, set individual schedules.
- [ ] Working hours and holiday management.
- [ ] Real‑time calendar view with appointments, drag‑reschedule, block time.
- [ ] Booking management: confirm, cancel, modify, and add notes.
- [ ] Financial reports: revenue, transaction history, payout summaries.
- [ ] Integration with external calendars (Google, Outlook).

### 3.17 Admin Dashboard
**Priority:** P1
**Description:** Web-based admin panel to manage platform users, businesses, categories, and oversee transactions.

**Acceptance Criteria**
- [ ] Admin login with role-based access (super admin, moderator).
- [ ] User management: list, search, ban/activate, view details.
- [ ] Business management: approve new businesses, edit any, suspend.
- [ ] Category and service category CRUD.
- [ ] Transaction and refund oversight.
- [ ] Review moderation dashboard.
- [ ] System configuration: commission rates, booking window, cancellation policies.
- [ ] Analytics: new registrations, bookings, revenue charts.
- [ ] Audit logs for sensitive actions.

### 3.18 Background Jobs (BullMQ)
**Priority:** P1
**Description:** Asynchronous job processing for notifications, scheduled tasks, and heavy computations.

**Acceptance Criteria**
- [ ] BullMQ integrated with Redis for job queues.
- [ ] Jobs: send email, send push notification, process payment settlement, generate reports, compute slot cache refresh.
- [ ] Retry with exponential backoff for failed jobs.
- [ ] Scheduled jobs for appointment reminders, daily digest.
- [ ] Monitoring dashboard (Bull Board) for job status.
- [ ] Graceful error handling and logging.

## 4. Non‑functional Requirements
- **Performance:** API responses <500ms for 95th percentile, slots computation <500ms.
- **Security:** HTTPS, JWT best practices, encryption at rest, OWASP top 10 mitigation.
- **Scalability:** Horizontal scaling of API and background processors.
- **Availability:** 99.9% uptime for core booking flow.
- **Localisation:** Multi‑language and currency support (future).
- **Accessibility:** WCAG 2.1 AA compliance for all user‑facing interfaces.