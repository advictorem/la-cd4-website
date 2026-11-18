"use client";
import { useState, useSyncExternalStore } from "react";
import { Icon } from "./Icon";

const noop = () => () => {};

/** Share actions for the current page: icon buttons to copy the link or email it. */
export function ShareControl({ title }: { title: string }) {
  const [status, setStatus] = useState("");
  const url = useSyncExternalStore(noop, () => window.location.href, () => "");

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
      <span className="share__label">Share This Page</span>
      <div className="share__actions">
        <button type="button" className="share__btn" onClick={copy}><Icon name="link" size={20} /><span className="visually-hidden">Copy link</span></button>
        <a className="share__btn" href={mail}><Icon name="mail" size={20} /><span className="visually-hidden">Email</span></a>
      </div>
      <span className="share__status" role="status" aria-live="polite">{status}</span>
    </div>
  );
}
