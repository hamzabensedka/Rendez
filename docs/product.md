# Planity Clone - Product Specification

## Document Information
- **Version**: 1.0.0
- **Last Updated**: 2024
- **Author**: Alex (Product Owner)
- **Status**: Draft

---

## 1. Overview

### 1.1 Product Vision
Planity Clone is a comprehensive appointment booking platform connecting customers with local service businesses (salons, barbershops, spas, clinics). The platform enables seamless discovery, booking, and management of appointments while providing business owners with powerful tools to manage their operations.

### 1.2 Target Users
- **Customers (B2C)**: Individuals seeking to book appointments with local service providers
- **Business Owners (B2B)**: Service providers managing their appointments, staff, and availability
- **Administrators (Internal)**: Platform operators managing the ecosystem

### 1.3 Success Metrics
- Booking conversion rate > 15%
- Search-to-booking time < 3 minutes
- Business owner adoption rate > 80%
- Customer retention (30-day) > 40%

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority**: P0 (Critical)
**Description**: Secure identity management for all user types

#### Features:
- Email/password registration with validation
- Social login (Google, Apple, Facebook)
- JWT-based session management with refresh tokens
- Password reset via email
- Role-based access control (Customer, Business Owner, Admin)
- Account verification (email confirmation)
- Multi-factor authentication (optional)

#### Acceptance Criteria:
- [ ] User can register with email, password, and phone number
- [ ] Password must be minimum 8 characters with uppercase, lowercase, number, and special character
- [ ] Social login creates account or links to existing account
- [ ] JWT tokens expire after 15 minutes; refresh tokens valid for 7 days
- [ ] Password reset email delivered within 5 minutes
- [ ] Unverified users cannot book appointments
- [ ] Rate limiting: 5 login attempts per 15 minutes

#### API Endpoints:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`

---

### 2.2 Guest Browse & Explore
**Priority**: P0 (Critical)
**Description**: Allow unauthenticated users to browse businesses and services without registration friction

#### Features:
- Browse businesses without login
- View business profiles and service listings
- Search by category and location
- View ratings and reviews (summary only)
- Prompt for login at booking initiation (soft conversion)

#### Acceptance Criteria:
- [ ] Guest users can access all browse and search functionality
- [ ] Guest users see "Book Now - Login Required" CTA on business pages
- [ ] Guest search history persists for 24 hours via localStorage
- [ ] Converting from guest to registered user preserves search context
- [ ] Guest users cannot see full review details (only aggregate rating)
- [ ] Analytics track guest-to-registered conversion funnel

---

### 2.3 Business Search & Discovery
**Priority**: P0 (Critical)
**Description**: Intelligent search and filtering to help customers find relevant businesses

#### Features:
- Full-text search by business name, service name, or keyword
- Filter by: category, price range, rating, availability (today, this week), distance
- Sort by: relevance, rating, price (low to high), distance
- Auto-complete suggestions
- Recent searches
- Popular searches trending
- Search result cards with key info (image, rating, price range, next availability)

#### Acceptance Criteria:
- [ ] Search returns results within 500ms for 95% of queries
- [ ] Results paginated at 20 items per page
- [ ] Empty states provide helpful next steps
- [ ] Search handles typos with fuzzy matching (Levenshtein distance <= 2)
- [ ] Filters can be combined (AND logic)
- [ ] "Available today" filter only shows businesses with open slots
- [ ] Search radius defaults to 10km, max 100km

---

### 2.4 Map-based Search
**Priority**: P0 (Critical)
**Description**: Visual location-based discovery with interactive map

#### Features:
- Interactive map with business markers
- Cluster markers for dense areas
- User location detection with permission
- Custom map pins by category
- List/map toggle view
- Business preview on marker click
- Directions integration (external maps app)
- Geofencing for search radius

#### Acceptance Criteria:
- [ ] Map loads within 2 seconds
- [ ] Markers update dynamically on map pan/zoom
- [ ] Maximum 100 markers rendered at once with clustering
- [ ] User location accuracy within 100 meters
- [ ] Fallback to IP-based geolocation if GPS denied
- [ ] Map bounds respected in search query
- [ ] Mobile: bottom sheet for business preview, full detail on tap

---

### 2.5 Business Detail View
**Priority**: P0 (Critical)
**Description**: Comprehensive business profile page

#### Features:
- Hero image gallery (up to 10 images)
- Business info: name, category, address, phone, hours
- Service menu with pricing and duration
- Staff/professional listings
- Aggregate rating and review count
- Next available slot highlight
- Business description and amenities
- COVID-19/safety protocols
- Social media links

