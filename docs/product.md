# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style salon/beauty booking app (mobile-first + web portals).
**Priority legend:** P0 = must-have launch, P1 = soon after, P2 = later.

## 1. User Authentication (P0)
- Email/phone signup, login, logout.
- OAuth (Google/Apple).
- Password reset.
- JWT-based sessions with refresh tokens.
**AC:**
- User can register in <2 min.
- Invalid creds show error.
- Session persists across app restart.

## 2. Guest Browse & Explore (P0)
- Guests view home, businesses, categories without login.
- Prompt login only at booking.
**AC:**
- Guest sees curated lists.
- No private data exposed.

## 3. Business Search & Discovery (P0)
- Text search by name, service, location.
- Filters: category, price, rating, distance.
**AC:**
- Results <1s.
- Empty state shown if none.

## 4. Map-based Search (P1)
- Google Maps view of businesses.
- Cluster pins, tap for preview.
**AC:**
- Map loads <3s.
- Pin opens detail.

## 5. Business Detail View (P0)
- Photos, services, staff, hours, reviews.
- CTA “Book”.
**AC:**
- All data accurate.
- Book button works.

## 6. Service Categories (P0)
- Tree: Hair, Nails, Spa, etc.
- Sub-services with duration/price.
**AC:**
- Categories editable by admin.
- User filters by leaf.

## 7. Booking Flow (P0)
- Select service, staff, slot, pay.
- Multi-service cart.
**AC:**
- No double booking.
- Confirmation sent.

## 8. Appointment Management (P0)
- User views upcoming/past.
- Reschedule/cancel (policy-based).
**AC:**
- Changes reflect in provider calendar.
- User notified.

## 9. Favorites (P1)
- Save businesses/services.
- List in profile.
**AC:**
- Sync across devices.

## 10. User Profile (P0)
- Name, contact, addresses, payment methods.
**AC:**
- Editable.
- GDPR delete available.

## 11. Availability & Slot Computation (P0)
- Provider hours + service duration - busy.
- Generate slots in 15-min steps.
**AC:**
- Accurate real-time.
- Timezone correct.

## 12. Shared Types & Design System (P0)
- TS types, UI kit (React Native + Web).
- Brand colors, components.
**AC:**
- Reused everywhere.
- Docs in repo.

## 13. Reviews & Ratings (P1)
- 1–5 stars + text after visit.
- Provider replies.
**AC:**
- Only verified visits.
- Moderation queue.

## 14. Payment Integration (P0)
- Stripe/Apple Pay.
- Deposit or full.
**AC:**
- PCI compliant.
- Refund flow.

## 15. Notifications (P0)
- Push (Expo) + email/SMS.
- Booking, reminder, promo.
**AC:**
- Opt-in controls.
- Delivered <5 min.

## 16. Provider / Business Owner Portal (P1)
- Manage profile, services, staff, slots.
- View bookings, payouts.
**AC:**
- Self-serve.
- Live updates.

## 17. Admin Dashboard (P0)
- Users, businesses, categories, flags.
- Analytics.
**AC:**
- Role-based access.
- Audit log.

## 18. Background Jobs (BullMQ) (P1)
- Reminders, no-show, sync, reports.
**AC:**
- Retry/backoff.
- Monitor in Redis.

## Priority Summary
- P0: 1,2,3,5,7,8,10,11,12,14,15,17
- P1: 4,9,13,16,18
- P2: none at launch