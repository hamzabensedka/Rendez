# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Platform:** Web (responsive), iOS, Android  
**Target Audience:** Consumers seeking beauty & wellness appointments; business owners managing salons, clinics, and spas.  
**Goal:** Build a marketplace that connects clients with local beauty/wellness businesses, enabling seamless discovery, booking, and appointment management.

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0 — Critical  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Secure user registration and login system supporting multiple authentication methods. |
| **User Stories** | As a user, I want to create an account so I can book appointments. As a returning user, I want to log in quickly. |
| **Acceptance Criteria** | 1. Users can register with email/password, phone number, or social providers (Google, Apple, Facebook). 2. Passwords must be hashed (bcrypt) with minimum 8 chars, 1 uppercase, 1 number, 1 special char. 3. Email verification required before first booking. 4. JWT access token (15min expiry) + refresh token (7 days) pattern. 5. Password reset via secure email link (1-hour expiry). 6. Rate limiting: 5 failed attempts triggers 30-min lockout. 7. OAuth2 callback handles both signup and login. 8. Phone auth via SMS OTP (Twilio). |
| **Edge Cases** | Social account email conflicts with existing email account; prompt merge. Token expiry mid-session triggers silent refresh. |
| **Dependencies** | None (foundational) |
| **Metrics** | Signup conversion rate, login success rate, password reset completion rate |

---

### 2.2 Guest Browse & Explore

**Priority:** P0 — Critical  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Allow unauthenticated users to browse businesses and services without creating an account. |
| **User Stories** | As a guest, I want to explore available services before committing to registration. |
| **Acceptance Criteria** | 1. Guest users can view business listings, search, and filter without login. 2. Guest users can view business details and service menus. 3. "Book Now" CTA prompts login/signup with return URL preserved. 4. Guest session data (search filters, viewed businesses) persisted for 7 days via localStorage. 5. Upon registration, guest data merges to authenticated account. 6. No access to: booking, favorites, reviews, appointment history. |
| **Edge Cases** | Guest clears cookies — lose history. Guest converts to user — deduplicate favorites/wishlist. |
| **Dependencies** | User Authentication, Business Search & Discovery |
| **Metrics** | Guest-to-signup conversion rate, pages per guest session |

---

### 2.3 Business Search & Discovery

**Priority:** P0 — Critical  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Powerful search and filtering to help users find relevant businesses. |
| **User Stories** | As a client, I want to find hair salons near me that are open now and have good ratings. |
| **Acceptance Criteria** | 1. Full-text search across business name, service name, and description. 2. Filters: location (radius), service category, price range, rating (min stars), availability (open now, specific date/time), amenities. 3. Sort options: relevance, distance, rating, price (low to high), most reviewed. 4. Auto-complete suggestions with recent searches. 5. Search results display: thumbnail, name, rating, distance, starting price, next available slot. 6. Pagination with infinite scroll (20 results per page). 7. Debounced search input (300ms). 8. Search query persisted in URL for shareability. |
| **Edge Cases** | No results — show "expand radius" suggestion and related categories. Location permission denied — fallback to city-level default. |
| **Dependencies** | Guest Browse & Explore, Map-based Search |
| **Metrics** | Search success rate (click-through), filter usage, zero-result rate |

---

### 2.4 Map-based Search

**Priority:** P0 — Critical  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Interactive map view showing business locations with clustering and detail popovers. |
| **User Stories** | As a client, I want to see businesses on a map to choose one conveniently located. |
| **Acceptance Criteria** | 1. Toggle between list and map views on search results. 2. Map displays business pins; cluster pins when zoomed out (max 50 per cluster). 3. Click pin opens card with: name, rating, photo, starting price, "View" CTA. 4. Map bounds update search results dynamically (debounced 500ms). 5. User location dot with accuracy radius. 6. Custom map styling matching brand. 7. Mobile: bottom sheet for business list, draggable to expand. 8. Accessibility: pins keyboard-navigable, alt text for screen readers. |
| **Edge Cases** | Single business in remote area — auto-zoom to appropriate level. Map tiles fail — graceful fallback to list view. |
| **Dependencies** | Business Search & Discovery |
| **Metrics** | Map view adoption, pin click-through rate, map-to-booking conversion |

