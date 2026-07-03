# Planity Clone Product Specification

## 1. Introduction
Planity Clone is a mobile-first platform connecting customers with beauty, wellness, and grooming businesses. Customers can discover, book, and manage appointments; providers manage their services, staff, and schedules; admins oversee the platform.

## 2. User Roles
- **Guest**: Unauthenticated user who can browse and search.
- **Customer**: Authenticated user who can book, manage appointments, leave reviews, save favorites.
- **Provider (Business Owner)**: Manages business profile, services, staff, availability, and appointments.
- **Admin**: Full platform control, user and business management, analytics.

## 3. Features & Acceptance Criteria

### 3.1 User Authentication (P0)
**Description**: Secure sign-up, login, and account recovery.
**Acceptance Criteria**:
- Customer can sign up with email/password, Google, or Apple.
- Provider sign-up requires business details and verification.
- Email verification required before first booking.
- Login with email/password or social accounts.
- Forgot password flow sends reset link.
- Session management with JWT tokens, refresh tokens.
- Logout clears session.
- Error handling for invalid credentials, duplicate emails.

### 3.2 Guest Browse & Explore (P0)
**Description**: Unauthenticated users can browse businesses and services.
**Acceptance Criteria**:
- Home screen shows featured businesses, popular categories, and search bar.
- Guest can view business detail page, services, and reviews.
- Attempting to book prompts login/sign-up.
- All browse features work without authentication.

### 3.3 Business Search & Discovery (P0)
**Description**: Search and filter businesses by various criteria.
**Acceptance Criteria**:
- Search by business name, service, or keyword.
- Filter by category, location (city/neighborhood), rating, price range, availability.
- Sort by relevance, rating, distance, price.
- Search results display business card with name, rating, distance, next available slot.
- Pagination/infinite scroll.
- Recent searches saved for logged-in users.

### 3.4 Map-based Search (P1)
**Description**: Interactive map showing business locations.
**Acceptance Criteria**:
- Map view with business pins; tap pin to see preview card.
- Search within map bounds; results update as map moves.
- User's current location used for initial map center (with permission).
- Toggle between list and map view.
- Map markers color-coded by category.

### 3.5 Business Detail View (P0)
**Description**: Comprehensive business profile.
**Acceptance Criteria**:
- Display business name, address, phone, website, description, photos gallery.
- Show rating, number of reviews, price level.
- List of services with name, duration, price.
- Staff members (if applicable) with photo and specialties.
- "Book" button prominent.
- Map showing location, directions link.
- Reviews section with summary and individual reviews.
- Share business link.

### 3.6 Service Categories (P0)
**Description**: Hierarchical categories for services.
**Acceptance Criteria**:
- Categories: Hair, Nails, Massage, Skin Care, Barber, etc.
- Subcategories: e.g., Hair > Haircut, Coloring, Styling.
- Admin can manage categories (add, edit, deactivate).
- Businesses can assign multiple categories.
- Category browsing with filters.

### 3.7 Booking Flow (P0)
**Description**: Step-by-step appointment booking.
**Acceptance Criteria**:
- Select service(s) from business detail.
- Choose staff member (if multiple) or "Any".
- Date picker showing available days.
- Time slot selection based on real-time availability.
- Option to add notes or special requests.
- Review booking summary: service, staff, date, time, price.
- Apply promo code if available.
- Proceed to payment (if required) or confirm free booking.
- Confirmation screen with booking details and option to add to calendar.
- Booking requires authentication; guest redirected to login/signup then back to booking.
- Handle concurrent slot booking gracefully (optimistic locking).

### 3.8 Appointment Management (P0)
**Description**: View and manage upcoming and past appointments.
**Acceptance Criteria**:
- "My Appointments" list with tabs: Upcoming, Past, Cancelled.
- Each appointment shows business, service, date, time, status.
- Actions: Reschedule (if allowed by policy), Cancel (with reason), View details, Add to calendar.
- Rescheduling follows same slot selection flow.
- Cancellation policy displayed; possible cancellation fee.
- Push notification and email for changes.

### 3.9 Favorites (P1)
**Description**: Save favorite businesses for quick access.
**Acceptance Criteria**:
- Heart icon on business card and detail page to toggle favorite.
- "Favorites" screen listing saved businesses.
- Remove from favorites.
- Sync across devices (logged in).
- Requires authentication.

### 3.10 User Profile (P1)
**Description**: Manage personal information and preferences.
**Acceptance Criteria**:
- Edit name, email, phone, profile photo.
- Manage saved payment methods (add, delete, set default).
- Notification preferences: push, email, SMS.
- View booking history.
- Delete account (GDPR compliant).

