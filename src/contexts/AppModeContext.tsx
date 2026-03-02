import { createContext, useContext, useState, type ReactNode } from "react";

type AppMode = "manage" | "work" | "sole-trader" | null;

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: "manage" | "work" | "sole-trader") => void;
  isWorkMode: boolean;
  isSoleTrader: boolean;
  clearMode: () => void;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

const STORAGE_KEY = "tradie-app-mode";

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "manage" || stored === "work" || stored === "sole-trader" ? stored : null;
  });

  const setMode = (m: "manage" | "work" | "sole-trader") => {
    setModeState(m);
    localStorage.setItem(STORAGE_KEY, m);
  };

  const clearMode = () => {
    setModeState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppModeContext.Provider value={{
      mode,
      setMode,
      isWorkMode: mode === "work" || mode === "sole-trader",
      isSoleTrader: mode === "sole-trader",
      clearMode,
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
