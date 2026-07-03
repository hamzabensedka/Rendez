# Planity Clone - Product Specification

## 1. Executive Summary
Planity Clone is a comprehensive booking platform connecting customers with beauty & wellness businesses. It enables seamless discovery, booking, and management of appointments. The product consists of three main interfaces: a Customer Mobile App, a Provider/Business Owner Portal, and an Admin Dashboard. The primary goal is to maximize booking conversions through a frictionless user experience from search to payment.

---

## 2. Shared Types & Design System
**Priority: P0 (Foundation)**

### 2.1 Design System
- **Typography & Colors:** Consistent theme reflecting 'Calm & Professional Beauty'.
- **Component Library:** Reusable `BookingCard`, `TimeSlotChip`, `BusinessCard`, `StarRating`.
- **Accessibility:** Minimum contrast ratio of 4.5:1, touch targets minimum 44x44pt.

### 2.2 Shared Types (TypeScript Interfaces)
- **`Business`**: `id`, `name`, `category`, `lat`, `lng`, `address`, `rating`, `photos`, `openingHours`.
- **`Service`**: `id`, `name`, `duration`, `price`, `currency`, `category`.
- **`Employee`**: `id`, `name`, `photo`, `specialties`.
- **`Appointment`**: `id`, `businessId`, `serviceId`, `employeeId`, `userId`, `startTime`, `endTime`, `status`, `price`.
- **`User`**: `id`, `name`, `email`, `phone`, `avatar`, `role` (CUSTOMER | PROVIDER | ADMIN).

---

## 3. User Authentication
**Priority: P0**

### 3.1 User Stories
- As a user, I want to sign up with email/password or Google/Apple SSO so I can access the platform.
- As a guest, I want to browse businesses without registering.

### 3.2 Acceptance Criteria
1. User can register via Email + Password.
2. User can login via Google OAuth and Apple ID.
3. User receives a verification email upon registration.
4. JWT Access Token (15 min) and Refresh Token (7 days) stored securely (HttpOnly cookies for web, Secure Store for mobile).
5. Input validation errors (weak password, duplicate email) shown inline.
6. Password reset flow via email link within 24 hours.

---

## 4. Guest Browse & Explore
**Priority: P1**

### 4.1 User Stories
- As a guest, I want to view the home screen and trending businesses.
- As a guest, I want to search for services and view business details but be prompted to sign up only when booking.

### 4.2 Acceptance Criteria
1. Home feed loads without authentication.
2. Search bar and map view accessible.
3. "Book Now" CTA triggers a signup/login modal.
4. Business detail views (photos, reviews, map) fully available.

---

## 5. Business Search & Discovery
**Priority: P0**

### 5.1 User Stories
- As a user, I want to search businesses by name or service type.
- As a user, I want to filter results by rating, price, distance, and availability.

### 5.2 Acceptance Criteria
1. Free-text search supporting business names, service names, and categories.
2. Fuzzy search tolerance (handle typos).
3. Filter chips: Price Range, Rating (4.0+), Open Now, Distance.
4. Sort options: Recommended, Nearest, Top Rated, Lowest Price.
5. Infinite scroll with pagination (20 items/page).
6. Empty state with illustration and "Adjust Filters" CTA.

---

## 6. Map-based Search
**Priority: P1**

### 6.1 User Stories
- As a user, I want to see available businesses on a map near my current location.

### 6.2 Acceptance Criteria
1. Map loads centered on user's device location (if granted).
2. Business pins clustered when zoomed out.
3. Tapping a pin shows a compact business card with name, rating, and photo.
4. Map search boundary syncs with list results (viewport-based search).
5. "Search this area" button to refresh results when map is moved.

---

## 7. Service Categories
**Priority: P0**

### 7.1 User Stories
- As a user, I want to browse popular service categories (e.g., Hair, Nails, Massage).

### 7.2 Acceptance Criteria
1. Horizontal scrolling category list on home screen (top).
2. Category deep links: `/?category=hair` showing filtered businesses.
3. Category images/icons consistent with theme.
4. Each business shows sub-categories (e.g., Hair > Cut, Hair > Coloring).

