# Product Specification: Planity Clone

## Product Overview
Planity Clone is a dual‑sided marketplace connecting customers with beauty and wellness professionals. It enables end‑users to discover salons, view real‑time availability, book and pay for services, manage appointments, and leave reviews. Business owners can manage their service menu, staff, working hours, and appointments via a dedicated portal. An admin dashboard provides oversight. The platform must support French locale standards (EUR, date/time formats, RGPD).

---

## User Personas
- **End‑User (Client):** Books services, manages appointments, writes reviews.
- **Provider (Business Owner):** Manages business profile, staff, services, schedules, and appointments.
- **Admin:** Oversees platform health, resolves disputes, manages all data.

---

## Feature Priority Legend
- **P0 (Must‑have):** Core for MVP; without these the product is not viable.
- **P1 (Should‑have):** Important for launch; can be delivered shortly after MVP.
- **P2 (Could‑have):** Nice‑to‑have; roadmap for later iterations.

---

## 1. Shared Types & Design System
**Priority:** P0  
Define all shared data models, UI components, and brand guidelines to ensure consistency across client, provider, and admin experiences.

### Acceptance Criteria
- TypeScript interfaces/classes for: User, Business, Staff, Service, ServiceCategory, Appointment, Review, Payment, Notification, TimeSlot, WorkingHours, BookingRule, Location, Image.
- Design tokens for colors (primary, secondary), typography (French‑friendly fonts), spacing, and radii.
- Reusable mobile components: Button, Input, Card, Chip, BottomSheet, DatePicker, TimeSlotGrid, MapView, StarRating.
- All components have dark/light mode support from the start.
- RGPD‑compliant cookie consent banner component.

---

## 2. User Authentication
**Priority:** P0  
Allow clients and providers to create accounts and log in securely. Support both email/password and social login (Google, Apple). Provider accounts require additional business verification (manual).

### Acceptance Criteria
- Registration with email, password (validation: strength, French phone number optional).
- Email verification: send link; account not active until verified.
- Login with email/password, Google, Apple Sign‑In.
- “Forgot password” flow with reset link.
- Logout clears session and sensitive local data.
- Guest accounts can browse without registration (see Guest Browse).
- JWT‑based authentication with access/refresh tokens.
- After login, redirect to previously intended page.
- Provider registration: separate onboarding flow collecting SIRET, business name, address, profession card; status set to “pending_review”.
- All auth screens handle network errors gracefully.

---

## 3. Guest Browse & Explore
**Priority:** P0  
Unregistered users can search for businesses, view details, service menus, and reviews to build trust before signing up. Booking is gated on authentication.

### Acceptance Criteria
- Guest can access all discovery features: search, filters, map, business details, reviews, service lists.
- On tapping “Book” or attempting to favorite, guest is prompted to sign up / log in with a clear modal (discouraging abandonment).
- After authentication, user returns to the same business/service context.
- No personal data stored locally for guests beyond search history (optional, P2).

---

## 4. Business Search & Discovery
**Priority:** P0  
Client can search by business name, locality, or street. Results display with cover photo, name, rating, distance, and next available slot.

