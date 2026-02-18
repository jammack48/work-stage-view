import { AlertTriangle, X } from "lucide-react";
import type { Job } from "@/data/dummyJobs";

interface ExpandedStagePanelProps {
  stage: string;
  jobs: Job[];
  onClose: () => void;
}

export function ExpandedStagePanel({ stage, jobs, onClose }: ExpandedStagePanelProps) {
  return (
    <div className="animate-fade-in bg-card rounded-xl shadow-lg border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-card-foreground">
          {stage}{" "}
          <span className="text-muted-foreground font-normal text-sm ml-1">
            ({jobs.length} jobs)
          </span>
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-background rounded-lg p-4 border border-border shadow-sm space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-sm text-card-foreground">{job.client}</p>
                <p className="text-sm text-muted-foreground">{job.jobName}</p>
              </div>
              {job.urgent && (
                <AlertTriangle className="w-4 h-4 text-[hsl(var(--stage-invoiced))] shrink-0 mt-0.5" />
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-sm text-card-foreground">
                ${job.value.toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                <span>{job.ageDays}d ago</span>
                <span className="font-mono">{job.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
