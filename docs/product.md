# Planity Clone — Product Specification

> **Version:** 1.0  
> **Status:** Draft  
> **Author:** Alex (Product Owner)  
> **Last Updated:** 2024-01-15

---

## 1. Overview

### 1.1 Product Vision
Build a scalable, mobile-first appointment booking platform that connects customers with beauty, wellness, and personal care businesses. The platform serves three primary user segments: **Customers** (booking appointments), **Providers/Business Owners** (managing schedules and services), and **Platform Admins** (oversight and support).

### 1.2 Target Users
- **Customers**: Individuals aged 18-55 seeking convenient online booking for beauty/wellness services.
- **Providers**: Salon owners, freelance stylists, spa managers, and wellness professionals.
- **Admins**: Platform operations team managing onboarding, disputes, and analytics.

### 1.3 Success Metrics
- **Booking Conversion Rate** > 15%
- **Search-to-Book Latency** < 3 minutes
- **Provider Activation** > 80% complete profiles within 7 days of signup
- **App Store Rating** > 4.5 stars
- **System Uptime** > 99.9%

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 (Must Have)

**Description:** Secure identity management for all user roles with role-based access control.

**User Stories:**
- As a customer, I want to register with email/password or social accounts so I can book appointments.
- As a provider, I want to create a business account so I can manage my salon online.
- As any user, I want to reset my password securely so I can regain access if I forget it.

**Acceptance Criteria:**
- [ ] Users can register with email/password, Google OAuth, and Apple OAuth.
- [ ] Passwords must be minimum 8 characters with at least one uppercase, one lowercase, and one number.
- [ ] JWT tokens are issued with 15-minute access and 7-day refresh expiry.
- [ ] Users receive email verification link upon registration; account is marked `pending` until verified.
- [ ] Password reset flow sends a secure, time-limited (1 hour) token via email.
- [ ] Role-based guards restrict `/provider/*` and `/admin/*` routes appropriately.
- [ ] Rate limiting: 5 login attempts per 15 minutes per IP.

---

### 2.2 Guest Browse & Explore
**Priority:** P0 (Must Have)

**Description:** Allow unauthenticated users to browse businesses and services without creating an account, reducing friction in the discovery funnel.

**User Stories:**
- As a guest, I want to browse nearby salons so I can evaluate the platform before committing.
- As a guest, I want to view business details and service prices so I can compare options.

**Acceptance Criteria:**
- [ ] Guest users can access search, map view, and business detail pages without authentication.
- [ ] Guest users can view services, pricing, reviews, and availability.
- [ ] Any attempt to book triggers a modal prompting sign-in or registration.
- [ ] Guest session data (search filters, viewed businesses) is persisted for 24 hours in localStorage.
- [ ] Upon registration, guest session data (favorites, pending booking intent) is migrated to the authenticated account.

---

### 2.3 Business Search & Discovery
**Priority:** P0 (Must Have)

**Description:** Powerful search and filtering to help customers find the right business or service provider.

**User Stories:**
- As a customer, I want to search by business name, service type, or location so I can find relevant providers quickly.
- As a customer, I want to filter by price range, rating, and distance so I can narrow results.

**Acceptance Criteria:**
- [ ] Full-text search indexes business name, service names, and category tags.
- [ ] Filters include: distance (km/mi), price range, rating (1-5 stars), category, and availability ("open now").
- [ ] Default sort is "Recommended" (weighted by rating, proximity, and booking volume).
- [ ] Additional sorts: nearest, highest rated, most reviewed, price (low to high).
- [ ] Results paginate at 20 items per page with infinite scroll on mobile.
- [ ] Search query debounced at 300ms; results returned in < 500ms.
- [ ] Empty state displays popular categories and nearby suggestions.

---

### 2.4 Map-based Search
**Priority:** P0 (Must Have)

**Description:** Visual discovery of businesses using an geographic map interface.

**User Stories:**
- As a customer, I want to see businesses on a map so I can choose based on location convenience.
- As a customer, I want to pan and zoom the map to explore different neighborhoods.

**Acceptance Criteria:**
- [ ] Map displays business markers clustered at zoom levels > 10.
- [ ] Clicking a marker opens a bottom sheet (mobile) or popover (desktop) with business name, rating, and photo.
- [ ] Map bounds trigger a new search query; results list syncs with visible map area.
- [ ] User geolocation is requested on first visit; fallback to city center if denied.
- [ ] Map supports satellite and standard view toggles.
- [ ] Maximum 100 markers rendered client-side; server-side clustering for dense regions.

