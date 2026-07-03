# Planity Clone Product Specification

## Overview
Planity Clone is a mobile-first appointment scheduling platform connecting customers with beauty and wellness service providers. It enables customers to discover, book, and manage appointments, while providers can manage schedules, services, and clients. The platform includes admin oversight and supports background job processing for notifications and maintenance.

## User Personas
- **End Customer**: Books appointments, manages profile, leaves reviews.
- **Guest User**: Browses services and businesses without login, converts to customer by booking.
- **Service Provider / Business Owner**: Manages business profile, services, staff, availability, and appointments.
- **Admin**: Oversees platform health, moderates businesses and reviews, resolves disputes.

## Feature Prioritization
P0 = Must-have, P1 = Should-have, P2 = Nice-to-have

| Feature | Priority |
|--------|----------|
| User Authentication | P0 |
| Guest Browse & Explore | P0 |
| Business Search & Discovery | P0 |
| Map-based Search | P1 |
| Business Detail View | P0 |
| Service Categories | P0 |
| Booking Flow | P0 |
| Appointment Management | P0 |
| Favorites | P1 |
| User Profile | P0 |
| Availability & Slot Computation | P0 |
| Shared Types & Design System | P0 |
| Reviews & Ratings | P1 |
| Payment Integration | P0 |
| Notifications | P0 |
| Provider / Business Owner Portal | P0 |
| Admin Dashboard | P0 |
| Background Jobs (BullMQ) | P0 |

---

## 1. User Authentication (P0)
- Registration via email/password, phone, or social logins (Google, Apple).
- Login with credentials, JWT-based session management.
- Password reset flow via email.
- Role-based access (customer, provider, admin) with tenant context for providers.

### Acceptance Criteria
1. User can create account with email and password, phone number, or social login; receive confirmation email.
2. Login returns JWT; token refresh mechanism works seamlessly.
3. Forgot password sends reset email with time-limited link; password can be reset successfully.
4. Roles are assigned correctly; provider registration triggers onboarding flow.
5. All endpoints enforce authentication and role-based authorization.

## 2. Guest Browse & Explore (P0)
- Unauthenticated users can browse businesses, services, categories, and see details up to the booking step.
- Prompts login/registration only when attempting to book or write a review.

### Acceptance Criteria
1. Landing page shows featured businesses and categories without login.
2. Search and filter results are accessible.
3. Business detail page visible; service list and slot preview load, but selecting a slot triggers login prompt.
4. No sensitive data exposed until authenticated.

## 3. Business Search & Discovery (P0)
- Full-text search on business names, services, descriptions.
- Filters: location (city, distance), category, rating, price range, availability date/time.
- Sort: relevance, rating, distance, popularity.
- Paginated results with infinite scroll.

### Acceptance Criteria
1. Search bar with autocomplete suggestions.
2. Filters applied via side sheet or modal; results update instantly.
3. Sorting changes order; pagination loads next page.
4. Empty state with friendly message when no results.
5. Search respects location permissions (if granted) for distance-based sorting.

## 4. Map-based Search (P1)
- Interactive map view showing business markers.
- Cluster markers for density; tap to expand.
- List view toggle with map.
- Tap marker shows business card with name, rating, distance.

### Acceptance Criteria
1. Map loads with current location centering (if permitted).
2. Markers cluster correctly; zooming in reveals individual markers.
3. Tapping a marker opens a bottom sheet with business summary; tapping it navigates to detail.
4. Seamless toggle between list and map views preserving filters.

## 5. Business Detail View (P0)
- Photo gallery, description, location, contact info, rating, review count.
- List of services with durations and prices.
- “Favorite” action.
- Availability preview: select service and see next available slots for a day.
- Prominent “Book” button.

### Acceptance Criteria
1. All business information rendered correctly from API.
2. Service list shows names, durations, prices; expandable if many.
3. Tapping a service opens slot picker with date and time; displays real-time availability.
4. Favorite toggle updates state and persists on reload.
5. Opening hours shown; closed days visually indicated.

## 6. Service Categories (P0)
- Hierarchical categories, e.g., Hair > Haircut, Massage > Swedish.
- Category pages with top businesses and services.
- Icons and images for categories.

### Acceptance Criteria
1. Homepage displays top-level categories in a grid.
2. Tapping a category navigates to subcategories or a list of relevant businesses.
3. Breadcrumb navigation for deep categories.
4. Category pages support filters (location, rating).
5. Admin can manage categories via dashboard.

