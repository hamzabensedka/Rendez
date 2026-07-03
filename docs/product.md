# Planity Clone — Product Specification

## Document Metadata
- **Product Owner:** Alex
- **Version:** 1.0
- **Status:** Draft for Development
- **Target Platform:** iOS & Android (React Native), Web (React)
- **Backend:** Node.js with BullMQ for background jobs

---

## 1. Product Overview

Planity Clone is a beauty & wellness booking platform connecting customers with salons, barbers, spas, and wellness providers. Customers discover businesses, browse services, book appointments, and manage their visits. Business owners manage their catalog, staff, availability, and appointments through a dedicated portal. An admin dashboard provides platform oversight.

### 1.1 Target Users
- **End Customers:** Individuals seeking beauty/wellness services
- **Business Owners / Providers:** Salon owners, barbers, spa managers, independent professionals
- **Platform Admins:** Planity operational staff

### 1.2 Core Value Proposition
- For customers: One tap booking across thousands of salons with real-time availability
- For businesses: Turnkey booking engine, client management, and business analytics
- For admins: Full platform governance, dispute resolution, and growth tools

---

## 2. Shared Types & Design System

**Priority:** P0 (Foundation)

### 2.1 Description
Define all shared TypeScript types, enums, interfaces, and a design token system consumed by all frontend and backend services. This ensures type safety and visual consistency across the entire product.

### 2.2 Core Types

**Users & Roles:**
- `UserRole`: `CUSTOMER` | `PROVIDER` | `ADMIN`
- `User`: id, email, phone, firstName, lastName, avatarUrl, role, createdAt, updatedAt
- `ProviderProfile`: businessName, description, address (street, city, zip, lat, lng), phone, categoryIds, photos[], openingHours, staffMembers[]

**Business & Services:**
- `Business`: id, providerUserId, name, description, categoryIds, address, coordinates, rating, reviewCount, photos, isVerified, isActive
- `ServiceCategory`: id, name, icon, parentId
- `Service`: id, businessId, categoryId, name, description, durationMinutes, price, currency, maxParallelBookings, isActive
- `StaffMember`: id, businessId, name, title, photoUrl, serviceIds[], isActive

**Booking & Appointments:**
- `BookingStatus`: `PENDING` | `CONFIRMED` | `IN_PROGRESS` | `COMPLETED` | `CANCELLED` | `NO_SHOW`
- `Appointment`: id, customerUserId, businessId, staffMemberId, serviceIds[], startDateTime, endDateTime, status, totalPrice, notes, createdAt, updatedAt
- `Slot`: startTime, endTime, isAvailable

**Reviews & Payments:**
- `Review`: id, appointmentId, customerUserId, businessId, rating (1-5), comment, photos[], createdAt
- `Payment`: id, appointmentId, amount, currency, status (`PENDING` | `AUTHORIZED` | `CAPTURED` | `REFUNDED` | `FAILED`), method, transactionId, createdAt

**Notifications:**
- `NotificationType`: `BOOKING_CONFIRMED` | `BOOKING_CANCELLED` | `REMINDER_24H` | `REMINDER_1H` | `REVIEW_REQUEST` | `PROMOTION` | `PAYMENT_RECEIPT`
- `Notification`: id, userId, type, title, body, data (JSON), isRead, createdAt

