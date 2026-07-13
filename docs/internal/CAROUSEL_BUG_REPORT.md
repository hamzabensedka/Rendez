# Carousel “old data” / “wrong card” bug – detailed report

## 1. Intended behavior (3-slot carousel)

- **Strip:** `[ slot1 | slot2 | slot3 ]` (width = 3 × cardWidth).
- **Idle:** `stripTranslate = -cardWidth` → viewport shows **slot2** (current selected).  
  Slot1 = empty, slot2 = `selectedBusiness`, slot3 = empty.
- **After tap:** Slot1 = new selected, slot2 = old selected. Animate `stripTranslate` from `-cardWidth` to `0` → slot1 (new) slides into view.
- **When animation ends:** Reset so we’re back to idle: slot1 = empty, slot2 = new, slot3 = empty and `stripTranslate = -cardWidth`, without the user seeing wrong or empty content.

## 2. Observed bug

- When the animation is almost done (or when tapping a new pin quickly), the user sometimes sees:
  - The **old** card’s data instead of the new one, or
  - A brief **wrong** card, then the correct one.
- So for one or more frames the **visible content does not match** `selectedBusiness`.

## 3. Root cause: two separate updates that can’t be atomic

Two things must happen together for the final frame to be correct:

1. **React state:** `previousBusiness = null`  
   → Slot1 = empty, slot2 = `selectedBusiness` (the new one).
2. **Reanimated:** `stripTranslate = -cardWidth`  
   → Viewport shows slot2.

But:

- **State updates** run on the JS thread and commit in a **later React render**.
- **Shared value updates** (`stripTranslate.value = …`) are applied on the **UI thread** (worklet) and can take effect in a **different frame** than the React commit.

So we cannot make “slot content” and “strip position” update in a single atomic step. Depending on order, we get wrong content for a frame.

## 4. Two failure modes

### 4.1 Reset translate in the worklet, then clear state (current approach)

**Sequence:**

1. Animation ends in worklet.
2. Worklet does: `stripTranslate.value = -cardWidth`, then `runOnJS(clearPrevious)()`.
3. **UI thread:** translate updates immediately → viewport shows **slot2**.
4. **React tree is still from previous render:**  
   `previousBusiness` is still the old value ⇒ slot2 = old selected.
5. **Frame N:** User sees **slot2 with OLD data** (wrong card).
6. Later, React commits: `previousBusiness = null` ⇒ slot2 = `selectedBusiness` (new).
7. **Frame N+1:** User sees correct new card.

So: **one or more frames show the old card** because we moved the strip to slot2 before React had updated the slot content.

### 4.2 Clear state first, then set translate (e.g. in useLayoutEffect)

**Sequence:**

1. Animation ends; we only call `runOnJS(clearPrevious)()` (no translate in worklet).
2. `stripTranslate` stays **0** → viewport still shows **slot1**.
3. React commits: `previousBusiness = null` ⇒ slot1 = **empty**, slot2 = new.
4. **Frame N:** Viewport still at 0 ⇒ user sees **slot1 = empty**.
5. `useLayoutEffect` runs and sets `stripTranslate.value = -cardWidth`.
6. **Frame N+1 (or same paint):** Viewport shows slot2 (new) ⇒ correct.

So: **we can get one frame of empty** (slot1) if the translate update isn’t applied before the next paint.

## 5. Why “almost done” or “quick tap” makes it worse

- **Animation almost done:** `stripTranslate` is near 0; we’re mostly showing slot1 (new). If we then reset translate to -cardWidth in the worklet before clearing state, we suddenly show slot2, which still has the **old** content ⇒ very visible “wrong card” flash.
- **Quick second tap:** Same idea: we interrupt the first animation, reset to -cardWidth, and start a new one. The “reset to -cardWidth” in the worklet again shows slot2 before React has updated to the latest `selectedBusiness`, so the user can see the previous selection again.

## 6. Constraint

- We **must** end with `stripTranslate = -cardWidth` and `previousBusiness = null` (slot2 = new).
- We **must not** show:
  - slot2 with **old** content (slot2 = previousBusiness), or
  - slot1 **empty** (slot1 after clear) at translate 0.

So the only safe approach is: **apply the translate change only after React has committed the tree where slot2 = new.** That means: **do not** set `stripTranslate` in the animation-completion worklet; set it from the JS side **after** the state that clears `previousBusiness` has been committed (e.g. in `useLayoutEffect` when `previousBusiness` becomes null), so that the same frame that paints the “slot2 = new” tree also gets `stripTranslate = -cardWidth` and we never paint “slot2 = old” or “slot1 = empty at 0”.

## 7. Recommended fix (summary)

- **In the worklet (animation end):**  
  Only call `runOnJS(clearPrevious)()`.  
  Do **not** set `stripTranslate` in the worklet.
- **In React (after state commit):**  
  When `previousBusiness` becomes `null`, set `stripTranslate.value = -cardWidth` in `useLayoutEffect` so it runs in the same commit/layout pass as the updated slots, minimizing (or eliminating) the frame where slot1 is empty at translate 0.

This removes the “show slot2 (old)” failure mode. The “one frame of empty slot1” is mitigated by doing the translate update in `useLayoutEffect`, which runs after React commits the new tree but **before** the browser paint, so the same frame that paints should already have `stripTranslate = -cardWidth` and show slot2 (new). If a flash of empty still appears on some devices, a fallback is a very short (e.g. 50 ms) “reset” animation from 0 to -cardWidth so the same card (new) stays visible the whole time.
