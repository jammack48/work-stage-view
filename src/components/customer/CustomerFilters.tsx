import { useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export type SortOption = "name" | "spend" | "jobs";

interface CustomerFiltersProps {
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  minSpend: number;
  onMinSpendChange: (v: number) => void;
  minJobs: number;
  onMinJobsChange: (v: number) => void;
}

function FilterRow({ sortBy, onSortChange, minSpend, onMinSpendChange, minJobs, onMinJobsChange }: CustomerFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
        <SelectTrigger className="w-[130px] h-8 text-xs">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="spend">Spend</SelectItem>
          <SelectItem value="jobs">Jobs</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Min $</span>
        <Input
          type="number"
          min={0}
          value={minSpend || ""}
          onChange={(e) => onMinSpendChange(Number(e.target.value) || 0)}
          className="w-20 h-8 text-xs"
          placeholder="0"
        />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Min jobs</span>
        <Input
          type="number"
          min={0}
          value={minJobs || ""}
          onChange={(e) => onMinJobsChange(Number(e.target.value) || 0)}
          className="w-16 h-8 text-xs"
          placeholder="0"
        />
      </div>
    </div>
  );
}

export function CustomerFilters(props: CustomerFiltersProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (!isMobile) return <FilterRow {...props} />;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5" />Filters
          {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <FilterRow {...props} />
      </CollapsibleContent>
    </Collapsible>
  );
}
