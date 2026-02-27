import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import type { QuoteBlock } from "@/components/job/QuoteTab";

interface QuotePreviewProps {
  blocks: QuoteBlock[];
  coverLetter: string;
  customerName: string;
  jobAddress: string;
  businessName?: string;
  gstRate?: number;
}

type Preset = "detailed" | "summary" | "sub-section" | "total-only";

export function QuotePreview({
  blocks,
  coverLetter,
  customerName,
  jobAddress,
  businessName = "Thompson Plumbing & Electrical",
  gstRate = 0.15,
}: QuotePreviewProps) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<Preset>("detailed");
  const [showLineItems, setShowLineItems] = useState(true);
  const [showQty, setShowQty] = useState(true);
  const [showUnitPrices, setShowUnitPrices] = useState(true);
  const [showSections, setShowSections] = useState(true);
  const [showMarkup, setShowMarkup] = useState(false);
  const [showBlocks, setShowBlocks] = useState(true);

  const applyPreset = (p: Preset) => {
    setPreset(p);
    if (p === "detailed") {
      setShowLineItems(true); setShowQty(true); setShowUnitPrices(true); setShowSections(true); setShowMarkup(false); setShowBlocks(true);
    } else if (p === "summary") {
      setShowLineItems(true); setShowQty(false); setShowUnitPrices(false); setShowSections(true); setShowMarkup(false); setShowBlocks(true);
    } else if (p === "sub-section") {
      setShowLineItems(false); setShowQty(false); setShowUnitPrices(false); setShowSections(true); setShowMarkup(false); setShowBlocks(true);
    } else {
      setShowLineItems(false); setShowQty(false); setShowUnitPrices(false); setShowSections(false); setShowMarkup(false); setShowBlocks(false);
    }
  };

  // Flatten for totals
  const allItems = blocks.flatMap((b) => [
    ...b.labour.map((i) => ({ ...i, section: "labour" as const })),
    ...b.materials.map((i) => ({ ...i, section: "materials" as const })),
    ...b.extras.map((i) => ({ ...i, section: "extras" as const })),
  ]);

  const subtotal = allItems.reduce((s, i) => s + i.qty * i.sellPrice, 0);
  const gst = subtotal * gstRate;
  const total = subtotal + gst;

  const resolvedCoverLetter = coverLetter
    .replace(/\{\{customer_name\}\}/g, customerName)
    .replace(/\{\{business_name\}\}/g, businessName)
    .replace(/\{\{quote_total\}\}/g, `$${total.toFixed(2)}`)
    .replace(/\{\{job_address\}\}/g, jobAddress);

  const renderSectionItems = (items: typeof allItems, sectionLabel: string) => {
    const sectionTotal = items.reduce((s, i) => s + i.qty * i.sellPrice, 0);
    if (items.length === 0) return null;
    return (
      <div key={sectionLabel}>
        <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">{sectionLabel}</p>
        {showLineItems && items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-xs py-0.5">
            <span>
              {item.name}
              {showQty && <span className="text-muted-foreground"> × {item.qty}</span>}
              {showUnitPrices && <span className="text-muted-foreground"> @ ${item.sellPrice.toFixed(2)}</span>}
              {showMarkup && item.markup > 0 && <span className="text-muted-foreground"> (+{Math.round(item.markup)}%)</span>}
            </span>
            <span className="font-medium">${(item.qty * item.sellPrice).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between text-xs font-medium border-t border-dashed border-border mt-1 pt-0.5">
          <span>{sectionLabel} subtotal</span>
          <span>${sectionTotal.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="h-12 gap-2"><Eye className="w-4 h-4" /> Preview</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Quote Preview</DialogTitle></DialogHeader>

        {/* Presets */}
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {(["detailed", "summary", "sub-section", "total-only"] as Preset[]).map((p) => (
            <Button key={p} size="sm" variant={preset === p ? "default" : "outline"} className="text-xs capitalize h-7" onClick={() => applyPreset(p)}>{p.replace("-", " ")}</Button>
          ))}
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          {[
            ["Jobs", showBlocks, setShowBlocks],
            ["Line Items", showLineItems, setShowLineItems],
            ["Quantities", showQty, setShowQty],
            ["Unit Prices", showUnitPrices, setShowUnitPrices],
            ["Sections", showSections, setShowSections],
            ["Markup", showMarkup, setShowMarkup],
          ].map(([label, val, setter]) => (
            <div key={label as string} className="flex items-center gap-1.5">
              <Switch checked={val as boolean} onCheckedChange={(v) => { (setter as (v: boolean) => void)(v); setPreset("detailed"); }} className="scale-75" />
              <Label className="text-xs">{label as string}</Label>
            </div>
          ))}
        </div>

        {/* Preview document */}
        <div className="border border-border rounded-lg p-4 bg-card space-y-3 text-sm">
          <div className="text-center space-y-0.5">
            <p className="font-bold text-base">{businessName}</p>
            <p className="text-xs text-muted-foreground">Quote</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-muted-foreground">To:</span> {customerName}</div>
            <div><span className="text-muted-foreground">Address:</span> {jobAddress}</div>
            <div><span className="text-muted-foreground">Date:</span> {new Date().toLocaleDateString()}</div>
          </div>

          {resolvedCoverLetter && (
            <p className="text-xs whitespace-pre-line border-t border-border pt-2">{resolvedCoverLetter}</p>
          )}

          {/* Render per-block or flat */}
          {(showLineItems || showSections) && (
            <div className="space-y-3 border-t border-border pt-2">
              {showBlocks ? (
                blocks.map((block) => {
                  const blockTotal = [...block.labour, ...block.materials, ...block.extras].reduce((s, i) => s + i.qty * i.sellPrice, 0);
                  return (
                    <div key={block.id} className="space-y-1">
                      <p className="text-sm font-bold">{block.name || "Job"}{block.qty > 1 && <span className="text-muted-foreground font-normal"> ×{block.qty}</span>}</p>
                      {block.description && <p className="text-xs text-muted-foreground">{block.description}</p>}
                      {showSections ? (
                        <>
                          {renderSectionItems(block.labour.map((i) => ({ ...i, section: "labour" as const })), "Labour")}
                          {renderSectionItems(block.materials.map((i) => ({ ...i, section: "materials" as const })), "Materials")}
                          {renderSectionItems(block.extras.map((i) => ({ ...i, section: "extras" as const })), "Extras")}
                        </>
                      ) : (
                        showLineItems && [...block.labour, ...block.materials, ...block.extras].map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs py-0.5">
                            <span>{item.name}{showQty && <span className="text-muted-foreground"> × {item.qty}</span>}{showUnitPrices && <span className="text-muted-foreground"> @ ${item.sellPrice.toFixed(2)}</span>}</span>
                            <span className="font-medium">${(item.qty * item.sellPrice).toFixed(2)}</span>
                          </div>
                        ))
                      )}
                      <div className="flex justify-between text-xs font-bold border-t border-border pt-1 mt-1">
                        <span>{block.name || "Job"} total</span>
                        <span>${blockTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Flat view without block grouping
                showSections ? (
                  <>
                    {renderSectionItems(allItems.filter((i) => i.section === "labour"), "Labour")}
                    {renderSectionItems(allItems.filter((i) => i.section === "materials"), "Materials")}
                    {renderSectionItems(allItems.filter((i) => i.section === "extras"), "Extras")}
                  </>
                ) : (
                  showLineItems && allItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs py-0.5">
                      <span>{item.name}{showQty && <span className="text-muted-foreground"> × {item.qty}</span>}</span>
                      <span className="font-medium">${(item.qty * item.sellPrice).toFixed(2)}</span>
                    </div>
                  ))
                )
              )}
            </div>
          )}

          <div className="border-t border-border pt-2 space-y-1">
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">GST (15%)</span><span>${gst.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
