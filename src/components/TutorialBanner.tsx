import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X, GraduationCap } from "lucide-react";
import { useTutorial } from "@/contexts/TutorialContext";
import { tutorialPages, getTutorialKey } from "@/data/tutorialContent";

export function TutorialBanner({ overrideKey }: { overrideKey?: string }) {
  const { tutorialOn } = useTutorial();
  const { pathname } = useLocation();
  const key = overrideKey ?? getTutorialKey(pathname);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Reset dismissed when navigating to a new page
  const [prevKey, setPrevKey] = useState(key);
  useEffect(() => {
    if (key !== prevKey) {
      setPrevKey(key);
      // Allow re-showing on navigation back
    }
  }, [key, prevKey]);

  if (!tutorialOn || !key) return null;
  const entry = tutorialPages[key];
  if (!entry) return null;
  if (dismissed.has(key)) return null;

  return (
    <div className="mx-4 sm:mx-6 mt-3 mb-1 rounded-lg border border-blue-300 bg-blue-100 dark:bg-blue-900/40 dark:border-blue-400/30 px-4 py-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <GraduationCap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{entry.title}</p>
        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{entry.body}</p>
      </div>
      <button
        onClick={() => setDismissed((prev) => new Set(prev).add(key))}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
        aria-label="Dismiss tutorial"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
