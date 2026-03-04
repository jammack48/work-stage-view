

## Redesigned Landing Page

These are excellent suggestions. The core insight is right: the current page is too text-heavy. Tradies trust screenshots, not bullet lists. The structure should follow a proven SaaS pattern: show the product immediately, create emotional contrast with pain points, then close with a CTA.

### Structure (top to bottom)

1. **Hero** — Punchy headline ("Run your trade business without the paperwork"), pipeline flow sub-line (Leads → Quotes → Jobs → Invoices → Paid), "Start Demo" button, and a **mock phone frame** showing a miniature rendered pipeline dashboard (not an image file — we'll build a simplified SVG/HTML mock of the stage columns inline so it looks like a real app screenshot without needing actual image assets).

2. **Problem** — "Does this sound familiar?" with 4 tight pain points (quotes never followed up, jobs on scraps of paper, chasing invoices after hours, losing jobs because you're too busy). Shorter than current — 4 items, not 6.

3. **Solution** — "Everything in one place." with 5 short bullets (Capture leads, Quote on site, Schedule jobs, Track staff time, Send invoices). Clean, minimal.

4. **3 Feature Snapshots** — Three cards only, each with a title, one-liner, and a small inline mock visual:
   - "Quotes in seconds" — mini quote card mock
   - "See every job" — mini pipeline columns mock
   - "Get paid faster" — mini invoice card mock

5. **Automation Hook** — "The app that chases customers for you." with sub-line about automatic follow-ups. Small inline mock of the sequence builder steps.

6. **Beta Notice + Close CTA** — "One app. From first enquiry to final payment." + beta disclaimer + "Start Demo" button.

### Technical approach

- **Single file change**: Rewrite `src/pages/SplashPage.tsx`
- **No image assets needed**: Build small inline mock components (styled divs that look like miniature app screenshots — pipeline columns, a quote card, an invoice card, sequence steps). These are simple colored blocks/text that visually represent the UI.
- **Phone frame component**: A simple rounded-rect border with a notch that wraps the pipeline mock, giving the "app on a phone" feel.
- **Responsive**: Single column mobile, wider on desktop. Hero phone mock scales down gracefully.
- **Same props interface** (`onStart` callback), no changes to `App.tsx`.

### What we're NOT doing
- No actual screenshot images (we don't have image hosting)
- No stock photos
- No animations/framer-motion (keep it fast and simple)

