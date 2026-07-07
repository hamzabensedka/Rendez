# Planity Clone - Product Specification

## 1. Overview
Planity Clone is a mobile-first marketplace for booking beauty and wellness appointments. It connects consumers with local businesses (salons, spas, barbers) and provides providers and admins with management tools. This document defines features, acceptance criteria, and priorities.

## 2. User Roles
- Guest: browses without account.
- Consumer: books and manages appointments.
- Business Owner: manages business profile, services, staff, bookings.
- Admin: oversees platform.

## 3. Feature Specifications

### 3.1 User Authentication
Description: Secure registration and login for consumers and owners.
Acceptance Criteria:
- User can sign up with email and password or OAuth (Google, Apple).
- Email verification required before first booking.
- Passwords are hashed; JWT with refresh token issued.
- Forgot password sends reset link; link expires in 1 hour.
- Logout invalidates tokens.
Priority: P0

### 3.2 Guest Browse & Explore
Description: Guests can explore homepage, featured businesses, and categories.
Acceptance Criteria:
- Landing page loads with curated lists.
- Guest can open business detail and view services but cannot book.
- Prompt to login appears when attempting booking.
- No personal data stored for guest.
Priority: P1

### 3.3 Business Search & Discovery
Description: Text search and filtered discovery of businesses.
Acceptance Criteria:
- Search by name, category, or service keyword.
- Filters: distance, rating, price range, available today.
- Results paginated; sorting by relevance, distance, rating.
- Empty state with suggestions.
Priority: P0

### 3.4 Map-based Search
Description: Geographic exploration via interactive map.
Acceptance Criteria:
- Map shows business markers within viewport.
- User can grant location; map centers on user.
- Adjustable radius slider triggers new search.
- Marker click shows mini profile with CTA.
Priority: P1

### 3.5 Business Detail View
Description: Comprehensive view of a business.
Acceptance Criteria:
- Displays cover photo, gallery, description, address, contact.
- Lists services with prices and durations.
- Shows staff members if applicable.
- Displays next available slot and reviews summary.
- Book button starts booking flow.
Priority: P0

### 3.6 Service Categories
Description: Taxonomy of beauty/wellness categories and services.
Acceptance Criteria:
- Seed categories (Hair, Nails, Spa, Barber, etc.) with icons.
- Sub-categories and individual services defined by providers.
- Consumers can browse by category from home.
- Admin can add/edit categories.
Priority: P0

### 3.7 Booking Flow
Description: Multi-step appointment booking.
Acceptance Criteria:
- Steps: select service -> choose staff (optional) -> pick date -> pick slot -> confirm details -> payment.
- Real-time slot availability from computation service.
- Prevent double booking with optimistic lock.
- Guest checkout allowed with email capture.
- Confirmation screen and email sent.
Priority: P0

### 3.8 Appointment Management
Description: Consumer view of upcoming and past appointments.
Acceptance Criteria:
- List grouped by upcoming/past.
- Cancel with policy check (free within X hours).
- Reschedule redirects to booking with preselected business.
- Status reflects provider actions.
Priority: P0

### 3.9 Favorites
Description: Save businesses or services for quick access.
Acceptance Criteria:
- Heart icon on business card and detail.
- Favorites list in profile.
- Removing updates instantly.
- Persists across sessions for logged-in users.
Priority: P2

### 3.10 User Profile
Description: Manage personal info and settings.
Acceptance Criteria:
- Edit name, phone, avatar.
- Manage saved payment methods (tokenized).
- Notification preferences (email/SMS/push).
- View booking history and reviews given.
Priority: P1

### 3.11 Availability & Slot Computation
Description: Core engine computing bookable slots.
Acceptance Criteria:
- Business sets weekly hours, breaks, holiday closures.
- Each service has duration and concurrent capacity.
- Staff schedules considered.
- System returns slots in business timezone, excluding booked.
- Handles daylight saving transitions.
- Exposes API used by booking and detail view.
Priority: P0

### 3.12 Shared Types & Design System
Description: Common contracts and UI kit.
Acceptance Criteria:
- TypeScript types for User, Business, Service, Appointment, etc. in shared package.
- Design system with colors, typography, buttons, cards, modals.
- Components usable in React Native and Web.
- Versioned and documented in Storybook.
Priority: P1

### 3.13 Reviews & Ratings
Description: Post-appointment feedback.
Acceptance Criteria:
- Consumer can rate 1-5 stars and write text after completed visit.
- Only verified appointments allow review.
- Average rating shown on business detail.
- Business can reply; admin can moderate inappropriate content.
Priority: P1

### 3.14 Payment Integration
Description: Secure payment processing.
Acceptance Criteria:
- Integrate Stripe (cards) and optionally PayPal.
- Charge full or deposit as defined by business.
- Booking confirmed only after successful payment.
- Handle declines with clear error and retry.
- Refunds processed via admin/provider action.
- Receipt emailed and stored in profile.
Priority: P0

### 3.15 Notifications
Description: Multi-channel user communications.
Acceptance Criteria:
- Email and SMS (and push for app) on booking confirm, reminder (24h/2h), cancellation, review request.
- Respect user preferences and quiet hours.
- Unsubscribe link in emails.
- Provider gets new booking alert.
Priority: P1

### 3.16 Provider / Business Owner Portal
Description: Web portal for businesses.
Acceptance Criteria:
- Onboard business: profile, location, categories, services.
- Manage staff accounts and their schedules.
- View calendar of appointments with status.
- Manually block slots or mark no-show.
- Access basic analytics (bookings, revenue).
- Respond to reviews.
Priority: P0

### 3.17 Admin Dashboard
Description: Platform oversight.
Acceptance Criteria:
- Admin login with role-based access.
- Manage users (suspend/activate), businesses (verify/flag).
- Maintain category taxonomy and system settings.
- View global metrics: MAU, GMV, booking counts.
- Moderate reviews and handle disputes.
Priority: P1

### 3.18 Background Jobs (BullMQ)
Description: Asynchronous processing.
Acceptance Criteria:
- Queue for sending notifications/reminders.
- Queue for expiring unpaid bookings (release slots).
- Queue for daily analytics aggregation.
- Jobs have retries with backoff; failures logged to monitoring.
- BullMQ dashboard for admins to inspect queues.
Priority: P1

## 4. Prioritization Summary
- P0 (MVP): Auth, Search, Detail, Categories, Booking, Appointment, Availability, Payment, Provider Portal.
- P1: Guest browse, Map, Profile, Shared types, Reviews, Notifications, Admin, Background jobs.
- P2: Favorites.

## 5. Non-Functional Requirements
- Mobile-first responsive design.
- API response < 300ms p95.
- GDPR compliance for user data.
- Accessibility (WCAG 2.1 AA).
- Logging and error tracking.