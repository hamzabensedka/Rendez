# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with local beauty & wellness businesses (salons, barbers, spas). It supports customer booking, provider management, and admin oversight.

## Roles
- **Customer**: browses, books, manages appointments.
- **Provider**: manages business profile, services, availability, appointments.
- **Admin**: platform oversight, user/business moderation.

## Shared Types & Design System
Feature: Shared Types & Design System
- Define TS types for User, Business, Service, Appointment, etc.
- UI components: buttons, cards, nav, colors, typography.
- Acceptance: All screens use shared components; types imported from @planity/types.
- Priority: P0

## Feature Specifications

### 1. User Authentication
- Customers and providers register/login via email, phone OTP, Google/Apple.
- JWT stored securely.
- AC: Given valid credentials, user is logged in. Invalid shows error. Password reset works.
- Priority: P0

### 2. Guest Browse & Explore
- Guests can view home, featured businesses, categories without login.
- AC: Guest can scroll businesses; tapping a business prompts login if booking.
- Priority: P1

### 3. Business Search & Discovery
- Search by name, category, filters (price, rating, distance).
- AC: Search returns relevant results; filters apply correctly.
- Priority: P0

### 4. Map-based Search
- Show businesses on map with pins; tap pin shows preview.
- AC: Map loads with geolocation; pins reflect search results.
- Priority: P1

### 5. Business Detail View
- Shows info: photos, services, staff, reviews, address, hours.
- AC: All data displayed; 'Book' button initiates flow.
- Priority: P0

### 6. Service Categories
- Hierarchical categories (e.g., Hair > Cut).
- AC: Categories list renders; selecting filters businesses/services.
- Priority: P1

### 7. Booking Flow
- Select service, staff (optional), date, available slot, confirm.
- AC: Only available slots shown; confirmation screen with summary; booking saved.
- Priority: P0

### 8. Appointment Management
- User sees upcoming/past appointments; can cancel/reschedule.
- AC: Cancel updates status; reschedule uses same flow.
- Priority: P1

### 9. Favorites
- User can favorite businesses; list in profile.
- AC: Favorite toggles; persists across sessions.
- Priority: P2

### 10. User Profile
- Edit name, phone, payment methods, notifications pref.
- AC: Changes persist; avatar upload works.
- Priority: P1

### 11. Availability & Slot Computation
- Providers set working hours, breaks, service duration; system computes free slots.
- AC: No double-booking; slots respect buffer; timezone correct.
- Priority: P0

### 12. Reviews & Ratings
- After appointment, user can rate (1-5) and comment.
- AC: Review appears on business; average updates; one review per appointment.
- Priority: P1

### 13. Payment Integration
- Stripe/PayPal for card, maybe wallet; hold or capture.
- AC: Payment succeeds; failure rolls back booking; receipt emailed.
- Priority: P0

### 14. Notifications
- Push (Firebase) + email for booking confirm, reminder, cancel.
- AC: User receives timely notification; preferences respected.
- Priority: P0

### 15. Provider / Business Owner Portal
- Web dashboard: manage profile, services, staff, availability, view appointments, respond to reviews.
- AC: Provider can create service; set hours; see bookings; export.
- Priority: P0 (basic), P1 (advanced)

### 16. Admin Dashboard
- Manage users, businesses, categories, flag content, view metrics.
- AC: Admin can suspend business; approve new registrations; see KPIs.
- Priority: P1

### 17. Background Jobs (BullMQ)
- Queue for sending notifications, syncing availability, payment reconciliation.
- AC: Job processed with retry; failed jobs logged; dashboard monitors.
- Priority: P0

## Prioritization Summary
- P0: Core booking path, auth, payment, provider basics, jobs.
- P1: Discovery enhancements, profiles, reviews, admin.
- P2: Favorites, advanced customizations.

## Success Metrics
- Booking conversion > 30%, crash-free sessions > 99%, NPS > 40.