---

### 2.5 Business Detail View

**Priority:** P0 — Critical  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Comprehensive business profile page with all information needed to make a booking decision. |
| **User Stories** | As a client, I want to see photos, services, prices, and reviews to choose the right business. |
| **Acceptance Criteria** | 1. Hero image carousel (up to 10 photos), video support. 2. Business info: name, verified badge, address, phone, hours, website link. 3. Service menu with categories, descriptions, durations, prices. 4. Staff/professional profiles with photos and specialties. 5. Reviews summary (average, total count, distribution) + recent reviews. 6. "Book Now" sticky CTA. 7. Share business (deep link, social). 8. Report business option. 9. Similar businesses carousel. 10. SEO-structured data (Schema.org LocalBusiness). |
| **Edge Cases** | Business has no photos — show placeholder gallery. Business temporarily closed — banner notice with reopen date. |
| **Dependencies** | Reviews & Ratings, Service Categories |
| **Metrics** | Page views, time on page, booking conversion from detail view |

---

### 2.6 Service Categories

**Priority:** P0 — Critical  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Hierarchical categorization of beauty and wellness services for discovery and filtering. |
| **User Stories** | As a client, I want to browse by category (e.g., Hair, Nails, Massage) to find what I need. |
| **Acceptance Criteria** | 1. Top-level categories: Hair, Face, Body, Nails, Massage, Wellness, Medical Aesthetic, Barber. 2. Sub-categories up to 2 levels deep (e.g., Hair > Coloring > Balayage). 3. Category icons and color coding. 4. Category pages with featured businesses, trending services. 5. Businesses can assign multiple categories to services. 6. Admin-managed category taxonomy with slug-based URLs. 7. Category analytics: popular searches, emerging trends. |
| **Edge Cases** | New service doesn't fit existing categories — "Other" with admin review queue. Category merge requires redirect rules. |
| **Dependencies** | None |
| **Metrics** | Category browse-to-book rate, most/least popular categories |

---

### 2.7 Booking Flow

**Priority:** P0 — Critical  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | End-to-end appointment booking from service selection to confirmation. |
| **User Stories** | As a client, I want to book an appointment in as few steps as possible. |
| **Acceptance Criteria** | 1. **Step 1 — Select Service:** Choose service, optional add-ons, see total price and duration. 2. **Step 2 — Select Staff:** Choose specific professional or "No preference." 3. **Step 3 — Select Date/Time:** Calendar view with available slots (computed in real-time). 4. **Step 4 — Confirm Details:** Review, add notes, apply promo code. 5. **Step 5 — Payment:** Pay deposit, full amount, or book without payment (business-configurable). 6. **Step 6 — Confirmation:** Booking reference, add to calendar, share. 7. Entire flow < 60 seconds for returning users. 8. Guest checkout supported with email capture. 9. Booking held for 10 minutes during payment (inventory reservation). |
| **Edge Cases** | Slot taken during booking — offer next 3 available alternatives. Payment fails — hold released, user notified with retry. |
| **Dependencies** | Availability & Slot Computation, Payment Integration, Notifications |
| **Metrics** | Booking completion rate, funnel drop-off by step, time to book |

---

### 2.8 Appointment Management

**Priority:** P0 — Critical  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Users can view, reschedule, cancel, and review their appointments. |
| **User Stories** | As a client, I want to manage my bookings without calling the business. |
| **Acceptance Criteria** | 1. Upcoming appointments list with status badges (confirmed, pending, completed, cancelled, no-show). 2. Appointment detail: service, staff, time, location, directions, contact. 3. Reschedule: select new slot, subject to business cancellation policy. 4. Cancel with reason selection; enforce policy (e.g., 24h minimum). 5. Rebook past appointment with one tap. 6. Push, SMS, and email reminders (24h, 2h before). 7. Add to native calendar (iCal, Google Calendar). 8. Upcoming appointment widget on home screen. |
| **Edge Cases** | Late cancellation fee applied per business policy. Business cancels — full refund, user notified with alternatives. |
| **Dependencies** | Booking Flow, Notifications, Payment Integration |
| **Metrics** | Reschedule rate, cancellation rate, no-show rate, support contact rate |

