import { useState, useCallback, useRef, useMemo } from "react";
import { DollarSign, Plus, Send, Save, X, ChevronDown, ChevronUp, Package, Search, Percent, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { coverLetterTemplates } from "@/data/coverLetterTemplates";
import { QuotePreview } from "@/components/quote/QuotePreview";

interface LineItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  sellPrice: number;
  markup: number;
}

interface QuoteTabProps {
  job: JobDetail;
  initialBundle?: import("@/data/dummyJobDetails").BundleTemplate;
  beforeActions?: React.ReactNode;
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

/* ── Three-line mobile-friendly item row ─────────────────── */
function ItemRow({
  item,
  isLast,
  onUpdate,
  onDelete,
  onEnterLast,
  lastRef,
  globalMarkupValue,
  useGlobalMarkup,
  onResetToGlobal,
}: {
  item: LineItem;
  isLast: boolean;
  onUpdate: (id: string, field: keyof LineItem, value: string | number) => void;
  onDelete: (id: string) => void;
  onEnterLast: () => void;
  lastRef: React.RefObject<HTMLInputElement>;
  globalMarkupValue: number;
  useGlobalMarkup: boolean;
  onResetToGlobal: (id: string) => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isLast) {
      e.preventDefault();
      onEnterLast();
    }
  };

  const lineTotal = item.qty * item.sellPrice;
  const differsFromGlobal = useGlobalMarkup && Math.abs(item.markup - globalMarkupValue) > 0.01;

