

## Plan: Customer Card Communication Overhaul

### What's changing

The Customer Card needs three upgrades:
1. **Replace generic Communication Summary** with channel-specific stats (SMS icon + count, Email icon + count, last contact per channel)
2. **Add Messages tab** to Customer Card (reuse the MessagesTab pattern from Job Card) so you can read/reply to emails and SMS directly
3. **Upgrade History tab** to include communication events (email sent, SMS delivered, reply received) not just notes and job events

### Files to modify

**`src/config/toolbarTabs.ts`**
- Add `messages` tab (Mail icon) to `CUSTOMER_CARD_EXTRAS` — position it after Overview

**`src/pages/CustomerCard.tsx`**
- Add `"messages"` to `CustTab` type
- Replace the Communication Summary card in overview: show two side-by-side channel cards (SMS with MessageSquare icon, Email with Mail icon) each showing sent/received/last contact
- Import and wire `MessagesTab` for the messages tab content
- Keep overview financial stats (open quotes, outstanding) but restructure layout

**`src/components/customer/HistoryTab.tsx`**
- Add communication event types: `"email-sent"`, `"email-received"`, `"sms-sent"`, `"sms-received"`
- Generate dummy comms history entries with proper icons and labels like "Email sent: Your quote is ready", "SMS received: Thanks will check tonight"
- Add channel icons (Mail/MessageSquare) to timeline entries alongside the type badge

**`src/data/dummyMessages.ts`**
- No changes needed — the existing dummy messages data can be reused for both Job and Customer message views

### Overview tab new layout
- Two channel summary cards side by side: SMS (bubble icon, "8 sent · 3 received · Last: 1 day ago") and Email (mail icon, "6 sent · 2 received · Last: 2 days ago")
- Below: financial summary row (Open Quotes, Outstanding balance)
- Below: quick actions (existing)

