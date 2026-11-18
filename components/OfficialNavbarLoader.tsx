"use client";
import { useEffect } from "react";

const SRC = "https://navbar.lacity.org/global_nav.js";

/**
 * Loads the City-maintained global navbar (navbar.lacity.org, v4.0) without modifying it.
 *
 * The widget was written for server-rendered pages: it calls document.write() for its styles and waits
 * for DOMContentLoaded before inserting itself at the top of <body>. In a React app that insertion
 * happens during hydration and is discarded. So this loader runs the unmodified script after hydration
 * and stands in for the two page-lifecycle hooks it expects:
 *   - document.write(html) → the markup is appended to <head> (it is only the widget's <style> block)
 *   - its DOMContentLoaded listener → called once, immediately after the script has loaded
 * Both shims are removed as soon as the script has run.
 */
export function OfficialNavbarLoader() {
  useEffect(() => {
    if (document.getElementById("global_navbar_la_4324422") || document.querySelector(`script[src="${SRC}"]`)) return;
    const realWrite = document.write.bind(document);
    const realAdd = document.addEventListener.bind(document);
    const pending: EventListener[] = [];
    document.write = (html: string) => { document.head.insertAdjacentHTML("beforeend", html); };
    document.addEventListener = ((type: string, listener: EventListenerOrEventListenerObject, opts?: boolean | AddEventListenerOptions) => {
      if (type === "DOMContentLoaded" && typeof listener === "function") pending.push(listener);
      else realAdd(type, listener, opts);
    }) as typeof document.addEventListener;
    const restore = () => { document.write = realWrite; document.addEventListener = realAdd; };
    const s = document.createElement("script");
    s.src = SRC;
    s.onload = () => { restore(); pending.forEach((fn) => fn(new Event("DOMContentLoaded"))); };
    s.onerror = restore; // the CD4 utility row and the rest of the page still work without the widget
    document.head.appendChild(s);
  }, []);
  return null;
}
