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
        width={1400}
        height={1400}
        satelliteRadius={360}
        orbitRadius={1060}
        satelliteFontSize={48}
        speed={0.005}
        showOrbit={true}
        showLabels={true}
      />
    );
  }
  return (
    <Orbit
      width={1800}
      height={1800}
      satelliteRadius={260}
      orbitRadius={960}
      satelliteFontSize={48}
      speed={0.005}
      showOrbit={true}
      showLabels={true}
    />
  );
}
