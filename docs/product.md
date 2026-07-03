# Product Specification: Planity Clone
## 1. Introduction
Planity Clone is a mobile-first booking platform connecting users with beauty and wellness businesses (salons, spas, barbers, nail studios). The product enables seamless discovery, appointment scheduling, and management for end-users while providing business owners with tools to manage their services, staff, and bookings. A super admin dashboard ensures platform governance. The system emphasizes real‑time availability computation, intuitive UX, and reliable background processing.

### 1.1 Product Goals
- Simplify appointment booking for personal care services.
- Increase business visibility and operational efficiency for providers.
- Deliver a scalable, high‑performance platform with modern mobile and web experiences.

### 1.2 User Personas
- **End‑User (Customer):** Searches for nearby salons, browses services, books, reschedules, leaves reviews.
- **Business Owner (Provider):** Manages business profile, services, staff schedules, accepts/rejects bookings, views analytics.
- **Super Admin:** Monitors platform health, manages all businesses, users, and content.

## 2. Overall Product Requirements
- Responsive mobile application (React Native) with a consistent design system.
- RESTful or GraphQL API backend with proper authentication and authorization.
- Real-time availability slot computation.
- Robust background job processing for notifications, reminders, and data maintenance.
- Shared design tokens and components to ensure visual and behavioral consistency across all surfaces.

## 3. Feature Specifications
Each feature includes acceptance criteria and a priority level: **P0 (Must‑have)**, **P1 (Should‑have)**, **P2 (Could‑have)**.

### 3.1 User Authentication – P0
**Goal:** Secure access for customers and providers.
- AC1: Users can sign up with email/password, Google, or Apple ID.
- AC2: Email verification is required for password reset and sensitive actions.
- AC3: Login returns a JWT token valid for 30 days; refresh token mechanism implemented.
- AC4: Password reset flow via email link works within 5 minutes.
- AC5: Session persisted across app restarts; logout clears tokens.
- AC6: Role‑based routes: customer vs. provider accessible dashboards.

### 3.2 Guest Browse & Explore – P0
**Goal:** Allow non‑authenticated users to explore content and understand value before sign‑up.
- AC1: Guest can search businesses, view categories, see business detail, read reviews.
- AC2: No booking‑related actions allowed (attempt triggers login/sign‑up modal).
- AC3: Map‑based search visible and interactive for guests.
- AC4: Favorites “heart” action prompts authentication.

### 3.3 Business Search & Discovery – P0
**Goal:** Fast, relevant results from text queries and filters.
- AC1: Search by business name, service name, city, or postal code.
- AC2: Results display business name, rating, distance, main photo, first available slot.
- AC3: Filters: category, price range, rating, availability today, open now.
- AC4: Empty state with helpful suggestions; loading skeletons.
- AC5: Error state with retry option on network failure.
- AC6: Pagination/infinite scroll with 20 items per page.

### 3.4 Map‑based Search – P0
**Goal:** Visual discovery based on location.
- AC1: Map renders with user’s current location (permission requested).
- AC2: Business pins appear on map within visible region; clustering for many pins.
- AC3: Tap a pin shows a mini card; tap card navigates to business detail.
- AC4: Search text entry reposition map to area and show results list synchronised.
- AC5: “Search this area” button when user moves map.

### 3.5 Business Detail View – P0
**Goal:** Provide all information needed for a booking decision.
- AC1: Photo gallery with swipe and full‑screen view.
- AC2: Business name, description, address (open in map), phone, website.
- AC3: Average rating, total review count, recent reviews preview.
- AC4: Services list with name, duration, price; grouped by category.
- AC5: Staff selection if enabled; shows staff photo and specialties.
- AC6: Inline availability summary (e.g., “Next available: today 14:00”).
- AC7: Favorite toggle (heart icon) reflective of state.

### 3.6 Service Categories – P0
**Goal:** Hierarchical browsing of service types.
- AC1: Top‑level categories: Hair, Nails, Face, Body, Massage, Barber, Make‑up, etc.
- AC2: Subcategories expandable (e.g., Hair → Cut, Color, Styling).
- AC3: Icons for each top‑level category; visual distinction.
- AC4: Selecting a category filters search results by businesses offering those services.
- AC5: Category screen accessible from home navigation.

### 3.7 Booking Flow – P0
**Goal:** Seamless multi‑step booking that adapts to business settings.
- AC1: Step 1 – Service selection (single or multiple with total duration & price).
- AC2: Step 2 – Staff selection (if multiple staff) or automatic assignment.
- AC3: Step 3 – Date/time picker showing only available slots (computed dynamically).
- AC4: Step 4 – Optional extras/add‑ons displayed.
- AC5: Step 5 – Review summary: service, staff, date, time, price, and any notes.
- AC6: Step 6 – Confirm: requires authentication; displays cancellation policy.
- AC7: Successful booking shows animated confirmation, adds to upcoming appointments, triggers push notification.
- AC8: Payment step if pre‑payment required (see Payment Integration).
- AC9: Guest booking: after confirmation, prompt to create account to manage appointments.

### 3.8 Appointment Management – P0
**Goal:** Users view, modify, or cancel their bookings.
- AC1: Upcoming tab: list sorted by date/time nearest first.
- AC2: Each card shows business name, service, staff, date, time, duration, status.
- AC3: Cancel action: confirmed with modal, reason optional; allowed up to X hours before (configurable per business).
- AC4: Reschedule action: opens slot picker for same service and staff (if possible).
- AC5: Past appointments list with ability to leave review.
- AC6: Add to calendar using device calendar API.
- AC7: Filter by status: confirmed, cancelled, completed.

