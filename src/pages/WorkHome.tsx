import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Briefcase, Clock, MapPin, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_JOBS, formatTime, STAFF_COLORS } from "@/components/schedule/scheduleData";
import { jobs } from "@/data/dummyJobs";

// In a real app this would be the logged-in staff member
const CURRENT_STAFF = "Dave";

export default function WorkHome() {
  const navigate = useNavigate();
  const [view, setView] = useState<"schedule" | "jobs">("schedule");

  // Today's schedule for current staff (dayOffset 0 = today for demo)
  const todayJobs = DEMO_JOBS
    .filter((j) => j.assignedTo === CURRENT_STAFF && j.dayOffset === 0)
    .sort((a, b) => a.startHour - b.startHour);

  // All assigned jobs (from pipeline)
  const myJobs = jobs.filter((j) =>
    ["In Progress", "Quote Accepted", "To Invoice"].includes(j.stage)
  ).slice(0, 8);

  const staffColor = STAFF_COLORS[CURRENT_STAFF] || "hsl(var(--primary))";

  return (
    <div className="px-3 sm:px-6 py-4 max-w-2xl mx-auto space-y-4">
      {/* Greeting */}
      <div>
        <h2 className="text-lg font-bold text-foreground">G'day, {CURRENT_STAFF} 👋</h2>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-NZ", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => setView("schedule")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            view === "schedule" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          <CalendarDays className="w-4 h-4" /> Today
        </button>
        <button
          onClick={() => setView("jobs")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            view === "jobs" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          <Briefcase className="w-4 h-4" /> My Jobs
        </button>
      </div>

      {view === "schedule" ? (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Today's Schedule</h3>
          {todayJobs.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No jobs scheduled for today
              </CardContent>
            </Card>
          ) : (
            todayJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => navigate(`/job/${job.id}`)}
                className="w-full text-left"
              >
                <Card className="hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: staffColor }}>
                  <CardContent className="p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-semibold text-foreground">
                          {formatTime(job.startHour)} – {formatTime(job.startHour + job.durationHours)}
                        </span>
                        <Badge variant="secondary" className="text-[10px]">{job.status}</Badge>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-bold text-card-foreground">{job.jobName}</p>
                    <p className="text-xs text-muted-foreground">{job.client}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{job.address}</span>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">My Jobs</h3>
          {myJobs.map((job) => (
            <button
              key={job.id}
              onClick={() => navigate(`/job/${job.id}`)}
              className="w-full text-left"
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-card-foreground">{job.jobName}</p>
                    <p className="text-xs text-muted-foreground">{job.client}</p>
                    <Badge variant="secondary" className="text-[10px] mt-1">{job.stage}</Badge>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
