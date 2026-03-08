export interface Job {
  id: string;
  client: string;
  jobName: string;
  value: number;
  ageDays: number;
  urgent: boolean;
  stage: string;
  hasUnread?: boolean;
}

/** Clients with unread inbound messages */
export const UNREAD_CLIENTS = new Set([
  "Sarah Mitchell",
  "Mike O'Brien",
  "Lisa Chen",
  "Hemi Brown",
]);

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
  "To Quote": ["Pricing/Quoting"],
  "Quote Sent": ["Awaiting Acceptance"],
  "Quote Accepted": ["Schedule Job"],
  "In Progress": ["Job In Progress"],
  "To Invoice": ["Ready To Invoice"],
  "Invoiced": ["Invoiced", "Awaiting Payment"],
  "Invoice Paid": ["Invoice Paid"],
};

export type Stage = (typeof stages)[number];

export const STAGES = stages;

const clients = [
  "Ava Thompson", "Noah Patel", "Isla Morgan", "Leo Wilson", "Mia Brown", "Arlo Singh", "Ruby Chen", "Hugo Harris",
  "Luca James", "Sophie King", "Ethan Clarke", "Amelia Davis", "Jack Robertson", "Harper Lee", "Mason Walker", "Grace Hall",
  "Finn Young", "Ella Turner", "Oscar Scott", "Chloe Wright", "Henry Green", "Zoe Adams", "Lucas Baker", "Evie Nelson",
  "Charlie Carter", "Lily Mitchell", "William Phillips", "Emma Campbell", "Thomas Parker", "Olivia Evans", "James Collins", "Freya Edwards",
  "George Stewart", "Poppy Cook", "Harry Morris", "Ivy Rogers", "Archie Bell", "Matilda Murphy", "Alexander Bailey", "Sienna Cooper",
];

const jobTypes = [
  "Switchboard Upgrade", "EV Charger Install", "Heat Pump Installation", "Hot Water Cylinder Replacement",
  "Full Home Rewire", "Outdoor Security Lighting", "Kitchen Renovation Electrical", "Bathroom Extraction Upgrade",
  "Solar Inverter Replacement", "Ceiling Fan Installation", "Data Cabling Fitout", "Commercial LED Retrofit",
  "Emergency Fault Callout", "Smoke Alarm Compliance Check", "Garden Lighting Installation", "Pool Pump Rewire",
  "Distribution Board Relocation", "Underfloor Heating Install", "Three-Phase Upgrade", "Generator Changeover Switch",
  "Roof Leak Electrical Repair", "Bathroom Plumbing Refit", "Kitchen Plumbing Fitoff", "Water Main Repair",
  "Gas Hot Water Conversion", "Shower Mixer Replacement", "Blocked Drain Investigation", "Stormwater Line Repair",
  "Rainwater Pump Install", "Toilet Cistern Replacement", "Office Fitout Power", "Retail Lighting Upgrade",
  "Warehouse Highbay LEDs", "School Maintenance Package", "Restaurant Extraction Service", "Apartment Metering Upgrade",
  "Heat Recovery Ventilation Install", "Fire Alarm Service", "Access Control Wiring", "Intercom System Upgrade",
];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatJobId(prefix: string, num: number) {
  return `${prefix}-${String(num).padStart(4, "0")}`;
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
    const clientName = clients[clientIdx];
    allJobs.push({
      id: generateId(si, ji),
      client: clientName,
      jobName: jobTypes[jobIdx],
      value: ((si * 10 + ji) % 25 + 5) * 100,
      ageDays: ageDayPattern[ji],
      urgent: urgentPattern[ji],
      stage,
      hasUnread: UNREAD_CLIENTS.has(clientName),
    });
  }
});

export const jobs = allJobs;

export function jobsByStage(stage: Stage): Job[] {
  return allJobs.filter((j) => j.stage === stage);
}
