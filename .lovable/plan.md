

## Simplify Startup + Elevate Manager Button

### Changes

#### 1. ModePicker — Two buttons only (`src/components/ModePicker.tsx`)
Replace the 3-card grid with **2 large buttons**:
- **"Office / Manager"** — Shield icon, blue accent. On click, shows a sub-choice: "Office" (sets mode `manage`) or "On the Tools" (sets mode `sole-trader`, shows setup toggles).
- **"Employee"** — Wrench icon. Goes straight to work mode (`work`), no sub-choice.

Flow:
```text
Startup Screen
├── [Office / Manager] → Sub-step:
│   ├── [Run the Office] → mode = "manage" (pipeline)
│   └── [On the Tools]  → Sole Trader setup toggles → mode = "sole-trader"
└── [Employee]          → mode = "work" (straight in)
```

Both Office and Sole Trader share the same pipeline — the difference is just which UI shell wraps it.

#### 2. Manager tab position + glow (`src/config/toolbarTabs.ts`)
Move `{ id: "manager", label: "Manager", icon: Shield }` from `PIPELINE_EXTRAS` into `COMMON_TABS` — place it immediately after "Home" so it appears second in every toolbar layout. This ensures it's always visible and prominent.

#### 3. Manager button styling (`src/components/PageToolbar.tsx`)
Add special styling for the "manager" tab ID:
- Blue background tint (`bg-blue-500/15 text-blue-500`) when inactive
- Soft pulsing glow animation (`animate-pulse` or a subtle `shadow-blue-500/30` box-shadow)
- When active, solid blue (`bg-blue-500 text-white`)

This makes it visually distinct and attention-grabbing across all toolbar positions (left, right, top, bottom).

#### 4. Fix left layout spacing (`src/components/PageToolbar.tsx`)
The desktop left sidebar uses `w-[200px]` with no padding on the nav container and items using `px-4`. Add `px-2` to the nav element so items have consistent inset, and ensure the main content area doesn't overlap.

#### Files
1. **`src/components/ModePicker.tsx`** — Rewrite to 2-button start → sub-step for Office/Manager
2. **`src/config/toolbarTabs.ts`** — Move manager from `PIPELINE_EXTRAS` to `COMMON_TABS` (after Home)
3. **`src/components/PageToolbar.tsx`** — Blue glow styling for manager tab, fix left layout padding
4. **`src/index.css`** — Add `@keyframes` for soft glow if needed

