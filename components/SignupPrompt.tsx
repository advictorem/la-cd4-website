"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { heroPhoto } from "@/content/images";
import { Icon } from "./Icon";

export const PROMPT_KEY = "cd4-signup-prompt";

/**
 * Sign-up prompt: a modal shown once, a few seconds into a visit, framing the existing Indigov sign-up form.
 * This site adds no form fields of its own and never sees what is typed.
 * - Native <dialog>, so focus is contained, Escape closes it, and focus returns to where the visitor was.
 * - Closing it in any way (the Close button, Escape, clicking outside) records the time in this
 *   browser; it is not shown again for site.signupPrompt.quietDays days.
 * - It waits its turn: if the visitor is typing or another menu or dialog is open, it tries again later.
 * - Never shown on the sign-up page itself.
 */
export function SignupPrompt() {
  const cfg = site.signupPrompt;
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const path = useRef(pathname);
  const [shown, setShown] = useState(false); // the Indigov frame is only requested once the prompt opens
  useEffect(() => { path.current = pathname; }, [pathname]);

  const remember = useCallback(() => {
    try { window.localStorage.setItem(PROMPT_KEY, String(Date.now())); } catch { /* storage unavailable: it may show again on a later visit */ }
  }, []);

  useEffect(() => {
    if (!cfg.enabled) return;
    let seen = 0;
    try { seen = Number(window.localStorage.getItem(PROMPT_KEY) || 0); } catch { /* treat as not seen */ }
    if (seen && Date.now() - seen < cfg.quietDays * 864e5) return;
    let timer = 0;
    const tryOpen = () => {
      const d = ref.current;
      if (!d || d.open) return;
      const active = document.activeElement;
      const busy = path.current.startsWith(cfg.href)
        || (active instanceof HTMLElement && (active.matches("input, textarea, select") || active.isContentEditable))
        || document.querySelector('[aria-expanded="true"], dialog[open]') !== null
        || document.visibilityState !== "visible";
      if (busy) { timer = window.setTimeout(tryOpen, cfg.delayMs); return; }
      setShown(true);
      d.showModal();
    };
    timer = window.setTimeout(tryOpen, cfg.delayMs);
    return () => window.clearTimeout(timer);
  }, [cfg.enabled, cfg.delayMs, cfg.quietDays, cfg.href]);

  if (!cfg.enabled) return null;
  return (
    <dialog ref={ref} className="prompt on-dark" aria-labelledby="prompt-title" aria-describedby="prompt-body" onClose={remember}
      onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
      <div className="prompt__inner" style={{ backgroundImage: `linear-gradient(180deg, rgb(4 24 74 / 0.55) 0%, rgb(4 24 74 / 0.86) 48%, rgb(4 24 74 / 0.97) 100%), url(${heroPhoto.src})` }}>
        <button type="button" className="prompt__close" onClick={() => ref.current?.close()}>
          <span>Close</span><Icon name="close" size={20} />
        </button>
        <p className="prompt__brand">
          <Image src="/brand/la-city-seal.svg" alt="" width={56} height={56} unoptimized />
          <span><span className="prompt__name">Council District 4</span><span className="prompt__sub">City of Los Angeles</span></span>
        </p>
        <h2 id="prompt-title">{cfg.heading}</h2>
        <p id="prompt-body">{cfg.body}</p>
        <div className="prompt__form">
          {shown && <iframe title="Sign up for updates form" src={cfg.formUrl} height={cfg.formHeight} referrerPolicy="strict-origin-when-cross-origin" />}
        </div>
      </div>
    </dialog>
  );
}
