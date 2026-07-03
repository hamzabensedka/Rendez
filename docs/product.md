# Product Specification: Planity Clone

## 1. Introduction
Planity Clone is a mobile-first platform connecting customers with local service businesses (salons, barbers, spas, etc.). It enables discovery, booking, and management of appointments, and provides business owners with tools to manage availability, appointments, and customers. The platform includes an Admin Dashboard for oversight and background job processing for notifications and reminders.

### 1.1 Goals
- Allow customers to effortlessly find and book services.
- Provide business owners with a portal to manage services, schedules, and appointments.
- Deliver real-time availability and instant booking confirmations.
- Maintain high performance and reliability with asynchronous job processing.
- Support guest browsing to encourage sign-up.

### 1.2 User Roles
- **Guest:** Unauthenticated user with limited access (browse, search, view business details, but cannot book or favorite).
- **Customer (Registered User):** Authenticated user who can book, manage appointments, leave reviews, manage favorites, and view profile.
- **Business Owner/Provider:** Authenticated user managing one or more business locations, services, staff, availability, and appointments.
- **Admin:** Super user with access to the Admin Dashboard to manage platform, users, businesses, monitor activity.

## 2. Features

### 2.1 User Authentication
**Priority:** Must Have

**Description:** Secure sign-up and login via email/password and social providers (Google, Apple). Support password reset and session management. Role-based access (Customer, Owner, Admin).

**Acceptance Criteria:**
- The app provides email/password registration with email verification (send verification link, and account remains unverified until confirmed).
- Social login (Google, Apple) is supported; first-time social login creates an account automatically.
- Login screen includes “Forgot Password” flow that sends reset email with time-limited token.
- After login, the user receives a JWT access token (short-lived) and refresh token (long-lived) stored securely.
- On token expiry, the app uses the refresh token to obtain a new access token silently.
- Users can log out, which invalidates tokens and clears state.
- Registration collects minimal fields: email, password, first name, last name (for customer); additional fields for business owner during onboarding (business name, etc., covered in Provider Portal).
- Error states for invalid credentials, duplicate email, weak password are displayed clearly.
- All auth endpoints are rate-limited.

### 2.2 Guest Browse & Explore
**Priority:** Must Have

**Description:** Allow unauthenticated users to browse featured businesses, search, view details, and see available services and slots. Prompt to sign up/login to proceed with booking or favoriting.

**Acceptance Criteria:**
- Guest landing page displays curated featured businesses or categories.
- Guest can search for businesses by name, location, or service type.
- Guest can view a business detail page including services, ratings, and availability slots (without being able to book).
- On attempting to book, favorite, or leave a review, the user is prompted to log in or register, then returned to the intended action after login.
- Guest session preserves search context after login.

### 2.3 Business Search & Discovery
**Priority:** Must Have

**Description:** Powerful search allowing customers to find businesses by keyword, category, location, and distance. Includes map-based search as a visual alternative. Filter by rating, price range, availability.

**Acceptance Criteria:**
- Search bar with auto-complete for business names and service types.
- Filters: category (multi-select), price range (slider or predefined buckets), minimum rating, distance radius (when location is provided), and availability (today, this week, etc.).
- Search results list with thumbnail, business name, rating, distance, and next available slot.
- Map View: toggle to map display showing pins for businesses results. Pins update as map moves; tapping a pin shows a preview card.
- Search respects user’s location permission; if denied, user can set location manually.
- Results can be sorted by relevance, rating, distance, availability.
- Pagination/infinite scroll.
- Search query and filters are preserved in URL/shareable deep link.

### 2.4 Business Detail View
**Priority:** Must Have

**Description:** Detailed page with business info, services, staff (if applicable), reviews, photo gallery, and booking CTA.

**Acceptance Criteria:**
- Header with cover image, business name, category, rating, address, distance, hours.
- Services tab: list of services with name, duration, price, and "Book" button.
- Staff tab: if business has multiple service providers, list each with photo, specialties, and availability schedule.
- Reviews tab: list of reviews with ratings, text, photos; paginated.
- Gallery: photos of the business.
- Map snippet showing location with link to open maps.
- "Favorite" button (heart) to add/remove from favorites; requires login.
- Share button to share business deep link.
- Opening hours displayed with current status (open/closed).
- Sticky CTA at bottom to start booking flow.

