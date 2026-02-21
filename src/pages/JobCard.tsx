import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getJobDetail, getNewJobDetail } from "@/data/dummyJobDetails";
import { JobTopStrip } from "@/components/job/JobTopStrip";
import { JobSidebar, type JobTab } from "@/components/job/JobSidebar";
import { OverviewTab } from "@/components/job/OverviewTab";
import { MaterialsTab } from "@/components/job/MaterialsTab";
import { NotesTab } from "@/components/job/NotesTab";
import { PhotosTab } from "@/components/job/PhotosTab";
import { TimeTab } from "@/components/job/TimeTab";
import { InvoiceTab } from "@/components/job/InvoiceTab";
import { QuoteTab } from "@/components/job/QuoteTab";
import { FormsTab } from "@/components/job/FormsTab";
import { HistoryTab } from "@/components/job/HistoryTab";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function JobCard() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<JobTab>("overview");
  const [mobileLayout, setMobileLayout] = useState<"bottom" | "side">("side");
  const isMobile = useIsMobile();

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

  return (
    <div className="min-h-screen bg-background">
      <JobTopStrip job={job} />

      <div
        className={cn(
          "flex",
          isMobile ? "flex-col" : "flex-row",
          isMobile ? "pt-[5.5rem]" : "pt-14"
        )}
      >
        {(!isMobile || mobileLayout === "side") && (
          <div className={cn(isMobile && "pl-14")} />
        )}

        <JobSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          mobileLayout={mobileLayout}
          onMobileLayoutChange={setMobileLayout}
        />

        <main
          className={cn(
            "flex-1 min-w-0 p-4 sm:p-6",
            isMobile && mobileLayout === "bottom" && "pb-24",
            isMobile && mobileLayout === "side" && "ml-14"
          )}
        >
          {tabContent[activeTab]}
        </main>
      </div>
    </div>
  );
}
