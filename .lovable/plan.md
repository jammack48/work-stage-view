

## Investigation: Page Overlap During Navigation

### Root Cause

In `src/App.tsx` line 30, the `<Routes>` is wrapped in a `<div key={location.pathname}>`. This forces React to **fully unmount and remount** the entire route tree on every navigation. During this teardown/rebuild cycle, the browser briefly renders both the departing and arriving DOM — causing the visual "overlap" or flash between pages.

React Router already handles route switching cleanly on its own. The `key` prop was originally added to "force clean remounts" but it's actually the source of the problem.

### Fix

**File: `src/App.tsx`** — Remove the `key={location.pathname}` from the wrapping div on line 30.

```tsx
// Before
<div key={location.pathname}>
  <Routes>
    ...
  </Routes>
</div>

// After
<div>
  <Routes>
    ...
  </Routes>
</div>
```

Single line change. React Router will handle transitions cleanly without forcing a full DOM teardown on every navigate.

### Files changed

| File | Change |
|------|--------|
| `src/App.tsx` | Remove `key={location.pathname}` from Routes wrapper div |

