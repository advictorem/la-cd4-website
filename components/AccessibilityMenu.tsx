"use client";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "./Icon";

/**
 * Accessibility options, built into the site (no third-party overlay script).
 * Preferences are stored in this browser only and applied as data attributes on <html>;
 * the matching rules are in styles/base.css. An inline script in app/layout.tsx applies them before first paint.
 */
export const A11Y_KEY = "cd4-a11y";
type Prefs = { text: "default" | "large" | "larger"; contrast: boolean; links: boolean; spacing: boolean; motion: boolean };
const DEFAULTS: Prefs = { text: "default", contrast: false, links: false, spacing: false, motion: false };

let cached: Prefs = DEFAULTS;
let cachedRaw: string | null = null;
const listeners = new Set<() => void>();
function read(): Prefs {
  let raw: string | null = null;
  try { raw = window.localStorage.getItem(A11Y_KEY); } catch { /* storage unavailable: defaults */ }
  if (raw !== cachedRaw) { cachedRaw = raw; try { cached = { ...DEFAULTS, ...(raw ? JSON.parse(raw) : {}) }; } catch { cached = DEFAULTS; } }
  return cached;
}
function apply(p: Prefs) {
  const d = document.documentElement.dataset;
  const set = (k: string, v: string | false) => { if (v) d[k] = v; else delete d[k]; };
  set("text", p.text !== "default" && p.text);
  set("contrast", p.contrast && "high");
  set("links", p.links && "underline");
  set("spacing", p.spacing && "wide");
  set("motion", p.motion && "off");
}
function write(p: Prefs) {
  cached = p; cachedRaw = JSON.stringify(p);
  try { window.localStorage.setItem(A11Y_KEY, cachedRaw); } catch { /* still applies for this page view */ }
  apply(p);
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };

const TOGGLES: { key: Exclude<keyof Prefs, "text">; label: string; hint: string }[] = [
  { key: "contrast", label: "High contrast", hint: "Darker text and borders, plain backgrounds" },
  { key: "links", label: "Underline links", hint: "Underline every link" },
  { key: "spacing", label: "Readable spacing", hint: "More space between lines, words and letters" },
  { key: "motion", label: "Pause motion", hint: "Stop animations and the moving hero photo" },
];

export function AccessibilityMenu() {
  const prefs = useSyncExternalStore(subscribe, read, () => DEFAULTS);
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const close = useCallback((focus: boolean) => { setOpen(false); if (focus) btn.current?.focus(); }, []);

  useEffect(() => { apply(read()); }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(true); };
    const onDown = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) close(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  }, [open, close]);

  const changed = JSON.stringify(prefs) !== JSON.stringify(DEFAULTS);
  return (
    <div className="a11y" ref={wrap}>
      <button ref={btn} type="button" className="a11y__toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="9.5" /><circle cx="12" cy="7.2" r="1.1" fill="currentColor" stroke="none" /><path d="M7 10.2c3.3.9 6.7.9 10 0M12 11v3.2M12 14.2l-2.3 4M12 14.2l2.3 4" />
        </svg>
        <span className="a11y__label">Accessibility</span>
        {changed && <span className="visually-hidden"> (options on)</span>}
      </button>
      <div id={id} className="a11y__panel" role="group" aria-label="Accessibility options" hidden={!open}>
        <h2>Accessibility options</h2>
        <fieldset>
          <legend>Text size</legend>
          <div className="a11y__sizes">
            {(["default", "large", "larger"] as const).map((t) => (
              <button key={t} type="button" aria-pressed={prefs.text === t} onClick={() => write({ ...prefs, text: t })}>
                <span aria-hidden="true" style={{ fontSize: t === "default" ? "0.875rem" : t === "large" ? "1.0625rem" : "1.25rem" }}>A</span>
                <span className="visually-hidden">{t === "default" ? "Default text size" : t === "large" ? "Large text" : "Larger text"}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <ul role="list">
          {TOGGLES.map((t) => (
            <li key={t.key}>
              <button type="button" className="a11y__switch" role="switch" aria-checked={prefs[t.key]} onClick={() => write({ ...prefs, [t.key]: !prefs[t.key] })}>
                <span><span className="a11y__name">{t.label}</span><span className="a11y__hint">{t.hint}</span></span>
                <span className="a11y__track" aria-hidden="true"><span /></span>
              </button>
            </li>
          ))}
        </ul>
        <div className="a11y__foot">
          <button type="button" className="btn btn--secondary btn--small" disabled={!changed} onClick={() => write(DEFAULTS)}>Reset</button>
          <button type="button" className="btn btn--quiet btn--small" onClick={() => close(true)}><Icon name="close" size={16} />Close</button>
        </div>
        <p className="a11y__note">Saved in this browser only. <a href="https://disclaimer.lacity.gov/accessibility.htm" rel="noopener noreferrer">City accessibility statement</a></p>
      </div>
    </div>
  );
}
