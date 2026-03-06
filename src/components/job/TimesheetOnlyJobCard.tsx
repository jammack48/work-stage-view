import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, ClipboardCheck, Pause, Play, Square, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DEMO_JOBS } from "@/components/schedule/scheduleData";
import { useJobPrefix } from "@/contexts/JobPrefixContext";

const REQUIRED_FORMS = ["Site induction", "Health & safety", "Compliance checklist"];

export default function TimesheetOnlyJobCard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { prefix } = useJobPrefix();

  const job = useMemo(() => DEMO_JOBS.find((item) => item.id === id), [id]);

  const [timerRunning, setTimerRunning] = useState(false);
  const [breakOn, setBreakOn] = useState(false);
  const [manualHours, setManualHours] = useState("");
  const [notes, setNotes] = useState("");
  const [forms, setForms] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(REQUIRED_FORMS.map((item) => [item, false]))
  );

  if (!job) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Assigned job not found.</p>
      </div>
    );
  }

  const allFormsComplete = REQUIRED_FORMS.every((form) => forms[form]);
  const manualHoursValue = Number(manualHours);
  const manualHoursValid = manualHours === "" || (!Number.isNaN(manualHoursValue) && manualHoursValue >= 0 && manualHoursValue <= 24);
  const canSubmit = allFormsComplete && manualHoursValid;
  const displayId = job.id.replace(/^[A-Z]+-/, `${prefix}-`);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4" /> My Week
        </Button>
        <Badge variant="secondary">Timesheet Mode</Badge>
      </div>

      <Card>
        <CardContent className="pt-4 space-y-1">
          <p className="text-xs text-muted-foreground font-mono">{displayId}</p>
          <p className="text-lg font-semibold">{job.jobName}</p>
          <p className="text-sm text-muted-foreground">{job.client} • {job.address}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">1. Hours</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="gap-2"
            variant={timerRunning ? "destructive" : "default"}
            onClick={() => setTimerRunning((s) => !s)}
          >
            {timerRunning ? <><Square className="w-4 h-4" /> Stop timer</> : <><Play className="w-4 h-4" /> Start timer</>}
          </Button>
          <div className="space-y-1.5">
            <Label htmlFor="manual-hours">Manual hours</Label>
            <Input
              id="manual-hours"
              type="number"
              step="0.25"
              min="0"
              max="24"
              placeholder="e.g. 2.5"
              value={manualHours}
              onChange={(e) => setManualHours(e.target.value)}
            />
            {!manualHoursValid && <p className="text-xs text-destructive">Enter a value between 0 and 24.</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">2. Break</CardTitle></CardHeader>
        <CardContent>
          <Button variant="outline" className="gap-2" onClick={() => setBreakOn((s) => !s)}>
            {breakOn ? <><Play className="w-4 h-4" /> Resume</> : <><Pause className="w-4 h-4" /> Take break</>}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">3. Required Forms</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {REQUIRED_FORMS.map((form) => (
            <label key={form} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={forms[form]}
                onChange={(e) => setForms((prev) => ({ ...prev, [form]: e.target.checked }))}
              />
              <ClipboardCheck className="w-4 h-4 text-muted-foreground" /> {form}
            </label>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">4. Work Notes</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional description"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">5. Photos</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="gap-2"><Upload className="w-4 h-4" /> Upload photos</Button>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Camera className="w-3.5 h-3.5" /> Photos attach to this job only.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">6. Submit</CardTitle></CardHeader>
        <CardContent>
          <Button disabled={!canSubmit} className="w-full gap-2">
            <CheckCircle2 className="w-4 h-4" /> Submit
          </Button>
          {!allFormsComplete && <p className="mt-2 text-xs text-muted-foreground">Complete all required forms before submit.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
