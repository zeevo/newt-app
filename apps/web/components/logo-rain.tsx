'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const logos = [
  '/logos/better-auth.svg',
  '/logos/nextjs.svg',
  '/vercel.svg',
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

const TEX_SIZE = 256;

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
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
  return {
    background,
    primary,
    silhouette: new THREE.Color(dark ? 0xffffff : 0x000000),
    logoAlpha: dark ? 0.35 : 0.3,
  };
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
    }
    fit();

    const circleGeometry = new THREE.CircleGeometry(1, 64);
    const ringGeometry = new THREE.RingGeometry(0.985, 1, 64);
    const planeGeometry = new THREE.PlaneGeometry(1.2, 1.2);

    let theme = readTheme();
    const circleMaterials: THREE.MeshBasicMaterial[] = [];
    const ringMaterials: THREE.MeshBasicMaterial[] = [];
    const logoMaterials: THREE.MeshBasicMaterial[] = [];
    const groupAlphas: number[] = [];

    const meanSize = (MIN_SIZE + MAX_SIZE) / 2;
    const stars: Star[] = [];
    Array.from({ length: logos.length * density }).forEach(() => {
      const size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
      // seed across the whole view so it starts populated; a few best-candidate
      // samples gently discourage clumping without looking gridded
      let x = 0;
      let y = 0;
      let bestDist = -Infinity;
      Array.from({ length: 4 }).forEach(() => {
        const cx = Math.random() * VIEW_W;
        const cy = Math.random() * VIEW_H;
        const dist = stars.length
          ? Math.min(...stars.map((o) => Math.hypot(o.x - cx, o.y - cy) - o.size))
          : Infinity;
        if (dist > bestDist) {
          bestDist = dist;
          x = cx;
          y = cy;
        }
      });

      const t = (size - MIN_SIZE) / (MAX_SIZE - MIN_SIZE);
      const alpha = 0.5 + 0.5 * t;
      groupAlphas.push(alpha);

      const group = new THREE.Group();
      group.scale.setScalar(size);
      group.position.set(x, -y, 0);

      const circleMaterial = new THREE.MeshBasicMaterial({
        color: theme.background,
        transparent: true,
        opacity: alpha,
        depthWrite: false,
      });
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: theme.primary,
        transparent: true,
        opacity: 0.15 * alpha,
        depthWrite: false,
      });
      const logoMaterial = new THREE.MeshBasicMaterial({
        color: theme.silhouette,
        transparent: true,
        opacity: theme.logoAlpha * alpha,
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
        size,
        speed,
        group,
      });
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
      circleMaterials.forEach((m, i) => {
        m.color.copy(theme.background);
        m.opacity = groupAlphas[i]!;
      });
      ringMaterials.forEach((m, i) => {
        m.color.copy(theme.primary);
        m.opacity = 0.15 * groupAlphas[i]!;
      });
      logoMaterials.forEach((m, i) => {
        m.color.copy(theme.silhouette);
        m.opacity = theme.logoAlpha * groupAlphas[i]!;
      });
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
    const onClick = (e: PointerEvent) => {
      const s = chipAt(e);
      if (!s) return;
      const angle = Math.random() * Math.PI * 2;
      const kick = KICK_MIN + Math.random() * (KICK_MAX - KICK_MIN);
      s.vx = Math.cos(angle) * kick;
      s.vy = Math.sin(angle) * kick;
    };

    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('click', onClick as EventListener);
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
          // bounce off the visible walls (camera bounds track the container)
          const minX = camera.left + s.size;
          const maxX = camera.right - s.size;
          const minY = -camera.top + s.size;
          const maxY = -camera.bottom - s.size;
          if (s.x < minX) {
            s.x = minX;
            s.vx = Math.abs(s.vx);
          } else if (s.x > maxX) {
            s.x = maxX;
            s.vx = -Math.abs(s.vx);
          }
          if (s.y < minY) {
            s.y = minY;
            s.vy = Math.abs(s.vy);
          } else if (s.y > maxY) {
            s.y = maxY;
            s.vy = -Math.abs(s.vy);
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
          });
        });

        stars.forEach((s) => {
          s.group.position.set(s.x, -s.y, 0);
        });
        renderer.render(scene, camera);
      });
    }

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('click', onClick as EventListener);
      themeObserver.disconnect();
      resizeObserver.disconnect();
      circleGeometry.dispose();
      ringGeometry.dispose();
      planeGeometry.dispose();
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
