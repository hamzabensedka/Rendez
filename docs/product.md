# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first marketplace connecting customers with beauty/wellness businesses for appointment booking. The platform serves three user segments: customers seeking services, business owners managing their operations, and administrators overseeing the marketplace.

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 | **Owner:** Customer, Business Owner, Admin

| Aspect | Specification |
|--------|---------------|
| Registration | Email/password, Google OAuth, Apple Sign-In |
| Login | JWT-based session with refresh token rotation |
| Password Recovery | Secure token via email, 1-hour expiry |
| Account Linking | Merge social and email accounts |
| Onboarding | Role selection (customer/business owner) post-auth |

**Acceptance Criteria:**
- [ ] New user completes registration in < 30 seconds
- [ ] Social auth redirects preserve intended destination
- [ ] Refresh token silently re-authenticates without user action
- [ ] Password reset link invalidates after use or expiry
- [ ] Business owner accounts require additional verification step

---

### 2.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Unauthenticated Visitor

| Aspect | Specification |
|--------|---------------|
| Access | Full search and browse without account |
| Limitations | Booking requires authentication; favorites hidden |
| Prompt Strategy | Smart prompts at conversion points (book, save) |
| Data Retention | Guest session data persists 30 days, merges on signup |

**Acceptanceenson Criteria:**
- [ ] Guest sees identical search results to authenticated users
- [ ] "Book" CTA triggers auth modal with preserved context
- [ ] Post-authentication, guest actions resume seamlessly
- [ ] Location permission requested only on map view

---

### 2.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Customer

| Aspect | Specification |
|--------|---------------|
| Search Inputs | Text query, current location, selected area, filters |
| Filters | Category, price range, rating, availability today, distance, amenities |
| Sorting | Relevance, distance, rating, price ascending/descending |
| Results | Card list with thumbnail, name, rating, distance, starting price, next available slot |
| Pagination | Cursor-based, 20 results per load |

**Acceptance Criteria:**
- [ ] Search returns results in < 500ms for text, < 2s with location
- [ ] Active filters display as removable chips
- [ ] Empty states suggest alternative searches
- [ ] Recent searches persist across sessions (authenticated)

---

### 2.4 Map-based Search
**Priority:** P0 | **Owner:** Customer

| Aspect | Specification |
|--------|---------------|
| Map Provider | Mapbox or Google Maps |
| Markers | Clustered at zoom levels; tap reveals business preview |
| Integration | Toggle between list and map views; synchronized filters |
| Bounds Search | Auto-query when map region changes; debounced 300ms |
| User Location | Blue dot with accuracy ring; recenter button |

**Acceptance Criteria:**
- [ ] Map loads with businesses in visible region within 2s
- [ ] Marker tap opens bottom sheet with key business info
- [ ] Pan/zoom triggers new search without full reload
- [ ] List and map views maintain filter state on switch

---

### 2.5 Business Detail View
**Priority:** P0 | **Owner:** Customer

| Section | Content |
|---------|---------|
| Header | Gallery (swipeable), business name, verified badge, favorite toggle |
| Info | Address, hours, phone, website, social links |
| Services | Categorized list with duration, price, description; expandable |
| Team | Staff profiles with specialties and photos |
| Reviews | Aggregate rating, distribution histogram, recent reviews |
| Availability | Mini calendar showing next 7 days with slot availability |

**Acceptance Criteria:**
- [ ] Gallery supports pinch-zoom and full-screen swipe
- [ ] "Call" and "Get Directions" are one-tap actions
- [ ] Service selection initiates booking flow
- [ ] Deep links open directly to business detail

---

### 2.6 Service Categories
**Priority:** P0 | **Owner:** Customer, Business Owner, Admin

| Aspect | Specification |
|--------|---------------|
| Hierarchy | Category → Subcategory → Service |
| Examples | Hair > Color > Balayage; Wellness > Massage > Deep Tissue |
| Discovery | Trending, seasonal, and personalized category carousels |
| Business Assignment | Owners assign services from catalog or create custom |
| Admin Control | Full CRUD on category taxonomy |

**Acceptance Criteria:**
- [ ] Category tree loads in < 200ms (cached)
- [ ] Business services display under correct categories
- [ ] Search matches across category names and service names
- [ ] Category icons are consistent and accessible

---

### 2.7 Booking Flow
**Priority:** P0 | **Owner:** Customer