#### Acceptance Criteria:
- [ ] Page loads within 1.5 seconds
- [ ] Images lazy-loaded with blur placeholder
- [ ] "Book" button always visible (sticky on mobile)
- [ ] Hours display in user's timezone
- [ ] Closed days clearly indicated
- [ ] Phone number triggers native dial on mobile
- [ ] Gallery supports swipe gesture and pinch-to-zoom

---

### 2.6 Service Categories
**Priority**: P0 (Critical)
**Description**: Hierarchical categorization of services for discovery and organization

#### Features:
- Predefined category tree (e.g., Hair > Cut, Color, Treatment)
- Business can map services to categories
- Category icons and colors
- Trending categories
- Category-based search shortcuts

#### Categories (v1):
- **Hair**: Cut, Color, Highlights, Balayage, Treatment, Styling, Extensions
- **Barber**: Cut, Beard, Shave, Package
- **Nails**: Manicure, Pedicure, Gel, Acrylic, Nail Art
- **Face**: Facial, Makeup, Eyebrows, Lashes
- **Body**: Massage, Waxing, Tanning, Spa
- **Medical Aesthetic**: Botox, Filler, Laser, Peel
- **Tattoo & Piercing**: Tattoo, Piercing, Removal

#### Acceptance Criteria:
- [ ] Category tree depth max 3 levels
- [ ] Businesses must select at least one category
- [ ] Services without category display in "Other"
- [ ] Category filter shows count of available businesses
- [ ] Category icons are consistent and accessible

---

### 2.7 Booking Flow
**Priority**: P0 (Critical)
**Description**: Streamlined multi-step appointment booking

#### Features:
**Step 1: Service Selection**
- Select service(s) with add-ons
- View duration and price

**Step 2: Professional Selection**
- Choose specific professional or "No preference"
- View professional profiles and ratings

**Step 3: Date & Time**
- Calendar view with availability
- Time slot grid
- Timezone handling

**Step 4: Review & Confirm**
- Order summary
- Apply promotion code
- Special requests

**Step 5: Payment**
- Saved payment methods
- New card entry
- Apple Pay / Google Pay

**Step 6: Confirmation**
- Booking details
- Add to calendar
- Share booking

#### Acceptance Criteria:
- [ ] Complete flow in under 60 seconds for returning users
- [ ] Progress indicator shows current step
- [ ] Back navigation preserves selections
- [ ] Slot held for 10 minutes during payment (inventory hold)
- [ ] Booking confirmed only after successful payment or "pay at venue" selection
- [ ] Confirmation email/SMS sent within 30 seconds
- [ ] Failed payment releases hold and notifies user
- [ ] Guest checkout supported (email + phone required)

---

### 2.8 Appointment Management
**Priority**: P0 (Critical)
**Description**: Full lifecycle management of appointments for customers and businesses

#### Customer Features:
- View upcoming and past appointments
- Reschedule (up to 2 hours before, configurable by business)
- Cancel with reason selection
- Rebook favorite services
- Add to calendar (iCal, Google Calendar)

#### Business Features:
- Calendar view (day, week, month)
- Create, edit, cancel appointments
- Block time slots
- Mark no-show
- Add notes
- View customer history

#### Acceptance Criteria:
- [ ] Reschedule maintains same service and professional if available
- [ ] Cancellation policy displayed at booking and enforced
- [ ] Late cancellation fees processed automatically if configured
- [ ] Waitlist notification when slot opens
- [ ] Calendar sync bidirectional (Google/Outlook)
- [ ] Push notifications for upcoming appointments (24h, 2h, 15min)
- [ ] Business can set custom cancellation windows per service

---

### 2.9 Favorites
**Priority**: P1 (High)
**Description**: Save and quickly access preferred businesses and professionals

#### Features:
- Heart icon on business cards and detail pages
- Favorites list with quick rebooking
- Favorite professionals within a business
- Get notified of new availability or promotions from favorites

#### Acceptance Criteria:
- [ ] Toggle favorite with one tap, immediate feedback
- [ ] Maximum 200 favorites per user
- [ ] Favorites sync across devices
- [ ] Unfavorited businesses removed from list immediately
- [ ] Option to receive/not receive notifications per favorite

---

### 2.10 User Profile
**Priority**: P1 (High)
**Description**: Customer account management and preferences

#### Features:
- Personal info (name, email, phone, photo)
- Saved payment methods
- Address book
- Notification preferences (email, SMS, push)
- Booking history with receipts
- Loyalty/points (future)
- Data export (GDPR)
- Account deletion

#### Acceptance Criteria:
- [ ] Profile photo upload with 5MB limit, auto-crop to square
- [ ] Phone number editable with re-verification
- [ ] Payment methods managed via PCI-compliant tokenization (Stripe)
- [ ] Booking history searchable and filterable by date/status
- [ ] Account deletion initiates 30-day grace period
- [ ] Data export delivered within 24 hours via email

