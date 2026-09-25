"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const logos = [
  "/logos/better-auth.svg",
  "/logos/nextjs.svg",
  "/logos/tailwind.svg",
  "/logos/shadcn.svg",
  "/logos/nestjs.svg",
  "/logos/kysely.svg",
  "/logos/oxc.svg",
];

const VIEW_W = 1440;
const VIEW_H = 775;

const MIN_SIZE = 60;
const MAX_SIZE = 110;

// cruise-speed multipliers by size: small chips move fast, the largest slowest
const SPEED_SMALL = 1.4;
const SPEED_LARGE = 0.6;

// elastic collisions between chips: mass scales with disk area
const RESTITUTION = 0.85;

// speed slowly renormalizes toward each chip's cruise speed (direction kept),
// so the tank neither stalls out after bounces nor stays frantic after kicks
const CRUISE_RELAX = 0.4;

// clicking a chip shoots it off in a random direction; CRUISE_RELAX brings it
// back to cruise while it keeps ricocheting
const KICK_MIN = 600;
const KICK_MAX = 1200;
const KICK_SPIN = 4;

// spin: tangential slip at contacts (chip-chip and chip-wall) rubs chips into
// rotation, with disk inertia (I = m r^2 / 2), slow decay, and a sanity cap
const SPIN_GRIP = 0.4;
const SPIN_DAMP = 0.15;
const MAX_SPIN = 2.5;

// the tank's walls are elastic: a chip sinks into a wall on a soft spring
// (WALL_SPRING, acceleration per view unit of depth) until it hits a hard stop
// MAX_BEND_PX past it. Each wall is a damped string pinned at the corners that
// hugs the chip while it presses and wobbles back once it leaves; the canvas
// bleeds past the tank so the bulge has room to draw.
const WALL_SPRING = 6;
const MAX_BEND_PX = 8;
const BEND_SPACING = 12;
const BEND_TENSION = 2.72e6;
const BEND_STIFF = 900;
const BEND_DAMP = 12;
// the string is stepped at a fixed rate: its tension is too stiff for one step
// per frame
const BEND_RATE = 240;
const BLEED_PX = MAX_BEND_PX + 2;
const CORNER_SEGMENTS = 8;

const TEX_SIZE = 256;

// chip outlines are drawn at the same 1px as every border in the app
const BORDER_PX = 1;

// the floor: a 19px dot lattice in --border, faded out from under the headline,
// drawn under the chips in the same scene so it can react to them. Chips shove
// nearby lattice points outward, PUSH as a fraction of chip radius, out to WAKE
// radii.
const FLOOR_SPACING = 19;
const FLOOR_DOT = 0.75;
// smallest edge ramp the dots are allowed, in view units. fwidth still widens it
// wherever a wake stretches the lattice, so this only sets how crisp the dots
// read across the calm floor.
const FLOOR_DOT_SOFT = 0.25;
const FLOOR_PUSH = 0.28;
const FLOOR_WAKE = 1.5;

// the fade ellipse as fractions of the visible rect, and the distance across it
// at which the lattice reaches full strength
const FLOOR_FADE_EDGE = 0.8;
const FLOOR_FADE_MIN = 0.15;

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angVel: number;
  size: number;
  speed: number;
  group: THREE.Group;
};

type Wall = {
  // outward normal; the wall runs clockwise, along (-ny, nx)
  nx: number;
  ny: number;
  // the straight run between the corners, and the chips' side of it along the
  // normal
  x0: number;
  y0: number;
  length: number;
  rest: number;
  // outward displacement and velocity at evenly spaced nodes along the run
  bend: Float32Array;
  vel: Float32Array;
};

// normalize any CSS color (oklch, var-resolved, named) to a THREE.Color
function cssColor(css: string): THREE.Color {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return new THREE.Color().setRGB(r! / 255, g! / 255, b! / 255, THREE.SRGBColorSpace);
}

