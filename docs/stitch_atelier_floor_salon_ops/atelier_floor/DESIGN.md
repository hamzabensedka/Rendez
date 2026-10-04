---
name: Atelier Floor
colors:
  surface: '#fdf8f7'
  surface-dim: '#ddd9d8'
  surface-bright: '#fdf8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f1'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e6'
  surface-container-highest: '#e6e2e0'
  on-surface: '#1c1b1b'
  on-surface-variant: '#4c4640'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#7d766f'
  outline-variant: '#cec5bd'
  surface-tint: '#615e5b'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1d1b19'
  on-primary-container: '#878380'
  inverse-primary: '#cbc5c2'
  secondary: '#b62419'
  on-secondary: '#ffffff'
  secondary-container: '#fd5845'
  on-secondary-container: '#5c0000'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1c'
  on-tertiary-container: '#858384'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e8e1dd'
  primary-fixed-dim: '#cbc5c2'
  on-primary-fixed: '#1d1b19'
  on-primary-fixed-variant: '#494644'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4a8'
  on-secondary-fixed: '#410000'
  on-secondary-fixed-variant: '#930303'
  tertiary-fixed: '#e5e2e3'
  tertiary-fixed-dim: '#c8c6c7'
  on-tertiary-fixed: '#1b1b1c'
  on-tertiary-fixed-variant: '#474647'
  background: '#fdf8f7'
  on-background: '#1c1b1b'
  surface-variant: '#e6e2e0'
  paper-bg: '#F3F0E8'
  paper-raised: '#FAF8F3'
  ink-muted: '#6B6560'
  hairline: '#D9D4CC'
  block-past: '#E7E2D8'
  success-muted: '#3F6B4A'
typography:
  display-date:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  ui-label:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.16em
  tabular-time:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  margin-edge: 1rem
  gutter-column: 0.75rem
  row-height-time: 3rem
  hairline-width: 1px
---

# Atelier Floor — Design System

A mobile product for salon owners and reception. This is a **floor console**, not a consumer marketplace. Quiet, operational, editorial. No teal wellness branding, no purple AI gradients, no three-equal-cards, no Inter-on-white SaaS dashboard.

## Personality

- Warm paper and black ink, like a printed appointment book
- One accent only: a sharp red used exclusively for “now” and errors
- Dense enough for a busy Saturday, never cluttered
- Type does the hierarchy. Almost no color.

## Color

- Paper background: `#F3F0E8`
- Raised surface / cards: `#FAF8F3`
- Ink: `#161412`
- Muted copy: `#6B6560`
- Hairline rules: `#D9D4CC`
- Booked block (ink): `#161412` with `#FAF8F3` text
- Completed / past block: `#E7E2D8` with `#161412` text
- Now / late / error: `#B42318`
- Success (used rarely): `#3F6B4A`

Do not introduce a second brand color. Do not use pure `#000000` full-bleed backgrounds.

## Typography

- Display (the date, big numbers): Plus Jakarta Sans Bold, tight tracking, oversized
- UI labels: 11px, letter-spacing 0.16em, sentence case — not all-caps shouting
- Body: Plus Jakarta / Inter, 15–16px
- Times: tabular lining figures
- Never use Inter as the hero type on provider screens. Display is Plus Jakarta Sans.

## Shape

- Outer cards: 4px radius (almost sharp)
- Booking blocks: 2px radius
- Pills for status: 999 radius
- Hairline dividers instead of shadows
- No drop shadows except a 12px paper elevation on the selected ticket sheet

## Layout rules

- Left-aligned headers. Never a centered app-store hero.
- Date is the biggest object on the Floor screen.
- Staff as vertical columns; time as a left gutter.
- Bottom navigation is four equal items for **providers only**: Floor, Desk, Team, Account.
- Consumer Favorites/Search chrome must not appear here.

## Screens

### Floor
Staff-column day board. Large date. Prev/next day. Jump-to-today. Next client chip under the date. Black booked blocks, warm-grey past blocks, red Now line. Tapping a block opens a ticket sheet: client, service, staff, Complete / No-show / Cancel.
