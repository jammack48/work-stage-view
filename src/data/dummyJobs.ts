export interface Job {
  id: string;
  client: string;
  jobName: string;
  value: number;
  ageDays: number;
  urgent: boolean;
  stage: string;
}

const stages = [
  "Lead",
  "To Quote",
  "Quote Sent",
  "Quote Accepted",
  "In Progress",
  "To Invoice",
  "Invoiced",
  "Invoice Paid",
] as const;

export const STAGE_LABELS: Record<Stage, [string, string?]> = {
  "Lead": ["Lead"],
  "To Quote": ["To Quote"],
  "Quote Sent": ["Quote Sent", "Awaiting Acceptance"],
  "Quote Accepted": ["Quote Accepted", "To Schedule"],
  "In Progress": ["Scheduled", "Job In Progress"],
  "To Invoice": ["To Invoice", "Jobs Completed"],
  "Invoiced": ["Invoiced", "Awaiting Payment"],
  "Invoice Paid": ["Invoice Paid"],
};

export type Stage = (typeof stages)[number];

export const STAGES = stages;

const clients = [
  "Dave Thompson", "Sarah Mitchell", "Mike O'Brien", "Jenny Wu",
  "Rangi Patel", "Tama Williams", "Lisa Chen", "Hemi Brown",
  "Karen Ngata", "Steve Archer", "Aroha Davis", "Ben Kowalski",
  "Priya Sharma", "Tom Gallagher", "Maia Johnson", "Craig Foster",
  "Nina Petrov", "Sam Te Reo", "Emma Clarke", "Liam Henderson",
];

const jobTypes = [
  "Hot Water Cylinder Replace", "Switchboard Upgrade", "Roof Repair",
  "Bathroom Reno", "Heat Pump Install", "Blocked Drain", "Rewire",
  "Gutter Replace", "Kitchen Plumbing", "EV Charger Install",
  "Gas Fitting", "Leak Detection", "Solar Panel Install",
  "Underfloor Heating", "Smoke Alarm Compliance", "Spouting Repair",
  "Shower Install", "Rangehood Vent", "Deck Lighting", "Tapware Replace",
];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId(stageIdx: number, jobIdx: number) {
  return `TB-${String(stageIdx + 1).padStart(2, "0")}${String(jobIdx + 1).padStart(2, "0")}`;
}

// Deterministic generation ensuring jobs in every color bucket
// Default thresholds: green 0-3d, orange 4-7d, red 8d+
const ageDayPattern = [1, 2, 3, 5, 6, 7, 10, 14, 20, 25]; // 3 green, 3 orange, 4 red
const urgentPattern = [false, false, false, false, false, false, false, false, true, true]; // last 2 urgent

const allJobs: Job[] = [];

stages.forEach((stage, si) => {
  for (let ji = 0; ji < 10; ji++) {
    const clientIdx = (si * 10 + ji) % clients.length;
    const jobIdx = (si * 7 + ji * 3) % jobTypes.length;
    allJobs.push({
      id: generateId(si, ji),
      client: clients[clientIdx],
      jobName: jobTypes[jobIdx],
      value: ((si * 10 + ji) % 25 + 5) * 100,
      ageDays: ageDayPattern[ji],
      urgent: urgentPattern[ji],
      stage,
    });
  }
});

export const jobs = allJobs;

export function jobsByStage(stage: Stage): Job[] {
  return allJobs.filter((j) => j.stage === stage);
}
