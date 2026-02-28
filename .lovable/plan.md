

## Make job sheet textarea auto-expanding

**File:** `src/components/job/JobCompletionFlow.tsx`

**Change:** Replace the fixed `min-h-[120px]` Textarea with one that auto-expands as the user types. Use an `onInput` handler that sets `style.height = 'auto'` then `style.height = scrollHeight + 'px'` so the textarea grows to fit all content. No internal scrollbar — the user always sees the full text. Set a reasonable `min-h-[120px]` and `max-h-[300px]` with `overflow-y-auto` so it doesn't take over the entire screen but allows much more visibility.

Also add a small "expand" toggle button below the textarea that removes the max-height cap temporarily, letting the user see everything if the text is very long.

