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

// Order matches satelliteTexts: kysely, auth, packages, next.js, tailwind, shadcn, nest
const logos = [
  '/logos/kysely.svg',
  '/logos/better-auth.svg',
  '/logos/nextjs.svg',
  '/vercel.svg',
  '/logos/tailwind.svg',
  '/logos/shadcn.svg',
  '/logos/nestjs.svg',
];

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
        satelliteRadius={310}
        orbitRadius={1060}
        speed={0.005}
        showOrbit={true}
        showLabels={true}
        logos={logos}
      />
    );
  }
  return (
    <Orbit
      width={1800}
      height={1800}
      satelliteRadius={220}
      orbitRadius={960}
      speed={0.005}
      showOrbit={true}
      showLabels={true}
      logos={logos}
    />
  );
}