### 3.11 Availability & Slot Computation (P0)
**Description**: Dynamic calculation of available time slots based on provider schedules.
**Acceptance Criteria**:
- Provider sets weekly working hours per staff member, including breaks.
- Service duration and buffer time between appointments.
- Blocked dates/holidays.
- Slot generation algorithm considers staff, service duration, buffer, existing bookings.
- Real-time availability updates when bookings are made/cancelled.
- API endpoint returns available slots for a given date, service, staff.
- Handle timezone correctly.
- Support multiple staff and parallel bookings if business has multiple providers.

### 3.12 Shared Types & Design System (P0)
**Description**: Foundational types and UI components for consistency.
**Acceptance Criteria**:
- TypeScript interfaces for User, Business, Service, Appointment, Review, etc.
- Reusable UI components: Button, Input, Card, Modal, StarRating, DatePicker, TimeSlotPicker, MapView.
- Design tokens: colors, typography, spacing, shadows.
- Responsive layout for mobile and tablet.
- Accessibility: proper labels, contrast, keyboard navigation.

### 3.13 Reviews & Ratings (P1)
**Description**: Customers can rate and review businesses after an appointment.
**Acceptance Criteria**:
- After appointment completion, prompt for review via notification/email.
- Rating 1-5 stars, optional text review, optional photo.
- Reviews displayed on business detail page with sorting (most recent, highest rated).
- Business owner can respond to reviews.
- Admin can moderate/hide inappropriate reviews.
- Average rating calculated and updated.

### 3.14 Payment Integration (P0)
**Description**: Secure payment processing for bookings.
**Acceptance Criteria**:
- Integration with Stripe for card payments, Apple Pay, Google Pay.
- Support for full payment upfront, deposit, or pay at venue (configurable by business).
- Payment flow within booking: enter card details or use saved method.
- PCI compliance; no sensitive card data stored on server.
- Handle payment failures gracefully with retry.
- Refund processing for cancellations according to policy.
- Transaction history for customers and providers.

### 3.15 Notifications (P0)
**Description**: Multi-channel notifications for booking events.
**Acceptance Criteria**:
- Push notifications (via Firebase Cloud Messaging) for booking confirmation, reminders (24h, 1h before), changes, cancellations.
- Email notifications with same events, plus marketing (opt-in).
- In-app notification center with list of notifications.
- SMS reminders (optional, provider setting).
- Notification preferences respected.
- Real-time updates using WebSockets for in-app alerts.

### 3.16 Provider / Business Owner Portal (P0)
**Description**: Web and mobile dashboard for providers to manage their business.
**Acceptance Criteria**:
- Dashboard with today's appointments, upcoming, stats (bookings, revenue).
- Business profile management: name, description, photos, address, contact, categories.
- Service management: add/edit/delete services with name, duration, price, description, category.
- Staff management: add staff members, assign services, set working hours, breaks, time off.
- Calendar view of appointments with filters by staff, service, date.
- Manual booking creation for walk-ins or phone bookings.
- Appointment actions: confirm, cancel, mark as no-show, reschedule.
- Review management: view and respond to reviews.
- Availability settings: set regular hours, special hours, block dates.
- Notification settings for new bookings, cancellations.
- Accessible via responsive web and dedicated mobile view.

### 3.17 Admin Dashboard (P1)
**Description**: Centralized administration panel.
**Acceptance Criteria**:
- User management: list, search, view details, suspend/ban users.
- Business management: approve new businesses, edit, suspend, verify.
- Category management: CRUD for service categories.
- Review moderation: flag, hide, delete reviews.
- Platform analytics: total bookings, revenue, active users, popular businesses.
- Configuration: global settings (commission rates, cancellation policies).
- Support ticket system for disputes.
- Role-based access control (super admin, moderator).

### 3.18 Background Jobs (BullMQ) (P0)
**Description**: Asynchronous task processing for non-blocking operations.
**Acceptance Criteria**:
- Job queue for sending emails (booking confirmation, reminders, marketing).
- Job queue for push notifications.
- Job queue for SMS reminders.
- Scheduled jobs for appointment reminders (24h, 1h before).
- Job for recomputing availability cache after booking/cancellation.
- Job for generating daily/weekly reports.
- Job for cleaning up expired tokens, unverified accounts.
- Retry logic with exponential backoff for failed jobs.
- Monitoring dashboard for queue health (Bull Board).

## 4. Non-Functional Requirements
- **Performance**: API response < 200ms, slot computation < 500ms.
- **Scalability**: Support 100k concurrent users.
- **Security**: HTTPS, data encryption at rest, OWASP top 10 protection.
- **Availability**: 99.9% uptime.
- **Localization**: Support multiple languages (English, French initially).
- **Accessibility**: WCAG 2.1 AA compliance.

## 5. Release Phases
- **MVP (P0)**: Authentication, browse/search, business detail, booking flow, appointment management, availability, payment, notifications, provider portal basics, background jobs.
- **Phase 2 (P1)**: Map search, favorites, user profile enhancements, reviews & ratings, admin dashboard.
- **Phase 3 (P2)**: Advanced analytics, loyalty program, multi-language, social sharing, AI recommendations.