### 2.5 Service Categories
**Priority:** Must Have

**Description:** Organize services into categories for browsing. Categories can be shown on home screen as a grid of icons.

**Acceptance Criteria:**
- Admin can create, update, delete categories (through Admin Dashboard).
- Categories are displayed on the home screen with icons and names (e.g., Hair, Massage, Nails).
- Tapping a category navigates to search results filtered by that category.
- Category list is dynamic and fetched from backend.
- Categories can be nested (subcategories), but MVP is flat.

### 2.6 Booking Flow
**Priority:** Must Have

**Description:** Step-by-step booking process: select service, optionally select staff and date/time, optionally add extras, confirm details, and pay (or hold without payment if configured). Real-time slot availability.

**Acceptance Criteria:**
- Booking can be initiated from business detail, service list, or directly from a deep link.
- Step 1: Service Selection – choose one or more services (if business allows multiple), with quantity.
- Step 2: Staff Selection – if multi-staff, choose preferred staff or "any available".
- Step 3: Date & Time Selection – calendar to pick date, then time slots based on computed availability (Section 2.10). Show only available slots. Slots are locked temporarily during the booking session (e.g., 10 min hold).
- Step 4: Extras/Add-ons – if service has optional upgrades (e.g., deep condition), present checkboxes.
- Step 5: Confirmation – summary of selections, price breakdown, and user info (pre-filled from profile). Option to add a note.
- Step 6: Payment – if payment is required for booking confirmation, integrate payment method selection (Section 2.13). If no upfront payment, proceed to confirm.
- On confirmation, the appointment is created with status "Confirmed" (or "Pending" if payment needed), a confirmation screen with details and option to add to calendar.
- If the booking fails (slot taken, payment fails), show appropriate error and allow retry.
- Booking flow supports deep linking from shared service links.
- Guest users are prompted to log in before step 5.

### 2.7 Appointment Management
**Priority:** Must Have

**Description:** Customers can view upcoming, past, and cancelled appointments. They can reschedule or cancel (subject to policy). Business owners can also manage from their portal.

**Acceptance Criteria:**
- "My Appointments" tab in user profile lists appointments sorted by date.
- Upcoming section shows date, time, business, services, status, and action buttons: Reschedule, Cancel, View Details, Add to Calendar.
- Past appointments with ability to leave a review (if not already reviewed).
- Reschedule: opens a reduced booking flow to pick a new date/time (same service, staff optional) and updates the appointment. It respects cancellation policy (e.g., if within 24h, cancel not allowed, instead only cancel with penalty).
- Cancel: triggers cancellation with confirmation dialog, explaining any refund policy. Appointment status updated to "Cancelled".
- Push notification reminders for upcoming appointments (24h and 1h before).
- Calendar integration: ability to add appointment to device calendar (using standard URI or ics download).
- Business owners see the same appointments for their business in the provider portal with ability to change status (Confirm, Cancel, Mark No-Show).

### 2.8 Favorites
**Priority:** Should Have

**Description:** Users can maintain a list of favorite businesses for quick access.

**Acceptance Criteria:**
- User can tap heart icon on business card/detail to add to favorites. Heart toggles state (filled/unfilled).
- Favorites list accessible from user profile or a dedicated tab.
- List displays favorite businesses with name, rating, and next available slot.
- Favorites are synced across devices for same user.
- When a business is removed from platform, it is automatically removed from favorites.

### 2.9 User Profile
**Priority:** Must Have

**Description:** User can manage personal information, notification preferences, payment methods, and view history.

**Acceptance Criteria:**
- Profile screen shows photo (optional), name, email, phone number.
- Edit: change name, phone, upload profile photo, update password.
- Section for saved payment methods (masked card info) with ability to add/delete.
- Notification preferences: toggle push/email for booking confirmations, reminders, promotions.
- Link to appointment history.
- Link to favorites.
- Option to delete account (with confirmation and data wipe policy).

### 2.10 Availability & Slot Computation
**Priority:** Must Have