| Step | Action |
|------|--------|
| 1. Service Selection | Choose service(s), see combined duration and price |
| 2. Staff Preference | Select specific staff OR "no preference" |
| 3. Date/Time | Calendar view with available slots; slots computed in real-time |
| 4. Details | Customer notes, coupon code, gift card |
| 5. Review | Order summary with cancellation policy |
| 6. Payment | Secure tokenized payment (if required) or confirm (pay at venue) |
| 7. Confirmation | Booking reference, add to calendar, share |

**Acceptance Criteria:**
- [ ] Flow completes in < 60 seconds for returning customers
- [ ] Slot availability reflects real-time bookings and business rules
- [ ] Double-booking prevented via optimistic locking
- [ ] Payment failure preserves slot reservation for 5 minutes
- [ ] Confirmation includes ICS file and deep link to appointment

---

### 2.8 Appointment Management
**Priority:** P0 | **Owner:** Customer, Business Owner

**Customer Actions:**
- View upcoming/past appointments with status
- Reschedule (same business, subject to policy)
- Cancel with reason selection; automated refund if applicable
- Rebook past service with one tap

**Business Owner Actions:**
- Daily/weekly calendar view
- Accept, decline, or propose alternative times
- Mark no-show, check-in, complete
- Block time manually

**Acceptance Criteria:**
- [ ] Status transitions trigger appropriate notifications
- [ ] Calendar sync (Google/Apple) optional in settings
- [ ] Cancellation policy enforced automatically
- [ ] Business owner sees real-time updates without refresh

---

### 2.9 Favorites
**Priority:** P1 | **Owner:** Customer

| Aspect | Specification |
|--------|---------------|
| Save | Heart toggle on business cards and detail |
| List | Grid/sortable view of saved businesses |
| Quick Actions | Book, call, get directions from favorites list |
| Sync | Cross-device with server source of truth |

**Acceptance Criteria:**
- [ ] Toggle updates without full page reload
- [ ] Favorites list loads in < 300ms
- [ ] Push notification option for new availability at favorites

---

### 2.10 User Profile
**Priority:** P1 | **Owner:** Customer, Business Owner

| Section | Content |
|---------|---------|
| Personal Info | Name,avatar, phone, email, birthday (for offers) |
| Preferences | Notification settings, default booking reminders |
| Payment Methods | Saved cards via PCI-compliant tokenization |
| History | All appointments with filter and search |
| Settings | Language, accessibility, delete account |

**Acceptance Criteria:**
- [ ] Profile completion percentage incentivizes full setup
- [ ] GDPR-compliant data export and deletion
- [ ] Avatar upload with automatic compression

---

### 2.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** System

| Aspect | Specification |
|--------|---------------|
| Rules Engine | Business hours, staff schedules, service duration, buffer time |
| Constraints | Concurrent booking limits, staff-specific services, breaks |
| Computation | Server-side with caching; invalidate on booking changes |
| Performance | Slot generation for 30 days in < 100ms |
| Edge Cases | Multi-service chains, staff substitution, overtime handling |

**Acceptance Criteria:**
- [ ] Slots never double-book across concurrent requests
- [ ] Timezone handled correctly for business and customer
- [ ] DST transitions computed without error
- [ ] Cache warms on business hours change

---

### 2.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Design/Engineering

| Element | Specification |
|---------|---------------|
| Tokens | Colors, typography, spacing, shadows in platform-agnostic format |
| Components | Buttons, inputs, cards, modals, toasts, skeletons |
| Accessibility | WCAG 2.1 AA minimum; screen reader support |
| Theming | Light/dark mode; brand color injection for business portal |
| Documentation | Storybook with usage examples |

**Acceptance Criteria:**
- [ ] All UI components responsive across breakpoints
- [ ] Color contrast ratios pass automated audit
- [ ] Touch targets minimum 44x44dp
- [ ] Consistent loading and error states throughout

---

### 2.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Customer, Business Owner

| Aspect | Specification |
|--------|---------------|
| Eligibility | Verified customers only; post-appointment prompt |
| Content | Star rating, text, photo upload (optional) |
| Moderation | Auto-flag profanity; business owner can respond |
| Display | Chronological with helpfulness voting; owner responses marked |
| Impact | Weighted recency; response rate affects business ranking |

**Acceptance Criteria:**
- [ ] Review prompt sent 24 hours post-appointment
- [ ] One review per appointment; editable for 14 days
- [ ] Business owner response notifies reviewer
- [ ] Fake review detection via pattern analysis

---

