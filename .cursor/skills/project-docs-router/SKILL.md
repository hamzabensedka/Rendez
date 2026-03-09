---
name: project-docs-router
description: Routes tasks to the right documentation inside `docs/`, including product docs, architecture docs, redesign notes, and nested skills under `docs/skills/`. Use when a request references `@docs/`, depends on repository documentation, or needs project-specific guidance before implementation.
---

# Project Docs Router

## Purpose

Use this skill when `docs/` is not a single document set but a mixed knowledge base with multiple domains and embedded skills.

Treat `docs/` as a router problem:

- some requests need product flow documentation
- some need architecture constraints
- some need redesign notes
- some should defer to a nested skill under `docs/skills/`

## When To Use

Apply this skill when:

- the task references `@docs/`
- the user says to follow project documentation
- you need product behavior before changing code
- you need mobile architecture or front-end constraints
- you suspect the repo already contains a specialized skill for the task

## Docs Map

Use this rough routing map:

- `docs/ARCHITECTURE.md`
  - repo structure, stack, feature boundaries, architectural constraints
- `docs/user-roadmap/*.md`
  - user journey, product flow, booking steps, onboarding-style behavior
- `docs/REDESIGN_*.md` and other top-level design docs
  - redesign intent, UX direction, product reshaping
- `docs/skills/**/SKILL.md`
  - specialized reusable instructions that should be read and followed directly
- `docs/skills/**/references/*.md`
  - deeper reference material for a nested skill
- screenshots and visual assets under `docs/`
  - visual reference only; use to validate structure or UI intent

## Routing Workflow

Follow this sequence:

1. Classify the request.
   - Product flow?
   - Architecture?
   - UI redesign?
   - React Native implementation?
   - General front-end?
2. Check whether `docs/skills/` contains a specialized skill for that domain.
3. If a nested skill exists, read its `SKILL.md` first and follow it.
4. Read only the supporting docs needed for the task.
5. Summarize the constraints you found before coding.
6. Implement or answer using the project docs as source of truth.

## Core Rules

When using this skill:

1. Prefer project docs over generic advice when they conflict.
2. Prefer the most specific source available.
3. If a nested skill applies, use it instead of inventing a new workflow.
4. Cite the exact doc files that informed the result.
5. If docs conflict, call out the conflict explicitly.
6. If docs are missing, say so plainly.

## Output Expectations

When answering after consulting `docs/`:

- start with the documented constraint or behavior
- keep the summary short and specific to the task
- cite the file paths used
- separate:
  - documented facts
  - implementation choices
  - assumptions or gaps

## Guardrails

- Do not treat `docs/` as flat.
- Do not skip `docs/skills/` when the task is clearly skill-shaped.
- Do not invent product behavior if roadmap docs already define it.
- Do not ignore architecture docs when changing app structure.
- Do not rely on screenshots alone if textual docs exist.

## Example Prompts

- "Use `@docs/` to understand the booking flow before updating the mobile screen"
- "Check `docs/ARCHITECTURE.md` before moving this feature code"
- "Look in `docs/skills/` and use the right React Native skill for this task"
- "Summarize the relevant roadmap docs and then implement the screen"
- "Compare current code with the redesign docs in `docs/`"

## Success Criteria

This skill is working well when the final result:

- chooses the right documentation source quickly
- discovers and uses nested skills when relevant
- reflects project-specific behavior and architecture
- avoids unsupported assumptions
