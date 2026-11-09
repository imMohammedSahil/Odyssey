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

    const mouse = { x: -100, y: -100, vx: 0, vy: 0, lastX: -100, lastY: -100, active: false };
    let currentDrain = 0;
    let targetDrain = 0;
    let lastDispatchedDrain = -1;

    const particles = [];
    const MAX_PARTICLES = 55;

    const onPointerMove = (e) => {
      if (mouse.x > 0) {
        mouse.vx = e.clientX - mouse.x;
        mouse.vy = e.clientY - mouse.y;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      // Locate the Grim Reaper shrine
      const shrine = document.querySelector(".ritual-shrine-stage");
      if (shrine) {
        const rect = shrine.getBoundingClientRect();
        // The Grim Reaper's hooded cowl & chest
        const reaperX = rect.left + rect.width * 0.5;
        const reaperY = rect.top + rect.height * 0.28;

        const dist = Math.hypot(e.clientX - reaperX, e.clientY - reaperY);
        const DRAIN_RADIUS = Math.max(220, Math.min(380, rect.width * 1.3));

        if (dist < DRAIN_RADIUS) {
          const raw = 1 - dist / DRAIN_RADIUS;
          // Smooth Hermite curve for gradual atmospheric death
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
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerLeave);

    let tickCount = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate currentDrain towards targetDrain
      currentDrain += (targetDrain - currentDrain) * 0.12;

      // Dispatch drain updates when meaningful change occurs
      if (Math.abs(currentDrain - lastDispatchedDrain) > 0.015) {
        lastDispatchedDrain = currentDrain;
        window.dispatchEvent(
          new CustomEvent("odyssey_cursor_drain", { detail: { drain: currentDrain } })
        );
      }

      // Spawn black glowing smoke puffs when cursor is on screen
      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        tickCount++;
        const speed = Math.hypot(mouse.vx, mouse.vy);
        const spawnCount = speed > 6 ? 2 : tickCount % 2 === 0 ? 1 : 0;

        for (let i = 0; i < spawnCount; i++) {
          if (particles.length >= MAX_PARTICLES) particles.shift();
          const angle = Math.random() * Math.PI * 2;
          const jitter = (Math.random() - 0.5) * 8;
          particles.push({
            x: mouse.x + Math.cos(angle) * jitter,
            y: mouse.y + Math.sin(angle) * jitter,
            vx: (Math.random() - 0.5) * 0.9 - mouse.vx * 0.08,
            vy: -0.7 - Math.random() * 1.3 - mouse.vy * 0.08,
            size: 8 + Math.random() * 6,
            maxSize: 26 + Math.random() * 14,
            age: 0,
            maxAge: 36 + Math.floor(Math.random() * 22),
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.04,
            drainAtBirth: currentDrain,
          });
        }
      }

      // Reset velocity decay
      mouse.vx *= 0.5;
      mouse.vy *= 0.5;

      // Siphon tendril: if near the reaper, draw faint smoke streaming toward the reaper
      if (currentDrain > 0.08 && mouse.active) {
        const shrine = document.querySelector(".ritual-shrine-stage");
        if (shrine) {
          const rect = shrine.getBoundingClientRect();
          const reaperX = rect.left + rect.width * 0.5;
          const reaperY = rect.top + rect.height * 0.28;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          const cpX = (mouse.x + reaperX) * 0.5 + Math.sin(tickCount * 0.1) * 20;
          const cpY = (mouse.y + reaperY) * 0.5 - 20;
          ctx.quadraticCurveTo(cpX, cpY, reaperX, reaperY);
          ctx.strokeStyle = `rgba(18, 22, 26, ${Math.min(0.38, currentDrain * 0.45)})`;
          ctx.lineWidth = Math.max(1, 4 * currentDrain);
          ctx.setLineDash([4, 8]);
          ctx.lineDashOffset = -tickCount * 1.5;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Render smoke particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age++;
        if (p.age >= p.maxAge) {
          particles.splice(i, 1);
          continue;
        }

        const progress = p.age / p.maxAge;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.vx *= 0.98;
        p.vy *= 0.98;

        const currentSize = p.size + (p.maxSize - p.size) * (1 - Math.pow(1 - progress, 2));
        const alpha = Math.sin(progress * Math.PI) * (1 - p.drainAtBirth * 0.4);

        if (alpha <= 0.01) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const grad = ctx.createRadialGradient(0, 0, currentSize * 0.15, 0, 0, currentSize);

        if (p.drainAtBirth < 0.5) {
          // Vibrant Occult: Pitch obsidian core with glowing fiery crimson rim
          const glowAlpha = (1 - p.drainAtBirth * 2) * 0.42;
          grad.addColorStop(0, `rgba(10, 12, 16, ${0.85 * alpha})`);
          grad.addColorStop(0.48, `rgba(18, 20, 26, ${0.65 * alpha})`);
          grad.addColorStop(0.82, `rgba(255, 42, 27, ${glowAlpha * alpha})`);
          grad.addColorStop(1, "rgba(255, 35, 18, 0)");
        } else {
          // Drained Lifeless: Cold ashen slate grey smoke
          const ashFade = alpha * 0.45;
          grad.addColorStop(0, `rgba(45, 54, 60, ${ashFade})`);
          grad.addColorStop(0.65, `rgba(68, 78, 86, ${ashFade * 0.5})`);
          grad.addColorStop(1, "rgba(80, 92, 100, 0)");
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
        ctx.fill();
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
      // Reset drain on unmount
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
        zIndex: 99998, // Placed directly under the 3D chrome blob cursor
      }}
      aria-hidden="true"
    />
  );
}