---

## 8. Business Detail View
**Priority: P0**

### 8.1 User Stories
- As a user, I want to see business photos, services, reviews, and staff before booking.

### 8.2 Acceptance Criteria
1. Hero image carousel (click to expand gallery).
2. Sticky header with business name and "Book" CTA.
3. Sections: About, Services (with price/duration), Staff (with photo), Reviews, Map (static with direction link).
4. "Add to Favorites" heart icon toggle.
5. Share button generating deep link.
6. Display total number of reviews and average rating prominently.

---

## 9. Booking Flow
**Priority: P0**

### 9.1 User Stories
- As a user, I want to select a service, staff, date, and time in a step-by-step flow.

### 9.2 Acceptance Criteria
1. **Step 1: Service Selection**: List of services, user taps to select (single/multi-select if combo).
2. **Step 2: Employee Selection**: (Optional) "Any Available" selected by default.
3. **Step 3: Date & Time Picker**: Calendar displaying available days, time slots fetched from server (real-time availability).
4. **Step 4: Confirmation**: Summary of booking details, price, duration, business address.
5. **Step 5: Payment**: Integration with Stripe/PayPal. (If payment enabled).
6. User can go back to previous steps without losing state.
7. A lock on the selected slot for 5 minutes (timer visible) to prevent double booking.

---

## 10. Availability & Slot Computation
**Priority: P0**

### 10.1 User Stories
- As a user, I want to see only valid time slots that fit the service duration.

### 10.2 Acceptance Criteria
1. **Algorithm**: Available Slots = (Business Hours - Existing Bookings - Buffer Time).
2. Business Hours configured by Provider per day of the week.
3. Employee specific schedules if assigned, otherwise business-wide.
4. Buffer time (e.g., 5-15 min) between appointments configurable per service.
5. Support for recurring availability/blackout dates (holidays, vacations).
6. Client must never allow double booking in a single slot.
7. Timezone handling: Store all times in UTC, display in local timezone.

---

## 11. Appointment Management
**Priority: P0**

### 11.1 User Stories
- As a user, I want to view upcoming and past appointments.
- As a user, I want to reschedule or cancel an appointment.

### 11.2 Acceptance Criteria
1. "My Appointments" screen with tabs: Upcoming, Completed, Cancelled.
2. Upcoming list sorted by nearest date.
3. **Reschedule Flow**:
   - Tap Reschedule -> View business availability (same flow as booking).
   - Confirm new slot -> Old slot released immediately.
4. **Cancellation Flow**:
   - Confirmation modal with cancellation policy warning.
   - If within free cancellation limit (e.g., 24h before), refund initiated.
5. Add to Calendar (Google/Apple) button.
6. Appointment details: QR code for check-in (optional).

---

## 12. Favorites
**Priority: P1**

### 12.1 User Stories
- As a user, I want to save favorite businesses to track them easily.

### 12.2 Acceptance Criteria
1. "Save" button on Business Card and Detail view.
2. "Favorites" tab in Profile section.
3. List displays business cards with current availability status.
4. Swipe-to-delete or unfavorite toggle.
5. Persistent sync across devices via backend.

---

## 13. User Profile
**Priority: P1**

### 13.1 User Stories
- As a user, I want to manage my personal info, notification settings, and payment methods.

### 13.2 Acceptance Criteria
1. Edit profile photo, name, phone, email.
2. Phone number verification via SMS OTP.
3. Notification preferences toggle: Email, Push (Booking reminders, Promos).
4. Saved payment methods (masked card number) with ability to delete.
5. Language preference (EN/FR).
6. Account deletion flow with confirmation and data retention disclaimer.

---

## 14. Reviews & Ratings
**Priority: P1**

### 14.1 User Stories
- As a user, I want to leave a rating and review after my appointment.
- As a user, I want to read reviews to judge service quality.

