# Feature Discovery

## Scope

This inventory is based on actual mobile routes/screens, backend modules, Prisma models, shared types, and roadmap/design docs. Where docs and code conflict, executable code wins.

## Completed Features

### 1. Authentication And Session Lifecycle

What it does:

- register users
- log in users
- persist tokens on device
- refresh access tokens
- fetch current user
- sign out

Where it exists:

- `apps/mobile/src/features/auth/pages/LoginScreen.tsx`
- `apps/mobile/src/features/auth/pages/RegisterScreen.tsx`
- `apps/mobile/src/application/providers/auth/AuthContext.tsx`
- `apps/mobile/src/shared/lib/api.ts`
- `apps/mobile/src/shared/lib/auth.ts`
- `apps/api/src/auth/auth.controller.ts`
- `apps/api/src/auth/auth.service.ts`

Why it is complete:

- mobile and backend are wired end-to-end
- access and refresh tokens are issued and used
- session state survives app restarts via Secure Store
- protected screens redirect when the user is missing

### 2. Core Booking Flow

What it does:

- load a real business
- choose a real service variant
- fetch availability for a selected date
- create an appointment
- navigate to bookings on success

Where it exists:

- `apps/mobile/src/features/business/pages/BusinessDetailScreen.tsx`
- `apps/mobile/src/features/booking/pages/BookingScreen.tsx`
- `apps/api/src/businesses/businesses.service.ts`
- `apps/api/src/availability/availability.service.ts`
- `apps/api/src/appointments/appointments.controller.ts`
- `apps/api/src/appointments/appointments.service.ts`

Why it is complete:

- the UI calls real backend endpoints
- slot calculation is live
- appointment writes persist through Prisma
- success returns users to the Bookings surface

### 3. My Bookings

What it does:

- show the current user's upcoming appointments
- display business name, optional staff, date/time, and status
- allow pull-to-refresh

Where it exists:

- `apps/mobile/src/features/bookings/pages/BookingsScreen.tsx`
- `apps/api/src/appointments/appointments.controller.ts`
- `apps/api/src/appointments/appointments.service.ts`
- `docs/user-roadmap/step-11-confirmation-and-reminders.md`
- `docs/user-roadmap/step-12-manage-bookings.md`

Why it is complete:

- the mobile screen reads from `/appointments/me`
- empty states and refresh state exist
- the roadmap mostly matches the implemented core behavior

### 4. Read-Only Profile Basics

What it does:

- show user name, email, and role
- allow logout

Where it exists:

- `apps/mobile/src/features/profile/pages/ProfileScreen.tsx`
- `apps/api/src/auth/auth.controller.ts`
- `apps/api/src/users/users.controller.ts`
- `apps/api/src/users/users.service.ts`
- `docs/user-roadmap/step-03-profile-basics.md`

Why it is complete:

- the UI exists and is reachable from the tab flow
- logout behavior is implemented
- the roadmap explicitly describes a read-only MVP profile

## Partially Implemented Features

### 1. Search And Discovery

What it does:

- collects address/category/time input
- shows result cards
- presents filter modals
- supports salon detail navigation in the legacy flow

Where it exists:

- `apps/mobile/src/features/search/pages/SearchScreen.tsx`
- `apps/mobile/src/features/search/pages/AddressScreen.tsx`
- `apps/mobile/src/features/search/pages/SearchResultsScreen.tsx`
- `apps/mobile/src/features/search/pages/SalonDetailsScreen.tsx`
- `apps/mobile/src/features/search/services/addressService.ts`
- `apps/mobile/src/features/search/hooks/useAddressSearch.ts`
- `apps/api/src/businesses/businesses.controller.ts`
- `apps/api/src/businesses/businesses.service.ts`

Why it is partial:

- `SearchResultsScreen` still renders `MOCK_SALONS`
- address search uses `MOCK_ADDRESSES`
- geolocation is a TODO
- filters mostly log instead of filtering backend results
- the backend business-list endpoint exists, but the main search UI does not consume it

