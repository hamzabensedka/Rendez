# Code Review Guide

A structured checklist for reviewing changes in the Planity codebase. Use it for manual reviews, PR templates, or as the basis for Cursor AI Custom Mode instructions so the AI evaluates every change against the same criteria a senior engineer would.

---

## 1. Introduction

Code reviews are a cornerstone of professional software development. This guide gives you a **14-point evaluation framework** so every change gets consistent, thorough scrutiny — whether you do it yourself or delegate the mechanical checks to an AI assistant.

**How to use this doc:**

- **Manual review:** Work through each section when reviewing a PR; tick off sub-checks and note severity.
- **PR template:** Copy the checklist into your PR description and have authors self-check before request.
- **Cursor Custom Mode:** Paste the [Prompt for Cursor](#prompt-for-cursor-custom-mode) into a Custom Mode so Cursor can fetch diffs, evaluate against this checklist, and output prioritized, copy-ready comments.

**Severity levels** (use when writing comments):

| Level        | When to use |
|-------------|-------------|
| **Critical** | Bugs, security issues, data loss, or broken flows; must fix before merge. |
| **Major**    | Significant maintainability, performance, or correctness risks; should fix. |
| **Minor**    | Style, naming, or small improvements; nice to fix. |
| **Enhancement** | Positive observations or optional improvements. |

---

## 2. The 14-Point Checklist

### (1) Design & Architecture

- [ ] **Single responsibility:** Each module/component has a clear, focused purpose.
- [ ] **Layering:** UI → features → domain → data boundaries are respected (no API calls from UI components, no business logic in primitives).
- [ ] **Dependencies:** New code depends inward (e.g. features depend on domain, not the reverse); no circular dependencies.
- [ ] **Reuse:** Shared logic lives in the right place (hooks, services, utils) instead of being duplicated.
- [ ] **Fit with existing patterns:** Matches the project’s existing structure (e.g. `apps/mobile` feature-based layout, `apps/api` module layout).

### (2) Complexity & Maintainability

- [ ] **Function/component size:** No excessively long functions or components; complex logic is split or extracted.
- [ ] **Conditional complexity:** Nested conditionals and branching are minimal; consider early returns or small helper functions.
- [ ] **State management:** State is localized where possible; no unnecessary global or prop-drilling.
- [ ] **Future changes:** A maintainer could extend or change this code without excessive refactors.

### (3) Functionality & Correctness

- [ ] **Edge cases:** Null/undefined, empty lists, and error paths are handled.
- [ ] **Input validation:** User and API inputs are validated and sanitized where needed.
- [ ] **Async behavior:** Promises are handled (no unhandled rejections); loading and error states are considered.
- [ ] **Side effects:** Side effects are predictable and documented (e.g. when and what gets written or sent).

### (4) Readability & Naming

- [ ] **Names:** Variables, functions, and types have clear, consistent names that reflect intent.
- [ ] **No magic values:** Important constants are named (e.g. timeouts, limits, status codes).
- [ ] **Abbreviations:** Only widely understood abbreviations are used; otherwise spell out.

### (5) Best Practices & Patterns

- [ ] **React/React Native:** Hooks rules respected; keys used correctly; no unnecessary re-renders from unstable references.
- [ ] **API/Backend:** Idempotency and HTTP semantics are appropriate; errors mapped to sensible status codes.
- [ ] **Data handling:** No unnecessary mutation; immutability where it matters (e.g. Redux, state updates).

### (6) Test Coverage & Quality

- [ ] **New behavior:** New or changed behavior has tests (unit and/or integration where relevant).
- [ ] **Critical paths:** Auth, booking, payments, and other critical flows are covered.
- [ ] **Test quality:** Tests assert behavior, not implementation details; names describe the scenario.

### (7) Standardization & Style

- [ ] **Lint/format:** Code passes project lint and formatter (ESLint, Prettier).
- [ ] **Conventions:** Matches existing patterns (import order, file naming, export style).
- [ ] **TypeScript:** Types are used meaningfully; `any` is avoided unless justified.

### (8) Documentation & Comments

- [ ] **Public APIs:** Exported functions, hooks, or endpoints have brief docs where behavior is non-obvious.
- [ ] **Comments:** Comments explain “why,” not “what”; no stale or redundant comments.
- [ ] **README/ADRs:** Non-trivial decisions or setup steps are documented where they help future contributors.

### (9) Security & Compliance

- [ ] **Secrets:** No secrets, API keys, or tokens in code or committed config; use env vars or secret managers.
- [ ] **Sensitive data:** PII and sensitive data are not logged or exposed in client bundles.
- [ ] **Auth/authz:** Endpoints and screens enforce authentication and authorization where required.
- [ ] **Input:** User/API input is not trusted blindly; injection and XSS vectors are avoided.

### (10) Performance & Scalability

- [ ] **Rendering:** Expensive work is memoized or moved off the main thread where appropriate; lists use stable keys and virtualization if long.
- [ ] **Network:** Unnecessary requests are avoided; batching or caching considered where it matters.
- [ ] **Backend:** Queries are efficient (no N+1, appropriate indexes); heavy work is deferred or queued if needed.

### (11) Observability & Logging

- [ ] **Errors:** Failures are logged with enough context to debug (e.g. request id, user id where safe).
- [ ] **Structured logging:** Logs are structured (e.g. JSON) where the pipeline expects it.
- [ ] **Sensitive data:** Logs do not contain passwords, tokens, or full PII.

### (12) Accessibility & Internationalization

- [ ] **a11y:** Interactive elements have labels; focus order and screen-reader usage are considered.
- [ ] **i18n:** User-facing strings are not hardcoded where the app supports multiple locales; keys are consistent.

### (13) CI/CD & DevOps

- [ ] **Build/tests:** Changes don’t break the default build or test commands.
- [ ] **Config:** New env vars or config are documented and reflected in `.env.example` or equivalent.
- [ ] **Migrations:** DB or config migrations are reversible or documented where one-way.

### (14) AI-Assisted Code Review

- [ ] **Generated code:** If code was AI-generated, it has been read and adjusted for correctness, security, and project style.
- [ ] **Copy-paste:** Pasted snippets are adapted to the project (imports, naming, patterns), not dropped in verbatim.

---

## 3. How to Run a Review

### Manual flow

1. Get the diff (e.g. `git diff main...your-branch` or your PR diff).
2. Walk through each of the 14 sections; for every change, run the sub-checks.
3. For each finding, assign a severity (Critical / Major / Minor / Enhancement) and write a short, actionable comment with file/line if helpful.
4. Summarize at the top: counts by severity and any blocking issues.

### With Cursor AI (Custom Mode)

1. In Cursor, open **Settings** and enable **Custom Modes** (beta).
2. In the chat panel (**Ctrl+L** / **Cmd+L**), click the Mode selector → **Add Custom Mode**.
3. Name it (e.g. “Code Review”) and enable tools: **Run**, **Read**, **Search** (and **Edit** only if you want the AI to suggest patches).
4. Paste the [Prompt for Cursor](#prompt-for-cursor-custom-mode) below into the custom instructions.
5. To review: ask the assistant to fetch and diff your branch (e.g. `main` vs current branch), then evaluate the diff against the 14-point checklist and output a prioritized list of issues with severity and copy-ready comments.

---

## 4. Prompt for Cursor Custom Mode

Copy the block below into your Cursor Custom Mode instructions so the AI follows the same checklist every time.

```markdown
You are a senior engineer performing a structured code review. Your job is to evaluate the provided diff (or the result of a git diff the user asks you to run) against the following 14-point checklist. You must output your findings in a consistent format.

**Process:**
1. If the user asks you to review a branch, run: `git fetch origin` then `git diff origin/main...HEAD` (or the branch they specify) to get the diff.
2. For each changed file, evaluate the changes against every applicable item in the checklist below.
3. For each finding: assign one of **Critical**, **Major**, **Minor**, or **Enhancement**, and write a short, copy-ready comment (as you would write in a PR). Include file path and, if useful, line or snippet.
4. At the end, output a summary: total counts by severity, and list any **Critical** or **Major** items that should block merge until addressed.

**Severity:**
- **Critical:** Bugs, security issues, data loss, broken flows — must fix before merge.
- **Major:** Significant maintainability, performance, or correctness risk — should fix.
- **Minor:** Style, naming, small improvements — nice to fix.
- **Enhancement:** Positive observations or optional improvements.

**The 14-point checklist (evaluate only what applies to the changed code):**

1. **Design & Architecture** — Single responsibility; correct layering (UI/features/domain/data); dependencies inward; no circular deps; reuse via shared modules; consistency with project structure.
2. **Complexity & Maintainability** — Reasonable function/component size; low conditional complexity; state localized; code easy to extend.
3. **Functionality & Correctness** — Edge cases (null, empty, errors); input validation; async handled; side effects clear.
4. **Readability & Naming** — Clear, consistent names; no magic numbers; minimal unclear abbreviations.
5. **Best Practices & Patterns** — React/RN hooks and keys; API idempotency and status codes; immutability where needed.
6. **Test Coverage & Quality** — New behavior tested; critical paths covered; tests assert behavior, not implementation.
7. **Standardization & Style** — Lint/format pass; project conventions; TypeScript used properly, no unjustified `any`.
8. **Documentation & Comments** — Public APIs documented where non-obvious; comments explain why; no stale comments.
9. **Security & Compliance** — No secrets in code; no PII in logs/client; auth/authz enforced; input validated/sanitized.
10. **Performance & Scalability** — No unnecessary re-renders; efficient queries (no N+1); batching/caching where appropriate.
11. **Observability & Logging** — Errors logged with context; structured logging if required; no secrets/PII in logs.
12. **Accessibility & Internationalization** — Labels and focus order; user-facing strings ready for i18n if applicable.
13. **CI/CD & DevOps** — Build and tests pass; new env/config documented; migrations documented.
14. **AI-Assisted Code Review** — Generated code reviewed and adapted; no raw paste from other codebases.

Always be concise and actionable. Prefer one finding per comment. If nothing in a category applies, skip it; do not invent issues.
```

---

## 5. Example Output Format

When you (or the AI) produce the review, aim for something like this so it’s easy to paste into a PR:

```text
## Code review summary
- Critical: 1
- Major: 2
- Minor: 3
- Enhancement: 2

### Critical
- **apps/api/src/businesses/businesses.service.ts** — Missing null check on `req.body.address` before accessing properties; can throw in production. (Design & Architecture / Functionality)

### Major
- **apps/mobile/src/features/booking/hooks/useBookingData.ts** — Potential N+1 if `slots` are fetched per service; consider batching or a single endpoint. (Performance & Scalability)
- **apps/mobile/src/features/auth/pages/LoginScreen.tsx** — Error state from API is not surfaced to the user; user sees no feedback on wrong password. (Functionality & Correctness)

### Minor
- **apps/mobile/src/features/search/components/SearchInput.tsx** — Inconsistent naming: `onChangeText` vs `onSearchChange` in same feature. (Readability & Naming)
…

### Blocking before merge
- Address the Critical finding (null check).
- Consider fixing the two Major items or document as follow-up.
```

---

## 6. Customization

- **Add/remove checklist items** to match your team’s standards (e.g. stricter security or API versioning).
- **Change severity rules** (e.g. treat “no tests for new code” as Major).
- **Narrow scope:** In the Custom Mode prompt, you can restrict to certain apps (e.g. “only evaluate `apps/mobile` and `apps/api`”) or to certain types of files.

Use this guide as your single source of truth for what “good” looks like in a review, and you’ll get more consistent, thorough feedback without spending extra time re-explaining your criteria.
