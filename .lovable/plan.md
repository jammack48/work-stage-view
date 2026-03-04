

## Problem

The splash page is skipped because `localStorage` key `tradie-splash-seen` persists across sessions. Once set, the app jumps straight to ModePicker (or the main app if a mode is also saved). The user wants the splash to **always** appear on every app open.

## Fix

### 1. `src/App.tsx` — Remove localStorage persistence for splash

Change `splashDismissed` from a localStorage-backed `useState` to a simple `useState(false)`. Remove the `localStorage.setItem("tradie-splash-seen", "1")` call from the `onStart` handler. This way, every fresh page load shows the splash first, regardless of prior visits.

The flow becomes:
- App opens → Splash always shows
- "Start Demo" → if `mode` is already saved in localStorage, go straight to the app; if not, show ModePicker

```tsx
const [splashDismissed, setSplashDismissed] = useState(false);

if (!splashDismissed) {
  return <SplashPage onStart={() => setSplashDismissed(true)} />;
}

if (!mode) {
  return <ModePicker />;
}
```

Note: the splash gate moves **above** the mode check so it always shows first, even if a mode is already saved.

### 2. `src/components/AppHeader.tsx` — Enhance reset control

The existing "Switch Role" button already calls `clearMode()`. This is sufficient as a visible reset control. No additional changes needed here — it already lets testers return to the role picker. On next reload they'll see the splash again too.

### Files changed
- `src/App.tsx` — 3 lines changed (remove localStorage read/write, simplify useState, move splash check above mode check)

