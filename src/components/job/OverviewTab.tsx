import { MapPin, Users, Calendar, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobDetail } from "@/data/dummyJobDetails";
import { cn } from "@/lib/utils";

interface OverviewTabProps {
  job: JobDetail;
}

export function OverviewTab({ job }: OverviewTabProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Job Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Job Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{job.description}</p>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
            <span className="text-card-foreground">{job.address || "No address set"}</span>
          </div>
          {/* Map placeholder */}
          <div className="w-full h-32 rounded-lg bg-secondary flex items-center justify-center">
            <MapPin className="w-8 h-8 text-muted-foreground/40" />
          </div>
        </CardContent>
      </Card>

      {/* Assigned Staff */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4" /> Staff
          </CardTitle>
        </CardHeader>
        <CardContent>
          {job.staff.length === 0 ? (
            <p className="text-sm text-muted-foreground">No staff assigned</p>
          ) : (
            <div className="space-y-3">
              {job.staff.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {s.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-card-foreground">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Start</span>
            <span className="text-card-foreground font-medium">{job.startDate || "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Due</span>
            <span className="text-card-foreground font-medium">{job.dueDate || "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Age</span>
            <span className="text-card-foreground font-medium">{job.ageDays} days</span>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {job.urgent ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Urgent — requires immediate attention
            </div>
          ) : job.ageDays > 7 ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[hsl(var(--status-orange)/0.15)] text-[hsl(var(--status-orange))] text-sm font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Overdue — {job.ageDays} days in stage
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No alerts</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
