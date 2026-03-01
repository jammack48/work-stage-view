import { Plus, Mic, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NoteEntry } from "@/data/dummyJobDetails";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NotesTabProps {
  notes: NoteEntry[];
}

export function NotesTab({ notes }: NotesTabProps) {
  return (
    <div className="space-y-4">
      {/* Add note area */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-2">
            <textarea
              className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground resize-none min-h-[80px]"
              placeholder="Add a note..."
            />
            <div className="flex flex-col gap-2">
              <Button size="sm" className="h-9 gap-1.5">
                <Plus className="w-4 h-4" /> Add
              </Button>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                <Mic className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No notes yet</p>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-card-foreground">{note.author}</span>
                    <span className="text-xs text-muted-foreground">· {note.timestamp}</span>
                    {note.isVoice && (
                      <span className="flex items-center gap-1 text-xs text-primary">
                        <Mic className="w-3 h-3" /> {note.voiceDuration}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-card-foreground leading-relaxed">{note.text}</p>
                  {note.isVoice && (
                    <Badge variant="secondary" className="text-[10px] gap-1 mt-1.5">
                      <Link2 className="w-3 h-3" /> From Quick Notes
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
