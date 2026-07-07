# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first appointment booking platform for beauty and wellness services. This document defines features, acceptance criteria, and priorities for the MVP and post-MVP.

## Feature Priorities
- P0: Must-have for launch
- P1: Important, soon after launch
- P2: Nice-to-have

## 1. User Authentication
Description: Users can sign up, log in, and reset password via email or phone. Social login (Google, Apple) supported.
Acceptance Criteria:
- User can register with email and password; email verification required.
- User can log in with valid credentials; invalid shows error.
- Password reset flow sends email with link.
- Social login returns JWT and creates account if new.
- Sessions persist via secure token storage.
Priority: P0

## 2. Guest Browse and Explore
Description: Non-authenticated users can browse businesses and services.
Acceptance Criteria:
- Guest can view home screen with featured businesses and categories.
- Guest can open business detail and see services but booking prompts login.
- No personal data stored for guest.
Priority: P0

## 3. Business Search and Discovery
Description: Search businesses by name, service, or keyword with filters.
Acceptance Criteria:
- Search bar returns results matching name, service, or tag.
- Filters: distance, rating, price, availability.
- Results paginated; empty state shown.
Priority: P0

## 4. Map-based Search
Description: View businesses on map with geolocation.
Acceptance Criteria:
- Map shows pins for businesses within viewport.
- Tapping pin opens preview card.
- Search this area updates results.
- User can grant location permission; default to city center if denied.
Priority: P1

## 5. Business Detail View
Description: Comprehensive view of a business: info, services, staff, photos, reviews.
Acceptance Criteria:
- Shows cover image, address, hours, contact.
- Lists services with durations and prices.
- Displays staff members if applicable.
- Shows aggregate rating and recent reviews.
- Book button initiates booking flow.
Priority: P0

## 6. Service Categories
Description: Hierarchical categories such as Hair > Coloring.
Acceptance Criteria:
- Categories displayed on home and search.
- Selecting category filters businesses or services.
- Admin can manage categories via dashboard.
Priority: P0

## 7. Booking Flow
Description: Multi-step flow: select service, staff, date, slot, confirm.
Acceptance Criteria:
- User selects service from business.
- If multiple staff, choose staff or any.
- Date picker shows days with availability.
- Slot computation shows free times (see Availability).
- Confirm shows summary and payment if required.
- On success, appointment created and notification sent.
Priority: P0

## 8. Appointment Management
Description: Users view upcoming or past appointments, reschedule, cancel.
Acceptance Criteria:
- List of appointments with status.
- Cancel respects business policy (free cancel before X hours).
- Reschedule opens booking flow with prefilled data.
- History shows completed or no-show.
Priority: P0

## 9. Favorites
Description: Users bookmark businesses.
Acceptance Criteria:
- Heart icon on business card or detail toggles favorite.
- Favorites list in profile.
- Push notification for favorite business offers optional.
Priority: P1

## 10. User Profile
Description: Manage personal info, payment methods, notifications settings.
Acceptance Criteria:
- Edit name, phone, avatar.
- View saved addresses.
- Manage notification preferences.
- Delete account with confirmation.
Priority: P0

## 11. Availability and Slot Computation
Description: Backend computes available slots based on business hours, staff shifts, existing appointments, service duration.
Acceptance Criteria:
- Given business, service, date, returns array of start times.
- Considers buffer between appointments.
- Handles staff-specific availability.
- Timezone aware.
- Cached for performance, invalidated on changes.
Priority: P0

## 12. Shared Types and Design System
Description: Common TypeScript types, UI components, theme.
Acceptance Criteria:
- Shared package with types (User, Business, Appointment, etc.).
- Design system: buttons, cards, colors, typography consistent.
- Used across mobile and web portals.
Priority: P0

## 13. Reviews and Ratings
Description: Users rate and review after appointment.
Acceptance Criteria:
- Only users with completed appointment can review.
- Star rating 1-5, text optional.
- Business can reply via provider portal.
- Reviews visible on business detail, sortable.
Priority: P1

## 14. Payment Integration
Description: Stripe or PayPal for card payments, deposits, or full prepaid.
Acceptance Criteria:
- User can add card, pay for booking if required.
- Handles 3DS, failure, refund.
- Provider receives payout per admin settings.
- Invoice email sent.
Priority: P0 for prepaid, P1 for pay later

## 15. Notifications
Description: Push (Firebase), email, SMS for booking confirm, remind, cancel.
Acceptance Criteria:
- On booking, confirmation push and email.
- Reminder 24h before.
- Cancel or update triggers notification.
- User can opt-out per type.
Priority: P0

## 16. Provider or Business Owner Portal
Description: Web app for businesses to manage profile, services, staff, availability, appointments, reviews.
Acceptance Criteria:
- Login as provider.
- Edit business info, photos, hours.
- CRUD services and categories assignment.
- Set staff and working schedules.
- View calendar of appointments, manually book.
- Respond to reviews.
- View basic analytics.
Priority: P0

## 17. Admin Dashboard
Description: Super admin manages categories, users, providers, disputes, payments.
Acceptance Criteria:
- Admin login with role.
- Approve or reject provider signups.
- Manage service categories and tags.
- Suspend users or businesses.
- View platform metrics.
- Configure commission, payment settings.
Priority: P1

## 18. Background Jobs (BullMQ)
Description: Queue-based jobs for notifications, slot cache, reminders, sync.
Acceptance Criteria:
- BullMQ queues for email, push, SMS.
- Cron job for daily reminder generation.
- Retry on failure with exponential backoff.
- Monitor queue health via dashboard.
Priority: P0