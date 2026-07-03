# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with local beauty and wellness businesses. Users can discover services, book appointments, manage bookings, and leave reviews. Business owners manage their profiles, services, staff, and schedules. An admin dashboard oversees the platform. The system uses background jobs for notifications, reminders, and slot computation.

## 2. User Roles
- **Guest**: Unauthenticated user who can browse, search, view business details, but cannot book or favorite.
- **Customer**: Authenticated user with full booking, favorites, profile, and review capabilities.
- **Provider (Business Owner)**: Authenticated user managing one or more businesses, services, staff, schedules, and appointments.
- **Admin**: Superuser with access to dashboard for platform management, moderation, and analytics.

## 3. Feature Specifications

### 3.1 User Authentication
**Priority: P0**

**Description**: Secure sign-up, login, and session management for customers and providers. Supports email/password and social login (Google, Apple).

**Acceptance Criteria**:
- Customer can sign up with email and password; verification email sent.
- Customer can log in with email/password; JWT token issued.
- Customer can log in with Google or Apple OAuth.
- Provider sign-up requires additional business details; approval flow optional.
- Password reset flow via email.
- Session persists across app restarts; token refresh mechanism.
- Logout clears session.
- Error messages for invalid credentials, duplicate email, weak password.

### 3.2 Guest Browse & Explore
**Priority: P0**

**Description**: Unauthenticated users can browse businesses, services, and reviews without signing up. Booking prompts authentication.

**Acceptance Criteria**:
- Guest lands on home screen showing featured businesses and categories.
- Can search by keyword, location, or category.
- Can view business detail page including services, photos, reviews.
- Tapping "Book" or "Favorite" redirects to login/signup modal.
- No personalization or saved data.

### 3.3 Business Search & Discovery
**Priority: P0**

**Description**: Customers search for businesses by name, service, location, or category. Results include relevance sorting, filters, and pagination.

**Acceptance Criteria**:
- Search bar with autocomplete suggestions (business names, services, categories).
- Results list with business name, rating, distance, next available slot, thumbnail.
- Filters: category, price range, rating, availability (today, this week), distance.
- Sort by: relevance, rating, distance, price low-high.
- Infinite scroll or pagination.
- Empty state with helpful message.
- Search history for logged-in users.

### 3.4 Map-based Search
**Priority: P1**

**Description**: Interactive map view showing nearby businesses. Users can toggle between list and map.

**Acceptance Criteria**:
- Map displays business pins with rating and name.
- Clustering for dense areas.
- Tap pin shows mini card with name, rating, distance; tap card navigates to detail.
- Map centers on user's current location (with permission) or searched location.
- Search bar works in map mode; results update map pins.
- Filter and sort options available.
- Smooth transition between list and map views.

### 3.5 Business Detail View
**Priority: P0**

**Description**: Comprehensive business profile with services, staff, photos, reviews, and booking CTA.

**Acceptance Criteria**:
- Header: cover photo, business name, rating, address, distance, favorite button.
- Tabbed sections: Services, About, Reviews, Photos.
- Services tab: list of services with duration, price, description; "Book" button per service.
- Staff selection if applicable (optional).
- About tab: description, amenities, business hours, contact info.
- Reviews tab: summary rating, review list with pagination, ability to write review (if booked).
- Photos tab: gallery grid.
- Sticky bottom bar with "Book Now" button.
- Share business option.

### 3.6 Service Categories
**Priority: P0**

**Description**: Hierarchical categories (e.g., Hair > Haircut, Coloring) for organizing services and aiding discovery.

**Acceptance Criteria**:
- Home screen displays top-level categories as icons.
- Category page shows subcategories and popular services.
- Businesses can be filtered by category.
- Admin can manage categories (CRUD).
- Services belong to one category; categories have optional parent.
- Category images and descriptions.

### 3.7 Booking Flow
**Priority: P0**

**Description**: Step-by-step booking process: select service, staff (if any), date/time, confirm, and pay.

**Acceptance Criteria**:
- Step 1: Service selection (from business detail or direct).
- Step 2: Staff selection (optional, if business has multiple staff).
- Step 3: Date picker showing available days; time slots based on real-time availability.
- Step 4: Review summary (service, staff, date, time, price, duration).
- Step 5: Payment (if required) via integrated payment gateway; booking confirmed.
- Guest redirected to login/signup before payment.
- Booking confirmation screen with details and option to add to calendar.
- Error handling for slot taken during process; retry suggestion.
- Support for multiple services in one booking (optional).

### 3.8 Appointment Management
**Priority: P0**

**Description**: Customers view, reschedule, cancel upcoming and past appointments.

**Acceptance Criteria**:
- "My Appointments" list with tabs: Upcoming, Past.
- Each appointment card shows business name, service, date/time, status.
- Upcoming: options to reschedule (if within allowed window) or cancel.
- Reschedule flow similar to booking, pre-filled with current selection.
- Cancellation with reason prompt; confirmation dialog.
- Past appointments: option to rebook or leave review.
- Push notification reminders 24h and 1h before appointment.
- Cancellation policy displayed (e.g., free cancel up to 24h).

### 3.9 Favorites
**Priority: P1**

**Description**: Customers save favorite businesses for quick access.

**Acceptance Criteria**:
- Heart icon on business cards and detail page to toggle favorite.
- "Favorites" tab in user profile listing saved businesses.
- List shows business name, rating, next available slot.
- Tap navigates to business detail.
- Sync across devices (logged in).
- Empty state with suggestion to explore.

### 3.10 User Profile
**Priority: P1**

**Description**: Customer profile management: personal info, preferences, payment methods, notification settings.

