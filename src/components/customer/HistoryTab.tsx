import { Clock, Mail, MessageSquare } from "lucide-react";
import type { Customer } from "@/data/dummyCustomers";

interface HistoryTabProps {
  customer: Customer;
}

interface TimelineEntry {
  date: string;
  label: string;
  type: "job" | "quote" | "invoice" | "note" | "contact" | "email-sent" | "email-received" | "sms-sent" | "sms-received";
}

export function HistoryTab({ customer }: HistoryTabProps) {
  const entries: TimelineEntry[] = [];

  // Job events
  customer.jobHistory.forEach((j) => {
    entries.push({ date: j.date, label: `Job created: ${j.name} (${j.id})`, type: "job" });
    if (j.stage.includes("Quote")) entries.push({ date: j.date, label: `Quote sent for ${j.name}`, type: "quote" });
    if (j.stage.includes("Invoice") || j.stage.includes("Paid")) entries.push({ date: j.date, label: `Invoice ${j.stage.includes("Paid") ? "paid" : "raised"}: $${j.value.toLocaleString()} — ${j.name}`, type: "invoice" });
  });

  // Communication events (dummy)
  entries.push({ date: "2026-02-20", label: "Email sent: Your quote from Spark Electrical is ready", type: "email-sent" });
  entries.push({ date: "2026-02-20", label: "SMS sent: Hi Sarah, your quote for $4,200 is ready", type: "sms-sent" });
  entries.push({ date: "2026-02-20", label: "SMS received: Thanks! Will have a look tonight 👍", type: "sms-received" });
  entries.push({ date: "2026-02-23", label: "Email sent: Following up on your quote", type: "email-sent" });
  entries.push({ date: "2026-02-25", label: "SMS sent: Just following up on the quote we sent", type: "sms-sent" });
  entries.push({ date: "2026-02-25", label: "SMS received: Hey, looks good! Can you start next week?", type: "sms-received" });
  entries.push({ date: "2026-02-25", label: "Email received: Yep all good to go ahead. Can you confirm a start date?", type: "email-received" });
  entries.push({ date: "2026-02-26", label: "SMS sent: We'll schedule you in for Monday!", type: "sms-sent" });

  // Contact events
  customer.contacts.forEach((c) => {
    entries.push({ date: "2025-01-01", label: `Contact added: ${c.name} (${c.role})`, type: "contact" });
  });

  entries.sort((a, b) => b.date.localeCompare(a.date));

  const typeConfig: Record<string, { color: string; icon?: React.ElementType }> = {
    job: { color: "bg-primary/20 text-primary" },
    quote: { color: "bg-[hsl(var(--status-orange))]/20 text-[hsl(var(--status-orange))]" },
    invoice: { color: "bg-[hsl(var(--status-green))]/20 text-[hsl(var(--status-green))]" },
    note: { color: "bg-accent text-accent-foreground" },
    contact: { color: "bg-muted text-muted-foreground" },
    "email-sent": { color: "bg-[hsl(var(--status-orange))]/20 text-[hsl(var(--status-orange))]", icon: Mail },
    "email-received": { color: "bg-[hsl(var(--status-green))]/20 text-[hsl(var(--status-green))]", icon: Mail },
    "sms-sent": { color: "bg-primary/20 text-primary", icon: MessageSquare },
    "sms-received": { color: "bg-[hsl(var(--status-green))]/20 text-[hsl(var(--status-green))]", icon: MessageSquare },
  };

  const typeLabel: Record<string, string> = {
    job: "job",
    quote: "quote",
    invoice: "invoice",
    note: "note",
    contact: "contact",
    "email-sent": "email ↗",
    "email-received": "email ↙",
    "sms-sent": "sms ↗",
    "sms-received": "sms ↙",
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-card-foreground">History</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No history yet</p>
      ) : (
        <div className="relative pl-6 border-l-2 border-border space-y-3">
          {entries.map((e, i) => {
            const cfg = typeConfig[e.type] || typeConfig.note;
            const Icon = cfg.icon;
            return (
              <div key={i} className="relative">
                <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-border" />
                <div className="p-3 rounded-lg bg-card border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    {Icon && <Icon className="w-3 h-3" />}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.color}`}>{typeLabel[e.type]}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{e.date}</span>
                  </div>
                  <p className="text-sm text-card-foreground">{e.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
