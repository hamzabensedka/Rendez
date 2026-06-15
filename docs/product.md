# Planity Clone — Product Specification

## 1. Overview

Build a clone of **Planity**, a platform that lets end-users discover beauty & wellness businesses, view services, check real-time availability, and book appointments. The product also includes a **Provider Portal** for business owners to manage their calendar, services, and bookings, plus an **Admin Dashboard** for platform oversight.

**Target Users**
- **End-Users (Clients)**: Consumers looking to book beauty/wellness appointments.
- **Providers (Business Owners)**: Salons, barbers, spas, independent professionals managing their business on the platform.
- **Platform Admins**: Internal team managing users, businesses, payments, and platform health.

**Platform**: Web (responsive) + Mobile Web (PWA-ready). Native mobile apps are out of scope for MVP.

---

## 2. Feature List & Priorities

| # | Feature | Priority | Sprint |
|---|---------|----------|--------|
| 1 | User Authentication | P0 | 1 |
| 2 | Guest Browse & Explore | P0 | 1 |
| 3 | Business Search & Discovery | P0 | 1 |
| 4 | Map-based Search | P1 | 2 |
| 5 | Business Detail View | P0 | 1 |
| 6 | Service Categories | P0 | 1 |
| 7 | Booking Flow | P0 | 2 |
| 8 | Appointment Management | P0 | 2 |
| 9 | Favorites | P1 | 3 |
| 10 | User Profile | P0 | 2 |
| 11 | Availability & Slot Computation | P0 | 2 |
| 12 | Shared Types & Design System | P0 | 1 |
| 13 | Reviews & Ratings | P1 | 3 |
| 14 | Payment Integration | P0 | 2 |
| 15 | Notifications | P1 | 3 |
| 16 | Provider / Business Owner Portal | P0 | 2 |
| 17 | Admin Dashboard | P1 | 3 |
| 18 | Background Jobs (BullMQ) | P0 | 2 |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Description**: Allow users to create accounts, log in, and manage their sessions securely. Support both client and provider roles.

**User Stories**
- As a new user, I want to register with email/password so that I can create an account.
- As a returning user, I want to log in with email/password so that I can access my account.
- As a user, I want to reset my password so that I can regain access if I forget it.
- As a user, I want to log out so that I can secure my account on shared devices.

**Acceptance Criteria**
- [ ] Users can register with email, password, first name, last name, and phone number.
- [ ] Password must be at least 8 characters with at least one uppercase, one lowercase, and one number.
- [ ] Email verification is required before account is activated.
- [ ] JWT tokens are issued on login with a refresh token mechanism.
- [ ] Password reset flow sends a secure, time-limited link via email.
- [ ] Users can log out, invalidating their current session token.
- [ ] Role is set to `CLIENT` by default; `PROVIDER` role is assigned via admin or business creation flow.

**API Endpoints (reference)**
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

---

### 3.2 Guest Browse & Explore

**Description**: Allow non-authenticated users to browse businesses, services, and availability without creating an account.

**User Stories**
- As a guest, I want to browse businesses so that I can explore the platform before committing.
- As a guest, I want to view business details and services so that I can evaluate offerings.
- As a guest, I want to see available time slots so that I know when I could book.

**Acceptance Criteria**
- [ ] Guest users can access the home page, search, and business detail pages without authentication.
- [ ] Guest users can view service lists and pricing.
- [ ] Guest users can view availability calendars (read-only).
- [ ] Booking action prompts login/signup modal when attempted by a guest.
- [ ] Guest session data (selected business, service, time) is preserved post-authentication to continue the booking flow.

---

### 3.3 Business Search & Discovery

**Description**: Enable users to find businesses by name, service, location, or category with relevant filtering and sorting.

**User Stories**
- As a user, I want to search for businesses by name so that I can find a specific salon.
- As a user, I want to filter by service category so that I only see relevant businesses.
- As a user, I want to filter by price range so that I find services within my budget.
- As a user, I want to sort by rating, distance, or relevance so that I find the best match.

