import { jobs } from "./dummyJobs";

export interface StaffMember {
  name: string;
  role: string;
  avatar: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  supplier: string;
}

export interface NoteEntry {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  isVoice?: boolean;
  voiceDuration?: string;
}

export interface PhotoEntry {
  id: string;
  caption: string;
  color: string;
  timestamp: string;
}

export interface TimeEntry {
  id: string;
  date: string;
  staff: string;
  hours: number;
  description: string;
}

export interface JobDetail {
  id: string;
  jobName: string;
  client: string;
  clientPhone: string;
  clientEmail: string;
  address: string;
  value: number;
  stage: string;
  ageDays: number;
  urgent: boolean;
  description: string;
  startDate: string;
  dueDate: string;
  staff: StaffMember[];
  materials: MaterialItem[];
  notes: NoteEntry[];
  photos: PhotoEntry[];
  timeEntries: TimeEntry[];
  invoiceStatus: "Draft" | "Sent" | "Paid";
  labourTotal: number;
  extrasTotal: number;
}

const staffPool: StaffMember[] = [
  { name: "Jake Turner", role: "Lead Sparky", avatar: "JT" },
  { name: "Ben Kowalski", role: "Apprentice", avatar: "BK" },
  { name: "Maia Johnson", role: "Plumber", avatar: "MJ" },
  { name: "Craig Foster", role: "Roofer", avatar: "CF" },
  { name: "Sam Te Reo", role: "Electrician", avatar: "ST" },
];

const materialsPool: MaterialItem[] = [
  { id: "m1", name: "Copper Pipe 15mm (3m)", quantity: 4, unit: "length", unitPrice: 32, supplier: "PlumbWorld" },
  { id: "m2", name: "PVC Elbow 90° 50mm", quantity: 12, unit: "pcs", unitPrice: 4.5, supplier: "PlumbWorld" },
  { id: "m3", name: "Twin & Earth 2.5mm²", quantity: 3, unit: "roll", unitPrice: 89, supplier: "Sparky Supplies" },
  { id: "m4", name: "LED Downlight 10W", quantity: 8, unit: "pcs", unitPrice: 24, supplier: "Sparky Supplies" },
  { id: "m5", name: "Silicone Sealant Clear", quantity: 2, unit: "tube", unitPrice: 12, supplier: "TradeZone" },
  { id: "m6", name: "Roof Screw 65mm Hex", quantity: 1, unit: "box", unitPrice: 48, supplier: "TradeZone" },
  { id: "m7", name: "Flexi Hose 500mm", quantity: 2, unit: "pcs", unitPrice: 18, supplier: "PlumbWorld" },
  { id: "m8", name: "Junction Box IP65", quantity: 4, unit: "pcs", unitPrice: 8.5, supplier: "Sparky Supplies" },
];

const notesPool: NoteEntry[] = [
  { id: "n1", text: "Client wants work done before Christmas. Confirmed access via side gate — code is 4821.", author: "Jake Turner", timestamp: "2 days ago" },
  { id: "n2", text: "Existing switchboard is 1970s ceramic fuses. Will need full replacement, not just upgrade. Quoted accordingly.", author: "Sam Te Reo", timestamp: "5 days ago" },
  { id: "n3", text: "Left materials in garage. Client happy for us to come and go.", author: "Ben Kowalski", timestamp: "1 day ago" },
  { id: "n4", text: "Site walkthrough complete — all good to proceed.", author: "Jake Turner", timestamp: "3 hours ago", isVoice: true, voiceDuration: "0:42" },
];

const photosPool: PhotoEntry[] = [
  { id: "p1", caption: "Switchboard before", color: "hsl(210 20% 35%)", timestamp: "2 days ago" },
  { id: "p2", caption: "Pipe damage close-up", color: "hsl(30 30% 40%)", timestamp: "2 days ago" },
  { id: "p3", caption: "Roof access point", color: "hsl(145 18% 35%)", timestamp: "1 day ago" },
  { id: "p4", caption: "Material delivery", color: "hsl(8 25% 38%)", timestamp: "1 day ago" },
  { id: "p5", caption: "Wiring run complete", color: "hsl(210 25% 30%)", timestamp: "6 hours ago" },
  { id: "p6", caption: "Final inspection", color: "hsl(30 20% 35%)", timestamp: "3 hours ago" },
];

const timePool: TimeEntry[] = [
  { id: "t1", date: "Mon 12 Feb", staff: "Jake Turner", hours: 4.5, description: "Strip out old switchboard, run new cables" },
  { id: "t2", date: "Mon 12 Feb", staff: "Ben Kowalski", hours: 4.5, description: "Assist with cable runs, tidy site" },
  { id: "t3", date: "Tue 13 Feb", staff: "Jake Turner", hours: 6, description: "Install new board, wire circuits" },
  { id: "t4", date: "Wed 14 Feb", staff: "Jake Turner", hours: 3, description: "Testing and commissioning" },
  { id: "t5", date: "Wed 14 Feb", staff: "Ben Kowalski", hours: 3, description: "Install downlights, patch holes" },
  { id: "t6", date: "Thu 15 Feb", staff: "Sam Te Reo", hours: 2, description: "Final inspection and sign-off" },
];

const addresses = [
  "14 Rata Street, Grey Lynn, Auckland 1021",
  "7 Kowhai Crescent, Mt Eden, Auckland 1024",
  "22 Pohutukawa Drive, Ponsonby, Auckland 1011",
  "9 Manuka Road, Parnell, Auckland 1052",
  "31 Rimu Lane, Remuera, Auckland 1050",
];

export function getJobDetail(jobId: string): JobDetail | null {
  const job = jobs.find((j) => j.id === jobId);
  if (!job) return null;

  const idx = jobs.indexOf(job);
  const staffCount = (idx % 3) + 1;
  const matCount = (idx % 4) + 5;

  return {
    ...job,
    clientPhone: `021 ${300 + idx} ${1000 + idx}`,
    clientEmail: `${job.client.split(" ")[0].toLowerCase()}@email.co.nz`,
    address: addresses[idx % addresses.length],
    description: `${job.jobName} at ${addresses[idx % addresses.length]}. Standard residential job — ${job.urgent ? "URGENT priority" : "normal priority"}.`,
    startDate: "Mon 10 Feb 2025",
    dueDate: "Fri 21 Feb 2025",
    staff: staffPool.slice(0, staffCount),
    materials: materialsPool.slice(0, matCount),
    notes: notesPool.slice(0, (idx % 3) + 2),
    photos: photosPool.slice(0, (idx % 3) + 3),
    timeEntries: timePool.slice(0, (idx % 3) + 3),
    invoiceStatus: idx % 3 === 0 ? "Paid" : idx % 3 === 1 ? "Sent" : "Draft",
    labourTotal: timePool.slice(0, (idx % 3) + 3).reduce((s, t) => s + t.hours * 85, 0),
    extrasTotal: (idx % 5) * 75,
  };
}

export function getNewJobDetail(stage: string): JobDetail {
  return {
    id: "new",
    jobName: "New Job",
    client: "",
    clientPhone: "",
    clientEmail: "",
    address: "",
    value: 0,
    stage,
    ageDays: 0,
    urgent: false,
    description: "",
    startDate: "",
    dueDate: "",
    staff: [],
    materials: [],
    notes: [],
    photos: [],
    timeEntries: [],
    invoiceStatus: "Draft",
    labourTotal: 0,
    extrasTotal: 0,
  };
}
