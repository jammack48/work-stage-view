import { Mail, MessageSquare, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionBarProps {
  count: number;
  onSendSms: () => void;
  onSendEmail: () => void;
  onScheduleReminder: () => void;
  onClear: () => void;
}

export function BulkActionBar({ count, onSendSms, onSendEmail, onScheduleReminder, onClear }: BulkActionBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-card border border-border rounded-xl shadow-lg px-4 py-2.5">
      <span className="text-sm font-medium text-card-foreground mr-1">{count} selected</span>
      <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={onSendSms}>
        <MessageSquare className="w-3.5 h-3.5" />SMS
      </Button>
      <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={onSendEmail}>
        <Mail className="w-3.5 h-3.5" />Email
      </Button>
      <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={onScheduleReminder}>
        <CalendarClock className="w-3.5 h-3.5" />Reminder
      </Button>
      <Button size="sm" variant="ghost" className="text-xs text-muted-foreground" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}
