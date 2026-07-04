# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with beauty, wellness, and personal care businesses. It enables seamless discovery, booking, and management of appointments. The system includes a consumer app, a provider portal, and an admin dashboard, supported by a robust backend with background jobs.

## 2. Goals & Success Metrics
- **Goals:** Simplify appointment booking, increase business visibility, reduce no-shows, and streamline operations for providers.
- **Success Metrics:** Booking completion rate ≥ 90%, average time to book < 60 seconds, provider onboarding time < 10 minutes, NPS ≥ 50, admin issue resolution < 24h.

## 3. User Roles
- **Guest:** Unauthenticated user who can browse, search, and view business details but cannot book.
- **Customer:** Authenticated user who can book, manage appointments, leave reviews, and save favorites.
- **Provider:** Business owner or staff who manages services, availability, appointments, and reviews via the Provider Portal.
- **Admin:** Platform administrator who oversees users, businesses, and system health via the Admin Dashboard.

## 4. Feature Specifications

### 4.1 User Authentication
**Priority:** P0 (Must Have)
**Description:** Secure registration and login for customers, providers, and admins. Supports email/password and social login (Google, Apple).
**Acceptance Criteria:**
- User can sign up with email, password, first name, last name, and role selection (customer or provider).
- Email verification required; a verification link sent, account inactive until verified.
- Password reset flow: request link, receive email, set new password.
- Social login via Google and Apple ID, auto-creates account if not exists.
- Session management with JWT (access + refresh tokens), token refresh on app foreground.
- Logout clears local tokens.
- Admin credentials are seeded separately, not via public registration.

### 4.2 Guest Browse & Explore
**Priority:** P0
**Description:** Unauthenticated users can explore businesses, services, and reviews without logging in.
**Acceptance Criteria:**
- Guest can view home screen with curated categories and popular businesses.
- Search and filter businesses freely.
- View business detail page, including services, photos, ratings, and reviews.
- Attempting to book, favorite, or write a review triggers a login/signup prompt.
- Guest can access location-based results (if location permission granted).

### 4.3 Business Search & Discovery
**Priority:** P0
**Description:** Customers can search for businesses by name, category, service, or location. Results display relevant matches with ratings and distance.
**Acceptance Criteria:**
- Search bar with autocomplete (min 3 chars) showing business names and categories.
- Results list with business name, main image, rating, distance, and next available slot.
- Filters: category (multi-select), price range, rating (min stars), availability (today/tomorrow/this week).
- Sorting: relevance, rating, distance, price low-high/high-low.
- Pagination (infinite scroll) with a “Load more” button.
- Empty state message when no results.

### 4.4 Map-based Search
**Priority:** P1 (Should Have)
**Description:** Interactive map view showing businesses based on user location or search area.
**Acceptance Criteria:**
- Map screen with markers for businesses, clustering at high zoom levels.
- Tapping a marker shows a preview card with business name, rating, and next slot.
- Dragging/zooming the map updates results dynamically.
- Search within map area; results list syncs with map view.
- User location button to re-center.

### 4.5 Business Detail View
**Priority:** P0
**Description:** Comprehensive page for a business with all information needed to book.
**Acceptance Criteria:**
- Hero image carousel, business name, category, rating, distance, and address.
- “About” section with description, amenities, and business hours.
- Services tab: list of services with name, duration, price, and a “Book” button.
- Reviews tab: summary (average rating, count) and paginated review list.
- Photos tab: gallery with categories.
- Contact: phone (tap to call), website link, social media links.
- Favorite button (requires login).
- Share button.

### 4.6 Service Categories
**Priority:** P0
**Description:** Hierarchical category system to organize businesses and services.
**Acceptance Criteria:**
- Predefined top-level categories (e.g., Hair, Nails, Spa, Massage, Barber).
- Each category can have subcategories (e.g., Hair > Women’s Haircut, Men’s Haircut).
- Businesses can be associated with multiple categories.
- Category browse screen with icons, showing popular subcategories.
- Admin can add/edit/disable categories.

### 4.7 Booking Flow
**Priority:** P0
**Description:** Step-by-step booking process from service selection to confirmation.
**Acceptance Criteria:**
- Step 1: Select a service from business detail.
- Step 2: Choose staff member (if multiple providers) and view available slots.
- Step 3: Select date and time from a calendar/picker showing real-time availability.
- Step 4: Review booking summary (service, date, time, staff, price, location).
- Step 5: Confirm booking; require payment method (if prepayment), or hold with card (if no-show protection).
- Booking confirmation screen with appointment details and option to add to calendar.
- Push notification and email confirmation sent.
- Handle concurrent booking conflicts gracefully (inform user if slot taken).
- Guest redirected to login/signup after step 5, then booking completes.

### 4.8 Appointment Management
**Priority:** P0
**Description:** Customers can view, reschedule, or cancel upcoming appointments.
**Acceptance Criteria:**
- “My Appointments” list with tabs: Upcoming, Past, Cancelled.
- Each appointment shows date, time, business name, service, status, and actions.
- Reschedule: select new date/time from available slots; confirm; update appointment.
- Cancel: with reason selection (optional) and confirmation modal; cancellation policy applied (e.g., free cancel up to 24h before).
- Appointment details page with map, contact, and add to calendar.
- Past appointments show rating/review prompt if not yet reviewed.

### 4.9 Favorites
**Priority:** P1
**Description:** Customers can save businesses to a favorites list for quick access.
**Acceptance Criteria:**
- Heart icon on business cards and detail page toggles favorite status.
- “Favorites” screen lists saved businesses with name, image, rating, and next slot.
- Remove from favorites via swipe or button.
- Syncs across user’s devices.

