import { useState, useEffect, useCallback } from "react";
import { Database } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { BACKEND_URL } from "@/config/env";

export function BackendStatus() {
  const [connected, setConnected] = useState<boolean | null>(null);

  const check = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/health`, { signal: AbortSignal.timeout(5000) });
      setConnected(res.ok);
    } catch {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, [check]);

  const color =
    connected === null
      ? "text-muted-foreground"
      : connected
        ? "text-[hsl(var(--status-green))]"
        : "text-destructive";

  const label =
    connected === null
      ? "Checking backend…"
      : connected
        ? "Backend connected"
        : "Backend offline";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors">
          <Database className={`w-4.5 h-4.5 ${color} transition-colors`} />
        </button>
      </TooltipTrigger>
      <TooltipContent><p className="text-xs">{label}</p></TooltipContent>
    </Tooltip>
  );
}
