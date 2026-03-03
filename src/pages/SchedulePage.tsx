import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { startOfWeek, addWeeks, subWeeks, format, addDays } from "date-fns";
import { CalendarDays, X, Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { PageToolbar } from "@/components/PageToolbar";
import { StaffFilterBar } from "@/components/schedule/StaffFilterBar";
import { DayStrip } from "@/components/schedule/DayStrip";
import { TimeGridDesktop } from "@/components/schedule/TimeGridDesktop";
import { TimeGridMobile } from "@/components/schedule/TimeGridMobile";
import { DEMO_JOBS, formatTime } from "@/components/schedule/scheduleData";
import { SCHEDULE_EXTRAS, handleCommonTab } from "@/config/toolbarTabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getJobDetail } from "@/data/dummyJobDetails";

const SchedulePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const returnJobId = searchParams.get("returnJob");

  // Build return booking context from query params first, fallback to getJobDetail
  const returnBookingJob = useMemo(() => {
    if (!returnJobId) return null;
    const qpName = searchParams.get("returnJobName");
    const qpClient = searchParams.get("returnClient");
    const qpAddress = searchParams.get("returnAddress");
    if (qpName) {
      return { jobName: qpName, client: qpClient || "Customer", address: qpAddress || "" };
    }
    const detail = getJobDetail(returnJobId);
    if (detail) return { jobName: detail.jobName, client: detail.client, address: detail.address };
    return { jobName: returnJobId, client: "Customer", address: "" };
  }, [returnJobId, searchParams]);

  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  // In booking mode (Work/sole-trader), lock to logged-in user's calendar
  const isBookingMode = !!returnJobId;
  const [selectedStaff, setSelectedStaff] = useState<string[]>(isBookingMode ? ["Dave"] : []);
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 4 ? diff : 0;
  });

  // Return visit booking state
  const [bookedSlot, setBookedSlot] = useState<{ dayOffset: number; startHour: number } | null>(null);

  const allJobs = useMemo(() => {
    const base = [...DEMO_JOBS];
    if (bookedSlot && returnBookingJob) {
      base.push({
        id: `${returnJobId}-return`,
        jobName: `↩ ${returnBookingJob.jobName}`,
        client: returnBookingJob.client,
        assignedTo: "Dave",
        dayOffset: bookedSlot.dayOffset,
        startHour: bookedSlot.startHour,
        durationHours: 2,
        address: returnBookingJob.address,
        status: "Scheduled",
      });
    }
    return base;
  }, [bookedSlot, returnBookingJob, returnJobId]);

  const filteredJobs = useMemo(() => {
    if (selectedStaff.length === 0) return allJobs;
    return allJobs.filter((j) => selectedStaff.includes(j.assignedTo));
  }, [selectedStaff, allJobs]);

  const weekEnd = addDays(weekStart, 4);

  const handleSlotClick = useCallback((dayOffset: number, hour: number) => {
    if (!returnJobId) return;
    setBookedSlot({ dayOffset, startHour: hour });
  }, [returnJobId]);

  const handleConfirmBooking = () => {
    if (!bookedSlot || !returnBookingJob || !returnJobId) return;
    const dayDate = addDays(weekStart, bookedSlot.dayOffset);
    const dateStr = format(dayDate, "EEE d MMM");
    const timeStr = formatTime(bookedSlot.startHour);
    navigate(`/job/${returnJobId}?returnBooked=true&returnDate=${encodeURIComponent(dateStr)}&returnTime=${encodeURIComponent(timeStr)}&resumeCompletion=true`, { replace: true });
  };

  const handleCancelReturn = () => {
    navigate(-1);
  };

  const handleTabChange = (id: string) => {
    if (id === "back") { navigate("/"); return; }
    if (id === "pipeline") { navigate("/"); return; }
    handleCommonTab(id, navigate);
  };

  return (
    <PageToolbar
      tabs={SCHEDULE_EXTRAS}
      activeTab="schedule"
      onTabChange={handleTabChange}
      pageHeading={
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-card-foreground font-bold text-base">
            {returnBookingJob
              ? `Book Return · ${returnBookingJob.jobName}`
              : `Schedule · ${format(weekStart, "d MMM")} – ${format(weekEnd, "d MMM")}`
            }
          </span>
        </div>
      }
    >
      {/* Return job banner */}
      {returnJobId && (
        <div className="rounded-lg border-2 border-primary/50 bg-primary/10 p-3 mb-3 space-y-2">
          <div className="flex items-start gap-2">
            <CalendarDays className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-card-foreground">
                Booking return visit for {returnBookingJob?.jobName || returnJobId}
              </p>
              <p className="text-xs text-muted-foreground">
                {bookedSlot
                  ? `Selected: ${format(addDays(weekStart, bookedSlot.dayOffset), "EEE d MMM")} at ${formatTime(bookedSlot.startHour)}`
                  : "Tap an empty time slot to book"
                }
              </p>
            </div>
          </div>
          <div className="flex gap-2 pl-7">
            {bookedSlot && (
              <Button size="sm" className="h-8 gap-1.5" onClick={handleConfirmBooking}>
                <Check className="w-3.5 h-3.5" /> Confirm
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={handleCancelReturn}>
              <X className="w-3.5 h-3.5" /> Cancel
            </Button>
          </div>
        </div>
      )}

      {isMobile ? (
        <div className="flex flex-col" style={{ height: returnJobId ? 'calc(100dvh - 48px - 44px - 52px - 80px)' : 'calc(100dvh - 48px - 44px - 52px)' }}>
          <div className="shrink-0 space-y-3">
            <DayStrip
              weekStart={weekStart}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              onPrevWeek={() => setWeekStart(subWeeks(weekStart, 1))}
              onNextWeek={() => setWeekStart(addWeeks(weekStart, 1))}
              onJumpToToday={() => {
                const today = new Date();
                setWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
                const diff = Math.min(4, Math.max(0, today.getDay() - 1));
                setSelectedDay(diff);
              }}
            />
            {!isBookingMode && <StaffFilterBar selectedStaff={selectedStaff} onSelectionChange={setSelectedStaff} />}
          </div>
          <div className="flex-1 overflow-y-auto mt-3">
            <TimeGridMobile
              jobs={filteredJobs}
              dayOffset={selectedDay}
              onDayChange={setSelectedDay}
              onSlotClick={returnJobId ? handleSlotClick : undefined}
              activeSlot={bookedSlot}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <DayStrip
            weekStart={weekStart}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            onPrevWeek={() => setWeekStart(subWeeks(weekStart, 1))}
            onNextWeek={() => setWeekStart(addWeeks(weekStart, 1))}
            onJumpToToday={() => {
              const today = new Date();
              setWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
              const diff = Math.min(4, Math.max(0, today.getDay() - 1));
              setSelectedDay(diff);
            }}
          />
          {!isBookingMode && <StaffFilterBar selectedStaff={selectedStaff} onSelectionChange={setSelectedStaff} />}
          <TimeGridDesktop
            weekStart={weekStart}
            jobs={filteredJobs}
            selectedDay={selectedDay}
            onSlotClick={returnJobId ? handleSlotClick : undefined}
            activeSlot={bookedSlot}
          />
        </div>
      )}
    </PageToolbar>
  );
};

export default SchedulePage;
