import type { Stage } from "@/data/dummyJobs";

export interface DemoJob {
  id: string;
  client: string;
  jobName: string;
  value: number;
  ageDays: number;
  urgent: boolean;
  stage: Stage;
  hasUnread?: boolean;
}

export interface DemoCustomer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  jobs: number;
  status: "active" | "leads" | "archived";
  totalSpend: number;
  notes: string[];
  contacts: { name: string; role: string; phone: string; email: string }[];
  jobHistory: { id: string; name: string; value: number; stage: string; date: string }[];
}

export interface DemoMaterial {
  id: string;
  name: string;
  unit: string;
  unitPrice: number;
}

export interface DemoScheduleItem {
  id: string;
  jobId: string;
  staff: string;
  date: string;
  start: string;
  end: string;
}

export interface DemoDataset {
  jobs: DemoJob[];
  customers: DemoCustomer[];
  materials: DemoMaterial[];
  schedule: DemoScheduleItem[];
}
