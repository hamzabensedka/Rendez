# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with beauty and wellness businesses. Users can discover services, book appointments, manage bookings, and leave reviews. Business owners manage their services, staff, and schedules via a provider portal. An admin dashboard oversees the platform. Background jobs handle notifications, reminders, and slot computations.

## 2. Features

### 2.1 User Authentication
**Priority:** P0 (Must-have)
**Description:** Secure sign-up, login, and session management for customers, providers, and admins. Supports email/password and social login (Google, Apple). Includes password reset and email verification.

**Acceptance Criteria:**
- User can register with email and password; receives verification email.
- User can log in with verified credentials; JWT token issued.
- Social login (Google, Apple) works and links to existing account if email matches.
- Password reset flow: request link, receive email, set new password.
- Session persists across app restarts; token refresh mechanism.
- Logout clears session.
- Role-based access: customer, provider, admin.

### 2.2 Guest Browse & Explore
**Priority:** P1 (High)
**Description:** Unauthenticated users can browse businesses, view details, and search, but cannot book or favorite. Prompts to sign up when attempting restricted actions.

**Acceptance Criteria:**
- Guest can view home feed with featured businesses.
- Guest can search and filter businesses.
- Guest can view business detail page, services, and reviews.
- "Book Now" or "Add to Favorites" triggers sign-up prompt.
- No personal data is stored until sign-up.

### 2.3 Business Search & Discovery
**Priority:** P0
**Description:** Full-text search with filters (category, location, rating, price, availability). Results sorted by relevance, distance, or rating. Includes autocomplete and recent searches.

**Acceptance Criteria:**
- Search bar with autocomplete for business names and categories.
- Filters: category, subcategory, location (city/zip), rating, price range, availability (date/time).
- Results display business name, rating, distance, next available slot, thumbnail.
- Sorting: relevance, distance, rating, price low-high.
- Infinite scroll pagination.
- Recent searches saved for logged-in users.

### 2.4 Map-based Search
**Priority:** P1
**Description:** Interactive map showing business locations. Users can move map to update results, view business pins, and tap for details.

**Acceptance Criteria:**
- Map view toggle on search results.
- Business pins with rating and availability indicator.
- Tap pin to show summary card; tap card to go to detail.
- Map re-centers and fetches businesses as user pans.
- Clustering for dense areas.
- Works with location permissions; fallback to default city.

### 2.5 Business Detail View
**Priority:** P0
**Description:** Comprehensive business profile: photos, description, services, staff, reviews, location, hours, and booking CTA.

**Acceptance Criteria:**
- Image gallery with swipe.
- Business name, rating, review count, address, phone, website.
- Operating hours with timezone.
- List of services with duration, price, and description.
- Staff list with photo, specialties, and rating.
- Reviews section with summary and individual reviews.
- Sticky "Book" button.
- Share business profile.
- Favorite/unfavorite toggle.

### 2.6 Service Categories
**Priority:** P0
**Description:** Hierarchical category system (e.g., Hair > Haircut, Coloring). Used for discovery, filtering, and provider service setup.

**Acceptance Criteria:**
- Admin can manage categories (CRUD) via admin dashboard.
- Categories have name, icon, optional parent, and display order.
- Browse by category from home screen.
- Filter search by category/subcategory.
- Provider assigns services to categories when creating services.
- Category list cached and updated via background job.

### 2.7 Booking Flow
**Priority:** P0
**Description:** Step-by-step booking: select service, staff (optional), date/time slot, confirm details, and pay (if required). Supports guest checkout after sign-up prompt.

**Acceptance Criteria:**
- Service selection: single or multiple services (package).
- Staff selection: any or specific staff; shows availability.
- Date picker with available days highlighted.
- Time slots based on real-time availability (computed via slot engine).
- Summary screen: service, staff, date, time, price, duration.
- Optional notes field.
- Payment step if service requires prepayment; supports card and digital wallet.
- Booking confirmation with success screen and push notification.
- Handles concurrent slot booking gracefully (optimistic lock).
- Error states: slot taken, payment failed, network error.

