export interface ScheduleJob {
  id: string;
  jobName: string;
  client: string;
  assignedTo: string;
  dayOffset: number; // 0=Mon, 1=Tue, ...4=Fri
  startHour: number;
  durationHours: number;
  address: string;
  status: "Scheduled" | "In Progress" | "Invoiced";
}

export const STAFF = ["Dave", "Mike", "Tama", "Lisa", "Hemi"];

export const STAFF_COLORS: Record<string, string> = {
  Dave: "hsl(var(--primary))",
  Mike: "hsl(210 70% 50%)",
  Tama: "hsl(150 60% 40%)",
  Lisa: "hsl(330 65% 50%)",
  Hemi: "hsl(30 80% 50%)",
};

export const WORK_START = 7;
export const WORK_END = 17;
export const HOUR_HEIGHT_DESKTOP = 60;
export const HOUR_HEIGHT_MOBILE = 48;

export const DEMO_JOBS: ScheduleJob[] = [
  { id: "TB-0501", jobName: "Kitchen Plumbing", client: "Dave Thompson", assignedTo: "Dave", dayOffset: 0, startHour: 8, durationHours: 4, address: "12 Queen St, Auckland", status: "In Progress" },
  { id: "TB-0502", jobName: "Roof Repair", client: "Sarah Mitchell", assignedTo: "Mike", dayOffset: 1, startHour: 9, durationHours: 5, address: "88 Ponsonby Rd", status: "Scheduled" },
  { id: "TB-0503", jobName: "Bathroom Reno", client: "Rangi Patel", assignedTo: "Tama", dayOffset: 0, startHour: 7, durationHours: 8, address: "5 Te Atatu Rd", status: "In Progress" },
  { id: "TB-0504", jobName: "Bathroom Reno", client: "Rangi Patel", assignedTo: "Tama", dayOffset: 1, startHour: 7, durationHours: 8, address: "5 Te Atatu Rd", status: "In Progress" },
  { id: "TB-0505", jobName: "Deck Lighting", client: "Jenny Wu", assignedTo: "Dave", dayOffset: 2, startHour: 8, durationHours: 5, address: "22 Dominion Rd", status: "Scheduled" },
  { id: "TB-0506", jobName: "Tiling", client: "Lisa Chen", assignedTo: "Lisa", dayOffset: 2, startHour: 10, durationHours: 4, address: "9 Mt Eden Rd", status: "Scheduled" },
  { id: "TB-0507", jobName: "Tiling", client: "Lisa Chen", assignedTo: "Lisa", dayOffset: 3, startHour: 10, durationHours: 4, address: "9 Mt Eden Rd", status: "In Progress" },
  { id: "TB-0508", jobName: "Fence Repair", client: "Mike O'Brien", assignedTo: "Mike", dayOffset: 3, startHour: 8, durationHours: 6, address: "44 Great South Rd", status: "Scheduled" },
  { id: "TB-0509", jobName: "Exterior Paint", client: "Hemi Brown", assignedTo: "Tama", dayOffset: 4, startHour: 7, durationHours: 8, address: "17 New North Rd", status: "Scheduled" },
  { id: "TB-0510", jobName: "EV Charger Install", client: "Steve Archer", assignedTo: "Hemi", dayOffset: 1, startHour: 9, durationHours: 4, address: "31 Symonds St", status: "Invoiced" },
  { id: "TB-0511", jobName: "Heat Pump Install", client: "Karen Ngata", assignedTo: "Hemi", dayOffset: 3, startHour: 8, durationHours: 5, address: "66 Remuera Rd", status: "Scheduled" },
  { id: "TB-0512", jobName: "Gas Fitting", client: "Tom Gallagher", assignedTo: "Dave", dayOffset: 3, startHour: 13, durationHours: 3, address: "8 Parnell Rd", status: "Scheduled" },
  { id: "TB-0513", jobName: "Leak Detection", client: "Emma Clarke", assignedTo: "Mike", dayOffset: 4, startHour: 8, durationHours: 4, address: "15 Broadway, Newmarket", status: "Scheduled" },
];

export function formatTime(hour: number) {
  if (hour === 12) return "12pm";
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
}
