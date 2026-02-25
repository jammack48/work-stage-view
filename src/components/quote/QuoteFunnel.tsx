import { useState, useMemo } from "react";
import { Search, ArrowLeft, ArrowRight, Wrench, Zap, Settings, Hammer, Bath, Pencil, ChevronsUpDown, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DUMMY_CUSTOMERS, type Customer } from "@/data/dummyCustomers";
import { bundleTemplates, type BundleTemplate } from "@/data/dummyJobDetails";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export interface FunnelResult {
  customer: Customer | null;
  address: string;
  bundle: BundleTemplate | null;
  description: string;
}

interface QuoteFunnelProps {
  onComplete: (data: FunnelResult) => void;
  onStepChange?: (step: number) => void;
}

const BUNDLE_ICONS: Record<string, React.ElementType> = {
  b1: Wrench,
  b2: Zap,
  b3: Settings,
  b4: Hammer,
  b5: Bath,
};

function getBundleTotal(b: BundleTemplate) {
  const labour = b.labour.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const materials = b.materials.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const extras = b.extras.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  return labour + materials + extras;
}

/* ── Progress dots (exported for parent heading bar) ──── */
export function StepIndicator({ current }: { current: number }) {
  const labels = ["Customer", "Address", "Scope"];
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center gap-1.5">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              n <= current ? "bg-primary" : "bg-muted"
            }`}
          />
          <span className={`text-xs ${n <= current ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            {labels[n - 1]}
          </span>
          {n < 3 && <span className="text-muted-foreground/40 text-xs mx-0.5">›</span>}
        </div>
      ))}
    </div>
  );
}

/* ── Step 1: Select Customer ───────────────────────────── */
function StepCustomer({ onSelect, onSkip }: { onSelect: (c: Customer) => void; onSkip: () => void }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return DUMMY_CUSTOMERS;
    const q = search.toLowerCase();
    return DUMMY_CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-card-foreground">Who is this quote for?</h2>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers…"
          className="pl-10 h-12"
          autoFocus
        />
      </div>

      <div className="space-y-2 max-h-[50vh] overflow-y-auto">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className="w-full text-left rounded-lg border border-border bg-card p-4 min-h-[56px] hover:bg-muted/60 active:bg-muted transition-colors cursor-pointer"
          >
            <div className="font-medium text-sm text-card-foreground">{c.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {c.phone} · {c.address}
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No customers found</p>
        )}
      </div>

      <Button
        variant="ghost"
        className="w-full h-12 text-muted-foreground"
        onClick={onSkip}
      >
        Skip — no customer yet
      </Button>
    </div>
  );
}

/* ── Step 2: Confirm Address ───────────────────────────── */
function StepAddress({
  address,
  onAddressChange,
  onNext,
  onBack,
}: {
  address: string;
  onAddressChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h2 className="text-lg font-bold text-card-foreground">Site Address</h2>

      <Input
        value={address}
        onChange={(e) => onAddressChange(e.target.value)}
        placeholder="Enter site address…"
        className="h-12"
        autoFocus
      />

      <Button className="w-full h-12 gap-2" onClick={onNext}>
        Next <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

/* ── Bundle Search Dropdown ─────────────────────────────── */
function BundleSearchDropdown({ onSelect }: { onSelect: (b: BundleTemplate) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full h-12 justify-between text-sm font-normal">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Package className="w-4 h-4" /> Select a bundle…
          </span>
          <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
        <Command>
          <CommandInput placeholder="Search bundles…" />
          <CommandList>
            <CommandEmpty>No bundles found</CommandEmpty>
            <CommandGroup>
              {bundleTemplates.map(b => {
                const Icon = BUNDLE_ICONS[b.id] || Wrench;
                const total = getBundleTotal(b);
                return (
                  <CommandItem key={b.id} onSelect={() => { onSelect(b); setOpen(false); }} className="py-2.5">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{b.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{b.description}</div>
                      </div>
                      <span className="text-xs font-semibold text-primary shrink-0">~${total.toLocaleString()}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/* ── Step 3: Bundle or Custom ──────────────────────────── */
function StepBundle({
  onSelectBundle,
  onCustom,
  onBack,
}: {
  onSelectBundle: (b: BundleTemplate) => void;
  onCustom: (desc: string) => void;
  onBack: () => void;
}) {
  const [customDesc, setCustomDesc] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h2 className="text-lg font-bold text-card-foreground">What's the job?</h2>

      <div className="space-y-3 max-h-[55vh] overflow-y-auto">
        {/* Custom job — prominent first */}
        <div className="rounded-xl border-2 border-primary/30 bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Pencil className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-card-foreground">Custom Job</div>
              <div className="text-xs text-muted-foreground mt-0.5">Describe the work in your own words</div>
            </div>
          </div>

          {!showCustom ? (
            <Button
              className="w-full mt-3 h-12 gap-2"
              onClick={() => setShowCustom(true)}
            >
              <Pencil className="w-4 h-4" /> Write a description
            </Button>
          ) : (
            <div className="mt-3 space-y-3">
              <Textarea
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="Describe the work — e.g. 'Replace hot water cylinder and reroute pipework in ground floor bathroom'"
                className="min-h-[80px]"
                autoFocus
              />
              <Button
                className="w-full h-12"
                disabled={!customDesc.trim()}
                onClick={() => onCustom(customDesc.trim())}
              >
                Start Quote
              </Button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium">or choose a bundle</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Searchable bundle dropdown */}
        <BundleSearchDropdown onSelect={onSelectBundle} />
      </div>
    </div>
  );
}

/* ── Main Funnel (pure content, no page shell) ─────────── */
export function QuoteFunnel({ onComplete, onStepChange }: QuoteFunnelProps) {
  const [step, _setStep] = useState(1);
  const setStep = (s: number) => { _setStep(s); onStepChange?.(s); };
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [address, setAddress] = useState("");

  const handleSelectCustomer = (c: Customer) => {
    setCustomer(c);
    setAddress(c.address);
    setStep(2);
  };

  const handleSkipCustomer = () => {
    setCustomer(null);
    setAddress("");
    setStep(2);
  };

  const handleSelectBundle = (b: BundleTemplate) => {
    onComplete({ customer, address, bundle: b, description: b.description || b.name });
  };

  const handleCustomDescription = (desc: string) => {
    onComplete({ customer, address, bundle: null, description: desc });
  };

  return (
    <div className="max-w-lg mx-auto">
      {step === 1 && (
        <StepCustomer onSelect={handleSelectCustomer} onSkip={handleSkipCustomer} />
      )}
      {step === 2 && (
        <StepAddress
          address={address}
          onAddressChange={setAddress}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <StepBundle
          onSelectBundle={handleSelectBundle}
          onCustom={handleCustomDescription}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}

/* Export step hook for parent to track current step */
export function useQuoteFunnelStep() {
  const [step, setStep] = useState(1);
  return { step, setStep };
}