**Acceptance Criteria**
- [ ] Search input supports text search across business name, service name, and description.
- [ ] Filters: category, price range, rating (minimum stars), distance radius, open now.
- [ ] Sort options: relevance (default), highest rated, nearest, price (low to high).
- [ ] Results display business card with: name, thumbnail, average rating, starting price, distance, next available slot.
- [ ] Pagination with 20 results per page; infinite scroll on mobile.
- [ ] Search query debounced at 300ms.
- [ ] Empty state shown when no results match criteria.

---

### 3.4 Map-based Search

**Description**: Visualize business locations on an interactive map with clustering and detail popovers.

**User Stories**
- As a user, I want to see businesses on a map so that I can choose by location.
- As a user, I want to click a map pin to see business summary so that I can quickly evaluate.
- As a user, I want the map to update as I pan/zoom so that I explore new areas.

**Acceptance Criteria**
- [ ] Map view toggle available on search results page.
- [ ] Map uses Google Maps or Mapbox with custom business pins.
- [ ] Pins cluster when zoomed out; de-cluster on zoom in.
- [ ] Clicking a pin opens a card with: name, rating, photo, and "View" button.
- [ ] Map bounds are used to filter search results dynamically.
- [ ] User's current location is centered by default (with permission); fallback to default city.
- [ ] List view and map view are synchronized: filters apply to both.

---

### 3.5 Business Detail View

**Description**: Comprehensive page displaying all information about a single business.

**User Stories**
- As a user, I want to see business photos, description, and contact info so that I can evaluate fit.
- As a user, I want to see all services offered so that I can choose what to book.
- As a user, I want to see reviews so that I can gauge quality.

**Acceptance Criteria**
- [ ] Hero section: business name, cover photo, logo, average rating, review count, address, phone, website link.
- [ ] Photo gallery with lightbox view (up to 20 images).
- [ ] About section with description, opening hours, amenities, and social links.
- [ ] Services tab: grouped by category, each with name, duration, price, and "Book" CTA.
- [ ] Reviews tab: sorted by newest, with rating breakdown (5-star distribution).
- [ ] Sticky "Book Now" button on mobile; prominent CTA on desktop.
- [ ] Share functionality to copy link or share via native share API.
- [ ] Breadcrumb navigation for SEO and usability.

---

### 3.6 Service Categories

**Description**: Hierarchical categorization of services for discovery and organization.

**User Stories**
- As a user, I want to browse by category so that I can find the type of service I need.
- As a provider, I want to assign categories to my services so that clients can find them.

**Acceptance Criteria**
- [ ] Predefined category tree: Hair, Nails, Face, Body, Massage, Makeup, Barber, Spa & Wellness, Medical Aesthetic.
- [ ] Each category has an icon, name, and optional subcategories.
- [ ] Services can belong to one category and multiple subcategories.
- [ ] Categories are used in search filters and business onboarding.
- [ ] Admin can add/edit/disable categories; changes reflect immediately.

---

### 3.7 Booking Flow

**Description**: Seamless multi-step process for users to book an appointment.

**User Stories**
- As a user, I want to select a service, provider, date, and time so that I can book an appointment.
- As a user, I want to add optional notes so that I can communicate special requests.
- As a user, I want to review my booking before confirming so that I can verify details.

**Acceptance Criteria**
- [ ] Step 1: Select service (or multiple services) from business.
- [ ] Step 2: Select staff member (optional "no preference").
- [ ] Step 3: Select date; available slots computed in real-time based on availability engine.
- [ ] Step 4: Select time slot; slot is held for 10 minutes (optimistic locking via Redis).
- [ ] Step 5: Add notes, apply promo code, select payment method.
- [ ] Step 6: Review and confirm; display cancellation policy.
- [ ] Confirmation page with booking reference, calendar invite (.ics), and add-to-calendar buttons.
- [ ] If payment is required, integrate Stripe payment element before final confirmation.
- [ ] Booking state machine: `PENDING_PAYMENT` → `CONFIRMED` → `COMPLETED` / `CANCELLED`.

---

### 3.8 Appointment Management

