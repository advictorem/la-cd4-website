"use client";
import { useEffect, useRef } from "react";

/**
 * Parallax photo layer for the home hero: the image scrolls with the page, but more slowly than the content.
 * The layer is taller than the hero and is shifted with a transform on scroll (one rAF per frame).
 * No movement under prefers-reduced-motion or when "Pause motion" is on in the accessibility menu.
 */
export function HeroParallax({ src, speed = 0.35 }: { src: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const paused = reduce.matches || document.documentElement.dataset.motion === "off";
      const host = el.parentElement!;
      const end = host.getBoundingClientRect().top + window.scrollY + host.offsetHeight; // stop once the hero has scrolled away
      el.style.transform = paused ? "none" : `translate3d(0, ${Math.round(Math.min(window.scrollY, end) * speed)}px, 0)`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); mo.disconnect(); if (frame) cancelAnimationFrame(frame); };
  }, [speed]);
  return <div ref={ref} className="hero__bg" style={{ backgroundImage: `url(${src})` }} aria-hidden="true" />;
}
