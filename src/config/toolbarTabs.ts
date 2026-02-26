import {
  Home, Users, CalendarDays, Package, FilePlus, FileText, Settings,
  ClipboardList, List, StickyNote, History, DollarSign, Clock, Camera,
  ClipboardCheck, Star, Archive, Building2, Bell, Palette, CreditCard,
  Shield, Wrench, Briefcase, UserPlus, BarChart3, Plus,
} from "lucide-react";

export interface ToolbarTab {
  id: string;
  label: string;
  icon: React.ElementType;
}

/** Always-visible tabs in fixed order across every page */
export const COMMON_TABS: ToolbarTab[] = [
  { id: "pipeline", label: "Home", icon: Home },
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

export const QUOTE_EXTRAS: ToolbarTab[] = [
  { id: "overview", label: "Overview", icon: ClipboardList },
  { id: "line-items", label: "Line Items", icon: List },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "history", label: "History", icon: History },
];

export const JOB_EXTRAS: ToolbarTab[] = [
  { id: "overview", label: "Overview", icon: ClipboardList },
  { id: "history", label: "History", icon: History },
  { id: "quote", label: "Quote", icon: DollarSign },
  { id: "materials", label: "Materials", icon: Package },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "time", label: "Time", icon: Clock },
  { id: "forms", label: "Forms", icon: ClipboardCheck },
  { id: "invoice", label: "Invoice", icon: FileText },
];

export const CUSTOMER_LIST_EXTRAS: ToolbarTab[] = [
  { id: "all", label: "All", icon: List },
  { id: "leads", label: "Leads", icon: Star },
  { id: "active", label: "Active", icon: Users },
  { id: "archived", label: "Archived", icon: Archive },
];

export const CUSTOMER_CARD_EXTRAS: ToolbarTab[] = [
  { id: "overview", label: "Overview", icon: ClipboardList },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "contacts", label: "Contacts", icon: UserPlus },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "spend", label: "Spend", icon: BarChart3 },
  { id: "add-job", label: "New Job", icon: Plus },
];

export const SETTINGS_EXTRAS: ToolbarTab[] = [
  { id: "business", label: "Business", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "team", label: "Team", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Wrench },
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
