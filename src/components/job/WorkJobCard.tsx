import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getJobDetail } from "@/data/dummyJobDetails";
import { PageToolbar } from "@/components/PageToolbar";
import { WorkOverviewTab } from "@/components/job/WorkOverviewTab";
import { ScopeTab } from "@/components/job/ScopeTab";
import { TimeTab } from "@/components/job/TimeTab";
import { NotesTab } from "@/components/job/NotesTab";
import { PhotosTab } from "@/components/job/PhotosTab";
import { FormsTab } from "@/components/job/FormsTab";
import { JobCompletionFlow } from "@/components/job/JobCompletionFlow";
import { cn } from "@/lib/utils";
import { WORK_JOB_EXTRAS } from "@/config/toolbarTabs";
import { Plus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MaterialItem } from "@/data/dummyJobDetails";

type WorkJobTab = "overview" | "scope" | "time" | "materials" | "notes" | "photos" | "forms";

function WorkMaterialsTab({ materials }: { materials: MaterialItem[] }) {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Materials Used</CardTitle>
        <Button size="sm" className="h-9 gap-1.5">
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </CardHeader>
      <CardContent>
        {materials.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No materials added yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right w-20">Qty</TableHead>
                <TableHead className="w-20">Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="text-right">{m.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">{m.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default function WorkJobCard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locState = location.state as { customer?: string; address?: string; description?: string } | null;
  const [activeTab, setActiveTab] = useState<WorkJobTab>("overview");
  const [completionOpen, setCompletionOpen] = useState(false);

  const job = getJobDetail(id || "", locState || undefined);

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  const tabContent: Record<WorkJobTab, React.ReactNode> = {
    overview: <WorkOverviewTab job={job} />,
    scope: <ScopeTab job={job} />,
    time: <TimeTab timeEntries={job.timeEntries} />,
    materials: <WorkMaterialsTab materials={job.materials} />,
    notes: <NotesTab notes={job.notes} />,
    photos: <PhotosTab photos={job.photos} />,
    forms: <FormsTab />,
  };

  const jobHeading = (
    <div className="flex items-center gap-2 flex-wrap">
      <h2 className="text-base font-bold text-card-foreground">{job.jobName}</h2>
      <Badge variant="secondary" className="text-xs">{job.stage}</Badge>
    </div>
  );

  return (
    <>
      <PageToolbar
        tabs={WORK_JOB_EXTRAS}
        activeTab={activeTab}
        onTabChange={(tabId) => {
          if (tabId === "back") { navigate("/"); return; }
          setActiveTab(tabId as WorkJobTab);
        }}
        pageHeading={jobHeading}
        tutorialKey="work-job"
      >
        {/* Action buttons */}
        <div className="flex gap-2 mb-3">
          <Button
            size="lg"
            className="flex-1 gap-2 h-12 text-base font-bold"
            onClick={() => setCompletionOpen(true)}
          >
            <CheckCircle2 className="w-5 h-5" /> Finished Job
          </Button>
        </div>
        {tabContent[activeTab]}
      </PageToolbar>

      <JobCompletionFlow
        open={completionOpen}
        onOpenChange={setCompletionOpen}
        job={job}
      />
    </>
  );
}