### 4.10 User Profile
**Priority:** P0
**Description:** Manage personal information, preferences, and payment methods.
**Acceptance Criteria:**
- View/edit: first name, last name, email, phone number, profile photo.
- Change password.
- Notification preferences (push, email, SMS).
- Saved payment methods (card list, add/delete).
- Link to appointments, favorites, and reviews.
- Delete account (with confirmation and data wipe compliance).

### 4.11 Availability & Slot Computation
**Priority:** P0
**Description:** Backend logic to compute real-time available slots based on provider schedules, service duration, buffers, and existing bookings.
**Acceptance Criteria:**
- Providers define working hours per day, including breaks and time off.
- Service duration defined; buffer time before/after (configurable).
- Slot generation: slots are computed by scanning working hours and checking against existing bookings, considering travel time (if mobile) but not applicable for in-store.
- Slots returned as ISO timestamps; grouped by date.
- Real-time availability check before booking confirmation.
- Handle timezone of business location.
- Support multi-staff: slots per staff member.

### 4.12 Shared Types & Design System
**Priority:** P1
**Description:** Consistent UI components and shared TypeScript types for web and mobile.
**Acceptance Criteria:**
- Design tokens: colors, typography, spacing, shadows.
- Reusable components: Button, Input, Card, Modal, Rating stars, Calendar, etc.
- Shared types: Business, Service, Appointment, User, Review, etc.
- Storybook documentation for developers.
- Responsive and accessible (WCAG 2.1 AA).

### 4.13 Reviews & Ratings
**Priority:** P1
**Description:** Customers can rate and review businesses after a completed appointment.
**Acceptance Criteria:**
- After appointment, prompt to rate (1-5 stars) and write review (optional text).
- Review appears on business detail page after moderation.
- Provider can respond to reviews.
- Admin can moderate (approve/reject/flag) reviews.
- Reviews include: rating, text, date, user name, provider response.
- Sorting: most recent, highest rated, lowest rated.

### 4.14 Payment Integration
**Priority:** P0 (for prepayment/hold)
**Description:** Secure payment processing via Stripe for booking deposits, prepayments, or no-show protection holds.
**Acceptance Criteria:**
- Customer adds card via Stripe Elements or mobile SDK (PCI compliant).
- Booking flow: if business requires prepayment (full/partial), charge card; if no-show protection, create a hold (authorization) that is captured upon no-show.
- Payment confirmation and receipt email.
- Refund handling for cancellations according to business policy.
- Provider can configure payment requirements (prepay/hold/none) per service.
- Admin can view transaction logs.

### 4.15 Notifications
**Priority:** P0
**Description:** Push notifications, email, and optional SMS for appointment reminders, confirmations, and marketing.
**Acceptance Criteria:**
- Push notifications via Firebase Cloud Messaging (FCM) for mobile.
- Email via SendGrid or similar.
- Events: booking confirmation, reminder (24h and 1h before), reschedule, cancellation, review request, provider message.
- Notification preferences in user profile.
- In-app notification center with read/unread status.

### 4.16 Provider / Business Owner Portal
**Priority:** P0
**Description:** Web dashboard for providers to manage their business, services, staff, appointments, and reviews.
**Acceptance Criteria:**
- Registration and business profile setup wizard (name, address, category, description, photos, hours).
- Service management: CRUD for services with name, duration, price, description, payment type.
- Staff management: add/edit/remove staff, assign services, set working hours.
- Calendar view of appointments (day/week/month) with filtering by staff.
- Appointment management: view details, confirm/decline (if manual approval), reschedule, cancel, mark no-show.
- Client history and notes.
- Review responses.
- Analytics: bookings count, revenue, popular services, customer retention.
- Settings: notification preferences, payment integration setup (Stripe Connect).

### 4.17 Admin Dashboard
**Priority:** P1
**Description:** Centralized admin panel for platform management.
**Acceptance Criteria:**
- Dashboard with KPIs: total users, businesses, appointments, revenue, reviews.
- User management: list, search, suspend/activate, view details.
- Business management: approve/reject business registrations, edit, suspend.
- Category management: add/edit/disable categories.
- Review moderation queue.
- Transaction logs and refund processing.
- System configuration: supported regions, default commission rates.
- Role-based access: only admins can access.

### 4.18 Background Jobs (BullMQ)
**Priority:** P1
**Description:** Asynchronous job processing for non-critical tasks to ensure responsiveness.
**Acceptance Criteria:**
- Jobs: send email notifications, push notifications, generate booking reminders, clean up expired tokens, process review moderation flags, compute analytics.
- Use BullMQ with Redis.
- Retry with exponential backoff for failed jobs.
- Dead letter queue for permanently failed jobs.
- Admin dashboard to view job queues and failures.

## 5. Non-Functional Requirements
- **Performance:** API response time < 200ms p95, booking confirmation < 2s.
- **Scalability:** Support 100k concurrent users.
- **Security:** HTTPS, JWT with short expiry, rate limiting, input validation, GDPR compliance.
- **Reliability:** 99.9% uptime SLA.
- **Accessibility:** WCAG 2.1 AA for web interfaces.

## 6. Prioritization Summary
- **P0 (Must Have):** Authentication, Guest Browse, Search & Discovery, Business Detail, Service Categories, Booking Flow, Appointment Management, User Profile, Availability & Slot Computation, Payment Integration, Notifications, Provider Portal.
- **P1 (Should Have):** Map-based Search, Favorites, Shared Types & Design System, Reviews & Ratings, Admin Dashboard, Background Jobs.
- **P2 (Nice to Have):** Multi-language, advanced analytics, loyalty program, social sharing enhancements.

## 7. Out of Scope for MVP
- In-app chat between customer and provider.
- Multi-location support for a single business.
- Marketplace insurance integration.
- AI-based recommendations.