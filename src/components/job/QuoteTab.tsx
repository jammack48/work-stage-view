import { useState, useCallback, useRef, useMemo } from "react";
import { DollarSign, Plus, Send, Save, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import type { JobDetail } from "@/data/dummyJobDetails";
import { materialsPool } from "@/data/dummyJobDetails";

interface LineItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
}

interface QuoteTabProps {
  job: JobDetail;
}

type QuoteStatus = "Draft" | "Sent" | "Approved";

const HOURLY_RATE = 85;

let nextId = 1;
function genId() {
  return `qi-${nextId++}`;
}

export function QuoteTab({ job }: QuoteTabProps) {
  // Initialise labour from timeEntries
  const initialLabour: LineItem[] = job.timeEntries.map((t) => ({
    id: genId(),
    name: `${t.staff} — ${t.description}`,
    qty: t.hours,
    unitPrice: HOURLY_RATE,
  }));

  // Initialise materials from job.materials
  const initialMaterials: LineItem[] = job.materials.map((m) => ({
    id: genId(),
    name: m.name,
    qty: m.quantity,
    unitPrice: m.unitPrice,
  }));

  const [labourItems, setLabourItems] = useState<LineItem[]>(initialLabour);
  const [materialItems, setMaterialItems] = useState<LineItem[]>(initialMaterials);
  const [extrasItems, setExtrasItems] = useState<LineItem[]>([]);
  const [status, setStatus] = useState<QuoteStatus>("Draft");
  const [notes, setNotes] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"labour" | "materials" | "extras">("materials");
  const lastInputRef = useRef<HTMLInputElement>(null);

  // Current section items + setter
  const sectionMap = {
    labour: { items: labourItems, setItems: setLabourItems },
    materials: { items: materialItems, setItems: setMaterialItems },
    extras: { items: extrasItems, setItems: setExtrasItems },
  };

  const { items, setItems } = sectionMap[activeSection];

  // Totals
  const sumItems = (list: LineItem[]) => list.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const labourTotal = sumItems(labourItems);
  const materialsTotal = sumItems(materialItems);
  const extrasTotal = sumItems(extrasItems);
  const subtotal = labourTotal + materialsTotal + extrasTotal;
  const gst = subtotal * 0.15;
  const total = subtotal + gst;

  // Update a field on a line item
  const updateItem = useCallback(
    (id: string, field: keyof LineItem, value: string | number) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    },
    [setItems]
  );

  // Delete a line item
  const deleteItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [setItems]
  );

  // Add blank row
  const addBlankRow = useCallback(() => {
    setItems((prev) => [...prev, { id: genId(), name: "", qty: 1, unitPrice: 0 }]);
  }, [setItems]);

  // Add item from palette
  const addFromPalette = useCallback(
    (name: string, unitPrice: number) => {
      setItems((prev) => [...prev, { id: genId(), name, qty: 1, unitPrice }]);
      setPaletteOpen(false);
    },
    [setItems]
  );

  // Enter on last row → add new row
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter" && index === items.length - 1) {
        e.preventDefault();
        addBlankRow();
        setTimeout(() => lastInputRef.current?.focus(), 50);
      }
    },
    [items.length, addBlankRow]
  );

  // Status badge cycling
  const cycleStatus = () => {
    const next: Record<QuoteStatus, QuoteStatus> = {
      Draft: "Sent",
      Sent: "Approved",
      Approved: "Draft",
    };
    setStatus(next[status]);
  };

  const statusColor: Record<QuoteStatus, string> = {
    Draft: "bg-muted text-muted-foreground",
    Sent: "bg-[hsl(var(--status-orange))] text-white",
    Approved: "bg-[hsl(var(--status-green))] text-white",
  };

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Status badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5" /> Quote
        </h3>
        <button
          onClick={cycleStatus}
          className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer ${statusColor[status]}`}
        >
          {status}
        </button>
      </div>

      {/* Section Tabs */}
      <Tabs
        value={activeSection}
        onValueChange={(v) => setActiveSection(v as typeof activeSection)}
      >
        <TabsList className="w-full">
          <TabsTrigger value="labour" className="flex-1">
            Labour
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex-1">
            Materials
          </TabsTrigger>
          <TabsTrigger value="extras" className="flex-1">
            Extras
          </TabsTrigger>
        </TabsList>

        {/* Line items for each section */}
        {(["labour", "materials", "extras"] as const).map((section) => (
          <TabsContent key={section} value={section} className="mt-3">
            {/* Column headers */}
            <div className="grid grid-cols-12 gap-2 px-1 pb-1 text-xs font-medium text-muted-foreground">
              <span className="col-span-5">Item</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-center">Price</span>
              <span className="col-span-2 text-right">Total</span>
              <span className="col-span-1" />
            </div>

            {/* Rows */}
            <div className="space-y-1">
              {sectionMap[section].items.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 items-center group rounded-md p-1 hover:bg-muted/50 transition-colors"
                >
                  <Input
                    className="col-span-5 h-9 text-sm"
                    value={item.name}
                    placeholder="Item name"
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    ref={idx === sectionMap[section].items.length - 1 ? lastInputRef : undefined}
                  />
                  <Input
                    className="col-span-2 h-9 text-sm text-center"
                    type="number"
                    min={0}
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(item.id, "qty", parseFloat(e.target.value) || 0)
                    }
                  />
                  <Input
                    className="col-span-2 h-9 text-sm text-center"
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                    }
                  />
                  <span className="col-span-2 text-sm text-right font-medium">
                    ${(item.qty * item.unitPrice).toFixed(2)}
                  </span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="col-span-1 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add item buttons */}
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => setPaletteOpen(true)}
              >
                <Plus className="w-4 h-4" /> Add Item
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground"
                onClick={addBlankRow}
              >
                <Plus className="w-4 h-4" /> Blank Row
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Notes collapsible */}
      <Collapsible open={notesOpen} onOpenChange={setNotesOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground w-full justify-start">
            {notesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Notes
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes for this quote..."
            className="mt-2 min-h-[60px]"
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Summary card */}
      <Card>
        <CardContent className="pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Labour</span>
            <span className="font-medium">${labourTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Materials</span>
            <span className="font-medium">${materialsTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Extras</span>
            <span className="font-medium">${extrasTotal.toFixed(2)}</span>
          </div>
          <div className="border-t my-1" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>GST (15%)</span>
            <span>${gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          size="lg"
          className="flex-1 h-12 gap-2"
          onClick={() =>
            toast({ title: "Quote sent!", description: `$${total.toFixed(2)} quote sent to ${job.client}` })
          }
        >
          <Send className="w-5 h-5" /> Send Quote
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-12 gap-2"
          onClick={() => toast({ title: "Draft saved" })}
        >
          <Save className="w-4 h-4" /> Save Draft
        </Button>
      </div>

      {/* Command palette for adding items */}
      <Dialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <DialogContent className="p-0 max-w-md">
          <Command>
            <CommandInput placeholder="Search materials..." />
            <CommandList>
              <CommandEmpty>
                <button
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                  onClick={() => addBlankRow()}
                >
                  + Add as custom item
                </button>
              </CommandEmpty>
              <CommandGroup heading="Materials">
                {materialsPool.map((m) => (
                  <CommandItem
                    key={m.id}
                    onSelect={() => addFromPalette(m.name, m.unitPrice)}
                  >
                    <div className="flex justify-between w-full">
                      <span>{m.name}</span>
                      <span className="text-muted-foreground text-xs">
                        ${m.unitPrice.toFixed(2)} / {m.unit}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}
