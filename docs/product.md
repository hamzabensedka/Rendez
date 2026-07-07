# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Version:** 1.0
**Goal:** Define complete feature specs and acceptance criteria for a mobile-first booking platform for beauty & wellness services, cloning Planity's core experience.

## Personas
- **Customer:** Searches, books, pays, reviews.
- **Business Owner:** Manages salon, staff, availability, appointments.
- **Admin:** Platform oversight, moderation, analytics.

## Priorities
P0 = Must-have for MVP, P1 = Important post-MVP, P2 = Nice-to-have.

## Feature Specifications

### 1. User Authentication
**Description:** Secure registration/login via email, phone, or social (Google/Apple). JWT-based sessions with refresh tokens.
**Acceptance Criteria:**
- User can sign up with email+password; receives verification email.
- User can log in and stays authenticated across app restarts.
- Password reset flow works via email.
- Social login returns valid profile.
- Protected routes redirect guests to login when required.
**Priority:** P0

### 2. Guest Browse & Explore
**Description:** Landing page with featured businesses, trending categories, and city selection without auth.
**Acceptance Criteria:**
- Guest sees curated lists and can scroll.
- Tapping a business shows detail (read-only).
- Booking action triggers login/signup modal.
**Priority:** P0

### 3. Business Search & Discovery
**Description:** Text search and filtered discovery by category, price range, rating, distance.
**Acceptance Criteria:**
- Search returns businesses matching query, debounced 300ms.
- Filters combine correctly (AND logic).
- Results paginate (20 per page) and sort by relevance/distance/rating.
**Priority:** P0

### 4. Map-based Search
**Description:** Interactive map (Mapbox/Google) showing business pins with clustering.
**Acceptance Criteria:**
- Map loads with user geolocation (permission handled).
- Pins reflect current filters.
- Tap pin opens preview card; "View" goes to detail.
- Pan/zoom updates results within viewport (debounced).
**Priority:** P1

### 5. Business Detail View
**Description:** Comprehensive page: cover photo, gallery, services list, staff, hours, location, reviews summary, "Book" CTA.
**Acceptance Criteria:**
- All sections render with real data.
- Services show duration and price.
- "Book" initiates booking flow.
- Share button copies deep link.
**Priority:** P0

### 6. Service Categories
**Description:** Hierarchical taxonomy (e.g., Hair > Haircut > Men's Haircut).
**Acceptance Criteria:**
- Seed data includes top-level and sub-categories.
- Category page lists businesses offering that category.
- Used as filter in search.
**Priority:** P0

### 7. Booking Flow
**Description:** Multi-step: select service → choose staff (optional) → pick date → select slot → confirm → pay.
**Acceptance Criteria:**
- Only available slots shown (from Availability feature).
- User can navigate back without losing state.
- Validation prevents double-booking.
- On success, appointment created and confirmation shown.
**Priority:** P0

### 8. Appointment Management
**Description:** Customer and provider views of upcoming/past appointments.
**Acceptance Criteria:**
- Customer can cancel (within policy) or reschedule.
- Provider can confirm, decline, mark no-show.
- Status changes trigger notifications.
- Calendar view for provider.
**Priority:** P0

### 9. Favorites
**Description:** Save businesses or services to a personal list.
**Acceptance Criteria:**
- Heart icon toggles favorite.
- Favorites list accessible from profile.
- Removing updates UI instantly.
**Priority:** P2

### 10. User Profile
**Description:** Manage name, avatar, contact, saved payment methods, notification prefs.
**Acceptance Criteria:**
- Edits persist to backend.
- Avatar upload supports crop.
- Payment methods managed via Payment Integration.
**Priority:** P1

### 11. Availability & Slot Computation
**Description:** Providers define weekly hours, breaks, service durations, buffers; system computes bookable slots.
**Acceptance Criteria:**
- Slots generated per service duration + buffer.
- Overlapping appointments blocked.
- Exception dates (holidays) handled.
- Timezone correct per business.
**Priority:** P0

### 12. Shared Types & Design System
**Description:** Monorepo package with TypeScript interfaces, UI kit (buttons, cards, inputs), theme tokens.
**Acceptance Criteria:**
- Components documented (Storybook).
- Used consistently across mobile and web.
- Types imported by all services to avoid drift.
**Priority:** P0

### 13. Reviews & Ratings
**Description:** Customers rate (1-5 stars) and write text after completed appointments.
**Acceptance Criteria:**
- Only verified appointments can review (one per appointment).
- Average rating shown on business detail.
- Admin can moderate inappropriate content.
**Priority:** P1

### 14. Payment Integration
**Description:** Stripe for cards, support deposits, full prepay, refunds.
**Acceptance Criteria:**
- PCI-compliant (no raw card data on server).
- Webhooks update appointment/payment status.
- User can save card for future.
- Refund triggers notification.
**Priority:** P0

### 15. Notifications
**Description:** Email, SMS, push for booking confirm, reminder (24h before), cancel, promo (opt-in).
**Acceptance Criteria:**
- Templates configurable.
- User preferences honored (e.g., disable SMS).
- Sent via Background Jobs.
**Priority:** P1

### 16. Provider / Business Owner Portal
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, appointments, payouts.
**Acceptance Criteria:**
- CRUD on business info and services.
- Staff accounts with role-based access.
- Calendar shows appointments.
- Payout history from Stripe.
**Priority:** P0

### 17. Admin Dashboard
**Description:** Super-admin web app for platform management.
**Acceptance Criteria:**
- Manage users (suspend/activate).
- Approve/reject business registrations.
- Moderate reviews, categories.
- View basic analytics (bookings, GMV).
**Priority:** P1

### 18. Background Jobs (BullMQ)
**Description:** Queue system for async tasks: send notifications, generate reports, expire slots, sync data.
**Acceptance Criteria:**
- Jobs enqueued with retry (exponential backoff).
- Failed jobs alert to monitoring.
- Queue dashboard (Bull Board) for inspection.
- Idempotent processing.
**Priority:** P1

## Success Metrics
- 500+ businesses onboarded in 3 months.
- <2% booking failure rate.
- 4.5+ avg app store rating.

## Open Questions
- Which geolocation provider? (TBD)
- Deposit vs full prepay default? (Business configurable)