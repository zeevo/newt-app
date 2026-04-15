'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type Node = {
  label: string;
  sublabel?: string;
};

const defaultNodes: Node[] = [
  { label: 'Browser' },
  { label: 'Next.js', sublabel: ':3000' },
  { label: 'NestJS', sublabel: ':3001' },
  { label: 'Database' },
];

const VIEWBOX_W = 640;
const VIEWBOX_H = 110;
const BOX_W = 100;
const BOX_H = 52;
const PARTICLES_PER_SEGMENT = 4;
const SPEED = 0.28; // segments per second

export default function RequestFlow({ nodes = defaultNodes }: { nodes?: Node[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const timerRef = useRef<d3.Timer | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${VIEWBOX_W} ${VIEWBOX_H}`);

    const cy = VIEWBOX_H / 2;
    const totalGap = VIEWBOX_W - nodes.length * BOX_W;
    const gap = totalGap / (nodes.length - 1);

    const positions = nodes.map((node, i) => ({
      ...node,
      cx: BOX_W / 2 + i * (BOX_W + gap),
      cy,
    }));

    // Wire segments (box right-edge → next box left-edge)
    const segments = positions.slice(0, -1).map((pos, i) => ({
      x1: pos.cx + BOX_W / 2,
      y1: cy,
      x2: positions[i + 1]!.cx - BOX_W / 2,
      y2: cy,
    }));

    const root = svg.append('g');

    // Wires
    segments.forEach((seg) => {
      root
        .append('line')
        .attr('x1', seg.x1).attr('y1', seg.y1)
        .attr('x2', seg.x2).attr('y2', seg.y2)
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1)
        .attr('opacity', 0.15);

      // Arrowhead
      const ax = seg.x2;
      const ay = seg.y2;
      root
        .append('polygon')
        .attr('points', `${ax},${ay} ${ax - 7},${ay - 3.5} ${ax - 7},${ay + 3.5}`)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.2);
    });

    // Boxes
    positions.forEach((pos) => {
      const g = root
        .append('g')
        .attr('transform', `translate(${pos.cx - BOX_W / 2},${cy - BOX_H / 2})`);

      g.append('rect')
        .attr('width', BOX_W)
        .attr('height', BOX_H)
        .attr('rx', 8)
        .attr('class', 'fill-secondary/50 stroke-foreground/10')
        .attr('stroke-width', 1);

      g.append('text')
        .text(pos.label)
        .attr('x', BOX_W / 2)
        .attr('y', pos.sublabel ? BOX_H / 2 - 7 : BOX_H / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 12)
        .attr('class', 'fill-foreground/80 font-sans');

      if (pos.sublabel) {
        g.append('text')
          .text(pos.sublabel)
          .attr('x', BOX_W / 2)
          .attr('y', BOX_H / 2 + 9)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', 10)
          .attr('class', 'fill-foreground/35 font-mono');
      }
    });

    // Particles
    type Particle = { segmentIndex: number; progress: number };
    const particles: Particle[] = segments.flatMap((_, si) =>
      Array.from({ length: PARTICLES_PER_SEGMENT }, (_, pi) => ({
        segmentIndex: si,
        progress: pi / PARTICLES_PER_SEGMENT,
      })),
    );

    const particleEls = root
      .selectAll<SVGCircleElement, Particle>('circle.particle')
      .data(particles)
      .join('circle')
      .attr('class', 'particle')
      .attr('r', 2.5)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.5);

    const updatePositions = () => {
      particleEls
        .attr('cx', (d) => {
          const s = segments[d.segmentIndex]!;
          return s.x1 + (s.x2 - s.x1) * d.progress;
        })
        .attr('cy', (d) => {
          const s = segments[d.segmentIndex]!;
          return s.y1 + (s.y2 - s.y1) * d.progress;
        })
        .attr('opacity', (d) => {
          const t = d.progress;
          const edge = 0.12;
          if (t < edge) return (t / edge) * 0.55;
          if (t > 1 - edge) return ((1 - t) / edge) * 0.55;
          return 0.55;
        });
    };

    updatePositions();

    let lastElapsed = 0;
    timerRef.current?.stop();
    timerRef.current = d3.timer((elapsed) => {
      const delta = (elapsed - lastElapsed) / 1000;
      lastElapsed = elapsed;
      particles.forEach((p) => {
        p.progress += SPEED * delta;
        if (p.progress >= 1) p.progress -= 1;
      });
      updatePositions();
    });

    return () => {
      timerRef.current?.stop();
      timerRef.current = null;
    };
  }, [nodes]);

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