### 3.9 Favorites – P0
**Goal:** Save preferred businesses for quick access.
- AC1: Heart icon on business cards and detail toggles favorite.
- AC2: Favorites tab in user profile showing saved businesses.
- AC3: List persists across sessions; logged‑out users see favorites after login (merge local storage if applicable).
- AC4: Unfavorite removes immediately with undo option.

### 3.10 User Profile – P0 (basic) / P1 (extended)
**Goal:** Manage personal data and preferences.
- AC1 (P0): Display name, email, phone, profile picture.
- AC2 (P0): Edit name, email (with verification), phone number.
- AC3 (P0): Change password.
- AC4 (P1): Notification preferences (push, email, reminders).
- AC5 (P1): Delete account with data removal confirmation.
- AC6 (P1): App settings: language, theme (light/dark) tied to profile.

### 3.11 Availability & Slot Computation – P0
**Goal:** Real‑time, conflict‑free slot generation.
- AC1: Slots are generated based on business working hours, staff shifts, service duration, buffer time before/after.
- AC2: Exclude blocked times (holidays, manual blocks) and existing confirmed bookings.
- AC3: Respect maximum parallel appointments per staff and per business.
- AC4: Available slots update immediately when a booking is confirmed or cancelled.
- AC5: System handles cross‑midnight services or multiple services total duration.
- AC6: API response includes time slots in ISO 8601 with availability status.

### 3.12 Shared Types & Design System – P0
**Goal:** Consistent UI and development efficiency.
- AC1: Design tokens for colors, typography (font family, sizes, weights), spacing scale, border radius, shadows.
- AC2: Shared UI component library (buttons, inputs, cards, modals, toasts, skeletons) in Storybook or similar.
- AC3: Type definitions for all API payloads and domain models used across frontend and backend.
- AC4: Documentation for component usage and theming.
- AC5: Accessibility: components meet WCAG 2.1 AA (contrast, focus states, labels).

### 3.13 Reviews & Ratings – P1
**Goal:** Build trust via user‑generated feedback.
- AC1: After a completed appointment, user receives prompt to rate (1‑5 stars) and write review (optional).
- AC2: Review displayed on business detail with star rating, text, date, user first name/last initial.
- AC3: Business average rating recalculated on new review.
- AC4: Owner can respond publicly to a review.
- AC5: Report inappropriate review functionality (flagged for admin).
- AC6: Admin can moderate (hide/delete).

### 3.14 Payment Integration – P0 (pre‑payment option)
**Goal:** Secure, optional pre‑payment to reduce no‑shows.
- AC1: Business configuration: require full payment, deposit (fixed or %), or pay at venue.
- AC2: Supported methods: credit/debit card, Apple Pay, Google Pay, digital wallets.
- AC3: Payment step integrated in booking flow; PCI‑compliant via Stripe/PayPal.
- AC4: Confirmation screen shows payment status and breakdown.
- AC5: Refund support for cancellations meeting refund policy (manual or automatic).
- AC6: Payment history visible in user profile.

### 3.15 Notifications – P1
**Goal:** Timely communication through push and email.
- AC1: Push notifications for booking confirmation, reminder 24h and 1h before appointment.
- AC2: Cancellation or reschedule notification to both user and provider.
- AC3: Email receipts for bookings and cancellations.
- AC4: Deep links from notification open relevant screen (appointment detail).
- AC5: Opt‑out per notification type in profile settings.
- AC6: Promotional/push marketing module (admin controlled) – P2.

### 3.16 Provider / Business Owner Portal – P0
**Goal:** Empower owners to manage their business and staff.
- AC1: Dashboard with today’s appointments, upcoming bookings, quick stats.
- AC2: Business profile management: name, description, photos, address, contact, social links.
- AC3: Services CRUD: name, category, duration, price, description, image, extra time buffer.
- AC4: Staff management: add/edit staff member, photo, working hours per day, assigned services, breaks.
- AC5: Calendar view: day/week/month showing appointments; click to see details.
- AC6: Manual booking from owner side (walk‑in).
- AC7: Manage availability: add custom working hours, holidays, block time slots.
- AC8: Accept/reject booking requests if manual confirmation is enabled.
- AC9: Review customer reviews and respond.
- AC10: Configure booking settings: advance notice, cancellation policy, payment requirements.

### 3.17 Admin Dashboard – P1
**Goal:** Platform governance and analytics.
- AC1: Overview: total businesses, users, bookings, revenue (if applicable).
- AC2: Business management: list, search, approve/reject new registrations, suspend.
- AC3: User management: search, disable accounts, view booking history.
- AC4: Review moderation queue with approve/reject/delete.
- AC5: Category management: add/edit/archive service categories.
- AC6: Promotional push notification targeting (segments).
- AC7: System logs and error monitoring.

### 3.18 Background Jobs (BullMQ) – P0
**Goal:** Reliable asynchronous processing.
- AC1: Notification dispatch jobs: confirmation, reminders, cancellations (email + push).
- AC2: Appointment reminder triggers: scan for upcoming appointments and enqueue reminders.
- AC3: Availability recalculation job triggered after any booking change affecting slots.
- AC4: Data cleanup: remove expired unverified accounts, purge old logs.
- AC5: Retry with exponential backoff for failed jobs; dead‑letter queue for permanent failures with alerts.
- AC6: Dashboard for job queue monitoring (admin accessible) – P1.

## 4. Non‑Functional Requirements
- Performance: API response < 200ms for 95th percentile; map rendering smooth.
- Security: HTTPS, encrypted data at rest, rate‑limiting, OWASP compliance.
- Scalability: Horizontal scaling for API and background workers.
- Accessibility: WCAG AA for customer and provider interfaces.
- Localization: Ready for multi‑language (English, French initially).