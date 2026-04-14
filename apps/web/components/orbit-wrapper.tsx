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
        width={1200}
        height={1200}
        satelliteRadius={130}
        orbitRadius={520}
        speed={0.005}
        showOrbit={true}
        showLabels={true}
      />
    );
  }
  return (
    <Orbit
      width={1600}
      height={1600}
      satelliteRadius={180}
      orbitRadius={700}
      speed={0.005}
      showOrbit={true}
      showLabels={true}
    />
  );
}
