# Planity Clone Product Specification

## Overview
Planity Clone is a mobile-first appointment booking platform connecting customers with beauty, wellness, and grooming service providers. The product enables users to discover businesses, browse real-time availability, book appointments, manage visits, and pay seamlessly. Providers manage their schedules, services, and client flow, while an admin dashboard ensures platform health. Background jobs (BullMQ) handle notifications, reminders, and data maintenance.

---

## 1. User Authentication
**Priority:** P0 (Must have)

**Description:** Secure multi-method authentication for customers and providers. Supports email/password, phone OTP, and social login (Google, Apple). Includes password reset, email verification, and session management.

**User Stories:**
- As a new customer, I want to sign up quickly via email or social account so I can book services.
- As a provider, I need a separate business account type with additional onboarding steps.

**Acceptance Criteria:**
- Sign-up form validates email format, password strength (min 8 chars, 1 uppercase, 1 number).
- Phone OTP sent via SMS, expires after 5 minutes, 3 attempts max.
- Social login links to existing account if email matches; otherwise creates new account.
- After sign-up, email verification link sent; unverified accounts cannot book.
- Login returns JWT access (15min) and refresh tokens (7 days).
- Forgot password flow sends reset link; link expires in 1 hour.
- Account type (customer/provider) stored as enum; providers require business details before full access.
- Sessions persist across app closes using secure token storage.
- Logout clears tokens locally and invalidates refresh token on server.

---

## 2. Guest Browse & Explore
**Priority:** P0 (Must have)

**Description:** Unauthenticated users can browse businesses, services, and availability. Booking requires login.

**User Stories:**
- As a first-time visitor, I want to explore salons near me without creating an account.
- As a guest, I should be prompted to log in only when I try to book.

**Acceptance Criteria:**
- Home screen shows featured businesses, categories, and search bar without login.
- Tapping any business shows detail view, services, and reviews.
- Date/time selection shows available slots (generic, not real-time for guests; real-time after quick guest session).
- "Book" button triggers login/registration modal; after authentication, booking flow resumes with pre-filled data.
- Guest can add items to a temporary cart that persists until login.
- No personalization (favorites, history) without account.

---

## 3. Business Search & Discovery
**Priority:** P0 (Must have)

**Description:** Full-text search with filters for location, category, rating, price, and availability.

**User Stories:**
- As a user, I want to find a “hair salon” near me that is open on Saturday morning.
- As a user, I want to filter results by rating and price range.

**Acceptance Criteria:**
- Search bar supports autocomplete based on business name, service, and category.
- Results sorted by relevance (closest first) by default; user can sort by rating, price low-to-high, or distance.
- Filters: distance radius (1,3,5,10 km), category multi-select, rating (≥4, ≥3.5, etc.), price range (€, €€, €€€), “open now” toggle, service type.
- Each result card shows name, primary image, rating, distance, next available slot, and “♥” favorite icon.
- Paginated infinite scroll (20 items per page).
- Location permission requested; if denied, user can manually enter address or use city name.

---

## 4. Map-based Search
**Priority:** P1 (Should have)

**Description:** Interactive map view showing business pins with clustering and quick preview.

**User Stories:**
- As a visual person, I want to see available salons on a map near my current location.

**Acceptance Criteria:**
- Toggle between list and map view on search screen.
- Map displays pins colored by category; pins cluster when zoomed out.
- Tapping a pin shows a mini-card with name, rating, next slot, and a “details” button.
- Map re-centers as user drags; search area updates accordingly (within current viewport bounds).
- Performance: renders up to 500 pins smoothly via clustering library (e.g., supercluster).
- Works on both iOS and Android with native map modules.

---

## 5. Service Categories
**Priority:** P0 (Must have)

**Description:** Hierarchical category system for service types (e.g., Hair > Women’s Haircut, Coloring).

**User Stories:**
- As a user, I want to browse all businesses offering “massage” without typing.

**Acceptance Criteria:**
- Home screen shows top-level category cards with icons (Hair, Nails, Massage, Facial, Barber, Makeup, etc.).
- Tapping a category navigates to a subcategory list, then to search results filtered by that subcategory.
- Admin can manage categories (add/edit/disable) via dashboard; changes reflect in app immediately.
- Categories support multi-language translations (if scope allows).
- “All” view shows businesses across all categories.

---

## 6. Business Detail View
**Priority:** P0 (Must have)

**Description:** Comprehensive profile for each business, showing services, staff, reviews, gallery, and booking options.

**User Stories:**
- As a user, I want to see a salon’s photos, working hours, services with prices, and reviews before booking.
- As a user, I want to select a specific stylist based on their profile and availability.

