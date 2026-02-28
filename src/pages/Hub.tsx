import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Briefcase, Users, Calendar, DollarSign, Calculator, FileText,
  Mail, MessageSquare, FolderOpen, MapPin, ShieldCheck, Star, GraduationCap,
  ChevronDown, ChevronRight, Upload, Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TEAM_MEMBERS, type TeamDoc } from "@/data/dummyTeamDocs";

interface Tile {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string | null;
}

const TILES: Tile[] = [
  { id: "jobs", label: "Job Management", icon: Briefcase, route: "/pipeline" },
  { id: "crm", label: "Customers", icon: Users, route: "/customers" },
  { id: "calendar", label: "Calendar", icon: Calendar, route: "/schedule" },
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

const STATUS_COLORS: Record<string, string> = {
  valid: "bg-[hsl(var(--status-green))] text-white",
  expiring: "bg-[hsl(var(--status-orange))] text-white",
  expired: "bg-destructive text-destructive-foreground",
};

const Hub = () => {
  const navigate = useNavigate();
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  return (
    <>

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
        {/* Team Documents Section */}
        <div className="mt-10">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">Team Documents</h2>
          <p className="text-muted-foreground text-sm mb-4">Manage staff certifications, licenses & documents</p>

          <div className="space-y-2">
            {TEAM_MEMBERS.map((member) => {
              const isOpen = expandedMember === member.id;
              return (
                <Card key={member.id}>
                  <button
                    onClick={() => setExpandedMember(isOpen ? null : member.id)}
                    className="w-full p-3 flex items-center gap-3 text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role} · {member.docs.length} docs</p>
                    </div>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  {isOpen && (
                    <CardContent className="pt-0 px-3 pb-3 space-y-2">
                      {member.docs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border">
                          <div className="flex items-center gap-2 min-w-0">
                            <Award className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-card-foreground truncate">{doc.name}</p>
                              {doc.expiry && <p className="text-[10px] text-muted-foreground">Exp: {doc.expiry}</p>}
                            </div>
                          </div>
                          {doc.status && <Badge className={cn("text-[10px] shrink-0", STATUS_COLORS[doc.status])}>{doc.status}</Badge>}
                        </div>
                      ))}
                      <Button size="sm" variant="outline" className="w-full gap-1.5 mt-1">
                        <Upload className="w-3.5 h-3.5" /> Add Document
                      </Button>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hub;
