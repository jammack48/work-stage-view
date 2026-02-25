import { useNavigate, useSearchParams } from "react-router-dom";

import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

const ComingSoon = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const tool = params.get("tool") || "This feature";

  return (
    <>
      <div className="flex flex-col items-center justify-center px-4 py-24 text-center gap-4">
        <Construction className="w-14 h-14 text-muted-foreground/50" />
        <h2 className="text-xl font-bold text-foreground">{tool}</h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          Coming soon. We're building this out — check back shortly.
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate("/")} className="mt-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Hub
        </Button>
      </div>
    </>
  );
};

export default ComingSoon;
