import { useState, useCallback, useRef, useMemo } from "react";
import { DollarSign, Plus, Send, Save, X, ChevronDown, ChevronUp, Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { catalogueItems, bundleTemplates } from "@/data/dummyJobDetails";

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
type Section = "labour" | "materials" | "extras";

const HOURLY_RATE = 85;

let nextId = 1;
function genId() {
  return `qi-${nextId++}`;
}

/* ── Section header row ─────────────────────────────────── */
function SectionHeader({
  label,
  total,
  isOpen,
  onToggle,
}: {
  label: string;
  total: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-muted/60 hover:bg-muted transition-colors cursor-pointer"
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold">${total.toFixed(2)}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
    </button>
  );
}

/* ── Inline-editable row ────────────────────────────────── */
function ItemRow({
  item,
  isLast,
  onUpdate,
  onDelete,
  onEnterLast,
  lastRef,
}: {
  item: LineItem;
  isLast: boolean;
  onUpdate: (id: string, field: keyof LineItem, value: string | number) => void;
  onDelete: (id: string) => void;
  onEnterLast: () => void;
  lastRef: React.RefObject<HTMLInputElement>;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isLast) {
      e.preventDefault();
      onEnterLast();
    }
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-center group rounded-md p-1 hover:bg-muted/50 transition-colors">
      <Input
        className="col-span-5 h-9 text-sm"
        value={item.name}
        placeholder="Item name"
        onChange={(e) => onUpdate(item.id, "name", e.target.value)}
        onKeyDown={handleKeyDown}
        ref={isLast ? lastRef : undefined}
      />
      <Input
        className="col-span-2 h-9 text-sm text-center"
        type="number"
        min={0}
        value={item.qty}
        onChange={(e) => onUpdate(item.id, "qty", parseFloat(e.target.value) || 0)}
      />
      <Input
        className="col-span-2 h-9 text-sm text-center"
        type="number"
        min={0}
        step={0.01}
        value={item.unitPrice}
        onChange={(e) => onUpdate(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
      />
      <span className="col-span-2 text-sm text-right font-medium">
        ${(item.qty * item.unitPrice).toFixed(2)}
      </span>
      <button
        onClick={() => onDelete(item.id)}
        className="col-span-1 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ── Main QuoteTab ──────────────────────────────────────── */
export function QuoteTab({ job }: QuoteTabProps) {
  // Initialise from job data
  const initialLabour: LineItem[] = job.timeEntries.map((t) => ({
    id: genId(),
    name: `${t.staff} — ${t.description}`,
    qty: t.hours,
    unitPrice: HOURLY_RATE,
  }));
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

  // Section collapse state — Labour expanded by default, others collapsed if empty
  const [labourOpen, setLabourOpen] = useState(true);
  const [materialsOpen, setMaterialsOpen] = useState(initialMaterials.length > 0);
  const [extrasOpen, setExtrasOpen] = useState(false);

  // Quick-add state
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteSection, setPaletteSection] = useState<Section | null>(null);

  const lastInputRef = useRef<HTMLInputElement>(null);

  // Section map for convenience
  const sectionSetters: Record<Section, React.Dispatch<React.SetStateAction<LineItem[]>>> = {
    labour: setLabourItems,
    materials: setMaterialItems,
    extras: setExtrasItems,
  };

  const sectionOpeners: Record<Section, () => void> = {
    labour: () => setLabourOpen(true),
    materials: () => setMaterialsOpen(true),
    extras: () => setExtrasOpen(true),
  };

  // Totals
  const sum = (list: LineItem[]) => list.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const labourTotal = sum(labourItems);
  const materialsTotal = sum(materialItems);
  const extrasTotal = sum(extrasItems);
  const subtotal = labourTotal + materialsTotal + extrasTotal;
  const gst = subtotal * 0.15;
  const total = subtotal + gst;

  // Update field
  const makeUpdater = (setter: React.Dispatch<React.SetStateAction<LineItem[]>>) =>
    (id: string, field: keyof LineItem, value: string | number) => {
      setter((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    };

  // Delete item
  const makeDeleter = (setter: React.Dispatch<React.SetStateAction<LineItem[]>>) =>
    (id: string) => {
      setter((prev) => prev.filter((item) => item.id !== id));
    };

  // Add blank row to a section
  const addBlankTo = useCallback((section: Section) => {
    sectionSetters[section]((prev) => [...prev, { id: genId(), name: "", qty: 1, unitPrice: 0 }]);
    sectionOpeners[section]();
  }, []);

  // Add catalogue item to correct section
  const addCatalogueItem = useCallback((item: typeof catalogueItems[0]) => {
    const newItem: LineItem = { id: genId(), name: item.name, qty: 1, unitPrice: item.unitPrice };
    sectionSetters[item.section]((prev) => [...prev, newItem]);
    sectionOpeners[item.section]();
    setQuickAddOpen(false);
    setPaletteOpen(false);
  }, []);

  // Apply bundle
  const applyBundle = useCallback((bundleId: string) => {
    const bundle = bundleTemplates.find((b) => b.id === bundleId);
    if (!bundle) return;

    setLabourItems(bundle.labour.map((i) => ({ id: genId(), name: i.name, qty: i.qty, unitPrice: i.unitPrice })));
    setMaterialItems(bundle.materials.map((i) => ({ id: genId(), name: i.name, qty: i.qty, unitPrice: i.unitPrice })));
    setExtrasItems(bundle.extras.map((i) => ({ id: genId(), name: i.name, qty: i.qty, unitPrice: i.unitPrice })));

    setLabourOpen(true);
    setMaterialsOpen(true);
    setExtrasOpen(bundle.extras.length > 0);

    toast({ title: `${bundle.name} bundle loaded` });
  }, []);

  // Status cycling
  const cycleStatus = () => {
    const next: Record<QuoteStatus, QuoteStatus> = { Draft: "Sent", Sent: "Approved", Approved: "Draft" };
    setStatus(next[status]);
  };
  const statusColor: Record<QuoteStatus, string> = {
    Draft: "bg-muted text-muted-foreground",
    Sent: "bg-[hsl(var(--status-orange))] text-white",
    Approved: "bg-[hsl(var(--status-green))] text-white",
  };

  // Grouped catalogue items for palette
  const labourCatalogue = catalogueItems.filter((i) => i.section === "labour");
  const materialsCatalogue = catalogueItems.filter((i) => i.section === "materials");
  const extrasCatalogue = catalogueItems.filter((i) => i.section === "extras");

  // Filter palette to a section if opened from a section's "+ Add" button
  const paletteItems = paletteSection
    ? catalogueItems.filter((i) => i.section === paletteSection)
    : catalogueItems;

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Header + status */}
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

      {/* ── Bundles bar ──────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {bundleTemplates.map((b) => (
          <button
            key={b.id}
            onClick={() => applyBundle(b.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            {b.name}
          </button>
        ))}
      </div>

      {/* ── Quick-add bar ────────────────────────────────── */}
      <div className="relative">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background cursor-text"
          onClick={() => setQuickAddOpen(true)}
        >
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Type to add item…</span>
        </div>

        {quickAddOpen && (
          <div className="absolute top-0 left-0 right-0 z-50 rounded-lg border border-border bg-popover shadow-lg">
            <Command>
              <CommandInput
                placeholder="Search items…"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Escape") setQuickAddOpen(false);
                }}
              />
              <CommandList className="max-h-60">
                <CommandEmpty>
                  <button
                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                    onClick={() => {
                      addBlankTo("materials");
                      setQuickAddOpen(false);
                    }}
                  >
                    + Add as custom item
                  </button>
                </CommandEmpty>
                {labourCatalogue.length > 0 && (
                  <CommandGroup heading="Labour">
                    {labourCatalogue.map((item) => (
                      <CommandItem key={item.id} onSelect={() => addCatalogueItem(item)}>
                        <div className="flex justify-between w-full">
                          <span>{item.name}</span>
                          <span className="text-muted-foreground text-xs">${item.unitPrice.toFixed(2)} / {item.unit}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {materialsCatalogue.length > 0 && (
                  <CommandGroup heading="Materials">
                    {materialsCatalogue.map((item) => (
                      <CommandItem key={item.id} onSelect={() => addCatalogueItem(item)}>
                        <div className="flex justify-between w-full">
                          <span>{item.name}</span>
                          <span className="text-muted-foreground text-xs">${item.unitPrice.toFixed(2)} / {item.unit}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {extrasCatalogue.length > 0 && (
                  <CommandGroup heading="Extras">
                    {extrasCatalogue.map((item) => (
                      <CommandItem key={item.id} onSelect={() => addCatalogueItem(item)}>
                        <div className="flex justify-between w-full">
                          <span>{item.name}</span>
                          <span className="text-muted-foreground text-xs">${item.unitPrice.toFixed(2)} / {item.unit}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
            {/* Click-away overlay */}
            <div className="fixed inset-0 -z-10" onClick={() => setQuickAddOpen(false)} />
          </div>
        )}
      </div>

      {/* ── Stacked collapsible sections ─────────────────── */}
      {/* Column headers (always visible) */}
      <div className="grid grid-cols-12 gap-2 px-1 text-xs font-medium text-muted-foreground">
        <span className="col-span-5">Item</span>
        <span className="col-span-2 text-center">Qty</span>
        <span className="col-span-2 text-center">Price</span>
        <span className="col-span-2 text-right">Total</span>
        <span className="col-span-1" />
      </div>

      {/* LABOUR */}
      <div>
        <SectionHeader label="Labour" total={labourTotal} isOpen={labourOpen} onToggle={() => setLabourOpen(!labourOpen)} />
        <Collapsible open={labourOpen}>
          <CollapsibleContent>
            <div className="space-y-1 mt-1">
              {labourItems.map((item, idx) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  isLast={idx === labourItems.length - 1}
                  onUpdate={makeUpdater(setLabourItems)}
                  onDelete={makeDeleter(setLabourItems)}
                  onEnterLast={() => addBlankTo("labour")}
                  lastRef={lastInputRef}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground mt-1"
              onClick={() => {
                setPaletteSection("labour");
                setPaletteOpen(true);
              }}
            >
              <Plus className="w-4 h-4" /> Add
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* MATERIALS */}
      <div>
        <SectionHeader label="Materials" total={materialsTotal} isOpen={materialsOpen} onToggle={() => setMaterialsOpen(!materialsOpen)} />
        <Collapsible open={materialsOpen}>
          <CollapsibleContent>
            <div className="space-y-1 mt-1">
              {materialItems.map((item, idx) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  isLast={idx === materialItems.length - 1}
                  onUpdate={makeUpdater(setMaterialItems)}
                  onDelete={makeDeleter(setMaterialItems)}
                  onEnterLast={() => addBlankTo("materials")}
                  lastRef={lastInputRef}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground mt-1"
              onClick={() => {
                setPaletteSection("materials");
                setPaletteOpen(true);
              }}
            >
              <Plus className="w-4 h-4" /> Add
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* EXTRAS */}
      <div>
        <SectionHeader label="Extras" total={extrasTotal} isOpen={extrasOpen} onToggle={() => setExtrasOpen(!extrasOpen)} />
        <Collapsible open={extrasOpen}>
          <CollapsibleContent>
            <div className="space-y-1 mt-1">
              {extrasItems.map((item, idx) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  isLast={idx === extrasItems.length - 1}
                  onUpdate={makeUpdater(setExtrasItems)}
                  onDelete={makeDeleter(setExtrasItems)}
                  onEnterLast={() => addBlankTo("extras")}
                  lastRef={lastInputRef}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground mt-1"
              onClick={() => {
                setPaletteSection("extras");
                setPaletteOpen(true);
              }}
            >
              <Plus className="w-4 h-4" /> Add
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* ── Notes collapsible ────────────────────────────── */}
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
            placeholder="Add any notes for this quote…"
            className="mt-2 min-h-[60px]"
          />
        </CollapsibleContent>
      </Collapsible>

      {/* ── Summary card ─────────────────────────────────── */}
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

      {/* ── Action buttons ───────────────────────────────── */}
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

      {/* ── Section-filtered command palette dialog ──────── */}
      <Dialog open={paletteOpen} onOpenChange={(open) => { setPaletteOpen(open); if (!open) setPaletteSection(null); }}>
        <DialogContent className="p-0 max-w-md">
          <Command>
            <CommandInput placeholder={`Search ${paletteSection ?? "all"} items…`} />
            <CommandList>
              <CommandEmpty>
                <button
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                  onClick={() => {
                    addBlankTo(paletteSection ?? "materials");
                    setPaletteOpen(false);
                    setPaletteSection(null);
                  }}
                >
                  + Add as custom item
                </button>
              </CommandEmpty>
              {(!paletteSection || paletteSection === "labour") && labourCatalogue.length > 0 && (
                <CommandGroup heading="Labour">
                  {labourCatalogue.map((m) => (
                    <CommandItem key={m.id} onSelect={() => addCatalogueItem(m)}>
                      <div className="flex justify-between w-full">
                        <span>{m.name}</span>
                        <span className="text-muted-foreground text-xs">${m.unitPrice.toFixed(2)} / {m.unit}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {(!paletteSection || paletteSection === "materials") && materialsCatalogue.length > 0 && (
                <CommandGroup heading="Materials">
                  {materialsCatalogue.map((m) => (
                    <CommandItem key={m.id} onSelect={() => addCatalogueItem(m)}>
                      <div className="flex justify-between w-full">
                        <span>{m.name}</span>
                        <span className="text-muted-foreground text-xs">${m.unitPrice.toFixed(2)} / {m.unit}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {(!paletteSection || paletteSection === "extras") && extrasCatalogue.length > 0 && (
                <CommandGroup heading="Extras">
                  {extrasCatalogue.map((m) => (
                    <CommandItem key={m.id} onSelect={() => addCatalogueItem(m)}>
                      <div className="flex justify-between w-full">
                        <span>{m.name}</span>
                        <span className="text-muted-foreground text-xs">${m.unitPrice.toFixed(2)} / {m.unit}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}
