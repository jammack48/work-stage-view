import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Customer } from "@/data/dummyCustomers";

interface QuotesTabProps {
  customer: Customer;
}

export function QuotesTab({ customer }: QuotesTabProps) {
  const navigate = useNavigate();
  const quotes = customer.jobHistory.filter((j) => j.stage.includes("Quote") || j.stage === "Lead");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-card-foreground">Quotes ({quotes.length})</h2>
        <Button size="sm" className="gap-1.5" onClick={() => navigate("/quote/new")}><Plus className="w-4 h-4" /> New Quote</Button>
      </div>
      {quotes.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No quotes yet</p>
      ) : (
        quotes.map((q) => (
          <div key={q.id} onClick={() => navigate(`/quote/${q.id}`)} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-accent/50 cursor-pointer transition-colors">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-card-foreground truncate">{q.name}</div>
              <div className="text-xs text-muted-foreground">{q.id} · {q.date}</div>
            </div>
            <div className="text-sm font-bold text-card-foreground">${q.value.toLocaleString()}</div>
            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap", "bg-muted text-muted-foreground")}>{q.stage}</span>
          </div>
        ))
      )}
    </div>
  );
}
