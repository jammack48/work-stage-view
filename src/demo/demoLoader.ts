import jobsSeed from "@/demo-data/jobs.json";
import customersSeed from "@/demo-data/customers.json";
import materialsSeed from "@/demo-data/materials.json";
import scheduleSeed from "@/demo-data/schedule.json";
import type { DemoDataset } from "@/types/demoData";
import { isDemoDatasetInitialized, readDemoDataset, writeDemoDataset } from "@/demo/demoStorage";

const seedDataset: DemoDataset = {
  jobs: jobsSeed,
  customers: customersSeed,
  materials: materialsSeed,
  schedule: scheduleSeed,
};

export function loadDemoDataset(storage: Storage = sessionStorage): DemoDataset {
  if (isDemoDatasetInitialized(storage)) {
    return readDemoDataset(storage) ?? seedDataset;
  }

  writeDemoDataset(seedDataset, storage);
  return seedDataset;
}
