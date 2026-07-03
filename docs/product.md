# Planity Clone Product Specification

**Version**: 1.0  
**Date**: 2025-04-07  
**Author**: Alex, Product Owner

## 1. Introduction
Planity Clone is a digital platform connecting customers with local beauty and wellness businesses. It enables discovery, booking, and management of appointments. This specification defines the complete feature set, priorities, and acceptance criteria for the initial release (MVP) and subsequent phases.

**Target Users**: End customers seeking services, business providers (salons, spas, etc.), and platform administrators.

**Problem**: Customers waste time calling to find availabilities; businesses lose revenue from no-shows and inefficient scheduling.

**Solution**: A mobile-first app with real-time availability, seamless booking, reminders, and business management tools.

## 2. Project Scope

**In Scope** (MVP + Phase 1):
- User and provider authentication
- Guest browsing
- Search and discovery by text and map
- Business profiles with services
- Service categories
- Booking flow with slot computation based on real-time rules
- Appointment management (view, cancel, reschedule)
- Favorites
- User profile
- Reviews and ratings
- Payment integration (card, wallet)
- Push and in-app notifications
- Provider portal for managing services, availability, and bookings
- Admin dashboard for monitoring
- Background jobs for reminders, expiry, etc.
- Shared design system and TypeScript types

**Out of Scope**:
- Social login via Instagram/TikTok (future)
- AI-powered recommendations
- Loyalty programs
- In-app chat between customer and provider
- Multi-language support (phase 2)

## 3. Feature Specifications

Each feature includes priority (P0: Must-have, P1: High, P2: Medium), description, and acceptance criteria.

### 3.1 Shared Types & Design System
**Priority**: P0  
**Description**: Establish a unified design language and TypeScript type definitions shared across frontend (React Native) and backend (Node.js/PostgreSQL). Includes color palette, typography, spacing, components (buttons, cards, modals), and data contracts (User, Business, Service, Booking, etc.).

**Acceptance Criteria**:
- Design tokens documented and exported as a shared package.
- Type definitions for all core entities synchronized between client and server.
- All UI components implemented according to design system.
- Light/dark mode support.

---

### 3.2 User Authentication (End Customer)
**Priority**: P0  
**Description**: Allow customers to sign up, log in, and manage their session securely.

**Acceptance Criteria**:
- Email/password registration with validation.
- OTP verification for email on signup.
- JWT-based authentication with refresh tokens.
- "Forgot password" flow with email reset link.
- Social login via Google and Apple Sign-In.
- Session persistence across app restarts.
- Profile setup: first name, last name, phone number (optional).
- Error handling for expired tokens.

---

### 3.3 Guest Browse & Explore
**Priority**: P0  
**Description**: Unauthenticated users can browse businesses and services without signing up.

**Acceptance Criteria**:
- Home screen displays featured businesses and categories.
- Search bar visible without login.
- Business detail page fully accessible in guest mode.
- Attempting to book triggers sign-up/login prompt (soft gate).
- Guest can return to previous screen after authentication.

---

### 3.4 Business Search & Discovery
**Priority**: P0  
**Description**: Customers can search for businesses by name, category, or location.

**Acceptance Criteria**:
- Typeahead search with suggestions (business name and category).
- Filter by category, distance/radius, ratings, price range.
- Sort results by relevance, distance, rating, price (low/high).
- Results display business card: image, name, rating, distance, next available slot.
- Location permissions requested; if denied, manual location input.
- Pagination with infinite scroll.
- Error state for no results.
- Search history for logged-in users.

---

### 3.5 Map-based Search
**Priority**: P1  
**Description**: Visual exploration of nearby businesses on an interactive map.

**Acceptance Criteria**:
- Map view with clustered pins for businesses.
- Tapping a pin shows a preview card with business name, rating, and distance.
- Pan and zoom dynamically update visible businesses.
- Overlay to switch between list and map views.
- Map respects selected category and filters.
- Performance: load markers within viewport efficiently.

---

### 3.6 Business Detail View
**Priority**: P0  
**Description**: Comprehensive profile of a business showcasing services, reviews, photos, and availability.

