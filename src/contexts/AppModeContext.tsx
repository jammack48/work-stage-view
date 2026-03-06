import { createContext, useContext, useState, type ReactNode } from "react";

type AppMode = "manage" | "work" | "sole-trader" | "timesheet" | null;

export interface SoleTraderPrefs {
  vanStock: boolean;
  reconcileDocs: boolean;
}

const DEFAULT_PREFS: SoleTraderPrefs = { vanStock: false, reconcileDocs: false };

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: "manage" | "work" | "sole-trader" | "timesheet") => void;
  isWorkMode: boolean;
  isSoleTrader: boolean;
  isTimesheetOnlyMode: boolean;
  clearMode: () => void;
  soleTraderPrefs: SoleTraderPrefs;
  setSoleTraderPrefs: (prefs: SoleTraderPrefs) => void;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

const STORAGE_KEY = "tradie-app-mode";
const PREFS_KEY = "tradie-sole-trader-prefs";

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "manage" || stored === "work" || stored === "sole-trader" || stored === "timesheet" ? stored : null;
  });

  const [soleTraderPrefs, setSoleTraderPrefsState] = useState<SoleTraderPrefs>(() => {
    try {
      const stored = localStorage.getItem(PREFS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_PREFS;
  });

  const setMode = (m: "manage" | "work" | "sole-trader" | "timesheet") => {
    setModeState(m);
    localStorage.setItem(STORAGE_KEY, m);
  };

  const setSoleTraderPrefs = (prefs: SoleTraderPrefs) => {
    setSoleTraderPrefsState(prefs);
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  };

  const clearMode = () => {
    setModeState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppModeContext.Provider value={{
      mode,
      setMode,
      isWorkMode: mode === "work" || mode === "sole-trader" || mode === "timesheet",
      isSoleTrader: mode === "sole-trader",
      isTimesheetOnlyMode: mode === "timesheet",
      clearMode,
      soleTraderPrefs,
      setSoleTraderPrefs,
    }}>
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode() {
  const ctx = useContext(AppModeContext);
  if (!ctx) throw new Error("useAppMode must be used within AppModeProvider");
  return ctx;
}
