export interface TutorialEntry {
  title: string;
  body: string;
}

/** Route-based AND tab-specific tutorial content — plain tradie language, benefit-focused */
export const tutorialPages: Record<string, TutorialEntry> = {
  // ── Pipeline ──
  pipeline: {
    title: "Your Money Map",
    body: "Every job you're working on, from the first phone call to getting paid, laid out in stages. Swipe through to see what needs attention. Cards glow when a customer has replied. The colour tells you how old each job is — green is fresh, orange is getting stale, red means you're losing money by not acting.",
  },

  // ── Manager Mode ──
  manager: {
    title: "Manager Mode — Run Your Business From Here",
    body: "This is the most powerful screen in the app. See every outstanding job across all stages, spot overdue tasks instantly (red = way overdue, orange = getting there), and take action without leaving the screen. Send quotes, chase customers, archive dead leads, mark jobs paid — all from one place. No more jumping between screens.",
  },

  // ── Hub ──
  hub: {
    title: "Your Command Centre",
    body: "Every tool in the app, one tap away. Think of it as your toolbox — jobs, customers, quotes, invoices, schedule, templates. Everything starts here. If you're ever lost, come back to this screen.",
  },

  // ── Customers ──
  customers: {
    title: "Your Customer Database",
    body: "Every person you've ever quoted or done work for. Tap a name to see their full history — every job, every message, every dollar. Filter by leads, active, or archived. This is your CRM without the jargon.",
  },

  // ── Customer Card (page-level fallback) ──
  "customer-card": {
    title: "Customer File",
    body: "This customer's complete file. See what you've quoted, what jobs are on, total spend. Use the tabs to dig into specifics — messages, jobs, invoices, the lot.",
  },
  "customer-card:overview": {
    title: "Customer Overview",
    body: "Everything about this customer at a glance — contact details, how much they owe you, open quotes, and quick actions. No more flicking through spreadsheets or digging through emails. One tap and you know exactly where you stand.",
  },
  "customer-card:messages": {
    title: "Customer Messages",
    body: "Every SMS and email between you and this customer, in one thread. You can see what your automated sequences sent, what they replied, and fire off a new message without leaving the app. No more 'did we follow that up?' — it's all right here.",
  },
  "customer-card:jobs": {
    title: "Customer Jobs",
    body: "Every job you've done or quoted for this customer. Tap any job to jump straight into it. This is how you spot repeat customers and know their full history before you pick up the phone.",
  },
  "customer-card:spend": {
    title: "Customer Spend",
    body: "See exactly how much this customer has spent with you, what's outstanding, and where the money sits across your pipeline. This is gold when deciding whether to offer a discount or chase harder.",
  },
  "customer-card:quotes": {
    title: "Customer Quotes",
    body: "All quotes for this customer in one place. See which ones are pending, accepted, or expired. No more guessing which version you sent — it's all tracked right here.",
  },
  "customer-card:invoices": {
    title: "Customer Invoices",
    body: "Track every invoice — paid, unpaid, overdue. Know instantly if this customer owes you money without opening your accounting software. Chase with one tap.",
  },
  "customer-card:history": {
    title: "Customer History",
    body: "A complete timeline of every interaction with this customer — when they first enquired, what you quoted, when they paid. Your paper trail if anything goes sideways.",
  },
  "customer-card:photos": {
    title: "Customer Photos",
    body: "Every photo from every job you've done for this customer. Handy for showing past work when quoting a new job, or if there's ever a dispute about what was done.",
  },
  "customer-card:documents": {
    title: "Customer Documents",
    body: "Contracts, plans, permits, specs — anything this customer has sent you or you've uploaded. All in one spot instead of buried in your email or lost on the ute seat.",
  },

  // ── Job Card — Manager (page-level fallback) ──
  job: {
    title: "Job File",
    body: "Everything about this job in one spot. Use the tabs to check the quote, log materials, add photos, track time. Tap any tab to jump straight there.",
  },

  // ── Work Job Card — Staff (page-level fallback) ──
  "work-job": {
    title: "Your Job Card",
    body: "Everything you need for this job on site. Check the scope to see what needs doing, log your time, add materials you've used, snap photos, and fill out any forms. When you're done, hit 'Finished Job' to walk through the completion checklist — it'll sort out your paperwork in 2 minutes.",
  },
  "work-job:overview": {
    title: "Job Overview",
    body: "The key details for this job — customer, address, what stage it's at. Check this before you head to site so you know what you're walking into. Tap the address to open maps.",
  },
  "work-job:scope": {
    title: "Scope of Work",
    body: "What the boss quoted and what the customer expects. Read this before you start so there's no surprises. If something doesn't match what's on site, flag it in the notes tab.",
  },
  "work-job:time": {
    title: "Log Your Time",
    body: "Track hours on this job. Start when you arrive, stop when you leave. This feeds into job costing so the boss knows if jobs are profitable — and it keeps your timesheets accurate without the paper hassle.",
  },
  "work-job:materials": {
    title: "Materials Used",
    body: "Log everything you use on this job. Van stock gets flagged for automatic restocking. Supplier pickups — snap the receipt so there's a record. No more lost dockets or forgotten charges.",
  },
  "work-job:notes": {
    title: "Job Notes",
    body: "Write down anything useful — site access codes, what the customer said, issues you've found. Your future self (or the next tradie on site) will thank you. Notes stay attached to the job forever.",
  },
  "work-job:photos": {
    title: "Job Photos",
    body: "Snap before and after photos. These protect everyone — if a customer says 'that scratch was never there', you've got proof. Also handy for the boss to see progress without driving to site.",
  },
  "work-job:forms": {
    title: "Job Forms",
    body: "Digital checklists and sign-offs. Safety assessments, compliance forms, customer sign-off — fill them out on site. No more forgetting paperwork in the ute or losing forms between jobs.",
  },
  "job:overview": {
    title: "Job Overview",
    body: "The full picture of this job — customer details, address, value, status, and what stage it's at. Think of it as the front page of the job file. Everything you need before you pick up the phone or head to site.",
  },
  "job:messages": {
    title: "Job Messages",
    body: "Every message sent to or received from the customer about THIS job. Your automated follow-ups show here too, so you can see exactly what's been sent and when they last replied. No more 'did we chase that?' — check right here.",
  },
  "job:materials": {
    title: "Job Materials",
    body: "Log every material you use on this job. When it comes time to invoice, you'll know exactly what you spent. No more guessing margins or forgetting that extra bag of cement.",
  },
  "job:photos": {
    title: "Job Photos",
    body: "Snap before, during, and after photos. Attached to the job forever. Protects you from disputes and makes your quotes look professional when you show past work to new customers.",
  },
  "job:time": {
    title: "Time Tracking",
    body: "Track hours worked on this job by you and your team. Essential for knowing if a job made money or not. Also handy if you charge by the hour — no more 'how long were we there?'",
  },
  "job:notes": {
    title: "Job Notes",
    body: "Jot down anything — site access codes, customer preferences, what was discussed on the phone. Your future self will thank you when you come back to this job in 3 months and can't remember a thing.",
  },
  "job:forms": {
    title: "Job Forms",
    body: "Digital job forms — site assessments, safety checklists, sign-offs. No more paper forms getting lost in the ute. Fill them out on site, they're saved to the job forever.",
  },
  "job:invoice": {
    title: "Job Invoice",
    body: "Create or view the invoice for this job. Once you send it, the follow-up sequence kicks in and chases payment for you automatically. No more awkward 'just following up' texts — the app does it.",
  },
  "job:quote": {
    title: "Job Quote",
    body: "View or edit the quote attached to this job. See exactly what you promised the customer and at what price. Change it, re-send it, or mark it accepted — all from here.",
  },
  "job:history": {
    title: "Job History",
    body: "A timeline of everything that's happened on this job — when it was created, quoted, messages sent, status changes. Your paper trail if anything goes sideways or a customer says 'you never sent that'.",
  },
  "job:sequences": {
    title: "Follow-Up Sequences",
    body: "Automated follow-up sequences attached to this job. These send emails and SMS on a schedule so you don't have to remember to chase. Set it and forget it — the app nags them so you don't have to.",
  },

  // ── Quote ──
  quote: {
    title: "Quote Builder",
    body: "Build your quote step by step. Add line items, set your margin, attach a follow-up sequence so it chases the customer for you. Hit send when you're happy — then sit back while the app does the follow-up.",
  },
  "quote:overview": {
    title: "Quote Overview",
    body: "See the full quote at a glance — line items, totals, margin, status. Check everything's right before you send it. This is your last chance to catch mistakes before the customer sees it.",
  },
  "quote:sequences": {
    title: "Quote Follow-Up",
    body: "Attach an automated follow-up sequence to this quote. The app will send emails and texts on a schedule chasing the customer to accept. You write the quote once — the app does the hard yards of following up.",
  },

  // ── Invoice ──
  invoice: {
    title: "Invoice Builder",
    body: "Create and send your invoice. Add line items, set payment terms. Once sent, the follow-up sequence kicks in and chases payment automatically. No more awkward conversations — let the system handle it.",
  },

  // ── Schedule ──
  schedule: {
    title: "Your Crew's Diary",
    body: "See who's booked where and when. Each coloured block is a job assigned to someone. Spot gaps, avoid double-bookings, and know at a glance if tomorrow's sorted or a mess.",
  },

  // ── Bundles ──
  bundles: {
    title: "Quote Bundles",
    body: "Pre-built packages you can drop into quotes. Set one up once — materials, labour, margin — then reuse it every time. Saves you re-typing the same 15 line items on every bathroom reno quote.",
  },

  // ── Email Templates ──
  "email-templates": {
    title: "Email Templates",
    body: "Set up the email templates that get used in your quote and invoice follow-up sequences. Write the words once, then attach them to a sequence so they send automatically at the right time. Professional emails without lifting a finger.",
  },

  // ── SMS Templates ──
  "sms-templates": {
    title: "SMS Templates",
    body: "Build text message templates to use in your quote and invoice sequences. Write a short punchy message here, then plug it into a sequence so it fires off automatically. Customers reply straight to your phone.",
  },

  // ── Settings ──
  settings: {
    title: "Settings",
    body: "Set up your business once and forget about it. Company name, team members, notification preferences, billing. Come back here when you hire someone new or want to change how alerts work.",
  },
  "settings:business": {
    title: "Business Details",
    body: "Your company name, ABN, address, logo — the stuff that goes on your quotes and invoices. Set it up once and it flows through everything automatically.",
  },
  "settings:notifications": {
    title: "Notification Preferences",
    body: "Control what pings you and how. Turn off the noise you don't need, keep the alerts that matter — like when a customer replies or a payment lands.",
  },
  "settings:appearance": {
    title: "Look & Feel",
    body: "Pick your colours and layout. Make the app feel like yours. Dark mode for the night owls, light mode for the early risers.",
  },
  "settings:billing": {
    title: "Billing & Subscription",
    body: "Manage your plan, see what you're paying, update your card. No surprises — everything's laid out here.",
  },
  "settings:team": {
    title: "Your Team",
    body: "Add your crew, set permissions, see who's active. When you hire someone new, add them here and they'll show up in the schedule and can be assigned jobs.",
  },
  "settings:integrations": {
    title: "Integrations",
    body: "Connect your accounting software, calendar, payment gateway — whatever tools you already use. The app plays nice with others so you don't have to double-handle data.",
  },
};

