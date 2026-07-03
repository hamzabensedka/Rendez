# Planity Clone Product Specification

## 1. Introduction
This document outlines the complete feature set, acceptance criteria, and priorities for Planity Clone – a mobile-first beauty & wellness booking platform. The goal is to enable seamless discovery, booking, and management of appointments for end users, while providing business owners and admins with powerful tools.

**Target Users:** End customers, business owners/providers, platform administrators.
**Platforms:** iOS, Android (React Native), web admin dashboard.

---

## 2. Shared Types & Design System
**Description:** Define all core TypeScript types, UI tokens, and reusable components to ensure consistency across the app. Types cover users, businesses, services, appointments, reviews, and payments.

**Acceptance Criteria:**
- Types are defined in a single shared package (e.g., `@planity/types`) used by all frontend and backend modules.
- Design tokens (colors, spacing, typography) are centralized and consumed by a component library.
- Reusable components (buttons, cards, inputs, modals) adhere to the design system.
- Every feature implementation references these types without duplication.

**Priority:** P0 (foundational)

---

## 3. User Authentication
**Description:** Allow users to create accounts, log in securely, and manage sessions. Support email/password, social logins, and password recovery. JWT-based authentication with refresh tokens.

**User Story:** As a new user, I want to sign up quickly so I can book services. As a returning user, I want to log in securely and maintain my session.

**Acceptance Criteria:**
- User can sign up with email + password; receives verification email.
- User can log in with verified credentials; receives access + refresh tokens.
- Social login (Google, Apple) works and links to an account.
- “Forgot password” flow sends reset link and allows password update.
- Session persists via secure storage; token refresh is automatic.
- Logout invalidates tokens.
- Error messages are clear (invalid credentials, network issues).

**Priority:** P0

---

## 4. Guest Browse & Explore
**Description:** Unauthenticated users can browse businesses, view details, and explore services without creating an account. They are prompted to log in or sign up only when initiating a booking.

**Acceptance Criteria:**
- Guest can see home feed with featured businesses and categories.
- Guest can search by keyword, location, or category.
- Guest can view full business profile and service list.
- Tapping “Book” on a service triggers a login/signup modal.
- After authentication, the user is returned to the same booking flow.

**Priority:** P1

---

## 5. Business Search & Discovery
**Description:** Full-text and filtered search allowing users to find salons, spas, barbers, and other beauty businesses based on query, location, rating, price range, and availability.

**Acceptance Criteria:**
- Search bar supports free text (business name, service, keyword).
- Results include business name, rating, distance, main image, and next available slot.
- Filters: category, price range, rating, open now, distance radius.
- Sort options: relevance, rating, distance, price.
- Pagination with infinite scroll or “load more”.
- Results update dynamically when filters change.
- Empty state message if no results.

**Priority:** P1

---

## 6. Map-based Search
**Description:** Interactive map view showing business locations with pins. Users can explore by dragging the map and see summaries.

**Acceptance Criteria:**
- Map loaded with user’s current location (with permission).
- Business pins clustered at high density; tapping cluster zooms in.
- Tapping a pin shows a mini card with name, rating, and distance; tapping card navigates to full detail.
- Search bar works in map mode; moving the map updates results within the new bounds.
- Map shows the user’s location marker.

**Priority:** P1

---

## 7. Business Detail View
**Description:** Comprehensive profile page for a business, including description, photos, services, reviews, location, and booking CTA.

**Acceptance Criteria:**
- Hero image gallery with swipe.
- Business name, rating, review count, address, and distance.
- Tabs or sections: About, Services, Reviews, Photos.
- Services list with name, duration, price, and “Book” button.
- Reviews section with star distribution and latest reviews; tap to see all.
- Map snippet showing location with “Get directions” link.
- Share button to share business profile.
- Favorite/unfavorite toggle.
- Back navigation is intuitive.

**Priority:** P1

---

## 8. Service Categories
**Description:** Browse and filter businesses by predefined service categories (Hair, Nails, Massage, Facial, Barber, etc.) with subcategories.

