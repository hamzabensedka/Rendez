# Planity Clone Product Specification

## 1. Introduction and Product Vision
Planity Clone is a mobile-first appointment booking platform for salons, barbershops, and wellness businesses. It connects clients with service providers, enabling discovery, seamless booking, appointment management, and business administration. The product will launch as a cross-platform mobile application (iOS/Android) with a web-based provider portal and admin dashboard.

## 2. User Roles
- **Guest**: Unauthenticated user who can browse businesses, services, and reviews but cannot book.
- **Client**: Authenticated user who can book, manage appointments, leave reviews, and save favorites.
- **Business Owner (Provider)**: Manages business profile, services, staff, schedules, and appointments via a dedicated portal.
- **Admin**: Superuser with full platform oversight, moderation, and analytics.

## 3. Shared Types & Design System
All features adhere to a unified design system (colors, typography, spacing, components) and shared data models:
- **Business**: id, name, description, address, coordinates, photos, categories, rating, operating hours, contact info.
- **Service**: id, businessId, name, duration, price, description, category.
- **Staff**: id, businessId, name, photo, specialization.
- **Slot**: id, staffId, businessId, serviceId, startTime, endTime, status (available/booked).
- **Appointment**: id, clientId, businessId, staffId, serviceId, date, startTime, endTime, status (confirmed/pending/cancelled/completed), paymentStatus.
- **Review**: id, businessId, clientId, rating, text, createdAt.
- **User**: id, email, name, phone, avatar, role (client/provider/admin), preferences.

## 4. Feature Matrix & Priorities
| Feature | Priority | User Role |
|---|---|---|
| User Authentication | P0 | Guest → Client |
| Guest Browse & Explore | P0 | Guest/Client |
| Business Search & Discovery | P0 | Guest/Client |
| Map-based Search | P1 | Guest/Client |
| Business Detail View | P0 | Guest/Client |
| Service Categories | P0 | Guest/Client |
| Booking Flow | P0 | Client |
| Appointment Management | P0 | Client |
| Favorites | P1 | Client |
| User Profile | P1 | Client |
| Availability & Slot Computation | P0 | System |
| Reviews & Ratings | P1 | Client/Business |
| Payment Integration | P0 | Client/Provider |
| Notifications | P0 | All |
| Provider / Business Owner Portal | P0 | Business Owner |
| Admin Dashboard | P1 | Admin |
| Background Jobs (BullMQ) | P0 | System |

## 5. Feature Specifications

### 5.1 User Authentication
**Goal**: Allow users to create accounts, log in, and manage sessions securely.
- **Sign-up**: Email + password, Google, Apple. Email verification required.
- **Login**: Credentials or social. JWT token stored securely on device.
- **Password reset**: Link sent via email.
- **Session persistence**: Re-login silently unless token expired.

**Acceptance Criteria**:
- Given a new user, when they fill in email and password and tap sign up, then an account is created and a verification email is sent.
- Given an unverified user, when they attempt to log in, then they are prompted to verify email.
- Given a registered user, when they log in with correct credentials, then a JWT is issued and they are redirected to home screen.
- Given a logged-in user, when their token expires, then they are prompted to re-authenticate on next API call.
- Given a user, when they tap “Forgot password”, then an email with reset link is sent and they can set a new password.

### 5.2 Guest Browse & Explore
**Goal**: Provide full discovery capabilities without registration.
- Guests can view business listing, search, filter, see details, and read reviews.
- Any booking action triggers a sign-up/sign-in prompt before confirmation.

**Acceptance Criteria**:
- Given a guest, when they open the app, then they see a curated list of nearby businesses.
- Given a guest viewing a business detail, when they tap “Book”, then they are presented with a login/sign-up screen before proceeding.

### 5.3 Business Search & Discovery
**Goal**: Enable clients to find businesses by name, service, or location with intelligent filtering and sorting.
- Search bar with autocomplete, debounced (300ms).
- Filters: category, rating, price range, distance, availability.
- Sort: relevance, rating, distance, price.
- Empty state with suggestions.