**Acceptance Criteria**:
- Edit name, email, phone, profile photo.
- Change password.
- Manage saved payment methods (add, delete, set default).
- Notification preferences: push, email, SMS toggles.
- Booking history summary.
- Link to favorites.
- Delete account option with confirmation.

### 3.11 Availability & Slot Computation
**Priority: P0**

**Description**: Real-time calculation of available time slots based on business hours, staff schedules, existing bookings, and service duration.

**Acceptance Criteria**:
- Business sets operating hours per day, breaks, holidays.
- Staff have individual schedules and service assignments.
- Slot engine computes available start times for a given service, staff, and date.
- Considers buffer time between appointments, travel time if mobile.
- Updates instantly when a booking is made or cancelled.
- Exposes API endpoint for frontend to fetch slots.
- Caching for performance; invalidation on booking changes.
- Background job recalculates slots periodically and on booking events.

### 3.12 Shared Types & Design System
**Priority: P0**

**Description**: Unified TypeScript types/interfaces and a consistent UI component library across web and mobile.

**Acceptance Criteria**:
- Shared types package for: User, Business, Service, Staff, Appointment, Review, Category, etc.
- Design system with reusable components: Button, Input, Card, Modal, Avatar, Rating, etc.
- Theming support (colors, typography, spacing).
- Responsive and accessible components.
- Storybook documentation for components.
- Used by both customer and provider apps.

### 3.13 Reviews & Ratings
**Priority: P1**

**Description**: Customers leave star ratings and text reviews after a completed appointment. Businesses display aggregate ratings.

**Acceptance Criteria**:
- After appointment completion, prompt to rate and review.
- Rating: 1-5 stars; optional text review and photo upload.
- Review submission triggers moderation queue (optional).
- Business detail shows average rating, total reviews, and distribution.
- Review list sorted by recent or helpful; pagination.
- Provider can respond to reviews (public reply).
- Customer can edit/delete their own review.
- Abuse reporting flag.

### 3.14 Payment Integration
**Priority: P0**

**Description**: Secure payment processing for bookings. Supports card payments and digital wallets.

**Acceptance Criteria**:
- Integration with Stripe (or similar) for payment processing.
- Customer can pay at booking time or choose "pay at venue" if provider allows.
- Saved payment methods for faster checkout.
- Payment confirmation and receipt via email.
- Refund processing for cancellations according to policy.
- PCI compliance; no sensitive card data stored on our servers.
- Provider receives payout information; admin can manage commissions.

### 3.15 Notifications
**Priority: P1**

**Description**: Push, email, and in-app notifications for booking confirmations, reminders, cancellations, promotions.

**Acceptance Criteria**:
- Booking confirmation: push and email to customer; push to provider.
- Reminder 24h and 1h before appointment (push).
- Cancellation notification to both parties.
- Review request after appointment.
- Promotional notifications (opt-in).
- In-app notification center with read/unread status.
- Notification preferences in settings.
- Background job (BullMQ) handles dispatch.

### 3.16 Provider / Business Owner Portal
**Priority: P0**

**Description**: Web and mobile interface for providers to manage their business, services, staff, schedule, and appointments.

**Acceptance Criteria**:
- Dashboard with today's appointments, earnings summary, upcoming bookings.
- Business profile management: name, description, photos, address, contact, hours.
- Service management: add/edit/delete services with name, duration, price, category, description.
- Staff management: add staff members, assign services, set individual schedules.
- Calendar view: daily/weekly agenda, color-coded by staff; ability to block time, create manual bookings.
- Appointment management: view, confirm, reschedule, cancel, mark no-show.
- Client list with history.
- Notifications for new bookings, cancellations.
- Settings: cancellation policy, booking lead time, payment options.
- Multi-business support for owners with multiple locations.

### 3.17 Admin Dashboard
**Priority: P2**

**Description**: Web-based dashboard for platform administrators to manage users, businesses, categories, reviews, and view analytics.

**Acceptance Criteria**:
- User management: list, search, suspend/activate, view details.
- Business management: approve/reject new businesses, edit, suspend.
- Category management: CRUD for service categories.
- Review moderation: approve/reject flagged reviews.
- Transaction monitoring: view payments, refunds, commissions.
- Analytics: key metrics (bookings, revenue, new users) with date filters.
- System configuration: commission rates, global settings.
- Role-based access control (super admin, support).

### 3.18 Background Jobs (BullMQ)
**Priority: P1**

**Description**: Asynchronous job processing for non-blocking tasks like notifications, slot recomputation, reminders, and data cleanup.

**Acceptance Criteria**:
- BullMQ queues for: email, push notifications, slot recalculation, appointment reminders, review requests.
- Jobs triggered by events (booking created, cancelled, etc.).
- Retry logic with exponential backoff for failed jobs.
- Monitoring dashboard (Bull Board) for queue health.
- Scheduled jobs for reminders (cron-like).
- Graceful shutdown and error handling.

## 4. Non-Functional Requirements
- Performance: Slot computation < 200ms; search results < 500ms.
- Scalability: Support 100k concurrent users.
- Security: HTTPS, JWT with refresh tokens, input sanitization, rate limiting.
- Accessibility: WCAG 2.1 AA compliance for web.
- Localization: Support multiple languages (future).

## 5. Prioritization Summary
- **P0 (Must-have)**: Authentication, Guest Browse, Search, Business Detail, Categories, Booking Flow, Appointment Management, Availability Engine, Shared Types, Payment, Provider Portal.
- **P1 (Should-have)**: Map Search, Favorites, User Profile, Reviews, Notifications, Background Jobs.
- **P2 (Nice-to-have)**: Admin Dashboard (can be built post-MVP).

This specification serves as the single source of truth for the Planity Clone development team.