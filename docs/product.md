# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with local beauty and wellness businesses. Customers can discover services, book appointments, manage bookings, and pay seamlessly. Business owners manage their services, staff, schedules, and receive bookings. An admin dashboard oversees platform health. The system uses BullMQ for background job processing (notifications, reminders, cleanup).

## 2. User Roles
- **Guest**: Unauthenticated user who can browse, search, view business details, but cannot book.
- **Customer**: Authenticated user with full booking, favorites, profile, and payment capabilities.
- **Provider (Business Owner)**: Authenticated business owner managing their business profile, services, staff, schedules, and appointments.
- **Admin**: Superuser with access to dashboard, user management, and platform analytics.

## 3. Shared Types & Design System
- **Shared Types**: TypeScript interfaces for User, Business, Service, Staff, Appointment, Review, Notification, etc. Defined in a shared package.
- **Design System**: Reusable UI components (Button, Card, Input, Modal, Avatar, RatingStars, TimeSlotPicker, MapView) with consistent theming (colors, typography, spacing). Mobile-first responsive design.

## 4. Features

### 4.1 User Authentication
**Priority**: P0
**Description**: Secure sign-up, login, and session management for customers and providers. Social login optional.
**Acceptance Criteria**:
- Customer can sign up with email/password, Google, or Apple.
- Provider sign-up requires business details and verification (manual/automated).
- Login returns JWT access and refresh tokens.
- Password reset flow via email.
- Session persists across app restarts.
- Logout clears tokens.
- Input validation and error messages.

### 4.2 Guest Browse & Explore
**Priority**: P0
**Description**: Unauthenticated users can browse businesses, services, and reviews without logging in.
**Acceptance Criteria**:
- Home screen shows featured businesses, categories, and search bar.
- Guest can view business detail page, services, reviews, and map location.
- Attempting to book prompts login/sign-up modal.
- No personalized features (favorites, booking history) visible.

### 4.3 Business Search & Discovery
**Priority**: P0
**Description**: Customers can search for businesses by name, category, location, or service.
**Acceptance Criteria**:
- Search bar with autocomplete suggestions (business names, categories).
- Filters: category, rating, price range, distance, availability (today, this week).
- Sort by: relevance, rating, distance, price.
- Results display business card (image, name, rating, distance, next available slot).
- Pagination or infinite scroll.
- Empty state with helpful message.

### 4.4 Map-based Search
**Priority**: P1
**Description**: Interactive map showing nearby businesses with pins.
**Acceptance Criteria**:
- Map view toggle on search results.
- Business pins show name and rating on tap.
- Clustering for dense areas.
- Tap pin opens business detail preview.
- Map centers on user's current location (with permission) or searched location.
- Search updates map markers dynamically.

### 4.5 Service Categories
**Priority**: P0
**Description**: Hierarchical categories (e.g., Hair > Haircut, Coloring) for browsing and filtering.
**Acceptance Criteria**:
- Home screen displays top-level categories as icons.
- Category page shows subcategories and popular services.
- Selecting a category filters search results.
- Admin can manage categories (CRUD) via admin dashboard.

### 4.6 Business Detail View
**Priority**: P0
**Description**: Comprehensive business profile with services, staff, reviews, location, and booking CTA.
**Acceptance Criteria**:
- Header with cover image, business name, rating, address, and favorite button.
- Tabs/sections: About, Services, Staff, Reviews, Map.
- Services list with name, duration, price, and "Book" button.
- Staff list with photo, name, specialties, and "Book with [staff]" option.
- Reviews section with summary rating, distribution, and paginated reviews.
- Map section showing location with directions link.
- Contact options (phone, website) if provided.
- Share button.

### 4.7 Booking Flow
**Priority**: P0
**Description**: Step-by-step booking: select service, staff (optional), date/time, confirm, and pay.
**Acceptance Criteria**:
- Flow: Service selection → Staff selection (if multiple) → Date picker → Time slot picker → Review summary → Payment (if required) → Confirmation.
- Date picker shows available days highlighted.
- Time slots show only available times based on staff schedule and existing bookings.
- Option to add notes or special requests.
- Apply promo code if available.
- Booking summary shows service, staff, date, time, price, duration.
- Payment step integrates with payment gateway (Stripe).
- On success, show confirmation screen with booking details and option to add to calendar.
- Handle errors gracefully (slot taken, payment failure).
- Guest redirected to login/sign-up before completing booking.

### 4.8 Appointment Management
**Priority**: P0
**Description**: Customers can view upcoming and past appointments, reschedule, cancel, and rebook.
**Acceptance Criteria**:
- Appointments list with tabs: Upcoming, Past.
- Each appointment card shows business, service, date, time, status.
- Actions: Cancel (with confirmation and policy check), Reschedule (opens booking flow with pre-filled service/staff), Add to calendar, Contact business.
- Cancellation policy displayed (e.g., free cancellation up to 24h before).
- Past appointments allow rebook and leave review.
- Push notification reminders before appointment.

### 4.9 Favorites
**Priority**: P1
**Description**: Customers can save favorite businesses for quick access.
**Acceptance Criteria**:
- Heart icon on business cards and detail page to toggle favorite.
- Favorites list accessible from profile/tab.
- Favorites sync across devices (authenticated).
- Empty state with suggestion to explore.

