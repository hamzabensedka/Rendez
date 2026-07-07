# Planity Clone - Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specifications and acceptance criteria for Planity Clone, ensuring all user needs are captured and prioritized.
**Scope:** Mobile-first platform connecting clients with beauty & wellness businesses (salons, barbers, spas) for booking services.

## Priority Legend
- **P0:** Must-have for MVP launch
- **P1:** Important, post-MVP or early iteration
- **P2:** Nice-to-have, later phase

## 1. User Authentication
**Description:** Secure sign-up/login for clients via email, phone OTP, and social providers.
**Acceptance Criteria:**
- User can register with email+password or phone number (OTP verified).
- Social login (Google, Apple) supported on mobile.
- Password reset flow works.
- JWT or secure session stored; logout clears tokens.
- Profile data isolated per user.
**Priority:** P0

## 2. Guest Browse & Explore
**Description:** Non-authenticated users can explore businesses and services.
**Acceptance Criteria:**
- Guest can view business list, categories, and detail pages.
- Guest can search but must authenticate to book.
- Session persists guest filters until auth.
**Priority:** P0

## 3. Business Search & Discovery
**Description:** Text-based search with filters (category, price, rating, distance).
**Acceptance Criteria:**
- Search returns relevant businesses by name, service, or tag.
- Filters apply correctly and combine.
- Results paginated (infinite scroll).
- Empty state handled.
**Priority:** P0

## 4. Map-based Search
**Description:** Interactive map showing business pins with clustering.
**Acceptance Criteria:**
- Map displays businesses within viewport.
- Tap pin opens preview card.
- `Search this area` updates results.
- Works on iOS/Android with GPS permission flow.
**Priority:** P1

## 5. Business Detail View
**Description:** Comprehensive page with info, services, staff, reviews, booking CTA.
**Acceptance Criteria:**
- Shows address, hours, gallery, services list with prices/durations.
- Displays average rating and review count.
- `Book` button initiates flow.
- Staff selection if applicable.
**Priority:** P0

## 6. Service Categories
**Description:** Taxonomy of beauty/wellness services (hair, nails, massage, etc.).
**Acceptance Criteria:**
- Hierarchical categories (parent/child).
- Each business assigns offered categories/services.
- Category landing page lists businesses.
**Priority:** P0

## 7. Booking Flow
**Description:** Multi-step flow: select service → staff → date/time → confirm → pay.
**Acceptance Criteria:**
- Only available slots shown (computed via Availability feature).
- User can modify selection before confirm.
- Confirmation screen with summary and add-to-calendar.
- If guest, redirect to auth then resume cart.
**Priority:** P0

## 8. Appointment Management
**Description:** User can view upcoming/past appointments, reschedule, cancel.
**Acceptance Criteria:**
- List sorted by date.
- Cancellation respects business policy (free within X hours).
- Reschedule opens same booking flow pre-filled.
- Push/email confirmation on changes.
**Priority:** P0

## 9. Favorites
**Description:** Save businesses or specific services for quick access.
**Acceptance Criteria:**
- Heart icon toggles favorite.
- Favorites list in profile.
- Sync across devices.
**Priority:** P1

## 10. User Profile
**Description:** Manage personal info, payment methods, notifications settings.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- View booking history.
- Manage saved cards (tokenized).
- Consent toggles for marketing.
**Priority:** P0

## 11. Availability & Slot Computation
**Description:** Engine computing open slots based on business hours, staff shifts, service duration, existing bookings.
**Acceptance Criteria:**
- Generates 15-min granularity slots.
- Excludes breaks and booked times.
- Handles multiple staff and concurrent capacity.
- Timezone aware.
**Priority:** P0

## 12. Shared Types & Design System
**Description:** Common UI components and TypeScript types across app & portals.
**Acceptance Criteria:**
- Component library (buttons, cards, modals) documented.
- Shared API contracts (OpenAPI/Swagger).
- Theming via tokens (color, spacing).
- Accessibility (WCAG AA) basics met.
**Priority:** P0

## 13. Reviews & Ratings
**Description:** Clients rate visits (1-5 stars, text, photos).
**Acceptance Criteria:**
- Only verified appointments can review.
- Average rating updates on business page.
- Business can respond (via portal).
- Moderation for inappropriate content.
**Priority:** P1

## 14. Payment Integration
**Description:** Stripe/Adyen for cards, wallets; deposits or full prepay.
**Acceptance Criteria:**
- PCI-compliant tokenization.
- Supports refunds/cancellations per policy.
- Failed payment rollback booking.
- Receipt emailed.
**Priority:** P0

## 15. Notifications
**Description:** Push (FCM/APNs), email, SMS for booking, reminders, marketing.
**Acceptance Criteria:**
- Transactional: booking confirm, 24h reminder, cancelled.
- Opt-in marketing controls.
- Localization per user locale.
- Delivery tracked via background jobs.
**Priority:** P1

## 16. Provider / Business Owner Portal
**Description:** Web dashboard for businesses to manage profile, services, staff, slots, bookings.
**Acceptance Criteria:**
- CRUD business info, photos, hours.
- Manage service catalog & pricing.
- Staff accounts with role permissions.
- View calendar, accept/block slots.
- Respond to reviews.
**Priority:** P0

## 17. Admin Dashboard
**Description:** Super-admin panel for platform oversight.
**Acceptance Criteria:**
- Manage users, businesses, categories.
- Flag inappropriate content.
- View analytics (bookings, GMV).
- Configure global settings (cancellation windows).
**Priority:** P1

## 18. Background Jobs (BullMQ)
**Description:** Queue system for async tasks: reminders, slot cleanup, analytics, notifications.
**Acceptance Criteria:**
- BullMQ workers process jobs reliably with retries.
- Job types: sendNotification, expirePendingBooking, computeAnalytics.
- Dead-letter queue for failures.
- Monitoring dashboard.
**Priority:** P1

## Summary of Priorities
- P0: Auth, Guest, Search, Detail, Categories, Booking, Appt Mgmt, Profile, Availability, Design System, Payment, Provider Portal
- P1: Map Search, Favorites, Reviews, Notifications, Admin, Background Jobs
- P2: (future) Loyalty program, Multi-language, AI recommendations.