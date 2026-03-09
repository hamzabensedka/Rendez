---
name: react-native-architecture
description: Build production React Native apps with Expo, navigation, native modules, offline sync, and cross-platform patterns. Use when developing mobile apps, implementing native integrations, or architecting React Native projects.
---

# React Native Architecture

## Canonical Source

Read `docs/skills/react-native-architecture/react-native-architecture/SKILL.md` first.

Also consult:

- `docs/ARCHITECTURE.md` for repository constraints
- `.cursorrules` for the mobile feature-based structure

## When To Use

Apply this skill for:

- Expo or React Native app architecture
- navigation and routing decisions
- native integrations
- offline-first patterns
- performance-sensitive mobile features
- release and build setup

## Workflow

1. Read the canonical skill file before making architecture decisions.
2. Align proposals with the repo's mobile structure and feature boundaries.
3. Prefer project architecture constraints over generic React Native advice.
4. If the task is implementation-heavy, extract only the patterns needed from the canonical doc.

## Guardrails

- Do not introduce a folder structure that conflicts with `.cursorrules`.
- Do not assume generic Expo patterns override project architecture.
- Call out any mismatch between the canonical skill and current repo structure.
