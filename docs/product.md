## Planity Clone Product Specification

### Product Overview
Planity Clone is a mobile-first marketplace connecting customers with beauty & wellness salons, barbershops, and spas. It simplifies discovery, booking, payment, and appointment management for consumers while providing providers with a portal to manage their business. An admin dashboard oversees the platform.

**Key Success Metrics:**
- Conversion rate from search to booked appointment > 25%
- Repeat booking rate within 90 days > 40%
- Average provider response time to new bookings < 5 minutes
- User rating after completed appointment > 4.5/5

### User Roles & Permissions
- **Guest:** Unauthenticated user who can browse businesses, view details & ratings, but cannot book or save favorites.
- **Customer:** Authenticated user with full access to book, pay, manage appointments, save favorites, write reviews, and manage profile.
- **Provider (Business Owner):** Manages their salon(s), staff, services, availability, accepts/rejects bookings, views calendar, and handles customer communication via a dedicated portal.
- **Admin:** Platform administrator with dashboard for user & provider management, booking oversight, payment monitoring, and system configuration.

---

### Feature Specifications

#### 1. User Authentication
**Priority:** P0 (Core)
**Description:** Secure sign-up, login, and session management with email/password and social login (Google, Apple). Supports OTP verification for phone numbers. Role-based access (customer, provider, admin) with token-based auth (JWT).

**User Stories:**
- As a new user, I want to register with my email or social account so I can book appointments.
- As a returning user, I want to log in securely with biometrics (fingerprint/face) if supported.

**Acceptance Criteria:**
- Registration form validates email format, password strength (min 8 chars, 1 uppercase, 1 digit).
- Social login returns existing account if email matches, otherwise creates new user.
- Phone OTP sent via SMS (6-digit code, expires in 5 minutes).
- Forgot password flow sends reset link to email, valid for 1 hour.
- JWT access token (15 min) + refresh token (7 days) stored securely (Keychain/Keystore).
- Session invalidation on password change or logout from all devices.
- Biometric lock available after first login (toggle in profile).
- Role selection during sign-up (Customer / Provider) with separate flows.

---

#### 2. Guest Browse & Explore
**Priority:** P1
**Description:** Allows unauthenticated users to browse the platform, search businesses, view details, ratings, and service menus to encourage sign-up.

**User Stories:**
- As a guest, I want to explore salons near me without signing up.
- As a guest, I want to see all services and prices before committing.

**Acceptance Criteria:**
- Home screen shows “Trending” & “Nearby” sections without user location prompt (requires manual location entry or defaults to city center).
- Business detail page fully visible, including service list and reviews, with a prominent “Sign up to book” call-to-action.
- Search and filters functional, but favorites/add-to-collection triggers sign-up modal.
- Map view displays pins for businesses (limited to 50 nearest).

---

#### 3. Business Search & Discovery
**Priority:** P0
**Description:** Full-text search with autocomplete, filters (location, category, price, rating, availability), and sorting (relevance, distance, rating, price). Real-time results as user types.

**User Stories:**
- As a customer, I want to find a “barber” in “Brooklyn” available on Saturday.
- As a customer, I want to filter by rating >4.0 and price range.

**Acceptance Criteria:**
- Search bar with instantaneous autocomplete suggestions (business names, categories).
- Results page showing card list with image, name, rating, distance, and next available slot.
- Filters: Category (multi-select), Price Range (slider with predefined brackets), Rating (toggle stars), Availability (date/time range picker), Gender (unisex, men, women).
- Sort options: Recommended, Nearest, Highest Rated, Price (Low-High, High-Low).
- Results update as filters change; count displayed.
- Search history saved for logged-in users.
- “No results” state with suggestions to broaden filters.

---

#### 4. Map-based Search
**Priority:** P1
**Description:** Interactive map view showing business pins. Users can drag/zoom to reload results for that viewport. Integrates with device location (if permission granted).

**User Stories:**
- As a customer, I want to see salons on a map around my current location.

**Acceptance Criteria:**
- Map loads with user’s location (if allowed) or center of searched city.
- Clusters for dense areas; tap to expand.
- Pin tap shows a mini-card with business name, rating, and primary photo, with “View Details” button.
- “Search this area” button refreshes results when map is moved.
- Toggle between list view and map view with smooth transition.
- Works offline with cached map tiles if previously viewed.

---

#### 5. Service Categories
**Priority:** P1
**Description:** Hierarchical category system (e.g., Hair > Haircut, Hair Coloring, Styling) with icons. Categories used for navigation, filtering, and provider service setup.

