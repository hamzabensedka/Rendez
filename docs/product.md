# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with beauty and wellness businesses. Customers can discover services, book appointments, manage bookings, and pay. Business owners manage their services, staff, schedules, and appointments. An admin dashboard oversees the platform. The system uses background jobs for notifications and slot computation.

## 2. User Roles
- **Customer**: End user searching, booking, and managing personal appointments.
- **Business Owner / Provider**: Manages a business profile, services, staff, availability, and appointments.
- **Admin**: Superuser with access to platform-wide data, user management, and analytics.

## 3. Features

### 3.1 User Authentication
**Description**: Secure sign-up, login, and session management for all roles. Supports email/password and social login (Google, Apple). Includes password reset and email verification.

**Acceptance Criteria**:
- Customer can sign up with email/password or social provider; email verification required.
- Business Owner sign-up includes business details and is subject to admin approval.
- Admin accounts are created only via backend or existing admin.
- Login returns JWT access/refresh tokens; token refresh works seamlessly.
- Password reset flow sends email with time-limited link.
- Session persists across app restarts.
- Invalid credentials show appropriate error messages.
- Rate limiting on login attempts (5 failures per minute).

**Priority**: P0 (MVP)

### 3.2 Guest Browse & Explore
**Description**: Unauthenticated users can browse businesses, view services, and check availability without signing up. Booking requires authentication.

**Acceptance Criteria**:
- Guest can view home feed with featured businesses and categories.
- Search and filter businesses without login.
- View business detail page, services, and reviews.
- Attempting to book prompts sign-up/login modal.
- No personal data is stored for guest sessions.

**Priority**: P0 (MVP)

### 3.3 Business Search & Discovery
**Description**: Customers search for businesses by name, service, location, or category. Results include relevance sorting, filters, and pagination.

**Acceptance Criteria**:
- Search bar with autocomplete (business names, services, categories).
- Filters: category, rating, price range, distance, availability (today, this week).
- Sort by: relevance, rating, distance, price low-to-high.
- Results display business card with name, rating, distance, next available slot.
- Infinite scroll or pagination.
- Empty state when no results.
- Search works with partial input and handles typos (fuzzy search).

**Priority**: P0 (MVP)

### 3.4 Map-based Search
**Description**: Interactive map view showing nearby businesses. Users can move the map to update results.

**Acceptance Criteria**:
- Map displays business pins with basic info on tap.
- Clustering for dense areas.
- Map center and zoom level determine search radius.
- Toggle between list and map view.
- User location permission request; fallback to manual location entry.
- Map loads smoothly with lazy loading of pins.

**Priority**: P1

### 3.5 Business Detail View
**Description**: Comprehensive business profile with services, staff, reviews, gallery, and booking CTA.

**Acceptance Criteria**:
- Header with cover image, business name, rating, address, and favorite button.
- Tab/section navigation: About, Services, Staff, Reviews, Gallery.
- Services list with name, duration, price; expandable details.
- Staff cards with photo, specialties, and next available slot.
- Reviews summary (average rating, distribution) and paginated review list.
- Photo gallery with lightbox.
- Prominent "Book Now" button that scrolls to service selection.
- Share business profile.
- Loading skeletons while fetching.

**Priority**: P0 (MVP)

### 3.6 Service Categories
**Description**: Hierarchical category system (e.g., Hair > Haircut, Coloring). Used for discovery and business onboarding.

**Acceptance Criteria**:
- Admin can manage categories (CRUD) with name, icon, parent category.
- Categories displayed on home screen and search filters.
- Business owners select categories during registration and assign services to categories.
- Category page shows subcategories and top businesses.
- Deep linking to category from notifications or external links.

**Priority**: P0 (MVP)

### 3.7 Booking Flow
**Description**: Step-by-step appointment booking: select service, staff (optional), date/time, add-ons, review, and confirm. Supports guest checkout after authentication.

