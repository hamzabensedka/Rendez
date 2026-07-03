# Product Specification: Planity Clone

## 1. Introduction
Planity Clone is a mobile-first salon & wellness booking platform that connects customers with local beauty and wellness providers. It enables service discovery, real‑time appointment booking, integrated payments, and a full provider‑facing business management suite. This document defines all functional requirements, acceptance criteria, and priorities for the initial release.

### 1.1 Goals
- Deliver a seamless end‑to‑end booking experience for customers.
- Provide providers with a self‑service portal to manage services, schedules, and appointments.
- Enable platform administrators to oversee operations and resolve issues.
- Build a scalable, maintainable codebase with a unified design system.

### 1.2 Scope
Covers all features listed in the SOW: User Authentication, Guest Browsing, Business Search & Discovery, Map‑based Search, Business Detail View, Service Categories, Booking Flow, Appointment Management, Favorites, User Profile, Availability & Slot Computation, Shared Types & Design System, Reviews & Ratings, Payment Integration, Notifications, Provider Portal, Admin Dashboard, and Background Jobs (BullMQ).

## 2. User Roles
- **Anonymous Guest** – No account required; can browse, search, view businesses and services, read reviews. Cannot book or save favorites.
- **Registered Customer** – Authenticated user; can book appointments, manage favorites, submit reviews, manage profile and payment methods.
- **Provider / Business Owner** – Manages a registered business; can set services, availability, staff, view bookings, and respond to reviews.
- **Admin** – Platform super‑user; manages all businesses, users, reviews, and system settings; accesses analytics and moderation tools.

## 3. Features & Acceptance Criteria

### 3.1 User Authentication
**Priority:** Must‑have  
**Description:** Secure registration and login for customers and providers using email/password and social sign‑in (Google, Apple). Session persistence and password reset.

**Acceptance Criteria:**
- User can sign up with email/password; must verify email before first booking.
- User can log in with email/password or social provider (Google, Apple).
- Forgotten password flow sends reset link; user can set new password.
- JWT‑based session persists across app restarts until explicit logout.
- Errors (invalid credentials, duplicate email) show inline messages.
- Provider registration is a separate flow that requires business details (see Provider Portal).

### 3.2 Guest Browse & Explore
**Priority:** Must‑have  
**Description:** Anonymous users can explore the platform without creating an account. All read‑only features remain accessible.

**Acceptance Criteria:**
- Guest lands on a homepage with featured businesses and categories.
- Full search and map functionality works without login.
- Business detail pages, reviews, and service info are fully visible.
- Attempting to book, favorite, or write a review prompts sign‑up/login modal.
- Guest can seamlessly transition to registration/sign‑in with deep‑linking back to intended action.

### 3.3 Business Search & Discovery
**Priority:** Must‑have  
**Description:** Customers can find businesses by name, keyword, location, or category. Results are sortable and filterable.

**Acceptance Criteria:**
- Search bar accepts business name, service keyword, or neighborhood.
- Filters: price range, rating, distance, availability (today/this week), category, amenities (e.g., parking, WiFi).
- Sort options: relevance, rating, distance, price (low‑high/high‑low).
- Results update in real‑time as filters change.
- Empty state with suggestions when no results match.
- Search history saved for logged‑in users.

### 3.4 Map‑based Search
**Priority:** Must‑have  
**Description:** Interactive map view to explore businesses geographically. Tightly integrated with search filters.

**Acceptance Criteria:**
- Toggle between list and map view on search results.
- Map displays pins for each business; pin clustering at higher zoom levels.
- Tapping a pin shows a compact card with name, rating, distance, and “View details” link.
- User location button centers map on device GPS.
- Radius slider to dynamically filter businesses within X km/miles.
- Map respects all applied filters and sorting; results update after panning/zooming (viewport‑based search).

### 3.5 Business Detail View
**Priority:** Must‑have  
**Description:** Comprehensive business profile with all information needed to decide and book.

**Acceptance Criteria:**
- Display: business name, cover image, gallery, rating, review count, address, distance, open hours (today), description, amenities.
- Customer reviews (paginated) with overall rating breakdown (stars).
- List of services grouped by categories; each service shows name, duration, price.
- “Book” button prominently per service; if multiple staff, allow staff selection where applicable.
- Share button (native share sheet) with deep link.
- Favourite/unfavourite toggle (heart icon) for logged‑in users.
- Map snippet showing location with one‑tap directions.

### 3.6 Service Categories
**Priority:** Must‑have  
**Description:** Hierarchical taxonomy of services for organisation and discovery.

**Acceptance Criteria:**
- Predefined categories (Hair, Nails, Massage, Skin, etc.) managed by admin.
- Each category has an icon and optional sub‑categories (e.g., Hair → Coloring, Styling).
- Homepage and search allow browsing by category.
- Providers can assign multiple categories to their business and per‑service tags.
- Admin can add, edit, hide categories without code deployment.

### 3.7 Booking Flow
**Priority:** Must‑have  
**Description:** Step‑by‑step wizard for selecting service, staff, date/time, and confirming booking. Handles real‑time availability.

