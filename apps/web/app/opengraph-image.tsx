import { siteConfig } from "@/lib/config";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = siteConfig.description;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// tokens from packages/ui/src/styles/globals.css, dark theme, resolved to hex
// because satori does not understand oklch()
const BACKGROUND = "#0a0a0a";
const FOREGROUND = "#fafafa";
const MUTED_FOREGROUND = "#a1a1a1";
const BORDER = "#5a5a5a";

// same mark as app/icon.svg
const LOGO_PATH =
  "M98 35C102.665 35 107.243 35.2232 111.707 35.6514C111.243 38.1972 111 40.8202 111 43.5C111 67.5244 130.476 87 154.5 87C165.156 87 174.914 83.1658 182.478 76.8057C183.476 79.9455 184 83.186 184 86.5C184 114.943 145.496 138 98 138C50.5035 138 12 114.943 12 86.5C12 83.1861 12.5228 79.9454 13.5215 76.8057C21.0851 83.1661 30.8441 87 41.5 87C65.5244 87 85 67.5244 85 43.5C85 40.8202 84.7559 38.1973 84.292 35.6514C88.7559 35.2232 93.3345 35 98 35ZM38.5 0C59.763 0 77 17.237 77 38.5C77 59.763 59.763 77 38.5 77C17.237 77 0 59.763 0 38.5C0 17.237 17.237 0 38.5 0ZM157.5 0C178.763 0 196 17.237 196 38.5C196 59.763 178.763 77 157.5 77C136.237 77 119 59.763 119 38.5C119 17.237 136.237 0 157.5 0Z";

const loadFont = (file: string) =>
  readFile(join(process.cwd(), "app", "fonts", file));

export default async function Image() {
  const [sans, mono] = await Promise.all([
    loadFont("Geist-SemiBold.ttf"),
    loadFont("GeistMono-Regular.ttf"),
  ]);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        padding: 20,
        backgroundColor: BACKGROUND,
        color: FOREGROUND,
        fontFamily: "Geist",
        fontWeight: 600,
      }}
    >
      {/* inset frame, mirroring the homepage hero */}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          border: `1px solid ${BORDER}`,
          padding: "52px 60px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width={52} height={52} viewBox="-12 -41 220 220">
            <path d={LOGO_PATH} fill={FOREGROUND} />
          </svg>
          <div
            style={{ display: "flex", fontSize: 38, letterSpacing: "-0.02em" }}
          >
            {siteConfig.title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 900,
            fontSize: 50,
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
          }}
        >
          {siteConfig.description}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "Geist Mono",
            fontSize: 26,
            color: MUTED_FOREGROUND,
          }}
        >
          <div style={{ display: "flex" }}>npm create newt-app</div>
          <div style={{ display: "flex" }}>
            {siteConfig.url.replace("https://", "")}
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: sans, style: "normal", weight: 600 },
        { name: "Geist Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
