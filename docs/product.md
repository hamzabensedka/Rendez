# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first web app + provider portal + admin).
**Priority legend:** P0 (must-have MVP), P1 (launch soon after), P2 (later).

---

## 1. Shared Types & Design System (P0)
Unified types and UI kit used across app, portal, admin.
- Types: User, Business, Service, Slot, Booking, Review, Payment, Notification.
- Design system: colors, typography, buttons, cards, bottom nav, spacing.
**AC:**
- Single source of TS types in `/shared`.
- Storybook shows >=20 components matching Figma.
- Mobile responsive at 320–428px.

## 2. User Authentication (P0)
Email/phone + OAuth (Google/Apple). JWT refresh.
**AC:**
- Signup/login/logout works; email verification sent.
- Wrong password shows limit + lockout after 5 tries.
- Token auto-refresh; protected routes guarded.

## 3. Guest Browse & Explore (P0)
Non-logged users can explore homepage and businesses.
**AC:**
- Guest sees featured businesses, categories, city selector.
- Booking prompts login with return redirect.

## 4. Business Search & Discovery (P0)
Text search, filters (category, price, rating, distance).
**AC:**
- Search returns <500ms for 10k businesses.
- Filters combine with URL state.
- Empty state shown when no results.

## 5. Map-based Search (P1)
Leaflet/Mapbox view with pins and radius filter.
**AC:**
- Pins cluster; tap opens preview card.
- Moving map updates results (debounced).

## 6. Business Detail View (P0)
Hero, services, staff, hours, reviews, book button.
**AC:**
- Shows next available slot.
- Gallery lazy loads.
- Share via link.

## 7. Service Categories (P0)
Tree: Hair > Cut > Men's Cut.
**AC:**
- Categories seed-loaded; businesses tag services.
- Category page lists businesses.

## 8. Booking Flow (P0)
Select service → staff → slot → confirm → pay.
**AC:**
- Slot locked 10 min pending payment.
- Confirmation email/SMS sent.
- Editable before confirm.

## 9. Availability & Slot Computation (P0)
Engine from business hours, staff, duration, breaks.
**AC:**
- No overlap; respects holidays.
- Computes 30 days ahead in <200ms.

## 10. Appointment Management (P0)
List, reschedule, cancel, no-show.
**AC:**
- User sees upcoming/past.
- Cancel frees slot; policy enforced.

## 11. Favorites (P1)
Save businesses/services.
**AC:**
- Sync across devices.
- Favorites list filterable.

## 12. User Profile (P0)
Name, phone, addresses, payment methods.
**AC:**
- Edit saves; phone verified.
- GDPR delete available.

## 13. Reviews & Ratings (P1)
Post-visit review, photos, helpful votes.
**AC:**
- Only verified bookings review.
- Avg rating shown; abuse report.

## 14. Payment Integration (P0)
Stripe + wallet; partial deposit.
**AC:**
- PCI compliant; retries; refund flow.
- Invoice in profile.

## 15. Notifications (P0)
Email, SMS, push (reminders, marketing opt-out).
**AC:**
- 24h/2h reminders sent.
- Unsubscribe respected.

## 16. Provider / Business Owner Portal (P1)
Manage profile, services, staff, slots, bookings.
**AC:**
- Calendar drag-reschedule.
- Payout view.

## 17. Admin Dashboard (P1)
Moderate businesses, users, categories, metrics.
**AC:**
- Suspend user; export CSV.
- Dashboard KPIs daily.

## 18. Background Jobs (BullMQ) (P0)
Queues: reminders, slot cache, emails, sync.
**AC:**
- Retry 3x; dead-letter logged.
- Monitor via Redis UI.

---

## Priority Summary
- P0: 1,2,3,4,6,7,8,9,10,12,14,15,18
- P1: 5,11,13,16,17
- P2: none at start

## Open Questions
- City launch scope? (start Paris + Lyon)
- Deposit default %? (recommend 20%)