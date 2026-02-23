import { useState } from "react";
import { useParams } from "react-router-dom";
import { getJobDetail, getNewJobDetail } from "@/data/dummyJobDetails";
import { AppHeader } from "@/components/AppHeader";
import { PageToolbar } from "@/components/PageToolbar";
import { QuoteOverviewTab } from "@/components/quote/QuoteOverviewTab";
import { QuoteTab } from "@/components/job/QuoteTab";
import { Textarea } from "@/components/ui/textarea";
import { NotesTab } from "@/components/job/NotesTab";
import { HistoryTab } from "@/components/job/HistoryTab";
import { cn } from "@/lib/utils";
import { ClipboardList, List, StickyNote, History } from "lucide-react";

type QuotePageTab = "overview" | "line-items" | "notes" | "history";

const QUOTE_TABS = [
  { id: "overview", label: "Overview", icon: ClipboardList },
  { id: "line-items", label: "Line Items", icon: List },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "history", label: "History", icon: History },
];

type QuoteStatus = "Draft" | "Sent" | "Approved";

const statusColor: Record<QuoteStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  Sent: "bg-[hsl(var(--status-orange))] text-white",
  Approved: "bg-[hsl(var(--status-green))] text-white",
};

export default function QuotePage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<QuotePageTab>("line-items");
  const [scope, setScope] = useState("");
  const [status, setStatus] = useState<QuoteStatus>("Draft");

  const job = id === "new"
    ? { ...getNewJobDetail("To Quote"), jobName: "" }
    : getJobDetail(id || "");

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Quote not found</p>
      </div>
    );
  }

  // Initialize scope from job description
  if (scope === "" && job.description) {
    setScope(job.description);
  }

  const cycleStatus = () => {
    const next: Record<QuoteStatus, QuoteStatus> = { Draft: "Sent", Sent: "Approved", Approved: "Draft" };
    setStatus(next[status]);
  };

  const tabContent: Record<QuotePageTab, React.ReactNode> = {
    overview: <QuoteOverviewTab job={job} scope={scope} onScopeChange={setScope} />,
    "line-items": (
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card p-3">
          <Textarea
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            placeholder="Describe what this quote is for — e.g. 'Replace hot water cylinder and reroute pipework in ground floor bathroom'"
            className="min-h-[60px] border-0 bg-transparent p-0 focus-visible:ring-0 text-sm resize-none"
          />
        </div>
        <QuoteTab job={job} />
      </div>
    ),
    notes: <NotesTab notes={job.notes} />,
    history: <HistoryTab job={job} />,
  };

  const quoteHeading = (
    <div className="flex items-center gap-2 flex-wrap">
      <h2 className="text-base font-bold text-card-foreground">{job.jobName ? `Quote — ${job.jobName}` : "New Quote"}</h2>
      {job.client && (
        <span className="text-sm text-muted-foreground">for {job.client}</span>
      )}
      <span className="text-sm font-bold text-card-foreground">${job.value.toLocaleString()}</span>
      <button
        onClick={cycleStatus}
        className={cn("text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer transition-colors", statusColor[status])}
      >
        {status}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <PageToolbar
        tabs={QUOTE_TABS}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as QuotePageTab)}
        pageHeading={quoteHeading}
      >
        {tabContent[activeTab]}
      </PageToolbar>
    </div>
  );
}
