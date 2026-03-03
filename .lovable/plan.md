

## Splash / Landing Page for Beta Testers

### What we're building

A new `SplashPage.tsx` that appears before the `ModePicker` when no mode is set. It's a marketing-style landing page that:

1. **Hero section**: "Tradie Toolbelt" branding with tagline "Run your entire business from your phone." Big bold headline, beta badge.

2. **Pain points section**: Conversational questions — "Too slow getting back to enquiries?", "Struggling to keep up with customer follow-ups?", "Missing jobs because you're too busy working?", "Manually tracking time sheets?", "Quiet periods with no leads coming in?" — presented as a checklist or card grid the user can relate to.

3. **Solution section**: Brief explanation — "One app. From first lead to final payment." with feature highlights: Lead generation & automated follow-ups, Draft quoting on-site, Job sheets & scheduling, Time management & staff tracking, Purchase ordering, Invoicing & payments. Works for one-man bands through to large companies. "As simple or as complicated as you want."

4. **Beta notice banner**: Prominent but friendly — "This is a beta demo. All data is fake. You can't break anything. The goal is to test the interface and give feedback. All feedback is hugely appreciated."

5. **CTA button**: "Start Demo" → navigates to the existing `ModePicker` flow.

### Technical approach

- **New file**: `src/pages/SplashPage.tsx` — self-contained, responsive, mobile-first
- **New state**: Add a `showSplash` boolean (localStorage-backed) to `AppModeContext` or handle in `AppLayout`
- **Modify `src/App.tsx`**: In `AppLayout`, when `mode === null`, check if splash has been seen. If not, show `SplashPage`; if dismissed, show `ModePicker`.
- The splash page sets a localStorage flag and transitions to `ModePicker` on CTA click
- No AppHeader shown on splash page (same as ModePicker)
- Fully responsive: single column on mobile, wider layout on desktop
- Uses existing design system (Card, Button, Badge components, Tailwind)

