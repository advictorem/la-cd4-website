"use client";
import { useState } from "react";
import { Icon } from "./Icon";

/**
 * Frames an existing third-party form or map without touching its endpoint.
 * - Nothing loads from the third party until the visitor asks for it (privacy, performance).
 * - The iframe has a descriptive title; a direct link is always available as the fallback.
 * - If the frame cannot load (blocked by the provider or the network), the fallback link remains.
 */
export function AccessibleEmbed({ title, src, fallbackUrl, provider, height = 900, privacyNote, loadLabel = "Load the form on this page" }: {
  title: string; src: string; fallbackUrl: string; provider: string; height?: number; privacyNote: string; loadLabel?: string;
}) {
  const [state, setState] = useState<"idle" | "loading" | "ready">("idle");
  return (
    <div className="embed">
      <div className="embed__head">
        <h3>{title}</h3>
        <p className="small muted">{privacyNote}</p>
        <div className="btn-row">
          {state === "idle" && <button type="button" className="btn" onClick={() => setState("loading")}>{loadLabel}</button>}
          <a className={`btn ${state === "idle" ? "btn--secondary" : ""}`} href={fallbackUrl} target="_blank" rel="noopener noreferrer">
            Open on {provider}<Icon name="external" size={16} /><span className="visually-hidden"> (external site, opens in a new tab)</span>
          </a>
        </div>
        <p className="small" role="status" aria-live="polite">{state === "loading" ? `Loading ${title}…` : state === "ready" ? `${title} loaded below.` : ""}</p>
      </div>
      {state !== "idle" && (
        <div className="embed__frame">
          <iframe title={title} src={src} height={height} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" onLoad={() => setState("ready")} />
        </div>
      )}
      <p className="embed__foot">Content in this frame is provided by {provider}. If it does not appear, use the “Open on {provider}” button above.</p>
    </div>
  );
}