**Description:** Computes real-time available time slots for a given service/staff/date based on business hours, staff schedules, existing appointments, break times, service duration, and buffer times. Utilized in booking flow and displayed to users.

**Acceptance Criteria:**
- System stores for each business: operating hours per day of week, holiday exceptions.
- For each staff member: working hours (may differ from business hours), unavailability (time off), service assignments (which services they can perform), service duration, and buffer time between appointments.
- Slot computation algorithm: given a service, staff (optional), and date, generate a list of available start times. A slot is available if:
   - The staff is working within business hours on that day.
   - No overlapping appointments (including buffer) for that staff.
   - The staff is assigned to the service.
   - No blocked time (breaks, time-offs).
- If no staff selected, compute union of available slots across all eligible staff.
- Slots are generated in 15-minute increments, but precise start times align with service start times.
- When a customer begins booking and selects a slot, a temporary reservation lock (TTL 10 minutes) is placed to prevent double booking. If booking is not completed, lock expires.
- The system must handle timezone conversions: business location timezone.
- Slot computation must be fast and accurate (use caching with invalidation on appointment changes).
- Edge cases: last appointment must end by closing time; walking late may be allowed if business permits; variable slot duration for combos.

### 2.11 Shared Types & Design System
**Priority:** Must Have

**Description:** Define a shared design system and TypeScript types/interfaces for the entire platform (web and mobile) to ensure UI consistency and type safety across frontend and backend.

**Acceptance Criteria:**
- Design system includes: color palette, typography scale, spacing units, border radius, shadow values, icon set.
- Reusable UI components: Button (variants: primary, secondary, outlined, text), Input, Card, Modal, BottomSheet, Avatar, Badge, Tabs, Calendar, TimeSlotPicker, StarRating, etc., all consistent with design tokens.
- A component library is implemented using a framework (e.g., React Native with styled-components or NativeBase) and documented in Storybook or similar.
- All components are accessible (minimum contrast, touch targets 44px, screen reader support).
- Shared TypeScript interfaces: IUser, IBusiness, IService, IStaff, IAppointment, IReview, ITimeSlot, etc. Defined in a shared package `@planity/types` used by backend and frontend.
- API request/response types also shared.
- The system ensures that any UI component and API payload adheres to defined types, reducing integration bugs.
- Design tokens are exported as a module for theming.

### 2.12 Reviews & Ratings
**Priority:** Should Have

**Description:** Customers can leave star ratings and written reviews for businesses after a completed appointment. Reviews aggregate to influence business rating.

**Acceptance Criteria:**
- Only customers with a completed appointment (status confirmed/attended) at a business can write a review, within a configurable time window (e.g., 30 days).
- One review per appointment; user can't review same appointment twice.
- Review form: star rating (1-5), text (optional, min 10 chars), photo upload (optional, up to 5 images). Review submission requires moderation (admin flag) or auto-publish (configurable).
- Business detail shows aggregate rating (average) and total count, plus a list of recent reviews.
- Sorting reviews by most recent, highest rating, lowest rating.
- User can edit or delete their own review (with audit trail).
- Business owner can respond to a review (one response per review) through provider portal.
- Review moderation dashboard in Admin for flagging inappropriate content.
- Spam prevention: CAPTCHA on submission, rate limiting.

### 2.13 Payment Integration
**Priority:** Must Have

**Description:** Secure payment processing for booking (if required) and refunds. Support card payments and digital wallets. Use a PSP like Stripe. Handle PCI compliance.

**Acceptance Criteria:**
- Integrate Stripe as primary payment provider (or abstracted to allow future PSPs).
- Users can add credit/debit card (tokenized) via Stripe Elements or mobile SDK, stored as payment methods.
- At booking, if business requires upfront payment, charge card immediately (or hold authorization). Capture payment only on completion/cancellation policy.
- Support Apple Pay and Google Pay for one-tap payment.
- Payment flow shows transparent pricing breakdown: service total, taxes, fees, discount.
- On cancellation, if refund policy allows, system triggers refund (full or partial) based on cancellation window; manual refund option for business owner/ admin.
- Receipt generation: email receipt after successful payment.
- Handle failed payments gracefully with retry option, clear error message.
- All payment-related actions are logged in audit trail.
- Test mode and live mode toggle via environment config.
- PCI DSS compliance ensured by using Stripe tokenization; no raw card data touches our servers.