**Acceptance Criteria**:
- Given a user types “hair”, when the query is sent, then businesses with matching name or service appear within 500ms.
- Given a user applies category filter “Barber”, then only businesses under that category are displayed.
- Given no results, when the search returns empty, then a friendly “No businesses found” message with suggested categories is shown.
- Given a user taps a search result, when they navigate, then recent searches are saved for later use.

### 5.4 Map-based Search
**Goal**: Visualize business locations on a map with interactive markers.
- Map view integrated with list view toggle.
- Markers cluster at high zoom levels.
- Tap marker opens business preview card.
- Location permission request, default to device location.

**Acceptance Criteria**:
- Given map view, when the user pans/zooms, then markers update with businesses visible in the viewport.
- Given a cluster marker, when tapped, then it expands to show individual businesses.
- Given map view, when the user taps a marker, then a business preview card slides up with name, rating, and distance.
- Given a user who denied location permission, then the map defaults to a popular city center.

### 5.5 Business Detail View
**Goal**: Present all relevant information about a business, encouraging bookings.
- Header with image gallery, name, rating, address.
- Tabs/sections: About, Services (with staff), Reviews, Map.
- Floating action button to start booking flow.
- Favorite toggle.
- Staff cards with photo, specialization, next available slot (teaser).

**Acceptance Criteria**:
- Given a business detail page, when data is fetched, then all sections load with smooth scrolling.
- Given a logged-in user, when they tap the heart icon, then the business is saved to favorites and the icon fills.
- Given a user, when they tap “Book” (floating button), then the booking flow starts with service selection.
- Given a staff teaser showing “Next available today at 3pm”, when tapped, then the booking jumps to slot selection for that staff.

### 5.6 Service Categories
**Goal**: Allow browsing by category to inspire users.
- Home page grid of popular categories (icon + label).
- “See All” leads to full category list, possibly subcategories.
- Tapping a category opens filtered business list.

**Acceptance Criteria**:
- Given the home screen, when a user taps “Haircut” category, then they are taken to a list of businesses offering haircut services.
- Given the category screen, when a user taps a subcategory (e.g., “Men’s Haircut”), then filters apply accordingly.
- Given no businesses in a category, then an empty state with “Coming soon” is shown.

### 5.7 Booking Flow
**Goal**: Multi-step guided booking with minimal friction.
- Step 1: Service selection (list with duration, price).
- Step 2: Staff selection (optional, any available).
- Step 3: Date & time slot picker, showing real-time availability.
- Step 4: Confirmation screen displaying details, price, client info (if logged in).
- Step 5 (payment): If payment required, integrate Stripe/PayPal to collect deposit/full amount.
- Final: Success screen with appointment summary and option to add to calendar.
- Guest flow: after step 3, prompt to log in/sign up; return to confirmation after auth.
- Prevent double-booking: atomic slot reservation with temporary hold (e.g., 10-min expiry).

**Acceptance Criteria**:
- Given an authenticated client, when they select a service and staff, then available time slots are displayed based on computation.
- Given a client selects a slot, when they proceed, then the slot is temporarily reserved and a confirmation screen appears.
- Given a guest, when they reach the confirmation step, then they are redirected to login/sign-up; after authentication, they return to the booking.
- Given a slot that expires before confirmation, when the client tries to confirm, then an error is shown and they must pick a new slot.
- Given a successful payment, when the confirmation step completes, then an appointment is created, slot is marked booked, and a confirmation notification is sent.

### 5.8 Appointment Management
**Goal**: Allow clients to view, manage, and reschedule their appointments.
- List with tabs: Upcoming / Past.
- Each item shows business, service, staff, date, time, status.
- Actions: Cancel (with policy, e.g., 24h notice), Reschedule (triggers slot picker), View details.
- Push notification reminders (24h, 1h before).
- Cancel releases the slot and may trigger refund if payment was made.

