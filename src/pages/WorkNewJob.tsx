import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { QuoteFunnel, StepIndicator, type FunnelResult } from "@/components/quote/QuoteFunnel";
import { toast } from "@/hooks/use-toast";

export default function WorkNewJob() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleComplete = (data: FunnelResult) => {
    toast({
      title: "Job Created ✅",
      description: `${data.bundle?.name || "Custom job"} for ${data.customer?.name || "No customer"} at ${data.address || "No address"}`,
      duration: 3000,
    });
    navigate("/");
  };

  return (
    <div className="px-3 sm:px-6 py-4 max-w-lg mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">New Job</h1>
        </div>
        <StepIndicator current={step} />
      </div>

      <QuoteFunnel
        onComplete={handleComplete}
        onStepChange={setStep}
        label="job"
      />
    </div>
  );
}