**Description**: Allow users and upsell providers to view and manage their appointments.

**User Stories**
- As a user, I want to see my upcoming and past appointments so that I can manage my schedule.
- As a user, I want to cancel or reschedule an appointment so that I can adapt to changes.
- As a provider, I want to see all bookings for my business so that I can prepare.

**Acceptance Criteria**
- [ ] User appointment list: upcoming (sorted by date) and past tabs.
- [ ] Each appointment card shows: business name, service, date/time, status, total price.
- [ ] Cancel action: allowed up to defined policy hours before appointment; triggers refund if applicable.
- [ ] Reschedule action: user selects new slot; old slot released, new slot held.
- [ ] Provider calendar view: day/week/month views with appointment blocks.
- [ ] Provider can mark appointment as `NO_SHOW` or `COMPLETED`.
- [ ] All status changes trigger notifications (push, email, SMS per user preference).

---

### 3.9 Favorites

**Description**: Allow users to save businesses for quick access later.

**User Stories**
- As a user, I want to favorite a business so that I can book again easily.
- As a user, I want to see my list of favorites so that I can quickly navigate to them.

**Acceptance Criteria**
- [ ] Heart icon on business card and detail page toggles favorite status.
- [ ] Favorites page lists all saved businesses with quick-access "Book" buttons.
- [ ] Favorites are synced across devices for logged-in users.
- [ ] Guest favorites stored in localStorage; merged to account on login.
- [ ] Maximum 200 favorites per user.

---

### 3.10 User Profile

**Description**: Central place for users to manage their personal information, preferences, and account settings.

**User Stories**
- As a user, I want to update my profile info so that businesses have correct contact details.
- As a user, I want to manage notification preferences so that I control how I'm contacted.
- As a user, I want to view my payment methods so that I can manage them.

**Acceptance Criteria**
- [ ] Profile fields: first name, last name, email, phone, profile photo, date of birth (optional).
- [ ] Change password with current password verification.
- [ ] Notification preferences: email, SMS, push — per event type (booking confirmation, reminder, promotion).
- [ ] Payment methods: list saved Stripe payment methods, set default, delete.
- [ ] Booking history with ability to rebook previous services.
- [ ] Account deletion flow with 30-day grace period and data export option.

---

### 3.11 Availability & Slot Computation

**Description**: Core engine that computes available booking slots based on business hours, staff schedules, existing appointments, and buffer times.

**User Stories**
- As a provider, I want to set my weekly availability so that clients can book accordingly.
- As a provider, I want to block specific dates or times so that I can take time off.
- As a user, I want to see only truly available slots so that I don't book conflicts.

**Acceptance Criteria**
- [ ] Weekly schedule template: start/end times per day, with ability to mark days off.
- [ ] Exception dates: override schedule for holidays, vacations, or one-off changes.
- [ ] Slot computation accounts for: service duration, staff availability, existing bookings, buffer time between appointments.
- [ ] Supports multiple concurrent bookings if provider has multiple stations/staff.
- [ ] Real-time slot availability API with <200ms response time (cached in Redis).
- [ ] Timezone handling: all times stored in UTC, displayed in business timezone.
- [ ] Edge cases: cross-day appointments, daylight saving transitions, minimum lead time (e.g., 2 hours before booking).

---

### 3.12 Shared Types & Design System

**Description**: Consistent UI/UX foundation across all platform surfaces.

**User Stories**
- As a developer, I want reusable components so that I can build features quickly and consistently.
- As a user, I want a consistent experience so that the app feels polished and professional.

**Acceptance Criteria**
- [ ] Design tokens: colors, typography, spacing, shadows, border-radius defined in Tailwind config.
- [ ] Component library: Button, Input, Select, DatePicker, Modal, Card, Avatar, Badge, Skeleton, Toast.
- [ ] Shared TypeScript types across frontend and backend (monorepo or package).
- [ ] Form validation schema (Zod) shared between API and UI.
- [ ] Responsive breakpoints: mobile <640px, tablet 640-1024px, desktop >1024px.
- [ ] Accessibility: WCAG 2.1 AA compliance, keyboard navigation, focus management, ARIA labels.
- [ ] Dark mode support (optional for MVP, but tokens should support it).

