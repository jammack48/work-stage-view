import { Badge } from "@/components/ui/badge";

const KEYWORDS = [
  "Switchboard", "Heat Pump", "Hot Water", "EV Charger", "Rewire",
  "Solar", "Plumbing", "Bathroom", "Kitchen", "Smoke Alarm",
  "Leak", "Drain", "Roof", "Deck", "Gas",
];

interface QuickKeywordsProps {
  onKeyword: (keyword: string) => void;
}

export function QuickKeywords({ onKeyword }: QuickKeywordsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {KEYWORDS.map((kw) => (
        <Badge
          key={kw}
          variant="outline"
          className="cursor-pointer hover:bg-primary/10 hover:border-primary/40 text-xs px-2.5 py-0.5 transition-colors"
          onClick={() => onKeyword(kw.toLowerCase())}
        >
          {kw}
        </Badge>
      ))}
    </div>
  );
}
