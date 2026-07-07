# Planity Clone – Product Specification

**Author:** Alex (Product Owner)
**Goal:** Define complete feature specifications and acceptance criteria for Planity Clone, ensuring user needs are captured and prioritized.
**Scope:** Mobile-first platform connecting clients with beauty and wellness businesses for discovery, booking, payments, and management.

## Priorities
- P0: Must-have for MVP launch
- P1: Important post-MVP / early iteration
- P2: Nice-to-have / later

## Feature Specifications

### 1. User Authentication
**Description:** Secure signup/login for clients via email, phone OTP, and social providers.
**Acceptance Criteria:**
- User can register with email+password, phone number (OTP), or Google/Apple.
- Passwords hashed (bcrypt); JWT or session tokens issued.
- Email verification required before booking.
- Logout invalidates token.
- Error states for invalid credentials.
**Priority:** P0

### 2. Guest Browse & Explore
**Description:** Non-authenticated users can explore businesses, categories, and deals.
**Acceptance Criteria:**
- Guest can view home feed, categories, and business list.
- Guest can open business detail but prompted to login for booking.
- No personal data stored for guest.
**Priority:** P0

### 3. Business Search & Discovery
**Description:** Text search with filters (service, price, rating, distance).
**Acceptance Criteria:**
- Search returns businesses matching name, service, or tag.
- Filters apply correctly and combine.
- Results paginated (20 per page).
- Empty state shown when no results.
**Priority:** P0

### 4. Map-based Search
**Description:** Interactive map showing business pins; user can pan/zoom to reload results.
**Acceptance Criteria:**
- Map displays pins within viewport.
- Tapping pin opens mini business card.
- Radius filter updates on map move (debounced).
- Supports geolocation permission flow.
**Priority:** P1

### 5. Business Detail View
**Description:** Comprehensive page with info, services, staff, photos, reviews, slots.
**Acceptance Criteria:**
- Shows address, hours, contact, gallery.
- Lists services with durations and prices.
- Shows aggregate rating and review snippets.
- 'Book' CTA initiates booking flow.
**Priority:** P0

### 6. Service Categories
**Description:** Taxonomy of services (Hair, Nails, Spa, etc.) with sub-categories.
**Acceptance Criteria:**
- Categories seeded from admin; editable.
- Each business assigns offered categories.
- Category landing page lists businesses.
**Priority:** P0

### 7. Booking Flow
**Description:** Multi-step flow: select service, staff, date/time, confirm.
**Acceptance Criteria:**
- Only available slots shown (computed via Availability feature).
- User can select or auto-assign staff.
- Shows price and duration summary.
- On confirm, appointment created and confirmation sent.
- Supports reschedule/cancel from flow.
**Priority:** P0

### 8. Appointment Management
**Description:** Client views upcoming/past appointments; can cancel/reschedule.
**Acceptance Criteria:**
- List grouped by upcoming/past.
- Cancel respects business policy (e.g., 24h).
- Reschedule re-enters booking flow with prior context.
- Status reflects provider confirmation.
**Priority:** P0

### 9. Favorites
**Description:** Users bookmark businesses for quick access.
**Acceptance Criteria:**
- Heart icon toggles favorite on detail/view.
- Favorites list in profile.
- Sync across devices.
**Priority:** P1

### 10. User Profile
**Description:** Manage personal info, payment methods, notifications settings.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- View booking history.
- Manage saved cards (tokenized).
- Consent toggles for marketing.
**Priority:** P0

### 11. Availability & Slot Computation
**Description:** Engine computing open slots from business hours, staff shifts, service duration, and existing bookings.
**Acceptance Criteria:**
- Generates slots in configurable increments (e.g., 15/30 min).
- Excludes breaks, holidays, buffer times.
- Handles multiple staff with overlapping skills.
- Real-time update on new bookings.
**Priority:** P0

### 12. Shared Types & Design System
**Description:** Common TypeScript types, UI components, color/typography tokens.
**Acceptance Criteria:**
- Monorepo package with Button, Card, Input, etc.
- Themes for light/dark.
- Types for User, Business, Appointment shared across frontend/backend.
- Documented in Storybook.
**Priority:** P0 (foundational)

### 13. Reviews & Ratings
**Description:** Clients rate businesses (1-5 stars + text) post-appointment.
**Acceptance Criteria:**
- Only verified appointments can review.
- Average rating recalculated.
- Business can respond (provider portal).
- Moderation flags inappropriate content.
**Priority:** P1

### 14. Payment Integration
**Description:** Stripe/PayPal for card payments, deposits, no-shows.
**Acceptance Criteria:**
- Tokenized cards; PCI compliant.
- Charges on booking or completion per business config.
- Refund/cancel logic automated.
- Invoice receipt emailed.
**Priority:** P0

### 15. Notifications
**Description:** Push (mobile), email, SMS for booking confirm, reminders, promos.
**Acceptance Criteria:**
- Transactional: confirm, 24h reminder, cancelled.
- Preferences respected.
- Failed delivery retried via queue.
**Priority:** P1

### 16. Provider / Business Owner Portal
**Description:** Web dashboard for businesses to manage profile, services, staff, slots, bookings.
**Acceptance Criteria:**
- CRUD business info, services, staff shifts.
- View calendar of appointments.
- Accept/decline bookings.
- View basic analytics (revenue, utilization).
**Priority:** P0

### 17. Admin Dashboard
**Description:** Super-admin controls categories, users, businesses, moderation.
**Acceptance Criteria:**
- Approve/reject business registrations.
- Manage service taxonomy.
- Suspend users/businesses.
- View platform metrics.
**Priority:** P1

### 18. Background Jobs (BullMQ)
**Description:** Queue system for async tasks: notifications, slot recompute, analytics, reminders.
**Acceptance Criteria:**
- Jobs enqueued with retry/backoff.
- Separate queues for email, SMS, heavy compute.
- Failed jobs logged and alerted.
- Idempotent processing.
**Priority:** P0 (infra)

## Out of Scope
- Real-time video consultation
- Multi-language support (future)
- Loyalty points (later)