

## Tutorial Mode

### New files

**1. `src/contexts/TutorialContext.tsx`** — Context with `tutorialOn` boolean + `setTutorialOn` toggle, persisted to localStorage. Wrap in App.tsx alongside other providers.

**2. `src/data/tutorialContent.ts`** — A map of route/page keys to tutorial messages written in plain tradie language. Each entry has a `title` and `body`. Examples:

- **pipeline**: "Your Sales Pipeline" / "This is where all your jobs live — from first enquiry to getting paid. Swipe left and right to see each stage. Tap a card to open that job."
- **manager**: "Manager Mode" / "Morning triage. Pick a stage up top, filter by how old jobs are (red = needs attention now). Swipe through each job and take action — send a quote, chase up, archive the dead ones."
- **job**: "Job Card" / "Everything about this job in one spot. Use the tabs on the left to check the quote, log materials, add photos, track time. Tap any tab to jump straight there."
- **quote**: "Quote Builder" / "Build your quote step by step. Add line items, attach a follow-up sequence so it chases the customer for you. Hit send when you're happy."
- **invoice**: "Invoice" / "Create and send your invoice. Add line items, set payment terms. The follow-up sequence will chase payment automatically."
- **customers**: "Your Customers" / "Everyone you've ever quoted or done work for. Tap a name to see their full history — jobs, quotes, invoices, photos, the lot."
- **customer-card**: "Customer Details" / "This customer's complete file. See what you've quoted, what jobs are on, total spend. Use the tabs to dig into specifics."
- **schedule**: "Your Schedule" / "See who's doing what and when. Tap a day to see the full rundown. Each coloured block is a job assigned to a team member."
- **bundles**: "Quote Bundles" / "Pre-built packages you can drop into quotes. Set one up once — materials, labour, margin — then reuse it every time."
- **email-templates**: "Email Templates" / "Build the emails that go out automatically — quote follow-ups, invoice reminders, review requests. Edit the words, set the timing."
- **sms-templates**: "SMS Templates" / "Same as email but for text messages. Short, punchy messages that chase customers for you."
- **settings**: "Settings" / "Business details, team members, notifications, billing. Set it up once and forget about it."
- **hub**: "Home" / "Your launchpad. Jump to any part of the app from here."

Plus a `sidebarTooltips` map for toolbar icon tooltips (desktop hover):
- Home: "Back to your pipeline"
- Manager: "Triage jobs by priority"
- Bundles: "Pre-built quote packages"
- Email Tpl: "Build auto-email templates"
- SMS Tpl: "Build auto-SMS templates"
- etc.

**3. `src/components/TutorialBanner.tsx`** — A dismissible banner/toast component:
- Takes current route, looks up tutorial content
- Renders a compact card (rounded, bg-primary/10, border-primary/30) with title bold, body text, and an "✕ Got it" close button
- Only shows when `tutorialOn` is true
- Shows once per page visit (track dismissed pages in session state so it doesn't re-show on every render, but does show again if you navigate away and back)
- Positioned at top of the content area (inside `<main>` in PageToolbar), not blocking navigation

### Changes to existing files

**4. `src/components/AppHeader.tsx`** — Add a small toggle button (GraduationCap icon or HelpCircle) next to ThemePicker. Shows "Tutorial" label on desktop, icon-only on mobile. Toggles `tutorialOn` from context. Visually indicates on/off state (highlighted when on).

**5. `src/App.tsx`** — Wrap with `TutorialProvider`.

**6. `src/components/PageToolbar.tsx`** — Import `TutorialBanner` and render it at the top of the `<main>` content area (just before `{children}`), passing the current page context. On desktop, wrap each sidebar button in a `<Tooltip>` that shows the tradie-language description from `sidebarTooltips` on hover.

**7. Each page file** — No changes needed. The `TutorialBanner` inside `PageToolbar` will use route matching to determine which tutorial to show. We'll use `useLocation().pathname` to map routes to tutorial keys.

### Behaviour summary
- Toggle in header: on/off, persisted to localStorage
- When on: each page shows a friendly banner at top of content with plain-English explanation
- Desktop: hovering sidebar/toolbar buttons shows tooltip with what each button does
- Mobile: no hover tooltips (touch devices), but the page banner covers it
- Closing the banner dismisses it for that page during the session
- Navigating to a new page shows the new page's tutorial banner