### 2.3 Design Tokens
- Colors: Primary (#6C5CE7), Secondary (#00B894), Error (#D63031), Neutral scale
- Typography: Font family (Inter), scale (12px–32px), weights (400, 500, 600, 700)
- Spacing: 4px grid system (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)
- Border Radius: 4px, 8px, 12px, 16px, 24px, circular
- Shadows: 3 elevation levels
- Components: Button (primary, secondary, outline, ghost), Input, Card, Badge, Avatar, Modal, BottomSheet, Toast, Skeleton

### 2.4 Acceptance Criteria
- All types are exported from a shared `@planity/types` package
- Design tokens exported from `@planity/design-tokens` and consumed via Tailwind config or StyleDictionary
- Every feature implementation references these shared types; no duplication across services
- Component library (shadcn/ui based) implements all shared components with tokens

---

## 3. User Authentication

**Priority:** P0

### 3.1 Description
Multi-role authentication system supporting email/password and social login for customers, with separate onboarding for providers. JWT-based session management with refresh tokens.

### 3.2 Features
- **Customer Sign Up / Login:** Email + password registration with email verification. Social login via Google and Apple. Phone number OTP option.
- **Provider Registration:** Multi-step onboarding. Email/password registration, then business profile creation (name, address, category selection, photo upload). Admin approval required before business goes live.
- **Admin Login:** Email/password only, MFA via authenticator app (TOTP).
- **Password Reset:** Forgot password flow with email link (expires 15 min).
- **Session Management:** Access token (15 min TTL) + refresh token (7 days TTL, stored in httpOnly cookie or secure storage). Token rotation on refresh.
- **Role-Based Access:** Middleware guards on all API routes. Customer routes, Provider routes, Admin routes strictly separated.

### 3.3 Acceptance Criteria
- Customer can register, verify email, and log in within 2 minutes
- Social login completes in under 5 seconds
- Provider onboarding flow captures all required business fields
- Admin cannot access due to pending verification
- Token refresh is transparent to user
- Session persists across app restarts
- Invalid/expired tokens return 401 with clear error
- Rate limiting on login (5 attempts per minute per IP)

---

## 4. Guest Browse & Explore

**Priority:** P0

### 4.1 Description
Unauthenticated users can browse businesses, search, and view business details. Booking triggers the authentication flow at the appropriate step (postponed auth).

### 4.2 Features
- Full access to home feed, search, map view, and business detail pages
- Category browsing and filtering without login
- "Book Now" button on business page prompts login/signup modal
- After successful auth, user returns to the exact booking flow step they were on
- Local favorites stored in AsyncStorage/LocalStorage for guests and synced to account upon login

### 4.3 Acceptance Criteria
- Guest can browse all public content without any login prompt
- Search and filters work identically for guests and logged-in users
- Auth modal appears only when tapping "Book" or "Favorite"
- Post-auth redirect preserves booking context (selected service, staff, date, time)
- Guest favorites merge with existing account favorites on login (no duplicates)

---

## 5. Business Search & Discovery

**Priority:** P0

### 5.1 Description
Full-text and filtered search across businesses and services. Supports autocomplete, recent searches, and personalized suggestions.

### 5.2 Features
- **Search Bar:** Persistent search bar on home screen with autocomplete (debounced, 300ms)
- **Search Scope:** Business names, service names, categories, city/neighborhood names
- **Filters:** Category, price range, rating (4+ stars), distance, availability (today, this week), amenities (parking, WiFi, wheelchair accessible)
- **Sort Options:** Relevance, rating (highest), distance (nearest), price (low/high), most reviewed
- **Recent Searches:** Stored locally and associated with user account if logged in
- **Trending Searches:** Based on aggregate search data (anonymized)
- **Search Results:** Card list with business photo, name, rating, distance, next available slot, and favorite button
- **Empty State:** "No results found" with suggestions to broaden filters
- **Loading State:** Skeleton cards with shimmer animation

### 5.3 Acceptance Criteria
- Search returns results within 500ms for authenticated users, 800ms for guests
- Autocomplete shows suggestions after 2+ characters
- Filters apply and update results without full page reload
- Sort order persists within a session
- Distance calculation uses stored business coordinates vs user's current or selected location
- Search analytics events are tracked (impression, click, conversion) for admin dashboard

---

## 6. Map-based Search

**Priority:** P1

### 6.1 Description
Interactive map view for discovering businesses geographically. Users can move the map to search within a bounding box with clustering for dense areas.

### 6.2 Features
- **Map Toggle:** Switch between list view and map view on search results
- **Map Rendering:** Google Maps or Mapbox with custom business markers (category icons)
- **Clustering:** Marker clustering above zoom level 13
- **Marker Info Window:** Tap marker shows business name, rating, distance, next available slot, photo thumbnail
- **Search Here:** "Search this area" button that queries businesses within current map bounds
- **User Location:** "My Location" button, with permission request if not granted
- **Radius Filter:** Adjustable radius slider (1km, 3km, 5km, 10km, 25km)
- **Full Map View:** Tapping a business in map view navigates to business detail

### 6.3 Acceptance Criteria
- Map loads with clustered markers within 2 seconds
- Moving the map and tapping "Search this area" refreshes results within 1 second
- User location button works with both foreground and approximate location permissions
- Map view and list view share the same filter/sort state
- Markers are color-coded by category

---

## 7. Service Categories

**Priority:** P0

### 7.1 Description
Hierarchical category system for organizing businesses and services. Categories are managed by admins and displayed in the browse experience.

### 7.2 Category Hierarchy (Default Seed)
- **Hair** (Women's Cut, Men's Cut, Color, Blow Dry, Extensions, Perm/Straightening)
- **Nails** (Manicure, Pedicure, Gel, Acrylic, Nail Art)
- **Skin & Face** (Facial, Microdermabrasion, Peels, Dermaplaning)
- **Massage** (Swedish, Deep Tissue, Hot Stone, Thai, Sports, Prenatal)
- **Hair Removal** (Waxing, Sugaring, Laser, Threading)
- **Makeup** (Bridal, Event, Everyday, Airbrush)
- **Lashes & Brows** (Lash Lift, Extensions, Tinting, Microblading, Threading/Wax)
- **Men's Grooming** (Barber Cut, Beard Trim, Shave, Hair Color)

### 7.3 Features
- **Category Grid on Home:** Visual grid with icons, top 8 categories, "See All" link
- **Category Deep Link:** Tap category opens filtered business list with subcategory chips
- **Multi-Select:** Users can filter by multiple subcategories
- **Admin CRUD:** Admins can add, edit, deactivate, and reorder categories
- **Category Images:** Each category has a default image and icon

### 7.4 Acceptance Criteria
- Categories load on home screen within 300ms (cached)
- Subcategory filter chips update results within 500ms
- Admin changes to categories reflect in the app within 60 seconds (cache invalidation)
- Businesses can be associated with up to 5 categories

---

## 8. Business Detail View

**Priority:** P0

### 8.1 Description
Comprehensive business profile page showcasing all information needed for a customer to decide and book.

### 8.2 Page Structure
- **Photo Gallery:** Horizontal scrollable, tap for fullscreen viewer, first photo is hero
- **Business Info Header:** Name, average rating (star display + numeric), review count, address, distance, favorite button (heart)
- **Quick Info Chips:** Open now / Closed, price level ($-$$$), average duration, parking icon if available
- **Services Tab (default):** Grouped by category, each service shows name, duration, price. "Book" button per service. Expandable sections.
- **Staff Tab:** Horizontal scrollable staff cards with photo, name, title, and specialties
- **Reviews Tab:** Rating distribution bar chart, review cards with photo/name/date/rating/comment, "Write a Review" button (only for users with completed appointments), load more pagination
- **Info Tab:** Description, address with map thumbnail, phone (tap to call), opening hours (collapsed by day, today expanded), amenities list, social links
- **Sticky Bottom Bar:** "Book Now" button always visible, shows starting price
- **Share Button:** Native share sheet with deep link to business

### 8.3 Acceptance Criteria
- Page renders hero section within 800ms
- Services load with prices and durations clearly displayed
- Photo gallery supports swipe gestures and pinch-to-zoom
- "Open Now" indicator is accurate based on business timezone and current day/time
- Review pagination loads 10 reviews at a time
- Tapping phone number on mobile opens dialer
- Tapping address opens maps app with directions
- Favorite toggle updates immediately with optimistic UI

---

## 9. Booking Flow

**Priority:** P0 (Highest Critical Path)

### 9.1 Description
Step-by-step booking wizard from service selection to confirmation. Optimized for minimum friction.

### 9.2 Steps
**Step 1 — Select Service(s):** User can select one or multiple services from the business catalog. Multi-select with checkboxes. Real-time total price and duration updates at the bottom.

**Step 2 — Select Staff (Optional):** "Any Available" default. Staff cards show photo, name, title. Selecting a staff member filters availability to only their calendar.

**Step 3 — Select Date & Time:** Interactive calendar (shows days with availability dots). Time slots displayed in a scrollable list, grouped by morning/afternoon/evening. Unavailable slots are grayed out. "Next Available" quick-select button jumps to the earliest open slot.

**Step 4 — Review & Confirm:** Summary card showing business name, service(s) with prices, staff name, date, time, duration, total price. Optional notes text field (max 500 chars). "Confirm & Pay" CTA button.

**Step 5 — Payment:** (See Payment Integration, §14) Stripe PaymentSheet or stored card selection. Upon success, navigate to confirmation screen.

**Step 6 — Confirmation:** Success animation, appointment summary, "Add to Calendar" button, "View My Appointments" button. Auto-trigger confirmation push notification.

### 9.3 Edge Cases
- Selected slot becomes unavailable during booking flow: Show "Sorry, this slot was just booked" toast, auto-return to Step 3 with next available pre-selected
- Service duration overruns business hours: Truncate available end times accordingly
- Multiple services with different durations: Combined duration + buffer minutes between services
- Network failure during payment: Idempotency check, retry logic, clear error message
- User navigates back: Preserve selections per step, allow back navigation without data loss

### 9.4 Acceptance Criteria
- Complete booking flow takes under 90 seconds for a returning user
- Each step transition animates smoothly (under 200ms)
- Total price and duration update in real time as services are added/removed
- Calendar correctly disables dates where no slots are available
- Slot selection is optimistic with server-side verification on confirm
- If slot conflict detected, user sees a friendly error and is returned to date/time selection
- Confirmation page includes all appointment details
- Booking analytics event is tracked at each step for funnel analysis

---

## 10. Appointment Management

**Priority:** P0

### 10.1 Description
Customers can view, manage, reschedule, and cancel their upcoming and past appointments. Providers can manage all appointments for their business.

### 10.2 Customer View
- **Upcoming Tab:** List of future appointments sorted by date ascending. Each card shows business name, service(s), date, time, staff, status badge. Actions: Cancel, Reschedule (opens modified booking flow), Add to Calendar, Get Directions, Contact Business (in-app chat placeholder or phone).
- **Past Tab:** List of completed/cancelled appointments. Each card shows same info plus review status. Action: Write Review (if completed and not yet reviewed), Book Again (re-opens booking flow with same business/services pre-selected).
- **Appointment Detail:** Full details view with timeline status, map of business location, staff info, price breakdown, payment receipt link.

### 10.3 Cancellation Policy
- Free cancellation up to 24 hours before appointment
- Late cancellation (within 24h): Provider may charge cancellation fee (configurable per business)
- No-show: Provider may charge full service fee
- Cancellation reason survey (optional): "Change of plans", "Found another provider", "Schedule conflict", "Other"

### 10.4 Rescheduling
- User taps "Reschedule" on an upcoming appointment
- Enters modified booking flow (same business, same services, same staff pre-selected)
- Selects new date/time, confirms
- Old slot is released, new slot is reserved
- No additional payment unless price delta exists

### 10.5 Provider View (within Provider Portal)
- **Calendar View:** Day/week/month calendar showing all appointments with color coding by staff member
- **Today View:** Quick glance at today's schedule with time slots and client names
- **Appointment Actions:** Confirm pending appointments, mark as in-progress, mark complete, cancel with reason, record no-show
- **Client History:** Tap client name to see past visits at this business
- **Waitlist:** If slot is full, customers can join waitlist; provider can promote from waitlist

### 10.6 Acceptance Criteria
- Upcoming appointments load within 500ms
- Cancellation updates slot availability immediately (within 1 second)
- Rescheduling preserves all selections and only requires new date/time
- Provider calendar syncs in real-time across all devices and staff
- Past appointment list supports infinite scroll
- "Book Again" works with pre-filled service and business
- Cancellation reason is stored and aggregated for provider analytics

---

## 11. Availability & Slot Computation

**Priority:** P0 (Critical Backend)

### 11.1 Description
Compute available appointment slots for a given business, service, staff combination, considering business hours, staff schedules, existing bookings, breaks, and buffer times.

### 11.2 Slot Computation Logic
- **Inputs:** businessId, serviceIds[], staffMemberId (optional), date, location timezone
- **Business Hours:** Per-day opening/closing times, special holiday hours override
- **Staff Schedule:** Working hours per staff member (subset of business hours), days off
- **Service Duration:** Sum of durations for selected services + buffer minutes between services (default 5 min, configurable)
- **Existing Bookings:** Subtract occupied time blocks from availability
- **Break Times:** Staff breaks (configurable per staff, e.g., 12:00–12:30)
- **Slot Granularity:** 15-minute increments. A service lasting 45 minutes can start at :00, :15, :30, :45
- **Max Advance Booking:** Configurable per business (default 30 days, max 90 days)
- **Min Advance Booking:** Configurable (default 1 hour, can be 0 for walk-in businesses)
- **Parallel Bookings:** If maxParallelBookings > 1, multiple bookings can overlap on same staff (e.g., color processing while cutting)

### 11.3 Implementation Notes
- Slot computation is done server-side via a dedicated function
- Results are cached in Redis with invalidation on any booking create/update/cancel for that business+date
- API returns available slots as an array of `{ startTime, endTime }` objects
- Frontend displays grouped by time of day with available/unavailable visual distinction

### 11.4 Acceptance Criteria
- Slot computation for a single day completes within 300ms
- Cache hit rate > 90% for repeated queries on same business+date
- Cache invalidates within 1 second of any booking change
- Correctly handles DST transitions based on business timezone
- Slots spanning business close are excluded (e.g., 45 min service cannot start 30 min before close)
- Staff-specific queries correctly filter to only that staff's availability
- Holiday hours from provider settings override regular hours

---

## 12. Favorites

**Priority:** P1

### 12.1 Description
Users can save businesses to a favorites list for quick access and receive limited personalized recommendations.

### 12.2 Features
- **Favorite Toggle:** Heart icon on business cards and detail page, instant optimistic toggle
- **Favorites List:** Dedicated tab/screen showing saved businesses in a grid or list
- **Sort Options:** Recently added, alphabetical, rating
- **Offline Access:** Favorites cached locally for viewing without network
- **Sync:** Guest favorites persist locally and merge on login
- **Favorites-Based Suggestions:** Home screen "Because you liked X" recommendation row (simple: same category, high-rated, nearby)

### 12.3 Acceptance Criteria
- Favorite toggle response time under 100ms (optimistic)
- Favorites list loads from cache in under 200ms
- Guest-to-login merge handles 50+ favorites without error
- Tapping a favorite navigates to that business detail page
- Removing a favorite reflects immediately with undo toast (5 second undo)

---

## 13. User Profile

**Priority:** P1

### 13.1 Description
Centralized user account management for customers. Personal info, preferences, payment methods, notification settings, and privacy controls.

### 13.2 Sections
- **Personal Info:** Photo (camera/gallery upload), first/last name, email (read-only after verification, change triggers re-verification), phone number, date of birth (optional, for birthday promotions)
- **Saved Payment Methods:** List of cards (masked number, expiry, brand icon), add new card, delete card, set default
- **Notification Preferences:** Toggles per notification type (booking confirmations, reminders, promotions, review requests). Channel toggles (push, email, SMS)
- **Privacy & Security:** Change password, active sessions list with logout per device, delete account (soft delete with 30-day grace period for recovery)
- **Booking Preferences:** Default search radius, preferred payment method, favorite categories
- **Referral:** Share referral code/link, track referral credits earned

### 13.3 Acceptance Criteria
- Profile photo upload with crop tool (1:1 aspect ratio, max 5MB)
- Email change sends verification to new email, old email remains until verified
- Delete account soft-deletes and auto-restores if user logs in within 30 days; hard delete after 30 days
- Notification toggles persist across sessions
- Active sessions show device name, location (IP-based), and last active time

---

## 14. Reviews & Ratings

**Priority:** P1

### 14.1 Description
Post-appointment review system allowing customers to rate and review businesses. Reviews are moderated and displayed on business profiles.

### 14.2 Features
- **Submit Review:** Triggered after appointment status is `COMPLETED`. 1–5 star rating + optional comment (max 2000 chars) + optional photo upload (up to 5 photos). Review must be submitted within 30 days of appointment.
- **Review Display:** Average rating, distribution bar, review cards with reviewer name/photo (or anonymous option), date, star rating, comment, photos with lightbox
- **Provider Response:** Business owner can post one public response per review
- **Moderation:** Reviews with profanity or spam are flagged for admin review (automated filtering + manual queue)
- **Helpful Votes:** "Was this helpful?" thumbs up/down on reviews, affects sort order
- **Sort Options:** Most recent, highest rated, lowest rated, most helpful

### 14.3 Acceptance Criteria
- Review submission form validates star rating is selected
- Photos upload with progress indicator, max 5 photos at 10MB each
- Review appears on business page within 2 seconds of submission (optimistic) or after moderation if flagged
- Average rating updates within 5 seconds of new review posting
- Providers see pending review responses in their portal
- Admin moderation queue accessible from dashboard
- Users cannot review the same appointment twice

---

## 15. Payment Integration

**Priority:** P0

### 15.1 Description
Secure payment processing via Stripe for booking payments. Supports card payments, digital wallets, and stored payment methods.

### 15.2 Features
- **Payment Flow:** Integrated into booking flow Step 5. Displays total with breakdown (service subtotal, taxes, fees). Stripe PaymentSheet handles PCI compliance.
- **Stored Cards:** Save card for future use (optional checkbox). Stored cards displayed as quick-select options in subsequent bookings.
- **Payment Confirmation:** Webhook from Stripe confirms payment. On success: appointment created, confirmation shown. On failure: clear error message, option to retry with different card.
- **Idempotency:** Idempotency key generated per booking attempt to prevent double charges on retry.
- **Refunds:** Full/partial refunds initiated by provider or admin. Refund reason required. Funds return within 5–10 business days.
- **Cancellation Fees:** Automated charge for late cancellation/no-show per provider's policy
- **Provider Payouts:** Stripe Connect for provider payouts (weekly/daily schedule). Platform fee deducted (configurable per business, default 15%).
- **Invoices & Receipts:** Auto-generated PDF receipt emailed after payment. Available in appointment detail and user profile history.

### 15.3 Acceptance Criteria
- Payment completes within 10 seconds with stored card, 30 seconds with new card
- PaymentSheet renders correctly on iOS, Android, and Web
- Idempotency prevents double charges even with rapid retry
- Webhook correctly handles `payment_intent.succeeded`, `payment_intent.payment_failed`, and `payment_intent.canceled` events
- Refund status is reflected in appointment detail within 30 seconds
- PCI compliance: no raw card data touches our servers
- Receipt email delivers within 60 seconds

---

## 16. Notifications

**Priority:** P0

### 16.1 Description
Multi-channel notification system (push, email, SMS) for transactional and promotional communications. Built on event-driven architecture.

### 16.2 Notification Types & Triggers

| Type | Trigger | Channel | Recipient |
|------|---------|---------|-----------|
| Booking Confirmed | Payment success | Push + Email | Customer |
| Booking Confirmed | New booking created | Push + Email | Provider |
| Reminder 24h | 24 hours before appointment | Push + Email | Customer |
| Reminder 1h | 1 hour before appointment | Push | Customer |
| Booking Cancelled | Customer cancels | Push + Email | Provider |
| Booking Cancelled | Provider cancels | Push + Email + SMS | Customer |
| Review Request | 2 hours after appointment end | Push + Email | Customer |
| Payment Receipt | Payment captured | Email | Customer |
| Promotion | Admin-triggered campaign | Push + Email (opt-in) | Customers |
| Provider Approved | Admin approves provider | Email | Provider |
| New Booking Request | Booking placed (if manual confirm)| Push | Provider |

### 16.3 Infrastructure
- **Event Bus:** Redis pub/sub or BullMQ events for notification dispatch
- **Push Notifications:** Firebase Cloud Messaging (FCM) for Android, Apple Push Notification Service (APNs) for iOS
- **Email:** SendGrid or Postmark templates with localization support
- **SMS:** Twilio for high-priority cancellations and OTP
- **User Preferences:** Respect per-channel toggles from user profile
- **Batching:** Group notifications within a configurable window (e.g., 5 min) to avoid spam

### 16.4 Acceptance Criteria
- Push notification delivers within 5 seconds of trigger event
- Email delivers within 60 seconds
- Notification preferences are respected (no delivery to opted-out channels)
- Tapping booking-related push notification deep links to the appointment detail
- Failed push tokens are cleaned up automatically (FCM/APNs feedback)
- Notification history viewable in user profile settings

---

## 17. Provider / Business Owner Portal

**Priority:** P1

### 17.1 Description
Dedicated web portal (responsive, mobile-friendly) for salon and wellness business owners to manage their profile, services, staff, availability, appointments, and view analytics.

### 17.2 Modules

**Dashboard Home:**
- Today's appointment count and revenue
- This week vs last week comparison (appointments, revenue, new clients)
- Upcoming appointments quick list
- Pending actions (unconfirmed bookings, review responses)
- Occupancy rate for today

**Appointment Management:**
- Calendar view with day/week/month toggle
- Color-coded by staff member
- Drag to reschedule (staff view)
- Quick actions: confirm, complete, cancel, no-show
- Client look-up and history
- Walk-in booking creation (provider adds appointment manually)

**Business Profile:**
- Edit business name, description, phone, address
- Upload/manage photo gallery (reorder, delete, set hero)
- Set business hours per day, add holiday/special hours
- Manage amenities list

**Service Management:**
- CRUD for services: name, category, description, duration, price, parallel booking count
- Enable/disable services temporarily
- Reorder display order

**Staff Management:**
- Add/edit/remove staff members
- Assign services each staff can perform
- Set individual working hours (inherits business hours by default, with override option)
- Set break times
- Staff photo and bio
- Staff performance metrics (appointments completed, revenue generated, avg rating)

**Client Management:**
- Client list with search, visit history per client
- Client notes (internal, not visible to client)
- Client tags (VIP, new, returning)
- Export client list (CSV)

**Reviews:**
- All reviews sorted by recent
- Respond to reviews (public response)
- Flag inappropriate reviews for admin review

**Analytics:**
- Revenue over time (daily/weekly/monthly charts)
- Appointment volume trends
- Service popularity (top 10)
- Staff utilization rate
- Customer retention rate and new vs returning ratio
- Cancellation rate with reasons

**Settings:**
- Notification preferences (provider-side)
- Cancellation policy: advance notice hours, cancellation fee percentage
- Booking settings: min advance hours, max advance days, auto-confirm vs manual
- Payment/payout schedule settings

### 17.3 Acceptance Criteria
- Dashboard loads with today's metrics within 1 second
- Calendar view syncs in real-time across multiple provider logins
- Service and staff changes immediately affect customer-facing availability
- Analytics charts render with at least 12 months of historical data
- CSV export includes all client fields with proper formatting
- Provider portal is fully responsive (usable on tablet and mobile)
- All changes auto-save with success/error toasts

---

## 18. Admin Dashboard

**Priority:** P2

### 18.1 Description
Internal admin panel for platform management. User management, business approvals, content moderation, platform analytics, and configuration.

### 18.2 Modules

**Dashboard Overview:**
- Platform KPIs: total users, total providers, total bookings, revenue (GMV), platform commission
- Daily/weekly/monthly active user charts
- New registrations trend
- Top businesses by bookings and revenue
- Recent flagged content requiring action

**User Management:**
- Search users by name, email, phone
- View user details, booking history, payment history
- Suspend/ban users with reason logging
- Impersonate user for support debugging (with audit log)

**Provider Management:**
- Pending approval queue with business details and documents
- Approve/reject with reason (rejection sends email with instructions)
- View provider details, metrics, all bookings
- Suspend provider (temporarily hide from search)
- Configure platform commission per provider

**Category Management:**
- CRUD for service categories with name, icon, image, parent category
- Reorder categories for display
- Enable/disable categories

**Content Moderation:**
- Flagged reviews queue with automated moderation score
- Approve/reject flagged reviews
- Remove inappropriate photos from business profiles or reviews
- View moderation history per user

**Dispute Resolution:**
- Payment disputes and chargebacks dashboard
- View dispute details, evidence
- Issue refunds or adjustments

**Platform Configuration:**
- Global settings: default commission, max advance booking days, supported currencies
- Feature flags (enable/disable features per market)
- Promotional campaign creation and targeting
- Email/push notification templates editor

**Analytics & Reporting:**
- Revenue reports with date range filters, exportable to CSV/PDF
- Booking funnel analytics (search → view → book → complete)
- Category and service trends
- Geographic distribution heatmap
- User acquisition by channel

### 18.3 Acceptance Criteria
- Admin dashboard loads KPIs within 2 seconds
- Provider approval queue shows all pending with sort by submission date
- Impersonation is fully auditable with timestamp and admin user logged
- Reports export in CSV and PDF formats
- Feature flags propagate to application within 30 seconds
- All bulk actions (suspend multiple users, etc.) have confirmation dialogs

---

## 19. Background Jobs (BullMQ)

**Priority:** P0 (Infrastructure)

### 19.1 Description
Reliable, scalable background job processing using BullMQ with Redis for all asynchronous operations across the platform.

### 19.2 Job Queues & Handlers

**Notification Queue:**
- Consumes notification events and dispatches via FCM, APNs, SendGrid, Twilio
- Handles retry with exponential backoff (max 3 retries)
- Dead letter queue for permanent failures with alerting

**Booking Reminder Queue:**
- Scheduled jobs created on booking confirmation for 24h and 1h before appointment
- Check if appointment is still active before sending (handle cancellations)
- Auto-retry on delivery failure

**Review Solicitation Queue:**
- Scheduled job 2 hours after appointment end time
- Check if appointment was completed (not cancelled/no-show)
- Skip if user has already submitted a review

**Payment Processing Queue:**
- Handle Stripe webhook events asynchronously
- Process refunds
- Generate and send invoices
- Handle payout scheduling via Stripe Connect

**Cache Invalidation Queue:**
- Invalidate availability cache on booking create/update/cancel
- Invalidate business search cache on profile updates
- Invalidate category cache on admin changes
- Debounced jobs (process only latest within a 5-second window)

**Analytics Queue:**
- Aggregate booking events for dashboard metrics
- Compute daily/weekly summaries for providers
- Generate platform-wide reports

**Data Cleanup Queue:**
- Soft-delete accounts past 30-day grace period
- Delete expired refresh tokens
- Cleanup old notification records (90+ days)
- Anonymize deleted user data after retention period

**Email Queue:**
- Render email templates with user and appointment data
- Send via SendGrid with proper unsubscribe headers
- Track delivery status and bounces

### 19.3 Infrastructure
- BullMQ with Redis (separate Redis instance from cache)
- Queue monitoring via Bull Board (accessible to admins)
- Job failure alerts to Slack/email for operational team
- Concurrency limits per queue based on downstream API rate limits

### 19.4 Acceptance Criteria
- All notification jobs complete within 30 seconds of enqueue
- Reminder jobs fire at correct scheduled times (± 1 minute)
- Cache invalidation jobs process within 2 seconds of booking change
- Failed jobs retry with correct backoff and move to DLQ after max attempts
- Bull Board shows queue depths, job statuses, and failure rates
- No job is lost on Redis restart (persistence configured)
- Queue processing survives worker pod restarts gracefully

---

## 20. Feature Priority Matrix

| Priority | Features |
|----------|----------|
| P0 (MVP) | Shared Types & Design System, User Authentication, Guest Browse, Business Search & Discovery, Business Detail View, Service Categories, Booking Flow, Appointment Management, Availability & Slot Computation, Payment Integration, Notifications, Background Jobs |
| P1 (V1) | Map-based Search, Favorites, User Profile, Reviews & Ratings, Provider Portal |
| P2 (V2) | Admin Dashboard (full), Advanced Analytics, Referral Program, In-App Chat |

---

## 21. Non-Functional Requirements

### 21.1 Performance
- API response time < 200ms for cached reads, < 500ms for writes (p95)
- App cold start < 2 seconds on mid-range devices
- Image lazy loading with CDN (Cloudinary/Imgix) for auto-resizing and WebP format

### 21.2 Security
- All API calls over HTTPS
- JWT with RS256 signing, short-lived access tokens
- Input sanitization and SQL injection prevention (parameterized queries)
- Rate limiting on auth and booking endpoints
- GDPR compliance: data export, account deletion, cookie consent

### 21.3 Observability
- Structured logging (JSON format) with correlation IDs
- Error tracking via Sentry
- API and queue metrics via Prometheus/Grafana
- Business analytics events via Segment or custom pipeline

### 21.4 Testing
- Unit tests: >80% coverage on core business logic (slot computation, pricing)
- Integration tests: All API endpoints with happy path and error cases
- E2E tests: Critical user journeys (guest browse → auth → book → view appointment)
- Load tests: Booking endpoint handles 500 concurrent requests

---

*End of Product Specification — Planity Clone v1.0*