**Acceptance Criteria:**
- Step 1: Choose service from provider’s list; optionally select staff member.
- Step 2: Select date (calendar with blocked days greyed out) and time slot from available slots computed in real‑time.
- Step 3: Review summary (business, service, staff, date, time, duration, price, any add‑ons).
- Step 4: Add optional notes, select or add payment method, apply promo code if available.
- Step 5: Confirm booking – locks slot immediately (optimistic lock); payment captured.
- Error handling: if slot taken during flow, show message to re‑select time.
- Booking confirmation screen with details and option to add to calendar.

### 3.8 Appointment Management
**Priority:** Must‑have  
**Description:** Customers can view, modify, and cancel upcoming appointments. Providers see all bookings in their portal.

**Acceptance Criteria:**
- Customer “My Appointments” list: upcoming and past, sortable by date.
- Upcoming appointment card shows date, time, business, service, status.
- Actions: reschedule (same flow as booking but modifies existing), cancel (with confirmation and cancellation policy check), add to calendar, get directions.
- Past appointments: allows re‑booking and writing a review.
- Cancellation policy enforced (e.g., free cancel up to 24h before).
- Push notification and email on booking, reschedule, cancellation.
- Provider sees all appointments for their business with ability to cancel/modify on customer’s behalf (see Provider Portal).

### 3.9 Favorites
**Priority:** Should‑have  
**Description:** Customers can save favorite businesses for quick access.

**Acceptance Criteria:**
- Heart icon on business card and detail page toggles favorite state.
- Dedicated “Favorites” tab in customer profile shows saved businesses.
- List displays basic info, rating, and quick “Book” action.
- If a favorited business is unavailable, show message but keep in list.
- Sync across devices for same account.

### 3.10 User Profile
**Priority:** Must‑have  
**Description:** Central place for customers to manage personal information, payment methods, notification preferences, and booking history.

**Acceptance Criteria:**
- Edit profile: name, phone, profile photo, password change.
- Manage payment methods: add/delete credit/debit cards (via Stripe); set default.
- Notification preferences: toggle push, email, SMS per category (booking reminders, promotions).
- View booking history (pagination).
- Linked accounts (social logins) display.
- Account deletion option with confirmation and data wipe notice.

### 3.11 Availability & Slot Computation
**Priority:** Must‑have  
**Description:** Engine that computes real‑time available time slots based on provider schedules, staff, service duration, buffer times, and existing bookings.

**Acceptance Criteria:**
- Provider defines weekly recurring working hours per staff member (ex: Mon–Fri 09:00–18:00).
- Staff can have custom date overrides (holidays, extra hours) via provider portal.
- Service duration plus configurable buffer (before/after) determines slot length.
- Exclusive staff assignment: if a service requires a specific staff member, only their calendar is considered.
- Concurrency: multiple staff can be booked simultaneously; slot is available if at least one qualified staff free.
- Bookings reduce availability for that slot; cancellations release it immediately.
- API endpoint `/slots` returns available times for a given business/service/staff/date, grouped by staff or as unified list.
- Slot computation must handle timezones (provider’s local time) and DST transitions.
- Response time < 200ms under normal load.

### 3.12 Shared Types & Design System
**Priority:** Must‑have  
**Description:** Unified TypeScript types/interfaces and a consistent UI component library shared across web and mobile (React Native) apps.

**Acceptance Criteria:**
- `@planity/shared-types` package defines interfaces for User, Business, Service, Booking, Review, Slot, etc.
- Design system package `@planity/design-system` contains reusable components (Button, Input, Card, Modal, Calendar, RatingStars) with theming support.
- Components comply with WCAG 2.1 AA accessibility standards.
- Documentation (Storybook) for all components with usage examples.
- Versioned releases; breaking changes communicated via changelogs.
- Both apps import types and components from these packages.

### 3.13 Reviews & Ratings
**Priority:** Should‑have  
**Description:** Customers can rate and write reviews for completed appointments. Providers can respond.

**Acceptance Criteria:**
- After appointment completed, push notification and email prompt to leave a review.
- Rating scale 1‑5 stars; mandatory text review (min 10 characters).
- Optional photo upload (up to 3 images) with moderation.
- Review appears on business detail page, aggregated into overall rating and star breakdown.
- Provider can post a single public response to each review via provider portal.
- Admin moderation: ability to hide/report reviews, ban users.
- Reviews sorted by most recent or most helpful; helpful voting (thumbs up/down) for logged‑in users.

### 3.14 Payment Integration
**Priority:** Must‑have  
**Description:** Secure payment processing via Stripe. Handles one‑time appointment payments, cancellation fees (if applicable), and refunds.

**Acceptance Criteria:**
- Customer adds card details that are tokenized via Stripe Elements / React Native SDK.
- Payment is captured at booking confirmation; pre‑authorization for $0 amount to validate card.
- Provider defines cancellation fee policy; fee captured automatically when booking cancelled outside free window.
- Full refunds processed manually by admin or provider (with admin approval for amounts > $X).
- All transactions logged with status, timestamps, and Stripe PaymentIntent ID.
- PCI‑DSS compliance by using Stripe’s secure tokenization; no raw card data stored.
- Support for Apple Pay / Google Pay as alternative payment methods (if Stripe wallet enabled).

