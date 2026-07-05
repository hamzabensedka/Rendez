# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a platform connecting customers with local service businesses (salons, barbershops, spas, clinics) for appointment booking. The product serves three user types: **Customers** (book appointments), **Providers/Business Owners** (manage business and appointments), and **Admins** (platform oversight).

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | End user seeking to discover and book services | Find providers, book quickly, manage appointments |
| **Guest** | Unregistered browser | Explore without commitment |
| **Provider** | Business owner/manager | Manage schedule, services, staff, and customers |
| **Admin** | Platform operator | Monitor health, resolve issues, support growth |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 (Critical)

**Description:** Secure account creation and access for customers and providers.

| Requirement | Acceptance Criteria |
|-------------|-------------------|
| Registration | Customer can register via email/password or OAuth (Google, Apple) |
| Provider registration | Separate flow with business verification step |
| Login | JWT-based auth with refresh token rotation |
| Password reset | Email link with 1-hour expiry |
| Account verification | Email confirmation required before booking |
| Session management | Auto-logout after 30 days; biometric login on mobile |
| Role-based access | Middleware enforces customer/provider/admin scopes |

**Technical Notes:**
- Passwords: min 8 chars, 1 uppercase, 1 number, 1 special character
- Rate limit: 5 login attempts per 15 minutes
- Store password hashes with bcrypt (cost factor 12)

---

### 3.2 Guest Browse & Explore

**Priority:** P0

**Description:** Allow unauthenticated users to discover businesses and services without registration friction.

| Requirement | Acceptance Criteria |
|-------------|-------------------|
| Business listing view | Guest sees search results with business cards (name, rating, starting price, next available slot) |
| Category browsing | Guest can filter by service category |
| Business detail preview | Guest sees services, prices, photos, reviews; CTA prompts login to book |
| Location context | Guest can set manual location or use geolocation |
| Search history | Stored locally; cleared on logout/cookie expiry |
| Conversion prompt | Non-intrusive banners to register for booking, favorites, or notifications |

**Constraints:** No appointment creation, no favorites, no reviews without account.

---

### 3.3 Business Search & Discovery

**Priority:** P0

**Description:** Core discovery engine for finding businesses by multiple dimensions.

| Requirement | Acceptance Criteria |
|-------------|-------------------|
| Text search | Search by business name, service name, or provider name; fuzzy matching with typo tolerance |
| Filters | Category, price range, rating (4.0+, 4.5+), availability (today, this week), amenities |
| Sort options | Relevance, nearest, highest rated, most reviewed, price (low to high) |
| Auto-complete | Suggestions after 2 characters; includes recent searches |
| Results display | List view with infinite scroll; 20 items per page |
| Empty states | Helpful messaging with alternative suggestions |

**Search Index:** Elasticsearch or PostgreSQL full-text search with trigram indexes.

---

### 3.4 Map-based Search

**Priority:** P0

**Description:** Visual location-based discovery with interactive map.

| Requirement | Acceptance Criteria |
|-------------|-------------------|
| Map integration | Interactive map (Mapbox/Google Maps) with custom business markers |
| Clustering | Auto-cluster markers at zoomed-out levels; expand on click |
| Current location | Blue dot with accuracy ring; button to recenter |
| Radius filter | Adjustable search radius: 1km, 5km, 10km, 25km, 50km |
| Marker info window | Business name, rating, price range, next availability on hover/click |
| List-map toggle | Seamless switch between views; sync filters and results |
| Geocoding | Address → coordinates for search input; reverse geocoding for "Near me" |

---

### 3.5 Business Detail View

**Priority:** P0

**Description:** Comprehensive business profile driving conversion.

| Requirement | Acceptance Criteria |
|-------------|-------------------|
| Header | Business name, verified badge, favorite toggle, share button |
| Photo gallery | Up to 30 images; swipeable carousel; lightbox on click |
| Rating summary | Aggregate rating, review count, rating distribution histogram |
| Services tab | Categorized list with prices, durations, descriptions; expandable for details |
| Team tab | Staff profiles with photos, specialties, ratings |
| Reviews tab | Sortable (newest, highest, lowest); paginated; photo reviews |
| About tab | Description, amenities, hours, location, contact, social links |
| Availability preview | "Next available: Today at 2:30 PM" or date picker inline |
| Action bar | Fixed bottom bar with primary CTA "Book Now" |