---

### 2.11 Availability & Slot Computation
**Priority**: P0 (Critical)
**Description**: Real-time availability calculation engine

#### Features:
- Business operating hours configuration
- Staff schedule management
- Service duration and buffer time
- Recurring and one-time unavailability
- Overbooking protection
- Slot generation algorithm
- Timezone-aware scheduling

#### Algorithm Requirements:
- Generate slots based on: staff availability - existing bookings - buffers
- Support for multiple simultaneous bookings (rooms, chairs)
- Variable service durations
- Combo service chaining

#### Acceptance Criteria:
- [ ] Slots computed in < 200ms
- [ ] No double-bookings possible (database-level constraint)
- [ ] Buffer time configurable per service (default 15 min)
- [ ] Last slot ends no later than closing time minus service duration
- [ ] Real-time updates via WebSocket when slots are held/booked
- [ ] Support for split shifts and irregular schedules
- [ ] DST transitions handled correctly

---

### 2.12 Shared Types & Design System
**Priority**: P1 (High)
**Description**: Consistent UI/UX across all platforms

#### Design System:
- **Colors**: Primary #6C5CE7, Secondary #00B894, Error #FF7675, Success #00B894, Warning #FDCB6E
- **Typography**: Inter (headings), SF Pro/Text (body)
- **Spacing**: 4px base grid
- **Border radius**: 8px (components), 16px (cards), full (pills)
- **Shadows**: 0 2px 8px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.12)

#### Component Library:
- Buttons (primary, secondary, ghost, danger)
- Inputs (text, select, date, time)
- Cards (business, service, professional)
- Modals and bottom sheets
- Calendar and time picker
- Loading states and skeletons
- Empty states
- Error boundaries

#### Acceptance Criteria:
- [ ] All components support dark mode
- [ ] WCAG 2.1 AA compliance
- [ ] Touch targets minimum 44x44px
- [ ] Responsive breakpoints: mobile < 768px, tablet 768-1024px, desktop > 1024px
- [ ] RTL language support
- [ ] Reduced motion support

---

### 2.13 Reviews & Ratings
**Priority**: P1 (High)
**Description**: Social proof and feedback system

#### Features:
- Star rating (1-5) with half-stars
- Written review with photo upload
- Review helpfulness voting
- Business response to reviews
- Review after appointment completion
- Moderation workflow

#### Acceptance Criteria:
- [ ] Only verified customers can review (post-appointment)
- [ ] Review prompt sent 24 hours after appointment
- [ ] Reviews editable for 7 days
- [ ] Business can flag inappropriate reviews
- [ ] Average rating recalculated in real-time
- [ ] Reviews sorted by: helpfulness, recency, rating
- [ ] Photo reviews require moderation before public display
- [ ] Minimum 10 characters for written review

---

### 2.14 Payment Integration
**Priority**: P0 (Critical)
**Description**: Secure payment processing for bookings

#### Features:
- Stripe integration for card payments
- Apple Pay / Google Pay
- "Pay at venue" option (configurable by business)
- Deposit/partial payment support
- Automatic refunds for cancellations
- Invoice generation
- Tax calculation

#### Acceptance Criteria:
- [ ] PCI DSS compliance via Stripe Elements (no card data touches servers)
- [ ] Payment intent created at booking confirmation
- [ ] 3D Secure supported for applicable cards
- [ ] Failed payment retry with saved method
- [ ] Refunds processed within 5-10 business days
- [ ] Receipt emailed immediately upon successful charge
- [ ] Webhook handling for payment status updates
- [ ] Idempotency keys on all payment requests

---

### 2.15 Notifications
**Priority**: P1 (High)
**Description**: Multi-channel communication system

#### Channels:
- Push notifications (OneSignal/Firebase)
- SMS (Twilio)
- Email (SendGrid)
- In-app notification center

#### Notification Types:
| Type | Customer | Business | Timing |
|------|----------|----------|--------|
| Booking confirmed | ✓ | ✓ | Immediate |
| Booking reminder | ✓ | ✓ | 24h, 2h, 15min before |
| Booking cancelled | ✓ | ✓ | Immediate |
| Booking rescheduled | ✓ | ✓ | Immediate |
| Review request | ✓ | - | 24h after appointment |
| Promotion | ✓ (opt-in) | - | Scheduled |
| Low inventory | - | ✓ | Daily |

#### Acceptance Criteria:
- [ ] User can customize Euros preferences per channel
- [ ] Unsubscribe link in all emails
- [ ] Push notification opt-in on first relevant action
- [ ] Notification history retained for 90 days
- [ ] Failed deliveries retried 3 times with exponential backoff
- [ ] Rate limiting: max 10 promotional notifications per user per day

