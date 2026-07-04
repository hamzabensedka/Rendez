# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with local service businesses (salons, spas, barbers, etc.) for appointment booking. It includes customer-facing apps, a provider portal, and an admin dashboard. The system supports real-time availability, secure payments, notifications, and comprehensive management tools.

## 2. User Roles
- **Guest**: Unauthenticated user who can browse and search but cannot book or save favorites.
- **Customer**: Authenticated user who can book appointments, manage profile, leave reviews, and save favorites.
- **Provider / Business Owner**: Manages business profile, services, staff, bookings, and reviews via a web portal.
- **Admin**: Super admin with full platform control, including business approval, user management, and analytics.

## 3. Features

### 3.1 User Authentication
**Description**: Secure sign-up/login via email/password, social login (Google, Apple), and phone OTP. Includes session management and password reset.
**Acceptance Criteria**:
- User can register with email/password and receive a verification email.
- User can log in with email/password or social accounts.
- Forgot password flow sends a reset link.
- JWT token refresh and logout functionality.
- Guest can browse without login.
**Priority**: P0

### 3.2 Guest Browse & Explore
**Description**: Unauthenticated users can browse businesses, view details, and search, but cannot book or favorite.
**Acceptance Criteria**:
- Guest sees home screen with featured businesses and categories.
- Guest can search and apply filters.
- Tapping "Book" prompts login/signup.
- No access to booking flow, favorites, or profile.
**Priority**: P0

### 3.3 Business Search & Discovery
**Description**: Search by name, category, location. Filters: rating, price range, availability, distance. Sort options.
**Acceptance Criteria**:
- Search bar with autocomplete suggestions.
- Filter modal with multiple criteria.
- Results list with business card (image, name, rating, distance, next available slot).
- Pagination/infinite scroll.
- Empty state and error handling.
**Priority**: P0

### 3.4 Map-based Search
**Description**: Interactive map showing business locations with clustering, tap to preview, and navigate to detail.
**Acceptance Criteria**:
- Map view toggle from list.
- Markers with business name and rating.
- Clustering for dense areas.
- Tap marker shows info window with link to detail.
- Map centers on user's location (with permission) or searched area.
**Priority**: P1

### 3.5 Business Detail View
**Description**: Comprehensive business profile: photos, description, services, staff, reviews, location, working hours, contact.
**Acceptance Criteria**:
- Image gallery with swipe.
- Business info (name, address, phone, website, social links).
- Service list with prices and durations.
- Staff list with photos and specialties.
- Reviews section with summary rating and list of reviews.
- Prominent "Book" button.
- Map showing location.
- Share business option.
**Priority**: P0

### 3.6 Service Categories
**Description**: Hierarchical categories (e.g., Hair > Haircut, Coloring). Browsing by category, featured categories on home.
**Acceptance Criteria**:
- Category tree with icons.
- Tap category shows subcategories or businesses.
- Businesses can be tagged with multiple categories.
- Admin can manage categories.
**Priority**: P0

### 3.7 Booking Flow
**Description**: Step-by-step booking: select service, staff (optional), date/time slot, confirm, payment (if required), confirmation.
**Acceptance Criteria**:
- Service selection with multi-select if allowed.
- Staff selection (any or specific).
- Calendar view showing available dates and time slots based on real-time availability.
- Slot computation considers business hours, staff schedules, existing bookings, buffer times.
- Summary screen with details and price breakdown.
- Apply promo code.
- Payment step (if prepayment required) via integrated gateway.
- Booking confirmation with details and option to add to calendar.
- Handle concurrent slot reservation (optimistic locking).
- Error handling for slot taken.
**Priority**: P0

### 3.8 Appointment Management
**Description**: Customer can view upcoming and past appointments. Reschedule, cancel (with policy), add to calendar, get reminders.
**Acceptance Criteria**:
- List of appointments with status (confirmed, pending, completed, cancelled).
- Tap to see details.
- Reschedule: re-enter booking flow with existing service/staff pre-selected, new slot.
- Cancel: confirmation dialog showing cancellation policy (e.g., free until X hours before).
- Push notification reminders.
- Add to device calendar.
- Rate/review after completion.
**Priority**: P0

### 3.9 Favorites
**Description**: Save businesses to favorites list for quick access.
**Acceptance Criteria**:
- Heart icon on business card/detail.
- Toggle favorite (add/remove).
- Favorites list in profile/sidebar.
- Sync across devices (if logged in).
- Guest cannot favorite.
**Priority**: P1

### 3.10 User Profile
**Description**: Manage personal info, contact details, notification preferences, payment methods, booking history.
**Acceptance Criteria**:
- Edit name, email, phone, profile picture.
- Change password.
- Manage saved payment methods (add, delete, set default).
- Notification settings (push, email, SMS).
- View booking history.
- Delete account.
**Priority**: P0

### 3.11 Availability & Slot Computation
**Description**: Core engine to compute available time slots for a business/service/staff on a given date, considering working hours, breaks, existing bookings, service duration, buffer, staff assignments, holidays, special hours.
**Acceptance Criteria**:
- Business sets regular working hours per day, breaks.
- Staff can have individual schedules overriding business hours.
- Service duration and buffer time (before/after).
- Slot generation: start times at intervals (e.g., every 15 min) that can accommodate service duration without overlapping existing bookings.
- Real-time availability check during booking.
- Handle timezone.
- Optimistic concurrency control to prevent double-booking.
- Admin/provider can block off time manually.
**Priority**: P0

