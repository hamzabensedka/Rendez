# Product Specification for Planity Clone

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with local service providers (salons, spas, barbers, etc.). It enables discovery, booking, payment, and management of appointments. The system includes a customer-facing app, a provider portal, and an admin dashboard. Background jobs handle notifications, reminders, and slot computations.

## 2. User Roles
- **Guest**: Unauthenticated user who can browse and search.
- **Customer**: Registered user with full booking capabilities.
- **Provider**: Business owner managing services, staff, and appointments.
- **Admin**: Platform administrator with oversight and control.

## 3. Features

### 3.1 User Authentication
**Priority:** P0 (MVP)
**Description:** Secure sign-up, login, and session management for customers and providers. Supports email/password and social login (Google, Apple).

**Acceptance Criteria:**
- Customer can sign up with email/password, verify email, and log in.
- Customer can sign up/login with Google and Apple.
- Provider sign-up requires business details and is subject to admin approval.
- Password reset flow works end-to-end.
- JWT tokens are issued and refreshed securely.
- Session persists across app restarts.
- Logout clears tokens and local state.

### 3.2 Guest Browse & Explore
**Priority:** P0
**Description:** Unauthenticated users can browse businesses, view details, and see available services without logging in. Booking requires authentication.

**Acceptance Criteria:**
- Guest can view home screen with featured businesses and categories.
- Guest can search and filter businesses.
- Guest can view business detail page, including services, reviews, and map.
- Tapping “Book” prompts login/sign-up.
- No personalization features (favorites, history) are available.

### 3.3 Business Search & Discovery
**Priority:** P0
**Description:** Customers can search for businesses by name, category, location, or service. Results are sortable by relevance, rating, distance, and availability.

**Acceptance Criteria:**
- Search bar with autocomplete suggestions.
- Filter by category, price range, rating, and open now.
- Sort by relevance, highest rated, nearest, earliest available.
- Results display business name, rating, distance, next available slot, and thumbnail.
- Pagination or infinite scroll.
- Empty state when no results match.

### 3.4 Map-based Search
**Priority:** P1
**Description:** Interactive map view showing business locations. Users can move the map to update results, tap markers for quick info, and switch between list and map views.

**Acceptance Criteria:**
- Map renders with business pins based on current viewport.
- Tapping a pin shows a mini card with name, rating, and next slot.
- “Search this area” button refreshes results when map moves.
- Toggle between list and map views preserves filters.
- Map respects location permissions; falls back to default city if denied.

### 3.5 Business Detail View
**Priority:** P0
**Description:** Comprehensive page for a business: photos, description, services, staff, reviews, location, and booking CTA.

**Acceptance Criteria:**
- Image gallery with swipe.
- Business name, rating, review count, address, phone, hours.
- List of services with duration, price, and “Book” button.
- Staff section with names, photos, and specializations.
- Reviews section with summary rating distribution and recent reviews.
- Map snippet showing location.
- Share button.
- Favorite/unfavorite toggle.

### 3.6 Service Categories
**Priority:** P0
**Description:** Hierarchical categories (e.g., Hair > Haircut, Coloring) to organize services. Used for discovery and provider service setup.

**Acceptance Criteria:**
- Admin can manage categories (CRUD) with name, icon, and parent.
- Categories displayed on home screen and search filters.
- Provider can assign services to categories during setup.
- Category page shows businesses offering services in that category.

### 3.7 Booking Flow
**Priority:** P0
**Description:** Step-by-step booking: select service, choose staff (optional), pick date/time, confirm details, and pay (if required).

**Acceptance Criteria:**
- Service selection from business detail or directly from search.
- Staff selection step (if business has multiple staff) with availability.
- Date picker showing available days; time slots based on real-time availability.
- Summary screen with service, staff, date, time, price, and any deposit.
- Payment step if deposit/full payment required; supports card and digital wallet.
- Booking confirmation with success screen and option to add to calendar.
- Handles concurrent slot booking gracefully (optimistic lock or real-time check).
- Guest redirected to login/sign-up before confirmation.

### 3.8 Appointment Management
**Priority:** P0
**Description:** Customers can view upcoming and past appointments, reschedule, cancel, and rebook.

**Acceptance Criteria:**
- List of upcoming appointments with status (confirmed, pending, etc.).
- Appointment detail: business, service, staff, date/time, price, cancellation policy.
- Reschedule flow: pick new date/time from available slots, confirm.
- Cancel with reason selection; respects cancellation window (e.g., 24h).
- Rebook option for past appointments.
- Push notification reminders 24h and 1h before appointment.
- Calendar sync (optional).

### 3.9 Favorites
**Priority:** P1
**Description:** Customers can save businesses to a favorites list for quick access.

**Acceptance Criteria:**
- Heart icon on business cards and detail page.
- Favorites tab in user profile showing saved businesses.
- Favorites persist across sessions.
- Unfavorite removes from list.
- Empty state when no favorites.

### 3.10 User Profile
**Priority:** P1
**Description:** Manage personal information, notification preferences, payment methods, and view history.

**Acceptance Criteria:**
- Edit name, email, phone, profile photo.
- Manage saved payment methods (add, delete, set default).
- Notification preferences (push, email, SMS).
- Appointment history with filter by status.
- Link to favorites.
- Delete account option with confirmation.