---

### 3.6 Service Categories

**Priority:** P0

**Description:** Hierarchical classification system for services.

| Requirement | Acceptance Criteria |
|-------------|-------------------|
| Category tree | 2-level hierarchy: e.g., Beauty → Hair, Nails, Face; Wellness → Massage, Spa |
| Category icons | Consistent iconography per category |
| Business assignment | Each business assigned 1+ categories; primary category for ranking |
| Category landing pages | SEO-optimized pages with featured businesses per city |
| Trending categories | Dynamic based on search volume and bookings |
| Admin management | CRUD for categories; drag-and-drop ordering |

**Initial Categories:** Hair, Barber, Nails, Face & Skin, Massage, Spa, Fitness, Medical Aesthetics, Tattoo & Piercing, Wellness.

---

### 3.7 Booking Flow

**Priority:** P0

**Description:** Friction-reduced appointment reservation system.

| Step | Requirement | Acceptance Criteria |
|------|-------------|-------------------|
| 1 | Service selection | User selects service(s); multi-service booking supported; duration auto-calculated |
| 2 | Provider selection | "Any available" or specific staff member; shows staff availability |
| 3 | Date & time | Calendar view with available slots highlighted; timezone handling; no past dates |
| 4 | Slot selection | Time slots in 15-min increments; real-time availability; hold slot for 10 minutes |
| 5 | Guest info (if not logged in) | Name, phone, email; option to create account |
| 6 | Add-ons | Optional extras (e.g., deep conditioning, premium products) |
| 7 | Notes | Special requests field (max 500 chars) |
| 8 | Payment | See 3.14; deposit or full payment options per business |
| 9 | Confirmation | Booking reference, calendar invite (.ics), add to Apple/Google Wallet |

**Edge Cases:**
- Slot taken during flow: notify user, offer next available
- Business closes: prevent booking within X hours of closure
- Staff absence: dynamically remove affected slots

---

### 3.8 Appointment Management

**Priority:** P0

**Description:** Lifecycle management for customer appointments.

| Requirement | Acceptance Criteria |
|-------------|-------------------|
| View appointments | Upcoming and past tabs; chronological order; status badges |
| Statuses | Pending → Confirmed → Completed / Cancelled / No-show |
| Reschedule | Customer can reschedule up to 2 hours before (configurable per business); same flow as booking |
| Cancel | Customer can cancel with reason selection; refund policy displayed |
| Rebook | One-tap rebook same service with same provider |
| Receipt | Accessible post-appointment; downloadable PDF |
| Provider actions | Confirm, complete, mark no-show, add internal notes |

**Cancellation Policy:** Configurable per business: flexible (24h), moderate (48h), strict (72h).

---

### 3.9 Favorites

**Priority:** P1 (High)

**Description:** Save and quickly access preferred businesses.

| Requirement | Acceptance Criteria |
|-------------|-------------------|
| Add/remove favorite | Heart toggle on business card and detail; haptic feedback on mobile |
| Favorites list | Grid/list view; sort by recently added or name; empty state with discovery CTA |
| Quick actions | Book directly from favorites; see next availability |
| Cross-device sync | Favorites tied to account, not device |
| Notifications | Optional: notify of new availability or promotions from favorites |

---

### 3.10 User Profile

**Priority:** P1

**Description:** Customer account management and preferences.

| Requirement | Acceptance Criteria |
|-------------|-------------------|
| Profile info | Name, photo, phone, email (editable); birthday (optional, for offers) |
| Address book | Multiple saved addresses; default selection for search |
| Preferences | Default notification settings, preferred contact method, accessibility needs |
| Payment methods | Saved cards (tokenized); default selection |
| Booking history | All appointments with filter by status and date range |
| Loyalty | Points balance, tier status, history (if loyalty program active) |
| Data privacy | Download data, delete account (GDPR/CCPA compliance) |

---

### 3.11 Availability & Slot Computation

**Priority:** P0

**Description:** Core scheduling engine calculating bookable time slots.