**Acceptance Criteria:**
- Home screen displays category icons in a horizontally scrollable list.
- Tapping a category navigates to a dedicated listing with relevant businesses.
- Category listing supports additional filters (subcategory, price, rating).
- At least 10 main categories defined by admin.
- Businesses can tag themselves with categories during onboarding.

**Priority:** P1

---

## 9. Booking Flow
**Description:** Step-by-step flow to book an appointment: select service, choose provider (optional), date/time slot, add extras, review, and confirm. Supports guest conversion.

**User Story:** As a customer, I want to book a haircut with my preferred stylist on a specific date and time, add a beard trim, and pay securely.

**Acceptance Criteria:**
- Selectable service shows duration and base price.
- Provider/staff selection step shows available providers for that service (optional).
- Calendar date picker highlights dates with availability.
- Time slot list fetched from real-time availability; slots are 15‑min or service-duration-based.
- Extras/add-ons (if any) can be selected before finalizing.
- Order summary shows service, provider, date, time, price breakdown.
- Promo code field with validation.
- Confirm booking triggers payment (if required) and creates appointment.
- On success, a confirmation screen with appointment details and “Add to calendar” option.
- Entire flow is protected; guest redirected to login/signup after date selection.
- Back navigation preserves selected choices where possible.

**Priority:** P0

---

## 10. Appointment Management
**Description:** Users can view upcoming and past appointments, cancel, reschedule, and get details.

**Acceptance Criteria:**
- “My Appointments” list with tabs: Upcoming and Past.
- Each card shows business name, service, date/time, status.
- Tap appointment to see detail: full info, provider, location, price, cancellation/reschedule options.
- Cancellation: confirm dialog, policy text (e.g., free cancellation up to 24h), update status, optional refund.
- Rescheduling: re-enter booking flow with pre-selected service and business, choose new date/time.
- Past appointments display review prompt (until reviewed).
- Status updates in real-time (via push notification or polling).

**Priority:** P1

---

## 11. Favorites
**Description:** Users can mark businesses as favorites for quick access.

**Acceptance Criteria:**
- Heart icon on business cards and detail page toggles favorite.
- “Favorites” list accessible from profile/drawer.
- List persists across sessions; synced to user account.
- Tapping a favorite navigates to business detail.
- Empty state with prompt to explore businesses.

**Priority:** P2

---

## 12. User Profile
**Description:** Manage personal information, notification preferences, payment methods, and settings.

**Acceptance Criteria:**
- Display name, email, phone, profile photo (editable).
- Saved addresses for quick location selection.
- Payment methods management: add/delete credit cards (tokenized via Stripe).
- Notification preferences: push, email, SMS toggles with categories (reminders, promotions).
- Link/unlink social accounts.
- Account deletion option with confirmation.

**Priority:** P2

---

## 13. Availability & Slot Computation
**Description:** Core algorithm that computes bookable time slots based on provider working hours, service duration, existing appointments, breaks, buffers, and blackout dates. Must be performant and accurate.

**Acceptance Criteria:**
- Providers define weekly schedule (e.g., Mon–Fri 9am–6pm) with break intervals.
- Services have fixed durations; optional buffer time (e.g., 5 min after service).
- Slots are generated respecting these constraints; overlap with existing appointments is excluded.
- Booked slots consider travel time if mobile provider.
- Slot calculation responds in < 200ms for typical daily load.
- Dates with no availability are greyed out in date picker.
- Real-time locking: a slot is temporarily held (e.g., 10 min) during checkout to prevent double booking.
- Admin/Provider can set special hours or block off days.

**Priority:** P0

---

## 14. Reviews & Ratings
**Description:** Allow customers to rate and review completed appointments. Aggregate ratings influence business ranking.

