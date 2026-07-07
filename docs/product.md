# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first). Priorities use MoSCoW (Must / Should / Could / Won't).

---

## 1. Shared Types & Design System (Must)
Unified types and UI kit used across apps.
- **Spec:** Define TS types: User, Business, Service, Slot, Booking, Review, Payment, Notification. Design system: colors, typography, buttons, cards, bottom nav.
- **AC:** Types imported by all modules; Storybook shows 20+ components; theme matches brand.
- **Priority:** Must

## 2. User Authentication (Must)
- **Spec:** Email/phone + OAuth (Google/Apple). JWT refresh. Role: customer, provider, admin.
- **AC:** Signup < 1 min; wrong password shows error; session persists 7d; logout clears token.
- **Priority:** Must

## 3. Guest Browse & Explore (Must)
- **Spec:** Guests see home with featured businesses and categories without login.
- **AC:** Guest can open detail and see services but booking prompts login.
- **Priority:** Must

## 4. Business Search & Discovery (Must)
- **Spec:** Search by name, filter by category, price, rating, distance.
- **AC:** Results < 500ms; empty state shown when no match.
- **Priority:** Must

## 5. Map-based Search (Should)
- **Spec:** Google Maps view with pins; tap pin → preview card.
- **AC:** Pins cluster; radius filter works.
- **Priority:** Should

## 6. Business Detail View (Must)
- **Spec:** Cover, info, services list, reviews, book button.
- **AC:** Shows next available slot; gallery swipeable.
- **Priority:** Must

## 7. Service Categories (Must)
- **Spec:** Tree: Hair > Cut > Women. Used in nav and filters.
- **AC:** 10+ top categories seeded.
- **Priority:** Must

## 8. Booking Flow (Must)
- **Spec:** Select service → staff (opt) → slot → pay → confirm.
- **AC:** No double booking; confirmation SMS/email.
- **Priority:** Must

## 9. Availability & Slot Computation (Must)
- **Spec:** Provider sets hours + breaks; engine computes free slots minus bookings.
- **AC:** Overlap prevented; timezone correct.
- **Priority:** Must

## 10. Appointment Management (Must)
- **Spec:** Customer views upcoming/past; cancel/reschedule 24h before.
- **AC:** Cancel updates slot; provider notified.
- **Priority:** Must

## 11. Favorites (Should)
- **Spec:** Heart businesses/services; list in profile.
- **AC:** Sync across devices.
- **Priority:** Should

## 12. User Profile (Must)
- **Spec:** Edit name, phone, addresses, payment methods.
- **AC:** Changes save; validation on phone.
- **Priority:** Must

## 13. Reviews & Ratings (Must)
- **Spec:** 1–5 stars + text after visit; owner can reply.
- **AC:** Only verified booking; avg shown.
- **Priority:** Must

## 14. Payment Integration (Must)
- **Spec:** Stripe + Apple/Google Pay; hold or charge.
- **AC:** Fail shows retry; receipt emailed.
- **Priority:** Must

## 15. Notifications (Must)
- **Spec:** Push (FCM) + email for booking, reminder, promo.
- **AC:** Reminder 24h before; opt-out works.
- **Priority:** Must

## 16. Provider / Business Owner Portal (Must)
- **Spec:** Web app: manage profile, services, staff, hours, bookings, payouts.
- **AC:** Can block slot; see daily agenda.
- **Priority:** Must

## 17. Admin Dashboard (Should)
- **Spec:** Manage users, businesses, categories, disputes.
- **AC:** Suspend business; export data.
- **Priority:** Should

## 18. Background Jobs (BullMQ) (Must)
- **Spec:** Queues: reminders, no-show, report gen, image resize.
- **AC:** Job retries 3x; dashboard monitors.
- **Priority:** Must

---

## Priority Summary
- Must: 13 features
- Should: 4 features
- Could/Won't: none in v1

## Out of Scope (v1)
Chat with provider, multi-language, loyalty points.