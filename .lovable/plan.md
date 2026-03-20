

## Fix: "Change Trade" Should Also Clear Mode

### Problem

When the user clicks "Change Trade" in the header dropdown, it only calls `clearTrade()` — it does **not** call `clearMode()`. So when a new trade is selected, the previously chosen mode (e.g. "manage") is still stored in localStorage, causing the app to skip the Mode Picker and jump straight to the dashboard.

### Fix

**File**: `src/components/AppHeader.tsx` (line 81)

Change the "Change Trade" handler from:
```typescript
clearTrade(); navigate("/");
```
to:
```typescript
clearTrade(); clearMode(); navigate("/");
```

This ensures both the trade and mode selections are wiped, so the user sees the full flow: Trade Picker → Mode Picker → Dashboard.

### One file, one line change.

