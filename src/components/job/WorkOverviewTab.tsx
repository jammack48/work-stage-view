import { MapPin, Users, Calendar, AlertTriangle, Phone, Mail, User, Navigation, PhoneCall } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JobDetail } from "@/data/dummyJobDetails";
import { useJobPrefix } from "@/contexts/JobPrefixContext";

interface WorkOverviewTabProps {
  job: JobDetail;
}

function getStageSummary(stage: string): string {
  const s = stage.toLowerCase();
  if (s.includes("lead")) return "Lead to follow up";
  if (s.includes("quote")) return "Quote awaiting acceptance";
  if (s.includes("progress") || s.includes("job")) return "Job in progress";
  if (s.includes("invoice")) return "Ready to invoice";
  if (s.includes("complete") || s.includes("paid")) return "Job complete";
  return stage;
}

export function WorkOverviewTab({ job }: WorkOverviewTabProps) {
  const { prefix } = useJobPrefix();
  const displayId = job.id.replace(/^[A-Z]+-/, `${prefix}-`);
  const mapsUrl = job.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
      {/* Status Card — no value/pricing */}
      <Card>
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{job.stage}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{getStageSummary(job.stage)}</p>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Job</span>
              <span className="font-medium">{job.jobName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ID</span>
              <span className="font-mono text-xs">{displayId}</span>
            </div>
          </div>
          {(job.urgent || job.ageDays > 7) && (
            <div className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium ${
              job.urgent
                ? "bg-destructive/10 text-destructive"
                : "bg-[hsl(var(--status-orange)/0.15)] text-[hsl(var(--status-orange))]"
            }`}>
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {job.urgent ? "Urgent — immediate attention" : `Overdue — ${job.ageDays} days`}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer + Quick Actions */}
      <Card>
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <User className="w-4 h-4 text-muted-foreground" /> Customer
          </div>
          <p className="text-sm font-semibold text-card-foreground">{job.client || "No client assigned"}</p>
          <div className="flex gap-2">
            {job.clientPhone && (
              <Button size="sm" variant="outline" className="gap-1.5 flex-1" asChild>
                <a href={`tel:${job.clientPhone}`}>
                  <PhoneCall className="w-3.5 h-3.5" /> Call
                </a>
              </Button>
            )}
            {mapsUrl && (
              <Button size="sm" variant="outline" className="gap-1.5 flex-1" asChild>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="w-3.5 h-3.5" /> Navigate
                </a>
              </Button>
            )}
          </div>
          {job.clientPhone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{job.clientPhone}</span>
            </div>
          )}
          {job.clientEmail && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="truncate">{job.clientEmail}</span>
            </div>
          )}
          {job.address && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground" />
              <span>{job.address}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staff + Schedule */}
      <Card>
        <CardContent className="p-3 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Users className="w-4 h-4 text-muted-foreground" /> Staff & Schedule
          </div>
          {job.staff.length === 0 ? (
            <p className="text-xs text-muted-foreground">No staff assigned</p>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {job.staff.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                    {s.avatar}
                  </div>
                  <span className="text-xs">{s.name}</span>
                </div>
              ))}
            </div>
          )}
          <div className="border-t border-border/50 pt-2 space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>Start:</span>
              <span className="text-card-foreground font-medium">{job.startDate || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>Due:</span>
              <span className="text-card-foreground font-medium">{job.dueDate || "—"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site */}
      <Card>
        <CardContent className="p-3 space-y-2">
          <div className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" /> Site
          </div>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground" />
            <span>{job.address || "No address set"}</span>
          </div>
          {mapsUrl && (
            <Button size="sm" variant="default" className="w-full gap-1.5" asChild>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="w-4 h-4" /> Open in Maps
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