**User Stories:**
- As a customer, I want to browse all nail services available in my area.
- As a provider, I want to assign my service to a standard category so it appears in relevant searches.

**Acceptance Criteria:**
- Category browsing page with large icon grid and sub-category drill-down.
- Service list is linked to leaf categories.
- Admin can manage categories (add/edit/archive) from dashboard.
- Services inherit attributes from category (duration defaults, required equipment) overridable by provider.
- Category icons provided via SVG sprite or icon font (cached).

---

#### 6. Business Detail View
**Priority:** P0
**Description:** Comprehensive business profile with image gallery, description, services with prices, staff selection, location map, reviews, and a clear CTA to book.

**User Stories:**
- As a customer, I want to see all details of a salon before booking.

**Acceptance Criteria:**
- Hero carousel with up to 10 images (cover first), pinch-to-zoom.
- Key info: name, rating average & count, address, distance, open/closed status (based on business hours), price level ($-$$$).
- “Services” tab lists services grouped by category, with duration and price. Option to add to booking directly (adds to multi-service selection).
- “Staff” tab shows team members with photo, specialties, and rating. Staff selection possible for certain services.
- “Reviews” tab paginated, sortable by recency/helpfulness.
- Sticky bottom bar with “Book Now” button that initiates booking flow.
- Contact options: Call, Directions (opens maps app), Share.
- Quick actions: Save to Favorites (heart icon).

---

#### 7. Favorites
**Priority:** P1
**Description:** Customers can save businesses to a favorites list for quick access and receive notifications about offers or availability changes.

**User Stories:**
- As a customer, I want to keep a list of my favorite salons to rebook easily.

**Acceptance Criteria:**
- Heart icon toggles favorite status on business card and detail page.
- Dedicated “Favorites” tab in profile showing saved businesses with next available slot and quick-book.
- Sync across devices for same account.
- Optional push notification when a favorited business has a new promotion or a cancellation slot opens.
- Support offline view of cached favorites.

---

#### 8. Reviews & Ratings
**Priority:** P1
**Description:** Customers can leave a star rating (1-5) and written review after a completed appointment. Providers can respond. Moderation system flags inappropriate content.

**User Stories:**
- As a customer, I want to rate my experience so others can choose wisely.
- As a provider, I want to reply to reviews to manage my reputation.

**Acceptance Criteria:**
- Review prompt automatically sent 2 hours after appointment end (via push & in-app notification).
- Rating input via 5-star component with half-star increments.
- Written review min 10 characters, max 500.
- Photo upload optional (max 3 images).
- Provider can post a public response to any review (one per review).
- Average rating recalculated asynchronously (via BullMQ job).
- Reporting feature for offensive content; admin reviews and can hide/delete.
- Reviews are sorted by most recent by default; helpfulness voting (thumbs up/down) influences secondary sort.

---

#### 9. Availability & Slot Computation
**Priority:** P0 (Critical)
**Description:** Engine that calculates real-time bookable slots based on provider working hours, staff schedules, service duration, buffer times, existing appointments, and holidays. Supports concurrent bookings for different staff.

**User Stories:**
- As a customer, I want to see only times I can actually book, with staff selection if needed.

**Acceptance Criteria:**
- Slot computation runs server-side and caches results for 60 seconds; invalidation on any booking modification.
- Configuration per business: working hours per day (can set multiple intervals), staff roster with individual schedules and break times, service durations (including personal buffer before/after).
- Support parallel availability: If a salon has 2 barbers and a 30-min service, two appointments can start at the same time.
- Slot grid display with time blocks marked as available (green) or busy (grey).
- Customer selects date, then time, optionally staff (if service allows staff selection).
- Override for provider to manually block time/date (vacation, emergency).
- Slot engine handles timezone of the business location.
- If no slots match, suggest next available dates.

---

#### 10. Booking Flow
**Priority:** P0
**Description:** End-to-end booking from service selection to confirmation. Supports single service or multi-service package. Guest checkout option with mandatory email/phone to create temporary account.

**User Stories:**
- As a customer, I want to book a haircut and beard trim in one seamless flow.

