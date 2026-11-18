"use client";
import { useState, useSyncExternalStore } from "react";
import { Icon } from "./Icon";

const noop = () => () => {};

/** Inline share actions for the current page: copy link, email, and the device share sheet when available. */
export function ShareControl({ title }: { title: string }) {
  const [status, setStatus] = useState("");
  const url = useSyncExternalStore(noop, () => window.location.href, () => "");
  const canShare = useSyncExternalStore(noop, () => typeof navigator.share === "function", () => false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("Link copied");
    } catch {
      setStatus("Copy failed. Select the address bar to copy the link.");
    }
    window.setTimeout(() => setStatus(""), 4000);
  }
  const mail = `mailto:?subject=${encodeURIComponent(`${title} | Council District 4`)}&body=${encodeURIComponent(url)}`;

  return (
    <div className="share" role="group" aria-label="Share this page">
      <span className="share__label">Share</span>
      <button type="button" className="btn btn--secondary btn--small" onClick={copy}><Icon name="link" size={16} />Copy link</button>
      <a className="btn btn--secondary btn--small" href={mail}><Icon name="mail" size={16} />Email</a>
      {canShare && (
        <button type="button" className="btn btn--secondary btn--small" onClick={() => navigator.share({ title, url: window.location.href }).catch(() => {})}>
          <Icon name="arrow" size={16} />More
        </button>
      )}
      <span className="share__status" role="status" aria-live="polite">{status}</span>
    </div>
  );
}