**Acceptance Criteria:**
- After appointment completion, user receives push/email to leave review.
- Review form: star rating (1–5), optional text, optional photo.
- Reviews are displayed on business detail page with newest first.
- Overall rating and star distribution widget updated in real-time.
- Business owner can respond to reviews (Provider Portal).
- Moderation flagging for inappropriate content.
- Users can edit/delete their own reviews.

**Priority:** P1

---

## 15. Payment Integration
**Description:** Secure payment processing via Stripe. Support card payments, prepayment, deposits, and refunds. Comply with PCI-DSS (via Stripe Elements).

**Acceptance Criteria:**
- Card collection using Stripe Elements (secured fields).
- Support for one-time payment and saved cards (with user consent).
- Booking: capture payment immediately or hold card (authorization) depending on business policy.
- Deposit: option for % or fixed amount.
- Refund on cancellation (according to cancellation policy) via admin or automatic job.
- Payment receipt emailed after successful transaction.
- Provider portal shows transaction history with fees.
- Webhook handling for payment status updates (idempotent).

**Priority:** P0

---

## 16. Notifications
**Description:** Real-time and scheduled notifications for booking confirmations, reminders, cancellations, promotions, and reviews. Multi-channel: push (FCM/APNs), email, SMS.

**Acceptance Criteria:**
- Transactional: Booking confirmed, reminder 24h and 1h before, cancellation, reschedule.
- Promotional: opt-in deals, new businesses nearby (if allowed).
- Review prompt 1 hour after appointment end.
- Admin can send bulk push notifications to users.
- Notification preferences honored; users can opt out per channel/category.
- In-app notification center with unread badge.
- Deep links from notifications open relevant screen (appointment detail, business, etc.).
- Background jobs (BullMQ) handle scheduling and batching.

**Priority:** P1

---

## 17. Provider / Business Owner Portal
**Description:** Mobile and web portal for business owners to manage their profile, services, staff, schedule, appointments, and clients.

**Acceptance Criteria:**
- Secure login for business owners (separate from end users).
- Business profile editing: name, description, photos, address, contact, categories.
- Service management: CRUD services with name, duration, price, description, category, buffer time.
- Staff management: add/remove providers with individual schedules.
- Appointment calendar: day/week/month view; see upcoming appointments; accept/reschedule/reject.
- Client list with appointment history.
- Real-time notifications for new bookings.
- Availability settings: regular hours, special dates, breaks, block-off days.
- Review monitoring and response.
- Simple analytics: bookings, revenue (basic).

**Priority:** P1

---

## 18. Admin Dashboard
**Description:** Web-based dashboard for platform administrators to manage businesses, users, content, disputes, and monitor platform health.

**Acceptance Criteria:**
- Overview metrics: active users, bookings, revenue, top businesses.
- Business management: approve/reject business registrations, suspend accounts.
- User management: view profiles, flag behavior, disable accounts.
- Category management: add/edit/delete categories and subcategories.
- Review moderation queue with ability to approve/delete.
- Promo code/campaign creation.
- Push notification composer for targeted segments.
- Financial reconciliation: view transactions, fees, payouts.
- Search and filter across all entities.
- Role-based access (superadmin, support agent).

**Priority:** P1

---

## 19. Background Jobs (BullMQ)
**Description:** Reliable job queue system using BullMQ (Redis) for asynchronous tasks: email/push dispatch, payment processing, appointment reminders, rating prompts, data cleanup, and scheduled reports.

**Acceptance Criteria:**
- Jobs are enqueued atomically with proper payload.
- Workers handle each job type with retries and exponential backoff.
- Failed jobs go to a dead-letter queue and are logged for monitoring.
- Concurrency configured per queue to avoid throttling (e.g., 10 email workers).
- Scheduled jobs (e.g., 24h reminder) use BullMQ’s delayed jobs with millisecond precision.
- Periodic jobs for aggregation or cleanup run on cron-like schedules.
- Admin dashboard shows queue statistics (waiting, active, failed).
- All business-critical notifications and payment tasks are processed asynchronously to ensure API responsiveness.

**Priority:** P1

---

**End of Specification**
