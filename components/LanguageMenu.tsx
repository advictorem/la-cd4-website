"use client";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { Icon } from "./Icon";

const noop = () => () => {};

/**
 * "Select Language" disclosure. Links hand the current page to Google Translate's
 * public page-translation service; no translation script or tracker is loaded on this site.
 */
export function LanguageMenu() {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname; // closes automatically on navigation
  const setOpen = (v: boolean) => setOpenOn(v ? pathname : null);
  const origin = useSyncExternalStore(noop, () => window.location.origin, () => site.url);
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpenOn(null); btn.current?.focus(); } };
    const onDown = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpenOn(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  }, [open]);

  const page = encodeURIComponent(`${origin}${pathname}`);
  return (
    <div className="lang" ref={wrap}>
      <button ref={btn} type="button" className="city-bar__link" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <Icon name="globe" size={18} />
        <span className="city-bar__label">Select Language</span>
        <Icon name="chevron" size={16} />
      </button>
      <div id={id} className="lang__menu" hidden={!open}>
        <ul>
          {site.cityBar.languages.map((l) => (
            <li key={l.code}>
              <a lang={l.code} hrefLang={l.code} rel="noopener noreferrer" href={`https://translate.google.com/translate?sl=en&tl=${l.code}&u=${page}`}>{l.label}</a>
            </li>
          ))}
        </ul>
        <p className="lang__note">Opens this page in Google Translate. Automated translations may not be exact.</p>
      </div>
    </div>
  );
}
