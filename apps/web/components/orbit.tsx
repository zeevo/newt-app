'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const satelliteTexts = [
  'kysely',
  'auth',
  'packages',
  'next.js',
  'tailwind',
  'shadcn',
  'nest',
];

export default function Orbit({
  width = 1060,
  height = 1060,
  centerText = 'newt-app',
  fontSize = 20,
  centerRadius = 80,
  orbitRadius = 460,
  satelliteRadius = 56,
  satellites = satelliteTexts.length,
  satelliteFontSize = 14,
  speed = 0.0125,
  direction = 1,
  showOrbit = true,
  showLabels = true,
  logos,
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
  showLabels?: boolean;
  logos?: string[];
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const timerRef = useRef<d3.Timer | null>(null);
  const pausedRef = useRef<boolean>(false);
  const accumulatedAngleRef = useRef<number>(0);
  const lastElapsedRef = useRef<number>(0);

  useEffect(() => {
    const svg = d3.select(svgRef.current!);

    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('role', 'img');

    const cx = width / 2;
    const cy = height / 2;

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

    const root = svg.append('g').attr('transform', `translate(0,0)`);

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

    const orbitGroup = root
      .append('g')
      .attr('transform', `rotate(0 ${cx} ${cy})`);

    const theta = d3
      .range(satellites)
      .map((i) => (i * 2 * Math.PI) / satellites);

    const satellitesGroup = orbitGroup
      .selectAll('g.satellite')
      .data(theta)
      .join('g')
      .attr('class', 'satellite font-mono outline-none')
      .attr(
        'transform',
        (a) =>
          `translate(${cx + orbitRadius * Math.cos(a)},${cy + orbitRadius * Math.sin(a)})`,
      )
      .attr('tabindex', 0);

    satellitesGroup
      .append('circle')
      .attr('r', satelliteRadius)
      .attr('class', showLabels ? 'fill-secondary/40 stroke-primary/15' : 'fill-foreground/[0.04] stroke-none');

    let satelliteText: d3.Selection<SVGTextElement, number, SVGGElement, unknown> | null = null;
    let satelliteRects: d3.Selection<SVGRectElement, unknown, SVGGElement, unknown> | null = null;
    let satelliteImages: d3.Selection<SVGImageElement, number, SVGGElement, unknown> | null = null;

    if (showLabels) {
      if (logos && logos.length > 0) {
        const logoSize = satelliteRadius * 0.6;
        satelliteImages = satellitesGroup
          .append('image')
          .attr('href', (d, i) => logos[i] ?? '')
          .attr('x', -logoSize)
          .attr('y', -logoSize)
          .attr('width', logoSize * 2)
          .attr('height', logoSize * 2)
          .style('filter', 'brightness(0) invert(1)')
          .style('opacity', '0.35');
      } else {
        satelliteText = satellitesGroup
          .append('text')
          .text((d, i) => `${satelliteTexts[i]!}`)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', satelliteFontSize)
          .attr('class', 'stroke-none fill-foreground/40 font-mono');

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
            .attr('class', 'fill-background/50 stroke-primary/10');
        });

        satelliteRects = satellitesGroup.select<SVGRectElement>('rect');
      }
    }

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    accumulatedAngleRef.current = 0;
    lastElapsedRef.current = 0;

    if (!reduceMotion) {
      timerRef.current?.stop();
      timerRef.current = d3.timer((elapsed) => {
        if (pausedRef.current) {
          lastElapsedRef.current = elapsed;
          return;
        }

        const delta = elapsed - lastElapsedRef.current;
        lastElapsedRef.current = elapsed;

        const deltaAngle = direction * (delta / 1000) * speed * 360;
        accumulatedAngleRef.current += deltaAngle;

        const angle = accumulatedAngleRef.current;
        orbitGroup.attr('transform', `rotate(${angle} ${cx} ${cy})`);
        satelliteText?.attr('transform', () => `rotate(${-angle} 0 0)`);
        satelliteRects?.attr('transform', () => `rotate(${-angle} 0 0)`);
        satelliteImages?.attr('transform', () => `rotate(${-angle} 0 0)`);
      });
    }

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
    showLabels,
    logos,
  ]);

  return (
    <div className="w-full h-full flex items-center justify-center text-foreground">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        aria-label="Orbiting circles visualization"
        className="text-foreground"
      />
    </div>
  );
}
