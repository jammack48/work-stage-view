import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ToolbarPosition = "left" | "right" | "top" | "bottom";

const POSITION_CYCLE: ToolbarPosition[] = ["left", "bottom", "right", "top"];

function getStoredPosition(): ToolbarPosition {
  try {
    const v = localStorage.getItem("toolbar-position");
    if (v && POSITION_CYCLE.includes(v as ToolbarPosition)) return v as ToolbarPosition;
  } catch {}
  return "left";
}

interface ToolbarPositionContextValue {
  position: ToolbarPosition;
  cyclePosition: () => void;
}

const ToolbarPositionContext = createContext<ToolbarPositionContextValue | null>(null);

export function ToolbarPositionProvider({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState<ToolbarPosition>(getStoredPosition);

  useEffect(() => {
    localStorage.setItem("toolbar-position", position);
  }, [position]);

  const cyclePosition = () => {
    const idx = POSITION_CYCLE.indexOf(position);
    setPosition(POSITION_CYCLE[(idx + 1) % POSITION_CYCLE.length]);
  };

  return (
    <ToolbarPositionContext.Provider value={{ position, cyclePosition }}>
      {children}
    </ToolbarPositionContext.Provider>
  );
}

export function useToolbarPosition() {
  const ctx = useContext(ToolbarPositionContext);
  if (!ctx) throw new Error("useToolbarPosition must be used within ToolbarPositionProvider");
  return ctx;
}