  return (
    <div className="group rounded-md p-2 hover:bg-muted/50 transition-colors space-y-1.5">
      {/* Line 1: Item name + delete */}
      <div className="flex items-center gap-1.5">
        <Input
          className="flex-1 h-9 text-sm"
          value={item.name}
          placeholder="Item name"
          onChange={(e) => onUpdate(item.id, "name", e.target.value)}
          onKeyDown={handleKeyDown}
          ref={isLast ? lastRef : undefined}
        />
        <button
          onClick={() => onDelete(item.id)}
          className="shrink-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* Line 2: Qty + Buy Price + Sell Price */}
      <div className="flex items-center gap-1.5">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground leading-none mb-0.5">Qty</span>
          <Input
            className="w-14 h-8 text-xs text-center"
            type="number"
            min={0}
            value={item.qty}
            onChange={(e) => onUpdate(item.id, "qty", parseFloat(e.target.value) || 0)}
          />
        </div>
        <span className="text-xs text-muted-foreground mt-3">×</span>
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground leading-none mb-0.5">Buy</span>
          <Input
            className="w-20 h-8 text-xs text-center"
            type="number"
            min={0}
            step={0.01}
            value={item.unitPrice}
            onChange={(e) => onUpdate(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
          />
        </div>
        <span className="text-xs text-muted-foreground mt-3">→</span>
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground leading-none mb-0.5">Sell</span>
          <Input
            className="w-20 h-8 text-xs text-center"
            type="number"
            min={0}
            step={0.01}
            value={item.sellPrice}
            onChange={(e) => onUpdate(item.id, "sellPrice", parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
      {/* Line 3: Markup % + Line Total */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground leading-none mb-0.5">Markup</span>
            <div className="flex items-center gap-0.5">
              <Input
                className="w-16 h-8 text-xs text-center"
                type="number"
                min={0}
                step={1}
                value={Math.round(item.markup * 100) / 100}
                onChange={(e) => onUpdate(item.id, "markup", parseFloat(e.target.value) || 0)}
              />
              <Percent className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
          {differsFromGlobal && (
            <button
              onClick={() => onResetToGlobal(item.id)}
              className="ml-1 p-1 text-muted-foreground hover:text-primary transition-colors"
              title="Reset to global markup"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
        <span className="ml-auto text-sm font-bold whitespace-nowrap">
          ${lineTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

/* ── Main QuoteTab ──────────────────────────────────────── */
export function QuoteTab({ job, initialBundle, beforeActions }: QuoteTabProps) {
  const mkItem = (name: string, qty: number, unitPrice: number): LineItem => ({
    id: genId(), name, qty, unitPrice, sellPrice: unitPrice, markup: 0,
  });

  const initialLabour: LineItem[] = initialBundle
    ? initialBundle.labour.map((i) => mkItem(i.name, i.qty, i.unitPrice))
    : job.timeEntries.map((t) => mkItem(`${t.staff} — ${t.description}`, t.hours, HOURLY_RATE));

  const initialMaterials: LineItem[] = initialBundle
    ? initialBundle.materials.map((i) => mkItem(i.name, i.qty, i.unitPrice))
    : job.materials.map((m) => mkItem(m.name, m.quantity, m.unitPrice));

  const initialExtras: LineItem[] = initialBundle
    ? initialBundle.extras.map((i) => mkItem(i.name, i.qty, i.unitPrice))
    : [];

  const [labourItems, setLabourItems] = useState<LineItem[]>(initialLabour);
  const [materialItems, setMaterialItems] = useState<LineItem[]>(initialMaterials);
  const [extrasItems, setExtrasItems] = useState<LineItem[]>(initialExtras);
  const [status, setStatus] = useState<QuoteStatus>("Draft");
  const [notes, setNotes] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);

  // Cover letter
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const [coverLetterTemplate, setCoverLetterTemplate] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  // Global markup — applies to all items as default, individually overridable
  const [useGlobalMarkup, setUseGlobalMarkup] = useState(false);
  const [globalMarkupValue, setGlobalMarkupValue] = useState(15);

  // Apply global markup to all items
  const applyGlobalMarkup = useCallback((markupVal: number) => {
    const apply = (setter: React.Dispatch<React.SetStateAction<LineItem[]>>) => {
      setter((prev) => prev.map((item) => ({
        ...item,
        markup: markupVal,
        sellPrice: item.unitPrice * (1 + markupVal / 100),
      })));
    };
    apply(setLabourItems);
    apply(setMaterialItems);
    apply(setExtrasItems);
  }, []);

  const handleToggleGlobal = useCallback((on: boolean) => {
    setUseGlobalMarkup(on);
    if (on) applyGlobalMarkup(globalMarkupValue);
  }, [globalMarkupValue, applyGlobalMarkup]);

  const handleGlobalValueChange = useCallback((val: number) => {
    setGlobalMarkupValue(val);
    if (useGlobalMarkup) applyGlobalMarkup(val);
  }, [useGlobalMarkup, applyGlobalMarkup]);

  // Section collapse state
  const [labourOpen, setLabourOpen] = useState(true);
  const [materialsOpen, setMaterialsOpen] = useState(initialMaterials.length > 0);
  const [extrasOpen, setExtrasOpen] = useState(initialExtras.length > 0);

  // Quick-add state
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteSection, setPaletteSection] = useState<Section | null>(null);

  const lastInputRef = useRef<HTMLInputElement>(null);

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

  // Totals — now sellPrice is stored per item
  const calcSectionTotals = (list: LineItem[]) => {
    const costTotal = list.reduce((s, i) => s + i.qty * i.unitPrice, 0);
    const sellTotal = list.reduce((s, i) => s + i.qty * i.sellPrice, 0);
    return { costTotal, sellTotal };
  };

  const labour = calcSectionTotals(labourItems);
  const materials = calcSectionTotals(materialItems);
  const extras = calcSectionTotals(extrasItems);

  const costTotal = labour.costTotal + materials.costTotal + extras.costTotal;
  const sellSubtotal = labour.sellTotal + materials.sellTotal + extras.sellTotal;
  const markupAmount = sellSubtotal - costTotal;
  const gst = sellSubtotal * 0.15;
  const grandTotal = sellSubtotal + gst;

  // Bidirectional pricing updater
  const makeUpdater = (setter: React.Dispatch<React.SetStateAction<LineItem[]>>) =>
    (id: string, field: keyof LineItem, value: string | number) => {
      setter((prev) => prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        const v = typeof value === "number" ? value : parseFloat(value) || 0;
        if (field === "unitPrice") {
          // Buy price changed → recalc sell from current markup
          updated.sellPrice = v * (1 + item.markup / 100);
        } else if (field === "sellPrice") {
          // Sell price changed → recalc markup
          updated.markup = v > 0 && item.unitPrice > 0 ? ((v - item.unitPrice) / item.unitPrice) * 100 : 0;
        } else if (field === "markup") {
          // Markup changed → recalc sell price
          updated.sellPrice = item.unitPrice * (1 + v / 100);
        }
        return updated;
      }));
    };

  // Reset item to global markup
  const resetToGlobal = useCallback((setter: React.Dispatch<React.SetStateAction<LineItem[]>>) =>
    (id: string) => {
      setter((prev) => prev.map((item) => {
        if (item.id !== id) return item;
        const newSell = item.unitPrice * (1 + globalMarkupValue / 100);
        return { ...item, markup: globalMarkupValue, sellPrice: newSell };
      }));
    }, [globalMarkupValue]);

  const makeDeleter = (setter: React.Dispatch<React.SetStateAction<LineItem[]>>) =>
    (id: string) => {
      setter((prev) => prev.filter((item) => item.id !== id));
    };

  const addBlankTo = useCallback((section: Section) => {
    const defaultMarkup = useGlobalMarkup ? globalMarkupValue : 0;
    sectionSetters[section]((prev) => [...prev, { id: genId(), name: "", qty: 1, unitPrice: 0, sellPrice: 0, markup: defaultMarkup }]);
    sectionOpeners[section]();
  }, []);

  const addCatalogueItem = useCallback((item: typeof catalogueItems[0]) => {
    const defaultMarkup = useGlobalMarkup ? globalMarkupValue : 0;
    const sellPrice = item.unitPrice * (1 + defaultMarkup / 100);
    const newItem: LineItem = { id: genId(), name: item.name, qty: 1, unitPrice: item.unitPrice, sellPrice, markup: defaultMarkup };
    sectionSetters[item.section]((prev) => [...prev, newItem]);
    sectionOpeners[item.section]();
    setQuickAddOpen(false);
    setPaletteOpen(false);
  }, []);

  // Bundle add dialog state
  const [bundleDialogOpen, setBundleDialogOpen] = useState(false);
  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(null);
  const [bundleQty, setBundleQty] = useState(1);

  const openBundleDialog = useCallback((bundleId: string) => {
    setSelectedBundleId(bundleId);
    setBundleQty(1);
    setBundleDialogOpen(true);
  }, []);

  const applyBundle = useCallback((bundleId: string, multiplier: number = 1) => {
    const bundle = bundleTemplates.find((b) => b.id === bundleId);
    if (!bundle) return;
    const defaultMarkup = useGlobalMarkup ? globalMarkupValue : 0;
    const mkWithMarkup = (name: string, qty: number, unitPrice: number) => {
      const sellPrice = unitPrice * (1 + defaultMarkup / 100);
      return { id: genId(), name, qty: qty * multiplier, unitPrice, sellPrice, markup: defaultMarkup };
    };
    setLabourItems((prev) => [...prev, ...bundle.labour.map((i) => mkWithMarkup(i.name, i.qty, i.unitPrice))]);
    setMaterialItems((prev) => [...prev, ...bundle.materials.map((i) => mkWithMarkup(i.name, i.qty, i.unitPrice))]);
    setExtrasItems((prev) => [...prev, ...bundle.extras.map((i) => mkWithMarkup(i.name, i.qty, i.unitPrice))]);
    setLabourOpen(true);
    setMaterialsOpen(true);
    setExtrasOpen((prev) => prev || bundle.extras.length > 0);
    toast({ title: `${bundle.name} ×${multiplier} added` });
  }, [useGlobalMarkup, globalMarkupValue]);

  const confirmBundleAdd = useCallback(() => {
    if (selectedBundleId) applyBundle(selectedBundleId, bundleQty);
    setBundleDialogOpen(false);
  }, [selectedBundleId, bundleQty, applyBundle]);

  const cycleStatus = () => {
    const next: Record<QuoteStatus, QuoteStatus> = { Draft: "Sent", Sent: "Approved", Approved: "Draft" };
    setStatus(next[status]);
  };
  const statusColor: Record<QuoteStatus, string> = {
    Draft: "bg-muted text-muted-foreground",
    Sent: "bg-[hsl(var(--status-orange))] text-white",
    Approved: "bg-[hsl(var(--status-green))] text-white",
  };

  const labourCatalogue = catalogueItems.filter((i) => i.section === "labour");
  const materialsCatalogue = catalogueItems.filter((i) => i.section === "materials");
  const extrasCatalogue = catalogueItems.filter((i) => i.section === "extras");

  const paletteItems = paletteSection
    ? catalogueItems.filter((i) => i.section === paletteSection)
    : catalogueItems;

  // All items for preview
  const allPreviewItems = [
    ...labourItems.map((i) => ({ ...i, section: "labour" })),
    ...materialItems.map((i) => ({ ...i, section: "materials" })),
    ...extrasItems.map((i) => ({ ...i, section: "extras" })),
  ];

  return (
    <div className="space-y-4">
      {/* ── Global markup (set first) ────────────────────── */}
      <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2">
          <Switch checked={useGlobalMarkup} onCheckedChange={handleToggleGlobal} className="scale-90" />
          <Label className="text-xs font-medium">Global Markup</Label>
        </div>
        {useGlobalMarkup && (
          <div className="flex items-center gap-1">
            <Input
              className="w-16 h-7 text-xs text-center"
              type="number"
              min={0}
              value={globalMarkupValue}
              onChange={(e) => handleGlobalValueChange(parseFloat(e.target.value) || 0)}
            />
            <Percent className="w-3 h-3 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* ── Bundles bar (add, not replace) ────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {bundleTemplates.map((b) => (
          <button
            key={b.id}
            onClick={() => openBundleDialog(b.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {b.name}
          </button>
        ))}
      </div>

      {/* ── Bundle qty dialog ────────────────────────────── */}
      <Dialog open={bundleDialogOpen} onOpenChange={setBundleDialogOpen}>
        <DialogContent className="max-w-xs">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-card-foreground">
              Add {bundleTemplates.find((b) => b.id === selectedBundleId)?.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {bundleTemplates.find((b) => b.id === selectedBundleId)?.description}
            </p>
            <div className="flex items-center gap-3">
              <Label className="text-xs">Quantity</Label>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => setBundleQty((q) => Math.max(1, q - 1))}>−</Button>
                <Input
                  className="w-14 h-8 text-center text-sm"
                  type="number"
                  min={1}
                  value={bundleQty}
                  onChange={(e) => setBundleQty(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => setBundleQty((q) => q + 1)}>+</Button>
              </div>
            </div>
            <Button className="w-full" onClick={confirmBundleAdd}>
              <Plus className="w-4 h-4 mr-1" />
              Add ×{bundleQty}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
            <div className="fixed inset-0 -z-10" onClick={() => setQuickAddOpen(false)} />
          </div>
        )}
      </div>

      {/* Cover letter moved to bottom before send */}

      {/* ── Stacked collapsible sections ─────────────────── */}
      {/* Column hints */}
      <div className="hidden sm:flex gap-2 px-2 text-xs font-medium text-muted-foreground">
        <span className="flex-1">Item</span>
        <span className="w-14 text-center">Qty</span>
        <span className="w-20 text-center">Buy</span>
        <span className="w-20 text-center">Sell</span>
        <span className="w-16 text-center">Markup</span>
        <span className="w-20 text-right">Total</span>
      </div>

      {/* LABOUR */}
      <div>
        <SectionHeader label="Labour" total={labour.sellTotal} isOpen={labourOpen} onToggle={() => setLabourOpen(!labourOpen)} />
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
                  globalMarkupValue={globalMarkupValue}
                  useGlobalMarkup={useGlobalMarkup}
                  onResetToGlobal={resetToGlobal(setLabourItems)}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground mt-1"
              onClick={() => { setPaletteSection("labour"); setPaletteOpen(true); }}
            >
              <Plus className="w-4 h-4" /> Add
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* MATERIALS */}
      <div>
        <SectionHeader label="Materials" total={materials.sellTotal} isOpen={materialsOpen} onToggle={() => setMaterialsOpen(!materialsOpen)} />
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
                  globalMarkupValue={globalMarkupValue}
                  useGlobalMarkup={useGlobalMarkup}
                  onResetToGlobal={resetToGlobal(setMaterialItems)}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground mt-1"
              onClick={() => { setPaletteSection("materials"); setPaletteOpen(true); }}
            >
              <Plus className="w-4 h-4" /> Add
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* EXTRAS */}
      <div>
        <SectionHeader label="Extras" total={extras.sellTotal} isOpen={extrasOpen} onToggle={() => setExtrasOpen(!extrasOpen)} />
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
                  globalMarkupValue={globalMarkupValue}
                  useGlobalMarkup={useGlobalMarkup}
                  onResetToGlobal={resetToGlobal(setExtrasItems)}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground mt-1"
              onClick={() => { setPaletteSection("extras"); setPaletteOpen(true); }}
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

      {/* ── Summary card with margin visibility ──────────── */}
      <Card>
        <CardContent className="pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cost</span>
            <span className="font-medium">${costTotal.toFixed(2)}</span>
          </div>
          {markupAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Markup</span>
              <span className="font-medium text-[hsl(var(--status-green))]">+${markupAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${sellSubtotal.toFixed(2)}</span>
          </div>
          <div className="border-t my-1" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>GST (15%)</span>
            <span>${gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* ── Before-actions slot ──────────────────────────── */}
      {beforeActions}

      {/* ── Cover Letter (before send) ───────────────────── */}
      <Collapsible open={coverLetterOpen} onOpenChange={setCoverLetterOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground w-full justify-start">
            {coverLetterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Cover Letter
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          <Select
            value={coverLetterTemplate}
            onValueChange={(val) => {
              setCoverLetterTemplate(val);
              const tpl = coverLetterTemplates.find((t) => t.id === val);
              if (tpl) setCoverLetter(tpl.body);
            }}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Choose a template…" />
            </SelectTrigger>
            <SelectContent>
              {coverLetterTemplates.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write your cover letter… Use {{customer_name}}, {{business_name}}, {{quote_total}}, {{job_address}}"
            className="min-h-[100px] text-sm"
          />
          <p className="text-[10px] text-muted-foreground">
            Variables: {"{{customer_name}}"}, {"{{business_name}}"}, {"{{quote_total}}"}, {"{{job_address}}"}
          </p>
        </CollapsibleContent>
      </Collapsible>

      {/* ── Action buttons ───────────────────────────────── */}
      <div className="flex gap-2">
        <Button
          size="lg"
          className="flex-1 h-12 gap-2"
          onClick={() =>
            toast({ title: "Quote sent!", description: `$${grandTotal.toFixed(2)} quote sent to ${job.client}` })
          }
        >
          <Send className="w-5 h-5" /> Send Quote
        </Button>
        <QuotePreview
          items={allPreviewItems}
          coverLetter={coverLetter}
          customerName={job.client}
          jobAddress={job.address || ""}
        />
        <Button
          size="lg"
          variant="outline"
          className="h-12 gap-2"
          onClick={() => toast({ title: "Draft saved" })}
        >
          <Save className="w-4 h-4" /> Save
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
