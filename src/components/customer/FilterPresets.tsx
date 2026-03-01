import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Briefcase, Star, Users, UserCheck } from "lucide-react";
import type { SortOption } from "./CustomerFilters";

export interface FilterPreset {
  sortBy: SortOption;
  minSpend: number;
  minJobs: number;
  tab?: "all" | "leads" | "active" | "archived";
}

const PRESETS: { label: string; icon: React.ElementType; preset: FilterPreset }[] = [
  { label: "Top Spenders", icon: DollarSign, preset: { sortBy: "spend", minSpend: 10000, minJobs: 0 } },
  { label: "Most Jobs", icon: Briefcase, preset: { sortBy: "jobs", minSpend: 0, minJobs: 3 } },
  { label: "High Value", icon: TrendingUp, preset: { sortBy: "spend", minSpend: 20000, minJobs: 0 } },
  { label: "VIP Clients", icon: Star, preset: { sortBy: "spend", minSpend: 5000, minJobs: 2 } },
  { label: "New Leads", icon: UserCheck, preset: { sortBy: "name", minSpend: 0, minJobs: 0, tab: "leads" } },
  { label: "All Active", icon: Users, preset: { sortBy: "name", minSpend: 0, minJobs: 0, tab: "active" } },
];

interface FilterPresetsProps {
  onApply: (preset: FilterPreset) => void;
}

export function FilterPresets({ onApply }: FilterPresetsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PRESETS.map(({ label, icon: Icon, preset }) => (
        <Button
          key={label}
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs h-7 rounded-full"
          onClick={() => onApply(preset)}
        >
          <Icon className="w-3 h-3" />
          {label}
        </Button>
      ))}
    </div>
  );
}
