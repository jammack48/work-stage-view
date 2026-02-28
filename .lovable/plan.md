

## Issues

1. **Toolbar covers heading on mobile**: The fixed mobile vertical nav starts at `top-0`, overlapping the AppHeader. It needs `top-[var(--header-height)]` or a fixed offset (the header is ~48px).

2. **Description textarea looks invisible**: The description textarea uses `bg-transparent border-0` — no visual cue that it's an input field. Needs a subtle background like `bg-muted/50` with a light border.

3. **Custom quote creates blank blocks**: When a user writes a custom description (no bundle selected), `initialBundle` is `undefined` and `getNewJobDetail` returns empty `timeEntries` and `materials`. In `QuoteTab` line 183-187, `initialBlocks` resolves to `[]` because both conditions fail. The funnel description is lost. Fix: pass `funnelData?.description` as a new prop and create a starter block with that description.

## Plan

### 1. Push mobile toolbar below AppHeader (`src/components/PageToolbar.tsx`)
- Line 164: Change `fixed top-0 bottom-0` to `fixed top-[48px] bottom-0` on the mobile vertical nav so it sits below the header
- This matches the AppHeader height (~48px)

### 2. Style description textarea visibly (`src/components/job/QuoteTab.tsx`)
- Line 421: Change `bg-transparent` to `bg-muted/40 rounded-lg px-3 py-2 border border-border/50`
- Keep the auto-expand behavior

### 3. Fix custom quote creating empty blocks (`src/components/job/QuoteTab.tsx`)
- Add optional `initialDescription?: string` prop to `QuoteTabProps`
- In `initialBlocks` logic (line 183-187): when no bundle and no time/materials, create one empty block pre-filled with `initialDescription` as the description
- In `QuotePage.tsx` line 152: pass `initialDescription={funnelData?.description}` to `QuoteTab`

### Files
- `src/components/PageToolbar.tsx` — toolbar offset
- `src/components/job/QuoteTab.tsx` — description styling + initialDescription prop
- `src/pages/QuotePage.tsx` — pass description through

