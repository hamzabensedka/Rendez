# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty and wellness businesses (salons, spas, barbers). It supports discovery, booking, payments, reviews, and provider/admin management.

## Prioritization Legend
- P0 (Must): Core MVP, launch blocking.
- P1 (Should): Important for quality, soon after MVP.
- P2 (Could): Enhancements, post-launch.
- P3 (Won't): Out of scope for v1.

## Feature Specifications

### 1. User Authentication
Priority: P0
Description: Users sign up/login via email, phone OTP, or social (Google/Apple). Secure JWT sessions.
Acceptance Criteria:
- User can register with email+password; receives verification email.
- User can login with phone OTP (SMS).
- Social login returns valid profile.
- Passwords hashed (bcrypt).
- Session persists across app restarts.
- Logout invalidates token.

### 2. Guest Browse and Explore
Priority: P0
Description: Non-authenticated users can browse businesses, categories, and view details.
Acceptance Criteria:
- Guest can open app and see featured businesses.
- Guest can view business detail and services but booking prompts login.
- No personal data stored for guest.

### 3. Business Search and Discovery
Priority: P0
Description: Text search with filters (category, price, rating, distance).
Acceptance Criteria:
- Search returns relevant businesses by name, service, or tag.
- Filters apply correctly and combine.
- Empty state shown when no results.
- Search history saved for logged-in users.

### 4. Map-based Search
Priority: P1
Description: Interactive map showing business pins; tap to preview.
Acceptance Criteria:
- Map loads with user location (with permission).
- Pins reflect current filters.
- Tap pin shows bottom sheet with business summary.
- List/Map toggle works.

### 5. Business Detail View
Priority: P0
Description: Full page with info: photos, services, staff, hours, reviews.
Acceptance Criteria:
- Displays cover image, logo, address, contact.
- Lists services with durations and prices.
- Shows aggregate rating and recent reviews.
- Book CTA visible.

### 6. Service Categories
Priority: P0
Description: Taxonomy of categories (Hair, Nails, Spa, etc.) with subcategories.
Acceptance Criteria:
- Categories seed data present.
- User can navigate category to subcategory to businesses.
- Provider can assign services to categories.

### 7. Booking Flow
Priority: P0
Description: Multi-step: select service, staff (optional), date, slot, confirm.
Acceptance Criteria:
- Only available slots shown (computed).
- User can select employee if business has multiple.
- Summary shows price and time.
- On confirm, appointment created and confirmation sent.
- If unavailable, error message.

### 8. Appointment Management
Priority: P0
Description: User sees upcoming/past appointments; can cancel/reschedule.
Acceptance Criteria:
- List grouped by upcoming/past.
- Cancel respects business policy (e.g., 24h).
- Reschedule opens booking flow with pre-filled.
- Provider side updates accordingly.

### 9. Favorites
Priority: P1
Description: Users bookmark businesses.
Acceptance Criteria:
- Heart icon toggles favorite.
- Favorites list accessible from profile.
- Syncs across devices.

### 10. User Profile
Priority: P0
Description: Manage personal info, payment methods, notifications settings.
Acceptance Criteria:
- Edit name, phone, avatar.
- View saved addresses.
- Manage notification preferences.

### 11. Availability and Slot Computation
Priority: P0
Description: Backend computes slots from business hours, service duration, staff shifts, existing bookings.
Acceptance Criteria:
- Correctly excludes booked times.
- Handles lunch breaks and days off.
- Timezone aware.
- Returns slots in 15-min increments (configurable).

### 12. Shared Types and Design System
Priority: P0
Description: Common TS types, UI components (buttons, cards, colors) for web/mobile.
Acceptance Criteria:
- Monorepo package with types.
- Storybook shows components.
- Consistent theme tokens.

### 13. Reviews and Ratings
Priority: P1
Description: Users rate after appointment; display on business.
Acceptance Criteria:
- Only verified appointments can review.
- Star rating 1-5 and text.
- Business can reply.
- Average rating recalculated.

### 14. Payment Integration
Priority: P0 (deposit) / P1 (full)
Description: Stripe/Payment gateway for cards, maybe wallet.
Acceptance Criteria:
- User adds card securely (PCI compliant).
- Charge or authorize on booking.
- Refund on cancel per policy.
- Payment failure handled gracefully.

### 15. Notifications
Priority: P1
Description: Push (FCM/APNs) and email for booking confirm, remind, cancel.
Acceptance Criteria:
- Opt-in push permission.
- Triggered on events via background job.
- User can mute types.

### 16. Provider / Business Owner Portal
Priority: P0 (basic) / P1 (advanced)
Description: Web dashboard for businesses to manage profile, services, staff, slots, appointments.
Acceptance Criteria:
- Login as provider.
- Edit business info, upload photos.
- Add/edit services and categories.
- View calendar and appointments.
- Set working hours and breaks.

### 17. Admin Dashboard
Priority: P1
Description: Super admin manages users, businesses, categories, flag content.
Acceptance Criteria:
- Approve/reject business registrations.
- Disable users/businesses.
- View analytics (bookings count, revenue).
- Manage category taxonomy.

### 18. Background Jobs (BullMQ)
Priority: P1
Description: Queue for notifications, reminder emails, slot cache warming, analytics.
Acceptance Criteria:
- BullMQ workers process jobs reliably.
- Retry on failure with backoff.
- Dead-letter queue for errors.
- Job dashboard (optional).

## Global Acceptance
- Responsive on iOS/Android/web.
- Accessibility minimal (labels).
- Logging and monitoring.