| Requirement | Acceptance Criteria |
|-------------|-------------------|
| Business hours | Weekly recurring schedule + exception dates (holidays, closures) |
| Slot generation | Based on service duration + buffer time; respects staff working hours |
| Staff scheduling | Individual schedules, breaks, time off; overrides business hours |
| Buffer times | Pre/post-service buffers configurable per service |
| Concurrent bookings | Support for businesses with multiple rooms/stations |
| Real-time updates | Slots invalidate immediately on booking; optimistic UI with server confirmation |
| Buffer zones | Prevent last-minute bookings (e.g., no bookings within 2 hours) |
| Timezone handling | All times stored in UTC; displayed in user's or business's local timezone |
| Complex rules | Recurring blocked times, staff-specific services, service chaining |

**Algorithm:** Generate candidate slots from business hours → subtract breaks, existing bookings, blocked times → filter by minimum advance notice → return available slots.

---

### 3.12 Shared Types & Design System

**Priority:** P0 (Infrastructure)

**Description:** Reusable UI components and type definitions ensuring consistency.

| Category | Elements |
|----------|----------|
| **Colors** | Primary (#0066FF), Success (#00C853), Warning (#FFB300), Error (#FF1744), Neutrals (0-100) |
| **Typography** | Inter font family; scale: 12px caption to 32px H1 |
| **Components** | Buttons (primary, secondary, ghost, icon), Inputs, Cards, Modals, Bottom sheets, Date picker, Time slot grid, Skeleton loaders |
| **Icons** | Lucide icon set; consistent sizing (16, 20, 24, 32px) |
| **Spacing** | 4px base grid; standard padding/margin scale |
| **Motion** | 200ms standard transitions; spring physics for mobile gestures |
| **Shared Types** | User, Business, Service, Appointment, Slot, Review, Payment (TypeScript interfaces) |
| **Breakpoints** | Mobile < 768px, Tablet 768-1024px, Desktop > 1024px |

---

### 3.13 Reviews & Ratings

**Priority:** P1

**Description:** Social proof system for business quality.

| Requirement | Acceptance Criteria |
|-------------|-------------------|
| Eligibility | Only customers with completed appointments can review; verified badge |
| Rating dimensions | Overall (1-5 stars), plus optional: service quality, ambiance, staff, value |
| Review content | Text (10-1000 chars), optional photos (max 5, 5MB each) |
| Response | Business owner can respond publicly; notification to reviewer |
| Moderation | Auto-flag profanity; admin queue for reported reviews |
| Display | Helpful/not helpful voting; sort options; filter by rating, with photos, verified only |
| Analytics | Business sees aggregate metrics, trend over time |

**Anti-gaming:** One review per appointment; 7-day window to review post-appointment.

---

### 3.14 Payment Integration

**Priority:** P0

**Description:** Secure payment processing for deposits and full payments.

| Requirement | Acceptance Criteria |
|-------------|-------------------|
| Payment methods | Cards (Visa, MC, Amex), Apple Pay, Google Pay; Stripe Connect for marketplace |
| Payment models | Full upfront, deposit only (remainder in-person), or pay after service |
| Split payments | Platform fee to admin, remainder to provider (with delay for refund protection) |
| Refunds | Automatic per cancellation policy; manual override by admin |
| Invoices | Email receipt; VAT/GST compliant |
| Failed payment | Retry logic; notify user; auto-cancel if unresolved in 1 hour |
| PCI compliance | Never touch raw card data; use Stripe Elements/Checkout |

---

### 3.15 Notifications

**Priority:** P1

**Description:** Multi-channel communication for booking lifecycle.

| Trigger | Channels | Timing |
|---------|----------|--------|
| Booking confirmation | Push, Email | Immediate |
| Reminder | Push, SMS | 24h and 2h before |
| Modification | Push, Email | Immediate |
| Cancellation | Push, Email, SMS | Immediate |
| Review request | Push, Email | 2 hours after appointment |
| Promotional (opt-in) | Email, Push | Per preference settings |

| Requirement | Acceptance Criteria |
|-------------|-------------------|
| Preferences | Granular opt-in per channel and notification type |
| Delivery tracking | Log delivery status; retry failed push notifications |
| Templates | Localized, brand-consistent; dynamic content injection |
| Quiet hours | No non-urgent notifications 22:00-08:00 user local time |

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0

**Description:** Dedicated interface for business management.

| Module | Requirements |
|--------|--------------|
| **Dashboard** | Today's appointments, revenue snapshot, upcoming week overview, quick actions |
| **Calendar** | Day/week/month views; drag-to-reschedule; color-coded by status; staff filter |
| **Services** | CRUD services; set duration, price, buffer, description, category; archive without deleting history |
| **Staff** | Add team members; set permissions, schedules, services they provide; deactivate |
| **Availability** | Set regular hours, breaks, time off; override specific dates |
| **Bookings** | Full appointment list; search, filter, export; manual booking entry (walk-ins) |
| **Customers** | CRM light: view history, notes, contact; export list |
| **Reviews** | Respond to reviews; flag inappropriate |
| **Analytics** | Revenue, bookings, cancellation rate, top services, customer retention; date range comparison |
| **Settings** | Business info, photos, payment settings, notification preferences, integration (calendar sync) |

**Access Control:** Owner (full access), Manager (most features), Staff (own calendar only).

---

### 3.17 Admin Dashboard

**Priority:** P1

**Description:** Platform administration and oversight.

| Module | Requirements |
|--------|--------------|
| **Businesses** | List, search, filter; approve new registrations; suspend/activate; view details |
| **Users** | Customer and provider accounts; search, view activity, suspend, impersonate (with audit log) |
| **Bookings** | Global view; search by reference, filter, resolve disputes |
| **Reviews** | Moderation queue; approve, reject, edit, delete |
| **Categories** | Manage taxonomy; assign icons, set featured |
| **Payments** | Transaction log; refunds; payout management to providers |
| **Analytics** | MAU, bookings, GMV, churn, top categories, geographic distribution; cohort analysis |
| **System health** | Error rates, API latency, job queue depth; alert thresholds |
| **Content** | Manage promotional banners, featured businesses, push campaigns |
| **Audit log** | Immutable record of admin actions; filterable by user, action, date |

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P0 (Infrastructure)

**Description:** Asynchronous task processing for reliability and scalability.

| Job Type | Description | Priority | Retry |
|----------|-------------|----------|-------|
| `send-notification` | Push, email, SMS dispatch | High | 3x exponential |
| `slot-computation` | Pre-compute and cache available slots | High | 2x immediate |
| `booking-reminder` | Schedule and trigger reminder notifications | Medium | 3x |
| `payment-capture` | Capture authorized payments | High | 5x with backoff |
| `payout-provider` | Transfer funds to provider accounts | High | Manual review after 3x |
| `review-eligibility-check` | Enable review links post-appointment | Medium | 2x |
| `analytics-aggregation` | Daily/weekly rollup of metrics | Low | 2x |
| `data-export` | GDPR data export generation | Low | 2x |
| `image-processing` | Resize, optimize uploaded images | Low | 3x |
| `search-index-update` | Sync business/service changes to search index | High | 2x |

**Queue Configuration:**
- Separate queues by priority and resource needs
- Redis-backed with BullMQ Pro for observability
- Dead letter queue for failed jobs exceeding retries
- Job idempotency keys to prevent duplicates

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App launch < 2s; page load < 1s; API response < 200ms (p95) |
| **Availability** | 99.9% uptime; scheduled maintenance windows |
| **Scalability** | Horizontal scaling; handle 10x traffic spikes |
| **Security** | OWASP Top 10 mitigation; encryption at rest and in transit; regular penetration testing |
| **Accessibility** | WCAG 2.1 AA compliance; screen reader support; minimum 44x44dp touch targets |
| **Localization** | French, English, Spanish, German initial; RTL support planned |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1 |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% of app opens |
| Search-to-book time | < 3 minutes |
| Provider activation rate | > 70% complete profile |
| Customer NPS | > 50 |
| Cancellation rate | < 10% |
| App store rating | > 4.5 stars |
| Support ticket volume | < 1% of bookings |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest browse, Search, Business detail, Booking, Appointments, Provider portal basic, Payments, Notifications | Month 1-2 |
| **V1.1** | Map search, Favorites, Reviews, Profile enhancements | Month 3 |
| **V1.2** | Admin dashboard, Analytics, Background jobs optimization | Month 4 |
| **V2.0** | Loyalty program, Subscriptions, AI recommendations | Month 6 |

---

*Document version: 1.0*
*Last updated: 2024*
*Owner: Alex, Product Owner*