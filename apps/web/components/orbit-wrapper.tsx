"use client";

import { useEffect, useState } from "react";
import Orbit from "./orbit";

function useBreakpoint() {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize(); // set initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (width <= 768) return "mobile"; // < md
  if (width <= 1024) return "tablet"; // md–lg
  if (width <= 1512) return "desktop";
  return "ultrawide"; // ≥ lg
}

export default function ResponsiveComponent() {
  const breakpoint = useBreakpoint();

  if (breakpoint === "mobile") {
    return null;
  }
  if (breakpoint === "tablet" || breakpoint === "desktop") {
    return (
      <Orbit
        width={1100}
        height={1100}
        satelliteFontSize={13}
        satelliteRadius={52}
        orbitRadius={480}
        speed={0.005}
      />
    );
  }
  return <Orbit speed={0.005} orbitRadius={740} width={1700} height={1700} satelliteFontSize={15} satelliteRadius={60} />;
}
