# Planity Clone — Task Plan

Generated: 2026-05-24T18:31:21.641322+00:00

## Execution Order

- product_owner

- architect

- tester

- code_reviewer

- progress_tracker

- product_owner


## Parallel Groups

- backend_developer + frontend_developer + devops_engineer + data_engineer + ai_engineer


## Tasks

### Write Product Specification (`po_product_spec`)
- **Agent:** product_owner
- **Depends on:** none
- **Output:** docs/product.md
- **Expected:** Complete product.md with features, acceptance criteria, and priorities

Create a complete product specification for Planity Clone. Cover all features: ['User Authentication', 'Guest Browse & Explore', 'Business Search & Discovery', 'Map-based Search', 'Business Detail View', 'Service Categories', 'Booking Flow', 'Appointment Management', 'Favorites', 'User Profile', 'Availability & Slot Computation', 'Shared Types & Design System', 'Reviews & Ratings', 'Payment Integration', 'Notifications', 'Provider / Business Owner Portal', 'Admin Dashboard', 'Background Jobs (BullMQ)']


### Design Architecture (`arch_design`)
- **Agent:** architect
- **Depends on:** po_product_spec
- **Output:** docs/architecture.md
- **Expected:** Complete architecture.md with folder structure and service boundaries

Design system architecture for Planity Clone using ['Expo', 'React Native', 'TypeScript', 'Expo Router', 'TanStack React Query', 'React Native Reanimated', 'NestJS', 'Prisma', 'PostgreSQL', 'PostGIS', 'Redis']. Create folder scaffold.


### Create Product Requirements Document (`po_create_product_doc`)
- **Agent:** product_owner
- **Depends on:** none
- **Output:** docs/product.md
- **Expected:** A markdown file with full product requirements, user stories, and acceptance criteria for all features.

Write a comprehensive product requirements document (docs/product.md) covering all features, user stories, acceptance criteria, and prioritization for the Planity Clone MVP. Include feature descriptions, user flows for guest browsing, booking, and authentication, and note planned but not implemented items.


### Create Architecture Document and Folder Scaffold (`arch_create_architecture_doc`)
- **Agent:** architect
- **Depends on:** po_create_product_doc
- **Output:** docs/architecture.md
- **Expected:** Architecture document and initial folder scaffold committed to the repository.