// theme colors matching the SVG version: fill-background circles, rings in
// --border like the app's own borders, and black (light) / white (dark)
// silhouettes
function readTheme() {
  const probe = document.createElement("div");
  probe.className = "bg-background";
  probe.style.display = "none";
  document.body.appendChild(probe);
  const background = cssColor(getComputedStyle(probe).backgroundColor);
  probe.remove();
  const dark = document.documentElement.classList.contains("dark");
  const border = cssColor(
    getComputedStyle(document.documentElement).getPropertyValue("--border").trim(),
  );
  return {
    background,
    border,
    silhouette: new THREE.Color(dark ? 0xffffff : 0x000000),
    logoAlpha: dark ? 0.35 : 0.3,
  };
}

// dot lattice in view coordinates, displaced and lit by the chips above it
function floorMaterial(chipCount: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new THREE.Color() },
      uViewMin: { value: new THREE.Vector2() },
      uViewMax: { value: new THREE.Vector2() },
      uRadius: { value: 0 },
      uChips: {
        value: Array.from({ length: chipCount }, () => new THREE.Vector2()),
      },
      uChipR: { value: new Float32Array(chipCount) },
    },
    vertexShader: `
      varying vec2 vView;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vView = vec2(world.x, -world.y);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      #define CHIP_COUNT ${chipCount}
      uniform vec3 uColor;
      uniform vec2 uViewMin;
      uniform vec2 uViewMax;
      uniform float uRadius;
      uniform vec2 uChips[CHIP_COUNT];
      uniform float uChipR[CHIP_COUNT];
      varying vec2 vView;

      void main() {
        // every chip measures from the undisplaced position, so overlapping
        // fields add instead of compounding into streaks
        vec2 shift = vec2(0.0);
        for (int i = 0; i < CHIP_COUNT; i++) {
          vec2 d = vView - uChips[i];
          float len = max(length(d), 0.001);
          float f = 1.0 - smoothstep(0.0, uChipR[i] * ${FLOOR_WAKE.toFixed(1)}, len);
          shift += (d / len) * f * uChipR[i] * ${FLOOR_PUSH.toFixed(2)};
        }
        vec2 p = vView + shift;

        // antialias against the on-screen gradient, which also softens the dots
        // out where a chip's wake stretches the lattice instead of streaking them
        vec2 cell = mod(p, ${FLOOR_SPACING.toFixed(1)}) - ${(FLOOR_SPACING / 2).toFixed(1)};
        float d = length(cell);
        float w = max(fwidth(d), ${FLOOR_DOT_SOFT.toFixed(2)});
        float mark = 1.0 - smoothstep(
          ${FLOOR_DOT.toFixed(2)} - w, ${FLOOR_DOT.toFixed(2)} + w, d);

        // fade the lattice out from under the headline, matching the CSS
        // radial-gradient it is modelled on: a linear ramp across an ellipse
        // 70% x 55% of the visible rect. Measured from the undisplaced position,
        // so a passing chip cannot drag the fade around with it.
        vec2 span = uViewMax - uViewMin;
        vec2 centre = uViewMin + span * vec2(0.5, 0.35);
        float t = length((vView - centre) / (span * vec2(0.35, 0.28)));
        float fade = mix(
          ${FLOOR_FADE_MIN.toFixed(2)}, 1.0,
          clamp(t / ${FLOOR_FADE_EDGE.toFixed(1)}, 0.0, 1.0));

        // the canvas bleeds past the walls, so clip to inside them by hand
        vec2 q = abs(vView - (uViewMin + uViewMax) * 0.5)
          - ((uViewMax - uViewMin) * 0.5 - uRadius);
        float inside = step(length(max(q, 0.0)) + min(max(q.x, q.y), 0.0), uRadius);

        float a = mark * fade * inside;
        if (a <= 0.002) discard;
        gl_FragColor = vec4(uColor, a);
        // uColor is in the linear working space, like every other material's;
        // a raw ShaderMaterial has to ask for the output conversion by hand
        #include <colorspace_fragment>
      }
    `,
  });
}

