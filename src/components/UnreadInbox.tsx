import { Mail, MessageSquare, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDemoData } from "@/contexts/DemoDataContext";
import type { DemoJob as Job } from "@/types/demoData";
import { cn } from "@/lib/utils";

function buildUnreadMessages(jobs: Job[]): { job: Job; preview: string; channel: "sms" | "email"; time: string }[] {
  const unreadJobs = jobs.filter(j => j.hasUnread);
  const msgs = [
    { preview: "Thanks! Will have a look tonight and get back to you 👍", channel: "sms" as const, time: "2h ago" },
    { preview: "Hey, looks good! Can you start next week?", channel: "sms" as const, time: "5h ago" },
    { preview: "Re: Following up on your quote — Yep all good to go ahead...", channel: "email" as const, time: "1d ago" },
    { preview: "Can we change the install date to Friday?", channel: "sms" as const, time: "1d ago" },
    { preview: "Re: Invoice #2041 — Payment sent today, thanks!", channel: "email" as const, time: "2d ago" },
    { preview: "Is there a warranty on the parts?", channel: "sms" as const, time: "3d ago" },
  ];
  return unreadJobs.map((job, i) => ({
    job,
    ...msgs[i % msgs.length],
  }));
}

interface UnreadInboxProps {
  onClose: () => void;
}

export function UnreadInbox({ onClose }: UnreadInboxProps) {
  const navigate = useNavigate();
  const { jobs, customers } = useDemoData();
  const unreadMessages = buildUnreadMessages(jobs);

  return (
    <div className="animate-fade-in bg-card rounded-xl shadow-2xl border border-border w-[calc(100vw-2rem)] sm:w-[340px] max-h-[420px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-bold text-card-foreground flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          Unread Messages
          <span className="bg-primary/15 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {unreadMessages.length}
          </span>
        </h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-accent transition-colors">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/50">
        {unreadMessages.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No unread messages 🎉
          </div>
        ) : (
          unreadMessages.map((msg, i) => (
            <button
              key={i}
              className="w-full text-left px-4 py-3 hover:bg-accent/50 transition-colors flex gap-3 items-start group"
              onClick={() => {
                onClose();
                const customer = customers.find((c) => c.name === msg.job.client);
                if (customer) {
                  navigate(`/customer/${customer.id}?tab=messages`);
                }
              }}
            >
              {/* Channel icon */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                msg.channel === "sms" ? "bg-primary/15 text-primary" : "bg-accent text-accent-foreground"
              )}>
                {msg.channel === "sms" ? <MessageSquare className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-card-foreground truncate">{msg.job.client}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{msg.time}</span>
                </div>
                <div className="text-xs text-muted-foreground truncate mt-0.5">{msg.job.jobName} · {msg.job.stage}</div>
                <div className="text-xs text-card-foreground/80 truncate mt-1">{msg.preview}</div>
              </div>

              {/* Arrow on hover */}
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-2" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
