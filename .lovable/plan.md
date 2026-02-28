

## Fix textarea/input visibility in dark mode

**Problem:** `dark:bg-white/20` is barely distinguishable from the card background, and `text-foreground` (light cream) is hard to read against it. The screenshot confirms the textarea blends into the card.

**Solution:** Use a properly contrasted approach:
- Background: `bg-white dark:bg-[hsl(30,12%,24%)]` — a noticeably lighter shade than the card (`16%` lightness) but still themed. In light mode, plain white.
- Text: `text-gray-900 dark:text-gray-100` — high contrast text regardless of theme.
- Border: `border-2 border-border` — slightly thicker border to define the field edge.
- Placeholder: add `placeholder:text-gray-400 dark:placeholder:text-gray-400` for visible but muted placeholder text.

**File:** `src/components/job/JobCompletionFlow.tsx`

Replace all instances of `bg-white/80 dark:bg-white/20 border-border/50 text-foreground` with:
`bg-white dark:bg-[hsl(30,12%,24%)] border-2 border-border text-gray-900 dark:text-gray-100 placeholder:text-gray-400`

This applies to ~5 textarea/input fields across the completion flow (lines 209, 270, 283, 349, 485).

