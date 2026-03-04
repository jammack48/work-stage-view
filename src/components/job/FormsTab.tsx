import { ClipboardCheck, FileCheck, FilePlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CompletedChecklist } from "@/data/dummyChecklists";

interface FormEntry {
  id: string;
  name: string;
  status: "Complete" | "In Progress" | "Not Started";
  date: string;
}

const dummyForms: FormEntry[] = [
  { id: "f1", name: "Site Safety Checklist", status: "Complete", date: "10 Feb 2025" },
  { id: "f2", name: "Pre-Start Risk Assessment", status: "Complete", date: "10 Feb 2025" },
  { id: "f3", name: "Electrical Compliance Certificate", status: "In Progress", date: "14 Feb 2025" },
  { id: "f4", name: "Client Sign-off Form", status: "Not Started", date: "—" },
];

function statusStyle(status: FormEntry["status"]) {
  if (status === "Complete") return "bg-[hsl(var(--status-green))] text-white";
  if (status === "In Progress") return "bg-[hsl(var(--status-orange))] text-white";
  return "bg-secondary text-secondary-foreground";
}

interface FormsTabProps {
  completedChecklists?: CompletedChecklist[];
}

export function FormsTab({ completedChecklists = [] }: FormsTabProps) {
  return (
    <div className="space-y-4 max-w-2xl">
      {/* Completed checklists from arrival/finish flows */}
      {completedChecklists.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Check className="w-4 h-4 text-[hsl(var(--status-green))]" /> Completed Checklists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedChecklists.map((cl, idx) => (
                <div
                  key={`${cl.templateId}-${idx}`}
                  className="p-3 rounded-lg bg-[hsl(var(--status-green)/0.08)] border border-[hsl(var(--status-green)/0.2)]"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-card-foreground">{cl.templateName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[hsl(var(--status-green))] text-white">
                      Complete
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1.5">{cl.completedAt} • {cl.category === "arrival" ? "Arrival" : cl.category === "completion" ? "Completion" : "General"}</div>
                  <div className="space-y-0.5">
                    {cl.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <Check className={cn("w-3 h-3 shrink-0", item.checked ? "text-[hsl(var(--status-green))]" : "text-muted-foreground/40")} />
                        <span className={cn(item.checked ? "text-card-foreground" : "text-muted-foreground line-through")}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4" /> Forms & Checklists
          </CardTitle>
          <Button size="sm" className="h-9 gap-1.5">
            <FilePlus className="w-4 h-4" /> New Form
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dummyForms.map((form) => (
              <div
                key={form.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileCheck className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-card-foreground truncate">{form.name}</div>
                    <div className="text-xs text-muted-foreground">{form.date}</div>
                  </div>
                </div>
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap", statusStyle(form.status))}>
                  {form.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
