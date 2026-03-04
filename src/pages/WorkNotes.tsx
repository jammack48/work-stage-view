import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Mic, StickyNote, Link2, Bell, Timer, User, AlertTriangle, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { DEMO_JOBS } from "@/components/schedule/scheduleData";
import { STAFF_LIST, INITIAL_NOTES, type QuickNote } from "@/data/dummyTeamChat";
import { TutorialBanner } from "@/components/TutorialBanner";
import { useToast } from "@/hooks/use-toast";

export default function WorkNotes() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState<QuickNote[]>(INITIAL_NOTES);
  const [text, setText] = useState("");
  const [jobId, setJobId] = useState("none");
  const [assignTo, setAssignTo] = useState("none");
  const [alertType, setAlertType] = useState<"none" | "alert" | "timer">("none");
  const [timerMinutes, setTimerMinutes] = useState("30");
  const [priority, setPriority] = useState<"normal" | "urgent">("normal");
  const [showOptions, setShowOptions] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Simulate "your" incoming alerts (notes assigned to Dave as current user)
  const myAlerts = notes.filter(
    (n) => n.assignedTo === "Dave" && n.alertType === "alert" && !dismissedAlerts.has(n.id)
  );

  // Timer countdown demo
  const [activeTimers, setActiveTimers] = useState<Record<string, number>>(() => {
    const timers: Record<string, number> = {};
    notes.forEach((n) => {
      if (n.alertType === "timer" && n.timerMinutes) {
        timers[n.id] = n.timerMinutes * 60;
      }
    });
    return timers;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimers((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const key in next) {
          if (next[key] > 0) {
            next[key] -= 1;
            changed = true;
            if (next[key] === 0) {
              const note = notes.find((n) => n.id === key);
              toast({
                title: "⏰ Timer expired",
                description: note?.text?.slice(0, 60) || "A reminder timer has expired",
              });
            }
          }
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [notes, toast]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleAdd = () => {
    if (!text.trim()) return;
    const linkedJob = DEMO_JOBS.find((j) => j.id === jobId);
    const newNote: QuickNote = {
      id: `qn-${Date.now()}`,
      text: text.trim(),
      author: "You",
      timestamp: "Just now",
      jobId: jobId !== "none" ? jobId : undefined,
      jobName: linkedJob?.jobName,
      assignedTo: assignTo !== "none" ? assignTo : undefined,
      alertType: alertType !== "none" ? alertType : undefined,
      timerMinutes: alertType === "timer" ? parseInt(timerMinutes) : undefined,
      priority,
    };
    setNotes([newNote, ...notes]);
    if (alertType === "timer") {
      setActiveTimers((prev) => ({ ...prev, [newNote.id]: parseInt(timerMinutes) * 60 }));
    }
    setText("");
    setJobId("none");
    setAssignTo("none");
    setAlertType("none");
    setPriority("normal");
    setShowOptions(false);

    if (newNote.assignedTo) {
      toast({
        title: `📨 Note sent to ${newNote.assignedTo}`,
        description: newNote.alertType === "alert" ? "They'll see an alert banner" : newNote.alertType === "timer" ? `Timer set for ${timerMinutes} mins` : "Note attached",
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      <TutorialBanner overrideKey="work-notes" />
      <div className="flex items-center gap-2 mb-1">
        <StickyNote className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-foreground">Quick Notes</h1>
      </div>

      {/* Incoming alert banners */}
      {myAlerts.length > 0 && (
        <div className="space-y-2">
          {myAlerts.map((alert) => (
            <Card key={alert.id} className={cn(
              "border-2 animate-in slide-in-from-top-2",
              alert.priority === "urgent" ? "border-destructive bg-destructive/5" : "border-primary bg-primary/5"
            )}>
              <CardContent className="py-3 px-4">
                <div className="flex items-start gap-2">
                  <Bell className={cn("w-5 h-5 mt-0.5 shrink-0 animate-bounce", alert.priority === "urgent" ? "text-destructive" : "text-primary")} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-bold text-foreground">{alert.author}</span>
                      <span className="text-[10px] text-muted-foreground">{alert.timestamp}</span>
                      {alert.priority === "urgent" && (
                        <Badge variant="destructive" className="text-[9px] px-1.5 py-0">URGENT</Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground">{alert.text}</p>
                    {alert.jobId && (
                      <button onClick={() => navigate(`/job/${alert.jobId}`)} className="mt-1.5 inline-flex">
                        <Badge variant="secondary" className="text-[10px] gap-1 cursor-pointer hover:bg-primary/10">
                          <Link2 className="w-3 h-3" />{alert.jobId} — {alert.jobName}
                        </Badge>
                      </button>
                    )}
                  </div>
                  <Button
                    variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0"
                    onClick={() => setDismissedAlerts((prev) => new Set([...prev, alert.id]))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Capture area */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Jot a note or dictate..."
          />

          {/* Collapsible options */}
          <Collapsible open={showOptions} onOpenChange={setShowOptions}>
            <div className="flex items-center gap-2">
              <Select value={jobId} onValueChange={setJobId}>
                <SelectTrigger className="flex-1 h-9 text-xs">
                  <SelectValue placeholder="Link to job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No job</SelectItem>
                  {DEMO_JOBS.map((j) => (
                    <SelectItem key={j.id} value={j.id}>{j.id} — {j.jobName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1 text-xs shrink-0">
                  <User className="w-3.5 h-3.5" />
                  <ChevronDown className={cn("w-3 h-3 transition-transform", showOptions && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 shrink-0">
                <Mic className="w-4 h-4" />
              </Button>
              <Button size="sm" className="h-9 gap-1.5 shrink-0" onClick={handleAdd}>
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>

            <CollapsibleContent className="mt-3 space-y-2 border-t border-border pt-3">
              {/* Assign to person */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-muted-foreground uppercase w-16 shrink-0">Assign</span>
                <Select value={assignTo} onValueChange={setAssignTo}>
                  <SelectTrigger className="flex-1 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nobody</SelectItem>
                    {STAFF_LIST.map((s) => (
                      <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Alert type */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-muted-foreground uppercase w-16 shrink-0">Alert</span>
                <div className="flex gap-1.5 flex-1">
                  {(["none", "alert", "timer"] as const).map((t) => (
                    <Button
                      key={t}
                      variant={alertType === t ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs flex-1 gap-1"
                      onClick={() => setAlertType(t)}
                    >
                      {t === "none" && "None"}
                      {t === "alert" && <><Bell className="w-3 h-3" /> Alert</>}
                      {t === "timer" && <><Timer className="w-3 h-3" /> Timer</>}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Timer duration */}
              {alertType === "timer" && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase w-16 shrink-0">After</span>
                  <Select value={timerMinutes} onValueChange={setTimerMinutes}>
                    <SelectTrigger className="flex-1 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Priority */}
              {alertType === "alert" && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase w-16 shrink-0">Priority</span>
                  <div className="flex gap-1.5 flex-1">
                    <Button
                      variant={priority === "normal" ? "default" : "outline"}
                      size="sm" className="h-8 text-xs flex-1"
                      onClick={() => setPriority("normal")}
                    >Normal</Button>
                    <Button
                      variant={priority === "urgent" ? "destructive" : "outline"}
                      size="sm" className="h-8 text-xs flex-1 gap-1"
                      onClick={() => setPriority("urgent")}
                    ><AlertTriangle className="w-3 h-3" /> Urgent</Button>
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Notes feed */}
      <div className="space-y-2">
        {notes.map((note) => (
          <Card key={note.id} className={cn(
            "overflow-hidden",
            note.alertType === "alert" && note.priority === "urgent" && "border-destructive/30"
          )}>
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-semibold text-foreground">{note.author}</span>
                <span className="text-xs text-muted-foreground">· {note.timestamp}</span>
                {note.isVoice && (
                  <span className="flex items-center gap-0.5 text-xs text-primary">
                    <Mic className="w-3 h-3" /> {note.voiceDuration}
                  </span>
                )}
                {note.assignedTo && (
                  <Badge variant="outline" className="text-[10px] gap-0.5 px-1.5 py-0">
                    <User className="w-2.5 h-2.5" /> → {note.assignedTo}
                  </Badge>
                )}
                {note.alertType === "alert" && (
                  <Badge variant={note.priority === "urgent" ? "destructive" : "default"} className="text-[9px] gap-0.5 px-1.5 py-0">
                    <Bell className="w-2.5 h-2.5" /> {note.priority === "urgent" ? "URGENT" : "Alert"}
                  </Badge>
                )}
                {note.alertType === "timer" && activeTimers[note.id] !== undefined && (
                  <Badge variant="secondary" className="text-[10px] gap-0.5 px-1.5 py-0 font-mono">
                    <Timer className="w-2.5 h-2.5" />
                    {activeTimers[note.id] > 0 ? formatTimer(activeTimers[note.id]) : "✓ Done"}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-2">{note.text}</p>
              {note.jobId && (
                <button onClick={() => navigate(`/job/${note.jobId}`)} className="inline-flex items-center gap-1">
                  <Badge variant="secondary" className="text-[10px] gap-1 cursor-pointer hover:bg-primary/10">
                    <Link2 className="w-3 h-3" />{note.jobId} — {note.jobName}
                  </Badge>
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
