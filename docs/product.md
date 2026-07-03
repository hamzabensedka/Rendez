# Planity Clone Product Specification

## Overview
Planity Clone is a mobile-first appointment booking platform connecting customers with beauty and wellness businesses. It enables seamless discovery, booking, and management of services. This document defines the complete feature set, acceptance criteria, and priorities for development.

## User Roles
- **Guest**: Unauthenticated user with limited access.
- **Customer**: Authenticated user who books services.
- **Provider**: Business owner managing services, staff, and appointments.
- **Admin**: Platform administrator with full oversight.

## Feature Specifications

### 1. User Authentication
**Priority:** P0 (Critical)
**Description:** Secure sign-up, login, and session management for customers and providers.
**Acceptance Criteria:**
- Customer can register with email/password, Google, or Apple SSO.
- Provider registration requires business details and verification.
- Login returns JWT access and refresh tokens; access token expires in 15 minutes.
- Refresh token rotation implemented; old token invalidated on use.
- Password reset flow via email link with expiry.
- Session persists across app restarts using secure storage.
- Logout clears tokens and local session data.
- All endpoints except public ones require valid access token.

### 2. Guest Browse & Explore
**Priority:** P2 (Nice-to-have)
**Description:** Allow unauthenticated users to browse businesses and services before signing up.
**Acceptance Criteria:**
- Guest can view business listings, search, and see business details.
- Guest can view service categories and individual services.
- Booking flow prompts sign-up/login at the confirmation step.
- Favorites and profile actions are disabled for guests.
- Clear call-to-action to register after a few interactions.

### 3. Business Search & Discovery
**Priority:** P0
**Description:** Full-text and filtered search for businesses and services.
**Acceptance Criteria:**
- Search bar with autocomplete (business name, service, category).
- Filters: location (city/zip), rating, price range, availability today, open now.
- Results sorted by relevance, distance, or rating.
- Pagination with infinite scroll.
- Search query persists in URL for deep linking.
- No results state with suggestions to broaden filters.
- Recent searches saved locally for logged-in users.

### 4. Map-based Search
**Priority:** P1
**Description:** Interactive map view to discover businesses geographically.
**Acceptance Criteria:**
- Map displays business pins with summary card on tap.
- Clustering for dense areas.
- Map view syncs with list view filters.
- User can move map to update search area (bounding box).
- Current location button with permission request.
- Toggle between map and list view.

### 5. Business Detail View
**Priority:** P0
**Description:** Comprehensive business profile with services, reviews, and booking entry point.
**Acceptance Criteria:**
- Header with cover photo, business name, rating, address, and favorite button.
- Tabbed sections: About, Services, Reviews, Gallery.
- Services listed with name, duration, price, and "Book" button.
- Gallery with photo carousel.
- Reviews with star rating, text, and pagination.
- Contact options: call, directions (opens maps), share.
- Operating hours displayed with current open/closed status.
- Sticky "Book Now" button at bottom.

### 6. Service Categories
**Priority:** P0
**Description:** Hierarchical categorization of services for easy navigation.
**Acceptance Criteria:**
- Top-level categories (Hair, Nails, Massage, etc.) displayed on home screen.
- Subcategories shown on category selection (e.g., Hair > Haircut, Coloring).
- Category page shows relevant businesses with filters.
- Admin can manage categories and subcategories via dashboard.
- Categories support icons and images.

### 7. Booking Flow
**Priority:** P0
**Description:** Step-by-step booking process from service selection to confirmation.
**Acceptance Criteria:**
- Flow: Select service → Choose staff (optional) → Pick date/time → Review → Confirm.
- Date picker shows available days; unavailable days greyed out.
- Time slots displayed based on real-time availability.
- Staff selection shows available staff for that time slot.
- Review screen summarizes service, date, time, staff, price, and any add-ons.
- Confirmation screen with booking ID and option to add to calendar.
- Booking requires authentication; guest redirected to login/signup.
- Double-booking prevention: slot locked for 5 minutes during checkout.

### 8. Appointment Management
**Priority:** P0
**Description:** View, reschedule, and cancel upcoming and past appointments.
**Acceptance Criteria:**
- List of upcoming appointments with status (confirmed, pending, completed, cancelled).
- Past appointments history.
- Reschedule flow: select new date/time from available slots; old slot released.
- Cancel with reason selection and confirmation dialog.
- Cancellation policy displayed (e.g., free cancellation up to 24h before).
- Push notification reminders 24h and 1h before appointment.
- Add to calendar (Google/Apple) from appointment detail.

### 9. Favorites
**Priority:** P1
**Description:** Save businesses for quick access.
**Acceptance Criteria:**
- Heart icon on business cards and detail page to toggle favorite.
- Favorites list accessible from profile/tab bar.
- Favorites sync across user devices (server-side).
- Unfavorite removes from list with undo option.
- Empty state with suggestion to explore businesses.

### 10. User Profile
**Priority:** P1
**Description:** Manage personal information, preferences, and settings.
**Acceptance Criteria:**
- View/edit name, email, phone, profile photo.
- Notification preferences (push, email, SMS).
- Payment methods management (add, delete, set default).
- Booking history with filter by status.
- Delete account with confirmation and data wipe.
- Logout button.

