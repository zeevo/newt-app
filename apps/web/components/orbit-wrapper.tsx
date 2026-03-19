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

  console.log(width);

  if (width <= 768) return "mobile"; // < md
  if (width <= 1024) return "tablet"; // md–lg
  if (width <= 1512) return "desktop";
  return "ultrawide"; // ≥ lg
}

export default function ResponsiveComponent() {
  const breakpoint = useBreakpoint();

  console.log(breakpoint);

  if (breakpoint === "mobile") {
    return null;
  }
  if (breakpoint === "tablet" || breakpoint === "desktop") {
    return (
      <Orbit
        width={600}
        height={600}
        satelliteFontSize={9}
        satelliteRadius={34}
        orbitRadius={260}
      />
    );
  }
  return <Orbit />;
}
