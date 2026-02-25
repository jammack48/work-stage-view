

## Fix: Persistent Heading Flash on Route Change

### Problem
The `ScrollToTop` fix addresses scroll position but doesn't solve the core issue: React reuses DOM structure between route changes, causing the old page's heading text to briefly appear before the new page renders. The heading bar in `PageToolbar` from the outgoing page lingers for a frame or two.

### Root Cause
Each page (Index, Customers, Settings, JobCard) renders its own `<AppHeader />` and `<PageToolbar>` with a `pageHeading` prop. When React Router swaps route components, the browser may paint the old component's DOM before the new one fully mounts, creating a ghosting effect on the heading text.

### Fix

**1. Force full remount on route change — `src/App.tsx`**

Wrap `<Routes>` in a keyed container that uses `useLocation().pathname`. This forces React to completely discard the old page DOM and build fresh on every navigation, eliminating any overlap.

Create a small wrapper component inside App:

```tsx
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname}>
      <Routes>
        {/* all routes */}
      </Routes>
    </div>
  );
}
```

This requires importing `useLocation` from react-router-dom and moving the `<Routes>` block into this new component (which must be inside `<BrowserRouter>` to access the hook).

**2. Files changed**
- `src/App.tsx` — wrap Routes in a keyed div using `location.pathname` to force clean remount on every navigation

### Trade-off
This causes a full remount of each page on navigation (no shared state preserved between routes), which is fine since each page already manages its own state independently.

