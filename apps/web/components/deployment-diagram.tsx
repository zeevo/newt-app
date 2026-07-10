// Crisp, consistent diagrams for the deployment docs. Pure SVG, no client JS.
// Two auto-laying-out primitives so every diagram shares one visual language:
//   <FlowDiagram> — horizontal nodes joined by arrows, optionally boxed in a boundary
//   <StackDiagram> — a single container node, optionally holding routed rows

const NODE_H = 64;
const RX = 10;
const GAP = 78;
const OUTER = 6;
const BPAD = 18;
const BLABEL = 24;

const nodeTitle =
  'fill-[var(--foreground)] font-sans text-[14px] font-semibold';
const nodeSub = 'fill-[var(--muted-foreground)] font-mono text-[12px]';
const boundaryLabel =
  'fill-[var(--muted-foreground)] font-mono text-[11px] tracking-wide uppercase';
const arrowLabel = 'fill-[var(--muted-foreground)] font-mono text-[11px]';

function Node({
  x,
  y,
  w,
  title,
  subtitle,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  subtitle?: string;
}) {
  const cx = x + w / 2;
  const cy = y + NODE_H / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={NODE_H}
        rx={RX}
        fill="var(--muted)"
        stroke="var(--border)"
        strokeWidth={1.5}
      />
      <text
        x={cx}
        y={subtitle ? cy - 7 : cy}
        textAnchor="middle"
        dominantBaseline="middle"
        className={nodeTitle}
      >
        {title}
      </text>
      {subtitle && (
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          className={nodeSub}
        >
          {subtitle}
        </text>
      )}
    </g>
  );
}

function Arrow({
  x1,
  x2,
  y,
  label,
}: {
  x1: number;
  x2: number;
  y: number;
  label?: string;
}) {
  const tip = x2;
  return (
    <g>
      <line
        x1={x1}
        y1={y}
        x2={tip - 6}
        y2={y}
        stroke="var(--muted-foreground)"
        strokeWidth={1.5}
      />
      <polygon
        points={`${tip},${y} ${tip - 8},${y - 4.5} ${tip - 8},${y + 4.5}`}
        fill="var(--muted-foreground)"
      />
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={y - 9}
          textAnchor="middle"
          className={arrowLabel}
        >
          {label}
        </text>
      )}
    </g>
  );
}

type FlowNode = { title: string; subtitle?: string };

function FlowDiagram({
  nodes,
  arrows = [],
  boundary,
  nodeWidth = 150,
  ariaLabel,
}: {
  nodes: FlowNode[];
  arrows?: string[];
  boundary?: string;
  nodeWidth?: number;
  ariaLabel: string;
}) {
  const nodesW = nodes.length * nodeWidth + (nodes.length - 1) * GAP;
  const inset = boundary ? BPAD : 0;
  const startX = OUTER + inset;
  const nodeY = OUTER + (boundary ? BLABEL : 8);
  const width = OUTER * 2 + inset * 2 + nodesW;
  const height = nodeY + NODE_H + (boundary ? BPAD : 8);
  const midY = nodeY + NODE_H / 2;

  return (
    <Frame width={width} height={height} ariaLabel={ariaLabel}>
      {boundary && (
        <>
          <rect
            x={OUTER}
            y={OUTER}
            width={width - OUTER * 2}
            height={height - OUTER * 2}
            rx={12}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          <text x={OUTER + BPAD} y={OUTER + 15} className={boundaryLabel}>
            {boundary}
          </text>
        </>
      )}
      {nodes.map((n, i) => {
        const x = startX + i * (nodeWidth + GAP);
        return (
          <Node key={i} x={x} y={nodeY} w={nodeWidth} title={n.title} subtitle={n.subtitle} />
        );
      })}
      {arrows.map((label, i) => {
        const x1 = startX + (i + 1) * nodeWidth + i * GAP;
        const x2 = x1 + GAP;
        return <Arrow key={i} x1={x1} x2={x2} y={midY} label={label} />;
      })}
    </Frame>
  );
}

