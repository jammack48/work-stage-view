import { loadDemoDataset } from "@/demo/demoLoader";
import { readDemoDataset, writeDemoDataset } from "@/demo/demoStorage";
import type { DemoDataset } from "@/types/demoData";
import type { Stage } from "@/data/dummyJobs";

function current(storage: Storage = sessionStorage): DemoDataset {
  return readDemoDataset(storage) ?? loadDemoDataset(storage);
}

export function getDemoDataset(storage: Storage = sessionStorage): DemoDataset {
  return current(storage);
}

export function setDemoDataset(dataset: DemoDataset, storage: Storage = sessionStorage): DemoDataset {
  writeDemoDataset(dataset, storage);
  return dataset;
}

export function updateDemoJobStage(jobId: string, stage: Stage, storage: Storage = sessionStorage): DemoDataset {
  const dataset = current(storage);
  const next = {
    ...dataset,
    jobs: dataset.jobs.map((job) => (job.id === jobId ? { ...job, stage } : job)),
  };
  writeDemoDataset(next, storage);
  return next;
}
