

## Fix: Make Day Selection Highlight More Visible

### Problem
The day selection highlight exists and works (confirmed via browser testing), but it's too subtle — the primary color blends into the dark background, making it hard to see the selection change.

### Changes

**`src/components/schedule/DayStrip.tsx`**

Make the selected day much more visually distinct:

1. **Stronger background**: Use a solid, high-contrast background for the selected day — e.g. `bg-primary text-primary-foreground font-bold shadow-lg ring-2 ring-primary/50` with a larger scale (`scale-110`)
2. **Increase button size slightly** for the selected state so it pops out more
3. **Add a bottom indicator bar** under the selected day (a small colored line) as an extra visual cue
4. **Today dot**: When today is NOT selected, show a small dot under the number instead of a full circle background (which is too similar to the selection style)

Updated styling:
```
Selected day:    bg-primary text-primary-foreground shadow-lg scale-110 ring-2 ring-primary/40
Today (not sel): small 4px dot under the date number (bg-primary)
Other days:      default text, hover:bg-accent/50
```

This creates three clearly distinct visual states: selected (bold highlighted card), today (subtle dot), and normal.

### Files

| File | Action |
|------|--------|
| `src/components/schedule/DayStrip.tsx` | Edit — stronger highlight styling, today dot indicator |

