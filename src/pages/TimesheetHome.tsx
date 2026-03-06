import { useMemo, useState } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock3, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_JOBS } from "@/components/schedule/scheduleData";
import { useJobPrefix } from "@/contexts/JobPrefixContext";

const CURRENT_WORKER = "Dave";

export default function TimesheetHome() {
  const navigate = useNavigate();
  const { prefix } = useJobPrefix();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  const workerJobs = useMemo(
    () => DEMO_JOBS.filter((job) => job.assignedTo === CURRENT_WORKER).sort((a, b) => a.dayOffset - b.dayOffset || a.startHour - b.startHour),
    []
  );

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="w-4 h-4" /> My Week
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">
            {format(weekStart, "d MMM")} - {format(addDays(weekStart, 6), "d MMM yyyy")}
          </div>
          <div className="grid gap-2">
            {workerJobs.map((job) => {
              const dayDate = addDays(weekStart, job.dayOffset);
              const displayId = job.id.replace(/^[A-Z]+-/, `${prefix}-`);
              return (
                <button
                  key={job.id}
                  onClick={() => navigate(`/job/${job.id}`)}
                  className="text-left rounded-lg border border-border bg-card p-3 hover:bg-accent/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{job.jobName}</p>
                      <p className="text-xs text-muted-foreground truncate">{job.client} • {job.address}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{job.status}</Badge>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {displayId}</span>
                    <span className="flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" /> {format(dayDate, "EEE")} {job.startHour}:00</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setWeekStart((d) => addDays(d, -7))}>Previous Week</Button>
            <Button variant="outline" size="sm" onClick={() => setWeekStart((d) => addDays(d, 7))}>Next Week</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
