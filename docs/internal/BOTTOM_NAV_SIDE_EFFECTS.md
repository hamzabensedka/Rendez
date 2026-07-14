# Bottom navigation bar – side effects and mitigations

When the shared bottom menu bar was added to the `(main)` layout, it introduced the following side effects and how they are handled.

---

## 1. **Explore screen: large white gap at the bottom**

**Cause:** The Stack had a global `contentStyle: { paddingBottom: … }` so content would sit above the nav. On **Explore** the nav is intentionally hidden, but the padding was still applied, so the screen showed a big empty white strip at the bottom.

**Fix:** Padding is now applied **only when the nav is visible**. In `(main)/_layout.tsx` we use `useSegments()` and set:

- `paddingBottom: 0` when the active route is **explore**
- `paddingBottom: BOTTOM_NAV_TOTAL + insets.bottom` on all other tabs

So Explore gets no extra bottom padding and the white rectangle is gone.

---

## 2. **Screens with their own bottom padding**

**Risk:** Screens that already use bottom padding (e.g. `ScrollView` `contentContainerStyle`, safe area, or a fixed footer) can end up with **double** bottom space when the global padding is also applied.

**What to do:** On any screen that feels “too much space at the bottom” or “content too high”:

- Prefer **one** source of bottom space: either the layout’s padding (for the nav) or the screen’s own padding, not both for the same purpose.
- If the screen has a fixed bottom bar or footer, consider reducing or removing its own `paddingBottom` / `marginBottom` and relying on the layout padding when the global nav is shown.

---

## 3. **Absolutely positioned bottom elements**

**Risk:** Elements with `position: 'absolute'` and `bottom: 0` (e.g. `BookingFooter`) are **not** pushed up by the Stack’s `contentStyle.paddingBottom`. So they can sit under the bottom nav or overlap it.

**What to do:** For such screens:

- Add bottom offset to the absolute element so it sits **above** the nav, e.g.  
  `bottom: BOTTOM_NAV_TOTAL + insets.bottom`  
  (import `BOTTOM_NAV_TOTAL` from `@/application/components/BottomNav` and use `useSafeAreaInsets()` for `insets.bottom`), or
- Wrap the main content in a scroll view and use the layout padding only, and avoid a second full-width bar at the same bottom position.

---

## 4. **Safe area**

The bottom nav already uses `useSafeAreaInsets()` for its own `paddingBottom`, and the layout uses `insets.bottom` in the content padding. So content and the bar should clear the device safe area (e.g. home indicator) as long as screens don’t add conflicting padding.

---

## Summary

| Side effect                         | Mitigation                                                                 |
|------------------------------------|----------------------------------------------------------------------------|
| White gap on Explore                | Apply `contentStyle.paddingBottom` only when **not** on Explore.          |
| Double bottom padding on some screens | Prefer a single source of bottom space; trim screen-level padding if needed. |
| Absolute bottom elements under nav  | Give them a `bottom` offset ≥ nav height (+ safe area) or redesign.       |

The layout now only adds bottom padding when the nav is visible, which removes the Explore white rectangle and keeps other screens consistent.
