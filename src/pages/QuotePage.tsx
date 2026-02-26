import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobDetail, getNewJobDetail, type BundleTemplate } from "@/data/dummyJobDetails";

import { PageToolbar } from "@/components/PageToolbar";
import { QuoteOverviewTab } from "@/components/quote/QuoteOverviewTab";
import { QuoteTab } from "@/components/job/QuoteTab";
import { QuoteFunnel, StepIndicator, type FunnelResult } from "@/components/quote/QuoteFunnel";
import { Textarea } from "@/components/ui/textarea";
import { NotesTab } from "@/components/job/NotesTab";
import { HistoryTab } from "@/components/job/HistoryTab";
import { SequenceSelector } from "@/components/quote/SequenceSelector";
import { SequencesTab } from "@/components/SequencesTab";
import { cn } from "@/lib/utils";
import { buildTabs, handleCommonTab, QUOTE_EXTRAS } from "@/config/toolbarTabs";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";

type QuotePageTab = "overview" | "line-items" | "sequences" | "notes" | "history";

const QUOTE_TABS = buildTabs(...QUOTE_EXTRAS);

type QuoteStatus = "Draft" | "Sent" | "Approved";

const statusColor: Record<QuoteStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  Sent: "bg-[hsl(var(--status-orange))] text-white",
  Approved: "bg-[hsl(var(--status-green))] text-white",
};

export default function QuotePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<QuotePageTab>("line-items");
  const [scope, setScope] = useState("");
  const [status, setStatus] = useState<QuoteStatus>("Draft");
  const [funnelComplete, setFunnelComplete] = useState(false);
  const [funnelData, setFunnelData] = useState<FunnelResult | null>(null);
  const [funnelStep, setFunnelStep] = useState(1);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingNavId, setPendingNavId] = useState<string | null>(null);
  const [selectedSequenceId, setSelectedSequenceId] = useState<string | null>(null);

  const isNew = id === "new";

  const handleFunnelTabChange = (id: string) => {
    setPendingNavId(id);
    setShowLeaveDialog(true);
  };

  const handleLeaveConfirm = (saveDraft: boolean) => {
    setShowLeaveDialog(false);
    if (pendingNavId) {
      if (!handleCommonTab(pendingNavId, navigate)) {
        setFunnelComplete(true);
        setActiveTab(pendingNavId as QuotePageTab);
      }
    }
    setPendingNavId(null);
  };

  const handleLeaveCancel = () => {
    setShowLeaveDialog(false);
    setPendingNavId(null);
  };

  if (isNew && !funnelComplete) {
    return (
      <>
        <PageToolbar
          tabs={QUOTE_TABS}
          activeTab="overview"
          onTabChange={handleFunnelTabChange}
          pageHeading={
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-base font-bold text-card-foreground">New Quote</h2>
              <StepIndicator current={funnelStep} />
            </div>
          }
        >
          <QuoteFunnel
            onComplete={(data) => {
              setFunnelData(data);
              setScope(data.description);
              setFunnelComplete(true);
            }}
            onStepChange={setFunnelStep}
          />

          <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave quote?</AlertDialogTitle>
                <AlertDialogDescription>
                  You haven't finished creating this quote. Would you like to save it as a draft?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleLeaveCancel}>Cancel</AlertDialogCancel>
                <AlertDialogAction className={cn("bg-muted text-muted-foreground hover:bg-muted/80")} onClick={() => handleLeaveConfirm(false)}>Discard</AlertDialogAction>
                <AlertDialogAction onClick={() => handleLeaveConfirm(true)}>Save Draft</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </PageToolbar>
      </>
    );
  }

  const job = isNew
    ? {
        ...getNewJobDetail("To Quote"),
        jobName: funnelData?.bundle?.name || "Custom Quote",
        client: funnelData?.customer?.name || "",
        clientPhone: funnelData?.customer?.phone || "",
        clientEmail: funnelData?.customer?.email || "",
        address: funnelData?.address || "",
        description: funnelData?.description || "",
      }
    : getJobDetail(id || "");

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Quote not found</p>
      </div>
    );
  }

  if (scope === "" && job.description && !isNew) {
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
        <QuoteTab job={job} initialBundle={funnelData?.bundle || undefined} beforeActions={
          <SequenceSelector category="quotes" selectedId={selectedSequenceId} onSelect={setSelectedSequenceId} />
        } />
      </div>
    ),
    sequences: <SequencesTab category="quotes" />,
    notes: <NotesTab notes={job.notes} />,
    history: <HistoryTab job={job} />,
  };

  const quoteTitle = isNew
    ? funnelData?.bundle?.name
      ? `Quote — ${funnelData.bundle.name}`
      : "New Quote"
    : job.jobName
      ? `Quote — ${job.jobName}`
      : "Quote";

  const quoteHeading = (
    <div className="flex items-center gap-2 flex-wrap">
      <h2 className="text-base font-bold text-card-foreground">{quoteTitle}</h2>
      {job.client && (
        <span className="text-sm text-muted-foreground">for {job.client}</span>
      )}
      <button
        onClick={cycleStatus}
        className={cn("text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer transition-colors", statusColor[status])}
      >
        {status}
      </button>
    </div>
  );

  return (
    <>
      <PageToolbar
        tabs={QUOTE_TABS}
        activeTab={activeTab}
        onTabChange={(id) => {
          if (handleCommonTab(id, navigate)) return;
          setActiveTab(id as QuotePageTab);
        }}
        pageHeading={quoteHeading}
      >
        {tabContent[activeTab]}
      </PageToolbar>
    </>
  );
}
