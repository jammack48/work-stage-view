import { createContext, useContext, useState, type ReactNode } from "react";

export type NotificationStyle = "icon" | "pulse";

interface NotificationStyleContextType {
  style: NotificationStyle;
  setStyle: (s: NotificationStyle) => void;
}

const NotificationStyleContext = createContext<NotificationStyleContextType | null>(null);

export function NotificationStyleProvider({ children }: { children: ReactNode }) {
  const [style, setStyle] = useState<NotificationStyle>("icon");
  return (
    <NotificationStyleContext.Provider value={{ style, setStyle }}>
      {children}
    </NotificationStyleContext.Provider>
  );
}

export function useNotificationStyle() {
  const ctx = useContext(NotificationStyleContext);
  if (!ctx) throw new Error("useNotificationStyle must be inside NotificationStyleProvider");
  return ctx;
}
