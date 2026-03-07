import { useMemo, useState } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { getJobDetail, getNewJobDetail, type BundleTemplate } from "@/data/dummyJobDetails";
import { toast } from "@/hooks/use-toast";
import { PageToolbar } from "@/components/PageToolbar";
import { QuoteOverviewTab } from "@/components/quote/QuoteOverviewTab";
import { QuoteTab } from "@/components/job/QuoteTab";
import { QuoteFunnel, StepIndicator, type FunnelResult } from "@/components/quote/QuoteFunnel";
import { NotesTab } from "@/components/job/NotesTab";
import { HistoryTab } from "@/components/job/HistoryTab";
import { SequenceSelector } from "@/components/quote/SequenceSelector";
import { SequencesTab } from "@/components/SequencesTab";
import { MessagesTab } from "@/components/job/MessagesTab";
import { cn } from "@/lib/utils";
import { QUOTE_EXTRAS } from "@/config/toolbarTabs";
import { useDemoData } from "@/contexts/DemoDataContext";
import { stageForPipelineEvent, stageFromQuoteStatus } from "@/services/pipelineTransitions";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";

type QuotePageTab = "overview" | "messages" | "line-items" | "sequences" | "notes" | "history";



type QuoteStatus = "Draft" | "Sent" | "Approved";

const statusColor: Record<QuoteStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  Sent: "bg-[hsl(var(--status-orange))] text-white",
  Approved: "bg-[hsl(var(--status-green))] text-white",
};

export default function QuotePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const managerState = (location.state as any);
  const initialCustomer = managerState?.customer || null;
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as QuotePageTab) || "line-items";
  const [activeTab, setActiveTab] = useState<QuotePageTab>(initialTab);
  const [status, setStatus] = useState<QuoteStatus>("Draft");
  const [funnelComplete, setFunnelComplete] = useState(false);
  const [funnelData, setFunnelData] = useState<FunnelResult | null>(null);
  const [funnelStep, setFunnelStep] = useState(initialCustomer ? 2 : 1);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingNavId, setPendingNavId] = useState<string | null>(null);
  const [selectedSequenceId, setSelectedSequenceId] = useState<string | null>(null);
  const { jobs, updateJobStage } = useDemoData();

  const isNew = id === "new";

  const handleTabChange = (tabId: string) => {
    if (tabId === "back") { managerState?.fromManager ? navigate("/", { state: managerState }) : navigate("/"); return; }
    if (isNew && !funnelComplete) {
      setPendingNavId(tabId);
      setShowLeaveDialog(true);
      return;
    }
    setActiveTab(tabId as QuotePageTab);
  };

  const handleLeaveConfirm = (saveDraft: boolean) => {
    setShowLeaveDialog(false);
    if (saveDraft) {
      toast({ title: "Draft saved", description: "Your quote draft has been saved." });
    } else {
      toast({ title: "Discarded", description: "Quote draft discarded." });
    }
    if (pendingNavId) {
      setFunnelComplete(true);
      setActiveTab(pendingNavId as QuotePageTab);
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
          tabs={QUOTE_EXTRAS}
          activeTab="overview"
          onTabChange={handleTabChange}
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
              // Only pre-fill scope for custom descriptions, not bundle defaults
              setFunnelComplete(true);
            }}
            onStepChange={setFunnelStep}
            initialCustomer={initialCustomer}
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

  const liveJob = useMemo(() => jobs.find((item) => item.id === id), [jobs, id]);

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
    : (() => {
        const detail = getJobDetail(id || "");
        if (!detail) return null;
        if (!liveJob) return detail;
        return {
          ...detail,
          stage: liveJob.stage,
          client: liveJob.client,
          jobName: liveJob.jobName,
          value: liveJob.value,
          ageDays: liveJob.ageDays,
          urgent: liveJob.urgent,
        };
      })();

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Quote not found</p>
      </div>
    );
  }


  const cycleStatus = () => {
    const next: Record<QuoteStatus, QuoteStatus> = { Draft: "Sent", Sent: "Approved", Approved: "Draft" };
    const nextStatus = next[status];
    setStatus(nextStatus);

    if (job && !isNew) {
      const nextStage = stageFromQuoteStatus(nextStatus);
      if (nextStage) {
        updateJobStage(job.id, nextStage);
      }
    }
  };

  const handleSendQuote = () => {
    if (job && !isNew) {
      updateJobStage(job.id, stageForPipelineEvent("quote_sent"));
      setStatus("Sent");
    }
  };

  const tabContent: Record<QuotePageTab, React.ReactNode> = {
    overview: <QuoteOverviewTab job={job} scope={job.description || ""} onScopeChange={() => {}} />,
    messages: <MessagesTab recordType="quote" recordId={job.id} showPipelineLink pipelinePath="/" />,
    "line-items": (
      <div className="space-y-4">
        <QuoteTab job={job} onSendQuote={handleSendQuote} initialBundle={funnelData?.bundle || undefined} initialDescription={funnelData?.description || undefined} beforeActions={
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
        tabs={QUOTE_EXTRAS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        pageHeading={quoteHeading}
      >
        {tabContent[activeTab]}
      </PageToolbar>
    </>
  );
}
