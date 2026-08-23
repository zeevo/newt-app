type Tool = {
  id: string;
  name: string;
  x: number;
  y: number;
  stalled: boolean;
  dx: number;
  dy: number;
  anchor: "start" | "middle" | "end";
};

const TOOLS: Tool[] = [
  {
    id: "newt-app",
    name: "newt-app",
    x: -3,
    y: 8.8,
    stalled: false,
    dx: 0,
    dy: -17,
    anchor: "middle",
  },
  {
    id: "redwoodsdk",
    name: "RedwoodSDK",
    x: 2.5,
    y: 8.6,
    stalled: false,
    dx: 11,
    dy: 4,
    anchor: "start",
  },
  {
    id: "better-t-stack",
    name: "Better-T-Stack",
    x: 0.5,
    y: 7.8,
    stalled: false,
    dx: 0,
    dy: 21,
    anchor: "middle",
  },
  {
    id: "create-vite",
    name: "create-vite",
    x: -9,
    y: 7.2,
    stalled: false,
    dx: 11,
    dy: 4,
    anchor: "start",
  },
  {
    id: "create-next-app",
    name: "create-next-app",
    x: -7.3,
    y: 6.4,
    stalled: false,
    dx: 11,
    dy: 4,
    anchor: "start",
  },
  {
    id: "create-turbo",
    name: "create-turbo",
    x: -5.5,
    y: 5.5,
    stalled: false,
    dx: 11,
    dy: 4,
    anchor: "start",
  },
  {
    id: "nx",
    name: "Nx",
    x: 7,
    y: 4.5,
    stalled: false,
    dx: -11,
    dy: 4,
    anchor: "end",
  },
  {
    id: "next-forge",
    name: "next-forge",
    x: 9.5,
    y: 5.2,
    stalled: true,
    dx: -11,
    dy: -13,
    anchor: "end",
  },
  {
    id: "epic-stack",
    name: "epic-stack",
    x: 6,
    y: -3,
    stalled: true,
    dx: -11,
    dy: 4,
    anchor: "end",
  },
  {
    id: "create-t3-app",
    name: "create-t3-app",
    x: -3,
    y: -5.5,
    stalled: true,
    dx: 11,
    dy: 4,
    anchor: "start",
  },
  {
    id: "create-remix",
    name: "create-remix",
    x: -6,
    y: -7.5,
    stalled: true,
    dx: -11,
    dy: 4,
    anchor: "end",
  },
  {
    id: "blitz",
    name: "Blitz",
    x: 3,
    y: -7.5,
    stalled: true,
    dx: 11,
    dy: 4,
    anchor: "start",
  },
];

const SIZE = 700;
const PAD = 60;
const CENTER = SIZE / 2;
const UNIT = (CENTER - PAD) / 10;
const TICKS = [-8, -6, -4, -2, 2, 4, 6, 8];

const px = (v: number) => CENTER + v * UNIT;
const py = (v: number) => CENTER - v * UNIT;

export function ScaffolderCompass() {
  return (
    <div className="rounded-xl border bg-card p-4 sm:p-6">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label="Twelve TypeScript scaffolders plotted by how modern the architecture is and how complicated the result is to work in. newt-app sits in the modern and simple quadrant with Better-T-Stack, RedwoodSDK, create-turbo, create-vite and create-next-app. next-forge and Nx are modern but complicated. create-t3-app and create-remix are outdated but simple. epic-stack and Blitz are outdated and complicated."
          className="mx-auto h-auto w-full max-w-3xl min-w-[34rem]"
        >
          <rect
            x={CENTER}
            y={CENTER}
            width={CENTER - PAD}
            height={CENTER - PAD}
            className="fill-destructive/5"
          />

          {TICKS.map((tick) => (
            <line
              key={`v${tick}`}
              x1={px(tick)}
              y1={PAD}
              x2={px(tick)}
              y2={SIZE - PAD}
              className="stroke-border"
              strokeWidth={1}
            />
          ))}
          {TICKS.map((tick) => (
            <line
              key={`h${tick}`}
              x1={PAD}
              y1={py(tick)}
              x2={SIZE - PAD}
              y2={py(tick)}
              className="stroke-border"
              strokeWidth={1}
            />
          ))}

          <rect
            x={PAD}
            y={PAD}
            width={SIZE - PAD * 2}
            height={SIZE - PAD * 2}
            fill="none"
            className="stroke-border"
            strokeWidth={1.5}
          />
          <line
            x1={CENTER}
            y1={PAD}
            x2={CENTER}
            y2={SIZE - PAD}
            className="stroke-foreground"
            strokeWidth={1.5}
          />
          <line
            x1={PAD}
            y1={CENTER}
            x2={SIZE - PAD}
            y2={CENTER}
            className="stroke-foreground"
            strokeWidth={1.5}
          />

          <g className="fill-muted-foreground font-mono text-[11px] tracking-[0.16em]">
            <text x={CENTER} y={PAD - 20} textAnchor="middle">
              MODERN
            </text>
            <text x={CENTER} y={SIZE - PAD + 30} textAnchor="middle">
              OUTDATED
            </text>
            <text x={26} y={CENTER} textAnchor="middle" transform={`rotate(-90 26 ${CENTER})`}>
              SIMPLE
            </text>
            <text
              x={SIZE - 26}
              y={CENTER}
              textAnchor="middle"
              transform={`rotate(90 ${SIZE - 26} ${CENTER})`}
            >
              COMPLICATED
            </text>
          </g>

          {TOOLS.map((tool) => {
            const isSelf = tool.id === "newt-app";
            const cx = px(tool.x);
            const cy = py(tool.y);

            return (
              <g key={tool.id}>
                {isSelf && (
                  <>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={16}
                      fill="none"
                      className="stroke-foreground/20"
                      strokeWidth={1}
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={11}
                      fill="none"
                      className="stroke-foreground/45"
                      strokeWidth={1.5}
                    />
                  </>
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelf ? 7 : 5}
                  className={
                    isSelf
                      ? "fill-foreground"
                      : tool.stalled
                        ? "fill-card stroke-foreground/55"
                        : "fill-foreground/55"
                  }
                  strokeWidth={1.8}
                />
                {/* the halo lets a label sit over the grid without a backing
                    rect, which would need text metrics to size */}
                <text
                  x={cx + tool.dx}
                  y={cy + tool.dy}
                  textAnchor={tool.anchor}
                  strokeWidth={4}
                  style={{ paintOrder: "stroke" }}
                  className={`stroke-card font-mono text-[11px] ${
                    isSelf ? "fill-foreground font-semibold" : "fill-muted-foreground"
                  }`}
                >
                  {tool.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <dl className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-full bg-foreground" />
          <span>10 or more commits in 90 days</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-full border-[1.5px] border-foreground" />
          <span>under 5 commits in 90 days</span>
        </div>
      </dl>
    </div>
  );
}