**Acceptance Criteria**:
- Business info: name, description, address, contact, opening hours.
- Photo gallery with full-screen viewer.
- Service list with names, durations, prices.
- "Book" button per service or general "Book Now" that leads to service selection.
- Integrated map snippet with directions link.
- Reviews section with average rating, distribution, and individual reviews (sorted by recent/helpful).
- Favorites toggle (heart icon).
- Real-time availability summary: "Next available: Today at 2 PM".
- Loading skeleton while fetching.

---

### 3.7 Service Categories
**Priority**: P0  
**Description**: Organized taxonomy of services (e.g., Haircut, Massage, Nails) for easy browsing.

**Acceptance Criteria**:
- Hierarchical categories (parent/child) defined in database.
- Home screen category carousel.
- Category page showing subcategories and top businesses for that category.
- Search by category name.
- Categories filterable by traits (e.g., "Women's Haircut" vs "Men's Haircut").
- Admin can manage categories via admin panel.

---

### 3.8 Booking Flow
**Priority**: P0  
**Description**: Step-by-step wizard for selecting service, date/time, and confirming booking with payment.

**Acceptance Criteria**:
- Step 1: Service selection (single or multiple services from same business).
- Step 2: Date and time picker showing available slots based on real-time computation.
- Step 3: Appointment summary with price breakdown, duration, location.
- Step 4: Payment (if non-zero) via integrated gateway.
- Booking confirmation screen with appointment details and option to add to calendar.
- Error handling for slot taken by another user during booking.
- Guest users prompted to sign up/login at payment step.
- Support for promo codes (future).
- Must respect business buffer times and staff assignments.

---

### 3.9 Availability & Slot Computation
**Priority**: P0  
**Description**: Engine to calculate available time slots for a business/service based on working hours, service duration, existing bookings, and staff schedules.

**Acceptance Criteria**:
- Availability API returns time slots for a given business, service(s), date, and optional staff ID.
- Accounts for business opening hours, break times, and special holiday closures.
- Considers staff availability and service-specific duration.
- Prevents double booking by checking concurrent bookings.
- Updates in real-time when slots are taken.
- Handles multiple services combined into one appointment (total duration + buffer).
- Returns slots with staff assignment if multi-staff.
- Performance: slot computation for next 30 days within 200ms.

---

### 3.10 Appointment Management (Customer)
**Priority**: P0  
**Description**: Customers can view upcoming and past appointments, cancel, or reschedule.

**Acceptance Criteria**:
- "My Appointments" tab with upcoming and history tabs.
- Upcoming: list with appointment details, status, and action buttons.
- Cancellation policy: free cancellation up to X hours before; late cancellation fee may apply (business-defined).
- Reschedule: triggers re-booking flow retaining same services and business, selecting new slot.
- Past appointments: show details, option to leave review if not already reviewed.
- Appointment statuses: confirmed, cancelled, completed, no-show.
- Push notification update on status change.
- Sync to device calendar (optional).

---

### 3.11 Favorites
**Priority**: P1  
**Description**: Save businesses to a favorites list for quick access.

**Acceptance Criteria**:
- Heart icon on business card and detail page toggles favorite.
- Dedicated "Favorites" screen listing saved businesses.
- Sync across user's logged-in devices.
- Require authentication to save favorites; prompt if guest.
- Visual feedback on toggle (filled heart).

---

### 3.12 User Profile (Customer)
**Priority**: P1  
**Description**: Manage personal information, settings, and payment methods.

**Acceptance Criteria**:
- View/edit name, email, phone, profile picture.
- Change password.
- Saved payment methods (card on file).
- Notification preferences (email, push).
- Data privacy section (download data, delete account).
- Logout.

---

### 3.13 Reviews & Ratings
**Priority**: P1  
**Description**: Customers can rate and review businesses after appointment completion.

