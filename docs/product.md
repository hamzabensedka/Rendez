# Planity Clone - Product Specification

## 1. User Authentication
**Description:** Customers and providers sign up/login via email, phone (OTP), or social (Google/Apple). JWT-based sessions.
**Acceptance Criteria:**
- AC1: User can register with email+password, verified via email link.
- AC2: User can login with OTP sent to phone.
- AC3: Social login returns valid profile and creates account if new.
- AC4: Password reset flow works.
- AC5: JWT refreshed automatically.
**Priority:** P0

## 2. Guest Browse & Explore
**Description:** Unauthenticated users can view home, featured businesses, categories.
**Acceptance Criteria:**
- AC1: Guest sees curated lists (Top Rated, Near Me placeholder).
- AC2: Guest can open business detail but booking prompts login.
- AC3: No personal data stored.
**Priority:** P0

## 3. Business Search & Discovery
**Description:** Text search with filters (category, price, rating, distance).
**Acceptance Criteria:**
- AC1: Search returns relevant businesses by name/services.
- AC2: Filters apply correctly and combine.
- AC3: Results paginated (20 per page).
- AC4: Sort by distance, rating, popularity.
**Priority:** P0

## 4. Map-based Search
**Description:** Interactive map showing business pins; viewport-based results.
**Acceptance Criteria:**
- AC1: Map renders with pins for businesses in view.
- AC2: Clicking pin opens mini detail popup.
- AC3: Moving map triggers debounced search.
- AC4: User can toggle list/map view.
**Priority:** P1

## 5. Business Detail View
**Description:** Show info: gallery, services, staff, hours, reviews, location.
**Acceptance Criteria:**
- AC1: Displays cover image, logo, description.
- AC2: Lists services with durations and prices.
- AC3: Shows aggregate rating and review count.
- AC4: Book button initiates flow.
**Priority:** P0

## 6. Service Categories
**Description:** Taxonomy of categories (Hair, Nails, Spa, etc.) with subcategories.
**Acceptance Criteria:**
- AC1: Category tree seeded (max 3 levels).
- AC2: Businesses assign services to categories.
- AC3: Home shows category icons linking to filtered search.
**Priority:** P0

## 7. Booking Flow
**Description:** Multi-step: select service -> staff (optional) -> date/time slot -> confirm -> payment.
**Acceptance Criteria:**
- AC1: Only available slots shown based on availability engine.
- AC2: User can select multiple services in one cart.
- AC3: Shows price total and duration estimate.
- AC4: On confirm, appointment created with pending status until payment.
- AC5: Supports guest booking with forced registration.
**Priority:** P0

## 8. Appointment Management
**Description:** User views upcoming/past appointments; cancel/reschedule.
**Acceptance Criteria:**
- AC1: List grouped by upcoming/past.
- AC2: Cancel respects business policy (free within 24h).
- AC3: Reschedule opens same booking flow with prefilled.
- AC4: Add to calendar (ICS download).
**Priority:** P0

## 9. Favorites
**Description:** Users bookmark businesses.
**Acceptance Criteria:**
- AC1: Heart icon toggles favorite.
- AC2: Favorites list in profile.
- AC3: Push notification for favorite's promo (if enabled).
**Priority:** P1

## 10. User Profile
**Description:** Manage personal info, addresses, payment methods, notifications settings.
**Acceptance Criteria:**
- AC1: Edit name, phone, avatar.
- AC2: Save multiple addresses.
- AC3: Manage saved cards (tokenized).
- AC4: Consent toggles for email/SMS.
**Priority:** P0

## 11. Availability & Slot Computation
**Description:** Engine computing free slots from business hours, staff schedules, existing appointments, service duration.
**Acceptance Criteria:**
- AC1: Given date, returns 15-min aligned slots excluding breaks.
- AC2: Handles multiple staff with different hours.
- AC3: Buffer time between appointments respected.
- AC4: Timezone aware.
**Priority:** P0

## 12. Shared Types & Design System
**Description:** Common TS types, UI components (Button, Card, Input), theme tokens.
**Acceptance Criteria:**
- AC1: Monorepo package with types used across apps.
- AC2: Component library documented (Storybook).
- AC3: Consistent spacing/color via design tokens.
**Priority:** P0 (foundational)

## 13. Reviews & Ratings
**Description:** Post-appointment review with star rating, text, photos.
**Acceptance Criteria:**
- AC1: Only verified customers can review.
- AC2: Rating 1-5, required comment optional.
- AC3: Business can reply publicly.
- AC4: Flagging inappropriate content.
**Priority:** P1

## 14. Payment Integration
**Description:** Stripe for cards, maybe wallet. Hold then capture after appointment.
**Acceptance Criteria:**
- AC1: Add card via Stripe Elements, token stored.
- AC2: Authorize payment on booking, capture on completion.
- AC3: Refund on cancel per policy.
- AC4: Invoice email sent.
**Priority:** P0

## 15. Notifications
**Description:** Email, SMS, Push (FCM/APN) for booking confirm, reminders, promos.
**Acceptance Criteria:**
- AC1: Transactional notifications triggered by events.
- AC2: Reminder sent 24h before appointment.
- AC3: User can opt-out per channel.
- AC4: Localization (EN/FR).
**Priority:** P1

## 16. Provider / Business Owner Portal
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, bookings, reviews.
**Acceptance Criteria:**
- AC1: CRUD business info, photos.
- AC2: Manage service catalog and pricing.
- AC3: Set working hours and staff schedules.
- AC4: View calendar of appointments, manually create.
- AC5: Respond to reviews, view stats.
**Priority:** P0

## 17. Admin Dashboard
**Description:** Super admin manages categories, users, businesses, flag content, view metrics.
**Acceptance Criteria:**
- AC1: Approve/reject business registrations.
- AC2: Disable users/businesses.
- AC3: Manage category taxonomy.
- AC4: View platform KPIs (bookings, GMV).
**Priority:** P1

## 18. Background Jobs (BullMQ)
**Description:** Queue for async tasks: reminder emails, slot cache warming, image processing, analytics.
**Acceptance Criteria:**
- AC1: BullMQ queues with Redis, retry logic.
- AC2: Job for sending reminders runs daily.
- AC3: Job processes uploaded images (resize).
- AC4: Failed jobs logged and alerted.
**Priority:** P1

## Prioritization Summary
P0: Core MVP (Auth, Search, Detail, Booking, Availability, Payment, Profile, Provider Portal, Shared Types).
P1: Enhancements (Map, Favorites, Reviews, Notifications, Admin, Background Jobs).
P2: Future (loyalty, multi-language beyond EN/FR, subscriptions).