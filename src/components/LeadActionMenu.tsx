import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, FileText, Archive, XCircle, Clock, Phone, Mail, MoreHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import type { Job } from "@/data/dummyJobs";

interface LeadActionMenuProps {
  job: Job;
  children: React.ReactElement;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
}

const ACTIONS = [
  { id: "quote", label: "Create Quote", tip: "Build a quote for this lead", icon: FileText, color: "text-[hsl(var(--status-green))]" },
  { id: "schedule", label: "Schedule Site Visit", tip: "Book a time to visit", icon: CalendarPlus, color: "text-primary" },
  { id: "call", label: "Call Customer", tip: "Give them a ring", icon: Phone, color: "text-primary" },
  { id: "email", label: "Send Email", tip: "Fire off an email", icon: Mail, color: "text-primary" },
  { id: "snooze", label: "Follow Up Later", tip: "Remind me in a few days", icon: Clock, color: "text-[hsl(var(--status-orange))]" },
  { id: "archive", label: "Archive Lead", tip: "Not interested — file it away", icon: Archive, color: "text-muted-foreground" },
  { id: "dead", label: "Mark as Dead", tip: "This one's gone cold", icon: XCircle, color: "text-destructive" },
];

export function LeadActionMenu({ job, children, align = "start", side = "bottom" }: LeadActionMenuProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleAction = (id: string) => {
    setOpen(false);
    switch (id) {
      case "quote":
        navigate(`/quote/${job.id}`);
        break;
      case "schedule":
        navigate(`/schedule`);
        toast.success(`Schedule site visit for ${job.client}`);
        break;
      case "call":
        toast.info(`Calling ${job.client}...`);
        break;
      case "email":
        toast.info(`Opening email to ${job.client}...`);
        break;
      case "snooze":
        toast.success(`Will remind you about ${job.client} in 3 days`);
        break;
      case "archive":
        toast.success(`${job.client} archived`);
        break;
      case "dead":
        toast.success(`${job.client} marked as dead lead`);
        break;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        className="w-56 p-1.5 rounded-xl"
      >
        <div className="px-2.5 py-1.5 border-b border-border mb-1">
          <p className="text-xs font-bold text-card-foreground truncate">{job.client}</p>
          <p className="text-[10px] text-muted-foreground truncate">{job.jobName}</p>
        </div>
        <div className="flex flex-col gap-0.5">
          {ACTIONS.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => handleAction(id)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-card-foreground hover:bg-accent transition-colors text-left"
            >
              <Icon className={`w-4 h-4 shrink-0 ${color}`} />
              {label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
