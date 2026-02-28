import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarIcon, Clock, MapPin, User, FileText, Check } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const TIME_OPTIONS = [
  "07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00",
];

const DURATION_OPTIONS = [
  { value: "1h", label: "1 hour" },
  { value: "2h", label: "2 hours" },
  { value: "3h", label: "3 hours" },
  { value: "4h", label: "4 hours" },
  { value: "half", label: "Half day" },
  { value: "full", label: "Full day" },
];

function StepDots({ current }: { current: number }) {
  const labels = ["Details", "Schedule", "Confirm"];
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center gap-1.5">
          <div className={`w-2.5 h-2.5 rounded-full transition-colors ${n <= current ? "bg-primary" : "bg-muted"}`} />
          <span className={`text-xs ${n <= current ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            {labels[n - 1]}
          </span>
          {n < 3 && <span className="text-muted-foreground/40 text-xs mx-0.5">›</span>}
        </div>
      ))}
    </div>
  );
}

export default function WorkNewJob() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("08:00");
  const [duration, setDuration] = useState("2h");

  const detailsValid = customer.trim() && address.trim();

  const handleConfirm = () => {
    toast({
      title: "Job Created & Scheduled ✅",
      description: `${customer} — ${format(date, "EEE d MMM")} at ${startTime}`,
      duration: 3000,
    });
    navigate("/job/TB-NEW");
  };

  return (
    <div className="px-3 sm:px-6 py-4 max-w-lg mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate("/")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">New Job</h1>
        </div>
        <StepDots current={step} />
      </div>

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-base font-semibold text-card-foreground">Job Details</h2>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Customer Name</Label>
            <Input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="e.g. Sarah Johnson" className="h-12" autoFocus />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Site Address</Label>
            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 42 Queen Street, Auckland" className="h-12" />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Description (optional)</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What's the job? e.g. Replace hot water cylinder" className="min-h-[80px]" />
          </div>

          <Button className="w-full h-12 gap-2" disabled={!detailsValid} onClick={() => setStep(2)}>
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step 2: Schedule */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-base font-semibold text-card-foreground">When?</h2>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" /> Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-12 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "EEEE, d MMMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={d => d && setDate(d)} initialFocus className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full h-12 gap-2" onClick={() => setStep(3)}>
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-base font-semibold text-card-foreground">Confirm & Start</h2>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div><div className="text-sm font-medium text-card-foreground">{customer}</div><div className="text-xs text-muted-foreground">{address}</div></div>
            </div>
            {description && (
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="text-sm text-muted-foreground">{description}</div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <CalendarIcon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-sm text-card-foreground">
                {format(date, "EEEE, d MMMM")} · {startTime} · {DURATION_OPTIONS.find(d => d.value === duration)?.label}
              </div>
            </div>
          </div>

          <Button className="w-full h-12 gap-2" onClick={handleConfirm}>
            <Check className="w-4 h-4" /> Start Job
          </Button>
        </div>
      )}
    </div>
  );
}