**Acceptance Criteria**:
- Given the appointments screen, when a user selects “Upcoming”, then all future appointments sorted by closest date are shown.
- Given an upcoming appointment, when the user taps “Cancel”, then a confirmation dialog appears, and upon confirm, the appointment status changes to cancelled, slot is freed, and a cancellation notification is sent to the provider.
- Given a cancellation within 24h of the appointment, when the policy forbids free cancellation, then the user is notified of any charges.
- Given a reschedule action, when the user selects a new slot, then the old slot is released and the new one is booked, preserving payment info.

### 5.9 Favorites
**Goal**: Let clients save businesses for quick access.
- Toggle heart icon on business card/detail.
- Dedicated Favorites list accessible from profile or home.
- Sync across devices via backend.

**Acceptance Criteria**:
- Given a logged-in user on business detail, when they tap heart, then the business is added to favorites and the heart icon displays active state.
- Given a user with saved favorites, when they view the favorites screen, then all favorited businesses are listed with current rating and availability teaser.
- Given a user un-favorites a business, when they tap the heart again, then it is removed immediately.

### 5.10 User Profile
**Goal**: Manage personal information and preferences.
- Edit: name, email, phone, avatar.
- Notification preferences: email/push toggles for appointments, promotions.
- Linked accounts and password change.
- Link to Payment methods (saved cards).

**Acceptance Criteria**:
- Given a user edits their name and taps save, then the name updates across the app and future appointment details.
- Given a user toggles promotional notifications off, then they no longer receive marketing pushes.
- Given a user uploads a new avatar, when save is tapped, then the image is stored and displayed.

### 5.11 Availability & Slot Computation
**Goal**: Real-time generation of bookable time slots based on business rules.
- Algorithm considers: business operating hours, staff working hours, service duration, existing appointments, buffer time, staff breaks.
- Slots are generated in configurable intervals (e.g., 15 min) for each staff-service combination.
- Caching layers with invalidation on booking/cancellation.
- Background job (BullMQ) recalculates availability daily for upcoming period and after schedule changes.

**Acceptance Criteria**:
- Given a staff works 9-17 with 1h lunch, when a client looks for 1h service, then slots like 9:00, 9:15, ... , 15:45 are generated, excluding lunch.
- Given a new appointment is booked, when the transaction commits, then the same slot is immediately removed from availability cache.
- Given a cancellation, when processed, then the slot is added back to availability.
- Given a provider updates operating hours, when saved, then a background job recomputes slots for the next 30 days within 2 minutes.

### 5.12 Reviews & Ratings
**Goal**: Collect and display client feedback to build trust.
- Only clients who completed an appointment can leave a review within 14 days.
- Rating 1-5 stars, optional text.
- Edit or delete within 48 hours.
- Display on business detail: aggregated average rating and recent reviews with pagination.
- Provider cannot delete reviews, but can report.

**Acceptance Criteria**:
- Given a completed appointment, when the review prompt appears on the app, then the client can submit a rating and optional comment.
- Given a submitted review, when viewed on the business detail, then the average rating updates dynamically.
- Given a malicious review, when a provider reports it, then an admin can moderate.

### 5.13 Payment Integration
**Goal**: Secure handling of payments for services.
- Integration with Stripe (card, wallet) and optionally PayPal.
- Support for deposit (fixed amount or percentage) or full payment.
- Payment intent created during booking flow, capture on confirmation.
- Refund flow on cancellation according to policy.
- PCI compliance via tokenization; no raw card data stored.

**Acceptance Criteria**:
- Given a booking requiring payment, when the client reaches the payment step, then they can enter card details and complete payment.
- Given a successful payment, when the booking is confirmed, then the payment is captured and a receipt is emailed.
- Given a cancellation eligible for refund, when the appointment is cancelled, then the refund is processed via Stripe within 5 business days, and the user sees a refund notification.
- Given a payment failure, when the attempt fails, then the user sees a clear error and can retry.

