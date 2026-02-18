import { createContext, useContext, useState, type ReactNode } from "react";

export interface Thresholds {
  greenMax: number;  // 0 to greenMax days = green
  orangeMax: number; // greenMax+1 to orangeMax days = orange
  // orangeMax+ = red
}

const DEFAULT: Thresholds = { greenMax: 3, orangeMax: 7 };

interface ThresholdContextType {
  thresholds: Thresholds;
  setThresholds: (t: Thresholds) => void;
  getLabel: (color: "green" | "orange" | "red") => string;
}

const ThresholdContext = createContext<ThresholdContextType | null>(null);

export function ThresholdProvider({ children }: { children: ReactNode }) {
  const [thresholds, setThresholds] = useState<Thresholds>(DEFAULT);

  const getLabel = (color: "green" | "orange" | "red") => {
    if (color === "green") return `0–${thresholds.greenMax}d`;
    if (color === "orange") return `${thresholds.greenMax + 1}–${thresholds.orangeMax}d`;
    return `${thresholds.orangeMax + 1}d+`;
  };

  return (
    <ThresholdContext.Provider value={{ thresholds, setThresholds, getLabel }}>
      {children}
    </ThresholdContext.Provider>
  );
}

export function useThresholds() {
  const ctx = useContext(ThresholdContext);
  if (!ctx) throw new Error("useThresholds must be inside ThresholdProvider");
  return ctx;
}