**Acceptance Criteria:**
- Cover image carousel (swipeable, up to 10 images).
- Business name, rating (stars + count), address with map link, “favorite” button, share option.
- Tabs: Services, Staff, Reviews, Info.
  - Services tab: grouped by category; each service shows name, duration, price, and “Book” button.
  - Staff tab: cards with photo, name, specialties, rating, and “Book with” button.
  - Reviews tab: summary rating distribution, sortable list of reviews with pagination.
  - Info tab: description, amenities, opening hours, cancellation policy, payment methods.
- “Book” / “Book with” opens date/time/service selection (availability component).
- Loading states with skeleton screens for all sections.
- Offline support: cached business detail available for 24 hours.

---

## 7. Availability & Slot Computation
**Priority:** P0 (Must have)

**Description:** Real-time calculation of available appointment slots based on provider schedules, staff working hours, existing bookings, buffer times, and service duration.

**User Stories:**
- As a user, I want to see only truly available time slots for my desired service and staff on a given date.
- As a provider, I want the system to block slots when I mark time off or when appointments overlap.

**Acceptance Criteria:**
- Backend service computes slots dynamically given businessId, staffId (optional), serviceId, and date.
- Takes into account: staff working hours (recurring weekly schedule), one-off time-offs (sick, vacation), existing confirmed appointments, service duration, pre/post buffer times configured by provider.
- Slots generated at 15-minute intervals; if a service requires 45 mins, only start times that allow full duration before next busy block are shown.
- For multiple staff, show combined availability (any staff) or filter by staff.
- Response time under 200ms for typical load; caching strategy using Redis with 30s TTL for availability queries.
- Edge cases: service can be offered only in specific rooms (if provider uses rooms) – future scope, V1 ignores room constraints.
- Public holiday support: admin can define holidays; slots not available on those days unless provider overrides.

---

## 8. Booking Flow
**Priority:** P0 (Must have)

**Description:** Multi-step guided booking from service selection to confirmation. Handles guest-to-login transition, prepayment, and confirmation.

**User Stories:**
- As a customer, I can select a service, staff, date/time, add extras, and confirm my booking in a smooth flow.
- As a returning customer, I want my last used payment method and personal details pre-filled.

**Acceptance Criteria:**
- Flow steps: 1) Service & Staff selection, 2) Date & Time (via calendar/availability picker), 3) Extras/Add-ons (optional), 4) Review summary, 5) Payment (if required), 6) Confirmation.
- Step 2 shows a calendar with days highlighted green (available), yellow (limited), grey (closed). Time slots displayed as buttons; tap to select.
- Step 4 shows total price, service details, staff, date/time, cancellation policy snippet.
- If user is guest, after step 4, login/sign-up modal appears; upon success, booking resumes with data intact.
- Payment: supports credit/debit card (Stripe), digital wallets (Apple Pay/Google Pay). Pre-authorization or full charge based on provider settings (capture now or capture later).
- On confirmation, booking is created with status “confirmed” (or “pending” if payment capture later), and confirmation screen shows booking ID, calendar add option, and share functionality.
- Optimistic UI with graceful error handling; if slot becomes unavailable during checkout, user sees “This time is no longer available, please choose another” and returns to step 2.
- All booking details saved in database transactionally (booking, payment intent, customer).

---

## 9. Appointment Management
**Priority:** P0 (Must have)

**Description:** Customer’s view of upcoming and past appointments with actions: reschedule, cancel, rebook, add to calendar.

**User Stories:**
- As a customer, I want to see all my upcoming appointments and cancel or change them if plans change.
- As a customer, I want to easily rebook the same service with the same provider.

**Acceptance Criteria:**
- Appointments list screen with tabs: Upcoming, Past.
- Upcoming card: business name, service, staff, date/time, status badge (confirmed, pending, cancelled).
- Actions: Cancel (with confirmation dialog and policy display), Reschedule (opens rescheduling flow reusing same service/staff, new date/time), Add to Calendar (generates .ics or device calendar event), Contact (tap to call/message provider).
- Rescheduling follows provider’s rescheduling policy (e.g., max 2 hours before; else treat as cancel + rebook).
- Cancellation triggers refund calculation based on provider’s cancellation policy (e.g., free cancel 24h before, 50% within 24h, no refund within 1h). Refund initiated via Stripe.
- Past appointments show review prompt if not reviewed yet, and “Rebook” button that pre-populates service/staff into booking flow.
- Push notifications remind upcoming appointment (configurable).
- Pull-to-refresh and pagination for long history.

---

## 10. Favorites
**Priority:** P1 (Should have)

**Description:** Save businesses to a favorites list for quick access.

