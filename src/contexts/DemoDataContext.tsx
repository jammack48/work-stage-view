import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { DemoCustomer, DemoDataset, DemoJob, DemoMaterial, DemoScheduleItem } from "@/types/demoData";
import type { Stage } from "@/data/dummyJobs";
import { dataService } from "@/services/dataService";
import { loadDemoDataset } from "@/demo/demoLoader";
import { resetDemoDataset } from "@/demo/demoReset";

interface DemoDataContextType {
  jobs: DemoJob[];
  customers: DemoCustomer[];
  materials: DemoMaterial[];
  schedule: DemoScheduleItem[];
  jobsByStage: (stage: Stage) => DemoJob[];
  updateJobStage: (jobId: string, stage: Stage) => void;
  addCustomer: (customer: Omit<DemoCustomer, "id">) => void;
  resetDemo: () => void;
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [dataset, setDataset] = useState<DemoDataset>(() => loadDemoDataset());

  const updateJobStage = (jobId: string, stage: Stage) => {
    const next = dataService.updateJobStage(jobId, stage);
    setDataset(next);
  };

  const resetDemo = () => {
    resetDemoDataset();
    const seeded = loadDemoDataset();
    setDataset(seeded);
  };

  const value = useMemo<DemoDataContextType>(() => ({
    jobs: dataset.jobs,
    customers: dataset.customers,
    materials: dataset.materials,
    schedule: dataset.schedule,
    jobsByStage: (stage) => dataset.jobs.filter((job) => job.stage === stage),
    updateJobStage,
    resetDemo,
  }), [dataset]);

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("useDemoData must be used within DemoDataProvider");
  return ctx;
}
