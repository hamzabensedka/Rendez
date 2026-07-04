# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with beauty and wellness businesses. It enables users to discover services, book appointments, manage schedules, and pay seamlessly. Business owners manage their offerings, staff, and bookings via a dedicated portal. An admin dashboard provides oversight. The system uses background jobs for notifications and slot computation.

## 2. User Roles
- **Guest**: Unauthenticated user who can browse, search, and view business details but cannot book.
- **Customer**: Authenticated user with full booking, favorites, profile, and payment capabilities.
- **Provider (Business Owner)**: Manages business profile, services, staff, appointments, and reviews.
- **Admin**: Superuser with access to all data, analytics, and system configuration.

## 3. Features

### 3.1 User Authentication
**Description**: Secure sign-up, login, and session management for customers and providers. Supports email/password and social login (Google, Apple).

**Acceptance Criteria**:
- Customer can register with email, password, first name, last name.
- Provider registration requires business name, address, category, and owner details.
- Email verification required before first login.
- Social login (Google, Apple) creates account if not exists, links to existing if same email.
- Password reset via email link.
- JWT-based authentication with refresh tokens.
- Session persists across app restarts.
- Logout clears tokens and local data.

**Priority**: P0 (Must-have)

### 3.2 Guest Browse & Explore
**Description**: Unauthenticated users can explore businesses, services, and reviews without signing up. Booking prompts authentication.

**Acceptance Criteria**:
- Guest can view home feed with featured businesses and categories.
- Search and filter businesses by name, category, location.
- View business detail page including services, photos, reviews.
- Attempting to book, favorite, or write review triggers login/signup modal.
- No personalization (no favorites, no history).

**Priority**: P0

### 3.3 Business Search & Discovery
**Description**: Customers search for businesses by name, category, location, or service. Results include ratings, distance, availability.

**Acceptance Criteria**:
- Search bar with autocomplete (business names, categories).
- Filters: category, rating (4+), price range, open now, distance radius.
- Sort by: relevance, rating, distance, price low-to-high.
- Results show business card: photo, name, rating, category, distance, next available slot.
- Pagination (infinite scroll).
- Search history for logged-in users.

**Priority**: P0

### 3.4 Map-based Search
**Description**: Interactive map view showing nearby businesses with pins. Users can move map to update results.

**Acceptance Criteria**:
- Map displays business pins with category icons.
- Tap pin shows preview card with name, rating, distance.
- List view toggle switches between map and list.
- Map centers on user’s current location (with permission) or searched location.
- Clustering for dense areas.
- Re-search when map bounds change.

**Priority**: P1 (High)

### 3.5 Business Detail View
**Description**: Comprehensive page for a business: photos, description, services, staff, reviews, location, and booking CTA.

**Acceptance Criteria**:
- Image gallery with swipe.
- Business name, rating, review count, address, phone, website.
- Operating hours with “Open now” indicator.
- Service list with name, duration, price, and “Book” button.
- Staff section (if provider enabled) with photo, name, specialties.
- Reviews section with summary rating distribution and recent reviews.
- Map thumbnail linking to full map.
- Share button.
- Favorite toggle (for logged-in users).

**Priority**: P0

### 3.6 Service Categories
**Description**: Hierarchical categories (e.g., Hair > Haircut, Coloring) for browsing and filtering.

**Acceptance Criteria**:
- Home screen shows top-level categories as icons.
- Category page shows subcategories and popular businesses.
- Businesses can be tagged with multiple categories.
- Admin can manage category tree (add, edit, hide).
- Search filters by category.

**Priority**: P0

### 3.7 Booking Flow
**Description**: Step-by-step appointment booking: select service, staff (optional), date/time, add-ons, confirm, and pay.

**Acceptance Criteria**:
- Service selection: choose one or multiple services (combo).
- Staff selection: “Any available” or specific staff member.
- Date picker showing available days (blocked days greyed out).
- Time slots based on real-time availability (computed via slot engine).
- Add-ons (extra services) if configured.
- Summary screen: services, staff, date, time, total price, duration.
- Apply promo code (optional).
- Payment step: saved cards, new card, or pay at venue (if provider allows).
- Booking confirmation with success screen and option to add to calendar.
- Handle concurrent slot booking gracefully (optimistic lock).

**Priority**: P0

### 3.8 Appointment Management
**Description**: Customers view, reschedule, cancel upcoming appointments; view history.

**Acceptance Criteria**:
- Upcoming tab: list of confirmed appointments with status (confirmed, pending).
- Past tab: history with option to rebook.
- Reschedule: change date/time/staff (subject to availability and cancellation policy).
- Cancel: with reason, respecting provider’s cancellation window (e.g., 24h).
- Push notification reminders 24h and 1h before.
- Add to calendar (Google, Apple).
- Provider can also reschedule/cancel from their portal, triggering notification to customer.

**Priority**: P0

### 3.9 Favorites
**Description**: Customers save businesses to a favorites list for quick access.

**Acceptance Criteria**:
- Heart icon on business cards and detail page.
- Toggle add/remove with optimistic UI update.
- Favorites tab in profile showing saved businesses.
- Sort by recently added or name.
- Offline access to cached favorites list.
- Notification when favorited business has a promotion (future).

**Priority**: P1

### 3.10 User Profile
**Description**: Manage personal information, payment methods, notification preferences, and account settings.

**Acceptance Criteria**:
- Edit name, email, phone, profile photo.
- Change password.
- Manage saved payment methods (add, delete, set default).
- Notification preferences: push, email, SMS toggles.
- Language and theme settings.
- Delete account with confirmation and data wipe.
- View booking history and favorites from profile.