### 2. Business Directory And Detail Browsing

What it does:

- list businesses on the backend
- show business details, categories, services, rating, and location on mobile
- let users jump into booking from a service variant

Where it exists:

- `apps/api/src/businesses/businesses.service.ts`
- `apps/mobile/src/features/business/pages/BusinessDetailScreen.tsx`
- `apps/mobile/src/features/explore/pages/ExploreScreen.tsx`

Why it is partial:

- the backend can list businesses, but the mobile app does not yet present a real live directory page
- `ExploreScreen` is mainly a CTA launcher
- the business detail screen expects a simplified `address` field that the backend does not explicitly shape

### 3. Favorites

What it does:

- locally save/unsave business IDs
- toggle a heart action from business detail

Where it exists:

- `apps/mobile/src/application/providers/favorites/FavoritesContext.tsx`
- `apps/mobile/src/features/business/pages/BusinessDetailScreen.tsx`
- `docs/user-roadmap/step-13-favorites.md`

Why it is partial:

- favorites are device-local only
- there is no favorites list screen
- there is no backend sync
- roadmap docs still say favorites are not implemented

### 4. Reviews And Ratings

What it does:

- model reviews in the database
- show aggregate rating data on the business detail page
- provide richer mock review UI in the legacy search flow

Where it exists:

- `apps/api/prisma/schema.prisma`
- `apps/mobile/src/features/business/pages/BusinessDetailScreen.tsx`
- `apps/mobile/src/features/search/components/SalonReviews.tsx`
- `docs/user-roadmap/step-14-after-appointment.md`

Why it is partial:

- there is no reviews controller/service
- there is no create/list review flow
- the live detail screen literally says "Individual reviews coming soon"

### 5. Booking Management Beyond Viewing

What it does:

- support cancellation on the backend
- show booking state in mobile

Where it exists:

- `apps/api/src/appointments/appointments.controller.ts`
- `apps/api/src/appointments/appointments.service.ts`
- `apps/mobile/src/features/bookings/pages/BookingsScreen.tsx`
- `docs/user-roadmap/step-12-manage-bookings.md`

Why it is partial:

- backend cancellation exists
- mobile provides no cancel or reschedule action
- roadmap correctly describes the current UI as read-only

### 6. Staff Selection And Confirmation Step

What it does:

- expose staff entities and staff-aware availability in the data model/backend
- provide a multi-step booking confirmation UI in the legacy mobile flow

Where it exists:

- `apps/api/prisma/schema.prisma`
- `apps/api/src/businesses/businesses.controller.ts`
- `apps/mobile/src/features/search/pages/BookingScreen.tsx`
- `apps/mobile/src/features/search/pages/BookingValidationScreen.tsx`
- `docs/user-roadmap/step-07-choose-staff.md`
- `docs/user-roadmap/step-09-confirm-details.md`

Why it is partial:

- the real booking flow does not expose staff selection
- the confirmation step is only implemented in the mock-driven legacy route

### 7. Provider-Side Business Management

What it does:

- create businesses
- create services
- create service variants

Where it exists:

- `apps/api/src/businesses/businesses.controller.ts`
- `apps/api/src/businesses/businesses.service.ts`
- `apps/api/src/services/services.controller.ts`
- `apps/api/src/services/services.service.ts`
- `docs/ARCHITECTURE.md`

Why it is partial:

- backend provider/admin APIs exist
- there is no provider/admin app surface in the repo
- `README.md` still treats `admin-web` as future

## Missing Or Inferred Features

### 1. In-App Payments, Deposits, And Refunds

What it should do:

- collect payment or deposit during booking
- track provider payment references
- support refunds

Evidence:

- `apps/api/prisma/schema.prisma` has `Payment` and `Refund`
- `docs/user-roadmap/step-10-payment-or-deposit.md`
- `docs/ARCHITECTURE.md`
- `docs/stitch_onboarding_welcome_to_bookly/payment_&_tip_integration/`

