# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first web app + provider portal + admin).

## Priorities
- **P0 (MVP):** User Auth, Guest Browse, Search & Discovery, Map Search, Business Detail, Categories, Booking Flow, Appointment Mgmt, Availability & Slots, Shared Types/Design, Notifications (basic), Provider Portal (core).
- **P1:** Favorites, Reviews & Ratings, Payment Integration, User Profile, Admin Dashboard, Background Jobs.
- **P2:** Advanced notifications, provider analytics, admin moderation tools.

---

## 1. User Authentication (P0)
**Description:** Secure signup/login for clients and businesses.
**Features:** Email+password, Google/Apple OAuth, OTP email verification, password reset, role selection (client/provider).
**Acceptance Criteria:**
- User can register with email and verify via link.
- OAuth login works on iOS/Android/web.
- Invalid credentials show error; 5 fails trigger lockout 15m.
- JWT stored securely; refresh token rotates.

## 2. Guest Browse & Explore (P0)
**Description:** Non-logged users can explore homepage and businesses.
**Features:** Curated categories, top-rated, near-me preview, CTAs to login for booking.
**Acceptance Criteria:**
- Guest sees homepage with 6+ categories.
- Tapping book prompts login/signup.
- No personal data stored for guest.

## 3. Business Search & Discovery (P0)
**Description:** Text search with filters.
**Features:** Query by name/service, filter by category, price, rating, distance, availability today.
**Acceptance Criteria:**
- Search returns <500ms for 10k businesses.
- Filters combine with AND logic.
- Empty state shown when no results.

## 4. Map-based Search (P0)
**Description:** Google Maps view with pins.
**Features:** Geolocation, draggable map updates list, cluster pins, tap pin → preview card.
**Acceptance Criteria:**
- Map loads with user location (permission handled).
- Moving map triggers debounced search.
- Pin preview shows name, rating, next slot.

## 5. Business Detail View (P0)
**Description:** Full business profile.
**Features:** Gallery, services, staff, hours, reviews summary, book button.
**Acceptance Criteria:**
- Shows all active services with prices/durations.
- Displays next 3 available slots.
- Reviews tab loads paginated.

## 6. Service Categories (P0)
**Description:** Taxonomy of beauty/wellness services.
**Features:** Hierarchical (e.g., Hair → Cut → Women). Seed 50+ categories.
**Acceptance Criteria:**
- Categories manageable via admin.
- Each business maps to ≥1 category.
- Search uses category IDs.

## 7. Booking Flow (P0)
**Description:** Multi-step booking.
**Steps:** Select service → staff (opt) → date → slot → confirm → pay (if P1) → success.
**Acceptance Criteria:**
- Only slots from availability shown.
- Double-book prevented via lock.
- Confirmation saved to appointment.

## 8. Appointment Management (P0)
**Description:** Client and provider views.
**Features:** Upcoming/past, cancel (24h rule), reschedule.
**Acceptance Criteria:**
- Client sees status (confirmed/done/cancelled).
- Provider can mark completed.
- Cancel frees slot.

## 9. Favorites (P1)
**Description:** Save businesses.
**Features:** Heart icon, favorites list, removed sync.
**Acceptance Criteria:**
- Saved only when logged in.
- List sorted by recent.

## 10. User Profile (P1)
**Description:** Client profile.
**Features:** Name, phone, addresses, payment methods, notifications prefs.
**Acceptance Criteria:**
- Edits persist.
- Phone validated E.164.

## 11. Availability & Slot Computation (P0)
**Description:** Core engine.
**Features:** Business hours, staff schedules, service duration, breaks, buffer.
**Acceptance Criteria:**
- Slots generated in 15m increments.
- Overlap with existing appts excluded.
- Timezone correct per business.

## 12. Shared Types & Design System (P0)
**Description:** Mono-repo types and UI kit.
**Features:** TS interfaces, React Native + Web components, color/typography.
**Acceptance Criteria:**
- Single source of truth.
- Components documented.

## 13. Reviews & Ratings (P1)
**Description:** Post-visit reviews.
**Features:** 1–5 stars, text, photo, helpful votes.
**Acceptance Criteria:**
- Only verified clients review.
- Average shown on detail.

## 14. Payment Integration (P1)
**Description:** Stripe/Cards.
**Features:** Save card, charge on book, refund on cancel.
**Acceptance Criteria:**
- PCI compliant (Stripe).
- Failure rolls back booking.

## 15. Notifications (P0/P1)
**Features:** Email + push (FCM/APN) for confirm, remind, cancel.
**Acceptance Criteria:**
- Sent via BullMQ.
- User can opt out.

## 16. Provider / Business Owner Portal (P0)
**Description:** Web dashboard.
**Features:** Profile edit, services, staff, hours, appointments, slots override.
**Acceptance Criteria:**
- Provider logs in separated.
- Changes reflect in app <1m.

## 17. Admin Dashboard (P1)
**Description:** Super admin.
**Features:** Manage categories, users, businesses, disputes.
**Acceptance Criteria:**
- Role-based access.
- Audit log kept.

## 18. Background Jobs (BullMQ) (P1)
**Description:** Async tasks.
**Features:** Reminders, slot cache, report gen, sync.
**Acceptance Criteria:**
- Retry on fail (3x).
- Dashboard monitors queues.

---
**Open Questions:** Exact commission model, KYC for providers, multi-language.