### 2.8 Appointment Management
**Priority:** P0
**Description:** Users view upcoming and past appointments, reschedule, cancel, and rebook. Providers manage their calendar.

**Acceptance Criteria:**
- List of upcoming appointments with date, time, business, service, status.
- Past appointments with option to rebook or leave review.
- Cancel appointment (with policy: free up to X hours before).
- Reschedule: change date/time/staff; real-time availability check.
- Appointment statuses: confirmed, pending, cancelled, completed, no-show.
- Push notification reminders 24h and 1h before.
- Add to calendar (Google/Apple).
- Provider can mark appointment as completed or no-show.

### 2.9 Favorites
**Priority:** P1
**Description:** Users save favorite businesses for quick access and receive updates.

**Acceptance Criteria:**
- Heart icon on business cards and detail page.
- Favorites list in user profile.
- Sort by recently added, rating, distance.
- Notification when favorited business has new availability or promotion (opt-in).
- Sync across devices.

### 2.10 User Profile
**Priority:** P0
**Description:** Manage personal info, preferences, payment methods, notification settings, and booking history.

**Acceptance Criteria:**
- Edit name, email, phone, profile photo.
- Manage saved payment methods (add, delete, set default).
- Notification preferences: push, email, SMS toggles.
- Booking history tab.
- Favorites tab.
- Delete account with data wipe confirmation.
- Language and theme settings.

### 2.11 Availability & Slot Computation
**Priority:** P0
**Description:** Real-time slot generation based on business hours, staff schedules, service duration, buffers, breaks, and existing bookings. Handles timezone, concurrent bookings, and overrides.

**Acceptance Criteria:**
- Business sets regular weekly hours per staff.
- Staff can have custom availability (date-specific overrides).
- Service duration + buffer time before/after.
- Slots computed dynamically considering travel time (if mobile service).
- Slot engine runs on-demand and via background job for pre-computation.
- Handles multiple staff for same service; shows earliest available.
- Blocked time for holidays, breaks.
- Optimistic concurrency control when booking.
- API returns available slots for a given service, staff, date range.
- Performance: slots for 30 days computed in <2s.

### 2.12 Shared Types & Design System
**Priority:** P0
**Description:** Consistent design tokens, UI components, and shared TypeScript types across frontend and backend. Ensures brand consistency and development speed.

**Acceptance Criteria:**
- Design tokens: colors, typography, spacing, shadows, border-radius.
- Reusable components: Button, Input, Card, Modal, Avatar, RatingStars, etc.
- Shared types: User, Business, Service, Appointment, Review, etc.
- Documentation via Storybook.
- Responsive design: mobile-first, tablet and desktop adaptations.
- Accessibility: WCAG 2.1 AA compliance.

### 2.13 Reviews & Ratings
**Priority:** P1
**Description:** Customers leave star ratings and text reviews after completed appointments. Businesses display aggregate rating and reviews. Moderation tools for providers and admins.

**Acceptance Criteria:**
- After appointment completion, prompt to review.
- Rating 1-5 stars; optional text and photo.
- Review appears on business page after submission.
- Provider can respond to reviews.
- Admin can hide/delete inappropriate reviews.
- Aggregate rating updated asynchronously via background job.
- Sort reviews by recent, highest, lowest.
- Review helpfulness voting.

### 2.14 Payment Integration
**Priority:** P0
**Description:** Secure payment processing via Stripe. Supports prepayment for bookings, deposits, and cancellation fees. Payouts to providers.

**Acceptance Criteria:**
- Customer adds card via Stripe Elements; tokenized.
- Prepayment flow: hold funds, capture on service completion.
- Partial deposit option (e.g., 20%).
- Cancellation fee charged according to policy.
- Provider connects Stripe Connect account for payouts.
- Platform fee deducted automatically.
- Transaction history for customers and providers.
- PCI compliance; no raw card data stored.
- Refund processing by provider or admin.

### 2.15 Notifications
**Priority:** P0
**Description:** Push notifications, email, and SMS for booking confirmations, reminders, cancellations, promotions, and chat. User-configurable.

