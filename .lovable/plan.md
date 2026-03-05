

## AI Close-Out: Open Mic + Text-to-Speech

Two changes needed: continuous listening (open mic conversation) and AI speaking its responses aloud.

### 1. Continuous Speech Recognition

Change `useSpeechRecognition` hook:
- Set `recognition.continuous = true` and `recognition.interimResults = true` so the mic stays open
- Auto-start listening when the dialog opens and the AI finishes speaking
- Auto-pause listening while the AI is responding (to avoid picking up its own voice)
- Re-start listening automatically after the AI finishes speaking
- Use VAD-like behavior: when a final result comes in, send it as a message, then keep listening
- The mic button becomes a mute/unmute toggle rather than push-to-talk
- Show a persistent "Listening..." indicator with a pulsing mic icon at the bottom

### 2. Text-to-Speech (Browser SpeechSynthesis API)

Use the browser's built-in `window.speechSynthesis` API (free, no API key needed, works on all modern browsers/mobile):
- When the AI finishes streaming a response, speak it aloud using `SpeechSynthesisUtterance`
- Pause speech recognition while speaking to prevent feedback loop
- Resume listening after speech finishes (`utterance.onend`)
- Keep responses short (the system prompt already enforces this)
- Add a mute/speaker button to toggle TTS on/off

### 3. Flow Changes in `AICloseOutFlow.tsx`

- On dialog open → start continuous recognition immediately
- AI response streams in → once complete, speak it via `speechSynthesis`
- While speaking → pause recognition
- Speech done → resume recognition
- User says something → recognition captures it → auto-sends as message → AI responds → cycle continues
- Mic button becomes a mute toggle (red = muted, green = actively listening)
- Remove the text input area — make it a small collapsed fallback with a keyboard icon
- Bottom bar shows: large mic indicator (pulsing when listening), mute button, camera button, speaker toggle

### Files to Change

1. **`src/components/job/AICloseOutFlow.tsx`** — Rewrite speech recognition to continuous mode, add `speechSynthesis` TTS after AI responses, redesign bottom bar to show open-mic state, collapse text input behind a keyboard toggle
2. **`supabase/functions/ai-closeout/index.ts`** — Add instruction to system prompt: "Keep responses very short and conversational since they will be read aloud"

