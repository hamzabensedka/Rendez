# Planity Clone — Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with local beauty & wellness businesses (salons, barbers, spas). It supports guest browsing, authenticated booking, provider management, and admin oversight. Built with React Native (client), Node/Express (API), BullMQ (jobs), and Postgres/Redis.

## 2. Personas
- Client: books appointments, browses guest mode.
- Business Owner: manages slots, services, profile.
- Admin: platform oversight.

## 3. Feature Specs

### 3.1 User Authentication
- Signup/login via email+password, Google, Apple.
- JWT refresh tokens, secure storage.
- Password reset flow.
- AC: User can register in <30s; invalid email blocked; token persists session; reset email sent.
- Priority: P0

### 3.2 Guest Browse & Explore
- No login required to view home, businesses, categories.
- Prompt login only at booking.
- AC: Guest sees curated list; deep links work; login modal appears on booking tap.
- Priority: P0

### 3.3 Business Search & Discovery
- Text search by name, service, city.
- Filters: price, rating, distance, availability.
- AC: Returns relevant results <500ms; empty state shown; filters combine.
- Priority: P0

### 3.4 Map-based Search
- Show businesses as pins on map.
- Tap pin -> preview card.
- AC: Map loads with geolocation; pins cluster; card opens detail.
- Priority: P1

### 3.5 Business Detail View
- Hero image, info, services, reviews, slots.
- AC: All sections render; CTA books; share works.
- Priority: P0

### 3.6 Service Categories
- Tree: Beauty > Hair > Cut.
- AC: Categories seed; business assigns; browse filters.
- Priority: P1

### 3.7 Booking Flow
- Select service, staff, slot, pay.
- AC: Multi-step guarded; confirmation email; calendar sync.
- Priority: P0

### 3.8 Appointment Management
- List upcoming/past; cancel/reschedule.
- AC: Client sees status; owner notified; cancel policy enforced.
- Priority: P0

### 3.9 Favorites
- Save businesses/services.
- AC: Toggle works offline; syncs; list view.
- Priority: P2

### 3.10 User Profile
- Edit name, phone, addresses, payment.
- AC: Save validates; GDPR delete.
- Priority: P1

### 3.11 Availability & Slot Computation
- Owner sets hours, breaks, overrides.
- Engine computes free slots per service duration.
- AC: No double-book; respects buffer; timezone correct.
- Priority: P0

### 3.12 Shared Types & Design System
- TS types, theme, components.
- AC: Used across apps; docs; lint passes.
- Priority: P1

### 3.13 Reviews & Ratings
- Post-visit review 1–5 + text.
- AC: Only visited; avg updates; flagging.
- Priority: P1

### 3.14 Payment Integration
- Stripe: cards, saved, partial deposits.
- AC: 3DS handled; webhooks update; refunds.
- Priority: P0

### 3.15 Notifications
- Push (Expo), email, SMS reminders.
- AC: Opt-in; sent 24h before; open deep link.
- Priority: P1

### 3.16 Provider / Business Owner Portal
- Manage profile, services, staff, slots, bookings, payouts.
- AC: CRUD works; live availability; export.
- Priority: P0

### 3.17 Admin Dashboard
- Users, businesses, disputes, metrics.
- AC: Role-based; suspend; view KPIs.
- Priority: P1

### 3.18 Background Jobs (BullMQ)
- Reminders, sync, report, cleanup.
- AC: Retry; idempotent; monitor.
- Priority: P1

## 4. Priorities Summary
P0: Auth, Guest, Search, Detail, Booking, Appt, Slots, Payment, Provider. P1: Map, Categories, Profile, Types, Reviews, Notifs, Admin, Jobs. P2: Favorites.

## 5. Success Metrics
- 30% MoM bookings; <2% cancel; 4.5★ avg; 99.9% job uptime.