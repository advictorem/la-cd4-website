"use client";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

const noop = () => () => {};

/**
 * Language menu in the header, beside the accessibility control. Icon-only button; the list opens next to it.
 * Links hand the current page to Google Translate's public page-translation service;
 * no translation script or tracker is loaded on this site.
 */
export function LanguageMenu() {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname; // closes automatically on navigation
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
      <button ref={btn} type="button" className="icon-btn" aria-expanded={open} aria-controls={id} onClick={() => setOpenOn(open ? null : pathname)}>
        {/* Thin-outline language icon drawn for this site: two overlapping tiles, one with a Latin "A". */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M10 14.5H4.5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2V9" />
          <path d="M5.2 6.6h5.6M8 5.4v1.2M9.7 6.6c-.5 2.1-1.9 3.7-4 4.6M6.4 8.5c.6 1.1 1.5 2 2.7 2.6" />
          <rect x="10.5" y="9.5" width="11" height="11" rx="2" />
          <path d="M13.6 18.2l2.4-6 2.4 6M14.4 16.3h3.200" />
        </svg>
        <span className="visually-hidden">Select language</span>
      </button>
      <div id={id} className="lang__menu" hidden={!open}>
        <p className="lang__title">Select language</p>
        <ul>
          {site.languages.map((l) => (
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
