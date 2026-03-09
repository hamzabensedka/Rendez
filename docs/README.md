# Docs Index

This folder mixes product notes, redesign references, user-roadmap content, reusable skills, and generated audit output. This index is the lightweight organization layer for the current docs set.

## Primary Sections

- `audit/`
  Deep engineering audit documents generated from the current codebase.

- `ARCHITECTURE.md`
  Original architecture overview for the monorepo, mobile app, backend, booking engine, and future platform direction.

- `REDESIGN_FRONTEND_SKILLS.md`
- `REDESIGN_SUMMARY.md`
- `RENDEZ-DESIGN.md`
  Product and redesign context for the app's current direction.

- `user-roadmap/`
  Step-by-step product walkthroughs for the customer journey. Useful for comparing intended behavior versus implemented behavior.

- `stitch_onboarding_welcome_to_bookly/`
  Reference HTML and screenshot assets for onboarding, search, booking, settings, analytics, and other proposed flows.

- `skills/`
  Project-local reusable skills and references for frontend redesign, React Native architecture/design, and UI/UX guidance.

## Conventions

- Put new repo-wide engineering reviews, audits, ADRs, and architecture notes under `docs/`.
- Keep app-specific implementation notes close to the codebase when they only apply to one app, such as `apps/api/README.md` or `apps/mobile/README.md`.
- Treat `user-roadmap/` as product-behavior intent, not guaranteed truth. Validate against code before relying on it.
- Treat `stitch_onboarding_welcome_to_bookly/` as visual/design reference material, not implementation source of truth.
- Keep `audit/` concise and evidence-based, with file-path references into the codebase.

## Current Recommended Reading Order

1. `audit/01-repository-exploration.md`
2. `audit/02-architecture-analysis.md`
3. `audit/03-feature-discovery.md`
4. `audit/04-engineering-review.md`
5. `ARCHITECTURE.md`
6. `user-roadmap/`

## Follow-Up Cleanup

If you want a second docs pass later, the next safe improvements would be:

- move top-level reference docs into `docs/reference/`
- rename `stitch_onboarding_welcome_to_bookly/` to a shorter design-reference name
- add a dedicated `docs/product/` and `docs/design/` split
- track only curated markdown under Git and keep bulky visual assets ignored