**Priority**: P0

### 3.11 Availability & Slot Computation
**Description**: Engine that calculates available time slots based on staff schedules, service duration, buffer times, existing bookings, and business hours.

**Acceptance Criteria**:
- Provider defines working hours per staff (recurring weekly, date overrides).
- Service duration + buffer (before/after) determines slot length.
- Slots generated in configurable intervals (e.g., 15 min).
- Exclude blocked time (breaks, holidays).
- Handle multiple staff: aggregate availability if “any staff” selected.
- Real-time recalculation on booking/cancellation.
- Background job (BullMQ) precomputes slots for next N days to speed up API.
- API returns available slots for a given date, service, staff.
- Edge cases: overlapping services, multi-service bookings (total duration).

**Priority**: P0

### 3.12 Shared Types & Design System
**Description**: Unified TypeScript types and UI components used across web and mobile apps.

**Acceptance Criteria**:
- Shared types package: User, Business, Service, Appointment, Review, etc.
- Design system with reusable components: Button, Card, Modal, Input, StarRating, etc.
- Consistent color palette, typography, spacing.
- Responsive and accessible (WCAG AA).
- Storybook documentation for components.

**Priority**: P0

### 3.13 Reviews & Ratings
**Description**: Customers rate and review businesses after a completed appointment. Businesses can respond.

**Acceptance Criteria**:
- After appointment completion, prompt to rate (1-5 stars) and write review.
- Review includes rating, text, optional photos.
- Reviews displayed on business detail with most recent first.
- Provider can reply to reviews publicly.
- Admin can moderate (hide/delete inappropriate reviews).
- Rating summary (average, distribution) updates in real-time.
- One review per appointment.

**Priority**: P1

### 3.14 Payment Integration
**Description**: Secure payment processing via Stripe. Supports card payments, saved cards, and pay-at-venue option.

**Acceptance Criteria**:
- Stripe Elements for card input (PCI compliant).
- Save card for future use (with consent).
- Charge customer at booking time (or hold and capture later per provider setting).
- Handle 3D Secure.
- Refund on cancellation according to provider policy.
- Provider receives payout to connected Stripe account (platform fee deducted).
- Transaction history for customer and provider.
- Admin can view all transactions.

**Priority**: P0

### 3.15 Notifications
**Description**: Push, email, and in-app notifications for booking confirmations, reminders, cancellations, promotions.

**Acceptance Criteria**:
- Booking confirmation (push + email).
- Reminder 24h and 1h before appointment (push).
- Reschedule/cancellation notifications to both parties.
- Review request after appointment.
- Promotional notifications (opt-in).
- In-app notification center with read/unread.
- Notification preferences respected.
- Background job (BullMQ) dispatches notifications.

**Priority**: P0

### 3.16 Provider / Business Owner Portal
**Description**: Web portal for providers to manage their business, services, staff, appointments, and reviews.

**Acceptance Criteria**:
- Dashboard with today’s appointments, revenue summary.
- Calendar view (day, week) with drag-and-drop reschedule.
- Manage services: add, edit, delete, set price, duration, buffer, category.
- Staff management: add staff, set working hours, assign services.
- Appointment management: confirm, cancel, no-show, add notes.
- Customer management: view customer history, notes.
- Review management: view and reply to reviews.
- Business profile editing: photos, description, hours, contact.
- Settings: cancellation policy, booking lead time, payment settings (pay now/later).
- Multi-location support (if applicable).

**Priority**: P0

### 3.17 Admin Dashboard
**Description**: Super admin panel for platform management, analytics, and moderation.

**Acceptance Criteria**:
- Dashboard with KPIs: total bookings, revenue, active users, new businesses.
- User management: list, search, suspend/delete customers and providers.
- Business management: approve new businesses, edit, suspend.
- Category management: CRUD categories and subcategories.
- Review moderation: flag, hide, delete reviews.
- Transaction log with filters.
- System configuration: platform fee percentage, cancellation windows, notification templates.
- Role-based access (admin, super admin).

**Priority**: P1

### 3.18 Background Jobs (BullMQ)
**Description**: Asynchronous job processing for non-blocking tasks: slot computation, notifications, payment settlements, data cleanup.

**Acceptance Criteria**:
- Slot precomputation job: runs daily or on schedule change, computes slots for next 30 days.
- Notification dispatch job: processes notification queue, sends via Firebase (push), SendGrid (email).
- Payment settlement job: captures authorized payments after service completion.
- Review reminder job: sends review request 2 hours after appointment end.
- Data cleanup: anonymize deleted accounts after 30 days.
- Job retry with exponential backoff, dead letter queue.
- Admin can monitor queue health via Bull Board.

**Priority**: P0

## 4. Non-Functional Requirements
- **Performance**: API response < 200ms for slot queries, < 500ms for search.
- **Scalability**: Support 100k concurrent users.
- **Security**: HTTPS, JWT, PCI DSS compliance for payments, input sanitization.
- **Reliability**: 99.9% uptime, graceful degradation.
- **Localization**: Support multiple languages (English, French initially).

## 5. Release Phases
- **MVP (P0)**: Auth, Guest Browse, Search, Business Detail, Categories, Booking Flow, Appointment Management, User Profile, Slot Computation, Payment, Notifications, Provider Portal, Background Jobs, Shared Types.
- **V1.1 (P1)**: Map Search, Favorites, Reviews & Ratings, Admin Dashboard.
- **V2**: Promotions, loyalty program, multi-language, advanced analytics.