# Planity Clone — Product Specification

## 1. Shared Types & Design System
**Priority:** P0 (Foundation)
**Description:** Unified models, enums, and UI primitives used across all Planity modules. Ensures consistency between backend, web, and mobile clients.
- **Models & Enums:** `User`, `Business`, `Service`, `Appointment`, `Review`, `Favorite`, `Payment`, `Notification`. Status enums: `AppointmentStatus: [PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELED, NO_SHOW]`, `PaymentStatus: [PENDING, PAID, REFUNDED, FAILED]`.
- **Atomic CSS & Component Library:** Typography (sans-serif hierarchy, 5 levels), color tokens (primary blue #1E4DB7, neutral grays, semantic green/red/yellow), spacing scale (4px base), consistent `Button`, `Card`, `Badge`, `Modal`, `Input`, `StarRating` components.
- **Responsive Grid:** 4-column (mobile), 8-column (tablet), 12-column (desktop).
- **Avatar, Map Marker, Loading Skeleton** variants.
**Acceptance Criteria:**
- All services use the same shared types package.
- Design tokens are consumed from a single JSON file, generating SwiftUI/Compose/SCSS variables.
- Storybook documentation covers all primitive components.

## 2. User Authentication
**Priority:** P0
**Description:** Multi-method sign-up/sign-in with role selection (Client, Provider), secure session management, and onboarding.
- **Client Flow:** Email/password, Google SSO, Apple Sign-In, phone OTP. Email verification required. After register, optional onboarding (pick interests from service categories).
- **Provider Flow:** Same auth methods + Business verification step. Must provide business license during sign-up; account is “pending verification” until admin approves.
- **Session:** JWT (access + refresh tokens). Biometric lock option for mobile.
**Acceptance Criteria:**
- User can register/login with all methods within 5 seconds.
- Invalid/expired tokens redirect to login; refresh token rotation works.
- Role-based redirection: client → home, provider → provider dashboard, admin → admin dashboard.
- Forgot/reset password flow sends email with expiring link (10 min). OTEL logs to a “Login Error” if OAuth fails.

## 3. Guest Browse & Explore
**Priority:** P1
**Description:** Non-logged-in users can explore businesses, services, and reviews to maximize conversion.
- Home feed shows trending businesses and categories.
- Search available with limited filters.
- Tapping “Book” or “Save” prompts login/signup modal.
**Acceptance Criteria:**
- Guest can browse unlimited business detail pages and reviews.
- Login modal appears with deep-link back to previous intent after auth.
- No booking state is lost after forced login.

## 4. Business Search & Discovery
**Priority:** P0
**Description:** Full-text and faceted search over businesses and services. Supports synonyms, geolocation, and recent searches.
- **Search Bar:** Auto-suggest with business names & service categories. Results update as user types (debounce 300ms).
- **Filters:** Category, price range, rating, availability (date/time), distance, features (parking, WiFi, wheelchair accessible).
- **Sort:** Relevance, rating, distance, price low→high, availability.
- **Recent Searches & Popular Tags**: stored locally for guests, synced to profile for authenticated users.
**Acceptance Criteria:**
- Typo-tolerant search returns results in <200ms (via Elasticsearch/Meilisearch).
- Filters combine additively; URL query params persist state for sharing.
- Empty state shows “No results” with suggestions to broaden filters.
- Voice search on mobile (optional).

## 5. Map-based Search
**Priority:** P1
**Description:** Interactive map (Mapbox/Google Maps) with clustering and dynamic viewport search.
- Users toggle between list view and map view.
- Markers color-coded by category. Tap marker → preview card → full detail.
- “Search this area” button upon map move.
- Geolocation button centers on user.
**Acceptance Criteria:**
- Map loads 50+ markers without significant lag (clustering active).
- Moving map > 500m triggers “Search this area” refresh.
- Permission denied for location shows default city center (configurable).
- Smooth transitions between list and map views.

## 6. Business Detail View
**Priority:** P0
**Description:** Comprehensive business profile optimized for booking conversion.
- **Header:** Carousel gallery, business name, category badges, rating summary, address with “Directions” link, favorite (heart) button.
- **Tabs/Sections:** Services, About (description, amenities, team), Reviews, Map.
- **Service List:** Grouped by category. Each service shows name, duration, price, “Book” button.
- **Highlights Bar:** Booking count, response time, cancellation policy.
**Acceptance Criteria:**
- Page renders core content (above fold) in <1.5s on 4G.
- Gallery supports swipe, pinch-to-zoom.
- Share button copies deep link; opens app if installed.
- Favorite toggle updates instantly with optimistic UI.

## 7. Service Categories
**Priority:** P0
**Description:** Hierarchical category taxonomy powering discovery and provider onboarding.
- Admin-managed tree up to 3 levels (e.g., Hair → Cut → Fade).
- Each category has icon, cover image, description.
- Categories displayed in browse grid and as chips/filters.
**Acceptance Criteria:**
- Providers can select up to 5 categories for their business.
- Category pages show top businesses with infinite scroll.
- Category tree editable via admin dashboard; changes propagate without app update.

## 8. Availability & Slot Computation
**Priority:** P0 (Core Engine)
**Description:** Computes bookable time slots based on provider schedules, service duration, buffers, existing appointments, and blackout periods.
- **Provider Schedule:** Recurring weekly hours + date overrides (holidays, extended hours).
- **Service Config:** Duration, buffer time before/after, resources required (rooms, equipment).
- **Slot Engine:** Algorithm returns consecutive available slots for given business/service/date/staff. Handles multi-staff parallel slots.
**Acceptance Criteria:**
- Slot generation based on worker availability and concurrency.
- Slot computation query returns results in <300ms.
- Simultaneous bookings cannot double-book the same resource (pessimistic DB row lock).
- Exposes API: `GET /availability?businessId=&serviceId=&date=&staffId=`.
- Weekend/public holiday logic is configurable per country.

## 9. Booking Flow
**Priority:** P0
**Description:** Step-by-step booking wizard from service selection to confirmation.
1. **Select Service** (from detail view) → choose staff (or any), date/time from slots.
2. **Review:** Service details, date, time, price breakdown, cancellation policy.
3. **Client Info:** Pre-fill from profile; name, phone, email, optional notes.
4. **Payment:** See Payment Integration.
5. **Confirmation:** Animated success screen with booking ID, add to calendar, and “Manage Booking” CTA.
**Acceptance Criteria:**
- Progress indicator shows steps (visual breadcrumb).
- Back navigation preserves previous choices.
- Slot holds for 10 minutes (temporary lock) during booking.
- If payment fails, appointment stays in PENDING for retry (5 min window).
- Confirmation triggers push notification, email, and calendar invite.

## 10. Appointment Management
**Priority:** P0
**Description:** Clients and providers can view, reschedule, and cancel appointments.
- **Client:** Upcoming & past tabs. Actions: Reschedule (triggers slot picker), Cancel (with reason), Add to calendar, Contact provider.
- **Provider:** Calendar dashboard (day/week/month). Filters by staff, service, status. Quick actions: Confirm, Start, Complete, No-Show, Cancel. Bulk actions for selected slots.
- **Cancellation Policy:** Enforced rules (free cancel up to X hours before). Refund triggers automagic if applicable.
**Acceptance Criteria:**
- Reschedule flow reuses slot engine, releases old slot.
- Cancellation reason sent to counterparty via notification.
- Appointments update in real-time across devices (WebSocket/server-sent events).
- Provider can add internal notes to appointments.

## 11. Reviews & Ratings
**Priority:** P1
**Description:** Post-service rating and reviews to build trust.
- Prompt client via push/email 1 hour after appointment ends.
- Rating: 1–5 stars + optional written review, optional photo.
- Provider can reply publicly.
- Moderation: auto-filter profanity, flagging for admin review.
**Acceptance Criteria:**
- Only completed appointments can be reviewed (one review per appointment).
- Average rating recalculated asynchronously (BullMQ job).
- Provider reply shows under review with “Business Owner” badge.
- Reported reviews hidden until admin action.

## 12. Favorites
**Priority:** P2
**Description:** Save businesses for later booking.
- Heart icon on business cards and detail pages.
- Dedicated Favorites list in profile.
- Sync across devices.
**Acceptance Criteria:**
- Optimistic add/remove with rollback on failure.
- Favorites list supports sorting by date added, rating.
- Empty state suggests popular businesses.

## 13. User Profile
**Priority:** P1
**Description:** Central hub for personal data, preferences, and history.
- **Sections:** Avatar, personal info (name, email, phone), saved payment methods, notification preferences, appointment history, favorites, settings (language, dark mode, biometrics).
- **Data Export & Delete:** GDPR/CCPA compliant account export and deletion requests.
**Acceptance Criteria:**
- Edits validate in-place; phone verification flow for new numbers.
- Notification toggles take effect immediately.
- Account deletion soft-deletes 30 days, then hard delete via job.

## 14. Payment Integration
**Priority:** P0
**Description:** Secure card processing via Stripe with support for refunds, holds, and pay-at-venue.
- **Client:** Add card (Stripe Elements/PaymentSheet). Option to pay now, pay later (deposit %), or pay at venue.
- **Provider:** Stripe Connect for direct payouts. Onboarding, dashboard for earnings.
- **Transactions:** Idempotent charge flow. Receipt emailed.
**Acceptance Criteria:**
- PCI-DSS compliance (card data never touches our server).
- Payment sheet supports Apple Pay / Google Pay.
- Refund to original payment method from admin/provider panel.
- Failed payouts logged and surfaced in admin dashboard.

## 15. Notifications
**Priority:** P1
**Description:** Multi-channel, real-time alerts for booking lifecycle, reminders, and marketing.
- **Channels:** Push (FCM/APNs), Email (SendGrid/SES), In-app (bell icon with badge).
- **Transactional Triggers:** booking confirmed, rescheduled, canceled, reminder (24h, 1h before), review request, payment confirmed.
- **Marketing (opt-in):** Promotions, abandoned booking reminders.
- **Preferences:** Granular opt-out per channel and type.
**Acceptance Criteria:**
- In-app notification center lists all notifications with unread badge.
- Deep links in notifications open correct screen.
- Rate limiting: max 1 reminder per appointment.
- Sound/badge/banner preferences respected on iOS/Android.

## 16. Provider / Business Owner Portal
**Priority:** P0
**Description:** Dedicated web + mobile interface for providers to manage business, staff, services, and appointments.
- **Dashboard:** Today’s summary (earnings, bookings, new clients). Charts for revenue, occupancy.
- **Calendar:** Full appointment management (see #10). Drag-and-drop reschedule.
- **Business Profile:** Edit details, gallery, service list (CRUD with price/duration/buffer), staff management (add/remove, assign services, set schedules).
- **Finance:** Upcoming payouts, transaction history.
- **Settings:** Opening hours, blackout dates, cancellation policy, notification templates.
**Acceptance Criteria:**
- Changes to service duration recalculate future slot capacity.
- Staff schedule conflict detection on save.
- Provider app mimics features of client app plus management; optimized for tablet.
- Role-based access: Owner vs. Staff (staff can only see calendar/assigned services).

## 17. Admin Dashboard
**Priority:** P2
**Description:** Master control panel for platform operators to oversee businesses, users, and platform health.
- **Business Management:** Verify, suspend, feature businesses. CRUD on categories.
- **User Management:** View user details, handle support tickets, issue refunds, disable accounts.
- **Content Moderation:** Review queue for reported reviews/photos.
- **Analytics:** GMV, booking volume, churn metrics, top categories.
- **Operations:** Commission rules, promo code management, global notification broadcast.
**Acceptance Criteria:**
- Admin search for business/user by name, email, ID.
- Bulk actions: approve multiple businesses.
- Role-based admin accounts (Super Admin, Moderator, Support).
- Audit log captures all admin actions.

## 18. Background Jobs (BullMQ)
**Priority:** P1
**Description:** Asynchronous job processing for non-real-time tasks to keep APIs fast.
- **Queues & Handlers:**
  - `notification`: send push/email with retry (max 3 attempts, exponential backoff).
  - `reminder`: enqueues at booking time to fire 24h/1h before.
  - `review-request`: fires 1h after appointment complete.
  - `slot-cleanup`: releases expired held slots every 5 min.
  - `rating-recalc`: updates business avg rating on new review.
  - `payout`: weekly provider payout scheduling.
  - `data-export`: generate GDPR export ZIP, email when ready.
  - `account-cleanup`: hard-delete 30-day soft-deleted accounts.
- **Monitoring:** Bull Board UI for ops.
**Acceptance Criteria:**
- Jobs are idempotent (duplicate processing safe).
- Failed jobs move to dead-letter queue with alert (Sentry/Datadog).
- Scheduled jobs persist through Redis restarts.
- Concurrency limits per worker type prevent third-party API rate limits.