---

### 2.5 Business Detail View
**Priority:** P0 (Must Have)

**Description:** Comprehensive page presenting all relevant information about a business to drive booking decisions.

**User Stories:**
- As a customer, I want to see photos, hours, services, and reviews so I can decide whether to book.
- As a customer, I want to see staff/professional profiles so I can choose my preferred provider.

**Acceptance Criteria:**
- [ ] Hero section displays up to 5 business photos in a swipeable carousel.
- [ ] Business info: name, address, phone, website link, average rating, total review count.
- [ ] Operating hours displayed by day; current day highlighted.
- [ ] "Open Now" / "Closed" badge based on real-time clock.
- [ ] Services tab lists all offerings with name, duration, description, and price.
- [ ] Staff tab lists professionals with photo, name, specialty, and average rating.
- [ ] Reviews tab shows 10 most recent reviews with pagination.
- [ ] "Book Now" CTA is sticky at the bottom of the viewport on mobile.
- [ ] Share button generates a deep-link to the business detail page.

---

### 2.6 Service Categories
**Priority:** P0 (Must Have)

**Description:** Hierarchical categorization of services to improve discoverability and navigation.

**User Stories:**
- As a customer, I want to browse by category (e.g., Hair, Nails, Massage) so I can find specific services easily.
- As a provider, I want to assign categories to my services so customers can find them.

**Acceptance Criteria:**
- [ ] Predefined category tree: Beauty > Hair > Haircut, Coloring, Styling; Wellness > Massage > Swedish, Deep Tissue, etc.
- [ ] Categories support up to 3 levels of nesting.
- [ ] Each category has an icon, name, and optional description.
- [ ] Provider portal enforces category selection during service creation.
- [ ] Category pages display featured businesses and trending services.
- [ ] Categories are localizable (FR, EN, ES, DE) for future internationalization.

---

### 2.7 Booking Flow
**Priority:** P0 (Must Have)

**Description:** Seamless multi-step process for customers to schedule appointments.

**User Stories:**
- As a customer, I want to select a service, provider, and time slot so I can book an appointment in under 60 seconds.
- As a customer, I want to add notes or preferences so the provider can prepare for my visit.

**Acceptance Criteria:**
- [ ] Step 1: Select service from business service list.
- [ ] Step 2: Select provider (or "No preference" for any available staff).
- [ ] Step 3: Date picker shows next 30 days; unavailable dates are disabled.
- [ ] Step 4: Time slots displayed in 15-minute increments based on real-time availability.
- [ ] Step 5: Review booking summary (service, provider, date/time, price, duration).
- [ ] Step 6: Add optional notes (max 500 characters).
- [ ] Step 7: Confirm booking. System holds slot for 10 minutes during payment (if required).
- [ ] Confirmation screen displays booking reference, calendar invite (.ics), and option contact business.
- [ ] If payment is required, redirect to payment flow before final confirmation.
- [ ] Double-booking prevented via database-level uniqueness constraint on (provider_id, start_time, status != cancelled).

---

### 2.8 Appointment Management
**Priority:** P0 (Must Have)

**Description:** Dashboard for customers and providers to view, modify, and cancel appointments.

**User Stories:**
- As a customer, I want to see all my upcoming and past appointments so I can manage my schedule.
- As a customer, I want to reschedule or cancel an appointment if my plans change.

**Acceptance Criteria:**
- [ ] Customer "My Bookings" view lists upcoming appointments sorted by date (ascending) and past appointments (descending).
- [ ] Each card shows: business name, service, provider, date/time, status, and price.
- [ ] Customers can cancel up to provider's cancellation policy deadline (default 24h before).
- [ ] Customers can reschedule to any available future slot before the cancellation deadline.
- [ ] Provider portal shows daily/weekly calendar view of all appointments.
- [ ] Provider can mark appointments as: confirmed, in-progress, completed, no-show, or cancelled.
- [ ] All status changes trigger notifications to the affected customer.
- [ ] Cancelled appointments free up slot availability immediately.

---

### 2.9 Favorites
**Priority:** P1 (Should Have)

**Description:** Allow customers to save and quickly access preferred businesses.