function StackDiagram({
  title,
  subtitle,
  rows,
  ariaLabel,
}: {
  title: string;
  subtitle?: string;
  rows?: { path: string; target: string }[];
  ariaLabel: string;
}) {
  const width = 460;
  const rowH = 34;
  const rowGap = 10;
  const inner = OUTER + BPAD;
  const bodyTop = OUTER + (rows ? BLABEL + 6 : 0);
  const rowsH = rows ? rows.length * rowH + (rows.length - 1) * rowGap : NODE_H;
  const height = bodyTop + rowsH + (rows ? BPAD : OUTER);

  return (
    <Frame width={width} height={height} ariaLabel={ariaLabel}>
      <rect
        x={OUTER}
        y={OUTER}
        width={width - OUTER * 2}
        height={height - OUTER * 2}
        rx={12}
        fill="var(--muted)"
        stroke="var(--border)"
        strokeWidth={1.5}
      />
      {rows ? (
        <text x={inner} y={OUTER + 16} className={boundaryLabel}>
          {title}
          {subtitle ? ` · ${subtitle}` : ''}
        </text>
      ) : (
        <>
          <text
            x={width / 2}
            y={height / 2 - 7}
            textAnchor="middle"
            dominantBaseline="middle"
            className={nodeTitle}
          >
            {title}
          </text>
          {subtitle && (
            <text
              x={width / 2}
              y={height / 2 + 12}
              textAnchor="middle"
              dominantBaseline="middle"
              className={nodeSub}
            >
              {subtitle}
            </text>
          )}
        </>
      )}
      {rows?.map((r, i) => {
        const y = bodyTop + i * (rowH + rowGap);
        return (
          <g key={i}>
            <rect
              x={inner}
              y={y}
              width={width - inner * 2}
              height={rowH}
              rx={6}
              fill="var(--background)"
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={inner + 14}
              y={y + rowH / 2}
              dominantBaseline="middle"
              className={nodeSub}
            >
              {r.path}
            </text>
            <text
              x={inner + 96}
              y={y + rowH / 2}
              dominantBaseline="middle"
              className={nodeSub}
            >
              → {r.target}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

function Frame({
  width,
  height,
  ariaLabel,
  children,
}: {
  width: number;
  height: number;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      className="mx-auto my-6 block h-auto w-full"
      style={{ maxWidth: `${width + 40}px` }}
    >
      {children}
    </svg>
  );
}

// MDX-facing diagrams. Data lives here (props don't survive the MDX pipeline),
// so each doc just drops in a bare tag like <StandaloneDiagram />.
export function StandaloneDiagram() {
  return (
    <FlowDiagram
      ariaLabel="Standalone deployment: two separate containers connected by an API proxy"
      nodes={[
        { title: 'Next.js', subtitle: ':3000' },
        { title: 'NestJS', subtitle: ':3001' },
      ]}
      arrows={['/api/*']}
    />
  );
}

export function SingleImageDiagram() {
  return (
    <FlowDiagram
      ariaLabel="Single Docker image: both processes inside one container"
      boundary="Docker image"
      nodes={[
        { title: 'Next.js', subtitle: ':3000' },
        { title: 'NestJS', subtitle: ':3001' },
      ]}
      arrows={['/api/*']}
    />
  );
}

export function VercelDiagram() {
  return (
    <FlowDiagram
      ariaLabel="Vercel deployment: Next.js app with NestJS running as an application context"
      boundary="Vercel"
      nodes={[
        { title: 'Next.js', subtitle: 'API routes' },
        { title: 'NestJS', subtitle: 'app context' },
      ]}
      arrows={['']}
    />
  );
}

export function CustomServerDiagram() {
  return (
    <StackDiagram
      ariaLabel="Custom server: Next.js and NestJS in a single process on one port"
      title="Next.js + NestJS"
      subtitle="single process · port 3000"
    />
  );
}

export function SpaDiagram() {
  return (
    <StackDiagram
      ariaLabel="SPA mode: NestJS serves API routes and the static Next.js build on one port"
      title="NestJS"
      subtitle="port 3000"
      rows={[
        { path: '/api/*', target: 'controllers' },
        { path: '/*', target: 'static files (Next.js build)' },
      ]}
    />
  );
}
