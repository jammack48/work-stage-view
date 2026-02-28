import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobDetail } from "@/data/dummyJobDetails";
import { PageToolbar } from "@/components/PageToolbar";
import { OverviewTab } from "@/components/job/OverviewTab";
import { ScopeTab } from "@/components/job/ScopeTab";
import { TimeTab } from "@/components/job/TimeTab";
import { NotesTab } from "@/components/job/NotesTab";
import { PhotosTab } from "@/components/job/PhotosTab";
import { FormsTab } from "@/components/job/FormsTab";
import { cn } from "@/lib/utils";
import { WORK_JOB_EXTRAS } from "@/config/toolbarTabs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MaterialItem } from "@/data/dummyJobDetails";

type WorkJobTab = "overview" | "scope" | "time" | "materials" | "notes" | "photos" | "forms";

/** Materials tab without prices — only item + qty */
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
  const [activeTab, setActiveTab] = useState<WorkJobTab>("overview");

  const job = getJobDetail(id || "");

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  const tabContent: Record<WorkJobTab, React.ReactNode> = {
    overview: <OverviewTab job={job} />,
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
      <span className={cn(
        "text-xs font-semibold px-2 py-0.5 rounded-full",
        job.stage.includes("Progress") ? "bg-[hsl(var(--status-orange))] text-white" : "bg-muted text-muted-foreground"
      )}>
        {job.stage}
      </span>
    </div>
  );

  return (
    <PageToolbar
      tabs={WORK_JOB_EXTRAS}
      activeTab={activeTab}
      onTabChange={(tabId) => {
        if (tabId === "back") { navigate("/"); return; }
        setActiveTab(tabId as WorkJobTab);
      }}
      pageHeading={jobHeading}
    >
      {tabContent[activeTab]}
    </PageToolbar>
  );
}