### Acceptance Criteria
- Search bar with auto‑complete (min 3 chars) fetching businesses by name/address.
- Results list ordered by relevance, with infinite scroll.
- Filters: distance (slider 1‑20 km), rating (1–5 stars), price range (€‑€€€), service category (hair, nails, etc.), open now toggle, availability (today/this week).
- Sort options: relevance, highest rated, nearest, price low‑high/high‑low.
- Empty state with friendly illustration and suggestion to adjust filters.
- “Geolocate me” button to centre search on user location.
- Each result card shows: image, name, rating (stars + count), distance, first available slot (e.g., “Aujourd'hui à 14h”), and a heart icon for favorites.
- Results update in real‑time when map view is active (see Map‑based Search).
- Performance: search results load within 2 seconds on 3G.

---

## 5. Map‑based Search
**Priority:** P1  
Users can toggle between list and map view. Map shows business pins with clustering.

### Acceptance Criteria
- Toggle button switches to full‑screen map (Google Maps or MapLibre).
- Pins appear for each business in the viewport; cluster at high density.
- Tapping a pin shows a minimised card with name, rating, and a “view details” button.
- Map automatically pans when user drags; businesses reload.
- Map respects active filters from the search.
- “Recenter” button on user’s location.
- Deep link: tapping “view details” navigates to Business Detail screen.

---

## 6. Business Detail View
**Priority:** P0  
A comprehensive profile page for a salon, including services, staff (optional), gallery, reviews, and booking call to action.

### Acceptance Criteria
- Hero image carousel with swipe.
- Business name, rating (stars + total reviews), address with copy/open in maps, distance, status (open/closed + closing time).
- Sticky bottom bar with “Book” button.
- Sections: “About” (description, amenities, payment methods), “Services” (grouped by category), “Staff” (avatar, name, speciality, choose staff when booking), “Photos” (masonry grid), “Reviews” (top 3 with “See all”).
- Services list shows name, duration, price, and “Book” button inline.
- If business has multiple staff, user can optionally pick a staff member before seeing slots.
- Share button (system share sheet).
- Favorite toggle (heart).
- Deep links from search, map, notifications open this screen without navigation glitches.

---

## 7. Service Categories
**Priority:** P0  
A curated list of service categories to aid discovery and filtering. Each category shows popular businesses and services within it.

### Acceptance Criteria
- Home screen features a horizontally scrollable row of categories (icons + labels): Coiffure, Esthétique, Onglerie, Massage, Barbier, Epilation, Maquillage, Institut.
- Tapping a category opens a dedicated screen: top businesses for that category, sub‑categories, “See all services”, and search bar pre‑filtered.
- Categories are configurable from admin dashboard (add/edit/delete, change icon).
- Each category page includes a “Book nearby” quick‑slot view (P2).

---

## 8. Booking Flow
**Priority:** P0  
Step‑by‑step wizard to select service, staff (if applicable), date/time slot, extras, and confirm booking.

### Acceptance Criteria
- Flow: 1) Service selection → 2) Staff selection (optional, skip if only one) → 3) Date picker (calendar with available dates highlighted) → 4) Time slots (horizontal scrollable timeline, greyed out if past/full) → 5) Extras (add‑ons if defined, e.g., shampoo) → 6) Summary (service, date/time, staff, price, client info) → 7) Confirmation.
- Date picker shows next 30 days; days without availability are dimmed.
- Slot computation respects business working hours, staff availability, service duration, existing bookings, buffer times, and public holidays (see Availability & Slot Computation).
- User can select only slots that leave enough time for the service before closing.
- Guest wall: if not logged in, auth prompt appears after slot selection; booking continues seamlessly.
- User can apply a promo code (P2).
- On confirmation, appointment is created with status “confirmed”, payment initiated (if prepayment required).
- Booking summary screen shows appointment ID, QR code, and actions: Add to calendar, Cancel (if allowed), Get directions, Contact business.
- Loading and error states handled gracefully (e.g., slot taken before confirmation).

---

## 9. Availability & Slot Computation
**Priority:** P0 (backend logic)  
A deterministic algorithm that computes bookable time slots based on business rules, staff schedules, existing appointments, and cut‑off times.

### Acceptance Criteria
- Each staff member has defined working hours per day (can be irregular) and break times.
- Business defines: slot granularity (e.g., 15 min intervals), minimum booking notice (e.g., 2h), maximum future booking days (e.g., 60 days), buffer time after each service, and whether to allow overlapping bookings (no).
- Service has fixed duration; can have setup/cleanup extra time handled as buffer.
- Algorithm returns a list of start times (DateTime) for a given staff+date, excluding slots where: past, within notice period, conflicts with existing appointments, outside working hours, over break times, or insufficient time before closing.
- Handling of public holidays: a flag per business that can block all slots on certain dates (admin can import holidays).
- Cached slot generation; invalidation upon new booking, cancellation, or schedule change.
- Bulk query: when user picks a service, return availability for all staff over next N days (to display “first available” on search results).
- Concurrency: when two users attempt to book the last slot, one must fail with a clear message and refresh slots.
- Performance: slot computation for a single staff/date in under 200ms.

