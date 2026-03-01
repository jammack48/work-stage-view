import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomerSearchBarProps {
  onSearch: (query: string) => void;
  externalValue?: string;
}

export function CustomerSearchBar({ onSearch, externalValue }: CustomerSearchBarProps) {
  const [value, setValue] = useState(externalValue ?? "");

  useEffect(() => {
    if (externalValue !== undefined) setValue(externalValue);
  }, [externalValue]);

  useEffect(() => {
    const t = setTimeout(() => onSearch(value), 200);
    return () => clearTimeout(t);
  }, [value, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search customers, jobs, notes…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9 pr-8"
      />
      {value && (
        <button onClick={() => setValue("")} className="absolute right-3 top-1/2 -translate-y-1/2">
          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  );
}
