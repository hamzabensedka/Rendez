# Planity Clone - Product Specification

## 1. User Authentication
- Description: Customers and business owners can sign up, log in, reset password via email/phone.
- Acceptance Criteria:
  - AC1: User can register with email and password, receiving verification email.
  - AC2: User can log in with validated credentials and receive JWT.
  - AC3: Password reset flow sends secure link.
  - AC4: Social login (Google/Apple) supported for customers.
- Priority: P0

## 2. Guest Browse & Explore
- Description: Non-authenticated users can browse businesses and services.
- AC1: Guest can view homepage with featured businesses and categories.
- AC2: Guest can search and view business details but cannot book.
- AC3: Prompt to login appears when attempting booking.
- Priority: P0

## 3. Business Search & Discovery
- Description: Search by name, category, location, filters (price, rating, availability).
- AC1: Search returns relevant businesses with pagination.
- AC2: Filters apply correctly and persist in URL.
- AC3: Sorting by distance, rating, popularity.
- Priority: P0

## 4. Map-based Search
- Description: Interactive map showing business pins.
- AC1: Map displays businesses within viewport.
- AC2: Clicking pin opens preview card.
- AC3: Map updates results when panned/zoomed (debounced).
- Priority: P1

## 5. Business Detail View
- Description: Show info: photos, services, staff, hours, reviews, location.
- AC1: Displays all required info from API.
- AC2: Shows available slots for selected service.
- AC3: 'Book' button initiates booking flow.
- Priority: P0

## 6. Service Categories
- Description: Taxonomy of services (Hair, Nails, Spa, etc.) with sub-categories.
- AC1: Categories seeded and manageable via admin.
- AC2: Each business assigns offered categories/services.
- AC3: Customers can browse by category.
- Priority: P0

## 7. Booking Flow
- Description: Multi-step: select service, staff, date, slot, confirm, pay.
- AC1: User can complete booking as authenticated customer.
- AC2: Real-time slot availability checked.
- AC3: Confirmation screen and email sent.
- Priority: P0

## 8. Appointment Management
- Description: Customers view upcoming/past appointments, reschedule/cancel.
- AC1: List appointments with status.
- AC2: Cancellation triggers refund per policy.
- AC3: Reschedule uses same booking flow with prefilled data.
- Priority: P0

## 9. Favorites
- Description: Customers can favorite businesses.
- AC1: Add/remove favorite from list or detail.
- AC2: Favorites list accessible in profile.
- AC3: Sync across devices.
- Priority: P1

## 10. User Profile
- Description: Manage personal info, addresses, payment methods, notifications settings.
- AC1: Edit name, phone, email.
- AC2: Add default address.
- AC3: View booking history.
- Priority: P0

## 11. Availability & Slot Computation
- Description: Compute slots based on business hours, service duration, staff shifts, existing bookings.
- AC1: Generate slots at configurable intervals (e.g., 15 min).
- AC2: Exclude breaks and booked times.
- AC3: Handle timezone correctly.
- Priority: P0

## 12. Shared Types & Design System
- Description: Common TypeScript types, UI components, theme.
- AC1: Repository with shared package.
- AC2: Components documented (Button, Card, Input).
- AC3: Consistent styling across web/mobile.
- Priority: P1

## 13. Reviews & Ratings
- Description: Customers rate and review after appointment.
- AC1: Submit 1-5 star with text.
- AC2: Business detail shows aggregate rating and recent reviews.
- AC3: Business owner can respond.
- Priority: P1

## 14. Payment Integration
- Description: Stripe/PayPal for cards, wallets.
- AC1: Secure checkout with PCI compliance.
- AC2: Support partial deposit or full payment.
- AC3: Handle failures and retries.
- Priority: P0

## 15. Notifications
- Description: Email, SMS, push for booking confirm, remind, cancel.
- AC1: Triggered by events via background jobs.
- AC2: User can opt-out.
- AC3: Localization supported.
- Priority: P1

## 16. Provider / Business Owner Portal
- Description: Manage profile, services, staff, availability, bookings, reviews.
- AC1: Dashboard with today's appointments.
- AC2: CRUD on services and staff.
- AC3: View analytics (revenue, utilization).
- Priority: P0

## 17. Admin Dashboard
- Description: Platform-wide management: users, businesses, categories, moderation.
- AC1: Approve/reject business registrations.
- AC2: Manage categories and global settings.
- AC3: View system metrics.
- Priority: P1

## 18. Background Jobs (BullMQ)
- Description: Queue for notifications, slot computation, reminders.
- AC1: Redis-backed queue with workers.
- AC2: Retry on failure with exponential backoff.
- AC3: Idempotent job handling.
- Priority: P1

## Priorities Summary
P0: Core MVP. P1: Important post-MVP. P2: Nice-to-have (none listed but can note).