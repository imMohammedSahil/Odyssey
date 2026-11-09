import React, { useEffect, useRef } from "react";

// Generate organic, wispy volumetric smoke puff sprites on offscreen canvases
// Multiple overlapping soft gaussian lobes eliminate any circular or ring-like appearance.
function createSmokeSprite(isAshen = false) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const center = size / 2;
  const lobes = [
    { x: 0, y: 0, r: 42, a: 0.32 },
    { x: -9, y: -7, r: 34, a: 0.28 },
    { x: 8, y: -9, r: 32, a: 0.26 },
    { x: -8, y: 9, r: 35, a: 0.25 },
    { x: 9, y: 8, r: 33, a: 0.24 },
    { x: 0, y: -14, r: 26, a: 0.22 },
    { x: -14, y: 2, r: 28, a: 0.20 },
    { x: 13, y: -3, r: 29, a: 0.20 },
  ];

  for (const lobe of lobes) {
    const lx = center + lobe.x;
    const ly = center + lobe.y;
    const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, lobe.r);

    if (!isAshen) {
      // Obsidian black occult smoke with dense void core & velvety soft falloff
      grad.addColorStop(0, `rgba(8, 10, 13, ${lobe.a * 0.95})`);
      grad.addColorStop(0.45, `rgba(14, 16, 20, ${lobe.a * 0.65})`);
      grad.addColorStop(0.75, `rgba(20, 22, 28, ${lobe.a * 0.25})`);
      grad.addColorStop(1, "rgba(22, 24, 30, 0)");
    } else {
      // Cold ashen death mist near the Grim Reaper
      grad.addColorStop(0, `rgba(45, 54, 60, ${lobe.a * 0.75})`);
      grad.addColorStop(0.5, `rgba(65, 76, 84, ${lobe.a * 0.45})`);
      grad.addColorStop(0.8, `rgba(80, 92, 100, ${lobe.a * 0.15})`);
      grad.addColorStop(1, "rgba(90, 102, 110, 0)");
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx, ly, lobe.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Faint internal ember core for living occult smoke
  if (!isAshen) {
    const innerGlow = ctx.createRadialGradient(center, center, 0, center, center, 28);
    innerGlow.addColorStop(0, "rgba(255, 42, 24, 0.18)");
    innerGlow.addColorStop(0.4, "rgba(220, 32, 18, 0.08)");
    innerGlow.addColorStop(1, "rgba(180, 20, 10, 0)");
    ctx.fillStyle = innerGlow;
    ctx.beginPath();
    ctx.arc(center, center, 28, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

export default function OccultCursorFumes() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Pre-render volumetric sprites
    const blackSmoke = createSmokeSprite(false);
    const ashenSmoke = createSmokeSprite(true);

    const mouse = {
      x: -100,
      y: -100,
      prevX: -100,
      prevY: -100,
      vx: 0,
      vy: 0,
      active: false,
    };

    let currentDrain = 0;
    let targetDrain = 0;
    let lastDispatchedDrain = -1;

    const particles = [];
    const MAX_PARTICLES = 70;

    const spawnWisp = (x, y, drainVal, speedFactor = 1) => {
      if (particles.length >= MAX_PARTICLES) particles.shift();
      const angle = Math.random() * Math.PI * 2;
      const jitter = (Math.random() - 0.5) * 6;
      const vx = (Math.random() - 0.5) * 0.7 - mouse.vx * 0.05;
      const vy = -0.5 - Math.random() * 1.1 - mouse.vy * 0.05;

      particles.push({
        x: x + Math.cos(angle) * jitter,
        y: y + Math.sin(angle) * jitter,
        vx,
        vy,
        size: 24 + Math.random() * 12,
        maxSize: 62 + Math.random() * 32,
        scaleX: 0.85 + Math.random() * 0.35,
        scaleY: 0.85 + Math.random() * 0.35,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.025,
        phase: Math.random() * Math.PI * 2,
        age: 0,
        maxAge: Math.floor(40 + Math.random() * 26),
        drain: drainVal,
      });
    };

    const onPointerMove = (e) => {
      const px = e.clientX;
      const py = e.clientY;

      if (mouse.x > 0) {
        mouse.vx = px - mouse.x;
        mouse.vy = py - mouse.y;

        // Continuous path interpolation: fill gaps so no discrete stamps or circles appear
        const dist = Math.hypot(px - mouse.x, py - mouse.y);
        const steps = Math.min(6, Math.max(1, Math.floor(dist / 8)));
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const ix = mouse.x + (px - mouse.x) * t;
          const iy = mouse.y + (py - mouse.y) * t;
          spawnWisp(ix, iy, currentDrain, dist);
        }
      }

      mouse.x = px;
      mouse.y = py;
      mouse.active = true;

      // Locate the Grim Reaper shrine for proximity life-drain calculation
      const shrine = document.querySelector(".ritual-shrine-stage");
      if (shrine) {
        const rect = shrine.getBoundingClientRect();
        const reaperX = rect.left + rect.width * 0.5;
        const reaperY = rect.top + rect.height * 0.28;

        const dist = Math.hypot(px - reaperX, py - reaperY);
        const DRAIN_RADIUS = Math.max(220, Math.min(380, rect.width * 1.3));

        if (dist < DRAIN_RADIUS) {
          const raw = 1 - dist / DRAIN_RADIUS;
          targetDrain = raw * raw * (3 - 2 * raw);
        } else {
          targetDrain = 0;
        }
      } else {
        targetDrain = 0;
      }
    };

    const onPointerLeave = () => {
      mouse.active = false;
      mouse.x = -100;
      mouse.y = -100;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerLeave);

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoothly track drain
      currentDrain += (targetDrain - currentDrain) * 0.12;

      // Sync with global blob cursor
      if (Math.abs(currentDrain - lastDispatchedDrain) > 0.015) {
        lastDispatchedDrain = currentDrain;
        window.dispatchEvent(
          new CustomEvent("odyssey_cursor_drain", { detail: { drain: currentDrain } })
        );
      }

      // Idle breathing puff when hovering in place
      tick++;
      if (mouse.active && mouse.x > 0 && mouse.y > 0 && tick % 3 === 0) {
        spawnWisp(mouse.x, mouse.y, currentDrain, 1);
      }

      // Decay mouse velocity
      mouse.vx *= 0.5;
      mouse.vy *= 0.5;

      // Render realistic volumetric smoke wisps
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age++;
        if (p.age >= p.maxAge) {
          particles.splice(i, 1);
          continue;
        }

        const progress = p.age / p.maxAge;

        // Natural curl turbulence & upward draft
        p.vx += Math.sin(p.age * 0.08 + p.phase) * 0.08;
        p.vy -= 0.015; // gentle thermal lift
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Smooth cubic expansion & fadeout
        const currentSize = p.size + (p.maxSize - p.size) * (1 - Math.pow(1 - progress, 2.2));
        const alpha = Math.sin(progress * Math.PI) * 0.88 * (1 - p.drain * 0.35);

        if (alpha <= 0.005) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(p.scaleX, p.scaleY);
        ctx.globalAlpha = Math.min(1, alpha);

        // Select sprite based on living/ashen state
        const sprite = p.drain > 0.5 ? ashenSmoke : blackSmoke;
        ctx.drawImage(
          sprite,
          -currentSize / 2,
          -currentSize / 2,
          currentSize,
          currentSize
        );

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerLeave);
      window.dispatchEvent(
        new CustomEvent("odyssey_cursor_drain", { detail: { drain: 0 } })
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 99998,
      }}
      aria-hidden="true"
    />
  );
}
