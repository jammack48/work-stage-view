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

// Seed-stable generation
const allJobs: Job[] = [];

stages.forEach((stage, si) => {
  for (let ji = 0; ji < 10; ji++) {
    const clientIdx = (si * 10 + ji) % clients.length;
    const jobIdx = (si * 7 + ji * 3) % jobTypes.length;
    allJobs.push({
      id: generateId(si, ji),
      client: clients[clientIdx],
      jobName: jobTypes[jobIdx],
      value: randomBetween(5, 250) * 100,
      ageDays: randomBetween(1, 30),
      urgent: (si * 10 + ji) % 5 === 0, // ~20%
      stage,
    });
  }
});

export const jobs = allJobs;

export function jobsByStage(stage: Stage): Job[] {
  return allJobs.filter((j) => j.stage === stage);
}
