# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty and wellness businesses (salons, barbers, spas). It supports discovery, booking, payments, and management for clients, business owners, and admins.

## Priority Legend
- Must: Required for MVP
- Should: High value, soon after MVP
- Could: Future enhancement
- Won't: Not planned

## Feature Specifications

### 1. User Authentication
**Description:** Secure registration and login via email/password, phone OTP, and social (Google/Apple). JWT access + refresh tokens.
**Acceptance Criteria:**
- User can sign up with email and verify via link.
- Login with phone number sends OTP and authenticates.
- Social login creates account if missing.
- Password reset via email works.
- Refresh token rotates and logout invalidates session.
**Priority:** Must

### 2. Guest Browse & Explore
**Description:** Unauthenticated users can explore home, categories, and featured businesses.
**Acceptance Criteria:**
- Guest sees curated home feed.
- Business detail viewable but booking triggers login modal.
- Search returns max 5 results for guests.
**Priority:** Must

### 3. Business Search & Discovery
**Description:** Text search and filtered discovery of businesses.
**Acceptance Criteria:**
- Search by name, category, or service keyword.
- Filters: price range, rating, distance, open now.
- Sort by distance, rating, price, relevance.
- Pagination works smoothly.
**Priority:** Must

### 4. Map-based Search
**Description:** Interactive map with business markers and clustering.
**Acceptance Criteria:**
- Map shows markers in current viewport.
- Clustering at low zoom levels.
- Tap marker opens preview sheet with CTA to detail.
- Filter and search sync with map.
**Priority:** Should

### 5. Business Detail View
**Description:** Comprehensive page with info, services, staff, photos, reviews, and booking.
**Acceptance Criteria:**
- Displays gallery, description, hours, location.
- Lists services with prices and durations.
- Shows next available slot computed live.
- Shows rating summary and recent reviews.
- Clear Book button.
**Priority:** Must

### 6. Service Categories
**Description:** Hierarchical taxonomy for services (e.g., Hair > Haircut).
**Acceptance Criteria:**
- Admin can create/edit/delete categories.
- Businesses assign services to categories.
- Users browse categories from home.
- Category page lists businesses offering matching services.
**Priority:** Must

### 7. Booking Flow
**Description:** Multi-step flow: service -> staff -> date -> slot -> confirm -> pay.
**Acceptance Criteria:**
- Only available slots selectable.
- Shows total price and time estimate.
- Supports guest login during flow.
- On confirm, appointment created and payment captured.
- Error handling for closed business or conflict.
**Priority:** Must

### 8. Appointment Management
**Description:** User views upcoming/past appointments and modifies them.
**Acceptance Criteria:**
- List grouped by upcoming/past with status.
- Cancel respects business policy (e.g., 24h free).
- Reschedule shows alternative slots.
- Push/email confirmation on change.
**Priority:** Must

### 9. Favorites
**Description:** Save businesses or services for quick access.
**Acceptance Criteria:**
- Add/remove from detail or search card.
- Favorites list in profile.
- Synced across devices via account.
**Priority:** Should

### 10. User Profile
**Description:** Manage personal data, payment methods, notification prefs.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- Add/remove card (tokenized via payment provider).
- Toggle notification channels.
- View booking history and reviews given.
**Priority:** Must

### 11. Availability & Slot Computation
**Description:** Engine to generate available slots from business hours, staff shifts, service duration, and existing bookings.
**Acceptance Criteria:**
- Excludes breaks and holidays.
- Handles multiple staff and shared resources.
- Real-time recompute on new booking or cancellation.
- Returns slots in timezone of business.
**Priority:** Must

### 12. Shared Types & Design System
**Description:** Common TypeScript types and UI kit for consistent cross-platform UX.
**Acceptance Criteria:**
- Repo with shared types used by API and clients.
- Component library (buttons, cards, inputs) with theme.
- Documentation with usage examples.
- Accessibility standards met.
**Priority:** Should

### 13. Reviews & Ratings
**Description:** Verified clients rate and review after visits.
**Acceptance Criteria:**
- Review allowed only for completed appointments.
- Star rating 1-5, text, optional photos.
- Average rating recalculated and displayed.
- Business owner can reply publicly.
- Inappropriate content flagged to admin.
**Priority:** Must

### 14. Payment Integration
**Description:** Stripe (or similar) for card payments, saved cards, refunds.
**Acceptance Criteria:**
- Tokenized card storage compliant with PCI.
- Charge at booking or per business policy.
- Automatic refund on eligible cancellation.
- Invoice/receipt emailed.
- Failed payment handled gracefully.
**Priority:** Must

### 15. Notifications
**Description:** Multi-channel alerts: push, email, SMS.
**Acceptance Criteria:**
- Booking confirmation sent immediately.
- Reminder 24h and 2h before appointment.
- Marketing opt-in respected.
- User can mute categories.
- Delivery tracked via background jobs.
**Priority:** Should

### 16. Provider / Business Owner Portal
**Description:** Web app for businesses to manage operations.
**Acceptance Criteria:**
- CRUD business profile, photos, services.
- Manage staff and working hours.
- View calendar and appointments.
- Respond to reviews and messages.
- Basic analytics: bookings, revenue.
**Priority:** Must

### 17. Admin Dashboard
**Description:** Super admin console for platform governance.
**Acceptance Criteria:**
- Approve/reject new business signups.
- Suspend users or businesses.
- Manage categories and global config.
- Moderate reviews and content.
- View aggregate metrics.
**Priority:** Should

### 18. Background Jobs (BullMQ)
**Description:** Redis-backed job queues for async tasks.
**Acceptance Criteria:**
- Queue for notifications, image resize, reports.
- Retry with exponential backoff.
- Failed jobs logged and alerted.
- BullMQ dashboard for monitoring.
- Horizontal scaling supported.
**Priority:** Should

## Summary Table
| Feature | Priority |
|--------|----------|
| User Authentication | Must |
| Guest Browse | Must |
| Business Search | Must |
| Map Search | Should |
| Business Detail | Must |
| Service Categories | Must |
| Booking Flow | Must |
| Appointment Mgmt | Must |
| Favorites | Should |
| User Profile | Must |
| Availability Engine | Must |
| Shared Types/Design | Should |
| Reviews | Must |
| Payment | Must |
| Notifications | Should |
| Provider Portal | Must |
| Admin Dashboard | Should |
| Background Jobs | Should |

## Notes
- MVP focuses on Must items; Should items scheduled for first iteration post-launch.
- All features require responsive mobile design and basic analytics events.