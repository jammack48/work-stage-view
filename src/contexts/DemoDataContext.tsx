import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import type { DemoCustomer, DemoDataset, DemoJob, DemoMaterial, DemoScheduleItem } from "@/types/demoData";
import type { Stage } from "@/data/dummyJobs";
import { ensureSession, fetchDataset, dbUpdateJobStage, dbAddCustomer, dbAddJob, dbResetSession } from "@/services/dbDemoService";
import { loadDemoDataset } from "@/demo/demoLoader";

interface DemoDataContextType {
  jobs: DemoJob[];
  customers: DemoCustomer[];
  materials: DemoMaterial[];
  schedule: DemoScheduleItem[];
  jobsByStage: (stage: Stage) => DemoJob[];
  updateJobStage: (jobId: string, stage: Stage) => void;
  addCustomer: (customer: Omit<DemoCustomer, "id">) => void;
  addJob: (job: { client: string; jobName: string; value: number; stage: Stage }) => void;
  resetDemo: () => void;
  loading: boolean;
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [dataset, setDataset] = useState<DemoDataset>(() => loadDemoDataset());
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sid = await ensureSession();
        if (cancelled) return;
        setSessionId(sid);
        const data = await fetchDataset(sid);
        if (cancelled) return;
        setDataset(data);
      } catch (err) {
        console.error("Failed to init demo session:", err);
        // Fall back to local seed data (already loaded)
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const updateJobStage = useCallback((jobId: string, stage: Stage) => {
    if (!sessionId) return;
    // Optimistic: update local immediately
    setDataset((prev) => ({
      ...prev,
      jobs: prev.jobs.map((j) => (j.id === jobId ? { ...j, stage, ageDays: 0 } : j)),
    }));
    // Then sync to DB
    dbUpdateJobStage(sessionId, jobId, stage).then(setDataset).catch(console.error);
  }, [sessionId]);

  const addCustomer = useCallback((customer: Omit<DemoCustomer, "id">) => {
    if (!sessionId) return;
    dbAddCustomer(sessionId, customer).then(setDataset).catch(console.error);
  }, [sessionId]);

  const addJob = useCallback((job: { client: string; jobName: string; value: number; stage: Stage }) => {
    if (!sessionId) return;
    // Optimistic: add locally
    const tempId = `JOB-${Date.now()}`;
    const newJob: DemoJob = { id: tempId, client: job.client, jobName: job.jobName, value: job.value, ageDays: 0, urgent: false, stage: job.stage };
    setDataset((prev) => ({ ...prev, jobs: [...prev.jobs, newJob] }));
    dbAddJob(sessionId, job).then(setDataset).catch(console.error);
  }, [sessionId]);

  const resetDemo = useCallback(() => {
    if (!sessionId) return;
    setLoading(true);
    dbResetSession(sessionId)
      .then((data) => { setDataset(data); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, [sessionId]);

  const value = useMemo<DemoDataContextType>(() => ({
    jobs: dataset.jobs,
    customers: dataset.customers,
    materials: dataset.materials,
    schedule: dataset.schedule,
    jobsByStage: (stage) => dataset.jobs.filter((job) => job.stage === stage),
    updateJobStage,
    addCustomer,
    addJob,
    resetDemo,
    loading,
  }), [dataset, updateJobStage, addCustomer, addJob, resetDemo, loading]);

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("useDemoData must be used within DemoDataProvider");
  return ctx;
}