**User Stories:**
- As a customer, I want to favorite businesses so I can rebook my regular providers quickly.
- As a customer, I want to receive notifications when my favorited business adds new services or promotions.

**Acceptance Criteria:**
- [ ] Heart icon on business cards and detail pages toggles favorite status.
- [ ] Favorites list accessible from user profile tab.
- [ ] Favorites persist across sessions and devices.
- [ ] Maximum 200 favorites per user.
- [ ] Optional: Push notification when favorited business updates hours or adds a promotion.
- [ ] Unfavoriting removes business from list immediately without confirmation.

---

### 2.10 User Profile
**Priority:** P0 (Must Have)

**Description:** Central hub for customers to manage personal information, preferences, and account settings.

**User Stories:**
- As a customer, I want to update my contact details and profile photo so providers can recognize me.
- As a customer, I want to manage notification preferences so I control how the platform communicates with me.

**Acceptance Criteria:**
- [ ] Profile fields: first name, last name, email, phone, profile photo (JPEG/PNG, max 5MB).
- [ ] Email and phone can be updated with re-verification required.
- [ ] Notification preferences: email (promotions, reminders, account), push (bookings, promotions), SMS (bookings only).
- [ ] "My Bookings" shortcut from profile.
- [ ] "Payment Methods" section (if saved cards exist).
- [ ] Account deletion flow with 30-day grace period and data retention notice (GDPR compliance).
- [ ] Change password with current password confirmation.

---

### 2.11 Availability & Slot Computation
**Priority:** P0 (Must Have)

**Description:** Real-time calculation of available booking slots based on business hours, staff schedules, existing appointments, and buffer times.

**User Stories:**
- As a provider, I want to set my working hours and breaks so customers only see valid slots.
- As a customer, I want to see only genuinely available slots so I don't book conflicting times.

**Acceptance Criteria:**
- [ ] Providers define weekly recurring schedule (e.g., Mon 09:00-17:00) with optional breaks.
- [ ] Providers can block specific dates (vacation, holidays).
- [ ] Slot computation accounts for: business hours, staff-specific hours, existing appointments, and service duration.
- [ ] Buffer time between appointments configurable per provider (default 0, max 30 min).
- [ ] Slot granularity: 15 minutes.
- [ ] Availability API returns slots for a given date range in < 200ms.
- [ ] Edge cases handled: service duration spanning break times, multi-staff services, concurrent bookings.
- [ ] Timezone support: all slots stored in UTC, displayed in business timezone.

---

### 2.12 Shared Types & Design System
**Priority:** P0 (Must Have)

**Description:** Consistent UI/UX patterns, component library, and type definitions across web and mobile clients.

**User Stories:**
- As a developer, I want reusable components and shared types so I can build features quickly and consistently.
- As a user, I want a consistent experience across devices so the app feels familiar and trustworthy.

**Acceptance Criteria:**
- [ ] Design tokens defined for: colors (primary, secondary, semantic states), typography (font family, sizes, weights), spacing (4px grid), and breakpoints.
- [ ] Component library includes: Button, Input, Select, DatePicker, TimeSlotGrid, BusinessCard, ReviewStars, Avatar, Modal, Toast, Skeleton loaders.
- [ ] All shared TypeScript types exported from a `@planity-clone/types` package.
- [ ] Core types: User, Business, Service, Appointment, Review, Payment, Notification.
- [ ] Accessibility: WCAG 2.1 AA compliance, keyboard navigation, ARIA labels, focus management.
- [ ] Dark mode support via CSS variables and theme toggle.
- [ ] Mobile-first responsive design; max-width 480px for mobile, 768px tablet, 1024px+ desktop.

---

### 2.13 Reviews & Ratings
**Priority:** P1 (Should Have)

**Description:** Social proof system allowing customers to rate and review businesses and individual providers.

**User Stories:**
- As a customer, I want to read honest reviews so I can choose quality providers.
- As a customer, I want to leave a review after my appointment to share my experience.

**Acceptance Criteria:**
- [ ] Reviews can only be submitted by verified customers who completed the appointment.
- [ ] Review form: 1-5 star rating, optional text (max 1000 chars), optional photo upload (max 3 images).
- [ ] Reviews are moderated for prohibited content; auto-publish with post-hoc flagging.
- [ ] Business average rating recalculated in real-time upon new review submission.
- [ ] Reviews display: customer name (or "Verified Customer"), date, rating, text, and business response (if any).
- [ ] Provider can respond to reviews publicly once per review.
- [ ] Reviews sortable by: newest, highest rating, lowest rating.
- [ ] Report review functionality for inappropriate content.