## 7. Booking Flow (P0)
- Select business, service, staff (if applicable), date, time slot.
- Optional add-ons or extra services.
- Review summary (service, date, time, price).
- Apply promo code.
- Payment initiation (see Payment Integration).
- Confirmation screen with appointment details.

### Acceptance Criteria
1. Step-by-step flow: service selection > date/time > staff (optional) > extras > review > pay.
2. Real-time slot availability fetched; if slot becomes unavailable during booking, user informed and prompted to reselect.
3. Promo code field validates and applies discount; invalid code shows error.
4. Successful payment redirects to confirmation; confirmation email/SMS sent.
5. Booking requires authentication; guest prompted at start of flow.
6. Edge cases: all slots taken, network failure, payment decline handled gracefully.

## 8. Appointment Management (P0)
Customer:
- Upcoming, past, cancelled appointments lists.
- Reschedule or cancel (with policy rules).
- Add to calendar.
- View provider details and directions.

Provider:
- See all appointments for their business, filtered by date/staff.
- Confirm, modify, or cancel appointments with reason.
- Block time manually.

### Acceptance Criteria
1. Customer sees segmented tabs (Upcoming/Past/Cancelled).
2. Reschedule: select new slot from available slots; old slot released immediately.
3. Cancellation respects cancellation window (e.g., 24h), shows refund policy.
4. Provider dashboard reflects real-time changes; cancellation triggers notification to customer.
5. Calendar integration button (iCal/Google) generates downloadable file.

## 9. Favorites (P1)
- Save businesses to a favorites list.
- Access from profile or home screen.
- Remove from list.
- Sync across devices for logged-in users.

### Acceptance Criteria
1. Heart icon on business cards and detail page toggles favorites.
2. Favorites list accessible from user menu; empty state with call-to-action.
3. Removing from list updates UI immediately.
4. Data persists across sessions for same account.

## 10. User Profile (P0)
- Edit personal info (name, email, phone, avatar).
- Manage notification preferences (push, email, SMS).
- View booking history.
- Payment methods management (see Payment Integration).
- Delete account (with data retention policy).

### Acceptance Criteria
1. Profile fields editable; validation on save.
2. Booking history paginated; each item links to appointment detail.
3. Notification toggles update backend and reflect changes immediately.
4. Add/remove payment methods using secure tokenization; default payment method selectable.
5. Account deletion requests confirmation, then deactivates; future access blocked, data anonymized.

## 11. Availability & Slot Computation (P0)
- Providers define working hours per staff member, including breaks.
- Service duration plus buffer time determines slots.
- Slot generation considers existing bookings and blocked time.
- Recurring availability templates.
- Timezone-aware.

### Acceptance Criteria
1. Provider sets weekly schedule for each staff; supports multiple shifts per day.
2. System computes available slots for a service based on staff availability and existing appointments, respecting buffer.
3. Slots displayed in customer's local time.
4. Slot recomputation triggered on booking, cancellation, or schedule change.
5. Overlapping appointments prevented; double booking impossible.
6. Performance: slot query under 1 second for typical load.

## 12. Shared Types & Design System (P0)
- TypeScript interfaces shared across frontend and backend (e.g., User, Business, Service, Appointment, Slot).
- Design system components: buttons, inputs, cards, modals, toast, tabs, etc.
- Consistent theming (colors, typography, spacing).

### Acceptance Criteria
1. Shared types package used by both frontend and API; no duplication.
2. Component library documented with Storybook or similar.
3. Dark mode support using design tokens.
4. All UI conforms to Figma specs; responsive for mobile and tablet.

## 13. Reviews & Ratings (P1)
- Customers can leave rating (1-5) and written review after completed appointment.
- View reviews on business detail page, sorted by recent/helpful.
- Provider can respond to reviews.
- Moderation flagging for inappropriate content.

### Acceptance Criteria
1. Post-appointment prompt to rate and review.
2. Rating input as stars; review text optional.
3. Reviews display reviewer name (or “Anonymous”), date, rating, text, and provider response.
4. Provider reply appears below the review.
5. Admin moderation: flagged reviews hidden until reviewed.
6. One review per customer per appointment.

