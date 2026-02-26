

## Root Cause

The `useIsMobile()` hook in `src/hooks/use-mobile.tsx` initializes state as `undefined` (line 7), then only sets the real value inside a `useEffect` (which runs **after** the first paint).

This means on every page navigation:
1. New page component mounts
2. `useIsMobile()` returns `!!undefined` = `false` (desktop mode)
3. Page renders with **desktop layout** for one frame
4. `useEffect` fires, detects mobile, sets `true`
5. Page re-renders with **mobile layout**

On desktop this is invisible (both layouts look similar). On mobile, the user sees the desktop layout flash briefly underneath the mobile layout — the "overlay" effect.

## Fix

**File: `src/hooks/use-mobile.tsx`** — Initialize state with a synchronous check instead of `undefined`, so the very first render uses the correct layout:

```tsx
// Before
const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

// After
const [isMobile, setIsMobile] = React.useState<boolean>(() => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < MOBILE_BREAKPOINT || window.innerHeight < LANDSCAPE_HEIGHT_BREAKPOINT;
});
```

This eliminates the one-frame desktop flash on mobile devices. The `useEffect` still handles resize/orientation changes, but the initial render is now correct.

### Files changed

| File | Change |
|------|--------|
| `src/hooks/use-mobile.tsx` | Initialize state with synchronous window check instead of `undefined` |