---

### 2.9 Favorites

**Priority:** P1 — High  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Users can save businesses and services for quick access later. |
| **User Stories** | As a client, I want to save my favorite salon so I can rebook easily. |
| **Acceptance Criteria** | 1. Heart icon on business cards and detail pages toggles favorite status. 2. Favorites list with search and filter. 3. Quick rebook from favorite (pre-filled service, staff preference). 4. Favorite businesses show "Liked" badge in search results. 5. Push notification when favorite business has new availability or promotion. 6. Sync favorites across devices (logged-in users). 7. Maximum 500 favorites per user. |
| **Edge Cases** | Business deactivated — show "Unavailable" with option to remove. User hits limit — prompt to clean up. |
| **Dependencies** | User Authentication, Business Detail View |
| **Metrics** | Favorites per user, rebook rate from favorites, favorite-to-booking conversion |

---

### 2.10 User Profile

**Priority:** P1 — High  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Personal profile management with preferences, payment methods, and history. |
| **User Stories** | As a user, I want to manage my personal information and preferences. |
| **Acceptance Criteria** | 1. Profile fields: photo, name, phone, email, birthday (for birthday offers). 2. Notification preferences: push, email, SMS (granular per type). 3. Saved payment methods (PCI-compliant tokenization). 4. Appointment history with receipts. 5. Preferred language and currency. 6. Accessibility preferences (reduced motion, high contrast). 7. Data export (GDPR) and account deletion. 8. Referral code and credits balance. |
| **Edge Cases** | Email change requires re-verification. Account deletion: 30-day grace period, anonymize data after. |
| **Dependencies** | User Authentication, Payment Integration |
| **Metrics** | Profile completion rate, preference change frequency |

---

### 2.11 Availability & Slot Computation

**Priority:** P0 — Critical  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Real-time calculation of available appointment slots based on complex business rules. |
| **User Stories** | As a business, I want accurate availability so I never get double-booked. |
| **Acceptance Criteria** | 1. Business defines: operating hours, break times, slot duration per service, buffer between appointments. 2. Staff-level availability (vacation, part-time hours). 3. Service dependencies (e.g., color requires stylist, not assistant). 4. Real-time slot computation with < 200ms response. 5. Handle concurrent booking requests with optimistic locking. 6. Support recurring blocked times (holidays, maintenance). 7. Buffer time configurable per service type. 8. Timezone-aware for cross-timezone bookings. |
| **Edge Cases** | Two users request same slot simultaneously — first completes, second offered alternatives. Staff calls in sick — bulk slot cancellation. |
| **Dependencies** | Background Jobs (BullMQ) for cache warming |
| **Metrics** | Slot computation latency, double-booking incidents, cache hit rate |

---

### 2.12 Shared Types & Design System

**Priority:** P0 — Critical  
**Owner:** Design / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Consistent UI components, tokens, and type definitions across all platforms. |
| **User Stories** | As a developer, I want reusable components so I can build features quickly and consistently. |
| **Acceptance Criteria** | 1. Design tokens: colors, typography, spacing, shadows, border-radius (Figma source of truth). 2. Component library: Button, Input, Card, Modal, DatePicker, TimeSlot, Avatar, Badge, Toast, Skeleton. 3. Shared TypeScript types between frontend and backend (monorepo). 4. Responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px). 5. Dark mode support. 6. Accessibility: WCAG 2.1 AA minimum, focus states, ARIA labels. 7. Storybook for component documentation. 8. i18n framework ready (default en, fr, de, es). |
| **Edge Cases** | RTL language support (Arabic, Hebrew). High contrast mode override. |
| **Dependencies** | None (enables all others) |
| **Metrics** | Component reuse rate, design debt tickets, accessibility audit score |

---

### 2.13 Reviews & Ratings

