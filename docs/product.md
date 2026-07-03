# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with local beauty and wellness businesses. It enables seamless discovery, booking, and management of appointments. The system supports three user roles: Customer, Provider (Business Owner), and Admin. This document defines the complete feature set, acceptance criteria, and priorities.

## 2. User Roles & Personas
- **Customer**: End user searching for services, booking appointments, managing profile.
- **Provider**: Business owner managing services, staff, schedules, and appointments.
- **Admin**: Platform administrator overseeing businesses, users, and system health.

## 3. Feature Specifications

### 3.1 User Authentication
**Priority**: P0 (Critical)
**Description**: Secure sign-up, login, and session management for all roles.
**Acceptance Criteria**:
- Customer can sign up with email/password, Google, or Apple SSO.
- Provider sign-up requires business details and verification.
- Admin login via separate secure portal.
- Password reset flow with email link.
- JWT-based authentication with refresh tokens.
- Session persistence across app restarts.
- Logout clears local tokens and redirects to login.

### 3.2 Guest Browse & Explore
**Priority**: P1 (High)
**Description**: Unauthenticated users can browse businesses and services without signing up.
**Acceptance Criteria**:
- Guest can view home feed, search, and business details.
- Booking flow prompts sign-up/login at the final step.
- Favorites and profile actions are disabled with a prompt to register.
- No personal data is stored until account creation.

### 3.3 Business Search & Discovery
**Priority**: P0
**Description**: Customers find businesses via text search, filters, and categories.
**Acceptance Criteria**:
- Search bar with autocomplete for business names, services, and locations.
- Filters: category, rating, price range, distance, availability (today, this week).
- Sort by: relevance, rating, distance, price.
- Results display business card with photo, name, rating, distance, next available slot.
- Pagination with infinite scroll.
- Search history for logged-in users.

### 3.4 Map-based Search
**Priority**: P1
**Description**: Interactive map view to discover businesses geographically.
**Acceptance Criteria**:
- Map displays business pins with clustering for dense areas.
- Tapping a pin shows a preview card with name, rating, and distance.
- Map centers on user’s current location (with permission) or searched area.
- Search bar and filters work in map mode; results update dynamically.
- Toggle between list view and map view.

### 3.5 Business Detail View
**Priority**: P0
**Description**: Comprehensive business profile with services, reviews, and booking.
**Acceptance Criteria**:
- Header with cover photo, business name, rating, address, and favorite button.
- Tabbed sections: Services, About, Reviews, Photos.
- Services tab lists categories and individual services with duration, price, and “Book” button.
- About tab shows description, amenities, business hours, and contact info.
- Reviews tab with summary rating, distribution, and paginated review list.
- Photos tab with gallery of business images.
- Sticky “Book Now” button at bottom.

### 3.6 Service Categories
**Priority**: P0
**Description**: Hierarchical categorization of services for browsing and filtering.
**Acceptance Criteria**:
- Top-level categories: Hair, Nails, Skin, Massage, Makeup, etc.
- Subcategories (e.g., Hair > Haircut, Coloring, Styling).
- Category browsing screen with icons and popular subcategories.
- Selecting a category shows businesses offering those services.
- Admin can manage categories and subcategories.

### 3.7 Booking Flow
**Priority**: P0
**Description**: Step-by-step appointment booking from service selection to confirmation.
**Acceptance Criteria**:
- Step 1: Select service (from business detail or direct).
- Step 2: Choose staff member (if multiple) with their photo and rating.
- Step 3: Pick date from calendar showing available days.
- Step 4: Select time slot from real-time availability.
- Step 5: Review summary (service, staff, date, time, price, duration).
- Step 6: Add optional notes, apply promo code.
- Step 7: Payment (if required) or confirm booking.
- Confirmation screen with appointment details and option to add to calendar.
- Booking requires authentication; guest redirected to sign-up.

### 3.8 Appointment Management
**Priority**: P0
**Description**: Customers view, modify, and cancel upcoming appointments.
**Acceptance Criteria**:
- “My Appointments” screen with tabs: Upcoming, Past.
- Upcoming appointments show date, time, business, service, staff, status.
- Actions: Reschedule (re-enter booking flow with pre-filled data), Cancel (with confirmation dialog and cancellation policy notice).
- Past appointments show history with option to leave a review.
- Push notification reminders 24h and 1h before appointment.
- Cancellation policy enforced (e.g., free cancel up to 24h before).

### 3.9 Favorites
**Priority**: P1
**Description**: Save businesses for quick access.
**Acceptance Criteria**:
- Heart icon on business cards and detail page to toggle favorite.
- “Favorites” screen listing saved businesses with next available slot.
- Favorites sync across user’s devices.
- Requires authentication.

### 3.10 User Profile
**Priority**: P1
**Description**: Manage personal information, preferences, and payment methods.
**Acceptance Criteria**:
- Edit name, email, phone, profile photo.
- Manage saved payment methods (add, delete, set default).
- Notification preferences (push, email, SMS).
- View booking history and favorites.
- Delete account with data removal confirmation.

