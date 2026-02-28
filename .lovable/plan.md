
Deep-dive findings (reproduced on mobile 390x844, /customers):
1) The current `sticky top-0` heading is technically working.
2) The visible “movement” happens because `AppHeader` is not sticky/fixed, so it scrolls away while the page heading re-anchors to viewport top.
3) In practice this creates a jump from “below AppHeader” to “top of screen”, which feels broken.
4) Left toolbar is fixed to `top-[48px]`, so layering is mixed (fixed sidebar + non-fixed global header + sticky page heading).

Implementation plan:
1) Stabilize global top layer:
- `src/components/AppHeader.tsx`: make header persistent on scroll on mobile (`sticky top-0 z-50`) and lock a predictable mobile height (`h-12`) so offsets are reliable.

2) Offset all sticky/fixed page-level layers under AppHeader:
- `src/components/PageToolbar.tsx`:
  - Mobile vertical sidebar: keep `top-[48px]` (already correct).
  - Heading bar: change from generic `sticky top-0` to mobile-aware offset (`sticky top-[48px]`) so it stays pinned directly under AppHeader.
  - Top-position toolbar bars (`position === "top"`): set sticky offset to `top-[48px]` on mobile so they no longer compete with AppHeader.
  - Keep desktop offsets unchanged.

3) Prevent content from hiding behind fixed/sticky heading:
- `src/components/PageToolbar.tsx`:
  - In mobile vertical branch, add top padding to content container equal to heading height when heading exists.
  - Ensure heading z-index is below AppHeader and above cards (e.g., heading `z-30`, AppHeader `z-50`).

4) Remove cross-mode side effects:
- Scope heading sticky behavior to mobile layout branches only (where issue is reported), avoiding desktop regressions in `left/right/top/bottom` desktop modes.

Validation tests I will run after implementation:
1) Mobile 390x844 on `/customers`: scroll down/up heavily; verify `Customer Directory` never changes vertical position.
2) Mobile with tutorial banner on/off: ensure heading remains pinned and content does not slide underneath.
3) Mobile toolbar position cycle (`left`, `right`, `top`, `bottom`): confirm no overlap between AppHeader, toolbar, and heading.
4) Regression check on `/job/:id` and `/quote/:id`: verify heading remains fixed and readable.
5) Visual layering check via screenshots before/after scroll to confirm no jumping.
