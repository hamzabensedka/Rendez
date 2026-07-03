# Planity Clone Product Specification

## 1. Product Vision
Planity Clone is a mobile-first booking platform connecting customers with local beauty and wellness businesses. It enables guests to discover services, book appointments, and manage schedules, while providers manage calendars and clients, and admins oversee the ecosystem. The app prioritises a seamless booking flow, real-time slot computation, and provider self-service.

## 2. User Roles
- **Guest**: Unauthenticated browser – can search, view business details, services, and reviews, but cannot book.
- **Registered User**: Authenticated customer – full booking, favourites, profile, payment and notifications.
- **Provider / Business Owner**: Manages a single business, staff, services, availability, bookings, and reviews.
- **Admin**: Super user – manages all businesses, users, disputes, and system settings via a dashboard.

All features below are specified per role.

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority**: P0 (MVP)  
**Description**: Allow users to create accounts, log in, and recover passwords. Support social login (Google, Apple) and email/password. Session management with token refresh.

**Acceptance Criteria**:
- User can sign up with email, first name, last name, password, accept terms. (P0)
- User receives verification email with link; account activated on click. (P0)
- User can log in with email/password, receive JWT access + refresh token. (P0)
- User can log in via Google/Apple SSO (P1).
- Forgot password flow: enter email → link to reset → new password set. (P0)
- Protected routes: dashboard, bookings, profile require auth; redirect to login. (P0)
- Logout clears tokens and local state. (P0)
- Refresh token rotation: when access token expires, client uses refresh token to get a new pair; old refresh token invalidated. (P1)
- Biometric unlock (optional) for faster re-entry (P2).

---

### 3.2 Guest Browse & Explore
**Priority**: P0  
**Description**: Guests can explore the platform without signing up. They can search businesses, view details, services, galleries and reviews, but the booking button prompts login.

**Acceptance Criteria**:
- Home screen shows featured businesses, categories, and recent reviews (P0).
- Guest can use text search and map (if enabled) to discover businesses (P0).
- Guest can open a business detail view, see all tabs (Info, Services, Reviews, Gallery) (P0).
- Service list shows duration, price; no “Book” button – instead “Login to book”. (P0)
- Tap on any booking CTA opens login/signup screen, after successful login, returns to same business. (P0)
- All guest actions are anonymous; no data stored. (P0)

---

### 3.3 Business Search & Discovery
**Priority**: P0  
**Description**: Full-text search with autocomplete, filters by location, category, rating, price, and availability (instant bookable).