---

## 10. Payment Integration
**Priority:** P0  
Secure handling of online payments via Stripe, complying with PSD2/SCA. Support prepayment, deposit, or pay‑at‑salon options (configurable per business).

### Acceptance Criteria
- Stripe Elements integration for collecting card details (no raw card data on servers).
- Workflow: after appointment confirmation, if business requires prepayment or deposit, user is directed to Stripe checkout; on successful payment, appointment status updates to “paid” or “deposit_paid”.
- Business can configure: no online payment, full prepayment, deposit (fixed amount or %).
- Pre‑authorization hold (P2).
- Receipt generated and stored, accessible in appointment detail.
- Refund flow: admin or provider can initiate full/partial refund from dashboard; refund processed via Stripe; appointment status updated accordingly.
- Handle 3D Secure, payment failures gracefully with retry option.
- Display clear pricing inclusive of VAT; French invoices compliant with CGV.

---

## 11. Appointment Management
**Priority:** P0  
Clients can view upcoming and past appointments, cancel/rebook, and manage them.

### Acceptance Criteria
- Two tabs: “À venir” (upcoming) and “Historique” (past).
- Upcoming list sorted by date ascending; each card shows business name, service, date/time, staff, status (confirmed, pending payment, cancelled), and actions.
- Actions: view detail, cancel (if cancellation policy allows, see below), modify (rebook, change service, reschedule – see Booking Flow with existing appointment context), add to calendar, contact business (call/chat), pay (if payment pending).
- Cancellation policies configurable per business: free cancellation up to X hours before appointment; late cancellation fee (Stripe charge). Cancellation triggers refund if prepaid.
- When user cancels, slot is freed immediately.
- Past appointments: list with ability to leave a review if not already done (prompt after appointment end time).
- Reschedule flow: similar to booking but pre‑filled with existing details; old slot released only after successful re‑booking.
- Push notifications for reminders, confirmation, changes (see Notifications).

---

## 12. Reviews & Ratings
**Priority:** P1  
Allow clients to rate and review businesses after an appointment.

### Acceptance Criteria
- Only clients with a completed, non‑cancelled appointment can review.
- Review form: 1‑5 star rating, free‑text comment (optional), photo upload (optional, P2).
- Business detail page shows average rating, total reviews, and a breakdown star bar.
- Reviews list: latest first, with infinite scroll, user can see full review, report inappropriate.
- Provider can respond to reviews (one reply per review).
- Abuse prevention: one review per appointment; duplicate detection; moderation queue for reported reviews (admin dashboard).
- Review prompts as push notification 2 hours after appointment end (if user opted in).

---

## 13. Favorites
**Priority:** P1  
Users can save businesses to a favorites list for quick access.

### Acceptance Criteria
- Heart icon on search results, business detail, and map pin card; toggle to add/remove from favorites.
- A dedicated “My Favorites” screen listing saved businesses with mini‑cards (name, rating, next slot).
- Sync favorites across devices when user is logged in.
- Favorites empty state with suggestion to explore.

---

## 14. User Profile
**Priority:** P1  
Central hub for user’s personal information, preferences, and account actions.

### Acceptance Criteria
- Profile picture (editable), display name, email, phone number.
- Saved preferences: default payment method, notification settings.
- Privacy controls: opt‑in for marketing, data sharing (RGPD).
- Ability to delete account (anonymizes data, keeps booking records as required by law).
- Link to payment methods management (Stripe Payment Methods).
- History of transactions (invoices).
- Referral code section (P2).

---

## 15. Notifications
**Priority:** P1  
Transactional and reminder notifications to keep users informed.

