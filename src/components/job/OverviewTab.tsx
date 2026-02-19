import { MapPin, Users, Calendar, AlertTriangle, Phone, Mail, User, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobDetail } from "@/data/dummyJobDetails";

interface OverviewTabProps {
  job: JobDetail;
}

export function OverviewTab({ job }: OverviewTabProps) {
  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      {/* 1. Job Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Job Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Job</span>
            <span className="text-card-foreground font-medium">{job.jobName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Stage</span>
            <span className="text-card-foreground font-medium">{job.stage}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Value</span>
            <span className="text-card-foreground font-bold">${job.value.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">ID</span>
            <span className="text-card-foreground font-mono text-xs">{job.id}</span>
          </div>
          {job.description && (
            <p className="text-sm text-muted-foreground pt-1 border-t border-border/50">{job.description}</p>
          )}
          {(job.urgent || job.ageDays > 7) && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
              job.urgent
                ? "bg-destructive/10 text-destructive"
                : "bg-[hsl(var(--status-orange)/0.15)] text-[hsl(var(--status-orange))]"
            }`}>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {job.urgent ? "Urgent — requires immediate attention" : `Overdue — ${job.ageDays} days in stage`}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Customer Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" /> Customer Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Name</span>
            <span className="text-card-foreground font-medium">{job.client || "—"}</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground">Phone</span>
            <a href={`tel:${job.clientPhone}`} className="text-primary font-medium flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> {job.clientPhone || "—"}
            </a>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground">Email</span>
            <a href={`mailto:${job.clientEmail}`} className="text-primary font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {job.clientEmail || "—"}
            </a>
          </div>
        </CardContent>
      </Card>

      {/* 3. Site / Contact Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Site Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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

      {/* 4. Assigned Staff */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4" /> Assigned Staff
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

      {/* 5. Schedule */}
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
    </div>
  );
}