**Acceptance Criteria**:
- Step 1: Choose service(s) from business; multi-service selection allowed.
- Step 2: Select staff member (or "Any available").
- Step 3: Date picker showing available days; time slots based on real-time availability.
- Step 4: Optional add-ons (e.g., extra treatments) with prices.
- Step 5: Review summary with total price, duration, and cancellation policy.
- Step 6: Confirm booking; if not logged in, prompt authentication then return to confirmation.
- Real-time slot hold (5-minute timer) during booking to prevent double-booking.
- Clear error handling if slot becomes unavailable.
- Success screen with booking details and option to add to calendar.

**Priority**: P0 (MVP)

### 3.8 Appointment Management
**Description**: Customers view, reschedule, cancel upcoming and past appointments. Business owners manage all appointments for their business.

**Acceptance Criteria**:
- Customer: List of upcoming and past appointments with status (confirmed, completed, cancelled).
- Tap to view details: service, staff, date/time, location, price, booking ID.
- Reschedule: flow similar to booking but pre-filled; must respect cancellation policy.
- Cancel: confirmation dialog; if within free cancellation window, no charge; else show fee.
- Business Owner: Calendar view (day/week) with all appointments; filter by staff/service.
- Owner can confirm, cancel, or mark no-show; cancellation triggers refund if applicable.
- Push notification on status changes.
- Appointment history export for customers.

**Priority**: P0 (MVP)

### 3.9 Favorites
**Description**: Customers save favorite businesses for quick access.

**Acceptance Criteria**:
- Heart icon on business cards and detail page to toggle favorite.
- Dedicated Favorites screen listing saved businesses with next available slot.
- Sync favorites across user devices (stored server-side).
- Remove from favorites with swipe or button.
- Empty state with suggestion to explore.

**Priority**: P1

### 3.10 User Profile
**Description**: Customer profile management: personal info, preferences, payment methods, notification settings.

**Acceptance Criteria**:
- Edit name, email, phone, profile photo.
- Manage saved payment methods (add, delete, set default).
- Notification preferences: push, email, SMS toggles.
- Booking history with filter by status.
- Delete account with confirmation and data wipe (GDPR).
- All changes require re-authentication for sensitive actions.

**Priority**: P0 (MVP)

### 3.11 Availability & Slot Computation
**Description**: Dynamic calculation of bookable time slots based on business hours, staff schedules, service duration, buffers, and existing bookings.

**Acceptance Criteria**:
- Business sets regular working hours per day, breaks, and holidays.
- Staff members have individual schedules overriding business hours.
- Service duration plus buffer time (before/after) defines slot length.
- Slots computed considering parallel availability for multi-staff.
- Real-time updates when a slot is booked or held.
- Slot computation runs as a background job (BullMQ) on schedule changes and periodically.
- API returns available slots for a given date, service, and staff.
- Handle timezone differences (business local time).
- Overlapping appointments prevented.

**Priority**: P0 (MVP)

### 3.12 Shared Types & Design System
**Description**: Unified TypeScript types and reusable UI components to ensure consistency across web and mobile.

**Acceptance Criteria**:
- Shared types package for all entities: User, Business, Service, Appointment, Review, etc.
- Design system with color palette, typography, spacing, and component library (buttons, inputs, cards, modals).
- Components support loading, empty, error, and success states.
- Responsive design for mobile, tablet, and desktop.
- Accessibility: minimum contrast, screen reader support, keyboard navigation.
- Storybook documentation for all components.

**Priority**: P0 (MVP)

### 3.13 Reviews & Ratings
**Description**: Customers leave star ratings and written reviews after completed appointments. Businesses can respond.

**Acceptance Criteria**:
- After appointment completion, prompt customer to rate and review.
- Rating: 1-5 stars; review text optional, min 10 characters if provided.
- Review appears on business detail page with author name and date.
- Business owner can reply publicly to reviews.
- Admin can moderate/hide inappropriate reviews.
- Average rating updated asynchronously via background job.
- Review sorting: most recent, highest/lowest rated.
- Duplicate review prevention per appointment.

**Priority**: P1

