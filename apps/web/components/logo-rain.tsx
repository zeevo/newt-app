'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const logos = [
  '/logos/better-auth.svg',
  '/logos/nextjs.svg',
  '/vercel.svg',
  '/logos/tailwind.svg',
  '/logos/shadcn.svg',
  '/logos/nestjs.svg',
];

const VIEW_W = 1440;
const VIEW_H = 775;
const MARGIN = 120;

// unit direction of fall: top right → bottom left
const ANGLE = (32 * Math.PI) / 180;
const DIR_X = -Math.cos(ANGLE);
const DIR_Y = Math.sin(ANGLE);

const MIN_SIZE = 78;
const MAX_SIZE = 140;

// clearance kept between chips when picking spawn points
const SPACING = 40;

type Star = {
  x: number;
  y: number;
  size: number;
  speed: number;
};

function tooClose(x: number, y: number, size: number, others: Star[], self?: Star) {
  return others.some(
    (o) =>
      o !== self && Math.hypot(o.x - x, o.y - y) < o.size + size + SPACING,
  );
}

function entryPoint() {
  if (Math.random() < 0.6) {
    // enter along the top edge, biased to the right
    return {
      x: VIEW_W * 0.15 + Math.random() * (VIEW_W * 0.85 + MARGIN),
      y: -MARGIN * (0.2 + Math.random() * 0.8),
    };
  }
  // enter along the right edge
  return {
    x: VIEW_W + MARGIN * (0.2 + Math.random() * 0.8),
    y: -MARGIN + Math.random() * (VIEW_H * 0.7 + MARGIN),
  };
}

function respawn(star: Star, others: Star[]) {
  for (let attempt = 0; attempt < 24; attempt++) {
    const { x, y } = entryPoint();
    if (!tooClose(x, y, star.size, others, star)) {
      star.x = x;
      star.y = y;
      return;
    }
  }
  // no clear spot: back further up the path so it enters later
  const { x, y } = entryPoint();
  star.x = x - DIR_X * MARGIN * 3;
  star.y = y - DIR_Y * MARGIN * 3;
}

export default function LogoRain({
  density = 1,
  speedFactor = 0.09,
}: {
  density?: number;
  speedFactor?: number;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const timerRef = useRef<d3.Timer | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current!);

    svg.selectAll('*').remove();
    svg
      .attr('viewBox', `0 0 ${VIEW_W} ${VIEW_H}`)
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('role', 'img');

    const meanSize = (MIN_SIZE + MAX_SIZE) / 2;
    const stars: Star[] = [];
    d3.range(logos.length * density).forEach(() => {
      const size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
      // seed across the whole view so it starts populated; a few best-candidate
      // samples gently discourage clumping without looking gridded
      let x = 0;
      let y = 0;
      let bestDist = -Infinity;
      for (let candidate = 0; candidate < 4; candidate++) {
        const cx = -MARGIN + Math.random() * (VIEW_W + MARGIN * 2);
        const cy = -MARGIN + Math.random() * (VIEW_H + MARGIN * 2);
        const dist =
          d3.min(stars, (o) => Math.hypot(o.x - cx, o.y - cy) - o.size) ??
          Infinity;
        if (dist > bestDist) {
          bestDist = dist;
          x = cx;
          y = cy;
        }
      }
      stars.push({
        x,
        y,
        size,
        // keep speeds close together so chips rarely overtake each other
        speed: meanSize * speedFactor * (0.85 + 0.3 * ((size - MIN_SIZE) / (MAX_SIZE - MIN_SIZE))),
      });
    });

    const starGroups = svg
      .selectAll('g.star')
      .data(stars)
      .join('g')
      .attr('class', 'star')
      .attr('transform', (s) => `translate(${s.x},${s.y})`)
      .attr('opacity', (s) => 0.5 + 0.5 * ((s.size - MIN_SIZE) / (MAX_SIZE - MIN_SIZE)));

    starGroups
      .append('circle')
      .attr('r', (s) => s.size)
      .attr('class', 'fill-background stroke-primary/15');

    starGroups
      .append('image')
      .attr('href', (s, i) => logos[i % logos.length]!)
      .attr('x', (s) => -s.size * 0.6)
      .attr('y', (s) => -s.size * 0.6)
      .attr('width', (s) => s.size * 1.2)
      .attr('height', (s) => s.size * 1.2)
      .attr('class', 'logo-rain-logo');

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion) {
      let last = 0;
      timerRef.current?.stop();
      timerRef.current = d3.timer((elapsed) => {
        const dt = (elapsed - last) / 1000;
        last = elapsed;

        starGroups.attr('transform', (s) => {
          s.x += DIR_X * s.speed * dt;
          s.y += DIR_Y * s.speed * dt;
          if (s.x < -MARGIN || s.y > VIEW_H + MARGIN) {
            respawn(s, stars);
          }
          return `translate(${s.x},${s.y})`;
        });
      });
    }

    return () => {
      timerRef.current?.stop();
      timerRef.current = null;
    };
  }, [density, speedFactor]);

  return (
    <div className="h-full w-full text-foreground">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        aria-label="Falling logos visualization"
        className="text-foreground"
      />
    </div>
  );
}
