import { Columns, Users, CalendarDays, Package, FilePlus, FileText, Settings } from "lucide-react";

export interface ToolbarTab {
  id: string;
  label: string;
  icon: React.ElementType;
}

/** Always-visible tabs in fixed order across every page */
export const COMMON_TABS: ToolbarTab[] = [
  { id: "pipeline", label: "Pipeline", icon: Columns },
  { id: "customers", label: "Customers", icon: Users },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
];

/** Page-specific extra tabs appended after the common ones */
export const PIPELINE_EXTRAS: ToolbarTab[] = [
  { id: "bundles", label: "Bundles", icon: Package },
  { id: "quotes", label: "New Quote", icon: FilePlus },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

export const SCHEDULE_EXTRAS: ToolbarTab[] = [
  { id: "settings", label: "Settings", icon: Settings },
];

export const BUNDLES_EXTRAS: ToolbarTab[] = [
  { id: "quotes", label: "New Quote", icon: FilePlus },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

/** Helper to build a full tab list for any page */
export function buildTabs(...extras: ToolbarTab[]): ToolbarTab[] {
  return [...COMMON_TABS, ...extras];
}

/** Standard navigation handler — routes the common tab IDs */
export function handleCommonTab(id: string, navigate: (path: string) => void): boolean {
  const routes: Record<string, string> = {
    pipeline: "/pipeline",
    customers: "/customers",
    schedule: "/schedule",
    settings: "/settings",
    quotes: "/quote/new",
    invoices: "/job/new?stage=To+Invoice",
    bundles: "/bundles",
  };
  if (routes[id]) {
    navigate(routes[id]);
    return true;
  }
  return false;
}
