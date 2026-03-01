import { useNavigate, useLocation } from "react-router-dom";
import { Home, Plus, StickyNote, MessageCircle, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { INITIAL_NOTES } from "@/data/dummyTeamChat";

const NAV_ITEMS = [
  { id: "home", icon: Home, label: "Schedule", path: "/" },
  { id: "notes", icon: StickyNote, label: "Notes", path: "/work-notes" },
  { id: "add", icon: Plus, label: "New Job", path: "/new-job" },
  { id: "chat", icon: MessageCircle, label: "Chat", path: "/work-chat" },
  { id: "hub", icon: FolderOpen, label: "Hub", path: "/work-hub" },
];

// Count urgent alerts assigned to current user (Dave)
const getUrgentCount = () =>
  INITIAL_NOTES.filter(
    (n) => n.assignedTo === "Dave" && n.alertType === "alert" && n.priority === "urgent"
  ).length;

export function WorkBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const urgentCount = getUrgentCount();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto h-14">
        {NAV_ITEMS.map((item) => {
          const active = item.path ? location.pathname === item.path : false;
          const isAdd = item.id === "add";
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.path) navigate(item.path);
              }}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors",
                isAdd && "relative -mt-4",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isAdd ? (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Plus className="w-6 h-6 text-primary-foreground" />
                </div>
              ) : (
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  {item.id === "notes" && urgentCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center px-1 animate-pulse">
                      {urgentCount}
                    </span>
                  )}
                </div>
              )}
              <span className={cn("text-[10px] font-medium", isAdd && "mt-0.5")}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
