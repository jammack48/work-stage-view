import { createContext, useContext, useState, type ReactNode } from "react";

interface JobPrefixContextType {
  prefix: string;
  nextNumber: number;
  setPrefix: (p: string) => void;
  setNextNumber: (n: number) => void;
  formatJobId: (num: number) => string;
}

const JobPrefixContext = createContext<JobPrefixContextType | undefined>(undefined);

export function JobPrefixProvider({ children }: { children: ReactNode }) {
  const [prefix, setPrefix] = useState("TB");
  const [nextNumber, setNextNumber] = useState(1);

  const formatJobId = (num: number) => `${prefix}-${String(num).padStart(4, "0")}`;

  return (
    <JobPrefixContext.Provider value={{ prefix, nextNumber, setPrefix, setNextNumber, formatJobId }}>
      {children}
    </JobPrefixContext.Provider>
  );
}

export function useJobPrefix() {
  const ctx = useContext(JobPrefixContext);
  if (!ctx) throw new Error("useJobPrefix must be used within JobPrefixProvider");
  return ctx;
}
