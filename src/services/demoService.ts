import { loadDemoDataset } from "@/demo/demoLoader";
import { readDemoDataset, writeDemoDataset } from "@/demo/demoStorage";
import type { DemoCustomer, DemoDataset } from "@/types/demoData";
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

export function addDemoCustomer(customer: Omit<DemoCustomer, "id">, storage: Storage = sessionStorage): DemoDataset {
  const dataset = current(storage);
  const maxId = dataset.customers.reduce((max, c) => Math.max(max, c.id), 0);
  const next: DemoDataset = {
    ...dataset,
    customers: [...dataset.customers, { ...customer, id: maxId + 1 } as DemoCustomer],
  };
  writeDemoDataset(next, storage);
  return next;
}

export function updateDemoJobStage(jobId: string, stage: Stage, storage: Storage = sessionStorage): DemoDataset {
  const dataset = current(storage);
  const targetJob = dataset.jobs.find((job) => job.id === jobId);
  const next = {
    ...dataset,
    jobs: dataset.jobs.map((job) => (job.id === jobId ? { ...job, stage, ageDays: 0 } : job)),
    customers: dataset.customers.map((customer) => {
      const hasLinkedHistory = customer.jobHistory.some((history) => history.id === jobId);
      const isOwnedByCustomer = targetJob ? targetJob.client === customer.name : false;

      const jobHistory = customer.jobHistory.map((history) => (
        history.id === jobId ? { ...history, stage } : history
      ));

      const jobsForCustomer = dataset.jobs
        .map((job) => (job.id === jobId ? { ...job, stage } : job))
        .filter((job) => job.client === customer.name);

      const jobsCount = jobsForCustomer.length;
      const totalSpend = jobsForCustomer
        .filter((job) => job.stage === "Invoice Paid")
        .reduce((sum, job) => sum + job.value, 0);

      const hasOpenLead = jobsForCustomer.some((job) => ["Lead", "To Quote"].includes(job.stage));
      const status: DemoCustomer["status"] = jobsCount === 0
        ? "archived"
        : hasOpenLead
          ? "leads"
          : "active";

      if (!hasLinkedHistory && !isOwnedByCustomer) {
        return customer;
      }

      return {
        ...customer,
        jobHistory,
        jobs: jobsCount,
        totalSpend,
        status,
      };
    }),
  };
  writeDemoDataset(next, storage);
  return next;
}