## 14. Payment Integration (P0)
- Support credit/debit cards and digital wallets (Apple Pay, Google Pay).
- Secure tokenization via Stripe (or similar PCI-compliant gateway).
- Pre-authorization at booking; capture after service completion.
- Refunds for cancellations (full/partial per policy).
- Payment method management in profile.

### Acceptance Criteria
1. Checkout flow collects payment details via Stripe Elements or similar; no raw card data touches server.
2. Pre-auth hold placed; capture triggered by provider or auto-capture after a delay.
3. Cancellation before service: refund issued automatically if within policy; manual refund option for provider.
4. Payment history with status (pending, captured, refunded).
5. Support for multiple currencies based on business location (P2).

## 15. Notifications (P0)
- Push notifications (mobile) and in-app notifications.
- Email and SMS for transactional (booking confirmations, reminders, updates).
- Notification preferences respected.
- Provider notifications: new booking, cancellation, reschedule requests.

### Acceptance Criteria
1. Customer receives booking confirmation immediately after successful payment.
2. Reminder push/email 24h and 1h before appointment.
3. Cancellation notification to both parties.
4. Notifications respect user preferences; opt-out via profile.
5. In-app notification center with read/unread status and badge count.
6. Low latency: notifications sent within 2 minutes of event, using BullMQ.

## 16. Provider / Business Owner Portal (P0)
- Onboarding: register business, add services, staff, working hours.
- Dashboard: upcoming appointments, daily summary, revenue metrics.
- Manage services (CRUD), staff, schedules.
- Appointment management: confirm, reschedule, cancel with notes.
- Set business details, photos, policies.
- Access to reviews and ability to respond.

### Acceptance Criteria
1. Business registration flow with validation; business hidden until admin approval (optional P2).
2. Service and staff management with drag-and-drop ordering (P2).
3. Calendar view with daily, weekly, staff filters; drag to reschedule (P1).
4. Quick actions: block time, add personal note to appointment.
5. Revenue dashboard with filtering by period (today, week, month).
6. All changes reflect in customer-facing side within seconds.

## 17. Admin Dashboard (P0)
- Overview of platform metrics: total users, providers, bookings, revenue.
- Manage businesses: approve, suspend, edit details.
- Manage users: view, disable, support.
- Review moderation queue.
- Resolve disputes and manual refunds.
- Configuration: global cancellation policies, commission rates (P1).

### Acceptance Criteria
1. Dashboard loads with key metrics cards and recent activity feed.
2. Business list with filters (status, category) and actions to approve/suspend.
3. User search by email/name; ability to disable accounts.
4. Review moderation: list flagged reviews, option to approve or delete.
5. Refund management: view payment disputes, initiate manual refund.
6. Role-based access: only admin role can access; audit log of sensitive actions (P2).

## 18. Background Jobs (BullMQ) (P0)
- Asynchronous processing for: notification dispatch (push, email, SMS), reminder scheduling, slot recomputation, data cleanup, report generation.
- Retry and failure handling with dead letter queue.
- Job monitoring via admin dashboard or Bull Board.

### Acceptance Criteria
1. Notification jobs enqueued on booking events; processed with retries (3x) before dead letter.
2. Reminder schedule jobs: on booking create, schedule reminders at 24h and 1h before; if booking rescheduled, old reminders cancelled, new ones set.
3. Slot recomputation triggered as low-priority job after bulk schedule changes to avoid blocking.
4. Admin can view queue lengths, failed jobs, and retry or delete via Bull Board integrated in admin panel.
5. Jobs handle concurrency; no duplicate notifications.

---

## Non-Functional Requirements
- Performance: API response times < 200ms for 95th percentile; slot search < 1s.
- Scalability: support up to 100k concurrent users with horizontal scaling.
- Security: HTTPS, OWASP top 10 protections, PCI-DSS compliance via payment tokenization, data encryption at rest.
- Accessibility: WCAG 2.1 AA compliance for customer and provider interfaces.
- Localization: i18n for UI and date/time formats; currency localization (P2).

## Implementation Notes
- Backend: Node.js/TypeScript, REST or GraphQL, PostgreSQL, Redis for BullMQ and caching.
- Frontend: React Native for mobile, Next.js for web admin/portal.
- Real-time: WebSockets or Server-Sent Events for provider dashboard updates and slot availability changes.
- File storage: S3-compatible for business photos and user avatars.

---

## Acceptance Criteria Summary
All features must pass defined acceptance criteria, integrate seamlessly, and deliver a responsive, secure, and intuitive experience across all personas.