# Planity Clone - Product Specification

## 1. User Authentication
**Description:** Secure identity management for all platform users.

**Acceptance Criteria:**
- Registration via email/password, Google OAuth, and Apple ID
- Email verification with expiring token (24h)
- JWT-based session management with refresh token rotation
- Password reset flow with secure token
- Account deletion with 30-day grace period and data anonymization
- Role-based access: Customer, Business Owner, Admin
- Biometric login support on mobile (Face ID/Touch ID)

**Priority:** P0 - Critical

---

## 2. Guest Browse & Explore
**Description:** Unauthenticated discovery experience to drive conversion.

**Acceptance Criteria:**
- Full search and category browsing without login
- Business profile and service detail visibility
- Map-based search functionality available
- Booking initiation triggers login prompt with state preservation
- Guest session data migrated upon registration
- Limit: 10 profile views before login wall

**Priority:** P0 - Critical

---

## 3. Business Search & Discovery
**Description:** Intelligent search engine for service providers.

**Acceptance Criteria:**
- Full-text search across business name, service, and location
- Filters: category, price range, rating (0.5 increments), availability, gender of provider, accessibility
- Sort options: relevance, distance, rating, price ascending/descending
- Auto-complete with typo tolerance (fuzzy matching)
- Recent searches and trending queries
- Search result pagination (20 items/page)
- Response time < 200ms for cached queries

**Priority:** P0 - Critical

---

## 4. Map-Based Search
**Description:** Geospatial discovery interface.

**Acceptance Criteria:**
- Interactive map with business clustering (max 50 points unclustered)
- Default radius: 5km, adjustable 1-50km
- User geolocation with permission handling
- Boundary search (pan/zoom triggers re-query)
- Map/list toggle with synchronized results
- Directions integration (external maps app)
- Offline tile caching for recently viewed areas

**Priority:** P1 - High

---

## 5. Business Detail View
**Description:** Comprehensive business profile for decision-making.

**Acceptance Criteria:**
- Hero image carousel, business description, hours, contact info
- Service catalog with pricing, duration, and description
- Team member profiles with specialties
- Photo gallery with lightbox viewer
- "Book Now" CTA always visible (sticky on mobile)
- Share via deep link (universal links)
- Report inaccurate information

**Priority:** P0 - Critical

---

## 6. Service Categories
**Description:** Hierarchical classification system.

**Acceptance Criteria:**
- 3-level hierarchy: Category > Subcategory > Service
- Visual category icons with consistent design system
- Category-specific attributes (e.g., hair length for salons)
- Cross-category service assignment
- Featured and trending category sections
- Admin-configurable category ordering

**Priority:** P1 - High

---

## 7. Booking Flow
**Description:** Streamlined appointment reservation process.

**Acceptance Criteria:**
- Step 1: Service selection (with upsell/cross-sell)
- Step 2: Provider selection or "no preference"
- Step 3: Date/time slot selection from computed availability
- Step 4: Review and confirm with cancellation policy
- Guest checkout option (collect minimal info)
- Booking held for 10 minutes during payment
- Confirmation page with calendar invite (.ics) and add-to-wallet
- Immediate confirmation SMS/email

**Priority:** P0 - Critical

---

## 8. Appointment Management
**Description:** Lifecycle management of reservations.

**Acceptance Criteria:**
- Status states: Pending, Confirmed, Completed, Cancelled, No-show
- Customer modifications allowed up to configured threshold (default 24h)
- Cancellation with automatic refund per policy
- Reschedule with new slot validation
- History view with filtering and search
- Rebooking shortcut from past appointments
- Upcoming appointment reminders (24h, 2h, 15min configurable)

**Priority:** P0 - Critical

---

## 9. Favorites
**Description:** User-curated saved businesses and services.

**Acceptance Criteria:**
- One-tap add/remove with heart icon
- Favorites list with search and sort
- Availability alerts when favorited business has open slots
- Favorite services quick-book capability
- Sync across user devices
- Share favorites list (optional)

**Priority:** P2 - Medium

---

## 10. User Profile
**Description:** Centralized user information and preferences.

**Acceptance Criteria:**
- Editable: name, phone, photo, birthday, gender
- Saved addresses with geocoding
- Notification preferences by channel and type
- Payment methods management (PCI-compliant tokenization)
- Preference settings: default radius, preferred categories
- Data export (GDPR compliance)

**Priority:** P1 - High

---

