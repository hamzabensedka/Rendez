# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting users with local service providers (beauty, wellness, etc.). Users can browse, search, book appointments, and manage their bookings. Providers manage their availability and services via a dedicated portal. An admin dashboard oversees the entire ecosystem.

## Features & Acceptance Criteria

### 1. User Authentication
**Priority: P0**
- **Description**: Users can sign up, log in, and manage their accounts. Supports email/password and social login (Google, Apple).
- **Acceptance Criteria**:
  - User can register with email + password, Google, or Apple.
  - Email verification required for email sign-up.
  - Password reset via email.
  - Session management with JWT tokens (access + refresh).
  - Logout invalidates tokens.
  - Error handling for duplicate emails, invalid credentials.

### 2. Guest Browse & Explore
**Priority: P0**
- **Description**: Unauthenticated users can browse featured businesses and service categories.
- **Acceptance Criteria**:
  - Guest sees a curated list of popular businesses.
  - Guest can view service categories (e.g., Hair, Nails, Massage).
  - Guest can tap a business to see details (limited, no booking).
  - Prompt to sign up/log in when attempting to book.

### 3. Business Search & Discovery
**Priority: P0**
- **Description**: Users can search for businesses by name, service, or location.
- **Acceptance Criteria**:
  - Search bar with autocomplete suggestions.
  - Filter by category, rating, price range, distance.
  - Sort by relevance, rating, distance.
  - Results displayed as cards with name, rating, distance, and first available slot.
  - Pagination or infinite scroll.

### 4. Map-based Search
**Priority: P1**
- **Description**: Users can view businesses on an interactive map.
- **Acceptance Criteria**:
  - Map shows business pins with clustering.
  - Tap pin shows business name and rating.
  - Tap info window navigates to business detail.
  - Map updates as user pans/zooms.
  - Current location button.

### 5. Business Detail View
**Priority: P0**
- **Description**: Detailed view of a business including services, photos, reviews, and location.
- **Acceptance Criteria**:
  - Header with business name, rating, address, distance.
  - Photo gallery (swipeable).
  - List of services with name, duration, price, and "Book" button.
  - Reviews section with average rating and individual reviews.
  - Map showing exact location.
  - Contact info (phone, website).
  - Business hours.

### 6. Service Categories
**Priority: P0**
- **Description**: Hierarchical categories for services (e.g., Hair > Haircut, Color).
- **Acceptance Criteria**:
  - Top-level categories displayed on home screen.
  - Tapping a category shows subcategories or businesses.
  - Admin can manage categories via dashboard.

### 7. Booking Flow
**Priority: P0**
- **Description**: End-to-end booking process from selecting a service to confirmation.
- **Acceptance Criteria**:
  - User selects service from business detail.
  - Calendar view showing available dates (next 30 days).
  - Time slot selection based on provider availability.
  - Booking summary with service, date, time, price, and provider.
  - Optional notes field.
  - Confirm booking triggers payment (if required) or free booking.
  - Confirmation screen with booking ID and details.
  - Email/SMS confirmation sent.
  - Booking appears in user's appointment list.

### 8. Appointment Management
**Priority: P0**
- **Description**: Users can view, reschedule, or cancel upcoming appointments.
- **Acceptance Criteria**:
  - List of upcoming and past appointments.
  - Each appointment shows business, service, date, time, status.
  - Cancel button (with confirmation dialog).
  - Reschedule flow similar to booking (select new slot).
  - Cancellation policy enforced (e.g., free cancellation up to 24h before).
  - Past appointments can be reviewed.

### 9. Favorites
**Priority: P1**
- **Description**: Users can save businesses to a favorites list.
- **Acceptance Criteria**:
  - Heart icon on business card and detail view.
  - Toggle to add/remove from favorites.
  - Favorites tab in user profile showing saved businesses.
  - Quick access to book from favorites.

### 10. User Profile
**Priority: P1**
- **Description**: User profile management.
- **Acceptance Criteria**:
  - Edit name, email, phone number, profile picture.
  - Change password.
  - View booking history.
  - Manage notification preferences.
  - Delete account option.

