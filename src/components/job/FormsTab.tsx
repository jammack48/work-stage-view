import { ClipboardCheck, FileCheck, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

export function FormsTab() {
  return (
    <div className="space-y-4 max-w-2xl">
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