### 3.15 Notifications
**Priority:** Should‑have (Push/Email must for booking lifecycle; marketing optional)  
**Description:** Multi‑channel notifications (push, email, optional SMS) for booking updates, reminders, and marketing.

**Acceptance Criteria:**
- Customer receives: booking confirmation (instant), reminder (24h before), reschedule/cancellation confirm, review prompt after service.
- Provider receives: new booking alert, cancellation alert.
- Admin: daily summary of new registrations/pending approvals (email).
- Notification preferences respected; opt‑out per channel per category.
- Push notifications via Firebase Cloud Messaging (FCM); email via SendGrid/SES.
- Notification history in user and provider profiles.
- Deep linking: tapping push opens relevant screen (booking details, business page).

### 3.16 Provider / Business Owner Portal
**Priority:** Must‑have  
**Description:** Web dashboard for providers to manage their business, services, staff, schedule, and appointments.

**Acceptance Criteria:**
- Registration: provider signs up, creates business profile (name, address, phone, categories, description, photos, operating hours). Admin approval required before going live.
- Dashboard overview: today’s appointments count, revenue summary, upcoming bookings.
- Calendar view: day/week/month with all bookings; ability to block time manually.
- Appointment management: view, reschedule, cancel (with reason) any booking; mark as no‑show/complete.
- Services management: CRUD for services (name, duration, price, category, buffer time, staff assignment).
- Staff management: add/edit staff members with individual working hours, overrides, and service assignment. Each staff has a color for calendar.
- Availability overrides: define custom dates (holidays, extended hours) per staff.
- Reviews: view all reviews and respond publicly.
- Settings: notification preferences, stripe connect onboarding, cancellation policy definition.
- All changes reflect in customer‑facing app in near real‑time (<1 min).

### 3.17 Admin Dashboard
**Priority:** Must‑have  
**Description:** Web‑based administration panel for platform oversight, moderation, and analytics.

**Acceptance Criteria:**
- Secure login with role‑based access (Super Admin, Support).
- Dashboard widgets: total users, businesses, bookings, revenue (daily/weekly/monthly).
- Business management: approve/reject new registrations, suspend/unsuspend, edit any business details, view commission reports.
- User management: search users, view profiles, ban/unban, reset passwords.
- Review moderation: view flagged reviews, hide/show, delete.
- Appointment management: view any booking, cancel/refund if needed.
- Service category management: add/edit/hide categories.
- System configuration: commission rates, cancellation windows, email templates, feature toggles.
- Audit log for critical actions (e.g., refund > $100).

### 3.18 Background Jobs (BullMQ)
**Priority:** Must‑have  
**Description:** Asynchronous job processing for time‑sensitive and heavy tasks using BullMQ with Redis.

**Acceptance Criteria:**
- Jobs include: appointment reminders (24h, 1h before), review prompts (2h after completion), email sending, data export, cleanup of expired guest carts, daily analytics aggregation.
- Reminder job enqueued at booking creation with a delay; if booking rescheduled/cancelled, job is removed or updated.
- Failed jobs retried with exponential backoff; dead letter queue for after max retries.
- Admin dashboard shows queue status, job counts, and allows manual retry/failure inspection.
- All jobs idempotent where possible.
- Graceful shutdown handling.

## 4. Non‑Functional Requirements
- **Performance:** Page load < 2s, slot API < 200ms, search results < 1s.
- **Scalability:** Designed to handle 10k concurrent slot requests; horizontal scaling supported.
- **Security:** TLS everywhere, input sanitization, rate limiting on auth and slot endpoints, role‑based access control, OWASP top‑10 protections.
- **Availability:** 99.9% uptime SLA for customer‑facing services.
- **Accessibility:** WCAG 2.1 AA for all customer‑facing interfaces.
- **Localization:** UI strings externalised; date, time, currency formats respect locale (initial focus EN, FR).

## 5. Assumptions & Dependencies
- Stripe as payment processor; Stripe Connect for provider payouts.
- Map services via Mapbox or Google Maps.
- Push notifications via Firebase Cloud Messaging.
- Email delivery via SendGrid or AWS SES.
- Redis and PostgreSQL as primary data stores.
- BullMQ depends on Redis; job workers must be deployed alongside API.
- Provider onboarding requires business verification (admin approval) before going live.
- Customers must create an account to book, but can browse as guest.

## 6. Glossary
- **Slot:** A time window available for booking (e.g., 10:00–10:30).
- **Buffer:** Extra time added before/after a service to allow preparation or cleanup; not part of billable duration.
- **Cancellation window:** Period before appointment during which free cancellation is allowed.
- **Provider:** Business owner or staff member acting on behalf of a registered business.
- **Staff:** Individual service professional within a business (can be same as provider or separate).