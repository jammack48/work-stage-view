import { Clock, Phone, Mail, FileText, CheckCircle, AlertTriangle, UserPlus, DollarSign, Briefcase } from "lucide-react";
import type { JobDetail } from "@/data/dummyJobDetails";

interface HistoryTabProps {
  job: JobDetail;
}

interface HistoryEvent {
  id: string;
  date: string;
  time: string;
  action: string;
  detail: string;
  icon: React.ElementType;
  iconColor: string;
}

function generateHistory(job: JobDetail): HistoryEvent[] {
  const events: HistoryEvent[] = [
    { id: "h1", date: "Mon 3 Feb", time: "9:15 AM", action: "Job Created", detail: `${job.jobName} added to pipeline as Lead`, icon: Briefcase, iconColor: "text-primary" },
    { id: "h2", date: "Mon 3 Feb", time: "9:20 AM", action: "Customer Linked", detail: `Linked to ${job.client || "customer"}`, icon: UserPlus, iconColor: "text-primary" },
    { id: "h3", date: "Tue 4 Feb", time: "10:30 AM", action: "Phone Call", detail: `Called ${job.client || "customer"} to discuss scope`, icon: Phone, iconColor: "text-[hsl(var(--status-green))]" },
    { id: "h4", date: "Wed 5 Feb", time: "2:00 PM", action: "Site Visit", detail: "Site walkthrough completed", icon: CheckCircle, iconColor: "text-[hsl(var(--status-green))]" },
    { id: "h5", date: "Thu 6 Feb", time: "11:45 AM", action: "Quote Sent", detail: `Quote for $${job.value.toLocaleString()} emailed to client`, icon: FileText, iconColor: "text-[hsl(var(--status-orange))]" },
    { id: "h6", date: "Fri 7 Feb", time: "3:15 PM", action: "Email Sent", detail: "Follow-up email sent re: quote", icon: Mail, iconColor: "text-primary" },
  ];

  if (job.stage.includes("Progress") || job.stage.includes("Invoice") || job.stage.includes("Paid")) {
    events.push(
      { id: "h7", date: "Mon 10 Feb", time: "8:00 AM", action: "Quote Accepted", detail: "Client confirmed go-ahead via phone", icon: CheckCircle, iconColor: "text-[hsl(var(--status-green))]" },
      { id: "h8", date: "Mon 10 Feb", time: "8:30 AM", action: "Job Started", detail: `${job.staff[0]?.name || "Staff"} on site`, icon: Briefcase, iconColor: "text-primary" },
    );
  }

  if (job.stage.includes("Invoice") || job.stage.includes("Paid")) {
    events.push(
      { id: "h9", date: "Fri 14 Feb", time: "4:00 PM", action: "Job Completed", detail: "All work completed, awaiting invoice", icon: CheckCircle, iconColor: "text-[hsl(var(--status-green))]" },
    );
  }

  if (job.stage.includes("Paid")) {
    events.push(
      { id: "h10", date: "Mon 17 Feb", time: "9:00 AM", action: "Invoice Sent", detail: `Invoice for $${job.value.toLocaleString()} sent`, icon: DollarSign, iconColor: "text-[hsl(var(--status-green))]" },
      { id: "h11", date: "Wed 19 Feb", time: "11:30 AM", action: "Payment Received", detail: "Paid in full", icon: DollarSign, iconColor: "text-[hsl(var(--status-green))]" },
    );
  }

  if (job.urgent) {
    events.push(
      { id: "h12", date: "Today", time: "8:00 AM", action: "Flagged Urgent", detail: "Marked as urgent — immediate attention required", icon: AlertTriangle, iconColor: "text-destructive" },
    );
  }

  return events.reverse();
}

export function HistoryTab({ job }: HistoryTabProps) {
  const events = generateHistory(job);

  return (
    <div className="space-y-1">
      <h2 className="text-lg font-semibold text-card-foreground mb-4">Job History</h2>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

        {events.map((event, i) => (
          <div key={event.id} className="relative flex gap-3 pb-4">
            {/* Icon dot */}
            <div className={`relative z-10 w-[31px] h-[31px] rounded-full bg-card border border-border flex items-center justify-center shrink-0 ${event.iconColor}`}>
              <event.icon className="w-3.5 h-3.5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-medium text-card-foreground">{event.action}</span>
                <span className="text-[11px] text-muted-foreground">{event.date} · {event.time}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{event.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
