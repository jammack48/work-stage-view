import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const LANDSCAPE_HEIGHT_BREAKPOINT = 500;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const check = () => {
      const narrow = window.innerWidth < MOBILE_BREAKPOINT;
      const landscapePhone = window.innerHeight < LANDSCAPE_HEIGHT_BREAKPOINT;
      setIsMobile(narrow || landscapePhone);
    };
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const orientationMql = window.matchMedia(`(max-height: ${LANDSCAPE_HEIGHT_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", check);
    orientationMql.addEventListener("change", check);
    check();
    return () => {
      mql.removeEventListener("change", check);
      orientationMql.removeEventListener("change", check);
    };
  }, []);

  return !!isMobile;
}
