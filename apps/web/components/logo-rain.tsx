'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const logos = [
  '/logos/better-auth.svg',
  '/logos/nextjs.svg',
  '/logos/tailwind.svg',
  '/logos/shadcn.svg',
  '/logos/nestjs.svg',
  '/logos/kysely.svg',
  '/logos/oxc.svg',
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

const TEX_SIZE = 256;

// the floor: a dot lattice drawn under the chips in the same scene, so it can
// react to them. Chips shove nearby lattice points outward (PUSH, as a fraction
// of chip radius, out to WAKE radii) and brighten the dots they pass over.
const FLOOR_SPACING = 20;
const FLOOR_DOT = 1.1;
const FLOOR_ALPHA = 0.6;
const FLOOR_PUSH = 0.45;
const FLOOR_WAKE = 1.8;
const FLOOR_GLOW = 1.0;

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

// normalize any CSS color (oklch, var-resolved, named) to a THREE.Color
function cssColor(css: string): THREE.Color {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return new THREE.Color().setRGB(r! / 255, g! / 255, b! / 255, THREE.SRGBColorSpace);
}

// theme colors matching the SVG version: fill-background circles,
// stroke-primary/15 rings, and black (light) / white (dark) silhouettes
function readTheme() {
  const probe = document.createElement('div');
  probe.className = 'bg-background text-primary';
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const styles = getComputedStyle(probe);
  const background = cssColor(styles.backgroundColor);
  const primary = cssColor(styles.color);
  probe.remove();
  const dark = document.documentElement.classList.contains('dark');
  const border = cssColor(
    getComputedStyle(document.documentElement).getPropertyValue('--border').trim(),
  );
  return {
    background,
    primary,
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
      uniform vec2 uChips[CHIP_COUNT];
      uniform float uChipR[CHIP_COUNT];
      varying vec2 vView;

      void main() {
        // every chip measures from the undisplaced position, so overlapping
        // fields add instead of compounding into streaks
        vec2 shift = vec2(0.0);
        float glow = 0.0;
        for (int i = 0; i < CHIP_COUNT; i++) {
          vec2 d = vView - uChips[i];
          float len = max(length(d), 0.001);
          float f = 1.0 - smoothstep(0.0, uChipR[i] * ${FLOOR_WAKE.toFixed(1)}, len);
          shift += (d / len) * f * uChipR[i] * ${FLOOR_PUSH.toFixed(2)};
          glow += f;
        }
        vec2 p = vView + shift;

        // antialias against the on-screen gradient, which also softens the dots
        // out where a chip's wake stretches the lattice instead of streaking them
        vec2 cell = mod(p, ${FLOOR_SPACING.toFixed(1)}) - ${(FLOOR_SPACING / 2).toFixed(1)};
        float d = length(cell);
        float w = max(fwidth(d), 0.5);
        float mark = 1.0 - smoothstep(
          ${FLOOR_DOT.toFixed(2)} - w, ${FLOOR_DOT.toFixed(2)} + w, d);

        // fade the lattice out from under the headline, using the undisplaced
        // position so a passing chip cannot drag the fade around with it
        vec2 span = uViewMax - uViewMin;
        vec2 centre = uViewMin + span * vec2(0.5, 0.35);
        float t = length((vView - centre) / (span * vec2(0.35, 0.28)));
        float fade = mix(0.15, 1.0, smoothstep(0.0, 1.4, t));

        float a = mark * ${FLOOR_ALPHA.toFixed(2)} * fade * (1.0 + glow * ${FLOOR_GLOW.toFixed(1)});
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
  const viewBox = text.match(/viewBox="([^"]+)"/)?.[1]?.split(/[\s,]+/).map(Number);
  const aspect =
    viewBox && viewBox.length === 4 && viewBox[3]! > 0 ? viewBox[2]! / viewBox[3]! : 1;

  const blobUrl = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }));
  const img = new Image();
  img.src = blobUrl;
  await img.decode();

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = TEX_SIZE;
  const ctx = canvas.getContext('2d')!;
  // contain fit, centered, like the svg <image> default
  const w = aspect >= 1 ? TEX_SIZE : TEX_SIZE * aspect;
  const h = aspect >= 1 ? TEX_SIZE / aspect : TEX_SIZE;
  ctx.drawImage(img, (TEX_SIZE - w) / 2, (TEX_SIZE - h) / 2, w, h);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);
  URL.revokeObjectURL(blobUrl);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function LogoRain({
  density = 1,
  speedFactor = 0.09,
}: {
  density?: number;
  speedFactor?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const container = canvas.parentElement!;
    let disposed = false;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return; // no WebGL: leave the background empty
    }
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, VIEW_W, 0, -VIEW_H, -10, 10);

    const chipCount = logos.length * density;
    const floorMat = floorMaterial(chipCount);
    const floorUniforms = floorMat.uniforms;

    // cover the container like preserveAspectRatio="xMidYMid slice"
    function fit() {
      const cw = container.clientWidth || 1;
      const ch = container.clientHeight || 1;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(cw, ch, false);
      const scale = Math.max(cw / VIEW_W, ch / VIEW_H);
      const visW = cw / scale;
      const visH = ch / scale;
      camera.left = VIEW_W / 2 - visW / 2;
      camera.right = VIEW_W / 2 + visW / 2;
      camera.top = -VIEW_H / 2 + visH / 2;
      camera.bottom = -VIEW_H / 2 - visH / 2;
      camera.updateProjectionMatrix();
      floorUniforms.uViewMin!.value.set(camera.left, -camera.top);
      floorUniforms.uViewMax!.value.set(camera.right, -camera.bottom);
    }
    fit();

    const floorGeometry = new THREE.PlaneGeometry(VIEW_W, VIEW_H);
    const floor = new THREE.Mesh(floorGeometry, floorMat);
    floor.position.set(VIEW_W / 2, -VIEW_H / 2, 0);
    floor.renderOrder = -1;
    scene.add(floor);

    const circleGeometry = new THREE.CircleGeometry(1, 64);
    const ringGeometry = new THREE.RingGeometry(0.985, 1, 64);
    const planeGeometry = new THREE.PlaneGeometry(1.2, 1.2);

    let theme = readTheme();
    floorUniforms.uColor!.value.copy(theme.border);
    const circleMaterials: THREE.MeshBasicMaterial[] = [];
    const ringMaterials: THREE.MeshBasicMaterial[] = [];
    const logoMaterials: THREE.MeshBasicMaterial[] = [];

    const meanSize = (MIN_SIZE + MAX_SIZE) / 2;
    const stars: Star[] = [];
    Array.from({ length: chipCount }).forEach(() => {
      const size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
      // seed across the whole view so it starts populated; a few best-candidate
      // samples gently discourage clumping without looking gridded
      const { x, y } = Array.from({ length: 4 }, () => ({
        x: Math.random() * VIEW_W,
        y: Math.random() * VIEW_H,
      })).reduce<{ x: number; y: number; dist: number }>(
        (best, candidate) => {
          const dist = stars.length
            ? Math.min(
                ...stars.map(
                  (o) =>
                    Math.hypot(o.x - candidate.x, o.y - candidate.y) - o.size,
                ),
              )
            : Infinity;
          return dist > best.dist ? { ...candidate, dist } : best;
        },
        { x: 0, y: 0, dist: -Infinity },
      );

      // size drives cruise speed only; opacity is uniform across chips
      const t = (size - MIN_SIZE) / (MAX_SIZE - MIN_SIZE);

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
        color: theme.primary,
        transparent: true,
        opacity: 0.15,
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
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.renderOrder = order + 1;
      const logo = new THREE.Mesh(planeGeometry, logoMaterial);
      logo.renderOrder = order + 2;
      group.add(circle, ring, logo);
      scene.add(group);

      // small chips cruise fast, large ones slow, so the big shapes stay calm
      const speed =
        meanSize * speedFactor * (SPEED_SMALL - (SPEED_SMALL - SPEED_LARGE) * t);
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

    const chipRadii = floorUniforms.uChipR!.value as Float32Array;
    const chipPositions = floorUniforms.uChips!.value as THREE.Vector2[];
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
        renderer.render(scene, camera);
      });
    });

    function applyTheme() {
      theme = readTheme();
      circleMaterials.forEach((m) => {
        m.color.copy(theme.background);
        m.opacity = 1;
      });
      ringMaterials.forEach((m) => {
        m.color.copy(theme.primary);
        m.opacity = 0.15;
      });
      logoMaterials.forEach((m) => {
        m.color.copy(theme.silhouette);
        m.opacity = theme.logoAlpha;
      });
      floorUniforms.uColor!.value.copy(theme.border);
      renderer.render(scene, camera);
    }

    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const resizeObserver = new ResizeObserver(() => {
      fit();
      renderer.render(scene, camera);
    });
    resizeObserver.observe(container);

    const reduceMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      canvas.style.cursor = chipAt(e) ? 'pointer' : '';
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
      renderer.render(scene, camera);
    } else {
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerdown', onPointerDown as EventListener);
      let last = performance.now();
      renderer.setAnimationLoop((now) => {
        const dt = (now - last) / 1000;
        last = now;
        const relax = 1 - Math.exp(-CRUISE_RELAX * dt);
        stars.forEach((s) => {
          // renormalize speed toward cruise, keeping direction
          const spd = Math.hypot(s.vx, s.vy) || 1;
          const scale = 1 + ((s.speed - spd) / spd) * relax;
          s.vx *= scale;
          s.vy *= scale;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.angVel = Math.max(
            -MAX_SPIN,
            Math.min(MAX_SPIN, s.angVel * Math.exp(-SPIN_DAMP * dt)),
          );
          s.angle += s.angVel * dt;
          // bounce off the visible walls (camera bounds track the container);
          // sliding along a wall rubs the chip into rotation
          const minX = camera.left + s.size;
          const maxX = camera.right - s.size;
          const minY = -camera.top + s.size;
          const maxY = -camera.bottom - s.size;
          if (s.x < minX) {
            s.x = minX;
            s.vx = Math.abs(s.vx);
            const slip = s.vy - s.angVel * s.size;
            s.vy -= SPIN_GRIP * slip;
            s.angVel += (2 * SPIN_GRIP * slip) / s.size;
          } else if (s.x > maxX) {
            s.x = maxX;
            s.vx = -Math.abs(s.vx);
            const slip = -s.vy - s.angVel * s.size;
            s.vy += SPIN_GRIP * slip;
            s.angVel += (2 * SPIN_GRIP * slip) / s.size;
          }
          if (s.y < minY) {
            s.y = minY;
            s.vy = Math.abs(s.vy);
            const slip = -s.vx - s.angVel * s.size;
            s.vx += SPIN_GRIP * slip;
            s.angVel += (2 * SPIN_GRIP * slip) / s.size;
          } else if (s.y > maxY) {
            s.y = maxY;
            s.vy = -Math.abs(s.vy);
            const slip = s.vx - s.angVel * s.size;
            s.vx -= SPIN_GRIP * slip;
            s.angVel += (2 * SPIN_GRIP * slip) / s.size;
          }
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
              (b.vx - a.vx) * tx +
              (b.vy - a.vy) * ty -
              (a.angVel * a.size + b.angVel * b.size);
            const jt = (SPIN_GRIP * slip) / inv;
            a.vx += (jt / ma) * tx;
            a.vy += (jt / ma) * ty;
            b.vx -= (jt / mb) * tx;
            b.vy -= (jt / mb) * ty;
            a.angVel += (2 * jt) / (ma * a.size);
            b.angVel += (2 * jt) / (mb * b.size);
          });
        });

        stars.forEach((s, i) => {
          s.group.position.set(s.x, -s.y, 0);
          s.group.rotation.z = -s.angle;
          chipPositions[i]!.set(s.x, s.y);
        });
        renderer.render(scene, camera);
      });
    }

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown as EventListener);
      themeObserver.disconnect();
      resizeObserver.disconnect();
      circleGeometry.dispose();
      ringGeometry.dispose();
      planeGeometry.dispose();
      floorGeometry.dispose();
      floorMat.dispose();
      [...circleMaterials, ...ringMaterials, ...logoMaterials].forEach((m) =>
        m.dispose(),
      );
      textures.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, [density, speedFactor]);

  return (
    <div className="h-full w-full text-foreground">
      <canvas
        ref={canvasRef}
        aria-label="Floating logos visualization"
        role="img"
        className="pointer-events-auto block h-full w-full"
      />
    </div>
  );
}
