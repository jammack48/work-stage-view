

## Fix: Faster, Briefer, Better at Short Words

Three issues to fix:

### 1. Speech recognition can't pick up single words ("yes", "no")

`continuous = true` with `interimResults = false` waits for a long pause before finalizing. Single words get swallowed or ignored.

**Fix:** Set `interimResults = true` and add a silence timeout. When we get an interim result, start a 1.5s timer. If no new speech comes in, treat the interim as final and send it. This catches "yes", "no", "nah", "skip" immediately instead of waiting for the recognition engine to decide it's done.

### 2. AI responses too verbose — "G'day!", "Got it mate"

The system prompt says "casual/mate tone" and the step questions say "G'day!" — wastes time.

**Fix in edge function prompt:**
- Change rule to: "Keep speak under 6 words. No greetings, no filler. Just confirm and move."
- Example: instead of `"Got it, 6 hours mate. Moving on to parts."` → `"6 hours. Next."`

**Fix step questions** (the initial TTS prompts):
- `status`: "Job finished or coming back?" (not "G'day! Is this job finished...")
- `jobsheet`: "What'd you do?" (not "What did you get done at 123 Smith St?")
- `time`: "How many hours?"
- `parts`: "These parts right?" / "Any parts used?"
- `photos`: "Any photos?"
- `compliance`: "Any compliance certs?"

### 3. TTS voice too slow

**Fix:** Change `u.rate = 1.05` → `u.rate = 1.35` in the `useTTS` hook.

### Files to change

1. **`src/components/job/AICloseOutFlow.tsx`**
   - `useSpeech`: enable `interimResults = true`, add silence timeout (1.5s) to auto-finalize short utterances
   - `STEP_QUESTIONS`: shorten all prompts to bare minimum
   - `useTTS`: set `u.rate = 1.35`

2. **`supabase/functions/ai-closeout/index.ts`**
   - Update system prompt: "Keep speak under 6 words. No greetings, no pleasantries, no filler. Just confirm the action and state what's next."