// rasterize an svg into a white silhouette texture, tinted later via material color
async function loadSilhouette(url: string): Promise<THREE.CanvasTexture> {
  const text = await (await fetch(url)).text();
  const viewBox = text
    .match(/viewBox="([^"]+)"/)?.[1]
    ?.split(/[\s,]+/)
    .map(Number);
  const aspect = viewBox && viewBox.length === 4 && viewBox[3]! > 0 ? viewBox[2]! / viewBox[3]! : 1;

  const blobUrl = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
  const img = new Image();
  img.src = blobUrl;
  await img.decode();

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = TEX_SIZE;
  const ctx = canvas.getContext("2d")!;
  // contain fit, centered, like the svg <image> default
  const w = aspect >= 1 ? TEX_SIZE : TEX_SIZE * aspect;
  const h = aspect >= 1 ? TEX_SIZE / aspect : TEX_SIZE;
  ctx.drawImage(img, (TEX_SIZE - w) / 2, (TEX_SIZE - h) / 2, w, h);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);
  URL.revokeObjectURL(blobUrl);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function LogoRain({
  density = 1,
  speedFactor = 0.09,
  // chip radii are in view units, so a short tank needs them scaled down or a
  // single chip fills half its height
  chipScale = 1,
  // the 1px wall drawn along the tank's inside edge
  border = true,
}: {
  density?: number;
  speedFactor?: number;
  chipScale?: number;
  border?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const container = canvas.parentElement!;
    let disposed = false;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
    } catch {
      return; // no WebGL: leave the background empty
    }
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, VIEW_W, 0, -VIEW_H, -10, 10);

    // CHIP_COUNT is interpolated into the floor shader as a GLSL array size,
    // which has to be a whole number
    const chipCount = Math.round(logos.length * density);
    const floorMat = floorMaterial(chipCount);
    const floorUniforms = floorMat.uniforms;

    // css pixels per view unit, so an outline can be sized in view units and
    // still land on one css pixel whatever the tank is scaled to
    let viewScale = 1;
    // radius of the walls' inner corners, in view units
    let corner = 0;

    const walls: Wall[] = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ].map(([nx, ny]) => ({
      nx: nx!,
      ny: ny!,
      x0: 0,
      y0: 0,
      length: 0,
      rest: 0,
      bend: new Float32Array(2),
      vel: new Float32Array(2),
    }));

    const wallMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const wall = new THREE.Mesh(new THREE.BufferGeometry(), wallMaterial);
    let wallPosition = new THREE.BufferAttribute(new Float32Array(0), 3);
    wall.renderOrder = MAX_SIZE * 10 + 3;
    if (border) scene.add(wall);

    // the walls' inner edge covers the view like preserveAspectRatio="xMidYMid
    // slice", and the camera reaches past it over the border and the bleed
    function fit() {
      const cw = container.clientWidth || 1;
      const ch = container.clientHeight || 1;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(cw + 2 * BLEED_PX, ch + 2 * BLEED_PX, false);
      const iw = Math.max(cw - 2 * BORDER_PX, 1);
      const ih = Math.max(ch - 2 * BORDER_PX, 1);
      const scale = Math.max(iw / VIEW_W, ih / VIEW_H);
      viewScale = scale;
      const visW = iw / scale;
      const visH = ih / scale;
      const pad = (BORDER_PX + BLEED_PX) / scale;
      camera.left = VIEW_W / 2 - visW / 2 - pad;
      camera.right = VIEW_W / 2 + visW / 2 + pad;
      camera.top = -VIEW_H / 2 + visH / 2 + pad;
      camera.bottom = -VIEW_H / 2 - visH / 2 - pad;
      camera.updateProjectionMatrix();
      // the container carries rounded-lg for this
      corner =
        Math.max(parseFloat(getComputedStyle(container).borderTopLeftRadius) - BORDER_PX, 0) /
        scale;
      floorUniforms.uViewMin!.value.set(VIEW_W / 2 - visW / 2, VIEW_H / 2 - visH / 2);
      floorUniforms.uViewMax!.value.set(VIEW_W / 2 + visW / 2, VIEW_H / 2 + visH / 2);
      floorUniforms.uRadius!.value = corner;

      walls.forEach((w) => {
        const midX = VIEW_W / 2 + (w.nx * visW) / 2;
        const midY = VIEW_H / 2 + (w.ny * visH) / 2;
        w.length = Math.max((w.ny ? visW : visH) - 2 * corner, 0);
        w.rest = midX * w.nx + midY * w.ny;
        w.x0 = midX + (w.ny * w.length) / 2;
        w.y0 = midY - (w.nx * w.length) / 2;
        const nodes = Math.max(Math.round(w.length / BEND_SPACING), 1) + 1;
        w.bend = new Float32Array(nodes);
        w.vel = new Float32Array(nodes);
      });

      // a ribbon of two vertices per point: every node, then each corner's arc
      const points = walls.reduce((n, w) => n + w.bend.length + CORNER_SEGMENTS - 1, 0);
      wallPosition = new THREE.BufferAttribute(new Float32Array(points * 6), 3).setUsage(
        THREE.DynamicDrawUsage,
      );
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", wallPosition);
      geometry.setIndex(
        Array.from({ length: points }, (_, p) => {
          const q = (p + 1) % points;
          return [2 * p, 2 * p + 1, 2 * q, 2 * p + 1, 2 * q + 1, 2 * q];
        }).flat(),
      );
      wall.geometry.dispose();
      wall.geometry = geometry;
    }
    fit();

    // lay the border along the bent walls and the rigid corners, growing
    // outward from the inner edge like a css border
    function drawWall() {
      const out = wallPosition.array;
      const width = BORDER_PX / viewScale;
      let k = 0;
      const put = (x: number, y: number, mx: number, my: number) => {
        out[k++] = x;
        out[k++] = -y;
        out[k++] = 0;
        out[k++] = x + mx * width;
        out[k++] = -(y + my * width);
        out[k++] = 0;
      };
      walls.forEach(({ nx, ny, x0, y0, length, bend }) => {
        const step = length / (bend.length - 1);
        bend.forEach((u, j) =>
          put(x0 - ny * step * j + nx * u, y0 + nx * step * j + ny * u, nx, ny),
        );
        const cx = x0 - ny * length - nx * corner;
        const cy = y0 + nx * length - ny * corner;
        const from = Math.atan2(ny, nx);
        Array.from(
          { length: CORNER_SEGMENTS - 1 },
          (_, i) => from + ((Math.PI / 2) * (i + 1)) / CORNER_SEGMENTS,
        ).forEach((a) => {
          const mx = Math.cos(a);
          const my = Math.sin(a);
          put(cx + mx * corner, cy + my * corner, mx, my);
        });
      });
      wallPosition.needsUpdate = true;
    }

    function render() {
      drawWall();
      renderer.render(scene, camera);
    }

    const floorGeometry = new THREE.PlaneGeometry(VIEW_W, VIEW_H);
    const floor = new THREE.Mesh(floorGeometry, floorMat);
    floor.position.set(VIEW_W / 2, -VIEW_H / 2, 0);
    floor.renderOrder = -1;
    scene.add(floor);

    const circleGeometry = new THREE.CircleGeometry(1, 64);
    const planeGeometry = new THREE.PlaneGeometry(1.2, 1.2);

    // a chip is drawn in a group scaled to its size, so the outline's pixel
    // width converts to view units and then back out of that scale
    const ringGeometry = (size: number) =>
      new THREE.RingGeometry(1 - BORDER_PX / viewScale / size, 1, 64);

    let theme = readTheme();
    floorUniforms.uColor!.value.copy(theme.border);
    wallMaterial.color.copy(theme.border);
    const circleMaterials: THREE.MeshBasicMaterial[] = [];
    const ringMaterials: THREE.MeshBasicMaterial[] = [];
    const logoMaterials: THREE.MeshBasicMaterial[] = [];
    const ringMeshes: THREE.Mesh[] = [];

    const minSize = MIN_SIZE * chipScale;
    const maxSize = MAX_SIZE * chipScale;
    const meanSize = (minSize + maxSize) / 2;
    const stars: Star[] = [];
    Array.from({ length: chipCount }).forEach(() => {
      const size = minSize + Math.random() * (maxSize - minSize);
      // seed inside the walls so no chip starts out pressed into one; a few
      // best-candidate samples gently discourage clumping without looking gridded
      const min = floorUniforms.uViewMin!.value;
      const max = floorUniforms.uViewMax!.value;
      const { x, y } = Array.from({ length: 4 }, () => ({
        x: min.x + size + Math.random() * Math.max(max.x - min.x - 2 * size, 0),
        y: min.y + size + Math.random() * Math.max(max.y - min.y - 2 * size, 0),
      })).reduce<{ x: number; y: number; dist: number }>(
        (best, candidate) => {
          const dist = stars.length
            ? Math.min(
                ...stars.map((o) => Math.hypot(o.x - candidate.x, o.y - candidate.y) - o.size),
              )
            : Infinity;
          return dist > best.dist ? { ...candidate, dist } : best;
        },
        { x: 0, y: 0, dist: -Infinity },
      );

      // size drives cruise speed only; opacity is uniform across chips
      const t = (size - minSize) / (maxSize - minSize);

      const group = new THREE.Group();
      group.scale.setScalar(size);
      group.position.set(x, -y, 0);

      const circleMaterial = new THREE.MeshBasicMaterial({
        color: theme.background,
        transparent: true,
        opacity: 1,
        depthWrite: false,
      });
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: theme.border,
        transparent: true,
        opacity: 1,
        depthWrite: false,
      });
      const logoMaterial = new THREE.MeshBasicMaterial({
        color: theme.silhouette,
        transparent: true,
        opacity: theme.logoAlpha,
        depthWrite: false,
      });
      logoMaterial.visible = false; // until its texture loads
      circleMaterials.push(circleMaterial);
      ringMaterials.push(ringMaterial);
      logoMaterials.push(logoMaterial);

      // larger chips draw on top so the quick small ones pass behind them
      const order = size * 10;
      const circle = new THREE.Mesh(circleGeometry, circleMaterial);
      circle.renderOrder = order;
      const ring = new THREE.Mesh(ringGeometry(size), ringMaterial);
      ring.renderOrder = order + 1;
      ringMeshes.push(ring);
      const logo = new THREE.Mesh(planeGeometry, logoMaterial);
      logo.renderOrder = order + 2;
      group.add(circle, ring, logo);
      scene.add(group);

      // small chips cruise fast, large ones slow, so the big shapes stay calm
      const speed = meanSize * speedFactor * (SPEED_SMALL - (SPEED_SMALL - SPEED_LARGE) * t);
      const heading = Math.random() * Math.PI * 2;
      stars.push({
        x,
        y,
        vx: Math.cos(heading) * speed,
        vy: Math.sin(heading) * speed,
        angle: 0,
        angVel: (Math.random() * 2 - 1) * 0.3,
        size,
        speed,
        group,
      });
    });

    const chipRadii: Float32Array = floorUniforms.uChipR!.value;
    const chipPositions: THREE.Vector2[] = floorUniforms.uChips!.value;
    stars.forEach((s, i) => {
      chipRadii[i] = s.size;
      chipPositions[i]!.set(s.x, s.y);
    });

    const textures: THREE.CanvasTexture[] = [];
    stars.forEach((_, i) => {
      loadSilhouette(logos[i % logos.length]!).then((texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        textures.push(texture);
        logoMaterials[i]!.map = texture;
        logoMaterials[i]!.visible = true;
        logoMaterials[i]!.needsUpdate = true;
        render();
      });
    });

    function applyTheme() {
      theme = readTheme();
      circleMaterials.forEach((m) => {
        m.color.copy(theme.background);
        m.opacity = 1;
      });
      ringMaterials.forEach((m) => {
        m.color.copy(theme.border);
        m.opacity = 1;
      });
      logoMaterials.forEach((m) => {
        m.color.copy(theme.silhouette);
        m.opacity = theme.logoAlpha;
      });
      floorUniforms.uColor!.value.copy(theme.border);
      wallMaterial.color.copy(theme.border);
      render();
    }

    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resizeObserver = new ResizeObserver(() => {
      fit();
      // a css pixel is worth a different number of view units at the new scale
      ringMeshes.forEach((ring, i) => {
        ring.geometry.dispose();
        ring.geometry = ringGeometry(stars[i]!.size);
      });
      render();
    });
    resizeObserver.observe(container);

    const reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // map a pointer event through the camera bounds into view (svg) coords and
    // find the chip under it, if any
    const chipAt = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const u = (e.clientX - rect.left) / (rect.width || 1);
      const v = (e.clientY - rect.top) / (rect.height || 1);
      const x = camera.left + u * (camera.right - camera.left);
      const y = -(camera.top + v * (camera.bottom - camera.top));
      return stars.find((s) => Math.hypot(x - s.x, y - s.y) < s.size);
    };
    const onPointerMove = (e: PointerEvent) => {
      canvas.style.cursor = chipAt(e) ? "pointer" : "";
    };
    const onPointerDown = (e: PointerEvent) => {
      const s = chipAt(e);
      if (!s) return;
      const angle = Math.random() * Math.PI * 2;
      const kick = KICK_MIN + Math.random() * (KICK_MAX - KICK_MIN);
      s.vx = Math.cos(angle) * kick;
      s.vy = Math.sin(angle) * kick;
      s.angVel += (Math.random() * 2 - 1) * KICK_SPIN;
    };

    if (reduceMotion) {
      render();
    } else {
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerdown", onPointerDown);
      let last = performance.now();
      renderer.setAnimationLoop((now) => {
        // a long stall (a background tab) would fling chips deep into the walls
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        const relax = 1 - Math.exp(-CRUISE_RELAX * dt);
        const maxBend = MAX_BEND_PX / viewScale;
        stars.forEach((s) => {
          // renormalize speed toward cruise, keeping direction
          const spd = Math.hypot(s.vx, s.vy) || 1;
          const scale = 1 + ((s.speed - spd) / spd) * relax;
          s.vx *= scale;
          s.vy *= scale;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.angVel = Math.max(-MAX_SPIN, Math.min(MAX_SPIN, s.angVel * Math.exp(-SPIN_DAMP * dt)));
          s.angle += s.angVel * dt;
          // sink into the walls, which spring back; turning around against
          // one rubs the chip into rotation
          walls.forEach(({ nx, ny, rest }) => {
            const depth = s.x * nx + s.y * ny + s.size - rest;
            if (depth <= 0) return;
            const vn = s.vx * nx + s.vy * ny;
            let turned = vn - WALL_SPRING * depth * dt;
            if (depth > maxBend) {
              s.x -= nx * (depth - maxBend);
              s.y -= ny * (depth - maxBend);
              turned = -Math.abs(vn);
            }
            s.vx += (turned - vn) * nx;
            s.vy += (turned - vn) * ny;
            if (vn <= 0 || turned > 0) return;
            const slip = s.vx * ny - s.vy * nx - s.angVel * s.size;
            s.vx -= SPIN_GRIP * slip * ny;
            s.vy += SPIN_GRIP * slip * nx;
            s.angVel += (2 * SPIN_GRIP * slip) / s.size;
          });
        });

        // elastic circle collisions
        stars.forEach((a, i) => {
          stars.slice(i + 1).forEach((b) => {
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 1;
            const overlap = a.size + b.size - dist;
            if (overlap <= 0) return;
            const nx = dx / dist;
            const ny = dy / dist;
            const ma = a.size * a.size;
            const mb = b.size * b.size;
            const inv = 1 / ma + 1 / mb;
            // separate in proportion to inverse mass
            const wa = 1 / ma / inv;
            const wb = 1 / mb / inv;
            a.x -= nx * overlap * wa;
            a.y -= ny * overlap * wa;
            b.x += nx * overlap * wb;
            b.y += ny * overlap * wb;
            // impulse along the normal, only while approaching
            const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (rel >= 0) return;
            const j = (-(1 + RESTITUTION) * rel) / inv;
            a.vx -= (j / ma) * nx;
            a.vy -= (j / ma) * ny;
            b.vx += (j / mb) * nx;
            b.vy += (j / mb) * ny;
            // tangential slip at the contact rubs both chips into rotation
            const tx = -ny;
            const ty = nx;
            const slip =
              (b.vx - a.vx) * tx + (b.vy - a.vy) * ty - (a.angVel * a.size + b.angVel * b.size);
            const jt = (SPIN_GRIP * slip) / inv;
            a.vx += (jt / ma) * tx;
            a.vy += (jt / ma) * ty;
            b.vx -= (jt / mb) * tx;
            b.vy -= (jt / mb) * ty;
            a.angVel += (2 * jt) / (ma * a.size);
            b.angVel += (2 * jt) / (mb * b.size);
          });
        });

        // step the walls' strings, pinning each back out to the surface of any
        // chip still pressing into it
        const steps = Math.ceil(dt * BEND_RATE);
        const h = dt / steps;
        Array.from({ length: steps }).forEach(() => {
          walls.forEach((w) => {
            const { bend, vel } = w;
            const last = bend.length - 1;
            const spacing = w.length / last;
            const tension = BEND_TENSION / (spacing * spacing);
            vel.forEach((v, j) => {
              if (j === 0 || j === last) return;
              const pull = tension * (bend[j - 1]! - 2 * bend[j]! + bend[j + 1]!);
              vel[j] = v + (pull - BEND_STIFF * bend[j]! - BEND_DAMP * v) * h;
            });
            bend.forEach((u, j) => {
              bend[j] = u + vel[j]! * h;
            });
            stars.forEach((s) => {
              const depth = s.x * w.nx + s.y * w.ny + s.size - w.rest;
              if (depth <= 0) return;
              const along = (w.x0 - s.x) * w.ny + (s.y - w.y0) * w.nx;
              bend.forEach((u, j) => {
                const off = j * spacing - along;
                if (j === 0 || j === last || Math.abs(off) >= s.size) return;
                const surface = depth - s.size + Math.sqrt(s.size * s.size - off * off);
                if (surface <= u) return;
                bend[j] = surface;
                vel[j] = Math.max(vel[j]!, 0);
              });
            });
          });
        });

        stars.forEach((s, i) => {
          s.group.position.set(s.x, -s.y, 0);
          s.group.rotation.z = -s.angle;
          chipPositions[i]!.set(s.x, s.y);
        });
        render();
      });
    }

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      themeObserver.disconnect();
      resizeObserver.disconnect();
      circleGeometry.dispose();
      ringMeshes.forEach((ring) => ring.geometry.dispose());
      planeGeometry.dispose();
      floorGeometry.dispose();
      floorMat.dispose();
      wall.geometry.dispose();
      wallMaterial.dispose();
      [...circleMaterials, ...ringMaterials, ...logoMaterials].forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, [density, speedFactor, chipScale, border]);

  return (
    <div className="relative h-full w-full rounded-lg text-foreground">
      <canvas
        ref={canvasRef}
        aria-label="Floating logos visualization"
        role="img"
        className="pointer-events-auto absolute block"
        // a positioned canvas takes its drawing buffer's size unless told otherwise
        style={{
          inset: -BLEED_PX,
          width: `calc(100% + ${2 * BLEED_PX}px)`,
          height: `calc(100% + ${2 * BLEED_PX}px)`,
        }}
      />
    </div>
  );
}
