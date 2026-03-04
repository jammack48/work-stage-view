import { useState } from "react";
import { ClipboardCheck, ChevronRight, Check, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { checklistTemplates, type CompletedChecklist } from "@/data/dummyChecklists";

interface ChecklistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: "arrival" | "completion" | "both";
  onComplete: (checklist: CompletedChecklist) => void;
}

export function ChecklistDialog({ open, onOpenChange, category, onComplete }: ChecklistDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const filtered = checklistTemplates.filter(
    (t) => t.category === category || t.category === "both"
  );

  const selected = selectedId ? checklistTemplates.find((t) => t.id === selectedId) : null;

  const mandatoryDone = selected
    ? selected.items.filter((i) => i.mandatory).every((i) => checked[i.id])
    : false;

  const allDone = selected ? selected.items.every((i) => checked[i.id]) : false;

  function handleSelect(id: string) {
    setSelectedId(id);
    setChecked({});
  }

  function handleBack() {
    setSelectedId(null);
    setChecked({});
  }

  function handleComplete() {
    if (!selected) return;
    onComplete({
      templateId: selected.id,
      templateName: selected.name,
      category: selected.category,
      completedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      items: selected.items.map((i) => ({ label: i.label, checked: !!checked[i.id] })),
    });
    setSelectedId(null);
    setChecked({});
    onOpenChange(false);
  }

  function handleClose(isOpen: boolean) {
    if (!isOpen) {
      setSelectedId(null);
      setChecked({});
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            {selected ? selected.name : category === "arrival" ? "Arrival Checklists" : "Completion Checklists"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {selected ? "Complete the checklist items" : "Choose a checklist"}
          </DialogDescription>
        </DialogHeader>

        {!selected ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {category === "arrival"
                ? "Select a checklist to complete on arrival."
                : "Select a checklist to complete before finishing."}
            </p>
            {filtered.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelect(t.id)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-accent/50 transition-colors text-left"
              >
                <div>
                  <div className="text-sm font-medium text-card-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.items.length} items</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1 -ml-2 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>

            <div className="space-y-1.5">
              {selected.items.map((item) => {
                const isChecked = !!checked[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => setChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left",
                      isChecked
                        ? "border-[hsl(var(--status-green))] bg-[hsl(var(--status-green)/0.1)]"
                        : "border-border bg-card hover:bg-accent/50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
                        isChecked
                          ? "bg-[hsl(var(--status-green))] border-[hsl(var(--status-green))] text-white"
                          : "border-muted-foreground/40"
                      )}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className={cn("text-sm font-medium", isChecked ? "text-card-foreground" : "text-card-foreground")}>
                      {item.label}
                    </span>
                    {item.mandatory && !isChecked && (
                      <span className="text-[10px] text-[hsl(var(--status-orange))] font-semibold ml-auto">Required</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                {Object.values(checked).filter(Boolean).length}/{selected.items.length} done
              </span>
              <Button
                onClick={handleComplete}
                disabled={!mandatoryDone}
                className="gap-1.5"
              >
                <Check className="w-4 h-4" />
                {allDone ? "Complete" : "Complete (mandatory done)"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
