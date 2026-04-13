'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const satelliteTexts = [
  'kysely',
  'auth',
  'packages',
  'next.js',
  'ui',
  'web',
  'nest',
];

// Default export so you can import and drop into any page
// Example: <OrbitalCircles centerText="CHEX" width={480} height={480} />
export default function Orbit({
  width = 1060,
  height = 1060,
  centerText = 'newt-app',
  fontSize = 20,
  centerRadius = 80,
  orbitRadius = 460,
  satelliteRadius = 56, // larger satellites
  satellites = satelliteTexts.length,
  satelliteFontSize = 14,
  // revolutions per second (e.g., 0.02 ≈ one revolution every 50s)
  speed = 0.0125,
  // 1 = clockwise, -1 = counterclockwise
  direction = 1,
  showOrbit = true,
}: {
  width?: number;
  height?: number;
  centerText?: string;
  fontSize?: number;
  centerRadius?: number;
  orbitRadius?: number;
  satelliteRadius?: number;
  satellites?: number;
  satelliteFontSize?: number;
  speed?: number;
  direction?: 1 | -1;
  showOrbit?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const timerRef = useRef<d3.Timer | null>(null);
  const pausedRef = useRef<boolean>(false);
  const accumulatedAngleRef = useRef<number>(0); // stores total rotation so far
  const lastElapsedRef = useRef<number>(0); // stores last timer elapsed we processed

  useEffect(() => {
    const svg = d3.select(svgRef.current!);

    // Clear any prior render
    svg.selectAll('*').remove();

    // Setup base svg
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('role', 'img');

    const cx = width / 2;
    const cy = height / 2;

    // --- Defs: glow filter for satellites ---
    const defs = svg.append('defs');
    defs
      .append('filter')
      .attr('id', 'satellite-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%').html(`
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      `);

    // Root layer
    const root = svg.append('g').attr('transform', `translate(0,0)`);

    // Optional: draw the orbit path
    if (showOrbit) {
      root
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', orbitRadius)
        .attr('fill', 'none')
        .attr('stroke', 'currentColor')
        .attr('opacity', 0.12)
        .attr('stroke-dasharray', '4,6');
    }

    // // Center node
    // const center = root.append("g").attr("transform", `translate(${cx},${cy})`);

    // center
    //   .append("circle")
    //   .attr("r", centerRadius)
    //   .attr("class", "fill-secondary stroke-primary/10"); // shadcn colors

    // center
    //   .append("text")
    //   .text(centerText)
    //   .attr("text-anchor", "middle")
    //   .attr("dominant-baseline", "middle")
    //   .attr("font-size", fontSize)
    //   .attr("class", "stroke-primary fill-primary font-mono");

    // Orbiting group (we rotate this as a whole)
    const orbitGroup = root
      .append('g')
      .attr('transform', `rotate(0 ${cx} ${cy})`); // rotate around center

    // Satellite positions (evenly spaced angles)
    const theta = d3
      .range(satellites)
      .map((i) => (i * 2 * Math.PI) / satellites);

    const satellitesGroup = orbitGroup
      .selectAll('g.satellite')
      .data(theta)
      .join('g')
      .attr('class', 'satellite font-mono outline-none')
      // UNCOMMENT FOR LINKS
      // .attr("class", "satellite font-mono outline-none cursor-pointer")
      .attr(
        'transform',
        (a) =>
          `translate(${cx + orbitRadius * Math.cos(a)},${cy + orbitRadius * Math.sin(a)})`,
      )
      // UNCOMMENT FOR LINKS
      //
      // Pause on hover/focus; resume on leave/blur. Also toggle glow filter.
      // .on("mouseover", function () {
      //   pausedRef.current = true;
      //   d3.select(this).select("circle").attr("filter", "url(#satellite-glow)");
      // })
      // .on("mouseout", function () {
      //   pausedRef.current = false;
      //   d3.select(this).select("circle").attr("filter", null);
      // })
      // .on("focusin", function () {
      //   pausedRef.current = true;
      //   d3.select(this).select("circle").attr("filter", "url(#satellite-glow)");
      // })
      // .on("focusout", function () {
      //   pausedRef.current = false;
      //   d3.select(this).select("circle").attr("filter", null);
      // })
      .attr('tabindex', 0); // allow keyboard focus for accessibility

    satellitesGroup
      .append('circle')
      .attr('r', satelliteRadius)
      .attr('class', 'fill-secondary/40 stroke-primary/15');

    // ...after you create `satelliteText`
    const satelliteText = satellitesGroup
      .append('text')
      .text((d, i) => `${satelliteTexts[i]!}`)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', satelliteFontSize)
      .attr('class', 'stroke-none fill-foreground/40 font-mono');

    // 👉 NEW: draw a rounded rect behind each label (based on its bbox)
    const paddingX = 10;
    const paddingY = 6;
    const corner = 8;

    satellitesGroup.each(function () {
      const g = d3.select(this as SVGGElement);
      const t = g.select<SVGTextElement>('text').node()!;
      const bbox = t.getBBox();

      g.insert('rect', 'text')
        .attr('x', bbox.x - paddingX)
        .attr('y', bbox.y - paddingY)
        .attr('width', bbox.width + paddingX * 2)
        .attr('height', bbox.height + paddingY * 2)
        .attr('rx', corner)
        .attr('ry', corner)
        // Tailwind/shadcn-ish coloring; swap to explicit fill/stroke if you prefer
        .attr('class', 'fill-background/50 stroke-primary/10');
    });

    // Keep selections to counter-rotate both text *and* its rects
    const satelliteRects = satellitesGroup.select<SVGRectElement>('rect');
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // reset accumulators at (re)mount
    accumulatedAngleRef.current = 0;
    lastElapsedRef.current = 0;

    if (!reduceMotion) {
      timerRef.current?.stop();
      timerRef.current = d3.timer((elapsed) => {
        // On pause, advance the reference so we don't accumulate a jump when resuming
        if (pausedRef.current) {
          lastElapsedRef.current = elapsed;
          return;
        }

        const delta = elapsed - lastElapsedRef.current; // ms since last processed frame
        lastElapsedRef.current = elapsed;

        // convert delta to degrees
        const deltaAngle = direction * (delta / 1000) * speed * 360;
        accumulatedAngleRef.current += deltaAngle;

        const angle = accumulatedAngleRef.current;
        orbitGroup.attr('transform', `rotate(${angle} ${cx} ${cy})`);
        satelliteText.attr('transform', () => `rotate(${-angle} 0 0)`); // keep labels upright
        satelliteText.attr('transform', () => `rotate(${-angle} 0 0)`);
        satelliteRects.attr('transform', () => `rotate(${-angle} 0 0)`);
      });
    }

    // Cleanup on unmount
    return () => {
      timerRef.current?.stop();
      timerRef.current = null;
    };
  }, [
    width,
    height,
    centerText,
    fontSize,
    centerRadius,
    orbitRadius,
    satelliteRadius,
    satellites,
    satelliteFontSize,
    speed,
    direction,
    showOrbit,
  ]);

  return (
    <div className="w-full h-full flex items-center justify-center text-foreground">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        aria-label="Orbiting circles visualization"
        className="text-foreground"
      />
    </div>
  );
}