**Priority:** P1 — High  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Post-appointment review system for quality transparency and trust. |
| **User Stories** | As a client, I want to read honest reviews before booking. As a business, I want to showcase my quality. |
| **Acceptance Criteria** | 1. Review eligibility: verified appointment completion only. 2. Rating: 1-5 stars with optional detailed ratings (Service, Staff, Ambiance, Value). 3. Text review: 10-1000 characters, profanity filter. 4. Photo upload (up to 5 images). 5. Business response to reviews. 6. Review helpfulness voting. 7. Flag inappropriate reviews for moderation. 8. Reviews appear after 24-hour grace period (business can resolve issue first). 9. Aggregate rating recalculation on new review. |
| **Edge Cases** | User attempts multiple reviews for same appointment — update existing. Business disputes review — admin arbitration workflow. |
| **Dependencies** | Appointment Management |
| **Metrics** | Review submission rate, average rating distribution, response rate |

---

### 2.14 Payment Integration

**Priority:** P0 — Critical  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Secure, flexible payment processing for bookings with multiple methods and payout to businesses. |
| **User Stories** | As a client, I want to pay securely with my preferred method. As a business, I want to receive payouts reliably. |
| **Acceptance Criteria** | 1. Payment methods: credit/debit cards (Stripe), Apple Pay, Google Pay, PayPal, buy-now-pay-later (Klarna). 2. Payment models: full prepay, deposit (remainder at appointment), pay-at-venue. 3. Stripe Connect for marketplace split payments. 4. Refund processing: full, partial, store credit. 5. Invoice generation and email delivery. 6. PCI DSS compliance — no raw card data stored. 7. Failed payment retry with saved method. 8. Payout schedule: daily, weekly, monthly (business-configurable). 9. Tax calculation and VAT invoice for EU. |
| **Edge Cases** | 3D Secure challenge — handle redirect flow. Currency mismatch — convert with displayed rate. Chargeback — dispute management portal. |
| **Dependencies** | Booking Flow, User Profile |
| **Metrics** | Payment success rate, refund rate, chargeback rate, payout latency |

---

### 2.15 Notifications

**Priority:** P1 — High  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Multi-channel notification system for timely user communication. |
| **User Stories** | As a user, I want to be reminded of my appointments and informed of changes. |
| **Acceptance Criteria** | 1. Channels: push (Firebase/OneSignal), SMS (Twilio), email (SendGrid), in-app inbox. 2. Notification types: booking confirmation, reminder (24h, 2h), cancellation, reschedule, promotion, review request, payment receipt. 2. User preference controls per channel and type. 3. Notification templates with variables, localized. 4. Delivery tracking: sent, delivered, opened, failed. 5. Batch/bulk notifications for business-wide announcements. 6. Quiet hours respect (default 22:00-08:00, user-configurable). 7. Unsubscribe for marketing communications. |
| **Edge Cases** | User disables all push — fallback to SMS for critical. Email bounces — flag for profile update prompt. |
| **Dependencies** | Background Jobs (BullMQ) for queueing |
| **Metrics** | Delivery rate, open rate, opt-out rate, notification-driven bookings |

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0 — Critical  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Comprehensive dashboard for business owners to manage their presence, services, staff, and appointments. |
| **User Stories** | As a business owner, I want to manage my salon efficiently from one place. |
| **Acceptance Criteria** | 1. **Dashboard:** Today's appointments, revenue snapshot, recent reviews, quick actions. 2. **Calendar View:** Day/week/month views, drag-to-reschedule, color-coded by status. 3. **Appointment Management:** View details, confirm, cancel, mark no-show, add notes. 4. **Services:** CRUD services, pricing, duration, staff associations. 5. **Staff Management:** Add professionals, set schedules, permissions (admin/receptionist/stylist). 6. **Business Profile:** Photos, description, hours, amenities, policies. 7. **Clients:** CRM with visit history, notes, preferences, marketing tags. 8. **Reports:** Revenue, bookings, staff performance, cancellation trends. 9. **Settings:** Payout account, notification preferences, integration (Google Calendar sync). 10. Mobile-responsive for on-the-go management. |
| **Edge Cases** | Staff leaves — reassign future appointments or mark unavailable. Business has multiple locations — location switcher. |
| **Dependencies** | Appointment Management, Availability & Slot Computation, Payment Integration |
| **Metrics** | Daily active business users, tasks completed per session, support ticket volume |

