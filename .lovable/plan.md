

## Make Day Selection Unmissable

### Problem
The selection code works (confirmed via session replay — classes toggle on click), but the `bg-primary` green on the dark theme background doesn't create enough contrast to be noticeable.

### Solution
Use a much more aggressive, impossible-to-miss highlight style with higher contrast and visual weight.

### Changes

**`src/components/schedule/DayStrip.tsx`**

Replace the selected state styling with:
- Solid white/light background instead of `bg-primary` (which blends into dark theme)
- Dark text for maximum contrast
- Larger ring and stronger shadow
- Keep `bg-primary` as ring/border accent color instead of fill

```
Selected:     bg-card text-card-foreground ring-2 ring-primary shadow-lg scale-110 font-bold border border-primary
Not selected: default styling, hover:bg-accent/50  
Today dot:    small primary dot (unchanged)
```

This ensures the selected day pops regardless of theme, since `bg-card` always contrasts with the surrounding background.

### File

| File | Change |
|------|--------|
| `src/components/schedule/DayStrip.tsx` | Line 32: change selected styling to `bg-card text-card-foreground ring-2 ring-primary shadow-lg scale-110 font-bold border border-primary` |

