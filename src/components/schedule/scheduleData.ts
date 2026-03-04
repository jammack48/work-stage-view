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

const JOB_NAMES = [
  "Kitchen Plumbing", "Roof Repair", "Bathroom Reno", "Deck Lighting", "Tiling",
  "Fence Repair", "Exterior Paint", "EV Charger Install", "Heat Pump Install",
  "Gas Fitting", "Leak Detection", "Solar Panel Install", "Rewire", "Gutter Replace",
  "Switchboard Upgrade", "Hot Water Cylinder", "Shower Install", "Spouting Repair",
];
const CLIENTS = [
  "Dave Thompson", "Sarah Mitchell", "Mike O'Brien", "Jenny Wu", "Rangi Patel",
  "Tama Williams", "Lisa Chen", "Hemi Brown", "Karen Ngata", "Steve Archer",
  "Aroha Davis", "Ben Kowalski", "Priya Sharma", "Tom Gallagher", "Emma Clarke",
];
const ADDRESSES = [
  "12 Queen St, Auckland", "88 Ponsonby Rd", "5 Te Atatu Rd", "22 Dominion Rd",
  "9 Mt Eden Rd", "44 Great South Rd", "17 New North Rd", "31 Symonds St",
  "66 Remuera Rd", "8 Parnell Rd", "15 Broadway, Newmarket", "3 Karangahape Rd",
  "41 Hobson St", "7 Victoria St West", "29 Albert St",
];
const STATUSES: ScheduleJob["status"][] = ["Scheduled", "In Progress", "Invoiced"];

function seedHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed + index * 9301 + 49297) * 49979;
  return x - Math.floor(x);
}

export function generateWeekJobs(weekStart: Date): ScheduleJob[] {
  const key = `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
  const baseSeed = seedHash(key);
  const jobs: ScheduleJob[] = [];
  let idx = 0;

  for (let day = 0; day < 5; day++) {
    const jobsPerDay = 2 + Math.floor(seededRandom(baseSeed, idx++) * 2); // 2-3 jobs
    for (let j = 0; j < jobsPerDay; j++) {
      const r = (i: number) => seededRandom(baseSeed, idx + i);
      const staffIdx = Math.floor(r(0) * STAFF.length);
      const jobNameIdx = Math.floor(r(1) * JOB_NAMES.length);
      const clientIdx = Math.floor(r(2) * CLIENTS.length);
      const addressIdx = Math.floor(r(3) * ADDRESSES.length);
      const startHour = 7 + Math.floor(r(4) * 4); // 7-10
      const duration = 2 + Math.floor(r(5) * 5); // 2-6 hours
      const statusIdx = Math.floor(r(6) * STATUSES.length);

      jobs.push({
        id: `WK-${baseSeed % 1000}-${day}${j}`,
        jobName: JOB_NAMES[jobNameIdx],
        client: CLIENTS[clientIdx],
        assignedTo: STAFF[staffIdx],
        dayOffset: day,
        startHour,
        durationHours: Math.min(duration, WORK_END - startHour),
        address: ADDRESSES[addressIdx],
        status: STATUSES[statusIdx],
      });
      idx += 7;
    }
  }
  return jobs;
}

export function formatTime(hour: number) {
  if (hour === 12) return "12pm";
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
}