---

### 2.17 Admin Dashboard

**Priority:** P1 — High  
**Owner:** Product / Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Internal tool for platform management, moderation, and analytics. |
| **User Stories** | As an admin, I need visibility and control over the entire marketplace. |
| **Acceptance Criteria** | 1. **User Management:** Search, view, suspend, impersonate users. 2. **Business Management:** Approve new registrations, verify documents, suspend, feature. 3. **Content Moderation:** Review flagged reviews, photos, business claims. Queue with SLA (24h). 4. **Financial Oversight:** Transaction logs, dispute resolution, refund approval, payout monitoring. 5. **Analytics:** MAU, bookings, GMV, churn, CAC, LTV by cohort. 6. **Marketing:** Promo code creation, campaign management, push notification broadcast. 7. **System Health:** Error rates, API latency, job queue depth. 8. **Audit Log:** All admin actions with timestamp and IP. 9. Role-based access (super admin, support, finance, marketing). |
| **Edge Cases** | Bulk business suspension (fraud ring). Data export for legal request. |
| **Dependencies** | All other features |
| **Metrics** | Moderation queue depth, average resolution time, admin task completion |

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P0 — Critical  
**Owner:** Engineering  

| Aspect | Details |
|--------|---------|
| **Description** | Reliable, scalable job queue for asynchronous processing. |
| **User Stories** | As a system, I need to handle heavy or time-sensitive tasks without blocking user requests. |
| **Acceptance Criteria** | 1. **Job Types:** Email sending, SMS/push delivery, payment webhooks, report generation, image/video processing, search index updates, slot cache warming, data exports, recurring billing. 2. **Queue Structure:** Separate queues by priority (critical, high, normal, low). 3. **Retry Logic:** Exponential backoff, max 5 retries, dead-letter queue for failures. 4. **Monitoring:** Dashboard with job counts, processing rates, failed job details, retry controls. 5. **Concurrency:** Configurable workers per queue type. 6. **Scheduling:** Delayed jobs, cron-like recurring jobs. 7. **Idempotency:** Job deduplication via unique job IDs. 8. **Graceful shutdown:** Finish in-progress jobs before worker termination. |
| **Edge Cases** | Redis outage — queue pauses, jobs persist. Job stuck > 1 hour — auto-alert, manual intervention. |
| **Dependencies** | Redis, all features that enqueue jobs |
| **Metrics** | Job throughput, failure rate, average processing time, queue depth |

---

## 3. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | Page load < 2s (95th percentile), API response < 200ms, slot computation < 200ms |
| **Scalability** | Support 10,000 concurrent users, 1M monthly bookings |
| **Security** | OWASP Top 10 mitigation, encryption at rest and in transit, SOC 2 Type II roadmap |
| **Compliance** | GDPR, CCPA, PCI DSS Level 1 |
| **Reliability** | 99.9% uptime SLA, < 0.1% error rate |
| **Accessibility** | WCAG 2.1 AA, screen reader compatible, keyboard navigable |

---

## 4. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | User Auth, Guest Browse, Business Search, Map Search, Business Detail, Service Categories, Booking Flow, Appointment Management, Availability, Payment, Provider Portal | Month 1-3 |
| **V1.1** | Favorites, User Profile, Reviews & Ratings, Notifications | Month 4 |
| **V1.2** | Admin Dashboard, Background Jobs optimization, Analytics | Month 5 |
| **V1.3** | Advanced features: Memberships, Packages, Gift Cards, Waitlist | Month 6 |

---

## 5. Success Metrics (OKRs)

| Objective | Key Results |
|-----------|-------------|
| Grow marketplace | 10,000 monthly bookings by Q2, 500 active businesses |
| Optimize conversion | 15% search-to-booking rate, < 3% booking abandonment |
| Ensure quality | 4.5+ average business rating, < 2% dispute rate |
| Drive retention | 40% monthly user retention, 60% rebook within 60 days |

---

*Document Version: 1.0*  
*Last Updated: 2024*  
*Owner: Alex, Product Owner*