### 5.14 Notifications
**Goal**: Keep users informed via push and in-app notifications.
- Types: booking confirmation, reminders (24h, 1h), cancellation, payment receipt, promotional, review request.
- In-app notification center with read/unread.
- Preference management in profile.
- Deep linking: tapping a notification opens relevant screen (e.g., appointment detail).

**Acceptance Criteria**:
- Given a successful booking, when the confirmation is saved, then a push notification is sent to the client and the provider.
- Given a reminder job runs, when it’s 24h before an appointment, then a push “Your appointment tomorrow at 10am with Barberia” is delivered.
- Given a user opens a notification, when they tap it, then the app navigates to the corresponding appointment detail.

### 5.15 Provider / Business Owner Portal
**Goal**: Empower business owners to manage their business online.
- Web-based dashboard (responsive mobile support).
- Manage business profile: name, address, hours, photos, description.
- Service management: create, edit, delete services with price and duration.
- Staff management: add staff members, assign services, set working hours and breaks.
- Calendar view: daily/weekly schedule with drag-and-drop for appointments, block time.
- Appointment management: view upcoming, confirm, cancel, mark no-show, see client details.
- Reviews: view and report reviews.
- Availability overrides: custom dates/hours (holidays, special events).
- Real-time updates for slot computation.

**Acceptance Criteria**:
- Given a provider logs into the portal, when they navigate to Calendar, then they see all appointments staff-wise.
- Given a provider wants to add a break, when they create a break for a staff, then slots covering that break are removed.
- Given a provider edits service duration, when saved, then availability for the next 7 days is recomputed.
- Given a provider blocks a date as holiday, when saved, then no slots are generated for that date.

### 5.16 Admin Dashboard
**Goal**: Superuser tools for platform management.
- User management: list clients, providers; suspend/verify accounts.
- Business management: approve new businesses, suspend, edit.
- Appointment overview: filter, cancel, refund.
- Review moderation: approve, reject, delete.
- Analytics: bookings, revenue, popular businesses, churn.
- System configuration: categories, global parameters (booking hold time, cancellation policy).

**Acceptance Criteria**:
- Given an admin, when they view the dashboard, then key metrics (total bookings, revenue today) are displayed.
- Given a reported review, when admin marks it as inappropriate, then the review is hidden.
- Given a new business registration, when admin approves, then the business appears in search.
- Given an admin sets a new cancellation policy (e.g., 24h free cancel), then future bookings adhere to the updated policy.

### 5.17 Background Jobs (BullMQ)
**Goal**: Asynchronous processing for non-realtime tasks using BullMQ with Redis.
- Jobs: appointment reminders, slot recomputation (daily and on schedule changes), data cleanup, payment status sync, report generation, email sending.
- Queue monitoring via Bull Board.
- Retry with exponential backoff for transient failures.
- Concurrency controls to avoid race conditions on slots.

**Acceptance Criteria**:
- Given a reminder job is scheduled, when the time arrives, then it processes and sends push notifications with success.
- Given a slot recomputation job is enqueued after business hours update, when the job runs, then all affected slots for the next 30 days are regenerated correctly.
- Given a job fails due to temporary network issue, when it fails up to 3 times, then it is moved to dead-letter queue and alerted to admin.
- Given multiple simultaneous booking requests, when slot hold/commit is handled, then no double booking occurs due to atomic Redis transactions.

## 6. Non-Functional Requirements
- **Performance**: API responses < 300ms p95, slot computation under 2s for a day.
- **Security**: HTTPS, JWT with rotation, CORS, rate limiting, input validation.
- **Scalability**: Stateless services, Redis caching, horizontal scaling.
- **Localization**: Support for multiple languages and timezones.
- **Observability**: Logging, monitoring, alerts for failed jobs and errors.

## 7. Acceptance Criteria Format
All functional requirements are expressed as Given/When/Then scenarios to ensure clarity for development and QA.