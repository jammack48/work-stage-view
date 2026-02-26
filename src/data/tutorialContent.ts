export interface TutorialEntry {
  title: string;
  body: string;
}

/** Route-based tutorial content — plain tradie language */
export const tutorialPages: Record<string, TutorialEntry> = {
  pipeline: {
    title: "Your Sales Pipeline",
    body: "This is where all your jobs live — from first enquiry to getting paid. Swipe left and right to see each stage. Tap a card to open that job.",
  },
  manager: {
    title: "Manager Mode — Your Command Centre",
    body: "This is the most powerful screen in the app. Run your entire business from right here — see every outstanding job across all stages, spot overdue tasks instantly (red = way overdue, orange = getting there), and take action without leaving the screen. Send quotes, chase customers, archive dead leads, mark jobs paid — all from one place. No more jumping between screens. This is how you stay on top of everything.",
  },
  job: {
    title: "Job Card",
    body: "Everything about this job in one spot. Use the tabs on the left to check the quote, log materials, add photos, track time. Tap any tab to jump straight there.",
  },
  quote: {
    title: "Quote Builder",
    body: "Build your quote step by step. Add line items, attach a follow-up sequence so it chases the customer for you. Hit send when you're happy.",
  },
  invoice: {
    title: "Invoice",
    body: "Create and send your invoice. Add line items, set payment terms. The follow-up sequence will chase payment automatically.",
  },
  customers: {
    title: "Your Customers",
    body: "Everyone you've ever quoted or done work for. Tap a name to see their full history — jobs, quotes, invoices, photos, the lot.",
  },
  "customer-card": {
    title: "Customer Details",
    body: "This customer's complete file. See what you've quoted, what jobs are on, total spend. Use the tabs to dig into specifics.",
  },
  schedule: {
    title: "Your Schedule",
    body: "See who's doing what and when. Tap a day to see the full rundown. Each coloured block is a job assigned to a team member.",
  },
  bundles: {
    title: "Quote Bundles",
    body: "Pre-built packages you can drop into quotes. Set one up once — materials, labour, margin — then reuse it every time.",
  },
  "email-templates": {
    title: "Email Templates",
    body: "Set up the email templates that get used in your quote and invoice follow-up sequences. Write the words once, then attach them to a sequence so they send automatically at the right time.",
  },
  "sms-templates": {
    title: "SMS Templates",
    body: "Build text message templates to use in your quote and invoice sequences. Write a short punchy message here, then plug it into a sequence so it fires off automatically when you need it to.",
  },
  settings: {
    title: "Settings",
    body: "Business details, team members, notifications, billing. Set it up once and forget about it.",
  },
  hub: {
    title: "Home",
    body: "Your launchpad. Jump to any part of the app from here.",
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
