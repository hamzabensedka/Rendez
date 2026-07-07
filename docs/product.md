# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty and wellness businesses. It enables discovery, booking, payments, and management for clients, providers, and admins.

## Feature Specifications

### 1. User Authentication
**Priority:** P0
**Description:** Secure registration and login for clients and business owners.
**Acceptance Criteria:**
- Clients can sign up with email/phone and password.
- Business owners can register and are linked to a business profile.
- Social login (Google, Apple) supported.
- JWT-based session with refresh token.
- Password reset via email/SMS.
- Role-based authorization enforced.

### 2. Guest Browse & Explore
**Priority:** P0
**Description:** Non-authenticated users can explore businesses and services.
**Acceptance Criteria:**
- Guests can view business list and details.
- Guests can browse service categories.
- Prompt to login appears when attempting to book.
- No personal data stored for guests.

### 3. Business Search & Discovery
**Priority:** P0
**Description:** Search businesses by name, service, or keyword.
**Acceptance Criteria:**
- Full-text search with typo tolerance.
- Filters by category, price, rating, distance.
- Sort by relevance, distance, rating.
- Results paginated.

### 4. Map-based Search
**Priority:** P0
**Description:** Visual discovery via interactive map.
**Acceptance Criteria:**
- Map shows business pins within viewport.
- Tap pin shows quick preview.
- Map moves trigger search update.
- List/map toggle view.

### 5. Business Detail View
**Priority:** P0
**Description:** Comprehensive page for a business.
**Acceptance Criteria:**
- Shows photos, description, services, staff, hours.
- Displays ratings and reviews summary.
- Shows available slots for selected service.
- "Book" CTA initiates booking flow.
- Booking saved to appointment management.

### 6. Service Categories
**Priority:** P0
**Description:** Hierarchical categorization of services.
**Acceptance Criteria:**
- Categories (e.g., Hair, Nails) with subcategories.
- Each business assigns services to categories.
- Category filter on search and explore.
- Icons and labels in design system.

### 7. Booking Flow
**Priority:** P0
**Description:** Multi-step booking for clients.
**Acceptance Criteria:**
- Select service, staff (optional), date, time slot.
- Show price and duration.
- Login required to confirm.
- Confirmation screen with summary.
- Booking saved to appointment management.

### 8. Appointment Management
**Priority:** P0
**Description:** Clients and providers view/manage bookings.
**Acceptance Criteria:**
- Clients see upcoming/past appointments.
- Cancel/reschedule with rules (e.g., 24h notice).
- Providers see daily/weekly calendar.
- Status updates (confirmed, completed, cancelled).

### 9. Favorites
**Priority:** P1
**Description:** Users save favorite businesses.
**Acceptance Criteria:**
- Add/remove from business detail or list.
- Favorites list in user profile.
- Sync across devices.

### 10. User Profile
**Priority:** P1
**Description:** Manage personal info and preferences.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- View booking history and favorites.
- Notification preferences.
- Payment methods management.

### 11. Availability & Slot Computation
**Priority:** P0
**Description:** Generate bookable slots based on business hours, staff, and existing appointments.
**Acceptance Criteria:**
- Compute slots per service duration and buffer.
- Respect holidays and breaks.
- Real-time update on booking.
- Handle multiple staff members.

### 12. Shared Types & Design System
**Priority:** P0
**Description:** Common TypeScript types and UI components.
**Acceptance Criteria:**
- Shared package with types (User, Business, Booking, etc.).
- Design system: buttons, cards, colors, typography.
- Used across mobile and web.
- Documented in Storybook.

### 13. Reviews & Ratings
**Priority:** P1
**Description:** Clients rate and review businesses.
**Acceptance Criteria:**
- Submit star rating and text after completed appointment.
- Display average rating and count.
- Providers can respond to reviews.
- Moderation by admin for inappropriate content.

### 14. Payment Integration
**Priority:** P1
**Description:** Secure payment processing for bookings.
**Acceptance Criteria:**
- Integrate Stripe/PayPal.
- Charge on booking or no-show policy.
- Save card for future.
- Refund/cancel logic.
- PCI compliant.

### 15. Notifications
**Priority:** P1
**Description:** Push, email, SMS notifications.
**Acceptance Criteria:**
- Booking confirmation sent.
- Reminder 24h before.
- Cancel/reschedule alerts.
- Opt-out settings.
- Use background jobs for scheduling.

### 16. Provider / Business Owner Portal
**Priority:** P1
**Description:** Web dashboard for businesses.
**Acceptance Criteria:**
- Manage profile, services, staff, hours.
- View appointments and analytics.
- Respond to reviews.
- Accept/decline bookings.

### 17. Admin Dashboard
**Priority:** P2
**Description:** Super admin management.
**Acceptance Criteria:**
- Manage users, businesses, categories.
- Moderate reviews and content.
- View platform metrics.
- Configure system settings.

### 18. Background Jobs (BullMQ)
**Priority:** P0
**Description:** Async processing for heavy tasks.
**Acceptance Criteria:**
- Queue for notifications, slot computation, emails.
- Retry and failure handling.
- Dashboard for monitoring queues.
- Scalable workers.

## Prioritization Summary
- P0: Core MVP features for launch.
- P1: Essential for full user experience post-MVP.
- P2: Administrative and scale features.

## Success Metrics
- Booking conversion rate > 20%.
- User retention > 30% monthly.
- Provider satisfaction > 4.5/5.
