/* ThresholdContext — per-stage priority thresholds */
import { createContext, useContext, useState, type ReactNode } from "react";

export interface Thresholds {
  greenMax: number;
  orangeMax: number;
}

const DEFAULT: Thresholds = { greenMax: 3, orangeMax: 7 };

interface ThresholdContextType {
  getThresholds: (stage: string) => Thresholds;
  setThresholds: (stage: string, t: Thresholds) => void;
  getLabel: (stage: string, color: "green" | "orange" | "red") => string;
}

const ThresholdContext = createContext<ThresholdContextType | null>(null);

export function ThresholdProvider({ children }: { children: ReactNode }) {
  const [perStage, setPerStage] = useState<Record<string, Thresholds>>({});

  const getThresholds = (stage: string) => perStage[stage] ?? DEFAULT;

  const setThresholds = (stage: string, t: Thresholds) => {
    setPerStage((prev) => ({ ...prev, [stage]: t }));
  };

  const getLabel = (stage: string, color: "green" | "orange" | "red") => {
    const t = getThresholds(stage);
    if (color === "green") return `0–${t.greenMax}d`;
    if (color === "orange") return `${t.greenMax + 1}–${t.orangeMax}d`;
    return `${t.orangeMax + 1}d+`;
  };

  return (
    <ThresholdContext.Provider value={{ getThresholds, setThresholds, getLabel }}>
      {children}
    </ThresholdContext.Provider>
  );
}

export function useThresholds() {
  const ctx = useContext(ThresholdContext);
  if (!ctx) throw new Error("useThresholds must be inside ThresholdProvider");
  return ctx;
}
