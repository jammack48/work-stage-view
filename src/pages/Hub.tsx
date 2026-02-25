import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import {
  Briefcase, Users, Calendar, DollarSign, Calculator, FileText,
  Mail, MessageSquare, FolderOpen, MapPin, ShieldCheck, Star, GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Tile {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string | null;
}

const TILES: Tile[] = [
  { id: "jobs", label: "Job Management", icon: Briefcase, route: "/pipeline" },
  { id: "crm", label: "CRM", icon: Users, route: null },
  { id: "calendar", label: "Calendar", icon: Calendar, route: null },
  { id: "payroll", label: "Payroll", icon: DollarSign, route: null },
  { id: "accounting", label: "Accounting", icon: Calculator, route: null },
  { id: "forms", label: "Form Builder", icon: FileText, route: null },
  { id: "email", label: "Email Marketing", icon: Mail, route: null },
  { id: "sms", label: "SMS Messaging", icon: MessageSquare, route: null },
  { id: "docs", label: "Documents", icon: FolderOpen, route: null },
  { id: "gps", label: "GPS Tracking", icon: MapPin, route: null },
  { id: "safety", label: "Health & Safety", icon: ShieldCheck, route: null },
  { id: "reviews", label: "Reviews", icon: Star, route: null },
  { id: "training", label: "Training Portal", icon: GraduationCap, route: null },
];

const Hub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto">
        {/* Tagline */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Your Dashboard
          </h2>
          <p className="text-muted-foreground text-sm mt-1.5">
            Run your entire trade business from one place.
          </p>
        </div>

        {/* Tile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {TILES.map((tile) => {
            const Icon = tile.icon;
            const isActive = !!tile.route;

            return (
              <button
                key={tile.id}
                onClick={() => isActive ? navigate(tile.route!) : navigate(`/coming-soon?tool=${encodeURIComponent(tile.label)}`)}
                className={cn(
                  "group relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-6 aspect-square",
                  "transition-all duration-200 cursor-pointer",
                  "hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/40",
                  "active:scale-[0.97] active:shadow-sm",
                  isActive && "ring-1 ring-primary/20"
                )}
              >
                <Icon className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span className={cn(
                  "text-xs sm:text-sm font-medium text-center leading-tight",
                  isActive ? "text-card-foreground" : "text-muted-foreground group-hover:text-card-foreground"
                )}>
                  {tile.label}
                </span>
                {!isActive && (
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Hub;
