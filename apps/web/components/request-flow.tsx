'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const VIEWBOX_W = 620;
const VIEWBOX_H = 180;
const BOX_W = 110;
const BOX_H = 52;
const PARTICLES_PER_WIRE = 4;
const SPEED = 0.28;

type Wire = {
  x1: number; y1: number;
  x2: number; y2: number;
  label?: string;
};

type Box = {
  label: string;
  sublabel?: string;
  cx: number;
  cy: number;
};

export default function RequestFlow() {
  const svgRef = useRef<SVGSVGElement>(null);
  const timerRef = useRef<d3.Timer | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current!);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${VIEWBOX_W} ${VIEWBOX_H}`);

    const browserCx = 110;
    const browserCy = VIEWBOX_H / 2;
    const rightCx = 490;
    const nextjsCy = 52;
    const nestjsCy = 128;

    const boxes: Box[] = [
      { label: 'Browser', cx: browserCx, cy: browserCy },
      { label: 'Next.js', sublabel: ':3000', cx: rightCx, cy: nextjsCy },
      { label: 'NestJS', sublabel: ':3001', cx: rightCx, cy: nestjsCy },
    ];

    const wires: Wire[] = [
      {
        x1: browserCx + BOX_W / 2, y1: browserCy,
        x2: rightCx - BOX_W / 2,  y2: nextjsCy,
      },
      {
        x1: browserCx + BOX_W / 2, y1: browserCy,
        x2: rightCx - BOX_W / 2,  y2: nestjsCy,
        label: '/api',
      },
    ];

    const root = svg.append('g');

    // Wires
    wires.forEach((w) => {
      root
        .append('line')
        .attr('x1', w.x1).attr('y1', w.y1)
        .attr('x2', w.x2).attr('y2', w.y2)
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1)
        .attr('opacity', 0.15);

      if (w.label) {
        const mx = (w.x1 + w.x2) / 2;
        const my = (w.y1 + w.y2) / 2;
        root
          .append('text')
          .text(w.label)
          .attr('x', mx)
          .attr('y', my + 14)
          .attr('text-anchor', 'middle')
          .attr('font-size', 10)
          .attr('class', 'fill-foreground/30 font-mono');
      }
    });

    // Boxes
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
    type Particle = { wireIndex: number; progress: number };
    const particles: Particle[] = wires.flatMap((_, wi) =>
      Array.from({ length: PARTICLES_PER_WIRE }, (_, pi) => ({
        wireIndex: wi,
        progress: pi / PARTICLES_PER_WIRE,
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
        .attr('cx', (d) => {
          const w = wires[d.wireIndex]!;
          return w.x1 + (w.x2 - w.x1) * d.progress;
        })
        .attr('cy', (d) => {
          const w = wires[d.wireIndex]!;
          return w.y1 + (w.y2 - w.y1) * d.progress;
        })
        .attr('opacity', (d) => {
          const t = d.progress;
          const edge = 0.12;
          if (t < edge) return (t / edge) * 0.5;
          if (t > 1 - edge) return ((1 - t) / edge) * 0.5;
          return 0.5;
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
