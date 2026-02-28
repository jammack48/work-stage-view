

## Issues from screenshots

1. **Duplicate description**: QuotePage renders a scope `Textarea` at line 158-165, AND each QuoteBlock inside `QuoteTab` has its own description `Textarea` at line 390-395. The page-level scope box repeats the same text as the block description, creating redundancy.

2. **Labour items show person names + job descriptions** (e.g. "Jake Turner — Strip out old"): The `createBlockFromJob()` at line 158 formats labour as `${t.staff} — ${t.description}`. For tradies, labour should be role-based (e.g. "Electrician", "Apprentice") with hours and rate, not individual names.

3. **Item rows take too much vertical space**: Each item shows Name, Qty/Buy/Sell row, and Markup row — 3 full lines per item. On mobile this means only 1-2 items visible at a time.

## Plan

### 1. Remove duplicate scope description from QuotePage (`src/pages/QuotePage.tsx`)
- Remove the `Textarea` wrapper div at lines 157-165 in the `line-items` tab content
- The block-level description in `QuoteTab` is sufficient — each block already has a name (heading) and description field

### 2. Make block header clearer (`src/components/job/QuoteTab.tsx`)
- Change block name `Input` to use `text-base font-bold` instead of `text-sm font-semibold` so it reads as a clear section heading
- Increase block description textarea to `text-sm` (from `text-xs`) and `min-h-[60px]` for readability

### 3. Fix labour item naming (`src/components/job/QuoteTab.tsx`)
- Change `createBlockFromJob()` at line 158 to use role-based names: format as `${t.staff.split(' ')[0]} (${role})` or just the role from `staffPool`
- Better: change to `Electrician`, `Apprentice` etc. by looking up from `staffPool` data

### 4. Compact item rows for mobile (`src/components/job/QuoteTab.tsx`)
- Combine the Qty/Buy and Sell/Markup into a single 2-row layout instead of 3 rows
- Move the line total inline with the name row (right-aligned)
- Put Qty, Buy, Sell, Markup all on one row with smaller inputs
- Hide the "Sell" field by default (it's auto-calculated from Buy + Markup) — show only Name, Qty × Rate, Markup%, Total

### Files to modify
- `src/pages/QuotePage.tsx` — remove duplicate scope textarea from line-items tab
- `src/components/job/QuoteTab.tsx` — bigger block headings, fix labour names to roles, compact item rows

