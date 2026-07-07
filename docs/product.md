# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first web app + provider portal + admin).
**Priority legend:** P0 = must-have launch, P1 = important post-MVP, P2 = nice-to-have.

---

## 1. Shared Types & Design System (P0)
Unified types and UI kit used across app, portal, admin.
- **Spec:** Define TS types: User, Business, Service, Slot, Booking, Review, Payment, Notification. Mobile-first design system with colors, typography, buttons, cards, bottom nav.
- **AC:**
  - Shared npm package or `/shared` module imported by all apps.
  - Components match Figma design system; dark/light supported.
  - Types validated by zod schemas at API boundaries.

## 2. User Authentication (P0)
Email, phone, Google/Apple login; JWT + refresh.
- **Spec:** Register, login, logout, password reset, OTP for phone.
- **AC:**
  - User can register with email or OAuth in <30s.
  - Invalid creds show error; 5 fails → lock 5 min.
  - Session persists via refresh token (7d).
  - GDPR consent captured.

## 3. Guest Browse & Explore (P0)
Non-logged users can explore.
- **Spec:** Home with featured businesses, categories, city selector.
- **AC:**
  - Guest sees listings, can open detail but booking prompts login.
  - No personal data stored for guest.

## 4. Business Search & Discovery (P0)
Text search, filters.
- **Spec:** Search by name, service, city; filter by price, rating, distance, availability.
- **AC:**
  - Results <500ms for 10k businesses.
  - Filters combine with URL state (shareable).
  - Empty state with suggestions.

## 5. Map-based Search (P1)
Leaflet/Mapbox view.
- **Spec:** Show pins, cluster, move map to update results.
- **AC:**
  - Pins clickable → preview card.
  - Radius slider updates query.
  - Mobile performance >30fps.

## 6. Business Detail View (P0)
Full business profile.
- **Spec:** Gallery, services, staff, hours, reviews, book button.
- **AC:**
  - Loads <1s.
  - Shows next available slot.
  - Share via link.

## 7. Service Categories (P0)
Taxonomy: Hair, Nails, Spa, etc.
- **Spec:** Multi-level categories with icons.
- **AC:**
  - Category page lists businesses.
  - Provider assigns services to categories.

## 8. Booking Flow (P0)
Select service → staff → slot → pay.
- **Spec:** Stepper UI, price summary, promo code.
- **AC:**
  - Prevents double booking (lock slot 10 min).
  - Supports multi-service cart.
  - Confirmation + calendar invite.

## 9. Availability & Slot Computation (P0)
Engine for slots.
- **Spec:** Per business/staff/service duration, breaks, buffer.
- **AC:**
  - Computes slots in real time.
  - Respects holidays, vacations.
  - Timezone correct.

## 10. Appointment Management (P0)
User sees bookings.
- **Spec:** Upcoming/past, reschedule, cancel (policy), no-show.
- **AC:**
  - Cancel frees slot instantly.
  - Reminder 24h before.
  - Provider notified.

## 11. Favorites (P1)
Save businesses/services.
- **Spec:** Heart icon, favorites tab.
- **AC:**
  - Sync across devices.
  - Guest favorites lost on login prompt.

## 12. User Profile (P0)
Edit info, addresses, payment methods.
- **AC:**
  - Avatar upload.
  - Delete account with data purge.

## 13. Reviews & Ratings (P1)
Post-visit reviews.
- **Spec:** 1–5 stars, text, photos.
- **AC:**
  - Only verified bookings.
  - Business can reply.
  - Flagged content moderated.

## 14. Payment Integration (P0)
Stripe/Adyen.
- **Spec:** Card, wallet, saved cards, partial deposit.
- **AC:**
  - PCI compliant.
  - Refund via admin.
  - Failed payment → booking released.

## 15. Notifications (P0)
Push, email, SMS.
- **Spec:** Booking, reminder, promo (opt-in).
- **AC:**
  - Preferences respected.
  - Sent via BullMQ.

## 16. Provider / Business Owner Portal (P0)
Web dashboard.
- **Spec:** Manage profile, services, staff, hours, bookings, payouts.
- **AC:**
  - Onboard in <15 min.
  - View daily agenda.
  - Export CSV.

## 17. Admin Dashboard (P1)
Super admin.
- **Spec:** Users, businesses, disputes, categories, config.
- **AC:**
  - Suspend business.
  - View metrics.
  - Impersonate (audit log).

## 18. Background Jobs (BullMQ) (P0)
Async tasks.
- **Spec:** Reminders, slot cleanup, report gen, image resize.
- **AC:**
  - Retry with backoff.
  - Dead-letter queue.
  - Dashboard for monitoring.

---

## Priority Summary
- P0: 1,2,3,4,6,7,8,9,10,12,14,15,16,18
- P1: 5,11,13,17
- P2: none at launch

## Success Metrics
- 1k bookings/week by month 3
- <2% double-booking rate
- 4.5+ app store rating