### Acceptance Criteria
- Push notifications via Firebase Cloud Messaging (APNs for iOS).
- Types: booking confirmation, reminder (1 day / 1 hour before), cancellation confirmation, payment receipt, review prompt, provider message (if chat, P2).
- Real‑time updates: appointment status change (e.g., cancelled by provider).
- In‑app notification center (bell icon) with list, unread badge, and deep‑link to relevant screen.
- User preferences: toggle on/off per notification type.
- Background job to schedule reminders when appointment is booked; cancels/updates if appointment modified.

---

## 16. Provider / Business Owner Portal
**Priority:** P0  
A web‑based dashboard for business owners to manage their profile, staff, services, and appointments.

### Acceptance Criteria
- Separate web app with role‑based access (owner, staff).
- Dashboard overview: today’s appointments, revenue, upcoming schedule, client count.
- Business profile management: name, description, address, phone, photos, opening hours (per day with break periods), booking rules (notice, cancellation policy, payment settings).
- Staff management: add staff, set working hours, assign services, deactivate.
- Service management: create/edit services with name, duration, price, category, color, buffer time, image, online bookable flag.
- Appointment calendar (day/week view): drag‑and‑reschedule, mark no‑show, cancel, add notes, see payment status.
- Client list with appointment history.
- Notifications configuration: email/SMS reminders (SMS via Twilio, P2).
- View and respond to reviews.
- Financial reports: revenue summary, commissions (if any), downloadable invoices.
- Access only after admin approves business registration.

---

## 17. Admin Dashboard
**Priority:** P1  
Super‑admin panel for platform operations: manage businesses, users, payments, content, and handle incidents.

### Acceptance Criteria
- Dashboard with key metrics: active users, appointments today, revenue, new registrations, churn.
- Business management: approve/reject new business registrations, suspend businesses, view/edit business details, override settings.
- User management: search by email/name, disable accounts, view data for support.
- Appointment oversight: view all appointments, trigger cancellations/refunds, resolve disputes.
- Review moderation queue: approve, reject, ban.
- Category & content management: add/edit service categories, manage public holidays for all businesses.
- Promo codes: create and manage codes (P2).
- Configuration: global platform settings (commission, VAT rate, max booking days).
- Audit log for critical actions.
- Role‑based access: superadmin, support agent (limited).

---

## 18. Background Jobs (BullMQ)
**Priority:** P0 (infrastructure)  
Reliable job processing for tasks that must not block user requests.

### Acceptance Criteria
- Use BullMQ with Redis for queue management.
- Jobs: send email (verification, booking confirmation, invoices), push notifications (reminders, review prompts), SMS reminders (if integrated), invoicing generation, data cleanup, slot cache invalidation after booking modifications.
- Retry mechanism with exponential backoff for failed jobs (max 5 attempts).
- Dead‑letter queue for jobs that exceed retries, with admin alert.
- Scheduled jobs: reminders set with `delay` option at booking time; updated or removed if appointment is rescheduled/cancelled.
- Concurrency limits per queue to avoid overloading email providers.
- Monitoring: Bull Board UI accessible to admins to inspect queues, delete stuck jobs.
- Ensure idempotency where possible (e.g., sending duplicate email prevented by jobId based on appointment+type).

---

## Non‑Functional Requirements
- **RGPD Compliance:** All user data deletion/anonymisation flows, consent management, data portability.
- **Localization:** French language (default), date/time in FR, Euro currency, metric units.
- **Performance:** Client app launch ≤2s, search results ≤2s, slot computation ≤200ms.
- **Security:** OWASP top‑10 mitigation, HTTPS, input validation, rate limiting on auth.
- **Accessibility:** WCAG 2.1 Level AA for client app (colour contrast, screen reader support).

---

## Roadmap Summary
**MVP (P0):** User Auth, Guest Browse, Search & Discovery, Business Detail, Service Categories, Booking Flow, Availability Engine, Payment, Appointment Management, Provider Portal, Shared Types, Background Jobs.  
**Phase 2 (P1):** Map Search, Reviews & Ratings, Favorites, User Profile, Notifications, Admin Dashboard.  
**Later (P2):** Promo codes, staff selection screens, chat, referrals, advanced reporting.