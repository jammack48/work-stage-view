import { useState } from "react";
import { FileText, PlayCircle, Award, ClipboardList, Download, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const COMPANY_DOCS = [
  { id: "cd1", name: "Health & Safety Policy", updated: "15 Jan 2026" },
  { id: "cd2", name: "Employee Handbook", updated: "1 Dec 2025" },
  { id: "cd3", name: "Standard Operating Procedures", updated: "20 Feb 2026" },
  { id: "cd4", name: "PPE Requirements", updated: "5 Jan 2026" },
  { id: "cd5", name: "Emergency Procedures", updated: "10 Feb 2026" },
];

const TRAINING_VIDEOS = [
  { id: "tv1", name: "Confined Spaces Safety", duration: "12 min" },
  { id: "tv2", name: "Working at Heights Refresher", duration: "18 min" },
  { id: "tv3", name: "Manual Handling Techniques", duration: "8 min" },
  { id: "tv4", name: "First Aid Basics", duration: "25 min" },
  { id: "tv5", name: "Tool Safety & Maintenance", duration: "15 min" },
];

const MY_CERTS = [
  { id: "mc1", name: "Plumbing License", expiry: "2027-03-15", status: "valid" as const },
  { id: "mc2", name: "Gas Fitting Cert", expiry: "2026-06-01", status: "expiring" as const },
  { id: "mc3", name: "First Aid Certificate", expiry: "2026-09-20", status: "valid" as const },
  { id: "mc4", name: "Working at Heights", expiry: "2025-12-01", status: "expired" as const },
];

const FORMS = [
  { id: "f1", name: "Site Induction Checklist" },
  { id: "f2", name: "JSA / Risk Assessment" },
  { id: "f3", name: "Incident Report Form" },
  { id: "f4", name: "Daily Pre-Start Checklist" },
  { id: "f5", name: "Tool Inspection Register" },
];

const STATUS_COLORS: Record<string, string> = {
  valid: "bg-[hsl(var(--status-green))] text-white",
  expiring: "bg-[hsl(var(--status-orange))] text-white",
  expired: "bg-destructive text-destructive-foreground",
};

export default function WorkHub() {
  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-foreground mb-4">Hub</h1>

      <Tabs defaultValue="docs" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="docs" className="text-xs gap-1"><FileText className="w-3.5 h-3.5" /> Docs</TabsTrigger>
          <TabsTrigger value="training" className="text-xs gap-1"><PlayCircle className="w-3.5 h-3.5" /> Training</TabsTrigger>
          <TabsTrigger value="certs" className="text-xs gap-1"><Award className="w-3.5 h-3.5" /> Certs</TabsTrigger>
          <TabsTrigger value="forms" className="text-xs gap-1"><ClipboardList className="w-3.5 h-3.5" /> Forms</TabsTrigger>
        </TabsList>

        <TabsContent value="docs" className="space-y-2 mt-3">
          {COMPANY_DOCS.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">Updated {doc.updated}</p>
                </div>
                <Button size="sm" variant="ghost"><Download className="w-4 h-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="training" className="space-y-2 mt-3">
          {TRAINING_VIDEOS.map((vid) => (
            <Card key={vid.id}>
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PlayCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{vid.name}</p>
                    <p className="text-xs text-muted-foreground">{vid.duration}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost"><ExternalLink className="w-4 h-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="certs" className="space-y-2 mt-3">
          {MY_CERTS.map((cert) => (
            <Card key={cert.id}>
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{cert.name}</p>
                  <p className="text-xs text-muted-foreground">Expires {cert.expiry}</p>
                </div>
                <Badge className={STATUS_COLORS[cert.status]}>{cert.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="forms" className="space-y-2 mt-3">
          {FORMS.map((form) => (
            <Card key={form.id}>
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-card-foreground">{form.name}</p>
                </div>
                <Button size="sm" variant="ghost"><Download className="w-4 h-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
