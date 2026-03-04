import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { useJobPrefix } from "@/contexts/JobPrefixContext";
import { cn } from "@/lib/utils";
import { TutorialBanner } from "@/components/TutorialBanner";

type TimesheetStatus = "draft" | "pending" | "approved" | "rejected";

interface TimesheetJob {
  id: string;
  name: string;
  hours: number;
}

interface TimesheetDay {
  day: string;
  date: string;
  jobs: TimesheetJob[];
  notes: string;
  total: number;
}

const STATUS_BADGE: Record<TimesheetStatus, { label: string; class: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", class: "bg-muted text-muted-foreground", icon: <Clock className="w-3 h-3" /> },
  pending: { label: "Pending Approval", class: "bg-[hsl(var(--status-orange))] text-white", icon: <Send className="w-3 h-3" /> },
  approved: { label: "Approved", class: "bg-[hsl(var(--status-green))] text-white", icon: <CheckCircle2 className="w-3 h-3" /> },
  rejected: { label: "Rejected", class: "bg-destructive text-destructive-foreground", icon: <AlertTriangle className="w-3 h-3" /> },
};

export default function WorkTimesheet() {
  const { formatJobId } = useJobPrefix();

  const [status, setStatus] = useState<TimesheetStatus>("draft");
  const [days, setDays] = useState<TimesheetDay[]>([
    {
      day: "Monday", date: "24 Feb",
      jobs: [
        { id: formatJobId(12), name: "Kitchen Plumbing", hours: 4 },
        { id: formatJobId(15), name: "Hot Water Cylinder Replace", hours: 3.5 },
      ],
      notes: "", total: 7.5,
    },
    {
      day: "Tuesday", date: "25 Feb",
      jobs: [
        { id: formatJobId(15), name: "Hot Water Cylinder Replace", hours: 6 },
        { id: formatJobId(23), name: "Blocked Drain", hours: 2 },
      ],
      notes: "", total: 8,
    },
    {
      day: "Wednesday", date: "26 Feb",
      jobs: [
        { id: formatJobId(8), name: "Switchboard Upgrade", hours: 8 },
      ],
      notes: "Travel to Hamilton — 1hr each way", total: 8,
    },
    {
      day: "Thursday", date: "27 Feb",
      jobs: [
        { id: formatJobId(8), name: "Switchboard Upgrade", hours: 4 },
        { id: formatJobId(31), name: "EV Charger Install", hours: 4 },
      ],
      notes: "", total: 8,
    },
    {
      day: "Friday", date: "28 Feb",
      jobs: [
        { id: formatJobId(31), name: "EV Charger Install", hours: 5 },
        { id: formatJobId(40), name: "Smoke Alarm Compliance", hours: 2.5 },
      ],
      notes: "", total: 7.5,
    },
  ]);

  const weekTotal = days.reduce((sum, d) => sum + d.total, 0);

  const updateNote = (idx: number, note: string) => {
    setDays((prev) => prev.map((d, i) => (i === idx ? { ...d, notes: note } : d)));
  };

  const handleSubmit = () => setStatus("pending");

  const badge = STATUS_BADGE[status];

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <TutorialBanner overrideKey="work-timesheet" />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-foreground">Timesheet</h1>
        <Badge className={cn("gap-1", badge.class)}>
          {badge.icon} {badge.label}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Week of 24 Feb — 28 Feb 2026
      </p>

      <div className="space-y-3">
        {days.map((day, idx) => (
          <Card key={day.day}>
            <CardHeader className="pb-2 px-3 pt-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{day.day} <span className="text-muted-foreground font-normal">{day.date}</span></CardTitle>
                <span className="text-sm font-bold text-foreground">{day.total}h</span>
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-2">
              {day.jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <span className="font-mono text-xs text-muted-foreground mr-2">{job.id}</span>
                    <span className="text-card-foreground">{job.name}</span>
                  </div>
                  <span className="text-muted-foreground shrink-0 ml-2">{job.hours}h</span>
                </div>
              ))}
              <Input
                placeholder="Add notes (e.g. travel time)"
                value={day.notes}
                onChange={(e) => updateNote(idx, e.target.value)}
                className="text-xs h-8 mt-1"
                disabled={status !== "draft"}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly summary */}
      <Card className="mt-4">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-card-foreground">Weekly Total</span>
            <span className="text-lg font-bold text-foreground">{weekTotal}h</span>
          </div>
        </CardContent>
      </Card>

      {status === "draft" && (
        <Button className="w-full mt-4 gap-2 h-12 text-base font-bold" onClick={handleSubmit}>
          <Send className="w-5 h-5" /> Submit Week for Approval
        </Button>
      )}
      {status === "pending" && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Submitted — waiting for manager approval
        </p>
      )}
      {status === "approved" && (
        <p className="text-center text-sm text-[hsl(var(--status-green))] mt-4 font-medium">
          ✓ Approved by manager
        </p>
      )}
      {status === "rejected" && (
        <div className="text-center mt-4">
          <p className="text-sm text-destructive font-medium">Rejected — please review and resubmit</p>
          <Button variant="outline" className="mt-2" onClick={() => setStatus("draft")}>Edit & Resubmit</Button>
        </div>
      )}
    </div>
  );
}
