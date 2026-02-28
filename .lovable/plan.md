

## Issues identified

1. **Toolbar disappears on scroll (mobile vertical/left)**: The mobile vertical nav at line 161-194 in `PageToolbar.tsx` uses `sticky top-0 self-start max-h-screen` but the parent flex container lacks `min-h-screen`, so the sticky element loses its anchor when content scrolls past the container height.

2. **Quote description box too small**: In `QuotePage.tsx` line 163, the Textarea has `min-h-[60px]` and `text-sm` — too cramped for reading/writing scope descriptions on mobile.

3. **Quote preview dialog cuts off on mobile**: In `QuotePreview.tsx` line 105, `max-w-lg` constrains the dialog width, and the preview document area has small padding, causing content to clip on narrow screens.

## Fixes

### 1. Fix mobile toolbar sticky behavior (`src/components/PageToolbar.tsx`)
- Change parent container (line 161) from `min-h-0` to `min-h-screen`
- Change nav (line 163-166) from `sticky top-0 self-start max-h-screen` to `fixed top-0 bottom-0` with proper z-index, so it stays visible regardless of scroll
- Add matching left padding to the main content area so it doesn't overlap

### 2. Enlarge quote description box (`src/pages/QuotePage.tsx`)
- Change Textarea `min-h-[60px]` to `min-h-[100px]`
- Change `text-sm` to `text-base` for better readability on mobile

### 3. Fix quote preview dialog width (`src/components/quote/QuotePreview.tsx`)
- Change `max-w-lg` to `max-w-lg w-[95vw]` so it uses near-full width on mobile
- Add `px-3` to the preview document area for breathing room on small screens

