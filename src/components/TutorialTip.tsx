import React, { forwardRef } from "react";
import { useTutorial } from "@/contexts/TutorialContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface TutorialTipProps {
  tip: string;
  children: React.ReactElement;
  side?: "top" | "bottom" | "left" | "right";
}

/** Wraps children in a tooltip ONLY when tutorial mode is on & desktop. No-op on mobile. */
export const TutorialTip = forwardRef<HTMLElement, TutorialTipProps>(
  ({ tip, children, side = "top" }, ref) => {
    const { tutorialOn } = useTutorial();
    const isMobile = useIsMobile();

    if (!tutorialOn || isMobile) {
      return React.cloneElement(children, { ref });
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {React.cloneElement(children, { ref })}
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-[220px] text-center">
          <p className="text-xs leading-snug">{tip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);
TutorialTip.displayName = "TutorialTip";
