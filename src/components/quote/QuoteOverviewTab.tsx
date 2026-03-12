import { Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { JobDetail } from "@/data/dummyJobDetails";

interface QuoteOverviewTabProps {
  job: JobDetail;
  scope: string;
  onScopeChange: (val: string) => void;
}

export function QuoteOverviewTab({ job, scope, onScopeChange }: QuoteOverviewTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-4 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Job Description</Label>
            <p className="text-sm font-medium mt-1">{job.jobName}</p>
          </div>
          {job.address && (
            <div>
              <Label className="text-xs text-muted-foreground">Address</Label>
              <p className="text-sm mt-1">{job.address}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {job.startDate && (
              <div>
                <Label className="text-xs text-muted-foreground">Start Date</Label>
                <p className="text-sm mt-1">{job.startDate}</p>
              </div>
            )}
            {job.dueDate && (
              <div>
                <Label className="text-xs text-muted-foreground">Due Date</Label>
                <p className="text-sm mt-1">{job.dueDate}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 space-y-2">
          <Label htmlFor="scope">Scope of Work</Label>
          <Textarea
            id="scope"
            value={scope}
            onChange={(e) => onScopeChange(e.target.value)}
            placeholder="Describe the scope of work for this quote…"
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {job.stages && job.stages.length > 0 && (
        <Card>
          <CardContent className="pt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <Label className="text-xs text-muted-foreground">Project Stages</Label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">
                {job.stages.filter(s => s.status === "Complete" || s.status === "Invoiced").length}/{job.stages.length} complete
              </span>
              <span className="text-xs text-muted-foreground">
                ${job.stages.reduce((s, st) => s + st.quotedValue, 0).toLocaleString()} quoted
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-[hsl(var(--status-green))] transition-all"
                style={{ width: `${(job.stages.filter(s => s.status === "Complete" || s.status === "Invoiced").length / job.stages.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {job.staff.length > 0 && (
        <Card>
          <CardContent className="pt-4 space-y-2">
            <Label className="text-xs text-muted-foreground">Assigned Staff</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {job.staff.map((s) => (
                <span key={s.name} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs font-medium">
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">{s.avatar}</span>
                  {s.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
