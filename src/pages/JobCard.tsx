import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getJobDetail, getNewJobDetail } from "@/data/dummyJobDetails";
import { JobTopStrip } from "@/components/job/JobTopStrip";
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
import {
  ClipboardList, Package, StickyNote, Camera, Clock, FileText, DollarSign, ClipboardCheck, History,
} from "lucide-react";

type JobTab = "overview" | "materials" | "notes" | "photos" | "time" | "quote" | "invoice" | "forms" | "history";

const JOB_TABS = [
  { id: "overview", label: "Overview", icon: ClipboardList },
  { id: "history", label: "History", icon: History },
  { id: "quote", label: "Quote", icon: DollarSign },
  { id: "materials", label: "Materials", icon: Package },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "time", label: "Time", icon: Clock },
  { id: "forms", label: "Forms", icon: ClipboardCheck },
  { id: "invoice", label: "Invoice", icon: FileText },
];

export default function JobCard() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
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

  return (
    <div className="min-h-screen bg-background">
      <JobTopStrip job={job} />
      <div className="pt-14 sm:pt-14">
        <PageToolbar
          tabs={JOB_TABS}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as JobTab)}
        >
          {tabContent[activeTab]}
        </PageToolbar>
      </div>
    </div>
  );
}
