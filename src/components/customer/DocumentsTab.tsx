import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/data/dummyCustomers";

interface DocumentsTabProps {
  customer: Customer;
}

export function DocumentsTab({ customer }: DocumentsTabProps) {
  const docs = customer.jobHistory.flatMap((j) => {
    const items: { type: string; name: string; job: string; date: string; status: string }[] = [];
    if (j.stage.includes("Quote") || j.stage === "Lead") items.push({ type: "Quote", name: `Quote — ${j.name}`, job: j.id, date: j.date, status: j.stage });
    if (j.stage.includes("Invoice") || j.stage.includes("Paid") || j.stage === "To Invoice") items.push({ type: "Invoice", name: `Invoice — ${j.name}`, job: j.id, date: j.date, status: j.stage });
    items.push({ type: "Job Sheet", name: `Job Sheet — ${j.name}`, job: j.id, date: j.date, status: "Saved" });
    return items;
  });

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-card-foreground">Documents ({docs.length})</h2>
      {docs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No documents yet</p>
      ) : (
        docs.map((d, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
            <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-card-foreground truncate">{d.name}</div>
              <div className="text-xs text-muted-foreground">{d.job} · {d.date} · {d.status}</div>
            </div>
            <Button size="icon" variant="ghost" className="shrink-0"><Download className="w-4 h-4" /></Button>
          </div>
        ))
      )}
    </div>
  );
}
