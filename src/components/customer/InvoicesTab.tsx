import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Customer } from "@/data/dummyCustomers";

interface InvoicesTabProps {
  customer: Customer;
}

export function InvoicesTab({ customer }: InvoicesTabProps) {
  const navigate = useNavigate();
  const invoices = customer.jobHistory.filter((j) => j.stage.includes("Invoice") || j.stage.includes("Paid"));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-card-foreground">Invoices ({invoices.length})</h2>
        <Button size="sm" className="gap-1.5" onClick={() => navigate("/invoice/new")}><Plus className="w-4 h-4" /> New Invoice</Button>
      </div>
      {invoices.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No invoices yet</p>
      ) : (
        invoices.map((inv) => (
          <div key={inv.id} onClick={() => navigate(`/invoice/${inv.id}`)} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-accent/50 cursor-pointer transition-colors">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-card-foreground truncate">{inv.name}</div>
              <div className="text-xs text-muted-foreground">{inv.id} · {inv.date}</div>
            </div>
            <div className="text-sm font-bold text-card-foreground">${inv.value.toLocaleString()}</div>
            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap",
              inv.stage.includes("Paid") ? "bg-[hsl(var(--status-green))] text-white" : "bg-[hsl(var(--status-orange))] text-white"
            )}>{inv.stage}</span>
          </div>
        ))
      )}
    </div>
  );
}
