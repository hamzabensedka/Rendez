# Planity Clone - Product Specification

## 1. Overview
The Planity Clone is a comprehensive booking platform for beauty and wellness services. It connects users with local professionals, allowing them to discover businesses, browse services, check real-time availability, and book appointments. The platform includes a consumer mobile app, a web portal for business owners, and an admin dashboard for platform governance.

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** High
**Description:** Secure onboarding and login for users, providers, and admins.
**Acceptance Criteria:**
- Users can sign up and log in using Email/Password or OAuth (Google/Apple).
- Password reset functionality via email link.
- Role-based access control (User, Provider, Admin) routing to correct interfaces.
- Session persists across app restarts using secure token storage.

### 2.2 Guest Browse & Explore
**Priority:** High
**Description:** Allow unauthenticated users to explore the platform.
**Acceptance Criteria:**
- Guests can view the homepage, search, and view business details.
- Guests are prompted to log in or sign up only when attempting to book an appointment or save a favorite.

### 2.3 Business Search & Discovery
**Priority:** High
**Description:** Core search functionality to find businesses.
**Acceptance Criteria:**
- Search bar accepts business name, service type, or location.
- Filters available: Price range, Rating, Open Now, Specific Services.
- Sorting options: Relevance, Distance, Rating, Price.
- Pagination/infinite scroll for search results.

### 2.4 Map-based Search
**Priority:** Medium
**Description:** Geographical exploration of available businesses.
**Acceptance Criteria:**
- Map view displays pins for businesses in the current viewport.
- Panning or zooming the map dynamically updates the list of businesses.
- Tapping a pin displays a mini-card with business name, rating, and next available slot.
- Tapping the mini-card navigates to the Business Detail View.

### 2.5 Business Detail View
**Priority:** High
**Description:** Comprehensive profile page for a business.
**Acceptance Criteria:**
- Displays photo gallery, business hours, address, contact info, and description.
- Lists available services with durations and prices.
- Lists staff members with their individual ratings.
- Displays aggregated reviews and ratings.
- "Book Now" CTA prominently displayed.

### 2.6 Service Categories
**Priority:** High
**Description:** Browsing via predefined categories.
**Acceptance Criteria:**
- Homepage displays main categories (e.g., Hair, Nails, Spa, Barber).
- Selecting a category shows a filtered list of businesses offering those services.
- Categories are managed dynamically via the Admin Dashboard.

### 2.7 Booking Flow
**Priority:** High
**Description:** The end-to-end process of scheduling an appointment.
**Acceptance Criteria:**
- User selects a service, then a staff member (or "Any professional").
- User selects an available time slot from a calendar/day picker.
- User reviews booking details and proceeds to payment.
- Upon successful payment, booking is confirmed and a success screen is displayed.

### 2.8 Appointment Management
**Priority:** High
**Description:** Users can view and manage their bookings.
**Acceptance Criteria:**
- "My Bookings" screen shows Upcoming and Past appointments.
- Users can cancel an appointment based on the business's cancellation policy.
- Users can reschedule an appointment (triggers a new slot selection).
- Status indicators (Pending, Confirmed, Completed, Canceled).

### 2.9 Favorites
**Priority:** Low
**Description:** Save preferred businesses for quick access.
**Acceptance Criteria:**
- Heart icon on business cards and detail pages to toggle favorite status.
- "Favorites" tab in user profile showing saved businesses.
- Removing a favorite updates the list instantly.

### 2.10 User Profile
**Priority:** Medium
**Description:** Manage personal account settings.
**Acceptance Criteria:**
- Edit personal information (name, phone, email).
- Manage saved payment methods.
- Configure notification preferences (Email, Push).
- View booking history and logout.

### 2.11 Availability & Slot Computation
**Priority:** High
**Description:** Real-time calculation of open booking slots.
**Acceptance Criteria:**
- System calculates available slots based on staff working hours, existing bookings, and service duration.
- Buffers/cleanup times between appointments are respected.
- Slots are locked temporarily (e.g., 5 mins) during the booking process to prevent double-booking.

### 2.12 Shared Types & Design System
**Priority:** High
**Description:** Unified UI/UX and data contracts.
**Acceptance Criteria:**
- Frontend uses a centralized design system (buttons, inputs, cards, typography).
- Shared TypeScript types/interfaces for API requests and responses are defined and used across frontend and backend.
- Dark mode support.

### 2.13 Reviews & Ratings
**Priority:** Medium
**Description:** Feedback system for completed services.
**Acceptance Criteria:**
- Users receive a prompt to review after a completed appointment.
- Reviews include a 1-5 star rating and optional text.
- Business owners can reply to reviews.
- Average rating is calculated and displayed on the Business Detail View.

### 2.14 Payment Integration
**Priority:** High
**Description:** Secure processing of booking fees or deposits.
**Acceptance Criteria:**
- Stripe integration for credit card payments.
- Option to pay in full or place a deposit based on business configuration.
- Secure tokenization of card data (no raw card data stored on servers).
- Automated refunds processed for eligible cancellations.

### 2.15 Notifications
**Priority:** Medium
**Description:** Keep users and providers informed.
**Acceptance Criteria:**
- Push notifications for booking confirmation, reminders (24h and 1h before), and status changes.
- Email notifications for receipts and cancellations.
- In-app notification center for recent alerts.

### 2.16 Provider / Business Owner Portal
**Priority:** High
**Description:** Dashboard for businesses to manage operations.
**Acceptance Criteria:**
- Calendar view (Day/Week) showing all staff schedules and bookings.
- Manage services (add, edit, price, duration).
- Manage staff profiles and working hours.
- View analytics (revenue, booking count, utilization).
- Respond to reviews and manage business profile details.

### 2.17 Admin Dashboard
**Priority:** Medium
**Description:** Platform management and oversight.
**Acceptance Criteria:**
- View and manage all users and businesses (suspend, edit).
- Manage platform-wide service categories.
- View platform metrics (GMV, active users, bookings).
- Handle dispute resolution between users and providers.

### 2.18 Background Jobs (BullMQ)
**Priority:** High
**Description:** Asynchronous processing for non-blocking operations.
**Acceptance Criteria:**
- Email/SMS sending is queued and processed asynchronously.
- Reminder jobs are scheduled and executed at the correct time.
- Payment reconciliation and refund processing are handled via queues.
- Failed jobs are retried with exponential backoff and logged for admin review.