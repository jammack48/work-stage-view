

## Fix: AI Close-Out Flow — Speech + Streaming Not Working

### Root Causes Identified

1. **Stale closure bug** — `handleSpeechResult` depends on `messages` state via `sendMessage`, but `sendMessage` captures `messages` from the render closure. When speech fires later, it has the old empty `messages` array, so every AI call sends only 1 message instead of the full history.

2. **Mic never starts on initial load** — When TTS is enabled (default), the `isInitial` code path calls `speech.resumeListening()` after TTS ends, but the mic was never `startListening()`'d first. `resumeListening` needs an existing recognition instance — it's null on first run.

3. **`onResultRef` gets stale callback** — `startListening` sets `onResultRef.current = onResult`, but that callback closes over stale `messages`. Subsequent speech results use the old closure.

4. **No debug visibility** — No console logs anywhere, so it's impossible to tell what's happening.

### Fix approach

Rewrite the component to use a **messages ref** pattern alongside the state, so `sendMessage` always has the latest conversation history regardless of when it's called from a speech callback.

**Key changes in `AICloseOutFlow.tsx`:**

- Add `messagesRef = useRef<Msg[]>([])` that mirrors `messages` state — updated on every `setMessages` call
- `sendMessage` reads from `messagesRef.current` instead of the `messages` closure
- On dialog open: send initial context, and after TTS finishes the first response, call `startListening()` (not `resumeListening`) to properly initialize the mic
- `handleSpeechResult` becomes stable (no `messages` dependency) since it just calls `sendMessage` which reads from the ref
- Add `console.log` breadcrumbs at: speech recognized, AI request sent, AI stream chunk received, AI done, TTS started, TTS ended, mic resumed
- Fix `resumeListening` to fall back to `startListening` if `recognitionRef.current` is null

### Files to change

1. **`src/components/job/AICloseOutFlow.tsx`** — Fix stale closures with messagesRef, fix initial mic startup, add debug logging

No edge function changes needed — the backend is working fine based on logs.