**Acceptance Criteria**:
- Search bar on home screen with autocomplete (business name, category, service). (P0)
- Search results show list of businesses: avatar, name, rating, address distance, next available slot snippet. (P0)
- Filter panel: location (current or manual), radius, category, subcategory (e.g., Hair > Women's Haircut), price range, rating, business hours (open now); apply real-time. (P0)
- Sort by relevance, distance, rating, price low-high, soonest availability. (P1)
- Empty state: “No businesses found” with clear filter button. (P0)
- Paginated infinite scroll. (P0)
- Server-side search with MongoDB text index or Elasticsearch (P1).

---

### 3.4 Map-based Search
**Priority**: P1  
**Description**: Interactive map view to discover businesses near a location. Overlaps with text search; both share results.

**Acceptance Criteria**:
- Toggle map/list view on search results (P1).
- Map shows user’s current location (ask permission) and business markers. (P1)
- Tapping a marker shows a mini card: name, rating, distance, next slot; tap card goes to detail. (P1)
- Map recenters as user pans, fetching businesses in viewport (debounced). (P1)
- Clustering of markers when zoomed out (P2).
- Integrated with Google Maps / Mapbox (P1).

---

### 3.5 Business Detail View
**Priority**: P0  
**Description**: The screen that sells a business. Shows all information needed for a booking decision.

**Acceptance Criteria**:
- Header with cover image, avatar, name, average rating, total reviews, distance, address (P0).
- Tabs: Info (description, amenities, opening hours today), Services (list grouped by category), Reviews (paginated), Gallery (image grid with lightbox). (P0)
- Service list item shows name, duration, price; tap opens a booking flow for that service. (P0)
- Share button that copies a link to the business. (P1)
- Favourite (heart icon) toggle if logged in. (P0)
- Dynamic “Next available” callout: e.g., “Next slot: Today 14:00” computed from real availability. (P1)

---

### 3.6 Service Categories
**Priority**: P0  
**Description**: Hierarchical category tree browsable independently, linking to search. Used for discovery and provider onboarding.

**Acceptance Criteria**:
- Category browsing from home screen: top-level tiles (Hair, Nails, Massage, Skin, etc.) (P0).
- Tapping a category shows subcategories with icons (e.g., Hair → Women's Haircut, Coloring, Styling). (P0)
- Tapping a subcategory navigates to search results filtered by that subcategory. (P0)
- Categories are configured in admin; providers assign categories to services. (P0)
- Categories also used in onboarding flow for provider service creation. (P0)

---

### 3.7 Booking Flow
**Priority**: P0  
**Description**: The core transaction funnel from service selection to confirmed appointment. Optimised for speed and clarity.

**Acceptance Criteria**:
- Start from service card: “Book” button opens step-by-step modal or full-screen flow. (P0)
- Step 1 – Date & Staff: calendar picker (future dates only, up to 3 months), show staff members for the service; each staff shows next available slot inline. Select staff or “Any”. (P0)
- Step 2 – Time: time slots based on computed availability (see 3.11). Show morning/afternoon/evening segments; past times disabled, busy slots greyed out. Tap to select. (P0)
- Step 3 – Confirm: summary (business, service, staff, date/time, price, duration), “Add note” optional, “Apply promo code” optional (P2). (P0)
- Payment step if service requires prepayment (P1). Otherwise “Confirm booking” completes and booking is created with payment pending. (P0)
- Loading states and error handling (slot already taken, network). (P0)
- After confirmation, success screen with booking summary and options: Add to calendar, Share, View appointment. (P0)
- Deep link from notifications opens booking details. (P1)

---

### 3.8 Appointment Management
**Priority**: P0  
**Description**: Users manage their upcoming and past appointments.

**Acceptance Criteria**:
- “My Appointments” list separated into Upcoming and Past tabs. (P0)
- Each appointment card: business name, service, date/time, staff, status (Confirmed, Pending, Completed, Cancelled), and quick actions. (P0)
- Tap to open detail: full info, provider contact, map link, add to calendar, cancel/reschedule buttons (based on cancellation policy, e.g., up to 24h before). (P0)
- Cancel flow: confirm dialog, optional reason, refund processing if prepaid. Cancelled slot released. (P0)
- Reschedule flow: reuse booking flow but pre-filled, update appointment; validate slot, send notifications. (P1)
- Upcoming appointments sorted by nearest time. (P0)
- Past appointments allow rebooking (direct to same service) and leaving a review. (P0)

---

### 3.9 Favourites
**Priority**: P1  
**Description**: Users can bookmark businesses for quick access.

**Acceptance Criteria**:
- Heart icon on business cards and detail view; toggle saves/removes. (P1)
- Favourite list accessible from profile tab, shows grid of favoured businesses. (P1)
- Sort by recently added, name, or rating. (P1)
- Tap on a favourite navigates to business detail. (P1)
- Sync favourites across devices (P1).

---

### 3.10 User Profile
**Priority**: P0  
**Description**: Central place for personal info, settings, and history.

**Acceptance Criteria**:
- Avatar, name, email, phone (optional). Editable. (P0)
- Saved addresses (for quicker booking location). (P1)
- Notification preferences: push, email, SMS (P1).
- Payment methods management (if integrated). (P1)
- Link to Favourites, Appointments, Reviews given by user. (P0)
- Account deletion flow with data wipe confirmation. (P1)
- App settings: language, theme (P2).

---

### 3.11 Availability & Slot Computation
**Priority**: P0  
**Description**: Engine that calculates bookable time slots for a given service, staff, and date. Consumes business hours, staff schedules, existing appointments, buffers, holidays, and service durations.

**Acceptance Criteria**:
- Defined as a shared service (Node.js / background job) used by booking flow and provider calendar. (P0)
- Input: business id, service id, staff id (optional), date. (P0)
- Business hours: weekly schedule with multiple windows per day (e.g., Mon 09:00-12:00, 14:00-18:00). Provider sets these. (P0)
- Staff availability: overrides business hours per staff member (custom schedule or inherit). (P0)
- Service duration: fixed duration from service config, plus optional buffer time before/after (configurable). (P0)
- Exclude existing appointments (any status that blocks: Confirmed, Pending) that overlap in time for that staff. (P0)
- Exclude holidays/blocked dates per business or staff. (P1)
- Generate slots at configurable interval (default 15 min) starting from earliest opening; slot is valid if start + duration + buffer fits before next blocked time. (P0)
- Results: array of time slot strings (ISO), each with a marker if it has limited availability (e.g., end-of-day). (P0)
- Performance: cached per business/date, invalidated by new bookings or schedule changes via BullMQ events. (P0)
- Support parallel booking: if a slot is taken before confirmation, show error. (P0)
- Slot computation also exposed via API for provider calendar and admin to debug. (P0)

---

### 3.12 Shared Types & Design System
**Priority**: P0 (foundational)  
**Description**: A centralised design system and shared TypeScript types/interfaces to ensure consistency across frontend (React Native) and backend (Node.js). Includes colour palette, typography, spacing, reusable components, and API contracts.

**Acceptance Criteria**:
- Design tokens defined in a shared package: primary/secondary colours, fonts (size, weight), spacing scale, border radius, shadows. (P0)
- Core UI components: Button (variants: primary, secondary, outline, ghost), Input (text, select, date picker), Card, Avatar, Badge, StarRating, Modal, BottomSheet, Toast, Skeleton loaders. Each with documented props and states. (P0)
- Shared types: `Business`, `Service`, `Staff`, `Booking`, `User`, `Review`, `TimeSlot`, `BusinessHours`, `Category`, etc. (P0)
- Zod/joi validation schemas shared between front-end forms and API validation. (P0)
- Component library built with React Native + React Native Web? (P1) if web admin needed. (P1)
- Storybook or equivalent for documentation (P2).

---

### 3.13 Reviews & Ratings
**Priority**: P1  
**Description**: Users can leave a star rating and text review for a business after a completed appointment. Businesses display aggregate rating and recent reviews.

**Acceptance Criteria**:
- After appointment marked Completed, push notification and in-app prompt to “Rate your experience”. (P1)
- Review form: 1-5 star tap, title, written review, optional photo. (P1)
- Submission validates: one review per user per booking (duplicate prevention). (P1)
- Reviews are public immediately (or moderated via admin toggle). (P1)
- Business detail shows average rating, total reviews, latest reviews with pagination. (P1)
- Provider can reply to a review (one-level comment). (P2)
- User can edit their review within 48h. (P2)
- Admin can hide/report reviews. (P2)

---

### 3.14 Payment Integration
**Priority**: P1  
**Description**: Stripe integration for prepayment, deposits, or no-show fees. Supports stored payment methods and payout to providers (future).

**Acceptance Criteria**:
- Booking flow displays price; if provider requires prepayment or deposit, a payment step is inserted after slot selection. (P1)
- User enters card details via Stripe Elements; card stored (if opted) for future use. (P1)
- Secure handling: PCI DSS compliance via Stripe, no card numbers on server. (P1)
- Payment processed upon booking confirmation; booking status set to “Confirmed” only after successful charge. (P1)
- Refund flow on cancellation: full/partial refund based on policy, triggered by provider or admin. (P1)
- Receipts generated and emailed (P2).
- Payout to providers via Stripe Connect (future phase P2).
- Support for promo codes (discount percentage or fixed amount) applied before charge (P2).

---

### 3.15 Notifications
**Priority**: P0  
**Description**: Multi-channel push and in-app notifications for booking lifecycle, reminders, and promotions.

**Acceptance Criteria**:
- Push notifications using Firebase Cloud Messaging (FCM) for both iOS and Android. (P0)
- Transactional emails via SendGrid/Mailgun for booking confirmations, cancellations, reminder 24h before appointment. (P0)
- In-app notification bell with list of recent notifications, mark read/unread, tap to open relevant screen. (P1)
- Notification types: booking confirmed, cancelled, rescheduled, reminder, review request, promotional (admin). (P0)
- User can configure notification preferences in profile: toggle push, email, sms per type. (P1)
- Provider gets notifications for new bookings, cancellations, and new reviews. (P0)
- Background processing for sending at scale via BullMQ queues: send-push, send-email. (P0)
- Deep linking: tapping a notification opens the corresponding appointment or business. (P1)

---

### 3.16 Provider / Business Owner Portal
**Priority**: P0 (MVP for business onboarding and management)  
**Description**: A dedicated interface (web or mobile app section) for business owners to manage their listing, services, staff, schedule, and bookings.

**Acceptance Criteria**:
- Registration flow: Business sign-up with details (name, category, address, phone), then verification by admin before going live. (P0)
- Dashboard: Today’s appointments, quick stats (upcoming bookings, revenue estimate). (P0)
- Business Profile: edit name, description, category, address, phone, social links, upload logo/cover images. Changes go live immediately. (P0)
- Services management: CRUD for services with name, description, duration, price, category, buffer time, visibility toggle. Reorder by drag. (P0)
- Staff management: list staff, add/edit/delete, assign services, set custom working hours (overrides business hours). (P0)
- Business Hours: weekly schedule with multiple sessions, holiday/closure dates. Any change invalidates cached slots. (P0)
- Calendar view: day/week/month agenda with all bookings; colour by status. Click to see details, cancel/reschedule, mark no-show (with fee option). (P0)
- Booking management: manual booking creation for walk-ins (overrides slot availability check). (P1)
- Client list: search, see history, notes. (P1)
- Reports: basic booking and revenue summary (P2).
- Account settings: notification preferences, payment/bank details for future payouts. (P1)

---

### 3.17 Admin Dashboard
**Priority**: P1  
**Description**: Web-based admin panel for super admins to manage the platform, approve businesses, moderate reviews, and configure system.

**Acceptance Criteria**:
- Admin login with role-based access (separate from user auth). (P1)
- Dashboard: high-level metrics (total businesses, bookings, revenue, active users). (P1)
- Business management: list/search businesses, view details, approve/reject new businesses, enable/disable listings, edit any field. (P1)
- User management: search users, view profile, booking history, disable accounts. (P1)
- Booking oversight: view all bookings, cancel on behalf, process refunds. (P1)
- Review moderation: see flagged reviews, hide/unhide, delete. (P1)
- Category management: add/edit/delete categories and subcategories. (P1)
- System config: set global cancellation policy, service fees, notification templates (P2).
- Role and permission system for multiple admins (P2).

---

### 3.18 Background Jobs (BullMQ)
**Priority**: P0 (architectural)  
**Description**: Asynchronous processing for non-realtime tasks: notifications, slot cache invalidation, scheduled reminders, reporting.

**Acceptance Criteria**:
- Redis-backed BullMQ queues for: `send-email`, `send-push`, `slot-recompute`, `booking-reminders`, `cleanup`. (P0)
- When booking created/cancelled/rescheduled, a job is added to `send-email` and `send-push` queues for both user and provider. (P0)
- `slot-recompute`: on business schedule change, staff change, service duration change, or new booking in a time window, a job is enqueued to recalculate and cache availability for affected dates. Debounced. (P0)
- `booking-reminders`: scheduled job 24h before appointment to send reminder push/email. (P0)
- `cleanup`: remove expired tokens, old notifications, soft-deleted data. (P1)
- Monitoring via Bull Board or similar dashboard for admins (P1).
- Retry with exponential backoff, dead-letter queue for failed jobs. (P0)

---

## 4. Non-Functional Requirements
- **Performance**: Slot computation response < 300ms; app screens load < 2s on 4G.
- **Scalability**: Horizontal scaling of API, Redis cluster for queues, CDN for images.
- **Security**: OWASP Top 10 covered, SSL pinning, JWT secure, Stripe PCI.
- **Offline**: Basic cached data visible (business info) when offline; interactive only when online.
- **Localisation**: Support at least English and French text, with easy addition of new languages (P2).

---

## 5. Priorities Summary
**P0 (MVP – Must have)**: User Authentication, Guest Browse & Explore, Business Search & Discovery, Business Detail View, Service Categories, Booking Flow, Appointment Management, Availability & Slot Computation, Shared Types & Design System (foundation), Notifications (push/email for booking lifecycle), Provider portal (core business management, services, staff, calendar), Background Jobs infrastructure.

**P1 (Important – 2nd phase)**: Map-based search, Favourites, User Profile enhancements (addresses, payment methods), Reviews & Ratings, Payment Integration (Stripe prepayment), Admin Dashboard, Notification preferences and in-app bell.

**P2 (Nice to have)**: Biometric auth, map clustering, promo codes, provider replies to reviews, advanced reports, multi-language, dark theme.

This specification is a living document and will be updated as feedback from development and user testing is received.