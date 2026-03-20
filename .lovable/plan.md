

## Fix: Trade-Specific Schedule Jobs + Data Clarification

### What's Happening

Two separate issues:

1. **Schedule shows generic jobs**: The schedule calendar (`scheduleData.ts`) uses a hardcoded `JOB_NAMES` array with generic names like "Kitchen Plumbing", "Roof Repair" regardless of trade. This is why your painting trade shows "Leak Detection" and "Deck Lighting" on the calendar.

2. **Data IS in the connected database**: The `demo_jobs` table exists in the database connected to your app and the API returns 10 correct painting jobs (verified via network logs). The pipeline view should already show painting-specific jobs. Your external Supabase dashboard (qrkojbfayjrtrlrmgzry) is a *different* project — the app connects to a separate database instance via environment variables where the `demo_jobs` table lives.

### Fix: Trade-Specific Job Names in Schedule

Update `src/components/schedule/scheduleData.ts` to accept a trade parameter and use trade-specific job name pools.

| File | Change |
|------|--------|
| `src/components/schedule/scheduleData.ts` | Add a `TRADE_JOB_NAMES` map with realistic job names per trade. Update `generateWeekJobs` to accept an optional `trade` parameter and pick from the correct pool. |
| `src/pages/SchedulePage.tsx` | Pass the current `trade` from `useAppMode()` into `generateWeekJobs(weekStart, trade)`. |

**Trade-specific job name pools** (examples):

- **Painting**: Interior Repaint, Exterior Spray, Cabinet Respray, Fence Stain, Ceiling Touch-Up, Feature Wall, Deck Oil, Render & Paint
- **Plumbing**: Hot Water Replace, Leak Repair, Drain Unblock, Tap Replace, Toilet Install, Gas Fitting, Shower Install, Spouting Repair
- **Electrical**: Switchboard Upgrade, LED Downlights, EV Charger Install, Rewire, Heat Pump Wiring, Smoke Alarms, Power Points, Solar Panel Install
- **HVAC**: Heat Pump Install, Ducted System Service, Split System Install, Ventilation Upgrade, Filter Replace, Refrigerant Recharge
- **Glazing**: Double Glazing Retrofit, Shower Screen Install, Splashback Measure, Window Replace, Balustrade Install, Mirror Install
- **Building**: Deck Build, Bathroom Reno, Kitchen Reno, Fence Build, Framing, Cladding Repair, Roofing, Concrete Pour
- **Mechanic**: Brake Pad Replace, WOF Inspection, Cam Belt Replace, Oil Change, Clutch Repair, Suspension Check, AC Regas, Timing Chain
- **Landscaping**: Lawn Install, Retaining Wall, Garden Design, Irrigation Install, Tree Removal, Paving, Hedge Trim, Drainage

### No Other Changes Needed

The pipeline dashboard already fetches trade-specific jobs from the database correctly. Only the schedule/calendar view needs updating to use trade-aware job names.