### 3.11 Availability & Slot Computation
**Priority**: P0
**Description**: Real-time calculation of available time slots based on business hours, staff schedules, existing bookings, and service duration.
**Acceptance Criteria**:
- Business sets operating hours per day, breaks, and holidays.
- Staff have individual working hours and service assignments.
- Slot engine considers service duration, buffer time between appointments, and travel time (if mobile service).
- Real-time updates when a slot is booked.
- Display only available slots to customers; handle timezone correctly.
- Admin can configure global buffer and slot interval (e.g., 15 min).

### 3.12 Shared Types & Design System
**Priority**: P0
**Description**: Consistent data models and UI components across frontend and backend.
**Acceptance Criteria**:
- TypeScript interfaces for User, Business, Service, Staff, Appointment, Review, etc.
- Design system with reusable components: Button, Card, Modal, Input, Avatar, RatingStars, etc.
- Theme tokens for colors, typography, spacing.
- Responsive layout for mobile (primary) and tablet.
- Accessibility: minimum contrast, touch targets 44px, screen reader support.

### 3.13 Reviews & Ratings
**Priority**: P1
**Description**: Customers rate and review businesses after appointments.
**Acceptance Criteria**:
- After a completed appointment, prompt to leave a review (rating 1-5, text, optional photo).
- Reviews displayed on business detail with most recent first.
- Business can respond to reviews publicly.
- Moderation: flag inappropriate content; admin can hide reviews.
- Average rating and distribution shown.
- Review helpfulness voting.

### 3.14 Payment Integration
**Priority**: P0
**Description**: Secure payment processing for bookings requiring prepayment or deposit.
**Acceptance Criteria**:
- Integrate with Stripe for card payments.
- Support for saved payment methods (tokenization).
- Payment flow: customer enters card details or selects saved card, confirms payment.
- Handle 3D Secure authentication.
- Booking only confirmed after successful payment.
- Refund processing for cancellations according to policy.
- Receipt sent via email.
- PCI compliance; no sensitive card data stored on own servers.

### 3.15 Notifications
**Priority**: P1
**Description**: Multi-channel notifications for booking confirmations, reminders, and marketing.
**Acceptance Criteria**:
- Push notifications (Firebase Cloud Messaging) for appointment reminders, status changes, promotions.
- Email notifications: booking confirmation, cancellation, receipt, password reset.
- SMS notifications for critical alerts (optional, opt-in).
- In-app notification center with history.
- Notification preferences per channel.
- Real-time updates for providers (new booking, cancellation).

### 3.16 Provider / Business Owner Portal
**Priority**: P0
**Description**: Web and mobile portal for providers to manage their business, services, staff, and appointments.
**Acceptance Criteria**:
- Dashboard with today’s appointments, revenue summary, upcoming bookings.
- Calendar view (day, week, month) with drag-and-drop rescheduling.
- Manage services: add, edit, delete, set price, duration, category, description.
- Manage staff: add/remove, assign services, set working hours, breaks, time off.
- Appointment management: confirm, cancel, reschedule, add notes, mark no-show.
- Client management: view client history, notes, contact.
- Business profile editing: photos, description, amenities, hours, location.
- Availability settings: buffer time, slot intervals, advance booking window.
- Reports: revenue, bookings, popular services, client retention.
- Multi-location support for chains.

### 3.17 Admin Dashboard
**Priority**: P1
**Description**: Centralized control for platform administration.
**Acceptance Criteria**:
- User management: list, search, suspend, delete customers and providers.
- Business management: approve/reject new businesses, edit details, suspend.
- Category management: CRUD for service categories and subcategories.
- Review moderation: view flagged reviews, hide/unhide.
- Transaction monitoring: view payments, refunds, disputes.
- System analytics: total users, bookings, revenue, active businesses.
- Configuration: global settings (cancellation policy, commission rate, slot interval).
- Role-based access control (super admin, support).

### 3.18 Background Jobs (BullMQ)
**Priority**: P1
**Description**: Asynchronous processing for non-blocking operations.
**Acceptance Criteria**:
- Job queue for sending emails, SMS, push notifications.
- Scheduled jobs for appointment reminders (24h, 1h before).
- Cleanup jobs: remove expired tokens, anonymize deleted user data.
- Report generation jobs.
- Retry logic with exponential backoff for failed jobs.
- Monitoring dashboard for queue health (Bull Board).

## 4. Non-Functional Requirements
- **Performance**: API response < 200ms for 95th percentile; slot computation < 500ms.
- **Scalability**: Support 100k concurrent users; horizontal scaling of backend.
- **Security**: HTTPS, input validation, rate limiting, OWASP top 10 protection.
- **Reliability**: 99.9% uptime for booking-critical services.
- **Localization**: Support multiple languages and currencies (future scope).

## 5. Priority Summary
- **P0 (Must-have)**: Authentication, Search & Discovery, Business Detail, Service Categories, Booking Flow, Appointment Management, Availability Engine, Shared Types, Payment, Provider Portal.
- **P1 (Should-have)**: Guest Browse, Map Search, Favorites, User Profile, Reviews & Ratings, Notifications, Admin Dashboard, Background Jobs.
- **P2 (Nice-to-have)**: Advanced analytics, loyalty programs, multi-language, social sharing.

## 6. Dependencies & Assumptions
- Third-party services: Stripe (payments), Firebase (push), SendGrid (email), Google Maps (maps).
- Providers must complete onboarding and verification before appearing in search.
- Customers must accept terms and privacy policy during sign-up.
- All dates/times stored in UTC; displayed in user’s local timezone.