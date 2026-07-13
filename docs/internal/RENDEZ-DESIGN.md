# Rendez Design – Legal Differentiation

This document records design decisions made so the app has a **distinct identity** and does not constitute a clone of the Planity app (trademark / lookalike avoidance).

## Brand

- **App name**: **Rendez** (Expo `name` and `slug` in `app.json`: "Rendez" / "rendez").
- **Logo**: `RendezLogo` component displays "RENDEZ" with emerald typography (`#064E3B`). No Planity wordmark or logo.
- **User-facing copy**: No "Planity" in UI, README, or dev placeholder (e.g. `dev@rendez.local`).

## Visual Identity (per docs/skills/ui-ux-pro-max)

- **Primary accent**: **Emerald/wellness** `#10B981` (Beauty/Spa/Wellness palette from UI/UX Pro Max), not Planity purple `#5856D6`.
- **Success / secondary**: `#059669` (light), `#10B981` (dark) for consistency with wellness theme.
- **Design tokens**: `packages/ui` tokens use this accent so auth, bookings, and shared components share the same Rendez look.

## Implementation Summary

| Area | Change |
|------|--------|
| Logo | `PlanityLogo` → `RendezLogo`; text "RENDEZ"; color `#064E3B` |
| Accent color | All `#5856D6` → `#10B981` in search, booking, filters, cards |
| Design tokens | `colors.light.accent` / `colors.dark.accent` set to emerald/teal |
| Copy | README and search feature README say "Rendez mobile app" |
| Dev auth | Bypass user email `dev@rendez.local` |

## Terminology and Scope

- **Salon / business**: Domain terms like "salon" and "business" are kept (generic for the industry). Only Planity-specific naming was removed.
- **Monorepo packages**: Names like `@planity/ui` and `@planity/shared` are internal; they do not appear in the store listing or user-facing branding.

## References

- `docs/skills/ui-ux-pro-max` – design system and Beauty/Spa/Wellness color palette.
- `docs/skills/react-native-design` – styling and Reanimated patterns.
- `docs/ARCHITECTURE.md` – app and package structure.