/** Sidebar tooltip descriptions for desktop hover (keyed by tab id) */
export const sidebarTooltips: Record<string, string> = {
  pipeline: "Back to your pipeline",
  customers: "Your customer directory",
  schedule: "See who's doing what and when",
  manager: "Triage jobs by priority",
  bundles: "Pre-built quote packages",
  quotes: "Create a new quote",
  invoices: "Create a new invoice",
  email: "Build auto-email templates",
  sms: "Build auto-SMS templates",
  settings: "Business settings & config",
  back: "Go back",
  overview: "Job overview at a glance",
  "line-items": "Add or edit line items",
  sequences: "Auto follow-up sequences",
  notes: "Add notes to this record",
  history: "See what's happened so far",
  materials: "Log materials used",
  photos: "Attach photos",
  time: "Track time on the job",
  forms: "Fill out job forms",
  invoice: "View or create invoice",
  quote: "View or edit the quote",
  leads: "Fresh leads to follow up",
  active: "Currently active customers",
  archived: "Archived customers",
  jobs: "This customer's jobs",
  documents: "Uploaded documents",
  contacts: "Contact details",
  spend: "Total spend breakdown",
  "add-job": "Create a new job",
  business: "Your business details",
  notifications: "Notification preferences",
  appearance: "Colours and display",
  billing: "Subscription & billing",
  team: "Manage your team",
  integrations: "Connected apps & tools",
  reminders: "Reminder templates",
  services: "Service-related templates",
  reviews: "Review request templates",
  messages: "Messages with this customer",
  scope: "What's been quoted for this job",
  "finished-job": "Walk through the completion checklist",
};

/** Map pathname to tutorial key */
export function getTutorialKey(pathname: string): string | null {
  if (pathname === "/" || pathname === "/pipeline") return "pipeline";
  if (pathname === "/hub") return "hub";
  if (pathname === "/customers") return "customers";
  if (pathname.startsWith("/customer/")) return "customer-card";
  if (pathname.startsWith("/job/")) return "job";
  if (pathname.startsWith("/quote/")) return "quote";
  if (pathname.startsWith("/invoice/")) return "invoice";
  if (pathname === "/schedule") return "schedule";
  if (pathname === "/bundles") return "bundles";
  if (pathname === "/email-templates") return "email-templates";
  if (pathname === "/sms-templates") return "sms-templates";
  if (pathname === "/settings") return "settings";
  return null;
}
