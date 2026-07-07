# Planity Clone - Product Specification

## 1. Overview
Planity Clone is a mobile-first marketplace for beauty and wellness appointments. Customers discover businesses, view services, book slots, pay, and manage appointments. Providers manage their calendar and profile. Admins oversee platform.

## 2. Personas
- Customer: books appointments, browses guest, leaves reviews.
- Guest: browses without account.
- Business Owner: manages salon profile, services, availability.
- Admin: monitors platform, manages categories, resolves disputes.

## 3. Priorities (MoSCoW)
- Must: core MVP.
- Should: important post-MVP.
- Could: nice-to-have.

## 4. Feature Specifications

### 4.1 User Authentication
Priority: Must
Description: Secure signup/login via email, phone, social (Google/Apple). JWT-based sessions.
Acceptance Criteria:
- Given a new user, when they submit valid email and password, then account is created and verification email sent.
- Given a registered user, when they login with correct credentials, then they receive a JWT and are redirected to home.
- Passwords are hashed (bcrypt).
- Social login returns existing or new account.
- Logout invalidates token.

### 4.2 Guest Browse & Explore
Priority: Must
Description: Non-authenticated users can explore businesses, categories, and view details.
Acceptance Criteria:
- Guest can open app and see featured businesses and categories.
- Guest can search and view business detail but booking prompts login.
- No personal data stored for guest.

### 4.3 Business Search & Discovery
Priority: Must
Description: Text search, filter by category, price, rating, distance.
Acceptance Criteria:
- User can enter query and see matching businesses with pagination.
- Filters apply correctly and update results.
- Empty state shown when no results.
- Search results sorted by relevance and distance.

### 4.4 Map-based Search
Priority: Should
Description: Interactive map showing business pins; tap to view summary.
Acceptance Criteria:
- Map renders with pins for businesses in viewport.
- User can pan/zoom and results update via background job or API.
- Tap pin opens bottom sheet with business summary and link to detail.

### 4.5 Business Detail View
Priority: Must
Description: Show business info, services, staff, photos, reviews, availability.
Acceptance Criteria:
- Displays name, address, hours, contact, gallery.
- Lists services with prices and durations.
- Shows aggregate rating and recent reviews.
- Book button initiates booking flow.

### 4.6 Service Categories
Priority: Must
Description: Taxonomy of services (Hair, Nails, Spa, Barbering).
Acceptance Criteria:
- Categories seeded and manageable via admin.
- Each business assigns services to categories.
- Users can browse by category from home.

### 4.7 Booking Flow
Priority: Must
Description: Multi-step: select service, staff, date, slot, confirm, pay.
Acceptance Criteria:
- User selects service; system shows available slots from availability engine.
- User can pick staff or any.
- On confirm, a pending appointment created and payment triggered.
- On payment success, appointment confirmed and notifications sent.
- User can cancel within policy.

### 4.8 Appointment Management
Priority: Must
Description: List upcoming/past appointments, reschedule, cancel.
Acceptance Criteria:
- Customer sees upcoming and history.
- Reschedule opens slot picker with same business/service.
- Cancel respects cancellation window; triggers refund if applicable.
- Provider sees appointments in portal.

### 4.9 Favorites
Priority: Should
Description: Save businesses or services for quick access.
Acceptance Criteria:
- User can favorite/unfavorite from list or detail.
- Favorites appear in profile section.
- Synced across devices.

### 4.10 User Profile
Priority: Must
Description: Manage personal info, payment methods, notifications settings.
Acceptance Criteria:
- User can edit name, phone, avatar.
- User can add/remove cards (tokenized).
- User can toggle email/push notifications.

### 4.11 Availability & Slot Computation
Priority: Must
Description: Engine computing free slots based on business hours, service duration, staff shifts, existing bookings, breaks.
Acceptance Criteria:
- Given business open 9-17, service 60min, no bookings, then slots at 9,10,11,12,13,14,15,16.
- Overlapping appointments removed.
- Staff-specific availability respected.
- Buffer times applied.
- Computed via shared types and used by booking and map.

### 4.12 Shared Types & Design System
Priority: Must
Description: Monorepo shared TypeScript types, UI kit (buttons, cards, colors, spacing) for web/mobile.
Acceptance Criteria:
- @planity/shared package exports domain models (User, Business, Appointment, etc.).
- Design tokens documented and used consistently.
- Components meet accessibility (a11y) standards.

### 4.13 Reviews & Ratings
Priority: Should
Description: Customers rate 1-5 stars and write text after completed appointment.
Acceptance Criteria:
- Review allowed only for past appointments.
- Average rating computed and shown on detail.
- Business can respond to reviews.
- Inappropriate content flagged to admin.

### 4.14 Payment Integration
Priority: Must
Description: Stripe (or similar) for cards, PCI compliant, support refunds.
Acceptance Criteria:
- User adds card, charged on booking confirmation.
- Failed payment leaves appointment pending and notifies user.
- Refund issued on eligible cancellation.
- Provider payout handled via connected accounts.

### 4.15 Notifications
Priority: Must
Description: Email, SMS, push for booking confirm, reminder, cancel, promos.
Acceptance Criteria:
- On booking confirm, user gets push/email.
- Reminder sent 24h before via background job.
- User can opt-out per channel.
- Provider gets new booking alert.

### 4.16 Provider / Business Owner Portal
Priority: Must
Description: Web dashboard for businesses to manage profile, services, staff, availability, appointments, reviews.
Acceptance Criteria:
- Owner logs in to dedicated portal.
- Can create/edit services, set hours, assign staff.
- Can view calendar and manually book.
- Can reply to reviews and see stats.

### 4.17 Admin Dashboard
Priority: Should
Description: Super admin manages categories, users, businesses, disputes, content.
Acceptance Criteria:
- Admin can approve/reject business registrations.
- Can edit global categories and design settings.
- Can view platform metrics.
- Can suspend accounts.

### 4.18 Background Jobs (BullMQ)
Priority: Must
Description: Redis-backed queue for async tasks: notifications, slot pre-computation, reminders, analytics.
Acceptance Criteria:
- Job for sending reminders scheduled on booking.
- Failed jobs retried with exponential backoff.
- Queue dashboard for monitoring.
- Slot computation can be triggered by business update event.

## 5. Non-Functional Requirements
- Mobile responsive, iOS/Android via React Native or PWA.
- Performance: search results < 500ms.
- Security: GDPR compliant, data encrypted.
- Accessibility: WCAG 2.1 AA.

## 6. Milestones
- MVP (Must features) - 8 weeks.
- Phase 2 (Should) - 4 weeks.
- Phase 3 (Could) - as needed.