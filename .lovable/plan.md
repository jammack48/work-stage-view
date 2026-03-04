

## Simplified Onboarding Flow

### Current flow (broken)
Splash (marketing page) → ModePicker (3 roles + overlay) — too many steps, splash feels like an ad.

### New flow
**Step 1: Welcome page** — Personal, casual intro from Jamie. Not a marketing page. Explains: "Hey, I'm building a job management app for tradies. It's in beta, all data is fake, you can't break anything, play with everything, all feedback welcome." One button: "Start Demo".

**Step 2: Role picker** — Two buttons only:
- **Manager / Owner** → sub-choice: "Run the Office" (manage mode) or "On the Tools" (sole-trader setup)
- **Employee** → straight into work mode

No tutorial overlay. The sub-choice for Manager explains the difference inline.

### File changes

**`src/pages/SplashPage.tsx`** — Complete rewrite. Strip all the marketing sections (phone mock, pain points, feature snapshots, automation hook). Replace with a simple, personal welcome:
- Wrench icon + "Tradie Toolbelt"
- "Hey! I'm Jamie." personal greeting
- Short paragraph: what this is (job management for tradies, one-man bands to small companies, run business from phone), it's beta, all dummy data, can't break anything, please give feedback
- Single "Start Demo" button

**`src/components/ModePicker.tsx`** — Simplify to two primary buttons:
- "Manager / Owner" — on click, shows inline sub-choice between "Run the Office" and "Owner on the Tools" (which then goes to sole-trader-setup)
- "Employee" — goes straight to work mode
- Remove the tutorial overlay entirely — the two-button choice is self-explanatory
- Keep the sole-trader-setup sub-step as-is