**Acceptance Criteria:**
- Step 1: Service/s selection (with quantities if allowed).
- Step 2: Date & time selection using the availability engine.
- Step 3: Staff selection if required; if not, “Any available” by default.
- Step 4: Review summary: services, date, time, staff, prices, subtotal, taxes, fees.
- Step 5: Payment if prepayment required (card, digital wallet) or confirm booking with payment method on file.
- Step 6: Confirmation screen with appointment details and option to add to calendar (via .ics download).
- Cancel or modify allowed until payment finalization.
- Booking holds a temporary reservation (10 minutes) while payment processes; released if failed/timeout.
- Guest booking creates a shadow account with email/phone; full registration encouraged post-booking.
- Apply promo codes with validation (backend check).

---

#### 11. Payment Integration
**Priority:** P0
**Description:** Secure payment processing using Stripe (primary) with support for credit/debit cards, digital wallets (Apple Pay, Google Pay). Split payments for platform commission. PCI compliance via Stripe Elements/checkout.

**User Stories:**
- As a customer, I want to pay securely and get a receipt.

**Acceptance Criteria:**
- Stripe integration with PaymentIntent for authorization and capture.
- Saved payment methods (cards) with option to set default.
- Pre-booking: customers can be charged full amount, deposit (flat or percentage), or nothing (pay at venue). Configurable per provider.
- Receipt sent to email after successful payment; stored in app under booking history.
- Provider receives settlement minus platform fee (commission %). Commission managed via Stripe Connect or manual transfers (via admin).
- Handle 3D Secure, retries on decline.
- Refund flow initiated by provider or admin (full/partial) with reason.
- PCI compliance: no raw card data touches our servers; use Stripe.js SDK.

---

#### 12. Appointment Management
**Priority:** P0
**Description:** Customers view upcoming/past appointments, reschedule or cancel (subject to cancellation policy), add to calendar, and rebook.

**User Stories:**
- As a customer, I want to see my next appointment and get reminders.

**Acceptance Criteria:**
- “My Appointments” tab with tabs: Upcoming, Past, Cancelled.
- Upcoming list shows provider name, service, date/time, address, status (Confirmed, Pending if provider approval required).
- Cancel button (with confirmation modal showing refund amount if applicable based on policy).
- Reschedule button navigates back to availability grid for same provider and service, keeping staff; old slot released only after new booking confirmed.
- Rebook button duplicates services and opens booking flow.
- Cancel policy display: e.g., free cancellation up to 24h, charge 50% within 24h, charge 100% within 2h.
- Manual reminder push notifications configurable (e.g., 24h, 1h before).
- Past appointments allow direct review submission if not already reviewed.

---

#### 13. User Profile
**Priority:** P1
**Description:** Central hub for personal information, preferences, payment methods, booking history, favorites, and notification settings.

**User Stories:**
- As a customer, I want to update my phone number and manage my saved cards.

**Acceptance Criteria:**
- Edit profile: photo, name, email (verify new email), phone, gender (optional).
- Saved addresses (home, work) for quick location search.
- Notification preferences: push, email, SMS for booking confirmations, reminders, promotions (opt-in).
- Payment methods: list, add, delete, set default.
- History: all past bookings with filter/search.
- Favorites list accessible.
- Settings: language (EN/FR), biometric lock toggle, delete account (with confirmation).
- Provider-specific profile fields hidden for customers.

---

#### 14. Notifications
**Priority:** P0
**Description:** Real-time push notifications (Firebase FCM), in-app notification center, email and SMS for critical events. Transactional and marketing.

**User Stories:**
- As a customer, I want to be notified when my booking is confirmed.

**Acceptance Criteria:**
- Push notifications for: booking confirmed, booking reminder (pre-set), appointment starting soon, promo code from favorited business, chat message from provider, review request.
- In-app notification bell with badge count and list.
- Deep-links from notification to relevant screen (appointment detail, business page).
- Email templates for booking confirmation, receipt, cancellation, password reset. Branded with Planity Clone style.
- SMS alerts for OTP and critical booking changes (if phone verified).
- Admin can send push marketing campaigns to segments via dashboard.
- Notification preferences honored; opt-out per channel.
- Delivery handled by BullMQ jobs (enqueue, retry, priority queue).

---

#### 15. Provider / Business Owner Portal
**Priority:** P0
**Description:** Web and mobile-responsive dashboard for providers to manage their business profile, services, staff, calendar, bookings, and customer interactions.

**User Stories:**
- As a salon owner, I want to set my opening hours and add my team.