**Acceptance Criteria:**
- Push notifications via Firebase Cloud Messaging.
- Email via SendGrid or similar.
- SMS via Twilio (optional).
- Triggers: booking confirmed, reminder 24h/1h before, cancelled, rescheduled, completed, review request, new message.
- Notification center in app with read/unread.
- Deep linking to relevant screen.
- Background job queues notification dispatch.
- Rate limiting to avoid spam.

### 2.16 Provider / Business Owner Portal
**Priority:** P0
**Description:** Web and mobile portal for providers to manage business profile, services, staff, schedules, bookings, and clients. Analytics dashboard.

**Acceptance Criteria:**
- Business profile editing: name, description, photos, address, hours, contact.
- Service management: CRUD with category, duration, price, buffer, description.
- Staff management: invite staff, set roles, manage schedules, assign services.
- Calendar view: daily/weekly/monthly, color-coded by staff, drag-and-drop reschedule.
- Booking management: view, confirm, cancel, mark complete/no-show, add notes.
- Client list with history and notes.
- Basic analytics: bookings count, revenue, popular services, occupancy rate.
- Notification preferences for new bookings, cancellations.
- Multi-language support.

### 2.17 Admin Dashboard
**Priority:** P1
**Description:** Super admin panel to manage platform: businesses, users, categories, reviews, disputes, and platform settings. Analytics and reporting.

**Acceptance Criteria:**
- Dashboard with KPIs: total bookings, GMV, active users, new businesses.
- Business management: approve/reject, suspend, view details.
- User management: list, search, suspend, view activity.
- Category management: CRUD hierarchy.
- Review moderation: flag, hide, delete.
- Dispute resolution: view booking issues, refund requests.
- Platform fee configuration.
- Promo code management.
- System health: job queues, error logs.
- Role-based access: super admin, support agent.

### 2.18 Background Jobs (BullMQ)
**Priority:** P0
**Description:** Asynchronous processing for non-blocking tasks: slot computation, notifications, email, payment capture, data cleanup, analytics aggregation.

**Acceptance Criteria:**
- BullMQ queues: notifications, emails, slot-generation, payment-capture, cleanup.
- Slot generation job: triggered on schedule change, new booking, or daily pre-compute.
- Notification job: dispatch push/email/SMS with retry and backoff.
- Payment capture job: capture authorized payments after service completion.
- Cleanup job: remove expired tokens, old logs.
- Dashboard for monitoring queues (Bull Board).
- Graceful failure handling and dead letter queue.
- Concurrency and rate limiting per queue.

## 3. Priority Summary
- **P0 (Must-have):** User Authentication, Business Search & Discovery, Business Detail View, Service Categories, Booking Flow, Appointment Management, User Profile, Availability & Slot Computation, Shared Types & Design System, Payment Integration, Notifications, Provider Portal, Background Jobs.
- **P1 (High):** Guest Browse & Explore, Map-based Search, Favorites, Reviews & Ratings, Admin Dashboard.
- **P2 (Nice-to-have):** Advanced analytics, loyalty program, multi-language content, chat between customer and provider.

## 4. Non-Functional Requirements
- Performance: API response <200ms p95, slot computation <2s.
- Security: HTTPS, JWT, rate limiting, input sanitization, PCI compliance.
- Scalability: horizontal scaling for API and workers.
- Reliability: 99.9% uptime, graceful degradation.
- Accessibility: WCAG 2.1 AA.
- Localization: i18n support for UI; timezone-aware scheduling.

## 5. Assumptions & Dependencies
- Stripe for payments, Firebase for push, SendGrid for email, Twilio for SMS (optional).
- BullMQ with Redis for job queues.
- PostgreSQL for primary database, Redis for caching.
- Cloud storage (S3) for images.
- Mapbox or Google Maps for map features.
- Social login via OAuth.

## 6. Glossary
- **Provider/Business Owner:** Salon or wellness professional using the platform.
- **Customer/User:** End-user booking services.
- **Slot:** A bookable time interval for a specific service and staff.
- **Buffer:** Extra time before/after a service for preparation/cleanup.
- **GMV:** Gross Merchandise Value, total booking value.