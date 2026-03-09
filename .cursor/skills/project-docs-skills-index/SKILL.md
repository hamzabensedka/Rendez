---
name: project-docs-skills-index
description: Index of the project skills derived from `docs/` and the situations where each one should be used. Use when deciding which local docs-based skill applies to a task.
---

# Project Docs Skills Index

## Purpose

Use this skill to quickly choose the right project-local skill that was sourced from `docs/`.

## Available Skills

### `project-docs-router`

Use for broad documentation-driven tasks:

- a request references `@docs/`
- you need help finding the right doc source
- the task could involve product docs, architecture docs, redesign notes, or nested skills

### `front-end-redesign`

Use for redesign and originality work:

- rebuilding screens or user flows
- removing recognizable product patterns
- rewriting product-specific wording or UI structure
- preserving functionality while changing the experience

Canonical source:

- `docs/skills/front-end/skills.md`

### `react-native-architecture`

Use for mobile architecture work:

- Expo or React Native structure
- native integrations
- routing and navigation architecture
- offline-first and performance-sensitive mobile design

Canonical source:

- `docs/skills/react-native-architecture/react-native-architecture/SKILL.md`

### `react-native-design`

Use for mobile UI implementation:

- React Native styling
- navigation patterns
- Reanimated interactions
- platform-specific UI behavior

Canonical sources:

- `docs/skills/react-native-design/react-native-design/SKILL.md`
- `docs/skills/react-native-design/react-native-design/references/*.md`

### `ui-ux-pro-max`

Use for broader design-system and UI/UX work:

- accessibility reviews
- typography and color choices
- responsive layout decisions
- design system recommendations
- stack-specific UI guidance

Canonical source:

- `docs/skills/ui-ux-pro-max/ui-ux-pro-max/SKILL.md`

## Selection Rules

1. If the request starts from `@docs/` and the correct source is unclear, use `project-docs-router` first.
2. If the task is explicitly about frontend originality or legal-safe redesign, use `front-end-redesign`.
3. If the task is about React Native structure or architecture, use `react-native-architecture`.
4. If the task is about React Native visuals, styling, navigation details, or motion, use `react-native-design`.
5. If the task is mostly design-system, accessibility, or UI quality guidance, use `ui-ux-pro-max`.

## Guardrails

- Prefer the most specific skill available.
- If multiple skills apply, start with the narrowest one and pull in the broader one only if needed.
- Treat the files under `docs/` as canonical when a wrapper skill and source doc differ.