---

### 2.16 Provider / Business Owner Portal
**Priority**: P0 (Critical)
**Description**: Comprehensive business management dashboard

#### Features:
**Dashboard**
- Today's appointments overview
- Revenue metrics
- New vs. returning customers
- Upcoming week preview

**Calendar Management**
- Drag-and-drop scheduling
- Multi-staff view
- Availability rules
- Time-off management

**Services**
- CRUD service offerings
- Pricing and duration
- Category assignment
- Online booking toggle

**Staff Management**
- Add team members
- Set permissions (admin, manager, staff)
- Individual schedules
- Commission tracking (future)

**Customers**
- Customer database
- Booking history per customer
- Notes and preferences
- Marketing tools (future)

**Settings**
- Business profile
- Operating hours
- Cancellation policy
- Payment settings
- Integrations

#### Acceptance Criteria:
- [ ] Dashboard loads within 2 seconds
- [ ] Calendar supports concurrent editing with optimistic UI
- [ ] Changes sync in real-time to customer-facing app
- [ ] Role-based menu hiding (staff see only their calendar)
- [ ] Export data to CSV/Excel
- [ ] Mobile-responsive for on-the-go management

---

### 2.17 Admin Dashboard
**Priority**: P2 (Medium)
**Description**: Platform administration and oversight

#### Features:
- User management (customers, businesses)
- Business onboarding workflow
- Content moderation (reviews, images)
- Analytics and reporting
- Financial reconciliation
- Support ticket management
- System configuration
- Feature flags

#### Acceptance Criteria:
- [ ] Admin actions audited with immutable log
- [ ] Bulk operations with confirmation
- [ ] Data export for compliance requests
- [ ] Role-based access (super admin, support, finance)
- [ ] Real-time metrics dashboard (Grafana integration)

---

### 2.18 Background Jobs (BullMQ)
**Priority**: P1 (High)
**Description**: Asynchronous job processing for reliability and performance

#### Job Types:
| Queue | Jobs | Priority |
|-------|------|----------|
| `notifications` | Send email, SMS, push | High |
| `payments` | Process charges, refunds | Critical |
| `search-index` | Update Elasticsearch index | Medium |
| `analytics` | Aggregate metrics, reports | Low |
| `media` | Image resize, video transcode | Low |
| `cleanup` | Purge old data, expired holds | Low |

#### Features:
- Job retry with exponential backoff
- Dead letter queue for failed jobs
- Job progress tracking
- Scheduled/recurring jobs
- Job prioritization

#### Acceptance Criteria:
- [ ] Critical jobs (payments) processed within 5 seconds
- [ ] Failed jobs retried up to 3 times, then moved to DLQ
- [ ] Job processing monitored with alerting on queue depth
- [ ] Idempotent job handlers
- [ ] Graceful shutdown: finish in-progress jobs before stopping
- [ ] Redis-backed for persistence and clustering

---

## 3. Non-Functional Requirements

### 3.1 Performance
- API response time: P95 < 200ms
- Page load: First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Support 10,000 concurrent users

### 3.2 Security
- OWASP Top 10 compliance
- HTTPS everywhere
- API rate limiting
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection
- CSRF tokens

### 3.3 Scalability
- Horizontal scaling with containerization
- Database read replicas
- CDN for static assets
- Caching strategy (Redis)

### 3.4 Compliance
- GDPR (data portability, right to erasure)
- CCPA
- PCI DSS (via Stripe)
- Accessibility (WCAG 2.1 AA)

---

## 4. Release Phases

### Phase 1: MVP (Weeks 1-8)
- User Authentication
- Guest Browse & Explore
- Business Search & Discovery
- Map-based Search
- Business Detail View
- Service Categories
- Booking Flow
- Appointment Management (basic)
- Availability & Slot Computation
- Payment Integration (basic)
- Provider Portal (basic)

### Phase 2: Growth refinement (Weeks 9-12)
- Favorites
- User Profile
- Reviews & Ratings
- Notifications (full)
- Background Jobs
- Shared Types & Design System

### Phase 3: Scale (Weeks 13-16)
- Admin Dashboard
- Advanced analytics
- Marketing tools
- Loyalty program
- Mobile apps (React Native)

---

## 5. Appendix

### 5.1 Glossary
- **Slot**: A specific time interval available for booking
- **Hold**: Temporary reservation of a slot during checkout
- **Buffer**: Time between appointments for preparation/cleanup

### 5.2 Reference
- [Planity Official](https://www.planity.com)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [BullMQ Documentation](https://docs.bullmq.io/)

---

*This document is a living specification. All changes require product owner approval and stakeholder notification.*