### 3.14 Payment Integration
**Description**: Secure payment processing for bookings. Supports card payments and digital wallets. Handles holds, captures, and refunds.

**Acceptance Criteria**:
- Integration with Stripe (or similar) for payment processing.
- Customer adds card details securely (PCI-compliant tokenization).
- Payment flow: hold amount on booking, capture upon service completion (or no-show policy).
- Support for promo codes and discounts.
- Receipt generated and emailed after payment.
- Refund processing for cancellations (full/partial based on policy).
- Business owner sets cancellation policy (free until X hours before).
- Payment status visible in appointment details.
- Admin can view transaction logs.

**Priority**: P0 (MVP)

### 3.15 Notifications
**Description**: Push, email, and in-app notifications for booking confirmations, reminders, cancellations, and promotional messages.

**Acceptance Criteria**:
- Booking confirmation sent immediately via push and email.
- Reminder 24h and 1h before appointment (configurable).
- Cancellation/reschedule notifications to both parties.
- Business owner notified of new booking and changes.
- In-app notification center with read/unread status.
- Notification preferences respected per user.
- Admin can send broadcast notifications to segments.
- Background job (BullMQ) handles dispatch with retry logic.

**Priority**: P1

### 3.16 Provider / Business Owner Portal
**Description**: Dedicated interface for business owners to manage their profile, services, staff, schedule, and appointments.

**Acceptance Criteria**:
- Dashboard with today's appointments, earnings summary, and quick actions.
- Business profile editing: name, description, address, photos, categories.
- Service management: CRUD services with name, duration, price, description, category.
- Staff management: add/remove staff, assign services, set individual schedules.
- Calendar view of appointments with filters; ability to block time off.
- Client management: view customer history, notes.
- Reports: revenue, bookings, popular services (daily/weekly/monthly).
- Settings: business hours, holidays, cancellation policy, notification preferences.
- Multi-language support for business info.
- Accessible via web and mobile.

**Priority**: P0 (MVP)

### 3.17 Admin Dashboard
**Description**: Super admin panel for platform oversight, user management, analytics, and content moderation.

**Acceptance Criteria**:
- Dashboard with KPIs: total bookings, revenue, active users, new businesses.
- User management: list/search customers and business owners; suspend/activate accounts.
- Business verification and approval workflow.
- Category management (CRUD).
- Review moderation queue.
- Transaction log and refund management.
- System configuration: commission rates, feature flags, global notification templates.
- Role-based access control (super admin, support).
- Export data as CSV.

**Priority**: P1

### 3.18 Background Jobs (BullMQ)
**Description**: Asynchronous job processing for non-blocking operations like slot computation, notifications, payment capture, and data cleanup.

**Acceptance Criteria**:
- BullMQ queues for: slot recalculation, email/push dispatch, payment capture, review moderation, data export.
- Jobs triggered by events (booking created, schedule changed) or cron schedules.
- Retry with exponential backoff for failed jobs.
- Dead letter queue for jobs exceeding max attempts.
- Monitoring dashboard (Bull Board) for queue health.
- Idempotency to prevent duplicate processing.
- Graceful shutdown handling.

**Priority**: P0 (MVP)

## 4. Non-Functional Requirements
- **Performance**: API response < 200ms for 95% of requests; slot computation < 2s.
- **Scalability**: Support 100k concurrent users; horizontal scaling of services.
- **Security**: HTTPS, JWT with rotation, input sanitization, rate limiting, GDPR compliance.
- **Reliability**: 99.9% uptime; automated backups; graceful degradation.
- **Usability**: WCAG 2.1 AA compliance; intuitive navigation; offline support for static content.
- **Localization**: Support multiple languages and currencies (initial: EN, FR).

## 5. Glossary
- **Buffer time**: Extra time before/after a service for preparation/cleanup.
- **Slot hold**: Temporary reservation of a time slot during booking.
- **No-show**: Customer fails to attend appointment without cancellation.
- **Commission**: Percentage fee taken by platform from each booking.