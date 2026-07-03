# Product Specification: Planity Clone

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with beauty and wellness businesses. It enables discovery, booking, and management of appointments. The system includes a customer-facing app, a provider portal, and an admin dashboard.

## 2. User Roles
- Guest: Unauthenticated user.
- Customer: Authenticated user.
- Provider/Business Owner: Manages business profile, services, staff, appointments.
- Admin: Platform administrator.

## 3. Features

### 3.1 User Authentication
Description: Secure sign-up, login, password reset, and session management.
Acceptance Criteria:
- Customer can sign up with email/password or social login (Google, Apple).
- Provider sign-up requires business verification.
- Password reset via email link.
- JWT-based authentication with refresh tokens.
- Session persists across app restarts.
Priority: P0

### 3.2 Guest Browse & Explore
Description: Unauthenticated users can browse businesses, services, and reviews without signing up.
Acceptance Criteria:
- Guest can view home feed with featured businesses.
- Guest can search and filter businesses.
- Guest can view business details, services, and reviews.
- Booking prompts sign-up/login.
Priority: P0

### 3.3 Business Search & Discovery
Description: Search businesses by name, category, location, and filters.
Acceptance Criteria:
- Search bar with autocomplete.
- Filters: category, rating, price range, distance, availability.
- Results sorted by relevance, rating, distance.
- Pagination.
Priority: P0

### 3.4 Map-based Search
Description: Interactive map showing business locations.
Acceptance Criteria:
- Map view with pins for businesses.
- Tap pin to see summary card.
- Search within map bounds.
- Clustering for dense areas.
- Toggle between list and map view.
Priority: P1

### 3.5 Business Detail View
Description: Comprehensive business profile with services, reviews, photos, and booking.
Acceptance Criteria:
- Display business name, address, contact, hours, description.
- Photo gallery.
- List of services with prices and durations.
- Customer reviews with ratings.
- "Book Now" button.
- Add to favorites.
Priority: P0

### 3.6 Service Categories
Description: Hierarchical categories for services (e.g., Hair > Haircut).
Acceptance Criteria:
- Admin can manage categories.
- Categories displayed in navigation.
- Businesses tagged with categories.
- Filter by category.
Priority: P0

### 3.7 Booking Flow
Description: Step-by-step appointment booking.
Acceptance Criteria:
- Select service, staff (optional), date, time slot.
- Confirm booking details.
- Apply promo code.
- Payment (if required).
- Booking confirmation with details.
- Guest forced to sign up before confirmation.
Priority: P0

### 3.8 Appointment Management
Description: Customers can view, reschedule, cancel appointments.
Acceptance Criteria:
- List of upcoming and past appointments.
- Reschedule with new time slot selection.
- Cancel with reason (optional).
- Cancellation policy enforcement (e.g., 24h notice).
- Push notification reminders.
Priority: P0

### 3.9 Favorites
Description: Save businesses to favorites list.
Acceptance Criteria:
- Heart icon on business cards.
- Toggle favorite status.
- View favorites list.
- Sync across devices.
Priority: P1

### 3.10 User Profile
Description: Manage personal information, preferences, payment methods.
Acceptance Criteria:
- Edit name, email, phone, profile picture.
- Manage saved payment methods.
- Notification preferences.
- View booking history.
- Delete account.
Priority: P1

### 3.11 Availability & Slot Computation
Description: Real-time availability calculation based on business hours, staff schedules, existing bookings, and service duration.
Acceptance Criteria:
- Business sets working hours and breaks.
- Staff assigned to services with individual schedules.
- Slot generation considers buffer time between appointments.
- Overlapping bookings prevented.
- Real-time updates when slots are taken.
Priority: P0

### 3.12 Shared Types & Design System
Description: Consistent TypeScript types and UI components across apps.
Acceptance Criteria:
- Shared types for User, Business, Service, Appointment, Review, etc.
- Reusable UI components (buttons, cards, inputs) in a design system.
- Theme support (light/dark mode).
- Accessibility compliance (WCAG 2.1 AA).
Priority: P1

### 3.13 Reviews & Ratings
Description: Customers can leave reviews and ratings after appointments.
Acceptance Criteria:
- Star rating (1-5) and text review.
- Review moderation by provider/admin.
- Display average rating and review count.
- Sort reviews by recent, helpful.
- Provider can respond to reviews.
Priority: P1

### 3.14 Payment Integration
Description: Secure payment processing for bookings requiring prepayment or deposits.
Acceptance Criteria:
- Support credit/debit cards, digital wallets (Apple Pay, Google Pay).
- PCI-DSS compliant via Stripe.
- Hold/capture flow for deposits.
- Refund processing for cancellations.
- Transaction history for customers and providers.
Priority: P0

### 3.15 Notifications
Description: Push, email, and in-app notifications for booking confirmations, reminders, promotions.
Acceptance Criteria:
- Booking confirmation and reminder notifications.
- Reschedule/cancellation notifications.
- Marketing/promotional notifications (opt-in).
- In-app notification center.
- Notification preferences management.
Priority: P1

### 3.16 Provider / Business Owner Portal
Description: Web portal for providers to manage business, services, staff, appointments, and analytics.
Acceptance Criteria:
- Dashboard with upcoming appointments, revenue summary.
- Manage business profile, hours, photos.
- CRUD services and assign to staff.
- Staff management with schedules.
- Appointment calendar with drag-and-drop reschedule.
- Accept/decline booking requests (if manual approval).
- View customer reviews and respond.
- Basic analytics (bookings, revenue, popular services).
Priority: P0

### 3.17 Admin Dashboard
Description: Super admin panel for platform management.
Acceptance Criteria:
- Manage all businesses, categories, users.
- Approve/reject business registrations.
- Monitor platform metrics (total bookings, revenue, active users).
- Handle disputes and reports.
- Configure platform settings (commission rates, cancellation policies).
- Audit logs.
Priority: P1

### 3.18 Background Jobs (BullMQ)
Description: Asynchronous job processing for notifications, reminders, analytics, and cleanup.
Acceptance Criteria:
- Queue for sending push/email notifications.
- Scheduled jobs for appointment reminders (24h before, 1h before).
- Job to update availability cache.
- Job to generate daily/weekly reports.
- Retry with exponential backoff.
- Dead letter queue for failed jobs.
Priority: P1

## 4. Non-Functional Requirements
- Performance: API response < 200ms p95, app load < 3s.
- Scalability: Support 100k concurrent users.
- Security: HTTPS, data encryption at rest, OWASP top 10 protection.
- Accessibility: WCAG 2.1 AA.
- Localization: Support multiple languages (English, French initially).

## 5. Prioritization Summary
P0 (Must-have): User Authentication, Guest Browse, Business Search, Business Detail, Service Categories, Booking Flow, Appointment Management, Availability & Slot Computation, Payment Integration, Provider Portal.
P1 (Should-have): Map-based Search, Favorites, User Profile, Shared Types & Design System, Reviews & Ratings, Notifications, Admin Dashboard, Background Jobs.
P2 (Nice-to-have): Social sharing, loyalty program, advanced analytics, AI recommendations.