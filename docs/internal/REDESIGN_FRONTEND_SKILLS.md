# Redesign Based on Front-End Skills

This document summarizes the UX/UI and copy changes applied across the mobile app to align with **docs/skills/front-end/skills.md**: originality, legal safety, clarity, and generic industry patterns.

---

## Visual System (Already in Place)

- **Tokens** (`packages/ui`): Neutral palette (slate/blue-gray), typography scale, spacing, radius, shadows. No product-specific accent.
- **Components**: Button, Input, Card, Text, Badge use tokens consistently. Primary actions are clear; secondary actions use outline/ghost variants.

---

## Copy & Microcopy — Neutral English

### Constants & Mock Data

- **SERVICE_CATEGORIES**: Replaced French labels (Coiffure homme, Coiffure femme, etc.) with generic English (Men's hair, Women's hair, Color, Barber, Manicure, etc.).
- **MOCK_ADDRESSES**: Replaced French cities with generic place names (Downtown, City Center, North District, etc.).
- **MOCK_SALONS**: Provider names and service titles translated to neutral English (Studio One, The Atelier, Barber & Co; Men's cut, Beard trim, Wash & blow-dry, etc.). Availability labels use English (Wed 7th, Today, Tomorrow).
- **SEARCH_FILTERS**: IDs changed from French (`filtres`, `carte`, `prestations`) to English (`filters`, `map`, `services`). Labels were already English.

### Screens & Components

- **SearchResultsScreen**: Filter handling updated to use `filters` and `services` IDs.
- **SearchModeScreen**: "Carte" → "Map", "Filtres" → "Filters".
- **SearchSummaryCard**: Removed Toulouse-specific address display; address is shown as passed.
- **AddressScreen**: Pre-fill logic simplified; no product-specific city checks.
- **BookingScreen**: MOCK_DATES and expanded date default use English (Thursday 8 Jan, Friday 9 Jan, etc.). Wrapped in SafeAreaView.
- **BookingValidationScreen**: Mock user name "Utilisateur Test" → "Guest". Wrapped in SafeAreaView. Auth submit typed properly.
- **SearchFilters**: All labels in English — "Filters", "Gift card", "Gift card available", "Availability", "Any time", "Today", "Tomorrow", "Choose a date", "Sort by", "No preference", "Top rated", "Price: high/low", "Reset", "Save".
- **TimeFilter**: "Quand" → "When", gift card and time options in English, "Save".
- **StaffSelection**: "Avec qui ?" → "Who with?", "Sans préférence" → "No preference".
- **SalonAbout**: Section titles and content in English — Location, Opening hours, Team, About, Services at this location; generic address and description; OPENING_HOURS days (Monday–Sunday), "Closed"; TAGS and STAFF names neutral.

---

## Layout & Hierarchy

- **ExploreScreen**: Unused `Dimensions.get('window')` removed.
- **BookingScreen / BookingValidationScreen**: SafeAreaView added for consistent chrome; section titles and steps (1. Selected services, 2. Date and time, 3. Sign in) kept clear.
- **SalonDetailsScreen**: Proper error state when provider not found — ScreenHeader + "Provider not found" instead of returning null.

---

## Originality & Compliance

- No real-world product or brand references in copy or layout.
- Wording and flows use generic appointment-booking language (search, location, filters, book, confirm, sign in).
- Design system and components are product-agnostic and applied consistently across Explore, Search, Address, SearchResults, SearchMode, SalonDetails, Booking, BookingValidation, Auth, Profile, Bookings, and BusinessDetail.

---

## Accessibility

- Existing patterns kept: `accessibilityLabel`, `accessibilityRole`, and `accessibilityHint` on buttons and key controls (ScreenHeader, FilterBar, SalonCard, BusinessDetailScreen favorite/service rows, etc.).
- Touch targets and focus states remain as in the current design system.