**User Stories:**
- As a user, I want to bookmark salons I like so I can find them later without searching.

**Acceptance Criteria:**
- Heart icon on business card and detail view toggles favorite.
- Favorites screen lists saved businesses with recent activity indicator (“new slot available”).
- Unfavoriting removes item with undo option for 5 seconds.
- Sync across user’s devices via backend.
- Requires authentication.

---

## 11. Reviews & Ratings
**Priority:** P1 (Should have)

**Description:** Customers leave star rating and text review after completed appointments. Aggregated display on business profile.

**User Stories:**
- As a customer, I want to rate my experience and read others' reviews to choose a provider.
- As a provider, I want to see and respond to reviews.

**Acceptance Criteria:**
- After appointment status becomes “completed”, prompt appears in past appointments to “Rate your visit”.
- Rating: 1-5 stars with optional text review (max 500 chars) and photo upload (optional, up to 3).
- Reviews are public; author name displayed as “Firstname L.” for privacy.
- Business profile shows average rating, count, and distribution bar.
- Users can sort reviews by Recent, Highest, Lowest. Pagination.
- Provider can reply to reviews; reply shown below review.
- Inappropriate content flagging; admin can moderate/hide.
- Review submission triggers notification to provider.

---

## 12. Payment Integration
**Priority:** P0 (Must have)

**Description:** Secure payment processing via Stripe, supporting card, digital wallets, and SEPA (if needed). Platform supports capture later (hold) or immediate capture based on provider settings.

**User Stories:**
- As a customer, I want to pay securely with my card or Apple Pay.
- As a provider, I want to receive payouts to my bank account with clear reporting.

**Acceptance Criteria:**
- Stripe Connect integration: providers onboard via Express accounts.
- Customer payment methods: card (Stripe Elements / mobile SDK), Apple Pay, Google Pay.
- Payment flow: create PaymentIntent on server, confirm on client, handle 3D Secure.
- For appointments with capture later, create and confirm PaymentIntent with capture_method=manual; capture after service completion (manual or automatic via job).
- Platform fee commission configurable per transaction (e.g., 10%). Stripe application fee.
- Receipts sent via email after payment; stored in booking record.
- Failed payments handled gracefully: user sees error with option to retry; booking status set to “payment_failed” and slot released after 10 minutes.
- Refund logic for cancellations per policy; partial refunds supported.
- Payout schedule to providers (e.g., daily, weekly) managed by Stripe; dashboard shows upcoming payouts.

---

## 13. Notifications
**Priority:** P0 (Must have)

**Description:** Push notifications, in-app notifications, and email/SMS for transactional events.

**User Stories:**
- As a customer, I want to be reminded of my appointment and notified if the provider changes something.
- As a provider, I want to know immediately when a new booking comes in.

**Acceptance Criteria:**
- Event types: booking confirmation, booking reminder (24h and 1h before), cancellation/reschedule, payment success/failure, review request after completion, provider reply to review.
- Channels: push (Firebase Cloud Messaging for native, web push for web), in-app notification center (bell icon with badge), email (transactional via SendGrid/Mailgun), SMS for critical alerts (reminder opt-in).
- Users can configure notification preferences per channel.
- Real-time push delivery using WebSocket or FCM. Background jobs (BullMQ) process scheduled notifications.
- Deep linking: tapping notification opens relevant screen (e.g., booking detail).
- Provider notifications: new booking, cancellation, review submitted.
- In-app notifications grouped by date, mark as read/unread, badge count.

---

## 14. User Profile
**Priority:** P0 (Must have)

**Description:** Central customer profile managing personal info, appointment history, payment methods, notification settings, and favorites.

**User Stories:**
- As a customer, I want to update my phone number and save my favorite payment card for faster checkout.

**Acceptance Criteria:**
- Edit fields: first name, last name, email (read-only after verification), phone, profile photo.
- Saved payment methods: list of cards/wallets, set default, delete. Addition via Stripe Elements.
- Notification preferences with toggles per type and channel.
- Link to Appointments and Favorites.
- Delete account option with GDPR-compliant data removal (anonymization or hard delete after grace period).
- All changes synced to backend, optimistic update.

---

## 15. Provider / Business Owner Portal
**Priority:** P0 (Must have)

**Description:** Web and mobile portal for providers to manage their business profile, services, staff, schedule, and bookings.

**User Stories:**
- As a salon owner, I want to set my opening hours, add services with prices, manage my team, and see my daily schedule.

