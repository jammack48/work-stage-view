

## AI Voice Close-Out Flow — MVP Plan

### What you're after
A new "AI-assisted" mode — accessible from the mode picker alongside the existing options. When closing out a job, instead of tapping through form steps, an AI assistant talks you through it conversationally: "What did you do today?" → transcribes your answer → confirms → asks about hours, parts, photos, compliance — all hands-free via voice.

### Infrastructure needed

This requires Lovable Cloud (Supabase) for an edge function that calls the Lovable AI Gateway. No external OpenAI key needed — Lovable AI is built in and free to start. We'll use the browser's Speech Recognition API (already in the app) for voice input, and the Lovable AI Gateway for the conversational logic.

**Before implementing, we need to enable Lovable Cloud.** This gives us:
- Edge functions (to call the AI gateway securely)
- The auto-provisioned `LOVABLE_API_KEY` for AI calls

### Design

**1. New app mode: `"ai-tools"`**
- Added to `AppModeContext` alongside `work` and `sole-trader`
- Accessible from the ModePicker: under "Manager / Owner → On the Tools", add a toggle or second option: "AI-Assisted" with a sparkle/bot icon
- Also accessible from "Employee" path as an alternative
- Behaves like Work mode (same home, schedule, bottom nav) but the "Finished Job" button opens the AI flow instead of the step-by-step flow

**2. AI Close-Out Edge Function** (`supabase/functions/ai-closeout/index.ts`)
- Takes conversation history + job context (job name, address, materials from quote, etc.)
- System prompt instructs the AI to be a friendly assistant named "Jamie's AI" that walks through: what was done → confirm summary → job complete or coming back → hours worked → parts used (suggests from job quote/history) → purchase order → photos → compliance certs
- Returns streaming text responses
- Uses `google/gemini-3-flash-preview` via Lovable AI Gateway

**3. AI Close-Out Dialog** (`src/components/job/AICloseOutFlow.tsx`)
- Full-screen dialog with a chat-style interface
- Shows AI messages as speech bubbles
- User can respond via:
  - Voice (mic button, using existing Speech Recognition API — already in the codebase)
  - Text input as fallback
- AI response streams in token-by-token
- At key moments, the AI's response triggers structured UI actions:
  - "Take photos" → shows camera capture buttons inline
  - "Confirm parts" → shows editable parts list inline
  - "Confirm hours" → shows hours input inline
- When the AI says "All done", a final "Submit" button appears
- All collected data (job sheet text, hours, parts, photos) is stored in component state, same as the existing flows

**4. Integration in WorkJobCard**
- When mode is `ai-tools`, the "Finished Job" / "Finish & Invoice" button opens `AICloseOutFlow` instead of `JobCompletionFlow` / `SoleTraderCloseOutFlow`

### Files to create/change

1. **`src/contexts/AppModeContext.tsx`** — Add `"ai-tools"` to `AppMode` type, update `isWorkMode` to include it, add `isAIMode` flag
2. **`src/components/ModePicker.tsx`** — Add AI-assisted option in the "On the Tools" sub-flow and as an Employee variant
3. **`supabase/functions/ai-closeout/index.ts`** — Edge function with system prompt and streaming response via Lovable AI Gateway
4. **`src/components/job/AICloseOutFlow.tsx`** — New component: conversational AI close-out dialog with voice input, streaming responses, and inline action cards (photos, parts, hours)
5. **`src/components/job/WorkJobCard.tsx`** — Conditionally open `AICloseOutFlow` when in AI mode

### What the MVP looks like

The user opens a job, taps "Finished Job", and instead of step-by-step forms, they see a chat. The AI says: *"Hey! Let's wrap up [Job Name] at [Address]. What did you get done today?"* The user taps the mic and talks. The AI transcribes, confirms, then walks through hours, parts (suggesting from the job's materials list), photos, and compliance. Everything is voice-first but with text fallback. At the end, the job is marked complete with all data captured.

### Prerequisite

Lovable Cloud must be enabled first so we can deploy the edge function and use the AI gateway. I'll need to enable that before building.

