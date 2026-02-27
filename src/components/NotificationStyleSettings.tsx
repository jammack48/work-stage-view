import { Mail } from "lucide-react";
import { useNotificationStyle, type NotificationStyle } from "@/contexts/NotificationStyleContext";
import { cn } from "@/lib/utils";

const OPTIONS: { id: NotificationStyle; label: string; desc: string }[] = [
  { id: "icon", label: "Blue Icon", desc: "Show a blue mail icon next to unread jobs" },
  { id: "pulse", label: "Card Pulse", desc: "Pulse the entire card with a vibrating effect" },
];

export function NotificationStyleSettings({ onClose }: { onClose: () => void }) {
  const { style, setStyle } = useNotificationStyle();

  return (
    <div className="animate-fade-in bg-card rounded-xl shadow-2xl border border-border p-4 space-y-3 max-w-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-card-foreground flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          Unread Notification Style
        </h3>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">Done</button>
      </div>
      <div className="space-y-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setStyle(opt.id)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
              style === opt.id
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-accent/50"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
              style === opt.id ? "border-primary" : "border-muted-foreground/40"
            )}>
              {style === opt.id && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <div>
              <div className="text-sm font-medium text-card-foreground">{opt.label}</div>
              <div className="text-xs text-muted-foreground">{opt.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
