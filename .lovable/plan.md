

## Make Tutorial Banners Tab-Aware with Deep Benefit Explanations

### Problem
The tutorial banner only changes based on route (e.g. `/customer/1` always shows "Customer Details"). When a user clicks the Messages tab, the banner still says "Customer Details" — it should explain what the Messages tab does and WHY it's valuable.

### Approach
1. **Add tab-specific tutorial entries** to `tutorialContent.ts` — keyed like `customer-card:messages`, `customer-card:overview`, `job:overview`, `job:materials`, etc. Each entry written in plain tradie language explaining the benefit, not just what it does.

2. **Update `TutorialBanner`** to accept an optional `tabKey` prop and compose the lookup key as `${routeKey}:${tabKey}` when a tab is active, falling back to the route-level entry.

3. **Update `PageToolbar`** to pass the current `activeTab` to `TutorialBanner`.

4. **Rewrite ALL existing page-level entries** to be more benefit-focused — explain WHY, not just WHAT.

### New Tutorial Content (examples of tone)

**Customer Card tabs:**
- `customer-card:overview` — "Everything about this customer at a glance — contact details, how much they owe you, open quotes, and quick actions. No more flicking through spreadsheets or digging through emails. One tap and you know exactly where you stand."
- `customer-card:messages` — "Every SMS and email between you and this customer, in one thread. You can see what your automated sequences sent, what they replied, and fire off a new message without leaving the app. No more 'did we follow that up?' — it's all right here."
- `customer-card:jobs` — "Every job you've done or quoted for this customer. Tap any job to jump straight into it. This is how you spot repeat customers and know their full history before you pick up the phone."
- `customer-card:spend` — "See exactly how much this customer has spent with you, what's outstanding, and where the money sits across your pipeline. This is gold when deciding whether to offer a discount or chase harder."
- `customer-card:quotes` — "All quotes for this customer in one place. See which ones are pending, accepted, or expired. No more guessing which version you sent."
- `customer-card:invoices` — "Track every invoice — paid, unpaid, overdue. Know instantly if this customer owes you money without opening your accounting software."

**Job Card tabs:**
- `job:overview` — "The full picture of this job — customer details, address, value, status, and what stage it's at. Think of it as the front page of the job file. Everything you need before you pick up the phone or head to site."
- `job:messages` — "Every message sent to or received from the customer about THIS job. Your automated follow-ups show here too, so you can see exactly what's been sent and when they last replied."
- `job:materials` — "Log every material you use on this job. When it comes time to invoice, you'll know exactly what you spent. No more guessing margins or forgetting that extra bag of cement."
- `job:photos` — "Snap before, during, and after photos. Attached to the job forever. Protects you from disputes and makes your quotes look professional when you show past work."
- `job:time` — "Track hours worked on this job by you and your team. Essential for knowing if a job made money or not. Also handy if you charge by the hour."
- `job:notes` — "Jot down anything — site access codes, customer preferences, what was discussed on the phone. Your future self will thank you when you come back to this job in 3 months."
- `job:forms` — "Digital job forms — site assessments, safety checklists, sign-offs. No more paper forms getting lost in the ute."
- `job:invoice` — "Create or view the invoice for this job. Once you send it, the follow-up sequence kicks in and chases payment for you automatically."
- `job:quote` — "View or edit the quote attached to this job. See exactly what you promised the customer and at what price."
- `job:history` — "A timeline of everything that's happened on this job — when it was created, quoted, messages sent, status changes. Your paper trail if anything goes sideways."
- `job:sequences` — "Automated follow-up sequences attached to this job. These send emails and SMS on a schedule so you don't have to remember to chase. Set it and forget it."

**Page-level rewrites (benefit-focused):**
- `pipeline` — "This is your money map. Every job you're working on, from the first phone call to getting paid, laid out in stages. Swipe through to see what needs attention. Cards glow when a customer has replied. The colour tells you how old each job is — green is fresh, orange is getting stale, red means you're losing money by not acting."
- `customers` — "Your entire customer database. Every person you've ever quoted or done work for. Tap a name to see their full history — every job, every message, every dollar. Filter by leads, active, or archived. This is your CRM without the jargon."
- `schedule` — "Your crew's diary. See who's booked where and when. Each coloured block is a job assigned to someone. Spot gaps, avoid double-bookings, and know at a glance if tomorrow's sorted or a mess."
- `settings` — "Set up your business once and forget about it. Company name, team members, notification preferences, billing. Come back here when you hire someone new or want to change how alerts work."
- `hub` — "Your command centre. Every tool in the app, one tap away. Think of it as your toolbox — jobs, customers, quotes, invoices, schedule, templates. Everything starts here."

**Other pages similarly rewritten with benefits.**

### Files to modify
- `src/data/tutorialContent.ts` — add ~40 tab-specific entries, rewrite all page-level entries
- `src/components/TutorialBanner.tsx` — accept `tabKey` prop, compose lookup
- `src/components/PageToolbar.tsx` — pass `activeTab` to `TutorialBanner`

