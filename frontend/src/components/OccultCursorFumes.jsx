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

    const mouse = { x: -100, y: -100, active: false };
    const history = [];
    const MAX_HISTORY = 28;

    let currentDrain = 0;
    let targetDrain = 0;
    let lastDispatchedDrain = -1;

    // Small drifting wisps escaping the main ribbon
    const wisps = [];
    const MAX_WISPS = 18;

    const onPointerMove = (e) => {
      const px = e.clientX;
      const py = e.clientY;

      mouse.x = px;
      mouse.y = py;
      mouse.active = true;

      // Add point to ribbon history
      history.unshift({
        x: px,
        y: py,
        age: 0,
        drain: currentDrain,
      });
      if (history.length > MAX_HISTORY) history.pop();

      // Check proximity to Grim Reaper shrine
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
      history.length = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerLeave);

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth drain lerp
      currentDrain += (targetDrain - currentDrain) * 0.12;

      // Dispatch drain event for global blob cursor
      if (Math.abs(currentDrain - lastDispatchedDrain) > 0.015) {
        lastDispatchedDrain = currentDrain;
        window.dispatchEvent(
          new CustomEvent("odyssey_cursor_drain", { detail: { drain: currentDrain } })
        );
      }

      tick++;

      // Age existing history points
      for (let i = history.length - 1; i >= 0; i--) {
        history[i].age++;
        // Apply slight thermal upward drift to older trailing points
        history[i].y -= 0.35 * (i / history.length);
        if (history[i].age > 28) {
          history.splice(i, 1);
        }
      }

      // If hovering, add gentle breathing anchor points
      if (mouse.active && mouse.x > 0 && mouse.y > 0 && tick % 2 === 0) {
        history.unshift({
          x: mouse.x,
          y: mouse.y,
          age: 0,
          drain: currentDrain,
        });
        if (history.length > MAX_HISTORY) history.pop();
      }

      // Draw flowing smoke wisps (clean spline ribbon without circular stamps)
      if (history.length > 3) {
        const hLen = history.length;

        // Render 3 interlaced organic smoke strands with sine-wave curl
        const strands = [
          { widthScale: 1.0, curlAmp: 2.2, curlFreq: 0.22, phase: 0 },
          { widthScale: 0.65, curlAmp: 3.5, curlFreq: 0.18, phase: 1.6 },
          { widthScale: 0.4, curlAmp: 4.8, curlFreq: 0.14, phase: 3.2 },
        ];

        for (let sIdx = 0; sIdx < strands.length; sIdx++) {
          const strand = strands[sIdx];

          for (let i = 0; i < hLen - 1; i++) {
            const p0 = history[i];
            const p1 = history[i + 1];
            const progress = i / hLen;

            // Natural curl displacement perpendicular to path
            const dx = p1.x - p0.x;
            const dy = p1.y - p0.y;
            const dist = Math.hypot(dx, dy) || 1;
            const nx = -dy / dist;
            const ny = dx / dist;

            const curl = Math.sin(tick * 0.08 + i * strand.curlFreq + strand.phase) * strand.curlAmp * (progress * 1.5);
            const x0 = p0.x + nx * curl;
            const y0 = p0.y + ny * curl;
            const x1 = p1.x + nx * curl;
            const y1 = p1.y + ny * curl;

            const taper = (1 - progress);
            const strokeW = Math.max(0.5, (14 * strand.widthScale) * Math.pow(taper, 1.4));
            const alpha = Math.max(0, taper * 0.65 * (1 - p0.drain * 0.4));

            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = strokeW;

            if (p0.drain < 0.5) {
              // Living Occult Smoke:
              // Deep pitch-black smoke with glowing crimson ember rim
              if (sIdx === 0) {
                // Dense dark obsidian core
                ctx.strokeStyle = `rgba(10, 12, 16, ${alpha * 0.9})`;
                ctx.shadowColor = `rgba(255, 42, 22, ${Math.max(0, (1 - p0.drain * 2) * 0.45 * taper)})`;
                ctx.shadowBlur = 8;
              } else if (sIdx === 1) {
                // Smoky secondary wisp
                ctx.strokeStyle = `rgba(18, 22, 28, ${alpha * 0.6})`;
                ctx.shadowBlur = 0;
              } else {
                // Subtle fiery inner ember filament near origin
                const emberAlpha = Math.max(0, (1 - progress * 2.5) * 0.5 * (1 - p0.drain));
                ctx.strokeStyle = `rgba(255, 50, 25, ${emberAlpha})`;
                ctx.shadowBlur = 0;
              }
            } else {
              // Ashen Death Mist near the Grim Reaper:
              // Faint, cold, ghost-grey wisps
              ctx.shadowBlur = 0;
              ctx.strokeStyle = `rgba(75, 86, 95, ${alpha * 0.4})`;
            }

            ctx.stroke();
          }
        }

        // Reset shadow
        ctx.shadowBlur = 0;
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