### 14.2 Acceptance Criteria
1. Prompt to review appears 30 minutes after appointment end time (Push notification).
2. Review form: 1-5 star rating, optional text (min 10 chars), optional photo upload.
3. Provider cannot delete reviews, only report (Admin review).
4. Reviews sorted by 'Most Recent' and 'Highest Rated'.
5. Business Detail shows rating distribution histogram (5 stars: 80%, 4 stars: 15%, etc.).

---

## 15. Payment Integration
**Priority: P0**

### 15.1 User Stories
- As a user, I want to pay securely via credit card or digital wallet.

### 15.2 Acceptance Criteria
1. Integration with **Stripe** (Primary) and **PayPal** (Secondary).
2. Card input uses Stripe Elements (PCI-DSS compliant).
3. Support for "Pay Now" (full prepayment) and "Pay at Venue" (token hold).
4. Receipt sent via email after success (PDF link).
5. Refund status visible in Appointment details.
6. Handle 3D Secure authentication.

---

## 16. Notifications
**Priority: P0**

### 16.1 User Stories
- As a user, I want to receive booking confirmations and reminders.

### 16.2 Acceptance Criteria
1. **Triggers**: Booking Confirmed, Rescheduled, Cancelled, Review Request, Reminder (24h prior).
2. **Channels**: Firebase Push Notification, Email (SendGrid/SES).
3. In-app notification center with read/unread status.
4. Notification grouping (Today, This Week, Earlier).
5. Opt-out handling to prevent spam.

---

## 17. Provider / Business Owner Portal
**Priority: P0**

### 17.1 User Stories (Web Dashboard)
- As a provider, I want to manage my services, schedules, and employees.
- As a provider, I want to view my booking calendar and income analytics.

### 17.2 Acceptance Criteria
1. **Registration**: Separate business signup flow (Business Name, Category, Address).
2. **Dashboard Home**:
   - Today's appointments list (Status: Upcoming, In Progress).
   - Quick stats: Bookings today, Revenue this month, New clients.
3. **Calendar View**:
   - Day/Week/Month views. Drag-and-drop reschedule (Admin override).
   - Block time slots (Manual override).
4. **Services Management**:
   - CRUD for services (Name, Duration, Price, Buffer time, Color coding).
5. **Staff Management**:
   - Invite employees by email. Set permissions (Viewer, Editor).
   - Assign services to specific staff.
   - Set individual working hours overriding business hours.
6. **Client Management**: Search clients, view history, add private notes.
7. **Settings**: Business hours (per day), holiday blackout dates, photo upload.

---

## 18. Admin Dashboard
**Priority: P1**

### 18.1 User Stories (Internal/Admin)
- As an admin, I want to monitor platform metrics and manage reported content.

### 18.2 Acceptance Criteria
1. **KPI Widgets**: Total Bookings, GMV (Gross Merchandise Volume), Churn Rate, Active Businesses.
2. **User/Business Management**:
   - Search, suspend, or verify businesses.
   - Suspend/ban customer accounts.
3. **Review Moderation**: Queue of reported reviews. Approve/Delete actions.
4. **Configurations**: Update commission percentages, global cancellation policy.
5. **System Health**: Check background job statuses (BullMQ dashboard).

---

## 19. Background Jobs (BullMQ)
**Priority: P1**

### 19.1 Technical Background Processes
1. **Slot Release Job**: Release abandoned booking slots (after 5 min lock expiration).
2. **Reminder Job**: Scheduled 24 hours before appointment. Bulk aggregation per interval.
3. **Review Request Job**: Scheduled 30 minutes after appointment end.
4. **Report Generation**: Weekly provider summary emails (CSV revenue report).
5. **Data Cleanup**: Anonymize deleted user data after 30 days.

### 19.2 Monitoring
- Bull Board UI integrated for Admin to view failed jobs and retry logic.

---

## 20. Non-Functional Requirements
- **Performance**: API response times < 200ms for critical paths (Search, Booking).
- **Scalability**: Handle 10,000 concurrent slot requests per second.
- **Localization**: i18n support for English and French.
- **Security**: Rate limiting on auth endpoints; input sanitization. GDPR compliant data deletion.