## 11. Availability & Slot Computation
**Description:** Core scheduling engine.

**Acceptance Criteria:**
- Business-configurable operating hours with exceptions
- Slot generation based on service duration + buffer time
- Real-time conflict detection with existing bookings
- Multi-provider scheduling with assignment logic
- Support for recurring blocks and time-off management
- Timezone-aware calculations
- Performance: slot computation < 100ms for 30-day window
- Overbooking protection and waitlist support

**Priority:** P0 - Critical

---

## 12. Shared Types & Design System
**Description:** Consistent UI/UX foundation.

**Acceptance Criteria:**
- Component library: buttons, inputs, cards, modals, date pickers, skeleton loaders
- Typography scale and color palette (light/dark mode)
- Spacing system (4px grid)
- Accessibility: WCAG 2.1 AA minimum
- TypeScript interfaces for all API contracts
- Storybook documentation
- Mobile-first responsive breakpoints

**Priority:** P1 - High

---

## 13. Reviews & Ratings
**Description:** Social proof and quality assurance system.

**Acceptance Criteria:**
- 5-star rating with optional text review (min 10 characters)
- Verified purchase badge for completed appointments only
- Business owner response capability
- Photo attachments in reviews (max 5)
- Flag/report inappropriate content
- Review sorting: most recent, highest/lowest rating
- Aggregate rating display with distribution histogram
- Content moderation queue for admin

**Priority:** P1 - High

---

## 14. Payment Integration
**Description:** Secure transaction processing.

**Acceptance Criteria:**
- Payment methods: credit/debit (Stripe), PayPal, Apple Pay, Google Pay
- Full payment or deposit options (configurable by business)
- Pre-authorization and capture flow
- Automatic invoice/receipt generation
- Refund processing with partial refund support
- PCI DSS compliance (tokenization, no raw card storage)
- Failed payment retry with user notification
- Tip/gratuity option at checkout

**Priority:** P0 - Critical

---

## 15. Notifications
**Description:** Multi-channel user communication.

**Acceptance Criteria:**
- Channels: Push (Firebase/OneSignal), Email (SendGrid), SMS (Twilio)
- Types: booking confirmations, reminders, promotions, review requests
- User-configurable preferences per channel and notification type
- Batch digest option for non-urgent notifications
- Delivery tracking and bounce handling
- Unsubscribe compliance for marketing messages
- Template management with localization support

**Priority:** P1 - High

---

## 16. Business Owner Portal
**Description:** Self-service business management platform.

**Acceptance Criteria:**
- Dashboard: upcoming appointments, revenue metrics, occupancy rate
- Calendar view: daily/weekly/monthly with drag-and-drop rescheduling
- Service management: CRUD operations with pricing and duration
- Staff management: profiles, schedules, permissions
- Availability configuration with exception handling
- Customer database with visit history and notes
- Promotional tools: discount codes, flash sales
- Financial reporting with export (CSV/PDF)
- White-label customization options

**Priority:** P0 - Critical

---

## 17. Admin Dashboard
**Description:** Platform governance and operations center.

**Acceptance Criteria:**
- User and business account management (suspend, verify, impersonate)
- Transaction monitoring with dispute resolution tools
- Content moderation: reviews, business claims, reported content
- Analytics: MAU, booking volume, GMV, churn rates
- Commission/fee configuration
- Feature flags and A/B test management
- System health monitoring and alerting
- Bulk communication tools

**Priority:** P1 - High

---

## 18. Background Jobs (BullMQ)
**Description:** Asynchronous task processing infrastructure.

**Acceptance Criteria:**
- Notification delivery queue with retry logic (3 attempts, exponential backoff)
- Report generation jobs with progress tracking
- Data aggregation and analytics computation (nightly)
- Image/video processing and CDN upload
- Session cleanup and archived data purging
- Webhook delivery with idempotency
- Dead letter queue for failed jobs requiring manual review
- Job monitoring dashboard with filtering and requeue capability
- Rate limiting and concurrency control per queue type

**Priority:** P1 - High

---

## Priority Summary
| Priority | Features |
|----------|----------|
| P0 - Critical | User Authentication, Guest Browse, Business Search, Business Detail, Booking Flow, Appointment Management, Availability/Slots, Payments, Business Owner Portal |
| P1 - High | Map Search, Service Categories, User Profile, Shared Types/Design, Reviews, Notifications, Admin Dashboard, Background Jobs (BullMQ) |
| P2 - Medium | Favorites |