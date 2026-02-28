

## Changes to JobCompletionFlow

### 1. Lighten all textarea/input backgrounds for dark mode visibility

Change all `Textarea` and `Input` fields from `bg-background border-border` to a much lighter style: `bg-white/80 dark:bg-white/20 border-border text-foreground`. This gives a noticeably lighter box in dark mode while keeping dark text readable. The textarea should also auto-expand (no fixed height scroll issue).

### 2. Add voice dictation button

Add a microphone button next to the "What was done on this job?" label on the Job Sheet step. Uses the browser's built-in `SpeechRecognition` API (Web Speech API) — no external dependencies needed. Tapping starts listening, transcribed text appends to the job sheet textarea. A pulsing mic icon indicates active recording.

**File:** `src/components/job/JobCompletionFlow.tsx`

- Import `Mic`, `MicOff` from lucide-react
- Add `isListening` state and a `toggleDictation` function using `window.SpeechRecognition || window.webkitSpeechRecognition`
- On result, append transcript to `jobSheet`
- Place mic button inline with the "What was done on this job?" label
- Update all textarea/input className to use lighter backgrounds: `bg-white/80 dark:bg-white/20 border-border/50 text-foreground dark:text-white`
- Make the job sheet textarea use `min-h-[120px]` instead of fixed `rows={6}` for better auto-sizing

