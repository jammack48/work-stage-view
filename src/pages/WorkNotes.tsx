import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Mic, StickyNote, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEMO_JOBS } from "@/components/schedule/scheduleData";
import { INITIAL_NOTES, type QuickNote } from "@/data/dummyTeamChat";

export default function WorkNotes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<QuickNote[]>(INITIAL_NOTES);
  const [text, setText] = useState("");
  const [jobId, setJobId] = useState("none");

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
    };
    setNotes([newNote, ...notes]);
    setText("");
    setJobId("none");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <StickyNote className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-foreground">Quick Notes</h1>
      </div>

      {/* Capture area */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Jot a note or dictate..."
          />
          <div className="flex items-center gap-2">
            <Select value={jobId} onValueChange={setJobId}>
              <SelectTrigger className="flex-1 h-9 text-xs">
                <SelectValue placeholder="Link to job (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No job</SelectItem>
                {DEMO_JOBS.map((j) => (
                  <SelectItem key={j.id} value={j.id}>
                    {j.id} — {j.jobName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 shrink-0">
              <Mic className="w-4 h-4" />
            </Button>
            <Button size="sm" className="h-9 gap-1.5 shrink-0" onClick={handleAdd}>
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes feed */}
      <div className="space-y-2">
        {notes.map((note) => (
          <Card key={note.id} className="overflow-hidden">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-semibold text-foreground">{note.author}</span>
                <span className="text-xs text-muted-foreground">· {note.timestamp}</span>
                {note.isVoice && (
                  <span className="flex items-center gap-0.5 text-xs text-primary">
                    <Mic className="w-3 h-3" /> {note.voiceDuration}
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-2">{note.text}</p>
              {note.jobId && (
                <button
                  onClick={() => navigate(`/job/${note.jobId}`)}
                  className="inline-flex items-center gap-1"
                >
                  <Badge variant="secondary" className="text-[10px] gap-1 cursor-pointer hover:bg-primary/10">
                    <Link2 className="w-3 h-3" />
                    {note.jobId} — {note.jobName}
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
