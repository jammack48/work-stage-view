

## Fix: Page Heading Flash During Navigation

### Problem

When navigating between pages (e.g., Pipeline → Customers → back), the page heading briefly shows the previous page's text before updating to the correct one. This creates a visible "overlay" or "slide" effect lasting about a second.

### Root Cause

React Router unmounts the old route component and mounts the new one, but the browser may retain the previous scroll position and rendered content momentarily. There's no mechanism to instantly reset the view state on navigation. The heading bar in `PageToolbar` renders different text per page, and the transition between route components can cause a brief visual overlap.

### Fix

**1. Add `ScrollToTop` component — `src/components/ScrollToTop.tsx` (new file)**

A small component placed inside `BrowserRouter` that resets scroll position on every navigation. This eliminates the visual glitch where the old page content briefly remains visible during route changes.

```tsx
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType !== "POP") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, navType]);

  return null;
};
```

**2. Register in `src/App.tsx`**

Import `ScrollToTop` and place it inside `BrowserRouter`, before `Routes`.

**3. Ensure no CSS transition on heading bar — `src/components/PageToolbar.tsx`**

Confirm the heading bar div has no `transition` classes. Currently it doesn't, so no change needed — but if the issue persists, we can add `key={pathname}` to the heading bar wrapper so React forces a clean remount on every route change rather than reusing the DOM node.

### Result

Page transitions will be instant with no heading text overlay or flash.

