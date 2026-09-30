"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsap";

// Smooth scrolling driven by GSAP's ticker so ScrollTrigger and Lenis share one
// clock. Skipped entirely for visitors who prefer reduced motion.
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(document.body);
    document.fonts?.ready.then(refresh);

    if (window.matchMedia(REDUCED).matches) {
      return () => ro.disconnect();
    }

    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: -24 }, wheelMultiplier: 1 });
    window.__lenis = lenis;
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      ro.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  useEffect(() => {
    // New route: start at the top (unless there's a hash) and re-measure triggers.
    if (!window.location.hash) window.__lenis?.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}
