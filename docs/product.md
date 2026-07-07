# Planity Clone - Product Specification

## 1. User Authentication
**Priority:** P0
**Description:** Allow users to register, login, and manage sessions.
**Acceptance Criteria:**
- User can sign up with email or phone and social OAuth.
- Email/phone verification required before booking.
- Password reset flow works.
- JWT with refresh token rotation.
- Logout invalidates session.

## 2. Guest Browse & Explore
**Priority:** P0
**Description:** Non-authenticated users can explore the marketplace.
**Acceptance Criteria:**
- Guests can view home, categories, business list and detail.
- Search and map accessible without login.
- Booking action triggers login/registration.
- Guest cart state preserved after auth.

## 3. Business Search & Discovery
**Priority:** P0
**Description:** Find businesses via text query and filters.
**Acceptance Criteria:**
- Search by name, service, or location.
- Filters: category, price range, rating, distance, availability.
- Results sorted by relevance, distance, rating.
- Pagination or infinite scroll.

## 4. Map-based Search
**Priority:** P1
**Description:** Visual discovery via interactive map.
**Acceptance Criteria:**
- Display businesses as pins with clustering.
- Use device geolocation with manual location override.
- Selecting pin shows quick preview card.
- Moving map updates list via debounced query.

## 5. Business Detail View
**Priority:** P0
**Description:** Comprehensive view of a salon/business.
**Acceptance Criteria:**
- Hero image, name, address, contact, hours.
- List of services with prices and durations.
- Staff members and selectable preference.
- Aggregate rating and recent reviews.
- CTA to book or favorite.

## 6. Service Categories
**Priority:** P0
**Description:** Hierarchical taxonomy of services.
**Acceptance Criteria:**
- Seed data: Hair, Nails, Spa, Beauty, Wellness.
- Subcategories navigable from home.
- Category used as search filter.
- Admin can add/edit/disable.

## 7. Booking Flow
**Priority:** P0
**Description:** Multi-step appointment reservation.
**Acceptance Criteria:**
- Select service, staff (optional), date, available slot.
- Show price, duration, cancellation policy.
- Validate slot against real-time availability.
- Confirm with payment or deposit.
- Generate appointment and send confirmation.

## 8. Appointment Management
**Priority:** P0
**Description:** User views and modifies bookings.
**Acceptance Criteria:**
- List upcoming and past appointments.
- Reschedule with same availability rules.
- Cancel respecting business policy (refund if applicable).
- Provider receives update notification.

## 9. Favorites
**Priority:** P1
**Description:** Save businesses or services for later.
**Acceptance Criteria:**
- Add/remove from list or detail view.
- Favorites synced to user account.
- Dedicated tab shows saved items.

## 10. User Profile
**Priority:** P1
**Description:** Manage personal data and settings.
**Acceptance Criteria:**
- Edit name, phone, avatar, addresses.
- Manage saved payment methods.
- Toggle notification preferences.
- Delete account with data erasure.

## 11. Availability & Slot Computation
**Priority:** P0
**Description:** Engine to compute bookable slots.
**Acceptance Criteria:**
- Considers business hours, staff shifts, service duration, buffer.
- Excludes already booked slots and breaks.
- Timezone correct per business location.
- Returns slots in 15-min increments configurable.
- Performant for 30-day horizon.

## 12. Shared Types & Design System
**Priority:** P0
**Description:** Common TypeScript types and UI kit.
**Acceptance Criteria:**
- Defined models: User, Business, Service, Appointment, etc.
- Reusable components: Button, Card, Input, Modal, Calendar.
- Theme tokens: color, spacing, typography.
- Used by mobile and web and provider portal.

## 13. Reviews & Ratings
**Priority:** P1
**Description:** Post-visit feedback loop.
**Acceptance Criteria:**
- Only users with completed appointment can review.
- 1-5 stars, text, max 3 photos.
- Business can reply publicly.
- Admin moderation for inappropriate content.
- Aggregate rating shown on detail.

## 14. Payment Integration
**Priority:** P0
**Description:** Secure transaction processing.
**Acceptance Criteria:**
- Integrate Stripe (cards) and optionally PayPal.
- Support full pay or deposit percentage.
- Handle 3DS, failures, retries.
- Automatic refund on cancel per policy.
- Emit receipt and accounting event.

## 15. Notifications
**Priority:** P1
**Description:** Multi-channel user engagement.
**Acceptance Criteria:**
- Email, SMS, push for booking confirm, reminder, cancel.
- Templates configurable per locale.
- Respect user opt-out.
- Sent via background queue for reliability.

## 16. Provider / Business Owner Portal
**Priority:** P0
**Description:** Self-serve management for businesses.
**Acceptance Criteria:**
- Auth with role business_admin or staff.
- Manage profile, services, staff, working hours.
- View calendar and appointments, check-in.
- Basic analytics: revenue, utilization.
- Accept/decline booking requests if manual.

## 17. Admin Dashboard
**Priority:** P1
**Description:** Superadmin control plane.
**Acceptance Criteria:**
- Manage users, businesses, categories, disputes.
- Suspend accounts, feature businesses.
- View platform metrics.
- Audit log of critical actions.

## 18. Background Jobs (BullMQ)
**Priority:** P1
**Description:** Async processing backbone.
**Acceptance Criteria:**
- Queues: notifications, reminders, media, reports.
- Retry with exponential backoff.
- Dead-letter queue and alerting.
- Dashboard for queue monitoring.
- Idempotent job handlers.

## Priority Legend
- P0: Must-have for MVP launch
- P1: Important for growth phase
- P2: Nice-to-have (not used above but future)

## Success Metrics
- 80% booking completion rate
- <2s slot computation
- 4.5+ app store rating