### 2.14 Notifications
**Priority:** Should Have

**Description:** Push notifications, email, and in-app notifications to keep users informed about bookings, reminders, promotions, and messages. Use a unified notification service.

**Acceptance Criteria:**
- Push notifications via FCM/APNs for mobile apps; Web push for web version.
- Trigger types: booking confirmation, booking reminder (24h, 1h before), cancellation, review request after appointment, promotional broadcasts from admin, chat messages (if applicable), account changes.
- Users can configure notification channels in profile (toggle push/email per type).
- In-app notification center: bell icon with unread count, list of recent notifications, mark as read, delete.
- Emails: transactional emails for booking confirmation, cancellation, password reset, welcome; designed with responsive templates.
- Notifications are dispatched via background jobs (BullMQ) to ensure resilience and retry.
- Deep linking: notifications open relevant screen (appointment detail, booking confirmation, etc.).
- Rate limiting to avoid spam.

### 2.15 Provider / Business Owner Portal
**Priority:** Must Have

**Description:** A dedicated interface for business owners to manage their business(es), services, staff, schedules, appointments, and customers. Accessible via mobile and web (responsive).

**Acceptance Criteria:**
- Owner registration: after sign-up, owner can create a business by providing name, category, address, contact info, and logo. Or claim an existing business (with admin approval).
- Dashboard: overview of today's appointments, revenue summary, upcoming bookings.
- Appointment Management: calendar view (day/week) to see all staff appointments. Ability to create manual appointments for walk-ins, modify, cancel, mark completed/no-show.
- Staff Management: add/edit staff members (name, photo, bio, services they perform, working hours and breaks). Set working hours per day; define unavailability.
- Service Management: create/edit services (name, description, duration, price, category, color, image). Option to add add-ons/extras.
- Business Hours: set opening and closing times per day, special holiday hours.
- Customer Management: view customer list, appointment history, add notes.
- Reviews: view and respond to reviews.
- Settings: notification preferences, payment account setup (connected Stripe account for payouts if marketplace model), cancellation policy configuration.
- Multi-location support: owners with multiple businesses can switch between them.
- Access is role-based; staff members might have limited access (only their schedule) if implemented later.

### 2.16 Admin Dashboard
**Priority:** Must Have

**Description:** Web-based dashboard for platform administrators to manage businesses, users, appointments, reviews, and monitor system health.

**Acceptance Criteria:**
- Secure admin authentication with role ADMIN.
- Dashboard with key metrics: total users, businesses, appointments today, revenue (if applicable), new registrations.
- User Management: list all users (customers, owners, admins), search, filter by role, view details, disable accounts, reset passwords.
- Business Management: approve/reject new business registrations, view/edit business details, suspend businesses, manage categories.
- Appointments: view all appointments with filtering (date, business, status), ability to cancel or modify.
- Review Moderation: queue of flagged reviews, ability to approve/reject/edit, respond as admin.
- Notification Broadcasts: compose and send promotional push notification or email to segmented user groups (by location, activity).
- System Config: manage global settings (cancellation policy defaults, booking window, max slots per day, etc.).
- Audit logs for sensitive actions.
- Data export (CSV) for reports.

### 2.17 Background Jobs (BullMQ)
**Priority:** Must Have

**Description:** Use BullMQ (Redis-backed) to process asynchronous tasks reliably, such as sending notifications, emails, scheduling reminders, cleaning expired locks, generating reports.

**Acceptance Criteria:**
- Job queue for sending push notifications and emails with retry logic and exponential backoff.
- Schedule upcoming reminders: when an appointment is created, enqueue delayed job to send reminder at (appointment time - 24h) and (appointment time - 1h); if appointment rescheduled/cancelled, corresponding jobs are removed or updated.
- Cleanup job: periodically remove expired slot locks (every 5 minutes).
- Process refunds asynchronously.
- Generate daily/weekly reports for admin.
- Job failure alerts (Slack/email) and monitoring via Bull Board dashboard.
- Queue concurrency and rate limiting configured to respect external API limits (e.g., Stripe, email sending service).
- All job handlers are idempotent.