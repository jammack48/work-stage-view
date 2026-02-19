import { Play, Square, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TimeEntry } from "@/data/dummyJobDetails";
import { useState } from "react";

interface TimeTabProps {
  timeEntries: TimeEntry[];
}

export function TimeTab({ timeEntries }: TimeTabProps) {
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const totalHours = timeEntries.reduce((s, t) => s + t.hours, 0);

  return (
    <div className="space-y-4">
      {/* Timer */}
      <Card>
        <CardContent className="pt-4 flex items-center gap-4">
          <Button
            size="lg"
            className="h-12 gap-2 min-w-[140px]"
            variant={timerRunning ? "destructive" : "default"}
            onClick={() => setTimerRunning((r) => !r)}
          >
            {timerRunning ? (
              <><Square className="w-5 h-5" /> Stop Timer</>
            ) : (
              <><Play className="w-5 h-5" /> Start Timer</>
            )}
          </Button>
          {timerRunning && (
            <div className="flex items-center gap-2 text-lg font-mono text-card-foreground">
              <Clock className="w-5 h-5 text-primary animate-pulse" />
              0:00:00
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time log */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Time Log</CardTitle>
        </CardHeader>
        <CardContent>
          {timeEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No time logged</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead className="text-right w-16">Hours</TableHead>
                  <TableHead className="hidden sm:table-cell">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="whitespace-nowrap">{t.date}</TableCell>
                    <TableCell>{t.staff}</TableCell>
                    <TableCell className="text-right font-semibold">{t.hours}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{t.description}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="text-right font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">{totalHours}h</TableCell>
                  <TableCell className="hidden sm:table-cell" />
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
