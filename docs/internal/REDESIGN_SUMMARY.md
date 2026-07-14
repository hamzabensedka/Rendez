# Mobile App Redesign Summary

## How the Redesign Avoids Product Resemblance

This document summarizes the changes made to ensure the application is clearly distinct and original while preserving core functionality.

### 1. Visual Identity

- **Color palette**: Replaced the previous emerald/teal accent (#10B981) with a neutral slate/blue-gray palette. Primary surfaces use `#F8FAFC` (background), `#FFFFFF` (surface), and `#475569` (accent). No product-specific or wellness-brand green.
- **Typography**: Updated type scale (caption through largeTitle) with neutral weights and line heights. Removed any hardcoded font or color tied to a specific product.
- **Spacing, radii, shadows**: New tokens in `packages/ui/src/tokens/index.ts` use a 4px spacing base, subtle radii (xs–xl, full), and soft shadows keyed to `#0F172A` for a product-agnostic look.

### 2. Layout and Navigation

- **Explore (home)**: Replaced the single hero + tagline layout with a modular layout: compact header (location + logo + profile), primary “Find and book” search CTA, “Quick access” (Search, Bookings), and a separate “Service providers” card. No full-bleed hero or product-specific taglines.
- **Search results**: Section title and subtitle use generic copy (“Results”, “Providers near you — book online”). Filter bar and cards use the new design system only.
- **Headers**: Shared header pattern (back + AppLogo + profile) uses neutral labels (“Back”, “Profile”) and tokens only.

### 3. UX Flows and Microcopy

- **Generic industry language**: All user-facing copy was moved to neutral, English-first wording:
  - Booking: “Selected services”, “Date and time”, “Sign in”, “Confirm booking”, “Add a service”, “Remove”, “Change”, “Select staff”.
  - Search: “Results”, “Any time”, “Near me”, “Services”, “Filters”, “Map”.
  - Auth: “Sign in”, “Create account”, “Forgot password?”, “Cookie settings”, “Already have an account?”, “New to [App]?” (brand name from constant).
  - Profile / list: “Profile”, “Sign Out”, “My Bookings”, “No upcoming bookings”.
- **Constants**: `FREQUENT_SEARCHES`, `SEARCH_FILTERS`, `SEARCH_PLACEHOLDERS`, and mock content use generic categories and placeholders (e.g. “Services”, “Service or provider name”) instead of product-specific terms.

### 4. Component Architecture

- **Neutral naming**: `RendezLogo` was replaced by `AppLogo`; the displayed brand name comes from `APP_DISPLAY_NAME` in `AppLogo.tsx` so the component is product-agnostic.
- **Shared design system**: All screens use components and tokens from `@planity/ui` (Text, Button, Card, Badge, Input) and the new tokens (colors, spacing, radius, shadows, typography). No hardcoded hex or product-specific styles in feature code.
- **Routes and APIs**: No routes or API contracts were changed; only UI, copy, and layout were updated.

### 5. Accessibility and States

- **Accessibility**: Buttons and key controls have `accessibilityLabel` and `accessibilityRole`; primary button has `accessibilityHint`. Profile and back buttons use at least 44pt touch targets where applicable.
- **Empty and loading**: Search results list has an empty state (“No results. Try adjusting your search or filters.”). Bookings list already had an empty state; loading uses the design system accent for spinners.

### 6. Compliance Note

The app no longer relies on:

- A recognizable product color (e.g. emerald green) or visual identity.
- Product-specific taglines, hero copy, or French-only microcopy that could be associated with a single brand.
- Component or constant names that refer to a specific product (“Rendez” only appears as the configurable display name in `AppLogo`).

Layouts, hierarchy, and flows were reworked (modular home, generic section titles, neutral filters and cards) so that the experience is clearly a generic appointment/service booking product rather than a clone of any one commercial product.