Why it is missing:

- there are no payment controllers, services, or checkout screens
- roadmap explicitly says payment is not in the MVP

### 2. Reminders And Notifications

What it should do:

- send push/email reminders
- handle post-booking communication

Evidence:

- `apps/api/prisma/schema.prisma` has `Notification`
- `docs/user-roadmap/step-11-confirmation-and-reminders.md`
- `docs/user-roadmap/step-14-after-appointment.md`

Why it is missing:

- there is no notification module, queue, worker, or mobile notification handling
- roadmap explicitly says reminders are not part of the MVP

### 3. Social Login, Onboarding, And Rich Settings

What it should do:

- support richer first-run onboarding
- support third-party sign-in
- expose account settings beyond a read-only profile

Evidence:

- `docs/stitch_onboarding_welcome_to_bookly/onboarding_-_welcome_to_bookly/`
- `docs/stitch_onboarding_welcome_to_bookly/user_sign_up_&_social_login/`
- `docs/stitch_onboarding_welcome_to_bookly/user_account_&_app_settings/`

Why it is missing:

- live code only supports email/password auth and a basic profile page

### 4. Reviews Submission, Loyalty, Messaging, And Post-Appointment Retention

What it should do:

- collect reviews
- let customers message businesses
- support loyalty or promotion flows
- offer rebooking and post-visit retention tools

Evidence:

- `apps/api/prisma/schema.prisma` has `Review` and `Promotion`
- `docs/stitch_onboarding_welcome_to_bookly/full_review_system_&_feedback/`
- `docs/stitch_onboarding_welcome_to_bookly/in-app_customer_messaging/`
- `docs/stitch_onboarding_welcome_to_bookly/enhanced_business_profile_&_loyalty/`

Why it is missing:

- none of these have active modules or live screens in the main app

### 5. Provider Backoffice

What it should do:

- manage staff
- manage availability
- view analytics/revenue
- run provider operations from a dedicated app

Evidence:

- `docs/ARCHITECTURE.md`
- `docs/stitch_onboarding_welcome_to_bookly/business_availability_settings/`
- `docs/stitch_onboarding_welcome_to_bookly/staff_&_employee_management/`
- `docs/stitch_onboarding_welcome_to_bookly/merchant_analytics_&_revenue/`

Why it is missing:

- no `admin-web` app exists in the current workspace
- no provider UI exists beyond login entry points and backend APIs

### 6. Infrastructure-Backed Platform Features

What it should do:

- queue work
- cache expensive reads
- support storage and compliance workflows

Evidence:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docker-compose.yml`

Why it is missing:

- docs mention Redis/BullMQ and future storage/compliance support
- runtime code does not currently implement those services

## Important Feature Mismatches Between Docs And Code

### Date Picker

- roadmap says the MVP has no date picker in `docs/user-roadmap/step-08-choose-date-and-time.md`
- real booking screen already offers a 14-day date selector in `apps/mobile/src/features/booking/pages/BookingScreen.tsx`

### Favorites

- roadmap says favorites are not implemented in `docs/user-roadmap/step-13-favorites.md`
- local favorites exist in `apps/mobile/src/application/providers/favorites/FavoritesContext.tsx`

### Pull-To-Refresh

- roadmap says pull-to-refresh is unavailable in `docs/user-roadmap/step-11-confirmation-and-reminders.md`
- `apps/mobile/src/features/bookings/pages/BookingsScreen.tsx` includes `RefreshControl`

## Bottom Line

The true product today is an MVP with one real end-to-end path:

- auth
- enter app
- open a business
- book an appointment
- view bookings

Everything beyond that falls into one of two categories:

- partially built but not fully connected
- documented/designed but not yet shipped

The single largest source of confusion is the coexistence of the live business/booking flow and the older search-heavy mock flow.
