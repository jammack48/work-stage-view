import type { DemoDataset } from "@/types/demoData";

const PREFIX = "demo.";

export const DEMO_STORAGE_KEYS = {
  jobs: `${PREFIX}jobs`,
  customers: `${PREFIX}customers`,
  materials: `${PREFIX}materials`,
  schedule: `${PREFIX}schedule`,
} as const;

function parseOr<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function isDemoDatasetInitialized(storage: Storage = sessionStorage): boolean {
  return Boolean(storage.getItem(DEMO_STORAGE_KEYS.jobs));
}

export function readDemoDataset(storage: Storage = sessionStorage): DemoDataset | null {
  const jobs = storage.getItem(DEMO_STORAGE_KEYS.jobs);
  if (!jobs) return null;

  return {
    jobs: parseOr(jobs, []),
    customers: parseOr(storage.getItem(DEMO_STORAGE_KEYS.customers), []),
    materials: parseOr(storage.getItem(DEMO_STORAGE_KEYS.materials), []),
    schedule: parseOr(storage.getItem(DEMO_STORAGE_KEYS.schedule), []),
  };
}

export function writeDemoDataset(dataset: DemoDataset, storage: Storage = sessionStorage) {
  storage.setItem(DEMO_STORAGE_KEYS.jobs, JSON.stringify(dataset.jobs));
  storage.setItem(DEMO_STORAGE_KEYS.customers, JSON.stringify(dataset.customers));
  storage.setItem(DEMO_STORAGE_KEYS.materials, JSON.stringify(dataset.materials));
  storage.setItem(DEMO_STORAGE_KEYS.schedule, JSON.stringify(dataset.schedule));
}

export function clearDemoDataset(storage: Storage = sessionStorage) {
  Object.values(DEMO_STORAGE_KEYS).forEach((key) => storage.removeItem(key));
}
