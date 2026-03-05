

## Plan: Hybrid Local Parser + Faster Speech Recognition

The review is spot-on. The biggest wins come from two changes:

### 1. Local parser for simple steps — skip the LLM entirely

For `status`, `time`, `parts` (confirm), `photos`, and `compliance`, the answers are predictable: yes/no/number/skip. Parse these locally with simple regex/keyword matching. Only call the LLM for `jobsheet` (free-text dictation) and ambiguous `parts` additions.

This eliminates network latency on 5 of 6 steps — the flow will feel near-instant.

**Local parsing rules:**
- **status**: "yes/yep/done/finished/all done" → finished. "no/nah/coming back/not yet" → coming_back
- **time**: Extract number from transcript (regex `\d+\.?\d*`). "half a day" → 4, "couple" → 2
- **parts**: "yes/yep/all good/that's it" → confirm. Otherwise fall through to LLM
- **photos**: "no/nah/skip" → skip + advance. "yes/yeah" → wait
- **compliance**: "no/nah/none" → false + advance. "yes" → true, stay

### 2. Faster silence timeout — 800ms instead of 1500ms

Drop from 1500ms to 800ms. One-word answers like "no" will commit in under a second instead of 1.5s.

### 3. Speed up TTS to 1.3x

The user originally asked for 1.3x, current is 1.2x.

### Files to change

**`src/components/job/AICloseOutFlow.tsx`:**
- Add `tryLocalParse(stepId, transcript)` function that returns `{ speak, actions, advance }` or `null`
- In `handleSpeech`: call `tryLocalParse` first; if it returns a result, apply actions + advance immediately without calling the edge function
- Only call `callAI()` if local parse returns `null`
- Change silence timeout: `1500` → `800`
- Change TTS rate: `1.2` → `1.3`

No edge function changes needed — it remains as fallback for ambiguous cases.