### 3.12 Shared Types & Design System
**Description**: Common TypeScript types/interfaces for API payloads, and a consistent UI component library (React Native) with theming.
**Acceptance Criteria**:
- Shared types package for Business, Service, Staff, Booking, User, Review, etc.
- Design tokens: colors, typography, spacing, shadows.
- Reusable components: Button, Input, Card, Modal, Calendar, TimeSlotPicker, RatingStars, Avatar, etc.
- Dark mode support.
- Accessibility (minimum contrast, screen reader labels).
**Priority**: P0

### 3.13 Reviews & Ratings
**Description**: Customers can leave star rating and text review after completed appointment. Business average rating displayed.
**Acceptance Criteria**:
- Post-booking prompt to review.
- Rating 1-5 stars, optional text, optional photos.
- Review moderation (admin can hide/report).
- Business detail shows average rating, total reviews, distribution.
- List of reviews with sorting (recent, highest, lowest).
- Provider can respond to reviews.
- Prevent duplicate reviews for same booking.
**Priority**: P1

### 3.14 Payment Integration
**Description**: Secure payment processing for prepaid bookings, deposits, or no-show fees. Support multiple methods (card, digital wallets).
**Acceptance Criteria**:
- Integration with Stripe/PayPal.
- Save card for future use (tokenization).
- Payment flow: enter card details or use saved card, confirm.
- Handle 3D Secure.
- Receipt generation and email.
- Refund processing for cancellations (according to policy).
- PCI compliance (never store raw card data).
- Support multiple currencies.
**Priority**: P0

### 3.15 Notifications
**Description**: Push notifications, email, SMS for booking confirmations, reminders, cancellations, promotions, chat messages.
**Acceptance Criteria**:
- Booking confirmation push/email.
- Reminder 24h and 1h before appointment.
- Cancellation notification.
- Marketing/promotional notifications (opt-in).
- In-app notification center.
- Real-time updates via WebSocket for booking status changes.
- Provider notifications for new bookings, cancellations.
**Priority**: P0

### 3.16 Provider / Business Owner Portal
**Description**: Web dashboard for business owners to manage profile, services, staff, schedule, bookings, customers, reviews, and settings.
**Acceptance Criteria**:
- Business profile management (photos, description, contact, social links).
- Service management (CRUD, pricing, duration, category, buffer, active/inactive).
- Staff management (add/edit/remove, assign services, set working hours, permissions).
- Calendar view of bookings with filters (staff, service, date).
- Booking management: view details, confirm, cancel, reschedule, mark no-show, add notes.
- Customer management: view customer list, booking history, notes.
- Availability settings: regular hours, special dates/holidays, breaks.
- Review management: view and respond to reviews.
- Reports: basic analytics (bookings count, revenue, popular services).
- Notification preferences.
- Multi-location support if applicable.
**Priority**: P0

### 3.17 Admin Dashboard
**Description**: Super admin panel to manage all businesses, users, categories, reviews, platform settings, and monitor system.
**Acceptance Criteria**:
- Business management: approve/reject new businesses, suspend, view details.
- User management: list users, suspend, view activity.
- Category management: CRUD categories, set icons, order.
- Review moderation: flag, hide, delete reviews.
- Platform settings: commission rates, cancellation policies, supported regions.
- Analytics dashboard: total bookings, revenue, active users, top businesses.
- System health: job queues, error logs.
- Role-based access control (super admin, support).
**Priority**: P1

### 3.18 Background Jobs (BullMQ)
**Description**: Asynchronous processing for tasks like sending notifications, generating reports, cleaning up expired holds, processing payments, syncing calendars.
**Acceptance Criteria**:
- Job queues for email, push, SMS notifications.
- Scheduled jobs for reminders (24h, 1h before).
- Payment processing queue (capture, refund).
- Booking expiry: release unpaid holds after timeout.
- Data export/report generation.
- Retry with exponential backoff, dead letter queue.
- Monitoring via Bull Board or similar.
**Priority**: P0

## 4. Non-Functional Requirements
- **Performance**: API response < 200ms for 95% of requests, slot computation < 500ms.
- **Scalability**: Support 100k concurrent users.
- **Security**: HTTPS, JWT, rate limiting, input validation, OWASP top 10.
- **Availability**: 99.9% uptime.
- **Accessibility**: WCAG 2.1 AA for web, mobile accessibility.
- **Localization**: i18n support for multiple languages.

## 5. Assumptions & Dependencies
- Third-party services: Stripe for payments, Twilio/SendGrid for SMS/email, Firebase for push notifications, Google Maps API.
- Cloud infrastructure: AWS/GCP with Kubernetes.
- Database: PostgreSQL with Redis for caching and BullMQ.

## 6. Glossary
- **Buffer time**: Extra time before/after service for preparation/cleanup.
- **Slot**: A specific start time for a service of given duration.
- **Provider**: Business owner or staff.