---

### 3.13 Reviews & Ratings

**Description**: Allow clients to leave feedback on businesses and services after appointments.

**User Stories**
- As a user, I want to rate and review a business so that I can share my experience.
- As a user, I want to read reviews so that I can make informed decisions.
- As a provider, I want to respond to reviews so that I can address feedback.

**Acceptance Criteria**
- [ ] Review eligibility: only users with a completed appointment can leave a review (verified purchase).
- [ ] Rating: 1-5 stars with optional text review (10-1000 characters).
- [ ] Review form sent via email 24 hours after appointment completion.
- [ ] Reviews display: reviewer name (or initials), date, rating, text, provider response.
- [ ] Provider can respond once per review; response is editable.
- [ ] Flag/report review functionality for inappropriate content.
- [ ] Average rating recalculated in real-time; cached for performance.
- [ ] Admin can moderate, hide, or delete reviews.

---

### 3.14 Payment Integration

**Description**: Secure handling of payments for bookings via Stripe.

**User Stories**
- As a user, I want to pay securely online so that my booking is confirmed.
- As a user, I want to save my card for future bookings so that checkout is faster.
- As a provider, I want to receive payouts so that I am compensated for services.

**Acceptance Criteria**
- [ ] Stripe Payment Intents used for all transactions.
- [ ] Support for cards (Visa, Mastercard, Amex) and Apple Pay / Google Pay.
- [ ] Payment flow: create payment intent → client confirms → webhook confirms → booking confirmed.
- [ ] Saved payment methods via Stripe SetupIntents; PCI compliance via Stripe Elements.
- [ ] Refund support: full and partial refunds initiated by provider or admin.
- [ ] Provider payouts via Stripe Connect (Express or Custom accounts).
- [ ] Platform fee deducted automatically; net amount transferred to provider.
- [ ] Invoice/receipt generated and emailed to user.
- [ ] Idempotency keys used to prevent duplicate charges.

---

### 3.15 Notifications

**Description**: Multi-channel notification system to keep users and providers informed.

**User Stories**
- As a user, I want to receive booking confirmations so that I have proof of my appointment.
- As a user, I want appointment reminders so that I don't forget.
- As a provider, I want to be notified of new bookings so that I can prepare.

**Acceptance Criteria**
- [ ] Channels: email (SendGrid/Resend), SMS (Twilio), push notifications (Firebase Cloud Messaging).
- [ ] Event triggers: booking confirmed, rescheduled, cancelled, reminder (24h, 2h before), review request, payment receipt.
- [ ] User preferences control which channels are active per event type.
- [ ] Push notification opt-in on supported browsers; service worker for PWA.
- [ ] Notification history page for users.
- [ ] Retry logic for failed deliveries (exponential backoff).
- [ ] Templates are customizable by admin (variables: user name, business name, date, time, service).

---

### 3.16 Provider / Business Owner Portal

**Description**: Dedicated interface for business owners to manage their presence, services, calendar, and bookings.

**User Stories**
- As a provider, I want to set up my business profile so that clients can find me.
- As a provider, I want to manage my services and pricing so that my offerings are up to date.
- As a provider, I want to view and manage my calendar so that I control my schedule.
- As a provider, I want to see my earnings so that I can track my business performance.

**Acceptance Criteria**
- [ ] Business profile: name, description, photos, contact info, address, social links, opening hours.
- [ ] Service management: CRUD for services with name, description, duration, price, category.
- [ ] Staff management: add team members, assign services, set individual availability.
- [ ] Calendar: day/week/month views, drag-to-reschedule, click to view details.
- [ ] Booking management: accept/decline (if approval required), cancel, mark no-show/completed.
- [ ] Earnings dashboard: daily, weekly, monthly revenue; payout history; upcoming payouts.
- [ ] Client list: view client history, notes, contact info.
- [ ] Settings: notification preferences, payment settings, integration settings.

---

### 3.17 Admin Dashboard