**Acceptance Criteria**:
- 1-5 star rating and text review (optional text).
- Review can be submitted only for completed appointments within 30 days.
- Moderate reviews for inappropriate content (admin review pending).
- Business detail page shows average rating, total reviews, and distribution.
- Provider can respond to reviews (future: phase 2).
- Edit or delete own review within 24 hours.

---

### 3.14 Payment Integration
**Priority**: P0  
**Description**: Secure payment processing for bookings with prepayment or hold.

**Acceptance Criteria**:
- Integration with Stripe (or similar) for card payments.
- Support for Apple Pay and Google Pay.
- Payment flow during booking if service requires prepayment (business setting).
- Saving card for future use with tokenization (PCI compliant).
- Refund/cancellation processing according to business policy.
- Payment confirmation and receipt email.
- Support for multiple currencies (future).

---

### 3.15 Notifications
**Priority**: P0  
**Description**: Send timely push and in-app notifications to customers about bookings, reminders, and promotions.

**Acceptance Criteria**:
- Push notification channel configured (FCM/APNs).
- Appointment reminders: 24h and 1h before.
- Booking confirmation, cancellation, reschedule notifications.
- Review request notification after appointment ends.
- In-app notification center with history.
- Notification preferences toggles (email/push per type).
- Deep linking from notification to relevant screen.

---

### 3.16 Provider / Business Owner Portal
**Priority**: P0  
**Description**: Web-based dashboard for business owners to manage services, staff, availability, and bookings.

**Acceptance Criteria**:
- Provider registration/login with business verification (email link).
- Dashboard overview: upcoming appointments, daily revenue (if payment handled), today's schedule.
- Service management: add/edit/delete services with name, duration, price, description, category, prepayment requirement.
- Staff management: add staff, assign services, manage individual working hours and breaks.
- Availability management: set regular working hours per day, add special dates (holidays), block time.
- Calendar view of appointments with staff color-coding; ability to create manual bookings (walk-ins).
- Appointment management: confirm, cancel, mark no-show, reschedule.
- Client management: view client history, add notes.
- Basic analytics: appointments count, popular services, revenue trends (if integrated).
- Settings: business profile info, cancellation policy, notification preferences.
- Multi-staff support: provider can have multiple employees each with their own schedule.

---

### 3.17 Admin Dashboard
**Priority**: P1  
**Description**: Super admin panel for platform oversight.

**Acceptance Criteria**:
- Manage all businesses: approve/reject new business registrations, suspend accounts.
- Manage service categories.
- View platform analytics: total bookings, revenue, active users.
- User management: view customers, handle reports.
- Review moderation queue.
- Configuration of global settings (commission rates, reminder timing).
- System health monitoring (jobs, errors).

---

### 3.18 Background Jobs (BullMQ)
**Priority**: P0  
**Description**: Asynchronous processing using BullMQ with Redis for tasks that don't need real-time response.

**Acceptance Criteria**:
- Appointment reminder jobs: scheduled at booking time to fire at reminder intervals; handle rescheduling/cancellation.
- Review request job: triggered after appointment end time.
- Session cleanup and expired token revocation.
- Daily summary emails for providers.
- Data archival and reporting generation.
- Job failure retry with exponential backoff and dead letter queue logging.
- Dashboard for monitoring job queues (Bull Board or integrated in admin).

---

## 4. Non-Functional Requirements
- Performance: app screens load within 2 seconds on 4G.
- Security: HTTPS, data encryption at rest, secure payment processing.
- Scalability: backend services stateless, designed to scale horizontally.
- Accessibility: meet WCAG 2.1 AA for web interface.
- Offline: limited offline support for viewing cached appointments (future).

## 5. Timeline and Phasing
- **MVP (P0 features)**: User auth, guest browse, search, business detail, booking with availability, payment, notifications, provider portal core, background jobs.
- **Phase 1 (P1 features)**: Map search, favorites, reviews, user profile enhancements, admin dashboard, advanced provider features.
- **Phase 2 (P2)**: Later features.

## 6. Dependencies
- Third-party: Stripe, Firebase (for push), Google Maps API, SendGrid for emails.
- Internal: Redis for BullMQ and caching, PostgreSQL for primary data store.