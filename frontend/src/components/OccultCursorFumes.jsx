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

    // Organic smoke puff particles
    const smokes = [];
    const MAX_SMOKES = 90;

    // Occasional glowing ember sparks escaping the molten chrome droplet
    const embers = [];
    const MAX_EMBERS = 25;

    const spawnSmokePuff = (x, y, drainVal, density = 1, backDir = null) => {
      if (smokes.length >= MAX_SMOKES) smokes.shift();
      const angle = Math.random() * Math.PI * 2;
      const spread = 1 + Math.random() * 4;

      let vx = (Math.random() - 0.5) * 0.55 - (mouse.vx || 0) * 0.04;
      let vy = -0.5 - Math.random() * 0.8 - (mouse.vy || 0) * 0.04;

      if (backDir && backDir.dist > 2) {
        // Bias smoke velocity along the trailing tail vector away from the head
        vx += backDir.nx * (0.35 + Math.random() * 0.45);
        vy += backDir.ny * (0.35 + Math.random() * 0.45);

        // Strip any forward velocity component pointing towards the head
        const forwardDot = vx * (-backDir.nx) + vy * (-backDir.ny);
        if (forwardDot > 0) {
          vx -= (-backDir.nx) * forwardDot * 1.15;
          vy -= (-backDir.ny) * forwardDot * 1.15;
        }
      }

      const spawnX = x + Math.cos(angle) * spread + (backDir && backDir.dist > 2 ? backDir.nx * 2 : 0);
      const spawnY = y + Math.sin(angle) * spread + (backDir && backDir.dist > 2 ? backDir.ny * 2 : 0);

      smokes.push({
        x: spawnX,
        y: spawnY,
        vx,
        vy,
        size: 9 + Math.random() * 6,
        maxSize: 32 + Math.random() * 14, // Compact & agile size
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        curvePhase: Math.random() * Math.PI * 2,
        curveFreq: 0.04 + Math.random() * 0.04,
        age: 0,
        maxAge: Math.floor(40 + Math.random() * 22),
        drain: drainVal,
        density,
      });
    };

    const spawnEmber = (x, y) => {
      if (embers.length >= MAX_EMBERS) embers.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 1.8;
      embers.push({
        x,
        y,
        vx: Math.cos(angle) * speed - mouse.vx * 0.05,
        vy: Math.sin(angle) * speed - 1.2,
        size: 1.2 + Math.random() * 1.8,
        age: 0,
        maxAge: 20 + Math.random() * 16,
        color: Math.random() > 0.4 ? "#FF3B1E" : "#FFA22E",
      });
    };

    const lastTail = { x: -100, y: -100 };

    const onPointerMove = (e) => {
      const px = e.clientX;
      const py = e.clientY;

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
      lastTail.x = -100;
      lastTail.y = -100;
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

      // ✦ Read exact trailing tail coordinates from BlobCursor so smoke NEVER spawns ahead of the blob
      const tailData = window.odyssey_blob_tail;
      const isAlive = !!(tailData && tailData.x > 0 && tailData.y > 0 && tailData.active);

      if (isAlive) {
        const tx = tailData.x;
        const ty = tailData.y;

        // Compute direction from head to tail so smoke strictly flows backwards
        const headX = (tailData.headX && tailData.headX > 0) ? tailData.headX : tx;
        const headY = (tailData.headY && tailData.headY > 0) ? tailData.headY : ty;
        const bdx = tx - headX;
        const bdy = ty - headY;
        const bdist = Math.hypot(bdx, bdy);
        const backDir = bdist > 2 ? { nx: bdx / bdist, ny: bdy / bdist, dist: bdist } : null;

        if (lastTail.x > 0) {
          const dx = tx - lastTail.x;
          const dy = ty - lastTail.y;
          const dist = Math.hypot(dx, dy);

          mouse.vx = dx;
          mouse.vy = dy;

          if (dist > 1.2 && dist < 45) {
            // Continuous path interpolation along the blob's actual trailing tail path
            const steps = Math.min(6, Math.max(1, Math.floor(dist / 6)));
            for (let s = 1; s <= steps; s++) {
              const t = s / steps;
              const ix = lastTail.x + dx * t;
              const iy = lastTail.y + dy * t;
              spawnSmokePuff(ix, iy, currentDrain, 1, backDir);
            }

            if (currentDrain < 0.4 && Math.random() < 0.25) {
              spawnEmber(tx, ty);
            }
          } else if (dist >= 45) {
            // Cursor jumped/teleported: reset without streaking
            mouse.vx = 0;
            mouse.vy = 0;
          }
        } else {
          mouse.vx = 0;
          mouse.vy = 0;
        }

        lastTail.x = tx;
        lastTail.y = ty;

        // Idle smoke puff when hovering
        if (tick % 4 === 0) {
          spawnSmokePuff(tx, ty, currentDrain, 0.7, backDir);
          if (currentDrain < 0.4 && Math.random() < 0.15) {
            spawnEmber(tx, ty);
          }
        }

        // 1. Hot Liquid Core Glow Aura at the tail origin
        if (currentDrain < 0.85) {
          const glowRadius = 18 + Math.sin(tick * 0.12) * 2;
          const glowAlpha = (1 - currentDrain) * 0.28;
          const glow = ctx.createRadialGradient(
            tx,
            ty,
            2,
            tx,
            ty,
            glowRadius
          );
          glow.addColorStop(0, `rgba(45, 10, 10, ${glowAlpha})`);
          glow.addColorStop(0.5, `rgba(32, 6, 6, ${glowAlpha * 0.4})`);
          glow.addColorStop(1, "rgba(20, 4, 4, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(tx, ty, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        lastTail.x = -100;
        lastTail.y = -100;
        mouse.vx = 0;
        mouse.vy = 0;
      }

      mouse.vx *= 0.55;
      mouse.vy *= 0.55;

      // 2. Realistic Volumetric Smoke Plume (Monotonic falloff + Gaussian blur = 100% seamless fluid, Zero concentric rings)
      for (let i = smokes.length - 1; i >= 0; i--) {
        const p = smokes[i];
        p.age++;
        if (p.age >= p.maxAge) {
          smokes.splice(i, 1);
          continue;
        }

        const progress = p.age / p.maxAge;

        // Organic curl turbulence & upward draft
        p.vx += Math.sin(p.age * p.curveFreq + p.curvePhase) * 0.06;
        p.vy -= 0.02; // natural thermal buoyancy
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Smooth cubic expansion (smoke expands as it cools into the air)
        const currentSize = p.size + (p.maxSize - p.size) * (1 - Math.pow(1 - progress, 2.2));
        const alpha = Math.sin(progress * Math.PI) * 0.52 * (1 - p.drain * 0.35);

        if (alpha <= 0.005) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize);

        if (p.drain < 0.5) {
          // Evil Supernatural Reddish-Black Smoke:
          // Monotonic uniform falloff eliminates all concentric rings or donut halos
          grad.addColorStop(0, `rgba(38, 8, 8, ${alpha * 0.92})`);
          grad.addColorStop(0.45, `rgba(32, 6, 6, ${alpha * 0.55})`);
          grad.addColorStop(0.8, `rgba(24, 4, 4, ${alpha * 0.18})`);
          grad.addColorStop(1, "rgba(20, 3, 3, 0)");
        } else {
          // Cold Ashen Death Mist near the Grim Reaper:
          grad.addColorStop(0, `rgba(45, 54, 60, ${alpha * 0.72})`);
          grad.addColorStop(0.5, `rgba(65, 76, 84, ${alpha * 0.38})`);
          grad.addColorStop(1, "rgba(90, 102, 110, 0)");
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Tiny Occult Ember Sparks (drift and burn out quickly in the dark smoke)
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
        // High-radius gaussian blur filter melts all puff boundaries into a seamless continuous smoke plume
        filter: "blur(7px)",
      }}
      aria-hidden="true"
    />
  );
}