### 11. Availability & Slot Computation
**Priority:** P0
**Description:** Real-time calculation of bookable time slots based on business hours, staff schedules, and existing bookings.
**Acceptance Criteria:**
- Business sets default working hours and breaks per day.
- Staff can have individual schedules overriding business defaults.
- Service duration plus buffer time determines slot length.
- Slot generation excludes past times, booked slots, and blocked-off periods.
- API returns available slots for a given service, staff, and date.
- Slot locking mechanism prevents double-booking during active checkout.
- Timezone-aware: all times stored in UTC, displayed in business local time.

### 12. Shared Types & Design System
**Priority:** P0 (Foundational)
**Description:** Unified TypeScript types and reusable UI components to ensure consistency across frontend and backend.
**Acceptance Criteria:**
- Shared types package for User, Business, Service, Appointment, Review, etc.
- Design system with tokens (colors, typography, spacing) and components (Button, Card, Input, Modal).
- Components support loading, error, empty, and disabled states.
- Responsive design for mobile (primary) and tablet.
- Dark mode support via theme provider.
- Accessibility: minimum contrast, touch targets 44px, screen reader labels.

### 13. Reviews & Ratings
**Priority:** P1
**Description:** Customers can rate and review businesses after a completed appointment.
**Acceptance Criteria:**
- Prompt to review appears after appointment marked completed.
- Rating 1-5 stars with optional text review and photo upload.
- Reviews displayed on business detail page with average rating.
- Provider can respond to reviews publicly.
- Review moderation: flagging, admin can hide inappropriate reviews.
- Sorting: most recent, highest/lowest rated.
- One review per appointment; can edit within 48 hours.

### 14. Payment Integration
**Priority:** P0
**Description:** Secure payment processing for bookings requiring prepayment or deposits.
**Acceptance Criteria:**
- Integration with Stripe for card payments.
- Support for saved payment methods (tokenization).
- Payment flow: enter card details or select saved card → confirm.
- Pre-authorization at booking; capture upon service completion or cancellation policy.
- Refund processing for cancellations according to policy.
- Receipt emailed after successful payment.
- PCI compliance: card data never touches our servers.
- Payment status tracking (pending, authorized, captured, refunded).

### 15. Notifications
**Priority:** P0
**Description:** Multi-channel notifications for booking updates, reminders, and marketing.
**Acceptance Criteria:**
- Push notifications via Firebase Cloud Messaging (FCM).
- Email notifications via SendGrid or similar.
- SMS notifications (optional, for critical alerts).
- Notification types: booking confirmation, reminder (24h, 1h), cancellation, reschedule, payment receipt, review request.
- In-app notification center with read/unread status.
- Notification preferences per channel in user profile.
- Real-time delivery using WebSockets for in-app toasts.

### 16. Provider / Business Owner Portal
**Priority:** P1
**Description:** Web and mobile portal for providers to manage their business, services, staff, and appointments.
**Acceptance Criteria:**
- Dashboard with today's appointments, revenue summary, new reviews.
- Appointment management: view, confirm, cancel, reschedule, mark no-show.
- Calendar view with day/week/month; color-coded by staff.
- Service management: CRUD services with name, duration, price, category, description, image.
- Staff management: add/edit staff, assign services, set schedules, manage breaks.
- Business profile editing: name, description, photos, hours, address.
- Availability overrides: block time off, special hours for holidays.
- Client management: view client history, notes.
- Reports: revenue, bookings, popular services (basic analytics).
- Multi-staff support with individual calendars.

### 17. Admin Dashboard
**Priority:** P1
**Description:** Central admin panel for platform oversight, moderation, and configuration.
**Acceptance Criteria:**
- User management: list, search, suspend/activate accounts.
- Business management: approve/reject new businesses, edit, suspend.
- Category management: CRUD categories and subcategories.
- Review moderation: view flagged reviews, hide/restore.
- Platform analytics: total bookings, revenue, active users, popular businesses.
- Configuration: global settings (cancellation policy, commission rate).
- Role-based access: super admin, support agent.
- Audit log for sensitive actions.

### 18. Background Jobs (BullMQ)
**Priority:** P1
**Description:** Asynchronous job processing for non-blocking operations like notifications, reminders, and cleanup.
**Acceptance Criteria:**
- Job queue for sending push/email/SMS notifications.
- Scheduled jobs for appointment reminders (24h, 1h before).
- Job to release expired locked slots after 5 minutes.
- Job to auto-cancel unpaid bookings after timeout.
- Job to generate daily/weekly reports for providers.
- Retry logic with exponential backoff for failed jobs.
- Dead letter queue for jobs exceeding max retries.
- Monitoring dashboard (Bull Board) for queue health.

## Priority Summary
- **P0 (MVP):** Authentication, Search & Discovery, Business Detail, Service Categories, Booking Flow, Appointment Management, Availability & Slot Computation, Shared Types & Design System, Payment Integration, Notifications.
- **P1 (V1.1):** Map-based Search, Favorites, User Profile, Reviews & Ratings, Provider Portal, Admin Dashboard, Background Jobs.
- **P2 (Future):** Guest Browse & Explore.

All features are designed to be modular, allowing incremental delivery while maintaining a cohesive user experience.