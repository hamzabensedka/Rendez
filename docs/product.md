# Product Requirements Document: Planity Clone

## 1. Introduction & Vision
Planity Clone is a two-sided marketplace for beauty and wellness services. It connects customers with providers (salons, spas, barbers) to discover, book, and manage appointments. The platform supports guest browsing, map-based discovery, real-time slot calculation, payments, and dedicated portals for providers and admins.

## 2. Shared Types & Design System
**Priority: P0 | Effort: XL | Foundation**

### Core Entities
- **User**: id, email, phone, name, role (CUSTOMER, PROVIDER, ADMIN), avatar, timezone, locale, created/updated timestamps.
- **Business**: id, name, description, address (with lat/lng), phone, photos[], categories[], workingHours, ownerId, rating, totalReviews, isActive, createdAt.
- **Service**: id, businessId, name, description, durationMinutes, price, currency, category, isActive, maxParallelBookings.
- **Staff**: id, businessId, name, avatar, specialties[], schedule, absences[].
- **Booking**: id, customerId, businessId, serviceId, staffId (optional), startTime, endTime, status (PENDING, CONFIRMED, ARRIVED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW), cancellationReason, paymentStatus, totalAmount, taxAmount, tipAmount.
- **Review**: id, bookingId, customerId, businessId, rating (1-5), title, comment, photos[], replyText, createdAt.
- **Favorite**: id, customerId, businessId, createdAt.
- **Notification**: id, userId, type, title, body, data (JSON), isRead, createdAt.

