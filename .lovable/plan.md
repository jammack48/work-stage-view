

## Email and SMS Template Management — Implementation Plan

### Overview

Add Email and SMS icons to the Pipeline sidebar. Each opens a dedicated template management page with 5 category tabs (Quotes, Invoices, Reminders, Services, Reviews). Templates are selectable from the Quote page and Settings page.

### New Files

**1. `src/data/dummyTemplates.ts`**

Template data model and ~20 pre-populated templates across both channels (email/sms) and all 5 categories. Each template has: `id`, `name`, `category`, `channel`, `subject` (email only), `body` (with `{{variable}}` placeholders like `{{customer_name}}`, `{{quote_total}}`), `timing`, `isActive`.

**2. `src/pages/EmailTemplatesPage.tsx`**

Full page using `PageToolbar` with `currentPage="email"` and tabs for Quotes, Invoices, Reminders, Services, Reviews. Each tab filters templates by `channel === "email"` and selected category. Shows template cards with name, subject, body preview, timing badge, active toggle. Has "+ New Template" button with inline editor (name, subject, body textarea with variable hints, timing dropdown).

**3. `src/pages/SmsTemplatesPage.tsx`**

Same structure as Email but `channel === "sms"`, no subject field, character count on body textarea. Uses `currentPage="sms"`.

### Modified Files

**4. `src/config/toolbarTabs.ts`**

- Import `Mail`, `MessageSquare` from lucide-react
- Add to `PIPELINE_EXTRAS` after Bundles: `{ id: "email", label: "Email", icon: Mail }`, `{ id: "sms", label: "SMS", icon: MessageSquare }`
- Add `EMAIL_EXTRAS` and `SMS_EXTRAS` arrays (both with: Quotes, Invoices, Reminders, Services, Reviews tabs)
- Add `email: "/email-templates"` and `sms: "/sms-templates"` to `handleCommonTab` routes

**5. `src/App.tsx`**

Add routes for `/email-templates` and `/sms-templates`.

**6. `src/pages/QuotePage.tsx`**

Add email/SMS template selector dropdowns (using `Select` component) in the completed quote line-items view, below the scope textarea.

**7. `src/pages/SettingsPage.tsx`**

Expand the notifications tab to include: Default Invoice Email Template selector, Default Invoice SMS Template selector, Overdue Reminder Schedule (7/14/30 day toggles), Review Request template selector with on/off toggle.

### Files Summary

| File | Action |
|------|--------|
| `src/data/dummyTemplates.ts` | Create |
| `src/pages/EmailTemplatesPage.tsx` | Create |
| `src/pages/SmsTemplatesPage.tsx` | Create |
| `src/config/toolbarTabs.ts` | Edit — add Email/SMS to pipeline extras, new tab arrays, new routes |
| `src/App.tsx` | Edit — add 2 routes |
| `src/pages/QuotePage.tsx` | Edit — add template selector dropdowns |
| `src/pages/SettingsPage.tsx` | Edit — add template defaults in notifications |