---

### 2.14 Payment Integration
**Priority:** P0 (Must Have)

**Description:** Secure handling of payments for appointments, including deposits, full payments, and refunds.

**User Stories:**
- As a customer, I want to pay securely online so I can confirm my booking instantly.
- As a provider, I want to receive payouts for completed appointments so I can manage my revenue.

**Acceptance Criteria:**
- [ ] Payment gateway: Stripe integration (Payment Intents, Customers, Connect for marketplace).
- [ ] Supported methods: credit/debit cards, Apple Pay, Google Pay, SEPA (EU).
- [ ] Payment flows: pay in full at booking, pay deposit at booking + remainder at appointment, pay at venue (cash/card terminal).
- [ ] Saved payment methods with PCI-compliant tokenization (Stripe tokens only, no raw card data stored).
- [ ] Refund policy: full refund if cancelled within policy; partial refund if deposit-only.
- [ ] Provider payout via Stripe Connect; platform fee deducted automatically (configurable %).
- [ ] Receipts emailed to customer and available in-app.
- [ ] Webhook handling for: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`.
- [ ] Idempotency keys used for all payment creation requests.

---

### 2.15 Notifications
**Priority:** P1 (Should Have)

**Description:** Multi-channel communication system to keep users informed about bookings, reminders, and updates.

**User Stories:**
- As a customer, I want to receive booking confirmations and reminders so I don't miss appointments.
- As a provider, I want to be notified of new bookings so I can prepare.

**Acceptance Criteria:**
- [ ] Channels: in-app push notifications, email, SMS (for critical alerts only).
- [ ] Notification types:
  - Booking: created, confirmed, rescheduled, cancelled, reminder (24h, 1h before).
  - Payment: succeeded, failed, refunded.
  - Reviews: new review posted, review responded to.
  - Marketing: promotional offers (opt-in only, P2).
- [ ] Users can toggle channels per notification type in profile settings.
- [ ] Push notifications use Firebase Cloud Messaging (FCM) for Android and APNs for iOS.
- [ ] Email templates are responsive and branded.
- [ ] SMS limited to 160 chars; includes short link to booking detail.
- [ ] Notification history stored for 90 days; accessible in-app.

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 (Must Have)

**Description:** Dedicated interface for business owners to manage their profile, services, staff, schedule, and appointments.

**User Stories:**
- As a provider, I want to set up my business profile so customers can find and book me.
- As a provider, I want to manage my calendar and staff so bookings align with my operations.

**Acceptance Criteria:**
- [ ] Onboarding wizard: business info, upload logo/photos (min 3, max 10), set hours, add services, add staff.
- [ ] Dashboard shows: today's appointments, weekly revenue, upcoming week preview, quick action buttons.
- [ ] Service management: CRUD for services (name, category, description, duration, price, buffer time, staff assignable).
- [ ] Staff management: add team members, assign services, set individual schedules and breaks.
- [ ] Calendar view: daily, weekly, monthly. Drag-to-reschedule appointments.
- [ ] Appointment actions: confirm, mark complete, mark no-show, cancel with optional customer message.
- [ ] Block time: provider can block personal time or staff time-off.
- [ ] Business settings: cancellation policy (default 24h), booking lead time (min hours before booking), max future booking window.
- [ ] Analytics tab: total bookings, revenue, cancellation rate, top services, customer retention (P1).

---

### 2.17 Admin Dashboard
**Priority:** P1 (Should Have)

**Description:** Internal tool for platform administrators to oversee users, businesses, bookings, and platform health.

**User Stories:**
- As an admin, I want to monitor platform activity so I can ensure quality and compliance.
- As an admin, I want to manage business onboarding so only legitimate providers join.

**Acceptance Criteria:**
- [ ] Authentication: separate admin role with 2FA enforcement.
- [ ] Overview dashboard: daily active users, new registrations, bookings, revenue, top businesses.
- [ ] User management: search, view profiles, suspend/activate accounts, impersonate (with audit log).
- [ ] Business management: approve/reject new business applications, edit business details, feature/unfeature businesses.
- [ ] Booking oversight: view all appointments, filter by status, date, business; refund capability.
- [ ] Review moderation: flagged reviews queue, approve/hide/delete actions.
- [ ] Support tickets: view, assign, respond, escalate (P2).
- [ ] Audit log: all admin actions timestamped with admin ID and IP address.
- [ ] Data export: CSV/Excel for users, bookings, revenue by date range.

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P0 (Must Have)

**Description:** Asynchronous job processing for non-blocking operations, scheduled tasks, and system maintenance.

**User Stories:**
- As a system, I want to process heavy tasks asynchronously so the API remains responsive.
- As a customer, I want to receive timely reminders without relying on real-time API calls.

**Acceptance Criteria:**
- [ ] Job queue implemented with BullMQ + Redis.
- [ ] Job types:
  - **Email sending**: transactional emails (booking confirmations, reminders, password resets).
  - **Push notifications**: scheduled reminders, marketing campaigns.
  - **SMS dispatch**: critical booking alerts.
  - **Payment reconciliation**: nightly sync with Stripe for payout status.
  - **Analytics aggregation**: daily rollups of bookings, revenue, user activity.
  - **Image processing**: resize and compress uploaded business photos to multiple variants (thumbnail, standard, full).
  - **Data cleanup**: purge soft-deleted records older than 90 days.
- [ ] Failed jobs retry with exponential backoff (max 5 attempts).
- [ ] Dead letter queue for jobs failing after max retries; admin alerted.
- [ ] Job dashboard (Bull Board or custom UI) for monitoring queue depth, processing rate, and failures.
- [ ] Scheduled jobs use cron syntax; reminder jobs scheduled at calculated times (e.g., 24h before appointment).
- [ ] Jobs are idempotent where applicable (e.g., payment reconciliation).

---

## 3. Non-Functional Requirements

### 3.1 Performance
- API response time: p95 < 300ms for standard queries.
- Image loading: progressive JPEG/WebP with lazy loading.
- App cold start: < 2 seconds on mid-tier mobile devices.

### 3.2 Security
- HTTPS everywhere; HSTS enabled.
- Input validation via class-validator DTOs.
- SQL injection prevention via Prisma ORM parameterized queries.
- XSS protection; Content-Security-Policy headers.
- GDPR compliance: data export, right to erasure, consent management.
- Rate limiting on all public endpoints.

### 3.3 Scalability
- Stateless API design for horizontal scaling.
- Database read replicas for heavy search/analytics queries.
- CDN for static assets and image delivery.
- Caching layer (Redis) for availability slots and popular search results.

### 3.4 Reliability
- Automated database backups: daily full, continuous point-in-time recovery.
- Health check endpoints for load balancer monitoring.
- Circuit breaker pattern for external service calls (Stripe, FCM).

---

## 4. Release Phases

### Phase 1 — MVP (Weeks 1-8)
- User Authentication (2.1)
- Guest Browse & Explore (2.2)
- Business Search & Discovery (2.3)
- Map-based Search (2.4)
- Business Detail View (2.5)
- Service Categories (2.6)
- Booking Flow (2.7)
- Appointment Management (2.8)
- User Profile (2.10)
- Availability & Slot Computation (2.11)
- Shared Types & Design System (2.12)
- Payment Integration (2.14)
- Provider / Business Owner Portal (2.16)
- Background Jobs (2.18)

### Phase 2 — Growth (Weeks 9-14)
- Favorites (2.9)
- Reviews & Ratings (2.13)
- Notifications (2.15)
- Admin Dashboard (2.17)

### Phase 3 — Scale (Weeks 15-20)
- Loyalty program
- Subscription plans for providers
- Multi-location business support
- AI-powered recommendations
- Internationalization (i18n)

---

## 5. Open Questions
1. Should we support group bookings (multiple customers, one time slot)?
2. Do providers need inventory management for retail products?
3. Is waitlist functionality needed for fully booked popular providers?
4. Should we integrate with Google Calendar / Outlook for provider sync?
5. What is the target geographic launch market (affects payment methods, compliance)?

---

## 6. Appendix

### 6.1 Glossary
- **Slot**: A specific time interval during which a service can be booked.
- **Provider**: The business or individual professional offering services.
- **Buffer**: Time added between consecutive appointments.

### 6.2 Related Documents
- `docs/architecture.md` — System architecture and tech stack
- `docs/api-spec.md` — OpenAPI/Swagger API specification
- `docs/database-schema.md` — Entity-relationship diagrams
