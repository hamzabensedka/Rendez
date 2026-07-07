# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, barbers, spas). It supports customer booking, provider management, and admin oversight.

## User Roles
- **Customer**: browses, books, manages appointments.
- **Business Owner / Provider**: manages business profile, services, availability, appointments.
- **Admin**: platform oversight, category management, support.

## Feature Specifications

### 1. User Authentication
**Description**: Secure signup/login for customers via email, phone OTP, and social.
**Acceptance Criteria**:
- User can register with email/password or phone OTP.
- Passwords hashed (bcrypt).
- JWT or session auth with refresh token.
- Social login (Google/Apple) optional.
- Logout invalidates session.
**Priority**: Must

### 2. Guest Browse & Explore
**Description**: Non-authenticated users can explore businesses and services.
**Acceptance Criteria**:
- Guest can view home feed of featured businesses.
- Guest can view business detail and services but not book.
- Prompt to login when attempting booking.
**Priority**: Must

### 3. Business Search & Discovery
**Description**: Search businesses by name, service, or category.
**Acceptance Criteria**:
- Text search with autocomplete.
- Filter by category, price, rating, distance.
- Sort by relevance, distance, rating.
- Results paginated.
**Priority**: Must

### 4. Map-based Search
**Description**: Visual search on map with pins.
**Acceptance Criteria**:
- Show businesses as pins within viewport.
- Tap pin shows mini detail card.
- Radius filter adjustable.
- List-map toggle.
**Priority**: Should

### 5. Business Detail View
**Description**: Comprehensive view of a business.
**Acceptance Criteria**:
- Cover image, gallery, description, address, contact.
- List of services with prices/durations.
- Staff list if applicable.
- Reviews summary and button to book.
**Priority**: Must

### 6. Service Categories
**Description**: Taxonomy of services (Hair, Nails, etc.).
**Acceptance Criteria**:
- Hierarchical categories (parent-child).
- Admin can create/edit/disable.
- Used in search and navigation.
**Priority**: Must

### 7. Booking Flow
**Description**: Multi-step booking for service, staff, date, time, payment.
**Acceptance Criteria**:
- Select service -> staff (optional) -> date -> available slot -> confirm.
- Show price and duration.
- Apply promo code if any.
- Require auth to confirm.
- Confirmation screen and notification.
**Priority**: Must

### 8. Appointment Management
**Description**: Customer can view upcoming/past appointments.
**Acceptance Criteria**:
- List with status (confirmed, completed, cancelled).
- Reschedule or cancel per policy.
- Add to calendar option.
- Provider can accept/decline if manual confirmation.
**Priority**: Must

### 9. Favorites
**Description**: Save businesses for quick access.
**Acceptance Criteria**:
- Heart icon on business card/detail.
- Favorites list in profile.
- Sync across devices.
**Priority**: Should

### 10. User Profile
**Description**: Manage personal info, payment methods, notifications settings.
**Acceptance Criteria**:
- Edit name, phone, email.
- View booking history.
- Manage saved cards (tokenized).
- Consent toggles.
**Priority**: Must

### 11. Availability & Slot Computation
**Description**: Compute bookable slots from business hours, staff schedules, and existing appointments.
**Acceptance Criteria**:
- Respect business working hours and breaks.
- Subtract appointment durations and buffer.
- Handle multiple staff with individual calendars.
- Timezone aware.
- Return slots in 15/30 min increments.
**Priority**: Must

### 12. Shared Types & Design System
**Description**: Common UI components and TypeScript types.
**Acceptance Criteria**:
- Design tokens (colors, spacing, typography).
- Reusable components: Button, Card, Input, Modal.
- Shared API response types.
- Documented in Storybook.
**Priority**: Must

### 13. Reviews & Ratings
**Description**: Customers rate and review after completed appointment.
**Acceptance Criteria**:
- 1-5 star rating, text optional.
- Only verified appointments can review.
- Business can reply.
- Average rating displayed.
- Moderation by admin for abuse.
**Priority**: Should

### 14. Payment Integration
**Description**: Secure payments via Stripe/PayPal.
**Acceptance Criteria**:
- Save card via Stripe SetupIntent.
- Charge on booking or capture later per policy.
- Handle failures and retries.
- Issue refunds via admin/provider.
- PCI compliant (no raw card data).
**Priority**: Must

### 15. Notifications
**Description**: Push, email, SMS for booking events.
**Acceptance Criteria**:
- Booking confirmation, reminder 24h before, cancelled.
- Opt-in preferences.
- Use Firebase/APNs for push.
- Transactional email via SES.
**Priority**: Must

### 16. Provider / Business Owner Portal
**Description**: Web/mobile portal for businesses.
**Acceptance Criteria**:
- Onboard business profile, services, staff.
- Manage availability and exceptions (holidays).
- View appointments calendar.
- Respond to reviews.
- Payout dashboard.
**Priority**: Must

### 17. Admin Dashboard
**Description**: Super admin web app.
**Acceptance Criteria**:
- Manage users, businesses, categories.
- Suspend/activate accounts.
- View platform metrics (bookings, revenue).
- Handle disputes/refunds.
- Configure global settings.
**Priority**: Should

### 18. Background Jobs (BullMQ)
**Description**: Async processing for heavy tasks.
**Acceptance Criteria**:
- Queue for sending notifications.
- Queue for slot recomputation on changes.
- Retry with exponential backoff.
- Dead-letter queue for failures.
- Monitor via Redis insights.
**Priority**: Must

## Prioritization Summary
Must-have: Auth, Guest, Search, Detail, Categories, Booking, Appt Mgmt, Profile, Availability, Design System, Payment, Notifications, Provider Portal, Background Jobs.
Should-have: Map Search, Favorites, Reviews, Admin Dashboard.
Could-have: Social login, Advanced analytics.

## Success Metrics
- 30% MoM booking growth.
- <2% payment failure.
- 4.5+ app store rating.