**Acceptance Criteria:**
- Onboarding wizard for new providers: business details, address, categories, owner verification.
- Dashboard: today’s appointments list with status, customer name, service, staff. Quick actions: check-in, cancel, mark no-show.
- Services management: CRUD for services with name, category, duration, price, description, color code.
- Staff management: invite staff via email, set roles, assign services, define individual working hours (overrides general hours), time-offs.
- Schedule view: day/week calendar showing all appointments per staff, color-coded. Drag-to-move (reschedule) with client notification.
- Booking settings: buffer time before/after, cancellation policy (free cancellation window, fees), payment capture mode (immediate/later), prepayment requirement.
- Client list: search and view client history, notes.
- Notifications: real-time for new bookings, cancellations.
- Multi-location support (future): basic single location V1.
- Analytics: basic KPIs (appointments this week, revenue, average rating).
- Provider portal accessible via responsive web app (primary) and companion mobile app (view appointments, quick actions).

---

## 16. Admin Dashboard
**Priority:** P0 (Must have)

**Description:** Admin panel for platform management: businesses, users, bookings, disputes, categories, and system health.

**User Stories:**
- As an admin, I need to approve new businesses, moderate reviews, and resolve payment issues.

**Acceptance Criteria:**
- Secure login with admin role (separate from customer/provider).
- Dashboard overview: total bookings today, GMV, active providers, new signups, top categories.
- Businesses management: list with filters, approve/reject, suspend, view details, edit.
- Users management: search customers, view profile/history, disable accounts.
- Bookings management: view all, filter, manual cancellation/refund.
- Reviews moderation: flagged reviews queue, hide/unhide, respond as admin.
- Category management: add/edit/disable service categories, set default sort order.
- Commission settings: set platform fee percentage, special rates for specific providers.
- Payout overview: total payouts due, processed, failed; integration with Stripe dashboard.
- System configuration: app version force update, feature flags, global holidays.
- Role-based access: super admin, support agent (limited).

---

## 17. Background Jobs (BullMQ)
**Priority:** P0 (Must have)

**Description:** Reliable job queue for async tasks using BullMQ with Redis.

**User Stories:**
- As a developer, I want to schedule notifications and reminders reliably and retry failed jobs.

**Acceptance Criteria:**
- Jobs defined: send-push, send-email, send-sms, process-refund, capture-payment, release-expired-slots, generate-report, clean-old-data.
- Scheduled jobs: appointment reminders (24h, 1h before), payment capture after service completion (delayed), release slots if payment fails after 10 min.
- Retries with exponential backoff for transient failures (e.g., email API down): max 3 attempts.
- Dead letter queue for permanently failed jobs; admin can view and manually retry.
- Monitoring via Bull Board UI integrated into admin dashboard.
- Concurrency and rate limits per queue (e.g., send-email: 10 concurrent, 30/min).
- Jobs are idempotent where possible (e.g., prevent double capture).
- Logging of job execution for debugging.

---

## 18. Shared Types & Design System
**Priority:** P0 (Must have)

**Description:** Unified design tokens, reusable UI components, and shared TypeScript types across web and mobile frontends to ensure consistency and development speed.

**User Stories:**
- As a frontend developer, I want to use pre-built components like `Button`, `Input`, `Card`, and typography tokens that match the brand.

**Acceptance Criteria:**
- Design tokens defined in a central package (colors, spacing, font sizes, shadows, borderRadius) consumed by React Native (mobile) and Next.js (web).
- Component library includes: Button (variants: primary, secondary, outline, ghost), Input (with masking, validation state), Card, Modal, BottomSheet, Avatar, Badge, StarRating, Tabs, Skeleton, Toast, CalendarPicker, etc. All documented in Storybook.
- Shared TypeScript types for API models: User, Business, Service, Staff, Booking, Review, Slot, etc., published as npm package or monorepo package.
- Responsive and accessible (WCAG AA for web); touch targets minimum 44px on mobile.
- Theming support: light/dark mode via context; colors adapt.
- Visual consistency audit checklist: all screens must use tokens, no hardcoded colors/spacings.

---

## Priority Summary
| Feature | Priority |
|---|---|
| User Authentication | P0 |
| Guest Browse & Explore | P0 |
| Business Search & Discovery | P0 |
| Map-based Search | P1 |
| Service Categories | P0 |
| Business Detail View | P0 |
| Availability & Slot Computation | P0 |
| Booking Flow | P0 |
| Appointment Management | P0 |
| Favorites | P1 |
| Reviews & Ratings | P1 |
| Payment Integration | P0 |
| Notifications | P0 |
| User Profile | P0 |
| Provider Portal | P0 |
| Admin Dashboard | P0 |
| Background Jobs (BullMQ) | P0 |
| Shared Types & Design System | P0 |

P0 = Must have for MVP, P1 = Should have (post-MVP or Phase 2).