### 3.11 Availability & Slot Computation
**Priority:** P0 (backend)
**Description:** Real-time calculation of available time slots based on provider working hours, staff schedules, existing bookings, and service duration.

**Acceptance Criteria:**
- Providers define working hours per day, breaks, and days off.
- Staff have individual schedules overriding business hours if needed.
- Slot engine computes available start times for a given service, staff, and date.
- Considers buffer time between appointments.
- Handles multiple staff and parallel bookings.
- Updates instantly when a booking is made or cancelled.
- Exposed via API for booking flow and provider calendar.

### 3.12 Shared Types & Design System
**Priority:** P0
**Description:** Consistent TypeScript types/interfaces and UI components across frontend apps (customer, provider, admin).

**Acceptance Criteria:**
- Shared types package for entities: User, Business, Service, Staff, Appointment, Review, etc.
- Design system with reusable components: Button, Input, Card, Modal, StarRating, etc.
- Theming support (colors, typography, spacing).
- Responsive and accessible components.
- Storybook documentation for components.

### 3.13 Reviews & Ratings
**Priority:** P1
**Description:** Customers can leave a rating (1-5) and written review after a completed appointment. Reviews are public on business detail.

**Acceptance Criteria:**
- Prompt to review appears after appointment is marked completed.
- Rating stars and optional text field.
- Review submission updates business average rating.
- Provider can respond to reviews.
- Reviews can be reported; admin can moderate.
- Sorting reviews by most recent or highest/lowest rating.

### 3.14 Payment Integration
**Priority:** P0
**Description:** Secure payment processing for deposits or full payments via Stripe. Supports card and digital wallets.

**Acceptance Criteria:**
- Customer can add card during booking or in profile.
- Payment is captured at booking time (deposit) or after service (full).
- PCI compliance via Stripe Elements or mobile SDK.
- Refund flow for cancellations according to policy.
- Receipts sent via email.
- Provider sees payment status in appointment details.
- Admin can view transaction logs.

### 3.15 Notifications
**Priority:** P1
**Description:** Push, email, and in-app notifications for booking confirmations, reminders, cancellations, and promotions.

**Acceptance Criteria:**
- Booking confirmation push and email.
- Reminder 24h and 1h before appointment.
- Cancellation notification to both parties.
- Provider notified of new booking and cancellations.
- In-app notification center with read/unread status.
- Opt-out preferences respected.
- Admin can send promotional push notifications.

### 3.16 Provider / Business Owner Portal
**Priority:** P0
**Description:** Web and mobile portal for providers to manage business profile, services, staff, calendar, and appointments.

**Acceptance Criteria:**
- Dashboard with today’s appointments, earnings summary, and notifications.
- Business profile editing: name, description, photos, address, hours, phone.
- Service management: add/edit/delete services with name, duration, price, category, description.
- Staff management: invite staff, set schedules, assign services.
- Calendar view (day/week) showing all appointments with status.
- Manual appointment creation for walk-ins.
- Accept/decline booking requests (if manual approval enabled).
- View customer details and history.
- Respond to reviews.
- Availability settings: working hours, breaks, special days off.
- Reports: revenue, bookings, popular services.

### 3.17 Admin Dashboard
**Priority:** P1
**Description:** Web dashboard for platform administrators to manage businesses, users, categories, reviews, and monitor platform health.

**Acceptance Criteria:**
- Business management: approve/reject new providers, suspend, view details.
- User management: list customers, view activity, disable accounts.
- Category management: CRUD.
- Review moderation: approve, reject, or remove reported reviews.
- Transaction monitoring and refund handling.
- Analytics: total bookings, revenue, active users, popular categories.
- System configuration: commission rates, cancellation policies, notification templates.
- Role-based access (super admin, support).

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 (backend)
**Description:** Asynchronous job processing for tasks like sending notifications, computing availability caches, generating reports, and cleaning up stale data.

**Acceptance Criteria:**
- Job queue for sending push/email notifications with retry logic.
- Scheduled job for appointment reminders (24h, 1h).
- Job to recalculate provider availability cache after booking/cancellation.
- Daily job to mark missed appointments and request reviews.
- Admin-triggered job for bulk notifications.
- Monitoring dashboard for queue health (Bull Board or similar).
- Failed jobs logged and alertable.

## 4. Non-Functional Requirements
- **Performance:** API response < 200ms for 95th percentile; slot computation < 500ms.
- **Scalability:** Support 10k concurrent users.
- **Security:** HTTPS, JWT with refresh rotation, input sanitization, rate limiting.
- **Accessibility:** WCAG 2.1 AA for customer and provider portals.
- **Localization:** Support multiple languages (English, French initially).

## 5. Release Phases
- **MVP (P0):** Auth, guest browse, search, business detail, categories, booking flow, appointment management, availability engine, payment, provider portal basics, background jobs for notifications.
- **V1 (P1):** Map search, favorites, user profile, reviews, full provider portal, admin dashboard, advanced notifications.
- **V2 (P2):** Loyalty programs, multi-location support, advanced analytics, AI recommendations.