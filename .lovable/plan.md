

## Plan: Three-Pathway Mode Picker

### Current State
Two modes: "manage" (full system) and "work" (employee-only, no pricing). The `AppMode` type is `"manage" | "work" | null`.

### What Changes

**Add a third mode: "sole-trader"** — gets the Work app experience (schedule, job execution) but with pricing visible and the ability to close out/invoice jobs directly from the field. This is the solo operator who does the work AND runs the business.

#### 1. `src/contexts/AppModeContext.tsx`
- Expand `AppMode` type to `"manage" | "work" | "sole-trader" | null`
- Add `isSoleTrader` boolean to context
- Update `setMode` to accept the new value
- Update localStorage read to recognize `"sole-trader"`

#### 2. `src/components/ModePicker.tsx`
- Three cards in a responsive grid (1 col mobile, 3 col desktop)
- **Full Job System** (Shield icon) — "Manager / Office. Pipeline, quotes, invoices, pricing, reports, and team management."
- **Sole Trader** (new icon, e.g. `UserCog` or `HardHat`) — "Do the work AND run the business. Full schedule with pricing, close out jobs, and invoice on the spot."
- **Employee** (Wrench icon) — "On the tools. Today's schedule, job details, time tracking, photos, and notes — no pricing."
- Update tip text to reflect all three pathways

#### 3. `src/App.tsx`
- `isSoleTrader` mode uses Work routes (schedule-first) but adds the Close Out flow capability
- Sole trader gets the `WorkBottomNav` and `WorkHome` as their entry point
- Add `/job/:id` route that renders `WorkJobCard` but with close-out access (pass a prop or check mode inside the component)

#### 4. `src/components/AppHeader.tsx`
- Update the mode switch button to cycle or show current mode name for sole-trader
- Header title: "Toolbelt — Solo" for sole trader mode

#### 5. `src/components/job/WorkJobCard.tsx` (or similar)
- When mode is `"sole-trader"`, show pricing on tabs and add the "Close Out Job" button (reusing `JobCloseOutFlow`)
- Employee mode stays stripped of pricing as-is

#### 6. Files that check `isWorkMode`
- Update checks: `isWorkMode` should return true for both "work" and "sole-trader" (they share the Work UI shell)
- Add `isSoleTrader` for conditional features (pricing visibility, close-out access)
- Key files: `AppHeader.tsx`, `App.tsx`, `PageToolbar.tsx`, and any component hiding pricing

### Summary of the three pathways

| Feature | Manager | Sole Trader | Employee |
|---|---|---|---|
| UI Shell | Full pipeline | Work app | Work app |
| Pricing visible | Yes | Yes | No |
| Close out / Invoice | Yes (from job card) | Yes (from work app) | No |
| Pipeline / CRM | Yes | No | No |
| Schedule-first | No | Yes | Yes |