**Description**: Internal tool for platform administrators to manage users, businesses, payments, and platform health.

**User Stories**
- As an admin, I want to manage user accounts so that I can handle support issues.
- As an admin, I want to oversee businesses so that I can ensure quality and compliance.
- As an admin, I want to view financial metrics so that I can track platform performance.

**Acceptance Criteria**
- [ ] User management: search, filter, suspend/activate, impersonate, view activity log.
- [ ] Business management: approve new registrations, edit details, feature businesses, suspend.
- [ ] Booking oversight: search by reference, view details, cancel or refund if needed.
- [ ] Financial dashboard: GMV, net revenue, platform fees, refunds, payout status.
- [ ] Review moderation: flagged reviews queue, approve/hide/delete actions.
- [ ] Category management: add, edit, reorder, disable service categories.
- [ ] System health: view BullMQ queue status, failed jobs, retry operations.
- [ ] Role-based access: super-admin, support-agent, finance-viewer roles.

---

### 3.18 Background Jobs (BullMQ)

**Description**: Asynchronous job processing for reliability and performance.

**User Stories**
- As a developer, I want non-blocking operations so that the API remains responsive.
- As a user, I want reliable notifications so that I don't miss important updates.

**Acceptance Criteria**
- [ ] BullMQ with Redis for job queuing.
- [ ] Queues defined: `emails`, `sms`, `push-notifications`, `payment-webhooks`, `reminders`, `reports`, `search-indexing`.
- [ ] Job types and priorities:
  - **High**: payment webhooks, booking confirmations
  - **Normal**: email notifications, SMS
  - **Low**: analytics aggregation, search reindexing
- [ ] Retry policy: 3 attempts with exponential backoff; dead-letter queue for failed jobs.
- [ ] Scheduled jobs: daily reminder checks, weekly provider payout reports.
- [ ] Job progress tracking and admin visibility.
- [ ] Graceful shutdown: finish in-progress jobs before server restart.

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | Page load <2s (Lighthouse score >90); API p95 <300ms |
| **Security** | OWASP Top 10 mitigation, HTTPS, CSP headers, rate limiting, input sanitization |
| **Scalability** | Stateless API design, horizontal scaling ready, CDN for static assets |
| **Reliability** | 99.9% uptime target; automated backups; disaster recovery plan |
| **Compliance** | GDPR (data export, deletion), PCI-DSS (Stripe handles card data) |
| **SEO** | SSR for public pages, structured data (Schema.org), sitemap, canonical URLs |

---

## 5. Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL (primary), Redis (cache, sessions, BullMQ) |
| Search | Algolia or PostgreSQL full-text search (MVP) |
| Maps | Google Maps Platform |
| Payments | Stripe (Payment Intents, Connect) |
| Notifications | SendGrid (email), Twilio (SMS), Firebase (push) |
| File Storage | AWS S3 with CloudFront |
| Background Jobs | BullMQ |
| Monitoring | Sentry (errors), Datadog or Grafana (metrics) |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 10,000 by month 6 |
| Booking Conversion Rate | >15% (search to confirmed booking) |
| Provider Onboarded | 500 by month 6 |
| NPS Score | >50 |
| Average API Response Time | <200ms p95 |
| Uptime | 99.9% |

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex availability logic | High | Start with single-staff, expand to multi-staff; thorough unit testing |
| Payment disputes | High | Clear T&Cs, Stripe dispute handling, hold periods for new providers |
| Provider adoption | Medium | Self-serve onboarding, incentive program, dedicated support |
| Seasonal demand spikes | Medium | Auto-scaling, queue-based architecture, caching layers |

---

## 8. Appendix

### 8.1 Glossary
- **Slot**: A specific time window available for booking.
- **Provider**: Business or individual offering services on the platform.
- **Holding period**: Temporary reservation of a slot during the booking flow.

### 8.2 Related Documents
- `docs/architecture.md` — System architecture and data flow
- `docs/api-spec.md` — OpenAPI specification
- `docs/database-schema.md` — Entity relationship diagrams

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex (Product Owner)*
