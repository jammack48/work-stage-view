import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { startOfWeek, addWeeks, subWeeks, format, addDays } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { PageToolbar } from "@/components/PageToolbar";
import { StaffFilterBar } from "@/components/schedule/StaffFilterBar";
import { DayStrip } from "@/components/schedule/DayStrip";
import { TimeGridDesktop } from "@/components/schedule/TimeGridDesktop";
import { TimeGridMobile } from "@/components/schedule/TimeGridMobile";
import { DEMO_JOBS } from "@/components/schedule/scheduleData";
import { COMMON_TABS, SCHEDULE_EXTRAS, buildTabs, handleCommonTab } from "@/config/toolbarTabs";

const HOME_TABS = buildTabs(...SCHEDULE_EXTRAS);

const SchedulePage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);

  const filteredJobs = useMemo(() => {
    if (selectedStaff.length === 0) return DEMO_JOBS;
    return DEMO_JOBS.filter((j) => selectedStaff.includes(j.assignedTo));
  }, [selectedStaff]);

  const weekEnd = addDays(weekStart, 4);

  const handleTabChange = (id: string) => {
    handleCommonTab(id, navigate);
  };

  return (
    <PageToolbar
      tabs={HOME_TABS}
      activeTab="schedule"
      onTabChange={handleTabChange}
      pageHeading={
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-card-foreground font-bold text-base">
            Schedule · {format(weekStart, "d MMM")} – {format(weekEnd, "d MMM")}
          </span>
        </div>
      }
    >
      <div className="space-y-3">
        <DayStrip
          weekStart={weekStart}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onPrevWeek={() => setWeekStart(subWeeks(weekStart, 1))}
          onNextWeek={() => setWeekStart(addWeeks(weekStart, 1))}
        />
        <StaffFilterBar selectedStaff={selectedStaff} onSelectionChange={setSelectedStaff} />

        {isMobile ? (
          <TimeGridMobile jobs={filteredJobs} dayOffset={selectedDay} />
        ) : (
          <TimeGridDesktop weekStart={weekStart} jobs={filteredJobs} />
        )}
      </div>
    </PageToolbar>
  );
};

export default SchedulePage;
