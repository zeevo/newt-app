'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const VIEWBOX_W = 620;
const VIEWBOX_H = 180;
const BOX_W = 110;
const BOX_H = 52;
const PARTICLES_PER_PATH = 4;
const SPEED = 0.28;

// Positions
const BROWSER_CX = 110;
const BROWSER_CY = VIEWBOX_H / 2;
const RIGHT_CX = 490;
const NEXTJS_CY = 52;
const NESTJS_CY = 128;
const JUNCTION_X = 290;

const BROWSER_RIGHT = BROWSER_CX + BOX_W / 2;
const RIGHT_LEFT = RIGHT_CX - BOX_W / 2;

type Segment = { x1: number; y1: number; x2: number; y2: number };

// Two L-shaped paths from browser, meeting at junction then bending to each box
const paths: { segments: Segment[]; label?: string }[] = [
  {
    segments: [
      { x1: BROWSER_RIGHT, y1: BROWSER_CY, x2: JUNCTION_X, y2: BROWSER_CY },
      { x1: JUNCTION_X, y1: BROWSER_CY, x2: JUNCTION_X, y2: NEXTJS_CY },
      { x1: JUNCTION_X, y1: NEXTJS_CY, x2: RIGHT_LEFT, y2: NEXTJS_CY },
    ],
  },
  {
    segments: [
      { x1: BROWSER_RIGHT, y1: BROWSER_CY, x2: JUNCTION_X, y2: BROWSER_CY },
      { x1: JUNCTION_X, y1: BROWSER_CY, x2: JUNCTION_X, y2: NESTJS_CY },
      { x1: JUNCTION_X, y1: NESTJS_CY, x2: RIGHT_LEFT, y2: NESTJS_CY },
    ],
    label: '/api',
  },
];

function segLen(s: Segment) {
  return Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
}

function posOnPath(segs: Segment[], progress: number): { x: number; y: number } {
  const total = segs.reduce((sum, s) => sum + segLen(s), 0);
  let dist = progress * total;
  for (const seg of segs) {
    const len = segLen(seg);
    if (dist <= len) {
      const t = dist / len;
      return { x: seg.x1 + (seg.x2 - seg.x1) * t, y: seg.y1 + (seg.y2 - seg.y1) * t };
    }
    dist -= len;
  }
  const last = segs[segs.length - 1]!;
  return { x: last.x2, y: last.y2 };
}

const boxes = [
  { label: 'Browser',  sublabel: undefined,  cx: BROWSER_CX, cy: BROWSER_CY },
  { label: 'Next.js',  sublabel: ':3000',    cx: RIGHT_CX,   cy: NEXTJS_CY },
  { label: 'NestJS',   sublabel: ':3001',    cx: RIGHT_CX,   cy: NESTJS_CY },
];

export default function RequestFlow() {
  const svgRef = useRef<SVGSVGElement>(null);
  const timerRef = useRef<d3.Timer | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${VIEWBOX_W} ${VIEWBOX_H}`);

    const root = svg.append('g');

    // Draw wires as polylines
    paths.forEach((path) => {
      const points = [
        ...path.segments.map((s) => [s.x1, s.y1] as [number, number]),
        [path.segments[path.segments.length - 1]!.x2, path.segments[path.segments.length - 1]!.y2] as [number, number],
      ];

      root
        .append('polyline')
        .attr('points', points.map((p) => p.join(',')).join(' '))
        .attr('fill', 'none')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1)
        .attr('opacity', 0.15);

      if (path.label) {
        // Place label just below the bottom horizontal segment midpoint
        const lastSeg = path.segments[path.segments.length - 1]!;
        const mx = (lastSeg.x1 + lastSeg.x2) / 2;
        root
          .append('text')
          .text(path.label)
          .attr('x', mx)
          .attr('y', NESTJS_CY + 16)
          .attr('text-anchor', 'middle')
          .attr('font-size', 10)
          .attr('class', 'fill-foreground/30 font-mono');
      }
    });

    // Draw boxes
    boxes.forEach((b) => {
      const g = root
        .append('g')
        .attr('transform', `translate(${b.cx - BOX_W / 2},${b.cy - BOX_H / 2})`);

      g.append('rect')
        .attr('width', BOX_W)
        .attr('height', BOX_H)
        .attr('rx', 8)
        .attr('class', 'fill-secondary/50 stroke-foreground/10')
        .attr('stroke-width', 1);

      g.append('text')
        .text(b.label)
        .attr('x', BOX_W / 2)
        .attr('y', b.sublabel ? BOX_H / 2 - 7 : BOX_H / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 12)
        .attr('class', 'fill-foreground/80 font-sans');

      if (b.sublabel) {
        g.append('text')
          .text(b.sublabel)
          .attr('x', BOX_W / 2)
          .attr('y', BOX_H / 2 + 9)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', 10)
          .attr('class', 'fill-foreground/35 font-mono');
      }
    });

    // Particles
    type Particle = { pathIndex: number; progress: number };
    const particles: Particle[] = paths.flatMap((_, pi) =>
      Array.from({ length: PARTICLES_PER_PATH }, (_, i) => ({
        pathIndex: pi,
        progress: i / PARTICLES_PER_PATH,
      })),
    );

    const particleEls = root
      .selectAll<SVGCircleElement, Particle>('circle.particle')
      .data(particles)
      .join('circle')
      .attr('class', 'particle')
      .attr('r', 2.5)
      .attr('fill', 'currentColor');

    const update = () => {
      particleEls
        .each(function (d) {
          const { x, y } = posOnPath(paths[d.pathIndex]!.segments, d.progress);
          const t = d.progress;
          const edge = 0.1;
          const opacity = t < edge ? (t / edge) * 0.5 : t > 1 - edge ? ((1 - t) / edge) * 0.5 : 0.5;
          d3.select(this).attr('cx', x).attr('cy', y).attr('opacity', opacity);
        });
    };

    update();

    let lastElapsed = 0;
    timerRef.current?.stop();
    timerRef.current = d3.timer((elapsed) => {
      const delta = (elapsed - lastElapsed) / 1000;
      lastElapsed = elapsed;
      particles.forEach((p) => {
        p.progress += SPEED * delta;
        if (p.progress >= 1) p.progress -= 1;
      });
      update();
    });

    return () => {
      timerRef.current?.stop();
      timerRef.current = null;
    };
  }, []);

  return (
    <div className="w-full my-8 text-foreground">
      <svg
        ref={svgRef}
        width="100%"
        aria-label="Request flow diagram"
        className="text-foreground"
      />
    </div>
  );
}
