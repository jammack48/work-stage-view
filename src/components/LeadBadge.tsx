import { cn } from "@/lib/utils";

interface LeadBadgeProps {
  className?: string;
  compact?: boolean;
}

export function LeadBadge({ className, compact = false }: LeadBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/35 bg-black/25 text-white uppercase tracking-wide shadow-sm",
        compact ? "h-4 px-1.5 text-[9px] font-semibold" : "px-2 py-0.5 text-[10px] font-semibold",
        className,
      )}
    >
      Lead
    </span>
  );
}
