import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getJobDetail, getNewJobDetail } from "@/data/dummyJobDetails";

import { PageToolbar } from "@/components/PageToolbar";
import { OverviewTab } from "@/components/job/OverviewTab";
import { MaterialsTab } from "@/components/job/MaterialsTab";
import { NotesTab } from "@/components/job/NotesTab";
import { PhotosTab } from "@/components/job/PhotosTab";
import { TimeTab } from "@/components/job/TimeTab";
import { InvoiceTab } from "@/components/job/InvoiceTab";
import { QuoteTab } from "@/components/job/QuoteTab";
import { FormsTab } from "@/components/job/FormsTab";
import { HistoryTab } from "@/components/job/HistoryTab";
import { cn } from "@/lib/utils";
import { buildTabs, handleCommonTab, JOB_EXTRAS } from "@/config/toolbarTabs";

type JobTab = "overview" | "materials" | "notes" | "photos" | "time" | "quote" | "invoice" | "forms" | "history";

const JOB_TABS = buildTabs(...JOB_EXTRAS);

function statusColor(stage: string) {
  if (stage.includes("Paid")) return "bg-[hsl(var(--status-green))] text-white";
  if (stage.includes("Invoice") || stage.includes("Progress")) return "bg-[hsl(var(--status-orange))] text-white";
  if (stage.includes("Lead")) return "bg-[hsl(var(--status-red))] text-white";
  return "bg-muted text-muted-foreground";
}

export default function JobCard() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<JobTab>("overview");

  const job = id === "new"
    ? getNewJobDetail(searchParams.get("stage") || "Lead")
    : getJobDetail(id || "");

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  const tabContent: Record<JobTab, React.ReactNode> = {
    overview: <OverviewTab job={job} />,
    history: <HistoryTab job={job} />,
    quote: <QuoteTab job={job} />,
    materials: <MaterialsTab materials={job.materials} />,
    notes: <NotesTab notes={job.notes} />,
    photos: <PhotosTab photos={job.photos} />,
    time: <TimeTab timeEntries={job.timeEntries} />,
    forms: <FormsTab />,
    invoice: <InvoiceTab job={job} />,
  };

  const jobHeading = (
    <div className="flex items-center gap-2 flex-wrap">
      <h2 className="text-base font-bold text-card-foreground">{job.jobName}</h2>
      <span className="text-sm font-bold text-card-foreground">${job.value.toLocaleString()}</span>
      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", statusColor(job.stage))}>
        {job.stage}
      </span>
    </div>
  );

  return (
    <>
      <PageToolbar
        tabs={JOB_TABS}
        activeTab={activeTab}
        onTabChange={(id) => {
          if (handleCommonTab(id, navigate)) return;
          setActiveTab(id as JobTab);
        }}
        pageHeading={jobHeading}
      >
        {tabContent[activeTab]}
      </PageToolbar>
    </>
  );
}
