# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style salon/beauty booking app (mobile-first + web portals).
**Priority legend:** P0 = must-have MVP, P1 = important post-MVP, P2 = nice-to-have.

---

## 1. User Authentication (P0)
**Description:** Secure signup/login for clients via email, phone OTP, and Google/Apple.
**Acceptance Criteria:**
- User can register with email+password; email verification required.
- User can login via OTP (SMS) using verified phone number.
- Social login returns valid session token.
- JWT stored securely; refresh token rotates.
- Password reset flow works end-to-end.
- Invalid attempts locked after 5 tries (15 min).

## 2. Guest Browse & Explore (P0)
**Description:** Non-logged users can explore businesses and services.
**Acceptance Criteria:**
- Guest sees featured businesses and popular categories.
- Guest can open business detail and service list.
- Booking prompts login/signup at slot confirmation.
- No personal data stored for guest.

## 3. Business Search & Discovery (P0)
**Description:** Text search with filters.
**Acceptance Criteria:**
- Search by name, service, or location keyword.
- Filters: category, price range, rating, distance, availability today.
- Results paginated (20/item); sort by relevance/distance/rating.
- Empty state shown when no results.

## 4. Map-based Search (P1)
**Description:** Discover businesses on interactive map.
**Acceptance Criteria:**
- Map shows pins within viewport radius.
- Pin cluster when zoomed out.
- Tap pin opens mini business card.
- “Search this area” updates list.

## 5. Business Detail View (P0)
**Description:** Full business profile page.
**Acceptance Criteria:**
- Shows cover, logo, gallery, address, hours, contact.
- Lists services with duration and price.
- Shows rating summary and recent reviews.
- “Book” CTA scrolls to services.

## 6. Service Categories (P0)
**Description:** Taxonomy of beauty services.
**Acceptance Criteria:**
- Categories: Hair, Nails, Face, Body, Massage, Barber.
- Subcategories mapped correctly.
- Each service linked to one leaf category.
- Category icons in design system.

## 7. Booking Flow (P0)
**Description:** Multi-step booking for a service + slot.
**Acceptance Criteria:**
- Select service → select staff (optional) → pick slot → confirm.
- Shows price and duration before confirm.
- Login required at confirm if guest.
- Confirmation screen + calendar invite.
- Double-booking prevented via lock.

## 8. Appointment Management (P0)
**Description:** View/cancel/reschedule client appointments.
**Acceptance Criteria:**
- List upcoming and past appointments.
- Cancel with reason (free >24h, fee <24h per policy).
- Reschedule opens slot picker.
- Push/email reminder 24h before.

## 9. Favorites (P1)
**Description:** Save businesses for quick access.
**Acceptance Criteria:**
- Heart icon toggles favorite.
- Favorites list in profile.
- Sync across devices.

## 10. User Profile (P0)
**Description:** Client account management.
**Acceptance Criteria:**
- Edit name, phone, avatar, preferences.
- View booking history.
- Manage payment methods.
- Delete account (GDPR).

## 11. Availability & Slot Computation (P0)
**Description:** Generate bookable slots from business hours/staff/appointments.
**Acceptance Criteria:**
- Slots = business hours − breaks − existing bookings − service duration.
- Respect staff-specific schedules.
- Buffer time configurable.
- Timezone correct per business.

## 12. Shared Types & Design System (P0)
**Description:** Common UI kit and TS types.
**Acceptance Criteria:**
- Reusable Button, Card, Input, Modal, BottomSheet.
- Theme tokens (color, spacing, radius).
- Shared API DTOs in /types.
- Dark mode supported.

## 13. Reviews & Ratings (P1)
**Description:** Post-visit reviews.
**Acceptance Criteria:**
- 1–5 star + text after completed appointment.
- One review per appointment.
- Business can reply.
- Average rating recalculated.

## 14. Payment Integration (P0)
**Description:** Stripe for cards, wallet for credits.
**Acceptance Criteria:**
- Save card, charge at booking or no-show policy.
- Refund via admin/provider.
- PCI-compliant (Stripe hosted).
- Failed payment cancels booking.

## 15. Notifications (P1)
**Description:** Push (FCM/APN) + email.
**Acceptance Criteria:**
- Booking confirmed, reminder, canceled, promo.
- User preference center.
- Provider gets new-booking alert.

## 16. Provider / Business Owner Portal (P1)
**Description:** Web dashboard for businesses.
**Acceptance Criteria:**
- Manage profile, services, staff, hours.
- View calendar and bookings.
- Accept/decline requests.
- See basic stats (revenue, visits).

## 17. Admin Dashboard (P1)
**Description:** Super-admin control.
**Acceptance Criteria:**
- Approve/new businesses.
- Manage categories and users.
- View platform metrics.
- Handle disputes/refunds.

## 18. Background Jobs (BullMQ) (P1)
**Description:** Async workers.
**Acceptance Criteria:**
- Queue: reminders, email, slot-cache, image resize.
- Retry with backoff.
- Failed jobs logged to DLQ.
- Dashboard for queue health.

---

## Priority Summary
- **P0 (MVP):** Auth, Guest, Search, Detail, Categories, Booking, Appt, Profile, Availability, Types, Payment.
- **P1:** Map, Favorites, Reviews, Notifications, Provider, Admin, Jobs.
- **P2:** Loyalty program, multi-language, gift cards (future).

## Out of Scope (v1)
- Real-time chat
- Marketplace commissions
- iOS/Android native (use React Native/Expo)
