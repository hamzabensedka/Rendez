# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with local beauty and wellness businesses (salons, barbers, spas). It allows browsing, discovering, and booking services, managing appointments, and provides business owners a portal to manage their offerings and availability. The product aims to deliver a seamless booking experience similar to Planity.

## Personas
- Client: searches for services, books appointments, manages bookings.
- Guest: browses without account.
- Business Owner: manages business profile, services, slots, appointments.
- Admin: oversees platform, moderates content, handles disputes.

## Prioritization
P0: must-have for MVP; P1: important post-MVP; P2: nice-to-have.

## 1. User Authentication
Description: Secure sign-up/login for clients via email, phone OTP, and social providers.
Acceptance Criteria:
- Given a new user, when they submit valid email and password, then account is created and verification email sent.
- Given a registered user, when they enter correct credentials, then they are logged in and token stored.
- Passwords hashed; JWT or session auth; logout clears session.
Priority: P0

## 2. Guest Browse & Explore
Description: Non-authenticated users can explore businesses and services.
Acceptance Criteria:
- Given a guest, when they open app, then they see featured businesses and categories.
- Guests can view business details but booking requires login.
- Guest state persisted via local storage for favorites (optional).
Priority: P0

## 3. Business Search & Discovery
Description: Search by name, category, service, or keyword with filters (price, rating, distance).
Acceptance Criteria:
- Given a user, when they type query, then results update with debounce.
- Filters apply correctly and combine with search.
- Empty state shown when no results.
Priority: P0

## 4. Map-based Search
Description: Display businesses on interactive map with pins; tap pin shows summary.
Acceptance Criteria:
- Given user grants location, map centers on them.
- Pins reflect current search/filter results.
- Selecting pin navigates to business detail.
Priority: P1

## 5. Business Detail View
Description: Comprehensive view with info, services, staff, photos, reviews, and book button.
Acceptance Criteria:
- Shows address, hours, contact, list of services with prices/durations.
- Displays aggregate rating and recent reviews.
- Book button initiates booking flow.
Priority: P0

## 6. Service Categories
Description: Hierarchical categories (e.g., Hair > Coloring) for organizing services.
Acceptance Criteria:
- Categories seeded and manageable via admin.
- Businesses assign services to categories.
- Clients browse by category from home.
Priority: P0

## 7. Booking Flow
Description: Multi-step flow: select service, staff (optional), date, available slot, confirm, pay.
Acceptance Criteria:
- Only slots computed from availability shown.
- User can switch service/staff without losing context.
- On confirm, appointment created and confirmation sent.
Priority: P0

## 8. Appointment Management
Description: Clients view upcoming/past appointments, reschedule, cancel.
Acceptance Criteria:
- Upcoming list sorted by date.
- Cancel respects business policy (free cancel before X hours).
- Reschedule re-enters booking flow with prefilled data.
Priority: P0

## 9. Favorites
Description: Clients bookmark businesses or services.
Acceptance Criteria:
- Heart icon toggles favorite.
- Favorites list accessible from profile.
- Synced to server when logged in.
Priority: P1

## 10. User Profile
Description: Manage personal info, payment methods, notifications settings, favorites.
Acceptance Criteria:
- User can update name, phone, avatar.
- Can delete account with confirmation.
- Shows loyalty or stats (optional).
Priority: P1

## 11. Availability & Slot Computation
Description: Engine that computes bookable slots based on business hours, service duration, staff shifts, and existing appointments.
Acceptance Criteria:
- Given business open 9-17, service 60min, no appointments, then slots every 60min from 9 to 16.
- Overlapping appointments removed.
- Buffer times respected.
- Timezone aware.
Priority: P0

## 12. Shared Types & Design System
Description: Common TypeScript types, UI components, color palette, typography.
Acceptance Criteria:
- Shared package with types for User, Business, Appointment, etc.
- Component library includes Button, Card, Input, Modal.
- Design tokens documented.
Priority: P0 (foundational)

## 13. Reviews & Ratings
Description: Clients leave star rating and text after completed appointment.
Acceptance Criteria:
- Only verified clients can review.
- Average rating recalculated on new review.
- Inappropriate content flagged to admin.
Priority: P1

## 14. Payment Integration
Description: Stripe/PCI-compliant payments for booking deposits or full payment.
Acceptance Criteria:
- User can add card and pay.
- Payment failure handled gracefully, appointment not confirmed.
- Refunds processed via admin or automated on cancel.
Priority: P0

## 15. Notifications
Description: Push and email notifications for booking confirm, remind, cancel, promos.
Acceptance Criteria:
- User opts in/out.
- Reminder sent 24h before appointment via background job.
- Localization supported.
Priority: P1

## 16. Provider / Business Owner Portal
Description: Web/mobile portal for owners to manage business profile, services, staff, availability, appointments, analytics.
Acceptance Criteria:
- Owner can create/edit business, upload photos.
- Manage service catalog and pricing.
- View calendar and manually add appointments.
- Set working hours and breaks.
Priority: P0

## 17. Admin Dashboard
Description: Super admin manages users, businesses, categories, reviews, disputes.
Acceptance Criteria:
- Ability to suspend business or user.
- Moderate reviews and categories.
- View platform metrics.
Priority: P1

## 18. Background Jobs (BullMQ)
Description: Async processing for notifications, slot updates, reminder emails, analytics.
Acceptance Criteria:
- BullMQ queues for email, push, report generation.
- Failed jobs retried with backoff.
- Queue dashboard for monitoring.
Priority: P1

## Success Metrics
- Booking conversion rate, retention, number of businesses onboarded.