### Design System
- Typography scale: 10/12/14/16/18/20/24/32px with weights 400/500/600/700.
- Color palette: Primary (#FF6B35), Secondary (#004E89), Success (#20BF55), Warning (#F4A261), Error (#E63946), Neutrals (White to Black 9-stops).
- Spacing: 4/8/12/16/20/24/32/48/64px.
- Border radius: 4/8/12/16px, full for pills/avatars.
- Shadows: 3 levels (sm, md, lg).
- Components: Button (primary, secondary, outline, ghost; 3 sizes), Input, Card, Badge, Modal, Toast, Avatar, StarRating, Skeleton, Chip.

### Acceptance Criteria
- All UI must use design tokens from the system.
- Primary color passes WCAG 2.1 AA contrast ratio (4.5:1 for text).
- All entities validated with Zod schemas shared frontend/backend.
- Backend returns consistent API envelope: `{ success: boolean, data?: T, error?: { code: string, message: string }, meta?: { page, limit, total } }`.

## 3. User Authentication
**Priority: P0 | Effort: L**

### Description
Users register/login via email+password or social providers (Google, Apple). JWT access tokens (15min) and refresh tokens (7d) stored securely. Role-based access control guards endpoints.

### User Stories
- As a new user, I can sign up with email/password so I can book services.
- As a user, I can log in with Google/Apple to skip manual registration.
- As a user, I can reset my password via email link when forgotten.
- As a provider, I log in with the same flow but see a different dashboard.
- As an admin, I sign in from a dedicated admin login page.

### Acceptance Criteria
- Registration validates unique email, password min 8 chars, 1 uppercase, 1 number.
- Email verification link sent; accounts unverified cannot book (configurable).
- Login returns access + refresh tokens; refresh endpoint reissues access token.
- Logout invalidates refresh token server-side (blacklist).
- Protected routes/tRPC procedures check JWT validity and user role.
- Social login creates or links account by email; if email exists prompt link.
- Account deletion soft-deletes user data per GDPR; confirm via email.
- Rate limiting: 5 failed login attempts per email per 15min triggers temporary lock.

## 4. Guest Browse & Explore
**Priority: P0 | Effort: M**

### Description
Unauthenticated users can browse businesses, view details, and check availability. Booking action triggers sign-up/login modal (with redirect back).

### User Stories
- As a guest, I can browse beauty salons near me without creating an account.
- As a guest, I can see service details and realistic time slots.
- As a guest, tapping "Book" prompts me to sign up/login, then returns me to checkout.

### Acceptance Criteria
- Homepage loads featured businesses (curated or top-rated) for guests.
- Search and map views fully accessible without auth.
- Business detail page shows all public info including reviews and services.
- Slot computation API accessible without auth (read-only).
- "Book" button on service or slot opens login modal; after auth user lands on booking confirmation page with prefilled data.
- Session maintained; navigating away preserves selected service/slot for 30min in localStorage.

## 5. Business Search & Discovery
**Priority: P0 | Effort: L**

### Description
Full-text search with filters, sorting, and auto-suggest. Results display business cards with key info.

### User Stories
- As a user, I can search by business name, category, or keywords.
- As a user, I can filter by location, rating, price range, availability, and category.
- As a user, I can sort results by relevance, rating, distance, or price.

### Acceptance Criteria
- Search input with 300ms debounce; shows suggestions dropdown (min 2 chars).
- Filters: distance radius (1/5/10/25km), rating (>=3.5, >=4, >=4.5), price ($/$$/$$$), open now toggle.
- Results as infinite scroll list with BusinessCard (image, name, rating, category, distance, first available slot).
- Empty state with illustration and suggestion to broaden filters.
- Search uses PostgreSQL full-text search (tsvector) with trigram extension for fuzzy matching.
- Location filter uses PostGIS/ST_DWithin on lat/lng.
- Results respect pagination (20 per page).
- Recently viewed businesses stored in cookies/localStorage for quick access.

## 6. Map-based Search
**Priority: P1 | Effort: L**

### Description
Interactive map (Google Maps or Mapbox) showing business locations as pins. Viewport-driven search updates results as user pans/zooms.

### User Stories
- As a user, I can see salons on a map around my current location.
- As a user, I can tap a pin to see a preview card and navigate to the business page.

### Acceptance Criteria
- Map loads centered on user's geolocation (with permission) or default city center.
- Pins color-coded by category (optional) or show rating badge.
- Clustering for dense areas (>5 pins overlapping).
- Tapping pin shows mini card with name, rating, next available slot; "View details" button opens business page.
- Moving map triggers debounced (500ms) query for businesses within viewport bounds.
- Map and list views are synced; toggle between them preserves filters.
- Fallback to IP-based location if geolocation denied.

## 7. Business Detail View
**Priority: P0 | Effort: L**

### Description
Comprehensive business profile with all info needed to make a booking decision.

### User Stories
- As a user, I can see all details about a salon including photos, services, staff, and reviews.
- As a user, I can favorite a business from this page.

### Acceptance Criteria
- Hero image carousel (swipeable).
- Sections: Info (name, rating, address w/ map thumbnail, phone, hours), Services (categorized list with price/duration), Staff (grid of member cards with photo), Reviews (paginated, with rating summary).
- Working hours component highlights "Open now" / "Closes at X".
- Share button generates deep link.
- Favorite heart toggle with optimistic UI update.
- CTA button "Book" fixed at bottom; anchors to services section or opens category picker.
- Address opens map; phone opens dialer (native).
- Loading state: skeleton placeholders matching layout.
- Error state: retry button, fallback if business not found.

## 8. Service Categories
**Priority: P1 | Effort: M**

### Description
Hierarchical category system to organize services. Businesses can assign multiple categories. Users browse by category.

### User Stories
- As a user, I can explore by top-level categories to find relevant businesses.
- As a provider, I can categorize my services for better discovery.

### Categories (seed data)
- Hair (Women's Cut, Men's Cut, Color, Blowout, Extensions)
- Nails (Manicure, Pedicure, Gel, Acrylic)
- Facial & Skin (Facial, Peel, Microdermabrasion)
- Massage (Swedish, Deep Tissue, Hot Stone)
- Makeup (Bridal, Event, Lesson)
- Body (Waxing, Threading, Laser Hair Removal)
- Barbering (Beard Trim, Hot Towel Shave)
- Spa Packages (Couples, Half-day, Full-day)

### Acceptance Criteria
- Category browse page: grid of category cards with icon and name.
- Tapping category navigates to search results filtered by that category.
- Subcategories shown as chips for further refinement.
- Admin can CRUD categories and subcategories via admin dashboard.
- Services must be linked to at least one category.
- Popular categories surfaced dynamically based on booking volume.

## 9. Booking Flow
**Priority: P0 | Effort: XL**

### Description
Multi-step booking wizard: select service -> date/time -> staff (optional) -> confirm -> pay. Designed for minimal friction and high conversion.

### Steps
1. **Service Selection**: Within business page or direct link. User picks service(s).
2. **Date & Time**: Calendar picker showing available dates. Time slots compute real-time (see §10). Show only available slots.
3. **Staff Selection**: (If business has staff choice) Auto-assign first available or let user pick; show staff photo/name.
4. **Review & Confirm**: Summary of booking, total price, cancellation policy. Promo code field (optional).
5. **Payment**: Collect or use saved payment method. Handle 3D Secure.
6. **Confirmation**: Success screen with booking details, add to calendar, share.

### User Stories
- As a user, I can book a service in under 2 minutes with minimal steps.
- As a user, I see only real, bookable time slots to avoid disappointment.
- As a user, I receive immediate confirmation and calendar invite.

### Acceptance Criteria
- Progress indicator (steps 1-4/5/6) at top.
- Back navigation allowed in all steps except after payment.
- Slot selection shows calendar with disabled days (no availability) and highlight for days with slots.
- Time picker scrolls to first available time; each slot shows start time, duration implied.
- Staff step skippable if business auto-assigns.
- Confirmation step shows non-editable summary with prominent "Confirm & Pay" button.
- Cancellation policy linked and must be acknowledged (checkbox) for new users.
- Promo codes validated server-side with error/success messages.
- Double-booking prevented via database constraints and optimistic lock checks.
- After payment, booking status = CONFIRMED; push notification sent to user and provider.
- If payment fails, booking status = PENDING payment and user can retry within 15min.
- Deep linking: `/{businessSlug}/book?service={id}` starts flow at step 2.

## 10. Availability & Slot Computation
**Priority: P0 | Effort: XL**

### Description
Real-time computation of bookable slots considering business hours, service durations, staff schedules, existing bookings, and time buffers. Cached for performance.

### User Stories
- As a user, I see only slots I can actually book.
- As a provider, I can set complex schedules and have them respected.

### Rules
- Business has default working hours per day (e.g., Mon-Fri 9:00-18:00). Can override per date.
- Staff has individual schedules that may differ; absences block slots.
- Service duration determines slot interval. Buffer time (configurable 0-30min) before/after.
- Max parallel bookings per slot limited by `Staff.maxParallel` or business total capacity.
- Slots computed for next N days (configurable, default 30).
- Past slots and slots within cutoff time (e.g., 1h from now) excluded.
- Holidays/special closures as date exceptions.

### Algorithm (Simplified)
1. Fetch business working hours for target date.
2. For each staff member working, generate potential start times at 15-min intervals.
3. Check each potential start: does staff have conflicting booking? Is slot within hours? Is buffer honored?
4. Aggregate unique start times across all staff.
5. Cache result in Redis with key `slots:{businessId}:{date}:{serviceId}` and TTL based on revalidation.

### Acceptance Criteria
- Slot API returns array of ISO datetime strings for given business/service/date.
- Response time <200ms p95 for cached slots.
- Real-time invalidation on booking creation/cancellation.
- Handle timezone correctly: all times stored UTC, displayed in business local time.
- Provider can define different hours per day, special dates.
- Bookings spanning midnight supported (rare but possible).

## 11. Appointment Management
**Priority: P0 | Effort: L**

### Description
Users can view upcoming and past appointments, reschedule, cancel, and rebook.

### User Stories
- As a user, I can see all my bookings in one place.
- As a user, I can cancel a booking with a clear policy.
- As a user, I can reschedule to a new time if available.

### Acceptance Criteria
- List segmented: Upcoming (soonest first) and Past (latest first).
- Upcoming card shows: business name/photo, service name, date/time, staff (if any), status badge with color.
- Upcoming actions: Reschedule (valid until X hours before, policy-defined), Cancel (with reason picker), Add to Calendar, Get Directions.
- Reschedule flow: re-opens date/time picker for same service; on confirm updates booking and cancels old slot.
- Cancellation: confirm dialog warns of potential fees; if within free cancel window, full refund. Otherwise, charge fee per business policy.
- Past bookings: show review button if not reviewed; "Rebook" shortcut.
- Swipe-to-refresh and empty states.
- Booking detail deep view with full info and cancel/reschedule buttons if applicable.
- Push notification 24h and 1h before appointment.

## 12. Favorites
**Priority: P2 | Effort: S**

### Description
Users save businesses to a favorites list for quick access.

### User Stories
- As a user, I can save salons I like and quickly book from my favorites.

### Acceptance Criteria
- Favorite toggle on business card and detail page; optimistically updates UI.
- Favorites accessible from profile/tab; grid list with BusinessCard.
- Empty state: "Explore businesses" CTA.
- Sync favorites across user devices (server-side).
- Unfavoriting removes from list with undo option (toast, 5s).

## 13. User Profile
**Priority: P1 | Effort: M**

### Description
Central place for user's personal information, preferences, and settings.

### User Stories
- As a user, I can manage my personal data and communication preferences.
- As a user, I can save payment methods for faster checkout.

### Acceptance Criteria
- Sections: Personal Info (name, email, phone, avatar), Payment Methods (list + add), Notification Preferences (push, email, SMS toggles), Booking History (link).
- Edit personal info with validation.
- Avatar upload with crop tool; max 2MB.
- Payment methods securely tokenized via Stripe; show last4, exp, brand.
- Delete account option with GDPR-compliant data purge.
- Support link (FAQ/chat).
- App version and build info.

## 14. Reviews & Ratings
**Priority: P1 | Effort: M**

### Description
Customers can leave star ratings and written reviews after completed appointments. Reviews aggregate into business average rating.

### User Stories
- As a user, I can rate and review services I've received.
- As a user, I can read honest reviews from other customers.

### Acceptance Criteria
- Review prompt appears after booking status = COMPLETED; also accessible from past bookings.
- Rating: 1-5 stars with tap; written review min 10 chars, optional photo upload (max 3, 5MB each).
- Business rating updates as average of all reviews (real-time or triggered update).
- Review display on business page: rating distribution bars, most recent/helpful reviews, sort by date or rating.
- Provider can reply to reviews (one reply per review).
- Review flagged functionality (reported by provider/admin) for moderation.
- Duplicate review prevention: one review per booking.
- Anonymous reviews not allowed; reviewer name and avatar shown.

## 15. Payment Integration
**Priority: P0 | Effort: L**

### Description
Secure payment processing via Stripe. Supports card payments, saved payment methods, and platform fee splitting.

### User Stories
- As a user, I can pay securely with my credit card.
- As a user, I can save cards for future use.
- As a provider, I receive payouts minus platform fees.

### Acceptance Criteria
- PCI-DSS compliance via Stripe Elements; card data never touches backend.
- Payment flow: create PaymentIntent on server with amount, currency; client confirms with Stripe; webhook updates booking status.
- Support 3D Secure / SCA.
- Saved cards (SetupIntent) with default selection.
- Receipt emailed after successful payment.
- Refund handling: full or partial via Stripe; triggered by cancellation policy logic.
- Platform fee (e.g., 15%) configured; provider receives remainder via Stripe Connect split transfers.
- Webhook handler processes: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`.
- Idempotency keys for all Stripe API calls.

## 16. Notifications
**Priority: P1 | Effort: L**

### Description
Multi-channel notification system: push (mobile/web), email, in-app. Triggered by booking events, reminders, promotions.

### User Stories
- As a user, I get booking confirmations and reminders.
- As a provider, I get notified of new bookings and cancellations.

### Notification Types
- Customer: Booking Confirmed, Booking Reminder (24h, 1h), Booking Cancelled, Request Review, Promo Offer.
- Provider: New Booking, Booking Cancelled, Payout Sent, New Review.

### Acceptance Criteria
- Notifications stored in DB and delivered in-app via polling/WebSockets.
- In-app notification bell with unread badge, click to mark read, list with infinite scroll.
- Push notifications via Firebase Cloud Messaging (FCM) with device token registration.
- Email via transactional service (SendGrid/Postmark) with responsive templates.
- Preference toggles respected: per channel, per notification type.
- Deep linking from notification to relevant screen (booking detail, business page).
- Failed push/email logged and retried up to 3 times.
- Admin can send promotional pushes (targeted/all).

## 17. Provider / Business Owner Portal
**Priority: P0 | Effort: XL**

### Description
Separate web dashboard for business owners to manage profile, services, staff, bookings, and view analytics.

### User Stories
- As a provider, I can register my business and set up services.
- As a provider, I can manage my daily calendar and accept/reject bookings.
- As a provider, I can see earnings and customer stats.

### Sections
- **Dashboard Home**: Today's summary (bookings count, revenue), upcoming bookings list, weekly chart.
- **Calendar**: Day/week view with booking cards; drag to reschedule; click for detail modal.
- **Bookings**: List with filters (date, status, service, staff). Actions: confirm (if manual approval), cancel, mark no-show, complete.
- **Services**: CRUD list of services with reordering.
- **Staff**: Add/edit/remove staff members; set schedules and service assignments.
- **Business Profile**: Edit info, photos, working hours, cancellation policy.
- **Reviews**: View and reply to reviews.
- **Earnings**: Payout history, projected earnings chart, export CSV.
- **Settings**: Notification prefs, booking preferences (auto-confirm, buffer time, cutoff).

### Acceptance Criteria
- Provider onboarding: multi-step form (business info, services, hours). Admin approval optional (toggle).
- Calendar uses real-time slot data; double-book warning if manual override attempted.
- Booking status management respects lifecycle: PENDING -> CONFIRMED/CANCELLED; CONFIRMED -> ARRIVED -> IN_PROGRESS -> COMPLETED.
- Bulk date exception setting (holidays, closures).
- Staff schedule editor: visual weekly grid, per-day toggles, time ranges, add exception dates.
- All changes to services/staff/schedule trigger slot recomputation for affected dates.
- Provider mobile responsive; can manage on-the-go.

## 18. Admin Dashboard
**Priority: P1 | Effort: L**

### Description
Super admin panel for platform management: users, businesses, bookings, categories, reviews moderation, and system config.

### Sections
- **Overview**: Platform metrics (total bookings, GMV, active users/businesses, signups chart).
- **Businesses**: List with search, filter by status; approve/reject/suspend; impersonation login.
- **Users**: List with search; view details; disable accounts.
- **Bookings**: Search by ID/business/user; view details; force refund.
- **Reviews**: Moderation queue for flagged reviews; approve/reject flags.
- **Categories**: CRUD with icon upload.
- **Promotions**: Create promo codes (percent/flat, usage limits, validity).
- **System Config**: Global parameters (platform fee %, booking cutoff minutes, max future days, cancellation fee defaults).
- **Audit Log**: Immutable log of admin actions.

### Acceptance Criteria
- Only users with role=ADMIN can access.
- Dashboard loads aggregated analytics (via pre-computed or efficient queries).
- Business approval workflow: PENDING -> ACTIVE/REJECTED with notification to owner.
- Impersonation generates temporary token; all actions logged.
- Promo code creation with validation rules.
- Audit log captures admin ID, action, entity affected, timestamp, IP.

## 19. Background Jobs (BullMQ)
**Priority: P0 | Effort: M**

### Description
Asynchronous job processing for non-blocking operations: notifications, slot regeneration, payment webhooks, scheduled tasks.

### Job Queues
- **notifications**: Send push/email/SMS. Consumer retries with backoff.
- **slot-regen**: Regenerate slots for a business/date after changes. Debounced.
- **payment-webhooks**: Process Stripe events idempotently.
- **reminders**: Scheduled jobs for booking reminders (24h, 1h); polling or delayed jobs.
- **data-cleanup**: Soft-deleted accounts purge after 30 days; expired tokens cleanup.

### User Stories (Internal)
- As a system, I need to send reminders reliably without delaying user responses.
- As a system, I need to regenerate availability quickly when schedules change.

### Acceptance Criteria
- Each queue has configurable concurrency; Redis connection health monitored.
- Failed jobs logged with stack trace; retry strategy (exponential backoff, max 5 attempts).
- Scheduled reminders use BullMQ delayed jobs.
- Slot regeneration triggered on: service CRUD, staff/schedule change, booking create/cancel. Uses debounce (5min per business+date combo) to batch.
- Payment webhook handler acknowledges immediately, processes async.
- BullBoard or similar UI for monitoring queues (admin only).
- Graceful shutdown handlers for worker processes.

## 20. Non-Functional Requirements
- **Performance**: Page load <2s on 4G; API responses <200ms p95 for cached endpoints.
- **Security**: HTTPS; input sanitization; rate limiting on auth/payment endpoints; CORS; SQL injection prevention via ORM; XSS protection headers.
- **Scalability**: Stateless API services; horizontal scaling; database read replicas for heavy read endpoints.
- **Observability**: Structured logging (JSON); error tracking (Sentry); performance monitoring; health check endpoints.
- **Testing**: Unit tests for business logic (slot computation, pricing); integration tests for API flows; E2E tests for critical paths (booking).
- **Accessibility**: Semantic HTML; ARIA labels; keyboard navigation; screen-reader friendly.

## 21. Success Metrics
- Booking conversion rate: users who start booking flow / users who complete.
- Guest-to-registration conversion: guests who tap "Book" -> complete signup.
- Provider retention: providers active after 30/90 days.
- Platform GMV (Gross Merchandise Volume).
- Average booking lead time.
- Notification delivery rate (push >95%, email >98%).

---
**Total Feature Count**: 18 | **P0**: 11 | **P1**: 5 | **P2**: 1 | **Foundation (Design System)**: 1