### 11. Availability & Slot Computation
**Priority: P0**
- **Description**: Providers define their working hours and breaks; system computes available slots.
- **Acceptance Criteria**:
  - Provider sets weekly schedule (e.g., Mon-Fri 9-18, lunch break 12-13).
  - Provider can set specific days off or holidays.
  - System generates 15/30/60 min slots based on service duration.
  - Slots are blocked if overlapping with existing bookings.
  - Real-time availability updates.
  - Buffer time between appointments configurable.

### 12. Shared Types & Design System
**Priority: P0**
- **Description**: Consistent UI components and shared TypeScript types across frontend and backend.
- **Acceptance Criteria**:
  - Design system includes buttons, inputs, cards, modals, typography, colors.
  - Shared types for User, Business, Service, Booking, etc.
  - Storybook or similar for component documentation.
  - Responsive design for mobile and tablet.

### 13. Reviews & Ratings
**Priority: P1**
- **Description**: Users can rate and review businesses after a completed appointment.
- **Acceptance Criteria**:
  - Rating from 1 to 5 stars.
  - Optional text review.
  - Review appears on business detail after moderation (optional).
  - Average rating recalculated.
  - Users can edit/delete their own reviews.
  - Business owner can respond to reviews.

### 14. Payment Integration
**Priority: P1**
- **Description**: Secure payment processing for bookings (deposit or full payment).
- **Acceptance Criteria**:
  - Integration with Stripe (or similar).
  - User can pay via credit card, Apple Pay, Google Pay.
  - Payment required at booking confirmation (configurable per business).
  - Refund processing for cancellations (per policy).
  - Payment history in user profile.
  - PCI compliance.

### 15. Notifications
**Priority: P1**
- **Description**: Push and email notifications for booking confirmations, reminders, and updates.
- **Acceptance Criteria**:
  - Push notification on booking confirmation.
  - Reminder 24h before appointment.
  - Notification on cancellation/reschedule.
  - Email notifications for same events.
  - User can opt out of marketing notifications.
  - In-app notification center.

### 16. Provider / Business Owner Portal
**Priority: P0**
- **Description**: Web-based portal for providers to manage their business, services, and appointments.
- **Acceptance Criteria**:
  - Login with business owner credentials.
  - Dashboard with upcoming appointments, revenue, and stats.
  - Manage services (add, edit, delete, set price/duration).
  - Manage availability (weekly schedule, days off).
  - View and manage bookings (confirm, cancel, mark as completed).
  - View and respond to reviews.
  - Business profile editing (photos, description, address).
  - Staff management (add/remove staff, assign services).

### 17. Admin Dashboard
**Priority: P1**
- **Description**: Super admin panel to manage users, businesses, categories, and platform settings.
- **Acceptance Criteria**:
  - Overview metrics (total users, bookings, revenue).
  - Manage users (view, suspend, delete).
  - Manage businesses (approve, suspend, delete).
  - Manage service categories (CRUD).
  - View all bookings and transactions.
  - System settings (commission rates, cancellation policies).
  - Audit logs.

### 18. Background Jobs (BullMQ)
**Priority: P1**
- **Description**: Asynchronous job processing for notifications, reminders, and data cleanup.
- **Acceptance Criteria**:
  - Job queue for sending push/email notifications.
  - Scheduled job for appointment reminders (24h before).
  - Job for cleaning up expired tokens or incomplete bookings.
  - Retry mechanism with exponential backoff.
  - Monitoring dashboard for job status.

## Priorities Summary
- **P0**: Authentication, Guest Browse, Search, Business Detail, Categories, Booking Flow, Appointment Management, Availability, Shared Types, Provider Portal.
- **P1**: Map Search, Favorites, Profile, Reviews, Payments, Notifications, Admin Dashboard, Background Jobs.

## Technical Notes
- Mobile app: React Native (iOS/Android).
- Backend: Node.js with Express, PostgreSQL, Redis.
- Background jobs: BullMQ with Redis.
- Payments: Stripe.
- Notifications: Firebase Cloud Messaging (push), SendGrid (email).
- Maps: Google Maps API.
- Authentication: JWT + OAuth2.

This specification covers all user-facing and backend features required for a minimum viable product (MVP) with room for future enhancements.