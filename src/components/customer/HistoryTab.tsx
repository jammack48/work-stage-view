import { Clock } from "lucide-react";
import type { Customer } from "@/data/dummyCustomers";

interface HistoryTabProps {
  customer: Customer;
}

interface TimelineEntry {
  date: string;
  label: string;
  type: "job" | "quote" | "invoice" | "note" | "contact";
}

export function HistoryTab({ customer }: HistoryTabProps) {
  const entries: TimelineEntry[] = [];

  customer.jobHistory.forEach((j) => {
    entries.push({ date: j.date, label: `Job created: ${j.name} (${j.id})`, type: "job" });
    if (j.stage.includes("Quote")) entries.push({ date: j.date, label: `Quote sent for ${j.name}`, type: "quote" });
    if (j.stage.includes("Invoice") || j.stage.includes("Paid")) entries.push({ date: j.date, label: `Invoice ${j.stage.includes("Paid") ? "paid" : "raised"}: $${j.value.toLocaleString()} — ${j.name}`, type: "invoice" });
  });

  customer.notes.forEach((n, i) => {
    entries.push({ date: "2026-01-01", label: `Note added: "${n}"`, type: "note" });
  });

  customer.contacts.forEach((c) => {
    entries.push({ date: "2025-01-01", label: `Contact added: ${c.name} (${c.role})`, type: "contact" });
  });

  entries.sort((a, b) => b.date.localeCompare(a.date));

  const typeColor: Record<string, string> = {
    job: "bg-primary/20 text-primary",
    quote: "bg-[hsl(var(--status-orange))]/20 text-[hsl(var(--status-orange))]",
    invoice: "bg-[hsl(var(--status-green))]/20 text-[hsl(var(--status-green))]",
    note: "bg-accent text-accent-foreground",
    contact: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-card-foreground">History</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No history yet</p>
      ) : (
        <div className="relative pl-6 border-l-2 border-border space-y-3">
          {entries.map((e, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-border" />
              <div className="p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeColor[e.type]}`}>{e.type}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{e.date}</span>
                </div>
                <p className="text-sm text-card-foreground">{e.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
