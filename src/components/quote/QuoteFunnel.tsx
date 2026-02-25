import { useState, useMemo } from "react";
import { Search, ArrowLeft, ArrowRight, Wrench, Zap, Settings, Hammer, Bath, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DUMMY_CUSTOMERS, type Customer } from "@/data/dummyCustomers";
import { bundleTemplates, type BundleTemplate } from "@/data/dummyJobDetails";

export interface FunnelResult {
  customer: Customer | null;
  address: string;
  bundle: BundleTemplate | null;
  description: string;
}

interface QuoteFunnelProps {
  onComplete: (data: FunnelResult) => void;
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

/* ── Progress dots ─────────────────────────────────────── */
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            n <= current ? "bg-primary" : "bg-muted"
          }`}
        />
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

      <div className="space-y-2 max-h-[45vh] overflow-y-auto">
        {bundleTemplates.map((b) => {
          const Icon = BUNDLE_ICONS[b.id] || Wrench;
          const total = getBundleTotal(b);
          return (
            <button
              key={b.id}
              onClick={() => onSelectBundle(b)}
              className="w-full text-left rounded-lg border border-border bg-card p-4 hover:bg-muted/60 active:bg-muted transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-card-foreground">{b.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{b.description}</div>
                  <div className="text-xs font-semibold text-primary mt-1">~${total.toLocaleString()}</div>
                </div>
              </div>
            </button>
          );
        })}

        {/* Custom quote card */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
              <Pencil className="w-4.5 h-4.5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-card-foreground">Custom Quote</div>
              <div className="text-xs text-muted-foreground mt-0.5">Describe the work yourself</div>
            </div>
          </div>

          {!showCustom ? (
            <Button
              variant="outline"
              className="w-full mt-3 h-10"
              onClick={() => setShowCustom(true)}
            >
              Write a description
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
      </div>
    </div>
  );
}

/* ── Main Funnel ───────────────────────────────────────── */
export function QuoteFunnel({ onComplete }: QuoteFunnelProps) {
  const [step, setStep] = useState(1);
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
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <StepIndicator current={step} />
          <span className="text-sm font-semibold text-muted-foreground">New Quote</span>
        </div>

        {/* Steps */}
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
    </div>
  );
}