Design the system architecture for the Planity Clone MVP. Create docs/architecture.md covering: Nx monorepo structure, Expo React Native frontend, NestJS + Prisma + PostgreSQL backend, PostGIS for geo queries, Redis for caching, JWT auth flow, API design patterns, and data models. Also scaffold the folder structure: apps/mobile, apps/api, packages/shared, packages/ui, libs/*. Include decision records for tech choices.


### Initialize Nx Monorepo with Dependencies (`arch_setup_nx_monorepo`)
- **Agent:** architect
- **Depends on:** arch_create_architecture_doc
- **Output:** code
- **Expected:** Fully initialized Nx monorepo with all dependencies installed and basic project scaffolding.

Set up the Nx monorepo using pnpm. Initialize workspace with apps/mobile (Expo), apps/api (NestJS), packages/shared, packages/ui. Install core dependencies: Expo, React Native, NestJS, Prisma, PostgreSQL client, Redis client, TanStack React Query, React Native Reanimated, Expo Router. Configure TypeScript paths and Nx project.json files for each app/lib.


### Setup NestJS Backend with Prisma and PostgreSQL (`backend_setup_nestjs_prisma`)
- **Agent:** backend_developer
- **Depends on:** arch_setup_nx_monorepo, arch_design
- **Output:** code
- **Expected:** NestJS app with Prisma schema, auth endpoints, and Redis cache module working.

Initialize NestJS app in apps/api. Configure Prisma with PostgreSQL and PostGIS extension. Create initial schema: User (with roles client, provider, admin), Business (with location point), Service, ServiceCategory, Appointment, Availability, Review, Favorite. Implement JWT auth module with register, login, logout, refresh token endpoints. Add role-based guards. Set up Redis caching module.


### Build Business Search and Discovery API (`backend_business_search_api`)
- **Agent:** backend_developer
- **Depends on:** backend_setup_nestjs_prisma, arch_design
- **Output:** code
- **Expected:** Working business search, detail, and map API endpoints with PostGIS support.

Implement API endpoints for business search and discovery: GET /businesses with text search, location-based filtering (PostGIS ST_DWithin), filter pills (distance, rating, price, availability), pagination. GET /businesses/:id with full details including services, staff, reviews. GET /businesses/map for viewport-based geo queries. Add address autocomplete endpoint.


### Create Shared Types and UI Design System (`shared_create_types_design_system`)
- **Agent:** frontend_developer
- **Depends on:** arch_setup_nx_monorepo, arch_design
- **Output:** code
- **Expected:** Shared types package and UI component library with design tokens.

In packages/shared, define TypeScript types/enums for: User, Business, Service, Appointment, Review, Favorite, PaymentProvider, PaymentStatus, NotificationChannel, pagination, booking utils. In packages/ui, create design tokens (colors, typography, spacing) and base components (Button, Card, Input, Modal, BottomSheet) with Apple-style theme. Export for mobile use.


### Build Explore, Search, and Map Screens (`frontend_explore_search_map`)
- **Agent:** frontend_developer
- **Depends on:** backend_business_search_api, shared_create_types_design_system, arch_design
- **Output:** code
- **Expected:** Working Explore, Search, and Map screens with guest access.

Create Explore tab (default route) showing salon cards without auth. Implement search screen with text input, address suggestions, filter pills (distance, rating, price, availability). Build map search screen with React Native Maps, viewport-based queries, and bottom card UI. Use TanStack Query for API data fetching.


### Build Booking and Availability API (`backend_booking_availability_api`)
- **Agent:** backend_developer
- **Depends on:** backend_setup_nestjs_prisma, arch_design
- **Output:** code
- **Expected:** Complete booking flow API with availability computation and appointment management.

Implement appointment and availability APIs: GET /businesses/:id/availability with date range, configurable slot steps, Redis caching, overlap exclusion. POST /appointments for booking with service, staff, time slot. GET /appointments for user's bookings. DELETE /appointments/:id for cancellation. Add validation for business hours and existing appointments.


### Build Business Detail and Booking Flow (`frontend_business_detail_booking`)
- **Agent:** frontend_developer
- **Depends on:** frontend_explore_search_map, backend_booking_availability_api, arch_design
- **Output:** code
- **Expected:** Working business detail view and complete booking flow.

Create Business Detail screen with image carousel, tabs (services, staff, reviews, about), and staff selection. Implement multi-step booking flow: service selection, date picker, time slots grid, identification/registration, success confirmation. Use React Native Reanimated for animations. Integrate with booking API.


### Build Favorites and User Profile API (`backend_favorites_profile_api`)
- **Agent:** backend_developer
- **Depends on:** backend_setup_nestjs_prisma, arch_design
- **Output:** code
- **Expected:** Working favorites, profile, and service categories API endpoints.

Implement favorites endpoints: POST /favorites, DELETE /favorites/:businessId, GET /favorites. Implement user profile endpoint: GET /profile, PATCH /profile. Add service categories endpoint: GET /service-categories.


### Setup Docker Compose and CI Pipeline (`devops_setup_docker_ci`)
- **Agent:** devops_engineer
- **Depends on:** arch_setup_nx_monorepo, arch_design
- **Output:** code
- **Expected:** Working docker-compose.yml, GitHub Actions workflow, and EAS Build config.

Create Docker Compose configuration for local development: PostgreSQL with PostGIS, Redis, and the NestJS API. Setup GitHub Actions CI workflow for linting, type checking, and running tests on PRs. Configure EAS Build for mobile app. Add Supabase configuration for auth if needed.


### Build Mobile Auth Screens (`frontend_auth_screens`)
- **Agent:** frontend_developer
- **Depends on:** backend_setup_nestjs_prisma, shared_create_types_design_system, arch_design
- **Output:** code
- **Expected:** Working auth screens with login, register, and token management.

Create Expo Router screens for authentication: Login, Register, Email Verification. Implement JWT token storage (SecureStore), auth context, and protected route logic. Use TanStack React Query for API calls. Style with Apple-style UI from design system.


### Build Appointments, Favorites, and Profile Screens (`frontend_appointments_favorites_profile`)
- **Agent:** frontend_developer
- **Depends on:** frontend_business_detail_booking, backend_favorites_profile_api, arch_design
- **Output:** code
- **Expected:** Working appointments, favorites, and profile screens.

Create Appointments screen listing upcoming bookings with detail view and cancel action. Implement Favorites screen with saved businesses list using FavoritesContext. Build Profile screen with account info and bottom navigation entry. Integrate with respective APIs.


### Code Review (`review_code`)
- **Agent:** code_reviewer
- **Depends on:** frontend_business_detail_booking, backend_business_search_api, backend_favorites_profile_api, backend_setup_nestjs_prisma, devops_setup_docker_ci, frontend_auth_screens, backend_booking_availability_api, frontend_explore_search_map, frontend_appointments_favorites_profile, shared_create_types_design_system
- **Output:** output/reports/code_review.md
- **Expected:** Detailed code review report with findings and recommendations

Review all code produced for bugs, security issues, and maintainability.


### Progress Report (`track_progress`)
- **Agent:** progress_tracker
- **Depends on:** review_code
- **Output:** output/reports/progress_report.md
- **Expected:** Progress report with completion percentage and next priorities

Compare codebase against product spec and report completion status.


### Write Integration Tests for Backend APIs (`tester_write_integration_tests`)
- **Agent:** tester
- **Depends on:** backend_business_search_api, backend_booking_availability_api, backend_favorites_profile_api
- **Output:** code
- **Expected:** Suite of passing integration tests for all backend APIs.

Write Jest integration tests for all backend API endpoints: auth (register, login, refresh, logout), business search, business detail, map search, availability, appointments CRUD, favorites, profile. Test error cases, auth guards, and pagination. Use test database with seed data.


### Write Mobile Component and E2E Tests (`tester_write_mobile_tests`)
- **Agent:** tester
- **Depends on:** frontend_auth_screens, frontend_explore_search_map, frontend_business_detail_booking, frontend_appointments_favorites_profile
- **Output:** code
- **Expected:** Passing unit, component, and E2E tests for mobile app.

Write Jest unit tests for shared types and UI components. Set up React Native Testing Library for component tests (auth screens, booking flow, business card). Write basic E2E tests using Detox or Maestro for critical flows: guest browse, search, book appointment, manage favorites.


### Review All Code for Quality and Consistency (`code_reviewer_review_all_code`)
- **Agent:** code_reviewer
- **Depends on:** tester_write_integration_tests, tester_write_mobile_tests
- **Output:** report
- **Expected:** All PRs reviewed with actionable feedback; code quality standards met.

Perform comprehensive code review across all apps and packages. Check for: adherence to architecture, TypeScript strictness, error handling, security (JWT, input validation), performance (Redis caching, query optimization), code style consistency, and test coverage. Provide feedback as PR reviews.


### Generate Final Progress Report (`progress_tracker_final_report`)
- **Agent:** progress_tracker
- **Depends on:** code_reviewer_review_all_code
- **Output:** docs/progress_report.md
- **Expected:** Final progress report with completion status and recommendations.

Review all completed tasks against product requirements. Generate a progress report (docs/progress_report.md) listing: completed features, pending items (payments, notifications, provider portal, admin dashboard, background jobs), known issues, and recommendations for next sprint.

