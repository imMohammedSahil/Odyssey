import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FIXED_VIEWPORT_ROUTES = ["/ritual-offering", "/payment"];

export default function SmoothScroll() {
  const location = useLocation();

  useEffect(() => {
    // Enhanced heavy fluid momentum with deep viscous resistance matching the glob cursor
    const lenis = new Lenis({
      duration: 1.65, // Deeper, heavier fluid mass glide
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Viscous exponential deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.58, // Heavier fluid resistance matching liquid glob physics
      touchMultiplier: 1.1,
      infinite: false,
      prevent: (node) => {
        // Prevent Lenis from intercepting scroll events on nested scrollable elements
        if (!node) return false;
        if (node.hasAttribute?.("data-lenis-prevent") || node.closest?.("[data-lenis-prevent]")) {
          return true;
        }

        // Auto-detect any parent container with independent scroll overflow
        let el = node instanceof Element ? node : node.parentElement;
        while (el && el !== document.body && el !== document.documentElement) {
          const style = window.getComputedStyle(el);
          const hasScrollY =
            (style.overflowY === "auto" || style.overflowY === "scroll") &&
            el.scrollHeight > el.clientHeight;
          const hasScrollX =
            (style.overflowX === "auto" || style.overflowX === "scroll") &&
            el.scrollWidth > el.clientWidth;
          if (hasScrollY || hasScrollX) {
            return true;
          }
          el = el.parentElement;
        }
        return false;
      },
    });

    window.lenis = lenis;

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis updates via GSAP ticker for frame-perfect alignment
    const tickerUpdate = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    // Watch for modal locks on body/html to halt Lenis and prevent background leaks
    const checkOverflowLock = () => {
      const isLocked =
        document.body.style.overflow === "hidden" ||
        document.documentElement.style.overflow === "hidden";
      if (isLocked) {
        lenis.stop();
      } else if (!FIXED_VIEWPORT_ROUTES.includes(window.location.pathname)) {
        lenis.start();
      }
    };

    const observer = new MutationObserver(checkOverflowLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class"] });

    return () => {
      observer.disconnect();
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  // Synchronously reset scroll to top before browser paints on route change
  useLayoutEffect(() => {
    if (FIXED_VIEWPORT_ROUTES.includes(location.pathname)) {
      window.lenis?.stop();
    } else {
      window.lenis?.start();
      window.lenis?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
}

