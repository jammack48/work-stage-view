

## Redesign: AI Close-Out as Voice-Assisted Step Navigator

The current chat-based approach is wrong. The user wants the AI to be like an apprentice sitting next to them — navigating through the **same existing close-out screens** (JobCompletionFlow), reading questions aloud, listening for short answers ("yes", "no", "6 hours"), filling in the fields, and advancing to the next step automatically.

### How it works

The existing `JobCompletionFlow` already has the right screens:

```text
Status → Checklist → Job Sheet → Time → Parts → Photos → Compliance
```

The AI voice layer sits on top of these screens:

```text
┌─────────────────────────────┐
│  [Same step UI as today]    │
│  Fields auto-fill as user   │
│  speaks answers              │
│                              │
│  ┌─────────────────────────┐│
│  │ 🎙 "How many hours?"    ││
│  │ Listening... / Speaking  ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

1. Dialog opens → AI says "G'day, is the job finished or are you coming back?"
2. User says "finished" → AI selects "Job Finished", auto-advances to next step
3. AI says "Any checklists to do?" → User says "no skip it" → AI advances
4. AI says "What did you do on this job?" → User dictates → text fills into the job sheet field
5. AI says "How many hours?" → User says "6" → fills the hours input, advances
6. AI says "Did you use the Rinnai unit, valves, and copper pipe?" → User says "yep" → confirms parts
7. AI says "Got any photos?" → User says "yeah one sec" → taps camera
8. AI says "Any compliance certs?" → User says "no" → skips, advances
9. AI reads summary, user says "done" → submits

The user sees the actual form screens updating in real time as they speak — like autocomplete with voice.

### Technical approach

**File: `src/components/job/AICloseOutFlow.tsx`** — Complete rewrite

- Remove the chat UI entirely
- Import and reuse the same step structure/state from `JobCompletionFlow` (status, jobSheet, actualHours, parts, photos, compliance)
- Render the same step screens (same UI components) but with a voice bar at the bottom
- Add a `useVoiceAssistant` hook that:
  - Maintains a per-step script of what to say/ask
  - Uses `speechSynthesis` to read the question for the current step
  - Uses continuous `SpeechRecognition` to capture the answer
  - Sends the transcript + current step context to the edge function to interpret intent (e.g., "6 hours" → set hours to 6, "yep that's it" → confirm and advance)
  - The AI returns a structured JSON response: `{ action: "set_hours", value: 6, advance: true }` or `{ action: "confirm_parts", advance: true }`
- Bottom bar shows: mic status indicator (Listening.../Speaking...), mute toggle, manual keyboard fallback

**File: `supabase/functions/ai-closeout/index.ts`** — Change response format

- Instead of free-form conversation, the AI receives the current step + user speech and returns structured actions:
  ```json
  { "speak": "Got it, 6 hours. Moving on to parts.", "actions": [{"type": "set_hours", "value": 6}], "advance": true }
  ```
- System prompt tells it to interpret short answers ("yes", "no", "6", "skip", "nah") in context of the current step
- Much better at handling one-word answers because it knows exactly what question was asked

**Key differences from current approach:**
- No chat history needed — just current step + user's spoken answer
- No stale closure issues — simple step-based state machine
- One-word answers work because the AI knows the context (which step/field)
- User sees familiar screens filling in, not a chat thread
- TTS reads short prompts per step, not long paragraphs

### Steps to implement

1. Rewrite `AICloseOutFlow.tsx` — same step screens as `JobCompletionFlow` but with voice overlay bar
2. Update edge function — return structured JSON actions instead of conversational text
3. Wire voice loop: TTS speaks step question → mic captures answer → edge function interprets → fill field + advance

