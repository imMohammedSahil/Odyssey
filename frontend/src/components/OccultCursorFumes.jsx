import React, { useEffect, useRef } from "react";

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

    // Organic volumetric smoke particles
    const smokes = [];
    const MAX_SMOKES = 95;

    // Occasional glowing ember sparks escaping the molten chrome droplet
    const embers = [];
    const MAX_EMBERS = 30;

    const spawnSmokePuff = (x, y, drainVal, density = 1) => {
      if (smokes.length >= MAX_SMOKES) smokes.shift();
      const angle = Math.random() * Math.PI * 2;
      const spread = 2 + Math.random() * 8;

      smokes.push({
        x: x + Math.cos(angle) * spread,
        y: y + Math.sin(angle) * spread,
        vx: (Math.random() - 0.5) * 0.7 - mouse.vx * 0.04,
        vy: -0.6 - Math.random() * 1.1 - mouse.vy * 0.04,
        size: 16 + Math.random() * 12,
        maxSize: 58 + Math.random() * 28,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.025,
        curvePhase: Math.random() * Math.PI * 2,
        curveFreq: 0.04 + Math.random() * 0.05,
        age: 0,
        maxAge: Math.floor(48 + Math.random() * 24),
        drain: drainVal,
        density,
      });
    };

    const spawnEmber = (x, y) => {
      if (embers.length >= MAX_EMBERS) embers.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 2.2;
      embers.push({
        x,
        y,
        vx: Math.cos(angle) * speed - mouse.vx * 0.05,
        vy: Math.sin(angle) * speed - 1.4,
        size: 1.5 + Math.random() * 2.0,
        age: 0,
        maxAge: 22 + Math.random() * 18,
        color: Math.random() > 0.35 ? "#FF3B1E" : "#FFA42E",
      });
    };

    const onPointerMove = (e) => {
      const px = e.clientX;
      const py = e.clientY;

      if (mouse.x > 0) {
        mouse.vx = px - mouse.x;
        mouse.vy = py - mouse.y;

        // Continuous path interpolation: eliminates gaps so smoke forms an unbroken fluid trail
        const dist = Math.hypot(px - mouse.x, py - mouse.y);
        const steps = Math.min(8, Math.max(1, Math.floor(dist / 6)));
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const ix = mouse.x + (px - mouse.x) * t;
          const iy = mouse.y + (py - mouse.y) * t;
          spawnSmokePuff(ix, iy, currentDrain, 1);
        }

        // Spawn burning ember sparks when moving
        if (currentDrain < 0.4 && Math.random() < 0.32) {
          spawnEmber(px, py);
        }
      }

      mouse.x = px;
      mouse.y = py;
      mouse.active = true;

      // Locate Grim Reaper shrine for proximity life-drain calculation
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

      // Smooth drain lerp
      currentDrain += (targetDrain - currentDrain) * 0.12;

      // Sync with global blob cursor
      if (Math.abs(currentDrain - lastDispatchedDrain) > 0.015) {
        lastDispatchedDrain = currentDrain;
        window.dispatchEvent(
          new CustomEvent("odyssey_cursor_drain", { detail: { drain: currentDrain } })
        );
      }

      tick++;

      // Idle smoke puff when hovering
      if (mouse.active && mouse.x > 0 && mouse.y > 0 && tick % 4 === 0) {
        spawnSmokePuff(mouse.x, mouse.y, currentDrain, 0.7);
        if (currentDrain < 0.4 && Math.random() < 0.2) {
          spawnEmber(mouse.x, mouse.y);
        }
      }

      mouse.vx *= 0.55;
      mouse.vy *= 0.55;

      // 1. Hot Liquid Core Glow Aura (illuminates dark houses and surroundings)
      if (mouse.active && mouse.x > 0 && mouse.y > 0 && currentDrain < 0.9) {
        const glowRadius = 38 + Math.sin(tick * 0.12) * 5;
        const glowAlpha = (1 - currentDrain) * 0.46;
        const glow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          2,
          mouse.x,
          mouse.y,
          glowRadius
        );
        glow.addColorStop(0, `rgba(255, 60, 25, ${glowAlpha})`);
        glow.addColorStop(0.45, `rgba(215, 35, 18, ${glowAlpha * 0.55})`);
        glow.addColorStop(1, "rgba(180, 20, 10, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Realistic Volumetric Smoke Plume with dual illumination
      // (Visible over BOTH light sky AND dark houses/walls)
      for (let i = smokes.length - 1; i >= 0; i--) {
        const p = smokes[i];
        p.age++;
        if (p.age >= p.maxAge) {
          smokes.splice(i, 1);
          continue;
        }

        const progress = p.age / p.maxAge;

        // Organic curl turbulence & upward draft
        p.vx += Math.sin(p.age * p.curveFreq + p.curvePhase) * 0.07;
        p.vy -= 0.02; // natural thermal buoyancy
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Smooth cubic expansion
        const currentSize = p.size + (p.maxSize - p.size) * (1 - Math.pow(1 - progress, 2.2));
        const alpha = Math.sin(progress * Math.PI) * (1 - p.drain * 0.3);

        if (alpha <= 0.005) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize);

        if (p.drain < 0.5) {
          // Living Occult Fumes:
          // Center: Deep obsidian smoke (visible against bright sky)
          // Mid: Fiery crimson/amber inner glow (illuminates against dark houses)
          // Edge: Moonlit mist rim (contrasts against pitch-black buildings)
          const crimsonGlow = (1 - p.drain * 2) * 0.42 * alpha;
          const moonlitRim = 0.28 * alpha;

          grad.addColorStop(0, `rgba(12, 14, 18, ${alpha * 0.92})`);
          grad.addColorStop(0.35, `rgba(220, 40, 20, ${crimsonGlow})`);
          grad.addColorStop(0.68, `rgba(15, 18, 24, ${alpha * 0.65})`);
          grad.addColorStop(0.88, `rgba(165, 185, 200, ${moonlitRim})`);
          grad.addColorStop(1, "rgba(180, 200, 215, 0)");
        } else {
          // Cold Ashen Death Mist near the Grim Reaper:
          // Pale spectral fog clearly visible against dark church & house silhouettes
          const ghostGlow = alpha * 0.52;
          grad.addColorStop(0, `rgba(60, 72, 80, ${ghostGlow})`);
          grad.addColorStop(0.5, `rgba(130, 150, 165, ${ghostGlow * 0.55})`);
          grad.addColorStop(0.8, `rgba(175, 195, 208, ${ghostGlow * 0.22})`);
          grad.addColorStop(1, "rgba(185, 205, 218, 0)");
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Tiny Occult Ember Sparks (glowing dots clearly visible across dark buildings)
      for (let i = embers.length - 1; i >= 0; i--) {
        const em = embers[i];
        em.age++;
        if (em.age >= em.maxAge) {
          embers.splice(i, 1);
          continue;
        }

        em.x += em.vx;
        em.y += em.vy;
        em.vx *= 0.96;
        em.vy *= 0.96;
        const emAlpha = 1 - em.age / em.maxAge;

        ctx.fillStyle = em.color;
        ctx.globalAlpha = emAlpha;
        ctx.beginPath();
        ctx.arc(em.x, em.y, em.size, 0, Math.PI * 2);
        ctx.fill();

        // Soft spark glow halo
        const sparkGlow = ctx.createRadialGradient(em.x, em.y, 0, em.x, em.y, em.size * 3.5);
        sparkGlow.addColorStop(0, "rgba(255, 60, 25, 0.4)");
        sparkGlow.addColorStop(1, "rgba(255, 60, 25, 0)");
        ctx.fillStyle = sparkGlow;
        ctx.beginPath();
        ctx.arc(em.x, em.y, em.size * 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
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
        filter: "blur(4px)",
      }}
      aria-hidden="true"
    />
  );
}