### 4.10 User Profile
**Priority**: P0
**Description**: Manage personal information, payment methods, notification preferences.
**Acceptance Criteria**:
- Edit name, email, phone, profile photo.
- Manage saved payment methods (add, delete, set default).
- Notification preferences: push, email, SMS toggles.
- View booking history.
- Link to favorites.
- Delete account option with confirmation.

### 4.11 Availability & Slot Computation
**Priority**: P0
**Description**: Real-time calculation of available time slots based on staff working hours, service duration, buffer time, and existing bookings.
**Acceptance Criteria**:
- Providers define working hours per staff (recurring weekly schedule, date overrides for holidays/vacations).
- Service duration + buffer time used to compute slots.
- Slots are generated dynamically when customer selects date.
- System prevents double-booking.
- Consider travel time if mobile service (future).
- API returns available slots as time ranges (e.g., 09:00, 09:30).
- Handle timezone correctly.

### 4.12 Reviews & Ratings
**Priority**: P1
**Description**: Customers can leave star ratings and text reviews after completed appointments.
**Acceptance Criteria**:
- After appointment, prompt to review.
- Rating 1-5 stars, optional text, optional photo.
- Reviews displayed on business detail page with moderation flag.
- Business owner can respond to reviews.
- Admin can moderate/hide inappropriate reviews.
- Average rating and distribution updated in real-time.

### 4.13 Payment Integration
**Priority**: P0
**Description**: Secure payment processing via Stripe for booking prepayment or deposit.
**Acceptance Criteria**:
- Support credit/debit cards, digital wallets (Apple Pay, Google Pay).
- Payment flow: collect card details or use saved method, confirm, process.
- Handle 3D Secure authentication.
- Store payment methods securely (Stripe tokenization).
- Receipt sent via email after successful payment.
- Refund capability for cancellations (according to policy) via admin/provider.
- PCI compliance handled by Stripe.

### 4.14 Notifications
**Priority**: P0
**Description**: Push, email, and in-app notifications for booking confirmations, reminders, cancellations, and promotions.
**Acceptance Criteria**:
- Booking confirmation (push + email) with details.
- Reminder 24h and 1h before appointment (push).
- Cancellation notification to both customer and provider.
- Reschedule notification.
- Review request after appointment.
- Promotional notifications (opt-in).
- In-app notification center with read/unread status.
- Notification preferences honored.
- Background jobs (BullMQ) handle sending.

### 4.15 Provider / Business Owner Portal
**Priority**: P0
**Description**: Web and mobile portal for providers to manage business, services, staff, schedules, and appointments.
**Acceptance Criteria**:
- Dashboard with today's appointments, upcoming, stats (bookings, revenue).
- Business profile management: name, description, photos, address, contact, categories.
- Service management: CRUD services with name, duration, price, description, category, buffer time.
- Staff management: add staff, assign services, set working hours, manage time off.
- Calendar view of appointments (day/week) with ability to manually add/block slots.
- Appointment management: view details, accept/reject (if manual approval enabled), cancel, reschedule, add notes.
- Customer management: view customer list, booking history.
- Review management: view and respond to reviews.
- Settings: notification preferences, cancellation policy, booking lead time, payment settings.
- Multi-language support for business info.

### 4.16 Admin Dashboard
**Priority**: P1
**Description**: Web-based admin panel for platform management, moderation, and analytics.
**Acceptance Criteria**:
- User management: list, search, suspend/activate customers and providers.
- Business verification: approve/reject new provider registrations.
- Category management: CRUD service categories.
- Review moderation: approve/hide flagged reviews.
- Analytics: total bookings, revenue, active users, popular services, geographic distribution.
- Configuration: global settings (commission rate, cancellation policy defaults).
- Audit log of admin actions.
- Role-based access (super admin, support).

### 4.17 Background Jobs (BullMQ)
**Priority**: P0
**Description**: Asynchronous processing for non-blocking tasks like notifications, reminders, data cleanup, and scheduled jobs.
**Acceptance Criteria**:
- Job queue for sending push/email notifications (booking confirmations, reminders).
- Scheduled jobs: send reminders 24h/1h before appointment, cleanup expired tokens, generate daily reports.
- Retry logic with exponential backoff for failed jobs.
- Dead letter queue for jobs that exceed max retries.
- Monitoring via Bull Board or similar.
- Jobs triggered by API events (booking created, cancelled).

## 5. Non-Functional Requirements
- **Performance**: API response < 200ms for slot computation, search results < 500ms.
- **Scalability**: Handle 10k concurrent users, horizontal scaling.
- **Security**: HTTPS, JWT with refresh rotation, input sanitization, rate limiting.
- **Accessibility**: WCAG 2.1 AA compliance.
- **Localization**: Support multiple languages (i18n).

## 6. Prioritization Summary
- **P0 (Must-have)**: Authentication, Guest Browse, Search & Discovery, Business Detail, Service Categories, Booking Flow, Appointment Management, User Profile, Availability & Slot Computation, Payment Integration, Notifications, Provider Portal, Background Jobs.
- **P1 (Should-have)**: Map-based Search, Favorites, Reviews & Ratings, Admin Dashboard.
- **P2 (Nice-to-have)**: Social login enhancements, advanced analytics, loyalty program, multi-currency, video consultations.