### 2.14 Payment Integration
**Priority:** P0 | **Owner:** Customer, Business Owner, Admin

| Aspect | Specification |
|--------|---------------|
| Processor | Stripe Connect for marketplace split payments |
| Methods | Cards, Apple Pay, Google Pay, Buy Now Pay Later (optional) |
| Flows | Full prepay, deposit, or pay at venue |
| Payouts | Automated to business owner accounts; hold period configurable |
| Refunds | Full or partial; automated per cancellation policy |

**Acceptance Criteria:**
- [ ] PCI compliance via tokenization; no raw card data stored
- [ ] 3D Secure for applicable transactions
- [ ] Webhook handling for async payment events
- [ ] Invoice and receipt generation

---

### 2.15 Notifications
**Priority:** P1 | **Owner:** Customer, Business Owner

| Channel | Use Cases |
|---------|-----------|
| Push | Booking confirmation, reminders (24h, 2h), promotions |
| SMS | Backup for critical alerts; opt-in marketing |
| Email | Detailed confirmations, receipts, monthly summaries |
| In-App | Badge counts, activity feed |

**Acceptance Criteria:**
- [ ] Preference center controls channel and frequency per type
- [ ] Notification history viewable in-app
- [ ] Deep links navigate to relevant content
- [ ] Rate limiting prevents notification fatigue

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Business Owner

| Module | Features |
|--------|----------|
| Dashboard | Today's bookings, revenue snapshot, upcoming week |
| Calendar | Day/week/month views; drag-to-reschedule |
| Services | CRUD services, pricing, duration, online booking toggle |
| Staff | Manage team, permissions, schedules |
| Clients | CRM with notes, visit history, marketing consent |
| Settings | Business info, hours, policies, integrations |
| Analytics | Booking volume, revenue, cancellation rate, peak times |

**Acceptance Criteria:**
- [ ] Portal responsive for tablet use at reception
- [ ] Multiple staff accounts with role-based access
- [ ] Data export to CSV/Excel
- [ ] Integration with Google Business Profile for hours sync

---

### 2.17 Admin Dashboard
**Priority:** P1 | **Owner:** Platform Administrator

| Module | Features |
|--------|----------|
| User Management | Search, suspend, impersonate customer/business accounts |
| Business Verification | KYC document review, approval workflow |
| Content Moderation | Review flagged content, business claims |
| Financials | Platform fee configuration, payout monitoring, dispute handling |
| Analytics | MAU, booking GMV, churn, top categories, geographic distribution |
| System Health | Queue monitoring, error rates, third-party service status |

**Acceptance Criteria:**
- [ ] Role-based access with audit logging
- [ ] Bulk actions for efficient moderation
- [ ] Real-time metrics refresh configurable
- [ ] Alert thresholds for anomaly detection

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P0 | **Owner:** System

| Queue | Jobs | Priority |
|-------|------|----------|
| notifications | Send push/email/SMS; retry with backoff | High |
| payments | Process charges, handle webhooks, payouts | Critical |
| search-index | Update Elasticsearch/Algolia on data changes | Medium |
| reports | Generate daily/weekly analytics summaries | Low |
| cleanup | Archive old data, expire sessions, log rotation | Low |
| reminders | Appointment reminder scheduling | High |

**Acceptance Criteria:**
- [ ] Job failure triggers alert after 3 retries
- [ ] Dead letter queue for manual inspection
- [ ] Job progress trackable for long-running tasks
- [ ] Horizontal scaling supported via worker processes
- [ ] Scheduled jobs resilient to single worker failure

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| Performance | P90 API response < 200ms; page load < 2s |
| Availability | 99.9% uptime跑道; planned maintenance communicated |
| Security | OWASP Top 10 mitigated; annual penetration test |
| Scalability | Auto-scaling to 10x baseline traffic |
| Compliance | GDPR, CCPA, PCI-DSS Level 1 |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Booking Conversion Rate | > 15% search-to-book |
| NPS | > 50 for customers, > 40 for business owners |
| Monthly Active Bookers | 20% MoM growth (launch phase) |
| Cancellation Rate | < 10% |
| Support Ticket Rate | < 2% of transactions |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | 2.1-2.8, 2.11, 2.14, 2.16 | Q1 |
| V1.1 | 2.9, 2.10, 2.13, 2.15 | Q2 |
| V1.2 | 2.12 polish, 2.17, advanced analytics | Q3 |
| Scale | Internationalization, marketplace expansion | Q4 |
