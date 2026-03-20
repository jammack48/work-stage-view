import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import type { DemoCustomer, DemoJob, DemoMaterial, DemoScheduleItem } from "@/types/demoData";
import type { Stage } from "@/data/dummyJobs";
import { fetchCustomers, dbAddCustomer, fetchDemoJobs } from "@/services/dbDemoService";
import { useAppMode } from "@/contexts/AppModeContext";
import materialsSeed from "@/demo-data/materials.json";
import scheduleSeed from "@/demo-data/schedule.json";

interface DemoDataContextType {
  jobs: DemoJob[];
  customers: DemoCustomer[];
  materials: DemoMaterial[];
  schedule: DemoScheduleItem[];
  jobsByStage: (stage: Stage) => DemoJob[];
  updateJobStage: (jobId: string, stage: Stage) => void;
  addCustomer: (customer: Omit<DemoCustomer, "id">) => Promise<number | undefined>;
  addJob: (job: { client: string; jobName: string; value: number; stage: Stage }) => void;
  resetDemo: () => void;
  loading: boolean;
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const { trade } = useAppMode();
  const [jobs, setJobs] = useState<DemoJob[]>([]);
  const [customers, setCustomers] = useState<DemoCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  // Load jobs from Supabase filtered by trade — no local fallback
  useEffect(() => {
    if (!trade) {
      setJobs([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setJobs([]);
    setLoading(true);
    (async () => {
      try {
        const tradeJobs = await fetchDemoJobs(trade);
        if (!cancelled) setJobs(tradeJobs);
      } catch (err) {
        console.error("Failed to load demo jobs:", err);
        if (!cancelled) setJobs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [trade]);

  // Load customers from Supabase on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const custs = await fetchCustomers();
        if (!cancelled) setCustomers(custs);
      } catch (err) {
        console.error("Failed to load customers from DB:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const updateJobStage = useCallback((jobId: string, stage: Stage) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, stage, ageDays: 0 } : j))
    );
  }, []);

  const addCustomer = useCallback(async (customer: Omit<DemoCustomer, "id">): Promise<number | undefined> => {
    try {
      const newCust = await dbAddCustomer(customer);
      setCustomers((prev) => [...prev, newCust]);
      return newCust.id;
    } catch (err) {
      console.error("Failed to add customer:", err);
      return undefined;
    }
  }, []);

  const addJob = useCallback((job: { client: string; jobName: string; value: number; stage: Stage }) => {
    const tempId = `JOB-${Date.now()}`;
    const newJob: DemoJob = {
      id: tempId,
      client: job.client,
      jobName: job.jobName,
      value: job.value,
      ageDays: 0,
      urgent: false,
      stage: job.stage,
    };
    setJobs((prev) => [...prev, newJob]);
  }, []);

  const resetDemo = useCallback(() => {
    if (trade) {
      fetchDemoJobs(trade).then((tradeJobs) => {
        setJobs(tradeJobs.length > 0 ? tradeJobs : loadSeedJobs());
      }).catch(() => setJobs(loadSeedJobs()));
    } else {
      setJobs(loadSeedJobs());
    }
  }, [trade]);

  const value = useMemo<DemoDataContextType>(() => ({
    jobs,
    customers,
    materials: materialsSeed as DemoMaterial[],
    schedule: scheduleSeed as DemoScheduleItem[],
    jobsByStage: (stage) => jobs.filter((job) => job.stage === stage),
    updateJobStage,
    addCustomer,
    addJob,
    resetDemo,
    loading,
  }), [jobs, customers, updateJobStage, addCustomer, addJob, resetDemo, loading]);

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemoData() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("useDemoData must be used within DemoDataProvider");
  return ctx;
}