**Acceptance Criteria:**
- Onboarding wizard: business details, address, category, services (import from template optional), staff members, working hours, booking settings (confirmation mode: instant/request, prepayment policy, cancellation policy).
- Dashboard overview: today's appointments count, revenue summary (day/week), new reviews, booking requests pending.
- Calendar view (day/week) color-coded by staff, drag-and-drop reschedule (if allowed), click to see/accept/reject booking requests.
- Appointment management: accept, reject (with reason), reschedule (notify customer), cancel & refund, mark as no-show, add internal notes.
- Service management: CRUD services, set price, duration, buffer time, assignment to category, staff eligibility.
- Staff management: invite staff via email (they get separate limited login), set schedules, assign services, track performance.
- Profile editing: photos, description, amenities, social links.
- Review management: read reviews, respond publicly.
- Reports: revenue, booking volume, top services, customer retention graphs (basic analytics).
- Chat with customer (optional, can be out of scope for MVP but desired).
- Mobile-responsive but optimized for tablet/desktop.

---

#### 16. Admin Dashboard
**Priority:** P1
**Description:** Centralized control panel for platform operations: user & provider management, booking oversight, payment monitoring, content moderation, and business settings.

**User Stories:**
- As an admin, I want to view all transactions and issue refunds if needed.

**Acceptance Criteria:**
- Dashboard with key metrics: total users, total providers, bookings today, revenue today, platform commission earned.
- User management: list/search/filter users, view details, disable/enable accounts, view booking history.
- Provider management: approval workflow for new providers (verify business), view/edit profile, set commission rate, manage subscription plan (if any).
- Bookings: list with filters (date, provider, status), manual override (cancel/refund, reschedule), view payment status.
- Payments & Commissions: list of all transactions, reconciliation report, handle disputed charges, process refunds, manage payout schedules.
- Content moderation: review reported reviews and photos, hide/delete.
- Category & system settings: manage service categories, fee parameters (booking fee, tax), cancellation policy defaults.
- Audit log of critical admin actions.
- Role-based access: multiple admin accounts with permissions (super admin, support, finance).

---

#### 17. Background Jobs (BullMQ)
**Priority:** P0
**Description:** Reliable job processing for time-sensitive and resource-intensive tasks: notifications, email dispatch, SMS, slot cache invalidation, rating recalculation, payment payout scheduling, data export.

**User Stories:**
- As a developer, I need a resilient queue to send thousands of reminders without affecting API response times.

**Acceptance Criteria:**
- BullMQ-backed Redis queues with multiple queues: `notifications` (push, email, SMS), `booking` (confirmation, cancellation tasks), `analytics` (daily stats aggregation), `maintenance` (cache cleanup).
- Jobs are scheduled with delay (e.g., reminder 1 hour before appointment) and can be retried with exponential backoff (max 5 attempts).
- Dead letter queue for failed jobs after retries, with admin UI to inspect and re-queue.
- Idempotency keys to prevent duplicate notifications.
- Slot computation invalidation job triggers on booking creation/cancellation/update.
- Rating average recalculated via job when a review is added/updated/removed.
- Payout processing job triggers daily to calculate provider earnings and initiate Stripe transfers (if using Connect) or generate report.
- Health metrics exposed for monitoring (queue lengths, failure rates).

---

#### 18. Shared Types & Design System
**Priority:** P1
**Description:** Centralized TypeScript types/interfaces for all core entities (User, Business, Service, Booking, etc.) shared between frontend and backend via a monorepo package. A consistent design system (typography, colors, spacing, components) implemented with a UI library (e.g., React Native Paper + custom theme) to ensure visual consistency across mobile and provider portal.

**User Stories:**
- As a developer, I want to reuse the same types and UI components to avoid duplication.

**Acceptance Criteria:**
- `@planity/shared-types` package with interfaces, enums, and DTOs for API request/response.
- Design tokens defined: color palette (primary, secondary, error, surface), typography scale (fontFamily, sizes, line heights), spacing (4-point grid), border radius, shadows.
- Common components library: Button, Input, Card, Modal, BottomSheet, RatingStars, Avatar, AppBar, SkeletonLoader, etc.
- Components support light/dark themes.
- Storybook or similar documentation for component usage.
- All new features must use shared types and UI library components.

---

### Out of Scope for MVP (Future Enhancements)
- In-app chat between customer and provider
- Loyalty programs / points
- Multi-language content (translations for UI text possible, but dynamic content translations excluded)
- Advanced analytics (retention cohorts, heatmaps)
- White-label provider app
- Subscription plans for providers (initially flat commission)
- Social sharing of bookings
- Waitlist for fully booked slots